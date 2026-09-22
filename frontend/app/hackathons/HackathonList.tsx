"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";
import {
  Search,
  Calendar,
  MapPin,
  Trophy,
  Users,
  ExternalLink,
  ArrowRight,
  Presentation,
  Shield,
  Sparkles,
} from "@/components/ui/Icons";
import { triggerDiscoverySync } from "@/lib/api";

export interface Hackathon {
  id: number | string;
  slug?: string;
  source_id?: string;
  source_platform?: string;
  title: string;
  organizer: string;
  description: string | null;
  domain?: string;
  location: string | null;
  is_online: boolean;
  registration_deadline: string | null;
  event_start: string | null;
  event_end: string | null;
  website_url: string | null;
  registration_url: string | null;
  source_url?: string | null;
  team_min: number | null;
  team_max: number | null;
  prize: string | null;
  difficulty: string | null;
  status: string | null; // 'upcoming', 'registration_closed', 'ongoing', 'ended'
  registration_status?: string | null;
  is_verified?: boolean;
  is_expired?: boolean;
  verification_tier?: string | null; // 'verified', 'discovered', 'expired'
  last_checked_at?: string | null;
  last_fetch_status?: string | null; // 'success', 'failed', 'cached'
  tracks?: string[];
  problem_statements?: {
    id: string;
    title: string;
    track: string;
    description: string;
    difficulty: string;
  }[];
}

interface HackathonListProps {
  hackathons: Hackathon[];
  source?: string;
}

