const express = require("express");
const cors = require("cors");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const contactController = require("../controllers/contactController");

router.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

router.use(requireAuth);

router.get("/", contactController.getContacts);    
router.post("/", contactController.createContact);    
router.patch("/:id", contactController.updateContact); 
router.delete("/:id", contactController.deleteContact); 

module.exports = router;
