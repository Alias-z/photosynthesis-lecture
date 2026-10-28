// Slide C5a · Evolution of Rubisco (the Rubisco story, 28 Oct 2026; draft for the lecturer). Rubisco evolved ≈ 3 billion
// years ago in air with much CO₂ and almost no O₂; O₂ rose (Great Oxidation Event) and CO₂ fell; crop Rubisco is optimal
// for ≈ 210 ppm; industry has pushed the air to 427 ppm, far faster than Rubisco evolves.
// Facts (read depth in the rb report): Bouvier, Emms & Kelly 2024 PNAS (full text): ≈ 3 billion years, CO₂ ≥ 100 × and
// O₂ ≤ 0.1 % of today; RbcL 1 amino-acid change per 7.2 million years; flowering-plant ancestor (160 million years ago)
// S꜀/ₒ 81.1, k꜀ₐₜ 2.6 s⁻¹ vs today 87.1, 3.4 s⁻¹. Poulton et al. 2021 Nature (abstract): O₂ first rise ≈ 2.43, permanent
// ≈ 2.22 billion years ago. Zhu, Portis & Long 2004 PCE (abstract): optimum 210 ppm. Bereiter et al. 2015 (NOAA NCEI
// data): ice-core CO₂ 174–299 ppm over 800,000 years. IPCC AR6 WG1 Ch. 2: 278 ppm in 1750, 188–194 ppm at the last glacial
// maximum. NOAA GML: Mauna Loa 1959–2025, 427 ppm in 2025. Real figure: the NOAA/Scripps Mauna Loa graph (US Government
// work; assets/SOURCES-cr.md).
import type { PlateText, Variant } from '../types';
import noaaPng from '../../assets/anim/cr14/noaa-scripps-keeling.png';
import { CO2_ANNUAL, CO2_FROM } from '../anim/cr14-data';
import { axes, catmull, co2g, credit, f, o2g, pill, shot, svg, T, X, Y, type Axes, type Img, type Pt } from './cb-common';
import { CR_RUBISCO, gammaStar, ICE, panel, path, PPM, rubisco, sym } from './rb-kit';

