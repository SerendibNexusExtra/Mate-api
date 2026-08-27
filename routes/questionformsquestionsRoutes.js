// routes/questionformsquestionsRoutes.js

const express = require("express");
const {
  getAllQuestions,
  getQuestionsByType,
  getQuestionsByTypeId,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionformsquestionsController");

const router = express.Router();

// Get all questions
router.get("/", getAllQuestions);

// ✅ IMPORTANT: Put more specific routes BEFORE generic ones
// Get questions by MongoDB _id
router.get("/typeid/:id", getQuestionsByTypeId);

// Get questions by type string (e.g., "yes/no-questions")
router.get("/type/:typeId", getQuestionsByType);

// Get single question by ID - THIS MUST COME LAST
router.get("/:id", getQuestionById);

// Create new question
router.post("/", createQuestion);

// Update question
router.put("/:id", updateQuestion);

// Delete question
router.delete("/:id", deleteQuestion);

module.exports = router;