// Slide 9 (was 10) · ATP synthesis, redo of 27 Oct 2026; text from research/redo-2026-10-27/DRAFT_PAGES_MECHANISMS.md.
// Figure research: research/redo-2026-10-27/A_LIGHT_6-11.md, row 10).
// Figure variants from real published figures (sources: assets/SOURCES-L1b.md), labelled sparingly. Focus set by the lecturer
// on 27 Oct: the lumen proton gradient driving ATP synthase (the Q cycle itself is shown on slide 8).
// Jagendorf & Uribe 1966, Table 1 (luciferase assay, total, nmol ATP per mg chlorophyll), redrawn as bars: acid stage
// pH 3.8 → phosphorylation stage pH 8.0: 141; acid stage pH 7.0: 12; without phosphate: 12; without ADP: 4; without
// chloroplasts: 7 (without Mg²⁺: 60, left out). Methods (p. 170): spinach chloroplasts, (a) acid stage 60 s, (b) pH 8.0 with
// ADP, phosphate and MgCl₂ for 15 s, both at 0 °C, with DCMU so that no electron transport runs.
// Proton count per O₂ (4 e⁻): 4 H⁺ from water + 8 H⁺ through the b₆f Q cycle (2 per electron) = 12 H⁺ (Johnson 2016);
// c₁₄ ring: 14 H⁺ per turn, 3 ATP per turn, 4.67 H⁺ per ATP (Seelert et al. 2000; Hahn et al. 2018).
import type { PlateText, Variant } from '../types';
import hahnJpg from '../../assets/photos/9-hahn.jpg';
import seelertJpg from '../../assets/photos/9-seelert.jpg';
import flowJpg from '../../assets/photos/9-johnson-flow.jpg';
import './s10.css';

