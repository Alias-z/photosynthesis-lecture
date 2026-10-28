// Cyclic electron flow on the slide 10b figure, stagings m1–m3 (lecturer, 28 Oct 2026; ETC_ANIM_BRIEF.md, "cyclic"). The
// stage IS the slide figure, variant 11m1: focusSvg(id, { look: 'bil', lit: LIT_CYCLIC, g: { mol: true } }) of
// figs/chain.ts, drawn in the slide's figure card. An ATP : NADPH readout with the H⁺ count stays on screen from the
// first frame to the last.
//
// This file: what all three stagings share (the tagged figure, the story's glyphs, the readout, the condition icons, the
// Munekage clipping) and the story of m1 and m3 (the slide zoomed, with click stops). m2 (fixed camera, a loop, the
// 14-slot dial) is in cyclic-m2.ts.
// - Beat 1, the gap (1 stop): the readout opens with linear flow, 4 e⁻ → 12 H⁺, ≈ 2.6 ATP : 2 NADPH. Step 1: where the
//   12 H⁺ come from (4 from water, 8 at b₆f; both groups glow on the figure). Step 2: CO₂ fixation needs 3 : 2; the
//   missing 0.4 ATP is a dashed gap on the ATP bar.
// - Beat 2, the cycle (3 steps): zoom onto the cycle. (a) "photosystem I" and "reaction centre (P700)" are named, light
//   arrives, the electron jumps to ferredoxin (which glows first) and runs back along the cyclic route to plastoquinone
//   (which glows first); FNR stays dim. (b) 2 H⁺ come down from the stroma onto plastoquinone; cytochrome b₆f is named;
//   plastoquinone moves to it and the 2 H⁺ go into the lumen; the readout adds "cyclic 1 e⁻ → 2 H⁺". (c) Plastocyanin
//   glows; the electron passes b₆f → plastocyanin → P700 and fills its empty place; plastoquinone goes back.
// - Beat 3, one full turn (1 stop): zoom out; the readout sums 12 + 2 = 14 H⁺ = 1 turn. Step 2: the rotor and the head of
//   ATP synthase are named, the rotor turns once, 3 ATP tags leave the head, the ATP bar grows from 2.6 to 3.
// - Beat 4, when and why (m1: 2 stops): the figure shrinks to make room. Four condition icons; then the consequence on
//   the figure (the lumen turns acidic, heat dissipation at photosystem II, photosystem I protected); then the Munekage
//   et al. 2004 clipping. m3 (3 stops): a conditions panel instead, one row per click, each with its reason; the
//   consequence on the figure comes with the first row.
//
// How the slide figure is reused (figs/chain.ts is not modified): as cyc10b-common.ts, the wrappers <g class="chn-on|off">
// of focusSvg() are tagged data-p="<part>" by drawing the view once per lit part. In glyph mode the H⁺ riding on
// plastoquinone are ringed marks (g.chn-g), not dots, so the probe tells them from the cyclic route by their rings. The
// camera scales the whole figure; text, rings, atoms and tags (g.chn-g) are counter-scaled by (s/s₀)^−0.7 in the zoom and
// by (s/s₀)^−0.3 in the smaller views of beat 4, so the slide's bracket names do not run together.
//
// Image: munekage2004-plants.png (assets/anim/cyclic), Munekage et al. 2004, Nature 429: 579, Fig. 2, restyled as a
// newspaper halftone (scripts/cyclic_anim_assets.py); the card labels wild type and the crr2-2 pgr5 double mutant ("lacking
// both routes" of cyclic flow).
import '../figs/clipping.css';
import './cyclicm-common.css';
import plantsImg from '../../assets/anim/cyclic/munekage2004-plants.png';
import { carrierBox, focusSvg, GEO, hring, LIT_CYCLIC, tagG, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure (11m1), tagged by part */

/** Parts drawn only when lit: lit in every drawing, so that all drawings have the same wrappers. */
const ALWAYS: Part[] = ['e-fd-pq', 'pq-h-load'];
const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];

interface Wrap { a: number; b: number; inner: string; on: boolean }
/** The part wrappers of a chain drawing, in document order (they never nest; their content may hold other groups). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g class="chn-(on|off)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), on: m[1] === 'on' });
    re.lastIndex = i;
  }
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
/** Slide 10b's figure (figs/l11c.ts, 11m1) with `lit` lit, without its <svg> wrapper. */
const view = (id: string, lit: Part[]): string => strip(focusSvg(id, { look: 'bil', lit, g: { mol: true }, say: '' }));

function partsOf(): Array<Part | null> {
  const probe = (lit: Part[]): Wrap[] => wraps(view('cymprobe', [...ALWAYS, ...lit]));
  const base = probe([]);
  // the two always-lit parts: the ringed H⁺ on plastoquinone, and the cyclic route (its arrow and its label)
  const out: Array<Part | null> = base.map(w => (!w.on ? null : /class="chn-hr"/.test(w.inner) && !/class="chn-e"/.test(w.inner) ? 'pq-h-load' : 'e-fd-pq'));
  for (const p of PARTS) probe([p]).forEach((w, i) => { if (w.on && base[i] && !base[i].on) out[i] = p; });
  return out;
}

