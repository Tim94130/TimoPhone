import { useState } from "react";
import api from "../api";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

 
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    
    if (newPassword.length < 8) {
      return setErr("Le mot de passe doit contenir au moins 8 caractères.");
    }

    if (!strongPasswordRegex.test(newPassword)) {
      return setErr(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
    }

    try {
      const token = localStorage.getItem("token");
      await api.patch(
        "/user/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Mot de passe mis à jour !");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setErr(error.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Changer le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Ancien mot de passe"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <button type="submit">Changer</button>
      </form>
      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
