const VocabularyExpansion = require('../models/VocabularyExpansion');

// Get vocabulary by language code (default "en-US")
exports.getVocabularyByLanguage = async (req, res) => {
  try {
    const languageCode = req.params.languageCode || 'en-US';
    
    const vocabulary = await VocabularyExpansion.findOne({ languageCode });
    
    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: `Vocabulary not found for language code: ${languageCode}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: vocabulary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get modules by language code
exports.getModulesByLanguage = async (req, res) => {
  try {
    const languageCode = req.params.languageCode || 'en-US';
    
    const vocabulary = await VocabularyExpansion.findOne({ languageCode });
    
    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: `Vocabulary not found for language code: ${languageCode}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: vocabulary.modules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get types by module ID and language code
exports.getTypesByModuleIdAndLanguage = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const languageCode = req.query.languageCode || 'en-US';
    
    const vocabulary = await VocabularyExpansion.findOne({ languageCode });
    
    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: `Vocabulary not found for language code: ${languageCode}`
      });
    }
    
    const module = vocabulary.modules.find(m => m.id === moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: module.types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get words by type ID and language code
exports.getWordsByTypeIdAndLanguage = async (req, res) => {
  try {
    const { moduleId, typeId } = req.params;
    const languageCode = req.query.languageCode || 'en-US';
    
    const vocabulary = await VocabularyExpansion.findOne({ languageCode });
    
    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: `Vocabulary not found for language code: ${languageCode}`
      });
    }
    
    const module = vocabulary.modules.find(m => m.id === moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }
    
    const type = module.types.find(t => t.id === typeId);
    
    if (!type) {
      return res.status(404).json({
        success: false,
        error: 'Type not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: type.words
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all available language codes
exports.getAvailableLanguages = async (req, res) => {
  try {
    const languages = await VocabularyExpansion.find().distinct('languageCode');
    
    res.status(200).json({
      success: true,
      data: languages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getWordsByTypeIdAndLanguage = async (req, res) => {
  try {
    const { moduleId, typeId } = req.params;
    const languageCode = req.query.languageCode || 'en-US';
    
    console.log('Fetching words:', { moduleId, typeId, languageCode }); // Debug log
    
    const vocabulary = await VocabularyExpansion.findOne({ languageCode });
    
    if (!vocabulary) {
      return res.status(404).json({
        success: false,
        error: `Vocabulary not found for language code: ${languageCode}`
      });
    }
    
    const module = vocabulary.modules.find(m => m.id === moduleId);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }
    
    const type = module.types.find(t => t.id === typeId);
    
    if (!type) {
      return res.status(404).json({
        success: false,
        error: 'Type not found'
      });
    }
    
    console.log('Words found:', type.words?.length); // Debug log
    
    res.status(200).json({
      success: true,
      data: type.words || [] // Ensure array is returned
    });
  } catch (error) {
    console.error('Error in getWordsByTypeIdAndLanguage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};