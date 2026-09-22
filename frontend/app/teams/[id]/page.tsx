import Link from "next/link";
import Navbar from "@/components/Navbar";

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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

export default async function TeamDetails({
  params,
}: TeamPageProps) {
  const { id } = await params;

  let team: Team;

  try {
    team = await getTeam(id);
  } catch {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <Navbar />

        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="text-6xl">🔍</div>

          <h1 className="mt-6 text-3xl font-bold">
            Team Not Found
          </h1>

          <p className="mt-3 text-gray-400">
            This team doesn't exist or is no longer available.
          </p>

          <Link
            href="/teams"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            ← Back to Teams
          </Link>
        </div>
      </main>
    );
  }

  const members = team.team_members || [];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="mx-auto max-w-5xl px-6 py-10">

        <Link
          href="/teams"
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to Team Finder
        </Link>

        {/* Hero */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-blue-500/5 p-8 md:p-12">

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-400">
              ● {team.status === "open" ? "Open for members" : "Closed"}
            </span>

            {team.hackathons?.title && (
              <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">
                🏆 {team.hackathons.title}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-bold md:text-5xl">
            {team.name}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-400">
            {team.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs text-gray-500">
                TEAM CAPACITY
              </p>

              <p className="mt-1 text-xl font-bold">
                {members.length} / {team.max_members}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs text-gray-500">
                SPOTS LEFT
              </p>

              <p className="mt-1 text-xl font-bold">
                {Math.max(team.max_members - members.length, 0)}
              </p>
            </div>

          </div>
        </section>

        {/* Content */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">

          {/* Members */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:col-span-2">

            <h2 className="text-2xl font-bold">
              Team Members
            </h2>

            {members.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-white/10 p-8 text-center">
                <div className="text-4xl">👤</div>

                <p className="mt-3 text-gray-400">
                  No members have joined yet.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                      👤
                    </div>

                    <div>
                      <p className="font-semibold">
                        User #{member.user_id}
                      </p>

                      {member.role && (
                        <p className="text-sm text-purple-300">
                          {member.role}
                        </p>
                      )}

                      {member.skills && (
                        <p className="mt-1 text-sm text-gray-500">
                          {member.skills}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

          {/* Join */}
          <aside className="h-fit rounded-2xl border border-purple-400/20 bg-purple-400/[0.05] p-7">

            <div className="text-4xl">🤝</div>

            <h2 className="mt-5 text-2xl font-bold">
              Join this team
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Think you can contribute? Join the team and
              start building something great.
            </p>

            {team.status === "open" &&
            members.length < team.max_members ? (
              <Link
                href={`/teams/${team.id}/join`}
                className="mt-6 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-black transition hover:bg-gray-200"
              >
                Join Team →
              </Link>
            ) : (
              <div className="mt-6 rounded-xl bg-white/10 px-5 py-3 text-center font-semibold text-gray-500">
                Team Full
              </div>
            )}

          </aside>
        </div>

      </div>
    </main>
  );
}