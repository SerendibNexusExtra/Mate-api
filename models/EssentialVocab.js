const mongoose = require("mongoose");

const vocabItemSchema = new mongoose.Schema({
  value: String,
  name: String,
  image: String,
  sound: String,
  description: String,
});

const essentialVocabSchema = new mongoose.Schema(
  {
    languageCode: String,
    language: String,
    categories: {
      numbers: [vocabItemSchema],
      colors: [vocabItemSchema],
      days: [vocabItemSchema],
      months: [vocabItemSchema],
      "common-things": [vocabItemSchema],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EssentialVocab",
  essentialVocabSchema
);
