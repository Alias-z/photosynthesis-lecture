// Slide L08 · Water supplies electrons—and oxygen. Draft context; facts checked in
// research/review-2026-10-23-claude/B_L07-L11.md (L08, 7.9 for the P680⁺ potential) and REVIEW_SUMMARY.md
// (Great Oxidation Event dates, Ruben wording, story pair 4). This slide upgrades the equation thread to
// 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O. Marks follow FIGURE_BRIEF.md: amber bolt = light, amber glow =
// excitation, red dashed arrow = e⁻, white ball with blue rim = H⁺, atoms as balls (O yellow, C orange-red,
// H white); the heavy-oxygen label is a dark-rimmed ochre O, always named in a legend.
import type { PlateText, Variant } from '../types';
import { arrow, text } from '../mechanisms';
import { bilayer, bolt, epath, illusHeads } from '../illus';
import './l08.css';

export const PLATE: PlateText = {
  n: '8',
  title: 'Water supplies electrons—and oxygen',
  status: 'draft',
  lead: 'PSII replaces each electron it loses with one taken from water. The by-product is the O₂ we breathe.',
  points: [
    { claim: 'Four light steps release one O₂.', text: '2 H₂O → O₂ + 4 H⁺ + 4 e⁻, one electron per PSII charge separation.' },
    { claim: 'Light does not split water directly.', text: 'Oxidised P680 takes electrons from water via a tyrosine and the Mn₄CaO₅ cluster.' },
    { claim: 'All the O₂ comes from water.', text: 'Labelled water gives labelled O₂: 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.' },
  ],
  refs: [
    { label: 'Ruben et al. 1941', url: 'https://doi.org/10.1021/ja01848a512' },
    { label: 'Joliot et al. 1969', url: 'https://doi.org/10.1111/j.1751-1097.1969.tb05696.x' },
    { label: 'Kok et al. 1970', url: 'https://doi.org/10.1111/j.1751-1097.1970.tb06017.x' },
    { label: 'Johnson 2025', url: 'https://doi.org/10.1038/s41580-025-00847-y' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'PSII close-up' },
  { id: 'b', name: 'S-state clock' },
  { id: 'c', name: 'Heavy oxygen' },
  { id: 'd', name: 'Flash yields', anim: true },
  { id: 'e', name: 'Equation upgrade' },
  { id: 'f', name: 'Four coins' },
  { id: 'g', name: 'Redox ladder' },
  { id: 'h', name: 'Not light' },
  { id: 'i', name: 'Cluster to sky', anim: true },
  { id: 'j', name: 'Icon sum' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return clockSvg();
    case 'c': return isotopeSvg();
    case 'd': return flashSvg();
    case 'e': return equationSvg();
    case 'f': return coinsSvg();
    case 'g': return ladderSvg();
    case 'h': return notLightSvg();
    case 'i': return skySvg();
    case 'j': return iconsSvg();
    default: return closeUpSvg();
  }
}

/* ---------- shared marks ---------- */

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg fl08" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** Arrowheads (shared inks, amber bolt), the hop head, a small bolt head, equation-arc heads and the glow. */
const defs = (p: string): string => `${illusHeads(p)}<defs>
  <marker id="${p}-amb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path class="fl08-hd" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-sb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="hd-bolt" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-w" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fl08-hd-w" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path class="fl08-hd-c" d="M0,0L10,5L0,10z"/></marker>
  <radialGradient id="${p}-glow"><stop offset="0" class="fl08-g0"/><stop offset=".45" class="fl08-g1"/><stop offset="1" class="fl08-g2"/></radialGradient></defs>`;

const glow = (p: string, x: number, y: number, s = 1): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(22 * s)}" fill="url(#${p}-glow)"/><circle class="fl08-gc" cx="${f(x)}" cy="${f(y)}" r="${f(6 * s)}"/>`;

function hop(p: string, a: Pt, b: Pt, k = 0.25): string {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const c: Pt = [(a[0] + b[0]) / 2 + dy * k, (a[1] + b[1]) / 2 - dx * k];
  return `<path class="fl08-hop" d="M${f(a[0])},${f(a[1])}Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}" marker-end="url(#${p}-amb)"/>`;
}

const chl = (x: number, y: number, r = 12): string => `<circle class="fl08-chl" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
const pair = (x: number, y: number, r = 12): string => chl(x - r * 0.85, y, r) + chl(x + r * 0.85, y, r);
/** The oxidised donor's + badge. */
const plus = (x: number, y: number, r = 12): string =>
  `<circle class="fl08-qp" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="fl08-qt" x="${f(x)}" y="${f(y + r * 0.52)}" text-anchor="middle" style="font-size:${Math.round(r * 1.6)}px">+</text>`;
const eLab = (x: number, y: number, anchor: 'start' | 'middle' | 'end' = 'middle'): string => text(x, y, 'e⁻', 'sm fl08-e', anchor);

/** A short lightning icon whose tip lands on (x, y), arriving from `from` degrees (−90 = from above). */
function spark(p: string, x: number, y: number, len = 48, from = -90): string {
  const a = (from * Math.PI) / 180, sx = x + Math.cos(a) * len, sy = y + Math.sin(a) * len;
  const dx = x - sx, dy = y - sy, nx = -dy / len, ny = dx / len;
  const pt = (s: number, o: number): string => `${f(sx + dx * s + nx * o)},${f(sy + dy * s + ny * o)}`;
  return `<path class="bolt" d="M${pt(0, 0)} L${pt(0.38, 7)} L${pt(0.5, -6)} L${pt(0.82, 4)} L${pt(0.92, 0)}" marker-end="url(#${p}-sb)"/>`;
}

/** Atom balls; a heavy (¹⁸O) oxygen is ochre with a dark rim. */
const oBall = (x: number, y: number, r: number, heavy = false): string => heavy
  ? `<circle class="fl08-o18" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="fl08-o18t" x="${f(x)}" y="${f(y + 5)}" text-anchor="middle">O</text>`
  : `<circle class="atom atom-O" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="fl08-ot" x="${f(x)}" y="${f(y + 5)}" text-anchor="middle">O</text>`;
const h2o = (x: number, y: number, heavy = false, r = 12): string =>
  `<circle class="atom atom-H" cx="${f(x - r * 1.05)}" cy="${f(y + r * 0.78)}" r="${f(r * 0.6)}"/><circle class="atom atom-H" cx="${f(x + r * 1.05)}" cy="${f(y + r * 0.78)}" r="${f(r * 0.6)}"/>${oBall(x, y, r, heavy)}`;
const co2 = (x: number, y: number, heavy = false, r = 11): string =>
  `${oBall(x - r * 1.5, y, r, heavy)}${oBall(x + r * 1.5, y, r, heavy)}<circle class="atom atom-C" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="fl08-ct" x="${f(x)}" y="${f(y + 5)}" text-anchor="middle">C</text>`;
const o2 = (x: number, y: number, heavy = false, r = 12): string => `${oBall(x - r * 0.78, y, r, heavy)}${oBall(x + r * 0.78, y, r, heavy)}`;
/** A proton: white ball, blue rim. */
const hp = (x: number, y: number, r = 14): string =>
  `<circle class="tag-h" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="fl08-ht" x="${f(x)}" y="${f(y + 5)}" text-anchor="middle">H⁺</text>`;

/** The Mn₄CaO₅ cluster as a distorted cube of three Mn and one Ca, a fourth Mn outside, and oxygens on the bonds. */
function cluster(x: number, y: number, s = 1): string {
  const P = (dx: number, dy: number): Pt => [x + dx * s, y + dy * s];
  const mn = [P(-22, -14), P(10, -24), P(16, 12), P(46, -4)], ca = P(-16, 20);
  const ox = [P(-6, -21), P(14, -6), P(0, 17), P(-20, 3), P(30, -13)];
  const L = (a: Pt, b: Pt): string => `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  const bonds = [L(mn[0], mn[1]), L(mn[1], mn[2]), L(mn[2], ca), L(ca, mn[0]), L(mn[1], mn[3]), L(mn[2], mn[3]), L(mn[0], mn[2])].join('');
  const lettered = s >= 0.9;
  return `<path class="fl08-bond" d="${bonds}"/>`
    + ox.map(([a, b]) => `<circle class="atom atom-O" cx="${f(a)}" cy="${f(b)}" r="${f(5.5 * s)}"/>`).join('')
    + mn.map(([a, b]) => `<circle class="fl08-mn" cx="${f(a)}" cy="${f(b)}" r="${f(12.5 * s)}"/>${lettered ? `<text class="fl08-mnt" x="${f(a)}" y="${f(b + 5)}" text-anchor="middle">Mn</text>` : ''}`).join('')
    + `<circle class="fl08-ca" cx="${f(ca[0])}" cy="${f(ca[1])}" r="${f(13 * s)}"/>${lettered ? `<text class="fl08-cat" x="${f(ca[0])}" y="${f(ca[1] + 5)}" text-anchor="middle">Ca</text>` : ''}`;
}

