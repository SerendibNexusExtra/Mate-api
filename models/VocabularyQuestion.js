const mongoose = require('mongoose');

const vocabularyQuestionSchema = new mongoose.Schema({
  _id: String,
  languageCode: {
    type: String,
    required: true,
    default: 'en-US'
  },
  moduleId: {
    type: String,
    required: true
  },
  moduleName: String,
  type: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  createdAt: Date,
  updatedAt: Date,
  __v: Number
}, {
  collection: 'vocabularyexpansionquestions'
});

module.exports = mongoose.model('VocabularyQuestion', vocabularyQuestionSchema);