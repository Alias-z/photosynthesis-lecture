// Slide C6 · Photorespiration. Figures of the rf chunk (overnight build 28 Oct 2026); text in ./rf06.ts.
// New variants v1–v11 first (C6 has no picks), then the earlier figures of ./c06.ts by their own ids.
// Approaches: whole schema with the photorespiratory loop lit (v1–v4, v10, v11; ./rf-schema.ts) · real micrograph with the
// pathway drawn on it (v5, Frederick & Newcomb 1969 Fig. 6, tobacco leaf) · real photos with a drawing (v6, Schwarte &
// Bauwe 2007 Fig. 1B, D) · drawings (v7 the high-CO₂ mutant screen of Somerville & Ogren 1979, after Peterhänsel et al.
// 2010 Fig. 2; v9 carbon count) · data redrawn (v8 Ehleringer & Björkman 1977).
// Numbers used, and no others: C₃ quantum yield at 30 °C 0.0524 (21 % O₂) and 0.0733 (2 % O₂) mol CO₂ per mol absorbed
// photons (Ehleringer & Björkman 1977, abstract; 1 − 0.0524/0.0733 ≈ 29 % is our arithmetic); screen at 1 % CO₂ and air
// ≈ 0.03 % CO₂ (Peterhänsel et al. 2010, §1.2); pglp1 in air 3 weeks, in 0.3 % CO₂ 4 months (Schwarte & Bauwe 2007, Fig. 1).
// Credits: assets/SOURCES-rf.md.
import type { PlateText, Variant } from '../types';
import { draw as c06draw, VARIANTS as C06 } from './c06';
import { schemaSvg, LIT_C6 } from './rf-schema';
import { arrow, balls, beads, beadsW, credit, crop, fig, gasPill, minimap, pill, shot, T, TV, type Img, type Pt } from './rf-kit';
import fnJpg from '../../assets/rf/fn6-whole.jpg';
import schwJpg from '../../assets/rf/schwarte2007-fig1.jpg';

export const PLATE: PlateText = {
  n: 'C6',
  title: 'Photorespiration',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Peterhänsel et al. 2010', url: 'https://doi.org/10.1199/tab.0130' },
    { label: 'Somerville & Ogren 1979', url: 'https://doi.org/10.1038/280833a0' },
    { label: 'Frederick & Newcomb 1969', url: 'https://doi.org/10.1083/jcb.43.2.343' },
    { label: 'Schwarte & Bauwe 2007', url: 'https://doi.org/10.1104/pp.107.099192' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: 'Schema (thesis look): the photorespiratory loop lit', anim: true },
  { id: 'v2', name: 'Schema over real micrographs (granum, peroxisome, mitochondrion)', anim: true },
  { id: 'v3', name: 'Schema (glow look): the loop lit', anim: true },
  { id: 'v4', name: 'Zoom on the loop, with a map of the whole schema', anim: true },
  { id: 'v5', name: 'The pathway drawn on a real micrograph: peroxisome between chloroplasts (tobacco)' },
  { id: 'v6', name: 'Mutant without the first enzyme: dies in air, grows in high CO₂ (photos)' },
  { id: 'v7', name: 'The high-CO₂ mutant screen of Somerville & Ogren 1979 (drawn)' },
  { id: 'v8', name: 'CO₂ fixed per photon: air vs 2 % O₂ (Ehleringer & Björkman 1977)' },
  { id: 'v9', name: 'Carbon count: 4 C in, 3 C back, 1 C lost (drawn)' },
  { id: 'v10', name: 'Schema (line look): the loop lit' },
  { id: 'v11', name: 'Schema (flat look): the loop lit' },
];
export const VARIANTS: Variant[] = [...NEW, ...C06];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return schemaSvg('thesis', LIT_C6, { id: 'rf6v1' });
    case 'v2': return schemaSvg('tem', LIT_C6, { id: 'rf6v2' });
    case 'v3': return schemaSvg('glow', LIT_C6, { id: 'rf6v3' });
    case 'v4': return zoomSvg();
    case 'v5': return temSvg();
    case 'v6': return mutantSvg();
    case 'v7': return screenSvg();
    case 'v8': return yieldSvg();
    case 'v9': return carbonSvg();
    case 'v10': return schemaSvg('line', LIT_C6, { id: 'rf6v10' });
    case 'v11': return schemaSvg('flat', LIT_C6, { id: 'rf6v11' });
    default: return c06draw(id);
  }
}

const f1 = (v: number): string => v.toFixed(1);

