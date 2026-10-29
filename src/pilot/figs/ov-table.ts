// The overview slide's summary table, text only (slide C10o; lecturer, 30 Oct 2026: "make a variant of the summarized
// table just with text: that information is important, you can't easily illustrate it with a graph"). Columns in the
// climate order of layout b (cool, moist → hot, dry): C₃ · C₂ · C₄ · CAM. Rows: how each copes with scarce CO₂ (the
// strategy, the row that matters most, set bold), what it gains, what it costs, examples. Drawn by the animation 'ove'
// (anim/ov-e.ts, cell by cell) and the page figure e (cov-e.ts, still), from one layout function.
// Facts: shares Sage 2016 (C₄ ≈ 3 %), Still et al. 2003 (C₄ ≈ 23 % of land photosynthesis), Silvera et al. 2010 (CAM
// ≈ 6 %), Sage et al. 2011 (C₂ rare: C₃–C₄ intermediates in 21 lineages); C₂ recaptures most of the photorespired CO₂
// but RuBisCO still oxygenates (Sage et al. 2012); C₄ needs 5 ATP per CO₂ against C₃'s 3 (PEP regeneration by PPDK);
// CAM's daily CO₂ is limited by the malic acid its vacuoles store overnight (Winter & Smith 2022).

export interface Col { id: string; name: string; head: string[]; tint: string; cells: string[][] }
export const ROWS = ['How it copes', 'What it gains', 'What it costs', 'Examples'];
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
export const COLS: Col[] = [
  { id: 'c3', name: 'C₃', head: ['≈ 90 % of species', 'cool to warm, moist'], tint: '#e3eee8', cells: [
    ['no extra step:', 'RuBisCO uses the', 'CO₂ that diffuses in'],
    ['no extra energy,', 'no special anatomy'],
    ['on hot, dry days', 'oxygenation rises'],
    ['wheat, rice, soybean,', 'all trees'],
  ] },
  { id: 'c2', name: 'C₂', head: ['rare: C₃–C₄ intermediates', 'warm, sunny, dry'], tint: '#ebefd9', cells: [
    ['traps the CO₂ that', 'photorespiration', 'releases, in the', 'bundle sheath'],
    ['most of that CO₂', 'is fixed again'],
    ['RuBisCO still', 'takes up O₂'],
    [`some ${it('Flaveria')},`, 'wild rocket'],
  ] },
  { id: 'c4', name: 'C₄', head: ['≈ 3 % of species, but', '≈ ¼ of land photosynthesis', 'hot, sunny grasslands'], tint: '#f5eacb', cells: [
    ['pumps CO₂ into the', 'bundle sheath'],
    ['RuBisCO hardly', 'takes up O₂; less', 'water per sugar'],
    ['2 extra ATP', 'per CO₂'],
    ['maize, sugarcane,', 'sorghum'],
  ] },
  { id: 'cam', name: 'CAM', head: ['≈ 6 % of species', 'deserts, epiphytes'], tint: '#f1e2c8', cells: [
    ['takes CO₂ in at night,', 'stores it as malic', 'acid, uses it by day'],
    ['stomata shut by day:', 'very little water lost'],
    ['usually slow growth:', 'CO₂ only from the', 'night’s store'],
    ['agave, pineapple,', 'cacti, many orchids'],
  ] },
];

/** Geometry: x0 the left edge, lw the row-label column, cw a type column, y0 the top; sizes of the name, the head lines,
 *  the cells and their line height; pad inside a row. */
export interface Lay { x0: number; lw: number; cw: number; y0: number; name: number; small: number; cell: number; lh: number; pad: number }

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const INK = '#2f2e2b', MUTE = '#6b6a64', RULE = '#d9d4c6', ACC = '#9a4426';
const TX = (x: number, y: number, s: string, size: number, fill: string, weight = 400, a: 'start' | 'middle' = 'start'): string =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}">${s}</text>`;

