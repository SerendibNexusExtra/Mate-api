const Score = require('../models/Score');

// @desc    Save a new score
// @route   POST /api/scores
// @access  Private
exports.saveScore = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      module,
      moduleName,
      languageCode,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      completedAt
    } = req.body;

    // Validate required fields
    if (!userId || !userEmail || !module || !languageCode || score === undefined || 
        !correctAnswers || !totalQuestions) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate score range
    if (score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        error: 'Score must be between 0 and 100'
      });
    }

    // Get the next attempt number for this user/module/language
    const attemptNumber = await Score.getNextAttemptNumber(userId, module, languageCode);

    // Create new score entry with attempt number
    const newScore = new Score({
      userId,
      userEmail,
      module,
      moduleName: moduleName || module,
      languageCode,
      attemptNumber,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent: timeSpent || 0,
      completedAt: completedAt || new Date()
    });

    await newScore.save();

    // Get user's progress after saving
    const userProgress = await Score.getUserAverageScore(userId, languageCode);
    const bestScore = await Score.getUserBestScore(userId, module, languageCode);
    const attemptHistory = await Score.getUserAttempts(userId, module, languageCode);

    res.status(201).json({
      success: true,
      data: newScore,
      progress: {
        averageScore: userProgress.averageScore,
        totalPractices: userProgress.totalPractices,
        bestScore: bestScore?.score || 0,
        currentAttempt: attemptNumber,
        totalAttemptsForModule: attemptHistory.length,
        attemptHistory: attemptHistory.map(attempt => ({
          attempt: attempt.attemptNumber,
          score: attempt.score,
          date: attempt.completedAt
        }))
      }
    });
  } catch (error) {
    console.error('Error saving score:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while saving score'
    });
  }
};

// @desc    Get user's scores
// @route   GET /api/scores/user/:userId
// @access  Private
exports.getUserScores = async (req, res) => {
  try {
    const { userId } = req.params;
    const { languageCode, module, limit = 50 } = req.query;

    // Build query
    const query = { userId };
    if (languageCode) query.languageCode = languageCode;
    if (module) query.module = module;

    const scores = await Score.find(query)
      .sort({ completedAt: -1 })
      .limit(parseInt(limit));

    // Get statistics with attempt information
    const statistics = await Score.aggregate([
      { $match: { userId } },
      { $group: {
        _id: null,
        totalPractices: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
        totalCorrectAnswers: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' },
        averageAttemptsPerModule: { $avg: '$attemptNumber' }
      }}
    ]);

    // Get scores by module with attempt details
    const scoresByModule = await Score.aggregate([
      { $match: { userId } },
      { $group: {
        _id: { 
          module: '$module', 
          moduleName: '$moduleName', 
          languageCode: '$languageCode' 
        },
        attempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' },
        lastAttempt: { $max: '$completedAt' },
        lastAttemptNumber: { $max: '$attemptNumber' },
        attemptNumbers: { $push: '$attemptNumber' },
        scores: { $push: '$score' }
      }},
      { $sort: { lastAttempt: -1 } }
    ]);

    res.json({
      success: true,
      data: scores,
      statistics: statistics[0] || {
        totalPractices: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        totalCorrectAnswers: 0,
        totalQuestions: 0,
        averageAttemptsPerModule: 0
      },
      scoresByModule: scoresByModule.map(module => ({
        ...module,
        improvement: module.scores.length > 1 
          ? module.scores[module.scores.length - 1] - module.scores[0]
          : 0,
        bestAttempt: Math.max(...module.scores),
        worstAttempt: Math.min(...module.scores)
      }))
    });
  } catch (error) {
    console.error('Error fetching user scores:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching scores'
    });
  }
};

// @desc    Get user's attempts for a specific module
// @route   GET /api/scores/attempts/:userId/:module
// @access  Private
exports.getModuleAttempts = async (req, res) => {
  try {
    const { userId, module } = req.params;
    const { languageCode } = req.query;

    if (!languageCode) {
      return res.status(400).json({
        success: false,
        error: 'Language code is required'
      });
    }

    const attempts = await Score.getUserAttempts(userId, module, languageCode);
    const history = await Score.getAttemptHistory(userId, module, languageCode);

    // Calculate improvement metrics
    let improvement = 0;
    let bestAttempt = 0;
    let worstAttempt = 100;
    
    if (attempts.length > 0) {
      const scores = attempts.map(a => a.score);
      bestAttempt = Math.max(...scores);
      worstAttempt = Math.min(...scores);
      
      if (attempts.length > 1) {
        improvement = scores[0] - scores[scores.length - 1];
      }
    }

    res.json({
      success: true,
      data: {
        module,
        languageCode,
        totalAttempts: attempts.length,
        currentAttempt: attempts.length > 0 ? attempts[0].attemptNumber : 0,
        bestAttempt,
        worstAttempt,
        improvement,
        attempts: attempts.map(attempt => ({
          attemptNumber: attempt.attemptNumber,
          score: attempt.score,
          correctAnswers: attempt.correctAnswers,
          totalQuestions: attempt.totalQuestions,
          percentage: `${attempt.score}%`,
          timeSpent: attempt.timeSpent,
          completedAt: attempt.completedAt,
          isPassing: attempt.score >= 70,
          isBest: attempt.score === bestAttempt,
          isWorst: attempt.score === worstAttempt
        })),
        history
      }
    });
  } catch (error) {
    console.error('Error fetching module attempts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching attempts'
    });
  }
};