/** The slide figure's svg body, every part wrapper tagged data-p. */
export function chainScene(id: string): string {
  const base = view(id, LIT_CYCLIC), parts = partsOf(), wb = wraps(base);
  // alternates, hidden: NADPH lit (beats 1 and 3: linear flow's 2 NADPH) and the ATP reaction row dimmed (beat 3)
  const alt = wraps(view(`${id}x`, [...LIT_CYCLIC.filter(p => p !== 'atp'), 'nadph']));
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += base.slice(at, w.a);
    if ((p === 'nadph' || p === 'atp') && alt[i]) svg += `<g class="chn-${alt[i].on ? 'on' : 'off'}" data-p="${p}-alt" display="none">${alt[i].inner}</g>`;
    svg += `<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    at = w.b;
  });
  return svg + base.slice(at);
}

/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
export const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
export const cardRect = (p: string): string => `<defs><filter id="${p}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
  <rect class="cym-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${p}-sl)"/>`;

/* ---------------------------------------------------------------- small helpers */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A glow: up over 0.25 s from t0, held, down by t0 + d. */
export const glowAt = (t: number, t0: number, d = 0.8): number => tw(t, t0, t0 + 0.25) * (1 - tw(t, t0 + d - 0.3, t0 + d));
/** Points along a polyline by arc length, u in 0–1. */
export function along(pts: V[], u: number): V {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const s = Math.max(0, Math.min(1, u)) * L[L.length - 1];
  let i = 1;
  while (i < L.length - 1 && L[i] < s) i++;
  const e = L[i] > L[i - 1] ? (s - L[i - 1]) / (L[i] - L[i - 1]) : 1;
  return lerpV(pts[i - 1], pts[i], Math.max(0, Math.min(1, e)));
}
/** An svg path of the drawing, sampled (it is drawn in figure units, untransformed). */
export function sample(el: SVGPathElement | null, n = 40): V[] {
  if (!el) return [];
  const L = el.getTotalLength(), out: V[] = [];
  for (let i = 0; i <= n; i++) { const q = el.getPointAtLength((L * i) / n); out.push([q.x, q.y]); }
  return out;
}
export const glyph = (k: string, inner: string): string => `<g data-k="${k}" opacity="0" display="none">${inner}</g>`;
export const txt = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}"${k ? ` data-k="${k}"` : ''} x="${f1(x)}" y="${f1(y)}" text-anchor="${a}">${s}</text>`;
export const E_DOT = '<circle class="cym-e" r="6.5"/>';
/** A ringed H⁺ drawn round its origin (chain.ts hring, at the slide's size). */
export const H_RING = hring(0, 0, 12);
export const B6F = 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>';
/** A soft amber ring round a part that is about to act (figure units, radius r). */
export const glowRing = (k: string, p: string, at: V, r: number): string =>
  `<g data-k="${k}" opacity="0" display="none"><circle cx="${f1(at[0])}" cy="${f1(at[1])}" r="${r}" fill="url(#${p}-glow)"/></g>`;
export const glowDefs = (p: string): string => `<radialGradient id="${p}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity="0"/>
  <stop offset=".55" stop-color="#f6c453" stop-opacity=".0"/><stop offset=".78" stop-color="#f0a316" stop-opacity=".75"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
  <radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>`;
/** A leader label in figure units: text at `at` (counter-scaled about its anchor), a line from `from` to the part at `to`. */
export function leader(k: string, s: string, at: V, a: 'start' | 'middle' | 'end', from: V, to: V): string {
  const d = `M${f1(from[0])},${f1(from[1])}L${f1(to[0])},${f1(to[1])}`;
  return `<g data-k="${k}" opacity="0" display="none"><path class="cym-ldh" d="${d}"/><path class="cym-ld" d="${d}"/>
    <circle class="cym-ldt" cx="${f1(to[0])}" cy="${f1(to[1])}" r="3.4"/>${txt(s, 'chn-in chn-halo cym-cs', at[0], at[1], a)}</g>`;
}

/* ---------------------------------------------------------------- the readout: H⁺ count and ATP : NADPH (stage units) */

/** Readout panel, left of the figure: x 14–370. */
export const RO = { x: 14, y: 26, w: 356, h: 640 };
const X0 = RO.x + 22;
/** Bar length per ATP or NADPH. */
export const UNIT = 74;
const BAR_X = X0 + 78;
/** Rows (baselines). */
const RY = { h3: RO.y + 44, ratio: RO.y + 104, atp: RO.y + 150, nadph: RO.y + 192, need1: RO.y + 242, need2: RO.y + 274,
  h2: RO.y + 336, conv: RO.y + 376, h1: RO.y + 444, lin: RO.y + 490, why: RO.y + 520, cyc: RO.y + 566, rule: RO.y + 584, tot: RO.y + 620 };
/** The readout. Keys: ro-why, ro-cyc, ro-tot, ro-r26, ro-r3, ro-bar (ATP bar), ro-gap, ro-gapl, ro-need, ro-pulse-*. */
export function readoutSvg(p: string): string {
  const ring = (x: number, y: number): string => `<g transform="translate(${f1(x)} ${f1(y - 8)})">${hring(0, 0, 12)}</g>`;
  const row = (y: number, lab: string, e: string, n: string): string =>
    `${txt(lab, 'cym-ro-lab', X0, y)}${txt(e, 'cym-ro-e', X0 + 78, y)}${txt(n, 'cym-ro-n', X0 + 190, y, 'end')}${ring(X0 + 210, y)}`;
  return `<g class="fig cym-ro">
    <defs><filter id="${p}-rosh" x="-10%" y="-6%" width="120%" height="112%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#46321a" flood-opacity=".13"/></filter></defs>
    <rect class="cym-robox" x="${RO.x}" y="${RO.y}" width="${RO.w}" height="${RO.h}" rx="18" filter="url(#${p}-rosh)"/>
    ${txt('H⁺ into the lumen', 'cym-ro-h', X0, RY.h1)}
    ${row(RY.lin, 'linear', '4 e⁻ →', '12')}
    <g data-k="ro-why" opacity="0" display="none">${txt('4 from water + 8 at <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', 'cym-ro-why', X0 + 78, RY.why)}</g>
    <g data-k="ro-cyc" opacity="0" display="none">${row(RY.cyc, 'cyclic', '1 e⁻ →', '2')}</g>
    <g data-k="ro-tot" opacity="0" display="none"><path class="cym-ro-rule" d="M${X0 + 78},${RY.rule}H${X0 + 226}"/>
      ${txt('14', 'cym-ro-n', X0 + 190, RY.tot, 'end')}${ring(X0 + 210, RY.tot)}${txt('= 1 turn', 'cym-ro-e', X0 + 230, RY.tot)}</g>
    ${txt('ATP synthase', 'cym-ro-h', X0, RY.h2)}
    ${txt('14', 'cym-ro-e', X0, RY.conv)}${ring(X0 + 42, RY.conv)}${txt('→ 1 turn →', 'cym-ro-e', X0 + 62, RY.conv)}${txt('3', 'cym-ro-e', X0 + 194, RY.conv)}
    <g transform="translate(${X0 + 236} ${RY.conv - 8})">${tagG(0, 0, 'ATP', 'atp')}</g>
    ${txt('ATP : NADPH', 'cym-ro-h', X0, RY.h3)}
    <g data-k="ro-r26">${txt('<tspan class="cym-c-atp">2.6</tspan> : <tspan class="cym-c-nadph">2</tspan>', 'cym-ro-big', X0, RY.ratio)}</g>
    <g data-k="ro-r3" opacity="0" display="none">${txt('<tspan class="cym-c-atp">3</tspan> : <tspan class="cym-c-nadph">2</tspan>', 'cym-ro-big', X0, RY.ratio)}</g>
    <g transform="translate(${X0 + 34} ${RY.atp - 8})">${tagG(0, 0, 'ATP', 'atp')}</g>
    <rect class="cym-bar-atp" data-k="ro-bar" x="${BAR_X}" y="${RY.atp - 19}" width="${f1(2.6 * UNIT)}" height="22" rx="4"/>
    <rect class="cym-gap" data-k="ro-gap" x="${f1(BAR_X + 2.6 * UNIT + 1)}" y="${RY.atp - 18}" width="${f1(0.4 * UNIT - 2)}" height="20" rx="3" opacity="0" display="none"/>
    <g data-k="ro-gapl" opacity="0" display="none">${txt('0.4 missing', 'cym-ro-gapl', RO.x + RO.w - 14, RY.atp - 28, 'end')}</g>
    <g transform="translate(${X0 + 34} ${RY.nadph - 8})">${tagG(0, 0, 'NADPH', 'nadph')}</g>
    <rect class="cym-bar-nadph" x="${BAR_X}" y="${RY.nadph - 19}" width="${f1(2 * UNIT)}" height="22" rx="4"/>
    <g data-k="ro-need" opacity="0" display="none">${txt('CO₂ fixation needs', 'cym-ro-lab', X0, RY.need1)}
      ${txt('<tspan class="cym-c-atp">3</tspan> : <tspan class="cym-c-nadph">2</tspan>', 'cym-ro-mid', X0, RY.need2)}
      <path class="cym-need-tick" d="M${f1(BAR_X + 3 * UNIT)},${RY.atp - 26}V${RY.atp + 9}"/></g>
    <rect class="cym-ro-pulse" data-k="ro-pulse-cyc" x="${RO.x + 8}" y="${RY.cyc - 30}" width="${RO.w - 16}" height="42" rx="10" opacity="0" display="none"/>
    <rect class="cym-ro-pulse" data-k="ro-pulse-tot" x="${RO.x + 8}" y="${RY.tot - 30}" width="${RO.w - 16}" height="42" rx="10" opacity="0" display="none"/>
    <rect class="cym-ro-pulse" data-k="ro-pulse-ratio" x="${RO.x + 8}" y="${RY.ratio - 44}" width="${RO.w - 16}" height="100" rx="10" opacity="0" display="none"/>
  </g>`;
}
/** Readout state: why (0–1), need (0–1), cyc (0–1), tot (0–1), grow (ATP 2.6 → 3, 0–1), pulses. */
export interface RoState { why: number; need: number; cyc: number; tot: number; grow: number; pCyc: number; pTot: number; pRatio: number }
export function drawReadout(S: ReturnType<typeof setters>, r: RoState): void {
  const { q, set, op } = S;
  op(q('ro-why'), r.why);
  op(q('ro-need'), r.need);
  op(q('ro-cyc'), r.cyc);
  op(q('ro-tot'), r.tot);
  set(q('ro-bar'), 'width', f1((2.6 + 0.4 * r.grow) * UNIT));
  op(q('ro-gap'), r.need * (1 - r.grow));
  op(q('ro-gapl'), r.need * (1 - tw(r.grow, 0, 0.3)));
  op(q('ro-r26'), 1 - tw(r.grow, 0.7, 1));
  op(q('ro-r3'), tw(r.grow, 0.7, 1));
  op(q('ro-pulse-cyc'), r.pCyc);
  op(q('ro-pulse-tot'), r.pTot);
  op(q('ro-pulse-ratio'), r.pRatio);
}

/* ---------------------------------------------------------------- condition icons (stage units, round their centre) */

export type Cond = 'light' | 'drought' | 'cold' | 'c4';
export function condIcon(c: Cond, r = 34): string {
  const k = r / 34;
  const bg = `<circle class="cym-ic-bg" r="${r}"/>`;
  if (c === 'light') {
    const rays = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, c1 = Math.cos(a), s1 = Math.sin(a); return `M${f1(17 * k * c1)},${f1(17 * k * s1)}L${f1(25 * k * c1)},${f1(25 * k * s1)}`; }).join('');
    return `${bg}<path class="cym-ic-ray" d="${rays}"/><circle class="cym-ic-sun" r="${f1(12 * k)}"/>`;
  }
  if (c === 'drought') {
    // a closed stoma: two guard cells pressed together, the pore shut
    return `${bg}<ellipse class="cym-ic-gc" cx="${f1(-7.5 * k)}" cy="0" rx="${f1(9 * k)}" ry="${f1(20 * k)}"/><ellipse class="cym-ic-gc" cx="${f1(7.5 * k)}" cy="0" rx="${f1(9 * k)}" ry="${f1(20 * k)}"/>
      <path class="cym-ic-pore" d="M0,${f1(-13 * k)}V${f1(13 * k)}"/>`;
  }
  if (c === 'cold') {
    const arm = (a: number): string => {
      const u: V = [Math.cos(a), Math.sin(a)], n: V = [-u[1], u[0]], L = 22 * k, b = 13 * k, w = 6 * k;
      return `M${f1(-u[0] * L)},${f1(-u[1] * L)}L${f1(u[0] * L)},${f1(u[1] * L)}`
        + [1, -1].map(sg => `M${f1(sg * u[0] * b + n[0] * w)},${f1(sg * u[1] * b + n[1] * w)}L${f1(sg * u[0] * (b + 6 * k))},${f1(sg * u[1] * (b + 6 * k))}L${f1(sg * u[0] * b - n[0] * w)},${f1(sg * u[1] * b - n[1] * w)}`).join('');
    };
    return `${bg}<path class="cym-ic-snow" d="${[0, 1, 2].map(i => arm(Math.PI / 2 + (i * Math.PI) / 3)).join('')}"/>`;
  }
  // C₄: a vein ringed by bundle-sheath cells, mesophyll outside
  const ring = (n: number, rr: number, cr: number, cls: string): string =>
    Array.from({ length: n }, (_, i) => { const a = (i * 2 * Math.PI) / n; return `<circle class="${cls}" cx="${f1(rr * k * Math.cos(a))}" cy="${f1(rr * k * Math.sin(a))}" r="${f1(cr * k)}"/>`; }).join('');
  return `${bg}${ring(12, 26, 5, 'cym-ic-mes')}${ring(8, 15.5, 6.2, 'cym-ic-bs')}<circle class="cym-ic-vein" r="${f1(8 * k)}"/>`;
}
export const COND_NAME: Record<Cond, [string, string]> = {
  light: ['high or', 'fluctuating light'], drought: ['drought', '(stomata closed)'], cold: ['cold', ''], c4: ['C₄ bundle-', 'sheath cells'],
};
export const CONDS: Cond[] = ['light', 'drought', 'cold'];

