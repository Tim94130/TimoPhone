const express = require("express");
const cors = require("cors");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const contactController = require("../controllers/contactController");

router.use(cors({
  origin: "https://68e54249f4b898654b3710e4--vodaphone.netlify.app",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

router.use(requireAuth);

router.get("/", contactController.getContacts);    
router.post("/", contactController.createContact);    
router.patch("/:id", contactController.updateContact); 
router.delete("/:id", contactController.deleteContact); 

module.exports = router;
