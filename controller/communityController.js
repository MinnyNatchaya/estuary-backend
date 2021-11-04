const { Member, Community, User } = require("../models");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const util = require("util");
const uploadPromise = util.promisify(cloudinary.uploader.upload);
exports.createCommunity = async (req, res, next) => {
	try {
		const { name, description, userId } = req.body;
		console.log(req.body);
		console.log(req.file.path);

		const result = await uploadPromise(req.file.path, { timeout: 6000000 });

		const createdCommunity = await Community.create({
			name,
			communityPic: result.secure_url,
			description,
		});
		fs.unlinkSync(req.file.path);

		console.log("uploaded");

		await Member.create({
			userId,
			communityId: createdCommunity.id,
			status: true,
			role: "OWNER",
		});

		res.send({ createdCommunityId: createdCommunity.id });

		// res.send({ status: true });
	} catch (err) {
		next(err);
	}
};

exports.getCommunityById = async (req, res, next) => {
	try {
		const ownedCommunity = await Member.findAll({
			where: { userId: req.params.id, role: "OWNER" },
			attributes: ["communityId"],
		});

		res.send({ ownedCommunity });
	} catch (err) {
		next(err);
	}
};
exports.getIsCommunityMemberById = async (req, res, next) => {
	try {
		console.log(req.params);
		const joinedCommunity = await Member.findOne({
			// where: { userId: req.params.browserUserId, communityId: req.params.communityId, role: "MEMBER" },
			where: { userId: req.params.browserUserId, communityId: req.params.communityId, role: "MEMBER" },
		});

		console.log(JSON.stringify(joinedCommunity, null, 2));

		res.send({ isCommunityMember: joinedCommunity });
	} catch (err) {
		next(err);
	}
};

exports.createMember = async (req, res, next) => {
	try {
		const communityId = req.params.id;
		const { userId } = req.body;

		const newMember = await Member.create({
			userId,
			communityId,
			status: true,
			role: "MEMBER",
		});

		res.status(200).json({
			message: "Following has been created",
			communityId: newMember.communityId,
			newMemberId: newMember.id,
		});
	} catch (err) {
		next(err);
	}
};

exports.updateMember = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { isMember } = req.body;
		// console.log(id, isMember);
		const [rows] = await Member.update(
			{
				status: isMember,
			},
			{
				where: { id, followerId: req.user.id },
			}
		);
		if (rows === 0) {
			return res.status(400).json({ message: "Fail to update following" });
		}
		res.status(200).json({ message: "Following has been updated" });
	} catch (err) {
		next(err);
	}
};
