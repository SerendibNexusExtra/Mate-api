const mongoose = require("mongoose");

const ExampleWordSchema = new mongoose.Schema({
  id: Number,
  word: String,
});

const SoundTypeSchema = new mongoose.Schema({
  id: String,
  name: String,
  iconUrl: String,
  exampleWords: [ExampleWordSchema],
});

const PronunciationSchema = new mongoose.Schema(
  {
    language: String,
    languageCode: String,
    soundTypes: [SoundTypeSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Pronunciation",
  PronunciationSchema,
  "pronunciations"  
);