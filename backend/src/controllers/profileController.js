const supabase = require("../config/supabase");

// GET all public profiles
const getProfiles = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        auth_user_id,
        name,
        college,
        city,
        branch,
        year,
        skills,
        preferred_role,
        availability,
        github_url,
        portfolio_url,
        bio,
        looking_for_team,
        profile_completed
      `)
      .eq("is_public", true)
      .eq("looking_for_team", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch profiles",
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


// GET single public profile
const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        name,
        college,
        city,
        branch,
        year,
        skills,
        preferred_role,
        availability,
        github_url,
        portfolio_url,
        bio,
        looking_for_team,
        profile_completed
      `)
      .eq("id", id)
      .eq("is_public", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Profile not found",
        });
      }

      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch profile",
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


module.exports = {
  getProfiles,
  getProfileById,
};