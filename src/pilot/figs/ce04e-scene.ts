// Slide C4e, version 2 (research/redo-2026-10-29/EFFICIENCY_V2_BRIEF.md, lecturer, 29 Oct 2026: "make it pretty, make it
// explain why this is happening, and fit our style"): the journey of sunlight through a leaf, in the look of the 7m1 chain,
// the dark-reaction strip and the leaf section. One band, 100 units of solar energy wide (2.4 figure units per unit, honest
// proportions), runs left to right from the sun through the leaf surface, a thylakoid, the stroma, RuBisCO and a
// mitochondrion to bread; each minimum loss (Zhu, Long & Ort 2008, 2010; C₃ leaf, 30 °C) leaves it as a soft curl at the
// place where it happens, with its term, its number and one line on why.
// - The band: a spectrum until the thylakoid (UV violet, 400–700 nm as a rainbow, infrared deep red), red after it (every
//   absorbed photon works at the red level), amber from the stroma on (energy in ATP, NADPH and sugar).
// - Not to scale inside the first curl: UV and infrared are one loss of 51.3 (Zhu's step); the UV share is drawn as 3 units
//   and the infrared as 48.3, a drawing choice. Reflection and transmission are one loss of 4.9, drawn as 2 equal curls.
// - The scene is shared by the figure variants (f1 C₃; f2 with the C₄ stream; f3 a fixed crop on the surface, the thylakoid
//   and the stroma) and by the animation 'eff' (anim/eff.ts), which flows photon particles along the same band and curls.
import './ce04e.css';
import './cell-schema.css';
import './leaf-schema.css';
import psiiPng from '../../assets/chain/psii.webp';
import psiPng from '../../assets/chain/psi.webp';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { row } from './carbon-form';
import { balls, bilayer } from './cell-schema';
import { tagG } from './chain';
import { breadG } from './grain';

export type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle', extra = ''): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}"${extra}>${s}</text>`;

/* ---------------------------------------------------------------- the band and its losses (figure units, 800 × 600) */

/** Figure units per unit of solar energy, and the line the band returns to after each loss. */
export const K = 2.4, YC = 268, X0 = 24, XEND = 704;
/** Where the curls end: above the band (their labels' bottom just above), below it (their labels' top just below). */
export const Y_UP = 136, Y_DN = 474;
export type LossKey = 'uv' | 'ir' | 'refl' | 'trans' | 'photo' | 'carb' | 'pr' | 'resp';
export interface Loss {
  k: LossKey;
  /** Where the slice leaves, from which edge, its size in units, how far it turns (deg), its turn radius; its run is set so
   *  that it ends at Y_UP or Y_DN (or `L`). */
  x: number; side: 't' | 'b'; u: number; turn: number; R: number; L?: number;
  /** Colours along the curl: at the band, then the warm grey it fades into. */
  c0: string; c1: string;
}
const GREY = '#d3cbbb';
export const LOSSES_C3: Loss[] = [
  { k: 'uv', x: 74, side: 't', u: 3, turn: 90, R: 12, c0: '#a796cf', c1: GREY },
  { k: 'ir', x: 74, side: 'b', u: 48.3, turn: 90, R: 62, c0: '#c27a66', c1: GREY },
  { k: 'refl', x: 224, side: 't', u: 2.45, turn: 140, R: 12, c0: '#8fc07a', c1: '#d6e7cb' },
  { k: 'trans', x: 258, side: 't', u: 2.45, turn: 64, R: 12, c0: '#8fc07a', c1: '#d6e7cb' },
  { k: 'photo', x: 308, side: 't', u: 6.6, turn: 90, R: 16, c0: '#e7a487', c1: GREY },
  { k: 'carb', x: 482, side: 'b', u: 24.6, turn: 90, R: 46, c0: '#ecc781', c1: GREY },
  { k: 'pr', x: 598, side: 't', u: 6.1, turn: 90, R: 20, c0: '#c8673f', c1: '#e5bcaa' },
  { k: 'resp', x: 672, side: 'b', u: 1.9, turn: 90, R: 14, c0: '#ecc781', c1: GREY },
];
/** C₄ (NADP-malic enzyme type): the same until the stroma, then −28.7, no photorespiration, −2.5. */
export const LOSSES_C4: Loss[] = LOSSES_C3.filter(l => l.k !== 'pr').map(l => (l.k === 'carb' ? { ...l, u: 28.7 } : l.k === 'resp' ? { ...l, u: 2.5 } : l));

