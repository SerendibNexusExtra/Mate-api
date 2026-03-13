const express = require("express");
const router = express.Router();
const {
  getPracticeGreetings,
  getPracticeFeelings,
  getPracticeColours,
  getPracticeNumbers,
  getPracticeDays,
  getPracticeMonths,
  getPracticeCommonThings,
  getQuestionsByModule,
  getPracticeModules,
  getPrepositionsQuestions
} = require("../controllers/questionController");

// Existing routes
router.get("/practice/modules", getPracticeModules);
router.get("/practice/greetings", getPracticeGreetings);
router.get("/practice/feelings", getPracticeFeelings);
router.get('/practice/prepositions' , getPrepositionsQuestions);


// New routes for essential vocabulary
router.get("/practice/colours", getPracticeColours);
router.get("/practice/numbers", getPracticeNumbers);
router.get("/practice/days", getPracticeDays);
router.get("/practice/months", getPracticeMonths);
router.get("/practice/common-things", getPracticeCommonThings);

// Generic route
router.get("/module/:module", getQuestionsByModule);

module.exports = router;