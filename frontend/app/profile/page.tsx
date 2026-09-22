"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profile loading error:", error);
        setMessage(error.message);
      } else if (data) {
        setProfile({
          ...emptyProfile,
          ...data,
          year: data.year ?? "",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof Profile,
    value: string | number | boolean
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Please login first.");
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

      const { error } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "auth_user_id",
        });

      if (error) {
        console.error("Profile save error:", error);
        setMessage(`Failed to save profile: ${error.message}`);
        return;
      }

      setProfile((current) => ({
        ...current,
        profile_completed: true,
      }));

      setMessage("Profile saved successfully 🚀");
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10">
          <p className="text-sm text-blue-400 font-medium">
            HACKHUB PROFILE
          </p>

          <h1 className="text-4xl font-bold mt-2">
            Build your student profile
          </h1>

          <p className="text-gray-400 mt-3">
            Let other students know your skills and find the right hackathon
            teammates.
          </p>
        </div>

        <div className="bg-[#101010] border border-white/10 rounded-2xl p-8 space-y-8">

          {/* Basic Information */}
          <section>
            <h2 className="text-xl font-semibold mb-5">
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <Input
                label="Name"
                value={profile.name}
                onChange={(value) => updateField("name", value)}
                placeholder="Your name"
              />

              <Input
                label="College"
                value={profile.college}
                onChange={(value) => updateField("college", value)}
                placeholder="Your college"
              />

              <Input
                label="City"
                value={profile.city}
                onChange={(value) => updateField("city", value)}
                placeholder="Mangaluru"
              />

              <Input
                label="Branch"
                value={profile.branch}
                onChange={(value) => updateField("branch", value)}
                placeholder="CSE"
              />

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Year
                </label>

                <select
                  value={profile.year}
                  onChange={(e) =>
                    updateField(
                      "year",
                      e.target.value === ""
                        ? ""
                        : Number(e.target.value)
                    )
                  }
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-5">
              Skills & Role
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <Input
                label="Skills"
                value={profile.skills}
                onChange={(value) => updateField("skills", value)}
                placeholder="React, Node.js, Python, AI"
              />

              <Input
                label="Preferred Role"
                value={profile.preferred_role}
                onChange={(value) =>
                  updateField("preferred_role", value)
                }
                placeholder="Full Stack Developer"
              />

              <Input
                label="Availability"
                value={profile.availability}
                onChange={(value) =>
                  updateField("availability", value)
                }
                placeholder="Weekends / Evenings"
              />

            </div>
          </section>

          {/* About */}
          <section>
            <h2 className="text-xl font-semibold mb-5">
              About You
            </h2>

            <textarea
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell other students about yourself..."
              rows={4}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none resize-none"
            />
          </section>

          {/* Links */}
          <section>
            <h2 className="text-xl font-semibold mb-5">
              Links
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <Input
                label="GitHub URL"
                value={profile.github_url}
                onChange={(value) =>
                  updateField("github_url", value)
                }
                placeholder="https://github.com/username"
              />

              <Input
                label="Portfolio URL"
                value={profile.portfolio_url}
                onChange={(value) =>
                  updateField("portfolio_url", value)
                }
                placeholder="https://yourportfolio.com"
              />

            </div>
          </section>

          {/* Team Preference */}
          <section className="border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between gap-5">

              <div>
                <h3 className="font-semibold">
                  Looking for a hackathon team?
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Allow other students to discover you in Team Finder.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "looking_for_team",
                    !profile.looking_for_team
                  )
                }
                className={`px-5 py-2 rounded-full text-sm font-medium ${
                  profile.looking_for_team
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {profile.looking_for_team
                  ? "Looking for team"
                  : "Not looking"}
              </button>

            </div>
          </section>

          {/* Save */}
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>

          {message && (
            <p className="text-center text-sm text-gray-300">
              {message}
            </p>
          )}

        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/30"
      />
    </div>
  );
}