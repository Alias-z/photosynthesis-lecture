// 'lf12', staging c4m2b · c4m2 polished (lecturer, 30 Oct 2026, later: "show that they concentrate it inside, but you
// don't need to show it 10 times … on the right side, just show that they can concentrate it 10 times more"). C4M2B.
// - The 2-compartment frame of c4m2: the mesophyll cell washed green, the bundle-sheath cell amber, both named big.
// - Beats 1–4: ONE pump cycle, slowly, per 1 CO₂ (lf12m): CO₂ → HCO₃⁻ → PEPC → C₄ acid in the mesophyll; across into
//   the bundle sheath, NADP-ME releases the CO₂ at RuBisCO; pyruvate back to PPDK with 1 ATP (2 ATP equivalents).
// - Beat 5: the bundle sheath fills in one smooth step (2.6 s): 7 CO₂ fade in together round RuBisCO and a soft glow
//   rises; "CO₂ concentrated" in the cell (hold); then the ledger's line "CO₂ in the bundle sheath: ≈ 10 × the air".
//   No count: 7 molecules stand for "many", not for a ratio.
// - Beat 6: c4m2's C₃ vs C₄ comparison side by side; the pills say "about 1 in 4 recaptured, the rest leaks away" and
//   "CO₂ in the bundle sheath ≈ 10 × the air". The CAM question.
// Physiology: bundle-sheath CO₂ up to ≈ 10 × air (von Caemmerer & Furbank 2003, Photosynth. Res. 77:191–207, DOI
// checked on Crossref 30 Oct 2026); ≈ 20–30 % of the pumped CO₂ leaks back; 2 extra ATP per CO₂.
import { SPOT, type LPart } from '../figs/leaf-schema';
import { LF12 } from './beats-lf';
import { CITES, FD } from './c4-b';
import {
  CMP_STEPS, LEAF_ACTORS, LEDGER, STYLE, W, cmpBind, cmpFrame, cmpSvg, cmpTimes, crowdSvg, hideZoneNames, leafBeats, namesSvg, CAM,
} from './c4-m1';
import { ease, flash, glide, makeLeafStaging, panelShow, panelSvg, type Api, type Row, type V } from './lf-common';
import type { Beat, Cite, Staging } from './types';

/* ---------------------------------------------------------------- captions */

const { BUSCH13, FURB11 } = CITES;
/** von Caemmerer & Furbank 2003, "The C4 pathway: an efficient CO2 pump", Photosynth. Res. 77:191–207 (Crossref). */
const VCF03: Cite = { label: 'von Caemmerer & Furbank 2003, Photosynth. Res.', url: 'https://doi.org/10.1023/A:1025830019591' };
export const C4M2B: Beat[] = [
  { ...LF12[0], tag: 'Mesophyll cell: CO₂ to bicarbonate' },
  { ...LF12[1], tag: 'Mesophyll cell: PEP carboxylase' },
  { tag: 'Bundle-sheath cell: CO₂ released', say: 'The C₄ acid moves through the plasmodesmata into the bundle-sheath cell. In maize, NADP-malic enzyme (NADP-ME) releases its CO₂ in the bundle-sheath chloroplast, right at RuBisCO, which fixes it.', cite: [FURB11] },
  { ...LF12[3], tag: 'Back to PEP in the mesophyll' },
  {
    tag: 'The bundle sheath fills', say: '', cite: [VCF03, FURB11],
    steps: [
      { tag: 'The bundle sheath fills', say: 'The pump runs all the time: the C₄ acids deliver CO₂ into the bundle sheath faster than RuBisCO fixes it. CO₂ builds up round RuBisCO.' },
      { tag: 'About 10 × the air', say: 'In the bundle sheath CO₂ reaches up to about 10 times the concentration in air, so RuBisCO there hardly takes up O₂. The price is 2 extra ATP per CO₂.' },
    ],
  },
  { tag: 'C₃ and C₄ leaves', say: '', cite: [BUSCH13, VCF03], steps: CMP_STEPS },
];

/* ---------------------------------------------------------------- the crowd (stage px → panorama) */

const S = SPOT;
const toPano = (q: V): V => [(q[0] - CAM.at[0]) / CAM.s + CAM.c[0], (q[1] - CAM.at[1]) / CAM.s + CAM.c[1]];
/** 7 CO₂ at 0.58 × (45 × 14 stage px each) in 3 staggered rows between the NADP-ME label (ends y 337) and RuBisCO
 *  (starts y 417), inside the chloroplast (x 740–880). */
const SC = 0.58;
const CROWD: V[] = ([[790, 352], [835, 352], [767, 374], [812, 374], [857, 374], [790, 396], [835, 396]] as V[]).map(toPano);
/** The glow under the crowd (panorama). */
const GLOW: V = toPano([812, 374]);

/* ---------------------------------------------------------------- the ledger: c4m1's rows and the 10 × line */

