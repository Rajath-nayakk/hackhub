import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded h-4 my-1",
  };

  return (
    <div
      className={`relative overflow-hidden bg-white/[0.04] border border-white/5 ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
    >
      {/* Shimmer sweep animation */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
      />
    </div>
  );
}
