import { getHackathonById } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface HackathonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HackathonDetails({
  params,
}: HackathonPageProps) {
  const { id } = await params;

  const response = await getHackathonById(id);
  const hackathon = response.data;

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-36">

        {/* Back button */}
        <a
          href="/hackathons"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
        >
          ← Back to Hackathons
        </a>


        {/* Hero */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12">

          {/* Top section */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

            <div className="max-w-3xl">

              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                🚀
              </div>


              {/* Title */}
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                {hackathon.title}
              </h1>


              {/* Organizer */}
              <p className="mt-4 text-gray-400">
                Organized by{" "}
                <span className="font-medium text-white">
                  {hackathon.organizer}
                </span>
              </p>


              {/* Description */}
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                {hackathon.description}
              </p>

            </div>


            {/* Registration button */}
            <div className="shrink-0">

              <a
                href={hackathon.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-blue-600 px-7 py-3 text-center font-medium transition hover:bg-blue-500"
              >
                Register Now →
              </a>

            </div>

          </div>


          {/* Details grid */}
          <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">

            {/* Location */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm text-gray-500">
                Location
              </p>

              <p className="mt-2 font-medium">
                📍 {hackathon.location}
              </p>

            </div>


            {/* Format */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm text-gray-500">
                Format
              </p>

              <p className="mt-2 font-medium">
                {hackathon.is_online ? "🌐 Online" : "🏢 Offline"}
              </p>

            </div>


            {/* Difficulty */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm text-gray-500">
                Difficulty
              </p>

              <p className="mt-2 font-medium">
                🎯 {hackathon.difficulty}
              </p>

            </div>


            {/* Prize */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

              <p className="text-sm text-gray-500">
                Prize Pool
              </p>

              <p className="mt-2 font-medium">
                💰 {hackathon.prize || "Not specified"}
              </p>

            </div>

          </div>

        </div>


        {/* Information Section */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* About */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:col-span-2">

            <p className="text-sm font-medium text-blue-500">
              ABOUT
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              About this hackathon
            </h2>

            <p className="mt-5 leading-8 text-gray-400">
              {hackathon.description}
            </p>

          </div>


          {/* Team */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">

            <p className="text-sm font-medium text-purple-400">
              TEAM
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Team Size
            </h2>

            <div className="mt-6">

              <p className="text-4xl font-bold">
                {hackathon.team_min}–{hackathon.team_max}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                members per team
              </p>

            </div>

          </div>

        </div>


        {/* Dates */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">

          <p className="text-sm font-medium text-yellow-500">
            IMPORTANT DATES
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Mark your calendar
          </h2>


          <div className="mt-8 grid gap-5 md:grid-cols-3">

            {/* Registration Deadline */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

              <p className="text-sm text-gray-500">
                Registration Deadline
              </p>

              <p className="mt-3 text-xl font-semibold">
                {new Date(
                  hackathon.registration_deadline
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

            </div>


            {/* Start */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

              <p className="text-sm text-gray-500">
                Event Starts
              </p>

              <p className="mt-3 text-xl font-semibold">
                {new Date(
                  hackathon.event_start
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

            </div>


            {/* End */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">

              <p className="text-sm text-gray-500">
                Event Ends
              </p>

              <p className="mt-3 text-xl font-semibold">
                {new Date(
                  hackathon.event_end
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

            </div>

          </div>

        </div>


        {/* Official Website */}
        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:flex-row md:items-center">

          <div>

            <p className="text-sm text-gray-500">
              Want to know more?
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Visit the official hackathon website
            </h2>

          </div>


          <a
            href={hackathon.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
          >
            Official Website ↗
          </a>

        </div>


        {/* Final CTA */}
        <div className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/[0.06] p-10 text-center md:p-16">

          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to build something?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Gather your team, build your idea, and take your shot at
            winning this hackathon.
          </p>

          <a
            href={hackathon.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-3 font-medium transition hover:bg-blue-500"
          >
            Register for Hackathon →
          </a>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-600">
        © 2026 HackHub. Built for builders.
      </footer>

    </main>
  );
}