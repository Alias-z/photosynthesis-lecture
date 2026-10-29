// 'ovd' · How plants cope with scarce CO₂ (slide C10o), layout d: from cards to table (lecturer, 29 Oct 2026: "a
// summarized table … the strategy is what matters most"; no CO₂ gauge anywhere).
// - Beat 1, the problem, as in ovc (anim/ov-c.ts): CO₂ characters through the 3D stoma to RuBisCO; it closes, fewer come,
//   O₂ crowds in.
// - Beats 2–5, as ovb: a climate band across the middle; each type a card pinned where it lives (C₃, C₄ above; C₂, CAM
//   below), with its plant photo, its name and how it copes.
// - Beat 6 (its own caption, below): in one eased glide the cards become the 4 columns of a table under the band, now at
//   the top; then the shares of species, what each gains, what each costs, row by row.
// - Beat 7: arrows C₃ → C₂ → C₄ and C₃ → CAM across the column heads, "evolved from C₃, many times"; the question.
// Photos as in ov-b.ts (Wikimedia Commons), cropped, never stretched. The page figure: figs/cov-d.ts.
import { OV } from './beats-ov';
import { actor, ease, f, lerp, makeScene, T, type Api, type V } from './co2-kit';
import { bandDefs } from './ov-b';
import { arrowsFrame, arrowsSvg, colX, COLS, lines, photoBox, problemFrame, PROBLEM_HOLDS, problemSvg, ROW_NAMES } from './ov-c';
import type { Beat, Staging } from './types';

const P = 'ovd';

/** The captions: those of OV, with the table's beat before the last. */
export const OVD_BEATS: Beat[] = [
  ...OV.slice(0, 5),
  { tag: 'Gains and costs', say: 'Each strategy has its price. C₄ spends 2 extra ATP on every CO₂ it pumps; CAM loses very little water but grows slowly, limited by what it stores at night.', cite: [OV[3].cite[0], OV[4].cite[1]] },
  OV[5],
];

/* the band: across the middle, then (after the glide) at the top */
const BX = 30, BW = 1540, BY = 340, BH = 40, BY_END = 8;
const PIN: Record<string, number> = { c3: 180, c2: 470, c4: 800, cam: 1400 };
const CARD_X: Record<string, number> = { c3: 15, c2: 225, c4: 635, cam: 1225 };
const ABOVE: Record<string, boolean> = { c3: true, c2: false, c4: true, cam: false };
/** The card: width, height; in the table its top sits at TOP; the gains and costs cells under it. */
const CW = 330, CH = 248, TOP = 108;
const CELL: Array<[number, number]> = [[360, 96], [462, 96]];
const start = (id: string): V => [CARD_X[id], ABOVE[id] ? BY - 16 - CH : BY + BH + 16];
const end = (j: number): V => [colX(j) + 5, TOP];

