"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Lock,
  Mail,
  UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Shield,
  Terminal,
  Check,
  AlertTriangle,
} from "@/components/ui/Icons";

const ENGINEERING_MESSAGES = [
  {
    tag: "VECTOR MATCH",
    text: "Synthesizing cross-functional squads across AI, full-stack, and systems architectures.",
  },
  {
    tag: "LIVE PROTOCOL",
    text: "Indexing verified hackathon tracks, evaluation rubrics, and submission windows in real time.",
  },
  {
    tag: "PROJECT LAB",
    text: "Transforming raw engineering hunches into structured architectures, MVP scopes, and pitch decks.",
  },
  {
    tag: "SHOWCASE",
    text: "Zero fabricated metrics. Proven repository code, peer endorsements, and real competition records.",
  },
];

interface AuthConsoleProps {
  initialMode?: "login" | "signup";
}

export default function AuthConsole({ initialMode = "login" }: AuthConsoleProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusNotice, setStatusNotice] = useState("");
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  // Canvas ref for interactive left-side node network
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Rotating telemetry message
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % ENGINEERING_MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Left-canvas interactive node network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes
    const nodeCount = 38;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.6 + 0.3,
      });
    }

    let mouseX = -999;
    let mouseY = -999;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseX = -999;
      mouseY = -999;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw cursor connections
      if (mouseX > 0 && mouseY > 0) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = nodes[i].x - mouseX;
          const dy = nodes[i].y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.55;
            ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(nodes[i].x, nodes[i].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.fillStyle = `rgba(147, 197, 253, ${n.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusNotice("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          setAuthSuccess(true);
          setTimeout(() => {
            router.push("/profile");
            router.refresh();
          }, 1200);
        } else {
          setStatusNotice(
            "Account provisioned. Please check your inbox if email confirmation is required."
          );
          setLoading(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        setAuthSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      }
    } catch (err: unknown) {
      console.error("Auth error:", err);
      const message =
        err instanceof Error ? err.message : "Authentication attempt failed.";

      if (
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("networkerror") ||
        message.toLowerCase().includes("getaddrinfo")
      ) {
        setErrorMessage(
          "Supabase remote authentication service is currently unreachable from this environment. Check network connection or Supabase URL configuration."
        );
      } else {
        setErrorMessage(message);
      }
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050505] p-4 md:p-8 overflow-hidden text-white font-sans selection:bg-blue-500/30">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0A0D14]/90 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* ============================================================ */}
        {/* LEFT: IMMERSIVE VISUAL CANVAS & TERMINAL TELEMETRY            */}
        {/* ============================================================ */}
        <div className="relative hidden lg:flex lg:col-span-6 flex-col justify-between p-10 border-r border-white/10 bg-gradient-to-b from-[#0B0F19] to-[#06090F] overflow-hidden">
          {/* Interactive node canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-crosshair z-0"
          />

          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06090F] via-transparent to-transparent pointer-events-none z-10" />

          {/* Top Brand Bar */}
          <div className="relative z-20 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-inner group-hover:scale-105 transition-transform">
                <Terminal className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  Hack<span className="text-blue-500">Hub</span>
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                  ENGINEERING PROTOCOL
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ACTIVE
            </span>
          </div>

          {/* Centerpiece: Engineering Identity Badge */}
          <div className="relative z-20 my-auto py-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-mono text-blue-300 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE BUILDER&apos;S OS</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Where serious student engineers assemble, build, and ship.
            </h2>

            <p className="mt-4 text-sm text-gray-400 leading-relaxed font-sans max-w-md">
              A high-precision ecosystem engineered to bypass student hackathon
              chaos. Build with complementary teammates, stress-test ideas with
              AI, and publish verified project histories.
            </p>

            {/* Rotating Telemetry Card */}
            <div className="mt-8 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md p-4 transition-all duration-500">
              <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 mb-1.5">
                <span className="flex items-center gap-1.5 font-bold tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  {ENGINEERING_MESSAGES[activeMessageIndex].tag}
                </span>
                <span className="text-gray-500">
                  0{activeMessageIndex + 1} / 0{ENGINEERING_MESSAGES.length}
                </span>
              </div>
              <p className="text-xs text-gray-300 font-mono leading-relaxed min-h-[36px]">
                {ENGINEERING_MESSAGES[activeMessageIndex].text}
              </p>
            </div>
          </div>

          {/* Bottom Security / Environment Telemetry */}
          <div className="relative z-20 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              <span>TLS 1.3 / AES-256 SESSION</span>
            </div>
            <span>v2.4.0-ENG</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: AUTHENTICATION PANEL                                  */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-12 relative bg-[#090C15]/70">
          {/* Top Switcher */}
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage("");
                  setStatusNotice("");
                }}
                className={`rounded-md px-3.5 py-1.5 text-xs font-mono font-medium transition ${
                  mode === "login"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage("");
                  setStatusNotice("");
                }}
                className={`rounded-md px-3.5 py-1.5 text-xs font-mono font-medium transition ${
                  mode === "signup"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>

            <Link
              href="/"
              className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
            >
              EXIT TO ROOT →
            </Link>
          </div>

          {/* Core Form Area */}
          <div className="my-auto">
            {authSuccess ? (
              /* Success Loading State */
              <div className="py-12 text-center animate-fade-in">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <Check className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white font-mono">
                  IDENTITY AUTHENTICATED
                </h3>
                <p className="mt-2 text-sm text-gray-400 font-mono">
                  Initializing engineer environment &amp; workspace telemetry...
                </p>
                <div className="mt-6 mx-auto max-w-xs h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-pulse w-full rounded-full" />
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {mode === "login"
                      ? "Authenticate Session"
                      : "Initialize Engineer Profile"}
                  </h1>
                  <p className="mt-2 text-sm text-gray-400">
                    {mode === "login"
                      ? "Enter your verified credentials to enter the HackHub workspace."
                      : "Create your student developer credentials to join teams and showcase builds."}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {/* Full Name for Signup */}
                  {mode === "signup" && (
                    <div>
                      <label className="block text-xs font-mono text-gray-400 mb-1.5">
                        FULL NAME
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Rajath Nayak"
                          className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">
                      COLLEGE / DEVELOPER EMAIL
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono text-gray-400">
                        ACCESS TOKEN / PASSWORD
                      </label>
                      {mode === "login" && (
                        <span className="text-[11px] font-mono text-gray-500">
                          Min 6 chars
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-11 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 flex items-start gap-2.5 text-xs text-red-300 font-mono">
                      <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">AUTHENTICATION REJECTED</div>
                        <div className="mt-0.5 text-red-400/90 leading-relaxed">
                          {errorMessage}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Notice */}
                  {statusNotice && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 flex items-start gap-2.5 text-xs text-emerald-300 font-mono">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>{statusNotice}</div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group w-full mt-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-px font-semibold text-white transition hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative flex items-center justify-center gap-2 rounded-[11px] bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 font-mono text-sm tracking-wide transition group-hover:bg-opacity-90">
                      {loading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>SYNCHRONIZING CREDENTIALS...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {mode === "login"
                              ? "AUTHORIZE ACCESS"
                              : "ESTABLISH PROFILE"}
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                  </button>
                </form>

                {/* Alternate footer */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 font-mono">
                    {mode === "login" ? (
                      <>
                        Need a developer profile?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("signup");
                            setErrorMessage("");
                            setStatusNotice("");
                          }}
                          className="text-blue-400 hover:text-blue-300 underline font-medium"
                        >
                          Register now
                        </button>
                      </>
                    ) : (
                      <>
                        Already established?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setErrorMessage("");
                            setStatusNotice("");
                          }}
                          className="text-blue-400 hover:text-blue-300 underline font-medium"
                        >
                          Authorize existing session
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-white/5 text-center">
            <span className="text-[11px] font-mono text-gray-600">
              Protected by HackHub Real-Time Engineering Engine
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
