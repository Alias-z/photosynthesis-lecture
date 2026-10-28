// Slide C06 · Photorespiration recovers carbon at a cost. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Checked facts only (research/review-2026-10-23-claude/D_C01-C06.md rows 51–67, REVIEW_SUMMARY.md §2, §5a, §6, §7 #6):
// 2 × 2-PG → glycolate → glyoxylate → glycine; GDC + SHMT turn 2 glycine into serine + CO₂ + NH₃; serine returns via
// glycerate (1 ATP) to 3-PGA; 4 C in → 3 C back + 1 CO₂ (25 % of the 2-PG carbon, not of photosynthesis);
// NH₃ re-fixing costs ATP + reductant; per oxygenation 3.5 ATP + 2 NADPH and −0.5 C, per carboxylation 3 ATP + 2 NADPH
// and +1 C; net gain = Vc − 0.5 Vo; 4.76 ATP per net C at Vo/Vc = 0.3 (worked example); pglp mutants cannot grow in
// air (Somerville & Ogren 1979); field tobacco bypass +11–24 % biomass (+26 % at +5 °C), trials small (Cavanagh 2022) (South 2019;
// Meacham-Hensold 2026); the AP3 bypass releases all glycolate carbon as CO₂ inside the chloroplast.
// Vocabulary: carbon = bead (dark in the cycle, clay while in photorespiration), CO₂ / O₂ / NH₃ = atom balls,
// RuBP = pentagon, Rubisco = warm grey block, ATP / NADPH = tags, photorespiration = clay and dashed.
import type { PlateText, Variant } from '../types';
import { arrow, text as t } from '../mechanisms';
import { illusHeads, molecule, tag } from '../illus';
import { draw as c5draw } from './c5';
import './c06.css';

export const PLATE: PlateText = {
  n: 'C6',
  title: 'Photorespiration recovers carbon at a cost',
  status: 'draft',
  lead: 'Photorespiration recycles 2-phosphoglycolate (2-PG), Rubisco’s O₂ product: 3 of every 4 carbons return, 1 is lost as CO₂.',
  points: [
    { claim: 'Three organelles, one CO₂ lost.', text: 'In mitochondria, two glycine become serine, CO₂ and NH₃; serine is recycled to 3-PGA.' },
    { claim: 'Recycling costs energy.', text: 'At 3 oxygenations per 10 carboxylations, each CO₂ gained costs ≈ 4.8 ATP + 3.1 NADPH instead of 3 + 2.' },
    { claim: 'Essential, and it feeds metabolism.', text: 'Mutants lacking a core step survive only in high CO₂; 23–41 % of the pathway’s carbon leaves as serine for amino acids.' },
  ],
  refs: [
    { label: 'von Caemmerer et al. 2025', url: 'https://doi.org/10.1007/s00425-025-04834-7' },
    { label: 'Somerville & Ogren 1979', url: 'https://doi.org/10.1038/280833a0' },
    { label: 'South et al. 2019', url: 'https://doi.org/10.1126/science.aat9077' },
    { label: 'Cavanagh et al. 2022', url: 'https://doi.org/10.1111/pbi.13750' },
    { label: 'Fu et al. 2023', url: 'https://doi.org/10.1038/s41477-022-01294-9' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Thesis scheme' },
  { id: 'b', name: 'Three organelles', anim: true },
  { id: 'c', name: 'Four steps', anim: true },
  { id: 'e', name: 'Air-sick mutant' },
  { id: 'f', name: 'Net gain' },
  { id: 'g', name: 'Native vs bypass' },
  { id: 'h', name: 'Cost curve' },
  { id: 'i', name: 'Glycine step' },
  { id: 'j', name: 'Four to three' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return organelles();
    case 'c': return fourSteps();
    case 'd': return recycling();
    case 'e': return mutant();
    case 'f': return netGain();
    case 'g': return bypass();
    case 'h': return costCurve();
    case 'i': return glycineStep();
    case 'j': return fourToThree();
    default: return c5draw('a');
  }
}

/* ---------- shared parts (also used by C07) ---------- */

export const n1 = (v: number): string => v.toFixed(1);

export const svg = (p: string, label: string, body: string, cls = 'fc06'): string =>
  `<svg class="fig-svg fc06 ${cls}" viewBox="0 0 800 600" role="img" aria-label="${label}">${illusHeads(p)}${body}</svg>`;

/** Carbon skeleton: n beads on a bond; clay while the carbon is in photorespiration. */
export function chain(x: number, y: number, n: number, pr = false, r = 8, gap = 20): string {
  const x0 = x - ((n - 1) * gap) / 2;
  const bond = n > 1 ? `<path class="fc06-bond${pr ? ' fc06-bond-pr' : ''}" d="M${n1(x0)},${y} H${n1(x0 + (n - 1) * gap)}"/>` : '';
  return bond + Array.from({ length: n }, (_, i) => `<circle class="bead${pr ? ' bead-pr' : ''}" cx="${n1(x0 + i * gap)}" cy="${y}" r="${r}"/>`).join('');
}

/** Chloroplast: double envelope and, optionally, a row of grana stacks. */
export function chloroplast(cx: number, cy: number, rx: number, ry: number, grana = 0, faded = false): string {
  const f = faded ? ' fc06-faded' : '';
  let s = `<ellipse class="fc06-chl${f}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><ellipse class="fc06-chl-in${f}" cx="${cx}" cy="${cy}" rx="${rx - 6}" ry="${ry - 6}"/>`;
  for (let i = 0; i < grana; i++) {
    const gx = cx - rx * 0.6 + (grana > 1 ? (i * rx * 1.2) / (grana - 1) : rx * 0.6);
    for (let k = 0; k < 3; k++) s += `<rect class="fc06-gra${f}" x="${n1(gx - 9)}" y="${n1(cy - 9 + k * 6)}" width="18" height="5" rx="2.5"/>`;
  }
  return s;
}

/** Peroxisome: single membrane with a small crystalline core. */
export const peroxisome = (cx: number, cy: number, r: number, core = true, faded = false): string =>
  `<circle class="fc06-per${faded ? ' fc06-faded' : ''}" cx="${cx}" cy="${cy}" r="${r}"/>` +
  (core ? `<rect class="fc06-core" x="${n1(cx - r * 0.18)}" y="${n1(cy - r * 0.18)}" width="${n1(r * 0.36)}" height="${n1(r * 0.36)}" rx="3" transform="rotate(20 ${cx} ${cy})"/>` : '');

/** Mitochondrion: outer membrane plus short cristae folding in from top and bottom; the centre stays free for labels. */
export function mitochondrion(cx: number, cy: number, rx: number, ry: number, k = 5, faded = false, off = false): string {
  const f = faded ? ' fc06-faded' : '';
  let s = `<ellipse class="fc06-mit${off ? ' fc06-mit-off' : ''}${f}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
  for (let i = 0; i < k; i++) {
    const x = cx - rx * 0.66 + (k > 1 ? (i * rx * 1.32) / (k - 1) : rx * 0.66);
    const edge = ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) - 4;
    const len = Math.min(edge * 0.55, 34), top = i % 2 === 0;
    const y0 = top ? cy - edge : cy + edge, y1 = top ? y0 + len : y0 - len;
    s += `<path class="fc06-cri${f}" d="M${n1(x)},${n1(y0)} V${n1(y1)}"/>`;
  }
  return s;
}

/** Ammonia: one nitrogen ball with three hydrogens. */
export function nh3(x: number, y: number, r = 12): string {
  const h = (dx: number, dy: number): string => `<circle class="atom atom-H" cx="${n1(x + dx)}" cy="${n1(y + dy)}" r="${n1(r * 0.55)}"/>`;
  return h(-r * 1.05, r * 0.75) + h(r * 1.05, r * 0.75) + h(0, -r * 1.2) +
    `<circle class="atom atom-N" cx="${x}" cy="${y}" r="${r}"/><text class="atom-t atom-t-N" x="${x}" y="${n1(y + r * 0.42)}" text-anchor="middle">N</text>`;
}

/** RuBP as the thesis draws it: a pentagon. */
export function pent(x: number, y: number, r: number, label = ''): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${n1(x + r * Math.cos(a))},${n1(y + r * Math.sin(a))}`;
  }).join(' ');
  return `<polygon class="node node-rubp" points="${pts}"/>${label ? t(x, y + 7, label, 'fc06-in') : ''}`;
}

