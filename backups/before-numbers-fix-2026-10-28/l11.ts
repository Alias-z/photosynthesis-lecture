// Slide L11 · Electron routes make the system flexible. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md and the
// approved plan research/figure-briefs/DRAFT_LOCATION_ROUTES.md §3 (26 Oct 2026). Checked facts only (sources re-read 26 Oct 2026):
// linear flow ≈ 1.3 ATP per NADPH (18/14 = 1.29) at 14 H⁺ per 3 ATP (c₁₄ ring) and a full Q cycle; the Calvin–Benson cycle needs 1.5
// (Kramer & Evans 2011). Cyclic flow pumps H⁺ and makes no NADPH; PGR5 is the main pathway in flowering plants, NDH (NADH
// dehydrogenase-like complex) the second; PGR5 protects PSI (Suorsa et al. 2012); whether C₃ leaves need cyclic flow for ATP is
// debated (Degen et al. 2026). To O₂: in flowering plants the water–water cycle (O₂ reduced to water at PSI via superoxide and H₂O₂;
// Asada 1999) carries < 10 % of electron flow (Badger et al. 2000), so the flowering-plant O₂ route is always drawn thin.
// Flavodiiron proteins (FLV) reduce O₂ straight to water with no reactive oxygen, act fast after a light increase and protect PSI
// in fluctuating light; they work in cyanobacteria, green algae, mosses and all non-flowering plant groups up to conifers and were
// lost in flowering plants (Ilík et al. 2017); put back into Arabidopsis (Yamamoto et al. 2016), rice (Wada et al. 2018) and
// tobacco (Rizzetto et al. 2025), they protect PSI in fluctuating light. Spare NADPH leaves the chloroplast as malate (one arrow).
// The older variants a, c, e–j (kept, not listed) also use: the ≈ 4.0 H⁺ per ATP of Turina et al. 2016 is a thermodynamic
// ratio, not the H⁺ that pass per ATP; an acid lumen slows b₆f and PSI has no fast repair cycle (Suorsa 2012, Degen 2023);
// whether PGR5 acts through cyclic flow or by braking ATP synthase is open (Degen 2026; Nikkanen 2026); PGR5- (and NDH-)
// deficient Arabidopsis keep their ATP level (Degen 2026: detached leaves, ≤ 400 µmol m⁻² s⁻¹, CO₂-saturated).
// Variants k–o (FLV round): k thylakoid + family strip, l railway with the FLV track removed and a malate exit, m pipes,
// n moss vs flowering plant, o the gap and three ways to close it. In m and n, "after a light increase" qualifies the wide
// FLV outlet (FLV act fast after a light increase); m's main network is a flowering plant. o's "large with FLV": in
// Chlamydomonas FLV drive most electron flow during the induction of photosynthesis (Chaux et al. 2017).
// One ink and one dash pattern per route in every variant: linear red, cyclic violet, to O₂ teal. Protons are the deck's
// ringed H⁺ (white disc, red ring and letters) on red dotted paths (glyph standard, lecturer 28 Oct 2026).
// A wider stroke of the same pattern (class fl11-w) or a wider pipe means a larger share of electrons (qualitative).
import type { PlateText, Variant } from '../types';
import { text as t, wave } from '../mechanisms';
import { bilayer, bolt, illusHeads, molecule, tag, water } from '../illus';
import './l11.css';

export const PLATE: PlateText = {
  n: '11',
  title: 'Electron routes make the system flexible',
  status: 'draft',
  lead: 'After PSI, electrons go to NADPH (linear), back to PQ (cyclic) or to O₂; the mix sets how many H⁺ are pumped per NADPH and keeps PSI safe.',
  points: [
    { claim: 'Linear flow alone is short of ATP.', text: '≈ 1.3 ATP per NADPH (14 H⁺ per 3 ATP)<br>The Calvin–Benson cycle needs 1.5' },
    { claim: 'Cyclic flow adds H⁺, not NADPH.', text: 'PGR5 (main) and NDH return electrons to PQ<br>PGR5 protects PSI; whether C₃ leaves need cyclic flow for ATP is debated' },
    { claim: 'Flowering plants lost the fast O₂ outlet.', text: 'Cyanobacteria to conifers pass surplus electrons to O₂ with flavodiiron proteins (FLV)<br>In flowering plants the water–water cycle takes &lt; 10 % of electrons' },
  ],
  refs: [
    { label: 'Kramer & Evans 2011', url: 'https://doi.org/10.1104/pp.110.166652' },
    { label: 'Badger et al. 2000', url: 'https://doi.org/10.1098/rstb.2000.0704' },
    { label: 'Ilík et al. 2017', url: 'https://doi.org/10.1111/nph.14536' },
    { label: 'Suorsa et al. 2012', url: 'https://doi.org/10.1105/tpc.112.097162' },
    { label: 'Degen et al. 2026', url: 'https://doi.org/10.1038/s41477-026-02374-w' },
  ],
};

