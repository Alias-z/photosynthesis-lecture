// 'ovb' · How plants cope with scarce CO₂ (slide C10o; captions OV, anim/beats-ov.ts; brief OV_BRIEF.md), layout b: a
// climate axis. A broad band runs across the stage from "cool, moist" (pale blue-green) through "hot, sunny" (warm) to
// "hot, dry" (sandy); each photosynthesis type is a card pinned to the band where it lives (C₃, C₄ above it; C₂, CAM
// below it). One fixed framing; one thing moves at a time; a hold after each step.
// - The problem (beat 1): a small panel at the top right, kept all slide long: slide 19's 3D stoma (the lecturer's own
//   render, its pore narrowing frame by frame as there), RuBisCO (PDB 8RUC) and its CO₂ gauge. The stoma closes, the
//   gauge falls, O₂ crowds round RuBisCO.
// - The recurring element: RuBisCO with a CO₂ gauge beside it, a glass tube holding slide 19's CO₂ characters (co2-kit
//   kidG). Its level is qualitative: C₃ with the stomata shut low (2), C₂ raised (4), C₄ high (7), CAM by day high (7).
// - Each card: the type's name, a photo of a representative plant, a lens on a leaf opening its leaf section, RuBisCO and
//   its gauge, and the brief's 2 short lines. Photos (Wikimedia Commons): ripe wheat, Hans Hillewaert (CC BY-SA 3.0);
//   wild rocket (Diplotaxis tenuifolia, a C₃–C₄ intermediate) on dry sand, Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0);
//   a maize field, High Contrast (CC BY 3.0 DE); Agave americana, Fawaz.tairou (CC BY 4.0). Leaf sections: Steinchisma
//   laxum (C₃) and Homolepis aturensis (C₂), Khoshravesh et al. 2016 (CC BY 3.0); maize Kranz and a succulent leaf,
//   Berkshire Community College Bioscience Image Library (CC0). Photos are cropped, never stretched.
// - Beat 6: rust arrows C₃ → C₂ → C₄ and C₃ → CAM (over the top), "evolved from C₃, many times"; then the question.
// The page figure (figs/cov-b.ts) draws the same cards, band and arrows still, without the problem panel.
import wheatJpg from '../../assets/photos/ov-c3-wheat.jpg';
import rocketJpg from '../../assets/photos/ov-c2-rocket.jpg';
import maizeJpg from '../../assets/photos/ov-c4-maize.jpg';
import agaveJpg from '../../assets/photos/ov-cam-agave.jpg';
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import camJpg from '../../assets/photos/c13-cam-succulent.jpg';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import st0 from '../../assets/photos/c10-stoma-3d-0.webp';
import st1 from '../../assets/photos/c10-stoma-3d-1.webp';
import st2 from '../../assets/photos/c10-stoma-3d-2.webp';
import st3 from '../../assets/photos/c10-stoma-3d-3.webp';
import st4 from '../../assets/photos/c10-stoma-3d-4.webp';
import { OV } from './beats-ov';
import { actor, clamp, ease, f, from, kid, kidG, lerp, makeScene, o2G, sunG, T, tangents, type Api, type V } from './co2-kit';
import type { Staging } from './types';

const P = 'ovb';
const RUB_AR = 471 / 548;

/* ================================================================ the 4 types */

