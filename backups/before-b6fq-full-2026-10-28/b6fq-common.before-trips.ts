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
// - Beat 4 (qb), round 2 (two clicks): the rest of one O₂'s Q cycle, quicker. The emptied PQ leaves Qₒ, a pool PQ goes to
//   Qᵢ, plastoquinol 3 (from the pool) and 4 (the restored one) bind at Qₒ in turn: 2 + 2 H⁺ into the lumen, 1 + 1 e⁻ to
//   plastocyanin 3 and 4 (which come up to b₆f and leave the frame toward PSI), 1 + 1 e⁻ to Qᵢ. [click] 2 H⁺ from the stroma:
//   a second PQH₂ restored, back to the pool. On screen then: 8 b₆f H⁺ in the lumen (a grid), 2 PQH₂ restored.
// - Beat 5. Zoom out (the old beat 4; the card moves to the left, the ledger keeps the right); photosystem I starts to light.
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
const sub2 = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
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
/** The 8 b₆f H⁺ of one O₂ land in a grid in the lumen under b₆f, 28–30 units apart (none touch even at the zoom-out, ring
 *  radius 12), clear of the 4 water H⁺ and of plastocyanin at b₆f: plastoquinol 1 → slots 0, 1; 2 → 2, 3; 3 → 4, 5; 4 → 6, 7. */
const H_SLOT: V[] = [[268, 382], [298, 382], [328, 382], [268, 410], [298, 410], [328, 410], [268, 438], [298, 438]];
/** Round 2: plastocyanin 3 and 4 come up to b₆f as 2 did, take their electron and leave the frame toward photosystem I. */
const PC_LEAVE = glide([PC_B6F, [396, 440], [470, 470]]);
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
// Beat 4, round 2 (qb): A (PQ) to Qᵢ, C (PQ) leaves Qₒ, plastocyanin 3 comes; E (PQH₂) binds: 2 H⁺, e⁻ to plastocyanin 3
// (which leaves), e⁻ to Qᵢ; E leaves; plastocyanin 4 comes; B (the restored PQH₂) binds: 2 H⁺, e⁻ to 4, e⁻ to Qᵢ | 2 H⁺ from
// the stroma onto Qᵢ: a second PQH₂ restored; it rejoins the pool.
const BR = {
  aGo: 0.0, aGoD: 0.6, cOut: 0.35, cOutD: 0.6, pc3: 0.15, pc3D: 1.2, eGo: 1.0, eGoD: 0.6, eOn: 1.55,
  eH: 1.75, hD: 0.6, eP: 1.85, eQ: 2.0, eD: 0.5, pc3Go: 2.45, pcGoD: 0.8, eBack: 2.55, eBackD: 0.5, pc4: 2.3, pc4D: 1.0,
  bGo: 3.05, bGoD: 0.55, bOn: 3.6, bH: 3.75, bP: 3.85, bQ: 4.0, pc4Go: 4.45, h1: 4.6,
  hs: 4.7, hsD: 0.8, form: 5.6, merge: 5.8, fGo: 6.1, fGoD: 0.7, end: 7.0,
};
// Beat 5: zoom out; photosystem I starts to light.
const B4 = { out: 0.05, outD: 1.2, labs: 0.1, psi: 1.4, end: 2.4 };
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

/** The ledger, concise (lecturer, 28 Oct 2026): per O₂, rows of text runs and ringed H⁺ ('H'), laid out at bind (measured).
 *  Rows of one slot are versions of one line (the number ticks); slots stack from the top as they fill. */
