const productModel = require("../Models/productModel");
const asyncHandler = require("express-async-handler");
const HandleSaveImage = require("../reusableFunctions/saveImage");
const findItem = require("../reusableFunctions/findItem");
const subCategoryModel = require("../Models/subCategoryModel");
const cloudinary = require("cloudinary").v2;
const changeCategory = require("../reusableFunctions/changeCategory");
const addProduct = asyncHandler(async (req, res) => {
  let {
    title,
    description,
    price,
    subCategory,
    image,
    quantity,
    specifications,
  } = req.body;
  const img = req.file;
  price = JSON.parse(price);
  specifications = JSON.parse(specifications);
  if (!title || !description || !specifications || !price.new || !subCategory) {
    res.status(400);
    throw new Error(
      "title , description , price ,specifications  and subCategory are required"
    );
  }
  if (!image && !img) {
    return res.status(400).json({ message: "imgUrl or imgFile is required" });
  }
  if (image && img) {
    return res
      .status(403)
      .json({ message: "imgUrl and img is not allowed together" });
  }
  let imageObj;
  const saveImage = img ? img : image;
  try {
    imageObj = await HandleSaveImage(saveImage);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const findSubCategory = await findItem(subCategory, subCategoryModel);
  if (findSubCategory.statusCode === 404) {
    return res.status(404).json(`${findSubCategory.data} in subcategoryModel`);
  }

  const product = await productModel.create({
    title,
    description,
    price,
    subCategory,
    img: imageObj,
    quantity,
    specifications,
  });
  findSubCategory.data.products.push(product._id);
  await findSubCategory.data.save();
  res.status(201).json(product);
});
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let {
    title,
    description,
    price,
    subCategory,
    image,
    quantity,
    specifications,
  } = req.body;
  const img = req.file;
  price = JSON.parse(price);
  specifications = JSON.parse(specifications);
  const { data: findProduct, statusCode: productStatusCode } = await findItem(
    id,
    productModel
  );
  if (productStatusCode === 404 || productStatusCode === 400) {
    return res.status(productStatusCode).json(`${findProduct} in productModel`);
  }

  findProduct.title = title || findProduct.title;
  findProduct.description = description || findProduct.description;
  findProduct.price = price || findProduct.price;
  findProduct.quantity = quantity || findProduct.quantity;
  findProduct.specifications = specifications || findProduct.specifications;

  if (subCategory) {
    const { data: subCat, statusCode: changeStatusCode } = await changeCategory(
      id,
      subCategory,
      findProduct.subCategory,
      subCategoryModel
    );
    if (changeStatusCode === 404) {
      return res.status(404).json(`${subCat} in subcategoryModel`);
    }
    findProduct.subCategory = subCat;
  }
  if (img || image) {
    const saveImage = img ? img : image;
    if (findProduct.img.public_id) {
      await cloudinary.uploader.destroy(findProduct.img.public_id);
    }
    const imageObj = await HandleSaveImage(saveImage);
    findProduct.img = imageObj;
  }
  await findProduct.save();

  res.status(201).json(findProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: findProduct, statusCode: findprdStatus } = await findItem(
    id,
    productModel
  );
  if (findprdStatus === 404) {
    return res.status(404).json({ message: findProduct });
  }
  if (findProduct.img.public_id) {
    await cloudinary.uploader.destroy(findProduct.img.public_id);
  }
  if (findProduct.subCategory) {
    const { data: subCategory } = await findItem(
      findProduct.subCategory,
      subCategoryModel
    );
    const findProductIndex = subCategory.products.findIndex(
      (item) => item._id == id
    );
    subCategory.products.splice(findProductIndex, 1);

    await subCategory.save();
  }
  const deletedItem = await productModel.findOneAndDelete({ _id: id }).exec();

  return res.status(204).json(deletedItem);
});
const getProducts = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.params;
  try {
    const products = await productModel
      .find({ subCategory: subCategoryId })
      .exec();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(404).json({ message: "subCategory not found" });
  }
});
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data: findProduct, statusCode } = await findItem(id, productModel);
  if (statusCode === 404) {
    return res.status(404).json(findProduct);
  }
  return res.status(200).json(findProduct);
});

const getAllProducts = asyncHandler(async (req, res) => {
  if (req.query.page) {
    const countAllProducts = await productModel.find({}).count();
    const page = req.query.page || 0;
    const productsPerPage = 5;
    const allProducts = await productModel
      .find({})
      .populate("subCategory", { _id: 1, name: 1, category: 1 })
      .sort({ createdAt: -1 })
      .skip(page * productsPerPage)
      .limit(productsPerPage);
    let allPages = Math.ceil(countAllProducts / productsPerPage);
    return res.status(200).json({ allProducts, allPages });
  } else {
    const allProducts = await productModel
      .find({})
      .populate("subCategory", { _id: 1, name: 1, category: 1 })
      .sort({ createdAt: -1 });
    const allPages = allProducts.length / 5;
    return res.status(200).json({ allProducts, allPages });
  }
});
module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getAllProducts,
};
