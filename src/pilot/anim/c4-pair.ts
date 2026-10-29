// 'lf12', staging c4p · C₄ slide, C₃ vs C₄ as a pair: the sibling of the C₂ slide's c2m (anim/c2-micro.ts), same layout,
// organelles and glyphs. Its one point: C₄ pumps CO₂ into the bundle sheath, where RuBisCO sits in high CO₂ and hardly
// takes O₂.
// - Left, stacked: the 2 micrographs, C₃ on top, C₄ below, each with its heading; on each the vein and the ring of
//   bundle-sheath cells outlined and named, the mesophyll named, a lens on the wall between a bundle-sheath cell and the
//   mesophyll cell next to it. Steinchisma laxum (C₃): Khoshravesh et al. 2016, J. Exp. Bot. 67:3065, Fig. 1D
//   (CC BY 3.0). Maize (C₄): Berkshire Community College Bioscience Image Library (CC0); its big Kranz cells are plain.
// - Right of each photo, linked by thin magnifier lines, its row at one scale, the 2 rows' columns one above the other:
//   bundle-sheath cell, wall, mesophyll cell, far wall, air space. C₃: a plain bundle-sheath cell (vacuole), the
//   mesophyll chloroplast with RuBisCO (PDB 8RUC). C₄: the bundle-sheath chloroplast with RuBisCO (few grana, as in
//   maize), a plasmodesma through the wall, the mesophyll chloroplast without RuBisCO but with PPDK (PDB 1VBG, maize),
//   PEPC (PDB 3ZGE) in the mesophyll cytosol. Membranes are bilayers; molecules are the photorespiration strip's atom
//   balls (R = 11); every CO₂ that is a hero is slide 19's CO₂ character (co2-kit kidG/kid).
// - Beats (one mover at a time, eased glides and fades only, a pause after each step):
//   1 the photos named (vein, bundle sheath, mesophyll); then the lenses and rows;
//   2 C₃ row: a CO₂ comes in from the air space and waits by RuBisCO; an O₂ comes in and RuBisCO takes it first: 2-PG,
//     red "toxic" glow as on the photorespiration slide, the CO₂ fretting; then RuBisCO takes the CO₂;
//   3 C₄ row: a CO₂ comes in, becomes HCO₃⁻, which PEPC adds to PEP: a C₄ acid; then the C₄ acid goes through the
//     plasmodesma into the bundle-sheath chloroplast;
//   4 C₄ row: the C₄ acid releases its CO₂ next to RuBisCO; CO₂ crowds the bundle sheath (more CO₂ characters, an O₂
//     among them, the gold glow); then RuBisCO catches the CO₂, and 2-PG appears only faded;
//   5 C₄ row, the cost: the C₃ acid goes back to PPDK, which splits ATP to AMP and makes PEP; PEP returns to PEPC. The
//     closing question leads to CAM.
import c3Jpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import ppdkPng from '../../assets/rf/ppdk-1vbg.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import '../figs/chain.css';
import './dk2-common.css';
import { atomBall, row } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { actor, bilayerE, ease, ease2, f, flash, flashDefs, flashG, from, kid, kidG, life, makeScene, path, T, type Api, type Mood, type V } from './co2-kit';
import type { Beat, Cite, Staging } from './types';

const P = 'c4p';

/* ---------------------------------------------------------------- captions */

const KHOSH16: Cite = { label: 'Khoshravesh et al. 2016, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erw150' };
const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const HS66: Cite = { label: 'Hatch & Slack 1966, Biochem. J.', url: 'https://doi.org/10.1042/bj1010103' };
const VC21: Cite = { label: 'von Caemmerer 2021, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erab266' };

