const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.use(authMiddleware, isAdmin);

router.get('/dashboard', adminController.getDashboardStats);

router.post('/flights', adminController.createFlight);
router.put('/flights/:id', adminController.updateFlight);
router.get('/flights', adminController.getAllFlights);
router.delete('/flights/:id', adminController.deleteFlight);

router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/cancel', adminController.forceCancelBooking);

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.toggleUserRole);

module.exports = router;