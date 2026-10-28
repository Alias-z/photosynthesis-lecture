// C1 animation, staging A · "The slide's wheel as the map". Opens on slide C1's figure v1 in its card. Beat 1: the
// camera draws back so the wheel sits on the left as an empty map (its molecules turn to "?"), and the lab appears on the
// right (the lollipop photo, the three portraits); a second click feeds ¹⁴CO₂ and drops the algae into alcohol. Beat 2:
// the 30 s film, then (click) the 5 s film, then (click) under one second: Bassham's flow tube, the 5 s film veiled but
// for 3-PGA, the readout "over 80 %". Beat 3: the spots get their colours and fly to their places on the map; the
// slide's wheel fills in and the camera returns to the slide. Beat 4: the count per 3 CO₂ on the slide's wheel.
// Story pieces: cb1-common.ts.
import { ANIM_P, countItems, filmItems, flowClip, lab, mapWheel, onSlide, pgaMeter, pulseItems, slideC1, timerItems, WP } from './cb1-common';
import { build, figOnStage, hide, type Item, type Key, pill, shadowDef, show, textK, textScaler, type V } from './cb-kit';

const P = `${ANIM_P}a`;
const D = [3.8, 3.4, 3.9, 4.8];
const S = [0, 3.8, 7.2, 11.1];
/** The view with the wheel aside, on the left third, as a map. */
const ASIDE = { x: 1428, y: 370, s: 0.7 };
/** Scene point → stage point with the camera aside. */
const aside = (q: V): V => [800 + ASIDE.s * (q[0] - ASIDE.x), 370 + ASIDE.s * (q[1] - ASIDE.y)];

// the slide figure and the map: cross-faded (both drawn by the same wheel function, at the slide's place)
const slide: Item = { k: 'slide', svg: figOnStage(slideC1(`${P}f`)), keys: [{ o: 1 }, hide(0.2, 0.5), show(S[2] + 2.3, 0.5)] };
const map: Item = { k: 'map', svg: figOnStage(mapWheel(`${P}m`)), keys: [{ o: 0 }, show(0.2, 0.5), hide(S[2] + 2.5, 0.4)] };
// "?" in the molecules' places (sized for the aside view: 22 px on the stage)
const qs: Item[] = (['rubp', 'pga', 'tp'] as const).map((m, i) => {
  const c = onSlide(WP[m]);
  return { k: `q-${m}`, svg: pill('?', { size: 32, w: 76 }), keys: [{ x: c[0], y: c[1], o: 0 }, show(0.7 + i * 0.08, 0.25), hide(S[2] + 1.9, 0.25)] };
});

// the lab, on the right
const L = lab(P, { cx: 1080, cy: 300, w: 540, G0: 1.45, inAt: 0.8, outAt: S[1] });

// the films and the readouts, on the right
const FILM_C: V = [1000, 318];
const films = filmItems(P, FILM_C, 460, { in30: S[1] + 0.1, to5: S[1] + 0.8, sub1: S[1] + 1.9, back30: S[2] + 0.05, out: S[2] + 2.0 });
const timer = timerItems(P, [1000, 86], { in30: S[1] + 0.1, to5: S[1] + 0.8, sub1: S[1] + 1.9, out: S[2] });
const flow = flowClip(P, [1420, 330], 230, { in: S[1] + 2.0, out: S[2] });
const meter = pgaMeter(P, [1000, 664], 300, { in: S[1] + 2.0, fill: S[1] + 2.2, out: S[2] });

// beat 3: the chips fly from their spots on the 30 s film to the map
const chips: Item[] = (['pga', 'tp', 'rubp'] as const).map((m, i) => {
  const from = films.spot(m), toP = aside(onSlide(WP[m]));
  const a = S[2] + 0.95 + i * 0.12;
  const keys: Key[] = [{ x: from[0], y: from[1] - 46, o: 0, s: 1 }, show(S[2] + 0.55 + i * 0.08, 0.25), { at: a, d: 1.0, x: toP[0], y: toP[1], s: 0.92 }, hide(S[2] + 2.55, 0.3)];
  return { k: `chip-${m}`, layer: 'hud', svg: films.chip(m), keys };
});

/** Text scalers of the two figure layers (set when the stage is bound). */
let scalers: Array<(k: number) => void> = [];
const cam: Key[] = [{ x: 800, y: 370, s: 1 }, { at: 0.05, d: 1.1, ...ASIDE }, { at: S[2] + 2.8, d: 1.1, x: 800, y: 370, s: 1 }];

export const STAGING = build({
  id: 'a',
  name: 'A · The slide’s wheel as the map',
  note: 'Slide C1’s wheel steps aside as an empty map; the ¹⁴C experiments fill in its molecules; back on the slide, the count per 3 CO₂.',
  D,
  holds: [[0, 1.3], [0.7, 1.8], [], []],
  defs: `${shadowDef(P)}${films.defs}`,
  items: [slide, map, ...qs, ...L.items, ...films.items, ...timer, ...flow, ...meter.items, ...chips,
    ...countItems(`${P}n`, onSlide, 1.07, S[3] + 0.25), ...pulseItems(`${P}n`, onSlide, 1.07, S[3] + 0.25)],
  cam,
  init(api) { scalers = [textScaler(api.q('slide')), textScaler(api.q('map'))]; },
  fx(G, api) {
    const k = textK(api.cam.s);
    scalers.forEach(f => f(k));
    meter.fx(G, api);
  },
});
