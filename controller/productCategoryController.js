const { ProductCategory } = require("../models");

exports.getAllcategorys = async (req, res, next) => {
  try {
    const categorys = await ProductCategory.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: ["name"],
    });
    console.log(categorys);
    res.json({ categorys });
  } catch (err) {
    next(err);
  }
};

exports.getcategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.json({ category });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    console.log("Cate", req.body);
    const catagory = await ProductCategory.create({
      name,
    });
    res.status(201).json({ catagory: catagory });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const rows = await ProductCategory.update(
      {
        name,
      },
      {
        where: { id },
      }
    );
    if (rows[0] === 0)
      return res.status(400).json({ message: "update failed" });
    res.json({ message: "update completed" });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rows = await ProductCategory.destroy({
      where: { id },
    });
    if (rows === 0) return res.status(400).json({ message: "delete failed" });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
