import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../css/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", phone: "" });
  const [editContact, setEditContact] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

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

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setError("");

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


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  if (!user) return <p style={{ padding: 20 }}>Chargement…</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-top">
          <h2>Mon profil</h2>
          <button className="logout-button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
        <p>
          <b>Email :</b> {user.email}
        </p>
        <p>
          <b>Créé le :</b> {new Date(user.createdAt).toLocaleString()}
        </p>
        <Link to="/password">Changer mon mot de passe</Link>
      </div>

      <hr />

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
            const val = e.target.value.replace(/\D/g, "");
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
                    onChange={(e) =>
                      setEditContact({ ...editContact, firstName: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editContact.lastName}
                    onChange={(e) =>
                      setEditContact({ ...editContact, lastName: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    value={editContact.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 10)
                        setEditContact({ ...editContact, phone: val });
                    }}
                    maxLength="10"
                    required
                  />
                  <button type="submit" className="save">
                    💾
                  </button>
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => setEditContact(null)}
                  >
                    ❌
                  </button>
                </form>
              ) : (
                <>
                  <div className="contact-info">
                    {c.firstName} {c.lastName} — {c.phone}
                  </div>
                  <div className="contact-actions">
                    <button className="edit" onClick={() => setEditContact(c)}>
                      ✏️
                    </button>
                    <button className="delete" onClick={() => handleDelete(c._id)}>
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
