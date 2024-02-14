const mainPageModel = require("../Models/mainPageModel");
const asyncHandler = require("express-async-handler");
const productModel = require("../Models/productModel");
const cloudinary = require("cloudinary").v2;
const HandleSaveImage = require("../reusableFunctions/saveImage");
const findItem = require("../reusableFunctions/findItem");
const addOffer = asyncHandler(async (req, res) => {
  const { title, products, offerDescription, discount } = req.body;
  const img = req.file;

  let url = "";

  if (!title || !products || !img || !offerDescription || !discount) {
    return res.status(400).json({
      message: "product , img , offerDescription and discount are required",
    });
  }
  const offerProducts =
    typeof products === "string" ? JSON.parse(products) : products;
  let arr = [];

  let allProducts = await productModel.find({}).exec();
  for (let i = 0; i < offerProducts.length; i++) {
    const found = allProducts.find((item) => {
      return item._id.toString() == offerProducts[i];
    });
    if (found) {
      const product = await productModel.findOne({ _id: found }).exec();
      product.price.discount = discount;
      product.price.old = product.price.new;
      product.price.new =
        product.price.new - (product.price.new * discount) / 100;
      await product.save();
      arr.push(found);
    }
  }
  if (img) {
    try {
      url = await HandleSaveImage(img);
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
  const offer = {
    title,
    img: url,
    offerDescription,
    discount,
    products: arr,
  };
  await mainPageModel.create(offer);

  return res.json(offer);
});
const getAllOffers = asyncHandler(async (req, res) => {
  const offers = await mainPageModel
    .find({})
    .sort({ createdAt: -1 })
    .populate("products")
    .exec();
  return res.json(offers);
});
const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let { title, offerDescription, discount, products } = req.body;
  const img = req.file;
  let url = "";

  if (!title && !img && !offerDescription && !discount && !products) {
    return res.status(400).json({ message: "Enter new values" });
  }

  const findOffer = await mainPageModel.findOne({ _id: id }).exec();
  if (!findOffer) {
    return res.status(404).json({ message: "Offer not found" });
  }

  findOffer.title = title ? title : findOffer.title;

  if (img) {
    try {
      cloudinary.uploader.destroy(findOffer.img.public_id);
      url = await HandleSaveImage(img);
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
  findOffer.img = url ? url : findOffer.img;
  findOffer.offerDescription = offerDescription
    ? offerDescription
    : findOffer.offerDescription;
  findOffer.discount = discount ? discount : findOffer.discount;
  if (products && products.length > 0) {
    products = typeof products === "string" ? JSON.parse(products) : products;

    let arr = [];
    let allProducts = await productModel.find({}).exec();
    for (let i = 0; i < products.length; i++) {
      const found = allProducts.find((item) => item._id == products[i]);
      if (found) {
        const product = await productModel.findOne({ _id: found }).exec();
        product.price.discount = discount;
        product.price.old = product.price.new;
        product.price.new =
          product.price.new - (product.price.new * discount) / 100;
        await product.save();
        arr.push(found);
      }
    }
    findOffer.products = arr;
  }
  await findOffer.save();
  return res.status(201).json(findOffer);
});
const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findOffer = await mainPageModel.findOne({ _id: id }).exec();
  if (!findOffer) {
    return res.status(404).json({ message: "Offer not found" });
  }
  findOffer.products.forEach(async (product) => {
    const { data: findProduct } = await findItem(product, productModel);

    findProduct.price.discount = 0;
    findProduct.price.old = findProduct.price.new;
    findProduct.price.new =
      findProduct.price.new +
      (findProduct.price.new * findOffer.discount) / 100;

    await findProduct.save();
  });
  await mainPageModel.findOneAndDelete({ _id: id });
  res.sendStatus(204);
});
module.exports = { addOffer, getAllOffers, updateOffer, deleteOffer };
