// C3 animation, staging B · "History". Beat 1: the top of Sharkey's 2019 drawing of the cycle (a scan), then its energy
// steps named: slide C3's figure v6. Beat 2: Bassham's halftone portrait beside Calvin's Nobel Fig. 15 as a clipping,
// shown up to the moment the light goes off; a click runs a cursor on through the dark: 3-PGA jumps, RuBP falls.
// Beat 3: slide C3's figure v5 (the wheel with the light off beside the redrawn curves), RuBisCO running once more.
// Beat 4: slide C3's figure v3 with the light on: one turn, one triose phosphate out. Story pieces: cb3-common.ts.
import sharkeyJpg from '../../assets/photos/cb-sharkey2019.jpg';
import { BASSHAM, CR_15, scan, scanFx, slideC3, turnItems } from './cb3-common';
import {
  arcPath, build, credit, figOnStage, hide, image, type Item, type Key, onFig, portraitClip, shadowDef, show, type V, co2Fig,
} from './cb-kit';

const P = 'cb3b';
const D = [2.0, 2.6, 2.4, 4.8];
const S = [0, 2.0, 4.6, 7.0];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];

// beat 1: the bare scan where v6 draws it (shot at 14, 90, 772 wide, window 40,0–1418,520), then v6 itself
const SH = { href: sharkeyJpg, w: 1418, h: 1189 };
const bare = image(`${P}-shk`, SH, 772 * 1.07, { mult: true, win: [40, 0, 1378, 520] });
const bareC: V = onFig([400, 90 + (772 * 520) / 1378 / 2]);
const bareIt: Item = { k: 'bare', svg: bare.svg, keys: [{ x: bareC[0], y: bareC[1] }, hide(0.35, 0.3)] };
const v6: Item = { k: 'v6', svg: figOnStage(slideC3(`${P}s`, 'v6')), keys: [{ o: 0 }, show(0.15, 0.4), hide(S[1], 0.3)] };

// beat 2: Bassham and the scan
const SW = 760, sc = scan(`${P}x`, SW, { clip: true });
const C2: V = [930, 352];
const bas: Item = { k: 'bas', svg: portraitClip(P, BASSHAM, 'Bassham', 150, { rot: -2, seed: 151 }), keys: life(260, 330, S[1] + 0.1, S[2]) };
const scanIt: Item = { k: 'scan', svg: sc.svg, keys: life(C2[0], C2[1], S[1] + 0.1, S[2]) };
const scanCr: Item = { k: 'scan-cr', svg: credit(CR_15, 'end'), keys: life(C2[0] + SW / 2 + 18, 722, S[1] + 0.1, S[2]) };

// beat 3: v5, with two CO₂ (atom balls) running its carboxylation arc (wheel at 186, 300, r 104)
const v5: Item = { k: 'v5', svg: figOnStage(slideC3(`${P}v`, 'v5')), keys: [{ o: 0 }, show(S[2] + 0.1, 0.45), hide(S[3], 0.4)] };
const co2: Item[] = [0, 1].map(i => {
  const a = S[2] + 0.8 + i * 0.3, path = (u: number): V => onFig(arcPath([186, 300], 104, -126, -46)(u));
  const p0 = path(0);
  return { k: `c${i}`, svg: co2Fig(11), keys: [{ x: p0[0], y: p0[1], o: 0 }, show(a, 0.12), { at: a, d: 0.8, path }, hide(a + 0.8, 0.2)] };
});

// beat 4: v3
const v3: Item = { k: 'v3', svg: figOnStage(slideC3(`${P}f`)), keys: [{ o: 0 }, show(S[3] + 0.2, 0.45)] };

const sweep = scanFx(`${P}x`, sc.xs, SW, S[1] + 0.75);
export const STAGING = build({
  id: 'b',
  name: 'B · History',
  note: 'History-led: Sharkey’s 2019 scan of the energy steps (slide figure v6); Bassham’s portrait beside Calvin’s Fig. 15 scan, a cursor running on into the dark; the light-off wheel (v5); the slide’s wheel (v3).',
  D,
  holds: [[0], [0.6], [], []],
  defs: shadowDef(P),
  items: [bareIt, v6, bas, scanIt, scanCr, v5, ...co2, v3, ...turnItems(`${P}t`, onFig, 1.07, S[3] + 0.8)],
  fx(G, api) { sweep(G, api); },
});
