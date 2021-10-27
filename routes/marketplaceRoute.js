const router = require("express").Router();
const passport = require("passport");
const marketplaceController = require("../controller/marketplaceController");

// passport.authenticate("jwt", { session: false })

router.post("/trending", marketplaceController.getTrendingCreators);

module.exports = router;
