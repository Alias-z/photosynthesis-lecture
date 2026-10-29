// 'lf11a', staging c2p · C₂ slide, C₃ vs C₂ comparison (captions C2P, anim/beats-c2p.ts; brief scratchpad C2P_BRIEF.md):
// "two magnifiers". The stage is split in 2 halves, C₃ left (x 0–790), C₂ right (x 810–1600), a thin divider between.
// - Each half: its micrograph at the top left, small (300 × 222), the bundle sheath outlined, and a lens on the lower wall
//   of a bundle-sheath cell where a mesophyll cell meets it; a round magnifier beside it (radius 240), both at one scale.
//   Steinchisma laxum (C₃) and Homolepis aturensis (C₂), Khoshravesh et al. 2016, J. Exp. Bot., Fig. 1D and 1B (CC BY 3.0).
// - In both magnifiers, the same mesophyll cell in the same place (lower band): chloroplast with RuBisCO (PDB 8RUC),
//   peroxisome, mitochondrion with glycine decarboxylase (PDB 4LHC), the far wall and an air space under it. Above the
//   wall, the bundle-sheath cell: in C₃ plain (vacuole); in C₂ its chloroplast with RuBisCO next to the wall and, behind
//   it on the vein side, its mitochondrion with glycine decarboxylase; the wall has a plasmodesma. In the C₂ mesophyll
//   mitochondrion glycine decarboxylase is faded (absent). Organelles drawn as on the photorespiration strip
//   (figs/cell-schema.ts: stroma, peroxisome and matrix fills, bilayers); molecules are dk-rf6's glyphs at R = 11.
// - Beats: 1 photos, the bundle sheath and mesophyll named, then lenses and magnifiers (fades only); 2 in the C₃
//   mesophyll RuBisCO carboxylates (RuBP + CO₂ → 2 × 3-PGA), then oxygenates twice (RuBP + O₂ → 3-PGA + 2-PG), each 2-PG
//   goes through the peroxisome and becomes glycine; then the same, quicker, on the C₂ side; 3 C₃ only: the 2 glycines
//   go into the mitochondrion, give serine and CO₂, the CO₂ escapes to the air space; 4 C₂ only: the 2 glycines go
//   through the plasmodesma into the bundle-sheath mitochondrion, give serine and CO₂, the CO₂ goes to bundle-sheath
//   RuBisCO, which holds it, the bundle sheath glows; the question. The released CO₂ is the hero (lecturer: in one it
//   leaks, in the other it is trapped): slide 19's CO₂ character (co2-kit kidG), which ends outside the leaf's cell in
//   C₃ and at bundle-sheath RuBisCO in C₂. One thing moves at a time; one framing; eased glides only.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import './dk2-common.css';
import { atomBall, row } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { C2P } from './beats-c2p';
import { actor, bilayerE, ease, ease2, f, flash, flashDefs, flashG, from, inset, kid, kidG, life, makeScene, path, T, type Api, type V } from './co2-kit';
import type { Staging } from './types';

const P = 'c2p';
type Side = 'a' | 'b';
const K = (s: Side, n: string): string => `${P}${s}-${n}`;

/* ---------------------------------------------------------------- glyphs: dk-rf6's, at its atom radius (no numbers) */

const R = 11, ST = 2.15 * R;
const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG → glycolate → glycine: a 2-C body whose end atom changes (P, none, N); a red glow while it is 2-PG. */
const c2G = (k: string): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}`;
/** Serine: a 3-C body, its N above the middle carbon (dk-rf6 c3G with the N on, the P off). */
const c3G = (): string => `<g><path d="M${f(-ST / 2)},0V${f(-ST)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>${atomBall(-ST / 2, -ST, 'N', R)}</g><g opacity="0">${bond(ST / 2, 1.5 * ST)}${atomBall(1.5 * ST, 0, 'P', R)}</g>${row(-ST / 2, 0, 'CCC', { r: R })}`;
const gas = (el: string): string => `<g class="chn-g">${balls(0, 0, el)}</g>`;

/* ---------------------------------------------------------------- the stage: 2 halves */

