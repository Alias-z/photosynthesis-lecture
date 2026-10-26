// Slide L10 · A proton gradient powers ATP synthesis. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Emphasis: protons. Water splitting and the b₆f Q cycle load the lumen; proton motive force = ΔpH + Δψ;
// ATP synthase turns it into ATP on the stroma side. Shared drawing helpers come from ./l09.
import type { PlateText, Variant } from '../types';
import { text } from '../mechanisms';
import { bilayer, bolt, molecule, tag, water } from '../illus';
import { atps, cross, cytb6f, disc, ePath, f, gPath, hion, hPath, kPath, miniBolt, num, pq, psys, svg as svg9, tick } from './l09';
import './l10.css';

export const PLATE: PlateText = {
  n: '10',
  title: 'A proton gradient powers ATP synthesis',
  status: 'draft',
  lead: 'Electron flow loads the lumen with protons; their flow back through ATP synthase makes ATP in the stroma.',
  points: [
    { claim: 'Two sources load the lumen.', text: 'Water splitting releases H⁺ inside; PQ and the b₆f Q cycle move more in from the stroma.' },
    { claim: 'The driving force: ΔpH plus voltage (Δψ).', text: 'Lumen pH falls to about 5.7–6 in strong light, not the 4–5 of many textbooks.' },
    { claim: 'ATP is made in the stroma.', text: 'Returning H⁺ turn the rotor; its head makes ATP where the Calvin–Benson cycle uses it.' },
  ],
  refs: [
    { label: 'Mitchell 1961', url: 'https://doi.org/10.1038/191144a0' },
    { label: 'Jagendorf & Uribe 1966', url: 'https://doi.org/10.1073/pnas.55.1.170' },
    { label: 'Hahn et al. 2018', url: 'https://doi.org/10.1126/science.aat4318' },
    { label: 'Takizawa et al. 2007', url: 'https://doi.org/10.1016/j.bbabio.2007.07.006' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Proton map' },
  { id: 'b', name: 'Rotary motor', anim: true },
  { id: 'c', name: 'Dam and turbine' },
  { id: 'd', name: 'Acid bath', anim: true },
  { id: 'e', name: 'Lumen pH' },
  { id: 'f', name: 'Sealed vs leaky' },
  { id: 'g', name: 'Q-cycle zoom' },
  { id: 'h', name: 'Vesicle frames', anim: true },
  { id: 'i', name: 'ATP equation' },
  { id: 'j', name: 'Two in, one out' },
];

const svg = (p: string, label: string, body: string): string => svg9(p, label, body, 'fl10');

/** H⁺ balls at a list of points. */
const many = (pts: [number, number][], r = 13): string => pts.map(([x, y]) => hion(x, y, r)).join('');
/** A pair of ADP and Pᵢ tags. */
const adpPi = (x: number, y: number): string => `${tag(x, y, 'ADP', 'atp')}${text(x + 46, y + 8, '+', 'sm')}${tag(x + 76, y, '', 'pi')}`;
/** Charge signs: Δψ drawn as + in the lumen and − in the stroma. */
const signs = (pts: [number, number][], s: '+' | '−'): string => pts.map(([x, y]) => text(x, y, s, s === '+' ? 'fl10-plus' : 'fl10-minus')).join('');

/* ---------- 10a · proton map: two sources load the lumen, one exit makes ATP ---------- */

function protonMap(): string {
  const p = 'fl10a';
  return svg(p, 'Thylakoid membrane with protons as the protagonists: water splitting at PSII and plastoquinone with cytochrome b6f load the lumen with H+; H+ return to the stroma through ATP synthase, which makes ATP on the stroma side', `
    <rect class="fl09-lumen" x="0" y="330" width="800" height="270"/>
    ${bilayer(p, 0, 800, 250, 330)}
    ${psys(130, 290, 124, 166, 'PSII', 'lab fl09-b', 16)}
    ${pq(234, 290, 26, 16)}
    ${cytb6f(318, 290, 38, 88, 'lab fl09-b')}
    ${psys(470, 290, 116, 166, 'PSI', 'lab fl09-b', 16)}
    ${atps(668, 250, 330, 26)}
    ${gPath(p, 'M150,410 L150,376')}${gPath(p, 'M194,288 L206,288')}${gPath(p, 'M262,290 L276,290')}${gPath(p, 'M340,376 Q370,420 410,392')}
    ${text(430, 414, 'e⁻ route: page 9', 'fl10-ghost', 'start')}

    ${water(110, 452)}${water(152, 472)}${kPath(p, 'M126,486 L126,516')}${molecule(126, 540, 'OO', 12)}
    ${many([[200, 440], [230, 478], [196, 512]])}
    ${num(38, 578, 1)}${text(60, 586, 'water splitting', 'sm', 'start')}

    ${hion(234, 168)}${hPath(p, 'M234,186 L234,268', true)}
    ${hPath(p, 'M318,382 L318,424')}${many([[294, 448], [342, 462], [306, 500]])}
    ${num(372, 160, 2)}${text(392, 168, 'PQ + b₆f (Q cycle)', 'sm', 'start')}

    ${many([[440, 470], [500, 444], [548, 494], [470, 530], [600, 462], [612, 526]])}
    ${hPath(p, 'M668,520 L668,366')}${hPath(p, 'M700,212 Q730,180 746,166', true)}${hion(756, 150)}
    ${num(560, 52, 3)}${text(582, 60, 'ATP synthase', 'sm', 'start')}
    ${adpPi(548, 112)}${kPath(p, 'M662,112 L700,112')}${tag(748, 112, 'ATP', 'atp')}

    ${signs([[400, 358], [540, 358], [610, 358]], '+')}${signs([[400, 236], [540, 236], [610, 236]], '−')}
    ${text(24, 60, 'stroma', 'fl09-note', 'start')}${text(790, 380, 'lumen', 'fl09-note', 'end')}
    ${text(436, 586, 'more H⁺ (ΔpH) and + charge (Δψ)', 'sm')}
  `);
}

/* ---------- 10b · rotary motor: ATP synthase as a hero illustration ---------- */

function rotaryMotor(): string {
  const p = 'fl10b';
  const ring = Array.from({ length: 9 }, (_, i) => {
    const x = 312 + i * 22;
    return `<rect class="fl10-c" x="${x}" y="334" width="18" height="72" rx="8"/>`;
  }).join('');
  return svg(p, 'ATP synthase as a rotary motor: protons from the lumen enter through the stator, turn the c-ring and central stalk, and leave to the stroma; the head on the stroma side makes ATP from ADP and phosphate', `
    <rect class="fl09-lumen" x="0" y="410" width="800" height="190"/>
    ${bilayer(p, 0, 800, 330, 410)}
    <path class="fl10-arm" d="M262,338 L262,150 Q262,70 340,64 L380,62"/>
    <rect class="fl10-a" x="242" y="318" width="44" height="108" rx="12"/>
    <rect class="fl10-c-bg" x="304" y="326" width="210" height="88" rx="20"/>${ring}
    <rect class="fl10-gamma" x="392" y="190" width="34" height="140" rx="10"/>
    <circle class="blob-atp" cx="356" cy="176" r="56"/><circle class="blob-atp" cx="462" cy="176" r="56"/><circle class="blob-atp" cx="409" cy="112" r="56"/>
    <path class="fl10-spin" d="M366,282 A44,14 0 1 0 452,282" marker-end="url(#${p}-k)"/>
    <path class="fl10-spin" d="M318,430 A92,20 0 0 0 500,430" marker-end="url(#${p}-k)"/>

    ${many([[120, 480], [180, 500], [100, 540], [230, 540]])}
    ${hPath(p, 'M200,470 L246,428')}
    ${hPath(p, 'M250,316 L214,266')}${hion(200, 246)}
    ${text(150, 588, 'H⁺ in', 'sm fl09-b')}${text(150, 212, 'H⁺ out', 'sm fl09-b')}

    ${adpPi(600, 252)}${kPath(p, 'M600,232 Q560,214 522,206')}
    ${kPath(p, 'M518,120 Q570,96 618,94')}${tag(662, 94, 'ATP', 'atp')}

    ${text(476, 292, 'ring + stalk turn', 'sm fl09-b', 'start')}${text(476, 316, '(rotor)', 'sm', 'start')}
    ${text(30, 100, 'head + side arm', 'sm fl09-b', 'start')}${text(30, 126, 'hold still (stator)', 'sm', 'start')}
    ${text(650, 470, 'c₁₄ ring (spinach):', 'sm')}${text(650, 496, '14 H⁺ per turn → 3 ATP', 'sm')}
    ${text(790, 36, 'stroma', 'fl09-note', 'end')}${text(790, 588, 'lumen', 'fl09-note', 'end')}
  `);
}

/* ---------- 10c · analogy: a dam and a turbine ---------- */

function damTurbine(): string {
  const p = 'fl10c';
  const wx = 612, wy = 512;
  const blades = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `<path class="fl10-blade" d="M${wx},${wy} L${f(wx + Math.cos(a) * 24)},${f(wy + Math.sin(a) * 24)}"/>`;
  }).join('');
  return svg(p, 'Analogy: the lumen is a reservoir held by a dam, the membrane; two pumps powered by light-driven electron flow fill it with protons; the protons run back through a turbine, ATP synthase, into the stroma downstream and make ATP; the height difference is the proton motive force', `<g transform="translate(0 -18)">
    <path class="fl10-res" d="M20,220 L446,220 L424,540 L20,540 Z"/><path class="fl10-surf" d="M20,220 H446"/>
    <path class="fl10-dam" d="M446,180 L500,180 L566,540 L424,540 Z"/>
    <path class="fl10-res fl10-low" d="M555,480 H790 V540 H566 Z"/><path class="fl10-surf" d="M555,480 H790"/>
    <rect class="fl10-pipe" x="410" y="500" width="190" height="24" rx="6"/>
    ${blades}<circle class="fl10-hub" cx="${wx}" cy="${wy}" r="9"/>
    <rect class="fl10-house" x="580" y="410" width="64" height="52" rx="8"/><path class="fl10-shaft" d="M${wx},488 V462"/>
    ${kPath(p, 'M648,436 L676,436')}${tag(716, 436, 'ATP', 'atp')}
    ${many([[90, 300], [160, 270], [240, 320], [300, 276], [110, 400], [200, 440], [290, 400], [360, 450], [140, 500], [260, 500], [340, 340], [60, 470]])}
    ${hPath(p, 'M384,512 L584,512', true)}${hion(664, 504, 12)}

    <path class="fl10-pipe2" d="M770,480 V130 H380 V212"/>
    <rect class="fl10-pump" x="556" y="108" width="88" height="44" rx="10"/>${text(600, 138, 'pump', 'sm fl09-b')}
    ${text(600, 178, 'PQ + b₆f', 'sm')}${bolt(p, 690, 52, 650, 108)}
    ${hion(470, 130, 12)}${kPath(p, 'M448,130 L420,130')}
    <rect class="fl10-pump" x="24" y="110" width="88" height="44" rx="10"/>${text(68, 140, 'source', 'sm fl09-b')}
    ${text(122, 140, 'water splitting', 'sm', 'start')}${bolt(p, 150, 60, 112, 112)}
    <path class="fl10-pipe2" d="M68,154 V214"/>${hPath(p, 'M68,232 L68,262', true)}

    <path class="fl10-dimdot" d="M446,220 H732"/>
    <path class="fl10-dim" d="M722,220 V478 M712,220 H732 M712,478 H732"/>
    ${text(708, 280, 'head =', 'fl09-it', 'end')}${text(708, 306, 'driving force', 'sm fl09-b', 'end')}${text(708, 332, '(ΔpH + Δψ)', 'sm', 'end')}
    ${text(640, 376, 'turbine', 'fl09-it')}${text(640, 400, 'ATP synthase', 'sm fl09-b')}

    ${text(230, 256, 'reservoir', 'fl09-it')}${text(473, 168, 'dam', 'fl09-it')}${text(740, 522, 'downstream', 'fl09-it')}
    ${text(220, 586, 'lumen', 'lab fl09-b')}${text(495, 586, 'membrane', 'lab fl09-b')}${text(700, 586, 'stroma', 'lab fl09-b')}</g>
  `);
}

