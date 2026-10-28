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
];

const STYLE: Record<string, Style> = {
  c1: 'flat', c2: 'pdb', c3: 'grana', c4: 'path', c5: 'plate', c6: 'energy',
  c2a: 'pdb-core', c2b: 'pdb-shade', c2c: 'pdb-bilayer', c2d: 'pdb-glow', c2e: 'pdb-callout', c2f: 'pdb-crowd',
};

export function draw(id: string): string {
  const v = STYLE[id] ? id : 'c2';
  return chainSvg(`chn7${v}`, STYLE[v], LIT_PSII);
}
