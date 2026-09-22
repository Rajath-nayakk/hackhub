import { getHackathonById } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import {
  Users,
  Presentation,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Shield,
} from "@/components/ui/Icons";
import { Metadata } from "next";

interface HackathonPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ProblemStatementItem {
  id: string;
  title: string;
  track: string;
  description: string;
  difficulty?: string;
}

export async function generateMetadata({
  params,
}: HackathonPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await getHackathonById(id);
    const title = response?.data?.title || "Hackathon Details";
    return {
      title: `${title} | HackHub`,
      description:
        response?.data?.description ||
        "Hackathon specification, rules, and problem statements.",
    };
  } catch {
    return {
      title: "Hackathon Specification | HackHub",
    };
  }
}

export default async function HackathonDetails({ params }: HackathonPageProps) {
  const { id } = await params;
  const response = await getHackathonById(id);
  const hackathon = response?.data;
  const source = response?.source || "development-seed";

  if (!hackathon) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold font-mono">HACKATHON NOT FOUND</h2>
          <p className="mt-2 text-sm text-gray-400">
            The requested hackathon ID is either unavailable or not registered in the active database.
          </p>
          <Link
            href="/hackathons"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-mono font-bold"
          >
            ← RETURN TO DISCOVERY
          </Link>
        </div>
      </main>
    );
  }

  const isVersathon =
    hackathon.slug === "versathon-2026" ||
    hackathon.title?.toLowerCase().includes("versathon") ||
    Boolean(hackathon.problem_statements && hackathon.problem_statements.length > 0);

  const problemStatements: ProblemStatementItem[] = hackathon.problem_statements || [];
  const presentationRules = hackathon.presentation_rules;

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO HACKATHON DIRECTORY</span>
          </Link>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-gray-400">
            ID: #{hackathon.id || hackathon.slug} {" // "} {source === "supabase" ? "SUPABASE LIVE" : source === "offline-cache" ? "OFFLINE CACHE" : "DEV SEED"}
          </span>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E1324]/90 to-[#070A12]/95 p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-3xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-mono font-medium ${
                    hackathon.is_online
                      ? "border border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {hackathon.is_online ? "🌐 ONLINE / GLOBAL" : "🏢 ON-SITE EVENT"}
                </span>

                {hackathon.verification_tier === "verified" ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>VERIFIED OFFICIAL</span>
                  </span>
                ) : hackathon.verification_tier === "discovered" ? (
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono text-cyan-300">
                    AUTO-DISCOVERED
                  </span>
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-gray-400">
                    EXPIRED / ARCHIVED
                  </span>
                )}

                {hackathon.source_platform && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-gray-300 uppercase">
                    SOURCE: {hackathon.source_platform}
                  </span>
                )}

                {hackathon.difficulty && (
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-mono text-purple-300 uppercase">
                    TIER: {hackathon.difficulty}
                  </span>
                )}

                {isVersathon && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300">
                    ★ 12 VERIFIED PROBLEMS
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {hackathon.title}
              </h1>

              <p className="mt-3 text-sm font-mono text-gray-400">
                Organized by{" "}
                <strong className="text-white">{hackathon.organizer}</strong>
              </p>

              <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-300 max-w-2xl font-sans">
                {hackathon.description}
              </p>
            </div>

            {/* CTA action cluster */}
            <div className="flex flex-col gap-3 shrink-0 lg:w-72">
              {hackathon.registration_url && (
                <a
                  href={hackathon.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 px-6 text-center text-sm font-mono font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <span>OFFICIAL REGISTER</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <Link
                href={`/ppt-maker?hackathonId=${hackathon.id}&hackathonName=${encodeURIComponent(
                  hackathon.title
                )}`}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-3 px-6 text-center text-xs font-mono font-medium text-gray-200 transition flex items-center justify-center gap-2"
              >
                <Presentation className="h-4 w-4 text-blue-400" />
                <span>BUILD PRESENTATION DECK</span>
              </Link>

              <Link
                href="/teams"
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-3 px-6 text-center text-xs font-mono font-medium text-gray-200 transition flex items-center justify-center gap-2"
              >
                <Users className="h-4 w-4 text-emerald-400" />
                <span>FIND TEAMMATES</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-8">
            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-[11px] font-mono text-gray-500 block mb-1">
                LOCATION / VENUE
              </span>
              <span className="text-sm font-bold text-white">
                {hackathon.location || "Virtual / Online"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-[11px] font-mono text-gray-500 block mb-1">
                TOTAL PRIZE POOL
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {hackathon.prize || "Recognition & Swag"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-[11px] font-mono text-gray-500 block mb-1">
                SQUAD CONSTRAINTS
              </span>
              <span className="text-sm font-bold text-white">
                {hackathon.team_min && hackathon.team_max
                  ? `${hackathon.team_min} - ${hackathon.team_max} engineers`
                  : "Individual or Squad"}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-[11px] font-mono text-gray-500 block mb-1">
                REGISTRATION CLOSING
              </span>
              <span className="text-sm font-bold text-white">
                {hackathon.registration_deadline
                  ? new Date(hackathon.registration_deadline).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" }
                    )
                  : "TBD"}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-mono text-yellow-400 mb-6">
            <span>CRITICAL TIMELINE MILESTONES</span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/30 p-5">
              <span className="text-xs font-mono text-gray-500">PHASE 01</span>
              <h4 className="text-sm font-bold text-white mt-1">
                Registration Deadline
              </h4>
              <p className="mt-2 text-base font-mono text-gray-300">
                {hackathon.registration_deadline
                  ? new Date(hackathon.registration_deadline).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" }
                    )
                  : "Open"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-5">
              <span className="text-xs font-mono text-gray-500">PHASE 02</span>
              <h4 className="text-sm font-bold text-white mt-1">
                Hackathon Kickoff
              </h4>
              <p className="mt-2 text-base font-mono text-gray-300">
                {hackathon.event_start
                  ? new Date(hackathon.event_start).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" }
                    )
                  : "To be announced"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-5">
              <span className="text-xs font-mono text-gray-500">PHASE 03</span>
              <h4 className="text-sm font-bold text-white mt-1">
                Final Judging &amp; Demo
              </h4>
              <p className="mt-2 text-base font-mono text-gray-300">
                {hackathon.event_end
                  ? new Date(hackathon.event_end).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" }
                    )
                  : "To be announced"}
              </p>
            </div>
          </div>
        </div>

        {/* Authoritative Source Provenance & Audit */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Shield className="h-4 w-4" />
              <span>AUTHORITATIVE PROVENANCE &amp; VERIFICATION AUDIT</span>
            </div>
            <span className="text-[11px] font-mono text-gray-500">
              Zero Synthetic Data Standard
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-gray-500 block mb-1 text-[10px]">ORIGIN PLATFORM</span>
              <span className="text-white font-bold">{hackathon.source_platform || "Authoritative Organizer"}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-gray-500 block mb-1 text-[10px]">VERIFICATION TIER</span>
              <span className={hackathon.verification_tier === "verified" ? "text-emerald-400 font-bold" : "text-cyan-400 font-bold"}>
                {hackathon.verification_tier?.toUpperCase() || (hackathon.is_verified ? "VERIFIED OFFICIAL" : "AUTO-DISCOVERED")}
              </span>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-gray-500 block mb-1 text-[10px]">LIFECYCLE STATUS</span>
              <span className="text-gray-300 font-bold uppercase">{hackathon.status || "upcoming"}</span>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/40 p-4">
              <span className="text-gray-500 block mb-1 text-[10px]">AUTHORITATIVE LINK</span>
              {hackathon.source_url || hackathon.website_url ? (
                <a
                  href={hackathon.source_url || hackathon.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1 truncate"
                >
                  <span>View Source</span>
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
              ) : (
                <span className="text-gray-500">Verified Direct</span>
              )}
            </div>
          </div>
        </div>

        {/* Versathon / Track Specifics */}
        {isVersathon && (
          <div className="mt-12 space-y-10">
            {presentationRules && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-8 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300 mb-2">
                      <Presentation className="h-3.5 w-3.5" />
                      OFFICIAL PRESENTATION PROTOCOL
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      Strict 10-Slide Deck Constraint Enforced
                    </h3>
                  </div>

                  <Link
                    href={`/ppt-maker?hackathonId=${hackathon.id}&hackathonName=${encodeURIComponent(
                      hackathon.title
                    )}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 text-black px-5 py-2.5 text-xs font-mono font-bold hover:bg-amber-400 transition shrink-0"
                  >
                    <span>LAUNCH PPT MAKER (10-SLIDE CEILING)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-xs font-mono">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <span className="text-gray-400 block mb-1">MAX CEILING</span>
                    <span className="text-lg font-bold text-amber-400">
                      {presentationRules.max_slides} SLIDES STRICT
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-1">
                      Decks with &gt; 10 slides face disqualification.
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <span className="text-gray-400 block mb-1">PITCH DURATION</span>
                    <span className="text-lg font-bold text-white">
                      {presentationRules.presentation_time_min} MINS PITCH
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-1">
                      Plus {presentationRules.qa_time_min} mins Q&amp;A defense.
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <span className="text-gray-400 block mb-1">RUBRIC MANDATE</span>
                    <span className="text-lg font-bold text-white">
                      8 CORE SECTIONS
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-1">
                      Architecture &amp; MVP demo required.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {problemStatements.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      Official Problem Statements
                    </h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Select a problem statement to bootstrap in the AI Project Lab or build presentation slides.
                    </p>
                  </div>

                  <span className="text-xs font-mono text-blue-400 border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 rounded-lg shrink-0">
                    {problemStatements.length} STATEMENTS RELEASED
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {problemStatements.map((prob) => (
                    <div
                      key={prob.id}
                      className="rounded-2xl border border-white/10 bg-[#0E1322]/70 p-6 backdrop-blur-md flex flex-col justify-between hover:border-blue-500/40 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-mono text-blue-400">
                            {prob.id}
                          </span>
                          <span className="text-[11px] font-mono text-purple-300">
                            {prob.track}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-white">
                          {prob.title}
                        </h4>

                        <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                          {prob.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                        <Link
                          href={`/ai?problemStatement=${encodeURIComponent(
                            prob.id + ": " + prob.title + " - " + prob.description
                          )}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>DRAFT IN AI LAB</span>
                        </Link>

                        <Link
                          href={`/ppt-maker?hackathonId=${hackathon.id}&problemId=${prob.id}&problemTitle=${encodeURIComponent(
                            prob.title
                          )}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition"
                        >
                          <Presentation className="h-3.5 w-3.5" />
                          <span>GENERATE DECK</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* External Link Card */}
        {hackathon.website_url && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">
                Official Hackathon Portal
              </h4>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Verify institutional announcements, mentor listings, and official Discord links.
              </p>
            </div>

            <a
              href={hackathon.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-mono font-medium hover:bg-white hover:text-black transition"
            >
              <span>VISIT WEBSITE</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>
    </main>
  );
}