const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate a rule-aware hackathon presentation slide deck
 */
const generatePresentationDeck = async ({
  hackathonTitle,
  maxSlides = 10,
  problemTitle,
  projectName,
  teamName,
  teamMembers,
  problem,
  solution,
  targetUsers,
  techStack,
  keyFeatures,
  innovation,
  architecture,
  githubUrl,
  demoUrl,
  results,
  futureScope,
}) => {
  const prompt = `
You are HackHub AI, an expert hackathon mentor and pitch coach.
Generate a structured, professional hackathon presentation slide deck.

HACKATHON CONSTRAINTS:
Hackathon: ${hackathonTitle || "General Hackathon"}
MAXIMUM ALLOWED SLIDES: ${maxSlides} (STRICT LIMIT: The output array of slides MUST NOT exceed ${maxSlides} slides).

PROJECT DETAILS:
Project Name: ${projectName || "Untitled Project"}
Team: ${teamName || "Builders"} (${teamMembers || "Engineering Team"})
Problem Statement: ${problemTitle || ""}
Problem Context: ${problem || ""}
Proposed Solution: ${solution || ""}
Target Users: ${targetUsers || "General Users"}
Tech Stack: ${techStack || "Modern Web Stack"}
Key Features: ${keyFeatures || "Core MVP functionality"}
Innovation / Differentiator: ${innovation || "Practical, accessible execution"}
System Architecture: ${architecture || "Client-Server with cloud database"}
Results / Evidence: ${results || "In development"}
Future Scope: ${futureScope || "Production deployment and feature scaling"}
GitHub URL: ${githubUrl || ""}
Live Demo URL: ${demoUrl || ""}

CRITICAL RULES:
1. DO NOT exceed ${maxSlides} slides. Exactly plan between 8 and ${maxSlides} slides.
2. CLAIM SAFETY: NEVER invent fake statistics, benchmarks, revenue, or user counts. If results are not measured, explicitly set the note: "Add actual result here".
3. SPEAKER NOTES: Provide concise, professional speaker notes and an estimated speaking duration in seconds for each slide.
4. SLIDE CONTENT: Keep bullet points punchy and concise (maximum 3-4 bullets per slide) so slides remain clean and readable.

Return ONLY valid JSON matching the provided schema.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            presentationTitle: { type: "string" },
            totalSlides: { type: "number" },
            targetDurationMinutes: { type: "number" },
            slides: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  slideNumber: { type: "number" },
                  title: { type: "string" },
                  category: { type: "string" },
                  bullets: {
                    type: "array",
                    items: { type: "string" },
                  },
                  speakerNotes: { type: "string" },
                  estimatedSeconds: { type: "number" },
                  visualSuggestion: { type: "string" },
                },
                required: [
                  "slideNumber",
                  "title",
                  "category",
                  "bullets",
                  "speakerNotes",
                  "estimatedSeconds",
                ],
              },
            },
            demoFlow: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "string" },
                  action: { type: "string" },
                },
                required: ["timestamp", "action"],
              },
            },
          },
          required: [
            "presentationTitle",
            "totalSlides",
            "targetDurationMinutes",
            "slides",
            "demoFlow",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text);

    // Enforce hard maximum slides ceiling
    if (parsed.slides.length > maxSlides) {
      parsed.slides = parsed.slides.slice(0, maxSlides);
      parsed.totalSlides = parsed.slides.length;
    }

    return parsed;
  } catch (error) {
    console.error("Gemini PPT Generation Error, creating high-quality structured fallback:", error);

    // Deterministic rule-compliant fallback deck
    const fallbackSlides = [
      {
        slideNumber: 1,
        title: projectName || "Hackathon Project",
        category: "Title & Team",
        bullets: [
          `Team: ${teamName || "Builders Team"}`,
          `Hackathon: ${hackathonTitle || "Hackathon 2026"}`,
          `Members: ${teamMembers || "Engineering Team"}`,
        ],
        speakerNotes: `Good morning judges. We are ${teamName || "our team"}, and today we are excited to present ${projectName || "our project"}.`,
        estimatedSeconds: 30,
        visualSuggestion: "Team logo and project hero banner",
      },
      {
        slideNumber: 2,
        title: "The Problem",
        category: "Problem Statement",
        bullets: [
          problem || "Engineering challenge requiring accessible, high-performance solution",
          "Current alternatives are slow, costly, or inaccessible to target users",
          "Direct friction: Lack of unified, real-time tooling",
        ],
        speakerNotes: "Here is the core problem we identified during our research.",
        estimatedSeconds: 45,
        visualSuggestion: "Pain-point flow diagram or problem illustration",
      },
      {
        slideNumber: 3,
        title: "Proposed Solution",
        category: "Proposed Solution",
        bullets: [
          solution || "A cohesive, high-speed engineering application",
          "Automates manual workflows with real-time feedback",
          "Designed specifically for the target demographic",
        ],
        speakerNotes: "To solve this, we built a comprehensive platform tailored to these needs.",
        estimatedSeconds: 45,
        visualSuggestion: "Before vs After solution diagram",
      },
      {
        slideNumber: 4,
        title: "Key Features & MVP",
        category: "Key Features",
        bullets: [
          keyFeatures || "Core interactive dashboard and processing pipeline",
          "Offline-first / rapid cloud data synchronization",
          "Accessible, responsive developer-first interface",
        ],
        speakerNotes: "Here are the primary features functional in our demonstration.",
        estimatedSeconds: 50,
        visualSuggestion: "Three-column feature breakdown with icons",
      },
      {
        slideNumber: 5,
        title: "System Architecture",
        category: "System Architecture",
        bullets: [
          architecture || "Modern client frontend connected via secure REST API",
          "PostgreSQL / Supabase relational database tier",
          "Gemini GenAI inference engine for automated analysis",
        ],
        speakerNotes: "Let's walk through our technical architecture and data flow.",
        estimatedSeconds: 45,
        visualSuggestion: "Architecture block diagram with clear arrows",
      },
      {
        slideNumber: 6,
        title: "Technology Stack",
        category: "Tech Stack & Implementation",
        bullets: [
          `Frontend: ${techStack || "Next.js, TypeScript, Tailwind CSS"}`,
          "Backend: Node.js, Express.js API",
          "Intelligence: Gemini 3.6 Flash via @google/genai",
        ],
        speakerNotes: "We selected our tech stack for speed, stability, and production readiness.",
        estimatedSeconds: 40,
        visualSuggestion: "Tech stack badges and library icons",
      },
      {
        slideNumber: 7,
        title: "Innovation & Differentiation",
        category: "Innovation & Differentiation",
        bullets: [
          innovation || "Deterministic rule-checking paired with generative AI",
          "Zero unnecessary dependencies for maximum reliability",
          "Designed for real students and production engineering environments",
        ],
        speakerNotes: "What differentiates our project from existing tools is this unique edge.",
        estimatedSeconds: 45,
        visualSuggestion: "Competitive comparison matrix",
      },
      {
        slideNumber: 8,
        title: "Demo & Measured Results",
        category: "Demo & Results",
        bullets: [
          results || "Add actual measured result here (e.g. response time, accuracy)",
          `Live Demo: ${demoUrl || "Available on local testbench"}`,
          "Validated across simulated student workflows",
        ],
        speakerNotes: "Let us demonstrate the working software live.",
        estimatedSeconds: 60,
        visualSuggestion: "Live screenshot or working application GIF",
      },
      {
        slideNumber: 9,
        title: "Future Scope & Scale",
        category: "Future Scope",
        bullets: [
          futureScope || "Multi-college deployment and institutional integration",
          "Expanded automated pipeline and native mobile support",
          "Comprehensive API access for third-party developer extensions",
        ],
        speakerNotes: "Beyond this hackathon, we have a concrete roadmap for scaling.",
        estimatedSeconds: 30,
        visualSuggestion: "Milestone timeline diagram",
      },
      {
        slideNumber: 10,
        title: "Conclusion & Links",
        category: "Conclusion",
        bullets: [
          `Repository: ${githubUrl || "https://github.com/hackhub"}`,
          `Demo: ${demoUrl || "Ready for judge review"}`,
          "Thank you! We welcome your questions.",
        ],
        speakerNotes: "Thank you for your time. We are now ready for your questions.",
        estimatedSeconds: 30,
        visualSuggestion: "QR code to GitHub repository and demo link",
      },
    ].slice(0, maxSlides);

    return {
      presentationTitle: `${projectName || "Hackathon Project"} Pitch`,
      totalSlides: fallbackSlides.length,
      targetDurationMinutes: 7,
      slides: fallbackSlides,
      demoFlow: [
        { timestamp: "0:00 - 1:00", action: "Problem context & why it matters" },
        { timestamp: "1:00 - 2:00", action: "Live demonstration of core feature" },
        { timestamp: "2:00 - 4:00", action: "System architecture & technical walkthrough" },
        { timestamp: "4:00 - 5:00", action: "Impact, future roadmap & Q&A handover" },
      ],
    };
  }
};

module.exports = {
  generatePresentationDeck,
};
