// Slide C02 · Carbon enters the Calvin–Benson–Bassham cycle. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Checked facts only (research/review-2026-10-23-claude/D_C01-C06.md, claims 10–21, 50; E claim 4; REVIEW_SUMMARY.md):
// Rubisco adds CO₂ (1 C) to RuBP (5 C); the six-carbon species is an enzyme-bound intermediate, never released, and
// splits into 2 × 3-PGA (3 C). "C₃" names this first stable product, not the exported three-carbon sugar.
// Calvin, Benson, Bassham and co-workers fed ¹⁴CO₂ to unicellular algae, killed them in hot alcohol after short
// intervals and separated labelled compounds by 2-D paper chromatography and autoradiography: a short pulse labels
// 3-PGA first; later the label spreads. 3 RuBP (15 C) + 3 CO₂ (3 C) → 6 3-PGA (18 C). Carboxylation itself uses no
// ATP or NADPH. Lowering CO₂ makes RuBP rise and PGA fall (Bassham 2003 retrospective; no lollipop apparatus).
// C₄ contrast: a short pulse labels four-carbon acids first (Hatch & Slack 1966). The light-off transient is drawn in C03.
// Vocabulary: carbon = dark bead, carbon arriving as CO₂ = hollow bead (as in C03), phosphate = orange ball,
// RuBP = pentagon (thesis symbol), 3-PGA = triangle, Rubisco = warm grey block, CO₂ = atom balls.
// The draft title "Following carbon into the Calvin–Benson–Bassham cycle" does not fit on one line at the page's title size.
import type { PlateText, Variant } from '../types';
import './c02.css';
import { illusHeads, molecule, tag } from '../illus';
import { arrow } from '../mechanisms';