const MR = 240, CY = 352, CX: Record<Side, number> = { a: 546, b: 1356 };
const SC = 0.3;
/** The photos (stage units) and, in photo units (1000 × 740): the bundle-sheath ring, the lens (on the lower wall of a
 *  bundle-sheath cell, a mesophyll cell below it), the places of the 2 names. */
const PH: Record<Side, { x: number; y: number; img: string; ring: [number, number, number, number]; lens: V; bs: V; mes: V }> = {
  a: { x: 10, y: 50, img: steJpg, ring: [481, 352, 301, 348], lens: [640, 638], bs: [460, 170], mes: [830, 76] },
  b: { x: 820, y: 50, img: homJpg, ring: [482, 409, 293, 231], lens: [450, 622], bs: [300, 440], mes: [480, 110] },
};
const onPh = (s: Side, q: V): V => [PH[s].x + SC * q[0], PH[s].y + SC * q[1]];

/* ---------------------------------------------------------------- the magnifier (local units, origin at its centre) */

/** The wall between the bundle-sheath cell (above) and the mesophyll cell (below); their plasma membranes; the
 *  plasmodesma (C₂) at x PDX. */
const WY = -26, PMB = WY - 21, PMM = WY + 21, PDX = 180, PDW = 22;
/** The mesophyll cell's far wall (its middle line), the air space under it. */
const farY = (x: number): number => 176 - 26 * (x / MR) ** 2;
/** Mesophyll: chloroplast (stroma radii), RuBisCO, RuBP's place; peroxisome; mitochondrion and its glycine decarboxylase. */
const MC: V = [-44, 74], MRX = 100, MRY = 58, MRUB: V = [-44, 50], RUBP: V = [-44, 98];
const PX: V = [128, 32], PXR = 22;
const MM: V = [132, 104], MGDC: V = [100, 104];
/** Bundle sheath (C₂): chloroplast by the wall, RuBisCO; mitochondrion behind it (vein side), glycine decarboxylase. */
const BC: V = [-24, -104], BRX = 96, BRY = 34, BRUB: V = [-24, -104];
const BM: V = [-20, -194], BGDC: V = [-50, -194];

/** Where the molecules go (local units). */
const GAS_IN: V[] = [[44, 30], [20, 36], [-6, 46]];
const PGX: V = [-44, 99], PGA1: V = [-82, 98], PG2: V = [4, 98];
const PARK: V[] = [[192, 22], [192, 46]], PAIR0: V = [192, 34], DY = 12;
const RUNQ: V[][] = PARK.map(p => [PG2, [40, 64], [76, 30], PX, p]);
const PAIR_M: V = [156, 104], PAIR_B: V = [8, -194];
const GO_M: V[] = [PAIR0, [180, 68], PAIR_M];
const GO_B: V[] = [PAIR0, [184, 6], [PDX, WY], [176, -62], [140, -128], [74, -182], PAIR_B];
/** Serine takes the footprint of the 2 glycines (its centre offset by the c3G body's middle). */
const SER = (p: V): V => [p[0] + 11.85, p[1] + 11.8];
/** The released CO₂ (the hero, slide 19's CO₂ character): in C₃ out of the mitochondrion, through the far wall, into
 *  the air space; in C₂ from the bundle-sheath mitochondrion to bundle-sheath RuBisCO, which holds it. */
const ESC: V[] = [[86, 104], [86, 148], [54, 188], [14, 210]];
const TO_RUB: V[] = [[BGDC[0] - 8, BGDC[1]], [-44, -170], [-24, -136]];

/** Where each 2-PG run leaves the chloroplast (its P goes) and reaches the peroxisome's middle (it takes its N). */
const uWhere = (q: V[], test: (p: V) => boolean): number => { const c = path(q); for (let i = 0; i <= 400; i++) if (test(c(i / 400))) return i / 400; return 1; };
const U_OUT = RUNQ.map(q => uWhere(q, p => ((p[0] - MC[0]) / (MRX + 15)) ** 2 + ((p[1] - MC[1]) / (MRY + 15)) ** 2 > 1));
const U_PX = RUNQ.map(q => uWhere(q, p => Math.hypot(p[0] - PX[0], p[1] - PX[1]) < 6));

const granum = (x: number, y: number, w: number, n = 3): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
/** A chloroplast as on the strip: intermembrane space, stroma (an optional glow over it), 2 envelope bilayers, grana,
 *  RuBisCO (image width rw at rub). */
