// Slide C0 · From light to CO₂ fixation (lecturer, 28 Oct 2026): the bridge after 10b. The figure is the 7m1 chain with
// the dark-reaction strip (figs/cell-schema.ts) joined at its right edge; the animation 'bridge' swipes across it.
// Concept level: no stoichiometric counts on the strip.
import type { PlateText, Variant } from '../types';
import { chainSvg, type Part as CPart } from './chain';
import { abbrLines, abbrSvg, cellSvg, LIT_C1, type Part } from './cell-schema';
import { breadG, grainG } from './grain';

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
  { id: 'b', name: 'Cropped at the seam: ATP synthase and FNR beside GAPDH and RuBisCO', anim: true },
  { id: 'c', name: 'As b, with the sucrose exit continued: → wheat grain → bread', anim: true },
];

const ALLC: CPart[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
const LIT: Part[] = [...LIT_C1, 'thyl', 'light', 'starch'];

/** Variant c's tail at the sucrose exit (right edge of the view, where the export arrow leaves): sucrose → wheat grain
 *  (starch made there) → bread, in figure units of the joined frame. */
function breadTail(): string {
  const x = 1172;
  // the card covers GAPDH's own name (strip label right of it): named again above the render
  return `<text class="cel-prot cel-halo" x="1030" y="146" text-anchor="middle">GAPDH</text><rect class="grn-card" x="1090" y="114" width="106" height="160" rx="12"/>
    <path class="grn-link" d="M${x + 16},102V126"/><text class="cel-cnt" x="${x + 8}" y="132" text-anchor="end">sucrose</text>
    ${grainG(x - 30, 156, 0.62)}<text class="cel-mn cel-halo" x="${x - 30}" y="190" text-anchor="middle">wheat grain</text>
    <path class="grn-link" d="M${x - 30},196V206"/>${breadG(x - 30, 226, 0.4)}<text class="cel-mn cel-halo" x="${x - 30}" y="266" text-anchor="middle">bread</text>`;
}

function joined(id: string, view: [number, number, number, number], tail = ''): string {
  const chain = chainSvg(`${id}c`, 'pdb-bilayer', ALLC, { mol: true, counts: false }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const strip = cellSvg(`${id}s`, 'strip', LIT, { bare: true, join: true, unit: 'none' });
  return `<svg class="fig-svg chn chn-pdb-bilayer cel" viewBox="${view.join(' ')}" role="img" aria-label="The light-reaction chain in the thylakoid membrane (photosystem II, cytochrome b6f, photosystem I, ATP synthase as renders of their structures) with, to its right, the stroma where ATP and NADPH drive CO2 fixation: GAPDH, RuBisCO and PRK as renders, the cycle's molecules in carbon form, the chloroplast envelope with the triose-phosphate translocator.">
    <defs><clipPath id="${id}-cl"><rect x="800" y="0" width="${view[0] + view[2] - 800}" height="610"/></clipPath>
      <clipPath id="${id}-view"><rect x="${view[0]}" y="${view[1]}" width="${view[2]}" height="${view[3]}"/></clipPath></defs>
    <g clip-path="url(#${id}-view)"><g clip-path="url(#${id}-cl)"><g transform="translate(800 0)">${strip}</g></g>${chain}${tail}</g>
    ${view[0] >= 400 ? abbrSvg(abbrLines(['RuBP', '3-PGA', 'GAPDH'], 380), view[0] + view[2] - 10, 592, 'end') : ''}</svg>`;
}

export function draw(id: string): string {
  if (id === 'c') return joined('c0c', [400, 0, 800, 600], breadTail());
  return id === 'b' ? joined('c0b', [400, 0, 800, 600]) : joined('c0a', [0, 0, 1600, 600]);
}
