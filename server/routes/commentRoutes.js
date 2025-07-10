const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkCommentOwnershipOrPostOwner } = require('../middleware/ownershipMiddleware');

// Get comments for a post
router.get('/posts/:postId/comments', commentController.getComments);
// Add a comment to a post
router.post('/posts/:postId/comments', authenticateToken, commentController.addComment);
// Edit a comment
router.put('/comments/:commentId', authenticateToken, checkCommentOwnershipOrPostOwner, commentController.editComment);
// Delete a comment
router.delete('/comments/:commentId', authenticateToken, checkCommentOwnershipOrPostOwner, commentController.deleteComment);

module.exports = router;
