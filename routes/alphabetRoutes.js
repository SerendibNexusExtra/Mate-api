const express = require("express");
const router = express.Router();
const Alphabet = require("../models/Alphabet");

// GET all letters for a language
router.get("/:languageCode", async (req, res) => {
    try {
        const { languageCode } = req.params;
        const data = await Alphabet.findOne({ languageCode });

        if (!data) return res.status(404).json({ message: "Language not found" });

        res.json({
            letters: data.letters,
            content: data.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
