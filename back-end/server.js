const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");

const app = express();

// ✅ Middleware CORS global
app.use(cors({
  origin: [
    "https://vodaphone.netlify.app", // 🔹 domaine Netlify final
    "http://localhost:3000",         // 🔹 pour le dev local
  ],
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Autoriser explicitement les requêtes OPTIONS (prévols CORS)
app.options("*", cors());

// 🧠 Log pour debug : voir d’où vient la requête
app.use((req, res, next) => {
  console.log("🌍 Requête reçue depuis :", req.headers.origin);
  next();
});

app.use(express.json());

// ✅ Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// ✅ Routes principales
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contact", contactRoutes); 

// ✅ Route racine
app.get("/", (req, res) => {
  res.send("🚀 Backend VodaPhone opérationnel !");
});
  
// ✅ Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
