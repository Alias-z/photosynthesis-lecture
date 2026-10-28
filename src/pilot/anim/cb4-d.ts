// C4 animation, staging D · "Day and night side by side". Slide C4's figure v6 (the same cell by day and by night)
// carries beats 1–2: by day (night panel veiled) a triose phosphate becomes sucrose and the starch granule grows; then
// the night panel opens and its granule shrinks from the day's size to the night's while its sugars leave as sucrose.
// Beat 3: Graf et al.'s graph redrawn, the early-night curve drawing on (slide figure v2). Beat 4: slide figure v7,
// RuBisCO's arc lit, a CO₂ and an O₂ coming in. Story pieces: cb4-common.ts.
import type { Axes } from '../figs/cb-common';
import { bridgeItems, grafFx, grafGraph, granuleFx, granuleItems, rubiscoLit, slideC4, tpTok } from './cb4-common';
import { build, f1, figOnStage, FIG_O, FIG_S, hide, type Item, onFig, shadowDef, show, type V, win } from './cb-kit';

const P = 'cb4d';
const D = [2.8, 2.8, 3.0, 3.6];
const S = [0, 2.8, 5.6, 8.6];
const xy = (q: V): { x: number; y: number } => ({ x: q[0], y: q[1] });

// beats 1–2: v6, panels at x 12 (day, centre 202) and 408 (night, centre 598)
const v6: Item = { k: 'v6', svg: figOnStage(slideC4(`${P}s`, 'v6')), keys: [{ o: 1 }, hide(S[2], 0.3)] };
const veilC = onFig([598, 315]);
const veil: Item = { k: 'veil', svg: `<rect class="cbk-veil" x="${f1(-190 * FIG_S)}" y="${f1(-245 * FIG_S)}" width="${f1(380 * FIG_S)}" height="${f1(490 * FIG_S)}" rx="${f1(24 * FIG_S)}"/>`, keys: [{ ...xy(veilC), o: 1 }, hide(S[1] + 0.05, 0.35)] };
const dayG = granuleItems(`${P}a`, onFig, FIG_S, [232, 346], 62, 36).map(it => ({ ...it, keys: [...it.keys, hide(S[2], 0.3)] }));
const nightG = granuleItems(`${P}b`, onFig, FIG_S, [598, 316], 34, 20).map(it => ({ ...it, keys: [...it.keys, hide(S[2], 0.3)] }));
const dayScale = (G: number): number => 0.25 + 0.75 * win(G, 0.4, 2.4);
const nightScale = (G: number): number => (62 / 34) + (1 - 62 / 34) * win(G, S[1] + 0.5, S[1] + 2.3);
// by day: a triose phosphate down the day arrow to sucrose; by night: sugars from the granule out to sucrose
const dayPath = (u: number): V => onFig(u < 0.6 ? [192 + (372 - 192) * (u / 0.6), 252] : [372, 252 + (480 - 252) * ((u - 0.6) / 0.4)]);
const nightPath = (u: number): V => onFig(u < 0.55 ? [638 + (768 - 638) * (u / 0.55), 316] : [768, 316 + (480 - 316) * ((u - 0.55) / 0.45)]);
const movers: Item[] = [
  { k: 'tp', svg: tpTok(1.0 * FIG_S), keys: [{ ...xy(dayPath(0)), o: 0 }, show(0.4, 0.15), { at: 0.4, d: 1.6, path: dayPath }, hide(2.0, 0.2)] },
  { k: 'sug', svg: `<circle class="cbk-tok-rust" r="${f1(9 * FIG_S)}"/>`, keys: [{ ...xy(nightPath(0)), o: 0 }, show(S[1] + 0.7, 0.15), { at: S[1] + 0.7, d: 1.5, path: nightPath }, hide(S[1] + 2.2, 0.2)] },
];

// beat 3: v2 built up (the slide card while the figure itself is not shown)
const A2: Axes = { x0: 110, y0: 84, w: 620, h: 360, xr: [0, 28], yr: [0, 8] };
const onCard = (inner: string): string => `<g transform="matrix(${FIG_S},0,0,${FIG_S},${FIG_O[0].toFixed(2)},${FIG_O[1].toFixed(2)})">${inner}</g>`;
const card: Item = { k: 'card', svg: figOnStage(''), keys: [{ o: 0 }, show(S[2], 0.3), hide(S[2] + 2.7, 0.3)] };
const g2: Item = { k: 'g2', svg: onCard(grafGraph(`${P}e`, A2)), keys: [{ o: 0 }, show(S[2] + 0.05, 0.3), hide(S[2] + 2.85, 0.25)] };
const v2: Item = { k: 'v2', svg: figOnStage(slideC4(`${P}r`, 'v2')), keys: [{ o: 0 }, show(S[2] + 2.7, 0.3), hide(S[3], 0.3)] };
// beat 4
const v7: Item = { k: 'v7', svg: figOnStage(slideC4(`${P}w`, 'v7')), keys: [{ o: 0 }, show(S[3] + 0.2, 0.45)] };
const lit: Item = { k: 'lit', svg: figOnStage(rubiscoLit(`${P}l`), false), keys: [{ o: 0 }, show(S[3] + 0.8, 0.3)] };

const gd = granuleFx(`${P}a`, dayScale), gn = granuleFx(`${P}b`, nightScale), c2 = grafFx(`${P}e`, A2, S[2] - 5, S[2] + 0.2);
export const STAGING = build({
  id: 'd',
  name: 'D · Day and night side by side',
  note: 'Slide C4’s day/night figure (v6): by day the granule grows and sucrose leaves; the night panel opens and its granule shrinks from the day’s size; then the early night (v2) and v7 for RuBisCO and O₂.',
  D,
  holds: [[0], [], [], []],
  defs: shadowDef(P),
  items: [v6, ...dayG, ...nightG, veil, ...movers, card, g2, v2, v7, lit, ...bridgeItems(`${P}x`, onFig, 1.07, S[3] + 1.1)],
  fx(G, api) { gd(G, api); gn(G, api); c2(G, api); },
});
