const bcrypt = require('bcryptjs');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Post } = require('../models');
const { Comment } = require('../models');
const { PostPicture } = require('../models');
const { User } = require('../models');
const { Member } = require('../models');
const { Community } = require('../models');
const uploadPromise = util.promisify(cloudinary.uploader.upload); // แปลงให้เป็น Promise new Promise reslove, reject
const destroyPromise = util.promisify(cloudinary.uploader.destroy);

// exports.getPostById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const post = await Post.findOne({
//       where: { id },

//       include: [
//         {
//           model: User,
//           attributes: {
//             exclude: ['password'],
//           },
//         },
//         {
//           model: PostPicture,
//         },
//       ],
//       order: [['createdAt', 'DESC']],
//     });

//     res.status(201).json({ post });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getAllPostCommunityById = async (req, res, next) => {
  try {
    //   ดึงข้อมูล Post ทั้งหมด ออกมาโชว์ที่ส่ง Community id มาเช็ค

    // const { communityId } = req.params;

    // console.log('************************');
    // console.log(req.params);
    const postCommunity = await Post.findAll({
      // เรียงลำดับ
      order: [['createdAt', 'DESC']],
      // เลือกCommunity ที่ตรงกัน
      where: {
        communityId: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          model: PostPicture,
        },
        {
          model: Community,
        },
      ],
    });

    // =========== ส่ง response
    res.json({ postCommunity });
  } catch (err) {
    next(err);
  }
};

exports.getNameCommunityById = async (req, res, next) => {
  try {
    const communityName = await Community.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['name'],
    });
    res.json({ communityName });
  } catch (err) {
    next(err);
  }
};
