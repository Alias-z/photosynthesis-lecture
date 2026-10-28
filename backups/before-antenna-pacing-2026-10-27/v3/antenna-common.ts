// "To the reaction centre" (slide 6): the parts both stagings share. The flash experiment of Emerson & Arnold (lamp,
// flask of algae, the two counters, the field of 2,400 chlorophylls), their clipping, the real PSII–LHCII structure with
// its pigments, the hop path and the energy staircase. Each staging (antenna-a, antenna-b) moves its own camera
// through these.
//
// Images (copied to assets/anim/antenna; credits):
// - emerson-nas.png: Robert Emerson, halftone (scripts/halftone.py, crop 425,440–1075,1250 of the page at 300 dpi) of the
//   frontispiece portrait in E. Rabinowitch, Robert Emerson 1903–1959, Biographical Memoirs of the National Academy of
//   Sciences (1961), © NAS.
// - arnold-nas.png: William A. Arnold, halftone (crop 1225,250–1675,810 of p. 2 at 300 dpi) of the portrait in
//   Govindjee & N. Srivastava, William Archibald Arnold 1904–2001, Biographical Memoirs of the NAS (2014), photo
//   courtesy of the family of William Arnold, © NAS.
// - ea1932-fig1.png: Emerson & Arnold 1932, J Gen Physiol 16:191, Fig. 1 (p. 194), photosynthesis per flash against
//   flash intensity, levelling off at the brightest flashes; page scan from the Internet Archive (Digital Library of
//   India copy, item in.ernet.dli.2015.66762, leaf n204), cropped to the plot (legend left out), ink made transparent
//   (staging board L2b, image k). The paper measured CO₂ reduced per flash (2,480 chlorophylls per CO₂, Fig. 2); the
//   fixed caption's O₂ is the same count, one O₂ per CO₂.
// - psii-*.webp (look A) and psii-ht-*.png (look B): our own renders of the pea PSII–LHCII supercomplex C₂S₂M₂, PDB 5XNL
//   (Su et al. 2017, Science 357:815), seen from the stroma: 3Dmol.js 2.5.5 cartoon, orthographic, 4 px per Å, in
//   headless Chrome (render page and scripts in the session scratchpad, antwork/render and antwork/tools). base = all
//   chains, pale grey; lhcii, minor, core, rc = the lit monomer's LHCII trimers, CP24/26/29, CP43/47 and D1/D2 in their
//   tint, same frame. The ht files are the same layers as a newsprint dot screen (45°, 4.5 px cells).
// - Pigment positions: antenna-data.ts (Mg of each chlorophyll and pheophytin; each carotenoid's two end atoms), from
//   5XNL. The hop path is slide 6's nearest-neighbour path (19 hops, Mg–Mg 0.9–2.4 nm), which follows Kouřil et al.
//   2012's route M-LHCII → CP29 → CP47 → reaction centre (reference board L3, image i): an illustration, not a measured
//   path.
//
// Physics kept on the stage:
// - Energy hops, not electrons: the excitation is the amber glow; nothing leaves the reaction centre here.
// - Downhill only from Chl b to Chl a: the staircase is to scale in energy, E = 1239.84 eV·nm / λ. Chl b (650 nm) →
//   Chl a drops 0.08 eV. The Chl a of LHCII, CP29 and the core antenna (CP43/47) absorb at ≈ 676–680 nm, drawn at
//   678 nm, about level with P680 (680 nm): the last hops into the reaction centre are nearly flat (0.005 eV). The energy
//   ends there because the reaction centre traps it (charge separation, the flash), not because of a drop (Croce & van
//   Amerongen 2014, Fig. 4b; coordinator's physics note, 27 Oct 2026).
// - Per monomer of 5XNL: 157 chlorophylls, 2 pheophytins and 42 carotenoids, about 200 pigments around one reaction
//   centre ("hundreds" in the caption).
// - Flash field: 2,400 chlorophylls per O₂ per saturating flash (Emerson & Arnold 1932). One O₂ needs four charge
//   separations in PSII, and PSI turns over too, so the field has 8 reaction centres (≈ 300 chlorophylls each) that do
//   chemistry, not one: a single centre per 2,400 would contradict the ~200–300 pigments per centre of beat 2.
import '../figs/clipping.css';
import './antenna-common.css';
import arnold from '../../assets/anim/antenna/arnold-nas.png';
import fig1 from '../../assets/anim/antenna/ea1932-fig1.png';
import emerson from '../../assets/anim/antenna/emerson-nas.png';
import aBase from '../../assets/anim/antenna/psii-base.webp';
import aCore from '../../assets/anim/antenna/psii-core.webp';
import aLhcii from '../../assets/anim/antenna/psii-lhcii.webp';
import aMinor from '../../assets/anim/antenna/psii-minor.webp';
import aRc from '../../assets/anim/antenna/psii-rc.webp';
import bBase from '../../assets/anim/antenna/psii-ht-base.png';
import bCore from '../../assets/anim/antenna/psii-ht-core.png';
import bLhcii from '../../assets/anim/antenna/psii-ht-lhcii.png';
import bMinor from '../../assets/anim/antenna/psii-ht-minor.png';
import bRc from '../../assets/anim/antenna/psii-ht-rc.png';
import { CAR, CHL, PATH } from './antenna-data';