interface Seg { x: number; w: number; c: number }
/** The band's state along x: after each loss its width and the centre right after it; the centre then eases back to YC. */
export interface Band { segs: Seg[]; top(x: number): number; bot(x: number): number; w(x: number): number; slices: Array<{ l: Loss; yA: number; yB: number }> }
const smooth = (u: number): number => { const v = u < 0 ? 0 : u > 1 ? 1 : u; return v * v * (3 - 2 * v); };
export function band(losses: Loss[]): Band {
  let w = 100 * K, c = YC;
  const segs: Seg[] = [{ x: X0, w, c }], slices: Band['slices'] = [];
  // the centre as a function of x within a segment: eases from c (just after the loss) back to YC over 56 units; the same
  // rule while the band is built and when it is drawn, so every slice sits exactly on the band's edge
  const at = (x: number): { w: number; c: number } => {
    let s = segs[0];
    for (const q of segs) if (q.x <= x) s = q;
    return { w: s.w, c: s.c + (YC - s.c) * smooth((x - s.x - 6) / 56) };
  };
  const byX = new Map<number, Loss[]>();
  for (const l of losses) byX.set(l.x, [...(byX.get(l.x) ?? []), l]);
  for (const [x, ls] of [...byX.entries()].sort((a, b) => a[0] - b[0])) {
    const s = at(x);
    let top = s.c - s.w / 2, bot = s.c + s.w / 2;
    for (const l of ls) {
      const d = l.u * K;
      if (l.side === 't') { slices.push({ l, yA: top, yB: top + d }); top += d; } else { slices.push({ l, yA: bot - d, yB: bot }); bot -= d; }
    }
    w = bot - top; c = (top + bot) / 2;
    segs.push({ x, w, c });
  }
  const B: Band = {
    segs, slices,
    top: x => { const s = at(x); return s.c - s.w / 2; },
    bot: x => { const s = at(x); return s.c + s.w / 2; },
    w: x => at(x).w,
  };
  return B;
}

/** A curl's centre line: from the slice's middle heading right, turning up (top) or down (bottom) by `turn` degrees on radius
 *  R, then straight on for L. at(u) gives the point and heading at arc-length fraction u. */
export interface Curl { l: Loss; w: number; pts: Pt[]; at(u: number): { p: Pt; h: Pt }; end: Pt; head: Pt; sStart: Pt; len: number }
export function curl(l: Loss, yA: number, yB: number, yDn = Y_DN): Curl {
  const w = yB - yA, yc = (yA + yB) / 2, s = l.side === 't' ? -1 : 1, C: Pt = [l.x, yc + s * l.R], th = (l.turn * Math.PI) / 180;
  const pts: Pt[] = [[l.x - 2, yc]], hs: Pt[] = [[1, 0]];
  const nA = 30;
  for (let i = 0; i <= nA; i++) {
    const p = (th * i) / nA;
    pts.push([C[0] + l.R * Math.sin(p), C[1] - s * l.R * Math.cos(p)]);
    hs.push([Math.cos(p), s * Math.sin(p)]);
  }
  const E = pts[pts.length - 1], H = hs[hs.length - 1];
  const yT = l.side === 't' ? Y_UP : yDn, L = l.L ?? Math.max(24, Math.abs((yT - E[1]) / (H[1] || 1)));
  for (let i = 1; i <= 20; i++) { pts.push([E[0] + H[0] * L * i / 20, E[1] + H[1] * L * i / 20]); hs.push(H); }
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const len = acc[acc.length - 1];
  return {
    l, w, pts, len, sStart: E, head: H, end: pts[pts.length - 1],
    at: u => {
      const d = Math.max(0, Math.min(1, u)) * len;
      let i = 1;
      while (i < acc.length - 1 && acc[i] < d) i++;
      const t = (d - acc[i - 1]) / (acc[i] - acc[i - 1] || 1);
      return { p: [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t], h: hs[i] };
    },
  };
}
/** The curl as a ribbon of the slice's width, tapering a little at its end, filled with a gradient that fades it out. */
function curlSvg(id: string, c: Curl, key = ''): string {
  const N = c.pts.length, left: string[] = [], right: string[] = [];
  for (let i = 0; i < N; i++) {
    const p = c.pts[i], q = c.pts[Math.min(N - 1, i + 1)], r0 = c.pts[Math.max(0, i - 1)];
    const hx = q[0] - r0[0], hy = q[1] - r0[1], L = Math.hypot(hx, hy) || 1, nx = -hy / L, ny = hx / L;
    const taper = 1 - 0.35 * Math.max(0, (i - (N - 21)) / 20), hw = (c.w / 2) * taper;
    left.push(`${f(p[0] + nx * hw)},${f(p[1] + ny * hw)}`);
    right.push(`${f(p[0] - nx * hw)},${f(p[1] - ny * hw)}`);
  }
  const g0: Pt = [c.sStart[0] - c.head[0] * 6, c.sStart[1] - c.head[1] * 6];
  const gid = `${id}-g-${c.l.k}`;
  return `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f(g0[0])}" y1="${f(g0[1])}" x2="${f(c.end[0])}" y2="${f(c.end[1])}">
      <stop offset="0" stop-color="${c.l.c0}"/><stop offset=".55" stop-color="${c.l.c1}" stop-opacity=".9"/><stop offset="1" stop-color="${c.l.c1}" stop-opacity="0"/></linearGradient>
    <path${key ? ` data-k="${key}"` : ''} d="M${left.join('L')}L${right.reverse().join('L')}Z" fill="url(#${gid})"/>`;
}

