const ReadingComprehension = require("../models/ReadingComprehension");
const ReadingQuestion = require("../models/ReadingComprehensionQuestion");

// 📌 Get all reading texts (menu ekata)
exports.getAllReadingTexts = async (req, res) => {
  try {
    // Get locale from query parameter instead of params
    const { locale } = req.query;
    
    if (!locale) {
      return res.status(400).json({ message: "Locale is required" });
    }

    const data = await ReadingComprehension.findOne({
      languageCode: locale
    });

    if (!data) {
      return res.status(404).json({ message: "No reading texts found for this locale" });
    }

    res.json(data.readingTexts || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get single reading text by id
exports.getReadingTextById = async (req, res) => {
  try {
    const { textId } = req.params;
    const { locale } = req.query; // Also get locale from query

    const data = await ReadingComprehension.findOne({
      languageCode: locale
    });

    if (!data) {
      return res.status(404).json({ message: "No reading data found" });
    }

    const readingText = data.readingTexts.find(
      t => t.id === textId || t._id.toString() === textId
    );

    if (!readingText) {
      return res.status(404).json({ message: "Reading text not found" });
    }

    res.json(readingText);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get questions by readingTextId
exports.getQuestionsByReadingId = async (req, res) => {
  try {
    const { textId } = req.params;

    const questions = await ReadingQuestion.find({
      readingTextId: textId
    }).sort({ order: 1 });

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};