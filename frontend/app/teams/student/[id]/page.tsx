"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Profile {
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
  profile_completed: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadProfile() {
      try {
        const response = await fetch(
          `${API_URL}/api/profiles/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Profile not found");
        }

        const result = await response.json();

        setProfile(result.data);
      } catch (error) {
        console.error(error);
        setError("Student profile not found.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 pt-40">
          <div className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.03] p-10">
            <div className="h-20 w-20 rounded-full bg-white/10" />

            <div className="mt-6 h-8 w-64 rounded bg-white/10" />

            <div className="mt-4 h-4 w-80 rounded bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 pt-40 text-center">
          <div className="text-6xl">👤</div>

          <h1 className="mt-6 text-3xl font-bold">
            Student not found
          </h1>

          <p className="mt-3 text-gray-500">
            This profile may no longer be available.
          </p>

          <Link
            href="/teams"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            Back to Team Finder
          </Link>
        </div>
      </main>
    );
  }

  const yearSuffix =
    profile.year === 1
      ? "st"
      : profile.year === 2
      ? "nd"
      : profile.year === 3
      ? "rd"
      : "th";

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 pb-20 pt-32">

        {/* Back */}
        <Link
          href="/teams"
          className="text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Team Finder
        </Link>

        {/* Profile Hero */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent p-8 md:p-10">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-4xl">
              👤
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold md:text-4xl">
                  {profile.name}
                </h1>

                {profile.looking_for_team && (
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                    Looking for team
                  </span>
                )}

              </div>

              {profile.preferred_role && (
                <p className="mt-3 text-lg font-medium text-blue-400">
                  {profile.preferred_role}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">

                {profile.city && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-400">
                    📍 {profile.city}
                  </span>
                )}

                {profile.branch && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-400">
                    {profile.branch}
                  </span>
                )}

                {profile.year && (
                  <span className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-gray-400">
                    {profile.year}
                    {yearSuffix} Year
                  </span>
                )}

              </div>

            </div>
          </div>

          {/* Education */}
          <div className="mt-8 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-2">

            {profile.college && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600">
                  College
                </p>

                <p className="mt-2 text-gray-300">
                  {profile.college}
                </p>
              </div>
            )}

            {profile.availability && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-600">
                  Availability
                </p>

                <p className="mt-2 text-gray-300">
                  {profile.availability}
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Skills */}
        {profile.skills && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <h2 className="text-xl font-bold">
              Skills
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">

              {profile.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300"
                  >
                    {skill}
                  </span>
                ))}

            </div>
          </section>
        )}

        {/* About */}
        {profile.bio && (
          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <h2 className="text-xl font-bold">
              About
            </h2>

            <p className="mt-4 leading-7 text-gray-400">
              {profile.bio}
            </p>

          </section>
        )}

        {/* Links */}
        <section className="mt-6 flex flex-wrap gap-3">

          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white hover:text-black"
            >
              GitHub ↗
            </a>
          )}

          {profile.portfolio_url &&
            profile.portfolio_url !== "enter here" && (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white hover:text-black"
              >
                Portfolio ↗
              </a>
            )}

          <Link
            href="/teams"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Find a Team →
          </Link>

        </section>

      </div>
    </main>
  );
}