/* ---------------------------------------------------------------- the band's colours */

/** 400–700 nm as a smooth rainbow (the deck's light colours: 450 #2350e6, 550 #2a963a, 650 #de361e), UV a soft violet,
 *  infrared a deep red turning brown. */
const PAR_KEY = ['#6a3fb8', '#3a4fd8', '#2a78d4', '#239fa8', '#2a963a', '#7db236', '#d9bb26', '#f09a20', '#e8601f', '#c93a22'];
const IR_KEY = ['#bd5440', '#ad604e', '#a07064'];
const UV = '#a796cf';
const hex = (c: string): number[] => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, u: number): string => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * u)).join(',')})`;
/** n colours along a key, interpolated. */
const ramp = (key: string[], n: number): string[] => Array.from({ length: n }, (_, i) => {
  const t = (i / (n - 1)) * (key.length - 1), j = Math.min(key.length - 2, Math.floor(t));
  return mix(key[j], key[j + 1], t - j);
});
/** Softened towards the paper (#fbfaf6) by a fifth, so the band sits in the deck's muted palette. */
const soft = (c: string): string => { const m = /rgb\((\d+),(\d+),(\d+)\)/.exec(c), v = m ? [m[1], m[2], m[3]].map(Number) : hex(c), p = [251, 250, 246]; return `rgb(${v.map((x, i) => Math.round(x + (p[i] - x) * 0.2)).join(',')})`; };
export const PAR = ramp(PAR_KEY, 36).map(soft), IR = ramp(IR_KEY, 10).map(soft);
export const RED = '#dc5a3d', AMBER = '#efb33c';
/** Stripes over [x0, x1] spanning the band, each with its colour, from fractions of the band's width. */
function stripes(B: Band, x0: number, x1: number, cols: string[], fr: number[], gMin = -Infinity, gMax = Infinity): string {
  const xs: number[] = [];
  for (let x = x0; x <= x1 + 0.01; x += 3) xs.push(Math.min(x, x1));
  // the geometry is read at x clamped to [gMin, gMax], so a section can overlap its neighbour without a seam
  const gx = (x: number): number => Math.max(gMin, Math.min(gMax, x));
  return cols.map((col, i) => {
    const a = fr[i], b = fr[i + 1];
    const up = xs.map(x => `${f(x)},${f(B.top(gx(x)) + a * B.w(gx(x)) - 0.4)}`), dn = xs.map(x => `${f(x)},${f(B.top(gx(x)) + b * B.w(gx(x)) + 0.4)}`).reverse();
    return `<path d="M${up.join('L')}L${dn.join('L')}Z" fill="${col}"/>`;
  }).join('');
}
/** The band's outline over [x0, x1]. */
export function bandPath(B: Band, x0: number, x1: number): string {
  const xs: number[] = [];
  for (let x = x0; x <= x1 + 0.01; x += 3) xs.push(Math.min(x, x1));
  return `M${xs.map(x => `${f(x)},${f(B.top(x))}`).join('L')}L${[...xs].reverse().map(x => `${f(x)},${f(B.bot(x))}`).join('L')}Z`;
}
/** Where the band turns from spectrum to red (thylakoid) and from red to amber (stroma). */
export const X_RED: [number, number] = [318, 364], X_AMB: [number, number] = [430, 530];
/** The band's fill over [X0, x1]: spectrum stripes, then the red and amber overlay. */
export function bandFill(id: string, B: Band, x1 = XEND, k = ''): string {
  const uvF = 3 / 100, parF = 48.7 / 100, irF = 48.3 / 100;
  const frFull = [0, uvF, ...PAR.map((_, i) => uvF + parF * (i + 1) / PAR.length), ...IR.map((_, i) => uvF + parF + irF * (i + 1) / IR.length)];
  const frPar = [0, ...PAR.map((_, i) => (i + 1) / PAR.length)];
  const xb = LOSSES_C3[0].x, g = `${id}-ra${k}`, span = X_AMB[1] - X_RED[0];
  return `<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="${X_RED[0]}" x2="${X_AMB[1]}" y1="0" y2="0">
      <stop offset="0" stop-color="${RED}" stop-opacity="0"/><stop offset="${f((X_RED[1] - X_RED[0]) / span)}" stop-color="${RED}"/>
      <stop offset="${f((X_AMB[0] - X_RED[0]) / span)}" stop-color="${RED}"/><stop offset="1" stop-color="${AMBER}"/></linearGradient>
    <g style="opacity:.97">${stripes(B, X0, xb + 1, [UV, ...PAR, ...IR], frFull, -Infinity, xb - 0.01)}${stripes(B, xb - 2, Math.min(X_RED[1] + 3, x1), PAR, frPar, xb)}
    ${x1 > X_RED[0] ? `<path d="${bandPath(B, X_RED[0], x1)}" fill="url(#${g})"/>` : ''}</g>`;
}

/* ---------------------------------------------------------------- the places */

const LEAF = { x0: 206, x1: 704, y0: 112, y1: 424 };
const CELL = { x0: 248, x1: 696, y0: 126, y1: 410, r: 30 };
const CP = { x0: 270, x1: 632, y0: 146, y1: 390, r: 72 };
export const AT = {
  sun: [-4, YC] as Pt, granum: [314, YC] as Pt, inset: [380, 476] as Pt, levels: [370, 166] as Pt, ring: [528, 190] as Pt,
  rub: [600, 324] as Pt, mito: [670, YC] as Pt, bread: [748, 262] as Pt,
};
type RSeg = { L: [number, number, number, number] } | { A: [number, number, number, number, number, number] };
/** A rounded rectangle as bilayer segments (cell-schema bilayer). */
const rrect = (x0: number, y0: number, x1: number, y1: number, r: number): RSeg[] => [
  { L: [x0 + r, y0, x1 - r, y0] }, { A: [x1 - r, y0 + r, r, r, -90, 0] }, { L: [x1, y0 + r, x1, y1 - r] }, { A: [x1 - r, y1 - r, r, r, 0, 90] },
  { L: [x1 - r, y1, x0 + r, y1] }, { A: [x0 + r, y1 - r, r, r, 90, 180] }, { L: [x0, y1 - r, x0, y0 + r] }, { A: [x0 + r, y0 + r, r, r, 180, 270] },
];
const rr = (x0: number, y0: number, x1: number, y1: number, r: number, cls: string, extra = ''): string =>
  `<rect class="${cls}" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" rx="${r}"${extra}/>`;

