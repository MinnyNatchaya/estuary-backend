const { Following } = require('../models');

exports.getFollowingById = async (req, res, next) => {
  try {
    const following = await Following.findAll({ where: { followerId: req.user.id } });
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
    // const { followedId } = req.body;

    const [rows] = await Following.update(
      {
        // followedId
        status: false
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
