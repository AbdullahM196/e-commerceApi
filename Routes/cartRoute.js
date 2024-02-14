const {
  addToCart,
  getCart,
  deleteItemFromCart,
  getAllCarts,
} = require("../Controllers/cartControllers");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth");
const isAdmin = require("../Middlewares/Admin");

router.post("/addToCart", authMiddleware, addToCart);
router.get("/getCart", authMiddleware, getCart);
router.delete("/delete/:id", authMiddleware, deleteItemFromCart);
router.get("/getAll", isAdmin, getAllCarts);

module.exports = router;