const tyr = (x: number, y: number, r = 11): string => `<circle class="fl08-tyr" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
const blob = (cx: number, cy: number, w: number, h: number, cls = 'blob-ps', rx = 0): string =>
  `<rect class="${cls}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx || Math.min(w, h) * 0.32}"/>`;

/* ---------- a · PSII close-up: light at P680, water at the Mn₄CaO₅ cluster ---------- */

function closeUpSvg(): string {
  const p = 'fl08a';
  const mT = 170, mB = 262;
  const P680: Pt = [306, 238], Y: Pt = [266, 300], M: Pt = [214, 362];
  return svg('PSII close-up: light reaches P680 through the antenna; P680⁺ takes an electron through a tyrosine from the Mn₄CaO₅ cluster, which oxidises two waters to O₂ and four protons in the lumen', `
    ${defs(p)}
    <rect class="fl08-lumen" x="10" y="${mB}" width="780" height="${600 - mB - 10}"/>
    ${bilayer(p, 10, 790, mT, mB)}
    ${text(782, 44, 'stroma', 'fl08-note', 'end')}${text(782, 300, 'lumen', 'fl08-note', 'end')}
    <ellipse class="fl08-ant" cx="70" cy="216" rx="40" ry="62"/>
    ${blob(320, 270, 400, 300, 'blob-ps', 64)}
    ${bolt(p, 40, 40, 60, 160)}
    ${chl(186, 220, 8)}${hop(p, [92, 210], [174, 216], 0.22)}${hop(p, [196, 222], [284, 236], 0.2)}${glow(p, 82, 210, 0.75)}
    ${pair(P680[0], P680[1], 13)}${plus(P680[0] + 34, P680[1] + 14, 12)}
    ${text(P680[0] + 54, P680[1] + 22, 'P680⁺', 'lab lab-b', 'start')}
    ${epath(p, `M${P680[0] + 6},${P680[1] - 16} L360,150`)}${epath(p, 'M376,140 L560,206')}
    <ellipse class="blob-pq" cx="600" cy="214" rx="30" ry="18"/>${text(600, 221, 'PQ', 'sm')}${text(600, 158, 'plastoquinone', 'fl08-key')}
    ${tyr(Y[0], Y[1])}${text(Y[0] + 18, Y[1] + 30, 'tyrosine', 'sm', 'start')}
    ${epath(p, `M${Y[0] + 8},${Y[1] - 12} L${P680[0] - 22},${P680[1] + 14}`)}
    ${cluster(M[0], M[1], 1)}
    ${epath(p, `M${M[0] + 38},${M[1] - 26} L${Y[0] - 12},${Y[1] + 6}`)}
    <path class="fl08-lead" d="M108,366 L176,362"/>${text(102, 360, 'Mn₄CaO₅', 'sm fl08-b', 'end')}${text(102, 386, 'cluster', 'sm', 'end')}
    ${h2o(110, 480)}${h2o(166, 500)}${text(140, 548, '2 H₂O', 'sm fl08-b')}
    ${epath(p, 'M150,466 L190,398')}${eLab(150, 440, 'end')}
    ${o2(290, 500)}${arrow(p, 'ink', `M${M[0] + 26},${M[1] + 36} L278,478`)}${text(290, 548, 'O₂', 'sm fl08-b')}
    ${hp(420, 478)}${hp(460, 504)}${hp(500, 478)}${hp(540, 504)}${text(480, 548, '4 H⁺', 'sm fl08-b')}
  `);
}

/* ---------- b · S-state clock: the cluster counts four light steps, then makes O₂ ---------- */

function clockSvg(): string {
  const p = 'fl08b';
  const cx = 400, cy = 304, R = 176, nr = 34;
  const ang = [-90, -18, 54, 126, 198];
  const at = (deg: number, r = R): Pt => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const arc = (a: number, b: number, cls: string): string => {
    const [x0, y0] = at(a + 12), [x1, y1] = at(b - 12);
    return `<path class="${cls}" d="M${f(x0)},${f(y0)} A${R},${R} 0 0 1 ${f(x1)},${f(y1)}" marker-end="url(#${p}-ink)"/>`;
  };
  const step = (a: number, b: number): string => {
    const m = (a + b) / 2;
    const [bx, by] = at(m - 8, R + 6), [ex, ey] = at(m + 9, R + 8), [ex2, ey2] = at(m + 9, R + 56), [lx, ly] = at(m + 9, R + 78);
    return `${arc(a, b, 'fl08-arc')}${spark(p, bx, by, 54, m - 8)}${epath(p, `M${f(ex)},${f(ey)} L${f(ex2)},${f(ey2)}`)}${eLab(lx, ly + 8)}`;
  };
  const nodes = ang.map((d, i) => {
    const [x, y] = at(d);
    return `<circle class="${i === 4 ? 'fl08-node-dark' : 'fl08-node'}" cx="${f(x)}" cy="${f(y)}" r="${nr}"/>${text(x, y + 10, `S${'₀₁₂₃₄'[i]}`, 'fl08-s')}`;
  }).join('');
  const [s1x, s1y] = at(-18);
  return svg('Kok S-state clock: the Mn₄CaO₅ cluster advances S₀ to S₄ with one light-driven electron removal per step; from S₄ it oxidises two waters, releases O₂ and returns to S₀; after dark it rests in S₁', `
    ${defs(p)}
    ${step(-90, -18)}${step(-18, 54)}${step(54, 126)}${step(126, 198)}
    ${arc(198, 270, 'fl08-arc-dark')}
    ${nodes}
    ${cluster(cx - 10, cy + 8, 1)}${text(cx, cy + 74, 'Mn₄CaO₅', 'sm fl08-b')}
    ${h2o(112, 132)}${h2o(160, 106)}${text(136, 168, '2 H₂O in', 'sm', 'middle')}
    ${arrow(p, 'ink', 'M186,132 L232,164')}
    ${o2(286, 54)}${arrow(p, 'ink', 'M276,158 L282,80')}${text(316, 61, 'O₂ out', 'sm fl08-b', 'start')}
    ${text(364, 236, 'no light needed', 'sm fl08-mut')}
    ${arrow(p, 'ink', `M700,${f(s1y - 48)} L${f(s1x + 40)},${f(s1y - 18)}`)}
    ${text(724, s1y - 92, 'rests here', 'sm fl08-b', 'middle')}${text(724, s1y - 68, 'in the dark', 'sm', 'middle')}
    ${spark(p, 46, 584, 34, -120)}${text(62, 590, '= one photon at PSII, one e⁻ removed', 'sm', 'start')}
    ${text(780, 590, '4 H⁺ per cycle', 'sm', 'end')}
  `);
}

/* ---------- c · heavy oxygen: label the water, the O₂ is labelled; label the CO₂, it is not ---------- */

function isotopeSvg(): string {
  const p = 'fl08c';
  const flask = (c: number, heavyWater: boolean): string => {
    const body = `M${c - 24},150 V214 L${c - 112},404 Q${c - 118},420 ${c - 100},420 H${c + 100} Q${c + 118},420 ${c + 112},404 L${c + 24},214 V150`;
    const id = `${p}-fl${heavyWater ? 'w' : 'c'}`;
    return `<clipPath id="${id}"><path d="${body}Z"/></clipPath>
      <rect class="fl08-liquid" x="${c - 120}" y="262" width="240" height="160" clip-path="url(#${id})"/>
      ${[[-70, 392], [-30, 404], [14, 396], [58, 404], [86, 384], [-88, 372], [40, 372]].map(([dx, dy]) => `<circle class="fl08-alga" cx="${c + dx}" cy="${dy}" r="8"/>`).join('')}
      ${h2o(c - 52, 300, heavyWater)}${h2o(c + 4, 338, heavyWater)}${h2o(c + 62, 302, heavyWater)}
      ${co2(c - 44, 356, !heavyWater)}${co2(c + 52, 352, !heavyWater)}
      <path class="fl08-glass" d="${body}"/>
      <circle class="fl08-bub" cx="${c}" cy="242" r="7"/><circle class="fl08-bub" cx="${c - 4}" cy="206" r="6"/><circle class="fl08-bub" cx="${c + 3}" cy="172" r="5"/>
      ${arrow(p, 'ink', `M${c},150 L${c},128`)}${o2(c, 106, heavyWater)}
      ${bolt(p, c + 160, 168, c + 104, 306)}`;
  };
  return svg('Heavy-oxygen tracer experiment drawn as a result: with heavy oxygen in the water the released O₂ carries the label; with heavy oxygen in the CO₂ the O₂ does not; so the O₂ comes from water', `
    ${defs(p)}
    ${text(200, 44, 'label the water', 'lab lab-b')}${text(600, 44, 'label the CO₂', 'lab lab-b')}
    <path class="fl08-rule" d="M400,24 V482"/>
    ${flask(200, true)}${flask(600, false)}
    ${text(232, 112, 'O₂', 'sm fl08-b', 'start')}${text(632, 112, 'O₂', 'sm fl08-b', 'start')}
    ${text(200, 458, 'the O₂ carries the label', 'sm fl08-b')}${text(600, 458, 'the O₂ has no label', 'sm fl08-b')}
    <path class="fl08-rule" d="M24,486 H776"/>
    ${oBall(44, 524, 12, true)}${text(64, 531, 'heavy oxygen ¹⁸O (the label)', 'sm', 'start')}
    ${oBall(444, 524, 12)}${text(464, 531, 'ordinary oxygen ¹⁶O', 'sm', 'start')}
    ${text(400, 584, 'after Ruben et al. 1941; confirmed by mass spectrometry', 'fl08-key')}
  `);
}

/* ---------- d · flash yields: O₂ first on flash 3, then every fourth flash ---------- */

/** Kok's model: per flash a centre misses (stays) or takes a double step; O₂ is released on passing S₃ → S₀. */
function kokYields(n: number, miss = 0.1, dbl = 0.05): number[] {
  let s = [0, 1, 0, 0];
  const out: number[] = [];
  for (let k = 0; k < n; k++) {
    const next = [0, 0, 0, 0];
    let y = 0;
    s.forEach((v, i) => {
      next[i] += miss * v;
      const one = i + 1, two = i + 2, single = (1 - miss - dbl) * v;
      if (one >= 4) { y += single; next[one - 4] += single; } else next[one] += single;
      if (two >= 4) { y += dbl * v; next[two - 4] += dbl * v; } else next[two] += dbl * v;
    });
    s = next;
    out.push(y);
  }
  const m = Math.max(...out);
  return out.map(v => v / m);
}

function flashSvg(): string {
  const p = 'fl08d';
  const n = 16, x0 = 120, step = 40, base = 446, hMax = 280;
  const ys = kokYields(n);
  const X = (k: number): number => x0 + (k - 0.5) * step;
  const peaks = [3, 7, 11, 15];
  const bars = ys.map((v, i) => {
    const k = i + 1, h = Math.max(2, v * hMax), pk = peaks.includes(k);
    return `<rect class="${pk ? 'fl08-bar-pk' : 'fl08-bar'}" x="${f(X(k) - 12)}" y="${f(base - h)}" width="24" height="${f(h)}" rx="3"/>${text(X(k), base + 30, `${k}`, pk ? 'tl fl08-b' : 'tl')}`;
  }).join('');
  const states = Array.from({ length: n }, (_, i) => `S${'₁₂₃₀'[i % 4]}`);
  const stateRow = states.map((s, i) => text(X(i + 1), 526, s, i % 4 === 2 ? 'sm fl08-b' : 'sm fl08-mut')).join('');
  const top3 = base - ys[2] * hMax, top7 = base - ys[6] * hMax;
  return svg('Schematic O₂ yield per flash in a dark-adapted sample: nothing on flashes 1 and 2, the first peak on flash 3 and then a peak every fourth flash, because the cluster starts in S₁ and needs four steps per O₂', `
    ${defs(p)}
    ${text(24, 52, 'dark-adapted sample', 'sm fl08-mut', 'start')}
    <path class="axis" d="M${x0},${base} H${x0 + n * step + 10}M${x0},${base} V${base - hMax - 30}"/>
    <text class="tl" transform="translate(${x0 - 30} ${base - hMax / 2}) rotate(-90)" text-anchor="middle">O₂ per flash</text>
    ${bars}
    ${text(x0 - 14, base + 30, 'flash', 'tl', 'end')}
    ${text(x0 - 14, 526, 'state', 'sm fl08-mut', 'end')}${text(x0 - 14, 550, 'before', 'sm fl08-mut', 'end')}
    ${stateRow}
    <path class="bracket" d="M${X(3)},${f(Math.min(top3, top7) - 26)} v-12 H${X(7)} v12"/>
    ${text(X(7) + 14, Math.min(top3, top7) - 26, 'every 4th flash', 'sm fl08-b', 'start')}
    ${arrow(p, 'ink', `M${X(4) + 4},${f(top3 + 40)} L${X(3) + 16},${f(top3 + 14)}`)}
    ${text(X(4) + 10, top3 + 50, 'first O₂', 'sm fl08-b', 'start')}${text(X(4) + 10, top3 + 76, 'on flash 3', 'sm', 'start')}
    ${text(780, 52, 'schematic, after Joliot et al. 1969', 'fl08-key', 'end')}
  `);
}

/* ---------- e · equation upgrade: write water on both sides so every oxygen can be traced ---------- */

function equationSvg(): string {
  const p = 'fl08e';
  // Term widths estimated for 30 px Inter semibold, so arcs can start and end on the right terms.
  const em = 30;
  const w = (s: string): number => [...s].reduce((a, ch) => a + em * (/[₀-₉]/.test(ch) ? 0.4 : ch === ' ' ? 0.27 : /[0-9]/.test(ch) ? 0.6 : ch === '→' ? 1 : ch === '+' ? 0.62 : 0.7), 0);
  const items = ['6 CO₂', '+', '12 H₂O', '→', 'C₆H₁₂O₆', '+', '6 O₂', '+', '6 H₂O'];
  const gap = 14, total = items.reduce((a, s) => a + w(s), 0) + gap * (items.length - 1);
  let x = (800 - total) / 2;
  const cx: number[] = items.map(s => { const c = x + w(s) / 2; x += w(s) + gap; return c; });
  const y = 320;
  const terms = items.map((s, i) => text(cx[i], y, s, s === '+' || s === '→' ? 'fl08-op' : 'fl08-eqb')).join('');
  const [cCO2, cH2O, cSug, cO2, cNew] = [cx[0], cx[2], cx[4], cx[6], cx[8]];
  return svg('The equation upgraded: 6 CO₂ + 12 H₂O gives C₆H₁₂O₆ + 6 O₂ + 6 H₂O; all twelve oxygens of the O₂ come from water, while the oxygens of CO₂ end in the sugar and in new water', `
    ${defs(p)}
    ${text(400, 58, '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', 'fl08-eq')}
    ${text(400, 92, 'classic form: O₂ source hidden', 'sm fl08-mut')}
    <path class="fl08-rule" d="M120,120 H680"/>
    <path class="fl08-arc-w" d="M${f(cH2O)},${y - 36} Q${f((cH2O + cO2) / 2)},${y - 150} ${f(cO2)},${y - 38}" marker-end="url(#${p}-w)"/>
    ${text((cH2O + cO2) / 2, y - 120, 'all 12 O of the water → 6 O₂', 'sm fl08-blue fl08-b')}
    ${terms}
    <path class="fl08-arc-c" d="M${f(cCO2)},${y + 16} Q${f((cCO2 + cSug) / 2)},${y + 92} ${f(cSug)},${y + 18}" marker-end="url(#${p}-c)"/>
    <path class="fl08-arc-c" d="M${f(cCO2 - 10)},${y + 18} Q${f((cCO2 + cNew) / 2)},${y + 200} ${f(cNew)},${y + 18}" marker-end="url(#${p}-c)"/>
    ${text((cCO2 + cNew) / 2, y + 140, 'the 12 O of CO₂ → 6 in the sugar + 6 in new water', 'sm fl08-clay fl08-b')}
    ${text(400, 572, 'Water on both sides: 12 used, 6 made', 'sm')}
  `);
}

/* ---------- f · four coins: a vending machine that releases O₂ only after four light steps ---------- */

function coinsSvg(): string {
  const p = 'fl08f';
  const coin = (x: number, y: number, r = 17): string =>
    `<circle class="fl08-coin" cx="${x}" cy="${y}" r="${r}"/>${spark(p, x + 3, y + 9, 20, -100)}`;
  const lead = (x0: number, y0: number, x1: number, y1: number): string => `<path class="fl08-lead" d="M${x0},${y0} L${x1},${y1}"/>`;
  const note = (y: number, head: string, lines: string[]): string =>
    `${text(410, y, head, 'sm fl08-b', 'start')}${lines.map((s, i) => text(410, y + 26 * (i + 1), s, 'sm', 'start')).join('')}`;
  return svg('Analogy: the Mn₄CaO₅ cluster as a vending machine that needs four coins, one per light step at PSII, before it releases one O₂ from two waters; left in the dark it already holds one coin, so the first O₂ comes at the third flash', `
    ${defs(p)}<g transform="translate(24 0)">
    <rect class="fl08-vm" x="60" y="72" width="270" height="470" rx="22"/>
    <rect class="fl08-sign" x="88" y="96" width="214" height="56" rx="12"/>${text(195, 133, 'Mn₄CaO₅', 'lab lab-b')}
    <rect class="fl08-win" x="88" y="176" width="214" height="62" rx="10"/>
    ${[118, 168, 220, 272].map(x => `<circle class="fl08-lamp-on" cx="${x}" cy="207" r="16"/>`).join('')}
    ${text(118, 262, 'S₁', 'sm fl08-mut')}${text(168, 262, 'S₂', 'sm fl08-mut')}${text(220, 262, 'S₃', 'sm fl08-mut')}${text(272, 262, 'S₄', 'sm fl08-mut')}
    <rect class="fl08-slot" x="240" y="300" width="12" height="54" rx="4"/>
    ${coin(204, 328)}${arrow(p, 'ink', 'M224,328 L234,328')}
    ${h2o(126, 314)}${h2o(126, 352)}${text(126, 392, '2 H₂O', 'sm fl08-b')}
    <rect class="fl08-tray" x="96" y="440" width="198" height="74" rx="12"/>
    ${o2(150, 476)}${text(150, 504, 'O₂', 'sm fl08-b')}
    ${[[226, 462], [262, 462], [226, 494], [262, 494]].map(([a, b]) => hp(a, b, 13)).join('')}
    ${lead(304, 124, 400, 102)}${note(108, 'The machine', ['Mn₄CaO₅ cluster of PSII'])}
    ${lead(304, 207, 400, 202)}${note(208, 'Its counter', ['S-states, S₀ → S₄'])}
    ${lead(254, 328, 400, 302)}${note(308, 'A coin', ['one photon: one e⁻ removed'])}
    ${lead(296, 478, 400, 402)}${note(408, 'After four coins', ['O₂ out; 4 H⁺ per cycle'])}
    ${note(508, 'Left in the dark', ['keeps one coin (S₁)'])}</g>
  `);
}

/* ---------- g · redox ladder: P680⁺ pulls harder than water holds its electrons ---------- */

function ladderSvg(): string {
  const p = 'fl08g';
  const ax = 150, top = 100, bot = 540, e0 = 0.6, e1 = 1.4;
  const Y = (e: number): number => top + ((e - e0) / (e1 - e0)) * (bot - top);
  const ticks = [0.6, 0.8, 1.0, 1.2, 1.4].map(e => `<line class="tick" x1="${ax - 8}" y1="${f(Y(e))}" x2="${ax}" y2="${f(Y(e))}"/>${text(ax - 14, Y(e) + 8, `+${e.toFixed(1)}`, 'tl', 'end')}`).join('');
  const yw0 = Y(0.82), yw1 = Y(0.87), yp = Y(1.2);
  return svg('Redox ladder: oxidising water to O₂ needs about +0.82 to 0.87 volts; P680⁺ sits at about +1.2 volts, so electrons run downhill from water through the Mn₄CaO₅ cluster and a tyrosine to P680⁺', `
    ${defs(p)}
    <path class="axis" d="M${ax},${top - 16} V${bot + 8}"/>${ticks}
    <text class="tl" transform="translate(${ax - 92} ${(top + bot) / 2}) rotate(-90)" text-anchor="middle">redox potential (V)</text>
    ${text(ax + 14, bot - 4, '↓ more oxidising', 'tl', 'start')}
    <rect class="fl08-band-w" x="200" y="${f(yw0)}" width="230" height="${f(yw1 - yw0)}" rx="4"/>
    ${text(450, yw0 + 2, 'water → O₂', 'lab lab-b', 'start')}${text(450, yw0 + 30, 'needs ≈ +0.82–0.87 V', 'sm', 'start')}
    <path class="fl08-lvl" d="M200,${f(yp)} H430"/>
    ${text(450, yp + 2, 'P680⁺', 'lab lab-b', 'start')}${text(450, yp + 30, '≈ +1.2 V', 'sm', 'start')}
    ${epath(p, `M300,${f(yw1 + 8)} L300,${f(yp - 10)}`)}${eLab(288, (yw1 + yp) / 2 - 36, 'end')}
    ${text(316, (yw1 + yp) / 2 - 8, 'via the Mn₄CaO₅', 'sm', 'start')}${text(316, (yw1 + yp) / 2 + 18, 'cluster and a tyrosine', 'sm', 'start')}
    <rect class="fl08-panel" x="500" y="56" width="284" height="122" rx="16"/>
    ${spark(p, 536, 120, 46, -110)}${text(558, 94, 'made by light:', 'sm fl08-mut', 'start')}${text(558, 126, 'P680* → P680⁺ + e⁻', 'sm fl08-b', 'start')}
    ${text(558, 156, '* excited', 'fl08-key', 'start')}
  `);
}

/* ---------- h · not light: light does not split water; P680⁺ takes its electrons ---------- */

function notLightSvg(): string {
  const p = 'fl08h';
  const c = 600;
  return svg('Misconception and correction: light does not split a water molecule directly; light makes P680⁺, which takes electrons from water through a tyrosine and the Mn₄CaO₅ cluster, releasing O₂ and protons', `
    ${defs(p)}<g transform="translate(0 30)">
    ${text(200, 44, 'Not this', 'lab lab-b fl08-clay')}${text(c, 44, 'But this', 'lab lab-b fl08-grn')}
    <path class="fl08-rule" d="M400,24 V520"/>
    ${bolt(p, 110, 90, 176, 214)}
    ${h2o(210, 262, false, 30)}
    <g opacity=".55">${arrow(p, 'ink', 'M210,312 L210,346', 'dashed')}${o2(160, 378, false, 12)}${hp(240, 378)}${hp(278, 378)}</g>
    <path class="fl08-x" d="M130,192 L290,332 M290,192 L130,332"/>
    ${text(200, 452, '“light splits water”', 'sm fl08-b')}
    ${text(200, 482, '(old word: photolysis)', 'sm fl08-mut')}
    ${blob(c, 112, 190, 82, 'blob-ps', 28)}${bolt(p, 470, 66, 520, 108)}
    ${pair(c, 112, 13)}${plus(c + 34, 128, 12)}${text(c + 54, 120, 'P680⁺', 'sm fl08-b', 'start')}
    ${tyr(c, 212)}${text(c + 22, 219, 'tyrosine', 'sm', 'start')}
    ${cluster(c - 14, 300, 0.85)}${text(c + 52, 306, 'Mn₄CaO₅', 'sm', 'start')}
    ${h2o(c - 34, 408)}${h2o(c + 30, 418)}${text(c + 60, 424, '2 H₂O', 'sm fl08-b', 'start')}
    ${epath(p, `M${c},196 L${c},158`)}${epath(p, `M${c},272 L${c},228`)}${epath(p, `M${c},392 L${c},334`)}
    ${eLab(c - 14, 184, 'end')}${eLab(c - 14, 258, 'end')}${eLab(c - 14, 370, 'end')}
    ${o2(c - 70, 478)}${text(c - 70, 512, 'O₂', 'sm fl08-b')}${hp(c + 6, 474)}${hp(c + 40, 490)}${hp(c + 74, 474)}${hp(c + 108, 490)}
    ${text(c + 58, 524, '4 H⁺', 'sm fl08-b')}</g>
  `);
}

/* ---------- i · cluster to sky: one reaction scaled up to the planet's air ---------- */

function skySvg(): string {
  const p = 'fl08i';
  const L = [{ x: 92, y: 154, r: 62 }, { x: 260, y: 154, r: 74 }, { x: 452, y: 154, r: 88 }, { x: 676, y: 154, r: 104 }];
  const clip = (i: number): string => `<clipPath id="${p}-c${i}"><circle cx="${L[i].x}" cy="${L[i].y}" r="${L[i].r - 1}"/></clipPath>`;
  const lens = (i: number, body: string): string => `<circle class="fl08-lens" cx="${L[i].x}" cy="${L[i].y}" r="${L[i].r}"/><g clip-path="url(#${p}-c${i})">${body}</g>`;
  const c0 = `${cluster(L[0].x - 12, L[0].y + 4, 0.75)}${o2(L[0].x + 24, L[0].y - 38, false, 9)}`;
  const c1 = `${bilayer(p, L[1].x - 80, L[1].x + 80, L[1].y - 18, L[1].y + 18)}${blob(L[1].x - 10, L[1].y, 70, 70, 'blob-ps', 22)}
    ${o2(L[1].x + 34, L[1].y + 48, false, 9)}${spark(p, L[1].x - 18, L[1].y - 36, 34, -110)}`;
  const c2 = `<rect class="fl08-cyano" x="${L[2].x - 70}" y="${L[2].y - 34}" width="140" height="68" rx="34"/>
    <path class="fl08-thyl" d="M${L[2].x - 52},${L[2].y - 16} H${L[2].x + 52} M${L[2].x - 56},${L[2].y} H${L[2].x + 56} M${L[2].x - 52},${L[2].y + 16} H${L[2].x + 52}"/>
    ${o2(L[2].x + 10, L[2].y - 58, false, 9)}${o2(L[2].x - 40, L[2].y + 60, false, 9)}`;
  const c3 = `<circle class="fl08-air" cx="${L[3].x}" cy="${L[3].y}" r="${L[3].r - 18}"/>
    <circle class="fl08-sea" cx="${L[3].x}" cy="${L[3].y}" r="${L[3].r - 26}"/>
    <path class="fl08-land" d="M${L[3].x - 50},${L[3].y - 30} q30,-26 58,-6 q20,18 -6,34 q-30,14 -44,0 q-18,-12 -8,-28Z M${L[3].x + 18},${L[3].y + 26} q26,-8 36,10 q-4,22 -30,22 q-20,-10 -6,-32Z"/>`;
  const chev = (x: number): string => arrow(p, 'ink', `M${x - 12},154 L${x + 10},154`);
  const X = (ga: number): number => 60 + ((4 - ga) / 4) * 700;
  const by = 432, bh = 44;
  const hatch = Array.from({ length: 6 }, (_, i) => { const x = X(2.43) + i * 7; return `<path class="fl08-hatch" d="M${f(x)},${by + bh} L${f(x + 10)},${by}"/>`; }).join('');
  return svg('Zoom out from the Mn₄CaO₅ cluster to PSII, to a cyanobacterium and to the planet, then a schematic timeline: oxygen first rose in the air about 2.43 billion years ago and has been present permanently since about 2.22 billion years ago', `
    ${defs(p)}${L.map((_, i) => clip(i)).join('')}
    ${lens(0, c0)}${lens(1, c1)}${lens(2, c2)}${lens(3, c3)}
    ${chev(166)}${chev(348)}${chev(552)}
    ${text(L[0].x, 290, 'Mn₄CaO₅', 'sm fl08-b')}${text(L[0].x, 316, 'makes O₂', 'sm')}
    ${text(L[1].x, 290, 'PSII', 'sm fl08-b')}${text(L[1].x, 316, 'in the membrane', 'sm')}
    ${text(L[2].x, 290, 'cyanobacteria;', 'sm fl08-b')}${text(L[2].x, 316, 'later chloroplasts', 'sm')}
    ${text(L[3].x, 290, 'the air', 'sm fl08-b')}
    <rect class="fl08-seg0" x="${X(4)}" y="${by}" width="${f(X(2.43) - X(4))}" height="${bh}" rx="6"/>
    <rect class="fl08-seg1" x="${f(X(2.22))}" y="${by}" width="${f(X(0) - X(2.22))}" height="${bh}" rx="6"/>
    <rect class="fl08-seg0" x="${f(X(2.43))}" y="${by}" width="${f(X(2.22) - X(2.43))}" height="${bh}"/>${hatch}
    ${text((X(4) + X(2.43)) / 2, by + 30, 'no lasting O₂', 'sm fl08-mut')}
    ${text((X(2.22) + X(0)) / 2, by + 30, 'O₂ always present', 'sm fl08-b')}
    <path class="fl08-lead" d="M${f(X(2.43))},${by} V${by - 20}"/>${text(X(2.43) - 6, by - 26, 'first rise ≈ 2.43', 'sm', 'end')}
    <path class="fl08-lead" d="M${f(X(2.22))},${by} V${by - 20}"/>${text(X(2.22) + 6, by - 26, 'permanent ≈ 2.22', 'sm', 'start')}
    <path class="axis" d="M${X(4)},${by + bh + 12} H${X(0)}"/>
    ${[4, 3, 2, 1, 0].map(g => `<line class="tick" x1="${f(X(g))}" y1="${by + bh + 12}" x2="${f(X(g))}" y2="${by + bh + 20}"/>${text(X(g), by + bh + 42, `${g}`, 'tl')}`).join('')}
    ${text(410, 560, 'billion years ago', 'tl')}${text(410, 590, 'schematic; dates: Poulton et al. 2021', 'fl08-key')}
  `);
}

/* ---------- j · icon sum: two waters and four light steps give O₂, 4 H⁺ and 4 e⁻ ---------- */

function iconsSvg(): string {
  const p = 'fl08j';
  return svg('Icon summary: two waters plus four light steps at PSII give one O₂ to the air, four protons to the lumen and four electrons to the chain', `
    ${defs(p)}<g transform="translate(0 16)">
    ${h2o(80, 232, false, 22)}${h2o(80, 318, false, 22)}${text(80, 392, '2 H₂O', 'lab lab-b')}
    ${text(162, 290, '+', 'fl08-big')}
    ${blob(300, 276, 170, 190, 'blob-ps', 44)}${cluster(290, 316, 0.8)}
    ${[236, 280, 324, 368].map((x, i) => spark(p, x, 196, 70, -100 + i * 4)).join('')}
    ${text(300, 412, 'four light steps', 'lab lab-b')}${text(300, 442, 'at PSII', 'sm')}
    ${text(430, 290, '→', 'fl08-big')}
    ${o2(514, 166, false, 16)}${text(592, 174, 'O₂ to the air', 'sm fl08-b', 'start')}
    ${hp(470, 276)}${hp(500, 276)}${hp(530, 276)}${hp(560, 276)}${text(592, 284, '4 H⁺ to the lumen', 'sm fl08-b', 'start')}
    ${[470, 500, 530, 560].map(x => text(x, 394, 'e⁻', 'lab fl08-e')).join('')}${text(592, 394, '4 e⁻ to the chain', 'sm fl08-b', 'start')}</g>
  `);
}
