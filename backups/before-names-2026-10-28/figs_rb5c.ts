// Slide C5c · Engineering RuBisCO (the RuBisCO story, 28 Oct 2026; draft for the lecturer). Red-algal RuBisCOs are
// 2–3 × more specific than crop RuBisCO but slower, and no red-algal (form ID) RuBisCO has yet been assembled in a plant
// or in E. coli; faster cyanobacterial RuBisCOs work in tobacco only in high CO₂; the gains so far come from plant RuBisCO
// improved in E. coli. Facts and read depth (rb report):
// - Flamholz et al. 2019 (full text): medians S꜀/ₒ form II 7–15, cyanobacteria 48, C₄ 80, C₃ 98, red algae 177; Oh, Askey
//   & Gunn 2023 JXB Table 1 (full text, CC BY): Galdieria partita 238, k꜀ₐₜ 1.6 s⁻¹; tobacco 82, 3.1 s⁻¹;
// - Tcherkez, Farquhar & Andrews 2006 Table 1 (full text; S꜀/ₒ and k꜀ₐₜ columns), and G. partita vs spinach specificity
//   crossing at 57 °C (text);
// - Whitney et al. 2001 (abstract): red-algal and diatom RuBisCO made in tobacco (> 30 % of soluble protein), not assembled;
// - Lin et al. 2014 (full text) and Occhialini et al. 2016 Table 1 (full text): Synechococcus PCC 7942 RuBisCO in tobacco,
//   k꜀ₐₜ 14.4 vs 3.9 s⁻¹, S꜀/ₒ 43 vs 91, K꜀ 172 vs 9 µM; plants grown at 9000 ppm, cannot live in air;
// - Long et al. 2018, Chen et al. 2023 (full text, CC BY): carboxysomes in tobacco, growth only at 1–2 % CO₂;
// - Aigner et al. 2017 (abstract): Arabidopsis RuBisCO assembled in E. coli with 5 chaperone systems;
// - Lin, Salihovic, Clark & Hanson 2022 Sci Adv (full text): ancestral Solanaceae RuBisCO k꜀ₐₜ 4.4 vs 3.5 s⁻¹;
// - Zhou et al. 2023 Nat Plants (abstract): red-algal loop 6 grafted into Rhodobacter RuBisCO, k꜀ₐₜ +60 %;
// - McDonald et al. 2026 Sci Adv (full text, CC BY): tobacco RbcL T391I, carboxylation rate +29 %;
// - Zhu, Portis & Long 2004 (abstract): a today-tuned plant RuBisCO +3 %, a foreign RuBisCO above the trade-off > 25 %.
// Real image: D. S. Goodsell, PDB-101 Molecule of the Month 11 (CC BY 4.0): spinach RuBisCO (left) and the 2-chain
// RuBisCO of a photosynthetic bacterium (right, PDB 9RUB).
import type { PlateText, Variant } from '../types';
import goodJpg from '../../assets/photos/c2-goodsell.jpg';
import { axes, credit, f, pill, shot, svg, T, X, Y, type Axes, type Img, type Pt } from './cb-common';
import { panel, path, SCO, sym } from './rb-kit';