function sun(id: string): string {
  const [x, y] = AT.sun;
  return `<radialGradient id="${id}-sun"><stop offset="0" stop-color="#fff6d8"/><stop offset=".6" stop-color="#fbe3a0"/><stop offset="1" stop-color="#f6c453"/></radialGradient>
    <radialGradient id="${id}-glow"><stop offset=".45" stop-color="#f6c453" stop-opacity=".32"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
    <circle cx="${x}" cy="${y}" r="118" fill="url(#${id}-glow)"/><circle cx="${x}" cy="${y}" r="56" fill="url(#${id}-sun)" stroke="#e0a83a" stroke-width="1.4"/>`;
}
function leaf(id: string, x1 = LEAF.x1): string {
  const { x0, y0, y1 } = LEAF;
  const epi = [0, 1, 2, 3].map(i => rr(x0 + 4, y0 + 4 + i * 78, x0 + 34, y0 + 4 + i * 78 + 74, 9, 'lf-epi')).join('');
  return `<linearGradient id="${id}-fade" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="${id}-lm"><rect x="${x0 - 4}" y="${y0 - 8}" width="${x1 - x0 + 30}" height="${y1 - y0 + 16}" fill="url(#${id}-fade)"/></mask>
    <g mask="url(#${id}-lm)">${rr(x0, y0, x1 + 24, y1, 14, 'lf-tissue')}${epi}<path class="lf-cut" d="M${x0 + 2},${y0 + 3}V${y1 - 3}"/>
      ${rr(CELL.x0, CELL.y0, CELL.x1, CELL.y1, CELL.r, 'lf-cyt')}${rr(CELL.x0, CELL.y0, CELL.x1, CELL.y1, CELL.r, 'lf-wall')}</g>`;
}
function chloroplast(): string {
  const { x0, x1, y0, y1, r } = CP;
  return `${rr(x0, y0, x1, y1, r, 'lf-stroma')}<g class="ef-env">${bilayer(rrect(x0, y0, x1, y1, r), 4.6, 1.5, 4.6)}${bilayer(rrect(x0 + 10, y0 + 10, x1 - 10, y1 - 10, r - 10), 4.6, 1.5, 4.6)}</g>`;
}
function granum(): string {
  const [x, y] = AT.granum, n = 9, h = 10, gap = 3.4, H = n * h + (n - 1) * gap;
  return Array.from({ length: n }, (_, i) => rr(x - 22, y - H / 2 + i * (h + gap), x + 22, y - H / 2 + i * (h + gap) + h, 5, 'ef-thy')).join('');
}
/** The thylakoid membrane close up: photosystem II and I (our renders, PDB 5XNL and 5L8R) in the bilayer, stroma above,
 *  lumen below, in a round window under the granum. */
