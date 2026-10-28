// Rising CO₂, staging D · "C₃ and C₄ side by side": the record and Kimball's clipping, then slide figure C14 v9 (the drawn
// C₃ / C₄ table: wheat, rice vs maize, sorghum) fills in row by row, so every finding is read for both crop types at once:
// yield and stomata (open field), CO₂ at RuBisCO and oxygenation (the leaf), zinc and iron (the grain). Ends on v9 whole.
// Clicks: 1 · curve | 2 · Kimball | 3 · glide to the table ▸ yield, stomata | 4 · RuBisCO, oxygenation | 5 · zinc, iron.
import { camAt, clock, fd, figCard, reveal, setters, slideView, tfStr, view, type Move } from './cr-kit';
import { drawFinding, drawKeeling, FIG, findingsSvg, GREENHOUSE, KEEL_D, keelingPanel, kimballClip } from './cr14-common';
import type { Staging } from './types';
import { keyLines } from './stage-keys';

const P = 'c14d';
const KP = { x: 50, y: 40, w: 840, h: 660 };
const KIM = { x: 945, y: 58, w: 600 };
const FX = 960, FY = 452;
const V9 = { x: 2000, y: 70 };
/** v9's five rows (figure units: row i centred at y 236 + 68 i): RuBisCO, oxygenation, stomata, yield, zinc and iron. */
const ROW = (i: number): number[] => [14, 236 + i * 68 - 35, 772, 70];
const ROWS = { r0: ROW(0), r1: ROW(1), r2: ROW(2), r3: ROW(3), r4: ROW(4) };

const HOME = view(KP.x + KP.w / 2, 370, 1600);
const MOVES: Move[] = [
  { beat: 1, t0: 0, d: 1.0, to: view(800, 370, 1600) },
  { beat: 2, t0: 0, d: 1.2, to: slideView(V9.x, V9.y) },
  // the table a little smaller and lower for its last row: the closing question sits centred above it
  { beat: 4, t0: 0, d: 1.0, to: { s: 0.9, t: [800 - 0.9 * (V9.x + 400), 430 - 0.9 * (V9.y + 300)] } },
];

const BASE: Staging = {
  id: 'd',
  name: 'D · C₃ and C₄ side by side',
  note: 'Keeling curve and Kimball 1983, then the C₃ / C₄ table (v9) fills in row by row: yield and stomata, RuBisCO, grain.',
  holds: [[0], [], [1.3], [], []],
  svg: () => {
    const keel = keelingPanel(`${P}k`, KP.x, KP.y, KP.w, KP.h);
    return `<g data-k="cam">
      ${keel.svg}
      <g data-k="${P}-kim" opacity="0">${kimballClip(`${P}-kc`, KIM.x, KIM.y, KIM.w).svg}</g>
      ${findingsSvg(`${P}f`, FX, FY, [GREENHOUSE], 'yield gain, 1983')}
      ${figCard(`${P}-v9`, FIG('v9'), V9.x, V9.y, 1, ROWS)}
    </g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const keel = keelingPanel(`${P}k`, KP.x, KP.y, KP.w, KP.h);
    return (beat, t) => {
      const T = clock(beat, t);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T)));
      drawKeeling(S, `${P}k`, keel, Math.min(1, Math.max(0, T(0)) / KEEL_D));
      S.op(S.q(`${P}-kim`), fd(T(1), 0.75, 0.2));
      S.op(S.q(`${P}f`), fd(T(1), 0.75, 0.2));
      drawFinding(S, `${P}f`, FX, GREENHOUSE, Math.max(0, Math.min(1, (T(1) - 1.1) / 0.9)));
      // 3 · open field: yield, then stomata; 4 · the leaf: CO₂ at RuBisCO, oxygenation; 5 · the grain: zinc and iron
      reveal(S, `${P}-v9`, 'r3', fd(T(2), 1.35, 0.4));
      reveal(S, `${P}-v9`, 'r2', fd(T(2), 1.95, 0.4));
      reveal(S, `${P}-v9`, 'r0', fd(T(3), 0.1, 0.4));
      reveal(S, `${P}-v9`, 'r1', fd(T(3), 0.7, 0.4));
      reveal(S, `${P}-v9`, 'r4', fd(T(4), 0.1, 0.4));
    };
  },
};

/** The closing question on the stage, centred above the grain once the motion has finished (lecturer, 29 Oct 2026: on
 *  the stage only the closing question). */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(4, ['More CO₂ raised photosynthesis:', 'what else sets how much grain a field yields?'], 800, 57, { size: 44, t0: 3.0 }),
] };
