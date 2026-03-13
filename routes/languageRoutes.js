const express = require("express");
const router = express.Router();
const Language = require("../models/Language");
const { translateUI } = require("../controllers/translateController");

// GET all languages
router.get("/", async (req, res) => {
  try {
    const languages = await Language.find().sort({ name: 1 });
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST /api/translate/ui -> Translate UI labels
router.post("/ui", translateUI);

module.exports = router;
