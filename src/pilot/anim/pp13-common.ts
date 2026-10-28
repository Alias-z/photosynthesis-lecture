// Slide 13 · Chlorophyll fluorescence: the parts the four stagings share (pp13-a … pp13-d; beats PP13, PP13_HIST,
// PP13_TRACE, PP13_PAIR of beats-pp.ts). All in stage units (1600 × 740) unless a function says otherwise.
// - The Kautsky clipping: the two portraits of Hans Kautsky (Schreiber & Lichtenthaler 2025, Fig. 2, CC BY-NC-ND 4.0:
//   shown whole and unaltered), with the headline "Kautsky & Hirsch, 1931".
// - The 1931 induction curve, drawn from Kautsky & Hirsch's description as told by Schreiber & Lichtenthaler 2025:
//   low at light-on, a rise within a second to a severalfold higher peak, a decline over minutes to a low level. The time
//   axis is broken after the peak; the curve is schematic (no values).
// - The darkened room: a UV lamp over a dark-kept leaf that glows red as the curve says.
// - A leaf with a leaf-clip fluorometer and its trace (measuring light gives F_o, a saturating pulse F_m), with the
//   F_v/F_m readout. Pumpkin values from Tyystjärvi & Aro 1996, Fig. 1A: 0.83 before light, 0.52 after 4.6 h at
//   548 µmol m⁻² s⁻¹ with D1 repair blocked (lincomycin). F_o is drawn the same for both leaves (schematic).
// - The real PAM trace: figure v3 of figs/pp13f.ts (Ruban 2016, Fig. 1A, relabelled) drawn exactly, revealed left to
//   right like a recorder; its instrument lights (measuring light, actinic light, saturating pulse).
// - The photosystem II population as a dot grid (open / closed / quenching, after figure v5; the pattern is illustrative).
// - The SIF maps: Guanter et al. 2014, Fig. 1 (Earth, as figure v7) and Porcar-Castell et al. 2021, Fig. 3e (crop plots
//   from the air).
import '../figs/clipping.css';
import './pp13-common.css';
import kautskyJpg from '../../assets/refs/L6-photoprotection/kautsky-portrait.jpg';
import guanterJpg from '../../assets/photos/14-guanter.jpg';
import sifAirJpg from '../../assets/refs/L6-photoprotection/porcarcastell2021-sif-imaging.jpg';
import { draw as fig13 } from '../figs/pp13f';
import { F, shot } from '../figs/pp-kit';
import { cutPath, f1, lab, lerp, smooth, type Setters, type Tf, type V } from './pp-stage';

export const FO = F('o'), FM = F('m'), FS = F('s'), FV = F('v'), FM1 = `${F('m')}′`, FVFM = `${F('v')}/${F('m')}`;
const clamp = (x: number): number => Math.max(0, Math.min(1, x));

/* ================================================================ nested scenes (staging A) */

export const comp = (a: Tf, b: Tf): Tf => ({ s: a.s * b.s, t: [a.s * b.t[0] + a.t[0], a.s * b.t[1] + a.t[1]] });
export const inv = (a: Tf): Tf => ({ s: 1 / a.s, t: [-a.t[0] / a.s, -a.t[1] / a.s] });
/** Places a scene's local point `local` at the outer point `at`, z times smaller. */
export const nestAt = (at: V, local: V, z: number): Tf => ({ s: 1 / z, t: [at[0] - local[0] / z, at[1] - local[1] / z] });
/** Opacity of a nested scene from its scale on the stage: shown from ≈ 0.25× to ≈ 2.5×. */
export const sceneOp = (s: number): number => clamp((s - 0.12) / 0.14) * clamp((4 - s) / 1.5);

/* ================================================================ the Kautsky clipping */

const KPIC = { w: 646, h: 471 };
/** The clipping: headline, the two portraits (whole, unaltered), the name, the credit; `extra` px of newsprint below for
 *  `inner` (drawn from y1 down). Hidden until shown (group k). */