export type V = [number, number];
/** A view: stage = s · scene + t. */
export interface Tf { s: number; t: V }

export const f1 = (v: number): string => v.toFixed(1);
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const smooth = (x: number): number => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const smoother = (x: number): number => { const u = clamp01(x); return u * u * u * (u * (u * 6 - 15) + 10); };
export const easeOut = (x: number): number => { const u = clamp01(x); return 1 - (1 - u) * (1 - u); };
export const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
export const lerpV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
/** 0 → 1 over the time window [t0, t1]. */
export const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
export const ID_TF: Tf = { s: 1, t: [0, 0] };
export const tfStr = (v: Tf): string => `matrix(${v.s.toFixed(5)},0,0,${v.s.toFixed(5)},${v.t[0].toFixed(2)},${v.t[1].toFixed(2)})`;
export const onStage = (v: Tf, p: V): V => [v.s * p[0] + v.t[0], v.s * p[1] + v.t[1]];
export const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
/** Chlorophyll a and b with the italic letter (IUPAC). */
export const CHL_A = 'Chl <tspan font-style="italic">a</tspan>';
export const CHL_B = 'Chl <tspan font-style="italic">b</tspan>';

/** A dive: scene B sits inside scene A at A's point fa, Z times smaller; the camera zooms from A (e = 0) to B (e = 1),
 *  carrying fa to B's focus fb on the stage. Returns the views of A and of B. */
export function dive(fa: V, fb: V, Z: number, e: number): [Tf, Tf] {
  const c = lerpV(fa, fb, e), sa = Z ** e, sb = Z ** (e - 1);
  return [{ s: sa, t: [c[0] - fa[0] * sa, c[1] - fa[1] * sa] }, { s: sb, t: [c[0] - fb[0] * sb, c[1] - fb[1] * sb] }];
}
/** The view part way from a to b: the scale changes evenly in log, the point at the stage centre glides between. */
export function tween(a: Tf, b: Tf, e: number): Tf {
  const C: V = [800, 370], ca: V = [(C[0] - a.t[0]) / a.s, (C[1] - a.t[1]) / a.s], cb: V = [(C[0] - b.t[0]) / b.s, (C[1] - b.t[1]) / b.s];
  const s = a.s * (b.s / a.s) ** e, c = lerpV(ca, cb, e);
  return { s, t: [C[0] - s * c[0], C[1] - s * c[1]] };
}

