import { getHackathons } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const response = await getHackathons();
  const hackathons = response.data;

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* Navbar */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-40 text-center">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Discover. Build. Win.
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Your next
            <span className="text-blue-500"> hackathon </span>
            starts here.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 md:text-xl">
            Discover upcoming hackathons, learn from winning projects,
            find teammates, and turn your ideas into something real.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/hackathons"
              className="rounded-full bg-blue-600 px-7 py-3 font-medium transition hover:bg-blue-500"
            >
              Explore Hackathons →
            </a>

            <a
              href="/winners"
              className="rounded-full border border-white/15 px-7 py-3 font-medium transition hover:bg-white/10"
            >
              Explore Winners
            </a>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-xl grid-cols-3 border-t border-white/10 pt-8">

            <div>
              <p className="text-2xl font-bold">
                {hackathons.length}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Hackathons
              </p>
            </div>

            <div className="border-x border-white/10">
              <p className="text-2xl font-bold">
                Projects
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Learn
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold">
                Students
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Connect
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= HACKATHONS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mb-8 flex items-end justify-between">

          <div>
            <p className="text-sm font-medium text-blue-500">
              DON&apos;T MISS OUT
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Hackathons to watch
            </h2>
          </div>

          <a
            href="/hackathons"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            View all →
          </a>

        </div>


        {/* Real database data */}
        <div className="grid gap-5 md:grid-cols-3">

          {hackathons.map((hackathon: any) => (

            <div
              key={hackathon.id}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
            >

              {/* Card top */}
              <div className="flex items-start justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🚀
                </div>

                <span className="text-xs text-gray-500">
                  Deadline{" "}
                  {new Date(
                    hackathon.registration_deadline
                  ).toLocaleDateString("en-IN")}
                </span>

              </div>


              {/* Title */}
              <h3 className="mt-6 text-xl font-semibold">
                {hackathon.title}
              </h3>


              {/* Organizer */}
              <p className="mt-2 text-sm text-gray-500">
                By {hackathon.organizer}
              </p>


              {/* Location */}
              <p className="mt-2 text-sm text-gray-500">
                📍 {hackathon.location}
              </p>


              {/* Tags */}
              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                  {hackathon.difficulty}
                </span>

                {hackathon.is_online && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                    Online
                  </span>
                )}

                {!hackathon.is_online && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400">
                    Offline
                  </span>
                )}

              </div>


              {/* Prize */}
              <div className="mt-5">
                <p className="text-xs text-gray-500">
                  Prize Pool
                </p>

                <p className="mt-1 font-medium">
                  {hackathon.prize}
                </p>
              </div>


              {/* Button */}
              <a
                href={`/hackathons/${hackathon.id}`}
                className="mt-6 block w-full rounded-xl border border-white/10 py-2.5 text-center text-sm transition hover:bg-white hover:text-black"
              >
                View Hackathon →
              </a>

            </div>

          ))}

        </div>

      </section>


      {/* ================= WINNING PROJECTS ================= */}
      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-6 py-24">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-yellow-500">
              LEARN FROM THE BEST
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              What made them win?
            </h2>

            <p className="mt-4 text-gray-400">
              Explore previous winning projects, understand their ideas,
              technologies, impact, and what made them stand out to judges.
            </p>

            <a
              href="/winners"
              className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
            >
              Explore Winning Projects →
            </a>

          </div>

        </div>

      </section>


      {/* ================= TEAM FINDER ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-10 md:p-16">

          <p className="text-sm font-medium text-blue-400">
            BUILD TOGETHER
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Find the right team.
          </h2>

          <p className="mt-5 max-w-xl text-gray-400">
            Looking for an ML developer? A designer? A backend engineer?
            Find students with complementary skills and build your dream
            hackathon team.
          </p>

          <a
            href="/teams"
            className="mt-8 inline-block rounded-full bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
          >
            Find Teammates →
          </a>

        </div>

      </section>


      {/* ================= FOOTER CTA ================= */}
      <section className="border-t border-white/10 px-6 py-28 text-center">

        <h2 className="text-4xl font-bold md:text-6xl">
          Start building.
        </h2>

        <p className="mt-4 text-gray-400">
          Your next big idea could start at a hackathon.
        </p>

        <a
          href="/hackathons"
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-medium text-black transition hover:bg-gray-200"
        >
          Explore Hackathons →
        </a>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-600">
        © 2026 HackHub. Built for builders.
      </footer>

    </main>
  );
}