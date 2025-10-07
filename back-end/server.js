const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");

const app = express();

// ✅ Middleware CORS intelligent avec regex pour Netlify
const allowedOrigins = [
  "https://vodaphone.netlify.app",  // ton front en prod
  "http://localhost:3000",          // ton front en dev local
  /\.netlify\.app$/                 // autorise aussi les URLs temporaires Netlify (build previews)
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowed = allowedOrigins.some(o =>
    typeof o === "string" ? o === origin : o.test(origin)
  );

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Log debug (visible dans Render)
  console.log(`🌍 CORS: ${origin} ${isAllowed ? "✅ autorisé" : "❌ refusé"}`);

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

// ✅ Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contact", contactRoutes);

// ✅ Route racine
app.get("/", (req, res) => {
  res.send("🚀 Backend VodaPhone opérationnel !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Serveur lancé sur le port ${PORT}`));
