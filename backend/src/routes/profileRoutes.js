const express = require("express");

const {
  getProfiles,
  getProfileById,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", getProfiles);
router.get("/:id", getProfileById);

module.exports = router;