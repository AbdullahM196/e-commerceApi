const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../Models/subCategoryModel");
const cloudinary = require("cloudinary").v2;
const findItem = require("../reusableFunctions/findItem");
const HandleSaveImage = require("../reusableFunctions/saveImage");
const categoryModel = require("../Models/category");

const addSubCategory = asyncHandler(async (req, res) => {
  const { category, name } = req.body;
  const img = req.file;
  let uploadedImage = "";
  if (!category || !name || !img) {
    res.status(400).json({ message: "category and name and img are required" });
    return;
  }
  const categoryRsult = await findItem(category, categoryModel);
  if (categoryRsult.statusCode === 404) {
    return res.status(404).json(categoryRsult.data);
  }
  if (img) {
    try {
      uploadedImage = await HandleSaveImage(img);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }
  const newSubCategory = await subCategoryModel.create({
    category,
    name,
    img: uploadedImage,
  });
  categoryRsult.data.subCategories.push(newSubCategory._id);
  await categoryRsult.data.save();
  res.status(201).json(newSubCategory);
});
const getSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const findSubCat = await findItem(id, subCategoryModel);
  if (findSubCat.statusCode === 404) {
    return res.status(404).json(findSubCat.data);
  }
  const subCat = await findSubCat.data.populate("products");
  return res.status(200).json(subCat);
});
const getAllSubCategory = asyncHandler(async (req, res) => {
  const allSubCategory = await subCategoryModel.find().sort({ createdAt: -1 });
  return res.status(200).json(allSubCategory);
});
const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const img = req.file;
  try {
    const { data: findSubCat, statusCode: findStatusCode } = await findItem(
      id,
      subCategoryModel
    );
    if (findStatusCode === 404) {
      return res.status(404).json(findSubCat);
    }
    if (name) {
      findSubCat.name = name;
    }
    if (img) {
      if (findSubCat.img.public_id) {
        await cloudinary.uploader.destroy(findSubCat.img.public_id);
      }

      findSubCat.img = await HandleSaveImage(img);
    }

    await findSubCat.save();
    return res.status(201).json(findSubCat);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  addSubCategory,
  getSubCategory,
  updateSubCategory,
  getAllSubCategory,
};