export function kautskyCard(p: string, k: string, x: number, y: number, w: number, extra = 0, inner = ''): { svg: string; h: number; y1: number } {
  const m = 18, pw = w - 2 * m, ph = pw * KPIC.h / KPIC.w, iy = y + m + 40, ny = iy + ph + 30, y1 = ny + 36;
  const h = y1 - y + extra + m - 8;
  return {
    h, y1,
    svg: `<g data-k="${k}" opacity="0" display="none"><g transform="rotate(-1 ${f1(x + w / 2)} ${f1(y + h / 2)})">
      <defs><filter id="${p}-${k}sh" x="-10%" y="-8%" width="120%" height="118%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
      <path class="clip-paper" d="${cutPath(x, y, w, h, 17, 3.2)}" filter="url(#${p}-${k}sh)"/>
      <text class="clip-name" x="${f1(x + m)}" y="${f1(y + m + 26)}" font-size="27">Kautsky &amp; Hirsch, 1931</text>
      <image href="${kautskyJpg}" x="${f1(x + m)}" y="${f1(iy)}" width="${f1(pw)}" height="${f1(ph)}"/>
      <text class="clip-key" x="${f1(x + m)}" y="${f1(ny - 4)}" font-size="20">Hans Kautsky (1891–1966)</text>
      <text class="ppa-cr" x="${f1(x + m)}" y="${f1(ny + 16)}">photos: Schreiber &amp; Lichtenthaler 2025, Fig. 2 · CC BY-NC-ND 4.0</text>
      ${inner}</g></g>`,
  };
}

/* ================================================================ the 1931 induction curve (schematic) */

/** The glow along the drawn time axis u (0–1): dark, light on at 0.06 (low), peak at 0.2 (within a second), decline over
 *  minutes to a low level (the axis is broken at 0.23). */
export const induction = (u: number): number =>
  u < 0.06 ? 0 : u < 0.2 ? lerp(0.18, 1, smooth((u - 0.06) / 0.14)) : 0.27 + 0.73 * Math.exp(-(u - 0.2) / 0.17);
export interface Box { x: number; y: number; w: number; h: number }
const IX = (b: Box, u: number): number => b.x + u * b.w, IY = (b: Box, g: number): number => b.y + b.h - g * b.h * 0.88;
export function inductionSvg(k: string, b: Box): string {
  const bx = IX(b, 0.23), by = b.y + b.h;
  return `<path class="ppa-axis" d="M${b.x},${b.y - 6}V${by}H${b.x + b.w + 6}"/>
    <path fill="#fbfaf6" stroke="none" d="M${f1(bx - 7)},${by - 7}h14v14h-14z"/><path class="ppa-axis" d="M${f1(bx - 8)},${by + 7}l7,-14M${f1(bx + 1)},${by + 7}l7,-14"/>
    <path data-k="${k}-c" class="ppa-line" stroke="#c8361e" d="M${b.x},${by}"/>
    <text class="ppa-s" transform="translate(${b.x - 16} ${b.y + b.h / 2}) rotate(-90)" text-anchor="middle">red fluorescence</text>
    ${lab('time in UV light', 'ppa-s', b.x + b.w / 2, by + 30, 'middle')}
    <g data-k="${k}-on" opacity="0" display="none"><path class="ppa-guide" d="M${f1(IX(b, 0.06))},${by}V${f1(b.y + 6)}"/>${lab('light on', 'ppa-s', IX(b, 0.06) + 6, b.y + 14)}</g>
    <g data-k="${k}-l1" opacity="0" display="none">${lab('rise within a second', 'ppa-l ppa-red ppa-halo', IX(b, 0.24), IY(b, 1) + 8)}</g>
    <g data-k="${k}-l2" opacity="0" display="none">${lab('decline over minutes', 'ppa-l ppa-red ppa-halo', IX(b, 0.5), IY(b, induction(0.5)) - 20)}</g>`;
}
/** Draws the curve up to u; returns the glow at u. */
export function drawInduction(S: Setters, k: string, b: Box, u: number): number {
  const n = Math.max(2, Math.round(u * 160)), pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const v = (i / n) * u;
    pts.push(`${f1(IX(b, v))},${f1(IY(b, induction(v)))}`);
    // the jump at light-on: a vertical step
    if (v < 0.06 && ((i + 1) / n) * u >= 0.06) pts.push(`${f1(IX(b, 0.06))},${f1(IY(b, 0))}`, `${f1(IX(b, 0.06))},${f1(IY(b, 0.18))}`);
  }
  S.set(S.q(`${k}-c`), 'd', `M${pts.join('L')}`);
  S.op(S.q(`${k}-on`), u >= 0.06 ? 1 : 0);
  S.op(S.q(`${k}-l1`), clamp((u - 0.22) / 0.05));
  S.op(S.q(`${k}-l2`), clamp((u - 0.62) / 0.05));
  return induction(u);
}

