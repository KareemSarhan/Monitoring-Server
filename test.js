const mongoose = require("./config/mongo").mongoose;
const request = require("supertest");
const app = require("./app");
const User = require("./models/User");
const Verfication = require("./models/Verfication");
const supertest = require("supertest");
const requestWithSupertest = supertest(app);

describe("app", () => {
  it("should return 200", async () => {
    const res = await requestWithSupertest.get("/");
    expect(res.statusCode).toEqual(200);
  });
});

describe("User Endpoints", () => {
  it("user delete", async () => {
    const res = await requestWithSupertest.delete("/deleteUser").send({
      email: "kareemsarhan@gmail.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(200);
  });
});
describe("User Endpoints", () => {
  it("user sign up", async () => {
    const res = await requestWithSupertest.delete("/deleteUser").send({
      email: "kareemsarhan@gmail.com",
      password: "123456",
    });
    res = await requestWithSupertest.post("/signUp").send({
      email: "Kareemsarhan@gmail.com",
      password: "123456",
    });
    expect(res.statusCode).toEqual(200);
  });
});
