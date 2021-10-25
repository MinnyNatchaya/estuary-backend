const express = require("express");
const productController = require("../controller/productController");
const { upload } = require("../middleware/uploadFile");
const router = express.Router();

router.get("/", authenticate, productController.getAllProducts);
router.get("/:id", authenticate, productController.getProductById);
router.post(
  "/",
  authenticate,
  upload.single("coverPic"),
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  upload.single("coverPic"),
  productController.updateProduct
);
router.delete("/:id", authenticate, productController.deleteProduct);
