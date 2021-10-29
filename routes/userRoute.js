const router = require('express').Router();
// const passport = require('passport');
const userController = require('../controller/userController');
// const { upload } = require('../middleware/uploadfile');

// router.get('/', authenticate('jwt', { session: false }), userController.getAllUser);
router.get('/', userController.getAllUser);

module.exports = router;
