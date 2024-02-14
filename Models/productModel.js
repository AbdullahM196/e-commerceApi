const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      default: 1,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    specifications: {
      type: Object,
      required: true,
    },
    price: {
      new: {
        type: Number,
        required: true,
      },
      old: {
        type: Number,
      },
      discount: {
        type: Number,
        default: 0,
      },
      shipping: {
        type: Number,
        default: 0,
      },
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    img: {
      type: { url: String, public_id: String, _id: false },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const product = mongoose.model("product", productSchema);
module.exports = product;
