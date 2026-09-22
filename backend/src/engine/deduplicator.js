const crypto = require("crypto");

/**
 * Generates an MD5 / SHA-256 fingerprint for a hackathon's core mutable content
 */
function computeChangeHash(hackathon) {
  const content = [
    hackathon.title || "",
    hackathon.organizer || "",
    hackathon.event_start || "",
    hackathon.event_end || "",
    hackathon.registration_deadline || "",
    hackathon.website_url || "",
    hackathon.registration_url || "",
    hackathon.prize || "",
    hackathon.status || "",
  ].join("|");

  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

/**
 * Normalizes title for fuzzy matching
 */
function cleanTitle(title) {
  return (title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Deduplicates and merges candidate hackathons.
 * Retains higher-confidence records (verified over discovered),
 * and aggregates supplementary fields (technologies, links).
 *
 * @param {Array<Object>} candidates 
 * @returns {Array<Object>}
 */
function deduplicateHackathons(candidates) {
  const mapBySlug = new Map();
  const mapByTitle = new Map();

  for (const item of candidates) {
    const slugKey = item.slug ? item.slug.toLowerCase() : null;
    const titleKey = cleanTitle(item.title);

    let existing = null;
    if (slugKey && mapBySlug.has(slugKey)) {
      existing = mapBySlug.get(slugKey);
    } else if (titleKey && mapByTitle.has(titleKey)) {
      existing = mapByTitle.get(titleKey);
    }

    if (!existing) {
      const withHash = {
        ...item,
        change_hash: computeChangeHash(item),
      };
      if (slugKey) mapBySlug.set(slugKey, withHash);
      if (titleKey) mapByTitle.set(titleKey, withHash);
    } else {
      // Merge: prefer verified over discovered
      const preferNew =
        item.verification_tier === "verified" && existing.verification_tier !== "verified";

      const primary = preferNew ? item : existing;
      const secondary = preferNew ? existing : item;

      // Merge technologies
      const mergedTechs = Array.from(
        new Set([...(primary.technologies || []), ...(secondary.technologies || [])])
      );

      const merged = {
        ...primary,
        description: primary.description || secondary.description,
        website_url: primary.website_url || secondary.website_url,
        registration_url: primary.registration_url || secondary.registration_url,
        prize: primary.prize || secondary.prize,
        technologies: mergedTechs,
        problem_statements:
          primary.problem_statements && primary.problem_statements.length > 0
            ? primary.problem_statements
            : secondary.problem_statements || [],
        presentation_rules: primary.presentation_rules || secondary.presentation_rules,
      };

      merged.change_hash = computeChangeHash(merged);

      if (slugKey) mapBySlug.set(slugKey, merged);
      if (titleKey) mapByTitle.set(titleKey, merged);
    }
  }

  // Return unique objects
  return Array.from(new Set([...mapBySlug.values(), ...mapByTitle.values()]));
}

module.exports = {
  deduplicateHackathons,
  computeChangeHash,
};
