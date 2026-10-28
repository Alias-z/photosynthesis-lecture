// From leaf to loaf, staging D · "Pairs side by side": the camera stays on one sheet with a left and a right panel; each beat
// sets two things beside each other. 1: the sunlight on a square metre of soybean field and, to the same scale, what its
// seed stores (Zhu, Long & Ort 2010 Table 1); 2: the energy cascade of a C₃ and a C₄ crop, step by step (Zhu 2010 Fig. 2);
// 3: the yield chain with breeding's two links lit (slide figure C15 v4); 4: an unmodified and a bypass tobacco plant (South
// et al. 2019 Fig. 3A) with the field gains; 5: the source (wheat ear and flag leaf, CC0) and the sink (endosperm SEM, Chen
// et al. 2024), sucrose flowing between them; last, the chain as on the slide (v3).
// Clicks: 1 · the seed's share | 2 · both cascades | 3 · the chain | 4 · the gains | 5 · sucrose to the grain ▸ the chain.
import {
  clock, fd, figCard, glyph, imageClip, placeCard, put, setters, smooth, T, type V,
} from './cr-kit';
import { FIG, IMG } from './cr15-common';
import type { Staging } from './types';

const P = 'c15d';
const L = 60, R = 860, W = 680;
/** Panel groups shown per beat (opacity keyed `${P}-s${beat}`). */
const S1 = 440, SEED = S1 * Math.sqrt(10.6 / 620);
// beat 2: the cascades (Zhu 2010 Fig. 2, % of sunlight left after each step)
const STEPS: Array<{ n: string; c3: number; c4: number; lit?: boolean }> = [
  { n: 'sunlight', c3: 100, c4: 100 },
  { n: '400–700 nm', c3: 48.7, c4: 48.7 },
  { n: 'after the light reactions', c3: 23.4, c4: 23.4 },
  { n: 'in carbohydrate', c3: 12.6, c4: 8.5 },
  { n: 'after photorespiration', c3: 6.5, c4: 8.5, lit: true },
  { n: 'biomass', c3: 4.6, c4: 6.0 },
];
const CK = 4.2, CY = 150, CDY = 88;
// beat 4: one plant of each (Fig. 3A, image pixels): the unmodified plant on the left, a bypass plant (AP3 with RNAi) on the right
const PLANTS = [{ win: [24, 96, 168, 180], name: 'unmodified' }, { win: [604, 70, 168, 196], name: 'with bypass' }];