function inset(id: string, at: Pt = AT.inset, r = 54, tagsIn = false): string {
  const [x, y] = at, k = r / 54, s2 = (58 * k) / 496, s1 = (46 * k) / 398;
  const p2 = { x: x - 54 * k, y: y - 102 * s2, w: 496 * s2, h: 299 * s2 }, p1 = { x: x + 6 * k, y: y - 158.1 * s1, w: 398 * s1, h: 282 * s1 };
  return `<clipPath id="${id}-in"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>
    <path class="ef-lead" d="M${AT.granum[0] + 10},${YC + 66}L${x - 30},${y - r + 8}"/>
    <g clip-path="url(#${id}-in)"><rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${r}" fill="#f1f5e8"/><rect x="${x - r}" y="${y}" width="${2 * r}" height="${r}" fill="#e3ecf1"/>
      ${bilayer([{ L: [x - r - 6, y, x + r + 6, y] }], 7 * k, 1.9 * k, 5 * k)}
      <image href="${psiiPng}" x="${f(p2.x)}" y="${f(p2.y)}" width="${f(p2.w)}" height="${f(p2.h)}"/><image href="${psiPng}" x="${f(p1.x)}" y="${f(p1.y)}" width="${f(p1.w)}" height="${f(p1.h)}"/></g>
    <circle cx="${x}" cy="${y}" r="${r}" class="ef-ring"/>
    ${tagsIn ? `${T(x - 25 * k, y + r - 8, 'PSII', 'ef-tag')}${T(x + 29 * k, y + r - 8, 'PSI', 'ef-tag')}` : `${T(x - 25, y + r + 17, 'PSII', 'ef-tag')}${T(x + 29, y + r + 17, 'PSI', 'ef-tag')}`}`;
}
/** Slide 4a's excitation, in small: a blue photon lifts to Sₙ, which relaxes as heat to S₁; a red one lifts to S₁ directly. */
function levels(): string {
  const [x, y] = AT.levels, yn = y, y1 = y + 22, y0 = y + 46, xa = x + 4, xb = x + 22, xh = x + 40;
  const wave: string[] = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; wave.push(`${i ? 'L' : 'M'}${f(xh + Math.sin(t * 3 * 2 * Math.PI) * 3)},${f(yn + 2 + (y1 - yn - 9) * t)}`); }
  const sub = (n: string): string => `S<tspan baseline-shift="sub" font-size="75%">${n}</tspan>`;
  return `<path class="ef-lv" d="M${x - 6},${yn}H${x + 50}M${x - 6},${y1}H${x + 50}M${x - 6},${y0}H${x + 50}"/>
    ${T(x - 10, yn + 4, sub('n'), 'ef-lvl', 'end')}${T(x - 10, y1 + 4, sub('1'), 'ef-lvl', 'end')}${T(x - 10, y0 + 4, sub('0'), 'ef-lvl', 'end')}
    <path class="ef-blue" d="M${xa},${y0}V${yn + 7}"/><path class="ef-blue-h" d="M${xa},${yn + 1}l-4.5,8h9Z"/>
    <path class="ef-red" d="M${xb},${y0}V${y1 + 7}"/><path class="ef-red-h" d="M${xb},${y1 + 1}l-4.5,8h9Z"/>
    <path class="ef-heat" d="${wave.join('')}"/><path style="fill:#b5532f" d="M${xh},${y1 - 1}l-4,-7h8Z"/>${T(xh, yn - 7, 'heat', 'ef-tag')}`;
}
const AH = (id: string): string => `<marker id="${id}-ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#6b6a64"/></marker>`;
const ar = (id: string, q: string): string => `<path d="${q}" style="fill:none;stroke:#6b6a64;stroke-width:2;stroke-linecap:round" marker-end="url(#${id}-ah)"/>`;
/** The stroma: ATP and NADPH from the band into the Calvin–Benson–Bassham cycle (CO₂ in), sugar out onto the band. */
function cycle(id: string, B: Band): string {
  const [x, y] = AT.ring, r = 23;
  const P = (a: number, rr2 = r): Pt => [x + rr2 * Math.cos((a * Math.PI) / 180), y + rr2 * Math.sin((a * Math.PI) / 180)];
  const arc = (a0: number, a1: number, col: string): string => {
    const [p0, p1] = [P(a0), P(a1)], tip = P(a1 + 3), d: Pt = [Math.cos(((a1 + 90) * Math.PI) / 180), Math.sin(((a1 + 90) * Math.PI) / 180)], n: Pt = [-d[1], d[0]];
    return `<path d="M${f(p0[0])},${f(p0[1])}A${r},${r} 0 0 1 ${f(p1[0])},${f(p1[1])}" style="fill:none;stroke:${col};stroke-width:5;stroke-linecap:round"/>
      <path d="M${f(tip[0] + d[0] * 6)},${f(tip[1] + d[1] * 6)}L${f(tip[0] + n[0] * 6)},${f(tip[1] + n[1] * 6)}L${f(tip[0] - n[0] * 6)},${f(tip[1] - n[1] * 6)}Z" style="fill:${col}"/>`;
  };
  const xt = x - 62, bt = B.top(xt);
  return `${AH(id)}${arc(-160, -50, '#2a963a')}${arc(-30, 80, '#4f7cac')}${arc(100, 190, '#c58a2c')}
    <g class="chn-g">${tagG(xt, y - 16, 'ATP', 'atp')}${tagG(xt - 6, y + 18, 'NADPH', 'nadph')}</g>
    ${ar(id, `M${xt + 26},${y - 15}L${x - 28},${y - 8}`)}${ar(id, `M${xt + 34},${y + 16}L${x - 28},${y + 10}`)}
    ${ar(id, `M${xt - 2},${f(bt - 4)}L${xt - 2},${y + 36}`)}
    <g class="chn-g">${balls(x - 4, y - 58, 'OCO', 8)}</g>${ar(id, `M${x - 4},${y - 47}L${x - 4},${y - 30}`)}${T(x - 26, y - 54, 'CO₂', 'ef-tag', 'end')}
    ${ar(id, `M${x + 18},${y + 18}C${x + 26},${y + 30} ${x + 32},${y + 36} ${x + 40},${y + 42}`)}`;
}
function rubisco(id: string): string {
  const [x, y] = AT.rub, w = 58, h = w * 471 / 548;
  return `<image href="${rubPng}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${f(h)}"/>
    <g class="chn-g">${balls(x + 54, y + 12, 'OO', 8)}</g>${ar(id, `M${x + 40},${y + 10}L${x + 31},${y + 6}`)}
    ${T(x + 54, y + 34, 'O₂', 'ef-tag')}${T(x + 2, y + h / 2 + 15, 'RuBisCO', 'ef-tag')}`;
}
function mito(): string {
  const [x, y] = AT.mito, rx = 26, ry = 42;
  const cr = [-22, -6, 10, 26].map(dy => `M${x - 13},${y + dy}C${x - 5},${y + dy - 7} ${x + 5},${y + dy + 7} ${x + 13},${y + dy}`).join('');
  return `<ellipse class="cel-matrix" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>${bilayer([{ A: [x, y, rx, ry, -90, 270] }], 4.2, 1.4, 4.4)}${bilayer([{ A: [x, y, rx - 9, ry - 9, -90, 270] }], 4.2, 1.4, 4.4)}
    <path d="${cr}" style="fill:none;stroke:#d9a28a;stroke-width:1.6;stroke-linecap:round"/>`;
}

