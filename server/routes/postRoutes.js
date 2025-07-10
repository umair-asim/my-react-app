const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkPostOwnership } = require('../middleware/ownershipMiddleware');
const upload = require('../middleware/upload');

// Create post
router.post('/', authenticateToken, upload.single('photo'), postController.createPost);
// Get all posts
router.get('/', postController.getAllPosts);
// Delete post
router.delete('/:postId', authenticateToken, checkPostOwnership, postController.deletePost);
// Edit post
router.put('/:postId', authenticateToken, checkPostOwnership, postController.editPost);

module.exports = router;
