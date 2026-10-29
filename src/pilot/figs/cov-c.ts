// The overview slide's page figure, layout c (slide C10o): the end state of the animation 'ovc' (anim/ov-c.ts), still,
// without the problem and the question. The climate band over the strategy table: under each type's place on the band
// its column, with the plant photo, the name, the share of species, then how it copes, what it gains, what it costs;
// rust arrows C₃ → C₂ → C₄ and C₃ → CAM, "evolved from C₃, many times". No CO₂ gauge. drawTable('d') draws layout d
// (figs/cov-d.ts): the cards (photo, name, share, how it copes) under the 3-word band, gains and costs in cells below.
import { bandDefs, headAt } from '../anim/ov-b';
import { COLS, lines, photoBox, ROW_NAMES } from '../anim/ov-c';
import { T } from '../anim/co2-kit';

/** The rows wrapped for the 800 × 600 page (the words of COLS). */
const WRAP: Record<string, { climate: string[]; how: string[]; gain: string[]; cost: string[] }> = {
  c3: { climate: ['cool, moist'], how: ['no extra step:', 'RuBisCO uses the', 'CO₂ that diffuses in'], gain: ['no extra energy,', 'no special anatomy'], cost: ['on hot, dry days', 'oxygenation rises'] },
  c2: { climate: ['warm, sunny, dry'], how: ['traps the CO₂ that', 'photorespiration', 'releases, in the', 'bundle sheath'], gain: ['most of that CO₂', 'is fixed again'], cost: ['RuBisCO still', 'takes O₂'] },
  c4: { climate: ['hot, sunny grasslands'], how: ['pumps CO₂ into the', 'bundle sheath'], gain: ['RuBisCO hardly takes', 'O₂; less water per', 'sugar'], cost: ['2 extra ATP per CO₂'] },
  cam: { climate: ['hot, dry:', 'deserts, epiphytes'], how: ['takes CO₂ in at night,', 'stores it as malic', 'acid, uses it by day'], gain: ['stomata shut by day:', 'very little water lost'], cost: ['usually grows slowly:', 'its night store limits it'] },
};
const X0 = 98, W = 175, cx = (j: number): number => X0 + W * j, cc = (j: number): number => cx(j) + W / 2;
/** Head (top), the 3 rows (top, bottom); text 14.5 px, step 19. */
const HEAD = 86, ROWS: Array<[number, number]> = [[216, 306], [306, 372], [372, 426]];
const FS = 14.5, STEP = 19;
const RUST = 'fill:none;stroke:#a9532f;stroke-width:2.8;stroke-linecap:round';
const HALO = 'fill:none;stroke:#fbfaf6;stroke-width:7;stroke-linecap:round';
const ARROWS: string[] = [
  `M${cc(0) + 22},82C${cc(0) + 50},60 ${cc(1) - 50},60 ${cc(1) - 22},82`,
  `M${cc(1) + 22},82C${cc(1) + 50},60 ${cc(2) - 50},60 ${cc(2) - 22},82`,
  `M${cc(0) - 20},82C${cc(0) - 14},56 ${cc(0) + 10},50 ${cc(0) + 70},50C${cc(3) - 150},50 ${cc(3) - 6},50 ${cc(3) + 6},82`,
];

