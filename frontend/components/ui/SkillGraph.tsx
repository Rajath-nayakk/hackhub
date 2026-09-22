"use client";

import { useState } from "react";

interface Node {
  id: string;
  label: string;
  category: "core" | "frontend" | "backend" | "ai" | "data" | "design";
  x: number;
  y: number;
  connections: string[];
}

const defaultNodes: Node[] = [
  { id: "you", label: "YOU (Builder)", category: "core", x: 50, y: 50, connections: ["react", "node", "ai", "postgres", "design"] },
  { id: "react", label: "React / Next.js", category: "frontend", x: 20, y: 30, connections: ["you", "design"] },
  { id: "node", label: "Node / Express", category: "backend", x: 80, y: 30, connections: ["you", "postgres"] },
  { id: "ai", label: "Gemini / AI / ML", category: "ai", x: 50, y: 15, connections: ["you", "node"] },
  { id: "postgres", label: "PostgreSQL / DB", category: "data", x: 80, y: 75, connections: ["you", "node"] },
  { id: "design", label: "UI / UX Design", category: "design", x: 20, y: 75, connections: ["you", "react"] },
];

export default function SkillGraph({ className = "" }: { className?: string }) {
  const [activeNode, setActiveNode] = useState<string>("you");

  const categoryColors: Record<string, { fill: string; stroke: string; glow: string }> = {
    core: { fill: "#3B82F6", stroke: "#60A5FA", glow: "rgba(59, 130, 246, 0.4)" },
    frontend: { fill: "#06B6D4", stroke: "#22D3EE", glow: "rgba(6, 182, 212, 0.3)" },
    backend: { fill: "#10B981", stroke: "#34D399", glow: "rgba(16, 185, 129, 0.3)" },
    ai: { fill: "#8B5CF6", stroke: "#A78BFA", glow: "rgba(139, 92, 246, 0.4)" },
    data: { fill: "#F59E0B", stroke: "#FBBF24", glow: "rgba(245, 158, 11, 0.3)" },
    design: { fill: "#EC4899", stroke: "#F472B6", glow: "rgba(236, 72, 153, 0.3)" },
  };

  const active = defaultNodes.find((n) => n.id === activeNode) || defaultNodes[0];

  return (
    <div className={`relative rounded-3xl border border-white/10 bg-[#070707]/90 p-6 md:p-8 backdrop-blur-2xl overflow-hidden ${className}`}>
      {/* Background ambient radial illumination */}
      <div
        className="pointer-events-none absolute h-64 w-64 rounded-full transition-all duration-500 blur-3xl opacity-20"
        style={{
          left: `${active.x}%`,
          top: `${active.y}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: categoryColors[active.category].fill,
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-blue-400">
            TEAM COMPATIBILITY ENGINE
          </span>
          <h3 className="mt-1 text-xl font-bold text-white">
            Skill Constellation Matrix
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Hover or click nodes to explore complementary teammate synergy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(categoryColors).map(([cat, colors]) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-white/10 bg-white/5 capitalize text-gray-300"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.fill }}
              />
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Constellation SVG Canvas */}
      <div className="relative mt-4 h-72 sm:h-96 w-full">
        <svg className="absolute inset-0 h-full w-full">
          {/* Connection Lines */}
          {defaultNodes.map((source) =>
            source.connections.map((targetId) => {
              const target = defaultNodes.find((n) => n.id === targetId);
              if (!target || source.id > target.id) return null;

              const isConnectedToActive =
                source.id === activeNode || target.id === activeNode;

              return (
                <line
                  key={`${source.id}-${target.id}`}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={isConnectedToActive ? "#3B82F6" : "rgba(255, 255, 255, 0.12)"}
                  strokeWidth={isConnectedToActive ? 2 : 1}
                  strokeDasharray={isConnectedToActive ? "none" : "3 3"}
                  className="transition-all duration-300"
                />
              );
            })
          )}

          {/* Interactive Nodes */}
          {defaultNodes.map((node) => {
            const isSelected = node.id === activeNode;
            const colors = categoryColors[node.category];

            return (
              <g
                key={node.id}
                onClick={() => setActiveNode(node.id)}
                onMouseEnter={() => setActiveNode(node.id)}
                className="cursor-pointer transition-transform duration-200"
                style={{ transformOrigin: `${node.x}% ${node.y}%` }}
              >
                {/* Node Outer Pulsing Aura */}
                {isSelected && (
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r="24"
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="1.5"
                    opacity="0.4"
                    className="animate-pulse"
                  />
                )}

                {/* Node Center */}
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={isSelected ? 14 : 10}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                  style={{
                    filter: isSelected
                      ? `drop-shadow(0 0 12px ${colors.glow})`
                      : "none",
                  }}
                  className="transition-all duration-200"
                />

                {/* Node Text Label */}
                <text
                  x={`${node.x}%`}
                  y={`${node.y + (node.y > 60 ? -8 : 10)}%`}
                  textAnchor="middle"
                  fill={isSelected ? "#FFFFFF" : "#9CA3AF"}
                  fontSize="12"
                  fontWeight={isSelected ? "700" : "500"}
                  className="pointer-events-none select-none transition-colors"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Card */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-gray-500 uppercase font-mono">
            Selected Node: <span className="text-white font-semibold">{active.label}</span>
          </span>
          <p className="text-sm text-gray-300 mt-0.5">
            Connects with{" "}
            <span className="text-blue-400 font-medium">
              {active.connections.length} complementary engineering disciplines
            </span>{" "}
            for hackathon team building.
          </p>
        </div>
        <div className="text-xs text-green-400 font-semibold flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
          Deterministic Skill Matching
        </div>
      </div>
    </div>
  );
}
