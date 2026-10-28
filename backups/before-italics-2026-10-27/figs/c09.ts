// Slide C09 · C₄ photosynthesis concentrates CO₂ before Rubisco. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Reuses the C08 leaf-anatomy kit, so C₃, C₂ and C₄ are drawn on one anatomy. Vocabulary as in C08, plus:
// C₄-acid route = teal (solid inwards, dashed for the C₃ acid returning), white bead = carbon that entered as HCO₃⁻/CO₂,
// red ring = ¹⁴C label.
import type { PlateText, Variant } from '../types';
import { molecule, tag } from '../illus';
import { text } from '../mechanisms';
import {
  chain, chloro, co2s, cross, enz, figure, lines, mito, n1, pairLabel, polar, rg, ring, route, rub, veinStrip,
  badge, type Route,
} from './c08';
import './c09.css';

export const PLATE: PlateText = {
  n: 'C10',
  title: 'C₄ photosynthesis concentrates CO₂ for Rubisco',
  status: 'draft',
  lead: 'In C₄ leaves, PEP carboxylase (PEPC) fixes HCO₃⁻, and never O₂, into C₄ acids; these release CO₂ around Rubisco in a wreath of bundle-sheath cells (Kranz anatomy).',
  points: [
    { claim: 'The first product is a C₄ acid.', text: 'In sugarcane, > 93 % of the ¹⁴C was in C₄ acids after about 1 s (Hatch & Slack 1966).' },
    { claim: 'Less oxygenation, at an ATP cost.', text: 'Regenerating phosphoenolpyruvate costs 2 ATP per CO₂; with some CO₂ leaking back, ≈ 5–6 ATP + 2 NADPH per CO₂ fixed.' },
    { claim: 'A trade-off that pays in heat and low CO₂.', text: 'About 8,100 species (maize, sugarcane) do one-fifth of land photosynthesis; the first grass C₄ arose as CO₂ fell, 32–25 million years ago.' },
  ],
  refs: [
    { label: 'Hatch & Slack 1966', url: 'https://doi.org/10.1042/bj1010103' },
    { label: 'von Caemmerer 2021', url: 'https://doi.org/10.1093/jxb/erab266' },
    { label: 'Luo et al. 2024', url: 'https://doi.org/10.1038/s41467-024-45606-3' },
    { label: 'Wang et al. 2022', url: 'https://doi.org/10.1111/nph.18485' },
    { label: 'Christin et al. 2008', url: 'https://doi.org/10.1016/j.cub.2007.11.058' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Kranz pump' },
  { id: 'b', name: 'Leaf to wreath' },
  { id: 'c', name: 'Shuttle bus' },
  { id: 'd', name: 'Labelled carbon', anim: true },
  { id: 'e', name: 'Cost crossover' },
  { id: 'f', name: "Rubisco's air" },
  { id: 'g', name: 'Four steps', anim: true },
  { id: 'h', name: 'C₃ → C₂ → C₄', anim: true },
  { id: 'i', name: 'Carbon loop' },
  { id: 'j', name: 'C₄ rice parts' },
];

export function draw(id: string): string {
  const f: Record<string, () => string> = {
    a: pumpSvg, b: zoomSvg, c: busSvg, d: labelSvg, e: costSvg,
    f: airSvg, g: stepsSvg, h: threeSvg, i: loopSvg, j: riceSvg,
  };
  return (f[id] ?? pumpSvg)();
}

const fig = (p: string, label: string, body: string): string => figure(p, label, body, 'fc08 fc09');

/** Arrows across a Kranz ring: inwards from the mesophyll to the bundle-sheath edge, or back out. */
function radial(p: string, cx: number, cy: number, R: number, kind: Route, angles: number[], out = false, extra = ''): string {
  const { rb1 } = rg(R);
  return angles.map(a => {
    const [xa, ya] = polar(cx, cy, R * (out ? 0.9 : 0.98), a), [xb, yb] = polar(cx, cy, rb1 + 3, a);
    const d = out ? `M${n1(xb)},${n1(yb)} L${n1(xa)},${n1(ya)}` : `M${n1(xa)},${n1(ya)} L${n1(xb)},${n1(yb)}`;
    return route(p, kind, d, extra);
  }).join('');
}

/** Small CO₂ marks inside the bundle-sheath wreath. */
function bsCO2(cx: number, cy: number, R: number, angles: number[], r = 4.5): string {
  const { rb0, rb1 } = rg(R);
  return angles.map(a => { const [x, y] = polar(cx, cy, rb0 + (rb1 - rb0) * 0.4, a); return co2s(x, y, r); }).join('');
}

/** A bead carrying the ¹⁴C label: white bead, red ring. */
const labelled = (x: number, y: number, r = 8): string =>
  `<circle class="bead bead-co2" cx="${n1(x)}" cy="${n1(y)}" r="${r}"/><circle class="fc09-l14" cx="${n1(x)}" cy="${n1(y)}" r="${r + 5}"/>`;

/* ---------- a · the C₄ pump in two cells ---------- */

function pumpSvg(): string {
  const p = 'fc09a';
  const minis = [[448, 300], [452, 366], [664, 364], [520, 280], [604, 396]].map(([x, y]) => co2s(x, y, 4.5)).join('');
  return fig(p, 'C₄ cycle in two cells: in the mesophyll, carbonic anhydrase makes HCO₃⁻ and PEPC fixes it onto PEP; the C₄ acid moves into the bundle sheath, where a decarboxylase releases CO₂ around Rubisco; pyruvate returns and PPDK regenerates PEP for 2 ATP', `<g transform="translate(0 18)">
    ${text(205, 32, 'mesophyll cell', 'sm fc08-b')}${text(541, 32, 'bundle-sheath cell', 'sm fc08-b')}${text(752, 32, 'vein', 'sm fc08-b')}
    <rect class="fc08-m" x="40" y="50" width="330" height="426" rx="46"/>
    <rect class="fc08-bs" x="382" y="48" width="318" height="430" rx="30"/>
    ${veinStrip(712, 52, 80, 422)}

    ${molecule(98, 84, 'OCO', 10)}${route(p, 'k', 'M126,84 L160,84')}${enz(200, 84, 72, 'CA')}
    ${route(p, 'k', 'M200,103 L200,118')}${text(200, 144, 'HCO₃⁻', 'sm fc08-b')}${route(p, 'k', 'M200,152 L200,176')}
    ${enz(200, 200, 100, 'PEPC', 'fc08-enz-m')}
    ${route(p, 'm', 'M252,200 L446,200')}
    ${chain(318, 200, 4, { white: [3], r: 7.5, gap: 17 })}${text(318, 176, 'C₄ acid', 'sm fc08-b fc08-c4')}
    ${enz(540, 200, 172, 'decarboxylase', 'fc08-enz-m')}

    <ellipse class="fc08-halo" cx="556" cy="332" rx="134" ry="72"/>
    ${chloro(556, 332, 112, 44)}${rub(556, 328)}${minis}
    ${route(p, 'k', 'M628,206 C664,214 666,262 656,302')}${molecule(624, 266, 'OCO', 8)}
    ${text(556, 430, 'Calvin–Benson cycle', 'sm')}

    ${route(p, 'm', 'M470,219 C424,240 410,282 410,330 L410,428 C410,446 400,452 384,452 L254,452', 'fc08-ret')}
    ${chain(318, 452, 3, { r: 7.5, gap: 17 })}${text(318, 428, 'pyruvate', 'sm fc08-b fc08-c4')}
    ${enz(200, 452, 92, 'PPDK', 'fc08-enz-m')}
    ${tag(200, 398, 'ATP', 'atp')}${route(p, 'a', 'M200,416 L200,430')}
    ${route(p, 'm', 'M152,452 C92,452 84,430 84,390 L84,250 C84,214 104,200 146,200', 'fc08-ret')}
    ${chain(124, 330, 3, { r: 7.5, gap: 17 })}${text(124, 306, 'PEP', 'sm fc08-b fc08-c4')}

    <path class="fc08-rule" d="M40,498 H790"/>
    ${text(40, 540, 'CA carbonic anhydrase · PEP phosphoenolpyruvate · PPDK pyruvate phosphate dikinase', 'fc08-tiny', 'start')}</g>`);
}

/* ---------- b · zoom: leaf → Kranz wreath ---------- */

function zoomSvg(): string {
  const p = 'fc09b';
  const ep = (y: number, gapX = -1): string => Array.from({ length: 19 }, (_, i) => {
    const x = 30 + i * 39;
    return gapX >= 0 && x > gapX - 30 && x < gapX + 10 ? '' : `<rect class="fc09-ep" x="${x}" y="${y}" width="37" height="20" rx="6"/>`;
  }).join('');
  const stoma = `<ellipse class="fc08-cp" cx="200" cy="176" rx="12" ry="9"/><ellipse class="fc08-cp" cx="228" cy="176" rx="12" ry="9"/>`;
  const veins = [110, 250, 390, 530, 670].map(x => ring(x, 108, 48, { nb: 6, nm: 10, bsCp: 2 })).join('');
  const filler = [40, 180, 320, 460, 600, 740].map(x => [80, 136].map(y =>
    `<ellipse class="fc08-m" cx="${x}" cy="${y}" rx="17" ry="25"/>${chloro(x, y - 10, 10, 4, 90, false)}${chloro(x, y + 10, 10, 4, 90, false)}`).join('')).join('');
  const C = { x: 250, y: 404 }, R = 166;
  const { rb0, rb1 } = rg(R);
  const lead = (x0: number, y0: number, x1: number, y1: number): string =>
    `<path class="fc09-leader" d="M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}"/><circle class="fc09-lead-dot" cx="${n1(x1)}" cy="${n1(y1)}" r="3.5"/>`;
  const [mx, my] = polar(C.x, C.y, R * 0.79, -18), [bx, by] = polar(C.x, C.y, (rb0 + rb1) / 2, 14);
  return fig(p, 'Zoom from a C₄ leaf cross-section, with veins close together, to one Kranz unit: a vein, a wreath of bundle-sheath cells holding Rubisco, and a ring of mesophyll cells where PEPC makes C₄ acids', `
    ${text(30, 24, 'leaf cross-section: veins lie close together', 'fc08-tiny', 'start')}
    ${ep(36)}${ep(160, 214)}${stoma}${filler}${veins}
    <rect class="fc09-zoom" x="336" y="54" width="108" height="108" rx="8"/>
    <path class="fc09-zoom" d="M336,162 L${C.x - R},${C.y - R + 20} M444,162 L${C.x + R},${C.y - R + 20}"/>
    ${ring(C.x, C.y, R, { bsCp: 3, nm: 13 })}
    ${radial(p, C.x, C.y, R, 'm', [-150, -60, 30, 120])}${radial(p, C.x, C.y, R, 'm', [-105, 165], true, 'fc08-ret')}
    ${bsCO2(C.x, C.y, R, [-128, -38, 52, 142])}
    ${text(468, 256, 'Kranz anatomy', 'lab fc08-b', 'start')}${text(468, 284, 'Kranz = wreath', 'sm fc08-grey', 'start')}
    ${pairLabel(468, 336, 'mesophyll ring', 'PEPC makes C₄ acids', 'start')}${lead(462, 330, mx, my)}
    ${pairLabel(468, 410, 'bundle-sheath wreath', 'CO₂ released at Rubisco', 'start')}${lead(462, 404, bx, by)}
    ${text(468, 484, 'vein', 'sm fc08-b', 'start')}${lead(462, 478, C.x + 24, C.y + 18)}
    ${route(p, 'm', 'M468,524 L510,524', 'fc08-thin')}${text(520, 531, 'C₄ acid in', 'sm', 'start')}
    ${route(p, 'm', 'M468,558 L510,558', 'fc08-ret')}${text(520, 565, 'C₃ acid back', 'sm', 'start')}`);
}

/* ---------- c · analogy: a shuttle bus for CO₂ ---------- */

function busSvg(): string {
  const p = 'fc09c';
  const bus = (x: number, y: number, full: boolean): string => {
    const win = [0, 1, 2, 3].map(i => `<rect class="fc09-win" x="${x - 54 + i * 27}" y="${y - 17}" width="22" height="20" rx="4"/>`).join('');
    const seats = [0, 1, 2].map(i => `<circle class="bead" cx="${x - 43 + i * 27}" cy="${y - 7}" r="6.5"/>`).join('') +
      (full ? `<circle class="bead bead-co2" cx="${x - 43 + 81}" cy="${y - 7}" r="6.5"/>` : '');
    return `<rect class="fc09-bus${full ? ' fc09-bus-full' : ''}" x="${x - 64}" y="${y - 26}" width="128" height="50" rx="13"/>${win}${seats}` +
      `<circle class="fc09-wheel" cx="${x - 36}" cy="${y + 25}" r="8"/><circle class="fc09-wheel" cx="${x + 36}" cy="${y + 25}" r="8"/>`;
  };
  const road = 'M290,170 H510 A100,100 0 0 1 610,270 V310 A100,100 0 0 1 510,410 H290 A100,100 0 0 1 190,310 V270 A100,100 0 0 1 290,170 Z';
  const crowd = [[466, 246], [588, 248], [470, 334], [584, 332], [526, 226], [528, 352]].map(([x, y]) => co2s(x, y, 5)).join('');
  return fig(p, 'Analogy mapped to C₄: a bus (the C₃ carrier) picks up a CO₂ passenger at stop 1 (PEPC in the mesophyll), drives full (C₄ acid) to stop 2 (decarboxylase in the bundle sheath), drops it into a crowd around Rubisco, returns empty (pyruvate) and refuels for 2 ATP per trip (PPDK); a few passengers slip away (leakiness)', `
    <g transform="translate(0 12)"><path class="fc09-road" d="${road}"/><path class="fc09-roadc" d="${road}"/>
    ${route(p, 'k', 'M250,170 L300,170', 'fc08-thin')}${route(p, 'k', 'M560,410 L510,410', 'fc08-thin')}
    ${route(p, 'k', 'M610,236 L610,262', 'fc08-thin')}${route(p, 'k', 'M190,344 L190,318', 'fc08-thin')}
    <circle class="fc09-stop" cx="172" cy="290" r="9"/><circle class="fc09-stop" cx="628" cy="290" r="9"/>
    ${pairLabel(92, 282, 'stop 1', 'mesophyll')}${pairLabel(718, 282, 'stop 2', 'bundle sheath')}
    ${bus(400, 170, true)}${pairLabel(400, 104, 'full bus', 'C₄ acid (malate)')}
    ${bus(440, 410, false)}${pairLabel(440, 470, 'empty bus', 'pyruvate (3 C)')}
    <circle class="bead bead-co2" cx="232" cy="122" r="7"/>${route(p, 'k', 'M240,132 L262,154', 'fc08-thin')}
    ${pairLabel(196, 86, 'boarding', 'PEPC adds HCO₃⁻', 'end')}
    ${pairLabel(616, 104, 'drop-off', 'decarboxylase', 'start')}
    ${rub(527, 290, 100, 34)}${crowd}
    ${pairLabel(330, 282, 'crowd', 'high CO₂ at Rubisco')}
    ${route(p, 'x', 'M600,352 L668,392')}${pairLabel(714, 420, 'leak', 'CO₂ escapes')}
    <rect class="fc09-pump" x="226" y="452" width="30" height="40" rx="5"/><path class="fc08-rule" d="M256,462 C276,462 276,440 266,432"/>
    ${pairLabel(241, 512, 'fuel: ATP', 'PPDK remakes PEP')}
    ${text(400, 572, 'PEP phosphoenolpyruvate · PPDK pyruvate phosphate dikinase', 'fc08-tiny')}</g>`);
}

/* ---------- d · evidence: Hatch & Slack 1966, labelled carbon ---------- */

function labelSvg(): string {
  const p = 'fc09d';
  const x0 = 60, W = 680, w1 = W * 0.93;
  const ticks = [110, 300, 500, 690];
  return fig(p, 'Hatch and Slack 1966: after a short ¹⁴CO₂ pulse to sugarcane leaves, more than 93 % of the fixed label is in C₄ acids after about 1 s, first on carbon 4; later the label moves to 3-PGA and then to sugars', `
    ${text(400, 38, 'Sugarcane leaf, short ¹⁴CO₂ pulse', 'lab fc08-b')}
    ${text(400, 68, 'where the fixed ¹⁴C sits after about 1 s', 'sm fc08-grey')}
    <rect class="fc09-seg" x="${x0}" y="88" width="${n1(w1)}" height="58" rx="8"/>
    <rect class="fc09-seg-rest" x="${n1(x0 + w1 + 3)}" y="88" width="${n1(W - w1 - 3)}" height="58" rx="8"/>
    ${text(x0 + 20, 126, '> 93 %', 'lab fc08-b', 'start')}${text(x0 + 130, 125, 'C₄ acids: malate, aspartate, oxaloacetate', 'sm', 'start')}
    ${text(x0 + W - 6, 176, 'the rest', 'sm fc08-grey', 'end')}
    <path class="fc08-rule" d="M30,206 H770"/>
    ${text(770, 246, 'schematic', 'fc08-tiny', 'end')}
    ${labelled(110, 296)}
    ${route(p, 'k', 'M140,296 L232,296')}
    ${chain(300, 296, 4, { white: [3], gap: 20 })}<circle class="fc09-l14" cx="330" cy="296" r="13"/>
    ${route(p, 'k', 'M362,296 L448,296')}${text(405, 276, 'C-4 → CO₂', 'fc08-tiny')}
    ${chain(500, 296, 3, { white: [0], gap: 20 })}<circle class="fc09-l14" cx="480" cy="296" r="13"/>
    ${route(p, 'k', 'M546,296 L620,296')}
    ${chain(690, 296, 6, { white: [0], gap: 17, r: 7 })}<circle class="fc09-l14" cx="647.5" cy="296" r="12"/>
    ${lines(110, 346, ['¹⁴CO₂', 'taken up'])}
    ${lines(300, 346, ['C₄ acid,', 'label on C-4'])}
    ${lines(500, 346, ['3-phosphoglycerate', 'via Rubisco'])}
    ${lines(690, 346, ['sugars'])}
    ${route(p, 'k', 'M70,434 L770,434', 'fc08-thin')}
    ${ticks.map(x => `<path class="fc09-time" d="M${x},426 V442"/>`).join('')}
    ${text(110, 472, 'pulse', 'sm')}${text(300, 472, '≈ 1 s', 'sm fc08-b')}${text(500, 472, 'later', 'sm')}${text(690, 472, 'later still', 'sm')}
    ${text(770, 418, 'time', 'fc08-tiny', 'end')}
    ${labelled(44, 526, 7)}${text(66, 533, '¹⁴C label', 'sm', 'start')}
    ${text(30, 570, 'Hatch & Slack 1966; built on earlier sugarcane work (Kortschak et al. 1965)', 'fc08-tiny', 'start')}`);
}

/* ---------- e · data: the ATP trade-off (illustrative stoichiometry) ---------- */

function costSvg(): string {
  const p = 'fc09e';
  const x0 = 130, x1 = 740, y0 = 446, y1 = 64, rmax = 0.6, amin = 2.5, amax = 7.5;
  const X = (r: number): number => x0 + (r / rmax) * (x1 - x0);
  const Y = (a: number): number => y0 - ((a - amin) / (amax - amin)) * (y0 - y1);
  const c3 = (r: number): number => (3 + 3.5 * r) / (1 - 0.5 * r);
  const rc = 1 / 3, steps = 60;
  const pts = (a: number, b: number): string[] => Array.from({ length: steps + 1 }, (_, i) => a + ((b - a) * i) / steps).map(r => `${n1(X(r))},${n1(Y(c3(r)))}`);
  const curve = `M${pts(0, rmax).join(' L')}`;
  const bandL = `M${pts(0, rc).join(' L')} L${n1(X(0))},${n1(Y(5))} Z`;
  const bandR = `M${pts(rc, rmax).join(' L')} L${n1(X(rmax))},${n1(Y(5))} Z`;
  const tx = [0, 0.2, 0.4, 0.6].map(r => `<path class="axis" d="M${n1(X(r))},${y0} V${y0 + 8}"/>${text(X(r), y0 + 34, r === 0 ? '0' : r.toFixed(1), 'tl')}`).join('');
  const ty = [3, 4, 5, 6, 7].map(a => `<path class="axis" d="M${x0 - 8},${n1(Y(a))} H${x0}"/>${text(x0 - 14, Y(a) + 8, `${a}`, 'tl', 'end')}`).join('');
  return fig(p, 'Illustrative ATP cost per CO₂ fixed: a C₃ leaf costs 3 ATP without photorespiration and more as oxygenation rises; a C₄ leaf costs 5 ATP without leakage. The lines cross near 0.33 oxygenations per carboxylation: below it C₃ is cheaper, above it C₄', `
    <path class="fc09-band-c3" d="${bandL}"/><path class="fc09-band-c4" d="${bandR}"/>
    <path class="axis" d="M${x0},${y1 - 10} V${y0} H${x1}"/>${tx}${ty}
    <path class="fc09-c4" d="M${X(0)},${n1(Y(5))} H${X(rmax)}"/>
    <path class="fc09-c3" d="${curve}"/>
    <path class="fc09-guide" d="M${n1(X(rc))},${n1(Y(5))} V${y0}"/><circle class="fc09-pt" cx="${n1(X(rc))}" cy="${n1(Y(5))}" r="6"/>
    ${text(X(rc) + 10, y0 - 66, 'measured: C₃ and C₄ quantum', 'sm fc08-grey', 'start')}${text(X(rc) + 10, y0 - 40, 'yields equal near 30 °C', 'sm fc08-grey', 'start')}${text(X(rc) + 10, y0 - 14, 'break-even ≈ 0.33', 'sm fc08-grey', 'start')}
    ${text(X(0.13), (Y(c3(0.13)) + Y(5)) / 2 + 8, 'C₃ cheaper', 'sm fc08-b fc08-gly')}
    ${text(X(0.5), (Y(c3(0.5)) + Y(5)) / 2 + 8, 'C₄ cheaper', 'sm fc08-b fc08-c4')}
    ${text(X(0.56) - 8, Y(c3(0.56)) - 4, 'C₃', 'lab fc08-b fc08-gly', 'end')}
    ${text(x1, Y(5) + 32, 'C₄, no leakage', 'sm fc08-b fc08-c4', 'end')}
    ${route(p, 'm', `M${n1(X(0.06))},${n1(Y(5) - 6)} L${n1(X(0.06))},${n1(Y(5) - 52)}`, 'fc08-thin')}${text(X(0.06) + 14, Y(5) - 30, 'leakage raises it', 'sm fc08-c4', 'start')}
    ${text((x0 + x1) / 2, y0 + 70, 'oxygenations per carboxylation in a C₃ leaf', 'tl')}
    ${text((x0 + x1) / 2, y0 + 100, 'rises with warming and with less CO₂ at Rubisco →', 'sm fc08-grey')}
    <text class="tl" transform="translate(52 ${(y0 + y1) / 2}) rotate(-90)" text-anchor="middle">ATP per CO₂ fixed</text>
    ${text(790, 584, 'ATP only; illustrative stoichiometry', 'fc08-tiny', 'end')}`);
}

/* ---------- f · with and without: Rubisco's surroundings ---------- */

function airSvg(): string {
  const p = 'fc09f';
  const close = (cx: number, cy: number, nC: number, nO: number): string => {
    // Two rings of molecules around the enzyme; CO₂ spread evenly through the sequence.
    const N = nC + nO, nIn = N > 12 ? 6 : 4, out: string[] = [];
    for (let i = 0; i < N; i++) {
      const isC = Math.floor(((i + 1) * nC) / N) > Math.floor((i * nC) / N);
      const inner = i < nIn, k = inner ? i : i - nIn, n = inner ? nIn : N - nIn;
      const a = (k * 360) / n + (inner ? 180 / n : 8), r = inner ? 80 : 122;
      const [x, y] = polar(cx, cy, r, a);
      out.push(molecule(x, y, isC ? 'OCO' : 'OO', 8));
    }
    return `<circle class="fc09-close" cx="${cx}" cy="${cy}" r="152"/>${rub(cx, cy, 110, 36)}${out.join('')}`;
  };
  return fig(p, 'Close-ups of Rubisco: in a C₃ mesophyll chloroplast it meets air-level CO₂ among many O₂ molecules; in a C₄ bundle-sheath chloroplast the same O₂ is joined by much more CO₂, so oxygenation is suppressed', `
    <g transform="translate(0 14)">${text(205, 46, 'C₃: mesophyll chloroplast', 'sm fc08-b')}${text(595, 46, 'C₄: bundle-sheath chloroplast', 'sm fc08-b')}
    ${close(205, 236, 3, 6)}${close(595, 236, 10, 6)}
    ${lines(205, 424, ['air-level CO₂:', 'O₂ competes'])}
    ${lines(595, 424, ['CO₂ concentrated:', 'less oxygenation'])}
    <path class="fc08-rule" d="M40,484 H760"/>
    ${text(400, 522, 'C₄ suppresses oxygenation; it does not abolish it', 'sm fc08-b')}
    ${text(790, 562, 'molecule counts schematic', 'fc08-tiny', 'end')}</g>`);
}

/* ---------- g · four steps (animation storyboard) ---------- */

function stepsSvg(): string {
  const p = 'fc09g';
  const panel = (px: number, py: number, n: number, cap: string): string => {
    const gh = (k: number): string => (k < n ? ' class="fc08-ghost"' : '');
    const P = (x: number, y: number): string => `${px + x},${py + y}`;
    const s1 = `<g${gh(1)}><circle class="bead bead-co2" cx="${px + 34}" cy="${py + 106}" r="7"/>${route(p, 'k', `M${P(44, 106)} L${P(58, 106)}`)}${route(p, 'k', `M${P(110, 125)} L${P(110, 142)}`)}</g>`;
    const acidM = n === 1 ? chain(px + 110, py + 160, 4, { white: [3], r: 6, gap: 14 }) : '';
    const s2 = n >= 2 ? `<g${gh(2)}>${route(p, 'm', `M${P(140, 160)} C${P(172, 160)} ${P(190, 116)} ${P(212, 112)}`)}</g>` : '';
    const acidB = n === 2 ? chain(px + 246, py + 108, 4, { white: [3], r: 6, gap: 14 }) : '';
    const s3 = n >= 3 ? `<g${gh(3)}>${route(p, 'k', `M${P(296, 120)} L${P(286, 192)}`)}</g>${molecule(px + 300, py + 106, 'OCO', 7)}${chain(px + 236, py + 108, 3, { r: 6, gap: 14 })}` : '';
    const s4 = n >= 4 ? `${route(p, 'm', `M${P(214, 120)} C${P(180, 150)} ${P(176, 226)} ${P(154, 228)}`, 'fc08-ret')}${route(p, 'm', `M${P(72, 228)} C${P(30, 228)} ${P(28, 150)} ${P(64, 118)}`, 'fc08-ret')}${tag(px + 118, py + 182, 'ATP', 'atp')}${route(p, 'a', `M${P(118, 199)} L${P(118, 208)}`)}` : '';
    return `<rect class="fc08-panel" x="${px}" y="${py}" width="380" height="284" rx="18"/>
      ${badge(px + 28, py + 32, n)}${text(px + 54, py + 40, cap, 'sm fc08-b', 'start')}
      <rect class="fc08-m" x="${px + 12}" y="${py + 62}" width="168" height="208" rx="28"/>
      <rect class="fc08-bs" x="${px + 188}" y="${py + 58}" width="160" height="216" rx="18"/>
      ${veinStrip(px + 354, py + 62, 18, 208)}
      ${enz(px + 110, py + 106, 84, 'PEPC', 'fc08-enz-m')}${enz(px + 112, py + 228, 80, 'PPDK', 'fc08-enz-m')}
      ${chloro(px + 268, py + 226, 70, 30)}${rub(px + 268, py + 226, 92, 28)}
      ${s1}${acidM}${s2}${acidB}${s3}${s4}
      ${n === 1 ? text(px + 96, py + 198, 'mesophyll', 'fc08-tiny') + text(px + 268, py + 96, 'bundle sheath', 'fc08-tiny') : ''}`;
  };
  return fig(p, 'Four steps of the C₄ cycle: PEPC fixes HCO₃⁻ into a C₄ acid in the mesophyll; the C₄ acid moves into the bundle sheath; it releases CO₂ at Rubisco; pyruvate returns and PPDK remakes PEP for 2 ATP', `
    <g class="fc09-g97" transform="translate(12 0) scale(0.97)">${panel(10, 8, 1, 'PEPC fixes HCO₃⁻')}${panel(410, 8, 2, 'The C₄ acid moves in')}
    ${panel(10, 306, 3, 'CO₂ released at Rubisco')}${panel(410, 306, 4, 'PEP remade')}</g>
    ${text(400, 594, 'PEP phosphoenolpyruvate · PPDK pyruvate phosphate dikinase', 'fc08-tiny')}`);
}

/* ---------- h · C₃ → C₂ → C₄ on one anatomy (animation storyboard) ---------- */

function threeSvg(): string {
  const p = 'fc09h';
  const xs = [135, 400, 665], cy = 232, R = 116;
  const esc = [-145, -35, 35, 145].map(a => {
    const [x0, y0] = polar(xs[0], cy, R * 0.79, a), [x1, y1] = polar(xs[0], cy, R + 18, a), [x2, y2] = polar(xs[0], cy, R + 32, a);
    return route(p, 'x', `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`) + co2s(x2, y2, 4.5);
  }).join('');
  return fig(p, 'Three leaves on one anatomy. C₃: photorespired CO₂ is released in the mesophyll and much escapes. C₂: glycine carries photorespired carbon into the bundle sheath. C₄: C₄ acids pump CO₂ into the bundle sheath, at 2 ATP per CO₂. CO₂ around bundle-sheath Rubisco rises from C₃ to C₂ to C₄, and the measured CO₂ compensation point falls: 40 µl per litre or more in C₃, 12 to 26 in C₂, 10 or less in C₄ (Krenzer et al. 1975)', `
    ${text(xs[0], 66, 'C₃', 'lab fc08-b')}${text(xs[1], 66, 'C₂', 'lab fc08-b')}${text(xs[2], 66, 'C₄', 'lab fc08-b')}
    ${ring(xs[0], cy, R, { gdc: 'both', mMt: true, bsMt: 'outer', bsCp: 1 })}${esc}
    ${ring(xs[1], cy, R, { gdc: 'bs', mMt: true, bsMt: 'inner', bsCp: 3 })}${radial(p, xs[1], cy, R, 'g', [-135, -45, 45, 135])}${bsCO2(xs[1], cy, R, [-112, -22, 68, 158])}
    ${ring(xs[2], cy, R, { bsCp: 3 })}${radial(p, xs[2], cy, R, 'm', [-150, -30, 90])}${radial(p, xs[2], cy, R, 'm', [-90, 30, 150], true, 'fc08-ret')}
    ${bsCO2(xs[2], cy, R, [-120, -60, 0, 60, 120, 180])}
    ${lines(xs[0], 396, ['CO₂ released', 'in every cell'])}
    ${lines(xs[1], 396, ['glycine carries', 'carbon inwards'])}
    ${lines(xs[2], 396, ['C₄ acids carry', 'CO₂ inwards'])}
    <path class="fc08-rule" d="M30,456 H770"/>
    ${text(30, 488, 'CO₂ compensation point Γ, µl l⁻¹ · lower: less CO₂ lost', 'sm fc08-grey', 'start')}${text(770, 488, 'Krenzer et al. 1975', 'fc08-tiny', 'end')}
    ${['≥ 40', '12–26', '≤ 10'].map((v, i) => text(xs[i], 526, v, 'lab fc08-b')).join('')}
    ${route(p, 'g', 'M30,564 L68,564', 'fc08-thin')}${text(76, 571, 'glycine', 'sm', 'start')}
    ${route(p, 'm', 'M186,564 L224,564', 'fc08-thin')}${text(232, 571, 'C₄ acid', 'sm', 'start')}
    ${route(p, 'm', 'M350,564 L388,564', 'fc08-ret')}${text(396, 571, 'C₃ acid back', 'sm', 'start')}
    ${route(p, 'x', 'M570,564 L608,564')}${text(616, 571, 'CO₂ escaping', 'sm', 'start')}`);
}

/* ---------- i · equation-anchored: the carbon loop and its net equation ---------- */

function loopSvg(): string {
  const p = 'fc09i';
  const cx = 400, cy = 222, ax = 250, ay = 118;
  const pt = (t: number): string => { const a = (t * Math.PI) / 180; return `${n1(cx + ax * Math.cos(a))},${n1(cy + ay * Math.sin(a))}`; };
  const arc = (t0: number, t1: number, kind: Route, extra = ''): string =>
    `<path class="fc08-r fc08-r-${kind}${extra ? ` ${extra}` : ''}" d="M${pt(t0)} A${ax},${ay} 0 0 1 ${pt(t1)}" marker-end="url(#${p}-${kind})"/>`;
  return fig(p, 'The C₄ cycle as carbon arithmetic: PEP (3 C) plus HCO₃⁻ (1 C) gives a C₄ acid (4 C) in the mesophyll; in the bundle sheath it splits into pyruvate (3 C) and CO₂ for Rubisco; pyruvate returns and PPDK remakes PEP for 2 ATP. Net: CO₂ in the mesophyll plus 2 ATP gives CO₂ in the bundle sheath', `
    <g transform="translate(0 22)"><rect class="fc09-zone-m" x="30" y="34" width="356" height="364" rx="28"/>
    <rect class="fc09-zone-b" x="414" y="34" width="356" height="364" rx="28"/>
    ${text(120, 70, 'mesophyll', 'sm fc08-b')}${text(672, 70, 'bundle sheath', 'sm fc08-b')}
    ${arc(198, 254, 'm')}${arc(286, 342, 'm')}${arc(18, 74, 'm', 'fc08-ret')}${arc(106, 162, 'm', 'fc08-ret')}
    ${chain(400, 106, 4, { white: [3] })}<rect class="fc08-panel" x="320" y="54" width="160" height="32" rx="16"/>${text(400, 77, 'C₄ acid · 4 C', 'sm fc08-b fc08-c4')}
    ${chain(150, 226, 3)}${text(116, 233, 'PEP', 'sm fc08-b', 'end')}
    <circle class="bead bead-co2" cx="92" cy="152" r="8"/>${text(92, 128, 'HCO₃⁻', 'sm fc08-b')}${route(p, 'k', 'M100,162 L134,208', 'fc08-thin')}
    ${text(236, 210, 'PEPC', 'sm fc08-b fc08-c4')}
    ${chain(630, 226, 3)}${text(660, 233, 'pyruvate', 'sm fc08-b', 'start')}
    ${route(p, 'k', 'M628,196 L596,214', 'fc08-thin')}${molecule(564, 226, 'OCO', 10)}
    ${route(p, 'k', 'M538,226 L526,226', 'fc08-thin')}${rub(474, 226, 92, 32)}
    ${chain(400, 340, 3)}<rect class="fc08-panel" x="318" y="356" width="164" height="32" rx="16"/>${text(400, 379, 'pyruvate · 3 C', 'sm fc08-b fc08-c4')}
    ${enz(214, 312, 84, 'PPDK', 'fc08-enz-m')}${tag(98, 346, 'ATP', 'atp')}${route(p, 'a', 'M136,340 L168,326', 'fc08-thin')}
    ${text(400, 446, 'Net: CO₂ (mesophyll) + 2 ATP → CO₂ (bundle sheath)', 'lab fc08-b')}
    ${text(400, 484, 'The pump fixes no net carbon; Rubisco does', 'sm')}
    ${text(400, 540, 'PEP phosphoenolpyruvate · PPDK pyruvate phosphate dikinase', 'fc08-tiny')}</g>`);
}

/* ---------- j · C₄ rice: parts, not a system ---------- */

function riceSvg(): string {
  const p = 'fc09j';
  const R = 100, A = { x: 200, y: 178 }, B = { x: 600, y: 178 };
  const broken = [-140, -40, 90].map(a => {
    const [x0, y0] = polar(B.x, B.y, R * 0.98, a), [x1, y1] = polar(B.x, B.y, R * 0.76, a), [xc, yc] = polar(B.x, B.y, R * 0.66, a);
    return route(p, 'm', `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`, 'fc08-thin') + cross(xc, yc, 7);
  }).join('');
  const row = (y: number, ok: boolean, s: string): string =>
    `<circle class="${ok ? 'fc09-okc' : 'fc09-noc'}" cx="52" cy="${y - 7}" r="13"/>` +
    (ok ? `<path class="fc09-ok" d="M45,${y - 7} L50,${y - 1} L60,${y - 13}"/>` : cross(52, y - 7, 6)) +
    text(76, y, s, 'sm', 'start');
  return fig(p, 'Maize runs a complete C₄ cycle, which evolved more than 60 times; rice given maize C₄ parts has some of them (PEPC, more bundle-sheath organelles, a C₄-like vein pattern) but no working cycle: little C₄-acid flux reaches the Calvin–Benson cycle', `
    ${text(A.x, 46, 'Maize (C₄)', 'lab fc08-b')}${text(B.x, 46, 'Rice with C₄ parts', 'lab fc08-b')}
    ${ring(A.x, A.y, R, { bsCp: 3 })}${radial(p, A.x, A.y, R, 'm', [-140, -40, 90], false, 'fc08-thin')}${radial(p, A.x, A.y, R, 'm', [-90, 40, 140], true, 'fc08-ret')}
    ${bsCO2(A.x, A.y, R, [-115, -10, 65, 170])}
    ${ring(B.x, B.y, R, { bsCp: 2, bsMt: 'outer', mMt: true })}${broken}
    ${text(A.x, 316, 'complete C₄ cycle', 'sm fc08-b')}
    ${text(B.x, 316, 'parts, not a system', 'sm fc08-b')}
    <path class="fc08-rule" d="M30,348 H770"/>
    ${text(40, 384, 'Engineered into rice by October 2026:', 'sm fc08-grey', 'start')}
    ${row(422, true, 'Maize PEPC, at < 2.1 % of its in vitro activity')}
    ${row(458, true, 'Five maize enzymes: PEPC flux ×10, ≈ 2 % of maize')}
    ${row(494, true, 'More sheath organelles; C₄-like vein pattern')}
    ${row(530, false, 'Little C₄-acid flux into the Calvin–Benson cycle')}
    ${text(40, 572, 'Om et al. 2026; Ermakova et al. 2021; Lin et al. 2020; Wang et al. 2017; Dong et al. 2023', 'fc08-tiny', 'start')}`);
}
