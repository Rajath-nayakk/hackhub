import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getHackathons, getProjects } from "@/lib/api";
import ParticleField from "@/components/ui/ParticleField";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import TiltCard from "@/components/ui/TiltCard";
import GlowButton from "@/components/ui/GlowButton";
import GlassCard from "@/components/ui/GlassCard";
import SkillGraph from "@/components/ui/SkillGraph";
import Reveal from "@/components/ui/Reveal";
import {
  ArrowRight,
  Sparkles,
  Users,
  Presentation,
} from "@/components/ui/Icons";

interface Hackathon {
  id: number;
  title: string;
  organizer: string;
  description: string | null;
  location: string | null;
  is_online: boolean;
  registration_deadline: string | null;
  prize: string | null;
  difficulty: string | null;
  domain?: string;
}

interface Project {
  id: number;
  project_name: string;
  competition: string;
  year: number;
  problem_statement: string;
  solution: string;
  tech_stack: string;
  domain: string;
}

export default async function Home() {
  let hackathons: Hackathon[] = [];
  let projects: Project[] = [];

  try {
    const [hRes, pRes] = await Promise.all([
      getHackathons().catch(() => ({ data: [] })),
      getProjects().catch(() => ({ data: [] })),
    ]);
    hackathons = hRes.data || [];
    projects = pRes.data || [];
  } catch {
    hackathons = [];
    projects = [];
  }

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-600 selection:text-white overflow-hidden">
      <Navbar />

      {/* Global Background Layer */}
      <AnimatedGrid withGlow={true} />
      <ParticleField particleCount={38} />

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-36 pb-24 text-center sm:pt-44 sm:pb-32">
        <Reveal direction="down" delay={100}>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
            THE ENGINEERING STUDENT ECOSYSTEM
          </div>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl leading-[1.08]">
            FIND YOUR <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              NEXT BUILD.
            </span>
          </h1>
        </Reveal>

        <Reveal direction="up" delay={300}>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-xl leading-relaxed">
            Discover hackathons. Assemble complementary teams. Learn from verified
            winners. Turn raw ideas into demonstrable software with context-aware AI.
          </p>
        </Reveal>

        <Reveal direction="up" delay={400}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GlowButton
              href="/hackathons"
              size="lg"
              variant="primary"
              dataCursor="EXPLORE →"
            >
              <span>Explore Hackathons</span>
              <ArrowRight size={18} />
            </GlowButton>

            <GlowButton
              href="/ai"
              size="lg"
              variant="outline"
              dataCursor="BUILD →"
            >
              <Sparkles size={18} className="text-blue-400" />
              <span>Build With AI Copilot</span>
            </GlowButton>
          </div>
        </Reveal>

        {/* Live Ecosystem Metrics */}
        <Reveal direction="up" delay={500}>
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              <div className="text-center pt-2 sm:pt-0">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {hackathons.length > 0 ? hackathons.length : "5+"}
                </p>
                <p className="mt-1 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Hackathons
                </p>
              </div>
              <div className="text-center pt-4 sm:pt-0 sm:pl-4">
                <p className="text-2xl sm:text-3xl font-black text-blue-400">
                  {projects.length > 0 ? projects.length : "10+"}
                </p>
                <p className="mt-1 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Winning Projects
                </p>
              </div>
              <div className="text-center pt-4 sm:pt-0 sm:pl-4">
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">
                  100%
                </p>
                <p className="mt-1 text-xs font-mono uppercase tracking-widest text-gray-500">
                  Explainable Match
                </p>
              </div>
              <div className="text-center pt-4 sm:pt-0 sm:pl-4">
                <p className="text-2xl sm:text-3xl font-black text-purple-400">
                  Rule-Aware
                </p>
                <p className="mt-1 text-xs font-mono uppercase tracking-widest text-gray-500">
                  AI Pitch Engine
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================================================= */}
      {/* SCROLL STORY 1: FIND (Discover Hackathons) */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              01 • FIND OPPORTUNITY
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              Your next project is out there.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl">
              Filter by verified domains, prize pools, online/offline formats, and
              deadlines. Never miss a registration window.
            </p>
          </div>
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>View all competitions</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hackathon Spotlight Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.slice(0, 3).map((hackathon) => (
            <TiltCard
              key={hackathon.id}
              className="p-6 flex flex-col justify-between"
              data-cursor="EXPLORE →"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-blue-500/10 border border-blue-400/20 px-2.5 py-1 text-xs font-semibold text-blue-300">
                    {hackathon.is_online ? "🌐 Online" : "📍 In-Person"}
                  </span>
                  {hackathon.difficulty && (
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-gray-300 capitalize">
                      {hackathon.difficulty}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {hackathon.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  By {hackathon.organizer}
                </p>

                <p className="mt-4 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {hackathon.description || "Official engineering competition."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs">
                {hackathon.prize && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">Prize Pool:</span>
                    <span className="font-semibold text-emerald-400">
                      {hackathon.prize}
                    </span>
                  </div>
                )}
                {hackathon.registration_deadline && (
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">Deadline:</span>
                    <span>
                      {new Date(hackathon.registration_deadline).toLocaleDateString(
                        "en-IN",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                )}

                <Link
                  href={`/hackathons/${hackathon.id}`}
                  className="mt-4 block w-full rounded-xl bg-white/[0.06] hover:bg-blue-600 hover:text-white text-center py-2 text-xs font-semibold transition-all duration-200"
                >
                  View Details →
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCROLL STORY 2: TEAM UP (TeamMatch Constellation) */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 border-t border-white/10">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            02 • TEAM UP
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
            Find people who complete your team.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400">
            Hackathons aren&apos;t won solo. Match based on complementary roles, verified
            skills, and real availability. No fabricated percentages.
          </p>
        </div>

        <SkillGraph />

        <div className="mt-8 text-center">
          <GlowButton href="/teams" variant="primary" size="md" dataCursor="CONNECT →">
            <Users size={16} />
            <span>Open Team Finder & Student Directory</span>
          </GlowButton>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCROLL STORY 3: LEARN (Winning Projects Archive) */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              03 • LEARN FROM WINNERS
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
              Don&apos;t just participate. Learn from what was built.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl">
              Study verified hackathon winners. Inspect their architectures, key lessons,
              and code repositories to elevate your own builds.
            </p>
          </div>
          <Link
            href="/winners"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Explore full archive</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.slice(0, 3).map((proj) => (
            <GlassCard
              key={proj.id}
              className="p-6 flex flex-col justify-between"
              hoverEffect={true}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider">
                    {proj.domain}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {proj.year}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-white">
                  {proj.project_name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Won at {proj.competition}
                </p>

                <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/5 p-3 text-xs text-gray-300 leading-relaxed">
                  <span className="text-gray-500 block mb-1 font-mono uppercase text-[10px]">
                    Problem Solved:
                  </span>
                  <p className="line-clamp-2">{proj.problem_statement}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-gray-500 block mb-2">
                  Tech Stack:
                </span>
                <p className="text-xs text-blue-300 font-mono truncate">
                  {proj.tech_stack}
                </p>
                <Link
                  href={`/projects/${proj.id}`}
                  className="mt-4 block rounded-xl border border-white/10 bg-white/5 hover:bg-white hover:text-black py-2 text-center text-xs font-semibold transition-all duration-200"
                >
                  Case Study →
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCROLL STORY 4: BUILD (AI Project Lab Pipeline) */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 border-t border-white/10">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/30 via-[#070707] to-indigo-950/20 p-8 sm:p-14 backdrop-blur-2xl">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
              04 • PROJECT LAB
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
              Turn problems into demonstrable prototypes.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              HackHub AI isn&apos;t a generic conversational chatbot. It is a context-aware
              project architect that breaks problem statements down into structured,
              actionable engineering specifications.
            </p>
          </div>

          {/* Sequential Stage Pipeline Illustration */}
          <div className="mt-10 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <span className="text-xs font-mono text-blue-400">01 STAGE</span>
              <p className="mt-1 text-sm font-bold">Problem Breakdown</p>
              <p className="mt-1 text-xs text-gray-400">
                Extract core pain points and technical constraints.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <span className="text-xs font-mono text-indigo-400">02 STAGE</span>
              <p className="mt-1 text-sm font-bold">MVP Definition</p>
              <p className="mt-1 text-xs text-gray-400">
                Define the minimal demonstrable feature set within time limits.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <span className="text-xs font-mono text-cyan-400">03 STAGE</span>
              <p className="mt-1 text-sm font-bold">System Architecture</p>
              <p className="mt-1 text-xs text-gray-400">
                Design REST APIs, database schemas, and data pipelines.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <span className="text-xs font-mono text-emerald-400">04 STAGE</span>
              <p className="mt-1 text-sm font-bold">Judge Simulation</p>
              <p className="mt-1 text-xs text-gray-400">
                Generate defensive pitch notes and anticipated Q&A drills.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <GlowButton href="/ai" variant="primary" size="md">
              <Sparkles size={16} />
              <span>Launch Project Lab</span>
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCROLL STORY 5: SUBMIT (AI PPT Maker) */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 border-t border-white/10">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
              05 • SUBMIT
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight">
              Rule-aware presentations in minutes.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed">
              Every hackathon has strict submission rules. The AI PPT Maker enforces slide
              ceilings (such as Versathon 2.0&apos;s strict 10-slide limit), generates
              speaker notes, calculates demo flow times, and exports real editable PowerPoint files.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>Strict slide limit enforcement for target hackathons</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>Automated compliance audit and claim safety checks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>Real editable .pptx and printable deck exports</span>
              </div>
            </div>

            <div className="mt-8">
              <GlowButton href="/ppt-maker" variant="primary" size="md">
                <Presentation size={16} />
                <span>Open AI PPT Maker</span>
              </GlowButton>
            </div>
          </div>

          {/* Visual Presentation Deck Mockup */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl shadow-purple-500/5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-gray-400 font-mono">
              <span>DECK PREVIEW • 10 SLIDES MAX</span>
              <span className="text-emerald-400">● RULE COMPLIANT</span>
            </div>
            <div className="mt-4 aspect-video rounded-xl border border-white/10 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase">
                  SLIDE 01 • TITLE & ARCHITECTURE
                </span>
                <p className="mt-2 text-xl font-bold text-white">
                  Autonomous Sepsis Screening Engine
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Edge diagnostics for primary care clinics.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-white/10">
                <span>Speaker Notes: 45 sec</span>
                <span>Demo Video: 5-10 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FINAL CONCLUSION & ENTER CALLOUT */}
      {/* ========================================================================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-32 border-t border-white/10 text-center">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
          FIND. <br />
          BUILD. <br />
          SHOWCASE. <br />
          <span className="text-blue-500">GROW.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base text-gray-400">
          Step into the complete engineering student platform.
        </p>

        <div className="mt-10 flex justify-center">
          <GlowButton href="/hackathons" size="lg" variant="primary" dataCursor="ENTER →">
            <span>ENTER HACKHUB</span>
            <ArrowRight size={20} />
          </GlowButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-xs text-gray-500 bg-[#050505]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 HackHub. Built for student builders and engineers.</p>
          <div className="flex items-center gap-6">
            <Link href="/hackathons" className="hover:text-white transition">
              Hackathons
            </Link>
            <Link href="/teams" className="hover:text-white transition">
              Teams
            </Link>
            <Link href="/winners" className="hover:text-white transition">
              Winners
            </Link>
            <Link href="/ppt-maker" className="hover:text-white transition">
              PPT Maker
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}