export interface Img { href: string; w: number; h: number }
export interface Kind {
  id: string; name: string;
  /** The plant photo and its window: centre (image px) and width; the height follows the photo box. */
  photo: Img; win: [number, number, number];
  /** Where the small lens sits on the photo (image px). */
  spot: V;
  /** The leaf section, its centre and the width (image px) shown across the lens. */
  sec: Img; secC: V; secD: number;
  lines: string[];
  /** CO₂ characters in the gauge (qualitative level). */
  level: number;
  byDay?: boolean;
}
export const KINDS: Kind[] = [
  { id: 'c3', name: 'C₃', photo: { href: wheatJpg, w: 1000, h: 707 }, win: [500, 354, 960], spot: [610, 300],
    sec: { href: steJpg, w: 1000, h: 740 }, secC: [470, 400], secD: 640, lines: ['≈ 90 % of species', 'cool to warm, moist places'], level: 2 },
  { id: 'c2', name: 'C₂', photo: { href: rocketJpg, w: 1000, h: 666 }, win: [560, 333, 900], spot: [560, 470],
    sec: { href: homJpg, w: 1000, h: 740 }, secC: [500, 400], secD: 640, lines: ['rare', 'warm, sunny, dry places'], level: 4 },
  { id: 'c4', name: 'C₄', photo: { href: maizeJpg, w: 1000, h: 558 }, win: [500, 279, 760], spot: [470, 250],
    sec: { href: zeaJpg, w: 1000, h: 740 }, secC: [476, 385], secD: 640, lines: ['≈ 3 % of species,', '≈ a quarter of land photosynthesis', 'hot, sunny grasslands'], level: 7 },
  { id: 'cam', name: 'CAM', photo: { href: agaveJpg, w: 1000, h: 666 }, win: [520, 340, 880], spot: [600, 300],
    sec: { href: camJpg, w: 1000, h: 740 }, secC: [480, 380], secD: 660, lines: ['≈ 6 % of species', 'deserts, epiphytes'], level: 7, byDay: true },
];

/* ================================================================ the card (shared with the page figure) */

/** Card geometry (local units): name (x, y, size), photo box, big lens (cx, cy, r), small lens radius, RuBisCO (cx, cy,
 *  width), gauge tube (x, y, w, h), CO₂ radius and row pitch, text lines (x, first baseline, step, size), "by day"
 *  (x, y, size), padding under the last line. */
export interface Spec {
  w: number; name: [number, number, number]; photo: [number, number, number, number]; lens: [number, number, number]; spot: number;
  rub: [number, number, number]; tube: [number, number, number, number]; kr: number; pitch: number;
  line: [number, number, number, number]; by: [number, number, number]; pad: number; ring: number;
}
export const STAGE_SPEC: Spec = {
  w: 330, name: [16, 42, 36], photo: [14, 54, 146, 104], lens: [158, 158, 40], spot: 8,
  rub: [229, 112, 62], tube: [268, 20, 48, 136], kr: 7, pitch: 18,
  line: [16, 224, 22, 17], by: [292, 180, 17], pad: 14, ring: 2.6,
};
export const cardH = (k: Kind, s: Spec): number => s.line[1] + (k.lines.length - 1) * s.line[2] + s.pad;

/** The rows of the gauge: the centre of the i-th CO₂ from the bottom. */
export const rowAt = (tube: [number, number, number, number], pitch: number, i: number): V => [tube[0] + tube[2] / 2, tube[1] + tube[3] - 5 - pitch / 2 - i * pitch];
/** The liquid under n CO₂ (n may be fractional): its top y and height. */
export const liquid = (tube: [number, number, number, number], pitch: number, n: number): [number, number] => {
  const h = n > 0.01 ? n * pitch + 3 : 0;
  return [tube[1] + tube[3] - 4 - h, h];
};
/** The gauge tube: its glass (under the CO₂), the liquid (keyed `${p}-liq`) and the outline (drawn over the CO₂). */
export function tubeParts(p: string, tb: [number, number, number, number], pitch: number, n: number): { under: string; over: string } {
  const [x, y, w, h] = tb, [ly, lh] = liquid(tb, pitch, n);
  return {
    under: `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="${f(w / 2 - 6)}" style="fill:#f7fafb"/>
      <rect data-k="${p}-liq" x="${f(x + 4)}" y="${f(ly)}" width="${w - 8}" height="${f(lh)}" rx="9" style="fill:#d3e5ef"/>`,
    over: `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="${f(w / 2 - 6)}" style="fill:none;stroke:#7d7a70;stroke-width:1.8"/>
      <path d="M${f(x + 7)},${f(y + 14)}V${f(y + h - 14)}" style="fill:none;stroke:#ffffff;stroke-width:2.6;stroke-linecap:round;opacity:.85"/>`,
  };
}
/** A CO₂ character drawn still (neutral face, no name). */
export function kidStill(k: string, at: V, r: number): string {
  let s = kidG(k, r, '').replace(' data-actor="1" display="none"', ` transform="translate(${f(at[0])} ${f(at[1])})"`);
  for (const q of ['fs', 'fh', 'sw', 'sh']) s = s.replace(`<g data-k="${k}-${q}">`, `<g data-k="${k}-${q}" display="none">`);
  return s;
}

