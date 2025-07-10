const prisma = require('../config/prismaClient');

exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    await prisma.like.create({
      data: {
        user_id: userId,
        post_id: Number(postId),
      },
    }).catch(() => {}); // Ignore duplicate like error due to unique constraint
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  try {
    await prisma.like.deleteMany({
      where: {
        user_id: userId,
        post_id: Number(postId),
      },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
