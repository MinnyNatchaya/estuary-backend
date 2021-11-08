const bcrypt = require('bcryptjs');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Post } = require('../models');
const { Comment } = require('../models');
const { PostPicture } = require('../models');
const { User } = require('../models');

const uploadPromise = util.promisify(cloudinary.uploader.upload); // แปลงให้เป็น Promise new Promise reslove, reject
const destroyPromise = util.promisify(cloudinary.uploader.destroy);

exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id },

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
      ],
      order: [['createdAt', 'DESC']],
    });

    // res.json({ post });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const post = await Post.findAll({
      where: {
        communityId: null,
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
      ],

      order: [['createdAt', 'DESC']],
    });
    // =========== ส่ง response
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

// exports.getPostById = async (req, res, next) => {
//   try {
//   } catch (err) {
//     next(err);
//   }
// };

// =========================================================================
exports.createPost = async (req, res, next) => {
  try {
    //===================== ตัวรับข้อมูลมาจาก front end
    const { userId, content, communityId } = req.body;

    // console.log(userId);

    //===================== ตัวสร้างข้อมูลลงตาราง ใช้คำสั่ง sequirelize สร้างข้อมูลในตางราง post
    const post = await Post.create({
      userId,
      content,
      communityId: communityId ? communityId : null,
    });
    // res.status(201).json({ post });
    // console.log(JSON.stringify(post, null, 2));

    //======================== loop ขึ้น cloudinary
    const result = await Promise.all(req.files.map((item) => uploadPromise(item.path, { timeout: 6000000 })));
    // console.log(result);
    // console.log(result[0].secure_url);
    //======================== สร้างก้อนข้อมูลเพื่อเอาลงตาราง postPictures
    const createDataTopostPicture = await result.map((item) => ({
      postId: post.id,
      pic: item.secure_url,
    }));

    //=========================== เอาข้อมูลที่สร้างก้อนข้อมูลลงในตาราง postPictures

    const postPicture = await PostPicture.bulkCreate(createDataTopostPicture);

    res.status(201).json({ msg: 'success' });
  } catch (err) {
    next(err);
  }
};
// =========================================================================

// =========================================================================  upDatePost
exports.updatePost = async (req, res, next) => {
  try {
    //  รับ data มาจาก front end
    const { postId, content } = req.body;

    // console.log('tttttttttttttttttttttttt');
    //*** (***1)   upload รูปขึ้น cloudinary
    if (req.files) {
      // loop ขึ้น cloudinary

      // const postForPic = await PostPicture.findAll({
      //   where: { postId },
      // });

      // await Promise.all(
      //   postForPic.map((item) => destroyPromise(item.pic.split('/')[7].split('.')[0], { timeout: 6000000 })),
      // );

      // await PostPicture.destroy({
      //   where: {
      //     postId,
      //   },
      // });

      const result = await Promise.all(req.files.map((item) => uploadPromise(item.path, { timeout: 6000000 })));
      // console.log(result);
      // ลบรูปไฟล์ใน Folder
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync(req.files[i].path);
      }
      //*** //

      //*** (***4)   ปั้น data ใช้เก็บข้อมูลรูปภาพ + save รูปลง database
      const createDataTopostPicture = result.map((item) => ({
        postId,
        pic: item.secure_url,
      }));

      await PostPicture.bulkCreate(createDataTopostPicture);
      //*** //

      //*** //

      // update (***5) ข้อมูลตาราง Post
      const [rows] = await Post.update(
        { postId, content },
        {
          where: {
            id: postId,
          },
        },
      );
      if (rows === 0) {
        return res.status(400).json({ message: 'fail to update product' });
      }

      res.status(201).json({ msg: 'success update success' });
    }

    //*** //
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    // ลบข้อมูลทั้ง 2 ตาราง

    const { id } = req.params;

    const rowsPostPicture = await PostPicture.destroy({
      where: {
        postId: id,
      },
    });

    const rowsPost = await Post.destroy({
      where: {
        id,
      },
    });

    if (rowsPost === 0) {
      return res.status(400).json({ message: 'fail to delete Post and PostPicture ' });
    }
    res.status(204).json({ message: 'sucess delete Post and PostPicture' });
  } catch (err) {
    next(err);
  }
};

exports.deletePicture = async (req, res, next) => {
  console.log('test cancle');
  try {
    //  รับ data มาจาก front end
    const { id } = req.params;

    //*** (***1)   upload รูปขึ้น cloudinary

    // loop ขึ้น cloudinary

    const postForPic = await PostPicture.findOne({
      where: { id },
    });

    if (postForPic) {
      // console.log(JSON.stringify(postForPic, null, 2));
      await destroyPromise(postForPic.pic.split('/')[7].split('.')[0], { timeout: 6000000 });

      //*** (***3) ลบข้อมูลรูปภาพใน database
      await PostPicture.destroy({
        where: {
          id,
        },
      });
    }

    res.status(201).json({ msg: 'success update success' });

    //*** //
  } catch (err) {
    next(err);
  }
};
