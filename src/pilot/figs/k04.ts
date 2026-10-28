// Slide C4 · Where the carbon goes (lecture 2 redo, 27 Oct 2026; research/redo-2026-10-27/C_CYCLE_RUBISCO.md).
// Real figures: Graf et al. 2010 PNAS Fig. 1A (Arabidopsis leaf starch over 12 h light / 12 h dark, and with an
// unexpected dusk at 8 h; © 2010 NAS, lecture use with credit) and Streb & Zeeman 2012, The Arabidopsis Book, Fig. 4
// (TEM of chloroplasts at the end of the day and of the night: panels C, G mesophyll; E, I guard cell; © 2012 ASPB,
// lecture use with credit). Drawn: triose-P/Pᵢ exchange on the phosphate translocator → sucrose → phloem; starch by day,
// maltose out through MEX1 at night; after Sharkey 2024 Fig. 1 (CC BY-NC-ND, so redrawn, not copied) and Niittylä 2004.
// Wheat stores sucrose rather than leaf starch: that belongs to C18. Crops and credits: assets/SOURCES-L2a.md.
import type { PlateText, Variant } from '../types';
import grafJpg from '../../assets/photos/c4-graf.jpg';
import strebJpg from '../../assets/photos/c4-streb.jpg';
import gcJpg from '../../assets/photos/c4-streb-gc.jpg';
import './k04.css';

export const PLATE: PlateText = {
  n: 'C4',
  title: 'Sucrose and starch',
  status: 'draft',
  lead: 'Triose phosphate becomes sucrose for export by day and starch for use at night.',
  points: [
    { claim: 'Sucrose.', text: 'Triose phosphate leaves the chloroplast in exchange for phosphate<br>In the cytosol it becomes sucrose, which the phloem carries to growing organs' },
    { claim: 'Starch.', text: 'Part of the carbon is stored as starch inside the chloroplast by day' },
    { claim: 'Starch degradation at night.', text: 'Starch is broken down at a steady rate, set by the circadian clock<br>It lasts until dawn, even when night comes early' },
  ],
  refs: [
    { label: 'Graf et al. 2010', url: 'https://doi.org/10.1073/pnas.0914299107' },
    { label: 'Streb & Zeeman 2012', url: 'https://doi.org/10.1199/tab.0160' },
    { label: 'Flügge 1999', url: 'https://doi.org/10.1146/annurev.arplant.50.1.27' },
    { label: 'Niittylä et al. 2004', url: 'https://doi.org/10.1126/science.1091811' },
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Leaf starch over day and night, early dusk (Graf 2010)' },
  { id: 'b', name: 'Chloroplast starch: end of day, end of night (TEM)' },
  { id: 'c', name: 'Starch curve and chloroplast TEM' },
  { id: 'd', name: 'Triose-P export and starch turnover (drawn)' },
  { id: 'e', name: 'Mesophyll and guard-cell plastids, day and night (TEM)' },
  { id: 'f', name: 'Starch curve and the day–night carbon routes' },
];

/* ---------- shared parts (the 4b u–z helpers, copied into this module with the prefix fk04) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
type Box = [number, number, number, number];
type Ink = 'ink' | 'grey' | 'green' | 'blue' | 'amber' | 'red';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk04-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** An italic variable such as A or k. */
const it = (s: string): string => `<tspan class="fk04-it">${s}</tspan>`;
const cw = (c: Ink | 'paper', s: string): string => `<tspan class="fk04-c-${c}">${s}</tspan>`;

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
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk04-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk04-ldh" d="${d}"/><path class="fk04-ldk" d="${d}"/><circle class="fk04-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
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
  return `${ld}<rect class="${tint ? 'fk04-pillbg-t' : 'fk04-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk04-pill', 'middle')}`;
}
/** Grey credit line under a published figure; '|' breaks it onto a second line. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'fk04-crd', a)).join('');

/** Arrowheads in each ink, prefixed per figure (ids must be unique when the gallery shows every variant at once). */
const defs = (p: string): string => `<defs>${(['ink', 'grey', 'green', 'blue', 'amber', 'red'] as Ink[]).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="fk04-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fk04-ar fk04-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** A plain box with a label (and an optional second line), centred at (x, y). */
function node(x: number, y: number, s: string, o: { w?: number; sub?: string; cls?: string; tint?: boolean } = {}): string {
  const w = o.w ?? Math.max(s.replace(/<[^>]+>/g, '').length * 11.6 + 26, o.sub ? o.sub.replace(/<[^>]+>/g, '').length * 9.4 + 26 : 0);
  const h = o.sub ? 60 : 40;
  return `<rect class="${o.tint ? 'fk04-box-t' : 'fk04-box'}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="9"/>`
    + (o.sub ? `${T(x, y - 4, s, o.cls ?? 'fk04-node', 'middle')}${T(x, y + 19, o.sub, 'fk04-s', 'middle')}` : T(x, y + 7.5, s, o.cls ?? 'fk04-node', 'middle'));
}
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fk04" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- C4 parts ---------- */

