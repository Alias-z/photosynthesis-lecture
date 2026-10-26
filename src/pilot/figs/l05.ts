// Slide L05 · Why are leaves green? Confirmed context. Ten figure variants; a–d reuse the liked drawings in ./s5.ts.
// Facts used: FIGURE_BRIEF §Slide 5 and the L05 items of REVIEW_SUMMARY (leaf absorptance, absorption vs action
// spectrum with the red drop after McCree 1971, Chen 2024 meta-analysis). Every curve here is schematic.
import type { PlateText, Variant } from '../types';
import './l05.css';
import { arrow, heads } from '../mechanisms';
import {
  absorb, algaCover, col, coverStrip, eye, f, leafAbs, leafCells, leafSvg, lightHeads, line, NAME, paletteSvg, PEAKS, pigmentCard, pigmentRow,
  plantCover, range, ray, rowLabel, rowsSvg, specGrad, subtractionSvg, t, ticks,
  type Pig, type Pt, type RowSpec,
} from './s5';

export const PLATE: PlateText = {
  n: '5',
  status: 'confirmed',
  title: 'Why are leaves green?',
  lead: 'A pigment absorbs a photon only if its energy matches an electron jump in the pigment.',
  points: [
    { claim: 'Absorption spectrum.', text: 'Chlorophyll absorbs blue and red strongly, green weakly<br>Leaves reflect and transmit more green: they look green' },
    { claim: 'Green light.', text: 'Leaves still absorb 50–90 % of green<br>It reaches deeper cells and drives photosynthesis there' },
    { claim: 'Accessory pigments.', text: 'Chlorophyll b and carotenoids widen the absorbed band<br>Red algae: phycoerythrin absorbs green' },
  ],
  refs: [
    { label: 'Terashima et al. 2009', url: 'https://doi.org/10.1093/pcp/pcp034' },
    { label: 'Croce & van Amerongen 2014', url: 'https://doi.org/10.1038/nchembio.1555' },
    { label: 'Xie et al. 2021', url: 'https://doi.org/10.1038/s41598-021-93696-6' },
  ],
};

// Round 2: the lecturer's picks (b, c, d, e), then five combinations of them. Variants a, f–j are still drawn by id.
export const VARIANTS: Variant[] = [
  { id: 'b', name: 'Inside a leaf', anim: true },
  { id: 'c', name: 'Pigment palette' },
  { id: 'd', name: 'Rows' },
  { id: 'e', name: 'Absorbed vs used' },
  { id: 'k', name: 'Rows + leaf' },
  { id: 'l', name: 'Why green works' },
  { id: 'm', name: 'Leaf + palette', anim: true },
  { id: 'n', name: 'Gap vs use' },
  { id: 'o', name: 'Three columns' },
];

export function draw(id: string): string {
  switch (id) {
    case 'k': return rowsLeafSvg();
    case 'l': return whySvg();
    case 'm': return leafPaletteSvg();
    case 'n': return gapUseSvg();
    case 'o': return columnsSvg();
    case 'b': return leafSvg('fl05b');
    case 'c': return paletteSvg('fl05c');
    case 'd': return rowsSvg('fl05d');
    case 'e': return actionSvg();
    case 'f': return wheelSvg();
    case 'g': return fatesSvg();
    case 'h': return termSvg();
    case 'i': return cropsSvg();
    case 'j': return tubeSvg();
    default: return subtractionSvg('fl05a');
  }
}

/* ---------- shared pieces ---------- */

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** Smooth curve through knots (cubic Hermite with Catmull–Rom tangents). */
function smooth(k: Array<[number, number]>): (x: number) => number {
  return (x: number): number => {
    if (x <= k[0][0]) return k[0][1];
    if (x >= k[k.length - 1][0]) return k[k.length - 1][1];
    let i = 0;
    while (x > k[i + 1][0]) i++;
    const p0 = k[Math.max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[Math.min(k.length - 1, i + 2)];
    const w = p2[0] - p1[0], s = (x - p1[0]) / w;
    const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * w, m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * w;
    return (2 * s ** 3 - 3 * s ** 2 + 1) * p1[1] + (s ** 3 - 2 * s ** 2 + s) * m1 + (-2 * s ** 3 + 3 * s ** 2) * p2[1] + (s ** 3 - s ** 2) * m2;
  };
}

/** An amber glow: where light was absorbed. */
const glowDefs = (p: string): string =>
  `<defs><radialGradient id="${p}-glow"><stop offset="0" stop-color="#f2b705" stop-opacity=".9"/><stop offset="1" stop-color="#f2b705" stop-opacity="0"/></radialGradient></defs>`;
const glow = (p: string, x: number, y: number, r = 20): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${p}-glow)"/><circle class="f5-glow-core" cx="${f(x)}" cy="${f(y)}" r="${f(r / 4)}"/>`;

/* ---------- 5E · absorption vs action spectrum, side by side ---------- */

// Schematic action spectrum of leaves after McCree 1971: broad, a shallow dip in green, a steep fall past the red (the red drop).
const ACTION: Array<[number, number]> = [
  [400, 0.6], [430, 0.74], [450, 0.76], [480, 0.68], [510, 0.66], [550, 0.71], [580, 0.82], [610, 0.95], [630, 1],
  [660, 0.97], [680, 0.86], [695, 0.55], [710, 0.24], [725, 0.08], [740, 0.03],
];

function actionSvg(): string {
  const p = 'fl05e';
  return svg('Side by side: chlorophyll a and b absorb little green light, yet the action spectrum of leaves shows green still drives photosynthesis, with a steep red drop', `
    ${actionPanels(p, 162, 410, 70)}
    ${t(400, 566, 'schematic · pigments in solvent · action spectrum after McCree 1971', 'tiny f5-tiny')}
  `);
}

