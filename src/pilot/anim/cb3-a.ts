// C3 animation, staging A · "On the slide's wheel". Opens on slide C3's figure v3. Beat 1: ATP and NADPH run from the
// figure's chips along its arrows into reduction (6 + 6) and regeneration (3); its box "per 3 CO₂" pulses. Beat 2: the
// wheel steps aside; Bassham's experiment appears beside it (lamp over Chlorella, the redrawn Fig. 15 with the steady
// part on screen); a click switches the lamp off and the curves run on: 3-PGA jumps, RuBP falls. Beat 3: back on the
// wheel, now with the light off (only carboxylation lit, chips grey): RuBisCO runs once more, 3-PGA piles up, RuBP is
// used up. Beat 4: light on, the slide's wheel turns once, and one triose phosphate in six leaves. Story: cb3-common.ts.
import type { Axes } from '../figs/cb-common';
import {
  boxPulse, CR_15R, darkWheel, fuelItems, graph, graphFx, lampFlask, lampFx, slideC3, turnItems, whyItems,
} from './cb3-common';
import { build, credit, figOnStage, hide, type Item, type Key, onFig, shadowDef, show, textK, textScaler } from './cb-kit';

const P = 'cb3a';
const D = [3.4, 3.0, 2.6, 4.8];
const S = [0, 3.4, 6.4, 9.0];
const ASIDE = { x: 1428, y: 370, s: 0.7 };
const cam: Key[] = [{ x: 800, y: 370, s: 1 }, { at: S[1] + 0.05, d: 1.1, ...ASIDE }, { at: S[2] + 0.05, d: 1.1, x: 800, y: 370, s: 1 }];

const slide: Item = { k: 'slide', svg: figOnStage(slideC3(`${P}f`)), keys: [{ o: 1 }, hide(S[2] + 0.3, 0.5), show(S[3] + 0.05, 0.5)] };
const dark: Item = { k: 'dark', svg: figOnStage(darkWheel(`${P}d`)), keys: [{ o: 0 }, show(S[2] + 0.3, 0.5), hide(S[3] + 0.05, 0.5)] };

// beat 2: lamp and flask, and the redrawn graph, on the right
const A2: Axes = { x0: 1010, y0: 190, w: 500, h: 360, xr: [0, 700], yr: [0, 26] };
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];
const lamp: Item = { k: 'lamp', layer: 'hud', svg: lampFlask(`${P}l`), keys: life(810, 330, S[1] + 0.9, S[2]) };
const gr: Item = { k: 'graph', layer: 'hud', svg: graph(`${P}g`, A2), keys: [{ o: 0 }, show(S[1] + 0.9, 0.25), hide(S[2], 0.3)] };
const grCr: Item = { k: 'graph-cr', layer: 'hud', svg: credit(CR_15R, 'end'), keys: life(1580, 724, S[1] + 0.9, S[2]) };

let scalers: Array<(k: number) => void> = [];
const lampOff = lampFx(`${P}l`, S[1] + 1.35), curves = graphFx(`${P}g`, A2, S[1] + 1.35);
export const STAGING = build({
  id: 'a',
  name: 'A · On the slide’s wheel',
  note: 'Slide C3’s figure v3: ATP and NADPH run in from its chips; the wheel steps aside for Bassham’s light-off experiment (redrawn), returns with the light off, then turns once and lets one triose phosphate go.',
  D,
  holds: [[0], [1.3], [], []],
  defs: shadowDef(P),
  items: [slide, dark, ...fuelItems(`${P}u`, onFig, 1.07, 0.15), boxPulse(`${P}bp`, onFig, 1.07, 2.5), lamp, gr, grCr,
    ...whyItems(`${P}w`, onFig, 1.07, S[2] + 0.8).map(it => ({ ...it, keys: [...it.keys, hide(S[3], 0.3)] })),
    ...turnItems(`${P}t`, onFig, 1.07, S[3] + 0.6)],
  cam,
  init(api) { scalers = [textScaler(api.q('slide')), textScaler(api.q('dark'))]; },
  fx(G, api) {
    const k = textK(api.cam.s);
    scalers.forEach(f => f(k));
    lampOff(G, api);
    curves(G, api);
  },
});
