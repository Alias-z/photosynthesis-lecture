// Slide C1 · Calvin–Benson–Bassham cycle (lecture 2 chunk 1, prefix cb, overnight build 28 Oct 2026; draft for the
// lecturer). The cycle as one carbon path in three phases, per 3 CO₂: carboxylation, reduction, regeneration, one triose
// phosphate out. Energy amounts are on C3, Rubisco on C2, sucrose and starch on C4 (each fact once).
// Real figures: Bassham et al. 1954 JACS Fig. 7 (the first drawing of the cycle, as reproduced in Sharkey 2019 Fig. 2,
// Sharkey's later labels removed); Michelet et al. 2013 Front Plant Sci Fig. 1 (CC BY); Calvin 1961 Nobel lecture Fig. 5
// (30 s chromatogram, © The Nobel Foundation). Credits: assets/SOURCES-cb.md.
// Variants v1–v8 are new; the earlier c01 figures (a–j, unpicked) follow, drawn by ./c01.
import type { PlateText, Variant } from '../types';
import { draw as oldDraw, VARIANTS as OLD } from './c01';
import basshamPng from '../../assets/photos/cb-bassham1954.png';
import micheletJpg from '../../assets/photos/cb-michelet2013.jpg';
import s30Png from '../../assets/photos/c2-30s.png';
import {
  ar, arcD, carbons, credit, cycleWheel, f, KEY_ABBR, pill, polar, rowW, sectorD, shot, svg, T, type Img, type Pt,
} from './cb-common';

