// 'evoG' · slide 15, RuBisCO through Earth's history as one graph (overnight, 29 Oct 2026; lecturer: "a very good
// illustrative RuBisCO evolution history graph"; focus: "how RuBisCO's performance changed over the years"). Beats
// C2STORY5 (beats-c2story.ts, fixed). The graph builds up beat by beat, one point or line at a time, a pause after each
// new form. The same graph, still and complete, is page figure eg1 (figs/c02evo.ts draws it with PAGE below).
// - x: time on a broken axis, every part linear: 4 → 0.5 billion years ago | 500 → 1 million years ago | the last
//   800,000 years. (The time chart's axis, c2story-evo.ts / dk-c2story3.ts, is logarithmic before 1 million years ago:
//   there the ocean RuBisCOs of 3.5–2.7 billion years ago fall within 30 px; here they are 170 px apart, and the
//   500 million years of land plants keep a third of the width.)
// - y: RuBisCO's CO₂ preference S (25 °C, dissolved-gas units), linear 0–200. Each group is a point in its card colour
//   (as evo's cards) with its real structure beside it (biological assemblies at one common scale, 4 px per Å:
//   1GEH form III, 9RUB form II, 1RBL form IB, 1BWV form ID, 8RUC spinach; scripts/rf_forms_render.mjs). Filled: living
//   enzymes, typical values (Tcherkez et al. 2006 Table 1; Flamholz et al. 2019 Fig. 5 medians): archaea ≈ 5 (form III
//   0.5–11, Iñiguez et al. 2020; drawn as a band), purple bacteria 12, cyanobacteria 48, green algae 62, red algae 177;
//   today's C₃ flowering plants 87.1 (Bouvier, Emms & Kelly 2024, Table 1). Open: ancestors, the rebuilt pre-form-I
//   enzyme without (22) and with the small subunit (39; Schulz et al. 2022, raw data means), and the flowering-plant
//   common ancestor (81.1, inferred, ≈ 160 million years ago; Bouvier 2024). Between them the flowering-plant line is
//   read linearly in time (Bouvier: + 0.05 % S per million years); from land plants (≈ 470 million years ago) to that
//   ancestor there is no measurement, drawn dashed.
// - Dates, as evo's: archaea ≈ 3.5 (Iñiguez 2020), purple bacteria 2.95 and cyanobacteria 2.7 (not dated; before the
//   Great Oxidation Event), red algae 1.05 (Bangiomorpha), green algae 1.0 (oldest fossils), land plants ≈ 470 million.
// - Behind, faint: O₂ in the air as an area (none; the Great Oxidation Event band, 2.43–2.22 billion years ago, Poulton
//   et al. 2021; then a trace, ≤ 0.1 % of today's, as the deck's other versions; the Neoproterozoic rise drawn dashed,
//   after Lyons et al. 2014; from 420 million years ago GEOCARBSULF, Schachat et al. 2018) and CO₂ in the air where the
//   records are (log scale, c2story-data.ts: Foster et al. 2017; Bereiter et al. 2015; NOAA GML), in its own band above
//   the land-plant line, so the two never cross.
// - The CO₂ character (co2-kit.ts kidG) appears once, in beat 7: it rides the rise of CO₂ since 1750 and bumps into
//   today's RuBisCO (glad), then sweats (warming).
// - Only the closing question goes on the stage (keys); it stays as in c2story-evo.ts.
// DOIs: Tcherkez 2006 10.1073/pnas.0600605103 · Flamholz 2019 10.1021/acs.biochem.9b00237 · Schulz 2022
// 10.1126/science.abq1416 · Bouvier 2024 10.1073/pnas.2321050121 · Iñiguez 2020 10.1111/tpj.14643 · Poulton 2021
// 10.1038/s41586-021-03393-7 · Lyons, Reinhard & Planavsky 2014 10.1038/nature13068 · Schachat 2018 10.1098/rspb.2017.2631 ·
// Foster 2017 10.1038/ncomms14845 · Bereiter 2015 10.1002/2014GL061957 · NOAA GML gml.noaa.gov/ccgg/trends.
import { C2STORY5 } from './beats-c2story';
import { CO2_B, CO2_C, CO2_D, FOSTER, O2_GCS } from './c2story-data';
import { actor, clamp, ease, ease2, from, kid, kidG, lerp, makeScene, type Api, type V } from './co2-kit';
import r1geh from '../../assets/rf/rubisco-1geh.png';
import r9rub from '../../assets/rf/rubisco-9rub.png';
import r1rbl from '../../assets/rf/rubisco-1rbl.png';
import r1bwv from '../../assets/rf/rubisco-1bwv.png';
import r8ruc from '../../assets/rf/rubisco-8ruc.png';
import type { Staging } from './types';

export const f = (v: number): string => (Math.round(v * 10) / 10).toString();
type Anchor = 'start' | 'middle' | 'end';
/** A text line with inline type (no stylesheet of its own). */
export const tx = (x: number, y: number, s: string, size: number, fill: string, weight = 400, a: Anchor = 'middle', halo = false): string =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}${halo ? ';paint-order:stroke;stroke:#fbfaf6;stroke-width:5px;stroke-linejoin:round' : ''}">${s}</text>`;

/* ================================================================ data */

