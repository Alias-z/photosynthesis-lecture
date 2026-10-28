// Variants of the leaf section (figs/leaf-schema.ts) for slides C10–C13, joined in plates.ts like cellFigures (prefix m):
// m1 the whole leaf with the slide's parts lit, m3 a zoom on the lit part, mc the conditions strip (temperate · warm ·
// tropical · arid) with the slide's climate lit. C13 shows its one cell by night and by day as two panels (m1, m3).
// Brief: research/redo-2026-10-28/CO2_COPING_BRIEF.md.
import type { PlateText, Variant } from '../types';
import { camSvg, climateSvg, leafSvg, LIT_C10, LIT_C11, LIT_C11A, LIT_C12, type Clim, type LeafOpts, type LPart } from './leaf-schema';

export type LeafSlide = 'C10' | 'C11' | 'C11a' | 'C12' | 'C13';
export const LEAF_SLIDES: LeafSlide[] = ['C10', 'C11', 'C11a', 'C12', 'C13'];

interface Spec { lit: LPart[]; o: LeafOpts; zoom: [number, number, number]; zo?: LeafOpts; clim: Clim | 'trend' }
const SPEC: Record<Exclude<LeafSlide, 'C13'>, Spec> = {
  C10: { lit: LIT_C10, o: { unit: 'ppm' }, zoom: [0, 196, 400], clim: 'trend' },
  C11: { lit: LIT_C11, o: {}, zoom: [150, 196, 440], clim: 'c3' },
  // C₂: mesophyll RuBisCO and its O₂ secondary (they make the glycine)
  C11a: { lit: LIT_C11A, o: { unit: 'loop', sec: ['m-cp', 'm-rub', 'o2', 'pr-m'] }, zoom: [300, 64, 680], clim: 'c2' },
  // C₄: maize mesophyll chloroplasts carry no RuBisCO, so it is left out
  C12: { lit: LIT_C12, o: { unit: 'perCO2', hide: ['m-rub', 'm-perox', 'm-mito'] }, zoom: [168, 22, 740], clim: 'c4' },
};
const NAME: Record<LeafSlide, [string, string]> = {
  C10: ['Leaf section · the CO₂ path, gb, gs, gm and Cₐ, Cᵢ, C꜀ lit', 'Leaf section · zoom: air to RuBisCO'],
  C11: ['Leaf section · C₃: mesophyll RuBisCO, photorespiration, refixation lit', 'Leaf section · zoom: the mesophyll cell'],
  C11a: ['Leaf section · C₂: the glycine shuttle and bundle-sheath glycine decarboxylase lit', 'Leaf section · zoom: the glycine shuttle'],
  C12: ['Leaf section · C₄: the C₄ cycle and bundle-sheath RuBisCO lit', 'Leaf section · zoom: the C₄ cycle'],
  C13: ['One mesophyll cell by night and by day (CAM)', 'One mesophyll cell by night and by day · zoom'],
};

export function leafFigures(n: LeafSlide): { PLATE: PlateText; VARIANTS: Variant[]; draw: (id: string) => string } {
  const VARIANTS: Variant[] = [
    { id: '1', name: NAME[n][0], anim: true },
    { id: '3', name: NAME[n][1], anim: true },
    { id: 'c', name: 'Conditions · temperate · warm · tropical · arid' },
  ];
  return {
    PLATE: { n, title: '', status: 'draft', lead: '', points: [], refs: [] },
    VARIANTS,
    draw: id => {
      if (n === 'C13') return id === 'c' ? climateSvg(`lf${n}c`, 'cam') : camSvg(`lf${n}${id}`, id === '3');
      const s = SPEC[n];
      if (id === 'c') return climateSvg(`lf${n}c`, s.clim);
      if (id === '3') return leafSvg(`lf${n}3`, s.lit, { ...s.o, win: s.zoom, ...s.zo });
      return leafSvg(`lf${n}1`, s.lit, s.o);
    },
  };
}
