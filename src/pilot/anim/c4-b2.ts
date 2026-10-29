// 'lf12', staging c4b2 · C₂ against C₄, "trap against pump", in the style of the picked c2sb (anim/c2s-b.ts).
// - 2 cards side by side: C₂ (Homolepis aturensis, Khoshravesh et al. 2016, CC BY 3.0: the light micrograph, a lens on
//   the bundle-sheath cell right of the vein, and c2sb's real TEM in the magnifier, labelled as there: vein,
//   mitochondria, chloroplasts, vacuole, mesophyll cell) and C₄ (maize, CC0: c4-b.ts's magnifier of the same
//   micrograph, labelled: vein, bundle-sheath cell, chloroplasts, mesophyll cell, PEPC, RuBisCO).
// - Beat 2, C₂ traps: glycine comes from the mesophyll cell along the cell's rim to the mitochondria; 4 CO₂ characters
//   are released one at a time and bounce; 3 are caught on the chloroplasts (flash), 1 leaks.
// - Beat 3, C₄ pumps: c4-b.ts's pump (PEPC fixes CO₂, malate into the bundle sheath, CO₂ released and held at RuBisCO;
//   3 more; one O₂; one leaks); pill, glow, the question. Every fade ≥ 0.8 s; one thing moves at a time; holds per step.
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import temJpg from '../../assets/photos/c11a-homolepis-tem.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import { atomBall, row } from '../figs/carbon-form';
import { flashDefs, flashG, kidG, T } from './co2-kit';
import { attrSetter, cardSvg, curve, ease, f, glide, placer, type Path, type V } from './dk2-common';
import {
  C4_STEPS, CITES, FD, O2_PX, ZC, c4Labels, catchT, fitPills, flashOf, hudMover, kidOf, labSvg, leader, magC4, magnifier, malG,
  o2B, pill, pumpAt, pumpTimes, setKid, walk, zmap, type Kid, type Lab, type Run, type Zm,
} from './c4-b';
import type { Beat, Cite, Staging } from './types';

const P = 'c4b2';
const R = 11, ST = 2.15 * R;
const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };

const C4B2: Beat[] = [
  {
    tag: 'C₂ and C₄ leaves', say: '', cite: [CITES.KHOSH16, CITES.SAGE12],
    steps: [
      { tag: 'C₂ and C₄ leaves', say: 'A C₂ grass and maize (C₄), cut across a vein: a ring of bundle-sheath cells around the vein, the mesophyll outside it.' },
      { tag: 'Magnified', say: 'C₂ (electron micrograph): mitochondria on the vein side, chloroplasts packed round them. Maize: bundle-sheath cells full of chloroplasts, with RuBisCO; PEPC in the mesophyll.' },
    ],
  },
  {
    tag: 'C₂: a trap', say: '', cite: [RAWS88, CITES.KHOSH16, KEER14],
    steps: [
      { tag: 'C₂: glycine moves', say: 'In the C₂ leaf, glycine from photorespiration moves through plasmodesmata into the bundle sheath, to its mitochondria.' },
      { tag: 'C₂: a trap', say: 'They release CO₂ from glycine behind the chloroplasts: RuBisCO catches most of it, a little leaks. C₂ recaptures CO₂ after RuBisCO has taken O₂.' },
    ],
  },
  {
    tag: 'C₄: a pump', say: '', cite: [CITES.HS66, CITES.VCF03, CITES.FURB11],
    steps: [{ tag: 'C₄: a pump', say: 'C₄ pumps CO₂ in before RuBisCO can take O₂. In the mesophyll PEPC fixes the CO₂, as bicarbonate, onto PEP: a 4-carbon acid (malate); PEPC does not react with O₂.' }, ...C4_STEPS.slice(1)],
  },
];

/* ---------------------------------------------------------------- layout (stage units) */

const RM = 212, KR = 10;
const PHK = 0.256, PHW = 256, PHH = 740 * PHK;
/** The 2 cards; each photo at the card's top left, the magnifier right of it. */
const PH2 = { x: 26, y: 64 }, PH4 = { x: 818, y: 64 };
const C2: V = [552, 326], C4: V = [1350, 326];
const phAt = (o: { x: number; y: number }, q: V): V => [o.x + q[0] * PHK, o.y + q[1] * PHK];

