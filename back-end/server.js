const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");

const app = express();

// Middleware JSON
app.use(express.json());

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Routes principales
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend VodaPhone opérationnel !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Serveur lancé sur le port ${PORT}`));
