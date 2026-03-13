// controllers/questionFormController.js

const QuestionForm = require("../models/QuestionForm");

const getQuestionTypes = async (req, res) => {
  try {
    const languageCode = req.query.languageCode || "en-US";

    const data = await QuestionForm.findOne(
      { languageCode },
      { questionTypes: 1, _id: 0 },
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Question types not found",
      });
    }

    res.status(200).json({
      success: true,
      questionTypes: data.questionTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getQuestionTypes,
};
