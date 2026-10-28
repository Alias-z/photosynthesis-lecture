// Slide 12 figure concepts. What each must show is in research/figure-briefs/FIGURE_BRIEF.md.
// Numbers used, and no others: absorption fs; Sₙ→S₁ heat < 1 ps; trapping by an open PSII in leaves ≈ 0.3 ns; S₁ lifetime ns;
// fluorescence ≈ 685 nm; triplet µs and longer. Every other step is shown without a duration.
// One ink per exit in every concept: photochemistry green, heat grey wave, fluorescence red wave,
// spin flip / triplet clay dashed, excitation energy amber glow, carotenoid orange chain.
import { molecule } from '../illus';
import { rcDot, text as t, wave } from '../mechanisms';
import './s12.css';

export const VARIANTS = [
  { id: 'a', name: 'Tank' },
  { id: 'b', name: 'Levels + times' },
  { id: 'c', name: 'Levels + clock' },
  { id: 'd', name: 'Open vs closed' },
  { id: 'e', name: 'Race lanes' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return levelsTimesSvg();
    case 'c': return levelsClockSvg();
    case 'd': return openClosedSvg();
    case 'e': return raceSvg();
    default: return tankSvg();
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'green' | 'grey' | 'red' | 'blue' | 'clay' | 'amber' | 'orange';
const KS: K[] = ['ink', 'green', 'grey', 'red', 'blue', 'clay', 'amber', 'orange'];
type Sc = 'fs' | 'ps' | 'ns' | 'us';
type Anchor = 'start' | 'middle' | 'end';

/** Arrowheads in each ink and the amber glow of excitation energy, prefixed per figure. */
const defs = (p: string): string =>
  `<defs>${KS.map(k => `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="f12-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" class="f12-g0"/><stop offset=".45" class="f12-g1"/><stop offset="1" class="f12-g2"/></radialGradient></defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="f12-ar f12-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;

/** A wavy arrow: light in its colour, heat in grey. */
const wv = (p: string, k: K, x0: number, y0: number, x1: number, y1: number, amp = 6, n = 6, cls = ''): string =>
  `<path class="f12-ar f12-k-${k}${cls ? ` ${cls}` : ''}" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-${k})"/>`;

const lvl = (x0: number, x1: number, y: number): string => `<path class="f12-lvl" d="M${x0},${y} H${x1}"/>`;

/** A time pill; its colour deepens from fs to µs, and the text always says the time. */
function badge(x: number, y: number, s: string, sc: Sc, anchor: Anchor = 'middle'): string {
  const w = Math.round(s.length * 10.2 + 26), x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<rect class="tb tb-${sc}" x="${x0}" y="${y - 15}" width="${w}" height="30" rx="15"/>${t(x0 + w / 2, y + 6.5, s, 'f12-bt')}`;
}

const glow = (p: string, x: number, y: number, r = 20): string =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p}-glow)"/><circle class="f12-exc" cx="${x}" cy="${y}" r="${Math.max(4, r * 0.3)}"/>`;

const num = (x: number, y: number, n: string): string =>
  `<circle class="f12-num" cx="${x}" cy="${y}" r="13"/>${t(x, y + 6, n, 'f12-nt')}`;

/** Reaction centre: a green photosystem blob with the + – charge pair. */
const rc = (x: number, y: number, w: number, h: number): string =>
  `<rect class="blob-ps" x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(26, h / 2)}"/>`;

/** Singlet oxygen in the clay danger box, drawn as an O₂ molecule. */
const o2box = (x: number, y: number, w = 96, h = 72): string =>
  `<rect class="ros" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>${molecule(x + w / 2, y + 22, 'OO', 10)}${t(x + w / 2, y + h - 12, '¹O₂', 'f12-h')}`;

/** A carotenoid: a polyene zigzag with a ring at each end. */
function carotenoid(x: number, y: number, len: number): string {
  const r = 8, hex = (cx: number): string =>
    `<path class="f12-car-ring" d="${Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${(cx + r * Math.cos((Math.PI / 3) * i)).toFixed(1)},${(y + r * Math.sin((Math.PI / 3) * i)).toFixed(1)}`).join('')}Z"/>`;
  const a = x + r, b = x + len - r, n = Math.max(4, Math.round((b - a) / 9));
  const zz = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${(a + ((b - a) * i) / n).toFixed(1)},${y + (i % 2 ? -5 : 5)}`).join('');
  return `<path class="f12-car" d="${zz}"/>${hex(x)}${hex(x + len)}`;
}

/** A filled arrow of a given shaft width, for drawing how much flows down each route. */
function fat(x0: number, y0: number, x1: number, y1: number, w: number, cls: string): string {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const hl = Math.max(14, w * 0.9 + 10), hw = w / 2 + Math.max(7, w * 0.42), bx = x1 - ux * hl, by = y1 - uy * hl;
  const P = (x: number, y: number, o: number): string => `${(x + nx * o).toFixed(1)},${(y + ny * o).toFixed(1)}`;
  return `<path class="${cls}" d="M${P(x0, y0, w / 2)} L${P(bx, by, w / 2)} L${P(bx, by, hw)} L${x1},${y1} L${P(bx, by, -hw)} L${P(bx, by, -w / 2)} L${P(x0, y0, -w / 2)}Z"/>`;
}

/** A wave of a given stroke width with a filled head, for heat and light drawn to width. */
function fatWave(x0: number, y0: number, x1: number, y1: number, w: number, k: 'grey' | 'red' | 'clay', amp = 7, n = 4): string {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const hl = Math.max(13, w * 1.3 + 8), hw = w / 2 + Math.max(6, w * 0.6), bx = x1 - ux * hl, by = y1 - uy * hl;
  const body = k === 'clay' ? `M${x0},${y0} L${(bx + ux * 2).toFixed(1)},${(by + uy * 2).toFixed(1)}` : wave(x0, y0, bx + ux * 2, by + uy * 2, amp, n);
  return `<path class="f12-w-${k}" style="stroke-width:${w}px" d="${body}"/>` +
    `<path class="f12-f-${k}" d="M${(bx + nx * hw).toFixed(1)},${(by + ny * hw).toFixed(1)} L${x1},${y1} L${(bx - nx * hw).toFixed(1)},${(by - ny * hw).toFixed(1)}Z"/>`;
}

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- 12A · tank with four drains ---------- */

function tankSvg(): string {
  const p = 'f12a';
  const x0 = 262, x1 = 478, y0 = 160, y1 = 392, wl = 222, r = 26;
  const body = `M${x0},${y0} V${y1 - r} Q${x0},${y1} ${x0 + r},${y1} H${x1 - r} Q${x1},${y1} ${x1},${y1 - r} V${y0}`;
  const surf = Array.from({ length: 25 }, (_, i) => `${i ? 'L' : 'M'}${(x0 + 2 + ((x1 - x0 - 4) * i) / 24).toFixed(1)},${(wl + Math.sin(i * 1.1) * 2.2).toFixed(1)}`).join('');
  const water = `${surf} L${x1 - 1.5},${y1 - r} Q${x1 - 1.5},${y1 - 1.5} ${x1 - r},${y1 - 1.5} H${x0 + r} Q${x0 + 1.5},${y1 - 1.5} ${x0 + 1.5},${y1 - r}Z`;
  // big pipe (photochemistry) on the right, valve pipe (NPQ) on the left, drip nozzle at the bottom
  const big = { y: 316, h: 48, x: 600 }, vp = { y: 290, h: 26, x: 150 }, nz = 352;
  const chevron = (x: number): string => `<path class="f12-flow" d="M${x - 6},${big.y + 14} L${x + 4},${big.y + big.h / 2} L${x - 6},${big.y + big.h - 14}"/>`;
  return svg('A tank of excitation energy with four drains: photochemistry, heat through an adjustable valve, a small fluorescence leak, and a slow drip into a triplet bucket that makes singlet oxygen', `
    ${defs(p)}<g transform="translate(0 10)">
    <path class="f12-glass" d="${body}"/>
    <path class="f12-water" d="${water}"/><path class="f12-surf" d="${surf}"/>
    <rect class="f12-water" x="${x1 - 3}" y="${big.y}" width="${big.x - x1 + 6}" height="${big.h}"/>
    <path class="f12-pipe-o" d="M${x1},${big.y} H${big.x} M${x1},${big.y + big.h} H${big.x}"/>
    ${chevron(514)}${chevron(546)}${chevron(578)}
    <rect class="f12-water" x="${vp.x}" y="${vp.y}" width="${x0 - vp.x + 3}" height="${vp.h}"/>
    <path class="f12-pipe-o" d="M${x0},${vp.y} H${vp.x} M${x0},${vp.y + vp.h} H${vp.x}"/>
    <rect class="f12-water" x="${nz - 4}" y="${y1 - 3}" width="8" height="20"/><path class="f12-pipe-o" d="M${nz - 5},${y1} V${y1 + 16} M${nz + 5},${y1} V${y1 + 16}"/>
    <path class="f12-glass-o" d="${body}"/>
    ${glow(p, 298, 254, 15)}${glow(p, 446, 252, 15)}${glow(p, 300, 366, 15)}${glow(p, 440, 362, 15)}
    ${t(370, 278, 'excited', 'f12-h')}${t(370, 304, 'chlorophyll (S₁)', 'f12-h')}${badge(370, 340, 'drains in ns', 'ns')}

    <path class="f12-glass" d="M322,104 L356,142 V162 H384 V142 L418,104"/>
    ${wv(p, 'red', 70, 66, 344, 112, 6, 9)}${wv(p, 'blue', 70, 128, 340, 124, 6, 14)}
    ${t(62, 72, 'red', 'f12-l f12-c-red', 'end')}${t(62, 134, 'blue', 'f12-l f12-c-blue', 'end')}
    ${t(24, 30, 'light pours in', 'f12-h', 'start')}${badge(196, 24, 'fs', 'fs', 'start')}
    ${wv(p, 'grey', 420, 100, 452, 40, 5, 4)}${wv(p, 'grey', 436, 108, 482, 58, 5, 4)}
    ${t(492, 44, 'blue’s extra energy', 'f12-l', 'start')}${t(492, 70, 'spills as heat', 'f12-l', 'start')}${badge(652, 70, '< 1 ps', 'ps', 'start')}

    <circle class="f12-hole" cx="${x1}" cy="262" r="4"/>
    ${wv(p, 'red', x1 + 6, 262, 548, 246, 4, 4)}
    ${t(560, 212, 'small leak', 'f12-m', 'start')}${t(560, 240, 'fluorescence', 'f12-h f12-c-red', 'start')}${t(560, 266, '≈ 685 nm', 'f12-l', 'start')}

    ${rc(big.x, 290, 184, 100)}${rcDot(big.x + 32, 340)}${t(big.x + 112, 334, 'charge', 'f12-h')}${t(big.x + 112, 360, 'separation', 'f12-h')}
    ${t(big.x + 92, 418, 'big pipe', 'f12-m')}${t(big.x + 92, 446, 'photochemistry', 'f12-h f12-c-green')}${badge(big.x + 92, 478, '~300 ps', 'ps')}

    <path class="f12-valve" d="M188,${vp.y - 2} L212,${vp.y + vp.h + 2} V${vp.y - 2} L188,${vp.y + vp.h + 2}Z"/>
    <path class="f12-spoke" d="M200,${vp.y + vp.h / 2} V248"/>
    <circle class="f12-wheel" cx="200" cy="236" r="17"/><path class="f12-spoke" d="M186,236 H214 M200,222 V250"/><circle class="f12-hub" cx="200" cy="236" r="4.5"/>
    ${ar(p, 'ink', 'M178,212 A30,30 0 0 1 226,214', 'f12-thin')}
    ${wv(p, 'grey', 146, 300, 104, 216, 5, 5)}${wv(p, 'grey', 140, 312, 76, 246, 5, 5)}
    ${t(24, 362, 'valve', 'f12-m', 'start')}${t(24, 390, 'heat (NPQ)', 'f12-h', 'start')}${t(24, 416, 'adjustable', 'f12-l', 'start')}

    <path class="f12-drop" d="M${nz},420 q-6,9 0,13 q6,-4 0,-13Z"/><path class="f12-drop" d="M${nz},442 q-6,9 0,13 q6,-4 0,-13Z"/>
    <path class="f12-bucket" d="M308,466 L396,466 L388,540 L316,540Z"/><path class="f12-bucket-in" d="M312,504 L392,504 L388,538 L316,538Z"/>
    ${t(nz, 528, '³Chl', 'f12-h f12-c-clay')}
    ${t(292, 452, 'slow drip', 'f12-m', 'end')}${t(292, 480, 'spin flip → triplet', 'f12-h f12-c-clay', 'end')}
    ${badge(292, 518, 'lasts µs and longer', 'us', 'end')}
    ${ar(p, 'clay', 'M402,504 L452,504')}${t(412, 490, '+', 'f12-s')}${molecule(434, 484, 'OO', 8)}
    ${o2box(458, 466, 96, 76)}
    ${carotenoid(584, 512, 70)}${t(584, 546, 'carotenoids (antenna)', 'f12-l f12-c-orange', 'start')}
  </g>`);
}

/* ---------- 12B · classic levels with time badges ---------- */

function levelsTimesSvg(): string {
  const p = 'f12b';
  const S2 = 104, S1 = 262, S0 = 492, T1 = 380;
  return svg('Energy-level diagram of chlorophyll with the time each step takes', `
    ${defs(p)}
    ${ar(p, 'ink', 'M28,520 L28,64', 'f12-axis')}<text class="f12-ax" transform="translate(18 300) rotate(-90)" text-anchor="middle">energy</text>
    ${lvl(78, 262, S2)}${t(66, S2 + 9, 'Sₙ', 'f12-lv', 'end')}
    ${lvl(78, 500, S1)}${t(66, S1 + 9, 'S₁', 'f12-lv', 'end')}
    ${lvl(78, 640, S0)}${t(66, S0 + 9, 'S₀', 'f12-lv', 'end')}
    ${lvl(540, 640, T1)}

    ${ar(p, 'blue', `M100,${S0 - 2} L100,${S2 + 4}`)}${ar(p, 'red', `M150,${S0 - 2} L150,${S1 + 4}`)}
    ${t(90, 190, 'blue', 'f12-l f12-c-blue', 'end')}${t(140, 400, 'red', 'f12-l f12-c-red', 'end')}
    ${t(78, 62, 'absorb', 'f12-h', 'start')}${badge(166, 54, 'fs', 'fs', 'start')}

    ${wv(p, 'grey', 214, S2 + 6, 214, S1 - 4, 6, 5)}
    ${t(234, 160, 'heat', 'f12-h', 'start')}${badge(234, 192, '< 1 ps', 'ps', 'start')}

    ${badge(345, S1 + 36, 'lasts ns', 'ns')}
    ${wv(p, 'red', 270, S1 + 6, 270, S0 - 4, 6, 8)}
    ${t(270, S0 + 38, 'fluorescence', 'f12-h f12-c-red')}${t(270, S0 + 66, '≈ 685 nm', 'f12-l')}
    ${wv(p, 'grey', 420, S1 + 6, 420, S0 - 4, 6, 8)}
    ${t(420, S0 + 38, 'heat (NPQ)', 'f12-h')}

    ${ar(p, 'green', `M504,${S1} L590,${S1}`)}
    ${rc(596, 214, 190, 96)}${rcDot(630, S1)}${t(718, S1 - 6, 'charge', 'f12-h')}${t(718, S1 + 20, 'separation', 'f12-h')}
    ${t(691, 160, 'photochemistry', 'f12-h f12-c-green')}${badge(691, 192, '~300 ps', 'ps')}

    ${ar(p, 'clay', `M470,${S1 + 4} L540,${T1 - 4}`, 'f12-dash')}${t(546, 336, 'spin flip', 'f12-l f12-c-clay', 'start')}
    ${t(640, T1 - 12, 'T₁', 'f12-lv', 'end')}${badge(616, T1 + 34, 'µs and longer', 'us', 'end')}
    ${ar(p, 'clay', `M646,${T1 - 6} L690,${T1 - 6}`)}${t(652, T1 + 22, '+', 'f12-s')}${molecule(674, T1 + 16, 'OO', 8)}${o2box(694, T1 - 46, 96, 74)}
    ${carotenoid(708, T1 + 64, 74)}${t(792, T1 + 98, 'carotenoids (antenna)', 'f12-l f12-c-orange', 'end')}
  `);
}

/* ---------- 12C · numbered levels beside a vertical log-time ruler ---------- */

function levelsClockSvg(): string {
  const p = 'f12c';
  const S2 = 108, S1 = 262, S0 = 492, T1 = 372;
  const Y = (e: number): number => 76 + (e + 15) * 39;
  const named: Record<number, string> = { [-15]: 'fs', [-12]: 'ps', [-9]: 'ns', [-6]: 'µs', [-3]: 'ms' };
  const R = 520;
  let ruler = `<path class="f12-axis" d="M${R},${Y(-15)} V${Y(-3)}"/>`;
  for (let e = -15; e <= -3; e++) {
    const w = named[e] ? 9 : 4;
    ruler += `<path class="f12-axis" d="M${R - w},${Y(e)} H${R + w}"/>`;
    if (named[e]) ruler += t(R - 16, Y(e) + 7, named[e], 'f12-ax', 'end');
  }
  const item = (e: number, n: string, title: string, subline: string, cls = 'f12-h'): string =>
    `<path class="f12-axis" d="M${R},${Y(e)} H${R + 13}"/><circle class="f12-num" cx="${R}" cy="${Y(e)}" r="4"/>${num(R + 26, Y(e), n)}${t(R + 48, Y(e) + 2, title, cls, 'start')}${t(R + 48, Y(e) + 24, subline, 'f12-s', 'start')}`;
  return svg('Energy-level diagram with numbered steps beside a vertical logarithmic time ruler showing when each happens', `
    ${defs(p)}
    ${ar(p, 'ink', 'M24,520 L24,70', 'f12-axis')}<text class="f12-ax" transform="translate(14 300) rotate(-90)" text-anchor="middle">energy</text>
    ${lvl(66, 196, S2)}${t(56, S2 + 9, 'Sₙ', 'f12-lv', 'end')}
    ${lvl(66, 316, S1)}${t(56, S1 + 9, 'S₁', 'f12-lv', 'end')}
    ${lvl(66, 470, S0)}${t(56, S0 + 9, 'S₀', 'f12-lv', 'end')}
    ${lvl(332, 420, T1)}${t(428, T1 + 9, 'T₁', 'f12-lv', 'start')}
    ${ar(p, 'blue', `M86,${S0 - 2} L86,${S2 + 4}`)}${ar(p, 'red', `M118,${S0 - 2} L118,${S1 + 4}`)}${num(102, S0 + 32, '1')}
    ${t(94, 196, 'blue', 'f12-l f12-c-blue', 'start')}${t(126, 420, 'red', 'f12-l f12-c-red', 'start')}
    ${wv(p, 'grey', 160, S2 + 6, 160, S1 - 4, 5, 5)}${num(186, 186, '2')}
    ${ar(p, 'green', `M320,${S1} L366,${S1}`)}${rc(370, 222, 100, 80)}${rcDot(400, S1)}${t(446, S1 + 8, 'RC', 'f12-h', 'middle')}${num(343, S1 - 26, '3')}
    ${wv(p, 'red', 190, S1 + 6, 190, S0 - 4, 5, 8)}${num(214, 400, '4')}
    ${wv(p, 'grey', 250, S1 + 6, 250, S0 - 4, 5, 8)}${num(274, 400, '5')}
    ${ar(p, 'clay', `M296,${S1 + 4} L338,${T1 - 4}`, 'f12-dash')}${num(336, 306, '6')}
    ${ar(p, 'clay', `M${400},${T1 + 4} L400,${T1 + 40}`)}${o2box(356, T1 + 44, 88, 64)}${num(426, T1 + 24, '7')}
    ${ar(p, 'clay', `M346,${T1 + 4} L346,${S0 - 4}`, 'f12-dot f12-faint')}
    ${t(66, 586, 'faint dots: phosphorescence, very weak', 'f12-s', 'start')}

    <circle class="f12-watch" cx="${R}" cy="38" r="15"/><path class="f12-spoke" d="M${R},38 V28 M${R},38 L${R + 7},42 M${R - 4},19 H${R + 4}"/>
    ${ruler}
    ${item(-14.5, '1', 'absorption', 'blue or red photon: fs')}
    ${item(-12.5, '2', 'heat: Sₙ → S₁', 'blue’s extra energy: < 1 ps')}
    ${item(-10.5, '3', 'charge separation', 'reaction centre: ~300 ps', 'f12-h f12-c-green')}
    <path class="f12-axis" d="M${R},${Y(-9)} H${R + 13}"/><circle class="f12-num" cx="${R}" cy="${Y(-9)}" r="4"/>${num(R + 26, Y(-9), '4')}${num(R + 52, Y(-9), '5')}${num(R + 78, Y(-9), '6')}
    ${t(R + 100, Y(-9) + 2, 'S₁ lasts ns', 'f12-h', 'start')}
    ${t(R + 26, Y(-9) + 34, 'fluorescence, heat (NPQ)', 'f12-s', 'start')}${t(R + 26, Y(-9) + 54, 'and spin flip compete', 'f12-s', 'start')}
    <path class="f12-span f12-span-us" d="M${R},${Y(-6)} V${Y(-3.4)}"/>
    ${item(-6, '7', 'triplet → ¹O₂', 'T₁ lasts µs and longer', 'f12-h f12-c-clay')}
    ${carotenoid(R + 48, Y(-6) + 50, 64)}${t(R + 128, Y(-6) + 56, 'carotenoids', 'f12-s f12-c-orange', 'start')}${t(R + 48, Y(-6) + 80, 'catch ³Chl in the antenna', 'f12-s', 'start')}
  `);
}

/* ---------- 12D · the same excited state with reaction centres open or closed ---------- */

function openClosedSvg(): string {
  const p = 'f12d';
  const L = 96, Rr = 704, cy = 296, ys = [128, 236, 344, 452];
  const cxL = 288, cxR = 512;
  const side = (open: boolean): string => {
    const x = open ? L : Rr, s = open ? 1 : -1, tx = open ? cxL : cxR, x0 = x + s * 46;
    const from = (y: number): [number, number] => [x0, Math.round(cy + (y - cy) * 0.24)];
    const [a0, b0] = from(ys[0]), [a1, b1] = from(ys[1]), [a2, b2] = from(ys[2]), [a3, b3] = from(ys[3]);
    let photo = fat(a0, b0, tx, ys[0], 26, 'f12-f-green');
    if (!open) {
      // the route to photochemistry ends at a closed reaction centre
      const f = 0.4, ex = a0 + (tx - a0) * f, ey = b0 + (ys[0] - b0) * f, l = Math.hypot(tx - a0, ys[0] - b0);
      const nx = -(ys[0] - b0) / l, ny = (tx - a0) / l;
      photo = `<path class="f12-w-grey" style="stroke-width:3px" d="M${a0},${b0} L${ex.toFixed(1)},${ey.toFixed(1)}"/>` +
        `<path class="f12-stop" d="M${(ex + nx * 15).toFixed(1)},${(ey + ny * 15).toFixed(1)} L${(ex - nx * 15).toFixed(1)},${(ey - ny * 15).toFixed(1)}"/>` +
        t(ex - 20, ey - 4, 'blocked', 'f12-s', 'end');
    }
    return `${lvl(x - 34, x + 34, cy)}${glow(p, x, cy - 2, 24)}${t(x, cy + 34, 'S₁', 'f12-lv')}
      ${photo}
      ${fatWave(a1, b1, tx, ys[1], open ? 3 : 11, 'grey', 7, 4)}
      ${fatWave(a2, b2, tx, ys[2], open ? 2.5 : 8, 'red', 7, 5)}
      ${fatWave(a3, b3, tx, ys[3], open ? 2 : 5, 'clay')}`;
  };
  const lab = (y: number, title: string, subline: string, cls = 'f12-h'): string =>
    `${t(400, y - 2, title, cls)}${t(400, y + 22, subline, 'f12-s')}`;
  const my = 540, track = (x0: number, x1: number): string => `<rect class="f12-meter" x="${x0}" y="${my - 11}" width="${x1 - x0}" height="22" rx="11"/>`;
  return svg('The same excited chlorophyll twice: with reaction centres open, photochemistry takes most energy; with them closed, heat, fluorescence and triplets rise, so measured fluorescence goes up', `
    ${defs(p)}<g transform="translate(0 -10)">
    ${rc(L - 62, 26, 124, 50)}${rcDot(L - 30, 51)}${t(L + 20, 59, 'open', 'f12-h f12-c-green')}
    <rect class="f12-rc-off" x="${Rr - 62}" y="26" width="124" height="50" rx="25"/>${t(Rr, 59, 'closed', 'f12-h f12-c-grey')}
    ${t(400, 58, 'reaction centres', 'f12-m')}
    ${side(true)}${side(false)}
    ${lab(ys[0], 'photochemistry', 'charge separation', 'f12-h f12-c-green')}
    ${lab(ys[1], 'heat (NPQ)', 'adjustable')}
    ${lab(ys[2], 'fluorescence', '≈ 685 nm', 'f12-h f12-c-red')}
    <rect class="ros" x="${cxL + 8}" y="${ys[3] - 30}" width="${cxR - cxL - 16}" height="60" rx="14"/>
    ${t(400, ys[3] + 8, 'triplet → ¹O₂', 'f12-h f12-c-clay')}
    ${track(112, 280)}<rect class="f12-meter-fill" x="246" y="${my - 11}" width="34" height="22" rx="11"/>
    ${track(520, 688)}<rect class="f12-meter-fill" x="520" y="${my - 11}" width="152" height="22" rx="11"/>
    ${t(400, my + 7, 'fluorescence we see', 'f12-l')}${t(102, my + 7, 'low', 'f12-s', 'end')}${t(698, my + 7, 'high', 'f12-s', 'start')}
    ${t(400, 590, 'arrow width: share of excitations (qualitative)', 'f12-s')}
  </g>`);
}

/* ---------- 12E · the exits from S₁ race on a log time axis ---------- */

function raceSvg(): string {
  const p = 'f12e';
  const X = (e: number): number => 262 + (e + 12) * 58;
  const lanes = [128, 226, 324, 422], ay = 530, fin = X(-9.5);
  const named: Record<number, string> = { [-12]: 'ps', [-9]: 'ns', [-6]: 'µs', [-3]: 'ms' };
  let axis = `<path class="f12-axis" d="M${X(-12)},${ay} H${X(-3)}"/>`;
  for (let e = -12; e <= -3; e++) {
    const w = named[e] ? 9 : 4;
    axis += `<path class="f12-axis" d="M${X(e)},${ay - w} V${ay + w}"/>`;
    if (named[e]) axis += t(X(e), ay + 30, named[e], 'f12-ax');
  }
  const S1y = 300, S1x = 210;
  /** A lane; past the ~300 ps mark the bar fades, because photochemistry has taken most excitations by then. */
  const lane = (y: number, title: string, end: number, cls: string, extra = ''): string => {
    const x0 = X(-12) + 4, x1 = X(end);
    const bar = end <= -9.5 ? `<rect class="${cls}" x="${x0}" y="${y - 12}" width="${x1 - x0}" height="24" rx="12"/>`
      : `<rect class="${cls} f12-late" x="${x0}" y="${y - 12}" width="${x1 - x0}" height="24" rx="12"/><path class="${cls}" d="M${x0 + 12},${y - 12} H${fin} V${y + 12} H${x0 + 12} A12,12 0 0 1 ${x0 + 12},${y - 12}Z"/>`;
    return `<rect class="f12-lane" x="${X(-12)}" y="${y - 22}" width="${X(-3) - X(-12)}" height="44" rx="22"/>` +
      `<path class="f12-guide" d="M${S1x + 4},${S1y} C${S1x + 36},${S1y} ${X(-12) - 36},${y} ${X(-12) - 4},${y}"/>` +
      bar + t(X(-12) + 6, y - 30, title, 'f12-h', 'start') + extra;
  };
  const knob = (x: number, y: number): string =>
    `<circle class="f12-wheel" cx="${x}" cy="${y}" r="10"/><path class="f12-hd-ink" d="M${x - 16},${y - 6} l-8,6 l8,6Z M${x + 16},${y - 6} l8,6 l-8,6Z"/>`;
  return svg('The exits from the excited state as lanes on a logarithmic time axis: photochemistry finishes first, the others would take nanoseconds, and the triplet lingers for microseconds and longer', `
    ${defs(p)}<g transform="translate(0 -18)">
    <rect class="f12-band" x="${X(-9)}" y="74" width="${X(-8.4) - X(-9)}" height="374"/>
    ${t(X(-8.7), 64, 'S₁ lasts ns', 'f12-s')}
    ${lane(lanes[0], 'photochemistry', -9.5, 'f12-bar-green', `<path class="f12-pole" d="M${fin + 14},${lanes[0] + 12} V${lanes[0] - 16}"/><path class="f12-flag" d="M${fin + 14},${lanes[0] - 16} l20,7 l-20,7Z"/>${t(fin + 44, lanes[0] + 8, '~300 ps', 'f12-h f12-c-green', 'start')}`)}
    ${lane(lanes[1], 'heat (NPQ)', -8.6, 'f12-bar-grey', `${knob(X(-8.6), lanes[1])}${t(X(-8.6) + 34, lanes[1] + 7, 'adjustable', 'f12-s', 'start')}`)}
    ${lane(lanes[2], 'fluorescence', -8.6, 'f12-bar-red', t(X(-8.6) + 14, lanes[2] + 7, '≈ 685 nm', 'f12-s', 'start'))}
    ${lane(lanes[3], 'spin flip → triplet', -8.6, 'f12-bar-clay')}
    ${ar(p, 'clay', `M${X(-8.6) + 4},${lanes[3]} L${X(-4.3) - 6},${lanes[3]}`, 'f12-dash')}
    ${t(600, lanes[3] - 30, 'lasts µs and longer', 'f12-s')}
    ${o2box(X(-4.3), lanes[3] - 36, 82, 72)}
    ${t(X(-12) + 6, 478, 'paler: few excitations remain after ~300 ps', 'f12-s', 'start')}
    ${carotenoid(714, 480, 68)}${t(790, 506, 'carotenoids (antenna)', 'f12-s f12-c-orange', 'end')}

    ${lvl(40, 120, 150)}${t(32, 159, 'Sₙ', 'f12-lv', 'end')}
    ${lvl(40, S1x, S1y)}${t(32, S1y + 9, 'S₁', 'f12-lv', 'end')}${glow(p, 194, S1y - 2, 20)}
    ${lvl(40, 200, 470)}${t(32, 479, 'S₀', 'f12-lv', 'end')}
    ${ar(p, 'blue', 'M52,468 L52,154')}${ar(p, 'red', 'M86,468 L86,304')}
    ${t(60, 190, 'blue', 'f12-l f12-c-blue', 'start')}${t(94, 400, 'red', 'f12-l f12-c-red', 'start')}
    ${badge(80, 504, 'absorb: fs', 'fs')}
    ${wv(p, 'grey', 172, 154, 172, 292, 5, 5)}${badge(118, 228, '< 1 ps', 'ps')}${t(118, 262, 'heat', 'f12-s')}
    ${axis}${t(X(-7.5), 588, 'time after the photon arrives (log scale)', 'f12-ax')}
  </g>`);
}
