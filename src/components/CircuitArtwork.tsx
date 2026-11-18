import React from 'react';
import { COMPETITIONS } from '../data/competitions';
import { CompetitionId } from '../types/competition';

interface CircuitArtworkProps {
  selectedCompetitionId: CompetitionId;
  onSelectCompetition: (id: CompetitionId) => void;
}

const SECTOR_COORDS: Record<CompetitionId, { x: number; y: number; side: 'left' | 'right' }> = {
  'singing-contest': { x: 105, y: 108, side: 'left' },
  'christmas-card': { x: 455, y: 108, side: 'right' },
  speech: { x: 105, y: 205, side: 'left' },
  'drawing-painting': { x: 455, y: 205, side: 'right' },
  'english-quiz': { x: 105, y: 302, side: 'left' },
  'cover-dance': { x: 455, y: 302, side: 'right' },
};

export const CircuitArtwork: React.FC<CircuitArtworkProps> = ({
  selectedCompetitionId,
  onSelectCompetition,
}) => {
  const activeComp = COMPETITIONS.find((c) => c.id === selectedCompetitionId) ?? COMPETITIONS[0];

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border border-white/15 bg-[#09120E]">
      {/* Top Pit-Lane Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-[#0A130F]/95 px-6 py-4 backdrop-blur-sm">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-widest text-[#D4AF37]">
            UDONPIT GRAND PRIX · WINTER PIT LANE
          </p>
          <p className="font-display text-xl font-bold tracking-tight text-white">
            06 Sectors · Scuderia Christmas Edition
          </p>
        </div>
        <span className="font-mono text-xs text-amber-200 tabular-nums">18 · 12 · 2569</span>
      </div>

      {/* Overhead Scuderia Crimson Stripe + Evergreen Christmas Pit-Lane */}
      <div className="evergreen-stage relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6">
        {/* Vertical Crimson Pit-Lane Stripe */}
        <div className="pitlane-stripe pointer-events-none absolute inset-y-0 left-1/2 w-[156px] -translate-x-1/2 opacity-95" />

        {/* Subtle Horizontal Asphalt Expansion Joint Lines */}
        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-white/10" />
        <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-white/10" />

        <svg
          viewBox="0 0 560 400"
          className="relative z-10 h-auto w-full max-w-[540px]"
          role="img"
          aria-label="ภาพประกอบรถแข่ง Formula 1 ธีมคริสต์มาส มุมมองด้านบนพร้อมจุดเลือกการแข่งขัน 6 รายการ"
        >
          <defs>
            <linearGradient id="carBodyRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF1E14" />
              <stop offset="55%" stopColor="#C90600" />
              <stop offset="100%" stopColor="#6E0200" />
            </linearGradient>
            <linearGradient id="carbonFiber" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#262A32" />
              <stop offset="100%" stopColor="#0D0F12" />
            </linearGradient>
            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="50%" stopColor="#F5D061" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <filter id="carShadow" x="-30%" y="-15%" width="160%" height="130%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Architectural Christmas Pine Silhouettes on Outer Pit Apron */}
          <g fill="#11462C" opacity="0.55">
            <polygon points="48,376 74,322 100,376" />
            <polygon points="56,348 74,306 92,348" />
            <polygon points="462,376 488,322 514,376" />
            <polygon points="470,348 488,306 506,348" />
            <polygon points="26,56 44,24 62,56" />
            <polygon points="498,56 516,24 534,56" />
          </g>

          {/* F1 Festive Red-Green-White Pit-Lane Curbs flanking the Crimson Strip */}
          {Array.from({ length: 14 }).map((_, idx) => {
            const y = 8 + idx * 28;
            const color = idx % 3 === 0 ? '#E10600' : idx % 3 === 1 ? '#FFFFFF' : '#15803D';
            return (
              <g key={idx} opacity="0.85">
                <rect x="196" y={y} width="6" height="20" fill={color} />
                <rect x="358" y={y} width="6" height="20" fill={color} />
              </g>
            );
          })}

          {/* Architectural Radar Arcs */}
          <g fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="1">
            <circle cx="280" cy="200" r="145" />
            <circle cx="280" cy="200" r="205" />
            <circle cx="280" cy="200" r="265" />
          </g>

          {/* Champagne-Gold 4-Point Christmas North Stars */}
          <g fill="#F5D061">
            <path d="M 280 22 L 283 32 L 293 35 L 283 38 L 280 48 L 277 38 L 267 35 L 277 32 Z" />
            <path
              d="M 160 44 L 161.8 50 L 168 51.8 L 161.8 53.6 L 160 59.6 L 158.2 53.6 L 152 51.8 L 158.2 50 Z"
              opacity="0.85"
            />
            <path
              d="M 400 44 L 401.8 50 L 408 51.8 L 401.8 53.6 L 400 59.6 L 398.2 53.6 L 392 51.8 L 398.2 50 Z"
              opacity="0.85"
            />
            <path
              d="M 176 352 L 177.8 358 L 184 359.8 L 177.8 361.6 L 176 367.6 L 174.2 361.6 L 168 359.8 L 174.2 358 Z"
              opacity="0.7"
            />
            <path
              d="M 384 352 L 385.8 358 L 392 359.8 L 385.8 361.6 L 384 367.6 L 382.2 361.6 L 376 359.8 L 382.2 358 Z"
              opacity="0.7"
            />
          </g>

          {/* Bold Architectural Race Date Stencil on Asphalt Flanks */}
          <text
            x="166"
            y="246"
            textAnchor="middle"
            fill="none"
            stroke="rgba(245,208,97,0.42)"
            strokeWidth="1.2"
            fontSize="124"
            fontWeight="800"
            fontFamily="Barlow Condensed, sans-serif"
            letterSpacing="-3"
          >
            18
          </text>
          <text
            x="394"
            y="246"
            textAnchor="middle"
            fill="none"
            stroke="rgba(245,208,97,0.42)"
            strokeWidth="1.2"
            fontSize="124"
            fontWeight="800"
            fontFamily="Barlow Condensed, sans-serif"
            letterSpacing="-3"
          >
            12
          </text>

          {/* Overhead Hyper-Detailed Formula 1 Car centered on the Crimson Stripe */}
          <g transform="translate(280, 200)" filter="url(#carShadow)">
            {/* Speed motion streaks trailing backwards */}
            <g opacity="0.6">
              <line x1="-22" y1="126" x2="-22" y2="178" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1="22" y1="126" x2="22" y2="178" stroke="#FFFFFF" strokeWidth="1.2" />
              <line x1="-42" y1="108" x2="-42" y2="152" stroke="#F5D061" strokeWidth="1" />
              <line x1="42" y1="108" x2="42" y2="152" stroke="#F5D061" strokeWidth="1" />
            </g>

            {/* Front Wing Assembly */}
            <path
              d="M -66 -124 L -16 -142 L 16 -142 L 66 -124 L 68 -106 L 18 -114 L -18 -114 L -68 -106 Z"
              fill="url(#carBodyRed)"
              stroke="#14161A"
              strokeWidth="1.5"
            />
            <path d="M -62 -116 L -18 -126 L 18 -126 L 62 -116" fill="none" stroke="url(#goldTrim)" strokeWidth="1.5" />
            <rect x="-68" y="-128" width="5" height="24" rx="1.5" fill="#181A20" />
            <rect x="63" y="-128" width="5" height="24" rx="1.5" fill="#181A20" />

            {/* Nose Cone */}
            <path
              d="M -11 -144 L 11 -144 L 16 -64 L -16 -64 Z"
              fill="url(#carBodyRed)"
              stroke="#0B0C0F"
              strokeWidth="1.2"
            />
            {/* Christmas Star Nose Emblem */}
            <path
              d="M 0 -132 L 2.2 -126 L 8.5 -126 L 3.4 -122 L 5.2 -116 L 0 -119.5 L -5.2 -116 L -3.4 -122 L -8.5 -126 L -2.2 -126 Z"
              fill="#F5D061"
            />

            {/* Front Suspension Arms */}
            <g stroke="#1D2028" strokeWidth="3.5" strokeLinecap="round">
              <line x1="-14" y1="-92" x2="-48" y2="-84" />
              <line x1="-14" y1="-74" x2="-48" y2="-80" />
              <line x1="14" y1="-92" x2="48" y2="-84" />
              <line x1="14" y1="-74" x2="48" y2="-80" />
            </g>

            {/* Front Tires */}
            <g>
              <rect x="-66" y="-102" width="22" height="40" rx="5" fill="#121316" stroke="#2D313B" strokeWidth="1.5" />
              <line x1="-65" y1="-95" x2="-65" y2="-69" stroke="#D4AF37" strokeWidth="2" />
              <rect x="44" y="-102" width="22" height="40" rx="5" fill="#121316" stroke="#2D313B" strokeWidth="1.5" />
              <line x1="65" y1="-95" x2="65" y2="-69" stroke="#D4AF37" strokeWidth="2" />
            </g>

            {/* Carbon Floor */}
            <path
              d="M -38 -52 L -46 68 L -32 98 L 32 98 L 46 68 L 38 -52 Z"
              fill="url(#carbonFiber)"
              stroke="#2D313B"
              strokeWidth="1"
            />

            {/* Sculpted Sidepods & Engine Cover */}
            <path
              d="M -16 -64 C -36 -54, -40 -12, -34 38 C -28 74, -18 96, -12 108 L 12 108 C 18 96, 28 74, 34 38 C 40 -12, 36 -54, 16 -64 Z"
              fill="url(#carBodyRed)"
              stroke="#0A0B0D"
              strokeWidth="1.5"
            />

            {/* Evergreen Festive Racing Accent Stripes on Sidepods */}
            <path
              d="M -27 -38 C -30 -10, -28 24, -20 62"
              fill="none"
              stroke="#16A34A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 27 -38 C 30 -10, 28 24, 20 62"
              fill="none"
              stroke="#16A34A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Cockpit Opening & Gold Helmet */}
            <ellipse cx="0" cy="-12" rx="11" ry="22" fill="#0B0C0F" />
            <circle cx="0" cy="-8" r="7.5" fill="#F5D061" stroke="#FFFFFF" strokeWidth="1.2" />
            <path
              d="M -11 -2 C -11 -26, 11 -26, 11 -2"
              fill="none"
              stroke="#1E222A"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
            <line x1="0" y1="-34" x2="0" y2="-20" stroke="#1E222A" strokeWidth="3.5" />

            {/* Airbox & Shark Fin */}
            <rect x="-4" y="10" width="8" height="16" rx="3" fill="#0B0C0F" />
            <line x1="0" y1="26" x2="0" y2="104" stroke="#F5D061" strokeWidth="1.5" />

            {/* Rear Suspension Arms */}
            <g stroke="#1D2028" strokeWidth="3.5" strokeLinecap="round">
              <line x1="-14" y1="84" x2="-46" y2="88" />
              <line x1="-12" y1="98" x2="-46" y2="92" />
              <line x1="14" y1="84" x2="46" y2="88" />
              <line x1="12" y1="98" x2="46" y2="92" />
            </g>

            {/* Rear Tires */}
            <g>
              <rect x="-68" y="66" width="25" height="44" rx="5" fill="#121316" stroke="#2D313B" strokeWidth="1.5" />
              <line x1="-67" y1="74" x2="-67" y2="102" stroke="#D4AF37" strokeWidth="2.2" />
              <rect x="43" y="66" width="25" height="44" rx="5" fill="#121316" stroke="#2D313B" strokeWidth="1.5" />
              <line x1="67" y1="74" x2="67" y2="102" stroke="#D4AF37" strokeWidth="2.2" />
            </g>

            {/* Rear Wing */}
            <rect
              x="-42"
              y="112"
              width="84"
              height="18"
              rx="2"
              fill="url(#carbonFiber)"
              stroke="url(#goldTrim)"
              strokeWidth="1.2"
            />
            <rect x="-44" y="108" width="4" height="24" fill="#15803D" />
            <rect x="40" y="108" width="4" height="24" fill="#15803D" />
            <rect x="-3" y="128" width="6" height="4" rx="1" fill="#FF2A1F" />
          </g>

          {/* 6 Interactive Sector Telemetry Nodes Flanking the Pit Lane */}
          {COMPETITIONS.map((comp) => {
            const pos = SECTOR_COORDS[comp.id];
            const isSelected = comp.id === selectedCompetitionId;
            const connectorStartX = pos.side === 'left' ? pos.x + 68 : pos.x - 68;
            const connectorEndX = pos.side === 'left' ? 204 : 356;

            return (
              <g
                key={comp.id}
                onClick={() => onSelectCompetition(comp.id)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`เลือก ${comp.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCompetition(comp.id);
                  }
                }}
              >
                <line
                  x1={connectorStartX}
                  y1={pos.y}
                  x2={connectorEndX}
                  y2={pos.y}
                  stroke={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
                  strokeWidth={isSelected ? 1.5 : 1}
                  strokeDasharray={isSelected ? undefined : '3 3'}
                />
                <circle
                  cx={connectorEndX}
                  cy={pos.y}
                  r={isSelected ? 4 : 2.5}
                  fill={isSelected ? '#F5D061' : '#FFFFFF'}
                />

                <rect
                  x={pos.x - 74}
                  y={pos.y - 22}
                  width="148"
                  height="44"
                  rx="4"
                  fill={isSelected ? '#E10600' : '#0B1711'}
                  stroke={isSelected ? '#FFFFFF' : 'rgba(212,175,55,0.35)'}
                  strokeWidth={isSelected ? 1.5 : 1}
                />
                <text
                  x={pos.x - 62}
                  y={pos.y - 3}
                  fill={isSelected ? '#FDE68A' : '#D4AF37'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {comp.code} · {comp.dateLabel}
                </text>
                <text
                  x={pos.x - 62}
                  y={pos.y + 13}
                  fill="#FFFFFF"
                  fontSize="13.5"
                  fontWeight="700"
                  fontFamily="Barlow Condensed, IBM Plex Sans Thai, sans-serif"
                >
                  {comp.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Selected Sector Bar */}
      <div className="relative z-10 flex flex-col justify-between gap-2 border-t border-white/10 bg-[#0A130F]/95 px-6 py-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold text-white">
            {activeComp.code}. {activeComp.title}
          </p>
          <p className="text-xs text-neutral-300">
            {activeComp.divisionLabel} · {activeComp.venueOrType}
          </p>
        </div>
        <a
          href="#register"
          onClick={() => onSelectCompetition(activeComp.id)}
          className="whitespace-nowrap shrink-0 text-xs font-bold tracking-wide text-[#F5D061] transition-colors hover:text-white"
        >
          สมัครรายการนี้ →
        </a>
      </div>
    </div>
  );
};
