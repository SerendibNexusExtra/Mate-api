const VocabularyQuestion = require('../models/VocabularyQuestion');

// Get questions by module ID and type
exports.getQuestionsByModuleAndType = async (req, res) => {
  try {
    const { moduleId, type } = req.params;
    const languageCode = req.query.languageCode || 'en-US';
    
    console.log('Fetching questions for:', { moduleId, type, languageCode });
    
    const questions = await VocabularyQuestion.find({
      moduleId,
      type,
      languageCode
    });
    
    console.log(`Found ${questions.length} questions`);
    
    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get questions by module ID only
exports.getQuestionsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const languageCode = req.query.languageCode || 'en-US';
    
    const questions = await VocabularyQuestion.find({
      moduleId,
      languageCode
    });
    
    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await VocabularyQuestion.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create new question
exports.createQuestion = async (req, res) => {
  try {
    const question = new VocabularyQuestion(req.body);
    await question.save();
    
    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const question = await VocabularyQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await VocabularyQuestion.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};