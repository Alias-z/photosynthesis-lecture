// C4 animation, staging A · "Into the cell and back". Opens on slide C4's figure v7 (the wheel's exit splitting into
// sucrose and starch). Beat 1: the camera dives into the exit and comes up in slide C4's cell (figure v5); a click sends
// one triose phosphate out through the translocator while one phosphate comes in, sucrose leaves, and the starch granule
// grows. Beat 2: the cell steps aside; the starch curve over a day and a night (Graf et al. 2010, redrawn) draws on, and
// the cell's granule grows and shrinks with it. Beat 3: the early night (after 8 h): the second curve. Beat 4: back on
// v7, RuBisCO's arc lights; a CO₂ and an O₂ come in, and the O₂ reaches it. Story pieces: cb4-common.ts.
import type { Axes } from '../figs/cb-common';
import { GRAF_CTRL } from '../figs/cb-common';
import {
  bridgeItems, cellItems, CR_GRAFR, grafFx, grafGraph, granuleFx, granuleItems, hourAt, rubiscoLit, slideC4, starchAt,
} from './cb4-common';
import { build, credit, figOnStage, hide, type Item, type Key, onFig, shadowDef, show, textK, textScaler, win } from './cb-kit';

const P = 'cb4a';
const D = [4.0, 3.6, 2.9, 3.6];
const S = [0, 4.0, 7.6, 10.5];
const EXIT = onFig([470, 476]);
const ASIDE = { x: 1428, y: 370, s: 0.7 };
const cam: Key[] = [
  { x: 800, y: 370, s: 1 }, { at: 0.05, d: 0.75, x: EXIT[0], y: EXIT[1], s: 1.9 }, { at: 0.8, d: 0.01, x: 800, y: 370, s: 1.9 },
  { at: 0.82, d: 0.55, s: 1 }, { at: S[1] + 0.05, d: 1.0, ...ASIDE }, { at: S[3] + 0.05, d: 1.0, x: 800, y: 370, s: 1 },
];
const v7: Item = { k: 'v7', svg: figOnStage(slideC4(`${P}w`, 'v7')), keys: [{ o: 1 }, hide(0.55, 0.25), show(S[3] + 0.25, 0.5)] };
const v5: Item = { k: 'v5', svg: figOnStage(slideC4(`${P}c`, 'v5')), keys: [{ o: 0 }, show(0.8, 0.01), hide(S[3] + 0.25, 0.5)] };
const gran = granuleItems(`${P}g`, onFig, 1.07).map(it => ({ ...it, keys: [{ ...it.keys[0], o: 0 }, show(0.8, 0.01), hide(S[3] + 0.25, 0.5)] }));
const A4: Axes = { x0: 1010, y0: 180, w: 520, h: 360, xr: [0, 28], yr: [0, 8] };
const gr: Item = { k: 'graph', layer: 'hud', svg: grafGraph(`${P}k`, A4), keys: [{ o: 0 }, show(S[1] + 0.8, 0.3), hide(S[3], 0.3)] };
const grCr: Item = { k: 'graph-cr', layer: 'hud', svg: credit(CR_GRAFR, 'end'), keys: [{ x: 1580, y: 724, o: 0 }, show(S[1] + 0.8, 0.3), hide(S[3], 0.3)] };
const lit: Item = { k: 'lit', svg: figOnStage(rubiscoLit(`${P}r`), false), keys: [{ o: 0 }, show(S[3] + 0.9, 0.3)] };

const T0 = S[1] + 1.25;
/** The granule's size: grows by day in beat 1, then follows the curve (0 at dawn, 1 at the peak of 6.7 mg g⁻¹). */
const grow = (G: number): number => G < S[1] ? 0.3 + 0.32 * win(G, 1.6, 3.6) : G < T0 ? 0.62 + (0.022 - 0.62) * win(G, S[1], S[1] + 0.9) : starchAt(GRAF_CTRL, hourAt(G, T0)) / 6.7;

let scalers: Array<(k: number) => void> = [];
const curves = grafFx(`${P}k`, A4, T0, S[2] + 0.1), granule = granuleFx(`${P}g`, grow);
export const STAGING = build({
  id: 'a',
  name: 'A · Into the cell and back',
  note: 'Slide C4’s v7: the camera dives into the exit and comes up in the cell (v5), where triose phosphate leaves and starch grows; the starch curve draws beside it, the granule in step; back on v7 for RuBisCO and O₂.',
  D,
  holds: [[0, 1.45], [1.15], [], []],
  defs: shadowDef(P),
  items: [v7, v5, ...gran, ...cellItems(`${P}m`, onFig, 1.07, 1.6), gr, grCr, lit, ...bridgeItems(`${P}b`, onFig, 1.07, S[3] + 1.25)],
  cam,
  init(api) { scalers = [textScaler(api.q('v7')), textScaler(api.q('v5'))]; },
  fx(G, api) {
    const k = textK(api.cam.s);
    scalers.forEach(f => f(k));
    curves(G, api);
    granule(G, api);
  },
});
