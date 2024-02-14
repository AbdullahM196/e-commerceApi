/* eslint-disable no-undef */
const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);

xdescribe("test category routes and controllers", () => {
  it("should get an array of category objects", async () => {
    const response = await request.get("/category/");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      jasmine.arrayContaining([
        jasmine.objectContaining({
          _id: jasmine.any(String),
          name: jasmine.any(String),
          subCategories: jasmine.any(Array),
        }),
      ])
    );
  });
  it("should get specific category object by id", async () => {
    const response = await request.get("/category/65ab0592ab1c935391b8ffe3");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        _id: "65ab0592ab1c935391b8ffe3",
        name: "test",
        subCategories: jasmine.any(Array),
      })
    );
  });
  it("should return 404 if category not found ", async () => {
    const response = await request.get("/category/1");
    expect(response.statusCode).toBe(404);
  });
  // these tests will return 401 unAuthorized due to admin authorization , to test them in unit testing remove authorize middlware and admin middleware,or test them in postman.
  it("add new category", async () => {
    const response = await request.post("/category/add").send({ name: "test" });
    expect(response.statusCode).toBe(201);
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        _id: jasmine.any(String),
        name: "test",
        subCategories: jasmine.any(Array),
      })
    );
  });
  it("should return 400 if request body dosenot contain name", async () => {
    const response = await request.post("/category/add").send({
      firstName: "ali",
    });
    expect(response.statusCode).toBe(400);
  });
  it("update category", async () => {
    const response = await request
      .patch("/category/update/65ab0592ab1c935391b8ffe3")
      .send({
        name: "test",
      });
    expect(response.header["content-type"]).toMatch(/json/);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        _id: "65ab0592ab1c935391b8ffe3",
        name: "test",
        subCategories: jasmine.any(Array),
      })
    );
  });
});
