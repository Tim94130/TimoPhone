import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import "../css/nav.css"; // ✅ on importe le fichier CSS

function Nav() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      {isLoggedIn ? (
        <div className="nav-links">
          <Link to="/profile" className="nav-link">Profil</Link>
          <button onClick={handleLogout} className="nav-button">Déconnexion</button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/register" className="nav-link">Inscription</Link>
          <Link to="/login" className="nav-link">Connexion</Link>
        </div>
      )}
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/password" element={<ChangePassword />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <AppRoutes />
    </AuthProvider>
  );
}
