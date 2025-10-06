const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Le numéro de téléphone est obligatoire"],
    match: [/^\d{10}$/, "Le numéro de téléphone doit contenir exactement 10 chiffres"],
  },
});

// 🔹 Vérifie qu’un numéro n’existe pas déjà pour cet utilisateur
contactSchema.pre("save", async function (next) {
  const existing = await mongoose.model("Contact").findOne({
    userId: this.userId,
    phone: this.phone,
  });

  if (existing) {
    const err = new Error("Ce numéro de téléphone existe déjà pour cet utilisateur");
    err.status = 400;
    return next(err);
  }
  next();
});

module.exports = mongoose.model("Contact", contactSchema);
