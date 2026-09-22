"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  dataCursor?: string;
}

export default function GlowButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  dataCursor,
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = buttonRef.current;
    if (!el || disabled) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowPos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs font-semibold rounded-lg",
    md: "px-6 py-2.5 text-sm font-semibold rounded-xl",
    lg: "px-8 py-3.5 text-base font-semibold rounded-2xl",
  };

  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25 border border-blue-400/30",
    secondary:
      "bg-white text-black hover:bg-gray-100 shadow-md border border-white/20",
    outline:
      "bg-white/[0.04] text-white hover:bg-white/[0.09] border border-white/15 hover:border-white/30 backdrop-blur-md",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white",
  };

  const baseClasses = `relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const innerContent = (
    <>
      {/* Dynamic Cursor Light Spot */}
      <span
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: glowPos.opacity,
          background: `radial-gradient(120px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255, 255, 255, 0.22), transparent 80%)`,
        }}
        aria-hidden="true"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={buttonRef as React.Ref<HTMLAnchorElement>}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        data-cursor={dataCursor}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={baseClasses}
      data-cursor={dataCursor}
    >
      {innerContent}
    </button>
  );
}