/* ================================================================ leaves */

/** A pumpkin-like leaf: five shallow lobes round (cx, cy), radius R, the stalk notch turned to `ang` degrees (0 = down),
 *  with five main veins and the stalk. */
export function leafSvg(cx: number, cy: number, R: number, ang: number, cls = 'pp-leaf'): string {
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const th = -Math.PI + (i / 120) * 2 * Math.PI;   // 0 = tip (up), ±π = the stalk notch (down)
    const notch = 1 - 0.32 * Math.exp(-((Math.abs(th) - Math.PI) ** 2) / 0.05);
    const r = R * (0.84 + 0.16 * Math.cos(5 * th)) * notch;
    pts.push(`${f1(r * Math.sin(th))},${f1(-r * Math.cos(th))}`);
  }
  const base: V = [0, R * 0.42];
  const veins = [0, 1, 2, 3, 4].map(j => {
    const th = (j - 2) * (2 * Math.PI / 5), r = R * 0.9;
    return `M${f1(base[0])},${f1(base[1])}Q${f1(r * 0.45 * Math.sin(th))},${f1(-r * 0.45 * Math.cos(th) + R * 0.1)} ${f1(r * Math.sin(th))},${f1(-r * Math.cos(th))}`;
  }).join('');
  return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${ang})">
    <path class="pp-ar pp-k-green" style="stroke-width:7" d="M${f1(base[0])},${f1(base[1])}Q${f1(R * 0.1)},${f1(R * 1.0)} ${f1(-R * 0.1)},${f1(R * 1.45)}"/>
    <path class="${cls}" d="M${pts.join('L')}Z"/>
    <path fill="none" stroke="#5d8a48" stroke-width="2.4" stroke-linecap="round" d="${veins}"/></g>`;
}
/** A leaf clip seen from above at (x, y), its cable running to `to`. */
export const clipSvg = (x: number, y: number, to: V, s = 1): string =>
  `<path fill="none" stroke="#3d3d3a" stroke-width="${f1(7 * s)}" stroke-linecap="round" d="M${f1(x + 40 * s)},${f1(y)}C${f1(x + 140 * s)},${f1(y)} ${f1(to[0] - 120 * s)},${f1(to[1])} ${f1(to[0])},${f1(to[1])}"/>
  <rect class="pp-devdk" x="${f1(x - 50 * s)}" y="${f1(y - 30 * s)}" width="${f1(100 * s)}" height="${f1(60 * s)}" rx="${f1(16 * s)}"/>
  <circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(15 * s)}" fill="#8a877d" stroke="#141413" stroke-width="1.6"/>`;
/** The saturating pulse's flash at a clip (group k). */
export const flashSvg = (p: string, k: string, x: number, y: number, r: number): string =>
  `<defs><radialGradient id="${p}-${k}g"><stop offset="0" stop-color="#fffbe8"/><stop offset=".35" stop-color="#ffe27a" stop-opacity=".9"/><stop offset="1" stop-color="#f6c64a" stop-opacity="0"/></radialGradient></defs>
  <circle data-k="${k}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="url(#${p}-${k}g)" opacity="0" display="none"/>`;
