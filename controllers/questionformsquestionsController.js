// controllers/questionformsquestionsController.js

const mongoose = require("mongoose");
const Question = require("../models/questionformsquestions");

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    console.error('Error in getAllQuestions:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get questions by type string (e.g., "yes/no-questions")
const getQuestionsByType = async (req, res) => {
  try {
    const { typeId } = req.params;
    console.log(`Fetching questions for type string: ${typeId}`);
    
    const questions = await Question.find({ questionTypeId: typeId });
    console.log(`Found ${questions.length} questions`);
    
    res.json(questions);
  } catch (err) {
    console.error('Error in getQuestionsByType:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ FIXED: Get questions by either ObjectId OR type string
const getQuestionsByTypeId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching questions with type identifier: ${id}`);
    
    let questions = [];
    
    // Check if it's a valid MongoDB ObjectId (24 hex chars)
    if (mongoose.Types.ObjectId.isValid(id)) {
      console.log(`Valid ObjectId format: ${id}`);
      
      // First, find the question to get its questionTypeId
      const question = await Question.findById(id);
      
      if (question) {
        console.log(`Found question with typeId: ${question.questionTypeId}`);
        
        // Now find all questions with the same questionTypeId
        questions = await Question.find({ 
          questionTypeId: question.questionTypeId 
        });
      } else {
        console.log(`No question found with _id: ${id}`);
        return res.json([]);
      }
    } else {
      // ✅ It's a string type (like "yes-no-questions")
      console.log(`Using as type string: ${id}`);
      
      // Find all questions with matching questionTypeId
      questions = await Question.find({ 
        questionTypeId: id 
      });
      
      console.log(`Found ${questions.length} questions for type: ${id}`);
    }
    
    res.json(questions);
    
  } catch (err) {
    console.error('Error in getQuestionsByTypeId:', err);
    res.status(500).json({ 
      error: err.message,
      message: "Failed to fetch questions"
    });
  }
};

// Get question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
  } catch (err) {
    console.error('Error in getQuestionById:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create question
const createQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const saved = await newQuestion.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error in createQuestion:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    
    const updated = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error in updateQuestion:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    
    const deleted = await Question.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted" });
  } catch (err) {
    console.error('Error in deleteQuestion:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionsByType,
  getQuestionsByTypeId,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};