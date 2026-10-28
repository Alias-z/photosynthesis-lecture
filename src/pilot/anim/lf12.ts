// 'lf12', staging m · C₄ in the leaf section (slide C12; beats-lf.ts LF12). One fixed framing of the whole leaf, the
// ledger on the right. Per 1 CO₂, every molecule numbered and from a visible source:
// - Beat 1: CO₂ 1 (air) and PEP 1 (beside PEPC) are drawn first; CO₂ 1 glides through the stoma to CA; water joins,
//   HCO₃⁻ 1 leaves and H⁺ goes into the cytosol.
// - Beat 2: HCO₃⁻ 1 and PEP 1 meet in PEPC → C₄ acid 1 (4 C) and Pᵢ.
// - Beat 3: C₄ acid 1 through the plasmodesmata into the bundle-sheath chloroplast → NADP-ME → CO₂ 1 to RuBisCO
//   (fixed) and pyruvate 1.
// - Beat 4: pyruvate 1 back to the mesophyll chloroplast; ATP 1 from the thylakoids; PPDK → PEP 1 (back at the start)
//   and AMP; the ledger adds 2 ATP equivalents and the totals per CO₂.
// - Beat 5: the conditions strip over the dimmed leaf, tropical lit.
import { C4, climateSvg, hco3G, h2oG, PORE, SPOT, type LPart } from '../figs/leaf-schema';
import { hring, tagG } from '../figs/chain';
import { GLYPH } from './dk1-common';
import { LF12 } from './beats-lf';
import { add, ease, flash, glide, life, makeLeafStaging, panelShow, panelSvg, type Actor, type Api, type Row, type V } from './lf-common';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const cap = (w: number, r = 13): string => `<rect class="dk-cap" x="${-w / 2 - 5}" y="${-r - 5}" width="${w + 10}" height="${2 * r + 10}" rx="${r + 5}"/>`;
const ACTORS: Actor[] = [
  { k: 'co2', g: GLYPH.co2(), lab: 'CO₂ 1', dy: -22 },
  { k: 'h2o', g: `${cap(36)}${h2oG(0, -2)}`, lab: 'H₂O', dy: 34 },
  { k: 'hp', g: `<g class="chn-g">${hring(0, 0, 12)}</g>` },
  { k: 'hco3', g: `<circle class="dk-cap" r="30"/>${hco3G(0, 0)}`, lab: 'HCO₃⁻ 1', dx: 32, dy: 7, an: 'start' },
  { k: 'pep', g: GLYPH.carbon('CCCP'), lab: 'PEP 1', dy: -22 },
  { k: 'acid', g: GLYPH.carbon('CCCC'), lab: 'C₄ acid 1', dy: -22 },
  { k: 'pi', g: GLYPH.pi() },
  { k: 'co2b', g: GLYPH.co2(), lab: 'CO₂ 1', dx: 36, dy: 6, an: 'start' },
  { k: 'pyr', g: GLYPH.carbon('CCC'), lab: 'pyruvate 1', dy: 34 },
  { k: 'atp', g: GLYPH.atp(), lab: 'ATP 1', dy: 34 },
  { k: 'amp', g: `<g class="chn-g">${tagG(0, 0, 'AMP', 'atp')}</g>` },
  { k: 'pepN', g: GLYPH.carbon('CCCP'), lab: 'PEP 1', dy: -22 },
];

/* ---------------------------------------------------------------- ways (panorama units) */
const S = SPOT;
const CO2_IN: V[] = [[24, 340], [70, 340], [PORE[0], 340], ...C4.co2In.slice(0, -1), add(S.ca, [-30, -4])];
const H2O_IN: V[] = [[420, 196], [432, 150], add(S.ca, [-6, 22])];
const HP_OUT: V[] = [add(S.ca, [20, 20]), [500, 140], [520, 136]];
const HCO3_OUT: V[] = [add(S.ca, [26, -10]), S.hco3];
const HCO3_IN: V[] = [S.hco3, add(S.pepc, [8, -30])];
const PEP_IN: V[] = [S.pep, add(S.pepc, [-26, 0])];
const ACID_OUT: V[] = [add(S.pepc, [20, -10]), add(S.pepc, [52, -50])];
const PI_OUT: V[] = [add(S.pepc, [10, 24]), [566, 252], [576, 290]];
const ACID_BS: V[] = [add(S.pepc, [52, -50]), ...C4.acid.slice(1, -1), add(S.me, [0, -20])];
const CO2_ME: V[] = [add(S.me, [20, 30]), add(S.me, [26, 80]), add(S.bsRub, [12, -24])];
const PYR_REST: V = C4.pyr[3];
const PYR_OUT: V[] = [add(S.me, [-20, 14]), ...C4.pyr.slice(0, 3), PYR_REST];
const PYR_BACK: V[] = [PYR_REST, ...C4.pyr.slice(4, -1), add(S.ppdk, [24, 10])];
const ATP_IN: V[] = [[S.granum[0] - 12, S.granum[1] - 14], [276, 420], [270, 300], S.atp, add(S.ppdk, [-24, 12])];
const AMP_OUT: V[] = [add(S.ppdk, [20, 16]), S.amp];
const PEP_BACK: V[] = [add(S.ppdk, [30, -6]), ...C4.pep.slice(1, -1), S.pep];

