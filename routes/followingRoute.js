const router = require('express').Router();
const passport = require('passport');
const followingController = require('../controller/followingController');

router.get('/followed/:id', passport.authenticate('jwt', { session: false }), followingController.getFollowedById);
router.get('/follower/:id', passport.authenticate('jwt', { session: false }), followingController.getFollowerById);
router.post('/', passport.authenticate('jwt', { session: false }), followingController.createFollowing);
router.put('/:id', passport.authenticate('jwt', { session: false }), followingController.updateFollowing);
router.delete('/:id', passport.authenticate('jwt', { session: false }), followingController.deleteFollowing);

module.exports = router;