export const PLATE: PlateText = {
  n: 'C5a',
  title: 'Evolution of Rubisco',
  status: 'draft',
  lead: 'Rubisco evolved ≈ 3 billion years ago, in air with much CO₂ and almost no O₂.',
  points: [
    { claim: 'Great Oxidation Event.', text: 'O₂ rose; CO₂ fell over the following billions of years', eq: 'first rise of O₂: ≈ 2.4 billion years ago<br>O₂ permanent: ≈ 2.2 billion years ago' },
    { claim: 'CO₂ optimum of crop Rubisco.', text: 'Close to the mean CO₂ of the last 400,000 years', eq: 'optimum ≈ 210 ppm · ice ages 174–299 ppm' },
    { claim: 'Industrial CO₂ rise.', text: 'Far faster than Rubisco evolves', eq: '1750: 278 ppm → 2025: 427 ppm<br>Rubisco: 1 amino-acid change per 7.2 million years' },
  ],
  refs: [
    { label: 'Bouvier et al. 2024', url: 'https://doi.org/10.1073/pnas.2321050121' },
    { label: 'Poulton et al. 2021', url: 'https://doi.org/10.1038/s41586-021-03393-7' },
    { label: 'Zhu, Portis & Long 2004', url: 'https://doi.org/10.1046/j.1365-3040.2004.01142.x' },
    { label: 'Bereiter et al. 2015', url: 'https://doi.org/10.1002/2014GL061957' },
    { label: 'IPCC AR6', url: 'https://doi.org/10.1017/9781009157896.004' },
    { label: 'NOAA GML', url: 'https://gml.noaa.gov/ccgg/trends/' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: '3.5 billion years: O₂ up, CO₂ down, Rubisco at the start (drawn timeline)' },
  { id: 'v2', name: '800,000 years of CO₂ from ice cores, the Rubisco optimum and today' },
  { id: 'v3', name: 'Since 1750: 278 → 427 ppm (ice core + Mauna Loa)' },
  { id: 'v4', name: 'Earth history as 1 day: Rubisco at 08:00, industry in the last 0.005 s' },
  { id: 'v5', name: 'Rubisco evolves slowly: flowering-plant ancestor vs today (Bouvier 2024)' },
  { id: 'v6', name: 'NOAA/Scripps Mauna Loa graph (real figure) with the Rubisco optimum' },
  { id: 'v7', name: 'Oxygenations per 100 carboxylations: ice age, 1750, 2025 (calculated)' },
];

const NOAA: Img = { href: noaaPng, w: 800, h: 600 };
const CR_ICE = 'ice cores: Bereiter et al. 2015 (NOAA NCEI) · 1750: IPCC AR6 · Mauna Loa: NOAA GML';

/* ---------- v1 · 3.5 billion years on one line ---------- */

function v1(): string {
  const p = 'frb5av1', x0 = 70, x1 = 740, gx = (ga: number): number => x0 + ((3.5 - ga) / 3.5) * (x1 - x0);
  const oy0 = 150, oy1 = 260, cy0 = 318, cy1 = 428;
  // O₂: ≤ 0.1 % of today before the GOE, a rise across it, then schematic to 21 % today; CO₂: ≥ 100 × today at 3 billion
  // years ago, schematic down to 427 ppm. Only the marked points are data.
  const o2 = `M${f(gx(3.5))},${oy1 - 6} L${f(gx(2.43))},${oy1 - 6} C${f(gx(2.3))},${oy1 - 30} ${f(gx(2.2))},${oy1 - 52} ${f(gx(2.0))},${oy1 - 54}`;
  const o2s = `M${f(gx(2.0))},${oy1 - 54} C${f(gx(1.2))},${oy1 - 56} ${f(gx(0.7))},${oy1 - 70} ${f(gx(0.45))},${oy0 + 14} L${f(gx(0))},${oy0 + 10}`;
  const co2 = `M${f(gx(3.5))},${cy0 + 22} L${f(gx(3.0))},${cy0 + 24} C${f(gx(2.2))},${cy0 + 40} ${f(gx(1.0))},${cy0 + 58} ${f(gx(0.3))},${cy1 - 44} L${f(gx(0))},${cy1 - 38}`;
  const ticks = [3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0].map(g => `${path(`M${f(gx(g))},${cy1 + 18} v8`, 'frb-tick')}${T(gx(g), cy1 + 50, String(g), 'fcb-tk', 'middle')}`).join('');
  return svg(p, 'Timeline of 3.5 billion years. Top strip, O2 in the air: below 0.1 percent of today before the Great Oxidation Event, a first rise about 2.4 billion years ago and permanent O2 from about 2.2 billion years ago, up to 21 percent today. Bottom strip, CO2: at least 100 times today when Rubisco evolved about 3 billion years ago, falling to 427 ppm today. The curves between the marked points are schematic.', `
    ${panel(x0 - 14, oy0 - 34, x1 - x0 + 28, oy1 - oy0 + 44)}${panel(x0 - 14, cy0 - 34, x1 - x0 + 28, cy1 - cy0 + 44)}
    <rect class="frb-goe" x="${f(gx(2.43))}" y="${oy0 - 34}" width="${f(gx(2.22) - gx(2.43))}" height="${cy1 - oy0 + 44}"/>
    ${o2g(x0 + 18, oy0 - 8, 10)}${T(x0 + 44, oy0 - 1, 'O₂ in the air', 'fcb-node')}
    ${co2g(x0 + 22, cy0 - 8, 10)}${T(x0 + 50, cy0 - 1, 'CO₂ in the air', 'fcb-node')}
    ${path(o2, 'frb-o2')}${path(o2s, 'frb-o2 fcb-dash')}${path(co2, 'frb-co2 fcb-dash')}
    <circle class="frb-dot-o2" cx="${f(gx(3.0))}" cy="${oy1 - 6}" r="6"/>${T(gx(3.0) + 10, oy1 - 48, '≤ 0.1 %', 'fcb-s')}${T(gx(3.0) + 10, oy1 - 24, 'of today', 'fcb-s')}
    <circle class="frb-dot-o2" cx="${f(gx(0))}" cy="${oy0 + 10}" r="6"/>${T(gx(0) - 12, oy0 + 40, '21 %', 'fcb-node', 'end')}
    <circle class="frb-dot" cx="${f(gx(3.0))}" cy="${cy0 + 24}" r="6"/>${T(gx(3.0) + 10, cy0 + 58, '≥ 100 ×', 'fcb-s')}${T(gx(3.0) + 10, cy0 + 82, 'today', 'fcb-s')}
    <circle class="frb-dot" cx="${f(gx(0))}" cy="${cy1 - 38}" r="6"/>${T(gx(0) - 4, cy1 - 4, '427 ppm', 'fcb-node', 'end')}
    ${T((gx(2.43) + gx(2.22)) / 2, oy0 - 44, 'Great Oxidation Event', 'fcb-node fcb-c-amber', 'middle')}
    ${T(gx(2.43) - 6, oy1 + 30, '2.4', 'fcb-s', 'end')}${T(gx(2.22) + 6, oy1 + 30, '2.2', 'fcb-s')}
    ${rubisco(gx(3.0), 530, 92)}${path(`M${f(gx(3.0))},${oy0 + 10} V${cy0 - 30} M${f(gx(3.0))},${cy0 + 8} V${cy1 + 14}`, 'fcb-mark')}
    ${T(gx(3.0) + 60, 524, 'Rubisco evolves:', 'fcb-node')}${T(gx(3.0) + 60, 550, '≈ 3 billion years ago', 'fcb-s')}
    ${path(`M${x0},${cy1 + 18} H${x1}`, 'frb-tick')}${ticks}
    ${T(x1, cy1 + 76, 'billion years ago', 'fcb-ax', 'end')}
    ${credit(790, 594, 'points: Bouvier et al. 2024 PNAS; Poulton et al. 2021 Nature; NOAA GML 2025 · lines between them schematic')}
  `);
}

/* ---------- v2 · 800,000 years of CO₂ ---------- */

function v2(): string {
  const p = 'frb5av2';
  const a: Axes = { x0: 110, y0: 70, w: 560, h: 380, xr: [800000, 0], yr: [150, 450] };
  const ice = catmull(ICE.map(([age, ppm]) => [X(a, age), Y(a, ppm)] as Pt));
  const xr = X(a, 0) + 46;
  return svg(p, 'CO2 in the air over the last 800,000 years from Antarctic ice cores: it swings between 174 and 299 ppm with the ice ages, about 190 ppm at the last glacial maximum. A green band marks 210 ppm, the CO2 at which crop Rubisco is optimal. At the right edge, the industrial rise from 278 ppm in 1750 to 427 ppm in 2025.', `
    <rect class="frb-opt" x="${a.x0}" y="${f(Y(a, 220))}" width="${f(xr - a.x0 + 10)}" height="${f(Y(a, 200) - Y(a, 220))}"/>
    ${path(`M${a.x0},${f(Y(a, PPM.optimum))} H${f(xr + 10)}`, 'frb-optl')}
    ${axes(a, [800000, 600000, 400000, 200000, 0], [150, 200, 250, 300, 350, 400, 450], 'thousand years ago', 'CO₂ in the air (ppm)', { xfmt: v => String(v / 1000) })}
    <path class="frb-ice" d="${ice}"/>
    ${path(`M${f(X(a, 0))},${f(Y(a, PPM.y1750))} H${f(xr)} V${f(Y(a, PPM.y2025))}`, 'frb-ml')}
    <circle class="frb-dot-ml" cx="${f(xr)}" cy="${f(Y(a, PPM.y2025))}" r="7"/>${T(xr - 12, Y(a, PPM.y2025) - 4, '2025: 427 ppm', 'fcb-node', 'end')}
    ${T(xr - 12, Y(a, PPM.y1750) - 40, '1750: 278 ppm', 'fcb-s', 'end')}
    ${T(a.x0 + 10, Y(a, 165), 'crop Rubisco optimal at ≈ 210 ppm', 'fcb-node fcb-c-green frb-halo')}
    ${T(a.x0 + 10, Y(a, 330), 'ice ages: 174–299 ppm', 'fcb-s')}
    ${credit(790, 594, `${CR_ICE} · optimum: Zhu et al. 2004`)}
  `);
}

/* ---------- v3 · since 1750 ---------- */

function v3(): string {
  const p = 'frb5av3';
  const a: Axes = { x0: 110, y0: 60, w: 600, h: 400, xr: [1750, 2030], yr: [150, 450] };
  const ml = CO2_ANNUAL.map((v, i) => [X(a, CO2_FROM + i + 0.5), Y(a, v)] as Pt);
  const d = `M${ml.map(([x, y]) => `${f(x)},${f(y)}`).join(' L')}`;
  return svg(p, 'CO2 in the air from 1750 to 2025: 278 ppm in 1750 and 285.5 ppm in 1850 from ice cores, then the yearly Mauna Loa means from 316 ppm in 1959 to 427 ppm in 2025, 149 ppm more than in 1750. A green band at 210 ppm marks the CO2 at which crop Rubisco is optimal. Rubisco changes by 1 amino acid per 7.2 million years.', `
    <rect class="frb-opt" x="${a.x0}" y="${f(Y(a, 220))}" width="${a.w}" height="${f(Y(a, 200) - Y(a, 220))}"/>
    ${path(`M${a.x0},${f(Y(a, PPM.optimum))} H${a.x0 + a.w}`, 'frb-optl')}
    ${axes(a, [1750, 1800, 1850, 1900, 1950, 2000], [150, 200, 250, 300, 350, 400, 450], 'year', 'CO₂ in the air (ppm)')}
    ${path(`M${f(X(a, 1850))},${f(Y(a, 285.5))} L${f(ml[0][0])},${f(ml[0][1])}`, 'frb-gap')}
    ${path(`M${f(X(a, 1750))},${f(Y(a, 278.3))} L${f(X(a, 1850))},${f(Y(a, 285.5))}`, 'frb-gap')}
    <path class="frb-ml" d="${d}"/>
    <circle class="frb-dot" cx="${f(X(a, 1750))}" cy="${f(Y(a, 278.3))}" r="7"/><circle class="frb-dot" cx="${f(X(a, 1850))}" cy="${f(Y(a, 285.5))}" r="6"/>
    <circle class="frb-dot-ml" cx="${f(ml[ml.length - 1][0])}" cy="${f(ml[ml.length - 1][1])}" r="7"/>
    ${T(X(a, 1750) + 10, Y(a, 278.3) - 18, '1750: 278 ppm', 'fcb-node')}
    ${T(ml[ml.length - 1][0] + 12, ml[ml.length - 1][1] + 8, '2025:', 'fcb-node')}${T(ml[ml.length - 1][0] + 12, ml[ml.length - 1][1] + 34, '427 ppm', 'fcb-node')}
    ${T(X(a, 1959) + 14, Y(a, 316) + 36, 'Mauna Loa, from 1959', 'fcb-s')}
    ${T(a.x0 + 10, Y(a, PPM.optimum) + 34, 'crop Rubisco optimal at ≈ 210 ppm', 'fcb-node fcb-c-green')}
    ${panel(140, 74, 500, 76, 'frb-panel-w')}
    ${T(156, 104, '+149 ppm in 275 years', 'fcb-node')}${T(156, 132, 'Rubisco: 1 amino-acid change per 7.2 million years', 'fcb-s')}
    ${credit(790, 594, 'ice cores: IPCC AR6 (1750, 1850) · Mauna Loa yearly means: NOAA GML & Scripps · Bouvier et al. 2024')}
  `);
}

/* ---------- v4 · Earth history as 1 day ---------- */

function v4(): string {
  const p = 'frb5av4', c: Pt = [250, 312], R = 196;
  // 24 h = 4.5 billion years; 0 h (top) = Earth's formation, clockwise.
  const ang = (h: number): number => (h / 24) * 2 * Math.PI - Math.PI / 2;
  const at = (h: number, r: number): Pt => [c[0] + r * Math.cos(ang(h)), c[1] + r * Math.sin(ang(h))];
  const hourOf = (ga: number): number => ((4.5 - ga) / 4.5) * 24;
  const ticks = Array.from({ length: 24 }, (_, h) => { const [a1, b1] = at(h, R - (h % 6 ? 10 : 18)), [a2, b2] = at(h, R); return path(`M${f(a1)},${f(b1)} L${f(a2)},${f(b2)}`, 'frb-tick'); }).join('');
  const nums = [0, 6, 12, 18].map(h => { const [x, y] = at(h, R - 40); return T(x, y + 8, `${String(h).padStart(2, '0')}:00`, 'fcb-s', 'middle'); }).join('');
  const arc = (h0: number, h1: number, r: number): string => { const [xa, ya] = at(h0, r), [xb, yb] = at(h1, r); return `M${f(xa)},${f(ya)} A${r},${r} 0 0 1 ${f(xb)},${f(yb)}`; };
  const hand = (h: number, r: number): string => { const [x, y] = at(h, r); return path(`M${f(c[0])},${f(c[1])} L${f(x)},${f(y)}`, 'frb-hand'); };
  const rub = at(hourOf(3.0), R + 2);
  const row = (y: number, t: string, what: string, sub = ''): string => `${T(486, y, t, 'fcb-big')}${T(486, y + 28, what, 'fcb-node')}${sub ? T(486, y + 54, sub, 'fcb-s') : ''}`;
  return svg(p, 'Earth history drawn as one day of 24 hours, 4.5 billion years. Rubisco evolves at 08:00. The Great Oxidation Event runs from 11:02 to 12:10. The last 800,000 years of ice ages are the last 15 seconds before midnight, and the industrial CO2 rise since 1750 is the last 0.005 seconds.', `
    <circle class="frb-clock" cx="${c[0]}" cy="${c[1]}" r="${R}"/>${ticks}${nums}
    <path class="frb-arc-goe" d="${arc(hourOf(2.43), hourOf(2.22), R - 26)}"/>
    ${hand(hourOf(3.0), R - 30)}<circle cx="${c[0]}" cy="${c[1]}" r="6" class="frb-dot-ml"/>
    ${rubisco(rub[0] - 52, rub[1] - 28, 74)}
    ${T(c[0], 62, '4.5 billion years = 24 hours', 'fcb-h', 'middle')}${T(c[0], 90, '00:00 Earth forms · 24:00 now', 'fcb-s', 'middle')}
    ${row(132, '08:00', 'Rubisco evolves', '≈ 3 billion years ago')}
    ${row(236, '11:02–12:10', 'Great Oxidation Event', '≈ 2.4–2.2 billion years ago')}
    ${row(340, 'last 15 s', 'the ice ages of the last', '800,000 years')}
    ${row(444, 'last 0.005 s', 'the CO₂ rise since 1750', '278 → 427 ppm')}
    ${credit(790, 594, 'Rubisco: Bouvier et al. 2024 · GOE: Poulton et al. 2021 · scale: 4.5 billion years = 86,400 s')}
  `);
}

/* ---------- v5 · Rubisco evolves slowly (Bouvier 2024, Table 1) ---------- */

function v5(): string {
  const p = 'frb5av5', bx = 330, bw = 300;
  const bar = (y: number, label: string, v0: number, v1: number, max: number, unit: string): string => {
    const w0 = (v0 / max) * bw, w1 = (v1 / max) * bw;
    return `${T(bx, y - 16, label, 'fcb-node')}
      <rect class="frb-bar-soft" x="${bx}" y="${y}" width="${f(w0)}" height="26" rx="5"/>${T(bx + w0 + 10, y + 21, `${v0} ${unit}`, 'fcb-s')}
      <rect class="frb-bar-plant" x="${bx}" y="${y + 34}" width="${f(w1)}" height="26" rx="5"/>${T(bx + w1 + 10, y + 55, `${v1} ${unit}`, 'fcb-node')}`;
  };
  return svg(p, 'Rubisco of the last common ancestor of flowering plants, about 160 million years ago, against today: CO2/O2 specificity 81.1 then and 87.1 now; carboxylation turnover 2.6 then and 3.4 per second now. The large subunit changed by 1 amino acid per 7.2 million years.', `
    ${rubisco(160, 250, 250)}${T(160, 410, 'Rubisco (spinach)', 'fcb-s', 'middle')}
    ${T(bx, 70, 'flowering plants:', 'fcb-h')}
    <rect class="frb-bar-soft" x="${bx}" y="92" width="22" height="16" rx="4"/>${T(bx + 30, 106, 'ancestor, ≈ 160 million years ago', 'fcb-s')}
    <rect class="frb-bar-plant" x="${bx}" y="118" width="22" height="16" rx="4"/>${T(bx + 30, 132, 'today (C₃ species)', 'fcb-s')}
    ${bar(196, `CO₂/O₂ specificity, ${sym('S', 'c/o')}`, 81.1, 87.1, 100, '')}
    ${bar(316, `carboxylation rate, ${sym('k', 'cat')} (per site)`, 2.6, 3.4, 4, 's⁻¹')}
    ${panel(bx - 14, 418, 474, 108, 'frb-panel-w')}
    ${T(bx + 6, 452, '1 amino-acid change per 7.2 million years', 'fcb-node')}
    ${T(bx + 6, 480, 'specificity: +0.05 % per million years', 'fcb-s')}
    ${T(bx + 6, 506, 'among the 1 % slowest-evolving genes', 'fcb-s')}
    ${credit(790, 594, `data: Bouvier et al. 2024, PNAS, Table 1 (CC BY) · ${CR_RUBISCO}`)}
  `);
}

/* ---------- v6 · the NOAA/Scripps graph ---------- */

function v6(): string {
  const p = 'frb5av6', a = shot(`${p}-a`, NOAA, 40, 30, 640, { fig: true });
  // the graph's own axes, measured on the image (SOURCES-cr.md): 1955–2030 at x 100–760, 320 → 420 ppm at y 486 → 136
  const at = (yr: number, ppm: number): Pt => a.at(100 + (yr - 1955) * 8.8, 486 - (ppm - 320) * 3.5);
  return svg(p, 'The NOAA and Scripps graph of monthly CO2 at Mauna Loa, 1958 to 2025, rising from about 316 to 427 ppm. Labels: 1959, 316 ppm; 2025, 427 ppm. A note: crop Rubisco is optimal at about 210 ppm, far below the bottom of this graph, and the air held 278 ppm in 1750.', `
    ${a.svg}
    ${pill(440, 200, '2025: 427 ppm', at(2025.5, 427), true)}
    ${pill(240, 300, '1959: 316 ppm', at(1959.5, 316), true)}
    ${panel(70, 520 - 22, 660, 80, 'frb-panel-w')}
    ${T(86, 528, 'crop Rubisco optimal at ≈ 210 ppm: far below this graph', 'fcb-node fcb-c-green')}
    ${T(86, 556, '1750: 278 ppm (ice cores)', 'fcb-s')}
    ${credit(790, 594, 'graph: NOAA Global Monitoring Laboratory & Scripps (US Government work) · optimum: Zhu, Portis & Long 2004')}
  `);
}

/* ---------- v7 · what this means at Rubisco (calculated) ---------- */

function v7(): string {
  const p = 'frb5av7', g = gammaStar(25);
  const rows: Array<[string, number]> = [['last ice age', PPM.lgm], ['1750', PPM.y1750], ['2025', PPM.y2025]];
  const bx = 300, bw = 400, max = 100;
  const bars = rows.map(([lab, ppm], i) => {
    const cc = 0.48 * ppm, ox = (100 * 2 * g) / cc, y = 150 + i * 110, w = (ox / max) * bw;
    return `${T(bx - 20, y + 12, lab, 'fcb-node', 'end')}${T(bx - 20, y + 40, `${ppm} ppm in the air`, 'fcb-s', 'end')}
      <rect class="frb-bar-ox" x="${bx}" y="${y - 6}" width="${f(w)}" height="40" rx="6"/>${T(bx + w + 12, y + 22, String(Math.round(ox)), 'fcb-big')}`;
  }).join('');
  return svg(p, 'Calculated at 25 degrees: oxygenations per 100 carboxylations. Last ice age, 190 ppm in the air: 94. In 1750, 278 ppm: 64. In 2025, 427 ppm: 42. FvCB model: 100 times 2 Gamma-star over chloroplast CO2, with Gamma-star 43 ppm at 25 degrees and chloroplast CO2 0.48 times the air.', `
    ${T(400, 66, 'oxygenations per 100 carboxylations, 25 °C', 'fcb-h', 'middle')}
    ${path(`M${bx},120 V${150 + 2 * 110 + 50}`, 'fcb-axis')}${bars}
    ${panel(60, 500, 680, 66, 'frb-panel-w')}
    ${T(76, 528, `calculated: 100 × 2Γ* / ${sym('C', 'c')}, chloroplast CO₂ · Γ* = 43 ppm at 25 °C`, 'fcb-s')}
    ${T(76, 554, `${sym('C', 'c')} = 0.48 × air CO₂, as on slide C10 (200 of 420 ppm)`, 'fcb-s')}
    ${credit(790, 594, 'FvCB: Farquhar, von Caemmerer & Berry 1980 · Γ*: Bernacchi et al. 2001 · CO₂: IPCC AR6, NOAA GML')}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7 };
export function draw(id: string): string {
  return (DRAW[id] ?? v1)();
}
