const BaseAdapter = require("./baseAdapter");

class DevpostAdapter extends BaseAdapter {
  constructor() {
    super({
      name: "Devpost",
      sourceType: "official_platform",
      priority: 2,
      timeoutMs: 12000,
    });
    this.upcomingEndpoint = "https://devpost.com/api/hackathons?challenge_type[]=online&status[]=upcoming";
    this.openEndpoint = "https://devpost.com/api/hackathons?status[]=open";
  }

  /**
   * Helper to strip HTML tags from prize string (e.g. "$<span ...>10,000</span>" -> "$10,000")
   */
  cleanPrizeString(prizeHtml) {
    if (!prizeHtml) return null;
    const cleaned = String(prizeHtml).replace(/<[^>]*>/g, "").trim();
    return cleaned.length > 0 ? cleaned : null;
  }

  /**
   * Approximate ISO dates from text representation like "Dec 11 - 15, 2026"
   */
  parseDateRange(dateStr) {
    if (!dateStr) return { start: null, end: null };
    try {
      const parts = dateStr.split("-").map((s) => s.trim());
      if (parts.length === 2) {
        // e.g. parts[0] = "Dec 11", parts[1] = "15, 2026"
        const yearMatch = parts[1].match(/\b(20\d\d)\b/);
        const year = yearMatch ? yearMatch[1] : new Date().getFullYear();

        const endParsed = new Date(`${parts[1]}`);
        const startParsed = new Date(`${parts[0]}, ${year}`);

        return {
          start: isNaN(startParsed.getTime()) ? null : startParsed.toISOString(),
          end: isNaN(endParsed.getTime()) ? null : endParsed.toISOString(),
        };
      }
    } catch {
      // Return null on parsing failure without crashing
    }
    return { start: null, end: null };
  }

  async discover() {
    try {
      // Fetch both upcoming and open challenges with fallback isolation
      const [upcomingData, openData] = await Promise.allSettled([
        this.fetchWithTimeout(this.upcomingEndpoint),
        this.fetchWithTimeout(this.openEndpoint),
      ]);

      const rawItems = [];
      if (upcomingData.status === "fulfilled" && Array.isArray(upcomingData.value?.hackathons)) {
        rawItems.push(...upcomingData.value.hackathons);
      }
      if (openData.status === "fulfilled" && Array.isArray(openData.value?.hackathons)) {
        rawItems.push(...openData.value.hackathons);
      }

      // Deduplicate by Devpost ID
      const seenIds = new Set();
      const uniqueItems = [];
      for (const item of rawItems) {
        if (item.id && !seenIds.has(item.id)) {
          seenIds.add(item.id);
          uniqueItems.push(item);
        }
      }

      const hackathons = uniqueItems.map((item) => {
        const themes = Array.isArray(item.themes)
          ? item.themes.map((t) => t.name).filter(Boolean)
          : [];

        const isOnline = item.displayed_location?.location?.toLowerCase().includes("online") ?? true;
        const location = item.displayed_location?.location || (isOnline ? "Online / Virtual" : "Global");
        const dates = this.parseDateRange(item.submission_period_dates);
        const prize = this.cleanPrizeString(item.prize_amount);

        const slugPart = (item.title || `devpost-${item.id}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        return {
          source_id: `devpost_${item.id}`,
          source_platform: "Devpost",
          slug: `devpost-${slugPart}`,
          title: item.title ? item.title.trim() : "Untitled Hackathon",
          organizer: item.organization_name || "Devpost Host",
          description: `Official hackathon organized by ${item.organization_name || "the community"}. Submissions open via Devpost platform.`,
          domain: themes.length > 0 ? themes[0] : "Software Engineering",
          technologies: themes,
          location,
          is_online: isOnline,
          registration_deadline: dates.end || dates.start || null,
          event_start: dates.start || null,
          event_end: dates.end || null,
          website_url: item.url,
          registration_url: item.start_a_submission_url || item.url,
          source_url: item.url,
          team_min: 1,
          team_max: 4,
          prize: prize,
          difficulty: "intermediate",
          eligibility: "Open to developers and students worldwide per official rules.",
          rules: "Standard competition rules. All submissions subject to verification on official event portal.",
          is_verified: true,
          verification_tier: "verified",
        };
      });

      return {
        success: true,
        source: this.name,
        hackathons,
      };
    } catch (error) {
      return {
        success: false,
        source: this.name,
        hackathons: [],
        error: error.message,
      };
    }
  }
}

module.exports = DevpostAdapter;
