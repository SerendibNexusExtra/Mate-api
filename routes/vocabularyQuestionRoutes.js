const express = require('express');
const router = express.Router();

// Import controllers
const {
  getQuestionsByModuleAndType,
  getQuestionsByModule,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/vocabularyQuestionController');

 
router.get('/module/:moduleId/type/:type', getQuestionsByModuleAndType);

 
router.get('/module/:moduleId', getQuestionsByModule);

 
router.get('/:id', getQuestionById);

// Create new question
router.post('/', createQuestion);

// Update question
router.put('/:id', updateQuestion);

// Delete question
router.delete('/:id', deleteQuestion);

module.exports = router;