/* Graf et al. 2010, Fig. 1A (cropped from the figure; the panel letter is left out). Ticks found in the file: time 0 h →
 * u 122, 14 px per h; starch 0 → v 275, 31.6 px per mg g⁻¹ FW. Squares: dusk at 12 h; diamonds: dusk at 8 h (hatched). */
const GRAF: Img = { href: grafJpg, w: 533, h: 395 };
const GRAF_HOLE: Box = [0, 0, 34, 40];
const gu = (h: number): number => 122 + 14 * h;
const gv = (s: number): number => 275 - 31.6 * s;
/* Streb & Zeeman 2012, Fig. 4: panels C (end of day) and G (end of night), mesophyll; E and I, guard cell. The windows
 * start below the panel letters and their white boxes (top 54 px). */
const STREB: Img = { href: strebJpg, w: 394, h: 323 };
const GC: Img = { href: gcJpg, w: 394, h: 191 };
const STREB_W: Box = [0, 54, 394, 269], GC_W: Box = [0, 54, 394, 137];
const STARCH_C: Pt = [104, 178], THYL_G: Pt = [300, 196], STARCH_I: Pt = [262, 150];
const CR = {
  graf: 'Graf et al. 2010, PNAS, Fig. 1A · © 2010 National Academy of Sciences',
  streb: 'Streb & Zeeman 2012, The Arabidopsis Book, Fig. 4 · © 2012 ASPB',
  sharkey: 'after Sharkey 2024, Plant Physiol, Fig. 1; Niittylä et al. 2004',
};
const day = '<tspan class="fk04-b">day</tspan>';

/** Graf Fig. 1A at width w with the two nights named and the dawn marked. */
function graf(p: string, x: number, y: number, w: number): { svg: string; h: number } {
  const a = shot(`${p}-g`, GRAF, x, y, w, { fig: true, holes: [GRAF_HOLE] });
  const at = (h: number, s: number): Pt => a.at(gu(h), gv(s));
  return {
    h: a.h,
    svg: `${a.svg}
    ${pill(...at(19.2, 5.9), 'dusk at 12 h', at(14.5, 4.9))}
    ${pill(...at(5.2, 0.9), 'early dusk at 8 h', at(10.5, 3.4), true)}
    ${pill(...at(21.2, 2.9), '≈ 95 % used by dawn', at(23.9, 0.18))}`,
  };
}
/** Streb Fig. 4 C and G at width w with day/night above and starch and thylakoids named. */
function streb(p: string, x: number, y: number, w: number, short = false): { svg: string; h: number } {
  const a = shot(`${p}-s`, STREB, x, y + 40, w, { fig: true, win: STREB_W });
  const cx = (u: number): number => a.at(u, 0)[0];
  return {
    h: a.h + 40,
    svg: `${a.svg}
    ${pill(cx(97), y + 14, 'end of day', undefined, true)}${pill(cx(297), y + 14, 'end of night', undefined, true)}
    ${pill(cx(97), y + 40 + a.h + 26, short ? 'starch' : 'starch granules', a.at(...STARCH_C), true)}${pill(cx(297), y + 40 + a.h + 26, short ? 'no starch' : 'thylakoids, no starch', a.at(...THYL_G), true)}`,
  };
}

/* ---------- a · Graf Fig. 1A large ---------- */

function drawA(): string {
  const p = 'fk04a', g = graf(p, 96, 30, 616);
  return svg(p, 'Starch in Arabidopsis leaves over a day: it rises through the 12 hour day to about 6.7 milligrams per gram fresh weight, then falls almost linearly through the night to nearly zero at the next dawn, 24 hours. When the night comes unexpectedly early, at 8 hours, starch stops at about 4.3 and is broken down more slowly, so that it too lasts until dawn.', `
    ${g.svg}
    ${T(400, 30 + g.h + 44, `${it('Arabidopsis')} rosette leaves, 12 h light / 12 h dark`, 'fk04-l', 'middle')}
    ${credit(780, 590, CR.graf)}
  `);
}

