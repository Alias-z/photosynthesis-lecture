// Who uses which light? Staging A · Growing chart. One wavelength chart on the slide paper: a spectrum ribbon
// (ultraviolet · visible · infrared) on a linear axis runs across the top, and each beat stacks one row above the
// rows before (deep water at the bottom, then us, bee, plants). The beat's vignette plays in the space between the
// ribbon and the rows; its creature or band then settles into the new row. Beat 5 marks where the rows overlap.
import { LIFE_R1 } from './beats';
import './life-a.css';
import type { Staging } from './types';
import { enc, lin, spec } from '../../lib/colour';
import { defs, eye, glow, leaf, T, wv } from '../figs/s2';

const P = 'la';
type RGB = [number, number, number];
const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));
const k = (t: number, a: number, b: number): number => clamp((t - a) / (b - a), 0, 1);
const ease = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
const easeOut = (x: number): number => 1 - (1 - x) ** 3;
const lerp = (a: number, b: number, s: number): number => a + (b - a) * s;
const smooth = (x: number): number => { const c = clamp(x, 0, 1); return c * c * (3 - 2 * c); };
const rgb = (c: readonly number[]): string => `rgb(${c.map(v => Math.round(v)).join(',')})`;
const mix = (a: readonly number[], b: readonly number[], s: number): RGB => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];

/* ---------- the chart ---------- */

// Linear wavelength axis, 300–860 nm: 80 nm of ultraviolet and 80 nm of infrared either side of vision (380–780 nm).
const NM0 = 300, NM1 = 860, XA = 380, XB = 1540;
const X = (nm: number): number => XA + ((nm - NM0) / (NM1 - NM0)) * (XB - XA);
const RIB_Y = 78, RIB_H = 40;
// Rows stack upward from the bottom margin; row 0 is the lowest.
const ROW_H = 90, ROW_END = 692;
const rowTop = (i: number): number => ROW_END - ROW_H * (i + 1);
const BAR_Y = 40, BAR_H = 30;
const ICON_X = 112, LABEL_X = 192;
const rowMid = (i: number): number => rowTop(i) + BAR_Y + BAR_H / 2;

const DARK: RGB = [40, 26, 44];
const UV_RIB: RGB = [221, 218, 232], IR_RIB: RGB = [233, 223, 214];
const UV_BAR: RGB = [166, 154, 212];
/** Ribbon colour: the slide 3 strip (spectral, dimming toward the edges of vision; pale outside it). */
function nmRGB(nm: number): RGB {
  if (nm < 380) return UV_RIB;
  if (nm > 780) return IR_RIB;
  return mix(DARK, spec(nm), clamp(Math.min((nm - 372) / 46, (800 - nm) / 100), 0.3, 1));
}
const barRGB = (nm: number): RGB => (nm < 380 ? UV_BAR : nmRGB(nm));
/** Light lines in the water: spectral, a touch darker so yellow reads on pale water; UV and IR in their own inks. */
const lineRGB = (nm: number): RGB => (nm < 380 ? [128, 114, 190] : nm > 780 ? [170, 122, 92] : mix(nmRGB(nm), [60, 50, 40], 0.12));

/** A horizontal gradient for nm0…nm1 whose opacity follows prof(nm): a soft-edged bar. */
function bandGrad(id: string, nm0: number, nm1: number, prof: (nm: number) => number, col: (nm: number) => RGB, peak = 0.92): string {
  const n = Math.max(2, Math.ceil((nm1 - nm0) / 3));
  const stops = Array.from({ length: n + 1 }, (_, i) => {
    const nm = nm0 + ((nm1 - nm0) * i) / n;
    return `<stop offset="${(i / n).toFixed(4)}" stop-color="${rgb(col(nm))}" stop-opacity="${(clamp(prof(nm), 0, 1) * peak).toFixed(3)}"/>`;
  }).join('');
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(X(nm0))}" y1="0" x2="${f(X(nm1))}" y2="0">${stops}</linearGradient>`;
}
const win = (nm: number, a: number, b: number, c: number, d: number): number => smooth((nm - a) / (b - a)) * (1 - smooth((nm - c) / (d - c)));

/** Photoreceptor sensitivity, Govardovskii et al. 2000 A1 template (alpha band). */
function gov(nm: number, lmax: number): number {
  const x = lmax / nm, a = 0.8795 + 0.0459 * Math.exp(-((lmax - 300) ** 2) / 11940);
  return 1 / (Math.exp(69.7 * (a - x)) + Math.exp(28 * (0.922 - x)) + Math.exp(-14.9 * (1.104 - x)) + 0.674);
}
/** Unlabelled sensitivity humps standing on a row's bar. */
function humps(i: number, peaks: number[], lens: (nm: number) => number): string {
  const base = rowTop(i) + BAR_Y - 2, hgt = BAR_Y - 10;
  return peaks.map(lm => {
    const pts: string[] = [];
    for (let nm = Math.max(NM0, lm - 110); nm <= Math.min(NM1, lm + 150); nm += 2) {
      const v = gov(nm, lm) * lens(nm);
      if (v < 0.04 && (pts.length === 0 || nm < lm)) continue;
      if (v < 0.04) { pts.push(`L${f(X(nm))},${f(base - v * hgt)}`); break; }
      pts.push(`${pts.length ? 'L' : 'M'}${f(X(nm))},${f(base - v * hgt)}`);
    }
    return `<path class="la-hump" d="${pts.join('')}"/>`;
  }).join('');
}

