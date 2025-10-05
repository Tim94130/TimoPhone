import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Mon profil</h2>
      <p><b>Email :</b> {user.email}</p>
      <p><b>Créé le :</b> {new Date(user.createdAt).toLocaleString()}</p>
      <Link to="/password">Changer mon mot de passe</Link>
      <br />
      <button onClick={handleLogout} style={{ marginTop: 15 }}>
        Déconnexion
      </button>
    </div>
  );
}
