import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "subtle" | "glow" | "elevated";
  hoverEffect?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  variant = "default",
  hoverEffect = false,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default: "bg-[#0B0B0B]/80 border-white/10 shadow-xl shadow-black/50",
    subtle: "bg-white/[0.02] border-white/5",
    glow: "bg-gradient-to-b from-blue-500/[0.05] via-[#0B0B0B]/80 to-[#070707] border-blue-500/20 shadow-2xl shadow-blue-500/5",
    elevated: "bg-[#101010]/90 border-white/15 shadow-2xl shadow-black/80",
  };

  const hoverStyles = hoverEffect
    ? "transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-blue-500/10"
    : "";

  return (
    <div
      className={`relative rounded-2xl border backdrop-blur-xl ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {/* Subtle top specular rim highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