/** C₂: the TEM (741 × 744 px) at TS, its pixel TC on the magnifier's centre (c2sb: TS 0.385 at radius 142). */
const TS = (0.385 * RM) / 142, TC: V = [369, 375];
const tm = (x: number, y: number): V => [C2[0] + (x - TC[0]) * TS, C2[1] + (y - TC[1]) * TS];
/** c2sb's stage points (its magnifier at [1146, 466], TS 0.385) to TEM pixels, then onto this magnifier. */
const fromC2sb = (p: V): V => tm(TC[0] + (p[0] - 1146) / 0.385, TC[1] + (p[1] - 466) / 0.385);
const J = (q: V[]): V[] => q.map(fromC2sb);
const RUN2: Run[] = (() => {
  const t4 = 3.6, step = 2.3, j = (3 * TS) / 0.385;
  return [
    { p: walk(J([[1032, 488], [1056, 500], [1032, 506], [1054, 516], [1032, 492], [1066, 478]]), 11, j), t0: t4, end: 'caught', glad: () => 0 },
    { p: walk(J([[1026, 460], [1044, 444], [1028, 434], [1046, 418], [1058, 436]]), 23, j), t0: t4 + step, end: 'caught', glad: () => 0 },
    { p: walk(J([[1032, 504], [1058, 530], [1040, 524], [1062, 544], [1048, 534], [1076, 520]]), 37, j), t0: t4 + 2 * step, end: 'caught', glad: () => 0 },
    { p: walk(J([[1028, 496], [1038, 510], [1038, 522], [1050, 540], [1052, 556], [1056, 578]]), 53, j), t0: t4 + 3 * step, end: 'out', glad: (_, u) => ease(u, 0.55, 0.85) },
  ] as Run[];
})();
/** Glycine: from the mesophyll cell (TEM top right) through the wall, along the cell's rim to the mitochondria. */
const G2: Path = curve([tm(700, 96), tm(640, 150), tm(570, 175), tm(520, 150), tm(460, 127), tm(390, 134), tm(300, 146), tm(230, 152),
  tm(180, 178), tm(140, 218), tm(100, 268), tm(68, 322), tm(50, 360)]);
const glyG = `<path d="M0,0H${f(ST)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>${atomBall(ST, 0, 'N', R)}${row(-ST / 2, 0, 'CC', { r: R })}`;

/** C₂ TEM labels, placed for this layout (targets as in c2sb). */
const TL2: Lab[] = [
  { k: 'vein', s: ['vein'], at: [282, 300], a: 'end', from: [286, 296], to: [tm(5, 400)] },
  { k: 'mt', s: ['mitochondria'], at: [282, 420], a: 'end', from: [286, 416], to: [tm(32, 455), tm(40, 497)] },
  { k: 'cp', s: ['chloroplasts'], at: [282, 520], a: 'end', from: [286, 516], to: [tm(176, 586), tm(118, 548)] },
  { k: 'vac', s: ['vacuole'], at: tm(420, 390), a: 'middle' },
  { k: 'ms', s: ['mesophyll cell'], at: tm(560, 255), a: 'middle', from: tm(600, 236), to: [tm(650, 160)] },
];
const ZM: Zm = { c: C4, rm: RM, zs: (0.9 * RM) / 142, kr: KR };
const TL4 = c4Labels(ZM, { vein: [1082, 300], bs: [1050, 410], cp: [1040, 520], ms: [1520, 96], pepc: zmap(ZM)(800, 424), rub: zmap(ZM)(668, 400) });

const PILL2: V = [400, 584], PILL4: V = [1200, 584];
/** The photos with their rings, names and lenses (photo px: ring centre and radii; the C₂ lens on the bundle-sheath
 *  cell right of the vein as in c2sb; the C₄ lens on the big bundle-sheath cell, its radius RM / zs photo px). */
