/* eslint-disable no-undef */
const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);
const product = "/product";
const path = require("path");
const fs = require("fs");
const subCategoryModel = require("../Models/subCategoryModel");
const changeCategory = require("../reusableFunctions/changeCategory");
describe("test products routes", () => {
  xit("add product", async () => {
    const imagePath = path.join(__dirname, "../img/nodejs.png");
    const img = await fs.promises.readFile(imagePath);
    const response = await request
      .post(`${product}/add`)
      .set("Content-Type", "multipart/form-data")
      .attach("image", img, "nodejs.png")
      .field("subCategory", "65ab08bd44ed67ecda130104")
      .field("title", "test")
      .field("description", "test test")
      .field(
        "price",
        JSON.stringify({ new: 100, old: 120, discount: 20, shipping: 50 })
      )
      .field("specifications", JSON.stringify({ test: "test" }));
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      _id: jasmine.any(String),
      subCategory: "65ab08bd44ed67ecda130104",
      quantity: 1,
      title: "test",
      description: "test test",
      price: { new: 100, old: 120, discount: 20, shipping: 50 },
      specifications: { test: "test" },
      img: {
        public_id: jasmine.any(String),
        url: jasmine.any(String),
      },
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
      __v: jasmine.any(Number),
    });
  });
  xit("update product by it is id", async () => {
    const itemId = "65b42fed250a4e02543cc385";
    //const oldSubCategory="65ab08bd44ed67ecda130104";
    const newSubCategory = "65b1669f2fbe2f3124fdcd9b";
    const imagePath = path.join(__dirname, "../img/node+express.png");
    const img = await fs.promises.readFile(imagePath);
    const response = await request
      .put(`${product}/update/${itemId}`)
      .set("Content-Type", "multipart/form-data")
      // .attach("image", img, "nodejs+epress.png")
      .field("subCategory", newSubCategory)
      .field("title", "update test")
      .field("description", "updatetest updatetest updatetest")
      .field(
        "price",
        JSON.stringify({ new: 120, old: 140, discount: 15, shipping: 50 })
      )
      .field("specifications", JSON.stringify({ test: "test" }));
    expect(response.statusCode).toBe(201);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      _id: "65b42fed250a4e02543cc385",
      subCategory: newSubCategory,
      quantity: 1,
      title: "update test",
      description: "updatetest updatetest updatetest",
      price: { new: 120, old: 140, discount: 15, shipping: 50 },
      specifications: { test: "test" },
      img: {
        public_id: jasmine.any(String),
        url: jasmine.any(String),
      },
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
      __v: jasmine.any(Number),
    });
  });
  xit("delete product by it is id", async () => {
    const productId = "65b53581eedba85b52e153c3";
    const response = await request.delete(`${product}/delete/${productId}`);
    expect(response.statusCode).toBe(204);
    expect(response.body).toEqual({});
  });
  xit("get all products in specific subCategory", async () => {
    const subCategory = "65ab08bd44ed67ecda130104";
    const response = await request.get(`${product}/getAllInSub/${subCategory}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(jasmine.any(Array));
    for (let i of response.body) {
      expect(i.subCategory).toEqual(subCategory);
    }
  });
  xit("get product by it is id", async () => {
    const productId = "65b53581eedba85b52e153c3";
    const response = await request.get(`${product}/${productId}`);
    console.log({ response });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(jasmine.any(Object));
    expect(response.body._id).toEqual(productId);
  });
  xit("get all products", async () => {
    const response = await request.get(`${product}/getAll`);
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toMatch(/json/);

    expect(response.body.allProducts).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          _id: jasmine.any(String),
          subCategory: {
            _id: jasmine.any(String),
            name: jasmine.any(String),
            category: jasmine.any(String),
          },
          quantity: jasmine.any(Number),
          title: jasmine.any(String),
          description: jasmine.any(String),
          price: jasmine.any(Object),
          specifications: jasmine.any(Object),
          img: jasmine.any(Object),
          createdAt: jasmine.any(String),
          updatedAt: jasmine.any(String),
          __v: jasmine.any(Number),
        }),
      ])
    );
  });
});
xdescribe("change category function", () => {
  const itemId = "65b42fed250a4e02543cc385";
  const newSubCat = "65b1669f2fbe2f3124fdcd9b";
  const oldSubCat = "65ab08bd44ed67ecda130104";
  it("should return new subcategory id", async () => {
    const { data: subcCat } = await changeCategory(
      itemId,
      newSubCat,
      oldSubCat,
      subCategoryModel
    );
    expect(subcCat).toEqual(newSubCat);
  });
});