const nk = (k: string, s: string): string => `<tspan data-k="${k}">${s}</tspan>`;
const ROWS: Row[] = [
  { k: 'r0', h: 36, html: 'per 1 CO₂', cls: 'dk-ph' },
  { k: 'r1', h: 36, html: '<tspan class="lfa-e">CA:</tspan> CO₂ + H₂O → HCO₃⁻ + H⁺' },
  { k: 'r2', h: 36, html: '<tspan class="lfa-e">PEPC:</tspan> HCO₃⁻ + PEP → C₄ acid + Pᵢ' },
  { k: 'r2c', h: 32, html: '1 C + 3 C = 4 C', cls: 'dk-pc' },
  { k: 'r3', h: 36, html: '<tspan class="lfa-e">NADP-ME:</tspan> C₄ acid → CO₂ + pyruvate' },
  { k: 'r3c', h: 32, html: '4 C = 1 C + 3 C', cls: 'dk-pc' },
  { k: 'r4', h: 36, html: '<tspan class="lfa-e">PPDK:</tspan> pyruvate + ATP + Pᵢ → PEP + AMP + PPᵢ' },
  { k: 'r4c', h: 32, html: `ATP → AMP: ${nk('n-atp', '2')} ATP equivalents`, cls: 'dk-pc' },
  { k: 'r5', h: 40, html: 'C₄: 5 ATP + 2 NADPH per CO₂', cls: 'lfa-sum' },
  { k: 'r6', h: 36, html: 'C₃: 3 ATP + 2 NADPH per CO₂', cls: 'dk-pc' },
  { k: 'r7', h: 48, html: 'CO₂ in the bundle sheath: ≈ 10 × the air', cls: 'lfa-sum' },
];

/* ---------------------------------------------------------------- the script */

/** Beat 4: the lit parts and PEP/AMP cross-fade, the crowd fades in with the glow rising (1.0–3.6 s), the label (hold),
 *  then the ledger line. */
const B4 = { crowd: 1.0, glow: 1.2, glowE: 3.6, conc: 3.7, hold: 4.7, row: 4.9 } as const;
const CMP = cmpTimes(0.2);

function frame(a: Api, beat: number, t: number): void {
  leafBeats(a, beat, t);
  if (beat === 2) {
    if (t > 3.7) a.put('co2b', glide(W.CO2_ME, t, 3.8, 5.2), ease(t, 3.7, 3.9) * (1 - ease(t, 5.4, 6.2)));
    a.op('co2b-l', ease(t, 4.5, 4.9));
    flash(a, t, 5.5, S.bsRub, 'fl2');
  }
  if (beat === 4) {
    const o = 1 - ease(t, 0.1, 0.9);
    if (o > 0.004) { a.put('pepN', S.pep, o); a.put('amp', S.amp, o); }
  }
  const crowd = beat === 4 ? ease(t, B4.crowd, B4.crowd + 1.2) : beat === 5 ? 1 : 0;
  CROWD.forEach((q, i) => { if (crowd > 0.004) a.put(`cw${i}`, q, crowd, SC); });
  a.op('bsglow', beat === 4 ? 0.85 * ease(t, B4.glow, B4.glowE) : beat === 5 ? 0.85 : 0);
  a.op('conc', beat === 4 ? ease(t, B4.conc, B4.conc + FD + 0.1) : beat === 5 ? 1 : 0);
  a.op('cnt', 0);
  const v = (b: number, t0: number, d = 0.4): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + d) : 0);
  panelShow(a, 'panel', ROWS, { r0: v(0, 0.2), r1: v(0, 5.0), r2: v(1, 2.1), r2c: v(1, 2.6), r3: v(2, 3.7), r3c: v(2, 4.2), r4: v(3, 3.9), r4c: v(3, 4.4), r5: v(3, 5.6), r6: v(3, 6.0), r7: v(4, B4.row, FD + 0.1) });
  // the last beat: the leaf, its names and the ledger fade out, the comparison comes in
  const out = beat === 5 ? 1 - ease(t, CMP.out, CMP.out + 1.0) : 1;
  a.op('nm', out); a.op('cam', out); a.op('panel', out);
  if (beat === 5) a.op('conc', out);
  cmpFrame(a, beat === 5, t, CMP);
  // one meaning per face, deck-wide (lecturer, lecture day): the crowd trapped round RuBisCO is strained and sweating
  // (cmpFrame); none leaks out ("do not put any CO₂ outside the bundle sheath")
}

const LIT: LPart[][] = [
  ['stoma', 'c4-co2', 'ca'],
  ['ca', 'hco3', 'pepc'],
  ['pepc', 'c4acid', 'bs-cp', 'me', 'me-co2', 'bs-rub'],
  ['m-cp', 'pyr', 'ppdk', 'atp', 'pep', 'pepc', 'me', 'bs-cp', 'bs-rub'],
  ['m-cp', 'pepc', 'c4acid', 'me', 'bs-cp', 'bs-rub'],
  ['m-cp', 'pepc', 'c4acid', 'me', 'bs-cp', 'bs-rub'],
];

