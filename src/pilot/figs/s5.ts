// Slide 5 figure concepts. What each must show is in research/figure-briefs/FIGURE_BRIEF.md.
// Core: chlorophyll absorbs blue and red strongly and green weakly, so the light that comes back is
// enriched in green; green is still used (leaves absorb 50–90 % of it) and reaches deeper cells.
import './s5.css';

export const VARIANTS = [
  { id: 'a', name: 'Subtraction' },
  { id: 'b', name: 'Inside a leaf' },
  { id: 'c', name: 'Absorbed vs back' },
  { id: 'd', name: 'Pigment palette' },
  { id: 'e', name: 'Rows' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return leafSvg();
    case 'c': return backSvg();
    case 'd': return paletteSvg();
    case 'e': return rowsSvg();
    default: return subtractionSvg();
  }
}

/* ---------- shared pieces ---------- */

export type Pt = [number, number];
export const f = (v: number): string => v.toFixed(1);
export const gauss = (x: number, mu: number, sd: number): number => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
export const range = (lo: number, hi: number, step: number): number[] => Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => lo + i * step);
export const t = (x: number, y: number, s: string, cls = 'lab', anchor: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${s}</text>`;

// Display colours along the spectrum, muted and anchored on the deck's three light colours
// (blue #2350e6 near 455 nm, green #2a963a near 530 nm, red #c8361e near 660 nm).
const STOPS: Array<[number, string]> = [
  [380, '#6a4cb4'], [420, '#4a3fcf'], [455, '#2350e6'], [490, '#1c84ad'], [530, '#2a963a'], [556, '#5fa22e'],
  [580, '#d4aa2a'], [602, '#e0862a'], [630, '#d65826'], [660, '#c8361e'], [720, '#8c2618'],
];
export function col(nm: number): string {
  const hex = (h: string): number[] => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  let i = 1;
  while (i < STOPS.length - 1 && nm > STOPS[i][0]) i++;
  const [l0, h0] = STOPS[i - 1], [l1, h1] = STOPS[i];
  const k = Math.max(0, Math.min(1, (nm - l0) / (l1 - l0)));
  const a = hex(h0), b = hex(h1);
  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(',')})`;
}

/** A horizontal gradient of spectral colours from lo to hi nm, optionally fading where op(nm) is low. */
export function specGrad(id: string, x0: number, x1: number, lo: number, hi: number, op: (nm: number) => number = () => 1): string {
  const nms = range(lo, hi, 5);
  const stops = nms.map((nm, i) => `<stop offset="${(i / (nms.length - 1)).toFixed(4)}" stop-color="${col(nm)}" stop-opacity="${Math.max(0, Math.min(1, op(nm))).toFixed(3)}"/>`).join('');
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x0)}" y1="0" x2="${f(x1)}" y2="0">${stops}</linearGradient>`;
}

// Schematic band shapes placed at the stated solvent peaks: Chl a 430/662, Chl b 453/642, β-carotene 450
// (same shapes as figures.ts); phycoerythrin as a broad green band at ≈ 540–565.
export type Pig = 'a' | 'b' | 'car' | 'pe';
const BANDS: Record<Pig, Array<[number, number, number]>> = {
  a: [[430, 11, 1], [412, 14, 0.45], [385, 22, 0.28], [662, 8.5, 0.96], [617, 11, 0.14], [578, 10, 0.08], [533, 12, 0.05]],
  b: [[453, 12, 1], [430, 13, 0.4], [400, 22, 0.25], [642, 8.5, 0.42], [596, 12, 0.09], [550, 14, 0.05]],
  car: [[425, 10, 0.7], [450, 11, 1], [477, 11, 0.85], [400, 25, 0.2]],
  pe: [[540, 13, 0.9], [565, 12, 1]],
};
const raw = (k: Pig, nm: number): number => BANDS[k].reduce((s, [mu, sd, h]) => s + h * gauss(nm, mu, sd), 0);
const NORM = Object.fromEntries((Object.keys(BANDS) as Pig[]).map(k => [k, Math.max(...range(350, 750, 1).map(nm => raw(k, nm)))])) as Record<Pig, number>;
/** Relative absorption of a pigment (peak = 1). */
export const absorb = (k: Pig, nm: number): number => raw(k, nm) / NORM[k];
export const INK: Record<Pig, string> = { a: 'chla', b: 'chlb', car: 'car', pe: 'f5-pe' };
export const NAME: Record<Pig, string> = { a: 'Chl a', b: 'Chl b', car: 'β-carotene', pe: 'phycoerythrin' };

