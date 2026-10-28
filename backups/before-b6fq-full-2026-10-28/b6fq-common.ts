// Cytochrome b₆f tells the Q cycle, on the slide 8 figure in the 7m1 glyph style (lecturer, 28 Oct 2026: "plastocyanin
// carries only one electron forward, what about the other? and why do more protons appear at the end?"). The parts both
// stagings (b6f-qa, b6f-qb) share. Reworked from b6fm-common.ts (stagings m1, m2), whose figure handling it copies.
// The stage IS the slide 8 figure, variant 8m1: focusSvg() of figs/chain.ts with LIT_B6F in the 'bil' look and glyph mode
// (atom balls, ringed H⁺, tags), drawn in the slide's figure card. The camera zooms into b₆f, the story plays, the camera
// zooms back out to the whole chain.
// - Beat 1 (four clicks). Zoom in; leaders name "cytochrome b₆f" and "plastoquinol (PQH₂)", which carries 2 e⁻ and
//   2 ringed H⁺. [click] The leader "Qₒ site, lumen side"; plastoquinol glides there and binds; its 2 H⁺ drop into the
//   lumen. [click] The leader "plastocyanin, a small copper protein"; electron 1 runs through the iron–sulfur centre and
//   cytochrome f to it. [click] The leader "Qᵢ site, stroma side" names the plastoquinone waiting there; electron 2 runs
//   back across b₆f through its b hemes to it (half-loaded: 1 e⁻). The emptied molecule is plastoquinone (PQ) again.
//   The ledger (fixed on the screen) ticks: 4 H⁺ from water (beat 1 start), then 2 H⁺ × 1 plastoquinol at b₆f.
// - Beat 2. Photosystem I is named; plastocyanin carries its electron through the lumen and docks under PSI (PC_DOCK of
//   b6fm-common.ts, where the PSI animation starts). It stays there to the end.
// - Beat 3 (four clicks). The empty PQ leaves the Qₒ site; a second plastocyanin arrives at cytochrome f; a second
//   plastoquinol arrives and binds. [click] Its 2 H⁺ drop into the lumen; electron 1 to the second plastocyanin, which
//   moves off toward PSI and stops short of the docked one. [click] Electron 2 to the Qᵢ plastoquinone: now 2 e⁻.
//   [click] 2 ringed H⁺ come down from the stroma onto it; it becomes plastoquinol (PQH₂) and leaves into the membrane.
// - Beat 4. Zoom out; the result line on the figure; b₆f's H⁺ arrow comes back; photosystem I starts to light. Every
//   carrier stays where the story left it.
// A ledger panel (fixed on the screen, right margin) counts H⁺ per O₂, i.e. per 4 e⁻ to plastocyanin: 4 from water at
// PSII (the 4 water H⁺ of the slide glow at the start), 2 × 4 plastoquinol at b₆f's Qₒ = 8 (the story shows 2 of the 4), total
// 12; and the 4 + 4 taken from the stroma (lecturer, 28 Oct 2026: show the whole count, not "2 + 4 = 6").
// Motion is smooth (lecturer: no zigzag): eased glides along gently curved paths; the pool drifts slowly (≤ 2 units).
// Stagings: qa — no pool: the molecules glide in from PSII's side and settle in the membrane; qb — a pool of lettered
// PQ/PQH₂ drifts in the membrane between PSII and b₆f the whole time (wall clock, so it drifts in the holds too); the
// plastoquinol that bind come from it and the molecules that leave rejoin it.
import './b6fq-common.css';
import { carrierBox, carrierImg, focusSvg, GEO, hring, LIT_B6F, type Part } from '../figs/chain';
import { clamp01, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import { PC_DOCK } from './b6fm-common';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- the slide figure (8m1), tagged by part (as b6fm) */

const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];

interface Wrap { a: number; b: number; inner: string; on: boolean }
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
const draw8 = (id: string, lit: Part[]): string => strip(focusSvg(id, { look: 'bil', lit, g: { mol: true }, say: '' }));
function partsOf(): Array<Part | null> {
  const base = wraps(draw8('p8qprobe', LIT_B6F)), out: Array<Part | null> = base.map(() => null);
  for (const p of PARTS) {
    const alt = wraps(draw8('p8qprobe', LIT_B6F.includes(p) ? LIT_B6F.filter(x => x !== p) : [...LIT_B6F, p]));
    if (alt.length === base.length) alt.forEach((w, i) => { if (w.on !== base[i].on) out[i] = p; });
  }
  base.forEach((w, i) => { if (out[i] === null && w.on && /class="chn-hr"[^>]*r="9\.5"/.test(w.inner)) out[i] = 'pq-h-load'; });
  return out;
}
const NUM = '(-?[\\d.]+)';
const circlesOf = (s: string, cls: string): V[] =>
  [...s.matchAll(new RegExp(`<circle class="${cls}" cx="${NUM}" cy="${NUM}"`, 'g'))].map(m => [Number(m[1]), Number(m[2])]);