/* ---------- water ---------- */

// Diffuse attenuation of the clearest natural sea water, K (1/m): Smith & Baker 1981 for 300–800 nm, pure-water
// absorption beyond (Kou et al. 1993). Depths of 1/e: 450 nm ≈ 69 m, 600 nm ≈ 4 m, 700 nm ≈ 1.5 m, 800 nm ≈ 0.5 m.
const KD: Array<[number, number]> = [
  [300, 0.141], [310, 0.105], [320, 0.0844], [330, 0.0678], [340, 0.0561], [350, 0.0463], [360, 0.0379], [370, 0.03],
  [380, 0.022], [390, 0.0191], [400, 0.0171], [410, 0.0162], [420, 0.0153], [430, 0.0144], [440, 0.0145], [450, 0.0145],
  [460, 0.0156], [470, 0.0156], [480, 0.0176], [490, 0.0196], [500, 0.0257], [510, 0.0357], [520, 0.0477], [530, 0.0507],
  [540, 0.0558], [550, 0.0638], [560, 0.0708], [570, 0.0799], [580, 0.108], [590, 0.157], [600, 0.244], [610, 0.289],
  [620, 0.309], [630, 0.319], [640, 0.329], [650, 0.349], [660, 0.4], [670, 0.43], [680, 0.45], [690, 0.5], [700, 0.65],
  [710, 0.839], [720, 1.169], [730, 1.799], [740, 2.38], [750, 2.47], [760, 2.55], [770, 2.51], [780, 2.36], [790, 2.16],
  [800, 2.07], [810, 2.2], [820, 2.5], [830, 2.9], [840, 3.5], [850, 4.3], [860, 4.6],
];
function kd(nm: number): number {
  for (let i = 1; i < KD.length; i++) if (nm <= KD[i][0]) {
    const [l0, k0] = KD[i - 1], [l1, k1] = KD[i];
    return k0 + ((k1 - k0) * (nm - l0)) / (l1 - l0);
  }
  return KD[KD.length - 1][1];
}
// The column, on a compressed (square-root) depth scale down to ZMAX metres.
const WS = 152, WB = 584, ZMAX = 25;
const zOf = (y: number): number => ZMAX * ((y - WS) / (WB - WS)) ** 2;
const deepT = (nm: number): number => Math.exp(-kd(nm) * ZMAX);
const DEEP_MAX = Math.max(...Array.from({ length: 141 }, (_, i) => deepT(NM0 + i * 4)));
const LINE_TOP = RIB_Y + RIB_H + 4;
const LINES = Array.from({ length: 28 }, (_, i) => 310 + i * 20);

/** A wave along a line with a constant drawn wavelength, ramped in at both ends (the deck's wv, any colour). */
function wavePath(x0: number, y0: number, x1: number, y1: number, lam: number, amp: number, ph = 0, head = 0): string {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const run = L - head, ramp = lam * 0.7, n = Math.max(2, Math.ceil(run / 1.5));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (run * i) / n, e = Math.min(1, d / ramp, (run - d) / ramp);
    const w = Math.sin((2 * Math.PI * d) / lam + ph) * amp * e;
    pts.push(`${i ? 'L' : 'M'}${f(x0 + ux * d - uy * w)},${f(y0 + uy * d + ux * w)}`);
  }
  if (head) pts.push(`L${f(x1)},${f(y1)}`);
  return pts.join('');
}

function waterColumn(): string {
  const surf: string[] = [];
  for (let x = XA; x <= XB; x += 6) surf.push(`${surf.length ? 'L' : 'M'}${x},${f(WS + 3 * Math.sin((x - XA) / 26))}`);
  const top = surf.join('');
  const grads = LINES.map((nm, i) => {
    const n = 34, c = rgb(lineRGB(nm));
    const stops = [`<stop offset="0" stop-color="${c}"/>`, `<stop offset="${((WS - LINE_TOP) / (WB - LINE_TOP)).toFixed(4)}" stop-color="${c}"/>`];
    for (let j = 1; j <= n; j++) {
      const y = WS + (WB - WS) * (j / n) ** 1.6, o = Math.exp(-kd(nm) * zOf(y));
      stops.push(`<stop offset="${((y - LINE_TOP) / (WB - LINE_TOP)).toFixed(4)}" stop-color="${c}" stop-opacity="${o < 0.02 ? 0 : o.toFixed(3)}"/>`);
    }
    return `<linearGradient id="${P}-lg${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${LINE_TOP}" x2="0" y2="${WB}">${stops.join('')}</linearGradient>`;
  }).join('');
  const lines = LINES.map((nm, i) =>
    `<path class="la-line" stroke="url(#${P}-lg${i})" d="${wavePath(X(nm), LINE_TOP, X(nm), WB - 2, nm / 26, 3.4, i * 0.9)}"/>`).join('');
  return `<defs>${grads}
      <linearGradient id="${P}-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3eff1"/><stop offset="1" stop-color="#bcd5de"/></linearGradient>
      <clipPath id="${P}-front"><rect class="la-front" x="0" y="${RIB_Y + RIB_H}" width="1600" height="0"/></clipPath></defs>
    <g class="la-water">
      <path fill="url(#${P}-water)" d="${top}L${XB},${WB - 10}Q${XB},${WB} ${XB - 10},${WB}H${XA + 10}Q${XA},${WB} ${XA},${WB - 10}Z"/>
      <path class="la-surf" d="${top}"/>
      <path class="la-depth" d="M346,${WS + 30}V${WB - 30}" marker-end="url(#${P}-dh)"/>
      ${T(328, WS + 50, 'depth', 'la-lab', 'end')}${T(328, WS + 80, 'not to scale', 'la-note', 'end')}
    </g>
    <g clip-path="url(#${P}-front)">${lines}</g>`;
}

