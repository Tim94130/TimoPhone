const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const contactController = require("../controllers/contactController");
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

router.get("/", contactController.getContacts);
router.post("/", contactController.createContact);
router.patch("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
