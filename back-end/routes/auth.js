const express = require("express");
const cors = require("cors");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.use(cors({
  origin: [
    "https://vodaphone.netlify.app", // ton front en production
    /\.netlify\.app$/,                // toutes les sous-URLs Netlify (prévisualisations)
    "http://localhost:3000"           // dev local
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

router.options("*", cors());

router.post("/register", register);
router.post("/login", login);

module.exports = router;
