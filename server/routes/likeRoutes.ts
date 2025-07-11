import { Router } from 'express';
import { likePost, unlikePost } from '../controllers/likeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Like a post
router.post('/posts/:postId/like', authenticateToken, likePost);
// Unlike a post
router.delete('/posts/:postId/like', authenticateToken, unlikePost);

export default router;