/** Schematic leaf absorptance: about 0.9 in blue and red, about 0.7 in green (inside the stated 80–95 % and 50–90 %). */
export const leafAbs = (nm: number): number => 0.92 - 0.24 * gauss(nm, 550, 33);

/** Curve through sampled points. */
export const line = (pts: Pt[]): string => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('');

/** A wave that follows a polyline, calm at its ends and at each corner. */
export function wavy(pts: Pt[], amp: number, period: number): string {
  const segs = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const out: string[] = [];
  let acc = 0;
  segs.forEach((len, i) => {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const nx = -(y1 - y0) / len, ny = (x1 - x0) / len, n = Math.max(2, Math.ceil(len / 2));
    for (let k = i ? 1 : 0; k <= n; k++) {
      const d = (k / n) * len, s = acc + d;
      const env = Math.max(0, Math.min(1, d / 9, (len - d) / 9, s / 10, (total - s) / 16));
      const w = Math.sin((2 * Math.PI * s) / period) * amp * env;
      out.push(`${out.length ? 'L' : 'M'}${f(x0 + ((x1 - x0) * k) / n + nx * w)},${f(y0 + ((y1 - y0) * k) / n + ny * w)}`);
    }
    acc += len;
  });
  return out.join('');
}

/** Arrowheads for the three light colours. */
export const lightHeads = (p: string): string =>
  `<defs>${(['b', 'g', 'r'] as const).map(c => `<marker id="${p}-h${c}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="f5-hd-${c}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
export const ray = (p: string, c: 'b' | 'g' | 'r', pts: Pt[], extra = '', head = true, amp = 6, period = 20): string =>
  `<path class="f5-wave f5-wave-${c}${extra ? ` ${extra}` : ''}" d="${wavy(pts, amp, period)}"${head ? ` marker-end="url(#${p}-h${c})"` : ''}/>`;

/** An eye, looking at the light that reaches it. */
export function eye(x: number, y: number, w = 100): string {
  const h = w * 0.27;
  return `<path class="f5-eye" d="M${f(x - w / 2)},${f(y)} Q${f(x)},${f(y - 2 * h)} ${f(x + w / 2)},${f(y)} Q${f(x)},${f(y + 2 * h)} ${f(x - w / 2)},${f(y)}Z"/>
    <circle class="f5-iris" cx="${f(x)}" cy="${f(y)}" r="${f(h * 0.92)}"/><circle class="f5-pupil" cx="${f(x)}" cy="${f(y)}" r="${f(h * 0.42)}"/>
    <circle class="f5-glint" cx="${f(x + h * 0.32)}" cy="${f(y - h * 0.3)}" r="${f(h * 0.17)}"/>`;
}

/** Wavelength ticks with labels; the last label carries the unit. */
export function ticks(X: (nm: number) => number, y: number, ly: number, up = false): string {
  return [400, 500, 600, 700].map(nm =>
    `<path class="tick" d="M${f(X(nm))},${y} v${up ? -8 : 8}"/>${t(X(nm), ly, nm === 700 ? '700 nm' : `${nm}`, 'tl')}`).join('');
}

/* ---------- 5A · Subtraction: sunlight − absorbed = left over ---------- */

