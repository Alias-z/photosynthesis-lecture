// Photosystem II (slide 7): the parts both stagings share. The real PSII core monomer seen from the side in its membrane
// (stroma up), the cofactors of the electron path at their real positions, the moving electrons, H⁺, water and O₂, the
// two clippings, the absorption inset, the energy staircase and the flask of Ruben and Kamen's experiment. Each staging
// (psii-a, psii-b) moves its own camera through these and sets its own clicks.
//
// Images (assets/anim/psii; credits):
// - kok-nas.png: Bessel Kok, halftone (scripts/halftone.py, crop 255,120–945,982 of the page image) of the frontispiece
//   portrait in J. Myers, Bessel Kok 1918–1979, Biographical Memoirs of the National Academy of Sciences 57 (1987), p. 124,
//   page image from nap.nationalacademies.org/books/1000/gif/124.gif, © NAS.
// - ruben.png, kamen.png: halftones of refs/L4-photochemistry image d (Sam Ruben: Seaborg Archive, Lawrence Berkeley
//   National Laboratory, via UC Berkeley College of Chemistry; Martin Kamen: Donald Cooksey 1938, public domain, Wikimedia
//   Commons), crops 190,92–510,492 and 606,80–934,490.
// - psii-side.webp (look a) and psii-side-ht.webp (look b): our own render of the PSII core monomer of PDB 5XNL (pea,
//   Su et al. 2017, Science 357:815): chains of D1, D2, CP43, CP47, cyt b559, PsbH–Z and the lumenal PsbO, P and Q,
//   3Dmol.js 2.5.5 cartoon, orthographic, 8 px per Å, headless Chrome (render page and scripts in the session scratchpad,
//   psiiwork/render/side.html, psiiwork/tools). The ht file is the same render as a newsprint dot screen of its shading.
// - Cofactor positions: psii-data.ts, from 5XNL in the same frame. The view looks along the membrane plane, perpendicular
//   to the line from PheoD2 to PheoD1, so the electron path of the D1 branch spreads out: P680 (PD1 + PD2) → PheoD1 → QA
//   (on D2) → QB (on D1), with the Mn₄CaO₅ cluster below on the D1 side. The accessory chlorophylls (ChlD1, ChlD2), PheoD2,
//   the non-haem Fe and YZ are not drawn (the electron still passes YZ's position on its way from the cluster).
// - Membrane: the lipid head groups resolved in 5XNL sit at z = −17 Å and +12 Å; the bilayer is drawn from −21 to +16 Å.
//
// Physics kept on the stage:
// - One electron per photon: each charge separation is started by one photon (beat 1, and three more in beat 4).
// - Four electrons per O₂: the cluster gives four electrons to P680⁺, one after each photon; the first of the four refills
//   the P680⁺ left by beat 1's photon, so beats 1 and 4 together use four photons. Then O₂ leaves.
// - The 4 H⁺ from water go into the lumen; PQ takes its 2 H⁺ from the stroma, with 2 e⁻, and leaves as PQH₂.
// - The staircase is the electron's energy, −e × the midpoint potential: P680* −0.66 V, Pheo −0.51 V, QA −0.14 V,
//   QB +0.04 V (Rappaport & Diner 2008; Kato et al. 2009, 2016): every step downhill, to scale.
// - The absorption inset is the red band of chlorophyll near 680 nm (drawn); in light, a notch at 680 nm, where P680⁺
//   absorbs less (Döring et al. 1969): the caption's "P680, after where its absorption drops".
import '../figs/clipping.css';
import './psii-common.css';
import { clipping, clipHeight, type Clip } from '../figs/clipping';
import kamenImg from '../../assets/anim/psii/kamen.png';
import kokImg from '../../assets/anim/psii/kok-nas.png';
import sideB from '../../assets/anim/psii/psii-side-ht.webp';
import sideA from '../../assets/anim/psii/psii-side.webp';
import rubenImg from '../../assets/anim/psii/ruben.png';
import { clamp01, cutPath, f1, lerp, lerpV, onStage, packet, rng, setters, smooth, T, tfStr, tw, type Tf, type V } from './antenna-common';
import { AT, MEM, OEX_ATOMS, OEX_BONDS, QB_O, STICKS } from './psii-data';

export { clamp01, f1, lerp, lerpV, onStage, setters, smooth, tfStr, tw };
export type { Tf, V };
export type Look = 'a' | 'b';
export type Setters = ReturnType<typeof setters>;

/** a ∘ b: the view that applies b, then a. */
export const compose = (a: Tf, b: Tf): Tf => ({ s: a.s * b.s, t: [a.s * b.t[0] + a.t[0], a.s * b.t[1] + a.t[1]] });
/** The view part way from a to b: log-even scale, the stage centre's scene point glides (as antenna-common's tween). */
export function tween(a: Tf, b: Tf, e: number): Tf {
  const C: V = [800, 370], ca: V = [(C[0] - a.t[0]) / a.s, (C[1] - a.t[1]) / a.s], cb: V = [(C[0] - b.t[0]) / b.s, (C[1] - b.t[1]) / b.s];
  const s = a.s * (b.s / a.s) ** e, c = lerpV(ca, cb, e);
  return { s, t: [C[0] - s * c[0], C[1] - s * c[1]] };
}
/** A move of about 1 s: 0 → 1 between t0 and t0 + d, eased at both ends. */
export const mv = (t: number, t0: number, d = 1): number => { const u = clamp01((t - t0) / d); return u * u * u * (u * (u * 6 - 15) + 10); };
export const ID_TF: Tf = { s: 1, t: [0, 0] };

/* ---------------------------------------------------------------- views of the structure (render px → stage) */

/** The whole core monomer in its membrane (beat 1). */
export const REST: Tf = { s: 0.7, t: [239.3, -149.2] };
/** The electron path P680 → pheophytin → QA → QB (beat 2). */
export const CHAIN: Tf = { s: 1.75, t: [-777.5, -659.25] };
/** The Mn₄CaO₅ cluster, P680 above it and the lumen below (beat 4). */
export const MN: Tf = { s: 1.5, t: [-515, -825] };
/** QB at the stroma side, with the membrane to its left (beat 5). */
export const QBV: Tf = { s: 1.25, t: [50, -307.5] };
/** The end still: the whole monomer, PQH₂ in the membrane to its left, the acidic lumen. */
export const END: Tf = { s: 0.7, t: [268, -149.2] };
/** The membrane's middle under P680, on the stage in the REST view (the point a dive aims at). */
export const MEM_MID: V = [AT.p680[0], (MEM.top + MEM.bottom) / 2];

