const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("🧪 Auth API", () => {
  test("Inscription -> devrait créer un utilisateur", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@test.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    const user = await User.findOne({ email: "test@test.com" });
    expect(user).not.toBeNull();
  });

  test("Connexion -> devrait renvoyer un token", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "login@test.com", password: "123456" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@test.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
