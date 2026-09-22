"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import {
  Presentation,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  Download,
  Terminal,
  Shield,
} from "@/components/ui/Icons";

interface Slide {
  slideNumber: number;
  title: string;
  subtitle?: string;
  points: string[];
  layoutType: string;
  speakerNotes: string;
  timeSeconds: number;
  diagramDescription?: string;
}

interface ComplianceAudit {
  isCompliant: boolean;
  slideCount: number;
  maxAllowed: number;
  totalTimeSeconds: number;
  maxTimeSeconds: number;
  passedChecks: string[];
  warnings: string[];
  violations: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_SLIDES: Slide[] = [
  {
    slideNumber: 1,
    title: "Project Identity & Mission",
    subtitle: "AI-Powered Adaptive Energy Grid Management",
    points: [
      "Team: NeuralGrid (HackHub Syndicate)",
      "Target Track: Autonomous Systems & CleanTech",
      "Core Hypothesis: Distributed sub-station telemetry enables sub-second load balancing.",
    ],
    layoutType: "title",
    speakerNotes:
      "Good morning judges. We are NeuralGrid. Today we present an autonomous system to prevent localized blackout cascading using real-time micro-forecasting.",
    timeSeconds: 30,
  },
  {
    slideNumber: 2,
    title: "Problem Statement & Real-World Impact",
    subtitle: "High Peak Surges Cripple Localized Distribution",
    points: [
      "Substations experience sudden load spikes from EV charging and volatile solar feed-in.",
      "Traditional centralized grids take up to 4 minutes to adjust spinning reserve capacity.",
      "Result: Grid stress, equipment degradation, and multi-crore industrial outages.",
    ],
    layoutType: "problem",
    speakerNotes:
      "Legacy infrastructure was never designed for bidirectional distributed power. Current adjustment lag causes micro-trips that cost millions annually.",
    timeSeconds: 35,
  },
  {
    slideNumber: 3,
    title: "Proposed Engineered Solution",
    subtitle: "Edge-Inference Telemetry with Autonomous Throttling",
    points: [
      "Lightweight IoT edge units deployed on neighborhood transformers.",
      "Local multi-agent consensus protocol to redistribute phase load in under 150ms.",
      "Zero continuous cloud dependency for fail-safe physical isolation.",
    ],
    layoutType: "solution",
    speakerNotes:
      "Instead of waiting for remote cloud orchestration, our edge firmware achieves local consensus directly over high-frequency MQTT brokers.",
    timeSeconds: 35,
  },
  {
    slideNumber: 4,
    title: "System Architecture",
    subtitle: "Edge Daemon to Real-Time Supervisory Dashboard",
    points: [
      "Ingestion: ESP32 + Modbus telemetry polling at 60Hz.",
      "Processing: Go-based stream processor calculating phase imbalances.",
      "Consensus: Raft-based micro-clustering across adjacent feeders.",
      "Interface: Next.js 16 WebGL visualization with sub-second WebSocket updates.",
    ],
    layoutType: "architecture",
    speakerNotes:
      "Here is the high-level architecture. Notice how the real-time safety loop is strictly air-gapped from the telemetry pipeline.",
    timeSeconds: 40,
    diagramDescription:
      "[Edge Sensors] -> [Go Micro-Broker] -> [Raft Consensus Engine] -> [Phase Switch Actuators]",
  },
  {
    slideNumber: 5,
    title: "Live MVP & Technical Implementation",
    subtitle: "Verified Sub-150ms Imbalance Redistribution",
    points: [
      "Tested on simulated 12-node IEEE feeder network topology.",
      "Simulated a 400% surge spike on Feeder Node #04.",
      "Automated phase transfer triggered in 118ms, preventing trip limit breaches.",
    ],
    layoutType: "mvp",
    speakerNotes:
      "In our live benchmark run, when Feeder 4 received an instantaneous surge, our system redirected 65% of the excess load across secondary feeder paths before the breaker tripped.",
    timeSeconds: 40,
  },
  {
    slideNumber: 6,
    title: "Competitive Edge & Innovation",
    subtitle: "Why NeuralGrid Wins Over Existing SCADA Systems",
    points: [
      "10x Faster Response: 118ms autonomous edge response vs 4-minute manual SCADA polling.",
      "Cost Efficient: $15 open hardware sensor nodes vs $12,000 legacy RTU units.",
      "Zero Cloud Vulnerability: Fully functional during cellular or satellite backhaul drops.",
    ],
    layoutType: "comparison",
    speakerNotes:
      "Most commercial offerings demand proprietary hardware costing thousands per node. We deliver peer-to-peer resilience for under twenty dollars per node.",
    timeSeconds: 30,
  },
  {
    slideNumber: 7,
    title: "Feasibility & Safety Fail-Safes",
    subtitle: "Designed for Real-World Physical Grid Regulations",
    points: [
      "Hardware Interlock: Mechanical contactors physically prevent cross-phase short circuits.",
      "Watchdog Timer: Autonomous fallback to standard grid isolation if firmware hangs.",
      "Compliance: Designed to adhere to IEEE 1547-2018 interconnection standards.",
    ],
    layoutType: "safety",
    speakerNotes:
      "Grid safety is non-negotiable. We included dual hardware interlocks to guarantee zero cross-phase arcing under any failure mode.",
    timeSeconds: 30,
  },
  {
    slideNumber: 8,
    title: "Future Roadmap & Scalability",
    subtitle: "From Hackathon Prototype to Grid Pilot",
    points: [
      "Stage 1: Campus micro-grid hardware validation on 4 campus buildings.",
      "Stage 2: Municipal utility partnership with state electricity boards.",
      "Stage 3: Integration of dynamic variable pricing models for commercial batteries.",
    ],
    layoutType: "roadmap",
    speakerNotes:
      "Our immediate next step is running live pilot instrumentation on the university campus engineering laboratory substation.",
    timeSeconds: 25,
  },
  {
    slideNumber: 9,
    title: "Team Roles & Engineering Execution",
    subtitle: "Cross-Functional Builders Assembled on HackHub",
    points: [
      "Lead Firmware & Systems Engineer: Embedded C / FreeRTOS control loops.",
      "Distributed Systems Engineer: Go micro-broker & Raft consensus implementation.",
      "Frontend & Visualization Engineer: Next.js telemetry console & WebSockets.",
    ],
    layoutType: "team",
    speakerNotes:
      "Our squad unites embedded hardware, distributed algorithms, and frontend engineering into one unified delivery team.",
    timeSeconds: 20,
  },
  {
    slideNumber: 10,
    title: "Summary & Q&A Defense",
    subtitle: "Open Engineering for a Resilient Electric Future",
    points: [
      "Summary: Sub-second autonomous grid stabilization at a fraction of legacy cost.",
      "Repository & Benchmarks: Publicly accessible on GitHub with simulation test harness.",
      "We are ready for judge questions.",
    ],
    layoutType: "conclusion",
    speakerNotes:
      "Thank you judges. We have proven that edge consensus can prevent localized blackouts. We are now open for technical questions.",
    timeSeconds: 15,
  },
];

function PPTMakerContent() {
  const searchParams = useSearchParams();
  const prefillTitle = searchParams.get("projectTitle") || "";
  const prefillProblem = searchParams.get("problemStatement") || "";
  const prefillSolution = searchParams.get("solution") || "";
  const prefillTech = searchParams.get("techStack") || "";
  const hackathonName = searchParams.get("hackathonName") || "Versathon 2.0 (Strict 10-Slide Rule)";

  const [projectTitle, setProjectTitle] = useState(prefillTitle || "NeuralGrid Autonomous Power System");
  const [problemStatement, setProblemStatement] = useState(prefillProblem || "Localized feeder overload during peak renewable feed-in.");
  const [solution, setSolution] = useState(prefillSolution || "Sub-second autonomous edge micro-consensus load balancing.");
  const [techStack, setTechStack] = useState(prefillTech || "Go, Next.js, WebSockets, Embedded C");
  const [targetHackathon, setTargetHackathon] = useState(hackathonName);

  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [showPresentMode, setShowPresentMode] = useState(false);

  // Calculate audit rules
  const totalPitchSeconds = slides.reduce((acc, s) => acc + (s.timeSeconds || 30), 0);
  const pitchMinutes = Math.floor(totalPitchSeconds / 60);
  const pitchSeconds = totalPitchSeconds % 60;
  const isOverTenSlides = slides.length > 10;

  const complianceNotice = useMemo<ComplianceAudit>(() => {
    const passed: string[] = [];
    const warnings: string[] = [];
    const violations: string[] = [];

    if (slides.length <= 10) {
      passed.push(`Strict 10-Slide Ceiling Respected (${slides.length}/10 slides)`);
    } else {
      violations.push(`VIOLATION: ${slides.length} slides exceeds maximum 10-slide limit`);
    }

    if (totalPitchSeconds <= 300) {
      passed.push(`Pitch duration (${pitchMinutes}m ${pitchSeconds}s) fits within 5-minute allocation`);
    } else {
      warnings.push(`PITCH PACING: ${pitchMinutes}m ${pitchSeconds}s slightly exceeds 5:00 limit`);
    }

    const hasArchitecture = slides.some(
      (s) => s.layoutType === "architecture" || s.title.toLowerCase().includes("architecture")
    );
    if (hasArchitecture) {
      passed.push("System Architecture blueprint explicitly defined");
    } else {
      warnings.push("Missing dedicated architecture diagram slide");
    }

    const hasMVP = slides.some(
      (s) =>
        s.layoutType === "mvp" ||
        s.title.toLowerCase().includes("mvp") ||
        s.title.toLowerCase().includes("implementation")
    );
    if (hasMVP) {
      passed.push("Live MVP validation & benchmark results documented");
    }

    return {
      isCompliant: violations.length === 0,
      slideCount: slides.length,
      maxAllowed: 10,
      totalTimeSeconds: totalPitchSeconds,
      maxTimeSeconds: 300,
      passedChecks: passed,
      warnings,
      violations,
    };
  }, [slides, totalPitchSeconds, pitchMinutes, pitchSeconds]);

  const handleGenerateDeck = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`${API_URL}/api/ppt/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle,
          problemStatement,
          solution,
          techStack,
          hackathonName: targetHackathon,
          maxSlides: 10,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to generate deck.");
      }

      if (resData.data?.slides && resData.data.slides.length > 0) {
        setSlides(resData.data.slides.slice(0, 10));
        setActiveSlideIndex(0);
      }
    } catch (err) {
      console.error(err);
      alert("AI presentation synthesis error. Falling back to structured 10-slide template.");
    } finally {
      setGenerating(false);
    }
  };

  const handleExportHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${projectTitle} - 10 Slide Hackathon Presentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #050505; color: #fff; margin: 0; padding: 20px; }
    .slide { width: 960px; height: 540px; margin: 40px auto; background: #0e1322; border: 1px solid #23304a; border-radius: 16px; padding: 40px; box-sizing: border-box; page-break-after: always; position: relative; }
    .header { border-bottom: 1px solid #1f2c44; padding-bottom: 15px; margin-bottom: 25px; }
    .num { font-size: 12px; color: #3b82f6; font-family: monospace; letter-spacing: 2px; }
    h1 { font-size: 28px; margin: 8px 0; color: #fff; }
    h3 { font-size: 16px; color: #94a3b8; margin: 0; font-weight: normal; }
    ul { margin-top: 25px; line-height: 1.8; color: #cbd5e1; font-size: 17px; }
    .notes { margin-top: 30px; padding: 15px; background: rgba(0,0,0,0.4); border-radius: 8px; font-size: 13px; color: #94a3b8; font-family: monospace; border-left: 3px solid #3b82f6; }
    @media print { body { background: #fff; color: #000; padding: 0; } .slide { border: none; box-shadow: none; background: #fff; color: #000; width: 100%; height: 100vh; margin: 0; } h1, h3, ul, .notes { color: #000; } }
  </style>
</head>
<body>
  ${slides
    .map(
      (s) => `
    <div class="slide">
      <div class="header">
        <div class="num">SLIDE ${String(s.slideNumber).padStart(2, "0")} / 10 // ${s.timeSeconds}s PACING</div>
        <h1>${s.title}</h1>
        ${s.subtitle ? `<h3>${s.subtitle}</h3>` : ""}
      </div>
      <ul>
        ${s.points.map((p) => `<li>${p}</li>`).join("")}
      </ul>
      <div class="notes">
        <strong>SPEAKER NOTES:</strong> ${s.speakerNotes}
      </div>
    </div>
  `
    )
    .join("")}
  <script>window.print();</script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}_deck_10slides.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeSlide = slides[activeSlideIndex] || slides[0];

  return (
    <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 pb-24 pt-28">
      {/* Top Protocol Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-blue-400 font-bold tracking-wider">
              AI HACKATHON PRESENTATION COMPOSER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            {projectTitle}
          </h1>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <button
            onClick={handleGenerateDeck}
            disabled={generating}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 font-bold text-white transition disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{generating ? "SYNTHESIZING..." : "REGENERATE WITH AI"}</span>
          </button>

          <button
            onClick={handleExportHTML}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-gray-200 transition"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>PRINT / EXPORT HTML</span>
          </button>

          <button
            onClick={() => setShowPresentMode(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 font-bold transition"
          >
            <Presentation className="h-4 w-4" />
            <span>ENTER FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================ */}
        {/* COL 1: SLIDE NAVIGATOR (Left 3 cols)                          */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/90 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-mono mb-3">
              <span className="text-gray-400">SLIDE DECK</span>
              <span
                className={`font-bold ${
                  isOverTenSlides ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {slides.length} / 10 MAX
              </span>
            </div>

            {/* Slide thumbnail cards */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {slides.map((s, idx) => (
                <button
                  key={s.slideNumber || idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-full text-left rounded-xl p-3 border transition-all text-xs font-mono flex items-start gap-2.5 ${
                    activeSlideIndex === idx
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-md shadow-blue-500/10"
                      : "border-white/5 bg-black/40 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md font-bold text-[10px] ${
                      activeSlideIndex === idx
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-bold truncate text-white">
                      {s.title}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      ~{s.timeSeconds}s • {s.layoutType}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Ceiling status notice */}
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-gray-500 flex items-center justify-between">
              <span>VERSATHON RULE:</span>
              <span className="text-amber-400 font-bold">10-SLIDE STRICT</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COL 2: LIVE 16:9 SLIDE CANVAS (Center 6 cols)                 */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-4">
          {/* 16:9 Slide Canvas */}
          <div className="relative aspect-[16/9] w-full rounded-2xl border border-white/15 bg-gradient-to-br from-[#0E1424] to-[#070912] p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-blue-400 mb-2">
                <span>
                  SLIDE {String(activeSlide.slideNumber).padStart(2, "0")} /{" "}
                  {slides.length}
                </span>
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-gray-400 uppercase text-[10px]">
                  {activeSlide.layoutType}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {activeSlide.title}
              </h2>

              {activeSlide.subtitle && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Body Bullets */}
            <div className="my-auto space-y-2.5 py-4">
              {activeSlide.points.map((pt, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}

              {activeSlide.diagramDescription && (
                <div className="mt-3 rounded-lg border border-dashed border-blue-500/30 bg-blue-500/5 p-3 text-xs font-mono text-blue-300">
                  <div className="text-[10px] text-blue-400 mb-1 font-bold">
                    SYSTEM TOPOLOGY SCHEMATIC:
                  </div>
                  {activeSlide.diagramDescription}
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-gray-500">
              <span>{targetHackathon}</span>
              <span>PACING: ~{activeSlide.timeSeconds}s</span>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0A0D16]/90 p-3 text-xs font-mono">
            <button
              onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeSlideIndex === 0}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>PREVIOUS</span>
            </button>

            <span className="text-gray-400">
              SLIDE {activeSlideIndex + 1} OF {slides.length}
            </span>

            <button
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  Math.min(prev + 1, slides.length - 1)
                )
              }
              disabled={activeSlideIndex === slides.length - 1}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-30"
            >
              <span>NEXT</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Speaker Notes Drawer */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/90 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                VERBAL SCRIPT &amp; SPEAKER NOTES
              </span>
              <span className="text-emerald-400">
                ~{activeSlide.timeSeconds}s speaking pace
              </span>
            </div>
            <p className="text-xs font-mono text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
              &ldquo;{activeSlide.speakerNotes}&rdquo;
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* COL 3: COMPLIANCE & JURY AUDIT (Right 3 cols)                 */}
        {/* ============================================================ */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/90 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                COMPLIANCE AUDIT
              </h3>
            </div>

            {/* Pacing meter */}
            <div className="mb-5 rounded-xl border border-white/5 bg-black/40 p-3 text-xs font-mono">
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-400">PITCH DURATION:</span>
                <span className="text-white font-bold">
                  {pitchMinutes}:{String(pitchSeconds).padStart(2, "0")} / 5:00
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    totalPitchSeconds > 300 ? "bg-red-500" : "bg-emerald-400"
                  }`}
                  style={{
                    width: `${Math.min((totalPitchSeconds / 300) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs font-mono">
              {complianceNotice?.passedChecks.map((chk, i) => (
                <div key={i} className="flex items-start gap-2 text-emerald-400">
                  <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="leading-tight text-gray-300">{chk}</span>
                </div>
              ))}

              {complianceNotice?.violations.map((v, i) => (
                <div key={i} className="flex items-start gap-2 text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="leading-tight font-bold">{v}</span>
                </div>
              ))}

              {complianceNotice?.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="leading-tight text-gray-400">{w}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-gray-500">
              Audit criteria based on institutional hackathon judging standards.
            </div>
          </div>

          {/* Configuration Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/90 p-5 backdrop-blur-md text-xs font-mono space-y-3">
            <span className="text-gray-400 font-bold block">PROJECT DECK CONFIG</span>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">PROJECT TITLE</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">TARGET HACKATHON</label>
              <input
                type="text"
                value={targetHackathon}
                onChange={(e) => setTargetHackathon(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">TECH STACK</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-1">
              <label className="text-[11px] text-gray-500 block mb-1">PROBLEM SUMMARY</label>
              <textarea
                rows={2}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>

            <div className="pt-1">
              <label className="text-[11px] text-gray-500 block mb-1">PROPOSED SOLUTION</label>
              <textarea
                rows={2}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Presenter Modal */}
      {showPresentMode && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 sm:p-12 text-white">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-b border-white/10 pb-4">
            <span>
              HACKHUB PRESENTATION MODE // SLIDE {activeSlideIndex + 1} OF{" "}
              {slides.length}
            </span>
            <button
              onClick={() => setShowPresentMode(false)}
              className="text-gray-400 hover:text-white font-bold"
            >
              EXIT FULLSCREEN [ESC]
            </button>
          </div>

          <div className="max-w-4xl mx-auto my-auto text-center space-y-6">
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">
              {activeSlide.layoutType}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              {activeSlide.title}
            </h1>
            {activeSlide.subtitle && (
              <p className="text-xl text-gray-400 font-mono">
                {activeSlide.subtitle}
              </p>
            )}

            <div className="mt-8 text-left max-w-2xl mx-auto space-y-4">
              {activeSlide.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-3 text-lg text-gray-200">
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2.5" />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs">
            <button
              onClick={() => setActiveSlideIndex((p) => Math.max(p - 1, 0))}
              disabled={activeSlideIndex === 0}
              className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30"
            >
              ← PREVIOUS
            </button>
            <span className="text-gray-500">USE ARROW KEYS OR BUTTONS</span>
            <button
              onClick={() =>
                setActiveSlideIndex((p) => Math.min(p + 1, slides.length - 1))
              }
              disabled={activeSlideIndex === slides.length - 1}
              className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30"
            >
              NEXT →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PPTMakerPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />
      <Suspense
        fallback={
          <div className="py-32 text-center text-xs font-mono text-gray-500">
            INITIALIZING PPT STUDIO...
          </div>
        }
      >
        <PPTMakerContent />
      </Suspense>
    </main>
  );
}
