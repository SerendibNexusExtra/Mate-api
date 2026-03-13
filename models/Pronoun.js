// models/Pronoun.js
const mongoose = require("mongoose");

const PronounSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    languageCode: { type: String, required: true },
    items: [
      {
        word: { type: String, required: true },
        type: { type: String, enum: ["Subject", "Object"], required: true },
        example: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pronoun", PronounSchema);
