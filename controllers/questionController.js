const Question = require("../models/question");

// @desc    Get questions for practice greetings
// @route   GET /api/questions/practice/greetings
// @access  Public
const getPracticeGreetings = async (req, res) => {
  try {
    const { locale } = req.query;
    
    // Build query
    const query = { 
      module: "practice-greetings"
    };
    
    // Add language filter if locale is provided
    if (locale) {
      // Case-insensitive search for languageCode
      // This will match both "en-US" and "EN-US"
      query.languageCode = {
        $regex: new RegExp(`^${locale}$`, 'i') // 'i' makes it case-insensitive
      };
    }
    
    console.log("Query:", JSON.stringify(query, null, 2));
    
    const questions = await Question.find(query)
      .sort({ createdAt: 1 }); // Sort by creation date
    
    console.log(`Found ${questions.length} questions`);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice greetings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions for practice feelings
// @route   GET /api/questions/practice/feelings
// @access  Public
const getPracticeFeelings = async (req, res) => {
  try {
    const { locale } = req.query;
    
    // Build query
    const query = { 
      module: "practice-feelings"
    };
    
    // Add language filter if locale is provided
    if (locale) {
      // Case-insensitive search for languageCode
      query.languageCode = {
        $regex: new RegExp(`^${locale}$`, 'i')
      };
    }
    
    console.log("Query:", JSON.stringify(query, null, 2));
    
    const questions = await Question.find(query)
      .sort({ createdAt: 1 });
    
    console.log(`Found ${questions.length} questions`);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice feelings:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions by module (generic)
// @route   GET /api/questions/module/:module
// @access  Public
const getQuestionsByModule = async (req, res) => {
  try {
    const { module } = req.params;
    const { locale } = req.query;
    
    // Validate module
    const validModules = ["practice-greetings", "practice-feelings"];
    if (!validModules.includes(module)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module. Must be practice-greetings or practice-feelings"
      });
    }
    
    // Build query
    const query = { module };
    
    // Add language filter if locale is provided
    if (locale) {
      // Case-insensitive search for languageCode
      query.languageCode = {
        $regex: new RegExp(`^${locale}$`, 'i')
      };
    }
    
    console.log("Query:", JSON.stringify(query, null, 2));
    
    const questions = await Question.find(query)
      .sort({ createdAt: 1 });
    
    console.log(`Found ${questions.length} questions`);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error(`Error fetching questions for module ${module}:`, error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get all practice modules (for listing available practices)
// @route   GET /api/questions/practice/modules
// @access  Public
const getPracticeModules = async (req, res) => {
  try {
    const { locale } = req.query;
    
    // Build match stage
    const match = {};
    if (locale) {
      // Case-insensitive search for languageCode
      match.languageCode = {
        $regex: new RegExp(`^${locale}$`, 'i')
      };
    }
    
    const modules = await Question.aggregate([
      { $match: match },
      { 
        $group: {
          _id: "$module",
          count: { $sum: 1 },
          languages: { $addToSet: "$languageCode" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: modules
    });
  } catch (error) {
    console.error("Error fetching practice modules:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions for practice colours
// @route   GET /api/questions/practice/colours
const getPracticeColours = async (req, res) => {
  try {
    const { locale } = req.query;
    
    const query = { module: "practice-colours" };
    
    if (locale) {
      query.languageCode = { $regex: new RegExp(`^${locale}$`, 'i') };
    }
    
    const questions = await Question.find(query).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice colours:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions for practice numbers
// @route   GET /api/questions/practice/numbers
const getPracticeNumbers = async (req, res) => {
  try {
    const { locale } = req.query;
    
    const query = { module: "practice-numbers" };
    
    if (locale) {
      query.languageCode = { $regex: new RegExp(`^${locale}$`, 'i') };
    }
    
    const questions = await Question.find(query).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice numbers:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions for practice days
// @route   GET /api/questions/practice/days
const getPracticeDays = async (req, res) => {
  try {
    const { locale } = req.query;
    
    const query = { module: "practice-days" };
    
    if (locale) {
      query.languageCode = { $regex: new RegExp(`^${locale}$`, 'i') };
    }
    
    const questions = await Question.find(query).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice days:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions for practice months
// @route   GET /api/questions/practice/months
const getPracticeMonths = async (req, res) => {
  try {
    const { locale } = req.query;
    
    const query = { module: "practice-months" };
    
    if (locale) {
      query.languageCode = { $regex: new RegExp(`^${locale}$`, 'i') };
    }
    
    const questions = await Question.find(query).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice months:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get questions for common things
// @route   GET /api/questions/practice/common-things
const getPracticeCommonThings = async (req, res) => {
  try {
    const { locale } = req.query;
    
    const query = { module: "common-things" };
    
    if (locale) {
      query.languageCode = { $regex: new RegExp(`^${locale}$`, 'i') };
    }
    
    const questions = await Question.find(query).sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error("Error fetching practice common things:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

const getPrepositionsQuestions = async (req, res) => {
  try {
    const { locale = 'en-US' } = req.query;
    const questions = await Question.find({ 
      module: 'prepositions',
      languageCode: locale 
    });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  getPracticeGreetings,
  getPracticeFeelings,
  getQuestionsByModule,
  getPracticeModules,
  getPracticeColours,
  getPracticeNumbers,
  getPracticeDays,
  getPracticeMonths,
  getPracticeCommonThings,
  getPrepositionsQuestions
};