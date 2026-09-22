const supabase = require("../config/supabase");
const { teams: seedTeams, profiles: seedProfiles, hackathons: seedHackathons } = require("../data/seedData");

let localTeams = [...seedTeams];

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
      console.warn("Supabase unavailable. Serving development teams dataset:", error.message);

      return res.status(200).json({
        success: true,
        count: localTeams.length,
        data: localTeams,
        source: "development-seed",
        notice: "Displaying development teams because live database is offline."
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data,
      source: "supabase"
    });
  } catch (error) {
    console.warn("Server error, using development teams:", error.message);

    res.status(200).json({
      success: true,
      count: localTeams.length,
      data: localTeams,
      source: "development-seed"
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
      const found = localTeams.find((t) => String(t.id) === String(id));
      if (found) {
        return res.status(200).json({
          success: true,
          data: found,
          source: "development-seed"
        });
      }

      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
      source: "supabase"
    });
  } catch (error) {
    const found = localTeams.find((t) => String(t.id) === String(req.params.id));
    if (found) {
      return res.status(200).json({
        success: true,
        data: found,
        source: "development-seed"
      });
    }

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
      required_skills,
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
          required_skills: required_skills || "",
          status: "open",
        },
      ])
      .select()
      .single();

    if (error) {
      // Create locally in development store
      const hackathon = seedHackathons.find(h => String(h.id) === String(hackathon_id));
      const newTeam = {
        id: localTeams.length + 1,
        name,
        description: description || "",
        hackathon_id: hackathon_id ? Number(hackathon_id) : null,
        created_by: created_by || 1,
        max_members: max_members ? Number(max_members) : 4,
        required_skills: required_skills || "",
        status: "open",
        hackathons: hackathon ? { id: hackathon.id, title: hackathon.title } : undefined,
        team_members: [
          { id: 999, user_id: created_by || 1, role: "Team Leader", skills: "Full Stack" }
        ]
      };

      localTeams.unshift(newTeam);

      return res.status(201).json({
        success: true,
        message: "Team created successfully",
        data: newTeam,
        source: "development-seed"
      });
    }

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data,
      source: "supabase"
    });
  } catch (error) {
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
      // Local fallback join
      const localTeam = localTeams.find(t => String(t.id) === String(id));
      if (!localTeam) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }

      if (!localTeam.team_members) localTeam.team_members = [];
      const alreadyJoined = localTeam.team_members.some(m => String(m.user_id) === String(user_id));
      if (alreadyJoined) {
        return res.status(400).json({ success: false, message: "You are already a member of this team" });
      }

      const newMember = {
        id: localTeam.team_members.length + 1,
        team_id: Number(id),
        user_id,
        role: role || "Contributor",
        skills: skills || "Engineering"
      };
      localTeam.team_members.push(newMember);

      return res.status(201).json({
        success: true,
        message: "Joined team successfully",
        data: newMember,
        source: "development-seed"
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
    let student = null;
    const { data: dbStudent } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", studentId)
      .single();

    student = dbStudent || seedProfiles.find(p => String(p.id) === String(studentId) || p.auth_user_id === studentId) || seedProfiles[0];

    // Get other public students who are looking for teams
    let candidates = [];
    const { data: dbStudents } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_public", true)
      .eq("looking_for_team", true)
      .neq("id", student.id);

    candidates = dbStudents && dbStudents.length > 0
      ? dbStudents
      : seedProfiles.filter(p => p.id !== student.id);

    // Get hackathon requirements if supplied
    let hackathon = null;
    if (hackathonId) {
      const { data: dbHackathon } = await supabase
        .from("hackathons")
        .select("*")
        .eq("id", hackathonId)
        .single();

      hackathon = dbHackathon || seedHackathons.find(h => String(h.id) === String(hackathonId));
    }

    const studentSkills = (student.skills || "")
      .toLowerCase()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const studentRole = (student.preferred_role || "").toLowerCase();

    // Deterministic explainable matching logic (NO fake percentages)
    const recommendations = candidates.map((candidate) => {
      const candidateSkills = (candidate.skills || "")
        .toLowerCase()
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const reasons = [];

      // 1. Shared / complementary skills
      const sharedSkills = studentSkills.filter((skill) =>
        candidateSkills.includes(skill)
      );

      if (sharedSkills.length > 0) {
        reasons.push(
          `Shares ${sharedSkills.length} relevant skill${
            sharedSkills.length > 1 ? "s" : ""
          } (${sharedSkills.slice(0, 3).join(", ")})`
        );
      }

      // 2. Different / complementary role
      const candidateRole = (candidate.preferred_role || "").toLowerCase();
      if (studentRole && candidateRole && studentRole !== candidateRole) {
        reasons.push(`Complementary role: ${candidate.preferred_role} balances ${student.preferred_role}`);
      }

      // 3. Same college / campus synergy
      if (
        student.college &&
        candidate.college &&
        student.college.toLowerCase() === candidate.college.toLowerCase()
      ) {
        reasons.push("Same college campus for in-person collaboration");
      }

      // 4. Same city
      if (
        student.city &&
        candidate.city &&
        student.city.toLowerCase() === candidate.city.toLowerCase()
      ) {
        reasons.push(`Same city (${candidate.city})`);
      }

      // 5. Hackathon relevance
      if (hackathon && hackathon.technologies) {
        const matchingTech = candidateSkills.filter((skill) =>
          hackathon.technologies.map((t) => t.toLowerCase()).includes(skill)
        );

        if (matchingTech.length > 0) {
          reasons.push(`Has required skills for ${hackathon.title}`);
        }
      }

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
        reasons:
          reasons.length > 0
            ? reasons
            : ["Has active engineering profile and open to team invites"],
      };
    });

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