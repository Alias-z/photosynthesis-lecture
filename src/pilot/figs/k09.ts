// Slide C8 · Light-response curve (C9 in the 18-slide plan) (redo of 27 Oct 2026, block L2b). Real figures: Boardman 1977 Fig. 1 (Atriplex patula grown
// in high, intermediate and low light; data of Björkman et al. 1972; page render fetched by the coordinator, axes redrawn in
// µmol m⁻² s⁻¹: 1 nE cm⁻² s⁻¹ = 10 µmol m⁻² s⁻¹, 1 µmol dm⁻² min⁻¹ = 1.667 µmol m⁻² s⁻¹), Huang et al. 2014 Fig. 1C (sun and
// shade leaves of tobacco, 24 °C, 400 µmol mol⁻¹ CO₂; their Table 1: light saturation point 1164 vs 797, light compensation
// point 32 vs 20 µmol m⁻² s⁻¹, light-saturated A 23.8 vs 13.6 µmol m⁻² s⁻¹) and Hoshino et al. 2019 Fig. 1e, e′ (Arabidopsis
// leaf sections, low vs high light). Boardman (p. 362): initial slopes equal, compensation point lower in low-light plants.
// e is the one drawn variant (the terms on one curve). Sources and crops: assets/SOURCES-L2b.md.
import type { PlateText, Variant } from '../types';
import boardPng from '../../assets/photos/c8-boardman.png';
import huangJpg from '../../assets/photos/c8-huang-lrc.jpg';
import shadeJpg from '../../assets/photos/c8-shade-section.jpg';
import sunJpg from '../../assets/photos/c8-sun-section.jpg';
import './k09.css';

