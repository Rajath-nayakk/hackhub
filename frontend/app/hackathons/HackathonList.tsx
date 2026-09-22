"use client";

import { useMemo, useState } from "react";

interface Hackathon {
  id: number;
  title: string;
  organizer: string;
  description: string | null;
  location: string | null;
  is_online: boolean;
  registration_deadline: string | null;
  event_start: string | null;
  event_end: string | null;
  website_url: string | null;
  registration_url: string | null;
  team_min: number | null;
  team_max: number | null;
  prize: string | null;
  difficulty: string | null;
  status: string | null;
}

interface HackathonListProps {
  hackathons: Hackathon[];
}

export default function HackathonList({
  hackathons,
}: HackathonListProps) {
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  const filteredHackathons = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const result = hackathons.filter((hackathon) => {
      const matchesSearch =
        !normalizedSearch ||
        hackathon.title.toLowerCase().includes(normalizedSearch) ||
        hackathon.organizer.toLowerCase().includes(normalizedSearch) ||
        (hackathon.location ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesFormat =
        format === "all" ||
        (format === "online" && hackathon.is_online) ||
        (format === "offline" && !hackathon.is_online);

      const matchesDifficulty =
        difficulty === "all" ||
        (hackathon.difficulty ?? "").toLowerCase() === difficulty;

      return (
        matchesSearch &&
        matchesFormat &&
        matchesDifficulty
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "deadline") {
        return (
          new Date(
            a.registration_deadline ?? "9999-12-31"
          ).getTime() -
          new Date(
            b.registration_deadline ?? "9999-12-31"
          ).getTime()
        );
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });
  }, [hackathons, search, format, difficulty, sortBy]);

  const formatDate = (date: string | null) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hackathons, organizers, locations..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-col gap-6">
        {/* Format */}
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-400">
            Format
          </p>

          <div className="flex flex-wrap gap-2">
            {["all", "online", "offline"].map((option) => (
              <button
                key={option}
                onClick={() => setFormat(option)}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
                  format === option
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-400">
            Difficulty
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "beginner",
              "intermediate",
              "advanced",
            ].map((option) => (
              <button
                key={option}
                onClick={() => setDifficulty(option)}
                className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
                  difficulty === option
                    ? "bg-purple-600 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredHackathons.length}
            </span>{" "}
            hackathon
            {filteredHackathons.length !== 1 ? "s" : ""}
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none"
          >
            <option value="deadline" className="bg-black">
              Deadline ↑
            </option>
            <option value="title" className="bg-black">
              Name A–Z
            </option>
          </select>
        </div>
      </div>

      {/* Hackathon Cards */}
      {filteredHackathons.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
          <div className="mb-4 text-5xl">🔍</div>

          <h3 className="text-xl font-semibold text-white">
            No hackathons found
          </h3>

          <p className="mt-2 text-gray-400">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.05]"
            >
              {/* Top badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  {hackathon.is_online
                    ? "Online"
                    : "Offline"}
                </span>

                {hackathon.difficulty && (
                  <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium capitalize text-purple-400">
                    {hackathon.difficulty}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white transition group-hover:text-blue-400">
                {hackathon.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Organized by {hackathon.organizer}
              </p>

              {/* Description */}
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                {hackathon.description ||
                  "No description available."}
              </p>

              {/* Info */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    📍 Location
                  </span>

                  <span className="text-right text-gray-300">
                    {hackathon.location || "Online"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    ⏰ Deadline
                  </span>

                  <span className="text-right text-gray-300">
                    {formatDate(
                      hackathon.registration_deadline
                    )}
                  </span>
                </div>

                {hackathon.prize && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      🏆 Prize
                    </span>

                    <span className="text-right font-semibold text-green-400">
                      {hackathon.prize}
                    </span>
                  </div>
                )}

                {hackathon.team_min &&
                  hackathon.team_max && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        👥 Team
                      </span>

                      <span className="text-right text-gray-300">
                        {hackathon.team_min}–
                        {hackathon.team_max} members
                      </span>
                    </div>
                  )}
              </div>

              {/* Button */}
              <a
                href={`/hackathons/${hackathon.id}`}
                className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                View Hackathon →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}