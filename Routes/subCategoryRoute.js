const {
  addSubCategory,
  getSubCategory,
  updateSubCategory,
  getAllSubCategory,
} = require("../Controllers/subCategoryControllers");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth");
const isAdmin = require("../Middlewares/Admin");
const { upload } = require("../Middlewares/uploadImage");

router.post(
  "/add",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  addSubCategory
);
router.get("/", getAllSubCategory);
router.get("/:id", getSubCategory);
router.patch(
  "/update/:id",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  updateSubCategory
);
module.exports = router;
