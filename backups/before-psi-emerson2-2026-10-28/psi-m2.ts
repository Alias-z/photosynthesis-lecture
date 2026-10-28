// Photosystem I, staging m2: Emerson's "red drop" and the enhancement, redrawn in the slide's colours. Beats 1–2 and the
// frame: psim-common.ts.
// - Beat 3 (holds: ready; the drop; the rescue): the panel holds Emerson's clipping and a plot of quantum yield (O₂ per
//   absorbed photon) against wavelength, 660–720 nm, its axis a strip coloured red → far-red. (1) The curve for each
//   wavelength alone draws in: flat to ≈ 680 nm, then falling to almost nothing at 700 nm ("red drop"). (2) The curve with
//   shorter-wave light added draws in: it stays high to 700 nm and beyond. (3) The enhancement as three bars (O₂ rate,
//   illustrative: far-red alone 1, red alone 3, both 5, above the dashed 1 + 3), each bar rising while its light falls on
//   the chain (far-red onto PSI; red onto PSII and, thinner, PSI).
// - Beat 4 (hold: written): the brief's two statements under the plot; then the common zoom out.
// The curves are redrawn from Emerson, Chalmers & Cederstrand 1957, PNAS 43:133, Figs. 2–3 (Chlorella at 20 °C; solid
// dots: one wavelength alone; crosses: with supplementary light), read off the page scan (reference board L5, image d) to
// about ±0.005 in yield and ±1 nm. The 5 °C curve is left out.
import { curve, lightAt, makeStaging, ptext, revealClip, sayBlock, wlStrip, type Step } from './psim-common';
import { f1, tw, type V } from './antenna-common';
import { PSIM_M2 } from './beats-psim';

/* ---- the plot (stage units) */
const X = (nm: number): number => 940 + (nm - 660) * 6;
const Y = (q: number): number => 500 - q * 1667;
const ALONE: Array<[number, number]> = [[660, 0.100], [665, 0.104], [670, 0.105], [675, 0.105], [680, 0.102], [685, 0.090], [690, 0.060], [695, 0.027], [700, 0.006]];
const ADDED: Array<[number, number]> = [[660, 0.129], [670, 0.130], [680, 0.132], [690, 0.133], [695, 0.132], [700, 0.124], [705, 0.112], [710, 0.096], [715, 0.079], [720, 0.060]];
const pts = (d: Array<[number, number]>): V[] => d.map(([nm, q]) => [X(nm), Y(q)]);

/* ---- the bars (stage units): O₂ rate, illustrative, as m1's count */
const BAR = { y0: 500, unit: 44, w: 44, xs: [1350, 1414, 1478] };
const RATES = [1, 3, 5], SUM = 4;

/* ---- timing (s into beat 3) */
const READY = 1.6;
const DRAW1 = [1.7, 3.3], DROP = 3.2, DRAW2 = [3.65, 5.0];
const STEPS: Step[] = [
  { on: 5.35, off: 6.3, far: true },
  { on: 6.45, off: 7.4, red: true },
  { on: 7.55, off: 999, red: true, far: true },
];
const GROW = [5.6, 6.7, 7.8], SUMT = 8.55, END3 = 9.1;