/* ---------------------------------------------------------------- the clipping: Munekage et al. 2004 (stage units) */

/** The photo: crop x 30–572, y 19–429 of the board image (scripts/cyclic_anim_assets.py). */
const PH = { x0: 30, y0: 19, w: 542, ar: 820 / 1084 };
export const clipH = (w: number): number => (w - 36) * PH.ar + 36 + 34;
export function clippingSvg(p: string, k: string, x: number, y: number, w: number, rot = -1.2): string {
  const m = 18, pw = w - 2 * m, ph = pw * PH.ar, h = clipH(w), px = x + m, py = y + m, sc = pw / PH.w;
  const at = (bx: number, by: number): V => [px + (bx - PH.x0) * sc, py + (by - PH.y0) * sc];
  const wt = at(203, 148), dm = at(426, 178);
  return `<g data-k="${k}" opacity="0" display="none"><g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-8%" width="120%" height="118%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, 41, 3.2)}" filter="url(#${p}-cardsh)"/>
    <image href="${plantsImg}" x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}"/>
    ${txt('wild type', 'cym-plab', wt[0], wt[1], 'end')}${txt('lacking both', 'cym-plab', px + pw - 10, dm[1], 'end')}${txt('routes', 'cym-plab', px + pw - 10, dm[1] + 24, 'end')}
    <text class="clip-find" x="${f1(x + w / 2)}" y="${f1(py + ph + 30)}" text-anchor="middle" font-size="21">Munekage et al. 2004</text></g></g>`;
}

