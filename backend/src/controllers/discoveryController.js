const discoveryEngine = require("../engine/discoveryEngine");

const triggerDiscovery = async (req, res) => {
  try {
    const result = await discoveryEngine.runDiscoveryPipeline();
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[DiscoveryController] Trigger failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to run discovery pipeline",
      error: error.message,
    });
  }
};

const getDiscoveryStatus = (req, res) => {
  try {
    const telemetry = discoveryEngine.getTelemetry();
    res.status(200).json({
      success: true,
      data: telemetry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve discovery telemetry",
      error: error.message,
    });
  }
};

module.exports = {
  triggerDiscovery,
  getDiscoveryStatus,
};