/** Flash brightness: on at t0 for ≈ 0.35 s. */
export const flashAt = (t: number, t0: number): number => (t < t0 ? 0 : t < t0 + 0.05 ? (t - t0) / 0.05 : clamp(1 - (t - t0 - 0.12) / 0.3));

/* ================================================================ the fluorometer trace: F_o, the pulse, F_m */

export const FO_LEVEL = 0.17;
export const FVFM_OK = 0.83, FVFM_HURT = 0.52;
/** F_m for a given F_v/F_m with F_o fixed. */
export const fmOf = (r: number): number => FO_LEVEL / (1 - r);
/** Fluorescence along the plot's time axis u (0–1): measuring light from 0.08 (F_o); a saturating pulse at 0.5–0.56. */
export function pulseTrace(u: number, fm: number): number {
  if (u < 0.08) return 0;
  if (u < 0.5 || u >= 0.565) return FO_LEVEL;
  if (u < 0.506) return lerp(FO_LEVEL, fm, (u - 0.5) / 0.006);
  if (u < 0.548) return fm;
  return lerp(fm, FO_LEVEL, (u - 0.548) / 0.017);
}
const PX = (b: Box, u: number): number => b.x + u * b.w, PY = (b: Box, v: number): number => b.y + b.h - v * b.h * 0.92;
function tracePath(b: Box, u: number, fm: number): string {
  const pts: string[] = [], n = Math.max(2, Math.round(u * 400));
  for (let i = 0; i <= n; i++) { const v = (i / n) * u; pts.push(`${f1(PX(b, v))},${f1(PY(b, pulseTrace(v, fm)))}`); }
  return `M${pts.join('L')}`;
}
/** The plot (group k-…): axes, the old trace (grey, dashed) and the new one (red), labels F_o, F_m, F_v. */
export function pulsePlotSvg(k: string, b: Box): string {
  const by = b.y + b.h;
  return `<rect class="p13-band" data-k="${k}-band" x="${f1(PX(b, 0.5))}" y="${b.y}" width="${f1(PX(b, 0.565) - PX(b, 0.5))}" height="${b.h}" opacity="0" display="none"/>
    <path class="ppa-axis" d="M${b.x},${b.y - 6}V${by}H${b.x + b.w + 6}"/>
    <text class="ppa-s" transform="translate(${b.x - 16} ${b.y + b.h / 2}) rotate(-90)" text-anchor="middle">fluorescence</text>
    ${lab('time', 'ppa-s', b.x + b.w / 2, by + 28, 'middle')}
    <path data-k="${k}-old" class="ppa-line" stroke="#b6b2a6" style="stroke-dasharray:6 6;stroke-width:2.6" d="M0,0" opacity="0" display="none"/>
    <path data-k="${k}-new" class="ppa-line" stroke="#c8361e" d="M${b.x},${by}"/>
    <g data-k="${k}-lo" opacity="0" display="none">${lab(FO, 'p13-lv', PX(b, 0.2), PY(b, FO_LEVEL) - 12, 'middle')}</g>
    <g data-k="${k}-lm" opacity="0" display="none"><text data-k="${k}-lmt" class="p13-lv" x="${f1(PX(b, 0.6))}" y="0">${FM}</text></g>
    <g data-k="${k}-fv" opacity="0" display="none"><path data-k="${k}-fva" class="ppa-axis" style="stroke:#3d3d3a;stroke-width:2" d="M0,0"/>
      <text data-k="${k}-fvt" class="p13-lv" x="${f1(PX(b, 0.86) + 10)}" y="0">${FV}</text></g>`;
}
/** Draws the trace to u with F_m `fm`; `old` draws a previous full trace in grey. */
export function drawPulse(S: Setters, k: string, b: Box, u: number, fm: number, old: number | null = null): void {
  S.set(S.q(`${k}-new`), 'd', tracePath(b, Math.max(0.001, u), fm));
  const o = S.q(`${k}-old`);
  S.op(o, old === null ? 0 : 1);
  if (old !== null) S.set(o, 'd', tracePath(b, 1, old));
  S.op(S.q(`${k}-band`), u >= 0.5 && u < 0.62 ? 1 - clamp((u - 0.565) / 0.05) : 0);
  S.op(S.q(`${k}-lo`), clamp((u - 0.2) / 0.04));
  S.op(S.q(`${k}-lm`), clamp((u - 0.51) / 0.02));
  S.set(S.q(`${k}-lmt`), 'y', f1(PY(b, fm) + 8));
  const fv = clamp((u - 0.62) / 0.06);
  S.op(S.q(`${k}-fv`), fv);
  const xa = PX(b, 0.86);
  S.set(S.q(`${k}-fva`), 'd', `M${f1(xa)},${f1(PY(b, FO_LEVEL) - 3)}V${f1(PY(b, fm) + 3)}M${f1(xa - 7)},${f1(PY(b, FO_LEVEL) - 3)}h14M${f1(xa - 7)},${f1(PY(b, fm) + 3)}h14`);
  S.set(S.q(`${k}-fvt`), 'y', f1((PY(b, FO_LEVEL) + PY(b, fm)) / 2 + 9));
}
/** The F_v/F_m readout (group k): a label, the value (k-v) and the definition. */
export const readoutSvg = (k: string, x: number, y: number, a: 'start' | 'middle' = 'start'): string =>
  `<g data-k="${k}">${lab(FVFM, 'p13-lv', x, y, a)}<text data-k="${k}-v" class="ppa-big" x="${a === 'middle' ? x : x + 96}" y="${a === 'middle' ? y + 50 : y + 4}" text-anchor="${a}">–</text>
    ${lab(`${FV} = ${FM} − ${FO}`, 'ppa-s', x, a === 'middle' ? y + 84 : y + 34, a)}</g>`;

