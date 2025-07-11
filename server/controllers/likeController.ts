import { Request, Response } from 'express';
import prisma from '../config/prismaClient';

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  try {
    await prisma.like.create({
      data: {
        user_id: userId,
        post_id: Number(postId),
      },
    }).catch(() => {});
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  // @ts-ignore
  const userId = req.user.id;
  try {
    await prisma.like.deleteMany({
      where: {
        user_id: userId,
        post_id: Number(postId),
      },
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
