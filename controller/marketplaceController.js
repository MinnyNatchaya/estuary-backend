const { Product, User, ProductCategory, Like, Share } = require("../models");

exports.getTrendingCreators = async (req, res, next) => {
	try {
		const result = await User.findAll({
			include: [
				{
					model: Product,
					attributes: ["id", "coverPic"],
					include: [
						{
							model: Like,
							attributes: ["id", "userId", "productId"],
						},
						{
							model: Share,
							attributes: ["id", "userId", "productId"],
						},
					],
				},
			],
		});
	} catch (err) {
		next(err);
	}
};

exports.getAllProducts = async (req, res, next) => {
	try {
		const allProducts = await Product.findAll({
			attributes: { exclude: ["updatedAt"] },
			include: [
				{
					model: User,
					attributes: ["id", "usernme", "profilePic"],
				},
				{
					model: Like,
					attributes: ["id", "userId", "productId"],
				},
				{
					model: Share,
					attributes: ["id", "userId", "productId"],
				},
			],
		});

		// res.send({
		//     allProducts: allProducts.map(item=>(
		//         {

		//         }
		//     ))
		// })
	} catch (err) {
		next(err);
	}
};
