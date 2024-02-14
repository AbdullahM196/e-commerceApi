const mongoose = require("mongoose");

const MainPageSchema = mongoose.Schema(
  {
    img: {
      type: { url: String, public_id: String, _id: false },
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    offerDescription: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
    discount: { type: Number, required: true },
  },

  {
    timestamps: true,
  }
);
const MainPage = mongoose.model("mainPage", MainPageSchema);
module.exports = MainPage;
