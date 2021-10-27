const express = require('express');
const productCategoryController = require('../controller/productCategoryController');
const passport = require('passport');
const router = express.Router();
router.get(
  '/',

  productCategoryController.getAllcategorys
);
// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   productCategoryController.getAllcategorys
// );
router.get('/:id', passport.authenticate('jwt', { session: false }), productCategoryController.getcategoryById);
router.post('/', passport.authenticate('jwt', { session: false }), productCategoryController.createCategory);
router.put('/:id', passport.authenticate('jwt', { session: false }), productCategoryController.updateCategory);
router.delete('/:id', passport.authenticate('jwt', { session: false }), productCategoryController.deleteCategory);

module.exports = router;
