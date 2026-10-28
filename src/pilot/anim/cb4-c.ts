// C4 animation, staging C · "The curve, drawn". Beat 1: slide C4's cell (figure v5): one triose phosphate out through
// the translocator, one phosphate in, sucrose leaving, the starch granule growing. Beat 2: the starch curve draws on over
// a day and a night, and the two micrographs land on it at the end of the day and the end of the night: slide figure
// v4. Beat 3: Graf et al.'s graph redrawn with the early night: the second curve draws on: slide figure v2. Beat 4:
// slide figure v7, RuBisCO's arc lit, a CO₂ and an O₂ coming in. Story pieces: cb4-common.ts.
import type { Axes } from '../figs/cb-common';
import {
  bridgeItems, cellItems, grafFx, grafGraph, granuleFx, granuleItems, rubiscoLit, slideC4, STREB, WIN_C, WIN_G,
} from './cb4-common';
import { build, figOnStage, FIG_O, FIG_S, hide, image, type Item, onFig, shadowDef, show, T, win } from './cb-kit';

const P = 'cb4c';
const D = [3.0, 3.2, 3.0, 3.6];
const S = [0, 3.0, 6.2, 9.2];

// beat 1: v5
const v5: Item = { k: 'v5', svg: figOnStage(slideC4(`${P}c`, 'v5')), keys: [{ o: 1 }, hide(S[1], 0.3)] };
const gran = granuleItems(`${P}g`, onFig, 1.07).map(it => ({ ...it, keys: [...it.keys, hide(S[1], 0.3)] }));
const grow = (G: number): number => 0.3 + 0.7 * win(G, 0.3, 2.6);

// the slide's axes, in figure units, drawn where the slide figure sits: v4 (x0 110, y0 292, 600 × 200) and v2 (x0 110,
// y0 84, 620 × 360); the empty card is shown while the slide figure itself is not
const A4: Axes = { x0: 110, y0: 292, w: 600, h: 200, xr: [0, 28], yr: [0, 8] };
const A2: Axes = { x0: 110, y0: 84, w: 620, h: 360, xr: [0, 28], yr: [0, 8] };
const onCard = (inner: string): string => `<g transform="matrix(${FIG_S},0,0,${FIG_S},${FIG_O[0].toFixed(2)},${FIG_O[1].toFixed(2)})">${inner}</g>`;
const card: Item = { k: 'card', svg: figOnStage(''), keys: [{ o: 0 }, show(S[1], 0.3), hide(S[1] + 2.85, 0.3), show(S[2], 0.3), hide(S[2] + 2.7, 0.3)] };
// beat 2: the curve on v4's axes, the micrographs at v4's places (196, 14 and 572, 14; 146 wide), then v4
const g4: Item = { k: 'g4', svg: onCard(grafGraph(`${P}k`, A4)), keys: [{ o: 0 }, show(S[1] + 0.05, 0.3), hide(S[1] + 3.0, 0.25)] };
const tem = (k: string, win: [number, number, number, number], x: number, at: number): Item => {
  const im = image(`${P}-${k}`, STREB, 146 * FIG_S, { win }), c = onFig([x + 73, 14 + (146 * 277) / 195 / 2]);
  return { k, svg: `${im.svg}`, keys: [{ x: c[0], y: c[1] - 30, o: 0 }, show(at, 0.2), { at, d: 0.35, y: c[1] }, hide(S[1] + 3.0, 0.25)] };
};
const temDay = tem('tday', WIN_C, 196, S[1] + 1.4), temNight = tem('tnight', WIN_G, 572, S[1] + 2.4);
const lab = (k: string, x: number, s: string, at: number): Item => ({
  k, svg: onCard(`<g class="fig">${T(x, 90, 'end of', 'fcb-node', 'end')}${T(x, 116, s, 'fcb-node', 'end')}</g>`),
  keys: [{ o: 0 }, show(at, 0.25), hide(S[1] + 3.0, 0.25)],
});
const labs = [lab('lday', 184, 'the day', S[1] + 1.4), lab('lnight', 560, 'the night', S[1] + 2.4)];
const v4: Item = { k: 'v4', svg: figOnStage(slideC4(`${P}p`, 'v4')), keys: [{ o: 0 }, show(S[1] + 2.85, 0.3), hide(S[2], 0.3)] };
// beat 3: the control curve complete on v2's axes, the early curve drawing on, then v2
const g2: Item = { k: 'g2', svg: onCard(grafGraph(`${P}e`, A2)), keys: [{ o: 0 }, show(S[2] + 0.05, 0.3), hide(S[2] + 2.85, 0.25)] };
const v2: Item = { k: 'v2', svg: figOnStage(slideC4(`${P}r`, 'v2')), keys: [{ o: 0 }, show(S[2] + 2.7, 0.3), hide(S[3], 0.3)] };
// beat 4
const v7: Item = { k: 'v7', svg: figOnStage(slideC4(`${P}w`, 'v7')), keys: [{ o: 0 }, show(S[3] + 0.2, 0.45)] };
const lit: Item = { k: 'lit', svg: figOnStage(rubiscoLit(`${P}l`), false), keys: [{ o: 0 }, show(S[3] + 0.8, 0.3)] };

const c4 = grafFx(`${P}k`, A4, S[1] + 0.35, 1e9), c2 = grafFx(`${P}e`, A2, S[2] - 5, S[2] + 0.2), gr = granuleFx(`${P}g`, grow);
export const STAGING = build({
  id: 'c',
  name: 'C · The curve, drawn',
  note: 'Slide C4’s figures in turn, each built up: the cell (v5) with its exchange and growing granule; the starch curve drawn on with the micrographs landing on it (v4); the early night (v2); v7 for RuBisCO and O₂.',
  D,
  holds: [[0], [], [], []],
  defs: shadowDef(P),
  items: [v5, ...gran, ...cellItems(`${P}m`, onFig, 1.07, 0.3), card, g4, temDay, temNight, ...labs, v4, g2, v2, v7, lit, ...bridgeItems(`${P}b`, onFig, 1.07, S[3] + 1.1)],
  fx(G, api) { c4(G, api); c2(G, api); gr(G, api); },
});

