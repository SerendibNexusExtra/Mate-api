
const mongoose = require('mongoose');

const mcqQuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  audioUrl: {
    type: String,
    default: '',
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  explanation: {
    type: String,
    default: '',
    trim: true
  }
});

const activitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
 
  questionCount: {
    type: Number,
    default: 0
  },
  questions: [mcqQuestionSchema]
});

const pronunciationActivitySchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true
  },
  languageCode: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  soundTypeId: {
    type: String,
    required: true,
    trim: true
  },
  soundTypeName: {
    type: String,
    required: true,
    trim: true
  },
  activities: [activitySchema]
}, {
  timestamps: true
});

// Create compound index for faster queries
pronunciationActivitySchema.index({ languageCode: 1, soundTypeId: 1 });

const PronunciationActivity = mongoose.model('PronunciationActivity', pronunciationActivitySchema);

module.exports = PronunciationActivity;