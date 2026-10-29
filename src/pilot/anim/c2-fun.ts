// 'lf11a', staging c2f · C₂ slide: the CO₂ character's 2 fates (lecturer, 29 Oct 2026, night: "after photorespiration,
// the CO₂ in one is leaked, in the other it cannot leak, it gets trapped"). Slide 19's CO₂ character (co2-kit kidG/kid)
// is the hero; one fixed framing; only glycine and the CO₂ character move, one at a time; eased glides and fades.
// - 2 rows at one scale, C₃ on top, C₂ below. Left in each row its micrograph (Khoshravesh et al. 2016, J. Exp. Bot.
//   67:3065, Fig. 1D Steinchisma laxum, C₃; Fig. 1B Homolepis aturensis, C₂; CC BY 3.0; letters painted out), the
//   bundle sheath outlined and named, and a lens window (the same size on both) on a strip from the vein out to an air
//   space. Right of it the strip magnified, drawn in the deck's kit (bilayers, cell walls, real protein renders: RuBisCO
//   PDB 8RUC, glycine decarboxylase PDB 4LHC), the same columns in both rows: vein | bundle-sheath cell | mesophyll cell
//   | air space. The mesophyll cells are the same (chloroplast, peroxisome, mitochondrion), except that the C₂ mesophyll
//   mitochondrion has no glycine decarboxylase (GLDP almost only in the bundle sheath of H. aturensis, Khoshravesh 2016;
//   Rawsthorne et al. 1988). The C₂ bundle-sheath cell has its mitochondria at the vein side, behind its chloroplasts
//   (Khoshravesh 2016: "almost all peroxisomes and GDC-containing mitochondria, and over half of the chloroplasts are
//   situated adjacent to the vascular tissue"), and a plasmodesma in its outer wall.
// - Beats: 1 the names, the lenses and the strips; glycine leaves the peroxisome for the mitochondrion, the same in both
//   rows; 2 C₃: glycine decarboxylase frees the CO₂ character next to the air space; it looks around, glad, and drifts out
//   into the air space and away; 3 C₂: glycine goes through the plasmodesma to the bundle-sheath mitochondrion; the CO₂
//   character is freed there, tries to leave, meets the chloroplast (strained, a sweat drop), RuBisCO takes it in; the
//   bundle sheath glows; 4 the 2 fates as pills at the exit of each row, then the question.
// Glycine as on the photorespiration slide (dk-rf6.ts c2G with its N, R = 11, no numbers).
import c3Jpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import c2Jpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { bilayer } from '../figs/cell-schema';
import { actor, bilayerE, ease, ease2, f, flash, flashDefs, flashG, from, kid, kidG, makeScene, path, T, type Api, type Mood, type V } from './co2-kit';
import type { Beat, Cite, Staging } from './types';

const P = 'c2f';

/* ---------------------------------------------------------------- captions */

const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const BUSCH13: Cite = { label: 'Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' };

const BEATS: Beat[] = [
  { tag: 'Glycine goes to a mitochondrion', say: 'A C₃ grass and a C₂ grass, cut across a vein: bundle-sheath cells ring the vein, mesophyll cells lie outside. In both, photorespiration makes glycine, which goes to a mitochondrion.', cite: [KHOSH16] },
  { tag: 'C₃: CO₂ released beside the air spaces', say: 'In the C₃ leaf, glycine decarboxylase in the mesophyll mitochondria splits CO₂ off glycine, close to the air spaces: most of this CO₂ diffuses out and is lost.', cite: [BUSCH13] },
  { tag: 'C₂: CO₂ released behind the chloroplasts', say: 'In the C₂ leaf, glycine decarboxylase is almost only in bundle-sheath mitochondria, behind the chloroplasts. Glycine moves there through plasmodesmata; its CO₂ meets RuBisCO on the way out and is fixed.', cite: [RAWS88, KHOSH16] },
  { tag: 'Lost in C₃, refixed in C₂', say: 'The same photorespiration, 2 fates of its CO₂: the C₃ leaf loses most of it to the air; the C₂ bundle sheath traps it, so CO₂ builds up around RuBisCO there. <b>What if the leaf pumped CO₂ into the bundle sheath directly?</b>', cite: [BUSCH13, KHOSH16] },
];

