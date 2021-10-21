const bcrypt = require('bcryptjs');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { User } = require('../models');
const uploadPromise = util.promisify(cloudinary.uploader.upload); // แปลงให้เป็น Promise new Promise reslove, reject

//====================getListById
exports.getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, email, password, birthDate, address, phone, typePic } = req.body;
    const hasedPassword = await bcrypt.hash(password, 12);

    // console.log('received', req.body);

    const result = await Promise.all(req.files.map(item => uploadPromise(item.path, { timeout: 600000 })));

    // console.dir(req.files);
    console.dir(result);

    const profilePic = !typePic.includes('PROFILE') ? undefined : result[0].secure_url;
    const bannerPic = !typePic.includes('BANNER') ? undefined : result[1] ? result[1].secure_url : result[0].secure_url;

    const [rows] = await User.update(
      {
        firstName: firstName === 'null' ? undefined : firstName,
        lastName: lastName === 'null' ? undefined : lastName,
        username,
        password: hasedPassword,
        email,
        birthDate: birthDate === 'null' ? undefined : birthDate,
        address: address === 'null' ? undefined : address,
        phone: phone === 'null' ? undefined : phone,
        profilePic,
        bannerPic
      },
      {
        where: { id, id: req.user.id }
      }
    );

    req.files.map(item => fs.unlinkSync(item.path));

    if (rows === 0) {
      return res.status(400).json({ message: 'fail to update profile' });
    }
    res.status(200).json({ message: 'success update profile' });
  } catch (err) {
    next(err);
  }
};
