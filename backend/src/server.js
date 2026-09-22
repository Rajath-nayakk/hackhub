require("dotenv").config();

const express = require("express");
const cors = require("cors");
const profileRoutes = require("./routes/profileRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const aiRoutes = require("./routes/aiRoutes");
const winnerAnalyzerRoutes = require("./routes/winnerAnalyzerRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "HackHub API is running 🚀",
  });
});

app.use("/api/hackathons", hackathonRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/winner-analyzer", winnerAnalyzerRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/profiles", profileRoutes);

app.listen(PORT, () => {
  console.log(
    `HackHub API running on http://localhost:${PORT}`
  );
});