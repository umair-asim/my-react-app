import { Request, Response } from 'express';
import prisma from '../config/prismaClient';
import jwt from 'jsonwebtoken';

export const createPost = async (req: Request, res: Response) => {
  const { content } = req.body;
  // @ts-ignore
  let user_id = req.user.id;
  try {
    let photoUrl: string | null = null;
    if (req.file) {
      photoUrl = `/uploads/${(req.file as any).filename}`;
    }
    const post = await prisma.post.create({
      data: {
        photo: photoUrl,
        content,
        user_id,
      },
    });
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    let currentUserId: number | null = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        currentUserId = decoded.id;
      } catch (err) {}
    }
    const posts = await prisma.post.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { name: true, id: true } },
        likes: true,
        comments: true,
      },
    });
    const formattedPosts = posts.map((post: any) => {
      const like_count = post.likes.length;
      const comment_count = post.comments.length;
      const user_liked = currentUserId ? post.likes.some((like: any) => like.user_id === currentUserId) : false;
      return {
        id: post.id,
        photo: post.photo,
        content: post.content,
        user_id: post.user_id,
        created_at: post.created_at,
        user_name: post.user.name,
        like_count,
        comment_count,
        user_liked,
      };
    });
    res.json({ success: true, posts: formattedPosts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    await prisma.post.delete({ where: { id: Number(postId) } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const editPost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(postId) },
      data: { content },
    });
    res.json({ success: true, post });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
