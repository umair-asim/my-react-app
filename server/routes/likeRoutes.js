const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Like a post
router.post('/posts/:postId/like', authenticateToken, likeController.likePost);
// Unlike a post
router.delete('/posts/:postId/like', authenticateToken, likeController.unlikePost);

module.exports = router;
