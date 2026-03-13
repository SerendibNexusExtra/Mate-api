const mongoose = require("mongoose");

const prepositionItemSchema = new mongoose.Schema({
  word: String,
  type: String,  
  usage: String,
  example: String
});

const prepositionSchema = new mongoose.Schema({
  language: String,
  languageCode: String,
  items: [prepositionItemSchema]
});

module.exports = mongoose.model("Preposition", prepositionSchema, "prepositions");