/* ---------- 10d · evidence: ATP made in the dark after an acid-to-base jump ---------- */

function acidBath(): string {
  const p = 'fl10d';
  const beaker = (x: number, cls: string, label: string): string =>
    `<path class="fl10-liq ${cls}" d="M${x + 8},200 V430 Q${x + 8},470 ${x + 48},470 H${x + 192} Q${x + 232},470 ${x + 232},430 V200 Z"/>`
    + `<path class="fl10-glass" d="M${x},170 V430 Q${x},478 ${x + 48},478 H${x + 192} Q${x + 240},478 ${x + 240},430 V170"/>${text(x + 120, 506, label, 'sm fl09-b')}`;
  const ves = (cx: number, cy: number, inside: [number, number][]): string =>
    `<circle class="fl10-ves" cx="${cx}" cy="${cy}" r="62"/>${atps(cx, cy - 66, cy - 58, 13)}${many(inside.map(([x, y]) => [cx + x, cy + y]), 12)}`;
  const moon = (x: number, y: number): string => `<path class="fl10-moon" d="M${x},${y - 14} A14,14 0 1 0 ${x + 12},${y + 8} A11,11 0 1 1 ${x},${y - 14} Z"/>${text(x + 22, y + 8, 'dark', 'fl09-it', 'start')}`;
  const inner: [number, number][] = [[-30, -12], [6, -22], [32, 8], [-22, 24], [14, 30], [-4, 4]];
  return svg(p, 'Jagendorf and Uribe, 1966: thylakoids soaked in acid in the dark, then moved to a base with ADP and phosphate, still in the dark, make ATP as protons flow out through ATP synthase', `
    ${num(28, 40, 1)}${text(52, 48, 'Soak in acid', 'sm fl09-b', 'start')}
    ${num(288, 40, 2)}${text(312, 48, 'Move to base', 'sm fl09-b', 'start')}
    ${num(548, 40, 3)}${text(572, 48, 'ATP forms', 'sm fl09-b', 'start')}
    ${moon(40, 104)}${moon(300, 104)}${moon(560, 104)}
    ${beaker(14, 'fl10-acid', 'acid: low pH')}${beaker(276, 'fl10-base', 'base: high pH')}${beaker(538, 'fl10-base', 'H⁺ flow out')}
    ${ves(134, 330, inner)}${many([[50, 250], [210, 240], [60, 420], [220, 430], [130, 444], [40, 330], [226, 340]], 12)}
    ${ves(396, 330, inner)}${hPath(p, 'M412,226 L432,204', true)}${hion(442, 190, 12)}${adpPi(352, 440)}
    ${ves(658, 330, inner.slice(0, 3))}${hion(626, 200, 12)}${hion(690, 196, 12)}
    ${tag(600, 250, 'ATP', 'atp')}${tag(716, 250, 'ATP', 'atp')}${tag(658, 446, 'ATP', 'atp')}
    ${kPath(p, 'M258,330 L272,330')}${kPath(p, 'M520,330 L534,330')}
    ${text(400, 552, 'A pH difference alone made ATP', 'sm fl09-b')}
    ${text(400, 584, 'after Jagendorf & Uribe 1966', 'fl09-key')}
  `);
}

