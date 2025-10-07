import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../css/register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  // 🔍 Vérifie la complexité du mot de passe et calcule un score
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    setStrength(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (strength < 3) {
      return setError(
        "Le mot de passe est trop faible. Utilisez des majuscules, chiffres et caractères spéciaux."
      );
    }

    try {
      await api.post("/auth/register", { email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return "Faible";
      case 2:
      case 3:
        return "Moyen";
      case 4:
      case 5:
        return "Fort";
      default:
        return "";
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-field">
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              checkPasswordStrength(e.target.value);
            }}
            required
          />
          {password && (
            <div className="password-strength">
              <div
                className="strength-bar"
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
            </div>
          )}
          {password && (
            <small className={`strength-text strength-${getStrengthLabel().toLowerCase()}`}>
              Force : {getStrengthLabel()}
            </small>
          )}
        </div>
        <button type="submit">S'inscrire</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <p>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