/* ---------------------------------------------------------------- the ledger and the conditions card (stage units) */
const n = (k: string, s: string): string => `<tspan data-k="${k}">${s}</tspan>`;
const ROWS: Row[] = [
  { k: 'r0', h: 36, html: 'per 1 CO₂', cls: 'dk-ph' },
  { k: 'r1', h: 36, html: '<tspan class="lfa-e">CA:</tspan> CO₂ + H₂O → HCO₃⁻ + H⁺' },
  { k: 'r2', h: 36, html: '<tspan class="lfa-e">PEPC:</tspan> HCO₃⁻ + PEP → C₄ acid + Pᵢ' },
  { k: 'r2c', h: 32, html: '1 C + 3 C = 4 C', cls: 'dk-pc' },
  { k: 'r3', h: 36, html: '<tspan class="lfa-e">NADP-ME:</tspan> C₄ acid → CO₂ + pyruvate' },
  { k: 'r3c', h: 32, html: '4 C = 1 C + 3 C', cls: 'dk-pc' },
  { k: 'r3d', h: 32, html: 'CO₂ at RuBisCO: up to ≈ 10 × air', cls: 'dk-pc' },
  { k: 'r4', h: 36, html: '<tspan class="lfa-e">PPDK:</tspan> pyruvate + ATP + Pᵢ → PEP + AMP + PPᵢ' },
  { k: 'r4c', h: 32, html: `ATP → AMP: ${n('n-atp', '2')} ATP equivalents`, cls: 'dk-pc' },
  { k: 'r5', h: 40, html: 'C₄: 5 ATP + 2 NADPH per CO₂', cls: 'lfa-sum' },
  { k: 'r6', h: 36, html: 'C₃: 3 ATP + 2 NADPH per CO₂', cls: 'dk-pc' },
];
const PX = 1060, PY = 22, PW = 528;
// the card, scaled to 0.82 and stopping at y 522 (over the dimmed RuBisCO label), leaves the band under it free: the closing question sits centred
// there, under the CAM column it asks about, clear of the bottom edge (lecturer, 29 Oct 2026)
const card = (): string => {
  const svg = climateSvg('lfa12c', 'c4').replace('<svg class="', '<svg x="182" y="19" width="656" height="492" class="');
  return `<g data-k="card" display="none"><rect class="lfa-card" x="128" y="14" width="764" height="508" rx="16"/>${svg}</g>`;
};

