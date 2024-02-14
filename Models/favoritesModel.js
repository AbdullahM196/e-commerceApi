const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
const favorite = mongoose.model("favorite", favoriteSchema);
module.exports = favorite;
