const express = require("express");
const router = express.Router();
const BasicTense = require("../models/BasicTense");

router.get("/:languageCode", async (req, res) => {
  try {
    const { languageCode } = req.params;

    const tenses = await BasicTense.find({
      languageCode: { $regex: new RegExp(`^${languageCode}$`, 'i') }
    });

    if (!tenses || tenses.length === 0) {
      return res.status(404).json({
        message: "No basic tenses found for language: " + languageCode,
      });
    }

    res.json(tenses);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;