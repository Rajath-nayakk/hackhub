const supabase = require("../config/supabase");
const discoveryStorage = require("../engine/discoveryStorage");
const { hackathons: seedHackathons } = require("../data/seedData");

const getHackathons = async (req, res) => {
  try {
    const result = await discoveryStorage.getHackathons(req.query);

    if (result.data && result.data.length > 0) {
      return res.status(200).json({
        success: true,
        count: result.data.length,
        data: result.data,
        source: result.source,
        notice: result.notice || null,
      });
    }

    // Fallback to development seed if storage is completely empty
    let filtered = [...seedHackathons];
    const { domain, difficulty, format, search, status } = req.query;

    if (status && status !== "all") {
      filtered = filtered.filter((h) => h.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.organizer.toLowerCase().includes(q) ||
          (h.location || "").toLowerCase().includes(q)
      );
    }
    if (domain && domain !== "all") {
      filtered = filtered.filter((h) =>
        (h.domain || "").toLowerCase().includes(domain.toLowerCase())
      );
    }
    if (difficulty && difficulty !== "all") {
      filtered = filtered.filter(
        (h) => (h.difficulty || "").toLowerCase() === difficulty.toLowerCase()
      );
    }
    if (format && format !== "all") {
      filtered = filtered.filter((h) =>
        format === "online" ? h.is_online : !h.is_online
      );
    }

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
      source: "development-seed",
      notice: "Displaying development dataset because live database is offline.",
    });
  } catch (error) {
    console.warn("Server error querying hackathons, using fallback dataset:", error.message);
    res.status(200).json({
      success: true,
      count: seedHackathons.length,
      data: seedHackathons,
      source: "development-seed",
      notice: "Displaying development dataset because live database is offline.",
    });
  }
};

const getHackathonById = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Try Supabase
    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .or(`id.eq.${isNaN(Number(id)) ? -1 : Number(id)},slug.eq.${id}`)
      .single();

    if (!error && data) {
      return res.status(200).json({
        success: true,
        data,
        source: "supabase",
      });
    }
  } catch {
    // Supabase query failed, fall through to cache
  }

  // 2. Try Offline Discovery Cache
  const cachedList = discoveryStorage.loadOfflineCache();
  const cachedFound = cachedList.find(
    (h) => String(h.id) === String(id) || h.slug === id || h.source_id === id
  );

  if (cachedFound) {
    return res.status(200).json({
      success: true,
      data: cachedFound,
      source: "offline-cache",
      notice: "Served from verified discovery cache.",
    });
  }

  // 3. Try Seed Data
  const seedFound = seedHackathons.find(
    (h) => String(h.id) === String(id) || h.slug === id
  );

  if (seedFound) {
    return res.status(200).json({
      success: true,
      data: seedFound,
      source: "development-seed",
      notice: "Served from development dataset.",
    });
  }

  return res.status(404).json({
    success: false,
    message: "Hackathon not found",
  });
};

module.exports = {
  getHackathons,
  getHackathonById,
};