function photos(): string {
  const ring = (k: string, o: { x: number; y: number }, r: [number, number, number, number]): string => {
    const c = phAt(o, [r[0], r[1]]);
    return `<g data-k="${P}-bs${k}" opacity="0"><ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(r[2] * PHK)}" ry="${f(r[3] * PHK)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/></g>`;
  };
  const img = (o: { x: number; y: number }, href: string): string => `<image href="${href}" x="${o.x}" y="${o.y}" width="${PHW}" height="${f(PHH)}" preserveAspectRatio="none"/>
    <rect x="${o.x}" y="${o.y}" width="${PHW}" height="${f(PHH)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>`;
  const name = (k: string, at: V, s: string): string => `<g data-k="${P}-${k}" opacity="0">${T(at[0], at[1], s, 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>`;
  return `${img(PH2, homJpg)}${img(PH4, zeaJpg)}${ring('2', PH2, [488, 414, 294, 240])}${ring('4', PH4, [517, 382, 252, 210])}
    ${name('bsn2', phAt(PH2, [254, 562]), 'bundle sheath')}${name('ms2', phAt(PH2, [840, 105]), 'mesophyll')}
    ${name('bsn4', phAt(PH4, [200, 640]), 'bundle sheath')}${name('ms4', phAt(PH4, [820, 80]), 'mesophyll')}`;
}

