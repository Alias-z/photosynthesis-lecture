// C12, staging D · Side by side: the slide schema's C₃ and C₄ panels (figs/cc-schema.ts, as C12 v8 draws them; here the C₃
// panel lights too), framed together. Beat 1: the two leaves. Beat 2: the pump runs in the C₄ panel. Beats 3–4: photons fall
// on both and two counters show the CO₂ fixed per 1000 absorbed photons, measured by Ehleringer & Björkman (1977) in normal
// air on the C₃ plant Encelia californica and the C₄ plant Atriplex rosea: 69 vs 53 at 14 °C, 42 vs 53 at 38 °C.
import { schemaSvg } from '../figs/cc-schema';
import { CC12_SIDE } from './beats-cc';
import { drawFlyers, flyersSvg } from './cc11-common';
import { pumpFlyers } from './cc12-common';
import {
  camera, clock, f1, fit, glyph, kOf, label, lightPanel, onStage, PANEL, pop, put, schemaScene, setters, slideCard, SLIDE, textScaler, tfStr, tw, tx,
  type V,
} from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a12d';
const LABEL = 'Four panels: where CO2 meets Rubisco in C3, C2, C4 and CAM plants. Lit: C4';
const VL = fit([4, 4, 394, 590], [24, 16, 760, 708]);
const B1 = { cam: 0.05, camD: 1.05, light: [0.6, 1.2] as V, labs: 1.2, end: 1.6 };
const B2 = { t0: 0.2, end: 4.6 };
const B3 = { photons: 0.15, count: [0.4, 1.9] as V, end: 2.3 };
const B4 = { temp: [0.1, 0.7] as V, photons: 0.8, count: [1.0, 2.5] as V, end: 2.9 };
const TEND = [B1.end, B2.end, B3.end, B4.end];
const N_PH = 9;