/** 5E's two panels (absorption of Chl a and b; action spectrum of leaves), with the curves between top and base and the headings from headY. */
function actionPanels(p: string, top: number, base: number, headY: number, drop = true): string {
  const lo = 400, hi = 740, W = 318;
  const XL = (nm: number): number => 46 + ((nm - lo) / (hi - lo)) * W;
  const XR = (nm: number): number => 452 + ((nm - lo) / (hi - lo)) * W;
  const Y = (v: number): number => base - v * (base - top);
  const nms = range(lo, hi, 2);
  const act = smooth(ACTION);
  const curve = (X: (nm: number) => number, fn: (nm: number) => number): string => line(nms.map((nm): Pt => [X(nm), Y(fn(nm))]));
  const area = (X: (nm: number) => number, d: string): string => `${d} L${f(X(hi))},${base} L${f(X(lo))},${base} Z`;
  const dA = curve(XL, nm => absorb('a', nm)), dB = curve(XL, nm => absorb('b', nm)), dAct = curve(XR, act);
  const band = (X: (nm: number) => number): string =>
    `<rect class="gap-band" x="${f(X(500))}" y="${top - 22}" width="${f(X(580) - X(500))}" height="${base - top + 22}"/>`;
  const strip = (X: (nm: number) => number, id: string): string =>
    `<defs>${specGrad(id, X(lo), X(hi), lo, hi)}</defs><rect x="${f(X(lo))}" y="${base + 6}" width="${W}" height="14" fill="url(#${id})"/>`;
  const brace = (X: (nm: number) => number, s: string): string =>
    `<path class="bracket" d="M${f(X(500))},${base + 62} v8 H${f(X(580))} v-8"/>${t((X(500) + X(580)) / 2, base + 98, s, 'sm lab-b')}`;
  const head = (x: number, s1: string, s2: string): string =>
    `${t(x, headY, s1, 'lab lab-b', 'start')}${t(x, headY + 32, s2, 'sm fl05-mute', 'start')}`;
  const aRed = Y(absorb('a', 662)), bRed = Y(absorb('b', 642));
  // The red-drop note sits where it did in 5E (76 and 64 units above the base when the curves are 236 tall).
  const up = (v: number): number => base - (v / 236) * (base - top);
  const redDrop = drop
    ? `${t(XR(684), up(64), 'red drop', 'sm lab-b', 'end')}
    ${arrow(p, 'ink', `M${f(XR(686))},${up(76)} L${f(XR(699))},${f(Y(act(699)) + 10)}`)}`
    : '';
  return `
    ${heads(p)}
    ${head(46, 'Absorption', 'light the pigments absorb')}
    ${head(452, 'Action spectrum', 'photosynthesis per photon')}
    ${band(XL)}${band(XR)}
    <path class="f5-area f5-area-a" d="${area(XL, dA)}"/>
    <path class="axis" d="M${XL(lo)},${base} H${XL(hi)}"/><path class="axis" d="M${XR(lo)},${base} H${XR(hi)}"/>
    <path class="curve chlb" d="${dB}"/><path class="curve chla" d="${dA}"/>
    ${t(XL(662) + 14, aRed + 10, 'Chl a', 'lab lab-b f5-c-a', 'start')}
    ${t(XL(642) - 14, bRed - 4, 'Chl b', 'lab lab-b f5-c-b', 'end')}
    <defs>${specGrad(`${p}-fill`, XR(lo), XR(hi), lo, hi)}</defs>
    <path d="${area(XR, dAct)}" fill="url(#${p}-fill)" opacity=".32"/>
    <path class="curve fl05-act" d="${dAct}"/>
    ${redDrop}
    ${strip(XL, `${p}-sl`)}${strip(XR, `${p}-sr`)}
    ${ticks(XL, base + 20, base + 48)}${ticks(XR, base + 20, base + 48)}
    ${brace(XL, 'little absorbed')}${brace(XR, 'still drives it')}`;
}

/* ---------- 5F · colour wheel: take away blue and red, and what is left sits opposite them ---------- */

