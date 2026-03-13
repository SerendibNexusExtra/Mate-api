const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
    text: String,
    imageUrl: String,
    soundUrl: String,
});

const alphabetSchema = new mongoose.Schema({
    languageCode: String,
    language: String,
    letters: [String],
    content: Object, // { "A": [...], "B": [...] }
}, { timestamps: true });

module.exports = mongoose.model("Alphabet", alphabetSchema);