/* ---------- b · Streb Fig. 4 C, G large ---------- */

function drawB(): string {
  const p = 'fk04b', s = streb(p, 120, 20, 560);
  return svg(p, 'Electron micrographs of Arabidopsis mesophyll chloroplasts. At the end of the day the chloroplast is filled with large, pale starch granules between the thylakoid membranes. At the end of the night the chloroplast is slim and contains thylakoids but no starch.', `
    ${s.svg}
    ${T(400, 20 + s.h + 72, `${it('Arabidopsis')} mesophyll chloroplasts (TEM)`, 'fk04-l', 'middle')}
    ${credit(780, 590, CR.streb)}
  `);
}

/* ---------- c · the starch curve beside the micrographs ---------- */

function drawC(): string {
  const p = 'fk04c', g = graf(p, 6, 128, 430), s = streb(p, 456, 110, 330, true);
  return svg(p, 'Left: Arabidopsis leaf starch rises through the day and falls almost linearly through the night to nearly zero by dawn, also after an unexpectedly early dusk. Right: electron micrographs of mesophyll chloroplasts full of starch granules at the end of the day and without starch at the end of the night.', `
    ${g.svg}${s.svg}
    ${credit(6, 128 + g.h + 26, CR.graf.replace(' · ', ' | '), 'start')}${credit(786, 590, CR.streb)}
  `);
}

/* ---------- d · drawn: triose-P/Pᵢ exchange → sucrose → phloem by day; starch → maltose → sucrose at night ---------- */

function routes(p: string): string {
  const xc = 205, xe = 446, xs = 612, yt = 238, ys = 360, ym = 470;
  const dash = 'fk04-dash';
  return `
    <rect class="fk04-chl" x="22" y="70" width="${xe - 22}" height="${ym - 70 + 64}" rx="40"/>
    ${T(46, 106, 'chloroplast', 'fk04-h fk04-c-green')}${T(xe + 30, 106, 'cytosol', 'fk04-h')}
    ${ar(p, 'ink', `M${xc},34 L${xc},${126 - 24}`, 'fk04-thin')}${T(xc + 14, 44, 'CO₂', 'fk04-h')}
    ${node(xc, 146, 'Calvin–Benson cycle', { tint: true, w: 236 })}
    ${node(xc, yt, 'triose-P', { w: 110 })}${ar(p, 'ink', `M${xc},168 L${xc},${yt - 24}`)}
    ${node(xc, ys, 'starch', { w: 96 })}${ar(p, 'ink', `M${xc},${yt + 22} L${xc},${ys - 24}`)}
    ${node(xc, ym, 'maltose', { w: 108 })}${ar(p, 'ink', `M${xc},${ys + 22} L${xc},${ym - 24}`, dash)}
    <rect class="fk04-tr" x="${xe - 30}" y="${yt - 38}" width="60" height="76" rx="12"/>${T(xe, yt + 62, 'TPT', 'fk04-h', 'middle')}
    <rect class="fk04-tr" x="${xe - 30}" y="${ym - 24}" width="60" height="48" rx="12"/>${T(xe, ym - 36, 'MEX1', 'fk04-h', 'middle')}
    ${ar(p, 'ink', `M${xc + 57},${yt - 12} L${xs - 58},${yt - 12}`)}
    ${ar(p, 'grey', `M${xs - 58},${yt + 14} L${xc + 57},${yt + 14}`, 'fk04-thin')}${T(xe + 44, yt + 40, 'Pᵢ', 'fk04-h fk04-c-grey')}
    ${node(xs, yt, 'triose-P', { w: 110 })}${node(xs, ys, 'sucrose', { w: 110 })}${node(xs, ym, 'maltose', { w: 108 })}
    ${ar(p, 'ink', `M${xs},${yt + 22} L${xs},${ys - 24}`)}${ar(p, 'ink', `M${xs},${ym - 22} L${xs},${ys + 24}`, dash)}
    ${ar(p, 'ink', `M${xc + 56},${ym} L${xs - 56},${ym}`, dash)}
    ${ar(p, 'ink', `M${xs + 57},${ys} L${xs + 104},${ys}`)}${T(xs + 112, ys + 7, 'phloem', 'fk04-h')}
    <path class="fk04-ln" d="M40,572 h46"/>${T(96, 578, day, 'fk04-l')}<path class="fk04-ln fk04-dash" d="M190,572 h46"/>${T(246, 578, '<tspan class="fk04-b">night</tspan>', 'fk04-l')}`;
}

