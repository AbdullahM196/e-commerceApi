const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getAllProducts,
} = require("../Controllers/productControllers");
const express = require("express");
const router = express.Router();

const isAdmin = require("../Middlewares/Admin");
const { upload } = require("../Middlewares/uploadImage");

router.post("/add", isAdmin, upload.single("image"), addProduct);
router.put("/update/:id", isAdmin, upload.single("image"), updateProduct);
router.delete("/delete/:id", isAdmin, deleteProduct);
router.get("/getAllInSub/:subCategoryId", getProducts);
router.get("/getAll", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
