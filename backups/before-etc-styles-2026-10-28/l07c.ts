// Slide 7 · Photosystem II on the whole light-reaction chain (27 Oct 2026). Six looks of one schema (./chain.ts), each with
// photosystem II lit: PSII and its light, water → O₂ with the H⁺ it leaves in the lumen, the electrons from water through
// PSII to plastoquinone, and plastoquinone with the H⁺ it takes up from the stroma. Slides 8–10 reuse the schema with
// other lit sets. The page text stays in ./s07.ts (plates.ts: withFigures).
import type { PlateText, Variant } from '../types';
import { chainSvg, LIT_PSII, type Style } from './chain';

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

export const VARIANTS: Variant[] = [
  { id: 'c2c', name: 'c2 in a lipid bilayer' },
  { id: 'c2c1', name: 'c2c with shaded renders' },
  { id: 'c2c2', name: 'c2c larger, with callouts' },
  { id: 'c2c3', name: 'c2c with glow spotlight and outlined silhouettes' },
  { id: 'c2c4', name: 'c2c with the PSII core in front of its antenna' },
  { id: 'c2c5', name: 'c2c with a detailed bilayer closing the lumen, larger' },
  { id: 'c2c6', name: 'c2c with shaded renders and callouts' },
];

const STYLE: Record<string, Style> = {
  c1: 'flat', c2: 'pdb', c3: 'grana', c4: 'path', c5: 'plate', c6: 'energy',
  c2a: 'pdb-core', c2b: 'pdb-shade', c2c: 'pdb-bilayer', c2d: 'pdb-glow', c2e: 'pdb-callout', c2f: 'pdb-crowd',
  c2c1: 'bil-shade', c2c2: 'bil-callout', c2c3: 'bil-glow', c2c4: 'bil-core', c2c5: 'bil-thick', c2c6: 'bil-shade-callout',
};

export function draw(id: string): string {
  const v = STYLE[id] ? id : 'c2';
  return chainSvg(`chn7${v}`, STYLE[v], LIT_PSII);
}
