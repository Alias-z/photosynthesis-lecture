// Slide C6 · Photorespiration, figure s1 (lecture day, lecturer: "much simpler … only the most essential thing"): the
// three compartments in a row (chloroplast, peroxisome, mitochondrion, with their bilayers as in cell-schema.ts), one loop
// of arrows, the molecules as carbon rows (carbon-form.ts) and three labels only. Unit: 2 oxygenations, so the counts add up:
// 2 O₂ taken up by RuBisCO give 2 × 2-PG (2 × 2 C = 4 C); the loop returns 1 3-PGA (3 C) and releases 1 CO₂ (1 C) in the
// mitochondrion (Peterhänsel et al. 2010, §2.1–2.2). Intermediates, enzymes other than RuBisCO, NH₃ and ATP are left to
// the lecturer and the slide text. RuBisCO: our render of PDB 8RUC (assets/rf/rubisco-8ruc.png, 548 × 471).
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { arrow, balls, bilayer, type Pt } from './cell-schema';
import { row } from './carbon-form';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** A closed bilayer along an ellipse, thinner than the strip's (half-thickness 9). */
const mem = (cx: number, cy: number, rx: number, ry: number): string => bilayer([{ A: [cx, cy, rx, ry, -90, 270] }], 9, 2.3, 5.4);
/** The three labels: bold, in the accent. */
const ACC = 'cel-emc cel-halo';
/** Gas balls with their letters at 15 px (the class gives 14). */
const gas15 = (svg: string): string => svg.replace(/class="cel-att/g, 'style="font-size:15px" class="cel-att');

export function drawS1(): string {
  // compartments: chloroplast (two envelope bilayers), peroxisome (one), mitochondrion (two)
  const C: Pt = [188, 320], P: Pt = [455, 320], M: Pt = [662, 320];
  const shapes = `<ellipse class="cel-stroma" cx="${C[0]}" cy="${C[1]}" rx="160" ry="210"/>
    <ellipse class="cel-perox" cx="${P[0]}" cy="${P[1]}" rx="60" ry="60"/>
    <ellipse class="cel-matrix" cx="${M[0]}" cy="${M[1]}" rx="94" ry="146"/>
    ${mem(C[0], C[1], 160, 210)}${mem(C[0], C[1], 136, 186)}${mem(P[0], P[1], 60, 60)}${mem(M[0], M[1], 94, 146)}${mem(M[0], M[1], 70, 122)}`;

  // RuBisCO in the stroma; 2 O₂ in from above; 2 × 2-PG out to its right
  const rw = 104, rh = rw * 471 / 548, rub: Pt = [118, 304];
  const rubisco = `<image href="${rubPng}" x="${f(rub[0] - rw / 2)}" y="${f(rub[1] - rh / 2)}" width="${rw}" height="${f(rh)}"/>
    ${T(rub[0], rub[1] + rh / 2 + 22, 'RuBisCO', 'cel-prot cel-halo')}`;
  const o2 = gas15(`${balls(rub[0] - 28, 58, 'OO', 12)}${balls(rub[0] + 28, 58, 'OO', 12)}`);
  const pg: Pt = [258, 281];
  const pg2 = `${row(pg[0], pg[1] - 15, 'CCP', { r: 12 })}${row(pg[0], pg[1] + 15, 'CCP', { r: 12 })}${T(pg[0], pg[1] - 41, '2-PG', 'cel-mn cel-halo')}`;
  // back: 1 3-PGA (3 of the 4 C) next to RuBisCO
  const pga: Pt = [236, 386];
  const pga3 = row(pga[0], pga[1], 'CCCP', { r: 12 });
  // lost: 1 CO₂ (the 4th C) out of the mitochondrion, upwards
  const co2 = gas15(balls(M[0], 58, 'OCO', 12));

  // the loop: chloroplast → peroxisome → mitochondrion (top), mitochondrion → peroxisome → chloroplast (bottom)
  const loop = [
    arrow([[pg[0] + 46, pg[1]], [345, 285], [395, 300], [432, 307]], 'pr', { halo: true }),
    arrow([[478, 301], [520, 283], [580, 280], [626, 290]], 'pr', { halo: true }),
    arrow([[626, 350], [580, 360], [520, 357], [480, 340]], 'pr', { halo: true }),
    arrow([[432, 340], [395, 352], [345, 370], [pga[0] + 58, pga[1]]], 'pr', { halo: true }),
  ].join('');
  const gas = `${arrow([[rub[0], 76], [rub[0], rub[1] - rh / 2 + 4]], 'gas', { halo: true })}
    ${arrow([[rub[0] + rw / 2 + 4, 293], [pg[0] - 46, pg[1]]], 'pr', { thin: true })}
    ${arrow([[M[0], 262], [M[0], 78]], 'gas', { halo: true })}`;

  const labels = `${T(rub[0], 26, 'O₂ taken up', ACC)}${T(M[0], 26, 'CO₂ lost', ACC)}
    ${T(pga[0] - 22, pga[1] + 42, '3 of 4 C back', ACC)}${T(pga[0] - 22, pga[1] + 68, 'as 3-PGA', ACC)}
    ${T(C[0], 574, 'chloroplast', 'cel-zone')}${T(P[0], 414, 'peroxisome', 'cel-zone')}${T(M[0], 498, 'mitochondrion', 'cel-zone')}
    ${T(790, 594, 'RuBisCO: PDB 8RUC', 'cel-cr', 'end').replace('<text ', '<text style="font-size:15px" ')}`;

  const label = 'Photorespiration in three compartments in a row: chloroplast, peroxisome and mitochondrion. In the chloroplast, '
    + 'RuBisCO takes up 2 O₂ and makes 2 molecules of 2-phosphoglycolate (2-PG), 2 carbons each, 4 carbons in all. One loop of '
    + 'arrows carries them through the peroxisome to the mitochondrion, where 1 carbon leaves as CO₂, and back through the '
    + 'peroxisome to the chloroplast, where 3 of the 4 carbons return as one 3-PGA.';
  return `<svg class="fig-svg cel cel-s1" viewBox="0 0 800 600" role="img" aria-label="${label}">
    ${shapes}${loop}${gas}${rubisco}<g class="chn-g">${pg2}${pga3}</g>${o2}${co2}${labels}</svg>`;
}