/** Rubisco: a warm grey block. */
export const rubisco = (x: number, y: number, w = 112, h = 38, label = 'Rubisco'): string =>
  `<rect class="node node-rub" x="${n1(x - w / 2)}" y="${n1(y - h / 2)}" width="${w}" height="${h}" rx="12"/>${t(x, y + 8, label, 'fc06-b')}`;

export const num = (x: number, y: number, k: number): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="16"/>${t(x, y + 6.5, `${k}`, 'num-t')}`;

const pill = (x: number, y: number, w: number, s: string, cls = 'node', tcls = 'fc06-b', h = 40): string =>
  `<rect class="${cls}" x="${n1(x - w / 2)}" y="${n1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${t(x, y + 8, s, tcls)}`;


/** A thin curved leader from a term to the card that explains it. */
const leader = (d: string): string => `<path class="fc06-lead" d="${d}"/>`;

/* ---------- B · three organelles: the carbon trace ---------- */

function organelles(): string {
  const p = 'fc06b';
  const yF = 236, yR = 352;
  return svg(p, 'Photorespiration as a carbon trace through chloroplast, peroxisome and mitochondrion: four carbons in, three back as PGA, one lost as CO₂; NH₃ is re-fixed in the chloroplast',
    `<g transform="translate(0 28)">
    ${chloroplast(128, 300, 112, 190)}${peroxisome(400, 294, 92, false)}${mitochondrion(660, 294, 124, 112, 6)}
    ${t(128, 440, 'chloroplast', 'fc06-b fc06-chl-t')}${t(400, 302, 'peroxisome', 'fc06-b fc06-per-t')}${t(646, 302, 'mitochondrion', 'fc06-b fc06-mit-t')}

    ${molecule(56, 182, 'OO', 10)}${arrow(p, 'clay', 'M80,182 L92,182')}${rubisco(150, 182, 104, 36)}
    ${arrow(p, 'clay', 'M150,202 L150,220')}
    ${chain(132, yF, 2, true)}${chain(184, yF, 2, true)}${t(158, yF + 32, '2 × 2-PG', 'fc06-b fc06-pr')}

    ${arrow(p, 'clay', `M232,${yF} L322,${yF}`, 'dashed')}${t(278, yF - 18, 'glycolate', 'fc06-s')}
    ${chain(378, yF, 2, true)}${chain(424, yF, 2, true)}
    ${arrow(p, 'clay', `M476,${yF} L548,${yF}`, 'dashed')}${t(512, yF - 18, 'glycine', 'fc06-s')}
    ${chain(612, yF, 2, true)}${chain(658, yF, 2, true)}
    ${arrow(p, 'clay', `M708,${yF + 10} C750,${yF + 40} 750,${yR - 40} 708,${yR - 10}`)}
    ${chain(640, yR, 3, true)}
    ${arrow(p, 'clay', `M548,${yR} L476,${yR}`, 'dashed')}${t(512, yR + 36, 'serine', 'fc06-s')}
    ${chain(400, yR, 3, true)}
    ${arrow(p, 'clay', `M322,${yR} L240,${yR}`, 'dashed')}${t(282, yR + 36, 'glycerate', 'fc06-s')}${tag(198, yR - 34, 'ATP', 'atp')}
    ${chain(160, yR, 3)}${t(160, yR + 32, 'PGA', 'fc06-b')}

    ${arrow(p, 'clay', 'M700,184 L728,128', 'dashed')}${molecule(742, 106, 'OCO', 11)}
    ${t(722, 92, '1 C lost', 'fc06-b fc06-pr', 'end')}

    <path class="ar ar-ink dashed" d="M640,406 C640,470 610,500 560,500 L250,500 C214,500 196,494 184,480" marker-end="url(#${p}-ink)"/>
    ${nh3(690, 462)}${t(714, 470, 'NH₃', 'fc06-b', 'start')}
    ${t(400, 534, 're-fixed in the chloroplast', 'fc06-s')}${tag(320, 470, 'ATP', 'atp')}${tag(420, 470, 'NADPH', 'nadph')}
    </g>`);
}

