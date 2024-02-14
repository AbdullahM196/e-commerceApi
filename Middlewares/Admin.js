require("dotenv").config();
const customerModel = require("../Models/customerModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const adminMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);
    req.user = await customerModel
      .findOne({ userName: decoded.userName })
      .select("-password")
      .exec();
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});
module.exports = adminMiddleware;