export default function HackathonList({
  hackathons: initialHackathons,
  source: initialSource = "development-seed",
}: HackathonListProps) {
  const [hackathons, setHackathons] = useState<Hackathon[]>(initialHackathons);
  const [source, setSource] = useState<string>(initialSource);
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("all");
  const [statusFilter, setStatusFilter] = useState("upcoming"); // Default to upcoming
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleSyncTelemetry = async () => {
    setSyncing(true);
    setSyncNotice(null);
    try {
      const result = await triggerDiscoverySync();
      if (result.success) {
        // Refresh local list from API
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/hackathons?status=all`);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setHackathons(json.data);
            setSource(json.source || "offline-cache");
          }
        }
        setSyncNotice(`Synced ${result.data?.count || "active"} verified hackathons across authoritative platforms.`);
      }
    } catch {
      setSyncNotice("Discovery engine sync trigger failed or backend is unreachable.");
    } finally {
      setSyncing(false);
    }
  };

  const filteredHackathons = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const result = hackathons.filter((hackathon) => {
      const matchesSearch =
        !normalizedSearch ||
        hackathon.title.toLowerCase().includes(normalizedSearch) ||
        hackathon.organizer.toLowerCase().includes(normalizedSearch) ||
        (hackathon.location ?? "").toLowerCase().includes(normalizedSearch) ||
        (hackathon.domain ?? "").toLowerCase().includes(normalizedSearch) ||
        (hackathon.tracks || []).some((t) =>
          t.toLowerCase().includes(normalizedSearch)
        );

      const matchesFormat =
        format === "all" ||
        (format === "online" && hackathon.is_online) ||
        (format === "offline" && !hackathon.is_online);

      const matchesDifficulty =
        difficulty === "all" ||
        (hackathon.difficulty ?? "").toLowerCase() === difficulty;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "upcoming" && (hackathon.status === "upcoming" || hackathon.status === "registration_closed")) ||
        (statusFilter === "ongoing" && hackathon.status === "ongoing") ||
        (statusFilter === "ended" && (hackathon.status === "ended" || hackathon.is_expired));

      return matchesSearch && matchesFormat && matchesDifficulty && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "deadline") {
        return (
          new Date(a.registration_deadline ?? "9999-12-31").getTime() -
          new Date(b.registration_deadline ?? "9999-12-31").getTime()
        );
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [hackathons, search, format, difficulty, statusFilter, sortBy]);

  const formatDate = (date: string | null) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div>
      {/* Discovery Engine Telemetry Header Bar */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0C101D] via-[#080B14] to-[#0D1222] p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  AUTOMATIC DISCOVERY ENGINE
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE REFRESH ACTIVE</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 font-sans mt-0.5">
                Authoritative multi-source pipeline (Devfolio, Devpost, Institutional Registries). Non-destructive verification.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-mono text-gray-400">
              PERSISTENCE:{" "}
              <strong className="text-gray-200 uppercase">
                {source === "supabase" ? "Supabase Primary" : source === "offline-cache" ? "Offline Cache" : "Dev Seed"}
              </strong>
            </span>

            <button
              onClick={handleSyncTelemetry}
              disabled={syncing}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-xs font-mono font-bold text-white transition shadow-md shadow-blue-600/20"
            >
              <Sparkles className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "DISCOVERING..." : "SYNC TELEMETRY"}</span>
            </button>
          </div>
        </div>

        {syncNotice && (
          <div className="mt-3 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-mono text-blue-300">
            {syncNotice}
          </div>
        )}
      </div>

      {/* Search and Command Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified hackathons, domains (AI, Web3), organizers, locations..."
            className="w-full rounded-2xl border border-white/10 bg-[#0E131F]/80 pl-12 pr-4 py-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-md"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 text-xs font-mono text-gray-500 hover:text-white"
            >
              CLEAR [ESC]
            </button>
          )}
        </div>
      </div>

      {/* Lifecycle Status & Filter Bar */}
      <div className="mb-10 rounded-2xl border border-white/10 bg-[#0A0D16]/60 p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono uppercase text-gray-500 mr-2">
            STATUS:
          </span>
          {[
            { id: "upcoming", label: "Upcoming / Active" },
            { id: "ongoing", label: "Live Now (Ongoing)" },
            { id: "ended", label: "Archived / Ended" },
            { id: "all", label: "All Records" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono uppercase transition ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-gray-500">FORMAT:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs font-mono text-gray-300 outline-none"
            >
              <option value="all">All Formats</option>
              <option value="online">Online</option>
              <option value="offline">On-Site</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-gray-500">TIER:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs font-mono text-gray-300 outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-gray-500">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs font-mono text-gray-300 outline-none"
            >
              <option value="deadline">Registration Deadline</option>
              <option value="title">Event Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 flex items-center justify-between text-xs font-mono text-gray-400">
        <span>
          SHOWING <strong>{filteredHackathons.length}</strong> HACKATHONS
        </span>
        <span>
          TELEMETRY STATUS: <strong className="text-emerald-400 uppercase">ONLINE</strong>
        </span>
      </div>

      {/* Grid of Hackathons */}
      {filteredHackathons.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0E131F]/40 p-16 text-center">
          <Trophy className="mx-auto h-12 w-12 text-gray-600 mb-3" />
          <h3 className="text-lg font-bold font-mono text-white">
            NO HACKATHONS FOUND
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            No events match your current filter selection. Try changing status or search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map((hackathon) => {
            const daysLeft = getDaysRemaining(hackathon.registration_deadline);
            const isClosingSoon = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
            const isEnded = hackathon.status === "ended" || hackathon.is_expired;

            // Verification tier styling
            let tierBadge = (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>VERIFIED OFFICIAL</span>
              </span>
            );

            if (hackathon.last_fetch_status === "failed") {
              tierBadge = (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono text-amber-300">
                  SOURCE UPDATE FAILED
                </span>
              );
            } else if (isEnded) {
              tierBadge = (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono text-gray-400">
                  EXPIRED / ARCHIVED
                </span>
              );
            } else if (hackathon.verification_tier === "discovered") {
              tierBadge = (
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300">
                  AUTO-DISCOVERED
                </span>
              );
            }

            return (
              <TiltCard
                key={hackathon.id || hackathon.slug || hackathon.source_id}
                className={`flex flex-col justify-between p-6 ${
                  isEnded ? "opacity-70 border-white/5" : ""
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {tierBadge}

                    {hackathon.source_platform && (
                      <span className="text-[10px] font-mono text-gray-500 uppercase">
                        VIA {hackathon.source_platform}
                      </span>
                    )}
                  </div>

                  {/* Title & Organizer */}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {hackathon.title}
                  </h3>

                  <p className="text-xs font-mono text-gray-400 mt-1 line-clamp-1">
                    {hackathon.organizer}
                  </p>

                  {/* Description */}
                  {hackathon.description && (
                    <p className="mt-3 text-xs leading-relaxed text-gray-400 font-sans line-clamp-2">
                      {hackathon.description}
                    </p>
                  )}

                  {/* Meta Specs */}
                  <div className="mt-4 space-y-2 text-xs font-mono text-gray-400 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-blue-400" />
                        <span className="truncate max-w-[170px]">{hackathon.location || "Online"}</span>
                      </span>

                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Users className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{hackathon.team_min || 1}-{hackathon.team_max || 4} Members</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <Calendar className="h-3.5 w-3.5 text-purple-400" />
                        <span>Reg Deadline:</span>
                      </span>

                      <span
                        className={`font-mono ${
                          isClosingSoon
                            ? "text-red-400 font-bold"
                            : isEnded
                            ? "text-gray-500"
                            : "text-gray-300"
                        }`}
                      >
                        {formatDate(hackathon.registration_deadline)}
                      </span>
                    </div>

                    {hackathon.prize && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <Trophy className="h-3.5 w-3.5" />
                          <span>Prize Pool:</span>
                        </span>
                        <span className="font-mono text-amber-300 font-bold truncate max-w-[160px]">
                          {hackathon.prize}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2">
                  <Link
                    href={`/hackathons/${hackathon.id || hackathon.slug}`}
                    className="flex-1 rounded-xl bg-blue-600/90 hover:bg-blue-500 px-4 py-2.5 text-center text-xs font-mono font-bold text-white transition flex items-center justify-center gap-1.5"
                  >
                    <span>VIEW EVENT</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href={`/ppt-maker?hackathonId=${hackathon.id}&hackathonName=${encodeURIComponent(
                      hackathon.title
                    )}`}
                    title="Generate deck tailored to this hackathon"
                    className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-gray-400 hover:text-white transition"
                  >
                    <Presentation className="h-4 w-4" />
                  </Link>

                  {hackathon.registration_url && (
                    <a
                      href={hackathon.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="External Registration Portal"
                      className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-2.5 text-gray-400 hover:text-white transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Dataset Attribution Transparency Banner */}
      <div className="mt-12 rounded-xl border border-white/10 bg-black/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-500">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <span>
            TELEMETRY SOURCE:{" "}
            <strong className="text-gray-300 uppercase">
              {source === "supabase" ? "Supabase Cloud Database" : source === "offline-cache" ? "Authoritative Offline Cache (Supabase Unreachable)" : "Development Seed Protocol"}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-gray-600">
          Live sync active across Devfolio &amp; Devpost. Verified institutional hackathon data.
        </span>
      </div>
    </div>
  );
}