/* ---------- C · four numbered steps ---------- */

function fourSteps(): string {
  const p = 'fc06c';
  const W = 390, H = 288;
  const card = (k: number, x: number, y: number, kind: 'chl' | 'per' | 'mit', head: string, body: string, cap: string[]): string =>
    `<rect class="fc06-card fc06-card-${kind}" x="${x}" y="${y}" width="${W}" height="${H}" rx="18"/>
     ${num(x + 32, y + 36, k)}${t(x + 58, y + 44, head, 'fc06-h', 'start')}
     ${body}
     ${cap.map((s, i) => t(x + W / 2, y + 240 + i * 30, s, 'fc06-s')).join('')}`;
  const icon = (kind: 'chl' | 'per' | 'mit', x: number, y: number): string =>
    kind === 'chl' ? chloroplast(x, y, 34, 20, 2) : kind === 'per' ? peroxisome(x, y, 18) : mitochondrion(x, y, 32, 19, 4);
  const X = [4, 406], Y = [4, 306];
  const plus = (x: number, y: number): string => t(x, y + 9, '+', 'fc06-h');
  return svg(p, 'Photorespiration in four numbered steps: Rubisco takes O₂, glycolate becomes glycine, two glycine give serine, CO₂ and NH₃, serine returns as PGA and NH₃ is re-fixed',
    `${card(1, X[0], Y[0], 'chl', 'Chloroplast', `${icon('chl', X[0] + 340, Y[0] + 36)}
        ${pent(X[0] + 44, Y[0] + 128, 24)}${plus(X[0] + 84, Y[0] + 128)}${molecule(X[0] + 118, Y[0] + 128, 'OO', 11)}
        ${arrow(p, 'clay', `M${X[0] + 146},${Y[0] + 128} L${X[0] + 186},${Y[0] + 128}`)}
        ${chain(X[0] + 232, Y[0] + 128, 3)}${plus(X[0] + 280, Y[0] + 128)}${chain(X[0] + 324, Y[0] + 128, 2, true)}
        ${t(X[0] + 44, Y[0] + 178, 'RuBP', 'fc06-s')}${t(X[0] + 118, Y[0] + 178, 'O₂', 'fc06-s')}${t(X[0] + 232, Y[0] + 178, 'PGA', 'fc06-s')}${t(X[0] + 324, Y[0] + 178, '2-PG', 'fc06-b fc06-pr')}`,
      ['two 2-PG (4 C) leave as glycolate'])}
    ${card(2, X[1], Y[0], 'per', 'Peroxisome', `${icon('per', X[1] + 350, Y[0] + 36)}
        ${chain(X[1] + 60, Y[0] + 128, 2, true)}${chain(X[1] + 116, Y[0] + 128, 2, true)}
        ${arrow(p, 'clay', `M${X[1] + 156},${Y[0] + 128} L${X[1] + 222},${Y[0] + 128}`)}
        ${chain(X[1] + 270, Y[0] + 128, 2, true)}${chain(X[1] + 326, Y[0] + 128, 2, true)}
        ${t(X[1] + 88, Y[0] + 178, 'glycolate', 'fc06-s')}${t(X[1] + 298, Y[0] + 178, 'glycine', 'fc06-s')}`,
      ['via glyoxylate; still 4 C'])}
    ${card(3, X[0], Y[1], 'mit', 'Mitochondrion', `${icon('mit', X[0] + 340, Y[1] + 36)}
        ${chain(X[0] + 52, Y[1] + 112, 2, true)}${chain(X[0] + 52, Y[1] + 144, 2, true)}${t(X[0] + 52, Y[1] + 186, '2 glycine', 'fc06-s')}
        ${arrow(p, 'clay', `M${X[0] + 96},${Y[1] + 128} L${X[0] + 134},${Y[1] + 128}`)}
        ${chain(X[0] + 180, Y[1] + 128, 3, true)}${t(X[0] + 180, Y[1] + 186, 'serine', 'fc06-s')}
        ${molecule(X[0] + 272, Y[1] + 128, 'OCO', 11)}${t(X[0] + 272, Y[1] + 186, 'CO₂', 'fc06-b fc06-pr')}
        ${nh3(X[0] + 348, Y[1] + 132, 11)}${t(X[0] + 348, Y[1] + 186, 'NH₃', 'fc06-s')}`,
      ['one carbon lost as CO₂'])}
    ${card(4, X[1], Y[1], 'chl', 'Back to the chloroplast', `
        ${chain(X[1] + 60, Y[1] + 104, 3, true)}${t(X[1] + 54, Y[1] + 140, 'serine', 'fc06-s')}
        ${arrow(p, 'clay', `M${X[1] + 100},${Y[1] + 104} L${X[1] + 208},${Y[1] + 104}`)}${tag(X[1] + 154, Y[1] + 80, 'ATP', 'atp')}${t(X[1] + 154, Y[1] + 134, 'via glycerate', 'fc06-n')}
        ${chain(X[1] + 250, Y[1] + 104, 3)}${t(X[1] + 256, Y[1] + 140, 'PGA', 'fc06-b')}
        ${nh3(X[1] + 44, Y[1] + 180, 11)}${t(X[1] + 66, Y[1] + 188, 'NH₃ re-fixed', 'fc06-s', 'start')}
        ${tag(X[1] + 248, Y[1] + 180, 'ATP', 'atp')}${tag(X[1] + 334, Y[1] + 180, 'NADPH', 'nadph')}`,
      ['3 C return as PGA'])}`);
}

