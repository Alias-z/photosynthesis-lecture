// C11, staging A · On the slide: the slide's own four-panel schema (figs/cc-schema.ts schemaSvg, C₃ and C₂ lit, exactly as
// C11 v10 draws it), in the slide's figure card. The camera zooms into the C₃ panel (beats 1–2: the CO₂ trap, with a
// readout), a card shows the 2013 measurement (beat 3), the camera moves into the C₂ panel (beat 4: glycine to the bundle
// sheath), then zooms out with the C₄ panel starting to light and the Flaveria series beside it (beat 5).
import { schemaSvg } from '../figs/cc-schema';
import { CC11 } from './beats-cc';
import { caught, c3Trap, drawFlyers, flaveria, flyersSvg, glyFlyers, M, method } from './cc11-common';
import {
  camera, clock, fit, kOf, label, lightPanel, onStage, pop, put, readout, schemaScene, setters, slideCard, SLIDE, textScaler, tfStr, tw,
  type Tf, type V,
} from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a11a';
const LABEL = 'Four panels: where CO2 meets RuBisCO in C3, C2, C4 and CAM plants. Lit: C3 and C2';
const V0 = SLIDE;
const V1 = fit([14, 22, 374, 262], [30, 40, 1050, 660]);
const V2 = fit([412, 22, 374, 266], [60, 30, 1480, 640]);
const V3: Tf = { s: 0.98, t: [70.4, 370 - 0.98 * 300] };
const B1 = { zoom: 0.05, zoomD: 1.05, labs: 1.1, puff: 1.35, end: 1.8 };
const B2 = { t0: 0.15, step: 0.26, up: 3.35, end: 4.0 };
const B4 = { out: 0, cam: 0.1, camD: 1.0, labs: 1.15, gly: 1.3, end: 4.1 };
const B5 = { cam: 0.05, camD: 1.15, c4: 1.3, strip: 1.3, end: 2.7 };
const TEND = [B1.end, B2.end, M.end, B4.end, B5.end];

