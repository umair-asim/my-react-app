require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON bodies
app.use('/uploads', express.static(__dirname + '/uploads'));

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });
// Add Post endpoint (protected)
app.post('/api/posts', authenticateToken, upload.single('photo'), async (req, res) => {
  const { content } = req.body;
  let user_id = req.user.id;
  try {
    let photoUrl = null;
    if (req.file) {
      photoUrl = `/uploads/${req.file.filename}`;
    }
    const insertRes = await pool.query(
      'INSERT INTO posts (photo, content, user_id) VALUES ($1, $2, $3) RETURNING *',
      [photoUrl, content, user_id]
    );
    res.json({ success: true, post: insertRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all posts endpoint
app.get('/api/posts', async (req, res) => {
  try {
    const postsRes = await pool.query(
      'SELECT posts.*, users.name as user_name FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC'
    );
    res.json({ success: true, posts: postsRes.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'my_pgdb',
  password: '123456789',
  port: 5432,
});

// For password hashing
const bcrypt = require('bcrypt');

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password required.' });
  }
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }
    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }
    // Issue JWT with public_id
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, public_id: user.public_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, public_id: user.public_id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }
  try {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user with generated public_id
    const insertRes = await pool.query(
      'INSERT INTO users (email, password, name, public_id) VALUES ($1, $2, $3, gen_random_uuid()) RETURNING id, name, email, public_id',
      [email, hashedPassword, name]
    );
    const user = insertRes.rows[0];
    // Issue JWT with public_id
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, public_id: user.public_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token provided.' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// Get current user from token
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, name, email, public_id FROM users WHERE id = $1', [req.user.id]);
    if (userRes.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, user: userRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user by public_id
app.get('/api/users/:publicId', async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, name, email, public_id FROM users WHERE public_id = $1', [req.params.publicId]);
    if (userRes.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, user: userRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});