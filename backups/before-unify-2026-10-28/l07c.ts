// Slide 7 · Photosystem II on the whole light-reaction chain (27 Oct 2026). Six looks of one schema (./chain.ts), each with
// photosystem II lit: PSII and its light, water → O₂ with the H⁺ it leaves in the lumen, the electrons from water through
// PSII to plastoquinone, and plastoquinone with the H⁺ it takes up from the stroma. Slides 8–10 reuse the schema with
// other lit sets. The page text stays in ./s07.ts (plates.ts: withFigures).
import type { PlateText, Variant } from '../types';
import { chainSvg, cropAt, focusSvg, INSET, LIT_PSII, type FocusView, type Glyphs, type Style } from './chain';

export const PLATE: PlateText = {
  n: '7',
  title: 'Photosystem II',
  status: 'draft',
  lead: '',
  points: [],
  refs: [
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
    { label: 'Nelson & Ben-Shem 2004', url: 'https://doi.org/10.1038/nrm1525' },
    { label: 'Govindjee et al. 2017', url: 'https://doi.org/10.1007/s11120-016-0333-z' },
    { label: 'Wietrzynski et al. 2020', url: 'https://doi.org/10.7554/eLife.53740' },
    { label: 'Su et al. 2017', url: 'https://doi.org/10.1126/science.aan0327' },
  ],
  play: 'psii',
};

// The lecturer's picks (c2c, c2c3) first; the other earlier looks are unlisted (28 Oct 2026). Then the glyph round: the
// two picked looks with molecules as atom balls, ringed H⁺ and product tags (m1, m2), with the carriers lettered and
// named by leader lines (m3, m4), a crop on photosystem II with a map of the chain (m5) and a zoom inset (m6).
export const VARIANTS: Variant[] = [
  { id: 'c2c', name: 'c2 in a lipid bilayer' },
  { id: 'c2c3', name: 'c2c with glow spotlight and outlined silhouettes' },
  { id: '7m1', name: 'c2c · molecules as atom balls, ringed H⁺' },
  { id: '7m2', name: 'c2c3 · molecules as atom balls, ringed H⁺' },
  { id: '7m3', name: 'c2c · molecules, carriers lettered and named by leaders' },
  { id: '7m4', name: 'c2c3 · molecules, carriers lettered and named by leaders' },
  { id: '7m5', name: 'c2c3 · molecules, crop on photosystem II with a map of the chain' },
  { id: '7m6', name: 'c2c3 · molecules, zoom inset on photosystem II' },
];

const G: Glyphs = { mol: true }, GN: Glyphs = { mol: true, named: true };
const CROP7 = { win: [0, 176, 520] as [number, number, number], h: 440, fade: [0.08, 0.04] as [number, number], mk: 0.34, mat: [16, 456] as [number, number], rows: [100, 470] as [number, number] };
const at7 = (q: [number, number]): [number, number] => cropAt(CROP7, q);
const V: Record<string, FocusView> = {
  '7m1': { look: 'bil', lit: LIT_PSII, g: G, say: '' },
  '7m2': { look: 'glow', lit: LIT_PSII, g: G, say: '' },
  '7m3': { look: 'bil', lit: LIT_PSII, g: GN, say: '' },
  '7m4': { look: 'glow', lit: LIT_PSII, g: GN, say: '' },
  '7m5': {
    look: 'glow', lit: LIT_PSII, g: GN, crop: CROP7,
    labels: [
      { s: 'stroma', at: [16, 30], a: 'start', k: 'zone' },
      { s: 'lumen', at: [784, 424], a: 'end', k: 'zone' },
      { s: 'light', at: at7([80, 196]), a: 'start', k: 'light', big: true },
      { s: 'photosystem II', at: at7([6, 404]), a: 'start', k: 'name' },
      { s: 'plastoquinone', at: at7([300, 232]), a: 'start', big: true, to: at7([248, 284]), from: at7([298, 228]) },
      { s: 'H₂O', at: at7([52, 454]), a: 'end', k: 'mol' },
      { s: 'O₂', at: at7([159, 448]), k: 'mol' },
    ],
    say: 'The view is cropped to photosystem II, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '7m6': {
    look: 'glow', lit: LIT_PSII, g: GN,
    inset: { ...INSET, win: [150, 330], z: 1.25 },
    say: 'The chain is drawn smaller; a circle above shows photosystem II enlarged, with water, O₂ and H⁺ on its lumen side and plastoquinone at its stroma side.',
  },
};

const STYLE: Record<string, Style> = {
  c1: 'flat', c2: 'pdb', c3: 'grana', c4: 'path', c5: 'plate', c6: 'energy',
  c2a: 'pdb-core', c2b: 'pdb-shade', c2c: 'pdb-bilayer', c2d: 'pdb-glow', c2e: 'pdb-callout', c2f: 'pdb-crowd',
  c2c1: 'bil-shade', c2c2: 'bil-callout', c2c3: 'bil-glow', c2c4: 'bil-core', c2c5: 'bil-thick', c2c6: 'bil-shade-callout',
};

export function draw(id: string): string {
  if (V[id]) return focusSvg(`chn7${id}`, V[id]);
  const v = STYLE[id] ? id : 'c2';
  return chainSvg(`chn7${v}`, STYLE[v], LIT_PSII);
}
