// 'lf12', staging c4m2 · c4m1's story with the 2 compartments as the frame (lecturer, 29 Oct 2026: "the key is to show
// the two compartments … a lot of CO₂ getting pumped and concentrated … inside the bundle-sheath cell"). Captions: C4M2.
// - The leaf section split in 2 washes: the mesophyll cell green, the bundle-sheath cell amber, both named big in ink.
// - Beats 1–4: lf12m per 1 CO₂; CO₂ 1 stays by bundle-sheath RuBisCO and the count beside it starts at 1.
// - Beats 5–6: the pump keeps running. Each cycle, in the mesophyll: HCO₃⁻ to PEPC → C₄ acid; in the bundle sheath: the
//   C₄ acid releases its CO₂, which joins the crowd round RuBisCO; the count rises 1 → 4 → 10, one moving at a time;
//   then "CO₂ concentrated (≈ 10 × the air)".
// - Beat 7: c4m1's C₃ vs C₄ comparison on the real micrographs, the 2 panels side by side; the CAM question.
import type { LPart } from '../figs/leaf-schema';
import { SPOT } from '../figs/leaf-schema';
import { LF12 } from './beats-lf';
import { CITES, FD } from './c4-b';
import {
  CMP_BEAT, CW_N, CW_SC, LEAF_ACTORS, LEDGER, ROWS, STYLE, cmpBind, cmpFrame, cmpSvg, cmpTimes, crowdSvg, cwWay, drawCycles,
  hideZoneNames, holdCrowd, leafBeats, namesSvg, plan, CAM,
} from './c4-m1';
import { ease, flash, glide, makeLeafStaging, panelShow, panelSvg, type Api } from './lf-common';
import type { Beat, Staging } from './types';

const { VCF03, FURB11 } = CITES;
export const C4M2: Beat[] = [
  { ...LF12[0], tag: 'Mesophyll cell: CO₂ to bicarbonate' },
  { ...LF12[1], tag: 'Mesophyll cell: PEP carboxylase' },
  { tag: 'Bundle-sheath cell: CO₂ released', say: 'The C₄ acid moves through the plasmodesmata into the bundle-sheath cell. In maize, NADP-malic enzyme (NADP-ME) releases its CO₂ in the bundle-sheath chloroplast, next to RuBisCO: 1 CO₂ there.', cite: [FURB11] },
  { ...LF12[3], tag: 'Back to PEP in the mesophyll' },
  { tag: 'The pump keeps running', say: 'In the mesophyll cell, each new CO₂ comes in as bicarbonate and PEPC turns it into a C₄ acid. In the bundle-sheath cell, each C₄ acid releases its CO₂ next to RuBisCO, and the CO₂ there adds up.', cite: [FURB11] },
  { tag: 'CO₂ concentrated', say: 'CO₂ is released faster than RuBisCO fixes it or it leaks out: in the bundle sheath it rises to about 10 times the concentration in air, so RuBisCO there hardly takes up O₂.', cite: [VCF03, FURB11] },
  CMP_BEAT,
];

const S = SPOT;
const CY4 = plan(0.3, [{ gh: 0.8, ga: 1.4 }, { gh: 0.8, ga: 1.4 }, { gh: 0.8, ga: 1.4 }], true);
const CY5 = plan(0.3, Array.from({ length: 6 }, () => ({ gh: 0.5, ga: 0.9 })), true);
const CONC = CY5.end + 0.2;
const CMP = cmpTimes(0.2);
/** CO₂ 1 in beat 2: from NADP-ME to the first place by RuBisCO. */
const R2 = 3.8;

