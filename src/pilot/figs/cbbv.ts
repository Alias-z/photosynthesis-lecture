// Variants of the CO₂-fixation overview (figs/cbb-schema.ts) for slides C1–C8, joined after each slide's own figures in
// plates.ts (prefix k): 3 layouts × 2 looks per slide, each lighting that slide's part, plus crops on the lit part (C2, C5,
// C6) and one limit at a time (C8). Brief: research/redo-2026-10-28/CBB_SCHEMA_BRIEF.md.
import type { PlateText, Variant } from '../types';
import {
  cbbSvg, LIT_C1, LIT_C2, LIT_C3, LIT_C4, LIT_C5, LIT_C6, LIT_C7, LIT_C8, LIT_C8C, LIT_C8J, LIT_C8P,
  type CbbOpts, type Layout, type Look, type Part,
} from './cbb-schema';

export type CbbSlide = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8';
export const CBB_SLIDES: CbbSlide[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];

const LIT: Record<CbbSlide, Part[]> = { C1: LIT_C1, C2: LIT_C2, C3: LIT_C3, C4: LIT_C4, C5: LIT_C5, C6: LIT_C6, C7: LIT_C7, C8: LIT_C8 };
const LAYOUTS: Array<[string, Layout, string]> = [
  ['A', 'cycle', 'upright cycle (pick a), loop to the right'],
  ['B', 'chain', 'joins the chain: its thylakoid at the left'],
  ['C', 'chloro', 'in the chloroplast (v10 frame)'],
];
const LOOKS: Array<[string, Look, string]> = [['1', 'bil', 'dimmed grey (7m1)'], ['2', 'glow', 'lit parts glow (c2c3)']];

interface Extra { id: string; name: string; layout: Layout; look: Look; lit?: Part[]; o: CbbOpts }
/** Crops on the lit part (4:3 windows of the 800 × 600 figure), and C8's limits one at a time. */
const EXTRA: Partial<Record<CbbSlide, Extra[]>> = {
  C2: [
    { id: 'Z1', name: 'zoom on RuBisCO · upright cycle', layout: 'cycle', look: 'bil', o: { view: [0, 250, 440, 330], noKey: true } },
    { id: 'Z2', name: 'zoom on RuBisCO · joins the chain', layout: 'chain', look: 'bil', o: { view: [110, 250, 440, 330], noKey: true } },
  ],
  C5: [
    { id: 'Z1', name: 'zoom: carboxylation and oxygenation · upright cycle', layout: 'cycle', look: 'bil', o: { view: [0, 196, 520, 390], noKey: true } },
    { id: 'Z2', name: 'zoom: carboxylation and oxygenation · joins the chain', layout: 'chain', look: 'bil', o: { view: [110, 230, 480, 360], noKey: true } },
  ],
  C6: [
    { id: 'Z1', name: 'zoom on the loop · upright cycle', layout: 'cycle', look: 'bil', o: { view: [180, 120, 620, 465], noKey: true } },
    { id: 'Z2', name: 'zoom on the loop · joins the chain', layout: 'chain', look: 'bil', o: { view: [260, 140, 540, 405], noKey: true } },
  ],
  C8: [
    { id: 'L1', name: 'RuBisCO limit Ac alone · upright cycle', layout: 'cycle', look: 'bil', lit: LIT_C8C, o: { limits: true } },
    { id: 'L2', name: 'RuBP-regeneration limit Aj alone · upright cycle', layout: 'cycle', look: 'bil', lit: LIT_C8J, o: { limits: true } },
    { id: 'L3', name: 'TPU limit Ap alone · upright cycle', layout: 'cycle', look: 'bil', lit: LIT_C8P, o: { limits: true } },
  ],
};

/** The figure set of one slide, shaped like a slide module so that plates.ts can join it after the slide's own figures. */
export function cbbFigures(n: CbbSlide): { PLATE: PlateText; VARIANTS: Variant[]; draw: (id: string) => string } {
  const base: Variant[] = LAYOUTS.flatMap(([l, , ln]) => LOOKS.map(([k, , kn]) => ({ id: `${l}${k}`, name: `CO₂-fixation schema · ${ln} · ${kn}`, anim: true })));
  const extra = EXTRA[n] ?? [];
  const VARIANTS: Variant[] = [...base, ...extra.map(e => ({ id: e.id, name: `CO₂-fixation schema · ${e.name}` }))];
  const limits = n === 'C8';
  const draw = (id: string): string => {
    const e = extra.find(x => x.id === id);
    if (e) return cbbSvg(`cbb${n}${id}`, e.layout, e.look, e.lit ?? LIT[n], e.o);
    const lay = LAYOUTS.find(x => x[0] === id[0]) ?? LAYOUTS[0], look = LOOKS.find(x => x[0] === id[1]) ?? LOOKS[0];
    return cbbSvg(`cbb${n}${id}`, lay[1], look[1], LIT[n], { limits });
  };
  return { PLATE: { n, title: '', status: 'draft', lead: '', points: [], refs: [] }, VARIANTS, draw };
}
