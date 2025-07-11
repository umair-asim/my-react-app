import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided.' });
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid token.' });
    // @ts-ignore
    req.user = user;
    next();
  });
}
