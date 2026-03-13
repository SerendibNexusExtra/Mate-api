const mongoose = require("mongoose");

const sentenceBlockSchema = new mongoose.Schema(
  {
    structure: {
      type: String,
      required: true,
    },
    examples: {
      type: [String],
      required: true,
    },
  },
  { _id: false }
);

const tenseItemSchema = new mongoose.Schema({
  tense: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  affirmative: sentenceBlockSchema,
  negative: sentenceBlockSchema,
  question: sentenceBlockSchema,
});

const basicTenseSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  languageCode: {
    type: String,
    required: true, 
  },
  tense: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  affirmative: sentenceBlockSchema,
  negative: sentenceBlockSchema,
  question: sentenceBlockSchema,
});

module.exports = mongoose.model(
  "BasicTense",
  basicTenseSchema,
  "basictenses"
);