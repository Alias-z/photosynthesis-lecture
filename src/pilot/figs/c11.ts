// Slide C11 · What a leaf's CO₂ exchange measures. Draft context, checked in
// research/review-2026-10-23-claude/E_C07-C12.md (C11 rows 1–9, Gaps 1, currency note on Ci) and
// REVIEW_SUMMARY.md (essential 6; Ca 425.6 ppm in 2025, NOAA). Facts used, and no others:
// a chamber estimates net uptake from the in–out CO₂ difference at known flow, with dilution corrections
// (von Caemmerer & Farquhar 1981; Busch et al. 2024); Ci is derived, not measured; A = gs(Ca − Ci);
// stomata trade CO₂ gain against water loss; A = Vc − 0.5 Vo − Rʟ, the 0.5 being one CO₂ per two oxygenations
// (Yin et al. 2021); Rʟ is non-photorespiratory CO₂ release in the light, its sources still debated;
// zero net exchange does not mean carboxylation has stopped; CO₂ goes Ca → Ci → Cc and Rubisco sees Cc.
// Every curve is schematic and says so; the only number is Ca.
import { bolt, illusHeads, molecule, water } from '../illus';
import { text as t } from '../mechanisms';
import type { PlateText, Variant } from '../types';
import './c11.css';

/** Subscripts for the page text: g<sub>s</sub>, C<sub>a</sub> … */
const s = (x: string): string => `<sub class="fc11-sub">${x}</sub>`;

