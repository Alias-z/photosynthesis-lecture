// Slide C3 · Reduction and regeneration (lecture 2 chunk 1, prefix cb, overnight build 28 Oct 2026; draft for the
// lecturer). The energy side of the cycle: 2 ATP + 2 NADPH per CO₂ for reduction, 1 ATP per CO₂ for regeneration
// (3 ATP + 2 NADPH per CO₂), and the classic evidence that both need light: Bassham's light-off transient in Chlorella
// (Calvin 1961 Nobel lecture, Fig. 15: 3-PGA jumps, RuBP falls to near zero within a minute).
// Real figures: Calvin 1961 Fig. 15 (© The Nobel Foundation, whole scan); Sharkey 2019 Photosynth Res Fig. 3, top band
// (© Springer Nature). Redrawn: Fig. 15 from values read off the scan (cb-common FIG15_*). Credits: assets/SOURCES-cb.md.
// Variants v1–v8 are new; the earlier c03 figures (a–j, unpicked) follow, drawn by ./c03.
import type { PlateText, Variant } from '../types';
import { ledgerC } from './ledger';
import { draw as oldDraw, VARIANTS as OLD } from './c03';
import lightPng from '../../assets/photos/c3-light.png';
import sharkeyJpg from '../../assets/photos/cb-sharkey2019.jpg';
import {
  ar, axes, carbons, chip, credit, cycleWheel, f, FIG15_PGA, FIG15_RUBP, line, pill, rowW, series, shot, svg, T, tagRow, X, Y,
  type Axes, type Img,
} from './cb-common';

