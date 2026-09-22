"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Profile {
  id: number;
  auth_user_id: string | null;
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

export default function StudentDirectory() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [college, setCollege] = useState("All");
  const [city, setCity] = useState("All");
  const [branch, setBranch] = useState("All");
  const [year, setYear] = useState("All");

  useEffect(() => {
    async function loadProfiles() {
      try {
        const response = await fetch(`${API_URL}/api/profiles`);

        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }

        const result = await response.json();

        setProfiles(result.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load students.");
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, []);

  const colleges = useMemo(
    () =>
      [
        ...new Set(
          profiles
            .map((profile) => profile.college)
            .filter(Boolean)
        ),
      ],
    [profiles]
  );

  const cities = useMemo(
    () =>
      [
        ...new Set(
          profiles
            .map((profile) => profile.city)
            .filter(Boolean)
        ),
      ],
    [profiles]
  );

  const branches = useMemo(
    () =>
      [
        ...new Set(
          profiles
            .map((profile) => profile.branch)
            .filter(Boolean)
        ),
      ],
    [profiles]
  );

  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return profiles.filter((profile) => {
      const matchesSearch =
        !query ||
        profile.name?.toLowerCase().includes(query) ||
        profile.college?.toLowerCase().includes(query) ||
        profile.skills?.toLowerCase().includes(query) ||
        profile.preferred_role?.toLowerCase().includes(query);

      const matchesCollege =
        college === "All" || profile.college === college;

      const matchesCity =
        city === "All" || profile.city === city;

      const matchesBranch =
        branch === "All" || profile.branch === branch;

      const matchesYear =
        year === "All" || String(profile.year) === year;

      return (
        matchesSearch &&
        matchesCollege &&
        matchesCity &&
        matchesBranch &&
        matchesYear
      );
    });
  }, [profiles, search, college, city, branch, year]);

  if (loading) {
    return (
      <section className="mt-20">
        <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="h-6 w-48 rounded bg-white/10" />

          <div className="mt-4 h-4 w-72 rounded bg-white/10" />

          <div className="mt-8 h-32 rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-20 rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
        <p className="text-red-400">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-20">

      {/* Heading */}
      <div className="mb-8">
        <p className="text-sm font-medium text-blue-400">
          STUDENT DIRECTORY
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Find your hackathon teammates
        </h2>

        <p className="mt-3 max-w-2xl text-gray-400">
          Discover students based on skills, college, location,
          branch and role.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, skill, college or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#101010] px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500/50"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        {/* College */}
        <select
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="All">All Colleges</option>

          {colleges.map((item) => (
            <option key={item} value={item!}>
              {item}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="All">All Cities</option>

          {cities.map((item) => (
            <option key={item} value={item!}>
              {item}
            </option>
          ))}
        </select>

        {/* Branch */}
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="All">All Branches</option>

          {branches.map((item) => (
            <option key={item} value={item!}>
              {item}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none"
        >
          <option value="All">All Years</option>

          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

      </div>

      {/* Result count */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {filteredProfiles.length} student
          {filteredProfiles.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Students */}
      {filteredProfiles.length === 0 ? (

        <div className="rounded-2xl border border-white/10 bg-[#101010] p-12 text-center">

          <p className="text-lg font-medium text-white">
            No students found
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2">

          {filteredProfiles.map((profile) => (

            <div
              key={profile.id}
              className="group rounded-2xl border border-white/10 bg-[#101010] p-6 transition hover:-translate-y-1 hover:border-white/20"
            >

              {/* Top */}
              <div className="flex items-start justify-between gap-4">

                <div>

                  {/* Clickable Student Name */}
                  <Link
                    href={`/teams/student/${profile.id}`}
                    className="text-xl font-semibold text-white transition hover:text-blue-400"
                  >
                    {profile.name}
                  </Link>

                  <p className="mt-1 text-sm text-gray-400">
                    {profile.college || "College not specified"}
                  </p>

                </div>

                <span className="whitespace-nowrap rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  Looking for team
                </span>

              </div>

              {/* Education */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">

                {profile.city && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-gray-400">
                    📍 {profile.city}
                  </span>
                )}

                {profile.branch && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-gray-400">
                    {profile.branch}
                  </span>
                )}

                {profile.year && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-gray-400">
                    Year {profile.year}
                  </span>
                )}

              </div>

              {/* Role */}
              {profile.preferred_role && (
                <div className="mt-5">

                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Preferred Role
                  </p>

                  <p className="mt-1 font-medium text-blue-400">
                    {profile.preferred_role}
                  </p>

                </div>
              )}

              {/* Skills */}
              {profile.skills && (
                <div className="mt-5">

                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {profile.skills
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                      .map((skill) => (

                        <span
                          key={skill}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300"
                        >
                          {skill}
                        </span>

                      ))}

                  </div>

                </div>
              )}

              {/* Availability */}
              {profile.availability && (
                <p className="mt-5 text-sm text-gray-500">

                  Available:{" "}

                  <span className="text-gray-300">
                    {profile.availability}
                  </span>

                </p>
              )}

              {/* Links */}
              <div className="mt-6 flex gap-3 border-t border-white/10 pt-5">

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white hover:text-black"
                  >
                    GitHub
                  </a>
                )}

                {profile.portfolio_url &&
                  profile.portfolio_url !== "enter here" && (

                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white hover:text-black"
                    >
                      Portfolio
                    </a>

                  )}

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}