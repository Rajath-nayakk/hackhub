const express = require("express");

const {
  analyzeProject,
} = require("../controllers/winnerAnalyzerController");

const router = express.Router();

router.post("/analyze", analyzeProject);

module.exports = router;