export const PLATE: PlateText = {
  n: '9',
  title: 'ATP synthesis',
  status: 'draft',
  lead: 'The H⁺ gradient across the thylakoid membrane drives ATP synthase, which makes ATP in the stroma.',
  points: [
    { claim: 'Proton gradient.', text: 'Water splitting and cytochrome b₆f load the lumen with H⁺<br>The acidic lumen stores the energy of electron transport' },
    { claim: 'ATP synthase.', text: 'H⁺ flow back to the stroma through ATP synthase and turn its rotor<br>The rotation drives ADP + Pᵢ → ATP' },
    { claim: 'Chemiosmosis.', text: 'Electron transport and ATP synthesis are linked only through the H⁺ gradient<br>An artificial pH gradient makes thylakoids produce ATP in the dark' },
  ],
  refs: [
    { label: 'Jagendorf & Uribe 1966', url: 'https://doi.org/10.1073/pnas.55.1.170' },
    { label: 'Johnson 2016', url: 'https://doi.org/10.1042/EBC20160016' },
    { label: 'Seelert et al. 2000', url: 'https://doi.org/10.1038/35013148' },
    { label: 'Hahn et al. 2018', url: 'https://doi.org/10.1126/science.aat4318' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Acid-bath ATP synthesis (Jagendorf & Uribe 1966)' },
  { id: 'b', name: 'Chloroplast ATP synthase (cryo-EM)' },
  { id: 'c', name: 'c₁₄ ring: 14 c subunits (AFM)' },
  { id: 'd', name: 'Proton gradient across the thylakoid membrane' },
  { id: 'e', name: 'c₁₄ ring: cryo-EM and AFM' },
  { id: 'f', name: 'Acid-bath ATP synthesis + ATP synthase' },
  { id: 'g', name: 'Proton budget: 12 H⁺ per O₂, 14 H⁺ per 3 ATP' },
];

/* ---------- shared helpers (pattern of l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fs10-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; hole?: [number, number, number, number] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const band = o.credit ? `<rect class="fs10-credbg" x="${f(x)}" y="${f(y + h - 22)}" width="${f(w)}" height="22"/>${T(x + w - 8, y + h - 6.5, o.credit, 'fs10-cr', 'end')}` : '';
  // The hole is clipped to the window first: a hole reaching outside the window would add that outside part under evenodd.
  const hc = o.hole && [Math.max(o.hole[0], u0), Math.max(o.hole[1], v0), Math.min(o.hole[2], u0 + uw), Math.min(o.hole[3], v0 + vh)];
  const hl = hc && hc[2] > hc[0] && hc[3] > hc[1] ? (([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`)(hc) : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z${hl}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fs10-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fs10-ldh" d="${d}"/><path class="fs10-ldk" d="${d}"/><circle class="fs10-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos and micrographs, tinted on white-ground figures; with `to`, a leader. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false, small = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * (small ? 8 : 8.8) + (small ? 14 : 22), hh = small ? 24 : 28;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), hh / 2 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fs10-pillbg-t' : 'fs10-pillbg'}" x="${f(x - w / 2)}" y="${f(y - hh / 2)}" width="${f(w)}" height="${hh}" rx="${hh / 2}"/>${T(x, y + (small ? 5.5 : 6), s, small ? 'fs10-pills' : 'fs10-pill', 'middle')}`;
}
const tw = (cls: string, s: string): string => `<tspan class="${cls}">${s}</tspan>`;
const sub = (s: string): string => `<tspan class="fs10-sub" dy="4">${s}</tspan><tspan dy="-4"> </tspan>`;
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fs10-crd', a);
const defs = (p: string): string => `<defs>
  <marker id="${p}-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path class="fs10-hd-ink" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto"><path class="fs10-hd-h" d="M0,0L10,5L0,10z"/></marker></defs>`;
const realSvg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fs10" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

const CR = {
  jag: 'Data: Jagendorf & Uribe 1966, PNAS, Table 1 (luciferase assay) · redrawn',
  hahn: 'Hahn et al. 2018, Science, Fig. 1A · © AAAS',
  seelert: 'Seelert et al. 2000, Nature, Fig. 2 · © Springer Nature',
  flow: 'Johnson 2016, Essays Biochem, Fig. 4 · CC BY 4.0, labels set again',
};

/* ---------- Jagendorf & Uribe 1966: the two stages and the ATP made, as bars ---------- */

const JAG: [string, string, number, boolean][] = [
  ['pH 3.8', '→ pH 8.0', 141, true], ['pH 7.0', '→ pH 8.0', 12, true], ['no ADP', '', 4, false], ['no Pᵢ', '', 12, false], ['no', 'chloroplasts', 7, false],
];

/** The protocol as two boxes in a row: acid stage, then base stage with ADP and phosphate. */
function stages(p: string, x: number, y: number, w: number, compact: boolean): string {
  const gap = compact ? 30 : 46, bw = (w - gap) / 2, bh = compact ? 100 : 74;
  const box = (bx: number, n: string, l1: string, l2: string, cls: string): string =>
    `<rect class="${cls}" x="${f(bx)}" y="${f(y)}" width="${f(bw)}" height="${bh}" rx="12"/>
     ${T(bx + 14, y + 28, n, 'fs10-h')}${T(bx + 14, y + 54, l1, 'fs10-l')}${l2 ? T(bx + 14, y + 80, l2, 'fs10-l') : ''}`;
  const a = compact ? box(x, '1 · acid stage', 'pH 3.8', '60 s', 'fs10-acid') : box(x, '1 · acid stage, 60 s', 'pH 3.8 (succinate)', '', 'fs10-acid');
  const b = compact ? box(x + bw + gap, '2 · base stage', 'pH 8.0, ADP, Pᵢ', '15 s', 'fs10-base') : box(x + bw + gap, '2 · base stage, 15 s', 'pH 8.0 + ADP + Pᵢ + Mg²⁺', '', 'fs10-base');
  return `${a}${b}<path class="fs10-ar" d="M${f(x + bw + 8)},${f(y + bh / 2)} H${f(x + bw + gap - 8)}" marker-end="url(#${p}-ink)"/>`;
}

/** The bar chart in the box x…x+w, y…y+h (plot area), with axis and labels. */
function bars(x: number, y: number, w: number, h: number, compact: boolean): string {
  const rows = compact ? JAG.slice(0, 3) : JAG;
  const vmax = 150, yv = (v: number): number => y + h - (v / vmax) * h, n = rows.length, slot = w / n, bw = slot * 0.56;
  const ax = `<path class="fs10-axis" d="M${f(x)},${f(y - 6)} V${f(y + h)} H${f(x + w)}"/>` + [0, 50, 100, 150].map(v =>
    `<path class="fs10-axis" d="M${f(x - 6)},${f(yv(v))} H${f(x)}"/>${T(x - 10, yv(v) + 6, `${v}`, 'fs10-ax', 'end')}`).join('');
  const title = `<text class="fs10-axt" transform="translate(${f(x - (compact ? 50 : 56))} ${f(y + h / 2)}) rotate(-90)" text-anchor="middle">ATP (nmol per mg Chl)</text>`;
  const bs = rows.map(([l1, l2, v, main], i) => {
    const cx = x + slot * (i + 0.5);
    return `<rect class="${i === 0 ? 'fs10-bar1' : main ? 'fs10-bar2' : 'fs10-bar3'}" x="${f(cx - bw / 2)}" y="${f(yv(v))}" width="${f(bw)}" height="${f(y + h - yv(v))}"/>
      ${T(cx, yv(v) - 9, `${v}`, i === 0 ? 'fs10-val1' : 'fs10-val', 'middle')}
      ${T(cx, y + h + 26, l1, compact ? 'fs10-cats' : 'fs10-cat', 'middle')}${l2 ? T(cx, y + h + (compact ? 46 : 48), l2, compact ? 'fs10-cats' : 'fs10-cat', 'middle') : ''}`;
  }).join('');
  return `${ax}${title}${bs}`;
}

/* ---------- a · Acid-bath ATP synthesis: the protocol and the ATP made (data redrawn) ---------- */

function drawA(): string {
  const p = 'fs10a';
  return realSvg(p, 'Jagendorf and Uribe 1966. Top: spinach chloroplasts are first held at pH 3.8 for 60 seconds, then moved to pH 8.0 with ADP, phosphate and magnesium for 15 seconds, all at 0 °C with DCMU, so no electron transport runs. Bottom, ATP formed per milligram of chlorophyll: 141 nanomoles after the jump from pH 3.8 to 8.0; 12 when the first stage was at pH 7.0; 4 without ADP; 12 without phosphate; 7 without chloroplasts.', `
    ${stages(p, 70, 14, 690, false)}
    ${T(415, 122, '0 °C · DCMU (no electron transport)', 'fs10-note', 'middle')}
    ${bars(150, 184, 560, 316, false)}
    ${credit(790, 594, CR.jag)}
  `);
}

/* ---------- b · Chloroplast ATP synthase, cryo-EM (Hahn et al. 2018, Fig. 1A, two views) ---------- */

const HAHN: Img = { href: hahnJpg, w: 915, h: 700 };
// Asset pixels (Fig. 1A minus its first 22 columns): membrane y 550–652. The paper's own labels of the right view sit at
// γ (780, 432), a (500, 620), c₁₄ (795, 625), αC (870, 290); its stroma / thylakoid membrane / lumen labels between the
// views at x 388–460, y 523, 575–615, 677. Our pills cover those labels with the same terms, larger.
/** The right view alone: window and hole (image pixels) that drops the fragments of the paper's middle labels. */
const RIGHT = { win: [440, 0, 475, 700] as [number, number, number, number], hole: [436, 495, 468, 700] as [number, number, number, number] };
/** Our pills over the paper's own labels of the right view; sides: 'patch' covers the middle labels of the two-view figure,
 *  'left' sets stroma / membrane / lumen left of a windowed right view, 'none' leaves them out. */
function hahnLabels(p: string, a: Shot, sides: 'patch' | 'left' | 'none'): string {
  const hp = a.at(598, 692), hq = a.at(598, 520), h = a.at(548, 505);
  const [c0, c1] = [a.at(384, 570), a.at(466, 618)];
  const side = sides === 'patch'
    ? `${pill(...a.at(424, 523), 'stroma', undefined, true, true)}<rect class="fs10-pillbg-t" x="${f(c0[0])}" y="${f(c0[1])}" width="${f(c1[0] - c0[0])}" height="${f(c1[1] - c0[1])}" rx="10"/>${pill(...a.at(424, 594), 'membrane', undefined, true)}${pill(...a.at(429, 677), 'lumen', undefined, true, true)}`
    : sides === 'left' ? `${pill(a.at(440, 0)[0] - 46, a.at(0, 523)[1], 'stroma', undefined, true, true)}${pill(a.at(440, 0)[0] - 50, a.at(0, 601)[1], 'membrane', undefined, true, true)}${pill(a.at(440, 0)[0] - 46, a.at(0, 677)[1], 'lumen', undefined, true, true)}` : '';
  return `${pill(...a.at(852, 290), 'α₃β₃ (F₁)', undefined, true)}${pill(...a.at(790, 403), 'γ (rotor)', undefined, true)}
    ${pill(...a.at(818, 625), 'c₁₄ ring (rotor)', undefined, true)}${pill(...a.at(500, 620), 'a', undefined, true)}${side}
    <path class="fs10-hpath" d="M${f(hp[0])},${f(hp[1])} L${f(hq[0])},${f(hq[1])}" marker-end="url(#${p}-h)"/>${pill(...h, tw('fs10-c-h', 'H⁺'))}`;
}
function drawB(): string {
  const p = 'fs10b', a = shot(`${p}-a`, HAHN, 40, 6, 720, { fig: true });
  return realSvg(p, 'Cryo-EM map of the spinach chloroplast ATP synthase in two views, the membrane as a grey band with stroma above and lumen below. The catalytic head of three alpha and three beta subunits sits in the stroma; the central stalk gamma connects it to the ring of 14 c subunits in the membrane; subunit a sits beside the ring, where protons pass from lumen to stroma.', `
    ${a.svg}${hahnLabels(p, a, 'patch')}
    ${credit(790, 594, CR.hahn)}
  `);
}

/* ---------- c · c₁₄ ring by atomic force microscopy (Seelert et al. 2000, Fig. 2) ---------- */

const SEE: Img = { href: seelertJpg, w: 584, h: 688 };
// Asset pixels: top field [0, 0, 584, 384] (10 nm bar); numbered ring [0, 405, 289, 283]; same ring, unnumbered, [295, 405, 289, 283] (5 nm bar).
function drawC(): string {
  const p = 'fs10c';
  const a = shot(`${p}-a`, SEE, 20, 60, 400, { win: [0, 405, 289, 283] });
  const b = shot(`${p}-b`, SEE, 440, 60, 340, { win: [0, 0, 584, 384] });
  return realSvg(p, 'Atomic force micrographs of isolated c-subunit rings of the spinach chloroplast ATP synthase. Left: one ring at high magnification with its 14 subunits numbered 1 to 14. Right: a field of rings, 10 nanometre scale bar.', `
    ${a.svg}${b.svg}
    ${pill(220, 488, '14 c subunits per ring', undefined, true)}
    ${pill(610, 318, 'c₁₄ rings, AFM', undefined, true)}
    ${pill(610, 378, '14 H⁺ per turn → 3 ATP', undefined, true)}
    ${credit(790, 594, CR.seelert)}
  `);
}

/* ---------- d · Proton gradient across the thylakoid membrane (Johnson 2016, Fig. 4), its small labels set again ---------- */

const FLOW: Img = { href: flowJpg, w: 720, h: 424 };
// Asset pixels of the paper's labels, each covered by a pill with the same term: H⁺ (stroma 201/304/616, 206–210; lumen 150/302/616,
// 373), NADP⁺ (345, 13), NADPH (506, 13), FNR (335, 92), ADP (530, 134), Pᵢ (585, 134), ATP (684, 131), PQ pool (253, 238),
// ferredoxin (384, 225), plastocyanin (387, 352), H₂O (104, 337), O₂ (210, 343), stroma / thylakoid / lumen (693, 240 / 272 / 305),
// complexes along the bottom (151, 304, 482, 626; 414), legend (133, 85 / 110).
function flow(p: string, x: number, y: number, w: number, legend: boolean, sides = true): { svg: string; a: Shot } {
  const a = shot(`${p}-f`, FLOW, x, y, w, { fig: true });
  const L = (u: number, v: number, s: string, small = true): string => pill(...a.at(u, v), s, undefined, false, small);
  /** A tinted patch over one of the paper's two-line labels, set again on one or two lines. */
  const cover = (u0: number, v0: number, u1: number, v1: number, l1: string, l2 = ''): string => {
    const [x0, y0] = a.at(u0, v0), [x1, y1] = a.at(u1, v1), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return `<rect class="fs10-pillbg" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" rx="8"/>${l2 ? `${T(cx, cy - 3, l1, 'fs10-pills', 'middle')}${T(cx, cy + 15, l2, 'fs10-pills', 'middle')}` : T(cx, cy + 5, l1, 'fs10-pills', 'middle')}`;
  };
  const h = [[201, 207], [304, 210], [616, 206], [150, 373], [302, 373], [616, 373]].map(([u, v]) => L(u, v, tw('fs10-c-h', 'H⁺'))).join('');
  return { a, svg: `${a.svg}${h}
    ${L(345, 14, 'NADP⁺', false)}${L(506, 14, 'NADPH', false)}${cover(274, 74, 398, 112, 'ferredoxin–NADP⁺', 'reductase (FNR)')}
    ${L(530, 134, 'ADP', false)}${L(585, 134, 'Pᵢ')}${L(684, 131, 'ATP', false)}
    ${cover(208, 222, 298, 256, 'plastoquinone', 'pool (PQ)')}${L(384, 225, 'ferredoxin')}${L(387, 352, 'plastocyanin')}${L(104, 337, 'H₂O')}${L(210, 343, 'O₂')}
    ${sides ? `${L(693, 240, 'stroma')}${L(687, 272, 'membrane')}${L(694, 305, 'lumen')}` : ''}
    ${L(151, 414, 'photosystem II', false)}${L(304, 414, 'cytochrome b₆f', false)}${L(482, 414, 'photosystem I', false)}${L(626, 414, 'ATP synthase', false)}
    ${legend ? `${L(130, 85, 'proton transfer')}${L(133, 110, 'electron transfer')}` : ''}` };
}
function drawD(): string {
  const p = 'fs10d', fl = flow(p, 20, 30, 760, true);
  return realSvg(p, 'The thylakoid membrane with photosystem II, cytochrome b6f, photosystem I and ATP synthase. Electrons run from water through photosystem II, the plastoquinone pool, cytochrome b6f, plastocyanin, photosystem I and ferredoxin to ferredoxin–NADP+ reductase, which makes NADPH in the stroma. Protons are released into the lumen by water oxidation at photosystem II and by cytochrome b6f, and flow back to the stroma through ATP synthase, which makes ATP from ADP and phosphate.', `
    ${fl.svg}
    ${pill(400, 540, 'lumen acidic (high H⁺) → H⁺ through ATP synthase → ATP', undefined, true)}
    ${credit(790, 594, CR.flow)}
  `);
}

/* ---------- e · the c₁₄ ring: cryo-EM side view (Hahn 2018) beside the AFM top view (Seelert 2000) ---------- */

function drawE(): string {
  const p = 'fs10e';
  const a = shot(`${p}-a`, HAHN, 84, 14, 330, { fig: true, ...RIGHT });
  const b = shot(`${p}-b`, SEE, 420, 120, 360, { win: [0, 405, 289, 283] });
  return realSvg(p, 'Left: cryo-EM map of the chloroplast ATP synthase, side view: catalytic head, central stalk gamma and, in the membrane, the ring of c subunits. Right: atomic force micrograph of one isolated c ring seen from above, its 14 subunits numbered.', `
    ${a.svg}${b.svg}
    ${hahnLabels(p, a, 'left')}
    ${pill(600, 80, '14 c subunits', undefined, true)}
    ${pill(600, 530, '14 H⁺ per turn → 3 ATP', undefined, true)}
    ${credit(384, 594, 'Hahn et al. 2018, Science, Fig. 1A · © AAAS')}${credit(790, 594, 'Seelert et al. 2000, Nature, Fig. 2 · © Springer Nature')}
  `);
}

/* ---------- f · acid-bath ATP synthesis beside the enzyme that makes it ---------- */

function drawF(): string {
  const p = 'fs10f';
  const a = shot(`${p}-a`, HAHN, 470, 20, 316, { fig: true, ...RIGHT });
  return realSvg(p, 'Left: Jagendorf and Uribe 1966: chloroplasts held at pH 3.8, then moved to pH 8.0 with ADP and phosphate in the dark make 141 nanomoles ATP per milligram chlorophyll; with the first stage at pH 7.0 only 12. Right: cryo-EM map of the chloroplast ATP synthase, side view: protons pass from lumen to stroma at subunit a and the c14 ring.', `
    ${stages(p, 14, 14, 390, true)}
    ${bars(96, 180, 270, 300, true)}
    ${a.svg}${hahnLabels(p, a, 'left')}
    ${credit(420, 594, 'Data: Jagendorf & Uribe 1966, PNAS, Table 1 · redrawn')}${credit(790, 594, 'Hahn et al. 2018, Science, Fig. 1A · © AAAS')}
  `);
}

/* ---------- g · the proton count: membrane overview (Johnson 2016) and the c₁₄ ring (Seelert 2000) ---------- */

function drawG(): string {
  const p = 'fs10g', fl = flow(p, 20, 6, 760, false);
  const b = shot(`${p}-b`, SEE, 636, 462, 136, { win: [0, 405, 289, 283] });
  return realSvg(p, 'Top: the thylakoid membrane with photosystem II, cytochrome b6f, photosystem I and ATP synthase, protons released into the lumen at photosystem II and cytochrome b6f and returned through ATP synthase. Bottom right: atomic force micrograph of one c ring of the chloroplast ATP synthase with its 14 subunits numbered. Per O2: 4 protons from water plus 8 from the Q cycle give 12 protons; 14 protons turn the c14 ring once and make 3 ATP.', `
    ${fl.svg}${b.svg}
    ${pill(320, 494, 'per O₂: 4 H⁺ (water) + 8 H⁺ (b₆f, Q cycle) = 12 H⁺', undefined, true)}
    ${pill(320, 536, '14 H⁺ per turn of the c₁₄ ring → 3 ATP', b.at(2, 545), true)}
    ${credit(620, 574, CR.flow)}${credit(620, 594, CR.seelert)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
