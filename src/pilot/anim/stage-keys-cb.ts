// Key lines on the stage for the slide 16 and 17 animations (cb1, cb4; lecturer, 29 Oct 2026: "people don't read the
// text under the animation; their attention is on the top: put it directly on the animation"). Each beat's take-home
// line, or the closing question, as one big rust line (wrapped into a few if long) on a paper pill at a free place on
// the stage; it fades in with its beat. withKeys() wraps a staging without touching its drawing: it adds the pills to
// the stage SVG and, after the staging draws a frame, sets their opacity (and hides the staging's own small copy of a
// line that a pill now shows big).
import type { Staging } from './types';

export interface KeyLine {
  /** the beat (0-based) it belongs to */
  beat: number;
  /** its lines, top to bottom */
  lines: string[];
  /** the pill's centre (stage units, viewBox 1600 × 740) */
  x: number; y: number;
  /** font size (px), default 40 */
  size?: number;
  /** when it fades in, s into the beat (default 0.6) */
  at?: number;
  /** the staging's own elements it replaces in its beat (CSS selectors inside the stage) */
  hide?: string[];
}

const PAD_X = 22, PAD_Y = 12;

export function withKeys(st: Staging, allKeys: KeyLine[]): Staging {
  // only the closing questions go on the stage (lecturer, 29 Oct 2026, late: "on the animation I only want the big
  // questions; the descriptions stay in the text below")
  const keys = allKeys.filter(k => /\?\s*$/.test(k.lines[k.lines.length - 1] ?? ''));
  const pill = (k: KeyLine, i: number): string => {
    const size = k.size ?? 40, lh = size * 1.18, y0 = k.y - ((k.lines.length - 1) * lh) / 2 + size * 0.35;
    const tspans = k.lines.map((l, j) => `<tspan x="${k.x}" y="${(y0 + j * lh).toFixed(1)}">${l}</tspan>`).join('');
    return `<g data-sk="${i}" opacity="0" style="pointer-events:none"><rect data-skr="${i}" rx="16" fill="#fbf9f4" fill-opacity="0.95" stroke="#e3dccb" stroke-width="1.5"/>
      <text data-skt="${i}" text-anchor="middle" style="font-size:${size}px;font-weight:700;fill:#b0431f">${tspans}</text></g>`;
  };
  return {
    ...st,
    svg: () => `${st.svg()}<g class="stage-keys">${keys.map(pill).join('')}</g>`,
    bind(stage) {
      const draw = st.bind(stage);
      const g = keys.map((_, i) => stage.querySelector<SVGGElement>(`[data-sk="${i}"]`));
      const r = keys.map((_, i) => stage.querySelector<SVGRectElement>(`[data-skr="${i}"]`));
      const tx = keys.map((_, i) => stage.querySelector<SVGTextElement>(`[data-skt="${i}"]`));
      const sized = keys.map(() => false);
      /** the pill fits its text, measured once the text is laid out */
      const fit = (i: number): void => {
        const b = tx[i]?.getBBox();
        if (!b || !b.width || !r[i]) return;
        r[i]!.setAttribute('x', (b.x - PAD_X).toFixed(1)); r[i]!.setAttribute('y', (b.y - PAD_Y).toFixed(1));
        r[i]!.setAttribute('width', (b.width + 2 * PAD_X).toFixed(1)); r[i]!.setAttribute('height', (b.height + 2 * PAD_Y).toFixed(1));
        sized[i] = true;
      };
      const hidden = keys.map(k => (k.hide ?? []).flatMap(sel => Array.from(stage.querySelectorAll<SVGElement>(sel))));
      // a question comes only once its beat's motion has finished (lecturer, 29 Oct 2026): the beat drawn every 0.4 s
      // until the stage stops changing (12 s if it never does)
      const isQ = keys.map(k => /\?\s*$/.test(k.lines[k.lines.length - 1] ?? ''));
      const rest0: number[] = [];
      const restAt = (b: number): number => {
        if (rest0[b] !== undefined) return rest0[b];
        let prev = '', same = 0, at = 12;
        for (let t = 0; t <= 24; t += 0.4) {
          draw(b, t);
          const sig = stage.innerHTML;
          if (sig === prev) { if (++same >= 2) { at = t - 0.8; break; } } else same = 0;
          prev = sig;
        }
        return (rest0[b] = Math.max(0, at));
      };
      return (beat, t) => {
        const b = Math.round(beat);
        const rest = keys.some((k, i) => isQ[i] && k.beat === b) ? restAt(b) : 0; // before drawing: it redraws the beat
        draw(beat, t);
        // the question takes the place of the beat's take-home: when it comes, the take-home fades out
        const qs = keys.filter((k, i) => isQ[i] && k.beat === b), qFrom = qs.length ? Math.max(...qs.map(k => k.at ?? 0.6), rest + 0.3) : Infinity;
        keys.forEach((k, i) => {
          if (!sized[i]) fit(i);
          const from = isQ[i] ? Math.max(k.at ?? 0.6, rest + 0.3) : k.at ?? 0.6;
          const out = !isQ[i] ? 1 - Math.max(0, Math.min(1, (t - qFrom) / 0.3)) : 1;
          const o = b === k.beat ? Math.max(0, Math.min(1, (t - from) / 0.5)) * out : 0;
          g[i]?.setAttribute('opacity', o.toFixed(3));
          hidden[i].forEach(el => { el.style.opacity = b === k.beat ? '0' : ''; });
        });
      };
    },
  };
}
