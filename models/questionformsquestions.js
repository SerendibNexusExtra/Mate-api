// models/questionformsquestions.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    languageCode: { type: String, required: true },
    questionTypeId: { type: String, required: true },
    questionTypeName: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("QuestionFormsQuestions", questionSchema);
