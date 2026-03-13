const express = require("express");
const router = express.Router();
const commbasics = require("../models/Commbasics");

// GET /api/communication/basics/:languageCode
router.get("/basics/:languageCode", async (req, res) => {
  try {
    const { languageCode } = req.params;

    const data = await commbasics.findOne({
      languageCode: new RegExp(`^${languageCode}$`, 'i')
    });

    if (!data) {
      return res.status(404).json({ message: "Language data not found" });
    }

    res.status(200).json({ items: data.items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;