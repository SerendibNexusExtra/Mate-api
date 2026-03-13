const Grammar = require('../models/Grammar');

// GET all tenses for a language
exports.getTenses = async (req, res) => {
  try {
    const { languageCode } = req.params;
    const grammar = await Grammar.findOne({ languageCode });

    if (!grammar) return res.status(404).json({ message: 'Language not found' });

    res.json(grammar.tenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET specific tense by ID
exports.getTenseById = async (req, res) => {
  try {
    const { languageCode, tenseId } = req.params;
    const grammar = await Grammar.findOne({ languageCode });

    if (!grammar) return res.status(404).json({ message: 'Language not found' });

    const tense = grammar.tenses.find(t => t.id === tenseId);
    if (!tense) return res.status(404).json({ message: 'Tense not found' });

    res.json(tense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};