function wheelSvg(): string {
  const p = 'fl05f';
  const cx = 330, cy = 256, Ri = 118, Ro = 184, R1 = 192, R2 = 206;
  // Angle (degrees, 0 = right, clockwise) → wavelength; green sits at the bottom, the purples (red + blue) at the top.
  const K: Array<[number, number]> = [[-62, 700], [-25, 625], [15, 590], [50, 566], [90, 532], [128, 498], [170, 465], [205, 440], [238, 405]];
  const nmAt = (a: number): number => {
    let i = 0;
    while (i < K.length - 2 && a > K[i + 1][0]) i++;
    const [a0, n0] = K[i], [a1, n1] = K[i + 1];
    return n0 + ((a - a0) / (a1 - a0)) * (n1 - n0);
  };
  const rgb = (s: string): number[] => (s.match(/\d+/g) ?? []).map(Number);
  const mix = (a: number[], b: number[], k: number): string => `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(',')})`;
  const V = rgb(col(405)), PU = [150, 52, 128], RD = rgb(col(700));
  const norm = (a: number): number => ((a + 90) % 360 + 360) % 360 - 90; // −90 … 270
  const colourAt = (a: number): string => {
    const b = norm(a);
    if (b >= -62 && b <= 238) return col(nmAt(b));
    const u = ((b < -62 ? b + 360 : b) - 238) / 60;
    return u < 0.5 ? mix(V, PU, u * 2) : mix(PU, RD, (u - 0.5) * 2);
  };
  // What comes back from a leaf, scaled so green = 1 (schematic leaf absorptance from s5).
  const back = (a: number): number => {
    const b = norm(a);
    const nm = b >= -62 && b <= 238 ? nmAt(b) : 700;
    return (1 - leafAbs(nm)) / (1 - leafAbs(550));
  };
  const P = (r: number, a: number): Pt => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const sector = (r0: number, r1: number, a0: number, a1: number): string => {
    const [x0, y0] = P(r1, a0), [x1, y1] = P(r1, a1), [x2, y2] = P(r0, a1), [x3, y3] = P(r0, a0);
    return `M${f(x0)},${f(y0)} A${r1},${r1} 0 0 1 ${f(x1)},${f(y1)} L${f(x2)},${f(y2)} A${r0},${r0} 0 0 0 ${f(x3)},${f(y3)} Z`;
  };
  const steps = range(-90, 268, 2);
  // Colours are pre-mixed with the paper (not drawn with opacity), so overlapping slivers leave no seams.
  const PAPER = [251, 250, 246];
  const faded = (a: number): string => mix(PAPER, rgb(colourAt(a)), 0.1 + 0.9 * back(a) ** 1.7);
  const rim = steps.map(a => `<path d="${sector(R1, R2, a, a + 2.6)}" fill="${colourAt(a + 1)}"/>`).join('');
  const ring = steps.map(a => `<path d="${sector(Ri, Ro, a, a + 2.6)}" fill="${faded(a + 1)}"/>`).join('');
  const [bx, by] = P(R2 + 12, 186), [rx, ry] = P(R2 + 12, -44);
  const [gx, gy] = P(Ro + 4, 84);
  const key = (id: string, x: number, y: number, h: number, op: (nm: number) => number): string =>
    `<defs>${specGrad(id, x, x + 48, 400, 700, op)}</defs><rect class="f5-strip-off" x="${x}" y="${y}" width="48" height="${h}" rx="2"/><rect x="${x}" y="${y}" width="48" height="${h}" rx="2" fill="url(#${id})"/>`;
  return svg('Colour wheel: a leaf takes away blue and red; the light left over is green, the colour opposite them on the wheel', `
    ${lightHeads(p)}
    <circle class="fl05-wheel-bg" cx="${cx}" cy="${cy}" r="${Ro}"/>
    ${rim}${ring}
    <path class="fl05-wheel-edge" d="M${cx - Ri},${cy} a${Ri},${Ri} 0 1 0 ${2 * Ri},0 a${Ri},${Ri} 0 1 0 ${-2 * Ri},0"/>
    ${t(bx - 4, by - 8, 'blue', 'lab lab-b', 'end')}${t(bx - 4, by + 20, 'absorbed', 'sm fl05-mute', 'end')}
    ${t(rx + 14, ry - 10, 'red', 'lab lab-b', 'start')}${t(rx + 14, ry + 18, 'absorbed', 'sm fl05-mute', 'start')}
    <path class="fl05-opp" d="M${cx},${cy - 50} V${cy + 48}"/><circle class="fl05-opp-end" cx="${cx}" cy="${cy - 52}" r="4"/><circle class="fl05-opp-end" cx="${cx}" cy="${cy + 50}" r="4"/>
    ${t(cx, cy - 66, 'blue + red', 'sm lab-b')}
    ${t(cx, cy + 82, 'green', 'sm lab-b')}
    ${t(cx + 14, cy + 8, 'opposite', 'sm fl05-mute', 'start')}
    ${ray(p, 'g', [[gx + 6, gy + 8], [gx + 70, gy + 52], [628, 522]])}
    ${eye(680, 530, 96)}
    ${t(680, 586, 'looks green', 'sm lab-b')}
    ${key(`${p}-k1`, 548, 206, 10, () => 1)}${t(606, 216, 'outer rim:', 'sm fl05-mute', 'start')}${t(606, 242, 'sunlight', 'sm lab-b', 'start')}
    ${key(`${p}-k2`, 548, 274, 22, nm => 0.1 + 0.9 * ((1 - leafAbs(nm)) / (1 - leafAbs(550))) ** 1.7)}${t(606, 290, 'ring:', 'sm fl05-mute', 'start')}
    ${t(606, 316, 'what comes back', 'sm lab-b', 'start')}${t(606, 340, 'from a leaf', 'sm lab-b', 'start')}
    ${t(548, 396, 'Most green is still', 'sm', 'start')}${t(548, 422, 'absorbed: 50–90 %', 'sm', 'start')}
  `);
}

/* ---------- 5G · three fates: reflected, transmitted, absorbed ---------- */

function fatesSvg(): string {
  const p = 'fl05g';
  // A leaf lying flat, seen from slightly above: far edge, near edge, a thin underside for thickness.
  const far = 'M150,318 C214,256 430,232 652,286';
  const near = 'C474,350 262,370 150,318';
  const under = 'M150,318 C262,378 474,358 652,286 C474,366 262,386 150,326 Z';
  const veins = [0.2, 0.36, 0.52, 0.68, 0.82].map(s => {
    const x = 150 + s * 500, y = 318 - s * 32;
    return `M${f(x)},${f(y)} q${f(30 + s * 8)},${f(-26 + s * 4)} ${f(64 - s * 10)},${f(-40 + s * 8)} M${f(x)},${f(y)} q${f(30 + s * 8)},${f(18 - s * 3)} ${f(60 - s * 12)},${f(30 - s * 6)}`;
  }).join(' ');
  const rays = (pts: Pt[], dx: number, dy: number): Pt[] => pts.map(([x, y]): Pt => [x + dx, y + dy]);
  const inc: Pt[] = [[150, 108], [328, 284]];
  const refl: Pt[] = [[364, 270], [622, 104]];
  const trans: Pt[] = [[384, 340], [622, 448]];
  return svg('A leaf in sunlight: most light of every colour is absorbed; the reflected and the transmitted light are both relatively rich in green', `
    ${lightHeads(p)}${glowDefs(p)}
    <defs><linearGradient id="${p}-leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc47f"/><stop offset="1" stop-color="#5f9a4c"/></linearGradient></defs>
    <circle class="fl05-sun" cx="92" cy="74" r="30"/>
    ${range(0, 7, 1).map(i => { const a = (i * Math.PI) / 4; return `<path class="fl05-sunray" d="M${f(92 + 40 * Math.cos(a))},${f(74 + 40 * Math.sin(a))} L${f(92 + 52 * Math.cos(a))},${f(74 + 52 * Math.sin(a))}"/>`; }).join('')}
    ${t(80, 142, 'sunlight', 'f5-note')}
    ${ray(p, 'b', rays(inc, -16, 6), '', true, 5, 20)}${ray(p, 'g', inc, '', true, 5, 20)}${ray(p, 'r', rays(inc, 16, -6), '', true, 5, 20)}
    <path class="fl05-leaf-under" d="${under}"/>
    <path d="${far} ${near} Z" fill="url(#${p}-leaf)" class="fl05-leaf"/>
    <path class="fl05-vein" d="M150,318 C300,300 480,288 652,286"/><path class="fl05-vein fl05-vein-s" d="${veins}"/>
    <path class="fl05-stalk" d="M150,318 C126,326 104,342 84,356"/>
    ${glow(p, 300, 304)}${glow(p, 332, 298)}${glow(p, 364, 300)}
    ${ray(p, 'b', rays(refl, -12, -8), 'f5-faint', true, 4, 18)}${ray(p, 'r', rays(refl, 12, 8), 'f5-faint', true, 4, 18)}${ray(p, 'g', refl)}
    ${eye(686, 90, 92)}
    ${t(686, 150, 'reflected', 'lab lab-b')}${t(686, 176, 'green-rich', 'sm fl05-mute')}
    ${ray(p, 'b', rays(trans, -10, 12), 'f5-faint', true, 4, 18)}${ray(p, 'r', rays(trans, 10, -12), 'f5-faint', true, 4, 18)}${ray(p, 'g', trans)}
    ${eye(686, 450, 92)}
    ${t(686, 508, 'transmitted', 'lab lab-b')}${t(686, 534, 'green-rich too', 'sm fl05-mute')}
    <path class="fl05-lead" d="M196,404 L292,316"/>
    ${t(40, 432, 'absorbed and used', 'lab lab-b', 'start')}
    ${t(40, 462, 'blue and red: 80–95 %', 'sm', 'start')}${t(40, 488, 'green: 50–90 %', 'sm', 'start')}
    ${t(400, 584, 'Looking green does not mean reflecting most green.', 'sm lab-b')}
  `);
}

