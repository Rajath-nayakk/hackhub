"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Presentation,
  Sparkles,
  ArrowRight,
} from "@/components/ui/Icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface HackathonItem {
  id: number;
  title: string;
  organizer: string;
  registration_deadline: string | null;
  is_online: boolean;
  prize: string | null;
}

interface TeamItem {
  id: number;
  name: string;
  description: string;
  status: string;
  max_members: number;
}

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [hackathons, setHackathons] = useState<HackathonItem[]>([]);
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Submission readiness checklist
  const [checklist, setChecklist] = useState({
    repo: true,
    team: true,
    idea: true,
    deck: false,
    demo: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Try getting user session
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUserEmail(data.user.email ?? null);
          setUserName(
            data.user.user_metadata?.full_name ||
              data.user.email?.split("@")[0] ||
              "Builder"
          );
        }

        // Fetch real hackathons
        const hackathonRes = await fetch(`${API_URL}/api/hackathons`);
        const hackathonJson = await hackathonRes.json();
        setHackathons(hackathonJson.data?.slice(0, 3) || []);

        // Fetch real teams
        const teamRes = await fetch(`${API_URL}/api/teams`);
        const teamJson = await teamRes.json();
        setTeams(teamJson.data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-400 mb-3">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>ENGINEERING COMMAND CENTER</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {userName || "Engineer"}
            </h1>
            <p className="mt-1 text-xs font-mono text-gray-400">
              Session: {userEmail || "Local Developer Session"} {" // "} Workspace Synchronized
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <Link
              href="/ai"
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 font-bold text-white transition shadow-lg shadow-blue-600/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI PROJECT LAB</span>
            </Link>

            <Link
              href="/ppt-maker"
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 font-bold text-black transition"
            >
              <Presentation className="h-4 w-4" />
              <span>PPT MAKER (10-SLIDES)</span>
            </Link>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/hackathons"
            className="group rounded-2xl border border-white/10 bg-[#0E1322]/80 p-5 backdrop-blur-md hover:border-blue-500/40 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-white text-base">Browse Hackathons</h3>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Discover verified tracks, deadlines, and prize pools.
            </p>
          </Link>

          <Link
            href="/teams"
            className="group rounded-2xl border border-white/10 bg-[#0E1322]/80 p-5 backdrop-blur-md hover:border-purple-500/40 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Users className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-white text-base">Squad Assembly</h3>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Match with complementary builders across AI, systems, and UI.
            </p>
          </Link>

          <Link
            href="/ai"
            className="group rounded-2xl border border-white/10 bg-[#0E1322]/80 p-5 backdrop-blur-md hover:border-sky-500/40 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-sky-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-white text-base">AI Project Lab</h3>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Formulate architecture proposals from real problem statements.
            </p>
          </Link>

          <Link
            href="/ppt-maker"
            className="group rounded-2xl border border-white/10 bg-[#0E1322]/80 p-5 backdrop-blur-md hover:border-amber-500/40 transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Presentation className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="font-bold text-white text-base">PPT Deck Composer</h3>
            <p className="text-xs text-gray-400 mt-1 font-sans">
              Build compliant 10-slide pitch decks tailored to jury rubrics.
            </p>
          </Link>
        </div>

        {/* Core Layout: 2 Columns */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Main Column: Active Events & Squads */}
          <div className="space-y-8 lg:col-span-2">
            {/* Upcoming Hackathon Deadlines */}
            <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono text-blue-400 block mb-1">
                    VERIFIED TIMELINES
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Target Hackathons
                  </h2>
                </div>
                <Link
                  href="/hackathons"
                  className="text-xs font-mono text-gray-400 hover:text-white"
                >
                  VIEW ALL →
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 rounded-xl bg-white/5 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {hackathons.map((h) => (
                    <div
                      key={h.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/40 p-4 hover:border-white/15 transition"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase text-blue-400 block">
                          {h.is_online ? "ONLINE" : "ON-SITE"} {" // "} {h.organizer}
                        </span>
                        <h4 className="font-bold text-white text-base mt-0.5">
                          {h.title}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono mt-1 block">
                          Deadline:{" "}
                          {h.registration_deadline
                            ? new Date(
                                h.registration_deadline
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "TBD"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/hackathons/${h.id}`}
                          className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-white transition"
                        >
                          DETAILS
                        </Link>
                        <Link
                          href={`/ppt-maker?hackathonId=${h.id}&hackathonName=${encodeURIComponent(
                            h.title
                          )}`}
                          className="rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-mono transition"
                        >
                          MAKE DECK
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Squad Recruitment Feed */}
            <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono text-purple-400 block mb-1">
                    ACTIVE SQUADS
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Squad Recruitment
                  </h2>
                </div>
                <Link
                  href="/teams"
                  className="text-xs font-mono text-gray-400 hover:text-white"
                >
                  DISCOVER TEAMS →
                </Link>
              </div>

              <div className="space-y-3">
                {teams.map((t) => (
                  <div
                    key={t.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/40 p-4 hover:border-white/15 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <h4 className="font-bold text-white text-base">
                          {t.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1 font-sans">
                        {t.description}
                      </p>
                    </div>

                    <Link
                      href={`/teams/${t.id}`}
                      className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-mono text-white transition shrink-0"
                    >
                      VIEW SQUAD
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Readiness Checklist & Telemetry */}
          <aside className="space-y-6">
            {/* Hackathon Readiness Checklist */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  SUBMISSION READINESS
                </span>
                <span className="text-xs font-mono text-gray-400">
                  {Object.values(checklist).filter(Boolean).length}/5
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <label className="flex items-center gap-2.5 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={checklist.repo}
                    onChange={(e) =>
                      setChecklist({ ...checklist, repo: e.target.checked })
                    }
                    className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0"
                  />
                  <span>Code repository initialized</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={checklist.team}
                    onChange={(e) =>
                      setChecklist({ ...checklist, team: e.target.checked })
                    }
                    className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0"
                  />
                  <span>Squad assembled &amp; roles assigned</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={checklist.idea}
                    onChange={(e) =>
                      setChecklist({ ...checklist, idea: e.target.checked })
                    }
                    className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0"
                  />
                  <span>Architecture &amp; MVP scope mapped</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={checklist.deck}
                    onChange={(e) =>
                      setChecklist({ ...checklist, deck: e.target.checked })
                    }
                    className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0"
                  />
                  <span>10-Slide presentation deck ready</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={checklist.demo}
                    onChange={(e) =>
                      setChecklist({ ...checklist, demo: e.target.checked })
                    }
                    className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0"
                  />
                  <span>2-minute demo video recorded</span>
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-gray-500">
                Adherence to standard HackHub &amp; Versathon submission rules.
              </div>
            </div>

            {/* Quick Profile Summary */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <span className="text-xs font-mono text-blue-400 block mb-1">
                ENGINEER IDENTITY
              </span>
              <h4 className="font-bold text-white text-base">
                {userName || "Builder"}
              </h4>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {userEmail || "Developer Session Active"}
              </p>

              <Link
                href="/profile"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2.5 text-xs font-mono text-gray-300 hover:text-white transition"
              >
                <span>EDIT PROFILE &amp; PORTFOLIO</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
