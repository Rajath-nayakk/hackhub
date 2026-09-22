import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import { getProjectById } from "@/lib/api";
import {
  Trophy,
  ArrowLeft,
  ExternalLink,
  Code,
  Sparkles,
} from "@/components/ui/Icons";
import { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await getProjectById(id);
    const project = res.data;
    return {
      title: `${project.project_name} | Winning Case Study`,
      description: project.problem_statement,
    };
  } catch {
    return { title: "Project Case Study | HackHub" };
  }
}

export default async function ProjectDetails({ params }: ProjectPageProps) {
  const { id } = await params;

  let project;
  let source = "development-seed";

  try {
    const res = await getProjectById(id);
    project = res.data;
    source = res.source || "development-seed";
  } catch {
    return (
      <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
            <Trophy className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold font-mono">
            CASE STUDY UNAVAILABLE
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            This winning project repository could not be located in the current database.
          </p>
          <Link
            href="/winners"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-blue-500 transition"
          >
            ← BACK TO ARCHIVE
          </Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-32 text-center font-mono">
          <p>Project data is empty.</p>
          <Link href="/winners" className="text-blue-400 underline mt-4 block">
            Return to Winners
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-32">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/winners"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO WINNERS ARCHIVE</span>
          </Link>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-mono text-gray-400">
            RECORD #{project.id} {" // "} {source === "supabase" ? "SUPABASE LIVE" : "DEV SEED"}
          </span>
        </div>

        {/* Hero Banner */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0E1324]/90 to-[#070A12]/95 p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              <span>OFFICIAL COMPETITION WINNER</span>
            </span>

            {project.year && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-gray-400">
                CLASS OF {project.year}
              </span>
            )}

            {project.domain && (
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-300">
                {project.domain}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {project.project_name}
          </h1>

          {project.competition && (
            <p className="mt-3 text-sm font-mono text-gray-400">
              Championship Event:{" "}
              <strong className="text-white">{project.competition}</strong>
            </p>
          )}
        </section>

        {/* Main Content Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left Column: Case Study Core */}
          <div className="space-y-6 lg:col-span-2">
            {/* The Problem Statement */}
            <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-7 backdrop-blur-md">
              <span className="text-xs font-mono text-rose-400 block mb-2 font-bold tracking-wider">
                01 // THE TARGET PROBLEM
              </span>
              <h2 className="text-xl font-bold text-white mb-4">
                What friction did they solve?
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-300 font-sans">
                {project.problem_statement}
              </p>
            </section>

            {/* The Engineered Solution */}
            <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-7 backdrop-blur-md">
              <span className="text-xs font-mono text-blue-400 block mb-2 font-bold tracking-wider">
                02 // THE ENGINEERED SOLUTION
              </span>
              <h2 className="text-xl font-bold text-white mb-4">
                Architecture &amp; MVP Implementation
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-300 font-sans">
                {project.solution}
              </p>
            </section>

            {/* Why It Won - The Jury Perspective */}
            <section className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-7 backdrop-blur-md">
              <span className="text-xs font-mono text-amber-400 block mb-2 font-bold tracking-wider flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                03 // JUDGING DELIBERATION
              </span>
              <h2 className="text-xl font-bold text-white mb-4">
                Why this build earned 1st Place
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-300 font-sans">
                {project.why_it_won ||
                  "Demonstrated exceptional technical execution, clean separation of concerns, and an intuitive prototype tested against realistic edge cases."}
              </p>
            </section>
          </div>

          {/* Right Column: Technical Specifications & Links */}
          <aside className="space-y-6">
            {/* Tech Stack Spec */}
            <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4 text-xs font-mono text-purple-400">
                <Code className="h-4 w-4" />
                <span>TECH STACK UTILIZED</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.split(",").map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-gray-300"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </section>

            {/* Team Metrics */}
            {project.team_size && (
              <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
                <span className="text-xs font-mono text-gray-500 block">
                  TEAM VELOCITY
                </span>
                <p className="mt-1 text-2xl font-extrabold text-white font-mono">
                  {project.team_size} Engineers
                </p>
                <p className="mt-1 text-xs text-gray-400 font-mono">
                  Cross-functional hackathon squad
                </p>
              </section>
            )}

            {/* Repositories & Artifacts */}
            {(project.github_url || project.demo_url) && (
              <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
                <span className="text-xs font-mono text-gray-500 block mb-4">
                  VERIFIED ARTIFACTS
                </span>
                <div className="space-y-3 font-mono text-xs">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-gray-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <span>VIEW CODE REPOSITORY</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-gray-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <span>LIVE DEPLOYMENT DEMO</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </section>
            )}

            {/* AI Breakdown Card */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/[0.04] p-6 backdrop-blur-md">
              <span className="text-xs font-mono text-blue-400 block mb-1">
                AI REVERSE-ENGINEERING
              </span>
              <h4 className="text-base font-bold text-white">
                Learn how to build this
              </h4>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed font-sans">
                Deconstruct this project&apos;s winning factors and generate a tailored roadmap for your team.
              </p>
              <Link
                href={`/winners/analyze?projectId=${project.id}`}
                className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 px-4 text-xs font-mono font-bold text-white transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>ANALYZE WITH AI</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}