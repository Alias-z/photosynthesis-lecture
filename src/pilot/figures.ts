// SVG figures for the style pilot. Colours and line styles come from the page's CSS classes.
import { mulberry } from '../lib/canvas';
import { spec } from '../lib/colour';

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);
const gauss = (x: number, mu: number, sd: number): number => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));

/* ---------- slide 5: pigment absorption spectra ---------- */

type Pig = 'a' | 'b' | 'car';
const cls = (k: Pig): string => (k === 'car' ? 'car' : `chl${k}`);
/** How the curves are identified: labels on the curves, a key, or one row per pigment. */
export type Labels = 'direct' | 'key' | 'rows';

// Provisional band shapes placed at the reported solvent peaks (Chl a 430/662, Chl b 453/642 in diethyl ether;
// β-carotene 450 with 425/478 shoulders in hexane). Replace with measured spectra before teaching.
const BANDS: Record<Pig, Array<[number, number, number]>> = {
  a: [[430, 11, 1], [412, 14, 0.45], [385, 22, 0.28], [662, 8.5, 0.96], [617, 11, 0.14], [578, 10, 0.08], [533, 12, 0.05]],
  b: [[453, 12, 1], [430, 13, 0.4], [400, 22, 0.25], [642, 8.5, 0.42], [596, 12, 0.09], [550, 14, 0.05]],
  car: [[425, 10, 0.7], [450, 11, 1], [477, 11, 0.85], [400, 25, 0.2]],
};

const PIGMENTS: Array<{ key: Pig; name: string; peaks: number[] }> = [
  { key: 'a', name: 'Chl a', peaks: [430, 662] },
  { key: 'b', name: 'Chl b', peaks: [453, 642] },
  { key: 'car', name: 'β-carotene', peaks: [450] },
];

function spectrum(key: Pig): Array<[number, number]> {
  const raw: Array<[number, number]> = [];
  for (let nm = 350; nm <= 750; nm += 2) raw.push([nm, BANDS[key].reduce((s, [mu, sd, h]) => s + h * gauss(nm, mu, sd), 0)]);
  const max = Math.max(...raw.map(p => p[1]));
  return raw.map(([nm, a]) => [nm, a / max]);
}

/** Relative absorption of a pigment at a wavelength on the 2 nm grid. */
const level = (key: Pig, nm: number): number => spectrum(key)[Math.round((nm - 350) / 2)][1];

function stripStops(): string {
  return Array.from({ length: 41 }, (_, i) => {
    const nm = 350 + i * 10;
    const c = spec(nm);
    const fade = Math.max(0, Math.min(1, (nm - 370) / 40, (760 - nm) / 70));
    const mix = (v: number): number => Math.round(31 + (v - 31) * fade);
    return `<stop offset="${(i / 40).toFixed(3)}" stop-color="rgb(${mix(c[0])},${mix(c[1])},${mix(c[2])})"/>`;
  }).join('');
}

const curve = (key: Pig, X: (nm: number) => number, Y: (a: number) => number): string =>
  `<path class="curve ${cls(key)}" d="${spectrum(key).map(([nm, a], i) => `${i ? 'L' : 'M'}${f(X(nm))},${f(Y(a))}`).join('')}"/>`;

/** A labelled dot on a peak; the number sits beside it, left or right. */
function peak(key: Pig, nm: number, X: (nm: number) => number, Y: (a: number) => number, side: 1 | -1): string {
  const x = X(nm), y = Y(level(key, nm));
  return `<circle class="dot dot-${key}" cx="${f(x)}" cy="${f(y)}" r="4.5"/><text class="pk lbl-${key}" x="${f(x + side * 10)}" y="${f(y + 8)}" text-anchor="${side > 0 ? 'start' : 'end'}">${nm}</text>`;
}

