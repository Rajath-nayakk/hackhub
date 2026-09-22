/**
 * Validator: Enforces data correctness, chronological sanity, URL validity,
 * and classifies records into 'verified', 'discovered', or invalid without fabrication.
 */

function isValidHttpUrl(string) {
  if (!string || typeof string !== "string") return false;
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validates a normalized hackathon candidate
 * @param {Object} hackathon 
 * @returns {{ valid: boolean, errors: string[], tier: 'verified' | 'discovered' }}
 */
function validateHackathon(hackathon) {
  const errors = [];

  // Mandatory fields
  if (!hackathon.title || typeof hackathon.title !== "string" || hackathon.title.trim().length < 2) {
    errors.push("Missing or invalid title");
  }

  if (!hackathon.organizer || typeof hackathon.organizer !== "string" || hackathon.organizer.trim().length < 2) {
    errors.push("Missing or invalid organizer");
  }

  // URL requirement: at least one valid official link must exist
  const hasValidUrl =
    isValidHttpUrl(hackathon.website_url) ||
    isValidHttpUrl(hackathon.registration_url) ||
    isValidHttpUrl(hackathon.source_url);

  if (!hasValidUrl) {
    errors.push("No valid website, registration, or source URL provided");
  }

  // Date chronological sanity checks
  if (hackathon.event_start && hackathon.event_end) {
    const start = new Date(hackathon.event_start).getTime();
    const end = new Date(hackathon.event_end).getTime();
    if (start > end) {
      errors.push("event_start is after event_end");
    }
  }

  if (hackathon.registration_deadline && hackathon.event_end) {
    const reg = new Date(hackathon.registration_deadline).getTime();
    const end = new Date(hackathon.event_end).getTime();
    // Allow small grace window for registration closing right at event conclusion
    if (reg > end + 86400000) {
      errors.push("registration_deadline is significantly after event_end");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, tier: "discovered" };
  }

  // Determine verification tier
  // Must have valid registration/website link and verified source/organizer flag
  const isHighQuality =
    isValidHttpUrl(hackathon.registration_url || hackathon.website_url) &&
    (hackathon.is_verified || hackathon.source_platform === "Devfolio" || hackathon.source_platform === "Devpost");

  const tier = isHighQuality ? "verified" : "discovered";

  return {
    valid: true,
    errors: [],
    tier,
  };
}

module.exports = {
  validateHackathon,
  isValidHttpUrl,
};
