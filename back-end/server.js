const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB Atlas"))
  .catch((err) => console.error("Erreur MongoDB:", err));

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Backend VodaPhone en ligne avec MongoDB !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur VodaPhone sur http://localhost:${PORT}`)
);
