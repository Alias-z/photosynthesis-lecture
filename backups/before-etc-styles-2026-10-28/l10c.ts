// Slide 10 · ATP synthase on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with ATP
// synthase lit: the H⁺ in the lumen (from water and from cytochrome b₆f), their flow back to the stroma through ATP
// synthase, ADP + Pᵢ → ATP in the stroma. Five views: c2c, c2c3, c2c3 with a zoom inset, a crop on ATP synthase with a map
// of the chain, c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_ATPS, type FocusView } from './chain';

export const PLATE: PlateText = {
  n: '10',
  title: 'ATP synthase',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Hahn et al. 2018', url: 'https://doi.org/10.1126/science.aat4318' },
    { label: 'Jagendorf & Uribe 1966', url: 'https://doi.org/10.1073/pnas.55.1.170' },
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: '10a', name: 'c2c, ATP synthase lit' },
  { id: '10b', name: 'c2c3, ATP synthase lit' },
  { id: '10c', name: 'c2c3 with a zoom inset on ATP synthase' },
  { id: '10d', name: 'Crop on ATP synthase with a map of the chain' },
  { id: '10e', name: 'c2c with callouts for the inputs and outputs of ATP synthase' },
];

const ATP = 'ADP + Pᵢ → ATP';
const V: Record<string, FocusView> = {
  '10a': { look: 'bil', lit: LIT_ATPS, say: '' },
  '10b': { look: 'glow', lit: LIT_ATPS, say: '' },
  '10c': {
    look: 'glow', lit: LIT_ATPS,
    inset: { ...INSET, win: [690, 262], z: 1.1 },
    drop: [['atp', ATP]],
    labels: [
      { s: ATP, at: [404, 56], a: 'start', k: 'mol', to: [360, 58], from: [401, 50] },
      { s: 'H⁺', at: [226, 106], a: 'end', k: 'h' },
      { s: 'H⁺', at: [270, 232], a: 'end', k: 'h' },
    ],
    say: 'The chain is drawn smaller; a circle above shows ATP synthase enlarged with the H+ flowing through it from the lumen to the stroma and ATP forming in its head.',
  },
  '10d': {
    look: 'bil', lit: LIT_ATPS,
    crop: { win: [255, 96, 545], h: 440, fade: [0.16, 0.05], mk: 0.34, mat: [16, 456], rows: [100, 470] },
    labels: [
      { s: ATP, at: [662, 22], k: 'mol', big: true },
      { s: 'H⁺', at: [576, 208], a: 'end', k: 'h', big: true },
      { s: 'H⁺', at: [680, 412], a: 'start', k: 'h', big: true },
      { s: 'ATP synthase', at: [630, 434], a: 'end', k: 'name', big: true },
      { s: 'stroma', at: [16, 30], a: 'start', k: 'zone' },
      { s: 'lumen', at: [16, 430], a: 'start', k: 'zone' },
    ],
    say: 'The view is cropped to ATP synthase, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '10e': {
    look: 'bil', lit: LIT_ATPS,
    drop: [['atp', ATP]],
    labels: [
      { s: ATP, at: [708, 92], k: 'mol', to: [716, 128], from: [712, 98] },
      { s: 'H⁺', at: [628, 238], a: 'end', k: 'h', to: [651, 239], from: [630, 233] },
      { s: 'H⁺', at: [668, 400], a: 'end', k: 'h', to: [700, 384], from: [671, 393] },
    ],
    say: 'Callouts name what ATP synthase takes in and gives out.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn10${id}`, V[id] ?? V['10a']);
}
