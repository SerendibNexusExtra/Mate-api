const express = require('express');
const router = express.Router();
const BlankQuestion = require('../models/BlankQuestion');

// GET questions by language code and tense
router.get('/api/questions/:languageCode/:tense', async (req, res) => {
  try {
    const { languageCode, tense } = req.params;
    
    const questions = await BlankQuestion.find({
      languageCode: languageCode,
      tense: tense,
      level: 'basic',
      module: 'basic-tenses'
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET questions by language code only
router.get('/api/questions/:languageCode', async (req, res) => {
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
router.post('/api/questions', async (req, res) => {
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
router.put('/api/questions/:id', async (req, res) => {
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
router.delete('/api/questions/:id', async (req, res) => {
  try {
    await BlankQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;