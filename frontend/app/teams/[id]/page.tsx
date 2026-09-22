import Link from "next/link";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import { Users, ArrowLeft, Trophy, ArrowRight } from "@/components/ui/Icons";
import { Metadata } from "next";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

interface TeamMember {
  id: number;
  user_id: number;
  role?: string;
  skills?: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  max_members: number;
  status: string;
  hackathons?: {
    id: number;
    title: string;
  };
  team_members?: TeamMember[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getTeam(id: string): Promise<Team> {
  const response = await fetch(`${API_URL}/api/teams/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Team not found");
  }

  const result = await response.json();
  return result.data;
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const team = await getTeam(id);
    return {
      title: `${team.name} | HackHub Squad`,
      description: team.description,
    };
  } catch {
    return { title: "Squad Details | HackHub" };
  }
}

export default async function TeamDetails({ params }: TeamPageProps) {
  const { id } = await params;

  let team: Team;

  try {
    team = await getTeam(id);
  } catch {
    return (
      <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-32 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold font-mono">SQUAD NOT FOUND</h1>
          <p className="mt-2 text-sm text-gray-400">
            This squad does not exist, has been disbanded, or is unavailable in the database.
          </p>
          <Link
            href="/teams"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-mono font-bold text-white hover:bg-blue-500 transition"
          >
            ← BACK TO SQUAD DIRECTORY
          </Link>
        </div>
      </main>
    );
  }

  const members = team.team_members || [];

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden font-sans">
      <AnimatedGrid />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-32">
        <Link
          href="/teams"
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO SQUAD FINDER</span>
        </Link>

        {/* Hero Card */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0E1324]/90 to-[#070A12]/95 p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-bold text-emerald-400">
              ● {team.status === "open" ? "OPEN FOR MEMBERS" : "SQUAD SEALED"}
            </span>

            {team.hackathons?.title && (
              <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-mono text-purple-300 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5" />
                <span>{team.hackathons.title}</span>
              </span>
            )}
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {team.name}
          </h1>

          <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-gray-300 font-sans">
            {team.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs">
            <div className="rounded-xl border border-white/10 bg-black/40 px-5 py-3">
              <span className="text-gray-500 block">ENROLLED MEMBERS</span>
              <span className="mt-1 text-lg font-bold text-white block">
                {members.length} / {team.max_members}
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/40 px-5 py-3">
              <span className="text-gray-500 block">OPEN SEATS</span>
              <span className="mt-1 text-lg font-bold text-emerald-400 block">
                {Math.max(team.max_members - members.length, 0)} SEATS
              </span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Members Column */}
          <section className="rounded-2xl border border-white/10 bg-[#0A0D16]/80 p-7 md:col-span-2 backdrop-blur-md">
            <h2 className="text-xl font-bold font-mono text-white mb-6">
              Enrolled Engineers
            </h2>

            {members.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-xs font-mono text-gray-500">
                  No squad members enrolled yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 font-mono text-sm font-bold">
                      #{member.user_id}
                    </div>

                    <div>
                      <p className="font-bold text-sm text-white font-mono">
                        Developer #{member.user_id}
                      </p>

                      {member.role && (
                        <p className="text-xs text-purple-300 font-mono">
                          {member.role}
                        </p>
                      )}

                      {member.skills && (
                        <p className="mt-1 text-xs text-gray-500 font-mono">
                          {member.skills}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Join Sidebar */}
          <aside className="h-fit rounded-2xl border border-blue-500/30 bg-blue-500/[0.04] p-7 backdrop-blur-md">
            <span className="text-xs font-mono text-blue-400 block mb-1">
              RECRUITMENT
            </span>
            <h3 className="text-xl font-bold text-white">Join Squad</h3>

            <p className="mt-3 text-xs leading-relaxed text-gray-400 font-sans">
              Have complementary skills in AI, full-stack, or systems architecture?
              Request an invitation to join this squad.
            </p>

            {team.status === "open" && members.length < team.max_members ? (
              <Link
                href={`/teams/${team.id}/join`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-center text-xs font-mono font-bold text-white transition shadow-lg shadow-blue-600/20"
              >
                <span>REQUEST MEMBERSHIP</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-xs font-mono font-semibold text-gray-500">
                SQUAD CAPACITY REACHED
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}