const router = require('express').Router();
const passport = require('passport');
const commentController = require('../controller/commentController');

// router.get('/', commentController.getAllComment);
router.get('/:id', passport.authenticate('jwt', { session: false }), commentController.getAllComment);

router.post('/', passport.authenticate('jwt', { session: false }), commentController.createComment);

// router.put('/:id', passport.authenticate('jwt', { session: false }), commentController.updateComment);
router.put('/:id', commentController.updateComment);

router.delete('/:id', passport.authenticate('jwt', { session: false }), commentController.deleteComment);

module.exports = router;
