const { Like } = require('../models');

exports.getLikeById = async (req, res, next) => {
  try {
    const like = await Like.findAll({ where: { userId: req.user.id } });
    res.json({ like });
  } catch (err) {
    next(err);
  }
};

exports.createLike = async (req, res, next) => {
  try {
    // const { productId, price, userId, wallet } = req.body;
    // // console.log(req.body);
    // await Purchased.create({
    //   productId: productId,
    //   userId: userId
    // });
    // const sum = +wallet - +price;
    // console.log(sum);
    // await User.update(
    //   {
    //     wallet: sum
    //   },
    //   {
    //     where: { id: req.user.id }
    //   }
    // );
    // res.status(200).json({ message: 'Purchased has been created' });
  } catch (err) {
    next(err);
  }
};
