const router = require("express").Router();
const passport = require("passport");
const marketplaceController = require("../controller/marketplaceController");

// passport.authenticate("jwt", { session: false })

router.get("/trending", marketplaceController.getTrendingCreators);
router.get("/all", marketplaceController.getAllProducts);

module.exports = router;
