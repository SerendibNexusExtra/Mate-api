const mongoose = require("mongoose");

const vocabularyQuestionSchema = new mongoose.Schema({
  languageCode: { type: String, required: true },
  moduleId: String,
  moduleName: String,
  type: String,
  question: String,
  options: [String],
  correctAnswer: String
}, { timestamps: true });

module.exports = mongoose.model(
  "VocabularyExpansionQuestion",
  vocabularyQuestionSchema,
  "vocabularyexpansionquestions"
);