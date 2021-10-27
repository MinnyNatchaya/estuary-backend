const { ProductCategory } = require("../models");

exports.getAllCategories = async (req, res, next) => {
	try {
		const categories = await ProductCategory.findAll();
		res.send(categories);
	} catch (err) {
		next(err);
	}
};