/* ---------------------------------------------------------------- the m1 / m3 story */

/* ---------------------------------------------------------------- the counts, shown and numbered on the figure */
// Lecturer (28 Oct 2026): every count stated on screen is shown in full and numbered. Beat 1 ticks the 4 H⁺ from water
// and the 8 at b₆f (the slide's rings) one by one; beat 2 adds the cycle's 2, tagged and apart from b₆f's 8; beat 3 sends
// all 14, numbered, through the rotor one by one, with a live n/14; the 3 ATP leave the head at 14/3, 28/3 and 14.

/** Where the cycle's 2 H⁺ land in the lumen: under photosystem I, apart from b₆f's 8. */
export const CYC_H: V[] = [[470, 398], [494, 398]];
/** b₆f's stroma side (its Q_i site), where the cycled electron enters. */
export const QI: V = [GEO.hem[0] + 2, 286];
/** The cycle's 2 H⁺: from the stroma above b₆f onto its stroma side, then through it into the lumen. */
export const CYC_FROM: V[] = [[268, 200], [290, 192]];
export const CYC_AT: V[] = [[304, 272], [324, 272]];
export const cycCross = (i: number): V[] => [CYC_AT[i], [332 + 10 * i, 318], [352 + 8 * i, 350], [432, 358 + 6 * i], CYC_H[i]];
/** Beat 1's ticks: water's 4 from W0, every WD s; b₆f's 8 from G0, every GD s. */
export const TALLY = { W0: 0.5, WD: 0.32, G0: 1.95, GD: 0.26 };
/** Beat 3's stream: speed (figure units per s), the time between two H⁺ through the rotor. */
const STREAM = { v: 380, dt: 0.42 };
/** The counter n/14 beside ATP synthase. */
const CNT: V = [748, 414];

/** The marks of the counts (figure units; in the camera group, inside .fig). */
export function countsSvg(): string {
  const hl = Array.from({ length: 12 }, (_, i) => `<circle class="cym-hl" data-k="hl${i}" r="15" opacity="0" display="none"/>`).join('');
  const stream = Array.from({ length: 14 }, (_, i) => glyph(`sh${i}`, `${hring(0, 0, 11)}<text class="cym-num${i >= 12 ? ' cym-num-c' : ''}" x="0" y="28" text-anchor="middle">${i + 1}</text>`)).join('');
  return `${hl}
    <g data-k="tally-w" opacity="0" display="none"><text class="cym-tally chn-halo cym-cs" x="214" y="458" text-anchor="middle">water <tspan data-k="tw-n">0</tspan>/4</text></g>
    <g data-k="tally-g" opacity="0" display="none"><text class="cym-tally chn-halo cym-cs" x="296" y="452" text-anchor="middle"><tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan> <tspan data-k="tg-n">0</tspan>/8</text></g>
    ${[0, 1].map(i => glyph(`ch${i}`, hring(0, 0, 11))).join('')}
    <g data-k="cyc-tag" opacity="0" display="none">${txt('+2 (cyclic)', 'cym-cyctag chn-halo cym-cs', 482, 378, 'middle')}</g>
    <g data-k="cyc-note" opacity="0" display="none">${txt('2 H⁺ per cycled e⁻', 'cym-note chn-halo cym-cs', 512, 400)}${txt('(Q cycle)', 'cym-note chn-halo cym-cs', 512, 418)}</g>
    ${stream}
    <g data-k="cnt" opacity="0" display="none"><text class="cym-cnt chn-halo cym-cs" x="${CNT[0]}" y="${CNT[1]}" text-anchor="middle"><tspan data-k="cnt-n">0</tspan>/14</text></g>`;
}

/** Cumulative arc lengths of a polyline, and the point at arc length s. */
const cumLen = (p: V[]): number[] => p.reduce<number[]>((a, q, i) => (i ? [...a, a[i - 1] + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1])] : [0]), []);
function atLen(p: V[], c: number[], s: number): V {
  if (s <= 0) return p[0];
  let i = 1;
  while (i < c.length - 1 && c[i] < s) i++;
  const e = c[i] > c[i - 1] ? Math.min(1, (s - c[i - 1]) / (c[i] - c[i - 1])) : 1;
  return lerpV(p[i - 1], p[i], e);
}

export interface Counts {
  /** Beat 1's tallies at t seconds into beat 1 (−1: off). */
  tally(t: number): void;
  /** The cycle's 2 H⁺ resting in the lumen (o: opacity), unless the stream has taken them. */
  cycRest(o: number): void;
  /** Beat 3's stream at t seconds after it starts (−1: not yet; the slide's rings stay); returns the H⁺ through so far
   *  (continuous, 0–14). `orig`: the slide's rings shown (0–1) where no copy has left. */
  stream(t: number, k: number, orig: number): number;
  /** The stream: first H⁺ through the rotor, the time between two, the end (all gone), after its start. */
  c0: number; dt: number; end: number;
  /** When ATP k (1–3) leaves the head, after the stream's start. */
  atpAt: (n: number) => number;
}

