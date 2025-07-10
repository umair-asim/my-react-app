const pool = require('../config/db');

exports.createPost = async (req, res) => {
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
};

exports.getAllPosts = async (req, res) => {
  const jwt = require('jsonwebtoken');
  try {
    let currentUserId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        currentUserId = decoded.id;
      } catch (err) {}
    }
    const postsRes = await pool.query(`
      SELECT 
        posts.id,
        posts.photo,
        posts.content,
        posts.user_id,
        posts.created_at,
        users.name as user_name,
        COUNT(DISTINCT likes.id) as like_count,
        COUNT(DISTINCT comments.id) as comment_count,
        COALESCE(
          BOOL_OR(likes.user_id = $1),
          false
        ) as user_liked
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      LEFT JOIN likes ON likes.post_id = posts.id
      LEFT JOIN comments ON comments.post_id = posts.id
      GROUP BY posts.id, users.name, users.id
      ORDER BY posts.created_at DESC
    `, [currentUserId]);
    res.json({ success: true, posts: postsRes.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.editPost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  try {
    const updateRes = await pool.query('UPDATE posts SET content = $1 WHERE id = $2 RETURNING *', [content, postId]);
    res.json({ success: true, post: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