/** The 2 compartments' washes, on the drawing's cytosol (mesophyll green, bundle sheath amber). */
function tint(stage: SVGSVGElement): void {
  stage.querySelectorAll<SVGPathElement>('.dk-dim path.lf-cyt').forEach(el => { el.style.fill = el.classList.contains('lf-cyt-bs') ? '#f6e7c6' : '#e3eed8'; });
}
/** The comparison's pills say it plainly; the C₃ one on 2 lines, clear of its magnifier. */
function plainPills(stage: SVGSVGElement): void {
  const el = stage.querySelector('[data-k="c4x-p4t"]'); if (el) el.textContent = 'C₄: CO₂ in the bundle sheath ≈ 10 × the air';
}
/** A 2-line pill (its rounded box fitted to the longer line), centred at c unless that crosses x 1588. */
function twoLinePill(stage: SVGSVGElement, key: string, c: V, lines: [string, string]): void {
  const tx = stage.querySelector(`[data-k="${key}t"]`) as SVGTextElement | null, r = stage.querySelector(`[data-k="${key}r"]`);
  if (!tx || !r) return;
  tx.textContent = '';
  lines.forEach((s, i) => {
    const ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    ts.setAttribute('x', String(c[0])); ts.setAttribute('y', String(c[1] - 3 + i * 19)); ts.textContent = s; tx.appendChild(ts);
  });
  const w = tx.getBBox().width + 30, x = Math.min(c[0] - w / 2, 1588 - w);
  tx.querySelectorAll('tspan').forEach(ts => ts.setAttribute('x', String(x + w / 2)));
  for (const [a, v] of [['x', x], ['width', w], ['y', c[1] - 24], ['height', 48], ['rx', 18]] as Array<[string, number]>) r.setAttribute(a, String(v));
}
// side by side, 1.1 × c4b's size: each panel 691 × 332, from x 97 and y 120 (as c4m2)
const K = 1.1, X0 = 97, Y0 = 120, GAP = 24, PW = 628 * K;
const tf = (x: number, y: number, ox: number, oy: number): string => `translate(${(x - ox * K).toFixed(1)} ${(y - oy * K).toFixed(1)}) scale(${K})`;

const BASE = makeLeafStaging({
  id: 'c4m2b',
  name: 'C₄ · one pump cycle, then the bundle sheath full of CO₂ (≈ 10 × the air)',
  note: 'The 2 washed, named compartments; ONE slow cycle per 1 CO₂ (CA, PEPC, C₄ acid across, NADP-ME releases CO₂ at RuBisCO, pyruvate back to PPDK); then in one 2.6 s step 7 CO₂ fade in together round RuBisCO with a soft glow, “CO₂ concentrated”, and the ledger line “CO₂ in the bundle sheath: ≈ 10 × the air”; then C₃ vs C₄ on the micrographs side by side with plain pills; the CAM question',
  beats: C4M2B,
  holds: [[], [], [], [], [B4.hold], [CMP.h1, CMP.h2]],
  leaf: { hide: ['m-rub', 'm-perox', 'm-mito'] },
  actors: LEAF_ACTORS,
  world: p => `<radialGradient id="${p}-bsg"><stop offset="0" stop-color="#f6c453" stop-opacity=".75"/><stop offset=".55" stop-color="#f6c453" stop-opacity=".4"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
    <g data-k="bsglow" display="none"><ellipse cx="${GLOW[0].toFixed(1)}" cy="${GLOW[1].toFixed(1)}" rx="70" ry="52" style="fill:url(#${p}-bsg);stroke:none"/></g>`,
  hud: () => `${STYLE}${namesSvg(34)}${crowdSvg()}${panelSvg('panel', LEDGER.x, LEDGER.y, LEDGER.w, ROWS)}${cmpSvg(tf(X0, Y0, 966, 4), tf(X0 + PW + GAP, Y0, 966, 314))}`,
  cam: CAM,
  lit: LIT,
  frame,
});

export const STAGING: Staging = {
  ...BASE,
  bind(stage) {
    const draw = BASE.bind(stage);
    hideZoneNames(stage); tint(stage);
    // in the cell, only "CO₂ concentrated": the number is the ledger's
    stage.querySelectorAll('[data-k="conc"] text')[1]?.remove();
    plainPills(stage); cmpBind(stage);
    twoLinePill(stage, 'c4x-p3', [1458, 278], ['C₃: about 1 in 4 recaptured,', 'the rest leaks away']);
    return draw;
  },
  keys: [
    { beat: 5, text: 'What if one cell did both steps,', x: 800, y: 530, size: 44 },
    { beat: 5, text: 'at different times?', x: 800, y: 578, size: 44 },
  ],
};
