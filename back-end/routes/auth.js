const express = require("express");
const cors = require("cors");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// 1) Config CORS
const corsOptions = {
  origin: [
    "https://vodaphone.netlify.app", // prod
    "http://localhost:3000",         // dev
    /\.netlify\.app$/,               // previews Netlify
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// 2) Appliquer CORS AVANT les routes
router.use(cors(corsOptions));

// 3) (Important) Répondre proprement aux préflight OPTIONS SANS router.options(...)
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

  if (req.method === "OPTIONS") return res.sendStatus(204); // ✅ préflight géré ici
  next();
});

// 4) Routes
router.post("/register", register);
router.post("/login", login);

module.exports = router;
