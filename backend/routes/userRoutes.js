const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

router.get('/passengers', authMiddleware, userController.getSavedPassengers);
router.post('/passengers', authMiddleware, userController.addSavedPassenger);
router.delete('/passengers/:id', authMiddleware, userController.deleteSavedPassenger);

module.exports = router;