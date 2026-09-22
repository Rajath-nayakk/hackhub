const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase");

const CACHE_FILE_PATH = path.join(__dirname, "../../data/discoveryCache.json");

class DiscoveryStorage {
  /**
   * Load current offline cache file
   * @returns {Array<Object>}
   */
  loadOfflineCache() {
    try {
      if (fs.existsSync(CACHE_FILE_PATH)) {
        const raw = fs.readFileSync(CACHE_FILE_PATH, "utf8");
        const list = JSON.parse(raw);
        return list.map((item) => ({
          ...item,
          id: item.id || item.slug || item.source_id,
        }));
      }
    } catch (err) {
      console.warn("[DiscoveryStorage] Failed to read offline cache:", err.message);
    }
    return [];
  }

  /**
   * Write offline cache snapshot
   * @param {Array<Object>} hackathons 
   */
  saveOfflineCache(hackathons) {
    try {
      const dir = path.dirname(CACHE_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(hackathons, null, 2), "utf8");
    } catch (err) {
      console.warn("[DiscoveryStorage] Failed to write offline cache:", err.message);
    }
  }

  /**
   * Persist discovered and validated hackathons.
   * Supabase/PostgreSQL is the authoritative primary store.
   * If Supabase is unreachable, records are preserved in last-known-good offline cache.
   *
   * @param {Array<Object>} incomingHackathons 
   * @param {Object} syncTelemetry 
   * @returns {Promise<{ persistence: string, count: number, updated: number, inserted: number }>}
   */
  async persist(incomingHackathons, syncTelemetry = {}) {
    const now = new Date().toISOString();
    let supabaseSuccess = false;
    let updatedCount = 0;
    let insertedCount = 0;

    try {
      // 1. Attempt reading from Supabase
      const { data: existingRecords, error: fetchError } = await supabase
        .from("hackathons")
        .select("*");

      if (!fetchError && Array.isArray(existingRecords)) {
        supabaseSuccess = true;
        const existingMap = new Map();
        for (const rec of existingRecords) {
          if (rec.slug) existingMap.set(rec.slug, rec);
        }

        // Upsert non-destructively
        for (const candidate of incomingHackathons) {
          const existing = existingMap.get(candidate.slug);

          if (existing) {
            // Update only if content changed or we have higher confidence
            const hasChanged = existing.change_hash !== candidate.change_hash;
            await supabase
              .from("hackathons")
              .update({
                title: candidate.title,
                organizer: candidate.organizer,
                description: candidate.description || existing.description,
                domain: candidate.domain,
                technologies: candidate.technologies,
                location: candidate.location,
                is_online: candidate.is_online,
                registration_deadline: candidate.registration_deadline || existing.registration_deadline,
                event_start: candidate.event_start || existing.event_start,
                event_end: candidate.event_end || existing.event_end,
                website_url: candidate.website_url || existing.website_url,
                registration_url: candidate.registration_url || existing.registration_url,
                prize: candidate.prize || existing.prize,
                status: candidate.status,
                verification_tier: candidate.verification_tier,
                last_verified_at: candidate.verification_tier === "verified" ? now : existing.last_verified_at,
                last_checked_at: now,
                last_fetch_status: "success",
                change_hash: candidate.change_hash,
                updated_at: now,
              })
              .eq("id", existing.id);

            if (hasChanged) updatedCount++;
          } else {
            // Insert new record
            await supabase.from("hackathons").insert([
              {
                ...candidate,
                last_verified_at: candidate.verification_tier === "verified" ? now : null,
                last_checked_at: now,
                last_fetch_status: "success",
                created_at: now,
                updated_at: now,
              },
            ]);
            insertedCount++;
          }
        }

        // Record sync log in Supabase
        try {
          await supabase.from("hackathon_sync_logs").insert([
            {
              started_at: syncTelemetry.started_at || now,
              completed_at: now,
              sources_checked: syncTelemetry.sources_checked || 0,
              discovered_count: incomingHackathons.length,
              updated_count: updatedCount,
              expired_count: incomingHackathons.filter((h) => h.is_expired).length,
              failed_sources: syncTelemetry.failed_sources || [],
              status: "completed",
              telemetry: syncTelemetry,
            },
          ]);
        } catch {
          // Log table insert failure non-blocking
        }
      }
    } catch (err) {
      console.warn("[DiscoveryStorage] Supabase persistence error:", err.message);
      supabaseSuccess = false;
    }

    // 2. Always maintain the last-known-good offline cache snapshot
    const currentCache = this.loadOfflineCache();
    const cacheMap = new Map();
    for (const h of currentCache) {
      if (h.slug) cacheMap.set(h.slug, h);
    }

    // Non-destructively merge incoming records
    for (const candidate of incomingHackathons) {
      const existing = cacheMap.get(candidate.slug);
      cacheMap.set(candidate.slug, {
        ...(existing || {}),
        ...candidate,
        last_checked_at: now,
        last_fetch_status: "success",
        updated_at: now,
      });
    }

    const mergedList = Array.from(cacheMap.values());
    this.saveOfflineCache(mergedList);

    return {
      persistence: supabaseSuccess ? "supabase" : "offline-cache",
      count: incomingHackathons.length,
      updated: updatedCount,
      inserted: insertedCount,
    };
  }

