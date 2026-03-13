const mongoose = require("mongoose");

const readingTextSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  readingMinutes: Number,
  wordCount: Number,
  level: String,
  content: String
});

const readingComprehensionSchema = new mongoose.Schema({
  language: String,
  languageCode: String,
  readingTexts: [readingTextSchema]
}, { timestamps: true });

module.exports = mongoose.model(
  "ReadingComprehension",
  readingComprehensionSchema,
  "readingcomprehensions"
);