/* ---------- 10e · data: lumen pH in leaves and the two parts of the proton motive force ---------- */

function lumenPh(): string {
  const p = 'fl10e';
  const yOf = (ph: number): number => 96 + (8 - ph) * 104;
  const ticks = [4, 5, 6, 7, 8].map(ph => `<path class="fl10-tick" d="M150,${yOf(ph)} H168"/>${text(140, yOf(ph) + 8, `${ph}`, 'tl', 'end')}`).join('');
  const top = 96, h = 416, x = 560, w = 100;
  return svg(p, 'Schematic: lumen pH is about 7.5 in weak light and 5.7 to 6 in strong light, not 4 to 5; the proton motive force is the sum of a voltage and a pH difference, and the voltage share varies from 10 to 70 percent', `
    <defs><linearGradient id="${p}-mix" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9d3f0"/><stop offset="1" stop-color="#c4d8ec"/></linearGradient></defs>
    ${text(170, 40, 'lumen pH in leaves', 'sm fl09-b')}
    <rect class="fl10-ruler" x="168" y="${yOf(8)}" width="26" height="${yOf(4) - yOf(8)}" rx="6"/>
    <rect class="fl10-myth" x="168" y="${yOf(5)}" width="26" height="${yOf(4) - yOf(5)}"/>
    ${ticks}
    <circle class="fl10-mark" cx="181" cy="${yOf(7.5)}" r="11"/>${text(214, yOf(7.5) + 8, 'weak light: ≈ 7.5', 'sm fl09-b', 'start')}
    <rect class="fl10-mark" x="171" y="${yOf(6)}" width="20" height="${yOf(5.7) - yOf(6)}" rx="6"/>${text(214, yOf(5.85) + 8, 'strong light: ≈ 5.7–6', 'sm fl09-b', 'start')}
    ${kPath(p, `M240,${yOf(7.5) + 24} L240,${yOf(6) - 18}`)}${text(252, yOf(6.8) + 8, 'more light,', 'fl09-it', 'start')}${text(252, yOf(6.8) + 32, 'more acidic', 'fl09-it', 'start')}
    ${cross(229, yOf(4.5))}${text(250, yOf(4.5) + 8, 'textbook 4–5', 'sm', 'start')}

    ${text(610, 40, 'proton motive force', 'sm fl09-b')}
    <rect class="fl10-dph" x="${x}" y="${top}" width="${w}" height="${h}" rx="10"/>
    <path class="fl10-dpsi-top" d="M${x},${top + h * 0.1} V${top + 10} Q${x},${top} ${x + 10},${top} H${x + w - 10} Q${x + w},${top} ${x + w},${top + 10} V${top + h * 0.1} Z"/>
    <rect x="${x}" y="${top + h * 0.1}" width="${w}" height="${h * 0.6}" fill="url(#${p}-mix)"/>
    <rect class="fl10-dph-line" x="${x}" y="${top}" width="${w}" height="${h}" rx="10"/>
    ${text(x + w / 2, top + 32, 'Δψ', 'sm fl09-b')}${text(x + w / 2, top + h - 40, 'ΔpH', 'lab fl09-b')}
    <path class="fl10-dim" d="M${x - 16},${top + h * 0.1} V${top + h * 0.7} M${x - 24},${top + h * 0.1} H${x - 8} M${x - 24},${top + h * 0.7} H${x - 8}"/>
    ${text(x + w + 18, top + 30, 'voltage', 'sm', 'start')}
    ${text(x - 30, top + h * 0.34, 'split varies:', 'fl09-it', 'end')}${text(x - 30, top + h * 0.34 + 26, 'Δψ is', 'sm fl09-b', 'end')}${text(x - 30, top + h * 0.34 + 52, '10–70 %', 'sm fl09-b', 'end')}
    <path class="fl10-cut" d="M${x},${top + h * 0.1} H${x + w} M${x},${top + h * 0.7} H${x + w}"/>
    ${text(x + w + 18, top + h - 48, 'pH', 'sm', 'start')}${text(x + w + 18, top + h - 22, 'difference', 'sm', 'start')}
    ${text(400, 586, 'schematic; values from leaves (Takizawa et al. 2007)', 'fl09-key')}
  `);
}

