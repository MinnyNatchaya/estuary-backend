const router = require('express').Router();
const passport = require('passport');
const likeController = require('../controller/likeController');

router.get('/product/:id', passport.authenticate('jwt', { session: false }), likeController.getLikeByProductId);
router.get('/post/:id', passport.authenticate('jwt', { session: false }), likeController.getLikeByPostId);
router.post('/', passport.authenticate('jwt', { session: false }), likeController.createLike);
router.put('/:id', passport.authenticate('jwt', { session: false }), likeController.updateLike);
router.delete('/:id', passport.authenticate('jwt', { session: false }), likeController.deleteLike);

module.exports = router;