/** The renders (4 px per Å), drawn at one common scale so their sizes compare. */
export const IMG: Record<string, { href: string; w: number; h: number }> = {
  '1geh': { href: r1geh, w: 636, h: 608 }, '9rub': { href: r9rub, w: 476, h: 336 }, '1rbl': { href: r1rbl, w: 537, h: 484 },
  '1bwv': { href: r1bwv, w: 548, h: 500 }, '8ruc': { href: r8ruc, w: 548, h: 471 },
};
export const img = (k: string, cx: number, cy: number, sc: number): string => {
  const m = IMG[k], w = m.w * sc, h = m.h * sc;
  return `<image href="${m.href}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
};
export type GK = 'arc' | 'pur' | 'cya' | 'red' | 'grn' | 'lnd';
export interface Group { name: string; form: string; s: number; sTxt: string; ya: number; col: string; txt: string; img: string }
/** The groups in evo's card colours; ya: years ago of the point (lnd: today). */
export const GROUPS: Record<GK, Group> = {
  arc: { name: 'archaea', form: 'form III', s: 5, sTxt: 'S ≈ 5', ya: 3.5e9, col: '#8a8780', txt: '#6f6c66', img: '1geh' },
  pur: { name: 'purple bacteria', form: 'form II', s: 12, sTxt: 'S 12', ya: 2.95e9, col: '#7a4f9a', txt: '#7a4f9a', img: '9rub' },
  cya: { name: 'cyanobacteria', form: 'form I', s: 48, sTxt: 'S 48', ya: 2.7e9, col: '#2f7f86', txt: '#2f7f86', img: '1rbl' },
  red: { name: 'red algae', form: 'form ID', s: 177, sTxt: 'S 177', ya: 1.05e9, col: '#b5384a', txt: '#b5384a', img: '1bwv' },
  grn: { name: 'green algae', form: 'form I', s: 62, sTxt: 'S 62', ya: 1.0e9, col: '#5b9a3c', txt: '#4f8a32', img: '1rbl' },
  lnd: { name: 'C₃ plants', form: 'form I', s: 87.1, sTxt: 'S 87', ya: 0, col: '#3c7a2e', txt: '#3c7a2e', img: '8ruc' },
};
/** Archaea, form III: S 0.5–11 (Iñiguez 2020), drawn as a band. */
export const ARC_LO = 0.5, ARC_HI = 11;
/** The rebuilt pre-form-I ancestor without and with the small subunit (Schulz 2022). */
export const S_ANCL = 22, S_SSU = 39;
/** Flowering plants: the inferred common ancestor ≈ 160 million years ago → today's C₃ mean (Bouvier 2024, Table 1). */
export const YA_ANC = 1.6e8, S_ANC = 81.1, S_NOW = 87.1, YA_LAND = 4.7e8;
export const sLand = (ya: number): number => S_NOW - ((S_NOW - S_ANC) * Math.min(ya, YA_ANC)) / YA_ANC;
export const GOE: V = [2.43e9, 2.22e9];

/** "Years ago" = years before 28 Oct 2026, as c2story-data.ts. */
const NOW = 2026.8;
/** O₂ (% of air): none before the Great Oxidation Event, then a trace (≤ 0.1 % of today's), the Neoproterozoic rise
 *  (dashed, schematic, after Lyons et al. 2014), then GEOCARBSULF from 420 million years ago, linear to today's 20.95 %. */
const TRACE = 0.02, O2_REC = O2_GCS[0][0] * 1e6;
export function o2At(ya: number): number {
  if (ya >= GOE[0]) return 0;
  if (ya >= GOE[1]) return (TRACE * (GOE[0] - ya)) / (GOE[0] - GOE[1]);
  if (ya >= 8e8) return TRACE;
  if (ya > O2_REC) { const u = (8e8 - ya) / (8e8 - O2_REC); return lerp(TRACE, O2_GCS[0][1], u * u * (3 - 2 * u)); }
  const p = O2_GCS.map(([ma, v]): V => [ma * 1e6, v]);
  for (let i = 0; i < p.length - 1; i++) if (ya <= p[i][0] && ya >= p[i + 1][0]) return lerp(p[i][1], p[i + 1][1], (p[i][0] - ya) / (p[i][0] - p[i + 1][0]));
  const [a, v] = p[p.length - 1];
  return lerp(v, 20.95, (a - ya) / a);
}
/** CO₂ (ppm) where the records are: [years ago, ppm]. */
const FOSTER_SHOWN = FOSTER.filter(([ma]) => ma < 10 || Math.round(ma) % 10 === 0 || ma > 419).map(([ma, v]): V => [ma * 1e6, v]).reverse();
const YA1750 = NOW - 1750;
const ICE: V[] = [...CO2_B.map(([a, v]): V => [a, v]), ...CO2_C.map(([a, v]): V => [a, v]), [YA1750, CO2_D[0][1]]];
const RISE: V[] = CO2_D.map(([yr, v]): V => [NOW - yr, v]);
export const CA_1750 = CO2_D[0][1], CA_NOW = CO2_D[CO2_D.length - 1][1];

/* ================================================================ geometry */

/** A group's card (warm paper, as evo's cards): the render's centre, the first text baseline (centred under it), the
 *  card's width, the name split into lines where given, an optional leader (in the group's colour) to its point. */
export interface Chip { r: V; t: V; w: number; nm?: string[]; lead?: V[] }
export interface Geo {
  p: string;
  /** The axis segments: x range and years ago at their ends (each linear). */
  segs: Array<{ x: V; ya: V }>;
  y0: number; ky: number; sMax: number;
  /** CO₂ band (log): y of 150 and of 4000 ppm. */
  c150: number; c4000: number;
  /** O₂ area: px per % of air. */
  ko: number;
  rk: number; r: number;
  fs: { tk: number; ax: number; name: number; form: number; sv: number; note: number; crd: number };
  ticks: Array<[number, number, string, Anchor]>;
  titles: Array<[string, number]>;
  chips: Record<GK, Chip>;
  /** Label positions. */
  L: Record<'goe' | 'o2' | 'o2t' | 'co2' | 'co2t' | 'now' | 'land' | 'anc' | 's22' | 's39' | 'sAx', V>;
  crd: string[]; crdX: number; crdY: number;
  /** Cards without the form line (the page figure, where space is short). */
  noForm?: boolean;
}
export const xIn = (g: Geo, s: number, ya: number): number => { const { x, ya: y } = g.segs[s]; return x[0] + ((y[0] - ya) / (y[0] - y[1])) * (x[1] - x[0]); };
/** x of a time on the broken axis (the first segment that holds it). */
export const xAt = (g: Geo, ya: number): number => { const s = g.segs.findIndex(q => ya <= q.ya[0] && ya >= q.ya[1]); return s < 0 ? NaN : xIn(g, s, ya); };
export const yS = (g: Geo, s: number): number => g.y0 - g.ky * s;
export const yC = (g: Geo, ppm: number): number => g.c150 + (Math.log(ppm / 150) / Math.log(4000 / 150)) * (g.c4000 - g.c150);
export const yO = (g: Geo, pct: number): number => g.y0 - g.ko * pct;
export const pt = (g: Geo, k: GK): V => [k === 'lnd' ? xAt(g, 0) : xAt(g, GROUPS[k].ya), yS(g, GROUPS[k].s)];

const CRD = [
  'CO₂ preference S at 25 °C: living enzymes (filled) and rebuilt or inferred ancestors (open): Tcherkez et al. 2006; Flamholz et al. 2019; Schulz et al. 2022; Bouvier et al. 2024 · structures: PDB 1GEH, 9RUB, 1RBL, 1BWV, 8RUC',
  'CO₂: Foster et al. 2017; Bereiter et al. 2015; NOAA GML · O₂: Schachat et al. 2018; before 420 million years ago after Lyons et al. 2014 · Great Oxidation Event: Poulton et al. 2021 · dashed: no measurements · dates approximate',
];

/** The stage (1600 × 740). */
export const STAGE: Geo = {
  p: 'evg',
  segs: [{ x: [150, 900], ya: [4e9, 5e8] }, { x: [918, 1258], ya: [5e8, 1e6] }, { x: [1276, 1440], ya: [8e5, 0] }],
  y0: 590, ky: 2.3, sMax: 200, c150: 372, c4000: 150, ko: 4.8, rk: 0.15, r: 7,
  fs: { tk: 16, ax: 16, name: 17, form: 14, sv: 18, note: 15, crd: 12.5 },
  ticks: [[0, 4e9, '4', 'middle'], [0, 3e9, '3', 'middle'], [0, 2e9, '2', 'middle'], [0, 1e9, '1', 'middle'],
    [1, 5e8, '500', 'middle'], [1, 4e8, '400', 'middle'], [1, 3e8, '300', 'middle'], [1, 2e8, '200', 'middle'], [1, 1e8, '100', 'middle'],
    [2, 8e5, '800,000', 'start'], [2, 0, 'today', 'end']],
  titles: [['billion years ago', 525], ['million years ago', 1088], ['years ago', 1358]],
  chips: {
    arc: { r: [212, 292], t: [212, 362], w: 118, lead: [[230, 428], [255, 560]] },
    pur: { r: [362, 314], t: [362, 380], w: 160, lead: [[370, 444], [374, 554]] },
    cya: { r: [550, 216], t: [550, 286], w: 160, lead: [[500, 378], [433, 473]] },
    red: { r: [862, 180], t: [862, 242], w: 112 },
    grn: { r: [702, 420], t: [702, 482], w: 140 },
    lnd: { r: [1522, 394], t: [1522, 454], w: 110 },
  },
  L: {
    goe: [538, 146], o2: [930, 574], o2t: [1066, 502], co2: [968, 170], co2t: [1118, 186], now: [1400, 296],
    land: [946, 393], anc: [1150, 364], s22: [444, 545], s39: [444, 506], sAx: [80, 360],
  },
  crd: CRD, crdX: 150, crdY: 708,
};

/** The page figure (800 × 600): the same graph, smaller type, cards without the form line. */
export const PAGE: Geo = {
  p: 'eg1',
  segs: [{ x: [66, 452], ya: [4e9, 5e8] }, { x: [462, 640], ya: [5e8, 1e6] }, { x: [650, 712], ya: [8e5, 0] }],
  y0: 480, ky: 2.1, sMax: 200, c150: 285, c4000: 85, ko: 4.0, rk: 0.085, r: 5,
  fs: { tk: 13, ax: 13, name: 13, form: 12, sv: 13, note: 12, crd: 12 },
  ticks: [[0, 4e9, '4', 'middle'], [0, 3e9, '3', 'middle'], [0, 2e9, '2', 'middle'], [0, 1e9, '1', 'middle'],
    [1, 5e8, '500', 'middle'], [1, 4e8, '400', 'middle'], [1, 3e8, '300', 'middle'], [1, 2e8, '200', 'middle'], [1, 1e8, '100', 'middle'],
    [2, 0, 'today', 'end']],
  titles: [['billion years ago', 259], ['million years ago', 551], ['last 800,000 years', 681]],
  chips: {
    arc: { r: [104, 238], t: [104, 280], w: 70, lead: [[112, 0], [121, 454]] },
    pur: { r: [182, 250], t: [182, 284], w: 74, nm: ['purple', 'bacteria'], lead: [[184, 0], [182, 448]] },
    cya: { r: [276, 168], t: [276, 210], w: 108, lead: [[250, 0], [212, 372]] },
    red: { r: [436, 106], t: [436, 146], w: 72 },
    grn: { r: [338, 300], t: [338, 342], w: 98 },
    lnd: { r: [757, 300], t: [757, 337], w: 72 },
  },
  L: {
    goe: [266, 74], o2: [476, 470], o2t: [544, 425], co2: [480, 108], co2t: [572, 116], now: [700, 219],
    land: [478, 302], anc: [566, 275], s22: [217, 438], s39: [217, 402], sAx: [24, 270],
  },
  crd: [
    'CO₂ preference S at 25 °C, living enzymes (filled) and ancestors (open): Tcherkez et al. 2006; Flamholz et al. 2019;',
    'Schulz et al. 2022; Bouvier et al. 2024 · structures: PDB 1GEH, 9RUB, 1RBL, 1BWV, 8RUC · CO₂: Foster et al. 2017;',
    'Bereiter et al. 2015; NOAA GML · O₂: Schachat et al. 2018; Lyons et al. 2014 · dashed: no measurements · dates approximate',
  ],
  crdX: 20, crdY: 556, noForm: true,
};

/* ================================================================ the graph's markup */

/** A part of the graph: in the animation an actor (hidden unless the frame shows it), in the still a plain group. */
const part = (k: string, inner: string, anim: boolean): string => (anim ? actor(k, inner) : `<g>${inner}</g>`);
export const dot = (x: number, y: number, r: number, col: string, open = false): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" style="${open ? `fill:#fbfaf6;stroke:${col};stroke-width:2.6` : `fill:${col};stroke:#fbfaf6;stroke-width:2`}"/>`;
export const line = (q: V[], col: string, w: number, extra = ''): string =>
  `<path d="M${q.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}" style="fill:none;stroke:${col};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round${extra}"/>`;

const PUMPS: GK[] = ['cya', 'grn'];
/** Baselines of a card's lines: the name line(s), the form, S, and (cyanobacteria, green algae) the CO₂ pump. */
function cardLines(g: Geo, k: GK): number[] {
  const L = g.chips[k], n = (L.nm ?? [GROUPS[k].name]).length, ys: number[] = [];
  let y = L.t[1];
  for (let i = 0; i < n; i++) { ys.push(y); y += g.fs.name + 3; }
  if (!g.noForm) { y += g.fs.form - g.fs.name + 2; ys.push(y); y += g.fs.sv + 5; } else y += g.fs.sv - g.fs.name + 2;
  ys.push(y);
  if (PUMPS.includes(k)) { y += g.fs.form + 7; ys.push(y); }
  return ys;
}
/** One group's card: the render, its name, form and CO₂ preference (room for the CO₂ pump line), the leader. */
export function chipSvg(g: Geo, k: GK, sc = g.rk): string {
  const c = GROUPS[k], L = g.chips[k], m = IMG[c.img], names = L.nm ?? [c.name], ys = cardLines(g, k), x = L.t[0];
  const top = L.r[1] - (m.h * sc) / 2 - 6, bot = ys[ys.length - 1] + Math.round(g.fs.sv * 0.55);
  const card = `<rect x="${f(L.r[0] - L.w / 2)}" y="${f(top)}" width="${L.w}" height="${f(bot - top)}" rx="${f(g.fs.sv * 0.6)}" style="fill:#fffdf8;stroke:${c.col};stroke-width:1.5"/>`;
  // the leader starts at the card's bottom edge
  const lead = L.lead ? line([[L.lead[0][0], bot], ...L.lead.slice(1)], c.col, 1.4) : '';
  return `${lead}${card}${img(c.img, L.r[0], L.r[1], sc)}
    ${names.map((nm, i) => tx(x, ys[i], nm, g.fs.name, c.txt, 700)).join('')}${g.noForm ? '' : tx(x, ys[names.length], c.form, g.fs.form, '#4a4945')}${tx(x, ys[names.length + (g.noForm ? 0 : 1)], c.sTxt, g.fs.sv, '#141413', 700)}`;
}
/** A CO₂ molecule as the deck's atom balls, letters set inline (≥ 12 px). */
const co2Balls = (x: number, y: number, r: number, fs: number): string => [-1, 0, 1].map(i => {
  const cx = x + i * r * 1.7, el = i ? 'O' : 'C';
  return `<circle class="atom atom-${el}" cx="${f(cx)}" cy="${f(y)}" r="${f(r)}"/><text x="${f(cx)}" y="${f(y + fs * 0.36)}" text-anchor="middle" style="font-size:${fs}px;font-weight:700;fill:${el === 'C' ? '#fff' : '#5a4a1a'}">${el}</text>`;
}).join('');
/** The CO₂ pump of cyanobacteria and green algae: atom-ball CO₂ crowding round the render, and a line on the card. */
function pumpSvg(g: Geo, k: GK): string {
  const c = GROUPS[k], L = g.chips[k], m = IMG[c.img], hw = (m.w * g.rk) / 2, hh = (m.h * g.rk) / 2, rb = g.r + 2, ys = cardLines(g, k);
  // hugging the protein's edge (on the small page figure 2, half outside the render, so the protein stays visible)
  const at: V[] = g.rk < 0.1 ? [[-hw - rb * 0.9, -hh * 0.45], [hw + rb * 0.9, hh * 0.45]] : [[-hw + 2, -hh * 0.6], [-hw + 6, hh * 0.62], [hw - 2, -hh * 0.55]];
  return `${at.map(([dx, dy]) => co2Balls(L.r[0] + dx, L.r[1] + dy, rb, Math.max(12, rb * 1.45))).join('')}${tx(L.t[0], ys[ys.length - 1], '+ CO₂ pump', g.fs.form + 1, c.txt, 700)}`;
}

/** The O₂ area of segment s, split where the record begins (dashed top edge before it). */
function o2Svg(g: Geo, s: number): string {
  const { ya } = g.segs[s], n = s === 2 ? 4 : 120;
  const pts: V[] = [];
  for (let i = 0; i <= n; i++) { const a = lerp(ya[0], ya[1], i / n); pts.push([xIn(g, s, a), yO(g, o2At(a))]); }
  if (s === 1) for (const [ma] of O2_GCS) pts.push([xIn(g, 1, ma * 1e6), yO(g, o2At(ma * 1e6))]);
  pts.sort((p, q) => p[0] - q[0]);
  const x0 = xIn(g, s, ya[0]), x1 = xIn(g, s, ya[1]), xr = xIn(g, s, Math.min(ya[0], Math.max(ya[1], O2_REC)));
  const area = `M${f(x0)},${g.y0} L${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')} L${f(x1)},${g.y0}Z`;
  const pre = pts.filter(([x]) => x <= xr + 0.01), rec = pts.filter(([x]) => x >= xr - 0.01);
  const edge = (q: V[], dash: boolean): string => (q.length > 1 ? line(q, '#3f8a7f', 1.6, dash ? ';stroke-dasharray:5 5;opacity:.8' : ';opacity:.8') : '');
  return `<path d="${area}" style="fill:#4f9a8f;opacity:.17"/>${edge(pre.filter(([, y]) => y < g.y0 - 0.3), true)}${edge(rec, false)}`;
}
const co2Path = (g: Geo, s: number, q: V[]): string => `M${q.map(([a, v]) => `${f(xIn(g, s, a))},${f(yC(g, v))}`).join(' L')}`;
const CO2_ST = 'fill:none;stroke:#55534c;stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round;opacity:.55';

/** The axes, ticks, titles and credits. */
export function axesSvg(g: Geo): string {
  const [x0] = g.segs[0].x, x1 = g.segs[g.segs.length - 1].x[1], top = yS(g, g.sMax);
  const grid = [50, 100, 150, 200].map(v => `<path d="M${x0},${f(yS(g, v))} H${f(x1)}" style="fill:none;stroke:#e3dfd4;stroke-width:1"/>`).join('');
  const sT = [0, 50, 100, 150, 200].map(v => `<path d="M${x0},${f(yS(g, v))} h-6" style="fill:none;stroke:#6b6a64;stroke-width:1.4"/>${tx(x0 - 10, yS(g, v) + g.fs.tk * 0.35, String(v), g.fs.tk, '#4a4945', 400, 'end')}`).join('');
  const base = g.segs.map(({ x }) => `M${f(x[0])},${g.y0} H${f(x[1])}`).join(' ');
  const brk = g.segs.slice(0, -1).map(({ x }, i) => { const m = (x[1] + g.segs[i + 1].x[0]) / 2; return `M${f(m - 7)},${g.y0 + 7} l6,-14 M${f(m + 1)},${g.y0 + 7} l6,-14`; }).join(' ');
  const ticks = g.ticks.map(([s, ya, lab, a]) => { const x = xIn(g, s, ya); return `<path d="M${f(x)},${g.y0} v7" style="fill:none;stroke:#6b6a64;stroke-width:1.4"/>${tx(x, g.y0 + g.fs.tk + 12, lab, g.fs.tk, '#4a4945', 400, a)}`; }).join('');
  const titles = g.titles.map(([s, x]) => tx(x, g.y0 + 2 * g.fs.tk + 22, s, g.fs.ax, '#3d3d3a')).join('');
  const [ax, ay] = g.L.sAx;
  return `${grid}<path d="M${x0},${g.y0} V${f(top)}" style="fill:none;stroke:#6b6a64;stroke-width:1.6"/>${sT}
    <path d="${base}" style="fill:none;stroke:#6b6a64;stroke-width:1.6"/><path d="${brk}" style="fill:none;stroke:#6b6a64;stroke-width:1.8;stroke-linecap:round"/>${ticks}${titles}
    <text transform="translate(${ax} ${ay}) rotate(-90)" text-anchor="middle" style="font-size:${g.fs.ax}px;font-weight:600;fill:#2b2a27">CO₂ preference of RuBisCO (S)</text>`;
}
export const crdSvg = (g: Geo): string => g.crd.map((l, i) => tx(g.crdX, g.crdY + i * (g.fs.crd + 4), l, g.fs.crd, '#8a877d', 400, 'start')).join('');

/** The whole graph. In the animation (anim) every appearing part is an actor and the reveals are clip rectangles that
 *  the frame widens; in the still everything is shown. */
export function graphSvg(g: Geo, anim: boolean): string {
  const p = g.p, top = yS(g, g.sMax) - 4, y0 = g.y0, xEnd = xAt(g, 0);
  const [xc] = pt(g, 'cya'), y22 = yS(g, S_ANCL), y39 = yS(g, S_SSU), y48 = yS(g, GROUPS.cya.s);
  const clip = (k: string, x: number, y: number, w: number, h: number): string =>
    `<clipPath id="${p}-${k}"><rect data-k="${k}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`;
  const W = (k: string, full: number): number => (anim ? 0 : full);
  // reveal extents
  const xO2 = xAt(g, 8e8), xB0 = g.segs[1].x[0], xC0 = g.segs[2].x[0];
  const [xg, yg] = pt(g, 'grn'), xL0 = xIn(g, 1, YA_LAND), yL = yS(g, S_ANC), xA = xIn(g, 1, YA_ANC);
  const goe0 = xAt(g, GOE[0]), goe1 = xAt(g, GOE[1]);
  const landSolid = [
    Array.from({ length: 21 }, (_, i) => { const a = lerp(YA_ANC, 1e6, i / 20); return [xIn(g, 1, a), yS(g, sLand(a))] as V; }),
    [[xC0, yS(g, sLand(8e5))], [xEnd, yS(g, S_NOW)]] as V[],
  ];
  const lc = GROUPS.lnd.col;
  const [xr, yr] = pt(g, 'red'), [xp, yp] = pt(g, 'pur');
  const [xa] = pt(g, 'arc');
  const ry1 = yC(g, CA_1750), ryN = yC(g, CA_NOW);
  return `${anim ? '<rect x="0" y="0" width="1600" height="740" style="fill:#fbfaf6"/>' : ''}
  <defs>${clip('o2c', xO2 - 2, 0, W('o2c', xEnd - xO2 + 6), y0 + 2)}${clip('cbc', xB0, 0, W('cbc', g.segs[1].x[1] - xB0 + 4), y0)}
    ${clip('ccc', xC0 - 2, 0, W('ccc', xEnd - xC0 + 4), y0)}${clip('crc', xEnd - 10, anim ? ry1 + 3 : ryN - 3, 20, anim ? 0 : ry1 - ryN + 6)}
    ${clip('dsck', xg, 0, W('dsck', xL0 - xg + 4), y0)}${clip('lc', xL0 - 3, 0, W('lc', xEnd - xL0 + 6), y0)}</defs>
  <g data-k="all">
    ${part('ax', `${axesSvg(g)}${crdSvg(g)}`, anim)}
    ${part('goe', `<rect x="${f(goe0)}" y="${f(top)}" width="${f(goe1 - goe0)}" height="${f(y0 - top)}" style="fill:#4f9a8f;opacity:.16"/>${tx(g.L.goe[0], g.L.goe[1], 'Great Oxidation Event', g.fs.note - 1, '#2f6f66', 600, 'start')}`, anim)}
    ${part('o2', `<g clip-path="url(#${p}-o2c)">${o2Svg(g, 0)}${o2Svg(g, 1)}${o2Svg(g, 2)}</g>`, anim)}
    ${part('o2l', tx(g.L.o2[0], g.L.o2[1], 'O₂ in the air', g.fs.note, '#2f6f66', 600, 'start'), anim)}
    ${part('o2t', tx(g.L.o2t[0], g.L.o2t[1], '≈ 30 %', g.fs.note, '#2f6f66', 700), anim)}
    ${part('co2b', `<path clip-path="url(#${p}-cbc)" d="${co2Path(g, 1, FOSTER_SHOWN)}" style="${CO2_ST}"/>`, anim)}
    ${part('co2c', `<path clip-path="url(#${p}-ccc)" d="${co2Path(g, 2, ICE)}" style="${CO2_ST}"/>`, anim)}
    ${part('co2r', `<path clip-path="url(#${p}-crc)" d="${co2Path(g, 2, RISE)}" style="${CO2_ST}"/>`, anim)}
    ${part('co2l', tx(g.L.co2[0], g.L.co2[1], 'CO₂ in the air', g.fs.note, '#55534c', 600, 'start', true), anim)}
    ${part('co2t', tx(g.L.co2t[0], g.L.co2t[1], '≈ 2000 ppm', g.fs.note - 1, '#55534c', 400, 'start', true), anim)}
    ${part('co2n', tx(g.L.now[0], g.L.now[1], '430 ppm', g.fs.note - 1, '#55534c', 700, 'end', true), anim)}
    ${part('arc', `${chipSvg(g, 'arc')}<rect x="${f(xa - g.r * 0.85)}" y="${f(yS(g, ARC_HI))}" width="${f(g.r * 1.7)}" height="${f(yS(g, ARC_LO) - yS(g, ARC_HI))}" rx="${f(g.r * 0.85)}" style="fill:${GROUPS.arc.col};stroke:#fbfaf6;stroke-width:2"/>`, anim)}
    ${part('pur', `${chipSvg(g, 'pur')}${dot(xp, yp, g.r, GROUPS.pur.col)}`, anim)}
    ${part('a22', `${dot(xc, y22, g.r, GROUPS.cya.col, true)}${tx(g.L.s22[0], g.L.s22[1], `<tspan style="font-weight:700;fill:#141413">${S_ANCL}</tspan> rebuilt ancestor`, g.fs.note - 1, '#4a4945', 400, 'start')}`, anim)}
    ${part('l39', `<path data-k="l39p" d="M${f(xc)},${f(y22)} V${f(y39)}" style="fill:none;stroke:${GROUPS.cya.col};stroke-width:2.6"/>`, anim)}
    ${part('d39', dot(anim ? 0 : xc, anim ? 0 : y39, g.r, GROUPS.cya.col, true), anim)}
    ${part('s39', tx(g.L.s39[0], g.L.s39[1], `<tspan style="font-weight:700;fill:#141413">${S_SSU}</tspan> + small subunit`, g.fs.note - 1, '#4a4945', 400, 'start'), anim)}
    ${part('l48', `<path data-k="l48p" d="M${f(xc)},${f(y39)} V${f(y48)}" style="fill:none;stroke:${GROUPS.cya.col};stroke-width:2.6"/>`, anim)}
    ${part('d48', dot(anim ? 0 : xc, anim ? 0 : y48, g.r, GROUPS.cya.col), anim)}
    ${part('cya', chipSvg(g, 'cya'), anim)}
    ${part('grn', `${chipSvg(g, 'grn')}${dot(xg, yg, g.r, GROUPS.grn.col)}`, anim)}
    ${part('pumpC', pumpSvg(g, 'cya'), anim)}${part('pumpG', pumpSvg(g, 'grn'), anim)}
    ${part('red', `${chipSvg(g, 'red')}${dot(xr, yr, g.r, GROUPS.red.col)}`, anim)}
    ${part('landl', tx(g.L.land[0], g.L.land[1], 'land plants', g.fs.note, lc, 700, 'start'), anim)}
    ${part('dsc', `<path clip-path="url(#${p}-dsck)" d="M${f(xg + g.r)},${f(yg)} C${f(xg + 70)},${f(yg)} ${f(xL0 - 60)},${f(yL)} ${f(xL0)},${f(yL)}" style="fill:none;stroke:${lc};stroke-width:2;stroke-dasharray:6 5;opacity:.8"/>`, anim)}
    ${part('land', `<g clip-path="url(#${p}-lc)">${line([[xL0, yL], [xA, yL]], lc, 3, ';stroke-dasharray:7 6')}${landSolid.map(q => line(q, lc, 4)).join('')}</g>`, anim)}
    ${part('anc', `${dot(xA, yL, g.r, lc, true)}${tx(g.L.anc[0], g.L.anc[1], 'flowering-plant ancestor', g.fs.note, lc, 600)}${tx(g.L.anc[0], g.L.anc[1] + g.fs.sv + 3, `S ${Math.round(S_ANC)}`, g.fs.sv - 1, '#141413', 700)}`, anim)}
    ${part('lnd', `${chipSvg(g, 'lnd')}${dot(xEnd, yS(g, S_NOW), g.r, lc)}`, anim)}
    ${anim ? `<g class="co2k">${kidG('kd', 13, '')}</g>` : ''}
  </g>`;
}

/* ================================================================ the animation */

/** Constant speed between t0 and t1 with smooth starts and stops (as v3's marker). */
function cruise(t: number, t0: number, t1: number): number {
  const u = clamp((t - t0) / (t1 - t0)), r = 0.12, v = 1 / (1 - r);
  if (u < r) return (v * u * u) / (2 * r);
  if (u > 1 - r) return 1 - (v * (1 - u) * (1 - u)) / (2 * r);
  return v * (u - r / 2);
}
type W = [number, number];
// Beat k (0-based) of C2STORY5, its steps (s). Motion ends: 1.7 + 3.0 + 2.5 + 3.1 + 7.0 + 8.4 + 4.3 + 0.6 = 30.6 s.
const B0 = { ax: [0, 0.8] as W, arc: [1.0, 1.7] as W };
const B1 = { pur: [0.2, 0.9] as W, a22: [1.2, 1.7] as W, up: [1.9, 2.6] as W, s39: [2.6, 3.0] as W };
const B2 = { up: [0.2, 0.8] as W, cya: [0.9, 1.5] as W, goe: [1.8, 2.5] as W };
const B3 = { grn: [0.2, 0.9] as W, pumpC: [1.2, 1.6] as W, pumpG: [1.7, 2.1] as W, red: [2.4, 3.1] as W };
const B4 = { lab: [0.2, 0.5] as W, dsc: [0.6, 1.6] as W, o2l: [1.9, 2.2] as W, o2: [2.3, 3.9] as W, o2t: [4.0, 4.3] as W, co2l: [4.6, 4.9] as W, co2: [5.0, 6.6] as W, co2t: [6.7, 7.0] as W };
const B5 = { ice: [0.2, 1.2] as W, dash: [1.5, 2.7] as W, anc: [2.8, 3.2] as W, solid: [3.4, 7.4] as W, lnd: [7.7, 8.4] as W };
const B6 = { kin: [0.2, 0.6] as W, ride: [0.7, 1.9] as W, now: [1.9, 2.2] as W, go: [2.5, 3.3] as W, back: [3.3, 3.6] as W, glad: [3.15, 3.5] as W, sweat: [3.9, 4.3] as W };
const HOLDS: number[][] = [[], [1.0], [1.6], [1.0, 2.2], [1.7, 4.4], [1.3, 7.5], [2.3, 3.7], []];

function frame(a: Api, beat: number, t: number): void {
  const g = STAGE, on = (b: number, w: W): number => from(beat, t, b, w[0], w[1]);
  a.attr('all', 'opacity', beat === 7 ? (1 - 0.35 * ease(t, 0, 0.6)).toFixed(3) : '1');

  /* beat 1: the axes; archaea */
  a.op('ax', on(0, B0.ax)); a.op('arc', on(0, B0.arc));
  /* beat 2: purple bacteria (pause); the rebuilt ancestor, the small subunit raises S 22 → 39 */
  a.op('pur', on(1, B1.pur)); a.op('a22', on(1, B1.a22));
  const [xc] = pt(g, 'cya'), y22 = yS(g, S_ANCL), y39 = yS(g, S_SSU), y48 = yS(g, GROUPS.cya.s);
  const u1 = on(1, B1.up), u1e = beat > 1 ? 1 : ease2(beat === 1 ? t : -1, ...B1.up), y1 = lerp(y22, y39, u1e);
  if (u1 > 0) { a.put('d39', [xc, y1]); a.op('l39', 1); a.attr('l39p', 'd', `M${f(xc)},${f(y22)} V${f(y1)}`); }
  a.op('s39', on(1, B1.s39));
  /* beat 3: cyanobacteria (S 48; pause); the Great Oxidation Event */
  const u2 = beat > 2 ? 1 : ease2(beat === 2 ? t : -1, ...B2.up), y2 = lerp(y39, y48, u2);
  if (u2 > 0) { a.put('d48', [xc, y2]); a.op('l48', 1); a.attr('l48p', 'd', `M${f(xc)},${f(y39)} V${f(y2)}`); }
  a.op('cya', on(2, B2.cya)); a.op('goe', on(2, B2.goe));
  /* beat 4: green algae (pause); the CO₂ pumps, cyanobacteria then green algae (pause); red algae */
  a.op('grn', on(3, B3.grn)); a.op('pumpC', on(3, B3.pumpC)); a.op('pumpG', on(3, B3.pumpG)); a.op('red', on(3, B3.red));
  /* beat 5: land plants (pause); O₂ (pause); CO₂ */
  const [xg] = pt(g, 'grn'), xL0 = xIn(g, 1, YA_LAND), xO2 = xAt(g, 8e8), xEnd = xAt(g, 0), xB0 = g.segs[1].x[0], xC0 = g.segs[2].x[0];
  a.op('landl', on(4, B4.lab));
  const ud = on(4, B4.dsc); a.op('dsc', ud > 0 ? 1 : 0); a.attr('dsck', 'width', f((xL0 - xg + 4) * ud));
  a.op('o2l', on(4, B4.o2l));
  const uo = beat > 4 ? 1 : beat === 4 ? clamp((t - B4.o2[0]) / (B4.o2[1] - B4.o2[0])) : 0;
  a.op('o2', uo > 0 ? 1 : 0); a.attr('o2c', 'width', f((xEnd - xO2 + 6) * (beat > 4 ? 1 : cruise(t, ...B4.o2)) * (uo > 0 ? 1 : 0)));
  a.op('o2t', on(4, B4.o2t)); a.op('co2l', on(4, B4.co2l));
  const ucb = beat > 4 ? 1 : beat === 4 ? cruise(t, ...B4.co2) : 0;
  a.op('co2b', ucb > 0 ? 1 : 0); a.attr('cbc', 'width', f((g.segs[1].x[1] - xB0 + 4) * ucb));
  a.op('co2t', on(4, B4.co2t));
  /* beat 6: the ice ages (pause); the land-plant line, slowly (pause); today */
  const ucc = beat > 5 ? 1 : beat === 5 ? cruise(t, ...B5.ice) : 0;
  a.op('co2c', ucc > 0 ? 1 : 0); a.attr('ccc', 'width', f((xEnd - xC0 + 4) * ucc));
  const xA = xIn(g, 1, YA_ANC), wD = xA - xL0, wAll = xEnd - xL0 + 6;
  const wl = beat > 5 ? wAll : beat === 5 ? (t < B5.solid[0] ? wD * ease2(t, ...B5.dash) : lerp(wD, wAll, cruise(t, ...B5.solid))) : 0;
  a.op('land', wl > 0 ? 1 : 0); a.attr('lc', 'width', f(wl + 3));
  a.op('anc', on(5, B5.anc)); a.op('lnd', on(5, B5.lnd));
  /* beat 7: CO₂ rises since 1750 (the character rides it), 430 ppm (pause); it bumps into today's RuBisCO (pause); warming */
  const ry1 = yC(g, CA_1750), ryN = yC(g, CA_NOW);
  const rideU = beat > 6 ? 1 : beat === 6 ? ease2(t, ...B6.ride) : 0, yk = lerp(ry1, ryN, rideU);
  const showRise = beat > 6 || (beat === 6 && t >= B6.ride[0]);
  a.op('co2r', showRise ? 1 : 0); a.attr('crc', 'y', f(showRise ? yk - 2 : ry1 + 3)); a.attr('crc', 'height', f(showRise ? ry1 + 3 - yk + 2 : 0));
  a.op('co2n', on(6, B6.now));
  if (beat >= 6) {
    const L = g.chips.lnd, m = IMG['8ruc'], rTop = L.r[1] - (m.h * g.rk) / 2;
    const p1: V = [xEnd, ryN], hit: V = [L.r[0] - 4, rTop - 6], rest: V = [L.r[0] - 4, rTop - 13];
    const tt = beat > 6 ? 99 : t;
    const go = ease2(tt, ...B6.go), back = ease(tt, ...B6.back);
    let at: V = rideU < 1 ? [xEnd, yk] : p1;
    if (go > 0) at = [lerp(p1[0], hit[0], go), lerp(p1[1], hit[1], go)];
    if (back > 0) at = [hit[0], lerp(hit[1], rest[1], back)];
    const o = beat > 6 ? 1 : ease(t, ...B6.kin), glad = ease(tt, ...B6.glad), sw = ease(tt, ...B6.sweat);
    if (o > 0.004) kid(a, 'kd', at, o, { h: glad * (1 - sw), n: (1 - glad) + glad * sw, sweat: sw });
  }
}

const NOTE = 'RuBisCO’s CO₂ preference (S) on a broken, linear time axis, built up point by point: archaea, purple bacteria, the small subunit (rebuilt ancestors 22 → 39), cyanobacteria, the Great Oxidation Event, green algae and their CO₂ pump, red algae; then land plants, O₂ and CO₂ in the air, the flowering-plant line drawn slowly (81 → 87) while the climate swung; the CO₂ character rides the rise since 1750 into today’s RuBisCO.';

export const STAGING: Staging = {
  ...makeScene({ id: 'evoG', name: 'evoG · The RuBisCO evolution graph', note: NOTE, beats: C2STORY5, holds: HOLDS, svg: () => graphSvg(STAGE, true), frame }),
  // only the closing question on the stage, as c2story-evo.ts; in the free band above the graph
  keys: [{ beat: 7, text: 'First: how does the leaf turn 3-PGA into sugar?', x: 800, y: 84, size: 44 }],
};
