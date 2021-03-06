const util = require("util");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uploadPromise = util.promisify(cloudinary.uploader.upload);
const { Product } = require("../models");
const { User, Like } = require("../models");
const { ProductCategory } = require("../models");

exports.getAllProducts = async (req, res, next) => {
	try {
		const products = await Product.findAll({
			include: {
				model: ProductCategory,
				require: true,
			},
		});
		res.json({ products });
	} catch (err) {
		next(err);
	}
};

exports.getProductsByUserId = async (req, res, next) => {
	try {
		const products = await Product.findAll({
			where: { userId: req.params.id },
			order: [["id", "DESC"]],
			include: [
				{
					model: User,
					attributes: ["id", "username"],
				},
				{
					model: Like,
					attributes: ["id", "status", "userId", "productId"],
				},
			],
		});

		const parsed = JSON.parse(JSON.stringify(products));

		res.send({
			products: parsed.map((item) => ({
				...item,
				usersLiked: item.Likes,
				Likes: item.Likes.filter((item) => item.status === true).length,
			})),
		});
		// res.send({ parsed });
	} catch (err) {
		next(err);
	}
};

exports.getProductById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await Product.findOne({
			where: { id },

			include: [
				{
					model: User,
					attributes: ["username", "profilePic", "id", "wallet"],
				},
				{
					model: ProductCategory,

					attributes: ["name"],
				},
			],
		});
		res.json({ product });
	} catch (err) {
		next(err);
	}
};

exports.createProduct = async (req, res, next) => {
	try {
		console.log(req.user.id);

		const { coverPic, name, externalLink, description, price, hashtag, categoryId } = req.body;
		console.log(description);
		const result = await uploadPromise(req.file.path, { timeout: 2000000 });
		console.log("ssssssss");
		const product = await Product.create({
			name,
			externalLink,
			description,
			price,
			hashtag,
			coverPic: result.secure_url,
			categoryId: categoryId,
			userId: req.user.id,
		});

		res.status(201).json(product);
	} catch (err) {
		next(err);
	}
};

exports.updateProduct = async (req, res, next) => {
	console.log(req.body);

	try {
		const { id } = req.params;
		const { coverPic, name, externalLink, description, price, hashtag, categoryId } = req.body;
		//destructuring array index 0
		// console.log(req.file, 'yyyy');
		// const result = await uploadPromise(req.file.path, { timeout: 2000000 });

		let result = undefined;

		if (req.file) {
			result = await uploadPromise(req.file.path);
			fs.unlinkSync(req.file.path);
		}

		const [rows] = await Product.update(
			{
				coverPic: result === undefined ? undefined : result.secure_url,
				name,
				externalLink,
				description,
				price,
				hashtag,
				categoryId,
			},
			{
				where: {
					id,
				},
			}
		);
		if (rows === 0) {
			return res.status(400).json({ message: "fail to update product" });
		}

		res.status(200).json({ message: "success update product" });
	} catch (err) {
		next(err);
	}
};

exports.deleteProduct = async (req, res, next) => {
	try {
		const { id } = req.params;
		console.log(id);
		const rows = await Product.destroy({
			where: {
				id,
				userId: req.user.id,
			},
		});

		if (rows === 0) {
			return res.status(400).json({ message: "fail to delete product" });
		}
		res.status(204).json({ message: "sucess delete product" });
	} catch (err) {
		next(err);
	}
};