/* ---------- 5H · the light term of the equation, unpacked ---------- */

function termSvg(): string {
  const p = 'fl05h';
  const lo = 400, hi = 700, x0 = 160, x1 = 720, top = 188, H = 128;
  const X = (nm: number): number => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
  const nms = range(lo, hi, 2);
  const edge = nms.map((nm): Pt => [X(nm), top + (1 - leafAbs(nm)) * H]);
  const used = `M${x0},${top + H} ${line(edge).replace('M', 'L')} L${x1},${top + H} Z`;
  const gx = X(550), gTop = top + (1 - leafAbs(550)) * H;
  return svg('The light term of the photosynthesis equation unpacked: leaves absorb most blue and red and most green too; the green-rich remainder comes back', `
    <defs>${specGrad(`${p}-spec`, x0, x1, lo, hi)}</defs>
    <text class="fl05-eq" x="338" y="78" text-anchor="end"><tspan class="fl05-eq-c">6 CO₂</tspan> + <tspan class="fl05-eq-w">6 H₂O</tspan> +</text>
    <rect class="fl05-lightbox" x="346" y="40" width="108" height="54" rx="14"/>
    <text class="fl05-eq fl05-eq-l" x="400" y="78" text-anchor="middle">light</text>
    <text class="fl05-eq" x="462" y="78" text-anchor="start">→ <tspan class="fl05-eq-c">C₆H₁₂O₆</tspan> + <tspan class="fl05-eq-w">6 O₂</tspan></text>
    <path class="fl05-fan" d="M352,96 L${x0},${top - 6} M448,96 L${x1},${top - 6}"/>
    ${t(400, 138, 'which light?', 'f5-note')}
    <rect class="f5-ghost f5-ghost-dash" x="${x0}" y="${top}" width="${x1 - x0}" height="${H}" rx="3"/>
    <path d="${used}" fill="url(#${p}-spec)"/>
    ${t(gx, top - 12, 'comes back', 'sm lab-b')}<path class="fl05-lead" d="M${f(gx)},${top - 6} V${f(gTop - 4)}"/>
    ${t(x0 - 14, top + H / 2 + 6, 'absorbed', 'lab lab-b', 'end')}${t(x0 - 14, top + H / 2 + 32, 'and used', 'sm fl05-mute', 'end')}
    ${ticks(X, top + H, top + H + 30)}
    ${t(X(445), top + H + 66, '80–95 %', 'sm lab-b')}${t(gx, top + H + 66, '50–90 %', 'sm lab-b')}${t(X(662), top + H + 66, '80–95 %', 'sm lab-b')}
    ${t(x0 - 14, top + H + 66, 'absorbed:', 'sm fl05-mute', 'end')}
    <path class="rule" d="M40,446 H760"/>
    ${t(400, 500, 'The light term: blue, red and most of the green.', 'lab lab-b')}
    ${t(400, 546, 'Green is absorbed least, so what comes back looks green.', 'sm fl05-mute')}
  `);
}

/* ---------- 5I · green grows crops: the myth and the evidence ---------- */

function plant(cx: number, base: number): string {
  const pot = `M${cx - 50},${base - 62} H${cx + 50} L${cx + 40},${base} H${cx - 40} Z`;
  const leaf = (x: number, y: number, rot: number, s = 1): string =>
    `<ellipse class="fl05-plant-leaf" cx="${f(x)}" cy="${f(y)}" rx="${f(30 * s)}" ry="${f(11 * s)}" transform="rotate(${rot} ${f(x)} ${f(y)})"/>`;
  return `<path class="fl05-stem" d="M${cx},${base - 62} C${cx - 4},${base - 120} ${cx + 4},${base - 170} ${cx},${base - 214}"/>
    ${leaf(cx - 28, base - 104, 24)}${leaf(cx + 28, base - 128, -24)}${leaf(cx - 26, base - 156, 28, 0.9)}${leaf(cx + 24, base - 182, -30, 0.8)}${leaf(cx, base - 220, 90, 0.62)}
    <path class="fl05-pot" d="${pot}"/><rect class="fl05-pot-rim" x="${cx - 56}" y="${base - 72}" width="112" height="14" rx="4"/>`;
}