/* ---------------------------------------------------------------- glyphs */

/** Atom radius of the photorespiration slide's glyphs, its bond step; the CO₂ character's atom radius. */
const R = 11, ST = 2.15 * R, KR = 16;
const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** Glycine as dk-rf6.ts draws it: the 2-C body (C at −ST, 0) and its amino N. */
const glyG = `<g class="chn-g">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}${row(-ST / 2, 0, 'CC', { r: R })}</g>`;

/* ---------------------------------------------------------------- layout (stage units; the C₂ row is the C₃ row moved down by DY) */

/** The photos: 1000 × 740 at 0.392 (392 × 290), C₃ at y 6, C₂ at y 420. */
const PS = 0.392, PH = [6, 420];
const ph = (r: number, p: V): V => [p[0] * PS, PH[r] + p[1] * PS];
/** The strips: x 430–1592, y 6–296 (C₃) and 420–710 (C₂). */
const X0 = 430, X1 = 1592, Y0 = 6, Y1 = 296, DY = 414;
const at = (r: number, p: V): V => [p[0], p[1] + r * DY];

/** Columns, left to right: vein | bundle-sheath inner wall | bundle-sheath cell | wall (plasmodesma in C₂) | mesophyll
 *  cell | outer wall | air space; each cell's plasma membrane on the inner face of its walls. */
const VEIN1 = 492, BW0 = 492, BW1 = 512, BPM0 = 518;
const MW0 = 1080, MW1 = 1106, BPM1 = 1074, MPM0 = 1112;
const OW0 = 1416, OW1 = 1440, MPM1 = 1410;
const PDY = 262;
/** Mesophyll cell: chloroplast with RuBisCO, peroxisome, mitochondrion next to the outer wall (glycine decarboxylase in C₃). */
const MCP: V = [1262, 106], MCRX = 104, MCRY = 46;
const PX: V = [1172, 212], PXR = 28;
const MMT: V = [1348, 214], MMRX = 56, MMRY = 42, MGDC: V = [1348, 204];
/** C₂ bundle-sheath cell: mitochondrion at the vein wall (glycine decarboxylase), chloroplasts in front of it
 *  (RuBisCO), the vacuole beyond. */
const BMT: V = [574, 160], BMRX = 48, BMRY = 68, BGDC: V = [572, 128];
const BCP: V = [752, 146], BCRX = 52, BCRY = 76, BRUB: V = [752, 136];
const BCP2: V = [728, 318];

/** The molecules' ways (in C₃ row units). */
const GLY_SPOT: V = [1256, 214];
const GLY_IN: V[] = [PX, [1214, 220], GLY_SPOT];
const GLY_MT: V[] = [GLY_SPOT, [1306, 222], [1346, 228]];
const CO2_AT: V = [1348, 212];
const CO2_OUT: V[] = [CO2_AT, [1394, 204], [1438, 194], [1490, 178], [1548, 158], [1640, 126]];
const GLY_BS: V[] = [GLY_SPOT, [1236, 248], [1186, 264], [1134, 262], [MW1 + 4, PDY], [MW0 - 4, PDY], [1030, 270], [950, 274],
  [860, 268], [800, 252], [736, 246], [672, 236], [618, 214], [580, 196]];
const BCO2_AT: V = [572, 150], BCO2_WALL: V = [652, 148];

/* ---------------------------------------------------------------- drawing */

const lab = (x: number, y: number, s: string, cls = 'co2k-il cel-halo', a: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, cls, a);
const img = (href: string, c: V, w: number, ar: number): string => `<image href="${href}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * ar) / 2)}" width="${w}" height="${f(w * ar)}"/>`;
const RUB_AR = 471 / 548, GDC_AR = 222 / 302;
/** A thylakoid stack: n discs of width w from (x, y) down. */
const granum = (x: number, y: number, w: number, n = 3): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
/** A chloroplast (c2-kranz.ts): stroma, the double envelope, grana, RuBisCO (render width rw at rub, or none). */
const chloro = (c: V, rx: number, ry: number, grana: string, rub?: V, rw = 0): string => `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4)}
  ${grana}${rub ? img(rubPng, rub, rw, RUB_AR) : ''}`;
