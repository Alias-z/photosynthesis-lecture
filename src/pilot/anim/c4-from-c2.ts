// 'lf12', staging c4s · from C₂ to C₄ (slide C12), in the micrograph-and-magnifier style of anim/c2-kranz.ts, which the
// students have just seen: the same magnifier on the bundle-sheath/mesophyll wall, the same organelles and protein
// structures, the photorespiration strip's glyphs (anim/dk-rf6.ts, R = 11) and slide 19's CO₂ character (co2-kit kidG).
// The one essence (lecturer, 29 Oct 2026, late): glycine brings a little CO₂ into the bundle sheath, the C₄ acid pumps
// far more. One fixed framing; one thing moves at a time; eased glides and fades; a pause after each step (holds).
// - The scene: the C₂ micrograph (Homolepis aturensis, Khoshravesh et al. 2016, J. Exp. Bot. 67:3065, Fig. 1B, CC BY 3.0,
//   as in c2-kranz.ts) in beat 1, cross-fading to the maize micrograph (Berkshire Community College Bioscience Image
//   Library, Wikimedia Commons, CC0, as in c4-style.ts) for beats 2–4; the lens moves with the photo, the magnifier stays.
// - The magnifier, left to right: the bundle-sheath cell (a chloroplast with RuBisCO, PDB 8RUC, and a 2-PG glowing red
//   beside it: oxygenation still happens there; below it a mitochondrion with glycine decarboxylase, PDB 4LHC), the wall
//   with a plasmodesma, the mesophyll cell (a chloroplast with RuBisCO, a mitochondrion whose glycine decarboxylase is
//   absent: faded and crossed, as on the C₂ slide), its far wall and an air space.
// - Beat 1 (C₂ again): a glycine crosses through the plasmodesma into the bundle-sheath mitochondrion | it gives up its
//   CO₂ (the character), which goes to RuBisCO and is caught (glad); the stroma glows faintly. One CO₂.
// - Beat 2 (to C₄): the photo turns to maize | the mesophyll's RuBisCO fades and PEPC (PDB 3ZGE, the C₄ enzyme of
//   Flaveria trinervia, Paulus et al. 2013) appears where the glycine started, PEP docked on it; HCO₃⁻ goes into PEPC and a
//   C₄ acid comes out | the C₄ acid moves into the plasmodesma, where the glycine passed.
// - Beat 3 (the pump): the C₄ acid goes on into the chloroplast and releases its CO₂, which RuBisCO catches | 4 more C₄
//   acids follow one after another, each releasing a CO₂ that joins the crowd at RuBisCO; the stroma glows bright | the
//   2-PG fades: with CO₂ high, RuBisCO rarely binds O₂.
// - Beat 4: the photo's tag becomes the evolution strip C₃ → C₂ → C₄, C₄ lit; the closing question leads to CAM.
// PEPC fixes HCO₃⁻ and has no oxygenase activity; each C₄ acid releases 1 CO₂ (its fourth carbon) in the bundle sheath,
// the 3-carbon rest returns to the mesophyll (not followed here).
import './dk2-common.css';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { bilayer } from '../figs/cell-schema';
import { actor, bilayerE, ease, f, flash, flashDefs, flashG, glide, inset, kid, kidG, makeScene, T, tangents, type Api, type V } from './co2-kit';
import type { Beat, Cite, Staging, StageKey } from './types';

const P = 'c4s';

/* ---------------------------------------------------------------- captions */

