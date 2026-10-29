// Slide C17 · the lecturer's own research: night stomatal opening (lecturer, 29–30 Oct 2026: "the night opener generally
// loses less carbon during the day, because it makes stomata ready for the day"; picked figure d, 30 Oct 2026, later:
// "plot every plant, and list their species. Use different colours"; d4: "draw the plants … so people see that not all
// plants close their stomata at night"). Data from the lecturer's EvoGuard project (read only):
//  · groups, per-plant-type values and exact P: latex/publications/dataset_24h/generated/manuscript_results.json
//    (identity_profiles: ratio_mean, forgone_total_fraction_mean; group_profiles; exact_group_permutation_tests);
//    group criterion: sections/manuscript.tex § "Overnight-behaviour groups" (night/late risers: conductance rose through
//    the night or near its end; non-risers: stayed lower, declined or did not rise late). Cowpea not compared (no fit).
//  · night g_sw: the site's /analysis/fluctuating_light/exports/limitation_story/overnight_dynamics_summary.json (dataset
//    _24h species_traces, gsw_repr ?? gsw_mean; soybean there holds all 6 plants), each divided by its g_sw,max =
//    g_sw,ini / (g_sw,ini/g_sw,max) exactly as the site's TwentyFourHourDataScenes.tsx normalizedNightPoints; 20-min bins.
//  · "photosynthesis efficiency during the day" = carbon fixed in the first hour after each of the 3 steps to bright light
//    as % of the carbon at the full (final) rate = 100 − total forgone carbon %; its exact P equals that of forgone carbon.
import type { PlateText, Variant } from '../types';
import { T, it, f, svg } from './cr-common';
import { tobacco, arabidopsis, tomato, commonBean, soybean, sunflower } from './cr17-plants';

/** name, group, night g_sw / g_sw,max in 20-min bins from −12 h to lights on, g_sw,ini/g_sw,max (identity mean of 3 steps),
 *  photosynthesis in the first hour of bright light, % of full rate (= 100 − total forgone carbon %), plants n. */
