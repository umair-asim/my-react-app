const pool = require('../config/db');

exports.getComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const commentsRes = await pool.query(
      `SELECT comments.*, users.name as user_name FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1 ORDER BY comments.created_at ASC`,
      [postId]
    );
    res.json({ success: true, comments: commentsRes.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { postId } = req.params;
  const { comment_text } = req.body;
  const userId = req.user.id;
  if (!comment_text) return res.status(400).json({ success: false, error: 'Comment text required.' });
  try {
    const insertRes = await pool.query(
      'INSERT INTO comments (post_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *',
      [postId, userId, comment_text]
    );
    const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
    const comment = insertRes.rows[0];
    comment.user_name = userRes.rows[0].name;
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.editComment = async (req, res) => {
  const { commentId } = req.params;
  const { comment_text } = req.body;
  if (!comment_text) return res.status(400).json({ success: false, error: 'Comment text required.' });
  try {
    const updateRes = await pool.query('UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *', [comment_text, commentId]);
    res.json({ success: true, comment: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