/* ---------- 10f · with and without: a sealed membrane holds the gradient, a leaky one loses it ---------- */

function sealedLeaky(): string {
  const p = 'fl10f';
  const half = (ox: number, leaky: boolean): string => {
    const mt = 250, mb = 310;
    const gaps = leaky ? [ox + 120, ox + 250] : [];
    const memb = leaky
      ? `${bilayer(`${p}${ox}`, ox, ox + 110, mt, mb)}${bilayer(`${p}${ox}b`, ox + 130, ox + 240, mt, mb)}${bilayer(`${p}${ox}c`, ox + 260, ox + 380, mt, mb)}`
      : bilayer(`${p}${ox}`, ox, ox + 380, mt, mb);
    const lumenH: [number, number][] = leaky
      ? [[ox + 60, 380], [ox + 200, 420]]
      : [[ox + 40, 360], [ox + 92, 400], [ox + 140, 356], [ox + 186, 410], [ox + 236, 366], [ox + 60, 450], [ox + 120, 470], [ox + 214, 460], [ox + 168, 520], [ox + 80, 520]];
    return `<rect class="fl09-lumen" x="${ox}" y="${mb}" width="380" height="${560 - mb}"/>${memb}
      ${cytb6f(ox + 60, 280, 30, 56, 'sm fl09-b')}${hion(ox + 60, 150)}${hPath(p, `M${ox + 60},168 L${ox + 60},218`, true)}${hPath(p, `M${ox + 60},338 L${ox + 60},350`, true)}
      ${atps(ox + 320, mt, mb, 22)}
      ${many(lumenH)}
      ${gaps.map(g => `${hPath(p, `M${g},360 L${g},206`, true)}`).join('')}
      ${leaky ? `${text(ox + 320, 120, 'no ATP', 'sm fl10-grey')}` : `${hPath(p, `M${ox + 320},440 L${ox + 320},340`)}${hPath(p, `M${ox + 344},186 L${ox + 362},150`, true)}${tag(ox + 316, 116, 'ATP', 'atp')}`}`;
  };
  return svg(p, 'Thought experiment: with a sealed membrane, pumped protons build up in the lumen and can only return through ATP synthase, which makes ATP; with a leaky membrane they leak straight back, no gradient builds and no ATP is made', `
    ${tick(26, 34)}${text(48, 42, 'Sealed membrane', 'lab fl09-b', 'start')}
    ${cross(436, 34)}${text(458, 42, 'Leaky membrane', 'lab fl09-b', 'start')}
    ${text(48, 82, 'H⁺ build up', 'sm', 'start')}
    ${text(458, 82, 'H⁺ leak back, no gradient', 'sm', 'start')}
    ${half(10, false)}${half(410, true)}
    <path class="fl10-split" d="M400,24 V560"/>
    ${text(400, 590, 'Thought experiment: the membrane must hold the gradient', 'sm')}
  `);
}