  /**
   * Retrieve active hackathons
   * @param {Object} query 
   * @returns {Promise<{ source: string, data: Array<Object>, notice?: string }>}
   */
  async getHackathons(query = {}) {
    const { status, search, domain, difficulty, format } = query;

    // Try Supabase first
    try {
      let dbQuery = supabase
        .from("hackathons")
        .select("*")
        .order("registration_deadline", { ascending: true });

      if (status && status !== "all") {
        dbQuery = dbQuery.eq("status", status);
      }
      if (domain && domain !== "all") {
        dbQuery = dbQuery.ilike("domain", `%${domain}%`);
      }
      if (difficulty && difficulty !== "all") {
        dbQuery = dbQuery.eq("difficulty", difficulty);
      }
      if (format && format !== "all") {
        dbQuery = dbQuery.eq("is_online", format === "online");
      }

      const { data, error } = await dbQuery;

      if (!error && Array.isArray(data) && data.length > 0) {
        let filtered = data;
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(
            (h) =>
              (h.title || "").toLowerCase().includes(q) ||
              (h.organizer || "").toLowerCase().includes(q) ||
              (h.location || "").toLowerCase().includes(q)
          );
        }
        return {
          source: "supabase",
          data: filtered,
        };
      }
    } catch {
      // Fallback to offline cache
    }

    // Fallback to offline cache
    let cached = this.loadOfflineCache();

    // Filter offline cache
    if (status && status !== "all") {
      cached = cached.filter((h) => h.status === status);
    }
    if (domain && domain !== "all") {
      cached = cached.filter((h) => (h.domain || "").toLowerCase().includes(domain.toLowerCase()));
    }
    if (difficulty && difficulty !== "all") {
      cached = cached.filter((h) => (h.difficulty || "").toLowerCase() === difficulty.toLowerCase());
    }
    if (format && format !== "all") {
      cached = cached.filter((h) => (format === "online" ? h.is_online : !h.is_online));
    }
    if (search) {
      const q = search.toLowerCase();
      cached = cached.filter(
        (h) =>
          (h.title || "").toLowerCase().includes(q) ||
          (h.organizer || "").toLowerCase().includes(q) ||
          (h.location || "").toLowerCase().includes(q)
      );
    }

    return {
      source: "offline-cache",
      data: cached,
      notice: "Serving last-known-good verified offline cache because primary Supabase database is unreachable.",
    };
  }
}

module.exports = new DiscoveryStorage();
