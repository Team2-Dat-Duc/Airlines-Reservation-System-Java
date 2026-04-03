const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const confirmedBookings = await Booking.find({ status: { $in: ['Confirmed', 'Completed'] } });
        const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        const totalBookings = await Booking.countDocuments();
        const totalFlights = await Flight.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).populate('flight user');

        res.status(200).json({ totalRevenue, totalBookings, totalFlights, totalUsers, recentBookings });
    } catch (err) { res.status(500).json({ message: 'Lỗi lấy thống kê', error: err.message }); }
};

exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find().sort({ createdAt: -1 });
        res.status(200).json(flights);
    } catch (err) { res.status(500).json({ message: 'Lỗi lấy chuyến bay', error: err.message }); }
};

exports.deleteFlight = async (req, res) => {
    try {
        await Flight.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Đã xóa chuyến bay thành công!' });
    } catch (err) { res.status(500).json({ message: 'Lỗi xóa chuyến bay', error: err.message }); }
};

exports.createFlight = async (req, res) => {
    try {
        const newFlight = await Flight.create(req.body);
        res.status(201).json(newFlight);
    } catch (err) { res.status(500).json({ message: 'Lỗi tạo chuyến bay', error: err.message }); }
};

exports.updateFlight = async (req, res) => {
    try {
        const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedFlight);
    } catch (err) { res.status(500).json({ message: 'Lỗi cập nhật chuyến bay', error: err.message }); }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('flight user').sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) { res.status(500).json({ message: 'Lỗi lấy đơn vé', error: err.message }); }
};

exports.forceCancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy vé' });
        booking.status = 'Cancelled';
        await booking.save();
        res.status(200).json({ message: 'Đã ép hủy vé thành công!' });
    } catch (err) { res.status(500).json({ message: 'Lỗi hủy vé', error: err.message }); }
};

exports.getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find().select('-password -passwordHash').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) { res.status(500).json({ message: 'Lỗi lấy danh sách khách hàng', error: err.message }); }
};

exports.toggleUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        
        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();
        res.status(200).json({ message: `Đã cấp quyền ${user.role.toUpperCase()} cho ${user.name}` });
    } catch (err) { res.status(500).json({ message: 'Lỗi đổi quyền', error: err.message }); }
};