// Slide 8 · Cytochrome b₆f on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with b₆f
// lit: plastoquinone arriving with its electrons and H⁺, b₆f, the H⁺ it releases into the lumen, the electrons on to
// plastocyanin. Five views: c2c, c2c3, c2c3 with a zoom inset, a crop on b₆f with a map of the chain, c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_B6F, type FocusView, type Glyphs } from './chain';

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

// The lecturer picked 7m1 (28 Oct 2026): the c2c look with molecules as atom balls, ringed H⁺ and product tags sets the
// style of slides 7–10b, so each lists only that view; the other views stay drawable by id.
export const VARIANTS: Variant[] = [
  { id: '8m1', name: 'c2c · molecules as atom balls, ringed H⁺' },
];

const G: Glyphs = { mol: true }, GN: Glyphs = { mol: true, named: true };
const V: Record<string, FocusView> = {
  '8m1': { look: 'bil', lit: LIT_B6F, g: G, say: '' },
  '8m2': { look: 'glow', lit: LIT_B6F, g: G, say: '' },
  '8m3': { look: 'bil', lit: LIT_B6F, g: GN, say: '' },
  '8m4': { look: 'glow', lit: LIT_B6F, g: GN, say: '' },
  '8m5': {
    look: 'glow', lit: LIT_B6F, g: GN,
    crop: { win: [118, 200, 420], h: 440, mk: 0.34, mat: [16, 456], rows: [100, 470] },
    labels: [
      { s: 'stroma', at: [16, 30], a: 'start', k: 'zone' },
      { s: 'lumen', at: [784, 424], a: 'end', k: 'zone' },
      { s: 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', at: [398, 70], k: 'name', big: true },
      { s: 'plastoquinone', at: [185, 92], big: true },
      { s: 'plastocyanin', at: [549, 414], big: true },
    ],
    say: 'The view is cropped to cytochrome b₆f, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '8m6': {
    look: 'glow', lit: LIT_B6F, g: GN,
    inset: { ...INSET, win: [321, 338], z: 1.2 },
    labels: [

    ],
    say: 'The chain is drawn smaller; a circle above shows cytochrome b6f enlarged.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn8${id}`, V[id] ?? V['8m1']);
}