function cropsSvg(): string {
  const p = 'fl05i';
  const xs = [160, 400, 640], base = 470;
  const lamps: Array<['r' | 'g' | 'b', string]> = [['r', 'red'], ['g', 'green'], ['b', 'blue']];
  const lamp = (cx: number, c: 'r' | 'g' | 'b', name: string): string =>
    `<path class="fl05-cone fl05-cone-${c}" d="M${cx - 58},${168} H${cx + 58} L${cx + 84},${base - 80} H${cx - 84} Z"/>
    <rect class="fl05-lamp fl05-lamp-${c}" x="${cx - 66}" y="146" width="132" height="22" rx="11"/>
    ${t(cx, 132, `more ${name}`, `sm lab-b fl05-c-${c}`)}
    ${[-34, 0, 34].map(dx => ray(p, c, [[cx + dx, 176], [cx + dx * 1.25, 226]], '', true, 4, 16)).join('')}`;
  return svg('Myth: plants do not use green light. Evidence: in a meta-analysis of 17 crops, green light was as effective as red and blue light for biomass', `
    ${lightHeads(p)}
    <rect class="fl05-myth-chip" x="40" y="30" width="78" height="38" rx="19"/>${t(79, 56, 'myth', 'sm lab-b fl05-clay')}
    <text class="lab fl05-strike" x="134" y="58">Plants do not use green light.</text>
    ${lamps.map(([c, n], i) => lamp(xs[i], c, n)).join('')}
    ${xs.map(x => plant(x, base)).join('')}
    ${t(280, 338, '≈', 'fl05-approx')}${t(520, 338, '≈', 'fl05-approx')}
    <rect class="fl05-ev-chip" x="40" y="500" width="110" height="38" rx="19"/>${t(95, 526, 'evidence', 'sm lab-b fl05-ev')}
    ${t(166, 526, 'Meta-analysis, 17 crops: green light was', 'sm', 'start')}
    ${t(166, 556, 'as effective as red and blue for biomass.', 'sm', 'start')}
    ${t(760, 592, 'Chen et al. 2024 · schematic plants', 'tiny f5-tiny', 'end')}
  `);
}

/* ---------- 5J · test tube vs leaf: scattering lengthens green's path ---------- */

function tubeSvg(): string {
  const p = 'fl05j';
  const sy = 214, sh = 156;
  // Solution slab: pigment molecules spread evenly.
  const solDots = range(0, 59, 1).map(i => {
    const x = 58 + (i % 15) * 20 + ((Math.floor(i / 15) % 2) * 10), y = sy + 24 + Math.floor(i / 15) * 36;
    return `<circle class="fl05-mol" cx="${x}" cy="${y}" r="3"/>`;
  }).join('');
  // Leaf slab: palisade columns on top, spongy cells below, chloroplasts along the walls.
  const L = 440, R = 760;
  const pal = range(0, 5, 1).map(i => {
    const x = L + 6 + i * 53;
    const chl = [x + 10, x + 37].flatMap(cx => [sy + 18, sy + 40, sy + 62].map(cy => `<ellipse class="f5-chl" cx="${cx}" cy="${cy}" rx="4.5" ry="7"/>`)).join('');
    return `<rect class="f5-cell" x="${x}" y="${sy + 6}" width="47" height="76" rx="18"/>${chl}`;
  }).join('');
  const sp: Array<[number, number]> = [[470, 118], [536, 126], [604, 116], [668, 128], [732, 118], [500, 152], [570, 150], [640, 154], [710, 150]];
  const spongy = sp.map(([x, dy]) => `<ellipse class="f5-cell" cx="${x}" cy="${sy + dy}" rx="26" ry="15"/><ellipse class="f5-chl" cx="${x - 14}" cy="${sy + dy}" rx="4" ry="6"/><ellipse class="f5-chl" cx="${x + 14}" cy="${sy + dy}" rx="4" ry="6"/>`).join('');
  return svg('The same pigments in solution and in a leaf: in solution green passes straight through; in a leaf scattering lengthens its path, so most green is absorbed', `
    ${lightHeads(p)}${glowDefs(p)}
    ${t(200, 44, 'in solution', 'lab lab-b')}${t(200, 74, 'straight path', 'sm fl05-mute')}
    ${t(600, 44, 'in a leaf', 'lab lab-b')}${t(600, 74, 'scattered, longer path', 'sm fl05-mute')}
    <rect class="fl05-glass" x="40" y="${sy}" width="320" height="${sh}" rx="8"/>${solDots}
    <rect class="fl05-leafbox" x="${L}" y="${sy}" width="${R - L}" height="${sh}" rx="8"/>${pal}${spongy}
    ${ray(p, 'b', [[100, 100], [100, sy + 34]], '', false)}${glow(p, 100, sy + 36)}
    ${ray(p, 'r', [[180, 100], [180, sy + 54]], '', false)}${glow(p, 180, sy + 56)}
    ${ray(p, 'g', [[290, 100], [290, 470]])}
    ${ray(p, 'b', [[500, 100], [500, sy + 26]], '', false)}${glow(p, 500, sy + 28)}
    ${ray(p, 'r', [[580, 100], [580, sy + 44]], '', false)}${glow(p, 580, sy + 46)}
    ${ray(p, 'g', [[690, 100], [690, sy + 30], [646, sy + 74], [724, sy + 106], [668, sy + 132], [704, sy + 148]], '', false)}${glow(p, 704, sy + 148)}
    ${t(306, 456, 'green', 'sm lab-b', 'start')}${t(306, 482, 'passes through', 'sm', 'start')}
    ${t(600, 420, 'green is', 'sm lab-b')}${t(600, 446, 'mostly caught', 'sm lab-b')}
    <path class="rule" d="M40,512 H760"/>
    ${t(400, 548, 'Same pigments, longer path: scattering lets a leaf', 'lab')}
    ${t(400, 582, 'absorb 50–90 % of green light.', 'lab')}
  `);
}

/* ================= Round 2: combinations of the picked 5B (leaf), 5C (palette), 5D (rows) and 5E (absorbed vs used) ================= */

