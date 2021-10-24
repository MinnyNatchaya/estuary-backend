const router = require('express').Router();
const passport = require('passport');
const { upload } = require('../middleware/uploadFile');
const postController = require('../controller/postController');

router.get('/', passport.authenticate('jwt', { session: false }), postController.getAllPost);
router.get('/:id', passport.authenticate('jwt', { session: false }), postController.getPostById);
router.post('/', passport.authenticate('jwt', { session: false }), upload.array('editPic'), postController.createPost);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.array('editPic'),
  postController.updatePost
);
router.delete('/:id', passport.authenticate('jwt', { session: false }), postController.deletePost);

module.exports = router;
