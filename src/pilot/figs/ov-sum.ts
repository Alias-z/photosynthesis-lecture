// The overview slide's summary texts (slide C10o, figures w1–w3; lecturer, 30 Oct 2026: "highlight the cost and benefits
// and the region they live; only deliver the most important information"), with the key phrase of each column marked
// *like this* (drawn on a soft marker band) and italics _like this_. Facts as figs/ov-table.ts (Sage 2016, Still et al.
// 2003, Silvera et al. 2010, Sage et al. 2011, 2012; Winter & Smith 2022). Columns in the climate order C₃ · C₂ · C₄ · CAM.

export interface Sum { name: string; sub: string; plant: string; share: string; where: string; how: string; gain: string; cost: string }
// lecturer, 30 Oct 2026, late: "make sentences clear (it suffers on hot, dry days); highlight the mechanism: recapture the
// photorespired CO₂, pump or concentrate CO₂ in the bundle sheath" (the mechanism is marked in its own colour in w3)
export const SUM: Sum[] = [
  { name: 'C₃', sub: '', plant: 'wheat', share: '*≈ 90 %* of plant species',
    where: 'cool to warm, moist regions worldwide',
    how: '*no extra mechanism:* RuBisCO uses the CO₂ diffusing in',
    gain: '*cheapest:* needs no extra energy',
    cost: '*suffers on hot, dry days:* its stomata close and photorespiration rises' },
  { name: 'C₂', sub: 'C₃–C₄ intermediate', plant: '_Flaveria_', share: 'rare: C₃–C₄ intermediates',
    where: 'warm, sunny, dry places (e.g. _Flaveria_ in Mexico)',
    how: '*recaptures the CO₂* that photorespiration releases, in the bundle sheath',
    gain: 'loses less CO₂ than C₃ on hot days; a step on the way to C₄',
    cost: 'only a small gain over C₃' },
  { name: 'C₄', sub: '', plant: 'maize', share: '≈ 3 % of species, yet ≈ ¼ of land photosynthesis',
    where: 'hot, sunny grasslands and savannas',
    how: '*pumps CO₂ into the bundle sheath,* concentrating it around RuBisCO',
    gain: '*almost no photorespiration,* even in heat; narrower stomata: | *saves water*',
    cost: '*costs extra energy:* 2 ATP per CO₂ | *so it needs strong sun*' },
  { name: 'CAM', sub: '', plant: 'saguaro cactus', share: '≈ 6 % of species',
    where: 'deserts and dry places; tree branches in tropical forests',
    how: '*takes up CO₂ at night,* stores it, uses it by day with stomata shut',
    gain: 'very little water lost: *survives drought*',
    cost: '*grows slowly:* its CO₂ is limited to the night’s store' },
];

export const f = (v: number): string => (Math.round(v * 10) / 10).toString();
export const INK = '#2f2e2b', MUTE = '#6b6a64', RULE = '#d9d4c6', ACC = '#9a4426';
export const TX = (x: number, y: number, s: string, size: number, fill: string, weight = 400, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}">${s}</text>`;
/** _x_ → italic tspans. */
export const ital = (s: string): string => s.replace(/_([^_]+)_/g, '<tspan font-style="italic">$1</tspan>');

/** The marker band: a filter that floods a soft band behind a text element's own box (exact width, no measuring). */
export const markerDef = (id: string, colour = '#f8dc7c'): string =>
  `<filter id="${id}" x="-0.04" y="-0.1" width="1.08" height="1.2" primitiveUnits="objectBoundingBox">
    <feFlood x="-0.03" y="0.14" width="1.06" height="0.84" flood-color="${colour}"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

interface Tok { t: string; hl: boolean }
/** Words of a cell, each with its marker flag (a marked phrase may span several words). */
function toks(s: string): Tok[] {
  const out: Tok[] = [];
  let hl = false;
  for (const w of s.split(' ')) {
    const open = w.startsWith('*'), close = w.endsWith('*');
    if (open) hl = true;
    out.push({ t: w.replace(/\*/g, ''), hl });
    if (close) hl = false;
  }
  return out;
}
const vis = (t: string): number => t.replace(/_/g, '').length;

/** A cell's lines: words wrapped to n characters (| breaks a line); a marked phrase always starts a line, so its band can be drawn from
 *  the line's start. Returns the markup (first baseline y) and the number of lines. */
export function cell(x: number, y: number, s: string, n: number, size: number, lh: number, fill: string, weight: number, mark: string): { svg: string; n: number } {
  const lines: Tok[][] = [];
  let line: Tok[] = [];
  const len = (l: Tok[]): number => l.reduce((a, t, i) => a + vis(t.t) + (i ? 1 : 0), 0);
  toks(s).forEach((t, i, all) => {
    if (t.t === '|') { if (line.length) { lines.push(line); line = []; } return; }
    const startsHl = t.hl && (i === 0 || !all[i - 1].hl);
    if (line.length && (startsHl || len(line) + 1 + vis(t.t) > n)) { lines.push(line); line = []; }
    line.push(t);
  });
  if (line.length) lines.push(line);
  const st = (w: number): string => `style="font-size:${size}px;font-weight:${w};fill:${fill}"`;
  const svg = lines.map((l, k) => {
    const yy = f(y + k * lh);
    const pre = l.filter(t => t.hl).map(t => t.t).join(' '), rest = l.filter(t => !t.hl).map(t => t.t).join(' ');
    if (!pre) return `<text x="${f(x)}" y="${yy}" ${st(weight)}>${ital(rest)}</text>`;
    // the marked words on their band (bold), then the rest of the line after an invisible copy of them
    return `<text x="${f(x)}" y="${yy}" filter="url(#${mark})" ${st(700)}>${ital(pre)}</text>`
      + (rest ? `<text x="${f(x)}" y="${yy}" ${st(weight)}><tspan style="font-weight:700;fill-opacity:0">${ital(pre)}</tspan> ${ital(rest)}</text>` : '');
  }).join('');
  return { svg, n: lines.length };
}
/** The number of lines a cell takes (as cell()). */
export const nLines = (s: string, n: number): number => cell(0, 0, s, n, 16, 20, INK, 400, '').n;
