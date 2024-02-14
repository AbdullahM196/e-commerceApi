/* eslint-disable no-undef */
const app = require("../index");
const supertest = require("supertest");
const request = supertest(app);
const user = "/user";
describe("Test user endpoints", () => {
  xit("should create a user", async () => {
    const response = await request.post(`${user}/register`).send({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "01066868100",
      email: "abdullah.mahmoud.f196@gmail.com",
      password: "Abdullah_196",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "01066868100",
      email: "abdullah.mahmoud.f196@gmail.com",
      role: "customer",
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
    });
  });
  xit("should return error 409 Confilict because email and userName shouldnot be repeated", async () => {
    const response = await request.post(`${user}/register`).send({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "01066868100",
      email: "abdullah.mahmoud.f196@gmail.com",
      password: "Abdullah_196",
    });
    expect(response.status).toBe(409);
  });
  xit("should return error 400 Bad Request if mobile number is not valid", async () => {
    const response = await request.post(`${user}/register`).send({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "21066868100",
      email: "abdullah.mahmoud.f196@gmail.com",
      password: "Abdullah_196",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Enter a valid Mobile Number");
  });
  xit("should return error 400 Bad Request if email is not valid", async () => {
    const response = await request.post(`${user}/register`).send({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "01066868100",
      email: "abdullah.mahmoud.f196@gmail",
      password: "Abdullah_196",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Enter a valid Email");
  });
  xit("should return error 400 Bad Request if Password not contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be at least 8 characters long.", async () => {
    const response = await request.post(`${user}/register`).send({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "01066868100",
      email: "abdullah.mahmoud.f196@gmail.com",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be at least 8 characters long."
    );
  });
  xit("should login user with valid credentials", async () => {
    const response = await request.post(`${user}/login`).send({
      email: "abdullah.mahmoud.f196@gmail.com",
      password: "Abdullah_196",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      firstName: "abdullah",
      lastName: "mahmoud",
      userName: "abdullahM196",
      mobile: "01066868100",
      email: "abdullah.mahmoud.f196@gmail.com",
      role: jasmine.any(String),
      createdAt: jasmine.any(String),
      updatedAt: jasmine.any(String),
    });
  });
});