/* v4 · zoom on the loop */
function zoomSvg(): string {
  const view: [number, number, number, number] = [236, 176, 564, 423];
  return fig('rff06', 'Enlarged part of the schema: 2-phosphoglycolate leaves the chloroplast as glycolate for the peroxisome; glycine goes to the mitochondrion, which releases CO2 and NH3; serine returns to the peroxisome, and glycerate to the chloroplast, where it becomes PGA. A small map of the whole schema, top left, marks the enlarged part.', `
    ${crop('rf6v4c', 'thesis', LIT_C6, view, [0, 0, 800, 600], false)}
    ${minimap('rf6v4m', 'thesis', LIT_C6, 14, 14, 170, view)}
    ${credit(14, 162, 'after Zhang 2021 (MSc thesis), Fig. 2b', 'start')}`);
}

/* v5 · the pathway on Frederick & Newcomb 1969 Fig. 6 */
const FN: Img = { href: fnJpg, w: 600, h: 490 };
function temSvg(): string {
  const r = shot('rf6v5', FN, 70, 8, 660);
  const p = r.at;
  const lab = (q: Pt, s: string, k = 'rfk-m'): string => T(q[0], q[1], s, `${k} rfk-halo`, 'middle');
  const ar = (q: Pt[], k = 'rfk-aro'): string => arrow(q, 'rfk-arw rfk-thick', 17) + arrow(q, `${k} rfk-thick`, 15);
  return fig('rff06', 'Electron micrograph of a tobacco leaf cell (Frederick and Newcomb 1969, figure 6): a peroxisome with a crystal pressed against chloroplasts below, a mitochondrion to its right. Drawn on it: glycolate from the chloroplast into the peroxisome, glycine to the mitochondrion, which releases CO2 and NH3, serine back to the peroxisome, glycerate back to the chloroplast.', `
    ${r.svg}
    ${ar([p(140, 420), p(128, 360), p(160, 300)])}
    ${ar([p(330, 95), p(430, 98), p(478, 196)])}
    ${ar([p(452, 300), p(400, 296), p(372, 268)])}
    ${ar([p(300, 312), p(300, 400)])}
    ${ar([p(548, 222), p(590, 160)], 'rfk-arg')}
    ${ar([p(530, 330), p(552, 395)])}
    ${pill(p(250, 200)[0], p(250, 200)[1], 'peroxisome')}
    ${pill(p(490, 262)[0], p(490, 262)[1], 'mitochondrion')}
    ${pill(p(160, 462)[0], p(160, 462)[1], 'chloroplast')}${pill(p(470, 462)[0], p(470, 462)[1], 'chloroplast')}
    ${pill(p(70, 330)[0], p(70, 330)[1], 'glycolate', undefined, 'rfk-ko')}
    ${pill(p(400, 62)[0], p(400, 62)[1], 'glycine', undefined, 'rfk-ko')}
    ${pill(p(386, 330)[0] + 10, p(386, 330)[1] + 4, 'serine', undefined, 'rfk-ko')}
    ${pill(p(230, 372)[0], p(230, 372)[1], 'glycerate', undefined, 'rfk-ko')}
    ${gasPill(p(588, 132)[0] - 10, p(588, 132)[1], 'OCO', 'CO₂')}${pill(p(560, 420)[0] - 6, p(560, 420)[1], 'NH₃')}
    ${credit(794, 594, 'micrograph: Frederick & Newcomb 1969, J Cell Biol 43:343, Fig. 6 (tobacco leaf, CC BY-NC-SA)')}`);
}

/* v6 · the pglp1 mutant: air vs 0.3 % CO₂ (Schwarte & Bauwe 2007 Fig. 1B, D) */
const SCHW: Img = { href: schwJpg, w: 415, h: 281 };
function mutantSvg(): string {
  const s = 2.2;
  const b = shot('rf6v6b', SCHW, 42, 92, 205 * s, { win: [0, 43, 205, 97] });
  const d = shot('rf6v6d', SCHW, 42 + 205 * s + 32, 92, 108 * s, { win: [0, 182, 108, 98] });
  const bx = 42, dx = 42 + 205 * s + 32;
  return fig('rff06', 'Photos from Schwarte and Bauwe 2007, figure 1: Arabidopsis wild type and a mutant lacking 2-phosphoglycolate phosphatase. In air, after 3 weeks, the wild type has grown leaves while the mutant is a tiny seedling (shown enlarged). In 0.3 percent CO2 the mutant grows into a full rosette (after 4 months). Below, a drawing marks the missing step: 2-phosphoglycolate is not turned into glycolate.', `
    ${T(bx + 205 * s / 2, 72, 'air, 3 weeks', 'rfk-h', 'middle')}${T(dx + 108 * s / 2, 72, '0.3 % CO₂, 4 months', 'rfk-h', 'middle')}
    ${b.svg}${d.svg}
    ${pill(bx + 76, 92 + 97 * s + 30, 'wild type', [bx + 66, 92 + 70 * s])}
    ${pill(bx + 336, 92 + 97 * s + 30, 'mutant (enlarged)', [bx + 336, 92 + 80 * s])}
    ${pill(dx + 108 * s / 2, 92 + 97 * s + 30, 'mutant')}
    <rect class="rfk-box" x="120" y="420" width="560" height="120" rx="14"/>
    ${T(146, 470, '2-phosphoglycolate', 'rfk-ho')}
    ${arrow([[372, 463], [482, 463]], 'rfk-aro', 14)}<path class="rfk-x" d="M414,448l26,30M440,448l-26,30"/>
    ${T(498, 470, 'glycolate', 'rfk-ho')}
    ${T(400, 514, 'missing enzyme: 2-phosphoglycolate phosphatase', 'rfk-l', 'middle')}
    ${credit(794, 594, 'photos: Schwarte & Bauwe 2007, Plant Physiol 144:1580, Fig. 1B, D (Arabidopsis pglp1)')}`);
}

