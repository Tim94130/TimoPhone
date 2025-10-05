const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Get my profile
// @route GET /user/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // on masque le password
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update password
// @route PATCH /user/password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
