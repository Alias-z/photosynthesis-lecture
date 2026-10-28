// C2 animation, staging A · "Zoom into the slide's RuBisCO". Opens on slide C2's figure v7 (the wheel with carboxylation
// lit, Goodsell's spinach RuBisCO at its top right). Beat 1: the camera dives into the RuBisCO picture, and one active
// site's count runs against a clock beside it. Beat 2: the leaf-nitrogen and soluble-protein bars fill. Beat 3: Bar-On &
// Milo's figure as a clipping, its 7×10¹⁴ g ringed. Beat 4: the camera returns to the slide's wheel; 3 CO₂ go in through
// RuBisCO and six 3-PGA set off toward reduction. Story pieces: cb2-common.ts.
import {
  baronClip, bars, barsFx, CR_BARON, CR_EVANS, CR_GOOD, onV7, pgaItems, siteFx, siteReadout, slideC2, structure, V7_GOOD,
} from './cb2-common';
import { build, credit, figOnStage, hide, type Item, type Key, onFig, shadowDef, show, T, textK, textScaler, type V } from './cb-kit';

const P = 'cb2a';
const D = [4.6, 2.4, 1.6, 4.6];
const S = [0, 4.6, 7.0, 8.6];
// the dive: the RuBisCO picture (figure units) shown 560 px wide, centred at (520, 360) on the stage
const GC = onFig(V7_GOOD.c), ZS = 560 / (V7_GOOD.w * 1.07);
const ZOOM = { x: GC[0] + (800 - 520) / ZS, y: GC[1] + (370 - 360) / ZS, s: ZS };
const cam: Key[] = [{ x: 800, y: 370, s: 1 }, { at: 0.05, d: 1.15, ...ZOOM }, { at: S[3] + 0.1, d: 1.2, x: 800, y: 370, s: 1 }];

// the dive: the slide fades while the camera closes in, leaving its RuBisCO picture (an identical copy on top)
const slide: Item = { k: 'slide', svg: figOnStage(slideC2(`${P}f`)), keys: [{ o: 1 }, hide(0.35, 0.45), show(S[3] + 0.25, 0.6)] };
const GW = V7_GOOD.w * 1.07, gsv = structure(`${P}g`, GW);
const good: Item = { k: 'good', svg: gsv.svg, keys: [{ x: GC[0], y: GC[1], o: 0 }, show(0.35, 0.45), hide(S[3] + 0.25, 0.6)] };
const R: V = [1185, 360];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];
const readout: Item = { k: 'ro', layer: 'hud', svg: siteReadout(`${P}s`), keys: life(R[0], R[1], 1.0, S[1]) };
const barsIt: Item = { k: 'bars', layer: 'hud', svg: bars(`${P}b`, 560), keys: life(R[0], R[1] + 10, S[1] + 0.2, S[2]) };
const barsCr: Item = { k: 'bars-cr', layer: 'hud', svg: credit(CR_EVANS), keys: life(R[0], 690, S[1] + 0.2, S[2]) };
const BW = 640, bc = baronClip(P, BW);
const baron: Item = { k: 'baron', layer: 'hud', svg: bc.svg, keys: life(R[0], 290, S[2] + 0.05, S[3]) };
const baronCr: Item = { k: 'baron-cr', layer: 'hud', svg: credit(CR_BARON), keys: life(R[0], 290 + bc.h / 2 + 26, S[2] + 0.05, S[3]) };
const gt: Item = {
  k: 'gt', layer: 'hud',
  svg: `${T(0, 0, '7×10¹⁴ g = 0.7 billion tonnes', 'cbk-big cbk-green', 'middle')}${T(0, 38, 'of RuBisCO in the plants on land', 'cbk-l', 'middle')}`,
  keys: life(R[0], 290 + bc.h / 2 + 92, S[2] + 0.35, S[3]),
};
const goodCr: Item = { k: 'good-cr', layer: 'hud', svg: credit(CR_GOOD), keys: life(520, 724, 1.0, S[3]) };

let scale: (k: number) => void = () => undefined;
const site = siteFx(`${P}s`, 1.35, 3), fill = barsFx(`${P}b`, 560, S[1] + 0.45);
export const STAGING = build({
  id: 'a',
  name: 'A · Zoom into the slide’s RuBisCO',
  note: 'Slide C2’s figure v7: the camera dives into its RuBisCO picture for the site count, the nitrogen bars and Bar-On & Milo’s total, then returns to the wheel, where 3-PGA is made.',
  D,
  holds: [[0], [], [], []],
  defs: shadowDef(P),
  items: [slide, good, readout, barsIt, barsCr, baron, baronCr, gt, goodCr, ...pgaItems(`${P}n`, onV7, 1.07, S[3] + 1.35)],
  cam,
  init(api) { scale = textScaler(api.q('slide')); },
  fx(G, api) {
    scale(textK(api.cam.s));
    site(G, api);
    fill(G, api);
  },
});
