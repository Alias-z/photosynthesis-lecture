// C1 animation, staging D · "Side by side". Beat 1: the lollipop photo on the left, the three portraits on the right.
// Beat 2: three columns appear one per click and stay side by side: the 30 s film, the 5 s film, and under one second
// (Bassham's flow tube and the readout "over 80 %" in 3-PGA). Beat 3: the 30 s film (left) and the slide's wheel as an
// empty map (right); the spots' names fly from the film to their places, and the wheel fills in. Beat 4: the wheel moves
// to the centre as on the slide (C1 v1) and the count per 3 CO₂ runs. Story pieces: cb1-common.ts.
import {
  ANIM_P, countItems, CR_FILM, CR_LOL, CR_PORTRAITS, F30, F5, film, flowClip, labMotion, labPhoto, mapWheel, onSlide,
  pgaMeter, PORTRAITS, pulseItems, ring, slideC1, SP30, SP5, WP,
} from './cb1-common';
import {
  build, credit, figOnStage, hide, type Item, type Key, leader, pill, poseAt, portrait, shadowDef, show, T, textK, textScaler, type V,
} from './cb-kit';

const P = `${ANIM_P}d`;
const D = [3.4, 3.4, 3.9, 5.4];
const S = [0, 3.4, 6.8, 10.7];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];

/* ---- beat 1: photo left, portraits right */
const LW = 640, lab = labPhoto(`${P}l`, LW, { pillsRight: true });
const LC: V = [420, 350];
const labIt: Item = { k: 'lab', svg: lab.svg, keys: life(LC[0], LC[1], -1, S[1]) };
const labCr: Item = { k: 'lab-cr', svg: credit(CR_LOL, 'start'), keys: life(LC[0] - LW / 2, LC[1] + lab.h / 2 + 22, -1, S[1]) };
const motion = labMotion('lm', lab.at, q => [LC[0] + q[0], LC[1] + q[1]], 0.15, 'scene');
motion.forEach(m => m.keys.push(hide(S[1], 0.3)));
const people: Item[] = (['calvin', 'benson', 'bassham'] as const).map((n, i) => ({
  k: `pp-${n}`, svg: portrait(PORTRAITS[n], n[0].toUpperCase() + n.slice(1), 132), keys: life(1140 + i * 160, 330, -1, S[1]),
}));
people.push({ k: 'pp-cr', svg: credit(CR_PORTRAITS, 'end'), keys: life(1580, 722, -1, S[1]) });

/* ---- beat 2: three columns */
const FW = 450, X3 = [290, 810, 1330], FY = 330;
const T2 = [S[1] + 0.1, S[1] + 0.75, S[1] + 1.85];
const timeP = (i: number, s: string): Item => ({ k: `tp${i}`, svg: pill(s, { size: 26, tint: 'ink' }), keys: life(X3[i], 86, T2[i], S[2]) });
function filmCol(i: number, k: string, im: typeof F30, spot: V, rx: number, ry: number): Item[] {
  const a = film(`${P}-${k}`, im, FW), s = FW / im.w, c = a.at(spot);
  const pillAt: V = [c[0] + 60, a.h / 2 + 52];
  const lead = leader([pillAt[0] - 30, pillAt[1] - 18], [c[0] + 6, c[1] + ry * s + 2]);
  return [
    { k, svg: `${a.svg}${ring(a.at, spot, rx, ry, 'pga', s)}`, keys: life(X3[i], FY, T2[i], i === 0 ? S[3] : S[2]) },
    { k: `${k}-l`, svg: `${lead}<g transform="translate(${pillAt[0]} ${pillAt[1]})">${pill('3-PGA', { size: 22, tint: 'green' })}</g>`, keys: life(X3[i], FY, T2[i], S[2]) },
  ];
}
const col30 = filmCol(0, 'f30', F30, SP30.pga, 62, 92), col5 = filmCol(1, 'f5', F5, SP5.pga, 58, 96);
const filmCr: Item = { k: 'f-cr', svg: credit(CR_FILM), keys: life(550, 640, T2[0], S[2]) };
const flow = flowClip(`${P}f`, [X3[2], 300], 180, { in: T2[2], out: S[2] });
const meter = pgaMeter(P, [X3[2] - 40, 640], 210, { in: T2[2], fill: T2[2] + 0.25, out: S[2] });
const cols: Item[] = [timeP(0, '30 s'), timeP(1, '5 s'), timeP(2, 'under 1 s'), ...col30, ...col5, filmCr, ...flow, ...meter.items];

