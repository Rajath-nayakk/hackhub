import React from "react";

interface AnimatedGridProps {
  className?: string;
  withGlow?: boolean;
}

export default function AnimatedGrid({
  className = "",
  withGlow = true,
}: AnimatedGridProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Radial Glow Orbs */}
      {withGlow && (
        <>
          <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />
          <div className="absolute top-1/3 -right-24 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[120px]" />
          <div className="absolute bottom-10 left-10 h-[350px] w-[350px] rounded-full bg-cyan-500/8 blur-[100px]" />
        </>
      )}

      {/* Grid Pattern with Vignette */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
        }}
      />

      {/* Subtle Scanline shimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent opacity-40" />
    </div>
  );
}
