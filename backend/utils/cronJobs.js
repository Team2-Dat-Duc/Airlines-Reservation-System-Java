const cron = require('node-cron');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { sendPaymentReminder, sendBookingExpired, sendCheckInReminder } = require('./emailService');

const updateFlightSeats = async (flightId, seatType, requiredSeats, isBooking) => {
    const flight = await Flight.findById(flightId);
    if (!flight || !flight.seats || !flight.seats[seatType]) return;
    if (isBooking) flight.seats[seatType].booked += requiredSeats;
    else flight.seats[seatType].booked = Math.max(0, flight.seats[seatType].booked - requiredSeats);
    await flight.save();
};

exports.startCronJobs = () => {

    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const tenMinsAgo = new Date(now.getTime() - 10 * 60000); 
        
        const expiredBookings = await Booking.find({ status: 'Pending', expiresAt: { $lt: now } });
        for (const booking of expiredBookings) {
            booking.status = 'Cancelled';
            await booking.save();
           
            const requiredSeats = booking.passengers.filter(p => p.type !== 'Infant').length;
            await updateFlightSeats(booking.flight, booking.seatType, requiredSeats, false);
            if (booking.returnFlight) await updateFlightSeats(booking.returnFlight, booking.seatType, requiredSeats, false);
          
            await sendBookingExpired(booking);
        }

        const reminderBookings = await Booking.find({ status: 'Pending', createdAt: { $lt: tenMinsAgo }, reminderSent: { $ne: true } });
        for (const booking of reminderBookings) {
            booking.reminderSent = true;
            await booking.save();
            await sendPaymentReminder(booking);
        }
    });

    cron.schedule('0 0 * * *', async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        const upcomingBookings = await Booking.find({ status: 'Confirmed', 'flightDetails.depDate': tomorrowString });
        for (const booking of upcomingBookings) {
            await sendCheckInReminder(booking);
        }
    });
    
    console.log('Cron Jobs đã được kích hoạt!');
};