const BEATS: Beat[] = [
  { tag: 'C₃ and C₄ leaves', say: 'Top a C₃ grass, below maize, a C₄ grass, each cut across a vein. Around the vein lies the ring of bundle-sheath cells; in maize they are large and full of chloroplasts (Kranz anatomy).', cite: [KHOSH16, SAGE12] },
  { tag: 'C₃: O₂ competes', say: 'In the C₃ leaf, RuBisCO sits in the mesophyll, where O₂ competes with CO₂: RuBisCO takes both, and each O₂ it takes gives the toxic 2-PG of photorespiration.', cite: [SAGE12] },
  { tag: 'C₄: PEPC', say: 'In the C₄ leaf, CO₂ in the mesophyll becomes HCO₃⁻, and phosphoenolpyruvate carboxylase (PEPC) adds it to phosphoenolpyruvate (PEP), making a C₄ acid. The C₄ acid moves through the plasmodesmata into the bundle sheath.', cite: [HS66, VC21] },
  { tag: 'CO₂ around RuBisCO', say: 'There the C₄ acid releases its CO₂ next to RuBisCO, so CO₂ is concentrated in the bundle sheath. At high CO₂, RuBisCO hardly takes O₂: little 2-PG is made.', cite: [VC21] },
  { tag: 'The cost', say: 'The C₃ acid left over, pyruvate, returns to the mesophyll, where pyruvate orthophosphate dikinase (PPDK) turns it back into PEP; this costs 2 ATP for each CO₂ pumped. <b>A cactus keeps its stomata shut on a hot day: how does it get its CO₂?</b>', cite: [VC21] },
];

/* ---------------------------------------------------------------- glyphs: the photorespiration strip's (dk-rf6.ts) */

const R = 11, ST = 2.15 * R;
const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG: 2 carbons and a phosphate; its red glow keyed for the frame (none when g is empty). */
const pgG = (g: string): string => `${g ? `<ellipse data-k="${g}" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>` : ''}${bond(0, ST)}${atomBall(ST, 0, 'P', R)}${row(-ST / 2, 0, 'CC', { r: R })}`;
const gas = (el: string): string => `<g class="chn-g">${balls(0, 0, el)}</g>`;
const carb = (s: string): string => row(0, 0, s, { r: R });
/** HCO₃⁻: a C with 3 O, one of them carrying the H (as anim/c4-kranz.ts). */
const hco3G = (r = R): string => `<circle class="atom atom-H" cx="${f(-1.7 * r)}" cy="${f(-1.55 * r)}" r="${f(r * 0.56)}"/>
  <circle class="atom atom-O" cx="${f(-1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/><circle class="atom atom-O" cx="${f(1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/>
  <circle class="atom atom-O" cx="0" cy="${f(1.3 * r)}" r="${r}"/><circle class="atom atom-C" r="${r}"/>`;
const lab = (s: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'middle', cls = 'cel-mn cel-halo'): string => T(x, y, s, cls, a);

/* ---------------------------------------------------------------- layout (stage units) */

/** The photos: 400 × 296 (1000 × 740 scaled by 0.4), C₃ at y 30, C₄ at y 440. */
const PS = 0.4, PH = [30, 440];
const ph = (r: number, p: V): V => [p[0] * PS, PH[r] + p[1] * PS];
/** The rows: x 470–1592, y 10–292 (C₃) and 440–722 (C₄); drawn in C₃ row units, the C₄ row shifted by DY. */
const X0 = 470, X1 = 1592, Y0 = 10, Y1 = 292, DY = 430;
const at = (r: number, p: V): V => [p[0], p[1] + r * DY];
const atq = (r: number, q: V[]): V[] => q.map(p => at(r, p));

/** The wall between the bundle-sheath cell and the mesophyll cell, their plasma membranes, the plasmodesma (C₄). */
const W0 = 860, W1 = 888, PM_A = 853, PM_M = 895, PDY = 262;
/** The mesophyll cell's far wall, its plasma membrane, the air space beyond. */
const FW0 = 1460, FW1 = 1488, PM_F = 1453, AIR = 1540;
/** Mesophyll chloroplast (stroma radii) in both rows; C₃: RuBisCO and the 2-PG's place. */
const MC: V = [1150, 151], MRX = 150, MRY = 96, MRUB: V = [1150, 140], PG0: V = [1150, 218];
/** C₄ mesophyll: PPDK in the chloroplast, PEPC in the cytosol with PEP docked on it. */
const PPDK: V = [1215, 184], PPDK_W = 76, PEPC: V = [1386, 92], PEPC_W = 72, PEP0: V = [1386, 146];
/** C₄ bundle sheath: the chloroplast (stroma radii), RuBisCO. */
const BC: V = [668, 151], BRX = 160, BRY = 110, BRUB: V = [668, 146];
const RUB_W = 66, RUB_AR = 471 / 548;

