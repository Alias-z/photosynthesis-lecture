// Slide L11 · Electron routes make the system flexible. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Checked facts only (research/review-2026-10-23-claude/B_L07-L11.md, REVIEW_SUMMARY.md §4 #4, §6, §7 #3):
// linear flow ≈ 1.29 ATP per NADPH (at 14 H⁺ per 3 ATP; ≈ 1.5 at ≈ 4 H⁺ per ATP) against 1.5 for the Calvin cycle;
// cyclic flow and routes to O₂ pump H⁺ without net NADPH; malate export removes spare NADPH;
// cyclic ΔpH slows b₆f and protects PSI, which has no dedicated repair cycle and recovers slowly (consensus);
// its ATP role is debated (Degen 2026: PGR5- (and NDH-) deficient Arabidopsis, detached leaves, ≤ 400 µmol m⁻² s⁻¹, CO₂-saturated).
// One ink and one dash pattern per route in every variant: linear red, cyclic violet, to O₂ teal; protons blue dots.
import type { PlateText, Variant } from '../types';
import { text as t, wave } from '../mechanisms';
import { bilayer, bolt, illusHeads, molecule, tag, water } from '../illus';
import './l11.css';

export const PLATE: PlateText = {
  n: '11',
  title: 'Electron routes make the system flexible',
  status: 'draft',
  lead: 'Electrons can take several routes. Switching between them tunes the ATP-to-NADPH ratio and protects PSI.',
  points: [
    { claim: 'Linear flow alone is short of ATP.', text: 'It gives ≈ 1.29 ATP per NADPH; the Calvin–Benson cycle needs 1.5.' },
    { claim: 'Cyclic flow makes ATP only.', text: 'Electrons loop around PSI, pumping H⁺ but making no NADPH.' },
    { claim: 'Cyclic flow protects PSI.', text: 'Its ΔpH slows electron flow to PSI, which has no dedicated repair cycle.' },
  ],
  refs: [
    { label: 'Kramer & Evans 2011', url: 'https://doi.org/10.1104/pp.110.166652' },
    { label: 'Asada 1999', url: 'https://doi.org/10.1146/annurev.arplant.50.1.601' },
    { label: 'Suorsa et al. 2012', url: 'https://doi.org/10.1105/tpc.112.097162' },
    { label: 'Degen et al. 2026', url: 'https://doi.org/10.1038/s41477-026-02374-w' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Route map' },
  { id: 'b', name: 'Thylakoid', anim: true },
  { id: 'c', name: 'Two bars' },
  { id: 'd', name: 'Railway', anim: true },
  { id: 'e', name: 'Zoom to PSI' },
  { id: 'f', name: 'Calm vs jump', anim: true },
  { id: 'g', name: 'Four steps', anim: true },
  { id: 'h', name: 'Agreed vs debated', anim: true },
  { id: 'i', name: 'Equation terms' },
  { id: 'j', name: 'Three icons' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return thylakoid();
    case 'c': return twoBars();
    case 'd': return railway();
    case 'e': return zoomToPsi();
    case 'f': return calmVsJump();
    case 'g': return fourSteps();
    case 'h': return agreedDebated();
    case 'i': return equationTerms();
    case 'j': return threeIcons();
    default: return routeMap();
  }
}

/* ---------- shared parts ---------- */

type Rt = 'lin' | 'cyc' | 'oxy' | 'h' | 'k' | 'g';
const RTS: Rt[] = ['lin', 'cyc', 'oxy', 'h', 'k', 'g'];

/** Arrowheads: fixed-size heads for thin routes, and heads that scale with the stroke for bands. */
const marks = (p: string): string =>
  `<defs>${RTS.map(k => `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="15" markerHeight="15" markerUnits="userSpaceOnUse" orient="auto"><path class="fl11-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  ${(['lin', 'cyc', 'oxy', 'k'] as Rt[]).map(k => `<marker id="${p}-b${k}" viewBox="0 0 10 10" refX="4" refY="5" markerWidth="2.4" markerHeight="2.4" orient="auto"><path class="fl11-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fl11" viewBox="0 0 800 600" role="img" aria-label="${label}">${illusHeads(p)}${marks(p)}${body}</svg>`;

/** A thin route arrow in its ink and dash pattern. */
const rt = (p: string, k: Rt, d: string, head = true): string =>
  `<path class="fl11-r fl11-r-${k}" d="${d}"${head ? ` marker-end="url(#${p}-${k})"` : ''}/>`;

/** A solid band whose width shows how much flows; its head grows with it. */
const band = (p: string, k: 'lin' | 'cyc' | 'oxy' | 'k', d: string, w: number, head = true): string =>
  `<path class="fl11-band fl11-band-${k}" style="stroke-width:${w}px" d="${d}"${head ? ` marker-end="url(#${p}-b${k})"` : ''}/>`;

/** A proton: white ball, blue outline. */
const H = (x: number, y: number, r = 13): string =>
  `<circle class="tag-h" cx="${x}" cy="${y}" r="${r}"/>${t(x, y + 5, 'H⁺', 'fl11-ht')}`;

/** A photosystem: green core inside a lighter antenna. */
function psys(cx: number, cy: number, w: number, h: number, label = '', inset = 13): string {
  const r = Math.min(w, h) * 0.32;
  return `<rect class="fl11-ant" x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${r.toFixed(1)}"/>`
    + `<rect class="blob-ps" x="${cx - w / 2 + inset}" y="${cy - h / 2 + inset}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${Math.max(r - inset * 0.6, 6).toFixed(1)}"/>`
    + (label ? t(cx, cy + 9, label, 'fl11-b') : '');
}

const b6f = (cx: number, cy: number, rx: number, ry: number, cls = 'fl11-b'): string =>
  `<ellipse class="blob-b6f" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${t(cx, cy + (cls === 'fl11-b' ? 9 : 7), 'b₆f', cls)}`;
const pq = (cx: number, cy: number, rx = 20, ry = 13): string =>
  `<ellipse class="blob-pq" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${t(cx, cy + 6, 'PQ', 'fl11-s')}`;
const small = (cx: number, cy: number, r: number, s: string): string =>
  `<circle class="blob-small" cx="${cx}" cy="${cy}" r="${r}"/>${t(cx, cy + 7, s, 'fl11-in')}`;

/** ATP synthase: blue stalk through the membrane, purple head in the stroma. */
function atps(cx: number, top: number, bot: number, r = 20): string {
  const hy = top - r - 2;
  return `<rect class="blob-stalk" x="${cx - 14}" y="${top - 10}" width="28" height="${bot - top + 26}" rx="10"/>`
    + `<circle class="blob-atp" cx="${(cx - r * 0.75).toFixed(1)}" cy="${hy}" r="${r}"/><circle class="blob-atp" cx="${(cx + r * 0.75).toFixed(1)}" cy="${hy}" r="${r}"/>`
    + `<circle class="blob-atp" cx="${cx}" cy="${(top - r * 2.25).toFixed(1)}" r="${r}"/>`;
}

const num = (x: number, y: number, n: number): string =>
  `<circle class="fl11-num" cx="${x}" cy="${y}" r="15"/>${t(x, y + 6.5, `${n}`, 'fl11-nt')}`;

/** A short sample of a route line, for keys. */
const sample = (p: string, k: Rt, x: number, y: number, w = 44): string => rt(p, k, `M${x},${y} H${x + w}`, false);

/** A tick (yes) or a cross (no), so presence never rests on colour alone. */
const yes = (x: number, y: number): string => `<path class="fl11-tick-ok" d="M${x - 10},${y} l7,8 l14,-17"/>`;
const no = (x: number, y: number): string => `<path class="fl11-cross" d="M${x - 9},${y - 9} l18,18 M${x + 9},${y - 9} l-18,18"/>`;

/** A brake: two pads pressing on a part. */
const brake = (x: number, y: number, h: number, gap: number): string =>
  `<rect class="fl11-brake" x="${x - gap - 9}" y="${y - h / 2}" width="9" height="${h}" rx="3"/><rect class="fl11-brake" x="${x + gap}" y="${y - h / 2}" width="9" height="${h}" rx="3"/>`;

/* ---------- A · route map: three lines through the same stations ---------- */

function routeMap(): string {
  const p = 'fl11a', y = 262, o = 14, top = 122, r = 26;
  const X = { ps2: 140, pq: 228, b6f: 314, pc: 400, ps1: 486, fd: 572, fnr: 650 };
  const stop = (x: number, s: string): string =>
    `<rect class="fl11-stop" x="${x - 32}" y="${y - 30}" width="64" height="60" rx="22"/>${t(x, y + 8, s, 'fl11-in')}`;
  const oy = 400, bx = X.ps1 + 48;
  return svg(p, 'Route map of electron flow: the linear, cyclic and to-O₂ lines run through the same stations; only the linear line reaches NADPH, and all three pass cytochrome b6f', `
    ${band(p, 'oxy', `M78,${y + o} H${X.ps1 + 24} Q${bx},${y + o} ${bx},${y + o + 24} V${oy - 24} Q${bx},${oy} ${bx + 24},${oy} H590`, 9)}
    ${band(p, 'lin', `M78,${y} H674`, 9)}
    ${band(p, 'cyc', `M${X.pq},${y - o} H${X.fd}`, 9, false)}
    ${band(p, 'cyc', `M${X.fd},${y - o} V${top + r} A${r},${r} 0 0 0 ${X.fd - r},${top} H${X.pq + r} A${r},${r} 0 0 0 ${X.pq},${top + r} V${y - 48}`, 9)}
    ${stop(X.ps2, 'PSII')}${stop(X.pq, 'PQ')}${stop(X.b6f, 'b₆f')}${stop(X.pc, 'PC')}${stop(X.ps1, 'PSI')}${stop(X.fd, 'Fd')}${stop(X.fnr, 'FNR')}
    ${water(46, y - 2)}${t(46, y + 46, 'H₂O', 'fl11-l')}
    ${tag(742, y, 'NADPH', 'nadph')}
    ${bolt(p, 92, 122, 128, 224)}${t(86, 118, 'light', 'fl11-it', 'end')}
    ${bolt(p, 446, 158, 478, 224)}${t(440, 158, 'light', 'fl11-it', 'end')}

    ${t((X.pq + X.fd) / 2, top - 16, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}
    ${t(bx + 16, 352, 'to O₂', 'fl11-h fl11-c-oxy', 'start')}
    ${molecule(616, oy, 'OO', 12)}${rt(p, 'oxy', `M640,${oy} L668,${oy}`)}${water(696, oy - 4)}
    ${t(616, oy + 40, 'O₂', 'fl11-l')}${t(696, oy + 40, 'H₂O', 'fl11-l')}${t(656, oy + 66, 'no net O₂', 'fl11-s')}

    ${rt(p, 'h', `M${X.b6f},${y + 34} V${y + 74}`)}${H(X.b6f, y + 96)}
    ${t(X.b6f - 26, y + 104, 'H⁺ pumped on every route', 'fl11-l', 'end')}

    ${sample(p, 'lin', 30, 490)}${t(90, 497, 'linear', 'fl11-h fl11-c-lin', 'start')}${t(178, 497, 'NADPH and H⁺ gradient', 'fl11-l', 'start')}
    ${sample(p, 'cyc', 30, 534)}${t(90, 541, 'cyclic', 'fl11-h fl11-c-cyc', 'start')}${t(178, 541, 'H⁺ gradient only', 'fl11-l', 'start')}
    ${sample(p, 'oxy', 30, 578)}${t(90, 585, 'to O₂', 'fl11-h fl11-c-oxy', 'start')}${t(178, 585, 'H⁺ gradient only', 'fl11-l', 'start')}
  `);
}

/* ---------- B · one thylakoid, three routes (thesis style) ---------- */

function thylakoid(): string {
  const p = 'fl11b', mt = 262, mb = 342;
  return svg(p, 'Illustrated thylakoid membrane with three electron routes: linear flow from water to NADPH, cyclic flow from ferredoxin back to plastoquinone, and an outlet to oxygen; all pass cytochrome b6f, which pumps protons for ATP synthase', `
    <rect class="fl11-lumen" x="0" y="${mb}" width="800" height="${600 - mb}"/>
    ${bilayer(p, 0, 800, mt, mb)}
    ${psys(140, 302, 124, 168, 'PSII')}
    ${pq(236, 302)}
    ${b6f(316, 302, 32, 74)}
    ${small(398, 404, 20, 'PC')}
    ${psys(486, 302, 128, 168, 'PSI')}
    ${small(572, 170, 20, 'Fd')}
    ${atps(752, mt, mb)}
    ${tag(752, 150, 'ATP', 'atp')}${rt(p, 'k', 'M752,196 L752,176')}
    ${tag(656, 72, 'NADPH', 'nadph')}

    ${bolt(p, 64, 120, 106, 212)}${t(72, 104, 'light', 'fl11-it', 'start')}
    ${bolt(p, 440, 112, 474, 212)}${t(432, 108, 'light', 'fl11-it', 'end')}

    ${water(70, 470)}${t(70, 440, 'H₂O', 'fl11-s')}${rt(p, 'k', 'M70,490 L70,516')}${molecule(70, 540, 'OO', 11)}${t(70, 578, 'O₂', 'fl11-s')}
    ${rt(p, 'lin', 'M90,460 C104,440 112,420 116,394')}
    ${rt(p, 'lin', 'M190,302 L210,302')}${rt(p, 'lin', 'M258,302 L278,302')}
    ${rt(p, 'lin', 'M330,372 C340,398 356,406 372,406')}
    ${rt(p, 'lin', 'M418,398 C428,394 434,390 438,386')}
    ${rt(p, 'lin', 'M530,216 C538,202 544,194 550,188')}
    ${rt(p, 'lin', 'M584,152 C594,126 602,108 610,96')}
    ${t(622, 120, 'linear', 'fl11-h fl11-c-lin', 'start')}

    ${rt(p, 'cyc', 'M556,154 C480,8 296,24 242,282')}
    ${t(388, 34, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}

    ${rt(p, 'oxy', 'M548,236 L598,236')}${molecule(620, 236, 'OO', 11)}${rt(p, 'oxy', 'M642,236 L664,236')}${water(686, 232)}
    ${t(650, 206, 'to O₂', 'fl11-h fl11-c-oxy')}

    ${H(316, 190)}${rt(p, 'h', 'M316,206 L316,222')}${rt(p, 'h', 'M316,380 L316,418')}
    ${H(128, 452)}${H(214, 488)}${H(270, 520)}${H(330, 450)}${H(392, 506)}${H(470, 462)}${H(546, 500)}${H(616, 458)}
    ${rt(p, 'h', 'M210,560 H700 C735,560 752,540 752,505 V368')}
    ${t(20, 40, 'stroma', 'fl11-it', 'start')}${t(786, 590, 'lumen', 'fl11-it', 'end')}
  `);
}

/* ---------- C · the one numeric picture: ATP per NADPH, supplied vs needed ---------- */

function twoBars(): string {
  const p = 'fl11c', base = 440, k = 220, yOf = (v: number): number => base - v * k;
  const y129 = yOf(18 / 14), y15 = yOf(1.5);
  const ticks = [0, 0.5, 1, 1.5].map(v => `<path class="fl11-tick" d="M82,${yOf(v)} H90"/>${t(76, yOf(v) + 7, v === 0 ? '0' : v.toFixed(1), 'fl11-s', 'end')}`).join('');
  return svg(p, 'Two bars: linear flow supplies about 1.29 ATP per NADPH, the Calvin cycle needs 1.5; cyclic flow, electrons to O₂ and malate export close the gap', `
    <path class="fl11-axis" d="M90,${yOf(1.72)} V${base} H404"/>${ticks}
    <text class="fl11-l" transform="translate(30 ${(base + yOf(1.5)) / 2}) rotate(-90)" text-anchor="middle">ATP made per NADPH</text>
    <rect class="fl11-bar" x="118" y="${y129}" width="108" height="${base - y129}" rx="4"/>
    <rect class="fl11-gap" x="118" y="${y15}" width="108" height="${y129 - y15}" rx="4"/>
    <rect class="fl11-bar-need" x="280" y="${y15}" width="108" height="${base - y15}" rx="4"/>
    <path class="fl11-target" d="M90,${y15} H404"/>
    ${t(172, y129 + 42, '≈ 1.29', 'fl11-b')}${t(334, y15 + 42, '1.5', 'fl11-b')}
    ${t(172, y15 + 31, 'gap', 'fl11-l fl11-c-clay')}
    ${t(172, base + 34, 'linear flow', 'fl11-h')}${t(172, base + 60, 'supplies', 'fl11-l')}
    ${t(334, base + 34, 'Calvin–Benson', 'fl11-h')}${t(334, base + 60, 'cycle needs', 'fl11-l')}

    ${t(448, 112, 'Routes that close the gap', 'fl11-h', 'start')}
    <path class="fl11-guide" d="M434,140 V420"/>
    ${sample(p, 'cyc', 450, 172)}${t(506, 179, 'cyclic flow', 'fl11-h fl11-c-cyc', 'start')}${t(506, 206, 'H⁺ pumped, no NADPH', 'fl11-l', 'start')}
    ${sample(p, 'oxy', 450, 270)}${t(506, 277, 'electrons to O₂', 'fl11-h fl11-c-oxy', 'start')}${t(506, 304, 'H⁺ pumped, no NADPH', 'fl11-l', 'start')}
    ${sample(p, 'g', 450, 368)}${t(506, 375, 'malate export', 'fl11-h', 'start')}${t(506, 402, 'removes spare NADPH', 'fl11-l', 'start')}
    ${rt(p, 'k', `M434,142 C402,84 268,72 238,${y15 + 14}`)}

    ${t(400, 572, 'assumes 14 H⁺ per 3 ATP (c₁₄ ring); at ≈ 4 H⁺ per ATP the gap closes', 'fl11-s')}
  `);
}

/* ---------- D · analogy: a railway junction after PSI ---------- */

function railway(): string {
  const p = 'fl11d', y = 360, jx = 520;
  const main = `M40,${y} H${jx}`;
  const toEnd = `M${jx},${y} H712`;
  const loop = `M${jx},${y} C${jx + 60},${y} 610,${y - 30} 610,${y - 80} V210 C610,165 585,140 540,140 H300 C255,140 222,165 222,210 V${y - 60} C222,${y - 20} 240,${y} 280,${y}`;
  const siding = `M${jx},${y} C${jx + 60},${y} 598,${y + 40} 610,${y + 80} C620,${y + 120} 636,${y + 150} 690,${y + 150}`;
  const tracks: [string, string][] = [[main, 'k'], [toEnd, 'lin'], [loop, 'cyc'], [siding, 'oxy']];
  const wagon = (x: number, yy: number, k: string): string =>
    `<rect class="fl11-wagon fl11-wagon-${k}" x="${x - 23}" y="${yy - 25}" width="46" height="28" rx="7"/><circle class="fl11-wheel" cx="${x - 12}" cy="${yy + 5}" r="4.5"/><circle class="fl11-wheel" cx="${x + 12}" cy="${yy + 5}" r="4.5"/>${t(x, yy - 4, 'e⁻', `fl11-e${k === 'k' ? '' : ` fl11-c-${k}`}`)}`;
  return svg(p, 'Analogy: electrons as trains. After the PSI booster, points send each train to the NADPH terminal (linear flow), round a loop back through the b6f toll gate (cyclic flow), or into a siding to O2 (electrons to oxygen)', `
    ${tracks.map(([d]) => `<path class="fl11-sleep" d="${d}"/>`).join('')}
    ${tracks.map(([d]) => `<path class="fl11-rail" d="${d}"/>`).join('')}
    ${tracks.map(([d, k]) => `<path class="fl11-bed fl11-bed-${k}" d="${d}"/>`).join('')}

    <path class="fl11-shed-ps" d="M52,${y - 6} V${y - 46} L88,${y - 72} L124,${y - 46} V${y - 6}Z"/>${t(88, y - 22, 'PSII', 'fl11-in')}
    ${t(112, 262, 'depot', 'fl11-it', 'start')}
    ${bolt(p, 26, 160, 58, 284)}${t(30, 150, 'light', 'fl11-it', 'start')}
    ${water(88, 432)}${rt(p, 'k', `M88,412 L88,${y + 18}`)}${t(88, 476, 'water gives e⁻', 'fl11-s')}

    <rect class="fl11-shed-b6f" x="306" y="${y - 40}" width="48" height="80" rx="12"/>${t(330, y + 8, 'b₆f', 'fl11-in')}
    ${t(330, 266, 'toll gate', 'fl11-it')}${t(330, 292, 'b₆f pumps H⁺', 'fl11-h')}
    ${rt(p, 'h', `M330,${y + 44} L330,${y + 72}`)}${H(330, y + 92)}

    <rect class="fl11-shed-ps" x="404" y="${y - 40}" width="60" height="80" rx="14"/>${t(434, y + 8, 'PSI', 'fl11-in')}
    ${t(432, 222, 'booster', 'fl11-it')}${t(432, 248, 'PSI', 'fl11-h')}
    ${bolt(p, 500, 192, 462, 312)}${t(506, 196, 'light', 'fl11-it', 'start')}

    <path class="fl11-lever" d="M${jx},${y + 22} L${jx + 18},${y + 46}"/><circle class="fl11-wheel" cx="${jx + 18}" cy="${y + 48}" r="6"/>
    ${t(470, 448, 'points', 'fl11-it')}${t(470, 474, 'after PSI (Fd)', 'fl11-h')}

    <rect class="fl11-buffer" x="712" y="${y - 18}" width="12" height="36" rx="3"/>
    ${t(716, 244, 'terminal', 'fl11-it')}${tag(716, 290, 'NADPH', 'nadph')}${t(700, y + 50, 'linear', 'fl11-h fl11-c-lin')}

    ${t(416, 80, 'loop line', 'fl11-it')}${t(416, 108, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}

    <rect class="fl11-buffer" x="690" y="${y + 132}" width="12" height="36" rx="3"/>
    ${molecule(724, y + 150, 'OO', 11)}${rt(p, 'oxy', `M744,${y + 150} L758,${y + 150}`)}${water(776, y + 146)}
    ${t(690, 556, 'siding', 'fl11-it')}${t(690, 584, 'to O₂ → water', 'fl11-h fl11-c-oxy')}

    ${wagon(170, y, 'k')}${wagon(420, 140, 'cyc')}${wagon(640, y, 'lin')}${wagon(654, y + 150, 'oxy')}
  `);
}

/* ---------- E · zoom: leaf → chloroplast → thylakoid → the split just after PSI ---------- */

function zoomToPsi(): string {
  const p = 'fl11e', mt = 478, mb = 546;
  const stack = (x: number, y: number, n: number, w = 26): string =>
    Array.from({ length: n }, (_, i) => `<rect class="fl11-gran" x="${x - w / 2}" y="${y + i * 7}" width="${w}" height="5" rx="2"/>`).join('');
  const thylStack = Array.from({ length: 7 }, (_, i) => `<rect class="fl11-mem" x="470" y="${74 + i * 15}" width="96" height="10" rx="5"/>`).join('');
  const psiDot = (x: number): string => `<ellipse class="blob-ps" cx="${x}" cy="137" rx="15" ry="11"/>`;
  return svg(p, 'Zoom from a leaf to a chloroplast, its thylakoid membranes, and photosystem I, just after which electrons can go to NADPH, back to plastoquinone, or to oxygen', `
    <path class="fl11-leaf" d="M90,34 C152,62 164,150 90,206 C16,150 28,62 90,34Z"/>
    <path class="fl11-vein" d="M90,44 V200 M90,90 L62,70 M90,90 L118,70 M90,130 L56,108 M90,130 L124,108 M90,168 L62,148 M90,168 L118,148"/>
    <rect class="fl11-zoombox" x="100" y="112" width="20" height="20"/>
    <path class="fl11-guide" d="M120,112 L206,72 M120,132 L206,172"/>
    ${t(90, 232, 'leaf', 'fl11-l')}

    <ellipse class="fl11-chl" cx="306" cy="122" rx="100" ry="58"/>
    <path class="fl11-lam" d="M240,118 L282,108 M282,108 L330,128 M330,128 L372,104"/>
    ${stack(240, 104, 5)}${stack(282, 94, 5)}${stack(330, 114, 5)}${stack(372, 90, 5)}
    <rect class="fl11-zoombox" x="356" y="84" width="34" height="44"/>
    <path class="fl11-guide" d="M390,84 L450,40 M390,128 L450,204"/>
    ${t(306, 214, 'chloroplast', 'fl11-l')}

    <rect class="fl11-card" x="450" y="34" width="336" height="176" rx="14"/>
    ${thylStack}
    <rect class="fl11-mem" x="562" y="131" width="214" height="12" rx="6"/>
    ${psiDot(640)}${psiDot(700)}${psiDot(752)}
    ${t(518, 198, 'PSII: stacks', 'fl11-l')}${t(694, 112, 'PSI: unstacked', 'fl11-l')}
    <rect class="fl11-zoombox" x="732" y="119" width="40" height="36"/>
    <path class="fl11-guide" d="M732,155 L360,252 M772,155 L780,252"/>

    <rect class="fl11-card" x="20" y="252" width="760" height="338" rx="18"/>
    ${t(40, 288, 'Just after PSI, the routes split', 'fl11-h', 'start')}
    ${bilayer(p, 30, 770, mt, mb)}
    ${pq(112, 512)}${b6f(208, 512, 30, 50)}
    ${psys(430, 512, 120, 120, 'PSI')}
    ${rt(p, 'g', 'M134,512 L172,512')}${rt(p, 'g', 'M226,556 C252,574 276,576 296,574')}${small(316, 572, 15, '')}${t(316, 578, 'PC', 'fl11-s')}${rt(p, 'g', 'M332,570 C346,568 358,566 368,562')}
    ${small(548, 404, 20, 'Fd')}
    ${bolt(p, 304, 398, 362, 450)}${t(298, 414, 'light', 'fl11-it', 'end')}
    ${rt(p, 'lin', 'M478,452 C500,434 514,422 526,414')}
    ${rt(p, 'lin', 'M560,386 C588,344 616,322 644,314')}${tag(706, 312, 'NADPH', 'nadph')}${t(706, 356, 'linear', 'fl11-h fl11-c-lin')}
    ${rt(p, 'oxy', 'M570,410 L626,426')}${molecule(650, 430, 'OO', 11)}${rt(p, 'oxy', 'M672,430 L696,430')}${water(720, 426)}
    ${t(684, 400, 'to O₂', 'fl11-h fl11-c-oxy')}
    ${rt(p, 'cyc', 'M530,390 C440,330 190,330 116,494')}${t(318, 338, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}
    ${t(760, 572, 'lumen', 'fl11-it', 'end')}
  `);
}

/* ---------- F · before/after: the Calvin cycle keeps up vs light jumps ---------- */

function calmVsJump(): string {
  const p = 'fl11f';
  const panel = (y0: number, jump: boolean): string => {
    const y = y0 + 158;
    const w = jump ? { lin: 6, cyc: 15, oxy: 5 } : { lin: 16, cyc: 4, oxy: 3 };
    const nH = jump ? 8 : 2;
    const hs = Array.from({ length: nH }, (_, i) => H(58 + i * 29, y + 62 + (i % 2) * 14, 12)).join('');
    return `
      ${num(36, y0 + 34, jump ? 2 : 1)}${t(62, y0 + 42, jump ? 'Light jumps: NADP⁺ runs short' : 'Steady light: NADP⁺ available', 'fl11-h', 'start')}
      <rect class="fl11-lumen" x="30" y="${y + 40}" width="320" height="56" rx="10"/>${hs}${t(340, y + 86, 'lumen', 'fl11-it', 'end')}
      <rect class="blob-ps" x="40" y="${y - 24}" width="84" height="48" rx="20"/>${t(82, y + 8, 'PSII', 'fl11-in')}
      <rect class="blob-b6f" x="160" y="${y - 24}" width="80" height="48" rx="20"/>${t(200, y + 8, 'b₆f', 'fl11-in')}
      <rect class="blob-ps" x="276" y="${y - 24}" width="84" height="48" rx="20"/>${t(318, y + 8, 'PSI', 'fl11-in')}
      ${rt(p, 'k', `M126,${y} L154,${y}`)}${rt(p, 'k', `M242,${y} L270,${y}`)}
      ${jump ? `${brake(200, y, 40, 44)}${t(200, y + 128, 'acid lumen slows b₆f', 'fl11-l fl11-c-clay')}` : ''}
      ${band(p, 'lin', `M362,${y} H604`, w.lin)}${tag(670, y, 'NADPH', 'nadph')}${t(480, y - 16, 'linear', 'fl11-h fl11-c-lin')}
      ${band(p, 'cyc', `M346,${y - 26} C346,${y - 92} 206,${y - 92} 206,${y - 38}`, w.cyc)}${t(364, y - 62, 'cyclic', 'fl11-h fl11-c-cyc', 'start')}
      ${band(p, 'oxy', `M362,${y + 14} C420,${y + 14} 470,${y + 62} 560,${y + 70}`, w.oxy)}${molecule(592, y + 70, 'OO', 11)}${rt(p, 'oxy', `M614,${y + 70} L638,${y + 70}`)}${water(660, y + 66)}
      ${t(468, y + 96, 'to O₂', 'fl11-h fl11-c-oxy')}`;
  };
  return svg(p, 'The same chain in two states: when the Calvin cycle keeps up, most electrons take the linear route; after a light jump, more go round the cyclic loop, the lumen acidifies and b6f is slowed', `
    ${panel(4, false)}
    <path class="fl11-guide" d="M20,296 H780"/>
    ${panel(300, true)}
    ${t(790, 590, 'band width: share of electrons (qualitative)', 'fl11-s', 'end')}
  `);
}

/* ---------- G · step strip: how cyclic flow protects PSI after a light jump ---------- */

function fourSteps(): string {
  const p = 'fl11g';
  const card = (x0: number, y0: number, n: number, title: string, sub: string, body: string): string =>
    `<rect class="fl11-card" x="${x0}" y="${y0}" width="372" height="282" rx="16"/>${num(x0 + 30, y0 + 34, n)}
     ${t(x0 + 54, y0 + 42, title, 'fl11-h', 'start')}${sub ? t(x0 + 22, y0 + 74, sub, 'fl11-s', 'start') : ''}${body}`;
  const lumen = (x0: number, y0: number, n: number): string =>
    `<rect class="fl11-lumen" x="${x0 + 16}" y="${y0 + 224}" width="340" height="44" rx="10"/>`
    + Array.from({ length: n }, (_, i) => H(x0 + 40 + i * 34, y0 + 246 + (i % 2 ? 6 : -6), 11)).join('');
  const c1 = card(14, 14, 1, 'Light jumps', 'e⁻ pile up after PSI', `
    ${psys(120, 194, 104, 112, 'PSI')}
    ${bolt(p, 30, 108, 62, 156)}${bolt(p, 56, 102, 88, 146)}
    ${rt(p, 'lin', 'M176,166 L216,154')}
    ${t(240, 158, 'e⁻', 'fl11-e')}${t(266, 150, 'e⁻', 'fl11-e')}${t(292, 158, 'e⁻', 'fl11-e')}${t(266, 180, 'e⁻', 'fl11-e')}
    <rect class="fl11-off" x="226" y="210" width="104" height="34" rx="10"/>${t(278, 234, 'NADP⁺', 'fl11-in fl11-off')}${t(278, 270, 'used up', 'fl11-s')}`);
  const c2 = card(414, 14, 2, 'Cyclic flow pumps H⁺', '', `
    ${lumen(414, 14, 6)}
    ${b6f(510, 176, 30, 46)}${psys(660, 176, 100, 92, 'PSI')}
    ${rt(p, 'cyc', 'M676,128 C664,92 530,92 516,126')}
    ${rt(p, 'k', 'M546,176 L604,176')}
    ${rt(p, 'h', 'M510,224 L510,236')}`);
  const c3 = card(14, 310, 3, 'ΔpH slows flow to PSI', '', `
    ${lumen(14, 310, 9)}
    ${b6f(104, 470, 30, 44)}${brake(104, 470, 40, 34)}
    ${t(104, 404, 'b₆f slows', 'fl11-l')}
    <rect class="fl11-ant" x="212" y="452" width="134" height="64" rx="24"/>${t(279, 491, 'antenna', 'fl11-s')}
    <path class="fl11-heat" d="${wave(252, 448, 246, 414, 5, 3)}"/><path class="fl11-heat" d="${wave(306, 448, 312, 414, 5, 3)}"/>
    ${t(279, 398, 'heat (NPQ) starts', 'fl11-l')}`);
  const c4 = card(414, 310, 4, 'PSI stays safe', '', `
    <path class="fl11-shield" d="M612,402 L664,388 L716,402 V446 C716,482 690,504 664,514 C638,504 612,482 612,446Z"/>
    ${t(664, 460, 'PSI', 'fl11-b')}
    ${rt(p, 'lin', 'M446,452 L596,452')}${t(446, 436, 'fewer e⁻ arrive', 'fl11-s', 'start')}
    ${t(600, 552, '<tspan font-style="italic">pgr5</tspan> mutant: PSI damaged', 'fl11-s')}${t(600, 574, 'in fluctuating light', 'fl11-s')}`);
  return svg(p, 'Four steps: light jumps and electrons pile up after PSI; cyclic flow pumps protons; the acid lumen slows b6f and starts heat release; PSI, which has no dedicated repair cycle, stays safe', `${c1}${c2}${c3}${c4}`);
}

/* ---------- H · evidence: what is agreed and what is debated ---------- */

function agreedDebated(): string {
  const p = 'fl11h';
  const blocks = Array.from({ length: 6 }, (_, i) => `<rect class="${i % 2 ? 'fl11-hi' : 'fl11-lo'}" x="${70 + i * 52}" y="78" width="52" height="20"/>`).join('');
  const hatch = (x: number, y: number, w: number, h: number): string => {
    let s = `<rect class="fl11-bar-mut" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    for (let k = 10; k < w + h; k += 12) {
      const x0 = x + Math.max(0, k - h), y0 = y + Math.min(h, k), x1 = x + Math.min(w, k), y1 = y + Math.max(0, k - w);
      s += `<path class="fl11-hatch" d="M${x0},${y0} L${x1},${y1}"/>`;
    }
    return s + `<rect class="fl11-bar-mut" x="${x}" y="${y}" width="${w}" height="${h}" style="fill:none"/>`;
  };
  const by = 360;
  return svg(p, 'Evidence. Agreed: without PGR5, PSI is lost in fluctuating light, and PSI has no dedicated repair cycle (schematic after Suorsa 2012). Debated: PGR5- (and NDH-) deficient mutants have a smaller proton gradient but keep their chloroplast ATP level (schematic after Degen 2026; Arabidopsis, detached leaves, up to 400 µmol m⁻² s⁻¹, CO₂-saturated)', `<g transform="translate(0 34)">
    ${t(30, 46, 'Agreed: it protects PSI', 'fl11-h fl11-c-green', 'start')}
    ${blocks}${t(62, 95, 'light', 'fl11-s', 'end')}
    <path class="fl11-axis" d="M70,112 V${by} H382"/>
    <text class="fl11-l" transform="translate(44 ${(112 + by) / 2}) rotate(-90)" text-anchor="middle">PSI still working</text>
    <path class="fl11-wt" d="M72,140 H380"/>${t(380, 130, 'wild type', 'fl11-s', 'end')}
    <path class="fl11-mut" d="M72,146 H122 L174,182 H226 L278,218 H330 L380,254"/>${t(380, 284, '<tspan font-style="italic">pgr5</tspan> mutant', 'fl11-s fl11-c-clay', 'end')}
    ${t(226, by + 30, 'time in fluctuating light', 'fl11-l')}
    ${t(206, 470, 'schematic, after Suorsa et al. 2012', 'fl11-s')}

    <path class="fl11-guide" d="M400,30 V524"/>

    ${t(420, 46, 'Debated: is it needed for ATP?', 'fl11-h fl11-c-clay', 'start')}
    <path class="fl11-axis" d="M436,112 V${by} H780"/>
    <rect class="fl11-bar-wt" x="466" y="140" width="40" height="${by - 140}"/>${hatch(514, 220, 40, by - 220)}
    <rect class="fl11-bar-wt" x="644" y="160" width="40" height="${by - 160}"/>${hatch(692, 160, 40, by - 160)}
    ${t(548, 200, '50–75 %', 'fl11-s')}${t(688, 148, 'maintained', 'fl11-s')}
    ${t(510, by + 30, 'proton gradient', 'fl11-l')}${t(688, by + 30, 'ATP level', 'fl11-l')}
    <rect class="fl11-bar-wt" x="440" y="400" width="22" height="18"/>${t(472, 415, 'wild type', 'fl11-s', 'start')}
    ${hatch(440, 426, 22, 18)}${t(472, 441, 'PGR5- (and NDH-) deficient', 'fl11-s', 'start')}
    ${t(600, 470, 'schematic, after Degen et al. 2026:', 'fl11-s')}
    ${t(600, 494, 'Arabidopsis, detached leaves,', 'fl11-s')}
    ${t(600, 518, '≤ 400 µmol m⁻² s⁻¹, CO₂-saturated', 'fl11-s')}

</g>
  `);
}

/* ---------- I · equation-anchored: which terms each route lights up ---------- */

function equationTerms(): string {
  const p = 'fl11i';
  const C = { light: 252, h2o: 352, arrow: 428, o2: 504, nadph: 610, atp: 718 };
  const W: Record<string, number> = { light: 82, h2o: 74, o2: 66, nadph: 104, atp: 70 };
  const LABEL: Record<string, string> = { light: 'light', h2o: 'H₂O', o2: 'O₂', nadph: 'NADPH', atp: 'ATP' };
  const LIT: Record<string, string> = { light: 'fl11-lit-light', h2o: 'fl11-lit-water', o2: 'fl11-lit-water', nadph: 'tag-nadph', atp: 'tag-atp' };
  const chip = (k: keyof typeof C, y: number, state: 'on' | 'off' | 'cyc' | 'head'): string => {
    const w = W[k], x = C[k] - w / 2;
    const cls = state === 'off' ? 'fl11-off' : state === 'cyc' ? 'fl11-tint-oxy' : state === 'head' ? 'fl11-card' : LIT[k];
    return `<rect class="${cls}" x="${x}" y="${y - 21}" width="${w}" height="42" rx="12"/>${t(C[k], y + 8, LABEL[k], `fl11-in${state === 'off' ? ' fl11-off' : ''}`)}`;
  };
  const row = (y: number, name: string, k: Rt, s: Record<string, 'on' | 'off' | 'cyc'>, lightNote: string): string =>
    `${t(30, y - 4, name, `fl11-h fl11-c-${k}`, 'start')}${sample(p, k, 30, y + 22, 64)}
     ${(['light', 'h2o', 'o2', 'nadph', 'atp'] as (keyof typeof C)[]).map(c => chip(c, y, s[c])).join('')}
     ${t(C.arrow, y + 8, '→', 'fl11-b')}${t(C.light, y + 44, lightNote, 'fl11-s')}
     ${(['h2o', 'o2', 'nadph'] as (keyof typeof C)[]).filter(c => s[c] === 'off').map(c => t(C[c], y + 44, 'none', 'fl11-s')).join('')}`;
  return svg(p, 'The light-reaction equation written three times, once per route, with the terms each route produces lit: linear flow lights every term; cyclic flow lights only light and ATP; the route to O2 lights ATP while the water and O2 it touches cancel out', `
    ${(['light', 'h2o', 'o2', 'nadph', 'atp'] as (keyof typeof C)[]).map(c => chip(c, 76, 'head')).join('')}
    ${t(304, 84, '+', 'fl11-l')}${t(C.arrow, 84, '→', 'fl11-b')}${t(546, 84, '+', 'fl11-l')}${t(673, 84, '+', 'fl11-l')}
    ${t(30, 84, 'light reactions', 'fl11-it', 'start')}
    <path class="fl11-guide" d="M20,122 H780"/>
    ${row(194, 'linear', 'lin', { light: 'on', h2o: 'on', o2: 'on', nadph: 'on', atp: 'on' }, 'PSII + PSI')}
    ${row(318, 'cyclic', 'cyc', { light: 'on', h2o: 'off', o2: 'off', nadph: 'off', atp: 'on' }, 'PSI only')}
    ${row(442, 'to O₂', 'oxy', { light: 'on', h2o: 'cyc', o2: 'cyc', nadph: 'off', atp: 'on' }, 'PSII + PSI')}
    ${rt(p, 'oxy', `M${C.o2},464 C${C.o2 - 10},500 ${C.h2o + 10},500 ${C.h2o},468`)}${t(C.arrow, 520, 'O₂ is used again', 'fl11-s')}
    <path class="fl11-guide" d="M20,540 H780"/>
    ${t(400, 580, 'All pump H⁺; only linear makes NADPH', 'fl11-h')}
  `);
}

/* ---------- J · three icons ---------- */

function threeIcons(): string {
  const p = 'fl11j', iy = 166;
  const checks = (cx: number, nadph: boolean): string =>
    `${tag(cx - 34, 392, 'NADPH', 'nadph')}${nadph ? yes(cx + 54, 392) : no(cx + 54, 392)}${H(cx - 34, 444, 15)}${yes(cx + 54, 444)}`;
  return svg(p, 'Three icons: linear flow takes electrons from water to NADPH; cyclic flow circles around PSI; the route to O2 reduces O2 to water. All three pump protons; only linear flow makes NADPH. Cyclic flow protects PSI; its ATP role is debated', `<g transform="translate(0 16)">
    ${water(44, iy)}${rt(p, 'lin', `M66,${iy} L150,${iy}`)}${tag(204, iy, 'NADPH', 'nadph')}
    ${t(140, 286, 'Linear', 'fl11-b fl11-c-lin')}${t(140, 318, 'water → NADPH', 'fl11-l')}

    ${psys(400, iy, 104, 104, 'PSI', 12)}
    ${rt(p, 'cyc', `M478,${iy - 22} A82,82 0 1 1 458,${iy - 54}`)}
    ${t(400, 286, 'Cyclic', 'fl11-b fl11-c-cyc')}${t(400, 318, 'loops around PSI', 'fl11-l')}

    ${t(574, 102, 'e⁻', 'fl11-e', 'start')}${rt(p, 'oxy', `M596,110 C638,118 650,148 652,${iy - 22}`)}${molecule(660, iy, 'OO', 14)}
    ${rt(p, 'oxy', `M688,${iy} L716,${iy}`)}${water(744, iy - 4)}
    ${t(660, 286, 'To O₂', 'fl11-b fl11-c-oxy')}${t(660, 318, 'O₂ reduced to water', 'fl11-l')}

    <path class="fl11-guide" d="M270,70 V470 M530,70 V470"/>
    ${checks(140, true)}${checks(400, false)}${checks(660, false)}</g>

    <path class="fl11-guide" d="M20,494 H780"/>
    <path class="fl11-shield" d="M34,514 L76,502 L118,514 V548 C118,574 96,588 76,594 C56,588 34,574 34,548Z"/>${t(76, 558, 'PSI', 'fl11-in')}
    ${t(140, 540, 'protected by the cyclic-flow ΔpH', 'fl11-h', 'start')}
    ${t(140, 572, 'ATP role of cyclic flow: debated', 'fl11-l', 'start')}
  `);
}
