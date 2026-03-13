const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  word: String,
  meaning: String,
  example: String,
  image: String,
  audioUrl: String
});

const typeSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  words: [wordSchema]
});

const moduleSchema = new mongoose.Schema({
  id: String,
  name: String,
  types: [typeSchema]
});

const vocabularyExpansionSchema = new mongoose.Schema({
  _id: String,
  language: String,
  languageCode: String,  
  modules: [moduleSchema],
  meaning: String,
  createdAt: Date,
  updatedAt: Date,
  __v: Number
}, {
  collection: 'vocabularyexpansions'
});

module.exports = mongoose.model('VocabularyExpansion', vocabularyExpansionSchema);