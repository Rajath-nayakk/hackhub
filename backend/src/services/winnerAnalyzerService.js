const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const analyzeWinningProject = async ({
  projectName,
  problem,
  solution,
  techStack,
  competition,
}) => {
  const prompt = `
You are HackHub AI, an expert hackathon judge and mentor.

Analyze the following hackathon project and explain why it could have been successful.

PROJECT:
${projectName}

COMPETITION:
${competition || "Not specified"}

PROBLEM:
${problem}

SOLUTION:
${solution}

TECH STACK:
${techStack}

Evaluate the project realistically from a hackathon judge's perspective.

Do NOT simply praise the project.
Identify its actual strengths, weaknesses, innovation, technical execution,
demo potential, impact and competitive advantage.

Return ONLY valid JSON matching the provided schema.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: "object",

        properties: {
          projectSummary: {
            type: "string",
          },

          problemStrength: {
            type: "number",
          },

          innovationScore: {
            type: "number",
          },

          technicalExecution: {
            type: "number",
          },

          demoPotential: {
            type: "number",
          },

          impactScore: {
            type: "number",
          },

          whyItCouldWin: {
            type: "array",
            items: {
              type: "string",
            },
          },

          keyDifferentiators: {
            type: "array",
            items: {
              type: "string",
            },
          },

          weaknesses: {
            type: "array",
            items: {
              type: "string",
            },
          },

          improvementIdeas: {
            type: "array",
            items: {
              type: "string",
            },
          },

          hackathonLessons: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },

        required: [
          "projectSummary",
          "problemStrength",
          "innovationScore",
          "technicalExecution",
          "demoPotential",
          "impactScore",
          "whyItCouldWin",
          "keyDifferentiators",
          "weaknesses",
          "improvementIdeas",
          "hackathonLessons",
        ],
      },
    },
  });

  return JSON.parse(response.text);
};

module.exports = {
  analyzeWinningProject,
};