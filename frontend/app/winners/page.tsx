import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getProjects } from "@/lib/api";

interface Project {
  id: number;
  project_name: string;
  competition: string;
  year: number;
  problem_statement: string;
  solution: string;
  tech_stack: string;
  domain: string;
  team_size: number;
  project_image_url?: string;
  demo_url?: string;
  github_url?: string;
  why_it_won: string;
}

export default async function WinnersPage() {
  let projects: Project[] = [];
  let error = false;

  try {
    const response = await getProjects();
    projects = response.data || [];
  } catch (err) {
    console.error("Failed to load projects:", err);
    error = true;
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            🏆 Winning Projects
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Learn from projects that{" "}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-violet-400 bg-clip-text text-transparent">
              actually won.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Explore winning hackathon projects, understand what
            made them successful, and learn how to build better
            projects yourself.
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          <StatCard
            value={projects.length.toString()}
            label="Winning Projects"
          />

          <StatCard
            value="AI"
            label="Project Analysis"
          />

          <StatCard
            value="∞"
            label="Lessons to Learn"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-300">
            ⚠️ Failed to load winning projects.
          </div>
        )}

        {/* Projects */}
        {!error && projects.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Featured Winners
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Projects worth studying before your next
                  hackathon.
                </p>
              </div>

              <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 sm:block">
                {projects.length} projects
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty */}
        {!error && projects.length === 0 && (
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <div className="text-5xl">🏆</div>

            <h2 className="mt-5 text-2xl font-bold">
              No winning projects yet
            </h2>

            <p className="mt-2 text-slate-400">
              Winning projects will appear here once they are
              added to HackHub.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-cyan-500/10 p-8 text-center sm:p-12">
          <div className="text-4xl">🧠</div>

          <h2 className="mt-4 text-3xl font-bold">
            Want to know why a project won?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Give HackHub AI a project and get a judge-style
            breakdown of its innovation, execution, impact,
            weaknesses and winning potential.
          </p>

          <Link
            href="/winners/analyze"
            className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold shadow-lg shadow-violet-500/20 transition hover:scale-[1.02]"
          >
            Analyze a Project →
          </Link>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------- */
/* Project Card */
/* -------------------------------- */

function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/[0.06]">
      {/* Top */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-violet-500/20 via-cyan-500/10 to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-70 transition duration-300 group-hover:scale-110">
            🏆
          </span>
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-md">
          Winner
        </div>

        {project.year && (
          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
            {project.year}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-violet-400">
            {project.domain || "Hackathon Project"}
          </span>
        </div>

        <h3 className="text-xl font-bold transition group-hover:text-violet-300">
          {project.project_name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {project.competition}
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Problem
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
            {project.problem_statement}
          </p>
        </div>

        {/* Tech */}
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Tech Stack
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {project.tech_stack
              ?.split(",")
              .slice(0, 4)
              .map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                >
                  {tech.trim()}
                </span>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6">
          <div className="mb-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
            <span>
              👥 Team of {project.team_size}
            </span>

            <span>🏆 Winning Project</span>
          </div>

          <Link
            href={`/projects/${project.id}`}
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold transition hover:bg-white/10"
          >
            View Project →
          </Link>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------- */
/* Stats Card */
/* -------------------------------- */

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl">
      <div className="text-2xl font-bold text-white">
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {label}
      </div>
    </div>
  );
}