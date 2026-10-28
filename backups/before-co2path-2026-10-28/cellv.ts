// Variants of the dark reactions drawn in the real cell (figs/cell-schema.ts) for slides C1–C8, joined after each
// slide's own figures in plates.ts (prefix m): m3 the zoom on the slide's part (first on
// C2–C8), m1 the strip (continuing the 7m1 chain), m2 the cell section, mz a crop on the lit part (C2, C5, C6); C8 adds
// its limits one at a time; C2 adds m4, the RuBisCO render with its active site. Only the lit part is named and counted. Brief: research/redo-2026-10-28/SPATIAL_DARK_BRIEF.md.
import type { PlateText, Variant } from '../types';
import {
  cellSvg, rubiscoCloseSvg, WIN, LIT_C1, LIT_C2, LIT_C3, LIT_C4, LIT_C5, LIT_C6, LIT_C7, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P,
  type Arr, type CellOpts, type Part, type Unit,
} from './cell-schema';
import { rubsideClose, rubsidePanel, rubsideY } from './rubside';

export type CellSlide = 'C1' | 'C2' | 'C3' | 'C3b' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8';
export const CELL_SLIDES: CellSlide[] = ['C1', 'C2', 'C3', 'C3b', 'C4', 'C5', 'C6', 'C7', 'C8'];
/** C2 (message of 28 Oct 2026): RuBisCO binds CO₂ and also O₂ at the same active site; both gases in, both products out. */
const LIT_C2_BOTH: Part[] = ['co2', 'o2', 'rubisco', 'carbox', 'oxy', 'pga', 'pg2'];
void LIT_C2;
/** C3 · reduction (approved C₃ steps, 28 Oct 2026): ATP and NADPH in, 3-PGA → GAPDH → triose phosphate. C3b · regeneration:
 *  triose phosphate → PRK (with its ATP) → RuBP. C4 · triose phosphate out through TPT (Pᵢ back) to sucrose; starch. */
const LIT_RED: Part[] = ['pga', 'supply', 'reduce', 'tp'];
const LIT_REGEN: Part[] = ['tp', 'regen'];
void LIT_C3;
const LIT: Record<CellSlide, Part[]> = { C1: LIT_C1, C2: LIT_C2_BOTH, C3: LIT_RED, C3b: LIT_REGEN, C4: LIT_C4, C5: LIT_C5, C6: LIT_C6, C7: LIT_C7, C8: LIT_C8 };
/** One unit per slide (lecturer, 28 Oct 2026): the cycle per 3 CO₂, C5 per reaction, C6 per 2 O₂; C2 none (the counts are C5's). */
const UNIT: Record<CellSlide, Unit> = { C1: 'cycle', C2: 'none', C3: 'cycle', C3b: 'cycle', C4: 'cycle', C5: 'reaction', C6: 'loop', C7: 'cycle', C8: 'cycle' };
/** The strip window per slide: the organelles for the photorespiratory loop, the stroma side otherwise. */
const STRIP_WIN: Partial<Record<CellSlide, [number, number, number]>> = { C4: WIN.export, C6: WIN.right };
/** The handout's zoom (m3, listed first on C2–C8): the lit part large; dimmed parts cut by the frame are left out. */
const ZOOM3: Partial<Record<CellSlide, [number, number, number]>> = {
  C2: [100, 170, 560], C3: [0, 10, 600], C3b: [160, 36, 740], C4: [270, -30, 730], C5: [100, 156, 580],
  C6: [770, 5, 790], C7: [0, 10, 720], C8: [0, 0, 720],
};
/** Crops on the lit part, in panorama units [x, y, w] (height w × 0.75). */
const ZOOM: Partial<Record<CellSlide, [Arr, [number, number, number]]>> = {
  C2: ['strip', [100, 170, 560]],
  C5: ['strip', [100, 156, 580]],
  C6: ['strip', [780, 0, 760]],
};

interface V { id: string; name: string; arr: Arr; lit?: Part[]; o: CellOpts }
export function cellFigures(n: CellSlide): { PLATE: PlateText; VARIANTS: Variant[]; draw: (id: string) => string } {
  const limits = n === 'C8';
  const z3 = ZOOM3[n];
  const vs: V[] = [
    // C2–C8: the zoom first (the handout's figure); C1 is the overview itself
    ...(z3 ? [{ id: '3', name: 'In the cell · zoom on this slide’s part', arr: 'strip' as Arr, o: { limits, win: z3, clean: true } }] : []),
    { id: '1', name: 'In the cell · strip continuing the 7m1 chain', arr: 'strip', o: { limits, win: STRIP_WIN[n] } },
    { id: '2', name: 'In the cell · cell section (chloroplast, peroxisome, mitochondrion)', arr: 'cell', o: { limits } },
  ];
  const z = ZOOM[n];
  if (z) vs.push({ id: 'z', name: 'In the cell · zoom on the lit part', arr: z[0], o: { win: z[1], clean: true } });
  const close = n === 'C2' ? [{ id: '4', name: 'RuBisCO close-up (PDB 8RUC): one active site, CO₂ and O₂ both heading to it' }] : [];
  // RuBisCO's two reactions as a mirrored pair (RUBISCO_LAYOUT_BRIEF): listed first on C2 (no counts) and C5 (counts)
  const side = n === 'C2' || n === 'C5' ? [
    { id: 'r1', name: 'RuBisCO’s two reactions · in the strip: RuBP from below, carboxylation left, oxygenation right' },
    { id: 'r2', name: 'RuBisCO’s two reactions · two halves (carboxylation | oxygenation), RuBP below' },
    { id: 'r3', name: 'RuBisCO’s two reactions · a Y: RuBP the root, one arm per reaction' },
    ...(n === 'C2' ? [{ id: 'r4', name: 'RuBisCO’s two reactions · the active site: RuBP docked from below, CO₂ left, O₂ right' }] : []),
  ] : [];
  if (n === 'C8') {
    vs.push({ id: 'c', name: 'In the cell · strip · RuBisCO limit Ac alone', arr: 'strip', lit: LIT_C8C, o: { limits: true } });
    vs.push({ id: 'j', name: 'In the cell · strip · RuBP-regeneration limit Aj alone', arr: 'strip', lit: LIT_C8J, o: { limits: true } });
    vs.push({ id: 'p', name: 'In the cell · strip · TPU limit Ap alone', arr: 'strip', lit: LIT_C8P, o: { limits: true } });
  }
  return {
    PLATE: { n, title: '', status: 'draft', lead: '', points: [], refs: [] },
    VARIANTS: [...side, ...vs.slice(0, 2), ...close, ...vs.slice(2)].map(v => ({ id: v.id, name: v.name, anim: true })),
    draw: id => {
      if (id === 'r1' && side.length) return cellSvg(`cel${n}r1`, 'strip', LIT[n], { unit: UNIT[n], win: [0, 0, 800] });
      if (id === 'r4' && side.length) return rubsideClose(`cel${n}r4`, n === 'C5');
      if (id === 'r2' && side.length) return rubsidePanel(`cel${n}r2`, n === 'C5');
      if (id === 'r3' && side.length) return rubsideY(`cel${n}r3`, n === 'C5');
      if (id === '4' && close.length) return rubiscoCloseSvg(`cel${n}4`);
      const v = vs.find(x => x.id === id) ?? vs[0]; return cellSvg(`cel${n}${v.id}`, v.arr, v.lit ?? LIT[n], { unit: UNIT[n], ...v.o }); },
  };
}
