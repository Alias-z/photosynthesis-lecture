// Slide 10 · ATP synthase on the whole light-reaction chain (28 Oct 2026). The schema of slide 7 (./chain.ts) with ATP
// synthase lit: the H⁺ in the lumen (from water and from cytochrome b₆f), their flow back to the stroma through ATP
// synthase, ADP + Pᵢ → ATP in the stroma. Five views: c2c, c2c3, c2c3 with a zoom inset, a crop on ATP synthase with a map
// of the chain, c2c with callouts.
import type { PlateText, Variant } from '../types';
import { cropAt, focusSvg, INSET, LIT_ATPS, type FocusView, type Glyphs } from './chain';

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

// The earlier views (none picked) are unlisted (28 Oct 2026); the glyph round, in the two looks picked on slide 7:
// molecules as atom balls, ringed H⁺ and product tags (m1, m2), with the carriers lettered and named by leader lines
// (m3, m4), a crop with a map of the chain (m5) and a zoom inset (m6).
export const VARIANTS: Variant[] = [
  { id: '10m1', name: 'c2c · molecules as atom balls, ringed H⁺' },
  { id: '10m2', name: 'c2c3 · molecules as atom balls, ringed H⁺' },
  { id: '10m3', name: 'c2c · molecules, carriers lettered and named by leaders' },
  { id: '10m4', name: 'c2c3 · molecules, carriers lettered and named by leaders' },
  { id: '10m5', name: 'c2c3 · molecules, crop on ATP synthase with a map of the chain' },
  { id: '10m6', name: 'c2c3 · molecules, zoom inset on ATP synthase' },
];

const G: Glyphs = { mol: true }, GN: Glyphs = { mol: true, named: true };
// The crop on ATP synthase runs from ADP + Pᵢ → ATP above to the lumen below, so it is taller; its map sits top left.
const CROP10 = { win: [360, 52, 460] as [number, number, number], h: 560, fade: [0.1, 0.03] as [number, number], mk: 0.34, mat: [16, 16] as [number, number], rows: [100, 470] as [number, number] };
const at10 = (q: [number, number]): [number, number] => cropAt(CROP10, q);
const V: Record<string, FocusView> = {
  '10m1': { look: 'bil', lit: LIT_ATPS, g: G, say: '' },
  '10m2': { look: 'glow', lit: LIT_ATPS, g: G, say: '' },
  '10m3': { look: 'bil', lit: LIT_ATPS, g: GN, say: '' },
  '10m4': { look: 'glow', lit: LIT_ATPS, g: GN, say: '' },
  '10m5': {
    look: 'glow', lit: LIT_ATPS, g: GN,
    crop: CROP10,
    labels: [
      { s: 'ATP synthase', at: at10([636, 330]), a: 'end', k: 'name', big: true },
      { s: 'stroma', at: [300, 150], a: 'start', k: 'zone' },
      { s: 'lumen', at: [16, 548], a: 'start', k: 'zone' },
    ],
    say: 'The view is cropped to ATP synthase, enlarged, its neighbours fading out at the edges; a small map of the whole chain below marks the crop.',
  },
  '10m6': {
    look: 'glow', lit: LIT_ATPS, g: GN,
    inset: { ...INSET, win: [690, 262], z: 1.1 },
    labels: [

    ],
    say: 'The chain is drawn smaller; a circle above shows ATP synthase enlarged.',
  },
};

export function draw(id: string): string {
  return focusSvg(`chn10${id}`, V[id] ?? V['10m1']);
}
