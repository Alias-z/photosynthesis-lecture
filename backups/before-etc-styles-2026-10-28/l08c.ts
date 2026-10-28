// Slide 8 · Cytochrome b₆f on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with b₆f
// lit: plastoquinone arriving with its electrons and H⁺, b₆f, the H⁺ it releases into the lumen, the electrons on to
// plastocyanin. Five views: c2c, c2c3, c2c3 with a zoom inset, a crop on b₆f with a map of the chain, c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_B6F, type FocusView } from './chain';

export const PLATE: PlateText = {
  n: '8',
  title: 'Cytochrome b₆f',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Malone et al. 2019', url: 'https://doi.org/10.1038/s41586-019-1746-6' },
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: '8a', name: 'c2c, cytochrome b₆f lit' },
  { id: '8b', name: 'c2c3, cytochrome b₆f lit' },
  { id: '8c', name: 'c2c3 with a zoom inset on cytochrome b₆f' },
  { id: '8d', name: 'Crop on cytochrome b₆f with a map of the chain' },
  { id: '8e', name: 'c2c with callouts for the inputs and outputs of b₆f' },
];

const V: Record<string, FocusView> = {
  '8a': { look: 'bil', lit: LIT_B6F, say: '' },
  '8b': { look: 'glow', lit: LIT_B6F, say: '' },
  '8c': {
    look: 'glow', lit: LIT_B6F,
    inset: { ...INSET, win: [321, 338], z: 1.2 },
    drop: [['pq', 'plastoquinone'], ['pc', 'plastocyanin']],
    labels: [
      { s: 'plastoquinone', at: [150, 38], a: 'end', to: [168, 69], from: [128, 45] },
      { s: 'plastocyanin', at: [412, 190], a: 'start', to: [372, 182], from: [409, 184] },
      { s: 'H⁺', at: [271, 206], a: 'start', k: 'h' },
    ],
    say: 'The chain is drawn smaller; a circle above shows cytochrome b6f enlarged with plastoquinone, plastocyanin and the H+ it releases.',
  },
  '8d': {
    look: 'bil', lit: LIT_B6F,
    crop: { win: [118, 200, 420], h: 440, mk: 0.34, mat: [16, 456], rows: [100, 470] },
    labels: [
      { s: 'stroma', at: [16, 30], a: 'start', k: 'zone' },
      { s: 'lumen', at: [784, 424], a: 'end', k: 'zone' },
      { s: 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', at: [398, 70], k: 'name', big: true },
      { s: 'plastoquinone', at: [185, 112], big: true },
      { s: 'plastocyanin', at: [549, 414], big: true },
      { s: 'H⁺', at: [380, 392], a: 'start', k: 'h', big: true },
    ],
    say: 'The view is cropped to cytochrome b6f, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '8e': {
    look: 'bil', lit: LIT_B6F,
    drop: [['pq', 'plastoquinone'], ['pc', 'plastocyanin']],
    labels: [
      { s: 'plastoquinone', at: [300, 200], to: [238, 268], from: [286, 207] },
      { s: 'H⁺', at: [345, 419], a: 'start', k: 'h', to: [313, 403], from: [342, 412] },
      { s: 'plastocyanin', at: [470, 424], a: 'start', to: [419, 394], from: [467, 416] },
    ],
    say: 'Callouts name what cytochrome b6f takes in and gives out.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn8${id}`, V[id] ?? V['8a']);
}
