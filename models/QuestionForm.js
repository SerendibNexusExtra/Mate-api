// models/QuestionForm.js

const mongoose = require("mongoose");

const QuestionTypeSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  description: String,
  structure: String,
  examples: [String],
  formationRules: [String],
});

const QuestionFormSchema = new mongoose.Schema(
  {
    language: String,
    languageCode: String,
    questionTypes: [QuestionTypeSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "QuestionForm",
  QuestionFormSchema,
  "questionforms",
);
