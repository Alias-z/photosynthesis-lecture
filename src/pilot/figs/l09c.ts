// Slide 9 · Photosystem I on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with PSI lit:
// plastocyanin arriving, PSI and its light, the electrons on to ferredoxin, FNR, NADP⁺ + H⁺ → NADPH in the stroma. Five
// views: c2c, c2c3, c2c3 with a zoom inset, a crop on PSI with a map of the chain, c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_PSI, type FocusView, type Glyphs } from './chain';

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

// The lecturer picked 7m1 (28 Oct 2026): the c2c look with molecules as atom balls, ringed H⁺ and product tags sets the
// style of slides 7–10b, so each lists only that view; the other views stay drawable by id.
export const VARIANTS: Variant[] = [
  { id: '9m1', name: 'c2c · molecules as atom balls, ringed H⁺' },
];

const G: Glyphs = { mol: true }, GN: Glyphs = { mol: true, named: true };
const V: Record<string, FocusView> = {
  '9m1': { look: 'bil', lit: LIT_PSI, g: G, say: '' },
  '9m2': { look: 'glow', lit: LIT_PSI, g: G, say: '' },
  '9m3': { look: 'bil', lit: LIT_PSI, g: GN, say: '' },
  '9m4': { look: 'glow', lit: LIT_PSI, g: GN, say: '' },
  '9m5': {
    look: 'glow', lit: LIT_PSI, g: GN,
    crop: { win: [262, 140, 500], top: 40, h: 430, fade: [0.14, 0.04], mk: 0.3, mat: [16, 482], rows: [100, 470] },
    labels: [
      { s: 'light', at: [200, 28], a: 'end', k: 'light', big: true },
      { s: 'FNR', at: [547, 96], big: true },
      { s: 'ferredoxin', at: [486, 214], a: 'start', big: true },
      { s: 'photosystem I', at: [514, 404], a: 'start', k: 'name', big: true },
      { s: 'plastocyanin', at: [266, 452], a: 'start', big: true },
      { s: 'stroma', at: [16, 72], a: 'start', k: 'zone' },
      { s: 'lumen', at: [784, 458], a: 'end', k: 'zone' },
    ],
    say: 'The view is cropped to photosystem I, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '9m6': {
    look: 'glow', lit: LIT_PSI, g: GN,
    inset: { ...INSET, win: [498, 290], z: 1.2 },
    labels: [
      { s: 'light', at: [178, 30], a: 'end', k: 'light' },
    ],
    say: 'The chain is drawn smaller; a circle above shows photosystem I enlarged.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn9${id}`, V[id] ?? V['9m1']);
}
