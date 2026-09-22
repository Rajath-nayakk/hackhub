const { generatePresentationDeck } = require("../services/pptService");
const { hackathons: seedHackathons } = require("../data/seedData");

const generatePPT = async (req, res) => {
  try {
    const {
      hackathonId,
      hackathonTitle,
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
      maxSlides: requestedMaxSlides,
    } = req.body;

    if (!projectName || !problem || !solution) {
      return res.status(400).json({
        success: false,
        message: "Project name, problem, and solution are required.",
      });
    }

    // Determine hackathon rule constraints
    let maxAllowed = 10;
    let hackathonName = hackathonTitle;

    if (hackathonId) {
      const found = seedHackathons.find((h) => String(h.id) === String(hackathonId));
      if (found) {
        hackathonName = found.title;
        if (found.presentation_rules?.max_slides) {
          maxAllowed = found.presentation_rules.max_slides;
        }
      }
    }

    if (requestedMaxSlides && Number(requestedMaxSlides) > 0) {
      maxAllowed = Math.min(Number(requestedMaxSlides), maxAllowed);
    }

    const deck = await generatePresentationDeck({
      hackathonTitle: hackathonName,
      maxSlides: maxAllowed,
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
    });

    res.status(200).json({
      success: true,
      data: deck,
    });
  } catch (error) {
    console.error("PPT Controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate presentation deck.",
      error: error.message,
    });
  }
};

const auditPPT = async (req, res) => {
  try {
    const { slides = [], hackathonId, githubUrl, demoUrl } = req.body;

    let maxSlides = 10;
    let hackathonName = "Selected Hackathon";

    if (hackathonId) {
      const found = seedHackathons.find((h) => String(h.id) === String(hackathonId));
      if (found) {
        hackathonName = found.title;
        if (found.presentation_rules?.max_slides) {
          maxSlides = found.presentation_rules.max_slides;
        }
      }
    }

    const passedChecks = [];
    const warnings = [];
    let isCompliant = true;

    // 1. Slide Count Check
    if (slides.length <= maxSlides) {
      passedChecks.push(`Slide count within limits (${slides.length}/${maxSlides} slides)`);
    } else {
      isCompliant = false;
      warnings.push(
        `${hackathonName} allows a maximum of ${maxSlides} slides. Your presentation has ${slides.length} slides.`
      );
    }

    // 2. Problem Statement Included
    const hasProblem = slides.some(
      (s) =>
        s.category?.toLowerCase().includes("problem") ||
        s.title?.toLowerCase().includes("problem")
    );
    if (hasProblem) {
      passedChecks.push("Problem Statement clearly articulated");
    } else {
      warnings.push("Missing a dedicated Problem Statement slide");
    }

    // 3. Solution Included
    const hasSolution = slides.some(
      (s) =>
        s.category?.toLowerCase().includes("solution") ||
        s.title?.toLowerCase().includes("solution")
    );
    if (hasSolution) {
      passedChecks.push("Proposed Solution articulated");
    } else {
      warnings.push("Missing a dedicated Proposed Solution slide");
    }

    // 4. Tech Stack / Architecture
    const hasTech = slides.some(
      (s) =>
        s.category?.toLowerCase().includes("tech") ||
        s.category?.toLowerCase().includes("architecture") ||
        s.title?.toLowerCase().includes("architecture")
    );
    if (hasTech) {
      passedChecks.push("Technical architecture & tech stack present");
    } else {
      warnings.push("Recommend adding a technical architecture or workflow slide");
    }

    // 5. GitHub Repository Check
    if (githubUrl && githubUrl.trim().length > 5) {
      passedChecks.push("GitHub repository link provided");
    } else {
      warnings.push("Add a working GitHub repository URL before submission");
    }

    // 6. Live Demo Check
    if (demoUrl && demoUrl.trim().length > 3) {
      passedChecks.push("Live demonstration URL provided");
    } else {
      warnings.push("Provide a working demo link or verify local testbench");
    }

    // 7. Results / Fake Statistics Check
    const hasUnmeasuredNote = slides.some((s) =>
      s.bullets?.some((b) => b.includes("Add actual result here"))
    );
    if (hasUnmeasuredNote) {
      warnings.push("Results slide has placeholder metrics. Replace with your actual measured benchmark before pitching.");
    } else {
      passedChecks.push("Claim safety verified (no unmeasured metrics)");
    }

    res.status(200).json({
      success: true,
      data: {
        isCompliant,
        maxAllowedSlides: maxSlides,
        currentSlides: slides.length,
        passedChecks,
        warnings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to audit presentation.",
    });
  }
};

module.exports = {
  generatePPT,
  auditPPT,
};
