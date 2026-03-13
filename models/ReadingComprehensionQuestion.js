const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  id: String,
  text: String,
  isCorrect: Boolean
});

const questionSchema = new mongoose.Schema({
  questionId: String,
  languageCode: String,
  readingTextId: String,
  readingTextName: String,
  questionText: String,
  options: [optionSchema],
  correctAnswerId: String,
  order: Number
}, { timestamps: true });

module.exports = mongoose.model(
  "ReadingComprehensionQuestion",
  questionSchema,
  "readingcomprehensionquestions"
);