export function build(): Staging {
  const { svg: scene, geo } = schemaScene(schemaSvg(P, ['c4'], LABEL), P, ['c4']);
  const g = geo.c4, bs = g.rects['fcc-bs'][0];
  const kIn = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-k fcc-thin'][0])!, ac = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g.paths['fcc-r fcc-r-m'][0])!;
  const cy = +ac[2], pepc: V = [+ac[1] - 32, cy], bsIn: V = [+ac[3] + 14, cy];
  const out = g.co2.sort((a, b) => a[0] - b[0])[0];
  const rub = g.cp.filter(c => c.x > bs[0]).map((c): V => [c.x, c.y]).sort((a, b) => a[1] - b[1]);
  const pump = pumpFlyers(`${P}p`, 1, {
    co2: [out, [+kIn[3], cy], [pepc[0] - 26, cy]],
    acid: [[pepc[0] + 32, cy], [+ac[3], cy], bsIn],
    rel: [[bsIn, [rub[0][0] + 4, rub[0][1] + 6]], [bsIn, [rub[1][0] - 4, rub[1][1] - 6]]],
  }, { t0: B2.t0, r: 9 });
  // photons: fall into each panel's cells
  const drop = (k: 'c3' | 'c4', i: number): [V, V] => {
    const [x, y, w] = PANEL[k], u = (i + 0.5) / N_PH, xx = x + 40 + u * (w - 80), yy = y + 150 + ((i * 37) % 100);
    return [[xx + 30, y + 92], [xx, yy]];
  };
  const photons = (['c3', 'c4'] as const).flatMap(k => Array.from({ length: N_PH }, (_, i) => glyph(`${P}-ph-${k}${i}`, '<circle class="cca-photon" r="7"/>'))).join('');

  // counters (stage px), one beside each panel
  const a = (p: V): V => onStage(VL, p);
  const row = (k: 'c3' | 'c4', y: number, head: string, sp: string): string => `
    ${tx(820, y, head, 'cca-h', 'start')}${tx(820, y + 34, sp, 'cca-it', 'start')}
    <rect class="cca-bar-bg" x="820" y="${y + 56}" width="560" height="50" rx="8"/>
    <rect data-k="${P}-bar-${k}" class="${k === 'c3' ? 'cca-bar-c3' : 'cca-bar-c4'}" x="820" y="${y + 56}" width="0" height="50" rx="8"/>
    <text data-k="${P}-n-${k}" class="cca-h" x="1396" y="${y + 92}">0</text>`;
  const yC3 = a([0, 150])[1], yC4 = a([0, 446])[1];
  const counters = `<g data-k="${P}-ctr" opacity="0">
    ${tx(820, 50, 'CO₂ fixed per 1000 absorbed photons', 'cca-b', 'start')}${tx(820, 80, 'normal air (Ehleringer &amp; Björkman 1977)', 'cca-s', 'start')}
    ${row('c3', yC3 - 40, 'C₃', '<tspan font-style="italic">Encelia californica</tspan>')}
    ${row('c4', yC4 - 40, 'C₄', '<tspan font-style="italic">Atriplex rosea</tspan>')}
    <g transform="translate(1440 50)"><rect class="cca-tube" x="0" y="0" width="26" height="110" rx="13"/>
      <rect data-k="${P}-merc" class="cca-merc" x="5" y="60" width="16" height="45" rx="8"/><circle class="cca-merc" cx="13" cy="114" r="18"/></g>
    <text data-k="${P}-temp" class="cca-big" x="1420" y="100" text-anchor="end">14 °C</text></g>`;
  const labs = [
    label(...a([PANEL.c4[0] + 80, PANEL.c4[1] + PANEL.c4[3] + 2]), 'mesophyll'),
    label(...a([PANEL.c4[0] + 262, PANEL.c4[1] + PANEL.c4[3] + 2]), 'bundle sheath'),
  ].join('');
  const VAL = { c3: [69, 42], c4: [53, 53] };

  return {
    id: 'd',
    name: 'D · Side by side: C₃ vs C₄',
    note: 'The schema’s C₃ and C₄ panels framed together; the pump; then photons on both and the measured CO₂ per 1000 photons (Encelia vs Atriplex) at 14 °C and 38 °C.',
    beats: CC12_SIDE,
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}<g data-k="world">${scene}<rect data-k="${P}-veil" class="cca-veil" x="400" y="-60" width="1200" height="720" opacity="0"/></g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-l" opacity="0">${labs}</g>
        ${counters}${photons}${flyersSvg(pump)}
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
        const cam = camera([SLIDE, VL], [[0, B1.cam, B1.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);
        lightPanel(S, P, 'c3', tw(T(0), ...B1.light));
        S.op(S.q(`${P}-l`), pop(T(0), B1.labs));
        S.op(S.q(`${P}-ctr`), pop(T(0), B1.labs));
        S.op(S.q(`${P}-veil`), tw(T(0), B1.cam + 0.3, B1.cam + B1.camD));
        drawFlyers(S, pump, T, toStage, b === 1 ? 1 : 0);

        // the counters: 14 °C in beat 3, 38 °C in beat 4
        const hot = tw(T(3), ...B4.temp);
        S.set(S.q(`${P}-temp`), 'text', `${Math.round(14 + 24 * hot)} °C`);
        S.set(S.q(`${P}-merc`), 'y', f1(60 - 50 * hot));
        S.set(S.q(`${P}-merc`), 'height', f1(45 + 50 * hot));
        const c = b === 2 ? tw(tt, ...B3.count) : b === 3 ? tw(tt, ...B4.count) : 0, j = b === 3 ? 1 : 0;
        (['c3', 'c4'] as const).forEach(k => {
          const v = Math.round(VAL[k][j] * c);
          S.set(S.q(`${P}-n-${k}`), 'text', `${v}`);
          S.set(S.q(`${P}-bar-${k}`), 'width', f1((560 * v) / 80));
          for (let i = 0; i < N_PH; i++) {
            const t0 = (b === 2 ? B3.photons : B4.photons) + i * 0.13, [p0, p1] = drop(k, i);
            const u = b >= 2 ? (tt - t0) / 0.6 : -1;
            put(S, `${P}-ph-${k}${i}`, toStage([p0[0] + (p1[0] - p0[0]) * Math.min(1, Math.max(0, u)), p0[1] + (p1[1] - p0[1]) * Math.min(1, Math.max(0, u))]),
              u < 0 || u > 1.4 ? 0 : u <= 1 ? 1 : 1 - (u - 1) / 0.4);
          }
        });
      };
    },
  };
}

export const STAGING = build();
