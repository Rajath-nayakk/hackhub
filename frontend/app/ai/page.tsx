"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import {
  Sparkles,
  ArrowRight,
  Check,
  Presentation,
  Trophy,
} from "@/components/ui/Icons";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function AIProjectLabContent() {
  const searchParams = useSearchParams();
  const prefillProblem = searchParams.get("problemStatement") || "";
  const prefillDomain = searchParams.get("domain") || "";

  const [domain, setDomain] = useState(prefillDomain || "Artificial Intelligence");
  const [problemArea, setProblemArea] = useState(prefillProblem || "");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [technologies, setTechnologies] = useState("Next.js, Python, PyTorch, Supabase");

  const [idea, setIdea] = useState<AIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefillProblem) {
      requestAnimationFrame(() => {
        setProblemArea((prev) => prev || prefillProblem);
      });
    }
  }, [prefillProblem]);

  const generateIdea = async () => {
    setLoading(true);
    setError("");
    setIdea(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_URL}/api/ai/generate-idea`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          problemArea,
          skillLevel,
          technologies,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to synthesize project idea.");
      }

      setIdea(result.data.idea);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "AI synthesis encountered an issue."
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
${idea.keyFeatures.map((f) => `• ${f}`).join("\n")}

TECH STACK
${idea.techStack.join(", ")}

INNOVATION
${idea.innovation}

EXPECTED IMPACT
${idea.expectedImpact}

WHY IT COULD WIN
${idea.whyItCouldWin.map((r) => `• ${r}`).join("\n")}
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-32">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-400 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>PROJECT LAB // ARCHITECTURAL SYNTHESIS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn ambiguous problems into{" "}
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            winning architectures.
          </span>
        </h1>

        <p className="mt-4 text-base md:text-lg leading-relaxed text-gray-400 font-sans">
          Specify your target hackathon domain, problem parameters, and technical
          stack. HackHub AI designs an end-to-end technical proposal, defensible
          differentiators, and MVP scope.
        </p>
      </div>

      {/* Input Console */}
      <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E1324]/90 to-[#070A12]/95 p-6 md:p-10 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono text-blue-400 block mb-1">
              ENGINEERING PARAMETERS
            </span>
            <h2 className="text-xl font-bold text-white">Project Blueprint Config</h2>
          </div>
          <span className="text-[11px] font-mono text-gray-500">
            GEMINI-3.6-FLASH // ACCELERATED
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 text-xs font-mono">
          {/* Domain */}
          <div>
            <label className="block text-gray-400 mb-2">TARGET DOMAIN</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. AI / Machine Learning, FinTech, Web3"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-gray-400 mb-2">SQUAD EXPERIENCE TIER</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
            >
              <option value="Beginner">Beginner (1st / 2nd Year)</option>
              <option value="Intermediate">Intermediate (Hands-on Builders)</option>
              <option value="Advanced">Advanced (Production &amp; Research)</option>
            </select>
          </div>

          {/* Problem Area */}
          <div className="sm:col-span-2">
            <label className="block text-gray-400 mb-2">
              TARGET PROBLEM OR CONTEXT
            </label>
            <textarea
              rows={3}
              value={problemArea}
              onChange={(e) => setProblemArea(e.target.value)}
              placeholder="Describe the friction or paste an official problem statement (e.g. V26-AI-01: Multi-Agent Clinical Data Pipeline)..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans resize-none"
            />
          </div>

          {/* Technologies */}
          <div className="sm:col-span-2">
            <label className="block text-gray-400 mb-2">
              PREFERRED TECH STACK
            </label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="e.g. Next.js 16, Python, PyTorch, Supabase, TailwindCSS"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateIdea}
          disabled={loading || !domain.trim() || !problemArea.trim()}
          className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-4 px-6 text-center text-xs font-mono font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>SYNTHESIZING TECHNICAL SPECIFICATION...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>SYNTHESIZE HACKATHON PROJECT BLUEPRINT</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-mono text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Generated Blueprint View */}
      {idea && !loading && (
        <section className="mx-auto mt-12 max-w-4xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/[0.04] p-6 backdrop-blur-md">
            <div>
              <span className="text-xs font-mono text-blue-400 block mb-1">
                SYNTHESIS ARTIFACT
              </span>
              <h2 className="text-2xl font-bold text-white font-mono">
                {idea.projectTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyIdea}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-gray-300 hover:text-white transition"
              >
                {copied ? "✓ COPIED" : "COPY TEXT"}
              </button>

              <Link
                href={`/ppt-maker?projectTitle=${encodeURIComponent(
                  idea.projectTitle
                )}&problemStatement=${encodeURIComponent(
                  idea.problemStatement
                )}&solution=${encodeURIComponent(
                  idea.solution
                )}&techStack=${encodeURIComponent(idea.techStack.join(", "))}`}
                className="rounded-xl bg-amber-500 text-black px-4 py-2 text-xs font-mono font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
              >
                <Presentation className="h-4 w-4" />
                <span>BUILD 10-SLIDE DECK</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <span className="text-xs font-mono text-rose-400 block mb-2 font-bold">
                PROBLEM FORMULATION
              </span>
              <p className="text-sm leading-relaxed text-gray-300 font-sans">
                {idea.problemStatement}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
              <span className="text-xs font-mono text-blue-400 block mb-2 font-bold">
                PROPOSED SOLUTION &amp; MVP
              </span>
              <p className="text-sm leading-relaxed text-gray-300 font-sans">
                {idea.solution}
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
            <span className="text-xs font-mono text-yellow-400 block mb-3 font-bold">
              FUNCTIONAL ARCHITECTURE DELIVERABLES
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              {idea.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/30 p-3.5"
                >
                  <Check className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed text-gray-300 font-sans">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 backdrop-blur-md">
            <span className="text-xs font-mono text-purple-400 block mb-3 font-bold">
              SYSTEM COMPONENTS &amp; DEPENDENCIES
            </span>
            <div className="flex flex-wrap gap-2">
              {idea.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-mono text-purple-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Why It Could Win */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6 backdrop-blur-md">
            <span className="text-xs font-mono text-amber-400 block mb-3 font-bold flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              JUDGE ADVANTAGE &amp; COMPETITIVE DIFFERENTIATION
            </span>
            <div className="space-y-3">
              {idea.whyItCouldWin.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/30 p-4"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold font-mono text-amber-400">
                    {idx + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-gray-300 font-sans">
                    {r}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function AIPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />
      <Suspense
        fallback={
          <div className="py-32 text-center text-xs font-mono text-gray-500">
            LOADING PROJECT LAB...
          </div>
        }
      >
        <AIProjectLabContent />
      </Suspense>
    </main>
  );
}