export const STAGING: Staging = {
  id: 'd',
  name: 'D · Pairs side by side',
  note: 'One sheet, two panels: sunlight vs seed (to scale); C₃ vs C₄ cascade; the chain (v4); unmodified vs bypass tobacco; source vs sink.',
  holds: [[0], [0.5], [], [0.5], [0.5, 3.2]],
  svg: () => {
    const head = (x: number, s: string, sub = ''): string => `${T(x, 70, s, 'cra-h')}${sub ? T(x, 106, sub, 'cra-s') : ''}`;
    // 1 · sunlight and the seed
    const s0 = `<g data-k="${P}-s0">
      ${head(L, 'sunlight on 1 m² of soybean field', 'one season')}
      <rect class="cra-sq-sun" x="${L + 40}" y="${640 - S1}" width="${S1}" height="${S1}"/>
      ${T(L + 40 + S1 + 24, 640 - S1 + 40, '620 MJ', 'cra-big')}
      ${head(R, 'stored in the seed', 'same scale')}
      <rect class="cra-sq-sun" x="${R + 40}" y="${640 - S1}" width="${S1}" height="${S1}" fill="none" style="fill:none;stroke-dasharray:8 8"/>
      ${glyph(`${P}-seed`, `<rect x="0" y="${-SEED}" width="${SEED}" height="${SEED}" fill="#9c7a2c"/>`)}
      <g data-k="${P}-seedr" opacity="0">${T(R + 40 + SEED + 24, 640 - 44, '10.6 MJ', 'cra-big')}${T(R + 40 + SEED + 24, 640 - 4, '1.7 % of the sunlight', 'cra-l')}</g>
      ${T(1560, 722, 'data: Zhu, Long &amp; Ort 2010, Annu Rev Plant Biol, Table 1 (soybean, SoyFACE 2002, 380 ppm)', 'cra-crd', 'end')}
    </g>`;
    // 2 · the cascades
    const col = (x: number, k: 'c3' | 'c4', name: string): string => `${head(x, name)}${STEPS.map((s, i) => {
      const y = CY + i * CDY;
      return `<g data-k="${P}-${k}${i}" opacity="${i ? 0 : 1}">${s.lit ? `<rect class="${k === 'c3' ? 'cr-band-c3' : 'cr-band-c4'}" x="${x - 12}" y="${y - 30}" width="${W}" height="${CDY - 6}" rx="12"/>` : ''}
        ${T(x, y - 4, s.n, s.lit ? 'cra-lb' : 'cra-l')}
        <rect class="cra-bar-${i < 3 ? 'g' : k}" x="${x}" y="${y + 10}" width="${(s[k] * CK).toFixed(1)}" height="30" rx="4"/>
        ${T(x + s[k] * CK + 12, y + 35, `${s[k] === 100 ? '100' : s[k].toFixed(1)} %`, 'cra-val')}</g>`;
    }).join('')}`;
    const s1 = `<g data-k="${P}-s1" opacity="0"><g class="fig">${col(L, 'c3', 'C₃ crop')}${col(R, 'c4', 'C₄ crop')}</g>
      ${T(1560, 722, 'data: Zhu, Long &amp; Ort 2010, Annu Rev Plant Biol, Fig. 2 (30 °C, 387 ppm CO₂)', 'cra-crd', 'end')}</g>`;
    // 3 · the chain
    const s2 = figCard(`${P}-v4`, FIG('v4'), 400 - 400 * 1.07 + 400, 370 - 300 * 1.07, 1.07, {}, 0);
    // 4 · the two plants and their biomass
    const plants = PLANTS.map((p, i) => {
      const x = i ? R : L, c = imageClip(`${P}-pl${i}`, IMG.south, x + 60, 120, 380, { win: p.win, rot: 0, seed: 111 + i, m: 10 });
      return `${head(x, p.name, i ? 'tobacco with the bypass' : 'tobacco')}${c.svg}`;
    }).join('');
    const s3 = `<g data-k="${P}-s3" opacity="0">${plants}
      ${T(L + 470, 292, 'biomass', 'cra-l')}${T(L + 470, 350, '100 %', 'cra-big')}
      <rect class="cra-bar-g" x="${L + 470}" y="${560 - 200}" width="60" height="200" rx="4"/>
      ${[0, 1].map(i => `<rect data-k="${P}-gb${i}" class="cra-bar-up" x="${R + 480 + i * 120}" y="560" width="60" height="0" rx="4"/>
        <text data-k="${P}-gv${i}" class="cra-val" x="${R + 510 + i * 120}" y="350" text-anchor="middle" opacity="0">${i ? '+24 %' : '+20 %'}</text>
        ${T(R + 510 + i * 120, 600, i ? '2017' : '2016', 'cra-tk', 'middle')}`).join('')}
      ${T(1560, 722, 'photos: South et al. 2019, Science, Fig. 3A · CC BY 4.0 · field biomass: South et al. 2019', 'cra-crd', 'end')}</g>`;
    // 5 · source and sink
    const ear = imageClip(`${P}-ear`, IMG.ear, L + 40, 130, 300, { win: [580, 40, 360, 720], rot: 0, seed: 121, m: 10 });
    const sem = imageClip(`${P}-sem`, IMG.chen9, R + 40, 140, 440, { win: [502, 26, 236, 152], rot: 0, seed: 123, m: 10 });
    const gr = imageClip(`${P}-gr`, IMG.chen6, R + 40, 140 + sem.h + 26, 130, { win: [16, 340, 189, 286], rot: 0, seed: 125, m: 8 });
    const flow = Array.from({ length: 9 }, (_, i) => glyph(`${P}-f${i}`, '<circle class="cra-flow" cx="0" cy="0" r="9"/>')).join('');
    const s4 = `<g data-k="${P}-s4" opacity="0">
      ${head(L, 'source', 'green ear and leaves: photosynthesis')}${ear.svg}
      ${head(R, 'sink', 'endosperm, 20 days after flowering')}${sem.svg}
      <path class="cr-phloem" d="M${L + 350},420 C${L + 520},420 ${R - 160},300 ${R + 20},300" style="stroke-dasharray:none;stroke-width:3;opacity:.35"/>
      ${T((L + R) / 2 + 120, 452, 'phloem: sucrose', 'cra-lb cra-amber', 'middle')}
      ${flow}
      <g data-k="${P}-gr" opacity="0">${gr.svg}${T(R + 200, 140 + sem.h + 84, 'mature grain:', 'cra-lb')}${T(R + 200, 140 + sem.h + 120, 'starch granules', 'cra-l')}</g>
      ${T(1560, 722, 'photo: P. Alexander, Wikimedia Commons · CC0 · SEM: Chen et al. 2024, Plant Physiol, Figs. 9A, 6B (wild type, durum wheat) · CC BY 4.0', 'cra-crd', 'end')}</g>`;
    const end = figCard(`${P}-v3`, FIG('v3'), 400 - 400 * 1.07 + 400, 370 - 300 * 1.07, 1.07, {}, 0);
    return `<g class="fig-none">${s0}${s1}${s2}${s3}${s4}${end}</g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const flowAt = (u: number): V => {
      // the phloem path, a cubic from the ear to the endosperm
      const p0: V = [L + 350, 420], c1: V = [L + 520, 420], c2: V = [R - 160, 300], p3: V = [R + 20, 300], v = 1 - u;
      return [v ** 3 * p0[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u ** 3 * p3[0], v ** 3 * p0[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u ** 3 * p3[1]];
    };
    const K = 1.07, O: V = [400 - 400 * K + 400, 370 - 300 * K];
    return (beat, t) => {
      const T_ = clock(beat, t);
      // which pair is on the sheet: each beat's pair fades in as the last one fades out
      const on = (b: number): number => (b === 0 ? 1 : fd(T_(b), 0, 0.4)) * (b < 4 ? 1 - fd(T_(b + 1), 0, 0.3) : 1);
      S.op(S.q(`${P}-s0`), on(0));
      S.op(S.q(`${P}-s1`), on(1));
      placeCard(S, `${P}-v4`, O[0], O[1], K, on(2));
      S.op(S.q(`${P}-s3`), on(3));
      const endU = fd(T_(4), 3.3, 0.5);
      S.op(S.q(`${P}-s4`), on(4) * (1 - endU));
      placeCard(S, `${P}-v3`, O[0], O[1], K, endU);
      // 1 · a copy of the sunlight square shrinks into the seed's share and moves to the right panel
      const u0 = smooth(T_(0) / 1.2), side = S1 + (SEED - S1) * u0;
      put(S, `${P}-seed`, [L + 40 + (R - L) * u0, 640], 1, side / SEED);
      const mix = (a: number, b: number): string => Math.round(a + (b - a) * u0).toString(16).padStart(2, '0');
      S.set(S.q(`${P}-seed`).firstElementChild as Element, 'fill', `#${mix(0xfb, 0x9c)}${mix(0xe7, 0x7a)}${mix(0xa8, 0x2c)}`);
      S.op(S.q(`${P}-seedr`), fd(T_(0), 1.2, 0.3));
      // 2 · the steps, both crops at once
      STEPS.forEach((_, i) => {
        if (!i) return;
        S.op(S.q(`${P}-c3${i}`), fd(T_(1), 0.55 + (i - 1) * 0.42, 0.25));
        S.op(S.q(`${P}-c4${i}`), fd(T_(1), 0.55 + (i - 1) * 0.42, 0.25));
      });
      // 4 · the bypass plant's gains
      [20, 24].forEach((g, i) => {
        const u = smooth((T_(3) - 0.6 - i * 0.3) / 0.8), h = 200 * (1 + g / 100) * u;
        const el = S.q(`${P}-gb${i}`);
        S.set(el, 'y', (560 - h).toFixed(1));
        S.set(el, 'height', h.toFixed(1));
        S.op(S.q(`${P}-gv${i}`), fd(u, 0.7, 0.3));
        S.set(S.q(`${P}-gv${i}`), 'y', (560 - 200 * (1 + g / 100) - 14).toFixed(1));
      });
      // 5 · sucrose flows from the source to the sink; the mature grain's starch
      for (let i = 0; i < 9; i++) {
        const u = (T_(4) - 0.6 - i * 0.22) / 1.3;
        put(S, `${P}-f${i}`, flowAt(Math.max(0, Math.min(1, u))), u > 0 && u < 1 ? fd(u, 0, 0.1) * (1 - fd(u, 0.9, 0.1)) : 0);
      }
      S.op(S.q(`${P}-gr`), fd(T_(4), 2.6, 0.3));
    };
  },
};