export function bindCounts(S: ReturnType<typeof setters>, chainG: SVGGElement, put: (k: string, at: V, sc: number, o: number) => void): Counts {
  const { q, set, op } = S;
  const ringsOf = (p: string): Array<{ g: SVGGElement; c: V }> => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"] g.chn-g`))
    .filter(g => g.querySelector('circle.chn-hr'))
    .map(g => { const c = g.querySelector('circle.chn-hr') as SVGCircleElement; return { g, c: [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))] as V }; });
  const W = ringsOf('water'), G = ringsOf('pq-h-out');
  const labs = ['water', 'pq-h-out'].map(p => chainG.querySelector(`[data-p="${p}"] text.chn-cnt`)).filter((e): e is Element => !!e);
  [...W, ...G].forEach((r, i) => { const h = q(`hl${i}`); if (h) { set(h, 'cx', f1(r.c[0])); set(h, 'cy', f1(r.c[1])); } });
  const path = (p: string): SVGPathElement | null => chainG.querySelector<SVGPathElement>(`[data-p="${p}"] path.chn-h`);
  const hl = sample(path('h-lumen'), 80), at = sample(path('atps'), 30);
  const RING = GEO.ring, EXIT: V = [RING[0] - 58, RING[1] - 76];
  let iRot = 0;
  at.forEach((p, j) => { if (Math.abs(p[1] - RING[1]) < Math.abs(at[iRot][1] - RING[1])) iRot = j; });
  const starts: V[] = [...W.map(r => r.c), ...G.map(r => r.c), ...CYC_H];
  const paths = starts.map(s => {
    const j = Math.max(0, hl.findIndex(p => p[0] > s[0] + 18));
    const pts: V[] = [s, ...hl.slice(j), ...at, EXIT], c = cumLen(pts);
    return { pts, c, rot: c[1 + (hl.length - j) + iRot], L: c[c.length - 1] };
  });
  const c0 = paths[0].rot / STREAM.v, dt = STREAM.dt;
  const st = paths.map((p, i) => c0 + i * dt - p.rot / STREAM.v);
  const end = Math.max(...paths.map((p, i) => st[i] + p.L / STREAM.v));
  const lit = (g: Element, on: boolean): void => set(g, 'style', on ? 'opacity:1' : '');
  return {
    c0, dt, end,
    atpAt: n => c0 + ((14 * n) / 3 - 1) * dt,
    tally(t) {
      const on = t >= 0 ? 1 : 0;
      const nw = t < 0 ? 0 : Math.max(0, Math.min(4, Math.floor((t - TALLY.W0) / TALLY.WD) + 1));
      const ng = t < 0 ? 0 : Math.max(0, Math.min(8, Math.floor((t - TALLY.G0) / TALLY.GD) + 1));
      W.forEach((r, i) => { op(q(`hl${i}`), i < nw ? 1 : 0); lit(r.g, i < nw); });
      G.forEach((_, j) => op(q(`hl${4 + j}`), j < ng ? 1 : 0));
      op(q('tally-w'), on * tw(t, TALLY.W0 - 0.2, TALLY.W0));
      op(q('tally-g'), on * tw(t, TALLY.G0 - 0.2, TALLY.G0));
      set(q('tw-n'), 'text', String(nw));
      set(q('tg-n'), 'text', String(ng));
      labs.forEach((l, i) => op(l, on ? 1 - (i === 0 ? tw(t, TALLY.W0 - 0.2, TALLY.W0) : tw(t, TALLY.G0 - 0.2, TALLY.G0)) : 1));
    },
    cycRest(o) { CYC_H.forEach((p, i) => put(`ch${i}`, p, 1, o)); },
    stream(t, k, orig) {
      paths.forEach((p, i) => {
        const s = (t - st[i]) * STREAM.v, going = t >= 0 && s >= 0;
        put(`sh${i}`, atLen(p.pts, p.c, s), k, going && s < p.L ? 1 - tw(s, p.L - 40, p.L) : 0);
        const o = going ? 0 : orig;
        if (i < 4) op(W[i].g, o);
        else if (i < 12) op(G[i - 4].g, o);
        else if (going) op(q(`ch${i - 12}`), 0);
      });
      const n = t < c0 ? 0 : Math.min(14, Math.floor((t - c0) / dt + 1e-6) + 1);
      op(q('cnt'), t >= 0 ? tw(t, 0, 0.3) : 0);
      set(q('cnt-n'), 'text', String(n));
      return t < c0 ? 0 : Math.min(14, 1 + (t - c0) / dt);
    },
  };
}

/* ---------------------------------------------------------------- the m1 / m3 story */

