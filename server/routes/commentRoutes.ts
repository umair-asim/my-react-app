import { Router } from 'express';
import { getComments, addComment, editComment, deleteComment } from '../controllers/commentController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkCommentOwnershipOrPostOwner } from '../middleware/ownershipMiddleware';

const router = Router();

// Get comments for a post
router.get('/posts/:postId/comments', getComments);
// Add a comment to a post
router.post('/posts/:postId/comments', authenticateToken, addComment);
// Edit a comment
router.put('/comments/:commentId', authenticateToken, checkCommentOwnershipOrPostOwner, editComment);
// Delete a comment
router.delete('/comments/:commentId', authenticateToken, checkCommentOwnershipOrPostOwner, deleteComment);

export default router;