/* ---------------------------------------------------------------- the structure scene */

const IMG: Record<Look, { href: string; box: [number, number, number, number] }> = {
  a: { href: sideA, box: [362, 327, 879, 858] },
  b: { href: sideB, box: [361, 328, 881, 858] },
};
const sticks = (q: number[]): string => { let d = ''; for (let i = 0; i < q.length; i += 4) d += `M${q[i]},${q[i + 1]}L${q[i + 2]},${q[i + 3]}`; return d; };
const QB_C = AT.qb;
/** Where PQH₂ ends up: out of the QB pocket, in the middle of the bilayer left of the protein. */
export const PQ_OUT: V = [262, (MEM.top + MEM.bottom) / 2 - 10];
/** The lumen's H⁺ (render px), the first four from the two waters. */
export const LUMEN_H: V[] = [[655, 845], [790, 905], [985, 880], [880, 975], [470, 840], [560, 925], [720, 990], [610, 1015],
  [1070, 950], [1150, 850], [1000, 1010], [500, 985], [830, 1020], [1180, 990]];

/** The structure: membrane band, the acid tint of the lumen, the protein, the cofactors. Look 'b' is printed on a
 *  newsprint sheet, its band and tint inside the sheet. */
export function structureSvg(p: string, look: Look): string {
  const [x, y, w, h] = IMG[look].box;
  const sheet = cutPath(118, 262, 1362, 924, 57, 6);
  const clip = look === 'b' ? ` clip-path="url(#${p}-sheetclip)"` : '';
  const oex = Array.from({ length: OEX_ATOMS.length / 3 }, (_, i) => OEX_ATOMS.slice(3 * i, 3 * i + 3));
  const oexB = Array.from({ length: OEX_BONDS.length / 2 }, (_, i) => { const a = oex[OEX_BONDS[2 * i]], b = oex[OEX_BONDS[2 * i + 1]]; return `M${a[0]},${a[1]}L${b[0]},${b[1]}`; }).join('');
  const atoms = oex.slice().sort((a, b) => b[2] - a[2]).map(a => `<circle class="ps-x${a[2]}" cx="${a[0]}" cy="${a[1]}" r="${[4.6, 4.8, 3.3][a[2]]}"/>`).join('');
  const qbH = QB_O.map(o => { const d = [o[0] - QB_C[0], o[1] - QB_C[1]], L = Math.hypot(d[0], d[1]); return `<circle class="ps-hat" cx="${f1(o[0] + (d[0] / L) * 7)}" cy="${f1(o[1] + (d[1] / L) * 7)}" r="3.6"/>`; }).join('');
  const band = (cls: string): string => `<rect class="${cls}" x="-500" y="${MEM.top}" width="2600" height="${MEM.bottom - MEM.top}" fill="url(#${p}-memfade)"/>`;
  return `<defs>
      <linearGradient id="${p}-memfade" gradientUnits="userSpaceOnUse" x1="-500" y1="0" x2="2100" y2="0"><stop offset="0" stop-color="#efe4c8" stop-opacity="0"/><stop offset=".2" stop-color="#efe4c8" stop-opacity=".8"/><stop offset=".8" stop-color="#efe4c8" stop-opacity=".8"/><stop offset="1" stop-color="#efe4c8" stop-opacity="0"/></linearGradient>
      <linearGradient id="${p}-edgefade" gradientUnits="userSpaceOnUse" x1="-500" y1="0" x2="2100" y2="0"><stop offset="0" stop-color="#c9b98e" stop-opacity="0"/><stop offset=".2" stop-color="#c9b98e"/><stop offset=".8" stop-color="#c9b98e"/><stop offset="1" stop-color="#c9b98e" stop-opacity="0"/></linearGradient>
      <linearGradient id="${p}-acidfade" gradientUnits="userSpaceOnUse" x1="-500" y1="0" x2="2100" y2="0"><stop offset="0" stop-color="#eeb3a0" stop-opacity="0"/><stop offset=".25" stop-color="#eeb3a0" stop-opacity=".5"/><stop offset=".75" stop-color="#eeb3a0" stop-opacity=".5"/><stop offset="1" stop-color="#eeb3a0" stop-opacity="0"/></linearGradient>
      <radialGradient id="${p}-glow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".35" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-pqglow"><stop offset="0" stop-color="#fbe3b3" stop-opacity=".95"/><stop offset="1" stop-color="#fbe3b3" stop-opacity="0"/></radialGradient>
      ${look === 'b' ? `<clipPath id="${p}-sheetclip"><path d="${sheet}"/></clipPath><filter id="${p}-sheetsh" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="2" dy="5" stdDeviation="7" flood-color="#3d3020" flood-opacity=".2"/></filter>` : ''}
    </defs>
    <g data-k="st" class="ps-st">
      ${look === 'b' ? `<path class="ps-sheet" d="${sheet}" filter="url(#${p}-sheetsh)"/>` : ''}
      <g${clip}>${band('ps-mem')}
        <path class="ps-memedge" d="M-500,${MEM.top}H2100M-500,${MEM.bottom}H2100" stroke="url(#${p}-edgefade)"/>
        <rect data-k="acid" x="-500" y="${MEM.bottom + 2}" width="2600" height="${1230 - MEM.bottom}" fill="url(#${p}-acidfade)" opacity="0"/></g>
      <image class="ps-prot-${look}" href="${IMG[look].href}" x="${x}" y="${y}" width="${w}" height="${h}"/>
      <circle data-k="p680glow" cx="${AT.p680[0]}" cy="${AT.p680[1]}" r="60" fill="url(#${p}-glow)" opacity="0"/>
      <path class="ps-halo" d="${sticks(STICKS.pd1)}${sticks(STICKS.pd2)}"/>
      <path class="ps-chl" data-k="p680-g" d="${sticks(STICKS.pd1)}${sticks(STICKS.pd2)}"/>
      <path class="ps-chl-pale" data-k="p680-p" d="${sticks(STICKS.pd1)}${sticks(STICKS.pd2)}" opacity="0"/>
      <path class="ps-halo" d="${sticks(STICKS.pheo)}"/><path class="ps-pheo" d="${sticks(STICKS.pheo)}"/>
      <path class="ps-halo" d="${sticks(STICKS.qa)}"/><path class="ps-pq" d="${sticks(STICKS.qa)}"/>
      <g data-k="qbmol"><circle data-k="qbglow" cx="${QB_C[0]}" cy="${QB_C[1]}" r="50" fill="url(#${p}-pqglow)" opacity="0"/>
        <path class="ps-halo" d="${sticks(STICKS.qb)}"/><path class="ps-pq" data-k="qb-pq" d="${sticks(STICKS.qb)}"/>
        <path class="ps-pqh2" data-k="qb-h2" d="${sticks(STICKS.qb)}" opacity="0"/><g data-k="qb-h" opacity="0">${qbH}</g></g>
      <path class="ps-oexb" d="${oexB}"/>${atoms}
    </g>`;
}

