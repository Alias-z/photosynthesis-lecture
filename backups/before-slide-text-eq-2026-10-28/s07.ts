// Slide 7 · Photosystem II (27 Oct 2026; charge separation and water oxidation merged into one slide, bachelor level).
// Text: research/redo-2026-10-27/DRAFT_PAGES_MECHANISMS.md, row 7. The figures show three things: charge separation across the
// membrane (P680 near the lumen side → Pheo → Q_A → Q_B near the stroma side), water oxidation on the lumen side
// (2 H₂O → O₂ + 4 H⁺ + 4 e⁻ at the Mn₄CaO₅ cluster; the H⁺ stay in the lumen), and plastoquinone reduction with H⁺ from the
// stroma (Q_B + 2 e⁻ + 2 H⁺ → PQH₂, which leaves for the plastoquinone pool). No picosecond times in the labels (lecturer).
// Our renders are from PDB 5XNL (pea PSII–LHCII, Su et al. 2017) in a side frame with the stroma up (work/rcprep.py): the
// whole core monomer (7-psii.png, protein 60 % opaque over the cofactors) and the reaction-centre cofactors (7-rc.png).
// P680 to Q_B is 2.5 nm along the membrane normal in that structure.
// Crops, sources and licences: assets/SOURCES-L1a.md.
import type { PlateText, Variant } from '../types';
import psiiPng from '../../assets/photos/7-psii.png';
import rcPng from '../../assets/photos/7-rc.png';
import memPng from '../../assets/photos/7-membrane.png';
import clusterPng from '../../assets/photos/7-cluster.png';
import channelsPng from '../../assets/photos/7-channels.png';
import kokPng from '../../assets/photos/7-kok.png';
import shevAPng from '../../assets/photos/7-shevela-a.png';
import './s07.css';

