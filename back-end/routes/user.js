const express = require("express");
const cors = require("cors");
const { getProfile, updatePassword } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// ✅ CORS avant le middleware requireAuth
router.use(
  cors({
    origin: [
      "https://vodaphone.netlify.app", // ton front Netlify
      /\.netlify\.app$/,               // toutes les prévisualisations Netlify
      "http://localhost:3000",         // pour le dev local
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

router.options(cors());


// ✅ Protection des routes après CORS
router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
