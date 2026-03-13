// routes/pronunciationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSoundTypes,
  getActivityQuestions,
  getSoundTypeActivities
} = require('../controllers/pronunciationController');

// Get all sound types for a language
router.get('/:languageCode', getSoundTypes);

// Get all activities for a sound type - THIS IS THE MISSING ROUTE
router.get('/:languageCode/:soundTypeId/activities', getSoundTypeActivities);

// Get questions for a specific activity
router.get('/:languageCode/:soundTypeId/:activityId/questions', getActivityQuestions);

module.exports = router;