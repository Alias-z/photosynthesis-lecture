// Photosystem I, staging m3: why the two lights differ, on the two photosystems' absorption. Beats 1–2 and the frame:
// psim-common.ts.
// - Beat 3 (holds: ready; the spectra; red): the panel holds Emerson's clipping and the absorption of photosystem II (in
//   its green) and photosystem I (in its teal), 600–740 nm, its axis a strip coloured by wavelength. (1) The two curves
//   draw in: both peak near 680 nm; photosystem I's reaches on into the far-red. (2) The red lamp's band (680 nm) lights:
//   it meets both curves high (markers), and on the chain red falls on PSII and PSI, both glow. (3) The far-red band
//   (> 700 nm) lights: it meets photosystem I's curve, photosystem II's barely; on the chain far-red falls on PSI.
// - Beat 4 (hold: written): the brief's two statements; red joins far-red on the chain; then the common zoom out.
// The shapes are approximate and labelled so: Gaussian bands for the Chl a peak (PSII 676 nm, PSI 680 nm), the Chl b
// shoulder near 650 nm (larger in PSII with its LHCII), a vibronic band near 625 nm, and PSI's long-wave "red" chlorophylls
// near 708 nm, which give it the far-red tail that PSII lacks (PSII's absorption has fallen to ≈ 4 % of its peak at
// 700 nm, PSI's to ≈ 35 %; cf. the action spectra of the two photosystems in leaves, Laisk et al. 2014, BBA 1837:315).
import { curve, lightAt, makeStaging, ptext, revealClip, sayBlock, wlStrip, type Light, type Step } from './psim-common';
import { f1, tw, type V } from './antenna-common';
import { PSIM_M3 } from './beats-psim';

/* ---- the spectra (relative absorption, peak 1) */
const g = (x: number, m: number, s: number): number => Math.exp(-((x - m) ** 2) / (2 * s * s));
const rawII = (x: number): number => g(x, 676, 9.5) + 0.42 * g(x, 652, 8) + 0.18 * g(x, 625, 14);
const rawI = (x: number): number => 0.95 * g(x, 680, 10) + 0.3 * g(x, 652, 9) + 0.18 * g(x, 625, 14) + 0.32 * g(x, 708, 9);
const NM: number[] = Array.from({ length: 57 }, (_, i) => 600 + i * 2.5);
const maxII = Math.max(...NM.map(rawII)), maxI = Math.max(...NM.map(rawI));
const AII = (x: number): number => rawII(x) / maxII, AI = (x: number): number => rawI(x) / maxI;

/* ---- the plot (stage units) */
const X = (nm: number): number => 930 + (nm - 600) * (620 / 140);
const Y = (a: number): number => 500 - a * 220;
const pts = (f: (x: number) => number): V[] => NM.map(nm => [X(nm), Y(f(nm))]);
const RED: [number, number] = [676, 684], FAR: [number, number] = [702, 726];

/* ---- timing (s into beat 3) */
const READY = 1.6;
const DRAW_II = [1.7, 2.8], DRAW_I = [2.9, 4.0];
const STEPS: Step[] = [
  { on: 4.25, off: 6.05, red: true },
  { on: 6.1, off: 999, far: true },
];
const END3 = 8.0;

