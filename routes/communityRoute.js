const router = require("express").Router();
const passport = require("passport");
const { upload } = require("../middleware/uploadFile");
const communityController = require("../controller/communityController");

router.post(
	"/create",
	passport.authenticate("jwt", { session: false }),
	upload.single("cloudinput"),
	communityController.createCommunity
);
router.get("/:id", passport.authenticate("jwt", { session: false }), communityController.getCommunityById);
router.get(
	"/:communityId/allMember",
	passport.authenticate("jwt", { session: false }),
	communityController.getAllMemberByCOmmunityId
);
router.get(
	"/isMember/:browserUserId/:communityId",
	passport.authenticate("jwt", { session: false }),
	communityController.getIsCommunityMemberById
);
router.post("/:id/join", passport.authenticate("jwt", { session: false }), communityController.createMember);
router.put("/:id/update", passport.authenticate("jwt", { session: false }), communityController.updateMember);

module.exports = router;
