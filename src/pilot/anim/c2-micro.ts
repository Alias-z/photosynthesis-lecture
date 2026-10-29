// 'lf11a', staging c2m · C₂ slide, C₃ vs C₂ comparison (captions C2P, anim/beats-c2p.ts): "real micrographs on the side".
// - Left, stacked: the 2 micrographs, C₃ on top, C₂ below, each with its heading (Khoshravesh et al. 2016, J. Exp. Bot.
//   67:3065, Fig. 1D Steinchisma laxum, Fig. 1B Homolepis aturensis, CC BY 3.0; letters painted out, 1000 × 740). On each:
//   the vein and the ring of bundle-sheath cells outlined (dashed ring as in c2-kranz.ts), "mesophyll" named.
// - Right of each photo, its own row, linked by a lens and thin magnifier lines: a cell schema with the photorespiration
//   strip's organelles (figs/cell-schema.ts look: stroma, double envelope, peroxisome with one bilayer, mitochondrion with
//   2) and its glyphs (anim/dk-rf6.ts: RuBP, 3-PGA, 2-PG/glycine c2G, serine c3G, CO₂ and O₂ balls, R = 11).
//   Top row (C₃): an air space, then the mesophyll cell. Bottom row (C₂): the bundle-sheath cell (its mitochondrion on the
//   vein side, behind its chloroplast; Khoshravesh 2016), a wall with a plasmodesma, then the same mesophyll cell, whose
//   mitochondrion has no glycine decarboxylase. Both rows at one scale, the mesophyll cells one above the other, so the
//   glycine's 2 fates line up: its CO₂ escapes to the air space (top) or is held in the bundle sheath (bottom).
// - Beats: 1 labels and outlines, then the lenses and rows (nothing moves); 2 in the top row CO₂ and then O₂ at RuBisCO,
//   the 2-PG recycled to glycine; a quick identical echo in the bottom row; 3 top row: glycine gives its CO₂ in the
//   mitochondrion, which escapes to the air space; 4 bottom row: glycine goes through the plasmodesma to the bundle-sheath
//   mitochondrion, its CO₂ goes to bundle-sheath RuBisCO, the bundle-sheath cell glows; the question.
import c3Jpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import c2Jpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { C2P } from './beats-c2p';
import { actor, bilayerE, ease, ease2, f, flash, flashDefs, flashG, from, makeScene, path, T, type Api, type V } from './co2-kit';
import type { Staging } from './types';

const P = 'c2m';
const R = 11, ST = 2.15 * R;

/* ---------------------------------------------------------------- glyphs, as dk-rf6.ts (without its numbers) */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG → glycolate → glycine: a 2-C body whose end atom changes (P, none, N); a red glow while it is 2-PG. */
const c2G = (k: string): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}`;
/** serine: a 3-C body, its N above the middle carbon. */
const c3G = `<g><path d="M${f(-ST / 2)},0V${f(-ST)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>${atomBall(-ST / 2, -ST, 'N', R)}</g>${row(-ST / 2, 0, 'CCC', { r: R })}`;
const gas = (el: string): string => `<g class="chn-g">${balls(0, 0, el)}</g>`;
/** Two of a glyph, one above the other (per 2 oxygenations, as on the photorespiration slide). */
const PAIR = 13;
const pair = (a: string, b: string): string => `<g transform="translate(0 ${-PAIR})">${a}</g><g transform="translate(0 ${PAIR})">${b}</g>`;
const lab = (s: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'middle', cls = 'cel-mn cel-halo'): string => T(x, y, s, cls, a);

/* ---------------------------------------------------------------- layout (stage units) */

