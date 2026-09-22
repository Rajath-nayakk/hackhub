"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Recommendation {
  id: number;
  name: string;
  college: string | null;
  city: string | null;
  branch: string | null;
  year: number | null;
  skills: string | null;
  preferred_role: string | null;
  availability: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  bio: string | null;
  looking_for_team: boolean;
  match_percentage: number;
  reasons: string[];
}

interface RecommendationResponse {
  success: boolean;
  student: {
    id: number;
    name: string;
  };
  count: number;
  data: Recommendation[];
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RecommendedTeammates() {
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------
        // 1. Get the currently logged-in Supabase user
        // ------------------------------------------------

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw new Error("Unable to check your login session.");
        }

        if (!user) {
          throw new Error(
            "Please log in to see teammate recommendations."
          );
        }

        // ------------------------------------------------
        // 2. Find the HackHub profile connected to this user
        // ------------------------------------------------

        const profileResponse = await fetch(
          `${API_URL}/api/profiles/by-auth/${user.id}`,
          {
            cache: "no-store",
          }
        );

        if (!profileResponse.ok) {
          throw new Error(
            "Your HackHub profile could not be found."
          );
        }

        const profileResult = await profileResponse.json();

        if (
          !profileResult.success ||
          !profileResult.data?.id
        ) {
          throw new Error(
            "Please complete your HackHub profile first."
          );
        }

        // This is now the REAL HackHub profile ID
        const studentId = profileResult.data.id;

        // ------------------------------------------------
        // 3. Get recommendations for this profile
        // ------------------------------------------------

        const response = await fetch(
          `${API_URL}/api/teams/recommendations?studentId=${studentId}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch teammate recommendations."
          );
        }

        const result: RecommendationResponse =
          await response.json();

        if (!result.success) {
          throw new Error(
            "Unable to load teammate recommendations."
          );
        }

        setRecommendations(result.data || []);
      } catch (err) {
        console.error("Recommendation error:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Unable to load teammate recommendations."
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  // ------------------------------------------------
  // Loading state
  // ------------------------------------------------

  if (loading) {
    return (
      <section className="mt-20">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-white/10" />

          <div className="mt-3 h-8 w-80 rounded bg-white/10" />

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-72 rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------
  // Error state
  // ------------------------------------------------

  if (error) {
    return (
      <section className="mt-20 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <p className="text-sm text-red-400">
          {error}
        </p>

        {error.includes("log in") && (
          <Link
            href="/auth/login"
            className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Login
          </Link>
        )}
      </section>
    );
  }

  // ------------------------------------------------
  // Empty state
  // ------------------------------------------------

  if (recommendations.length === 0) {
    return (
      <section className="mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Smart Matching
          </p>
        </div>

        <p className="mt-3 text-lg font-semibold text-white">
          No teammate recommendations yet
        </p>

        <p className="mt-2 text-sm text-gray-500">
          More students will appear here as they create
          profiles and start looking for teams.
        </p>
      </section>
    );
  }

  // ------------------------------------------------
  // Main UI
  // ------------------------------------------------

  return (
    <section className="mt-20">
      {/* Section heading */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>

          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
            Smart Matching
          </p>
        </div>

        <h2 className="mt-3 text-3xl font-bold text-white">
          Recommended Teammates
        </h2>

        <p className="mt-3 max-w-2xl text-gray-400">
          Based on your skills, role, location and
          availability, these students could be a good
          fit for your next hackathon team.
        </p>
      </div>

      {/* Recommendation cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {recommendations.map((student) => {
          const match = student.match_percentage;

          return (
            <div
              key={student.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-[#121212]"
            >
              {/* Background glow */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl">
                    👤
                  </div>

                  <div>
                    <Link
                      href={`/teams/student/${student.id}`}
                      className="text-xl font-semibold text-white transition hover:text-blue-400"
                    >
                      {student.name}
                    </Link>

                    <p className="mt-1 text-sm text-blue-400">
                      {student.preferred_role ||
                        "Team Member"}
                    </p>
                  </div>
                </div>

                {/* Match score */}
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {match}%
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-gray-600">
                    Match
                  </div>
                </div>
              </div>

              {/* Match bar */}
              <div className="relative mt-5">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-700"
                    style={{
                      width: `${match}%`,
                    }}
                  />
                </div>
              </div>

              {/* Student details */}
              <div className="relative mt-5 flex flex-wrap gap-2">
                {student.city && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                    📍 {student.city}
                  </span>
                )}

                {student.branch && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                    {student.branch}
                  </span>
                )}

                {student.year && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                    Year {student.year}
                  </span>
                )}

                {student.availability && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                    🕒 {student.availability}
                  </span>
                )}
              </div>

              {/* Skills */}
              {student.skills && (
                <div className="relative mt-5">
                  <p className="mb-2 text-xs uppercase tracking-wider text-gray-600">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {student.skills
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Why this match */}
              {student.reasons &&
                student.reasons.length > 0 && (
                  <div className="relative mt-5">
                    <p className="mb-2 text-xs uppercase tracking-wider text-gray-600">
                      Why this match
                    </p>

                    <div className="space-y-1.5">
                      {student.reasons.map(
                        (reason, index) => (
                          <p
                            key={`${reason}-${index}`}
                            className="text-sm text-gray-400"
                          >
                            <span className="mr-2 text-green-400">
                              ✓
                            </span>

                            {reason}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Footer */}
              <div className="relative mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <Link
                  href={`/teams/student/${student.id}`}
                  className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  View Profile
                </Link>

                <button
                  type="button"
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  Invite to Team
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}