/* ---------- D · analogy: a recycling plant with a chimney and a power bill ---------- */

function recycling(): string {
  const p = 'fc06d';
  const brick = (x: number, y: number, pr = true): string => `<rect class="fc06-brick${pr ? ' fc06-brick-pr' : ''}" x="${x - 12}" y="${y - 10}" width="24" height="20" rx="4"/>`;
  const part = (x: number, y: number, n: number, pr = true): string => Array.from({ length: n }, (_, i) => brick(x - ((n - 1) * 26) / 2 + i * 26, y, pr)).join('');
  const shed = (x0: number, x1: number, y0: number, y1: number, cls: string): string =>
    `<path class="fc06-shed ${cls}" d="M${x0},${y1} V${y0 + 30} L${(x0 + x1) / 2},${y0} L${x1},${y0 + 30} V${y1} Z"/>`;
  const both = (x: number, y: number, it: string, real: string, cls = 'fc06-b', a: 'start' | 'middle' | 'end' = 'middle'): string =>
    t(x, y, it, 'fc06-it', a) + t(x, y + 26, real, cls, a);
  return svg(p, 'Analogy: photorespiration as a recycling plant. Misprinted parts (2-PG) pass three workshops (chloroplast, peroxisome, mitochondrion); three of four pieces return to the main line as PGA, one goes up the chimney as CO₂, and every run is paid in ATP and NADPH',
    `<rect class="node node-rub" x="16" y="44" width="184" height="100" rx="14"/>${both(108, 88, 'stamping press', 'Rubisco')}
    <rect class="fc06-belt" x="214" y="96" width="566" height="20" rx="10"/>
    ${both(497, 54, 'main assembly line', 'Calvin–Benson cycle')}
    ${arrow(p, 'clay', 'M108,148 L108,186', 'dashed')}${part(108, 206, 2)}${part(108, 232, 2)}
    ${both(150, 208, 'misprints', '2 × 2-PG', 'fc06-b fc06-pr', 'start')}
    ${arrow(p, 'clay', 'M108,252 L108,316', 'dashed')}

    ${shed(16, 216, 322, 476, 'fc06-shed-chl')}${shed(296, 496, 322, 476, 'fc06-shed-per')}${shed(576, 776, 322, 476, 'fc06-shed-mit')}
    <rect class="fc06-chim" x="600" y="272" width="28" height="70"/>
    ${both(116, 408, 'workshop 1', 'chloroplast', 'fc06-b fc06-chl-t')}${both(396, 408, 'workshop 2', 'peroxisome', 'fc06-b fc06-per-t')}${both(676, 408, 'workshop 3', 'mitochondrion', 'fc06-b fc06-mit-t')}
    ${part(256, 392, 2)}${part(256, 418, 2)}${arrow(p, 'clay', 'M222,450 L290,450', 'dashed')}
    ${part(536, 392, 2)}${part(536, 418, 2)}${arrow(p, 'clay', 'M502,450 L570,450', 'dashed')}

    ${brick(614, 252)}${molecule(614, 220, 'OCO', 10)}
    ${both(578, 214, 'up the chimney', '1 piece: CO₂', 'fc06-b fc06-pr', 'end')}
    ${arrow(p, 'ink', 'M744,330 L744,126')}${part(744, 228, 3, false)}
    ${both(702, 150, '3 pieces back', 'PGA (3 C)', 'fc06-b', 'end')}

    <circle class="fc06-meter" cx="52" cy="548" r="30"/><path class="fc06-needle" d="M52,548 L72,530"/>
    ${t(98, 540, 'power bill for every run', 'fc06-it', 'start')}${tag(132, 574, 'ATP', 'atp')}${tag(230, 574, 'NADPH', 'nadph')}
    ${t(780, 586, 'italic: the analogy · bold: the real part', 'fc06-n', 'end')}`);
}

