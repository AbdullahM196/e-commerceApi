const cartModel = require("../Models/cart");
const asyncHandler = require("express-async-handler");
const productModel = require("../Models/productModel");

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let { product, quantity } = req.body;
  if (!product) {
    return res.status(400).json({ message: "Product is required" });
  }

  const findProduct = await productModel.findOne({ _id: product }).exec();

  if (!findProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!quantity) {
    quantity = 1;
  }
  if (quantity && quantity > findProduct.quantity) {
    return res.status(400).json({ message: "Quantity is not available" });
  }

  const findCart = await cartModel
    .findOne({ customer: userId })
    .populate("products")
    .exec();

  const productPrice = findProduct.price.new * quantity;
  const totalShipment = findProduct.price.shipping * quantity;
  if (!findCart) {
    await cartModel.create({
      customer: userId,
      products: [{ product, quantity, price: productPrice }],
      totalPrice: productPrice,
      totalShipment: totalShipment,
    });
    return res.status(201).json(findProduct);
  }

  const findProductIndex = findCart.products.findIndex(
    (item) => item.product == product
  );

  if (findProductIndex >= 0) {
    const newQuantity = findCart.products[findProductIndex].quantity + quantity;
    if (newQuantity <= findProduct.quantity) {
      findCart.products[findProductIndex].quantity = newQuantity;
      findCart.products[findProductIndex].price += productPrice;
      findCart.totalPrice += productPrice;
      findCart.totalShipment += totalShipment;
      await findCart.save();
      return res.status(201).json(findProduct);
    } else {
      return res.status(400).json({ message: "Quantity is not available" });
    }
  } else {
    findCart.products.push({ product, quantity, price: productPrice });
    findCart.totalPrice += productPrice;
    findCart.totalShipment += totalShipment;
    await findCart.save();
    return res.status(201).json(findProduct);
  }
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  let cart = await cartModel
    .findOne({ customer: userId })
    .populate("products.product")
    .exec();
  if (cart) {
    cart.products = cart.products.filter((product) => product.product !== null);
    cart = await cart.populate("products.product.subCategory", { name: 1 });
    res.status(200).json(cart);
  } else {
    return res.json([]);
  }
});
const getAllCarts = asyncHandler(async (req, res) => {
  const carts = await cartModel.find().populate("products").exec();
  res.status(200).json(carts);
});

const deleteItemFromCart = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const findUserCart = await cartModel
    .findOne({ customer: req.user._id })
    .exec();

  if (!findUserCart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const findProduct = findUserCart.products.find((item) => {
    return item.product.toString() === id;
  });
  if (!findProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (findProduct.quantity > 1) {
    const product = await productModel.findOne({ _id: id }).exec();
    findProduct.quantity -= 1;
    findProduct.price = product.price.new * findProduct.quantity;
    findUserCart.totalPrice -= product.price.new;
    findUserCart.totalShipment -= product.price.shipping;

    await findUserCart.save();
    return res.status(204).json({ message: "Product deleted successfully" });
  } else {
    const findProductIndex = findUserCart.products.findIndex((item) => {
      return item.product.toString() === id;
    });
    const foundProductByIndex = findUserCart.products[findProductIndex];
    const product = await productModel.findOne({
      _id: foundProductByIndex.product,
    });
    findUserCart.totalPrice -= product.price.new;
    findUserCart.totalShipment -= product.price.shipping;
    findUserCart.products.splice(findProductIndex, 1);
  }
  if (findUserCart.products.length == 0) {
    findUserCart.totalPrice = 0;
    findUserCart.totalShipment = 0;
  }
  await findUserCart.save();
  return res.status(204).json({ message: "Product deleted successfully" });
});
module.exports = { addToCart, getCart, deleteItemFromCart, getAllCarts };
