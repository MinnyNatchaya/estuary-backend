const router = require('express').Router();
const passport = require('passport');
const omiseController = require('../controller/omiseController');

router.post('/', passport.authenticate('jwt', { session: false }), omiseController.createCreditCard);

module.exports = router;
