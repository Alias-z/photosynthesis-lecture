// From leaf to loaf, staging A · "Zoom along the yield chain": the stage is slide figure C15 v3 (the yield chain,
// conversion lit) in its card. Each beat dives into one station of the chain, where that station's slide figure waits at a
// fifth of its size, and comes back out: sunlight → v9 (one soybean field, to scale); back on the chain, v3 gives way to
// v4 (interception and harvest index lit); conversion → v7 (the bypass); harvest index → v5 (wheat shoot, sucrose
// flowing) → its grain → v6 (endosperm SEM); out to v3 as on the slide, with the question. Beats CR15A: the dive into
// the energy cascade (v2) was cut (lecturer, 29 Oct 2026): slide C4e shows it.
// Clicks: 1 · into sunlight ▸ squares | 2 · back ▸ breeding's two links | 3 · into conversion ▸ bypass |
// 4 · into harvest index (phloem) ▸ into the grain ▸ SEM ▸ back to the chain.
import { camAt, clock, fd, figCard, placeCard, reveal, setters, slideView, tfStr, type Move } from './cr-kit';
import { FIG, phloemAnim, squaresAnim, STATION, V6_HIDE, V7_HIDE } from './cr15-common';
import type { Staging } from './types';
import { keyLines } from './stage-keys';

const P = 'c15a';
const K = 0.2;
/** A sub-figure waiting at a station (figure point x, y of the chain), K of its size. */
const at = (x: number, y: number, k = K, o: [number, number] = [0, 0]): { x: number; y: number; k: number } =>
  ({ x: o[0] + x - 400 * k, y: o[1] + y - 300 * k, k });
const V9 = at(STATION.sun, 226), V7 = at(STATION.conv, 216), V5 = at(STATION.hi, 216);
/** v6 waits in v5's grain (v5 figure point 612, 260). */
const V6 = at(V5.x + 612 * K, V5.y + 260 * K, K * K);
const view = (c: { x: number; y: number; k: number }) => slideView(c.x, c.y, c.k);
const HOME = slideView(0, 0);
const MOVES: Move[] = [
  { beat: 0, t0: 0, d: 1.2, to: view(V9) },
  { beat: 1, t0: 0, d: 1.0, to: HOME },
  { beat: 2, t0: 0, d: 1.2, to: view(V7) },
  { beat: 3, t0: 0, d: 1.0, to: HOME }, { beat: 3, t0: 1.1, d: 1.1, to: view(V5) },
  { beat: 3, t0: 3.7, d: 1.2, to: view(V6) },
  { beat: 3, t0: 6.5, d: 1.5, to: HOME },
];
const cl = (v: number): number => Math.max(0, Math.min(1, v));

const BASE: Staging = {
  id: 'a',
  name: 'A · Zoom along the yield chain',
  note: 'The slide’s yield chain (v3): dive into each station to its figure (v9, v7, v5 → v6) and back; v3 → v4 for breeding.',
  holds: [[0, 1.3], [1.05], [1.3], [3.6, 4.95, 6.4]],
  svg: () => `<g data-k="cam">
    ${figCard(`${P}-v3`, FIG('v3'), 0, 0)}
    ${figCard(`${P}-v4`, FIG('v4'), 0, 0, 1, {}, 0)}
    ${figCard(`${P}-v9`, FIG('v9'), V9.x, V9.y, V9.k, {}, 0)}
    ${figCard(`${P}-v7`, FIG('v7'), V7.x, V7.y, V7.k, V7_HIDE, 0)}
    ${figCard(`${P}-v5`, FIG('v5'), V5.x, V5.y, V5.k, {}, 0)}
    ${figCard(`${P}-v6`, FIG('v6'), V6.x, V6.y, V6.k, V6_HIDE, 0)}
  </g>`,
  bind(stage) {
    const S = setters(stage);
    const squares = squaresAnim(S, S.q(`${P}-v9`)), phloem = phloemAnim(S, S.q(`${P}-v5`));
    return (beat, t) => {
      const T = clock(beat, t), T0 = T(0), T1 = T(1), T2 = T(2), T3 = T(3);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T)));
      // the chain: out on each dive, back on each return; v3 → v4 (beat 2), v4 → v3 at the end
      const chain = cl(1 - fd(T0, 0.6, 0.5) + fd(T1, 0.1, 0.4) - fd(T2, 0.6, 0.5)
        + fd(T3, 0.1, 0.4) - fd(T3, 1.65, 0.5) + fd(T3, 7.0, 0.5));
      const mix = fd(T1, 1.1, 0.5) - fd(T3, 7.2, 0.5);
      placeCard(S, `${P}-v3`, 0, 0, 1, chain * (1 - mix));
      placeCard(S, `${P}-v4`, 0, 0, 1, chain * mix);
      // 1 · sunlight: the field's squares
      placeCard(S, `${P}-v9`, V9.x, V9.y, V9.k, cl(fd(T0, 0.5, 0.5) - fd(T1, 0, 0.4)));
      squares(cl((T0 - 1.4) / 1.8));
      // 3 · conversion engineered: the bypass, then the field numbers
      placeCard(S, `${P}-v7`, V7.x, V7.y, V7.k, cl(fd(T2, 0.5, 0.5) - fd(T3, 0, 0.4)));
      reveal(S, `${P}-v7`, 'box', fd(T2, 1.35, 0.4));
      reveal(S, `${P}-v7`, 'num', fd(T2, 1.85, 0.4));
      // 4 · harvest index: sucrose to the grain; into the grain; back to the chain
      placeCard(S, `${P}-v5`, V5.x, V5.y, V5.k, cl(fd(T3, 1.6, 0.5) - fd(T3, 4.25, 0.45) + fd(T3, 6.5, 0.3) - fd(T3, 6.95, 0.4)));
      phloem(Math.min(T3, 3.6) - 1.7);
      placeCard(S, `${P}-v6`, V6.x, V6.y, V6.k, cl(fd(T3, 4.1, 0.5) - fd(T3, 6.5, 0.4)));
      (['d10', 'd15', 'd20', 'lab', 'mat'] as const).forEach((k, i) => reveal(S, `${P}-v6`, k, fd(T3, 5.0 + i * 0.3, 0.3)));
    };
  },
};

/** The closing question on the stage, centred under the chain once the motion has finished (lecturer, 29 Oct 2026: on
 *  the stage only the closing question). */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(3, ['Which link of the chain would you improve?'], 800, 600, { size: 44, t0: 3.0 }),
] };
