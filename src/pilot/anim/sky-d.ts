// Sunlight and the sky, staging D "One sunbeam". One subject the eye follows: a single sunbeam, drawn as slide 2's
// white light (blue, green and red waves at wavelengths in proportion to 450, 550 and 650 nm). The camera rides with
// it: past a prism near the Sun, into the air, down to you on the ground, and it stays with you while Earth turns to
// sunset.
// - The world is the "Blue sky" stage (px). Each beat has an end camera (scale and offset, never a turn). At time t of
//   beat k the camera zooms from beat k−1's end camera about the one world point both show at the same stage spot, so
//   draw(beat, t) depends on beat and t only. Up to "Blue sky" every camera keeps the beam's line on the stage, so the
//   beam holds still while the world slides past it.
// - The Sun is drawn at infinity: in stage px at the beam's far end, so it neither grows nor leaves as the camera moves.
// - Close-ups are frames drawn in the stage px of the beat that shows them and placed in the world by that beat's
//   camera: the prism near the Sun, the air molecules, the ground.
// - Only what teaches moves: light travelling, scattering, colours changing, Earth turning. Labels, the spectrum, the
//   clipping, the globe and the scenery appear whole, in fades of at most 0.3 s; camera moves take at most 1 s.
// - "Earth turns": the Sun's elevation drops from the midday 24° (Zurich in November) to 2.5° and the path through the
//   air band lengthens. "Sunset": the light crosses that path, losing what Rayleigh optical depths and the Kasten &
//   Young air mass say it loses.
import './sky-d.css';
import { spec } from '../../lib/colour';
import { clipFx, clipHeight, clipping, RAYLEIGH_CLIP } from '../figs/clipping';
import { airMol, defs, LAM, type Col } from '../figs/s2';
import type { Staging } from './types';

type V = [number, number];
/** A camera: stage = s · world + t (no turn). */
interface Cam { s: number; t: V }

const ID = 'skyd';
const COLS: Col[] = ['b', 'g', 'r'];
const HEX: Record<Col, string> = { b: '#2350e6', g: '#2a963a', r: '#c8361e' };
const f1 = (v: number): string => v.toFixed(1);
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
const smooth = (x: number): number => { const u = clamp01(x); return u * u * (3 - 2 * u); };
const smoother = (x: number): number => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
const easeOut = (x: number): number => { const u = clamp01(x); return 1 - (1 - u) * (1 - u); };
const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
const lerpV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
const mul = (a: V, k: number): V => [a[0] * k, a[1] * k];
const len = (a: V): number => Math.hypot(a[0], a[1]);
const unit = (a: V, b: V): V => { const d = sub(b, a), L = len(d); return [d[0] / L, d[1] / L]; };
const polar = (deg: number): V => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
const rad = (deg: number): number => (deg * Math.PI) / 180;
/** 0 → 1 over the time window [t0, t1]. */
const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));

/* ---------------------------------------------------------------- the world (units: "Blue sky" stage px) */

const SUN_X = 210; // the Sun's stage x up to "Blue sky"
const SUN2: V = [SUN_X, 124], SUN_R0 = 58, SUN_R2 = 46;
const FEET2: V = [1150, 630], PH = 84; // you, on the ground in "Blue sky"; PH is your height there
const HEAD2: V = [FEET2[0], FEET2[1] - PH];
const E = unit(SUN2, HEAD2); // sunlight's direction
const D_SUN = len(sub(HEAD2, SUN2)); // drawn distance from your head to the Sun
const ALPHA = (Math.atan2(E[1], E[0]) * 180) / Math.PI; // the midday Sun's elevation, about 24°
const EPS_END = 2.5; // the Sun's elevation at sunset
const at = (u: number): V => add(SUN2, mul(E, u)); // the beam's line, u px from the Sun's centre

// Earth: the ground is an arc of radius RW, under an air band HW thick (both far out of proportion).
const RW = 40000, HW = 600;
const GC: V = [800, FEET2[1] + Math.sqrt(RW * RW - (FEET2[0] - 800) ** 2)]; // the ground's crest is mid-stage, so it looks level
const groundY = (x: number): number => GC[1] - Math.sqrt(RW * RW - (x - GC[0]) ** 2);

// Cameras. "In the air" zooms in about a point on the beam near the Sun; "Sunlight" zooms out of that about a point at
// the beam's lower right and shifts down, so the beam crosses the first stage lower. "Earth turns" pulls out from you
// until the air band shows whole; "Sunset" keeps that camera.
const Z12 = 3.2, FIX12 = at(150);
const Z01 = 5, FIX01 = at(1450), SH0: V = [0, 120];
const Z23 = 5, FEET3: V = [1250, 550];
const CAM2: Cam = { s: 1, t: [0, 0] };
const CAM1: Cam = { s: Z12, t: mul(FIX12, 1 - Z12) };
const CAM0: Cam = { s: Z12 / Z01, t: add(add(mul(sub(CAM1.t, FIX01), 1 / Z01), FIX01), SH0) };
const CAM3: Cam = { s: 1 / Z23, t: sub(FEET3, mul(FEET2, 1 / Z23)) };
const CAMS = [CAM0, CAM1, CAM2, CAM3, CAM3];
const MOVE = [0, 1.0, 1.0, 1.0, 0]; // camera move at the start of each beat, s
const TEND = [0.9, 1.9, 2.3, 2.5, 1.9]; // when each beat's motion is over, s

const toScreen = (k: Cam, p: V): V => add(mul(p, k.s), k.t);
const toWorld = (k: Cam, q: V): V => mul(sub(q, k.t), 1 / k.s);

/** Zoom about the world point that cameras a and b show at the same stage spot. */
function between(a: Cam, b: Cam, e: number): Cam {
  const s = a.s ** (1 - e) * b.s ** e;
  if (Math.abs(a.s - b.s) < 1e-9) return { s, t: lerpV(a.t, b.t, e) };
  const p = mul(sub(b.t, a.t), 1 / (a.s - b.s)), q = toScreen(a, p);
  return { s, t: sub(q, mul(p, s)) };
}
const camAt = (beat: number, t: number): Cam => MOVE[beat] === 0 ? CAMS[beat] : between(CAMS[beat - 1], CAMS[beat], smoother(t / MOVE[beat]));
const worldTf = (k: Cam): string => `matrix(${k.s.toFixed(6)},0,0,${k.s.toFixed(6)},${k.t[0].toFixed(3)},${k.t[1].toFixed(3)})`;
const frameTf = (k: Cam): string => `matrix(${(1 / k.s).toFixed(8)},0,0,${(1 / k.s).toFixed(8)},${(-k.t[0] / k.s).toFixed(4)},${(-k.t[1] / k.s).toFixed(4)})`;

