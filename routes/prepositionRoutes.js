const express = require("express");
const router = express.Router();
const Preposition = require("../models/Preposition");

// GET prepositions by language
router.get("/:languageCode", async (req, res) => {
  try {
    const { languageCode } = req.params;

    // Case-insensitive search (like your other controllers)
    const data = await Preposition.findOne({
      languageCode: new RegExp(`^${languageCode}$`, 'i')
    });

    if (!data) {
      // Return empty array instead of message to prevent frontend errors
      return res.status(200).json([]);
    }

    res.status(200).json(data.items || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;