/** Beat 2 (C₃): the CO₂ in from the air space to its waiting place by RuBisCO, then into RuBisCO; the O₂ into RuBisCO. */
const KW0: V = [1252, 104];
const K0_IN: V[] = [[AIR, 112], [1496, 112], [1440, 110], [1350, 108], KW0];
const K0_GO: V[] = [KW0, [1210, 116], [1176, 132]];
const O2_IN: V[] = [[AIR + 4, 214], [1490, 210], [1400, 200], [1290, 178], [1196, 156]];
/** Beat 3 (C₄): the CO₂ in, where it becomes HCO₃⁻; HCO₃⁻ to PEP on PEPC; the C₄ acid along the lane under the
 *  chloroplast, through the plasmodesma, into the bundle-sheath chloroplast. */
const KH1: V = [1420, 248];
const K1_IN: V[] = [[AIR, 244], [1494, 246], [1456, 248], KH1];
const HC_GO: V[] = [KH1, [1430, 204], [1418, 170], [1404, 146]];
const ACID0: V = [1386, 178], STOP: V = [720, 206];
const ACID_RUN: V[] = [ACID0, [1372, 220], [1330, 262], [1250, 272], [1080, 274], [940, 268], [W1 + 6, PDY], [PM_A - 10, PDY], [812, 250], [776, 232], STOP];
/** Beat 4 (C₄): the C₃ acid and the released CO₂ where the C₄ acid stopped; the CO₂ to RuBisCO. */
const C3_AT: V = [STOP[0] + ST / 2, STOP[1]], HERO0: V = [662, 212];
const HERO_GO: V[] = [HERO0, [664, 190], [668, 162]];
/** The crowd: CO₂ round RuBisCO in the bundle-sheath stroma (face weights), one O₂ among them; the faded 2-PG. */
const CROWD: Array<{ p: V; m: Mood }> = [
  { p: [586, 94], m: { h: 1 } }, { p: [750, 94], m: { n: 1 } }, { p: [668, 64], m: { h: 1 } },
  { p: [770, 156], m: { s: 1 } }, { p: [596, 218], m: { h: 1 } },
];
const BO2: V = [690, 242], PGF: V = [566, 152];
/** Beat 5 (C₄): the C₃ acid back along the lane into the mesophyll chloroplast to PPDK; PEP out to PEPC. */
const PYR_DOCK: V = [1135, 188], ATP_AT: V = [1268, 142];
const PYR_RUN: V[] = [C3_AT, [776, 232], [812, 250], [PM_A - 10, PDY], [W1 + 6, PDY], [940, 268], [1040, 272], [1090, 258], [1112, 232], PYR_DOCK];
const PEP_RUN: V[] = [PYR_DOCK, [1150, 228], [1220, 240], [1290, 226], [1336, 200], [1370, 176], PEP0];

/* ---------------------------------------------------------------- drawing */

/** A thylakoid stack: n discs of width w from (x, y) down (as the strip's granum, smaller). */
const granum = (x: number, y: number, w: number, n = 4): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
/** A single, unstacked thylakoid (the bundle-sheath chloroplasts of maize have few grana). */
const lamella = (x: number, y: number, w: number): string => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`;
const img = (href: string, c: V, w: number, ar: number): string => `<image href="${href}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * ar) / 2)}" width="${w}" height="${f(w * ar)}"/>`;
/** A chloroplast as the strip draws it: stroma (an optional glow over it), the 2 envelope bilayers. */
const chloro = (c: V, rx: number, ry: number, glow = ''): string => `<ellipse class="cel-stroma" cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${glow}${bilayerE(c[0], c[1], rx, ry, 4.5)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4.5)}`;
/** A plasma membrane down a wall at x; open at the plasmodesma when gap. */
const pmV = (x: number, gap: boolean): string => gap
  ? bilayer([{ L: [x, Y0 - 4, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, Y1 + 4] }], 6, 1.6, 4.2)
  : bilayer([{ L: [x, Y0 - 4, x, Y1 + 4] }], 6, 1.6, 4.2);
/** Wall fibres down a wall band from x, left out where skip(y). */
const fibres = (x: number, skip: (y: number) => boolean): string => Array.from({ length: 12 }, (_, i) => { const y = Y0 + 8 + i * 24; return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f(x + 7 + (i % 3) * 5)},${y}q5,7 0,14t0,14"/>`; }).join('');

