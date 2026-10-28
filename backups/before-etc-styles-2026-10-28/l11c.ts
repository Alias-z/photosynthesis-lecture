// Slide 10b · Cyclic electron flow on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with
// the cycle lit: PSI and its light, ferredoxin, the cyclic route back to plastoquinone (labelled "cyclic flow"), b₆f and
// the H⁺ it releases into the lumen, plastocyanin back to PSI, and the lumen H⁺ through ATP synthase to ATP. FNR and NADPH
// stay dimmed: no NADPH is made. Five views: c2c, c2c3, c2c3 with a zoom inset, a crop on the cycle with a map of the chain,
// c2c with callouts.
import type { PlateText, Variant } from '../types';
import { focusSvg, INSET, LIT_CYCLIC, type FocusView } from './chain';

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

export const VARIANTS: Variant[] = [
  { id: '11a', name: 'c2c, cyclic flow lit' },
  { id: '11b', name: 'c2c3, cyclic flow lit' },
  { id: '11c', name: 'c2c3 with a zoom inset on ferredoxin, where the cycle turns back' },
  { id: '11d', name: 'Crop on the cycle with a map of the chain' },
  { id: '11e', name: 'c2c with callouts for the cycle' },
];

const V: Record<string, FocusView> = {
  '11a': { look: 'bil', lit: LIT_CYCLIC, say: '' },
  '11b': { look: 'glow', lit: LIT_CYCLIC, say: '' },
  '11c': {
    look: 'glow', lit: LIT_CYCLIC,
    inset: { ...INSET, win: [506, 240], z: 1.3 },
    drop: [['fd', 'ferredoxin'], ['e-fd-pq', 'cyclic flow']],
    labels: [
      { s: 'cyclic flow', at: [266, 72], big: true },
      { s: 'ferredoxin', at: [406, 112], a: 'start', to: [347, 107], from: [403, 106] },
      { s: 'light', at: [160, 34], a: 'end', k: 'light' },
    ],
    say: 'The chain is drawn smaller; a circle above shows ferredoxin enlarged, where the electrons turn back to plastoquinone instead of going on to FNR.',
  },
  '11d': {
    look: 'bil', lit: LIT_CYCLIC,
    crop: { win: [186, 188, 420], h: 440, fade: [0.1, 0.06], mk: 0.34, mat: [16, 456], rows: [100, 470] },
    labels: [
      { s: 'cyclic flow', at: [300, 80], big: true },
      { s: 'light', at: [432, 30], a: 'end', k: 'light', big: true },
      { s: 'ferredoxin', at: [662, 40], a: 'end', big: true },
      { s: 'plastoquinone', at: [100, 140], big: true },
      { s: 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', at: [180, 370], a: 'end', k: 'name', big: true },
      { s: 'photosystem I', at: [620, 352], k: 'name', big: true },
      { s: 'plastocyanin', at: [392, 404], a: 'end', big: true },
      { s: 'H⁺', at: [190, 410], a: 'end', k: 'h', big: true },
    ],
    say: 'The view is cropped to the cycle around photosystem I, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '11e': {
    look: 'bil', lit: LIT_CYCLIC,
    drop: [['e-fd-pq', 'cyclic flow'], ['atp', 'ADP + Pᵢ → ATP'], ['pc', 'plastocyanin']],
    labels: [
      { s: 'cyclic flow', at: [290, 170], to: [350, 246], from: [300, 177] },
      { s: 'H⁺', at: [345, 419], a: 'start', k: 'h', to: [313, 403], from: [342, 412] },
      { s: 'plastocyanin', at: [470, 424], a: 'start', to: [419, 394], from: [467, 416] },
      { s: 'ADP + Pᵢ → ATP', at: [708, 92], k: 'mol', to: [716, 128], from: [712, 98] },
    ],
    say: 'Callouts name the cycle and what it gives.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn11${id}`, V[id] ?? V['11a']);
}