const SAGE12: Cite = { label: 'Sage, Sage & Kocacinar 2012, Annu. Rev. Plant Biol.', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' };
const RAWS88: Cite = { label: 'Rawsthorne et al. 1988, Planta', url: 'https://doi.org/10.1007/BF00401016' };
const KEER14: Cite = { label: 'Keerberg et al. 2014, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/eru239' };
const HS66: Cite = { label: 'Hatch & Slack 1966, Biochem. J.', url: 'https://doi.org/10.1042/bj1010103' };
const VC21: Cite = { label: 'von Caemmerer 2021, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erab266' };

const BEATS: Beat[] = [
  { tag: 'C₂ leaf', say: 'In a C₂ leaf, glycine from the mesophyll crosses into the bundle sheath and gives up its CO₂ beside RuBisCO. It brings only a little CO₂: glycine comes from photorespiration alone.', cite: [RAWS88, KEER14] },
  { tag: 'PEPC', say: 'In a C₄ leaf, the mesophyll fixes carbon with PEP carboxylase (PEPC) instead of RuBisCO. PEPC adds HCO₃⁻, and never O₂, to PEP: a C₄ acid, which takes the glycine’s place in the plasmodesmata.', cite: [HS66, SAGE12] },
  { tag: 'A CO₂ pump', say: 'In the bundle sheath, each C₄ acid releases its CO₂ beside RuBisCO. All the carbon the mesophyll fixes comes this way, far more than glycine brought, so RuBisCO rarely binds O₂: little 2-PG is made.', cite: [VC21, KEER14] },
  { tag: 'Evolution', say: 'C₄ photosynthesis arose from C₃ more than 60 times, through C₂ steps. <b>A cactus keeps its stomata shut on a hot day: how does it get its CO₂?</b>', cite: [SAGE12] },
];

/* ---------------------------------------------------------------- glyphs, as anim/dk-rf6.ts (R = 11, no numbers) */

const R11 = 11, ST = 2.15 * R11;
const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG (P end, red glow) or glycine (N end): a 2-C body, C at −ST and 0, the end atom at +ST. */
const pgG = `<ellipse rx="44" ry="26" fill="url(#${P}-red)"/><ellipse rx="40" ry="24" fill="url(#${P}-red)"/>${bond(0, ST)}${atomBall(ST, 0, 'P', R11)}${row(-ST / 2, 0, 'CC', { r: R11 })}`;
const glyG = `${bond(0, ST)}${atomBall(ST, 0, 'N', R11)}${row(-ST / 2, 0, 'CC', { r: R11 })}`;
/** HCO₃⁻: a C with 3 O, one of them carrying the H (as anim/c4-kranz.ts). */
const hco3G = (r = R11): string => `<circle class="atom atom-H" cx="${f(-1.7 * r)}" cy="${f(-1.55 * r)}" r="${f(r * 0.56)}"/>
  <circle class="atom atom-O" cx="${f(-1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/><circle class="atom atom-O" cx="${f(1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/>
  <circle class="atom atom-O" cx="0" cy="${f(1.3 * r)}" r="${r}"/><circle class="atom atom-C" r="${r}"/>`;
const carb = (s: string): string => row(0, 0, s, { r: R11 });

/* ---------------------------------------------------------------- the photos (stage units; each fills x 0–1000) */

/** C₂ (Homolepis): the lens on the bundle-sheath/mesophyll wall right of the vein, the ring of bundle-sheath cells. */
const L2: V = [768, 432];
const RING2 = `<ellipse cx="488" cy="414" rx="294" ry="240" style="fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6" opacity=".85"/>`;
/** C₄ (maize): the lens, the wreath of bundle-sheath cells and the one bundle-sheath cell the lens is on. */
const L4: V = [752, 386];
const RING4 = `<ellipse cx="476" cy="385" rx="285" ry="215" style="fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6" opacity=".85"/>
  <ellipse cx="656" cy="382" rx="98" ry="110" style="fill:none;stroke:#8f7a3e;stroke-width:2.4;stroke-dasharray:6 4"/>`;
const lensG = (l: V): string => `<path class="co2k-tan" d="${tangents(l, 30, C, R)}"/><circle class="co2k-lens" cx="${l[0]}" cy="${l[1]}" r="30"/>`;
/** The photo's tag (top left), as c2-kranz.ts's pill. */
const pill = (s: string, w: number): string => `<rect x="14" y="14" width="${w}" height="34" rx="17" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>${T(14 + w / 2, 37, s, 'co2k-ilb')}`;
/** The evolution strip in the pill's place: C₃ → C₂ → C₄, the C₄ step lit. */
const EVO = `<rect x="14" y="12" width="232" height="44" rx="22" style="fill:#fffdf8;stroke:#2f6f5f;stroke-width:1.8"/>
  <text class="co2k-zl cel-halo" x="130" y="42" text-anchor="middle" style="font-size:24px"><tspan style="fill:#aeaba1">C₃ → C₂ → </tspan><tspan style="fill:#141413">C₄</tspan></text>`;

/* ---------------------------------------------------------------- the magnifier (as c2-kranz.ts) */

const C: V = [1292, 372], R = 268;
/** The wall between the 2 cells (a little right of the middle: the bundle-sheath chloroplast needs room for the crowd). */
const XW = 1312, W0 = XW - 20, W1 = XW + 20, PM_B = W0 - 7, PM_M = W1 + 7, PDY = C[1] + 10;
const top = C[1] - R, bot = C[1] + R, x0 = C[0] - R, x1 = C[0] + R;
/** The mesophyll cell's far wall (its middle), gently bowed out; the air space beyond it. */
const farX = (y: number): number => 1516 - 14 * ((y - C[1]) / R) ** 2;
const band = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${top}" width="${f(b - a)}" height="${2 * R}"/>`;
const pmV = (x: number): string => bilayer([{ L: [x, top, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, bot] }], 6, 1.6, 4.2);
const fibres = (x: number, skip: (y: number) => boolean): string => Array.from({ length: 22 }, (_, i) => { const y = top + 12 + i * 25; return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f(x + (i % 3) * 7)},${y}q5,7 0,14t0,14"/>`; }).join('');
const granum = (x: number, y: number, w: number, n = 3): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
const img = (href: string, c: V, w: number, ar: number, k = ''): string => `<image${k ? ` data-k="${k}"` : ''} href="${href}" x="${f(c[0] - w / 2)}" y="${f(c[1] - (w * ar) / 2)}" width="${w}" height="${f(w * ar)}"/>`;
const RUB_AR = 471 / 548, GDC_AR = 222 / 302, PEPC_AR = 517 / 608;
function mito(c: V, rx: number, ry: number, folds: number[], fl: number): string {
  const ri = rx - 9, qi = ry - 9;
  const cr = folds.map((u, i) => {
    const x = c[0] + u * ri, h = qi * Math.sqrt(1 - u * u), s = i % 2 ? 1 : -1, y0 = c[1] + s * (h - 1);
    return bilayer([{ L: [x, y0, x, y0 - s * fl] }], 3.4, 1.2, 3.2);
  }).join('');
  return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${ri}" ry="${qi}" style="fill:#f8e4d8"/>${bilayerE(c[0], c[1], rx, ry, 3.6)}${bilayerE(c[0], c[1], ri, qi, 3.6)}${cr}`;
}

/** Bundle-sheath chloroplast, its RuBisCO, the 2-PG; the mitochondrion below with glycine decarboxylase. */
const BCP: V = [1160, 290], BRX = 106, BRY = 130, RUB: V = [1160, 264], RUB_W = 86;
const PG: V = [1116, 388];
const BMT: V = [1152, 500], BGDC: V = [1126, 500];
/** Mesophyll: chloroplast and its RuBisCO, PEPC with PEP docked, the mitochondrion. */
const MCP: V = [1424, 222], MRX = 46, MRY = 66;
const PEPC: V = [1414, 424], PEPC_W = 100;
const PEP: V = [1400, 376];
const MMT: V = [1424, 546];

/** Where the CO₂ characters are caught round RuBisCO: the glycine's (on top), then the C₄ acids', farthest first so that
 *  no path crosses a seated one. */
const SEAT: V[] = [[1160, 206], [1234, 264], [1092, 266], [1226, 322], [1098, 322], [1160, 324]];
/** Glycine: from the mesophyll (where PEPC will sit) through the plasmodesma into the bundle-sheath mitochondrion. */
const GLY: V[] = [[1404, 422], [1366, 400], [PM_M + 6, PDY], [XW, PDY], [PM_B - 6, PDY], [1244, 396], [1222, 446], [1182, 500]];
/** Its CO₂, from glycine decarboxylase up the right side into the chloroplast, round RuBisCO to the top. */
const CO2_G: V[] = [[1170, 494], [1216, 452], [1244, 392], [1246, 316], [1236, 236], [1200, 208], SEAT[0]];
/** HCO₃⁻ from the far side of the mesophyll cell into PEPC, to the PEP. */
const HCO3: V[] = [[1470, 320], [1466, 348], [1454, 372]];
/** The C₄ acid: from PEPC into the plasmodesma (beat 2); on into the chloroplast to where it releases its CO₂ (beat 3). */
const DROP: V = [1202, 358];
const ACID_PD: V[] = [PEP, [1366, 384], [PM_M + 4, PDY], [XW, PDY]];
const ACID_IN: V[] = [[XW, PDY], [PM_B - 4, PDY], [1250, 378], DROP];
const ACID_ALL: V[] = [PEP, [1366, 384], [PM_M + 4, PDY], [XW, PDY], [PM_B - 4, PDY], [1250, 378], DROP];
/** The released CO₂ leaves from the acid's end nearest RuBisCO; the 3-C rest stays a moment and fades. */
const KID0: V = [DROP[0] - 1.5 * ST, DROP[1]], REST: V = [DROP[0] + 0.5 * ST, DROP[1]];
const TO_SEAT: V[][] = [[], [KID0, [1214, 340], [1238, 302], SEAT[1]], [KID0, [1122, 344], [1090, 306], SEAT[2]],
  [KID0, [1198, 334], SEAT[3]], [KID0, [1130, 334], SEAT[4]], [KID0, SEAT[5]]];

function magnifier(): string {
  const far = Array.from({ length: 41 }, (_, i) => top + (i * 2 * R) / 40);
  const wallFar = `<path class="co2k-wallb" d="M${far.map(y => `${f(farX(y) - 8)},${f(y)}`).join('L')}L${far.slice().reverse().map(y => `${f(farX(y) + 8)},${f(y)}`).join('L')}Z"/>`;
  const air = `<path class="co2k-ias" d="M${far.map(y => `${f(farX(y) + 8)},${f(y)}`).join('L')}L${x1 + 4},${bot}L${x1 + 4},${top}Z"/>`;
  const pmFar = bilayer(far.slice(0, -1).map((y, i) => ({ L: [farX(y) - 15, y, farX(far[i + 1]) - 15, far[i + 1]] as [number, number, number, number] })), 6, 1.6, 4.2);
  const fibFar = Array.from({ length: 22 }, (_, i) => { const y = top + 12 + i * 25; return `<path class="co2k-fib" d="M${f(farX(y + 7) - 3)},${y}q4,7 0,14t0,14"/>`; }).join('');
  const pd = `<rect x="${W0 - 1}" y="${PDY - 15}" width="${W1 - W0 + 2}" height="30" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_B, PDY - 15, PM_M, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [PM_B, PDY + 15, PM_M, PDY + 15] }], 5, 1.5, 4)}
    <path d="M${PM_B - 4},${PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>`;
  const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', cls = 'co2k-il cel-halo'): string => T(x, y, s, cls, a);
  // the bundle-sheath chloroplast: stroma, the CO₂ glow, the double envelope, grana, RuBisCO
  const bsCp = `<ellipse class="co2k-strm" cx="${BCP[0]}" cy="${BCP[1]}" rx="${BRX}" ry="${BRY}"/>
    <ellipse data-k="${P}-glow" data-actor="1" display="none" cx="${BCP[0]}" cy="${BCP[1]}" rx="${BRX}" ry="${BRY}" fill="url(#${P}-glowg)"/>
    ${bilayerE(BCP[0], BCP[1], BRX, BRY, 4)}${bilayerE(BCP[0], BCP[1], BRX + 11, BRY + 11, 4)}
    ${granum(1220, 200, 24)}${granum(1104, 212, 22)}${img(rubPng, RUB, RUB_W, RUB_AR)}`;
  // the mesophyll chloroplast (its RuBisCO keyed: it fades in the C₄ leaf)
  const mCp = `<ellipse class="co2k-strm" cx="${MCP[0]}" cy="${MCP[1]}" rx="${MRX}" ry="${MRY}"/>${bilayerE(MCP[0], MCP[1], MRX, MRY, 4)}${bilayerE(MCP[0], MCP[1], MRX + 11, MRY + 11, 4)}
    ${granum(MCP[0], 168, 30)}${granum(MCP[0], 256, 30)}${img(rubPng, MCP, 58, RUB_AR, `${P}-mrub`)}`;
  const cross = `<path d="M${MMT[0] - 22},${MMT[1] - 18}L${MMT[0] + 22},${MMT[1] + 18}M${MMT[0] + 22},${MMT[1] - 18}L${MMT[0] - 22},${MMT[1] + 18}" style="fill:none;stroke:#b0431f;stroke-width:3.4;stroke-linecap:round"/>`;
  return `${band(x0, W0, 'co2k-cyt')}${band(W0, W1, 'co2k-wallb')}${band(W1, x1, 'co2k-cyt')}${air}${wallFar}
    ${fibres(W0 + 8, y => Math.abs(y - PDY) < 26)}${fibFar}${pmV(PM_B)}${pmV(PM_M)}${pmFar}${pd}
    ${bsCp}${mito(BMT, 68, 36, [-0.86, -0.7, 0.5, 0.84], 12)}${img(gdcPng, BGDC, 52, GDC_AR)}
    ${mCp}${mito(MMT, 48, 30, [-0.8, -0.6, 0.6, 0.8], 9)}<g opacity=".28">${img(gdcPng, MMT, 42, GDC_AR)}</g>${cross}
    ${lab(RUB[0], 184, 'RuBisCO')}${lab(1102, 560, 'glycine decarboxylase', 'start')}
    ${lab(XW, 434, 'plasmodesma')}${lab(XW, bot - 30, 'cell wall')}
    ${actor(`${P}-pg`, `<g transform="translate(${PG[0]} ${PG[1]})">${pgG}</g>${T(PG[0] - 42, PG[1] + 6, '2-PG', 'cel-mn cel-halo', 'end')}`)}
    ${actor(`${P}-pepc`, `${img(pepcPng, PEPC, PEPC_W, PEPC_AR)}${lab(PEPC[0], PEPC[1] + 60, 'PEPC')}`)}
    ${actor(`${P}-pep`, carb('CCCP'))}${actor(`${P}-pepl`, T(PEP[0], PEP[1] - 22, 'PEP', 'cel-mn cel-halo'))}
    ${actor(`${P}-hco3`, hco3G())}${actor(`${P}-hco3l`, T(0, 42, 'HCO₃⁻', 'cel-mn cel-halo'))}
    ${actor(`${P}-gly`, `${glyG}${T(0, -22, 'glycine', 'cel-mn cel-halo')}`)}
    ${actor(`${P}-acid`, carb('CCCC'))}${actor(`${P}-acidl`, T(0, -22, 'C₄ acid', 'cel-mn cel-halo'))}
    ${actor(`${P}-rest`, carb('CCC'))}
    ${actor(`${P}-fl`, flashG(P, 30))}
    ${SEAT.map((_, i) => kidG(`${P}-k${i}`, R11, i === 0 ? 'CO₂' : '')).join('')}`;
}

/* ---------------------------------------------------------------- timing (s) */

/** Beat 1: the magnifier; the glycine (hold); its CO₂ to RuBisCO; the faint glow. */
const B1 = { mag: [0.1, 0.6], gIn: [0.9, 1.2], gGo: [1.3, 4.5], hold: 4.7, fl: 5.0, kGo: [5.3, 7.5], glow: [7.7, 8.5] };
/** Beat 2: the photo turns (hold); RuBisCO out of the mesophyll, PEPC in; HCO₃⁻ into PEPC, the C₄ acid (hold); into the
 *  plasmodesma. */
const B2 = { photo: [0.2, 1.4], hold1: 1.6, mrub: [1.7, 2.3], pepc: [2.4, 3.0], hIn: [3.2, 3.5], hGo: [3.8, 5.0], swap: [5.0, 5.4], hold2: 5.6, aGo: [5.7, 7.5] };
/** Beat 3: the first acid into the chloroplast, its CO₂ caught (hold); 4 more, one after another; the bright glow (hold);
 *  the 2-PG fades. */
const B3 = { aGo: [0.2, 2.0], fl: 2.1, kGo: [2.4, 3.3], hold1: 3.5 };
/** The 4 C₄ acids that follow (kids 2–5): each acid's glide, then its CO₂'s glide to the seat (longer for a farther seat). */
const KID_D = [0.7, 0.45, 0.45, 0.35];
const STREAM = KID_D.reduce<Array<{ s: number; e: number; k0: number; k1: number }>>((acc, d) => {
  const s = acc.length ? acc[acc.length - 1].k1 + 0.1 : 3.7, e = s + 0.95;
  return [...acc, { s, e, k0: e + 0.1, k1: e + 0.1 + d }];
}, []);
const S_END = STREAM[STREAM.length - 1].k1;
const B3b = { glow: [S_END + 0.1, S_END + 0.9], hold2: S_END + 1.1, pg: [S_END + 1.2, S_END + 2.0] };
const B4 = { evo: [0.2, 0.8] };

/* ---------------------------------------------------------------- the frame */

/** A CO₂ character from the acid's end to its seat: neutral on the way, glad once caught. */
function catchKid(a: Api, i: number, t: number, t0: number, t1: number): void {
  const p = t < t1 ? glide(TO_SEAT[i], t, t0, t1) : SEAT[i];
  kid(a, `${P}-k${i}`, p, ease(t, t0 - 0.3, t0), { h: ease(t, t1 - 0.2, t1 + 0.2) });
}
/** Kids 0…n−1 seated and glad. */
const seated = (a: Api, n: number): void => { for (let i = 0; i < n; i++) kid(a, `${P}-k${i}`, SEAT[i], 1, { h: 1 }); };

const KEYS: StageKey[] = [
  { beat: 3, text: 'A cactus keeps its stomata shut on a hot day:', x: 800, y: 50, size: 44 },
  { beat: 3, text: 'how does it get its CO₂?', x: 800, y: 112, size: 44 },
];

export const STAGING: Staging = {
  ...makeScene({
    id: 'c4s', name: 'c4s · From C₂ to C₄: one CO₂ with glycine, many with the C₄ acid', beats: BEATS,
    holds: [[B1.hold], [B2.hold1, B2.hold2], [B3.hold1, B3b.hold2], []],
    note: 'The C₂ micrograph and magnifier again: a glycine brings one CO₂ character into the bundle sheath, caught by RuBisCO; the photo turns to maize; PEPC (3ZGE) takes RuBisCO’s place in the mesophyll and its C₄ acid the glycine’s place in the plasmodesma; C₄ acids bring a crowd of CO₂ to RuBisCO, the stroma glows, the 2-PG fades; the evolution strip C₃ → C₂ → C₄',
    svg: () => {
      const m = inset(P, `${P}-in`, L2, 30, C, R, magnifier());
      return `<defs>${flashDefs(P)}<radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
          <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".62"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".34"/><stop offset="1" stop-color="#f6c453" stop-opacity=".12"/></radialGradient></defs>
        ${actor(`${P}-ph2`, `<image href="${homJpg}" x="0" y="0" width="1000" height="740" preserveAspectRatio="none"/>${RING2}
          ${T(500, 420, 'vein', 'co2k-zl cel-halo')}${T(292, 452, 'bundle sheath', 'co2k-zl cel-halo')}${T(872, 238, 'mesophyll', 'co2k-zl cel-halo')}
          ${T(992, 732, '<tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr cel-halo', 'end')}`)}
        ${actor(`${P}-ph4`, `<image href="${zeaJpg}" x="0" y="0" width="1000" height="740" preserveAspectRatio="none"/>${RING4}
          ${T(482, 404, 'vein', 'co2k-zl cel-halo')}${T(476, 642, 'bundle sheath', 'co2k-zl cel-halo')}${T(905, 540, 'mesophyll', 'co2k-zl cel-halo')}
          ${T(992, 732, 'maize (C₄): Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr cel-halo', 'end')}`)}
        ${m.lens}${actor(`${P}-lens4`, lensG(L4))}${m.box}
        ${actor(`${P}-hd`, `${T(1160, 92, 'bundle-sheath cell', 'co2k-zl')}${T(1424, 92, 'mesophyll cell', 'co2k-zl')}`)}
        ${actor(`${P}-tag2`, pill('C₂ leaf', 96))}${actor(`${P}-tag4`, pill('C₄ leaf', 96))}${actor(`${P}-evo`, EVO)}
        ${T(1596, 714, 'RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC', 'co2k-cr', 'end')}
        ${actor(`${P}-crP`, T(1596, 732, 'PEPC: PDB 3ZGE (Paulus et al. 2013)', 'co2k-cr', 'end'))}`;
    },
    frame(a, beat, t) {
      const at = (b: number, t0: number, t1: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t1) : 0);
      // the photos and lenses: C₂ in beat 1, cross-fading to maize at the start of beat 2
      const ph = at(1, B2.photo[0], B2.photo[1]);
      a.op(`${P}-ph2`, 1 - ph); a.op(`${P}-ph4`, ph);
      const mag = at(0, B1.mag[0], B1.mag[1]);
      a.op(`${P}-in`, mag); a.op(`${P}-hd`, mag);
      a.op(`${P}-in-lens`, mag * (1 - ph)); a.op(`${P}-lens4`, ph);
      const evo = at(3, B4.evo[0], B4.evo[1]);
      a.op(`${P}-tag2`, mag * (1 - ph)); a.op(`${P}-tag4`, ph * (1 - evo)); a.op(`${P}-evo`, evo);
      // the mesophyll's RuBisCO fades and PEPC comes (beat 2 on); the 2-PG fades at the end of beat 3
      a.op(`${P}-mrub`, 1 - at(1, B2.mrub[0], B2.mrub[1]));
      const pepc = at(1, B2.pepc[0], B2.pepc[1]);
      a.op(`${P}-pepc`, pepc); a.op(`${P}-crP`, pepc);
      a.op(`${P}-pg`, mag * (1 - 0.85 * at(2, B3b.pg[0], B3b.pg[1])));
      // the glow in the bundle-sheath stroma: faint with glycine's CO₂, bright with the C₄ acids'
      a.op(`${P}-glow`, 0.38 * at(0, B1.glow[0], B1.glow[1]) + 0.62 * at(2, B3b.glow[0], B3b.glow[1]));

      if (beat === 0) {
        // the glycine crosses into the bundle-sheath mitochondrion; there it gives up its CO₂, which goes to RuBisCO
        const g = glide(GLY, t, B1.gGo[0], B1.gGo[1]);
        a.put(`${P}-gly`, g, ease(t, B1.gIn[0], B1.gIn[1]) * (1 - ease(t, B1.fl - 0.1, B1.fl + 0.3)));
        flash(a, t, B1.fl, GLY[GLY.length - 1], `${P}-fl`);
        const k = t < B1.kGo[1] ? glide(CO2_G, t, B1.kGo[0], B1.kGo[1]) : SEAT[0];
        kid(a, `${P}-k0`, k, ease(t, B1.fl - 0.1, B1.fl + 0.2), { h: ease(t, B1.kGo[1] - 0.2, B1.kGo[1] + 0.2), lab: 1 - ease(t, B1.kGo[1] - 0.8, B1.kGo[1] - 0.4) });
        return;
      }
      if (beat === 1) {
        seated(a, 1);
        // HCO₃⁻ into PEPC, onto the PEP: the C₄ acid; then into the plasmodesma
        a.put(`${P}-pep`, PEP, pepc * (1 - ease(t, B2.swap[0], B2.swap[1])));
        a.op(`${P}-pepl`, pepc * (1 - ease(t, B2.swap[0], B2.swap[1])));
        const h = glide(HCO3, t, B2.hGo[0], B2.hGo[1]), ho = ease(t, B2.hIn[0], B2.hIn[1]);
        a.put(`${P}-hco3`, h, ho * (1 - ease(t, B2.swap[0], B2.swap[1])));
        a.put(`${P}-hco3l`, h, ho * (1 - ease(t, B2.hGo[1] - 0.6, B2.hGo[1] - 0.2)));
        const q = glide(ACID_PD, t, B2.aGo[0], B2.aGo[1]), o = ease(t, B2.swap[0] + 0.1, B2.swap[1] + 0.1);
        a.put(`${P}-acid`, q, o); a.put(`${P}-acidl`, q, o);
        return;
      }
      if (beat === 2) {
        seated(a, 1);
        // the first C₄ acid on into the chloroplast; it releases its CO₂, which RuBisCO catches; the rest fades
        if (t < STREAM[0].s) {
          const q = glide(ACID_IN, t, B3.aGo[0], B3.aGo[1]);
          a.put(`${P}-acid`, q, 1 - ease(t, B3.fl - 0.05, B3.fl + 0.25)); a.put(`${P}-acidl`, q, 1 - ease(t, B3.aGo[1] - 0.4, B3.aGo[1]));
          a.put(`${P}-rest`, REST, ease(t, B3.fl - 0.05, B3.fl + 0.25) * (1 - ease(t, B3.fl + 0.8, B3.fl + 1.3)));
        }
        flash(a, t, B3.fl, KID0, `${P}-fl`);
        if (t > B3.fl - 0.3) catchKid(a, 1, t, B3.kGo[0], B3.kGo[1]);
        // 4 more, one after another: each C₄ acid from PEPC to the chloroplast, its CO₂ to a seat at RuBisCO
        STREAM.forEach(({ s, e, k0, k1 }, j) => {
          if (t >= s - 0.2 && t < e + 0.5) {
            a.put(`${P}-acid`, glide(ACID_ALL, t, s, e), ease(t, s - 0.2, s) * (1 - ease(t, e, e + 0.2)));
            a.put(`${P}-rest`, REST, ease(t, e, e + 0.2) * (1 - ease(t, e + 0.3, e + 0.5)));
          }
          flash(a, t, e + 0.05, KID0, `${P}-fl`);
          if (t > e - 0.2) catchKid(a, j + 2, t, k0, k1);
        });
        return;
      }
      seated(a, SEAT.length);
    },
  }),
  keys: KEYS,
};
