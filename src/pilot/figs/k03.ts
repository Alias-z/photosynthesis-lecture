// Slide C3 · Reduction, regeneration, cost (lecture 2 redo, 27 Oct 2026; research/redo-2026-10-27/C_CYCLE_RUBISCO.md).
// Real figures: Calvin's Nobel lecture 1961, Fig. 15 (Bassham's light–dark transient: light off → 3-PGA rises, RuBP falls
// to ≈ 0) and Fig. 17 (Wilson & Calvin 1955: CO₂ cut from 1 % to 0.003 % → RuBP rises, 3-PGA falls). © The Nobel
// Foundation 1961. The 1-bit scans are shown inside their own axes only; the axes, ticks and the light/CO₂ bands are
// redrawn over them for legibility (the scan itself is not edited). Drawn: the cycle in three phases per 3 CO₂, after
// Raines 2022 Fig. 1b (CC BY 4.0) without its engineering targets and photorespiration branch; ◆ marks the four
// thioredoxin-activated enzymes (Michelet et al. 2013, Fig. 1). Crops and credits: assets/SOURCES-L2a.md.
import type { PlateText, Variant } from '../types';
import lightPng from '../../assets/photos/c3-light.png';
import co2Png from '../../assets/photos/c3-co2.png';
import './k03.css';

