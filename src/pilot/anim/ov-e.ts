// 'ove' · How plants cope with scarce CO₂ (slide C10o; captions OV, anim/beats-ov.ts): the summary table, text only
// (lecturer, 30 Oct 2026: "make a variant of the summarized table just with text; that information is important, you
// can't easily illustrate it with a graph"). The table is figs/ov-table.ts; columns in layout b's climate order.
// - Beat 1 (the problem): the empty table, its row labels, fades in.
// - Beats 2–5: one column each, C₃, C₂, C₄, CAM: its head, then its rows one after another, top to bottom (each fade
//   0.8 s, nothing else moving); the beat ends still.
// - Beat 6: the rust arrow draws under the table, "C₂, C₄ and CAM all evolved from C₃, many times" fades in; then the
//   closing question, after the motion.
import { COLS, ROWS, evoSvg, tableSvg, type Lay } from '../figs/ov-table';
import { OV } from './beats-ov';
import type { Staging } from './types';

const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };

/** The stage layout: 1600 wide, the closing question below the evolution line. */
export const STAGE: Lay = { x0: 40, lw: 220, cw: 330, y0: 18, name: 44, small: 18, cell: 22, lh: 28, pad: 10 };
const P = 'ote';
/** A column's steps (s): the head, then each row, 0.8 s each with 0.2 s between. */
const step = (k: number): [number, number] => [0.3 + k * 1.0, 1.1 + k * 1.0];

export const STAGING: Staging = {
  id: 'ove',
  name: 'ove · the summary table, text only',
  note: 'The summary table only, in text: C₃, C₂, C₄, CAM in climate order; rows how it copes (bold), what it gains, what it costs, examples; one column per beat, row by row; then "evolved from C₃, many times" and the question.',
  beats: OV,
  keys: [
    { beat: 5, text: 'How does a C₂ plant', x: 800, y: 676, size: 40 },
    { beat: 5, text: 'trap its CO₂?', x: 800, y: 721, size: 40 },
  ],
  svg: () => {
    const tb = tableSvg(P, STAGE, '0');
    return `<rect x="0" y="0" width="1600" height="740" style="fill:#fbfaf6"/>${tb.svg}${evoSvg(P, STAGE, tb.bottom + 24, 20, '0')}`;
  },
  bind(stage) {
    const els = new Map<string, Element>();
    stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
    const op = (k: string, v: number): void => { const el = els.get(k); if (el) el.setAttribute('opacity', v.toFixed(3)); };
    const at = (k: string, a: string, v: string): void => { els.get(k)?.setAttribute(a, v); };
    return (beat, t) => {
      op(`${P}-grid`, beat === 0 ? ease(t, 0.2, 1.2) : 1);
      COLS.forEach((c, i) => {
        // column i fills in beat i + 1, stays after
        const b = i + 1, on = (k: number): number => (beat < b ? 0 : beat > b ? 1 : ease(t, ...step(k)));
        op(`${P}-${c.id}-h`, on(0));
        ROWS.forEach((_, r) => op(`${P}-${c.id}-r${r}`, on(r + 1)));
      });
      const draw = beat === 5 ? ease(t, 0.3, 1.8) : 0;
      op(`${P}-evo`, beat === 5 ? 1 : 0);
      at(`${P}-evo-l`, 'stroke-dashoffset', (1 - draw).toFixed(4));
      op(`${P}-evo-h`, beat === 5 ? ease(t, 1.6, 1.9) : 0);
      op(`${P}-evo-t`, beat === 5 ? ease(t, 2.0, 2.8) : 0);
    };
  },
};
