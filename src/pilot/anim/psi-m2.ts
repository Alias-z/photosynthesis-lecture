// Photosystem I, staging m2: Emerson's enhancement on his 1957 curves, with bars. Beats 1–3, the rule, the photon rows and
// the light on the chain: psim-common.ts.
// - Beat 4 (Emerson's enhancement): above the photon rows, Emerson's 1957 quantum yield against wavelength (660–720 nm, the
//   axis a strip coloured red → far-red): each wavelength alone falls beyond 680 nm ("red drop"); with shorter red light
//   added it stays high. The photon rows end in bars of the electrons that get through: 1 / 3 / 6.
// The curves are redrawn from Emerson, Chalmers & Cederstrand 1957, PNAS 43:133, Figs. 2–3 (Chlorella at 20 °C; solid
// dots: one wavelength alone; crosses: with supplementary light), read off the page scan (reference board L5, image d) to
// about ±0.005 in yield and ±1 nm. The 5 °C curve is left out.
import { curve, makeStaging, ptext, revealClip, wlStrip, B4 } from './psim-common';
import { f1, tw, type V } from './antenna-common';
import { PSIM_M2 } from './beats-psim';

const X = (nm: number): number => 966 + (nm - 660) * 6;
const Y = (q: number): number => 420 - q * 1100;
const ALONE: Array<[number, number]> = [[660, 0.100], [665, 0.104], [670, 0.105], [675, 0.105], [680, 0.102], [685, 0.090], [690, 0.060], [695, 0.027], [700, 0.006]];
const ADDED: Array<[number, number]> = [[660, 0.129], [670, 0.130], [680, 0.132], [690, 0.133], [695, 0.132], [700, 0.124], [705, 0.112], [710, 0.096], [715, 0.079], [720, 0.060]];
const pts = (d: Array<[number, number]>): V[] => d.map(([nm, q]) => [X(nm), Y(q)]);
const DRAW1 = [0.5, 1.0], DRAW2 = [0.8, 1.3];

function panel(p: string): string {
  return `<defs>${revealClip(p, 'cv1', X(660) - 8, Y(0.15) - 10, Y(0) - Y(0.15) + 20)}${revealClip(p, 'cv2', X(660) - 8, Y(0.15) - 10, Y(0) - Y(0.15) + 20)}</defs>
    <path class="pm-axis" d="M${X(660)},${Y(0.15)}V${Y(0)}H${X(720) + 6}"/>
    ${[0, 0.05, 0.10, 0.15].map(q => `<path class="pm-tk" d="M${X(660) - 6},${f1(Y(q))}h6"/>${ptext(X(660) - 10, Y(q) + 5, q === 0 ? '0' : q.toFixed(2), 'pm-tick', 'end')}`).join('')}
    <text class="pm-ax" transform="translate(${X(660) - 52} ${Y(0.075)}) rotate(-90)" text-anchor="middle">O₂ per photon</text>
    ${wlStrip(p, 'wl2', X(660), X(720), Y(0) + 6, 20, 660, 720, [[660, '#c8361e'], [688, '#c8361e'], [700, '#7a1f17'], [720, '#7a1f17']], [[672, 'red'], [710, 'far-red']])}
    ${[660, 680, 700, 720].map(nm => ptext(X(nm), Y(0) + 44, String(nm), 'pm-tick', 'middle')).join('')}
    <g clip-path="url(#${p}-cv1)"><path class="pm-cv" d="${curve(pts(ALONE))}"/>${pts(ALONE).map(([x, y]) => `<circle class="pm-pt" cx="${f1(x)}" cy="${f1(y)}" r="4"/>`).join('')}</g>
    <g clip-path="url(#${p}-cv2)"><path class="pm-cv pm-dot" d="${curve(pts(ADDED))}"/></g>
    ${ptext(X(661), Y(0.035), 'each wavelength', 'pm-xs')}${ptext(X(661), Y(0.035) + 18, 'alone', 'pm-xs')}
    ${ptext(X(661), Y(0.141), 'with shorter red light added', 'pm-xs')}
    ${ptext(X(700) + 2, Y(0.05), 'red drop', 'pm-xs pm-fr')}
    ${ptext(1346, 262, 'Emerson et al. 1957,', 'pm-xs')}${ptext(1346, 281, 'Figs. 2–3, redrawn', 'pm-xs')}`;
}

export const STAGING = makeStaging({
  id: 'm2',
  name: 'M2 · Curves and bars',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; the red drop; Emerson’s 1957 curves redrawn (yield rescued by added red light), then the photons paired off per light, ending in bars of the electrons that get through (1 / 3 / 6).',
  beats: PSIM_M2,
  lamps: false,
  table: { y0: 484, rowH: 66, o2: 'bars' },
  panel,
  bind(c) {
    const W = X(720) - X(660) + 16;
    return t4 => {
      c.set(c.q('cv1'), 'width', f1(W * tw(t4, DRAW1[0], DRAW1[1])));
      c.set(c.q('cv2'), 'width', f1(W * tw(t4, DRAW2[0], DRAW2[1])));
      void B4;
    };
  },
});