export const PLATE: PlateText = {
  n: 'C3',
  title: 'Reduction of 3-PGA to triose phosphate',
  status: 'draft',
  lead: 'ATP and NADPH from the light reactions reduce 3-PGA to triose phosphate.',
  points: [
    { claim: 'ATP and NADPH.', text: 'Each 3-PGA uses 1 ATP and 1 NADPH', eq: '3-PGA + ATP + NADPH →<br>triose phosphate + ADP + Pᵢ + NADP⁺' },
    { claim: 'Enzymes.', text: 'Phosphoglycerate kinase (ATP), then glyceraldehyde-3-phosphate dehydrogenase (GAPDH, NADPH)' },
    { claim: 'Per CO₂.', text: '', eq: ledgerC([['1 CO₂ → 2 3-PGA → 2 triose phosphate', '2', '2']], undefined, 'per CO₂') },
  ],
  refs: [
    { label: 'Calvin 1961 (Nobel lecture)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' },
    { label: 'Sharkey 2019', url: 'https://doi.org/10.1007/s11120-018-0600-2' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: 'Light off: Bassham’s data (scan)' },
  { id: 'v2', name: 'Light off, redrawn' },
  { id: 'v3', name: 'Wheel with ATP and NADPH per 3 CO₂' },
  { id: 'v4', name: 'Per CO₂: 3 ATP + 2 NADPH, stacked' },
  { id: 'v5', name: 'Light off on the wheel, beside the data' },
  { id: 'v6', name: 'Sharkey 2019: the energy steps counted' },
  { id: 'v7', name: 'Light reactions feed reduction and regeneration' },
  { id: 'v8', name: 'What reduction does to 3-PGA' },
];
// No picks on C3 yet (picks.json, 28 Oct 2026): new variants first, then the earlier unpicked ones.
export const VARIANTS: Variant[] = [...NEW, ...OLD];

const NOBEL = '© The Nobel Foundation 1961, www.nobelprize.org';
const LIGHT: Img = { href: lightPng, w: 1423, h: 823 };
const SHK: Img = { href: sharkeyJpg, w: 1418, h: 1189 };
const CR15 = `Calvin 1961, Nobel lecture, Fig. 15 (J. A. Bassham’s data) · ${NOBEL}`;

/* ---------- v1 · the scan ---------- */

function v1(): string {
  const p = 'fcb3v1', a = shot(`${p}-a`, LIGHT, 16, 64, 768, { fig: true });
  const off = a.at(637, 760);
  return svg(p, 'Bassham’s experiment as printed in Calvin’s Nobel lecture: carbon-14 in 3-phosphoglycerate (3-PGA) and in ribulose bisphosphate (RuBP) of the alga Chlorella, in steady light and after the light is switched off at 400 seconds. In the dark, 3-PGA jumps up and RuBP falls to near zero within a minute.', `
    ${a.svg}
    ${pill(150, 36, `${'<tspan class="fcb-it">Chlorella</tspan>'} in ¹⁴CO₂`, undefined, true)}
    ${pill(520, 120, '3-PGA piles up', a.at(700, 100), true)}${pill(520, 330, 'RuBP is used up', a.at(668, 686), true)}
    <circle cx="${f(off[0])}" cy="${f(off[1] - 4)}" r="34" class="fcb-ring"/>
    ${credit(784, 592, CR15)}
  `);
}

/* ---------- the transient, redrawn ---------- */

function transient(p: string, a: Axes, o: { notes?: boolean; small?: boolean } = {}): string {
  const top = a.y0 - 30;
  const band = `<rect x="${f(X(a, 0))}" y="${f(top)}" width="${f(X(a, 400) - X(a, 0))}" height="24" class="fcb-band-day"/>${T((X(a, 0) + X(a, 400)) / 2, top + 18, 'light', 'fcb-band', 'middle')}
    <rect x="${f(X(a, 400))}" y="${f(top)}" width="${f(X(a, 700) - X(a, 400))}" height="24" class="fcb-band-night"/>${T((X(a, 400) + X(a, 700)) / 2, top + 18, 'dark', 'fcb-band-d', 'middle')}
    <rect x="${f(X(a, 400))}" y="${f(a.y0)}" width="${f(X(a, 700) - X(a, 400))}" height="${f(a.h)}" class="fcb-shade-night"/>`;
  const curves = `${series(a, FIG15_PGA, 'green', '', 0, true)}${series(a, FIG15_RUBP, 'amber', '', 0, true)}`;
  const lab = o.small
    ? `${T(X(a, 30), Y(a, 10.9) - 12, '3-PGA', 'fcb-node fcb-c-green', 'start')}${T(X(a, 30), Y(a, 5.7) - 12, 'RuBP', 'fcb-node fcb-c-amber', 'start')}`
    : `${T(X(a, 20), Y(a, 10.9) - 14, '3-PGA', 'fcb-node fcb-c-green', 'start')}${T(X(a, 20), Y(a, 5.7) - 14, 'RuBP', 'fcb-node fcb-c-amber', 'start')}`;
  const notes = o.notes
    ? `${T(X(a, 440), Y(a, 9), '3-PGA piles up', 'fcb-node fcb-c-green', 'start')}${T(X(a, 440), Y(a, 0) - 14, 'RuBP is used up', 'fcb-node fcb-c-amber', 'start')}`
    : '';
  return `${band}${axes(a, [0, 200, 400, 600], [0, 10, 20], 'time (s)', '¹⁴C label (counts min⁻¹ × 1000)', { ylx: a.x0 - 56 })}${curves}${lab}${notes}
`;
}

function v2(): string {
  const p = 'fcb3v2', a: Axes = { x0: 120, y0: 80, w: 620, h: 360, xr: [0, 700], yr: [0, 26] };
  return svg(p, 'Redrawn: carbon-14 in 3-PGA (green) and RuBP (amber) of Chlorella over time. In light both are steady. When the light goes off at 400 seconds, 3-PGA jumps to more than twice its level within a minute, and RuBP falls to near zero.', `
    ${transient(p, a, { notes: true })}
    ${credit(790, 592, 'Redrawn from Calvin 1961, Nobel lecture, Fig. 15 (J. A. Bassham’s data, Chlorella)')}
  `);
}

/* ---------- v3 · the wheel with the energy chips ---------- */

function v3(): string {
  const p = 'fcb3v3';
  return svg(p, 'The cycle wheel per 3 CO2 with reduction and regeneration lit: reduction takes 6 ATP and 6 NADPH, regeneration 3 ATP. In all, 9 ATP and 6 NADPH per 3 CO2, that is 3 ATP and 2 NADPH per CO2.', `
    ${cycleWheel(p, { cx: 380, cy: 290, r: 160, lit: ['red', 'regen'], names: 'in', counts: true, sectors: true, energy: true })}
    <rect x="12" y="514" width="380" height="64" rx="14" class="fcb-box-t"/>
    ${T(28, 554, 'per 3 CO₂:', 'fcb-h', 'start', ' style="font-size:23px"')}${tagRow(282, 546, [['9 ATP', 'atp'], ['+', 'op'], ['6 NADPH', 'nadph']], 19)}
  `);
}

/* ---------- v4 · stacked chips per CO₂ ---------- */

function v4(): string {
  const p = 'fcb3v4', bw = 150, bh = 74;
  const cell = (x: number, y: number, cls: string, s: string, sub: string): string =>
    `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="14" class="${cls}"/>${T(x + bw / 2, y + 34, s, 'fcb-node', 'middle')}${T(x + bw / 2, y + 60, sub, 'fcb-s', 'middle')}`;
  const xA = 250, xN = 430, base = 470;
  return svg(p, 'Per CO2 fixed, stacked: ATP, three units, two for reduction and one for regeneration; NADPH, two units, both for reduction.', `
    ${cell(xA, base - bh, 'fcb-atp', 'ATP', 'reduction')}${cell(xA, base - 2 * bh - 8, 'fcb-atp', 'ATP', 'reduction')}${cell(xA, base - 3 * bh - 16, 'fcb-atp', 'ATP', 'regeneration')}
    ${cell(xN, base - bh, 'fcb-nadph', 'NADPH', 'reduction')}${cell(xN, base - 2 * bh - 8, 'fcb-nadph', 'NADPH', 'reduction')}
    ${line(`M${xA - 30},${base + 4} H${xN + bw + 30}`, 'fcb-axis')}
    ${T(xA + bw / 2, base + 40, '3 ATP', 'fcb-big', 'middle')}${T(xN + bw / 2, base + 40, '2 NADPH', 'fcb-big', 'middle')}
    ${T(400, 92, 'per CO₂ fixed', 'fcb-h', 'middle')}
    <rect x="${xA - 2}" y="${base - 3 * bh - 16 - 2}" width="${bw + 4}" height="${bh + 4}" rx="15" fill="none" stroke="#c07a12" stroke-width="3"/>
    ${T(xA - 22, base - 3 * bh - 16 + 44, 'last step to RuBP', 'fcb-l fcb-c-amber', 'end')}
    ${T(xN + bw + 22, base - bh - 4, '3-PGA →', 'fcb-l fcb-c-blue', 'start')}${T(xN + bw + 22, base - bh + 22, 'triose phosphate', 'fcb-l fcb-c-blue', 'start')}
  `);
}

/* ---------- v5 · light off on the wheel, beside the data ---------- */

function v5(): string {
  const p = 'fcb3v5', cx = 186, cy = 300, r = 104;
  const a: Axes = { x0: 534, y0: 140, w: 240, h: 280, xr: [0, 700], yr: [0, 26] };
  const cross = (x: number, y: number): string => `${line(`M${x - 46},${y - 18} L${x + 46},${y + 18}`, 'fcb-ar fcb-k-red')}`;
  return svg(p, 'Left: the cycle with the light off; ATP and NADPH are missing, so reduction and regeneration stop while RuBisCO still turns RuBP into 3-PGA. 3-PGA piles up and RuBP is used up. Right: the measured curves, 3-PGA up and RuBP down after the light goes off.', `
    ${cycleWheel(p, { cx, cy, r, lit: ['carb'], names: false, counts: false, sectors: false, out: '', k: 0.95 })}
    ${chip(cx + r + 34, cy + 30, 'ATP', 'dim')}${chip(cx + r + 40, cy + 84, 'NADPH', 'dim')}${cross(cx + r + 34, cy + 30)}${cross(cx + r + 40, cy + 84)}
    ${chip(cx - r - 30, cy + 40, 'ATP', 'dim')}${cross(cx - r - 30, cy + 40)}
    ${T(cx, 486, '3-PGA piles up', 'fcb-node fcb-c-green', 'middle')}
    ${T(cx, 516, 'RuBP is used up', 'fcb-node fcb-c-amber', 'middle')}
    ${T(cx, 70, 'light off', 'fcb-big', 'middle')}
    ${transient(p, a, { small: true })}
    ${credit(790, 592, 'Right: redrawn from Calvin 1961, Nobel lecture, Fig. 15 (Chlorella)')}
  `);
}

/* ---------- v6 · Sharkey 2019 Fig. 3, top band: the energy steps counted ---------- */

function v6(): string {
  const p = 'fcb3v6', a = shot(`${p}-a`, SHK, 14, 90, 772, { fig: true, win: [40, 0, 1378, 520] });
  return svg(p, 'The top of Sharkey’s 2019 drawing of the cycle per 3 CO2: phosphoribulokinase spends 3 ATP to make 3 RuBP; RuBisCO adds 3 CO2, giving 6 PGA; PGA kinase and GAP dehydrogenase spend 6 ATP and 6 NADPH to make 6 GAP, the triose phosphate.', `
    ${a.svg}
    ${pill(190, 52, 'regeneration: 3 ATP', a.at(230, 118), true)}
    ${pill(560, 52, 'carboxylation: no ATP, no NADPH', a.at(600, 40), true)}
    ${pill(470, 90 + a.h + 40, 'reduction: 6 ATP + 6 NADPH', a.at(915, 440), true)}
    ${T(14, 90 + a.h + 96, 'GAP: glyceraldehyde 3-phosphate, a triose phosphate · PGA: 3-PGA', 'fcb-s', 'start')}
    ${credit(786, 592, 'Sharkey 2019, Photosynth Res 140:235, Fig. 3 (top part) · © Springer Nature')}
  `);
}

/* ---------- v7 · the light reactions feed reduction and regeneration ---------- */

function v7(): string {
  const p = 'fcb3v7', cx = 400, cy = 380, r = 128;
  const mem = `<rect x="30" y="70" width="740" height="56" rx="28" class="fcb-thyl"/><rect x="30" y="126" width="740" height="40" class="fcb-lumen" style="opacity:.0"/>`;
  return svg(p, 'Top: the thylakoid membrane, where the light reactions make ATP and NADPH. Arrows carry ATP and NADPH down into the stroma: NADPH and ATP to reduction (right), ATP to regeneration (left). ADP, phosphate and NADP+ go back to the membrane.', `
    ${mem}${T(400, 106, 'thylakoid membrane: light reactions', 'fcb-node', 'middle')}${T(400, 46, 'light', 'fcb-l fcb-c-amber', 'middle')}
    ${cycleWheel(p, { cx, cy, r, lit: ['red', 'regen'], names: false, counts: false, sectors: true, co2: false, out: '' })}
    ${ar(p, 'red', 'M600,134 C640,220 600,300 540,338', 'fcb-thin')}${chip(660, 200, 'ATP', 'atp')}
    ${ar(p, 'blue', 'M700,134 C760,260 680,380 560,410', 'fcb-thin')}${chip(740, 290, 'NADPH', 'nadph')}
    ${ar(p, 'red', 'M200,134 C150,230 190,330 268,372', 'fcb-thin')}${chip(150, 214, 'ATP', 'atp')}
    ${ar(p, 'grey', 'M330,300 C320,220 330,180 340,140', 'fcb-thin fcb-dash')}${tagRow(256, 206, [['ADP', 'atp'], ['+', 'op'], ['', 'pi']], 18)}${chip(270, 246, 'NADP⁺', 'nadph', 18)}
    ${T(cx, cy + 6, 'stroma', 'fcb-h fcb-c-grey', 'middle')}
    ${T(560, 588, 'reduction', 'fcb-phase fcb-c-blue', 'middle')}${T(240, 588, 'regeneration', 'fcb-phase fcb-c-amber', 'middle')}
  `);
}

/* ---------- v8 · what reduction does to 3-PGA ---------- */

function v8(): string {
  const p = 'fcb3v8', d = 54, g = 8, y = 320;
  const mol = (x: number, k: string, top: string, topCls: string, name: string): string =>
    `${carbons(x, y, k, d, g)}${T(x + d / 2, y - 22, top, topCls, 'middle')}${T(x + rowW(3, d, g) / 2, y + d + 40, name, 'fcb-h', 'middle')}`;
  const xL = 70, xR = 520;
  return svg(p, 'One 3-PGA becomes one triose phosphate. Its first carbon carries an acid group (COO-); ATP first adds a phosphate to it, then NADPH gives two electrons and the phosphate leaves: the carbon now carries an aldehyde group (CHO), the level of a sugar.', `
    ${mol(xL, 'ccc', '–COO⁻', 'fcb-node fcb-c-red', '3-PGA')}${mol(xR, 'ccc', '–CHO', 'fcb-node fcb-c-blue', 'triose phosphate')}
    ${T(xL + d / 2, y - 50, 'acid', 'fcb-s', 'middle')}${T(xR + d / 2, y - 50, 'aldehyde', 'fcb-s', 'middle')}
    ${ar(p, 'blue', `M${xL + rowW(3, d, g) + 26},${y + d / 2} L${xR - 26},${y + d / 2}`, 'fcb-fat')}
    ${chip(310, y - 64, '1 ATP', 'atp')}${chip(424, y - 64, '1 NADPH', 'nadph')}
    ${ar(p, 'red', `M314,${y - 44} L336,${y + 12}`, 'fcb-thin')}${ar(p, 'blue', `M418,${y - 44} L400,${y + 12}`, 'fcb-thin')}
    ${tagRow(390, y + d + 42, [['+', 'op'], ['ADP', 'atp'], ['', 'pi'], ['NADP⁺', 'nadph']], 18)}
    ${T(400, 150, 'reduction: electrons from NADPH', 'fcb-phase fcb-c-blue', 'middle')}
    ${T(400, 182, 'turn an acid group into a sugar’s aldehyde group', 'fcb-l', 'middle')}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8 };
export function draw(id: string): string {
  return DRAW[id] ? DRAW[id]() : oldDraw(id);
}
