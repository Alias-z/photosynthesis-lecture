// Slide 8 (was 9) · Electron transport to NADPH, redo of 27 Oct 2026; text from research/redo-2026-10-27/DRAFT_PAGES_MECHANISMS.md.
// Figure research: research/redo-2026-10-27/A_LIGHT_6-11.md, row 9).
// Focus set by the lecturer on 27 Oct (bachelor students: function and connections): the Z-scheme plus cytochrome b₆f, which
// releases H⁺ into the lumen through the Q cycle and catalyses the rate-limiting step of linear electron transfer (Malone et
// al. 2021, BBA Bioenergetics, abstract), then PSI → ferredoxin → FNR → NADPH. Emerson's enhancement graph: one optional variant.
// Figure variants from real published figures, cropped and labelled sparingly (sources: assets/SOURCES-L1b.md).
// Only the Z-scheme is drawn (variant b, and compact in c), after Govindjee & Veit 2010, on a midpoint-potential axis:
//   H₂O/O₂ +0.82, P680 +1.20, NADP⁺ −0.32, Fd −0.45 V (Johnson 2016 text); P680* = 1.20 − 1.82 eV (680 nm) ≈ −0.62;
//   P700* = 0.45 − 1.77 eV (700 nm) ≈ −1.32; Pheo −0.50, Q_A −0.10, PQ +0.10, b₆f +0.32 (Rieske +0.30, cyt f +0.35),
//   PC +0.37, P700 +0.45, A₀ −1.05, A₁ −0.80, Fe–S (F_X … F_B) −0.62, FNR −0.38: positions as in Govindjee & Veit 2010.
// Emerson et al. 1957, Fig. 3 (Chlorella in culture medium): solid = 20 °C, beam alone; dashed = 5 °C; dotted = 20 °C with
// supplementary light from a mercury–cadmium lamp. Half-yield wavelengths 690 (20 °C) and 718 nm (with added light), p. 138.
import type { PlateText, Variant } from '../types';
import emersonPng from '../../assets/photos/8-emerson.png';
import w25egJpg from '../../assets/photos/8-w25-eg.jpg';
import w25fJpg from '../../assets/photos/8-w25-f.jpg';
import qJpg from '../../assets/photos/8-johnson-q.jpg';
import malonePng from '../../assets/photos/8-malone.png';
import './s09.css';

