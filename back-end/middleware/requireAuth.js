const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Accès refusé : pas de token" });

    const token = authHeader.split(" ")[1]; 
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = requireAuth;