/** Small deterministic random numbers. */
export function rng(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}
/** A rectangle with slightly irregular, scissor-cut edges (as figs/clipping.ts). */
export function cutPath(x: number, y: number, w: number, h: number, seed: number, jag = 3.6): string {
  const r = rng(seed), pts: V[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number): void => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 14)), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    for (let i = 0; i < n; i++) { const t = i / n, o = (r() - 0.5) * jag; pts.push([x0 + (x1 - x0) * t + (nx / L) * o, y0 + (y1 - y0) * t + (ny / L) * o]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return `M${pts.map(q => `${f1(q[0])},${f1(q[1])}`).join('L')}Z`;
}

/** The per-frame setters of a stage: attribute writes are cached, so an unchanged frame writes nothing. */
export function setters(stage: SVGSVGElement): {
  q: <E extends Element = SVGElement>(k: string) => E;
  set: (el: Element, a: string, v: string) => void;
  op: (el: Element, v: number) => void;
} {
  const cache = new Map<Element, Map<string, string>>();
  const q = <E extends Element = SVGElement>(k: string): E => stage.querySelector(`[data-k="${k}"]`) as E;
  const set = (el: Element, a: string, v: string): void => {
    let m = cache.get(el);
    if (!m) { m = new Map(); cache.set(el, m); }
    if (m.get(a) === v) return;
    m.set(a, v);
    if (a === 'text') el.textContent = v; else el.setAttribute(a, v);
  };
  const op = (el: Element, v: number): void => {
    set(el, 'display', v < 0.004 ? 'none' : 'inline');
    set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
  };
  return { q, set, op };
}

/* ---------------------------------------------------------------- the clipping: Emerson & Arnold, 1932 */

/** Height of the pair clipping drawn `w` wide. */
export const pairClipH = (w: number): number => w * 0.86;
/** The newsprint clipping with both halftone portraits, their names and the year. `p` prefixes its ids. */
export function pairClip(p: string, x: number, y: number, w: number, rot = -2, seed = 23): string {
  const h = pairClipH(w), m = w * 0.06, pw = (w - 3 * m) / 2, ph = pw * 1.25, ny = y + m + ph + w * 0.085, yy = ny + w * 0.1;
  const por = (href: string, px: number): string => `<image href="${href}" x="${f1(px)}" y="${f1(y + m)}" width="${f1(pw)}" height="${f1(ph)}" preserveAspectRatio="xMidYMid slice"/>`;
  return `<g class="clip" transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${p}-clipsh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${p}-clipsh)"/>
    ${por(emerson, x + m)}${por(arnold, x + 2 * m + pw)}
    <text class="clip-name" x="${f1(x + m + pw / 2)}" y="${f1(ny)}" text-anchor="middle" font-size="${f1(w * 0.082)}">Emerson</text>
    <text class="clip-name" x="${f1(x + 2 * m + 1.5 * pw)}" y="${f1(ny)}" text-anchor="middle" font-size="${f1(w * 0.082)}">Arnold</text>
    <text class="clip-find" x="${f1(x + w / 2)}" y="${f1(yy)}" text-anchor="middle" font-size="${f1(w * 0.088)}">1932</text>
  </g>`;
}

/** Their Fig. 1 (yield per flash levels off at the brightest flashes) as a newsprint clipping, `w` wide. */
export const FIG1_AR = 763 / 1015;
export const fig1ClipH = (w: number): number => w * (FIG1_AR + 0.12);
export function fig1Clip(p: string, x: number, y: number, w: number, rot = 2, seed = 31): string {
  const h = fig1ClipH(w), m = w * 0.06;
  return `<g class="clip" transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${p}-figsh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${p}-figsh)"/>
    <image href="${fig1}" x="${f1(x + m)}" y="${f1(y + m)}" width="${f1(w - 2 * m)}" height="${f1((w - 2 * m) * FIG1_AR)}"/>
  </g>`;
}
/** Where the brightest flash's points sit in the figure (fractions of its width and height). */
export const FIG1_TOP: V = [0.969, 0.05];
export const FIG1 = fig1;
export const EMERSON = emerson, ARNOLD = arnold;

/* ---------------------------------------------------------------- the experiment: flash lamp and a flask of algae */

/** The bench drawing is shifted right by this much, to leave the left side to the clippings. */
export const BENCH_DX = 120;

const FLASK_C: V = [650, 500]; // in the bench drawing's own frame (before BENCH_DX)
export const FLASK_R = 96;
const LIQ_Y = 446; // the suspension's level in the flask
/** The algal cells drawn in the flask, and the one the camera dives into (look A). */
const CELLS: V[] = (() => {
  const r = rng(91), out: V[] = [];
  while (out.length < 46) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (FLASK_R - 10), p: V = [FLASK_C[0] + Math.cos(a) * d, FLASK_C[1] + Math.sin(a) * d];
    if (p[1] > LIQ_Y + 8 && !out.some(o => Math.hypot(o[0] - p[0], o[1] - p[1]) < 12)) out.push(p);
  }
  return out;
})();
/** The cell the camera dives into, on the stage. */
export const DIVE_CELL: V = [666 + BENCH_DX, 530];

/** The bench with the lamp, the flask and their labels. `k` prefixes the moving parts' keys (no keys when empty:
 *  a printed copy). */
export function benchSvg(p: string, k: string): string {
  const kk = (s: string): string => (k ? ` data-k="${k}-${s}"` : '');
  const [fx, fy] = FLASK_C, R = FLASK_R;
  const cells = CELLS.map(c => `<circle class="an-cell" cx="${f1(c[0])}" cy="${f1(c[1])}" r="3.3"/>`).join('');
  return `<g transform="translate(${BENCH_DX} 0)"><defs>
      <clipPath id="${p}-liq"><circle cx="${fx}" cy="${fy}" r="${R - 3}"/></clipPath>
      <radialGradient id="${p}-burst"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#fff6c8"/><stop offset=".6" stop-color="#f7c948" stop-opacity=".55"/><stop offset="1" stop-color="#f7c948" stop-opacity="0"/></radialGradient>
      <linearGradient id="${p}-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3b8" stop-opacity=".95"/><stop offset="1" stop-color="#f7c948" stop-opacity=".25"/></linearGradient>
    </defs>
    <rect class="an-bench" x="190" y="600" width="680" height="14" rx="3"/>
    <path class="an-stand" d="M352,600V468M312,600H392"/>
    <g transform="rotate(12 384 440)">
      <path class="an-lamp" d="M318,412Q318,404 326,404H430L448,392V488L430,476H326Q318,476 318,468Z"/>
      <path class="an-lamp-win" d="M448,392V488"/>
      <rect class="an-tube" x="432" y="414" width="9" height="52" rx="4.5"/>
    </g>
    <path class="an-beam"${kk('beam')} d="M462,424L462,486L604,594L604,396Z" fill="url(#${p}-beam)" opacity="0"/>
    <g class="an-flask">
      <g clip-path="url(#${p}-liq)"><rect class="an-liquid" x="${fx - R}" y="${LIQ_Y}" width="${2 * R}" height="${R * 2}"/>
        <rect class="an-liquid-lit"${kk('lit')} x="${fx - R}" y="${LIQ_Y}" width="${2 * R}" height="${R * 2}" opacity="0"/>${cells}</g>
      <path class="an-glass" d="M${fx - 22},340V${f1(fy - Math.sqrt(R * R - 22 * 22))}A${R},${R} 0 1 0 ${fx + 22},${f1(fy - Math.sqrt(R * R - 22 * 22))}V340"/>
      <path class="an-lip" d="M${fx - 30},336H${fx + 30}"/>
      <path class="an-glint" d="M${fx - 62},${fy - 34}A72,72 0 0 0 ${fx - 70},${fy + 26}"/>
    </g>
    <ellipse class="an-cork" cx="${fx}" cy="598" rx="40" ry="7"/>
    <circle${kk('burst')} cx="470" cy="460" r="90" fill="url(#${p}-burst)" opacity="0"/>
    ${T(376, 656, 'flash lamp', 'an-lab', 'middle')}${T(fx, 656, 'algae', 'an-lab', 'middle')}</g>`;
}

