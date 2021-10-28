const { Product, ProductCategory } = require("../models");
const { Op } = require("sequelize");

exports.getProductFromSearch = async (req, res, next) => {
	try {
		const searchResult = await Product.findAll({
			order: [["name", "ASC"]],
			attributes: ["id", "name", "coverPic"],
			where: {
				name: {
					[Op.substring]: req.params.keyword,
				},
			},
			include: [
				{
					model: ProductCategory,
					attributes: ["id", "name"],
				},
			],
		});

		// res.send({ searchResult });
		res.send({
			searchResult: searchResult.map((item) => ({
				id: item.id,
				name: item.name,
				coverPic: item.coverPic,
				category: item.ProductCategory,
			})),
		});
	} catch (err) {
		next(err);
	}
};
