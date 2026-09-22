const express = require("express");

const {
  getTeams,
  getTeamById,
  createTeam,
  joinTeam,
  getRecommendedTeammates,
} = require("../controllers/teamController");
const router = express.Router();

router.get("/", getTeams);
router.get(
  "/recommendations",
  getRecommendedTeammates
);

router.get("/:id", getTeamById);

router.post("/", createTeam);

router.post("/:id/join", joinTeam);

module.exports = router;