/* ---------------------------------------------------------------- the frame */
function frame(a: Api, beat: number, t: number): void {
  // inputs first: CO₂ 1 in the air, PEP 1 beside PEPC
  if (beat === 0) {
    a.put('co2', t < 1.2 ? CO2_IN[0] : glide(CO2_IN, t, 1.2, 4.2), ease(t, 0.1, 0.6) * (1 - ease(t, 4.9, 5.1)));
    a.put('pep', S.pep, ease(t, 0.5, 1.0));
    a.put('h2o', glide(H2O_IN, t, 3.4, 4.6), ease(t, 3.3, 3.6) * (1 - ease(t, 4.9, 5.1)));
    flash(a, t, 5.0, S.ca);
    if (t > 5.0) a.put('hco3', glide(HCO3_OUT, t, 5.05, 6.1), ease(t, 5.0, 5.2));
    if (t > 5.0 && t < 7) a.put('hp', glide(HP_OUT, t, 5.05, 6.2), ease(t, 5.0, 5.2) * (1 - ease(t, 6.0, 6.6)));
  }
  if (beat === 1) {
    a.put('hco3', glide(HCO3_IN, t, 0.4, 1.8), 1 - ease(t, 2.0, 2.2));
    a.put('pep', glide(PEP_IN, t, 0.4, 1.8), 1 - ease(t, 2.0, 2.2));
    flash(a, t, 2.1, S.pepc);
    if (t > 2.1) a.put('acid', glide(ACID_OUT, t, 2.15, 3.2), ease(t, 2.1, 2.3));
    if (t > 2.1 && t < 5) a.put('pi', glide(PI_OUT, t, 2.2, 3.4), ease(t, 2.1, 2.3) * (1 - ease(t, 3.6, 4.2)));
  }
  if (beat === 2) {
    a.put('acid', glide(ACID_BS, t, 0.3, 3.4), 1 - ease(t, 3.6, 3.8));
    flash(a, t, 3.7, S.me);
    if (t > 3.7) {
      a.put('co2b', glide(CO2_ME, t, 3.8, 5.2), ease(t, 3.7, 3.9) * (1 - ease(t, 5.4, 5.6)));
      a.put('pyr', glide(PYR_OUT, t, 3.8, 5.6), ease(t, 3.7, 3.9));
    }
    flash(a, t, 5.5, S.bsRub, 'fl2');
  }
  if (beat === 3) {
    a.put('pyr', glide(PYR_BACK, t, 0.3, 3.2), 1 - ease(t, 3.8, 4.0));
    a.put('atp', glide(ATP_IN, t, 1.6, 3.6), ease(t, 1.5, 1.8) * (1 - ease(t, 3.8, 4.0)));
    flash(a, t, 3.9, S.ppdk);
    if (t > 3.9) {
      a.put('amp', glide(AMP_OUT, t, 4.0, 5.0), ease(t, 3.9, 4.1));
      a.put('pepN', glide(PEP_BACK, t, 4.0, 5.8), ease(t, 3.9, 4.1));
    }
  }
  if (beat === 4) { a.put('pepN', S.pep, 1); a.put('amp', S.amp, 1); }
  // names of new products appear once they are clear of their enzyme
  if (beat === 0) a.op('hco3-l', ease(t, 5.6, 6.0));
  if (beat === 1) a.op('acid-l', ease(t, 2.8, 3.2));
  if (beat === 2) { a.op('co2b-l', ease(t, 4.5, 4.9)); a.op('pyr-l', ease(t, 4.6, 5.0)); }
  if (beat === 3) { a.op('pepN-l', ease(t, 4.8, 5.2)); a.op('pyr-l', 1 - ease(t, 2.4, 2.8)); }
  // the ledger
  const v = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.4) : 0);
  panelShow(a, 'panel', ROWS, {
    r0: v(0, 0.2), r1: v(0, 5.0), r2: v(1, 2.1), r2c: v(1, 2.6), r3: v(2, 3.7), r3c: v(2, 4.2), r3d: v(2, 5.6), r4: v(3, 3.9), r4c: v(3, 4.4), r5: v(3, 5.6), r6: v(3, 6.0),
  });
  // beat 5: the conditions strip over the dimmed leaf
  a.op('cam', beat === 4 ? 1 - 0.75 * ease(t, 0.2, 1.0) : 1);
  a.op('card', beat === 4 ? ease(t, 0.4, 1.2) : 0);
}

const LIT: LPart[][] = [
  ['stoma', 'c4-co2', 'ca'],
  ['ca', 'hco3', 'pepc'],
  ['pepc', 'c4acid', 'bs-cp', 'me', 'me-co2', 'bs-rub'],
  ['m-cp', 'pyr', 'ppdk', 'atp', 'pep', 'pepc', 'me', 'bs-cp', 'bs-rub'],
  ['m-cp', 'pyr', 'ppdk', 'atp', 'pep', 'pepc', 'me', 'bs-cp', 'bs-rub', 'ca', 'c4acid'],
];

const BASE = makeLeafStaging({
  id: 'lf12m',
  name: 'm · In the leaf section',
  note: 'C₄ per 1 CO₂ in the leaf section, one fixed framing: CA, PEPC, the C₄ acid into the bundle sheath, NADP-ME, CO₂ at RuBisCO; pyruvate back to PPDK with 1 ATP; the ledger; the conditions strip at the end',
  beats: LF12,
  leaf: { hide: ['m-rub', 'm-perox', 'm-mito'] },
  actors: ACTORS,
  hud: () => `${panelSvg('panel', PX, PY, PW, ROWS)}${card()}`,
  cam: { s: 1.12, c: [0, 20], at: [14, 8] },
  lit: LIT,
  frame,
});
void life;

/** The key lines on the stage (lecturer, 29 Oct 2026): each beat's take-home and the closing question. */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(0, ['CO₂ becomes', 'bicarbonate'], 1325, 545, { size: 40 }),
  ...keyLines(1, ['PEPC does not', 'react with O₂'], 1325, 545, { size: 40 }),
  ...keyLines(2, ['CO₂ concentrated', 'next to RuBisCO'], 1325, 545, { size: 40 }),
  ...keyLines(3, ['2 extra ATP per CO₂'], 1325, 570, { size: 40 }),
  // under the ledger, above the band the question takes
  ...keyLines(4, ['Above ≈ 30 °C, C₄', 'fixes more CO₂'], 1325, 478, { size: 40 }),
  ...keyLines(4, ['A cactus keeps its stomata shut on a hot day:', 'how does it get its CO₂?'], 800, 582, { size: 44, t0: 3.0 }),
] };
