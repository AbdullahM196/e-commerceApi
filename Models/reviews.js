const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  rating: {
    type: Number,
  },
  comment: {
    type: String,
  },
});
const review = mongoose.model("review", reviewSchema);
module.exports = review;
