const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connecté à MongoDB"))
    .catch((err) => console.error("❌ Erreur MongoDB:", err));
}

const swaggerPath = path.join(__dirname, "swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("📘 Swagger disponible sur /api-docs");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Backend VodaPhone avec MVC et Swagger !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur lancé sur : http://localhost:${PORT}`)
);
module.exports = app;