export function subtractionSvg(p = 'f5a'): string {
  const lo = 400, hi = 700, x0 = 210, x1 = 740, H = 88;
  const X = (nm: number): number => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
  const r1 = 66, r2 = 190, r3 = 334;
  const nms = range(lo, hi, 2);
  // The absorbed part hangs from the top of the bar; what is left stands on its floor. Stacked, they refill the bar.
  const edge = (top: number): Pt[] => nms.map((nm): Pt => [X(nm), top + leafAbs(nm) * H]);
  const bite = `M${X(lo)},${r2} H${X(hi)} ${line(edge(r2).reverse()).replace('M', 'L')} Z`;
  const rest = `M${X(lo)},${r3 + H} H${X(hi)} ${line(edge(r3).reverse()).replace('M', 'L')} Z`;
  const gx = X(550);
  const row = (y: number, op: string, name: string, sub: string): string =>
    `${op ? t(34, y + H / 2 + 15, op, 'f5-op') : ''}${t(66, y + H / 2 + (sub ? -3 : 9), name, 'lab lab-b', 'start')}${sub ? t(66, y + H / 2 + 25, sub, 'sm f5-mute', 'start') : ''}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Sunlight minus the light a leaf absorbs leaves a green-rich remainder that reaches the eye">
    <defs>${specGrad(`${p}-spec`, x0, x1, lo, hi)}</defs>${lightHeads(p)}
    ${ticks(X, r1 - 4, r1 - 18, true)}
    <rect x="${x0}" y="${r1}" width="${x1 - x0}" height="${H}" rx="3" fill="url(#${p}-spec)"/>
    ${row(r1, '', 'sunlight', '')}
    <rect class="f5-ghost" x="${x0}" y="${r2}" width="${x1 - x0}" height="${H}" rx="3"/>
    <path d="${bite}" fill="url(#${p}-spec)"/>
    ${row(r2, '−', 'absorbed', 'and used')}
    ${t(X(445), r2 + H + 34, '80–95 %', 'sm lab-b')}${t(gx, r2 + H + 34, '50–90 %', 'sm lab-b')}${t(X(662), r2 + H + 34, '80–95 %', 'sm lab-b')}
    <rect class="f5-ghost f5-ghost-dash" x="${x0}" y="${r3}" width="${x1 - x0}" height="${H}" rx="3"/>
    <path d="${rest}" fill="url(#${p}-spec)"/>
    ${row(r3, '=', 'left over', 'comes back')}
    ${ray(p, 'b', [[gx - 34, r3 + H + 14], [gx - 14, 502]], 'f5-faint', true, 4, 18)}
    ${ray(p, 'r', [[gx + 34, r3 + H + 14], [gx + 14, 502]], 'f5-faint', true, 4, 18)}
    ${ray(p, 'g', [[gx, r3 + H + 14], [gx, 504]], '', true, 6, 20)}
    ${eye(gx, 540, 104)}
    ${t(gx + 74, 534, 'looks green', 'lab lab-b', 'start')}${t(gx + 74, 562, 'green-rich light', 'sm f5-mute', 'start')}
  </svg>`;
}

/* ---------- 5B · Inside a leaf: blue and red stop near the top, green goes deeper ---------- */

// Spongy cells of the leaf section: rounded blobs with air between them (cx, cy, rx, ry, rotation).
const SPONGY: Array<[number, number, number, number, number]> = [
  [52, 366, 32, 26, -8], [124, 360, 30, 24, 10], [196, 372, 30, 28, -4], [270, 362, 26, 24, 12], [344, 374, 32, 26, -10], [418, 362, 30, 24, 6], [490, 372, 28, 28, 0],
  [86, 448, 30, 26, 6], [160, 452, 28, 24, -10], [232, 444, 30, 28, 4], [308, 454, 28, 24, -6], [384, 446, 30, 26, 10], [458, 452, 30, 24, -4],
];

/** The leaf tissue of 5B (cuticle, epidermis, palisade, spongy cells), its first n of ten 50-wide columns, in 5B's coordinates
 *  (left edge x = 20, cuticle y = 152, lower epidermis ends at y = 510). Spongy cells that would stick out more than `over` are left out. */
export function leafCells(n = 10, over = 8): string {
  const L = 20, R = L + n * 50;
  const epi = (y: number, h: number): string => range(0, n - 1, 1).map(i => `<rect class="f5-epi" x="${L + i * 50 + 1}" y="${y}" width="48" height="${h}" rx="9"/>`).join('');
  const pal = range(0, n - 1, 1).map(i => {
    const x = L + 2 + i * 50;
    const chl = [x + 9, x + 37].flatMap(cx => [204, 230, 256, 282, 306].map(cy => `<ellipse class="f5-chl" cx="${cx}" cy="${cy}" rx="5" ry="8"/>`)).join('');
    return `<rect class="f5-cell" x="${x}" y="186" width="46" height="136" rx="20"/>${chl}`;
  }).join('');
  // Chloroplasts sit along the spongy cells' walls.
  const spongy = SPONGY.filter(([cx, , rx]) => cx + rx <= R + over).map(([cx, cy, rx, ry, rot]) => {
    const chl = [0.3, 1.5, 2.6, 3.7, 4.9].map(a => {
      const ax = cx + (rx - 7) * Math.cos(a + rot / 30), ay = cy + (ry - 7) * Math.sin(a + rot / 30);
      return `<ellipse class="f5-chl" cx="${f(ax)}" cy="${f(ay)}" rx="5" ry="7.5" transform="rotate(${f(((a + rot / 30) * 180) / Math.PI + 90)} ${f(ax)} ${f(ay)})"/>`;
    }).join('');
    return `<ellipse class="f5-cell" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})"/>${chl}`;
  }).join('');
  return `<path class="f5-cuticle" d="M${L},152 H${R}"/>
    ${epi(154, 26)}${pal}${spongy}${epi(486, 24)}`;
}

