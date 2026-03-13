const express = require('express');
const router = express.Router();
const {
  saveScore,
  getUserScores,
  getModuleAttempts,
  getModuleLeaderboard,
  getUserProgress,
  getScoreById,
  deleteScore
} = require('../controllers/scoreController');


// Score routes
router.post('/', saveScore); // POST /api/scores
router.get('/user/:userId', getUserScores); // GET /api/scores/user/:userId
router.get('/attempts/:userId/:module', getModuleAttempts); // GET /api/scores/attempts/:userId/:module
router.get('/progress/:userId', getUserProgress); // GET /api/scores/progress/:userId
router.get('/leaderboard/:module', getModuleLeaderboard); // GET /api/scores/leaderboard/:module
router.get('/:id', getScoreById); // GET /api/scores/:id
router.delete('/:id', deleteScore); // DELETE /api/scores/:id

module.exports = router;