const orderModel = require("../Models/orderModel");
const asyncHandler = require("express-async-handler");
const cartModel = require("../Models/cart");

const makeAnOrder = asyncHandler(async (req, res) => {
  const { address } = req.body;
  const user = req.user;

  if (!address) {
    return res.status(400).json({ message: "address is required" });
  }
  const userCart = await cartModel.findOne({ customer: user._id }).exec();
  if (!userCart) {
    return res.status(404).json({ message: "cart not found" });
  }
  if (userCart.products.length == 0) {
    return res.status(404).json({ message: "cart is empty" });
  }
  let totalPrice = Math.ceil(userCart.totalPrice + userCart.totalShipment);

  const newOrder = await orderModel.create({
    customer: user._id,
    products: userCart.products,
    totalPrice: totalPrice,
    status: "Pending",
    address,
  });
  userCart.products = [];
  userCart.totalPrice = 0;
  userCart.totalShipment = 0;
  await userCart.save();
  res.status(201).json(newOrder);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({ customer: req.user._id })
    .sort({ createdAt: -1 })
    .populate("products.product")
    .exec();
  if (!orders) {
    return res.status(404).json({ message: "orders not found" });
  }
  res.status(200).json(orders);
});
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find()
    .populate({
      path: "customer",
      select: "-password -token",
    })
    .populate("products.product")
    .sort({ createdAt: -1 })
    .exec();
  res.status(200).json(orders);
});
const changeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await orderModel.findOne({ _id: id }).exec();

  if (!order) {
    res.status(404);
    throw new Error("order not found");
  }
  order.status = status;
  await order.save();
  res.status(200).json(order);
});
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderModel.findOne({ _id: id }).exec();
  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }
  order.status = "Cancelled";
  await order.save();
  return res.status(200).json(order);
});
const orderStatistics = asyncHandler(async (req, res) => {
  orderModel
    .aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { month: 1 } },
    ])
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
const getMostSold = asyncHandler(async (req, res) => {
  const mostSoled = await orderModel.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        count: { $sum: "$products.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $addFields: {
        productDetail: {
          $arrayElemAt: ["$productDetail", 0],
        },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 12 },
  ]);
  const filteredMostSold = mostSoled.filter((item) => item.productDetail);
  res.status(200).json(filteredMostSold);
});
const mostSoldCategory = asyncHandler(async (req, res) => {
  const mostSoldCategories = await orderModel.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "products.product",
      },
    },
    {
      $addFields: {
        "products.product": {
          $arrayElemAt: ["$products.product", 0],
        },
      },
    },
    {
      $group: {
        _id: "$products.product.subCategory",
        soled: { $sum: "$products.quantity" },
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "_id",
        foreignField: "_id",
        as: "subCategoryDetail",
      },
    },
    {
      $addFields: {
        subCategoryDetail: {
          $arrayElemAt: ["$subCategoryDetail", 0],
        },
      },
    },
    { $project: { "subCategoryDetail.name": 1, soled: 1 } },
  ]);
  const filteredMostSold = mostSoldCategories.filter((item) => item._id);
  res.status(200).json(filteredMostSold);
});
const mostActiveUser = asyncHandler(async (req, res) => {
  const mostActiveCustomers = await orderModel.aggregate([
    {
      $group: {
        _id: "$customer",
        orders: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "_id",
        foreignField: "_id",
        as: "customerDetail",
      },
    },
    {
      $addFields: {
        customerDetail: {
          $arrayElemAt: ["$customerDetail", 0],
        },
      },
    },
    {
      $sort: {
        orders: -1,
      },
    },
  ]);
  res.status(200).json({ mostActiveCustomers });
});

module.exports = {
  makeAnOrder,
  getOrders,
  changeStatus,
  cancelOrder,
  getAllOrders,
  orderStatistics,
  getMostSold,
  mostActiveUser,
  mostSoldCategory,
};
