"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Sparkles, Terminal, Trophy, Users, Presentation, LayoutDashboard } from "@/components/ui/Icons";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (mounted) {
          setUser(user);
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
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
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { label: "Hackathons", href: "/hackathons", icon: Terminal },
    { label: "Winners", href: "/winners", icon: Trophy },
    { label: "TeamMatch", href: "/teams", icon: Users },
    { label: "Project Lab", href: "/ai", icon: Sparkles },
    { label: "AI PPT Maker", href: "/ppt-maker", icon: Presentation, badge: "NEW" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#050505]/75 backdrop-blur-2xl">
      {/* Top subtle ambient glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
            <span className="font-mono text-sm font-black">H</span>
          </div>
          <span>
            Hack<span className="text-blue-500">Hub</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-1 lg:gap-2 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "text-blue-400" : "text-gray-400"} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-full bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.5 text-[9px] font-bold text-blue-300">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Authentication & User Controls */}
        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold transition ${
                      pathname === "/dashboard"
                        ? "bg-blue-600 text-white"
                        : "bg-white/[0.04] text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <LayoutDashboard size={14} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {user.user_metadata?.name ||
                      user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "Profile"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}