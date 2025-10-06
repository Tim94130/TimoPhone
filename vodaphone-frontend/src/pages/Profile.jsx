import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../css/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", phone: "" });
  const [editContact, setEditContact] = useState(null);
  const [error, setError] = useState(""); // 🔹 affichage des erreurs
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Récupération du profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
  }, [navigate, token]);

  // ✅ Récupération des contacts
  const fetchContacts = async () => {
    try {
      const res = await api.get("/contact", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Erreur chargement contacts :", err);
    }
  };

  useEffect(() => {
    if (token) fetchContacts();
  }, [token]);

  // ✅ Vérifie que le numéro de téléphone est valide
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  // ✅ Ajout d’un contact
  const handleAddContact = async (e) => {
    e.preventDefault();
    setError("");

    // Validation côté front
    if (!validatePhone(newContact.phone)) {
      setError("Le numéro de téléphone doit contenir exactement 10 chiffres.");
      return;
    }

    try {
      await api.post("/contact", newContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewContact({ firstName: "", lastName: "", phone: "" });
      fetchContacts();
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de l’ajout du contact.";
      setError(message);
    }
  };

  // ✅ Suppression d’un contact
  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
    } catch (err) {
      setError("Erreur lors de la suppression du contact.");
    }
  };

  // ✅ Édition d’un contact
  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePhone(editContact.phone)) {
      setError("Le numéro doit contenir exactement 10 chiffres.");
      return;
    }

    try {
      await api.patch(`/contact/${editContact._id}`, editContact, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditContact(null);
      fetchContacts();
    } catch (err) {
      const message = err.response?.data?.message || "Erreur lors de la modification.";
      setError(message);
    }
  };

  // ✅ Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Loading
  if (!user) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Mon profil</h2>
        <p><b>Email :</b> {user.email}</p>
        <p><b>Créé le :</b> {new Date(user.createdAt).toLocaleString()}</p>
        <Link to="/password">Changer mon mot de passe</Link>
      </div>

      <hr />

      {/* 🔹 Affichage des erreurs */}
      {error && <p className="error-message">{error}</p>}

      {/* 🔹 Formulaire d’ajout de contact */}
      <h3>Ajouter un contact</h3>
      <form onSubmit={handleAddContact}>
        <input
          type="text"
          placeholder="Prénom"
          value={newContact.firstName}
          onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={newContact.lastName}
          onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Téléphone (10 chiffres)"
          value={newContact.phone}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, ""); // uniquement chiffres
            if (val.length <= 10) setNewContact({ ...newContact, phone: val });
          }}
          maxLength="10"
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      {/* 🔹 Liste des contacts */}
      <h3>Mes contacts</h3>
      {contacts.length === 0 ? (
        <p>Aucun contact pour l’instant.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((c) => (
            <li key={c._id}>
              {editContact && editContact._id === c._id ? (
                <form onSubmit={handleEdit}>
                  <input
                    type="text"
                    value={editContact.firstName}
                    onChange={(e) => setEditContact({ ...editContact, firstName: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editContact.lastName}
                    onChange={(e) => setEditContact({ ...editContact, lastName: e.target.value })}
                  />
                  <input
                    type="tel"
                    value={editContact.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10) setEditContact({ ...editContact, phone: val });
                    }}
                    maxLength="10"
                    required
                  />
                  <button type="submit">💾</button>
                  <button type="button" onClick={() => setEditContact(null)}>❌</button>
                </form>
              ) : (
                <>
                  {c.firstName} {c.lastName} — {c.phone}{" "}
                  <button onClick={() => setEditContact(c)}>✏️</button>{" "}
                  <button onClick={() => handleDelete(c._id)}>🗑️</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