/** The photos: 432 × 320 (1000 × 740 scaled by 0.432), C₃ at y 36, C₂ at y 414. */
const PS = 0.432, PH = [36, 414];
const ph = (r: number, p: V): V => [p[0] * PS, PH[r] + p[1] * PS];
/** The rows: x 470–1592, y 8–312 (C₃) and 416–720 (C₂); drawn in C₃ row units, the C₂ row shifted by DY. */
const X0 = 470, X1 = 1592, Y0 = 8, Y1 = 312, DY = 408;
const at = (r: number, p: V): V => [p[0], p[1] + r * DY];
const pts = (r: number, q: V[]): V[] => q.map(p => at(r, p));

/** The wall between column A (air space / bundle-sheath cell) and the mesophyll cell; the plasmodesma (C₂). */
const W0 = 796, W1 = 824, PM_A = 789, PM_M = 831, PDY = 258;
/** Mesophyll cell: chloroplast, RuBisCO, RuBP, peroxisome, mitochondrion with glycine decarboxylase. */
const CP: V = [1352, 160], CRX = 214, CRY = 122, RUB: V = [1352, 132];
const RUBP: V = [1352, 209];
const PX: V = [1050, 246], PXR = 48;
const MT: V = [926, 110], MRX = 70, MRY = 64, GDC: V = [926, 86];
/** Bundle-sheath cell (C₂): chloroplast with RuBisCO, mitochondrion (vein side) with glycine decarboxylase. */
const BCP: V = [700, 128], BRX = 74, BRY = 90, BRUB: V = [700, 124];
const BMT: V = [544, 172], BMRX = 56, BMRY = 96, BGDC: V = [544, 118];

/** Where the molecules go. */
const CO2_IN: V[] = [[1540, 70], [1480, 82], [1420, 106], [1392, 118]];
const O2_IN: V[] = [[1548, 204], [1490, 186], [1430, 160], [1402, 148]];
const PGA_SPOT: V = [1236, 82];
const PGA_OUT: V[] = [[1326, 120], [1290, 100], [1260, 88], PGA_SPOT];
const PG_SPOT: V = [1250, 214];
const PG_OUT: V[] = [[1320, 158], [1290, 186], [1266, 204], PG_SPOT];
const GLY_SPOT: V = [1052, 132];
/** 2-PG out of the chloroplast (it loses its phosphate there), through the peroxisome (it takes an N: glycine), to the
 *  cytosol beside the mitochondrion. */
const RUN: V[] = [PG_SPOT, [1200, 232], [1140, 244], [1094, 248], PX, [1044, 196], GLY_SPOT];
/** C₃: glycine into the mitochondrion; its CO₂ out through the wall to the air space. */
const MT_SPOT: V = [926, 134], SER_AT: V = [926, 142];
const GLY_IN: V[] = [GLY_SPOT, [990, 134], MT_SPOT];
const CO2_OUT: V[] = [[904, 104], [866, 98], [828, 94], [780, 100], [700, 124], [630, 150]];
/** C₂: glycine through the plasmodesma, under the bundle-sheath chloroplast, into its mitochondrion; CO₂ to RuBisCO. */
const BMT_SPOT: V = [544, 184], BSER_AT: V = [544, 192];
const GLY_BS: V[] = [GLY_SPOT, [990, 200], [930, 238], [870, 254], [W1 + 6, PDY], [PM_A - 10, PDY], [700, 250], [640, 238], [592, 214], BMT_SPOT];
const CO2_BS: V[] = [[566, 124], [606, 122], [646, 122], [672, 124]];

/* ---------------------------------------------------------------- drawing */