/** Drawn wavelength factor: slide-2 size in the wide views, 1.55× at molecule scale. */
const kOf = (s: number): number => 1 + 0.55 * clamp01(Math.log(s / CAM0.s) / Math.log(Z12 / CAM0.s));
const ampOf = (k: number): number => 6 * k ** 0.6;
const gapOf = (k: number): number => 11 + (8 * (k - 1)) / 1.5;
const K1 = kOf(Z12), K2 = kOf(1);

/* ---------------------------------------------------------------- light in the air */

// Rayleigh optical depth of the whole air column at 450, 550 and 650 nm (Hansen & Travis 1974).
const TAU: Record<Col, number> = { b: 0.221, g: 0.097, r: 0.049 };
/** Relative air mass at a solar elevation (Kasten & Young 1989). */
const airMass = (elev: number): number => { const z = 90 - elev; return 1 / (Math.cos(rad(z)) + 0.50572 * (96.07995 - z) ** -1.6364); };
const AM_DAY = airMass(ALPHA), AM_END = airMass(EPS_END); // about 2.4 and 17
/** The Sun's colour after a given air mass, as in skyAnimation.ts sunColour. */
function sunRGB(am: number): number[] {
  const tr = [0.046, 0.108, 0.265].map(t => Math.exp(-t * am)), m = Math.max(...tr);
  return tr.map(v => 255 * (v / m) ** (1 / 2.2));
}
const YELLOW = [247, 201, 72], YELLOW_STROKE = [227, 165, 28];
const strokeOf = (c: number[]): number[] => [c[0] * 0.9, c[1] * 0.8, c[2] * 0.5];
const rgb = (c: number[]): string => `rgb(${c.map(v => Math.round(v)).join(',')})`;
const mixc = (a: number[], b: number[], e: number): number[] => a.map((v, i) => lerp(v, b[i], e));

// Light scattered out of the sunset beam. Each peel is one fifth of a colour's starting light, drawn where that much of
// it has gone (uniform air along the drawn path): 5 blue, 4 green, 3 red; light arriving: blue 2 %, green 19 %, red 43 %.
const PEEL: Array<[number, Col, number, number]> = (() => {
  const out: Array<[number, Col]> = [];
  for (const c of COLS) {
    for (let j = 0; j < 5; j++) {
      const p = -Math.log(1 - (j + 0.5) / 5) / (TAU[c] * AM_END);
      if (p < 0.97) out.push([p, c]);
    }
  }
  out.sort((a, b) => a[0] - b[0]);
  const lens = [165, 130, 180, 140, 170, 130, 175, 145, 160, 175, 135, 150];
  return out.map(([p, c], i) => [p, c, -136 + (84 * i) / (out.length - 1), lens[i % lens.length]] as [number, Col, number, number]);
})();

/* ---------------------------------------------------------------- waves */

interface WOpt { amp: number; ph?: number; head?: boolean; from?: number; to?: number; env?: (d: number) => number }

/** A wave from (x0, y0) to (x1, y1), as slide 2's wv: it starts and ends on its axis; `from`/`to` clip it. */
function waveD(x0: number, y0: number, x1: number, y1: number, lam: number, o: WOpt): string {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  if (L < 2) return '';
  const ux = dx / L, uy = dy / L, head = o.head ?? false, run = head ? Math.max(1, L - 9) : L, ramp = lam * 0.7;
  const a = Math.max(0, o.from ?? 0), b = Math.min(run, o.to ?? run);
  if (b <= a) return '';
  const n = Math.max(2, Math.ceil((b - a) / 2)), pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = a + ((b - a) * i) / n, e = Math.min(1, d / ramp, (run - d) / ramp) * (o.env ? o.env(d) : 1);
    const w = Math.sin((2 * Math.PI * d) / lam + (o.ph ?? 0)) * o.amp * e;
    pts.push(`${i ? 'L' : 'M'}${f1(x0 + ux * d - uy * w)},${f1(y0 + uy * d + ux * w)}`);
  }
  if (head && (o.to === undefined || o.to >= run)) pts.push(`L${f1(x1)},${f1(y1)}`);
  return pts.join('');
}

/** The part of segment a→b inside the stage plus a margin, as parameters [t0, t1]. */
function clipSeg(a: V, b: V): [number, number] {
  let t0 = 0, t1 = 1;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const edges: Array<[number, number]> = [[-dx, a[0] + 90], [dx, 1690 - a[0]], [-dy, a[1] + 90], [dy, 830 - a[1]]];
  for (const [p, q] of edges) {
    if (Math.abs(p) < 1e-12) { if (q < 0) return [1, 0]; continue; }
    const r = q / p;
    if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
  }
  return [t0, t1];
}

/* ---------------------------------------------------------------- drawing helpers */

const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
const wpath = (c: Col, k: string, head = true, extra = ''): string =>
  `<path class="f2-w f2-w${c}" data-k="${k}"${head ? ` marker-end="url(#${ID}-h${c})"` : ''}${extra}/>`;

/** Smooth closed curve through points (Catmull–Rom). */
function closed(pts: V[]): string {
  const n = pts.length;
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return `${d}Z`;
}

/** You, standing with your feet at the origin, 86 px tall. */
const PERSON = `<circle cx="0" cy="-74" r="12"/><rect x="-10" y="-58" width="20" height="36" rx="9"/>
  <path class="sd-limb" d="M-4,-26L-7,-3M4,-26L7,-3"/><path class="sd-arm" d="M-9,-52L-15,-31M9,-52L15,-31"/>`;

