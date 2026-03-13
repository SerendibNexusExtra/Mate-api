const express = require("express");
const router = express.Router();
const { getQuestionTypes } = require("../controllers/questionFormController");

router.get("/question-types", getQuestionTypes);

module.exports = router;