function svg(): string {
  const band = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="${BH / 2}" fill="url(#${P}-band)" style="stroke:#d3c9ad;stroke-width:1.2"/>
    ${T(BX + 18, BY + 27, 'cool, moist', 'co2k-zl', 'start')}${T(1080, BY + 27, 'hot, sunny', 'co2k-zl')}${T(BX + BW - 18, BY + 27, 'hot, dry', 'co2k-zl', 'end')}`;
  const cards = COLS.map(c => {
    const q = `${P}-${c.id}`, [x, y] = start(c.id), pin = PIN[c.id] - x, above = ABOVE[c.id];
    const stem = `<path d="M${f(pin)},${above ? CH : 0}V${above ? CH + 16 + BH / 2 : -16 - BH / 2}" style="fill:none;stroke:#8a877d;stroke-width:2"/>
      <circle cx="${f(pin)}" cy="${above ? CH + 16 + BH / 2 : -16 - BH / 2}" r="5.5" style="fill:#3d3d3a;stroke:#fffdf8;stroke-width:2"/>`;
    void y;
    const body = `<rect class="co2k-card" x="0" y="0" width="${CW}" height="${CH}" rx="14"/>
      ${photoBox(`${q}-pc`, c.kind, 12, 12, 138, 96)}
      ${T(164, 50, c.name, 'co2k-zl', 'start', ' style="font-size:44px"')}
      ${T(12, 134, c.credit, 'co2k-cr', 'start', ' style="font-size:14px"')}
      <path d="M16,146H${CW - 16}" style="fill:none;stroke:#e4dfd2;stroke-width:1.4"/>
      ${lines(18, 180, c.how, 27, 21)}`;
    return actor(q, actor(`${q}-stem`, stem) + body + actor(`${q}-sh`, lines(164, 74, c.share, 17, 15)));
  }).join('');
  const cells = COLS.map((c, j) => [c.gain, c.cost].map((ls, i) => {
    const x = colX(j) + 5, [y, h] = CELL[i];
    return actor(`${P}-${c.id}-r${i + 1}`, `<rect class="co2k-card" x="${x}" y="${y}" width="${CW}" height="${h}" rx="14"/>${lines(x + 18, y + 38, ls, 27, 21)}`);
  }).join('')).join('');
  const rowY = [TOP + 214, CELL[0][0] + 55, CELL[1][0] + 55];
  const rowNames = ROW_NAMES.map((r, i) => actor(`${P}-rn${i}`, T(30, rowY[i], r, 'co2k-zl', 'start', ' style="font-size:20px"'))).join('');
  return `<defs>${bandDefs(`${P}-band`)}</defs>
    ${problemSvg(P)}
    ${actor(`${P}-band`, band)}${cards}${cells}${rowNames}${arrowsSvg(P)}
    ${actor(`${P}-cr5`, T(1586, 732, 'Plant photos: Wikimedia Commons', 'co2k-cr', 'end', ' style="font-size:14px"'))}`;
}

const from = (beat: number, t: number, b: number, t0: number, t1 = t0 + 0.9): number => (beat > b ? 1 : beat === b ? ease(t, t0, t1) : 0);

function frame(a: Api, beat: number, t: number): void {
  if (beat === 0) problemFrame(a, P, t, 1);
  if (beat === 1) problemFrame(a, P, 99, 1 - ease(t, 0.1, 0.9));
  /* the glide (beat 6): the band and the cards together, in one eased move */
  const g = beat > 5 ? 1 : beat === 5 ? ease(t, 0.2, 2.4) : 0;
  const bandOn = from(beat, t, 1, 1.0, 1.9);
  if (bandOn > 0) a.put(`${P}-band`, [0, lerp(0, BY_END - BY, g)], bandOn);
  COLS.forEach((c, j) => {
    const b = j + 1, t0 = j === 0 ? 2.1 : 0.2, q = `${P}-${c.id}`, on = from(beat, t, b, t0);
    if (on <= 0) return;
    const s = start(c.id), e = end(j);
    a.put(q, [lerp(s[0], e[0], g), lerp(s[1], e[1], g)], on);
    if (j === 0) a.op(`${P}-cr5`, on);
    a.op(`${q}-stem`, beat > 5 ? 0 : beat === 5 ? 1 - ease(t, 0.2, 1.0) : 1);
    a.op(`${q}-sh`, from(beat, t, 5, 2.7));
    a.op(`${q}-r1`, from(beat, t, 5, 3.8));
    a.op(`${q}-r2`, from(beat, t, 5, 5.0));
  });
  a.op(`${P}-rn0`, from(beat, t, 5, 2.7)); a.op(`${P}-rn1`, from(beat, t, 5, 3.8)); a.op(`${P}-rn2`, from(beat, t, 5, 5.0));
  arrowsFrame(a, P, beat === 6, t);
}

export const STAGING: Staging = {
  ...makeScene({
    id: 'ovd', name: 'ovd · cards on the climate band glide into the strategy table', beats: OVD_BEATS,
    note: 'The problem without a gauge, as ovc; then, as ovb, cards pinned on a climate band (photo, name, how it copes); in one eased glide the cards become the columns of a table under the band, then the shares, gains and costs fade in row by row; arrows from C₃',
    holds: [PROBLEM_HOLDS, [2.0], [], [], [], [2.6, 4.9], [2.7]],
    svg, frame,
  }),
  keys: [
    { beat: 6, text: 'How does a C₂ plant', x: 800, y: 628, size: 44 },
    { beat: 6, text: 'trap its CO₂?', x: 800, y: 676, size: 44 },
  ],
};
