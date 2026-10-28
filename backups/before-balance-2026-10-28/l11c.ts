// Slide 10b · Cyclic electron flow on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with
// the cycle lit: PSI and its light, ferredoxin, the cyclic route back to plastoquinone (labelled "cyclic flow"), b₆f and
// the H⁺ it releases into the lumen, plastocyanin back to PSI, and the lumen H⁺ through ATP synthase to ATP. FNR and NADPH
// stay dimmed: no NADPH is made. Five views: c2c, c2c3, c2c3 with a zoom inset, a crop on the cycle with a map of the chain,
// c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_CYCLIC, type FocusView, type Glyphs } from './chain';

export const PLATE: PlateText = {
  n: '10b',
  title: 'Cyclic electron flow',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Yamori & Shikanai 2016', url: 'https://doi.org/10.1146/annurev-arplant-043015-112002' },
    { label: 'Munekage et al. 2004', url: 'https://doi.org/10.1038/nature02598' },
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
  ],
};

// The lecturer picked 7m1 (28 Oct 2026): the c2c look with molecules as atom balls, ringed H⁺ and product tags sets the
// style of slides 7–10b, so each lists only that view; the other views stay drawable by id.
export const VARIANTS: Variant[] = [
  { id: '11m1', name: 'c2c · molecules as atom balls, ringed H⁺' },
];

const G: Glyphs = { mol: true }, GN: Glyphs = { mol: true, named: true };
const V: Record<string, FocusView> = {
  '11m1': { look: 'bil', lit: LIT_CYCLIC, g: G, say: '' },
  '11m2': { look: 'glow', lit: LIT_CYCLIC, g: G, say: '' },
  '11m3': { look: 'bil', lit: LIT_CYCLIC, g: GN, say: '' },
  '11m4': { look: 'glow', lit: LIT_CYCLIC, g: GN, say: '' },
  '11m5': {
    look: 'glow', lit: LIT_CYCLIC, g: GN,
    crop: { win: [186, 188, 420], h: 440, fade: [0.1, 0.06], mk: 0.34, mat: [16, 456], rows: [100, 470] },
    labels: [
      { s: 'cyclic flow', at: [300, 80], big: true },
      { s: 'light', at: [432, 30], a: 'end', k: 'light', big: true },
      { s: 'ferredoxin', at: [662, 40], a: 'end', big: true },
      { s: 'plastoquinone', at: [96, 112], big: true },
      { s: 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', at: [272, 438], a: 'start', k: 'name', big: true },
      { s: 'photosystem I', at: [620, 352], k: 'name', big: true },
      { s: 'plastocyanin', at: [468, 424], a: 'start', big: true },
    ],
    say: 'The view is cropped to the cycle around photosystem I, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '11m6': {
    look: 'glow', lit: LIT_CYCLIC, g: GN,
    inset: { ...INSET, win: [506, 240], z: 1.3 },
    labels: [
      { s: 'light', at: [160, 34], a: 'end', k: 'light' },
    ],
    say: 'The chain is drawn smaller; a circle above shows ferredoxin, where the electrons turn back to plastoquinone enlarged.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn11${id}`, V[id] ?? V['11m1']);
}
