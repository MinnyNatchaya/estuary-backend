const router = require("express").Router();
const passport = require("passport");

const chatController = require("../controller/chatController");

//senderId
router.get("/dm/:senderId/:receiverId", passport.authenticate("jwt", { session: false }), chatController.getDmLog);

module.exports = router;
