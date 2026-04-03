const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { sendBookingConfirmation, sendBookingCancelled } = require('../utils/emailService');

const updateFlightSeats = async (flight, seatType, requiredSeats, isBooking) => {
    if (!flight || !flight.seats) return;
    if (!flight.seats[seatType]) flight.seats[seatType] = {};
    
    const totalSeats = flight.seats[seatType].total || 50;
    const currentBooked = flight.seats[seatType].booked || 0;
    
    if (isBooking) {
    
        flight.seats[seatType].total = totalSeats;
        flight.seats[seatType].booked = currentBooked + requiredSeats;
    } else {
       
        flight.seats[seatType].booked = Math.max(0, currentBooked - requiredSeats);
    }
    await flight.save();
};

exports.createBooking = async (req, res) => {
    try {
        const { flightId, returnFlightId, contact, passengers, totalPrice, seatType } = req.body;
        const userId = req.userId;

        const flight = await Flight.findById(flightId);
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay đi' });

        let returnFlight = null;
        if (returnFlightId) {
            returnFlight = await Flight.findById(returnFlightId);
            if (!returnFlight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay về' });
        }

        const requiredSeats = passengers.filter(p => p.type !== 'Infant').length;

        const availableOutbound = (flight.seats?.[seatType]?.total || 50) - (flight.seats?.[seatType]?.booked || 0);
        if (availableOutbound < requiredSeats) {
            return res.status(400).json({ message: `Chuyến bay đi hạng ghế này chỉ còn ${availableOutbound} chỗ trống.` });
        }

        if (returnFlight) {
            const availableReturn = (returnFlight.seats?.[seatType]?.total || 50) - (returnFlight.seats?.[seatType]?.booked || 0);
            if (availableReturn < requiredSeats) {
                return res.status(400).json({ message: `Chuyến bay về hạng ghế này chỉ còn ${availableReturn} chỗ trống.` });
            }
        }

        const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiresAt = new Date(Date.now() + 15 * 60000);

        const flightDetails = { 
            name: flight.name, dep: flight.dep, arr: flight.arr, 
            depTime: flight.depTime, arrTime: flight.arrTime, 
            depDate: flight.depDate, aircraft: flight.aircraft, img: flight.img 
        };

        let returnFlightDetails = null;
        if (returnFlight) {
            returnFlightDetails = { 
                name: returnFlight.name, dep: returnFlight.dep, arr: returnFlight.arr, 
                depTime: returnFlight.depTime, arrTime: returnFlight.arrTime, 
                depDate: returnFlight.depDate, aircraft: returnFlight.aircraft, img: returnFlight.img 
            };
        }

        const booking = await Booking.create({
            user: userId,
            flight: flightId,
            flightDetails,
            returnFlight: returnFlightId || null,
            returnFlightDetails,
            pnr,
            seatType,
            contact,
            passengers,
            totalPrice,
            status: 'Pending',
            expiresAt
        });

        await updateFlightSeats(flight, seatType, requiredSeats, true);
        if (returnFlight) await updateFlightSeats(returnFlight, seatType, requiredSeats, true);

        res.status(201).json({ message: 'Giữ chỗ thành công', bookingId: booking._id, pnr, expiresAt });
    } catch (err) {
        console.error("Lỗi createBooking:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate('flight returnFlight');

        if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé' });
        if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Vé đã bị hủy do quá hạn thanh toán' });
        if (booking.status === 'Confirmed') return res.status(400).json({ message: 'Vé này đã được thanh toán' });

        if (new Date() > booking.expiresAt) {
            booking.status = 'Cancelled';
            await booking.save();
            
            const requiredSeats = booking.passengers.filter(p => p.type !== 'Infant').length;
            await updateFlightSeats(booking.flight, booking.seatType, requiredSeats, false);
            if (booking.returnFlight) await updateFlightSeats(booking.returnFlight, booking.seatType, requiredSeats, false);

            return res.status(400).json({ message: 'Thời gian giữ chỗ đã hết. Vé đã tự động hủy và hoàn trả ghế.' });
        }

        booking.status = 'Confirmed';
        await booking.save();
        await sendBookingConfirmation(booking);
        res.status(200).json({ message: 'Thanh toán thành công', pnr: booking.pnr });
    } catch (err) {
        console.error("Lỗi confirmPayment:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findOne({ _id: bookingId, user: req.userId }).populate('flight returnFlight');

        if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé' });
        if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Vé đã bị hủy trước đó' });

        booking.status = 'Cancelled';
        await booking.save();
        await sendBookingCancelled(booking);

        const requiredSeats = booking.passengers.filter(p => p.type !== 'Infant').length;
        await updateFlightSeats(booking.flight, booking.seatType, requiredSeats, false);
        if (booking.returnFlight) await updateFlightSeats(booking.returnFlight, booking.seatType, requiredSeats, false);

        res.status(200).json({ message: 'Hủy vé và hoàn ghế thành công' });
    } catch (err) {
        console.error("Lỗi cancelBooking:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

exports.getMyTrips = async (req, res) => {
    try {

        const bookings = await Booking.find({ user: req.userId })
            .populate('flight returnFlight')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        console.error("Lỗi getMyTrips:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};

exports.getBookingByPNR = async (req, res) => {
    try {
        let { pnr, lastName } = req.query;
        if (!pnr || !lastName) {
            return res.status(400).json({ message: 'Vui lòng cung cấp mã PNR và Họ (Last Name).' });
        }

        pnr = pnr.toUpperCase().trim();
        const searchName = lastName.trim();

        const booking = await Booking.findOne({ 
            pnr: pnr,
            $or: [
                { 'contact.lastName': new RegExp(searchName, 'i') },
                { 'contact.firstName': new RegExp(searchName, 'i') }, 
                { 'passengers.lastName': new RegExp(searchName, 'i') },
                { 'passengers.firstName': new RegExp(searchName, 'i') }
            ]
        }).populate('flight returnFlight');

        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đặt chỗ nào khớp với thông tin này.' });
        }

        res.status(200).json(booking);
    } catch (err) {
        console.error("Lỗi getBookingByPNR:", err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
};