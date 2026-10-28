// 'lf11a', staging k · C₂ photosynthesis (slide C11a; beats-co2.ts LF11AK; brief research/redo-2026-10-29/
// CO2_DIFFUSION_STORY_BRIEF.md). The drawn cell style of lf10 and lf11, so that the step from C₃ to C₂ shows: a mesophyll
// cell (chloroplasts lining the wall as in C₃) next to a bundle-sheath cell and the vein. In the bundle-sheath cell the
// mitochondria line the inner wall, next to the vein, and chloroplasts lie over them on the cell's side (Rawsthorne et
// al. 1988, Moricandia arvensis: bundle-sheath mitochondria on the vascular side, overlain by chloroplasts; Hylton et al.
// 1988: on the centripetal faces in all C₃–C₄ species studied; Khoshravesh et al. 2016). Glycine decarboxylase sits
// (almost) only in the bundle-sheath mitochondria (Rawsthorne 1988: P-protein 20.3 vs 0.7 gold particles per area;
// Hylton 1988: confined to the bundle sheath). Per 2 O₂: glycine 1 and 2 move through the plasmodesmata to a bundle-
// sheath mitochondrion; 2 glycine → serine + CO₂ 1 + NH₃ (2 × 2 C = 3 C + 1 C); CO₂ 1 is refixed by the chloroplast over
// it; serine returns. Mean CO₂ at RuBisCO in the leaf, Flaveria pubescens (C₂) 3.2 × F. cronquistii (C₃) (Keerberg et
// al. 2014, Table 1).
import { LF11AK } from './beats-co2';
import {
  actor, along, carbG, chloroG, closed, co2G, ease, f, fade, flash, flashDefs, flashG, glide, makeScene, mitoG, nh3G, o2G,
  peroxG, rbox, T, tickG, type Api, type V,
} from './co2-kit';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const p = 'lfk11a';
const MC = rbox(40, 96, 446, 556, 80), BS = rbox(512, 116, 418, 516, 64);
/** The mesophyll unit (top right, near the bundle sheath) and the bundle-sheath mitochondria along the inner wall. */
const M = { cp: [392, 120] as V, px: [430, 196] as V, mt: [330, 200] as V };
const BMT: V[] = [[904, 236], [904, 316], [904, 396], [904, 476], [904, 556]];
const BCP: V[] = BMT.map(([x, y]) => [864, y] as V);
const G = BMT[0], GCP = BCP[0];
const PD: V = [499, 250];
const GLY = (j: number): V[] => [[M.px[0] + 18, M.px[1] + (j ? 8 : -8)], [PD[0] - 14, PD[1] - 8 + j * 14], [PD[0] + 20, PD[1] - 10 + j * 14], [600, 200 + j * 10], [760, 160 + j * 10], [878, 156 + j * 4], [G[0] - 6, G[1] - 64 + j * 26]];
const SER: V[] = [[G[0] - 30, G[1] - 22], [840, 214], [700, 236], [600, 262], [PD[0] + 18, PD[1] + 22], [PD[0] - 20, PD[1] + 22], [M.px[0] + 14, M.px[1] + 18]];

