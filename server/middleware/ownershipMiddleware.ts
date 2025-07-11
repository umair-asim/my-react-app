import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prismaClient';

export async function checkPostOwnership(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const { postId } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  try {
    const post = await prisma.post.findUnique({ where: { id: Number(postId) } });
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }
    if (post.user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }
    next();
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function checkCommentOwnershipOrPostOwner(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const { commentId } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  try {
    const comment = await prisma.comment.findUnique({ where: { id: Number(commentId) } });
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found.' });
    }
    if (comment.user_id === userId) return next();
    // Check if user is post owner
    const post = await prisma.post.findUnique({ where: { id: comment.post_id } });
    if (post && post.user_id === userId) return next();
    return res.status(403).json({ success: false, error: 'Not authorized.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
