const express = require('express');
const router = express.Router();
const {
  getVocabularyByLanguage,
  getModulesByLanguage,
  getTypesByModuleIdAndLanguage,
  getWordsByTypeIdAndLanguage,
  getAvailableLanguages
} = require('../controllers/vocabularyController');

// Get available languages
router.get('/languages', getAvailableLanguages);

// Get vocabulary by language code - FIXED: Removed ? and use :languageCode with default in controller
router.get('/:languageCode', getVocabularyByLanguage);
// Add a route without parameter for default
router.get('/', getVocabularyByLanguage);

// Get modules by language code - FIXED
router.get('/modules/:languageCode', getModulesByLanguage);
// Add a route without parameter for default
router.get('/modules', getModulesByLanguage);

// Get types by module ID (with language code as query param)
router.get('/modules/:moduleId/types', getTypesByModuleIdAndLanguage);

// Get words by type ID (with language code as query param)
router.get('/modules/:moduleId/types/:typeId/words', getWordsByTypeIdAndLanguage);

module.exports = router;