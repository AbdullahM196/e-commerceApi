/* eslint-disable no-undef */
const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);
const path = require("path");
const fs = require("fs");
describe("Test SubCaetgory Routes and controllers", () => {
  xit("should get an array of subcategory objects", async () => {
    const response = await request.get("/subCategory/");
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toMatch(/json/);
    console.log({ res: response.body });
    expect(response.body).toEqual(
      jasmine.arrayContaining([
        {
          _id: jasmine.any(String),
          name: jasmine.any(String),
          category: jasmine.any(String),
          img: {
            public_id: jasmine.any(String),
            url: jasmine.any(String),
          },
          products: jasmine.any(Array),
          createdAt: jasmine.any(String),
          updatedAt: jasmine.any(String),
          __v: jasmine.any(Number),
        },
      ])
    );
  }, 10000);
  xit("should return specific subCategory by it is _id", async () => {
    const response = await request.get("/subCategory/65ab08bd44ed67ecda130104");
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toMatch("json");
    console.log("====================================");
    console.log(response.body);
    console.log("====================================");
    expect(response.body).toEqual({
      _id: "65ab08bd44ed67ecda130104",
      name: "test",
      category: "65ab0592ab1c935391b8ffe3",
      img:
        {
          public_id: jasmine.any(String),
          url: jasmine.any(String),
        } || jasmine.any(String),
      products:
        jasmine.arrayContaining[
          {
            _id: jasmine.any(String),
            subCategory: jasmine.any(String),
            quantity: jasmine.any(Number),
            title: jasmine.any(String),
            description: jasmine.any(String),
            price: jasmine.any(Object),
            specifications: jasmine.any(Object),
            img: {
              public_id: jasmine.any(String),
              url: jasmine.any(String),
            },
            createdAt: jasmine.any(String),
            updatedAt: jasmine.any(String),
            __v: jasmine.any(Number),
          }
        ],
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
      __v: jasmine.any(Number),
    });
  });
  xit("should return 404 if the _id is incorrect", async () => {
    const response = await request.get("/subCategory/2");
    expect(response.statusCode).toBe(404);
  });
  /**
   * these tests needs to authentications and user role to be admin.
   * these tests will work only when you comment auth middlware on subcategory routes.
   */
  xit("should create a subcategory and return it and status code 201", async () => {
    const imagePath = path.join(__dirname, "../img/nodejs.png");
    const img = await fs.promises.readFile(imagePath);
    const response = await request
      .post("/subCategory/add")
      .set("Content-Type", "multipart/form-data")
      .attach("image", img, "nodejs.png")
      .field("category", "65ab0592ab1c935391b8ffe3")
      .field("name", "test");
    expect(response.statusCode).toBe(201);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      _id: jasmine.any(String),
      name: "test",
      category: "65ab0592ab1c935391b8ffe3",
      img: {
        public_id: jasmine.any(String),
        url: jasmine.any(String),
      },
      products: jasmine.any(Array),
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
      __v: 0,
    });
  });
  xit("should return 404 if category not found", async () => {
    const imagePath = path.join(__dirname, "../img/nodejs.png");
    const img = await fs.promises.readFile(imagePath);
    const response = await request
      .post("/subCategory/add")
      .set("Content-Type", "multipart/form-data")
      .attach("image", img, "nodejs.png")
      .field("category", "65")
      .field("name", "test");
    expect(response.statusCode).toBe(404);
  });
  xit("should update subcategory by _id and return it and status code 201", async () => {
    const imagePath = path.join(__dirname, "../img/node+express.png");
    const img = await fs.promises.readFile(imagePath);
    const response = await request
      .patch("/subCategory/update/65ab08bd44ed67ecda130104")
      .set("Content-Type", "multipart/form-data")
      .attach("image", img, "node+express.png")
      .field("category", "65ab0592ab1c935391b8ffe3")
      .field("name", "node+express");
    expect(response.statusCode).toBe(201);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual({
      _id: "65ab08bd44ed67ecda130104",
      name: "node+express",
      category: "65ab0592ab1c935391b8ffe3",
      img: {
        public_id: jasmine.any(String),
        url: jasmine.any(String),
      },
      products: jasmine.any(Array),
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
      __v: jasmine.any(Number),
    });
  }, 10000);
});
