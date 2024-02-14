const express = require("express");
const router = express.Router();
const isAdmin = require("../Middlewares/Admin");
const {
  loginAdmin,
  profile: adminProfile,
  logout: logoutAdmin,
} = require("../Controllers/adminControllers");
router.post("/login", loginAdmin);
router.get("/getAdmin", isAdmin, adminProfile);
router.post("/logout", logoutAdmin);
module.exports = router;