function chloroplast(c: V, rx: number, ry: number, rub: V, rw: number, grana: string, glow = ''): string {
  return `<ellipse class="cel-ims" cx="${c[0]}" cy="${c[1]}" rx="${rx + 11}" ry="${ry + 11}"/><ellipse class="cel-stroma" cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${glow}
    ${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4)}${grana}
    <image href="${rubPng}" x="${f(rub[0] - rw / 2)}" y="${f(rub[1] - (rw * 471) / 548 / 2)}" width="${rw}" height="${f((rw * 471) / 548)}"/>`;
}
/** A mitochondrion as on the strip: matrix, outer and inner bilayer, cristae, glycine decarboxylase (opacity go). */
function mito(c: V, rx: number, ry: number, g: V, folds: number[], go = 1): string {
  const ri = rx - 9, qi = ry - 9;
  const cr = folds.map((u, i) => {
    const x = c[0] + u * ri, h = qi * Math.sqrt(1 - u * u), s = i % 2 ? 1 : -1, y0 = c[1] + s * (h - 1);
    return bilayer([{ L: [x, y0, x, y0 - s * 10] }], 3.4, 1.2, 3.2);
  }).join('');
  const gw = 44;
  return `<ellipse class="cel-matrix" cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 3.6)}${bilayerE(c[0], c[1], ri, qi, 3.6)}${cr}
    <image href="${gdcPng}" x="${f(g[0] - gw / 2)}" y="${f(g[1] - (gw * 222) / 302 / 2)}" width="${gw}" height="${f((gw * 222) / 302)}"${go < 1 ? ` opacity="${go}"` : ''}/>`;
}
const perox = (): string => `<circle class="cel-perox" cx="${PX[0]}" cy="${PX[1]}" r="${PXR}"/>${bilayerE(PX[0], PX[1], PXR, PXR, 4)}`;

function wall(pd: boolean): string {
  const x0 = -MR - 4, x1 = MR + 4, pmL = (y: number, a: number, b: number): string => bilayer([{ L: [a, y, b, y] }], 6, 1.6, 4.2);
  const fib = Array.from({ length: 20 }, (_, i) => { const x = x0 + 8 + i * 25; return pd && Math.abs(x + 12 - PDX) < PDW + 14 ? '' : `<path class="cel-wallf" d="M${f(x)},${f(WY - 4 + (i % 3) * 4)}q12,-4 24,0"/>`; }).join('');
  const pm = (y: number): string => (pd ? pmL(y, x0, PDX - PDW) + pmL(y, PDX + PDW, x1) : pmL(y, x0, x1));
  // the plasmodesma: an open channel through the wall, lined by the plasma membrane, a desmotubule down its middle
  const chan = pd ? `<rect class="co2k-cyt" x="${PDX - PDW + 5}" y="${PMB}" width="${2 * PDW - 10}" height="${PMM - PMB}"/>
    ${bilayer([{ L: [PDX - PDW, PMB, PDX - PDW, PMM] }], 5, 1.5, 4)}${bilayer([{ L: [PDX + PDW, PMB, PDX + PDW, PMM] }], 5, 1.5, 4)}
    <path d="M${PDX},${PMB + 3}V${PMM - 3}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>` : '';
  return `<rect class="cel-wall" x="${x0}" y="${WY - 14}" width="${x1 - x0}" height="28"/>${fib}${pm(PMB)}${pm(PMM)}${chan}`;
}
function farWall(): string {
  const xs = Array.from({ length: 49 }, (_, i) => -MR - 4 + (i * (2 * MR + 8)) / 48);
  const edge = (d: number): string[] => xs.map(x => `${f(x)},${f(farY(x) + d)}`);
  const air = `<path class="co2k-ias" d="M${edge(8).join('L')}L${MR + 4},${MR + 4}L${-MR - 4},${MR + 4}Z"/>`;
  const band = `<path class="cel-wall" d="M${edge(-8).join('L')}L${edge(8).reverse().join('L')}Z"/>`;
  const fib = xs.filter((_, i) => i % 2 === 0).map(x => `<path class="cel-wallf" d="M${f(x)},${f(farY(x) - 1)}q6,-3 12,0"/>`).join('');
  const pm = bilayer(xs.slice(0, -1).map((x, i) => ({ L: [x, farY(x) - 15, xs[i + 1], farY(xs[i + 1]) - 15] as [number, number, number, number] })), 6, 1.6, 4.2);
  return `${air}${band}${fib}${pm}`;
}