/** The table's parts, each in its own group with a data-k (prefix p): the grid and row labels `${p}-grid`, each column's
 *  head `${p}-${id}-h` and cells `${p}-${id}-r${i}`, the evolution line `${p}-evo`. Returns the markup and the bottom y. */
export function tableSvg(p: string, L: Lay, opacity = '1'): { svg: string; bottom: number } {
  // the name, up to 3 small lines under it, then room below the last one inside the tint
  const headH = L.name + 4 + 3 * (L.small + 5) + L.pad + 10;
  const rowH = ROWS.map((_, r) => Math.max(...COLS.map(c => c.cells[r].length)) * L.lh + 2 * L.pad);
  const rowY: number[] = [];
  { let y = L.y0 + headH; for (const h of rowH) { rowY.push(y); y += h; } }
  const bottom = rowY[rowY.length - 1] + rowH[rowH.length - 1];
  const cx = (i: number): number => L.x0 + L.lw + i * L.cw;
  const right = cx(COLS.length);
  // the grid: tinted column heads, rules between rows, row labels (the strategy's in the accent colour)
  const tints = COLS.map((c, i) => `<rect x="${f(cx(i) + 3)}" y="${f(L.y0)}" width="${f(L.cw - 6)}" height="${f(headH - 6)}" rx="10" style="fill:${c.tint}"/>`).join('');
  const rules = rowY.map(y => `<path d="M${f(L.x0)},${f(y)} H${f(right)}" style="stroke:${RULE};stroke-width:1.4"/>`).join('')
    + `<path d="M${f(L.x0)},${f(bottom)} H${f(right)}" style="stroke:${RULE};stroke-width:1.4"/>`;
  const labs = ROWS.map((r, i) => TX(L.x0, rowY[i] + L.pad + L.cell, r, L.cell, i === 0 ? ACC : MUTE, 700)).join('');
  const grid = `<g data-k="${p}-grid" opacity="${opacity}">${tints}${rules}${labs}</g>`;
  const cols = COLS.map((c, i) => {
    const x = cx(i) + L.pad;
    const head = `<g data-k="${p}-${c.id}-h" opacity="${opacity}">${TX(x, L.y0 + L.name + 4, c.name, L.name, INK, 700)}${c.head.map((l, k) => TX(x, L.y0 + L.name + 4 + (k + 1) * (L.small + 5), l, L.small, MUTE)).join('')}</g>`;
    const cells = c.cells.map((ls, r) => `<g data-k="${p}-${c.id}-r${r}" opacity="${opacity}">${ls.map((l, k) =>
      TX(x, rowY[r] + L.pad + L.cell + k * L.lh, l, L.cell, r === 2 ? MUTE : INK, r === 0 ? 700 : 400)).join('')}</g>`).join('');
    return head + cells;
  }).join('');
  return { svg: grid + cols, bottom };
}

/** The evolution line under the table: a rust arrow from the C₃ column over the 3 others, "evolved from C₃, many times". */
export function evoSvg(p: string, L: Lay, y: number, size: number, opacity = '1'): string {
  const x1 = L.x0 + L.lw + L.cw * 0.5, x2 = L.x0 + L.lw + L.cw * 3.6;
  return `<g data-k="${p}-evo" opacity="${opacity}">
    <path data-k="${p}-evo-l" d="M${f(x1)},${f(y - size * 0.35)} H${f(x2)}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${opacity === '1' ? 0 : 1}" style="fill:none;stroke:#a9532f;stroke-width:2.8;stroke-linecap:round"/>
    <path data-k="${p}-evo-h" d="M${f(x2 - 12)},${f(y - size * 0.35 - 7)} L${f(x2 + 2)},${f(y - size * 0.35)} L${f(x2 - 12)},${f(y - size * 0.35 + 7)}" opacity="${opacity}" style="fill:none;stroke:#a9532f;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round"/>
    <g data-k="${p}-evo-t" opacity="${opacity}">${TX((x1 + x2) / 2, y + size * 0.9, 'C₂, C₄ and CAM all evolved from C₃, many times', size, ACC, 700, 'middle')}</g></g>`;
}
