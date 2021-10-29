// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.getAllUser = async (req, res, next) => {
  try {
    const user = await User.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    console.log(user);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
