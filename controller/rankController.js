const { User } = require('../models');
const { Like } = require('../models');
const { Product } = require('../models');
const { Op } = require('sequelize');

exports.getAllUserRankFilterByLike = async (req, res, next) => {
  try {
    const rank = await User.findAll({
      attributes: ['id', 'username', 'profilePic'],

      include: [
        {
          model: Product,
          attributes: ['id', 'createdAt'],

          include: {
            model: Like,
            attributes: ['productId', 'status']
          }
        }
      ],
      limit: 10
    });

    const result = JSON.parse(JSON.stringify(rank)).map(item => {
      let countLike = 0;
      item.Products.forEach(elem => {
        !elem.Likes
          ? (countLike += 0)
          : elem.Likes.forEach(e => {
              e.status ? (countLike += 1) : (countLike += 0);
            });
      });
      return { ...item, countLike };
    });

    const sortCount = (a, b) => {
      if (a.countLike > b.countLike) {
        return -1;
      }
      if (a.countLike < b.countLike) {
        return 1;
      }
      return 0;
    };

    res.json({ result: result.sort(sortCount) });
  } catch (err) {
    next(err);
  }
};

exports.getAllUserRankFilterByLikeCategoryId = async (req, res, next) => {
  try {
    console.dir(req.params.id);
    const rank = await User.findAll({
      attributes: ['id', 'username', 'profilePic'],

      include: [
        {
          where: { categoryId: req.params.id },
          model: Product,
          attributes: ['id', 'createdAt'],

          include: {
            model: Like,
            attributes: ['productId', 'status']
          }
        }
      ],
      limit: 10
    });

    const result = JSON.parse(JSON.stringify(rank)).map(item => {
      let countLike = 0;
      item.Products.forEach(elem => {
        !elem.Likes
          ? (countLike += 0)
          : elem.Likes.forEach(e => {
              e.status ? (countLike += 1) : (countLike += 0);
            });
      });
      return { ...item, countLike };
    });

    const sortCount = (a, b) => {
      if (a.countLike > b.countLike) {
        return -1;
      }
      if (a.countLike < b.countLike) {
        return 1;
      }
      return 0;
    };

    res.json({ result: result.sort(sortCount) });
  } catch (err) {
    next(err);
  }
};

exports.getAllUserFilterByDateProduct = async (req, res, next) => {
  try {
    const dateNow = new Date();
    const sevenDate = new Date(dateNow.getTime() - 7 * 24 * 60 * 60 * 1000);

    console.dir(req.params.id);
    const rank = await User.findAll({
      attributes: ['id', 'username', 'profilePic'],

      include: [
        {
          where: {
            categoryId: req.params.id,
            [Op.or]: [
              {
                createdAt: {
                  [Op.between]: [sevenDate, dateNow]
                }
              }
            ]
          },
          model: Product,
          attributes: ['id', 'createdAt'],

          include: {
            model: Like,
            attributes: ['productId', 'status']
          }
        }
      ],
      limit: 10
    });

    const result = JSON.parse(JSON.stringify(rank)).map(item => {
      let countLike = 0;
      item.Products.forEach(elem => {
        !elem.Likes
          ? (countLike += 0)
          : elem.Likes.forEach(e => {
              e.status ? (countLike += 1) : (countLike += 0);
            });
      });
      return { ...item, countLike };
    });

    const sortCount = (a, b) => {
      if (a.countLike > b.countLike) {
        return -1;
      }
      if (a.countLike < b.countLike) {
        return 1;
      }
      return 0;
    };

    res.json({ result: result.sort(sortCount) });
    // res.json({ rank });
  } catch (err) {
    next(err);
  }
};
