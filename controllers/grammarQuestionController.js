// controllers/grammarQuestionController.js
const GrammarQuestion = require("../models/GrammarQuestion");

// GET questions by languageCode and tenseId
exports.getQuestionsByTense = async (req, res) => {
  try {
    const { languageCode, tenseId } = req.params;

    const questions = await GrammarQuestion.find({ languageCode, tenseId });

    if (!questions || questions.length === 0)
      return res.status(404).json({ message: "No questions found for this tense" });

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};