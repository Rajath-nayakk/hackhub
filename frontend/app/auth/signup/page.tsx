"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Account created successfully! Check your email if confirmation is required."
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/auth/login");
      router.refresh();
    }, 2000);
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
            Create your account and start discovering hackathons.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">

          <h1 className="text-2xl font-bold">
            Create account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join HackHub and find your next opportunity.
          </p>

          <form
            onSubmit={handleSignup}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rajath Nayak"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
              />
            </div>

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
                placeholder="Minimum 6 characters"
                minLength={6}
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

            {/* Success */}
            {message && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {message}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Sign in
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