/** The photo, cropped to its box (uniform scale: never stretched); at() maps image px to local units. */
function photo(id: string, k: Kind, s: Spec): { svg: string; at: (q: V) => V } {
  const [x, y, w, h] = s.photo, [cu, cv, uw] = k.win, vh = (uw * h) / w;
  const u0 = Math.max(0, Math.min(k.photo.w - uw, cu - uw / 2)), v0 = Math.max(0, Math.min(k.photo.h - vh, cv - vh / 2)), sc = w / uw;
  return {
    svg: `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8"/></clipPath>
      <g clip-path="url(#${id})"><image href="${k.photo.href}" x="${f(x - u0 * sc)}" y="${f(y - v0 * sc)}" width="${f(k.photo.w * sc)}" height="${f(k.photo.h * sc)}" preserveAspectRatio="none"/></g>
      <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8" style="fill:none;stroke:#cfcabb;stroke-width:1.2"/>`,
    at: q => [x + (q[0] - u0) * sc, y + (q[1] - v0) * sc],
  };
}
/** The lens on a leaf of the photo and the round view of the leaf section it opens. */
function lens(id: string, k: Kind, s: Spec, spot: V): string {
  const [cx, cy, r] = s.lens, sc = (2 * r) / k.secD;
  return `<path d="${tangents(spot, s.spot, [cx, cy], r)}" style="fill:none;stroke:#2b2a27;stroke-width:3;opacity:.45"/>
    <path d="${tangents(spot, s.spot, [cx, cy], r)}" style="fill:none;stroke:#fffdf8;stroke-width:1.4"/>
    <circle cx="${f(spot[0])}" cy="${f(spot[1])}" r="${s.spot}" style="fill:none;stroke:#2b2a27;stroke-width:3.6;opacity:.5"/>
    <circle cx="${f(spot[0])}" cy="${f(spot[1])}" r="${s.spot}" style="fill:none;stroke:#fffdf8;stroke-width:2"/>
    <clipPath id="${id}"><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}"/></clipPath>
    <circle class="co2k-inbg" cx="${f(cx)}" cy="${f(cy)}" r="${r}"/>
    <g clip-path="url(#${id})"><image href="${k.sec.href}" x="${f(cx - k.secC[0] * sc)}" y="${f(cy - k.secC[1] * sc)}" width="${f(k.sec.w * sc)}" height="${f(k.sec.h * sc)}" preserveAspectRatio="none"/></g>
    <circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" style="fill:none;stroke:#3d3d3a;stroke-width:${s.ring}"/>`;
}

export interface CardParts {
  /** The card, its name, photo, lens, RuBisCO and the gauge's glass and liquid (local units). */
  body: string;
  /** The gauge's outline, over the CO₂. */
  over: string;
  lines: string; by: string;
  /** Where the gauge's CO₂ sit, from the bottom. */
  rows: V[];
}
/** One card at its local origin; stem: the pin's x (local) and the stem's end y (local: below 0 for a card under the
 *  band, beyond its height for a card above it). */
export function cardParts(p: string, k: Kind, s: Spec, pinX: number, stemY: number, n: number): CardParts {
  const h = cardH(k, s), ph = photo(`${p}-pc`, k, s), [rx, ry, rw] = s.rub, tb = tubeParts(p, s.tube, s.pitch, n);
  const stem0 = stemY < 0 ? 0 : h;
  const body = `<path d="M${f(pinX)},${f(stem0)}V${f(stemY)}" style="fill:none;stroke:#8a877d;stroke-width:2"/>
    <circle cx="${f(pinX)}" cy="${f(stemY)}" r="5.5" style="fill:#3d3d3a;stroke:#fffdf8;stroke-width:2"/>
    <rect class="co2k-card" x="0" y="0" width="${s.w}" height="${f(h)}" rx="14"/>
    ${T(s.name[0], s.name[1], k.name, 'co2k-zl', 'start', ` style="font-size:${s.name[2]}px"`)}
    ${ph.svg}${lens(`${p}-lc`, k, s, ph.at(k.spot))}
    <image href="${rubPng}" x="${f(rx - rw / 2)}" y="${f(ry - (rw * RUB_AR) / 2)}" width="${rw}" height="${f(rw * RUB_AR)}"/>
    ${tb.under}`;
  const lines = k.lines.map((l, i) => T(s.line[0], s.line[1] + i * s.line[2], l, 'co2k-note', 'start', ` style="font-size:${s.line[3]}px"`)).join('');
  const by = k.byDay ? T(s.by[0], s.by[1], 'by day', 'co2k-ilb', 'middle', ` style="font-size:${s.by[2]}px"`) : '';
  return { body, over: tb.over, lines, by, rows: Array.from({ length: 7 }, (_, i) => rowAt(s.tube, s.pitch, i)) };
}

