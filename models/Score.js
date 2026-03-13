const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    lowercase: true,
    trim: true
  },
  module: {
    type: String,
    required: [true, 'Module is required'],
    index: true
  },
  moduleName: {
    type: String,
    required: [true, 'Module name is required']
  },
  languageCode: {
    type: String,
    required: [true, 'Language code is required'],
    index: true
  },
  attemptNumber: {
    type: Number,
    required: [true, 'Attempt number is required'],
    min: 1,
    default: 1
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0,
    max: 100
  },
  correctAnswers: {
    type: Number,
    required: [true, 'Correct answers count is required'],
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions count is required'],
    min: 1
  },
  timeSpent: {
    type: Number,
    required: [true, 'Time spent is required'],
    min: 0,
    default: 0
  },
  completedAt: {
    type: Date,
    required: [true, 'Completion date is required'],
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
ScoreSchema.index({ userId: 1, module: 1, languageCode: 1, attemptNumber: -1 });
ScoreSchema.index({ userId: 1, languageCode: 1, completedAt: -1 });
ScoreSchema.index({ module: 1, languageCode: 1, score: -1 });

// Virtual for percentage display
ScoreSchema.virtual('percentage').get(function() {
  return `${this.score}%`;
});

// Method to check if this is a passing score (70% or above)
ScoreSchema.methods.isPassing = function() {
  return this.score >= 70;
};

// Static method to get user's next attempt number
ScoreSchema.statics.getNextAttemptNumber = async function(userId, module, languageCode) {
  const lastAttempt = await this.findOne({ userId, module, languageCode })
    .sort({ attemptNumber: -1 })
    .limit(1);
  
  return lastAttempt ? lastAttempt.attemptNumber + 1 : 1;
};

// Static method to get user's best score for a module
ScoreSchema.statics.getUserBestScore = async function(userId, module, languageCode) {
  return this.findOne({ userId, module, languageCode })
    .sort({ score: -1, completedAt: -1 })
    .limit(1);
};

// Static method to get all attempts for a user in a module
ScoreSchema.statics.getUserAttempts = async function(userId, module, languageCode) {
  return this.find({ userId, module, languageCode })
    .sort({ attemptNumber: -1 })
    .select('attemptNumber score correctAnswers totalQuestions timeSpent completedAt');
};

// Static method to get user's average score for a language
ScoreSchema.statics.getUserAverageScore = async function(userId, languageCode) {
  const result = await this.aggregate([
    { $match: { userId, languageCode } },
    { $group: {
      _id: null,
      averageScore: { $avg: '$score' },
      totalPractices: { $sum: 1 },
      totalTimeSpent: { $sum: '$timeSpent' },
      bestScore: { $max: '$score' },
      averageAttempts: { $avg: '$attemptNumber' }
    }}
  ]);
  return result[0] || { averageScore: 0, totalPractices: 0, totalTimeSpent: 0, bestScore: 0, averageAttempts: 0 };
};

// Static method to get leaderboard for a module
ScoreSchema.statics.getModuleLeaderboard = async function(module, languageCode, limit = 10) {
  return this.aggregate([
    { $match: { module, languageCode } },
    { $sort: { score: -1, timeSpent: 1, completedAt: -1 } },
    { $group: {
      _id: '$userId',
      userEmail: { $first: '$userEmail' },
      bestScore: { $max: '$score' },
      bestTime: { $min: '$timeSpent' },
      totalAttempts: { $sum: 1 },
      lastAttempt: { $max: '$completedAt' },
      bestAttemptNumber: { $first: '$attemptNumber' }
    }},
    { $sort: { bestScore: -1, bestTime: 1 } },
    { $limit: limit }
  ]);
};

// Static method to get attempt history with improvement trend
ScoreSchema.statics.getAttemptHistory = async function(userId, module, languageCode) {
  return this.aggregate([
    { $match: { userId, module, languageCode } },
    { $sort: { attemptNumber: 1 } },
    { $project: {
      attemptNumber: 1,
      score: 1,
      correctAnswers: 1,
      totalQuestions: 1,
      timeSpent: 1,
      completedAt: 1,
      improvement: {
        $cond: {
          if: { $eq: [{ $indexOfArray: ["$attemptNumber", "$attemptNumber"] }, 0] },
          then: 0,
          else: {
            $subtract: [
              "$score",
              { $arrayElemAt: ["$scores", { $subtract: [{ $indexOfArray: ["$attemptNumber", "$attemptNumber"] }, 1] }] }
            ]
          }
        }
      }
    }}
  ]);
};

module.exports = mongoose.model('Score', ScoreSchema);