/** The picks (b, d) first, then the five variants of the FLV round (k–o). The older variants stay drawable by id through draw(). */
export const VARIANTS: Variant[] = [
  { id: 'b', name: 'Thylakoid', anim: true },
  { id: 'd', name: 'Railway', anim: true },
  { id: 'k', name: 'Thylakoid + family tree' },
  { id: 'l', name: 'Railway, two eras' },
  { id: 'm', name: 'Three outlets as pipes' },
  { id: 'n', name: 'Moss vs flowering plant' },
  { id: 'o', name: 'Gap and outlets' },
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
    case 'k': return thylakoidTree();
    case 'l': return railwayEras();
    case 'm': return pipes();
    case 'n': return mossVsFlowering();
    case 'o': return gapOutlets();
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

/** A proton: the deck's ringed H⁺, a white disc ringed red with red letters. */
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
    ${sample(p, 'oxy', 30, 578)}${t(90, 585, 'to O₂', 'fl11-h fl11-c-oxy', 'start')}${t(178, 585, 'H⁺ gradient only; small in flowering plants', 'fl11-l', 'start')}
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
    ${t(650, 194, 'to O₂', 'fl11-h fl11-c-oxy')}${t(712, 216, 'small in flowering plants', 'fl11-xs', 'end')}

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
  return svg(p, 'Two bars: linear flow supplies about 1.29 ATP per NADPH, the Calvin cycle needs 1.5; cyclic flow, electrons to O₂ (small in flowering plants) and malate export close the gap', `
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
    ${sample(p, 'oxy', 450, 270)}${t(506, 277, 'electrons to O₂', 'fl11-h fl11-c-oxy', 'start')}${t(506, 304, 'H⁺ pumped, no NADPH', 'fl11-l', 'start')}${t(506, 331, 'small in flowering plants', 'fl11-l', 'start')}
    ${sample(p, 'g', 450, 368)}${t(506, 375, 'malate export', 'fl11-h', 'start')}${t(506, 402, 'removes spare NADPH', 'fl11-l', 'start')}
    ${rt(p, 'k', `M434,142 C402,84 268,72 238,${y15 + 14}`)}

    ${t(400, 572, 'assumes 14 H⁺ per 3 ATP (c₁₄ ring) and a full Q cycle', 'fl11-s')}
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
    ${t(690, 547, 'siding', 'fl11-it')}${t(690, 571, 'to O₂ → water', 'fl11-h fl11-c-oxy')}${t(690, 593, 'small in flowering plants', 'fl11-xs')}

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
    ${t(684, 400, 'to O₂', 'fl11-h fl11-c-oxy')}${t(684, 466, 'small in flowering plants', 'fl11-xs')}
    ${rt(p, 'cyc', 'M530,390 C440,330 190,330 116,494')}${t(318, 338, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}
    ${t(760, 572, 'lumen', 'fl11-it', 'end')}
  `);
}

/* ---------- F · before/after: the Calvin cycle keeps up vs light jumps ---------- */

