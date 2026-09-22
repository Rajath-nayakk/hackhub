import HackathonList from "./HackathonList";
import { getHackathons } from "@/lib/api";
import Navbar from "@/components/Navbar";
import AnimatedGrid from "@/components/ui/AnimatedGrid";
import { Terminal } from "@/components/ui/Icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon Discovery Protocol | HackHub",
  description:
    "Explore upcoming verified engineering hackathons, tracks, and prize pools.",
};

export default async function HackathonsPage() {
  const response = await getHackathons();
  const hackathons = response.data || [];
  const source = response.source || "development-seed";

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden">
      <AnimatedGrid />
      <Navbar />

      {/* Hero Header */}
      <section className="relative z-10 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-36">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-mono text-blue-400 mb-6">
            <Terminal className="h-3.5 w-3.5" />
            <span>DISCOVERY PROTOCOL // VERIFIED OPPORTUNITIES</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl text-white">
            Find your next engineering challenge.
          </h1>

          <p className="mt-4 max-w-2xl text-base md:text-lg text-gray-400 font-sans leading-relaxed">
            Curated national and international hackathons with verified tracks,
            transparent timelines, and direct presentation export integrations.
          </p>
        </div>
      </section>

      {/* Main Hackathon List */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <HackathonList hackathons={hackathons} source={source} />
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-xs font-mono text-gray-600">
        HACKHUB DISCOVERY // ZERO FABRICATED LISTINGS // OPEN ENGINEERING STANDARD
      </footer>
    </main>
  );
}