/** The flash at intensity v (0–1), on the bench whose keys start with `k`. */
export function drawFlash(S: ReturnType<typeof setters>, k: string, v: number): void {
  S.op(S.q(`${k}-burst`), v);
  S.set(S.q(`${k}-burst`), 'r', f1(40 + 70 * v));
  S.op(S.q(`${k}-beam`), 0.9 * v);
  S.op(S.q(`${k}-lit`), 0.85 * v);
}
/** A flash fired at t0: up in 0.06 s, down over 0.5 s. */
export const flashAt = (t: number, t0: number): number => (t < t0 ? 0 : t < t0 + 0.06 ? (t - t0) / 0.06 : Math.max(0, 1 - (t - t0 - 0.06) / 0.5) ** 1.6);

/* ---------------------------------------------------------------- the counters and the field of 2,400 chlorophylls */

export const FIELD = { x: 1016, y: 300, cols: 60, rows: 40, d: 8.6, r: 2.7 };
/** The 8 reaction centres in the field (column, row). */
const SPOTS: V[] = [[7, 9], [22, 6], [37, 11], [52, 7], [8, 30], [23, 33], [38, 28], [52, 32]];
export const spotAt = (i: number): V => [FIELD.x + SPOTS[i][0] * FIELD.d, FIELD.y + SPOTS[i][1] * FIELD.d];
export const N_SPOTS = SPOTS.length;
const BANDS = 7;
/** Every dot of the field: position, its reaction centre and its distance band (0 next to the centre). */
export const DOTS: Array<{ p: V; spot: number; band: number; d: number }> = (() => {
  const out: Array<{ p: V; spot: number; band: number; d: number }> = [];
  for (let j = 0; j < FIELD.rows; j++) for (let i = 0; i < FIELD.cols; i++) {
    let best = 0, bd = 1e9;
    SPOTS.forEach((s, k) => { const d = Math.hypot(s[0] - i, s[1] - j); if (d < bd) { bd = d; best = k; } });
    out.push({ p: [FIELD.x + i * FIELD.d, FIELD.y + j * FIELD.d], spot: best, band: Math.min(BANDS - 1, Math.floor(bd / 1.9)), d: bd });
  }
  return out;
})();
const circ = (p: V, r: number): string => `M${f1(p[0] - r)},${f1(p[1])}a${r},${r} 0 1 0 ${f1(2 * r)},0a${r},${r} 0 1 0 ${f1(-2 * r)},0`;

/** The two counters (chlorophylls, O₂ released), drawn at (x, y), 526 wide. */
export function countersSvg(x: number, y: number): string {
  const box = (bx: number, lab: string, k: string): string => `<rect class="an-cbox" x="${bx}" y="${y}" width="248" height="128" rx="10"/>
    ${T(bx + 124, y + 40, lab, 'an-lab', 'middle')}${T(bx + 124, y + 106, '0', 'an-count', 'middle', k)}`;
  return `<g data-k="counters">${box(x, 'chlorophylls', 'n-chl')}${box(x + 278, 'O₂ released', 'n-o2')}</g>`;
}
/** Counter values at t (seconds since the flash): chlorophylls tick up to ~2,400, then one O₂. */
export function drawCounters(S: ReturnType<typeof setters>, tc: number, show: number): void {
  S.op(S.q('counters'), show);
  const n = Math.round(2400 * smooth((tc - 0.05) / 0.75) / 10) * 10;
  S.set(S.q('n-chl'), 'text', tc >= 0.8 ? '~2,400' : n.toLocaleString('en-US'));
  S.set(S.q('n-o2'), 'text', tc >= 0.95 ? '1' : '0');
  S.set(S.q('n-o2'), 'class', tc >= 0.95 ? 'an-count an-count-o2' : 'an-count');
}

