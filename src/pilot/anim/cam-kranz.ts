// 'lf13', staging camk · CAM (slide C13) in the micrograph-and-magnifier style of anim/c4-style.ts and c4-kranz.ts: a
// real micrograph as the scene, a lens on the place that matters, and a round magnifier drawn with the deck's kit
// (bilayers, real protein structures, atom-ball molecules). One fixed framing; one thing moves at a time; eased glides.
// The essence (lecturer, 29 Oct 2026): take CO₂ in at night and store it, then use it by day with the stomata shut. The
// hero is slide 19's CO₂ character (co2-kit kidG/kid): it slips in through the open stoma at night, becomes HCO₃⁻ and,
// at PEPC, the fourth carbon of a C₄ acid; it sleeps in the vacuole as malic acid (its face on that carbon), wakes at
// dawn, and is freed as CO₂ to RuBisCO while the stoma stays shut.
// - The scene: a succulent leaf in cross-section, 400×: the cuticle and epidermis with one stoma (2 guard cells), the
//   substomatal cavity, mesophyll cells with chloroplasts along the wall round a large vacuole (Berkshire Community
//   College Bioscience Image Library, "Stoma and guard cells in succulent xerophyte leaf", Wikimedia Commons, CC0; the
//   3264 × 1840 original turned 8.1° clockwise so the epidermis lies level, cut to x 1150–3196, y 40–1554, the 2 small
//   corners the turn left blank filled with the air colour next to them, scaled to 1000 × 740; no letters to remove).
//   The species is not given by the library.
// - The lens: on the stoma and the corner of the mesophyll cell right of the substomatal cavity.
// - The magnifier, top to bottom: the outside air, the epidermis with the stoma (its guard cells open and close), the
//   air space, the cell wall and plasma membrane (bilayer), the cytosol with PEPC (PDB 3ZGE, as on the C₄ slide) and PEP
//   docked on it, a chloroplast (double envelope, grana, RuBisCO: PDB 8RUC), the large vacuole (its membrane, the
//   tonoplast, a bilayer), which turns acid as malic acid fills it.
// - Beats: 1 the parts named on the photo, one at a time, then the lens and the magnifier (nothing moves); 2 night (a
//   soft dark veil, a moon on a paper pill): the stoma opens | the CO₂ comes in → HCO₃⁻ → PEPC → C₄ acid → malic acid in
//   the vacuole, where it falls asleep | the vacuole fills; 3 day (the veil lifts, a sun): the stoma closes | the malic
//   acid wakes, leaves the vacuole and releases the CO₂ | the CO₂ goes to RuBisCO, the vacuole empties; the question.
// The shared parts (captions, glyphs, the cell's motion as a function of each step's time) are exported for cam-clock.ts.
import sucJpg from '../../assets/photos/c13-cam-succulent.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, rowWidth } from '../figs/carbon-form';
import { bilayer } from '../figs/cell-schema';
import {
  actor, bilayerE, bilayerH, carbG, clamp, ease, f, flash, flashDefs, flashG, glide, inset, kid, kidG, lerp, makeScene,
  sunG, T, tickG, type Api, type V,
} from './co2-kit';
import type { Beat, Cite, Staging, StageKey } from './types';

/* ================================================================ captions (both stagings) */

const WS22: Cite = { label: 'Winter & Smith 2022, New Phytol.', url: 'https://doi.org/10.1111/nph.17790' };
const BOR09: Cite = { label: 'Borland et al. 2009, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erp118' };

/** The closing question, leading to the next slide (efficiency of the photosynthesis types). */
export const CAM_Q = 'Which type turns the most sunlight into biomass?';

