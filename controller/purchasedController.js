const { Purchased } = require('../models');
const { User } = require('../models');

exports.getAllPurchasedByUserLogin = async (req, res, next) => {
  try {
    const purchased = await Purchased.findAll({ where: { userId: req.user.id } });
    res.json({ purchased });
  } catch (err) {
    next(err);
  }
};

exports.createPurchased = async (req, res, next) => {
  try {
    const { productId, price, userId, wallet } = req.body;
    console.log(req.body);

    await Purchased.create({
      productId: productId,
      userId: userId
    });

    await User.update({
      wallet: +wallet - +price
    });

    res.status(200).json({ message: 'Purchased has been created' });
  } catch (err) {
    next(err);
  }
};
