const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // greetings, feelings, alphabet, etc
    },
    title: {
      type: String,
      required: true, // Simple Greetings
    },
    description: {
      type: String,
      required: true, // Basic greetings for daily conversation
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Module", moduleSchema);