/* ---- beat 3: the 30 s film left, the wheel as a map right; names fly from the spots to the wheel */
const F3: V = [420, 360], F3W = 600, F3S = F3W / FW;
const f30 = col30[0];
f30.keys = [f30.keys[0], f30.keys[1], { at: S[2], d: 0.9, x: F3[0], y: F3[1], s: F3S }, hide(S[3], 0.35)];
const big = film(`${P}-g30`, F30, F3W);
const spotAt = (q: V): V => { const r = big.at(q); return [F3[0] + r[0], F3[1] + r[1]]; };
const rings3: Item = { k: 'rings3', svg: `${ring(big.at, SP30.tp, 62, 52, 'tp', F3W / F30.w)}${ring(big.at, SP30.sdp, 78, 70, 'sdp', F3W / F30.w)}`, keys: life(F3[0], F3[1], S[2] + 0.9, S[3]) };
// the wheel, right, at 0.7 of the slide's size (item pose); back to the slide's place in beat 4
const WPOSE = { x: 640, y: 111, s: 0.7 };
const wpose = (q: V): V => [WPOSE.x + WPOSE.s * q[0], WPOSE.y + WPOSE.s * q[1]];
const toSlide: Key = { at: S[3] + 0.1, d: 1.0, x: 0, y: 0, s: 1 };
const map: Item = { k: 'map', svg: figOnStage(mapWheel(`${P}m`)), keys: [{ ...WPOSE, o: 0 }, show(S[2] + 0.4, 0.4), hide(S[2] + 2.5, 0.4)] };
const slide: Item = { k: 'slide', svg: figOnStage(slideC1(`${P}w`)), keys: [{ ...WPOSE, o: 0 }, show(S[2] + 2.4, 0.45), toSlide] };
const qs: Item[] = (['rubp', 'pga', 'tp'] as const).map(m => {
  const c = wpose(onSlide(WP[m]));
  return { k: `q-${m}`, svg: pill('?', { size: 24, w: 56 }), keys: [{ x: c[0], y: c[1], o: 0 }, show(S[2] + 0.6, 0.25), hide(S[2] + 2.25, 0.25)] };
});
const CHIP: Record<'pga' | 'tp' | 'rubp', [string, string, V]> = { pga: ['3-PGA', 'green', SP30.pga], tp: ['triose phosphate', 'blue', SP30.tp], rubp: ['RuBP', 'amber', SP30.sdp] };
const chips: Item[] = (['pga', 'tp', 'rubp'] as const).map((m, i) => {
  const [txt, tint, spot] = CHIP[m], from = spotAt(spot), toP = wpose(onSlide(WP[m]));
  return { k: `chip-${m}`, svg: pill(txt, { size: 22, tint }), keys: [{ x: from[0], y: from[1] - 44, o: 0 }, show(S[2] + 1.0 + i * 0.08, 0.25), { at: S[2] + 1.35 + i * 0.12, d: 0.9, x: toP[0], y: toP[1] }, hide(S[2] + 2.6, 0.3)] };
});
const f3cr: Item = { k: 'f3-cr', svg: credit(CR_FILM.replace('Figs 5, 6', 'Fig. 5')), keys: life(F3[0], F3[1] + big.h / 2 + 24, S[2] + 0.9, S[3]) };
const head3: Item = { k: 'h3', svg: T(0, 0, '30 s in ¹⁴CO₂', 'cbk-h', 'middle'), keys: life(F3[0], F3[1] - big.h / 2 - 24, S[2] + 0.9, S[3]) };

let scalers: Array<(k: number) => void> = [];
export const STAGING = build({
  id: 'd',
  name: 'D · Side by side',
  note: 'Comparisons side by side: the three feed times as three columns that stay on screen; then the 30 s film beside the wheel, its spots’ names flying to their places; the wheel moves to the centre for the count.',
  D,
  holds: [[0], [0.6, 1.75], [], []],
  defs: shadowDef(P),
  items: [labIt, labCr, ...motion, ...people, ...cols, rings3, f3cr, head3, map, slide, ...qs, ...chips,
    ...countItems(`${P}n`, onSlide, 1.07, S[3] + 1.25), ...pulseItems(`${P}n`, onSlide, 1.07, S[3] + 1.25)],
  init(api) { scalers = [textScaler(api.q('slide')), textScaler(api.q('map'))]; },
  fx(G, api) {
    const k = textK(poseAt(slide.keys, G).s);
    scalers.forEach(f => f(k));
    meter.fx(G, api);
  },
});
