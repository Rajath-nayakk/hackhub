"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";

interface Analysis {
  projectSummary: string;
  problemStrength: number;
  innovationScore: number;
  technicalExecution: number;
  demoPotential: number;
  impactScore: number;
  whyItCouldWin: string[];
  keyDifferentiators: string[];
  weaknesses: string[];
  improvementIdeas: string[];
  hackathonLessons: string[];
}

export default function WinnerAnalyzerPage() {
  const [projectName, setProjectName] = useState("");
  const [competition, setCompetition] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [techStack, setTechStack] = useState("");

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const analyzeProject = async (e: FormEvent) => {
    e.preventDefault();

    if (!projectName || !problem || !solution || !techStack) {
      setError(
        "Please fill in project name, problem, solution and tech stack."
      );
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch(
        `${API_URL}/api/winner-analyzer/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectName,
            competition,
            problem,
            solution,
            techStack,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to analyze project"
        );
      }

      setAnalysis(result.data.analysis);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyAnalysis = async () => {
    if (!analysis) return;

    const text = `
HACKHUB AI — WINNING PROJECT ANALYSIS

Project: ${projectName}
Competition: ${competition || "Not specified"}

PROJECT SUMMARY
${analysis.projectSummary}

JUDGE SCORES
Problem Strength: ${analysis.problemStrength}/10
Innovation: ${analysis.innovationScore}/10
Technical Execution: ${analysis.technicalExecution}/10
Demo Potential: ${analysis.demoPotential}/10
Impact: ${analysis.impactScore}/10

WHY IT COULD WIN
${analysis.whyItCouldWin.map((x) => `• ${x}`).join("\n")}

KEY DIFFERENTIATORS
${analysis.keyDifferentiators.map((x) => `• ${x}`).join("\n")}

WEAKNESSES
${analysis.weaknesses.map((x) => `• ${x}`).join("\n")}

IMPROVEMENT IDEAS
${analysis.improvementIdeas.map((x) => `• ${x}`).join("\n")}

HACKATHON LESSONS
${analysis.hackathonLessons.map((x) => `• ${x}`).join("\n")}
`;

    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const resetAnalyzer = () => {
    setAnalysis(null);
    setError("");
    setProjectName("");
    setCompetition("");
    setProblem("");
    setSolution("");
    setTechStack("");
  };

  const scoreCards = analysis
    ? [
        {
          title: "Problem Strength",
          score: analysis.problemStrength,
          icon: "🎯",
        },
        {
          title: "Innovation",
          score: analysis.innovationScore,
          icon: "💡",
        },
        {
          title: "Technical Execution",
          score: analysis.technicalExecution,
          icon: "⚙️",
        },
        {
          title: "Demo Potential",
          score: analysis.demoPotential,
          icon: "🚀",
        },
        {
          title: "Impact",
          score: analysis.impactScore,
          icon: "🌍",
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
            <span>🧠</span>
            HackHub AI
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Why did this{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              project win?
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
            Analyze a hackathon project from a judge&apos;s
            perspective. Discover its strengths, weaknesses,
            innovation and what made it competitive.
          </p>
        </div>

        {/* FORM */}
        {!analysis && (
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={analyzeProject}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-semibold">
                  Analyze a project
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Give HackHub AI enough context to judge the
                  project realistically.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Project */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Project name *
                  </label>

                  <input
                    value={projectName}
                    onChange={(e) =>
                      setProjectName(e.target.value)
                    }
                    placeholder="e.g. Smart Education Platform"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                  />
                </div>

                {/* Competition */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Competition
                  </label>

                  <input
                    value={competition}
                    onChange={(e) =>
                      setCompetition(e.target.value)
                    }
                    placeholder="e.g. Smart India Hackathon"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Problem */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Problem statement *
                </label>

                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={4}
                  placeholder="What real-world problem does the project solve?"
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              {/* Solution */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Solution *
                </label>

                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={5}
                  placeholder="Explain how the project solves the problem..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              {/* Tech */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Technology stack *
                </label>

                <input
                  value={techStack}
                  onChange={(e) =>
                    setTechStack(e.target.value)
                  }
                  placeholder="e.g. Next.js, Node.js, Supabase, Gemini"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  ⚠️ {error}
                </div>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01] hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing project...
                  </span>
                ) : (
                  "✨ Analyze Winning Potential"
                )}
              </button>
            </form>
          </div>
        )}

        {/* RESULTS */}
        {analysis && (
          <div className="space-y-8">
            {/* Result Header */}
            <div className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:p-8">
              <div>
                <div className="mb-2 text-sm font-medium text-violet-400">
                  AI ANALYSIS COMPLETE
                </div>

                <h2 className="text-3xl font-bold">
                  {projectName}
                </h2>

                {competition && (
                  <p className="mt-2 text-slate-400">
                    {competition}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyAnalysis}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
                >
                  {copied ? "✓ Copied" : "📋 Copy Analysis"}
                </button>

                <button
                  onClick={resetAnalyzer}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
                >
                  Analyze Another
                </button>
              </div>
            </div>

            {/* Summary */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-violet-500/10 p-3 text-xl">
                  📋
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Project Summary
                  </h3>

                  <p className="text-sm text-slate-500">
                    Judge&apos;s perspective
                  </p>
                </div>
              </div>

              <p className="leading-8 text-slate-300">
                {analysis.projectSummary}
              </p>
            </section>

            {/* Scores */}
            <section>
              <div className="mb-5">
                <h3 className="text-2xl font-bold">
                  Judge Scorecards
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  How the project performs across important
                  hackathon judging dimensions.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {scoreCards.map((item) => (
                  <ScoreCard
                    key={item.title}
                    title={item.title}
                    score={item.score}
                    icon={item.icon}
                  />
                ))}
              </div>
            </section>

            {/* Two columns */}
            <div className="grid gap-8 lg:grid-cols-2">
              <AnalysisSection
                title="Why It Could Win"
                subtitle="The strongest competitive advantages"
                icon="🏆"
                items={analysis.whyItCouldWin}
                type="success"
              />

              <AnalysisSection
                title="Key Differentiators"
                subtitle="What separates it from typical projects"
                icon="⚡"
                items={analysis.keyDifferentiators}
                type="info"
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <AnalysisSection
                title="Weaknesses"
                subtitle="Where the project could lose points"
                icon="⚠️"
                items={analysis.weaknesses}
                type="warning"
              />

              <AnalysisSection
                title="Improvement Ideas"
                subtitle="How to make the project stronger"
                icon="🚀"
                items={analysis.improvementIdeas}
                type="purple"
              />
            </div>

            {/* Lessons */}
            <section className="rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.06] to-violet-500/[0.04] p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <div className="mb-4 inline-flex rounded-xl bg-cyan-500/10 p-3 text-xl">
                  🎓
                </div>

                <h3 className="text-2xl font-bold">
                  Hackathon Lessons
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Practical lessons you can apply to your own
                  hackathon projects.
                </p>
              </div>

              <div className="space-y-4">
                {analysis.hackathonLessons.map(
                  (lesson, index) => (
                    <div
                      key={index}
                      className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-400">
                        {index + 1}
                      </div>

                      <p className="leading-7 text-slate-300">
                        {lesson}
                      </p>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

/* -------------------------------- */
/* Score Card */
/* -------------------------------- */

function ScoreCard({
  title,
  score,
  icon,
}: {
  title: string;
  score: number;
  icon: string;
}) {
  const percentage = Math.min(
    Math.max(score * 10, 0),
    100
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.06]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xl">{icon}</span>

        <span className="text-2xl font-bold">
          {score.toFixed(1)}
          <span className="text-sm font-normal text-slate-500">
            /10
          </span>
        </span>
      </div>

      <h4 className="min-h-[40px] text-sm font-medium text-slate-300">
        {title}
      </h4>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Analysis Section */
/* -------------------------------- */

function AnalysisSection({
  title,
  subtitle,
  icon,
  items,
  type,
}: {
  title: string;
  subtitle: string;
  icon: string;
  items: string[];
  type: "success" | "info" | "warning" | "purple";
}) {
  const styles = {
    success: "border-emerald-500/10",
    info: "border-cyan-500/10",
    warning: "border-amber-500/10",
    purple: "border-violet-500/10",
  };

  const bulletStyles = {
    success: "bg-emerald-500/10 text-emerald-400",
    info: "bg-cyan-500/10 text-cyan-400",
    warning: "bg-amber-500/10 text-amber-400",
    purple: "bg-violet-500/10 text-violet-400",
  };

  return (
    <section
      className={`rounded-3xl border ${styles[type]} bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8`}
    >
      <div className="mb-6 flex items-start gap-4">
        <div
          className={`rounded-xl p-3 ${bulletStyles[type]}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-xl font-bold">{title}</h3>

          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4"
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${bulletStyles[type]}`}
            >
              {index + 1}
            </span>

            <p className="text-sm leading-6 text-slate-300">
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}