/* ---------- E · evidence: without the first step, plants fail in air ---------- */

function mutant(): string {
  const p = 'fc06e';
  const rosette = (cx: number, cy: number, n: number, L: number, cls: string): string => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = -170 + (i * 160) / (n - 1);
      const r = (a * Math.PI) / 180, lx = cx + Math.cos(r) * L * 0.5, ly = cy + Math.sin(r) * L * 0.5;
      s += `<ellipse class="${cls}" cx="${n1(lx)}" cy="${n1(ly)}" rx="${n1(L * 0.5)}" ry="${n1(L * 0.2)}" transform="rotate(${n1(a)} ${n1(lx)} ${n1(ly)})"/>`;
    }
    return s;
  };
  const pot = (cx: number, y: number): string => `<path class="fc06-pot" d="M${cx - 62},${y} H${cx + 62} L${cx + 48},${y + 70} H${cx - 48} Z"/><rect class="fc06-soil" x="${cx - 66}" y="${y - 8}" width="132" height="12" rx="4"/>`;
  const strip = (x: number, y: number, ok: boolean): string => {
    const xs = [x + 40, x + 140, x + 270];
    return `${molecule(xs[0], y, 'OO', 12)}${t(xs[0], y + 36, 'O₂', 'fc06-s')}
      ${arrow(p, 'clay', `M${xs[0] + 30},${y} L${xs[1] - 44},${y}`)}
      ${ok ? chain(xs[1], y, 2, true) : `${chain(xs[1], y, 2, true)}${chain(xs[1], y - 26, 2, true)}${chain(xs[1], y - 52, 2, true)}`}
      ${t(xs[1], y + 36, '2-PG', 'fc06-b fc06-pr')}
      ${ok ? arrow(p, 'clay', `M${xs[1] + 30},${y} L${xs[2] - 42},${y}`, 'dashed') : `<path class="ar ar-clay dashed fc06-faded" d="M${xs[1] + 30},${y} L${xs[2] - 42},${y}"/><path class="fc06-block" d="M${(xs[1] + xs[2]) / 2 - 11},${y - 13} l22,26 M${(xs[1] + xs[2]) / 2 + 11},${y - 13} l-22,26"/>`}
      ${ok ? chain(xs[2], y, 3) : `<rect class="fc06-gone" x="${xs[2] - 30}" y="${y - 12}" width="60" height="24" rx="12"/>`}
      ${t(xs[2], y + 36, ok ? 'PGA back' : 'no PGA back', ok ? 'fc06-b' : 'fc06-s')}`;
  };
  return svg(p, 'Evidence: an Arabidopsis mutant lacking the first enzyme of photorespiration cannot grow in air; 2-phosphoglycolate piles up and no carbon returns',
    `${t(200, 40, 'wild type, in air', 'fc06-h')}${t(600, 40, 'mutant without step 1, in air', 'fc06-h')}
    <path class="rule" d="M400,20 V520"/>
    ${rosette(200, 214, 9, 104, 'fc06-leaf')}${pot(200, 222)}
    ${rosette(600, 214, 6, 40, 'fc06-leaf fc06-leaf-sick')}${pot(600, 222)}
    ${t(200, 336, 'grows', 'fc06-b')}${t(600, 336, 'cannot grow', 'fc06-b fc06-pr')}
    ${strip(40, 446, true)}${strip(440, 446, false)}
    ${t(616, 404, '2-PG piles up', 'fc06-s', 'start')}
    ${t(200, 520, 'carbon recovered', 'fc06-s')}${t(600, 520, 'carbon stranded', 'fc06-s')}
    <path class="rule" d="M20,548 H780"/>
    ${t(400, 584, 'Arabidopsis; Somerville & Ogren 1979. Step 1: 2-PG → glycolate.', 'fc06-n')}`);
}

/* ---------- F · equation-anchored: photorespiration runs part of the equation backwards ---------- */