/** 5B's leaf tissue (its first n columns), scaled by s, with the cuticle's left end at (x0, y0). P maps a 5B point onto the figure. */
function leafAt(n: number, s: number, x0: number, y0: number, over = 8): { g: string; P: (bx: number, by: number) => Pt } {
  const P = (bx: number, by: number): Pt => [x0 + (bx - 20) * s, y0 + (by - 152) * s];
  return { P, g: `<g transform="translate(${f(x0 - 20 * s)} ${f(y0 - 152 * s)}) scale(${s})">${leafCells(n, over)}</g>` };
}

/** Light into a four-column piece of 5B's leaf: blue and red stop in the top cells; green goes deeper, scatters and is absorbed there. */
function narrowRays(p: string, P: (bx: number, by: number) => Pt, top: number, r: number): string {
  const g = (bx: number, by: number): string => { const [x, y] = P(bx, by); return glow(p, x, y, r); };
  const [bx, by] = P(45, 212), [rx, ry] = P(95, 236), S = P(145, 340);
  return `${ray(p, 'b', [[bx, top], [bx, by]], '', false)}${g(45, 214)}
    ${ray(p, 'r', [[rx, top], [rx, ry]], '', false)}${g(95, 238)}
    ${ray(p, 'g', [[S[0], top], S], '', false)}
    ${ray(p, 'g', [S, P(100, 396), P(116, 418), P(88, 446)], '', false)}${g(86, 448)}
    ${ray(p, 'g', [S, P(196, 394), P(206, 420), P(166, 452)], '', false)}${g(164, 454)}`;
}

/** 5B's own light paths (blue, red, green scattering and partly coming back out), mapped by P; the exit ray ends at 5B's (618, 74). */
function leafRays(p: string, P: (bx: number, by: number) => Pt, top: number, r: number, exit = true): string {
  const g = (bx: number, by: number): string => { const [x, y] = P(bx, by); return glow(p, x, y, r); };
  const S = P(300, 340), at = (x: number): number => P(x, 0)[0];
  return `${ray(p, 'b', [[at(96), top], P(96, 212)], '', false)}${g(96, 214)}
    ${ray(p, 'r', [[at(196), top], P(196, 236)], '', false)}${g(196, 238)}
    ${ray(p, 'g', [[S[0], top], S], '', false)}
    ${ray(p, 'g', [S, P(250, 396), P(270, 418), P(228, 446)], '', false)}${g(226, 448)}
    ${ray(p, 'g', [S, P(356, 396), P(372, 420), P(336, 458)], '', false)}${g(334, 460)}
    ${exit ? ray(p, 'g', [S, P(390, 300), P(404, 252), P(438, 150), P(490, 104), P(618, 74)]) : ''}`;
}

/** The glow key: what an amber dot means. */
const glowKey = (p: string, x: number, y: number, s = 'absorbed'): string => `${glow(p, x, y + 2, 16)}${t(x + 24, y + 9, s, 'sm f5-mute', 'start')}`;

/** Coloured pigment names joined by "+", as in 5C. */
const who = (x: number, y: number, ks: Pig[], anchor: 'start' | 'middle' | 'end' = 'middle', lead = ''): string =>
  `<text class="sm fl05-who" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${lead ? `<tspan class="f5-mute">${lead}</tspan>` : ''}${ks.map(k => `<tspan class="f5-c-${k}">${k === 'car' ? 'carotenoids' : NAME[k]}</tspan>`).join('<tspan class="f5-mute"> + </tspan>')}</text>`;

/* ---------- 5K · 5D's rows with a phycoerythrin row, and a piece of 5B's leaf ---------- */

function rowsLeafSvg(): string {
  const p = 'fl05k';
  const lo = 400, hi = 700, x0 = 178, x1 = 516;
  const X = (nm: number): number => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
  const rows: RowSpec[] = (['a', 'b', 'car', 'pe'] as Pig[]).map((k, i) => ({ k, top: 14 + i * 102 + (k === 'pe' ? 12 : 0), h: 90 }));
  const pe = rows[3], stripY = 428, g0 = X(500), g1 = X(580);
  const bx = 568, bw = 222, cx = bx + bw / 2;
  const leaf = leafAt(4, 0.8, cx - 80, 172);
  return svg('Absorption of chlorophyll a, chlorophyll b and beta-carotene, one row each, leave a green gap that phycoerythrin of red algae fills; beside them, a piece of leaf where blue and red are absorbed in the top cells and green goes deeper', `
    ${lightHeads(p)}${glowDefs(p)}
    <defs>${specGrad(`${p}-spec`, x0, x1, lo, hi)}</defs>
    <rect class="gap-band" x="${f(g0)}" y="6" width="${f(g1 - g0)}" height="${stripY - 6}"/>
    <path class="f5-sep" d="M20,${pe.top - 12} H${x1}"/>
    ${rows.map(r => pigmentRow(p, r, X, lo, hi, x0, x1, PEAKS[r.k], 34)).join('')}
    ${rows.slice(0, 3).map(r => rowLabel(r.k, 162, r.top + r.h - 30)).join('')}
    ${t(162, pe.top + 44, 'phycoerythrin', 'sm lab-b f5-c-pe', 'end')}${t(162, pe.top + 70, 'red algae', 'sm f5-alga', 'end')}
    ${t(X(553), pe.top + 21, '≈ 540–565', 'pk f5-c-pe')}
    <rect x="${x0}" y="${stripY}" width="${x1 - x0}" height="18" fill="url(#${p}-spec)"/>
    ${ticks(X, stripY + 18, stripY + 46)}
    <path class="bracket" d="M${f(g0)},${stripY + 58} v10 H${f(g1)} v-10"/>
    ${t((x0 + x1) / 2 - 20, stripY + 98, 'absorbed least by leaf pigments', 'lab')}
    ${t((x0 + x1) / 2 - 20, stripY + 128, 'but caught by phycoerythrin', 'sm f5-alga')}
    ${t(20, 592, 'schematic · Chl and β-carotene in solvent', 'tiny f5-tiny', 'start')}
    <rect class="box" x="${bx}" y="8" width="${bw}" height="580" rx="16"/>
    ${t(cx, 46, 'in a leaf', 'lab lab-b')}
    ${leaf.g}${narrowRays(p, leaf.P, 100, 18)}
    ${glowKey(p, cx - 52, 506)}
  `);
}

