const express = require("express");
const cors = require("cors");
const { getProfile, updatePassword } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// 🔹 Configuration CORS
const corsOptions = {
  origin: [
    "https://vodaphone.netlify.app", // ton front Netlify
    /\.netlify\.app$/,               // toutes les prévisualisations Netlify
    "http://localhost:3000",         // pour le dev local
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// 🔹 Middleware CORS global
router.use(cors(corsOptions));

// 🔹 Middleware pour gérer les requêtes OPTIONS (préflight)
router.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = corsOptions.origin.some((o) =>
    typeof o === "string" ? o === origin : o.test(origin)
  );
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(","));
  res.setHeader("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // ✅ fin du préflight
  }

  next();
});

// 🔹 Protection des routes (JWT obligatoire)
router.use(requireAuth);

// 🔹 Routes utilisateur
router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