const id = (r: number, n: string): string => `${P}-${r}-${n}`;

/** One row's drawing, in C₃ row units (r 0: C₃, r 1: C₄). */
function rowSvg(r: number): string {
  const c4 = r === 1;
  const cyt = (a: number, b: number): string => `<rect class="co2k-cyt" x="${a}" y="${Y0}" width="${b - a}" height="${Y1 - Y0}"/>`;
  const wallAt = (a: number, b: number, skip: (y: number) => boolean): string => `<rect class="co2k-wallb" x="${a}" y="${Y0}" width="${b - a}" height="${Y1 - Y0}"/>${fibres(a, skip)}`;
  const pd = c4 ? `<rect x="${W0 - 1}" y="${PDY - 15}" width="${W1 - W0 + 2}" height="30" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_A, PDY - 15, PM_M, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [PM_A, PDY + 15, PM_M, PDY + 15] }], 5, 1.5, 4)}
    <path d="M${PM_A - 4},${PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>` : '';
  const frame = `${cyt(X0, W0)}${wallAt(W0, W1, y => c4 && Math.abs(y - PDY) < 24)}${cyt(W1, FW0)}${wallAt(FW0, FW1, () => false)}
    <rect class="co2k-ias" x="${FW1}" y="${Y0}" width="${X1 - FW1}" height="${Y1 - Y0}"/>
    ${pmV(PM_A, c4)}${pmV(PM_M, c4)}${pmV(PM_F, false)}${pd}`;
  // the bundle-sheath cell: C₃ a vacuole; C₄ its chloroplast with RuBisCO, few grana, and the CO₂ glow
  const bs = c4
    ? `<ellipse data-k="${id(1, 'glow')}" display="none" cx="${BC[0]}" cy="${BC[1]}" rx="200" ry="150" fill="url(#${P}-glowg)"/>
       ${chloro(BC, BRX, BRY, `<ellipse data-k="${id(1, 'glow2')}" display="none" cx="${BC[0]}" cy="${BC[1]}" rx="${BRX}" ry="${BRY}" fill="url(#${P}-glowg)"/>`)}
       ${lamella(640, 186, 70)}${lamella(760, 124, 60)}${img(rubPng, BRUB, RUB_W, RUB_AR)}`
    : `<ellipse class="cel-vac" cx="${BC[0]}" cy="${BC[1]}" rx="170" ry="112"/>${bilayerE(BC[0], BC[1], 170, 112, 3.6)}`;
  // the mesophyll cell: its chloroplast (C₃ with RuBisCO; C₄ without, with PPDK); C₄: PEPC in the cytosol
  const mes = c4
    ? `${chloro(MC, MRX, MRY)}${granum(1040, 124, 34)}${granum(1150, 78, 34)}${img(ppdkPng, PPDK, PPDK_W, 403 / 654)}${img(pepcPng, PEPC, PEPC_W, 517 / 608)}`
    : `${chloro(MC, MRX, MRY)}${granum(1040, 124, 34)}${granum(1262, 124, 34)}${img(rubPng, MRUB, RUB_W, RUB_AR)}`;
  // names: the cells and the air space once (C₃ row); the proteins where they sit
  const names = c4
    ? `${lab('RuBisCO', BRUB[0], 112, 'middle', 'cel-prot cel-halo')}${lab('PPDK', PPDK[0], 152, 'middle', 'cel-prot cel-halo')}
       ${lab('PEPC', PEPC[0], 52, 'middle', 'cel-prot cel-halo')}${lab('plasmodesma', 874, PDY - 26, 'middle', 'co2k-il cel-halo')}`
    : `${lab('bundle-sheath cell', BC[0], 34, 'middle', 'co2k-zl cel-halo')}${lab('mesophyll cell', MC[0], 34, 'middle', 'co2k-zl cel-halo')}
       ${lab('air space', AIR, 34, 'middle', 'cel-zone cel-halo')}${lab('RuBisCO', MRUB[0], 104, 'middle', 'cel-prot cel-halo')}`;
  const y0 = Y0 + r * DY;
  return `<clipPath id="${id(r, 'c')}"><rect x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/></clipPath>
    <g data-k="${id(r, 'row')}" data-actor="1" display="none">
      <rect class="co2k-inbg" x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/>
      <g clip-path="url(#${id(r, 'c')})"><g transform="translate(0 ${r * DY})">${frame}${bs}${mes}${names}</g>
        <g class="chn-g">${c4 ? movers1() : movers0()}</g></g>
      <rect class="co2k-inring" x="${X0}" y="${y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="16"/></g>`;
}