function tree(x: number, y: number, h: number): string {
  const w = h * 0.36, cy = y - h * 0.62;
  return `<g class="sd-tree"><rect class="sd-trunk" x="${f1(x - h * 0.045)}" y="${f1(y - h * 0.5)}" width="${f1(h * 0.09)}" height="${f1(h * 0.5)}"/>
    <path class="sd-crown" d="${closed([[x - w, cy + h * 0.08], [x - w * 0.8, cy - h * 0.2], [x - w * 0.2, cy - h * 0.38], [x + w * 0.5, cy - h * 0.3], [x + w, cy - h * 0.02], [x + w * 0.6, cy + h * 0.16], [x - w * 0.3, cy + h * 0.18]])}"/></g>`;
}
const hill = (x0: number, x1: number, h: number): string => {
  const y0 = groundY(x0), y1 = groundY(x1);
  return `M${x0},${f1(y0)}C${f1(x0 + (x1 - x0) * 0.3)},${f1(y0 - h)} ${f1(x0 + (x1 - x0) * 0.6)},${f1(y1 - h)} ${x1},${f1(y1)}Z`;
};

/* ---------------------------------------------------------------- frame 0: the prism (stage px of "Sunlight") */

const SUN0: V = add(SUN2, SH0);
const line0 = (x: number): number => SUN0[1] + ((x - SUN0[0]) * E[1]) / E[0]; // the beam's centre line in "Sunlight"
const ENTRY0: V = add(SUN0, mul(E, 690)); // where the beam meets the prism
const PR_ROT = ALPHA - 15; // the light inside runs parallel to the prism's base, which faces up: light bends upward
const PR_S = 170, PR_H = (PR_S * Math.sqrt(3)) / 2, PR_Y = 22; // side, height, and the inner ray's height below the centroid
/** x of the left (k = −1) or right (k = 1) face at height y, in the prism's own frame (centroid at 0, base up). */
const faceX = (k: number, y: number): number => k * (PR_S / 2) * (1 - (y + PR_H / 3) / PR_H);
const PR_C: V = sub(ENTRY0, (() => { const c = polar(PR_ROT), x = faceX(-1, PR_Y); return [c[0] * x - c[1] * PR_Y, c[1] * x + c[0] * PR_Y] as V; })());
const prPt = (x: number, y: number): V => { const c = polar(PR_ROT); return [PR_C[0] + c[0] * x - c[1] * y, PR_C[1] + c[1] * x + c[0] * y]; };
const PR = { a: prPt(-PR_S / 2, -PR_H / 3), b: prPt(PR_S / 2, -PR_H / 3), c: prPt(0, (2 * PR_H) / 3) }; // base left, base right, apex (down)
const EX_UV = prPt(faceX(1, PR_Y - 8), PR_Y - 8), EX_IR = prPt(faceX(1, PR_Y + 8), PR_Y + 8); // where the spectrum leaves the prism
const IN_UP = prPt(faceX(-1, PR_Y - 10), PR_Y - 10), IN_DN = prPt(faceX(-1, PR_Y + 10), PR_Y + 10);
const LP0 = 690 - SUN_R0 - 16; // the beam's length from the Sun's edge to the prism
const XE = 1350; // the spectrum's far edge
const DEV_IR = 18, DEV_UV = 42; // deviation of the least and the most bent light, degrees (drawn, not glass values)
const fanRay = (f: number): [V, V] => {
  const s = lerpV(EX_IR, EX_UV, f), a = rad(ALPHA - DEV_IR - (DEV_UV - DEV_IR) * f);
  return [s, [XE, s[1] + (XE - s[0]) * Math.tan(a)]];
};
const IR_TO = 0.32, VIS_TO = 0.7; // shares of the spectrum: infrared, visible, ultraviolet

function frame0(): string {
  const quad = (fa: number, fb: number): string => {
    const [a0, b0] = fanRay(fa), [a1, b1] = fanRay(fb);
    return `M${f1(a0[0])},${f1(a0[1])}L${f1(b0[0])},${f1(b0[1])}L${f1(b1[0])},${f1(b1[1])}L${f1(a1[0])},${f1(a1[1])}Z`;
  };
  const N = 60, vis: string[] = [];
  for (let i = 0; i < N; i++) {
    const nm = 780 - ((i + 0.5) / N) * 400, c = spec(nm).map(v => Math.round(v * 0.88 + 250 * 0.12));
    const fa = IR_TO + ((VIS_TO - IR_TO) * i) / N, fb = IR_TO + ((VIS_TO - IR_TO) * (i + 1.04)) / N;
    vis.push(`<path d="${quad(fa, fb)}" fill="rgb(${c.join(',')})"/>`);
  }
  const lo = fanRay(0), hi = fanRay(1), mid = (fa: number, fb: number): number => (fanRay(fa)[1][1] + fanRay(fb)[1][1]) / 2;
  return `<g data-k="f0" transform="${frameTf(CAM0)}">
    <path class="sd-glass" d="M${PR.a.map(f1).join(',')}L${PR.b.map(f1).join(',')}L${PR.c.map(f1).join(',')}Z"/>
    <g data-k="spectrum">
      <path class="sd-ir" d="${quad(0, IR_TO)}"/>${vis.join('')}<path class="sd-uv" d="${quad(VIS_TO, 1)}"/>
      <path class="sd-fan-edge" d="M${f1(hi[0][0])},${f1(hi[0][1])}L${f1(hi[1][0])},${f1(hi[1][1])}L${f1(lo[1][0])},${f1(lo[1][1])}L${f1(lo[0][0])},${f1(lo[0][1])}"/>
      <path class="sd-inner" d="M${IN_UP.map(f1).join(',')}L${EX_UV.map(f1).join(',')}L${EX_IR.map(f1).join(',')}L${IN_DN.map(f1).join(',')}Z"/>
      ${T(XE + 18, mid(VIS_TO, 1) + 8, 'ultraviolet', 'sd-lab')}${T(XE + 18, mid(IR_TO, VIS_TO) + 8, 'visible', 'sd-lab')}${T(XE + 18, mid(0, IR_TO) + 8, 'infrared', 'sd-lab')}
    </g>
  </g>`;
}
// The beam's labels in "Sunlight": what it is, and a key for its three waves, stacked in the beam's order.
const KEY0: Array<[Col, string]> = [['b', 'blue light'], ['g', 'green light'], ['r', 'red light']];
const LABELS0 = `${T(318, line0(318) - 40, 'sunlight', 'sd-lab', 'start', 'sunlab')}
  <g data-k="keylab">${KEY0.map(([c, s], i) => {
    const y = 528 + 46 * i;
    return `<path class="f2-w f2-w${c}" d="${waveD(160, y, 234, y, LAM[c], { amp: 6 })}"/>${T(250, y + 8, s, `sd-key sd-key-${c}`)}`;
  }).join('')}</g>`;

