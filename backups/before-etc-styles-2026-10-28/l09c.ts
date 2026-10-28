// Slide 9 · Photosystem I on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with PSI lit:
// plastocyanin arriving, PSI and its light, the electrons on to ferredoxin, FNR, NADP⁺ + H⁺ → NADPH in the stroma. Five
// views: c2c, c2c3, c2c3 with a zoom inset, a crop on PSI with a map of the chain, c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_PSI, type FocusView } from './chain';

export const PLATE: PlateText = {
  n: '9',
  title: 'Photosystem I',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Mazor et al. 2017', url: 'https://doi.org/10.1038/nplants.2017.14' },
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: '9a', name: 'c2c, photosystem I lit' },
  { id: '9b', name: 'c2c3, photosystem I lit' },
  { id: '9c', name: 'c2c3 with a zoom inset on photosystem I' },
  { id: '9d', name: 'Crop on photosystem I with a map of the chain' },
  { id: '9e', name: 'c2c with callouts for the inputs and outputs of photosystem I' },
];

const V: Record<string, FocusView> = {
  '9a': { look: 'bil', lit: LIT_PSI, say: '' },
  '9b': { look: 'glow', lit: LIT_PSI, say: '' },
  '9c': {
    look: 'glow', lit: LIT_PSI,
    inset: { ...INSET, win: [498, 290], z: 1.2 },
    drop: [['fd', 'ferredoxin']],
    labels: [
      { s: 'light', at: [178, 30], a: 'end', k: 'light' },
      { s: 'ferredoxin', at: [404, 50], a: 'start', to: [349, 53], from: [401, 44] },
    ],
    say: 'The chain is drawn smaller; a circle above shows photosystem I enlarged with its light, the electrons arriving from plastocyanin and leaving to ferredoxin.',
  },
  '9d': {
    look: 'bil', lit: LIT_PSI,
    crop: { win: [262, 140, 500], top: 40, h: 430, fade: [0.14, 0.04], mk: 0.3, mat: [16, 482], rows: [100, 470] },
    labels: [
      { s: 'light', at: [200, 28], a: 'end', k: 'light', big: true },
      { s: 'NADP⁺ + H⁺ → NADPH', at: [525, 28], k: 'mol', big: true },
      { s: 'FNR', at: [547, 96], big: true },
      { s: 'ferredoxin', at: [486, 214], a: 'start', big: true },
      { s: 'photosystem I', at: [514, 404], a: 'start', k: 'name', big: true },
      { s: 'plastocyanin', at: [266, 452], a: 'start', big: true },
      { s: 'stroma', at: [16, 72], a: 'start', k: 'zone' },
      { s: 'lumen', at: [784, 458], a: 'end', k: 'zone' },
    ],
    say: 'The view is cropped to photosystem I, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '9e': {
    look: 'bil', lit: LIT_PSI,
    drop: [['pc', 'plastocyanin'], ['fd', 'ferredoxin']],
    labels: [
      { s: 'plastocyanin', at: [470, 424], a: 'start', to: [419, 394], from: [467, 416] },
      { s: 'ferredoxin', at: [486, 146], to: [538, 216], from: [496, 153] },
    ],
    say: 'Callouts name what photosystem I takes in and gives out.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn9${id}`, V[id] ?? V['9a']);
}