/* ================================================================ the real PAM trace (figure v3, revealed) */

/** Figure v3 of slide 13 (Ruban 2016, Fig. 1A, relabelled), drawn at (x, y) w wide (group k), revealed left to right like
 *  a recorder: the figure without its labels sits in a clip that shows only its part left of `X(u)` (u in the paper's
 *  image pixels, 0–742); each label of the figure appears whole once the trace has reached it; the credit always shows. */
export function rubanSvg(p: string, k: string, x: number, y: number, w: number): { svg: string; X: (u: number) => number; Y: (v: number) => number; s: number; labs: number[] } {
  const s = w / 800, h = 600 * s;
  const X = (u: number): number => x + (40 + (u * 700) / 742) * s, Y = (v: number): number => y + (40 + (v * 700) / 742) * s;
  const fig = fig13('v3').replace(/pp13v3/g, `${p}r`);
  const open = fig.slice(0, fig.indexOf('>') + 1).replace('<svg class="fig-svg pp"', `<svg x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" class="fig-svg pp"`);
  const body = fig.slice(fig.indexOf('>') + 1, fig.lastIndexOf('</svg>'));
  // the labels: taken out of the clipped figure; each appears once the trace reaches it (u at its x, by its anchor)
  const texts: string[] = [], labs: number[] = [];
  const bare = body.replace(/<text class="([^"]*)"(?: x="([\d.]+)")?[^>]*>[\s\S]*?<\/text>/g, (t: string, cls: string, xs?: string) => {
    if (cls.includes('pp-cr') || !xs) { texts.push(`<g>${t}</g>`); labs.push(-1); return ''; }
    const fx = Number(xs), a = /text-anchor="(\w+)"/.exec(t)?.[1] ?? 'start';
    const u = ((fx - 40) * 742) / 700 + (a === 'end' ? 0 : a === 'middle' ? 25 : 45);
    texts.push(`<g data-k="${k}-t${labs.length}" opacity="0" display="none">${t}</g>`);
    labs.push(u < 60 ? -1 : u);
    return '';
  });
  return {
    X, Y, s, labs,
    svg: `<g data-k="${k}" opacity="0" display="none"><defs><clipPath id="${p}-${k}rv"><rect data-k="${k}-rv" x="${f1(x)}" y="${f1(y)}" width="0" height="${f1(h)}"/></clipPath></defs>
      <g clip-path="url(#${p}-${k}rv)"><g class="fig">${open}${bare}</svg></g></g>
      <g class="fig">${open}${texts.map((t, i) => (labs[i] < 0 ? t.replace(/^<g data-k="[^"]*" opacity="0" display="none">/, '<g>') : t)).join('')}</svg></g>
      <path data-k="${k}-pen" class="p13-pen" d="M0,0"/></g>`,
  };
}
/** Reveals the trace up to image pixel u. */
export function drawRuban(S: Setters, k: string, r: { X: (u: number) => number; Y: (v: number) => number; s: number; labs: number[] }, u: number): void {
  const x0 = r.X(-40 * 742 / 700);
  S.set(S.q(`${k}-rv`), 'width', f1(Math.max(0, r.X(u) - x0)));
  S.set(S.q(`${k}-pen`), 'd', u > 30 && u < 728 ? `M${f1(r.X(u))},${f1(r.Y(40))}V${f1(r.Y(428))}` : 'M0,0');
  r.labs.forEach((lu, i) => { if (lu >= 0) S.op(S.q(`${k}-t${i}`), u >= lu ? 1 : 0); });
}
/** The pulses of the trace (image px, start–end of each spike) and the actinic period. */
export const RUBAN_PULSES: Array<[number, number]> = [[95, 110], [182, 190], [250, 258], [323, 331], [385, 393], [442, 449], [458, 466],
  [486, 494], [543, 551], [599, 607], [656, 664], [713, 721]];
