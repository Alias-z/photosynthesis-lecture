// The CO₂ diffusion pathway, staging B: history first, each story landing on its part of the slide's drawn path (C10 v2).
// Beat 1: the whole path, the conductances flash in turn; beat 2: Brown & Escombe 1900 (portrait and clipping) at the
// stoma, lit as C10 v11, the CO₂ passes the pore; beat 3: the slide's Gaastra figure (C10 v6: Fig. 21, turnip, stomatal
// resistance against light with the mesophyll and outside-air resistances in columns) over the stage while the camera
// moves to the mesophyll behind it; beat 4: today,
// a micro-CT of wheat air spaces and a TEM of a tobacco cell wall beside the mesophyll, the CO₂ slows in water and reaches
// RuBisCO; beat 5: back out, the stomata close, and the question. The tour engine: cp10-common.ts.
import ctPng from '../../assets/photos/cp-lundgren-block.png';
import { CP10_B } from './beats-cp';
import { brownCards, temCard } from './cp10-a';
import { draw as c10 } from '../figs/cp10';
import { cardSvg, figInner, photo, view } from './cp-stage';
import { slowPill, TR, tourStaging } from './cp10-common';

/** The slide's Gaastra figure (C10 v6), shown whole while the camera moves to the mesophyll behind it. */
const G21V = view(1.0, [400, 300], [630, 370]);

export const STAGING = tourStaging({
  id: 'b',
  name: 'B · History first (1900 → 1959 → today)',
  note: 'C10 v2 with three stories on their parts: Brown & Escombe 1900 at the stoma, Gaastra 1959 (Fig. 21, three resistances) at the mesophyll, micro-CT and TEM today; back out, the stomata close.',
  beats: CP10_B,
  P: 'cp10b',
  cam: ['full', 'st', 'me', 'me', 'full'],
  lit: ['all', 'st', 'me', 'me', 'all'],
  tracer: [TR.air, TR.pore, TR.space, TR.rubisco, null],
  ev: { brackets: 0, slow: 3, close: 4 },
  cards: [[], ['pbr', 'cbe'], ['g21'], ['ct', 'tem', 'slow'], []],
  cardsSvg: P => `${brownCards(P)}
    <g data-k="g21" opacity="0"><rect class="cps-veil" x="0" y="0" width="1600" height="740"/>
      <g class="fig" transform="matrix(${G21V.s},0,0,${G21V.s},${G21V.t[0]},${G21V.t[1]})">${cardSvg(`${P}g21`)}${figInner(c10('v6'), 'cp10v6', `${P}v6`)}</g></g>
    ${photo(P, 'ct', ctPng, 460, 385, 44, 66, 300, 251, { label: 'air spaces (yellow), wheat, micro-CT', credit: 'Lundgren et al. 2019, Nat. Commun., Fig. 2a, CC BY 4.0', creditStart: true, back: true })}
    ${temCard(P)}${slowPill()}`,
});