export function leafSvg(p = 'f5b'): string {
  const glow = (x: number, y: number): string => `<circle cx="${x}" cy="${y}" r="22" fill="url(#${p}-glow)"/><circle class="f5-glow-core" cx="${x}" cy="${y}" r="5.5"/>`;
  const S: Pt = [300, 340];
  const bracket = (y0: number, y1: number): string => `<path class="bracket" d="M534,${y0} h8 V${y1} h-8"/>`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Leaf cross-section: blue and red light are absorbed in the top cells; green goes deeper, scatters, is mostly absorbed there, and some comes back out">
    <defs><radialGradient id="${p}-glow"><stop offset="0" stop-color="#f2b705" stop-opacity=".9"/><stop offset="1" stop-color="#f2b705" stop-opacity="0"/></radialGradient></defs>${lightHeads(p)}
    <g transform="translate(0 14)">
    ${t(84, 40, 'sunlight', 'f5-note', 'start')}
    ${leafCells()}
    ${ray(p, 'b', [[96, 62], [96, 212]], '', false)}${glow(96, 214)}
    ${ray(p, 'r', [[196, 62], [196, 236]], '', false)}${glow(196, 238)}
    ${ray(p, 'g', [[S[0], 62], S], '', false)}
    ${ray(p, 'g', [S, [250, 396], [270, 418], [228, 446]], '', false)}${glow(226, 448)}
    ${ray(p, 'g', [S, [356, 396], [372, 420], [336, 458]], '', false)}${glow(334, 460)}
    ${ray(p, 'g', [S, [390, 300], [404, 252], [438, 150], [490, 104], [618, 74]])}
    ${eye(686, 66, 96)}
    ${t(560, 128, 'some green', 'sm lab-b', 'start')}${t(560, 154, 'comes back out', 'sm', 'start')}
    ${bracket(186, 322)}${t(556, 246, 'top cells', 'lab lab-b', 'start')}${t(556, 276, 'absorb blue and red', 'sm', 'start')}
    ${bracket(330, 482)}${t(556, 394, 'deeper cells', 'lab lab-b', 'start')}${t(556, 424, 'green scatters and', 'sm', 'start')}${t(556, 450, 'is mostly absorbed', 'sm', 'start')}
    </g>
    ${glow(578, 566)}${t(606, 573, 'absorbed', 'sm f5-mute', 'start')}
  </svg>`;
}

/* ---------- pigment rows, shared by 5C and 5E ---------- */

export interface RowSpec { k: Pig; top: number; h: number }
/** One pigment's absorption in its own row: a lightly filled curve, peak dots and their wavelengths above them. */
export function pigmentRow(p: string, r: RowSpec, X: (nm: number) => number, lo: number, hi: number, x0: number, x1: number, peaks: number[], head: number): string {
  const base = r.top + r.h;
  const Y = (a: number): number => base - a * (r.h - head);
  const pts = range(lo, hi, 2).map((nm): Pt => [X(nm), Y(absorb(r.k, nm))]);
  const d = line(pts);
  const marks = peaks.map(nm => {
    const x = X(nm), y = Y(absorb(r.k, nm));
    return `<circle class="dot ${r.k === 'pe' ? 'f5-dot-pe' : `dot-${r.k}`}" cx="${f(x)}" cy="${f(y)}" r="5"/>${t(x, y - 13, `${nm}`, `pk f5-c-${r.k}`)}`;
  }).join('');
  return `<path class="f5-area f5-area-${r.k}" d="${d} L${f(X(hi))},${base} L${f(X(lo))},${base} Z"/>
    <path class="axis" d="M${x0},${base} H${x1}"/>
    <path class="curve ${INK[r.k]}" d="${d}"/>${marks}`;
}

export const PEAKS: Record<Pig, number[]> = { a: [430, 662], b: [453, 642], car: [450], pe: [] };
export const rowLabel = (k: Pig, x: number, y: number): string => t(x, y, NAME[k], `lab lab-b f5-c-${k}`, 'end');

/* ---------- 5C · Absorbed vs what comes back ---------- */

export function backSvg(p = 'f5c'): string {
  const lo = 400, hi = 700, x0 = 200, x1 = 750;
  const X = (nm: number): number => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
  const backTop = 40, backH = 112, backBase = backTop + backH;
  const nms = range(lo, hi, 2);
  const back = (nm: number): number => (1 - leafAbs(nm)) / (1 - leafAbs(550));
  const bY = (v: number): number => backBase - v * (backH - 14);
  const bd = line(nms.map((nm): Pt => [X(nm), bY(back(nm))]));
  const rows: RowSpec[] = (['a', 'b', 'car'] as Pig[]).map((k, i) => ({ k, top: 214 + i * 96, h: 82 }));
  const stripY = 500;
  const g0 = X(500), g1 = X(580);
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="What comes back from a leaf peaks in green, where chlorophyll a, chlorophyll b and beta-carotene absorb least">
    <defs>${specGrad(`${p}-spec`, x0, x1, lo, hi)}</defs>
    <rect class="gap-band" x="${f(g0)}" y="${backTop}" width="${f(g1 - g0)}" height="${stripY - backTop}"/>
    <path d="${bd} L${f(X(hi))},${backBase} L${f(X(lo))},${backBase} Z" fill="url(#${p}-spec)" opacity=".9"/>
    <path class="f5-back" d="${bd}"/><path class="axis" d="M${x0},${backBase} H${x1}"/>
    ${t(180, 92, 'comes back', 'lab lab-b', 'end')}${t(180, 120, 'from a leaf', 'sm f5-mute', 'end')}
    ${t(x1, backTop + 8, 'schematic', 'tiny f5-tiny', 'end')}
    <path class="f5-sep" d="M24,182 H${x1}"/>
    ${t(180, 208, 'absorbed by', 'sm f5-mute', 'end')}
    ${rows.map(r => pigmentRow(p, r, X, lo, hi, x0, x1, PEAKS[r.k], 30) + rowLabel(r.k, 180, r.top + r.h / 2 + 18)).join('')}
    ${t(180, 488, 'in solvent', 'tiny f5-tiny', 'end')}
    <rect x="${x0}" y="${stripY}" width="${x1 - x0}" height="18" fill="url(#${p}-spec)"/>
    ${ticks(X, stripY + 18, stripY + 46)}
    <path class="bracket" d="M${f(g0)},${stripY + 58} v8 H${f(g1)} v-8"/>
    ${t((g0 + g1) / 2, 594, 'absorbed least, comes back most', 'sm lab-b')}
  </svg>`;
}