/** The C₃ row's moving molecules (drawn at the origin). */
function movers0(): string {
  return [
    kidG(id(0, 'k'), R, 'CO₂'),
    actor(id(0, 'o2'), `${gas('OO')}${lab('O₂', 0, -20)}`),
    actor(id(0, 'pg'), `${pgG(id(0, 'pgG'))}${lab('2-PG', 0, -24)}<g data-k="${id(0, 'tox')}">${lab('toxic', -52, 6, 'end', 'dk2-toxic cel-halo')}</g>`),
    actor(id(0, 'fl'), flashG(P, 30)),
  ].join('');
}
/** The C₄ row's moving molecules (drawn at the origin). */
function movers1(): string {
  const crowd = CROWD.map((_, i) => kidG(id(1, `cr${i}`), R, '')).join('');
  return [
    actor(id(1, 'pep'), `${carb('CCCP')}${lab('PEP', 0, 34)}`),
    kidG(id(1, 'k'), R, 'CO₂'),
    actor(id(1, 'hc'), `<g class="chn-g">${hco3G()}</g>`), actor(id(1, 'hcl'), lab('HCO₃⁻', 0, -28)),
    actor(id(1, 'acid'), carb('CCCC')), actor(id(1, 'acidl'), lab('C₄ acid', 0, -20)),
    actor(id(1, 'c3'), carb('CCC')), actor(id(1, 'c3l'), lab('C₃ acid', 0, -20)),
    crowd,
    actor(id(1, 'o2'), gas('OO')),
    kidG(id(1, 'h'), R, 'CO₂'),
    actor(id(1, 'pgf'), `<g opacity=".3">${pgG('')}</g>${T(0, -22, '2-PG', 'cel-mn cel-halo', 'middle', ' style="fill:#aeaba1"')}`),
    actor(id(1, 'atp'), `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>`),
    actor(id(1, 'amp'), `<g class="chn-g">${tagG(0, 0, 'AMP', 'atp')}</g>`),
    actor(id(1, 'pep2'), carb('CCCP')), actor(id(1, 'pep2l'), lab('PEP', 0, 34)),
    actor(id(1, 'fl'), flashG(P, 30)),
  ].join('');
}

