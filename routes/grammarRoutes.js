const express = require('express');
const router = express.Router();
const grammarController = require('../controllers/grammarController');

// Get all tenses for a language
router.get('/:languageCode/tenses', grammarController.getTenses);

// Get tense by ID
router.get('/:languageCode/tense/:tenseId', grammarController.getTenseById);

module.exports = router;