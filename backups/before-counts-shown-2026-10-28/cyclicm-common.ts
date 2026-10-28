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
import { focusSvg, GEO, hring, LIT_CYCLIC, tagG, type Part } from '../figs/chain';
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
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    svg += `${base.slice(at, w.a)}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${parts[i] ?? 'x'}">${w.inner}</g>`;
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
export const CONDS: Cond[] = ['light', 'drought', 'cold', 'c4'];

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

/** The whole chain beside the readout: the card (949 × 708 stage px) centred in x 372–1600. */
const B: Tf = { s: 1.07, t: [986 - 1.07 * 400, 370 - 1.07 * 300] };
/** The cycle, close: figure x 112 at the readout's right edge (stage 380), y 100 at the top (figure x 112–722, y 100–470). */
const Z: Tf = { s: 2.0, t: [380 - 112 * 2.0, -100 * 2.0] };
/** Beat 4, m1: the chain smaller, below the condition strip, the clipping on its right. */
const W1: Tf = { s: 0.86, t: [380 - CARD.x * 0.86, 150 - CARD.y * 0.86] };
/** Beat 4, m3: the chain smaller still, the conditions panel on its right. */
const W3: Tf = { s: 0.84, t: [384 - CARD.x * 0.84, 92 - CARD.y * 0.84] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** (s > B.s ? -0.7 : -0.3);

// Beat 1: the 12 H⁺ explained; the need and the gap.
const B1 = { why: 0.3, glow: 0.3, hold: 1.8, need: 1.95, end: 3.0 };
// Beat 2: (a) zoom, names, light, e⁻ to Fd and back to PQ; (b) 2 H⁺ via PQ to the lumen; (c) e⁻ back to P700.
const B2 = {
  zoom: 0, zoomD: 1.2, lPsi: 0.95, lRc: 1.4, light: 2.1, lightD: 0.8, flash: 2.95, gFd: 3.25, jump: 3.7, jumpD: 1.0,
  gPq: 4.75, route: 5.1, routeD: 1.5, holdA: 6.8,
  hIn: 6.95, hMove: 7.25, hD: 1.0, lB6f: 8.35, go: 9.0, goD: 1.2, rel: 10.3, relD: 1.0, cnt: 11.1, holdB: 11.9,
  gPc: 12.0, d: 12.35, dD: 1.1, e: 13.6, eD: 1.0, back: 13.7, backD: 1.2, end: 15.1,
};
// Beat 3: zoom out; 12 + 2 = 14 H⁺; the rotor turns once; 3 ATP; the bar grows.
const B3 = { out: 0, outD: 1.2, sum: 1.1, hold: 1.9, names: 2.0, turn: 2.6, turnD: 1.8, atp: [3.0, 3.6, 4.2], grow: 3.3, growD: 1.2, end: 4.9 };
// Beat 4: m1: icons; consequence; clipping. m3: one panel row per click (the first with the consequence).
const B4 = { cam: 0, camD: 1.2, icons: 0.9, hold1: 2.4, acid: 2.5, heat: 3.0, prot: 3.5, hold2: 4.5, clip: 4.6, end: 5.3 };
const B4P = { cam: 0, camD: 1.2, rows: [1.0, 2.6, 4.2, 5.8], hold: [2.4, 4.0, 5.6], acid: 1.4, heat: 1.7, prot: 2.0, end: 6.8 };

/** m3's panel rows: the condition and why plants use cyclic flow there (Yamori & Shikanai 2016). */
const PANEL: Array<{ c: Cond; name: string; why: string }> = [
  { c: 'light', name: 'high or fluctuating light', why: 'acidic lumen: heat dissipation,<br>photosystem I protected' },
  { c: 'drought', name: 'drought (stomata closed)', why: 'more photorespiration:<br>more ATP per NADPH' },
  { c: 'cold', name: 'cold', why: 'slow CO₂ fixation:<br>photosystem I protected' },
  { c: 'c4', name: 'C₄ bundle-sheath cells', why: 'the C₄ cycle needs<br>extra ATP' },
];
const PN = { x: 1140, y: 20, w: 448, row: 170 };

export interface Opt { id: string; name: string; note: string; when: 'strip' | 'panel' }

export function makeSlideStaging(o: Opt): Staging {
  const P = `cym${o.id}`;
  const { pq: PQ, hem: HEM, pc: PC, p700: P700, fd: FD, ring: RING } = GEO;
  const DOCK: V = [HEM[0] - 26, HEM[1] - 3];
  const ON_PQ: V = [4, 1], H_ON_PQ: V[] = [[-11, -19], [11, -19]];
  const H_FROM: V[] = [[PQ[0] - 8, 178], [PQ[0] + 14, 168]];
  const LAB_OFFZ: V = [-58, -42];
  const panel = o.when === 'panel';
  const WV = panel ? W3 : W1;
  // the ATP tags leave the head of ATP synthase for the stroma above it
  const HEAD: V = [712, 150], ATP_TO: V[] = [[664, 30], [716, 30], [768, 30]];

  const stripSvg = (): string => CONDS.map((c, i) => {
    const x = 384 + i * 302, [a, b] = COND_NAME[c];
    return `<g data-k="cond${i}" opacity="0" display="none"><g transform="translate(${x + 38} 72)">${condIcon(c)}</g>
      ${txt(a, 'cym-cond', x + 84, b ? 66 : 80)}${b ? txt(b, 'cym-cond', x + 84, 92) : ''}</g>`;
  }).join('');
  const panelSvg = (): string => `<g data-k="panel" opacity="0" display="none"><rect class="cym-panel" x="${PN.x}" y="${PN.y}" width="${PN.w}" height="${PN.row * 4 + 20}" rx="18"/></g>
    ${PANEL.map((r, i) => {
      const y = PN.y + 10 + i * PN.row;
      const [w1, w2] = r.why.split('<br>');
      return `<g data-k="prow${i}" opacity="0" display="none"><g transform="translate(${PN.x + 52} ${y + PN.row / 2})">${condIcon(r.c, 36)}</g>
        ${txt(r.name, 'cym-pname', PN.x + 104, y + 54)}${txt(w1, 'cym-pwhy', PN.x + 104, y + 90)}${txt(w2, 'cym-pwhy', PN.x + 104, y + 120)}
        ${i < 3 ? `<path class="cym-prule" d="M${PN.x + 24},${y + PN.row}H${PN.x + PN.w - 24}"/>` : ''}</g>`;
    }).join('')}`;

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
        ${glowRing('g-wh', P, [222, 402], 46)}${glowRing('g-bh', P, [300, 396], 38)}
        ${glowRing('g-p700', P, P700, 30)}${glowRing('g-fd', P, FD, 30)}${glowRing('g-pq', P, PQ, 32)}
        ${glowRing('g-b6f', P, [HEM[0] + 2, HEM[1] + 6], 78)}${glowRing('g-pc', P, PC, 32)}${glowRing('g-rot', P, RING, 40)}${glowRing('g-head', P, [712, 175], 66)}
        ${glowRing('g-psi', P, [499, 293], 92)}
        ${glyph('ld-psi', txt('photosystem I', 'chn-name chn-halo cym-cs', 490, 374, 'middle'))}
        ${leader('ld-rc', 'reaction centre (P700)', [548, 406], 'start', [554, 393], [P700[0] + 4, P700[1] + 6])}
        ${leader('ld-b6f', B6F, [300, 160], 'middle', [300, 167], [300, 252])}
        ${leader('ld-rot', 'rotor (c-ring)', [632, 380], 'end', [612, 366], [RING[0] - 8, RING[1] + 10])}
        ${leader('ld-head', 'head', [792, 206], 'start', [794, 196], [770, 182])}
        ${glyph('rcglow', `<circle r="24" fill="url(#${P}-rcglow)"/>`)}${glyph('rcring', '<circle class="cym-ring" r="8"/>')}
        <g data-k="turn" opacity="0" display="none"><path class="cym-turn-bg" d="${turnPath(RING)}"/><path class="cym-turn" data-k="turn-arc" d="${turnPath(RING)}" pathLength="100" stroke-dasharray="0 100"/>
          <path class="cym-turnh" data-k="turn-head" d="M0,-7L13,0L0,7Z"/></g>
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
      const chainG = q('chain'), camG = q('cam');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      // counter-scaled: the figure's free text (about its anchor), its glyph groups (about their centre), the story's labels
      const texts = [...Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('g.chn-g')),
        ...Array.from(camG.querySelectorAll<SVGTextElement>('text.cym-cs'))].map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const glyphs = Array.from(chainG.querySelectorAll<SVGGElement>('g.chn-g')).map(el => { const b = el.getBBox(); return { el, c: [b.x + b.width / 2, b.y + b.height / 2] as V }; });
      const lightW = parts('light-psi');
      lightW.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const pqW = parts('pq'), pqBody = pqW.filter(g => !g.querySelector('text')), pqText = pqW.filter(g => g.querySelector('text'));
      const pqLab0 = pqText[0]?.querySelector('text');
      const PQLAB: V = pqLab0 ? [Number(pqLab0.getAttribute('x')), Number(pqLab0.getAttribute('y'))] : [PQ[0], 246];
      const LAB_OFF0: V = [PQLAB[0] - PQ[0], PQLAB[1] - PQ[1]];
      const load = parts('pq-h-load'), hIn = parts('pq-h-in');
      const outRings = Array.from(chainG.querySelectorAll<SVGGElement>('[data-p="pq-h-out"] g.chn-g'));
      const HOUT: V[] = outRings.length === 2 ? outRings.map(g => { const c = g.querySelector('circle'); return [Number(c?.getAttribute('cx')), Number(c?.getAttribute('cy'))] as V; }) : [[285, 388], [314, 404]];
      const path = (p: string, cls: string): SVGPathElement | null => chainG.querySelector<SVGPathElement>(`[data-p="${p}"] path.${cls}`);
      const onPq = (c: V): V => [c[0] + ON_PQ[0], c[1] + ON_PQ[1]];
      const LEG_A: V[] = [P700, ...sample(path('e-psi-fd', 'chn-e')), FD];
      const LEG_B: V[] = [FD, ...sample(path('e-fd-pq', 'chn-e'), 60), onPq(PQ)];
      const LEG_D: V[] = [onPq(DOCK), HEM, ...sample(path('e-b6f-pc', 'chn-e')), PC];
      const LEG_E: V[] = [PC, ...sample(path('e-pc-psi', 'chn-e')), P700];
      const hPath = sample(path('pq-h-out', 'chn-h'));
      const LEG_H: V[][] = [0, 1].map(i => [[DOCK[0] + H_ON_PQ[i][0], DOCK[1] + H_ON_PQ[i][1]] as V, ...hPath, HOUT[i]]);
      const turnArc = q('turn-arc'), turnHead = q('turn-head');
      const TURN = turnPts(RING);
      const put = (k: string, at: V, sc: number, o2: number): void => {
        const el = q(k);
        op(el, o2);
        if (o2 > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const shift = (els: Element[], d: V): void => els.forEach(el => set(el, 'transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)})`));
      const TEND = [B1.end, B2.end, B3.end, panel ? B4P.end : B4.end];

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), t4 = T(3);

        /* ---- camera: in with beat 2, out in beat 3, smaller in beat 4 */
        const zin = mv(t2, B2.zoom, B2.zoomD) * (1 - mv(t3, B3.out, B3.outD));
        const wv = panel ? mv(t4, B4P.cam, B4P.camD) : mv(t4, B4.cam, B4.camD);
        const cam = wv > 0 ? tween(B, WV, wv) : tween(B, Z, zin), k = kOf(cam.s);
        set(camG, 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        glyphs.forEach(({ el, c }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`));
        /** The story's own marks: shown while the camera is in. */
        const inView = b === 1 ? 1 : b === 2 ? 1 - tw(tt, B3.out, B3.out + 0.4) : 0;
        /** The slide's marks the story takes over: away as the camera goes in, back as it comes out. */
        const slideOwn = b === 0 ? 1 : b === 1 ? 1 - tw(tt, 0, 0.4) : tw(t3, B3.out + 0.5, B3.out + 1.0);

        /* ---- beat 1: where the 12 H⁺ come from */
        op(q('g-wh'), glowAt(t1, B1.glow, 1.3));
        op(q('g-bh'), glowAt(t1, B1.glow + 0.5, 1.3));

        /* ---- names and glows (point, then do) */
        const named = (t0: number): number => (b === 1 ? tw(tt, t0, t0 + 0.3) : 0);
        op(q('ld-psi'), named(B2.lPsi) * (1 - tw(t2, B2.holdA + 0.1, B2.holdA + 0.4)));
        op(q('ld-rc'), named(B2.lRc) * (1 - tw(t2, B2.holdA + 0.1, B2.holdA + 0.4)));
        op(q('ld-b6f'), named(B2.lB6f) * (1 - tw(t2, B2.holdB + 0.1, B2.holdB + 0.4)));
        op(q('g-psi'), glowAt(t2, B2.lPsi, 0.9));
        op(q('g-p700'), glowAt(t2, B2.lRc, 1.0));
        op(q('g-fd'), glowAt(t2, B2.gFd, 0.8));
        op(q('g-pq'), glowAt(t2, B2.gPq, 0.8));
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

        /* ---- plastoquinone: to b₆f and back */
        const go = mv(t2, B2.go, B2.goD), back = mv(t2, B2.back, B2.backD);
        const pq = back > 0 ? lerpV(DOCK, PQ, back) : lerpV(PQ, DOCK, go);
        const dPq: V = [pq[0] - PQ[0], pq[1] - PQ[1]];
        shift(pqBody, dPq);
        const lo = lerpV(LAB_OFF0, LAB_OFFZ, zin);
        shift(pqText, [pq[0] + lo[0] - PQLAB[0], pq[1] + lo[1] - PQLAB[1]]);
        load.forEach(g => op(g, slideOwn));
        hIn.forEach(g => op(g, b === 3 ? 1 - tw(tt, 0.2, 0.6) : slideOwn));
        outRings.forEach(g => op(g, slideOwn));

        /* ---- the electron: P700 → ferredoxin → back to plastoquinone → with it to b₆f → plastocyanin → P700 */
        put('rcglow', P700, k, b === 1 ? tw(tt, B2.flash, B2.flash + 0.12) * (1 - tw(tt, B2.flash + 0.25, B2.flash + 0.7)) : 0);
        const home = B2.e + B2.eD;
        put('rcring', P700, k, b === 1 ? tw(tt, B2.jump + 0.1, B2.jump + 0.25) * (1 - tw(tt, home - 0.05, home)) : 0);
        let e: V = P700, eOp = 0;
        if (b === 1) {
          eOp = tw(tt, B2.flash, B2.flash + 0.2);
          if (tt < B2.jump) e = P700;
          else if (tt < B2.route) e = along(LEG_A, smooth((tt - B2.jump) / B2.jumpD));
          else if (tt < B2.d) e = tt < B2.route + B2.routeD ? along(LEG_B, smooth((tt - B2.route) / B2.routeD)) : onPq(pq);
          else if (tt < B2.e) e = along(LEG_D, smooth((tt - B2.d) / B2.dD));
          else e = along(LEG_E, smooth((tt - B2.e) / B2.eD));
        } else if (b === 2) { e = P700; eOp = inView; }
        put('el', e, k, eOp);
        // its label gives way while the H⁺ ride on plastoquinone beside it
        const eLab = b === 1 ? tw(tt, B2.flash, B2.flash + 0.2) * (1 - tw(tt, B2.hMove + 0.3, B2.hMove + 0.5) * (1 - tw(tt, B2.d + 0.1, B2.d + 0.3))) : b === 2 ? inView : 0;
        put('l-e', e, k, eLab);

        /* ---- 2 H⁺: from the stroma onto plastoquinone, with it to b₆f, out into the lumen */
        [0, 1].forEach(i => {
          let h: V = H_FROM[i], hOp = 0;
          const onIt: V = [pq[0] + H_ON_PQ[i][0], pq[1] + H_ON_PQ[i][1]];
          if (b === 1) {
            hOp = tw(tt, B2.hIn + i * 0.1, B2.hIn + i * 0.1 + 0.25);
            const r0 = B2.rel + i * 0.15;
            if (tt < B2.hMove + B2.hD) h = lerpV(H_FROM[i], onIt, smooth((tt - B2.hMove - i * 0.1) / (B2.hD - 0.1)));
            else if (tt < r0) h = onIt;
            else h = along(LEG_H[i], smooth((tt - r0) / (B2.relD - 0.15)));
          } else if (b === 2) { h = HOUT[i]; hOp = inView; }
          put(`h${i}`, h, k, hOp);
        });

        /* ---- one full turn: the rotor's arrow sweeps once; 3 ATP leave the head */
        const tu = mv(t3, B3.turn, B3.turnD);
        op(q('turn'), b === 2 ? tw(tt, B3.turn - 0.2, B3.turn) : b === 3 ? 1 - tw(tt, 0, 0.4) : 0);
        set(turnArc, 'stroke-dasharray', `${(tu * 100).toFixed(2)} 100`);
        const th = along(TURN, Math.max(0.01, tu)), th0 = along(TURN, Math.max(0, tu - 0.02));
        set(turnHead, 'transform', `translate(${f1(th[0])} ${f1(th[1])}) rotate(${(Math.atan2(th[1] - th0[1], th[0] - th0[0]) * 180 / Math.PI).toFixed(1)}) scale(${k.toFixed(3)})`);
        op(turnHead, tu > 0.01 ? 1 : 0);
        B3.atp.forEach((a, i) => {
          const u = mv(t3, a, 0.8);
          put(`atp${i}`, lerpV(HEAD, ATP_TO[i], u), k, b === 2 ? tw(tt, a, a + 0.2) : b === 3 ? 1 - tw(tt, 0, 0.5) : 0);
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
          cyc: b === 1 ? tw(tt, B2.cnt, B2.cnt + 0.35) : b > 1 ? 1 : 0,
          tot: b === 2 ? tw(tt, B3.sum, B3.sum + 0.35) : b > 2 ? 1 : 0,
          grow: b === 2 ? mv(tt, B3.grow, B3.growD) : b > 2 ? 1 : 0,
          pCyc: b === 1 ? glowAt(tt, B2.cnt, 0.9) * 0.9 : 0,
          pTot: b === 2 ? glowAt(tt, B3.sum, 0.9) * 0.9 : 0,
          pRatio: b === 2 ? glowAt(tt, B3.grow + 0.6, 1.0) * 0.9 : 0,
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
