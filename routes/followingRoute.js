const router = require('express').Router();
const passport = require('passport');
const followingController = require('../controller/followingController');

router.get('/:id', passport.authenticate('jwt', { session: false }), followingController.getFollowingById);
router.post('/', passport.authenticate('jwt', { session: false }), followingController.createFollowing);
router.put('/:id', passport.authenticate('jwt', { session: false }), followingController.updateFollowing);
router.delete('/:id', passport.authenticate('jwt', { session: false }), followingController.deleteFollowing);

module.exports = router;