function calmVsJump(): string {
  const p = 'fl11f';
  const panel = (y0: number, jump: boolean): string => {
    const y = y0 + 158;
    const w = jump ? { lin: 6, cyc: 15, oxy: 2 } : { lin: 16, cyc: 4, oxy: 2 };
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
      ${t(468, y + 96, 'to O₂', 'fl11-h fl11-c-oxy')}${t(504, y + 96, 'small in flowering plants', 'fl11-xs', 'start')}`;
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
    ${t(30, 46, 'Agreed: PGR5 protects PSI', 'fl11-h fl11-c-green', 'start')}
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
    ${row(442, 'to O₂', 'oxy', { light: 'on', h2o: 'cyc', o2: 'cyc', nadph: 'off', atp: 'on' }, 'PSII + PSI')}${t(30, 494, 'small in', 'fl11-xs', 'start')}${t(30, 514, 'flowering plants', 'fl11-xs', 'start')}
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
  return svg(p, 'Three icons: linear flow takes electrons from water to NADPH; cyclic flow circles around PSI; the route to O2 reduces O2 to water. All three pump protons; only linear flow makes NADPH. An acid lumen, which needs PGR5, protects PSI; the ATP role of cyclic flow is debated', `<g transform="translate(0 16)">
    ${water(44, iy)}${rt(p, 'lin', `M66,${iy} L150,${iy}`)}${tag(204, iy, 'NADPH', 'nadph')}
    ${t(140, 286, 'Linear', 'fl11-b fl11-c-lin')}${t(140, 318, 'water → NADPH', 'fl11-l')}

    ${psys(400, iy, 104, 104, 'PSI', 12)}
    ${rt(p, 'cyc', `M478,${iy - 22} A82,82 0 1 1 458,${iy - 54}`)}
    ${t(400, 286, 'Cyclic', 'fl11-b fl11-c-cyc')}${t(400, 318, 'loops around PSI', 'fl11-l')}

    ${t(574, 102, 'e⁻', 'fl11-e', 'start')}${rt(p, 'oxy', `M596,110 C638,118 650,148 652,${iy - 22}`)}${molecule(660, iy, 'OO', 14)}
    ${rt(p, 'oxy', `M688,${iy} L716,${iy}`)}${water(744, iy - 4)}
    ${t(660, 286, 'To O₂', 'fl11-b fl11-c-oxy')}${t(660, 318, 'O₂ reduced to water', 'fl11-l')}${t(660, 344, 'small in flowering plants', 'fl11-xs')}

    <path class="fl11-guide" d="M270,70 V470 M530,70 V470"/>
    ${checks(140, true)}${checks(400, false)}${checks(660, false)}</g>

    <path class="fl11-guide" d="M20,494 H780"/>
    <path class="fl11-shield" d="M34,514 L76,502 L118,514 V548 C118,574 96,588 76,594 C56,588 34,574 34,548Z"/>${t(76, 558, 'PSI', 'fl11-in')}
    ${t(140, 540, 'protected by an acid lumen (needs PGR5)', 'fl11-h', 'start')}
    ${t(140, 572, 'ATP role of cyclic flow: debated', 'fl11-l', 'start')}
  `);
}

/* ---------- parts for the FLV round (k–o) ---------- */

/** A wider stroke of a route's own pattern: a larger share of electrons (qualitative); its head grows with it. */
const rtw = (p: string, k: 'cyc' | 'oxy', d: string, head = true): string =>
  `<path class="fl11-r fl11-r-${k} fl11-w" d="${d}"${head ? ` marker-end="url(#${p}-b${k})"` : ''}/>`;

/** A shield (protection), drawn around a part. */
const shield = (cx: number, top: number, w: number, h: number): string => {
  const x0 = cx - w / 2, x1 = cx + w / 2, s = h / 92;
  return `<path class="fl11-shield" d="M${x0},${top + 12 * s} L${cx},${top} L${x1},${top + 12 * s} V${top + 46 * s} C${x1},${top + 72 * s} ${cx + w * 0.26},${top + 86 * s} ${cx},${top + h} C${cx - w * 0.26},${top + 86 * s} ${x0},${top + 72 * s} ${x0},${top + 46 * s}Z"/>`;
};

/** A small rounded chip for a complex. */
const chipBox = (cx: number, cy: number, w: number, h: number, s: string, cls = 'blob-ps'): string =>
  `<rect class="${cls}" x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${Math.min(14, h / 2)}"/>${t(cx, cy + 7.5, s, 'fl11-in')}`;

/* ---------- K · the picked thylakoid (b), compacted, above a family strip: who keeps the fast O₂ outlet ---------- */

function thylakoidTree(): string {
  const p = 'fl11k', mt = 164, mb = 224, my = 194, lb = 364;
  const top = `
    <rect class="fl11-lumen" x="0" y="${mb}" width="800" height="${lb - mb}"/>
    ${bilayer(p, 0, 800, mt, mb)}
    ${psys(140, my, 112, 120, 'PSII')}
    ${pq(236, my)}
    ${b6f(316, my, 30, 54)}
    ${small(398, 284, 20, 'PC')}
    ${psys(486, my, 116, 120, 'PSI')}
    ${small(572, 96, 20, 'Fd')}
    ${atps(752, mt, mb)}
    ${tag(752, 56, 'ATP', 'atp')}${rt(p, 'k', 'M752,96 L752,80')}
    ${tag(656, 32, 'NADPH', 'nadph')}

    ${bolt(p, 64, 52, 104, 128)}${t(72, 40, 'light', 'fl11-it', 'start')}
    ${bolt(p, 452, 70, 474, 126)}${t(444, 92, 'light', 'fl11-it', 'end')}

    ${molecule(48, 300, 'OO', 11)}${rt(p, 'k', 'M112,300 L84,300')}${water(132, 296)}
    ${t(48, 340, 'O₂', 'fl11-s')}${t(132, 340, 'H₂O', 'fl11-s')}
    ${rt(p, 'lin', 'M134,282 L134,266')}
    ${rt(p, 'lin', 'M186,194 L210,194')}${rt(p, 'lin', 'M258,194 L278,194')}
    ${rt(p, 'lin', 'M328,250 C336,270 352,282 372,284')}
    ${rt(p, 'lin', 'M418,276 C426,272 432,266 436,262')}
    ${rt(p, 'lin', 'M530,132 C536,122 542,116 550,112')}
    ${rt(p, 'lin', 'M584,80 C592,68 600,60 606,56')}
    ${t(622, 84, 'linear', 'fl11-h fl11-c-lin', 'start')}

    ${rt(p, 'cyc', 'M558,82 C490,16 300,24 244,176')}
    ${t(400, 26, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}

    ${rt(p, 'oxy', 'M548,146 L596,146')}${molecule(618, 146, 'OO', 11)}${rt(p, 'oxy', 'M640,146 L660,146')}${water(684, 142)}
    ${t(650, 116, 'to O₂', 'fl11-h fl11-c-oxy')}

    ${H(346, 112)}${rt(p, 'h', 'M340,127 L330,138')}${rt(p, 'h', 'M316,252 L316,270')}
    ${H(316, 290)}${H(214, 302)}${H(258, 326)}${H(470, 314)}${H(540, 296)}${H(612, 326)}${H(676, 292)}
    ${rt(p, 'h', 'M200,350 H700 C735,350 752,336 752,306 V262')}
    ${t(20, 150, 'stroma', 'fl11-it', 'start')}${t(20, 252, 'lumen', 'fl11-it', 'start')}`;

  // the strip: who has FLV
  const sy = 464, lx = 47;
  const strip = `
    ${t(20, 406, 'cyanobacteria → green algae → mosses → conifers', 'fl11-l', 'start')}
    ${t(686, 406, 'flowering plants', 'fl11-l')}
    <path class="fl11-guide" d="M576,384 V594"/>
    ${chipBox(82 + lx, sy, 72, 44, 'PSI')}
    ${rtw(p, 'oxy', `M${124 + lx},${sy} L${300 + lx},${sy}`)}
    ${t(196 + lx, sy - 18, 'FLV', 'fl11-h fl11-c-oxy')}${yes(248 + lx, sy - 26)}
    ${molecule(334 + lx, sy, 'OO', 11)}${rtw(p, 'oxy', `M${358 + lx},${sy} L${386 + lx},${sy}`)}${water(418 + lx, sy - 4)}
    ${t(212 + lx, sy + 40, 'flavodiiron proteins', 'fl11-s')}

    ${shield(618, sy - 36, 64, 74)}${t(618, sy + 8, 'PSI', 'fl11-in')}
    ${rt(p, 'oxy', `M656,${sy} L690,${sy}`)}${molecule(716, sy, 'OO', 11)}${rt(p, 'oxy', `M738,${sy} L750,${sy}`)}${water(772, sy - 4)}
    ${t(618, sy + 62, 'PGR5', 'fl11-h fl11-c-green')}
    ${t(700, sy - 28, 'FLV', 'fl11-h fl11-off')}${no(738, sy - 36)}
    ${t(722, sy + 38, 'water–water cycle', 'fl11-xs')}

    ${t(20, 548, 'PGR5: proton gradient regulation 5', 'fl11-key', 'start')}
    ${t(20, 570, 'after Asada 1999; Ilík et al. 2017;', 'fl11-key', 'start')}
    ${t(20, 592, 'Yamamoto et al. 2016; Wada et al. 2018; Rizzetto et al. 2025', 'fl11-key', 'start')}
    <rect class="fl11-card" x="584" y="546" width="210" height="50" rx="10"/>
    ${t(689, 566, 'put back: Arabidopsis 2016', 'fl11-key')}${t(689, 587, 'rice 2018 · tobacco 2025', 'fl11-key')}`;

  return svg(p, 'Top: the thylakoid with its three electron routes after PSI (linear to NADPH, cyclic back to PQ, a thin route to O2). Bottom: cyanobacteria, green algae, mosses and conifers pass surplus electrons to O2 through flavodiiron proteins (FLV); flowering plants lost FLV, keep only the thin water–water cycle and rely on PGR5 to protect PSI; FLV was put back into Arabidopsis (2016), rice (2018) and tobacco (2025)', top + strip);
}

/* ---------- L · the picked railway (d), two eras: the FLV track removed, a narrow water–water siding, a malate exit ---------- */

function railwayEras(): string {
  const p = 'fl11l', y = 330, jx = 520;
  const main = `M40,${y} H${jx}`;
  const toEnd = `M${jx},${y} H712`;
  const loop = `M${jx},${y} C${jx + 56},${y} 600,${y - 30} 600,${y - 80} V170 C600,130 578,110 536,110 H300 C255,110 222,135 222,180 V${y - 60} C222,${y - 20} 240,${y} 280,${y}`;
  const ny = 440, fy = 556;
  const narrow = `M${jx},${y} C${jx + 70},${y} 606,${y + 42} 614,${y + 74} C622,${ny - 16} 644,${ny} 690,${ny}`;
  const flv = `M${jx},${y} C${jx + 28},${y} 552,${y + 50} 552,${y + 100} V${fy - 56} C552,${fy - 20} 572,${fy} 608,${fy} H690`;
  const tracks: [string, string][] = [[main, 'k'], [toEnd, 'lin'], [loop, 'cyc']];
  const wagon = (x: number, yy: number, k: string): string =>
    `<rect class="fl11-wagon fl11-wagon-${k}" x="${x - 23}" y="${yy - 25}" width="46" height="28" rx="7"/><circle class="fl11-wheel" cx="${x - 12}" cy="${yy + 5}" r="4.5"/><circle class="fl11-wheel" cx="${x + 12}" cy="${yy + 5}" r="4.5"/>${t(x, yy - 4, 'e⁻', `fl11-e${k === 'k' ? '' : ` fl11-c-${k}`}`)}`;
  return svg(p, 'Analogy: electrons as trains. After the PSI booster, points send each train to the NADPH terminal (linear flow), round a loop back through the b6f toll gate (cyclic flow), or into a narrow siding to O2 (the water–water cycle). A wider track for flavodiiron proteins (FLV) lies dismantled: flowering plants lost it. Spare NADPH leaves the terminal as malate', `
    <path class="fl11-sleep fl11-sleep-x" d="${flv}"/>
    <rect class="fl11-loose" x="708" y="548" width="80" height="6" rx="2" transform="rotate(-3 748 551)"/>
    <rect class="fl11-loose" x="704" y="564" width="80" height="6" rx="2" transform="rotate(2 744 567)"/>
    <path class="fl11-sleep fl11-thin" d="${narrow}"/><path class="fl11-rail fl11-thin" d="${narrow}"/><path class="fl11-bed fl11-bed-oxy fl11-thin" d="${narrow}"/>
    ${tracks.map(([d]) => `<path class="fl11-sleep" d="${d}"/>`).join('')}
    ${tracks.map(([d]) => `<path class="fl11-rail" d="${d}"/>`).join('')}
    ${tracks.map(([d, k]) => `<path class="fl11-bed fl11-bed-${k}" d="${d}"/>`).join('')}

    <path class="fl11-shed-ps" d="M52,${y - 6} V${y - 46} L88,${y - 72} L124,${y - 46} V${y - 6}Z"/>${t(88, y - 22, 'PSII', 'fl11-in')}
    ${t(112, 232, 'depot', 'fl11-it', 'start')}
    ${bolt(p, 26, 130, 58, 254)}${t(30, 120, 'light', 'fl11-it', 'start')}
    ${water(88, 448)}${rt(p, 'k', `M88,428 L88,${y + 18}`)}${t(88, 492, 'water gives e⁻', 'fl11-s')}

    <rect class="fl11-shed-b6f" x="306" y="${y - 40}" width="48" height="80" rx="12"/>${t(330, y + 8, 'b₆f', 'fl11-in')}
    ${t(330, 236, 'toll gate', 'fl11-it')}${t(330, 262, 'b₆f pumps H⁺', 'fl11-h')}
    ${rt(p, 'h', `M330,${y + 44} L330,${y + 96}`)}${H(330, y + 116)}

    <rect class="fl11-shed-ps" x="404" y="${y - 40}" width="60" height="80" rx="14"/>${t(434, y + 8, 'PSI', 'fl11-in')}
    ${t(432, 192, 'booster', 'fl11-it')}${t(432, 218, 'PSI', 'fl11-h')}
    ${bolt(p, 500, 162, 462, 282)}${t(506, 166, 'light', 'fl11-it', 'start')}

    <path class="fl11-lever" d="M${jx - 12},${y + 22} L${jx - 28},${y + 46}"/><circle class="fl11-wheel" cx="${jx - 28}" cy="${y + 48}" r="6"/>
    ${t(444, 412, 'points', 'fl11-it')}${t(444, 438, 'after PSI (Fd)', 'fl11-h')}

    <rect class="fl11-buffer" x="712" y="${y - 18}" width="12" height="36" rx="3"/>
    ${tag(716, 262, 'NADPH', 'nadph')}${t(716, 376, 'terminal', 'fl11-it')}${t(716, 402, 'linear', 'fl11-h fl11-c-lin')}
    ${rt(p, 'g', 'M716,244 L716,176')}
    ${t(712, 98, 'freight exit', 'fl11-it')}${t(712, 128, 'spare NADPH', 'fl11-l')}${t(712, 154, 'leaves as malate', 'fl11-l')}

    ${t(416, 50, 'loop line', 'fl11-it')}${t(416, 78, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}

    <rect class="fl11-buffer" x="690" y="${ny - 18}" width="12" height="36" rx="3"/>
    ${molecule(724, ny, 'OO', 11)}${rt(p, 'oxy', `M744,${ny} L758,${ny}`)}${water(776, ny - 4)}
    ${t(794, 486, 'narrow siding', 'fl11-it', 'end')}${t(794, 512, 'water–water cycle', 'fl11-h fl11-c-oxy', 'end')}
    ${t(520, 500, 'rails removed', 'fl11-it', 'end')}${t(520, 526, 'FLV track', 'fl11-h fl11-c-oxy', 'end')}${t(520, 548, 'lost in flowering plants', 'fl11-xs', 'end')}
    ${t(20, 592, 'FLV: flavodiiron proteins · after Asada 1999; Ilík et al. 2017', 'fl11-key', 'start')}

    ${wagon(170, y, 'k')}${wagon(420, 110, 'cyc')}${wagon(640, y, 'lin')}${wagon(650, ny, 'oxy')}
  `);
}

/* ---------- M · pipes: PSI as a junction, pipe width = share of electrons ---------- */

function pipes(): string {
  const p = 'fl11m';
  const pipe = (k: 'lin' | 'cyc' | 'oxy' | 'k', d: string, w: number): string =>
    `<path class="fl11-pw fl11-pw-${k}" style="stroke-width:${w + 5}px" d="${d}"/><path class="fl11-pi fl11-pi-${k}" style="stroke-width:${w}px" d="${d}"/>`;
  /** A flow head at a pipe's end, in the route's ink. */
  const head = (k: 'lin' | 'cyc' | 'oxy' | 'k', x: number, y: number, ang: number, s: number): string =>
    `<path class="fl11-fill-${k}" transform="translate(${x} ${y}) rotate(${ang}) scale(${s})" d="M-6,-8 L6,0 L-6,8Z"/>`;
  const valve = (x: number, y: number): string =>
    `<path class="fl11-valve-h" d="M${x},${y} V${y - 22} M${x - 9},${y - 22} H${x + 9}"/><path class="fl11-valve" d="M${x - 13},${y - 11} L${x + 13},${y + 11} V${y - 11} L${x - 13},${y + 11}Z"/>`;
  const W = { lin: 30, pgr: 12, ndh: 5, oxy: 5 };
  const my = 300;
  return svg(p, 'PSI drawn as a junction with three outlet pipes whose widths show the share of electrons (qualitative): a wide pipe to NADPH, a medium cyclic pipe back to PQ through the PGR5 (main) and NDH valves, and a narrow pipe to O2 (water–water cycle). Inset: in a moss after a light increase the O2 pipe is wide, through flavodiiron proteins (FLV)', `
    ${pipe('k', `M94,${my} H150`, W.lin + W.oxy)}
    ${pipe('k', `M150,${my} H404`, W.lin + W.oxy + W.pgr + W.ndh)}
    ${pipe('cyc', `M478,${my - 62} V108 Q478,84 454,84 H160 Q136,84 136,108 V${my - 26}`, W.pgr)}${head('cyc', 136, my - 42, 90, 1.5)}
    ${pipe('cyc', `M422,${my - 62} V188 Q422,164 398,164 H188 Q164,164 164,188 V${my - 26}`, W.ndh)}${head('cyc', 164, my - 40, 90, 1.0)}
    ${pipe('lin', `M496,${my} H576 Q608,${my} 608,${my - 32} V130 Q608,98 640,98 H680`, W.lin)}${head('lin', 688, 98, 0, 2.4)}
    ${pipe('oxy', `M466,${my + 60} V404 Q466,420 482,420 H558`, W.oxy)}${head('oxy', 564, 420, 0, 1.1)}
    ${valve(300, 84)}${valve(300, 164)}
    ${chipBox(58, my, 72, 56, 'PSII')}
    <ellipse class="blob-pq" cx="150" cy="${my}" rx="34" ry="31"/>${t(150, my + 7, 'PQ', 'fl11-in')}
    <ellipse class="blob-b6f" cx="252" cy="${my}" rx="30" ry="40"/>${t(252, my + 8, 'b₆f', 'fl11-in')}
    ${small(336, my, 24, 'PC')}
    ${psys(450, my, 96, 124, 'PSI', 12)}
    ${t(24, 364, 'flowering plant', 'fl11-it', 'start')}

    ${t(307, 44, 'cyclic: back to PQ', 'fl11-h fl11-c-cyc')}
    ${t(300, 126, 'PGR5', 'fl11-h fl11-c-cyc')}${t(300, 206, 'NDH', 'fl11-h fl11-c-cyc')}
    ${tag(742, 98, 'NADPH', 'nadph')}${t(636, 214, 'linear', 'fl11-h fl11-c-lin', 'start')}
    ${molecule(590, 420, 'OO', 11)}${rt(p, 'oxy', 'M612,420 L632,420')}${water(656, 416)}
    ${t(622, 462, 'to O₂', 'fl11-h fl11-c-oxy')}${t(622, 484, 'water–water cycle', 'fl11-xs')}

    <rect class="fl11-card" x="24" y="388" width="396" height="176" rx="14"/>
    ${t(44, 420, 'moss', 'fl11-h', 'start')}${t(118, 420, 'after a light increase', 'fl11-s', 'start')}
    ${pipe('lin', 'M136,464 H268', W.lin)}${head('lin', 276, 464, 0, 2.4)}${tag(332, 464, 'NADPH', 'nadph')}
    ${pipe('oxy', 'M136,532 H262', 24)}${head('oxy', 270, 532, 0, 2.1)}
    ${psys(104, 498, 64, 108, 'PSI', 9)}
    ${molecule(298, 532, 'OO', 11)}${rt(p, 'oxy', 'M320,532 L334,532')}${water(358, 528)}
    ${t(150, 508, 'FLV', 'fl11-h fl11-c-oxy', 'start')}${t(196, 508, 'flavodiiron proteins', 'fl11-key', 'start')}

    ${t(790, 526, 'pipe width: share of electrons (qualitative)', 'fl11-key', 'end')}
    ${t(790, 548, 'PGR5: proton gradient regulation 5', 'fl11-key', 'end')}
    ${t(790, 570, 'NDH: NADH dehydrogenase-like complex', 'fl11-key', 'end')}
    ${t(790, 592, 'after Asada 1999; Ilík et al. 2017', 'fl11-key', 'end')}
  `);
}

/* ---------- N · the same route twice: a moss passes surplus electrons to O₂ (FLV); a flowering plant leans on PGR5 ---------- */

function mossVsFlowering(): string {
  const p = 'fl11n';
  const panel = (x0: number, moss: boolean): string => {
    const X = (u: number): number => x0 + u;
    const mt = 384, mb = 444, my = 414, oy = 362;
    const cyc = `M${X(128)},${my - 72} C${X(118)},170 ${X(40)},170 ${X(30)},${my - 16}`;
    const oxy = `M${X(208)},${oy} L${X(268)},${oy}`;
    return `
      <rect class="fl11-lumen" x="${X(0)}" y="${mb}" width="380" height="56"/>
      ${bilayer(`${p}${moss ? 'a' : 'b'}`, X(0), X(380), mt, mb)}
      ${t(X(190), 50, moss ? 'moss' : 'flowering plant', 'fl11-b')}
      ${pq(X(28), my)}${b6f(X(86), my, 24, 54)}
      ${psys(X(162), my, 88, 140, 'PSI')}
      ${rt(p, 'lin', `M${X(162)},${my - 74} V140`)}${tag(X(162), 116, 'NADPH', 'nadph')}${t(X(176), 244, 'linear', 'fl11-h fl11-c-lin', 'start')}
      ${moss ? rt(p, 'cyc', cyc) : rtw(p, 'cyc', cyc)}
      ${t(X(72), 194, moss ? 'cyclic' : 'cyclic (PGR5)', 'fl11-h fl11-c-cyc')}
      ${moss ? rtw(p, 'oxy', oxy) : rt(p, 'oxy', oxy)}
      ${molecule(X(292), oy, 'OO', 11)}${(moss ? rtw : rt)(p, 'oxy', `M${X(314)},${oy} L${X(326)},${oy}`)}${water(X(352), oy - 4)}
      ${t(X(196), 324, moss ? 'FLV' : 'water–water cycle', 'fl11-l fl11-c-oxy', 'start')}`;
  };
  return svg(p, 'The same route drawn twice, after a light increase. Moss: surplus electrons go to O2 through flavodiiron proteins (FLV), a thick outlet, and cyclic flow is thin. Flowering plant: no FLV; cyclic flow through PGR5 is thicker, and only a thin water–water cycle goes to O2', `
    ${panel(10, true)}${panel(410, false)}
    <path class="fl11-guide" d="M400,20 V500"/>
    ${t(400, 542, 'after a light increase · line width: share of electrons (qualitative)', 'fl11-key')}
    ${t(400, 564, 'FLV: flavodiiron proteins · PGR5: proton gradient regulation 5', 'fl11-key')}
    ${t(400, 586, 'after Asada 1999; Ilík et al. 2017', 'fl11-key')}
  `);
}

/* ---------- O · the bookkeeping view: the gap (≈ 1.3 vs 1.5) and three ways to close it ---------- */

function gapOutlets(): string {
  const p = 'fl11o', base = 440, k = 220, yOf = (v: number): number => base - v * k;
  const y13 = yOf(18 / 14), y15 = yOf(1.5);
  const ticks = [0, 0.5, 1, 1.5].map(v => `<path class="fl11-tick" d="M82,${yOf(v)} H90"/>${t(76, yOf(v) + 7, v === 0 ? '0' : v.toFixed(1), 'fl11-s', 'end')}`).join('');
  const plusH = (x: number, y: number): string => `${t(x - 26, y + 8, '+', 'fl11-b')}${H(x, y, 15)}`;
  return svg(p, 'Bookkeeping: linear flow supplies about 1.3 ATP per NADPH, the Calvin–Benson cycle needs 1.5. Three ways close the gap: cyclic flow adds H+ without NADPH; electrons to O2 add H+ without NADPH (small in flowering plants, large with flavodiiron proteins); malate export removes NADPH', `
    <path class="fl11-axis" d="M90,${yOf(1.72)} V${base} H404"/>${ticks}
    <text class="fl11-l" transform="translate(30 ${(base + yOf(1.5)) / 2}) rotate(-90)" text-anchor="middle">ATP made per NADPH</text>
    <rect class="fl11-bar" x="118" y="${y13}" width="108" height="${base - y13}" rx="4"/>
    <rect class="fl11-gap" x="118" y="${y15}" width="108" height="${y13 - y15}" rx="4"/>
    <rect class="fl11-bar-need" x="280" y="${y15}" width="108" height="${base - y15}" rx="4"/>
    <path class="fl11-target" d="M90,${y15} H404"/>
    ${t(172, y13 + 42, '≈ 1.3', 'fl11-b')}${t(334, y15 + 42, '1.5', 'fl11-b')}
    ${t(172, y15 + 31, 'gap', 'fl11-l fl11-c-clay')}
    ${t(172, base + 34, 'linear flow', 'fl11-h')}${t(172, base + 60, 'supplies', 'fl11-l')}
    ${t(334, base + 34, 'Calvin–Benson', 'fl11-h')}${t(334, base + 60, 'cycle needs', 'fl11-l')}

    ${t(448, 112, '', 'fl11-h', 'start')}
    <path class="fl11-guide" d="M434,140 V440"/>
    ${sample(p, 'cyc', 450, 172)}${t(506, 179, 'cyclic flow', 'fl11-h fl11-c-cyc', 'start')}${plusH(752, 172)}
    ${sample(p, 'oxy', 450, 250)}${t(506, 257, 'to O₂', 'fl11-h fl11-c-oxy', 'start')}${plusH(752, 250)}
    ${rt(p, 'oxy', 'M472,290 H512', false)}${t(526, 297, 'small in flowering plants', 'fl11-l', 'start')}
    ${rtw(p, 'oxy', 'M475,326 H511', false)}${t(526, 333, 'large with FLV', 'fl11-l', 'start')}
    ${sample(p, 'g', 450, 400)}${t(506, 407, 'malate export', 'fl11-h', 'start')}${t(690, 408, '−', 'fl11-b', 'end')}${tag(740, 400, 'NADPH', 'nadph')}
    ${rt(p, 'k', `M434,142 C402,84 268,72 238,${y15 + 14}`)}

    ${t(400, 548, 'assumes 14 H⁺ per 3 ATP (c₁₄ ring) and a full Q cycle', 'fl11-s')}
    ${t(400, 576, 'FLV: flavodiiron proteins, after Ilík et al. 2017; Chaux et al. 2017', 'fl11-key')}
  `);
}
