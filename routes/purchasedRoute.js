const router = require('express').Router();
const passport = require('passport');
const purchasedController = require('../controller/purchasedController');

router.get('/:id', passport.authenticate('jwt', { session: false }), purchasedController.getPurchasedById);
router.post('/', passport.authenticate('jwt', { session: false }), purchasedController.createPurchased);

module.exports = router;
