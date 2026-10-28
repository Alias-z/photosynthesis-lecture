// C2 animation, staging C · "The molecule". Structure-led: Goodsell's spinach RuBisCO fills the left of the stage, its
// 8 active sites as 8 dots on a ring round it that flash as the count runs (beat 1); the ring becomes two share rings,
// RuBisCO's share of a C₃ leaf's nitrogen (≈ 20 %) and of its soluble protein (≈ 40 %) (beat 2); Bar-On & Milo's figure
// beside it (beat 3); the molecule flies into its place on slide C2's figure v7, which appears round it, and 3-PGA is
// made (beat 4). Story pieces: cb2-common.ts.
import { arcD } from '../figs/cb-common';
import { baronClip, CR_BARON, CR_EVANS, CR_GOOD, onV7, pgaItems, slideC2, structure, V7_GOOD } from './cb2-common';
import { build, credit, figOnStage, hide, type Item, type Key, leader, onFig, polarV, shadowDef, show, T, type V, win } from './cb-kit';

const P = 'cb2c';
const D = [4.4, 2.4, 1.6, 4.6];
const S = [0, 4.4, 6.8, 8.4];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];

const MW = 470, M: V = [520, 360], mol = structure(P, MW);
// beat 4: the molecule flies into its place on figure v7
const V7: V = onFig(V7_GOOD.c), V7S = (V7_GOOD.w * 1.07) / MW;
const molIt: Item = { k: 'mol', svg: mol.svg, keys: [{ x: M[0], y: M[1] }, { at: S[3] + 0.1, d: 1.1, x: V7[0], y: V7[1], s: V7S }, hide(S[3] + 1.3, 0.3)] };
const molCr: Item = { k: 'mol-cr', svg: credit(CR_GOOD, 'start'), keys: [{ x: 30, y: 722 }, hide(S[3], 0.3)] };

// beat 1: the 8 sites on a ring round the molecule, the count beside it
const RR = 300;
const sites: Item[] = Array.from({ length: 8 }, (_, i) => {
  const c = polarV(M, RR, -90 + i * 45);
  return { k: `s${i}`, svg: `<circle class="cbk-site" r="15"/>`, keys: [{ x: c[0], y: c[1] }, hide(S[1], 0.3)] };
});
const siteLab: Item = { k: 'slab', svg: T(0, 0, '8 active sites', 'cbk-h cbk-green', 'start'), keys: [{ x: M[0] + 228, y: M[1] - 250 }, hide(S[1], 0.3)] };
const count: Item = {
  k: 'count',
  svg: `${T(0, -60, 'per active site, 25 °C', 'cbk-l cbk-grey', 'start')}<text data-k="${P}-n" class="cbk-huge cbk-green" x="0" y="20" text-anchor="start" style="font-size:96px">0</text>${T(150, 4, 'CO₂ fixed', 'cbk-h', 'start')}`
    + `<text data-k="${P}-t" class="cbk-h" x="0" y="80" text-anchor="start">0.0 s</text><text data-k="${P}-r" class="cbk-h cbk-green" x="0" y="130" text-anchor="start"></text>`,
  keys: [{ x: 1040, y: 330 }, hide(S[1], 0.3)],
};

// beat 2: the two share rings, drawn on by fx
const R1 = 268, R2 = 318, W1 = 34;
const ringSvg = (r: number, k: string, cls: string): string => `<circle class="cbk-donut" cx="0" cy="0" r="${r}" style="stroke-width:${W1}px"/>`
  + `<path data-k="${k}" class="${cls}" d="${arcD(0, 0, r, -90, 269.9)}" pathLength="1" style="stroke-width:${W1}px;stroke-dasharray:0 1"/>`;
