const mongoose = require('mongoose');

const learningLanguageSchema = new mongoose.Schema({
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  locale: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  goal: {
    type: Number,
    required: true,
    min: 1,
    max: 1440
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  nativeLanguage: {
    name: {
      type: String,
      required: true
    }
  },
  learningLanguages: [learningLanguageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);