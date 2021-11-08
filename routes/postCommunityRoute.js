const router = require('express').Router();
const passport = require('passport');
const { upload } = require('../middleware/uploadFile');
const postCommunityController = require('../controller/postCommunityController');
const { response } = require('express');

// router.get('/', postCommunityController.getAllPostCommunity);

router.get('/:id', passport.authenticate('jwt', { session: false }), postCommunityController.getAllPostCommunityById);
router.get(
  '/communityName/:id',
  passport.authenticate('jwt', { session: false }),
  postCommunityController.getNameCommunityById,
);

module.exports = router;