/* ---------------------------------------------------------------- stage overlays: labels and moving glyphs */

interface Lab { k: string; html: string; cls?: string; at?: () => V }
let qbAt: V = QB_C;
const LABS: Lab[] = [
  { k: 'psii', html: 'photosystem II (PSII)', cls: 'ps-lab-psii' },
  { k: 'p680', html: 'P680<tspan data-k="plus">⁺</tspan>', cls: 'ps-lab-key', at: () => AT.p680 },
  { k: 'pheo', html: 'pheophytin', at: () => AT.pheo },
  { k: 'qa', html: 'Q<tspan class="ps-sub" dy="6">A</tspan>', at: () => AT.qa },
  { k: 'qb', html: 'Q<tspan class="ps-sub" dy="6">B</tspan>', at: () => QB_C },
  { k: 'oex', html: 'Mn₄CaO₅', at: () => AT.oex },
  { k: 'pq', html: 'plastoquinone', at: () => qbAt },
  { k: 'pqh2', html: 'plastoquinol (PQH₂)', cls: 'ps-lab-key', at: () => qbAt },
  { k: 'stroma', html: 'stroma', cls: 'ps-lab-zone' },
  { k: 'lumen', html: 'lumen', cls: 'ps-lab-zone' },
  { k: 'acid', html: 'acidic lumen', cls: 'ps-lab-acid' },
  { k: 'light', html: 'light', cls: 'ps-lab-light' },
  { k: 'h2o', html: '2 H₂O', cls: 'ps-lab-w' },
  { k: 'o2', html: 'O₂', cls: 'ps-lab-w' },
  { k: 'e4', html: '4 e⁻', cls: 'ps-lab-e' },
];
type Anchor = 'start' | 'middle' | 'end';
export type Layout = Record<string, [number, number, Anchor]>;
/** Where each label's text sits in each view (stage px). */
export const LAY: Record<'rest' | 'chain' | 'mn' | 'qb' | 'end', Layout> = {
  rest: { psii: [800, 722, 'middle'], p680: [470, 300, 'end'], stroma: [470, 140, 'end'], lumen: [470, 452, 'end'] },
  chain: { p680: [470, 649, 'end'], pheo: [930, 469, 'start'], qa: [930, 253, 'start'], qb: [340, 213, 'end'], stroma: [96, 116, 'start'], lumen: [96, 728, 'start'] },
  mn: { p680: [480, 200, 'end'], oex: [1010, 414, 'start'], lumen: [1196, 382, 'start'], acid: [1196, 382, 'start'] },
  qb: { pq: [780, 150, 'end'], pqh2: [780, 150, 'end'], qa: [1290, 408, 'start'], stroma: [96, 118, 'start'] },
  end: { pqh2: [168, 104, 'start'], stroma: [1206, 104, 'start'], acid: [1206, 560, 'start'] },
};

const ELEC = ['e1', 'e2', 'ew0', 'ew1', 'ew2', 'ew3', 'eu0', 'eu1', 'eu2'];
const HPLUS = [...LUMEN_H.map((_, i) => `hl${i}`), 'hs0', 'hs1'];
export function overlaySvg(): string {
  const lab = LABS.map(L => `<g data-k="L-${L.k}" opacity="0">${L.at ? `<path class="ps-lead-h" data-k="Lh-${L.k}"/><path class="ps-lead" data-k="Ll-${L.k}"/><circle class="ps-lead-dot" data-k="Ld-${L.k}" r="4"/>` : ''}<text class="ps-lab ${L.cls ?? ''}" data-k="Lt-${L.k}">${L.html}</text></g>`).join('');
  const e = ELEC.map(k => `<g data-k="${k}" class="ps-e" opacity="0"><circle r="17"/><text y="7.5" text-anchor="middle">e⁻</text></g>`).join('');
  const h = HPLUS.map(k => `<g data-k="${k}" class="ps-h" opacity="0"><circle r="18"/><text y="7.5" text-anchor="middle">H⁺</text></g>`).join('');
  const water = (k: string): string => `<g data-k="${k}" class="ps-w" opacity="0"><circle class="ps-wh" cx="-14" cy="-10" r="8.5"/><circle class="ps-wh" cx="14" cy="-10" r="8.5"/><circle class="ps-wo" r="15"/></g>`;
  const ph = [0, 1, 2, 3].map(i => `<path class="ps-photon" data-k="ph${i}" opacity="0"/>`).join('');
  return `<g data-k="ov"><path class="ps-trail" data-k="trail"/><path class="ps-trail" data-k="ctrail"/><path class="ps-trailhead" data-k="ctrailh"/>${lab}${water('w0')}${water('w1')}<g data-k="o2m" class="ps-w" opacity="0"><circle class="ps-wo" cx="-12" r="14"/><circle class="ps-wo" cx="12" r="14"/></g>${h}${e}${ph}</g>`;
}

