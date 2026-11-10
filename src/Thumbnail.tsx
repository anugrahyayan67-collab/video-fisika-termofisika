import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from './brand';
import {C, FONT} from './theme';

/** Panah lurus sederhana (garis + kepala segitiga). */
const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color: string; w?: number; head?: number}> = ({x1, y1, x2, y2, color, w = 12, head = 34}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const bx = x2 - Math.cos(a) * head;
  const by = y2 - Math.sin(a) * head;
  const px = Math.cos(a + Math.PI / 2) * head * 0.6;
  const py = Math.sin(a + Math.PI / 2) * head * 0.6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} />
    </g>
  );
};

const mono = {fontFamily: FONT.mono, fontWeight: 600} as const;

// Dua kotak bersentuhan: panas (kiri) → dingin (kanan). Laju molekul ∝ √T (jejak lebih panjang di kiri).
// Kalor Q (jingga) mengalir dari panas ke dingin.
const rnd = (s: number) => {
  const v = Math.sin(s * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const BOX_T = 430;
const BOX_B = 950;
const parts = (x0: number, x1: number, n: number, len: number, seed: number) =>
  Array.from({length: n}, (_, i) => {
    const cx = x0 + 90 + rnd(seed + i * 3) * (x1 - x0 - 180);
    const cy = BOX_T + 90 + rnd(seed + i * 3 + 1) * (BOX_B - BOX_T - 180);
    const a = rnd(seed + i * 3 + 2) * Math.PI * 2;
    return {cx, cy, dx: Math.cos(a) * len, dy: Math.sin(a) * len};
  });
const hot = parts(1600, 1990, 13, 70, 11);
const cold = parts(2060, 2450, 13, 26, 57);

const Box: React.FC<{x0: number; x1: number; color: string; ps: typeof hot; label: string}> = ({x0, x1, color, ps, label}) => (
  <g>
    <rect x={x0} y={BOX_T} width={x1 - x0} height={BOX_B - BOX_T} rx={22} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={8} />
    {ps.map((p, i) => (
      <g key={i}>
        <line x1={p.cx} y1={p.cy} x2={p.cx - p.dx} y2={p.cy - p.dy} stroke={color} strokeOpacity={0.5} strokeWidth={8} strokeLinecap="round" />
        <circle cx={p.cx} cy={p.cy} r={16} fill={C.cyan} />
      </g>
    ))}
    <text x={(x0 + x1) / 2} y={BOX_B + 80} textAnchor="middle" fill={color} fontSize={52} style={mono}>{label}</text>
  </g>
);

const Visual: React.FC = () => (
  <g>
    <Box x0={1600} x1={1990} color={C.heat} ps={hot} label="PANAS" />
    <Box x0={2060} x1={2450} color={C.pot} ps={cold} label="DINGIN" />
    <path d="M1720,380 Q2025,170 2310,370" fill="none" stroke={C.kin} strokeWidth={16} strokeLinecap="round" />
    <polygon points="2340,400 2272,382 2322,334" fill={C.kin} />
    <text x={2025} y={250} textAnchor="middle" fill={C.kin} fontSize={80} fontFamily={FONT.serif} fontStyle="italic" fontWeight={600}>Q</text>
    {[0, 1, 2].map((i) => <Arrow key={i} x1={1998} y1={560 + i * 140} x2={2054} y2={560 + i * 140} color={C.kin} w={8} head={22} />)}
  </g>
);

/** Gambar mini 2K untuk YouTube/LMS. */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 30% 40%, #20305e 0%, ${C.bg} 70%)`, fontFamily: FONT.head}}>
    <div style={{position: 'absolute', left: 140, top: 180, color: C.gold, fontSize: 54, letterSpacing: 10, fontWeight: 600}}>{BRAND.series.toUpperCase()}</div>
    <div style={{position: 'absolute', left: 130, top: 270, color: C.ink, fontSize: 200, fontWeight: 700, lineHeight: 0.95, letterSpacing: -6, whiteSpace: 'nowrap'}}>
      Ke Mana
      <br />
      <span style={{color: C.kin}}>Panas Pergi</span>
    </div>
    <div style={{position: 'absolute', left: 140, top: 760, color: C.muted, fontSize: 70, fontWeight: 500}}>{BRAND.subtitle}</div>
    <div style={{position: 'absolute', left: 140, bottom: 140, color: C.ink, fontSize: 44, letterSpacing: 8, fontWeight: 600}}>
      {BRAND.channel} <span style={{color: C.muted, letterSpacing: 2, fontWeight: 400}}>· {BRAND.tagline}</span>
    </div>
    <svg width={2560} height={1440} style={{position: 'absolute', inset: 0}}>
      <Visual />
    </svg>
  </AbsoluteFill>
);