/* ---------------------------------------------------------------- labels */

export interface Lab { n: string; term: string[]; why: string; pr?: boolean; n4?: string }
export const LABELS: Record<'ir' | 'surface' | 'photo' | 'carb' | 'pr' | 'resp', Lab> = {
  ir: { n: '−51.3', term: ['outside 400–700 nm'], why: 'UV and infrared' },
  surface: { n: '−4.9', term: ['reflected,', 'transmitted'], why: 'the leaf absorbs ≈ 90 %' },
  photo: { n: '−6.6', term: ['photochemical', 'inefficiency'], why: 'blue → red level: heat' },
  carb: { n: '−24.6', term: ['carbohydrate synthesis'], why: 'sugar keeps ≈ ⅓', n4: 'C₄ −28.7' },
  pr: { n: '−6.1', term: ['photorespiration'], why: 'RuBisCO also takes up O₂', pr: true, n4: 'C₄ 0' },
  resp: { n: '−1.9', term: ['respiration'], why: 'mitochondria use sugar', n4: 'C₄ −2.5' },
};
/** A loss label: the number large, the term, one line on why (and the C₄ value); anchored at its bottom (up) or top. */
export function labelSvg(L: Lab, x: number, y: number, up: boolean, c4 = false, key = ''): string {
  const lines = [...L.term.map(t => ({ s: t, c: 'ef-term' })), { s: L.why, c: 'ef-why' }, ...(c4 && L.n4 ? [{ s: L.n4, c: 'ef-c4' }] : [])];
  const h = 24 + 17 * lines.length, y0 = up ? y - h : y;
  return `<g${key ? ` data-k="${key}"` : ''}>${T(x, y0 + 20, L.n, L.pr ? 'ef-num ef-num-pr' : 'ef-num')}${lines.map((l, i) => T(x, y0 + 40 + 17 * i, l.s, l.c)).join('')}</g>`;
}

