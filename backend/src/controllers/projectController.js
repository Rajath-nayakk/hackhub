const supabase = require("../config/supabase");

// GET all projects
const getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
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


// GET single project
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch project",
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
  getProjects,
  getProjectById,
};