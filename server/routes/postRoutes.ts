import { Router } from 'express';
import { createPost, getAllPosts, deletePost, editPost } from '../controllers/postController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkPostOwnership } from '../middleware/ownershipMiddleware';
import upload from '../middleware/upload';

const router = Router();

// Create post
router.post('/', authenticateToken, upload.single('photo'), createPost);
// Get all posts
router.get('/', getAllPosts);
// Delete post
router.delete('/:postId', authenticateToken, checkPostOwnership, deletePost);
// Edit post
router.put('/:postId', authenticateToken, checkPostOwnership, editPost);

export default router;