/* ================================================================ the stage */

/** The band: x, y, width, height; the pins along it (stage x). */
const BX = 30, BY = 352, BW = 1540, BH = 40;
const PIN: Record<string, number> = { c3: 180, c2: 470, c4: 800, cam: 1400 };
/** Where each card's top-left corner sits; cards above the band end 20 above it, cards below start 18 under it. */
const CARD_X: Record<string, number> = { c3: 15, c2: 225, c4: 635, cam: 1225 };
const ABOVE: Record<string, boolean> = { c3: true, c2: false, c4: true, cam: false };
const cardY = (k: Kind): number => (ABOVE[k.id] ? BY - 20 - cardH(k, STAGE_SPEC) : BY + BH + 18);

export const bandDefs = (id: string): string => `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
  <stop offset="0" stop-color="#c9e4da"/><stop offset=".2" stop-color="#dcebd8"/><stop offset=".5" stop-color="#f6d27f"/>
  <stop offset=".78" stop-color="#efcf95"/><stop offset="1" stop-color="#e6c99a"/></linearGradient>`;

/* The problem panel (top right): the 3D stoma of slide 19, RuBisCO and its gauge. */
const PP = { x: 1222, y: 24, w: 338, h: 222 };
const PP_TUBE: [number, number, number, number] = [1496, 66, 48, 136];
const PP_RUB: V = [1440, 140];
const ST3D = [st0, st1, st2, st3, st4];
/** O₂ crowding in round RuBisCO: from (start) to (end). */
const O2: Array<[V, V]> = [[[1404, 44], [1410, 92]], [[1472, 40], [1468, 88]], [[1408, 236], [1414, 194]], [[1470, 236], [1466, 196]]];

/** The evolution arrows (stage units): C₃ → C₂, C₂ → C₄, C₃ → CAM over the top; each a chain of cubic segments. */
export const ARROWS_STAGE: string[] = [
  'M350,292C404,300 426,336 428,406',
  'M532,408C548,352 584,296 632,276',
  'M224,72C250,22 520,22 800,24C1036,26 1090,60 1102,190C1112,300 1150,384 1244,408',
];
/** The arrowhead at a path's end, along its last control leg. */
export function headAt(d: string, size = 15): string {
  const n = d.match(/-?\d+(\.\d+)?/g)!.map(Number), L = n.length;
  const [x, y, cx, cy] = [n[L - 2], n[L - 1], n[L - 4], n[L - 3]], a = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
  return `<path d="M${f(size * 0.35)},0L${f(-size * 0.75)},${f(-size * 0.5)}L${f(-size * 0.75)},${f(size * 0.5)}Z" transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})" style="fill:#a9532f"/>`;
}
const RUST = 'fill:none;stroke:#a9532f;stroke-width:3.4;stroke-linecap:round';
const HALO = 'fill:none;stroke:#fbfaf6;stroke-width:9;stroke-linecap:round';

