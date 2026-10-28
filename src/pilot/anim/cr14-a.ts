// Rising CO₂, staging A · "Zoom journey on the slide figures": the Keeling curve and Kimball's clipping on one sheet, then
// the camera glides onto slide figure C14 v1 (the FACE ring), dives into the wheat to C14 v3 (the leaf's A/Cᵢ) and comes back
// out to C14 v5 (the wheat grain). Each figure is the slide's own drawing in its card. Ends on v5 as on the slide.
// Clicks: 1 · curve | 2 · Kimball | 3 · glide to FACE, CO₂ from the pipes ▸ results | 4 · dive into the leaf ▸ 2050 |
// 5 · out to the grain ▸ bars.
import {
  camAt, clock, fd, figCard, placeCard, reveal, setters, slideView, tfStr, view, type Move,
} from './cr-kit';
import {
  drawFinding, drawKeeling, drawPuffs, FIG, findingsSvg, GREENHOUSE, grainAnim, KEEL_D, keelingPanel, kimballClip, leafAnim, maskedPuffsSvg,
  maskPills,
} from './cr14-common';
import type { Staging } from './types';
import { keyLines } from './stage-keys';

const P = 'c14a';
// world layout (stage units)
const KP = { x: 50, y: 40, w: 840, h: 660 };
const KIM = { x: 945, y: 58, w: 600 };
const FX = 960, FY = 452;
const V1 = { x: 2000, y: 70 };
/** Where the camera dives into the wheat of v1's photo (figure units), and v3's scale there. */
const DIVE = { x: 300, y: 170, k: 0.2 };
const V3 = { x: V1.x + DIVE.x - 400 * DIVE.k, y: V1.y + DIVE.y - 300 * DIVE.k, k: DIVE.k };
const V5 = { x: 3300, y: 70 };
const FACE_S = 800 / 1464;

const HOME = view(KP.x + KP.w / 2, 370, 1600);
const MOVES: Move[] = [
  { beat: 1, t0: 0, d: 1.0, to: view(800, 370, 1600) },
  { beat: 2, t0: 0, d: 1.2, to: slideView(V1.x, V1.y) },
  { beat: 3, t0: 0, d: 1.3, to: slideView(V3.x, V3.y, V3.k) },
  // the grain card a little smaller and lower than on the slide: the closing question sits centred above it
  { beat: 4, t0: 0, d: 1.6, to: { s: 0.9, t: [800 - 0.9 * (V5.x + 400), 430 - 0.9 * (V5.y + 300)] } },
];

const BASE: Staging = {
  id: 'a',
  name: 'A · Zoom on the slide figures',
  note: 'Keeling curve and Kimball 1983, then the slide figures: FACE ring (v1) → dive into the leaf (v3) → the grain (v5).',
  holds: [[0], [], [1.9], [1.45], [1.75]],
  svg: () => {
    const keel = keelingPanel(`${P}k`, KP.x, KP.y, KP.w, KP.h);
    return `<g data-k="cam">
      ${keel.svg}
      <g data-k="${P}-kim" opacity="0">${kimballClip(`${P}-kc`, KIM.x, KIM.y, KIM.w).svg}</g>
      ${findingsSvg(`${P}f`, FX, FY, [GREENHOUSE], 'yield gain, 1983')}
      ${figCard(`${P}-v1`, FIG('v1'), V1.x, V1.y, 1, { res: [0, 372, 800, 172] }, 1, maskedPuffsSvg(`${P}`))}
      ${figCard(`${P}-v3`, FIG('v3'), V3.x, V3.y, V3.k, {}, 0)}
      ${figCard(`${P}-v5`, FIG('v5'), V5.x, V5.y)}
    </g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const keel = keelingPanel(`${P}k`, KP.x, KP.y, KP.w, KP.h);
    const leaf = leafAnim(S, S.q(`${P}-v3`)), grain = grainAnim(S, S.q(`${P}-v5`));
    maskPills(S, P, S.q(`${P}-v1`));
    const at = (u: number, v: number): [number, number] => [u * FACE_S, (v - 90) * FACE_S];
    return (beat, t) => {
      const T = clock(beat, t);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T)));
      // 1 · the curve draws
      drawKeeling(S, `${P}k`, keel, Math.min(1, Math.max(0, T(0)) / KEEL_D));
      // 2 · Kimball's clipping, then his result
      S.op(S.q(`${P}-kim`), fd(T(1), 0.75, 0.2));
      S.op(S.q(`${P}f`), fd(T(1), 0.75, 0.2));
      drawFinding(S, `${P}f`, FX, GREENHOUSE, Math.max(0, Math.min(1, (T(1) - 1.1) / 0.9)));
      // 3 · CO₂ from the pipes of the FACE ring; then the 30-year result
      drawPuffs(S, P, at, T(2), 0.7, 420);
      reveal(S, `${P}-v1`, 'res', fd(T(2), 1.95, 0.4));
      // 4 · into the wheat: v1 gives way to v3; then the 2050 points
      const v1o = 1 - fd(T(3), 0.7, 0.45) + fd(T(4), 0.1, 0.4);
      placeCard(S, `${P}-v1`, V1.x, V1.y, 1, Math.min(1, v1o));
      const v3o = fd(T(3), 0.55, 0.45) * (1 - fd(T(4), 0, 0.35));
      placeCard(S, `${P}-v3`, V3.x, V3.y, V3.k, v3o);
      leaf(Math.max(0, Math.min(1, (T(3) - 1.55) / 1.1)), fd(T(3), 2.6, 0.3));
      // 5 · the grain: the bars grow out of the zero line
      grain(Math.max(0, Math.min(1, (T(4) - 1.85) / 1.2)));
    };
  },
};

/** The closing question on the stage, centred above the grain once the motion has finished (lecturer, 29 Oct 2026: on
 *  the stage only the closing question). */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(4, ['More CO₂ raised photosynthesis:', 'what else sets how much grain a field yields?'], 800, 57, { size: 44, t0: 3.0 }),
] };
