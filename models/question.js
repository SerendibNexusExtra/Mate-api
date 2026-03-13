
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String },
  image: { type: String }, 
}, { _id: false });

const questionSchema = new mongoose.Schema({
  language: { type: String, required: true },
  languageCode: { type: String, required: true, index: true }, 
  level: { type: String, required: true }, 
  module: { type: String, required: true }, 
  type: { type: String, enum: ["text", "image"], required: true },
  questionText: { type: String, required: true },
  questionImage: { type: String }, 
  options: {
  type: [optionSchema],
  default: []
},

  correctAnswerIndex: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


// Update updatedAt before save
questionSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Question", questionSchema);