/** Labels placed by the chemistry or by a staging itself, not by the layouts. */
const FREE = ['light', 'h2o', 'o2', 'e4'];
/** Shows label k at opacity o in layout L, its leader drawn to its anchor through view v. */
export function label(S: Setters, k: string, v: Tf, L: Layout | null, o: number): void {
  const g = S.q(`L-${k}`), pos = L?.[k];
  const oo = pos ? o : 0;
  S.op(g, oo);
  if (oo < 0.004 || !pos) return;
  const [x, y, a] = pos, t = S.q(`Lt-${k}`);
  S.set(t, 'x', f1(x)); S.set(t, 'y', f1(y)); S.set(t, 'text-anchor', a);
  const lab = LABS.find(l => l.k === k) as Lab;
  if (!lab.at) return;
  // The leader leaves the side of the text that faces its anchor.
  const an = onStage(v, lab.at()), side = (a === 'end' && an[0] > x + 20) || (a === 'start' && an[0] < x - 20);
  const cx = a === 'start' ? x + 40 : a === 'end' ? x - 40 : x;
  const from: V = side ? [x + (a === 'start' ? -8 : 8), y - 8] : an[1] > y ? [cx, y + 10] : [cx, y - 30];
  const d = [an[0] - from[0], an[1] - from[1]], len = Math.hypot(d[0], d[1]), stop = Math.max(0, len - 5);
  const path = len < 26 ? '' : `M${f1(from[0])},${f1(from[1])}L${f1(from[0] + (d[0] / len) * stop)},${f1(from[1] + (d[1] / len) * stop)}`;
  S.set(S.q(`Ll-${k}`), 'd', path); S.set(S.q(`Lh-${k}`), 'd', path);
  S.set(S.q(`Ld-${k}`), 'cx', f1(an[0])); S.set(S.q(`Ld-${k}`), 'cy', f1(an[1]));
}
/** All labels: the layout `from` fades out as `to` fades in (e: 0 → 1); `o` dims all, `mul` some. */
export function labels(S: Setters, v: Tf, from: Layout | null, to: Layout | null, e: number, o = 1, mul: Record<string, number> = {}): void {
  for (const L of LABS) {
    if (FREE.includes(L.k)) continue;
    const k = o * (mul[L.k] ?? 1);
    if (e < 0.5) label(S, L.k, v, from, k * (from?.[L.k] ? 1 - tw(e, 0, 0.4) : 0));
    else label(S, L.k, v, to, k * (to?.[L.k] ? tw(e, 0.6, 1) : 0));
  }
}
/** Places a glyph at stage point p with opacity o and scale k. */
function glyph(S: Setters, key: string, p: V, o: number, k = 1): void {
  const g = S.q(key);
  S.op(g, o);
  if (o > 0.004) S.set(g, 'transform', `translate(${f1(p[0])} ${f1(p[1])})${k !== 1 ? ` scale(${k.toFixed(3)})` : ''}`);
}
/** A photon (red wave packet) flying to P680 from `from` (stage), f = 0 → 1; it fades as it lands. */
function photon(S: Setters, i: number, from: V, to: V, f: number, o: number): void {
  const el = S.q(`ph${i}`);
  const on = f > 0 && f < 1.15 ? tw(f, 0, 0.12) * (1 - tw(f, 0.92, 1.1)) * o : 0;
  S.op(el, on);
  if (on > 0.004) {
    const p = lerpV(from, to, Math.min(1, f)), ang = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
    S.set(el, 'd', packet(p[0], p[1], 680, ang, 120, 15));
  }
}

/* ---------------------------------------------------------------- the chemistry, beat by beat */

/** Where the electron rests after leaving the pair (beat 1): a little way towards pheophytin. */
const E1: V = lerpV(AT.p680, AT.pheo, 0.42);
const HOPS: V[] = [E1, AT.pheo, AT.qa, QB_C];
/** Hop timing (beat 2): each hop 0.6 s, 0.25 s apart: the sequence takes 2.3 s. */
export const HOP = { d: 0.6, gap: 0.25, n: 3 };
export const HOPS_T = HOP.n * HOP.d + (HOP.n - 1) * HOP.gap;
const hopX = (h: number): number => { let x = 0; for (let k = 0; k < HOP.n; k++) x += smooth((h - k * (HOP.d + HOP.gap)) / HOP.d); return x; };
const hopAt = (x: number): V => { const k = Math.min(HOP.n - 1, Math.floor(x)); return lerpV(HOPS[k], HOPS[k + 1], x - k); };

/** Beat 1 photon step: photon 0–0.55 s, the pair lights up, its electron leaves 0.5–1.1 s. */
export const B1 = { done: 1.25 };
/** Beat 4 water step: water in 0–0.7 s, then four cluster electrons 0.65 s apart (with a photon between). */
export const B4 = { cyc0: 0.85, per: 0.65, done: 0.85 + 3 * 0.65 + 0.45 };
/** Beat 4 O₂ step: O₂ forms and leaves 0–1.0 s; four H⁺ out 0.9–1.6 s; the lumen fills 1.6–2.5 s. */
export const B4X = { done: 2.6 };
/** Beat 5 PQ step: second electron 0–0.6 s; 2 H⁺ from the stroma 0.5–1.3 s; PQH₂ 1.3–1.8 s. */
export const B5 = { done: 1.9 };
/** Beat 5 exit: PQH₂ slides into the membrane (1.2 s). */
export const B5X = { done: 1.2 };
const CYC_PATH: V[] = [AT.oex, AT.yz, AT.p680];
const cycAt = (u: number): V => (u < 0.5 ? lerpV(CYC_PATH[0], CYC_PATH[1], u * 2) : lerpV(CYC_PATH[1], CYC_PATH[2], (u - 0.5) * 2));

/** The chemistry's clocks: c[b] is the time into beat b's chemistry steps, as each staging schedules them (c0: beat 1's
 *  photon step; dip: the absorption step; hops: beat 2; w, x: beat 4's water and O₂ steps; q, m: beat 5's PQ and exit
 *  steps). A beat already past takes its end state; a beat still ahead, its start. */
export interface Clock { b: number; c0: number; hops: number; w: number; x: number; q: number; m: number }
export const clockFor = (b: number, cur: Partial<Clock>): Clock => {
  const after = (k: number, key: keyof Clock, end: number): number => (b > k ? end : b < k ? -1 : (cur[key] as number) ?? -1);
  return { b, c0: after(0, 'c0', 99), hops: after(1, 'hops', 99), w: after(3, 'w', 99), x: after(3, 'x', 99), q: after(4, 'q', 99), m: after(4, 'm', 99) };
};

/** Where the QB molecule is at clock c (render px); call before the labels, whose leaders follow it. */
export function placeQb(c: Clock): void {
  const u = c.m >= 0 ? smooth(c.m / B5X.done) : 0;
  qbAt = u < 0.3 ? lerpV(QB_C, [QB_C[0] - 40, QB_C[1] + 60], u / 0.3) : lerpV([QB_C[0] - 40, QB_C[1] + 60], PQ_OUT, (u - 0.3) / 0.7);
}
/** Draws the cofactor states and every moving glyph for clock c, through the structure view v; `o` is the overlays'
 *  opacity (0 while the structure is away). Returns the stage position of P680 (for photons). */
