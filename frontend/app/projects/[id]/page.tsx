import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getProjectById } from "@/lib/api";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetails({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  let project;

  try {
    project = await getProjectById(id);
  } catch {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="mb-6 text-6xl">🔍</div>

          <h1 className="text-3xl font-bold">
            Project Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            This winning project doesn't exist or could not be loaded.
          </p>

          <Link
            href="/winners"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            ← Back to Winners
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Back */}
        <Link
          href="/winners"
          className="mb-8 inline-flex text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Winning Projects
        </Link>

        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 md:p-12">

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">
              🏆 Winning Project
            </span>

            {project.year && (
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                {project.year}
              </span>
            )}

            {project.domain && (
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                {project.domain}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            {project.project_name}
          </h1>

          {project.competition && (
            <p className="mt-4 text-lg text-gray-400">
              🏅 {project.competition}
            </p>
          )}
        </section>

        {/* Main content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Left */}
          <div className="space-y-8 lg:col-span-2">

            {/* Problem */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-red-400">
                The Problem
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                What problem did they solve?
              </h2>

              <p className="leading-8 text-gray-300">
                {project.problem_statement}
              </p>
            </section>

            {/* Solution */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
                The Solution
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                How the project works
              </h2>

              <p className="leading-8 text-gray-300">
                {project.solution}
              </p>
            </section>

            {/* Why it won */}
            <section className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-7">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-yellow-400">
                🏆 Judge Perspective
              </p>

              <h2 className="mb-4 text-2xl font-bold">
                Why did this project win?
              </h2>

              <p className="leading-8 text-gray-300">
                {project.why_it_won ||
                  "The winning factors for this project have not been added yet."}
              </p>
            </section>

          </div>

          {/* Right */}
          <aside className="space-y-6">

            {/* Tech Stack */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="mb-5 text-xl font-bold">
                🛠️ Tech Stack
              </h2>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack
                  ?.split(",")
                  .map((tech: string) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-gray-300"
                    >
                      {tech.trim()}
                    </span>
                  ))}
              </div>
            </section>

            {/* Team */}
            {project.team_size && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm text-gray-500">
                  TEAM SIZE
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {project.team_size}
                </p>

                <p className="text-sm text-gray-400">
                  members
                </p>
              </section>
            )}

            {/* Links */}
            {(project.github_url || project.demo_url) && (
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="mb-4 text-xl font-bold">
                  🔗 Project Links
                </h2>

                <div className="space-y-3">

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-white/10 px-4 py-3 text-center transition hover:bg-white/10"
                    >
                      GitHub →
                    </a>
                  )}

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border border-white/10 px-4 py-3 text-center transition hover:bg-white/10"
                    >
                      Live Demo →
                    </a>
                  )}

                </div>
              </section>
            )}

          </aside>
        </div>

        {/* AI CTA */}
        <section className="mt-10 rounded-3xl border border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-8 text-center md:p-12">

          <div className="text-4xl">🤖</div>

          <h2 className="mt-4 text-3xl font-bold">
            Want to know why this project really won?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-400">
            Use HackHub AI to analyze the project from a hackathon
            judge's perspective and discover what you can learn from it.
          </p>

          <Link
            href="/winners/analyze"
            className="mt-7 inline-block rounded-xl bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Analyze with HackHub AI →
          </Link>

        </section>

      </div>
    </main>
  );
}