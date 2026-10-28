// C11, staging B · Experiment first: the story opens on the 2013 measurement (drawn after Busch et al. 2013 Fig. 1), which
// leaves the question where half of the released CO₂ went. The answer is told on the slide's drawing C11 v6 (C₃ cell → C₂
// leaf), exactly as the slide draws it: the camera zooms into its rice wall section (the trap, with a readout), moves to
// its C₂ cells (glycine to the bundle sheath), and zooms out with the Flaveria series beside it.
import { draw as drawC11 } from '../figs/cc11';
import { CC11_EXP } from './beats-cc';
import { caught, c3Trap, drawFlyers, flaveria, flyersSvg, glyFlyers, M, method } from './cc11-common';
import {
  camera, clock, fit, kOf, label, onStage, pop, put, readout, readPanel, setters, slideCard, SLIDE, strip, textScaler, tfStr,
  type Tf, type V,
} from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a11b';
const VC3 = fit([14, 140, 334, 320], [40, 30, 1000, 680]);
const VC2 = fit([352, 140, 436, 320], [40, 40, 1520, 620]);
const VOUT: Tf = { s: 0.98, t: [70.4, 370 - 0.98 * 300] };
const B2 = { in: 0.15, cam: 0.3, camD: 1.05, labs: 1.4, puff: 1.6, end: 2.0 };
const B3 = { t0: 0.15, step: 0.26, up: 3.4, end: 4.0 };
const B4 = { cam: 0.05, camD: 1.0, labs: 1.1, gly: 1.2, end: 4.0 };
const B5 = { cam: 0.05, camD: 1.15, strip: 1.3, end: 2.7 };
const TEND = [M.end, B2.end, B3.end, B4.end, B5.end];

