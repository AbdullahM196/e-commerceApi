const express = require("express");
const router = express.Router();
const {
  makeAnOrder,
  getOrders,
  changeStatus,
  getAllOrders,
  orderStatistics,
  getMostSold,
  mostActiveUser,
  mostSoldCategory,
  cancelOrder,
} = require("../Controllers/OrderControllers");
const authMiddleware = require("../Middlewares/auth");
const isAdmin = require("../Middlewares/Admin");

router.post("/makeAnOrder", authMiddleware, makeAnOrder);
router.get("/getOrders", authMiddleware, getOrders);
router.patch("/changeStatus/:id", isAdmin, changeStatus);
router.patch("/cancel/:id", authMiddleware, cancelOrder);
router.get("/getAllOrders", isAdmin, getAllOrders);
router.get("/mostSold", getMostSold);
router.get("/mostSoldCategory", mostSoldCategory);
router.get("/mostActiveUser", isAdmin, mostActiveUser);
router.get("/orderStatistics", isAdmin, orderStatistics);
module.exports = router;