export const RUBAN_ML = 68, RUBAN_ACT: [number, number] = [143, 431];
export const inPulse = (u: number): boolean => RUBAN_PULSES.some(([a, b]) => u >= a && u <= b);

/** The instrument lights (group k): measuring light, actinic light, saturating pulse. */
export function lampsSvg(k: string, x: number, y: number): string {
  const rows: Array<[string, string]> = [['measuring light', '#2a7fb8'], ['actinic light', '#e0a21a'], ['saturating pulse', '#f2c230']];
  return `<g data-k="${k}"><rect class="ppa-box" x="${x}" y="${y}" width="270" height="176" rx="16"/>
    ${lab('fluorometer', 'ppa-t', x + 18, y + 34)}
    ${rows.map(([s, c], i) => `<circle data-k="${k}-${i}" cx="${x + 32}" cy="${y + 70 + i * 40}" r="11" fill="${c}" stroke="#6b6a64" stroke-width="1.4" opacity=".18"/>${lab(s, 'ppa-l', x + 54, y + 77 + i * 40)}`).join('')}</g>`;
}
export function drawLamps(S: Setters, k: string, on: [number, number, number]): void {
  on.forEach((v, i) => S.set(S.q(`${k}-${i}`), 'opacity', (0.18 + 0.82 * v).toFixed(2)));
}

/* ================================================================ the photosystem II population (dot grid) */

export type Rc = 'o' | 'c' | 'q';
const RANK = Array.from({ length: 25 }, (_, i) => ((i * 13 + 7) % 25) / 25), RANK2 = Array.from({ length: 25 }, (_, i) => ((i * 7 + 3) % 25) / 25);
/** The 5 × 5 grid (dots k0 … k24) with its legend below. */
export function gridSvg(k: string, x: number, y: number, d = 64, r = 22): string {
  let s = '';
  for (let i = 0; i < 25; i++) s += `<circle data-k="${k}${i}" class="pp-dot-open" cx="${f1(x + (i % 5) * d)}" cy="${f1(y + Math.floor(i / 5) * d)}" r="${r}"/>`;
  const ly = y + 4 * d + 64;
  return `${s}
    <circle class="pp-dot-open" cx="${x}" cy="${ly}" r="12"/>${lab('open: photochemistry', 'ppa-l', x + 22, ly + 7)}
    <circle class="pp-dot-closed" cx="${x}" cy="${ly + 38}" r="12"/>${lab('closed: fluorescence', 'ppa-l', x + 22, ly + 45)}
    <circle class="pp-dot-quench" cx="${x}" cy="${ly + 76}" r="12"/>${lab('quenching: heat (NPQ)', 'ppa-l', x + 22, ly + 83)}`;
}
/** Sets the grid: a share q quenching, a share c of the rest closed, all non-quenching closed during a pulse. */
export function drawGrid(S: Setters, k: string, q: number, c: number, pulse: boolean): void {
  for (let i = 0; i < 25; i++) {
    const st: Rc = RANK[i] < q - 1e-6 ? 'q' : pulse || RANK2[i] < c - 1e-6 ? 'c' : 'o';
    S.set(S.q(`${k}${i}`), 'class', st === 'o' ? 'pp-dot-open' : st === 'c' ? 'pp-dot-closed' : 'pp-dot-quench');
  }
}

