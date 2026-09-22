const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ================================ */
/* Hackathons */
/* ================================ */

export async function getHackathons() {
  const response = await fetch(
    `${API_URL}/api/hackathons`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hackathons");
  }

  return response.json();
}

export async function getHackathonById(id: string) {
  const response = await fetch(
    `${API_URL}/api/hackathons/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hackathon");
  }

  return response.json();
}

/* ================================ */
/* Winning Projects */
/* ================================ */

export async function getProjects() {
  const response = await fetch(
    `${API_URL}/api/projects`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function getProjectById(id: string) {
  try {
    const response = await fetch(
      `${API_URL}/api/projects/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch project");
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch project:", error);
    throw error;
  }
}

/* ================================ */
/* Discovery Engine Telemetry */
/* ================================ */

export async function getDiscoveryStatus() {
  try {
    const response = await fetch(`${API_URL}/api/discovery/status`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch discovery status");
    }
    return response.json();
  } catch (error) {
    console.warn("Discovery status endpoint unreachable:", error);
    return {
      success: false,
      data: {
        status: "idle",
        sources_checked: 0,
        verified_count: 0,
        discovered_count: 0,
        expired_count: 0,
        successful_sources: [],
      },
    };
  }
}

export async function triggerDiscoverySync() {
  const response = await fetch(`${API_URL}/api/discovery/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to trigger discovery sync");
  }

  return response.json();
}