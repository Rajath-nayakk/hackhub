/**
 * Normalizer: Cleans, sanitizes, and standardizes extracted hackathon candidate fields.
 */

const DOMAIN_MAP = [
  { match: /(ai|machine\s*learning|deep\s*learning|nlp|computer\s*vision)/i, canonical: "AI / ML" },
  { match: /(web3|blockchain|crypto|solidity|ethereum|defi|smart\s*contract)/i, canonical: "Web3 & Blockchain" },
  { match: /(health|med|clinic|pharma|bio)/i, canonical: "Healthcare & BioTech" },
  { match: /(fintech|finance|banking|security|cyber)/i, canonical: "FinTech & Security" },
  { match: /(iot|hardware|robotics|embedded|sensor)/i, canonical: "IoT & Hardware" },
  { match: /(gov|social|climate|sustainab|environment|un\s*sdg)/i, canonical: "GovTech & Social Impact" },
  { match: /(edu|education|learning|student)/i, canonical: "Education" },
];

/**
 * Maps a domain or theme name to a standard canonical domain
 */
function normalizeDomain(rawDomain) {
  if (!rawDomain || typeof rawDomain !== "string") return "Open Innovation";
  const str = rawDomain.trim();
  for (const { match, canonical } of DOMAIN_MAP) {
    if (match.test(str)) return canonical;
  }
  return str;
}

/**
 * Strips tracking parameters (utm, ref, fbclid) from a URL
 */
function sanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  try {
    const parsed = new URL(rawUrl.trim());
    const trackingParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "fbclid"];
    trackingParams.forEach((param) => parsed.searchParams.delete(param));
    return parsed.toString();
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Ensures date string is valid ISO-8601 UTC or null
 */
function normalizeDate(rawDate) {
  if (!rawDate) return null;
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return null;
    return d.toISOString();
  } catch {
    return null;
  }
}

/**
 * Normalizes a raw candidate hackathon object
 */
function normalizeHackathon(raw) {
  const title = (raw.title || "Untitled Hackathon").trim();
  const organizer = (raw.organizer || "Independent Organizer").trim();
  const slug = (raw.slug || `${raw.source_platform || "hack"}-${title}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const eventStart = normalizeDate(raw.event_start);
  const eventEnd = normalizeDate(raw.event_end);
  const registrationDeadline = normalizeDate(raw.registration_deadline) || eventStart;

  // Canonicalize domain and technologies array
  const domain = normalizeDomain(raw.domain || (Array.isArray(raw.technologies) ? raw.technologies[0] : null));
  const rawTechs = Array.isArray(raw.technologies) ? raw.technologies : [];
  const technologies = Array.from(
    new Set(rawTechs.map((t) => (typeof t === "string" ? t.trim() : "")).filter(Boolean))
  );

  // Bounds for team limits
  const teamMin = Math.max(1, parseInt(raw.team_min, 10) || 1);
  const teamMax = Math.max(teamMin, parseInt(raw.team_max, 10) || 4);

  return {
    source_id: raw.source_id,
    source_platform: raw.source_platform || "Unknown",
    slug,
    title,
    organizer,
    description: raw.description ? raw.description.trim() : null,
    domain,
    technologies,
    location: raw.location ? raw.location.trim() : (raw.is_online ? "Online / Virtual" : "To be announced"),
    is_online: Boolean(raw.is_online),
    registration_deadline: registrationDeadline,
    event_start: eventStart,
    event_end: eventEnd,
    website_url: sanitizeUrl(raw.website_url),
    registration_url: sanitizeUrl(raw.registration_url),
    source_url: sanitizeUrl(raw.source_url),
    team_min: teamMin,
    team_max: teamMax,
    prize: raw.prize ? raw.prize.trim() : null,
    difficulty: ["beginner", "intermediate", "advanced"].includes((raw.difficulty || "").toLowerCase())
      ? raw.difficulty.toLowerCase()
      : "intermediate",
    eligibility: raw.eligibility ? raw.eligibility.trim() : null,
    rules: raw.rules ? raw.rules.trim() : null,
    is_verified: Boolean(raw.is_verified),
    verification_tier: raw.verification_tier || (raw.is_verified ? "verified" : "discovered"),
    problem_statements: Array.isArray(raw.problem_statements) ? raw.problem_statements : [],
    presentation_rules: raw.presentation_rules || null,
  };
}

module.exports = {
  normalizeHackathon,
  normalizeDomain,
  sanitizeUrl,
  normalizeDate,
};
