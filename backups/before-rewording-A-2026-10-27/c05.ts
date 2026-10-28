// Slide C05 · Rubisco reacts with CO₂—and O₂. Draft context checked in research/review-2026-10-23-claude/:
// D_C01-C06.md rows 38–50 (CONFIRMED only) and gap 4; REVIEW_SUMMARY.md essential 12, §5(c), §6.
// Facts drawn: RuBP + CO₂ → 2 × 3-PGA; RuBP + O₂ → 3-PGA + 2-PG; 2-PG inhibits TPI and SBPase (Flügel 2017);
// the outcome depends on CO₂ and O₂ at Rubisco and on its kinetics; warming raises oxygenation relative to
// carboxylation because both CO₂/O₂ specificity and the CO₂/O₂ solubility ratio fall (Walker 2016); Rubisco is
// ≈ 0.7 Gt, the most abundant enzyme, ≈ 3 % of leaf dry mass (Bar-On & Milo 2019); rbcL is among the slowest-evolving
// 1 % of genes, one amino-acid change per 7.2 My, kinetics still shifting, inference debated (Bouvier 2024).
// The earlier "Two doors" concept (c5.ts, 'c') is extended in variant a; its atom-ball and bead vocabulary is kept.
// Every plot is schematic and says so. No conscious "mistakes": the enzyme is never drawn as choosing.
import { molecule, tag } from '../illus';
import { text as t } from '../mechanisms';
import type { PlateText, Variant } from '../types';
import './c05.css';

