const {
	Chatlog,
	Comment,
	Post,
	SubComment,
	ChatRoom,
	Like,
	Following,
	Community,
	User,
	Member,
	Notification,
} = require("../models");

exports.findOneNotificationsService = async (notificationId) => {
	try {
		const allNotifications = await Notification.findOne({
			where: {
				id: notificationId,
			},
			include: [
				{
					model: Comment,
					include: User,
					//
				},
				{
					model: Community,
					// include: User
					//
				},
				{
					model: Member,
					include: [{ model: User, attributes: ["username"] }],
				},
				{
					model: Following,
					include: [
						{
							model: User,
							as: "follower",
						},
					],
					//
				},
				{
					model: Post,
					include: User,
				},
				{
					model: SubComment,
					include: [User, Comment],
					//
				},
				{
					model: Like,
					include: User,
					//
				},
				//
			],
		});
		// console.log("all noti", JSON.stringify(allNotifications, null, 2));

		const parsed = JSON.parse(JSON.stringify(allNotifications));

		const date = new Date(parsed.createdAt);
		const modded =
			date.toLocaleString("en-GB").split(" ")[1].slice(0, 5) +
			" " +
			date.toLocaleString("en-GB", {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
			});

		switch (true) {
			/////////////comment///////////////
			case parsed.actionType === "commented" && parsed.actionOn === "post":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Comment.User.username,
					profilePic: parsed.Comment.User.profilePic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/post/${parsed.Comment.postId}`,
					createdAt: modded,
					content: parsed.Comment.content,
				};
			// break;
			case parsed.actionType === "commented" && parsed.actionOn === "product":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Comment.User.username,
					profilePic: parsed.Comment.User.profilePic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/post/${parsed.Comment.productId}`,
					createdAt: modded,
					content: parsed.Comment.content,
				};
			// break;
			///////////////////////////////////

			///////////like///////////////////
			case parsed.actionType === "liked" && parsed.actionOn === "post":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Like.User.username,
					profilePic: parsed.Like.User.profilePic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/post/${parsed.Like.postId}`,
					createdAt: modded,
					content: parsed.Like.content,
				};
			case parsed.actionType === "liked" && parsed.actionOn === "comment":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Like.User.username,
					profilePic: parsed.Like.User.profilePic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/post/${parsed.Like.commentId}`,
					createdAt: modded,
					content: parsed.Like.content,
				};
			case parsed.actionType === "liked" && parsed.actionOn === "product":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Like.User.username,
					profilePic: parsed.Like.User.profilePic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/product/${parsed.Like.productId}`,
					createdAt: modded,
					content: parsed.Like.content,
				};
			/////////////////////////////////

			//////////////following//////////////////////
			case parsed.actionType === "followed" && parsed.actionOn === "account":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Following.follower.username,
					profilePic: parsed.Following.follower.profilePic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/profile/${parsed.Following.follower.id}`,
					createdAt: modded,
					content: null,
				};
			// break;
			//////////////////////////////////////////

			///////////joining community/////////////
			case parsed.actionType === "joined" && parsed.actionOn === "community":
				return {
					id: parsed.id,
					isViewed: parsed.isViewed,
					senderName: parsed.Community.name,
					profilePic: parsed.Community.communityPic,
					actionOn: parsed.actionOn,
					actionType: parsed.actionType,
					params: `/profile/${parsed.Community.id}`,
					createdAt: modded,
					content: null,
					newMemberName: parsed.Member.User.username,
				};
			// break;
			//////////////////////////////////////

			default:
				return {
					error: "something went wrong",
				};
		}

		return parsed;

		// res.send({ allNotifications });
		// res.send({ parsed });
	} catch (err) {
		console.log(err);
	}
};
