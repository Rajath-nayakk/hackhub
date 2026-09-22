const BaseAdapter = require("./baseAdapter");

class DevfolioAdapter extends BaseAdapter {
  constructor() {
    super({
      name: "Devfolio",
      sourceType: "official_platform",
      priority: 2, // High priority trusted platform
      timeoutMs: 12000,
    });
    this.endpoint = "https://api.devfolio.co/api/hackathons?type=upcoming&page=1&size=30";
  }

  async discover() {
    try {
      const data = await this.fetchWithTimeout(this.endpoint);
      const rawList = data.result || [];

      const hackathons = rawList.map((item) => {
        const setting = item.hackathon_setting || {};
        const themes = Array.isArray(item.themes)
          ? item.themes.map((t) => t.name).filter(Boolean)
          : [];

        // Build canonical location string
        let location = item.is_online ? "Online / Virtual" : item.location;
        if (!location) {
          const parts = [item.city, item.state, item.country].filter(Boolean);
          location = parts.length > 0 ? parts.join(", ") : (item.is_online ? "Online" : "To be announced");
        }

        // Official registration & website URLs
        const devfolioUrl = item.slug ? `https://${item.slug}.devfolio.co` : null;
        const websiteUrl = setting.site || devfolioUrl;
        const registrationUrl = devfolioUrl || setting.site;

        // Determine domain from themes
        let domain = "Open Innovation";
        if (themes.length > 0) {
          domain = themes[0];
        }

        return {
          source_id: `devfolio_${item.uuid || item.slug}`,
          source_platform: "Devfolio",
          slug: item.slug ? `devfolio-${item.slug}` : undefined,
          title: item.name ? item.name.trim() : "Untitled Hackathon",
          organizer: item.edition_name || item.name || "Devfolio Community",
          description: item.tagline || (item.desc ? item.desc.slice(0, 300) : null),
          domain,
          technologies: themes,
          location,
          is_online: Boolean(item.is_online),
          registration_deadline: setting.reg_ends_at || item.starts_at || null,
          event_start: item.starts_at || null,
          event_end: item.ends_at || null,
          website_url: websiteUrl,
          registration_url: registrationUrl,
          source_url: devfolioUrl || websiteUrl,
          team_min: item.team_min || 1,
          team_max: item.team_size || 4,
          prize: setting.quadratic_voting_prize_pool_amount ? `${setting.quadratic_voting_prize_pool_amount} ${setting.quadratic_voting_currency || "USD"}` : null,
          difficulty: "intermediate",
          eligibility: "Open to student developers and engineering professionals globally.",
          rules: setting.judging_factors ? `Judging criteria: ${setting.judging_factors}` : null,
          is_verified: Boolean(item.verified),
          verification_tier: item.verified ? "verified" : "discovered",
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

module.exports = DevfolioAdapter;
