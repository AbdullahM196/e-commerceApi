const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      validate: [
        function (value) {
          const reg = /^[a-z]{3,}$/i;
          return reg.test(value);
        },
        "first name must be only character",
      ],
    },
    lastName: {
      type: String,
      validate: [
        function (value) {
          const reg = /^[a-z]{3,}$/i;
          return reg.test(value);
        },
        "last name must be only character",
      ],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: function (value) {
            const reg = /^[a-zA-Z0-9]+$/;
            return reg.test(value);
          },
          message: "Enter a valid User Name",
        },
      ],
    },
    mobile: {
      type: String,
      required: true,
      validate: [
        {
          validator: function (value) {
            const reg = /^(010|011|012|015)[0-9]{8}$/;
            return reg.test(value);
          },
          message: "Enter a valid Mobile Number",
        },
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: function (value) {
            const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            return reg.test(value);
          },
          message: "Enter a valid Email",
        },
      ],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    token: {
      type: String,
      default: "",
    },
    img: {
      type: { url: String, public_id: String, _id: false },
      default: {
        url: "",
        public_id: "",
      },
    },
  },
  { timestamps: true }
);
const customer = mongoose.model("customer", customerSchema);
module.exports = customer;
