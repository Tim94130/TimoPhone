const express = require("express");
const cors = require("cors");
const { getProfile, updatePassword } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);
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
router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