export const PLATE: PlateText = {
  n: 'C3',
  title: 'Reduction and regeneration',
  status: 'draft',
  lead: 'ATP and NADPH reduce 3-PGA to triose phosphate; most triose phosphate is used to regenerate RuBP.',
  points: [
    { claim: 'Reduction.', text: '3-PGA → triose phosphate, using ATP and NADPH<br>Here the energy of the light reactions enters the sugar' },
    { claim: 'Regeneration.', text: 'Five of every six triose phosphates rebuild RuBP, using more ATP<br>Without RuBP regeneration the cycle stops' },
    { claim: 'Cost.', text: 'Per CO₂ fixed: 3 ATP + 2 NADPH<br>One triose phosphate leaves the cycle per 3 CO₂ fixed' },
  ],
  refs: [
    { label: 'Calvin 1961 (Nobel lecture)', url: 'https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/' },
    { label: 'Wilson & Calvin 1955', url: 'https://doi.org/10.1021/ja01627a050' },
    { label: 'Raines 2022', url: 'https://doi.org/10.1111/nph.18394' },
    { label: 'Michelet et al. 2013', url: 'https://doi.org/10.3389/fpls.2013.00470' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Light off: 3-PGA rises, RuBP falls' },
  { id: 'b', name: 'CO₂ cut: RuBP rises, 3-PGA falls' },
  { id: 'c', name: 'Both transients (Calvin 1961, Figs 15, 17)' },
  { id: 'd', name: 'Calvin–Benson cycle per 3 CO₂ (drawn)' },
  { id: 'e', name: 'Light off, with the cycle' },
  { id: 'f', name: 'CO₂ cut, with the cycle' },
];

/* ---------- shared parts (the 4b u–z helpers, copied into this module with the prefix fk03) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
type Box = [number, number, number, number];
type Ink = 'ink' | 'grey' | 'green' | 'blue' | 'amber' | 'red';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk03-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** An italic variable such as A or k. */
const it = (s: string): string => `<tspan class="fk03-it">${s}</tspan>`;
const cw = (c: Ink | 'paper', s: string): string => `<tspan class="fk03-c-${c}">${s}</tspan>`;

interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following
 *  (never stretched). A published figure ('fig') multiplies its white ground into the page; a micrograph keeps its own
 *  ground in a frame with rounded corners. `holes` = [u0, v0, u1, v1] boxes left out of the crop (panel letters).
 *  at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number, o: { win?: Box; fig?: boolean; holes?: Box[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s, r = o.fig ? 0 : 8;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const hl = (o.holes ?? []).map(([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`).join('');
  const outer = `M${f(x + r)},${f(y)} H${f(x + w - r)} Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + r)} V${f(y + h - r)} Q${f(x + w)},${f(y + h)} ${f(x + w - r)},${f(y + h)} H${f(x + r)} Q${f(x)},${f(y + h)} ${f(x)},${f(y + h - r)} V${f(y + r)} Q${f(x)},${f(y)} ${f(x + r)},${f(y)}Z`;
  const clip = `<clipPath id="${id}"><path clip-rule="evenodd" d="${outer}${hl}"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk03-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk03-ldh" d="${d}"/><path class="fk03-ldk" d="${d}"/><circle class="fk03-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** Width of a label pill: the visible characters only (markup such as <tspan> is not counted). */
const pw = (s: string): number => s.replace(/<[^>]+>/g, '').length * 8.7 + 22;
/** A label pill centred at (x, y): white on images, tinted (tint) on the white ground of a figure; with `to`, one leader
 *  (or several) from its edge to the point(s). */
function pill(x: number, y: number, s: string, to?: Pt | Pt[], tint = false): string {
  const w = pw(s), tos: Pt[] = to === undefined ? [] : typeof to[0] === 'number' ? [to as Pt] : (to as Pt[]);
  const ld = tos.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="${tint ? 'fk03-pillbg-t' : 'fk03-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk03-pill', 'middle')}`;
}
/** Grey credit line under a published figure; '|' breaks it onto a second line. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'fk03-crd', a)).join('');

/** Arrowheads in each ink, prefixed per figure (ids must be unique when the gallery shows every variant at once). */
const defs = (p: string): string => `<defs>${(['ink', 'grey', 'green', 'blue', 'amber', 'red'] as Ink[]).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="fk03-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fk03-ar fk03-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** A plain box with a label (and an optional second line), centred at (x, y). */
function node(x: number, y: number, s: string, o: { w?: number; sub?: string; cls?: string; tint?: boolean } = {}): string {
  const w = o.w ?? Math.max(s.replace(/<[^>]+>/g, '').length * 11.6 + 26, o.sub ? o.sub.replace(/<[^>]+>/g, '').length * 9.4 + 26 : 0);
  const h = o.sub ? 60 : 40;
  return `<rect class="${o.tint ? 'fk03-box-t' : 'fk03-box'}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="9"/>`
    + (o.sub ? `${T(x, y - 4, s, o.cls ?? 'fk03-node', 'middle')}${T(x, y + 19, o.sub, 'fk03-s', 'middle')}` : T(x, y + 7.5, s, o.cls ?? 'fk03-node', 'middle'));
}
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fk03" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- C3 parts ---------- */

const NOBEL = '© The Nobel Foundation 1961, www.nobelprize.org';
const CR = {
  f15: `Calvin 1961, Nobel lecture, Fig. 15 (Bassham) · ${NOBEL}`,
  f17: `Calvin 1961, Nobel lecture, Fig. 17 (Wilson & Calvin 1955) · ${NOBEL}`,
  both: `Calvin 1961, Nobel lecture, Figs 15, 17 · ${NOBEL}`,
  raines: 'after Raines 2022, New Phytol, Fig. 1b · CC BY 4.0; ◆ after Michelet et al. 2013',
};
const TS = ' '; // thin space in 10 000

/* Fig. 15 (Chlorella, Bassham): ticks found in the file. Time 0 → u 170, 1.1633 px per s (0–700 s before the axis break);
 * counts 0 → v 692.5, 0.02415 px per count min⁻¹. The window keeps the plot only: below the printed light/dark band,
 * above the time axis, left of the break. */
const F15: Img = { href: lightPng, w: 1423, h: 823 };
const F15W: Box = [175, 78, 820, 610];
const u15 = (t: number): number => 170 + 1.1633 * t;
const v15 = (c: number): number => 692.5 - 0.02415 * c;
/* Fig. 17 (Wilson & Calvin 1955, 6 °C): time 0 → u 412.5, 2.618 px per s; pool 0 → v 1335, 52.4 px per unit. The window
 * leaves out the printed CO₂ line along the top. */
const F17: Img = { href: co2Png, w: 1437, h: 1446 };
const F17W: Box = [158, 106, 1252, 1226];
const u17 = (t: number): number => 412.5 + 2.618 * t;
const v17 = (r: number): number => 1335 - 52.4 * r;

interface Plot { svg: string; h: number; X: (t: number) => number; Y: (c: number) => number }
/** Redrawn axes over a scan: frame lines, ticks with labels and the two axis titles. */
function axes(X: (t: number) => number, Y: (c: number) => number, xt: [number, string][], yt: [number, string][], xr: [number, number], yr: [number, number], xl: string, yl: string, small = false): string {
  const tk = small ? 'fk03-tks' : 'fk03-tk', x0 = X(xr[0]), x1 = X(xr[1]), y0 = Y(yr[0]), y1 = Y(yr[1]);
  return `<path class="fk03-axis" d="M${f(x0)},${f(y1)} V${f(y0)} H${f(x1)}"/>
    ${xt.map(([t, s]) => `<path class="fk03-axis" d="M${f(X(t))},${f(y0)} v6"/>${T(X(t), y0 + (small ? 22 : 26), s, tk, 'middle')}`).join('')}
    ${yt.map(([c, s]) => `<path class="fk03-axis" d="M${f(x0)},${f(Y(c))} h-6"/>${T(x0 - 10, Y(c) + 6, s, tk, 'end')}`).join('')}
    ${T(x1, y0 + (small ? 44 : 52), xl, small ? 'fk03-tks' : 'fk03-ax', 'end')}
    <text class="${small ? 'fk03-tks' : 'fk03-ax'}" transform="translate(${f(x0 - (small ? 64 : 72))} ${f((y0 + y1) / 2)}) rotate(-90)" text-anchor="middle">${yl}</text>`;
}
/** A band above the plot naming the condition, from t0 to t1. */
const band = (X: (t: number) => number, y: number, t0: number, t1: number, s: string, dark: boolean): string =>
  `<rect class="${dark ? 'fk03-band-k' : 'fk03-band-l'}" x="${f(X(t0))}" y="${f(y)}" width="${f(X(t1) - X(t0))}" height="26"/>${T((X(t0) + X(t1)) / 2, y + 19, s, dark ? 'fk03-band-d' : 'fk03-band', 'middle')}`;

/** Fig. 15 at width w, its plot's top-left at (x, y): light band, redrawn axes, 3-PGA and RuBP named. */
function lightOff(p: string, x: number, y: number, w: number, small = false): Plot {
  const a = shot(`${p}-15`, F15, x, y + 30, w, { fig: true, win: F15W });
  const X = (t: number): number => a.at(u15(t), 0)[0], Y = (c: number): number => a.at(0, v15(c))[1];
  const ticks: [number, string][] = (small ? [0, 200, 400, 600] : [0, 100, 200, 300, 400, 500, 600, 700]).map(t => [t, `${t}`]);
  return {
    h: a.h + 30, X, Y,
    svg: `${a.svg}
    ${band(X, y, 0, 400, 'light', false)}${band(X, y, 400, 707, 'dark', true)}
    ${axes(X, Y, ticks, [[0, '0'], [10000, `10${TS}000`], [20000, `20${TS}000`]], [0, 707], [0, 25400], 'time (s)', '¹⁴C (counts min⁻¹)', small)}
    ${pill(X(612), Y(23600), '3-PGA', [X(512), Y(23300)], true)}${pill(X(520), Y(6800), 'RuBP', [X(411), Y(3300)], true)}`,
  };
}
/** Fig. 17 at width w: CO₂ band, redrawn axes, RuBP and 3-PGA named. */
function co2Cut(p: string, x: number, y: number, w: number, small = false): Plot {
  const a = shot(`${p}-17`, F17, x, y + 30, w, { fig: true, win: F17W });
  const X = (t: number): number => a.at(u17(t), 0)[0], Y = (r: number): number => a.at(0, v17(r))[1];
  return {
    h: a.h + 30, X, Y,
    svg: `${a.svg}
    ${band(X, y, -100, 0, small ? '1 %' : '1 % CO₂', false)}${band(X, y, 0, 380, '0.003 % CO₂', true)}
    ${axes(X, Y, [-100, 0, 100, 200, 300].map(t => [t, `${t}`] as [number, string]), [[0, '0'], [10, '10'], [20, '20']], [-100, 380], [0, 23.4], 'time (s), 6 °C', 'pool size (relative)', small)}
    ${pill(X(300), Y(17), 'RuBP', [X(330), Y(14)], true)}${pill(X(318), Y(4.5), '3-PGA', [X(336), Y(6.9)], true)}`,
  };
}

/* ---------- the cycle, drawn: three phases per 3 CO₂ with carbon counts and energy (after Raines 2022, Fig. 1b) ---------- */

/** ◆ after an enzyme name: activated by thioredoxin in the light. */
const TRX = '<tspan class="fk03-c-trx">◆</tspan>';
function cycle(p: string): string {
  const L = 150, R = 630, Tp = 130, Bt = 410;
  return `
    ${node(L, Tp, '3 RuBP', { sub: '15 C', w: 120 })}${node(R, Tp, '6 3-PGA', { sub: '18 C', w: 128 })}
    ${node(R, Bt, '6 triose-P', { sub: '18 C', w: 140 })}${node(L, Bt, '3 Ru5P', { sub: '15 C', w: 120 })}
    ${ar(p, 'green', `M${L + 66},${Tp} L${R - 70},${Tp}`)}${ar(p, 'green', `M390,46 L390,${Tp - 6}`, 'fk03-thin')}${T(400, 52, '3 CO₂', 'fk03-h')}
    ${T(390, Tp + 30, 'RuBisCO', 'fk03-l', 'middle')}${T(226, Tp - 16, 'carboxylation', 'fk03-h fk03-c-green')}
    ${ar(p, 'blue', `M${R},${Tp + 32} L${R},${Bt - 34}`)}
    ${ar(p, 'blue', `M770,212 L${R + 8},212`, 'fk03-thin')}${T(778, 202, '6 ATP', 'fk03-h', 'end')}${T(778, 236, 'PGK', 'fk03-s', 'end')}
    ${ar(p, 'blue', `M770,300 L${R + 8},300`, 'fk03-thin')}${T(778, 290, '6 NADPH', 'fk03-h', 'end')}${T(778, 324, `GAPDH${TRX}`, 'fk03-s', 'end')}
    ${ar(p, 'amber', `M${R - 72},${Bt} L${L + 64},${Bt}`)}${T(390, Bt - 14, '5 triose-P (15 C)', 'fk03-s', 'middle')}
    ${T(390, Bt + 26, `FBPase${TRX} · SBPase${TRX} · 6 more`, 'fk03-s', 'middle')}
    ${ar(p, 'amber', `M${L},${Bt - 32} L${L},${Tp + 32}`)}
    ${ar(p, 'amber', `M30,270 L${L - 8},270`, 'fk03-thin')}${T(26, 256, '3 ATP', 'fk03-h')}${T(L + 14, 300, `PRK${TRX}`, 'fk03-s')}
    ${ar(p, 'grey', `M${R},${Bt + 32} L${R},${Bt + 92}`)}${T(R, Bt + 118, '1 triose-P out', 'fk03-node', 'middle')}${T(R, Bt + 142, 'sucrose, starch', 'fk03-s', 'middle')}
    ${T(R - 18, 356, 'reduction', 'fk03-h fk03-c-blue', 'end')}${T(L + 18, 356, 'regeneration', 'fk03-h fk03-c-amber')}
    ${T(390, 252, 'per 3 CO₂: 9 ATP + 6 NADPH', 'fk03-big', 'middle')}${T(390, 284, 'per CO₂: 3 ATP + 2 NADPH', 'fk03-l', 'middle')}
    ${T(26, 560, `${TRX} activated by thioredoxin in light`, 'fk03-s')}`;
}

/** The cycle reduced to its three pools, with the arrows a transient stops crossed out and the pools that rise or fall
 *  marked ▲ / ▼. block 'light': no ATP and NADPH, so reduction and RuBP regeneration stop; 'co2': no carboxylation. */
function loop(p: string, ox: number, oy: number, block: 'light' | 'co2'): string {
  const ru: Pt = [ox + 62, oy + 70], pg: Pt = [ox + 248, oy + 70], tp: Pt = [ox + 155, oy + 250];
  const x = (c: Pt): string => `<path class="fk03-x" d="M${f(c[0] - 11)},${f(c[1] - 11)} L${f(c[0] + 11)},${f(c[1] + 11)} M${f(c[0] + 11)},${f(c[1] - 11)} L${f(c[0] - 11)},${f(c[1] + 11)}"/>`;
  const up = '<tspan class="fk03-c-red">▲</tspan>', dn = '<tspan class="fk03-c-blue">▼</tspan>';
  const [mr, mp] = block === 'light' ? [dn, up] : [up, dn];
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return `
    ${node(...ru, `RuBP ${mr}`, { w: 104 })}${node(...pg, `3-PGA ${mp}`, { w: 112 })}${node(...tp, 'triose-P', { w: 112 })}
    ${ar(p, 'green', `M${ru[0] + 54},${ru[1]} L${pg[0] - 58},${pg[1]}`)}${ar(p, 'green', `M${ox + 155},${oy + 6} L${ox + 155},${oy + 62}`, 'fk03-thin')}${T(ox + 168, oy + 18, 'CO₂', 'fk03-h')}
    ${ar(p, 'blue', `M${pg[0] - 14},${pg[1] + 22} L${tp[0] + 30},${tp[1] - 22}`)}${T(pg[0] + 4, oy + 176, 'ATP', 'fk03-s')}${T(pg[0] + 4, oy + 198, 'NADPH', 'fk03-s')}
    ${ar(p, 'amber', `M${tp[0] - 30},${tp[1] - 22} L${ru[0] + 14},${ru[1] + 22}`)}${T(ru[0] - 4, oy + 186, 'ATP', 'fk03-s', 'end')}
    ${ar(p, 'grey', `M${tp[0]},${tp[1] + 22} L${tp[0]},${tp[1] + 70}`)}${T(tp[0], tp[1] + 96, 'sucrose, starch', 'fk03-s', 'middle')}
    ${block === 'light'
      ? `${x(mid(pg, tp))}${x(mid(tp, ru))}${T(ox + 155, oy - 26, 'light off: no ATP, NADPH', 'fk03-l', 'middle')}`
      : `${x(mid(ru, pg))}${T(ox + 155, oy - 26, 'CO₂ cut: no carboxylation', 'fk03-l', 'middle')}`}
    ${T(ox + 155, oy + 384, `${up} rises · ${dn} falls`, 'fk03-s', 'middle')}`;
}

/* ---------- a · light off (Fig. 15) large ---------- */

function drawA(): string {
  const p = 'fk03a', g = lightOff(p, 96, 24, 610);
  return svg(p, 'Radioactivity in 3-phosphoglycerate (3-PGA) and ribulose-1,5-bisphosphate (RuBP) in Chlorella photosynthesising with carbon-14 dioxide. While the light is on both are steady. When the light is turned off at 400 seconds, 3-PGA rises steeply to more than twice its level, while RuBP falls to almost zero within about 30 seconds: without ATP and NADPH, 3-PGA is no longer reduced and RuBP is no longer regenerated, but RuBisCO keeps making 3-PGA from the RuBP left.', `
    ${g.svg}
    ${credit(790, 592, CR.f15)}
  `);
}

/* ---------- b · CO₂ cut (Fig. 17) large ---------- */

function drawB(): string {
  const p = 'fk03b', g = co2Cut(p, 92, 10, 470), x = 590;
  return svg(p, 'Pool sizes of ribulose-1,5-bisphosphate (RuBP), ribulose monophosphate, 3-phosphoglycerate (3-PGA) and triose phosphate in Chlorella at 6 degrees, when the CO2 is cut from 1 percent to 0.003 percent at time 0. RuBP rises to more than twice its level while 3-PGA falls, then both oscillate: RuBP is the CO2 acceptor, 3-PGA its product.', `
    ${g.svg}
    ${T(x, 120, 'RuBP ▲', 'fk03-h fk03-c-red')}${T(x, 146, 'CO₂ acceptor', 'fk03-l')}
    ${T(x, 214, '3-PGA ▼', 'fk03-h fk03-c-blue')}${T(x, 240, 'carboxylation product', 'fk03-l')}
    ${credit(790, 592, CR.f17.replace(' · ', ' | '))}
  `);
}

/* ---------- c · both transients side by side ---------- */

function drawC(): string {
  const p = 'fk03c', a = lightOff(p, 72, 96, 340, true), b = co2Cut(p, 498, 66, 290, true);
  const up = '<tspan class="fk03-c-red">▲</tspan>', dn = '<tspan class="fk03-c-blue">▼</tspan>';
  return svg(p, 'Left: when the light is turned off, 3-phosphoglycerate (3-PGA) rises and ribulose-1,5-bisphosphate (RuBP) falls to almost zero. Right: when the CO2 is cut from 1 to 0.003 percent, RuBP rises and 3-PGA falls. Together they show that RuBP takes up CO2 to make 3-PGA, and that ATP and NADPH from the light are needed to reduce 3-PGA and to regenerate RuBP.', `
    ${a.svg}${b.svg}
    ${T(a.X(350), 96 + a.h + 92, `light off: 3-PGA ${up} RuBP ${dn}`, 'fk03-h', 'middle')}
    ${T(b.X(140), 96 + a.h + 92, `CO₂ cut: RuBP ${up} 3-PGA ${dn}`, 'fk03-h', 'middle')}
    ${credit(790, 592, CR.both)}
  `);
}

/* ---------- d · the cycle, drawn ---------- */

function drawD(): string {
  const p = 'fk03d';
  return svg(p, 'The Calvin-Benson cycle drawn per three CO2. Carboxylation: RuBisCO adds 3 CO2 to 3 RuBP (15 carbons), giving 6 3-PGA (18 carbons). Reduction: with 6 ATP and 6 NADPH, PGK and GAPDH make 6 triose phosphates. One triose phosphate leaves for sucrose and starch; the other five (15 carbons) are rearranged by eight more enzymes, including FBPase and SBPase, to 3 ribulose-5-phosphate, and PRK uses 3 ATP to make 3 RuBP again. In total 9 ATP and 6 NADPH per 3 CO2, or 3 ATP and 2 NADPH per CO2. GAPDH, FBPase, SBPase and PRK are activated by thioredoxin in light.', `
    ${cycle(p)}
    ${credit(790, 592, CR.raines)}
  `);
}

/* ---------- e · light off with the three-pool loop ---------- */

function drawE(): string {
  const p = 'fk03e', g = lightOff(p, 84, 30, 410, true);
  return svg(p, 'Left: when the light is turned off, 3-phosphoglycerate (3-PGA) rises and ribulose-1,5-bisphosphate (RuBP) falls to almost zero. Right: the cycle reduced to RuBP, 3-PGA and triose phosphate; without ATP and NADPH the reduction of 3-PGA and the regeneration of RuBP stop, so 3-PGA piles up and RuBP is used up.', `
    ${g.svg}${loop(p, 478, 150, 'light')}
    ${credit(790, 592, CR.f15)}
  `);
}

/* ---------- f · CO₂ cut with the three-pool loop ---------- */

function drawF(): string {
  const p = 'fk03f', g = co2Cut(p, 74, 14, 352, true);
  return svg(p, 'Left: when the CO2 is cut, ribulose-1,5-bisphosphate (RuBP) rises and 3-phosphoglycerate (3-PGA) falls. Right: the cycle reduced to RuBP, 3-PGA and triose phosphate; without CO2 the carboxylation stops, so RuBP piles up while 3-PGA is still reduced and falls.', `
    ${g.svg}${loop(p, 470, 150, 'co2')}
    ${credit(790, 592, CR.f17)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
