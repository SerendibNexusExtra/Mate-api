// routes/translateRoutes.js
const express = require("express");
const router = express.Router();

const { translateUI } = require("../controllers/translateController");

// ❌ WRONG: router.post("/", translateUI()); // <- This calls the function immediately
// ✅ CORRECT:
router.post("/", translateUI);

module.exports = router;
