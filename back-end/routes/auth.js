const express = require("express");
const cors = require("cors");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.use(cors({
  origin: "https://68e54249f4b898654b3710e4--vodaphone.netlify.app",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

router.post("/register", register);
router.post("/login", login);

module.exports = router;