interface Scene { svg: string; pqH: V[]; hOut: V[]; hWater: V[] }
function scene(id: string): Scene {
  const base = draw8(id, LIT_B6F), lit = draw8(id, [...LIT_B6F, 'psi']);
  const parts = partsOf(), wb = wraps(base), wl = wraps(lit);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    const im = p === 'b6f' ? /<image [^>]*\/>/.exec(w.inner) : null;
    const halo = im ? im[0].replace(/ filter="[^"]*"/, '').replace('<image', `<image data-k="b6fhalo" opacity="0" filter="url(#${id}-glow)"`) : '';
    svg += `${base.slice(at, w.a)}${halo}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'psi' && wl[i]) svg += `<g class="chn-on" data-p="psi-lit" opacity="0">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);
  const { pq } = GEO;
  const pqH = circlesOf(inner('pq-h-load'), 'chn-hr'), hOut = circlesOf(inner('pq-h-out'), 'chn-hr');
  const hWater = circlesOf(inner('water'), 'chn-hr');
  return {
    svg,
    pqH: pqH.length === 2 ? pqH : [[pq[0] - 11, pq[1] - 19], [pq[0] + 11, pq[1] - 19]],
    hOut: hOut.length === 2 ? hOut : [[285.3, 388.4], [313.8, 403.6]],
    hWater,
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card fills the stage (as b6fm). */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** The zoom-out of beat 4: the same scale, the card moved to the left edge, so that the ledger keeps the right side. */
const B_OUT: Tf = { s: 1.07, t: [12 + 1.07 * 43.3, 370 - 1.07 * 300] };
export interface View { s: number; c: V }
const tf = (v: View): Tf => ({ s: v.s, t: [800 - v.s * v.c[0], 370 - v.s * v.c[1]] });
/** The figure point that a close view shows at stage point (X, Y): labels are placed by where they show on the screen. */
export const atStage = (v: View, X: number, Y: number): V => [v.c[0] + (X - 800) / v.s, v.c[1] + (Y - 370) / v.s];
const kOf = (s: number): number => (s / B.s) ** -0.7;
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- where things are (figure units) */

const { hem, cytf } = GEO;
/** The Qₒ site, toward the lumen side of the membrane (as b6fm's DOCK); the Qᵢ site, toward the stroma side. */
export const QO: V = [hem[0] - 26, hem[1] + 7];
export const QI: V = [hem[0] + 22, hem[1] - 13];
/** Electron places on a plastoquinone, relative to its centre: right (goes on to plastocyanin), left (goes to Qᵢ). */
const ON_R: V = [12.5, 0.5], ON_L: V = [-12.5, 0.5];
/** H⁺ places on top of a plastoquinone (as chain.ts's pq-h-load, a little higher on the larger lettered shape). */
const H_ON: V[] = [[-11, -22], [11, -22]];
const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
/** The second plastocyanin: drifts up from the lower lumen to cytochrome f, and later stops short of the docked one. */
const PC2_FROM: V = [372, 450];
export const PC2_END: V = [424, 406];

/* ---------------------------------------------------------------- paths */

/** A smooth path through points (Catmull-Rom), walked at even speed: u ∈ [0, 1] (as b6fm). */
export function walker(q: V[]): (u: number) => V {
  const pts: V[] = [q[0]];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    const c1: V = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2: V = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 1; j <= 40; j++) {
      const u = j / 40, v = 1 - u;
      pts.push([v ** 3 * p1[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u ** 3 * p2[0], v ** 3 * p1[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u ** 3 * p2[1]]);
    }
  }
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = acc[acc.length - 1];
  return u => {
    const d = clamp01(u) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    const e = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
    return lerpV(pts[i - 1], pts[i], e);
  };
}
/** A smooth move along gently curved waypoints, eased in and out (lecturer: no zigzag). */
export interface Walk { at: (u: number) => V }
function glide(q: V[]): Walk {
  const path = walker(q);
  return { at: u => path(smoother(u)) };
}
/** The pool's slow drift in place (qb): sine sways of at most 1.8 by 1.3 units, periods 2.4 s and 1.9 s. */
const jig = (clock: number, seed: number): V =>
  [1.8 * Math.sin((2 * Math.PI * clock) / 2.4 + seed * 1.7), 1.3 * Math.sin((2 * Math.PI * clock) / 1.9 + seed * 2.9)];

/** Electron routes: on to plastocyanin through the iron–sulfur centre (lumen side of b₆f) and cytochrome f; back across
 *  b₆f through its two b hemes to the Qᵢ plastoquinone (first to its left place, the second under it to its right). */
const FES: V = [hem[0] - 10, hem[1] + 25];
/** Where plastocyanin docks at b₆f: under cytochrome f, on the lumen side. */
export const PC_B6F: V = [cytf[0] + 5, cytf[1] + 35];
/** Plastocyanin is drawn as its protein render (chain.ts carrierImg); its electron sits at its copper centre. */
const PC_CU: V = carrierBox('pc').spot;
const TO_PC = walker([add(QO, ON_R), FES, [cytf[0] - 6, cytf[1] - 8], [cytf[0] + 2, cytf[1] + 12], add(PC_B6F, PC_CU)]);
const B_HEMES: V[] = [[hem[0] - 8, hem[1] - 3], [hem[0] + 1, hem[1] - 8]];
const TO_QI1 = walker([add(QO, ON_L), [QO[0] - 2, QO[1] - 12], [QO[0] + 14, QO[1] - 11], B_HEMES[0], B_HEMES[1], add(QI, ON_L)]);
const TO_QI2 = walker([add(QO, ON_L), [QO[0] - 2, QO[1] - 12], [QO[0] + 14, QO[1] - 11], B_HEMES[0], B_HEMES[1], [QI[0], QI[1] + 11], add(QI, ON_R)]);
/** Plastocyanin glides through the lumen on gentle curves: plastocyanin 1 from the slide's place to b₆f, then to
 *  photosystem I; plastocyanin 2 up from the lower lumen to b₆f, then toward PSI, stopping short. */
const PC1_IN = glide([GEO.pc, [394, 392], PC_B6F]);
const PC1_OUT = glide([PC_B6F, [432, 386], PC_DOCK]);
const PC2_IN = glide([PC2_FROM, [380, 418], PC_B6F]);
const PC2_OUT = glide([PC_B6F, [398, 402], PC2_END]);
/** The 2 H⁺ of the second plastoquinol land beside the first two (the slide's), in the lumen under b₆f, ≥ 28.7 units from
 *  every other ring, so that the 4 never touch, even at the zoom-out (ring radius 12). */
const H_MORE: V[] = [[276, 418], [330, 428]];
/** The 2 H⁺ that come down from the stroma onto the Qᵢ plastoquinone. */
const H_STROMA: V[] = [[QI[0] - 16, 232], [QI[0] + 18, 224]];

/* ---------------------------------------------------------------- timing (s into each beat) */

const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
const lin = (t: number, t0: number, d: number): number => clamp01((t - t0) / d);
const glow = (t: number, t0: number): number => tw(t, t0, t0 + 0.3) * (1 - tw(t, t0 + 1.0, t0 + 1.4));
const swOut = (t: number, t0: number): number => 1 - tw(t, t0, t0 + 0.15);
const swIn = (t: number, t0: number): number => tw(t, t0 + 0.15, t0 + 0.35);
const fadeIn = (t: number, t0: number, d = 0.25): number => tw(t, t0, t0 + d);
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};

// Beat 1: zoom; water H⁺ glow; b₆f named; PQH₂ named | Qₒ named, it glides there, H⁺ drop | PC named, e⁻ 1 to PC | Qᵢ named, e⁻ 2 to Qᵢ.
const B1 = {
  zoom: 0.05, zoomD: 1.1, flowsOut: [0.05, 0.4], swap: 0.4, qiIn: 0.55, water: 0.75, zl: 0.95, b6f: 1.25, pq: 2.2, h1: 3.4,
  qo: 3.5, go: 4.0, goD: 1.7, hand: 5.85, hD: 0.9, h2: 6.9,
  pc: 7.0, pcGo: 7.45, pcGoD: 1.4, r1: 8.75, e1: 8.95, e1D: 1.0, h3: 10.2,
  qi: 10.3, r2: 10.9, e2: 11.15, e2D: 0.9, relabel: 12.15, end: 12.65,
};
// Beat 2: PSI named; plastocyanin to PSI.
const B2 = { psi: 0.1, short: 0.6, go: 0.8, goD: 2.0, end: 3.1 };
// Beat 3: A leaves, PC2 comes, C named and binds | H⁺ drop, e⁻ to PC2, PC2 moves | e⁻ to Qᵢ | H⁺ from stroma, PQH₂ leaves.
const B3 = {
  psiOut: 0.0, aGo: 0.2, aGoD: 1.5, pc2: 0.2, pc2D: 1.9, cName: 1.6, cGo: 1.9, cGoD: 1.5, h1: 3.55,
  hand: 3.65, hD: 0.9, e1: 4.6, e1D: 1.0, pc2Go: 5.85, pc2GoD: 1.6, h2: 7.6,
  e2: 7.75, e2D: 0.9, relabel: 8.75, h3: 9.1,
  hs: 9.2, hsD: 1.0, form: 10.6, merge: 10.85, bGo: 11.3, bGoD: 1.6, end: 13.1,
};
// Beat 4: zoom out; result line; b₆f's H⁺ arrow back; photosystem I starts to light.
const B4 = { out: 0.05, outD: 1.2, labs: 0.1, hOut: 1.05, note: 0.5, all: 1.3, total: 1.9, result: 2.3, psi: 2.3, end: 3.3 };
const PSI_END = 0.6;

/* ---------------------------------------------------------------- overlay */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
const lab = (s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="0" y="0" text-anchor="${a}">${s}</text>`;
const B6F_NAME = 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>';
const sub = (s: string): string => `<tspan class="b6fq-sub" dy="5">${s}</tspan><tspan dy="-5">`;
const QO_NAME = `Q${sub('o')} site, lumen side</tspan>`;
const QI_NAME = `Q${sub('i')} site, stroma side</tspan>`;
const leader = (k: string): string =>
  `<g class="b6fq-lead" data-k="ld-${k}" opacity="0"><path class="chn-ldh" data-k="ld-${k}-h" d="M0,0"/><path class="chn-ld" data-k="ld-${k}-l" d="M0,0"/><circle class="chn-ldt" data-k="ld-${k}-t" r="3.2"/></g>`;
/** Label texts, by key: [text, class, width at the slide's size (places the leaders' starts)]. */
const TEXTS: Record<string, [string, string, number]> = {
  'lt-b6f': [B6F_NAME, 'chn-name chn-halo', 150],
  'lt-psi': ['photosystem I', 'chn-name chn-halo', 140],
  'lt-qo': [QO_NAME, 'chn-in chn-halo', 196],
  'lt-qi': [QI_NAME, 'chn-in chn-halo', 200],
  'lt-pool': ['plastoquinone pool', 'chn-in chn-halo', 180],
  'lt-A-h': ['plastoquinol (PQH₂)', 'chn-in chn-halo', 196], 'lt-A-q': ['plastoquinone (PQ)', 'chn-in chn-halo', 186],
  'lt-C-h': ['plastoquinol (PQH₂)', 'chn-in chn-halo', 196], 'lt-C-q': ['plastoquinone (PQ)', 'chn-in chn-halo', 186],
  'lt-B-q': ['plastoquinone (PQ)', 'chn-in chn-halo', 186], 'lt-B-h': ['plastoquinol (PQH₂)', 'chn-in chn-halo', 196],
  'lt-pc1-l': ['plastocyanin, a small copper protein', 'chn-in chn-halo', 352], 'lt-pc1-s': ['plastocyanin', 'chn-in chn-halo', 122],
  'lt-pc2-s': ['plastocyanin', 'chn-in chn-halo', 122],
};
const ROUTE1 = '<tspan x="0" dy="0">via the iron–sulfur centre</tspan><tspan x="0" dy="1.2em">and cytochrome <tspan class="chn-it">f</tspan></tspan>';
const ROUTE2 = 'via the <tspan class="chn-it">b</tspan> hemes';
/** The molecules: A the first plastoquinol, B the plastoquinone at the Qᵢ site, C the second plastoquinol; qb adds D, E. */
const MOLS = ['A', 'B', 'C', 'D', 'E'] as const;
type Mol = typeof MOLS[number];

/** The ledger: rows of text runs and ringed H⁺ ('H'), laid out at bind (measured), stacked at draw time from the rows on
 *  show (so the panel grows as rows fill). The b₆f value has three versions in one slot (× 1, × 2, × 4 plastoquinol). */
type Run = string | 'H';
const LEDGER_W = 440, LEDGER_PAD = 12;
const SUBO = 'Q<tspan class="b6fq-sub" dy="4">o</tspan><tspan dy="-4">', SUBI = 'Q<tspan class="b6fq-sub" dy="4">i</tspan><tspan dy="-4">';
const LEDGER: Array<{ k: string; h: number; cls: string; runs: Run[] }> = [
  { k: 'head', h: 32, cls: 'b6fq-lgh', runs: ['per O₂ (4 e⁻ to plastocyanin):'] },
  { k: 'water', h: 31, cls: 'b6fq-lg', runs: ['from water at photosystem II: 4', 'H'] },
  { k: 'b6f', h: 29, cls: 'b6fq-lg', runs: [`released by plastoquinol at b₆f (${SUBO}):</tspan>`] },
  { k: 'b6f1', h: 31, cls: 'b6fq-lg', runs: ['2', 'H', '× 1 plastoquinol = 2', 'H'] },
  { k: 'b6f2', h: 31, cls: 'b6fq-lg', runs: ['2', 'H', '× 2 plastoquinol = 4', 'H'] },
  { k: 'b6f4', h: 31, cls: 'b6fq-lg', runs: ['2', 'H', '× 4 plastoquinol = 8', 'H'] },
  { k: 'note1', h: 23, cls: 'b6fq-lgn', runs: ['(shown: 2 of the 4 plastoquinols;'] },
  { k: 'note2', h: 25, cls: 'b6fq-lgn', runs: ['the other 2 do the same)'] },
  { k: 'total', h: 34, cls: 'b6fq-lgt', runs: ['total into the lumen: 12', 'H'] },
  { k: 'stroma1', h: 25, cls: 'b6fq-lgn', runs: ['taken from the stroma: 4 at photosystem II'] },
  { k: 'stroma2', h: 23, cls: 'b6fq-lgn', runs: [`+ 4 at b₆f (${SUBI})</tspan>`] },
];
function ledgerSvg(at: V): string {
  return `<g class="fig" data-k="ledger" opacity="0" transform="translate(${at[0]} ${at[1]})">
    <rect class="b6fq-panel" data-k="lg-panel" x="0" y="0" width="${LEDGER_W}" height="40" rx="14"/>
    ${LEDGER.map(r => `<g data-k="lg-${r.k}" data-lg="1" opacity="0">${r.runs.map(u => (u === 'H'
    ? `<g data-run="h">${hring(0, 0, 11.5)}</g>` : `<text class="${r.cls}" data-run="t" x="0" y="0">${u}</text>`)).join('')}</g>`).join('')}
  </g>`;
}

function overlaySvg(P: string, mols: readonly Mol[]): string {
  const pqG = (m: Mol): string => glyph(`m${m}`, `<ellipse class="chn-body chn-pq b6fq-pq"  rx="18" ry="9.5"/><text class="chn-lt" data-k="m${m}-q" x="0" y="5" text-anchor="middle">PQ</text><text class="chn-lt" data-k="m${m}-h" x="0" y="5" text-anchor="middle">PQH₂</text>`);
  return `<defs><radialGradient id="${P}-pool"><stop offset="0" class="b6fq-pool0"/><stop offset=".55" class="b6fq-pool1"/><stop offset="1" class="b6fq-pool2"/></radialGradient></defs>
    ${mols.map(m => glyph(`g${m}`, `<ellipse rx="44" ry="34" fill="url(#${P}-pool)"/>`)).join('')}
    ${[0, 1, 2, 3].map(i => glyph(`gw${i}`, `<circle r="26" fill="url(#${P}-pool)"/>`)).join('')}${[0, 1, 2, 3].map(i => glyph(`hw${i}`, hring(0, 0, 12))).join('')}
    ${['pc1', 'pc2'].map(k => glyph(`g${k}`, `<circle r="44" fill="url(#${P}-pool)"/>`)).join('')}
    ${['pc1', 'pc2'].map(k => glyph(`m${k}`, carrierImg('pc', 0, 0))).join('')}
    ${mols.map(pqG).join('')}
    ${['hA0', 'hA1', 'hC0', 'hC1', 'hS0', 'hS1'].map(k => glyph(k, hring(0, 0, 9.5))).join('')}
    ${[0, 1, 2, 3].map(i => glyph(`e${i}`, '<circle class="b6fq-e" r="6"/>')).join('')}
    ${['b6f', 'psi', 'qo', 'qi', 'pool', 'A', 'B', 'C', 'pc1'].map(leader).join('')}
    ${Object.entries(TEXTS).map(([k, [s, cls]]) => glyph(k, lab(s, cls))).join('')}
    ${glyph('lt-r1', lab(ROUTE1, 'b6fq-route chn-halo', 'start'))}${glyph('lt-r2', lab(ROUTE2, 'b6fq-route chn-halo', 'start'))}
    ${glyph('zl-stroma', lab('stroma', 'chn-zone', 'start'))}${glyph('zl-lumen', lab('lumen', 'chn-zone', 'start'))}
    ${glyph('l-e', lab('e⁻', 'b6fq-elab chn-halo', 'start'))}
    `;
}

/* ---------------------------------------------------------------- the staging */

/** A label: its anchor (figure units), where its leader ends, and the leader's side (dy > 0: under the text). */
export interface Lab { at: V; to: V; dy?: number }
export interface Opt {
  id: string; name: string; note: string; beats: Beat[];
  /** the close view */
  z: View;
  /** qb: the plastoquinone pool (homes of A, C, D, E, the label); qa: none */
  pool?: { A: V; C: V; D: V; E: V; B: V; lab: Lab; dTypes: [boolean, boolean] };
  /** qa: where the first plastoquinone rests after Qₒ, where the second plastoquinol comes from, where B rests */
  aRest: V; cFrom: V; bRest: V;
  /** placements of the fixed labels of the close view (figure units) */
  lab: { b6f: Lab; psi: Lab; qo: Lab; qi: Lab; r1: V; r2: V; molOff: V };
  /** the ledger panel, fixed on the screen (stage units, top left) */
  ledger: V;
}

export function makeStaging(o: Opt): Staging {
  const P = `p8q${o.id}`;
  const { svg: chain, pqH, hOut, hWater } = scene(`${P}c`);
  const V1 = tf(o.z);
  const TEND = [B1.end, B2.end, B3.end, B4.end];
  const mols: readonly Mol[] = o.pool ? MOLS : ['A', 'B', 'C'];
  const pl = o.pool;
  const pqA0 = GEO.pq;
  const H_A: V[] = pqH.map(h => [h[0] - pqA0[0], h[1] - pqA0[1]]);

  // the moves (smooth glides): A to Qₒ; A away from Qₒ; C to Qₒ; B away from Qᵢ
  const aHome = pl ? pl.A : pqA0;
  const aIn = glide(pl ? [pl.A, [270, 298], QO] : [pqA0, [264, 298], QO]);
  const aOut = glide(pl ? [QO, [272, 291], pl.A] : [QO, [266, 310], o.aRest]);
  const cIn = glide(pl ? [pl.C, [282, 309], QO] : [o.cFrom, [256, 291], QO]);
  const bOut = glide(pl ? [QI, [296, 285], [272, 296], pl.B] : [QI, [298, 285], o.bRest]);
  const aSettle = glide([pqA0, aHome]);

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    holds: [[B1.h1, B1.h2, B1.h3], [], [B3.h1, B3.h2, B3.h3], []],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="b6fq-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-pdb-bilayer chn-fx">${chain}</g>
        ${overlaySvg(P, mols)}
      </g></g>
      ${ledgerSvg(o.ledger)}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('.chn-g'))
        .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const glyphs = Array.from(chainG.querySelectorAll<SVGGElement>('g.chn-g')).map(el => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        const n = (e: Element, a: string): number => Number(e.getAttribute(a) ?? 0);
        el.querySelectorAll('circle').forEach(c => { const r = n(c, 'r'); x0 = Math.min(x0, n(c, 'cx') - r); x1 = Math.max(x1, n(c, 'cx') + r); y0 = Math.min(y0, n(c, 'cy') - r); y1 = Math.max(y1, n(c, 'cy') + r); });
        el.querySelectorAll('rect').forEach(c => { x0 = Math.min(x0, n(c, 'x')); x1 = Math.max(x1, n(c, 'x') + n(c, 'width')); y0 = Math.min(y0, n(c, 'y')); y1 = Math.max(y1, n(c, 'y') + n(c, 'height')); });
        return { el, c: (Number.isFinite(x0) ? [(x0 + x1) / 2, (y0 + y1) / 2] : [0, 0]) as V };
      });
      const sc = (el: Element, c: V, k: number): void =>
        set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`);
      const flowsE = ['e-pq-b6f', 'e-b6f-pc'].flatMap(parts), hOutW = parts('pq-h-out');
      const slideCarriers = ['pq', 'pc', 'pq-h-load'].flatMap(parts);
      const psiLit = parts('psi-lit'), halo = q('b6fhalo');
      const put = (k: string, at: V, s: number, v: number): void => {
        const el = q(k);
        op(el, v);
        if (v > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${s.toFixed(4)})`);
      };
      const lead = (k: string, from: V, to: V, kk: number, v: number): void => {
        op(q(`ld-${k}`), v);
        if (v <= 0.004) return;
        const d = `M${f1(from[0])},${f1(from[1])}L${f1(to[0])},${f1(to[1])}`;
        set(q(`ld-${k}-h`), 'd', d);
        set(q(`ld-${k}-l`), 'd', d);
        const t = q(`ld-${k}-t`);
        set(t, 'cx', f1(to[0])); set(t, 'cy', f1(to[1])); set(t, 'r', (3.2 * kk).toFixed(2));
      };
      const start = (key: string, at: V, to: V, kk: number, dy: number): V => {
        const w = TEXTS[key][2] * kk * 0.36;
        return [at[0] + Math.max(-w, Math.min(w, to[0] - at[0])), at[1] + dy * kk];
      };
      /** A named label with its leader. */
      const named = (key: string, ld: string, L: Lab, kk: number, v: number): void => {
        put(key, L.at, kk, v);
        lead(ld, start(key, L.at, L.to, kk, L.dy ?? 7), L.to, kk, v);
      };
      /** A lettered plastoquinone: at, opacity, how much it reads PQH₂ (0: PQ). */
      const pqAt = (m: Mol, at: V, v: number, h: number, kk: number): void => {
        put(`m${m}`, at, 1, v);
        const tq = q(`m${m}-q`), th = q(`m${m}-h`);
        op(tq, 1 - h); op(th, h);
        sc(tq, [0, 5], kk); sc(th, [0, 5], kk);
      };
      // the ledger: lay out each row's runs (text measured, ringed H⁺ 21 wide)
      stage.querySelectorAll<SVGGElement>('[data-lg]').forEach(row => {
        let x = 0;
        row.querySelectorAll<SVGElement>('[data-run]').forEach(el => {
          if (el.dataset.run === 'h') { el.setAttribute('transform', `translate(${(x + 13).toFixed(1)} -7)`); x += 30; }
          else { el.setAttribute('x', x.toFixed(1)); x += (el as SVGTextElement).getComputedTextLength() + 5; }
        });
      });
      /** Rows on show, stacked from the top (a row's height counts as it fades in); the panel fits them. */
      const ledger = (vis: Record<string, number>): void => {
        let y = LEDGER_PAD, slot = -1;
        LEDGER.forEach(r => {
          const v = vis[r.k] ?? 0, isVal = r.k.startsWith('b6f') && r.k !== 'b6f';
          if (isVal) {
            if (slot < 0) { slot = y; y += r.h * Math.max(vis.b6f1 ?? 0, vis.b6f2 ?? 0, vis.b6f4 ?? 0); }
            set(q(`lg-${r.k}`), 'transform', `translate(16 ${(slot + r.h * 0.72).toFixed(1)})`);
          } else {
            set(q(`lg-${r.k}`), 'transform', `translate(16 ${(y + r.h * 0.72).toFixed(1)})`);
            y += r.h * v;
          }
          op(q(`lg-${r.k}`), v);
        });
        set(q('lg-panel'), 'height', (y + LEDGER_PAD).toFixed(1));
      };
      const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.3) * (1 - tw(t, t0 + 1.6, t0 + 2.1));

      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const clock = pl ? performance.now() / 1000 : 0;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), t4 = T(3);

        /* ---- camera */
        let cam = tween(B, V1, mv(t1, B1.zoom, B1.zoomD));
        if (b === 3) cam = tween(V1, B_OUT, mv(tt, B4.out, B4.outD));
        const k = kOf(cam.s), z = clamp01(Math.log(cam.s / B.s) / Math.log(V1.s / B.s));
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => sc(el, [x, y], k));
        glyphs.forEach(({ el, c }) => sc(el, c, k));
        const fig = (p: V): V => [(p[0] - cam.t[0]) / cam.s, (p[1] - cam.t[1]) / cam.s];

        /* ---- close-view labels */
        const outL = 1 - tw(t4, B4.labs - 0.05, B4.labs + 0.25);
        const zl = tw(t1, B1.zl, B1.zl + 0.25) * outL;
        put('zl-stroma', fig([36, 54]), k, zl);
        put('zl-lumen', fig([36, 712]), k, zl);
        named('lt-b6f', 'b6f', o.lab.b6f, k, fadeIn(t1, B1.b6f) * (1 - tw(t1, B1.qo, B1.qo + 0.3)));
        if (halo) op(halo, glow(t1, B1.b6f));
        named('lt-psi', 'psi', o.lab.psi, k, fadeIn(t2, B2.psi + 0.1) * (1 - tw(t3, B3.psiOut, B3.psiOut + 0.3)));
        named('lt-qo', 'qo', o.lab.qo, k, fadeIn(t1, B1.qo) * outL);
        // (it gives way to photosystem I's name in beat 2, and comes back for beat 3)
        const qiV = b === 0 ? fadeIn(tt, B1.qi) : b === 1 ? 1 - tw(tt, 0, 0.2) : b === 2 ? fadeIn(tt, 0.3) * (1 - tw(tt, B3.hs - 0.1, B3.hs + 0.2)) : 0;
        named('lt-qi', 'qi', o.lab.qi, k, qiV);
        if (pl) named('lt-pool', 'pool', pl.lab, k, fadeIn(t1, B1.zl + 0.15) * outL);
        // route names, while an electron takes the route
        // (beat 1 only: in beat 3 the second plastoquinol "does the same")
        const r1 = b === 0 ? fadeIn(tt, B1.r1) * (1 - tw(tt, B1.h3 - 0.25, B1.h3)) : 0;
        const r2 = b === 0 ? fadeIn(tt, B1.r2) * (1 - tw(tt, B1.end - 0.3, B1.end)) : 0;
        put('lt-r1', o.lab.r1, k, r1);
        put('lt-r2', o.lab.r2, k, r2);

        /* ---- the slide's carriers and b₆f's lit arrows give way to the story */
        const story = b === 0 ? (tt >= B1.swap ? 1 : 0) : 1;
        slideCarriers.forEach(el => op(el, 1 - story));
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : 0;
        flowsE.forEach(g => op(g, flowsOp));
        hOutW.forEach(g => op(g, b === 3 ? tw(tt, B4.hOut, B4.hOut + 0.4) : flowsOp));

        /* ---- A: the first plastoquinol. Settles in the pool (qb), glides to Qₒ, empties, leaves (beat 3) */
        const shape = mv(t1, B1.swap, 0.6);
        let A: V;
        const aSet = lin(t1, B1.swap, 1.0);
        if (b === 0 && tt < B1.go) A = pl ? add(aSettle.at(aSet), [jig(clock, 1)[0] * aSet, jig(clock, 1)[1] * aSet]) : pqA0;
        else if (b === 0 || b === 1 || t3 < B3.aGo) A = b === 0 ? aIn.at(lin(tt, B1.go, B1.goD)) : QO;
        else {
          const u = lin(t3, B3.aGo, B3.aGoD);
          A = aOut.at(u);
          if (pl) { const j = jig(clock, 1); A = [A[0] + j[0] * u, A[1] + j[1] * u]; }
        }
        if (b === 0 && tt >= B1.go && pl) {
          const u = lin(tt, B1.go, B1.goD), j = jig(clock, 1);
          A = [A[0] + j[0] * (1 - u), A[1] + j[1] * (1 - u)];
        }
        const aEmpty = b === 0 ? tw(tt, B1.relabel, B1.relabel + 0.3) : 1;
        pqA(A, story, 1 - aEmpty, shape);
        function pqA(at: V, v: number, h: number, sh: number): void {
          pqAt('A', at, v, h, k);
          const el = q('mA').querySelector('ellipse') as SVGEllipseElement;
          set(el, 'rx', f1(lerp(13, 18, sh)));
          set(el, 'ry', f1(lerp(6.5, 9.5, sh)));
          const tq = q('mA-q'), th = q('mA-h');
          op(th, h * sh); op(tq, (1 - h) * sh);
        }
        put('gA', A, 1, glow(t1, B1.pq));
        // A's label: plastoquinol when named; plastoquinone once both electrons have gone; gone when it has left Qₒ
        const aLabOut = b === 2 ? 1 - tw(tt, B3.aGo + B3.aGoD - 0.2, B3.aGo + B3.aGoD + 0.1) : b === 3 ? 0 : 1;
        let aH = 0, aQ = 0;
        if (b === 0) { if (tt < B1.relabel) aH = swIn(tt, B1.pq); else { aH = swOut(tt, B1.relabel); aQ = swIn(tt, B1.relabel); } } else aQ = 1;
        const aL: V = add(A, o.lab.molOff);
        put('lt-A-h', aL, k, story * aH * aLabOut);
        put('lt-A-q', aL, k, story * aQ * aLabOut);
        lead('A', start('lt-A-h', aL, add(A, [0, -9.5]), k, 7), add(A, [0, -9.5]), k, story * (aH + aQ > 0 ? 1 : 0) * aLabOut * (b === 0 ? swIn(tt, B1.pq) : 1));

        /* ---- B: the plastoquinone at the Qᵢ site: 1 e⁻ (beat 1), 2 e⁻, 2 H⁺ from the stroma, PQH₂, leaves (beat 3) */
        let Bp: V = QI;
        if (b === 3 || (b === 2 && tt >= B3.bGo)) {
          const u = b === 3 ? 1 : lin(tt, B3.bGo, B3.bGoD);
          Bp = bOut.at(u);
          if (pl) { const j = jig(clock, 2); Bp = [Bp[0] + j[0] * u, Bp[1] + j[1] * u]; }
        }
        const bForm = b === 3 ? 1 : b === 2 ? tw(tt, B3.form, B3.form + 0.3) : 0;
        pqAt('B', Bp, fadeIn(t1, B1.qiIn, 0.4), bForm, k);
        put('gB', Bp, 1, Math.max(glow(t1, B1.qi), glow(t3, B3.form)));
        const bQ = b === 0 ? fadeIn(tt, B1.qi) : b === 1 ? 1 : b === 2 ? 1 - tw(tt, B3.form - 0.05, B3.form + 0.1) : 0;
        const bH = b === 2 ? swIn(tt, B3.form) : 0;
        const bL: V = add(Bp, o.lab.molOff);
        // B's own name only as plastoquinol; as plastoquinone the Qᵢ leader names its place (bQ stays 0 on screen)
        put('lt-B-q', bL, k, 0 * bQ);
        // (gone once it has rejoined the membrane, as A's)
        const bOutL = b === 2 ? 1 - tw(tt, B3.bGo + B3.bGoD - 0.2, B3.bGo + B3.bGoD + 0.1) : 0;
        put('lt-B-h', bL, k, bH * bOutL);
        lead('B', start('lt-B-h', bL, add(Bp, [0, -9.5]), k, 7), add(Bp, [0, -9.5]), k, bH * bOutL);

        /* ---- C: the second plastoquinol, from PSII's side (qa) or from the pool (qb); binds at Qₒ and empties (beat 3) */
        let C: V, cV = 1;
        if (b < 2 || t3 < B3.cGo) {
          if (pl) { const j = jig(clock, 3); C = [pl.C[0] + j[0], pl.C[1] + j[1]]; cV = fadeIn(t1, B1.zl, 0.4); }
          else { C = o.cFrom; cV = b === 2 ? fadeIn(tt, B3.cGo - 0.45, 0.4) : 0; }
        } else {
          const u = lin(t3, B3.cGo, B3.cGoD);
          C = cIn.at(u);
          if (pl) { const j = jig(clock, 3); C = [C[0] + j[0] * (1 - u), C[1] + j[1] * (1 - u)]; }
        }
        const cEmpty = b === 3 ? 1 : b === 2 ? tw(tt, B3.relabel, B3.relabel + 0.3) : 0;
        pqAt('C', C, cV, 1 - cEmpty, k);
        put('gC', C, 1, glow(t3, B3.cName));
        let cH = 0, cQ = 0;
        if (b === 2) { if (tt < B3.relabel) cH = swIn(tt, B3.cName); else { cH = swOut(tt, B3.relabel); cQ = swIn(tt, B3.relabel); } }
        const cOut = b === 2 ? 1 - tw(tt, B3.h3, B3.h3 + 0.25) : 0;
        const cL: V = add(C, o.lab.molOff);
        put('lt-C-h', cL, k, cH * cOut);
        put('lt-C-q', cL, k, cQ * cOut);
        lead('C', start('lt-C-h', cL, add(C, [0, -9.5]), k, 7), add(C, [0, -9.5]), k, (cH + cQ > 0 ? 1 : 0) * cOut * (b === 2 ? swIn(tt, B3.cName) : 0));

        /* ---- qb: the rest of the pool (D, E) jiggles the whole time */
        if (pl) {
          (['D', 'E'] as const).forEach((m, i) => {
            const j = jig(clock, 4 + i), home = pl[m];
            pqAt(m, [home[0] + j[0], home[1] + j[1]], fadeIn(t1, B1.zl, 0.4), pl.dTypes[i] ? 1 : 0, k);
          });
        }

        /* ---- plastocyanin 1: named (beat 1), to photosystem I (beat 2), stays docked */
        const pc1: V = b === 0 ? (tt < B1.pcGo ? GEO.pc : PC1_IN.at(lin(tt, B1.pcGo, B1.pcGoD)))
          : b === 1 ? PC1_OUT.at(lin(tt, B2.go, B2.goD)) : PC_DOCK;
        put('mpc1', pc1, 1, story);
        put('gpc1', pc1, 1, glow(t1, B1.pc));
        const pc1L: V = add(pc1, [0, 44]);
        const pcLong = b === 0 ? swIn(tt, B1.pc) : b === 1 ? swOut(tt, B2.short) : 0;
        const pcShort = b === 0 ? swOut(tt, B1.pc) : b === 1 ? swIn(tt, B2.short) : 1;
        put('lt-pc1-l', pc1L, k, story * pcLong);
        // (the short name, from beat 2 on, sits right of plastocyanin: under it, it would read as the second one's)
        put('lt-pc1-s', b === 0 ? pc1L : [pc1[0] + 20 + 61 * k, pc1[1] + 7 * k], k, story * pcShort);
        lead('pc1', start('lt-pc1-l', pc1L, [pc1[0], pc1[1] + 17], k, -19), [pc1[0], pc1[1] + 17], k, pcLong);

        /* ---- plastocyanin 2: drifts in to cytochrome f (beat 3), takes e⁻, moves off toward PSI, stops short */
        let pc2: V = PC2_FROM, pc2V = 0;
        if (b >= 2) {
          pc2V = b === 3 ? 1 : fadeIn(tt, B3.pc2, 0.5);
          pc2 = b === 3 ? PC2_END : tt < B3.pc2Go ? PC2_IN.at(lin(tt, B3.pc2, B3.pc2D)) : PC2_OUT.at(lin(tt, B3.pc2Go, B3.pc2GoD));
        }
        put('mpc2', pc2, 1, pc2V);
        put('gpc2', pc2, 1, 0);
        // (one plastocyanin label is enough at the zoom-out: the second's goes)
        // (named while it docks at b₆f; the label goes as it moves off, so that the one under the docked plastocyanin reads
        // as that one's)
        put('lt-pc2-s', add(pc2, [0, 44]), k, b === 2 ? fadeIn(tt, B3.pc2 + B3.pc2D - 0.4) * (1 - tw(tt, B3.pc2Go, B3.pc2Go + 0.3)) : 0);

        /* ---- electrons. e0, e1: A's (to PC1, to B). e2, e3: C's (to PC2, to B) */
        const aE = b === 0 ? tw(tt, B1.pq + 0.15, B1.pq + 0.4) * story : 1;
        const uE0 = lin(t1, B1.e1, B1.e1D);
        const e0: V = b === 0 && uE0 <= 0 ? add(A, ON_R) : b === 0 && uE0 < 1 ? TO_PC(smooth(uE0)) : add(pc1, PC_CU);
        put('e0', e0, k, aE);
        const uE1 = lin(t1, B1.e2, B1.e2D);
        const e1: V = b === 0 && uE1 <= 0 ? add(A, ON_L) : b === 0 && uE1 < 1 ? TO_QI1(smooth(uE1)) : add(Bp, ON_L);
        const merge = b === 2 ? 1 - tw(tt, B3.merge, B3.merge + 0.4) : b === 3 ? 0 : 1;
        put('e1', e1, k, aE * merge);
        const cE = b === 2 ? cV * tw(tt, B3.cName + 0.15, B3.cName + 0.4) : b === 3 ? 1 : 0;
        const uE2 = lin(t3, B3.e1, B3.e1D);
        const e2: V = b === 2 && uE2 <= 0 ? add(C, ON_R) : b === 2 && uE2 < 1 ? TO_PC(smooth(uE2)) : add(pc2, PC_CU);
        put('e2', e2, k, cE);
        const uE3 = lin(t3, B3.e2, B3.e2D);
        const e3: V = b === 2 && uE3 <= 0 ? add(C, ON_L) : b === 2 && uE3 < 1 ? TO_QI2(smooth(uE3)) : add(Bp, ON_R);
        put('e3', e3, k, cE * merge);
        const le = b === 0 ? tw(tt, B1.pq + 0.2, B1.pq + 0.45) * (1 - tw(tt, B1.e1 - 0.2, B1.e1)) : 0;
        put('l-e', [e0[0] + 5, e0[1] - 4], k, le);

        /* ---- H⁺: A's ride on it and drop into the lumen (beat 1); C's likewise (beat 3); 2 come from the stroma onto B */
        const drop = (on: V, i: number, u: number, to: V, sh: number): V => {
          const a: V = [on[0] + H_A[i][0] * (1 - sh) + H_ON[i][0] * sh, on[1] + H_A[i][1] * (1 - sh) + H_ON[i][1] * sh];
          return u > 0 ? bez(a, [QO[0] - 22 + 30 * i, 350 + 4 * i], to, u) : a;
        };
        const uHA = smooth(lin(t1, B1.hand, B1.hD));
        const hAOp = b < 3 ? story : 1 - tw(tt, B4.hOut + 0.35, B4.hOut + 0.45);
        [0, 1].forEach(i => put(`hA${i}`, drop(A, i, uHA, hOut[i], shape), k * lerp(1, 12 / 9.5, uHA), hAOp));
        const uHC = smooth(lin(t3, B3.hand, B3.hD));
        [0, 1].forEach(i => put(`hC${i}`, drop(C, i, uHC, H_MORE[i], 1), k * lerp(1, 12 / 9.5, uHC), cE));
        const uHS = smooth(lin(t3, B3.hs + 0.3, B3.hsD));
        const hsV = b === 2 ? fadeIn(tt, B3.hs, 0.3) * merge : 0;
        [0, 1].forEach(i => put(`hS${i}`, uHS > 0 ? lerpV(H_STROMA[i], add(Bp, H_ON[i]), uHS) : H_STROMA[i], k, hsV));

        /* ---- the ledger, per O₂ (fixed on the screen): visible from beat 1 to the end; rows fill as the story runs */
        op(q('ledger'), b === 0 ? fadeIn(tt, 0.05, 0.3) : 1);
        const V: Record<string, number> = { head: 1 };
        // the 4 water H⁺ of the slide (lumen, under PSII) light up and glow briefly as their row ticks
        const wOn = b === 0 ? fadeIn(tt, B1.water, 0.3) : 1;
        hWater.forEach((h, i) => { put(`hw${i}`, h, k, wOn); put(`gw${i}`, h, 1, b === 0 ? pulse(tt, B1.water) : 0); });
        V.water = b === 0 ? fadeIn(tt, B1.water + 0.3) : 1;
        // b₆f: 2 H⁺ × 1 when the first plastoquinol's H⁺ have dropped, × 2 at the second's, × 4 at the zoom-out (with the note)
        const n1 = b > 0 || uHA >= 1, n2 = b > 2 || (b === 2 && uHC >= 1), n4 = b === 3 && tt >= B4.all;
        V.b6f = b === 0 ? fadeIn(tt, B1.hand) : 1;
        V.b6f1 = n1 && !n2 ? (b === 0 ? fadeIn(tt, B1.hand + B1.hD - 0.1, 0.2) : 1) : 0;
        V.b6f2 = n2 && !n4 ? 1 : 0;
        V.b6f4 = n4 ? fadeIn(tt, B4.all, 0.2) : 0;
        V.note1 = V.note2 = b === 3 ? fadeIn(tt, B4.note) : 0;
        V.total = b === 3 ? fadeIn(tt, B4.total) : 0;
        // the stroma: shown as the Qᵢ plastoquinone takes its 2 H⁺ (beat 3)
        const st = b === 3 ? 1 : b === 2 ? fadeIn(tt, B3.hs + 0.6) : 0;
        V.stroma1 = V.stroma2 = st;
        ledger(V);

        /* ---- beat 4: the result line; photosystem I starts to light */
        // the per-2-electron result line was dropped: the per-O₂ ledger alone gives the count (lecturer, 28 Oct 2026)
        psiLit.forEach(g => op(g, PSI_END * tw(t4, B4.psi, B4.psi + 0.6)));
        void z;
      };
    },
  };
}
