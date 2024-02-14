const JWT = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const customerModel = require("../Models/customerModel");
const bcrypt = require("bcrypt");

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const findUser = await customerModel.findOne({ email }).exec();
  if (!findUser) {
    return res.status(404).json({ message: "user not found" });
  }
  if (findUser.role !== "admin") {
    return res.status(403).json({ message: "You are not an admin" });
  }
  const match = await bcrypt.compare(password, findUser.password);
  if (!match) {
    return res.status(403).json({ message: "Wrong password or email" });
  }
  const token = JWT.sign(
    { userName: findUser.userName },
    process.env.ADMIN_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  findUser.token = token;
  await findUser.save();
  const user = {
    firstName: findUser.firstName,
    lastName: findUser.lastName,
    userName: findUser.userName,
    mobile: findUser.mobile,
    email: findUser.email,
    role: findUser.role,
    createdAt: findUser.createdAt,
    updatedAt: findUser.updatedAt,
  };
  return res.status(201).json(user);
});
const logoutAdmin = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.sendStatus(204);
  }
  //is token in db
  const findUser = await customerModel.findOne({ token }).exec();
  if (!findUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.sendStatus(204);
  }
  findUser.token = "";
  await findUser.save();
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.sendStatus(204);
});
const adminProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = req.user;
    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});
module.exports = {
  loginAdmin,
  logout: logoutAdmin,
  profile: adminProfile,
};
