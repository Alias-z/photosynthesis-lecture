// C12, staging A · On the slide schema: the four-panel schema with C₄ lit, exactly as C12 v8 draws it, in the slide's card.
// Beat 1: the Hatch & Slack card over it (their graph draws itself). Beat 2: the camera zooms into the C₄ panel; mesophyll,
// bundle sheath (Kranz) and vein are named. Beat 3: the pump runs three rounds, with the CO₂ readout. Beat 4: pyruvate
// returns and 2 ATP are spent per round (hold), then the Ehleringer & Björkman graph (C12 v6) draws itself.
import { schemaSvg } from '../figs/cc-schema';
import { CC12 } from './beats-cc';
import { drawFlyers, flyersSvg } from './cc11-common';
import { atp, backFlyers, drawAtp, ebCard, hatchCard, pumpFlyers } from './cc12-common';
import { camera, clock, fit, glyph, kOf, label, onStage, pop, readout, schemaScene, setters, slideCard, SLIDE, textScaler, tfStr, type V } from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a12a';
const LABEL = 'Four panels: where CO2 meets Rubisco in C3, C2, C4 and CAM plants. Lit: C4';
const VZ = fit([12, 318, 380, 266], [30, 30, 1060, 680]);
const B1 = { card: 0, reveal: [0.4, 1.8] as [number, number], labs: 1.9, end: 2.3 };
const B2 = { out: 0, cam: 0.15, camD: 1.05, labs: 1.25, end: 1.6 };
const B3 = { t0: 0.25, end: 4.7 };
const B4 = { t0: 0.1, atp: [1.15, 1.6], cost: 1.3, hold: 2.4, card: 2.5, reveal: [2.75, 4.0] as [number, number], end: 4.3 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

export function build(): Staging {
  const { svg: scene, geo } = schemaScene(schemaSvg(P, ['c4'], LABEL), P, ['c4']);
  const g = geo.c4, m = g.rects['fcc-wall'][0], bs = g.rects['fcc-bs'][0], vein = g.rects['fcc-vein'][0];
  const kIn = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-k fcc-thin'][0])!, ac = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-m'][0])!;
  const cy = +ac[2], pepc: V = [+ac[1] - 32, cy], bsIn: V = [+ac[3] + 14, cy];
  const out = g.co2.sort((a, b) => a[0] - b[0])[0];
  const rub = g.cp.filter(c => c.x > bs[0]).map((c): V => [c.x, c.y]).sort((a, b) => a[1] - b[1]);
  const pump = pumpFlyers(`${P}p`, 2, {
    co2: [out, [+kIn[3], cy], [pepc[0] - 26, cy]],
    acid: [[pepc[0] + 32, cy], [+ac[3], cy], bsIn],
    rel: [[bsIn, [rub[0][0] + 4, rub[0][1] + 6]], [bsIn, [rub[1][0] - 4, rub[1][1] - 6]]],
  }, { t0: B3.t0, r: 10 });
  const back = backFlyers(`${P}b`, 3, [[bsIn[0] - 6, cy + 16], [bs[0] - 4, cy + 44], [m[0] + m[2] - 20, cy + 52], [pepc[0] + 6, cy + 30]], { t0: B4.t0, r: 10 });
  const atpAt = onStage(VZ, [pepc[0] + 6, cy + 54]);
  const hc = hatchCard(`${P}h`, B1), eb = ebCard(`${P}e`, { reveal: B4.reveal });

  const a = (p: V): V => onStage(VZ, p);
  const yB = m[1] + m[3] + 12;
  const labs2 = [
    label(...a([m[0] + m[2] / 2, yB]), 'mesophyll'),
    label(...a([bs[0] + bs[2] / 2, yB]), 'bundle sheath (Kranz)'),
    label(...a([vein[0] + vein[2] / 2 + 14, yB]), 'vein'),
  ].join('');
  const labs3 = [
    label(...a([bs[0] + bs[2] / 2 + 20, bs[1] - 12]), 'Rubisco', { to: a([rub[0][0], rub[0][1] - 18]) }),
    label(...a([pepc[0], cy - 42]), 'HCO₃⁻'),
  ].join('');
  const ro = readout(`${P}ro`, 1110, 130, 450, 'CO₂ (µmol mol⁻¹)', [
    { label: ['mesophyll'], value: '≈ 100' },
    { label: ['bundle sheath'], value: '≈ 1500', cls: 'cca-co2c' },
    { label: ['regenerating PEP costs'], value: '2 ATP per CO₂' },
  ]);

  return {
    id: 'a',
    name: 'A · On the slide schema',
    note: 'The four-panel schema (C₄ lit): Hatch & Slack card, zoom into C₄ (Kranz), the pump with CO₂ readouts, 2 ATP per round, then the quantum-yield crossover.',
    beats: CC12,
    holds: [[], [], [], [B4.hold]],
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}<g data-k="world">${scene}</g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-l2" opacity="0">${labs2}</g><g data-k="${P}-l3" opacity="0">${labs3}</g>
        <g data-k="${P}-ro-w" opacity="0">${ro}</g>
        ${flyersSvg(pump)}${flyersSvg(back)}${glyph(`${P}-atp0`, atp())}${glyph(`${P}-atp1`, atp())}${glyph(`${P}-atq0`, atp())}${glyph(`${P}-atq1`, atp())}
        ${hc.svg}${eb.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), scale = textScaler(S.q('world'), S);
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([SLIDE, VZ], [[1, B2.cam, B2.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);

        hc.draw(S, T(0), b === 0 ? pop(tt, B1.card) : b === 1 ? 1 - pop(tt, B2.out) : 0);
        const ebv = b === 3 ? pop(tt, B4.card) : 0;
        S.op(S.q(`${P}-l2`), pop(T(1), B2.labs) * (1 - ebv));
        S.op(S.q(`${P}-l3`), pop(T(2), 0) * (1 - ebv));
        S.op(S.q(`${P}-ro-w`), pop(T(2), 0) * (1 - ebv));
        S.op(S.q(`${P}ro-r2`), pop(T(3), B4.cost));
        drawFlyers(S, pump, T, toStage, b === 2 ? 1 : 0);
        drawFlyers(S, back, T, toStage, 1 - ebv);
        drawAtp(S, `${P}-atp`, atpAt, b === 3 ? tt : -9, B4.atp[0]);
        drawAtp(S, `${P}-atq`, atpAt, b === 3 ? tt : -9, B4.atp[1]);
        eb.draw(S, T(3), ebv);
      };
    },
  };
}

export const STAGING = build();
