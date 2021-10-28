const router = require("express").Router();
const passport = require("passport");
const likeController = require("../controller/likeController");
const headerController = require("../controller/headerController");

router.get("/search/product/:keyword", headerController.getProductFromSearch);

module.exports = router;