export const CAM_BEATS: Beat[] = [
  { tag: 'Succulent leaf', say: 'Under the epidermis with its stomata lie mesophyll cells whose large vacuole fills most of the cell; their chloroplasts line the wall.', cite: [WS22] },
  { tag: 'Night: stomata open', say: 'At night the stomata open. PEPC fixes the CO₂ that enters, as HCO₃⁻, into a C₄ acid, which is stored as malic acid in the vacuole: by dawn the cell is far more acidic.', cite: [WS22] },
  { tag: 'Day: stomata closed', say: `By day the stomata close to save water. Malic acid leaves the vacuole and releases its CO₂ to RuBisCO in the same cell: CAM separates the 2 steps in time, C₄ in space. Per CO₂ fixed, CAM plants lose far less water. <b>${CAM_Q}</b>`, cite: [BOR09, WS22] },
];

/* ================================================================ glyphs */

/** HCO₃⁻: a C with 3 O, one of them carrying the H (as on the C₄ slide, c4-kranz.ts). */
export const hco3G = (r = 11): string => `<circle class="atom atom-H" cx="${f(-1.7 * r)}" cy="${f(-1.55 * r)}" r="${f(r * 0.56)}"/>
  <circle class="atom atom-O" cx="${f(-1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/><circle class="atom atom-O" cx="${f(1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/>
  <circle class="atom atom-O" cx="0" cy="${f(1.3 * r)}" r="${r}"/><circle class="atom atom-C" r="${r}"/>`;

/** The CO₂ character's face on a C ball of radius r at the origin: awake (`${k}-aw`) and asleep (`${k}-as`). */
function faceG(k: string, r: number): string {
  const R = (v: number): string => f(v * r), w = f(Math.max(1.4, r * 0.12));
  const p = (d: string): string => `<path class="co2k-face" d="${d}" style="stroke-width:${w}px"/>`;
  const er = f(Math.max(1.5, r * 0.13));
  const awake = `<circle class="co2k-eye" cx="${R(-0.36)}" cy="${R(-0.16)}" r="${er}"/><circle class="co2k-eye" cx="${R(0.36)}" cy="${R(-0.16)}" r="${er}"/>`
    + `<path class="co2k-mouth" d="M${R(-0.34)},${R(0.2)}Q0,${R(0.64)} ${R(0.34)},${R(0.2)}Z"/>`;
  const asleep = p(`M${R(-0.56)},${R(-0.16)}Q${R(-0.36)},${R(0.08)} ${R(-0.16)},${R(-0.16)}M${R(0.16)},${R(-0.16)}Q${R(0.36)},${R(0.08)} ${R(0.56)},${R(-0.16)}`)
    + p(`M${R(-0.14)},${R(0.36)}Q0,${R(0.46)} ${R(0.14)},${R(0.36)}`);
  return `<g data-k="${k}-aw">${awake}</g><g data-k="${k}-as">${asleep}</g>`;
}
/** Two small z's above a sleeping face (`${k}-z`). */
const zzG = (k: string, r: number): string => `<g data-k="${k}-z">${T(r * 1.05, -r * 1.05, 'z', 'co2k-il', 'start', ' style="font-size:14px;font-style:italic;fill:#5d6a8f"')}${T(r * 1.75, -r * 1.85, 'z', 'co2k-il', 'start', ' style="font-size:17px;font-style:italic;fill:#5d6a8f"')}</g>`;

/** The hero as HCO₃⁻: the CO₂ character's face on the C. */
const heroHco3G = (k: string, r: number): string => actor(k, `${hco3G(r)}${faceG(k, r)}`);
/** The hero as a C₄ acid (malic acid in the vacuole): carbG('CCCC') with the face on the fourth carbon, the one that
 *  came from HCO₃⁻; its letter left off so the face shows. Returns the actor and where that carbon sits. */
function heroAcidG(k: string, r: number): { g: string; dx: number } {
  const w = rowWidth(4, r), st = r * 2.15, x0 = -w / 2 + r, x3 = x0 + 3 * st;
  const cap = `<rect class="dk-cap" x="${f(-w / 2 - 5)}" y="${f(-r - 5)}" width="${f(w + 10)}" height="${f(2 * r + 10)}" rx="${f(r + 5)}"/>`;
  const bond = `<path d="M${f(x0)},0H${f(x3)}" style="stroke:#6b6a64;stroke-width:${f(Math.max(1.6, r * 0.22))};fill:none"/>`;
  const balls = [0, 1, 2].map(i => atomBall(x0 + i * st, 0, 'C', r)).join('') + atomBall(x3, 0, 'C', r).replace(/<text[\s\S]*?<\/text>/, '');
  return { g: actor(k, `${cap}${bond}${balls}<g transform="translate(${f(x3)} 0)">${faceG(k, r)}${zzG(k, r)}</g>`), dx: x3 };
}

