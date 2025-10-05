const express = require("express");
const cors = require("cors");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// ✅ CORS appliqué à toutes les routes du router
router.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
