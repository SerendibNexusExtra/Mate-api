const express = require("express");
const router = express.Router();
const {
  getPronunciationByLanguage,
} = require("./pronunciationService");

router.get("/:lang", async (req, res) => {
  try {
    const data = await getPronunciationByLanguage(req.params.lang);
    if (!data) {
      return res.status(404).json({ message: "No pronunciation data found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;