// @desc    Get leaderboard for a module
// @route   GET /api/scores/leaderboard/:module
// @access  Public
exports.getModuleLeaderboard = async (req, res) => {
  try {
    const { module } = req.params;
    const { languageCode = 'en-US', limit = 10 } = req.query;

    const leaderboard = await Score.getModuleLeaderboard(module, languageCode, parseInt(limit));

    // Get module statistics with attempt info
    const moduleStats = await Score.aggregate([
      { $match: { module, languageCode } },
      { $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        averageScore: { $avg: '$score' },
        highestScore: { $max: '$score' },
        averageAttemptsPerUser: { $avg: '$attemptNumber' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }},
      { $project: {
        totalAttempts: 1,
        uniqueUsersCount: { $size: '$uniqueUsers' },
        averageScore: 1,
        highestScore: 1,
        averageAttemptsPerUser: 1,
        totalTimeSpent: 1
      }}
    ]);

    res.json({
      success: true,
      data: leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
        improvement: entry.totalAttempts > 1 ? 'Multiple attempts' : 'First attempt'
      })),
      statistics: moduleStats[0] || {
        totalAttempts: 0,
        uniqueUsersCount: 0,
        averageScore: 0,
        highestScore: 0,
        averageAttemptsPerUser: 0,
        totalTimeSpent: 0
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching leaderboard'
    });
  }
};

// @desc    Get user's progress over time with attempt tracking
// @route   GET /api/scores/progress/:userId
// @access  Private
exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { languageCode, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const match = {
      userId,
      completedAt: { $gte: startDate }
    };
    if (languageCode) match.languageCode = languageCode;

    // Get daily progress with attempt counts
    const dailyProgress = await Score.aggregate([
      { $match: match },
      { $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          module: '$module'
        },
        attempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
        attemptNumbers: { $push: '$attemptNumber' }
      }},
      { $sort: { '_id.date': -1 } }
    ]);

    // Get language mastery with attempt history
    const languageMastery = await Score.aggregate([
      { $match: { userId } },
      { $group: {
        _id: { languageCode: '$languageCode' },
        totalPractices: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' },
        lastPractice: { $max: '$completedAt' },
        totalAttempts: { $sum: '$attemptNumber' },
        averageAttempts: { $avg: '$attemptNumber' },
        modules: { $addToSet: '$module' }
      }},
      { $sort: { lastPractice: -1 } }
    ]);

    // Get module improvement trends
    const moduleTrends = await Score.aggregate([
      { $match: { userId } },
      { $sort: { completedAt: 1 } },
      { $group: {
        _id: { module: '$module', languageCode: '$languageCode' },
        attempts: { $push: {
          attemptNumber: '$attemptNumber',
          score: '$score',
          date: '$completedAt'
        }},
        firstScore: { $first: '$score' },
        lastScore: { $last: '$score' }
      }},
      { $project: {
        module: '$_id.module',
        languageCode: '$_id.languageCode',
        totalAttempts: { $size: '$attempts' },
        firstScore: 1,
        lastScore: 1,
        improvement: { $subtract: ['$lastScore', '$firstScore'] },
        attempts: 1
      }}
    ]);

    res.json({
      success: true,
      data: {
        dailyProgress,
        languageMastery,
        moduleTrends,
        period: `${days} days`,
        summary: {
          totalPractices: dailyProgress.reduce((sum, day) => sum + day.attempts, 0),
          averageDailyAttempts: dailyProgress.length > 0 
            ? (dailyProgress.reduce((sum, day) => sum + day.attempts, 0) / dailyProgress.length).toFixed(1)
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching progress'
    });
  }
};

// @desc    Get single score by ID
// @route   GET /api/scores/:id
// @access  Private
exports.getScoreById = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);

    if (!score) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    // Get previous and next attempts for context
    const previousAttempt = await Score.findOne({
      userId: score.userId,
      module: score.module,
      languageCode: score.languageCode,
      attemptNumber: score.attemptNumber - 1
    });

    const nextAttempt = await Score.findOne({
      userId: score.userId,
      module: score.module,
      languageCode: score.languageCode,
      attemptNumber: score.attemptNumber + 1
    });

    res.json({
      success: true,
      data: {
        ...score.toObject(),
        context: {
          previousAttempt: previousAttempt ? {
            attemptNumber: previousAttempt.attemptNumber,
            score: previousAttempt.score,
            improvement: score.score - previousAttempt.score
          } : null,
          nextAttempt: nextAttempt ? {
            attemptNumber: nextAttempt.attemptNumber,
            score: nextAttempt.score,
            improvement: nextAttempt.score - score.score
          } : null,
          isFirstAttempt: !previousAttempt,
          isLastAttempt: !nextAttempt
        }
      }
    });
  } catch (error) {
    console.error('Error fetching score:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching score'
    });
  }
};

// @desc    Delete a score
// @route   DELETE /api/scores/:id
// @access  Private
exports.deleteScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);

    if (!score) {
      return res.status(404).json({
        success: false,
        error: 'Score not found'
      });
    }

    // Optional: Add authorization check here
    // if (score.userId !== req.user.id) {
    //   return res.status(403).json({ error: 'Not authorized' });
    // }

    await score.deleteOne();

    res.json({
      success: true,
      message: 'Score deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting score'
    });
  }
};