export const PLATE: PlateText = {
  n: 'C1',
  title: 'Calvin–Benson–Bassham cycle',
  status: 'draft',
  lead: 'In the stroma, the Calvin–Benson–Bassham cycle fixes CO₂ into triose phosphate, using ATP and NADPH from the light reactions.',
  points: [
    { claim: 'Carboxylation.', text: 'Rubisco adds CO₂ to ribulose 1,5-bisphosphate (RuBP, 5 C)<br>The product splits into two 3-phosphoglycerate (3-PGA, 3 C)' },
    { claim: 'Reduction.', text: '3-PGA is reduced to triose phosphate (3 C)' },
    { claim: 'Regeneration.', text: 'Per 3 CO₂ fixed, 6 triose phosphates are made<br>5 rebuild 3 RuBP; 1 leaves the cycle' },
  ],
  refs: [
    { label: 'Bassham et al. 1954', url: 'https://doi.org/10.1021/ja01636a012' },
    { label: 'Calvin 1961 (Nobel lecture)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' },
    { label: 'Sharkey 2019', url: 'https://doi.org/10.1007/s11120-018-0600-2' },
    { label: 'Michelet et al. 2013', url: 'https://doi.org/10.3389/fpls.2013.00470' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: 'Three-phase wheel (drawn)' },
  { id: 'v2', name: 'Carbon squares: 15 C + 3 C = 18 C' },
  { id: 'v3', name: 'The first drawing of the cycle (1954), phases coloured' },
  { id: 'v4', name: 'Michelet 2013 cycle, phases coloured' },
  { id: 'v5', name: 'Phase ring, names only' },
  { id: 'v6', name: 'Three turns make one triose phosphate' },
  { id: 'v7', name: 'The cycle in the chloroplast (drawn)' },
  { id: 'v8', name: '30 s chromatogram mapped onto the cycle' },
];
// No picks on C1 yet (picks.json, 28 Oct 2026): new variants first, then the earlier unpicked ones.
export const VARIANTS: Variant[] = [...NEW, ...OLD];

const NOBEL = '© The Nobel Foundation 1961, www.nobelprize.org';

/* ---------- v1 · the wheel ---------- */

function v1(): string {
  const p = 'fcb1v1';
  return svg(p, 'The Calvin–Benson–Bassham cycle drawn as a wheel, per three CO2. Carboxylation over the top: Rubisco adds 3 CO2 to 3 RuBP, giving 6 3-PGA. Reduction down the right: 6 3-PGA become 6 triose phosphates. Regeneration up the left: 5 of them rebuild 3 RuBP. One triose phosphate leaves the cycle.', `
    ${cycleWheel(p, { cx: 400, cy: 300, r: 165, names: 'out', rubisco: true, counts: true, sectors: true })}
    ${T(400, 590, KEY_ABBR, 'fcb-s', 'middle')}
  `);
}

/* ---------- v2 · carbon squares ---------- */

function v2(): string {
  const p = 'fcb1v2', d = 22, g = 4, rw5 = rowW(5, d, g), rw3 = rowW(3, d, g);
  const rubp = (x: number, y: number, k = 'ccccc'): string => [0, 1, 2].map(i => carbons(x, y + i * 31, k, d, g)).join('');
  const six = (x: number, y: number, kinds: string[]): string => kinds.map((k, i) => carbons(x + (i % 2) * (rw3 + 22), y + Math.floor(i / 2) * 31, k, d, g)).join('');
  const xR = 60, yR = 112, xP = 560, yP = 112, yT = 352;
  return svg(p, 'The cycle counted in carbon atoms, per three CO2. Three RuBP (15 carbons) plus three CO2 (3 new carbons) give six 3-PGA (18 carbons), reduced to six triose phosphates (18 carbons). Five triose phosphates (15 carbons) rebuild the three RuBP; one triose phosphate (3 carbons) leaves the cycle.', `
    ${T(xR + rw5 / 2, yR - 22, '3 RuBP', 'fcb-node', 'middle')}${rubp(xR, yR)}${T(xR + rw5 / 2, yR + 3 * 31 + 24, '15 C', 'fcb-h', 'middle')}
    ${T(400, 46, '3 CO₂', 'fcb-node', 'middle')}${[0, 1, 2].map(i => carbons(361 + i * 28, 60, 'n', d, g)).join('')}
    ${ar(p, 'green', 'M400,90 L400,148', 'fcb-thin')}
    ${ar(p, 'green', `M${xR + rw5 + 18},160 L${xP - 22},160`, 'fcb-fat')}
    ${T(400, 198, 'carboxylation', 'fcb-phase fcb-c-green', 'middle')}${T(400, 224, 'Rubisco', 'fcb-s', 'middle')}
    ${T(xP + rw3 + 11, yP - 22, '6 3-PGA', 'fcb-node', 'middle')}${six(xP, yP, ['ncc', 'ccc', 'ncc', 'ccc', 'ncc', 'ccc'])}${T(xP + rw3 + 11, yP + 3 * 31 + 24, '18 C', 'fcb-h', 'middle')}
    ${ar(p, 'blue', `M${xP + rw3 + 11},${yP + 3 * 31 + 40} L${xP + rw3 + 11},${yT - 14}`, 'fcb-fat')}
    ${T(xP + rw3 + 40, 290, 'reduction', 'fcb-phase fcb-c-blue', 'start')}
    ${six(xP, yT, ['ccc', 'ccc', 'ccc', 'ccc', 'ccc', 'xxx'])}
    ${T(xP + rw3 + 11, yT + 3 * 31 + 24, '6 triose phosphate · 18 C', 'fcb-node', 'middle')}
    ${ar(p, 'amber', `M${xP - 18},${yT + 30} H${xR + rw5 / 2} V${yR + 3 * 31 + 40}`, 'fcb-fat')}
    ${T(330, yT + 62, 'regeneration', 'fcb-phase fcb-c-amber', 'middle')}${T(330, yT + 90, '5 triose phosphate · 15 C', 'fcb-s', 'middle')}
    ${ar(p, 'rust', `M${xP + 2 * rw3 + 30},${yT + 73} H784 V524`, 'fcb-thin')}
    ${T(792, 556, '1 leaves · 3 C', 'fcb-node fcb-c-rust', 'end')}
    ${T(330, 300, '15 C + 3 C = 18 C', 'fcb-big', 'middle')}
    ${carbons(70, 540, 'c', 18, 0, false)}${T(96, 554, 'carbon', 'fcb-s')}${carbons(196, 540, 'n', 18, 0, false)}${T(222, 554, 'from CO₂', 'fcb-s')}${carbons(330, 540, 'x', 18, 0, false)}${T(356, 554, 'leaves the cycle', 'fcb-s')}
  `);
}

/* ---------- v3 · Bassham et al. 1954 Fig. 7, phases coloured under the multiplied scan ---------- */

const BAS: Img = { href: basshamPng, w: 1410, h: 840 };
function v3(): string {
  const p = 'fcb1v3', x0 = 10, y0 = 58, w = 780, s = w / BAS.w;
  const P = (u: number, v: number): Pt => [x0 + u * s, y0 + v * s];
  const zone = (cls: string, u: number, v: number, ru: number, rv: number): string => {
    const [x, y] = P(u, v);
    return `<ellipse class="${cls}" cx="${f(x)}" cy="${f(y)}" rx="${f(ru * s)}" ry="${f(rv * s)}"/>`;
  };
  const b = shot(`${p}-b`, BAS, x0, y0, w, { fig: true });
  const key = (x: number, cls: string, ink: string, s1: string): string =>
    `<rect class="${cls}" x="${x}" y="532" width="30" height="22" rx="6" style="opacity:.5"/>${T(x + 40, 550, s1, `fcb-phase fcb-c-${ink}`)}`;
  return svg(p, 'The first published drawing of the cycle, by Bassham, Benson, Kay, Harris, Wilson and Calvin in 1954, with its parts coloured: carboxylation (CO2 joins a five-carbon sugar and splits into two three-carbon acids) in green, reduction (to triose, with the reducing agent and ATP from light) in blue, regeneration (the loops back to the five-carbon sugars) in amber, and the product (hexose and polysaccharides) in rust.', `
    ${T(400, 34, 'The first drawing of the cycle, 1954', 'fcb-h', 'middle')}
    ${zone('fcb-hl-green', 230, 470, 210, 70)}${zone('fcb-hl-blue', 700, 390, 250, 85)}${zone('fcb-hl-amber', 600, 700, 560, 135)}${zone('fcb-hl-rust', 1270, 370, 150, 120)}
    ${b.svg}
    ${key(40, 'fcb-hl-green', 'green', 'carboxylation')}${key(250, 'fcb-hl-blue', 'blue', 'reduction')}${key(420, 'fcb-hl-amber', 'amber', 'regeneration')}${key(630, 'fcb-hl-rust', 'rust', 'product')}
    ${credit(790, 580, 'Bassham, Benson, Kay, Harris, Wilson & Calvin 1954, J Am Chem Soc 76:1760, Fig. 7|as reproduced in Sharkey 2019, Photosynth Res 140:235, Fig. 2 (later labels removed)')}
  `);
}

/* ---------- v4 · Michelet et al. 2013 Fig. 1, phases coloured under the multiplied figure ---------- */

const MIC: Img = { href: micheletJpg, w: 1600, h: 1191 };
function v4(): string {
  const p = 'fcb1v4', x0 = 8, y0 = 34, w = 600, s = w / MIC.w;
  const R = (u0: number, v0: number, u1: number, v1: number, cls: string, rx = 28): string =>
    `<rect class="${cls}" x="${f(x0 + u0 * s)}" y="${f(y0 + v0 * s)}" width="${f((u1 - u0) * s)}" height="${f((v1 - v0) * s)}" rx="${rx}"/>`;
  const m = shot(`${p}-m`, MIC, x0, y0, w, { fig: true });
  const leg = (y: number, cls: string, ink: string, s1: string, s2: string): string =>
    `<rect class="${cls}" x="628" y="${y - 20}" width="30" height="26" rx="6" style="opacity:.55"/>${T(668, y, s1, `fcb-phase fcb-c-${ink}`)}${T(668, y + 26, s2, 'fcb-s')}`;
  return svg(p, 'The Calvin–Benson–Bassham cycle as drawn by Michelet and colleagues in 2013, with its enzymes, its parts coloured: carboxylation by Rubisco (green), reduction of 3-PGA to G3P with ATP and NADPH (blue), regeneration of ribulose phosphates through many steps (amber), and the G3P that leaves the cycle (rust).', `
    ${R(1000, 360, 1340, 590, 'fcb-hl-green')}${R(840, 595, 1360, 1110, 'fcb-hl-blue')}${R(0, 20, 790, 1180, 'fcb-hl-amber', 60)}${R(790, 1120, 1120, 1191, 'fcb-hl-rust', 16)}
    ${m.svg}
    ${leg(150, 'fcb-hl-green', 'green', 'carboxylation', 'Rubisco')}${leg(250, 'fcb-hl-blue', 'blue', 'reduction', '3-PGA → G3P')}
    ${leg(350, 'fcb-hl-amber', 'amber', 'regeneration', 'G3P → RuBP')}${leg(450, 'fcb-hl-rust', 'rust', 'product', '1 G3P per 3 CO₂')}
    ${T(628, 530, 'G3P: glyceraldehyde', 'fcb-s')}${T(628, 554, '3-phosphate, a triose', 'fcb-s')}${T(628, 578, 'phosphate', 'fcb-s')}
    ${credit(8, y0 + m.h + 18, 'Michelet et al. 2013, Front Plant Sci 4:470, Fig. 1 · CC BY', 'start')}
  `);
}

/* ---------- v5 · phase ring, names only ---------- */

function v5(): string {
  const p = 'fcb1v5', cx = 400, cy = 305, r0 = 120, r1 = 205;
  const sec = (a0: number, a1: number, cls: string): string => `<path class="${cls}" d="${sectorD(cx, cy, r0, r1, a0, a1)}" style="opacity:.22"/>`;
  const name = (a: number, s: string, ink: string): string => { const [x, y] = polar(cx, cy, (r0 + r1) / 2 + 12, a); return T(x, y + 10, s, `fcb-phase fcb-c-${ink}`, 'middle', ' style="font-size:28px"'); };
  const [tx, ty] = polar(cx, cy, r1 + 6, -90), [ox, oy] = polar(cx, cy, r1 + 4, 90);
  return svg(p, 'The cycle as a ring of three phases: carboxylation at the top, where CO2 enters; reduction on the right; regeneration on the left; triose phosphate leaves at the bottom.', `
    ${sec(-150 + 2, -30 - 2, 'fcb-sector-green')}${sec(-30 + 2, 90 - 2, 'fcb-sector-blue')}${sec(90 + 2, 210 - 2, 'fcb-sector-amber')}
    ${ar(p, 'green', arcD(cx, cy, r0 + 14, -144, -40), 'fcb-thin')}${ar(p, 'blue', arcD(cx, cy, r0 + 14, -24, 80), 'fcb-thin')}${ar(p, 'amber', arcD(cx, cy, r0 + 14, 96, 200), 'fcb-thin')}
    ${name(-90, 'carboxylation', 'green')}${name(30, 'reduction', 'blue')}${name(150, 'regeneration', 'amber')}
    ${ar(p, 'green', `M${f(tx)},${f(ty - 70)} L${f(tx)},${f(ty - 4)}`, 'fcb-fat')}${T(tx, ty - 80, 'CO₂', 'fcb-big', 'middle')}
    ${ar(p, 'rust', `M${f(ox)},${f(oy)} L${f(ox)},${f(oy + 52)}`, 'fcb-fat')}${T(ox + 18, oy + 50, 'triose phosphate', 'fcb-big fcb-c-rust', 'start')}
    ${T(cx, cy - 8, 'stroma', 'fcb-l fcb-c-grey', 'middle')}
  `);
}

/* ---------- v6 · three turns, one triose phosphate ---------- */

function v6(): string {
  const p = 'fcb1v6', d = 26, g = 4;
  const mini = (cy: number, i: number): string => {
    const cx = 200, r = 48;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#d3d0c6" stroke-width="7"/>${ar(p, 'grey', arcD(cx, cy, r, -60, 250), 'fcb-thin')}
      ${carbons(cx - d / 2, cy - r - d - 26, 'n', d, g)}${ar(p, 'amber', `M${cx},${cy - r - 24} L${cx},${cy - r - 6}`, 'fcb-thin')}
      ${T(cx - 76, cy + 8, `CO₂ ${i}`, 'fcb-node', 'end')}
      ${ar(p, 'amber', `M${cx + r + 18},${cy} C${cx + 160},${cy} 430,${300} 488,${300}`, 'fcb-thin fcb-dash')}`;
  };
  return svg(p, 'Three turns of the cycle each fix one CO2. The cycle keeps its own carbon as RuBP; the net gain of three turns is one triose phosphate, three carbons, equal to the three CO2 fixed.', `
    ${mini(118, 1)}${mini(300, 2)}${mini(482, 3)}
    ${T(200, 305, 'turn', 'fcb-s', 'middle')}${T(200, 123, 'turn', 'fcb-s', 'middle')}${T(200, 487, 'turn', 'fcb-s', 'middle')}
    ${carbons(500, 287, 'nnn', d, g)}
    ${T(500 + rowW(3, d, g) / 2, 226, '1 triose', 'fcb-big fcb-c-rust', 'middle')}${T(500 + rowW(3, d, g) / 2, 262, 'phosphate', 'fcb-big fcb-c-rust', 'middle')}
    ${T(500 + rowW(3, d, g) / 2, 360, '3 C gained', 'fcb-h', 'middle')}
    ${T(500 + rowW(3, d, g) / 2, 392, 'per 3 CO₂ fixed', 'fcb-l', 'middle')}
    ${T(680, 470, 'RuBP is rebuilt', 'fcb-l fcb-c-grey', 'middle')}${T(680, 496, 'in every turn', 'fcb-l fcb-c-grey', 'middle')}
  `);
}

/* ---------- v7 · the cycle in the chloroplast (drawn) ---------- */

function v7(): string {
  const p = 'fcb1v7', cx = 400, cy = 300;
  const granum = (x: number, y: number, n: number): string => Array.from({ length: n }, (_, i) =>
    `<rect class="fcb-thyl" x="${x}" y="${y + i * 11}" width="74" height="9" rx="4.5"/>`).join('');
  return svg(p, 'A chloroplast drawn in outline: the cycle runs in the stroma, the space around the green thylakoid stacks. CO2 enters from the cell; triose phosphate leaves to the cytosol.', `
    <ellipse cx="${cx}" cy="${cy}" rx="372" ry="232" fill="#f8f4ea" stroke="#c9c6bc" stroke-width="1.6"/>
    <ellipse class="fcb-stroma" cx="${cx}" cy="${cy}" rx="350" ry="212"/>
    ${granum(108, 210, 6)}${granum(132, 360, 5)}${granum(612, 196, 6)}${granum(598, 356, 5)}
    ${cycleWheel(p, { cx, cy: 318, r: 128, names: false, counts: false, sectors: true, out: '', co2: false })}
    ${ar(p, 'green', 'M400,22 L400,184', 'fcb-thin')}${T(412, 46, 'CO₂', 'fcb-big', 'start')}
    ${ar(p, 'rust', 'M486,460 Q530,500 548,540', 'fcb-thin')}${T(560, 552, 'triose phosphate', 'fcb-node fcb-c-rust', 'start')}${T(560, 578, 'to the cytosol', 'fcb-s', 'start')}
    ${T(145, 334, 'thylakoids', 'fcb-s fcb-c-green', 'middle')}${T(640, 166, 'thylakoids', 'fcb-s fcb-c-green', 'middle')}
    ${T(400, 326, 'stroma', 'fcb-h fcb-c-grey', 'middle')}
    ${T(64, 556, 'chloroplast envelope', 'fcb-s fcb-c-grey', 'start')}
  `);
}

/* ---------- v8 · the 30 s chromatogram, its spots coloured by phase, beside a small wheel ---------- */

const S30: Img = { href: s30Png, w: 1348, h: 1053 };
function v8(): string {
  const p = 'fcb1v8', x0 = 6, y0 = 80, w = 470;
  const a = shot(`${p}-a`, S30, x0, y0, w, { fig: true });
  const ring = (u: number, v: number, ru: number, rv: number, stroke: string): string => {
    const [x, y] = a.at(u, v);
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(ru * a.s)}" ry="${f(rv * a.s)}" fill="none" stroke="${stroke}" stroke-width="3.2"/>`;
  };
  return svg(p, 'Left: the chromatogram of Chlorella after 30 seconds in carbon-14 dioxide, its spots coloured by their place in the cycle: 3-PGA (green), triose and sugar phosphates (blue), sugar bisphosphates, mainly RuBP (amber), and sucrose (rust). Right: the cycle wheel in the same colours.', `
    ${a.svg}
    ${ring(930, 700, 62, 78, '#2a963a')}${ring(780, 760, 190, 62, '#2350e6')}${ring(1100, 850, 78, 66, '#c07a12')}${ring(300, 636, 82, 40, '#a9532f')}
    ${pill(130, 46, '30 s in ¹⁴CO₂', undefined, true)}
    ${pill(400, 460, '3-PGA', a.at(940, 760), true)}${pill(190, 460, 'sugar phosphates', a.at(700, 750), true)}
    ${pill(110, 540, 'sucrose', a.at(300, 660), true)}${pill(400, 540, 'RuBP', a.at(1060, 880), true)}
    ${cycleWheel(p, { cx: 650, cy: 280, r: 104, names: false, counts: false, sectors: true, out: '', co2: false, k: 0.95 })}
    ${T(650, 112, 'the same colours', 'fcb-s', 'middle')}${T(650, 138, 'on the cycle', 'fcb-s', 'middle')}
    ${ar(p, 'rust', 'M700,412 Q712,444 724,470', 'fcb-thin')}${T(724, 500, 'sucrose', 'fcb-node fcb-c-rust', 'middle')}
    ${credit(8, 592, `Calvin 1961, Nobel lecture, Fig. 5 · ${NOBEL}`, 'start')}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8 };
export function draw(id: string): string {
  return DRAW[id] ? DRAW[id]() : oldDraw(id);
}
