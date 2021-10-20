const bcrypt = require('bcryptjs');
// const util = require("util");
// const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
const { User } = require('../models');

//====================getListById
exports.getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password']
      },
      order: ['firstname', 'lastname', 'username', 'email', 'birthDate', 'address', 'phone', 'profilePic', 'bannerPic']
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email, password, birthDate, address, phone, profilePic, bannerPic } =
      req.body;

    const hasedPassword = await bcrypt.hash(password, 12);

    const [rows] = await User.update(
      {
        firstName,
        lastName,
        username,
        password: hasedPassword,
        email,
        birthDate,
        address,
        phone,
        profilePic,
        bannerPic
      },
      {
        where: { id }
      }
    );
    if (rows === 0) {
      return res.status(400).json({ message: 'fail to update profile' });
    }
    res.status(200).json({ message: 'success update profile' });
  } catch (err) {
    next(err);
  }
};
