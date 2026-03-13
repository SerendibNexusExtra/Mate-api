// routes/grammarQuestionRoutes.js
const express = require("express");
const router = express.Router();
const grammarQuestionController = require("../controllers/grammarQuestionController");

// Get all questions for a specific tense
router.get("/:languageCode/:tenseId", grammarQuestionController.getQuestionsByTense);

module.exports = router;