function drawD(): string {
  const p = 'fk04d';
  return svg(p, 'Drawn scheme of a leaf cell. By day the Calvin-Benson cycle in the chloroplast makes triose phosphate. Part leaves the chloroplast through the triose phosphate/phosphate translocator (TPT) in exchange for phosphate and becomes sucrose in the cytosol, which goes to the phloem; part stays as starch. At night starch is broken down to maltose, which leaves through MEX1 and is made into sucrose.', `
    ${routes(p)}
    ${credit(780, 590, CR.sharkey)}
  `);
}

/* ---------- e · mesophyll vs guard-cell plastids, end of day and end of night ---------- */

function drawE(): string {
  const p = 'fk04e', x = 200, w = 390, a = shot(`${p}-m`, STREB, x, 72, w, { fig: true, win: STREB_W });
  const y2 = 72 + a.h + 16, b = shot(`${p}-g`, GC, x, y2, w, { fig: true, win: GC_W }), cx = (u: number): number => a.at(u, 0)[0];
  return svg(p, 'Electron micrographs of Arabidopsis plastids. Top, mesophyll chloroplasts: full of starch granules at the end of the day, without starch at the end of the night. Bottom, guard-cell plastids: they hold starch at both times.', `
    ${a.svg}${b.svg}
    ${pill(cx(97), 48, 'end of day', undefined, true)}${pill(cx(297), 48, 'end of night', undefined, true)}
    ${T(x - 14, 70 + a.h / 2 + 7, 'mesophyll', 'fk04-h', 'end')}${T(x - 14, y2 + b.h / 2 + 7, 'guard cell', 'fk04-h', 'end')}
    ${pill(x + w + 70, 72 + a.h / 2, 'no starch', a.at(...THYL_G), true)}
    ${pill(x + w + 70, y2 + b.h / 2, 'starch', [b.at(...STARCH_I)], true)}
    ${T(400, y2 + b.h + 40, `${it('Arabidopsis')} leaf plastids (TEM)`, 'fk04-l', 'middle')}
    ${credit(780, 590, CR.streb)}
  `);
}

/* ---------- f · the starch curve above the two routes as a strip ---------- */

function drawF(): string {
  const p = 'fk04f', g = graf(p, 120, 8, 520), y1 = 8 + g.h + 46, y2 = y1 + 72;
  const n = (x: number, y: number, s: string, w: number): string => node(x, y, s, { w });
  return svg(p, 'Top: Arabidopsis leaf starch rises by day and falls through the night to nearly zero at dawn, also after an early dusk. Bottom, by day: triose phosphate leaves the chloroplast through the phosphate translocator (TPT) and becomes sucrose for the phloem, while part becomes starch. At night: starch is broken down to maltose, which leaves through MEX1 and becomes sucrose.', `
    ${g.svg}
    ${T(26, y1 + 7, day, 'fk04-l')}${n(184, y1, 'triose-P', 110)}${ar(p, 'ink', `M241,${y1} L330,${y1}`)}${T(285, y1 - 12, 'TPT', 'fk04-s', 'middle')}
    ${n(386, y1, 'sucrose', 106)}${ar(p, 'ink', `M441,${y1} L520,${y1}`)}${n(570, y1, 'phloem', 94)}
    ${ar(p, 'ink', `M184,${y1 + 22} L184,${y1 + 44}`, 'fk04-thin')}${T(200, y1 + 44, 'starch', 'fk04-s')}
    ${T(26, y2 + 7, '<tspan class="fk04-b">night</tspan>', 'fk04-l')}${n(184, y2, 'starch', 96)}${ar(p, 'ink', `M234,${y2} L330,${y2}`, 'fk04-dash')}
    ${n(386, y2, 'maltose', 108)}${ar(p, 'ink', `M442,${y2} L520,${y2}`, 'fk04-dash')}${T(285, y2 - 12, 'amylases', 'fk04-s', 'middle')}${T(481, y2 - 12, 'MEX1', 'fk04-s', 'middle')}${n(570, y2, 'sucrose', 106)}
    ${credit(780, 590, `${CR.graf}; routes ${CR.sharkey}`.replace('; routes', ' | routes'))}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