/* ---------- 10g · zoom: the Q cycle at cytochrome b₆f doubles the protons per electron ---------- */

function qCycle(): string {
  const p = 'fl10g';
  return svg(p, 'Zoom into cytochrome b6f: reduced plastoquinone releases two protons into the lumen at the Qo site; one electron goes on to plastocyanin, the other goes round through cytochrome b to the Qi site, where plastoquinone takes up protons from the stroma again; each electron sent on moves two protons', `
    <rect class="fl09-lumen" x="0" y="372" width="800" height="228"/>
    <rect class="fl10-memz" x="0" y="232" width="800" height="140"/>
    ${text(790, 36, 'stroma', 'fl09-note', 'end')}${text(790, 588, 'lumen', 'fl09-note', 'end')}

    <path class="blob-b6f" d="M360,186 Q470,160 580,186 Q640,210 636,300 Q632,404 560,420 Q470,436 380,420 Q308,404 304,300 Q300,210 360,186 Z"/>
    ${text(452, 216, 'cytochrome b₆f', 'sm fl09-b')}
    <circle class="fl10-site" cx="392" cy="352" r="26"/>${text(392, 360, 'Qo', 'sm fl09-b')}
    <circle class="fl10-site" cx="560" cy="250" r="26"/>${text(560, 258, 'Qi', 'sm fl09-b')}

    ${pq(170, 330, 52, 26, 'PQH₂')}${kPath(p, 'M224,334 L358,348')}
    ${text(170, 290, 'from PSII', 'fl09-it')}
    ${hPath(p, 'M380,380 L360,462', true)}${hPath(p, 'M406,380 L420,462', true)}${many([[352, 484], [428, 484]])}
    ${text(390, 540, '2 H⁺ into the lumen', 'sm fl09-b')}

    ${ePath(p, 'M416,368 Q470,450 560,474', 'thin')}${disc(586, 478, 22, 'PC')}${text(620, 486, 'to PSI', 'sm', 'start')}
    ${ePath(p, 'M410,330 Q460,280 534,258', 'thin')}${text(452, 252, 'e⁻ via', 'fl09-it', 'end')}${text(452, 276, 'cyt b', 'fl09-it', 'end')}

    ${hion(560, 100)}${hPath(p, 'M560,118 L560,216', true)}${text(584, 104, 'H⁺ from the stroma', 'sm', 'start')}
    ${pq(716, 300, 44, 22, 'PQH₂')}${kPath(p, 'M586,262 L676,292')}${text(716, 352, 're-formed', 'sm')}

    <rect class="fl10-card" x="16" y="440" width="250" height="110" rx="12"/><rect class="fl10-band" x="26" y="482" width="230" height="28"/>
    ${psys(64, 496, 44, 52, '', '', 6)}${cytb6f(140, 496, 13, 22, 'sm', '')}${psys(216, 496, 44, 52, '', '', 6)}
    ${text(64, 540, 'PSII', 'sm')}${text(216, 540, 'PSI', 'sm')}
    <rect class="fl09-zoom" x="118" y="466" width="44" height="60" rx="5"/><path class="fl09-zoomline" d="M118,466 L380,420 M162,466 L560,420"/>
    ${text(24, 100, '2 H⁺ moved per e⁻', 'sm fl09-b', 'start')}${text(24, 126, 'sent on to PC', 'sm', 'start')}
  `);
}