/** A mitochondrion (c2-kranz.ts): matrix, outer and inner bilayer, cristae folding in from top and bottom, glycine
 *  decarboxylase (render width gw at g) when it has it. */
function mito(c: V, rx: number, ry: number, folds: number[], g?: V, gw = 0, fl = 12): string {
  const ri = rx - 9, qi = ry - 9;
  const cr = folds.map((u, i) => {
    const x = c[0] + u * ri, h = qi * Math.sqrt(1 - u * u), s = i % 2 ? 1 : -1, y0 = c[1] + s * (h - 1);
    return bilayer([{ L: [x, y0, x, y0 - s * fl] }], 3.4, 1.2, 3.2);
  }).join('');
  return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${ri}" ry="${qi}" style="fill:#f8e4d8"/>${bilayerE(c[0], c[1], rx, ry, 3.6)}${bilayerE(c[0], c[1], ri, qi, 3.6)}${cr}
    ${g ? img(gdcPng, g, gw, GDC_AR) : ''}`;
}
/** A peroxisome (the photorespiration strip's look): its matrix and one bilayer. */
const perox = (c: V, r: number): string => `<ellipse class="cel-perox" cx="${c[0]}" cy="${c[1]}" rx="${r}" ry="${r}"/>${bilayerE(c[0], c[1], r, r, 3.6)}`;
/** A vacuole: its sap and the tonoplast, one bilayer. */
const vacuole = (c: V, rx: number, ry: number): string => `<ellipse class="cel-vac" cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 3.6)}`;
/** A wall band from x0 to x1 with its fibres, left out where skip(y). */
const wall = (x0: number, x1: number, skip: (y: number) => boolean = () => false): string => `<rect class="co2k-wallb" x="${x0}" y="${Y0}" width="${x1 - x0}" height="${Y1 - Y0}"/>`
  + Array.from({ length: 12 }, (_, i) => { const y = Y0 + 8 + i * 24; return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f((x0 + x1) / 2 - 4 + (i % 3) * 3)},${y}q5,7 0,14t0,14"/>`; }).join('');
/** A plasma membrane down x, open at the plasmodesma when pd. */
const pmV = (x: number, pd: boolean): string => pd
  ? bilayer([{ L: [x, Y0 - 4, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, Y1 + 4] }], 6, 1.6, 4.2)
  : bilayer([{ L: [x, Y0 - 4, x, Y1 + 4] }], 6, 1.6, 4.2);
/** The plasmodesma through the bundle-sheath/mesophyll wall: a channel lined by the plasma membrane, a desmotubule. */
const PD = `<rect x="${MW0 - 1}" y="${PDY - 15}" width="${MW1 - MW0 + 2}" height="30" class="co2k-cyt"/>
  ${bilayer([{ L: [BPM1, PDY - 15, MPM0, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [BPM1, PDY + 15, MPM0, PDY + 15] }], 5, 1.5, 4)}
  <path d="M${BPM1 - 4},${PDY}H${MPM0 + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>`;
/** The vein: the edge of its cells. */
const VEIN = [[Y0 - 10, 96], [92, 104], [202, 110]].map(([y, h]) => `<rect class="co2k-phl" x="${X0 - 40}" y="${y}" width="${VEIN1 - X0 + 30}" height="${h - 6}" rx="16"/>`).join('');

