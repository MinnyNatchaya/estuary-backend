const router = require('express').Router();
const passport = require('passport');
const likeController = require('../controller/likeController');

router.get('/:id', passport.authenticate('jwt', { session: false }), likeController.getLikeById);
router.post('/', passport.authenticate('jwt', { session: false }), likeController.createLike);

module.exports = router;