/* v7 · the screen of Somerville & Ogren 1979, drawn */
function rosette(c: Pt, k: 'g' | 'y', r = 22): string {
  let s = '';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 2 * Math.PI, x = c[0] + Math.cos(a) * r * 0.55, y = c[1] + Math.sin(a) * r * 0.55;
    s += `<ellipse class="rfk-leaf${k === 'y' ? '-y' : ''}" cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r * 0.62)}" ry="${f1(r * 0.3)}" transform="rotate(${f1((a * 180) / Math.PI)} ${f1(x)} ${f1(y)})"/>`;
  }
  return s;
}
function screenSvg(): string {
  const tray = (x: number, title: string, sub: string, k: string, bad: 'g' | 'y' | 'x'): string => {
    let s = `${T(x + 100, 84, title, 'rfk-h', 'middle')}${T(x + 100, 112, sub, 'rfk-s', 'middle')}<rect class="${k}" x="${x}" y="134" width="200" height="200" rx="16"/>`;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const c: Pt = [x + 40 + j * 60, 174 + i * 60];
      if (i === 1 && j === 1) { if (bad !== 'x') s += rosette(c, bad === 'y' ? 'y' : 'g'); } else s += rosette(c, 'g');
    }
    return s;
  };
  return fig('rff06', 'Drawing of the mutant screen of Somerville and Ogren 1979, after Peterhänsel et al. 2010 figure 2. Three trays of Arabidopsis plants: first all grown in 1 percent CO2; moved to air, about 0.03 percent CO2, one plant turns pale; moved back to 1 percent CO2, it turns green again. That mutant lacked 2-phosphoglycolate phosphatase.', `
    ${tray(30, '1 % CO₂', 'all grow', 'rfk-chamber', 'g')}
    ${arrow([[244, 234], [286, 234]], 'rfk-ar', 14)}
    ${tray(300, 'air', '≈ 0.03 % CO₂', 'rfk-chamber-air', 'y')}
    ${arrow([[514, 234], [556, 234]], 'rfk-ar', 14)}
    ${tray(570, '1 % CO₂', 'it recovers', 'rfk-chamber', 'g')}
    ${pill(400, 372, 'mutant: pale in air', [400, 254])}
    ${T(400, 452, 'Somerville & Ogren 1979, Arabidopsis:', 'rfk-m', 'middle')}
    ${T(400, 484, 'the first mutant lacked 2-phosphoglycolate phosphatase,', 'rfk-l', 'middle')}
    ${T(400, 512, 'the first step of photorespiration', 'rfk-l', 'middle')}
    ${credit(794, 594, 'drawn after Peterhänsel et al. 2010, The Arabidopsis Book 8:e0130, Fig. 2')}`);
}

