import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token); // ✅ met à jour le contexte global
      navigate("/profile");
    } catch {
      setError("Identifiants invalides");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Se connecter</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
