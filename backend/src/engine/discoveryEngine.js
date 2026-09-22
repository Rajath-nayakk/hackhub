const DevfolioAdapter = require("./adapters/devfolioAdapter");
const DevpostAdapter = require("./adapters/devpostAdapter");
const { normalizeHackathon } = require("./normalizer");
const { validateHackathon } = require("./validator");
const { evaluateLifecycle } = require("./lifecycleManager");
const { deduplicateHackathons } = require("./deduplicator");
const discoveryStorage = require("./discoveryStorage");

class DiscoveryEngine {
  constructor() {
    this.adapters = [
      new DevfolioAdapter(),
      new DevpostAdapter(),
    ];

    this.telemetry = {
      status: "idle", // 'idle' | 'running' | 'completed' | 'error'
      last_run_at: null,
      last_duration_ms: 0,
      sources_checked: 0,
      total_hackathons_discovered: 0,
      verified_count: 0,
      discovered_count: 0,
      expired_count: 0,
      failed_sources: [],
      successful_sources: [],
      persistence_mode: "unknown",
      error_message: null,
    };

    this.scheduledTimer = null;
    this.isRunning = false;
  }

  /**
   * Register an additional custom source adapter
   */
  registerAdapter(adapter) {
    this.adapters.push(adapter);
  }

  /**
   * Run the complete Discovery & Verification Pipeline
   */
  async runDiscoveryPipeline() {
    if (this.isRunning) {
      return {
        success: false,
        message: "Discovery cycle already running in background",
        telemetry: this.telemetry,
      };
    }

    this.isRunning = true;
    const startTime = Date.now();
    this.telemetry.status = "running";
    this.telemetry.failed_sources = [];
    this.telemetry.successful_sources = [];
    this.telemetry.error_message = null;

    console.log(`[DiscoveryEngine] Starting discovery cycle across ${this.adapters.length} authoritative sources...`);

    try {
      const allExtracted = [];

      // 1. Fetch all sources with complete fault isolation
      for (const adapter of this.adapters) {
        try {
          console.log(`[DiscoveryEngine] Querying authoritative source: ${adapter.name}...`);
          const result = await adapter.discover();

          if (result.success && Array.isArray(result.hackathons)) {
            allExtracted.push(...result.hackathons);
            this.telemetry.successful_sources.push(adapter.name);
            console.log(`[DiscoveryEngine] ${adapter.name}: Retrieved ${result.hackathons.length} hackathons`);
          } else {
            this.telemetry.failed_sources.push({
              source: adapter.name,
              reason: result.error || "Adapter returned unsuccessful status",
            });
            console.warn(`[DiscoveryEngine] ${adapter.name} failed: ${result.error}`);
          }
        } catch (adapterErr) {
          this.telemetry.failed_sources.push({
            source: adapter.name,
            reason: adapterErr.message,
          });
          console.warn(`[DiscoveryEngine] Error running adapter ${adapter.name}:`, adapterErr.message);
        }
      }

      // 2. Normalization & Validation Layer
      const validatedList = [];
      for (const raw of allExtracted) {
        const normalized = normalizeHackathon(raw);
        const validation = validateHackathon(normalized);

        if (validation.valid) {
          // Lifecycle Evaluation
          const withLifecycle = evaluateLifecycle({
            ...normalized,
            verification_tier: validation.tier,
          });
          validatedList.push(withLifecycle);
        }
      }

      // 3. Deduplication and Cross-Source Merging
      const deduplicated = deduplicateHackathons(validatedList);

      // 4. Persistence to Supabase (primary) and Offline Cache (fallback)
      const persistResult = await discoveryStorage.persist(deduplicated, {
        started_at: new Date(startTime).toISOString(),
        sources_checked: this.adapters.length,
        failed_sources: this.telemetry.failed_sources.map((f) => f.source),
      });

      // 5. Update Telemetry
      const durationMs = Date.now() - startTime;
      const verifiedCount = deduplicated.filter((h) => h.verification_tier === "verified").length;
      const discoveredCount = deduplicated.filter((h) => h.verification_tier === "discovered").length;
      const expiredCount = deduplicated.filter((h) => h.is_expired).length;

      this.telemetry = {
        status: "completed",
        last_run_at: new Date().toISOString(),
        last_duration_ms: durationMs,
        sources_checked: this.adapters.length,
        total_hackathons_discovered: deduplicated.length,
        verified_count: verifiedCount,
        discovered_count: discoveredCount,
        expired_count: expiredCount,
        failed_sources: this.telemetry.failed_sources,
        successful_sources: this.telemetry.successful_sources,
        persistence_mode: persistResult.persistence,
        error_message: null,
      };

      console.log(
        `[DiscoveryEngine] Cycle complete in ${durationMs}ms. Synced ${deduplicated.length} total hackathons (${verifiedCount} verified, ${discoveredCount} discovered, ${expiredCount} expired). Persistence: ${persistResult.persistence}`
      );

      return {
        success: true,
        count: deduplicated.length,
        telemetry: this.telemetry,
      };
    } catch (err) {
      this.telemetry.status = "error";
      this.telemetry.error_message = err.message;
      console.error("[DiscoveryEngine] Pipeline error:", err);
      return {
        success: false,
        error: err.message,
        telemetry: this.telemetry,
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Start automated background scheduling (every 6 hours)
   */
  startScheduler(intervalHours = 6) {
    if (this.scheduledTimer) {
      clearInterval(this.scheduledTimer);
    }

    const intervalMs = intervalHours * 60 * 60 * 1000;
    console.log(`[DiscoveryEngine] Background scheduler active: refreshing every ${intervalHours} hours.`);

    // Run first discovery cycle after 5 seconds of server startup
    setTimeout(() => {
      this.runDiscoveryPipeline().catch((err) => {
        console.error("[DiscoveryEngine] Scheduled run failure:", err.message);
      });
    }, 5000);

    // Schedule recurring runs
    this.scheduledTimer = setInterval(() => {
      console.log("[DiscoveryEngine] Executing scheduled discovery refresh...");
      this.runDiscoveryPipeline().catch((err) => {
        console.error("[DiscoveryEngine] Recurring run failure:", err.message);
      });
    }, intervalMs);
  }

  /**
   * Stop automated background scheduling
   */
  stopScheduler() {
    if (this.scheduledTimer) {
      clearInterval(this.scheduledTimer);
      this.scheduledTimer = null;
    }
  }

  /**
   * Returns current engine telemetry
   */
  getTelemetry() {
    return {
      ...this.telemetry,
      is_running: this.isRunning,
      active_adapters: this.adapters.map((a) => ({
        name: a.name,
        source_type: a.sourceType,
        priority: a.priority,
      })),
    };
  }
}

// Export singleton instance
module.exports = new DiscoveryEngine();
