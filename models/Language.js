const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    name: String,
    code: String,
    description: String,
    flag: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Language", languageSchema);
