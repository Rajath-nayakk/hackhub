const express = require("express");

const {
  getHackathons,
  getHackathonById,
} = require("../controllers/hackathonController");

const router = express.Router();

router.get("/", getHackathons);

router.get("/:id", getHackathonById);

module.exports = router;