/* ---------- an early chordate (jawless, fin fold, simple eye), facing left ---------- */

function fish(): string {
  const myo = Array.from({ length: 8 }, (_, i) => {
    const x = -24 + i * 9, h = 10 - Math.abs(x - 4) * 0.08;
    return `M${f(x + 6)},${f(-h)}L${f(x)},0L${f(x + 6)},${f(h)}`;
  }).join('');
  const gills = Array.from({ length: 5 }, (_, i) => `M${-40 + i * 3.6},-4q1.8,4 0,8`).join('');
  return `<path class="la-fin" d="M-4,-12C20,-17 48,-12 70,0C48,12 22,14 4,11Z"/>
    <path class="la-fish" d="M-62,0C-58,-11 -42,-15 -20,-14C10,-12 40,-6 64,0C40,6 10,11 -20,12C-42,13 -58,10 -62,0Z"/>
    <path class="la-myo" d="${myo}"/><path class="la-gill" d="${gills}"/>
    <circle class="la-fish-eye" cx="-50" cy="-3" r="4.4"/><circle class="la-fish-pupil" cx="-50.6" cy="-3" r="2.3"/>`;
}

/* ---------- a honeybee, facing right ---------- */

function bee(): string {
  return `<defs><clipPath id="${P}-abd"><ellipse cx="-16" cy="2" rx="25" ry="16"/></clipPath></defs>
    <path class="la-bee-leg" d="M6,11L1,22M12,12L12,24M18,11L23,21"/>
    <path class="la-bee-sting" d="M-40,1L-48,3L-40,5Z"/>
    <ellipse class="la-abd" cx="-16" cy="2" rx="25" ry="16"/>
    <g clip-path="url(#${P}-abd)"><path class="la-stripe" d="M-28,-16V20M-14,-16V20M0,-16V20"/></g>
    <ellipse class="la-abd-o" cx="-16" cy="2" rx="25" ry="16"/>
    <circle class="la-thorax" cx="13" cy="0" r="12.5"/>
    <circle class="la-head" cx="32" cy="3" r="9.5"/>
    <path class="la-ant" d="M35,-4Q40,-15 49,-18M31,-5Q33,-16 40,-22"/>
    <g class="la-wings"><ellipse class="la-wing" cx="-4" cy="-21" rx="22" ry="11" transform="rotate(-24 -4 -21)"/>
      <ellipse class="la-wing" cx="9" cy="-18" rx="16" ry="8.5" transform="rotate(-8 9 -18)"/></g>`;
}

/* ---------- a branch with ripe fruit and young leaves, in a given palette ---------- */

interface Pal { bg: string; rim: string; br: string; brs: string; lf: string; lfs: string; lv: string; yl: string; yls: string; fr: string; frs: string; hi: string }
// Fruit, young leaves and mature leaves are matched so that, for a deuteranope, they differ by under 10 levels in
// both the red–green sum and the blue channel: the fruit hides among the leaves until the third cone is added.
const TRI: Pal = {
  bg: '#f1efe4', rim: '#c9c6bb', br: '#8a6a4a', brs: '#6b5038', lf: '#7a9e44', lfs: '#4f7430', lv: '#a3c27e',
  yl: '#c96a4a', yls: '#96442e', fr: '#e05f48', frs: '#a8361e', hi: '#fffdf8',
};
/** Deuteranope view (two cones): Viénot, Brettel & Mollon 1999, applied in linear RGB. */
function deut(hex: string): string {
  const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(hex.slice(i, i + 2), 16)));
  const rg = 0.29275 * r + 0.70725 * g, bb = -0.02234 * r + 0.02234 * g + b;
  return `#${[rg, rg, bb].map(v => Math.round(enc(v)).toString(16).padStart(2, '0')).join('')}`;
}
const DI: Pal = Object.fromEntries(Object.entries(TRI).map(([key, v]) => [key, deut(v)])) as unknown as Pal;

