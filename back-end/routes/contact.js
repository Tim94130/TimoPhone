const express = require("express");
const cors = require("cors");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const contactController = require("../controllers/contactController");
router.use(
  cors({
    origin: [
      "https://vodaphone.netlify.app", // ton front Netlify
      /\.netlify\.app$/,               // toutes les prévisualisations Netlify
      "http://localhost:3000",         // pour le dev local
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

router.options(cors());

router.use(requireAuth);


router.options("*", cors());
router.get("/", contactController.getContacts);    
router.post("/", contactController.createContact);    
router.patch("/:id", contactController.updateContact); 
router.delete("/:id", contactController.deleteContact); 

module.exports = router;
