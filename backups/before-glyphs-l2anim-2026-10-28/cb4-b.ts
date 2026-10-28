// C4 animation, staging B · "Clippings and the clock". Beat 1: slide C4's figure v8 (the translocator): one triose
// phosphate crosses out while one phosphate crosses in. Beat 2: Streb & Zeeman's two electron micrographs of
// Arabidopsis chloroplasts as clippings, and a 24-hour clock: as it runs, the end-of-day picture (full of starch) and
// the end-of-night picture (none left) appear in turn. Beat 3: Graf et al.'s published graph (slide figure v1). Beat 4:
// slide figure v7, Rubisco's arc lit, a CO₂ and an O₂ coming in. Story pieces: cb4-common.ts.
import {
  bridgeItems, clockFace, clockFx, CR_STREB, rubiscoLit, slideC4, STREB, tpTok, piTok, WIN_C, WIN_G,
} from './cb4-common';
import {
  build, clipping, credit, f1, figOnStage, hide, image, type Item, type Key, leader, onFig, pill, shadowDef, show, T, type V, win,
} from './cb-kit';

const P = 'cb4b';
const D = [2.6, 3.2, 1.2, 3.6];
const S = [0, 2.6, 5.8, 7.0];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];

// beat 1: v8 and the two crossings (figure: triose phosphate row at y 265, arrow 290 → 520; Pᵢ at y 335, 536 → 280)
const v8: Item = { k: 'v8', svg: figOnStage(slideC4(`${P}t`, 'v8')), keys: [{ o: 1 }, hide(S[1], 0.3)] };
const tpPath = (u: number): V => onFig([200 + 400 * u, 265]), piPath = (u: number): V => onFig([560 - 300 * u, 335]);
const moving: Item[] = [
  { k: 'tp', svg: tpTok(2.0 * 1.07), keys: [{ ...xy(tpPath(0)), o: 0 }, show(0.15, 0.15), { at: 0.15, d: 1.4, path: tpPath }, hide(1.6, 0.25)] },
  { k: 'pi', svg: piTok(1.45 * 1.07), keys: [{ ...xy(piPath(0)), o: 0 }, show(0.75, 0.15), { at: 0.75, d: 1.1, path: piPath }, hide(1.9, 0.25)] },
];
function xy(q: V): { x: number; y: number } { return { x: q[0], y: q[1] }; }

// beat 2: the micrographs as clippings, the clock between them
const TW = 250;
function temClip(win: [number, number, number, number], label: string, seed: number, rot: number, pills: string): { svg: string } {
  const a = image(`${P}-tem${seed}`, STREB, TW, { win }), m = 16, h = a.h + 2 * m + 46;
  const inner = `<g transform="translate(0 ${f1(-h / 2 + m + a.h / 2)})">${a.svg}${pills}</g>${T(0, h / 2 - 20, label, 'clip-name cbk-serif', 'middle', ' style="font-size:26px"')}`;
  return { svg: clipping(P, TW + 2 * m, h, inner, { rot, seed }) };
}
const dayIm = image(`${P}-q`, STREB, TW, { win: WIN_C });
const g1 = dayIm.at(85, 165), g2 = dayIm.at(118, 250);
const dayPills = `${leader([g1[0] + 120, g1[1] - 50], [g1[0] + 4, g1[1]])}${leader([g1[0] + 120, g1[1] - 50], [g2[0] + 4, g2[1]])}<g transform="translate(${f1(g1[0] + 120)} ${f1(g1[1] - 64)})">${pill('starch', { size: 22 })}</g>`;
const DAY: V = [470, 400], NIGHT: V = [1130, 400];
const dayClip: Item = { k: 'day', svg: temClip(WIN_C, 'end of the day', 161, -1.5, dayPills).svg, keys: life(DAY[0], DAY[1], S[1] + 0.8, S[2]) };
const nightClip: Item = { k: 'night', svg: temClip(WIN_G, 'end of the night', 163, 1.4, '').svg, keys: life(NIGHT[0], NIGHT[1], S[1] + 1.95, S[2]) };
const temCr: Item = { k: 'tem-cr', svg: credit(`${CR_STREB} · <tspan class="cbk-it">Arabidopsis</tspan> mesophyll, scale bars 1 µm`), keys: life(800, 724, S[1] + 0.05, S[2]) };
const clock: Item = { k: 'clock', svg: clockFace(`${P}c`, 70), keys: life(800, 300, S[1] + 0.05, S[2]) };
const RUN = { t0: S[1] + 0.45, d: 1.9 };

// beat 3: v1; beat 4: v7 with Rubisco lit
const v1: Item = { k: 'v1', svg: figOnStage(slideC4(`${P}p`, 'v1')), keys: [{ o: 0 }, show(S[2] + 0.1, 0.4), hide(S[3], 0.35)] };
const v7: Item = { k: 'v7', svg: figOnStage(slideC4(`${P}w`, 'v7')), keys: [{ o: 0 }, show(S[3] + 0.2, 0.45)] };
const lit: Item = { k: 'lit', svg: figOnStage(rubiscoLit(`${P}r`), false), keys: [{ o: 0 }, show(S[3] + 0.8, 0.3)] };

const clk = clockFx(`${P}c`, G => 24 * win(G, RUN.t0, RUN.t0 + RUN.d));
export const STAGING = build({
  id: 'b',
  name: 'B · Clippings and the clock',
  note: 'The translocator (slide v8) with one triose phosphate out, one phosphate in; Streb & Zeeman’s micrographs as clippings, appearing as a 24-hour clock runs; Graf et al.’s published graph (v1); v7 for Rubisco and O₂.',
  D,
  holds: [[0], [0.4], [], []],
  defs: shadowDef(P),
  items: [v8, ...moving, clock, dayClip, nightClip, temCr, v1, v7, lit, ...bridgeItems(`${P}b`, onFig, 1.07, S[3] + 1.1)],
  fx(G, api) { clk(G, api); },
});