/** The deck's leaf shape (blade, midrib, side veins, stalk) in any colours; the stalk end sits at (bx, by). */
function leafAt(bx: number, by: number, len: number, wid: number, deg: number, fill: string, stroke: string, vein: string): string {
  const h = len / 2, w = wid / 2, a = (deg * Math.PI) / 180, cx = bx + Math.cos(a) * (h + 12), cy = by + Math.sin(a) * (h + 12);
  const blade = `M${-h},0 C${f(-h * 0.5)},${f(-w * 1.3)} ${f(h * 0.4)},${f(-w * 1.2)} ${h},0 C${f(h * 0.4)},${f(w * 1.2)} ${f(-h * 0.5)},${f(w * 1.3)} ${-h},0Z`;
  const veins = [-0.5, -0.1, 0.3].map(t => {
    const x = t * h, r = w * (0.75 - Math.abs(t) * 0.3);
    return `M${f(x)},0 Q${f(x + h * 0.14)},${f(-r * 0.55)} ${f(x + h * 0.3)},${f(-r)}M${f(x)},0 Q${f(x + h * 0.14)},${f(r * 0.55)} ${f(x + h * 0.3)},${f(r)}`;
  }).join('');
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${deg})"><path d="M${-h},0 L${-h - 12},0" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>
    <path d="${blade}" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M${-h + 5},0 L${f(h * 0.88)},0${veins}" fill="none" stroke="${vein}" stroke-width="1.5" stroke-linecap="round"/></g>`;
}

