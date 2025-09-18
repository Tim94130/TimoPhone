import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h2>Bienvenue sur VodaPhone</h2>;
}

function Login() {
  return <h2>Page Login</h2>;
}

function Register() {
  return <h2>Page Register</h2>;
}

function Contacts() {
  return <h2>Liste de mes contacts</h2>;
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Accueil</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/contacts">Contacts</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </Router>
  );
}

export default App;
