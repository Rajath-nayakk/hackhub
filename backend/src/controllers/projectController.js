const supabase = require("../config/supabase");
const { projects: seedProjects } = require("../data/seedData");

// GET all projects
const getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase unavailable. Serving development projects dataset:", error.message);

      return res.status(200).json({
        success: true,
        count: seedProjects.length,
        data: seedProjects,
        source: "development-seed",
        notice: "Displaying development projects archive because live database is offline."
      });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data,
      source: "supabase"
    });
  } catch (error) {
    console.warn("Server error, using development projects:", error.message);

    res.status(200).json({
      success: true,
      count: seedProjects.length,
      data: seedProjects,
      source: "development-seed",
      notice: "Displaying development projects archive because live database is offline."
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
      const found = seedProjects.find((p) => String(p.id) === String(id));
      if (found) {
        return res.status(200).json({
          success: true,
          data: found,
          source: "development-seed"
        });
      }

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
      source: "supabase"
    });
  } catch (error) {
    const found = seedProjects.find((p) => String(p.id) === String(req.params.id));
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

module.exports = {
  getProjects,
  getProjectById,
};