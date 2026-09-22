const {
  analyzeWinningProject,
} = require("../services/winnerAnalyzerService");

const analyzeProject = async (req, res) => {
  try {
    const {
      projectName,
      problem,
      solution,
      techStack,
      competition,
    } = req.body;

    if (!projectName || !problem || !solution || !techStack) {
      return res.status(400).json({
        success: false,
        message:
          "Project name, problem, solution and tech stack are required",
      });
    }

    const analysis = await analyzeWinningProject({
      projectName,
      problem,
      solution,
      techStack,
      competition: competition || "Not specified",
    });

    res.status(200).json({
      success: true,
      data: {
        analysis,
      },
    });
  } catch (error) {
    console.error("Winner analyzer error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze winning project",
    });
  }
};

module.exports = {
  analyzeProject,
};