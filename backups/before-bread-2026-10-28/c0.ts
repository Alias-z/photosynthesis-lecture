// Slide C0 · From light to CO₂ fixation (lecturer, 28 Oct 2026): the bridge after 10b. The figure is the 7m1 chain with
// the dark-reaction strip (figs/cell-schema.ts) joined at its right edge; the animation 'bridge' swipes across it.
// Concept level: no stoichiometric counts on the strip.
import type { PlateText, Variant } from '../types';
import { chainSvg, type Part as CPart } from './chain';
import { cellSvg, LIT_C1, type Part } from './cell-schema';

export const PLATE: PlateText = {
  n: 'C0',
  title: 'From light to CO₂ fixation',
  status: 'draft',
  lead: 'ATP and NADPH from the thylakoid drive CO₂ fixation in the stroma.',
  points: [],
  refs: [
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
    { label: 'Andersson 1996', url: 'https://doi.org/10.1006/jmbi.1996.0310' },
  ],
};

export const VARIANTS: Variant[] = [
  // b first: a's 1600-wide frame shrinks letters below 11 px in the slide box (kept drawable, unlisted)
  { id: 'b', name: 'Cropped at the seam: ATP synthase and FNR beside GAPDH and Rubisco', anim: true },
];

const ALLC: CPart[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
const LIT: Part[] = [...LIT_C1, 'thyl', 'light', 'starch'];

function joined(id: string, view: [number, number, number, number]): string {
  const chain = chainSvg(`${id}c`, 'pdb-bilayer', ALLC, { mol: true }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const strip = cellSvg(`${id}s`, 'strip', LIT, { bare: true, join: true, unit: 'none' });
  return `<svg class="fig-svg chn chn-pdb-bilayer cel" viewBox="${view.join(' ')}" role="img" aria-label="The light-reaction chain in the thylakoid membrane (photosystem II, cytochrome b6f, photosystem I, ATP synthase as renders of their structures) with, to its right, the stroma where ATP and NADPH drive CO2 fixation: GAPDH, Rubisco and PRK as renders, the cycle's molecules in carbon form, the chloroplast envelope with the triose-phosphate translocator.">
    <defs><clipPath id="${id}-cl"><rect x="800" y="0" width="${view[0] + view[2] - 800}" height="556"/></clipPath>
      <clipPath id="${id}-view"><rect x="${view[0]}" y="${view[1]}" width="${view[2]}" height="${view[3]}"/></clipPath></defs>
    <g clip-path="url(#${id}-view)">${chain}<g clip-path="url(#${id}-cl)"><g transform="translate(800 0)">${strip}</g></g></g></svg>`;
}

export function draw(id: string): string {
  return id === 'b' ? joined('c0b', [400, 0, 800, 600]) : joined('c0a', [0, 0, 1600, 600]);
}
