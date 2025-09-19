const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB"))
  .catch(err => console.error("❌ Erreur MongoDB:", err));

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend VodaPhone avec MVC !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));
