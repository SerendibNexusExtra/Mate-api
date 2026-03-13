const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  word: String,
  type: String,
  usage: String,
  example: String,
});

const commbasicsSchema = new mongoose.Schema(
  {
    language: { type: String, required: true },
    languageCode: String,
    items: [itemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("commbasics", commbasicsSchema);