/** Name and peaks beside each curve, joined to it by a short leader. */
function directLabels(X: (nm: number) => number, Y: (a: number) => number): string {
  const tag = (key: Pig, name: string, peaks: string, at: number, lx: number, la: number, anchor: 'start' | 'end'): string => {
    const cx = X(at), cy = Y(level(key, at)), tx = X(lx), ty = Y(la);
    const ex = tx + (anchor === 'start' ? -6 : 6);
    return `<path class="leader leader-${key}" d="M${f(ex)},${f(ty + 4)}L${f(cx)},${f(cy)}"/><circle class="dot dot-${key}" cx="${f(cx)}" cy="${f(cy)}" r="4.5"/>
      <text class="lab" x="${f(tx)}" y="${f(ty)}" text-anchor="${anchor}"><tspan class="lab-b lbl-${key}">${name}</tspan><tspan class="pk-line" x="${f(tx)}" dy="30">${peaks}</tspan></text>`;
  };
  return tag('a', 'Chl a', '430 · 662', 668, 690, 0.93, 'start')
    + tag('b', 'Chl b', '453 · 642', 636, 618, 0.7, 'end')
    + tag('car', 'β-carotene', '450', 487, 506, 0.9, 'start');
}

/** A key with line samples, and the red and blue peaks of the two chlorophylls marked. */
function keyLabels(X: (nm: number) => number, Y: (a: number) => number): string {
  const x = X(500), y0 = Y(0.86);
  const rows = PIGMENTS.map((p, i) => {
    const y = y0 + i * 38;
    return `<path class="curve ${cls(p.key)}" d="M${f(x)},${f(y - 9)}H${f(x + 46)}"/><text class="lab" x="${f(x + 58)}" y="${f(y)}"><tspan class="lab-b lbl-${p.key}">${p.name}</tspan></text>`;
  }).join('');
  return rows + peak('a', 430, X, Y, -1) + peak('a', 662, X, Y, 1) + peak('b', 453, X, Y, 1) + peak('b', 642, X, Y, -1);
}

export function spectraSvg(labels: Labels): string {
  const rows = labels === 'rows';
  const x0 = rows ? 190 : 110, x1 = 720, top = 92, base = 470;
  const X = (nm: number): number => x0 + ((nm - 350) / 400) * (x1 - x0);
  let body: string;
  if (!rows) {
    const Y = (a: number): number => base - a * (base - top - 8);
    body = `<path class="axis" d="M${x0},${top} V${base} H${x1}"/>
      <text class="tl" transform="translate(52 ${(top + base) / 2}) rotate(-90)" text-anchor="middle">Absorption, relative · in solvent</text>
      <rect class="gap-band" x="${f(X(500))}" y="${top}" width="${f(X(580) - X(500))}" height="${base - top}"/>
      ${curve('car', X, Y)}${curve('b', X, Y)}${curve('a', X, Y)}
      ${labels === 'direct' ? directLabels(X, Y) : keyLabels(X, Y)}`;
  } else {
    const gap = 14, h = (base - top - 2 * gap) / 3;
    body = `<rect class="gap-band" x="${f(X(500))}" y="${top}" width="${f(X(580) - X(500))}" height="${base - top}"/>` + PIGMENTS.map((p, i) => {
      const rt = top + i * (h + gap);
      const Y = (a: number): number => rt + h - a * (h - 12);
      const sides: Record<number, 1 | -1> = { 430: -1, 453: -1, 450: -1, 662: 1, 642: 1 };
      return `<path class="axis" d="M${x0},${f(rt + h)} H${x1}"/>${curve(p.key, X, Y)}
        <text class="lab" x="${x0 - 16}" y="${f(rt + h / 2 + 9)}" text-anchor="end"><tspan class="lab-b lbl-${p.key}">${p.name}</tspan></text>
        ${p.peaks.map(nm => peak(p.key, nm, X, Y, sides[nm])).join('')}`;
    }).join('') + `<text class="note" x="${x0 - 16}" y="540" text-anchor="end">in solvent</text>`;
  }
  const ticks = [400, 500, 600, 700]
    .map(nm => `<line class="tick" x1="${f(X(nm))}" y1="${base}" x2="${f(X(nm))}" y2="${base + 8}"/><text class="tl" x="${f(X(nm))}" y="540" text-anchor="middle">${nm}</text>`)
    .join('');
  return `<svg class="fig-svg" viewBox="0 0 760 620" role="img" aria-label="Absorption spectra of chlorophyll a, chlorophyll b and beta-carotene">
    <defs><linearGradient id="strip" x1="0" x2="1">${stripStops()}</linearGradient></defs>
    <path class="bracket" d="M${f(X(400))},74 v-14 H${f(X(700))} v14"/>
    <text class="lab" x="${f((X(400) + X(700)) / 2)}" y="44" text-anchor="middle"><tspan class="lab-b">PAR</tspan> 400–700 nm</text>
    ${body}
    ${ticks}
    <rect x="${x0}" y="${base + 14}" width="${x1 - x0}" height="22" fill="url(#strip)"/>
    <text class="tl" x="${f(X(750))}" y="540" text-anchor="end">nm</text>
    <path class="bracket" d="M${f(X(500))},556 v10 H${f(X(580))} v-10"/>
    <text class="lab" x="${f(X(540))}" y="600" text-anchor="middle">absorbed least, so reflected most</text>
  </svg>`;
}

