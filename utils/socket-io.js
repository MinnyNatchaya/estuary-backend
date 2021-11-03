const { Op } = require("sequelize");
const socket = require("socket.io");
const { Chatlog, ChatRoom, Community, User, Member, Notification, sequelize } = require("../models");
const { findAllNotificationsService, findDestinationToPush } = require("../services/findAllNotificationsService");
const { findOneNotificationsService } = require("../services/findOneNotificationService");

exports.socketConnection = (server) => {
	const io = socket(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	let users = [];

	const addUser = (userId, socketId) => {
		!users.some((item) => item.userId === userId) && users.push({ userId, socketId });
	};
	const removeUser = (socketId) => {
		users = users.filter((item) => item.socketId !== socketId);
	};

	getUser = (userId) => {
		return users.find((item) => item.userId === userId);
	};

	//when user connects
	io.on("connection", (socket) => {
		// console.log("sockettttttt", socket);
		console.log("sockettttttt");

		// const parsed = JSON.parse(JSON.stringify(allProducts));

		socket.on("new user", (userId) => {
			console.log("socketid", socket.id);
			// "newwwwwww";
			addUser(+userId, socket.id);
			console.log("users", users);
			console.log("/////");
			console.log("/////");
			console.log("/////");
			console.log("/////");
			console.log("/////");
		});

		//first thing is to connect to chat room
		socket.on("join room", async (userId, roomId, isGroupChat) => {
			socket.join(roomId);
			// console.log("roomId", roomId);
			// console.log(`isGroupChat`, isGroupChat);
			//get chatlog to emit back

			const chatMembers = await Member.findAll({
				where: isGroupChat
					? { communityId: roomId }
					: {
							[Op.or]: [{ id: roomId }, { id: userId }],
					  },
				include: [
					{
						model: User,
						attributes: ["id", "username", "profilePic"],
					},
				],
				// attributes:['id','username']
			});

			const chatLog = await Chatlog.findAll({
				where: isGroupChat
					? { communityId: roomId }
					: {
							communityId: null,
							[Op.or]: [
								{ senderId: roomId, receiverId: userId },
								{ senderId: userId, receiverId: roomId },
							],
					  },
				attributes: ["id", "createdAt", "senderId", "content"],
			});
			const chatLogToSend = JSON.parse(JSON.stringify(chatLog)).map((item) => {
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

				return {
					...item,
					createdAt: modded,
				};
			});

			// console.log(JSON.stringify(chatMembers, null, 2));
			// console.log(JSON.stringify(chatLog, null, 2));
			// const modded = chatMembers.map((item) => item.User);
			// console.log("modded", JSON.stringify(modded, null, 2));
			console.log(`ROOMID`, roomId);
			// io.to(roomId).emit(
			io.in(roomId).emit(
				"fetched log",
				chatLogToSend,
				chatMembers.map((item) => item.User)
			);
		});
		//when a user sends a message
		socket.on("send message", async ({ content, senderId, roomId, isGroupChat }) => {
			// console.log(content, senderId, roomId, isGroupChat);
			const recordedChat = await Chatlog.create({
				content,
				senderId,
				communityId: isGroupChat ? roomId.slice(0, roomId.length - 1) : null,
				// receiverId: isGroupChat ? null : roomId.slice(0, roomId.length - 1),
				receiverId: isGroupChat ? null : roomId.slice(0, roomId.length - 1),
			});

			console.log("recorded chat", JSON.stringify(recordedChat, null, 2));
			// attributes: ["id", "createdAt", "senderId", "content"],

			console.log("isGroupChat", isGroupChat);
			console.log("senderId", senderId);
			// socket.broadcast.emit("n", {
			console.log("roomid", roomId);

			const date = new Date(recordedChat.createdAt);
			const modded =
				date.toLocaleString("en-GB").split(" ")[1].slice(0, 5) +
				" " +
				date.toLocaleString("en-GB", {
					weekday: "short",
					year: "numeric",
					month: "short",
					day: "numeric",
				});

			console.log("MODDED", modded);

			if (isGroupChat) {
				io.in(roomId).emit("n", {
					id: recordedChat.id,
					createdAt: modded,
					senderId: recordedChat.senderId,
					content: recordedChat.content,
				});
			} else {
				io.in(senderId + "p")
					.in(roomId)
					.emit("n", {
						id: recordedChat.id,
						createdAt: modded,
						senderId: recordedChat.senderId,
						content: recordedChat.content,
					});
			}

			const newChatlog = await Chatlog.findOne({
				where: {
					id: recordedChat.id,
				},
				attributes: ["id", "createdAt", "senderId", "content", "communityId", "receiverId", "isViewed"],
				include: [
					{
						model: User,
						as: "sender",
						attributes: ["id", "username", "profilePic"],
					},
					{
						model: Community,
						attributes: ["id", "name", "communityPic"],
					},
				],
			});

			const parsed = JSON.parse(JSON.stringify(newChatlog));

			const newLogDate = new Date(parsed.createdAt);
			const newLogModded =
				newLogDate.toLocaleString("en-GB").split(" ")[1].slice(0, 5) +
				" " +
				newLogDate.toLocaleString("en-GB", {
					weekday: "short",
					year: "numeric",
					month: "short",
					day: "numeric",
				});
			const toSend = {
				id: parsed.id,
				createdAt: newLogModded,
				content: parsed.content,
				chatRoomId: parsed.communityId === null ? parsed.senderId + "p" : parsed.communityId + "c",
				senderName: parsed.sender.username,
				senderPic: parsed.sender.profilePic,
				communityName: parsed.Community ? parsed.Community.name : null,
			};

			//emit condition
			if (isGroupChat) {
				console.log("group noti");
				console.log("group noti");
				console.log("group noti");
				console.log("group noti");
				const chatMembers = await Member.findAll({
					where: {
						communityId: roomId,
					},
					attributes: ["userId"],
				});

				chatMembers.forEach((item) => {
					console.log("currentUsers", users);
					const receiver = getUser(+item.userId);
					console.log(`item`, JSON.stringify(item, null, 2));
					console.log(`receiver`, receiver);
					if (receiver && receiver.userId !== senderId) {
						console.log(`receiverSocketId`, receiver.socketId);
						io.to(receiver.socketId).emit("new chat notification", toSend);
					}
				});
			} else {
				console.log("currentUsers", users);
				const receiver = getUser(+roomId.slice(0, -1));
				console.log(`receiver`, receiver);
				if (receiver) {
					io.to(receiver.socketId).emit("new chat notification", toSend);
				}
			}
		});

		///////////notification handling/////////////////////////
		//use io.to(socketId).emit to send to 1 client

		////////// fetching all notifications //////////////////

		socket.on("fetch notification", async (userId) => {
			console.log("aaaaaaaaaaaaa");
			console.log("aaaaaaaaaaaaa");
			console.log("aaaaaaaaaaaaa");

			console.log(userId);

			const fetched = await findAllNotificationsService(userId);
			const userSocketId = getUser(userId).socketId;

			// Likes: item.Likes.filter((item) => item.status === true).length

			const unreadNotificationCount = JSON.parse(JSON.stringify(fetched)).filter((item) => !item.isViewed).length;
			// console.log("COUNTTTTTT", unreadNotificationCount);
			// console.log(JSON.stringify(fetched, null, 2));
			io.to(userSocketId).emit("fetched notification", fetched === null ? [] : fetched, unreadNotificationCount);
		});

		//////////receiving new notification//////////////////////
		socket.on(
			"send notification",
			async ({
				senderId,
				senderName,
				receiverId,
				actionType,
				actionOn,
				columnToSave,
				columnToSaveId,
				content,
				newMemberId,
			}) => {
				console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb");
				console.log("users", users);

				const receiver = getUser(+receiverId);

				console.log(
					senderId,
					senderName,
					receiverId,
					actionType,
					actionOn,
					columnToSave,
					columnToSaveId,
					content,
					newMemberId
				);

				const storedNotification = await Notification.create({
					//userId === receiverId
					userId: receiverId,
					[columnToSave]: columnToSaveId,
					actionType,
					actionOn,
					content: actionType === "commented" ? content : null,
					newMemberId,
					// newMemberId: actionType === "joined" ? newMemberId : null,
				});

				const sender = await User.findOne({
					where: { id: senderId },
					attributes: ["id", "username", "profilePic"],
				});

				const newNotitfication = await findOneNotificationsService(storedNotification.id);

				// const parsedNotification = JSON.parse(JSON.stringify(storedNotification));

				console.log("receiver", receiver);
				console.log("storedNotification", JSON.stringify(newNotitfication));

				if (receiver) {
					console.log("emitting");
					io.to(receiver.socketId).emit("new notification", newNotitfication);
				}
			}
		);

		socket.on("notifications viewed", async (userId) => {
			console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
			console.log(userId);

			const notificationIdList = await Notification.findAll({
				where: {
					userId,
				},
				attributes: ["id"],
			});

			await Notification.update(
				{
					isViewed: true,
				},
				{
					where: {
						id: notificationIdList.map((item) => item.id),
					},
				}
			);
		});

		/////////////////// chatlog notification handling////////////////////////////////

		socket.on("fetch all chatlog", async (userId) => {
			const userSocketId = getUser(userId).socketId;
			const allJoinedCommunityIds = await Member.findAll({
				where: { userId },
				attributes: ["communityId"],
			});

			const allDMLog = await Chatlog.findAll({
				where: { receiverId: userId },
				attributes: ["id", "createdAt", "senderId", "content", "communityId", "receiverId", "isViewed"],
				include: [
					{
						model: User,
						as: "sender",
						attributes: ["id", "username", "profilePic"],
					},
				],
			});

			const allGroupChatLog = await Chatlog.findAll({
				where: {
					[Op.or]: JSON.parse(JSON.stringify(allJoinedCommunityIds)),
					senderId: {
						[Op.ne]: userId,
					},
				},
				attributes: ["id", "createdAt", "senderId", "content", "communityId", "receiverId", "isViewed"],
				include: [
					{
						model: User,
						as: "sender",
						attributes: ["id", "username", "profilePic"],
					},
					{
						model: Community,
						attributes: ["id", "name", "communityPic"],
					},
				],
			});

			// const rawAllGroupChatLog = await sequelize.query(`
			// `)

			const allChatlog = [...allDMLog, ...allGroupChatLog];

			console.log("chatchatchatchatchatchatchatchatchatchatchat");
			console.log("chatchatchatchatchatchatchatchatchatchatchat");
			console.log("chatchatchatchatchatchatchatchatchatchatchat");
			console.log(`allchat`, JSON.stringify(allChatlog, null, 2));

			const sortItemByTime = (a, b) => {
				if (a.createdAt > b.createdAt) {
					return -1;
				}
				if (a.createdAt > b.createdAt) {
					return 1;
				}
				return 0;
			};

			const logToSend = JSON.parse(JSON.stringify(allChatlog))
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
					return {
						id: item.id,
						createdAt: modded,
						content: item.content,
						chatRoomId: item.communityId === null ? item.senderId + "p" : item.communityId + "c",
						senderName: item.sender.username,
						senderPic: item.sender.profilePic,
						communityName: item.Community ? item.Community.name : null,
					};
				});

			// console.log("tosend", JSON.stringify(logToSend, null, 2));
			// console.log("COUNTTTTTT", JSON.parse(JSON.stringify(allChatlog)).filter((item) => !item.isViewed).length);

			io.to(userSocketId).emit(
				"fetched all chatlog",
				logToSend === null ? [] : logToSend,
				JSON.parse(JSON.stringify(allChatlog)).filter((item) => !item.isViewed).length
			);
		});

		socket.on("chat notifications viewed", async (userId) => {
			console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
			console.log(userId);

			const chatDMIdList = await Chatlog.findAll({
				where: {
					receiverId: userId,
				},
				attributes: ["id"],
			});

			const allJoinedCommunityIds = await Member.findAll({
				where: { userId },
				attributes: ["communityId"],
			});

			const groupChatIdList = await Chatlog.findAll({
				where: {
					[Op.or]: JSON.parse(JSON.stringify(allJoinedCommunityIds)),
					senderId: {
						[Op.ne]: userId,
					},
				},
				attributes: ["id"],
			});

			const allViewedChatlogsIds = [...chatDMIdList, ...groupChatIdList];
			console.log("all viewed ids", JSON.stringify(allViewedChatlogsIds, null, 2));

			await Chatlog.update(
				{
					isViewed: true,
				},
				{
					where: {
						id: allViewedChatlogsIds.map((item) => item.id),
					},
				}
			);
		});

		///////////////////// disconnectect///////////////////////////
		socket.on("disconnect", () => {
			removeUser(socket.id);
			console.log("user disconnected");
			console.log("remaining users", users);
		});
		// socket.on("leave-room", function () {
		// 	// socket.leave(roomId);

		// 	socket.disconnect(true);
		// 	console.log("left");
		// });
	});
};
