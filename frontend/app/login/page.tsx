"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // =========================
      // SIGN UP
      // =========================

      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        console.log("SIGNUP USER:", data.user);
        console.log("SIGNUP SESSION:", data.session);

        if (data.session) {
          window.location.href = "/profile";
        } else {
          setMessage(
            "Account created! Please check your email and confirm your account."
          );
        }

        return;
      }

      // =========================
      // LOGIN
      // =========================

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMessage(error.message);
        return;
      }

      console.log("LOGIN USER:", data.user);
      console.log("LOGIN SESSION:", data.session);

      if (!data.session) {
        setMessage(
          "Login succeeded, but no session was created."
        );
        return;
      }

      console.log("LOGIN SUCCESS - REDIRECTING TO PROFILE");

      window.location.href = "/profile";
    } catch (error) {
      console.error("Authentication error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <p className="text-blue-400 font-semibold tracking-wider text-sm">
            HACKHUB
          </p>

          <h1 className="text-4xl font-bold mt-3">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>

          <p className="text-gray-400 mt-3">
            {isSignup
              ? "Join HackHub and find your perfect hackathon team."
              : "Login to continue to your HackHub profile."}
          </p>

        </div>

        {/* Card */}
        <div className="bg-[#101010] border border-white/10 rounded-2xl p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            {isSignup && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rajath Nayak"
                  required
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Login"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-center text-gray-300">
              {message}
            </div>
          )}

          {/* Switch */}
          <div className="text-center mt-6">

            <p className="text-sm text-gray-400">
              {isSignup
                ? "Already have an account?"
                : "Don't have a HackHub account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage("");
              }}
              className="mt-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              {isSignup
                ? "Login instead"
                : "Create an account"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}