/** A guard cell's outline: its outer side at xo, its pore side at xi (both stage x), between y0 and y1. */
function guardPath(xo: number, xi: number, y0: number, y1: number): string {
  const s = Math.sign(xi - xo), h = y1 - y0, rr = Math.min(22, h / 2 - 2), b = 4 * s; // b: the pore side bulges gently into the pore
  return `M${f(xo + s * rr)},${f(y0)}H${f(xi - s * 6)}Q${f(xi + b)},${f(y0 + h / 2)} ${f(xi - s * 6)},${f(y1)}H${f(xo + s * rr)}Q${f(xo)},${f(y1)} ${f(xo)},${f(y1 - rr)}V${f(y0 + rr)}Q${f(xo)},${f(y0)} ${f(xo + s * rr)},${f(y0)}Z`;
}

/** A chloroplast: stroma, its double envelope (2 bilayers), grana and, optionally, RuBisCO (image width rw at rub). */
export function chloroplastG(c: V, rx: number, ry: number, grana: V[], gw: number, rub?: { at: V; w: number }): string {
  const gr = grana.map(([gx, gy]) => [0, 1, 2].map(i => `<rect class="cel-lumen" x="${f(gx - gw / 2)}" y="${f(gy + i * 8.5 - 12)}" width="${f(gw)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('')).join('');
  const im = rub ? `<image href="${rubPng}" x="${f(rub.at[0] - rub.w / 2)}" y="${f(rub.at[1] - (rub.w * 471) / 548 / 2)}" width="${rub.w}" height="${f((rub.w * 471) / 548)}"/>` : '';
  return `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4)}${gr}${im}`;
}
/** PEPC (PDB 3ZGE render) with its top-left corner at (x, y), width w. */
export const pepcG = (x: number, y: number, w: number): string => `<image href="${pepcPng}" x="${f(x)}" y="${f(y)}" width="${w}" height="${f((w * 517) / 608)}"/>`;
/** The vacuole: its sap, an acid tint over it (keyed `${k}`, shown as malic acid fills it) and the tonoplast (bilayer). */
export const vacuoleG = (k: string, c: V, rx: number, ry: number): string => `<ellipse class="co2k-vac" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}" style="fill:#edf1f5;stroke:none"/>
  <ellipse data-k="${k}" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}" style="fill:#f3b49b" opacity="0"/>${bilayerE(c[0], c[1], rx, ry, 4)}`;
/** The paper pill with the moon ("night") or the sun ("day"), centred at c. */
export function timePill(k: string, c: V): string {
  const [x, y] = c, pill = `<rect x="${f(x - 58)}" y="${f(y - 17)}" width="116" height="34" rx="17" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>`;
  const moon = `<path d="M${f(x - 30)},${f(y - 11)}A12,12 0 1 0 ${f(x - 25)},${f(y + 10)}A9,9 0 1 1 ${f(x - 30)},${f(y - 11)}Z" style="fill:#c9cfe0;stroke:#6f7896;stroke-width:1.5"/>`;
  return actor(`${k}-n`, `${pill}${moon}${T(x + 12, y + 6, 'night', 'co2k-ilb')}`) + actor(`${k}-d`, `${pill}<g transform="translate(${f(x - 32)} ${f(y)})">${sunG(7)}</g>${T(x + 12, y + 6, 'day', 'co2k-ilb')}`);
}

/* ================================================================ the cell's motion (both stagings) */