/* ---------------------------------------------------------------- frame 1: air molecules (stage px of "In the air") */

// The beam runs along at(u) here too. Molecules on it, and scattered waves: [molecule, colour, direction (deg), length].
// Rayleigh: 9 blue, 4 green and 2 red, as (650/450)⁴ : (650/550)⁴ : 1 = 4.4 : 2.0 : 1.
const ON_U = [260, 450, 640, 830, 1020, 1210];
const ON_BEAM: Array<[V, 'N' | 'O', number]> = ON_U.map((u, i) => [add(at(u), [0, [2, -3, 3, -2, 2, -3][i]]), i === 2 ? 'O' : 'N', [20, -35, 60, 10, -60, 35][i]]);
const SCAT: Array<[number, Col, number, number]> = [
  [0, 'b', -125, 140], [0, 'g', 75, 165], [1, 'b', 140, 160], [1, 'b', -60, 160], [1, 'r', 100, 150],
  [2, 'b', -120, 165], [2, 'g', 55, 160], [2, 'b', -20, 150], [3, 'b', 120, 165], [3, 'r', -75, 160],
  [4, 'b', -110, 165], [4, 'g', 80, 150], [4, 'b', 160, 160], [5, 'b', -140, 140], [5, 'g', 165, 150],
];
const SCAT_DELAY = [0.03, 0, 0.05, 0.02, 0.06, 0.04, 0.01, 0.07, 0.03, 0.05, 0, 0.04, 0.02, 0.06, 0.03];
const CLIP_W = 296, CLIP_H = clipHeight(CLIP_W, RAYLEIGH_CLIP), CLIP_X = 1250, CLIP_Y = 40; // key text 0.075 w = 22 px
const LAB_MOL: V = [176, 604]; // the molecule that carries the "air molecules" label

/** Air molecules off the beam: spread evenly, clear of the Sun, the clipping, the label, the beam and the waves. */
const OFF_BEAM: Array<[V, 'N' | 'O', number]> = (() => {
  let seed = 23;
  const rnd = (): number => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const out: Array<[V, 'N' | 'O', number]> = [[LAB_MOL, 'N', 30]];
  const lineDist = (p: V): number => Math.abs((p[0] - SUN2[0]) * E[1] - (p[1] - SUN2[1]) * E[0]);
  const segDist = (p: V, a: V, b: V): number => {
    const d = sub(b, a), w = clamp01(((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]));
    return len(sub(p, add(a, mul(d, w))));
  };
  const nearWave = (p: V): boolean => SCAT.some(([m, , deg, l]) => segDist(p, ON_BEAM[m][0], add(ON_BEAM[m][0], mul(polar(deg), l + 15))) < 40);
  for (let tries = 0; tries < 4000 && out.length < 24; tries++) {
    const p: V = [70 + rnd() * 1460, 50 + rnd() * 640];
    if (len(sub(p, SUN2)) < 140 || lineDist(p) < 46 || nearWave(p)) continue;
    if (p[0] > CLIP_X - 40 && p[1] < CLIP_Y + CLIP_H + 40) continue;
    if (p[0] > LAB_MOL[0] - 40 && p[0] < LAB_MOL[0] + 260 && Math.abs(p[1] - LAB_MOL[1]) < 60) continue;
    if (out.some(([q]) => len(sub(p, q)) < 150) || ON_BEAM.some(([q]) => len(sub(p, q)) < 150)) continue;
    out.push([p, rnd() < 0.2 ? 'O' : 'N', Math.round(rnd() * 180)]);
  }
  return out;
})();

/** More air around the frame, so the molecule field has no edge while the camera arrives and leaves. */
function moreAir(): string {
  let seed = 11;
  const rnd = (): number => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const out: string[] = [];
  while (out.length < 170) {
    const x = -2400 + rnd() * 6200, y = -1100 + rnd() * 3000, a = rnd() * 180, o = rnd() < 0.2;
    if (x > -40 && x < 1640 && y > -40 && y < 780) continue;
    out.push(airMol(Math.round(x), Math.round(y), o ? 'O' : 'N', Math.round(a), 8));
  }
  return out.join('');
}
const frame1Back = (): string => `<g data-k="f1b" transform="${frameTf(CAM1)}">
  ${moreAir()}${OFF_BEAM.map(([p, a, r]) => airMol(Math.round(p[0]), Math.round(p[1]), a, r, 8)).join('')}
  ${SCAT.map((s, i) => wpath(s[1], `sc${i}`)).join('')}
  ${T(LAB_MOL[0] + 30, LAB_MOL[1] + 9, 'air molecules', 'sd-lab', 'start', 'mollab')}
</g>`;
const frame1Front = (): string => `<g data-k="f1f" transform="${frameTf(CAM1)}">
  ${ON_BEAM.map(([p, a, r]) => airMol(p[0], p[1], a, r, 8)).join('')}
</g>`;

/* ---------------------------------------------------------------- frame 2: the ground (world px) */

const TREES: Array<[number, number]> = [[300, 72], [1500, 100]];
const frame2 = (): string => `<g data-k="ground">
  <path class="sd-hill" data-k="hills" d="${hill(-60, 520, 44)}${hill(1260, 1820, 52)}"/>
  <circle class="sd-ground" cx="${GC[0]}" cy="${GC[1]}" r="${RW}"/>
  <g data-k="trees">${TREES.map(([x, h]) => tree(x, groundY(x), h)).join('')}</g>
</g>`;

// Scattered light reaching you from the whole sky: [colour, direction from the head (deg), end radius]; 9 : 4 : 2 again.
// The directions skip the direct sunlight's (about −156°).
const ARRIVE: Array<[Col, number, number]> = ([
  ['b', -176], ['g', -136], ['b', -126], ['b', -116], ['r', -106], ['b', -96], ['g', -86], ['b', -76],
  ['b', -66], ['g', -56], ['b', -46], ['r', -36], ['b', -26], ['g', -16], ['b', -6],
] as Array<[Col, number]>).map(([c, d], i) => [c, d, i % 2 ? 150 : 96]);
const ARRIVE_ORDER = [7, 3, 11, 0, 9, 5, 13, 1, 8, 4, 12, 2, 10, 6, 14];

