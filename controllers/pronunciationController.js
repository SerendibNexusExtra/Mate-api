const PronunciationActivity = require('../models/Pronunciationactivity');

// @desc    Get all sound types for a language
// @route   GET /api/pronunciations/:languageCode
// @access  Public
// In controllers/pronunciationController.js - update getSoundTypes
exports.getSoundTypes = async (req, res) => {
  try {
    const { languageCode } = req.params;
    
    const possibleCodes = [
      languageCode,
      languageCode.toLowerCase(),
      languageCode.split('-')[0]
    ];
    
    const activities = await PronunciationActivity.find({
      languageCode: { $in: possibleCodes }
    });
    
    if (!activities || activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No pronunciation data found'
      });
    }
    
    // Format the response to match what frontend expects
    const soundTypes = activities.map(activity => ({
      soundTypeId: activity.soundTypeId,     // Use this field
      soundTypeName: activity.soundTypeName, // Use this field
      iconUrl: `https://your-domain.com/icons/${activity.soundTypeId}.png`,
      exampleWords: activity.activities?.flatMap(a => 
        a.questions?.map(q => ({
          id: q.id,
          word: q.question,
          phonetic: q.explanation || ''
        })) || []
      ) || []
    }));
    
    res.json({
      success: true,
      soundTypes
    });
  } catch (error) {
    console.error('Error fetching sound types:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update getSoundTypeActivities to use the correct fields
exports.getSoundTypeActivities = async (req, res) => {
  try {
    const { languageCode, soundTypeId } = req.params;
    
    console.log('Fetching activities for:', { languageCode, soundTypeId });
    
    // Try different formats of language code
    const possibleCodes = [
      languageCode,
      languageCode.toLowerCase(),
      languageCode.split('-')[0]
    ];
    
    const activity = await PronunciationActivity.findOne({
      languageCode: { $in: possibleCodes },
      soundTypeId: soundTypeId  // This should match your database field
    });
    
    if (!activity) {
      console.log('No activity found for:', { languageCode, soundTypeId });
      return res.status(404).json({
        success: false,
        error: 'Sound type not found'
      });
    }
    
    // Map the activities correctly
    const activities = activity.activities.map(a => ({
      id: a.id,
      name: a.name,
      questionCount: a.questionCount || a.questions?.length || 0
    }));
    
    console.log('Found activities:', activities.length);
    
    res.json({
      success: true,
      data: {
        soundTypeId: activity.soundTypeId,
        soundTypeName: activity.soundTypeName,
        activities: activities
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get questions for a specific sound type and activity
// @route   GET /api/pronunciations/:languageCode/:soundTypeId/:activityId/questions
// @access  Public
exports.getActivityQuestions = async (req, res) => {
  try {
    const { languageCode, soundTypeId, activityId } = req.params;
    
    console.log('Fetching questions for:', { languageCode, soundTypeId, activityId });
    
    // Try different formats of language code
    const possibleCodes = [
      languageCode,
      languageCode.toLowerCase(),
      languageCode.split('-')[0]
    ];
    
    // Find the pronunciation activity
    const activity = await PronunciationActivity.findOne({
      languageCode: { $in: possibleCodes },
      soundTypeId: soundTypeId
    });
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Sound type not found'
      });
    }
    
    // Find the specific activity by ID
    const targetActivity = activity.activities.find(a => a.id === activityId);
    
    if (!targetActivity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }
    
    // Format questions for the frontend
    const questions = targetActivity.questions.map(q => ({
      id: q.id,
      questionText: q.question,
      audioUrl: q.audioUrl,
      options: q.options.map((text, index) => ({
        id: index,
        text: text
      })),
      correctAnswerIndex: q.correctAnswer,
      explanation: q.explanation,
      type: 'text' // or 'audio' if you want to differentiate
    }));
    
    res.json({
      success: true,
      data: {
        activityId: targetActivity.id,
        activityName: targetActivity.name,
        soundTypeName: activity.soundTypeName,
        questionCount: targetActivity.questionCount || questions.length,
        questions: questions
      }
    });
  } catch (error) {
    console.error('Error fetching activity questions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all activities for a sound type
// @route   GET /api/pronunciations/:languageCode/:soundTypeId/activities
// @access  Public
exports.getSoundTypeActivities = async (req, res) => {
  try {
    const { languageCode, soundTypeId } = req.params;
    
    // Try different formats of language code
    const possibleCodes = [
      languageCode,
      languageCode.toLowerCase(),
      languageCode.split('-')[0]
    ];
    
    const activity = await PronunciationActivity.findOne({
      languageCode: { $in: possibleCodes },
      soundTypeId: soundTypeId
    });
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Sound type not found'
      });
    }
    
    const activities = activity.activities.map(a => ({
      id: a.id,
      name: a.name,
      questionCount: a.questionCount || a.questions?.length || 0
    }));
    
    res.json({
      success: true,
      data: {
        soundTypeId: activity.soundTypeId,
        soundTypeName: activity.soundTypeName,
        activities: activities
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};