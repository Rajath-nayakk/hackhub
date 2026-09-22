"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import TiltCard from "@/components/ui/TiltCard";
import SkillGraph from "@/components/ui/SkillGraph";
import RecommendedTeammates from "./RecommendedTeammates";
import StudentDirectory from "./StudentDirectory";
import {
  Users,
  Search,
  ArrowRight,
  Trophy,
} from "@/components/ui/Icons";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create team modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamMax, setNewTeamMax] = useState(4);
  const [createLoading, setCreateLoading] = useState(false);
  const [createStatus, setCreateStatus] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/teams`);

      if (!response.ok) {
        throw new Error("Failed to fetch teams");
      }

      const result = await response.json();
      setTeams(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load teams. Please ensure backend service is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitialTeams() {
      try {
        const response = await fetch(`${API_URL}/api/teams`);
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const result = await response.json();
        if (!ignore) {
          setTeams(result.data || []);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Unable to load teams. Please ensure backend service is active.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialTeams();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDesc,
          max_members: Number(newTeamMax),
          hackathon_id: 1, // Default to first available hackathon
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to create team");
      }

      setCreateStatus("Squad established successfully!");
      setNewTeamName("");
      setNewTeamDesc("");
      fetchTeams();
      setTimeout(() => {
        setShowCreateModal(false);
        setCreateStatus(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating team";
      setCreateStatus(`Error: ${msg}`);
    } finally {
      setCreateLoading(false);
    }
  };

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
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-mono text-purple-300 mb-6">
                <Users className="h-3.5 w-3.5" />
                <span>TEAMMATCH PROTOCOL // SYNERGY VECTOR</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-white">
                Assemble your high-velocity hackathon squad.
              </h1>

              <p className="mt-4 text-base md:text-lg leading-relaxed text-gray-400 max-w-2xl font-sans">
                Top hackathon builds succeed on cross-functional alignment. Match
                with developers, designers, and AI engineers based on real
                verified skills—zero random assignment.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-xs font-mono font-bold text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <span>INITIALIZE SQUAD</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <a
                  href="#directory"
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3.5 text-xs font-mono text-gray-300 transition"
                >
                  EXPLORE BUILDER DIRECTORY ↓
                </a>
              </div>
            </div>

            {/* Interactive Engineering Synergy Constellation */}
            <div className="w-full lg:w-[460px] shrink-0">
              <SkillGraph />
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-12 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search squads by name, focus track, or hackathon..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-[#0E1322]/80 pl-12 pr-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 backdrop-blur-md"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 text-xs font-mono text-gray-500 hover:text-white"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Active Squads */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-blue-400 block mb-1">
              OPEN RECRUITMENT
            </span>
            <h2 className="text-2xl font-bold text-white">Active Squads</h2>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-gray-400">
            {filteredTeams.length} SQUADS ACTIVE
          </span>
        </div>

        {/* Loading state */}
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

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm font-mono text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredTeams.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#0E1322]/50 p-12 text-center backdrop-blur-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-mono text-white">
              NO SQUADS FOUND
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Be the first to establish a squad for upcoming challenges.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-blue-500 transition"
            >
              CREATE A SQUAD
            </button>
          </div>
        )}

        {/* Team Cards Grid */}
        {!loading && !error && filteredTeams.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <TiltCard
                key={team.id}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-[#0E1322]/80 to-[#080B14]/90 p-6 backdrop-blur-md transition-all hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-900/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                      <Users className="h-5 w-5" />
                    </div>

                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      ● RECRUITING
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {team.name}
                  </h3>

                  {team.hackathons?.title && (
                    <p className="mt-1 text-xs font-mono text-purple-300 flex items-center gap-1.5">
                      <Trophy className="h-3 w-3" />
                      <span>{team.hackathons.title}</span>
                    </p>
                  )}

                  <p className="mt-4 line-clamp-3 text-xs text-gray-400 leading-relaxed font-sans">
                    {team.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block">
                      CAPACITY
                    </span>
                    <span className="font-bold text-white">
                      Up to {team.max_members} seats
                    </span>
                  </div>

                  <Link
                    href={`/teams/${team.id}`}
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono font-bold text-white transition flex items-center gap-1.5"
                  >
                    <span>VIEW SQUAD</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </section>

      {/* Smart Recommended Teammates */}
      <section className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <RecommendedTeammates />
        </div>
      </section>

      {/* Student Directory */}
      <section id="directory" className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-20">
          <StudentDirectory />
        </div>
      </section>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono text-sm"
            >
              [ESC]
            </button>

            <h3 className="text-xl font-bold text-white">
              Initialize New Squad
            </h3>
            <p className="mt-1 text-xs text-gray-400 font-mono">
              Declare your mission, stack requirements, and seat capacity.
            </p>

            <form onSubmit={handleCreateTeam} className="mt-6 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">SQUAD NAME</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Neural Nexus"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">
                  MISSION &amp; ROLES SOUGHT
                </label>
                <textarea
                  required
                  rows={3}
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Targeting AI Problem Statement #01. Seeking PyTorch/FastAPI engineer and frontend UI designer..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">MAX CAPACITY</label>
                <select
                  value={newTeamMax}
                  onChange={(e) => setNewTeamMax(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
                >
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members (Standard)</option>
                  <option value={5}>5 Members</option>
                </select>
              </div>

              {createStatus && (
                <div
                  className={`p-3 rounded-xl border ${
                    createStatus.startsWith("Error")
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  }`}
                >
                  {createStatus}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-white font-bold disabled:opacity-50"
                >
                  {createLoading ? "ESTABLISHING..." : "CONFIRM SQUAD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}