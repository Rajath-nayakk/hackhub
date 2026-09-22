"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/hackathons");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-white">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="text-3xl font-bold tracking-tight"
          >
            Hack<span className="text-blue-500">Hub</span>
          </Link>

          <p className="mt-3 text-gray-400">
            Welcome back. Continue your hackathon journey.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

          <h1 className="text-2xl font-bold">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your credentials to access your account.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Create one
            </Link>
          </p>

        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-white"
          >
            ← Back to HackHub
          </Link>
        </div>

      </div>
    </main>
  );
}