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

exports.findAllNotificationsService = async (userId) => {
	try {
		const allNotifications = await Notification.findAll({
			where: {
				userId,
			},
			include: [
				{
					model: Comment,
					include: User,
					//
				},
				{
					model: Community,
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

		const sortItemByTime = (a, b) => {
			if (a.createdAt > b.createdAt) {
				return -1;
			}
			if (a.createdAt > b.createdAt) {
				return 1;
			}
			return 0;
		};

		const parsed = JSON.parse(JSON.stringify(allNotifications))
			.sort(sortItemByTime)
			.map((item) => {
				const date = new Date(item.createdAt);
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
					case item.actionType === "commented" && item.actionOn === "post":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Comment.User.username,
							profilePic: item.Comment.User.profilePic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/post/${item.Comment.postId}`,
							createdAt: modded,
							content: item.Comment.content,
						};
					// break;
					case item.actionType === "commented" && item.actionOn === "product":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Comment.User.username,
							profilePic: item.Comment.User.profilePic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/post/${item.Comment.productId}`,
							createdAt: modded,
							content: item.Comment.content,
						};
					// break;
					///////////////////////////////////

					///////////like///////////////////
					case item.actionType === "liked" && item.actionOn === "post":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Like.User.username,
							profilePic: item.Like.User.profilePic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/post/${item.Like.postId}`,
							createdAt: modded,
							content: item.Like.content,
						};
					case item.actionType === "liked" && item.actionOn === "comment":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Like.User.username,
							profilePic: item.Like.User.profilePic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/post/${item.Like.commentId}`,
							createdAt: modded,
							content: item.Like.content,
						};
					case item.actionType === "liked" && item.actionOn === "product":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Like.User.username,
							profilePic: item.Like.User.profilePic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/product/${item.Like.productId}`,
							createdAt: modded,
							content: item.Like.content,
						};
					/////////////////////////////////

					//////////////following//////////////////////
					case item.actionType === "followed" && item.actionOn === "account":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Following.follower.username,
							profilePic: item.Following.follower.username.profilePic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/profile/${item.Following.follower.id}`,
							createdAt: modded,
							content: null,
						};
					// break;
					//////////////////////////////////////////

					///////////joining community/////////////
					case item.actionType === "joined" && item.actionOn === "community":
						return {
							id: item.id,
							isViewed: item.isViewed,
							senderName: item.Community.name,
							profilePic: item.Community.communityPic,
							actionOn: item.actionOn,
							actionType: item.actionType,
							params: `/profile/${item.Community.id}`,
							createdAt: modded,
							content: null,
							newMemberName: item.Member.User.username,
						};
					// break;
					//////////////////////////////////////

					default:
						return {
							error: "something went wrong",
						};
				}
			});

		return parsed;

		// res.send({ allNotifications });
		// res.send({ parsed });
	} catch (err) {
		console.log(err);
	}
};
