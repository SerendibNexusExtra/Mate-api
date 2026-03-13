const express = require("express");
const EssentialVocab = require("../models/EssentialVocab");

const router = express.Router();
 
router.get("/:lang/:category", async (req, res) => {
  try {
    const { lang, category } = req.params;

    const doc = await EssentialVocab.findOne({
      languageCode: lang,
    });

    if (!doc) {
      return res.status(404).json({ message: "Language not found" });
    }

    const data = doc.categories[category];

    if (!data) {
      return res.status(400).json({ message: "Invalid category" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