const rings: Item = { k: 'rings', svg: `${ringSvg(R1, `${P}-r1`, 'cbk-donut-fill')}${ringSvg(R2, `${P}-r2`, 'cbk-donut-fill2')}`, keys: life(M[0], M[1], S[1] + 0.1, S[2]) };
const a1 = polarV(M, R1, -90 + 0.2 * 360 * 0.5), a2 = polarV(M, R2, -90 + 0.4 * 360 * 0.62);
const LX = M[0] + R2 + 60, L1: V = [LX, M[1] - 170], L2: V = [LX, M[1] + 40];
const ringLabs: Item = {
  k: 'rlabs',
  svg: `${leader([L1[0] - 12, L1[1] - 8], a1)}${leader([L2[0] - 12, L2[1] - 8], a2)}`
    + T(L1[0], L1[1], '≈ 20 % of the leaf’s nitrogen', 'cbk-h cbk-green', 'start')
    + T(L2[0], L2[1], '≈ 40 % of its soluble protein', 'cbk-h', 'start', ' style="fill:#3f8f46"')
    + T(L1[0], M[1] + 250, 'RuBisCO’s share in a C₃ leaf', 'cbk-l cbk-grey', 'start'),
  keys: [{ o: 0 }, show(S[1] + 1.0, 0.25), hide(S[2], 0.3)],
};
const ringCr: Item = { k: 'rcr', svg: credit(CR_EVANS, 'end'), keys: life(1570, 722, S[1] + 0.1, S[2]) };

// beat 3: Bar-On & Milo
const bc = baronClip(P, 540);
const baron: Item = { k: 'baron', svg: bc.svg, keys: life(1200, 280, S[2] + 0.05, S[3]) };
const baronCr: Item = { k: 'baron-cr', svg: credit(CR_BARON), keys: life(1200, 280 + bc.h / 2 + 26, S[2] + 0.05, S[3]) };
const gt: Item = {
  k: 'gt', svg: `${T(0, 0, '7×10¹⁴ g = 0.7 billion tonnes', 'cbk-big cbk-green', 'middle')}${T(0, 38, 'of RuBisCO in the plants on land', 'cbk-l', 'middle')}`,
  keys: life(1200, 280 + bc.h / 2 + 92, S[2] + 0.3, S[3]),
};
const slide: Item = { k: 'slide', svg: figOnStage(slideC2(`${P}f`)), keys: [{ o: 0 }, show(S[3] + 0.9, 0.5)] };

const T0 = 0.15, RUN = 3.6;
export const STAGING = build({
  id: 'c',
  name: 'C · The molecule',
  note: 'Structure-led: Goodsell’s RuBisCO large, its 8 sites flashing as the count runs, then two share rings round it (nitrogen, soluble protein); it flies back into slide C2’s figure v7.',
  D,
  holds: [[0], [], [], []],
  defs: shadowDef(P),
  items: [molIt, molCr, ...sites, siteLab, count, rings, ringLabs, ringCr, baron, baronCr, gt, slide, ...pgaItems(`${P}n`, onV7, 1.07, S[3] + 1.4)],
  fx(G, api) {
    const dt = Math.max(0, Math.min(RUN, G - T0)), n = Math.floor(3 * dt + 1e-6);
    api.set(api.q(`${P}-n`), 'text', String(n));
    api.set(api.q(`${P}-t`), 'text', `${dt.toFixed(1)} s`);
    api.set(api.q(`${P}-r`), 'text', dt >= 1 ? '≈ 3 per second' : '');
    const on = G >= T0 && dt < RUN && ((3 * dt) % 1) < 0.3;
    for (let i = 0; i < 8; i++) api.set(api.q(`s${i}`).firstElementChild as Element, 'class', on ? 'cbk-site cbk-site-on' : 'cbk-site');
    const u1 = win(G, S[1] + 0.3, S[1] + 1.1), u2 = win(G, S[1] + 0.55, S[1] + 1.35);
    api.set(api.q(`${P}-r1`), 'style', `stroke-width:${W1}px;stroke-dasharray:${(0.2 * u1).toFixed(4)} 1`);
    api.set(api.q(`${P}-r2`), 'style', `stroke-width:${W1}px;stroke-dasharray:${(0.4 * u2).toFixed(4)} 1`);
  },
});
