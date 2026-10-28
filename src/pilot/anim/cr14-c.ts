// Rising CO₂, staging C · "Real images first": Charles David Keeling at the Mauna Loa Observatory in 1997, under the plaque
// with his curve (photo John Miller, NOAA, public domain), beside the record drawn from the data; Kimball's clipping; the
// SoyFACE photos of slide figure C14 v6 (soybean C₃, maize C₄), their results revealed; a dive into the soybean to slide
// figure v3; slide figure v4 (Myers et al. 2014 Fig. 1, as published), the wheat points ringed. Ends on v4.
// Clicks: 1 · curve | 2 · Kimball | 3 · glide to SoyFACE ▸ results | 4 · dive into the soybean ▸ 2050 | 5 · glide to the
// nutrient figure ▸ wheat ringed.
import {
  camAt, clock, fd, figCard, glyph, imageClip, pill, placeCard, put, reveal, setters, slideView, smooth, T, tfStr, view, type Move,
} from './cr-kit';
import {
  drawFinding, drawKeeling, FIG, findingsSvg, GREENHOUSE, IMG, KEEL_D, keelingPanel, kimballClip, leafAnim,
} from './cr14-common';
import type { Staging } from './types';

const P = 'c14c';
// beat 1: the photo (window of the 1400 × 811 image: Keeling and the plaque) and the drawn record
const PH = { x: 40, y: 58, w: 690, win: [30, 0, 870, 811] };
const KP = { x: 770, y: 40, w: 800, h: 660 };
// beat 2: Kimball
const KIM = { x: 2180, y: 96, w: 640 };
const F2 = { x: 2200, y: 470 };
// beats 3–5: slide figures v6, v3 (dived into v6's soybean photo), v4
const V6 = { x: 3400, y: 70 };
const DIVE = { x: 200, y: 190, k: 0.2 };
const V3 = { x: V6.x + DIVE.x - 400 * DIVE.k, y: V6.y + DIVE.y - 300 * DIVE.k, k: DIVE.k };
const V4 = { x: 4700, y: 70 };
/** Wheat zinc, iron, protein in v4's figure units: Myers Fig. 1 drawn at x 70, y 70, 0.9 px per image px (zero line at
 *  image y 172, 9.9 px per %). */
const WHEAT = [{ u: 69, val: 9.3 }, { u: 93, val: 5.1 }, { u: 116, val: 6.3 }].map(w => [70 + w.u * 0.9, 70 + (172 + w.val * 9.9) * 0.9] as [number, number]);

const HOME = view(800, 370, 1600);
const MOVES: Move[] = [
  { beat: 1, t0: 0, d: 1.0, to: view(2500, 370, 1600) },
  { beat: 2, t0: 0, d: 1.2, to: slideView(V6.x, V6.y) },
  { beat: 3, t0: 0, d: 1.3, to: slideView(V3.x, V3.y, V3.k) },
  { beat: 4, t0: 0, d: 1.6, to: slideView(V4.x, V4.y) },
];

export const STAGING: Staging = {
  id: 'c',
  name: 'C · Real images first',
  note: 'Keeling at Mauna Loa (photo) beside the record; Kimball 1983; SoyFACE photos (v6) → dive into the soybean (v3) → Myers Fig. 1 (v4).',
  holds: [[0], [], [1.3], [1.45], [1.75]],
  svg: () => {
    const ph = imageClip(`${P}-ph`, IMG.mlo, PH.x, PH.y, PH.w, { win: PH.win, rot: 0, seed: 71, m: 12 });
    const keel = keelingPanel(`${P}k`, KP.x, KP.y, KP.w, KP.h);
    const rings = WHEAT.map((_, i) => glyph(`${P}-ring${i}`, '<circle class="cra-ring" cx="0" cy="0" r="10"/>')).join('');
    return `<g data-k="cam">
      ${ph.svg}
      ${pill(`${P}-pk`, PH.x + 200, PH.y + ph.h - 70, 'Charles David Keeling', ph.at(420, 470))}
      ${pill(`${P}-pp`, PH.x + 548, PH.y + 52, 'Keeling Building plaque', ph.at(724, 200))}
      ${T(PH.x + PH.w, PH.y + ph.h + 24, 'photo: J. Miller, NOAA, Mauna Loa Observatory, 1997 · public domain', 'cra-crd', 'end')}
      ${keel.svg}
      ${kimballClip(`${P}-kc`, KIM.x, KIM.y, KIM.w).svg}
      ${findingsSvg(`${P}f`, F2.x, F2.y, [GREENHOUSE], 'yield gain, 1983')}
      ${figCard(`${P}-v6`, FIG('v6'), V6.x, V6.y, 1, { res: [0, 326, 800, 196] })}
      ${figCard(`${P}-v3`, FIG('v3'), V3.x, V3.y, V3.k, {}, 0)}
      ${figCard(`${P}-v4`, FIG('v4'), V4.x, V4.y, 1, {}, 1, rings)}
    </g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const keel = keelingPanel(`${P}k`, KP.x, KP.y, KP.w, KP.h);
    const leaf = leafAnim(S, S.q(`${P}-v3`));
    return (beat, t) => {
      const T_ = clock(beat, t);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T_)));
      S.op(S.q(`${P}-pk`), 1);
      S.op(S.q(`${P}-pp`), 1);
      drawKeeling(S, `${P}k`, keel, Math.min(1, Math.max(0, T_(0)) / KEEL_D));
      drawFinding(S, `${P}f`, F2.x, GREENHOUSE, Math.max(0, Math.min(1, (T_(1) - 1.0) / 0.9)));
      // 3 · SoyFACE: the results under the photos
      reveal(S, `${P}-v6`, 'res', fd(T_(2), 1.35, 0.4));
      // 4 · into the soybean
      placeCard(S, `${P}-v6`, V6.x, V6.y, 1, Math.min(1, 1 - fd(T_(3), 0.7, 0.45) + fd(T_(4), 0.1, 0.4)));
      placeCard(S, `${P}-v3`, V3.x, V3.y, V3.k, fd(T_(3), 0.55, 0.45) * (1 - fd(T_(4), 0, 0.35)));
      leaf(Math.max(0, Math.min(1, (T_(3) - 1.55) / 1.1)), fd(T_(3), 2.6, 0.3));
      // 5 · the wheat points ringed one by one
      WHEAT.forEach((w, i) => {
        const u = Math.max(0, Math.min(1, (T_(4) - 1.85 - i * 0.35) / 0.5));
        put(S, `${P}-ring${i}`, w, fd(u, 0, 0.3), 0.6 + 0.4 * smooth(u * 2));
      });
    };
  },
};
