"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

interface AIdea {
  projectTitle: string;
  problemStatement: string;
  solution: string;
  keyFeatures: string[];
  techStack: string[];
  innovation: string;
  expectedImpact: string;
  whyItCouldWin: string[];
}

export default function AIPage() {
  const [domain, setDomain] = useState("");
  const [problemArea, setProblemArea] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [technologies, setTechnologies] = useState("");

  const [idea, setIdea] = useState<AIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateIdea = async () => {
    setLoading(true);
    setError("");
    setIdea(null);
    setCopied(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/generate-idea",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain,
            problemArea,
            skillLevel,
            technologies,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to generate idea"
        );
      }

      setIdea(result.data.idea);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyIdea = async () => {
    if (!idea) return;

    const text = `
${idea.projectTitle}

PROBLEM STATEMENT
${idea.problemStatement}

SOLUTION
${idea.solution}

KEY FEATURES
${idea.keyFeatures.map((feature) => `• ${feature}`).join("\n")}

TECH STACK
${idea.techStack.join(", ")}

INNOVATION
${idea.innovation}

EXPECTED IMPACT
${idea.expectedImpact}

WHY IT COULD WIN
${idea.whyItCouldWin.map((reason) => `• ${reason}`).join("\n")}
    `.trim();

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-36">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <span>✦</span>
            HackHub AI
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Turn problems into
            <span className="block text-blue-500">
              winning ideas.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            Tell HackHub what you're interested in and let AI
            transform your problem into a practical, innovative
            hackathon project.
          </p>
        </div>

        {/* INPUT CARD */}
        <div className="mx-auto mt-14 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-blue-500/5 md:p-10">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Project preferences
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              What do you want to build?
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* DOMAIN */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Domain
              </label>

              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="AI, Healthcare, Cybersecurity..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* PROBLEM AREA */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Problem area
              </label>

              <input
                type="text"
                value={problemArea}
                onChange={(e) =>
                  setProblemArea(e.target.value)
                }
                placeholder="Education, Traffic, Agriculture..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* SKILL LEVEL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Skill level
              </label>

              <select
                value={skillLevel}
                onChange={(e) =>
                  setSkillLevel(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">
                  Intermediate
                </option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* TECHNOLOGIES */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Preferred technologies
              </label>

              <input
                type="text"
                value={technologies}
                onChange={(e) =>
                  setTechnologies(e.target.value)
                }
                placeholder="React, Node.js, Python..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generateIdea}
            disabled={
              loading ||
              !domain.trim() ||
              !problemArea.trim()
            }
            className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating your idea...
              </>
            ) : (
              <>
                <span className="text-lg">✦</span>
                Generate Hackathon Idea
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <div className="font-semibold">
                Something went wrong
              </div>

              <div className="mt-1 text-red-400/80">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* LOADING MESSAGE */}
        {loading && (
          <div className="mx-auto mt-12 max-w-5xl text-center">
            <div className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.03] p-10">
              <div className="mx-auto mb-5 h-10 w-10 animate-pulse rounded-full bg-blue-500/20" />

              <p className="font-medium text-gray-300">
                HackHub AI is thinking...
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Finding a problem worth solving and turning it
                into a hackathon-ready concept.
              </p>
            </div>
          </div>
        )}

        {/* AI RESULT */}
        {idea && !loading && (
          <section className="mx-auto mt-14 max-w-5xl">
            {/* RESULT HEADER */}
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
                  <span>✦</span>
                  AI Generated Concept
                </div>

                <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                  {idea.projectTitle}
                </h2>
              </div>

              <button
                onClick={copyIdea}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                {copied ? "✓ Copied!" : "📋 Copy idea"}
              </button>
            </div>

            {/* PROBLEM + SOLUTION */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-lg">
                    🎯
                  </div>

                  <h3 className="font-semibold">
                    Problem Statement
                  </h3>
                </div>

                <p className="text-sm leading-7 text-gray-400">
                  {idea.problemStatement}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                    💡
                  </div>

                  <h3 className="font-semibold">
                    Proposed Solution
                  </h3>
                </div>

                <p className="text-sm leading-7 text-gray-400">
                  {idea.solution}
                </p>
              </div>
            </div>

            {/* KEY FEATURES */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-lg">
                  ⚡
                </div>

                <div>
                  <h3 className="font-semibold">
                    Key Features
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    What makes the product useful
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {idea.keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-white/5 bg-black/20 p-4"
                  >
                    <span className="mt-0.5 text-blue-500">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-gray-400">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TECH STACK */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-lg">
                  🛠
                </div>

                <h3 className="font-semibold">
                  Recommended Tech Stack
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {idea.techStack.map((technology, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>

            {/* INNOVATION + IMPACT */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-lg">
                    🚀
                  </div>

                  <h3 className="font-semibold">
                    Innovation
                  </h3>
                </div>

                <p className="text-sm leading-7 text-gray-400">
                  {idea.innovation}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-lg">
                    🌍
                  </div>

                  <h3 className="font-semibold">
                    Expected Impact
                  </h3>
                </div>

                <p className="text-sm leading-7 text-gray-400">
                  {idea.expectedImpact}
                </p>
              </div>
            </div>

            {/* WHY IT COULD WIN */}
            <div className="mt-6 rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-7 md:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-xl">
                  🏆
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                    Hackathon strategy
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Why this could win
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {idea.whyItCouldWin.map((reason, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-black/20 p-5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="text-sm leading-7 text-gray-300">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* REGENERATE */}
            <div className="mt-8 text-center">
              <button
                onClick={generateIdea}
                disabled={loading}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                🔄 Generate another idea
              </button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}