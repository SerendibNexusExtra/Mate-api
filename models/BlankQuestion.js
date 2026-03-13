const mongoose = require('mongoose');

const blankQuestionSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true
  },
  languageCode: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['basic', 'intermediate', 'advanced']
  },
  module: {
    type: String,
    required: true,
    default: 'basic-tenses'
  },
  type: {
    type: String,
    required: true,
    default: 'blank'
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: {
      type: String,
      required: true
    }
  }],
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  tense: {
    type: String,
    required: true,
    enum: ['Simple Present', 'Simple Past', 'Simple Future']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlankQuestion', blankQuestionSchema);