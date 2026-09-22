/**
 * LifecycleManager: Evaluates real-time event status and registration status independently.
 *
 * Rules:
 * - upcoming: event has not started and registration may still be open
 * - registration_closed: registration deadline has passed but event has not started
 * - ongoing: current time is between event_start and event_end
 * - ended: current time is after event_end
 */

function evaluateLifecycle(hackathon, now = new Date()) {
  const nowMs = now.getTime();
  const startMs = hackathon.event_start ? new Date(hackathon.event_start).getTime() : null;
  const endMs = hackathon.event_end ? new Date(hackathon.event_end).getTime() : null;
  const regDeadlineMs = hackathon.registration_deadline
    ? new Date(hackathon.registration_deadline).getTime()
    : startMs;

  let status = "upcoming";
  let registrationStatus = "open";

  // Check ended first
  if (endMs && nowMs > endMs) {
    status = "ended";
    registrationStatus = "closed";
  } else if (startMs && endMs && nowMs >= startMs && nowMs <= endMs) {
    status = "ongoing";
    registrationStatus = "closed"; // In-flight events usually don't accept new registrations
  } else if (regDeadlineMs && nowMs > regDeadlineMs && (!startMs || nowMs < startMs)) {
    status = "registration_closed";
    registrationStatus = "closed";
  } else {
    status = "upcoming";
    // Check if registration is closing within 48 hours
    if (regDeadlineMs && regDeadlineMs - nowMs > 0 && regDeadlineMs - nowMs < 48 * 3600 * 1000) {
      registrationStatus = "closing_soon";
    } else {
      registrationStatus = "open";
    }
  }

  const isExpired = status === "ended";
  const verificationTier = isExpired ? "expired" : hackathon.verification_tier || "discovered";

  return {
    ...hackathon,
    status,
    registration_status: registrationStatus,
    is_expired: isExpired,
    verification_tier: verificationTier,
  };
}

module.exports = {
  evaluateLifecycle,
};
