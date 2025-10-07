const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // ✅ Crée un utilisateur de test
  const user = await User.create({
    email: "user@test.com",
    password: "hashed_password", // peu importe, on ne teste pas ici bcrypt
  });

  userId = user._id.toString();

  // ✅ Génère un token JWT valide pour cet utilisateur
  process.env.JWT_SECRET = "testsecret";
  token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("🧩 Route /user/me", () => {
  test("devrait renvoyer le profil utilisateur si token valide", async () => {
    const res = await request(app)
      .get("/user/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("user@test.com");
  });

  test("devrait refuser sans token", async () => {
    const res = await request(app).get("/user/me");
    expect(res.statusCode).toBe(401);
  });
});

describe("📇 Routes /contact protégées", () => {
  let contactId;

  test("création d’un contact", async () => {
    const res = await request(app)
      .post("/contact")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "John", lastName: "Doe", phone: "0123456789" });

    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe("John");

    contactId = res.body._id;
  });

  test("récupération de tous les contacts", async () => {
    const res = await request(app)
      .get("/contact")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("modification d’un contact", async () => {
    const res = await request(app)
      .patch(`/contact/${contactId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0987654321" });

    expect(res.statusCode).toBe(200);
    expect(res.body.phone).toBe("0987654321");
  });

  test("suppression d’un contact", async () => {
    const res = await request(app)
      .delete(`/contact/${contactId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const remaining = await Contact.find();
    expect(remaining.length).toBe(0);
  });

  test("refuse l’accès sans token", async () => {
    const res = await request(app).get("/contact");
    expect(res.statusCode).toBe(401);
  });
});