/** The whole chain beside the readout: the card (949 × 708 stage px) centred in x 372–1600. */
const B: Tf = { s: 1.07, t: [986 - 1.07 * 400, 370 - 1.07 * 300] };
/** The cycle, close: figure x 112 at the readout's right edge (stage 380), y 100 at the top (figure x 112–722, y 100–470). */
const Z: Tf = { s: 2.0, t: [380 - 112 * 2.0, -100 * 2.0] };
/** Beat 4, m1: the chain smaller, below the condition strip, the clipping on its right. */
const W1: Tf = { s: 0.86, t: [380 - CARD.x * 0.86, 150 - CARD.y * 0.86] };
/** Beat 4, m3: the chain smaller, the conditions panel on its right. */
const W3: Tf = { s: 0.84, t: [384 - CARD.x * 0.84, 92 - CARD.y * 0.84] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** (s > B.s ? -0.7 : -0.3);

// Beat 1: the 12 H⁺ counted (4 from water, 8 at b₆f); then the need and the gap.
const B1 = { why: 0.3, hold: 4.3, need: 4.45, end: 5.4 };
// Beat 2: (a) zoom, names, light, e⁻ to Fd and on to b₆f's stroma side; (b) 2 H⁺ through b₆f into the lumen;
// (c) e⁻ through b₆f and plastocyanin back to P700.
const B2 = {
  zoom: 0, zoomD: 1.2, lPsi: 0.95, lRc: 1.4, light: 2.1, lightD: 0.8, flash: 2.95, gFd: 3.25, jump: 3.7, jumpD: 1.0,
  lB6f: 4.8, route: 5.3, routeD: 1.6, holdA: 7.1,
  hIn: 7.2, drop: 7.5, dropD: 0.9, cross: 8.6, crossD: 1.4, tag: 10.0, holdB: 10.8,
  gPc: 10.9, d: 11.2, dD: 1.1, e: 12.45, eD: 1.0, end: 13.8,
};
// Beat 3: zoom out; 12 + 2 = 14 H⁺ (1 stop); the rotor and head named; the 14 H⁺ through the rotor, 3 ATP.
const B3 = { out: 0, outD: 1.2, sum: 1.1, hold: 1.9, names: 2.0, stream: 2.5 };
// Beat 4: m1: icons; consequence; clipping. m3: one panel row per click (the first with the consequence).
const B4 = { cam: 0, camD: 1.2, icons: 0.9, hold1: 2.4, acid: 2.5, heat: 3.0, prot: 3.5, hold2: 4.5, clip: 4.6, end: 5.3 };
const B4P = { cam: 0, camD: 1.2, rows: [1.0, 2.6, 4.2], hold: [2.4, 4.0], acid: 1.4, heat: 1.7, prot: 2.0, end: 5.2 };

/** m3's panel rows: the condition and why plants use cyclic flow there (Yamori & Shikanai 2016). */
const PANEL: Array<{ c: Cond; name: string; why: string }> = [
  { c: 'light', name: 'high or fluctuating light', why: 'acidic lumen: heat dissipation,<br>photosystem I protected' },
  { c: 'drought', name: 'drought (stomata closed)', why: 'more photorespiration:<br>more ATP per NADPH' },
  { c: 'cold', name: 'cold', why: 'slow CO₂ fixation:<br>photosystem I protected' },
];
const PN = { x: 1140, y: 20, w: 448, row: 170 };

export interface Opt { id: string; name: string; note: string; when: 'strip' | 'panel' }

/** The electron's legs: P700 → ferredoxin; along the cyclic route to b₆f's stroma side; b₆f → plastocyanin; → P700. */
export function legs(chainG: SVGGElement): { A: V[]; B: V[]; D: V[]; E: V[] } {
  const { p700: P700, hem: HEM } = GEO;
  const FD = addV(GEO.fd, carrierBox('fd').spot), PC = addV(GEO.pc, carrierBox('pc').spot);
  const path = (p: string): SVGPathElement | null => chainG.querySelector<SVGPathElement>(`[data-p="${p}"] path.chn-e`);
  return {
    A: [P700, ...sample(path('e-psi-fd')), FD],
    B: [FD, ...sample(path('e-fd-pq'), 60).filter(p => p[0] > QI[0] + 16), QI],
    D: [QI, HEM, ...sample(path('e-b6f-pc')), PC],
    E: [PC, ...sample(path('e-pc-psi')), P700],
  };
}
const addV = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];