/** The field: 2,400 chlorophyll dots, their amber glow by distance band, the 8 reaction centres and the key. */
export function fieldSvg(): string {
  const dots = DOTS.map(o => circ(o.p, FIELD.r)).join('');
  const glows = Array.from({ length: BANDS }, (_, b) => `<path class="an-fglow" data-k="fg${b}" d="${DOTS.filter(o => o.band === b).map(o => circ(o.p, FIELD.r + 1.3)).join('')}"/>`).join('');
  const spots = SPOTS.map((_, i) => { const c = spotAt(i); return `<circle class="an-spot-burst" data-k="spb${i}" cx="${f1(c[0])}" cy="${f1(c[1])}" r="8"/><circle class="an-spot" cx="${f1(c[0])}" cy="${f1(c[1])}" r="5.2"/>`; }).join('');
  const ky = FIELD.y + FIELD.rows * FIELD.d + 40;
  return `<g data-k="field"><path class="an-fdot" d="${dots}"/>${glows}${spots}</g>
    <g data-k="fkey1"><circle class="an-fdot" cx="${FIELD.x + 6}" cy="${ky - 8}" r="7"/>${T(FIELD.x + 22, ky, 'collect light', 'an-lab')}</g>
    <g data-k="fkey2"><circle class="an-spot" cx="${FIELD.x + 302}" cy="${ky - 8}" r="7"/>${T(FIELD.x + 318, ky, 'chemistry', 'an-lab')}</g>`;
}
/** The field at t seconds since its flash: all glow, then the glow drains band by band into the 8 centres, which
 *  flash. Returns when the centres flash (s after the flash). */
/** The drain: band by band from the outside in, DRAIN_DT apart, ≈ 1.5 s in all (lecturer, 27 Oct 2026: brisk motion,
 *  a click stop at each talking point); the 8 centres flash when the last band has drained (FIELD_SPOTS_T after the
 *  drain began). */
const DRAIN_DT = 0.18, DRAIN_FADE = 0.4;
export const FIELD_SPOTS_T = (BANDS - 1) * DRAIN_DT + DRAIN_FADE;
/** The field's glow at opacity `glow` (all dots lit by the flash), drained by td seconds since the drain began. */
export function drawField(S: ReturnType<typeof setters>, glow: number, td: number): void {
  for (let b = 0; b < BANDS; b++) {
    const off = (BANDS - 1 - b) * DRAIN_DT;
    S.op(S.q(`fg${b}`), glow * (1 - tw(td, off, off + DRAIN_FADE)));
  }
  const ts = td - FIELD_SPOTS_T;
  for (let i = 0; i < N_SPOTS; i++) {
    const el = S.q(`spb${i}`), v = ts < 0 ? 0 : ts < 0.12 ? ts / 0.12 : Math.max(0.45, 1 - (ts - 0.12) / 0.45);
    S.op(el, v); S.set(el, 'r', f1(6 + 16 * clamp01(ts / 0.4) - 6 * tw(ts, 0.4, 0.8)));
  }
}

/* ---------------------------------------------------------------- the structure: PSII–LHCII, PDB 5XNL */

export type Tier = 'rc' | 'core' | 'minor' | 'lhcii';
export const TIERS: Tier[] = ['rc', 'core', 'minor', 'lhcii'];
const BOX: Record<'base' | Tier, [number, number, number, number]> = {
  base: [173, 89, 1254, 821], lhcii: [274, 194, 1153, 318], minor: [454, 89, 710, 428], core: [570, 193, 428, 337], rc: [602, 233, 342, 231],
};
const HREF = {
  a: { base: aBase, rc: aRc, core: aCore, minor: aMinor, lhcii: aLhcii },
  b: { base: bBase, rc: bRc, core: bCore, minor: bMinor, lhcii: bLhcii },
};
export const N_CHL = CHL.length / 5;
export const pigAt = (i: number): V => [CHL[5 * i], CHL[5 * i + 1]];
export const PATH_PTS: V[] = PATH.map(pigAt);
/** The special pair P680, between PD1 and PD2. */
export const P680: V = [783.3, 358.0];
/** The lit monomer's chlorophylls and pheophytins (indices into CHL). */
export const UP_PIGS: number[] = Array.from({ length: N_CHL }, (_, i) => i).filter(i => CHL[5 * i + 4] === 1);
const PIG_R = 13;
/** The complexes of each tier (codes of CHL and CAR). */
const TIER_G: Record<Tier, number[]> = { lhcii: [0, 1], minor: [2], core: [3], rc: [4] };

/** The views of the structure: the whole supercomplex, and the hop path. */
export const REST: Tf = { s: 0.64, t: [800 - 0.64 * 800, 400 - 0.64 * 500] };
export const ZOOM: Tf = { s: 1.22, t: [800 - 1.22 * 1000, 330 - 1.22 * 380] };
/** The view beats 2 and 3 end on (no camera move in beat 3): the lit monomer, its reaction centre and whole antenna,
 *  at 1 render px per stage px, with the other monomer dimmed below. */
export const VIEW: Tf = { s: 1, t: [-50, -40] };