/** One strip, in C₃ row units (r 0: C₃, r 1: C₂). */
function stripSvg(r: number): string {
  const c2 = r === 1;
  const bs = c2
    ? `<clipPath id="${P}-bsc"><rect x="${BPM0 + 6}" y="${Y0}" width="${BPM1 - BPM0 - 12}" height="${Y1 - Y0}"/></clipPath>
      <ellipse data-k="${P}-glow" data-actor="1" display="none" cx="700" cy="150" rx="360" ry="190" fill="url(#${P}-glowg)" clip-path="url(#${P}-bsc)"/>
      ${vacuole([948, 140], 108, 102)}
      ${chloro(BCP2, 50, 48, granum(728, 286, 30))}
      ${chloro(BCP, BCRX, BCRY, `${granum(728, 184, 26)}${granum(776, 184, 24)}`, BRUB, 74)}
      ${mito(BMT, BMRX, BMRY, [-0.6, -0.3, 0.3, 0.6], BGDC, 50, 12)}`
    : vacuole([800, 151], 236, 116);
  const mes = `${chloro(MCP, MCRX, MCRY, `${granum(1196, 98, 30)}${granum(1330, 98, 30)}`, [MCP[0], MCP[1] - 4], 62)}
    ${perox(PX, PXR)}${mito(MMT, MMRX, MMRY, [-0.62, -0.24, 0.24, 0.62], c2 ? undefined : MGDC, 48, 10)}`;
  const names = c2
    ? `${lab(800, 30, 'bundle-sheath cell', 'co2k-zl cel-halo')}${lab(1262, 30, 'mesophyll cell', 'co2k-zl cel-halo')}
       ${lab(BRUB[0], 94, 'RuBisCO')}${lab(BMT[0], 282, 'glycine decarboxylase')}${lab(1093, 290, 'plasmodesma')}`
    : `${lab(461, 30, 'vein')}${lab(800, 30, 'bundle-sheath cell', 'co2k-zl cel-halo')}${lab(1262, 30, 'mesophyll cell', 'co2k-zl cel-halo')}
       ${lab(1516, 30, 'air space')}${lab(1336, 282, 'glycine decarboxylase')}`;
  return `<rect class="co2k-cyt" x="${X0}" y="${Y0}" width="${OW0 - X0}" height="${Y1 - Y0}"/>
    <rect class="co2k-ias" x="${OW1}" y="${Y0}" width="${X1 - OW1}" height="${Y1 - Y0}"/>${VEIN}
    ${wall(BW0, BW1)}${wall(MW0, MW1, y => c2 && Math.abs(y - PDY) < 24)}${wall(OW0, OW1)}
    ${pmV(BPM0, false)}${pmV(BPM1, c2)}${pmV(MPM0, c2)}${pmV(MPM1, false)}${c2 ? PD : ''}
    ${bs}${mes}${names}`;
}

/** A paper pill with a line of text (c2-kranz.ts look), centred on c. */
const pill = (c: V, s: string, w: number, size = 20): string => `<rect x="${f(c[0] - w / 2)}" y="${f(c[1] - 18)}" width="${w}" height="36" rx="18" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>
  ${T(c[0], c[1] + size * 0.36, s, 'co2k-ilb', 'middle', ` style="font-size:${size}px"`)}`;