export function makeSlideStaging(o: Opt): Staging {
  const P = `cym${o.id}`;
  const { hem: HEM, pc: PC, p700: P700, fd: FD, ring: RING } = GEO;
  const panel = o.when === 'panel';
  const WV = panel ? W3 : W1;
  // the ATP tags leave the head of ATP synthase for the stroma above it
  const HEAD: V = [712, 150], ATP_TO: V[] = [[664, 30], [716, 30], [768, 30]];

  const stripSvg = (): string => CONDS.map((c, i) => {
    const x = 384 + i * 453, [a, b] = COND_NAME[c];
    return `<g data-k="cond${i}" opacity="0" display="none"><g transform="translate(${x + 38} 72)">${condIcon(c)}</g>
      ${txt(a, 'cym-cond', x + 84, b ? 66 : 80)}${b ? txt(b, 'cym-cond', x + 84, 92) : ''}</g>`;
  }).join('');
  const panelSvg = (): string => `<g data-k="panel" opacity="0" display="none"><rect class="cym-panel" x="${PN.x}" y="${PN.y}" width="${PN.w}" height="${PN.row * PANEL.length + 20}" rx="18"/></g>
    ${PANEL.map((r, i) => {
      const y = PN.y + 10 + i * PN.row;
      const [w1, w2] = r.why.split('<br>');
      return `<g data-k="prow${i}" opacity="0" display="none"><g transform="translate(${PN.x + 52} ${y + PN.row / 2})">${condIcon(r.c, 36)}</g>
        ${txt(r.name, 'cym-pname', PN.x + 104, y + 54)}${txt(w1, 'cym-pwhy', PN.x + 104, y + 90)}${txt(w2, 'cym-pwhy', PN.x + 104, y + 120)}
        ${i < 3 ? `<path class="cym-prule" d="M${PN.x + 24},${y + PN.row}H${PN.x + PN.w - 24}"/>` : ''}</g>`;
    }).join('')}`;

  let bEnd = 12;
  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[B1.hold], [B2.holdA, B2.holdB], [B3.hold], panel ? B4P.hold : [B4.hold1, B4.hold2]],
    svg: () => `
      <g data-k="cam"><g class="fig">
        ${cardRect(P)}
        <g data-k="chain" class="chn chn-pdb-bilayer chn-fx">${chainScene(`${P}c`)}</g>
        <defs>${glowDefs(P)}<clipPath id="${P}-lclip"><rect data-k="lclip" x="-200" y="-200" width="1200" height="1200"/></clipPath></defs>
        <rect class="cym-acid" data-k="acid" x="0" y="319" width="800" height="133" opacity="0" display="none"/>
        ${glowRing('g-p700', P, P700, 30)}${glowRing('g-fd', P, FD, 30)}
        ${glowRing('g-b6f', P, [HEM[0] + 2, HEM[1] + 6], 78)}${glowRing('g-pc', P, PC, 32)}${glowRing('g-rot', P, RING, 40)}${glowRing('g-head', P, [712, 175], 66)}
        ${glowRing('g-psi', P, [499, 293], 92)}
        ${glyph('ld-psi', txt('photosystem I', 'chn-name chn-halo cym-cs', 490, 374, 'middle'))}
        ${leader('ld-rc', 'reaction centre (P700)', [548, 406], 'start', [554, 393], [P700[0] + 4, P700[1] + 6])}
        ${leader('ld-b6f', B6F, [246, 150], 'middle', [250, 157], [292, 258])}
        ${leader('ld-rot', 'rotor (c-ring)', [640, 404], 'end', [622, 390], [RING[0] - 8, RING[1] + 10])}
        ${leader('ld-head', 'head', [792, 206], 'start', [794, 196], [770, 182])}
        ${glyph('rcglow', `<circle r="24" fill="url(#${P}-rcglow)"/>`)}${glyph('rcring', '<circle class="cym-ring" r="8"/>')}
        <g data-k="turn" opacity="0" display="none"><path class="cym-turn-bg" d="${turnPath(RING)}"/><path class="cym-turn" data-k="turn-arc" d="${turnPath(RING)}" pathLength="100" stroke-dasharray="0 100"/>
          <path class="cym-turnh" data-k="turn-head" d="M0,-7L13,0L0,7Z"/></g>
        ${countsSvg()}
        ${[0, 1].map(i => glyph(`h${i}`, H_RING)).join('')}${glyph('el', E_DOT)}
        ${glyph('l-e', txt('e⁻', 'cym-elab chn-halo', -9, -9, 'end'))}
        ${[0, 1, 2].map(i => glyph(`atp${i}`, tagG(0, 0, 'ATP', 'atp'))).join('')}
        <g data-k="heat" opacity="0" display="none">${[90, 114, 138].map(x => `<path class="cym-heat" d="${heatPath(x, 254, 204)}"/>`).join('')}</g>
        ${glyph('l-acid', txt('acidic lumen', 'cym-acidl chn-halo cym-cs', 600, 410, 'middle'))}
        ${glyph('l-heat', txt('heat dissipation', 'cym-cons chn-halo cym-cs', 112, 534, 'middle'))}
        ${glyph('l-prot', txt('protected', 'cym-cons chn-halo cym-cs', 499, 534, 'middle'))}
      </g></g>
      ${readoutSvg(P)}
      ${panel ? panelSvg() : `${stripSvg()}${clippingSvg(P, 'clip', 1160, 236, 424)}`}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q<SVGGElement>('chain'), camG = q('cam');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      // counter-scaled: the figure's free text (about its anchor), its glyph groups (about their centre), the story's labels
      const texts = [...Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('g.chn-g')),
        ...Array.from(camG.querySelectorAll<SVGTextElement>('text.cym-cs'))].map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const glyphs = Array.from(chainG.querySelectorAll<SVGGElement>('g.chn-g')).map(el => { const b = el.getBBox(); return { el, c: [b.x + b.width / 2, b.y + b.height / 2] as V }; });
      const lightW = parts('light-psi');
      lightW.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const hIn = parts('pq-h-in');
      const swap = (p: string, alt: boolean): void => { parts(p).forEach(g => op(g, alt ? 0 : 1)); parts(`${p}-alt`).forEach(g => op(g, alt ? 1 : 0)); };
      const L = legs(chainG);
      const turnArc = q('turn-arc'), turnHead = q('turn-head');
      const TURN = turnPts(RING);
      const put = (k: string, at: V, sc: number, o2: number): void => {
        const el = q(k);
        op(el, o2);
        if (o2 > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const C = bindCounts(S, chainG, put);
      bEnd = B3.stream + C.end + 0.6;
      const TEND = [B1.end, B2.end, bEnd, panel ? B4P.end : B4.end];

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t2 = T(1), t3 = T(2), t4 = T(3);

        /* ---- camera: in with beat 2, out in beat 3, smaller in beat 4 */
        const zin = mv(t2, B2.zoom, B2.zoomD) * (1 - mv(t3, B3.out, B3.outD));
        const wv = panel ? mv(t4, B4P.cam, B4P.camD) : mv(t4, B4.cam, B4.camD);
        const cam = wv > 0 ? tween(B, WV, wv) : tween(B, Z, zin), k = kOf(cam.s);
        set(camG, 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        glyphs.forEach(({ el, c }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`));

        /* ---- beat 1: the 12 H⁺ counted on the figure */
        C.tally(b === 0 ? tt : -1);
        // NADPH (2, made by linear flow) lit in beats 1 and 3; in beat 3 the ATP of the reaction row dims, so that only
        // the 3 ATP made read as a count
        swap('nadph', b === 0 || b === 2);
        swap('atp', b === 2);

        /* ---- names and glows (point, then do) */
        const named = (t0: number): number => (b === 1 ? tw(tt, t0, t0 + 0.3) : 0);
        op(q('ld-psi'), named(B2.lPsi) * (1 - tw(t2, B2.holdA + 0.1, B2.holdA + 0.4)));
        op(q('ld-rc'), named(B2.lRc) * (1 - tw(t2, B2.holdA + 0.1, B2.holdA + 0.4)));
        op(q('ld-b6f'), named(B2.lB6f) * (1 - tw(t2, B2.holdA + 0.1, B2.holdA + 0.4)));
        op(q('g-psi'), glowAt(t2, B2.lPsi, 0.9));
        op(q('g-p700'), glowAt(t2, B2.lRc, 1.0));
        op(q('g-fd'), glowAt(t2, B2.gFd, 0.8));
        op(q('g-b6f'), glowAt(t2, B2.lB6f, 0.9));
        op(q('g-pc'), glowAt(t2, B2.gPc, 0.8));
        const n3 = tw(t3, B3.names, B3.names + 0.3) * (1 - tw(t4, 0, 0.3));
        op(q('ld-rot'), n3);
        op(q('ld-head'), n3);
        op(q('g-rot'), glowAt(t3, B3.names, 0.9));
        op(q('g-head'), glowAt(t3, B3.names + 0.15, 0.9));

        /* ---- light at photosystem I: the slide's wave, cleared, then drawn in from above; it stays */
        let lOp = 1, lY = 1000;
        if (b === 1) {
          if (tt < B2.light - 0.05) lOp = 1 - tw(tt, 0, 0.35);
          else lY = lerp(90, 250, smooth((tt - B2.light) / B2.lightD));
        }
        lightW.forEach(g => op(g, lOp));
        set(q('lclip'), 'height', f1(lY + 200));
        hIn.forEach(g => op(g, b === 3 ? 1 - tw(tt, 0.2, 0.6) : 1));

        /* ---- the electron: P700 → ferredoxin → b₆f's stroma side; then b₆f → plastocyanin → P700 */
        put('rcglow', P700, k, b === 1 ? tw(tt, B2.flash, B2.flash + 0.12) * (1 - tw(tt, B2.flash + 0.25, B2.flash + 0.7)) : 0);
        const home = B2.e + B2.eD;
        put('rcring', P700, k, b === 1 ? tw(tt, B2.jump + 0.1, B2.jump + 0.25) * (1 - tw(tt, home - 0.05, home)) : 0);
        let e: V = P700, eOp = 0;
        if (b === 1) {
          eOp = tw(tt, B2.flash, B2.flash + 0.2);
          if (tt < B2.jump) e = P700;
          else if (tt < B2.route) e = along(L.A, smooth((tt - B2.jump) / B2.jumpD));
          else if (tt < B2.d) e = along(L.B, smooth((tt - B2.route) / B2.routeD));
          else if (tt < B2.e) e = along(L.D, smooth((tt - B2.d) / B2.dD));
          else e = along(L.E, smooth((tt - B2.e) / B2.eD));
        } else if (b === 2) { e = P700; eOp = 1 - tw(tt, B3.out, B3.out + 0.4); }
        put('el', e, k, eOp);
        put('l-e', e, k, eOp);

        /* ---- the cycle's 2 H⁺: stroma → b₆f's stroma side → through b₆f → the lumen, apart from b₆f's 8 */
        [0, 1].forEach(i => {
          let h: V = CYC_FROM[i], hOp = 0;
          if (b === 1) {
            hOp = tw(tt, B2.hIn + i * 0.1, B2.hIn + i * 0.1 + 0.25) * (1 - tw(tt, B2.cross + B2.crossD - 0.05, B2.cross + B2.crossD));
            if (tt < B2.cross) h = lerpV(CYC_FROM[i], CYC_AT[i], smooth((tt - B2.drop - i * 0.1) / (B2.dropD - 0.1)));
            else h = along(cycCross(i), smooth((tt - B2.cross - i * 0.12) / (B2.crossD - 0.12)));
          }
          put(`h${i}`, h, k, hOp);
        });
        C.cycRest(b === 1 ? tw(tt, B2.cross + B2.crossD - 0.1, B2.cross + B2.crossD) : b === 2 ? 1 : 0);
        op(q('cyc-tag'), b === 1 ? tw(tt, B2.tag, B2.tag + 0.35) : b === 2 ? 1 - tw(tt, B3.stream + C.c0 + 13 * C.dt, B3.stream + C.c0 + 13 * C.dt + 0.4) : 0);
        op(q('cyc-note'), b === 1 ? tw(tt, B2.tag, B2.tag + 0.35) : b === 2 ? 1 - tw(tt, B3.out, B3.out + 0.4) : 0);

        /* ---- one full turn: the 14 H⁺, numbered, through the rotor; its arrow follows them; 3 ATP leave the head */
        const ts = b === 2 ? tt - B3.stream : b < 2 ? -1 : 99;
        const f = C.stream(b === 2 ? ts : -1, k, b === 3 ? tw(tt, 0.3, 0.8) : 1);
        const tu = b === 2 ? f / 14 : 0;
        op(q('turn'), b === 2 ? tw(tt, B3.stream - 0.2, B3.stream) : b === 3 ? 1 - tw(tt, 0, 0.4) : 0);
        set(turnArc, 'stroke-dasharray', `${(tu * 100).toFixed(2)} 100`);
        const th = along(TURN, Math.max(0.01, tu)), th0 = along(TURN, Math.max(0, tu - 0.02));
        set(turnHead, 'transform', `translate(${f1(th[0])} ${f1(th[1])}) rotate(${(Math.atan2(th[1] - th0[1], th[0] - th0[0]) * 180 / Math.PI).toFixed(1)}) scale(${k.toFixed(3)})`);
        op(turnHead, tu > 0.01 ? 1 : 0);
        [1, 2, 3].forEach((n, i) => {
          const a = C.atpAt(n);
          put(`atp${i}`, lerpV(HEAD, ATP_TO[i], mv(ts, a, 0.8)), k, b === 2 ? tw(ts, a, a + 0.2) : b === 3 ? 1 - tw(tt, 0, 0.5) : 0);
        });

        /* ---- beat 4: conditions; the consequence on the figure; the clipping or the panel */
        const cons = panel ? [B4P.acid, B4P.heat, B4P.prot] : [B4.acid, B4.heat, B4.prot];
        const ca = tw(t4, cons[0], cons[0] + 0.5), ch = tw(t4, cons[1], cons[1] + 0.5), cp = tw(t4, cons[2], cons[2] + 0.5);
        op(q('acid'), ca);
        put('l-acid', [0, 0], 1, ca);
        op(q('heat'), ch);
        put('l-heat', [0, 0], 1, ch);
        put('l-prot', [0, 0], 1, cp);
        if (panel) {
          op(q('panel'), tw(t4, B4P.cam + 0.6, B4P.cam + 1.0));
          B4P.rows.forEach((r, i) => op(q(`prow${i}`), tw(t4, r, r + 0.35)));
        } else {
          CONDS.forEach((_, i) => op(q(`cond${i}`), tw(t4, B4.icons + i * 0.3, B4.icons + i * 0.3 + 0.3)));
          op(q('clip'), tw(t4, B4.clip, B4.clip + 0.3));
        }

        /* ---- the readout: always on; it explains, then counts */
        drawReadout(S, {
          why: b === 0 ? tw(tt, B1.why, B1.why + 0.4) : 1,
          need: b === 0 ? tw(tt, B1.need, B1.need + 0.4) : 1,
          cyc: b === 1 ? tw(tt, B2.tag, B2.tag + 0.35) : b > 1 ? 1 : 0,
          tot: b === 2 ? tw(tt, B3.sum, B3.sum + 0.35) : b > 2 ? 1 : 0,
          grow: b === 2 ? Math.max(0, Math.min(1, (f - 12) / 2)) : b > 2 ? 1 : 0,
          pCyc: b === 1 ? glowAt(tt, B2.tag, 0.9) * 0.9 : 0,
          pTot: b === 2 ? glowAt(tt, B3.sum, 0.9) * 0.9 : 0,
          pRatio: b === 2 ? glowAt(ts, C.c0 + 13 * C.dt, 1.0) * 0.9 : 0,
        });
      };
    },
  };
}

/** The rotor's turn: an ellipse round the c-ring (seen from the side), drawn from the front, once round. */
export function turnPts(c: V): V[] {
  const rx = 40, ry = 12, n = 48, out: V[] = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (i / n) * 2 * Math.PI * 0.94; out.push([c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a)]); }
  return out;
}
export const turnPath = (c: V): string => turnPts(c).map((q, i) => `${i ? 'L' : 'M'}${f1(q[0])},${f1(q[1])}`).join('');
/** A heat wave rising from (x, y0) to y1. */
export function heatPath(x: number, y0: number, y1: number): string {
  let d = '';
  for (let i = 0; i <= 24; i++) { const u = i / 24, y = lerp(y0, y1, u); d += `${i ? 'L' : 'M'}${f1(x + 5 * Math.sin(u * 3 * Math.PI))},${f1(y)}`; }
  return d;
}