type Run = string | 'H';
const LEDGER_W = 336, LEDGER_PAD = 12;
const SUBO = 'Q<tspan class="b6fq-sub" dy="4">o</tspan><tspan dy="-4">', SUBI = 'Q<tspan class="b6fq-sub" dy="4">i</tspan><tspan dy="-4">';
const SLOTS = ['head', 'water', 'b6f', 'lumen', 'stroma', 'qi'];
const LEDGER: Array<{ k: string; slot: string; h: number; cls: string; runs: Run[] }> = [
  { k: 'head', slot: 'head', h: 33, cls: 'b6fq-lgh', runs: ['per O₂ (4 e⁻)'] },
  { k: 'water', slot: 'water', h: 31, cls: 'b6fq-lg', runs: ['water: +4', 'H'] },
  ...[1, 2, 3, 4].map(n => ({ k: `b6f${n}`, slot: 'b6f', h: 31, cls: 'b6fq-lg', runs: [`b₆f ${SUBO}: ${n} PQH₂ × 2 = +${2 * n}</tspan>`, 'H'] as Run[] })),
  ...[4, 6, 8, 10, 12].map(n => ({ k: `lumen${n}`, slot: 'lumen', h: 33, cls: 'b6fq-lgt', runs: [`lumen: ${n}`, 'H'] as Run[] })),
  { k: 'stroma0', slot: 'stroma', h: 29, cls: 'b6fq-lg', runs: ['stroma: −4 (PSII)'] },
  { k: 'stroma1', slot: 'stroma', h: 29, cls: 'b6fq-lg', runs: [`stroma: −4 (PSII) −2 (${SUBI})</tspan>`] },
  { k: 'stroma2', slot: 'stroma', h: 29, cls: 'b6fq-lg', runs: [`stroma: −4 (PSII) −4 (${SUBI})</tspan>`] },
  { k: 'qi1', slot: 'qi', h: 29, cls: 'b6fq-lg', runs: [`${SUBI}: 1 PQH₂ restored</tspan>`] },
  { k: 'qi2', slot: 'qi', h: 29, cls: 'b6fq-lg', runs: [`${SUBI}: 2 PQH₂ restored</tspan>`] },
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
    ${['pc1', 'pc2', 'pc3', 'pc4'].map(k => glyph(`m${k}`, carrierImg('pc', 0, 0))).join('')}
    ${mols.map(pqG).join('')}
    ${['hA0', 'hA1', 'hC0', 'hC1', 'hE0', 'hE1', 'hB0', 'hB1', 'hS0', 'hS1', 'hS2', 'hS3'].map(k => glyph(k, hring(0, 0, 9.5))).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => glyph(`e${i}`, '<circle class="b6fq-e" r="6"/>')).join('')}
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
  const TEND = [B1.end, B2.end, B3.end, BR.end, B4.end];
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
  // round 2 (qb): A to Qᵢ and back to B's home as PQH₂; C from Qₒ to A's home; E to Qₒ and back; B to Qₒ
  const P0: V = pl ? pl.A : pqA0, PB: V = pl ? pl.B : o.bRest, PE: V = pl ? pl.E : o.aRest;
  const aToQi = glide([P0, [268, 282], [310, 283], QI]);
  const fOut = glide([QI, [300, 284], [278, 296], PB]);
  const cOut = glide([QO, [275, 289], P0]);
  const eIn = glide([PE, [264, 314], QO]);
  const eOut = glide([QO, [264, 314], PE]);
  const bIn = glide([PB, QO]);

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    holds: [[B1.h1, B1.h2, B1.h3], [], [B3.h1, B3.h2, B3.h3], [BR.h1], []],
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
        let y = LEDGER_PAD;
        SLOTS.forEach(sl => {
          const rows = LEDGER.filter(r => r.slot === sl);
          let w = 0;
          rows.forEach(r => {
            const v = vis[r.k] ?? 0;
            w = Math.max(w, v);
            set(q(`lg-${r.k}`), 'transform', `translate(16 ${(y + r.h * 0.72).toFixed(1)})`);
            op(q(`lg-${r.k}`), v);
          });
          y += rows[0].h * w;
        });
        set(q('lg-panel'), 'height', (y + LEDGER_PAD).toFixed(1));
      };
      /** One version of a ticking line on show: the n-th of keys (n < 0: none), fading in at its tick. */
      const tick = (V: Record<string, number>, keys: string[], n: number, fade: number): void => {
        keys.forEach((kk, i) => { V[kk] = i === n ? fade : 0; });
      };
      const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.3) * (1 - tw(t, t0 + 1.6, t0 + 2.1));

      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const clock = pl ? performance.now() / 1000 : 0;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), tR = T(3), t5 = T(4);
        /** A pool home with its slow drift, weighted by w (0: no drift). */
        const home = (h: V, seed: number, w = 1): V => { if (!pl) return h; const j = jig(clock, seed); return [h[0] + j[0] * w, h[1] + j[1] * w]; };

        /* ---- camera: in with beat 1; out with beat 5 (the card to the left, the ledger keeps the right) */
        let cam = tween(B, V1, mv(t1, B1.zoom, B1.zoomD));
        if (b === 4) cam = tween(V1, B_OUT, mv(tt, B4.out, B4.outD));
        const k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => sc(el, [x, y], k));
        glyphs.forEach(({ el, c }) => sc(el, c, k));
        const fig = (p: V): V => [(p[0] - cam.t[0]) / cam.s, (p[1] - cam.t[1]) / cam.s];

        /* ---- close-view labels */
        const outL = 1 - tw(t5, B4.labs - 0.05, B4.labs + 0.25);
        const zl = tw(t1, B1.zl, B1.zl + 0.25) * outL;
        put('zl-stroma', fig([36, 54]), k, zl);
        put('zl-lumen', fig([36, 668]), k, zl);
        named('lt-b6f', 'b6f', o.lab.b6f, k, fadeIn(t1, B1.b6f) * (1 - tw(t1, B1.qo, B1.qo + 0.3)));
        if (halo) op(halo, glow(t1, B1.b6f));
        named('lt-psi', 'psi', o.lab.psi, k, fadeIn(t2, B2.psi + 0.1) * (1 - tw(t3, B3.psiOut, B3.psiOut + 0.3)));
        named('lt-qo', 'qo', o.lab.qo, k, fadeIn(t1, B1.qo) * outL);
        // (it gives way to photosystem I's name in beat 2, and comes back for beats 3 and 4)
        const qiV = b === 0 ? fadeIn(tt, B1.qi) : b === 1 ? 1 - tw(tt, 0, 0.2) : b === 2 ? fadeIn(tt, 0.3) * (1 - tw(tt, B3.hs - 0.1, B3.hs + 0.2))
          : b === 3 ? fadeIn(tt, 0.1) * (1 - tw(tt, BR.hs - 0.1, BR.hs + 0.2)) : 0;
        named('lt-qi', 'qi', o.lab.qi, k, qiV);
        if (pl) named('lt-pool', 'pool', pl.lab, k, fadeIn(t1, B1.zl + 0.15) * outL);
        // route names, beat 1 only
        put('lt-r1', o.lab.r1, k, b === 0 ? fadeIn(tt, B1.r1) * (1 - tw(tt, B1.h3 - 0.25, B1.h3)) : 0);
        put('lt-r2', o.lab.r2, k, b === 0 ? fadeIn(tt, B1.r2) * (1 - tw(tt, B1.end - 0.3, B1.end)) : 0);

        /* ---- the slide's carriers and b₆f's lit arrows give way to the story (the story's 8 H⁺ replace the slide's 2) */
        const story = b === 0 ? (tt >= B1.swap ? 1 : 0) : 1;
        slideCarriers.forEach(el => op(el, 1 - story));
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : 0;
        flowsE.forEach(g => op(g, flowsOp));
        hOutW.forEach(g => op(g, flowsOp));

        /* ---- A: plastoquinol 1 (to Qₒ, beat 1); back to the pool as PQ (beat 3); in round 2 the new Qᵢ plastoquinone,
         *      restored to PQH₂ (the 2nd), and back to the pool */
        const shape = mv(t1, B1.swap, 0.6);
        let A: V;
        const aSet = lin(t1, B1.swap, 1.0);
        if (b === 0) {
          if (tt < B1.go) A = pl ? add(aSettle.at(aSet), [jig(clock, 1)[0] * aSet, jig(clock, 1)[1] * aSet]) : pqA0;
          else { const u = lin(tt, B1.go, B1.goD); A = aIn.at(u); if (pl) { const j = jig(clock, 1); A = [A[0] + j[0] * (1 - u), A[1] + j[1] * (1 - u)]; } }
        } else if (b === 1 || t3 < B3.aGo) A = QO;
        else if (b === 2) { const u = lin(tt, B3.aGo, B3.aGoD); A = add(aOut.at(u), sub2(home(P0, 1, u), P0)); }
        else if (b === 3) {
          if (tt < BR.fGo) { const u = lin(tt, BR.aGo, BR.aGoD); A = add(aToQi.at(u), sub2(home(P0, 1, 1 - u), P0)); }
          else { const u = lin(tt, BR.fGo, BR.fGoD); A = add(fOut.at(u), sub2(home(PB, 1, u), PB)); }
        } else A = home(PB, 1);
        const aEmpty = b === 0 ? tw(tt, B1.relabel, B1.relabel + 0.3) : 1;
        const aH2 = b === 3 ? tw(tt, BR.form, BR.form + 0.3) : b === 4 ? 1 : 1 - aEmpty;
        pqAt('A', A, story, aH2, k);
        const elA = q('mA').querySelector('ellipse') as SVGEllipseElement;
        set(elA, 'rx', f1(lerp(13, 18, shape)));
        set(elA, 'ry', f1(lerp(6.5, 9.5, shape)));
        op(q('mA-h'), aH2 * shape); op(q('mA-q'), (1 - aH2) * shape);
        put('gA', A, 1, Math.max(glow(t1, B1.pq), glow(tR, BR.form)));
        const aLabOut = b === 2 ? 1 - tw(tt, B3.aGo + B3.aGoD - 0.2, B3.aGo + B3.aGoD + 0.1) : b > 2 ? 0 : 1;
        let aH = 0, aQ = 0;
        if (b === 0) { if (tt < B1.relabel) aH = swIn(tt, B1.pq); else { aH = swOut(tt, B1.relabel); aQ = swIn(tt, B1.relabel); } } else aQ = 1;
        const aL: V = add(A, o.lab.molOff);
        put('lt-A-h', aL, k, story * aH * aLabOut);
        put('lt-A-q', aL, k, story * aQ * aLabOut);
        lead('A', start('lt-A-h', aL, add(A, [0, -9.5]), k, 7), add(A, [0, -9.5]), k, story * (aH + aQ > 0 ? 1 : 0) * aLabOut * (b === 0 ? swIn(tt, B1.pq) : 1));

        /* ---- B: the plastoquinone at Qᵢ, restored to PQH₂ (beat 3), back to the pool; plastoquinol 4 in round 2 */
        let Bp: V = QI;
        if (b === 2 && tt >= B3.bGo) { const u = lin(tt, B3.bGo, B3.bGoD); Bp = add(bOut.at(u), sub2(home(PB, 2, u), PB)); }
        else if (b === 3) Bp = tt < BR.bGo ? home(PB, 2) : (() => { const u = lin(tt, BR.bGo, BR.bGoD); return add(bIn.at(u), sub2(home(PB, 2, 1 - u), PB)); })();
        else if (b === 4) Bp = QO;
        const bForm = b === 2 ? tw(tt, B3.form, B3.form + 0.3) : b === 3 ? 1 - tw(tt, BR.bQ + BR.eD, BR.bQ + BR.eD + 0.3) : 0;
        pqAt('B', Bp, fadeIn(t1, B1.qiIn, 0.4), bForm, k);
        put('gB', Bp, 1, Math.max(glow(t1, B1.qi), glow(t3, B3.form)));
        const bH = b === 2 ? swIn(tt, B3.form) : 0;
        const bL: V = add(Bp, o.lab.molOff);
        put('lt-B-q', bL, k, 0);
        const bOutL = b === 2 ? 1 - tw(tt, B3.bGo + B3.bGoD - 0.2, B3.bGo + B3.bGoD + 0.1) : 0;
        put('lt-B-h', bL, k, bH * bOutL);
        lead('B', start('lt-B-h', bL, add(Bp, [0, -9.5]), k, 7), add(Bp, [0, -9.5]), k, bH * bOutL);

        /* ---- C: plastoquinol 2 (beat 3); leaves Qₒ for the pool in round 2 */
        let C: V, cV = 1;
        if (b < 2 || t3 < B3.cGo) {
          if (pl) { C = home(pl.C, 3); cV = fadeIn(t1, B1.zl, 0.4); }
          else { C = o.cFrom; cV = b === 2 ? fadeIn(tt, B3.cGo - 0.45, 0.4) : 0; }
        } else if (b === 2) { const u = lin(tt, B3.cGo, B3.cGoD); C = pl ? add(cIn.at(u), sub2(home(pl.C, 3, 1 - u), pl.C)) : cIn.at(u); }
        else if (b === 3) { const u = lin(tt, BR.cOut, BR.cOutD); C = add(cOut.at(u), sub2(home(P0, 3, u), P0)); }
        else C = home(P0, 3);
        const cEmpty = b > 2 ? 1 : b === 2 ? tw(tt, B3.relabel, B3.relabel + 0.3) : 0;
        pqAt('C', C, cV, 1 - cEmpty, k);
        put('gC', C, 1, glow(t3, B3.cName));
        let cH = 0, cQ = 0;
        if (b === 2) { if (tt < B3.relabel) cH = swIn(tt, B3.cName); else { cH = swOut(tt, B3.relabel); cQ = swIn(tt, B3.relabel); } }
        const cOutL = b === 2 ? 1 - tw(tt, B3.h3, B3.h3 + 0.25) : 0;
        const cL: V = add(C, o.lab.molOff);
        put('lt-C-h', cL, k, cH * cOutL);
        put('lt-C-q', cL, k, cQ * cOutL);
        lead('C', start('lt-C-h', cL, add(C, [0, -9.5]), k, 7), add(C, [0, -9.5]), k, (cH + cQ > 0 ? 1 : 0) * cOutL * (b === 2 ? swIn(tt, B3.cName) : 0));

        /* ---- the pool's D (PQ) drifts the whole time; E (PQH₂) is plastoquinol 3 in round 2 */
        let E: V = PE;
        if (pl) {
          pqAt('D', home(pl.D, 4), fadeIn(t1, B1.zl, 0.4), pl.dTypes[0] ? 1 : 0, k);
          if (b < 3 || (b === 3 && tt < BR.eGo)) E = home(PE, 5);
          else if (b === 3 && tt < BR.eBack) { const u = lin(tt, BR.eGo, BR.eGoD); E = add(eIn.at(u), sub2(home(PE, 5, 1 - u), PE)); }
          else if (b === 3) { const u = lin(tt, BR.eBack, BR.eBackD); E = add(eOut.at(u), sub2(home(PE, 5, u), PE)); }
          else E = home(PE, 5);
          const eH2 = b < 3 ? (pl.dTypes[1] ? 1 : 0) : b === 3 ? 1 - tw(tt, BR.eQ + BR.eD, BR.eQ + BR.eD + 0.3) : 0;
          pqAt('E', E, fadeIn(t1, B1.zl, 0.4), eH2, k);
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
        put('lt-pc1-s', b === 0 ? pc1L : [pc1[0] + 20 + 61 * k, pc1[1] + 7 * k], k, story * pcShort);
        lead('pc1', start('lt-pc1-l', pc1L, [pc1[0], pc1[1] + 17], k, -19), [pc1[0], pc1[1] + 17], k, pcLong);

        /* ---- plastocyanin 2: up to b₆f (beat 3), takes e⁻, moves toward PSI and stops short */
        let pc2: V = PC2_FROM, pc2V = 0;
        if (b >= 2) {
          pc2V = b > 2 ? 1 : fadeIn(tt, B3.pc2, 0.5);
          pc2 = b > 2 ? PC2_END : tt < B3.pc2Go ? PC2_IN.at(lin(tt, B3.pc2, B3.pc2D)) : PC2_OUT.at(lin(tt, B3.pc2Go, B3.pc2GoD));
        }
        put('mpc2', pc2, 1, pc2V);
        put('gpc2', pc2, 1, 0);
        put('lt-pc2-s', add(pc2, [0, 44]), k, b === 2 ? fadeIn(tt, B3.pc2 + B3.pc2D - 0.4) * (1 - tw(tt, B3.pc2Go, B3.pc2Go + 0.3)) : 0);

        /* ---- plastocyanin 3 and 4 (round 2): up to b₆f, take e⁻, leave the frame toward PSI */
        const pcR = (inAt: number, inD: number, goAt: number): [V, number] => {
          if (b !== 3 || tt < inAt) return [PC2_FROM, 0];
          if (tt < goAt) return [PC2_IN.at(lin(tt, inAt, inD)), fadeIn(tt, inAt, 0.35)];
          const u = lin(tt, goAt, BR.pcGoD);
          return [PC_LEAVE.at(u), 1 - smooth((u - 0.4) / 0.6)];
        };
        const [pc3, pc3V] = pcR(BR.pc3, BR.pc3D, BR.pc3Go), [pc4, pc4V] = pcR(BR.pc4, BR.pc4D, BR.pc4Go);
        put('mpc3', pc3, 1, pc3V);
        put('mpc4', pc4, 1, pc4V);

        /* ---- electrons. e0, e1: plastoquinol 1's (to plastocyanin 1, to Qᵢ); e2, e3: plastoquinol 2's; round 2: e4, e5
         *      (E's: to plastocyanin 3, to Qᵢ), e6, e7 (B's: to plastocyanin 4, to Qᵢ) */
        const aE = b === 0 ? tw(tt, B1.pq + 0.15, B1.pq + 0.4) * story : 1;
        const uE0 = lin(t1, B1.e1, B1.e1D);
        const e0: V = b === 0 && uE0 <= 0 ? add(A, ON_R) : b === 0 && uE0 < 1 ? TO_PC(smooth(uE0)) : add(pc1, PC_CU);
        put('e0', e0, k, aE);
        const uE1 = lin(t1, B1.e2, B1.e2D);
        const e1: V = b === 0 && uE1 <= 0 ? add(A, ON_L) : b === 0 && uE1 < 1 ? TO_QI1(smooth(uE1)) : add(Bp, ON_L);
        const merge = b === 2 ? 1 - tw(tt, B3.merge, B3.merge + 0.4) : b > 2 ? 0 : 1;
        put('e1', e1, k, aE * merge);
        const cE = b === 2 ? cV * tw(tt, B3.cName + 0.15, B3.cName + 0.4) : b > 2 ? 1 : 0;
        const uE2 = lin(t3, B3.e1, B3.e1D);
        const e2: V = b === 2 && uE2 <= 0 ? add(C, ON_R) : b === 2 && uE2 < 1 ? TO_PC(smooth(uE2)) : add(pc2, PC_CU);
        put('e2', e2, k, cE);
        const uE3 = lin(t3, B3.e2, B3.e2D);
        const e3: V = b === 2 && uE3 <= 0 ? add(C, ON_L) : b === 2 && uE3 < 1 ? TO_QI2(smooth(uE3)) : add(Bp, ON_R);
        put('e3', e3, k, cE * merge);
        const le = b === 0 ? tw(tt, B1.pq + 0.2, B1.pq + 0.45) * (1 - tw(tt, B1.e1 - 0.2, B1.e1)) : 0;
        put('l-e', [e0[0] + 5, e0[1] - 4], k, le);
        // round 2
        const mergeR = b === 3 ? 1 - tw(tt, BR.merge, BR.merge + 0.4) : 0;
        const eOn = b === 3 ? fadeIn(tt, BR.eOn, 0.2) : 0, bOn = b === 3 ? fadeIn(tt, BR.bOn, 0.2) : 0;
        const hop = (on: V, side: V, path: (u: number) => V, t0: number, end: V): V => {
          const u = lin(tt, t0, BR.eD);
          return u <= 0 ? add(on, side) : u < 1 ? path(smooth(u)) : end;
        };
        put('e4', hop(E, ON_R, TO_PC, BR.eP, add(pc3, PC_CU)), k, eOn * (tt < BR.pc3Go ? 1 : pc3V));
        put('e5', hop(E, ON_L, TO_QI1, BR.eQ, add(A, ON_L)), k, eOn * mergeR);
        put('e6', hop(Bp, ON_R, TO_PC, BR.bP, add(pc4, PC_CU)), k, bOn * (tt < BR.pc4Go ? 1 : pc4V));
        put('e7', hop(Bp, ON_L, TO_QI2, BR.bQ, add(A, ON_R)), k, bOn * mergeR);

        /* ---- H⁺: each plastoquinol's 2 drop into the lumen, to their slots; 2 + 2 come from the stroma onto Qᵢ */
        const drop = (on: V, i: number, u: number, to: V, sh: number): V => {
          const a: V = [on[0] + H_A[i][0] * (1 - sh) + H_ON[i][0] * sh, on[1] + H_A[i][1] * (1 - sh) + H_ON[i][1] * sh];
          return u > 0 ? bez(a, [QO[0] - 22 + 30 * i, 350 + 4 * i], to, u) : a;
        };
        const HK = 12 / 9.5;
        const uHA = smooth(lin(t1, B1.hand, B1.hD));
        [0, 1].forEach(i => put(`hA${i}`, drop(A, i, uHA, H_SLOT[i], shape), k * lerp(1, HK, uHA), story));
        const uHC = smooth(lin(t3, B3.hand, B3.hD));
        [0, 1].forEach(i => put(`hC${i}`, drop(C, i, uHC, H_SLOT[2 + i], 1), k * lerp(1, HK, uHC), cE));
        const uHE = b > 3 ? 1 : smooth(lin(tR, BR.eH, BR.hD)), uHB = b > 3 ? 1 : smooth(lin(tR, BR.bH, BR.hD));
        [0, 1].forEach(i => put(`hE${i}`, drop(E, i, uHE, H_SLOT[4 + i], 1), k * lerp(1, HK, uHE), b > 3 ? 1 : eOn));
        [0, 1].forEach(i => put(`hB${i}`, drop(Bp, i, uHB, H_SLOT[6 + i], 1), k * lerp(1, HK, uHB), b > 3 ? 1 : bOn));
        const uHS = smooth(lin(t3, B3.hs + 0.3, B3.hsD));
        const hsV = b === 2 ? fadeIn(tt, B3.hs, 0.3) * merge : 0;
        [0, 1].forEach(i => put(`hS${i}`, uHS > 0 ? lerpV(H_STROMA[i], add(Bp, H_ON[i]), uHS) : H_STROMA[i], k, hsV));
        const uHS2 = smooth(lin(tR, BR.hs + 0.3, BR.hsD));
        const hs2V = b === 3 ? fadeIn(tt, BR.hs, 0.3) * mergeR : 0;
        [0, 1].forEach(i => put(`hS${2 + i}`, uHS2 > 0 ? lerpV(H_STROMA[i], add(A, H_ON[i]), uHS2) : H_STROMA[i], k, hs2V));

        /* ---- the ledger, per O₂ (fixed on the screen): visible from beat 1 to the end; the numbers tick as events happen */
        op(q('ledger'), b === 0 ? fadeIn(tt, 0.05, 0.3) : 1);
        const V: Record<string, number> = { head: 1 };
        const wOn = b === 0 ? fadeIn(tt, B1.water, 0.3) : 1;
        hWater.forEach((h, i) => { put(`hw${i}`, h, k, wOn); put(`gw${i}`, h, 1, b === 0 ? pulse(tt, B1.water) : 0); });
        const wRow = b === 0 ? fadeIn(tt, B1.water + 0.3) : 1;
        V.water = wRow;
        const n = (b > 0 || uHA >= 1 ? 1 : 0) + (b > 2 || (b === 2 && uHC >= 1) ? 1 : 0) + (uHE >= 1 ? 1 : 0) + (uHB >= 1 ? 1 : 0);
        tick(V, ['b6f1', 'b6f2', 'b6f3', 'b6f4'], n - 1, 1);
        tick(V, ['lumen4', 'lumen6', 'lumen8', 'lumen10', 'lumen12'], n, wRow);
        const s1 = b > 2 || (b === 2 && uHS >= 1), s2 = b > 3 || (b === 3 && uHS2 >= 1);
        tick(V, ['stroma0', 'stroma1', 'stroma2'], s2 ? 2 : s1 ? 1 : 0, wRow);
        const r1 = b > 2 || (b === 2 && tt >= B3.form), r2 = b > 3 || (b === 3 && tt >= BR.form);
        tick(V, ['qi1', 'qi2'], r2 ? 1 : r1 ? 0 : -1, 1);
        ledger(V);

        /* ---- beat 5: photosystem I starts to light */
        psiLit.forEach(g => op(g, PSI_END * tw(t5, B4.psi, B4.psi + 0.6)));
      };
    },
  };
}
