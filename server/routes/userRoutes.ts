import { Router } from 'express';
import { signup, signin, getMe, getUserByPublicId } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router: Router = Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);

// User info routes
router.get('/me', authenticateToken, getMe);
router.get('/users/:publicId', getUserByPublicId);

export default router;