/* ---------- slide 6, panel a: chlorophyll a and b differ by one group ---------- */

function pentagon(cx: number, cy: number, r: number, toward: Pt): Pt[] {
  const a0 = Math.atan2(toward[1] - cy, toward[0] - cx);
  return Array.from({ length: 5 }, (_, k): Pt => [cx + r * Math.cos(a0 + (k * 2 * Math.PI) / 5), cy + r * Math.sin(a0 + (k * 2 * Math.PI) / 5)]);
}

/** A simplified chlorin skeleton: four rings around Mg, the fifth ring and the phytol tail. */
function chlorophyll(ox: number, oy: number, group: string, name: string): string {
  const d = 50, r = 25;
  const centres: Pt[] = [[ox - d, oy - d], [ox + d, oy - d], [ox + d, oy + d], [ox - d, oy + d]];
  const rings = centres.map(([cx, cy]) => pentagon(cx, cy, r, [ox, oy]));
  const poly = (p: Pt[]): string => `M${p.map(q => q.map(f).join(',')).join('L')}Z`;
  // Methine bridges join neighbouring rings through the vertices that face each other.
  const near = (p: Pt[], q: Pt): Pt => p.slice(1).reduce((best, v) => (Math.hypot(v[0] - q[0], v[1] - q[1]) < Math.hypot(best[0] - q[0], best[1] - q[1]) ? v : best));
  const bridges = rings.map((ring, i) => {
    const next = rings[(i + 1) % 4];
    const a = near(ring, centres[(i + 1) % 4]);
    const b = near(next, centres[i]);
    const mid: Pt = [(a[0] + b[0]) / 2 + (a[0] + b[0] - 2 * ox) * 0.12, (a[1] + b[1]) / 2 + (a[1] + b[1] - 2 * oy) * 0.12];
    return `M${f(a[0])},${f(a[1])}L${f(mid[0])},${f(mid[1])}L${f(b[0])},${f(b[1])}`;
  }).join('');
  const bonds = rings.map(ring => `M${f(ring[0][0])},${f(ring[0][1])}L${ox},${oy}`).join('');
  // Ring B (upper right) carries the group that differs; its outermost vertex points away from Mg.
  const ringB = rings[1];
  const outer = ringB.reduce((best, v) => (v[0] - v[1] > best[0] - best[1] ? v : best));
  const gx = outer[0] + 34, gy = outer[1] + 2;
  // Fifth ring fused to ring C, and the long phytol tail from ring D.
  const ringE = pentagon(ox + d * 0.2, oy + d + 34, 20, [ox + d, oy + d]);
  const tail: Pt[] = [[ox - d - 10, oy + d + 22]];
  for (let i = 1; i <= 6; i++) tail.push([tail[0][0] - i * 22, tail[0][1] + (i % 2 ? 14 : 0) + i * 4]);
  return `<g class="mol">
    <path class="mol-ring" d="${rings.map(poly).join('')}${poly(ringE)}"/>
    <path class="mol-bond" d="${bridges}"/>
    <path class="mol-coord" d="${bonds}"/>
    <path class="mol-bond" d="M${tail.map(p => p.map(f).join(',')).join('L')}"/>
    <circle class="mol-mg" cx="${ox}" cy="${oy}" r="15"/><text class="mol-mgt" x="${ox}" y="${oy + 6}" text-anchor="middle">Mg</text>
    <path class="mol-bond" d="M${f(outer[0])},${f(outer[1])}L${f(gx - 16)},${f(gy - 6)}"/>
    <rect class="mol-hi" x="${f(gx - 16)}" y="${f(gy - 26)}" width="${group.length * 19 + 22}" height="40" rx="6"/>
    <text class="mol-grp" x="${f(gx - 6)}" y="${f(gy + 3)}">${group}</text>
    <text class="lab" x="${ox}" y="${oy + 128}" text-anchor="middle"><tspan class="lab-b">${name}</tspan></text>
  </g>`;
}