export const PLATE: PlateText = {
  n: 'C2',
  title: 'Carbon enters the Calvin–Benson–Bassham cycle',
  status: 'draft',
  lead: 'Rubisco adds CO₂ to the five-carbon sugar ribulose-1,5-bisphosphate (RuBP), giving two molecules of three-carbon 3-phosphoglycerate (3-PGA).',
  points: [
    { claim: 'Rubisco must be switched on.', text: 'A CO₂ and Mg²⁺ bind its active site first; activase uses ATP to clear blocked sites. In heat, Rubisco deactivates.' },
    { claim: 'The label appears first in 3-PGA.', text: 'In algae fed ¹⁴CO₂ for seconds, the first labelled product was 3-PGA.' },
    { claim: 'C₃ is named after 3-PGA.', text: 'Fixing CO₂ costs no ATP or NADPH; they are spent later, to reduce 3-PGA and to rebuild RuBP.' },
  ],
  refs: [
    { label: 'Bassham et al. 1954', url: 'https://doi.org/10.1021/ja01636a012' },
    { label: 'Bassham 2003', url: 'https://doi.org/10.1023/A:1024929725022' },
    { label: 'Andersson 2008', url: 'https://doi.org/10.1093/jxb/ern091' },
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
    { label: 'Lorimer et al. 1976', url: 'https://doi.org/10.1021/bi00648a012' },
    { label: 'Yamori 2026', url: 'https://doi.org/10.1111/pce.70617' },
    { label: 'Scafaro et al. 2023', url: 'https://doi.org/10.1038/s41467-023-38496-4' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Atom balls' },
  { id: 'b', name: 'Carbon count' },
  { id: 'c', name: 'Tracer strip' },
  { id: 'd', name: 'First label' },
  { id: 'e', name: 'Why “C₃”' },
  { id: 'f', name: 'Zoom to Rubisco' },
  { id: 'g', name: 'CO₂-drop test', anim: true },
  { id: 'h', name: 'Chain analogy' },
  { id: 'i', name: 'You are here' },
  { id: 'j', name: '5 + 1 = 2 × 3' },
];

export function draw(id: string): string {
  const f = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ }[id] ?? drawA;
  return f();
}

/* ---------- shared parts ---------- */

type Anchor = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Subscript digits as smaller, lowered Inter digits (the web font has no subscript glyphs). */
const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fc02-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
const T = (x: number, y: number, s: string, cls = 'sm', a: Anchor = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${chem(s)}</text>`;
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc02" viewBox="0 0 800 600" role="img" aria-label="${label}">${illusHeads(p)}${body}</svg>`;

/** RuBP as the thesis draws it: a pentagon. */
function pent(x: number, y: number, r: number, label = '', cls = 'node node-rubp', lcls = 'sm lab-b'): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${f(x + r * Math.cos(a))},${f(y + r * Math.sin(a))}`;
  }).join(' ');
  return `<polygon class="${cls}" points="${pts}"/>${label ? T(x, y + r * 0.2 + 6, label, lcls) : ''}`;
}

/** A three-carbon molecule (3-PGA) as a triangle. */
function tri(x: number, y: number, r: number, label = '', cls = 'fc02-tri', lcls = 'sm lab-b'): string {
  const pts = [-90, 30, 150].map(d => `${f(x + r * Math.cos((d * Math.PI) / 180))},${f(y + r * Math.sin((d * Math.PI) / 180))}`).join(' ');
  return `<polygon class="${cls}" points="${pts}"/>${label ? T(x, y + r * 0.25 + 6, label, lcls) : ''}`;
}

/** A carbon skeleton from a spec: C carbon, N carbon that came from CO₂ (hollow), P phosphate. */
function chainOf(x: number, y: number, spec: string, gap = 24, r = 9, bond = 'fc02-bond'): string {
  const x0 = x - ((spec.length - 1) * gap) / 2;
  const balls = [...spec].map((c, i) => {
    const cx = f(x0 + i * gap);
    if (c === 'P') return `<circle class="tag-pi" cx="${cx}" cy="${y}" r="${f(r * 1.08)}"/><text class="fc02-p" x="${cx}" y="${f(y + r * 0.48)}" text-anchor="middle">P</text>`;
    return `<circle class="${c === 'N' ? 'bead bead-co2' : 'bead'}" cx="${cx}" cy="${y}" r="${r}"/>`;
  }).join('');
  return `<path class="${bond}" d="M${f(x0)},${y} H${f(x0 + (spec.length - 1) * gap)}"/>${balls}`;
}

/** Legend entries for the bead vocabulary. */
const legend = (x: number, y: number): string =>
  `<circle class="bead" cx="${x}" cy="${y - 7}" r="8"/>${T(x + 16, y, 'carbon', 'sm', 'start')}` +
  `<circle class="bead bead-co2" cx="${x + 130}" cy="${y - 7}" r="8"/>${T(x + 146, y, 'carbon from CO₂', 'sm', 'start')}` +
  `<circle class="tag-pi" cx="${x + 352}" cy="${y - 7}" r="9"/><text class="fc02-p" x="${x + 352}" y="${y - 3}" text-anchor="middle">P</text>${T(x + 368, y, 'phosphate', 'sm', 'start')}`;

/** A labelled number badge. */
const num = (x: number, y: number, n: number): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="16"/><text class="num-t" x="${x}" y="${y + 6}" text-anchor="middle">${n}</text>`;

/* ---------- a · Atom balls: RuBP + CO₂ → enzyme-bound six-carbon intermediate → 2 × 3-PGA ---------- */

function drawA(): string {
  const p = 'fc02a';
  const bx = 300, bw = 232, cx = bx + bw / 2;
  const x0 = cx - 72; // the six-carbon skeleton: P C1 C2 C3 C4 C5 P, with the new carbon on C2
  return svg(p, 'RuBP, five carbons with two phosphates, and CO₂, one carbon, meet inside Rubisco. There they form a six-carbon intermediate, with the new carbon on the second carbon, that stays bound to the enzyme. It splits into two 3-PGA of three carbons each; one carries the carbon from CO₂. Each 3-PGA keeps one phosphate. The step uses no ATP or NADPH.', `
    ${T(120, 64, 'CO₂', 'lab lab-b')}${molecule(120, 104, 'OCO', 16)}${T(120, 148, '1 C', 'sm')}
    ${pent(120, 282, 46, 'RuBP')}
    ${chainOf(120, 372, 'PCCCCCP')}${T(120, 410, '5 C', 'sm')}${T(120, 436, 'ribulose-1,5-bisphosphate', 'tiny')}
    ${arrow(p, 'ink', `M152,118 L${bx - 6},210`)}${arrow(p, 'ink', `M170,286 L${bx - 6},286`)}

    <rect class="node node-rub" x="${bx}" y="156" width="${bw}" height="252" rx="28"/>${T(cx, 196, 'Rubisco', 'lab lab-b')}
    <path class="fc02-bond" d="M${x0 + 48},286 V256"/>
    ${chainOf(cx, 286, 'PCCCCCP')}<circle class="bead bead-co2" cx="${x0 + 48}" cy="250" r="9"/>
    <path class="fc02-cut" d="M${x0 + 60},264 V308"/>
    ${T(cx, 346, '6-C intermediate', 'sm lab-b')}${T(cx, 372, 'stays bound', 'sm')}

    ${arrow(p, 'ink', `M${bx + bw + 6},240 L612,150`)}${arrow(p, 'ink', `M${bx + bw + 6},330 L612,356`)}
    ${tri(660, 128, 36)}${T(708, 140, '3-PGA', 'lab lab-b', 'start')}
    ${chainOf(660, 194, 'PCCN')}
    ${tri(660, 340, 36)}${T(708, 352, '3-PGA', 'lab lab-b', 'start')}
    ${chainOf(660, 406, 'CCCP')}
    ${T(660, 456, '2 × 3 C', 'sm lab-b')}
    <path class="rule" d="M30,500 H770"/>
    ${legend(160, 550)}
  `);
}

/* ---------- b · Carbon count: three carboxylations, 15 + 3 = 18 = 6 × 3 ---------- */

function drawB(): string {
  const p = 'fc02b';
  const rows = [150, 260, 370];
  return svg(p, 'Counting carbons for three CO₂. Each row is one carboxylation: RuBP with five carbons plus CO₂ with one gives two 3-PGA with three carbons each. Three RuBP bring 15 carbons, three CO₂ bring 3, and six 3-PGA carry 18: 15 + 3 = 18 = 6 × 3.', `
    <g transform="translate(18 0)">
    ${T(150, 70, '3 RuBP', 'lab lab-b')}${T(330, 70, '3 CO₂', 'lab lab-b')}${T(410, 118, 'Rubisco', 'sm')}${T(610, 70, '6 × 3-PGA', 'lab lab-b')}
    ${rows.map(y => `
      ${pent(70, y, 24)}${chainOf(170, y, 'CCCCC', 20, 8)}
      ${T(250, y + 10, '+', 'pl')}
      ${molecule(330, y, 'OCO', 12)}
      ${arrow(p, 'ink', `M380,${y} L440,${y}`)}
      ${tri(478, y + 2, 17)}${chainOf(532, y, 'CCN', 20, 8)}
      ${tri(616, y + 2, 17)}${chainOf(670, y, 'CCC', 20, 8)}`).join('')}
    ${T(150, 466, '15 C', 'pl')}${T(330, 466, '3 C', 'pl')}${T(610, 466, '18 C', 'pl')}
    </g>
    <path class="rule" d="M40,424 H760"/>
    ${T(400, 524, '15 + 3 = 18 = 6 × 3', 'fc02-big')}
    <circle class="bead bead-co2" cx="318" cy="565" r="8"/>${T(334, 572, 'carbon from CO₂', 'sm', 'start')}
  `);
}

/* ---------- c · Tracer strip: feed ¹⁴CO₂, stop, separate; short and longer pulses compared ---------- */

function drawC(): string {
  const p = 'fc02c';
  const algae = [[108, 150], [138, 164], [124, 182], [152, 138], [100, 176], [146, 188], [118, 132], [160, 162]]
    .map(([x, y]) => `<circle class="fc02-alga" cx="${x}" cy="${y}" r="6"/>`).join('');
  const sheet = (x: number, y: number, w: number, h: number, spots: Array<[number, number, number, number]>): string =>
    `<rect class="fc02-paper" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>` +
    spots.map(([sx, sy, r, o]) => `<ellipse class="fc02-spot" cx="${x + sx}" cy="${y + sy}" rx="${r}" ry="${f(r * 0.8)}" style="opacity:${o}"/>`).join('');
  return svg(p, 'The tracer experiment, schematic. One: ¹⁴CO₂ is fed to algae in the light. Two: after a short pulse the algae are killed in hot alcohol. Three: the extract is separated by two-dimensional paper chromatography and the paper exposed to X-ray film. After a short pulse a single dark spot appears, 3-PGA; after a longer pulse the label has spread to many compounds, including sugar phosphates.', `
    ${molecule(60, 74, 'OCO', 9)}${arrow(p, 'ink', 'M76,86 L112,104')}
    <path class="fc02-flask" d="M118,82 V112 A44,44 0 1 0 146,112 V82 Z"/>${algae}
    <path class="bolt" d="M204,56 L196,84 L210,88 L194,120" marker-end="url(#${p}-bolt)"/>
    ${arrow(p, 'ink', 'M196,160 L314,160')}
    <path class="fc02-beaker" d="M332,108 V200 Q332,212 344,212 H436 Q448,212 448,200 V108"/>
    <rect class="fc02-alc" x="334" y="146" width="112" height="64" rx="8"/>
    <path class="fc02-steam" d="M360,100 q8,-12 0,-24 q-8,-12 0,-24 M390,100 q8,-12 0,-24 q-8,-12 0,-24 M420,100 q8,-12 0,-24 q-8,-12 0,-24"/>
    ${arrow(p, 'ink', 'M466,160 L584,160')}
    ${sheet(598, 92, 140, 136, [[100, 104, 13, 0.9]])}
    ${T(668, 84, 'paper + film', 'tiny')}
    ${num(70, 262, 1)}${T(94, 269, 'Feed ¹⁴CO₂', 'sm lab-b', 'start')}
    ${num(284, 262, 2)}${T(308, 269, 'Stop in hot alcohol', 'sm lab-b', 'start')}
    ${num(570, 262, 3)}${T(594, 269, 'Separate on paper', 'sm lab-b', 'start')}

    ${T(200, 332, 'short pulse', 'lab lab-b')}${T(600, 332, 'longer pulse', 'lab lab-b')}
    ${sheet(60, 348, 280, 200, [[196, 142, 22, 0.92], [70, 40, 8, 0.12]])}
    ${T(222, 502, '3-PGA', 'sm lab-b', 'end')}
    ${sheet(460, 348, 280, 200, [[196, 142, 17, 0.7], [60, 48, 11, 0.55], [96, 34, 10, 0.5], [128, 58, 11, 0.6], [82, 80, 10, 0.45], [152, 38, 9, 0.4], [238, 86, 9, 0.35]])}
    ${T(630, 498, '3-PGA', 'sm lab-b', 'end')}
    ${T(474, 532, 'sugar phosphates', 'sm lab-b', 'start')}
    <path class="fc02-leader" d="M520,512 L540,442"/>
    ${T(200, 574, 'solvent 1 →', 'tiny')}
    <text class="tiny" transform="translate(48 448) rotate(-90)" text-anchor="middle">solvent 2 →</text>
    ${T(740, 574, 'schematic', 'tiny', 'end')}
  `);
}

/* ---------- d · First label: extrapolate to zero time to find the first product (schematic) ---------- */

function drawD(): string {
  const p = 'fc02d';
  const x0 = 130, x1 = 740, y0 = 504, yt = 96;
  const pga = (t: number): number => 0.24 + 0.76 * Math.exp(-t / 0.26);
  const X = (t: number): number => x0 + t * (x1 - x0), Y = (v: number): number => y0 - v * (y0 - yt);
  const path = (fn: (t: number) => number, a: number, b: number): string => {
    const pts: string[] = [];
    for (let t = a; t <= b + 1e-9; t += 0.01) pts.push(`${pts.length ? 'L' : 'M'}${f(X(t))},${f(Y(fn(t)))}`);
    return pts.join('');
  };
  const other = (t: number): number => 1 - pga(t);
  const ts = [0.08, 0.18, 0.32, 0.5, 0.72, 0.95];
  return svg(p, 'Schematic: the share of fixed ¹⁴C found in 3-PGA and in later products, against the length of the pulse. 3-PGA holds most of the label after short pulses and less after long ones; later products, such as sugar phosphates, rise. Extrapolated to zero time, all the label is in 3-PGA: it is the first product.', `
    <path class="axis" d="M${x0},${yt - 14} V${y0} H${x1 + 10}"/>
    ${T(x0 - 18, Y(1) + 8, 'all', 'sm', 'end')}${T(x0 - 12, y0 + 8, '0', 'sm', 'end')}
    <text class="tl" transform="translate(${x0 - 50} ${(y0 + yt) / 2}) rotate(-90)" text-anchor="middle">share of the ¹⁴C label</text>
    ${T((x0 + x1) / 2, y0 + 40, 'length of the ¹⁴CO₂ pulse →', 'tl')}
    <path class="fc02-cv fc02-cv-pga fc02-extra" d="${path(pga, 0, 0.08)}"/><path class="fc02-cv fc02-cv-pga" d="${path(pga, 0.08, 1)}"/>
    <path class="fc02-cv fc02-cv-oth fc02-extra" d="${path(other, 0, 0.08)}"/><path class="fc02-cv fc02-cv-oth" d="${path(other, 0.08, 1)}"/>
    ${ts.map(t => `<circle class="fc02-dot-pga" cx="${f(X(t))}" cy="${f(Y(pga(t)))}" r="7"/><circle class="fc02-dot-oth" cx="${f(X(t))}" cy="${f(Y(other(t)))}" r="7"/>`).join('')}
    <circle class="fc02-zero" cx="${x0}" cy="${Y(1)}" r="10"/>
    ${T(x0 + 22, Y(1) - 18, 'extrapolated to zero: all in 3-PGA', 'sm lab-b', 'start')}
    ${T(x1, Y(pga(1)) + 36, '3-PGA', 'lab lab-b', 'end')}
    ${T(x1, Y(other(1)) - 56, 'later products', 'lab lab-b fc02-clay', 'end')}${T(x1, Y(other(1)) - 26, 'e.g. sugar phosphates', 'sm', 'end')}
    ${T(x1, y0 + 40, 'schematic', 'tiny', 'end')}
  `);
}

/* ---------- e · Why "C₃": the first stable product has three carbons ---------- */

function drawE(): string {
  const p = 'fc02e';
  return svg(p, 'Why C₃. In C₃ plants such as wheat and rice, Rubisco joins CO₂ to RuBP and the first stable product, 3-PGA, has three carbons: that is the name. In C₄ plants such as maize and sugarcane, a short ¹⁴CO₂ pulse labels four-carbon acids first (Hatch and Slack 1966). The name does not refer to the three-carbon sugar the cycle exports.', `
    <g transform="translate(0 12)">
    <rect class="fc02-card" x="16" y="24" width="768" height="246" rx="18"/>
    ${T(40, 68, 'C₃ plants', 'lab lab-b', 'start')}${T(178, 68, 'e.g. wheat, rice', 'sm fc02-mute', 'start')}
    ${molecule(80, 160, 'OCO', 12)}${T(130, 170, '+', 'pl')}${pent(196, 160, 38, 'RuBP')}
    ${arrow(p, 'ink', 'M250,160 L350,160')}${T(300, 144, 'Rubisco', 'sm')}
    ${tri(410, 156, 44)}
    ${chainOf(526, 160, 'CCC', 26, 10)}
    <circle class="fc02-badge" cx="696" cy="130" r="48"/>${T(696, 144, 'C₃', 'fc02-badge-t')}
    ${T(410, 236, '3-PGA', 'sm lab-b')}${T(526, 236, '3 C', 'sm')}${T(696, 210, 'first stable', 'sm')}${T(696, 236, 'product', 'sm')}

    <rect class="fc02-card" x="16" y="290" width="768" height="206" rx="18"/>
    ${T(40, 334, 'C₄ plants', 'lab lab-b', 'start')}${T(178, 334, 'e.g. maize, sugarcane', 'sm fc02-mute', 'start')}
    ${molecule(80, 410, 'OCO', 12)}${arrow(p, 'ink', 'M118,410 L350,410')}${T(234, 394, 'short ¹⁴CO₂ pulse', 'sm')}
    ${chainOf(456, 410, 'CCCC', 26, 10)}
    <circle class="fc02-badge fc02-badge-4" cx="696" cy="404" r="46"/>${T(696, 418, 'C₄', 'fc02-badge-t')}
    ${T(456, 466, 'four-carbon acids', 'sm')}${T(696, 480, 'Hatch & Slack 1966', 'tiny')}

    <path class="fc02-x" d="M190,532 L214,556 M214,532 L190,556"/>
    ${T(234, 552, '“C₃” is not the exported triose-P', 'sm lab-b', 'start')}
    </g>
  `);
}

/* ---------- f · Zoom to Rubisco: leaf → cell → chloroplast → active site ---------- */

function drawF(): string {
  const p = 'fc02f';
  const R = 84, cy = 196, xs = [100, 300, 500, 700];
  const clip = xs.map((x, i) => `<clipPath id="${p}-c${i}"><circle cx="${x}" cy="${cy}" r="${R}"/></clipPath>`).join('');
  const frame = (i: number, body: string): string =>
    `<circle class="fc02-zbg" cx="${xs[i]}" cy="${cy}" r="${R}"/><g clip-path="url(#${p}-c${i})">${body}</g><circle class="fc02-zring" cx="${xs[i]}" cy="${cy}" r="${R}"/>`;
  const cone = (i: number, bx: number, by: number, s: number): string =>
    `<rect class="fc02-zbox" x="${bx - s}" y="${by - s}" width="${2 * s}" height="${2 * s}" rx="4"/>` +
    `<path class="fc02-zline" d="M${bx + s},${by - s} L${xs[i + 1] - 20},${cy - R + 8} M${bx + s},${by + s} L${xs[i + 1] - 20},${cy + R - 8}"/>`;
  const stoma = (x: number, y: number): string =>
    `<ellipse class="fc02-guard" cx="${x - 7}" cy="${y}" rx="7" ry="15"/><ellipse class="fc02-guard" cx="${x + 7}" cy="${y}" rx="7" ry="15"/><ellipse class="fc02-pore" cx="${x}" cy="${y}" rx="2.5" ry="9"/>`;
  const chl = (x: number, y: number, rx = 16, rot = 0): string =>
    `<ellipse class="fc02-chl" cx="${x}" cy="${y}" rx="${rx}" ry="${f(rx * 0.55)}" transform="rotate(${rot} ${x} ${y})"/>`;
  const granum = (x: number, y: number): string =>
    [0, 1, 2, 3].map(k => `<rect class="fc02-disc" x="${x - 14}" y="${y - 14 + k * 7}" width="28" height="6" rx="3"/>`).join('');
  const dots = [[452, 200], [478, 170], [512, 218], [534, 182], [470, 232], [550, 214], [500, 156], [440, 172]]
    .map(([x, y]) => `<circle class="fc02-rub-dot" cx="${x}" cy="${y}" r="5"/>`).join('');
  return svg(p, 'Zooming in four steps. A leaf: CO₂ enters through stomata. A leaf cell full of chloroplasts. A chloroplast: Rubisco molecules sit in the stroma between the thylakoid stacks. Rubisco itself: CO₂ joins RuBP in the active site, where the six-carbon intermediate is held until it splits into two 3-PGA.', `
    <defs>${clip}</defs>
    <g transform="translate(0 -26)">
    ${frame(0, `<rect class="fc02-leafbg" x="10" y="100" width="190" height="200"/>${stoma(80, 214)}${stoma(126, 172)}${stoma(70, 150)}${stoma(140, 244)}
      ${molecule(98, 128, 'OCO', 7)}${arrow(p, 'ink', 'M116,136 L124,152')}`)}
    ${frame(1, `<rect class="fc02-cellbg" x="226" y="124" width="148" height="146" rx="26"/>
      ${chl(258, 150)}${chl(300, 140, 16, 10)}${chl(344, 156, 16, -20)}${chl(352, 206, 16, 70)}${chl(342, 250, 16, 10)}${chl(296, 258)}${chl(252, 238, 16, -30)}${chl(246, 194, 16, 80)}`)}
    ${frame(2, `<ellipse class="fc02-chlbig" cx="500" cy="196" rx="80" ry="58"/>${granum(470, 196)}${granum(516, 196)}${granum(560, 196)}${granum(440, 196)}${dots}`)}
    ${frame(3, `<path class="fc02-enz" d="M630,150 C640,110 700,104 742,128 C790,150 790,230 752,262 C716,292 650,286 628,250 C614,226 650,214 662,196 C650,182 620,176 630,150 Z"/>
      <ellipse class="fc02-pocket" cx="676" cy="196" rx="34" ry="28"/>${pent(670, 200, 16)}${molecule(694, 178, 'OCO', 6)}`)}
    ${cone(0, 126, 172, 16)}${cone(1, 300, 140, 20)}${cone(2, 534, 182, 12)}
    ${T(100, 318, 'leaf', 'sm lab-b')}${T(100, 344, 'CO₂ via stomata', 'sm')}
    ${T(300, 318, 'cell', 'sm lab-b')}${T(300, 344, 'chloroplasts', 'sm')}
    ${T(500, 318, 'chloroplast', 'sm lab-b')}${T(500, 344, 'Rubisco in stroma', 'sm')}
    ${T(700, 318, 'active site', 'sm lab-b')}${T(700, 344, 'CO₂ meets RuBP', 'sm')}

    <path class="rule" d="M30,384 H770"/>
    ${pent(100, 486, 34)}${T(100, 548, 'RuBP', 'sm lab-b')}${T(164, 504, '+', 'pl')}${molecule(214, 494, 'OCO', 11)}
    ${arrow(p, 'ink', 'M252,494 L300,494')}
    <rect class="node node-rub" x="306" y="436" width="214" height="116" rx="24"/>
    <path class="fc02-bond" d="M362,494 V476"/>${chainOf(410, 494, 'PCCCCCP', 20, 7)}<circle class="bead bead-co2" cx="362" cy="470" r="7"/>
    ${T(413, 536, 'bound to Rubisco', 'sm')}
    ${arrow(p, 'ink', 'M526,470 L590,446')}${arrow(p, 'ink', 'M526,518 L590,542')}
    ${tri(624, 440, 26)}${tri(624, 548, 26)}${T(664, 450, '3-PGA', 'sm lab-b', 'start')}${T(664, 558, '3-PGA', 'sm lab-b', 'start')}
    ${T(413, 426, 'six-carbon intermediate', 'sm lab-b')}
    </g>
  `);
}

/* ---------- g · CO₂-drop test: RuBP piles up, PGA falls (schematic) ---------- */

function drawG(): string {
  const p = 'fc02g';
  const x0 = 120, x1 = 740, y0 = 492, yt = 156, ts = 360;
  const Y = (v: number): number => y0 - v * (y0 - yt);
  const trace = (before: number, after: number, k: number): string => {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 4) {
      const v = x < ts ? before : after + (before - after) * Math.exp(-(x - ts) / k);
      pts.push(`${pts.length ? 'L' : 'M'}${x},${f(Y(v))}`);
    }
    return pts.join('');
  };
  return svg(p, 'Schematic of the CO₂-drop test by Calvin, Benson, Bassham and co-workers. While CO₂ is high, the pools of RuBP and 3-PGA are steady. When CO₂ is lowered, RuBP piles up and 3-PGA falls: RuBP is the molecule that takes up CO₂, and 3-PGA is made from it.', `
    <rect class="fc02-hi" x="${x0}" y="64" width="${ts - x0}" height="34" rx="6"/><rect class="fc02-lo" x="${ts}" y="64" width="${x1 - ts}" height="34" rx="6"/>
    ${T((x0 + ts) / 2, 88, 'high CO₂', 'sm lab-b')}${T((ts + x1) / 2, 88, 'CO₂ lowered', 'sm lab-b')}
    <path class="fc02-guide" d="M${ts},104 V${y0}"/>
    <path class="axis" d="M${x0},${yt - 12} V${y0} H${x1}"/>
    <text class="tl" transform="translate(${x0 - 24} ${(y0 + yt) / 2}) rotate(-90)" text-anchor="middle">pool size</text>
    ${T((x0 + x1) / 2, y0 + 36, 'time →', 'tl')}
    <path class="fc02-cv fc02-cv-rubp" d="${trace(0.42, 0.92, 60)}"/>
    <path class="fc02-cv fc02-cv-pga" d="${trace(0.6, 0.14, 50)}"/>
    ${pent(x0 + 40, Y(0.42) + 36, 16)}${T(x0 + 66, Y(0.42) + 44, 'RuBP', 'sm lab-b', 'start')}
    ${tri(x0 + 40, Y(0.6) - 34, 16)}${T(x0 + 66, Y(0.6) - 26, '3-PGA', 'sm lab-b', 'start')}
    ${T(x1, Y(0.92) - 18, 'RuBP piles up', 'sm lab-b fc02-clay', 'end')}
    ${T(x1, Y(0.14) - 18, '3-PGA falls', 'sm lab-b', 'end')}
    ${T(x0, 580, 'after Bassham 2003', 'tiny', 'start')}${T(x1, 580, 'schematic', 'tiny', 'end')}
  `);
}

/* ---------- h · Chain analogy: a 5-link chain plus one link, clamped, snapped into two 3-link pieces ---------- */

function drawH(): string {
  const p = 'fc02h';
  /** Interlocking links: odd links seen edge-on. `spec`: L link, N new link, P end tag. */
  const links = (x: number, y: number, spec: string, gap = 30): string => {
    const x0 = x - ((spec.length - 1) * gap) / 2;
    return [...spec].map((c, i) => {
      const cx = x0 + i * gap;
      if (c === 'P') return `<circle class="tag-pi" cx="${f(cx)}" cy="${y}" r="12"/><text class="fc02-p" x="${f(cx)}" y="${y + 5}" text-anchor="middle">P</text>`;
      const cls = c === 'N' ? 'fc02-link fc02-link-new' : 'fc02-link';
      return i % 2 ? `<ellipse class="${cls}" cx="${f(cx)}" cy="${y}" rx="19" ry="6"/>` : `<ellipse class="${cls}" cx="${f(cx)}" cy="${y}" rx="19" ry="12"/>`;
    }).join('');
  };
  const row = (y: number, a: string, b: string): string =>
    T(40, y, a, 'sm lab-b', 'start') + T(408, y, '=', 'sm fc02-mute') + T(436, y, b, 'sm', 'start');
  return svg(p, 'Analogy. A five-link chain with a tag at each end (RuBP: five carbons, two phosphates) and a loose link (CO₂) go into a clamp (Rubisco). The clamp holds them as one six-link chain (the enzyme-bound six-carbon intermediate) and never lets it go whole; it snaps it into two three-link pieces, each with one tag (two 3-PGA, one phosphate each). The new link ends up in one piece.', `
    <g transform="translate(0 16)">
    ${links(130, 94, 'N')}${T(130, 64, 'loose link', 'sm')}
    ${links(130, 180, 'PLLLLLP')}${T(130, 240, '5-link chain', 'sm')}
    ${arrow(p, 'ink', 'M226,150 L280,150')}
    <rect class="fc02-jaw" x="292" y="66" width="236" height="30" rx="8"/><rect class="fc02-jaw" x="292" y="180" width="236" height="30" rx="8"/>
    <rect class="fc02-screw" x="402" y="32" width="16" height="34" rx="3"/><rect class="fc02-screw" x="382" y="26" width="56" height="10" rx="5"/>
    ${links(410, 150, 'PLLLLLP')}${links(380, 116, 'N')}<path class="fc02-tie" d="M380,128 V140"/>
    ${T(410, 240, 'clamp', 'sm')}
    ${arrow(p, 'ink', 'M540,130 L600,98')}${arrow(p, 'ink', 'M540,170 L600,196')}
    ${links(680, 86, 'PLLN')}${links(680, 196, 'LLLP')}
    ${T(680, 240, 'two pieces', 'sm')}

    <path class="rule" d="M30,288 H770"/>
    ${row(342, '5 links, 2 end tags', 'RuBP (5 C, 2 phosphates)')}
    ${row(390, 'loose link', 'CO₂ (1 C)')}
    ${row(438, 'clamp', 'Rubisco')}
    ${row(486, '6 links, clamped', 'enzyme-bound 6-C intermediate')}
    ${row(534, 'two pieces, 1 tag each', '2 × 3-PGA, 1 phosphate each')}
    </g>
  `);
}

/* ---------- i · You are here: the thesis scheme with carboxylation lit and the rest faded ---------- */

function drawI(): string {
  const p = 'fc02i';
  const pill = (x: number, y: number, w: number, s: string, cls = 'node'): string =>
    `<rect class="${cls}" x="${x - w / 2}" y="${y - 22}" width="${w}" height="44" rx="22"/>${T(x, y + 8, s, 'sm lab-b')}`;
  return svg(p, 'The Calvin–Benson–Bassham cycle after the MSc thesis scheme. Lit: carboxylation, where Rubisco joins CO₂ to RuBP, giving 2 PGA; this slide. Faded: reduction of PGA to triose phosphate with ATP and NADPH, regeneration of RuBP from five of six triose phosphates with ATP, and export of one in six as sugar, which the next slides cover.', `
    <rect class="fc02-halo" x="236" y="300" width="330" height="290" rx="26"/>
    ${T(636, 460, 'this slide', 'lab lab-b fc02-clay', 'start')}
    <g class="fc02-faded">
      ${arrow(p, 'ink', 'M400,312 L400,186', 'boost')}
      ${T(388, 230, 'reduction', 'sm', 'end')}${tag(456, 250, 'ATP', 'atp')}${tag(546, 250, 'NADPH', 'nadph')}
      ${pill(400, 160, 150, 'triose-P')}
      <path class="ar ar-ink" d="M325,160 C224,160 196,318 224,388 S320,470 360,462" marker-end="url(#${p}-ink)"/>
      ${T(214, 132, 'regeneration', 'sm', 'middle')}${T(214, 104, '5 of 6', 'sm lab-b')}${tag(196, 286, 'ATP', 'atp')}
      ${arrow(p, 'ink', 'M446,138 L500,98')}${T(514, 132, '1 of 6', 'sm lab-b', 'start')}
      ${pill(560, 74, 116, 'sugar')}${tag(456, 50, '', 'pi')}${arrow(p, 'ink', 'M450,68 L424,134', 'dashed')}
    </g>
    ${T(636, 260, 'next slide', 'sm lab-b', 'start')}
    ${T(636, 82, 'after that', 'sm lab-b', 'start')}

    <rect class="node node-rub" x="336" y="494" width="128" height="44" rx="14"/>${T(400, 523, 'Rubisco', 'sm lab-b')}
    ${pent(400, 452, 42, 'RuBP')}
    ${molecule(290, 572, 'OCO', 12)}${arrow(p, 'ink', 'M318,560 L344,542')}${T(258, 548, 'CO₂', 'sm lab-b', 'end')}
    ${arrow(p, 'ink', 'M400,414 L400,364')}${T(388, 396, 'carboxylation', 'sm lab-b', 'end')}
    ${pill(400, 340, 120, '2 PGA')}
  `);
}

/* ---------- j · 5 + 1 = 2 × 3: the minimal icon ---------- */

function drawJ(): string {
  const p = 'fc02j';
  return svg(p, 'Minimal summary: a five-carbon RuBP plus one-carbon CO₂ gives, through Rubisco, two three-carbon 3-PGA. 5 C + 1 C → 2 × 3 C.', `
    ${pent(150, 252, 74, '5 C', 'node node-rubp', 'fc02-big')}${T(150, 372, 'RuBP', 'sm lab-b')}
    ${T(268, 268, '+', 'fc02-big')}
    ${molecule(336, 252, 'OCO', 16)}${T(336, 372, 'CO₂', 'sm lab-b')}${T(336, 306, '1 C', 'fc02-big')}
    ${arrow(p, 'ink', 'M396,252 L496,252', 'boost')}${T(446, 230, 'Rubisco', 'sm')}
    ${tri(600, 168, 66, '3 C', 'fc02-tri', 'fc02-big')}${tri(600, 356, 66, '3 C', 'fc02-tri', 'fc02-big')}
    ${T(690, 182, '3-PGA', 'sm lab-b', 'start')}${T(690, 370, '3-PGA', 'sm lab-b', 'start')}
    ${T(400, 520, '5 C + 1 C → 2 × 3 C', 'fc02-huge')}
  `);
}
