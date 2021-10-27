const { User } = require('../models');
const { Like } = require('../models');
const { Product } = require('../models');

exports.getAllUserRankFilterByLike = async (req, res, next) => {
  try {
    const rank = await User.findAll({
      attributes: ['id', 'username', 'profilePic'],

      include: [
        {
          model: Product,
          attributes: ['id', 'status', 'createdAt'],

          include: {
            model: Like,
            attributes: ['productId']
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

    const getNumberOfDays = (start, end) => {
      const date1 = new Date(start);
      const date2 = new Date(end);

      // One day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;

      // Calculating the time difference between two dates
      const diffInTime = date2.getTime() - date1.getTime();

      // Calculating the no. of days between two dates
      const diffInDays = Math.round(diffInTime / oneDay);

      return diffInDays;
    };

    const formatShortMonthShortYear = date => {
      return new Intl.DateTimeFormat('en-US').format(date);
    };

    const dateNow = formatShortMonthShortYear(Date.now());

    const result = JSON.parse(JSON.stringify(rank)).filter(item =>
      item.Products.filter(elem => {
        getNumberOfDays(formatShortMonthShortYear(new Date(elem.createdAt)), dateNow) <= 7;
        // console.log(getNumberOfDays(formatShortMonthShortYear(new Date(elem.createdAt)), dateNow));
      })
    );

    // const a = [
    //   { e: 1, r: [{ g: 2, f: 10 }] },
    //   { e: 5, r: [{ g: 2, f: 3 }] }
    // ];
    // const b = a.filter(item => item.r.filter(e => e.f > 7));
    // console.log(b);

    const result2 = JSON.parse(JSON.stringify(result)).map(item => {
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

    res.json({ result2: result2.sort(sortCount) });
  } catch (err) {
    next(err);
  }
};