export function drawTable(mode: 'c' | 'd'): string {
  const p = `fov${mode}`;
  const band = mode === 'c'
    ? `<rect x="${X0}" y="6" width="${W * 4 - 4}" height="36" rx="18" fill="url(#${p}-band)" style="stroke:#d3c9ad;stroke-width:1"/>
      ${COLS.map((c, j) => { const l = WRAP[c.id].climate; return lines(cc(j), l.length > 1 ? 21 : 29, l, 14, 13, 'co2k-zl', 'middle'); }).join('')}`
    : `<rect x="8" y="6" width="786" height="30" rx="15" fill="url(#${p}-band)" style="stroke:#d3c9ad;stroke-width:1"/>
      ${T(22, 26, 'cool, moist', 'co2k-zl', 'start', ' style="font-size:14px"')}${T(540, 26, 'hot, sunny', 'co2k-zl', 'middle', ' style="font-size:14px"')}${T(780, 26, 'hot, dry', 'co2k-zl', 'end', ' style="font-size:14px"')}`;
  const card = (x: number, y: number, h: number): string => `<rect class="co2k-card" x="${x + 3}" y="${y}" width="${W - 6}" height="${h}" rx="10"/>`;
  const rule = (x: number, y: number): string => `<path d="M${x + 12},${y}H${x + W - 12}" style="fill:none;stroke:#e4dfd2;stroke-width:1.2"/>`;
  const cols = COLS.map((c, j) => {
    const x = cx(j), w = WRAP[c.id];
    const head = `${photoBox(`${p}-${c.id}-pc`, c.kind, x + 10, HEAD + 6, 92, 64, 6)}
      ${T(x + 108, HEAD + 34, c.name, 'co2k-zl', 'start', ' style="font-size:23px"')}
      ${lines(x + 12, HEAD + 90, c.share, 15, 12.5)}`;
    const cell = (i: number, ls: string[]): string => lines(x + 13, ROWS[i][0] + 22, ls, STEP, FS);
    const frame = mode === 'c'
      ? `${card(x, HEAD, ROWS[2][1] - HEAD)}${rule(x, ROWS[0][0])}${rule(x, ROWS[1][0])}${rule(x, ROWS[2][0])}`
      : `${card(x, HEAD, ROWS[0][1] - HEAD - 2)}${rule(x, ROWS[0][0])}${card(x, ROWS[1][0] + 2, ROWS[1][1] - ROWS[1][0] - 4)}${card(x, ROWS[2][0], ROWS[2][1] - ROWS[2][0])}`;
    return `${frame}${head}${cell(0, w.how)}${cell(1, w.gain)}${cell(2, w.cost)}`;
  }).join('');
  const rowNames = ROW_NAMES.map((r, i) => { const [a, b] = [r.split(' ').slice(0, 2).join(' '), r.split(' ').slice(2).join(' ')]; return lines(8, (ROWS[i][0] + ROWS[i][1]) / 2 - 3, [a, b], 17, 14, 'co2k-zl'); }).join('');
  const arrows = ARROWS.map(d => `<path d="${d}" style="${HALO}"/><path d="${d}" style="${RUST}"/>${headAt(d, 12)}`).join('');
  const cr = (y: number, s: string): string => T(8, y, s, 'co2k-cr', 'start', ' style="font-size:12.5px"');
  const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
  const label = mode === 'c'
    ? 'A climate band runs along the top, from cool and moist (pale blue-green) to hot and dry (sand); under each photosynthesis type\'s place on it stands its column of a table.'
    : 'A climate band from cool, moist through hot, sunny to hot, dry runs along the top; under it 4 cards, one per photosynthesis type, form the columns of a table.';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label} Each column shows a plant photo, the type's name and its share of species, then 3 rows: how it copes, what it gains, what it costs. C3, about 90 % of species (ripe wheat): no extra step, RuBisCO uses the CO2 that diffuses in; no extra energy, no special anatomy; on hot, dry days oxygenation rises. C2, rare (wild rocket): traps the CO2 that photorespiration releases, in the bundle sheath; most of that CO2 is fixed again; RuBisCO still takes O2. C4, about 3 % of species yet about a quarter of land photosynthesis (maize): pumps CO2 into the bundle sheath; RuBisCO hardly takes O2, less water per sugar; 2 extra ATP per CO2. CAM, about 6 % of species (agave): takes CO2 in at night, stores it as malic acid, uses it by day; stomata shut by day, very little water lost; usually slow growth, limited by the night's store. Rust arrows over the column heads lead from C3 to C2 to C4 and from C3 to CAM: evolved from C3, many times.">
    <defs>${bandDefs(`${p}-band`)}</defs><g class="dk1 co2k">
    ${band}${rowNames}${cols}${arrows}
    ${lines(10, 52, ['evolved', 'from C₃,', 'many times'], 14, 13, 'co2k-q', 'start')}
    ${cr(549, 'C₃: wheat, Hans Hillewaert (CC BY-SA 3.0) · C₂: wild rocket, Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0)')}
    ${cr(564, `C₄: maize, High Contrast (CC BY 3.0 DE) · CAM: ${it('Agave americana')}, Fawaz.tairou (CC BY 4.0)`)}
    ${cr(579, 'Plant photos: Wikimedia Commons')}</g></svg>`;
}

export function draw(): string {
  return drawTable('c');
}