function cells(): string {
  const mcps = along(MC, 78, 22, q => Math.abs(q[0] - M.cp[0]) < 46 && q[1] < 150).map(c => chloroG(c.p, c.a, 58, 22)).join('');
  const bcps = along(BS, 74, 24, q => q[0] > 820).map(c => chloroG(c.p, c.a, 62, 24)).join('');
  const vein = `<rect x="950" y="96" width="140" height="556" rx="36" style="fill:#efece2;stroke:#d8d0b8;stroke-width:1.6"/>
    ${[[990, 210, 26], [1048, 270, 20], [996, 330, 22]].map(([x, y, r]) => `<circle class="co2k-xyl" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
    ${[[1000, 450], [1040, 458], [1020, 494], [990, 530], [1046, 534]].map(([x, y]) => `<circle class="co2k-phl" cx="${x}" cy="${y}" r="15"/>`).join('')}`;
  return `<rect class="co2k-as" x="0" y="0" width="1096" height="740"/>
    <path class="co2k-cell" d="${closed(MC)}" style="stroke-width:5"/><path class="co2k-vac" d="${closed(rbox(110, 270, 300, 320, 56))}"/>${mcps}
    ${chloroG(M.cp, 0, 64, 24)}${peroxG(M.px, 15)}${mitoG(M.mt, 0, 48, 26)}${mitoG([80, 420], 1.57, 44, 24)}${mitoG([300, 620], 0, 44, 24)}
    <path class="co2k-cell" d="${closed(BS)}" style="stroke-width:5"/><path class="co2k-vac" d="${closed(rbox(582, 250, 220, 300, 50))}"/>${bcps}
    ${BMT.map(m => mitoG(m, Math.PI / 2, 52, 28)).join('')}${BCP.map(c => chloroG(c, Math.PI / 2, 66, 26)).join('')}
    <path d="M491,140V600" style="stroke:#d3c49d;stroke-width:14;fill:none"/>${[180, 250, 320, 390, 460, 530].map(y => `<path class="co2k-pd" d="M484,${y}H498"/>`).join('')}
    ${vein}`;
}

const lab = (k: string, x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', ld?: [V, V], cls = 'co2k-il'): string =>
  actor(`${p}L${k}`, `${ld ? `<path class="co2k-ld" d="M${f(ld[0][0])},${f(ld[0][1])}L${f(ld[1][0])},${f(ld[1][1])}"/>` : ''}${T(x, y, s, `${cls} cel-halo`, a)}`);
const LABELS = [
  lab('mc', 263, 688, 'mesophyll cell', 'middle', undefined, 'co2k-zl'), lab('bs', 721, 668, 'bundle-sheath cell', 'middle', undefined, 'co2k-zl'), lab('vein', 1020, 688, 'vein', 'middle', undefined, 'co2k-zl'),
  lab('as', 160, 52, 'air space'),
  lab('cp', 286, 150, 'chloroplast', 'end', [[290, 144], [358, 124]]),
  lab('px', 446, 254, 'peroxisome', 'middle', [[444, 238], [434, 212]]),
  actor(`${p}Lmt`, `<path class="co2k-ld" d="M222,232L306,206"/>${T(222, 248, 'mitochondrion:', 'co2k-il cel-halo', 'end')}${T(222, 268, '(almost) no glycine', 'co2k-il cel-halo', 'end')}${T(222, 288, 'decarboxylase', 'co2k-il cel-halo', 'end')}`),
  lab('pd', 500, 86, 'plasmodesmata', 'middle', [[500, 92], [494, 172]]),
  actor(`${p}Lbm`, `<path class="co2k-ld" d="M846,612L898,572"/>${T(846, 600, 'mitochondria with', 'co2k-il cel-halo', 'end')}${T(846, 620, 'glycine decarboxylase', 'co2k-il cel-halo', 'end')}`),
  actor(`${p}Lbc`, `<path class="co2k-ld" d="M790,452L848,420"/>${T(786, 456, 'chloroplasts', 'co2k-il cel-halo', 'end')}${T(786, 476, 'over them', 'co2k-il cel-halo', 'end')}`),
];

/* ---------------------------------------------------------------- the panel */
const PX = 1112, PW = 468;
// Only the key result, the CO₂ build-up (lecturer, 29 Oct 2026: "only the key information"); the reaction card is gone.
const rows: Array<{ k: string; y: number; s: string }> = [];
const BAR = { x: PX + 150, y: 332, w: 92 };
const panel = (): string => `${actor(`${p}chart`, `<g transform="translate(0 -254)"><rect class="co2k-card" x="${PX}" y="270" width="${PW}" height="400" rx="16"/>
    ${T(PX + 22, 306, '<tspan class="co2k-pb">mean CO₂ at RuBisCO in the leaf</tspan>', 'co2k-pr', 'start')}${T(PX + 22, 332, '(<tspan font-style="italic">Flaveria</tspan>, C₃ = 1)', 'co2k-pr', 'start')}
    <path class="co2k-up" d="M${BAR.x - 30},610H${PX + PW - 30}" style="stroke-width:1.6"/>
    <rect class="co2k-bar" x="${BAR.x}" y="${610 - 70}" width="${BAR.w}" height="70" rx="5"/>
    <rect data-k="${p}bar2" class="co2k-bar" style="fill:#6f93b0" x="${BAR.x + 150}" y="${610 - 224}" width="${BAR.w}" height="224" rx="5"/>
    ${T(BAR.x + BAR.w / 2, 530, '1 ×', 'co2k-cl')}<text data-k="${p}bar2t" class="co2k-cl" x="${BAR.x + 150 + BAR.w / 2}" y="${610 - 234}" text-anchor="middle">≈ 3 ×</text>
    ${T(BAR.x + BAR.w / 2, 636, 'C₃', 'co2k-cl')}${T(BAR.x + 150 + BAR.w / 2, 636, 'C₂', 'co2k-cl')}</g>`)}`;

function svg(): string {
  return `<defs>${flashDefs(p)}<radialGradient id="${p}-pool"><stop offset="0" stop-color="#9fb9cc" stop-opacity=".75"/><stop offset=".6" stop-color="#9fb9cc" stop-opacity=".35"/><stop offset="1" stop-color="#9fb9cc" stop-opacity="0"/></radialGradient></defs>
    ${cells()}
    ${actor(`${p}pool`, `<ellipse cx="878" cy="396" rx="86" ry="230" fill="url(#${p}-pool)"/>${T(800, 300, 'CO₂ builds up', 'co2k-zl cel-halo', 'end')}`)}
    ${LABELS.join('')}
    ${[1, 2].map(i => actor(`${p}o${i}`, `${o2G(9)}${T(0, -16, `O₂ ${i}`, 'co2k-num cel-halo')}`) + actor(`${p}g${i}`, `${carbG('CC', 10)}${i === 1 ? T(-30, 5, 'glycolate', 'co2k-num cel-halo', 'end') : ''}`) + actor(`${p}y${i}`, `${carbG('CCN', 10)}${T(0, i === 1 ? -21 : 34, `glycine ${i}`, 'co2k-num cel-halo')}`)).join('')}
    ${actor(`${p}ser`, `${carbG('CCCN', 10)}${T(0, 34, 'serine', 'co2k-num cel-halo')}`)}${actor(`${p}co2`, `${co2G(9)}${T(-34, 5, 'CO₂ 1', 'co2k-num cel-halo', 'end')}`)}
    ${actor(`${p}nh3`, `${nh3G(8)}${T(18, 5, 'NH₃', 'co2k-num cel-halo', 'start')}`)}
    ${actor(`${p}f1`, flashG(p, 28))}${actor(`${p}f2`, flashG(p, 28))}${actor(`${p}tk`, tickG('refixed'))}
    ${panel()}`;
}

function frame(a: Api, beat: number, t: number): void {
  const from = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.5) : 0);
  for (const k of ['mc', 'bs', 'vein', 'as', 'cp', 'px', 'mt', 'pd']) a.op(`${p}L${k}`, from(0, 0));
  a.op(`${p}Lbm`, from(1, 0)); a.op(`${p}Lbc`, from(1, 0.3));
  a.op(`${p}chart`, from(2, 1.2)); a.op(`${p}pool`, from(2, 0.3));
  // the C₂ bar grows when the chart appears
  const g = beat < 2 ? 0 : beat === 2 ? ease(t, 1.6, 2.8) : 1, h = 70 + (224 - 70) * g;
  a.attr(`${p}bar2`, 'y', f(610 - h)); a.attr(`${p}bar2`, 'height', f(h)); a.attr(`${p}bar2t`, 'y', f(610 - h - 10));

  if (beat === 0) {
    for (const i of [1, 2]) {
      const dx = i === 1 ? -16 : 16, o0 = 0.4 + (i - 1) * 0.3;
      a.put(`${p}o${i}`, glide([[M.cp[0] + dx * 2, 26], [M.cp[0] + dx, 74], [M.cp[0] + dx * 0.6, M.cp[1]]], t, o0, o0 + 1.2), fade(t, o0 - 0.2, o0, o0 + 1.2, o0 + 1.35));
      const g0 = 1.9 + (i - 1) * 0.2;
      a.put(`${p}g${i}`, glide([[M.cp[0] + 24, M.cp[1] + dx * 0.4], [M.px[0] - 24, M.px[1] - 30 + i * 10], [M.px[0] + dx * 0.4, M.px[1]]], t, g0, g0 + 1.1), fade(t, g0 - 0.1, g0 + 0.1, g0 + 1.1, g0 + 1.25));
      const y0 = 3.4 + (i - 1) * 0.35;
      a.put(`${p}y${i}`, glide(GLY(i - 1), t, y0 + 0.4, y0 + 4.0), ease(t, y0 - 0.1, y0 + 0.1));
    }
    flash(a, t, 1.75, M.cp, `${p}f1`); flash(a, t, 3.2, M.px, `${p}f2`);
  }
  if (beat === 1) {
    for (const i of [1, 2]) a.put(`${p}y${i}`, glide([GLY(i - 1)[GLY(i - 1).length - 1], [G[0] - 2, G[1] - 10]], t, 0, 0.4), 1 - ease(t, 0.3, 0.45));
    flash(a, t, 0.45, G, `${p}f1`);
    a.put(`${p}nh3`, glide([[G[0], G[1] + 4], [G[0] - 4, G[1] + 40]], t, 0.6, 1.4), ease(t, 0.5, 0.7));
    a.put(`${p}co2`, glide([[G[0] - 6, G[1] + 4], [GCP[0] + 4, GCP[1] + 2]], t, 0.7, 2.0), fade(t, 0.5, 0.7, 2.0, 2.2));
    flash(a, t, 2.15, GCP, `${p}f2`);
    a.put(`${p}tk`, [GCP[0] - 120, GCP[1] + 2], fade(t, 2.3, 2.7));
    a.put(`${p}ser`, glide(SER, t, 2.4, 6.0), ease(t, 2.1, 2.3) * (1 - ease(t, 6.0, 6.3)));
  }
  if (beat === 2) {
    a.put(`${p}nh3`, [G[0] - 4, G[1] + 40], 1);
    a.put(`${p}tk`, [GCP[0] - 120, GCP[1] + 2], 1 - ease(t, 0, 0.4));
  }
}

const BASE = makeScene({
  id: 'lf11ak',
  name: 'k · Mesophyll and bundle-sheath cell',
  note: 'C₂ in the drawn cell style of lf10–lf11: glycine 1 and 2 from the mesophyll through the plasmodesmata to a bundle-sheath mitochondrion on the inner wall, under a chloroplast; glycine decarboxylase releases CO₂ 1, refixed there; serine returns; CO₂ builds up (Flaveria, C₂ ≈ 3 × C₃)',
  beats: LF11AK,
  svg, frame,
});

/** The key lines on the stage (lecturer, 29 Oct 2026): each beat's take-home and the closing question. */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(0, ['Glycine moves', 'to the bundle sheath'], 1345, 530, { size: 38 }),
  ...keyLines(1, ['CO₂ released', 'in the bundle sheath'], 1345, 530, { size: 38 }),
  // not the pool's own label again ('CO₂ builds up')
  ...keyLines(2, ['More CO₂ at', 'bundle-sheath RuBisCO'], 1345, 530, { size: 38 }),
  // the question centred in the free air-space band above the bundle-sheath cell, once the bar has grown
  { beat: 2, text: 'What if the leaf pumped CO₂', x: 800, y: 46, size: 44, t0: 3.0 },
  { beat: 2, text: 'to RuBisCO directly?', x: 800, y: 96, size: 44, t0: 3.0 },
] };
