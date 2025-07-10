const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.get('/me', authenticateToken, userController.getMe);
router.get('/users/:publicId', userController.getUserByPublicId);

module.exports = router;
