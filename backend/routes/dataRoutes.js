const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/flights', dataController.getFlights);
router.get('/blog-posts', dataController.getBlogPosts);
router.get('/featured-destinations', dataController.getDestinations);
router.get('/airports', dataController.getAirports);

module.exports = router;