export function drawChem(S: Setters, c: Clock, v: Tf, o: number, from1: V = [610, 30]): void {
  const st = (p: V): V => onStage(v, p);
  /* the photons: beat 1's (the first charge separation), and beat 4's three; "light" names the first of each */
  photon(S, 0, from1, st(AT.p680), c.c0 >= 0 ? c.c0 / 0.55 : -1, o);
  const lf: V = [st(AT.p680)[0] - 330, st(AT.p680)[1] - 150];
  if (c.b === 0) label(S, 'light', v, { light: [from1[0] - 14, from1[1] + 14, 'end'] }, o * (c.c0 >= 0 ? tw(c.c0, 0, 0.1) * (1 - tw(c.c0, 0.75, 0.95)) : 0));
  else if (c.b === 3) { const u = c.w - B4.cyc0; label(S, 'light', v, { light: [lf[0] - 14, lf[1] + 14, 'end'] }, o * (c.w >= 0 ? tw(u, 0.3, 0.38) * (1 - tw(u, 0.65, 0.85)) : 0)); }
  else label(S, 'light', v, null, 0);
  /* P680: excited glow; bleached while it is P680⁺ (it absorbs less) */
  const glow0 = c.c0 < 0 ? 0 : tw(c.c0, 0.45, 0.6) * (1 - tw(c.c0, 0.75, 1.3));
  let plus = c.hops >= 0 ? tw(c.hops, 0.2, 0.4) : 0, bleach = c.c0 >= 0 ? tw(c.c0, 0.55, 1.0) : 0, glow = glow0;
  // Beat 4: the cluster's four electrons, one after each photon.
  const cyc = (k: number): number => c.w - B4.cyc0 - k * B4.per;
  if (c.w >= 0) {
    for (let k = 0; k < 4; k++) {
      const u = cyc(k);
      if (u >= 0.35) { plus = 0; bleach = 0; }
      if (k < 3 && u >= 0.53) { plus = 1; bleach = 1; }
      if (k < 3) glow = Math.max(glow, u < 0.43 ? 0 : tw(u, 0.43, 0.5) * (1 - tw(u, 0.55, 0.7)));
    }
  }
  S.op(S.q('p680glow'), glow);
  S.op(S.q('p680-p'), bleach); S.op(S.q('p680-g'), 1 - 0.85 * bleach);
  S.set(S.q('plus'), 'fill-opacity', plus.toFixed(3)); S.set(S.q('plus'), 'stroke-opacity', plus.toFixed(3));

  /* the path the electron took in beat 2, drawn as it goes (it stays until PQH₂ leaves) */
  const hx = c.hops >= 0 ? hopX(c.hops) : 0;
  const tr = HOPS.slice(0, Math.floor(hx) + 1).concat(hx % 1 > 0 ? [hopAt(hx)] : []).map(st);
  S.set(S.q('trail'), 'd', hx > 0 && tr.length > 1 ? `M${tr.map(q => `${f1(q[0])},${f1(q[1])}`).join('L')}` : '');
  S.op(S.q('trail'), o * (hx > 0 && c.b < 2 ? 1 : 0));
  /* the electron of beats 1–2 (e1), and the second one at QB (e2, beat 5) */
  const eOut = c.c0 >= 0 ? tw(c.c0, 0.5, 1.1) : 0;
  const qMerge = c.q >= 0 ? tw(c.q, 1.3, 1.6) : 0;
  const e1Off: V = [-36, 6], e2Off: V = [36, 6];
  let e1p = lerpV(AT.p680, E1, eOut), e1o = c.c0 >= 0 ? tw(c.c0, 0.5, 0.6) : 0;
  if (c.hops >= 0) e1p = hopAt(hopX(c.hops));
  const e1q = c.q >= 0 ? tw(c.q, 0.1, 0.5) : 0;
  const e1s = st(e1p);
  glyph(S, 'e1', lerpV([e1s[0] + e1Off[0] * e1q, e1s[1] + e1Off[1] * e1q], e1s, qMerge), o * e1o * (1 - qMerge), 1 - 0.4 * qMerge);
  const e2u = c.q >= 0 ? smooth(c.q / 0.6) : 0;
  const e2s = st(lerpV(AT.qa, QB_C, e2u));
  glyph(S, 'e2', lerpV([e2s[0] + e2Off[0] * e2u, e2s[1] + e2Off[1] * e2u], e2s, qMerge), o * (c.q >= 0 ? tw(c.q, 0, 0.12) : 0) * (1 - qMerge), 1 - 0.4 * qMerge);

  /* beat 4: water in, the cluster's electrons up to P680, the photons, the electrons leaving upwards */
  const wIn = c.w >= 0 ? smooth(c.w / 0.7) : 0, wOn = c.w >= 0 ? tw(c.w, 0, 0.1) : 0;
  const xO2 = c.x >= 0 ? tw(c.x, 0.05, 0.35) : 0; // the waters become O₂ (and H⁺)
  const W0: V[] = [[560, 1010], [640, 1075]], W1: V[] = [[848, 858], [912, 862]];
  for (let i = 0; i < 2; i++) glyph(S, `w${i}`, st(lerpV(W0[i], W1[i], wIn)), o * wOn * (1 - xO2));
  const w0 = st(lerpV(W0[0], W1[0], wIn));
  label(S, 'h2o', v, { h2o: [w0[0] - 30, w0[1] + 44, 'end'] }, o * wOn * (1 - xO2));
  const yz = st(AT.yz);
  label(S, 'e4', v, { e4: [yz[0] + 34, yz[1] - 6, 'start'] }, o * (c.w >= 0 ? tw(cyc(3), 0.35, 0.5) : 0) * (c.q >= 0 ? 1 - tw(c.q, 0, 0.3) : 1));
  // The cluster's electron route to P680 (via YZ), kept as an arrow once the first electron has gone.
  const cr = CYC_PATH.map(st), rOn = o * (c.w >= 0 ? tw(cyc(0), 0, 0.3) : 0) * (c.q >= 0 ? 1 - tw(c.q, 0, 0.3) : 1);
  const end = lerpV(cr[2], cr[1], 30 / Math.hypot(cr[2][0] - cr[1][0], cr[2][1] - cr[1][1]));
  const dir = [end[0] - cr[1][0], end[1] - cr[1][1]], dl = Math.hypot(dir[0], dir[1]), ux = dir[0] / dl, uy = dir[1] / dl;
  S.set(S.q('ctrail'), 'd', `M${f1(cr[0][0])},${f1(cr[0][1])}L${f1(cr[1][0])},${f1(cr[1][1])}L${f1(end[0])},${f1(end[1])}`);
  S.set(S.q('ctrailh'), 'd', `M${f1(end[0] - ux * 14 - uy * 8)},${f1(end[1] - uy * 14 + ux * 8)}L${f1(end[0] + ux * 2)},${f1(end[1] + uy * 2)}L${f1(end[0] - ux * 14 + uy * 8)},${f1(end[1] - uy * 14 - ux * 8)}`);
  S.op(S.q('ctrail'), rOn); S.op(S.q('ctrailh'), rOn);
  for (let k = 0; k < 4; k++) {
    const u = c.w >= 0 ? cyc(k) : -1;
    glyph(S, `ew${k}`, st(cycAt(smooth(u / 0.35))), o * (u > 0 ? tw(u, 0, 0.06) * (1 - tw(u, 0.33, 0.4)) : 0));
    if (k < 3) {
      const pf = u >= 0 ? (u - 0.38) / 0.15 : -1, p680 = st(AT.p680);
      photon(S, k + 1, [p680[0] - 330, p680[1] - 150], p680, pf, o);
      const uu = u - 0.53;
      glyph(S, `eu${k}`, st(lerpV(AT.p680, AT.pheo, smooth(uu / 0.3) * 0.75)), o * (uu > 0 ? tw(uu, 0, 0.05) * (1 - tw(uu, 0.2, 0.32)) : 0));
    }
  }
  /* O₂ leaves into the lumen; the four H⁺ go out; the lumen fills */
  const O2A: V = [880, 860], O2B: V = [430, 905];
  const o2u = c.x >= 0 ? smooth((c.x - 0.3) / 0.7) : 0, o2Gone = c.q >= 0 ? tw(c.q, 0, 0.4) : 0;
  const o2p = st(lerpV(O2A, O2B, o2u));
  glyph(S, 'o2m', o2p, o * xO2 * (1 - o2Gone));
  label(S, 'o2', v, { o2: [o2p[0], o2p[1] + 50, 'middle'] }, o * xO2 * (1 - o2Gone));
  const hOut = (i: number): number => (c.x >= 0 ? smooth((c.x - 0.9 - 0.08 * i) / 0.6) : 0);
  LUMEN_H.forEach((p, i) => {
    if (i < 4) glyph(S, `hl${i}`, st(lerpV(O2A, p, hOut(i))), o * (c.x >= 0 ? tw(c.x, 0.85 + 0.08 * i, 0.95 + 0.08 * i) : 0));
    else glyph(S, `hl${i}`, st(p), o * (c.x >= 0 ? tw(c.x, 1.6 + 0.07 * (i - 4), 1.8 + 0.07 * (i - 4)) : 0));
  });
  S.op(S.q('acid'), c.x >= 0 ? tw(c.x, 1.55, 2.4) : 0);

  /* beat 5: two H⁺ from the stroma into QB; PQ becomes PQH₂ and slides into the membrane */
  const HS0: V[] = [[700, 330], [800, 352]];
  const qbS = st(QB_C);
  HS0.forEach((h0, i) => {
    const tgt: V = [qbS[0] + (i ? 20 : -20), qbS[1] - 38], u = c.q >= 0 ? smooth((c.q - 0.5 - 0.12 * i) / 0.7) : 0;
    const p = lerpV(st(h0), tgt, u), m = lerpV(p, qbS, qMerge);
    glyph(S, `hs${i}`, m, o * (c.q >= 0 ? tw(c.q, 0.45, 0.6) : 0) * (1 - qMerge), 1 - 0.4 * qMerge);
  });
  const h2 = c.q >= 0 ? tw(c.q, 1.35, 1.7) : 0;
  S.op(S.q('qb-h2'), h2); S.op(S.q('qb-pq'), 1 - h2); S.op(S.q('qb-h'), h2);
  placeQb(c);
  S.set(S.q('qbmol'), 'transform', `translate(${f1(qbAt[0] - QB_C[0])} ${f1(qbAt[1] - QB_C[1])})`);
  S.op(S.q('qbglow'), c.m >= 0 ? tw(c.m, 0, 0.3) : h2 * 0.8);
}


