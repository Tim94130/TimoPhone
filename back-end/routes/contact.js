const express = require("express");
const cors = require("cors");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const contactController = require("../controllers/contactController");

// 🔹 Configuration CORS commune
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

// 🔹 Appliquer CORS avant tout
router.use(cors(corsOptions));

// 🔹 Middleware pour gérer proprement les requêtes OPTIONS (préflight)
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
    return res.sendStatus(204); // ✅ réponse préflight immédiate
  }

  next();
});

// 🔹 Authentification obligatoire ensuite
router.use(requireAuth);

// 🔹 Routes Contact
router.get("/", contactController.getContacts);
router.post("/", contactController.createContact);
router.patch("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
