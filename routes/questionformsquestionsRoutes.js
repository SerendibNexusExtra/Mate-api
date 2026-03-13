// routes/questionformsquestionsRoutes.js
const express = require("express");
const {
  getAllQuestions,
  getQuestionsByType,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionformsquestionsController");

const router = express.Router();

// Get all questions
router.get("/", getAllQuestions);

// Get questions by type
router.get("/type/:typeId", getQuestionsByType);

// Get single question by ID
router.get("/:id", getQuestionById);

// Create new question
router.post("/", createQuestion);

// Update question
router.put("/:id", updateQuestion);

// Delete question
router.delete("/:id", deleteQuestion);

// Export for CommonJS
module.exports = router;