/** Where things are in one staging's CAM cell (stage units). */
export interface CamGeo {
  p: string;
  /** The pore's centre; a guard cell's outer side from it; the epidermis's top and bottom. */
  pore: V; gOut: number; epi: [number, number];
  /** The CO₂ from the outside air through the pore and the air space into the cytosol (its last point). */
  kidIn: V[];
  /** HCO₃⁻ from there into PEPC (its last point: the active site); PEP docked on PEPC; the PEP label's offset. */
  hco3: V[]; pep: V;
  /** The C₄ acid from PEP's place into the vacuole (its last point: the hero's place); where along it (0–1) it crosses
   *  the tonoplast. */
  acidIn: V[]; cross: number;
  /** The other malic acids in the vacuole (the night's uptake). */
  others: V[];
  /** By day: the malic acid out of the vacuole (its last point: where it releases the CO₂); the CO₂ to RuBisCO (its
   *  last point: the site). */
  acidOut: V[]; kidFix: V[];
  /** The "fixed" tick. */
  tick: V;
}
/** Step durations (s): 0 nightfall, 1 the CO₂ comes in and is stored, 2 the vacuole fills, 3 daybreak, 4 the malic acid
 *  releases the CO₂, 5 the CO₂ to RuBisCO and the vacuole empties. */
export const camDur = (n: number): number[] => [2.4, 7.4, 0.9 + 0.45 * n, 2.4, 3.5, 3.1 + 0.4 * n];
/** Before a step: −BIG; after it: +BIG. */
export const BIG = 1e6;

const KR = 13, HR = 12, AR = 12, OR = 10;
/** The CO₂ label's offset to the right of the character. */
const KL = 1.7 * KR + KR + 8;
/** The molecules, each an actor drawn at the origin (labels ride with them or are actors of their own). */
export function camActors(G: CamGeo): string {
  const p = G.p, mn = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, 'cel-mn cel-halo', a);
  const acid = heroAcidG(`${p}a`, AR);
  return [
    `<defs>${flashDefs(p)}</defs>`,
    actor(`${p}pep`, `${carbG('CCCP', 8)}${mn(48, 6, 'PEP', 'start')}`),
    ...G.others.map((_, i) => actor(`${p}o${i}`, carbG('CCCC', OR))),
    actor(`${p}pyr`, `${carbG('CCC', OR)}${mn(0, -20, 'pyruvate')}`),
    heroHco3G(`${p}h`, HR), actor(`${p}hl`, mn(0, 0, 'HCO₃⁻', 'start')),
    acid.g, actor(`${p}al4`, mn(0, 0, 'C₄ acid')), actor(`${p}alm`, mn(0, 0, 'malic acid')),
    actor(`${p}tk`, tickG('fixed')),
    actor(`${p}fl`, flashG(p, 30)),
    kidG(`${p}k`, KR, ''), actor(`${p}kl`, mn(0, 0, 'CO₂', 'start')), actor(`${p}kl2`, mn(0, 0, 'CO₂')),
  ].join('');
}
/** Where the hero's fourth carbon sits in the acid (from its centre). */
export const ACID_DX = (() => { const w = rowWidth(4, AR); return -w / 2 + AR + 3 * AR * 2.15; })();
/** Where the freed CO₂ appears, from the acid's centre: just right of the 3 carbons left over (pyruvate). */
export const REL_DX = ACID_DX + 22;

/** The guard cells (keyed paths, `${p}gl`, `${p}gr`, their thick pore-side walls `${p}glw`, `${p}grw`) and their
 *  chloroplasts. */
