const router = require('express').Router();
const passport = require('passport');
const rankController = require('../controller/rankController');

router.get('/like', passport.authenticate('jwt', { session: false }), rankController.getAllUserRankFilterByLike);
router.get(
  '/like/pastweek',
  passport.authenticate('jwt', { session: false }),
  rankController.getAllUserRankFilterByDate
);
router.get(
  '/like/category/:id',
  passport.authenticate('jwt', { session: false }),
  rankController.getAllUserRankFilterByLikeCategoryId
);
router.get(
  '/like/pastweek/category/:id',
  passport.authenticate('jwt', { session: false }),
  rankController.getAllUserFilterByDateProduct
);

module.exports = router;
