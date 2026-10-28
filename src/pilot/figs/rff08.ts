// Slide C8 · FvCB model (pick key C9). Figures of the rf chunk (overnight build 28 Oct 2026); text in ./rf08.ts.
// The lecturer's pick 'a' (the thesis scheme, ./c12.ts) stays first, then the new variants v1–v8, then the other earlier
// figures of ./c12.ts by their own ids. The deck's only FvCB figures.
// Approaches: whole schema with the three FvCB limits lit (v1, v2, v7, v8; ./rf-schema.ts) · the three sub-lits as a
// storyboard beside the A/Cc curve (v3) · real figures (v4 Gregory et al. 2021 Fig. 2B, rice; v5 the lecturer's MSc thesis
// Fig. 5, wheat) · data redrawn (v6 Gregory 2021 Fig. 2B fits).
// Numbers used, and no others: Gregory et al. 2021 Fig. 2B fitted RuBisCO-, RuBP-regeneration- and TPU-limited rates and
// the measured points, read off the figure (A in µmol m⁻² s⁻¹ against Cc in Pa, as printed); typical Ci of a C₃ leaf at
// 25 °C ≈ 300 µmol mol⁻¹ (Busch et al. 2024, Table 1, "indicative"). Credits: assets/SOURCES-rf.md.
import type { PlateText, Variant } from '../types';
import { draw as c12draw, VARIANTS as C12 } from './c12';
import { schemaSvg, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P, type Part } from './rf-schema';
import { axes, credit, crop, curve, fig, pill, shot, sb, T, type Img, type Pt } from './rf-kit';
import gregPng from '../../assets/rf/gregory2021-fig2.png';
import thesisPng from '../../assets/rf/zhang2021-fig5.png';

export const PLATE: PlateText = {
  n: 'C8',
  title: 'FvCB model',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Farquhar, von Caemmerer & Berry 1980', url: 'https://doi.org/10.1007/BF00386231' },
    { label: 'Sharkey 1985', url: 'https://doi.org/10.1104/pp.78.1.71' },
    { label: 'Busch et al. 2024', url: 'https://doi.org/10.1111/pce.14815' },
    { label: 'Gregory et al. 2021', url: 'https://doi.org/10.1111/pce.14153' },
  ],
};

const PICKED = C12.filter(v => v.id === 'a');
const NEW: Variant[] = [
  { id: 'v1', name: 'Schema (thesis look) with the three limits: Ac, Aj, Ap', anim: true },
  { id: 'v2', name: 'Schema (glow look) with the three limits', anim: true },
  { id: 'v3', name: 'Storyboard: each limit lit in the schema, beside the A/Cc curve', anim: true },
  { id: 'v4', name: 'Rice A/Cc with the three fitted limits (Gregory 2021 Fig. 2B)' },
  { id: 'v5', name: 'The MSc thesis wheat A/Ci curve (Fig. 5), with today’s Ci' },
  { id: 'v6', name: 'The three limits redrawn from Gregory 2021: the lowest one sets uptake' },
  { id: 'v7', name: 'Schema with structures (RuBisCO, thylakoid complexes) and the three limits', anim: true },
  { id: 'v8', name: 'Schema (line look) with the three limits' },
];
export const VARIANTS: Variant[] = [...PICKED, ...NEW, ...C12.filter(v => v.id !== 'a')];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return schemaSvg('thesis', LIT_C8, { id: 'rf8v1' });
    case 'v2': return schemaSvg('glow', LIT_C8, { id: 'rf8v2' });
    case 'v3': return storySvg();
    case 'v4': return gregorySvg();
    case 'v5': return thesisSvg();
    case 'v6': return redrawSvg();
    case 'v7': return schemaSvg('pdb', LIT_C8, { id: 'rf8v7' });
    case 'v8': return schemaSvg('line', LIT_C8, { id: 'rf8v8' });
    default: return c12draw(id);
  }
}

