// The overview slide's page figure w (slide C10o): one big summary table across the whole page, no reading column
// (lecturer, 30 Oct 2026: "slide 20 should be a big table summarizing; remove the right-side text so the table occupies
// the entire slide; pictures of representative plants of each type; the strategy is what matters most: how they do it").
// Columns in the climate order of layout b (cool, moist → hot, dry): C₃ · C₂ · C₄ · CAM. Rows: a photo of a representative
// plant beside its leaf section, with examples under them, the share of species, how it copes (bold, on a band: the row that
// matters most), what it gains, what it costs; under the table, "C₂, C₄ and CAM all evolved from C₃, many times".
// The cell texts and their sources are figs/ov-table.ts's (shared with the text-only table, figure e and 'ove');
// photos and leaf sections as anim/ov-b.ts (credited at the bottom). viewBox 1340 × 590: the wide figure box at
// 1 unit per px, so every size below is the size on the page.
import { COLS } from './ov-table';
import { KINDS } from '../anim/ov-b';

const W = 1340, H = 590, LW = 168, CW = (W - LW) / 4, PAD = 9;
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const INK = '#2f2e2b', MUTE = '#6b6a64', RULE = '#d9d4c6', ACC = '#9a4426';
const TX = (x: number, y: number, s: string, size: number, fill: string, weight = 400, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}">${s}</text>`;
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;

/** Words wrapped to at most n visible characters a line (a tspan counts as its text). */
function wrap(s: string, n: number): string[] {
  const words = s.match(/<tspan[^>]*>[^<]*<\/tspan>\S*|\S+/g) ?? [];
  const len = (w: string): number => w.replace(/<[^>]+>/g, '').length;
  const out: string[] = [];
  let line = '';
  for (const w of words) {
    if (line && len(line) + 1 + len(w) > n) { out.push(line); line = w; } else line = line ? `${line} ${w}` : w;
  }
  if (line) out.push(line);
  return out;
}

/** Row texts per column, from the shared table (lines joined, then wrapped to this page's wider columns). */
const join = (ls: string[]): string => ls.join(' ');
const HOW = COLS.map(c => join(c.cells[0])), GAIN = COLS.map(c => join(c.cells[1])), COST = COLS.map(c => join(c.cells[2]));
const EG = COLS.map(c => join(c.cells[3]));
const SHARE = ['≈ 90 % of species', 'rare: C₃–C₄ intermediates, a step on the way to C₄', '≈ 3 % of species, yet ≈ ¼ of land photosynthesis', '≈ 6 % of species'];
const WHERE = ['cool to warm, moist', 'warm, sunny, dry', 'hot, sunny grasslands', 'deserts, epiphytes'];

const CELL = 18, LH = 23, NB = 27, NR = 29;   // cell size, line height, characters a line (bold, regular)
const cx = (i: number): number => LW + i * CW;

/** A picture box: the image's window [centre x, centre y, width] (image px) shown in the box, cropped, never stretched. */
function pic(id: string, href: string, iw: number, ih: number, win: [number, number, number], x: number, y: number, w: number, h: number): string {
  const ww = Math.min(win[2], iw, (ih * w) / h), wh = (ww * h) / w, s = w / ww;
  const x0 = Math.max(0, Math.min(iw - ww, win[0] - ww / 2)), y0 = Math.max(0, Math.min(ih - wh, win[1] - wh / 2));
  return `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8"/></clipPath>
    <image href="${href}" x="${f(x - x0 * s)}" y="${f(y - y0 * s)}" width="${f(iw * s)}" height="${f(ih * s)}" clip-path="url(#${id})" preserveAspectRatio="none"/>
    <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8" style="fill:none;stroke:#cfc8b6;stroke-width:1"/>`;
}

