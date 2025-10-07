const express = require("express");
const { getProfile, updatePassword } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const corsMiddleware = require("../config/corsOptions");

const router = express.Router();

// ✅ CORS
router.use(corsMiddleware);

// ✅ Préflight
router.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ✅ Auth
router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/password", updatePassword);

module.exports = router;
