// Photosystem I, staging m3: why the photon split differs per light, on the two photosystems' absorption. Beats 1–3, the
// rule, the photon rows and the light on the chain: psim-common.ts.
// - Beat 4 (Emerson's enhancement): above the photon rows, the absorption of photosystem II (green) and photosystem I
//   (teal), 600–740 nm, its axis a strip coloured by wavelength; each row lights its light's band over the curves, with
//   markers where it meets them: far-red (> 700 nm) meets PSI's curve, PSII's barely (row 1); red (650 nm, Emerson's shorter red) meets both, PSII's more
//   (row 2); both bands (row 3).
// The shapes are approximate and labelled so: Gaussian bands for the Chl a peak (PSII 676 nm, PSI 680 nm), the Chl b
// shoulder near 650 nm (larger in PSII with its LHCII), a vibronic band near 625 nm, and PSI's long-wave "red" chlorophylls
// near 708 nm, which give it the far-red tail that PSII lacks (PSII's absorption has fallen to ≈ 4 % of its peak at
// 700 nm, PSI's to ≈ 35 %; cf. the action spectra of the two photosystems in leaves, Laisk et al. 2014, BBA 1837:315).
import { B4, curve, makeStaging, ptext, revealClip, wlStrip } from './psim-common';
import { f1, tw, type V } from './antenna-common';
import { PSIM_M3 } from './beats-psim';

const g = (x: number, m: number, s: number): number => Math.exp(-((x - m) ** 2) / (2 * s * s));
const rawII = (x: number): number => g(x, 676, 9.5) + 0.42 * g(x, 652, 8) + 0.18 * g(x, 625, 14);
const rawI = (x: number): number => 0.95 * g(x, 680, 10) + 0.3 * g(x, 652, 9) + 0.18 * g(x, 625, 14) + 0.32 * g(x, 708, 9);
const NM: number[] = Array.from({ length: 57 }, (_, i) => 600 + i * 2.5);
const maxII = Math.max(...NM.map(rawII)), maxI = Math.max(...NM.map(rawI));
const AII = (x: number): number => rawII(x) / maxII, AI = (x: number): number => rawI(x) / maxI;

const X = (nm: number): number => 950 + (nm - 600) * (590 / 140);
const Y = (a: number): number => 420 - a * 160;
const pts = (f: (x: number) => number): V[] => NM.map(nm => [X(nm), Y(f(nm))]);
const RED: [number, number] = [646, 654], FAR: [number, number] = [702, 726];
const DRAW = [0.5, 1.1];

function panel(p: string): string {
  const band = (k: string, r: [number, number], cls: string, lab: string, labCls: string): string =>
    `<g data-k="${k}" opacity="0" display="none"><rect class="${cls}" x="${f1(X(r[0]))}" y="${Y(1.1)}" width="${f1(X(r[1]) - X(r[0]))}" height="${f1(Y(0) - Y(1.1))}"/>
      ${ptext((X(r[0]) + X(r[1])) / 2, Y(1.1) - 6, lab, `pm-xs ${labCls}`, 'middle')}</g>`;
  const mk = (k: string, nm: number, a: number, cls: string): string => `<circle data-k="${k}" opacity="0" display="none" class="pm-mk ${cls}" cx="${f1(X(nm))}" cy="${f1(Y(a))}" r="7"/>`;
  return `<defs>${revealClip(p, 'cS', X(600) - 6, Y(1.1) - 6, Y(0) - Y(1.1) + 12)}</defs>
    ${band('bR', RED, 'pm-band-red', '650 nm', 'pm-red')}${band('bF', FAR, 'pm-band-fr', '&gt; 700 nm', 'pm-fr')}
    <path class="pm-axis" d="M${X(600)},${Y(1.1)}V${Y(0)}H${X(740) + 6}"/>
    <text class="pm-ax" transform="translate(${X(600) - 18} ${Y(0.55)}) rotate(-90)" text-anchor="middle">absorption</text>
    ${wlStrip(p, 'wl3', X(600), X(740), Y(0) + 6, 20, 600, 740, [[600, '#e2581d'], [650, '#d0401f'], [684, '#c8361e'], [702, '#7a1f17'], [740, '#5e1811']], [[662, 'red'], [718, 'far-red']])}
    ${[600, 640, 680, 720].map(nm => ptext(X(nm), Y(0) + 44, String(nm), 'pm-tick', 'middle')).join('')}
    ${ptext(X(600) + 8, Y(1.1) + 6, 'shapes approximate', 'pm-xs')}
    <g clip-path="url(#${p}-cS)"><path class="pm-c2" d="${curve(pts(AII))}"/><path class="pm-c1" d="${curve(pts(AI))}"/></g>
    ${ptext(X(642) - 4, Y(0.62), 'PSII', 'pm-t pm-ii', 'end')}${ptext(X(689), Y(0.82), 'PSI', 'pm-t pm-i')}
    ${mk('mR2', 650, AII(650), 'pm-c2')}${mk('mR1', 650, AI(650), 'pm-c1')}${mk('mF2', 712, AII(712), 'pm-c2')}${mk('mF1', 712, AI(712), 'pm-c1')}`;
}

export const STAGING = makeStaging({
  id: 'm3',
  name: 'M3 · The two photosystems’ spectra',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; the red drop; Emerson, then the absorption of PSII and PSI (approximate) with each light’s band over them, and the photons paired off per light (1 / 3 / 6 electrons through).',
  beats: PSIM_M3,
  lamps: false,
  table: { y0: 484, rowH: 66, o2: 'none' },
  panel,
  bind(c) {
    const W = X(740) - X(600) + 12;
    return t4 => {
      c.set(c.q('cS'), 'width', f1(W * tw(t4, DRAW[0], DRAW[1])));
      const row = (r: number): number => tw(t4, B4.rows[r], B4.rows[r] + 0.3);
      const far = Math.max(row(0) * (1 - row(1)), row(2)), red = Math.max(row(1) * (1 - row(2)), row(2));
      c.op(c.q('bF'), far); c.op(c.q('mF2'), far); c.op(c.q('mF1'), far);
      c.op(c.q('bR'), red); c.op(c.q('mR2'), red); c.op(c.q('mR1'), red);
    };
  },
});
