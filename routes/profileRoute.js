const router = require('express').Router();
const passport = require('passport');
const { upload } = require('../middleware/uploadFile');
const profileController = require('../controller/profileController');

router.get('/:id', passport.authenticate('jwt', { session: false }), profileController.getProfileById);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.array('editPic'),
  profileController.updateProfile,
);

module.exports = router;