/** A thylakoid stack: n discs of width w from (x, y) down (as cellPano's granum, smaller). */
const granum = (x: number, y: number, w: number, n = 4): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
const img = (href: string, c: V, w: number, ar: number, k = ''): string => `<image${k ? ` data-k="${k}"` : ''} href="${href}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * ar) / 2)}" width="${w}" height="${f(w * ar)}"/>`;
const RUB_AR = 471 / 548, GDC_AR = 222 / 302;
/** A chloroplast as the strip draws it: stroma, the 2 envelope bilayers. */
const chloro = (c: V, rx: number, ry: number): string => `<ellipse class="cel-stroma" cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 4.5)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4.5)}`;
/** A mitochondrion as the strip draws it: matrix, outer and inner bilayer. */
const mito = (c: V, rx: number, ry: number): string => `<ellipse class="cel-matrix" cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 4.5)}${bilayerE(c[0], c[1], rx - 14, ry - 14, 4.5)}`;
const perox = (c: V, r: number): string => `<ellipse class="cel-perox" cx="${c[0]}" cy="${c[1]}" rx="${r}" ry="${r}"/>${bilayerE(c[0], c[1], r, r, 4.5)}`;
const pmV = (x: number, gap: boolean): string => gap
  ? bilayer([{ L: [x, Y0 - 4, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, Y1 + 4] }], 6, 1.6, 4.2)
  : bilayer([{ L: [x, Y0 - 4, x, Y1 + 4] }], 6, 1.6, 4.2);