export const PLATE: PlateText = {
  n: '8',
  title: 'Electron transport to NADPH',
  status: 'draft',
  lead: 'Electrons travel from PSII through cytochrome b₆f and PSI to NADP⁺; light energises them twice.',
  points: [
    { claim: 'Cytochrome b₆f.', text: 'Passes electrons from plastoquinol to plastocyanin<br>Releases H⁺ into the lumen and pumps extra H⁺ (Q cycle)' },
    { claim: 'Photosystem I.', text: 'Light energises the electrons a second time<br>PSI passes them via ferredoxin to NADP⁺, making NADPH in the stroma' },
    { claim: 'Z-scheme.', text: 'PSII makes an oxidant strong enough to split water<br>PSI makes a reductant strong enough to produce NADPH' },
  ],
  refs: [
    { label: 'Emerson et al. 1957', url: 'https://doi.org/10.1073/pnas.43.1.133' },
    { label: 'Govindjee & Veit 2010', url: 'https://www.life.illinois.edu/govindjee/Z-Scheme.html' },
    { label: 'Johnson 2016', url: 'https://doi.org/10.1042/EBC20160016' },
    { label: 'Wietrzynski et al. 2025', url: 'https://doi.org/10.7554/eLife.105496' },
    { label: 'Malone et al. 2019', url: 'https://doi.org/10.1038/s41586-019-1746-6' },
    { label: 'Malone et al. 2021', url: 'https://doi.org/10.1016/j.bbabio.2021.148380' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Z-scheme with cytochrome b₆f' },
  { id: 'b', name: 'Z-scheme + Q cycle at b₆f' },
  { id: 'c', name: 'Q cycle at cytochrome b₆f' },
  { id: 'd', name: 'Cytochrome b₆f: cryo-EM structure + Q cycle' },
  { id: 'e', name: 'Cytochrome b₆f dimer (cryo-EM)' },
  { id: 'f', name: 'PSII and PSI in spinach thylakoids (cryo-ET)' },
  { id: 'g', name: 'Emerson enhancement effect (optional)' },
];

/* ---------- shared helpers (pattern of l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fs09-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

/** A real image: the window win = [u0, v0, width, height] (image pixels) shown w wide at x, y. A published figure ('fig')
 *  keeps its white ground multiplied into the page; a photo gets a rounded frame and a dark credit band. hole = [u0, v0, u1, v1]
 *  leaves one rectangle of the window out (a panel letter or a neighbouring panel's label). at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; hole?: [number, number, number, number] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const band = o.credit ? `<rect class="fs09-credbg" x="${f(x)}" y="${f(y + h - 22)}" width="${f(w)}" height="22"/>${T(x + w - 8, y + h - 6.5, o.credit, 'fs09-cr', 'end')}` : '';
  // The hole is clipped to the window first: a hole reaching outside the window would add that outside part under evenodd.
  const hc = o.hole && [Math.max(o.hole[0], u0), Math.max(o.hole[1], v0), Math.min(o.hole[2], u0 + uw), Math.min(o.hole[3], v0 + vh)];
  const hl = hc && hc[2] > hc[0] && hc[3] > hc[1] ? (([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`)(hc) : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z${hl}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fs09-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fs09-ldh" d="${d}"/><path class="fs09-ldk" d="${d}"/><circle class="fs09-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos and micrographs, tinted on white-ground figures; with `to`, a leader. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false, small = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * (small ? 8 : 8.8) + (small ? 14 : 22), hh = small ? 24 : 28;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), hh / 2 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fs09-pillbg-t' : 'fs09-pillbg'}" x="${f(x - w / 2)}" y="${f(y - hh / 2)}" width="${f(w)}" height="${hh}" rx="${hh / 2}"/>${T(x, y + (small ? 5.5 : 6), s, small ? 'fs09-pills' : 'fs09-pill', 'middle')}`;
}
const sub = (s: string): string => `<tspan class="fs09-sub" dy="4">${s}</tspan><tspan dy="-4">\u200a</tspan>`;
const tw = (cls: string, s: string): string => `<tspan class="${cls}">${s}</tspan>`;
/** A tinted patch over one of the paper's own labels (image pixels u0, v0 … u1, v1), with the term set again. */
function cover(a: Shot, u0: number, v0: number, u1: number, v1: number, s: string): string {
  const [x0, y0] = a.at(u0, v0), [x1, y1] = a.at(u1, v1);
  return `<rect class="fs09-pillbg-t" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" rx="10"/>${T((x0 + x1) / 2, (y0 + y1) / 2 + 6, s, 'fs09-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fs09-crd', a);
const realSvg = (label: string, body: string, defs = ''): string =>
  `<svg class="fig-svg fs09" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs}${body}</svg>`;

const CR = {
  emerson: 'Emerson, Chalmers & Cederstrand 1957, PNAS, Fig. 3 · © PNAS',
  w25: 'Wietrzynski et al. 2025, eLife, Fig. 5E–G · CC BY 4.0',
  q: 'Johnson 2016, Essays Biochem, Fig. 14B · CC BY 4.0',
  malone: 'Malone et al. 2019, Nature, Fig. 1a · © Springer Nature',
  z: 'Drawn after Govindjee & Veit 2010 · potentials: Johnson 2016 · rate-limiting step: Malone et al. 2021',
};

/* ---------- Emerson et al. 1957, Fig. 3, with clean axes drawn over the scan ---------- */

const EMR: Img = { href: emersonPng, w: 408, h: 459 };
// Asset pixels (frame x 2–405, y 2.5–456): x = 18.5 + (λ − 660 nm) · 6.142, y = 394 + (0.02 − Φ) · 3062.5 (ticks measured on the scan).
const emU = (nm: number): number => 18.5 + (nm - 660) * 6.142;
const emV = (q: number): number => 394 + (0.02 - q) * 3062.5;

function emerson(id: string, x: number, y: number, w: number, big: boolean): { svg: string; P: (nm: number, q: number) => Pt; bottom: number; right: number; top: number } {
  const a = shot(id, EMR, x, y, w, { fig: true });
  const P = (nm: number, q: number): Pt => a.at(emU(nm), emV(q));
  const bottom = a.at(0, 456)[1], left = a.at(2, 0)[0], right = a.at(405, 0)[0];
  const tx = [660, 680, 700, 720].map(nm => T(P(nm, 0)[0], bottom + 24, `${nm}`, 'fs09-ax', 'middle')).join('');
  const ty = [0, 0.04, 0.08, 0.12].map(q => T(left - 8, P(660, q)[1] + 7, q === 0 ? '0' : q.toFixed(2), 'fs09-ax', 'end')).join('');
  const midY = (y + bottom) / 2;
  const titles = `${T((left + right) / 2, bottom + 52, 'wavelength (nm)', 'fs09-axt', 'middle')}
    <text class="fs09-axt" transform="translate(${f(left - (big ? 62 : 56))} ${f(midY)}) rotate(-90)" text-anchor="middle">quantum yield (O₂ per photon)</text>`;
  return { svg: `${a.svg}${tx}${ty}${titles}`, P, bottom, right, top: a.at(0, 2.5)[1] };
}

/** Curve labels on the Emerson plot: the red drop (20 °C, beam alone), the restored yield with added light, and 5 °C. */
function emersonLabels(P: (nm: number, q: number) => Pt, big: boolean, right: number, top: number): string {
  const red = P(694.5, 0.027), add = P(704, 0.112), cold = P(706, 0.032);
  if (!big) {
    return `${pill(...P(669, 0.048), 'red drop', red, true)}${pill(P(690, 0)[0], top - 18, '+ Hg–Cd lamp light', add, true)}${T(cold[0] + 10, cold[1] + 6, '5 °C', 'fs09-grey')}`;
  }
  // Half-yield wavelengths read by the authors (p. 138): 690 nm (20 °C, beam alone), 718 nm (20 °C, supplementary light).
  const h1 = P(690, 0.0525), h2 = P(718, 0.0665), key = P(662, 0.012);
  return `${pill(...P(670, 0.052), 'red drop', red, true)}
    ${pill(right + 96, P(0, 0.118)[1], '+ Hg–Cd lamp light', add, true)}
    ${T(cold[0] + 12, cold[1] + 6, '5 °C', 'fs09-grey')}
    <circle class="fs09-ring" cx="${f(h1[0])}" cy="${f(h1[1])}" r="7"/><circle class="fs09-ring" cx="${f(h2[0])}" cy="${f(h2[1])}" r="7"/>
    ${T(h1[0] - 14, h1[1] + 6, '690 nm', 'fs09-red', 'end')}${T(h2[0] - 14, h2[1] + 6, '718 nm', 'fs09-red', 'end')}
    <circle class="fs09-ring" cx="${f(key[0] + 6)}" cy="${f(key[1] - 6)}" r="7"/>${T(key[0] + 20, key[1], 'half of maximum yield', 'fs09-red')}`;
}

/* ---------- Z-scheme on a midpoint-potential axis (drawn, plain) ---------- */

type Pos = 'ar' | 'l' | 'r' | 'b' | 'a' | 'bl' | 'b2';
interface ZNode { k: string; v: number; lab: string; fx: number; fxc?: number; minor?: boolean; pos: Pos; posc?: Pos }
const ZN: ZNode[] = [
  { k: 'h2o', v: 0.82, lab: 'H₂O', fx: 0.03, fxc: 0.05, pos: 'a' },
  { k: 'p680', v: 1.2, lab: 'P680', fx: 0.12, fxc: 0.16, pos: 'r' },
  { k: 'p680x', v: -0.62, lab: 'P680*', fx: 0.12, fxc: 0.16, pos: 'l', posc: 'a' },
  { k: 'pheo', v: -0.5, lab: 'Pheo', fx: 0.19, minor: true, pos: 'ar' },
  { k: 'qa', v: -0.1, lab: 'Q<tspan class="fs09-sub" dy="5">A</tspan>', fx: 0.25, minor: true, pos: 'ar' },
  { k: 'pq', v: 0.1, lab: 'PQ', fx: 0.33, fxc: 0.33, pos: 'ar' },
  { k: 'b6f', v: 0.32, lab: 'b₆f', fx: 0.42, fxc: 0.45, pos: 'ar' },
  { k: 'pc', v: 0.37, lab: 'PC', fx: 0.5, fxc: 0.56, pos: 'ar' },
  { k: 'p700', v: 0.45, lab: 'P700', fx: 0.58, fxc: 0.71, pos: 'b' },
  { k: 'p700x', v: -1.32, lab: 'P700*', fx: 0.58, fxc: 0.71, pos: 'l' },
  { k: 'a0', v: -1.05, lab: 'A₀', fx: 0.64, minor: true, pos: 'ar' },
  { k: 'a1', v: -0.8, lab: 'A₁', fx: 0.69, minor: true, pos: 'ar' },
  { k: 'fes', v: -0.62, lab: 'Fe–S', fx: 0.74, minor: true, pos: 'ar' },
  { k: 'fd', v: -0.45, lab: 'Fd', fx: 0.81, fxc: 0.84, pos: 'ar' },
  { k: 'fnr', v: -0.38, lab: 'FNR', fx: 0.88, pos: 'ar' },
  { k: 'nadp', v: -0.32, lab: 'NADP⁺ → NADPH', fx: 0.955, fxc: 0.95, pos: 'bl', posc: 'b2' },
];
const ZE: [string, string][] = [['h2o', 'p680'], ['p680x', 'pheo'], ['pheo', 'qa'], ['qa', 'pq'], ['pq', 'b6f'], ['b6f', 'pc'], ['pc', 'p700'],
  ['p700x', 'a0'], ['a0', 'a1'], ['a1', 'fes'], ['fes', 'fd'], ['fd', 'fnr'], ['fnr', 'nadp']];

const zDefs = (p: string): string => `<defs>
  <marker id="${p}-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto"><path class="fs09-hd-ink" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-lt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto"><path class="fs09-hd-lt" d="M0,0L10,5L0,10z"/></marker></defs>`;

/** The Z-scheme in the box x0…x0+w, y0…y0+h; the axis runs from −1.4 V (top) to +1.3 V (bottom). Compact leaves out the
 *  carriers inside the photosystems (Pheo, Q_A, A₀, A₁, Fe–S, defined on slide 7) and FNR, and the key. */
function zscheme(p: string, x0: number, y0: number, w: number, h: number, compact: boolean): string {
  const vT = -1.4, vB = 1.3, yV = (v: number): number => y0 + ((v - vT) / (vB - vT)) * h;
  const ax = x0 + (compact ? 50 : 54), area0 = ax + 22, aw = x0 + w - area0;
  const nodes = ZN.filter(n => !compact || n.fxc !== undefined);
  const at = new Map(nodes.map(n => [n.k, [area0 + (compact ? (n.fxc as number) : n.fx) * aw, yV(n.v)] as Pt]));
  // In compact mode the chain skips the carriers left out: P680* → PQ and P700* → Fd → NADP⁺.
  const edges: [string, string][] = compact ? [['h2o', 'p680'], ['p680x', 'pq'], ['pq', 'b6f'], ['b6f', 'pc'], ['pc', 'p700'], ['p700x', 'fd'], ['fd', 'nadp']] : ZE;
  const seg = (a: Pt, b: Pt, r = 7): string => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    return `<path class="fs09-zl" d="M${f(a[0] + ux * r)},${f(a[1] + uy * r)} L${f(b[0] - ux * (r + 2))},${f(b[1] - uy * (r + 2))}" marker-end="url(#${p}-ink)"/>`;
  };
  const lines = edges.map(([a, b]) => seg(at.get(a) as Pt, at.get(b) as Pt)).join('');
  const light = (a: Pt, b: Pt, name: string): string => `<path class="fs09-zlt" d="M${f(a[0])},${f(a[1] - 9)} L${f(b[0])},${f(b[1] + 12)}" marker-end="url(#${p}-lt)"/>
    ${T(a[0] - 14, (a[1] + b[1]) / 2 - 4, name, 'fs09-zps', 'end')}${T(a[0] - 14, (a[1] + b[1]) / 2 + 20, 'light', 'fs09-zlab', 'end')}`;
  const ps = `${light(at.get('p680') as Pt, at.get('p680x') as Pt, 'PSII')}${light(at.get('p700') as Pt, at.get('p700x') as Pt, 'PSI')}`;
  const lab = (n: ZNode): string => {
    const [x, y] = at.get(n.k) as Pt, cls = n.minor ? 'fs09-zmin' : 'fs09-zlab', pos = (compact && n.posc) || n.pos;
    const dot = `<circle class="${n.minor ? 'fs09-zdm' : 'fs09-zd'}" cx="${f(x)}" cy="${f(y)}" r="${n.minor ? 4.5 : 6}"/>`;
    const t = pos === 'ar' ? T(x + 7, y - 12, n.lab, cls) : pos === 'l' ? T(x - 13, y + 7, n.lab, cls, 'end')
      : pos === 'r' ? T(x + 13, y + 7, n.lab, cls) : pos === 'b' ? T(x, y + 30, n.lab, cls, 'middle')
      : pos === 'bl' ? T(x + 24, y + 30, n.lab, cls, 'end')
      : pos === 'b2' ? `${T(x, y + 30, n.lab.split(' → ')[0], cls, 'middle')}${T(x, y + 54, `→ ${n.lab.split(' → ')[1]}`, cls, 'middle')}` : T(x, y - 14, n.lab, cls, 'middle');
    return dot + t;
  };
  const ticks = [-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map(v => `<path class="fs09-zax" d="M${f(ax - 6)},${f(yV(v))} H${f(ax)}"/>${T(ax - 10, yV(v) + 6, v === 0 ? '0' : `${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(1)}`, 'fs09-ax', 'end')}`).join('');
  const axis = `<path class="fs09-zax" d="M${f(ax)},${f(y0)} V${f(y0 + h)}"/>${ticks}
    <text class="fs09-axt" x="${f(ax)}" y="${f(y0 - 10)}" text-anchor="middle"><tspan font-style="italic">E</tspan><tspan class="fs09-sub" dy="5">m</tspan><tspan dy="-5"> (V)</tspan></text>`;
  const h2o = at.get('h2o') as Pt, nadp = at.get('nadp') as Pt;
  const p680 = at.get('p680') as Pt, p700x = at.get('p700x') as Pt;
  const vals = `${T(p680[0] + 74, p680[1] + 7, '+1.2 V', 'fs09-val')}${T(p700x[0] - 82, p700x[1] + 7, '≈ −1.3 V', 'fs09-val', 'end')}${T(h2o[0], h2o[1] - 38, '+0.82 V', 'fs09-val', 'middle')}${compact ? T(nadp[0], nadp[1] + 76, '−0.32 V', 'fs09-val', 'middle') : T(nadp[0] + 24, nadp[1] + 52, '−0.32 V', 'fs09-val', 'end')}`;
  // Cytochrome b₆f marked: a ring, and in the full scheme a note on its two roles.
  const bf = at.get('b6f') as Pt;
  const ring = `<circle class="fs09-bring" cx="${f(bf[0])}" cy="${f(bf[1])}" r="13"/>`;
  const note = compact ? '' : `<path class="fs09-zax" d="M${f(bf[0])},${f(bf[1] + 13)} V${f(bf[1] + 44)}"/>
    <rect class="fs09-pillbg-t" x="${f(bf[0] - 150)}" y="${f(bf[1] + 44)}" width="214" height="60" rx="12"/>
    ${T(bf[0] - 43, bf[1] + 68, 'Q cycle → H⁺ into lumen', 'fs09-pill', 'middle')}${T(bf[0] - 43, bf[1] + 93, 'rate-limiting step', 'fs09-pill', 'middle')}`;
  const key = compact ? '' : [['PQ', 'plastoquinone'], ['b₆f', 'cytochrome b₆f complex'], ['PC', 'plastocyanin'], ['Fd', 'ferredoxin'], ['FNR', 'ferredoxin–NADP⁺ reductase']]
    .map(([a, b], i) => `<text class="fs09-key" x="${f(x0 + 542)}" y="${f(yV(0.74) + i * 23)}"><tspan class="fs09-keyb">${a}</tspan>  ${b}</text>`).join('');
  return `${axis}${lines}${ps}${ring}${nodes.map(lab).join('')}${vals}${key}${note}`;
}

/* ---------- Q cycle at cytochrome b₆f (Johnson 2016, Fig. 14B), its small labels set again ---------- */

const QC: Img = { href: qJpg, w: 398, h: 447 };
// Asset pixels: membrane y 84–257; labels: 2 H⁺ (243, 46), PQ (298, 110), PQH₂ (303, 189), 2 PQ (48, 147), 2 PQH₂ (45, 219),
// 4 H⁺ (88, 307), 2 PC_ox (312, 308), 2 PC_red (318, 382), red 2 e⁻ at (183, 101), (188, 171), (135, 186), (155, 239), (170, 299);
// stroma (372, 69), thylakoid (372, 167), lumen (372, 274). The hole leaves out panel letter B and the end of panel A's label.
function qcycle(p: string, x: number, y: number, w: number, side: boolean): { svg: string; a: Shot } {
  const a = shot(`${p}-q`, QC, x, y, w, { fig: true, hole: [0, 0, 100, 64] });
  const e = [[183, 101], [188, 171], [135, 186], [155, 239], [170, 299]].map(([u, v]) => pill(...a.at(u, v), tw('fs09-c-e', '2 e⁻'), undefined, false, true)).join('');
  const sides = side ? `${pill(...a.at(372, 69), 'stroma', undefined, true)}${pill(...a.at(372, 167), 'membrane', undefined, true)}${pill(...a.at(372, 274), 'lumen', undefined, true)}` : '';
  return { a, svg: `${a.svg}${e}
    ${pill(...a.at(243, 44), tw('fs09-c-h', '2 H⁺'), undefined, false, true)}${pill(...a.at(88, 309), tw('fs09-c-h', '4 H⁺'), undefined, false, true)}
    ${pill(...a.at(300, 110), 'PQ', undefined, false, true)}${pill(...a.at(306, 190), `PQH${sub('2')}`, undefined, false, true)}
    ${pill(...a.at(46, 147), '2 PQ', undefined, false, true)}${pill(...a.at(44, 220), `2 PQH${sub('2')}`, undefined, false, true)}
    ${pill(...a.at(312, 308), `2 PC${sub('ox')}`)}${pill(...a.at(318, 382), `2 PC${sub('red')}`)}${sides}` };
}

/* ---------- a · Z-scheme with cytochrome b₆f, drawn plainly on the midpoint-potential axis ---------- */

function drawA(): string {
  const p = 'fs09a';
  return realSvg('The Z-scheme on an axis of midpoint potential, from minus 1.4 volts at the top to plus 1.3 volts at the bottom. Water at plus 0.82 volts gives electrons to P680 at plus 1.2 volts; light raises P680 to P680 star in photosystem II. Electrons then run downhill through pheophytin and Q A to plastoquinone, the cytochrome b6f complex and plastocyanin to P700. Cytochrome b6f is marked: through the Q cycle it releases protons into the lumen, and it is the rate-limiting step of linear electron flow. Light raises P700 to P700 star in photosystem I; electrons run through A0, A1 and the iron–sulphur clusters to ferredoxin, ferredoxin–NADP+ reductase and NADP+, which becomes NADPH, at minus 0.32 volts.',
    `${zscheme(p, 6, 36, 788, 534, false)}${credit(790, 596, CR.z)}`, zDefs(p));
}

/* ---------- b · Z-scheme beside the Q cycle at b₆f ---------- */

function drawB(): string {
  const p = 'fs09b', q = qcycle(p, 424, 92, 326, true);
  const bf = q.a.at(200, 20);
  return realSvg('Left: the Z-scheme on an axis of midpoint potential, from water at plus 0.82 volts through photosystem II, plastoquinone, cytochrome b6f, plastocyanin and photosystem I to ferredoxin and NADP+ at minus 0.32 volts; cytochrome b6f is ringed. Right: the Q cycle at cytochrome b6f: two plastoquinols are oxidised on the lumen side and release 4 protons into the lumen; 2 electrons go to plastocyanin, 2 return across the membrane to reduce a plastoquinone, which takes up 2 protons from the stroma.', `
    ${zscheme(p, 4, 56, 380, 500, true)}
    ${q.svg}
    ${pill(bf[0], 60, 'Q cycle at b₆f', undefined, true)}
    ${credit(384, 594, 'after Govindjee & Veit 2010')}${credit(790, 594, CR.q)}
  `, zDefs(p));
}

/* ---------- c · Q cycle at cytochrome b₆f, large ---------- */

function drawC(): string {
  const p = 'fs09c', q = qcycle(p, 140, 8, 500, true);
  return realSvg('The Q cycle on the structure of cytochrome b6f, membrane as a grey band with stroma above and lumen below. Two plastoquinols are oxidised at the lumen-side site: they release 4 protons into the lumen and 4 electrons. Two electrons go through the iron–sulphur cluster and cytochrome f to two plastocyanins; two go back across the membrane through the b haems to reduce a plastoquinone at the stroma-side site, which takes up 2 protons from the stroma.', `
    ${q.svg}
    ${credit(790, 594, CR.q)}
  `);
}

/* ---------- d · cytochrome b₆f: cryo-EM structure (Malone 2019) beside the Q cycle (Johnson 2016) ---------- */

const MAL: Img = { href: malonePng, w: 612, h: 442 };
function drawD(): string {
  const p = 'fs09d';
  const a = shot(`${p}-a`, MAL, 14, 150, 400, { fig: true });
  const q = qcycle(p, 414, 70, 340, true);
  return realSvg('Left: cryo-EM density of the spinach cytochrome b6f dimer, side view in the membrane, stroma above and lumen below. Right: the Q cycle drawn on one monomer: plastoquinol oxidation releases 4 protons into the lumen per 2 electrons passed to plastocyanin.', `
    ${a.svg}${q.svg}
    ${cover(a, 0, 38, 136, 70, 'stroma')}${cover(a, 0, 258, 132, 290, 'lumen')}
    ${pill(214, 112, 'cytochrome b₆f dimer', undefined, true)}${pill(584, 40, 'Q cycle', undefined, true)}
    ${pill(400, 556, 'b₆f: rate-limiting step of linear electron flow', undefined, true)}
    ${credit(410, 594, 'Malone et al. 2019, Nature, Fig. 1a · © Springer Nature')}${credit(790, 594, 'Johnson 2016, Fig. 14B · CC BY 4.0')}
  `);
}

/* ---------- e · Cytochrome b₆f dimer, cryo-EM (Malone et al. 2019, Fig. 1a) ---------- */

/** A short horizontal arrow from a side label towards the complex: where the carrier comes from, not a binding site. */
const arrow = (p: string, x0: number, y: number, x1: number): string => `<path class="fs09-zl" d="M${f(x0)},${f(y)} H${f(x1)}" marker-end="url(#${p}-ink)"/>`;
function drawE(): string {
  const p = 'fs09e';
  const a = shot(`${p}-a`, MAL, 228, 20, 560, { fig: true });
  const yq = a.at(0, 170)[1], yp = a.at(0, 380)[1];
  return realSvg('Cryo-EM density of the spinach cytochrome b6f dimer at 3.6 ångström, side view in the membrane (grey band), stroma above and lumen below, each subunit in its own colour. Plastoquinol from photosystem II reaches it within the membrane; plastocyanin carries electrons on from its lumen side to photosystem I.', `
    ${a.svg}${cover(a, 0, 38, 136, 70, 'stroma')}${cover(a, 0, 258, 132, 290, 'lumen')}
    ${pill(100, yq, 'PQH₂ from PSII', undefined, true)}${arrow(p, 178, yq, 222)}
    ${pill(100, yp, 'PC to PSI', undefined, true)}${arrow(p, 222, yp, 178)}
    ${pill(478, 540, 'PSII → PQ → b₆f → PC → PSI', undefined, true)}
    ${credit(790, 594, CR.malone)}
  `, zDefs(p));
}

/* ---------- f · Spinach thylakoids, cryo-ET (Wietrzynski et al. 2025, Fig. 5E–G) ---------- */

const W25EG: Img = { href: w25egJpg, w: 1400, h: 747 };
const W25F: Img = { href: w25fJpg, w: 530, h: 201 };
// Particle colours of the paper: PSII blue, cyt b₆f orange, PSI green, ATP synthase pink; membrane domains teal (appressed), yellow (non-appressed).
function drawF(): string {
  const p = 'fs09f';
  const a = shot(`${p}-a`, W25EG, 20, 36, 760, { fig: true });
  const k = shot(`${p}-k`, W25F, 24, 450, 380, { fig: true });
  return realSvg('Top: membranograms from cryo-electron tomography of an intact spinach chloroplast, one thylakoid membrane seen from its stromal and its luminal side; colour strips mark appressed grana membrane (teal) and non-appressed membrane (yellow). Below: the same membrane surfaces with every particle mapped: photosystem II (blue) only on the luminal side of appressed membrane, photosystem I (green) and ATP synthase (pink) only on the stromal side of non-appressed membrane, cytochrome b6f (orange) in both. Bottom: the four structures used as templates.', `
    ${a.svg}${k.svg}
    ${pill(...a.at(46, 12), 'stroma side', undefined, true)}${pill(...a.at(46, 204), 'lumen side', undefined, true)}
    ${pill(...a.at(46, 400), 'stroma side', undefined, true)}${pill(...a.at(46, 582), 'lumen side', undefined, true)}
    ${pill(a.at(900, 0)[0], 16, `${tw('fs09-c-teal', 'appressed')} (grana)`, a.at(900, 24), true)}${pill(a.at(488, 0)[0], 16, `${tw('fs09-c-yel', 'non-appressed')} (stroma lamella)`, a.at(488, 14), true)}
    ${pill(...k.at(85, 50), tw('fs09-c-psii', 'PSII'), undefined, true)}${pill(...k.at(232, 50), tw('fs09-c-b6f', 'b₆f'), undefined, true)}
    ${pill(...k.at(355, 50), tw('fs09-c-psi', 'PSI'), undefined, true)}${pill(500, 486, tw('fs09-c-atp', 'ATP synthase'), k.at(470, 70), true)}
    ${credit(790, 594, CR.w25)}
  `);
}

/* ---------- g · Emerson enhancement effect: Fig. 3 large (optional) ---------- */

function drawG(): string {
  const e = emerson('fs09g-e', 150, 14, 452, true);
  return realSvg('Quantum yield of photosynthesis of Chlorella cells, oxygen per photon, against the wavelength of a monochromatic beam from 660 to 720 nanometres. At 20 °C with the beam alone (solid line) the yield is about 0.105 up to 680 nanometres and falls steeply beyond 685 nanometres, the red drop, reaching half its maximum at 690 nanometres. With supplementary light from a mercury–cadmium lamp added (dotted line) the yield stays near 0.13 to 700 nanometres and reaches half its maximum only at 718 nanometres. A dashed curve shows 5 °C.', `
    ${e.svg}${emersonLabels(e.P, true, e.right, e.top)}
    ${credit(790, 592, CR.emerson)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
