const { Following } = require('../models');

exports.getFollowedById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const following = await Following.findAll({ where: { followedId: id } });
    res.json({ following });
  } catch (err) {
    next(err);
  }
};

exports.getFollowerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const following = await Following.findAll({ where: { followerId: id } });
    res.json({ following });
  } catch (err) {
    next(err);
  }
};

exports.createFollowing = async (req, res, next) => {
  try {
    const { followedId } = req.body;

    await Following.create({
      followerId: req.user.id,
      followedId,
      status: true
    });

    res.status(200).json({ message: 'Following has been created' });
  } catch (err) {
    next(err);
  }
};

exports.updateFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isSubscribed } = req.body;

    const [rows] = await Following.update(
      {
        status: isSubscribed
      },
      {
        where: { id, followerId: req.user.id }
      }
    );
    if (rows === 0) {
      return res.status(400).json({ message: 'Fail to update following' });
    }
    res.status(200).json({ message: 'Following has been updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rows = await Following.destroy({
      where: { id, followerId: req.user.id }
    });
    if (rows === 0) {
      return res.status(400).json({ message: 'Fail to delete followingrder' });
    }
    res.status(200).json({ message: 'Following has been created' });
  } catch (err) {
    next(err);
  }
};