/* ---------------------------------------------------------------- the absorption inset (beat 1) */

export const ABS = { x: 1176, y: 168, w: 366, h: 262 };
const AX = { x0: ABS.x + 62, x1: ABS.x + ABS.w - 28, top: ABS.y + 34, base: ABS.y + ABS.h - 70 };
const NM: [number, number] = [636, 756];
const xNm = (nm: number): number => AX.x0 + ((nm - NM[0]) / (NM[1] - NM[0])) * (AX.x1 - AX.x0);
/** The red absorption band (drawn, peak 678 nm) with a notch at 680 nm of depth d (0–1). */
const absPath = (d: number): string => {
  const pts: string[] = [];
  for (let nm = NM[0]; nm <= NM[1]; nm += 1) {
    const a = 0.1 + 0.9 * Math.exp(-(((nm - 678) / 15) ** 2)) + 0.12 * Math.exp(-(((nm - 625) / 14) ** 2)) - d * 0.2 * Math.exp(-(((nm - 680) / 4.2) ** 2));
    pts.push(`${pts.length ? 'L' : 'M'}${f1(xNm(nm))},${f1(AX.base - a * (AX.base - AX.top - 8))}`);
  }
  return pts.join('');
};
export function absSvg(): string {
  return `<g data-k="abs" opacity="0"><path class="ps-card" d="${cutPath(ABS.x, ABS.y, ABS.w, ABS.h, 71, 2.4)}"/>
    <path class="ps-axis" d="M${AX.x0 - 12},${AX.base}V${AX.top - 10}M${AX.x0 - 12},${AX.base}H${AX.x1 + 6}"/>
    <path class="ps-axhead" d="M${AX.x0 - 19},${AX.top + 2}L${AX.x0 - 12},${AX.top - 12}L${AX.x0 - 5},${AX.top + 2}M${AX.x1 - 6},${AX.base - 7}L${AX.x1 + 8},${AX.base}L${AX.x1 - 6},${AX.base + 7}"/>
    <text class="ps-ax" transform="translate(${AX.x0 - 26} ${(AX.top + AX.base) / 2 + 4}) rotate(-90)" text-anchor="middle">absorption</text>
    ${T(AX.x1 + 4, AX.base + 34, 'wavelength', 'ps-ax', 'end')}
    <path class="ps-abs" data-k="abs-tr" d="${absPath(0)}"/>
    <g data-k="abs-680" opacity="0"><path class="ps-tick" d="M${f1(xNm(680))},${AX.base - 4}V${AX.base + 8}"/>${T(xNm(680), AX.base + 34, '680 nm', 'ps-lab ps-lab-nm', 'middle')}</g></g>`;
}
/** The inset at opacity o, its notch at depth d. */
export function drawAbs(S: Setters, o: number, d: number): void {
  S.op(S.q('abs'), o);
  if (o > 0.004) S.set(S.q('abs-tr'), 'd', absPath(d));
  S.op(S.q('abs-680'), tw(d, 0.55, 0.9));
}