/* ================================================================ the SIF maps */

const GU = { href: guanterJpg, w: 786, h: 422 };
/** Guanter et al. 2014, Fig. 1 (as figure v7): the map with its colour bar relabelled and the US Corn Belt marked. */
export function earthSvg(p: string, x: number, y: number, w: number): { svg: string; at: (u: number, v: number) => V; h: number } {
  const a = shot(`${p}-gu`, GU, x, y, w, { masks: [[0, 352, 356, 422], [340, 386, 786, 422]] });
  const P = a.at;
  const cb = P(190, 86), lb: V = [P(96, 30)[0], P(96, 30)[1]];
  return {
    at: P, h: a.h,
    svg: `${a.svg}
      ${lab('maximum monthly SIF, 2009', 'ppa-l', P(6, 0)[0], P(0, 384)[1], 'start')}
      ${lab('SIF, 740 nm', 'ppa-l', P(352, 0)[0], P(0, 384)[1], 'end')}
      ${lab('0', 'ppa-s', P(362, 410)[0], P(362, 410)[1], 'middle')}${lab('4.5', 'ppa-s', P(757, 410)[0], P(757, 410)[1], 'middle')}
      ${lab('mW m⁻² sr⁻¹ nm⁻¹', 'ppa-s', P(560, 410)[0], P(560, 410)[1], 'middle')}
      <g data-k="cornbelt"><path class="pp-ldh" d="M${f1(lb[0] + 40)},${f1(lb[1] + 8)}L${f1(cb[0])},${f1(cb[1])}"/><path class="pp-ld" d="M${f1(lb[0] + 40)},${f1(lb[1] + 8)}L${f1(cb[0])},${f1(cb[1])}"/>
        <circle class="pp-ldt" cx="${f1(cb[0])}" cy="${f1(cb[1])}" r="4"/>${lab('US Corn Belt', 'ppa-l ppa-halo', lb[0], lb[1], 'middle')}</g>
      ${lab('Guanter et al. 2014, PNAS 111: E1327, Fig. 1 (GOME-2) · © PNAS', 'ppa-cr', x + w, y + a.h + 16, 'end')}`,
  };
}
const AIR = { href: sifAirJpg, w: 1600, h: 843 };
/** Porcar-Castell et al. 2021, Fig. 3e: apple orchard plots from the air, SIF at 760 nm (panel letter and colour bar left out). */
export function fieldSvg(p: string, x: number, y: number, w: number): { svg: string; at: (u: number, v: number) => V; h: number } {
  const a = shot(`${p}-air`, AIR, x, y, w, { win: [772, 445, 703, 397], rx: 12 });
  return {
    at: a.at, h: a.h,
    svg: `${a.svg}
      <rect class="ppa-box" x="${x + 16}" y="${y + 16}" width="300" height="74" rx="12"/>
      ${lab('apple orchard plots from the air', 'ppa-l', x + 32, y + 46)}${lab('SIF at 760 nm', 'ppa-s', x + 32, y + 74)}
      <rect class="ppa-box" x="${x + 16}" y="${f1(y + a.h - 40)}" width="420" height="26" rx="8"/>
      ${lab('Porcar-Castell et al. 2021, Nat. Plants 7: 998, Fig. 3e · © Springer Nature', 'ppa-cr', x + 26, y + a.h - 22)}`,
  };
}