/* v8 · CO₂ fixed per photon in air vs 2 % O₂ (C₃ leaves, 30 °C) */
function yieldSvg(): string {
  const b: [number, number, number, number] = [200, 70, 580, 450];
  const Y = (v: number): number => b[3] - (v / 0.08) * (b[3] - b[1]);
  const X = (i: number): number => b[0] + 95 + i * 190;
  const bar = (i: number, v: number, k: string): string => `<rect class="rfk-bar-${k}" x="${X(i) - 60}" y="${f1(Y(v))}" width="120" height="${f1(b[3] - Y(v))}" rx="4"/>${T(X(i), Y(v) - 14, v.toFixed(3), 'rfk-big', 'middle')}`;
  return fig('rff06', 'Bar chart from Ehleringer and Björkman 1977: CO2 fixed per absorbed photon by C3 leaves at 30 degrees is 0.052 in air, 21 percent O2, and 0.073 in 2 percent O2, about 29 percent lower in air.', `
    <path class="rfk-axis" d="M${b[0]},${b[1]}V${b[3]}H${b[2]}"/>
    ${[0, 0.02, 0.04, 0.06, 0.08].map(v => `<path class="rfk-tk" d="M${b[0]},${f1(Y(v))}h-7"/>${T(b[0] - 12, Y(v) + 6, v === 0 ? '0' : v.toFixed(2), 'rfk-ax', 'end')}`).join('')}
    ${TV(b[0] - 78, (b[1] + b[3]) / 2, 'CO₂ fixed per photon absorbed')}
    ${bar(0, 0.0524, 'o')}${bar(1, 0.0733, 'k')}
    ${T(X(0), b[3] + 32, 'air', 'rfk-h', 'middle')}${T(X(0), b[3] + 58, '21 % O₂', 'rfk-s', 'middle')}
    ${T(X(1), b[3] + 32, '2 % O₂', 'rfk-h', 'middle')}${T(X(1), b[3] + 58, 'little oxygenation', 'rfk-s', 'middle')}
    ${T(612, 240, '≈ 29 % lower', 'rfk-ho')}${T(612, 268, 'in air', 'rfk-ho')}
    ${T(612, 320, 'C₃ leaves, 30 °C', 'rfk-s')}
    ${credit(794, 594, 'data: Ehleringer & Björkman 1977, Plant Physiol 59:86 (mol CO₂ per mol absorbed photons)')}`);
}

/* v9 · carbon count */
function carbonSvg(): string {
  const col = (x: number, top: string, body: string, sub: string): string => `${T(x, 150, top, 'rfk-h', 'middle')}${body}${T(x, 300, sub, 'rfk-s', 'middle')}`;
  const nb = (x: number, y: number, n: number): string => beads(x, y, n, 'n', 9);
  const c1 = col(110, '2 × 2-phospho-', `${T(110, 176, 'glycolate', 'rfk-h', 'middle')}${beads(110 - beadsW(2) / 2 + 11, 222, 2, 'o')}${beads(110 - beadsW(2) / 2 + 11, 256, 2, 'o')}`, '4 C');
  const c2 = col(300, '2 × glycine', `${beads(300 - beadsW(2) / 2 + 11 - 14, 222, 2, 'o')}${nb(300 + 24, 222, 1)}${beads(300 - beadsW(2) / 2 + 11 - 14, 256, 2, 'o')}${nb(300 + 24, 256, 1)}`, '4 C, 2 N');
  const c3 = `${T(520, 150, 'serine', 'rfk-h', 'middle')}${beads(520 - beadsW(3) / 2 + 11, 222, 3, 'o')}${nb(520 + 46, 222, 1)}${T(520, 300, '3 C, 1 N', 'rfk-s', 'middle')}
    ${balls([372, 400], 'OCO')}${T(372, 446, 'CO₂: 1 C lost', 'rfk-h', 'middle')}
    ${T(486, 410, 'NH₃', 'rfk-h', 'middle')}${T(486, 446, 'refixed', 'rfk-s', 'middle')}`;
  const c4 = col(715, 'PGA', beads(715 - beadsW(3) / 2 + 11, 222, 3, 'o'), '3 C back');
  return fig('rff06', 'Drawing of the carbon count of photorespiration. Two 2-phosphoglycolate, 4 carbons, become two glycine, 4 carbons and 2 nitrogens, in the peroxisome. In the mitochondrion two glycine give one serine, 3 carbons and 1 nitrogen, plus one CO2, which is lost, and one NH3, which is refixed. Serine returns via glycerate as PGA: 3 of the 4 carbons come back. Carbon atoms are drawn as beads, nitrogen as small blue beads.', `<g transform="translate(0,-50)">
    ${c1}${arrow([[180, 238], [236, 238]], 'rfk-aro', 13)}${T(208, 206, 'peroxisome', 'rfk-s', 'middle')}
    ${c2}${arrow([[362, 238], [452, 238]], 'rfk-aro', 13)}${T(408, 206, 'mitochondrion', 'rfk-s', 'middle')}
    ${arrow([[400, 252], [380, 372]], 'rfk-arg', 12)}${arrow([[418, 252], [470, 382]], 'rfk-arg', 12)}
    ${c3}${arrow([[600, 238], [656, 238]], 'rfk-aro', 13)}${T(628, 206, 'via glycerate', 'rfk-s', 'middle')}
    ${c4}
    <rect class="rfk-box" x="210" y="490" width="380" height="64" rx="14"/>
    ${T(400, 530, '4 C in · 3 C back · 1 C lost', 'rfk-h', 'middle')}</g>`);
}
