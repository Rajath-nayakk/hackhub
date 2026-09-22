const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateHackathonIdea = async ({
  domain,
  problemArea,
  skillLevel,
  technologies,
}) => {
  const prompt = `
You are HackHub AI, an expert hackathon mentor.

Generate ONE strong, realistic and innovative hackathon project idea.

User information:
Domain: ${domain}
Problem area: ${problemArea}
Skill level: ${skillLevel}
Preferred technologies: ${technologies}

Requirements:
- Solve a genuine real-world problem.
- Be realistic to build during a hackathon.
- Have a clear technical implementation.
- Avoid generic AI chatbot ideas.
- Use AI only where it genuinely adds value.
- Make it impressive enough for a hackathon demonstration.
- Keep the idea practical and specific.

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
          projectTitle: {
            type: "string",
          },

          problemStatement: {
            type: "string",
          },

          solution: {
            type: "string",
          },

          keyFeatures: {
            type: "array",
            items: {
              type: "string",
            },
          },

          techStack: {
            type: "array",
            items: {
              type: "string",
            },
          },

          innovation: {
            type: "string",
          },

          expectedImpact: {
            type: "string",
          },

          whyItCouldWin: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },

        required: [
          "projectTitle",
          "problemStatement",
          "solution",
          "keyFeatures",
          "techStack",
          "innovation",
          "expectedImpact",
          "whyItCouldWin",
        ],
      },
    },
  });

  return JSON.parse(response.text);
};

module.exports = {
  generateHackathonIdea,
};