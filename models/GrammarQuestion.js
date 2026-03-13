// models/GrammarQuestion.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    languageCode: { type: String, required: true },
    tenseId: { type: String, required: true },
    tenseName: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GrammarQuestion", questionSchema, "advancedgrammarquestions");