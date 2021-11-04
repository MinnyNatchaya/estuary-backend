const router = require('express').Router();
const passport = require('passport');
const { upload } = require('../middleware/uploadFile');
const postController = require('../controller/postController');
const { response } = require('express');

router.get('/', passport.authenticate('jwt', { session: false }), postController.getAllPost);

router.get('/:id', passport.authenticate('jwt', { session: false }), postController.getPostById);
// router.get('/:id', postController.getPostById);
// router.get('/:id', (req, res) => {
//   console.log(req.params);
//   res.send('test post id');
// });

router.post('/', passport.authenticate('jwt', { session: false }), upload.array('sendPic'), postController.createPost);
// =============================================================================
router.put('/', passport.authenticate('jwt', { session: false }), upload.array('sendPic'), postController.updatePost);

//  =============================================================================
router.delete('/:id', passport.authenticate('jwt', { session: false }), postController.deletePost);

router.delete('/postPicture/:id', passport.authenticate('jwt', { session: false }), postController.deletePicture);

module.exports = router;
