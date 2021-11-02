const { Like } = require('../models');

exports.getLikeByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const like = await Like.findAll({ where: { productId: id } });
    res.json({ like });
  } catch (err) {
    next(err);
  }
};

exports.getLikeByPostId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const like = await Like.findAll({ where: { postId: id } });
    res.json({ like });
  } catch (err) {
    next(err);
  }
};

exports.getLikeByCommentId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const like = await Like.findAll({ where: { commentId: id } });
    res.json({ like });
  } catch (err) {
    next(err);
  }
};

exports.createLike = async (req, res, next) => {
  try {
    const { postId, productId, commentId } = req.body;

    await Like.create({
      userId: req.user.id,
      postId: postId ? postId : undefined,
      commentId: commentId ? commentId : undefined,
      productId: productId ? productId : undefined,
      status: true,
    });

    res.status(200).json({ message: 'Like has been created' });
  } catch (err) {
    next(err);
  }
};

exports.updateLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isLiked } = req.body;
    console.log('id', id);
    console.log('is liked', isLiked);

    const [rows] = await Like.update(
      {
        status: isLiked,
      },
      {
        where: { id, userId: req.user.id },
      },
    );
    if (rows === 0) {
      return res.status(400).json({ message: 'Fail to update Like' });
    }
    res.status(200).json({ message: 'Like has been updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rows = await Like.destroy({
      where: { id, userId: req.user.id },
    });
    if (rows === 0) {
      return res.status(400).json({ message: 'Fail to delete Like' });
    }
    res.status(200).json({ message: 'Like has been created' });
  } catch (err) {
    next(err);
  }
};
