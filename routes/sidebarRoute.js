const router = require("express").Router();
const passport = require("passport");
const sidebarController = require("../controller/sidebarController");
// passport.authenticate("jwt", { session: false })

router.get("/categories", sidebarController.getAllCategories);

module.exports = router;