function frame(a: Api, beat: number, t: number): void {
  leafBeats(a, beat, t);
  let n = 0;
  if (beat === 2) {
    if (t > 3.7) a.put('cw0', glide(cwWay(0), t, R2, R2 + FD), ease(t, 3.7, 3.7 + FD), CW_SC);
    flash(a, t, R2 + FD, S.bsRub, 'fl2');
    n = t >= R2 + 0.75 * FD ? 1 : 0;
  }
  if (beat === 3) { holdCrowd(a, 1); n = 1; }
  if (beat >= 4) {
    const o = beat === 4 ? 1 - ease(t, 0.2, 1.0) : 0;
    if (o > 0.004) { a.put('pepN', S.pep, o); a.put('amp', S.amp, o); }
  }
  if (beat === 4) { holdCrowd(a, 1); n = 1 + drawCycles(a, t, CY4.cy, 1, true); }
  if (beat === 5) { holdCrowd(a, 4); n = 4 + drawCycles(a, t, CY5.cy, 4, true); }
  if (beat === 6) { holdCrowd(a, CW_N); n = CW_N; }
  a.op('cnt', n > 0 ? 1 : 0);
  a.txt('cnt-t', `${n} CO₂`);
  a.op('conc', beat === 5 ? ease(t, CONC, CONC + FD + 0.1) : beat === 6 ? 1 : 0);
  const v = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.4) : 0);
  panelShow(a, 'panel', ROWS, { r0: v(0, 0.2), r1: v(0, 5.0), r2: v(1, 2.1), r2c: v(1, 2.6), r3: v(2, 3.7), r3c: v(2, 4.2), r4: v(3, 3.9), r4c: v(3, 4.4), r5: v(3, 5.6), r6: v(3, 6.0) });
  const out = beat === 6 ? 1 - ease(t, CMP.out, CMP.out + 1.0) : 1;
  a.op('nm', out); a.op('cam', out); a.op('panel', out);
  if (beat === 6) { a.op('cnt', out); a.op('conc', out); }
  cmpFrame(a, beat === 6, t, CMP);
}

const PUMP: LPart[] = ['m-cp', 'pepc', 'c4acid', 'me', 'bs-cp', 'bs-rub'];
const LIT: LPart[][] = [
  ['stoma', 'c4-co2', 'ca'],
  ['ca', 'hco3', 'pepc'],
  ['pepc', 'c4acid', 'bs-cp', 'me', 'me-co2', 'bs-rub'],
  ['m-cp', 'pyr', 'ppdk', 'atp', 'pep', 'pepc', 'me', 'bs-cp', 'bs-rub'],
  PUMP, PUMP, PUMP,
];

/** The 2 compartments' washes, on the drawing's cytosol (mesophyll green, bundle sheath amber). */
function tint(stage: SVGSVGElement): void {
  stage.querySelectorAll<SVGPathElement>('.dk-dim path.lf-cyt').forEach(el => { el.style.fill = el.classList.contains('lf-cyt-bs') ? '#f6e7c6' : '#e3eed8'; });
}
// side by side, 1.1 × c4b's size: each panel 691 × 332, from x 97 and y 120
const SC = 1.1, X0 = 97, Y0 = 120, GAP = 24, PW = 628 * SC;
const tf = (x: number, y: number, ox: number, oy: number): string => `translate(${(x - ox * SC).toFixed(1)} ${(y - oy * SC).toFixed(1)}) scale(${SC})`;

const BASE = makeLeafStaging({
  id: 'c4m2',
  name: 'c4m2 · the 2 compartments as the frame: bicarbonate → C₄ acid in the mesophyll, a CO₂ count rising in the bundle sheath',
  note: 'The leaf split in 2 washes (mesophyll green, bundle sheath amber), named big; lf12m per 1 CO₂, CO₂ 1 kept by RuBisCO (count 1); then the pump: each cycle HCO₃⁻ → C₄ acid in the mesophyll, CO₂ released in the bundle sheath, the count 1 → 4 → 10, “CO₂ concentrated (≈ 10 × the air)”; then C₃ vs C₄ on the micrographs side by side; the CAM question',
  beats: C4M2,
  holds: [[], [], [], [], [], [], [CMP.h1, CMP.h2]],
  leaf: { hide: ['m-rub', 'm-perox', 'm-mito'] },
  actors: LEAF_ACTORS,
  hud: () => `${STYLE}${namesSvg(34)}${crowdSvg()}${panelSvg('panel', LEDGER.x, LEDGER.y, LEDGER.w, ROWS)}${cmpSvg(tf(X0, Y0, 966, 4), tf(X0 + PW + GAP, Y0, 966, 314))}`,
  cam: CAM,
  lit: LIT,
  frame,
});

export const STAGING: Staging = {
  ...BASE,
  bind(stage) { const draw = BASE.bind(stage); hideZoneNames(stage); tint(stage); cmpBind(stage); return draw; },
  keys: [
    { beat: 6, text: 'What if one cell did both steps,', x: 800, y: 530, size: 44 },
    { beat: 6, text: 'at different times?', x: 800, y: 578, size: 44 },
  ],
};