/* ---------------------------------------------------------------- the globe inset (stage px of "Earth turns") */

// Earth seen from above the North Pole, in a round frame. Sunlight comes from the left, as in the main view; Earth
// turns anticlockwise and carries you along your latitude circle (47° N) from the middle of the sunlit half (midday) to
// the day–night line (sunset): a quarter turn, as from noon to 6 pm at the equinox.
const GLB: V = [1360, 240], GR = 140, FR = 180, YOU_R = GR * Math.cos(rad(47));
const gAt = (deg: number, r: number): V => add(GLB, mul(polar(deg), r));
const rimLand = (a0: number, a1: number, rin: number[]): string => closed([
  ...rin.map((f, i) => gAt(a1 - ((a1 - a0) * i) / (rin.length - 1), f * GR)),
  gAt(a0 - 3, 1.1 * GR), gAt((a0 + a1) / 2, 1.14 * GR), gAt(a1 + 3, 1.1 * GR),
]);
const island = (dx: number, dy: number, rs: number[]): string =>
  closed(rs.map((r, i) => add(GLB, [dx + r * Math.cos((i / rs.length) * 2 * Math.PI), dy + r * Math.sin((i / rs.length) * 2 * Math.PI)])));
/** Your angle on the globe (stage degrees): 180 faces the Sun, 90 is the evening day–night line. */
const youAngle = (turn: number): number => 180 - 90 * turn;

function globe(): string {
  const k = GR / 200;
  const lands = [
    rimLand(156, 214, [1, 0.86, 0.79, 0.74, 0.8, 0.85, 1]), // your land
    rimLand(300, 340, [1, 0.85, 0.8, 0.86, 1]),
    rimLand(16, 74, [1, 0.82, 0.73, 0.77, 0.7, 0.84, 1]),
    rimLand(236, 272, [1, 0.87, 0.82, 0.88, 1]),
    island(-30 * k, 120 * k, [26, 30, 24, 20, 25, 22].map(r => r * k)),
    island(70 * k, -50 * k, [24, 28, 22, 26, 20].map(r => r * k)),
  ];
  // Sunlight arriving from the left, between the frame and the globe.
  const rays = [-72, -24, 24].map(dy => {
    const xf = GLB[0] - Math.sqrt(FR * FR - dy * dy) + 9, xg = GLB[0] - Math.sqrt(GR * GR - dy * dy) - 9;
    return `<path class="sd-sunray" d="M${f1(xf)},${f1(GLB[1] + dy)}H${f1(xg)}" marker-end="url(#${ID}-hsun)"/>`;
  }).join('');
  const a0 = gAt(150, GR + 19), a1 = gAt(108, GR + 19);
  return `<g data-k="globe">
    <circle class="sd-frame" cx="${GLB[0]}" cy="${GLB[1]}" r="${FR}" filter="url(#${ID}-sh)"/>
    ${rays}
    <path class="sd-turn" d="M${f1(a0[0])},${f1(a0[1])}A${GR + 19},${GR + 19} 0 0 0 ${f1(a1[0])},${f1(a1[1])}" marker-end="url(#${ID}-hturn)"/>
    <circle class="sd-ocean" cx="${GLB[0]}" cy="${GLB[1]}" r="${GR}"/>
    <g clip-path="url(#${ID}-gclip)"><g data-k="gland">${lands.map(d => `<path class="sd-land" d="${d}"/>`).join('')}</g>
      <circle class="sd-cap" cx="${GLB[0]}" cy="${GLB[1]}" r="${f1(GR * 0.2)}"/>
      <rect x="${GLB[0] - 5}" y="${GLB[1] - GR}" width="${GR + 5}" height="${2 * GR}" fill="url(#${ID}-gnight)"/></g>
    <circle class="sd-rim" cx="${GLB[0]}" cy="${GLB[1]}" r="${GR}"/>
    <g data-k="gyou"><circle class="sd-you-dot" r="8"/>${T(15, 8, 'you', 'sd-you sd-halo')}</g>
  </g>`;
}

/** Rayleigh's wink in "In the air", once the clipping is in: shut over 0.08 s, hold 0.15 s, open over 0.1 s. */
const WINK = 1.5;
const wink = (beat: number, t: number): number =>
  beat !== 1 ? 0 : t < WINK + 0.08 ? smooth((t - WINK) / 0.08) : t < WINK + 0.23 ? 1 : 1 - smooth((t - WINK - 0.23) / 0.1);

/* ---------------------------------------------------------------- staging */