function svg(): string {
  const s = STAGE_SPEC;
  const band = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="${BH / 2}" fill="url(#${P}-band)" style="stroke:#d3c9ad;stroke-width:1.2"/>
    ${T(BX + 18, BY + 27, 'cool, moist', 'co2k-zl', 'start')}${T(800, BY + 27, 'hot, sunny', 'co2k-zl')}${T(BX + BW - 18, BY + 27, 'hot, dry', 'co2k-zl', 'end')}`;
  const pp = tubeParts(`${P}-pp`, PP_TUBE, s.pitch, 5);
  const panel = `<rect class="co2k-card" x="${PP.x}" y="${PP.y}" width="${PP.w}" height="${PP.h}" rx="14"/>
    <g transform="translate(${PP.x + 38} ${PP.y + 38})">${sunG(11)}</g>
    <image href="${rubPng}" x="${f(PP_RUB[0] - 41)}" y="${f(PP_RUB[1] - 41 * RUB_AR)}" width="82" height="${f(82 * RUB_AR)}"/>${pp.under}`;
  const stoma = ST3D.map((src, i) => actor(`${P}-st${i}`, `<image href="${src}" x="${PP.x + 14}" y="${PP.y + 66}" width="146" height="146"/>`)).join('');
  const cards = KINDS.map(k => {
    const p = `${P}-${k.id}`, x = CARD_X[k.id], y = cardY(k), h = cardH(k, s);
    const c = cardParts(p, k, s, PIN[k.id] - x, ABOVE[k.id] ? h + 20 : -18, 0);
    return `<g transform="translate(${x} ${y})">${actor(p, c.body)}${c.rows.map((_, i) => kidG(`${p}-k${i}`, s.kr, '')).join('')}
      ${actor(`${p}-tb`, c.over)}${actor(`${p}-ln`, c.lines)}${c.by ? actor(`${p}-by`, c.by) : ''}</g>`;
  }).join('');
  const arrows = ARROWS_STAGE.map((d, i) => actor(`${P}-a${i}`, `<path data-k="${P}-a${i}-h" d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" style="${HALO}"/>
    <path data-k="${P}-a${i}-s" d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" style="${RUST}"/>`) + actor(`${P}-a${i}-hd`, headAt(d))).join('');
  const cr = (k: string, x: number, y: number, t: string, a: 'start' | 'end'): string => actor(`${P}-cr${k}`, T(x, y, t, 'co2k-cr', a));
  const it = (t: string): string => `<tspan font-style="italic">${t}</tspan>`;
  return `<defs>${bandDefs(`${P}-band`)}</defs>
    ${actor(`${P}-band`, band)}
    ${actor(`${P}-pp`, panel)}${stoma}
    ${[0, 1, 2, 3, 4].map(i => kidG(`${P}-pp-k${i}`, s.kr, '')).join('')}${actor(`${P}-pp-tb`, pp.over)}
    ${O2.map((_, i) => actor(`${P}-o${i}`, o2G(8))).join('')}
    ${cards}${arrows}
    ${actor(`${P}-evo`, `${T(490, 178, 'evolved from C₃,', 'co2k-q')}${T(490, 202, 'many times', 'co2k-q')}`)}
    ${cr('0', 1586, 732, '3D stoma: own data · RuBisCO: PDB 8RUC', 'end')}
    ${cr('1', 14, 700, 'C₃: wheat, Hans Hillewaert (CC BY-SA 3.0); leaf section, Khoshravesh et al. 2016 (CC BY 3.0)', 'start')}
    ${cr('5', 14, 732, 'Plant photos: Wikimedia Commons', 'start')}
    ${cr('2', 14, 716, `C₂: wild rocket, Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0); leaf section, Khoshravesh et al. 2016 (CC BY 3.0)`, 'start')}
    ${cr('3', 1586, 700, 'C₄: maize, High Contrast (CC BY 3.0 DE); leaf section, Berkshire Community College Bioscience Image Library (CC0)', 'end')}
    ${cr('4', 1586, 716, `CAM: ${it('Agave americana')}, Fawaz.tairou (CC BY 4.0); leaf section, the same library (CC0)`, 'end')}`;
}

/** Shows a gauge's CO₂: o[i] is the i-th one's opacity, dy[i] its rise (leaving through the top). */
function gauge(a: Api, p: string, tb: [number, number, number, number], o: number[], dy: number[] = []): void {
  const s = STAGE_SPEC;
  o.forEach((v, i) => kid(a, `${p}-k${i}`, [rowAt(tb, s.pitch, i)[0], rowAt(tb, s.pitch, i)[1] - (dy[i] ?? 0)], v, {}));
  const n = o.reduce((m, v, i) => m + v * (1 - clamp((dy[i] ?? 0) / 30)), 0);
  const [ly, lh] = liquid(tb, s.pitch, n);
  a.attr(`${p}-liq`, 'y', f(ly)); a.attr(`${p}-liq`, 'height', f(lh));
}

