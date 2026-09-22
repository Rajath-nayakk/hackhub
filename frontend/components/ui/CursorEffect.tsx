"use client";

import { useEffect, useState } from "react";

export default function CursorEffect() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check touch device or reduced motion
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    requestAnimationFrame(() => {
      setIsTouchDevice(false);
    });

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPosition({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest("[data-cursor], a, button, input");

      if (interactiveEl) {
        setIsHovered(true);
        const customText = interactiveEl.getAttribute("data-cursor");
        setCursorText(customText || "");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const animateTrailing = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setTrailing({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(animateTrailing);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    animationFrameId = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300">
      {/* Precision Center Dot */}
      <div
        className="fixed -left-1 -top-1 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: "width 0.2s, height 0.2s",
        }}
      />

      {/* Trailing Physics Ring with Badge text */}
      <div
        className={`fixed -left-4 -top-4 flex items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/[0.04] backdrop-blur-[1px] transition-all duration-150 ${
          isHovered
            ? "h-14 w-14 border-blue-400/70 scale-110 shadow-[0_0_24px_rgba(59,130,246,0.3)]"
            : "h-8 w-8 scale-100"
        }`}
        style={{
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0)`,
        }}
      >
        {cursorText && (
          <span className="animate-fade-in text-[9px] font-mono font-bold tracking-wider text-blue-300">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
