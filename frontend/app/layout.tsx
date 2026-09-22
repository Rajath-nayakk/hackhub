import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CursorEffect from "@/components/ui/CursorEffect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HackHub — Find Hackathons. Build Teams. Learn From Winners. Build Better.",
  description:
    "HackHub is a public engineering platform for students to discover hackathons, assemble complementary teams, analyze winning projects, and build with AI.",
  keywords: [
    "hackathons",
    "engineering students",
    "team building",
    "winning projects",
    "hackathon copilot",
    "AI PPT maker",
    "developer portfolio",
  ],
  authors: [{ name: "HackHub Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white selection:bg-blue-600 selection:text-white">
        <CursorEffect />
        {children}
      </body>
    </html>
  );
}
