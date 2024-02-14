const asyncHandler = require("express-async-handler");
const categoryModel = require("../Models/category");
async function findCategory(id) {
  const response = { statusCode: 200, data: "" };
  if (!id) {
    response.statusCode = 400;
    response.data = "id is required";
    return response;
  }
  const category = await categoryModel.findOne({ _id: id }).exec();
  if (category) {
    response.statusCode = 200;
    response.data = category;
    return response;
  } else {
    response.statusCode = 404;
    response.data = "category Not found";
    return response;
  }
}
const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.sendStatus(400);
    throw new Error("name is required");
  }
  const category = await categoryModel.create({
    name,
  });
  return res.status(201).json(category);
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel
    .find()
    .sort({ createdAt: -1 })
    .populate("subCategories")
    .exec();
  res.status(200).json(categories);
});
const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const categoryById = await findCategory(id);
  if (categoryById.statusCode === 400) {
    return res.status(400).json(categoryById.data);
  } else if (categoryById.statusCode === 404) {
    return res.status(404).json(categoryById.data);
  }

  return res.status(categoryById.statusCode).json(categoryById.data);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const categoryById = await findCategory(id);
  const category = categoryById.data;
  if (categoryById.statusCode === 404) {
    return res.status(404).json({ message: categoryById.data });
  }
  category.name = name || category.name;
  await category.save();
  return res.status(201).json(category);
});

module.exports = {
  findCategory,
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
};