export function guardMarkup(G: CamGeo): string {
  const p = G.p, [px] = G.pore, [y0, y1] = G.epi, ym = (y0 + y1) / 2;
  const cps = (s: number): string => [[-0.78, -0.3], [-0.62, 0.36], [-0.86, 0.32]].map(([u, v]) => `<ellipse class="co2k-cp" cx="${f(px + s * u * G.gOut)}" cy="${f(ym + v * (y1 - y0) * 0.5)}" rx="5.5" ry="4"/>`).join('');
  return `<path data-k="${p}gl" class="co2k-guard"/><path data-k="${p}gr" class="co2k-guard"/>
    <path data-k="${p}glw" class="co2k-guardw" style="stroke-width:4"/><path data-k="${p}grw" class="co2k-guardw" style="stroke-width:4"/>${cps(1)}${cps(-1)}`;
}
/** Sets the guard cells for an opening `open` (0 shut, 1 open: a pore 30 units wide). */
function setGuard(a: Api, G: CamGeo, open: number): void {
  const p = G.p, [px] = G.pore, [y0, y1] = G.epi, g = lerp(1, 30, open) / 2;
  a.attr(`${p}gl`, 'd', guardPath(px - G.gOut, px - g, y0 + 2, y1 - 2));
  a.attr(`${p}gr`, 'd', guardPath(px + G.gOut, px + g, y0 + 2, y1 - 2));
  a.attr(`${p}glw`, 'd', `M${f(px - g - 4)},${f(y0 + 9)}Q${f(px - g)},${f((y0 + y1) / 2)} ${f(px - g - 4)},${f(y1 - 9)}`);
  a.attr(`${p}grw`, 'd', `M${f(px + g + 4)},${f(y0 + 9)}Q${f(px + g)},${f((y0 + y1) / 2)} ${f(px + g + 4)},${f(y1 - 9)}`);
}

/** Draws the cell for the steps' local times s[0..5] (s: −BIG before a step, +BIG after it). Returns the night's depth
 *  (0 day … 1 night), for the staging's own veils and clock. */