export const PLATE: PlateText = {
  n: 'C5c',
  title: 'Engineering RuBisCO',
  status: 'draft',
  lead: 'Red algae have RuBisCOs with higher CO₂/O₂ specificity, but none works in a crop yet.',
  points: [
    { claim: 'Red-algal RuBisCO.', text: 'Higher specificity, lower turnover', eq: '<i>Galdieria partita</i> 238 · tobacco 82' },
    { claim: 'Assembly.', text: 'In tobacco, red-algal RuBisCO is made but not assembled' },
    { claim: 'Directed evolution.', text: 'RuBisCO variants selected in <i>E. coli</i>', eq: '1 mutation: +29 % carboxylation rate (tobacco)' },
  ],
  refs: [
    { label: 'Flamholz et al. 2019', url: 'https://doi.org/10.1021/acs.biochem.9b00237' },
    { label: 'Whitney et al. 2001', url: 'https://doi.org/10.1046/j.1365-313x.2001.01056.x' },
    { label: 'Lin et al. 2014', url: 'https://doi.org/10.1038/nature13776' },
    { label: 'Occhialini et al. 2016', url: 'https://doi.org/10.1111/tpj.13098' },
    { label: 'Aigner et al. 2017', url: 'https://doi.org/10.1126/science.aap9221' },
    { label: 'Lin et al. 2022', url: 'https://doi.org/10.1126/sciadv.abm6871' },
    { label: 'McDonald et al. 2026', url: 'https://doi.org/10.1126/sciadv.aeh3246' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'CO₂/O₂ specificity across RuBisCOs: red algae highest (Flamholz 2019)' },
  { id: 'v2', name: 'Specificity against speed: 15 RuBisCOs (Tcherkez 2006 Table 1)' },
  { id: 'v3', name: 'Attempts 2001–2026: what failed, what worked (timeline)' },
  { id: 'v4', name: 'Plant vs bacterial RuBisCO (Goodsell, real image): 16 chains must assemble' },
  { id: 'v5', name: 'Cyanobacterial RuBisCO in tobacco: 3.7 × faster, needs 0.9 % CO₂' },
  { id: 'v6', name: 'What a better RuBisCO could give a crop canopy (Zhu 2004)' },
  { id: 'v7', name: '“Super” red-algal RuBisCO loses its edge when hot (Tcherkez 2006)' },
];

const GOOD: Img = { href: goodJpg, w: 1400, h: 776 };
const CR_GOOD = 'D. S. Goodsell, PDB-101 Molecule of the Month 11 · CC BY 4.0';

/* ---------- v1 · specificity across RuBisCOs ---------- */

function v1(): string {
  const p = 'frb5cv1', bx = 300, bw = 400, max = 250;
  const rows: Array<[string, string, number, number, string]> = [
    ['bacteria (form II)', '7–15', 7, 15, 'frb-bar-ii'],
    ['cyanobacteria', '48', 0, 48, 'frb-bar-cy'],
    ['C₄ plants', '80', 0, 80, 'frb-bar-c4'],
    ['C₃ plants (crops)', '98', 0, 98, 'frb-bar-plant'],
    ['red algae', '177', 0, 177, 'frb-bar-red'],
    ['<tspan class="fcb-it">Galdieria partita</tspan>', '238', 0, 238, 'frb-bar-red'],
  ];
  const bars = rows.map(([lab, txt, lo, hi, cls], i) => {
    const y = 110 + i * 66, x0 = bx + (lo / max) * bw, w = ((hi - lo) / max) * bw;
    return `${T(bx - 16, y + 24, lab, 'fcb-node', 'end')}<rect class="${cls}" x="${f(x0)}" y="${y}" width="${f(Math.max(w, 4))}" height="34" rx="5"/>${T(bx + (hi / max) * bw + 12, y + 26, txt, 'fcb-big')}`;
  }).join('');
  return svg(p, 'CO2/O2 specificity of RuBisCO, median per group: bacterial form II 7 to 15, cyanobacteria 48, C4 plants 80, C3 plants 98, red algae 177; the highest, the red alga Galdieria partita, 238.', `
    ${T(400, 62, `CO₂/O₂ specificity, ${sym('S', 'c/o')} (median per group)`, 'fcb-h', 'middle')}
    ${path(`M${bx},96 V${110 + 6 * 66}`, 'fcb-axis')}${bars}
    ${T(bx, 532, 'higher: RuBisCO picks CO₂ over O₂ more often', 'fcb-s')}
    ${credit(790, 594, 'Flamholz et al. 2019, Biochemistry 58:3365 (≈ 300 RuBisCOs) · G. partita: Uemura et al. 1997, via Oh et al. 2023')}
  `);
}

/* ---------- v2 · specificity against speed ---------- */

/** Tcherkez et al. 2006 Table 1 (25 °C): k꜀ₐₜ (s⁻¹) and S꜀/ₒ for the RuBisCOs with both; G. partita from Oh et al. 2023. */
const TCH: Array<[string, number, number, string]> = [
  ['R. rubrum', 7.3, 12.3, 'ii'], ['C. vinosum', 6.7, 41, 'ii'], ['Synechococcus 7002', 13.4, 52, 'cy'], ['Synechococcus 6301', 11.6, 43, 'cy'],
  ['Chlamydomonas', 5.8, 61, 'gr'], ['Amaranthus', 3.8, 82, 'c4'], ['sorghum', 5.4, 70, 'c4'], ['maize', 4.4, 79, 'c4'],
  ['wheat', 2.5, 90, 'c3'], ['spinach', 3.7, 82, 'c3'], ['tobacco', 3.4, 82, 'c3'], ['Phaeodactylum', 3.4, 113, 'rd'],
  ['Griffithsia', 2.6, 167, 'rd'], ['Galdieria sulphuraria', 1.2, 166, 'rd'], ['Galdieria partita', 1.6, 238, 'rd'],
];
const KIND: Record<string, string> = { ii: '#9b988e', cy: '#4a8fb8', gr: '#6f9b3a', c4: '#7fae5a', c3: '#2a963a', rd: '#b8301b' };

function v2(): string {
  const p = 'frb5cv2';
  const a: Axes = { x0: 120, y0: 50, w: 560, h: 400, xr: [0, 14], yr: [0, 250] };
  const dots = TCH.map(([, k, s, g]) => `<circle cx="${f(X(a, k))}" cy="${f(Y(a, s))}" r="8" style="fill:${KIND[g]};stroke:#fffdf8;stroke-width:1.6"/>`).join('');
  const lab = (name: string, dx: number, dy: number, a2: 'start' | 'end' = 'start'): string => {
    const r = TCH.find(t => t[0] === name)!;
    return T(X(a, r[1]) + dx, Y(a, r[2]) + dy, name, 'fcb-s fcb-it', a2);
  };
  const key = ([['bacteria, form II', 'ii'], ['cyanobacteria', 'cy'], ['C₄ plants', 'c4'], ['C₃ plants', 'c3'], ['red algae, diatom', 'rd']] as Array<[string, string]>)
    .map(([s, g], i) => `<circle cx="${560}" cy="${f(64 + i * 28)}" r="7" style="fill:${KIND[g]}"/>${T(574, 71 + i * 28, s, 'fcb-s')}`).join('');
  return svg(p, 'CO2/O2 specificity against carboxylation rate per site for 15 RuBisCOs at 25 degrees. Red-algal RuBisCOs reach 166 to 238 but turn over only 1.2 to 2.6 times per second; cyanobacterial RuBisCOs turn over 11.6 to 13.4 times per second with a specificity of 43 to 52; crop RuBisCOs sit between, about 82 to 90 and 2.5 to 3.7.', `
    ${axes(a, [0, 2, 4, 6, 8, 10, 12, 14], [0, 50, 100, 150, 200, 250], `carboxylation rate, ${sym('k', 'cat')} (s⁻¹ per site)`, `specificity, ${sym('S', 'c/o')}`)}
    ${dots}${key}
    ${lab('Galdieria partita', 14, 6)}${lab('Griffithsia', 14, -6)}${lab('Synechococcus 7002', -12, -14, 'end')}${lab('R. rubrum', 14, -6)}
    ${T(X(a, 3.6), Y(a, 140), 'more specific, slower', 'fcb-node fcb-c-red')}${T(X(a, 8.2), Y(a, 92), 'faster, less specific', 'fcb-node', 'start')}
    ${credit(790, 594, 'Tcherkez, Farquhar & Andrews 2006, PNAS 103:7246, Table 1 · G. partita: Oh, Askey & Gunn 2023, Table 1')}
  `);
}

/* ---------- v3 · attempts 2001–2026 ---------- */

function v3(): string {
  const p = 'frb5cv3';
  const rows: Array<[string, 'ok' | 'no' | 'tool', string, string, string]> = [
    ['2001', 'no', 'red-algal RuBisCO into tobacco', 'made, but not assembled', 'Whitney et al.'],
    ['2014', 'no', 'cyanobacterial RuBisCO into tobacco', '3.7 × faster; grows only at 0.9 % CO₂', 'Lin et al.'],
    ['2017', 'tool', 'plant RuBisCO made in <tspan class="fcb-it">E. coli</tspan>', 'needs 5 chaperone systems', 'Aigner et al.'],
    ['2018', 'no', 'cyanobacterial carboxysomes into tobacco', 'grows only at 1–2 % CO₂', 'Long et al.; Chen et al. 2023'],
    ['2022', 'ok', 'ancestral Solanaceae RuBisCO', `${sym('k', 'cat')} 4.4 vs 3.5 s⁻¹`, 'Lin et al.'],
    ['2023', 'ok', 'red-algal loop grafted into a bacterial RuBisCO', `${sym('k', 'cat')} +60 %`, 'Zhou et al.'],
    ['2026', 'ok', 'tobacco RuBisCO with 1 mutation', 'carboxylation rate +29 %', 'McDonald et al.'],
  ];
  const mark = { ok: ['frb-chip-ok', 'worked'], no: ['frb-chip-no', 'failed'], tool: ['frb-chip-tool', 'tool'] } as const;
  const body = rows.map(([yr, k, what, res, who], i) => {
    const y = 58 + i * 74;
    return `${T(30, y + 26, yr, 'fcb-big')}<rect class="${mark[k][0]}" x="112" y="${y + 4}" width="96" height="32" rx="16"/>${T(160, y + 27, mark[k][1], 'fcb-node', 'middle')}
      ${T(226, y + 26, what, 'fcb-node')}${T(226, y + 52, `${res} · <tspan class="fcb-c-grey">${who}</tspan>`, 'fcb-s')}`;
  }).join('');
  return svg(p, 'Attempts to put a better RuBisCO into plants, 2001 to 2026. Failed: red-algal RuBisCO in tobacco was made but not assembled (2001); cyanobacterial RuBisCO worked in tobacco, 3.7 times faster, but the plants grew only at 0.9 percent CO2 (2014); cyanobacterial carboxysomes in tobacco, growth only at 1 to 2 percent CO2 (2018, 2023). Tool: plant RuBisCO assembled in E. coli with 5 chaperone systems (2017). Worked: ancestral Solanaceae RuBisCO, 4.4 instead of 3.5 per second (2022); a red-algal loop grafted into a bacterial RuBisCO, plus 60 percent (2023); tobacco RuBisCO with 1 mutation, carboxylation rate plus 29 percent (2026).', `
    ${body}
    ${credit(790, 594, 'all 2022–2026 gains measured on the enzyme, made in E. coli · no red-algal RuBisCO has yet been assembled in a plant')}
  `);
}

/* ---------- v4 · plant vs bacterial RuBisCO (Goodsell) ---------- */

function v4(): string {
  const p = 'frb5cv4', g = shot(`${p}-g`, GOOD, 30, 70, 740, { fig: true });
  return svg(p, 'David Goodsell’s drawings of RuBisCO: left, spinach RuBisCO with 8 large and 8 small subunits; right, the RuBisCO of a photosynthetic bacterium with only 2 chains. Plant RuBisCO needs 5 chaperone systems to assemble its 16 chains; a foreign RuBisCO needs its own.', `
    ${g.svg}
    ${pill(230, 40, 'spinach: 8 large + 8 small = 16 chains', undefined, true)}
    ${pill(640, 40, 'bacterium: 2 chains', undefined, true)}
    ${T(30, 520, 'plant RuBisCO assembles only with 5 chaperone systems', 'fcb-node')}
    ${T(30, 548, '(Cpn60/20, Raf1, Raf2, RbcX, BSD2); red-algal RuBisCO: none known that work', 'fcb-s')}
    ${credit(790, 594, `${CR_GOOD} · right: PDB 9RUB · chaperones: Aigner et al. 2017, Science`)}
  `);
}

/* ---------- v5 · cyanobacterial RuBisCO in tobacco ---------- */

function v5(): string {
  const p = 'frb5cv5', bx = 320, bw = 380;
  const pair = (y: number, label: string, unit: string, a: number, b: number, max: number): string =>
    `${T(bx - 16, y + 30, label, 'fcb-node', 'end')}${T(bx - 16, y + 54, unit, 'fcb-s', 'end')}
     <rect class="frb-bar-plant" x="${bx}" y="${y}" width="${f((a / max) * bw)}" height="28" rx="5"/>${T(bx + (a / max) * bw + 10, y + 22, String(a), 'fcb-node')}
     <rect class="frb-bar-cy" x="${bx}" y="${y + 34}" width="${f((b / max) * bw)}" height="28" rx="5"/>${T(bx + (b / max) * bw + 10, y + 56, String(b), 'fcb-node')}`;
  return svg(p, 'Tobacco with its own RuBisCO against tobacco with the RuBisCO of the cyanobacterium Synechococcus elongatus PCC 7942, at 25 degrees: carboxylation rate 3.9 against 14.4 per second per site; CO2/O2 specificity 91 against 43; Michaelis constant for CO2 9 against 172 micromolar. The transformed plants grew only at 9000 ppm CO2.', `
    <rect class="frb-bar-plant" x="${bx}" y="54" width="22" height="16" rx="4"/>${T(bx + 30, 68, 'tobacco RuBisCO', 'fcb-s')}
    <rect class="frb-bar-cy" x="${bx + 200}" y="54" width="22" height="16" rx="4"/>${T(bx + 230, 68, 'cyanobacterial RuBisCO', 'fcb-s')}
    ${pair(100, `rate, ${sym('k', 'cat')}`, 's⁻¹ per site', 3.9, 14.4, 16)}
    ${pair(210, `specificity, ${sym('S', 'c/o')}`, '', 91, 43, 100)}
    ${pair(320, `CO₂ needed, ${sym('K', 'c')}`, 'µM (half-saturation)', 9, 172, 190)}
    ${panel(60, 452, 680, 92, 'frb-panel-w')}
    ${T(76, 484, 'tobacco with cyanobacterial RuBisCO:', 'fcb-node')}
    ${T(76, 512, 'grows only at 9000 ppm CO₂ (0.9 %); barely survives at 427 ppm', 'fcb-s')}
    ${credit(790, 594, 'Occhialini et al. 2016, Plant J 85:148, Table 1 (25 °C) · Lin et al. 2014, Nature 513:547')}
  `);
}

/* ---------- v6 · what a better RuBisCO could give (Zhu 2004) ---------- */

function v6(): string {
  const p = 'frb5cv6', bx = 360, bw = 330, max = 30;
  const row = (y: number, a: string, b: string, v: number, txt: string, cls: string): string =>
    `${T(bx - 16, y + 18, a, 'fcb-node', 'end')}${T(bx - 16, y + 44, b, 'fcb-s', 'end')}<rect class="${cls}" x="${bx}" y="${y}" width="${f(Math.max((v / max) * bw, 3))}" height="36" rx="5"/>${T(bx + (v / max) * bw + 12, y + 27, txt, 'fcb-big')}`;
  return svg(p, 'Modelled gain in canopy carbon of a crop, after Zhu, Portis and Long 2004: a plant RuBisCO with the specificity best for today’s CO2 would add about 3 percent; a foreign RuBisCO with higher specificity or higher turnover than the trade-off allows would add more than 25 percent.', `
    ${T(400, 70, 'modelled gain in crop canopy CO₂ uptake', 'fcb-h', 'middle')}
    ${path(`M${bx},110 V420`, 'fcb-axis')}
    ${row(130, 'plant RuBisCO tuned', 'to today’s CO₂', 3, '+3 %', 'frb-bar-plant')}
    ${row(260, 'foreign RuBisCO above', 'the trade-off', 25, '> 25 %', 'frb-bar-red')}
    ${panel(60, 452, 680, 92, 'frb-panel-w')}
    ${T(76, 484, 'today’s crop RuBisCO is optimal for ≈ 210 ppm, not 427 ppm', 'fcb-node')}
    ${T(76, 512, 'red-algal RuBisCOs lie above it, but do not assemble in plants', 'fcb-s')}
    ${credit(790, 594, 'Zhu, Portis & Long 2004, Plant Cell Environ 27:155 (abstract; model, canopy CO₂ uptake per day)')}
  `);
}

/* ---------- v7 · the red-algal edge shrinks with temperature ---------- */

function v7(): string {
  const p = 'frb5cv7';
  const a: Axes = { x0: 120, y0: 60, w: 560, h: 380, xr: [0, 60], yr: [Math.log(20), Math.log(400)] };
  const sp = (t: number): number => SCO.fit(t), cross = sp(57), k = Math.log(cross / 238) / 32, gp = (t: number): number => 238 * Math.exp(k * (t - 25));
  const L = (fn: (t: number) => number, t0: number): string => `M${Array.from({ length: 61 - t0 }, (_, i) => `${f(X(a, t0 + i))},${f(Y(a, Math.log(fn(t0 + i))))}`).join(' L')}`;
  const yt = [20, 50, 100, 200, 400];
  return svg(p, 'CO2/O2 specificity against temperature on a log scale. The red alga Galdieria partita: 238 at 25 degrees, almost 3 times spinach RuBisCO with 82. Its specificity falls faster with temperature, and the two lines cross at 57 degrees.', `
    ${axes(a, [0, 10, 20, 30, 40, 50, 60], yt.map(v => Math.log(v)), 'temperature (°C)', `specificity, ${sym('S', 'c/o')} (log scale)`, { yfmt: v => String(Math.round(Math.exp(v))) })}
    <path class="frb-ml" d="${L(gp, 25)}"/><path class="frb-co2" d="${L(sp, 5)}"/>
    <circle class="frb-dot-ml" cx="${f(X(a, 25))}" cy="${f(Y(a, Math.log(238)))}" r="8"/><circle class="frb-dot" cx="${f(X(a, 25))}" cy="${f(Y(a, Math.log(82)))}" r="8"/>
    ${T(X(a, 25) + 14, Y(a, Math.log(238)) - 12, '238 at 25 °C', 'fcb-node')}${T(X(a, 25) - 14, Y(a, Math.log(82)) + 30, '82 at 25 °C', 'fcb-node', 'end')}
    ${T(X(a, 34), Y(a, Math.log(gp(34))) - 16, '<tspan class="fcb-it">Galdieria partita</tspan> (red alga)', 'fcb-node fcb-c-red')}${T(X(a, 5), Y(a, Math.log(sp(5))) - 16, 'spinach', 'fcb-node')}
    <circle class="frb-ring" cx="${f(X(a, 57))}" cy="${f(Y(a, Math.log(cross)))}" r="16"/>${T(790, Y(a, Math.log(60)), 'equal at 57 °C', 'fcb-node', 'end')}
    ${credit(790, 594, 'Tcherkez et al. 2006 (equal at 57 °C) · Uemura et al. 1997 (238) · Jordan & Ogren 1984 · straight lines on the log scale')}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7 };
export function draw(id: string): string {
  return (DRAW[id] ?? v1)();
}