/** The moving molecules of one side (local units). */
const movers = (s: Side): string => [
  actor(K(s, 'rbp'), row(0, 0, 'PCCCCCP', { r: R })),
  actor(K(s, 'co2'), gas('OCO')),
  actor(K(s, 'o2'), gas('OO')),
  actor(K(s, 'pgx'), `<g transform="translate(0 ${-DY})">${row(0, 0, 'CCCP', { r: R })}</g><g transform="translate(0 ${DY})">${row(0, 0, 'CCCP', { r: R })}</g>`),
  actor(K(s, 'pga'), row(0, 0, 'CCCP', { r: R })),
  actor(K(s, 'g0'), c2G(K(s, 'g0'))), actor(K(s, 'g1'), c2G(K(s, 'g1'))),
  actor(K(s, 'ser'), c3G()),
  kidG(K(s, 'kid'), 13, ''),
  actor(K(s, 'fl'), flashG(P, 30)),
].join('');

function magInner(s: Side): string {
  const c2 = s === 'b';
  const bands = `<rect class="co2k-cyt" x="${-MR - 4}" y="${-MR - 4}" width="${2 * MR + 8}" height="${2 * MR + 8}"/>`;
  const mCp = chloroplast(MC, MRX, MRY, MRUB, 66, granum(-118, 58, 30));
  const mMt = mito(MM, 64, 34, MGDC, [-0.9, -0.82, 0.84, 0.92], c2 ? 0.22 : 1);
  let bs: string;
  if (c2) {
    const glow = actor(K(s, 'glow2'), `<ellipse cx="${BC[0]}" cy="${BC[1]}" rx="${BRX}" ry="${BRY}" fill="url(#${P}-glowg)"/>`);
    bs = `${actor(K(s, 'glow'), `<ellipse cx="0" cy="${WY - 104}" rx="270" ry="104" fill="url(#${P}-glowg)"/>`)}`;
    bs += `@@WALL@@${chloroplast(BC, BRX, BRY, BRUB, 66, granum(-90, -114, 30) + granum(40, -114, 30), glow)}${mito(BM, 70, 32, BGDC, [-0.92, -0.84, 0.86, 0.94])}`;
  } else {
    bs = `<ellipse class="cel-vac" cx="0" cy="-150" rx="220" ry="86"/>${bilayerE(0, -150, 220, 86, 3.6)}@@WALL@@`;
  }
  bs = bs.replace('@@WALL@@', wall(c2));
  return `<g transform="translate(${CX[s]} ${CY})">${bands}${bs}${farWall()}${mCp}${perox()}${mMt}
    ${T(-80, 206, 'air space', 'co2k-il cel-halo')}${movers(s)}</g>`;
}

/* ---------------------------------------------------------------- the script */

/** Beat 2 on one side, in that side's own time τ (C₃: the beat's time; C₂: the echo, quicker). */
const B2 = {
  rbp: [[0.2, 0.5, 1.8, 2.05], [3.2, 3.5, 4.8, 5.05], [8.1, 8.4, 9.25, 9.5]] as Array<[number, number, number, number]>,
  co2: { in: [0.5, 0.7], g: [0.6, 1.8], out: [1.8, 2.05] },
  o2: [{ in: [3.5, 3.7], g: [3.6, 4.8], out: [4.8, 5.05] }, { in: [8.4, 8.55], g: [8.45, 9.25], out: [9.25, 9.5] }],
  fl: [1.9, 4.9, 9.35],
  pgx: [1.9, 2.15, 2.9, 3.2] as [number, number, number, number],
  pga: [[4.9, 5.15, 5.6, 5.9], [9.35, 9.6, 9.9, 10.2]] as Array<[number, number, number, number]>,
  g: [{ in: [4.9, 5.15], g: [5.7, 8.0] }, { in: [9.35, 9.6], g: [10.0, 11.8] }],
};
const E0 = 12.3, KE = 0.45;
const B3 = { g: [0.4, 2.2], fl: 2.35, out: [2.25, 2.5], ser: [2.3, 2.6], g2: [2.9, 4.7] };
const B4 = { g: [0.4, 3.8], fl: 3.95, out: [3.85, 4.1], ser: [3.9, 4.2], g2: [4.4, 5.8], glow: [6.0, 7.2] };