export function camFrame(a: Api, G: CamGeo, s: number[]): number {
  const p = G.p, n = G.others.length, d = camDur(n);
  const [s0, s1, s2, s3, s4, s5] = s;
  const night = ease(s0, 0, 1.0) * (1 - ease(s3, 0, 1.0));
  setGuard(a, G, ease(s0, 1.0, 2.2) * (1 - ease(s3, 1.0, 2.2)));

  // PEP docked on PEPC until the HCO₃⁻ arrives
  a.put(`${p}pep`, G.pep, 1 - ease(s1, 4.3, 4.6));
  // the other malic acids: in one after another (step 2), out one after another (step 5), the last in first out
  G.others.forEach((q, i) => a.put(`${p}o${i}`, q, ease(s2, 0.2 + 0.45 * i, 0.6 + 0.45 * i) * (1 - ease(s5, 2.5 + 0.4 * (n - 1 - i), 2.8 + 0.4 * (n - 1 - i)))));
  // the vacuole turns acid as it fills, and clears as it empties
  const fill = (ease(s1, 6.3, 6.8) + n * ease(s2, 0.2, d[2] - 0.2) - ease(s4, 0.5, 1.9) - n * ease(s5, 2.5, d[5] - 0.2)) / (n + 1);
  a.op(`${p}tint`, 0.62 * clamp(fill));

  const k = `${p}k`, h = `${p}h`, ac = `${p}a`;
  const face = (aw: number): void => { a.op(`${ac}-aw`, aw); a.op(`${ac}-as`, 1 - aw); };
  const labs = (q: V, l4: number, lm: number): void => { a.put(`${p}al4`, [q[0], q[1] - AR - 14], l4); a.put(`${p}alm`, [q[0], q[1] - AR - 14], lm); };
  if (s5 >= 0) {
    // the CO₂ goes into the chloroplast to RuBisCO and is fixed
    const q = glide(G.kidFix, s5, 0.2, 1.6), site = G.kidFix[G.kidFix.length - 1];
    kid(a, k, q, 1 - ease(s5, 1.6, 1.85), { h: 1 });
    a.put(`${p}kl2`, [q[0], q[1] - KR - 14], 1 - ease(s5, 0.9, 1.3));
    flash(a, s5, 1.75, site, `${p}fl`);
    a.put(`${p}tk`, G.tick, ease(s5, 1.9, 2.3));
  } else if (s4 >= 0) {
    // the malic acid wakes, leaves the vacuole and releases the CO₂ (the C₃ acid left over, pyruvate, fades)
    const q = glide(G.acidOut, s4, 0.5, 1.9), end = G.acidOut[G.acidOut.length - 1];
    a.put(ac, q, 1 - ease(s4, 1.95, 2.25)); face(ease(s4, 0, 0.4)); a.op(`${ac}-z`, 1 - ease(s4, 0, 0.4));
    labs(q, 0, 1 - ease(s4, 1.6, 1.9));
    flash(a, s4, 2.05, [end[0] + ACID_DX, end[1]], `${p}fl`);
    kid(a, k, [end[0] + REL_DX, end[1]], ease(s4, 2.0, 2.3), { h: 1 });
    a.put(`${p}kl2`, [end[0] + REL_DX, end[1] - KR - 14], ease(s4, 2.2, 2.5));
    a.put(`${p}pyr`, [end[0] - 0.5 * AR * 2.15, end[1]], ease(s4, 2.0, 2.3) * (1 - ease(s4, 2.9, 3.4)));
  } else if (s1 >= 0) {
    // the CO₂ comes in through the open stoma (it turns to line up with the pore and squeezes through), into the cytosol
    const q = glide(G.kidIn, s1, 0.4, 2.8), stop = G.kidIn[G.kidIn.length - 1];
    const hp = (G.epi[1] - G.epi[0]) / 2, dy = Math.abs(q[1] - G.pore[1]), ip = clamp(1 - (dy - hp + 6) / 16), rot = 90 * clamp(1 - (dy - hp - 4) / 24);
    const below = clamp((q[1] - G.pore[1] - hp) / 30);
    kid(a, k, q, ease(s1, 0, 0.4) * (1 - ease(s1, 2.85, 3.15)), { s: 0.6 * ip, h: below }, 1);
    a.put(`${p}kl`, [q[0] + KL, q[1] + 6], ease(s1, 0, 0.4) * (1 - ease(s1, 1.0, 1.4)));
    a.attr(`${k}-b`, 'transform', `rotate(${rot.toFixed(1)}) scale(${(1 - 0.2 * ip).toFixed(3)} 1)`);
    // with water it becomes HCO₃⁻, which goes into PEPC
    flash(a, s1, 2.95, stop, `${p}fl`);
    const qh = glide(G.hco3, s1, 3.3, 4.3), site = G.hco3[G.hco3.length - 1];
    a.put(h, qh, ease(s1, 2.9, 3.2) * (1 - ease(s1, 4.3, 4.6))); a.op(`${h}-aw`, 1); a.op(`${h}-as`, 0);
    a.put(`${p}hl`, [qh[0] + 2.2 * HR + 4, qh[1] + 6], ease(s1, 3.0, 3.3) * (1 - ease(s1, 3.9, 4.3)));
    // PEPC: HCO₃⁻ + PEP → the C₄ acid, which goes into the vacuole (malic acid there) and falls asleep
    if (s1 > 4.2 && s1 < 4.9) flash(a, s1, 4.45, site, `${p}fl`);
    const u = clamp((s1 - 4.9) / 1.6), qa = glide(G.acidIn, s1, 4.9, 6.5);
    a.put(ac, qa, ease(s1, 4.5, 4.8)); face(1 - ease(s1, 6.6, 7.0)); a.op(`${ac}-z`, ease(s1, 6.9, 7.3));
    const x = ease(u, G.cross - 0.06, G.cross + 0.06);
    labs(qa, ease(s1, 4.5, 4.8) * (1 - x), x);
  }
  return night;
}

/* ================================================================ camk: the micrograph and the magnifier */

const P = 'camk';
/** The lens on the photo (stage units; the photo fills x 0–1000) and the magnifier. */
const LENS: V = [540, 318], LR = 100, C: V = [1292, 372], R = 268;
const top = C[1] - R, x0 = C[0] - R, x1 = C[0] + R;
/** Bands in the magnifier: outside air, the epidermis (cuticle on top), the air space, the cell wall, the plasma
 *  membrane; the cytosol below. */