/** The structure scene, in render px (the 1600 × 1000 frame of the 5XNL layers). Look 'b' uses the halftone layers
 *  printed on a newsprint sheet. */
export function structureSvg(p: string, look: 'a' | 'b'): string {
  const img = (n: 'base' | Tier, k: string): string => { const [x, y, w, h] = BOX[n]; return `<image data-k="${k}" href="${HREF[look][n]}" x="${x}" y="${y}" width="${w}" height="${h}"/>`; };
  const inSet = (up: number, g: number[]) => (i: number): boolean => CHL[5 * i + 4] === up && g.includes(CHL[5 * i + 3]);
  const pigs = (sel: (i: number) => boolean, t: number): string => Array.from({ length: N_CHL }, (_, i) => i).filter(i => sel(i) && CHL[5 * i + 2] === t).map(i => circ(pigAt(i), PIG_R)).join('');
  const cars = (up: number, g: number[]): string => { let d = ''; for (let i = 0; i < CAR.length; i += 6) if (CAR[i + 5] === up && g.includes(CAR[i + 4])) d += `M${CAR[i]},${CAR[i + 1]}L${CAR[i + 2]},${CAR[i + 3]}`; return d; };
  const group = (k: string, up: number, g: number[]): string => { const sel = inSet(up, g); return `<g data-k="${k}"><path class="an-car" d="${cars(up, g)}"/><path class="an-chla" d="${pigs(sel, 0)}"/><path class="an-chlb" d="${pigs(sel, 1)}"/><path class="an-pheo" d="${pigs(sel, 2)}"/></g>`; };
  const half = (up: number): string => (up ? TIERS.map(n => group(`pig1-${n}`, 1, TIER_G[n])).join('') : group('pig0', 0, [0, 1, 2, 3, 4]));
  const onPath = PATH.map((i, k) => `<path data-k="pp${k}" class="${['an-chla', 'an-chlb', 'an-pheo'][CHL[5 * i + 2]]}" d="${circ(pigAt(i), PIG_R)}"/>`).join('');
  return `<defs>
      <radialGradient id="${p}-glow"><stop offset="0" stop-color="#ffd27a" stop-opacity="1"/><stop offset=".4" stop-color="#f0a316" stop-opacity=".7"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".3" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <linearGradient id="${p}-veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${look === 'b' ? '#f1ece0' : '#fcfbf8'}" stop-opacity="0"/><stop offset=".18" stop-color="${look === 'b' ? '#f1ece0' : '#fcfbf8'}" stop-opacity=".6"/></linearGradient>
      ${look === 'b' ? `<filter id="${p}-sheetsh" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="2" dy="5" stdDeviation="7" flood-color="#3d3020" flood-opacity=".2"/></filter>` : ''}
    </defs>
    <g data-k="st" class="an-st">
      ${look === 'b' ? `<path class="an-sheet" data-k="sheet" d="${cutPath(110, 40, 1380, 920, 57, 6)}" filter="url(#${p}-sheetsh)"/>` : ''}
      ${img('base', 'st-base')}${TIERS.map(n => img(n, `lit-${n}`)).join('')}
      ${half(0)}<rect data-k="veil" x="100" y="492" width="1400" height="480" fill="url(#${p}-veil)"/>${half(1)}<g data-k="pathpigs">${onPath}</g>
      <circle class="an-rcring" data-k="rcring" cx="${P680[0]}" cy="${P680[1]}" r="52"/>
      <circle data-k="rcglow" cx="${P680[0]}" cy="${P680[1]}" r="46" fill="url(#${p}-rcglow)"/>
      <path class="an-trail" data-k="trail"/>
      <circle data-k="hopglow" r="38" fill="url(#${p}-glow)"/>
      <circle class="an-hopcore" data-k="hopcore" r="8"/>
      <circle class="an-burst" data-k="burst" cx="${P680[0]}" cy="${P680[1]}" r="40"/>
    </g>`;
}

/* ---------------------------------------------------------------- labels of the structure (stage space) */