/* ---------- 5D · Pigment palette: each pigment catches its own colours ---------- */

/** How strongly a strip is coloured for a given absorption (5D). */
export const fade = (a: number): number => Math.min(1, a * 1.25);
/** Which colours a land plant's pigments (Chl a, Chl b, carotenoids) and a red alga's (Chl a, carotenoids, phycoerythrin) cover. */
export const plantCover = (nm: number): number => Math.max(absorb('a', nm), absorb('b', nm), absorb('car', nm));
export const algaCover = (nm: number): number => Math.max(absorb('a', nm), absorb('car', nm), absorb('pe', nm));

/** A 400–700 nm strip, grey where nothing is absorbed and in spectral colour where cov(nm) is high (5D). */
export function coverStrip(id: string, x0: number, x1: number, y: number, h: number, rx: number, cov: (nm: number) => number): string {
  return `${specGrad(id, x0, x1, 400, 700, nm => fade(cov(nm)))}<rect class="f5-strip-off" x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="${rx}"/><rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="${rx}" fill="url(#${id})"/>`;
}

/** One pigment card of 5D (372 × 136): name and lines on the left, mini absorption curve and its strip on the right. */
export function pigmentCard(p: string, k: Pig, cx: number, cy: number, lines: string[], alga = false): string {
  const lo = 400, hi = 700;
  const w = 372, h = 136, px0 = cx + 196, px1 = cx + w - 18;
  const X = (nm: number): number => px0 + ((nm - lo) / (hi - lo)) * (px1 - px0);
  const base = cy + 94;
  const Y = (a: number): number => base - a * 68;
  const d = line(range(lo, hi, 2).map((nm): Pt => [X(nm), Y(absorb(k, nm))]));
  return `<rect class="box${alga ? ' f5-box-alga' : ''}" x="${cx}" y="${cy}" width="${w}" height="${h}" rx="16"/>
      ${specGrad(`${p}-g${k}`, px0, px1, lo, hi, nm => fade(absorb(k, nm)))}
      <path class="f5-area f5-area-${k}" d="${d} L${f(px1)},${base} L${f(px0)},${base} Z"/>
      <path class="curve f5-mini ${INK[k]}" d="${d}"/>
      <rect class="f5-strip-off" x="${px0}" y="${base + 6}" width="${px1 - px0}" height="18" rx="3"/>
      <rect x="${px0}" y="${base + 6}" width="${px1 - px0}" height="18" rx="3" fill="url(#${p}-g${k})"/>
      ${t(cx + 20, cy + 46, k === 'car' ? 'carotenoid' : NAME[k], `f5-name f5-c-${k}`, 'start')}
      ${lines.map((s, i) => t(cx + 20, cy + 78 + i * 28, s, i && alga ? 'sm f5-alga' : 'sm f5-mute', 'start')).join('')}`;
}

