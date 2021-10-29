const router = require('express').Router();
const passport = require('passport');

const profileController = require('../controller/profileController');
const userController = require('../controller/userController');

router.get('/:id/allFollowing', passport.authenticate('jwt', { session: false }), userController.getAllUsersFollowing);
router.get(
  '/:id/allJoinedCommunities',
  passport.authenticate('jwt', { session: false }),
  userController.getAllJoinedCommunities,
);

module.exports = router;