const Y = { cut: 186, epi1: 246, wall0: 282, wall1: 298, pm: 305 };
const PORE: V = [1240, 216];
/** The cell's parts. */
const PEPC = { x: 1060, y: 318, w: 112 };
const CP: V = [1452, 378], CRX = 88, CRY = 52;
const RUB: V = [1448, 366];
/** The night/day pill, on the magnifier's rim at the upper left (clear of the CO₂'s way in on the right). */
const PILL: V = [1136, 150];
const VAC: V = [1290, 540], VRX = 178, VRY = 88;

const GEO: CamGeo = {
  p: P, pore: PORE, gOut: 58, epi: [Y.cut + 2, Y.epi1],
  kidIn: [[1300, 140], [1272, 150], [1251, 165], [1242, 188], [PORE[0], PORE[1]], [1240, 246], [1243, 268], [1248, 290], [1254, 318], [1258, 342]],
  hco3: [[1258, 342], [1214, 352], [1146, 362]],
  pep: [1198, 396],
  acidIn: [[1198, 396], [1222, 428], [1248, 462], [1272, 496], [1290, 516]], cross: 0.45,
  others: [[1180, 534], [1400, 534], [1236, 576], [1344, 576]],
  acidOut: [[1290, 516], [1296, 480], [1296, 444], [1268, 414]],
  kidFix: [[1268 + REL_DX, 414], [1362, 400], [1392, 384], [1418, 374]],
  tick: [1404, 466],
};

function magnifier(): string {
  const band = (y0: number, y1: number, cls: string): string => `<rect class="${cls}" x="${x0}" y="${f(y0)}" width="${2 * R}" height="${f(y1 - y0)}"/>`;
  // the epidermis: cells either side of the stoma, the cuticle over them (open at the pore)
  const gl = PORE[0] - GEO.gOut, gr = PORE[0] + GEO.gOut;
  const epi = [[x0 - 20, gl - 86], [gl - 82, gl - 4], [gr + 4, gr + 92], [gr + 96, gr + 184], [gr + 188, x1 + 20]]
    .map(([a, b]) => `<rect class="co2k-epi" x="${f(a)}" y="${Y.cut + 2}" width="${f(b - a)}" height="${Y.epi1 - Y.cut - 2}" rx="12"/>`).join('');
  const cut = `<path class="co2k-cut" d="M${x0},${Y.cut}H${PORE[0] - 20}M${PORE[0] + 20},${Y.cut}H${x1}"/>`;
  const fib = Array.from({ length: 22 }, (_, i) => { const x = x0 + 14 + i * 25; return `<path class="co2k-fib" d="M${x},${Y.wall0 + 5 + (i % 3) * 3}q7,4 14,0"/>`; }).join('');
  const lab = (x: number, y: number, s: string, an: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, 'co2k-il cel-halo', an);
  return `${band(top, Y.cut, 'co2k-air')}${band(Y.cut, Y.epi1, 'co2k-ias')}${band(Y.epi1, Y.wall0, 'co2k-ias')}
    ${band(Y.wall0, Y.wall1, 'co2k-wallb')}${band(Y.wall1, C[1] + R, 'co2k-cyt')}${fib}${bilayerH(x0, x1, Y.pm, 6)}
    ${epi}${cut}${guardMarkup(GEO)}
    ${pepcG(PEPC.x, PEPC.y, PEPC.w)}
    ${chloroplastG(CP, CRX, CRY, [[1381, 372], [1516, 376]], 24, { at: RUB, w: 70 })}
    ${vacuoleG(`${P}tint`, VAC, VRX, VRY)}
    <rect data-k="${P}mveil" x="${x0}" y="${top}" width="${2 * R}" height="${2 * R}" style="fill:#33405e" opacity="0"/>
    ${lab(1176, 222, 'stoma', 'end')}${lab(PEPC.x + PEPC.w / 2 - 4, 434, 'PEPC')}${lab(RUB[0], 420, 'RuBisCO')}${lab(VAC[0], 618, 'vacuole')}
    ${camActors(GEO)}`;
}

