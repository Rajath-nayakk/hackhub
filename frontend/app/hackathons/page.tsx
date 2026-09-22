import HackathonList from "./HackathonList";
import { getHackathons } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default async function HackathonsPage() {
  const response = await getHackathons();
  const hackathons = response.data;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Header */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-36">
          <p className="text-sm font-medium text-blue-500">
            DISCOVER
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Find your next hackathon.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-400">
            Explore upcoming hackathons, competitions, and
            opportunities to build something amazing.
          </p>
        </div>
      </section>

      {/* Hackathon List + Search + Filters */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">
            Upcoming Hackathons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Discover opportunities that match your interests.
          </p>
        </div>

        <HackathonList hackathons={hackathons} />
      </section>
    </main>
  );
}