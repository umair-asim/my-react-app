const pool = require('../config/db');

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, postId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [userId, postId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
