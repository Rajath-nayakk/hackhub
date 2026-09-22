const express = require("express");
const { generatePPT, auditPPT } = require("../controllers/pptController");

const router = express.Router();

router.post("/generate", generatePPT);
router.post("/audit", auditPPT);

module.exports = router;
