const productModel = require("../Models/productModel");
const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../Models/subCategoryModel");
const search = asyncHandler(async (req, res) => {
  const { text, subCategory, specifications, product, price, sort, limit } =
    req.query;
  const queryObject = {};
  if (text) {
    const productList = await productModel.find({
      title: { $regex: text, $options: "i" },
    });
    if (productList.length > 0) {
      return res.status(201).json({ products: productList });
    } else {
      const productList = await productModel.find({
        description: { $regex: text, $options: "i" },
      });
      if (productList.length > 0) {
        return res.status(201).json({ products: productList });
      } else {
        return res.status(201).json([]);
      }
    }
  }
  if (subCategory) {
    const subCategoryId = await subCategoryModel
      .findOne({ name: subCategory })
      .exec();
    queryObject.subCategory = subCategoryId;
  }
  if (subCategory && specifications) {
    let searchSpics = specifications.split("==");

    queryObject[`specifications.${searchSpics[0]}`] = {
      $regex: searchSpics[1],
      $options: "i",
    };
  }
  if (product) {
    queryObject.title = { $regex: product, $options: "i" };
  }
  if (price) {
    const range = price.split(",");
    if (range.length == 2) {
      queryObject[`price.new`] = { $gte: +range[0], $lte: +range[1] };
    }
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    if (range.length == 1) {
      const regex = /\b(<|>|>=|=|<|<=)\b/g;
      const item = price.replace(regex, (match) => `-${operatorMap[match]}-`);
      const [field, operator, value] = item.split("-");
      queryObject[`price.new`] = { [operator]: +value };
    }
  }

  let results = productModel
    .find(queryObject)
    .populate("subCategory", { name: 1 });
  if (sort) {
    const sortList = sort.split(",").join(" ");
    results = results.sort(sortList);
  } else {
    results = results.sort({ createdAt: -1 });
  }
  if (limit) {
    results = results.limit(+limit);
  }
  const products = await results;

  res.status(200).json({ products, numOfResults: products.length });
});

module.exports = search;
