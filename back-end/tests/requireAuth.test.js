const jwt = require("jsonwebtoken");
const requireAuth = require("../middleware/requireAuth");

describe("🧪 Middleware requireAuth", () => {
  let res;
  let next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    process.env.JWT_SECRET = "testsecret";
  });

  test("➡️ rejette si l'en-tête Authorization est absent", () => {
    const req = { headers: {} };
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Accès refusé : pas de token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("➡️ rejette si le token est manquant après 'Bearer'", () => {
    const req = { headers: { authorization: "Bearer " } };
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token manquant" });
    expect(next).not.toHaveBeenCalled();
  });

  test("➡️ rejette si le token est invalide", () => {
    const req = { headers: { authorization: "Bearer tokenInvalide" } };
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Token invalide ou expiré" });
    expect(next).not.toHaveBeenCalled();
  });

  test("✅ autorise si le token est valide", () => {
    const validToken = jwt.sign({ userId: "12345" }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${validToken}` } };

    requireAuth(req, res, next);

    expect(req.userId).toBe("12345");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
