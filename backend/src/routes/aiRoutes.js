const express = require("express");

const {
  generateIdea,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/generate-idea", generateIdea);

module.exports = router;