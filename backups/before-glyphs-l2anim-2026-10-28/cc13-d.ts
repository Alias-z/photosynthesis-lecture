// C13, staging D · C₄ next to CAM: the slide schema's bottom row (figs/cc-schema.ts, as C13 v6 draws it, with the C₄ panel
// lit too), framed together. Beat 1, step 1 in both: PEP carboxylase fixes CO₂ into a C₄ acid (C₄: in the mesophyll; CAM:
// in the night cell, malic acid into the vacuole). Beat 2, step 2 in both: the acid releases CO₂ next to Rubisco (C₄: in
// the bundle sheath; CAM: in the day cell). The part not working in each step waits under a veil. Beats 3–4: the
// Kalanchoë record (C13 v1) and the water bars (C13 v5) draw themselves in cards.
import { schemaSvg } from '../figs/cc-schema';
import { CC13_SIDE } from './beats-cc';
import { drawFlyers, flyersSvg } from './cc11-common';
import { c4PanelPaths } from './cc12-common';
import { camPanel, fig13, figCard } from './cc13-common';
import { bead, camera, co2G, clock, f1, fit, kOf, label, lightPanel, onStage, PANEL, pop, schemaScene, setters, slideCard, SLIDE, textScaler, tfStr, tw, type Rect, type V } from './cc-anim-kit';
import type { Flyer } from './cc11-common';
import type { Staging } from './types';

