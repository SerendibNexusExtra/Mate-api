// controllers/questionformsquestionsController.js
const Question = require("../models/questionformsquestions");

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get questions by type
const getQuestionsByType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const questions = await Question.find({ questionTypeId: typeId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};

// Update question
const updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionsByType,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
