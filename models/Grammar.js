const mongoose = require('mongoose');

const tenseSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  formula: String,
  examples: [String], 
  proTips: [String] 
});

const grammarSchema = new mongoose.Schema({
  language: String,
  languageCode: String,
  tenses: [tenseSchema]
}, { timestamps: true });

module.exports = mongoose.model('Grammar', grammarSchema, 'advancedgrammars');