/* ---------------------------------------------------------------- the energy staircase (beat 2) */

export const STAIR = { x: 1104, y: 156, w: 436, h: 368 };
const EV = { p680: 0.66, pheo: 0.505, qa: 0.14, qb: -0.04 };
const yE = (e: number): number => STAIR.y + 92 + (EV.p680 - e) * 330;
const LV = [EV.p680, EV.pheo, EV.qa, EV.qb];
const SX0 = STAIR.x + 84, SW = 86;
export function stairSvg(): string {
  let d = '';
  LV.forEach((e, i) => { const x0 = SX0 + i * SW, x1 = x0 + SW - 14; d += `M${x0},${f1(yE(e))}H${x1}`; if (i < 3) d += `M${x1},${f1(yE(e))}L${x1 + 14},${f1(yE(LV[i + 1]))}`; });
  const ax = STAIR.x + 42;
  const name = ['excited P680', 'pheophytin', 'Q<tspan class="ps-sub" dy="6">A</tspan>', 'Q<tspan class="ps-sub" dy="6">B</tspan>'];
  return `<g data-k="stair" opacity="0"><path class="ps-card" d="${cutPath(STAIR.x, STAIR.y, STAIR.w, STAIR.h, 73, 2.4)}"/>
    <path class="ps-axis" d="M${ax},${STAIR.y + STAIR.h - 24}V${STAIR.y + 24}"/><path class="ps-axhead" d="M${ax - 7},${STAIR.y + 38}L${ax},${STAIR.y + 24}L${ax + 7},${STAIR.y + 38}"/>
    <text class="ps-ax" transform="translate(${ax - 14} ${STAIR.y + STAIR.h / 2 + 6}) rotate(-90)" text-anchor="middle">energy</text>
    <path class="ps-rung" d="${d}"/>
    ${LV.map((e, i) => `<text class="ps-lab ps-lab-st" x="${SX0 + i * SW}" y="${f1(yE(e) - 14)}">${name[i]}</text>`).join('')}
    <circle class="ps-sdot" data-k="sdot" r="10"/></g>`;
}
/** The staircase at opacity o, its electron at hop progress x (0–3). */
export function drawStair(S: Setters, o: number, hops: number): void {
  S.op(S.q('stair'), o);
  const x = hops >= 0 ? hopX(hops) : 0, k = Math.min(2, Math.floor(x)), u = x - k;
  const px = SX0 + k * SW + (SW - 14) / 2 + u * SW, py = lerp(yE(LV[k]), yE(LV[k + 1]), smooth((u - 0.35) / 0.4));
  S.set(S.q('sdot'), 'cx', f1(px)); S.set(S.q('sdot'), 'cy', f1(py));
}

/* ---------------------------------------------------------------- clippings */

export const KOK_CLIP: Clip = { name: 'Bessel Kok', year: '1956', finding: '', key: '', photo: kokImg, alt: kokImg };
export const KOK_H = (w: number): number => clipHeight(w, KOK_CLIP);
export const kokClip = (p: string, x: number, y: number, w: number, rot = -2): string => clipping(p, x, y, w, KOK_CLIP, rot, 19);
/** Height of the Ruben–Kamen clipping drawn w wide. */
export const rkClipH = (w: number): number => w * 0.86;
/** The newsprint clipping with both halftone portraits, their names and the year (as antenna-common's pairClip). */
export function rkClip(p: string, x: number, y: number, w: number, rot = -2, seed = 29): string {
  const h = rkClipH(w), m = w * 0.06, pw = (w - 3 * m) / 2, ph = pw * 1.25, ny = y + m + ph + w * 0.085, yy = ny + w * 0.1;
  const por = (href: string, px: number): string => `<image href="${href}" x="${f1(px)}" y="${f1(y + m)}" width="${f1(pw)}" height="${f1(ph)}" preserveAspectRatio="xMidYMid slice"/>`;
  return `<g class="clip" transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${p}-rksh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${p}-rksh)"/>
    ${por(rubenImg, x + m)}${por(kamenImg, x + 2 * m + pw)}
    <text class="clip-name" x="${f1(x + m + pw / 2)}" y="${f1(ny)}" text-anchor="middle" font-size="${f1(w * 0.082)}">Ruben</text>
    <text class="clip-name" x="${f1(x + 2 * m + 1.5 * pw)}" y="${f1(ny)}" text-anchor="middle" font-size="${f1(w * 0.082)}">Kamen</text>
    <text class="clip-find" x="${f1(x + w / 2)}" y="${f1(yy)}" text-anchor="middle" font-size="${f1(w * 0.088)}">1941</text>
  </g>`;
}

/* ---------------------------------------------------------------- the flask: algae given heavy-oxygen water (beat 3) */