export function paletteSvg(p = 'f5d'): string {
  const lo = 400, hi = 700;
  const card = (k: Pig, cx: number, cy: number, lines: string[], alga = false): string => pigmentCard(p, k, cx, cy, lines, alga);
  const sx0 = 262, sx1 = 750;
  const SX = (nm: number): number => sx0 + ((nm - lo) / (hi - lo)) * (sx1 - sx0);
  const leaf = plantCover, alga = algaCover;
  const strip = (id: string, y: number, cov: (nm: number) => number): string => coverStrip(id, sx0, sx1, y, 42, 4, cov);
  // Which pigments each organism uses, named in their card colours.
  const set = (y: number, ks: Pig[]): string =>
    `<text class="f5-sub" x="${sx0}" y="${y}">${ks.map(k => `<tspan class="f5-c-${k}">${k === 'car' ? 'carotenoids' : NAME[k]}</tspan>`).join('<tspan class="f5-mute"> + </tspan>')}</text>`;
  const s1 = 392, s2 = 484;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Chlorophyll a, chlorophyll b, carotenoid and phycoerythrin each absorb different colours; a land plant (Chl a, Chl b, carotenoids) leaves a green gap that a red alga (Chl a, carotenoids, phycoerythrin) fills">
    ${card('a', 20, 16, ['430 · 662 nm'])}${card('b', 408, 16, ['453 · 642 nm'])}
    ${card('car', 20, 166, ['β-carotene', '450 nm'])}${card('pe', 408, 166, ['≈ 540–565 nm', 'red algae'], true)}
    ${t(20, 344, 'together they cover more', 'lab lab-b', 'start')}
    ${set(s1 - 10, ['a', 'b', 'car'])}${strip(`${p}-s1`, s1, leaf)}${t(242, s1 + 29, 'land plant', 'lab lab-b', 'end')}
    ${t(SX(550), s1 + 28, 'green gap', 'sm f5-mute')}
    ${set(s2 - 10, ['a', 'car', 'pe'])}${strip(`${p}-s2`, s2, alga)}${t(242, s2 + 29, 'red alga', 'lab lab-b', 'end')}
    ${ticks(SX, s2 + 42, s2 + 70)}
    ${t(20, 588, 'coloured = light the pigment absorbs', 'sm f5-mute', 'start')}${t(780, 588, 'Chl and β-carotene peaks in solvent', 'tiny f5-tiny', 'end')}
  </svg>`;
}

/* ---------- 5E · Rows: one pigment per row ---------- */

export function rowsSvg(p = 'f5e'): string {
  const lo = 380, hi = 720, x0 = 196, x1 = 770;
  const X = (nm: number): number => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
  const rows: RowSpec[] = (['a', 'b', 'car'] as Pig[]).map((k, i) => ({ k, top: 30 + i * 140, h: 124 }));
  const stripY = 456, g0 = X(500), g1 = X(580);
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Absorption spectra of chlorophyll a, chlorophyll b and beta-carotene, one row each">
    <defs>${specGrad(`${p}-spec`, x0, x1, lo, hi)}</defs>
    <rect class="gap-band" x="${f(g0)}" y="20" width="${f(g1 - g0)}" height="${stripY - 20}"/>
    ${rows.map(r => pigmentRow(p, r, X, lo, hi, x0, x1, PEAKS[r.k], 40) + rowLabel(r.k, 176, r.top + r.h - 30)).join('')}
    <rect x="${x0}" y="${stripY}" width="${x1 - x0}" height="22" fill="url(#${p}-spec)"/>
    ${ticks(X, stripY + 22, stripY + 52)}
    ${t(176, stripY + 52, 'in solvent', 'tiny f5-tiny', 'end')}
    <path class="bracket" d="M${f(g0)},${stripY + 64} v10 H${f(g1)} v-10"/>
    ${t((g0 + g1) / 2, 568, 'absorbed least, so reflected most', 'lab')}
  </svg>`;
}
