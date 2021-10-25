const util = require("util");
const cloudinary = require("cloudinary").v2;
const Product = require("../models");
const ProductCategory = require("../models");

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

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    // 1. รับ req ที่ส่งเข้ามาทาง  body
    console.log(req.body);
    // destructuring obj data จาก req ในส่วน body
    const {
      coverPic,
      name,
      externalLink,
      description,
      price,
      hashtag,
      categoryId,
    } = req.body;
    //ใช้คำสั่ง squelize สร้างสินค้าลงใน DB
    const result = await uploadPromise(req.file.path, { timeout: 2000000 });

    const product = await Product.create({
      name,
      externalLink,
      description,
      price,
      hashtag,
      coverPic: result.secure_url,

      categoryId: categoryId,
    });
    console.log(picurl);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      coverPic,
      name,
      externalLink,
      description,
      price,
      hashtag,
      categoryId,
    } = req.body;
    //destructuring array index 0
    const [rows] = await Product.update(
      {
        coverPic,
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
    const rows = await Product.destroy({
      where: {
        id,
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
