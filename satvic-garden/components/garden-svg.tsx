"use client";

import * as React from "react";
import type { GardenState, Plant, Season } from "@/lib/types";

const SEASON_BG: Record<Season, { sky: [string, string]; ground: string; accent: string }> = {
  spring:  { sky: ["#F6F1E7", "#FBE8D2"], ground: "#A7BF9A", accent: "#F2A6B7" },
  summer:  { sky: ["#FDF5DA", "#F8C97C"], ground: "#B5C29A", accent: "#FFB347" },
  monsoon: { sky: ["#D2DEE3", "#94A8B1"], ground: "#7DA683", accent: "#3E6E54" },
  autumn:  { sky: ["#F6E6DC", "#E8B796"], ground: "#A89876", accent: "#C57B3B" },
  winter:  { sky: ["#EAEEF1", "#C8D2D9"], ground: "#9CA992", accent: "#8FA3A0" },
};

const SPECIES_LIBRARY: Record<string, (x: number, y: number, scale: number) => React.ReactElement> = {
  tulsi:    (x, y, s) => <Tulsi x={x} y={y} s={s} />,
  mint:     (x, y, s) => <Mint x={x} y={y} s={s} />,
  lemon:    (x, y, s) => <Lemon x={x} y={y} s={s} />,
  mango:    (x, y, s) => <Mango x={x} y={y} s={s} />,
  coconut:  (x, y, s) => <Coconut x={x} y={y} s={s} />,
  marigold: (x, y, s) => <Marigold x={x} y={y} s={s} />,
  pomegranate: (x, y, s) => <Pomegranate x={x} y={y} s={s} />,
  lotus:    (x, y, s) => <Lotus x={x} y={y} s={s} />,
  tree_family: (x, y, s) => <FamilyTree x={x} y={y} s={s} />,
  jowar:    (x, y, s) => <Jowar x={x} y={y} s={s} />,
  spice:    (x, y, s) => <Spice x={x} y={y} s={s} />,
};