const DISC_R = 140;
function branch(p: Pal): string {
  const mature: Array<[number, number, number, number, number]> = [
    [-128, -22, 82, 36, 128], [-104, -30, 86, 38, -112], [-62, -24, 84, 37, 66],
    [-36, -18, 80, 36, -78], [46, -32, 84, 37, 52], [74, -40, 80, 36, -100],
  ];
  const young: Array<[number, number, number, number, number]> = [[120, -64, 58, 26, -48], [126, -66, 52, 24, 12], [104, -56, 50, 23, -122]];
  const berries: Array<[number, number]> = [[-12, 32], [14, 30], [-2, 56], [24, 54], [-24, 56]];
  return `<circle r="${DISC_R}" fill="${p.bg}"/>
    <path d="M-160,-14 C-100,-34 -40,-10 20,-28 C70,-42 110,-58 160,-84" fill="none" stroke="${p.br}" stroke-width="9" stroke-linecap="round"/>
    <path d="M-160,-14 C-100,-34 -40,-10 20,-28 C70,-42 110,-58 160,-84" fill="none" stroke="${p.brs}" stroke-width="1.6" stroke-dasharray="1 9" stroke-linecap="round"/>
    ${mature.map(m => leafAt(m[0], m[1], m[2], m[3], m[4], p.lf, p.lfs, p.lv)).join('')}
    <path d="M6,-26 C6,-6 4,6 6,18 M6,4 C-4,14 -10,18 -12,22 M6,6 C16,14 22,22 24,40" fill="none" stroke="${p.br}" stroke-width="3.4" stroke-linecap="round"/>
    ${berries.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${p.fr}" stroke="${p.frs}" stroke-width="2"/><circle cx="${x - 5}" cy="${y - 5}" r="3.6" fill="${p.hi}" opacity=".75"/>`).join('')}
    ${young.map(m => leafAt(m[0], m[1], m[2], m[3], m[4], p.yl, p.yls, p.yls)).join('')}`;
}

/* ---------- a five-petal flower, as we see it and as a bee's UV view in false colour ---------- */

const FLOWER_R = 92;
const PETAL = 'M0,-16 C-24,-30 -38,-70 -22,-86 C-12,-96 12,-96 22,-86 C38,-70 24,-30 0,-16Z';
function flower(cx: number, cy: number, uv: boolean): string {
  const petals = Array.from({ length: 5 }, (_, i) => `<path class="${uv ? 'la-petal-uv' : 'la-petal'}" d="${PETAL}" transform="rotate(${i * 72 + 18})"${uv ? ` fill="url(#${P}-uvg)"` : ''}/>`).join('');
  const stamens = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return `<circle class="${uv ? 'la-stamen-uv' : 'la-stamen'}" cx="${f(Math.cos(a) * 13)}" cy="${f(Math.sin(a) * 13)}" r="3"/>`;
  }).join('');
  return `<g transform="translate(${cx} ${cy})">${petals}<circle class="${uv ? 'la-disc-uv' : 'la-disc'}" r="19"/>${stamens}</g>`;
}

/* ---------- simple algae and a cyanobacterial mat ---------- */

const blade = (cx: number, cy: number, len: number, wid: number, rot: number, cls: string): string => {
  const h = len / 2, w = wid / 2;
  return `<path class="${cls}" transform="translate(${cx} ${cy}) rotate(${rot})" d="M${-h},0 C${f(-h * 0.5)},${f(-w * 1.3)} ${f(h * 0.4)},${f(-w * 1.2)} ${h},0 C${f(h * 0.4)},${f(w * 1.2)} ${f(-h * 0.5)},${f(w * 1.3)} ${-h},0Z"/>`;
};
/** A red seaweed: a flat strap thallus that forks twice, from a holdfast at (x, y). */
function redAlga(x: number, y: number): string {
  const d = `M0,0 L0,-26 M0,-26 Q-8,-42 -26,-56 M0,-26 Q8,-42 26,-56
    M-26,-56 Q-40,-68 -46,-90 M-26,-56 Q-22,-76 -14,-96 M26,-56 Q20,-76 14,-94 M26,-56 Q42,-66 50,-86`;
  return `<g transform="translate(${x} ${y})"><path class="la-ralga-o" d="${d}"/><path class="la-ralga" d="${d}"/>
    <ellipse class="la-hold" cx="0" cy="2" rx="14" ry="5"/></g>`;
}

/* ---------- beat 4's three absorbers ---------- */

const V3_TOP = 148, V3_BOT = 300;
const v3Hit = (y: number): number => 1.0 + 1.6 * ((y - V3_TOP) / (V3_BOT - V3_TOP));
// Absorbed light ends in an amber glow: [x, y] of each.
// [x, y, radius, opacity]. The leaf also absorbs part of the green (a leaf takes 50–90 % of green, 80–95 % of blue
// and red), so green gets a smaller, fainter glow there and continues below the leaf thinner and fainter.
const GLOWS: Array<[number, number, number, number]> = [
  [330, 223, 19, 1], [430, 226, 19, 1], [380, 224, 12, 0.6], [814, 210, 19, 1], [1262, 198, 19, 1], [1332, 264, 19, 1],
];

function plants(): string {
  const waves = `
    ${wv(P, 'g', 380, V3_TOP, 380, 224, { amp: 5, head: false, ph: 1.3 })}
    ${wv(P, 'g', 380, 270, 380, 304, { amp: 3.5, cls: 'la-faint', ph: 1.3 })}
    ${wv(P, 'b', 330, V3_TOP, 330, 223, { amp: 5, head: false })}
    ${wv(P, 'r', 430, V3_TOP, 430, 226, { amp: 5, head: false, ph: 2.6 })}
    ${wv(P, 'g', 814, V3_TOP, 814, 210, { amp: 5, head: false, ph: 1.3 })}
    ${wv(P, 'r', 1262, V3_TOP, 1262, 198, { amp: 5, head: false, ph: 2.6 })}
    <path class="la-fr" d="${wavePath(1332, V3_TOP, 1332, 264, 730 / 22, 5, 0.6)}"/>`;
  const algae = `${blade(1236, 204, 76, 22, -6, 'la-galga')}${blade(1300, 198, 80, 24, 4, 'la-galga')}${blade(1364, 206, 70, 21, -3, 'la-galga')}`;
  const mat = `<rect class="la-mat2" x="1196" y="272" width="208" height="14" rx="7"/><rect class="la-mat1" x="1196" y="258" width="208" height="16" rx="8"/>
    ${Array.from({ length: 13 }, (_, i) => `<path class="la-mat-f" d="M${1206 + i * 15},270 q4,-6 8,0"/>`).join('')}`;
  return `<g class="la-v3-org">
      ${leaf(380, 242, 210, 74, -4)}
      ${redAlga(828, 296)}
      ${algae}${mat}
      ${T(246, 251, 'leaf', 'la-lab', 'end')}${T(744, 258, 'red alga', 'la-lab', 'end')}${T(1180, 274, 'cyanobacteria', 'la-lab', 'end')}
    </g>
    <defs><clipPath id="${P}-v3c"><rect class="la-v3-front" x="0" y="${V3_TOP - 6}" width="1600" height="0"/></clipPath></defs>
    <g clip-path="url(#${P}-v3c)">${waves}</g>
    ${GLOWS.map((g, i) => `<g class="la-g${i}"><g opacity="${g[3]}">${glow(P, g[0], g[1], g[2])}</g></g>`).join('')}
    <g class="la-v3-lab">${T(1352, 168, 'far-red', 'la-lab la-fr-t')}</g>`;
}

/* ---------- the rows ---------- */

interface Row { label: string; bands: Array<{ nm0: number; nm1: number; prof: (nm: number) => number; peak?: number }>; humps?: string }
const lensHuman = (nm: number): number => smooth((nm - 380) / 40);
const ROWS: Row[] = [
  { label: 'deep water', bands: [{ nm0: 300, nm1: 640, prof: nm => deepT(nm) / DEEP_MAX }] },
  // Human cones: S 419, M 531, L 558 nm (Dartnall, Bowmaker & Mollon 1983); the lens cuts ultraviolet.
  { label: 'us', bands: [{ nm0: 380, nm1: 780, prof: nm => win(nm, 380, 425, 680, 780) }], humps: humps(1, [419, 531, 558], lensHuman) },
  // Honeybee receptors: UV 344, blue 436, green 544 nm (Peitsch et al. 1992); nothing in the red.
  { label: 'bee', bands: [{ nm0: 300, nm1: 660, prof: nm => win(nm, 300, 326, 585, 655) }], humps: humps(2, [344, 436, 544], () => 1) },
  {
    label: 'plants', bands: [
      { nm0: 396, nm1: 494, prof: nm => win(nm, 398, 414, 468, 492) },
      { nm0: 492, nm1: 580, prof: nm => win(nm, 494, 510, 556, 578) },
      { nm0: 630, nm1: 698, prof: nm => win(nm, 632, 646, 680, 696) },
      { nm0: 700, nm1: 758, prof: nm => win(nm, 702, 712, 740, 756), peak: 0.85 },
    ],
  },
];

function rowIcon(i: number): string {
  const y = rowMid(i);
  if (i === 1) return eye(ICON_X, y, 1.3);
  if (i === 3) return `${leaf(ICON_X + 8, y, 92, 38, -18)}${glow(P, ICON_X + 2, y + 2, 13)}`;
  return '';
}

function row(i: number): string {
  const r = ROWS[i], y0 = rowTop(i);
  const grads = r.bands.map((b, j) => bandGrad(`${P}-r${i}b${j}`, b.nm0, b.nm1, b.prof, barRGB, b.peak)).join('');
  const bars = r.bands.map((b, j) => `<rect x="${f(X(b.nm0))}" y="${y0 + BAR_Y}" width="${f(X(b.nm1) - X(b.nm0))}" height="${BAR_H}" fill="url(#${P}-r${i}b${j})"/>`).join('');
  const guides = [380, 780].map(nm => `<path class="la-guide" d="M${f(X(nm))},${y0 + 4}V${y0 + ROW_H - 4}"/>`).join('');
  return `<defs>${grads}</defs>
    <g class="la-guides la-guides${i}">${guides}</g>
    <g class="la-bars la-bars${i}">${bars}</g>
    ${r.humps ? `<g class="la-humps la-humps${i}">${r.humps}</g>` : ''}
    <g class="la-icon la-icon${i}">${rowIcon(i)}</g>
    <g class="la-rlab la-rlab${i}">${T(LABEL_X, rowMid(i) + 9, r.label, 'la-row')}</g>`;
}

function ribbon(): string {
  const n = (NM1 - NM0) / 4;
  const stops = Array.from({ length: n + 1 }, (_, i) => `<stop offset="${(i / n).toFixed(4)}" stop-color="${rgb(nmRGB(NM0 + i * 4))}"/>`).join('');
  return `<defs><linearGradient id="${P}-rib" gradientUnits="userSpaceOnUse" x1="${XA}" y1="0" x2="${XB}" y2="0">${stops}</linearGradient></defs>
    <rect x="${XA}" y="${RIB_Y}" width="${XB - XA}" height="${RIB_H}" rx="6" fill="url(#${P}-rib)"/>
    ${T(X(340), RIB_Y - 12, 'ultraviolet', 'la-sec', 'middle')}${T(X(580), RIB_Y - 12, 'visible', 'la-sec', 'middle')}${T(X(820), RIB_Y - 12, 'infrared', 'la-sec', 'middle')}`;
}

/* ---------- beat 5: where the rows overlap ---------- */

const HL0 = 376, HL1 = 724, HL_Y = RIB_Y + RIB_H / 2;
function highlight(): string {
  const g = bandGrad(`${P}-hl`, HL0, HL1, nm => win(nm, HL0, 408, 688, HL1), () => [240, 213, 140], 0.36);
  return `<defs>${g}<clipPath id="${P}-hlc"><rect class="la-hl-front" x="0" y="${HL_Y}" width="1600" height="0"/></clipPath></defs>
    <g clip-path="url(#${P}-hlc)"><rect x="${f(X(HL0))}" y="${HL_Y}" width="${f(X(HL1) - X(HL0))}" height="${ROW_END + 8 - HL_Y}" fill="url(#${P}-hl)"/></g>`;
}

/* ---------- motion ---------- */

const V1_Y = 296, V2_Y = 272, FISH_ICON = 0.8;
const LENS_R = 125, FLOWER_A = 580, FLOWER_B = 940;

export const STAGING: Staging = {
  beats: LIFE_R1,
  id: 'a',
  name: 'A · Growing chart',
  note: 'Each creature adds its own row to one wavelength chart; the last beat compares the rows.',
  svg: () => `${defs(P)}
    <defs><marker id="${P}-dh" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#8a877d"/></marker>
      <radialGradient id="${P}-uvg" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${FLOWER_R}">
        <stop offset="0" stop-color="#2f2846"/><stop offset=".5" stop-color="#2f2846"/><stop offset=".6" stop-color="#d8d2f0"/><stop offset="1" stop-color="#f6f4ff"/></radialGradient>
      <clipPath id="${P}-lensc"><circle class="la-lens-clip" cx="${FLOWER_B}" cy="${V2_Y}" r="${LENS_R}"/></clipPath>
      <clipPath id="${P}-disc"><circle r="${DISC_R}"/></clipPath></defs>
    <g class="la-hl">${highlight()}</g>
    ${ribbon()}
    ${[0, 1, 2, 3].map(row).join('')}

    <g class="la-v la-v0">${waterColumn()}</g>

    <g class="la-v la-v1">
      <g class="la-discA"><circle r="${DISC_R}" class="la-disc-sh" filter="url(#${P}-sh)"/><g clip-path="url(#${P}-disc)">${branch(DI)}</g>
        <circle r="${DISC_R}" class="la-rim"/>${T(0, DISC_R + 38, 'two cones', 'la-lab', 'middle')}</g>
      <g class="la-discB"><circle r="${DISC_R}" class="la-disc-sh" filter="url(#${P}-sh)"/><g clip-path="url(#${P}-disc)">${branch(DI)}<g class="la-tri">${branch(TRI)}</g></g>
        <circle r="${DISC_R}" class="la-rim"/><g class="la-discB-lab">${T(0, DISC_R + 38, 'three cones', 'la-lab', 'middle')}</g></g>
    </g>

    <g class="la-v la-v2">
      ${flower(FLOWER_A, V2_Y, false)}${flower(FLOWER_B, V2_Y, false)}
      <g class="la-lens">
        <circle class="la-lens-sh" cx="${FLOWER_B}" cy="${V2_Y}" r="${LENS_R}" filter="url(#${P}-sh)"/>
        <g clip-path="url(#${P}-lensc)"><rect class="la-lens-bg" x="0" y="${V2_Y - LENS_R}" width="1600" height="${LENS_R * 2}"/>
          ${flower(FLOWER_B, V2_Y, true)}</g>
        <circle class="la-lens-rim" cx="${FLOWER_B}" cy="${V2_Y}" r="${LENS_R}"/>
      </g>
      <g class="la-v2-lab">${T(FLOWER_B + LENS_R + 26, V2_Y + 8, 'false colour', 'la-lab')}</g>
    </g>

    <g class="la-v la-v3">${plants()}</g>

    <g class="la-fishg">${fish()}</g>
    <g class="la-beeg">${bee()}</g>
    ${T(X(550), 282, '?', 'la-q', 'middle')}`,

  bind(stage) {
    const q = <E extends Element>(s: string): E => stage.querySelector(s) as E;
    const qa = (s: string): SVGElement[] => Array.from(stage.querySelectorAll<SVGElement>(s));
    const show = (el: Element | null, o: number): void => {
      if (!el) return;
      const e = el as SVGElement;
      e.style.display = o <= 0.001 ? 'none' : '';
      e.style.opacity = o >= 0.999 ? '' : o.toFixed(3);
    };
    const move = (el: Element, x: number, y: number, s = 1, rot = 0, flip = 1): void =>
      el.setAttribute('transform', `translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${(s * flip).toFixed(3)} ${s.toFixed(3)})`);

    const V = [0, 1, 2, 3].map(i => q(`.la-v${i}`));
    const R = [0, 1, 2, 3].map(i => ({
      guides: q(`.la-guides${i}`), bars: q(`.la-bars${i}`), humps: stage.querySelector(`.la-humps${i}`),
      icon: q(`.la-icon${i}`), lab: q(`.la-rlab${i}`),
    }));
    const water = q('.la-water'), front = q('.la-front');
    const discA = q('.la-discA'), discB = q('.la-discB'), tri = q('.la-tri'), discBLab = q('.la-discB-lab');
    const flowers = qa('.la-v2 > g:not(.la-lens):not(.la-v2-lab)');
    const lens = q('.la-lens'), lensClip = q('.la-lens-clip'), lensRim = q('.la-lens-rim'), lensSh = q('.la-lens-sh'), v2lab = q('.la-v2-lab');
    const v3org = q('.la-v3-org'), v3front = q('.la-v3-front'), v3lab = q('.la-v3-lab');
    const glows = GLOWS.map((_, i) => q(`.la-g${i}`));
    const fishG = q('.la-fishg'), beeG = q('.la-beeg'), wings = q('.la-wings');
    const hl = q('.la-hl'), hlFront = q('.la-hl-front'), qm = q('.la-q');

    /** How far row i has settled: 1 once its beat is over. */
    const SETTLE = [[4.2, 5.2], [3.9, 4.9], [3.9, 4.9], [3.5, 4.5]];
    function rowState(i: number, beat: number, t: number): void {
      const r = R[i];
      if (beat < i) { [r.guides, r.bars, r.humps, r.icon, r.lab].forEach(e => show(e, 0)); return; }
      const [a, b] = SETTLE[i], tt = beat > i ? 99 : t;
      const s = ease(k(tt, a, b));
      if (i === 0) {
        // The light left at the bottom of the water drops into the row.
        const appear = k(tt, 2.9, 3.4), dy = (WB + 8) - (rowTop(0) + BAR_Y);
        show(r.bars, beat > 0 ? 1 : appear);
        r.bars.setAttribute('transform', `translate(0 ${f(dy * (1 - s))})`);
      } else {
        show(r.bars, s);
        r.bars.setAttribute('transform', `translate(0 ${f(-26 * (1 - s))})`);
      }
      show(r.guides, s);
      if (r.humps) show(r.humps, k(tt, a + 0.5, b + 0.3));
      show(r.lab, k(tt, a + 0.4, b + 0.2));
      if (i === 1 || i === 3) {
        const p = easeOut(k(tt, a + 0.1, a + 0.7)), cy = rowMid(i);
        show(r.icon, p);
        r.icon.setAttribute('transform', `translate(${ICON_X} ${cy}) scale(${f(0.6 + 0.4 * p)}) translate(${-ICON_X} ${-cy})`);
      }
    }

    function v0(t: number): void {
      show(water, k(t, 0, 0.6));
      const yf = lerp(RIB_Y + RIB_H, WB + 4, k(t, 0.4, 3.0));
      front.setAttribute('height', f(yf - (RIB_Y + RIB_H)));
    }
    function v1(t: number): void {
      show(discA, k(t, 0.5, 1.1));
      const s = ease(k(t, 1.8, 3.0));
      move(discA, 800 - 180 * s, V1_Y);
      move(discB, 800 + 180 * s, V1_Y);
      show(discB, s > 0 ? 1 : 0);
      show(tri, k(t, 2.4, 3.4));
      show(discBLab, k(t, 2.9, 3.5));
    }
    function v2(t: number): void {
      flowers.forEach(e => show(e, k(t, 0.5, 1.0)));
      show(lens, k(t, 1.4, 1.8));
      const cx = lerp(FLOWER_B + 390, FLOWER_B, ease(k(t, 1.5, 3.3)));
      [lensClip, lensRim, lensSh].forEach(e => e.setAttribute('cx', f(cx)));
      show(v2lab, k(t, 3.2, 3.8));
    }
    function v3(t: number): void {
      show(v3org, k(t, 0.5, 1.0));
      v3front.setAttribute('height', f(lerp(0, V3_BOT - V3_TOP + 16, k(t, 1.0, 2.6))));
      GLOWS.forEach((g, i) => show(glows[i], k(t, v3Hit(g[1]) - 0.02, v3Hit(g[1]) + 0.3)));
      show(v3lab, k(t, v3Hit(170), v3Hit(170) + 0.5));
    }
    const VIG = [v0, v1, v2, v3];

    function fishState(beat: number, t: number): void {
      const slot: [number, number] = [ICON_X - 2, rowMid(0)];
      if (beat > 0) { show(fishG, 1); move(fishG, slot[0], slot[1], FISH_ICON); return; }
      show(fishG, k(t, 2.4, 2.8));
      const swim = easeOut(k(t, 2.4, 4.0)), s = ease(k(t, 4.2, 5.2));
      const x0 = lerp(1060, 760, swim), y0 = 466;
      const x = lerp(x0, slot[0], s), y = lerp(y0, slot[1], s) - Math.sin(Math.PI * s) * 30;
      const wob = (1 - s) * (1 - k(t, 3.6, 4.2) * 0.6);
      move(fishG, x, y + Math.sin(t * 5) * 3 * wob, lerp(1.2, FISH_ICON, s), Math.sin(t * 9) * 3 * wob - 8 * Math.sin(Math.PI * s));
    }
    function beeState(beat: number, t: number): void {
      const slot: [number, number] = [ICON_X, rowMid(2) + 4];
      if (beat < 2) { show(beeG, 0); return; }
      if (beat > 2) { show(beeG, 1); move(beeG, slot[0], slot[1], 0.8); wings.removeAttribute('transform'); return; }
      show(beeG, k(t, 0.6, 0.9));
      const fly = easeOut(k(t, 0.6, 1.9)), s = ease(k(t, 3.9, 4.9));
      const hx = lerp(170, 400, fly), hy = lerp(196, 236, fly);
      const bob = (1 - s) * Math.sin(t * 4.2) * 5;
      move(beeG, lerp(hx, slot[0], s), lerp(hy, slot[1], s) + bob - Math.sin(Math.PI * s) * 20, lerp(1, 0.8, s));
      const flap = s >= 1 ? 1 : 1 - 0.55 * Math.abs(Math.sin(t * 26));
      wings.setAttribute('transform', `translate(0 -12) scale(1 ${flap.toFixed(3)}) translate(0 12)`);
    }

    return (beat, t) => {
      for (let i = 0; i < 4; i++) {
        rowState(i, beat, t);
        if (beat === i) { show(V[i], 1); VIG[i](t); }
        else if (beat === i + 1) { show(V[i], 1 - k(t, 0, 0.5)); VIG[i](99); }
        else show(V[i], 0);
      }
      fishState(beat, t);
      beeState(beat, t);
      show(hl, beat === 4 ? 1 : 0);
      hlFront.setAttribute('height', f(beat === 4 ? lerp(0, ROW_END + 8 - HL_Y, ease(k(t, 0.4, 1.9))) : 0));
      show(qm, beat === 4 ? k(t, 1.7, 2.5) : 0);
    };
  },
};
