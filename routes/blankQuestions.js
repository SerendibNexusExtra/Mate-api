const express = require('express');
const router = express.Router();
const BlankQuestion = require('../models/BlankQuestion');

// GET questions by language code and tense
// Now: /api/blank-questions/:languageCode/:tense
router.get('/:languageCode/:tense', async (req, res) => {
  try {
    const { languageCode, tense } = req.params;
    
    console.log(`Fetching questions for: ${languageCode} - ${tense}`);
    
    const questions = await BlankQuestion.find({
      languageCode: languageCode,
      tense: tense,
      level: 'basic',
      module: 'basic-tenses'
    });

    console.log(`Found ${questions.length} questions`);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET questions by language code only
router.get('/:languageCode', async (req, res) => {
  try {
    const { languageCode } = req.params;
    
    const questions = await BlankQuestion.find({
      languageCode: languageCode,
      level: 'basic',
      module: 'basic-tenses'
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new question (for admin)
router.post('/', async (req, res) => {
  try {
    const newQuestion = new BlankQuestion(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE question (for admin)
router.put('/:id', async (req, res) => {
  try {
    const updatedQuestion = await BlankQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE question (for admin)
router.delete('/:id', async (req, res) => {
  try {
    await BlankQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
