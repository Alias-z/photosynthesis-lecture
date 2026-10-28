// C13, staging A · On the slide schema: the four-panel schema with CAM lit, exactly as C13 v6 draws it, in the slide's card.
// Beat 1: the camera zooms into the CAM panel; its night cell takes up CO₂ through the open stoma and fills its vacuole with
// malic acid (the acid gauge rises). Beat 2: the day cell, stoma shut, empties its vacuole: CO₂ to the chloroplast (the
// gauge falls). Beat 3: the Kalanchoë record (C13 v1) draws itself in a card. Beat 4: the water bars (C13 v5) grow (hold),
// then the camera zooms out and the C₃, C₂ and C₄ panels light too: all four raise CO₂ around Rubisco.
import { schemaSvg } from '../figs/cc-schema';
import { CC13 } from './beats-cc';
import { drawFlyers, flyersSvg, type Flyer } from './cc11-common';
import { fig13, figCard, gauge } from './cc13-common';
import { bead, camera, clock, co2G, f1, fit, kOf, label, lightPanel, onStage, pop, schemaScene, setters, slideCard, SLIDE, textScaler, tfStr, tw, type V } from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a13a';
const LABEL = 'Four panels: where CO2 meets Rubisco in C3, C2, C4 and CAM plants. Lit: CAM';
const VZ = fit([410, 316, 380, 268], [30, 34, 1110, 672]);
const B1 = { cam: 0.05, camD: 1.05, drain: [0.2, 1.0] as V, labs: 1.15, t0: 1.3, gap: 0.55, end: 4.1 };
const B2 = { fill: [0, 0.4] as V, t0: 0.6, gap: 0.6, end: 3.9 };
const B3 = { card: 0, reveal: [0.4, 2.0] as V, end: 2.3 };
const B4 = { card: 0, reveal: [0.3, 1.4] as V, hold: 1.6, out: 1.7, cam: 1.8, camD: 1.1, light: [2.9, 3.5] as V, end: 3.8 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

export function build(): Staging {
  const { svg: scene, geo } = schemaScene(schemaSvg(P, ['cam'], LABEL), P, ['cam']);
  const g = geo.cam;
  const walls = g.rects['fcc-wall'].sort((a, b) => a[0] - b[0]), vac = g.rects['fcc-vac'].sort((a, b) => a[0] - b[0]);
  const acid = g.rects['fcc-acid'].sort((a, b) => a[0] - b[0]);
  const [night, day] = walls, sy = night[1] + night[3] / 2;
  const cpDay = g.cp.filter(c => c.x > day[0]).sort((a, b) => a.y - b.y);
  // acid levels as the slide draws them: night cell full, day cell low
  const full = acid[0][3], low = acid[1][3], vBot = vac[0][1] + vac[0][3] - 4;
  const nf: Flyer[] = [], df: Flyer[] = [];
  for (let i = 0; i < 4; i++) {
    const t = B1.t0 + i * B1.gap, j = [-8, 6, -2, 10][i];
    nf.push({ k: `${P}n-c${i}`, glyph: co2G(11), beat: 0, t0: t, d: 0.75, fade: 0.25, path: [[night[0] - 40, sy - 4], [night[0] - 12, sy], [night[0] + 8, sy], [vac[0][0] - 14, sy]] });
    nf.push({ k: `${P}n-m${i}`, glyph: bead('cca-mal', 10), beat: 0, t0: t + 0.8, d: 0.6, out: 0.15, path: [[vac[0][0] - 10, sy], [vac[0][0] + 10, sy + 6], [vac[0][0] + vac[0][2] / 2 + j, vBot - 20]] });
    const u = B2.t0 + i * B2.gap, cp = cpDay[i % 2];
    df.push({ k: `${P}d-m${i}`, glyph: bead('cca-mal', 10), beat: 1, t0: u, d: 0.55, out: 0.1, path: [[vac[1][0] + vac[1][2] / 2 + j, vBot - 24], [vac[1][0] + 6, vBot - 30], [vac[1][0] - 8, vBot - 36]] });
    df.push({ k: `${P}d-c${i}`, glyph: co2G(11), beat: 1, t0: u + 0.6, d: 0.7, fade: 0.4, path: [[vac[1][0] - 8, vBot - 36], [cp.x + 12, (vBot - 36 + cp.y) / 2], [cp.x + 2, cp.y + (i % 2 ? -6 : 8)]] });
  }
  const gg = gauge(`${P}g`, 1180, 96);
  const rec = figCard(`${P}r`, fig13('v1', 'fcc13a', `${P}r1`), { rev: [118, 84, 662, 368], reveal: B3.reveal });
  const wat = figCard(`${P}w`, fig13('v5', 'fcc13e', `${P}w5`), { rev: [208, 100, 600, 350], reveal: B4.reveal });

  const a = (p: V): V => onStage(VZ, p);
  const vy = vac[0][1] + vac[0][3];
  const labs = [
    label(...a([night[0] + 34, night[1] + night[3] + 14]), 'stoma open', { to: a([night[0] - 4, sy + 26]) }),
    label(...a([vac[0][0] + vac[0][2] / 2, vy + 14]), 'vacuole'),
    label(...a([night[0] + 29, sy + 19]), 'PEPC', { cls: 'cca-pt cca-c4t' }),
  ].join('');
  const labsD = [
    label(...a([day[0] + 34, day[1] + night[3] + 14]), 'stoma shut', { to: a([day[0] - 4, sy + 16]) }),
    label(...a([cpDay[0].x - 22, night[1] - 14]), 'Rubisco', { to: a([cpDay[0].x, cpDay[0].y - cpDay[0].rx + 2]) }),
  ].join('');
  const veil = (k: string, r: [number, number, number, number]): string => `<rect data-k="${P}-${k}" class="cca-cover" x="${r[0] - 10}" y="${r[1] - 30}" width="${r[2] + 20}" height="${r[3] + 40}" opacity="0"/>`;

  return {
    id: 'a',
    name: 'A · On the slide schema',
    note: 'The four-panel schema (CAM lit): into the CAM panel, night cell fills with malic acid, day cell empties it (acid gauge), Kalanchoë record, water bars, then all four panels light.',
    beats: CC13,
    holds: [[], [], [], [B4.hold]],
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}<g data-k="world">${scene}${veil('vn', night)}${veil('vd', day)}</g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-l" opacity="0">${labs}</g><g data-k="${P}-ld" opacity="0">${labsD}</g><g data-k="${P}-gw" opacity="0">${gg.svg}</g>
        ${flyersSvg(nf)}${flyersSvg(df)}${rec.svg}${wat.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), scale = textScaler(S.q('world'), S);
      const cam0 = S.q(`${P}-in-cam`), acids = Array.from(cam0.querySelectorAll<SVGRectElement>('rect.fcc-acid')).sort((x, y) => +x.getAttribute('x')! - +y.getAttribute('x')!);
      const setAcid = (el: SVGRectElement, h: number): void => { S.set(el, 'y', f1(vBot - h)); S.set(el, 'height', f1(h)); };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([SLIDE, VZ, SLIDE], [[0, B1.cam, B1.camD], [3, B4.cam, B4.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);
        const cards = b === 2 ? pop(tt, B3.card) : b === 3 ? pop(tt, B4.card) * (1 - pop(tt, B4.out)) : 0;

        // night: the night cell's acid drains to the day level during the zoom (dusk), then fills as CO₂ comes in
        const caughtN = nf.filter(f => f.out && T(0) >= f.t0 + f.d).length;
        const hN = b === 0 ? (tt < B1.drain[1] ? full - (full - low) * tw(tt, ...B1.drain) : low + ((full - low) * caughtN) / 4) : full;
        setAcid(acids[0], hN);
        // day: the day cell starts full and empties as malic acid leaves
        const outD = df.filter(f => f.out && T(1) >= f.t0).length;
        const hD = outD > 0 ? full - ((full - low) * outD) / 4 : low + (full - low) * tw(tt, ...B2.fill);
        setAcid(acids[1], b === 1 ? hD : low);
        S.op(S.q(`${P}-vd`), b === 0 ? 0.7 * pop(tt, B1.labs) : 0);
        S.op(S.q(`${P}-vn`), b === 1 ? 0.7 * pop(tt, 0) : 0);
        const inZ = (b <= 1 ? pop(T(0), B1.labs) : 0) * (1 - cards);
        S.op(S.q(`${P}-l`), b === 0 ? inZ : 0);
        S.op(S.q(`${P}-ld`), b === 1 ? inZ : 0);
        S.op(S.q(`${P}-gw`), inZ);
        const level = b === 0 ? (tt < B1.drain[1] ? 0 : caughtN / 4) : b === 1 ? 1 - outD / 4 : 0;
        gg.draw(S, level, b === 0 ? 1 : 0);
        drawFlyers(S, nf, T, toStage, b === 0 ? 1 : 0);
        drawFlyers(S, df, T, toStage, b === 1 ? 1 : 0);

        rec.draw(S, T(2), b === 2 ? pop(tt, B3.card) : 0);
        wat.draw(S, T(3), b === 3 ? pop(tt, B4.card) * (1 - pop(tt, B4.out)) : 0);
        // all four panels light at the end
        const L = tw(T(3), ...B4.light);
        (['c3', 'c2', 'c4'] as const).forEach(k => lightPanel(S, P, k, L));
      };
    },
  };
}

export const STAGING = build();