/* ---------- 5L · 5E's absorbed vs used, with phycoerythrin under the pigments and 5B's leaf under the action spectrum ---------- */

function whySvg(): string {
  const p = 'fl05l';
  const top = 112, base = 240;
  const XL = (nm: number): number => 46 + ((nm - 400) / 340) * 318;
  const peTop = 384, peH = 96;
  const leaf = leafAt(4, 0.6, 462, 394);
  return svg('Chlorophyll a and b absorb little green light, yet the action spectrum of a leaf shows green still drives photosynthesis; below, phycoerythrin of red algae absorbs green, and a piece of leaf shows green reaching deeper cells', `
    ${lightHeads(p)}${glowDefs(p)}
    ${actionPanels(p, top, base, 38, false)}
    <path class="f5-sep" d="M${XL(400)},356 H770"/>
    <rect class="gap-band" x="${f(XL(500))}" y="${peTop - 6}" width="${f(XL(580) - XL(500))}" height="${peH + 6}"/>
    ${pigmentRow(p, { k: 'pe', top: peTop, h: peH }, XL, 400, 740, XL(400), XL(740), [], 24)}
    ${t(XL(612), peTop + 44, 'phycoerythrin', 'sm lab-b f5-c-pe', 'start')}${t(XL(612), peTop + 70, 'red algae', 'sm f5-alga', 'start')}
    ${t(46, 548, 'schematic · pigments in solvent', 'tiny f5-tiny', 'start')}${t(46, 570, 'action spectrum after McCree 1971', 'tiny f5-tiny', 'start')}
    ${leaf.g}${narrowRays(p, leaf.P, 368, 15)}
    ${glowKey(p, 608, 474)}
  `);
}

/* ---------- 5M · 5B's leaf as the hero, 5C's pigments along the top ---------- */

function leafPaletteSvg(): string {
  const p = 'fl05m';
  const s = 0.86, y0 = 250;
  const leaf = leafAt(10, s, 20, y0);
  const P = leaf.P;
  const tile = (k: Pig, i: number, sub: string, alga = false): string => {
    const x = 20 + i * 192, w = 184, y = 8;
    return `<rect class="box${alga ? ' f5-box-alga' : ''}" x="${x}" y="${y}" width="${w}" height="98" rx="14"/>
      ${t(x + 14, y + 32, k === 'car' ? 'β-carotene' : NAME[k], `sm lab-b f5-c-${k}`, 'start')}
      ${coverStrip(`${p}-t${k}`, x + 14, x + w - 14, y + 44, 18, 3, nm => absorb(k, nm))}
      ${t(x + 14, y + 86, sub, alga ? 'sm f5-alga' : 'sm f5-mute', 'start')}`;
  };
  const [ex, ey] = P(686, 66);
  const bx = P(534, 0)[0], lx = bx + 22;
  const bracket = (y0b: number, y1b: number): string => `<path class="bracket" d="M${f(bx)},${f(P(0, y0b)[1])} h8 V${f(P(0, y1b)[1])} h-8"/>`;
  const yt = P(0, 246)[1], yd = P(0, 394)[1];
  return svg('Four pigments each colour their own part of the spectrum; below, a leaf cross-section: blue and red light are absorbed in the top cells, green goes deeper, scatters, is mostly absorbed there, and some comes back out', `
    ${lightHeads(p)}${glowDefs(p)}<g transform="translate(0 22)">
    ${tile('a', 0, '430 · 662 nm')}${tile('b', 1, '453 · 642 nm')}${tile('car', 2, '450 nm')}${tile('pe', 3, 'red algae', true)}
    ${t(780, 132, 'coloured = light the pigment absorbs', 'sm f5-mute', 'end')}
    ${t(84, 160, 'sunlight', 'f5-note', 'start')}
    ${leaf.g}${leafRays(p, P, 172, 20)}
    ${eye(ex, ey, 96)}
    ${t(lx - 4, ey + 62, 'some green', 'sm lab-b', 'start')}${t(lx - 4, ey + 88, 'comes back out', 'sm', 'start')}
    ${bracket(186, 322)}${t(lx, yt, 'top cells', 'lab lab-b', 'start')}${t(lx, yt + 28, 'absorb blue and red', 'sm', 'start')}
    ${bracket(330, 482)}${t(lx, yd, 'deeper cells', 'lab lab-b', 'start')}${t(lx, yd + 28, 'green scatters and', 'sm', 'start')}${t(lx, yd + 54, 'is mostly absorbed', 'sm', 'start')}
    ${glowKey(p, lx + 12, yd + 86)}
    </g>
  `);
}

/* ---------- 5N · 5C's land plant vs red alga, under 5E's action spectrum, on one wavelength axis ---------- */

