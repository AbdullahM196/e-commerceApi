const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
          quantity: {
            type: Number,
            default: 1,
            validate: {
              validator: (value) => value >= 0,
              message: "Quantity must be non-negative.",
            },
          },
          price: {
            type: Number,
            validate: {
              validator: (value) => value >= 0,
              message: "Price must be non-negative.",
            },
          },
        },
      ],
      default: [],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    totalShipment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const cart = mongoose.model("cart", cartSchema);
module.exports = cart;