const P = 'a13d';
const LABEL = 'Four panels: where CO2 meets Rubisco in C3, C2, C4 and CAM plants. Lit: CAM';
const VB = fit([4, 302, 792, 296], [20, 70, 1560, 640]);
const B1 = { cam: 0.05, camD: 1.05, light: [0.5, 1.1] as V, labs: 1.15, drain: [0.2, 1.0] as V, t0: 1.3, end: 4.1 };
const B2 = { t0: 0.5, end: 3.9 };
const B3 = { card: 0, reveal: [0.4, 2.0] as V, end: 2.3 };
const B4 = { card: 0, reveal: [0.3, 1.4] as V, end: 1.7 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

export function build(): Staging {
  const { svg: scene, geo } = schemaScene(schemaSvg(P, ['cam'], LABEL), P, ['cam']);
  const c4 = c4PanelPaths(geo.c4), cam = camPanel(`${P}m`, geo.cam, { nightBeat: 0, dayBeat: 1, tN: B1.t0, gapN: 0.55, tD: B2.t0, gapD: 0.6 });
  // C₄, step 1: CO₂ → PEPC → C₄ acid, which waits at the bundle-sheath wall; step 2: into the bundle sheath, CO₂ to Rubisco
  const s1: Flyer[] = [0, 1, 2].flatMap(i => {
    const t = B1.t0 + i * 0.7;
    return [{ k: `${P}c-in${i}`, glyph: co2G(11), beat: 0, t0: t, d: 0.75, fade: 0.25, path: c4.co2 },
      { k: `${P}c-ac${i}`, glyph: bead('cca-c4a', 9.5), beat: 0, t0: t + 0.8, d: 0.6, path: [c4.acidHalf[0], c4.acidHalf[1], [c4.acidHalf[2][0] - i * 18, c4.acidHalf[2][1] + (i - 1) * 4]] }];
  });
  const s2: Flyer[] = [0, 1, 2].flatMap(i => [
    { k: `${P}c-ab${i}`, glyph: bead('cca-c4a', 9.5), beat: 1, t0: B2.t0 + i * 0.6, d: 0.45, out: 0.1, path: [[c4.acidHalf[2][0] - i * 18, c4.acidHalf[2][1] + (i - 1) * 4], c4.bsIn] },
    { k: `${P}c-co${i}`, glyph: co2G(11), beat: 1, t0: B2.t0 + i * 0.6 + 0.5, d: 0.6, fade: 0.4, path: c4.rel[i % 2] },
  ]);
  const rec = figCard(`${P}r`, fig13('v1', 'fcc13a', `${P}r1`), { rev: [118, 84, 662, 368], reveal: B3.reveal });
  const wat = figCard(`${P}w`, fig13('v5', 'fcc13e', `${P}w5`), { rev: [208, 100, 600, 350], reveal: B4.reveal });

  const a = (p: V): V => onStage(VB, p);
  const bs = geo.c4.rects['fcc-bs'][0], mes = geo.c4.rects['fcc-wall'][0];
  const step1 = [
    label(...a([c4.pepc[0] + 10, PANEL.c4[1] + 92]), 'step 1: PEP carboxylase', { to: a([c4.pepc[0], c4.pepc[1] - 16]), cls: 'cca-pt cca-c4t' }),
    label(...a([cam.night[0] + 70, PANEL.cam[1] + PANEL.cam[3] + 2]), 'step 1: PEP carboxylase, at night', { cls: 'cca-pt cca-c4t' }),
  ].join('');
  const step2 = [
    label(...a([bs[0] + bs[2] / 2, PANEL.c4[1] + 92]), 'step 2: Rubisco', { to: a([c4.rub[0][0], c4.rub[0][1] - 26]) }),
    label(...a([cam.day[0] + 76, PANEL.cam[1] + PANEL.cam[3] + 2]), 'step 2: Rubisco, by day'),
  ].join('');
  const names = [label(...a([PANEL.c4[0] + 193, PANEL.c4[1] - 4]), 'in space: two cells'), label(...a([PANEL.cam[0] + 193, PANEL.cam[1] - 4]), 'in time: night, then day')].join('');
  const veil = (k: string, r: Rect): string => `<rect data-k="${P}-${k}" class="cca-cover" x="${r[0] - 4}" y="${r[1] - 4}" width="${r[2] + 8}" height="${r[3] + 8}" opacity="0"/>`;

  return {
    id: 'd',
    name: 'D · C₄ next to CAM',
    note: 'The schema’s C₄ and CAM panels side by side: step 1 (PEP carboxylase) in both, then step 2 (Rubisco) in both: in space vs in time; then the Kalanchoë record and the water bars.',
    beats: CC13_SIDE,
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}<g data-k="world">${scene}
        <rect data-k="${P}-top" class="cca-veil" x="-60" y="-200" width="920" height="500" opacity="0"/>${veil('v-bs', bs)}${veil('v-ms', [mes[0], mes[1], mes[2] + 4, mes[3]])}${veil('v-day', cam.day)}${veil('v-night', cam.night)}</g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-names" opacity="0">${names}</g><g data-k="${P}-s1" opacity="0">${step1}</g><g data-k="${P}-s2" opacity="0">${step2}</g>
        ${flyersSvg(s1)}${flyersSvg(s2)}${flyersSvg(cam.nf)}${flyersSvg(cam.df)}${rec.svg}${wat.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), scale = textScaler(S.q('world'), S);
      const acids = Array.from(S.q(`${P}-in-cam`).querySelectorAll<SVGRectElement>('rect.fcc-acid')).sort((x, y) => +x.getAttribute('x')! - +y.getAttribute('x')!);
      const setAcid = (el: SVGRectElement, h: number): void => { S.set(el, 'y', f1(cam.vBot - h)); S.set(el, 'height', f1(h)); };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const v = camera([SLIDE, VB], [[0, B1.cam, B1.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(v));
        scale(kOf(v.s));
        const toStage = (p: V): V => onStage(v, p);
        lightPanel(S, P, 'c4', tw(T(0), ...B1.light));
        S.op(S.q(`${P}-top`), tw(T(0), B1.cam + 0.3, B1.cam + B1.camD));
        const cards = b >= 2 ? 1 : 0;
        S.op(S.q(`${P}-names`), pop(T(0), B1.labs) * (1 - cards));
        S.op(S.q(`${P}-s1`), b === 0 ? pop(tt, B1.labs) : 0);
        S.op(S.q(`${P}-s2`), b === 1 ? pop(tt, 0.2) : 0);
        // what waits: in step 1 the bundle sheath and the day cell, in step 2 the mesophyll and the night cell
        S.op(S.q(`${P}-v-bs`), b === 0 ? 0.65 * pop(tt, B1.labs) : 0);
        S.op(S.q(`${P}-v-day`), b === 0 ? 0.65 * pop(tt, B1.labs) : 0);
        S.op(S.q(`${P}-v-ms`), b === 1 ? 0.65 * pop(tt, 0) : 0);
        S.op(S.q(`${P}-v-night`), b === 1 ? 0.65 * pop(tt, 0) : 0);
        // CAM acid: night cell drains at dusk then fills; day cell starts full and empties
        const inN = cam.nf.filter(f => f.out && T(0) >= f.t0 + f.d).length, outD = cam.df.filter(f => f.out && T(1) >= f.t0).length;
        setAcid(acids[0], b === 0 ? (tt < B1.drain[1] ? cam.full - (cam.full - cam.low) * tw(tt, ...B1.drain) : cam.low + ((cam.full - cam.low) * inN) / 4) : cam.full);
        setAcid(acids[1], b === 1 ? (outD > 0 ? cam.full - ((cam.full - cam.low) * outD) / 4 : cam.low + (cam.full - cam.low) * tw(tt, 0, 0.4)) : cam.low);
        drawFlyers(S, s1, T, toStage, b === 0 ? 1 : 0);
        drawFlyers(S, s2, T, toStage, b === 1 ? 1 : 0);
        drawFlyers(S, cam.nf, T, toStage, b === 0 ? 1 : 0);
        drawFlyers(S, cam.df, T, toStage, b === 1 ? 1 : 0);
        rec.draw(S, T(2), b === 2 ? pop(tt, B3.card) : 0);
        wat.draw(S, T(3), b === 3 ? pop(tt, B4.card) : 0);
      };
    },
  };
}

export const STAGING = build();
