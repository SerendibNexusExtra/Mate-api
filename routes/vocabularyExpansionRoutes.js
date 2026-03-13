const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Vocabulary = mongoose.connection.collection(
  "vocabularyexpansionquestions",
);

/* TEST */
router.get("/test", (req, res) => {
  res.json({ status: "vocabulary expansion working" });
});

/* MAIN API */
router.get("/:languageCode", async (req, res) => {
  try {
    const { languageCode } = req.params;
    const { typeId } = req.query; // travel, food etc

    const data = await Vocabulary.find({
      languageCode: languageCode.toUpperCase(),
    }).toArray();

    if (!data.length)
      return res.status(404).json({ message: "Language not found" });

    if (!typeId) {
      return res.json(data); // full flat list
    }

    // Filter by Travel / Food / Work
    const filtered = data.filter(
      (q) => q.type.toLowerCase() === typeId.toLowerCase(),
    );

    if (!filtered.length)
      return res.status(404).json({ message: "Type not found" });

    // Convert to your Yes/No format
    const response = {
      id: typeId,
      name: `${typeId} Vocabulary`,
      description: `Vocabulary for ${typeId}`,
      questions: filtered.map((q) => ({
        id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
