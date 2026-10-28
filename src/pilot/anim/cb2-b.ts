// C2 animation, staging B · "Clippings". Each number is read off its source, laid on Bristol paper as a clipping:
// Goodsell's spinach RuBisCO as a clipping (left) stays through beats 1–3; beside it, the site count (beat 1), the
// nitrogen bars printed on a J Exp Bot clipping (beat 2), and Bar-On & Milo's PNAS figure with its 7×10¹⁴ g ringed
// (beat 3); then the slide's wheel (C2 v7), where 3-PGA is made (beat 4). Story pieces: cb2-common.ts.
import {
  baronClip, bars, barsFx, CR_BARON, CR_EVANS, CR_GOOD, onV7, pgaItems, siteFx, siteReadout, slideC2, structure,
} from './cb2-common';
import { build, clipping, credit, f1, figOnStage, hide, type Item, type Key, shadowDef, show, T, type V } from './cb-kit';

const P = 'cb2b';
const D = [3.6, 2.2, 1.6, 4.2];
const S = [0, 3.6, 5.8, 7.4];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];

// the structure on its clipping, left
const SW = 460, st = structure(P, SW), sh = st.h + 36 + 50;
const L: V = [400, 350];
const sClip: Item = {
  k: 'sclip', svg: clipping(P, SW + 36, sh, `<g transform="translate(0 ${f1(-sh / 2 + 18 + st.h / 2)})">${st.svg}</g>${T(0, sh / 2 - 22, 'spinach RuBisCO', 'clip-name cbk-serif', 'middle', ' style="font-size:28px"')}`, { rot: -1.6, seed: 121 }),
  keys: life(L[0], L[1], -1, S[3]),
};
const sCr: Item = { k: 'scr', svg: credit(CR_GOOD), keys: life(L[0], L[1] + sh / 2 + 26, -1, S[3]) };

// right: the site count, then the J Exp Bot clipping with the bars, then the PNAS clipping
const R: V = [1150, 350];
const readout: Item = { k: 'ro', svg: siteReadout(`${P}s`), keys: life(R[0], R[1], -1, S[1]) };
const BW = 560, eh = 420;
const evans: Item = {
  k: 'evans',
  svg: clipping(P, BW + 60, eh, `${T(-BW / 2, -eh / 2 + 44, 'J Exp Bot 2019 · Evans & Clarke', 'clip-find cbk-serif', 'start', ' style="font-size:24px"')}<g transform="translate(0 30)">${bars(`${P}b`, BW)}</g>`, { rot: 1.2, seed: 131 }),
  keys: life(R[0], R[1], S[1] + 0.05, S[2]),
};
const evansCr: Item = { k: 'evans-cr', svg: credit(CR_EVANS), keys: life(R[0], R[1] + eh / 2 + 26, S[1] + 0.05, S[2]) };
const bc = baronClip(P, 560);
const baron: Item = { k: 'baron', svg: bc.svg, keys: life(R[0], 290, S[2] + 0.05, S[3]) };
const baronCr: Item = { k: 'baron-cr', svg: credit(CR_BARON), keys: life(R[0], 290 + bc.h / 2 + 26, S[2] + 0.05, S[3]) };
const gt: Item = {
  k: 'gt', svg: `${T(0, 0, '7×10¹⁴ g = 0.7 billion tonnes', 'cbk-big cbk-green', 'middle')}${T(0, 38, 'of RuBisCO in the plants on land', 'cbk-l', 'middle')}`,
  keys: life(R[0], 290 + bc.h / 2 + 92, S[2] + 0.3, S[3]),
};
const slide: Item = { k: 'slide', svg: figOnStage(slideC2(`${P}f`)), keys: [{ o: 0 }, show(S[3] + 0.2, 0.45)] };

const site = siteFx(`${P}s`, 0.15, 3), fill = barsFx(`${P}b`, BW, S[1] + 0.35);
export const STAGING = build({
  id: 'b',
  name: 'B · Clippings',
  note: 'Each number read off its source as a clipping: Goodsell’s structure beside the site count, the nitrogen bars on a J Exp Bot clipping, Bar-On & Milo’s PNAS figure; ends on the slide’s wheel.',
  D,
  holds: [[0], [], [], []],
  defs: shadowDef(P),
  items: [sClip, sCr, readout, evans, evansCr, baron, baronCr, gt, slide, ...pgaItems(`${P}n`, onV7, 1.07, S[3] + 0.75)],
  fx(G, api) { site(G, api); fill(G, api); },
});
