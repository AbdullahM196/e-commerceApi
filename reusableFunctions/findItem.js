const mongoose = require("mongoose");
async function findItem(id, Model) {
  const response = { statusCode: 200, data: "" };
  if (!id) {
    response.statusCode = 400;
    response.data = "id is required";
    return response;
  }
  if (!mongoose.isValidObjectId(id)) {
    response.statusCode = 404;
    response.data = "Invalid ID";
    return response;
  }
  const item = await Model.findById(id);
  if (item) {
    response.statusCode = 200;
    response.data = item;
    return response;
  } else {
    response.statusCode = 404;
    response.data = `item Not found`;
    return response;
  }
}
module.exports = findItem;
