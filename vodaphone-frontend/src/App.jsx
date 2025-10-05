import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function Nav() {
  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: 10 }}>Accueil</Link>
      <Link to="/register" style={{ marginRight: 10 }}>Inscription</Link>
      <Link to="/login" style={{ marginRight: 10 }}>Connexion</Link>
      <Link to="/profile">Profil</Link>
    </nav>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<div style={{padding:20}}>Bienvenue sur VodaPhone 🚀</div>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/password" element={<ChangePassword />} />
      </Routes>
    </div>
  );
}