const IDS: Array<{ name: string; g: "r" | "n"; night: number[]; ready: number; photo: number; n: number }> = [
  { name: 'tobacco', g: 'r', night: [0.428,0.358,0.346,0.362,0.368,0.366,0.368,0.371,0.383,0.384,0.391,0.4,0.418,0.441,0.448,0.463,0.498,0.515,0.523,0.539,0.55,0.551,0.551,0.549,0.555,0.553,0.555,0.558,0.564,0.569,0.576,0.584,0.585,0.589,0.597,0.595], ready: 84.8, photo: 97.66, n: 3 },
  { name: 'Col-0', g: 'r', night: [0.337,0.302,0.285,0.285,0.29,0.293,0.295,0.295,0.288,0.286,0.286,0.285,0.288,0.289,0.29,0.292,0.292,0.296,0.3,0.304,0.307,0.314,0.32,0.322,0.329,0.333,0.339,0.343,0.347,0.353,0.359,0.359,0.362,0.363,0.364,0.374], ready: 83.4, photo: 97.88, n: 5 },
  { name: 'Cvi', g: 'r', night: [0.387,0.304,0.283,0.271,0.267,0.266,0.28,0.292,0.292,0.29,0.3,0.313,0.319,0.313,0.313,0.325,0.335,0.33,0.331,0.353,0.362,0.357,0.364,0.383,0.394,0.392,0.404,0.432,0.442,0.438,0.46,0.473,0.472,0.478,0.484,0.49], ready: 80.3, photo: 97.3, n: 5 },
  { name: 'Sanna-2', g: 'r', night: [0.453,0.4,0.393,0.397,0.398,0.402,0.404,0.407,0.409,0.414,0.412,0.41,0.406,0.403,0.403,0.405,0.407,0.41,0.41,0.413,0.42,0.421,0.424,0.434,0.436,0.436,0.441,0.449,0.45,0.454,0.46,0.456,0.457,0.46,0.458,0.465], ready: 77.4, photo: 95.7, n: 6 },
  { name: 'tomato', g: 'n', night: [0.268,0.206,0.187,0.188,0.189,0.186,0.186,0.193,0.193,0.185,0.182,0.186,0.183,0.175,0.173,0.185,0.183,0.177,0.176,0.184,0.182,0.178,0.186,0.19,0.189,0.188,0.187,0.196,0.206,0.2,0.204,0.214,0.222,0.229,0.248,0.302], ready: 69.1, photo: 96.74, n: 5 },
  { name: 'common bean', g: 'n', night: [0.327,0.276,0.239,0.218,0.2,0.187,0.167,0.151,0.137,0.124,0.117,0.106,0.097,0.087,0.083,0.079,0.071,0.065,0.058,0.059,0.059,0.054,0.051,0.06,0.058,0.051,0.054,0.057,0.063,0.066,0.072,0.073,0.074,0.078,0.076,0.089], ready: 60.6, photo: 94.77, n: 5 },
  { name: 'soybean', g: 'n', night: [0.224,0.166,0.165,0.169,0.168,0.171,0.169,0.175,0.176,0.169,0.168,0.173,0.173,0.172,0.168,0.168,0.169,0.171,0.169,0.167,0.168,0.17,0.169,0.169,0.172,0.173,0.17,0.168,0.17,0.17,0.169,0.172,0.172,0.169,0.17,0.179], ready: 57.8, photo: 90.68, n: 4 },
  { name: 'sunflower', g: 'n', night: [0.289,0.24,0.213,0.209,0.212,0.219,0.218,0.216,0.219,0.219,0.222,0.227,0.229,0.227,0.23,0.233,0.232,0.231,0.235,0.237,0.237,0.239,0.241,0.241,0.241,0.239,0.237,0.237,0.231,0.228,0.224,0.22,0.214,0.21,0.208,0.204], ready: 56.0, photo: 96.28, n: 6 },
];
const READY = { r: [81.47, 1.66], n: [60.87, 2.88], p: 0.0286 };
const PHOTO = { r: [97.13, 0.49], n: [94.62, 1.38], p: 0.1143 };

/** One colour per plant type (8 distinct hues; risers cool, non-risers warm); the group is shown by line style. */
const COL: Record<string, string> = {
  tobacco: '#3e6fa8', 'Col-0': '#4e9a43', Cvi: '#8e5ba6', 'Sanna-2': '#2e9e9a',
  tomato: '#d9442f', 'common bean': '#e57a1f', soybean: '#8c6a4f', sunflower: '#c9a000',
};