function frame(a: Api, beat: number, t: number): void {
  const s = STAGE_SPEC;
  /* beat 1: the problem panel; the stoma closes; the gauge falls; O₂ crowds in */
  const on = from(beat, t, 0, 0.1, 0.7);
  a.op(`${P}-pp`, on); a.op(`${P}-pp-tb`, on); a.op(`${P}-cr0`, on);
  const close = beat > 0 ? 1 : ease(t, 1.0, 2.6), kk = close * (ST3D.length - 1), lo = Math.min(ST3D.length - 2, Math.floor(kk));
  ST3D.forEach((_, i) => a.op(`${P}-st${i}`, on * (i === lo ? 1 : i === lo + 1 ? kk - lo : 0)));
  // the top 3 CO₂ leave one after another, rising out of the tube as they fade
  const out = [0, 0, 2, 1, 0].map((j, i) => (i < 2 ? 0 : beat > 0 ? 1 : ease(t, 3.0 + j * 0.5, 3.8 + j * 0.5)));
  gauge(a, `${P}-pp`, PP_TUBE, out.map((u, i) => (i < 2 ? on : on * (1 - u))), out.map(u => 26 * u));
  O2.forEach(([p0, p1], i) => {
    const t0 = 4.8 + i * 0.35, u = beat > 0 ? 1 : ease(t, t0, t0 + 0.9);
    a.put(`${P}-o${i}`, [lerp(p0[0], p1[0], u), lerp(p0[1], p1[1], u)], beat > 0 ? 1 : ease(t, t0 - 0.1, t0 + 0.35));
  });

  /* beat 2: the band, then C₃; beats 3–5: C₂, C₄, CAM, each: the card, its gauge fills, its lines */
  a.op(`${P}-band`, from(beat, t, 1, 0.1, 0.8));
  KINDS.forEach((k, j) => {
    const b = j + 1, t0 = j === 0 ? 1.1 : 0.2, p = `${P}-${k.id}`;
    const cOn = from(beat, t, b, t0, t0 + 0.6);
    a.op(p, cOn); a.op(`${p}-tb`, cOn); a.op(`${P}-cr${b}`, cOn);
    if (j === 0) a.op(`${P}-cr5`, cOn);
    const tg = t0 + 0.9;
    gauge(a, p, s.tube, Array.from({ length: 7 }, (_, i) => (i < k.level ? from(beat, t, b, tg + i * 0.2, tg + i * 0.2 + 0.35) : 0)));
    const tl = tg + k.level * 0.2 + 0.35;
    if (k.byDay) a.op(`${p}-by`, from(beat, t, b, tl, tl + 0.4));
    a.op(`${p}-ln`, from(beat, t, b, tl + (k.byDay ? 0.6 : 0.1), tl + (k.byDay ? 1.1 : 0.6)));
  });

  /* beat 6: C₃ → C₂ → C₄, hold, C₃ → CAM, the words */
  const draw = (i: number, t0: number, t1: number): void => {
    const u = beat === 5 ? ease(t, t0, t1) : 0;
    a.op(`${P}-a${i}`, u > 0 ? 1 : 0);
    a.attr(`${P}-a${i}-h`, 'stroke-dashoffset', (1 - u).toFixed(4)); a.attr(`${P}-a${i}-s`, 'stroke-dashoffset', (1 - u).toFixed(4));
    a.op(`${P}-a${i}-hd`, clamp((u - 0.9) / 0.1));
  };
  draw(0, 0.3, 1.3); draw(1, 1.5, 2.5); draw(2, 2.9, 4.7);
  a.op(`${P}-evo`, beat === 5 ? ease(t, 4.9, 5.4) : 0);
}

export const STAGING: Staging = {
  ...makeScene({
    id: 'ovb', name: 'ovb · a climate axis, from cool and moist to hot and dry', beats: OV,
    note: 'A climate band (cool, moist → hot, sunny → hot, dry); the problem panel top right (slide 19\'s 3D stoma closes, the CO₂ gauge at RuBisCO falls, O₂ crowds in); C₃, C₂, C₄, CAM pinned where they live, each a card with a plant photo, a lens onto its leaf section, RuBisCO (8RUC) and its CO₂ gauge; arrows from C₃',
    holds: [[0.9, 2.9], [1.0], [], [], [], [2.7]],
    svg, frame,
  }),
  keys: [
    { beat: 5, text: 'How does a C₂ plant', x: 800, y: 494, size: 44 },
    { beat: 5, text: 'trap its CO₂?', x: 800, y: 542, size: 44 },
  ],
};