/** The photo, its outlines and names, the lens and the magnifier lines to its row. */
interface PhotoOpt { href: string; vein: [number, number, number, number]; ring: [number, number, number, number]; veinAt: V; bsAt: V; mesAt: V; lens: V; head: string }
const PHOTO: PhotoOpt[] = [
  { href: c3Jpg, vein: [476, 412, 104, 116], ring: [482, 352, 310, 342], veinAt: [476, 476], bsAt: [300, 540], mesAt: [880, 200], lens: [781, 296], head: 'C₃ leaf' },
  { href: zeaJpg, vein: [470, 404, 96, 100], ring: [514, 380, 256, 212], veinAt: [470, 416], bsAt: [514, 640], mesAt: [880, 548], lens: [752, 386], head: 'C₄ leaf' },
];
const LR = 15;
function photoSvg(r: number): string {
  const o = PHOTO[r], [x, y] = ph(r, [0, 0]);
  const ell = (e: [number, number, number, number], style: string): string => { const c = ph(r, [e[0], e[1]]); return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${f(e[2] * PS)}" ry="${f(e[3] * PS)}" style="${style}"/>`; };
  const t = (p: V, s: string): string => { const q = ph(r, p); return T(q[0], q[1], s, 'co2k-zl cel-halo'); };
  const L = ph(r, o.lens), y0 = Y0 + r * DY;
  // magnifier lines: from the lens rim to the row's left corners
  const line = (cy: number): string => { const a = Math.atan2(cy - L[1], X0 - L[0]); return `M${f(L[0] + LR * Math.cos(a))},${f(L[1] + LR * Math.sin(a))}L${X0},${f(cy)}`; };
  return `<image href="${o.href}" x="${x}" y="${y}" width="${f(1000 * PS)}" height="${f(740 * PS)}" preserveAspectRatio="none"/>
    ${T(4, y - 9, o.head, 'co2k-zl', 'start', ' style="font-size:22px"')}
    ${actor(id(r, 'vein'), `${ell(o.vein, 'fill:none;stroke:#5a4a1a;stroke-width:2;stroke-dasharray:3 4')}${t(o.veinAt, 'vein')}`)}
    ${actor(id(r, 'bs'), `${ell(o.ring, 'fill:none;stroke:#fbfaf6;stroke-width:5.5;opacity:.75')}${ell(o.ring, 'fill:none;stroke:#2f6f5f;stroke-width:2.6;stroke-dasharray:8 6')}${t(o.bsAt, 'bundle sheath')}`)}
    ${actor(id(r, 'mes'), t(o.mesAt, 'mesophyll'))}
    ${actor(id(r, 'lens'), `<path class="co2k-tan" d="${line(y0 + 1)}${line(y0 + Y1 - Y0 - 1)}"/><circle class="co2k-lens" cx="${f(L[0])}" cy="${f(L[1])}" r="${LR}"/>`)}`;
}

/* ---------------------------------------------------------------- the script */

const show = (a: Api, k: string, p: V, o: number): void => { if (o > 0.004) a.put(k, p, o); };
const glideOn = (q: V[], t: number, t0: number, t1: number): V => path(q)(ease2(t, t0, t1));

/** Beat timings (s since the beat began); a hold (a click) after each step. */
const B1 = { k: [0.3, 2.3], hold1: 2.5, o2: [2.7, 4.4], fl1: 4.5, pg: [4.6, 4.9], glow: [4.8, 5.4], hold2: 5.6, go: [5.8, 6.6], fl2: 6.7 };
const B2 = { k: [0.3, 1.8], swap: [2.0, 2.4], hc: [2.8, 3.6], fl: 3.7, acid: [3.75, 4.05], hold: 4.5, run: [4.7, 8.2] };
const B3 = { fl: 0.5, swap: [0.45, 0.75], crowd: [1.0, 2.2], hold: 2.5, go: [2.7, 3.4], fl2: 3.5, pgf: [3.9, 4.5] };
const B4 = { lab: [0.2, 0.5], run: [0.7, 3.7], atp: [3.5, 3.8], fl: 4.1, swap: [4.1, 4.4], hold: 4.7, up: [4.9, 6.6] };

/** The C₃ row's end state: the 2-PG with its glow and labels. */
function c3End(a: Api): void { a.put(id(0, 'pg'), at(0, PG0), 1); a.op(id(0, 'pgG'), 1); a.op(id(0, 'tox'), 1); }
/** The crowded bundle sheath (opacity o, glow g). */
function crowd(a: Api, o: number, g: number): void {
  CROWD.forEach((c, i) => kid(a, id(1, `cr${i}`), at(1, c.p), o, c.m));
  show(a, id(1, 'o2'), at(1, BO2), o);
  a.op(id(1, 'glow'), g); a.op(id(1, 'glow2'), g);
}

/** Beat 2, C₃ row: the CO₂ waits by RuBisCO; the O₂ is taken first (2-PG, red glow, the CO₂ frets); then the CO₂. */
function beat2(a: Api, t: number): void {
  const fret = ease(t, B1.fl1 + 0.1, B1.fl1 + 0.5) * (1 - ease(t, B1.go[0], B1.go[0] + 0.4));
  if (t < B1.go[1] + 0.25) {
    const p = t < B1.go[0] ? glideOn(K0_IN, t, B1.k[0], B1.k[1]) : glideOn(K0_GO, t, B1.go[0], B1.go[1]);
    kid(a, id(0, 'k'), at(0, p), ease(t, 0.2, 0.5) * (1 - ease(t, B1.go[1], B1.go[1] + 0.2)),
      { s: fret, h: ease(t, B1.go[0], B1.go[0] + 0.4), sweat: fret, lab: 1 - ease(t, B1.go[0], B1.go[0] + 0.3) });
  }
  if (t > B1.o2[0] - 0.2 && t < B1.o2[1] + 0.25) show(a, id(0, 'o2'), at(0, glideOn(O2_IN, t, B1.o2[0], B1.o2[1])), life(t, B1.o2[0] - 0.2, B1.o2[0] + 0.1, B1.o2[1], B1.o2[1] + 0.2));
  flash(a, t, B1.fl1, at(0, MRUB), id(0, 'fl'));
  show(a, id(0, 'pg'), at(0, PG0), ease(t, B1.pg[0], B1.pg[1]));
  a.op(id(0, 'pgG'), ease(t, B1.glow[0], B1.glow[1])); a.op(id(0, 'tox'), ease(t, B1.glow[0], B1.glow[1]));
  flash(a, t, B1.fl2, at(0, MRUB), id(0, 'fl'));
}
/** Beat 3, C₄ row: the CO₂ in, HCO₃⁻, PEPC makes the C₄ acid; the C₄ acid into the bundle sheath. */
function beat3(a: Api, t: number): void {
  const sw = ease(t, B2.swap[0], B2.swap[1]);
  if (t < B2.swap[1] + 0.05) kid(a, id(1, 'k'), at(1, glideOn(K1_IN, t, B2.k[0], B2.k[1])), ease(t, 0.2, 0.5) * (1 - sw), { lab: 1 });
  if (t > B2.swap[0]) {
    const q = at(1, glideOn(HC_GO, t, B2.hc[0], B2.hc[1]));
    show(a, id(1, 'hc'), q, sw * (1 - ease(t, B2.fl, B2.fl + 0.2))); show(a, id(1, 'hcl'), q, sw * (1 - ease(t, B2.hc[0], B2.hc[0] + 0.3)));
  }
  show(a, id(1, 'pep'), at(1, PEP0), 1 - ease(t, B2.fl, B2.fl + 0.2));
  flash(a, t, B2.fl, at(1, [PEP0[0] + 8, PEP0[1] - 4]), id(1, 'fl'));
  const p = glideOn(ACID_RUN, t, B2.run[0], B2.run[1]), o = ease(t, B2.acid[0], B2.acid[1]);
  show(a, id(1, 'acid'), at(1, p), o); show(a, id(1, 'acidl'), at(1, p), o);
}
/** Beat 4, C₄ row: the C₄ acid gives the C₃ acid and CO₂; CO₂ crowds the bundle sheath; RuBisCO catches the CO₂. */
function beat4(a: Api, t: number): void {
  const sw = ease(t, B3.swap[0], B3.swap[1]);
  show(a, id(1, 'acid'), at(1, STOP), 1 - sw); show(a, id(1, 'acidl'), at(1, STOP), 1 - sw);
  flash(a, t, B3.fl, at(1, [STOP[0] - 30, STOP[1]]), id(1, 'fl'));
  show(a, id(1, 'c3'), at(1, C3_AT), sw);
  const c = ease(t, B3.crowd[0], B3.crowd[1]);
  crowd(a, c, c);
  if (t < B3.go[1] + 0.25) kid(a, id(1, 'h'), at(1, glideOn(HERO_GO, t, B3.go[0], B3.go[1])), sw * (1 - ease(t, B3.go[1], B3.go[1] + 0.2)), { h: 1, lab: 1 - ease(t, B3.crowd[0], B3.crowd[0] + 0.4) });
  flash(a, t, B3.fl2, at(1, BRUB), id(1, 'fl'));
  show(a, id(1, 'pgf'), at(1, PGF), ease(t, B3.pgf[0], B3.pgf[1]));
}
/** Beat 5, C₄ row: the C₃ acid back to PPDK; ATP to AMP, the C₃ acid to PEP; PEP back to PEPC. */
function beat5(a: Api, t: number): void {
  crowd(a, 1, 1); show(a, id(1, 'pgf'), at(1, PGF), 1);
  const sw = ease(t, B4.swap[0], B4.swap[1]);
  const p = glideOn(PYR_RUN, t, B4.run[0], B4.run[1]);
  show(a, id(1, 'c3'), at(1, p), 1 - sw); show(a, id(1, 'c3l'), at(1, p), ease(t, B4.lab[0], B4.lab[1]) * (1 - sw));
  show(a, id(1, 'atp'), at(1, ATP_AT), ease(t, B4.atp[0], B4.atp[1]) * (1 - sw)); show(a, id(1, 'amp'), at(1, ATP_AT), sw);
  flash(a, t, B4.fl, at(1, PPDK), id(1, 'fl'));
  const q = glideOn(PEP_RUN, t, B4.up[0], B4.up[1]);
  show(a, id(1, 'pep2'), at(1, q), sw); show(a, id(1, 'pep2l'), at(1, q), sw);
}

export const STAGING: Staging = {
  ...makeScene({
    id: P, name: 'c4p · C₃ vs C₄ leaf: micrographs and rows', beats: BEATS,
    holds: [[2.4], [B1.hold1, B1.hold2], [B2.hold], [B3.hold], [B4.hold]],
    note: 'The C₃ (Steinchisma laxum, Khoshravesh et al. 2016) and C₄ (maize, CC0) micrographs stacked on the left, vein and bundle sheath outlined; right of each, by a lens, its row in the C₂ slide\'s organelles and glyphs: C₃ RuBisCO in the mesophyll takes O₂ (2-PG glows); C₄ PEPC fixes HCO₃⁻, the C₄ acid carries CO₂ into the bundle sheath, crowded with CO₂ characters round RuBisCO; 2-PG faded; the cost (PPDK, ATP)',
    svg: () => `<defs>${flashDefs(P)}<radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
        <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".6"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".32"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient></defs>
      ${photoSvg(0)}${photoSvg(1)}
      <g class="fig dk2">${rowSvg(0)}${rowSvg(1)}</g>
      ${T(1592, 736, '<tspan font-style="italic">Steinchisma laxum</tspan>: Khoshravesh et al. 2016 (CC BY 3.0) · maize: Berkshire Community College Bioscience Image Library (CC0) · RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE · PPDK: PDB 1VBG', 'co2k-cr', 'end')}`,
    frame(a, beat, t) {
      // beat 1: on both photos the vein, the bundle sheath, the mesophyll, one at a time; then the lenses and the rows
      for (const r of [0, 1]) {
        a.op(id(r, 'vein'), from(beat, t, 0, 0.3, 0.7));
        a.op(id(r, 'bs'), from(beat, t, 0, 1.0, 1.4));
        a.op(id(r, 'mes'), from(beat, t, 0, 1.7, 2.1));
        a.op(id(r, 'lens'), from(beat, t, 0, 2.6, 3.0));
        a.op(id(r, 'row'), from(beat, t, 0, 3.0, 3.6));
      }
      if (beat === 0) { a.put(id(1, 'pep'), at(1, PEP0), 1); return; }
      if (beat === 1) { beat2(a, t); a.put(id(1, 'pep'), at(1, PEP0), 1); return; }
      c3End(a);
      if (beat === 2) beat3(a, t);
      else if (beat === 3) beat4(a, t);
      else beat5(a, t);
    },
  }),
  keys: [
    { beat: 4, text: 'A cactus keeps its stomata shut on a hot day:', x: 800, y: 370, size: 44 },
    { beat: 4, text: 'how does it get its CO₂?', x: 800, y: 420, size: 44 },
  ],
};
