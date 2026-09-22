const supabase = require("../config/supabase");

// Get all open teams
const getTeams = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        hackathons (
          id,
          title
        )
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch teams",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get team by ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        hackathons (
          id,
          title
        ),
        team_members (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch team",
        error: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Create a team
const createTeam = async (req, res) => {
  try {
    const {
      name,
      description,
      hackathon_id,
      created_by,
      max_members,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Team name is required",
      });
    }

    const { data, error } = await supabase
      .from("teams")
      .insert([
        {
          name,
          description,
          hackathon_id,
          created_by,
          max_members: max_members || 4,
          status: "open",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create team",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Join a team
const joinTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role, skills } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    if (teamError || !team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This team is no longer accepting members",
      });
    }

    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this team",
      });
    }

    const { data: members } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", id);

    if (members && members.length >= team.max_members) {
      return res.status(400).json({
        success: false,
        message: "Team is full",
      });
    }

    const { data, error } = await supabase
      .from("team_members")
      .insert([
        {
          team_id: id,
          user_id,
          role,
          skills,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to join team",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Joined team successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// GET recommended teammates for a student
const getRecommendedTeammates = async (req, res) => {
  try {
    const { studentId, hackathonId } = req.query;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    // Get current student's profile
    const { data: student, error: studentError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // Get other public students who are looking for teams
    const { data: students, error: studentsError } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_public", true)
      .eq("looking_for_team", true)
      .neq("id", studentId);

    if (studentsError) {
      console.error(studentsError);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch students",
      });
    }

    // Get hackathon requirements if supplied
    let hackathon = null;

    if (hackathonId) {
      const { data } = await supabase
        .from("hackathons")
        .select("*")
        .eq("id", hackathonId)
        .single();

      hackathon = data;
    }

    const studentSkills = (student.skills || "")
      .toLowerCase()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const studentRole = (student.preferred_role || "").toLowerCase();

    const recommendations = students.map((candidate) => {
      const candidateSkills = (candidate.skills || "")
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      let score = 0;
      const reasons = [];

      // --------------------------------
      // 1. Complementary skills
      // --------------------------------

      const sharedSkills = studentSkills.filter((skill) =>
        candidateSkills.includes(skill)
      );

      if (sharedSkills.length > 0) {
        score += Math.min(sharedSkills.length * 5, 15);

        reasons.push(
          `Shares ${sharedSkills.length} relevant skill${
            sharedSkills.length > 1 ? "s" : ""
          }`
        );
      }

      // --------------------------------
      // 2. Different / complementary role
      // --------------------------------

      const candidateRole = (
        candidate.preferred_role || ""
      ).toLowerCase();

      if (
        studentRole &&
        candidateRole &&
        studentRole !== candidateRole
      ) {
        score += 25;
        reasons.push("Complementary role");
      }

      // --------------------------------
      // 3. Same college
      // --------------------------------

      if (
        student.college &&
        candidate.college &&
        student.college.toLowerCase() ===
          candidate.college.toLowerCase()
      ) {
        score += 15;
        reasons.push("Same college");
      }

      // --------------------------------
      // 4. Same city
      // --------------------------------

      if (
        student.city &&
        candidate.city &&
        student.city.toLowerCase() ===
          candidate.city.toLowerCase()
      ) {
        score += 10;
        reasons.push("Same city");
      }

      // --------------------------------
      // 5. Availability
      // --------------------------------

      if (
        student.availability &&
        candidate.availability &&
        student.availability.toLowerCase() ===
          candidate.availability.toLowerCase()
      ) {
        score += 10;
        reasons.push("Similar availability");
      }

      // --------------------------------
      // 6. Hackathon relevance
      // --------------------------------

      if (hackathon) {
        const requiredSkills = (
          hackathon.required_skills || ""
        )
          .toLowerCase()
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);

        const matchingHackathonSkills =
          candidateSkills.filter((skill) =>
            requiredSkills.includes(skill)
          );

        if (matchingHackathonSkills.length > 0) {
          score += Math.min(
            matchingHackathonSkills.length * 10,
            25
          );

          reasons.push(
            "Skills match the hackathon requirements"
          );
        }
      }

      // Maximum score
      score = Math.min(score, 100);

      return {
        id: candidate.id,
        name: candidate.name,
        college: candidate.college,
        city: candidate.city,
        branch: candidate.branch,
        year: candidate.year,
        skills: candidate.skills,
        preferred_role: candidate.preferred_role,
        availability: candidate.availability,
        github_url: candidate.github_url,
        portfolio_url: candidate.portfolio_url,
        bio: candidate.bio,
        looking_for_team: candidate.looking_for_team,

        match_percentage: score,

        reasons:
          reasons.length > 0
            ? reasons
            : ["Potential teammate based on profile"],
      };
    });

    // Highest match first
    recommendations.sort(
      (a, b) =>
        b.match_percentage - a.match_percentage
    );

    res.status(200).json({
      success: true,
      student: {
        id: student.id,
        name: student.name,
      },
      hackathon: hackathon
        ? {
            id: hackathon.id,
            title: hackathon.title,
          }
        : null,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  joinTeam,
  getRecommendedTeammates,
};