const supabase = require("../config/supabase");

const getHackathons = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .order("registration_deadline", {
        ascending: true,
      });

    if (error) {
  console.error("Supabase error:", error);

  return res.status(500).json({
    success: false,
    message: "Failed to fetch hackathons",
    error: error.message,
    details: error.details,
    hint: error.hint,
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
const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Hackathon not found",
        });
      }

      console.error("Supabase error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch hackathon",
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
  getHackathons,
  getHackathonById,
};