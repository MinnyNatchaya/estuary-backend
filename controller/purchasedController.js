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
    const { productId, price, userId, wallet } = req.body;
    // console.log(req.body);

    await Purchased.create({
      productId: productId,
      userId: userId
    });

    const sum = +wallet - +price;
    console.log(sum);
    await User.update(
      {
        wallet: sum
      },
      {
        where: { id: req.user.id }
      }
    );

    res.status(200).json({ message: 'Purchased has been created' });
  } catch (err) {
    next(err);
  }
};
