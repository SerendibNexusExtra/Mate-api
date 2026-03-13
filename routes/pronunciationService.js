const Pronunciation = require("../models/Pronunciation");

const getPronunciationByLanguage = async (languageCode) => {
  return await Pronunciation.findOne({ languageCode });
};

module.exports = {
  getPronunciationByLanguage,
};