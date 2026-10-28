// Slide C08 · C₂ photosynthesis moves CO₂ release. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Since 27 Oct 2026 (order variant 1, research/figure-briefs/ORDER_LECTURE2.md) this slide also carries C07's material:
// its text opens with C₃ refixation (Busch 2013), and C07's ten figures are listed here as k–t, drawn by C07's module.
// Also exports the leaf-anatomy kit that C09 reuses, so the C₃ → C₂ → C₄ comparison runs on one anatomy:
// a Kranz ring (vein, bundle-sheath wreath, mesophyll ring) and a two-cell pair (mesophyll | bundle sheath | vein).
// Vocabulary: carbon = dark bead (white bead = carbon that entered as CO₂), glycine route = clay dashed,
// C₄-acid route = teal, CO₂ escaping = grey dotted, mitochondrion with GDC = dark, without GDC = pale dashed.
import type { PlateText, Variant } from '../types';
import { illusHeads, molecule } from '../illus';
import { text } from '../mechanisms';
import './c08.css';
import { draw as drawC07, VARIANTS as C07_VARIANTS } from './c07';

export const PLATE: PlateText = {
  n: 'C9',
  title: 'C₂ photosynthesis moves CO₂ release',
  status: 'draft',
  lead: 'A leaf has two photosynthetic cell types: mesophyll, and bundle sheath around each vein. In C₂ plants, glycine is decarboxylated mainly in the bundle sheath, next to RuBisCO.',
  points: [
    { claim: 'C₃ leaves already refix some CO₂.', text: 'Rice and wheat refix 24–38 % of the CO₂ their mitochondria release.' },
    { claim: 'Glycine decarboxylase moves to the bundle sheath.', text: 'Photorespiration’s GDC step (slide C6) runs mainly in bundle-sheath mitochondria, as immunogold labelling showed.' },
    { claim: 'A glycine shuttle concentrates CO₂.', text: 'Released beside RuBisCO, the CO₂ is refixed; chloroplast CO₂ rises about 3-fold.' },
  ],
  refs: [
    { label: 'Busch et al. 2013', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' },
    { label: 'Rawsthorne et al. 1988', url: 'https://doi.org/10.1007/BF00401016' },
    { label: 'Leung et al. 2024', url: 'https://doi.org/10.1111/pce.15069' },
    { label: 'Keerberg et al. 2014', url: 'https://doi.org/10.1093/jxb/eru239' },
    { label: 'Dickinson et al. 2025', url: 'https://doi.org/10.1038/s44319-025-00461-1' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Glycine shuttle' },
  { id: 'b', name: 'C₃ vs C₂', anim: true },
  { id: 'c', name: 'Icon sum' },
  { id: 'd', name: 'Parcel analogy' },
  { id: 'e', name: 'Gold dots' },
  { id: 'f', name: 'Tribulus data' },
  { id: 'g', name: 'Four steps', anim: true },
  { id: 'h', name: 'Trait by trait', anim: true },
  { id: 'i', name: 'Atom ledger' },
  { id: 'j', name: 'Hidden switch' },
  // C07's figures, merged into this slide on 27 Oct 2026: k–t draw C07's a–j.
  ...C07_VARIANTS.map((v, i) => ({ ...v, id: 'klmnopqrst'[i], name: `${v.name} (from C7)` })),
];

/** This slide's ids k–t map to C07's a–j. */
const FROM_C07: Record<string, string> = Object.fromEntries([...'klmnopqrst'].map((k, i) => [k, 'abcdefghij'[i]]));

export function draw(id: string): string {
  if (FROM_C07[id]) return drawC07(FROM_C07[id]);
  const f: Record<string, () => string> = {
    a: shuttleSvg, b: compareSvg, c: iconSvg, d: parcelSvg, e: goldSvg,
    f: tribulusSvg, g: stepsSvg, h: traitsSvg, i: ledgerSvg, j: switchSvg,
  };
  return (f[id] ?? shuttleSvg)();
}

/* ====================== shared leaf-anatomy kit (also used by C09) ====================== */

export const n1 = (v: number): string => v.toFixed(1);
const rad = (d: number): number => (d * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, deg: number): [number, number] =>
  [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];

/** Route inks: k ink, g glycine (clay), m C₄ acid (teal), x CO₂ escaping (grey), w ghost, a ATP (orange). */
export type Route = 'k' | 'g' | 'm' | 'x' | 'w' | 'a';
const HEADS: Route[] = ['k', 'g', 'm', 'x', 'w', 'a'];

/** Markers sized in user units, so thick routes keep neat heads; plus the shared inks and bolt head. */
export const kit = (p: string): string =>
  `${illusHeads(p)}<defs>${HEADS.map(h => `<marker id="${p}-${h}" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="15" markerHeight="15" markerUnits="userSpaceOnUse" orient="auto"><path class="fc08-hd-${h}" d="M0,0.6L10,5L0,9.4z"/></marker>`).join('')}</defs>`;

export const route = (p: string, kind: Route, d: string, extra = ''): string =>
  `<path class="fc08-r fc08-r-${kind}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-${kind})"/>`;

export const figure = (p: string, label: string, body: string, cls = 'fc08'): string =>
  `<svg class="fig-svg ${cls}" viewBox="0 0 800 600" role="img" aria-label="${label}">${kit(p)}${body}</svg>`;

export const lines = (x: number, y: number, rows: string[], cls = 'sm', anchor: 'start' | 'middle' | 'end' = 'middle', dy = 27): string =>
  rows.map((s, i) => text(x, y + i * dy, s, cls, anchor)).join('');

/** A label pair: the first line bold, the second grey (used for "analogy · real part"). */
export const pairLabel = (x: number, y: number, a: string, b: string, anchor: 'start' | 'middle' | 'end' = 'middle'): string =>
  text(x, y, a, 'sm fc08-b', anchor) + text(x, y + 26, b, 'sm fc08-grey', anchor);

/** A numbered badge. */
export const badge = (x: number, y: number, n: number | string): string =>
  `<circle class="fc08-num" cx="${x}" cy="${y}" r="16"/>${text(x, y + 6.5, `${n}`, 'fc08-num-t')}`;

/** Chloroplast: a green lens; rot turns its long axis. */
export function chloro(x: number, y: number, rx: number, ry: number, rot = 0, grana = true): string {
  const t = rot ? ` transform="rotate(${n1(rot)} ${n1(x)} ${n1(y)})"` : '';
  const g = grana && rx > 24
    ? `<path class="fc08-th"${t} d="M${n1(x - rx * 0.62)},${n1(y - ry * 0.32)} H${n1(x + rx * 0.62)} M${n1(x - rx * 0.74)},${n1(y + ry * 0.05)} H${n1(x + rx * 0.74)} M${n1(x - rx * 0.6)},${n1(y + ry * 0.4)} H${n1(x + rx * 0.6)}"/>`
    : '';
  return `<ellipse class="fc08-cp" cx="${n1(x)}" cy="${n1(y)}" rx="${n1(rx)}" ry="${n1(ry)}"${t}/>${g}`;
}

export type MtState = 'on' | 'off' | 'plain';
/** Mitochondrion: 'on' carries GDC (dark), 'off' has none (pale, dashed). */
export function mito(x: number, y: number, rx: number, ry: number, rot = 0, state: MtState = 'plain', cristae = true): string {
  const cls = state === 'on' ? 'fc08-mt fc08-mt-on' : state === 'off' ? 'fc08-mt fc08-mt-off' : 'fc08-mt';
  const t = rot ? ` transform="rotate(${n1(rot)} ${n1(x)} ${n1(y)})"` : '';
  let cr = '';
  if (cristae && rx > 14 && state !== 'off') {
    const k = 6, pts: string[] = [];
    for (let i = 0; i <= k; i++) pts.push(`${i ? 'L' : 'M'}${n1(x - rx * 0.7 + (i * rx * 1.4) / k)},${n1(y + (i % 2 ? ry * 0.48 : -ry * 0.48))}`);
    cr = `<path class="fc08-cr"${t} d="${pts.join(' ')}"/>`;
  }
  return `<ellipse class="${cls}" cx="${n1(x)}" cy="${n1(y)}" rx="${n1(rx)}" ry="${n1(ry)}"${t}/>${cr}`;
}

export const perox = (x: number, y: number, r: number): string => `<circle class="fc08-px" cx="${n1(x)}" cy="${n1(y)}" r="${r}"/>`;

/** RuBisCO as the deck draws it: a warm grey block. */
export const rub = (x: number, y: number, w = 104, h = 34, label = 'RuBisCO'): string =>
  `<rect class="node node-rub" x="${n1(x - w / 2)}" y="${n1(y - h / 2)}" width="${w}" height="${h}" rx="9"/>${label ? text(x, y + 7.5, label, 'sm fc08-b') : ''}`;

/** An enzyme pill. */
export const enz = (x: number, y: number, w: number, label: string, cls = 'fc08-enz', h = 36): string =>
  `<rect class="${cls}" x="${n1(x - w / 2)}" y="${n1(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${text(x, y + 7.5, label, 'sm fc08-b')}`;

/** A carbon skeleton: n beads on a bond. `white` marks carbon that entered as CO₂; clay beads mark glycine. */
export function chain(x: number, y: number, n: number, o: { cls?: string; white?: number[]; r?: number; gap?: number } = {}): string {
  const r = o.r ?? 8, gap = o.gap ?? 20, cls = o.cls ?? 'bead', x0 = x - ((n - 1) * gap) / 2;
  const bond = n > 1 ? `<path class="fc08-bond${cls.includes('bead-pr') ? ' fc08-bond-pr' : ''}" d="M${n1(x0)},${n1(y)} H${n1(x0 + (n - 1) * gap)}"/>` : '';
  return bond + Array.from({ length: n }, (_, i) =>
    `<circle class="${o.white?.includes(i) ? 'bead bead-co2' : cls}" cx="${n1(x0 + i * gap)}" cy="${n1(y)}" r="${r}"/>`).join('');
}

/** CO₂ as three small atom balls without letters, for drawings too small for the lettered molecule. */
export const co2s = (x: number, y: number, r = 5): string =>
  ['O', 'C', 'O'].map((a, i) => `<circle class="atom atom-${a}" cx="${n1(x + (i - 1) * r * 1.55)}" cy="${n1(y)}" r="${r}"/>`).join('');

/** An X mark. */
export const cross = (x: number, y: number, s = 12): string =>
  `<path class="fc08-cross" d="M${n1(x - s)},${n1(y - s)} L${n1(x + s)},${n1(y + s)} M${n1(x + s)},${n1(y - s)} L${n1(x - s)},${n1(y + s)}"/>`;

/** A vein seen in cross-section: pale bundle with a few vessels. */
export function veinDisc(cx: number, cy: number, r: number): string {
  const v = [0, 120, 240].map(a => { const [x, y] = polar(cx, cy, r * 0.42, a - 90); return `<circle class="fc08-xy" cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 0.25)}"/>`; }).join('');
  const s = [60, 180, 300].map(a => { const [x, y] = polar(cx, cy, r * 0.66, a - 90); return `<circle class="fc08-xy" cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 0.12)}"/>`; }).join('');
  return `<circle class="fc08-vein" cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}"/>${v}${s}`;
}

/** A vein seen side-on, as the edge of the two-cell drawings. */
export function veinStrip(x: number, y: number, w: number, h: number): string {
  const v = [0.22, 0.4, 0.58, 0.76].map((f, i) => `<circle class="fc08-xy" cx="${n1(x + w * (i % 2 ? 0.6 : 0.42))}" cy="${n1(y + h * f)}" r="${n1(w * (i % 2 ? 0.16 : 0.22))}"/>`).join('');
  return `<rect class="fc08-vein" x="${x}" y="${y}" width="${w}" height="${h}" rx="${n1(Math.min(w / 2, 34))}"/>${v}`;
}

/** Annular sector between radii r0 and r1, angles a0 → a1 in degrees (clockwise, y down). */
export function sector(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r0, a0), [x1, y1] = polar(cx, cy, r1, a0), [x2, y2] = polar(cx, cy, r1, a1), [x3, y3] = polar(cx, cy, r0, a1);
  const lg = a1 - a0 > 180 ? 1 : 0;
  return `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)} A${n1(r1)},${n1(r1)} 0 ${lg} 1 ${n1(x2)},${n1(y2)} L${n1(x3)},${n1(y3)} A${n1(r0)},${n1(r0)} 0 ${lg} 0 ${n1(x0)},${n1(y0)} Z`;
}

/** Radii of the Kranz ring: vein, bundle-sheath wreath, mesophyll ring. */
export const rg = (R: number): { rv: number; rb0: number; rb1: number; rm0: number; rm1: number } =>
  ({ rv: 0.235 * R, rb0: 0.255 * R, rb1: 0.555 * R, rm0: 0.585 * R, rm1: R });

export interface RingOpt {
  nb?: number; nm?: number; rot?: number;
  /** chloroplasts per bundle-sheath cell */
  bsCp?: number;
  /** where the bundle-sheath mitochondria sit */
  bsMt?: 'none' | 'inner' | 'outer';
  /** mitochondria in mesophyll cells */
  mMt?: boolean;
  /** chloroplasts in mesophyll cells (default on) */
  mCp?: boolean;
  /** which mitochondria carry GDC */
  gdc?: 'both' | 'bs' | 'none';
  /** extra classes on every mesophyll / bundle-sheath cell, e.g. an expression tint */
  mCls?: string; bsCls?: string;
}

/** Kranz anatomy in cross-section: a vein, a wreath of bundle-sheath cells, and a ring of mesophyll cells. */
export function ring(cx: number, cy: number, R: number, o: RingOpt = {}): string {
  const { rv, rb0, rb1, rm0, rm1 } = rg(R);
  const nb = o.nb ?? 8, nm = o.nm ?? 13, rot = o.rot ?? -90, gdc = o.gdc ?? 'none';
  const sM: MtState = gdc === 'both' ? 'on' : gdc === 'bs' ? 'off' : 'plain';
  const sB: MtState = gdc === 'none' ? 'plain' : 'on';
  const out: string[] = [];
  const rmid = (rm0 + rm1) / 2, ra = (rm1 - rm0) / 2 - 1.5, rt = (Math.PI * rmid) / nm - 2.2;
  for (let i = 0; i < nm; i++) {
    const a = rot + 180 / nm + (i * 360) / nm;
    const [x, y] = polar(cx, cy, rmid, a);
    out.push(`<ellipse class="fc08-m${o.mCls ? ` ${o.mCls}` : ''}" cx="${n1(x)}" cy="${n1(y)}" rx="${n1(ra)}" ry="${n1(rt)}" transform="rotate(${n1(a)} ${n1(x)} ${n1(y)})"/>`);
    if (o.mCp !== false) for (const s of [-1, 1]) {
      const [px, py] = polar(cx, cy, rmid + s * ra * 0.52, a);
      out.push(chloro(px, py, rt * 0.6, rt * 0.24, a + 90, false));
    }
    if (o.mMt) { const [px, py] = polar(cx, cy, rmid, a); out.push(mito(px, py, rt * 0.36, rt * 0.24, a + 90, sM, false)); }
  }
  const t = rb1 - rb0, step = 360 / nb, gap = (3.2 / ((rb0 + rb1) / 2)) * (180 / Math.PI);
  for (let k = 0; k < nb; k++) {
    const a0 = rot + k * step + gap / 2, a1 = rot + (k + 1) * step - gap / 2, am = (a0 + a1) / 2;
    out.push(`<path class="fc08-bs${o.bsCls ? ` ${o.bsCls}` : ''}" d="${sector(cx, cy, rb0 + 1, rb1, a0, a1)}"/>`);
    const nc = o.bsCp ?? 1, inner = o.bsMt === 'inner', rc = inner ? rb0 + 0.6 * t : rb0 + 0.5 * t;
    for (let j = 0; j < nc; j++) {
      const aj = am + (j - (nc - 1) / 2) * step * 0.27;
      const [px, py] = polar(cx, cy, rc, aj);
      out.push(chloro(px, py, t * (nc > 1 ? 0.28 : 0.3), t * 0.11, aj, false));
    }
    if (inner) for (const s of [-1, 1]) {
      const [px, py] = polar(cx, cy, rb0 + 0.17 * t, am + s * step * 0.21);
      out.push(mito(px, py, t * 0.14, t * 0.09, am + 90, sB, false));
    }
    if (o.bsMt === 'outer') { const [px, py] = polar(cx, cy, rb0 + 0.84 * t, am + step * 0.16); out.push(mito(px, py, t * 0.13, t * 0.085, am + 90, sB, false)); }
  }
  out.push(veinDisc(cx, cy, rv));
  return out.join('');
}

/* ====================== C08 figures ====================== */

/* ---------- a · the glycine shuttle in two cells ---------- */

function shuttleSvg(): string {
  const p = 'fc08a';
  return figure(p, 'C₂ glycine shuttle: RuBisCO takes up O₂ in a mesophyll chloroplast, glycine forms in the peroxisome and moves into the bundle-sheath cell, where glycine decarboxylase in the mitochondrion releases CO₂ beside two chloroplasts whose RuBisCO refixes it', `
    ${text(205, 32, 'mesophyll cell', 'sm fc08-b')}${text(541, 32, 'bundle-sheath cell', 'sm fc08-b')}${text(752, 32, 'vein', 'sm fc08-b')}
    <rect class="fc08-m" x="40" y="50" width="330" height="426" rx="46"/>
    <rect class="fc08-bs" x="382" y="48" width="318" height="430" rx="30"/>
    ${veinStrip(712, 52, 80, 422)}

    ${molecule(200, 78, 'OO', 11)}${text(226, 86, 'O₂', 'sm fc08-b', 'start')}
    ${chloro(200, 148, 135, 50)}${rub(200, 148, 110, 34)}
    ${route(p, 'k', 'M200,92 L200,124')}
    ${route(p, 'k', 'M200,167 L200,196')}
    ${chain(200, 216, 2, { cls: 'bead bead-pr' })}${text(226, 223, 'glycolate', 'sm', 'start')}
    ${route(p, 'k', 'M210,230 L236,262')}
    ${perox(258, 300, 38)}${chain(258, 300, 2, { cls: 'bead bead-pr' })}${text(210, 307, 'peroxisome', 'sm', 'end')}
    ${mito(102, 420, 40, 21, 0, 'off')}${text(156, 413, 'mitochondrion:', 'sm', 'start')}${text(156, 440, 'no GDC', 'sm fc08-b', 'start')}

    ${route(p, 'g', 'M298,300 C370,300 410,282 586,282')}
    ${text(468, 262, 'glycine', 'sm fc08-b fc08-gly')}

    ${chloro(560, 150, 112, 46)}${rub(560, 150)}
    ${chloro(560, 408, 112, 46)}${rub(560, 408)}
    ${mito(644, 282, 48, 30, 0, 'on', false)}${text(644, 290, 'GDC', 'sm fc08-b')}
    ${route(p, 'k', 'M630,251 L607,206')}${route(p, 'k', 'M630,313 L607,358')}
    ${molecule(668, 228, 'OCO', 9)}${molecule(668, 336, 'OCO', 9)}
    ${text(500, 340, 'CO₂ refixed', 'sm', 'middle')}

    <path class="fc08-rule" d="M40,498 H790"/>
    ${text(110, 538, '2 glycine', 'lab fc08-b')}${chain(80, 576, 2, { cls: 'bead bead-pr' })}${chain(140, 576, 2, { cls: 'bead bead-pr' })}
    ${route(p, 'k', 'M182,530 L232,530')}${text(207, 516, 'GDC', 'sm fc08-b')}
    ${text(292, 538, 'serine', 'lab fc08-b')}${chain(292, 576, 3)}
    ${text(352, 538, '+', 'lab')}
    ${text(406, 538, 'CO₂', 'lab fc08-b')}${molecule(406, 576, 'OCO', 10)}
    ${text(460, 538, '+', 'lab')}
    ${text(512, 538, 'NH₃', 'lab fc08-b')}
    ${lines(592, 532, ['serine returns', 'to the mesophyll'], 'sm', 'start')}`);
}

/* ---------- b · C₃ and C₂ on the same anatomy ---------- */

function compareSvg(): string {
  const p = 'fc08b';
  const R = 158, L = 200, Rx = 600, cy = 266;
  const { rb0, rb1 } = rg(R);
  const esc = [-150, -32, 18, 162, 58].map(a => {
    const [x0, y0] = polar(L, cy, R * 0.79, a), [x1, y1] = polar(L, cy, R + 26, a), [x2, y2] = polar(L, cy, R + 44, a);
    return route(p, 'x', `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`) + co2s(x2, y2, 5.5);
  }).join('');
  const gly = [-135, -45, 45, 135].map(a => {
    const [x0, y0] = polar(Rx, cy, R * 0.92, a), [x1, y1] = polar(Rx, cy, rb1 + 4, a);
    return route(p, 'g', `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`);
  }).join('');
  const inner = [-135, -45, 45, 135].map(a => { const [x, y] = polar(Rx, cy, rb0 + (rb1 - rb0) * 0.35, a); return co2s(x, y, 4.5); }).join('');
  return figure(p, 'The same leaf anatomy twice. C₃: every mitochondrion carries GDC, so photorespired CO₂ is released throughout the mesophyll and much escapes. C₂: mainly bundle-sheath mitochondria carry GDC; glycine moves inwards and CO₂ is released next to bundle-sheath RuBisCO', `
    ${text(L, 58, 'C₃ leaf', 'lab fc08-b')}${text(Rx, 58, 'C₂ leaf', 'lab fc08-b')}
    ${ring(L, cy, R, { gdc: 'both', mMt: true, bsMt: 'outer', bsCp: 1 })}${esc}
    ${ring(Rx, cy, R, { gdc: 'bs', mMt: true, bsMt: 'inner', bsCp: 3 })}${gly}${inner}
    ${text(L, 480, 'GDC in every mitochondrion', 'sm')}
    ${text(Rx, 480, 'GDC mainly in the bundle sheath', 'sm')}
    <path class="fc08-rule" d="M30,512 H770"/>
    ${mito(58, 544, 15, 9, 0, 'on', false)}${text(82, 551, 'with GDC', 'sm', 'start')}
    ${mito(212, 544, 15, 9, 0, 'off', false)}${text(236, 551, 'no GDC', 'sm', 'start')}
    ${route(p, 'g', 'M352,544 L398,544')}${text(410, 551, 'glycine', 'sm', 'start')}
    ${route(p, 'x', 'M520,544 L566,544')}${co2s(588, 544, 5)}${text(608, 551, 'CO₂ escaping', 'sm', 'start')}
    ${text(400, 588, 'each leaf, outside in: mesophyll · bundle sheath · vein', 'sm fc08-grey')}`);
}

/* ---------- c · icon sum ---------- */

function iconSvg(): string {
  const p = 'fc08c';
  const cy = 190, r = 116, xs = [132, 400, 668], R = 100;
  const { rb1 } = rg(R);
  const disc = (x: number): string => `<circle class="fc08-panel" cx="${x}" cy="${cy}" r="${r}"/>`;
  const gly = [-135, -45, 90].map(a => {
    const [x0, y0] = polar(xs[2], cy, R * 0.94, a), [x1, y1] = polar(xs[2], cy, rb1 + 3, a);
    return route(p, 'g', `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`, 'fc08-thin');
  }).join('');
  const inner = [-135, -45, 90].map(a => { const [x, y] = polar(xs[2], cy, 0.36 * R, a); return co2s(x, y, 5); }).join('');
  return figure(p, 'Icon sum: photorespiration plus glycine decarboxylase mainly in the bundle sheath equals a CO₂ pump, with CO₂ released next to RuBisCO', `
    ${disc(xs[0])}${disc(xs[1])}${disc(xs[2])}
    ${chain(xs[0] - 30, 146, 2, { cls: 'bead bead-pr' })}${chain(xs[0] + 30, 146, 2, { cls: 'bead bead-pr' })}
    ${route(p, 'k', `M${xs[0]},164 L${xs[0]},204`)}${text(xs[0] + 12, 192, 'GDC', 'sm fc08-b', 'start')}
    ${chain(xs[0] - 34, 236, 3)}${text(xs[0] + 14, 244, '+', 'lab')}${molecule(xs[0] + 50, 236, 'OCO', 10)}
    ${ring(xs[1], cy, R, { nb: 6, nm: 10, gdc: 'bs', mMt: true, bsMt: 'inner', bsCp: 2 })}
    ${ring(xs[2], cy, R, { nb: 6, nm: 10, gdc: 'bs', mMt: true, bsMt: 'inner', bsCp: 2 })}${gly}${inner}
    ${text(266, cy + 12, '+', 'fc08-big')}${text(534, cy + 12, '=', 'fc08-big')}
    ${lines(xs[0], 344, ['photorespiration', '4 C → 3 C + CO₂'])}
    ${lines(xs[1], 344, ['GDC mainly in', 'the bundle sheath'])}
    ${lines(xs[2], 344, ['CO₂ released', 'beside RuBisCO'])}
    ${text(400, 452, 'C₂ = photorespiration + GDC moved to the sheath', 'fc08-big')}
    <path class="fc08-rule" d="M60,494 H740"/>
    ${mito(126, 528, 15, 9, 0, 'on', false)}${text(150, 535, 'with GDC', 'sm fc08-grey', 'start')}
    ${mito(290, 528, 15, 9, 0, 'off', false)}${text(314, 535, 'no GDC', 'sm fc08-grey', 'start')}
    ${route(p, 'g', 'M440,528 L486,528', 'fc08-thin')}${text(498, 535, 'glycine', 'sm fc08-grey', 'start')}`);
}

/* ---------- d · analogy: open the parcel in the back room ---------- */

function parcelSvg(): string {
  const p = 'fc08d';
  const parcel = (x: number, y: number): string =>
    `<rect class="fc08-parcel" x="${x - 23}" y="${y - 16}" width="46" height="32" rx="4"/><path class="fc08-tape" d="M${x},${y - 16} V${y + 16}"/>` +
    `<circle class="bead bead-pr" cx="${x - 11}" cy="${y}" r="5"/><circle class="bead bead-pr" cx="${x + 11}" cy="${y}" r="5"/>`;
  /** Scissors, blades pointing right. */
  const opener = (x: number, y: number, cls = ''): string =>
    `<g${cls ? ` class="${cls}"` : ''}><path class="fc08-sc" d="M${x - 14},${y - 9} L${x + 28},${y + 8} M${x - 14},${y + 9} L${x + 28},${y - 8}"/>` +
    `<circle class="fc08-sc-loop" cx="${x - 22}" cy="${y - 12}" r="8.5"/><circle class="fc08-sc-loop" cx="${x - 22}" cy="${y + 12}" r="8.5"/></g>`;
  const wind = [222, 248, 274].map(y => route(p, 'x', `M50,${y} C40,${y - 6} 30,${y + 6} 14,${y}`)).join('');
  return figure(p, 'Analogy mapped to C₂: parcels (glycine) are made in the front room (mesophyll) by an open door (air spaces), but the openers (GDC) are mainly in the back room (bundle sheath), so the contents (CO₂) land at the workbench (RuBisCO)', `
    <g transform="translate(0 44)"><rect class="fc08-room" x="60" y="40" width="340" height="380" stroke="none"/>
    <rect class="fc08-room fc08-room-b" x="400" y="40" width="340" height="380" stroke="none"/>
    <path class="fc08-room" fill="none" d="M60,198 V40 H740 V420 H60 V298 M400,40 V206 M400,290 V420"/>
    ${pairLabel(230, 80, 'front room', 'mesophyll')}${pairLabel(570, 80, 'back room', 'bundle sheath')}
    ${wind}
    ${parcel(190, 248)}${parcel(240, 248)}${parcel(215, 216)}
    ${pairLabel(215, 302, 'parcel', 'glycine (2 C)')}
    ${opener(290, 378, 'fc08-ghost')}${cross(292, 378, 15)}${text(232, 385, 'no opener here', 'sm fc08-grey', 'end')}
    ${route(p, 'g', 'M266,236 C330,236 350,248 410,248 L478,248')}
    ${opener(518, 248)}${pairLabel(518, 302, 'opener', 'GDC')}
    ${route(p, 'k', 'M552,240 L592,230')}${molecule(624, 228, 'OCO', 10)}
    ${pairLabel(624, 176, 'contents', 'CO₂')}
    ${route(p, 'k', 'M652,238 L688,262')}
    <rect class="fc08-bench" x="698" y="120" width="32" height="270" rx="6"/>
    ${pairLabel(684, 356, 'workbench', 'RuBisCO', 'end')}
    ${pairLabel(60, 458, 'open door', 'air spaces, stomata', 'start')}</g>`);
}

/* ---------- e · evidence: immunogold (Rawsthorne et al. 1988), schematic ---------- */

function goldSvg(): string {
  const p = 'fc08e';
  const dots = (x: number, y: number, rx: number, ry: number, seed: number): string => {
    const pts: string[] = [];
    for (let i = 0; i < 7; i++) {
      const a = (seed * 53 + i * 137) % 360, f = 0.25 + (((seed + i) * 37) % 60) / 100;
      pts.push(`<circle class="fc08-dot" cx="${n1(x + Math.cos(rad(a)) * rx * f)}" cy="${n1(y + Math.sin(rad(a)) * ry * f)}" r="3.4"/>`);
    }
    return pts.join('');
  };
  const emCp = (x: number, y: number, rx: number, ry: number, rot = 0): string => {
    const t = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
    return `<ellipse class="fc08-emcp" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${t}/><path class="fc08-emth"${t} d="M${x - rx * 0.7},${y - ry * 0.3} H${x + rx * 0.7} M${x - rx * 0.8},${y} H${x + rx * 0.8} M${x - rx * 0.7},${y + ry * 0.3} H${x + rx * 0.7}"/>`;
  };
  const emMt = (x: number, y: number, rx: number, ry: number, rot: number, gold: boolean, seed: number): string => {
    const t = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
    return `<ellipse class="fc08-emmt" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${t}/><path class="fc08-emcr"${t} d="M${x - rx * 0.55},${y - ry * 0.5} V${y + ry * 0.5} M${x - rx * 0.15},${y - ry * 0.6} V${y + ry * 0.6} M${x + rx * 0.25},${y - ry * 0.6} V${y + ry * 0.6} M${x + rx * 0.6},${y - ry * 0.4} V${y + ry * 0.4}"/>` +
      (gold ? dots(x, y, rot ? ry : rx, rot ? rx : ry, seed) : '');
  };
  const panel = (x0: number, goldM: boolean): string => {
    const y0 = 96;
    return `<rect class="fc08-em" x="${x0}" y="${y0}" width="350" height="320" rx="16"/>
      <rect class="fc08-emcell" x="${x0 + 12}" y="${y0 + 12}" width="158" height="296" rx="30"/>
      <rect class="fc08-emcell" x="${x0 + 180}" y="${y0 + 12}" width="158" height="296" rx="18" style="stroke-width:4.2"/>
      ${emCp(x0 + 92, y0 + 66, 58, 22)}${emCp(x0 + 84, y0 + 228, 54, 20)}
      ${emMt(x0 + 58, y0 + 148, 28, 16, 0, goldM, 1)}${emMt(x0 + 124, y0 + 166, 24, 14, 0, goldM, 2)}
      ${emCp(x0 + 246, y0 + 72, 48, 20, 0)}${emCp(x0 + 246, y0 + 214, 48, 20, 0)}
      ${emMt(x0 + 306, y0 + 132, 26, 15, 90, true, 3)}${emMt(x0 + 306, y0 + 192, 24, 14, 90, true, 4)}
      ${text(x0 + 91, y0 + 292, 'mesophyll', 'sm')}${lines(x0 + 259, y0 + 268, ['bundle', 'sheath'], 'sm', 'middle', 24)}`;
  };
  return figure(p, 'Schematic of the immunogold result: in the C₃ species Moricandia moricandioides gold particles marking glycine decarboxylase lie over mitochondria in both cell types; in the C₃–C₄ intermediate M. arvensis only over bundle-sheath mitochondria', `
    ${text(205, 42, 'C₃ species', 'sm fc08-b')}<text class="sm fc08-sp" x="205" y="70" text-anchor="middle">Moricandia moricandioides</text>
    ${text(595, 42, 'C₃–C₄ intermediate', 'sm fc08-b')}<text class="sm fc08-sp" x="595" y="70" text-anchor="middle">Moricandia arvensis</text>
    ${panel(30, true)}${panel(420, false)}
    ${text(205, 454, 'gold in both cell types', 'sm')}
    ${text(595, 454, 'gold mainly in bundle sheath', 'sm')}
    <path class="fc08-rule" d="M30,486 H770"/>
    <circle class="fc08-dot" cx="44" cy="518" r="3.4"/><circle class="fc08-dot" cx="54" cy="512" r="3.4"/><circle class="fc08-dot" cx="56" cy="524" r="3.4"/>
    ${text(72, 525, 'gold particle: marks glycine decarboxylase (GDC)', 'sm', 'start')}
    ${text(30, 558, 'Schematic after Rawsthorne et al. 1988.', 'fc08-tiny', 'start')}
    <text class="fc08-tiny" x="30" y="580">Same result in <tspan class="fc08-sp">Panicum</tspan>, <tspan class="fc08-sp">Flaveria</tspan> and <tspan class="fc08-sp">Mollugo</tspan> intermediates (Hylton et al. 1988).</text>`);
}

/* ---------- f · data: graded C₂ in Tribulus (Leung et al. 2024) ---------- */

function tribulusSvg(): string {
  const p = 'fc08f';
  const xs = [230, 400, 570], w = 110, b1 = 226, b2 = 490;
  const gdc = [11, 30, 86], cstar = [73, 55, 21];
  const cls = ['fc08-bar', 'fc08-bar fc08-bar-g', 'fc08-bar fc08-bar-g'];
  const top = gdc.map((v, i) => {
    const h = v * 1.5, y = b1 - h;
    return `<rect class="${cls[i]}"${i === 1 ? ' style="opacity:.6"' : ''} x="${xs[i] - w / 2}" y="${n1(y)}" width="${w}" height="${n1(h)}" rx="4"/>${text(xs[i], y - 12, `${v} %`, 'sm fc08-b')}`;
  }).join('');
  const bot = cstar.map((v, i) => {
    const h = v * 1.6, y = b2 - h;
    return `<rect class="${cls[i]}"${i === 1 ? ' style="opacity:.6"' : ''} x="${xs[i] - w / 2}" y="${n1(y)}" width="${w}" height="${n1(h)}" rx="4"/>${text(xs[i], y - 12, `${v}`, 'sm fc08-b')}`;
  }).join('');
  return figure(p, 'Tribulus data at 42 °C: the share of glycine decarboxylase in the bundle sheath rises from 11 % in C₃ species to 30 % in sub-C₂ T. astrocarpus and 86 % in C₂ T. cristatus, while C*, the CO₂ compensation point without respiration, falls from 73 to 55 to 21 µmol mol⁻¹', `
    ${text(400, 46, 'Share of GDC in the bundle sheath', 'lab fc08-b')}
    <path class="fc08-axis" d="M140,${b1} H660"/>${top}
    ${text(400, 286, 'C*: CO₂ compensation point without respiration', 'lab fc08-b')}
    ${text(400, 314, 'µmol mol⁻¹ at 42 °C · lower: less CO₂ lost', 'sm fc08-grey')}
    <path class="fc08-axis" d="M140,${b2} H660"/>${bot}
    ${lines(xs[0], 522, ['C₃ species', '(mean)'])}
    <text class="sm fc08-sp" x="${xs[1]}" y="522" text-anchor="middle">T. astrocarpus</text>${text(xs[1], 549, 'sub-C₂', 'sm')}
    <text class="sm fc08-sp" x="${xs[2]}" y="522" text-anchor="middle">T. cristatus</text>${text(xs[2], 549, 'C₂', 'sm fc08-b')}
    <text class="fc08-tiny" x="790" y="582" text-anchor="end"><tspan class="fc08-sp">Tribulus</tspan> · Leung et al. 2024</text>`);
}

/* ---------- g · four steps (animation storyboard) ---------- */

function stepsSvg(): string {
  const p = 'fc08g';
  const panel = (px: number, py: number, n: number, cap: string): string => {
    const at = (k: number): string => (k === n ? '' : 'fc08-ghost');
    const g = (k: number, s: string): string => (k > n ? '' : `<g class="${at(k)}">${s}</g>`);
    return `<rect class="fc08-panel" x="${px}" y="${py}" width="380" height="284" rx="18"/>
      ${badge(px + 28, py + 32, n)}${text(px + 54, py + 40, cap, 'sm fc08-b', 'start')}
      <rect class="fc08-m" x="${px + 12}" y="${py + 62}" width="186" height="208" rx="28"/>
      <rect class="fc08-bs" x="${px + 206}" y="${py + 58}" width="132" height="216" rx="18"/>
      ${veinStrip(px + 346, py + 62, 24, 208)}
      ${chloro(px + 104, py + 124, 82, 30, 0)}${rub(px + 104, py + 124, 96, 30)}
      ${perox(px + 128, py + 222, 30)}${n >= 1 ? chain(px + 128, py + 222, 2, { cls: 'bead bead-pr', r: 7, gap: 17 }) : ''}
      ${chloro(px + 268, py + 112, 54, 24)}${rub(px + 268, py + 112, 92, 28)}
      ${mito(px + 278, py + 214, 40, 24, 0, 'on', false)}${text(px + 278, py + 222, 'GDC', 'sm fc08-b')}
      ${g(1, `${molecule(px + 40, py + 92, 'OO', 8)}${route(p, 'k', `M${px + 50},${py + 102} L${px + 58},${py + 112}`)}${route(p, 'k', `M${px + 112},${py + 141} L${px + 122},${py + 186}`)}`)}
      ${g(2, route(p, 'g', `M${px + 160},${py + 222} C${px + 196},${py + 222} ${px + 210},${py + 214} ${px + 232},${py + 214}`))}
      ${n >= 3 ? molecule(px + 298, py + 168, 'OCO', 8) : ''}
      ${g(4, route(p, 'k', `M${px + 280},${py + 158} L${px + 272},${py + 136}`))}
      ${n === 1 ? text(px + 22, py + 262, 'mesophyll', 'fc08-tiny', 'start') + text(px + 272, py + 262, 'bundle sheath', 'fc08-tiny') : ''}`;
  };
  return figure(p, 'Four steps of the C₂ shuttle: RuBisCO takes up O₂ in the mesophyll and glycine forms; glycine moves into the bundle sheath; GDC releases CO₂ in the bundle-sheath mitochondrion; RuBisCO next door refixes the CO₂', `
    ${panel(10, 8, 1, 'RuBisCO adds O₂ to RuBP')}${panel(410, 8, 2, 'Glycine moves inwards')}
    ${panel(10, 306, 3, 'GDC releases CO₂')}${panel(410, 306, 4, 'RuBisCO refixes the CO₂')}`);
}

/* ---------- h · trait by trait: C₃ → proto-Kranz → C₂ → C₄ (C07 folded in) ---------- */

function traitsSvg(): string {
  const p = 'fc08h';
  const xs = [104, 300, 496, 692], cy = 252, R = 84;
  const inward = (cx: number, kind: Route, angles: number[]): string => angles.map(a => {
    const [x0, y0] = polar(cx, cy, R * 0.97, a), [x1, y1] = polar(cx, cy, rg(R).rb1 + 3, a);
    return route(p, kind, `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`, 'fc08-thin');
  }).join('');
  return figure(p, 'Four leaves on one anatomy, traits added one at a time: C₃ with GDC in every cell; proto-Kranz with more and larger bundle-sheath organelles; C₂ with GDC mainly in the bundle sheath; C₄ with a PEPC cycle that pumps C₄ acids inwards', `
    <g transform="translate(0 20)">${text(400, 40, 'Traits accumulate one at a time', 'lab fc08-b')}
    ${route(p, 'w', 'M60,74 L740,74')}
    ${text(xs[0], 132, 'C₃', 'lab fc08-b')}${text(xs[1], 132, 'proto-Kranz', 'lab fc08-b')}${text(xs[2], 132, 'C₂', 'lab fc08-b')}${text(xs[3], 132, 'C₄', 'lab fc08-b')}
    ${ring(xs[0], cy, R, { nb: 7, nm: 11, gdc: 'both', mMt: true, bsMt: 'outer', bsCp: 1 })}
    ${ring(xs[1], cy, R, { nb: 7, nm: 11, gdc: 'both', mMt: true, bsMt: 'inner', bsCp: 3 })}
    ${ring(xs[2], cy, R, { nb: 7, nm: 11, gdc: 'bs', mMt: true, bsMt: 'inner', bsCp: 3 })}${inward(xs[2], 'g', [-140, -20, 100])}
    ${ring(xs[3], cy, R, { nb: 7, nm: 11, bsCp: 3 })}${inward(xs[3], 'm', [-150, -30, 90])}
    ${lines(xs[0], 372, ['GDC in', 'every cell'])}
    ${lines(xs[1], 372, ['more, larger', 'sheath organelles'])}
    ${lines(xs[2], 372, ['GDC mainly in', 'bundle sheath'])}
    ${lines(xs[3], 372, ['+ C₄ acids', 'carry CO₂ in'])}
    <path class="fc08-rule" d="M30,432 H770"/>
    ${mito(92, 464, 14, 8.5, 0, 'on', false)}${text(114, 471, 'mitochondrion with GDC', 'sm', 'start')}
    ${route(p, 'g', 'M400,464 L442,464', 'fc08-thin')}${text(452, 471, 'glycine', 'sm', 'start')}
    ${route(p, 'm', 'M574,464 L616,464', 'fc08-thin')}${text(626, 471, 'C₄ acid', 'sm', 'start')}
    ${text(400, 516, 'Living species are relatives, not ancestors', 'sm fc08-b')}
    <text class="fc08-tiny" x="400" y="544" text-anchor="middle">All four forms occur in <tspan class="fc08-sp">Blepharis</tspan> (Stata et al. 2025)</text></g>`);
}

/* ---------- i · equation-anchored: where each atom of the GDC reaction goes ---------- */

function ledgerSvg(): string {
  const p = 'fc08i';
  const card = (x: number, title: string, rows: string[], hi = false): string =>
    `<rect class="${hi ? 'fc08-halo' : 'fc08-panel'}" x="${x}" y="300" width="230" height="142" rx="18"/>${text(x + 115, 340, title, 'lab fc08-b')}${lines(x + 115, 374, rows)}`;
  return figure(p, 'The glycine decarboxylase reaction, 2 glycine → serine + CO₂ + NH₃, with each product traced: serine returns to the mesophyll, CO₂ is released in the bundle sheath beside RuBisCO, NH₃ is also released there and recycled', `
    <g transform="translate(0 0)">
    <rect class="fc08-halo" x="436" y="96" width="92" height="54" rx="14"/>
    ${text(140, 134, '2 glycine', 'fc08-big')}${route(p, 'k', 'M218,124 L282,124')}${text(250, 104, 'GDC', 'sm fc08-b')}
    ${text(345, 134, 'serine', 'fc08-big')}${text(410, 134, '+', 'fc08-big')}${text(482, 134, 'CO₂', 'fc08-big')}${text(552, 134, '+', 'fc08-big')}${text(620, 134, 'NH₃', 'fc08-big')}
    ${chain(112, 186, 2, { cls: 'bead bead-pr' })}${chain(168, 186, 2, { cls: 'bead bead-pr' })}${chain(345, 186, 3)}${molecule(482, 186, 'OCO', 10)}
    ${text(140, 226, '4 C', 'sm fc08-grey')}${text(345, 226, '3 C', 'sm fc08-grey')}${text(482, 226, '1 C', 'sm fc08-grey')}
    ${route(p, 'k', 'M330,238 L190,294', 'fc08-thin')}${route(p, 'k', 'M470,238 L420,294', 'fc08-thin')}${route(p, 'k', 'M620,150 C640,220 660,250 660,294', 'fc08-thin')}
    ${card(40, 'serine', ['back to mesophyll', '3 of 4 C kept'])}
    ${card(305, 'CO₂', ['released beside', 'sheath RuBisCO'], true)}
    ${card(570, 'NH₃', ['released there,', 'then recycled'])}
    ${text(400, 500, 'Same chemistry as C₃, different place', 'sm fc08-b')}</g>`);
}

/* ---------- j · the hidden switch (Dickinson et al. 2025) ---------- */

function switchSvg(): string {
  const p = 'fc08j';
  const row = (y: number, lost: boolean): string => `
    <path class="fc08-dna" d="M36,${y} H520"/>
    <rect class="${lost ? 'fc08-sw-off' : 'fc08-sw'}" x="56" y="${y - 22}" width="96" height="44" rx="10"/>${lost ? cross(104, y, 13) : text(104, y + 8, 'on', 'sm fc08-b')}
    <rect class="fc08-sw" x="270" y="${y - 22}" width="96" height="44" rx="10"/>${text(318, y + 8, 'on', 'sm fc08-b')}
    <path class="fc08-gene" d="M408,${y - 22} H490 L518,${y} L490,${y + 22} H408 Z"/>${text(458, y + 8, 'GLDP', 'sm fc08-b')}
    ${lines(104, y + 52, lost ? ['mesophyll', 'switch changed'] : ['mesophyll', 'switch'])}
    ${lines(318, y + 52, ['bundle-sheath', 'switch (MYC–MYB)'])}
    ${route(p, 'k', `M528,${y} L572,${y}`)}`;
  return figure(p, 'Gene switches for GLDP, a glycine decarboxylase gene. In a C₃ leaf a mesophyll switch and a bundle-sheath switch are both on, so both cell types express it; in a C₂ leaf the mesophyll switch is changed, revealing the bundle-sheath pattern that already existed', `
    <g transform="translate(0 12)"><rect class="fc08-expr" x="374" y="22" width="28" height="20" rx="5"/>${text(412, 39, 'cells expressing GLDP (a GDC gene)', 'sm', 'start')}
    <text class="lab fc08-b" x="40" y="70">C₃ leaf · <tspan class="fc08-sp">Arabidopsis</tspan></text>
    ${row(150, false)}
    ${ring(680, 152, 92, { nb: 7, nm: 11, mCp: false, bsCp: 0, mCls: 'fc08-expr', bsCls: 'fc08-expr' })}
    ${text(680, 276, 'both cell types', 'sm')}
    <text class="lab fc08-b" x="40" y="334">C₂ leaf · <tspan class="fc08-sp">Moricandia</tspan></text>
    ${row(414, true)}
    ${ring(680, 416, 92, { nb: 7, nm: 11, mCp: false, bsCp: 0, bsCls: 'fc08-expr' })}
    ${text(680, 540, 'mainly bundle sheath', 'sm')}
    <text class="fc08-tiny" x="40" y="566">Dickinson et al. 2025; mechanism shown mainly in <tspan class="fc08-sp">Arabidopsis</tspan></text></g>`);
}
