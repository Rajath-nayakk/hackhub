const express = require("express");
const router = express.Router();
const {
  triggerDiscovery,
  getDiscoveryStatus,
} = require("../controllers/discoveryController");

router.post("/trigger", triggerDiscovery);
router.get("/status", getDiscoveryStatus);

module.exports = router;
