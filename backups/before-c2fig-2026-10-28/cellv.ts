// Variants of the dark reactions drawn in the real cell (figs/cell-schema.ts) for slides C1–C8, joined after each
// slide's own figures in plates.ts (prefix m): m3 the zoom on the slide's part with a map of the whole strip (first on
// C2–C8), m1 the strip (continuing the 7m1 chain), m2 the cell section, mz a crop on the lit part (C2, C5, C6); C8 adds
// its limits one at a time. Only the lit part is named and counted. Brief: research/redo-2026-10-28/SPATIAL_DARK_BRIEF.md.
import type { PlateText, Variant } from '../types';
import {
  cellSvg, WIN, LIT_C1, LIT_C2, LIT_C3, LIT_C4, LIT_C5, LIT_C6, LIT_C7, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P,
  type Arr, type CellOpts, type Part, type Unit,
} from './cell-schema';

export type CellSlide = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8';
export const CELL_SLIDES: CellSlide[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
const LIT: Record<CellSlide, Part[]> = { C1: LIT_C1, C2: LIT_C2, C3: LIT_C3, C4: LIT_C4, C5: LIT_C5, C6: LIT_C6, C7: LIT_C7, C8: LIT_C8 };
/** One unit per slide (lecturer, 28 Oct 2026): the cycle per 3 CO₂, C5 per reaction, C6 per 2 O₂. */
const UNIT: Record<CellSlide, Unit> = { C1: 'cycle', C2: 'cycle', C3: 'cycle', C4: 'cycle', C5: 'reaction', C6: 'loop', C7: 'cycle', C8: 'cycle' };
/** The strip window per slide: the organelles for the photorespiratory loop, the stroma side otherwise. */
const STRIP_WIN: Partial<Record<CellSlide, [number, number, number]>> = { C4: WIN.export, C6: WIN.right };
/** The handout's zoom (m3, listed first on C2–C8): the lit part large, a map of the whole strip in a corner. */
const ZOOM3: Partial<Record<CellSlide, [[number, number, number], 'tl' | 'tr' | 'bl' | 'br', number?]>> = {
  C2: [[96, 250, 470], 'tr'], C3: [[0, 20, 640], 'tr'], C4: [[270, -30, 750], 'bl'], C5: [[96, 250, 520], 'br'],
  C6: [[770, 5, 790], 'br', 200], C7: [[0, 10, 720], 'tr'], C8: [[0, 0, 720], 'br'],
};
/** Crops on the lit part, in panorama units [x, y, w] (height w × 0.75). */
const ZOOM: Partial<Record<CellSlide, [Arr, [number, number, number]]>> = {
  C2: ['strip', [96, 250, 470]],
  C5: ['strip', [96, 250, 520]],
  C6: ['strip', [780, 0, 760]],
};

interface V { id: string; name: string; arr: Arr; lit?: Part[]; o: CellOpts }
export function cellFigures(n: CellSlide): { PLATE: PlateText; VARIANTS: Variant[]; draw: (id: string) => string } {
  const limits = n === 'C8';
  const z3 = ZOOM3[n];
  const vs: V[] = [
    // C2–C8: the zoom with its map first (the handout's figure); C1 is the overview itself
    ...(z3 ? [{ id: '3', name: 'In the cell · zoom on this slide’s part, with a map of the whole strip', arr: 'strip' as Arr, o: { limits, win: z3[0], map: { corner: z3[1], w: z3[2] } } }] : []),
    { id: '1', name: 'In the cell · strip continuing the 7m1 chain', arr: 'strip', o: { limits, win: STRIP_WIN[n] } },
    { id: '2', name: 'In the cell · cell section (chloroplast, peroxisome, mitochondrion)', arr: 'cell', o: { limits } },
  ];
  const z = ZOOM[n];
  if (z) vs.push({ id: 'z', name: 'In the cell · zoom on the lit part', arr: z[0], o: { win: z[1] } });
  if (n === 'C8') {
    vs.push({ id: 'c', name: 'In the cell · strip · Rubisco limit Ac alone', arr: 'strip', lit: LIT_C8C, o: { limits: true } });
    vs.push({ id: 'j', name: 'In the cell · strip · RuBP-regeneration limit Aj alone', arr: 'strip', lit: LIT_C8J, o: { limits: true } });
    vs.push({ id: 'p', name: 'In the cell · strip · TPU limit Ap alone', arr: 'strip', lit: LIT_C8P, o: { limits: true } });
  }
  return {
    PLATE: { n, title: '', status: 'draft', lead: '', points: [], refs: [] },
    VARIANTS: vs.map(v => ({ id: v.id, name: v.name, anim: true })),
    draw: id => { const v = vs.find(x => x.id === id) ?? vs[0]; return cellSvg(`cel${n}${v.id}`, v.arr, v.lit ?? LIT[n], { unit: UNIT[n], ...v.o }); },
  };
}