export function GardenSVG({ garden, lush, onPlantClick }: {
  garden: GardenState;
  lush: 1 | 2 | 3;
  onPlantClick?: (p: Plant) => void;
}) {
  const palette = SEASON_BG[garden.season];

  // distribute plants across two soft rows.
  const positions: { x: number; y: number }[] = [];
  garden.plants.forEach((_, i) => {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = 80 + col * 60 + (row % 2) * 30;
    const y = 240 + row * 40;
    positions.push({ x, y });
  });

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-cream-200 shadow-soft bg-white">
      <svg viewBox="0 0 480 360" className="w-full block" role="img" aria-label="Your Satvic Garden">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.sky[0]} />
            <stop offset="100%" stopColor={palette.sky[1]} />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.ground} stopOpacity="0.6" />
            <stop offset="100%" stopColor={palette.ground} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="480" height="240" fill="url(#sky)" />
        {/* Sun / moon */}
        <circle cx={garden.season === "monsoon" ? 380 : 400} cy="70" r={garden.season === "winter" ? 22 : 26} fill={palette.accent} opacity="0.85" />
        {/* Distant hills */}
        <path d="M0 220 Q120 170 240 215 T480 210 V240 H0 Z" fill={palette.ground} opacity="0.45" />
        {/* Ground */}
        <rect x="0" y="240" width="480" height="120" fill="url(#ground)" />
        {/* Soft path */}
        <path d="M240 360 Q220 320 270 280 T260 240" stroke="#EDE4D1" strokeWidth="10" fill="none" opacity="0.7" />

        {/* Rain (monsoon) */}
        {garden.season === "monsoon" &&
          Array.from({ length: 30 }).map((_, i) => (
            <line key={i}
              x1={(i * 17) % 480}
              y1={(i * 13) % 120}
              x2={((i * 17) % 480) - 4}
              y2={((i * 13) % 120) + 14}
              stroke="#9DB4BE" strokeWidth="1" opacity="0.6" />
          ))}

        {/* Decor: starter tulsi pot always there */}
        <g transform="translate(60,255)">
          <rect x="-14" y="0" width="28" height="20" rx="3" fill="#C98A6B" />
          <Tulsi x={0} y={-8} s={1.1} />
        </g>

        {/* Growth-state decoration */}
        {lush >= 2 && (
          <g>
            <circle cx="120" cy="285" r="8" fill={palette.accent} opacity="0.6" />
            <circle cx="430" cy="295" r="6" fill={palette.accent} opacity="0.6" />
          </g>
        )}
        {lush >= 3 && (
          <>
            <Butterfly x={170} y={170} />
            <Butterfly x={350} y={140} />
          </>
        )}

        {/* Plants */}
        {garden.plants.map((p, i) => {
          const pos = positions[i] ?? { x: 60 + (i % 6) * 60, y: 270 };
          const draw = SPECIES_LIBRARY[p.species] ?? SPECIES_LIBRARY.tulsi;
          return (
            <g
              key={p.id}
              className="cursor-pointer"
              onClick={() => onPlantClick?.(p)}
              style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
            >
              {draw(pos.x, pos.y, 1)}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* --- Plant shapes (intentionally hand-drawn feel, kept small) --- */

function Tulsi({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-22" stroke="#5C8050" strokeWidth="2" />
      <ellipse cx="-5" cy="-22" rx="5" ry="3" fill="#7A9B6B" />
      <ellipse cx="5" cy="-25" rx="5" ry="3" fill="#7A9B6B" />
      <ellipse cx="0" cy="-30" rx="6" ry="3.5" fill="#5C8050" />
    </g>
  );
}
function Mint({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-18" stroke="#5C8050" strokeWidth="1.5" />
      <ellipse cx="-4" cy="-15" rx="4" ry="2.5" fill="#9DB590" />
      <ellipse cx="4" cy="-18" rx="4" ry="2.5" fill="#9DB590" />
      <ellipse cx="0" cy="-22" rx="5" ry="3" fill="#7A9B6B" />
    </g>
  );
}
function Lemon({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-30" stroke="#5C8050" strokeWidth="2" />
      <circle cx="0" cy="-32" r="13" fill="#7A9B6B" />
      <circle cx="-5" cy="-35" r="3" fill="#F2C94C" />
      <circle cx="5" cy="-32" r="3" fill="#F2C94C" />
      <circle cx="0" cy="-26" r="3" fill="#F2C94C" />
    </g>
  );
}
function Mango({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-44" stroke="#48663F" strokeWidth="3" />
      <circle cx="0" cy="-48" r="20" fill="#5C8050" />
      <circle cx="-12" cy="-44" r="3.5" fill="#F2A03D" />
      <circle cx="10" cy="-42" r="3.5" fill="#F2A03D" />
      <circle cx="0" cy="-38" r="3.5" fill="#F2A03D" />
    </g>
  );
}
function Coconut({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <path d="M0 0 Q-2 -20 0 -40 Q2 -20 0 0 Z" fill="#8B5E3C" />
      <path d="M0 -40 Q-22 -45 -28 -52" stroke="#5C8050" strokeWidth="3" fill="none" />
      <path d="M0 -40 Q22 -45 28 -52" stroke="#5C8050" strokeWidth="3" fill="none" />
      <path d="M0 -42 Q-12 -55 -18 -60" stroke="#5C8050" strokeWidth="3" fill="none" />
      <path d="M0 -42 Q12 -55 18 -60" stroke="#5C8050" strokeWidth="3" fill="none" />
      <circle cx="-3" cy="-38" r="2.5" fill="#6F4C2F" />
      <circle cx="3" cy="-36" r="2.5" fill="#6F4C2F" />
    </g>
  );
}
function Marigold({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-18" stroke="#5C8050" strokeWidth="1.5" />
      <circle cx="0" cy="-20" r="7" fill="#F2A03D" />
      <circle cx="0" cy="-20" r="3" fill="#C57B3B" />
    </g>
  );
}
function Pomegranate({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-38" stroke="#5C8050" strokeWidth="2.5" />
      <circle cx="0" cy="-42" r="16" fill="#7A9B6B" />
      <circle cx="-7" cy="-40" r="3" fill="#B5354F" />
      <circle cx="7" cy="-44" r="3" fill="#B5354F" />
    </g>
  );
}
function Lotus({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="18" ry="4" fill="#7C9FB5" opacity="0.6" />
      <ellipse cx="0" cy="-3" rx="6" ry="3" fill="#F2A6B7" />
      <ellipse cx="-4" cy="-5" rx="4" ry="3" fill="#F2A6B7" />
      <ellipse cx="4" cy="-5" rx="4" ry="3" fill="#F2A6B7" />
    </g>
  );
}
function FamilyTree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-30" stroke="#8B5E3C" strokeWidth="3" />
      <circle cx="0" cy="-34" r="14" fill="#5C8050" />
      <circle cx="-10" cy="-30" r="8" fill="#7A9B6B" />
      <circle cx="10" cy="-30" r="8" fill="#7A9B6B" />
    </g>
  );
}
function Jowar({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="sway">
      <line x1="0" y1="0" x2="0" y2="-26" stroke="#A89876" strokeWidth="2" />
      <ellipse cx="0" cy="-28" rx="3.5" ry="6" fill="#D8B872" />
      <ellipse cx="-3" cy="-26" rx="2" ry="3" fill="#D8B872" />
      <ellipse cx="3" cy="-26" rx="2" ry="3" fill="#D8B872" />
    </g>
  );
}
function Spice({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="6" ry="3" fill="#8B5E3C" />
      <ellipse cx="-5" cy="-1" rx="2.5" ry="1.6" fill="#C57B3B" />
      <ellipse cx="5" cy="-1" rx="2.5" ry="1.6" fill="#C57B3B" />
    </g>
  );
}
function Butterfly({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`} className="float-soft">
      <ellipse cx="-4" cy="0" rx="4" ry="2.5" fill="#F2A6B7" />
      <ellipse cx="4" cy="0" rx="4" ry="2.5" fill="#F2A6B7" />
      <line x1="0" y1="-2" x2="0" y2="2" stroke="#2E2A24" strokeWidth="1" />
    </g>
  );
}