/** On the photo: the mesophyll cell the lens is on (dashed), as BS1 on the C₄ slide. */
const CELL = `<path d="M612,382C650,356 760,360 792,392C812,470 812,600 796,676C740,700 650,698 610,672C596,580 596,470 612,382Z" style="fill:none;stroke:#8f7a3e;stroke-width:2.4;stroke-dasharray:6 4"/>`;

/** Beat timings (s): beat 2 steps 0, 1, 2 and beat 3 steps 3, 4, 5, each starting at the hold before it. */
const DUR = camDur(GEO.others.length);
const H2 = [DUR[0], DUR[0] + DUR[1]], H3 = [DUR[3], DUR[3] + DUR[4]];
const KEYS: StageKey[] = [{ beat: 2, text: CAM_Q, x: 800, y: 64, size: 44 }];

export const STAGING: Staging = {
  ...makeScene({
    id: 'camk', name: 'camk · Micrograph and magnifier: night, then day', beats: CAM_BEATS, holds: [[], H2, H3],
    note: 'A succulent leaf (400×, CC0) with a lens on the stoma and a mesophyll cell; in the magnifier (bilayers, PEPC 3ZGE, RuBisCO 8RUC) slide 19’s CO₂ slips in through the open stoma at night, becomes HCO₃⁻ and, at PEPC, malic acid asleep in the vacuole; by day, the stoma shut, it wakes, is freed and goes to RuBisCO',
    svg: () => {
      const m = inset(P, `${P}-in`, LENS, LR, C, R, magnifier());
      return `<image href="${sucJpg}" x="0" y="0" width="1000" height="740" preserveAspectRatio="none"/>
        <rect data-k="${P}pveil" x="0" y="0" width="1000" height="740" style="fill:#33405e" opacity="0"/>
        ${actor(`${P}-st`, T(480, 98, 'stoma', 'co2k-zl cel-halo'))}
        ${actor(`${P}-mc`, `${CELL}${T(712, 352, 'mesophyll cell', 'co2k-zl cel-halo')}`)}
        ${actor(`${P}-va`, T(712, 540, 'vacuole', 'co2k-zl cel-halo'))}
        ${actor(`${P}-cp`, T(236, 470, 'chloroplasts', 'co2k-zl cel-halo'))}
        ${m.lens}${m.box}${timePill(`${P}pill`, PILL)}
        ${T(992, 732, 'succulent leaf: Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr cel-halo', 'end')}
        ${actor(`${P}-cr`, T(1596, 732, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)', 'co2k-cr', 'end'))}`;
    },
    frame(a: Api, beat: number, t: number) {
      const at = (b: number, t0: number, t1: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t1) : 0);
      // beat 1: the names one at a time, then the lens and the magnifier
      a.op(`${P}-st`, at(0, 0.3, 0.8)); a.op(`${P}-mc`, at(0, 1.2, 1.7)); a.op(`${P}-va`, at(0, 2.1, 2.6)); a.op(`${P}-cp`, at(0, 3.0, 3.5));
      const mag = at(0, 3.8, 4.5);
      a.op(`${P}-in-lens`, mag); a.op(`${P}-in`, mag); a.op(`${P}-cr`, mag);
      // the steps' local times
      const st = (b: number, t0: number): number => (beat > b ? BIG : beat < b ? -BIG : t - t0);
      const s = [st(1, 0), st(1, H2[0]), st(1, H2[1]), st(2, 0), st(2, H3[0]), st(2, H3[1])];
      const night = camFrame(a, GEO, s);
      // night: a soft dark veil over the photo and the magnifier, the moon on its pill; day: the sun
      a.op(`${P}pveil`, 0.24 * night); a.op(`${P}mveil`, 0.1 * night);
      a.op(`${P}pill-n`, beat === 1 ? ease(t, 0.1, 0.7) : beat === 2 ? 1 - ease(t, 0.1, 0.6) : 0);
      a.op(`${P}pill-d`, beat === 2 ? ease(t, 0.5, 1.0) : 0);
    },
  }),
  keys: KEYS,
};
