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
}