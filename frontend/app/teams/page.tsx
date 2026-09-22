"use client";

import RecommendedTeammates from "./RecommendedTeammates";
import StudentDirectory from "./StudentDirectory";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Team {
  id: number;
  name: string;
  description: string;
  max_members: number;
  status: string;
  hackathon_id: number;
  hackathons?: {
    id: number;
    title: string;
  };
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/api/teams`);

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const result = await response.json();

        setTeams(result.data || []);
      } catch (error) {
        console.error(error);
        setError("Unable to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    const query = search.toLowerCase().trim();

    return teams.filter((team) => {
      const text = `
        ${team.name}
        ${team.description}
        ${team.hackathons?.title || ""}
      `.toLowerCase();

      return text.includes(query);
    });
  }, [teams, search]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-20">
          <div className="max-w-3xl">
            <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 text-sm font-medium text-purple-300">
              🤝 Team Finder
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
              Find your
              <span className="text-gray-400">
                {" "}
                hackathon team.
              </span>
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-400">
              Discover teams looking for developers, designers,
              AI enthusiasts and other talented students.
            </p>
          </div>

          {/* Team Search */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 focus-within:border-white/30">
              <span className="mr-3 text-xl">🔎</span>

              <input
                type="text"
                placeholder="Search teams, hackathons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              TEAM DISCOVERY
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Open Teams
            </h2>
          </div>

          <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-400">
            {filteredTeams.length} teams
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center">
            <p className="text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredTeams.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <div className="text-5xl">🤝</div>

              <h3 className="mt-5 text-xl font-bold">
                No teams found
              </h3>

              <p className="mt-2 text-gray-500">
                Try a different search.
              </p>
            </div>
          )}

        {/* Team Cards */}
        {!loading &&
          !error &&
          filteredTeams.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-2xl">
                      👥
                    </div>

                    <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-400">
                      ● Open
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="mt-6 text-xl font-bold">
                    {team.name}
                  </h3>

                  {/* Hackathon */}
                  {team.hackathons?.title && (
                    <p className="mt-2 text-sm text-purple-300">
                      🏆 {team.hackathons.title}
                    </p>
                  )}

                  {/* Description */}
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                    {team.description}
                  </p>

                  {/* Team Size */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <p className="text-xs text-gray-600">
                        TEAM SIZE
                      </p>

                      <p className="mt-1 font-semibold">
                        Up to {team.max_members} members
                      </p>
                    </div>

                    <Link
                      href={`/teams/${team.id}`}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
                    >
                      View Team →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>

      {/* Smart Recommended Teammates */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <RecommendedTeammates />
        </div>
      </section>

      {/* Student Directory */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 pb-20">
          <StudentDirectory />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-10 text-center">
          <div className="text-4xl">🚀</div>

          <h2 className="mt-4 text-3xl font-bold">
            Can't find the right team?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-gray-400">
            Create your own team and find students with the
            skills you need.
          </p>

          <button
            type="button"
            className="mt-7 rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Create a Team
          </button>
        </div>
      </section>
    </main>
  );
}