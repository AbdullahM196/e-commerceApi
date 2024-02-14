const {
  addFavorite,
  getCustomerFavorites,
  getAllFavorites,
  deleFavorite,
} = require("../Controllers/favoriteControllers");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth");
const isAdmin = require("../Middlewares/Admin");

router.post("/add", authMiddleware, addFavorite);
router.get("/getFavorites", authMiddleware, getCustomerFavorites);
router.get("/getAll", isAdmin, getAllFavorites);
router.delete("/delete/:id", authMiddleware, deleFavorite);

module.exports = router;
