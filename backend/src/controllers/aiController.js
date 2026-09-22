const {
  generateHackathonIdea,
} = require("../services/aiService");

const generateIdea = async (req, res) => {
  try {
    const {
      domain,
      problemArea,
      skillLevel,
      technologies,
    } = req.body;

    if (!domain || !problemArea || !skillLevel) {
      return res.status(400).json({
        success: false,
        message:
          "Domain, problem area and skill level are required",
      });
    }

    const idea = await generateHackathonIdea({
      domain,
      problemArea,
      skillLevel,
      technologies: technologies || "Any",
    });

    res.status(200).json({
      success: true,
      data: {
        idea,
      },
    });
  } catch (error) {
  console.error("AI error:", error);

  res.status(500).json({
    success: false,
    message: "Failed to generate hackathon idea",
  });
}
};

module.exports = {
  generateIdea,
};