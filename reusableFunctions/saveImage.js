const { uploadImage } = require("../Middlewares/uploadImage");
async function HandleSaveImage(img) {
  const imageObj = {
    public_id: "",
    url: "",
  };
  if (typeof img == "object") {
    try {
      const uploadResult = await uploadImage(img);
      imageObj.public_id = uploadResult.public_id;
      imageObj.url = uploadResult.secure_url;
    } catch (err) {
      return err;
    }
  } else if (typeof img === "string") {
    imageObj.url = img;
    imageObj.public_id = "";
  }
  return imageObj;
}
module.exports = HandleSaveImage;