const show = (a: Api, k: string, at: V, o: number): void => { if (o > 0.004) a.put(k, at, o); };
/** The released CO₂ as the CO₂ character (neutral face, no shell, no sweat). */
const hero = (a: Api, s: Side, at: V, o: number): void => { if (o > 0.004) kid(a, K(s, 'kid'), at, o, { n: 1 }); };
/** A glycine (or 2-PG) on its way: P and its red glow on until it leaves the chloroplast, N from the peroxisome on. */
function gly(a: Api, k: string, at: V, o: number, p: number, n: number): void {
  show(a, k, at, o);
  if (o > 0.004) { a.op(`${k}P`, p); a.op(`${k}G`, p); a.op(`${k}N`, n); }
}
function beat2(a: Api, s: Side, τ: number): void {
  if (τ < 0) return;
  const rb = B2.rbp.reduce((m, w) => m + life(τ, ...w), 0);
  show(a, K(s, 'rbp'), RUBP, rb);
  show(a, K(s, 'co2'), path(GAS_IN)(ease2(τ, B2.co2.g[0], B2.co2.g[1])), life(τ, B2.co2.in[0], B2.co2.in[1], B2.co2.out[0], B2.co2.out[1]));
  for (const w of B2.o2) show(a, K(s, 'o2'), path(GAS_IN)(ease2(τ, w.g[0], w.g[1])), life(τ, w.in[0], w.in[1], w.out[0], w.out[1]));
  for (const tf of B2.fl) flash(a, τ, tf, MRUB, K(s, 'fl'));
  show(a, K(s, 'pgx'), PGX, life(τ, ...B2.pgx));
  for (const w of B2.pga) show(a, K(s, 'pga'), PGA1, life(τ, ...w));
  B2.g.forEach((w, i) => {
    const u = ease2(τ, w.g[0], w.g[1]), p = 1 - ease(u, U_OUT[i] - 0.03, U_OUT[i] + 0.03);
    gly(a, K(s, `g${i}`), path(RUNQ[i])(u), ease(τ, w.in[0], w.in[1]), p, ease(u, U_PX[i] - 0.05, U_PX[i] + 0.02));
  });
}
/** The 2 glycines as one pair at the pair's centre c, opacity o. */
const pair = (a: Api, s: Side, c: V, o: number): void => { gly(a, K(s, 'g0'), [c[0], c[1] - DY], o, 0, 1); gly(a, K(s, 'g1'), [c[0], c[1] + DY], o, 0, 1); };
/** Beat 3, C₃: the pair into the mitochondrion; glycine decarboxylase gives serine and CO₂; the CO₂ escapes. */
function beat3(a: Api, t: number): void {
  pair(a, 'a', path(GO_M)(ease2(t, B3.g[0], B3.g[1])), 1 - ease(t, B3.out[0], B3.out[1]));
  flash(a, t, B3.fl, MGDC, K('a', 'fl'));
  show(a, K('a', 'ser'), SER(PAIR_M), ease(t, B3.ser[0], B3.ser[1]));
  hero(a, 'a', path(ESC)(ease2(t, B3.g2[0], B3.g2[1])), ease(t, B3.ser[0], B3.ser[1]));
}
/** Beat 4, C₂: the pair through the plasmodesma into the bundle-sheath mitochondrion; serine and CO₂; the CO₂ goes to
 *  RuBisCO, which holds it (it stays there: trapped, not leaked); the bundle sheath glows. */
