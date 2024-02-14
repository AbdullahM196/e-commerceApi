const bcrypt = require("bcrypt");
const customerModel = require("../Models/customerModel");
const JWT = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const HandleSaveImage = require("../reusableFunctions/saveImage");
const orderModel = require("../Models/orderModel");
const cloudinary = require("cloudinary").v2;

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, mobile, email, password } = req.body;
  if (!mobile || !userName || !email || !password) {
    return res
      .status(400)
      .json({ message: "mobile , userName , email and password are required" });
  }
  const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.match(emailReg)) {
    return res.status(400).json({ message: "Enter a valid Email" });
  }
  const mobileRegex = /^(010|011|012|015)[0-9]{8}$/;
  if (!mobile.match(mobileRegex)) {
    return res.status(400).json({ message: "Enter a valid Mobile Number" });
  }
  const userNameRegex = /^[a-z]{3,}[1-9]{0,4}$/i;
  if (!userName.match(userNameRegex)) {
    return res.status(400).json({
      message:
        "first three Character in user name must be only characters and you can add after that to 4 Numbers",
    });
  }
  const passwordRegx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_^&#@])[A-Za-z\d@$!%*?&\-_^&#@]{8,}$/;
  if (!password.match(passwordRegx)) {
    return res.status(400).json({
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be at least 8 characters long.",
    });
  }
  const duplicateUserName = await customerModel.findOne({ userName }).exec();
  if (duplicateUserName) {
    return res.status(409).json({ message: "userName already exists" });
  }
  const duplicateEmail = await customerModel.findOne({ email }).exec();

  if (duplicateEmail) {
    return res.status(409).json({ message: "email already exists" });
  }
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);
  const token = JWT.sign({ userName }, process.env.USER_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const customer = await customerModel.create({
    firstName,
    lastName,
    userName,
    email,
    mobile,
    password: hashPassword,
    token,
  });
  const user = {
    firstName: customer.firstName,
    lastName: customer.lastName,
    userName: customer.userName,
    mobile: customer.mobile,
    email: customer.email,
    role: customer.role,
    img: customer.img.url,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  };

  return res.status(201).json(user);
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const findUser = await customerModel.findOne({ email }).exec();
  if (!findUser) {
    return res.status(404).json({ message: "user not found" });
  }
  const match = await bcrypt.compare(password, findUser.password);
  if (!match) {
    return res.status(403).json({ message: "Wrong password or email" });
  }
  const token = JWT.sign(
    { userName: findUser.userName },
    process.env.USER_TOKEN_SECRET,
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
    img: findUser.img.url,
    createdAt: findUser.createdAt,
    updatedAt: findUser.updatedAt,
  };
  return res.status(201).json(user);
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.sendStatus(204);
  }
  //is token in db
  const findUser = await customerModel.findOne({ token }).exec();
  if (!findUser) {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
    return res.sendStatus(204);
  }
  findUser.token = "";
  await findUser.save();
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
  return res.sendStatus(204);
});
const profile = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = req.user;
    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      img: user.img.url,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});
const editProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, mobile } = req.body;
  const img = req.file;
  if (req.user) {
    const user = req.user;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    if (userName) {
      const duplicateUserName = await customerModel
        .findOne({ userName })
        .exec();

      if (duplicateUserName && duplicateUserName.userName !== user.userName) {
        return res.status(403).json({ message: "userName already exists" });
      }
      user.userName = userName || user.userName;
    }
    user.mobile = mobile || user.mobile;
    if (img) {
      if (user.img.public_id) {
        await cloudinary.uploader.destroy(user.img.public_id);
      }
      user.img = await HandleSaveImage(img);
    }

    const savedUser = await user.save();
    res.status(200).json({
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      userName: savedUser.userName,
      mobile: savedUser.mobile,
      email: savedUser.email,
      role: savedUser.role,
      img: savedUser.img.url,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    });
  }
});
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await customerModel.find().sort({ createdAt: -1 }).exec();
  res.status(200).json({
    users,
  });
});
const userData = asyncHandler(async (req, res) => {
  const fourMonthAgo = new Date();
  fourMonthAgo.setMonth(fourMonthAgo.getMonth() - 4);
  customerModel
    .aggregate([
      {
        $match: {
          createdAt: { $gte: fourMonthAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          userGained: { $sum: 1 },
        },
      },
    ])
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});
const getOrderByUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderModel.findOne({ customer: id }).exec();
  res.status(200).json(order);
});
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await customerModel.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  if (user.img.public_id) {
    await cloudinary.v2.uploader.destroy(user.img.public_id);
  }
  await orderModel
    .updateMany(
      { customer: id },
      {
        $set: {
          customer: "deleted User",
        },
      }
    )
    .exec();

  const deletedUser = await customerModel.findByIdAndDelete(id).exec();
  res.status(200).json(deletedUser);
});
module.exports = {
  register,
  login,
  logout,
  profile,
  editProfile,
  getAllUsers,
  userData,
  getOrderByUser,
  deleteUser,
};
