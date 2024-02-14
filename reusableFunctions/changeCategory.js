const findItem = require("./findItem");
async function changeCategory(itemId, newCatId, oldCatId, model) {
  const response = { statusCode: 200, data: "" };
  try {
    if (!newCatId) {
      throw new Error("New category ID is required.");
    }

    const { data: newSubCategory, statusCode: newSubStatusCode } =
      await findItem(newCatId, model);
    if (newSubStatusCode === 404) {
      response.statusCode = 404;
      response.data = newSubCategory;
      return response;
    }

    const { data: oldSubCategory, statusCode: oldSubStatusCode } =
      await findItem(oldCatId, model);
    if (oldSubStatusCode === 404) {
      throw new Error("Old category not found.");
    }

    const findProductIndex = oldSubCategory.products.findIndex(
      (item) => item.toString() === itemId
    );

    if (findProductIndex === -1) {
      throw new Error("Item not found in old category.");
    }

    oldSubCategory.products.splice(findProductIndex, 1);
    await oldSubCategory.save();

    newSubCategory.products.push(itemId);
    await newSubCategory.save();

    response.data = newCatId;
  } catch (error) {
    response.statusCode = 500;
    response.data = error.message;
  }

  return response;
}
module.exports = changeCategory;