/* Gregory et al. 2021 Fig. 2B, read off the figure: Cc (Pa) → A (µmol m⁻² s⁻¹) */
const AC: Pt[] = [[5.2, 1.0], [9.7, 9.8], [14.1, 19.8], [18.6, 27.3], [23.1, 33.7], [27.6, 40.9], [32.0, 46.9], [34.6, 50.0]];
const AJ: Pt[] = [[3.4, 0.4], [7.9, 8.7], [12.3, 15.3], [16.8, 19.8], [21.3, 23.1], [25.8, 25.5], [30.2, 27.3], [34.7, 28.9], [39.2, 30.2],
  [43.7, 31.2], [48.1, 32.3], [54.0, 33.1], [58.5, 33.7], [63.0, 34.2], [67.4, 34.7], [71.9, 35.2], [76.4, 35.5], [80.9, 35.9], [85.3, 36.3], [89.8, 36.6], [94.3, 36.8], [96.5, 37.0]];
const AP: Pt[] = [[9.3, 49.4], [13.8, 41.0], [18.3, 37.1], [22.7, 35.5], [27.2, 34.5], [31.7, 33.9], [36.1, 33.4], [40.6, 33.1], [45.1, 32.9],
  [49.6, 32.6], [54.0, 32.5], [58.5, 32.3], [63.0, 32.2], [67.4, 32.1], [71.9, 32.1], [76.4, 31.9], [80.9, 31.9], [85.3, 31.8], [89.8, 31.8], [94.3, 31.8], [96.5, 31.8]];
const DOTS: Pt[] = [[5.0, 1.5], [5.6, 1.3], [6.5, 2.6], [7.3, 4.0], [9.8, 8.3], [10.6, 19.3], [25.0, 26.6], [26.5, 25.9], [27.2, 26.9], [30.1, 27.8], [38.6, 29.5], [43.0, 30.2], [77.9, 31.6]];
/** Switch points of the envelope, where one limit takes over from the next (read off the crossings). */
const CJ = 12.0, JP = 50.0;
const seg = (q: Pt[], lo: number, hi: number): Pt[] => q.filter(p => p[0] >= lo - 0.01 && p[0] <= hi + 0.01);
const at = (q: Pt[], x: number): number => {
  for (let i = 0; i < q.length - 1; i++) if (x >= q[i][0] && x <= q[i + 1][0]) return q[i][1] + (q[i + 1][1] - q[i][1]) * (x - q[i][0]) / (q[i + 1][0] - q[i][0]);
  return q[q.length - 1][1];
};

