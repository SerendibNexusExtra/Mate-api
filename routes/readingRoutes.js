const express = require("express");
const router = express.Router();
const readingController = require("../controllers/readingController");

router.get("/texts", readingController.getAllReadingTexts);
router.get("/texts/:textId", readingController.getReadingTextById);
router.get("/questions/:textId", readingController.getQuestionsByReadingId);

module.exports = router;