export function build(): Staging {
  const { svg: scene, geo } = schemaScene(schemaSvg(P, ['c3', 'c2'], LABEL), P, ['c3', 'c2']);
  // C₃ panel: the two mitochondria, the chloroplast row, the wall and the air space above it
  const g3 = geo.c3, wall = g3.rects['fcc-wall'][0];
  const mitoC3: V[] = g3.mt.map(m => [m.x, m.y]);
  const trap = c3Trap(`${P}t`, 1, { mito: mitoC3, cpY: g3.cp[0].y, wallY: wall[1], airY: wall[1] - 42, t0: B2.t0, step: B2.step, first: 2 });
  const hits = trap.filter(f => f.fade).length;
  // C₂ panel: glycine route, the dark (glycine decarboxylase) mitochondria and the bundle-sheath chloroplasts in front
  const g2 = geo.c2, bs = g2.rects['fcc-bs'][0];
  const gr = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g2.paths['fcc-r fcc-r-g'][0])!;
  const mOn = g2.mtOn.map((m): V => [m.x, m.y]).sort((a, b) => a[1] - b[1]);
  const cpBs = g2.cp.filter(c => c.x > bs[0]).map((c): V => [c.x, c.y]).sort((a, b) => a[1] - b[1]);
  const gly = glyFlyers(`${P}g`, 3, { from: [+gr[1], +gr[2]], to: [+gr[3] - 6, +gr[2]], mito: [mOn[1], mOn[2]], cp: [[cpBs[0][0] + 2, cpBs[0][1] + 10], [cpBs[1][0] + 2, cpBs[1][1] - 10]], t0: B4.gly });
  const meth = method(`${P}m`, 2);
  const fl = flaveria(`${P}f`, 1012, 18, 240);

  // labels of the close views (stage px, placed on the drawing through that view)
  const at1 = (p: V): V => onStage(V1, p), at2 = (p: V): V => onStage(V2, p);
  const mA = mitoC3[0], mB = mitoC3[1], cp0 = g3.cp[0], cp3 = g3.cp[3], cp4 = g3.cp[4];
  const strX = (cp3.x + cp3.rx + cp4.x - cp4.rx) / 2;
  const lab1 = [
    label(...at1([74, wall[1] - 26]), 'air space'),
    label(...at1([strX + 26, wall[1] - 26]), 'cell wall', { to: at1([strX + 26, wall[1]]) }),
    label(...at1([cp0.x + 4, wall[1] + 96]), 'chloroplasts', { to: at1([cp0.x, cp0.y + cp0.ry]) }),
    label(...at1([strX + 18, wall[1] + 96]), 'stromule', { to: at1([strX, wall[1] + 7]) }),
    label(...at1([(mA[0] + mB[0]) / 2, (mA[1] + mB[1]) / 2 + 3]), 'mitochondria'),
  ].join('');
  const lab2 = [
    label(...at2([(g2.rects['fcc-wall'][0][0] + g2.rects['fcc-wall'][0][2] / 2), bs[1] + bs[3] + 14]), 'mesophyll'),
    label(...at2([bs[0] + bs[2] / 2, bs[1] + bs[3] + 14]), 'bundle sheath'),
    label(...at2([g2.rects['fcc-vein'][0][0] + 18, bs[1] + bs[3] + 14]), 'vein'),
    label(...at2([mOn[0][0] - 40, bs[1] - 14]), 'glycine decarboxylase', { to: at2([mOn[0][0], mOn[0][1] - 8]), cls: 'cca-pt cca-glyt' }),
  ].join('');
  const ro = readout(`${P}ro`, 1120, 140, 430, 'rice, 30 °C', [
    { label: ['wall facing the air spaces', 'covered by chloroplasts'], value: '99 %' },
    { label: ['CO₂ from the mitochondria', 'refixed inside the cell'], value: '0 %', cls: 'cca-co2c' },
    { label: ['net CO₂ uptake'], value: '+11 %' },
  ]);

  return {
    id: 'a',
    name: 'A · On the slide schema',
    note: 'The slide’s four-panel schema: zoom into C₃ (the trap, with a readout), a card for the 2013 measurement, into C₂ (glycine), back out with C₄ starting to light.',
    beats: CC11,
    holds: [[], [], [M.hold], [], []],
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}<g data-k="world">${scene}</g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-l1" opacity="0">${lab1}</g><g data-k="${P}-l2" opacity="0">${lab2}</g>
        <g data-k="${P}-ro-w" opacity="0">${ro}</g>
        ${flyersSvg(trap)}${flyersSvg(gly)}
        ${fl.svg}
        ${meth.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), scale = textScaler(S.q('world'), S);
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([V0, V1, V2, V3], [[0, B1.zoom, B1.zoomD], [3, B4.cam, B4.camD], [4, B5.cam, B5.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);

        // labels and readout of the C₃ view (gone under the card and when the camera leaves)
        const inC3 = pop(T(0), B1.labs) * (1 - pop(T(3), B4.out));
        const card = b === 2 ? pop(tt, M.card) : 0;
        S.op(S.q(`${P}-l1`), inC3 * (1 - card));
        S.op(S.q(`${P}-ro-w`), inC3 * (1 - card));
        const c = caught(trap, T);
        S.set(S.q(`${P}ro-v1`), 'text', `${Math.round((29 * c) / hits)} %`);
        S.op(S.q(`${P}ro-r2`), pop(T(1), B2.up));

        // the trap: the first two CO₂ wait at the mitochondria in beat 1, all move in beat 2
        drawFlyers(S, trap, T, toStage, inC3 * (1 - card));
        if (b === 0) trap.slice(0, 2).forEach(f => put(S, f.k, toStage(f.path[0]), pop(tt, B1.puff)));

        // the measurement card (beat 3)
        meth.draw(S, T(2), card);

        // C₂ view
        const inC2 = pop(T(3), B4.labs) * (1 - pop(T(4), 0));
        S.op(S.q(`${P}-l2`), inC2);
        drawFlyers(S, gly, T, toStage, b === 3 ? 1 : 0);

        // zoom out: C₄ starts to light; the Flaveria series appears beside the schema
        lightPanel(S, P, 'c4', 0.6 * tw(T(4), B5.c4, B5.c4 + 0.6));
        fl.draw(S, T(4), B5.strip);
      };
    },
  };
}

export const STAGING = build();
