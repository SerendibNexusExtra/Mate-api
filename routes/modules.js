const express = require("express");
const router = express.Router();
const Module = require("../models/Module");

// GET all modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error("Modules fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load modules",
    });
  }
});

module.exports = router;
