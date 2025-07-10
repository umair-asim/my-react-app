const pool = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertRes = await pool.query(
      'INSERT INTO users (email, password, name, public_id) VALUES ($1, $2, $3, gen_random_uuid()) RETURNING id, name, email, public_id',
      [email, hashedPassword, name]
    );
    const user = insertRes.rows[0];
    const token = generateToken(user);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.signin = async (req, res) => {
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
    const token = generateToken(user);
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, public_id: user.public_id } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, name, email, public_id FROM users WHERE id = $1', [req.user.id]);
    if (userRes.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, user: userRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserByPublicId = async (req, res) => {
  try {
    const userRes = await pool.query('SELECT id, name, email, public_id FROM users WHERE public_id = $1', [req.params.publicId]);
    if (userRes.rows.length === 0) return res.status(404).json({ success: false, error: 'User not found.' });
    res.json({ success: true, user: userRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