interface Lab { k: string; text: string; anchor: V; rest: V; zoom: V; a: 'start' | 'middle' | 'end' }
/** Each label: its text, the point of the structure it names (render px), and where its text sits in the two views. */
export const LABS: Lab[] = [
  { k: 'rc', text: 'reaction centre', anchor: P680, rest: [800, 74], zoom: [800, 74], a: 'middle' },
  { k: 'core', text: 'core antenna', anchor: [913, 436], rest: [980, 612], zoom: [980, 612], a: 'middle' },
  { k: 'lhcii', text: 'LHCII', anchor: [1286, 356], rest: [1400, 236], zoom: [1400, 236], a: 'start' },
];
export function labelsSvg(): string {
  return LABS.map(L => `<g data-k="lab-${L.k}"><path class="an-lead-halo" data-k="leadh-${L.k}"/><path class="an-lead" data-k="lead-${L.k}"/><circle class="an-lead-dot" data-k="leadd-${L.k}" r="4"/>${T(0, 0, L.text, `an-lab an-lab-${L.k}`, L.a, `labt-${L.k}`)}</g>`).join('')
    + `<g data-k="lab-psii">${T(800, 716, 'photosystem II (PSII)', 'an-lab an-lab-psii', 'middle')}</g>`;
}
/** The opacity of every pigment group: the lower monomer, each tier of the lit one, and the path's pigments on top. */
export function drawPigments(S: ReturnType<typeof setters>, lower: number, tier: Record<Tier, number>, path: number, x = -1): void {
  S.op(S.q('pig0'), lower);
  TIERS.forEach(n => S.op(S.q(`pig1-${n}`), tier[n]));
  S.op(S.q('pathpigs'), path);
  // A path pigment comes forward once the excitation has reached it.
  PATH.forEach((_, k) => S.op(S.q(`pp${k}`), x >= k - 0.5 ? 1 : 0));
}
/** Places label k for view v (zoom progress z between the rest and the zoomed text spot) at opacity o. */
export function drawLabel(S: ReturnType<typeof setters>, k: string, v: Tf, z: number, o: number): void {
  const L = LABS.find(x => x.k === k) as Lab, g = S.q(`lab-${k}`);
  S.op(g, o);
  if (o < 0.004) return;
  const tp = lerpV(L.rest, L.zoom, z), an = onStage(v, L.anchor);
  S.set(S.q(`labt-${k}`), 'x', f1(tp[0])); S.set(S.q(`labt-${k}`), 'y', f1(tp[1]));
  const above = an[1] < tp[1] - 40; // the named thing sits above the text: the leader leaves from the text's top
  const from: V = [tp[0] + (L.a === 'start' ? -8 : 0), tp[1] + (L.a === 'start' ? -8 : above ? -30 : 12)];
  const d = [an[0] - from[0], an[1] - from[1]], len = Math.hypot(d[0], d[1]), stop = Math.max(0, len - 4);
  const path = len < 30 ? '' : `M${f1(from[0])},${f1(from[1])}L${f1(from[0] + (d[0] / len) * stop)},${f1(from[1] + (d[1] / len) * stop)}`;
  S.set(S.q(`lead-${k}`), 'd', path); S.set(S.q(`leadh-${k}`), 'd', path);
  S.set(S.q(`leadd-${k}`), 'cx', f1(an[0])); S.set(S.q(`leadd-${k}`), 'cy', f1(an[1]));
}

/** The key of the pigment symbols, bottom left. */
export function keySvg(x: number, y: number): string {
  return `<g data-k="key"><rect class="an-keybg" x="${x - 14}" y="${y - 32}" width="508" height="46" rx="8"/>
    <circle class="an-chla" cx="${x + 8}" cy="${y - 8}" r="9"/>${T(x + 26, y, CHL_A, 'an-lab')}
    <circle class="an-chlb" cx="${x + 140}" cy="${y - 8}" r="9"/>${T(x + 158, y, CHL_B, 'an-lab')}
    <path class="an-car an-car-key" d="M${x + 266},${y - 2}L${x + 292},${y - 15}"/>${T(x + 304, y, 'carotenoid', 'an-lab')}</g>`;
}

/* ---------------------------------------------------------------- the hop path and the energy staircase */

/** When hop k (0–18) starts, relative to the first hop, and how long each lasts. */
export const HOP_DT = 0.13, HOP_LEN = 0.1, N_HOPS = PATH.length - 1; // the 19 hops in ≈ 2.5 s
export const HOPS_END = N_HOPS * HOP_DT;
/** Path progress (pigment index, fractional) h seconds after the hops began. */
export function hopPos(h: number): number {
  if (h <= 0) return 0;
  const k = Math.min(N_HOPS - 1, Math.floor(h / HOP_DT)), u = clamp01((h - k * HOP_DT) / HOP_LEN);
  return h >= HOPS_END ? N_HOPS : k + smooth(u);
}
const pathAt = (x: number): V => { const k = Math.min(N_HOPS - 1, Math.floor(x)); return lerpV(PATH_PTS[k], PATH_PTS[k + 1], x - k); };
/** The trail, the moving glow and the reaction centre's trap at path progress x and trap progress r (0–1). */
export function drawHop(S: ReturnType<typeof setters>, x: number, on: number, trap: number): void {
  const pts = PATH_PTS.slice(0, Math.floor(x) + 1).concat(x % 1 > 0 ? [pathAt(x)] : []);
  S.set(S.q('trail'), 'd', on > 0 && pts.length > 1 ? `M${pts.map(p => `${f1(p[0])},${f1(p[1])}`).join('L')}` : '');
  S.op(S.q('trail'), on);
  const c = x >= N_HOPS ? PATH_PTS[N_HOPS] : pathAt(x);
  const glowOn = on * (1 - tw(trap, 0, 0.3));
  ['hopglow', 'hopcore'].forEach(k => { const el = S.q(k); S.set(el, 'cx', f1(c[0])); S.set(el, 'cy', f1(c[1])); S.op(el, glowOn); });
  const b = S.q('burst');
  S.op(b, trap > 0 && trap < 1 ? 1 - trap : 0); S.set(b, 'r', f1(30 + 150 * easeOut(trap)));
  S.op(S.q('rcglow'), trap > 0 ? 0.55 + 0.45 * tw(trap, 0, 0.25) : 0);
}