export const PLATE: PlateText = {
  n: '7',
  title: 'Photosystem II',
  status: 'draft',
  lead: 'Light drives electrons from water to plastoquinone; O₂ is released and H⁺ stay in the lumen.',
  points: [
    { claim: 'Charge separation.', text: 'The reaction centre sends an electron across the membrane, to plastoquinone' },
    { claim: 'Water splitting.', text: '2 H₂O → O₂ + 4 H⁺ + 4 e⁻<br>The electrons refill the reaction centre; the H⁺ stay in the lumen' },
    { claim: 'Plastoquinone.', text: 'Each takes 2 e⁻ + 2 H⁺ from the stroma and carries them on in the membrane as plastoquinol (PQH₂)<br>Per O₂: 2 plastoquinones take 4 e⁻ + 4 H⁺' },
  ],
  refs: [
    { label: 'Su et al. 2017', url: 'https://doi.org/10.1126/science.aan0327' },
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
    { label: 'Umena et al. 2011', url: 'https://doi.org/10.1038/nature09913' },
    { label: 'Bhowmick et al. 2023', url: 'https://doi.org/10.1038/s41586-023-06038-z' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'PSII in the membrane: water → P680 → plastoquinone (PDB 5XNL)' },
  { id: 'b', name: 'Reaction-centre cofactors: Mn₄CaO₅ → P680 → plastoquinone (PDB 5XNL)' },
  { id: 'c', name: 'PSII in the thylakoid membrane (Shevela 2023, Fig. 3a)' },
  { id: 'd', name: 'Electrons and H⁺ per O₂ (drawn)' },
  { id: 'e', name: 'Mn₄CaO₅ cluster and its H⁺ and O₂ channels' },
  { id: 'f', name: 'Kok cycle: S₀ → S₄, e⁻, H⁺, O₂ (Shevela 2023, Fig. 8b)' },
  { id: 'g', name: 'Primary charge separation (Shevela 2023, Fig. 6a)' },
];

/* ---------- shared parts (after figs/l04b.ts u–z: shot, pill, credit, realSvg) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fs07-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** A subscript inside SVG text (for letters that have no Unicode subscript). */
const sb = (s: string): string => `<tspan class="fs07-sub" dy="5">${s}</tspan><tspan dy="-5">​</tspan>`;

/** A real image: window win = [u0, v0, width, height] (image pixels) shown w wide at x, y. A photo or render sits in a rounded
 *  frame, optionally with a dark credit band; a published figure ('fig') keeps its white ground multiplied into the page.
 *  `hole` = [u0, v0, u1, v1] leaves one corner out of the crop (a panel letter). at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; bw?: number; hole?: [number, number, number, number] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  let band = '';
  if (o.credit) {
    const bw = o.bw ?? w, by = y + h - 22;
    band = `<rect class="fs07-credbg" x="${f(x + w - bw)}" y="${f(by)}" width="${f(bw)}" height="22"/>${T(x + w - 8, by + 15.5, o.credit, 'fs07-cr', 'end')}`;
  }
  const hl = o.hole ? (([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`)(o.hole) : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z${hl}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fs07-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}
/** A leader onto an image: dark line in a light halo, ending in a dot. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fs07-ldh" d="${d}"/><path class="fs07-ldk" d="${d}"/><circle class="fs07-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
const vis = (s: string): number => s.replace(/<[^>]+>/g, '').replace(/​/g, '').length;
/** A label pill centred at (x, y): 'w' white (on images), 't' tinted (on white-ground figures), 'm' amber (a time);
 *  with `to`, a leader from its edge (several targets allowed). */
function pill(x: number, y: number, s: string, to?: Pt | Pt[], kind: 'w' | 't' | 'm' = 'w'): string {
  const w = vis(s) * 8.8 + 22;
  const tos = to === undefined ? [] : (Array.isArray(to[0]) ? to as Pt[] : [to as Pt]);
  const ld = tos.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="fs07-pill-${kind}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fs07-pill', 'middle')}`;
}
/** Grey credit line under a published figure. */
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fs07-crd', a);
/** A panel heading. */
const head = (x: number, y: number, s: string, a: A = 'start'): string => T(x, y, s, 'fs07-h', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fs07" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- images and anchors ---------- */

const PSII: Img = { href: psiiPng, w: 1100, h: 921 };
const RC: Img = { href: rcPng, w: 1056, h: 1200 };
const MEM: Img = { href: memPng, w: 799, h: 682 };
const CLU: Img = { href: clusterPng, w: 446, h: 368 };
const CHA: Img = { href: channelsPng, w: 821, h: 339 };
const KOK: Img = { href: kokPng, w: 967, h: 1156 };
const SA: Img = { href: shevAPng, w: 918, h: 660 };
/** Cofactor centres in 7-psii.png (pixels), written out by work/render/psii.html; ch* = chain centroids. */
const W = {
  P680: [503.3, 399.0], PheoD1: [503.6, 303.7], QA: [480.4, 196.4], QB: [525.4, 190.6], Fe: [500.0, 176.1], OEC: [564.5, 526.9],
  YZ: [578.0, 479.1], CP47: [272.8, 442.9], CP43: [736.6, 400.9], PsbO: [504.4, 689.2],
} satisfies Record<string, Pt>;
/** Cofactor centres in 7-rc.png (pixels), written out by work/render/rc.html. */
const R = {
  P680: [515.0, 740.0], PheoD1: [766.6, 484.2], QA: [738.9, 196.6], QB: [381.3, 183.0], Fe: [554.1, 143.2], OEC: [793.1, 1083.2], YZ: [748.0, 955.7],
} satisfies Record<string, Pt>;
const CR = {
  own: 'Own render · PDB 5XNL, pea (Su et al. 2017)',
  mem: 'Shevela et al. 2023, Photosynth Res, Fig. 3a · CC BY 4.0',
  kok: 'Shevela et al. 2023, Photosynth Res, Fig. 8b · CC BY 4.0',
  shevA: 'Shevela et al. 2023, Photosynth Res, Fig. 6a · CC BY 4.0',
  clu: 'Umena et al. 2011, Nature, Fig. 2b · © Springer Nature',
  cha: 'Bhowmick et al. 2023, Nature, Fig. 5 (iv) · CC BY 4.0',
};
const Q = (s: string): string => `Q${sb(s)}`;

/** Electron-transfer arrow: blue line in a light halo with a head; c = optional control point (curve). */
function eArrow(p: string, a: Pt, b: Pt, c?: Pt): string {
  const d = c ? `M${f(a[0])},${f(a[1])} Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}` : `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])}`;
  return `<path class="fs07-eh" d="${d}"/><path class="fs07-e" d="${d}" marker-end="url(#${p}-e)"/>`;
}
const defs = (p: string): string => `<defs>${[['e', 'fs07-eh2'], ['h', 'fs07-hh'], ['x', 'fs07-xh'], ['k', 'fs07-kh'], ['o', 'fs07-oh']].map(([k, c]) =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path class="${c}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
/** Shorten a segment by r0 and r1 at its ends (so arrows stop short of a cofactor). */
function trim(a: Pt, b: Pt, r0: number, r1 = r0): [Pt, Pt] {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  return [[a[0] + (dx * r0) / L, a[1] + (dy * r0) / L], [b[0] - (dx * r1) / L, b[1] - (dy * r1) / L]];
}
/** H⁺ arrow (red-brown), optionally curved, with its label at the tail. */
function hArrow(p: string, a: Pt, b: Pt, s: string, la: A = 'middle', dy = -10, c?: Pt): string {
  const d = c ? `M${f(a[0])},${f(a[1])} Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}` : `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])}`;
  return `<path class="fs07-hh0" d="${d}"/><path class="fs07-hp" d="${d}" marker-end="url(#${p}-h)"/>${s ? T(a[0], a[1] + dy, s, 'fs07-hl', la) : ''}`;
}
/** O₂ / water arrow (grey-blue). */
function oArrow(p: string, a: Pt, b: Pt, c?: Pt): string {
  const d = c ? `M${f(a[0])},${f(a[1])} Q${f(c[0])},${f(c[1])} ${f(b[0])},${f(b[1])}` : `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])}`;
  return `<path class="fs07-hh0" d="${d}"/><path class="fs07-op" d="${d}" marker-end="url(#${p}-o)"/>`;
}
/** Excitation energy arriving: a wavy amber arrow. */
function excite(p: string, a: Pt, b: Pt, n = 5, amp = 6): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60, w = Math.sin(t * n * 2 * Math.PI) * amp * (t < 0.85 ? 1 : (1 - t) / 0.15); pts.push(`${i ? 'L' : 'M'}${f(a[0] + dx * t - uy * w)},${f(a[1] + dy * t + ux * w)}`); }
  return `<path class="fs07-xw" d="${pts.join('')}"/><path class="fs07-x" d="${pts.join('')}" marker-end="url(#${p}-x)"/>`;
}
const zone = (x: number, y: number, s: string, a: A = 'start'): string => T(x, y, s, 'fs07-side', a);

/* a · the whole PSII core in the membrane (our render): water → Mn₄CaO₅ → P680 → Pheo → Q_A → Q_B; H⁺ out into the lumen,
 *     H⁺ in from the stroma */

function drawA(): string {
  const p = 'fs07a';
  const a = shot(`${p}-a`, PSII, 156, 36, 614);
  const at = (q: Pt): Pt => a.at(q[0], q[1]);
  const c = at(W.P680), ph = at(W.PheoD1), qa = at(W.QA), qb = at(W.QB), fe = at(W.Fe), oec = at(W.OEC), yz = at(W.YZ);
  return realSvg('Our render of one photosystem II core from the side (pea, PDB 5XNL), stroma up, lumen down, with the extrinsic proteins on the lumen side. Excitation energy from the antenna reaches P680. An electron moves up through pheophytin and QA to QB near the stroma side; QB takes up 2 H+ from the stroma and leaves as PQH2 for the plastoquinone pool. P680+ is refilled from the Mn4CaO5 cluster on the lumen side, which splits 2 H2O into O2, 4 H+ and 4 electrons; the H+ and the O2 are released into the lumen.', `
    ${defs(p)}
    ${zone(14, 28, 'stroma')}${zone(14, 590, 'lumen')}
    ${a.svg}
    ${excite(p, [30, c[1] - 30], [c[0] - 24, c[1] - 2], 6, 6)}${pill(98, c[1] - 58, 'excitation energy', undefined, 't')}
    ${eArrow(p, [c[0] + 4, c[1] - 14], [ph[0] + 4, ph[1] + 14])}${eArrow(p, [ph[0] - 2, ph[1] - 16], [qa[0] + 2, qa[1] + 12])}${eArrow(p, [qa[0] + 4, qa[1] - 10], [qb[0] + 2, qb[1] - 12], [fe[0], fe[1] - 26])}
    ${eArrow(p, [oec[0] - 6, oec[1] - 14], [c[0] + 14, c[1] + 12], [yz[0] - 12, yz[1] - 18])}
    ${T(c[0] + 24, (c[1] + ph[1]) / 2 + 6, 'e⁻', 'fs07-el')}${T(oec[0] + 4, (oec[1] + c[1]) / 2 + 6, 'e⁻', 'fs07-el')}
    ${hArrow(p, [qb[0] + 96, 26], [qb[0] + 10, qb[1] - 16], '2 H⁺', 'start', 6)}
    <path class="fs07-pq" d="M${f(qb[0] - 12)},${f(qb[1] - 6)} Q${f(qb[0] - 120)},${f(qb[1] - 40)} 150,${f(qb[1] - 30)}" marker-end="url(#${p}-k)"/>
    ${T(84, qb[1] - 46, 'PQH₂ → PQ pool', 'fs07-k', 'middle')}
    ${hArrow(p, [oec[0] - 10, oec[1] + 14], [258, 556], '', 'middle', 0, [oec[0] - 120, oec[1] + 120])}${T(250, 548, '4 H⁺', 'fs07-hl', 'end')}
    ${oArrow(p, [oec[0] + 14, oec[1] + 12], [700, 540], [oec[0] + 120, oec[1] + 120])}${T(710, 548, 'O₂', 'fs07-ol')}
    ${pill(698, c[1] - 6, 'P680', [c[0] + 18, c[1] - 2], 't')}${pill(698, qb[1] + 6, Q('B'), [qb[0] + 16, qb[1] + 2], 't')}
    ${pill(698, oec[1] - 46, 'Mn₄CaO₅', [oec[0] + 14, oec[1] - 6], 't')}${pill(698, oec[1] - 8, '2 H₂O → O₂ + 4 H⁺ + 4 e⁻', undefined, 'w')}
    ${credit(786, 594, CR.own)}
  `);
}

/* b · the reaction-centre cofactors enlarged (our render): Mn₄CaO₅ → Y_Z → P680 → Pheo → Q_A → Q_B */

function drawB(): string {
  const p = 'fs07b';
  const a = shot(`${p}-a`, RC, 236, 30, 434);
  const at = (q: Pt): Pt => a.at(q[0], q[1]);
  const c = at(R.P680), ph = at(R.PheoD1), qa = at(R.QA), qb = at(R.QB), fe = at(R.Fe), yz = at(R.YZ), oec = at(R.OEC);
  return realSvg('Our render of the photosystem II reaction-centre cofactors from the side (pea, PDB 5XNL), stroma up, lumen down. Excitation energy reaches P680 near the lumen side. The electron moves from P680 to pheophytin, to QA and across the non-heme iron to QB near the stroma side, 2.5 nanometres higher; QB takes up 2 H+ from the stroma and leaves as PQH2. Below P680, the tyrosine YZ refills P680+ with electrons from the Mn4CaO5 cluster, which splits water and releases O2 and H+ into the lumen.', `
    ${defs(p)}
    ${zone(14, 28, 'stroma')}${zone(14, 590, 'lumen')}
    ${a.svg}
    ${excite(p, [60, c[1] + 76], [c[0] - 46, c[1] + 12])}${pill(118, c[1] + 104, 'excitation energy', undefined, 't')}
    ${eArrow(p, ...trim([c[0] + 18, c[1] - 6], ph, 4, 22))}${eArrow(p, ...trim(ph, qa, 22, 18))}${eArrow(p, [qa[0] - 18, qa[1] - 8], [qb[0] + 22, qb[1] - 6], [fe[0], fe[1] - 46])}
    ${eArrow(p, [oec[0] - 10, oec[1] - 20], [yz[0] + 2, yz[1] + 16])}${eArrow(p, [yz[0] - 14, yz[1] - 10], [c[0] + 26, c[1] + 22])}
    ${T((ph[0] + c[0]) / 2 + 22, (ph[1] + c[1]) / 2 + 8, 'e⁻', 'fs07-el')}
    ${pill(118, c[1] - 30, 'P680', [c[0] - 36, c[1] - 8], 't')}${pill(732, ph[1], 'Pheo', [ph[0] + 22, ph[1]], 't')}
    ${pill(732, qa[1] + 10, Q('A'), [qa[0] + 16, qa[1] + 4], 't')}${pill(118, qb[1] + 10, Q('B'), [qb[0] - 18, qb[1] + 4], 't')}
    ${pill(732, yz[1] - 4, `Y${sb('Z')}`, [yz[0] + 14, yz[1] - 2], 't')}${pill(732, oec[1] - 12, 'Mn₄CaO₅', [oec[0] + 22, oec[1] - 4], 't')}
    ${hArrow(p, [qb[0] - 36, 28], [qb[0] - 8, qb[1] - 24], '2 H⁺', 'end', 6)}
    <path class="fs07-pq" d="M${f(qb[0] - 22)},${f(qb[1] + 12)} Q${f(qb[0] - 80)},${f(qb[1] + 70)} 150,${f(qb[1] + 86)}" marker-end="url(#${p}-k)"/>
    ${T(110, qb[1] + 112, 'PQH₂ → PQ pool', 'fs07-k', 'middle')}
    ${hArrow(p, [oec[0] - 22, oec[1] + 12], [oec[0] - 112, 574], '', 'middle', 0)}${T(oec[0] - 120, 590, '4 H⁺', 'fs07-hl', 'end')}
    ${oArrow(p, [oec[0] + 2, oec[1] + 22], [oec[0] + 6, 574])}${T(oec[0] + 18, 588, 'O₂', 'fs07-ol')}
    <path class="fs07-br" d="M52,${f(qb[1])} h-10 V${f(c[1])} h10"/><text class="fs07-k" transform="translate(30 ${f((qb[1] + c[1]) / 2)}) rotate(-90)" text-anchor="middle">2.5 nm</text>
    ${credit(786, 22, CR.own)}
  `);
}

/* c · Shevela et al. 2023, Fig. 3a, large, with the two proton labels */

function drawC(): string {
  const p = 'fs07c';
  const a = shot(`${p}-a`, MEM, 14, 40, 600, { fig: true });
  const qb = a.at(470, 333), o2 = a.at(560, 612);
  return realSvg('Photosystem II of plants in the thylakoid membrane (Shevela et al. 2023): light absorbed by LHCII reaches the reaction centre through CP26 and CP43. Electrons move from P680 through pheophytin and QA to QB, which leaves as PQH2 into the membrane. On the lumen side the Mn4CaO5 cluster splits 2 H2O into O2 and 4 H+. Added labels: QB takes up its H+ from the stroma; the 4 H+ from water are released into the lumen.', `
    ${defs(p)}
    ${a.svg}
    ${hArrow(p, [660, 150], [qb[0] + 12, qb[1] - 12], '', 'middle', 0, [560, 170])}${pill(700, 132, 'H⁺ from stroma', undefined, 't')}
    ${pill(700, 452, 'H⁺ into lumen', [o2[0] + 24, o2[1] - 10], 't')}
    ${credit(786, 594, CR.mem)}
  `);
}

/* d · drawn: PSII in the thylakoid membrane, electrons and H⁺ per O₂ (after Shevela et al. 2023, Fig. 3a) */

function drawD(): string {
  const p = 'fs07d';
  const m0 = 226, m1 = 392;
  const cof = (x: number, y: number, s: string, cls: string, r = 25, sub = ''): string =>
    `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/><text class="fs07-cof" x="${x}" y="${y + 6}" text-anchor="middle">${s}${sub ? `<tspan class="fs07-sub" dy="5">${sub}</tspan>` : ''}</text>`;
  const pP: Pt = [410, 352], pPh: Pt = [458, 296], pQA: Pt = [464, 244], pQB: Pt = [366, 242], pMn: Pt = [410, 424];
  return `<svg class="fig-svg fs07" viewBox="0 0 800 600" role="img" aria-label="Drawn scheme of photosystem II in the thylakoid membrane, numbers per O2. Light absorbed by LHCII reaches P680 as excitation energy. Electrons move from P680 near the lumen side through pheophytin and QA to QB near the stroma side; 2 PQ take up 4 electrons and 4 H+ from the stroma and leave as 2 PQH2 into the plastoquinone pool. On the lumen side the Mn4CaO5 cluster takes 4 electrons from 2 H2O; O2 and 4 H+ are released into the lumen.">
    ${defs(p)}
    <rect class="fs07-mem" x="20" y="${m0}" width="760" height="${m1 - m0}"/><path class="fs07-memf" d="M20,${m0} H780 M20,${m1} H780"/>
    ${T(30, 60, 'stroma', 'fs07-zone')}${T(30, 560, 'lumen', 'fs07-zone')}${T(772, m1 + 26, 'thylakoid membrane', 'fs07-k', 'end')}
    ${T(772, 60, 'per O₂', 'fs07-k', 'end')}
    <rect class="fs07-lhc" x="600" y="${m0 + 16}" width="118" height="${m1 - m0 - 32}" rx="18"/>${T(659, (m0 + m1) / 2 + 7, 'LHCII', 'fs07-cofk', 'middle')}
    <rect class="fs07-ps" x="300" y="${m0 - 34}" width="226" height="${m1 - m0 + 94}" rx="30"/>${T(413, m0 - 46, 'PSII', 'fs07-hd', 'middle')}
    ${excite(p, [640, 92], [654, m0 + 8], 4, 7)}${T(640, 80, 'light', 'fs07-k', 'middle')}
    <path class="fs07-xs" d="M600,${f(m1 - 40)} Q520,${f(m1 - 2)} ${pP[0] + 34},${pP[1] + 8}" marker-end="url(#${p}-x)"/>
    ${cof(pP[0], pP[1], 'P680', 'fs07-cP', 32)}${cof(pPh[0], pPh[1], 'Pheo', 'fs07-cPh', 27)}
    ${cof(pQA[0], pQA[1], 'Q', 'fs07-cQ', 22, 'A')}${cof(pQB[0], pQB[1], 'Q', 'fs07-cQ', 22, 'B')}
    <rect class="fs07-mn" x="${pMn[0] - 52}" y="${pMn[1] - 17}" width="104" height="34" rx="8"/>${T(pMn[0], pMn[1] + 6, 'Mn₄CaO₅', 'fs07-cof', 'middle')}
    ${eArrow(p, ...trim(pP, pPh, 33, 29))}${eArrow(p, ...trim(pPh, pQA, 28, 24))}${eArrow(p, ...trim(pQA, pQB, 24, 24))}
    ${eArrow(p, [pMn[0], pMn[1] - 18], [pP[0], pP[1] + 36])}${T(pMn[0] + 12, pMn[1] - 26, '4 e⁻', 'fs07-el')}
    ${hArrow(p, [348, 116], [358, pQB[1] - 26], '4 H⁺', 'middle', -10)}
    <circle class="fs07-cPQ" cx="150" cy="306" r="34"/><text class="fs07-cof" x="150" y="312" text-anchor="middle">2 PQH₂</text>
    <path class="fs07-pq" d="M344,250 Q260,300 190,306" marker-end="url(#${p}-k)"/>${T(150, 362, 'PQ pool', 'fs07-k', 'middle')}
    ${T(250, 524, '2 H₂O', 'fs07-cof', 'middle')}${oArrow(p, [270, 508], [pMn[0] - 56, pMn[1] + 8], [320, 470])}
    ${hArrow(p, [pMn[0] + 10, pMn[1] + 20], [470, 520], '', 'middle', 0, [440, 490])}${T(474, 544, '4 H⁺', 'fs07-hl', 'middle')}
    ${oArrow(p, [pMn[0] + 54, pMn[1] + 6], [590, 500], [540, 440])}${T(604, 512, 'O₂', 'fs07-ol')}
    ${T(780, 594, 'drawn after Shevela et al. 2023, Fig. 3a', 'fs07-crd', 'end')}
  </svg>`;
}

/* e · water oxidation close up: the Mn₄CaO₅ cluster (Umena et al. 2011, Fig. 2b) and its H⁺ and O₂ channels during S₃ → S₀
 *     (Bhowmick et al. 2023, Fig. 5 (iv)) */

function drawE(): string {
  const p = 'fs07e';
  const a = shot(`${p}-a`, CHA, 12, 48, 776, { fig: true, hole: [0, 25, 24, 58] });
  const b = shot(`${p}-b`, CLU, 12, 396, 240, { fig: true, hole: [0, 0, 34, 24] });
  const key = (x: number, y: number, cls: string, s: string): string => `<path class="${cls}" d="M${x},${y - 6} h36"/><path class="fs07-kt ${cls}" d="M${x + 30},${y - 11} l8,5 l-8,5"/>${T(x + 48, y, s, 'fs07-k')}`;
  return realSvg('Top: the Mn4CaO5 cluster during the last step of water oxidation, from X-ray free-electron-laser snapshots (Bhowmick et al. 2023): protons leave through the Cl1 channel towards the lumen, a water enters through the O1 channel, and O2 is released. Bottom: the Mn4CaO5 cluster at 1.9 angstrom resolution (Umena et al. 2011): four manganese, one calcium and five oxygen atoms, with four bound waters W1 to W4.', `
    ${defs(p)}
    ${a.svg}
    ${pill(110, 22, 'H⁺ → lumen', a.at(30, 186), 't')}
    ${credit(786, 386, CR.cha)}
    ${b.svg}
    ${pill(390, 452, '4 Mn, 1 Ca, 5 O', b.at(300, 238), 't')}${pill(390, 500, '4 H₂O: W1–W4', b.at(255, 56), 't')}
    ${key(560, 436, 'fs07-kc', 'H⁺')}${key(560, 470, 'fs07-kw', 'H₂O in')}${key(560, 504, 'fs07-ko2', 'O₂ out')}
    ${credit(786, 594, CR.clu)}
  `);
}

/* f · the Kok cycle with the S-state structures (Shevela et al. 2023, Fig. 8b): one electron per photon, H⁺ and O₂ released */

function drawF(): string {
  const p = 'fs07f';
  const a = shot(`${p}-a`, KOK, 20, 22, 468, { fig: true });
  return realSvg('The Kok cycle of water oxidation (Shevela et al. 2023): each of four light flashes removes one electron from the Mn4CaO5 cluster, which steps through the states S0 to S4; protons are released along the way, and at S4 the cluster releases O2 and returns to S0, taking up new water: 2 H2O gives O2, 4 electrons and 4 H+. Around the cycle, the measured structures of the cluster in each state; none exists for S4.', `
    ${a.svg}
    ${pill(650, 200, 'one e⁻ per photon', a.at(612, 392), 't')}
    ${pill(650, 330, 'H⁺ → lumen', a.at(705, 645), 't')}
    ${pill(650, 440, 'O₂ released', a.at(368, 592), 't')}
    ${credit(786, 594, CR.kok)}
  `);
}

/* g · primary charge separation, Shevela et al. 2023, Fig. 6a, large */

function drawG(): string {
  const p = 'fs07g';
  const a = shot(`${p}-a`, SA, 20, 40, 760, { fig: true });
  return realSvg('Primary charge separation in photosystem II (Shevela et al. 2023): excitation energy reaches the reaction-centre chlorophylls ChlD1, PD1 and PD2 and forms the excited state 1P680*. One electron leaves a chlorophyll and reduces pheophytin D1: excitation energy has become electrochemical energy, the charge-separated state P680+ Pheo−. Two pathways lead there, one starting at ChlD1, one at PD1.', `
    ${a.svg}
    ${credit(780, 594, CR.shevA)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