/* ---------- 10h · four frames of one thylakoid vesicle ---------- */

function vesicleFrames(): string {
  const p = 'fl10h';
  const caps: Record<number, [string, string]> = {
    1: ['H⁺ loaded into the lumen', ''],
    2: ['Lumen: low pH, + charge', ''],
    3: ['H⁺ flow out, rotor turns', ''],
    4: ['ATP made in the stroma', ''],
  };
  const frame = (k: number, ox: number, oy: number): string => {
    const cx = ox + 180, cy = oy + 172, r = 78;
    const inside: [number, number][] = k === 1 ? [[-24, 10], [10, -8]] : [[-44, -12], [-18, -36], [12, -26], [24, 4], [-34, 22], [-4, 8], [16, 36], [-12, 46]];
    const pump = `${cytb6f(cx - r, cy, 16, 26, 'sm', '')}`;
    const syn = `<g transform="rotate(90 ${cx + r} ${cy})">${atps(cx + r, cy - 6, cy + 2, 12)}</g>`;
    const inArrows = k <= 2 ? `${hPath(p, `M${cx - r - 46},${cy - 26} L${cx - r - 14},${cy - 6}`, true)}${miniBolt(cx - r - 34, cy - 66, 0.8)}` : '';
    const out = k >= 3 ? `${hPath(p, `M${cx + r - 30},${cy} L${cx + r - 14},${cy}`, true)}${hPath(p, `M${cx + r + 50},${cy - 12} L${cx + r + 70},${cy - 34}`, true)}` : '';
    const ch = k >= 2 ? `${text(cx + 52, cy - 32, '+', 'fl10-plus')}${text(cx - 46, cy + 56, '+', 'fl10-plus')}${text(cx + 50, cy + 38, '+', 'fl10-plus')}${text(cx - r - 22, cy + 62, '−', 'fl10-minus')}${text(cx + r + 20, cy + 70, '−', 'fl10-minus')}` : '';
    const atp = k === 4 ? `${tag(cx + r + 60, cy + 46, 'ATP', 'atp')}${tag(cx + r + 30, cy - 62, 'ATP', 'atp')}` : '';
    return `<rect class="fl09-cell" x="${ox}" y="${oy}" width="384" height="292" rx="16"/>${num(ox + 28, oy + 30, k)}
      ${text(ox + 54, oy + 38, caps[k][0], 'sm fl09-b', 'start')}
      <circle class="fl10-ves" cx="${cx}" cy="${cy}" r="${r}"/>${many(inside.map(([x, y]) => [cx + x, cy + y]), 11)}${pump}${syn}${inArrows}${out}${ch}${atp}`;
  };
  return svg(p, 'Four frames of one thylakoid vesicle: protons are loaded in, pile up and charge the inside, flow out through ATP synthase, and ATP is made outside in the stroma', `
    ${frame(1, 8, 2)}${frame(2, 408, 2)}${frame(3, 8, 306)}${frame(4, 408, 306)}
  `);
}