const fibres = (skip: (y: number) => boolean): string => Array.from({ length: 13 }, (_, i) => { const y = Y0 + 8 + i * 24; return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f(W0 + 7 + (i % 3) * 5)},${y}q5,7 0,14t0,14"/>`; }).join('');

/** One row's drawing, in C₃ row units (r 0: C₃, r 1: C₂). */
function rowSvg(r: number): string {
  const c2 = r === 1;
  const colA = c2 ? `<rect class="co2k-cyt" x="${X0}" y="${Y0}" width="${W0 - X0}" height="${Y1 - Y0}"/>` : `<rect class="co2k-ias" x="${X0}" y="${Y0}" width="${W0 - X0}" height="${Y1 - Y0}"/>`;
  const wall = `<rect class="co2k-wallb" x="${W0}" y="${Y0}" width="${W1 - W0}" height="${Y1 - Y0}"/>${fibres(y => c2 && Math.abs(y - PDY) < 24)}`;
  const pd = c2 ? `<rect x="${W0 - 1}" y="${PDY - 15}" width="${W1 - W0 + 2}" height="30" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_A, PDY - 15, PM_M, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [PM_A, PDY + 15, PM_M, PDY + 15] }], 5, 1.5, 4)}
    <path d="M${PM_A - 4},${PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>` : '';
  const mes = `<rect class="co2k-cyt" x="${W1}" y="${Y0}" width="${X1 - W1}" height="${Y1 - Y0}"/>
    ${chloro(CP, CRX, CRY)}${granum(1196, 150, 36)}${img(rubPng, RUB, 66, RUB_AR)}
    ${perox(PX, PXR)}${mito(MT, MRX, MRY)}${c2 ? '' : img(gdcPng, GDC, 54, GDC_AR)}`;
  const bs = c2 ? `<ellipse data-k="${P}-glow" data-actor="1" display="none" cx="630" cy="160" rx="168" ry="150" fill="url(#${P}-glowg)"/>
    ${chloro(BCP, BRX, BRY)}${granum(712, 172, 30, 3)}${img(rubPng, BRUB, 60, RUB_AR)}
    ${mito(BMT, BMRX, BMRY)}${img(gdcPng, BGDC, 52, GDC_AR)}` : '';
  const rubp = `<g data-k="${P}-${r}-rb0" transform="translate(${RUBP[0]} ${RUBP[1] - PAIR})">${row(0, 0, 'PCCCCCP', { r: R })}</g><g data-k="${P}-${r}-rb1" transform="translate(${RUBP[0]} ${RUBP[1] + PAIR})">${row(0, 0, 'PCCCCCP', { r: R })}</g>`;
  // names: organelles once (C₃ row), cells and the bundle-sheath proteins in the C₂ row
  const names = c2
    ? `${lab('bundle-sheath cell', 560, 34, 'middle', 'co2k-zl cel-halo')}${lab('mesophyll cell', MT[0], 36, 'middle', 'co2k-zl cel-halo')}
       ${lab('RuBisCO', BRUB[0], 88, 'middle', 'cel-prot cel-halo')}${lab('glycine decarboxylase', 482, 292, 'start', 'cel-prot cel-halo')}`
    : `${lab('air space', 633, 40, 'middle', 'cel-zone cel-halo')}${lab('glycine decarboxylase', MT[0], 36, 'middle', 'cel-prot cel-halo')}
       ${lab('mitochondrion', MT[0], 198, 'middle', 'cel-zone cel-halo')}${lab('peroxisome', PX[0] - PXR - 8, 252, 'end', 'cel-zone cel-halo')}
       ${lab('chloroplast', 1440, 262, 'middle', 'cel-zone cel-halo')}${lab('RuBisCO', RUB[0], 98, 'middle', 'cel-prot cel-halo')}
       ${lab('RuBP', RUBP[0], 258)}`;
  const k = (n: string): string => `${P}-${r}-${n}`;
  const movers = `${actor(k('fl'), flashG(P, 30))}${actor(k('fl2'), flashG(P, 30))}
    ${actor(k('pga'), pair(row(0, 0, 'CCCP', { r: R }), row(0, 0, 'CCCP', { r: R })))}
    ${actor(k('co2'), `${gas('OCO')}${c2 ? '' : lab('CO₂', 0, -20)}`)}
    ${actor(k('o2'), `${pair(gas('OO'), gas('OO'))}${c2 ? '' : lab('O₂', 0, -34)}`)}
    ${actor(k('pg'), pair(c2G(k('pga')), c2G(k('pgb'))))}
    ${actor(k('ser'), c3G)}
    ${actor(k('co2b'), `${gas('OCO')}${c2 ? '' : lab('CO₂', 0, -20)}`)}
    ${c2 ? '' : `${actor(k('l3pga'), lab('3-PGA', PGA_SPOT[0], PGA_SPOT[1] + 48))}${actor(k('l2pg'), lab('2-PG', PG_SPOT[0], PG_SPOT[1] - 30))}
      ${actor(k('ltox'), lab('toxic', PG_SPOT[0] - 44, PG_SPOT[1] + 8, 'end', 'dk2-toxic cel-halo'))}${actor(k('lgly'), lab('glycine', GLY_SPOT[0], GLY_SPOT[1] - 34))}
      ${actor(k('lser'), lab('serine', SER_AT[0] + 46, SER_AT[1] + 6, 'start'))}`}`;
  const y0 = Y0 + r * DY;
  return `<clipPath id="${P}-${r}-c"><rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/></clipPath>
    <g data-k="${P}-${r}-row" data-actor="1" display="none">
      <rect class="co2k-inbg" x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/>
      <g clip-path="url(#${P}-${r}-c)"><g transform="translate(0 ${r * DY})">${colA}${wall}${pmV(PM_M, c2)}${c2 ? pmV(PM_A, true) : ''}${pd}${mes}${bs}${rubp}${names}</g>
        <g class="chn-g">${movers}</g></g>
      <rect class="co2k-inring" x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/></g>`;
}

/** The photo, its outlines and names, the lens and the magnifier lines to its row. */
interface PhotoOpt { href: string; vein: [number, number, number, number]; ring: [number, number, number, number]; veinAt: V; bsAt: V; mesAt: V; lens: V; head: string }
const PHOTO: PhotoOpt[] = [
  { href: c3Jpg, vein: [476, 412, 104, 116], ring: [482, 352, 310, 342], veinAt: [476, 470], bsAt: [300, 540], mesAt: [872, 252], lens: [740, 96], head: 'C₃ leaf' },
  { href: c2Jpg, vein: [508, 420, 74, 76], ring: [488, 414, 294, 240], veinAt: [508, 478], bsAt: [292, 560], mesAt: [872, 238], lens: [768, 432], head: 'C₂ leaf' },
];
const LR = 15;
function photoSvg(r: number): string {
  const o = PHOTO[r], [x, y] = ph(r, [0, 0]);
  const ell = (e: [number, number, number, number], style: string): string => { const c = ph(r, [e[0], e[1]]); return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(e[2] * PS)}" ry="${f(e[3] * PS)}" style="${style}"/>`; };
  const t = (p: V, s: string, k: string): string => { const q = ph(r, p); return actor(k, T(q[0], q[1], s, 'co2k-zl cel-halo')); };
  const L = ph(r, o.lens), y0 = Y0 + r * DY;
  // magnifier lines: from the lens rim towards the row's left corners
  const line = (cy: number): string => { const a = Math.atan2(cy - L[1], X0 - L[0]); return `M${f(L[0] + LR * Math.cos(a))},${f(L[1] + LR * Math.sin(a))}L${X0},${f(cy)}`; };
  return `<image href="${o.href}" x="${x}" y="${y}" width="${f(1000 * PS)}" height="${f(740 * PS)}" preserveAspectRatio="none"/>
    ${T(4, y - 10, o.head, 'co2k-zl', 'start', ' style="font-size:22px"')}
    ${actor(`${P}-${r}-vein`, `${ell(o.vein, 'fill:none;stroke:#5a4a1a;stroke-width:2;stroke-dasharray:3 4')}${T(ph(r, o.veinAt)[0], ph(r, o.veinAt)[1], 'vein', 'co2k-zl cel-halo')}`)}
    ${actor(`${P}-${r}-bs`, `${ell(o.ring, 'fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6;opacity:.85')}${T(ph(r, o.bsAt)[0], ph(r, o.bsAt)[1], 'bundle sheath', 'co2k-zl cel-halo')}`)}
    ${t(o.mesAt, 'mesophyll', `${P}-${r}-mes`)}
    ${actor(`${P}-${r}-lens`, `<path class="co2k-tan" d="${line(y0 + 1)}${line(y0 + Y1 - Y0 - 1)}"/><circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${LR}"/>`)}`;
}

/* ---------------------------------------------------------------- motion */

/** The fraction of a path's length nearest to q. */
function uNear(q: V[], p: V): number {
  const c = path(q); let best = 0, bd = Infinity;
  for (let i = 0; i <= 400; i++) { const a = c(i / 400), d = Math.hypot(a[0] - p[0], a[1] - p[1]); if (d < bd) { bd = d; best = i / 400; } }
  return best;
}
const U_ENV_RUN = uNear(RUN, [1140, 244]), U_PX_RUN = uNear(RUN, PX);
const id = (r: number, n: string): string => `${P}-${r}-${n}`;
/** The 2-C pair's look: phosphate, amino N, red glow. */
function pg(a: Api, r: number, pO: number, nO: number, gO: number): void {
  for (const s of ['pga', 'pgb']) { a.op(`${id(r, s)}P`, pO); a.op(`${id(r, s)}N`, nO); a.op(`${id(r, s)}G`, gO); }
}
const dur = (t: number, t0: number, t1: number): number => ease(t, t0, t1);

/** Beat 2 in row r from time s, k times as long as the first run: CO₂ at RuBisCO (2 × 3-PGA), then O₂ (3-PGA and
 *  2-PG, which glows), the 2-PG recycled to glycine on the way to the mitochondrion. Labels only in the first run. */
function recycle(a: Api, r: number, t: number, s: number, k: number, labels: boolean): void {
  const T0 = (x: number): number => s + k * x;
  // RuBP: one used by carboxylation, both by oxygenation; regenerated by the cycle (fade back)
  a.op(id(r, 'rb0'), t < T0(4) ? 1 - dur(t, T0(1.8), T0(2.0)) + dur(t, T0(3.6), T0(4.0)) : 1 - dur(t, T0(5.5), T0(5.7)) + dur(t, T0(7.6), T0(8.0)));
  a.op(id(r, 'rb1'), 1 - dur(t, T0(5.5), T0(5.7)) + dur(t, T0(7.6), T0(8.0)));
  // carboxylation: CO₂ in, flash, the 2 3-PGA out
  if (t > T0(0.2) && t < T0(2.0)) a.put(id(r, 'co2'), at(r, path(CO2_IN)(ease2(t, T0(0.5), T0(1.7)))), dur(t, T0(0.2), T0(0.5)) * (1 - dur(t, T0(1.7), T0(1.9))));
  flash(a, t, T0(1.8), at(r, RUB), id(r, 'fl'));
  if (t > T0(1.8) && t < T0(4.1)) a.put(id(r, 'pga'), at(r, path(PGA_OUT)(ease2(t, T0(2.0), T0(3.0)))), dur(t, T0(1.85), T0(2.05)) * (1 - dur(t, T0(3.6), T0(4.0))));
  // oxygenation: the 2 O₂ in, flash, 3-PGA (at its place) and 2-PG out
  if (t > T0(4.0) && t < T0(5.7)) a.put(id(r, 'o2'), at(r, path(O2_IN)(ease2(t, T0(4.2), T0(5.4)))), dur(t, T0(4.0), T0(4.3)) * (1 - dur(t, T0(5.4), T0(5.6))));
  flash(a, t, T0(5.5), at(r, RUB), id(r, 'fl'));
  if (t > T0(5.6) && t < T0(8.1)) a.put(id(r, 'pga'), at(r, PGA_SPOT), dur(t, T0(5.6), T0(5.9)) * (1 - dur(t, T0(7.6), T0(8.0))));
  if (t > T0(5.6)) {
    const u = ease2(t, T0(7.6), T0(10.0));
    const p = t < T0(7.6) ? path(PG_OUT)(ease2(t, T0(5.8), T0(6.8))) : path(RUN)(u);
    a.put(id(r, 'pg'), at(r, p), dur(t, T0(5.6), T0(5.8)));
    const off = ease(u, U_ENV_RUN - 0.04, U_ENV_RUN + 0.02);
    pg(a, r, 1 - off, ease(u, U_PX_RUN - 0.04, U_PX_RUN + 0.02), dur(t, T0(5.8), T0(6.6)) * (1 - off));
  }
  if (!labels) return;
  a.op(id(r, 'l3pga'), dur(t, T0(3.0), T0(3.3)) * (1 - dur(t, T0(3.6), T0(3.9))) + dur(t, T0(5.7), T0(6.0)) * (1 - dur(t, T0(7.6), T0(7.9))));
  a.op(id(r, 'l2pg'), dur(t, T0(6.8), T0(7.1)) * (1 - dur(t, T0(7.6), T0(7.9))));
  a.op(id(r, 'ltox'), dur(t, T0(6.8), T0(7.1)) * (1 - dur(t, T0(7.6), T0(7.9))));
  a.op(id(r, 'lgly'), dur(t, T0(10.0), T0(10.4)));
}
/** Glycine waiting beside the mesophyll mitochondrion (the end of beat 2). */
function glyWaits(a: Api, r: number): void { a.put(id(r, 'pg'), at(r, GLY_SPOT), 1); pg(a, r, 0, 1, 0); }
/** The C₃ row's end: serine in the mitochondrion, the CO₂ out in the air space. */
function c3End(a: Api): void { a.put(id(0, 'ser'), SER_AT, 1); a.op(id(0, 'lser'), 1); a.put(id(0, 'co2b'), CO2_OUT[CO2_OUT.length - 1], 1); }

const ECHO = { s: 10.8, k: 0.45 };

export const STAGING: Staging = {
  ...makeScene({
    id: 'c2m', name: 'c2m · Real micrographs on the side: C₃ and C₂ rows', beats: C2P,
    note: 'The C₃ (Steinchisma laxum) and C₂ (Homolepis aturensis) micrographs stacked on the left (Khoshravesh et al. 2016), vein and bundle sheath outlined; right of each, by a lens, its own row in the photorespiration strip\'s organelles and glyphs, at one scale: the glycine\'s CO₂ escapes to the air space (C₃) or is released next to bundle-sheath RuBisCO (C₂)',
    svg: () => `<defs>${flashDefs(P)}<radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
        <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".55"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".3"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient></defs>
      ${photoSvg(0)}${photoSvg(1)}
      <g class="fig dk2">${rowSvg(0)}${rowSvg(1)}</g>
      ${T(1592, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0) · RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC', 'co2k-cr', 'end')}`,
    frame(a, beat, t) {
      // beat 1: on both photos the vein, the bundle sheath, the mesophyll, one at a time; then the lenses and the rows
      for (const r of [0, 1]) {
        a.op(id(r, 'vein'), from(beat, t, 0, 0.3, 0.7));
        a.op(id(r, 'bs'), from(beat, t, 0, 1.1, 1.5));
        a.op(id(r, 'mes'), from(beat, t, 0, 1.9, 2.3));
        a.op(id(r, 'lens'), from(beat, t, 0, 2.7, 3.1));
        a.op(id(r, 'row'), from(beat, t, 0, 3.1, 3.7));
        if (beat !== 1) { a.op(id(r, 'rb0'), 1); a.op(id(r, 'rb1'), 1); }
      }
      // beat 2: the C₃ row, then the same, quickly, in the C₂ row
      if (beat === 1) {
        recycle(a, 0, t, 0, 1, true);
        if (t < ECHO.s) { a.op(id(1, 'rb0'), 1); a.op(id(1, 'rb1'), 1); } else recycle(a, 1, t, ECHO.s, ECHO.k, false);
      }
      // beat 3 (C₃): glycine into the mitochondrion; it gives its CO₂, which escapes to the air space; serine stays
      if (beat === 2) {
        glyWaits(a, 1);
        a.op(id(0, 'lgly'), 1 - ease(t, 0.2, 0.5));
        if (t < 1.9) { a.put(id(0, 'pg'), path(GLY_IN)(ease2(t, 0.4, 1.6)), 1 - ease(t, 1.6, 1.9)); pg(a, 0, 0, 1, 0); }
        flash(a, t, 1.7, GDC, id(0, 'fl'));
        a.put(id(0, 'ser'), SER_AT, ease(t, 1.7, 2.0)); a.op(id(0, 'lser'), ease(t, 2.0, 2.4));
        a.put(id(0, 'co2b'), path(CO2_OUT)(ease2(t, 2.0, 4.6)), ease(t, 1.8, 2.0));
      }
      // beat 4 (C₂): glycine through the plasmodesma into the bundle-sheath mitochondrion; its CO₂ to RuBisCO; the glow
      if (beat === 3) {
        c3End(a);
        if (t < 3.7) { a.put(id(1, 'pg'), at(1, path(GLY_BS)(ease2(t, 0.4, 3.4))), 1 - ease(t, 3.4, 3.7)); pg(a, 1, 0, 1, 0); }
        flash(a, t, 3.5, at(1, BGDC), id(1, 'fl'));
        a.put(id(1, 'ser'), at(1, BSER_AT), ease(t, 3.5, 3.8));
        if (t > 3.5 && t < 5.4) a.put(id(1, 'co2b'), at(1, path(CO2_BS)(ease2(t, 3.8, 5.0))), ease(t, 3.6, 3.8) * (1 - ease(t, 5.0, 5.3)));
        flash(a, t, 5.1, at(1, BRUB), id(1, 'fl2'));
        a.op(`${P}-glow`, ease(t, 5.3, 6.5));
      }
    },
  }),
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 352, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 398, size: 44 },
  ],
};