export function build(): Staging {
  const v6 = strip(drawC11('v6')).split('fcc11f').join(`${P}f`);
  const g = readPanel(v6);
  // the rice wall section (left): two mitochondria, the chloroplast row, the wall at the top of the cell
  const wall = g.rects['fcc-wall'][0], c3cp = g.cp.filter(c => c.rot === 0 && c.x < 340).sort((a, b) => a.x - b.x);
  const mito: V[] = g.mt.map((m): V => [m.x, m.y]).sort((a, b) => a[0] - b[0]);
  const trap = c3Trap(`${P}t`, 2, { mito, cpY: c3cp[0].y, wallY: wall[1], airY: wall[1] - 58, t0: B3.t0, step: B3.step, first: 2, r: 12 });
  const hits = trap.filter(f => f.fade).length;
  // the C₂ cells (right): glycine route, the dark mitochondria at the vein side, the bundle-sheath chloroplasts
  const bs = g.rects['fcc-bs'][0], gr = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-g'][0])!;
  const mOn = g.mtOn.map((m): V => [m.x, m.y]).sort((a, b) => a[1] - b[1]);
  const cpBs = g.cp.filter(c => c.x > bs[0]).map((c): V => [c.x, c.y]).sort((a, b) => a[1] - b[1]);
  const gly = glyFlyers(`${P}g`, 3, { from: [+gr[1], +gr[2]], to: [+gr[3] - 8, +gr[2]], mito: [mOn[1], mOn[mOn.length - 2]],
    cp: [[cpBs[0][0] + 4, cpBs[0][1] + 18], [cpBs[cpBs.length - 1][0] + 4, cpBs[cpBs.length - 1][1] - 18]], t0: B4.gly, rb: 12, rc: 12 });
  const meth = method(`${P}m`, 0);
  const fl = flaveria(`${P}fl`, 1012, 18, 240);

  const a3 = (p: V): V => onStage(VC3, p), a2 = (p: V): V => onStage(VC2, p);
  const cp3 = c3cp[3], cp4 = c3cp[4], strX = (cp3.x + cp3.rx + cp4.x - cp4.rx) / 2;
  const lab3 = [
    label(...a3([strX + 18, wall[1] - 34]), 'cell wall', { to: a3([strX + 18, wall[1]]) }),
    label(...a3([c3cp[0].x + 26, wall[1] + 168]), 'chloroplasts', { to: a3([c3cp[0].x, c3cp[0].y + c3cp[0].ry]) }),
    label(...a3([strX + 4, wall[1] + 168]), 'stromule', { to: a3([strX, wall[1] + 7]) }),
  ].join('');
  const lab2 = label(...a2([mOn[0][0] - 60, bs[1] - 22]), 'glycine decarboxylase', { to: a2([mOn[0][0], mOn[0][1] - 9]), cls: 'cca-pt cca-glyt' });
  const ro = readout(`${P}ro`, 1090, 150, 450, 'rice, 30 °C', [
    { label: ['CO₂ from the mitochondria', 'refixed inside the cell'], value: '0 %', cls: 'cca-co2c' },
    { label: ['net CO₂ uptake'], value: '+11 %' },
  ]);

  return {
    id: 'b',
    name: 'B · Experiment first',
    note: 'Opens on the 2013 ¹³CO₂ measurement; then where the missing CO₂ went, on the slide’s drawing v6: rice wall (trap), C₂ cells (glycine), Flaveria series.',
    beats: CC11_EXP,
    holds: [[M.hold], [], [], [], []],
    svg: () => `
      <g data-k="cam" opacity="0"><g class="fig fcc">${slideCard(P)}<g data-k="world">${v6}<rect data-k="${P}-v2" class="cca-cover" x="350" y="96" width="440" height="430" opacity="0"/></g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-l3" opacity="0">${lab3}</g><g data-k="${P}-l2" opacity="0">${lab2}</g>
        <g data-k="${P}-ro-w" opacity="0">${ro}</g>
        ${flyersSvg(trap)}${flyersSvg(gly)}${fl.svg}${meth.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), world = S.q('world'), scale = textScaler(world, S);
      const pills = Array.from(world.querySelectorAll('.fcc-ldh, .fcc-ldk, .fcc-tip, .fcc-pill, .fcc-pt'));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        // beat 1: the measurement card alone; beat 2 brings the slide's drawing and zooms into the rice wall
        meth.draw(S, T(0), b === 0 ? 1 : b === 1 ? 1 - pop(tt, 0) : 0);
        S.op(S.q('cam'), pop(T(1), B2.in));
        const cam = camera([SLIDE, VC3, VC2, VOUT], [[1, B2.cam, B2.camD], [3, B4.cam, B4.camD], [4, B5.cam, B5.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const zoomed = b === 1 ? pop(tt, B2.cam) : b === 2 || b === 3 ? 1 : 1 - pop(tt, B5.cam + 0.8);
        pills.forEach(el => S.op(el, 1 - zoomed));
        // the C₂ cells wait under a veil while the camera is on the rice wall
        S.op(S.q(`${P}-v2`), 0.85 * (b === 1 ? pop(tt, B2.cam + 0.5) : b === 2 ? 1 : b === 3 ? 1 - pop(tt, 0) : 0));
        const toStage = (p: V): V => onStage(cam, p);

        const inC3 = pop(T(1), B2.labs) * (1 - pop(T(3), 0));
        S.op(S.q(`${P}-l3`), inC3);
        S.op(S.q(`${P}-ro-w`), b === 2 ? 1 : 0);
        S.set(S.q(`${P}ro-v0`), 'text', `${Math.round((29 * caught(trap, T)) / hits)} %`);
        S.op(S.q(`${P}ro-r1`), pop(T(2), B3.up));
        drawFlyers(S, trap, T, toStage, inC3);
        if (b === 1) trap.slice(0, 2).forEach(f => put(S, f.k, toStage(f.path[0]), pop(tt, B2.puff)));

        S.op(S.q(`${P}-l2`), pop(T(3), B4.labs) * (1 - pop(T(4), 0)));
        drawFlyers(S, gly, T, toStage, b === 3 ? 1 : 0);
        fl.draw(S, T(4), B5.strip);
      };
    },
  };
}

export const STAGING = build();
