const express = require("express");
const cors = require("cors");
const { getProfile, updatePassword } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