/** The lens windows on the photos (photo px; one size on both, so both strips are at one scale) and the outlines. */
const WIN = { w: 360, h: 94 };
interface PhotoOpt { href: string; head: string; win: V; ring: [number, number, number, number]; bsAt: V; mesAt: V }
const PHOTO: PhotoOpt[] = [
  { href: c3Jpg, head: 'C₃ leaf', win: [568, 285], ring: [482, 352, 310, 342], bsAt: [300, 540], mesAt: [858, 214] },
  { href: c2Jpg, head: 'C₂ leaf', win: [545, 373], ring: [488, 414, 294, 240], bsAt: [292, 560], mesAt: [872, 238] },
];
function photoSvg(r: number): string {
  const o = PHOTO[r], [x, y] = ph(r, [0, 0]);
  const c = ph(r, [o.ring[0], o.ring[1]]), bs = ph(r, o.bsAt), ms = ph(r, o.mesAt);
  const w0 = ph(r, o.win), ww = WIN.w * PS, wh = WIN.h * PS, y0 = Y0 + r * DY;
  return `<image href="${o.href}" x="${x}" y="${y}" width="${f(1000 * PS)}" height="${f(740 * PS)}" preserveAspectRatio="none"/>
    ${actor(`${P}-${r}-name`, pill([54, y + 22], o.head, 92, 20))}
    ${actor(`${P}-${r}-bs`, `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(o.ring[2] * PS)}" ry="${f(o.ring[3] * PS)}" style="fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6;opacity:.85"/>${T(bs[0], bs[1], 'bundle sheath', 'co2k-zl cel-halo')}`)}
    ${actor(`${P}-${r}-mes`, T(ms[0], ms[1], 'mesophyll', 'co2k-zl cel-halo'))}
    ${actor(`${P}-${r}-lens`, `<path class="co2k-tan" d="M${f(w0[0] + ww)},${f(w0[1])}L${X0},${y0 + 1}M${f(w0[0] + ww)},${f(w0[1] + wh)}L${X0},${y0 + Y1 - Y0 - 1}"/>
      <rect class="co2k-lens" x="${f(w0[0])}" y="${f(w0[1])}" width="${f(ww)}" height="${f(wh)}" rx="5"/>`)}`;
}

/** The strip in its frame (clipped), with its movers in stage units. */
function rowSvg(r: number): string {
  const y0 = Y0 + r * DY, k = (n: string): string => `${P}-${r}-${n}`;
  const movers = `${actor(k('fl'), flashG(P, 30))}${actor(k('fl2'), flashG(P, 34))}
    ${actor(k('gly'), `${glyG}${lab(0, -20, 'glycine', 'cel-mn cel-halo')}`)}
    ${kidG(k('k'), KR, 'CO₂', KR + 24)}`;
  return `<clipPath id="${k('c')}"><rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/></clipPath>
    <g data-k="${k('row')}" data-actor="1" display="none">
      <rect class="co2k-inbg" x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/>
      <g clip-path="url(#${k('c')})"><g transform="translate(0 ${r * DY})">${stripSvg(r)}</g>${movers}</g>
      <rect class="co2k-inring" x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/></g>`;
}

/** The 2 fates, each where it happened: in the C₃ air space, under the C₂ bundle-sheath chloroplast. */
const FATES: Array<[string, number, V]> = [['C₃: lost to the air', 196, [1490, 76]], ['C₂: caught by RuBisCO', 232, [900, 272]]];

/* ---------------------------------------------------------------- motion */

const id = (r: number, n: string): string => `${P}-${r}-${n}`;
/** The CO₂ character of row r; dx turns its eyes (neutral face) sideways, in atom radii. */
function co2(a: Api, r: number, p: V, o: number, m: Mood, dx = 0): void {
  kid(a, id(r, 'k'), at(r, p), o, m);
  a.attr(`${id(r, 'k')}-fn`, 'transform', Math.abs(dx) > 0.002 ? `translate(${f(dx * KR)} 0)` : '');
}

/** Beat 1's times: the C₃ glycine, then the C₂ glycine, each from the peroxisome to beside the mitochondrion. */
const G1 = [3.4, 5.1];
/** Beat 2 (C₃): into the mitochondrion, the CO₂ freed (hold), it looks around, glad (hold), it drifts out and away. */
const B2 = { into: [0.2, 1.2], free: 1.3, look: [2.0, 3.6], out: [3.9, 6.4] };
/** Beat 3 (C₂): glycine to the bundle sheath (hold), the CO₂ freed (hold), it meets the chloroplast (hold), RuBisCO
 *  takes it in, the glow. */
const B3 = { run: [0.3, 4.2], free: 4.6, wall: [5.3, 6.6], take: [7.0, 8.0], glow: [8.2, 9.2] };

export const STAGING: Staging = {
  ...makeScene({
    id: 'c2f', name: 'c2f · The CO₂ character: leaked in C₃, trapped in C₂', beats: BEATS,
    holds: [[3.2], [1.9, 3.8], [4.5, 5.2, 6.9], []],
    note: 'C₃ and C₂ micrographs (Khoshravesh et al. 2016) with one strip each at one scale, vein to air space, in bilayers and real proteins (RuBisCO 8RUC, glycine decarboxylase 4LHC); slide 19\'s CO₂ character: freed beside the air space it drifts away (C₃); freed behind the bundle-sheath chloroplasts it meets RuBisCO and is caught (C₂)',
    svg: () => `<defs>${flashDefs(P)}<radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".62"/><stop offset=".6" stop-color="#f6c453" stop-opacity=".34"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient></defs>
      ${photoSvg(0)}${photoSvg(1)}
      <g class="fig dk2">${rowSvg(0)}${rowSvg(1)}</g>
      ${FATES.map(([s, w, c], r) => actor(id(r, 'fate'), pill(at(r, c), s, w))).join('')}
      ${T(1592, 732, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0) · RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC', 'co2k-cr', 'end')}`,
    frame(a, beat, t) {
      // beat 1: the leaves named, the bundle sheath, the mesophyll; the lens windows and the strips (nothing moves)
      for (const r of [0, 1]) {
        a.op(id(r, 'name'), from(beat, t, 0, 0.2, 0.6));
        a.op(id(r, 'bs'), from(beat, t, 0, 0.8, 1.2));
        a.op(id(r, 'mes'), from(beat, t, 0, 1.4, 1.8));
        a.op(id(r, 'lens'), from(beat, t, 0, 2.0, 2.4));
        a.op(id(r, 'row'), from(beat, t, 0, 2.4, 3.0));
      }
      // then, the same start in both rows, one after the other: glycine leaves the peroxisome for the mitochondrion
      if (beat === 0) for (const r of [0, 1]) {
        const g = G1[r];
        if (t > g) a.put(id(r, 'gly'), at(r, path(GLY_IN)(ease2(t, g + 0.2, g + 1.5))), ease(t, g, g + 0.3));
      }
      if (beat === 1) a.put(id(1, 'gly'), at(1, GLY_SPOT), 1);

      // beat 2 (C₃): glycine into the mitochondrion; glycine decarboxylase frees the CO₂ next to the air space; it looks
      // around, glad, and drifts out into the air space and away
      if (beat === 1) {
        if (t < B2.free + 0.3) a.put(id(0, 'gly'), at(0, path(GLY_MT)(ease2(t, B2.into[0], B2.into[1]))), 1 - ease(t, B2.free - 0.1, B2.free + 0.2));
        flash(a, t, B2.free, at(0, MGDC), id(0, 'fl'));
        const [l0, l1] = B2.look, look = t < l0 ? 0 : t < l0 + 0.5 ? -0.22 * ease(t, l0, l0 + 0.5) : t < l0 + 1.1 ? -0.22 + 0.44 * ease(t, l0 + 0.6, l0 + 1.1) : 0.22 * (1 - ease(t, l0 + 1.2, l1));
        const glad = ease(t, l1 - 0.4, l1);
        const [o0, o1] = B2.out, u = ease2(t, o0, o1);
        co2(a, 0, path(CO2_OUT)(u), ease(t, B2.free + 0.05, B2.free + 0.35) * (1 - ease(u, 0.86, 1)), { h: glad, lab: 1 - ease(t, o0, o0 + 0.4) }, look);
      }

      // beat 3 (C₂): glycine through the plasmodesma to the bundle-sheath mitochondrion; the CO₂ freed behind the
      // chloroplasts tries to leave, meets the chloroplast and its RuBisCO, which takes it in; the bundle sheath glows
      if (beat === 2) {
        if (t < B3.free + 0.3) a.put(id(1, 'gly'), at(1, path(GLY_BS)(ease2(t, B3.run[0], B3.run[1]))), 1 - ease(t, B3.free - 0.1, B3.free + 0.2));
        flash(a, t, B3.free, at(1, BGDC), id(1, 'fl'));
        const [w0, w1] = B3.wall, [k0, k1] = B3.take;
        const p: V = t < k0 ? path([BCO2_AT, [618, 150], BCO2_WALL])(ease2(t, w0, w1)) : path([BCO2_WALL, [706, 142], BRUB])(ease2(t, k0, k1));
        co2(a, 1, p, ease(t, B3.free + 0.05, B3.free + 0.35) * (1 - ease(t, k1 - 0.25, k1 + 0.05)), { s: ease(t, w0 + 0.6, w1 - 0.2), sweat: ease(t, w1 - 0.3, w1 + 0.1), lab: 1 - ease(t, w0, w0 + 0.4) });
        flash(a, t, k1, at(1, BRUB), id(1, 'fl2'));
      }
      a.op(`${P}-glow`, beat === 3 ? 1 : beat === 2 ? ease(t, B3.glow[0], B3.glow[1]) : 0);

      // beat 4: the 2 fates, at the exit of each row; then the question
      a.op(id(0, 'fate'), beat === 3 ? ease(t, 0.3, 0.7) : 0);
      a.op(id(1, 'fate'), beat === 3 ? ease(t, 0.9, 1.3) : 0);
    },
  }),
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 346, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 398, size: 44 },
  ],
};
