const express = require("express");
const Contact = require("../models/Contact");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Toutes les routes sont protégées
router.use(requireAuth);

// GET /contacts -> mes contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.userId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /contacts -> ajouter un contact
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const contact = new Contact({
      user: req.userId,
      firstName,
      lastName,
      phone,
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /contacts/:id -> mise à jour
router.patch("/:id", async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /contacts/:id -> suppression
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    res.json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
