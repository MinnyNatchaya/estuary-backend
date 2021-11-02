const { Op } = require("sequelize");
const socket = require("socket.io");
const { Chatlog, ChatRoom, Community, User, Member, Notification } = require("../models");
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
			addUser(userId, socket.id);
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

			// console.log(JSON.stringify(chatMembers, null, 2));
			// console.log(JSON.stringify(chatLog, null, 2));
			// const modded = chatMembers.map((item) => item.User);
			// console.log("modded", JSON.stringify(modded, null, 2));
			console.log(`ROOMID`, roomId);
			// io.to(roomId).emit(
			io.in(roomId).emit(
				"fetched log",
				chatLog,
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
			socket.to(isGroupChat ? roomId : senderId + "p").emit("n", {
				id: recordedChat.id,
				createdAt: recordedChat.createdAt,
				senderId: recordedChat.senderId,
				content: recordedChat.content,
			});
		});

		///////////notification handling/////////////////////////
		//use io.to(socketId).emit to send to 1 client

		////////// fetching all notifications //////////////////

		// socket.on("new user", (userId) => {
		// 	console.log("socketid", socket.id);
		// 	// "newwwwwww";
		// 	addUser(userId, socket.id);
		// 	console.log("users", users);
		// 	console.log("/////");
		// 	console.log("/////");
		// 	console.log("/////");
		// 	console.log("/////");
		// 	console.log("/////");
		// });

		socket.on("fetch notification", async (userId) => {
			console.log("aaaaaaaaaaaaa");
			console.log("aaaaaaaaaaaaa");
			console.log("aaaaaaaaaaaaa");

			console.log(userId);

			const fetched = await findAllNotificationsService(userId);
			const userSocketId = getUser(userId).socketId;

			// Likes: item.Likes.filter((item) => item.status === true).length

			const unreadNotificationCount = JSON.parse(JSON.stringify(fetched)).filter((item) => !item.isViewed).length;
			console.log("COUNTTTTTT", unreadNotificationCount);
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
			}) => {
				console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb");
				console.log(users);

				const receiver = getUser(receiverId);

				console.log(
					senderId,
					senderName,
					receiverId,
					actionType,
					actionOn,
					columnToSave,
					columnToSaveId,
					content
				);

				const storedNotification = await Notification.create({
					//userId === receiverId
					userId: receiverId,
					[columnToSave]: columnToSaveId,
					actionType,
					actionOn,
					content: actionType === "commented" ? content : null,
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
		// socket.on('fetch all chatlog')

		///////////////////// disconnecte
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
