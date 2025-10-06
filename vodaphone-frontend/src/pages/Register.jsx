import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { email, password });
      navigate("/login"); 
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <button type="submit">S'inscrire</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: 10 }}>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
