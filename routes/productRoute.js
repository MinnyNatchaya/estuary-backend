const express = require("express");
const productController = require("../controller/productController");
const { upload } = require("../middleware/uploadFile");
const router = express.Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  productController.getAllProducts
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productController.getProductById
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("coverPic"),
  productController.createProduct
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("coverPic"),
  productController.updateProduct
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  productController.deleteProduct
);

module.exports = router;
