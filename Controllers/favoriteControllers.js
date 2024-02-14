const favoriteModel = require("../Models/favoritesModel");
const asyncHandler = require("express-async-handler");
const findItem = require("../reusableFunctions/findItem");
const productModel = require("../Models/productModel");
const addFavorite = asyncHandler(async (req, res) => {
  const user = req.user;
  const { product } = req.body;
  if (!product) {
    res.send("400");
    throw new Error("product is required");
  }
  const favorite = await favoriteModel.findOne({ customer: user._id }).exec();
  const { data: findProduct, statusCode: findProductCode } = await findItem(
    product,
    productModel
  );
  if (findProductCode === 404) {
    return res.send("404").json({ message: "product not found" });
  }
  if (!favorite) {
    await favoriteModel.create({
      customer: user._id,
      products: [product],
    });
    res.status(201).json(findProduct);
  } else {
    if (favorite.products.includes(product)) {
      res.send("400");
      throw new Error("product already exist");
    }
    favorite.products.push(product);
    await favorite.save();
  }
  res.status(201).json(findProduct);
});
const getCustomerFavorites = asyncHandler(async (req, res) => {
  const user = req.user;
  const favorites = await favoriteModel
    .findOne({ customer: user._id })
    .populate("products")
    .exec();
  if (favorites) {
    res.status(200).json(favorites);
  } else {
    return res.json([]);
  }
});
const getAllFavorites = asyncHandler(async (req, res) => {
  const result = await favoriteModel.aggregate([
    { $unwind: "$product" },

    {
      $group: {
        _id: "$product",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "product",
        localField: "_id",
        foreignField: "_id",
        as: "productInfo",
      },
    },
  ]);
  return result;
});
const deleFavorite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const favorite = await favoriteModel.findOne({ customer: user._id }).exec();
  if (!favorite) {
    res.sendStatus(404);
    throw new Error("favorite not found");
  }
  const findProductIndex = favorite.products.findIndex(
    (item) => item._id == id
  );
  if (findProductIndex < 0) {
    res.status(404);
    throw new Error("product not found");
  }
  favorite.products.splice(findProductIndex, 1);
  await favorite.save();
  res.sendStatus(204);
});
module.exports = {
  addFavorite,
  getCustomerFavorites,
  getAllFavorites,
  deleFavorite,
};
