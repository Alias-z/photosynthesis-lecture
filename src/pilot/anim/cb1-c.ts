// C1 animation, staging C · "The films". Real-image-led, no portraits: the lollipop photo fills the stage (beat 1); the
// 30 s film fills it, then the 5 s film, then the 5 s film veiled but for 3-PGA, with the flow tube and the readout on
// the side (beat 2); the 30 s film shrinks into its place on slide C1's figure v8 (the film with its spots coloured by
// their place in the cycle, beside the wheel), which appears around it (beat 3); then figure v1 and the count (beat 4).
// Story pieces: cb1-common.ts.
import {
  ANIM_P, countItems, filmItems, flowClip, labMotion, labPhoto, onSlide, pgaMeter, pulseItems, slideC1, timerItems, CR_LOL,
} from './cb1-common';
import { build, credit, figOnStage, hide, type Item, type Key, shadowDef, show, type V } from './cb-kit';

const P = `${ANIM_P}c`;
const D = [3.0, 3.4, 2.8, 5.2];
const S = [0, 3.0, 6.4, 9.2];

/* ---- beat 1: the lollipop photo, large */
const LW = 900, lab = labPhoto(`${P}l`, LW, { pillsRight: true, size: 24 });
const LC: V = [690, 345];
const labIt: Item = { k: 'lab', svg: lab.svg, keys: [{ x: LC[0], y: LC[1] }, hide(S[1], 0.3)] };
const labCr: Item = { k: 'lab-cr', svg: credit(CR_LOL, 'end'), keys: [{ x: LC[0] + LW / 2, y: LC[1] + lab.h / 2 + 22 }, hide(S[1], 0.3)] };
const motion = labMotion('lm', lab.at, q => [LC[0] + q[0], LC[1] + q[1]], 0.15, 'scene');
motion.forEach(m => m.keys.push(hide(S[1], 0.3)));

/* ---- beat 2: the films fill the stage; the side column holds the feed time, the flow tube and the readout */
const FC: V = [690, 350], FW = 780;
const T2 = { in30: S[1] + 0.1, to5: S[1] + 0.75, sub1: S[1] + 1.85, back30: S[2] + 0.02, out: S[2] + 1.45 };
const films = filmItems(P, FC, FW, T2, { pill: [1160, 560], cr: [FC[0], 680] });
const timer = timerItems(P, [1330, 92], { in30: T2.in30, to5: T2.to5, sub1: T2.sub1, out: S[2] });
const flow = flowClip(`${P}f`, [1330, 340], 190, { in: T2.sub1, out: S[2] });
const meter = pgaMeter(P, [1300, 664], 210, { in: T2.sub1, fill: T2.sub1 + 0.25, out: S[2] });

/* ---- beat 3: the 30 s film flies to its place on figure v8 (film at x 6, y 80, 470 wide in figure units) */
const V8: V = onSlide([6 + 235, 80 + (470 * 1053) / 1348 / 2]), V8S = (470 * 1.07) / FW;
for (const it of films.items) {
  if (it.k === 'f30') {
    const k0 = it.keys[0], rest = [...it.keys.slice(1), { at: S[2] + 0.15, d: 1.0, x: V8[0], y: V8[1], s: V8S } as Key];
    it.keys = [k0, ...rest.sort((a, b) => (a.at ?? 0) - (b.at ?? 0))];
  }
  if (it.k === 'rings30') it.keys = [{ o: 0 }];
}
const v8: Item = { k: 'v8', svg: figOnStage(slideC1(`${P}e`, 'v8')), keys: [{ o: 0 }, show(S[2] + 1.0, 0.45), hide(S[3] + 0.1, 0.45)] };

/* ---- beat 4: figure v1 and the count */
const v1: Item = { k: 'v1', svg: figOnStage(slideC1(`${P}w`)), keys: [{ o: 0 }, show(S[3] + 0.1, 0.45)] };

export const STAGING = build({
  id: 'c',
  name: 'C · The films',
  note: 'Real-image-led, no portraits: the lollipop photo, then the 30 s and 5 s films fill the stage; the 30 s film lands on slide C1’s figure v8, then v1 for the count.',
  D,
  holds: [[0], [0.6, 1.75], [], []],
  defs: `${shadowDef(P)}${films.defs}`,
  items: [labIt, labCr, ...motion, ...films.items, ...timer, ...flow, ...meter.items, v8, v1,
    ...countItems(`${P}n`, onSlide, 1.07, S[3] + 0.7), ...pulseItems(`${P}n`, onSlide, 1.07, S[3] + 0.7)],
  fx(G, api) { meter.fx(G, api); },
});