export const PLATE: PlateText = {
  n: 'C8',
  title: 'Light-response curve',
  status: 'draft',
  lead: 'As light increases, CO₂ uptake first rises, then levels off when the Calvin–Benson cycle limits it.',
  points: [
    { claim: 'Light-limited range.', text: 'In dim light, CO₂ uptake rises linearly with light<br>The slope is the quantum yield: CO₂ fixed per photon' },
    { claim: 'Light compensation point.', text: 'Photosynthesis equals respiration<br>Below it, the leaf releases CO₂' },
    { claim: 'Light saturation.', text: 'At high light, RuBisCO and RuBP regeneration limit uptake<br>Shade leaves saturate at lower light than sun leaves' },
  ],
  refs: [
    { label: 'Boardman 1977', url: 'https://doi.org/10.1146/annurev.pp.28.060177.002035' },
    { label: 'Huang et al. 2014', url: 'https://doi.org/10.3389/fpls.2014.00688' },
    { label: 'Hoshino et al. 2019', url: 'https://doi.org/10.1111/tpj.14467' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'High- vs low-light-grown leaves (Atriplex, Boardman 1977)' },
  { id: 'b', name: 'Sun vs shade leaves: saturation 1164 vs 797 µmol m⁻² s⁻¹' },
  { id: 'c', name: 'Light-response curves + sun and shade leaf sections' },
  { id: 'd', name: 'Light-limited range and light saturation (Atriplex)' },
  { id: 'e', name: 'Terms on one curve (drawn)' },
  { id: 'f', name: 'Sun vs shade leaves + leaf sections' },
];

/* ---------- shared parts (after l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk09-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Rotated axis title, centred on (x, y). */
const TV = (x: number, y: number, s: string, cls = 'fk09-at'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
const sb = (s: string): string => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;


/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following.
 *  A photo sits in a rounded frame with a dark credit band; a published figure ('fig') keeps its white ground multiplied into
 *  the page and is credited separately in grey. at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; top?: boolean } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  let band = '';
  if (o.credit) {
    const by = o.top ? y : y + h - 22;
    band = `<rect class="fk09-credbg" x="${f(x)}" y="${f(by)}" width="${f(w)}" height="22"/>${T(x + w - 8, by + 15.5, o.credit, 'fk09-cr', 'end')}`;
  }
  const clip = o.fig
    ? `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk09-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk09-ldh" d="${d}"/><path class="fk09-ldk" d="${d}"/><circle class="fk09-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos, tinted on white-ground figures; with `to`, a leader from its edge. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.2 + 22;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fk09-pillbg-t' : 'fk09-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk09-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fk09-crd', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fk09" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;


const BOARD: Img = { href: boardPng, w: 900, h: 745 };
const HUANG: Img = { href: huangJpg, w: 1156, h: 895 };
const SHADE: Img = { href: shadeJpg, w: 432, h: 222 };
const SUN: Img = { href: sunJpg, w: 434, h: 232 };
const CR = {
  board: 'Boardman 1977, Annu Rev Plant Physiol, Fig. 1 (data: Björkman et al. 1972); axes in SI units',
  huang: 'Huang et al. 2014, Front Plant Sci, Fig. 1C, CC BY 4.0',
  hosh: 'Hoshino et al. 2019, Plant J, Fig. 1e, e′, CC BY 4.0',
};
const A_ = `${it('A')}`;
const yTitle = `Net CO₂ uptake, ${A_} (µmol m⁻² s⁻¹)`;
const xTitle = 'Light, 400–700 nm (µmol photons m⁻² s⁻¹)';

/* ---------- Boardman 1977 Fig. 1 with axes in µmol m⁻² s⁻¹ ---------- */
// Asset (plot box, 0.624 × the 400-dpi render): Q (µmol m⁻² s⁻¹) → u = 3.43 + 0.35736 Q; A (µmol m⁻² s⁻¹) → v = 669.0 − 17.375 A.
// Left axis u 1.2, bottom axis v 742.7, zero line v 669.
const bU = (q: number): number => 3.43 + 0.35736 * q;
const bV = (a: number): number => 669.0 - 17.375 * a;

function boardPlot(p: string, x: number, y: number, w: number): { svg: string; h: number; at: (u: number, v: number) => Pt; yb: number } {
  const a = shot(`${p}-bo`, BOARD, x, y, w, { fig: true });
  const xl = a.at(1.2, 0)[0], yb = a.at(0, 742.7)[1];
  const tk: string[] = [];
  for (const q of [0, 500, 1000, 1500, 2000, 2500]) {
    const xx = a.at(bU(q), 0)[0];
    tk.push(`<path class="fk09-tk" d="M${f(xx)},${f(yb)} v7"/>${T(xx, yb + 26, `${q}`, 'fk09-ax', 'middle')}`);
  }
  // labels at the printed ticks (0, 5, 10, 15, 20 µmol dm⁻² min⁻¹), converted to µmol m⁻² s⁻¹
  for (const v of [0, 8.3, 16.7, 25, 33.3]) {
    const yy = a.at(0, bV(v))[1];
    tk.push(`<path class="fk09-tk" d="M${f(xl)},${f(yy)} h-7"/>${T(xl - 12, yy + 6, `${v}`, 'fk09-ax', 'end')}`);
  }
  const titles = `${TV(xl - 64, y + a.h / 2, yTitle)}${T(x + w / 2, yb + 54, xTitle, 'fk09-at', 'middle')}`;
  return { svg: `${a.svg}${tk.join('')}${titles}`, h: a.h, at: a.at, yb };
}

/* a · Boardman 1977 Fig. 1 large, with the terms */

function drawA(): string {
  const b = boardPlot('fk09a', 150, 16, 600);
  return realSvg('Boardman 1977, figure 1: net carbon dioxide uptake of Atriplex patula leaves against light, for plants grown in high, intermediate and low light. All three curves rise with the same initial slope and cross zero near the origin; the low-light-grown leaves saturate at about 6.5 micromoles per square metre per second already at about 300 micromoles of photons, the intermediate at about 24 and the high-light-grown leaves at about 34 only above 2000.', `
    ${b.svg}
    ${pill(360, 44, `${it('Atriplex patula')}, grown in:`, undefined, true)}
    ${pill(360, 452, 'initial slope = quantum yield', b.at(bU(110), bV(7)), true)}
    ${pill(600, 300, 'light-saturated rate', b.at(bU(2450), bV(34.2)), true)}
    ${credit(780, 592, CR.board)}
  `);
}

/* b · Huang et al. 2014 Fig. 1C with their Table 1 values */
// HUANG asset: PPFD → u = 265.5 + 0.416 PPFD; Aₙ → v = 588.5 − 22.34 Aₙ. Light saturation point (95 % of maximum): sun 1164,
// shade 797; compensation point: sun 32, shade 20; light-saturated Aₙ: sun 23.8, shade 13.6 µmol m⁻² s⁻¹.
const hU = (q: number): number => 265.5 + 0.416 * q;
const hV = (a: number): number => 588.5 - 22.34 * a;

function drawB(): string {
  const a = shot('fk09b-a', HUANG, 60, 6, 690, { fig: true });
  const gd = (q: number, an: number): string => {
    const [x0, y0] = a.at(hU(q), hV(an)), y1 = a.at(0, hV(-5))[1];
    return `<path class="fk09-gd" d="M${f(x0)},${f(y0 + 10)} V${f(y1)}"/>`;
  };
  return realSvg('Huang and colleagues 2014, figure 1C: net carbon dioxide assimilation of tobacco leaves against light, for leaves of plants grown in the sun, open circles, and in shade, filled circles, measured at 24 degrees and 400 micromoles per mole carbon dioxide. Both start below zero in the dark and rise steeply; shade leaves level off at about 13 micromoles per square metre per second, sun leaves at about 22. Their table: light saturation at 1164 micromoles of photons for sun leaves and 797 for shade leaves; light compensation points 32 and 20.', `
    ${a.svg}
    ${gd(1164, 22.6)}${gd(797, 12.0)}
    ${pill(590, 140, 'sun leaves: saturated at 1164', a.at(hU(1164), hV(22.6)), true)}
    ${pill(600, 282, 'shade leaves: saturated at 797', a.at(hU(797), hV(12.0)), true)}
    ${pill(560, 392, 'compensation point: 32 (sun), 20 (shade)', a.at(hU(26), hV(0)), true)}
    ${credit(780, 592, `${CR.huang}; values: their Table 1`)}
  `);
}

/* c · Boardman 1977 Fig. 1 beside leaf sections of shade and sun leaves (Hoshino et al. 2019) */

function drawC(): string {
  const b = boardPlot('fk09c', 86, 40, 400);
  const s1 = shot('fk09c-s', SHADE, 520, 70, 264, { fig: true });
  const s2 = shot('fk09c-u', SUN, 520, 300, 264, { fig: true });
  return realSvg('Left: Boardman 1977, figure 1, light-response curves of Atriplex patula grown in high, intermediate and low light: the same initial slope, but the low-light-grown leaves saturate early and low. Right: transverse sections of Arabidopsis leaves (Hoshino and colleagues 2019, figure 1e): a shade leaf grown in low light is thin, with short palisade cells; a sun leaf grown in high light is thicker, with taller palisade cells and more cell layers. One palisade cell is outlined in each.', `
    ${b.svg}${s1.svg}${s2.svg}
    ${pill(652, 44, 'shade leaf (low light)', undefined, true)}
    ${pill(652, 274, 'sun leaf (high light)', undefined, true)}
    ${pill(652, 300 + s2.h + 28, 'palisade cell (outlined)', s2.at(150, 70), true)}
    ${T(784, 300 + s2.h + 62, 'scale bars 100 µm', 'fk09-s', 'end')}
    ${credit(780, 576, CR.hosh)}${credit(780, 594, 'Boardman 1977, Fig. 1')}
  `);
}

/* d · Boardman 1977 Fig. 1 with the light-limited and light-saturated ranges marked */

function drawD(): string {
  const b = boardPlot('fk09d', 150, 16, 600);
  const [x0, yt] = b.at(bU(0), 16), x1 = b.at(bU(150), 0)[0], x2 = b.at(bU(1700), 0)[0], x3 = b.at(bU(2500), 0)[0];
  return realSvg('Boardman 1977, figure 1, net carbon dioxide uptake of Atriplex patula grown in high, intermediate and low light, with two ranges shaded. Up to about 150 micromoles of photons per square metre per second all three curves rise steeply and together: light limits, and the slope is the quantum yield. Above about 1700 all three have levelled off: light saturation, where the carbon reactions limit; the low-light-grown leaves level off far earlier and lower.', `
    ${b.svg}
    <rect class="fk09-zone" x="${f(x0 + 2)}" y="${f(yt)}" width="${f(x1 - x0 - 2)}" height="${f(b.yb - yt)}"/>
    <rect class="fk09-zone" x="${f(x2)}" y="${f(yt)}" width="${f(x3 - x2)}" height="${f(b.yb - yt)}"/>
    ${pill(300, 480, 'light-limited range', [x1 - 8, 470], true)}
    ${pill((x2 + x3) / 2, 470, 'light saturation', undefined, true)}
    ${credit(780, 592, CR.board)}
  `);
}

/* ---------- e · drawn: the terms on one light-response curve ---------- */
// Non-rectangular hyperbola: φ 0.06, A_sat 25, R_d 1.5 µmol m⁻² s⁻¹, θ 0.8 (shape only; the terms, not values, are the point).

function drawE(): string {
  const X = (q: number): number => 110 + q * 0.42, Y = (a: number): number => 450 - a * 14;
  const phi = 0.05, am = 25, th = 0.8, rd = 4;
  const A = (q: number): number => (phi * q + am - Math.sqrt((phi * q + am) ** 2 - 4 * th * phi * q * am)) / (2 * th) - rd;
  const pts = Array.from({ length: 81 }, (_, i) => { const q = i * 20; return `${i ? 'L' : 'M'}${f(X(q))},${f(Y(A(q)))}`; }).join(' ');
  let lcp = 0; while (A(lcp) < 0) lcp += 0.5;
  return `<svg class="fig-svg fk09" viewBox="0 0 800 600" role="img" aria-label="Drawn light-response curve: net carbon dioxide uptake A against light. At zero light A is negative, the dark respiration; A rises linearly at first, with a slope equal to the quantum yield, crosses zero at the light compensation point and bends over to the light-saturated rate in bright light. Below saturation light limits; at saturation the carbon reactions limit.">
    <path class="fk09-ax-l" d="M${X(0)},${Y(26)} V${Y(-5)} H${X(1600)}"/>
    <path class="fk09-zero" d="M${X(0)},${Y(0)} H${X(1600)}"/>
    <path class="fk09-sl" d="M${X(0)},${Y(-rd)} L${X(330)},${Y(-rd + phi * 330)}"/>
    <path class="fk09-cv" d="${pts}"/>
    <path class="fk09-gd" d="M${X(0)},${Y(am - rd - 0.9)} H${X(1600)}"/>
    <circle class="fk09-dot" cx="${f(X(lcp))}" cy="${Y(0)}" r="5"/><circle class="fk09-dot" cx="${X(0)}" cy="${Y(-rd)}" r="5"/>
    ${T(X(0) - 14, Y(26) + 8, A_, 'fk09-h', 'end')}${T(X(1600), Y(-5) + 34, 'light', 'fk09-h', 'end')}
    ${T(X(0) - 14, Y(0) + 6, '0', 'fk09-ax', 'end')}
    ${pill(420, Y(12), 'slope = quantum yield', [X(240), Y(-rd + phi * 240)], true)}
    ${pill(370, Y(0) - 34, 'light compensation point', [X(lcp), Y(0)], true)}
    ${pill(290, Y(-rd), 'dark respiration', [X(0), Y(-rd)], true)}
    ${pill(560, Y(am - rd) - 40, 'light-saturated rate', [X(1150), Y(am - rd - 0.9)], true)}
    ${T(X(280), Y(-5) + 34, 'light limits', 'fk09-s', 'middle')}${T(X(1100), Y(-5) + 34, 'carbon reactions limit', 'fk09-s', 'middle')}
  </svg>`;
}

/* f · Huang et al. 2014 Fig. 1C beside the leaf sections */

function drawF(): string {
  const a = shot('fk09f-a', HUANG, 8, 70, 520, { fig: true });
  const s1 = shot('fk09f-s', SHADE, 546, 96, 238, { fig: true });
  const s2 = shot('fk09f-u', SUN, 546, 326, 238, { fig: true });
  return realSvg('Left: Huang and colleagues 2014, figure 1C: net carbon dioxide assimilation against light for sun leaves, open circles, and shade leaves, filled circles, of tobacco; shade leaves saturate earlier and lower. Right: transverse sections of Arabidopsis leaves (Hoshino and colleagues 2019): a thin shade leaf grown in low light and a thicker sun leaf grown in high light with taller palisade cells.', `
    ${a.svg}${s1.svg}${s2.svg}
    ${pill(330, 60, 'sun leaves', a.at(hU(1600), hV(21.8)), true)}
    ${pill(330, 290, 'shade leaves', a.at(hU(1600), hV(13.0)), true)}
    ${pill(665, 70, 'shade leaf (low light)', undefined, true)}
    ${pill(665, 300, 'sun leaf (high light)', undefined, true)}
    ${credit(780, 576, CR.hosh)}${credit(780, 594, CR.huang)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