/* ---------- 10i · equation: downhill proton flow drives uphill ATP synthesis ---------- */

function atpEquation(): string {
  const p = 'fl10i';
  const box = (x: number, y: number, w: number, s: string, cls: string, tcls = 'lab fl09-b'): string =>
    `<rect class="${cls}" x="${x - w / 2}" y="${y - 24}" width="${w}" height="48" rx="12"/>${text(x, y + 9, s, tcls)}`;
  return svg(p, 'Equation view: light drives ATP and NADPH, which are used in CO2 fixation; ATP comes from coupling downhill proton flow, lumen to stroma, to uphill ADP plus phosphate to ATP in ATP synthase', `<g transform="translate(0 30)">
    ${box(90, 56, 110, 'light', 'fl09-term fl09-term-l')}${text(166, 66, '→', 'lab')}
    ${box(246, 56, 106, 'ATP', 'tag-atp')}${text(318, 66, '+', 'lab')}${box(400, 56, 130, 'NADPH', 'fl10-faded', 'lab fl10-grey')}
    ${text(496, 66, '→', 'lab')}${text(520, 66, 'CO₂ fixation', 'lab fl10-grey', 'start')}

    ${kPath(p, 'M60,560 V150', 'fl09-axis')}<text class="tl" transform="translate(40 360) rotate(-90)" text-anchor="middle">free energy</text>
    ${box(250, 190, 230, 'H⁺ in the lumen', 'fl10-hbox', 'sm fl09-b')}${box(250, 500, 230, 'H⁺ in the stroma', 'fl10-hbox', 'sm fl09-b')}
    <path class="fl10-down" d="M250,222 V458" marker-end="url(#${p}-h)"/>
    ${text(236, 330, 'downhill', 'fl09-it', 'end')}${text(236, 356, 'ΔpH + Δψ', 'sm', 'end')}
    ${box(600, 500, 200, 'ADP + Pᵢ', 'tag-atp', 'sm fl09-b')}${box(600, 190, 200, 'ATP + H₂O', 'tag-atp', 'sm fl09-b')}
    <path class="fl10-up" d="M600,468 V232" marker-end="url(#${p}-k)"/>
    ${text(620, 330, 'uphill', 'fl09-it', 'start')}${text(620, 356, 'needs energy', 'sm', 'start')}
    <circle class="fl10-gear" cx="410" cy="344" r="54"/>
    ${atps(410, 344, 372, 16)}
    <path class="fl10-couple" d="M262,344 H354 M466,344 H588"/>
    ${text(410, 436, 'ATP synthase', 'sm fl09-b')}${text(410, 462, 'couples the two', 'sm')}</g>
  `);
}

