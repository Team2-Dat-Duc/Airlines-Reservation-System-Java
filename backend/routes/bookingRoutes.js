const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middlewares/authMiddleware');
router.get('/search', bookingController.getBookingByPNR);

router.post('/', authMiddleware, bookingController.createBooking);

router.post('/:bookingId/pay', authMiddleware, bookingController.confirmPayment);

router.put('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);

router.get('/my-trips', authMiddleware, bookingController.getMyTrips);
module.exports = router;