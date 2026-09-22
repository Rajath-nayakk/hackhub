require("dotenv").config();
const assert = require("assert");
const { deduplicateHackathons } = require("../deduplicator");
const { evaluateLifecycle } = require("../lifecycleManager");
const { validateHackathon } = require("../validator");
const { normalizeHackathon } = require("../normalizer");
const DiscoveryEngine = require("../discoveryEngine");
const BaseAdapter = require("../adapters/baseAdapter");

console.log("=== RUNNING HACKHUB ENGINE UNIT & INTEGRATION TESTS ===");

// 1. DUPLICATE DETECTION TEST
console.log("\n[TEST 1] Duplicate Detection & Cross-Source Merge...");
const candidateA = {
  source_id: "src_1",
  source_platform: "Devfolio",
  slug: "ai-hackathon-2027",
  title: "AI Global Hackathon",
  organizer: "AI Foundation",
  website_url: "https://ai-hack.org",
  registration_url: "https://ai-hack.devfolio.co",
  technologies: ["Python", "PyTorch"],
  verification_tier: "verified",
  status: "upcoming",
};

const candidateB = {
  source_id: "src_2",
  source_platform: "Devpost",
  slug: "ai-hackathon-2027",
  title: "AI Global Hackathon",
  organizer: "AI Foundation",
  website_url: "https://ai-hack.org",
  registration_url: "https://devpost.com/challenges/ai-hack",
  technologies: ["TensorFlow", "React"],
  verification_tier: "discovered",
  status: "upcoming",
};

const deduplicated = deduplicateHackathons([candidateA, candidateB]);
assert.strictEqual(deduplicated.length, 1, "Should merge identical events into exactly 1 record");
assert.strictEqual(deduplicated[0].verification_tier, "verified", "Should retain verified tier from candidate A");
assert.ok(deduplicated[0].technologies.includes("PyTorch"), "Should retain PyTorch");
assert.ok(deduplicated[0].technologies.includes("TensorFlow"), "Should merge TensorFlow from candidate B");
assert.ok(deduplicated[0].change_hash, "Should compute change hash");
console.log("✓ Duplicate detection test passed!");

// 2. LIFECYCLE & STATUS EVALUATION TEST
console.log("\n[TEST 2] Lifecycle & Status Evaluation...");
const now = new Date("2026-10-15T12:00:00Z");

// Case 2a: Event in future, registration open
const upcomingEvent = evaluateLifecycle(
  {
    event_start: "2026-11-01T00:00:00Z",
    event_end: "2026-11-03T00:00:00Z",
    registration_deadline: "2026-10-25T00:00:00Z",
  },
  now
);
assert.strictEqual(upcomingEvent.status, "upcoming");
assert.strictEqual(upcomingEvent.registration_status, "open");
assert.strictEqual(upcomingEvent.is_expired, false);

// Case 2b: Registration closed, event not started
const regClosedEvent = evaluateLifecycle(
  {
    event_start: "2026-10-20T00:00:00Z",
    event_end: "2026-10-22T00:00:00Z",
    registration_deadline: "2026-10-10T00:00:00Z",
  },
  now
);
assert.strictEqual(regClosedEvent.status, "registration_closed");
assert.strictEqual(regClosedEvent.registration_status, "closed");
assert.strictEqual(regClosedEvent.is_expired, false);

// Case 2c: Event ongoing right now
const ongoingEvent = evaluateLifecycle(
  {
    event_start: "2026-10-14T00:00:00Z",
    event_end: "2026-10-16T00:00:00Z",
    registration_deadline: "2026-10-13T00:00:00Z",
  },
  now
);
assert.strictEqual(ongoingEvent.status, "ongoing");
assert.strictEqual(ongoingEvent.is_expired, false);

// Case 2d: Event ended in the past
const endedEvent = evaluateLifecycle(
  {
    event_start: "2026-09-01T00:00:00Z",
    event_end: "2026-09-03T00:00:00Z",
    registration_deadline: "2026-08-30T00:00:00Z",
  },
  now
);
assert.strictEqual(endedEvent.status, "ended");
assert.strictEqual(endedEvent.registration_status, "closed");
assert.strictEqual(endedEvent.is_expired, true);
assert.strictEqual(endedEvent.verification_tier, "expired");
console.log("✓ Lifecycle & status evaluation test passed!");

// 3. VALIDATION & CLAIM SAFETY TEST
console.log("\n[TEST 3] Validation & Claim Safety...");
const invalidNoUrl = validateHackathon({
  title: "Hackathon without URL",
  organizer: "Anonymous",
});
assert.strictEqual(invalidNoUrl.valid, false, "Should reject hackathon with no URL");

const invalidChronology = validateHackathon({
  title: "Time Travel Hack",
  organizer: "Chronos",
  website_url: "https://chronos.io",
  event_start: "2026-12-01T00:00:00Z",
  event_end: "2026-11-01T00:00:00Z", // end before start!
});
assert.strictEqual(invalidChronology.valid, false, "Should reject event where start > end");

const validCandidate = validateHackathon({
  title: "Legitimate Hackathon",
  organizer: "Engineering Society",
  website_url: "https://legit.org",
  registration_url: "https://legit.org/register",
  event_start: "2026-11-01T00:00:00Z",
  event_end: "2026-11-02T00:00:00Z",
  is_verified: true,
});
assert.strictEqual(validCandidate.valid, true, "Should accept valid candidate");
assert.strictEqual(validCandidate.tier, "verified");
console.log("✓ Validation and claim safety test passed!");

// 4. FAULT ISOLATION & ADAPTER FAILURE RESILIENCE TEST
console.log("\n[TEST 4] Fault Isolation & Failure Handling...");
class FailingAdapter extends BaseAdapter {
  constructor() {
    super({ name: "FailingMockSource", sourceType: "official_platform", priority: 5 });
  }
  async discover() {
    throw new Error("Simulated 500 upstream gateway timeout");
  }
}

class WorkingAdapter extends BaseAdapter {
  constructor() {
    super({ name: "WorkingMockSource", sourceType: "official_platform", priority: 2 });
  }
  async discover() {
    return {
      success: true,
      hackathons: [
        {
          title: "Resilient Hack",
          organizer: "Resilience Inc",
          website_url: "https://resilient.io",
          is_verified: true,
        },
      ],
    };
  }
}

// Instantiate test engine with 1 failing and 1 working adapter
const testEngine = new DiscoveryEngine.constructor();
testEngine.adapters = [new FailingAdapter(), new WorkingAdapter()];

testEngine.runDiscoveryPipeline().then((res) => {
  assert.strictEqual(res.success, true, "Engine should succeed despite 1 failed source");
  assert.strictEqual(res.telemetry.failed_sources.length, 1, "Should capture failed source in telemetry");
  assert.strictEqual(res.telemetry.failed_sources[0].source, "FailingMockSource");
  assert.strictEqual(res.telemetry.successful_sources[0], "WorkingMockSource");
  assert.ok(res.count >= 1, "Should preserve records from working source");
  console.log("✓ Fault isolation and failure test passed!");
  console.log("\nALL 4 INTEGRATION TESTS COMPLETED SUCCESSFULLY!");
});