/* ---------- 10j · minimal: two ways in, one way out ---------- */

function twoInOneOut(): string {
  const p = 'fl10j';
  const big = (x: number, y: number): string => `<circle class="tag-h" cx="${x}" cy="${y}" r="20"/>${text(x, y + 7, 'H⁺', 'fl10-ht')}`;
  return svg(p, 'Minimal summary: protons enter the lumen two ways, from water splitting and through PQ and b6f; they leave one way, through ATP synthase, which makes ATP', `
    ${text(400, 52, 'Two ways in, one way out', 'lab fl09-b')}
    <rect class="fl09-lumen" x="0" y="330" width="800" height="270"/>
    <rect class="fl10-band" x="0" y="280" width="800" height="50"/>
    ${text(24, 110, 'stroma', 'fl09-note', 'start')}${text(790, 318, 'membrane', 'fl09-it', 'end')}${text(790, 588, 'lumen', 'fl09-note', 'end')}

    ${psys(150, 305, 96, 78, 'PSII', 'sm fl09-b', 10)}
    ${water(118, 420)}${kPath(p, 'M142,420 L168,420')}${big(194, 420)}
    ${text(150, 510, 'in: from water', 'lab fl09-b')}

    ${big(400, 150)}${hPath(p, 'M400,176 L400,392')}${big(400, 418)}
    ${cytb6f(400, 305, 26, 44, 'sm', '')}
    ${text(400, 510, 'in: via PQ + b₆f', 'lab fl09-b')}

    ${big(650, 440)}${hPath(p, 'M650,414 L650,346')}${atps(650, 280, 330, 30)}${hPath(p, 'M694,196 L724,160')}${big(740, 138)}
    ${tag(590, 130, 'ATP', 'atp')}${kPath(p, 'M626,176 L604,154')}
    ${text(650, 510, 'out: ATP synthase', 'lab fl09-b')}
    ${big(90, 566)}${big(290, 566)}${big(520, 566)}${big(600, 566)}
  `);
}

const DRAW: Record<string, () => string> = {
  a: protonMap, b: rotaryMotor, c: damTurbine, d: acidBath, e: lumenPh, f: sealedLeaky, g: qCycle, h: vesicleFrames, i: atpEquation, j: twoInOneOut,
};

export function draw(id: string): string {
  return (DRAW[id] ?? protonMap)();
}