/* ---------------------------------------------------------------- the scene */

export interface Scene { B: Band; curls: Curl[]; B4: Band; curls4: Curl[] }
export function scene(yDn = Y_DN): Scene {
  const B = band(LOSSES_C3), curls = B.slices.map(s => curl(s.l, s.yA, s.yB, yDn));
  const B4 = band(LOSSES_C4), curls4 = B4.slices.map(s => curl(s.l, s.yA, s.yB, yDn));
  return { B, curls, B4, curls4 };
}
export const by = (cs: Curl[], k: LossKey): Curl => cs.find(c => c.l.k === k) as Curl;
/** Where each label sits: [x, y, up]. */
export function labelAt(S: Scene, yDn = Y_DN): Record<keyof typeof LABELS, [number, number, boolean]> {
  const c = S.curls;
  return {
    ir: [by(c, 'ir').end[0], yDn + 10, false], surface: [196, Y_UP - 6, true], photo: [by(c, 'photo').end[0] + 30, Y_UP - 6, true],
    carb: [by(c, 'carb').end[0], yDn + 10, false], pr: [by(c, 'pr').end[0] + 10, Y_UP - 6, true], resp: [by(c, 'resp').end[0] + 12, yDn + 10, false],
  };
}
/** The static scene: the places, the band and its curls; `labels` adds the loss labels (the animation adds its own). */
export function sceneBody(id: string, o: { c4?: boolean; upTo?: 'stroma'; labels?: boolean; yDn?: number; noBand?: boolean; noBread?: boolean } = {}): string {
  const yDn = o.yDn ?? Y_DN, S = scene(yDn), { B, curls } = S, cut = o.upTo === 'stroma';
  const xEnd = cut ? 600 : XEND;
  const keep = (c: Curl): boolean => !cut || ['uv', 'ir', 'refl', 'trans', 'photo', 'carb'].includes(c.l.k);
  const parts: string[] = [sun(id), leaf(id), chloroplast(), granum(), cut ? inset(id, [392, 428], 38, true) : inset(id)];
  if (!cut) parts.push(mito());
  if (!o.noBand) {
    parts.push(`<g>${curls.filter(keep).map(c => curlSvg(id, c)).join('')}</g>`);
    if (o.c4) parts.push(`<path d="${curlSvg(id + 'c4', by(S.curls4, 'carb')).match(/ d="([^"]+)"/)?.[1] ?? ''}" class="ef-c4edge"/>`);
    if (o.c4) parts.push(`<path d="${bandPath(S.B4, LOSSES_C3[5].x, XEND + 4)}" fill="${AMBER}" style="opacity:.22"/>`);
    parts.push(bandFill(id, B, xEnd));
    if (cut) parts.push(`<linearGradient id="${id}-cutf" x1="0" x2="1"><stop offset="0" stop-color="#fbfaf6" stop-opacity="0"/><stop offset="1" stop-color="#fbfaf6"/></linearGradient><rect x="${xEnd - 60}" y="${YC - 40}" width="62" height="80" fill="url(#${id}-cutf)"/>`);
    else parts.push(`<path d="M${XEND},${f(B.top(XEND) - 6)}L${XEND + 18},${f((B.top(XEND) + B.bot(XEND)) / 2)}L${XEND},${f(B.bot(XEND) + 6)}Z" fill="${AMBER}"/>`);
    if (o.c4) parts.push(`<path d="${bandPath(S.B4, LOSSES_C3[5].x, XEND + 4)}" class="ef-c4edge"/>${curls4ResP(id, S)}`);
    parts.push(`<g class="chn-g">${row(AT.ring[0] + 54, B.top(AT.ring[0] + 54) + B.w(AT.ring[0] + 54) / 2, 'CCCP', { r: 6 })}</g>`);
  }
  parts.push(levels(), cycle(id, B));
  if (!cut) {
    parts.push(rubisco(id));
    const [bx, byy] = AT.bread;
    if (!o.noBread) parts.push(breadG(bx, byy, 0.62));
  }
  const surf = cut ? T(LEAF.x0 + 23, 378, 'leaf surface', 'ef-zone', 'middle', ` transform="rotate(-90 ${LEAF.x0 + 23} 378)"`) : T(LEAF.x0 + 19, LEAF.y1 + 16, 'leaf surface', 'ef-zone');
  const zones = `${surf}${T(CP.x0 + 58, CP.y1 - 14, 'chloroplast', 'ef-zone', 'start')}${cut ? '' : T(AT.mito[0], AT.mito[1] - 52, 'mitochondrion', 'ef-zone')}`;
  parts.push(zones);
  if (o.labels) {
    const at = labelAt(S, yDn), L = LABELS;
    const lab = (k: keyof typeof LABELS): string => labelSvg(L[k], at[k][0], at[k][1], at[k][2], o.c4);
    parts.push(lab('ir'), lab('surface'), lab('photo'), lab('carb'));
    if (!cut) parts.push(lab('pr'), lab('resp'));
    parts.push(T(by(curls, 'uv').end[0] + 4, Y_UP - 8, 'UV', 'ef-tag'));
    parts.push(T(10, 130, 'sunlight', 'ef-term', 'start'), T(10, 152, '100', 'ef-num', 'start'));
    if (!cut) {
      const [bx, byy] = AT.bread;
      parts.push(T(bx, byy + 70, '4.6', 'ef-big'), T(bx, byy + 90, 'in biomass', 'ef-why'));
      if (o.c4) parts.push(`<rect x="${bx - 44}" y="${byy + 100}" width="18" height="12" rx="2" fill="${AMBER}" style="opacity:.3"/><rect x="${bx - 44}" y="${byy + 100}" width="18" height="12" rx="2" class="ef-c4edge"/>`, T(bx + 8, byy + 112, 'C₄ 6.0', 'ef-c4b'));
    }
  }
  return parts.join('');
}
/** f2: the C₄ respiration curl outline. */
function curls4ResP(id: string, S: Scene): string {
  const d = curlSvg(id + 'c4r', by(S.curls4, 'resp')).match(/ d="([^"]+)"/)?.[1] ?? '';
  return `<path d="${d}" class="ef-c4edge"/>`;
}

