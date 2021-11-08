const router = require('express').Router();
const authController = require('../controller/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/login/google', authController.loginGoogle);

module.exports = router;
