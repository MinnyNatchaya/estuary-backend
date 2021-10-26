const { Op } = require("sequelize");
const socket = require("socket.io");
const { Chatlog, ChatRoom, Community, User } = require("../models");

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
		socket.on("join room", async (roomId, isGroupChat) => {
			socket.join(roomId);
			console.log("roomId", roomId);
			console.log(`isGroupChat`, isGroupChat);
			//get chatlog to emit back
			const chatLog = await Chatlog.findAll({
				where: isGroupChat
					? { communityId: roomId }
					: {
							communityId: null,
							[Op.or]: [
								{ senderId: roomId, receiverId },
								{ senderId: receiverId, receiverId: senderId },
							],
					  },
			});
			console.log(JSON.stringify(chatLog, null, 2));
			io.emit("fetched log: ", chatLog);
		});
	});
};
