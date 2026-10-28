// C3 animation, staging C · "Stacked, then the scan". Beat 1: the cost per CO₂ stacks up block by block (2 ATP and 2
// NADPH for reduction, 1 ATP for regeneration) and becomes slide C3's figure v4. Beat 2: Calvin's Nobel Fig. 15 fills
// the stage, shown up to the light going off; a click runs the cursor on through the dark. Beat 3: the scan moves left
// and the light-off wheel appears beside it: RuBisCO runs once more, 3-PGA piles up, RuBP is used up. Beat 4: the wheel
// moves to the centre with the light on (slide figure v3): one turn, one triose phosphate out. Story: cb3-common.ts.
import {
  CR_15, darkWheel, scan, scanFx, slideC3, turnItems, whyItems,
} from './cb3-common';
import { build, credit, figOnStage, hide, type Item, type Key, onFig, poseAt, shadowDef, show, T, textK, textScaler, type V } from './cb-kit';

const P = 'cb3c';
const D = [2.6, 2.6, 2.8, 4.8];
const S = [0, 2.6, 5.2, 8.0];
const life = (x: number, y: number, a: number, b: number): Key[] => [{ x, y, o: 0 }, show(a, 0.25), hide(b, 0.3)];

// beat 1: the five blocks of v4 (figure units: xA 250, xN 430, base 470, 150 × 74), dropping in, then v4 itself; the
// blocks use v4's classes (fcb-atp / fcb-nadph, now the deck's tag colours)
const bw = 150, bh = 74, xA = 250, xN = 430, base = 470;
const cell = (cls: string, s: string, sub: string): string =>
  `<g class="fig"><rect x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" rx="14" class="${cls}"/>${T(0, -3, s, 'fcb-node', 'middle')}${T(0, 23, sub, 'fcb-s', 'middle')}</g>`;
const BLOCKS: Array<[string, string, number, number]> = [
  ['fcb-atp', 'ATP', xA, base - bh], ['fcb-nadph', 'NADPH', xN, base - bh], ['fcb-atp', 'ATP', xA, base - 2 * bh - 8],
  ['fcb-nadph', 'NADPH', xN, base - 2 * bh - 8], ['fcb-atp', 'ATP', xA, base - 3 * bh - 16],
];
const blocks: Item[] = BLOCKS.map(([cls, s, x, y], i) => {
  const c = onFig([x + bw / 2, y + bh / 2]), a = 0.15 + i * 0.32;
  return {
    k: `bk${i}`, svg: `<g transform="scale(1.07)">${cell(cls, s, i === 4 ? 'regeneration' : 'reduction')}</g>`,
    keys: [{ x: c[0], y: c[1] - 120, o: 0 }, show(a, 0.15), { at: a, d: 0.45, y: c[1], ease: (u: number) => 1 - (1 - u) * (1 - u) }, hide(1.95, 0.3)],
  };
});
// the shelf and title the blocks drop onto (as v4 draws them), on screen from the start
const shelf: Item = {
  k: 'shelf', svg: `<g transform="matrix(1.07,0,0,1.07,${(800 - 1.07 * 400).toFixed(2)},${(370 - 1.07 * 300).toFixed(2)})"><g class="fig"><path class="fcb-axis" d="M${xA - 30},${base + 4} H${xN + bw + 30}"/>${T(400, 92, 'per CO₂ fixed', 'fcb-h', 'middle')}</g></g>`,
  keys: [{ o: 1 }, hide(1.95, 0.3)],
};
const v4: Item = { k: 'v4', svg: figOnStage(slideC3(`${P}s`, 'v4')), keys: [{ o: 0 }, show(1.75, 0.4), hide(S[1], 0.3)] };

// beat 2: the scan fills the stage; beat 3: it moves left
const SW = 820, sc = scan(`${P}x`, SW);
const scanIt: Item = { k: 'scan', svg: sc.svg, keys: [{ x: 800, y: 352, o: 0 }, show(S[1] + 0.1, 0.3), { at: S[2] + 0.05, d: 1.0, x: 380, y: 352, s: 0.68 }, hide(S[3], 0.4)] };
const scanCr: Item = { k: 'scan-cr', svg: credit(CR_15), keys: [{ x: 800, y: 722, o: 0 }, show(S[1] + 0.1, 0.3), { at: S[2] + 0.05, d: 1.0, x: 380, y: 722 }, hide(S[3], 0.4)] };

// beat 3: the light-off wheel on the right (item pose 0.62), beat 4: the slide's wheel at the centre
const WS = 0.62, WP = { x: 1180 - WS * 800, y: 370 - WS * 370, s: WS };
const wpose = (q: V): V => { const p = onFig(q); return [WP.x + WS * p[0], WP.y + WS * p[1]]; };
const toCentre: Key = { at: S[3] + 0.1, d: 1.0, x: 0, y: 0, s: 1 };
const dark: Item = { k: 'dark', svg: figOnStage(darkWheel(`${P}d`)), keys: [{ ...WP, o: 0 }, show(S[2] + 0.6, 0.4), toCentre, hide(S[3] + 0.4, 0.5)] };
const v3: Item = { k: 'v3', svg: figOnStage(slideC3(`${P}f`)), keys: [{ ...WP, o: 0 }, show(S[3] + 0.4, 0.5), toCentre] };
const why = whyItems(`${P}w`, wpose, WS * 1.07, S[2] + 1.0, 21).map(it => ({ ...it, keys: [...it.keys, hide(S[3], 0.25)] }));

let scalers: Array<(k: number) => void> = [];
const sweep = scanFx(`${P}x`, sc.xs, SW, S[1] + 0.75, 1.6, S[2]);
export const STAGING = build({
  id: 'c',
  name: 'C · Stacked, then the scan',
  note: 'The cost per CO₂ stacks up block by block into slide figure v4; Calvin’s Fig. 15 scan fills the stage, the cursor running on into the dark; the light-off wheel beside it; the slide’s wheel (v3) at the end.',
  D,
  holds: [[0], [0.6], [], []],
  defs: shadowDef(P),
  items: [shelf, ...blocks, v4, scanIt, scanCr, dark, v3, ...why, ...turnItems(`${P}t`, onFig, 1.07, S[3] + 1.3)],
  init(api) { scalers = [textScaler(api.q('dark')), textScaler(api.q('v3'))]; },
  fx(G, api) {
    const k = textK(poseAt(v3.keys, G).s);
    scalers.forEach(f => f(k));
    sweep(G, api);
  },
});

