const { Purchased } = require('../models');
const { User } = require('../models');

exports.getPurchasedById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const purchased = await Purchased.findAll({ where: { productId: id } });
    res.json({ purchased });
  } catch (err) {
    next(err);
  }
};

exports.createPurchased = async (req, res, next) => {
  try {
    const { userSalerId, userSalerWallet, productId, price, userId, wallet } = req.body;

    await Purchased.create({
      productId: productId,
      userId: userId
    });

    const sum = +wallet - +price;
    await User.update(
      {
        wallet: sum
      },
      {
        where: { id: userId }
      }
    );

    const sumSaler = +userSalerWallet + +price;
    await User.update(
      {
        wallet: sumSaler
      },
      {
        where: { id: userSalerId }
      }
    );

    res.status(200).json({ message: 'Purchased has been created' });
  } catch (err) {
    next(err);
  }
};