const CREDIT = 'values: Zhu, Long &amp; Ort 2008, 2010 · C₃ leaf, 30 °C · structures: PDB 5XNL, 5L8R, 8RUC';
const ARIA = 'The journey of sunlight through a C3 leaf, drawn as one band 100 units wide, the solar energy reaching the leaf. Before the leaf, UV and infrared, light outside 400 to 700 nanometres, curl away: 51.3. At the leaf surface 4.9 are reflected or transmitted. In the thylakoid every absorbed photon works at the energy of a red photon and the rest is heat: 6.6. In the stroma ATP and NADPH drive the Calvin–Benson–Bassham cycle and sugar keeps about a third of the energy: 24.6 lost. RuBisCO also fixes O2: photorespiration 6.1. Mitochondria use sugar: respiration 1.9. 4.6 are left in biomass, shown as bread.';
/** The figure: f1 (C₃), f2 (with the C₄ stream), f3 (a fixed crop on the 3 "why" places). */
export function sceneSvg(id: string, v: 'f1' | 'f2' | 'f3'): string {
  const svg = (label: string, inner: string): string => `<svg class="fig-svg ef ef2" viewBox="0 0 800 600" role="img" aria-label="${label}">${inner}</svg>`;
  const credit = T(786, 592, CREDIT, 'ef-crd', 'end');
  if (v === 'f1') return svg(ARIA, sceneBody(id, { labels: true }) + credit);
  if (v === 'f2') return svg(`${ARIA} Dashed: C4, with no photorespiration, 28.7 for carbohydrate synthesis and 2.5 for respiration, 6.0 left.`, sceneBody(id, { labels: true, c4: true }) + credit);
  // f3: the surface, the thylakoid and the stroma, cropped and enlarged (no camera)
  const W = 640, s = 800 / W, cx = 0, cy = 22, yDn = 384;
  return svg(`${ARIA} Shown enlarged: the leaf surface, the thylakoid and the stroma.`, `<clipPath id="${id}-crop"><rect x="0" y="0" width="800" height="574"/></clipPath>
    <g clip-path="url(#${id}-crop)"><g transform="scale(${f(s)}) translate(${-cx} ${-cy})">${sceneBody(id, { labels: true, upTo: 'stroma', yDn })}</g></g>${T(786, 592, 'values: Zhu, Long &amp; Ort 2008, 2010 · C₃ leaf, 30 °C · structures: PDB 5XNL, 5L8R', 'ef-crd', 'end')}`);
}
export { curlSvg };
