const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} = require("../Controllers/category");
const express = require("express");
const router = express.Router();
const isAdmin = require("../Middlewares/Admin");

router.post("/add", isAdmin, addCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.patch("/update/:id", isAdmin, updateCategory);

module.exports = router;
