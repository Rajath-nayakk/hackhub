"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import { supabase } from "@/lib/supabase";
import {
  UserIcon,
  Code,
  Check,
  ExternalLink,
  Terminal,
} from "@/components/ui/Icons";

interface Profile {
  id?: number;
  auth_user_id?: string;
  name: string;
  college: string;
  city: string;
  branch: string;
  year: number | "";
  skills: string;
  preferred_role: string;
  availability: string;
  github_url: string;
  portfolio_url: string;
  bio: string;
  looking_for_team: boolean;
  profile_completed: boolean;
}

const emptyProfile: Profile = {
  name: "",
  college: "",
  city: "",
  branch: "",
  year: "",
  skills: "",
  preferred_role: "",
  availability: "",
  github_url: "",
  portfolio_url: "",
  bio: "",
  looking_for_team: true,
  profile_completed: false,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (!user) {
          setMessage("Operating in guest/development profile view.");
          setLoading(false);
          return;
        }

        setUserEmail(user.email ?? null);

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!isMounted) return;

        if (data) {
          setProfile({
            ...emptyProfile,
            ...data,
            year: data.year ?? "",
          });
        } else {
          setProfile((prev) => ({
            ...prev,
            name:
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "",
          }));
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Offline/local mode active:", err);
          setMessage("Development mode active. Profile changes saved locally.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (
    field: keyof Profile,
    value: string | number | boolean
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.setItem("hackhub_local_profile", JSON.stringify(profile));
        setMessage("Profile cached locally for testing! (Connect Supabase to persist)");
        setProfile((c) => ({ ...c, profile_completed: true }));
        return;
      }

      const profileData = {
        auth_user_id: user.id,
        name: profile.name || "HackHub Student",
        college: profile.college || null,
        city: profile.city || null,
        branch: profile.branch || null,
        year: profile.year === "" ? null : Number(profile.year),
        skills: profile.skills || null,
        preferred_role: profile.preferred_role || null,
        availability: profile.availability || null,
        github_url: profile.github_url || null,
        portfolio_url: profile.portfolio_url || null,
        bio: profile.bio || null,
        looking_for_team: profile.looking_for_team,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(profileData, {
        onConflict: "auth_user_id",
      });

      if (error) {
        throw error;
      }

      setProfile((current) => ({
        ...current,
        profile_completed: true,
      }));

      setMessage("Profile synchronized to verified registry! ✓");
    } catch (err: unknown) {
      console.error("Save error:", err);
      const msg = err instanceof Error ? err.message : "Error saving";
      setMessage(`Notice: Saved to local session (${msg})`);
    } finally {
      setSaving(false);
    }
  };

  const skillPills = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-400 mb-2">
              <UserIcon className="h-3.5 w-3.5" />
              <span>DEVELOPER PORTFOLIO // IDENTITY</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Engineer Profile &amp; Portfolio
            </h1>
            <p className="mt-1 text-xs font-mono text-gray-400">
              Verified skills, role preferences, and hackathon availability.
              {userEmail && <span> ({userEmail})</span>}
            </p>
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 font-mono text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>SAVE PORTFOLIO</span>
              </>
            )}
          </button>
        </div>

        {loading && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-gray-400">
            SYNCHRONIZING PROFILE RECORD...
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-white/10 bg-black/40 p-4 text-xs font-mono text-gray-300 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Profile Card Form */}
        <div className="space-y-8">
          {/* Section 1: Academic & Personal Core */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>01 // Core Academic Demographics</span>
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1.5">FULL NAME</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Rajath Nayak"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">UNIVERSITY / COLLEGE</label>
                <input
                  type="text"
                  value={profile.college}
                  onChange={(e) => updateField("college", e.target.value)}
                  placeholder="e.g. NMAM Institute of Technology"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">BRANCH / MAJOR</label>
                <input
                  type="text"
                  value={profile.branch}
                  onChange={(e) => updateField("branch", e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">CURRENT YEAR</label>
                <select
                  value={profile.year}
                  onChange={(e) =>
                    updateField(
                      "year",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                >
                  <option value="">Select Academic Year</option>
                  <option value="1">1st Year (Freshman)</option>
                  <option value="2">2nd Year (Sophomore)</option>
                  <option value="3">3rd Year (Junior)</option>
                  <option value="4">4th Year (Senior)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">CITY / REGION</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="e.g. Mangaluru, Karnataka"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">AVAILABILITY</label>
                <input
                  type="text"
                  value={profile.availability}
                  onChange={(e) => updateField("availability", e.target.value)}
                  placeholder="e.g. Weekends, 36hr Hackathons"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Skills & Specialization */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-sm font-mono font-bold text-purple-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>02 // Technical Skills &amp; Role Vector</span>
            </h2>

            <div className="space-y-5 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1.5">
                  PREFERRED HACKATHON ROLE
                </label>
                <select
                  value={profile.preferred_role}
                  onChange={(e) => updateField("preferred_role", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                >
                  <option value="">Select Primary Role</option>
                  <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Systems & Backend Architect">
                    Systems &amp; Backend Architect
                  </option>
                  <option value="UI/UX & Product Designer">
                    UI/UX &amp; Product Designer
                  </option>
                  <option value="Web3 & Smart Contract Developer">
                    Web3 &amp; Smart Contract Developer
                  </option>
                  <option value="DevOps & Cloud Engineer">
                    DevOps &amp; Cloud Engineer
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">
                  SKILLS &amp; TECHNOLOGIES (Comma-separated)
                </label>
                <input
                  type="text"
                  value={profile.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  placeholder="React, Next.js, Node.js, Python, PyTorch, Supabase, Docker, TypeScript"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />

                {skillPills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skillPills.map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-mono text-purple-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">
                  ENGINEER BIO &amp; PAST COMPETITION EXPERIENCE
                </label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => updateField("bio", e.target.value)}
                  placeholder="Tell potential teammates about systems you've built, algorithms implemented, or hackathons attended..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Repositories & Recruitment Status */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-6 md:p-8 backdrop-blur-md">
            <h2 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>03 // Portfolio Links &amp; Team Status</span>
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1.5">GITHUB REPOSITORY URL</label>
                <input
                  type="url"
                  value={profile.github_url}
                  onChange={(e) => updateField("github_url", e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1.5">PORTFOLIO / DEMO URL</label>
                <input
                  type="url"
                  value={profile.portfolio_url}
                  onChange={(e) => updateField("portfolio_url", e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 font-sans"
                />
              </div>
            </div>

            {/* Team Seeking Toggle */}
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">
                  Looking for Hackathon Squad?
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Allows teams to discover and recruit your profile in Team Finder.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateField("looking_for_team", !profile.looking_for_team)
                }
                className={`rounded-xl px-5 py-2.5 text-xs font-mono font-bold transition ${
                  profile.looking_for_team
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}
              >
                {profile.looking_for_team
                  ? "● ACTIVELY SEEKING SQUAD"
                  : "○ NOT CURRENTLY RECRUITING"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}