const chlorophyllPair = (): string => `${chlorophyll(170, 100, '–CH₃', 'Chl a')}${chlorophyll(520, 100, '–CHO', 'Chl b')}`;

/* ---------- slide 6, panel b and the animation: antenna complexes around reaction centres ---------- */

export interface Pigment { x: number; y: number; b: boolean }
export interface Scene { shapes: string; pigments: Pigment[]; rc: Pt[]; path: Pt[] }

function dots(rand: () => number, n: number, inside: (x: number, y: number) => boolean, box: [number, number, number, number], bShare: number): Pigment[] {
  const out: Pigment[] = [];
  for (let tries = 0; out.length < n && tries < n * 60; tries++) {
    const x = box[0] + rand() * (box[2] - box[0]);
    const y = box[1] + rand() * (box[3] - box[1]);
    if (!inside(x, y) || out.some(p => Math.hypot(p.x - x, p.y - y) < 11)) continue;
    out.push({ x, y, b: rand() < bShare });
  }
  return out;
}

/** PSII with two LHCII trimers (a C₂S₂-like supercomplex), in a 400 × 300 box. Schematic, not to scale. */
export function psiiScene(): Scene {
  const rand = mulberry(29);
  const trimer = (cx: number, cy: number): Pt[] => [0, 1, 2].map((k): Pt => [cx + 26 * Math.cos(-Math.PI / 2 + (k * 2 * Math.PI) / 3), cy + 26 * Math.sin(-Math.PI / 2 + (k * 2 * Math.PI) / 3)]);
  const trimers = [trimer(58, 150), trimer(342, 150)];
  const minors: Pt[] = [[112, 104], [288, 196]];
  const cores: Array<[number, number, number, number]> = [[132, 82, 200, 218], [200, 82, 268, 218]];
  const inTrimer = (t: Pt[]) => (x: number, y: number): boolean => t.some(([cx, cy]) => Math.hypot(x - cx, y - cy) < 27);
  const inRect = ([x0, y0, x1, y1]: [number, number, number, number]) => (x: number, y: number): boolean => x > x0 + 8 && x < x1 - 8 && y > y0 + 8 && y < y1 - 8;
  const pigments = [
    ...trimers.flatMap(t => dots(rand, 26, inTrimer(t), [t[0][0] - 60, t[0][1] - 10, t[0][0] + 60, t[0][1] + 90], 0.43)),
    ...minors.flatMap(([cx, cy]) => dots(rand, 6, (x, y) => Math.hypot(x - cx, y - cy) < 17, [cx - 20, cy - 20, cx + 20, cy + 20], 0.3)),
    ...cores.flatMap(r => dots(rand, 20, (x, y) => inRect(r)(x, y) && Math.hypot(x - (r[0] + r[2]) / 2, y - 150) > 18, r, 0)),
  ];
  const rc: Pt[] = [[166, 150], [234, 150]];
  const rrect = ([x0, y0, x1, y1]: [number, number, number, number]): string => `<rect class="prot core" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="18"/>`;
  const shapes = [
    ...trimers.flatMap(t => t.map(([cx, cy]) => `<circle class="prot lhc" cx="${f(cx)}" cy="${f(cy)}" r="27"/>`)),
    ...minors.map(([cx, cy]) => `<circle class="prot lhc" cx="${cx}" cy="${cy}" r="17"/>`),
    ...cores.map(rrect),
  ].join('');
  // A route the animation follows: Chl b in the left trimer → Chl a in the trimer → minor antenna → core antenna → reaction centre.
  const nearest = (q: Pt, b?: boolean): Pt => {
    const p = pigments.filter(p => b === undefined || p.b === b).reduce((best, p) => (Math.hypot(p.x - q[0], p.y - q[1]) < Math.hypot(best.x - q[0], best.y - q[1]) ? p : best));
    return [p.x, p.y];
  };
  const path: Pt[] = [nearest([40, 132], true), nearest([66, 140], false), nearest([84, 160], false), nearest([112, 104]), nearest([142, 112], false), nearest([150, 150], false), rc[0]];
  return { shapes, pigments, rc, path };
}

