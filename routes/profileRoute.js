const router = require("express").Router();
const passport = require("passport");

const profileController = require("../controller/profileController");

router.get("/:id", passport.authenticate("jwt", { session: false }), profileController.getProfileById);
router.put("/:id", passport.authenticate("jwt", { session: false }), profileController.updateProfile);

module.exports = router;