function beat4(a: Api, t: number): void {
  pair(a, 'b', path(GO_B)(ease2(t, B4.g[0], B4.g[1])), 1 - ease(t, B4.out[0], B4.out[1]));
  flash(a, t, B4.fl, BGDC, K('b', 'fl'));
  show(a, K('b', 'ser'), SER([PAIR_B[0] + 6, PAIR_B[1]]), ease(t, B4.ser[0], B4.ser[1]));
  hero(a, 'b', path(TO_RUB)(ease2(t, B4.g2[0], B4.g2[1])), ease(t, B4.ser[0], B4.ser[1]));
  const g = ease(t, B4.glow[0], B4.glow[1]);
  a.op(K('b', 'glow'), g); a.op(K('b', 'glow2'), g);
}

/* ---------------------------------------------------------------- the photos, headings, credits */

function photo(s: Side): string {
  const p = PH[s], [rx0, ry0, rrx, rry] = p.ring, c = onPh(s, [rx0, ry0]);
  return `<image href="${p.img}" x="${p.x}" y="${p.y}" width="300" height="222" preserveAspectRatio="none"/>
    <rect x="${p.x}" y="${p.y}" width="300" height="222" style="fill:none;stroke:#d8d5cb;stroke-width:1.2"/>`
    + actor(K(s, 'bs'), `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(rrx * SC)}" ry="${f(rry * SC)}" style="fill:none;stroke:#2f6f5f;stroke-width:2.2;stroke-dasharray:6 4" opacity=".9"/>${T(onPh(s, p.bs)[0], onPh(s, p.bs)[1], 'bundle sheath', 'co2k-zl cel-halo')}`)
    + actor(K(s, 'mes'), T(onPh(s, p.mes)[0], onPh(s, p.mes)[1], 'mesophyll', 'co2k-zl cel-halo'));
}
const HEAD = 'font-size:24px;font-weight:700;fill:#141413';

export const STAGING: Staging = {
  ...makeScene({
    id: 'c2p', name: 'c2p · Two magnifiers: C₃ and C₂ side by side', beats: C2P,
    note: 'Two halves, C₃ (Steinchisma laxum) and C₂ (Homolepis aturensis), each a micrograph with a lens on a bundle-sheath/mesophyll wall and a magnifier at one scale: both mesophylls make glycine; C₃ releases its CO₂ in the mesophyll and it escapes; C₂ glycine goes through the plasmodesma to the bundle-sheath mitochondrion, its CO₂ to bundle-sheath RuBisCO',
    svg: () => {
      const defs = `<defs>${flashDefs(P)}<radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
        <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".62"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".34"/><stop offset="1" stop-color="#f6c453" stop-opacity=".08"/></radialGradient></defs>`;
      const mags = (['a', 'b'] as Side[]).map(s => {
        const m = inset(P, K(s, 'in'), onPh(s, PH[s].lens), 14, [CX[s], CY], MR, magInner(s));
        return `${photo(s)}${m.lens}${m.box}`;
      }).join('');
      return `${defs}<path d="M800,16V600" style="stroke:#d8d5cb;stroke-width:1.4"/>
        ${T(395, 36, 'C₃ leaf', 'co2k-zl', 'middle', ` style="${HEAD}"`)}${T(1205, 36, 'C₂ leaf', 'co2k-zl', 'middle', ` style="${HEAD}"`)}
        ${mags}
        ${T(12, 732, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr', 'start')}
        ${T(1588, 732, 'RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC', 'co2k-cr', 'end')}`;
    },
    frame(a, beat, t) {
      // beat 1: the bundle sheath, then the mesophyll named on both photos; then the lenses and the magnifiers
      const bs = from(beat, t, 0, 0.3, 0.7), mes = from(beat, t, 0, 1.1, 1.5), lens = from(beat, t, 0, 1.9, 2.3), mag = from(beat, t, 0, 2.3, 2.9);
      for (const s of ['a', 'b'] as Side[]) { a.op(K(s, 'bs'), bs); a.op(K(s, 'mes'), mes); a.op(`${K(s, 'in')}-lens`, lens); a.op(K(s, 'in'), mag); }
      // C₃ side
      if (beat === 1) beat2(a, 'a', t);
      else if (beat === 2) beat3(a, t);
      else if (beat === 3) beat3(a, 99);
      // C₂ side
      if (beat === 1) beat2(a, 'b', (t - E0) / KE);
      else if (beat === 2) pair(a, 'b', PAIR0, 1);
      else if (beat === 3) beat4(a, t);
    },
  }),
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 648, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 698, size: 44 },
  ],
};
