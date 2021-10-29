const bcrypt = require('bcryptjs');
const util = require('util');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Comment } = require('../models');
const { User } = require('../models');
const { Post } = require('../models');
const uploadPromise = util.promisify(cloudinary.uploader.upload);

// exports.getIdComment = async (req, res, next) => {
//   //   console.log(req.body);
// };

exports.getAllComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findAll({
      where: {
        postId: id,
      },
      include: {
        model: User,
        attributes: ['firstName', 'lastName', 'profilePic'],
        required: true,
      },
      order: [['createdAt', 'DESC']],
    });

    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  console.log(req.body);
  try {
    const { userId, PostId, content } = req.body;

    await Comment.create({
      userId,
      postId: PostId,
      content,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  console.log('666666666666666666');

  try {
    const { id } = req.params;
    const { content } = req.body;

    const [rows] = await Comment.update({
      id,
      content,
    });

    if (rows === 0) {
      return res.status(400).json({ message: 'fail to update comment' });
    }
    res.status(201).json({ msg: 'success update success' });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Comment.destroy({
      where: {
        id,
      },
    });
  } catch (err) {
    next(err);
  }
};