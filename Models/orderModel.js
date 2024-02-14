const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    products: [
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
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderSchema);
module.exports = order;
