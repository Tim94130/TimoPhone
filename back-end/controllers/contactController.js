const Contact = require("../models/Contact");

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.userId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName || !phone)
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });

    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ message: "Le numéro doit contenir exactement 10 chiffres" });

    const existing = await Contact.findOne({ userId: req.userId, phone });
    if (existing)
      return res.status(400).json({ message: "Ce numéro de téléphone existe déjà" });

    const newContact = new Contact({ userId: req.userId, firstName, lastName, phone });
    await newContact.save();

    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateContact = async (req, res) => {
  try {
    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // on vérifie bien que le contact appartient à l'utilisateur
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Contact introuvable" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la mise à jour" });
  }
};

// 🔹 Supprimer un contact
exports.deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Contact introuvable" });
    res.json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de la suppression" });
  }
};
