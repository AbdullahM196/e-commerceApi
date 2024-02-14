const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/auth");
const {
  register,
  login,
  logout,
  profile,
  editProfile,
  getAllUsers,
  userData,
  getOrderByUser,
  deleteUser,
} = require("../Controllers/customerControllers");

const isAdmin = require("../Middlewares/Admin");
const { upload } = require("../Middlewares/uploadImage");
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, profile);
router.put("/editProfile", authMiddleware, upload.single("image"), editProfile);
router.get("/getAllUsers", isAdmin, getAllUsers);
router.get("/userData", isAdmin, userData);
router.get("/getOrderByUser/:id", isAdmin, getOrderByUser);
router.delete("/deleteUser/:id", isAdmin, deleteUser);
module.exports = router;