export const PLATE: PlateText = {
  n: 'C17',
  title: 'Stomata open at night',
  status: 'draft',
  lead: 'Not every plant closes its stomata at night.',
  points: [
    { claim: 'Stomata ready for the day.', text: 'Some plants open their stomata at night or before dawn' },
    { claim: 'More CO₂ for RuBisCO.', text: 'Their stomata are already open when the light comes, so CO₂ enters at once' },
    { claim: 'Better photosynthesis during the day.', text: 'They reach full photosynthesis sooner: a benefit prepared overnight (a trend so far)' },
  ],
  refs: [
    // lecture day: "just say unpublished"
    { label: 'Unpublished data', url: 'https://talks.hongyuanzhang.com/' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'd', name: 'd · 8 night g_sw traces, one colour each | photosynthesis efficiency during the day' },
];

const CSS = `<style>`
  + `.theme-editorial .c17-night{fill:#e8e6df}`
  + `.theme-editorial .c17-ln{fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}`
  + `.theme-editorial .c17-dash{stroke-dasharray:7 5}`
  + `.theme-editorial .c17-mean{fill:none;stroke:#9a978d;stroke-width:7;stroke-linecap:round;stroke-linejoin:round;opacity:.45}`
  + `.theme-editorial .c17-dot{stroke:#fffdf8;stroke-width:2}`
  + `.theme-editorial .c17-band{fill:#cfcabd;opacity:.55}`
  + `.theme-editorial .c17-mline{fill:none;stroke:#3d3d3a;stroke-width:2.6}`
  + `.theme-editorial .c17-ld{fill:none;stroke-width:1.4}`
  + `.theme-editorial .c17-brk{fill:none;stroke:#4a4945;stroke-width:1.8}`
  + `.theme-editorial .c17-gridn{fill:none;stroke:#d3d0c6;stroke-width:1}`
  + `.theme-editorial .fig tspan.c17-sub{font-size:15px}`
  + `.theme-editorial .fig text.c17-xb{font-size:27px;font-weight:600;fill:#141413}`
  + `.theme-editorial .fig text.c17-xs{font-size:24px;fill:#3d3d3a}`
  + `.theme-editorial .fig text.c17-xt{font-size:23px;fill:#6b6a64}`
  + `.theme-editorial .fig text.c17-xv{font-size:26px;font-weight:700;fill:#141413}`
  + `</style>`;

const GSW = `${it('g')}<tspan class="c17-sub" dy="5">sw</tspan><tspan dy="-5">`;
const RISERS = IDS.filter(d => d.g === 'r'), NON = IDS.filter(d => d.g === 'n');

/** Labels at ys pushed apart by at least gap, kept inside [lo, hi]. */
function spreadIn(ys: number[], gap: number, lo: number, hi: number): number[] {
  const idx = ys.map((y, i) => i).sort((a, b) => ys[a] - ys[b]), out = ys.slice();
  let prev = -Infinity;
  for (const i of idx) { out[i] = Math.max(ys[i], prev + gap, lo); prev = out[i]; }
  let next = Infinity;
  for (const i of idx.slice().reverse()) { out[i] = Math.min(out[i], next - gap, hi); next = out[i]; }
  return out;
}

/** Group mean of the 4 plant types per night bin. */
const nightMean = (rows: typeof IDS): number[] => rows[0].night.map((_, j) => rows.reduce((a, r) => a + r.night[j], 0) / rows.length);

interface Night { x0: number; x1: number; y0: number; y1: number; labels: boolean; big?: boolean }
/** The night panel: every plant's g_sw trace in its colour (risers solid, non-risers dashed), grey group means behind. */
function night(o: string[], P: Night): void {
  const VM = 0.6, n = IDS[0].night.length, tk = P.big ? 'c17-xt' : 'cr-tk', lb = P.big ? 'c17-xs' : 'cr-s';
  const xb = (j: number): number => P.x0 + ((j + 0.5) / n) * (P.x1 - P.x0), yb = (v: number): number => P.y0 - (v / VM) * (P.y0 - P.y1);
  const path = (v: number[]): string => v.map((y, j) => `${j ? 'L' : 'M'}${f(xb(j))},${f(yb(y))}`).join('');
  o.push(`<rect class="c17-night" x="${P.x0}" y="${P.y1}" width="${P.x1 - P.x0}" height="${P.y0 - P.y1}"/>`);
  for (const v of [0.2, 0.4, 0.6]) o.push(`<path class="c17-gridn" d="M${P.x0},${f(yb(v))} H${P.x1}"/>`);
  for (const v of (P.big ? [0, 0.3, 0.6] : [0, 0.2, 0.4, 0.6])) o.push(T(P.x0 - 10, yb(v) + 7, `${Math.round(v * 100)} %`, tk, 'end'));
  o.push(`<path class="c17-mean" d="${path(nightMean(RISERS))}"/>`, `<path class="c17-mean" d="${path(nightMean(NON))}"/>`);
  for (const d of IDS) o.push(`<path class="c17-ln${d.g === 'n' ? ' c17-dash' : ''}" style="stroke:${COL[d.name]}" d="${path(d.night)}"/>`);
  o.push(`<path class="cr-axis" d="M${P.x0},${P.y1} V${P.y0} H${P.x1}"/>`);
  for (const h of [-12, -6, 0]) {
    const x = P.x0 + ((h + 12) / 12) * (P.x1 - P.x0);
    o.push(`<path class="cr-axis" d="M${f(x)},${P.y0} v8"/>`);
    if (!(P.big && h === -6)) o.push(T(x, P.y0 + 30, h === 0 ? 'lights on' : h === -12 ? '−12 h' : '−6', tk, h === 0 ? 'end' : 'middle'));
  }
  if (!P.labels) return;
  const ends = IDS.map(d => yb(d.night[d.night.length - 1])), ly = spreadIn(ends, P.big ? 27 : 23, P.y1 + 6, P.y0 - 4);
  IDS.forEach((d, i) => {
    o.push(`<path class="c17-ld" style="stroke:${COL[d.name]}" d="M${P.x1 + 2},${f(ends[i])} L${P.x1 + 10},${f(ly[i])} H${P.x1 + 14}"/>`);
    o.push(T(P.x1 + 18, ly[i] + 7, d.name, lb));
  });
}

interface Right { r: number; r1: number; y0: number; y1: number; kind: 'photo' | 'ready'; cats: 'two' | 'one' | 'none'; means: number | null; big?: boolean }
/** Group columns: the 4 plants' dots in their colours, the group mean (line) ± SE (band). */
function right(o: string[], P: Right): void {
  const lo = P.kind === 'ready' ? 50 : 90, ticks = P.kind === 'ready' ? [50, 75, 100] : [90, 95, 100], sum = P.kind === 'ready' ? READY : PHOTO;
  const tk = P.big ? 'c17-xt' : 'cr-tk', lb = P.big ? 'c17-xs' : 'cr-lb', vl = P.big ? 'c17-xv' : 'cr-val';
  const yr = (v: number): number => P.y0 - ((v - lo) / (100 - lo)) * (P.y0 - P.y1);
  for (const v of ticks) o.push(`<path class="cr-grid" d="M${P.r},${f(yr(v))} H${P.r1}"/>`, T(P.r - 10, yr(v) + 7, `${v} %`, tk, 'end'));
  o.push(`<path class="cr-axis" d="M${P.r},${P.y1 - 6} V${P.y0}"/>`, `<path class="cr-axis" d="M${P.r},${P.y0 + 12} H${P.r1}"/>`);
  o.push(`<path class="c17-brk" d="M${P.r - 9},${P.y0 + 2} L${P.r + 9},${P.y0 - 6} M${P.r - 9},${P.y0 + 10} L${P.r + 9},${P.y0 + 2}"/>`);
  const span = P.r1 - P.r, cx = [P.r + span * 0.28, P.r + span * 0.78];
  const col = (x: number, rows: typeof IDS, g: 'r' | 'n'): void => {
    const [m, se] = sum[g];
    o.push(`<rect class="c17-band" x="${f(x - 46)}" y="${f(yr(m + se))}" width="92" height="${f(yr(m - se) - yr(m + se))}"/>`, `<path class="c17-mline" d="M${f(x - 46)},${f(yr(m))} H${f(x + 46)}"/>`);
    rows.forEach((d, i) => o.push(`<circle class="c17-dot" style="fill:${COL[d.name]}" cx="${f(x + (i - 1.5) * 22)}" cy="${f(yr(P.kind === 'ready' ? d.ready : d.photo))}" r="8.5"/>`));
    const ya = P.y0 + 12;
    if (P.cats === 'two') { o.push(T(x, ya + 28, g === 'r' ? 'night/late' : 'non-risers', lb, 'middle')); if (g === 'r') o.push(T(x, ya + 50, 'risers', lb, 'middle')); }
    if (P.cats === 'one') o.push(T(x, ya + 30, g === 'r' ? 'risers' : 'non-risers', lb, 'middle'));
    if (P.means !== null) o.push(T(x, P.means, `${Math.round(m)} %`, vl, 'middle'));
  };
  col(cx[0], RISERS, 'r');
  col(cx[1], NON, 'n');
}

/** Line samples for the group legend: solid = night/late risers, dashed = non-risers. */
const legend = (x: number, y: number, cls: string, dx = 214, dy = 0): string =>
  `<path class="c17-ln" style="stroke:#3d3d3a" d="M${x},${y - 7} H${x + 30}"/>` + T(x + 38, y, 'night/late risers', cls)
  + `<path class="c17-ln c17-dash" style="stroke:#3d3d3a" d="M${x + dx},${y + dy - 7} H${x + dx + 30}"/>` + T(x + dx + 38, y + dy, 'non-risers', cls);
const CREDIT = 'dots: 8 species and accessions · line and band: group mean ± SE · exact test · unpublished data';
const TREND = `a trend on average (${it('P')} = ${PHOTO.p.toFixed(2)}, 4 + 4 species)`;

function figD(): string {
  const o: string[] = [];
  // only the essentials (lecture day: "remove non-essential texts like first hour of bright light, % of full rate; just
  // show how they perform"); the numbers stay in the axes
  o.push(T(96, 32, 'Stomata at night', 'cr-lb'), T(96, 56, 'how open, % of daytime', 'cr-s'), legend(96, 84, 'cr-s'));
  o.push(T(470, 32, 'Photosynthesis efficiency', 'cr-lb'), T(470, 56, 'during the day', 'cr-lb'));
  night(o, { x0: 96, x1: 300, y0: 470, y1: 140, labels: true });
  right(o, { r: 520, r1: 784, y0: 470, y1: 140, kind: 'photo', cats: 'two', means: 556 });
  o.push(T(784, 597, 'unpublished data', 'cr-crd', 'end'));
  return svg('c17d', 'Night stomatal opening of 8 plant types and their photosynthesis efficiency during the day', CSS + o.join(''));
}

function figD2(): string {
  const o: string[] = [];
  o.push(T(96, 32, 'Stomata in the night', 'cr-lb'), T(96, 56, `${GSW}, % of daytime maximum</tspan>`, 'cr-s'), legend(96, 84, 'cr-s'));
  o.push(T(96, 108, 'grey: group means', 'cr-s'));
  night(o, { x0: 96, x1: 300, y0: 470, y1: 140, labels: true });
  o.push(T(470, 32, 'Stomata ready for the light', 'cr-lb'), T(470, 56, `${GSW} before bright light, % of max</tspan>`, 'cr-tk'));
  right(o, { r: 534, r1: 784, y0: 212, y1: 80, kind: 'ready', cats: 'none', means: null });
  o.push(T(784, 252, `81 vs 61 %: significant, ${it('P')} = ${READY.p.toFixed(3)}`, 'cr-tk', 'end'));
  o.push(T(470, 288, 'Photosynthesis efficiency', 'cr-lb'), T(470, 310, 'during the day', 'cr-lb'), T(470, 332, 'first hour of bright light, % of full rate', 'cr-tk'));
  right(o, { r: 534, r1: 784, y0: 470, y1: 352, kind: 'photo', cats: 'two', means: null });
  o.push(T(514, 510, 'axis starts at 90 %', 'cr-tk', 'end'));
  o.push(T(784, 578, `97 vs 95 %: ${TREND}`, 'cr-tk', 'end'), T(784, 597, CREDIT, 'cr-crd', 'end'));
  return svg('c17d2', 'Night stomatal opening of 8 plant types, how ready their stomata are and their photosynthesis efficiency', CSS + o.join(''));
}

function figD3(): string {
  const o: string[] = [];
  o.push(T(92, 34, 'Stomata at night', 'c17-xb'), legend(92, 68, 'c17-xs', 0, 28));
  o.push(T(470, 34, 'Photosynthesis efficiency', 'c17-xb'), T(470, 66, 'during the day', 'c17-xb'));
  night(o, { x0: 92, x1: 282, y0: 456, y1: 122, labels: true, big: true });
  right(o, { r: 538, r1: 786, y0: 456, y1: 122, kind: 'photo', cats: 'one', means: 540, big: true });
  o.push(T(520, 500, 'from 90 %', 'c17-xt', 'end'));
  o.push(T(786, 576, `a trend (${it('P')} = ${PHOTO.p.toFixed(2)})`, 'c17-xt', 'end'), T(786, 597, '% of full rate in the first hour of bright light · group mean ± SE · data: H. Zhang', 'cr-crd', 'end'));
  return svg('c17d3', 'Night stomatal opening of 8 plant types and their photosynthesis efficiency during the day', CSS + o.join(''));
}

function figD4(): string {
  const o: string[] = [];
  // the plants as the legend: line colour and style under each drawing
  const base = 176, s = 0.72;
  o.push(T(20, 22, 'open at night', 'cr-lb'), T(20, 44, 'night/late risers', 'cr-s'), T(332, 22, 'close at night', 'cr-lb'), T(332, 44, 'non-risers', 'cr-s'));
  o.push(`<path class="cr-grid" d="M324,8 V248"/>`);
  const sw = (x: number, y: number, name: string, dash: boolean): string =>
    `<path class="c17-ln${dash ? ' c17-dash' : ''}" style="stroke:${COL[name]};stroke-width:4" d="M${f(x - 18)},${y} H${f(x + 18)}"/>`;
  o.push(tobacco(62, base, s), T(62, base + 24, 'tobacco', 'cr-s', 'middle'), sw(62, base + 40, 'tobacco', false));
  o.push(arabidopsis(206, base, s * 1.1), T(206, base + 24, 'Arabidopsis', 'cr-s', 'middle'));
  ([['Col-0', 136], ['Cvi', 204], ['Sanna-2', 272]] as Array<[string, number]>).forEach(([n, x]) => o.push(T(x, base + 48, n, 'cr-tk', 'middle'), sw(x, base + 64, n, false)));
  const nr: Array<[string, (x: number, y: number, s?: number) => string, number]> = [['tomato', tomato, 378], ['common bean', commonBean, 496], ['soybean', soybean, 622], ['sunflower', sunflower, 736]];
  for (const [n, fn, x] of nr) o.push(fn(x, base, s), T(x, base + 24, n, 'cr-s', 'middle'), sw(x, base + 40, n, true));
  // the two panels
  o.push(T(70, 274, 'Stomata in the night', 'cr-lb'), T(70, 298, `${GSW}, % of daytime maximum</tspan>`, 'cr-s'));
  o.push(T(470, 274, 'Photosynthesis efficiency', 'cr-lb'), T(470, 296, 'during the day', 'cr-lb'), T(470, 318, 'first hour of bright light, % of full rate', 'cr-tk'));
  night(o, { x0: 70, x1: 390, y0: 508, y1: 334, labels: false });
  right(o, { r: 534, r1: 784, y0: 508, y1: 334, kind: 'photo', cats: 'one', means: 576 });
  o.push(T(514, 566, 'axis starts at 90 %', 'cr-tk', 'end'));
  o.push(T(784, 597, `${TREND} · grey: group means · unpublished data`, 'cr-crd', 'end'));
  return svg('c17d4', 'Drawings of the 8 plants measured, their night stomatal opening and photosynthesis efficiency during the day', CSS + o.join(''));
}

export function draw(id: string): string {
  return id === 'd2' ? figD2() : id === 'd3' ? figD3() : id === 'd4' ? figD4() : figD();
}