function hudSvg(): string {
  const defs = `<defs>${flashDefs(P)}</defs>`;
  const L2 = phAt(PH2, [690, 425]), L4 = phAt(PH4, ZC);
  const kid = (k: string): string => kidG(`${P}-${k}`, KR, 'CO₂', -KR - 8).replace('co2k-kl"', 'co2k-kl" style="font-size:16px"');
  const fl = (k: string): string => `<g data-k="${P}-${k}" opacity="0">${flashG(P, 30)}</g>`;
  const [x0, y0] = tm(0, 0);
  const tem = `<image href="${temJpg}" x="${f(x0)}" y="${f(y0)}" width="${f(741 * TS)}" height="${f(744 * TS)}" preserveAspectRatio="none"/>`;
  return `${defs}${cardSvg(8, 8, 784, 600)}${cardSvg(808, 8, 784, 600)}
    ${photos()}
    ${magnifier(P, 'm2', C2, RM, L2, 100 * PHK, tem)}${magnifier(P, 'm4', C4, RM, L4, (RM / ZM.zs) * PHK, magC4(P, ZM))}
    ${T(400, 44, 'C₂ leaf: a trap', 'co2k-zl', 'middle', ' style="font-size:26px"')}${T(1200, 44, 'C₄ leaf (maize): a pump', 'co2k-zl', 'middle', ' style="font-size:26px"')}
    ${TL2.map(l => labSvg(`${P}2`, l)).join('')}${TL4.map(l => labSvg(`${P}4`, l)).join('')}${fl('fl2')}${fl('fl4')}
    ${hudMover('o2b', o2B, 'O₂', -26, 0.9, 16)}${hudMover('mal', malG, 'malate', -26, 0.9, 16)}${hudMover('g2', glyG, 'glycine', -26, 0.9, 16)}
    ${[0, 1, 2, 3].map(i => kid(`b${i}`)).join('')}${[0, 1, 2, 3].map(i => kid(`c${i}`)).join('')}
    ${pill(P, 'p2', PILL2, 'C₂: traps the CO₂ photorespiration releases', '#2f6f5f')}${pill(P, 'p4', PILL4, 'C₄: pumps CO₂ in before RuBisCO takes O₂', '#2f6f5f')}
    ${T(8, 734, '<tspan font-style="italic">Homolepis aturensis</tspan> (C₂, light micrograph and TEM): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0) · maize (C₄): Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- the script */

const B1 = { bs: 0.3, ms: 1.2, hold: 2.1, lens: 2.2, mag: 3.1, tl: 4.0, tlStep: 0.5 } as const;
const B2 = { gly: [0.4, 2.4], hold: 3.4, pill: catchT(RUN2[3]) + 0.3 } as const;
const PT = pumpTimes(0.3);

export const STAGING: Staging = {
  id: 'c4b2',
  name: 'c4b2 · Trap against pump: C₂ beside C₄',
  note: 'C₂ (its real TEM, labelled as in c2sb) beside C₄ (the maize micrograph magnified, labelled): C₂ traps the CO₂ photorespiration releases (3 of 4 caught, 1 leaks); C₄ pumps CO₂ in (PEPC, malate, released and held at RuBisCO; 4 crowd beside one O₂, one leaks); pills, glow, the question',
  beats: C4B2,
  holds: [[B1.hold], [B2.hold], PT.holds],
  keys: [
    { beat: 2, text: 'What if one cell did both steps,', x: 800, y: 660, size: 44 },
    { beat: 2, text: 'at different times?', x: 800, y: 708, size: 44 },
  ],
  svg: () => `<g class="dk1 fig dk2 co2k">${hudSvg()}</g>`,
  bind(stage) {
    const put = placer(stage, ['g2', 'mal', 'o2b']), A = attrSetter(stage);
    fitPills(stage, A, P, [['p2', PILL2], ['p4', PILL4]]);
    return (beat, t) => {
      const kid: Record<string, Kid | undefined> = {};
      const pos: Record<string, { at: V; o: number } | undefined> = {};
      if (beat === 1) {
        pos.g2 = { at: glide(G2, t, B2.gly[0], B2.gly[1]), o: ease(t, 0, FD) * (1 - ease(t, B2.gly[0] + B2.gly[1], B2.gly[0] + B2.gly[1] + FD)) };
      }
      if (beat >= 1) RUN2.forEach((r, i) => { kid[`b${i}`] = kidOf(r, beat === 1 ? t : 99); });
      const pump = beat === 2 ? pumpAt(ZM, PT, t) : undefined;
      if (pump) { pump.kid.forEach((q, i) => { kid[`c${i}`] = q; }); if (pump.mal.o > 0.004) pos.mal = pump.mal; }
      pos.o2b = { at: zmap(ZM)(O2_PX[0], O2_PX[1]), o: pump ? pump.o2 : 0 };
      put(pos);
      for (const k of ['b0', 'b1', 'b2', 'b3', 'c0', 'c1', 'c2', 'c3']) setKid(A, `${P}-${k}`, kid[k]);
      const f2 = beat === 1 ? flashOf(RUN2, t) : { o: 0, at: [0, 0] as V };
      A(`${P}-fl2`, 'opacity', f2.o); if (f2.o > 0) A(`${P}-fl2`, 'transform', `translate(${f(f2.at[0])} ${f(f2.at[1])})`);
      const f4 = pump ? pump.fl : { o: 0, at: [0, 0] as V };
      A(`${P}-fl4`, 'opacity', f4.o); if (f4.o > 0) A(`${P}-fl4`, 'transform', `translate(${f(f4.at[0])} ${f(f4.at[1])})`);
      A(`${P}-p2`, 'opacity', beat === 1 ? ease(t, B2.pill, B2.pill + FD) : beat === 2 ? 1 : 0);
      A(`${P}-p4`, 'opacity', beat === 2 ? ease(t, PT.pill, PT.pill + FD) : 0);
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + FD));
      for (const k of ['2', '4']) { A(`${P}-bs${k}`, 'opacity', on(B1.bs)); A(`${P}-bsn${k}`, 'opacity', on(B1.bs)); A(`${P}-ms${k}`, 'opacity', on(B1.ms)); }
      for (const k of ['m2l', 'm4l']) A(`${P}-${k}`, 'opacity', on(B1.lens));
      for (const k of ['m2', 'm4']) A(`${P}-${k}`, 'opacity', on(B1.mag));
      TL2.forEach((l, i) => A(`${P}2-t-${l.k}`, 'opacity', on(B1.tl + i * B1.tlStep)));
      TL4.forEach((l, i) => A(`${P}4-t-${l.k}`, 'opacity', on(B1.tl + (TL2.length + i) * B1.tlStep)));
      A(`${P}-glow`, 'opacity', beat === 2 ? ease(t, PT.glow, PT.glow + FD) : 0);
    };
  },
};
