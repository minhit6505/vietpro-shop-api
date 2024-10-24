const CategoryModel = require("../../models/category");
const pagination = require("../../../libs/pagination");
const ProductModel = require("../../models/product");

exports.index = async (req, res) => {
  try {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const categories = await CategoryModel.find(query)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      status: "success",
      filters: {
        page,
        limit,
      },
      data: {
        docs: categories,
        pages: await pagination(CategoryModel, query, page, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findById(id);
    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.productsCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {};
    query.category_id = id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const products = await ProductModel.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      status: "success",
      filters: {
        page,
        limit,
      },
      data: {
        docs: products,
        pages: await pagination(ProductModel, query, page, limit),
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
