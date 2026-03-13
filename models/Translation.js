const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // "Simple Greetings"
    language: { type: String, required: true }, // "Hindi"
    value: { type: String, required: true }, // "सरल अभिवादन"
  },
  { timestamps: true },
);

translationSchema.index({ key: 1, language: 1 }, { unique: true });

module.exports = mongoose.model("Translation", translationSchema);