/** The energy staircase, to scale (see the header): x per pigment along the path, y per level. */
const ST = { x: 1172, y: 474, w: 368, h: 228 };
const EV = (nm: number): number => 1239.84 / nm;
const LV = { b: EV(650), a: EV(678), rc: EV(680) };
const yOf = (e: number): number => ST.y + 64 + (LV.b - e) * (88 / (LV.b - LV.a));
const STEP_X = (i: number): number => ST.x + 96 + (i / N_HOPS) * (ST.w - 132);
const levelOf = (i: number): number => (i >= 17 ? LV.rc : PATH.map(j => CHL[5 * j + 2])[i] === 1 ? LV.b : LV.a);
export function stairSvg(): string {
  let d = '', prev = levelOf(0);
  for (let i = 0; i <= N_HOPS; i++) {
    const L = levelOf(i), x0 = STEP_X(i) - (i ? (STEP_X(1) - STEP_X(0)) / 2 : 14), x1 = STEP_X(i) + (i < N_HOPS ? (STEP_X(1) - STEP_X(0)) / 2 : 14);
    d += i === 0 ? `M${f1(x0)},${f1(yOf(L))}H${f1(x1)}` : `${L !== prev ? `V${f1(yOf(L))}` : ''}H${f1(x1)}`;
    prev = L;
  }
  const ax = ST.x + 52;
  return `<g data-k="stair"><path class="an-card" d="${cutPath(ST.x, ST.y, ST.w, ST.h, 71, 2.4)}"/>
    <path class="an-axis" d="M${ax},${ST.y + ST.h - 22}V${ST.y + 22}"/><path class="an-axhead" d="M${ax - 7},${ST.y + 34}L${ax},${ST.y + 20}L${ax + 7},${ST.y + 34}"/>
    <text class="an-ax" transform="translate(${ax - 14} ${ST.y + ST.h / 2 + 6}) rotate(-90)" text-anchor="middle">energy</text>
    <path class="an-rung" d="${d}"/>
    ${T(STEP_X(0) - 14, yOf(LV.b) - 14, CHL_B, 'an-lab an-lab-b')}
    ${T(STEP_X(3) + 6, yOf(LV.a) - 14, CHL_A, 'an-lab an-lab-a')}
    ${T(ST.x + ST.w - 18, yOf(LV.rc) + 40, 'reaction centre', 'an-lab an-lab-rcs', 'end')}
    <circle data-k="sdotglow" r="18" fill="url(#an-sglow)"/><circle class="an-hopcore" data-k="sdot" r="7.5"/>
    <defs><radialGradient id="an-sglow"><stop offset="0" stop-color="#ffd27a"/><stop offset=".45" stop-color="#f0a316" stop-opacity=".6"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient></defs></g>`;
}
/** The staircase's dot at path progress x (shown with opacity on). */
export function drawStair(S: ReturnType<typeof setters>, x: number, on: number, trap: number): void {
  const k = Math.min(N_HOPS - 1, Math.floor(x)), u = x - k;
  const px = lerp(STEP_X(k), STEP_X(k + 1), x >= N_HOPS ? 1 : u);
  const L0 = levelOf(k), L1 = levelOf(Math.min(N_HOPS, k + 1));
  const py = x >= N_HOPS ? yOf(LV.rc) : lerp(yOf(L0), yOf(L1), smooth((u - 0.3) / 0.5));
  ['sdot', 'sdotglow'].forEach(kk => { const el = S.q(kk); S.set(el, 'cx', f1(px)); S.set(el, 'cy', f1(py)); S.op(el, on); });
  S.set(S.q('sdotglow'), 'r', f1(18 + 14 * (trap > 0 && trap < 1 ? 1 - trap : 0)));
}

/* ---------------------------------------------------------------- a photon */

/** A photon as a wave packet in its colour (slide 4's look): wavelength in proportion, bell-shaped envelope, travelling
 *  along the direction `ang` (degrees). */
export function packet(cx: number, cy: number, nm: number, ang: number, len0 = 90, amp = 13): string {
  const lam = nm * 0.032, n = 90, pts: string[] = [], c = Math.cos((ang * Math.PI) / 180), s = Math.sin((ang * Math.PI) / 180);
  for (let i = 0; i <= n; i++) {
    const u = (i / n - 0.5) * len0 * 0.8, env = Math.exp(-((u / (len0 * 0.28)) ** 2)), w = Math.sin((2 * Math.PI * u) / lam) * amp * env;
    pts.push(`${i ? 'L' : 'M'}${f1(cx + u * c - w * s)},${f1(cy + u * s + w * c)}`);
  }
  return pts.join('');
}
