const express = require("express");
const { register, login } = require("../controllers/authController");
const corsMiddleware = require("../config/corsOptions");

const router = express.Router();

// ✅ CORS pour toutes les routes
router.use(corsMiddleware);

// ✅ Préflight OPTIONS (indispensable en Express 5)
router.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