/** PSI with its four-protein LHCI belt, in a 340 × 300 box. Schematic, not to scale. */
function psiScene(): Scene {
  const rand = mulberry(41);
  const core: [number, number, number, number] = [70, 60, 290, 190];
  const belt: Pt[] = [0, 1, 2, 3].map((k): Pt => [100 + k * 50, 236 - Math.sin((k + 0.5) / 4 * Math.PI) * 10]);
  const pigments = [
    ...dots(rand, 44, (x, y) => x > core[0] + 10 && x < core[2] - 10 && y > core[1] + 10 && y < core[3] - 10 && Math.hypot(x - 180, y - 125) > 20, core, 0),
    ...belt.flatMap(([cx, cy]) => dots(rand, 9, (x, y) => Math.abs(x - cx) < 15 && Math.abs(y - cy) < 28, [cx - 18, cy - 30, cx + 18, cy + 30], 0.2)),
  ];
  const shapes = `<rect class="prot core" x="${core[0]}" y="${core[1]}" width="${core[2] - core[0]}" height="${core[3] - core[1]}" rx="22"/>${belt
    .map(([cx, cy]) => `<rect class="prot lhc" x="${cx - 20}" y="${cy - 34}" width="40" height="68" rx="14"/>`)
    .join('')}`;
  return { shapes, pigments, rc: [[180, 125]], path: [] };
}

export function pigmentDots(p: Pigment[]): string {
  return p.map(q => `<circle class="pig${q.b ? ' pig-b' : ''}" cx="${f(q.x)}" cy="${f(q.y)}" r="${q.b ? 4.6 : 4.2}"/>`).join('');
}

export function rcMark([x, y]: Pt): string {
  return `<g class="rc"><circle class="rc-ring" cx="${x}" cy="${y}" r="15"/><text class="rc-t" x="${x - 6}" y="${y + 6}" text-anchor="middle">+</text><text class="rc-t" x="${x + 7}" y="${y + 5}" text-anchor="middle">–</text></g>`;
}

function exArrow(a: Pt, b: Pt): string {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 18;
  return `<path class="ex-arrow" d="M${f(a[0])},${f(a[1])}Q${f(mx)},${f(my)} ${f(b[0])},${f(b[1])}" marker-end="url(#exhead)"/>`;
}

function antenna(): string {
  const p2 = psiiScene();
  const p1 = psiScene();
  return `<defs><marker id="exhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="ex-head" d="M0,0L10,5L0,10z"/></marker></defs>
    <text class="lab" x="200" y="40" text-anchor="middle"><tspan class="lab-b">LHCII → PSII</tspan></text>
    <g transform="translate(0 20)">${p2.shapes}${pigmentDots(p2.pigments)}
      ${exArrow([52, 176], [158, 158])}${exArrow([348, 124], [242, 142])}
      ${p2.rc.map(rcMark).join('')}</g>
    <text class="lab" x="200" y="296" text-anchor="middle">Chl b‑rich · a:b ≈ 1.3</text>
    <text class="lab" x="590" y="40" text-anchor="middle"><tspan class="lab-b">LHCI → PSI</tspan></text>
    <g transform="translate(420 6)">${p1.shapes}${pigmentDots(p1.pigments)}
      ${exArrow([125, 226], [170, 140])}${exArrow([225, 226], [190, 140])}
      ${p1.rc.map(rcMark).join('')}</g>
    <text class="lab" x="590" y="296" text-anchor="middle">Chl a‑rich · a:b ≈ 3.7</text>
    <text class="note" x="590" y="332" text-anchor="middle">red forms absorb beyond 700 nm</text>
    <g class="legend" transform="translate(40 392)">
      <path class="ex-arrow" d="M0,0 H64" marker-end="url(#exhead)"/><text class="lab" x="80" y="9">excitation transfer</text>
      ${rcMark([400, 0])}<text class="lab" x="428" y="9">charge separation</text>
    </g>`;
}

export function antennaSvg(): string {
  return `<svg class="fig-svg" viewBox="0 0 760 420" role="img" aria-label="LHCII supplies photosystem II and LHCI supplies photosystem I">${antenna()}</svg>`;
}

/** Slide 6 figure: the chlorophyll pair above the two antenna systems. */
export function slide6Svg(): string {
  return `<svg class="fig-svg" viewBox="0 -10 760 690" role="img" aria-label="Chlorophyll a and b, and the antenna systems of PSII and PSI">
    <text class="pl" x="0" y="20">a</text>${chlorophyllPair()}
    <text class="pl" x="0" y="290">b</text><g transform="translate(0 262)">${antenna()}</g>
  </svg>`;
}
