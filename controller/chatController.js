const { User, Following, Member, Community, Chatlog } = require("../models");
const { Op } = require("sequelize");

// exports.getAllUsersFollowing = async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const usersFolllowing = await Following.findAll({
// 			where: { followerId: id },
// 			include: [
// 				{
// 					model: User,
// 					attributes: ["id", "username", "profilePic"],
// 					as: "followed",
// 				},
// 			],
// 		});

// 		res.send({
// 			followingUsers: usersFolllowing.map((item) => ({
// 				id: item.followed.id,
// 				name: item.followed.username,
// 				profilePic: item.followed.profilePic,
// 			})),
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// };
exports.getDmLog = async (req, res, next) => {
	try {
		const { senderId, receiverId } = req.params;
		const dmLog = await Chatlog.findAll({
			where: {
				[Op.or]: [
					{ senderId, receiverId },
					{ senderId: receiverId, receiverId: senderId },
				],
			},
		});
		res.send({ dmLog });
	} catch (err) {
		next(err);
	}
};
