 
const express = require("express");
const router = express.Router();
const Pronoun = require("../models/Pronoun"); // mongoose model

// GET /api/pronouns/:languageCode
router.get("/:languageCode", async (req, res) => {
  const { languageCode } = req.params;

  try {
    const pronouns = await Pronoun.findOne({ languageCode: languageCode.toUpperCase() });

    if (!pronouns) {
      return res.status(404).json({ message: "Pronouns not found for this language" });
    }

    res.json(pronouns);
  } catch (err) {
    console.error("Error fetching pronouns:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