/** The flask scene's own frame (stage px at rest). */
export const FL = { c: [860, 492] as V, R: 150, liq: 392, neck: 30, lip: 214 };
/** The alga the look-a camera dives into. */
export const FL_ALGA: V = [902, 552];
const ALGAE: V[] = (() => {
  const r = rng(47), out: V[] = [FL_ALGA];
  while (out.length < 64) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (FL.R - 14), p: V = [FL.c[0] + Math.cos(a) * d, FL.c[1] + Math.sin(a) * d];
    if (p[1] > FL.liq + 10 && !out.some(o => Math.hypot(o[0] - p[0], o[1] - p[1]) < 15)) out.push(p);
  }
  return out;
})();
/** Bubbles: start (an alga), start time, how high the O₂ rises above the neck. */
const BUB: Array<{ p: V; t0: number; top: number }> = [
  { p: [826, 600], t0: 0.75, top: 252 }, { p: [902, 572], t0: 0.95, top: 290 }, { p: [790, 520], t0: 1.15, top: 328 },
  { p: [944, 610], t0: 1.4, top: 0 }, { p: [858, 618], t0: 1.6, top: 0 }, { p: [770, 590], t0: 1.78, top: 0 }, { p: [930, 520], t0: 1.92, top: 0 },
];
export const FLASK_DONE = 2.4;
const DROP_TIP: V = [884, 196];
export function flaskSvg(p: string, look: Look): string {
  const [cx, cy] = FL.c, R = FL.R, n = FL.neck;
  const ny = cy - Math.sqrt(R * R - n * n);
  const algae = ALGAE.map(c => `<circle class="ps-alga" cx="${f1(c[0])}" cy="${f1(c[1])}" r="3.8"/>`).join('');
  const bub = BUB.map((_, i) => `<g data-k="${look}bb${i}" opacity="0"><circle class="ps-bub" data-k="${look}bc${i}" r="12"/><circle class="ps-o18" cx="-4.6" r="4.6"/><circle class="ps-o18" cx="4.6" r="4.6"/></g>`).join('');
  return `<defs><clipPath id="${p}-liq"><circle cx="${cx}" cy="${cy}" r="${R - 3}"/></clipPath><clipPath id="${p}-liqtop"><rect x="${cx - R}" y="${FL.liq}" width="${2 * R}" height="${2 * R}"/></clipPath>
      <linearGradient id="${p}-lampbeam" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3b8" stop-opacity=".95"/><stop offset="1" stop-color="#f7c948" stop-opacity=".18"/></linearGradient></defs>
    <rect class="ps-bench" x="560" y="${cy + R + 4}" width="760" height="14" rx="3"/>
    <path d="M1236,330L1236,420L1006,520L1006,380Z" fill="url(#${p}-lampbeam)" class="ps-beam"/>
    <path class="ps-stand" d="M1290,${cy + R + 4}V420M1250,${cy + R + 4}H1330"/>
    <g transform="rotate(-14 1290 375)"><path class="ps-lamp" d="M1352,340Q1352,332 1344,332H1252L1236,322V428L1252,416H1344Q1352,416 1352,408Z"/><path class="ps-lampwin" d="M1236,322V428"/></g>
    <g clip-path="url(#${p}-liq)"><rect class="ps-liquid" x="${cx - R}" y="${FL.liq}" width="${2 * R}" height="${2 * R}"/>
      <g clip-path="url(#${p}-liqtop)"><circle data-k="${look}mix" class="ps-mix" cx="${DROP_TIP[0] - 30}" cy="${FL.liq}" r="10" opacity="0"/></g>${algae}</g>
    <path class="ps-glass" d="M${cx - n},${FL.lip}V${f1(ny)}A${R},${R} 0 1 0 ${cx + n},${f1(ny)}V${FL.lip}"/>
    <path class="ps-lip" d="M${cx - n - 8},${FL.lip - 4}H${cx + n + 8}"/>
    <path class="ps-glint" d="M${cx - 96},${cy - 54}A110,110 0 0 0 ${cx - 108},${cy + 40}"/>
    ${bub}
    <g class="ps-pip"><path class="ps-pipglass" d="M${DROP_TIP[0] + 18},66L${DROP_TIP[0] + 6},${DROP_TIP[1] - 30}L${DROP_TIP[0]},${DROP_TIP[1]}L${DROP_TIP[0] - 2},${DROP_TIP[1] - 30}L${DROP_TIP[0] + 4},66Z"/>
      <path class="ps-pipliq" d="M${DROP_TIP[0] + 15.5},96L${DROP_TIP[0] + 5},${DROP_TIP[1] - 30}L${DROP_TIP[0] + 0.6},${DROP_TIP[1] - 4}L${DROP_TIP[0] - 0.5},${DROP_TIP[1] - 30}L${DROP_TIP[0] + 5.5},96Z"/>
      <rect class="ps-bulb" x="${DROP_TIP[0] - 2}" y="30" width="30" height="40" rx="12"/></g>
    <g data-k="${look}drop" opacity="0"><path class="ps-drop" d="M0,-12Q7,-2 7,4A7,7 0 0 1 -7,4Q-7,-2 0,-12Z"/></g>
    <g data-k="${look}lw">${T(DROP_TIP[0] + 52, 132, 'heavy-oxygen water', 'ps-lab ps-lab-o18', 'start')}<path class="ps-lead" d="M${DROP_TIP[0] + 44},124L${DROP_TIP[0] + 17},124"/><circle class="ps-lead-dot" cx="${DROP_TIP[0] + 13}" cy="124" r="4"/></g>
    <g data-k="${look}lo" opacity="0">${T(cx - 96, 262, 'heavy-oxygen O₂', 'ps-lab ps-lab-o18', 'end')}<path class="ps-lead" d="M${cx - 88},256L${cx - 24},${FL.lip + 40}"/></g>`;
}
/** The flask's step at f seconds (−1 before it starts): the drop falls (0–0.55 s), the bubbles rise. */
export function drawFlask(S: Setters, look: Look, f: number): void {
  const t = Math.min(f, FLASK_DONE);
  const drop = S.q(`${look}drop`), du = t >= 0 ? clamp01(t / 0.55) : 0;
  S.op(drop, t >= 0 && t < 0.62 ? 1 : 0);
  S.set(drop, 'transform', `translate(${f1(lerp(DROP_TIP[0] - 1, DROP_TIP[0] - 30, du))} ${f1(DROP_TIP[1] + 10 + du * du * (FL.liq - DROP_TIP[1] - 10))})`);
  const mix = S.q(`${look}mix`), mu = t >= 0.55 ? clamp01((t - 0.55) / 0.9) : 0;
  S.op(mix, mu > 0 ? 0.5 * (1 - mu) + 0.16 : 0); S.set(mix, 'r', f1(10 + 330 * smooth(mu)));
  BUB.forEach((b, i) => {
    const el = S.q(`${look}bb${i}`), u = t - b.t0;
    if (u < 0) { S.op(el, 0); return; }
    const surf = FL.liq + 4, v = 230; // px per s in the liquid
    const toNeck = b.top ? 1 : 0.35, yL = b.p[1] - u * v;
    const x = lerp(b.p[0], lerp(b.p[0], FL.c[0] + (i % 2 ? 8 : -8), toNeck), clamp01((b.p[1] - yL) / (b.p[1] - surf)));
    let y = yL;
    if (yL < surf) {
      if (!b.top) { S.op(el, 0); return; }
      const u2 = (surf - yL) / v; // seconds since it reached the surface: the bubble bursts, its O₂ rises out of the neck
      y = surf - smooth(u2 / 0.7) * (surf - b.top);
    }
    S.op(el, tw(u, 0, 0.08));
    S.op(S.q(`${look}bc${i}`), yL < surf ? 0 : 1);
    S.set(el, 'transform', `translate(${f1(x)} ${f1(y)})`);
  });
  S.op(S.q(`${look}lo`), t >= 0 ? tw(t, 1.3, 1.5) : 0);
}