function panel(p: string): string {
  const axes = `<path class="pm-axis" d="M${X(660)},${Y(0.15)}V${Y(0)}H${X(720) + 6}"/>
    ${[0, 0.05, 0.10, 0.15].map(q => `<path class="pm-tk" d="M${X(660) - 6},${f1(Y(q))}h6"/>${ptext(X(660) - 10, Y(q) + 5, q === 0 ? '0' : q.toFixed(2), 'pm-tick', 'end')}`).join('')}
    <text class="pm-ax" transform="translate(${X(660) - 54} ${Y(0.075)}) rotate(-90)" text-anchor="middle">O₂ per absorbed photon</text>
    ${wlStrip(p, 'wl', X(660), X(720), Y(0) + 6, 22, 660, 720, [[660, '#c8361e'], [688, '#c8361e'], [700, '#7a1f17'], [720, '#7a1f17']], [[672, 'red'], [710, 'far-red']])}
    ${[660, 680, 700, 720].map(nm => ptext(X(nm), Y(0) + 48, String(nm), 'pm-tick', 'middle')).join('')}
    ${ptext(X(690), Y(0) + 72, 'wavelength (nm)', 'pm-ax', 'middle')}`;
  const c1 = `<g clip-path="url(#${p}-cv1)"><path class="pm-cv" d="${curve(pts(ALONE))}"/>${pts(ALONE).map(([x, y]) => `<circle class="pm-pt" cx="${f1(x)}" cy="${f1(y)}" r="4.5"/>`).join('')}</g>
    <g data-k="lab1" opacity="0" display="none">${ptext(X(661), Y(0.028), 'each wavelength', 'pm-t')}${ptext(X(661), Y(0.028) + 23, 'alone', 'pm-t')}</g>
    <g data-k="drop" opacity="0" display="none"><path class="pm-tk" d="M${f1(X(699))},${f1(Y(0.04))}L${f1(X(694.5))},${f1(Y(0.03))}"/>${ptext(X(700), Y(0.042), 'red drop', 'pm-t pm-fr')}</g>`;
  const c2 = `<g clip-path="url(#${p}-cv2)"><path class="pm-cv pm-dot" d="${curve(pts(ADDED))}"/></g>
    <g data-k="lab2" opacity="0" display="none">${ptext(X(661), Y(0.141), 'with shorter red light added', 'pm-t')}</g>`;
  const bars = `<defs><linearGradient id="${p}-both" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7a1f17"/><stop offset="1" stop-color="#c8361e"/></linearGradient></defs>
    ${ptext(BAR.xs[0], Y(0.15) + 2, 'O₂ rate', 'pm-t')}${ptext(BAR.xs[0], Y(0.15) + 24, 'illustrative', 'pm-s')}
    <path class="pm-axis" d="M${BAR.xs[0] - 10},${BAR.y0}H${BAR.xs[2] + BAR.w + 10}"/>
    ${RATES.map((_, i) => `<rect data-k="bar${i}" x="${BAR.xs[i]}" y="${BAR.y0}" width="${BAR.w}" height="0" ${i === 2 ? `fill="url(#${p}-both)"` : `class="${i ? 'pm-bar-red' : 'pm-bar-fr'}"`}/>`).join('')}
    ${ptext(BAR.xs[0] + BAR.w / 2, BAR.y0 + 26, 'far-red', 'pm-s pm-fr', 'middle')}${ptext(BAR.xs[1] + BAR.w / 2, BAR.y0 + 26, 'red', 'pm-s pm-red', 'middle')}${ptext(BAR.xs[2] + BAR.w / 2, BAR.y0 + 26, 'both', 'pm-s pm-t', 'middle')}
    <g data-k="sum" opacity="0" display="none"><path class="pm-sum" d="M${BAR.xs[2] - 8},${BAR.y0 - SUM * BAR.unit}H${BAR.xs[2] + BAR.w + 8}"/>${ptext(BAR.xs[2] + BAR.w + 12, BAR.y0 - SUM * BAR.unit + 6, '1 + 3', 'pm-s')}</g>`;
  return `<defs>${revealClip(p, 'cv1', X(660) - 8, Y(0.15) - 10, Y(0) - Y(0.15) + 20)}${revealClip(p, 'cv2', X(660) - 8, Y(0.15) - 10, Y(0) - Y(0.15) + 20)}</defs>
    ${ptext(1192, 84, 'Quantum yield', 'pm-h')}${ptext(1192, 112, 'of the alga’s photosynthesis', 'pm-t')}
    ${ptext(1192, 140, 'redrawn from Emerson et al. 1957', 'pm-s')}
    ${axes}${c1}${c2}${bars}
    <path class="pm-rule" d="M886,592H${1584 - 26}"/>
    ${sayBlock(886, [622, 649, 686, 713])}`;
}

export const STAGING = makeStaging({
  id: 'm2',
  name: 'M2 · The red drop and the enhancement',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; Emerson’s 1957 quantum-yield curves redrawn (red drop, rescue by added red light), then the enhancement as bars, with red and far-red light on both photosystems.',
  beats: PSIM_M2,
  lamps: false,
  holds3: [READY, 3.55, 5.3], end3: END3,
  holds4: [1.1], out4: 1.15,
  panel,
  bind(c) {
    const W = X(720) - X(660) + 16;
    return (t3, t4) => {
      c.set(c.q('cv1'), 'width', f1(W * tw(t3, DRAW1[0], DRAW1[1])));
      c.set(c.q('cv2'), 'width', f1(W * tw(t3, DRAW2[0], DRAW2[1])));
      c.op(c.q('lab1'), tw(t3, DRAW1[0] + 0.3, DRAW1[0] + 0.7));
      c.op(c.q('drop'), tw(t3, DROP, DROP + 0.35));
      c.op(c.q('lab2'), tw(t3, DRAW2[0] + 0.3, DRAW2[0] + 0.7));
      RATES.forEach((r, i) => {
        const h = r * BAR.unit * tw(t3, GROW[i], GROW[i] + 0.5);
        const el = c.q(`bar${i}`);
        c.set(el, 'y', f1(BAR.y0 - h));
        c.set(el, 'height', f1(h));
      });
      c.op(c.q('sum'), tw(t3, SUMT, SUMT + 0.35));
      c.op(c.q('say1'), tw(t4, 0.1, 0.5));
      c.op(c.q('say2'), tw(t4, 0.55, 0.95));
      return lightAt(STEPS, t3);
    };
  },
});