function netGain(): string {
  const p = 'fc06f';
  // The equation in textbook notation: light written over the reaction arrow, as on slide 1.
  const terms: Array<[string, number]> = [['6 CO₂', 120], ['+', 212], ['6 H₂O', 296], ['C₆H₁₂O₆', 494], ['+', 594], ['6 O₂', 672]];
  const rx = `<path class="fc06-rx" d="M354,73 H${420 - 6}"/><path class="fc06-rxh" d="M422,73 L412,68 L412,78 Z"/>${t(388, 62, 'light', 'fc06-rxl')}`;
  const V = (x: number, y: number, sub: string, pre = ''): string =>
    `<text class="fc06-eq" x="${x}" y="${y}">${pre}V<tspan class="fc06-sub" dy="9">${sub}</tspan></text>`;
  return svg(p, 'Equation view, 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ with light over the arrow: photorespiration takes up O₂ and releases CO₂ in the light; net carbon gain equals carboxylations minus half the oxygenations',
    `<rect class="fc06-hl" x="66" y="48" width="108" height="50" rx="10"/><rect class="fc06-hl" x="628" y="48" width="88" height="50" rx="10"/>
    ${terms.map(([s, x]) => t(x, 84, s.replace(/[₀-₉]+/g, m => `<tspan class="fc06-low">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`), 'fc06-eq')).join('')}${rx}
    <path class="ar ar-clay dashed" d="M672,102 C672,150 600,164 522,164" marker-end="url(#${p}-clay)"/>
    ${pill(400, 164, 230, 'photorespiration', 'node node-pr', 'fc06-b fc06-pr', 44)}
    <path class="ar ar-clay dashed" d="M284,164 C200,164 120,150 120,106" marker-end="url(#${p}-clay)"/>
    ${t(700, 210, 'O₂ taken up', 'fc06-s', 'end')}${t(100, 210, 'CO₂ released', 'fc06-s', 'start')}

    <path class="rule" d="M30,252 H770"/>
    ${t(440, 312, 'net carbon gain =', 'fc06-eq', 'end')}${V(454, 312, 'c')}${t(518, 312, '−', 'fc06-eq')}${V(548, 312, 'o', '½ ')}
    ${leader('M470,326 C470,350 220,340 210,370')}${leader('M590,326 C590,350 590,350 590,370')}

    <rect class="fc06-card" x="40" y="372" width="340" height="168" rx="16"/>
    ${t(210, 408, 'each carboxylation', 'fc06-b')}
    ${molecule(150, 458, 'OCO', 14)}${arrow(p, 'ink', 'M188,458 L234,458')}${chain(266, 458, 1, false, 13)}
    ${t(210, 516, '+1 C', 'fc06-pl')}

    <rect class="fc06-card fc06-card-pr" x="420" y="372" width="340" height="168" rx="16"/>
    ${t(590, 408, 'two oxygenations', 'fc06-b fc06-pr')}
    ${molecule(484, 442, 'OO', 12)}${molecule(484, 474, 'OO', 12)}${arrow(p, 'clay', 'M514,458 L562,458', 'dashed')}
    ${molecule(610, 458, 'OCO', 14)}${arrow(p, 'clay', 'M648,458 L700,458')}${t(710, 466, 'out', 'fc06-s', 'start')}
    ${t(590, 516, '−1 C', 'fc06-pl fc06-pr')}
    ${t(400, 586, 'Vc, Vo: rates of the two Rubisco reactions; gain before day respiration', 'fc06-n')}`);
}

/* ---------- G · native route vs an engineered bypass ---------- */

function bypass(): string {
  const p = 'fc06g';
  const parts = (cy: number, eng: boolean): string =>
    `${chloroplast(180, cy, 150, 84)}${peroxisome(420, cy, 44, false, eng)}${mitochondrion(558, cy, 64, 42, 4, eng)}
    ${t(180, cy + 112, 'chloroplast', 'fc06-n')}${t(420, cy + 70, 'peroxisome', 'fc06-n')}${t(558, cy + 70, 'mitochondrion', 'fc06-n')}`;
  const cN = 120, cB = 358;
  return svg(p, 'Native photorespiration releases CO₂ in the mitochondrion; an engineered bypass breaks glycolate down to CO₂ inside the chloroplast, next to Rubisco; field tobacco gained 11–24 % biomass in small trials',
    `${t(24, 30, 'native route', 'fc06-h', 'start')}${parts(cN, false)}
    ${rubisco(122, cN - 18, 100, 34)}${chain(250, cN + 22, 2, true)}${t(222, cN + 30, 'glycolate', 'fc06-s', 'end')}
    ${arrow(p, 'clay', `M276,${cN + 14} C304,${cN} 340,${cN} 370,${cN}`, 'dashed')}${arrow(p, 'clay', `M466,${cN} L490,${cN}`, 'dashed')}
    ${arrow(p, 'clay', `M598,${cN - 34} L628,${cN - 70}`, 'dashed')}${molecule(648, cN - 86, 'OCO', 10)}
    ${t(640, cN - 30, 'CO₂ released', 'fc06-s', 'start')}${t(640, cN - 4, 'in the', 'fc06-s', 'start')}${t(640, cN + 22, 'mitochondrion', 'fc06-s', 'start')}
    ${t(640, cN + 56, '1 of 4 C', 'fc06-b fc06-pr', 'start')}

    <path class="rule" d="M20,236 H780"/>
    ${t(24, 270, 'engineered bypass', 'fc06-h', 'start')}${parts(cB, true)}
    ${rubisco(110, cB - 18, 100, 34)}${chain(262, cB + 22, 2, true)}${t(266, cB - 8, 'glycolate', 'fc06-s')}
    ${arrow(p, 'clay', `M236,${cB + 22} L214,${cB + 22}`)}${molecule(186, cB + 22, 'OCO', 9)}${molecule(186, cB + 50, 'OCO', 9)}
    ${arrow(p, 'clay', `M166,${cB + 14} C150,${cB + 6} 136,${cB} 126,${cB - 2}`, 'dashed')}
    <path class="ar ar-clay dashed fc06-faded" d="M330,${cB} L370,${cB}"/><path class="fc06-block" d="M341,${cB - 11} l18,22 M359,${cB - 11} l-18,22"/>
    ${t(640, cB - 30, 'CO₂ released', 'fc06-s', 'start')}${t(640, cB - 4, 'next to', 'fc06-s', 'start')}${t(640, cB + 22, 'Rubisco', 'fc06-s', 'start')}

    <path class="rule" d="M20,500 H780"/>
    ${t(400, 544, '', 'fc06-b')}
    ${t(400, 576, 'field tobacco, small trials; the cause is not settled', 'fc06-n')}`);
}

/* ---------- H · the cost of oxygenation, calculated ---------- */