function gapUseSvg(): string {
  const p = 'fl05n';
  const lo = 400, hi = 700, x0 = 214, x1 = 744;
  const X = (nm: number): number => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
  const aTop = 44, aBase = 196;
  const act = smooth(ACTION);
  const d = line(range(lo, hi, 2).map((nm): Pt => [X(nm), aBase - act(nm) * (aBase - aTop)]));
  const b1 = 290, b2 = 432, bh = 42;
  const g0 = X(500), g1 = X(580), lx = 194;
  return svg('A land plant\'s pigments leave a green gap that a red alga\'s phycoerythrin fills; above, on the same wavelength axis, the action spectrum of a leaf shows that green light still drives photosynthesis', `
    <defs>${specGrad(`${p}-fill`, x0, x1, lo, hi)}</defs>
    <rect class="gap-band" x="${f(g0)}" y="32" width="${f(g1 - g0)}" height="${b2 + bh - 32}"/>
    <path d="${d} L${x1},${aBase} L${x0},${aBase} Z" fill="url(#${p}-fill)" opacity=".32"/>
    <path class="axis" d="M${x0},${aBase} H${x1}"/><path class="curve fl05-act" d="${d}"/>
    ${t(lx, 104, 'action', 'lab lab-b', 'end')}${t(lx, 132, 'spectrum', 'lab lab-b', 'end')}${t(lx, 158, 'of a leaf', 'sm f5-mute', 'end')}
    ${t((g0 + g1) / 2, 58, 'still used', 'sm lab-b')}
    ${who(x0, b1 - 34, ['a', 'b'], 'start')}${who(x0, b1 - 10, ['car'], 'start', '+ ')}
    ${who(X(655), b1 - 10, ['a', 'b'])}
    ${coverStrip(`${p}-s1`, x0, x1, b1, bh, 4, plantCover)}${t(lx, b1 + 29, 'land plant', 'lab lab-b', 'end')}
    ${t((g0 + g1) / 2, b1 + 28, 'green gap', 'sm f5-mute')}
    ${who(x0, b2 - 34, ['a'], 'start')}${who(x0, b2 - 10, ['car'], 'start', '+ ')}
    ${who((g0 + g1) / 2, b2 - 10, ['pe'])}${who(X(662), b2 - 10, ['a'])}
    ${coverStrip(`${p}-s2`, x0, x1, b2, bh, 4, algaCover)}${t(lx, b2 + 29, 'red alga', 'lab lab-b', 'end')}
    ${ticks(X, b2 + bh, b2 + bh + 28)}
    ${t(400, 568, 'schematic · action spectrum after McCree 1971 · bars: coloured = light the pigments absorb', 'tiny f5-tiny')}
  `);
}

/* ---------- 5O · three columns, one per page point: pigments (5D) · leaf (5B) · red algae (5C) ---------- */

function columnsSvg(): string {
  const p = 'fl05o';
  const lo = 400, hi = 700;
  // Column 1 (x 36–270): one row per pigment.
  const X1 = (nm: number): number => 36 + ((nm - lo) / (hi - lo)) * 228;
  const rows: RowSpec[] = (['a', 'b', 'car'] as Pig[]).map((k, i) => ({ k, top: 64 + i * 106, h: 96 }));
  const s1 = 380;
  // Column 2 (x 300–500): a piece of leaf.
  const leaf = leafAt(4, 0.85, 400 - 85, 102);
  // Column 3 (x 520–776): phycoerythrin card, then land plant vs red alga, on one axis.
  const c3 = 520, X3 = (nm: number): number => 534 + ((nm - lo) / (hi - lo)) * 216;
  const peBase = 200, peD = line(range(lo, hi, 2).map((nm): Pt => [X3(nm), peBase - absorb('pe', nm) * 56]));
  const k1 = 292, k2 = 366, kh = 28;
  const c1x = (36 + 264) / 2, c3x = (c3 + 776) / 2;
  return svg('Three columns: chlorophyll a, chlorophyll b and beta-carotene each absorb their own colours; in a leaf, green reaches deeper cells and is still absorbed; red algae add phycoerythrin, which fills the green gap', `
    ${lightHeads(p)}${glowDefs(p)}<g transform="translate(0 60)">
    <defs>${specGrad(`${p}-spec`, X1(lo), X1(hi), lo, hi)}</defs>
    ${t(c1x, 36, 'Pigments', 'lab lab-b')}${t(400, 36, 'In a leaf', 'lab lab-b')}${t(c3x, 36, 'Red algae', 'lab lab-b')}
    <rect class="gap-band" x="${f(X1(500))}" y="56" width="${f(X1(580) - X1(500))}" height="${s1 - 56}"/>
    ${rows.map(r => pigmentRow(p, r, X1, lo, hi, X1(lo), X1(hi), PEAKS[r.k], 30) + t(120, r.top + 26, NAME[r.k], `lab lab-b f5-c-${r.k}`, 'start')).join('')}
    <rect x="${f(X1(lo))}" y="${s1}" width="${f(X1(hi) - X1(lo))}" height="16" fill="url(#${p}-spec)"/>
    ${ticks(X1, s1 + 16, s1 + 44)}
    ${leaf.g}${narrowRays(p, leaf.P, 56, 18)}
    ${glowKey(p, 342, 432)}
    <rect class="box f5-box-alga" x="${c3}" y="58" width="256" height="176" rx="16"/>
    ${t(c3 + 14, 94, 'phycoerythrin', 'f5-name f5-c-pe', 'start')}${t(c3 + 14, 122, '≈ 540–565 nm', 'sm f5-mute', 'start')}
    <path class="f5-area f5-area-pe" d="${peD} L${f(X3(hi))},${peBase} L${f(X3(lo))},${peBase} Z"/>
    <path class="curve f5-mini f5-pe" d="${peD}"/>
    ${coverStrip(`${p}-pe`, X3(lo), X3(hi), peBase + 6, 18, 3, nm => absorb('pe', nm))}
    <rect class="gap-band" x="${f(X3(500))}" y="${k1 - 8}" width="${f(X3(580) - X3(500))}" height="${k2 + kh - k1 + 8}"/>
    ${t(X3(lo), k1 - 12, 'land plant', 'sm lab-b', 'start')}${coverStrip(`${p}-k1`, X3(lo), X3(hi), k1, kh, 4, plantCover)}
    ${t((X3(500) + X3(580)) / 2, k1 + 21, 'gap', 'sm f5-mute')}
    ${t(X3(lo), k2 - 12, 'red alga', 'sm lab-b', 'start')}${coverStrip(`${p}-k2`, X3(lo), X3(hi), k2, kh, 4, algaCover)}
    ${t(X3(lo), k2 + kh + 30, 'coloured = absorbed', 'sm f5-mute', 'start')}
    </g>
    ${t(400, 584, 'schematic · Chl and β-carotene in solvent', 'tiny f5-tiny')}
  `);
}
