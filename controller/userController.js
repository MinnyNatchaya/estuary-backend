const { User, Following, Member, Community } = require("../models");

// get all that this user is following
exports.getAllUsersFollowing = async (req, res, next) => {
	try {
		const { id } = req.params;
		const usersFolllowing = await Following.findAll({
			where: { followerId: id },
			include: [
				{
					model: User,
					attributes: ["id", "username", "profilePic"],
					as: "followed",
				},
			],
		});

		console.log(JSON.stringify(usersFolllowing, null, 2));

		res.send({
			followingUsers: usersFolllowing.map((item) => ({
				id: item.followed.id,
				name: item.followed.username,
				profilePic: item.followed.profilePic,
			})),
		});
	} catch (err) {
		next(err);
	}
};
exports.getAllJoinedCommunities = async (req, res, next) => {
	try {
		const { id } = req.params;
		const communitiesJoined = await Member.findAll({
			where: { userId: id },
			include: [
				{
					model: Community,
					attributes: ["id", "name", "communityPic"],
				},
			],
		});

		res.send({
			communitiesJoined: communitiesJoined.map((item) => ({
				id: item.Community.id,
				name: item.Community.name,
				profilePic: item.Community.communityPic,
			})),
		});
	} catch (err) {
		next(err);
	}
};

exports.getOwnedCommunity = async (req, res, next) => {
	try {
		const ownedCommunityId = await Member.findOne({
			where: { userId: req.params.id, role: "OWNER" },
			attributes: ["communityId"],
		});

		res.send({ ownedCommunityId: ownedCommunityId === null ? ownedCommunityId : ownedCommunityId.communityId });
	} catch (err) {
		next(err);
	}
};
