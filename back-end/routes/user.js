const express = require("express");
const cors = require("cors");
const { getProfile, updatePassword } = require("../controllers/userController");
console.log("getProfile:", getProfile);
console.log("updatePassword:", updatePassword);

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// ✅ CORS appliqué à toutes les routes /user
router.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Routes protégées
router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
