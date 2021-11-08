const { User } = require('../models');

let omise = require('omise')({
  publicKey: process.env.OMISE_PUBLIC_KEY,
  secretKey: process.env.OMISE_SECRET_KEY
});

exports.createCreditCard = async (req, res, next) => {
  const { username, amount, token, wallet } = req.body;

  console.log(req.body);
  try {
    //   username, amount, token
    // const customer = await omise.customers.create({
    //   username: req.user.username,
    //   //   description: 'John Doe (id: 30)',
    //   // card: token.id
    //   card: 'tokn_test_5pm8znfcw4yai3yxnx6'
    // });

    const charge = await omise.charges.create({
      amount: amount * 100,

      currency: 'thb',
      //   customer: customer.id,
      card: token,
      metadata: { userId: req.user.id }
    });

    if (charge.status === 'successful') {
      const [rows] = await User.update(
        {
          wallet: +amount + +wallet
        },
        {
          where: { id: req.user.id }
        }
      );

      if (rows === 0) {
        return res.status(400).json({ message: 'fail  top-up' });
      }
      res.status(200).json({ message: 'success top-up' });
    }

    // res.json({ charge });
    // console.log('charge------->', charge);
  } catch (err) {
    next(err);
  }
};
