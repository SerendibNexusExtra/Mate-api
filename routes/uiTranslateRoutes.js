const express = require("express");
const router = express.Router();
const { translateUI } = require("../controllers/translateController");

router.post("/", translateUI);

module.exports = router;
