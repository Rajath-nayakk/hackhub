const express = require("express");

const {
  getProfiles,
  getProfileById,
  getProfileByAuthId,
  updateProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", getProfiles);
router.get("/by-auth/:authId", getProfileByAuthId);
router.get("/:id", getProfileById);
router.post("/update", updateProfile);

module.exports = router;