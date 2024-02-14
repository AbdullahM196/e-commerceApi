const express = require("express");
const router = express.Router();
const {
  addOffer,
  getAllOffers,
  updateOffer,
  deleteOffer,
} = require("../Controllers/MainPageControllrs");
const isAdmin = require("../Middlewares/Admin");
const { upload } = require("../Middlewares/uploadImage");

router.post("/add", isAdmin, upload.single("img"), addOffer);

router.get("/getAllOffers", getAllOffers);

router.put("/updateOffer/:id", isAdmin, upload.single("img"), updateOffer);

router.delete("/deleteOffer/:id", isAdmin, deleteOffer);

module.exports = router;