function panel(p: string): string {
  const axes = `<path class="pm-axis" d="M${X(600)},${Y(1.1)}V${Y(0)}H${X(740) + 6}"/>
    <text class="pm-ax" transform="translate(${X(600) - 20} ${Y(0.55)}) rotate(-90)" text-anchor="middle">absorption</text>
    ${wlStrip(p, 'wl', X(600), X(740), Y(0) + 6, 22, 600, 740, [[600, '#e2581d'], [650, '#d0401f'], [684, '#c8361e'], [702, '#7a1f17'], [740, '#5e1811']], [[662, 'red'], [718, 'far-red']])}
    ${[600, 640, 680, 720].map(nm => ptext(X(nm), Y(0) + 48, String(nm), 'pm-tick', 'middle')).join('')}
    ${ptext(X(670), Y(0) + 72, 'wavelength (nm)', 'pm-ax', 'middle')}
    ${ptext(X(740), Y(0) + 72, 'shapes approximate', 'pm-s', 'end')}`;
  const band = (k: string, r: [number, number], cls: string, lab: string, labCls: string): string =>
    `<g data-k="${k}" opacity="0" display="none"><rect class="${cls}" x="${f1(X(r[0]))}" y="${Y(1.1)}" width="${f1(X(r[1]) - X(r[0]))}" height="${f1(Y(0) - Y(1.1))}"/>
      ${ptext((X(r[0]) + X(r[1])) / 2, Y(1.1) - 30, lab, `pm-t ${labCls}`, 'middle')}</g>`;
  const mk = (k: string, nm: number, a: number, cls: string): string => `<circle data-k="${k}" opacity="0" display="none" class="pm-mk ${cls}" cx="${f1(X(nm))}" cy="${f1(Y(a))}" r="8"/>`;
  return `<defs>${revealClip(p, 'cII', X(600) - 6, Y(1.1) - 6, Y(0) - Y(1.1) + 12)}${revealClip(p, 'cI', X(600) - 6, Y(1.1) - 6, Y(0) - Y(1.1) + 12)}</defs>
    ${ptext(1192, 84, 'Which light each', 'pm-h')}${ptext(1192, 112, 'photosystem absorbs', 'pm-h')}
    ${ptext(1192, 140, 'red end of the spectrum', 'pm-s')}
    ${band('bR', RED, 'pm-band-red', '680 nm', 'pm-red')}${band('bF', FAR, 'pm-band-fr', '&gt; 700 nm', 'pm-fr')}
    ${axes}
    <g clip-path="url(#${p}-cII)"><path class="pm-c2" d="${curve(pts(AII))}"/></g>
    <g clip-path="url(#${p}-cI)"><path class="pm-c1" d="${curve(pts(AI))}"/></g>
    <g data-k="lII" opacity="0" display="none">${ptext(X(650) - 12, Y(0.62), 'PSII', 'pm-h pm-ii', 'end')}</g>
    <g data-k="lI" opacity="0" display="none">${ptext(X(689), Y(0.8), 'PSI', 'pm-h pm-i')}</g>
    ${mk('mR2', 680, AII(680), 'pm-c2')}${mk('mR1', 680, AI(680), 'pm-c1')}${mk('mF2', 712, AII(712), 'pm-c2')}${mk('mF1', 712, AI(712), 'pm-c1')}
    <g data-k="nR" opacity="0" display="none">${ptext(X(680), Y(1.1) - 8, 'both absorb', 'pm-t pm-red', 'middle')}</g>
    <g data-k="nF" opacity="0" display="none">${ptext(X(714), Y(1.1) - 8, 'mostly PSI', 'pm-t pm-fr', 'middle')}</g>
    <path class="pm-rule" d="M886,592H${1584 - 26}"/>
    ${sayBlock(886, [622, 649, 686, 713])}`;
}

export const STAGING = makeStaging({
  id: 'm3',
  name: 'M3 · The two photosystems’ spectra',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; Emerson, then the absorption of PSII and PSI (approximate) with the red 680 nm and far-red > 700 nm bands over them, and the same light on both photosystems.',
  beats: PSIM_M3,
  lamps: false,
  holds3: [READY, 4.2, 6.05], end3: END3,
  holds4: [1.1], out4: 1.15,
  panel,
  bind(c) {
    const W = X(740) - X(600) + 12;
    return (t3, t4): Light => {
      c.set(c.q('cII'), 'width', f1(W * tw(t3, DRAW_II[0], DRAW_II[1])));
      c.set(c.q('cI'), 'width', f1(W * tw(t3, DRAW_I[0], DRAW_I[1])));
      c.op(c.q('lII'), tw(t3, DRAW_II[1] - 0.2, DRAW_II[1] + 0.2));
      c.op(c.q('lI'), tw(t3, DRAW_I[1] - 0.2, DRAW_I[1] + 0.2));
      c.op(c.q('bR'), tw(t3, 4.25, 4.55));
      c.op(c.q('mR2'), tw(t3, 4.7, 4.9)); c.op(c.q('mR1'), tw(t3, 4.8, 5.0)); c.op(c.q('nR'), tw(t3, 5.0, 5.3));
      c.op(c.q('bF'), tw(t3, 6.1, 6.4));
      c.op(c.q('mF2'), tw(t3, 6.55, 6.75)); c.op(c.q('mF1'), tw(t3, 6.65, 6.85)); c.op(c.q('nF'), tw(t3, 6.9, 7.2));
      c.op(c.q('say1'), tw(t4, 0.1, 0.5));
      c.op(c.q('say2'), tw(t4, 0.55, 0.95));
      // beat 4: red joins far-red as the second statement is written
      return t4 >= 0 ? lightAt([{ on: -1, off: 999, far: true }, { on: 0.55, off: 999, red: true }], t4) : lightAt(STEPS, t3);
    };
  },
});