export const PLATE: PlateText = {
  n: 'C11',
  title: `What a leaf's CO${s('2')} exchange measures`,
  status: 'draft',
  lead: `CO₂ diffuses in through the stomata, from outside air (C${s('a')}) to the leaf’s air spaces (C${s('i')}); water vapour leaves the same way.`,
  points: [
    { claim: 'Stomata gate CO₂ and cost water.', text: `Net uptake A = g${s('s')} (C${s('a')} − C${s('i')}): stomatal conductance times the CO₂ drop.` },
    { claim: 'A chamber sees only the net.', text: `A = V${s('c')} − 0.5 V${s('o')} − R${s('L')}: carboxylation minus CO₂ released by photorespiration and respiration.` },
    { claim: `Rubisco sees C${s('c')}, not C${s('i')}.`, text: `CO₂ must still cross the mesophyll, so chloroplast CO₂ (C${s('c')}) is below C${s('i')}.` },
  ],
  refs: [
    { label: 'von Caemmerer & Farquhar 1981', url: 'https://doi.org/10.1007/BF00384257' },
    { label: 'Yin et al. 2021', url: 'https://doi.org/10.1111/pce.14070' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Air to Rubisco', anim: true },
  { id: 'b', name: 'Leaf chamber' },
  { id: 'c', name: 'Net bookkeeping' },
  { id: 'd', name: 'Tanks and valves' },
  { id: 'e', name: 'Raw signal' },
  { id: 'f', name: 'Open vs shut', anim: true },
  { id: 'g', name: 'Zero is not zero' },
  { id: 'h', name: 'Measured to modelled' },
  { id: 'i', name: 'Three ideas' },
  { id: 'j', name: 'Supply meets demand', anim: true },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return chamberSvg();
    case 'c': return bookSvg();
    case 'd': return tanksSvg();
    case 'e': return signalSvg();
    case 'f': return openShutSvg();
    case 'g': return zeroSvg();
    case 'h': return ladderSvg();
    case 'i': return threeSvg();
    case 'j': return supplySvg();
    default: return pathSvg();
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'grey' | 'c' | 'water' | 'amber' | 'clay' | 'rl' | 'net';
const KS: K[] = ['ink', 'grey', 'c', 'water', 'amber', 'clay', 'rl', 'net'];
type Anchor = 'start' | 'middle' | 'end';
const f = (n: number): string => n.toFixed(1);

const defs = (p: string): string =>
  illusHeads(p) + `<defs>${KS.map(k => `<marker id="${p}-k-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fc11-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fc11-ar fc11-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-k-${k})"/>`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc11" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/** Subscripts inside SVG text: 'C_{a}' → C with a lowered a. */
const m = (x: string): string => x.replace(/_\{([^}]*)\}/g, '<tspan class="fc11-sub">$1</tspan>');
const tm = (x: number, y: number, str: string, cls = 'sm', anchor: Anchor = 'middle'): string => t(x, y, m(str), cls, anchor);

const lines = (x: number, y: number, ss: string[], cls: string, anchor: Anchor = 'middle', dy = 26): string =>
  ss.map((str, i) => tm(x, y + i * dy, str, cls, anchor)).join('');

/** A stoma from above: two guard cells round a pore; open is the pore's half-width as a fraction (0 = shut). */
function stoma(x: number, y: number, open: number, sc = 1): string {
  const R = 24 * sc, H = 34 * sc, h = 24 * sc, pw = Math.max(1.2, 11 * open) * sc;
  const half = (sw: 0 | 1): string =>
    `M${x},${y - H} A${R},${H} 0 0 ${sw} ${x},${y + H} L${x},${y + h} A${f(pw)},${h} 0 0 ${sw ? 0 : 1} ${x},${y - h} Z`;
  return (open > 0 ? `<ellipse class="fc11-pore" cx="${x}" cy="${y}" rx="${f(pw)}" ry="${h}"/>` : '')
    + `<path class="fc11-gc" d="${half(0)}"/><path class="fc11-gc" d="${half(1)}"/>`;
}

const co2 = (x: number, y: number, r = 10): string => molecule(x, y, 'OCO', r);

function drop(x: number, y: number, k = 1): string {
  return `<path class="fc11-drop" d="M${f(x)},${f(y - 12 * k)} C${f(x + 3 * k)},${f(y - 6 * k)} ${f(x + 8 * k)},${f(y - k)} ${f(x + 8 * k)},${f(y + 4 * k)} A${f(8 * k)},${f(8 * k)} 0 0 1 ${f(x - 8 * k)},${f(y + 4 * k)} C${f(x - 8 * k)},${f(y - k)} ${f(x - 3 * k)},${f(y - 6 * k)} ${f(x)},${f(y - 12 * k)} Z"/>`;
}

const chip = (x: number, y: number, w: number, str: string, cls: string, tcls = 'sm fc11-b', h = 36): string =>
  `<rect class="${cls}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${tm(x, y + 8, str, tcls)}`;

const rubisco = (x: number, y: number, w = 104): string => chip(x, y, w, 'Rubisco', 'fc11-rub');

const num = (x: number, y: number, n: string, r = 15): string =>
  `<circle class="fc11-num" cx="${x}" cy="${y}" r="${r}"/>${t(x, y + 6.5, n, 'fc11-num-t')}`;

const SCHEMATIC = (x = 784, y = 590): string => t(x, y, 'schematic', 'note', 'end');

/** Axes with arrow ends. */
const axes = (p: string, x0: number, y0: number, x1: number, yTop: number): string =>
  `<path class="fc11-ax" d="M${x0},${y0} V${yTop}" marker-end="url(#${p}-k-grey)"/><path class="fc11-ax" d="M${x0},${y0} H${x1}" marker-end="url(#${p}-k-grey)"/>`;

const ylab = (x: number, y: number, str: string): string =>
  `<text class="tl" transform="translate(${x} ${y}) rotate(-90)" text-anchor="middle">${m(str)}</text>`;

/** Schematic FvCB-type net uptake against CO₂ (same shape as the C12 curve; no values are shown). */
function demand(c: number): number {
  const vcmax = 60, j = 110, kc = 404.9, ko = 278.4, o = 210, gs = 42.75, rl = 1;
  const wc = (vcmax * c) / (c + kc * (1 + o / ko)), wj = (j * c) / (4 * (c + 2 * gs));
  return Math.min(wc, wj) * (1 - gs / c) - rl;
}

/* ---------- 11A · air to Rubisco: the CO₂ path through a leaf (thesis style) ---------- */

function pathSvg(): string {
  const p = 'fc11a';
  const cell = (x: number, y: number, r: number): string => {
    const chl = [0, 1, 2, 3, 4].map(k => {
      const a = (k / 5) * Math.PI * 2 + 0.4, cx = x + (r - 9) * Math.cos(a), cy = y + (r - 9) * Math.sin(a);
      return `<ellipse class="fc11-chl" cx="${f(cx)}" cy="${f(cy)}" rx="8" ry="4.5" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(cx)} ${f(cy)})"/>`;
    }).join('');
    return `<circle class="fc11-mcell" cx="${x}" cy="${y}" r="${r}"/>${chl}`;
  };
  const epi = [24, 88, 152, 274, 338, 402].map(x => `<rect class="fc11-epi" x="${x}" y="122" width="60" height="28" rx="8"/>`).join('');
  const cells = [[64, 206, 36], [146, 196, 34], [352, 200, 36], [432, 206, 32], [70, 300, 38], [160, 296, 34], [252, 318, 36], [344, 300, 34], [428, 302, 36]]
    .map(([x, y, r]) => cell(x, y, r)).join('');
  const sep = (y: number): string => `<path class="fc11-sep" d="M16,${y} H474"/>`;
  const lab = (y: number, head: string, sub: string, cls = 'sm fc11-brown'): string =>
    tm(496, y, head, 'sm fc11-b', 'start') + tm(496, y + 26, sub, cls, 'start');
  return svg(p, 'The path of CO₂ from the air through an open stoma into the air spaces of a leaf and across the cell wall and membranes into a chloroplast, where Rubisco works. Water vapour leaves through the same stoma. Concentrations fall from Ca to Ci to Cc', `
    ${co2(110, 58)}${co2(250, 40)}${co2(390, 84, 9)}
    ${ar(p, 'c', 'M250,56 L250,118')}${water(338, 56)}${ar(p, 'water', 'M262,118 L322,74')}
    ${sep(112)}${epi}
    <ellipse class="fc11-gc" cx="232" cy="136" rx="13" ry="12"/><ellipse class="fc11-gc" cx="268" cy="136" rx="13" ry="12"/>
    ${sep(162)}${cells}
    ${ar(p, 'c', 'M250,152 L250,264')}
    <path class="fc11-zoomline" d="M218,334 L24,372 M286,334 L470,372"/>
    ${sep(372)}
    <rect class="fc11-wall" x="24" y="394" width="446" height="22"/>
    <path class="fc11-membrane" d="M24,424 H470 M24,446 H470 M24,452 H470"/>
    <rect class="fc11-stroma" x="24" y="456" width="446" height="132" rx="6"/>
    ${ar(p, 'c', 'M250,378 L250,502')}${rubisco(250, 526)}
    ${lab(46, 'outside air', 'C_{a}: 425.6 ppm in 2025')}
    ${lab(128, 'stoma', 'conductance g_{s}', 'sm')}
    ${lab(236, 'air spaces inside', 'C_{i}, lower than C_{a}')}
    ${lab(410, 'cell wall, membranes', 'the mesophyll path', 'sm')}
    ${lab(500, 'chloroplast', 'C_{c}, lower than C_{i}')}
    ${tm(784, 590, 'C_{a}: NOAA GML 2025', 'tiny', 'end')}`);
}

/* ---------- 11B · the leaf chamber: what the instrument measures ---------- */

function chamberSvg(): string {
  const p = 'fc11b';
  return svg(p, 'A gas-exchange chamber: air of known flow passes over a clamped, lit leaf; an analyser compares CO₂ and water vapour in the air going in and coming out. The CO₂ difference times flow per leaf area gives net uptake A', `<g transform="translate(0,12)">
    <rect class="fc11-box" x="24" y="236" width="128" height="96" rx="14"/>${t(88, 274, 'air in', 'sm fc11-b')}${t(88, 302, 'known flow', 'sm')}
    <path class="fc11-tube" d="M152,284 H246"/><path class="fc11-tube" d="M88,236 V96 H690 V196"/>
    ${t(400, 86, 'reference: air going in', 'sm fc11-mute')}
    <rect class="fc11-lamp" x="316" y="122" width="120" height="26" rx="8"/>${t(306, 142, 'light', 'sm fc11-amber', 'end')}
    ${bolt(p, 344, 150, 352, 272)}${bolt(p, 410, 150, 418, 272)}
    <path class="fc11-leafblade" d="M196,286 Q240,276 380,280 Q520,284 572,300 Q520,296 380,292 Q240,292 196,286 Z"/>
    <rect class="fc11-shell" x="246" y="196" width="260" height="82" rx="18"/><rect class="fc11-shell" x="246" y="296" width="260" height="80" rx="18"/>
    ${co2(296, 226, 8)}${ar(p, 'c', 'M300,238 L306,270')}${water(470, 230)}${ar(p, 'water', 'M454,274 L466,250')}
    ${t(376, 404, 'leaf clamped in a chamber', 'sm fc11-b')}
    <path class="fc11-tube" d="M506,238 H590"/>
    <rect class="fc11-box" x="590" y="196" width="196" height="180" rx="14"/>${t(688, 226, 'gas analyser', 'sm fc11-b')}
    <rect class="fc11-bar-in" x="626" y="262" width="34" height="84"/><rect class="fc11-bar-out" x="700" y="290" width="34" height="56"/>
    <path class="fc11-base" d="M612,346 H758"/>${t(643, 368, 'in', 'sm')}${t(717, 368, 'out', 'sm')}
    <path class="fc11-diff" d="M660,262 H752 M734,290 H752"/>${ar(p, 'net', 'M748,266 L748,286')}
    ${t(400, 472, 'A = flow × (CO₂ in − CO₂ out) ÷ leaf area', 'sm fc11-b')}
    ${tm(400, 506, 'H₂O in − out gives g_{s}; C_{i} is calculated', 'sm')}</g>`);
}

/* ---------- 11C · net bookkeeping: the equation drawn as flows (equation-anchored) ---------- */

function bookSvg(): string {
  const p = 'fc11c';
  const term = (x: number, str: string, cls: string): string => tm(x, 68, str, `fc11-eq ${cls}`);
  const under = (x: number, w: number, cls: string): string => `<path class="fc11-under ${cls}" d="M${x - w / 2},84 H${x + w / 2}"/>`;
  const head = (x: number, y: number, cls: string, up: boolean, w: number): string =>
    `<path class="${cls}" d="M${x - w},${y} L${x + w},${y} L${x},${up ? y - 1.3 * w : y + 1.3 * w} Z"/>`;
  return svg(p, 'Net CO₂ uptake as bookkeeping: CO₂ fixed by Rubisco (Vc) flows into the leaf; part flows back out as photorespiratory release (0.5 Vo) and other release in the light (RL); the remainder is the net uptake A that a chamber measures', `
    ${term(118, 'A', 'fc11-net-t')}${term(172, '=', '')}${term(258, 'V_{c}', 'fc11-brown')}${term(340, '−', '')}
    ${term(436, '0.5 V_{o}', 'fc11-clay')}${term(530, '−', '')}${term(612, 'R_{L}', 'fc11-rl-t')}
    ${under(118, 40, 'fc11-s-net')}${under(258, 60, 'fc11-s-c')}${under(436, 110, 'fc11-s-clay')}${under(612, 60, 'fc11-s-rl')}
    ${lines(118, 114, ['net uptake', '(measured)'], 'sm')}${lines(258, 114, ['carboxylation', '(CO₂ fixed)'], 'sm')}
    ${lines(436, 114, ['photorespiratory', 'release'], 'sm')}${lines(612, 114, ['other release', 'in the light'], 'sm')}
    ${t(36, 196, 'air', 'note', 'start')}
    <rect class="fc11-leaf" x="24" y="210" width="752" height="276" rx="28"/>${t(44, 470, 'leaf', 'note', 'start')}
    <path class="fc11-band fc11-s-c" style="stroke-width:80" d="M400,170 V330"/>
    <path class="fc11-band fc11-s-clay" style="stroke-width:18" d="M369,329 V356 Q369,400 329,400 H291 Q249,400 249,356 V190"/>${head(249, 192, 'fc11-f-clay', true, 16)}
    <path class="fc11-band fc11-s-rl" style="stroke-width:10" d="M435,329 V360 Q435,400 475,400 H513 Q555,400 555,360 V190"/>${head(555, 192, 'fc11-f-rl', true, 12)}
    <path class="fc11-band fc11-s-net" style="stroke-width:52" d="M404,329 V430"/>${head(404, 430, 'fc11-f-net', false, 34)}
    ${tm(346, 270, 'V_{c}', 'lab fc11-b fc11-brown', 'end')}${tm(234, 300, '0.5 V_{o}', 'lab fc11-b fc11-clay', 'end')}
    ${tm(570, 300, 'R_{L}', 'lab fc11-b fc11-rl-t', 'start')}${t(446, 424, 'A', 'lab fc11-b', 'start')}
    ${t(756, 470, 'chamber: CO₂ in − out = A', 'sm', 'end')}
    ${t(400, 534, 'At A = 0, Rubisco still fixes CO₂', 'sm fc11-b')}
    ${t(784, 590, 'band widths schematic', 'note', 'end')}`);
}

/* ---------- 11D · tanks and valves: the diffusion analogy, mapped ---------- */

function tanksSvg(): string {
  const p = 'fc11d';
  const tank = (x: number, w: number, level: number, name: string, c: string): string =>
    `<rect class="fc11-fluid" x="${x}" y="${level}" width="${w}" height="${440 - level}"/>
     <path class="fc11-tank" d="M${x},140 V440 H${x + w} V140"/>
     <path class="fc11-level" d="M${x - 8},${level} H${x + w + 8}"/>${tm(x + w + 12, level + 8, c, 'sm fc11-brown fc11-b', 'start')}
     ${t(x + w / 2, 120, name, 'sm fc11-b')}`;
  const valve = (x: number, y: number): string =>
    `<path class="fc11-valve" d="M${x - 16},${y - 14} L${x + 16},${y + 14} L${x + 16},${y - 14} L${x - 16},${y + 14} Z"/><path class="fc11-stem" d="M${x},${y} V${y - 30} M${x - 12},${y - 30} H${x + 12}"/>`;
  return svg(p, 'Analogy: three tanks of CO₂ joined by pipes and valves. The level in each tank is the CO₂ concentration (Ca, Ci, Cc); the valves are the stomata and the mesophyll path; the flow, drained by Rubisco, is the net uptake A', `<g transform="translate(0,-40)">
    ${tank(40, 150, 176, 'outside air', 'C_{a}')}${tank(300, 130, 270, 'leaf air spaces', 'C_{i}')}${tank(540, 130, 340, 'chloroplast', 'C_{c}')}
    <path class="fc11-pipe" d="M190,420 H300 M430,420 H540 M670,420 H736 V470"/>
    ${valve(245, 420)}${valve(485, 420)}
    ${ar(p, 'c', 'M206,404 L228,404')}${ar(p, 'c', 'M446,404 L468,404')}${ar(p, 'c', 'M690,404 L712,404')}
    ${tm(245, 470, 'stomata, g_{s}', 'sm fc11-b')}${tm(485, 470, 'mesophyll, g_{m}', 'sm fc11-b')}
    ${chip(730, 494, 106, 'Rubisco', 'fc11-rub')}
    ${t(400, 540, 'level = CO₂ concentration · valve = conductance · flow = A', 'sm')}
    ${t(400, 574, 'Same flow A through each valve', 'sm fc11-b')}</g>`);
}

/* ---------- 11E · the raw signal: CO₂ going in and coming out (schematic evidence) ---------- */

function signalSvg(): string {
  const p = 'fc11e';
  const x0 = 110, x1 = 760, ref = 270;
  const X = (u: number): number => x0 + u * (x1 - x0);
  const ss = (a: number, b: number, u: number): number => { const v = Math.min(1, Math.max(0, (u - a) / (b - a))); return v * v * (3 - 2 * v); };
  // Out minus in, in pixels: +24 (release) in the dark, −86 (uptake) in the light.
  const dev = (u: number): number => 24 - 110 * ss(0.3, 0.42, u) * (1 - ss(0.72, 0.8, u));
  const pts = Array.from({ length: 161 }, (_, k) => { const u = k / 160; return [X(u), ref - dev(u)] as const; });
  const outD = 'M' + pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L');
  const area = (pos: boolean): string => 'M' + pts.map(([x, y]) => `${f(x)},${f(pos ? Math.min(y, ref) : Math.max(y, ref))}`).join(' L') + ` L${x1},${ref} L${x0},${ref} Z`;
  return svg(p, 'Schematic chamber record: the CO₂ concentration of air leaving the leaf chamber compared with the air going in. In the dark the outgoing air carries more CO₂ (net release); in the light it carries less (net uptake). The gap times flow per leaf area is A', `
    <rect class="fc11-dark" x="${x0}" y="70" width="${X(0.36) - x0}" height="28"/><rect class="fc11-lit" x="${X(0.36)}" y="70" width="${X(0.76) - X(0.36)}" height="28"/><rect class="fc11-dark" x="${X(0.76)}" y="70" width="${x1 - X(0.76)}" height="28"/>
    ${t((x0 + X(0.36)) / 2, 91, 'dark', 'sm fc11-light-t')}${t((X(0.36) + X(0.76)) / 2, 91, 'light on', 'sm fc11-b')}${t((X(0.76) + x1) / 2, 91, 'dark', 'sm fc11-light-t')}
    ${axes(p, x0, 450, x1 + 10, 120)}${ylab(70, 290, 'CO₂ in the air stream →')}${t((x0 + x1) / 2, 488, 'time →', 'tl')}
    <path class="fc11-area-rel" d="${area(true)}"/><path class="fc11-area-up" d="${area(false)}"/>
    <path class="fc11-ref" d="M${x0},${ref} H${x1}"/><path class="fc11-out" d="${outD}"/>
    ${t(X(0.56), ref - 14, 'air in (reference)', 'sm fc11-mute')}${t(X(0.56), ref + 116, 'air out, past the leaf', 'sm fc11-b')}
    ${t(X(0.16), ref - 40, 'net release', 'sm fc11-clay')}${t(X(0.92), ref - 40, 'net release', 'sm fc11-clay')}
    ${t(X(0.56), ref + 46, 'net uptake: A > 0', 'sm fc11-b fc11-brown')}
    ${t(400, 540, 'A = flow × (in − out) ÷ leaf area', 'sm fc11-b')}
    ${SCHEMATIC(784, 590)}`);
}

/* ---------- 11F · open vs shut: the stomatal trade-off ---------- */

function openShutSvg(): string {
  const p = 'fc11f';
  const side = (bx: number, open: boolean): string => {
    const cx = bx + 196, wc = open ? 10 : 3.4, ci = open ? 150 : 76, ca = 170, yS = 190, yB = 466;
    return `<rect class="${open ? 'fc11-panel' : 'fc11-panel fc11-panel-b'}" x="${bx}" y="4" width="392" height="592" rx="18"/>
      ${t(cx, 54, open ? 'stomata wide open' : 'stomata nearly shut', 'lab fc11-b')}
      ${stoma(cx, yS, open ? 1 : 0.18, 2.1)}
      <path class="fc11-flow-c" style="stroke-width:${wc}" d="M${bx + 30},${yS - 26} H${cx - 26}"/><path class="fc11-f-c" d="M${cx - 28},${yS - 26 - wc - 5} L${cx - 8},${yS - 26} L${cx - 28},${yS - 26 + wc + 5} Z"/>${co2(bx + 46, yS - 56, 9)}${t(bx + 30, yS + 34, 'CO₂ in', 'sm fc11-brown', 'start')}
      <path class="fc11-flow-w" style="stroke-width:${wc}" d="M${cx + 20},${yS + 26} H${bx + 344}"/><path class="fc11-f-w" d="M${bx + 342},${yS + 26 - wc - 5} L${bx + 364},${yS + 26} L${bx + 342},${yS + 26 + wc + 5} Z"/>${drop(bx + 340, yS + 60)}${t(bx + 362, yS - 26, 'water out', 'sm fc11-blue', 'end')}
      <path class="fc11-base" d="M${bx + 90},${yB} H${bx + 302}"/>
      <rect class="fc11-bar-a" x="${bx + 120}" y="${yB - ca}" width="52" height="${ca}"/><rect class="fc11-bar-i" x="${bx + 220}" y="${yB - ci}" width="52" height="${ci}"/>
      ${tm(bx + 146, yB + 28, 'C_{a}', 'sm fc11-b')}${tm(bx + 246, yB + 28, 'C_{i}', 'sm fc11-b')}
      <path class="fc11-diff" d="M${bx + 172},${yB - ca} H${bx + 300} M${bx + 272},${yB - ci} H${bx + 300}"/>
      ${ar(p, 'ink', `M${bx + 292},${yB - ca + 4} L${bx + 292},${yB - ci - 4}`)}
      ${tm(cx, 548, open ? 'g_{s} large: C_{i} stays near C_{a}' : 'g_{s} small: C_{i} falls', 'sm')}`;
  };
  return svg(p, 'Stomata wide open versus nearly shut: open stomata let much CO₂ in and much water out, and Ci stays near Ca; nearly shut stomata pass less of both, and Ci falls', `
    ${side(4, true)}${side(404, false)}`);
}

/* ---------- 11G · zero is not zero: gross fixation, release and the compensation point ---------- */

function zeroSvg(): string {
  const p = 'fc11g';
  const x0 = 120, x1 = 740, y0 = 470, yTop = 110, imax = 0.6, top = 0.7;
  const X = (i: number): number => x0 + (i / imax) * (x1 - x0), Y = (v: number): number => y0 - (v / top) * (y0 - yTop);
  const vc = (i: number): number => i / (i + 0.35), rel = (i: number): number => 0.16 + 0.15 * vc(i);
  const n = 120, I = (k: number): number => (k / n) * imax;
  const curve = (fn: (i: number) => number): string => 'M' + Array.from({ length: n + 1 }, (_, k) => `${f(X(I(k)))},${f(Y(fn(I(k))))}`).join(' L');
  let ic = 0;
  while (vc(ic) < rel(ic)) ic += 0.0005;
  const band = (from: number, to: number): string => {
    const ks = Array.from({ length: 61 }, (_, k) => from + ((to - from) * k) / 60);
    return 'M' + ks.map(i => `${f(X(i))},${f(Y(vc(i)))}`).join(' L') + ' L' + ks.reverse().map(i => `${f(X(i))},${f(Y(rel(i)))}`).join(' L') + ' Z';
  };
  return svg(p, 'Schematic: CO₂ fixed by Rubisco rises with light; CO₂ released by photorespiration and other release in the light rises less. Net uptake A is the gap. Where the curves cross, the compensation point, A is zero although Rubisco is still fixing CO₂', `
    ${axes(p, x0, y0, x1 + 16, yTop - 20)}${ylab(78, (y0 + yTop) / 2, 'CO₂ flux →')}${t((x0 + x1) / 2, y0 + 40, 'light →', 'tl')}
    <path class="fc11-area-rel" d="${band(0, ic)}"/><path class="fc11-area-up" d="${band(ic, imax)}"/>
    <path class="fc11-curve fc11-s-c" d="${curve(vc)}"/><path class="fc11-curve fc11-s-clay fc11-dashc" d="${curve(rel)}"/>
    ${tm(x1, Y(vc(imax)) - 18, 'fixed by Rubisco, V_{c}', 'sm fc11-b fc11-brown', 'end')}
    ${tm(x1, Y(rel(imax)) + 34, 'released: 0.5 V_{o} + R_{L}', 'sm fc11-b fc11-clay', 'end')}
    ${t(X(0.4), Y((vc(0.4) + rel(0.4)) / 2) + 8, 'net uptake A', 'sm fc11-b')}
    <path class="fc11-pin" d="M${f(X(ic))},${f(Y(vc(ic)))} V${y0}"/><circle class="fc11-dot" cx="${f(X(ic))}" cy="${f(Y(vc(ic)))}" r="7"/>
    <path class="fc11-lead" d="M${f(X(ic) + 6)},${f(Y(vc(ic)) + 8)} L${f(X(ic) + 34)},${y0 - 52}"/>
    ${t(X(ic) + 40, y0 - 40, 'compensation point: A = 0,', 'sm fc11-b', 'start')}${t(X(ic) + 40, y0 - 14, 'yet Rubisco is still fixing CO₂', 'sm', 'start')}
    ${t(X(ic) - 6, y0 + 40, 'net release', 'fc11-t15 fc11-clay', 'end')}
    ${SCHEMATIC(784, 590)}`);
}

/* ---------- 11H · measured, calculated, derived, modelled: a step ladder ---------- */

function ladderSvg(): string {
  const p = 'fc11h';
  const row = (y: number, n: string, head: string, line: string, icon: string): string =>
    `<rect class="fc11-row" x="24" y="${y}" width="752" height="112" rx="16"/>${num(58, y + 40, n)}
     ${t(86, y + 48, head, 'lab fc11-b', 'start')}${tm(86, y + 84, line, 'sm', 'start')}${icon}`;
  const chamberIcon = (x: number, y: number): string =>
    `<rect class="fc11-shell" x="${x - 46}" y="${y - 30}" width="92" height="26" rx="10"/><rect class="fc11-shell" x="${x - 46}" y="${y + 4}" width="92" height="26" rx="10"/><path class="fc11-leafblade" d="M${x - 62},${y} Q${x},${y - 6} ${x + 62},${y + 2} Q${x},${y + 6} ${x - 62},${y} Z"/>`;
  return svg(p, 'Four steps from the chamber to Rubisco: measured gas concentrations, flow and leaf area; calculated A and water loss; derived gs and Ci; modelled Cc, which needs the mesophyll path. Each step adds assumptions', `
    ${row(16, '1', 'Measured', 'CO₂ and H₂O in and out, air flow, leaf area', chamberIcon(700, 72))}
    ${row(150, '2', 'Calculated', 'net CO₂ uptake A and the water lost', co2(690, 196, 9) + drop(736, 210))}
    ${row(284, '3', 'Derived', 'g_{s} from the water lost; then C_{i} = C_{a} − A / g_{s}', stoma(712, 340, 0.8, 0.9))}
    ${row(418, '4', 'Modelled', 'C_{c} needs a model of the mesophyll path', `<ellipse class="fc11-chl" cx="706" cy="474" rx="60" ry="26"/>${rubisco(706, 474, 104)}`)}
    ${t(400, 572, 'Only step 1 is read off the instrument', 'sm fc11-b')}`);
}

/* ---------- 11I · three ideas: a minimal icon summary ---------- */

function threeSvg(): string {
  const p = 'fc11i';
  const scale = (x: number, y: number): string => `
    <path class="fc11-beam" d="M${x},${y - 96} V${y + 40} M${x - 40},${y + 40} H${x + 40}"/>
    <path class="fc11-beam" d="M${x - 92},${y - 66} L${x + 92},${y - 86}"/><circle class="fc11-num" cx="${x}" cy="${y - 76}" r="7"/>
    <path class="fc11-string" d="M${x - 92},${y - 66} L${x - 118},${y - 6} M${x - 92},${y - 66} L${x - 66},${y - 6} M${x + 92},${y - 86} L${x + 66},${y - 26} M${x + 92},${y - 86} L${x + 118},${y - 26}"/>
    <path class="fc11-pan" d="M${x - 124},${y - 6} Q${x - 92},${y + 22} ${x - 60},${y - 6} Z"/><path class="fc11-pan" d="M${x + 60},${y - 26} Q${x + 92},${y + 2} ${x + 124},${y - 26} Z"/>
    ${co2(x - 92, y - 22, 8)}${tm(x - 92, y + 30, 'gain V_{c}', 'sm fc11-brown', 'middle')}${tm(x + 92, y + 10, 'losses', 'sm fc11-clay', 'middle')}`;
  const pathIcon = (x: number, y: number): string => `
    <circle class="fc11-c-big" cx="${x - 82}" cy="${y - 40}" r="22"/><circle class="fc11-c-mid" cx="${x}" cy="${y - 40}" r="16"/><circle class="fc11-c-small" cx="${x + 82}" cy="${y - 40}" r="11"/>
    ${ar(p, 'c', `M${x - 56},${y - 40} L${x - 22},${y - 40}`)}${ar(p, 'c', `M${x + 20},${y - 40} L${x + 66},${y - 40}`)}
    <path class="fc11-membrane" d="M${x + 42},${y - 84} V${y + 4}"/>
    ${tm(x - 82, y + 16, 'C_{a}', 'sm fc11-b')}${tm(x, y + 16, 'C_{i}', 'sm fc11-b')}${tm(x + 82, y + 16, 'C_{c}', 'sm fc11-b')}`;
  return svg(p, 'Three ideas: stomata gate CO₂ and cost water, A = gs(Ca − Ci); a chamber measures the net of gains and losses, A = Vc − 0.5 Vo − RL; Rubisco sees chloroplast CO₂, Cc, which is lower than Ci', `
    ${num(80, 120, '1')}${t(106, 129, 'Stomata', 'lab fc11-b', 'start')}
    <g transform="translate(156 0)">${stoma(420, 120, 1, 1.5)}${co2(270, 100, 9)}${ar(p, 'c', 'M298,100 L390,112')}${ar(p, 'water', 'M450,130 L540,144')}${drop(560, 146)}</g>
    ${num(80, 310, '2')}${t(106, 319, 'Net exchange', 'lab fc11-b', 'start')}${scale(576, 338)}
    ${num(80, 480, '3')}${tm(106, 489, 'Chloroplast CO₂', 'lab fc11-b', 'start')}${pathIcon(576, 520)}`);
}

/* ---------- 11J · supply meets demand: where a leaf operates on its A–Ci curve ---------- */

function supplySvg(): string {
  const p = 'fc11j';
  const x0 = 110, x1 = 740, y0 = 450, yTop = 100, cmax = 1000, amax = 30, ca = 425.6;
  const X = (c: number): number => x0 + (c / cmax) * (x1 - x0), Y = (a: number): number => y0 - (a / amax) * (y0 - yTop);
  const pts: string[] = [];
  for (let c = 60; c <= cmax; c += 5) pts.push(`${f(X(c))},${f(Y(Math.max(-1, demand(c))))}`);
  const meet = (gs: number): number => { let c = 60; while (demand(c) < gs * (ca - c) && c < ca) c += 0.5; return c; };
  const op = (gs: number, cls: string): string => {
    const c = meet(gs), a = demand(c), cTop = Math.max(60, ca - 26 / gs);
    return `<path class="fc11-supply ${cls}" d="M${f(X(ca))},${f(Y(0))} L${f(X(cTop))},${f(Y(gs * (ca - cTop)))}"/>`
      + `<path class="fc11-pin" d="M${f(X(c))},${f(Y(a))} V${y0}"/><circle class="fc11-dot" cx="${f(X(c))}" cy="${f(Y(a))}" r="7"/>`;
  };
  const c1 = meet(0.12), c2 = meet(0.045), top1 = ca - 26 / 0.12;
  return svg(p, 'Schematic A–Ci plot. The demand curve is what the chloroplast can fix at each Ci. The supply line A = gs(Ca − Ci) starts at Ca on the axis; its slope is set by stomatal conductance. The leaf operates where they cross; when stomata close the line flattens and both A and Ci fall', `
    ${axes(p, x0, y0, x1 + 16, yTop - 20)}${ylab(66, (y0 + yTop) / 2, 'net CO₂ uptake, A →')}${tm((x0 + x1) / 2, y0 + 72, 'CO₂ inside the leaf, C_{i} →', 'tl')}
    <path class="fc11-curve fc11-s-net" d="M${pts.join(' L')}"/>
    ${t(X(1000), 240, 'demand:', 'sm fc11-b', 'end')}${t(X(1000), 266, 'what the chloroplast can fix', 'sm', 'end')}
    ${op(0.12, 'fc11-s-c')}${op(0.045, 'fc11-s-c fc11-dashc')}
    ${t(X(top1) + 14, Y(26) + 8, 'stomata open', 'sm fc11-brown', 'start')}${lines(X(60), Y(0.045 * (ca - 60)) - 44, ['stomata', 'closing'], 'sm fc11-brown', 'start')}
    ${ar(p, 'ink', `M${f(X(c1) - 6)},${f(Y(demand(c1)) + 12)} Q${f(X(c1) - 24)},${f(Y(demand(c2)) - 6)} ${f(X(c2) + 12)},${f(Y(demand(c2)) - 4)}`)}
    <path class="fc11-tick" d="M${f(X(ca))},${y0} V${y0 + 10}"/>${tm(X(ca), y0 + 32, 'C_{a}', 'sm fc11-b')}
    ${tm(X(c2), y0 + 32, 'C_{i}', 'sm fc11-brown')}${tm(X(c1), y0 + 32, 'C_{i}', 'sm fc11-brown')}
    ${tm(X(ca) + 22, Y(6), 'supply', 'sm fc11-b fc11-brown', 'start')}
    ${SCHEMATIC(784, 590)}`);
}