function costCurve(): string {
  const p = 'fc06h';
  const x0 = 130, x1 = 740, phiMax = 2;
  const X = (f: number): number => x0 + (f / phiMax) * (x1 - x0);
  const atp = (f: number): number => (3 + 3.5 * f) / (1 - 0.5 * f);
  // top panel: carbon kept per carboxylation, 0–1
  const tY0 = 250, tY1 = 70, Yt = (v: number): number => tY0 - v * (tY0 - tY1);
  // bottom panel: ATP per carbon kept, 0–30
  const bY0 = 530, bY1 = 330, aMax = 30, Yb = (v: number): number => bY0 - (v / aMax) * (bY0 - bY1);
  const pts: string[] = [];
  for (let f = 0; f <= 1.99; f += 0.01) { if (atp(f) > aMax) break; pts.push(`${pts.length ? 'L' : 'M'}${n1(X(f))},${n1(Yb(atp(f)))}`); }
  const tickX = [0, 0.5, 1, 1.5, 2].map(f => `<path class="tick" d="M${n1(X(f))},${bY0} v8"/>${t(X(f), bY0 + 32, `${f}`, 'fc06-s')}`).join('');
  return svg(p, 'Calculated from the FvCB bookkeeping: carbon kept per carboxylation falls linearly with oxygenations per carboxylation and reaches zero at two; ATP per carbon kept rises steeply',
    `<path class="fc06-area" d="M${x0},${Yt(1)} L${X(2)},${Yt(1)} L${X(2)},${Yt(0)} Z"/>
    <path class="fc06-area-k" d="M${x0},${Yt(1)} L${X(2)},${Yt(0)} L${x0},${Yt(0)} Z"/>
    <path class="axis" d="M${x0},${tY1 - 10} V${tY0} H${x1}"/>
    <path class="curve fc06-cv-c" d="M${X(0)},${Yt(1)} L${X(2)},${Yt(0)}"/>
    ${t(x0 - 12, Yt(1) + 8, '1', 'fc06-s', 'end')}${t(x0 - 12, Yt(0) + 8, '0', 'fc06-s', 'end')}
    <text class="fc06-s" transform="translate(${x0 - 82} ${(tY0 + tY1) / 2}) rotate(-90)" text-anchor="middle">C kept per</text>
    <text class="fc06-s" transform="translate(${x0 - 56} ${(tY0 + tY1) / 2}) rotate(-90)" text-anchor="middle">carboxylation</text>
    ${t(X(0.12), Yt(0.22), 'kept', 'fc06-b', 'start')}
    ${t(X(1.3), Yt(0.84), 'lost to', 'fc06-b fc06-pr', 'start')}${t(X(1.3), Yt(0.84) + 26, 'photorespiration', 'fc06-b fc06-pr', 'start')}
    <circle class="fc06-dot" cx="${X(2)}" cy="${Yt(0)}" r="7"/>${t(X(2) + 4, Yt(0) + 28, 'at 2: two oxygenations cancel one carboxylation;', 'fc06-s', 'end')}${t(X(2) + 4, Yt(0) + 52, 'the CO₂ level where this happens is Γ*', 'fc06-s', 'end')}

    <path class="axis" d="M${x0},${bY1 - 10} V${bY0} H${x1}"/>
    <path class="fc06-asym" d="M${X(2)},${bY1 - 10} V${bY0}"/>
    <path class="curve fc06-cv-a" d="${pts.join('')}"/>
    ${[0, 15, 30].map(v => `<path class="tick" d="M${x0 - 8},${n1(Yb(v))} h8"/>${t(x0 - 12, Yb(v) + 8, `${v}`, 'fc06-s', 'end')}`).join('')}
    <text class="fc06-s" transform="translate(${x0 - 82} ${(bY0 + bY1) / 2}) rotate(-90)" text-anchor="middle">ATP per</text>
    <text class="fc06-s" transform="translate(${x0 - 56} ${(bY0 + bY1) / 2}) rotate(-90)" text-anchor="middle">C kept</text>
    <circle class="fc06-dot" cx="${n1(X(0))}" cy="${n1(Yb(3))}" r="6"/>${t(X(0) + 16, Yb(3) - 14, '3', 'fc06-s', 'start')}
    <circle class="fc06-dot" cx="${n1(X(0.3))}" cy="${n1(Yb(atp(0.3)))}" r="7"/>
    ${t(X(0.3) - 10, 456, '4.8 ATP at 0.3', 'fc06-s', 'start')}
    ${t(X(1.22), bY1 + 18, 'rises steeply', 'fc06-b fc06-pr', 'end')}
    ${tickX}
    ${t((x0 + x1) / 2, 594, 'oxygenations per carboxylation (Vo/Vc) →', 'fc06-b')}
    ${t(x1, 30, 'calculated: gain = Vc − ½ Vo; ATP = 3 Vc + 3.5 Vo', 'fc06-n', 'end')}`);
}

/* ---------- I · zoom to the glycine step: count the atoms ---------- */

