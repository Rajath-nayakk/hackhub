"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setLoading(false);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();

    // Only logout redirects to home.
    window.location.href = "/";
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Hack<span className="text-blue-500">Hub</span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/hackathons"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Hackathons
          </Link>

          <Link
            href="/winners"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Winners
          </Link>

          <Link
            href="/teams"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Teams
          </Link>
        </div>

        {/* Authentication */}
        {!loading && (
          <>
            {!user ? (
              <Link
                href="/auth/login"
                className="rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white hover:text-black"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">

                {/* Profile */}
                <Link
                  href="/profile"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  {user.user_metadata?.name ||
                    user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "Profile"}
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:bg-red-500 hover:text-white"
                >
                  Logout
                </button>

              </div>
            )}
          </>
        )}

      </div>
    </nav>
  );
}