export const STAGING: Staging = {
  id: 'd',
  name: 'D · One sunbeam',
  note: 'The camera rides one sunbeam from the Sun into the air, down to you, and stays with you as Earth turns to sunset.',
  svg: () => `${defs(ID)}
    <defs>
      <radialGradient id="${ID}-band" gradientUnits="userSpaceOnUse" cx="${GC[0]}" cy="${GC[1]}" r="${RW + HW}">
        <stop offset="${(RW / (RW + HW)).toFixed(6)}" stop-color="#b9d1ef" stop-opacity=".95"/>
        <stop offset="${((RW + 0.86 * HW) / (RW + HW)).toFixed(6)}" stop-color="#c8dbf2" stop-opacity=".85"/>
        <stop offset="1" stop-color="#d9e6f6" stop-opacity="0"/></radialGradient>
      <radialGradient id="${ID}-glow2"><stop offset="0" stop-color="#fbe9a8" stop-opacity=".85"/><stop offset="1" stop-color="#fbe9a8" stop-opacity="0"/></radialGradient>
      <radialGradient id="${ID}-glow3"><stop offset="0" stop-color="#f4a468" stop-opacity=".7"/><stop offset=".4" stop-color="#f6c08e" stop-opacity=".3"/><stop offset="1" stop-color="#f6c08e" stop-opacity="0"/></radialGradient>
      ${COLS.map(c => `<linearGradient id="${ID}-a${c}" data-k="a${c}" gradientUnits="userSpaceOnUse">${Array.from({ length: 13 }, (_, i) => `<stop offset="${(i / 12).toFixed(3)}" stop-color="${HEX[c]}"/>`).join('')}</linearGradient>`).join('')}
      ${COLS.map(c => `<marker id="${ID}-m${c}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path data-k="mk${c}" fill="${HEX[c]}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
      <linearGradient id="${ID}-gnight" gradientUnits="userSpaceOnUse" x1="${GLB[0] - 5}" y1="0" x2="${GLB[0] + 5}" y2="0">
        <stop offset="0" stop-color="#3f4a66" stop-opacity="0"/><stop offset="1" stop-color="#3f4a66" stop-opacity=".42"/></linearGradient>
      <marker id="${ID}-hsun" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path fill="#e3a51c" d="M0,0L10,5L0,10z"/></marker>
      <marker id="${ID}-hturn" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto"><path fill="#6b6a64" d="M0,0L10,5L0,10z"/></marker>
      <clipPath id="${ID}-gclip"><circle cx="${GLB[0]}" cy="${GLB[1]}" r="${GR}"/></clipPath>
      <linearGradient id="${ID}-ghg" data-k="ghg" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop data-k="ghs" offset=".2" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient>
      <mask id="${ID}-ghm" maskUnits="userSpaceOnUse" x="-100" y="-100" width="1800" height="940"><rect x="-100" y="-100" width="1800" height="940" fill="url(#${ID}-ghg)"/></mask>
    </defs>
    <g class="sd-world" data-k="wa"><circle data-k="band" cx="${GC[0]}" cy="${GC[1]}" r="${RW + HW}" fill="url(#${ID}-band)"/></g>
    <circle data-k="glow3" r="300" fill="url(#${ID}-glow3)"/>
    <g class="sd-world" data-k="wb">${frame2()}${frame0()}${frame1Back()}</g>
    <g data-k="sun"><circle data-k="glow2" r="110" fill="url(#${ID}-glow2)"/><path class="f2-ray" data-k="rays"/><circle data-k="disc" stroke-width="2"/></g>
    <g data-k="ghost" mask="url(#${ID}-ghm)">${COLS.map(c => wpath(c, `gh${c}`)).join('')}</g>
    <g data-k="beam">${COLS.map(c => `<path class="f2-w" data-k="m${c}" style="stroke:url(#${ID}-a${c})"/>`).join('')}</g>
    <g data-k="lab0">${LABELS0}</g>
    <g class="sd-world" data-k="wc">${frame1Front()}</g>
    <g data-k="peels">${PEEL.map((p, i) => wpath(p[1], `pe${i}`)).join('')}</g>
    <g data-k="arrive">${ARRIVE.map(([c], i) => wpath(c, `ar${i}`)).join('')}</g>
    <g data-k="person"><g class="sd-person" data-k="body">${PERSON}</g>${T(0, 0, 'you', 'sd-you', 'start', 'you')}</g>
    ${T(0, 0, 'air', 'sd-lab', 'start', 'airlab')}
    ${T(0, 0, 'midday', 'sd-lab', 'start', 'midlab')}${T(0, 0, 'sunset', 'sd-lab', 'start', 'setlab')}
    ${globe()}
    <g data-k="clip">${clipping(ID, CLIP_X, CLIP_Y, CLIP_W, RAYLEIGH_CLIP, -2)}</g>`,

  bind(stage) {
    const q = <E extends Element>(k: string): E => stage.querySelector(`[data-k="${k}"]`) as E;
    // Writes an attribute only when its value changes (the frozen end state then costs nothing per frame).
    const cache = new Map<Element, Map<string, string>>();
    const set = (el: Element, a: string, v: string): void => {
      let m = cache.get(el);
      if (!m) { m = new Map(); cache.set(el, m); }
      if (m.get(a) === v) return;
      m.set(a, v);
      el.setAttribute(a, v);
    };
    const op = (el: Element, v: number): void => {
      (el as SVGElement).style.display = v < 0.004 ? 'none' : '';
      set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
    };
    const worlds = ['wa', 'wb', 'wc'].map(k => q(k));
    const band = q('band'), groundG = q('ground'), trees = q('trees'), hills = q('hills'), glow3 = q('glow3');
    const f0 = q('f0'), spectrum = q('spectrum'), lab0 = q('lab0'), sunlab = q('sunlab'), keylab = q('keylab');
    const f1b = q('f1b'), f1f = q('f1f'), mollab = q('mollab'), scat = SCAT.map((_, i) => q(`sc${i}`));
    const glow2 = q('glow2'), rays = q('rays'), disc = q('disc');
    const beamW = COLS.map(c => q(`m${c}`)), gradEl = COLS.map(c => q(`a${c}`)), marks = COLS.map(c => q(`mk${c}`));
    const grads = gradEl.map(g => Array.from(g.children));
    const peelG = q('peels'), peel = PEEL.map((_, i) => q(`pe${i}`));
    const arriveG = q('arrive'), arr = ARRIVE.map((_, i) => q(`ar${i}`));
    const personG = q('person'), body = q('body'), you = q('you'), airlab = q('airlab');
    const ghostG = q('ghost'), ghost = COLS.map(c => q(`gh${c}`)), ghg = q('ghg'), ghs = q('ghs'), midlab = q('midlab'), setlab = q('setlab');
    const globeG = q('globe'), gland = q('gland'), gyou = q('gyou');
    const clipG = q('clip');

    /** A wave that grows from p along direction deg to length len·g, crests travelling with its front. */
    function grow(el: Element, c: Col, p: V, deg: number, length: number, g: number, k: number, amp: number, ph0 = 0): void {
      if (g <= 0.001) { set(el, 'd', ''); return; }
      const l = length * g, d = polar(deg), lam = LAM[c] * k;
      set(el, 'd', waveD(p[0], p[1], p[0] + d[0] * l, p[1] + d[1] * l, lam, { amp, head: true, ph: ph0 - (2 * Math.PI * l) / lam }));
    }
    /** How far along the ray from `head` in direction v the air band reaches, in stage px. */
    function inBand(cam: Cam, head: V, v: V): number {
      const cb = toScreen(cam, GC), rb = (RW + HW) * cam.s, w = sub(head, cb);
      const b = w[0] * v[0] + w[1] * v[1], c = w[0] * w[0] + w[1] * w[1] - rb * rb;
      return -b + Math.sqrt(Math.max(0, b * b - c));
    }

    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const key = `${b}:${Math.max(0, Math.min(t, TEND[b])).toFixed(3)}`;
      if (key === last) return;
      last = key;
      const tb = (k: number): number => b === k ? Math.max(0, t) : b > k ? 99 : 0; // time within beat k; its end state once past it
      const t0 = tb(0), t1 = tb(1), t2 = tb(2), t3 = tb(3), t4 = tb(4);
      const cam = camAt(b, Math.max(0, t)), s = cam.s, k = kOf(s);
      worlds.forEach(w => set(w, 'transform', worldTf(cam)));

      // You: feet on the world ground, drawn at a size that shrinks more slowly than the world as the camera pulls out.
      const feet = toScreen(cam, FEET2), ph = PH * Math.min(1, s) ** 0.55, head: V = [feet[0], feet[1] - ph];

      // The Sun: at infinity, on the beam's line up to "Blue sky"; in "Earth turns" it sinks along the sky seen from you.
      const sink = smoother((t3 - 0.9) / 1.4), elev = b >= 3 ? lerp(ALPHA, EPS_END, sink) : ALPHA;
      let sunC: V;
      if (b < 3) {
        const p = toScreen(cam, HEAD2);
        sunC = [SUN_X, p[1] + ((SUN_X - p[0]) * E[1]) / E[0]];
      } else sunC = sub(head, mul(polar(elev), D_SUN));
      // "Sunset": the light crosses the long path; `front` is how far along it the losses are shown.
      const front = b === 4 ? clamp01((t4 - 0.1) / 1.5) : 0;
      const pale = tw(t2, 0.3, 1.0), sunR = lerp(SUN_R0, SUN_R2, tw(t2, 0.2, 1.0));
      const lit = b < 3 ? mixc(YELLOW, sunRGB(AM_DAY), pale) : sunRGB(lerp(AM_DAY, AM_END, front));
      const litStroke = b < 3 ? mixc(YELLOW_STROKE, strokeOf(sunRGB(AM_DAY)), pale) : strokeOf(lit);
      set(disc, 'cx', f1(sunC[0])); set(disc, 'cy', f1(sunC[1])); set(disc, 'r', f1(sunR));
      set(disc, 'fill', rgb(lit)); set(disc, 'stroke', rgb(litStroke));
      set(glow2, 'cx', f1(sunC[0])); set(glow2, 'cy', f1(sunC[1])); op(glow2, pale * (1 - front));
      op(rays, 1 - pale);
      if (pale < 1) {
        set(rays, 'd', Array.from({ length: 12 }, (_, i) => {
          const c = Math.cos((i * Math.PI) / 6), sn = Math.sin((i * Math.PI) / 6);
          return `M${f1(sunC[0] + c * (sunR + 8))},${f1(sunC[1] + sn * (sunR + 8))}L${f1(sunC[0] + c * (sunR + 17))},${f1(sunC[1] + sn * (sunR + 17))}`;
        }).join(''));
      }
      set(glow3, 'cx', f1(sunC[0])); set(glow3, 'cy', f1(sunC[1])); op(glow3, 0.8 * front);

      // "Sunlight": the beam reaches the prism; the spectrum and the labels appear whole; all leave as the camera does.
      op(f0, b === 0 ? 1 : b === 1 ? 1 - tw(t1, 0, 0.3) : 0);
      op(spectrum, tw(t0, 0.6, 0.85));
      op(lab0, b === 0 ? 1 : b === 1 ? 1 - tw(t1, 0, 0.25) : 0);
      op(sunlab, tw(t0, 0.2, 0.45)); op(keylab, tw(t0, 0.4, 0.65));

      // The beam, from the Sun's edge to your head (to the prism in "Sunlight").
      const u0 = unit(sunC, head), start = add(sunC, mul(u0, sunR + 16)), Lfull = len(sub(head, start));
      const entry0 = toScreen(cam, toWorld(CAM0, ENTRY0)), Lprism = len(sub(entry0, start));
      const reach = b === 0 ? Lprism * easeOut(t0 / 0.6) : b === 1 ? lerp(Lprism, Lfull, easeOut(t1 / 0.4)) : Lfull;
      // What the air takes out of it (Rayleigh), over the stretch inside the air band: the midday loss from "Blue sky"
      // on; in "Sunset" the long path's loss, shown up to `front`.
      const lb = b >= 2 ? Math.min(Lfull, inBand(cam, head, mul(u0, -1))) : 0, qe = Lfull > 0 ? 1 - lb / Lfull : 1;
      const amDay = b === 2 ? AM_DAY * tw(t2, 0.9, 2.2) : b > 2 ? AM_DAY : 0;
      const field = (c: Col, qq: number): number => {
        if (qq <= qe) return 1;
        const p = (qq - qe) / (1 - qe);
        return Math.exp(-0.5 * TAU[c] * (amDay * p + (AM_END - AM_DAY) * Math.min(p, front)));
      };
      // The crests move on with each camera move, and along the path as the sunset light crosses it, then hold.
      const phi = b === 0 ? reach + LP0 - Lprism : LP0 + 50 * Math.min(b - 1, 2) + (b <= 3 ? 50 * easeOut(t / 1.0) : 50) + 60 * front;
      const gap = gapOf(k), amp = ampOf(k), n: V = [-u0[1], u0[0]];
      const end = add(start, mul(u0, Lfull));
      COLS.forEach((c, i) => {
        const o = (i - 1) * gap, a2 = add(start, mul(n, o)), b2 = add(end, mul(n, o)), lam = LAM[c] * k;
        const [c0, c1] = clipSeg(a2, b2), headOn = b >= 1 && reach >= Lfull - 0.5 && c1 >= 1 && field(c, 1) > 0.25;
        set(beamW[i], 'd', c1 > c0 ? waveD(a2[0], a2[1], b2[0], b2[1], lam, {
          amp, head: headOn, from: c0 * Lfull, to: headOn ? undefined : Math.min(c1 * Lfull, reach),
          ph: (-2 * Math.PI * phi) / lam + i * 1.3, env: d => field(c, d / Lfull),
        }) : '');
        set(beamW[i], 'marker-end', headOn ? `url(#${ID}-m${c})` : 'none');
        set(marks[i], 'fill-opacity', field(c, 1).toFixed(3));
        set(gradEl[i], 'x1', f1(start[0])); set(gradEl[i], 'y1', f1(start[1])); set(gradEl[i], 'x2', f1(end[0])); set(gradEl[i], 'y2', f1(end[1]));
        grads[i].forEach((st, j) => set(st, 'stop-opacity', field(c, j / 12).toFixed(3)));
      });

      // "In the air": air molecules come into view; scattered waves leave all at once; the clipping appears, and winks.
      const air = b === 1 ? tw(t1, 0.35, 0.65) : b === 2 ? 1 - tw(t2, 0.1, 0.4) : 0;
      op(f1b, air); op(f1f, air);
      op(mollab, b === 1 ? tw(t1, 0.95, 1.2) : b === 2 ? 1 - tw(t2, 0, 0.25) : 0);
      SCAT.forEach(([m, c, deg, l], i) => {
        const d = polar(deg), p = add(ON_BEAM[m][0], mul(d, 15));
        grow(scat[i], c, p, deg, l, smooth((t1 - 1.0 - SCAT_DELAY[i]) / 0.7), K1, 8, i * 0.9);
      });
      op(clipG, b === 1 ? tw(t1, 1.1, 1.35) : b === 2 ? 1 - tw(t2, 0, 0.3) : 0);
      clipFx(stage, wink(b, t));

      // "Blue sky": the ground and you; scattered light arrives from the whole sky, and the sky fills pale blue.
      const ground = b === 2 ? tw(t2, 0.5, 0.8) : b > 2 ? 1 : 0;
      op(groundG, ground); op(personG, ground);
      const scenery = b === 3 ? 1 - tw(t3, 0, 0.3) : b > 3 ? 0 : 1; // trees and hills would shrink to specks
      op(trees, scenery); op(hills, scenery);
      op(band, b === 2 ? 0.2 * ground + 0.8 * tw(t2, 0.9, 2.2) : b > 2 ? 1 : 0);
      set(body, 'transform', `translate(${f1(feet[0])} ${f1(feet[1])}) scale(${(ph / 86).toFixed(4)})`);
      set(you, 'x', f1(feet[0] + 14 + ph * 0.18)); set(you, 'y', f1(feet[1] - ph * 0.36 + 9));
      op(you, b === 2 ? tw(t2, 0.9, 1.15) : b > 2 ? 1 : 0);
      op(arriveG, b === 2 ? 1 : b === 3 ? 1 - tw(t3, 0, 0.3) : 0);
      ARRIVE.forEach(([c, deg, rEnd], i) => {
        const tau = 0.9 + ARRIVE_ORDER.indexOf(i) * 0.03, g = (t2 - tau) / 0.9;
        if (g <= 0) { set(arr[i], 'd', ''); return; }
        const r = lerp(560, rEnd, smoother(g)), d = polar(deg), lam = LAM[c] * K2;
        const h: V = add(head, mul(d, r)), o: V = add(h, mul(d, 150));
        set(arr[i], 'd', waveD(o[0], o[1], h[0], h[1], lam, { amp: 6, head: true, ph: i * 0.7 }));
        set(arr[i], 'opacity', tw(t2, tau, tau + 0.25).toFixed(3));
      });

      // "Earth turns": the camera pulls out from you until the air band shows; the globe turns with you on it as the Sun
      // sinks. A faded ghost of the midday beam stays behind, so its short stretch through the air compares with the long
      // sunset one; both leave as the light starts across the sunset path.
      op(globeG, b === 3 ? tw(t3, 0.2, 0.45) : b > 3 ? 1 : 0);
      const gp = gAt(youAngle(sink), YOU_R); // Earth turns as the Sun sinks
      set(gland, 'transform', `rotate(${(-90 * sink).toFixed(3)} ${GLB[0]} ${GLB[1]})`);
      set(gyou, 'transform', `translate(${f1(gp[0])} ${f1(gp[1])})`);
      const bandH = HW * s;
      set(airlab, 'x', f1(feet[0] + 205)); set(airlab, 'y', f1(feet[1] - bandH * 0.45 + 9));
      op(airlab, b === 3 ? tw(t3, 0.75, 1.0) : b > 3 ? 1 : 0);
      const ghostOn = b === 3 ? tw(t3, 0.9, 1.1) : b === 4 ? 1 - tw(t4, 0, 0.3) : 0;
      op(ghostG, 0.35 * ghostOn);
      if (ghostOn > 0) {
        const ug = polar(ALPHA), ng: V = [-ug[1], ug[0]], far = sub(head, mul(ug, 2400));
        // Full strength over its stretch through the air, fading beyond it.
        const lm = inBand(cam, head, mul(ug, -1)), edge = sub(head, mul(ug, Math.min(1300, head[1] / ug[1])));
        set(ghg, 'x1', f1(head[0])); set(ghg, 'y1', f1(head[1])); set(ghg, 'x2', f1(edge[0])); set(ghg, 'y2', f1(edge[1]));
        set(ghs, 'offset', clamp01(lm / len(sub(edge, head))).toFixed(3));
        COLS.forEach((c, i) => {
          const o = (i - 1) * gap, a2 = add(far, mul(ng, o)), b2 = add(head, mul(ng, o)), [c0, c1] = clipSeg(a2, b2), L = len(sub(b2, a2));
          set(ghost[i], 'd', c1 > c0 ? waveD(a2[0], a2[1], b2[0], b2[1], LAM[c] * k, { amp, head: c1 >= 1, from: c0 * L, ph: i * 1.3 }) : '');
        });
      }
      const pm = sub(head, mul(polar(ALPHA), 560)), ps = sub(head, mul(polar(EPS_END), 700));
      set(midlab, 'x', f1(pm[0])); set(midlab, 'y', f1(pm[1] - 40)); set(setlab, 'x', f1(ps[0])); set(setlab, 'y', f1(ps[1] - 38));
      const leave = b === 4 ? 1 - tw(t4, 0, 0.3) : 1;
      op(midlab, b === 3 ? tw(t3, 0.75, 1.0) : b === 4 ? leave : 0);
      op(setlab, b === 3 ? tw(t3, 2.2, 2.45) : b === 4 ? leave : 0);

      // "Sunset": as the light crosses the path, blue peels off first, then green and a little red.
      op(peelG, b === 4 ? 1 : 0);
      PEEL.forEach(([p, c, deg, l], i) => {
        const o = (COLS.indexOf(c) - 1) * gap, base = add(add(head, mul(u0, -lb * (1 - p))), mul(n, o));
        grow(peel[i], c, base, deg, l, b === 4 ? smooth((t4 - (0.1 + 1.5 * p)) / 0.4) : 0, k, 6, i * 0.8);
      });
    };
  },
};