function glycineStep(): string {
  const p = 'fc06i';
  const R = 15;
  const ball = (x: number, y: number, el: 'C' | 'N' | 'O', r = R): string =>
    `<circle class="atom atom-${el}" cx="${n1(x)}" cy="${n1(y)}" r="${r}"/><text class="atom-t atom-t-${el}" x="${n1(x)}" y="${n1(y + r * 0.4)}" text-anchor="middle">${el}</text>`;
  const bond = (a: [number, number], b: [number, number]): string => `<path class="fc06-sb" d="M${n1(a[0])},${n1(a[1])} L${n1(b[0])},${n1(b[1])}"/>`;
  /** Glycine: N–C–C(=O)–O (hydrogens left out). */
  const glycine = (x: number, y: number): string => {
    const N: [number, number] = [x - 44, y], C1: [number, number] = [x, y], C2: [number, number] = [x + 44, y];
    const O1: [number, number] = [x + 70, y - 34], O2: [number, number] = [x + 70, y + 34];
    return bond(N, C1) + bond(C1, C2) + bond(C2, O1) + bond(C2, O2) + ball(...N, 'N') + ball(...C1, 'C') + ball(...C2, 'C') + ball(...O1, 'O') + ball(...O2, 'O');
  };
  /** Serine: HO–CH₂–CH(NH₂)–COOH (hydrogens left out). */
  const serine = (x: number, y: number): string => {
    const O3: [number, number] = [x - 84, y], C3: [number, number] = [x - 42, y], C2: [number, number] = [x, y], C1: [number, number] = [x + 42, y];
    const N: [number, number] = [x, y - 44], O1: [number, number] = [x + 68, y - 34], O2: [number, number] = [x + 68, y + 34];
    return bond(O3, C3) + bond(C3, C2) + bond(C2, C1) + bond(C2, N) + bond(C1, O1) + bond(C1, O2) +
      ball(...O3, 'O') + ball(...C3, 'C') + ball(...C2, 'C') + ball(...C1, 'C') + ball(...N, 'N') + ball(...O1, 'O') + ball(...O2, 'O');
  };
  const tally = (y: number, el: string, a: string, b: string, c: string, cls: string): string =>
    `${t(60, y, el, 'fc06-b', 'start')}${t(240, y, a, 'fc06-pl')}${t(330, y, '→', 'fc06-pl')}${t(430, y, b, 'fc06-pl')}${t(510, y, '+', 'fc06-pl')}${t(590, y, c, `fc06-pl ${cls}`)}`;
  return svg(p, 'Inside the mitochondrion: two glycine (4 C, 2 N) become serine (3 C, 1 N), CO₂ and NH₃. Count the atoms: one carbon and one nitrogen leave',
    `${mitochondrion(400, 200, 384, 172, 0)}
    ${t(400, 66, 'inside the mitochondrion', 'fc06-h fc06-mit-t')}
    ${glycine(126, 142)}${glycine(126, 262)}${t(118, 210, '2 glycine', 'fc06-b')}
    ${arrow(p, 'clay', 'M232,202 L304,202')}${t(268, 182, 'GDC', 'fc06-n')}${t(268, 234, 'SHMT', 'fc06-n')}
    ${serine(420, 216)}${t(410, 302, 'serine', 'fc06-b')}
    ${molecule(612, 138, 'OCO', 15)}${t(612, 182, 'CO₂', 'fc06-b fc06-pr')}${t(612, 206, 'also NADH', 'fc06-n')}
    ${nh3(612, 264, 15)}${t(612, 312, 'NH₃', 'fc06-b')}

    <path class="rule" d="M40,388 H760"/>
    ${t(240, 420, 'in', 'fc06-n')}${t(430, 420, 'serine', 'fc06-n')}${t(590, 420, 'released', 'fc06-n')}
    ${tally(462, 'carbon', '4', '3', '1', 'fc06-pr')}
    ${tally(508, 'nitrogen', '2', '1', '1', '')}
    ${t(650, 462, 'lost as CO₂', 'fc06-s', 'start')}${t(650, 508, 're-fixed with', 'fc06-s', 'start')}
    ${tag(664, 546, 'ATP', 'atp')}${tag(750, 546, 'NADPH', 'nadph')}
    ${t(40, 552, 'GDC: glycine decarboxylase', 'fc06-n', 'start')}${t(40, 572, 'SHMT: serine hydroxymethyltransferase', 'fc06-n', 'start')}${t(40, 592, 'hydrogens not drawn', 'fc06-n', 'start')}`);
}

/* ---------- J · minimal: four carbons in, three back, one out ---------- */

function fourToThree(): string {
  const p = 'fc06j';
  return svg(p, 'Minimal summary: two 2-phosphoglycolate (4 C) pass three organelles and return as one PGA (3 C) plus one CO₂, paid in ATP and NADPH',
    `<g transform="translate(0 -36)">
    ${chain(120, 230, 2, true, 16, 40)}${chain(120, 300, 2, true, 16, 40)}
    ${t(120, 360, '2 × 2-PG', 'fc06-h fc06-pr')}${t(120, 392, '4 C', 'fc06-pl')}
    ${arrow(p, 'clay', 'M196,265 L352,265', 'dashed')}
    ${chloroplast(222, 196, 26, 16, 0)}${peroxisome(274, 196, 14, false)}${mitochondrion(326, 196, 26, 16, 3)}
    ${t(274, 156, 'three organelles', 'fc06-n')}
    ${chain(470, 265, 3, false, 16, 40)}${t(470, 360, 'PGA', 'fc06-h')}${t(470, 392, '3 C back', 'fc06-pl')}
    ${t(578, 276, '+', 'fc06-pl')}
    ${molecule(680, 265, 'OCO', 20)}${t(680, 360, 'CO₂', 'fc06-h fc06-pr')}${t(680, 392, '1 C lost', 'fc06-pl fc06-pr')}
    ${tag(330, 480, 'ATP', 'atp')}${tag(450, 480, 'NADPH', 'nadph')}${t(400, 536, 'spent on the way', 'fc06-s')}
    </g>`);
}
