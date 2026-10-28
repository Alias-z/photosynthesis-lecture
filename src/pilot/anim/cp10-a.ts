// The CO₂ diffusion pathway, staging A: one camera along the slide's drawn path (C10 v2). Beat 1: the whole path, each
// conductance flashing in turn, one CO₂ marked in the outside air; beat 2: zoom on the boundary layer (lit), wind thins it
// and the CO₂ reaches the surface (C_s up); beat 3: on to the stoma (lit, as C10 v11), the CO₂ passes the pore, Brown's
// portrait and the 1900 clipping appear; beat 4: water vapour streams out of the same pore; beat 5: on to the mesophyll
// (lit, as C10 v12) with the tobacco TEM, the CO₂ slows once it is in water and reaches RuBisCO; beat 6: back out to the
// whole slide figure, the stomata close, Cᵢ and C_c fall, and the question. The tour engine: cp10-common.ts.
import brownPng from '../../assets/anim/cp10/brown.png';
import bePng from '../../assets/anim/cp10/be1900-catalpa.png';
import clcJpg from '../../assets/photos/cp-clarke-c.jpg';
import { clipping, photo, portrait } from './cp-stage';
import { countPill, slowPill, TR, tourStaging } from './cp10-common';

/** The Brown & Escombe card: Brown's halftone portrait (no portrait of Escombe was found) and the 1900 clipping. */
export const brownCards = (P: string): string =>
  `${portrait(P, 'pbr', brownPng, 878, 26, 186, 'Horace Brown', '1900', -2)}
  ${clipping(P, 'cbe', bePng, 878, 352, 652, 522 / 1042, { rot: 1.2, seed: 41, under: 'Brown & Escombe 1900, Phil. Trans. R. Soc. B 193: 223, 226' })}`;
export const temCard = (P: string, x = 44, y = 448, w = 200): string =>
  photo(P, 'tem', clcJpg, 267, 319, x, y, w, (w * 319) / 267, { label: 'tobacco, TEM', credit: 'Clarke et al. 2021, Interface Focus, Fig. 1c, CC BY 4.0', creditStart: true, back: true });

export const STAGING = tourStaging({
  id: 'a',
  name: 'A · Along the slide figure',
  note: 'C10 v2: zoom on each conductance in turn with the slide’s lit sets (boundary layer, stomata = v11, mesophyll = v12), one CO₂ walking the path; Brown & Escombe 1900 at the stoma; back out, the stomata close.',
  P: 'cp10a',
  cam: ['full', 'bl', 'st', 'st', 'me', 'full'],
  lit: ['all', 'bl', 'st', 'st', 'me', 'all'],
  tracer: [TR.air, TR.surface, TR.pore, TR.space, TR.rubisco, null],
  ev: { brackets: 0, wind: 1, water: 3, slow: 4, close: 5 },
  cards: [[], [], ['pbr', 'cbe'], ['cnt'], ['tem', 'slow'], []],
  cardsSvg: P => `${brownCards(P)}${temCard(P)}${countPill()}${slowPill()}`,
});