/** The A/Cc plot of the Gregory fits in box b; full = potential rates dashed beyond their range. */
function acPlot(b: [number, number, number, number], o: { full?: boolean; big?: boolean; dots?: boolean } = {}): string {
  const X = (c: number): number => b[0] + (c / 100) * (b[2] - b[0]);
  const Y = (a: number): number => b[3] - (a / 50) * (b[3] - b[1]);
  const P = (q: Pt[]): Pt[] => q.map(([c, a]) => [X(c), Y(a)] as Pt);
  const env = (q: Pt[], lo: number, hi: number, k: string): string =>
    curve(P([[lo, at(q, lo)], ...seg(q, lo, hi).filter(p => p[0] > lo && p[0] < hi), [hi, at(q, hi)]]), `rfk-cv rfk-cv-${k}`);
  const pot = o.full
    ? curve(P([[CJ, at(AC, CJ)], ...seg(AC, CJ, 40)]), 'rfk-cv rfk-cv-c rfk-cv-dash') + curve(P([[JP, at(AJ, JP)], ...seg(AJ, JP, 97)]), 'rfk-cv rfk-cv-j rfk-cv-dash')
      + curve(P(seg(AP, 9, JP).concat([[JP, at(AP, JP)]])), 'rfk-cv rfk-cv-p rfk-cv-dash') + curve(P(seg(AJ, 0, CJ).concat([[CJ, at(AJ, CJ)]])), 'rfk-cv rfk-cv-j rfk-cv-dash')
    : '';
  const dots = o.dots ? DOTS.map(([c, a]) => `<circle class="rfk-dot rfk-dot-k" cx="${X(c).toFixed(1)}" cy="${Y(a).toFixed(1)}" r="${o.big ? 7 : 5}"/>`).join('') : '';
  const ax = o.big
    ? axes(b, X, Y, [[0, '0'], [25, '25'], [50, '50'], [75, '75'], [100, '100']], [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40'], [50, '50']],
      `chloroplast CO₂, <tspan font-style="italic">C</tspan>${sb('c')} (Pa)`, 'net CO₂ uptake, <tspan font-style="italic">A</tspan> (µmol m⁻² s⁻¹)')
    : axes(b, X, Y, [[0, '0'], [50, '50'], [100, '100']], [[0, '0'], [25, '25'], [50, '50']], `<tspan font-style="italic">C</tspan>${sb('c')} (Pa)`, '<tspan font-style="italic">A</tspan>');
  return `${ax}${pot}${env(AC, 5.2, CJ, 'c')}${env(AJ, CJ, JP, 'j')}${env(AP, JP, 96.5, 'p')}${dots}`;
}

/* v3 · storyboard: the three sub-lits beside the curve */
function storySvg(): string {
  const noLim = (q: Part[]): Part[] => q.filter(p => !p.startsWith('lim-'));
  const cell = (x: number, y: number, k: string, name: string): string =>
    `<rect class="rfk-panel" x="${x}" y="${y}" width="388" height="290" rx="14"/>${T(x + 14, y + 30, name, `rfk-h${k} rfk-halo`)}`;
  const A = (s: string, k: string): string => `<tspan font-style="italic">A</tspan>${sb(k)}${s}`;
  return fig('rff08', 'Four panels. Three crops of the schema, each with one FvCB limit lit: Ac, RuBisCO with CO2 and carboxylation; Aj, the light reactions supplying ATP and NADPH to PGA reduction and RuBP regeneration; Ap, triose phosphate leaving the chloroplast for sucrose in exchange for phosphate. The fourth panel is the A/Cc curve of rice (Gregory et al. 2021): Ac at low CO2 in red, Aj in the middle in cyan, Ap at high CO2 in purple.', `
    ${cell(6, 6, 'c', '')}${crop('rf8v3c', 'thesis', noLim(LIT_C8C), [150, 300, 400, 296], [8, 8, 384, 286], false)}${T(20, 36, A(': RuBisCO', 'c'), 'rfk-hc rfk-halo')}
    ${cell(406, 6, 'j', '')}${crop('rf8v3j', 'thesis', noLim(LIT_C8J), [100, 78, 440, 325], [408, 8, 384, 286], false)}${T(420, 36, A(': RuBP regeneration', 'j'), 'rfk-hj rfk-halo')}
    ${cell(6, 304, 'p', '')}${crop('rf8v3p', 'thesis', noLim(LIT_C8P), [150, -56, 420, 312], [8, 306, 384, 286], false)}${T(20, 334, A(': triose-phosphate use', 'p'), 'rfk-hp rfk-halo')}
    <rect class="rfk-panel" x="406" y="304" width="388" height="290" rx="14"/>
    ${acPlot([500, 336, 770, 500])}
    ${T(556, 400, A('', 'c'), 'rfk-hc')}${T(640, 446, A('', 'j'), 'rfk-hj')}${T(744, 420, A('', 'p'), 'rfk-hp')}
    ${T(790, 590, 'rice, Gregory et al. 2021', 'rfk-cr', 'end')}`);
}

/* v4 · Gregory et al. 2021 Fig. 2B, the real figure */
const GREG: Img = { href: gregPng, w: 1510, h: 540 };
function gregorySvg(): string {
  const r = shot('rf8v4', GREG, 40, 40, 540, { fig: true, win: [790, 62, 720, 478] });
  const P = (c: number, a: number): Pt => r.at(911 + c * 5.59, 424 - a * 6.88);
  const A = (s: string, k: string): string => `<tspan font-style="italic">A</tspan>${sb(k)}${s}`;
  return fig('rff08', 'Gregory et al. 2021, figure 2B: net CO2 uptake A of rice against chloroplast CO2, measured points with three fitted limits: RuBisCO-limited in red, rising steeply at low CO2; RuBP-regeneration-limited in blue; TPU-limited in gold, flat at high CO2. Uptake follows the lowest of the three.', `
    ${r.svg}
    ${pill(686, 110, A(': RuBisCO', 'c'), P(31, 46), 'rfk-kc')}
    ${pill(676, 190, A(': RuBP regeneration', 'j'), P(93, 36.7), 'rfk-kj')}
    ${pill(686, 286, A(': TPU', 'p'), P(95, 31.8), 'rfk-kp')}
    ${credit(794, 594, 'Gregory et al. 2021, Plant Cell Environ 44:3223, Fig. 2B (rice, measured points and fits; CC BY 4.0)')}`);
}

/* v5 · the MSc thesis Fig. 5 */
const THESIS: Img = { href: thesisPng, w: 1600, h: 1103 };
function thesisSvg(): string {
  const r = shot('rf8v5', THESIS, 40, 20, 700, { fig: true });
  const x300 = r.at(200 + 0.96 * 300, 0)[0];
  return fig('rff08', 'The lecturer’s MSc thesis figure 5: modelled net CO2 uptake of wheat against intercellular CO2, 0 to about 1400 ppm. RuBisCO-limited, red, below about 320 ppm; RuBP-regeneration-limited, cyan, above; grey dashes extend each limit. A dashed line marks the typical Ci of a C3 leaf today, about 300 ppm, still on the RuBisCO-limited part.', `
    ${r.svg}
    <path class="rfk-mk" d="M${x300.toFixed(1)},${r.at(0, 60)[1].toFixed(1)}V${r.at(0, 937)[1].toFixed(1)}"/>
    ${pill(x300 + 4, r.at(0, 40)[1], 'today: <tspan font-style="italic">C</tspan>ᵢ ≈ 300 ppm')}
    ${credit(794, 594, 'Zhang 2021, MSc thesis, University of Copenhagen, Fig. 5 (wheat, FvCB model) · Cᵢ: Busch et al. 2024, Table 1')}`);
}

/* v6 · the Gregory fits redrawn */
function redrawSvg(): string {
  const b: [number, number, number, number] = [140, 40, 740, 460];
  const X = (c: number): number => b[0] + (c / 100) * (b[2] - b[0]);
  const Y = (a: number): number => b[3] - (a / 50) * (b[3] - b[1]);
  const A = (s: string, k: string): string => `<tspan font-style="italic">A</tspan>${sb(k)}${s}`;
  return fig('rff08', 'Redrawn from Gregory et al. 2021, figure 2B, rice: net CO2 uptake against chloroplast CO2. Three potential rates: RuBisCO-limited rises steeply, RuBP-regeneration-limited rises slowly, TPU-limited is flat. The measured uptake follows the lowest of the three: RuBisCO below about 12 Pa, RuBP regeneration up to about 50 Pa, TPU above. Each rate is solid where it limits and dashed where it does not.', `
    <path class="rfk-mk" d="M${X(CJ).toFixed(1)},${b[1] + 20}V${b[3]}M${X(JP).toFixed(1)},${b[1] + 20}V${b[3]}"/>
    ${acPlot(b, { full: true, big: true, dots: true })}
    ${T(X(26), Y(46), A(': RuBisCO', 'c'), 'rfk-hc', 'start')}
    ${T(X(28), Y(22), A(': RuBP regeneration', 'j'), 'rfk-hj', 'start')}
    ${T(X(60), Y(27.5), A(': triose-phosphate use', 'p'), 'rfk-hp', 'start')}
    ${pill(X(70), Y(44), 'uptake = the lowest rate')}
    ${credit(794, 594, 'redrawn from Gregory et al. 2021, Plant Cell Environ 44:3223, Fig. 2B (rice; CC BY 4.0)')}`);
}
