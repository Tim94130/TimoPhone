const express = require("express");
const cors = require("cors");
const { getProfile, updatePassword } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(cors({
  origin: "https://68e54249f4b898654b3710e4--vodaphone.netlify.app",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
