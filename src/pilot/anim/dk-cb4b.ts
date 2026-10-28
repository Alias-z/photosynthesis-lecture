// C4 · Sucrose and starch, version 2 (beats CB4V2, beats-cb4n.ts), staging s2 "The strip, simplified"
// (research/redo-2026-10-29/C4_ANIM_V2_BRIEF.md): the real-protein strip of dk-cb4.ts (dk2-common.ts, cell-schema.ts),
// with only the 5 beats, in their order, and no numbers on screen. One still framing for all beats: the strip from the
// thylakoid to the cytosol, extended left by a stretch of thylakoid membrane with ATP synthase (the chain's render,
// figs/chain.ts) at the place where the 7m1 chain's ATP synthase stands when the strip joins it (bridge-common.ts).
// - Beat 1, export: 1 triose phosphate goes out through TPT as 1 Pᵢ from the cytosol comes in; they cross at TPT.
// - Beat 2, sucrose: 3 more pairs cross the same way. In the cytosol the phosphates of the 4 triose phosphates come off as
//   4 Pᵢ, which drift back to TPT's cytosol face; the 4 halves of 3 C slide into sucrose's two rows of 6 C (12 C in,
//   12 C out); the sucrose leaves for the plant.
// - Beat 3, TPU: ATP synthase (ADP + Pᵢ → ATP) and the cycle light. The 4 waiting Pᵢ go in with 4 triose phosphates, which
//   pile up in the cytosol: sucrose is not made, so no Pᵢ comes back. The next triose phosphate waits at TPT with no Pᵢ
//   to exchange; the export stops; ATP synthase's Pᵢ runs out (an empty ring), ATP dims, then the cycle dims.
// - Beat 4, day and night: by day (the light lit) 4 triose phosphates go into the starch granule, each freeing its Pᵢ in
//   the stroma, and the granule grows; at night (a gentle veil, the light off, TPT dimmed) it shrinks again as 2 sugars of
//   6 C leave across the envelope and make 1 sucrose in the cytosol, which leaves for the plant (12 C in, 12 C out).
// - Beat 5, sunlight in sugar: CO₂ and RuBP go into RuBisCO; then the light lights, for the caption's question.
import atpsPng from '../../assets/chain/atps.webp';
import { atomBall, row } from '../figs/carbon-form';
import { arrow, balls, bilayer, cellSvg } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import {
  ALL_PARTS, attrSetter, camTf, curve, ease, f, frame, glide, hidePhotoresp, lerp, lerpV, placer, SP, Strip, tAt,
  uNear, type Cam, type LitMap, type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';
import { withKeys } from './stage-keys-cb';

const P = 'dkc4b';
const RT = 10.5, R = 11;
/** Atom step at r 10.5 (carbon-form step); a triose phosphate's phosphate sits 2 steps from its 3 C's centre. */
const STEP = RT * 2.15, PX = 2 * STEP, HALF = 1.5 * STEP;

/* ---------------------------------------------------------------- where (strip units) */

const TPS: V = SP.tp;                     // the triose phosphate spot, where triose phosphates start
const TPT_X = 760;
const GRAN: V = SP.starch;                // the starch granule's centre
/** Sucrose in the cytosol: its two rows of 6 C. */
const SUC: V = [985, 46], ROWY = [32, 60];
/** The four waiting places of triose phosphates at the sucrose (0 top right, 1 bottom right, 2 top left, 3 bottom left),
 *  the side their phosphate is on (outwards, so that the halves of 3 C meet in the middle), and where their 3 C end up. */
const SIDE = [1, 1, -1, -1] as const;
const SLOT: V[] = [[1049, ROWY[0]], [1049, ROWY[1]], [921, ROWY[0]], [921, ROWY[1]]];
const FIN: V[] = SLOT.map(([, y], i) => [SUC[0] + SIDE[i] * HALF, y] as V);
const PHOS: V[] = SLOT.map(([x, y], i) => [x + SIDE[i] * PX, y] as V);
/** The cytosol's Pᵢ, waiting at TPT's cytosol face. */
const W: V[] = [[858, 166], [888, 166], [858, 196], [888, 196]];
/** Freed Pᵢ k (from waiting place k) goes back to W[TO_W[k]]: the left ones straight down; the right ones down the right
 *  side and along the gap between the sucrose and the peroxisome, the lower one first (PR_LAG), so they never meet. */
const TO_W = [1, 3, 0, 2], PR_LAG = [0.35, 0, 0, 0];
const prPath = (k: number): Path => {
  const a = PHOS[k], w = W[TO_W[k]];
  if (k === 0) return curve([a, [1100, 70], [1098, 96], [1040, 104], [962, 114], w]);
  if (k === 1) return curve([a, [1100, 96], [1040, 104], [962, 114], [906, 170], w]);
  return curve([a, [a[0] - 12, a[1] + 70], w]);
};
/** A triose phosphate from its spot along the export arrow, through TPT, to its waiting place. */
const tpPath = (s: V): Path => curve([TPS, [460, 97], [570, 96], [690, 99], [TPT_X, 100], [826, 99], [lerp(826, s[0], 0.45), lerp(99, s[1], 0.7)], s]);
/** Pᵢ from its waiting place in through TPT, into the stroma. */
const piPath = (w: V): Path => curve([w, [848, 142], [818, 129], [TPT_X, 127], [690, 126], [628, 134]]);
const PI_D = 1.6;
/** The triose phosphate that finds no Pᵢ: it stops at TPT's stroma face. */
const STUCK_AT: V = [664, 100];
const stuckPath = curve([TPS, [460, 97], [570, 96], STUCK_AT]);
/** Into the granule, along the strip's arrow to starch. */
const toStarch = curve([TPS, [404, 70], [470, 40], [530, 24], GRAN]);
const starchPi = curve([[GRAN[0] + PX, GRAN[1]], [622, 40], [636, 60]]);
/** At night a 6-C sugar leaves the granule across the envelope (above TPT) to a row of sucrose: the first to the lower
 *  row, then the second to the upper row from above, so that neither crosses the other. */
const hexPath = (k: number): Path => k === 0
  ? curve([GRAN, [650, -20], [760, -34], [850, -26], [930, 8], [SUC[0], ROWY[1]]])
  : curve([GRAN, [650, -22], [760, -38], [850, -36], [950, -16], [SUC[0], ROWY[0]]]);
const sucOut = curve([SUC, [1120, 46], [1250, 42]]);
/** CO₂ comes up to RuBisCO along its arrow, RuBP to its spot below its arrow; both stay for the still. */
const P_CO2 = curve([[SP.co2[0] - 30, SP.co2[1] - 8], SP.co2, [228, SP.co2[1]]]);
const P_RUBP = curve([[SP.rubp[0], 520], [SP.rubp[0], 490], SP.rubp]);

/** ATP synthase on the thylakoid membrane (centre y 300), left of the strip; its reaction ADP + Pᵢ → ATP above its head
 *  (as the chain draws it), and the ATP arrow from there to PGK + GAPDH (the strip's own ATP arrow, which is hidden). */
const ATPS = { x: -150, w: 343 * 0.95 / 2.4, h: 557 * 0.95 / 2.4, my: 462.8 * 0.95 / 2.4 };
const ROW_C: V = [-74, 92];
const ATP_ARROW: V[] = [[36, 96], [86, 100], [124, 146], [SP.gapdh[0] - 50, SP.gapdh[1] + 4]];

/* ---------------------------------------------------------------- timing */

interface Pair { tp: Path; g: number; d: number; pi: Path; pg: number }
/** A triose phosphate out to slot s, started at g over d, and the Pᵢ from w that crosses TPT at the same moment. */
function pair(s: V, w: V, g: number, d: number): Pair {
  const tp = tpPath(s), pi = piPath(w);
  const tc = tAt(uNear(tp, [TPT_X, 100]), g, d);
  return { tp, g, d, pi, pg: tc - tAt(uNear(pi, [TPT_X, 127]), 0, PI_D) };
}
const B1 = pair(SLOT[0], W[0], 0.9, 3.0);
const B2 = [1, 2, 3].map((i, j) => pair(SLOT[i], W[i], 0.3 + 0.8 * j, 2.2));
/** Beat 2: phosphates off, Pᵢ back to TPT, the halves slide into sucrose, sucrose takes over, its name, it leaves. */
const M2 = { off: 4.3, back: 4.6, slide: 4.9, take: 5.5, name: 5.7, out: 6.3 };
const B3 = [0, 1, 2, 3].map(i => pair(SLOT[i], W[i], 0.4 + 0.7 * i, 2.0));
const STUCK = { g: 3.2, d: 1.4 };
const T3 = { stop: 4.7, piOut: 4.9, atpOff: 5.3, cycOff: 6.0 };
/** Beat 4: triose phosphates into starch (arrivals A4), the night, the sugars out (H4), sucrose. */
const G4 = [0.8, 1.6, 2.4, 3.2], D4 = 1.4, A4 = G4.map(g => g + D4);
const NIGHT = 5.2, H4 = [6.1, 6.7], HD = 1.8, TAKE4 = H4[1] + HD, OUT4 = TAKE4 + 0.7;

/* ---------------------------------------------------------------- glyphs */

/** A triose phosphate: its 3 C centred on the origin, its phosphate on `side` (data-k `<k>-P`, which fades on its own). */
const tpG = (k: string, side: 1 | -1): string =>
  `<g data-k="${P}-${k}-P"><path d="M${f(side * STEP)},0H${f(side * PX)}" style="stroke:#6b6a64;stroke-width:2.31;fill:none"/>${atomBall(side * PX, 0, 'P', RT)}</g>${row(0, 0, 'CCC', { r: RT })}`;
const piG = `<g class="chn-g">${tagG(0, 0, '', 'pi')}</g>`;
const sucG = `${row(0, ROWY[0] - SUC[1], 'CCCCCC', { r: RT })}${row(0, ROWY[1] - SUC[1], 'CCCCCC', { r: RT })}`;
const lab = (k: string, x: number, y: number, s: string, a = 'middle'): string =>
  `<text data-k="${P}-${k}" class="cel-mn cel-halo" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const mover = (k: string, svg: string): string => `<g data-k="m-${k}" opacity="0">${svg}</g>`;
const MOV: Array<[string, string]> = [
  ...[0, 1, 2, 3].map(i => [`tp${i}`, tpG(`tp${i}`, SIDE[i])] as [string, string]),
  ['tp4', tpG('tp4', 1)],
  ...[0, 1, 2, 3].map(i => [`st${i}`, tpG(`st${i}`, 1)] as [string, string]),
  ...[0, 1, 2, 3].map(i => [`pi${i}`, piG] as [string, string]),
  ...[0, 1, 2, 3].map(i => [`pr${i}`, piG] as [string, string]),
  ['hx0', row(0, 0, 'CCCCCC', { r: RT })], ['hx1', row(0, 0, 'CCCCCC', { r: RT })],
  ['suc', `${sucG}${lab('sucl', 0, ROWY[0] - SUC[1] - 22, 'sucrose')}`],
  ['co2', `<g class="chn-g">${balls(0, 0, 'OCO')}</g>${lab('co2l', 0, -22, 'CO₂')}`],
  ['rubp', `${row(0, 0, 'PCCCCCP', { r: R })}${lab('rubpl', -96, 6, 'RuBP', 'end')}`],
];

/** ADP + Pᵢ → ATP, laid out as chain.ts rowG does (gap 5), with the Pᵢ and its empty ring addressable. */
function atpRow(): string {
  const [cx, y] = ROW_C, x0 = cx - 90.8;
  const op = (x: number, s: string): string => `<text class="chn-tagop" x="${f(x)}" y="${f(y + 7)}" text-anchor="middle">${s}</text>`;
  return `<g data-k="${P}-row" opacity=".38"><g class="chn-g">${tagG(x0 + 23.4, y, 'ADP', 'atp')}${op(x0 + 61.8, '+')}
    <circle data-k="${P}-ring" cx="${f(x0 + 90.8)}" cy="${f(y)}" r="13" style="fill:none;stroke:#c7742b;stroke-width:1.6;stroke-dasharray:4 3" opacity="0"/>
    <g data-k="${P}-rpi">${tagG(x0 + 90.8, y, '', 'pi')}</g>${op(x0 + 133.8, '→')}${tagG(x0 + 172.2, y, 'ATP', 'atp')}</g></g>`;
}

/* ---------------------------------------------------------------- the scene */

/** Left of the strip (x < 0): stroma, the thylakoid membrane and lumen continued (dimmed as the strip's thylakoid),
 *  ATP synthase (dimmed: the strip's grey filter). Drawn under the strip. */
function backSvg(): string {
  const img = `href="${atpsPng}" x="${f(ATPS.x)}" y="${f(300 - ATPS.my)}" width="${f(ATPS.w)}" height="${f(ATPS.h)}"`;
  return `<defs><filter id="${P}-grey" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".12 .24 .05 0 .53 .12 .24 .05 0 .53 .12 .24 .05 0 .53 0 0 0 1 0"/></filter></defs>
    <rect class="cel-stroma" x="-360" y="-60" width="360" height="860"/>
    <g class="chn-off cbb-thyl"><rect class="cel-lumen" x="-360" y="300" width="352" height="152"/>${bilayer([{ L: [-360, 300, -8, 300] }])}</g>
    <image ${img} filter="url(#${P}-grey)"/>`;
}
/** Over the dimmed strip, under the lit one: the granule, ATP synthase lit, its row and the ATP arrow. */
function underSvg(): string {
  const img = `href="${atpsPng}" x="${f(ATPS.x)}" y="${f(300 - ATPS.my)}" width="${f(ATPS.w)}" height="${f(ATPS.h)}"`;
  const rings = [0.75, 0.5, 0.26].map(q => `<ellipse class="cel-starchr" rx="${f(84 * q)}" ry="${f(40 * q)}" vector-effect="non-scaling-stroke"/>`).join('');
  return `<g data-k="${P}-gran" transform="translate(${GRAN[0]} ${GRAN[1]}) scale(.6)"><ellipse class="cel-starch" rx="84" ry="40" vector-effect="non-scaling-stroke"/>${rings}
      <ellipse data-k="${P}-granl" rx="84" ry="40" vector-effect="non-scaling-stroke" style="fill:none;stroke:#a99f84;stroke-width:2.2" opacity="0"/></g>
    <g data-k="${P}-atps" opacity="0"><image ${img}/><text class="cel-prot cel-halo" x="${f(ATPS.x + 58)}" y="372" text-anchor="middle">ATP synthase</text></g>
    <g class="chn-off">${arrow(ATP_ARROW, 'atp')}</g><g data-k="${P}-atpa" class="chn-on" opacity="0">${arrow(ATP_ARROW, 'atp')}</g>
    ${atpRow()}`;
}
/** Over the lit strip, under the moving glyphs: the names that do not move (triose phosphate left of its spot, clear of
 *  the arrows out of it; the cytosol, whose strip name lies below this framing), the night veil. */
function overSvg(): string {
  return `${lab('tpl', TPS[0] - 66, TPS[1] + 6, 'triose phosphate', 'end')}${lab('stl', GRAN[0], -32, 'starch')}
    <text class="cel-zone" x="848" y="516">cytosol</text>
    <rect data-k="${P}-veil" class="dk2-nightveil" x="-400" y="-200" width="2000" height="1000" opacity="0"/>`;
}
function sceneSvg(): string {
  const dim = cellSvg(`${P}d`, 'strip', [], { bare: true, unit: 'none', noMol: true });
  const lit = cellSvg(`${P}l`, 'strip', ALL_PARTS, { bare: true, unit: 'none', noMol: true });
  return `<g data-k="cam"><g class="fig dk2">${backSvg()}<g class="dk2-dim">${dim}</g>${underSvg()}<g class="dk2-lit" data-k="lit">${lit}</g>
    ${overSvg()}${MOV.map(([k, s]) => mover(k, s)).join('')}</g></g>`;
}

/* ---------------------------------------------------------------- framing and lighting */

/** One still framing: from ATP synthase (x −180) to the cytosol beyond the sucrose (x 1120), the strip's top at y −60. */
const CAM: Cam = frame(-180, 1120, 0, 1600, -60);
const EXP = (b: number, fl = b): LitMap => ({ 'export:body': b, 'export:text': b, 'export:flow': fl });
/** The cycle without its names: proteins and arrows (and PRK's ATP). */
const CYC = ['rubisco:body', 'rubisco:flow', 'reduce:body', 'reduce:flow', 'regen:body', 'regen:flow', 'regen:node', 'carbox:flow', 'co2:flow'];
const cyc = (v: number): LitMap => Object.fromEntries(CYC.map(k => [k, v]));
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return EXP(ease(t, 0.1, 0.8));
  if (beat === 1) return EXP(1);
  if (beat === 2) return { ...EXP(1, 1 - ease(t, T3.stop, T3.stop + 0.6)), ...cyc(ease(t, 0.2, 1.0) * (1 - ease(t, T3.cycOff, T3.cycOff + 1.2))) };
  if (beat === 3) {
    const day = 1 - ease(t, NIGHT, NIGHT + 1), on = ease(t, 0.2, 0.9);
    return { ...EXP(day, ease(t, 0, 0.7) * day), 'starch:flow': on * day, 'light:flow': on * day };
  }
  const on = ease(t, 0.2, 1.0);
  return { 'rubisco:body': on, 'rubisco:text': on, 'rubisco:flow': on, 'co2:flow': on, 'light:flow': ease(t, 3.0, 3.8) };
}
/** The granule's scale: 0.6 outside beat 4; by day +0.1 per triose phosphate, at night −0.2 per sugar of 6 C. */
function granule(beat: number, t: number): number {
  if (beat !== 3) return 0.6;
  return 0.6 + 0.1 * A4.reduce((s, a) => s + ease(t, a, a + 0.4), 0) - 0.2 * H4.reduce((s, h) => s + ease(t, h - 0.1, h + 0.7), 0);
}

/* ---------------------------------------------------------------- the script */

interface St { pos: Record<string, Put>; att: Record<string, number> }
/** A pair: the triose phosphate on its way (fading in at its spot) and the Pᵢ (waiting from `piIn`, gone into the stroma). */
function playPair(st: St, k: number, p: Pair, t: number, piIn: number): void {
  st.pos[`tp${k}`] = { at: glide(p.tp, t, p.g, p.d), o: ease(t, p.g - 0.2, p.g + 0.1) };
  st.pos[`pi${k}`] = { at: glide(p.pi, t, p.pg, PI_D), o: piIn * (1 - ease(t, p.pg + PI_D - 0.2, p.pg + PI_D + 0.3)) };
}
function script(beat: number, t: number): St {
  const st: St = { pos: {}, att: {} }, { pos, att } = st;
  for (let i = 0; i < 5; i++) att[`${P}-tp${i}-P`] = 1;
  for (let i = 0; i < 4; i++) att[`${P}-st${i}-P`] = 1;
  att[`${P}-sucl`] = 1;
  if (beat === 0) {
    playPair(st, 0, B1, t, ease(t, 0.5, 1.0));
  } else if (beat === 1) {
    pos.tp0 = { at: SLOT[0], o: 1 };
    B2.forEach((p, j) => playPair(st, j + 1, p, t, ease(t, 0, 0.5)));
    const slide = ease(t, M2.slide, M2.slide + 0.7), take = ease(t, M2.take, M2.take + 0.3);
    for (let i = 0; i < 4; i++) {
      const at = pos[`tp${i}`].at;
      pos[`tp${i}`] = { at: lerpV(at, FIN[i], slide), o: pos[`tp${i}`].o * (take < 1 ? 1 : 0) };
      att[`${P}-tp${i}-P`] = 1 - ease(t, M2.off, M2.off + 0.3);
      pos[`pr${i}`] = { at: glide(prPath(i), t, M2.back + PR_LAG[i], 1.4), o: ease(t, M2.off, M2.off + 0.25) };
    }
    pos.suc = { at: glide(sucOut, t, M2.out, 1.3), o: take };
    att[`${P}-sucl`] = ease(t, M2.name, M2.name + 0.4);
  } else if (beat === 2) {
    B3.forEach((p, i) => playPair(st, i, p, t, 1));
    pos.tp4 = { at: glide(stuckPath, t, STUCK.g, STUCK.d), o: ease(t, STUCK.g - 0.2, STUCK.g + 0.1) };
  } else if (beat === 3) {
    // beat 3's leftovers fade; then starch by day and sucrose from starch at night
    const gone = 1 - ease(t, 0, 0.6);
    for (let i = 0; i < 4; i++) pos[`tp${i}`] = { at: SLOT[i], o: gone };
    pos.tp4 = { at: STUCK_AT, o: gone };
    G4.forEach((g, k) => {
      const a = A4[k], into = ease(t, a, a + 0.35);
      pos[`st${k}`] = { at: glide(toStarch, t, g, D4), o: ease(t, g - 0.2, g + 0.1) * (1 - into), s: 1 - 0.6 * into };
      att[`${P}-st${k}-P`] = 1 - ease(t, a - 0.1, a + 0.15);
      pos[`pr${k}`] = { at: glide(starchPi, t, a + 0.1, 0.8), o: ease(t, a - 0.1, a + 0.15) * (1 - ease(t, a + 0.6, a + 0.95)) };
    });
    const take = ease(t, TAKE4, TAKE4 + 0.3);
    H4.forEach((h, k) => { pos[`hx${k}`] = { at: glide(hexPath(k), t, h, HD), o: ease(t, h - 0.3, h + 0.1) * (take < 1 ? 1 : 0) }; });
    pos.suc = { at: glide(sucOut, t, OUT4, 1.3), o: take };
    att[`${P}-sucl`] = ease(t, TAKE4 + 0.2, TAKE4 + 0.6);
  } else {
    pos.co2 = { at: glide(P_CO2, t, 0.9, 1.6), o: ease(t, 0.8, 1.2) };
    pos.rubp = { at: glide(P_RUBP, t, 1.0, 1.6), o: ease(t, 0.9, 1.3) };
  }
  // ATP synthase, its Pᵢ, the ATP arrow (beat 3: lit, then its Pᵢ runs out and it dims)
  const atp = beat === 2 ? ease(t, 0.2, 1.0) * (1 - ease(t, T3.atpOff, T3.atpOff + 1.0)) : 0;
  const rpi = beat === 2 ? 1 - ease(t, T3.piOut, T3.piOut + 0.6) : beat === 3 ? ease(t, 0, 0.6) : 1;
  att[`${P}-atps`] = atp; att[`${P}-atpa`] = atp; att[`${P}-row`] = lerp(0.38, 1, atp);
  att[`${P}-rpi`] = rpi; att[`${P}-ring`] = 1 - rpi;
  // names that stay put; the granule lit by day and night; the veil
  att[`${P}-tpl`] = beat === 0 ? ease(t, 0.1, 0.7) : beat <= 2 ? 1 : beat === 3 ? 1 - ease(t, NIGHT, NIGHT + 1) : 0;
  const gl = beat === 3 ? ease(t, 0.2, 0.9) : beat === 4 ? 1 - ease(t, 0, 0.6) : 0;
  att[`${P}-stl`] = gl; att[`${P}-granl`] = gl;
  att[`${P}-veil`] = 0.14 * (beat === 3 ? ease(t, NIGHT, NIGHT + 1) : beat === 4 ? 1 - ease(t, 0, 0.8) : 0);
  return st;
}

const STAGING_BASE: Staging = {
  id: 's2',
  name: 's2 · The strip, simplified',
  note: 'The strip with ATP synthase, one still framing, no numbers: triose phosphate out through TPT as Pᵢ comes in; 4 of them make sucrose, their 4 Pᵢ back to TPT; sucrose too slow, Pᵢ runs out at ATP synthase; starch by day, sucrose from starch at night; CO₂ and RuBP into RuBisCO',
  svg: sceneSvg,
  bind(stage) {
    const S = new Strip(stage);
    S.hide('export', 'node'); S.hide('export', 'text', el => !el.textContent?.includes('TPT'));
    S.hide('starch', 'body'); S.hide('starch', 'text'); S.hide('o2', 'text');
    S.hide('supply', 'flow'); S.hide('supply', 'node');
    hidePhotoresp(S);
    (stage.querySelector('[data-k="cam"]') as SVGGElement).setAttribute('transform', camTf(CAM));
    const put = placer(stage, MOV.map(([k]) => k)), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      A(`${P}-gran`, 'transform', `translate(${GRAN[0]} ${GRAN[1]}) scale(${f(granule(beat, t))})`);
      const { pos, att } = script(beat, t);
      put(pos);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
    };
  },
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026: "people don't read the
 *  text under the animation"). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 0, lines: ['Triose phosphate out, Pᵢ in'], x: 430, y: 48, size: 34, at: 1.5 },
  { beat: 1, lines: ['Sucrose: to growing organs and grain'], x: 430, y: 48, size: 34, at: 1.5 },
  { beat: 2, lines: ['Too little Pᵢ: photosynthesis slows (TPU)'], x: 430, y: 48, size: 34, at: 1.5 },
  { beat: 3, lines: ['Starch by day, sucrose at night'], x: 430, y: 48, size: 34, at: 1.5 },
  { beat: 4, lines: ['But RuBisCO also adds O₂:', 'what happens to its product, 2-PG?'], x: 800, y: 200, size: 44, at: 1.5 },
]);
