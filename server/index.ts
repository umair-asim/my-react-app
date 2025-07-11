import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import userRoutes from './routes/userRoutes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import postRoutes from './routes/postRoutes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import commentRoutes from './routes/commentRoutes';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import likeRoutes from './routes/likeRoutes';

// Mount API routes
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);

// Test endpoint (optional, keep for DB test)
app.get('/api/test', async (_req: Request, res: Response) => {
  // If you still use pg pool for test, import it here, otherwise remove this block
  try {
    // const pool = require('./config/db');
    // const result = await pool.query('SELECT NOW()');
    // res.json({ success: true, time: result.rows[0].now });
    res.json({ success: true, time: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});