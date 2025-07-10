const pool = require('../config/db');

async function checkPostOwnership(req, res, next) {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    const postRes = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
    if (postRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }
    if (postRes.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function checkCommentOwnershipOrPostOwner(req, res, next) {
  const { commentId } = req.params;
  const userId = req.user.id;
  try {
    const commentRes = await pool.query('SELECT user_id, post_id FROM comments WHERE id = $1', [commentId]);
    if (commentRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Comment not found.' });
    }
    const comment = commentRes.rows[0];
    if (comment.user_id === userId) return next();
    // Check if user is post owner
    const postRes = await pool.query('SELECT user_id FROM posts WHERE id = $1', [comment.post_id]);
    if (postRes.rows.length && postRes.rows[0].user_id === userId) return next();
    return res.status(403).json({ success: false, error: 'Not authorized.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { checkPostOwnership, checkCommentOwnershipOrPostOwner };