export function draw(): string {
  // rows: [label, height]; the picture row's height is set by its boxes and the examples line under them
  const PH = 122, headH = 66, picH = PH + 32;
  const rowsTxt: Array<[string, string[][], boolean, string]> = [
    ['Share of species', SHARE.map(s => wrap(s, NR)), false, INK],
    ['How it copes', HOW.map(s => wrap(s, NB)), true, INK],
    ['What it gains', GAIN.map(s => wrap(s, NR)), false, INK],
    ['What it costs', COST.map(s => wrap(s, NR)), false, MUTE],
  ];
  let y = headH + 6;
  const yPic = y; y += picH;
  const rowY = rowsTxt.map(([, cells]) => { const y0 = y; y += Math.max(...cells.map(c => c.length)) * LH + 2 * PAD + 2; return y0; });
  const bottom = y;
  const rule = (yy: number): string => `<path d="M0,${f(yy)} H${W}" style="stroke:${RULE};stroke-width:1.4"/>`;
  // the strategy row on a band
  const iHow = 1, howH = (rowY[iHow + 1] ?? bottom) - rowY[iHow];
  const band = `<rect x="0" y="${f(rowY[iHow] + 1)}" width="${W}" height="${f(howH - 2)}" rx="6" style="fill:#f6ece1"/>`;
  const heads = COLS.map((c, i) => `<rect x="${f(cx(i) + 4)}" y="0" width="${f(CW - 8)}" height="${headH}" rx="12" style="fill:${c.tint}"/>
      ${TX(cx(i) + 14, 36, c.name, 32, INK, 700)}${TX(cx(i) + 14, 58, WHERE[i], 16, MUTE)}`).join('');
  const bw = (CW - 2 * PAD - 8) / 2;
  const pics = KINDS.map((k, i) => {
    const x = cx(i) + PAD + 2;
    return pic(`cw-p${i}`, k.photo.href, k.photo.w, k.photo.h, k.win, x, yPic + 8, bw, PH)
      + pic(`cw-s${i}`, k.sec.href, k.sec.w, k.sec.h, [k.secC[0], k.secC[1], k.secD], x + bw + 8, yPic + 8, bw, PH)
      + TX(x, yPic + PH + 28, EG[i], 15, INK);
  }).join('');
  const labs = [TX(0, yPic + 30, 'Plant and', CELL, MUTE, 700), TX(0, yPic + 52, 'leaf section', CELL, MUTE, 700),
    ...rowsTxt.map(([l, , b], r) => TX(0, rowY[r] + PAD + CELL, l, CELL, b ? ACC : MUTE, 700))].join('');
  const cells = rowsTxt.map(([, cs, b, fill], r) => cs.map((ls, i) =>
    ls.map((l, k) => TX(cx(i) + PAD + 2, rowY[r] + PAD + CELL + k * LH, l, CELL, fill, b ? 700 : 400)).join('')).join('')).join('');
  const rules = [yPic, ...rowY, bottom].map(rule).join('');
  // evolution, one line: a rust arrow from the C₃ column to the words "C₂, C₄ and CAM all evolved from C₃, many times"
  const ya = bottom + 26, x1 = cx(0) + CW / 2, x2 = cx(1) + PAD;
  const evo = `<path d="M${f(x1)},${ya - 6} H${f(x2)}" style="fill:none;stroke:#a9532f;stroke-width:2.8;stroke-linecap:round"/>
    <path d="M${f(x2 - 12)},${ya - 13} L${f(x2 + 2)},${ya - 6} L${f(x2 - 12)},${ya + 1}" style="fill:none;stroke:#a9532f;stroke-width:2.8;stroke-linecap:round;stroke-linejoin:round"/>
    ${TX(x2 + 14, ya, 'C₂, C₄ and CAM all evolved from C₃, many times', 18, ACC, 700)}`;
  const cr = (yy: number, s: string): string => TX(0, yy, s, 12, MUTE);
  const credits = cr(H - 18, `Photos (Wikimedia Commons): wheat, Hans Hillewaert (CC BY-SA 3.0) · wild rocket, ${it('Diplotaxis tenuifolia')}, Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0) · maize, High Contrast (CC BY 3.0 DE) · ${it('Agave americana')}, Fawaz.tairou (CC BY 4.0)`)
    + cr(H - 3, `Leaf sections: ${it('Steinchisma laxum')} (C₃) and ${it('Homolepis aturensis')} (C₂), Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0); maize (C₄) and a succulent leaf (CAM), Berkshire Community College Bioscience Image Library (CC0)`);
  return `<svg class="fig-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="One table across the page compares C₃, C₂, C₄ and CAM photosynthesis, in the order of their climates from cool and moist to hot and dry. For each: a photo of a representative plant (wheat, wild rocket, maize, agave) beside its leaf section, with examples; its share of species; how it copes with scarce CO₂ (highlighted: C₃ uses the CO₂ that diffuses in; C₂ traps the CO₂ that photorespiration releases, in the bundle sheath; C₄ pumps CO₂ into the bundle sheath; CAM takes CO₂ in at night, stores it as malic acid and uses it by day); what it gains; what it costs. Under the table: C₂, C₄ and CAM all evolved from C₃, many times.">
    ${band}${heads}${rules}${pics}${labs}${cells}${evo}${credits}</svg>`;
}
