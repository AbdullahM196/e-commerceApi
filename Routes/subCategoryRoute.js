const {
  addSubCategory,
  getSubCategory,
  updateSubCategory,
  getAllSubCategory,
} = require("../Controllers/subCategoryControllers");
const express = require("express");
const router = express.Router();
const isAdmin = require("../Middlewares/Admin");
const { upload } = require("../Middlewares/uploadImage");

router.post("/add", isAdmin, upload.single("image"), addSubCategory);
router.get("/", getAllSubCategory);
router.get("/:id", getSubCategory);
router.patch("/update/:id", isAdmin, upload.single("image"), updateSubCategory);
module.exports = router;
