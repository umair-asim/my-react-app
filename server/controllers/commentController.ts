import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { post_id: Number(postId) },
      orderBy: { created_at: 'asc' },
      include: { user: { select: { name: true } } },
    });
    // Add user_name to each comment for compatibility
    const formatted = comments.map((c: any) => ({ ...c, user_name: c.user.name }));
    res.json({ success: true, comments: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { comment_text } = req.body;
  // @ts-ignore
  const userId = req.user.id;
  if (!comment_text) return res.status(400).json({ success: false, error: 'Comment text required.' });
  try {
    const comment = await prisma.comment.create({
      data: {
        post_id: Number(postId),
        user_id: userId,
        comment_text,
      },
      include: { user: { select: { name: true } } },
    });
    (comment as any).user_name = comment.user.name;
    res.json({ success: true, comment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const editComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { comment_text } = req.body;
  if (!comment_text) return res.status(400).json({ success: false, error: 'Comment text required.' });
  try {
    const comment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: { comment_text },
    });
    res.json({ success: true, comment });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  try {
    await prisma.comment.delete({ where: { id: Number(commentId) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