export const PLATE: PlateText = {
  n: 'C5',
  // The serif title face has no subscript digits, so the subscripts are set as <sub> (the title is inserted as HTML).
  title: 'Rubisco reacts with CO<sub class="fc05-sub">2</sub>—and O<sub class="fc05-sub">2</sub>',
  status: 'draft',
  lead: 'Rubisco can add O₂ to RuBP instead of CO₂, making a product the cycle cannot use.',
  points: [
    { claim: 'Two gases compete for RuBP.', text: 'RuBP + O₂ gives 3-PGA plus 2-phosphoglycolate (2-PG), which inhibits cycle enzymes.' },
    { claim: 'Warming favours the O₂ reaction.', text: 'As leaves warm, Rubisco’s preference for CO₂ falls and CO₂’s solubility drops faster than O₂’s; more CO₂ tilts it back.' },
    { claim: 'A hard reaction, not a bad enzyme.', text: 'Typical for its chemistry; at ≈ 0.7 Gt Earth’s most abundant enzyme. More Rubisco raised yields by ≈ 10 % in first field trials; faster lab variants are not yet in crops.' },
  ],
  refs: [
    { label: 'Flügel et al. 2017', url: 'https://doi.org/10.1105/tpc.17.00256' },
    { label: 'Jordan & Ogren 1984', url: 'https://doi.org/10.1007/BF00398720' },
    { label: 'Bathellier et al. 2018', url: 'https://doi.org/10.1111/pce.13149' },
    { label: 'Flamholz et al. 2019', url: 'https://doi.org/10.1021/acs.biochem.9b00237' },
    { label: 'Bar-On & Milo 2019', url: 'https://doi.org/10.1073/pnas.1816654116' },
    { label: 'Salesse-Smith et al. 2025', url: 'https://doi.org/10.1111/nph.20298' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Two doors' },
  { id: 'b', name: 'Coin and token' },
  { id: 'd', name: 'Earth to site', anim: true },
  { id: 'e', name: 'Cool vs warm', anim: true },
  { id: 'f', name: 'Four steps' },
  { id: 'g', name: 'Carbon trace' },
  { id: 'h', name: '2-PG test' },
  { id: 'i', name: 'O₂ comes back' },
  { id: 'j', name: 'Three icons' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return coinSvg();
    case 'c': return slowSvg();
    case 'd': return zoomSvg();
    case 'e': return warmSvg();
    case 'f': return stepsSvg();
    case 'g': return heroSvg();
    case 'h': return evidenceSvg();
    case 'i': return equationSvg();
    case 'j': return iconsSvg();
    default: return doorsSvg();
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'clay' | 'grey' | 'heat';
const KS: K[] = ['ink', 'clay', 'grey', 'heat'];
type Anchor = 'start' | 'middle' | 'end';
const f1 = (v: number): string => v.toFixed(1);

const defs = (p: string): string =>
  `<defs>${KS.map(k => `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fc05-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fc05-ar fc05-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc05" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

const lines = (x: number, y: number, ss: string[], cls = 'sm', anchor: Anchor = 'start', dy = 28): string =>
  ss.map((s, i) => t(x, y + i * dy, s, cls, anchor)).join('');

const num = (x: number, y: number, n: string): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="15"/>${t(x, y + 6, n, 'num-t')}`;

/** A carbon skeleton: n beads on a bond; `pr` draws 2-PG in clay; bead `hi` is the carbon that came from CO₂. */
function chain(x: number, y: number, n: number, pr = false, r = 8, gap = 20, hi = -1): string {
  const x0 = x - ((n - 1) * gap) / 2;
  const bond = n > 1 ? `<path class="${pr ? 'fc05-bond-pr' : 'fc05-bond'}" d="M${f1(x0)},${y} H${f1(x0 + (n - 1) * gap)}"/>` : '';
  return bond + Array.from({ length: n }, (_, i) =>
    `<circle class="${i === hi ? 'fc05-bead-c' : pr ? 'bead bead-pr' : 'bead'}" cx="${f1(x0 + i * gap)}" cy="${y}" r="${r}"/>`).join('');
}

function ngon(x: number, y: number, r: number, n: number, rot: number): Array<[number, number]> {
  return Array.from({ length: n }, (_, k) => {
    const a = ((rot + (k * 360) / n) * Math.PI) / 180;
    return [x + r * Math.cos(a), y + r * Math.sin(a)] as [number, number];
  });
}

/** RuBP as the thesis draws it: a pentagon; with `beads`, its five carbons sit at the corners. */
function pent(x: number, y: number, r: number, label = 'RuBP', beads = false): string {
  const v = ngon(x, y, r, 5, -90), pts = v.map(([a, b]) => `${f1(a)},${f1(b)}`).join(' ');
  return `<polygon class="${beads ? 'fc05-pent-bond' : 'node node-rubp'}" points="${pts}"${beads ? ' style="fill:#fffdf8"' : ''}/>` +
    (beads ? v.map(([a, b]) => `<circle class="bead" cx="${f1(a)}" cy="${f1(b)}" r="7.5"/>`).join('') : '') +
    (label ? t(x, y + 6, label, 'fc05-rubp') : '');
}

/** An arched door with its sill at yB. */
function door(cx: number, w: number, yT: number, yB: number): string {
  const r = w / 2;
  return `<path class="fc05-door" d="M${cx - r},${yB} V${yT + r} A${r},${r} 0 0 1 ${cx + r},${yT + r} V${yB} Z"/>`;
}

/** A reaction arrow from x0 to x1 at height y with light written over it (textbook notation, as on slide 1), dimmed. */
const rxLight = (x0: number, x1: number, y: number): string =>
  `<path class="fc05-rx" d="M${x0},${y} H${x1 - 5}"/><path class="fc05-rxh" d="M${x1},${y} L${x1 - 9},${y - 4.5} L${x1 - 9},${y + 4.5} Z"/>` +
  t((x0 + x1) / 2, y - 10, 'light', 'fc05-rxl');

/** An enzyme chip (cycle enzymes). */
const chip = (x: number, y: number, s: string, w: number): string =>
  `<rect class="fc05-chipbox" x="${x - w / 2}" y="${y - 18}" width="${w}" height="36" rx="10"/>${t(x, y + 7, s, 'fc05-chip')}`;

/** Inhibition: a clay line ending in a bar. */
function inhibit(x0: number, y0: number, x1: number, y1: number): string {
  const l = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / l, ny = (x1 - x0) / l;
  return `<path class="fc05-block" d="M${x0},${y0} L${x1},${y1} M${f1(x1 + nx * 11)},${f1(y1 + ny * 11)} L${f1(x1 - nx * 11)},${f1(y1 - ny * 11)}"/>`;
}

/** A thermometer whose bulb sits at (x, y); level 0…1. */
function thermo(x: number, y: number, level: number, h = 58): string {
  const top = y - h, ft = y - 10 - level * (h - 18);
  return `<rect class="fc05-th" x="${x - 7}" y="${top}" width="14" height="${h}" rx="7"/><circle class="fc05-th" cx="${x}" cy="${y}" r="12"/>` +
    `<rect class="fc05-th-fill" x="${x - 3.5}" y="${f1(ft)}" width="7" height="${f1(y - ft)}" rx="3"/><circle class="fc05-th-fill" cx="${x}" cy="${y}" r="8"/>`;
}

/** The Calvin–Benson cycle as a circular arrow. */
function cyc(p: string, x: number, y: number, r: number): string {
  const a0 = (-60 * Math.PI) / 180, a1 = (250 * Math.PI) / 180;
  return `<path class="fc05-cyc" d="M${f1(x + r * Math.cos(a0))},${f1(y + r * Math.sin(a0))} A${r},${r} 0 1 1 ${f1(x + r * Math.cos(a1))},${f1(y + r * Math.sin(a1))}" marker-end="url(#${p}-grey)"/>`;
}

function gear(x: number, y: number, r: number, n: number): string {
  const pts: string[] = [];
  for (let k = 0; k < n; k++) {
    const a = (k * 2 * Math.PI) / n, w = Math.PI / n / 1.6;
    for (const [da, rr] of [[-w * 1.3, r], [-w * 0.7, r + 8], [w * 0.7, r + 8], [w * 1.3, r]] as Array<[number, number]>)
      pts.push(`${f1(x + rr * Math.cos(a + da))},${f1(y + rr * Math.sin(a + da))}`);
  }
  return `<polygon class="fc05-gear" points="${pts.join(' ')}"/><circle class="fc05-hole" cx="${x}" cy="${y}" r="${f1(r * 0.32)}"/>`;
}

const coin = (x: number, y: number, r = 18): string =>
  `<circle class="fc05-coin" cx="${x}" cy="${y}" r="${r}"/><circle class="fc05-coin-in" cx="${x}" cy="${y}" r="${f1(r * 0.66)}"/>`;
const token = (x: number, y: number, r = 18): string =>
  `<circle class="fc05-token" cx="${x}" cy="${y}" r="${r}"/><circle class="fc05-hole" cx="${x}" cy="${y}" r="${f1(r * 0.36)}"/>`;
const can = (x: number, y: number): string =>
  `<rect class="fc05-can" x="${x - 28}" y="${y - 16}" width="56" height="32" rx="8"/>${chain(x, y, 3, false, 5.5, 14)}`;
/** A wrench: clearing the jam. */
const wrench = (x: number, y: number, k = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${k}) rotate(-45)"><rect class="fc05-wrench" x="-4" y="-2" width="34" height="8" rx="4"/><circle class="fc05-wrench" cx="-8" cy="2" r="11"/><rect class="fc05-wrench-cut" x="-22" y="-2" width="14" height="8"/></g>`;
const jam = (x: number, y: number): string =>
  `<rect class="fc05-jam" x="${x - 22}" y="${y - 16}" width="44" height="32" rx="8"/>${chain(x, y, 2, true, 5.5, 14)}`;

/* ---------- a · Two doors (extends c5.ts 'c') ---------- */

function doorsSvg(): string {
  const p = 'fc05a';
  const L = 210, R = 590;
  return svg(p, 'Rubisco has two doors. Through the CO₂ door RuBP gives two 3-PGA, which go on through the cycle. Through the O₂ door it gives 3-PGA and 2-PG; 2-PG inhibits the cycle enzymes TPI and SBPase and is recycled by photorespiration. Warming sends relatively more traffic through the O₂ door',
    `<g transform="translate(0 22)">
    <rect class="node node-rub" x="90" y="16" width="620" height="196" rx="30"/>${t(400, 58, 'Rubisco', 'lab fc05-b')}
    ${pent(400, 140, 42)}${t(400, 202, '5 C', 'tiny')}
    ${door(L, 124, 62, 212)}${door(R, 124, 62, 212)}
    ${molecule(L, 136, 'OCO', 15)}${t(L, 190, 'CO₂', 'lab fc05-b')}
    ${molecule(R, 136, 'OO', 15)}${t(R, 190, 'O₂', 'lab fc05-b')}

    ${ar(p, 'ink', `M${L},218 L${L},266`)}${t(L + 16, 250, 'carboxylation', 'sm fc05-b', 'start')}
    ${ar(p, 'clay', `M${R},218 L${R},266`)}${t(R - 16, 250, 'oxygenation', 'sm fc05-b fc05-clay', 'end')}

    ${chain(L - 42, 296, 3)}${chain(L + 42, 296, 3)}${t(L, 336, '2 × 3-PGA', 'sm fc05-b')}
    ${ar(p, 'ink', `M${L},350 L${L},392`)}${cyc(p, L, 440, 34)}
    ${t(L, 512, 'reduced in the cycle', 'sm')}

    ${chain(R - 56, 296, 3)}${chain(R + 50, 296, 2, true)}${t(R - 56, 336, '3-PGA', 'sm fc05-b')}${t(R + 50, 336, '2-PG', 'sm fc05-b fc05-clay')}
    ${inhibit(R + 38, 352, R - 10, 402)}${inhibit(R + 62, 352, R + 110, 402)}
    ${chip(R - 30, 424, 'TPI', 76)}${chip(R + 120, 424, 'SBPase', 108)}
    ${lines(R + 45, 486, ['recycled by', 'photorespiration'], 'sm fc05-clay', 'middle', 26)}
    </g>`);
}

/* ---------- b · Coin and token: the analogy, mapped label by label ---------- */

function coinSvg(): string {
  const p = 'fc05b';
  const map = (x: number, y: number, a: string, real: string): string =>
    `<text class="sm" x="${x}" y="${y}"><tspan class="fc05-b">${a}</tspan> <tspan class="fc05-map">= ${real}</tspan></text>`;
  return svg(p, 'Analogy: a slot (Rubisco) takes coins (CO₂) but also a look-alike token (O₂). A coin gives two cans (3-PGA). A token gives one can and a jam (2-PG) that blocks the gears (the cycle enzymes TPI and SBPase); clearing the jam (photorespiration) costs energy. On a hot day more tokens slip in',
    `${coin(52, 206)}${token(100, 206)}${coin(148, 206)}${coin(196, 206)}${ar(p, 'ink', 'M218,206 L240,206')}
    ${t(124, 256, 'coins and a', 'sm', 'middle')}${t(124, 282, 'look-alike token', 'sm', 'middle')}
    <rect class="node node-rub" x="252" y="40" width="270" height="320" rx="26"/>
    <rect class="fc05-slot" x="246" y="176" width="12" height="60" rx="3"/>${t(240, 160, 'slot', 'sm fc05-b', 'end')}
    ${gear(350, 272, 38, 10)}${gear(440, 288, 30, 8)}${jam(396, 268)}${wrench(486, 330)}
    ${t(350, 344, 'gears', 'sm fc05-b')}

    ${ar(p, 'ink', 'M524,110 L574,110')}${can(612, 110)}${can(678, 110)}${t(645, 76, 'coin: 2 cans', 'sm fc05-b')}
    ${ar(p, 'clay', 'M524,220 L574,220', 'fc05-solid')}${can(612, 220)}${jam(680, 220)}${t(645, 186, 'token: can + jam', 'sm fc05-b fc05-clay')}
    ${ar(p, 'clay', 'M680,242 C680,300 560,318 470,262')}${t(650, 328, 'the jam blocks', 'sm fc05-clay', 'start')}${t(650, 354, 'the gears', 'sm fc05-clay', 'start')}

    <path class="rule" d="M20,390 H780"/>
    ${coin(44, 426, 14)}${map(70, 434, 'coin', 'CO₂')}
    ${token(44, 470, 14)}${map(70, 478, 'token', 'O₂')}
    <rect class="fc05-slot" x="38" y="496" width="12" height="36" rx="3"/>${map(70, 522, 'slot', 'Rubisco')}
    ${thermo(44, 580, 0.85, 40)}${map(70, 572, 'hot day', 'warm leaf:')}${t(70, 596, 'more tokens slip in', 'sm fc05-map', 'start')}
    ${can(436, 426)}${map(476, 434, 'can', '3-PGA')}
    ${jam(436, 470)}${map(476, 478, 'jam', '2-PG')}
    ${gear(436, 516, 12, 7)}${map(476, 522, 'gears', 'TPI, SBPase')}
    ${wrench(430, 574, 0.8)}${t(476, 566, 'clearing the jam', 'sm fc05-b', 'start')}${t(476, 592, '= photorespiration', 'sm fc05-map', 'start')}`);
}

/* ---------- c · Slow, not frozen: the gene-rate evidence (schematic) ---------- */

function slowSvg(): string {
  const mu = 0.62, sd = 0.15, x0 = 90, x1 = 760, yb = 450, hgt = 240;
  const X = (u: number): number => x0 + u * (x1 - x0);
  const f = (u: number): number => Math.exp(-((u - mu) ** 2) / (2 * sd * sd));
  const curve = (a: number, b: number): string => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) { const u = a + ((b - a) * i) / 120; pts.push(`${f1(X(u))},${f1(yb - hgt * f(u))}`); }
    return pts.join(' L');
  };
  const q = mu - 2.33 * sd, pin = 0.21;
  return svg('fc05c', 'Schematic distribution of how fast plant genes change. rbcL, the gene for Rubisco’s large subunit, sits in the slowest one per cent, about one amino-acid change per 7.2 million years; comparative work still finds its kinetics changing, an inference that is debated',
    `<path class="fc05-dens" d="M${X(0)},${yb} L${curve(0, 1)} L${X(1)},${yb} Z"/>
    <path class="fc05-tail" d="M${X(0)},${yb} L${curve(0, q)} L${f1(X(q))},${yb} Z"/>
    <path class="axis" d="M${x0},${yb} H${x1}"/>
    ${t(x0, yb + 32, '← slower', 'tl', 'start')}${t(x1, yb + 32, 'faster →', 'tl', 'end')}
    ${t((x0 + x1) / 2, yb + 32, 'rate of change', 'tl')}
    <text class="tl" transform="translate(${x0 - 22} ${yb - 100}) rotate(-90)" text-anchor="middle">number of genes</text>
    ${t(150, yb - 26, 'slowest 1 %', 'sm fc05-b fc05-clay')}
    <path class="pin" d="M${f1(X(pin))},${f1(yb - 6)} V${150}"/><circle class="fc05-bead-c" cx="${f1(X(pin))}" cy="${f1(yb - 4)}" r="6"/>
    <text class="sm" x="${f1(X(pin) - 12)}" y="100"><tspan class="fc05-b fc05-i">rbcL</tspan> (Rubisco large subunit)</text>
    ${t(X(pin) - 12, 130, '≈ 1 amino-acid change per 7.2 million years', 'sm', 'start')}
    <text class="sm" x="400" y="534" text-anchor="middle"><tspan class="fc05-b">Slow, not frozen:</tspan> kinetics still evolving (debated)</text>
    ${t(790, 596, 'schematic distribution', 'tiny', 'end')}`);
}

/* ---------- d · Earth to active site: a zoom ---------- */

function zoomSvg(): string {
  const p = 'fc05d';
  const land = 'M84,128 C96,110 122,112 128,126 C134,140 116,150 104,148 C92,146 78,140 84,128 Z M140,160 C150,150 170,152 172,166 C174,184 156,196 146,186 C138,178 132,170 140,160 Z M100,180 C110,174 124,178 120,190 C116,198 102,196 100,180 Z';
  const rubDots = [[594, 190], [604, 230], [626, 244], [652, 242], [674, 226], [680, 198], [662, 180], [584, 212]]
    .map(([x, y]) => `<circle class="fc05-rub-dot" cx="${x}" cy="${y}" r="6"/>`).join('');
  return svg(p, 'Zoom from Earth to the active site: Rubisco totals about 0.7 Gt worldwide, the most abundant enzyme; it is about 3 per cent of a leaf’s dry mass; it sits in the chloroplast stroma; in its active site RuBP can react with CO₂ or with O₂',
    `${t(130, 62, 'Earth', 'sm fc05-b')}${t(130, 90, '≈ 0.7 Gt Rubisco', 'sm')}
    <circle class="fc05-globe" cx="130" cy="208" r="64"/><g transform="translate(0 58)"><path class="fc05-land" d="${land}"/></g>
    <circle class="fc05-lens" cx="152" cy="226" r="11"/><path class="fc05-zoom" d="M162,218 L322,176 M160,236 L322,240"/>

    ${t(380, 62, 'Leaf', 'sm fc05-b')}${t(380, 90, '≈ 3 % of dry mass', 'sm')}
    <circle class="fc05-panel" cx="380" cy="208" r="64"/>
    <ellipse class="fc05-leaf" cx="380" cy="208" rx="52" ry="23" transform="rotate(-24 380 208)"/><path class="fc05-vein" d="M336,228 L424,190"/>
    <circle class="fc05-lens" cx="398" cy="208" r="10"/><path class="fc05-zoom" d="M407,202 L566,170 M406,216 L566,248"/>

    ${t(634, 62, 'Chloroplast', 'sm fc05-b')}${t(634, 90, 'in the stroma', 'sm')}
    <circle class="fc05-panel" cx="634" cy="208" r="72"/>
    <ellipse class="fc05-cp" cx="634" cy="208" rx="62" ry="42"/>
    <rect class="fc05-gr" x="606" y="191" width="30" height="7" rx="3"/><rect class="fc05-gr" x="606" y="200" width="30" height="7" rx="3"/><rect class="fc05-gr" x="606" y="209" width="30" height="7" rx="3"/>
    ${rubDots}<circle class="fc05-lens" cx="652" cy="242" r="11"/>
    <path class="fc05-zoom" d="M644,252 L470,330 M662,250 L740,330"/>

    <rect class="fc05-panel" x="40" y="330" width="720" height="258" rx="20"/>
    ${t(62, 370, 'Active site', 'sm fc05-b', 'start')}
    <path class="node node-rub" d="M60,586 L60,548 C200,532 300,532 336,540 C352,580 448,580 464,540 C500,532 600,532 740,548 L740,586 Z"/>
    ${pent(400, 536, 28)}${t(84, 576, 'Rubisco', 'sm fc05-b', 'start')}
    ${molecule(200, 438, 'OCO', 14)}${ar(p, 'ink', 'M236,450 L362,516')}${t(200, 478, 'CO₂', 'sm fc05-b')}${t(200, 504, 'carboxylation', 'sm')}
    ${molecule(600, 438, 'OO', 14)}${ar(p, 'clay', 'M566,450 L438,516')}${t(600, 478, 'O₂', 'sm fc05-b')}${t(600, 504, 'oxygenation', 'sm fc05-clay')}`);
}

/* ---------- e · Cool vs warm leaf ---------- */

function warmSvg(): string {
  const p = 'fc05e';
  const half = (ox: number, warm: boolean): string => {
    const X = (v: number): number => ox + v;
    const co2 = warm ? [[70, 166], [250, 206]] : [[70, 166], [180, 206], [250, 160], [330, 210]];
    const o2 = warm ? [[120, 210], [150, 158], [220, 176], [290, 194], [320, 156]] : [[120, 210], [150, 158], [220, 176], [290, 194], [320, 156], [100, 186]];
    const gas = co2.map(([x, y]) => molecule(X(x), y, 'OCO', 8)).join('') + o2.map(([x, y]) => molecule(X(x), y, 'OO', 8)).join('');
    const wc = warm ? 26 : 34, wo = warm ? 20 : 8;
    const band = (y0: number, w: number, y1: number, cls: string): string =>
      `<path class="${cls}" d="M${X(146)},${y0 - w / 2} C${X(220)},${y0 - w / 2} ${X(230)},${y1 - w / 2} ${X(300)},${y1 - w / 2} L${X(300)},${y1 + w / 2} C${X(230)},${y1 + w / 2} ${X(220)},${y0 + w / 2} ${X(146)},${y0 + w / 2} Z"/>`;
    return `<rect class="${warm ? 'fc05-warm' : 'fc05-cool'}" x="${X(10)}" y="10" width="380" height="562" rx="20"/>
      ${thermo(X(40), 74, warm ? 0.9 : 0.25, 52)}${t(X(66), 66, warm ? 'Warm leaf' : 'Cool leaf', 'lab fc05-b', 'start')}
      ${t(X(30), 128, 'dissolved CO₂ and O₂', 'sm fc05-grey', 'start')}
      <rect class="fc05-water" x="${X(30)}" y="138" width="340" height="96" rx="12"/>${gas}
      ${t(X(30), 278, 'Rubisco’s preference for CO₂', 'sm fc05-grey', 'start')}
      <rect class="fc05-gauge" x="${X(30)}" y="290" width="340" height="22" rx="11"/><rect class="fc05-gauge-fill" x="${X(30)}" y="290" width="${warm ? 236 : 300}" height="22" rx="11"/>
      ${t(X(30), 362, 'products', 'sm fc05-grey', 'start')}
      <rect class="node node-rub" x="${X(30)}" y="392" width="116" height="80" rx="14"/>${pent(X(88), 432, 30)}
      ${band(420, wc, 410, 'fc05-flow-c')}${band(446, wo, 486, 'fc05-flow-o')}
      ${t(X(308), 400, '3-PGA', 'sm fc05-b', 'start')}${t(X(308), 426, '(CO₂)', 'sm', 'start')}
      ${t(X(308), 482, '2-PG', 'sm fc05-b fc05-clay', 'start')}${t(X(308), 508, '(O₂)', 'sm fc05-clay', 'start')}
      ${t(X(200), 548, warm ? 'relatively more 2-PG' : 'mostly CO₂ fixed', `sm fc05-b${warm ? ' fc05-clay' : ''}`)}`;
  };
  return svg(p, 'Schematic comparison of a cool and a warm leaf. In the warm leaf both gases dissolve less, CO₂ more so than O₂, and Rubisco’s preference for CO₂ is lower (about two-thirds of the effect), so relatively more RuBP is oxygenated to 2-PG',
    half(0, false) + half(400, true) + t(790, 592, 'schematic: widths show the trend only', 'tiny', 'end'));
}

/* ---------- f · Four steps ---------- */

function stepsSvg(): string {
  const p = 'fc05f';
  const box = (col: number, row: number, n: string, title: string, txt: string[], icon: (x: number, y: number) => string): string => {
    const x = 10 + col * 396, y = 10 + row * 296;
    return `<rect class="fc05-panel" x="${x}" y="${y}" width="384" height="284" rx="18"/>
      ${num(x + 30, y + 32, n)}${t(x + 56, y + 40, title, 'sm fc05-b', 'start')}
      ${icon(x, y)}${lines(x + 192, y + 240, txt, 'sm', 'middle', 27)}`;
  };
  return svg(p, 'Four steps: RuBP sits in Rubisco’s active site; CO₂ or O₂ can react with it; CO₂ gives two 3-PGA, O₂ gives 3-PGA and 2-PG; 2-PG inhibits TPI and SBPase and is recycled by photorespiration',
    box(0, 0, '1', 'RuBP binds', ['RuBP (5 C) in the active site'], (x, y) =>
      `<path class="node node-rub" d="M${x + 60},${y + 190} L${x + 60},${y + 140} C${x + 110},${y + 126} ${x + 140},${y + 126} ${x + 152},${y + 136} C${x + 166},${y + 176} ${x + 218},${y + 176} ${x + 232},${y + 136} C${x + 250},${y + 126} ${x + 290},${y + 126} ${x + 324},${y + 140} L${x + 324},${y + 190} Z"/>
       ${pent(x + 192, y + 116, 30)}${ar(p, 'grey', `M${x + 192},${y + 64} L${x + 192},${y + 78}`)}`) +
    box(1, 0, '2', 'CO₂ or O₂ adds', ['either gas can react'], (x, y) =>
      `${pent(x + 192, y + 128, 34)}${molecule(x + 72, y + 110, 'OCO', 13)}${ar(p, 'ink', `M${x + 104},${y + 118} L${x + 150},${y + 126}`)}
       ${molecule(x + 316, y + 110, 'OO', 13)}${ar(p, 'clay', `M${x + 292},${y + 118} L${x + 234},${y + 126}`)}
       ${t(x + 72, y + 152, 'CO₂', 'sm fc05-b')}${t(x + 316, y + 152, 'O₂', 'sm fc05-b')}`) +
    box(0, 1, '3', 'Two outcomes', ['only CO₂ fixes carbon'], (x, y) =>
      `${chain(x + 64, y + 104, 3)}${chain(x + 144, y + 104, 3)}${t(x + 104, y + 146, '2 × 3-PGA', 'sm fc05-b')}
       <path class="rule" d="M${x + 196},${y + 76} V${y + 170}"/>
       ${chain(x + 250, y + 104, 3)}${chain(x + 330, y + 104, 2, true)}${t(x + 250, y + 146, '3-PGA', 'sm fc05-b')}${t(x + 330, y + 146, '2-PG', 'sm fc05-b fc05-clay')}`) +
    box(1, 1, '4', '2-PG must be cleared', ['photorespiration recycles it'], (x, y) =>
      `${chain(x + 70, y + 120, 2, true)}${t(x + 70, y + 160, '2-PG', 'sm fc05-b fc05-clay')}
       ${inhibit(x + 96, y + 108, x + 176, y + 88)}${inhibit(x + 96, y + 132, x + 176, y + 152)}
       ${chip(x + 230, y + 86, 'TPI', 76)}${chip(x + 236, y + 154, 'SBPase', 104)}`));
}

/* ---------- g · Carbon trace: the thesis-style hero ---------- */

function heroSvg(): string {
  const p = 'fc05g';
  return svg(p, 'Thesis-style scheme: CO₂ and O₂ meet RuBP at Rubisco. Carboxylation gives two 3-PGA, one carrying the carbon from CO₂; both go on through the cycle with ATP and NADPH. Oxygenation gives 3-PGA and 2-PG; 2-PG inhibits TPI and SBPase and goes to photorespiration. Warming favours oxygenation',
    `<rect class="node node-rub" x="310" y="486" width="180" height="60" rx="16"/>${t(400, 524, 'Rubisco', 'lab fc05-b')}
    ${pent(400, 404, 48, '', true)}${t(400, 412, 'RuBP', 'fc05-rubp')}
    ${molecule(214, 556, 'OCO', 14)}${ar(p, 'ink', 'M250,542 L306,514')}
    ${molecule(586, 556, 'OO', 14)}${ar(p, 'ink', 'M556,542 L494,514', 'fc05-k-clay')}

    ${ar(p, 'ink', 'M352,384 L258,268')}
    <text class="fc05-rot" x="0" y="0" text-anchor="middle" transform="translate(272 356) rotate(51)" style="fill:#3d3d3a">carboxylation</text>
    ${chain(206, 204, 3)}${chain(206, 242, 3, false, 8, 20, 0)}${t(206, 172, '2 × 3-PGA', 'sm fc05-b')}
    ${t(166, 250, 'C from CO₂', 'sm', 'end')}

    ${ar(p, 'clay', 'M448,384 L530,294')}
    <text class="fc05-rot" x="0" y="0" text-anchor="middle" transform="translate(518 366) rotate(-48)" style="fill:#a9532f">oxygenation</text>
    ${chain(560, 236, 3)}${chain(650, 236, 2, true)}${t(560, 276, '3-PGA', 'sm fc05-b')}${t(650, 276, '2-PG', 'sm fc05-b fc05-clay')}

    <rect class="node" x="214" y="40" width="372" height="48" rx="24"/>${t(400, 72, 'reduced to sugar; RuBP rebuilt', 'sm fc05-b')}
    ${tag(140, 64, 'ATP', 'atp')}${tag(676, 64, 'NADPH', 'nadph')}${ar(p, 'ink', 'M172,64 L206,64')}${ar(p, 'ink', 'M630,64 L594,64')}
    ${ar(p, 'ink', 'M240,150 L268,94')}${ar(p, 'ink', 'M552,218 L492,94')}
    ${inhibit(648, 220, 590, 98)}${lines(652, 128, ['inhibits', 'TPI, SBPase'], 'sm fc05-clay', 'start', 26)}
    ${ar(p, 'clay', 'M672,244 L716,298')}
    <rect class="node node-pr" x="596" y="304" width="196" height="44" rx="22"/>${t(694, 334, 'photorespiration', 'sm fc05-b fc05-clay')}
    ${thermo(640, 456, 0.85, 50)}${lines(662, 438, ['warmer:', 'more 2-PG'], 'sm fc05-clay', 'start', 26)}`);
}

/* ---------- h · The 2-PG test: evidence (schematic, after Flügel et al. 2017) ---------- */

function evidenceSvg(): string {
  const p = 'fc05h';
  const yb = 452, top = 170;
  const bar = (x: number, h: number, cls: string, lab: string): string =>
    `<rect class="${cls}" x="${x - 26}" y="${yb - h}" width="52" height="${h}" rx="4"/>${t(x, yb + 24, lab, 'tiny')}`;
  return svg(p, 'Evidence, schematic after Flügel et al. 2017: 2-PG, made when Rubisco reacts with O₂, inhibits two Calvin–Benson enzymes, triose-phosphate isomerase (TPI) and SBPase. Their activity is lower with 2-PG present. So 2-PG must be cleared, which is the job of photorespiration',
    `${t(190, 90, 'Where 2-PG acts', 'sm fc05-b')}
    <g transform="translate(0 40)">
    ${cyc(p, 190, 262, 112)}
    <rect class="node node-rub" x="134" y="132" width="112" height="40" rx="12"/>${t(190, 159, 'Rubisco', 'sm fc05-b')}
    ${t(312, 270, 'reduction', 'sm', 'start')}${t(190, 404, 'regeneration', 'sm', 'middle')}
    ${chip(276, 340, 'TPI', 72)}${chip(98, 340, 'SBPase', 104)}
    ${ar(p, 'clay', 'M190,176 L190,232')}${t(204, 210, 'O₂', 'sm fc05-b', 'start')}
    ${chain(190, 258, 2, true)}${t(166, 266, '2-PG', 'sm fc05-b fc05-clay', 'end')}
    ${inhibit(208, 270, 252, 318)}${inhibit(172, 270, 120, 318)}
    </g>

    ${t(627, 90, 'Enzyme activity', 'sm fc05-b')}
    <path class="axis" d="M470,${top - 10} V${yb} H784"/>
    <text class="tl" transform="translate(456 ${(yb + top) / 2}) rotate(-90)" text-anchor="middle">activity →</text>
    ${bar(526, 240, 'fc05-bar-a', '− 2-PG')}${bar(590, 104, 'fc05-bar-b', '+ 2-PG')}
    ${bar(680, 240, 'fc05-bar-a', '− 2-PG')}${bar(744, 104, 'fc05-bar-b', '+ 2-PG')}
    ${t(558, yb + 58, 'TPI', 'sm fc05-b')}${t(712, yb + 58, 'SBPase', 'sm fc05-b')}
    ${t(790, 590, 'schematic, after Flügel et al. 2017', 'tiny', 'end')}`);
}

/* ---------- i · O₂ comes back: the equation thread ---------- */

function equationSvg(): string {
  const p = 'fc05i';
  const row = (y: number, gas: string, prods: string, beads: string, note: string[], ox: boolean): string =>
    `${t(150, y, 'RuBP', 'lab fc05-b')}${t(212, y, '+', 'lab')}${t(268, y, gas, `lab fc05-b${ox ? ' fc05-clay' : ''}`)}${t(326, y, '→', 'lab')}${prods}
     ${beads}${lines(566, y - 12, note, `sm${ox ? ' fc05-clay' : ''}`, 'start', 26)}`;
  return svg(p, 'The opening equation, 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O with light over the arrow, with CO₂ and O₂ highlighted. O₂, a product of photosynthesis from water, comes back to compete with CO₂ at Rubisco: RuBP plus CO₂ gives two 3-PGA and fixes carbon; RuBP plus O₂ gives 3-PGA and 2-PG, which must be recycled',
    `<rect class="fc05-eqbox" x="44" y="34" width="104" height="54" rx="12"/>
    ${t(96, 72, '6 CO₂', 'fc05-eq')}${t(156, 72, '+ 12 H₂O', 'fc05-eq fc05-dim', 'start')}${rxLight(288, 354, 62)}
    ${t(364, 72, 'C₆H₁₂O₆ +', 'fc05-eq fc05-dim', 'start')}
    <rect class="fc05-eqbox-o" x="514" y="34" width="94" height="54" rx="12"/>${t(561, 72, '6 O₂', 'fc05-eq')}
    ${t(616, 72, '+ 6 H₂O', 'fc05-eq fc05-dim', 'start')}

    ${ar(p, 'ink', 'M96,94 L96,279 L294,279')}${t(112, 170, 'taken from the air', 'sm', 'start')}
    ${ar(p, 'clay', 'M561,94 L561,279 L506,279')}${t(576, 172, 'made from water', 'sm fc05-clay', 'start')}
    <rect class="node node-rub" x="300" y="252" width="200" height="54" rx="14"/>${t(400, 287, 'Rubisco', 'lab fc05-b')}

    ${row(370, 'CO₂', `${chain(410, 362, 3)}${chain(486, 362, 3, false, 8, 20, 0)}`, `${chain(150, 402, 5, false, 6, 15)}${chain(268, 402, 1, false, 6, 15, 0)}${t(448, 410, '2 × 3-PGA', 'sm fc05-b')}`, ['carbon fixed'], false)}
    ${row(490, 'O₂', `${chain(410, 482, 3)}${t(458, 490, '+', 'lab')}${chain(506, 482, 2, true)}`, `${chain(150, 522, 5, false, 6, 15)}${t(268, 532, 'no C', 'sm')}${t(410, 530, '3-PGA', 'sm fc05-b')}${t(506, 530, '2-PG', 'sm fc05-b fc05-clay')}`, ['no carbon fixed;', '2-PG to recycle'], true)}
    ${t(400, 584, 'Rubisco prefers CO₂; air holds far more O₂', 'sm fc05-grey')}`);
}

/* ---------- j · Three icons ---------- */

function iconsSvg(): string {
  const p = 'fc05j';
  const tile = (x: number, word: string, l1: string, l2: string, icon: string, cls = 'fc05-big'): string =>
    `<rect class="fc05-tile" x="${x}" y="70" width="240" height="460" rx="24"/>${icon}
     ${t(x + 120, 412, word, cls)}${t(x + 120, 454, l1, 'sm')}${t(x + 120, 482, l2, 'sm')}`;
  const fix = `${molecule(140, 132, 'OCO', 14)}${ar(p, 'ink', 'M140,154 L140,184')}${pent(140, 222, 30)}${ar(p, 'ink', 'M140,262 L140,290')}
    ${chain(100, 316, 3, false, 7, 17, 0)}${chain(180, 316, 3, false, 7, 17)}`;
  const oxy = `${molecule(410, 132, 'OO', 14)}${ar(p, 'clay', 'M410,154 L410,184')}${pent(410, 222, 30)}${ar(p, 'clay', 'M410,262 L410,290')}
    ${chain(370, 316, 3, false, 7, 17)}${chain(458, 316, 2, true, 7, 17)}`;
  const heat = `${thermo(752, 226, 0.9, 110)}
    <path class="fc05-beam" d="M612,262 L752,304"/><path class="fc05-fulcrum" d="M682,284 L664,330 L700,330 Z"/>
    ${molecule(618, 244, 'OCO', 11)}${molecule(744, 286, 'OO', 12)}${t(612, 306, 'CO₂', 'sm fc05-b')}${t(744, 340, 'O₂', 'sm fc05-b fc05-clay')}`;
  return svg(p, 'Three icons: CO₂ plus RuBP gives two 3-PGA, carbon fixed; O₂ plus RuBP gives 3-PGA and 2-PG, carbon to recycle; heat favours the O₂ reaction',
    tile(20, 'CO₂', 'two 3-PGA:', 'carbon fixed', fix) + tile(290, 'O₂', '3-PGA + 2-PG:', 'carbon to recycle', oxy) + tile(560, 'Heat', 'tips the balance', 'towards O₂', heat));
}
