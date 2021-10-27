const { Op } = require("sequelize");
const socket = require("socket.io");
const { Chatlog, ChatRoom, Community, User, Member } = require("../models");

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

	//when user connects
	io.on("connection", (socket) => {
		// console.log("sockettttttt", socket);
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

			// const chatLog = await Chatlog.findAll({
			// 	where: isGroupChat
			// 		? { communityId: roomId }
			// 		: {
			// 				communityId: null,
			// 				[Op.or]: [
			// 					{ senderId: roomId, receiverId: senderId },
			// 					{ senderId: senderId, receiverId: roomId },
			// 				],
			// 		  },
			// 	attributes: ["id", "createdAt", "senderId", "content"],
			// });
			// console.log("recorded chat", JSON.stringify(chatLog, null, 2));

			// socket.broadcast.emit("n", chatLog);
		});

		socket.on("leave-room", function () {
			// socket.leave(roomId);

			socket.disconnect(true);
			console.log("left");
		});
	});
};
