const { Product, User, ProductCategory, Like, Share, Following, sequelize } = require("../models");

exports.getTrendingCreators = async (req, res, next) => {
	try {
		const result = await User.findAll({
			attributes: ["id", "username", "profilePic"],
			// attributes: { include: [[sequelize.fn("COUNT", sequelize.col("Followers.follower_id")), "followerCOunt"]] },

			include: [
				{
					model: Product,
					attributes: ["id", "coverPic", "createdAt", "name"],
					// limit: 1,
					// order: [["createdAt", "DESC"]],
					// attributes: [[sequelize.fn("count", sequelize.col("Products.user_id")), "productCount"]],
				},
				{
					model: Following,
					as: "followed",
					attributes: ["id"],
					include: [
						{
							model: User,
							as: "follower",
							attributes: ["id", "username"],
						},
					],
				},
			],
			// group: ["User.id"],

			// order: [[sequelize.fn("count", sequelize.col("Products.user_id")), "DESC"]],
			order: [[Product, "createdAt", "DESC"]],
		});
		// const sortedUserWithProductByFollowerCount = result.filter((item, idx) => {
		// 	// const limited = item.filter(elem=>elem.Products.length !== 0)
		// 	return item.filter((elem) => elem.Products.length !== 0)[0];
		// });
		const sortedUserWithProductByFollowerCount = JSON.parse(JSON.stringify(result))
			.filter((item, idx) => item.Products.length !== 0)
			.map((item) => ({ ...item, Products: item.Products[0], followerCount: item.followed.length }));

		function sortByFollowerCount(a, b) {
			if (a.followerCount < b.followerCount) {
				return 1;
			}
			if (a.followerCount > b.followerCount) {
				return -1;
			}
			return 0;
		}

		res.send({ trendingCreators: sortedUserWithProductByFollowerCount.sort(sortByFollowerCount) });
	} catch (err) {
		next(err);
	}
};

exports.getAllProducts = async (req, res, next) => {
	try {
		const allProducts = await Product.findAll({
			attributes: { exclude: ["updatedAt", "externalLink", "userId"] },
			include: [
				{
					model: User,
					attributes: ["id", "username", "profilePic"],
				},
				{
					model: Like,
					attributes: ["id", "status", "userId", "productId"],
				},
				{
					model: Share,
					attributes: ["id", "userId", "productId"],
				},
			],
		});
		// res.send({ allProducts });
		const parsed = JSON.parse(JSON.stringify(allProducts));

		res.send({
			allProducts: parsed.map((item) => ({
				...item,
				usersLiked: item.Likes,
				Likes: item.Likes.filter((item) => item.status === true).length,
				Shares: item.Shares.length,
			})),
		});
	} catch (err) {
		next(err);
	}
};

exports.getUsersLikedByproductId = async (req, res, next) => {
	try {
		const { productId } = req.params;
		const usersLiked = await Like.findAll({
			where: { productId },
			attributes: ["id", "status", "userId", "productId"],
		});
		res.send({ usersLiked });
	} catch (err) {
		next(err);
	}
};
