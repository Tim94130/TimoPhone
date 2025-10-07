import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function Nav() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
      {isLoggedIn ? (
        <>
          <Link to="/profile" style={{ marginRight: 10 }}>Profil</Link>
          <button onClick={handleLogout}>Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/register" style={{ marginRight: 10 }}>Inscription</Link>
          <Link to="/login">Connexion</Link>
        </>
      )}
    </nav>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* 🚀 Redirection automatique de la racine vers /login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Pages principales */}
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
