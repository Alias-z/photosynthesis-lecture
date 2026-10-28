// Slide 4a · Where light is captured. Option C of research/figure-briefs/DRAFT_CAPTURE_MESSAGES.md (27 Oct 2026): a new
// slide before excitation that places chloroplast, thylakoid membrane and pigment–protein complexes, so slides 4b–7 can use them.
// Sizes: chloroplast lens-shaped, ≈ 5 µm across and ≈ 2.5 µm thick; 40–60 grana of 0.3–0.6 µm (Staehelin 2003, p. 187, via
// BioNumbers 107012 and 107014); thylakoid membrane ≈ 5 nm (in situ cryo-ET, Engel et al. 2015, via BioNumbers 111325); PSII dimer
// ≈ 20 × 11 nm (crystal structure, BioNumbers 103908). Figure h follows Wietrzynski et al. 2025 (cryo-ET of intact spinach
// chloroplasts: PSII spread evenly through the grana, PSI only in unstacked membrane). Only the slide's own terms are labelled;
// PSII, PSI and ATP synthase are first named on slides 6–7. Photo in i: Plagiomnium affine leaf cells, Kristian Peters,
// CC BY-SA 3.0 (assets/SOURCES.md). Real images in j–m (sources, licences and crops in assets/SOURCES.md): Syringa leaf section
// (Berkshire Community College, CC0); lettuce chloroplast, STEM tomography (Yuv345 after Bussi et al. 2019, CC BY-SA 4.0); spinach
// chloroplast cryo-ET (Wietrzynski et al. 2025, eLife, CC BY 4.0: Fig 1A, 1B, 1–S3 A, 5B, 6C); PSII–LHCII supercomplex (RCSB PDB
// 5XNL, Su et al. 2017). Their own scale bars and labels are kept; nothing is drawn over a baked-in label.
import type { PlateText, Variant } from '../types';
import { text } from '../mechanisms';
import { bolt, illusHeads } from '../illus';
import moss from '../../assets/photos/moss-cells.jpg';
import syringa from '../../assets/photos/leaf-section-syringa.jpg';
import letTip from '../../assets/photos/chloroplast-lettuce-tip.jpg';
import tomo from '../../assets/photos/cryoet-tomogram.jpg';
import model from '../../assets/photos/cryoet-model.jpg';
import grana3d from '../../assets/photos/cryoet-grana-3d.jpg';
import mapped from '../../assets/photos/cryoet-complexes.jpg';
import margin from '../../assets/photos/cryoet-margin.jpg';
import pdb from '../../assets/photos/complex-5xnl.jpg';
import leafBlock from '../../assets/photos/leaf-block.jpg';
import cpDraw from '../../assets/photos/chloroplast-drawing.jpg';
import cpTem from '../../assets/photos/chloroplast-tem.jpg';
import granaTem from '../../assets/photos/grana-tem.jpg';
import leafSec from '../../assets/photos/leaf-section-fresh.jpg';
import cell3d from '../../assets/photos/cell-3d.jpg';
import leaf3d from '../../assets/photos/leaf-3d.jpg';
import cp3d from '../../assets/photos/chloroplast-3d.jpg';
import bryum from '../../assets/photos/moss-live-cells.jpg';
import leafPhoto from '../../assets/photos/leaf-photo.jpg';
import segClean from '../../assets/photos/cryoet-model-clean.jpg';
import lhcTop from '../../assets/photos/lhcii-top.png';
import lhcSide from '../../assets/photos/lhcii-side.png';
import chlPng from '../../assets/photos/chlorophyll.png';
import senn from '../../assets/anim/leaf/senn.png';
import senn1895 from '../../assets/anim/leaf/senn-1895.jpg';
import temShade from '../../assets/anim/leaf/tem-shade.jpg';
import temSun from '../../assets/anim/leaf/tem-sun.jpg';
import alocasia from '../../assets/photos/alocasia-shade.jpg';
import lhcTopAB from '../../assets/photos/lhcii-top-ab.png';
import { clipping, type Clip } from './clipping';
import './l04a.css';

export const PLATE: PlateText = {
  n: '4a',
  title: 'Where light is captured',
  status: 'draft',
  lead: 'Light is captured by pigment–protein complexes in the thylakoid membranes of chloroplasts.',
  points: [
    { claim: 'Thylakoid membranes.', text: 'Stacked into grana, joined by unstacked membranes<br>Each thylakoid encloses a space, the lumen<br>Photosystem II sits in the stacks, photosystem I in the unstacked membranes' },
    { claim: 'Pigment–protein complexes.', text: 'Proteins hold chlorophylls and carotenoids at fixed positions' },
    { claim: 'Stroma.', text: 'The space around the thylakoids, where CO₂ is fixed' },
  ],
  refs: [
    { label: 'Staehelin 2003', url: 'https://doi.org/10.1023/A:1024994525586' },
    { label: 'Kirchhoff 2019', url: 'https://doi.org/10.1111/nph.15730' },
    { label: 'Wietrzynski et al. 2025', url: 'https://doi.org/10.7554/eLife.105496' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'o', name: 'Micrographs only' },
  { id: 'o1', name: 'Micrographs, lighter' },
  { id: 'o2', name: 'Micrographs, three steps' },
  { id: 'p', name: '3-D all the way' },
  { id: 'r3', name: 'Senn’s discovery' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return sectionSvg();
    case 'c': return bigSvg();
    case 'd': return ladderSvg();
    case 'e': return nestedSvg();
    case 'f': return levelsSvg();
    case 'g': return seenSvg();
    case 'h': return slabSvg();
    case 'i': return photoSvg();
    case 'j': return realZoomSvg();
    case 'k': return pairSvg();
    case 'l': return real3dSvg();
    case 'm': return mixedSvg();
    case 'n': return pathSvg();
    case 'o': return microSvg();
    case 'p': return threeDSvg();
    case 'q': return cellHeroSvg();
    case 'r': return cpHeroSvg();
    case 's': return seenDrawnSvg();
    case 't': return cryoPairSvg();
    case 'u': return livingSvg();
    case 'v': return membraneSvg();
    case 'w': return realLadderSvg();
    case 's1': return storyRowSvg();
    case 's2': return storyGridSvg();
    case 'r1': return shadeSunSvg();
    case 'r2': return photoMembraneSvg();
    case 'r3': return sennSvg();
    case 'r4': return labelledCpSvg();
    case 'r5': return annotatedSvg();
    case 'n1': return n1Svg();
    case 'n2': return n2Svg();
    case 'n3': return n3Svg();
    case 'n4': return n4Svg();
    case 'n5': return n5Svg();
    case 'n6': return n6Svg();
    case 'o1': return micro1Svg();
    case 'o2': return micro2Svg();
    case 'p1': return threeD1Svg();
    case 'p2': return threeD2Svg();
    case 'r3a': return senn1Svg();
    case 'r3b': return senn2Svg();
    default: return gridSvg();
  }
}

/* ---------- shared marks ---------- */

type Pt = [number, number];
type Circ = [number, number, number];
interface Lens { cx: number; cy: number; rx: number; ry: number }
const f = (v: number): string => v.toFixed(1);

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg fl4a" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => text(x, y, s, 'sm fl4a-b', a);
const tag = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => text(x, y, s, 'fl4a-size', a);
const note = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => text(x, y, s, 'fl4a-note', a);
const leader = (...pts: Pt[]): string => `<path class="fl4a-ld" d="M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}"/>`;
const zline = (a: Pt, b: Pt): string => `<path class="fl4a-zl" d="M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}"/>`;
const zarrow = (p: string, a: Pt, b: Pt): string =>
  `<path class="fl4a-zl" d="M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}" marker-end="url(#${p}-zh)"/>`;
const zbox = (x: number, y: number, w: number, h: number): string =>
  `<rect class="fl4a-zb" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="3"/>`;
const zcirc = ([x, y, r]: Circ): string => `<circle class="fl4a-zb" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
const panel = (x0: number, y0: number, x1: number, y1: number): string =>
  `<rect class="fl4a-panel" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="14"/>`;
const clipCirc = (id: string, [x, y, r]: Circ): string => `<clipPath id="${id}"><circle cx="${f(x)}" cy="${f(y)}" r="${f(r - 1)}"/></clipPath>`;
const lensRing = ([x, y, r]: Circ): string => `<circle class="fl4a-lens" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
const ring = ([x, y, r]: Circ): string => `<circle class="fl4a-ring-o" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;

/** Zoom-connector head and the shared marker set (amber bolt). */
const defs = (p: string): string => `${illusHeads(p)}<defs><marker id="${p}-zh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path class="fl4a-zh" d="M0,0L10,5L0,10z"/></marker></defs>`;

/** The two outer tangents from a small marked circle to the circle that enlarges it. */
function tangents(a: Circ, b: Circ): string {
  const [x1, y1, r1] = a, [x2, y2, r2] = b, d = Math.hypot(x2 - x1, y2 - y1);
  const th = Math.atan2(y2 - y1, x2 - x1), al = Math.acos((r1 - r2) / d);
  return [1, -1].map(s => {
    const ph = th + s * al;
    return zline([x1 + r1 * Math.cos(ph), y1 + r1 * Math.sin(ph)], [x2 + r2 * Math.cos(ph), y2 + r2 * Math.sin(ph)]);
  }).join('');
}

/** A seeded number stream, so the irregular cells look the same on every render. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

/* ---------- leaf, cells ---------- */

/** A leaf seen from above, length L, tip pointing along `rot` degrees. */
function leaf(x: number, y: number, L: number, rot: number): string {
  const h = L * 0.36;
  const veins = ([[-0.3, -0.1, 0.6], [-0.08, 0.12, 0.55], [0.14, 0.32, 0.36]] as const)
    .flatMap(([u, e, k]) => [1, -1].map(s => `M${f(u * L)},0 Q${f((u + 0.1) * L)},${f(s * h * k * 0.35)} ${f(e * L)},${f(s * h * k)}`)).join(' ');
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})">
    <path class="fl4a-vein" d="M${f(-0.5 * L)},0 L${f(-0.64 * L)},0" style="stroke-width:${f(Math.max(2, L * 0.02))}"/>
    <path class="fl4a-leaf" d="M${f(-0.5 * L)},0 C${f(-0.3 * L)},${f(-h)} ${f(0.22 * L)},${f(-h * 0.95)} ${f(0.5 * L)},0 C${f(0.22 * L)},${f(h * 0.95)} ${f(-0.3 * L)},${f(h)} ${f(-0.5 * L)},0Z"/>
    <path class="fl4a-vein" d="M${f(-0.5 * L)},0 L${f(0.44 * L)},0 ${veins}"/></g>`;
}

/** One chloroplast as seen in a leaf cell: a small green ellipse, long axis along the wall. */
const cpl = (x: number, y: number, rot = 0, rx = 3.4, ry = 6.4): string =>
  `<ellipse class="fl4a-cp" cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"${rot ? ` transform="rotate(${f(rot)} ${f(x)} ${f(y)})"` : ''}/>`;

/** A leaf cut across: epidermis, a row of tall cells, loose rounded cells with air between, and a lower epidermis with a
 *  stoma. Chloroplasts line the cell walls. Returns the chloroplast centres of the tall (pal) and the rounded (spg) cells. */
function section(p: string, x0: number, y0: number, w: number, h: number): { svg: string; pal: Pt[]; spg: Pt[] } {
  const r = rng(11), out: string[] = [], pal: Pt[] = [], spg: Pt[] = [];
  const ue = h * 0.1, ph = h * 0.42, sh = h * 0.36, le = h - ue - ph - sh;
  const yP = y0 + ue, yS = yP + ph, yL = yS + sh;
  out.push(`<clipPath id="${p}-sec"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="10"/></clipPath>`,
    `<g clip-path="url(#${p}-sec)"><rect class="fl4a-air" x="${x0}" y="${y0}" width="${w}" height="${h}"/>`);
  const ne = Math.round(w / 44), ew = w / ne;
  const epid = (y: number, hh: number, skip = -1): void => {
    for (let i = 0; i < ne; i++) if (i !== skip) out.push(`<rect class="fl4a-epi" x="${f(x0 + i * ew + 1)}" y="${f(y + 1)}" width="${f(ew - 2)}" height="${f(hh - 2)}" rx="5"/>`);
  };
  epid(y0, ue);
  const np = Math.round(w / 34), cw = w / np;
  for (let i = 0; i < np; i++) {
    const a = x0 + i * cw + 1.5, b = a + cw - 3, top = yP + 2, bot = yS - 2;
    out.push(`<rect class="fl4a-cell" x="${f(a)}" y="${f(top)}" width="${f(b - a)}" height="${f(bot - top)}" rx="${f(cw * 0.34)}"/>`);
    for (let k = 0; k < 5; k++) {
      const yy = top + (bot - top) * (0.15 + (0.7 * k) / 4) + (r() - 0.5) * 4;
      for (const xx of [a + 5.5, b - 5.5]) { out.push(cpl(xx, yy)); pal.push([xx, yy]); }
    }
  }
  const ns = Math.round(w / 66), sw = w / ns;
  for (let row = 0; row < 2; row++) for (let i = 0; i <= ns; i++) {
    const cx = x0 + (i + (row ? 0.5 : 0)) * sw + (r() - 0.5) * 12, cy = yS + sh * (row ? 0.73 : 0.28) + (r() - 0.5) * sh * 0.06;
    const ry = sh * (0.19 + r() * 0.04), rx = ry * (1.35 + r() * 0.25);
    out.push(`<ellipse class="fl4a-cell" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"/>`);
    for (let k = 0; k < 4; k++) {
      const t = ((k + 0.5) / 4) * Math.PI * 2 + (r() - 0.5) * 0.6, px = cx + (rx - 4.5) * Math.cos(t), py = cy + (ry - 4.5) * Math.sin(t);
      out.push(cpl(px, py, (t * 180) / Math.PI, 2.8, 5.2)); spg.push([px, py]);
    }
  }
  const sc = Math.round(ne * 0.62), gx = x0 + (sc + 0.5) * ew;
  epid(yL, le, sc);
  out.push(`<ellipse class="fl4a-guard" cx="${f(gx - 9)}" cy="${f(yL + le / 2)}" rx="8" ry="${f(le / 2 - 1.5)}"/>`,
    `<ellipse class="fl4a-guard" cx="${f(gx + 9)}" cy="${f(yL + le / 2)}" rx="8" ry="${f(le / 2 - 1.5)}"/></g>`,
    `<rect class="fl4a-secline" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="10"/>`);
  return { svg: out.join(''), pal, spg };
}

/** Leaf cells seen from above, as in a moss leaf: hexagons with walls between, packed with chloroplast discs. */
function cellsTop(cx: number, cy: number, R: number, a = 30, seed = 3): { svg: string; discs: Pt[] } {
  const r = rng(seed), out: string[] = [], discs: Pt[] = [];
  const dx = a * Math.sqrt(3), dy = a * 1.5, nr = Math.ceil(R / dy) + 1, nc = Math.ceil(R / dx) + 1;
  for (let row = -nr; row <= nr; row++) for (let col = -nc; col <= nc; col++) {
    const x = cx + col * dx + (row & 1 ? dx / 2 : 0), y = cy + row * dy;
    if (Math.hypot(x - cx, y - cy) > R + a) continue;
    const pts = Array.from({ length: 6 }, (_, i) => { const t = Math.PI / 6 + (i * Math.PI) / 3; return `${f(x + (a - 2.4) * Math.cos(t))},${f(y + (a - 2.4) * Math.sin(t))}`; });
    out.push(`<path class="fl4a-celltop" d="M${pts.join('L')}Z"/>`);
    const n = 9;
    for (let i = 0; i <= n; i++) {
      const inner = i === n, t = (i / n) * 2 * Math.PI + r() * 0.4, rr = inner ? r() * a * 0.15 : (a - 2.4) * (0.6 + r() * 0.12);
      const q: Pt = [x + rr * Math.cos(t), y + rr * Math.sin(t)];
      out.push(`<circle class="fl4a-cpd" cx="${f(q[0])}" cy="${f(q[1])}" r="${f(a * 0.165)}"/>`); discs.push(q);
    }
  }
  return { svg: out.join(''), discs };
}

const nearest = (pts: Pt[], x: number, y: number): Pt =>
  pts.reduce((b, q) => (Math.hypot(q[0] - x, q[1] - y) < Math.hypot(b[0] - x, b[1] - y) ? q : b), pts[0]);

/* ---------- chloroplast ---------- */

interface Granum { x: number; y: number; w: number; h: number; n: number; t: number; g: number }
/** Grana centres in units of the lens half-axes, with their number of discs. */
const GRANA: Array<[number, number, number]> = [[-0.66, 0.02, 5], [-0.38, -0.4, 6], [-0.36, 0.38, 6], [-0.06, -0.01, 7], [0.24, -0.42, 6], [0.26, 0.4, 6], [0.56, 0, 6]];
/** Stroma lamellae: from granum a (disc ia) to granum b (disc ib), always left to right. */
const LINKS: Array<[number, number, number, number]> = [[0, 1, 1, 4], [0, 2, 3, 1], [1, 3, 4, 1], [2, 3, 1, 5], [3, 4, 1, 4], [3, 5, 5, 1], [4, 6, 4, 1], [5, 6, 1, 4], [1, 4, 2, 2], [2, 5, 3, 3]];

/** A chloroplast cut through its long axis: two envelope membranes, grana stacks joined by stroma lamellae, the stroma.
 *  'tem' draws it as an electron micrograph shows it, with thinner, more numerous discs (closer to true proportions). */
function chloroplast(L: Lens, style: 'scheme' | 'tem' = 'scheme', p = ''): { svg: string; grana: Granum[] } {
  const tem = style === 'tem', k = tem ? 1.8 : 1;
  const t = tem ? Math.max(1.1, L.ry * 0.017) : Math.max(2.2, L.ry * 0.05), g = tem ? t * 0.85 : t * 0.55;
  const grana: Granum[] = GRANA.map(([u, v, n0]) => {
    const n = Math.round(n0 * k), h = n * t + (n - 1) * g;
    return { x: L.cx + u * L.rx, y: L.cy + v * L.ry, w: L.rx * 0.2, h, n, t, g };
  });
  const at = (G: Granum, i: number): number => G.y - G.h / 2 + Math.min(G.n - 1, Math.round(i * k)) * (t + g) + t / 2;
  const segs: Array<[Pt, Pt]> = LINKS.map(([a, b, ia, ib]) => [[grana[a].x + grana[a].w / 2, at(grana[a], ia)], [grana[b].x - grana[b].w / 2, at(grana[b], ib)]]);
  segs.push([[grana[0].x - grana[0].w / 2, at(grana[0], 2)], [L.cx - L.rx * 0.88, at(grana[0], 2) + L.ry * 0.05]]);
  segs.push([[grana[6].x + grana[6].w / 2, at(grana[6], 3)], [L.cx + L.rx * 0.86, at(grana[6], 3) - L.ry * 0.05]]);
  const d = ([a, b]: [Pt, Pt]): string => `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  const lam = segs.map(s => (tem
    ? `<path class="fl4a-tlam" d="${d(s)}" style="stroke-width:${f(t * 1.1)}"/>`
    : `<path class="fl4a-lam" d="${d(s)}" style="stroke-width:${f(t)}"/><path class="fl4a-lamin" d="${d(s)}" style="stroke-width:${f(t * 0.34)}"/>`)).join('');
  const stacks = grana.map(G => Array.from({ length: G.n }, (_, i) => {
    const y = G.y - G.h / 2 + i * (t + g), x = G.x - G.w / 2;
    return tem
      ? `<rect class="fl4a-tgr" x="${f(x)}" y="${f(y)}" width="${f(G.w)}" height="${f(t)}" rx="${f(t / 2)}"/>`
      : `<rect class="fl4a-gr" x="${f(x)}" y="${f(y)}" width="${f(G.w)}" height="${f(t)}" rx="${f(t / 2)}"/><path class="fl4a-grin" d="M${f(x + t / 2)},${f(y + t / 2)}H${f(x + G.w - t / 2)}" style="stroke-width:${f(t * 0.34)}"/>`;
  }).join('')).join('');
  const gap = tem ? 3.5 : Math.max(4, L.ry * 0.07);
  const env = tem
    ? `<defs><pattern id="${p}-grain" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" class="fl4a-tbg"/><circle cx="1.6" cy="2.1" r=".75" class="fl4a-tdot"/><circle cx="5" cy="5.2" r=".6" class="fl4a-tdot"/><circle cx="4.6" cy="1" r=".5" class="fl4a-tdot"/></pattern></defs>`
      + `<ellipse class="fl4a-tenv" cx="${f(L.cx)}" cy="${f(L.cy)}" rx="${f(L.rx)}" ry="${f(L.ry)}"/><ellipse class="fl4a-tstroma" cx="${f(L.cx)}" cy="${f(L.cy)}" rx="${f(L.rx - gap)}" ry="${f(L.ry - gap)}" fill="url(#${p}-grain)"/>`
    : `<ellipse class="fl4a-env" cx="${f(L.cx)}" cy="${f(L.cy)}" rx="${f(L.rx)}" ry="${f(L.ry)}"/><ellipse class="fl4a-stroma" cx="${f(L.cx)}" cy="${f(L.cy)}" rx="${f(L.rx - gap)}" ry="${f(L.ry - gap)}"/>`;
  return { svg: `<g>${env}${lam}${stacks}</g>`, grana };
}

/** A point on the chloroplast outline at angle deg (0 = right, 90 = down). */
const onLens = (L: Lens, deg: number, inset = 0): Pt => [L.cx + (L.rx - inset) * Math.cos((deg * Math.PI) / 180), L.cy + (L.ry - inset) * Math.sin((deg * Math.PI) / 180)];

/* ---------- thylakoid membranes, side-on ---------- */

/** A pigment–protein complex in a membrane: a green protein holding chlorophylls (dots). */
function cplx(x: number, y: number, w: number, m: number): string {
  const h = m + 9, r = Math.max(1.7, w * 0.085);
  const dots = [-0.27, 0, 0.27].map(d => `<circle class="fl4a-chl" cx="${f(x + d * w)}" cy="${f(y)}" r="${f(r)}"/>`).join('');
  return `<rect class="fl4a-cx" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(Math.min(w, h) * 0.34)}"/>${dots}`;
}

interface Thy { svg: string; H: number; lam: Pt[]; gran: Pt[]; y: number[] }
/** Thylakoids side-on: k sacs stacked as a granum (x0 … xg); the middle sac runs on to x1 as a stroma lamella. Each sac is a
 *  membrane (lipid heads on both faces) around the lumen; the membranes hold pigment–protein complexes. */
function thylakoids(p: string, x0: number, x1: number, y0: number, o: { m?: number; lu?: number; gap?: number; k?: number; xg?: number; cw?: number } = {}): Thy {
  const m = o.m ?? 11, lu = o.lu ?? 14, gap = o.gap ?? 12, k = o.k ?? 3, cw = o.cw ?? 24;
  const xg = o.xg ?? x0 + (x1 - x0) * 0.45, H = 2 * m + lu, mid = Math.floor(k / 2);
  const out: string[] = [], lam: Pt[] = [], gran: Pt[] = [], ys: number[] = [];
  const hr = Math.min(2.4, m * 0.22);
  for (let i = 0; i < k; i++) {
    const y = y0 + i * (H + gap), xb = i === mid ? x1 : xg, id = `${p}-lip${i}`;
    ys.push(y);
    const tails = [[hr * 2, m / 2], [m - hr * 2, m / 2], [H - m + hr * 2, H - m / 2], [H - hr * 2, H - m / 2]]
      .map(([a, b]) => `M2.6,${f(a)}V${f(b)}M4.4,${f(a)}V${f(b)}`).join('');
    out.push(`<defs><pattern id="${id}" width="7" height="${f(H)}" patternUnits="userSpaceOnUse" x="${f(x0)}" y="${f(y)}"><path class="fl4a-tail" d="${tails}"/>`
      + [hr, m - hr, H - m + hr, H - hr].map(cy => `<circle class="fl4a-head" cx="3.5" cy="${f(cy)}" r="${f(hr)}"/>`).join('') + `</pattern></defs>`,
      `<rect class="fl4a-memb" x="${f(x0)}" y="${f(y)}" width="${f(xb - x0)}" height="${f(H)}" rx="${f(H / 2)}"/>`,
      `<rect x="${f(x0)}" y="${f(y)}" width="${f(xb - x0)}" height="${f(H)}" rx="${f(H / 2)}" fill="url(#${id})"/>`,
      `<rect class="fl4a-lumen" x="${f(x0 + m)}" y="${f(y + m)}" width="${f(xb - x0 - 2 * m)}" height="${f(lu)}" rx="${f(lu / 2)}"/>`,
      `<rect class="fl4a-sac" x="${f(x0)}" y="${f(y)}" width="${f(xb - x0)}" height="${f(H)}" rx="${f(H / 2)}"/>`);
    for (const [yy, off] of [[y + m / 2, (i % 2) * 1.3], [y + H - m / 2, ((i + 1) % 2) * 1.3]] as Array<[number, number]>) {
      for (let x = x0 + H / 2 + cw * (0.6 + off); x < xb - H / 2 - cw * 0.4; x += x < xg - cw ? cw * 2.6 : cw * 3.4) {
        out.push(cplx(x, yy, cw, m));
        (x > xg + cw * 0.5 ? lam : gran).push([x, yy]);
      }
    }
  }
  return { svg: out.join(''), H, lam, gran, y: ys };
}

/* ---------- a · zoom in four equal panels, read clockwise ---------- */

function gridSvg(): string {
  const p = 'f4aa';
  const sec = section(p, 435, 72, 325, 192);
  const c1 = nearest(sec.pal, 600, 120);
  const L: Lens = { cx: 597, cy: 462, rx: 132, ry: 64 };
  const cp = chloroplast(L);
  const g0 = cp.grana[0];
  const th = thylakoids(p, 40, 365, 396, { xg: 196, m: 10, lu: 12, gap: 11, cw: 21 });
  const lc = nearest(th.lam, 320, 0);
  return svg('Zoom from a leaf to its cells, one chloroplast and its thylakoid membranes, which hold the pigment–protein complexes', `
    ${defs(p)}
    ${panel(20, 20, 385, 285)}${panel(415, 20, 780, 285)}${panel(415, 315, 780, 580)}${panel(20, 315, 385, 580)}
    ${lab(40, 54, 'leaf', 'start')}${tag(365, 54, '≈ 5 cm', 'end')}
    ${leaf(196, 172, 250, -24)}${zbox(236, 158, 22, 22)}
    ${zarrow(p, [248, 158], [409, 158])}
    ${lab(435, 54, 'cells in the leaf', 'start')}${tag(760, 54, 'cell ≈ 50 µm', 'end')}
    ${sec.svg}${zbox(c1[0], c1[1], 14, 22)}
    ${zarrow(p, [c1[0], c1[1] + 12], [c1[0], 309])}
    ${lab(435, 349, 'chloroplast', 'start')}${tag(760, 349, '≈ 5 µm', 'end')}
    ${cp.svg}${zbox(g0.x, g0.y, g0.w + 10, g0.h + 12)}
    ${lab(452, 385, 'envelope', 'start')}${leader([500, 391], onLens(L, 205))}
    ${lab(760, 385, 'granum', 'end')}${leader([700, 391], [cp.grana[4].x + 6, cp.grana[4].y - cp.grana[4].h / 2 - 2])}
    ${lab(452, 566, 'stroma', 'start')}${leader([480, 548], [520, 500])}
    ${lab(760, 566, 'stroma lamella', 'end')}${leader([700, 548], [672, 490])}
    ${zarrow(p, [g0.x - g0.w / 2 - 6, g0.y], [391, g0.y])}
    ${lab(40, 349, 'thylakoid membranes', 'start')}${tag(40, 376, '≈ 5 nm thick', 'start')}
    ${th.svg}
    ${lab(118, 556, 'granum')}${lab(282, 556, 'stroma lamella')}
    ${text(365, 383, 'pigment–protein', 'sm fl4a-b', 'end')}${text(365, 406, 'complexes', 'sm fl4a-b', 'end')}${leader([lc[0], 412], [lc[0], th.y[1] - 3])}
  `);
}

/* ---------- b · the leaf section first, one chloroplast and its membranes below ---------- */

function sectionSvg(): string {
  const p = 'f4ab';
  const sec = section(p, 40, 64, 720, 262);
  const c1 = nearest(sec.pal, 300, 150), c2 = nearest(sec.spg, 640, 290);
  const L: Lens = { cx: 238, cy: 474, rx: 160, ry: 80 };
  const cp = chloroplast(L);
  const g6 = cp.grana[6];
  const th = thylakoids(p, 490, 765, 448, { xg: 612, m: 9, lu: 11, gap: 10, cw: 19 });
  const lc2 = nearest(th.lam, 690, 600);
  return svg('A leaf cross-section with chloroplasts along the cell walls; one chloroplast enlarged, and its thylakoid membranes with pigment–protein complexes', `
    ${defs(p)}
    ${lab(40, 40, 'leaf cross-section', 'start')}
    ${bolt(p, 330, 4, 352, 56)}${bolt(p, 560, 4, 582, 56)}
    <path class="fl4a-scale" d="M700,34H757"/>${tag(690, 40, '50 µm', 'end')}
    ${zline([c1[0] - 9, c1[1]], onLens(L, 205))}${zline([c1[0] + 9, c1[1]], onLens(L, 335))}
    ${sec.svg}${zcirc([c1[0], c1[1], 9])}
    ${lab(640, 360, 'chloroplasts', 'middle')}${leader([640, 342], [c2[0], c2[1] + 7])}
    ${cp.svg}
    ${lab(40, 384, 'chloroplast', 'start')}${tag(40, 408, '≈ 5 µm', 'start')}
    ${zline([g6.x + g6.w / 2, g6.y - g6.h / 2 - 6], [470, 392])}${zline([g6.x + g6.w / 2, g6.y + g6.h / 2 + 6], [470, 590])}
    ${zbox(g6.x, g6.y, g6.w + 10, g6.h + 12)}
    ${panel(470, 392, 780, 590)}${th.svg}
    ${lab(60, 590, 'envelope', 'start')}${leader([100, 572], onLens(L, 132))}${note(200, 590, 'stroma')}${leader([200, 572], [215, 530])}
    ${lab(300, 590, 'granum')}${leader([300, 572], [cp.grana[5].x, cp.grana[5].y + cp.grana[5].h / 2 + 2])}
    ${lab(550, 420, 'thylakoid membranes')}
    ${lab(694, 470, 'stroma lamella')}
    ${lab(625, 582, 'pigment–protein complexes')}${leader([lc2[0], 564], [lc2[0], lc2[1] + 7])}
  `);
}

/* ---------- c · one big chloroplast, grana as stacked discs, a magnifier on the membranes ---------- */

/** A granum seen at an angle: n discs, each a coin (side band + top face), stacked upwards from yb. */
function coins(x: number, yb: number, rx: number, ry: number, n: number, th = 3.6, dz = 6.6): { svg: string; top: number } {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const y = yb - i * dz;
    out.push(`<path class="fl4a-coinside" d="M${f(x - rx)},${f(y)}A${f(rx)},${f(ry)} 0 0 0 ${f(x + rx)},${f(y)}L${f(x + rx)},${f(y + th)}A${f(rx)},${f(ry)} 0 0 1 ${f(x - rx)},${f(y + th)}Z"/>`,
      `<ellipse class="fl4a-coin" cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"/>`);
  }
  return { svg: out.join(''), top: yb - (n - 1) * dz };
}

function bigSvg(): string {
  const p = 'f4ac';
  const L: Lens = { cx: 310, cy: 322, rx: 272, ry: 150 };
  const S: Array<[number, number, number]> = [[132, 352, 6], [208, 262, 7], [222, 420, 6], [318, 336, 8], [410, 252, 6], [416, 424, 7], [500, 338, 6]];
  const rx = 30, ry = 10, dz = 6.6;
  const lay = (i: number, j: number): Pt => [S[i][0], S[i][1] - j * dz + 1.8];
  const band = (a: Pt, b: Pt): string => `<path class="fl4a-lamband" d="M${f(a[0])},${f(a[1] - 1)}L${f(b[0])},${f(b[1] - 1)}L${f(b[0])},${f(b[1] + 5)}L${f(a[0])},${f(a[1] + 5)}Z"/>`;
  const J: Array<[number, number, number, number]> = [[0, 1, 4, 1], [0, 2, 1, 4], [1, 3, 2, 6], [2, 3, 4, 1], [3, 4, 6, 2], [3, 5, 1, 5], [4, 6, 1, 4], [5, 6, 5, 1], [1, 4, 5, 4]];
  const bands = J.map(([a, b, ja, jb]) => band([lay(a, ja)[0] + rx - 2, lay(a, ja)[1]], [lay(b, jb)[0] - rx + 2, lay(b, jb)[1]])).join('')
    + band([L.cx - L.rx + 36, lay(0, 2)[1] + 10], [S[0][0] - rx + 2, lay(0, 2)[1]]) + band([S[6][0] + rx - 2, lay(6, 3)[1]], [L.cx + L.rx - 40, lay(6, 3)[1] - 8]);
  const stacks = S.map(([x, y, n]) => coins(x, y, rx, ry, n, 3.6, dz).svg).join('');
  const M: Circ = [690, 330, 100], mk: Circ = [S[6][0], S[6][1] - 18, 30];
  const th = thylakoids(p, 592, 788, 284, { xg: 690, m: 10, lu: 12, gap: 10, cw: 20 });
  const lc = nearest(th.lam, 740, 0);
  return svg('One chloroplast cut open: two envelope membranes around the stroma, grana stacked like coins and joined by stroma lamellae; a magnifier shows the thylakoid membranes holding pigment–protein complexes', `
    ${defs(p)}
    <defs><radialGradient id="${p}-st" cx=".42" cy=".38" r=".7"><stop offset="0" class="fl4a-st0"/><stop offset="1" class="fl4a-st1"/></radialGradient></defs>
    ${leaf(50, 52, 62, -28)}${tag(50, 102, 'leaf')}
    ${zarrow(p, [86, 52], [116, 52])}
    <rect class="fl4a-cell" x="124" y="26" width="30" height="52" rx="10"/>${[36, 52, 68].map(y => cpl(131, y, 0, 2.6, 5) + cpl(147, y, 0, 2.6, 5)).join('')}${tag(139, 102, 'cell')}
    ${zarrow(p, [162, 52], [192, 52])}
    ${lab(200, 60, 'chloroplast', 'start')}${tag(330, 60, '≈ 5 µm', 'start')}
    ${tangents(mk, M)}
    <ellipse class="fl4a-env" cx="${L.cx}" cy="${L.cy}" rx="${L.rx}" ry="${L.ry}"/>
    <ellipse class="fl4a-stroma" cx="${L.cx}" cy="${L.cy}" rx="${L.rx - 8}" ry="${L.ry - 8}" fill="url(#${p}-st)"/>
    ${bands}${stacks}
    ${zcirc(mk)}
    ${lensRing(M)}${clipCirc(`${p}-m`, M)}<g clip-path="url(#${p}-m)">${th.svg}</g>${ring(M)}
    ${lab(470, 160, 'envelope (two membranes)', 'start')}${leader([482, 167], onLens(L, 291))}
    ${note(128, 287, 'stroma')}
    ${lab(132, 520, 'granum')}${tag(132, 544, '0.3–0.6 µm')}${leader([132, 500], [S[0][0], S[0][1] + ry + 5])}
    ${lab(330, 540, 'stroma lamella')}${leader([330, 520], [270, lay(2, 4)[1] + 8])}
    ${lab(690, 210, 'thylakoid membranes')}
    ${text(690, 462, 'pigment–protein', 'sm fl4a-b')}${text(690, 486, 'complexes', 'sm fl4a-b')}${leader([690, 444], [lc[0], lc[1] + 10])}
  `);
}

/* ---------- d · a size ladder: one log axis from 10 cm down to 1 nm ---------- */

function ladderSvg(): string {
  const p = 'f4ad';
  const y = (m: number): number => 50 + (-1 - Math.log10(m)) * 62;
  const ax = 140, ix = 214, nx = 262, sx = 556;
  const ticks = ['10 cm', '1 cm', '1 mm', '100 µm', '10 µm', '1 µm', '100 nm', '10 nm', '1 nm'];
  const bands: Array<[number, number, string, string]> = [[y(0.1), y(1e-4), 'fl4a-b1', 'seen by eye'], [y(1e-4), y(2e-7), 'fl4a-b2', 'light microscope'], [y(2e-7), y(1e-9) + 30, 'fl4a-b3', 'electron microscope']];
  const row = (m: number, icon: string, name: string, size: string): string => {
    const yy = y(m);
    return `${icon}${text(nx, yy + 8, name, 'sm fl4a-b', 'start')}${tag(sx, yy + 8, size, 'start')}<path class="fl4a-stem" d="M${ax},${f(yy)}H${ix - 34}"/>`;
  };
  const chl = (x: number, yy: number): string => `<rect class="fl4a-ring" x="${x - 9}" y="${f(yy - 9)}" width="18" height="18" rx="5"/><circle class="fl4a-mg" cx="${x}" cy="${f(yy)}" r="3"/><path class="fl4a-vein" d="M${x + 9},${f(yy + 6)} q14,6 26,2"/>`;
  return svg('A size ladder on a logarithmic axis from 10 cm to 1 nm: leaf ≈ 5 cm, cell ≈ 50 µm, chloroplast ≈ 5 µm, granum 0.3–0.6 µm, pigment–protein complex ≈ 10–20 nm, thylakoid membrane ≈ 5 nm thick, chlorophyll ≈ 1 nm; the eye, the light microscope and the electron microscope each see part of it', `
    ${defs(p)}
    ${bands.map(([a, b, c, s]) => `<rect class="${c}" x="${ax + 10}" y="${f(a)}" width="${790 - ax - 10}" height="${f(b - a)}"/>${text(780, a + 26, s, 'fl4a-band', 'end')}`).join('')}
    <path class="fl4a-axis" d="M${ax},${f(y(0.1))}V${f(y(1e-9))}"/>
    ${ticks.map((s, i) => `<path class="fl4a-axis" d="M${ax - 7},${f(50 + i * 62)}H${ax}"/>${text(ax - 13, 50 + i * 62 + 6, s, 'fl4a-tick', 'end')}`).join('')}
    ${text(ax, 30, 'size (log scale)', 'fl4a-tick', 'middle')}
    ${row(0.05, leaf(ix, y(0.05), 64, -28), 'leaf', '≈ 5 cm')}
    ${row(5e-5, `<rect class="fl4a-cell" x="${ix - 14}" y="${f(y(5e-5) - 19)}" width="28" height="38" rx="9"/>${[-11, 0, 11].map(d => cpl(ix - 8, y(5e-5) + d, 0, 2.4, 4.4) + cpl(ix + 8, y(5e-5) + d, 0, 2.4, 4.4)).join('')}`, 'cell', '≈ 50 µm')}
    ${row(5e-6, chloroplast({ cx: ix, cy: y(5e-6), rx: 32, ry: 17 }).svg, 'chloroplast', '≈ 5 µm across')}
    ${row(5e-7, Array.from({ length: 5 }, (_, i) => `<rect class="fl4a-gr" x="${ix - 15}" y="${f(y(5e-7) - 12 + i * 5.2)}" width="30" height="3.6" rx="1.8"/>`).join(''), 'granum', '0.3–0.6 µm across')}
    ${row(1.5e-8, cplx(ix, y(1.5e-8), 30, 12), 'pigment–protein complex', '≈ 10–20 nm')}
    ${row(5e-9, `<rect class="fl4a-memb" x="${ix - 22}" y="${f(y(5e-9) - 5)}" width="44" height="10" rx="2"/><path class="fl4a-sacline" d="M${ix - 22},${f(y(5e-9) - 5)}H${ix + 22}M${ix - 22},${f(y(5e-9) + 5)}H${ix + 22}"/>`, 'thylakoid membrane', '≈ 5 nm thick')}
    ${row(1e-9, chl(ix - 8, y(1e-9)), 'chlorophyll', '≈ 1 nm')}
  `);
}

/* ---------- e · one leaf, a chain of magnifiers ---------- */

function nestedSvg(): string {
  const p = 'f4ae';
  const C1: Circ = [318, 184, 106], C2: Circ = [604, 196, 120], C3: Circ = [592, 450, 118];
  const m0: Circ = [214, 408, 13];
  const cells = cellsTop(C1[0], C1[1], C1[2], 30, 5);
  const d1 = nearest(cells.discs, C1[0] + 50, C1[1] + 14);
  const m1: Circ = [d1[0], d1[1], 9];
  const L: Lens = { cx: C2[0], cy: C2[1] + 2, rx: 100, ry: 53 };
  const cp = chloroplast(L);
  const g = cp.grana[5];
  const m2: Circ = [g.x, g.y, 20];
  const th = thylakoids(p, 470, 714, 391, { xg: 586, m: 10, lu: 12, gap: 11, cw: 20 });
  const lc = nearest(th.lam, 690, 600), gc = nearest(th.gran, 520, 460);
  return svg('One leaf and a chain of magnifiers: the leaf cells, one chloroplast with its envelope and grana, and the thylakoid membranes holding pigment–protein complexes', `
    ${defs(p)}
    ${leaf(176, 436, 300, -38)}
    ${lab(86, 356, 'leaf')}
    ${tangents(m0, C1)}${tangents(m1, C2)}${tangents(m2, C3)}
    ${zcirc(m0)}
    ${lensRing(C1)}<circle class="fl4a-wall" cx="${C1[0]}" cy="${C1[1]}" r="${C1[2] - 1}"/>${clipCirc(`${p}-c1`, C1)}<g clip-path="url(#${p}-c1)">${cells.svg}</g>${ring(C1)}${zcirc(m1)}
    ${lab(C1[0], 50, 'cells')}${tag(C1[0], 72, '≈ 50 µm')}
    ${lensRing(C2)}${clipCirc(`${p}-c2`, C2)}<g clip-path="url(#${p}-c2)">${cp.svg}</g>${ring(C2)}${zcirc(m2)}
    ${lab(C2[0], 50, 'chloroplast')}${tag(C2[0], 72, '≈ 5 µm')}
    ${lab(C2[0], 120, 'envelope')}${leader([C2[0], 127], onLens(L, 270))}
    ${lensRing(C3)}${clipCirc(`${p}-c3`, C3)}<g clip-path="url(#${p}-c3)">${th.svg}</g>${ring(C3)}
    ${note(650, 424, 'stroma')}
    ${text(458, 396, 'thylakoid', 'sm fl4a-b', 'end')}${text(458, 420, 'membranes', 'sm fl4a-b', 'end')}${leader([462, 412], [gc[0] - 30, th.y[0] + 6])}
    ${text(458, 500, 'pigment–protein', 'sm fl4a-b', 'end')}${text(458, 524, 'complexes', 'sm fl4a-b', 'end')}${leader([462, 510], [gc[0], gc[1] + 6])}
    ${lab(498, 584, 'granum')}${leader([506, 566], [520, th.y[2] + th.H + 2])}
    ${lab(790, 584, 'stroma lamella', 'end')}${leader([715, 566], [lc[0], lc[1] + 7])}
  `);
}

/* ---------- f · three levels side by side ---------- */

function levelsSvg(): string {
  const p = 'f4af';
  const cell: string[] = [], cps: Pt[] = [];
  for (let k = 0; k < 8; k++) {
    const yy = 158 + k * 38;
    for (const xx of [67, 153]) { cell.push(cpl(xx, yy, 0, 6, 12.5)); cps.push([xx, yy]); }
  }
  cell.push(cpl(95, 142, 90, 6, 12.5), cpl(125, 142, 90, 6, 12.5), cpl(95, 438, 90, 6, 12.5), cpl(125, 438, 90, 6, 12.5));
  const c1 = cps[7];
  const L: Lens = { cx: 370, cy: 282, rx: 130, ry: 74 };
  const cp = chloroplast(L);
  const g = cp.grana[6];
  const th = thylakoids(p, 552, 770, 196, { xg: 650, m: 15, lu: 18, gap: 16, cw: 26 });
  const lc = nearest(th.lam, 676, 0);
  return svg('Three levels side by side: a leaf cell lined with chloroplasts; one chloroplast with envelope, grana, stroma lamellae and stroma; the thylakoid membranes holding pigment–protein complexes', `
    ${defs(p)}
    ${lab(110, 92, 'leaf cell')}${lab(370, 92, 'chloroplast')}${lab(660, 92, 'thylakoid membranes')}
    ${panel(20, 110, 200, 470)}
    <rect class="fl4a-cell" x="55" y="128" width="110" height="324" rx="36"/>${cell.join('')}
    ${lab(110, 498, 'chloroplasts')}${leader([110, 480], [cps[14][0] + 3, cps[14][1] + 12])}
    ${zline([c1[0] + 7, c1[1] - 13], [220, 110])}${zline([c1[0] + 7, c1[1] + 13], [220, 470])}
    ${panel(220, 110, 520, 470)}${zbox(c1[0], c1[1], 18, 30)}
    ${cp.svg}
    ${lab(240, 170, 'envelope', 'start')}${leader([270, 177], onLens(L, 232))}
    ${lab(500, 170, 'granum', 'end')}${leader([458, 177], [cp.grana[4].x + 6, cp.grana[4].y - cp.grana[4].h / 2 - 2])}
    ${note(240, 410, 'stroma', 'start')}${leader([270, 392], [L.cx - L.rx * 0.42, L.cy + L.ry * 0.72])}
    ${lab(500, 410, 'stroma lamella', 'end')}${leader([458, 392], [L.cx + L.rx * 0.7, g.y + 4])}
    ${zline([g.x + g.w / 2 + 5, g.y - g.h / 2 - 6], [540, 110])}${zline([g.x + g.w / 2 + 5, g.y + g.h / 2 + 6], [540, 470])}
    ${panel(540, 110, 780, 470)}${zbox(g.x, g.y, g.w + 10, g.h + 12)}
    ${th.svg}
    ${text(660, 150, 'pigment–protein', 'sm fl4a-b')}${text(660, 174, 'complexes', 'sm fl4a-b')}${leader([lc[0], 180], [lc[0], lc[1] - 12])}
    ${lab(601, 410, 'granum')}${lab(690, 446, 'stroma lamella')}
    ${tag(110, 530, 'cell ≈ 50 µm')}${tag(370, 530, '≈ 5 µm across')}${tag(660, 530, 'membrane ≈ 5 nm thick')}
  `);
}

/* ---------- g · as an electron microscope shows it, and as a scheme ---------- */

function seenSvg(): string {
  const p = 'f4ag';
  const A: Lens = { cx: 202, cy: 300, rx: 184, ry: 112 }, B: Lens = { cx: 598, cy: 300, rx: 184, ry: 112 };
  const tem = chloroplast(A, 'tem', p), sch = chloroplast(B);
  const um = (2 * A.rx) / 5;
  return svg('The same chloroplast twice: drawn as an electron micrograph shows it (grey, dark grana stacks, scale bar 1 µm) and as a labelled scheme with envelope, grana, stroma lamellae and stroma', `
    ${defs(p)}
    ${lab(A.cx, 104, 'electron microscope')}${tag(A.cx, 128, 'drawn after micrographs')}
    ${lab(B.cx, 104, 'scheme')}
    ${tem.svg}${sch.svg}
    <path class="fl4a-scale" d="M${f(A.cx - A.rx + 10)},462H${f(A.cx - A.rx + 10 + um)}"/>${tag(A.cx - A.rx + 10 + um / 2, 490, '1 µm')}
    ${lab(440, 162, 'envelope', 'start')}${leader([470, 169], onLens(B, 232))}
    ${lab(780, 162, 'granum', 'end')}${leader([720, 169], [sch.grana[4].x + 6, sch.grana[4].y - sch.grana[4].h / 2 - 2])}
    ${lab(440, 462, 'stroma', 'start')}${leader([470, 444], [B.cx - B.rx * 0.5, B.cy + B.ry * 0.62])}
    ${lab(780, 462, 'stroma lamella', 'end')}${leader([716, 444], [B.cx + B.rx * 0.68, sch.grana[6].y + 2])}
  `);
}

/* ---------- h · a slab of thylakoid membrane in 3-D, after cryo-electron tomography ---------- */

function slabSvg(): string {
  const p = 'f4ah';
  const cx = 300, R = 178, k = 0.36, th = 22, step = 34, base = 404;
  const Y = (i: number): number => base - i * step;
  const r = rng(21);
  /** The front face of a disc of thickness th whose top face is centred at (cx, yt): membrane, lumen, membrane. */
  const side = (yt: number): string => {
    const arc = (y0: number, y1: number, cls: string): string =>
      `<path class="${cls}" d="M${f(cx - R)},${f(y0)}A${f(R)},${f(R * k)} 0 0 0 ${f(cx + R)},${f(y0)}L${f(cx + R)},${f(y1)}A${f(R)},${f(R * k)} 0 0 1 ${f(cx - R)},${f(y1)}Z"/>`;
    return arc(yt, yt + th, 'fl4a-side') + arc(yt + 6, yt + th - 6, 'fl4a-sidelu');
  };
  const disc = (i: number): string => `${side(Y(i))}<ellipse class="fl4a-top" cx="${cx}" cy="${f(Y(i))}" rx="${R}" ry="${f(R * k)}"/>`;
  /** A particle on a surface: an upright pill with a shadow; dimers come as two. */
  const pill = (x: number, y: number, w = 9): string => `<ellipse class="fl4a-ptsh" cx="${f(x + 1.5)}" cy="${f(y + 3)}" rx="${f(w)}" ry="${f(w * 0.45)}"/><ellipse class="fl4a-pt" cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(w * 0.5)}"/><circle class="fl4a-chl" cx="${f(x - w * 0.3)}" cy="${f(y)}" r="1.5"/><circle class="fl4a-chl" cx="${f(x + w * 0.3)}" cy="${f(y)}" r="1.5"/>`;
  const topPts: Pt[] = [];
  for (let gy = -0.78; gy <= 0.8; gy += 0.36) for (let gx = -0.84; gx <= 0.86; gx += 0.26) {
    const u = gx + (r() - 0.5) * 0.08, v = gy + (r() - 0.5) * 0.1;
    if (u * u + v * v < 0.74) topPts.push([cx + u * R, Y(3) + v * R * k]);
  }
  const grana = topPts.map(([x, y]) => pill(x - 10, y, 9.5) + pill(x + 10, y, 9.5)).join('');
  // the stroma lamella: a flat sheet leaving disc 1 towards the front right, with its front face
  const ang = (24 * Math.PI) / 180, s0 = R * 0.7, s1 = R + 300, w = 46;
  const P = (s: number, q: number): Pt => [cx + s * Math.cos(ang) - q * Math.sin(ang), Y(1) + (s * Math.sin(ang) + q * Math.cos(ang)) * k];
  const a0 = P(s0, -w), a1 = P(s1, -w), b1 = P(s1, w), b0 = P(s0, w);
  const sheet = `<path class="fl4a-side" d="M${f(b0[0])},${f(b0[1])}L${f(b1[0])},${f(b1[1])}L${f(b1[0])},${f(b1[1] + th)}L${f(b0[0])},${f(b0[1] + th)}Z"/>`
    + `<path class="fl4a-sidelu" d="M${f(b0[0])},${f(b0[1] + 6)}L${f(b1[0])},${f(b1[1] + 6)}L${f(b1[0])},${f(b1[1] + th - 6)}L${f(b0[0])},${f(b0[1] + th - 6)}Z"/>`
    + `<path class="fl4a-side" d="M${f(b1[0])},${f(b1[1])}L${f(a1[0])},${f(a1[1])}L${f(a1[0])},${f(a1[1] + th)}L${f(b1[0])},${f(b1[1] + th)}Z"/>`
    + `<path class="fl4a-top" d="M${f(a0[0])},${f(a0[1])}L${f(a1[0])},${f(a1[1])}L${f(b1[0])},${f(b1[1])}L${f(b0[0])},${f(b0[1])}Z"/>`;
  const lamPts = [0.3, 0.45, 0.6, 0.74, 0.88].map((t, i) => P(s0 + (s1 - s0) * t, (i % 2 ? 0.45 : -0.4) * w));
  const lamP = lamPts.map(([x, y]) => pill(x, y, 10)).join('');
  const t1 = nearest(topPts, cx + R * 0.5, Y(3)), l1 = lamPts[2];
  return svg('A granum of four stacked thylakoids and a stroma lamella leaving it, drawn in 3-D: each thylakoid is a membrane around a thin lumen; pigment–protein complexes stud the membranes, packed evenly in the granum and fewer in the lamella', `
    ${defs(p)}
    ${disc(0)}${disc(1)}${sheet}${lamP}${disc(2)}${disc(3)}${grana}
    ${lab(cx, 150, 'granum')}${tag(cx, 174, '0.3–0.6 µm across')}${leader([cx, 182], [cx, Y(3) - R * k - 3])}
    ${text(650, 196, 'pigment–protein', 'sm fl4a-b')}${text(650, 220, 'complexes', 'sm fl4a-b')}${leader([606, 228], [t1[0] + 10, t1[1] - 5])}${leader([672, 228], [l1[0], l1[1] - 6])}
    ${lab(700, 560, 'stroma lamella')}${leader([700, 540], [P(s1 - 30, w)[0], P(s1 - 30, w)[1] + th + 2])}
    ${lab(cx - 60, 552, 'thylakoid membrane')}${tag(cx - 60, 576, '≈ 5 nm thick')}${leader([cx - 60, 532], [cx - 60, Y(0) + R * k * 0.94 + 12])}
    ${note(96, 250, 'stroma')}
    ${text(790, 594, 'after Wietrzynski et al. 2025', 'fl4a-credit-d', 'end')}
  `);
}

/* ---------- i · a real photo of leaf cells, then the drawn chloroplast and membranes ---------- */

function photoSvg(): string {
  const p = 'f4ai';
  const X0 = 20, Y0 = 44, W = 440, Hh = 536;
  // the photo is 800 × 600; sliced to fill the frame, it shows at scale Hh / 600 with its centre kept
  const s = Hh / 600, ox = X0 + W / 2 - 400 * s, oy = Y0;
  const at = (x: number, y: number): Pt => [ox + x * s, oy + y * s];
  const cpPhoto = at(365, 218);
  const L: Lens = { cx: 626, cy: 156, rx: 136, ry: 72 };
  const cp = chloroplast(L);
  const g = cp.grana[2];
  const th = thylakoids(p, 498, 772, 352, { xg: 600, m: 12, lu: 15, gap: 13, cw: 23 });
  const lc = nearest(th.lam, 720, 0);
  return svg('A light-microscope photo of moss leaf cells packed with green chloroplasts; one chloroplast drawn with envelope and grana; its thylakoid membranes holding pigment–protein complexes', `
    ${defs(p)}
    <clipPath id="${p}-ph"><rect x="${X0}" y="${Y0}" width="${W}" height="${Hh}" rx="12"/></clipPath>
    ${lab(X0, 30, 'moss leaf cells', 'start')}${tag(X0 + 178, 30, 'light microscope', 'start')}
    ${zline([cpPhoto[0] + 4, cpPhoto[1] - 15], onLens(L, 205))}${zline([cpPhoto[0] + 4, cpPhoto[1] + 15], onLens(L, 155))}
    <g clip-path="url(#${p}-ph)"><image href="${moss}" x="${f(ox)}" y="${f(oy)}" width="${f(800 * s)}" height="${f(600 * s)}"/>
      <rect class="fl4a-credbg" x="${X0}" y="${Y0 + Hh - 26}" width="${W}" height="26"/>${text(X0 + W - 10, Y0 + Hh - 8, 'Photo: Kristian Peters, CC BY-SA 3.0', 'fl4a-credit', 'end')}</g>
    <circle class="fl4a-zbw" cx="${f(cpPhoto[0])}" cy="${f(cpPhoto[1])}" r="17"/>
    <rect class="fl4a-pillbg" x="${f(cpPhoto[0] - 60)}" y="${f(cpPhoto[1] + 24)}" width="120" height="30" rx="15"/>${text(cpPhoto[0], cpPhoto[1] + 45, 'chloroplast', 'fl4a-pill')}
    ${lab(L.cx, 52, 'chloroplast', 'end')}${tag(L.cx + 10, 52, '≈ 5 µm', 'start')}
    ${cp.svg}
    ${lab(782, 76, 'envelope', 'end')}${leader([742, 82], onLens(L, 318))}
    ${lab(782, 262, 'granum', 'end')}${leader([742, 244], [cp.grana[5].x, cp.grana[5].y + cp.grana[5].h / 2 + 2])}
    ${zline([g.x - g.w / 2 - 5, g.y + g.h / 2 + 6], [486, 300])}${zline([g.x + g.w / 2 + 5, g.y + g.h / 2 + 6], [784, 300])}
    ${zbox(g.x, g.y, g.w + 10, g.h + 12)}
    ${panel(486, 300, 784, 562)}
    ${lab(498, 330, 'thylakoid membranes', 'start')}
    ${th.svg}
    ${text(700, 362, 'pigment–protein', 'sm fl4a-b')}${text(700, 384, 'complexes', 'sm fl4a-b')}${leader([lc[0], 389], [lc[0], th.y[1] - 4])}
    ${lab(556, 540, 'granum')}${lab(700, 540, 'stroma lamella')}
  `);
}

/* ---------- real images (j–m): shared marks ---------- */

interface Img { href: string; w: number; h: number }
const SYR: Img = { href: syringa, w: 1400, h: 789 };
const LTIP: Img = { href: letTip, w: 640, h: 743 };
const TOMO: Img = { href: tomo, w: 1053, h: 1005 };
const MODEL: Img = { href: model, w: 1116, h: 1005 };
const G3D: Img = { href: grana3d, w: 1400, h: 742 };
const MAP: Img = { href: mapped, w: 1008, h: 718 };
const MARG: Img = { href: margin, w: 889, h: 502 };
const PDB: Img = { href: pdb, w: 490, h: 322 };
const WIE = 'Wietrzynski et al. 2025, eLife, CC BY 4.0';

interface Photo { svg: string; at: (u: number, v: number) => Pt }
/** A real image in a rounded frame x, y, w, h, never stretched. By default it is scaled to cover the frame and the overhang is
 *  cut, ax / ay choosing which part stays (0 = left / top, 1 = right / bottom); 'meet' fits it inside instead, unframed, its white
 *  background multiplied into the page. The credit band (dark, white 13 px lines) runs along the top or bottom edge, over the
 *  whole width or bw units of it at the left (or right) end. at() maps image pixels to figure coordinates. */
function photo(id: string, im: Img, x: number, y: number, w: number, h: number,
  o: { ax?: number; ay?: number; meet?: boolean; line?: boolean; credit?: string[]; top?: boolean; bw?: number; right?: boolean } = {}): Photo {
  const s = o.meet ? Math.min(w / im.w, h / im.h) : Math.max(w / im.w, h / im.h);
  const iw = im.w * s, ih = im.h * s, ox = x + (w - iw) * (o.ax ?? 0.5), oy = y + (h - ih) * (o.ay ?? 0.5);
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(iw)}" height="${f(ih)}"${o.meet ? ' class="fl4a-mult"' : ''}/>`;
  let band = '';
  if (o.credit) {
    const n = o.credit.length, bh = 9 + 15 * n, by = o.top ? y : y + h - bh, bw = o.bw ?? w, bx = o.right ? x + w - bw : x;
    band = `<rect class="fl4a-credbg" x="${f(bx)}" y="${f(by)}" width="${f(bw)}" height="${bh}"/>`
      + o.credit.map((t, i) => text(+f(bx + bw - 9), +f(by + 16 + i * 15), t, 'fl4a-credit', 'end')).join('');
  }
  const svg = o.meet ? img
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath><g clip-path="url(#${id})">${img}${band}</g>`
      + (o.line ? `<rect class="fl4a-frame" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/>` : '');
  return { svg, at: (u, v) => [ox + u * s, oy + v * s] };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fl4a-ldh" d="${d}"/><path class="fl4a-ldk" d="${d}"/><circle class="fl4a-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};

/** A label on a real image: a white pill centred at (x, y); with `to`, a leader from the pill's edge to the structure. */
function pill(x: number, y: number, s: string, to?: Pt): string {
  const w = s.length * 8.8 + 22;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="fl4a-pillbg" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${text(x, y + 6, s, 'fl4a-pill')}`;
}

/** A two-line pill (for a narrow gap), centred at (x, y), with a leader from its edge to the structure. */
function pill2(x: number, y: number, s: [string, string], to: Pt): string {
  const w = Math.max(s[0].length, s[1].length) * 8.8 + 24, h = 48;
  const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), h / 2 / Math.max(Math.abs(dy), 1e-6));
  return `${pleader([x + dx * t, y + dy * t], to)}<rect class="fl4a-pillbg" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="14"/>`
    + text(x, y - 3, s[0], 'fl4a-pill') + text(x, y + 17, s[1], 'fl4a-pill');
}

/** A pill whose label carries a colour swatch: what that colour means in the image it sits on (a source's colour legend). */
function swPill(x: number, y: number, s: string, sw: string, to: Pt): string {
  const w = s.length * 8.8 + 40, dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
  return `${pleader([x + dx * t, y + dy * t], to)}<rect class="fl4a-pillbg" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>`
    + `<circle class="${sw}" cx="${f(x - w / 2 + 15)}" cy="${f(y)}" r="6.5"/>${text(+f(x + 9), +f(y + 6), s, 'fl4a-pill')}`;
}
/** A colour key from a source legend: swatch and name, in `cols` columns dx apart, rows dy apart, from (x, y). */
const swKey = (x: number, y: number, items: Array<[string, string]>, cols: number, dx: number, dy: number): string => items.map(([c, t], i) => {
  const cx = x + (i % cols) * dx, cy = y + Math.floor(i / cols) * dy;
  return `<circle class="${c}" cx="${f(cx + 7)}" cy="${f(cy - 6)}" r="7"/>${text(cx + 21, cy, t, 'fl4a-pill', 'start')}`;
}).join('');

/** A zoom mark on a real image: the orange box in a light halo. */
const zboxP = (x: number, y: number, w: number, h: number): string =>
  `<rect class="fl4a-zbh" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="3"/>${zbox(x, y, w, h)}`;

/* ---------- j · four real images, read clockwise as in a ---------- */

function realZoomSvg(): string {
  const p = 'f4aj';
  // leaf section (light microscope)
  const a = photo(`${p}-a`, SYR, 32, 68, 341, 205, { credit: ['Berkshire Community College, CC0'] });
  const ca = a.at(1222, 230);
  // the tip of a chloroplast (STEM tomography): the part of the slice without baked-in labels, its 200 nm bar kept
  const b = photo(`${p}-b`, LTIP, 427, 68, 205, 205, { ay: 1, credit: ['Yuv345, CC BY-SA 4.0', 'data: Bussi et al. 2019'], top: true });
  const env = b.at(480, 238), gra = b.at(470, 430), str = b.at(440, 505), cb = b.at(300, 430);
  // granum margin and stroma lamella (cryo-ET), its 100 nm bar kept; the credit band stops short of the bar
  const c = photo(`${p}-c`, MARG, 427, 363, 341, 205, { ax: 1, credit: [WIE], bw: 262 });
  const cg = c.at(150, 180), cl = c.at(760, 160), cc = c.at(100, 400);
  // one pigment–protein complex, top view (RCSB 5XNL)
  const d = photo(`${p}-d`, PDB, 32, 363, 341, 185, { meet: true });
  return svg('Four real images, zooming in clockwise: a stained leaf cross-section; the tip of a chloroplast in an electron tomogram, with envelope, granum and stroma; thylakoid membranes in a cryo-electron tomogram, a granum and a stroma lamella; one pigment–protein complex seen from above', `
    ${defs(p)}
    ${panel(20, 20, 385, 285)}${panel(415, 20, 780, 285)}${panel(415, 315, 780, 580)}${panel(20, 315, 385, 580)}
    ${lab(40, 54, 'leaf cross-section', 'start')}${a.svg}${zboxP(ca[0], ca[1], 12, 22)}
    ${zarrow(p, [ca[0] + 7, ca[1]], [409, ca[1]])}
    ${lab(435, 54, 'chloroplast', 'start')}${b.svg}${zboxP(cb[0], cb[1], 20, 14)}
    ${text(652, 128, 'envelope', 'sm fl4a-b', 'start')}${pleader([648, 121], env)}
    ${text(652, 188, 'granum', 'sm fl4a-b', 'start')}${pleader([648, 181], gra)}
    ${text(652, 240, 'stroma', 'fl4a-note', 'start')}${pleader([648, 233], str)}
    ${zarrow(p, [cb[0], cb[1] + 8], [cb[0], 309])}
    ${lab(435, 349, 'thylakoid membranes', 'start')}${c.svg}
    ${pill(500, 384, 'granum', cg)}${pill(690, 384, 'stroma lamella', cl)}
    ${zboxP(cc[0], cc[1], 16, 12)}${zarrow(p, [cc[0] - 9, cc[1]], [391, cc[1]])}
    ${lab(40, 349, 'pigment–protein complex', 'start')}${d.svg}
    ${text(365, 568, 'RCSB PDB, PDB ID 5XNL (Su et al. 2017)', 'fl4a-credit-d', 'end')}
  `);
}

/* ---------- k · one cryo-ET field twice: the tomogram and its 3-D model ---------- */

function pairSvg(): string {
  const p = 'f4ak';
  const H = 345, wa = (H * TOMO.w) / TOMO.h, wb = (H * MODEL.w) / MODEL.h;
  const a = photo(`${p}-a`, TOMO, 20, 46, wa, H, { line: true, credit: [WIE], top: true });
  const b = photo(`${p}-b`, MODEL, 780 - wb, 46, wb, H, { credit: [WIE] });
  const env = a.at(95, 170), gra = a.at(700, 330), lam = a.at(326, 770);
  const ins = photo(`${p}-c`, MAP, 280, 412, 500, 178, { ay: 1, credit: [WIE], bw: 266 });
  const dot = ins.at(330, 470);
  return svg('One chloroplast region seen twice: a cryo-electron tomogram slice with envelope, granum, stroma lamellae and stroma, and its 3-D model; below, a granum with every pigment–protein complex mapped', `
    ${defs(p)}
    ${lab(20, 32, 'chloroplast', 'start')}${tag(152, 32, 'cryo-electron tomogram', 'start')}
    ${tag(780 - wb, 32, '3-D model of the same region', 'start')}
    ${a.svg}${b.svg}
    ${pill(123, 97, 'envelope', env)}
    ${pill(89, 190, 'stroma')}
    ${pill(322, 225, 'granum', gra)}
    ${lab(lam[0], 430, 'stroma lamella')}${pleader([lam[0], 412], lam)}
    ${ins.svg}
    ${text(266, 486, 'pigment–protein', 'sm fl4a-b', 'end')}${text(266, 510, 'complexes,', 'sm fl4a-b', 'end')}${text(266, 534, 'each one mapped', 'sm fl4a-b', 'end')}
    ${pleader([272, 503], dot)}
  `);
}

/* ---------- l · the thylakoid membranes in 3-D, from cryo-ET ---------- */

function real3dSvg(): string {
  const p = 'f4al';
  const W = 760, H = (W * G3D.h) / G3D.w;
  const a = photo(`${p}-a`, G3D, 20, 46, W, H, { credit: [WIE], bw: 266, right: true });
  const v = (x: number, y: number): Pt => a.at(x * 0.7, y * 0.7);
  const ins = photo(`${p}-c`, MAP, 420, 462, 360, 128, { ay: 1, credit: [WIE], bw: 266 });
  const dot = ins.at(300, 460);
  return svg('A 3-D model of thylakoid membranes from cryo-electron tomography: grana stacks joined by stroma lamellae; below, a granum with every pigment–protein complex mapped', `
    ${defs(p)}
    ${lab(20, 32, 'thylakoid membranes', 'start')}${tag(264, 32, '3-D model from cryo-electron tomography', 'start')}
    ${a.svg}
    ${pill(735, 75, 'granum', v(1600, 120))}
    ${pill(112, 110, 'stroma lamella', v(450, 330))}
    ${lab(20, 494, 'thylakoid membrane', 'start')}${pleader([120, 474], v(500, 990))}
    ${ins.svg}
    ${text(406, 532, 'pigment–protein', 'sm fl4a-b', 'end')}${text(406, 556, 'complexes', 'sm fl4a-b', 'end')}${pleader([410, 544], dot)}
  `);
}

/* ---------- m · drawn leaf and cells, the real chloroplast, drawn membranes ---------- */

function mixedSvg(): string {
  const p = 'f4am';
  // the chloroplast tip without its top 110 px, which hold only cytoplasm and most of the tomogram's dark corner
  const X = 155, W = 420, H = ((LTIP.h - 110) * W) / LTIP.w, Y = 92, YB = Y + H, XP = 590;
  const a = photo(`${p}-a`, LTIP, X, Y, W, H, { ay: 1 });
  const env = a.at(330, 195), lamP = a.at(200, 300), gra = a.at(300, 440), gb = a.at(470, 420);
  const pl = (u: number, v: number, s: string, to?: Pt): string => { const q = a.at(u, v); return pill(q[0], q[1], s, to); };
  const m0: Circ = [86, Y + 74, 7], C1: Circ = [80, Y + 282, 60];
  const cells = cellsTop(C1[0], C1[1], C1[2], 17, 5);
  const d1 = nearest(cells.discs, C1[0] + 24, C1[1] + 6);
  const th = thylakoids(p, XP + 14, 766, Y + 140, { xg: 694, m: 14, lu: 17, gap: 15, cw: 21 });
  const lc = nearest(th.lam, 735, 0);
  return svg('A drawn leaf and its cells, then a real electron-tomogram slice of the tip of a chloroplast with envelope, granum, stroma lamellae and stroma, then the thylakoid membranes drawn with their pigment–protein complexes', `
    ${defs(p)}
    ${lab(80, Y - 18, 'leaf')}
    ${leaf(80, Y + 80, 112, -30)}
    ${tangents(m0, C1)}${zcirc(m0)}
    ${lensRing(C1)}<circle class="fl4a-wall" cx="${C1[0]}" cy="${C1[1]}" r="${C1[2] - 1}"/>${clipCirc(`${p}-c1`, C1)}<g clip-path="url(#${p}-c1)">${cells.svg}</g>${ring(C1)}${zcirc([d1[0], d1[1], 7])}
    ${lab(80, Y + 376, 'cells')}${tag(80, Y + 400, '≈ 50 µm')}
    ${zline([d1[0] + 3, d1[1] - 6], [X, Y])}${zline([d1[0] + 3, d1[1] + 6], [X, YB])}
    ${lab(X + W / 2, Y - 18, 'chloroplast')}
    ${a.svg}
    ${pl(200, 140, 'envelope', env)}${pl(150, 250, 'stroma lamella', lamP)}${pl(330, 520, 'granum', gra)}${pl(120, 590, 'stroma')}
    ${zboxP(gb[0], gb[1], 18, 14)}
    ${zline([gb[0] + 9, gb[1] - 7], [XP, Y])}${zline([gb[0] + 9, gb[1] + 7], [XP, YB])}
    ${text(X, YB + 20, 'Yuv345 / Wikimedia Commons, CC BY-SA 4.0', 'fl4a-credit-d', 'start')}${text(X, YB + 37, '(data: Bussi et al. 2019, PNAS)', 'fl4a-credit-d', 'start')}
    ${text(780, Y - 18, 'thylakoid membranes', 'sm fl4a-b', 'end')}
    ${panel(XP, Y, 780, YB)}
    ${text(685, Y + 56, 'pigment–protein', 'sm fl4a-b')}${text(685, Y + 80, 'complexes', 'sm fl4a-b')}${leader([lc[0], Y + 88], [lc[0], lc[1] - 10])}
    ${th.svg}
    ${lab(648, Y + 342, 'granum')}${lab(690, Y + 378, 'stroma lamella')}
    ${tag(780, YB + 28, 'membrane ≈ 5 nm thick', 'end')}
  `);
}

/* ---------- n–w: more real images and our own 3-D renders of LHCII (sources, licences, crops: assets/SOURCES.md) ---------- */

const LBLOCK: Img = { href: leafBlock, w: 1255, h: 1234 };
const KDRAW: Img = { href: cpDraw, w: 1385, h: 910 };
const CTEM: Img = { href: cpTem, w: 1400, h: 768 };
const GTEM: Img = { href: granaTem, w: 1400, h: 529 };
const LSEC: Img = { href: leafSec, w: 1279, h: 1023 };
const CELL3: Img = { href: cell3d, w: 417, h: 364 };
const LEAF3: Img = { href: leaf3d, w: 346, h: 337 };
const CP3: Img = { href: cp3d, w: 1400, h: 619 };
const BRY: Img = { href: bryum, w: 1250, h: 850 };
const LEAFP: Img = { href: leafPhoto, w: 700, h: 510 };
const SEGC: Img = { href: segClean, w: 1115, h: 1004 };
const LTOP: Img = { href: lhcTop, w: 809, h: 794 };
const LSIDE: Img = { href: lhcSide, w: 809, h: 546 };
const CHL: Img = { href: chlPng, w: 517, h: 511 };
const C_STA = 'Staehelin & Paolillo 2020, CC BY 4.0';
const C_PDB = 'PDB 2BHW (Standfuss et al. 2005)';
/** Label anchors in our LHCII renders, in pixels of the PNGs, each checked on the render: a grey protein ribbon, a green
 *  chlorophyll and an orange carotenoid near the left (L), right (R), top (T) or bottom (B) edge. m1, m2: the Mg atoms of two
 *  neighbouring chlorophylls (chain B 602 and 607, 0.98 nm apart), projected by model3d/complex.html?bare=1. In the side render
 *  (stroma up) the membrane's hydrocarbon core runs from y = 140 to 434 (2.9 nm, OPM). */
const TOPA = { protL: [165, 495], chlL: [110, 300], carL: [45, 540], protR: [755, 424], chlR: [704, 322], carR: [698, 698],
  protT: [384, 103], chlT: [469, 63], carT: [508, 52], chlB: [709, 658], m1: [327, 716], m2: [417, 729] } satisfies Record<string, Pt>;
const SIDEA = { protL: [159, 81], protR: [657, 85], chlL: [73, 408], chlR: [700, 380], carL: [45, 190], carR: [737, 206], m1: [327, 245], m2: [417, 209] } satisfies Record<string, Pt>;
const MEM_T = 140, MEM_B = 434;
/** Anchors in the chloroplast micrograph (chloroplast-tem.jpg), each checked at full size: a granum, a single stroma lamella,
 *  open stroma, the envelope, and a granum to zoom into. */
const TEMA = { gra: [520, 400], lam: [593, 565], str: [706, 266], env: [1044, 179], zg: [860, 420] } satisfies Record<string, Pt>;
/** Anchors in the chloroplast drawing (chloroplast-drawing.jpg), each checked at full size: the envelope rims, a granum, a
 *  stroma lamella between grana (low, lamB; high, lamT), open stroma, one opened thylakoid, a granum to zoom into. */
const KDA = { env: [480, 220], gra: [690, 460], lamB: [960, 470], lamT: [860, 262], str: [860, 520], mem: [965, 245], zg: [1000, 330],
  envR: [1225, 300], graT: [700, 250] } satisfies Record<string, Pt>;

/** Rough text widths, for placing a size tag after a label. */
const tw = (s: string, px = 22): number => s.length * px * 0.53;
/** A panel heading: the name in bold, its size in grey after it. */
const head = (x: number, y: number, name: string, size = ''): string =>
  lab(x, y, name, 'start') + (size ? tag(x + tw(name) + 10, y, size, 'start') : '');
/** A label on the page ground with a leader onto an image (halo line and dot). */
function lt(x: number, y: number, s: string, a: 'start' | 'middle' | 'end', to: Pt, from?: Pt): string {
  const fr: Pt = from ?? (a === 'start' ? [x - 6, y - 7] : a === 'end' ? [x + 6, y - 7] : [x, to[1] > y ? y + 7 : y - 23]);
  return text(x, y, s, 'sm fl4a-b', a) + pleader(fr, to);
}
const cred = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'start'): string => text(x, y, s, 'fl4a-credit-d', a);
/** The distance between two neighbouring chlorophylls: a bar between their Mg atoms and an "≈ 1 nm" pill. */
function nm(a: Pt, b: Pt, at: Pt): string {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fl4a-ldh" d="${d}" style="stroke-width:6"/><path class="fl4a-ldk" d="${d}" style="stroke-width:2.2"/>`
    + [a, b].map(q => `<circle class="fl4a-tipd" cx="${f(q[0])}" cy="${f(q[1])}" r="3.4"/>`).join('') + pill(at[0], at[1], '≈ 1 nm');
}
/** A zoom arrow between two panels. */
const zar = (p: string, a: Pt, b: Pt): string => zarrow(p, a, b);
/** A colour key for the LHCII render: protein, chlorophyll, carotenoid, one per line from (x, y). */
const key = (x: number, y: number, dy = 23): string => ([['fl4a-kprot', 'protein'], ['fl4a-kchl', 'chlorophyll'], ['fl4a-kcar', 'carotenoid']] as const)
  .map(([c, t], i) => `<circle class="${c}" cx="${f(x + 7)}" cy="${f(y + i * dy - 6)}" r="7"/>${text(x + 21, y + i * dy, t, 'fl4a-pill', 'start')}`).join('');

/* ---------- n · labelled path, read clockwise: drawn leaf block → drawn chloroplast → grana (TEM) → our LHCII render ---------- */

function pathSvg(): string {
  const p = 'f4an';
  const a = photo(`${p}-a`, LBLOCK, 20, 52, 248, 244, { meet: true });
  const cell = a.at(479, 636), az = a.at(385, 540);
  const b = photo(`${p}-b`, KDRAW, 300, 52, 480, 315, { meet: true });
  const env = b.at(...KDA.env), gra = b.at(...KDA.gra), lam = b.at(...KDA.lamB), str = b.at(...KDA.str), bz = b.at(...KDA.zg);
  const c = photo(`${p}-c`, GTEM, 400, 410, 380, 144, { credit: [C_STA] });
  const cg = c.at(200, 250), cl = c.at(560, 190), cz = c.at(150, 400);
  const d = photo(`${p}-d`, LTOP, 190, 404, 180, 177, { meet: true });
  const T = (k: keyof typeof TOPA): Pt => d.at(...TOPA[k]);
  return svg('A labelled path in four steps, read clockwise: a drawn block of leaf with its mesophyll cells and chloroplasts; a drawn chloroplast cut open, with envelope, grana, stroma lamellae and stroma; grana in an electron micrograph; one pigment–protein complex rendered from its structure, its protein holding chlorophylls and carotenoids', `
    ${defs(p)}
    ${head(20, 36, 'leaf', 'cell ≈ 50 µm')}
    ${a.svg}${zboxP(az[0], az[1], 12, 14)}
    ${lt(144, 322, 'mesophyll cell', 'middle', cell)}
    ${cred(20, 346, 'Zephyris, CC BY-SA 3.0, adapted')}
    ${zar(p, [az[0] + 8, az[1]], [326, az[1]])}
    ${head(300, 36, 'chloroplast', '≈ 5 µm')}
    ${b.svg}${zboxP(bz[0], bz[1], 20, 20)}
    ${pill(372, 100, 'envelope', env)}${pill(414, 250, 'granum', gra)}${pill(440, 300, 'stroma lamella', lam)}${pill(str[0], str[1], 'stroma')}
    ${cred(780, 378, 'Kelvinsong, CC0', 'end')}
    ${zar(p, [bz[0], bz[1] + 11], [bz[0], 404])}
    ${head(400, 396, 'thylakoid membranes')}${tag(400, 582, 'granum 0.3–0.6 µm across', 'start')}
    ${c.svg}${pill(470, 436, 'granum', cg)}${pill(650, 436, 'stroma lamella', cl)}${zboxP(cz[0], cz[1], 12, 12)}
    ${zar(p, [cz[0] - 7, cz[1]], [374, cz[1]])}
    ${head(20, 396, 'pigment–protein complex', '≈ 8 nm')}
    ${d.svg}
    ${lt(176, 450, 'chlorophyll', 'end', T('chlL'))}${lt(176, 506, 'protein', 'end', T('protL'))}${lt(176, 562, 'carotenoid', 'end', T('carL'))}
    ${cred(20, 594, C_PDB)}
  `);
}

/* ---------- o · real micrographs only: leaf section → chloroplast (TEM) → thylakoids (cryo-ET) → our LHCII render ---------- */

function microSvg(): string {
  const p = 'f4ao';
  const a = photo(`${p}-a`, LSEC, 20, 52, 300, 240, { credit: ['V44020001, public domain'] });
  const cell = a.at(230, 290), z1 = a.at(560, 230);
  const b = photo(`${p}-b`, CTEM, 340, 52, 440, 241, { credit: [`${C_STA}, adapted`] });
  const env = b.at(...TEMA.env), gra = b.at(...TEMA.gra), lam = b.at(...TEMA.lam), str = b.at(...TEMA.str), z2 = b.at(...TEMA.zg);
  const c = photo(`${p}-c`, TOMO, 20, 340, 260, 248, { credit: ['Wietrzynski et al. 2025', 'eLife, CC BY 4.0'], bw: 168 });
  const cg = c.at(700, 330), cl = c.at(326, 770), z3 = c.at(720, 640);
  const d = photo(`${p}-d`, LSIDE, 330, 368, 290, 196, { meet: true });
  const T = (k: keyof typeof SIDEA): Pt => d.at(...SIDEA[k]);
  return svg('Real images only, from different plants at each scale: a fresh leaf cross-section of an unidentified plant with its mesophyll cells; one tobacco chloroplast in an electron micrograph, with envelope, grana, stroma lamellae and stroma; spinach thylakoid membranes in a cryo-electron tomogram; and one pigment–protein complex of pea rendered from its structure', `
    ${defs(p)}
    ${head(20, 36, 'leaf', 'unidentified plant')}
    ${a.svg}${pill(132, 80, 'mesophyll cell, ≈ 50 µm', cell)}${zboxP(z1[0], z1[1], 12, 12)}
    ${zar(p, [z1[0] + 7, z1[1]], [334, z1[1]])}
    ${head(340, 36, 'tobacco chloroplast', '≈ 5 µm')}
    ${b.svg}
    ${pill(690, 82, 'envelope', env)}${pill(420, 86, 'granum', gra)}${pill(430, 252, 'stroma lamella', lam)}${pill(str[0], str[1], 'stroma')}
    ${zboxP(z2[0], z2[1], 16, 16)}${zar(p, [z2[0] - 6, z2[1] + 9], [296, 346])}
    ${tag(20, 326, 'spinach', 'start')}${lab(98, 326, 'thylakoid membranes', 'start')}
    ${c.svg}${pill(222, 372, 'granum', cg)}${pill(96, 470, 'stroma lamella', cl)}${zboxP(z3[0], z3[1], 12, 12)}
    ${zar(p, [z3[0] + 7, z3[1]], [334, z3[1]])}
    ${head(330, 356, 'pigment–protein complex', 'pea, ≈ 8 nm')}
    ${d.svg}
    ${lt(642, 410, 'protein', 'start', T('protR'))}${lt(642, 466, 'carotenoid', 'start', T('carR'))}${lt(642, 522, 'chlorophyll', 'start', T('chlR'))}
    ${cred(330, 588, C_PDB)}
    ${tag(642, 552, 'different plants', 'start')}${tag(642, 575, 'at each scale', 'start')}
  `);
}

/* ---------- p · 3-D all the way: leaf model → whole cell → chloroplast → thylakoid membranes → our LHCII render ---------- */

function threeDSvg(): string {
  const p = 'f4ap';
  const a = photo(`${p}-a`, LEAF3, 20, 52, 200, 195, { credit: ['Xiao, Tholen & Zhu 2016', 'CC BY 3.0'] });
  const az = a.at(170, 160);
  const b = photo(`${p}-b`, CELL3, 20, 346, 200, 175, { credit: ['Midorikawa et al. 2022', 'CC BY 4.0'] });
  const bc = b.at(265, 226), bz = b.at(375, 135);
  const c = photo(`${p}-c`, CP3, 250, 52, 530, 234, { credit: ['Yuv345, CC BY-SA 4.0 (data: Bussi et al. 2019)'], bw: 330, right: true });
  const ce = c.at(1357, 323), cg = c.at(420, 320), cl = c.at(599, 166), cz = c.at(380, 420);
  const d = photo(`${p}-d`, G3D, 280, 346, 300, 159, { credit: [WIE], bw: 266, right: true });
  const dg = d.at(1000, 311), dl = d.at(306, 212), dz = d.at(1150, 521);
  const e = photo(`${p}-e`, LTOP, 600, 352, 180, 177, { meet: true });
  return svg('3-D views all the way down, from different plants at each scale: a model of a dicot leaf block with its mesophyll cells; one whole Arabidopsis mesophyll cell lined with chloroplasts, with its mitochondria and peroxisomes; a lettuce chloroplast reconstructed in 3-D, with envelope, grana, stroma lamellae and plastoglobules; spinach thylakoid membranes in 3-D from cryo-electron tomography; one pigment–protein complex of pea rendered from its structure', `
    ${defs(p)}
    ${head(20, 36, 'leaf model', 'dicot')}
    ${a.svg}${zboxP(az[0], az[1], 12, 12)}${zar(p, [az[0], az[1] + 8], [az[0], 296])}
    ${head(20, 316, 'mesophyll cell')}${text(20, 338, '<tspan font-style="italic">Arabidopsis</tspan>, ≈ 50 µm', 'fl4a-size', 'start')}
    ${b.svg}${pill(112, 380, 'chloroplast', bc)}${zboxP(bz[0], bz[1], 24, 24)}
    ${swKey(20, 544, [['fl4a-sw-cp', 'chloroplast'], ['fl4a-sw-mit', 'mitochondrion'], ['fl4a-sw-per', 'peroxisome']], 2, 120, 22)}
    ${zar(p, [bz[0] + 6, bz[1] - 14], [bz[0] + 28, 292])}
    ${head(250, 36, 'lettuce chloroplast', '≈ 5 µm')}
    ${c.svg}${swPill(700, 76, 'envelope', 'fl4a-sw-env', ce)}${swPill(330, 250, 'granum', 'fl4a-sw-gr', cg)}${swPill(470, 76, 'stroma lamella', 'fl4a-sw-lam', cl)}
    ${swPill(...c.at(1000, 470), 'plastoglobule', 'fl4a-sw-pg', c.at(866, 205))}${zboxP(cz[0], cz[1], 20, 20)}
    ${zar(p, [cz[0], cz[1] + 11], [cz[0], 312])}
    ${tag(280, 332, 'spinach', 'start')}${lab(358, 332, 'thylakoid membranes', 'start')}
    ${d.svg}${pill(520, 372, 'granum', dg)}${pill(352, 372, 'stroma lamella', dl)}${zboxP(dz[0], dz[1], 12, 12)}
    ${zar(p, [dz[0] + 7, dz[1]], [604, dz[1]])}
    ${text(780, 312, 'pigment–protein', 'sm fl4a-b', 'end')}${text(738, 336, 'complex', 'sm fl4a-b', 'end')}${tag(780, 336, 'pea', 'end')}
    ${e.svg}${key(624, 538, 20)}
    ${cred(780, 598, C_PDB, 'end')}
    ${tag(430, 562, 'different plants at each scale')}
  `);
}

/* ---------- q · the whole cell as the hero, with the chloroplast and one complex as insets ---------- */

function cellHeroSvg(): string {
  const p = 'f4aq';
  const a = photo(`${p}-a`, CELL3, 20, 126, 444, 388, { credit: ['Midorikawa et al. 2022, PNAS Nexus, CC BY 4.0'] });
  const ac = a.at(265, 226), ac2 = a.at(72, 133);
  const b = photo(`${p}-b`, CTEM, 480, 52, 300, 165, { credit: [`${C_STA}, adapted`] });
  const env = b.at(...TEMA.env), gra = b.at(...TEMA.gra), lam = b.at(...TEMA.lam), str = b.at(...TEMA.str), bz = b.at(...TEMA.zg);
  const e = photo(`${p}-e`, LTOP, 530, 288, 204, 200, { meet: true });
  return svg('One whole mesophyll cell in 3-D, lined with chloroplasts; one chloroplast in an electron micrograph, with envelope, grana, stroma lamellae and stroma; one pigment–protein complex rendered from its structure, with its protein, chlorophylls and carotenoids', `
    ${defs(p)}
    ${head(20, 110, 'mesophyll cell', '≈ 50 µm')}
    ${a.svg}${pill(118, 166, 'chloroplast', ac2)}${zboxP(ac[0], ac[1], 64, 58)}
    ${zar(p, [ac[0] + 34, ac[1] - 23], [474, 150])}
    ${head(480, 36, 'chloroplast', '≈ 5 µm')}
    ${b.svg}${pill(737, 74, 'envelope', env)}${pill(str[0], str[1] - 4, 'stroma')}${pill(528, 92, 'granum', gra)}${pill(566, 176, 'stroma lamella', lam)}
    ${zboxP(bz[0], bz[1], 12, 12)}${zar(p, [bz[0], bz[1] + 7], [bz[0], 254])}
    ${lab(480, 276, 'pigment–protein complex', 'start')}
    ${e.svg}
    ${tag(480, 514, '≈ 8 nm', 'start')}${key(592, 514, 22)}
    ${cred(780, 594, C_PDB, 'end')}
  `);
}

/* ---------- r · one big drawn chloroplast, the leaf at one end and one complex at the other ---------- */

function cpHeroSvg(): string {
  const p = 'f4ar';
  const b = photo(`${p}-b`, KDRAW, 140, 52, 540, 355, { meet: true });
  const K = (k: keyof typeof KDA): Pt => b.at(...KDA[k]);
  const bz = K('zg');
  const a = photo(`${p}-a`, LBLOCK, 20, 456, 136, 134, { meet: true });
  const az = a.at(385, 540);
  const e = photo(`${p}-e`, LTOP, 606, 430, 174, 171, { meet: true });
  const T = (k: keyof typeof TOPA): Pt => e.at(...TOPA[k]);
  return svg('One drawn chloroplast cut open, as large as the page allows: its envelope, grana joined by stroma lamellae, the stroma around them, a thylakoid membrane; the leaf it comes from at one end and one pigment–protein complex at the other', `
    ${defs(p)}
    ${head(20, 40, 'chloroplast', '≈ 5 µm')}${cred(20, 64, 'Kelvinsong, CC0')}
    ${b.svg}
    ${pill(186, 142, 'envelope', K('env'))}${pill(232, 282, 'granum', K('gra'))}${pill(400, 78, 'stroma lamella', K('lamT'))}${pill(K('str')[0], K('str')[1], 'stroma')}
    ${lt(780, 40, 'thylakoid membrane', 'end', K('mem'), [690, 46])}
    ${a.svg}${zboxP(az[0], az[1], 10, 12)}
    ${zar(p, [az[0] + 6, az[1] - 7], [170, 400])}
    ${lab(170, 512, 'leaf', 'start')}${cred(170, 536, 'Zephyris, CC BY-SA 3.0, adapted')}
    ${zboxP(bz[0], bz[1], 18, 18)}${zar(p, [bz[0] + 5, bz[1] + 10], [620, 436])}
    ${text(592, 444, 'pigment–protein complex', 'sm fl4a-b', 'end')}${tag(592, 468, '≈ 8 nm', 'end')}
    ${e.svg}
    ${lt(592, 498, 'chlorophyll', 'end', T('chlL'))}${lt(592, 532, 'protein', 'end', T('protL'))}${lt(592, 566, 'carotenoid', 'end', T('carL'))}
    ${cred(592, 594, C_PDB, 'end')}
  `);
}

/* ---------- s · the electron micrograph above the drawing, each part labelled once with a leader to both ---------- */

function seenDrawnSvg(): string {
  const p = 'f4as';
  const a = photo(`${p}-a`, CTEM, 220, 30, 520, 285, { line: true });
  const b = photo(`${p}-b`, KDRAW, 290, 352, 380, 248, { meet: true });
  const A = { gra: a.at(...TEMA.gra), lam: a.at(...TEMA.lam), str: a.at(...TEMA.str), env: a.at(...TEMA.env) };
  const B = { gra: b.at(...KDA.graT), lam: b.at(...KDA.lamT), str: b.at(900, 480), env: b.at(...KDA.envR) };
  const two = (x: number, s: string, k: keyof typeof A): string =>
    text(x, 342, s, 'sm fl4a-b') + pleader([x, 323], A[k]) + pleader([x, 350], B[k]);
  return svg('The same chloroplast parts in an electron micrograph and in a drawing, each labelled once with a leader to both: envelope, granum, stroma lamella, stroma', `
    ${defs(p)}
    ${head(20, 52, 'chloroplast')}${tag(20, 78, '≈ 5 µm', 'start')}
    ${tag(20, 150, 'electron', 'start')}${tag(20, 174, 'micrograph', 'start')}
    ${cred(20, 204, 'Staehelin & Paolillo 2020,')}${cred(20, 221, 'CC BY 4.0, adapted')}
    ${tag(20, 470, 'drawing', 'start')}${cred(20, 498, 'Kelvinsong, CC0')}
    ${a.svg}${b.svg}
    ${two(250, 'granum', 'gra')}${two(400, 'stroma lamella', 'lam')}${two(560, 'stroma', 'str')}${two(700, 'envelope', 'env')}
  `);
}

/* ---------- t · one cryo-ET field and its 3-D model, our labels; one complex below ---------- */

function cryoPairSvg(): string {
  const p = 'f4at';
  const H = 330, wa = (H * TOMO.w) / TOMO.h, wb = (H * SEGC.w) / SEGC.h;
  const a = photo(`${p}-a`, TOMO, 20, 52, wa, H, { credit: [WIE], top: true });
  const ag = a.at(700, 330), al = a.at(326, 770);
  const b = photo(`${p}-b`, SEGC, 780 - wb, 52, wb, H, { credit: [`${WIE}, adapted`] });
  const env = b.at(92, 300), gra = b.at(568, 242), lam = b.at(375, 780), str = b.at(930, 700), bz = b.at(528, 543);
  const e = photo(`${p}-e`, LTOP, 340, 404, 196, 192, { meet: true });
  const T = (k: keyof typeof TOPA): Pt => e.at(...TOPA[k]);
  const pa = (u: number, v: number, s: string, to: Pt): string => { const q = b.at(u, v); return pill(q[0], q[1], s, to); };
  return svg('One chloroplast region seen twice: a cryo-electron tomogram slice, with a granum and a stroma lamella, and its 3-D model, labelled envelope, granum, stroma lamella and stroma; below, one pigment–protein complex rendered from its structure', `
    ${defs(p)}
    ${head(20, 36, 'chloroplast', 'cryo-electron tomogram')}${tag(780 - wb, 36, 'its 3-D model', 'start')}
    ${a.svg}${b.svg}
    ${pill(ag[0] + 6, 116, 'granum', ag)}${pill2(84, 206, ['stroma', 'lamella'], al)}
    ${pa(200, 150, 'envelope', env)}${pill(gra[0] + 40, 112, 'granum', gra)}${pa(180, 600, 'stroma lamella', lam)}${pill(str[0], str[1], 'stroma')}
    ${zboxP(bz[0], bz[1], 14, 14)}${zar(p, [bz[0] - 4, bz[1] + 8], [500, 418])}
    ${head(20, 440, 'pigment–protein')}${lab(20, 464, 'complex', 'start')}${tag(20, 490, '≈ 8 nm', 'start')}
    ${cred(20, 520, C_PDB)}
    ${e.svg}
    ${lt(560, 456, 'chlorophyll', 'start', T('chlR'))}${lt(560, 512, 'protein', 'start', T('protR'))}${lt(560, 568, 'carotenoid', 'start', T('carR'))}
  `);
}

/* ---------- u · living cells: a live moss leaf, then the chloroplast, the grana and one complex ---------- */

function livingSvg(): string {
  const p = 'f4au';
  const a = photo(`${p}-a`, BRY, 20, 52, 440, 538, { ax: 0.4, credit: ['Des Callaghan, CC BY-SA 4.0'] });
  const ac = a.at(395, 354);
  const b = photo(`${p}-b`, CTEM, 480, 52, 300, 165, { credit: [C_STA] });
  const env = b.at(...TEMA.env), str = b.at(...TEMA.str), bz = b.at(1180, 500);
  const c = photo(`${p}-c`, GTEM, 480, 254, 300, 113, { credit: [C_STA] });
  const cg = c.at(200, 230), cl = c.at(560, 200), cz = c.at(1335, 260);
  const e = photo(`${p}-e`, LTOP, 604, 424, 164, 161, { meet: true });
  return svg('Living moss leaf cells under the light microscope, packed with green chloroplasts; one chloroplast in an electron micrograph, with envelope and stroma; its grana and stroma lamellae; one pigment–protein complex rendered from its structure', `
    ${defs(p)}
    ${head(20, 36, 'moss leaf cells', 'alive, light microscope')}
    ${a.svg}${pill(ac[0], ac[1] - 56, 'chloroplast', [ac[0], ac[1] - 23])}<circle class="fl4a-zbh" cx="${f(ac[0])}" cy="${f(ac[1])}" r="21"/><circle class="fl4a-zb" cx="${f(ac[0])}" cy="${f(ac[1])}" r="21"/>
    ${zar(p, [ac[0] + 23, ac[1] - 6], [474, 150])}
    ${head(480, 36, 'chloroplast', '≈ 5 µm')}
    ${b.svg}${pill(737, 74, 'envelope', env)}${pill(str[0], str[1] - 4, 'stroma')}${zboxP(bz[0], bz[1], 12, 12)}
    ${tag(480, 244, 'granum 0.3–0.6 µm across', 'start')}
    ${zar(p, [bz[0], bz[1] + 7], [bz[0], 250])}
    ${c.svg}${pill(540, 278, 'granum', cg)}${pill(680, 278, 'stroma lamella', cl)}${zboxP(cz[0], cz[1], 12, 12)}
    ${zar(p, [cz[0], cz[1] + 7], [cz[0], 430])}
    ${lab(480, 398, 'pigment–protein complex', 'start')}
    ${key(480, 470, 26)}
    ${e.svg}
    ${cred(780, 597, C_PDB, 'end')}
  `);
}

/* ---------- v · the membrane close up: one complex side-on in the thylakoid membrane, drawn to the same scale ---------- */

function membraneSvg(): string {
  const p = 'f4av';
  const W = 430, k = W / LSIDE.w, X0 = 186, coreT = 262;
  const Y0 = coreT - MEM_T * k, coreB = coreT + (MEM_B - MEM_T) * k, hd = 100 * k * 0.95;   // 1 nm = 100 render px
  const top = coreT - hd, bot = coreB + hd, mid = (coreT + coreB) / 2;
  const e = photo(`${p}-e`, LSIDE, X0, Y0, W, LSIDE.h * k, { meet: true });
  const S = (key: keyof typeof SIDEA): Pt => e.at(...SIDEA[key]);
  // lipids at the same scale: heads ≈ 0.7 nm across, two tails each, packed every ≈ 0.8 nm, both leaflets, beside the complex
  const r = 0.36 * 100 * k, step = 0.8 * 100 * k;
  const lip: string[] = [];
  for (let x = 20 + step / 2; x < 790; x += step) {
    if (x > X0 + 6 && x < X0 + W - 6) continue;
    for (const [hy, ty] of [[top + r + 2, mid - 3], [bot - r - 2, mid + 3]] as Array<[number, number]>) {
      lip.push(`<path class="fl4a-ltail" d="M${f(x - r * 0.38)},${f(hy)}V${f(ty)}M${f(x + r * 0.38)},${f(hy)}V${f(ty)}"/>`, `<circle class="fl4a-lhead" cx="${f(x)}" cy="${f(hy)}" r="${f(r)}"/>`);
    }
  }
  const th = photo(`${p}-t`, KDRAW, 600, 22, 180, 118, { meet: true });
  const tz = th.at(...KDA.zg);
  const c1 = S('m1'), c2 = S('m2'), mc: Pt = [(c1[0] + c2[0]) / 2, (c1[1] + c2[1]) / 2];
  return svg('The thylakoid membrane close up: one pigment–protein complex side-on in the membrane, both to the same scale; stroma above; the protein holds chlorophylls, about 1 nm apart, and carotenoids; the membrane is about 5 nm thick', `
    ${defs(p)}
    <rect class="fl4a-mband" x="14" y="${f(top)}" width="776" height="${f(bot - top)}"/>
    ${lip.join('')}
    ${e.svg}
    ${head(20, 40, 'pigment–protein complex', '≈ 8 nm')}
    ${note(70, top - 22, 'stroma')}
    ${th.svg}${zboxP(tz[0], tz[1], 10, 10)}${tag(588, 52, 'chloroplast', 'end')}
    ${zar(p, [tz[0] - 4, tz[1] + 6], [640, top - 8])}
    ${cred(780, 156, 'Kelvinsong, CC0', 'end')}
    ${lt(300, 132, 'protein', 'middle', S('protL'))}
    ${lt(150, 132, 'carotenoid', 'middle', S('carL'))}
    ${lt(250, 540, 'chlorophyll', 'middle', S('chlL'))}
    ${nm(c1, c2, [mc[0] - 4, mc[1] - 30])}
    <path class="fl4a-brk" d="M774,${f(top)}H786V${f(bot)}H774"/>
    ${text(786, bot + 34, 'thylakoid membrane', 'sm fl4a-b', 'end')}${tag(786, bot + 58, '≈ 5 nm thick', 'end')}
    ${cred(20, 590, C_PDB)}
  `);
}

/* ---------- w · a size ladder of real images: one log axis from 10 cm down to 1 nm ---------- */

function realLadderSvg(): string {
  const p = 'f4aw';
  const y = (m: number): number => 50 + (-1 - Math.log10(m)) * 62;
  const ax = 96, ix = 116, nx = 232;
  const ticks = ['10 cm', '1 cm', '1 mm', '100 µm', '10 µm', '1 µm', '100 nm', '10 nm', '1 nm'];
  const row = (id: string, m: number, im: Img, w: number, h: number, o: { ax?: number; meet?: boolean; line?: boolean }, name: string, size: string, credit: string): string => {
    const yy = y(m), ph = photo(`${p}-${id}`, im, ix, yy - h / 2, w, h, o);
    return `<path class="fl4a-stem" d="M${ax},${f(yy)}H${ix - 6}"/>${ph.svg}${text(nx, yy + 2, name, 'sm fl4a-b', 'start')}${cred(nx, yy + 22, credit)}${tag(780, yy + 8, size, 'end')}`;
  };
  return svg('A size ladder of real images on one logarithmic axis from 10 cm to 1 nm: a leaf ≈ 5 cm, a mesophyll cell ≈ 50 µm, a chloroplast ≈ 5 µm, a granum 0.3–0.6 µm, a pigment–protein complex ≈ 8 nm, a chlorophyll ≈ 1 nm', `
    ${defs(p)}
    <path class="fl4a-axis" d="M${ax},${f(y(0.1))}V${f(y(1e-9))}"/>
    ${ticks.map((s, i) => `<path class="fl4a-axis" d="M${ax - 7},${f(50 + i * 62)}H${ax}"/>${text(ax - 13, 50 + i * 62 + 6, s, 'fl4a-tick', 'end')}`).join('')}
    ${text(ax, 26, 'size (log scale)', 'fl4a-tick', 'middle')}
    ${row('a', 0.05, LEAFP, 96, 70, { line: true }, 'leaf', '≈ 5 cm', 'W.carter, CC BY-SA 4.0')}
    ${row('b', 5e-5, CELL3, 96, 58, { meet: true }, 'mesophyll cell', '≈ 50 µm', 'Midorikawa et al. 2022, CC BY 4.0')}
    ${row('c', 5e-6, CTEM, 96, 53, { line: true }, 'chloroplast', '≈ 5 µm', `${C_STA}, adapted`)}
    ${row('d', 4.5e-7, GTEM, 96, 56, { ax: 0, line: true }, 'granum', '0.3–0.6 µm across', C_STA)}
    ${row('e', 8e-9, LTOP, 96, 58, { meet: true }, 'pigment–protein complex', '≈ 8 nm', C_PDB)}
    ${row('f', 1e-9, CHL, 96, 56, { meet: true }, 'chlorophyll', '≈ 1 nm', C_PDB)}
  `);
}

/* ---------- r1–r5 · dim-light adaptation: real micrographs, photo and history mixed with drawings ----------
 * Real images (credits on the figures; sources and crops in assets/SOURCES.md):
 * - anim/leaf/tem-shade.jpg, tem-sun.jpg: Shao et al. 2014, PLoS One 9: e85996, Fig. 6 k (5 % light) and b (50 % light),
 *   CC BY 4.0; the same 2.9 µm × 2.6 µm field from each, toned to ink on paper (scripts/leaf_anim_assets.py).
 * - anim/leaf/senn.png: Gustav Senn, Photopress AG, 1915–1935, Universitätsbibliothek Basel (no licence stated), halftone.
 * - anim/leaf/senn-1895.jpg: G. Senn 1895, in Honegger 2022, Bauhinia 28: 63, Abb. 3a, CC BY 4.0.
 * - photos/alocasia-shade.jpg: John Robert McPherson 2013, Wikimedia Commons, CC BY-SA 4.0 (scripts/fig5_assets.py).
 * Drawn to scale: the cell 30 µm × 34 µm with eight chloroplasts of 5 µm × 2 µm, in dim light on the walls facing the
 * light, in bright light on the side walls (Wada 2016, Fig. 1A); the chloroplast in r4 5 µm × 2.2 µm, grana 0.35–0.6 µm
 * across with a thylakoid repeat of 17.5 nm, 12–42 thylakoids per granum in a shade leaf (after Anderson 1986, as in the
 * animation), and the sun and deep-shade grana of its key with 7 and 100 thylakoids, at the same scale. */

const TSH: Img = { href: temShade, w: 520, h: 466 };
const TSU: Img = { href: temSun, w: 520, h: 466 };
const ALO: Img = { href: alocasia, w: 600, h: 850 };
/** Both micrographs show 2.9 µm across 520 px. */
const TEM_PX = 520 / 2.9;
const C_SHAO = 'Shao et al. 2014, CC BY 4.0';
/** Anchors in the micrographs, in their pixels, each checked at 4–5× zoom. Shade (5 % light): a granum complete in the field
 *  (gu, and its outline traced at a fixed grey level), a second granum (gm), stroma between the envelope and the grana, and
 *  the light band between two grana (lam0 → lam1, along the striation of its membranes, 60° from the horizontal). Sun
 *  (50 % light): a granum cut side-on (g0 → g1, the ends of its axis; ≈ 19 px = 0.1 µm thick), stroma, and one stroma
 *  lamella (its course traced point by point). */
const SHA = { gu: [160, 145], gm: [272, 335], str: [62, 212], lam0: [286, 246], lam1: [331, 170] } satisfies Record<string, Pt>;
const SHA_GU: Pt[] = [[152, 72], [131, 82], [102, 118], [97, 143], [101, 172], [120, 193], [155, 213], [183, 211], [203, 219], [211, 213], [223, 191], [220, 161], [206, 115], [185, 95], [163, 80]];
const SUA = { g0: [358, 177], g1: [417, 117], str: [240, 215], lam: [460, 55] } satisfies Record<string, Pt>;
const SUA_LAM: Pt[] = [[436, 84], [446, 68], [460, 55], [478, 46], [500, 38], [516, 33]];

/** Senn as a clipping: name and year only (the page text says what he found). */
const SENN_SLIDE: Clip = { name: 'Gustav Senn', year: '1908', finding: '', key: '', photo: senn, alt: senn };

/** Amber light arrowheads: small for dim light, larger for bright. */
const lightDefs = (p: string): string => `<defs>
  <marker id="${p}-hd" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto"><path class="fl4a-lhd" d="M0,0L10,5L0,10z"/></marker>
  <marker id="${p}-hb" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto"><path class="fl4a-lhd" d="M0,0L10,5L0,10z"/></marker></defs>`;

/** One chloroplast in the cell, 5 µm × 2 µm, k px per µm, its grana as dashes; rot in degrees. */
function cpCell(x: number, y: number, k: number, rot: number): string {
  const u = (v: number): string => f(v * k);
  const lens = `M${u(-2.5)},0Q${u(-2.25)},${u(-1.04)} 0,${u(-1.04)}Q${u(2.25)},${u(-1.04)} ${u(2.5)},0Q${u(2.25)},${u(1.04)} 0,${u(1.04)}Q${u(-2.25)},${u(1.04)} ${u(-2.5)},0Z`;
  const gr = ([[-1.58, -0.29, 0.5], [-0.67, 0.25, 0.5], [0.25, -0.25, 0.5], [1.17, 0.21, 0.42]] as const).map(([a, b, l]) => `M${u(a)},${u(b)}h${u(l)}`).join('');
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path class="fl4a-rcp" d="${lens}"/><path class="fl4a-rcpg" d="${gr}" style="stroke-width:${f(Math.max(0.9, 0.25 * k))}"/></g>`;
}

/** A mesophyll cell cut across, 30 µm × 34 µm at k px per µm, centred at (cx, cy), with eight chloroplasts: in dim light on
 *  the walls that face the light (top and bottom), in bright light on the side walls. Light arrows from above, ending
 *  `gap` px over the wall: three thin ones in dim light, seven bold ones in bright light. Returns the chloroplast centres. */
function lightCell(p: string, cx: number, cy: number, k: number, bright: boolean, o: { arrow?: number; gap?: number } = {}): { svg: string; cps: Pt[] } {
  const W = 30 * k, H = 34 * k, x0 = cx - W / 2, y0 = cy - H / 2, wall = 0.7 * k, ins = 1.65 * k;
  const r = rng(bright ? 5 : 9), cps: Pt[] = [], out: string[] = [];
  for (let i = 0; i < 4; i++) {
    const t = (i - 1.5) * (bright ? 7.2 : 6.3) * k, j = (r() - 0.5) * 0.5 * k, rot = (r() - 0.5) * 7;
    const pts: Array<[number, number, number]> = bright
      ? [[x0 + ins, cy + t + j, 90 + rot], [x0 + W - ins, cy + t - j, 90 - rot]]
      : [[cx + t + j, y0 + ins, rot], [cx + t - j, y0 + H - ins, -rot]];
    for (const [x, y, a] of pts) { out.push(cpCell(x, y, k, a)); cps.push([x, y]); }
  }
  const al = o.arrow ?? Math.max(24, 7 * k), gap = o.gap ?? 6, xs = bright ? [-0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42] : [-0.3, 0, 0.3];
  const sw = bright ? Math.min(4.2, 0.95 * k) : Math.min(2.2, 0.5 * k);
  const arr = xs.map(d => `<path class="fl4a-larr ${bright ? 'fl4a-larr-b' : 'fl4a-larr-d'}" d="M${f(cx + d * W)},${f(y0 - gap - al)}V${f(y0 - gap - (bright ? 7 : 5))}" style="stroke-width:${f(sw)}" marker-end="url(#${p}-${bright ? 'hb' : 'hd'})"/>`).join('');
  return {
    svg: `${arr}<rect class="fl4a-rwall" x="${f(x0)}" y="${f(y0)}" width="${f(W)}" height="${f(H)}" rx="${f(3.2 * k)}" style="stroke-width:${f(wall)}"/>`
      + `<rect class="fl4a-rpm" x="${f(x0 + 0.75 * k)}" y="${f(y0 + 0.75 * k)}" width="${f(W - 1.5 * k)}" height="${f(H - 1.5 * k)}" rx="${f(2.5 * k)}"/>${out.join('')}`,
    cps,
  };
}

/** A smooth path through points (Catmull–Rom as cubic Béziers), closed or open. */
function smooth(pts: Pt[], closed: boolean): string {
  const n = pts.length, P = (i: number): Pt => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
/** Points moved d px away from their centroid, so an outline sits just outside what it traces. */
function grow(pts: Pt[], d: number): Pt[] {
  const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
  return pts.map(([x, y]) => { const l = Math.hypot(x - cx, y - cy) || 1; return [x + ((x - cx) / l) * d, y + ((y - cy) / l) * d]; });
}
/** A capsule around the segment a–b, hw px from its axis. */
function capsule(a: Pt, b: Pt, hw: number): string {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = (-(b[1] - a[1]) / l) * hw, ny = ((b[0] - a[0]) / l) * hw;
  return `M${f(a[0] + nx)},${f(a[1] + ny)}L${f(b[0] + nx)},${f(b[1] + ny)}A${f(hw)},${f(hw)} 0 0 0 ${f(b[0] - nx)},${f(b[1] - ny)}L${f(a[0] - nx)},${f(a[1] - ny)}A${f(hw)},${f(hw)} 0 0 0 ${f(a[0] + nx)},${f(a[1] + ny)}Z`;
}
/** An outline drawn over a micrograph: clay in a light halo; dashed for a granum, solid for a lamella. */
const ovl = (d: string, dashed: boolean): string => `<path class="fl4a-ovh" d="${d}"/><path class="fl4a-ov${dashed ? ' fl4a-ovd' : ''}" d="${d}"/>`;

/** A scale bar on a micrograph, its left end at (x, y): a black bar len px long in a white pill, with its length. */
function sbar(x: number, y: number, len: number, s: string): string {
  const w = len + s.length * 8.4 + 32;
  return `<rect class="fl4a-pillbg" x="${f(x)}" y="${f(y - 12)}" width="${f(w)}" height="24" rx="12"/><rect class="fl4a-sbar" x="${f(x + 11)}" y="${f(y - 2)}" width="${f(len)}" height="4"/>`
    + text(+f(x + len + 19), +f(y + 5), s, 'fl4a-sbt', 'start');
}
/** A micrograph pair member: the photo, never stretched, and its own 0.5 µm bar at the lower left. */
function tem(id: string, im: Img, x: number, y: number, w: number, h: number, o: { ax?: number; ay?: number } = {}): Photo & { bar: string; s: number } {
  const ph = photo(id, im, x, y, w, h, { ...o, line: true });
  const s = ph.at(1, 0)[0] - ph.at(0, 0)[0];
  return { ...ph, s, bar: sbar(x + 10, y + h - 20, 0.5 * TEM_PX * s, '0.5 µm') };
}

/** A clipping of Senn's 1895 drawing: newsprint with a scissor-cut edge, w wide, top left at (x, y), tilted rot°. */
function sennDrawing(p: string, x: number, y: number, w: number, rot: number): { svg: string; h: number } {
  const m = w * 0.05, iw = w - 2 * m, ih = (iw * 475) / 739, h = ih + 2 * m, r = rng(23), pts: Pt[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number): void => {
    const n = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 15)), l = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / l, ny = (bx - ax) / l;
    for (let i = 0; i < n; i++) { const t = i / n, q = (r() - 0.5) * 3.4; pts.push([ax + (bx - ax) * t + nx * q, ay + (by - ay) * t + ny * q]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return {
    h,
    svg: `<g transform="rotate(${rot} ${f(x + w / 2)} ${f(y + h / 2)})"><defs><filter id="${p}-dsh" x="-15%" y="-15%" width="130%" height="135%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
      <path class="clip-paper" d="M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}Z" filter="url(#${p}-dsh)"/>
      <image href="${senn1895}" x="${f(x + m)}" y="${f(y + m)}" width="${f(iw)}" height="${f(ih)}"/></g>`,
  };
}


/** A pill placed at image pixel q of photo `ph`, with a leader to image pixel `to` (or a figure point). */
const pillAt = (ph: Photo, q: Pt, s: string, to: Pt): string => { const c = ph.at(...q); return pill(c[0], c[1], s, to); };
/** The middle of the sun granum's axis, moved d px across it (positive: to its lower right). */
const sunGr = (d = 0): Pt => {
  const [x0, y0] = SUA.g0, [x1, y1] = SUA.g1, l = Math.hypot(x1 - x0, y1 - y0);
  return [(x0 + x1) / 2 + (-(y1 - y0) / l) * d, (y0 + y1) / 2 + ((x1 - x0) / l) * d];
};

/** A row label at the left edge: bold lines, then grey ones, the block centred on yc. */
function rowLab(yc: number, bold: string[], grey: string[], x = 20): string {
  const n = bold.length + grey.length, y0 = yc - ((n - 1) * 25) / 2 + 7;
  return [...bold.map((s, i) => lab(x, y0 + i * 25, s, 'start')), ...grey.map((s, i) => tag(x, y0 + (bold.length + i) * 25, s, 'start'))].join('');
}
/** A column label over a micrograph, centred at x: what it is (bold), then its light (grey). */
const colLab = (x: number, y: number, s: string, g: string): string => lab(x, y, s) + tag(x, y + 23, g);
/** A thin rule between two rows that show different things. */
const rule = (y: number): string => `<path class="fl4a-rule" d="M20,${y}H780"/>`;

/* ---------- r1 · shade vs sun side by side: drawn cells above, the real grana below ---------- */

function shadeSunSvg(): string {
  const p = 'f4ar1';
  const cL = 327, cR = 623, k = 3.8, top = 64, cy = top + 17 * k;
  const dim = lightCell(p, cL, cy, k, false, { arrow: 22 }), bri = lightCell(p, cR, cy, k, true, { arrow: 22 });
  const TW = 256, TH = (TW * TSH.h) / TSH.w, TY = 270;
  const a = tem(`${p}-a`, TSH, cL - TW / 2, TY, TW, TH), b = tem(`${p}-b`, TSU, cR - TW / 2, TY, TW, TH);
  const ny = TY + TH + 53;
  return svg('Two kinds of response to light, one per row. Top row, chloroplast positions within minutes: a drawn mesophyll cell in dim light, its chloroplasts on the walls facing the light, and one in bright light, its chloroplasts on the side walls. Middle row, grana in leaves grown for weeks: electron micrographs of a shade orchid grown in shade, at 5 % of sunlight, with tall grana, and in brighter light, at 50 % of sunlight, with thin grana; stroma and a stroma lamella labelled. Bottom row, thylakoids per granum: up to about 100 in deep shade, fewer than 10 in sun leaves', `
    ${lightDefs(p)}
    ${rowLab(cy, ['chloroplast', 'positions'], ['within minutes'])}
    ${lab(cL, 26, 'dim light')}${lab(cR, 26, 'bright light')}
    ${dim.svg}${bri.svg}
    ${rule(208)}
    ${rowLab(TY + TH / 2, ['grana'], ['leaves grown', 'for weeks in…'])}
    ${colLab(cL, TY - 36, 'shade', '5 % of sunlight')}${colLab(cR, TY - 36, 'brighter light', '50 % of sunlight')}
    ${a.svg}${b.svg}
    ${pillAt(a, [92, 26], 'stroma', a.at(...SHA.str))}${pillAt(a, [404, 414], 'granum', a.at(...SHA.gm))}
    ${pillAt(b, [300, 26], 'stroma lamella', b.at(...SUA.lam))}${pillAt(b, [262, 300], 'granum', b.at(...sunGr(-6)))}
    ${a.bar}${b.bar}
    ${cred(cR + TW / 2, TY + TH + 18, C_SHAO, 'end')}
    ${rowLab(ny + 2, ['thylakoids', 'per granum'], [])}
    ${text(cL, ny, 'up to ≈ 100', 'fl4a-num')}${tag(cL, ny + 24, 'deep shade')}
    ${text(cR, ny, '&lt; 10', 'fl4a-num')}${tag(cR, ny + 24, 'sun leaves')}
  `);
}

/* ---------- r2 · photo to membrane: a shade plant, a cell in dim light, its grana; three equal panels ---------- */

function photoMembraneSvg(): string {
  const p = 'f4ar2';
  const W = 232, G = 32, X = [20, 20 + W + G, 20 + 2 * (W + G)], Y = 118, H = 432;
  const a = photo(`${p}-a`, ALO, X[0], Y, W, H, { line: true });
  const cc = X[1] + W / 2, k = 6, cy = Y + H / 2 - 6;
  const cell = lightCell(p, cc, cy, k, false, { arrow: 44, gap: 10 });
  const c = tem(`${p}-c`, TSH, X[2], Y, W, H, { ax: 0.1 });
  const cp = cell.cps[3];
  return svg('Three equal panels: giant taro, a shade plant, on a dim rainforest floor; a drawn mesophyll cell in dim light, its chloroplasts moved within minutes to the walls facing the light; an electron micrograph of a chloroplast in a leaf grown for weeks in shade, at 5 % of sunlight, with tall grana and the stroma around them', `
    ${lightDefs(p)}
    ${head(X[0], 50, 'shade plant')}${text(X[0], 76, '<tspan font-style="italic">Alocasia</tspan>', 'fl4a-size', 'start')}${tag(X[0], 100, 'rainforest floor', 'start')}
    ${head(X[1], 50, 'mesophyll cell')}${tag(X[1], 76, 'in dim light', 'start')}${tag(X[1], 100, 'within minutes', 'start')}
    ${head(X[2], 50, 'chloroplast')}${tag(X[2], 76, 'shade-grown for weeks', 'start')}${tag(X[2], 100, '5 % of sunlight', 'start')}
    ${a.svg}
    ${panel(X[1], Y, X[1] + W, Y + H)}${cell.svg}
    ${text(cc, Y + H - 22, 'chloroplast', 'sm fl4a-b')}${leader([cc + 4, Y + H - 44], [cp[0] + 3, cp[1] + 7])}
    ${c.svg}
    ${pillAt(c, [215, 26], 'granum', c.at(...SHA.gu))}
    ${pill(...c.at(88, 234), 'stroma')}
    ${c.bar}
    ${cred(X[0], Y + H + 22, 'J. R. McPherson, CC BY-SA 4.0')}${cred(X[2] + W, Y + H + 22, C_SHAO, 'end')}
  `);
}

/* ---------- r3 · Senn's discovery: his portrait and drawing; dim and bright positions drawn; the grana pair ---------- */

function sennSvg(): string {
  const p = 'f4ar3';
  // row 1 (minutes): its label, Senn's clipping under it, his drawing, the two cells; row 2 (weeks): the two micrographs
  const PW = 112, PX = 26, PY = 94;
  const DX = 180, DY = 104, DW = 226, dr = sennDrawing(p, DX, DY, DW, 1.5);
  const cL = 524, cR = 688, k = 4, top = 140, cy = top + 17 * k;
  const dim = lightCell(p, cL, cy, k, false, { arrow: 22 }), bri = lightCell(p, cR, cy, k, true, { arrow: 22 });
  const TW = 290, TH = 198, TY = 374, tL = 310, tR = 635, ry = 340;
  const a = tem(`${p}-a`, TSH, tL - TW / 2, TY, TW, TH, { ay: 0.1 }), b = tem(`${p}-b`, TSU, tR - TW / 2, TY, TW, TH, { ay: 0.1 });
  return svg('Two kinds of response to light, one per row. Top row, chloroplast positions within minutes: Gustav Senn, as a newspaper clipping, and his own 1895 drawing of chloroplasts moving along the walls of leaf cells; beside them, a drawn mesophyll cell in dim light, its chloroplasts on the walls facing the light, and one in bright light, its chloroplasts on the side walls. Bottom row, grana in leaves grown for weeks: electron micrographs of grana in leaves grown in shade, at 5 % of sunlight, and in brighter light, at 50 % of sunlight', `
    ${lightDefs(p)}
    ${rowLab(24 + 25, ['chloroplast', 'positions'], ['within minutes'])}
    ${clipping(`${p}-s`, PX, PY, PW, SENN_SLIDE, -2, 13)}
    ${dr.svg}
    ${cred(PX + PW / 2, PY + PW * 1.52 + 18, 'Photopress AG,', 'middle')}${cred(PX + PW / 2, PY + PW * 1.52 + 33, 'UB Basel', 'middle')}
    ${cred(DX + DW / 2, DY + dr.h + 22, 'G. Senn 1895, CC BY 4.0', 'middle')}
    ${lab(cL, 104, 'dim light')}${lab(cR, 104, 'bright light')}
    ${dim.svg}${bri.svg}
    ${rule(310)}
    ${rowLab(ry + 25, ['grana'], ['leaves grown', 'for weeks in…'])}
    ${colLab(tL, ry, 'shade', '5 % of sunlight')}${colLab(tR, ry, 'brighter light', '50 % of sunlight')}
    ${a.svg}${b.svg}
    ${pillAt(a, [150, 50], 'granum', a.at(...SHA.gu))}${pillAt(b, [290, 255], 'granum', b.at(...sunGr(6)))}
    ${a.bar}${b.bar}
    ${cred(tR + TW / 2, TY + TH + 19, C_SHAO, 'end')}
  `);
}

/* ---------- r4 · one chloroplast drawn to scale, the real grana beside it, and a key: thylakoids per granum ---------- */

interface Gr { x: number; y: number; w: number; n: number }
const REP = 0.0175; // thylakoid repeat in a granum, µm
const CPA = 2.5, CPB = 1.1; // the chloroplast's half length and half thickness, µm
/** A shade chloroplast's grana (µm from its centre), as drawn in the animation after Anderson 1986. */
const SHADE_GR: Gr[] = [
  { x: -1.62, y: -0.4, w: 0.52, n: 26 }, { x: -0.54, y: -0.4, w: 0.6, n: 40 }, { x: 0.54, y: -0.4, w: 0.58, n: 36 }, { x: 1.62, y: -0.4, w: 0.5, n: 26 },
  { x: -1.08, y: 0.4, w: 0.58, n: 38 }, { x: 0, y: 0.4, w: 0.6, n: 42 }, { x: 1.08, y: 0.4, w: 0.56, n: 34 },
  { x: -2.12, y: 0, w: 0.38, n: 14 }, { x: 2.12, y: 0.02, w: 0.36, n: 12 },
];
/** A granum side-on, n thylakoids at REP, w µm wide, its centre at (x, y), k px per µm. */
function stack(x: number, y: number, w: number, n: number, k: number): string {
  const h = n * REP * k, x0 = x - (w * k) / 2, y0 = y - h / 2, ww = w * k;
  let lines = '';
  for (let i = 1; i < n; i++) lines += `M${f(x0 + 1.2)},${f(y0 + (i * h) / n)}h${f(ww - 2.4)}`;
  return `<rect class="fl4a-rgr" x="${f(x0)}" y="${f(y0)}" width="${f(ww)}" height="${f(h)}" rx="${f(Math.min(2.5, h / 2))}"/><path class="fl4a-rgrl" d="${lines}"/>`;
}
/** A shade chloroplast cut along its length at (cx, cy), k px per µm: envelope (two membranes), stroma, grana, lamellae.
 *  `lam` is the middle of one lamella (from the lower right granum to the right end one), for a label. */
function shadeCp(cx: number, cy: number, k: number): { svg: string; X: (u: number) => number; Y: (v: number) => number; lam: Pt } {
  const X = (u: number): number => cx + u * k, Y = (v: number): number => cy + v * k;
  const up = SHADE_GR.slice(0, 4), lo = SHADE_GR.slice(4, 7), ends = SHADE_GR.slice(7);
  let lam = '', mid: Pt = [0, 0];
  const link = (g: Gr, h: Gr, fromLow: boolean, dy: number): void => {
    const sx = g.x < h.x ? 1 : -1, ya = g.y + (fromLow ? 1 : -1) * ((g.n * REP) / 2 - dy), yb = h.y + (fromLow ? -1 : 1) * ((h.n * REP) / 2 - dy);
    const xa = g.x + (sx * g.w) / 2, xb = h.x - (sx * h.w) / 2, xm = (xa + xb) / 2;
    lam += `M${f(X(xa))},${f(Y(ya))}C${f(X(xm))},${f(Y(ya))} ${f(X(xm))},${f(Y(yb))} ${f(X(xb))},${f(Y(yb))}`;
    if (g === lo[2] && h === ends[1]) mid = [X(xm), Y((ya + yb) / 2)];
  };
  up.forEach(g => lo.forEach(h => { if (Math.abs(g.x - h.x) < 0.6) { link(g, h, true, 0.06); link(g, h, true, 0.16); } }));
  link(ends[0], up[0], false, 0.03); link(ends[0], lo[0], false, 0.03); link(up[3], ends[1], true, 0.05); link(lo[2], ends[1], true, 0.05);
  lo.forEach((g, i) => { if (i < 2) link(g, lo[i + 1], true, 0.12); });
  up.forEach((g, i) => { if (i < 3) link(g, up[i + 1], true, 0.2); });
  const gap = Math.max(2.5, 0.03 * k);
  return {
    svg: `<ellipse class="fl4a-renv" cx="${f(cx)}" cy="${f(cy)}" rx="${f(CPA * k)}" ry="${f(CPB * k)}"/>
      <ellipse class="fl4a-renv2" cx="${f(cx)}" cy="${f(cy)}" rx="${f(CPA * k - gap)}" ry="${f(CPB * k - gap)}"/>
      <path class="fl4a-rlam" d="${lam}" style="stroke-width:${f(0.016 * k)}"/>${SHADE_GR.map(g => stack(X(g.x), Y(g.y), g.w, g.n, k)).join('')}`,
    X, Y, lam: mid,
  };
}

function labelledCpSvg(): string {
  const p = 'f4ar4';
  const k = 100, cx = 290, cy = 170;
  const cp = shadeCp(cx, cy, k), L: Lens = { cx, cy, rx: CPA * k, ry: CPB * k };
  const g = SHADE_GR[3], gR: Pt = [cp.X(g.x + g.w / 2) + 1, cp.Y(g.y)];
  const str: Pt = [cp.X(1.78), cp.Y(0.58)];
  const rl = (y: number, s: string, to: Pt): string => lab(780, y, s, 'end') + leader([780 - tw(s) - 20, y - 7], to);
  // the real grana at the same magnification: 2.9 µm × 2.6 µm
  const TW = 2.9 * k, TH = (TW * TSH.h) / TSH.w, TX = 780 - TW, TY = 314;
  const t = photo(`${p}-t`, TSH, TX, TY, TW, TH, { line: true });
  // the key: a sun and a deep-shade granum side-on at the same scale, on one base line yb
  const yb = 548, xs = 112, xd = 292, hs = 7 * REP * k, hd = 100 * REP * k;
  return svg('One chloroplast of a shade leaf drawn to scale, 5 µm long: envelope of two membranes, stroma, tall grana joined by stroma lamellae; an electron micrograph of grana in a leaf grown in shade, at 5 % of sunlight, at the same magnification; a key at the same scale: a granum of a sun leaf has fewer than 10 thylakoids, one in deep shade about 100', `
    ${head(20, 30, 'chloroplast', 'shade leaf')}
    ${cp.svg}
    ${rl(70, 'envelope', onLens(L, -58))}${rl(130, 'granum', gR)}${rl(204, 'stroma lamella', cp.lam)}${rl(264, 'stroma', str)}
    <path class="fl4a-scale" d="M${f(cx - CPA * k)},${f(cy + CPB * k + 26)}h${k}"/>${tag(cx - CPA * k + k + 12, cy + CPB * k + 32, '1 µm', 'start')}
    ${tag(TX, TY - 11, 'shade-grown, 5 % of sunlight', 'start')}
    ${t.svg}${pillAt(t, [330, 26], 'granum', t.at(...SHA.gu))}
    ${cred(780, TY + TH + 22, C_SHAO, 'end')}
    ${lab(20, 354, 'thylakoids per granum', 'start')}
    ${stack(xs, yb - hs / 2, 0.5, 7, k)}${stack(xd, yb - hd / 2, 0.6, 100, k)}
    ${text(xs, yb - hs - 14, '&lt; 10', 'fl4a-num')}${text(xd + 46, yb - hd / 2 + 10, '≈ 100', 'fl4a-num', 'start')}
    ${tag(xs, yb + 30, 'sun leaf')}${tag(xd, yb + 30, 'deep shade')}
  `);
}

/* ---------- r5 · the two micrographs large, one granum and one lamella outlined in each; the cells as a strip ---------- */

function annotatedSvg(): string {
  const p = 'f4ar5';
  const TW = 299, TH = (TW * TSH.h) / TSH.w, TY = 284, cL = 311.5, cR = 630.5;
  const a = tem(`${p}-a`, TSH, cL - TW / 2, TY, TW, TH), b = tem(`${p}-b`, TSU, cR - TW / 2, TY, TW, TH);
  const A = (q: Pt): Pt => a.at(...q), B = (q: Pt): Pt => b.at(...q);
  const k = 3.4, top = 76, cy = top + 17 * k;
  const dim = lightCell(p, cL, cy, k, false, { arrow: 22 }), bri = lightCell(p, cR, cy, k, true, { arrow: 22 });
  const gu = smooth(grow(SHA_GU, 7).map(A), true), sl = smooth(SUA_LAM.map(B), false);
  const sg = capsule(B(SUA.g0), B(SUA.g1), 13 * b.s);
  const shl = `M${f(A(SHA.lam0)[0])},${f(A(SHA.lam0)[1])}L${f(A(SHA.lam1)[0])},${f(A(SHA.lam1)[1])}`;
  const lm: Pt = [(SHA.lam0[0] + SHA.lam1[0]) / 2, (SHA.lam0[1] + SHA.lam1[1]) / 2];
  return svg('Two kinds of response to light, one per row. Top row, chloroplast positions within minutes: a drawn mesophyll cell in dim light, chloroplasts on the walls facing the light, and in bright light, chloroplasts on the side walls. Bottom row, grana in leaves grown for weeks, two electron micrographs large: grown in shade, at 5 % of sunlight, a tall granum; grown in brighter light, at 50 % of sunlight, a thin one; one granum and one stroma lamella outlined in each', `
    ${lightDefs(p)}
    ${rowLab(cy, ['chloroplast', 'positions'], ['within minutes'])}
    ${lab(cL, 38, 'dim light')}${lab(cR, 38, 'bright light')}
    ${dim.svg}${bri.svg}
    ${rule(214)}
    ${rowLab(TY + TH / 2, ['grana'], ['leaves grown', 'for weeks in…'])}
    ${colLab(cL, TY - 36, 'shade', '5 % of sunlight')}${colLab(cR, TY - 36, 'brighter light', '50 % of sunlight')}
    ${a.svg}${b.svg}
    ${ovl(gu, true)}${ovl(shl, false)}${ovl(sg, true)}${ovl(sl, false)}
    ${pillAt(a, [150, 26], 'granum', A([99, 113]))}
    ${pillAt(a, [380, 300], 'stroma lamella', A(lm))}
    ${pillAt(b, [250, 300], 'granum', B(sunGr(-13)))}
    ${pillAt(b, [330, 26], 'stroma lamella', B([478, 46]))}
    ${a.bar}${b.bar}
    ${cred(cR + TW / 2, TY + TH + 22, C_SHAO, 'end')}
  `);
}

/* ---------- s1, s2 · slide 5's story in one figure: the scientist, the chloroplast, grana in shade and in brighter light,
 * the pigment–protein complex with its pigments. s1 reads left to right in scale, s2 is a 2 × 2 grid.
 * Real images, each from a different plant (the figure says so): Gustav Senn's portrait (Photopress AG, UB Basel); a lettuce
 * chloroplast as a 3-D model (Yuv345, CC BY-SA 4.0, data of Bussi et al. 2019; colours from the file's own legend: grana
 * yellow, stroma lamellae green, plastoglobules purple, envelope blue); grana of the jewel orchid Anoectochilus roxburghii
 * grown at 5 % and at 50 % of sunlight (Shao et al. 2014, CC BY 4.0); the pea LHCII trimer, our render of PDB 2BHW with
 * Chl a and Chl b in two greens (photos/lhcii-top-ab.png, same frame as lhcii-top.png, so TOPA holds; ≈ 1 nm is the Mg–Mg
 * distance of chlorophylls a B602 and B607, 0.98 nm). The cell is drawn to scale as in r1–r5 (30 µm × 34 µm, chloroplasts
 * 5 µm × 2 µm on the walls that face dim light). ---------- */

const LTAB: Img = { href: lhcTopAB, w: 809, h: 794 };
const CHLA = 'Chl <tspan font-style="italic">a</tspan>', CHLB = 'Chl <tspan font-style="italic">b</tspan>';
const C_YUV = 'Yuv345, CC BY-SA 4.0, data: Bussi et al. 2019';
/** Anchors in the 3-D chloroplast model (chloroplast-3d.jpg, 1400 × 619), each colour checked by sampling: the envelope
 *  (its pale top surface), a granum (yellow) and a stroma lamella (green) near the lower edge, the stroma seen through the
 *  envelope at the tip, past the ends of the membranes, and a granum to zoom into. */
const CPA3 = { env: [1000, 120], gra: [880, 470], lam: [650, 470], str: [1345, 300], zg: [1110, 290] } satisfies Record<string, Pt>;
/** The chloroplast model's labels: envelope and stroma as pills in the white corners of the image, stroma lamellae and
 *  grana on two rows under it (the lower row's leader leaves from the end of its text, clear of the upper row), then the
 *  credit. Returns the svg and the y under the credit. */
function cp3Labels(c: Photo, x: number, w: number, yb: number): { svg: string; y: number } {
  const C = (k: keyof typeof CPA3): Pt => c.at(...CPA3[k]);
  const r1 = yb + 26, r2 = yb + 52;
  return {
    y: r2 + 22,
    svg: swPill(x + w - 58, c.at(0, 46)[1], 'envelope', 'fl4a-sw-env', C('env')) + pill(x + w - 40, c.at(0, 575)[1], 'stroma', C('str'))
      + swLab(x, r1, 'stroma lamellae', 'fl4a-sw-lam', C('lam'), [x + 80, r1 - 18])
      + swLab(x, r2, 'grana (thylakoid stacks)', 'fl4a-sw-gr', C('gra'), [x + 214, r2 - 8])
      + cred(x, r2 + 22, C_YUV),
  };
}

/** A rectangle with slightly irregular, scissor-cut edges (as the clippings'). */
function paperPath(x: number, y: number, w: number, h: number, seed: number): string {
  const r = rng(seed), pts: Pt[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number): void => {
    const l = Math.hypot(bx - ax, by - ay), n = Math.max(2, Math.round(l / 15)), nx = -(by - ay) / l, ny = (bx - ax) / l;
    for (let i = 0; i < n; i++) { const t = i / n, q = (r() - 0.5) * 3.4; pts.push([ax + (bx - ax) * t + nx * q, ay + (by - ay) * t + ny * q]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return `M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}Z`;
}
/** Senn's card: his halftone portrait on newsprint, his name and what he described, w wide from (x, y). */
function sennCard(p: string, x: number, y: number, w: number, rot = -2): { svg: string; h: number } {
  const m = 0.06 * w, iw = w - 2 * m, ih = iw * 1.25, fs = 18, h = m + ih + 70, ty = y + m + ih + 25;
  return {
    h,
    svg: `<g transform="rotate(${rot} ${f(x + w / 2)} ${f(y + h / 2)})"><defs><filter id="${p}-csh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
      <path class="clip-paper" d="${paperPath(x, y, w, h, 13)}" filter="url(#${p}-csh)"/>
      <image href="${senn}" x="${f(x + m)}" y="${f(y + m)}" width="${f(iw)}" height="${f(ih)}" preserveAspectRatio="xMidYMid slice"/>
      <text class="clip-name" x="${f(x + w / 2)}" y="${f(ty)}" text-anchor="middle" font-size="${fs}">Gustav Senn</text>
      <text class="clip-find" x="${f(x + w / 2)}" y="${f(ty + 21)}" text-anchor="middle" font-size="15.5">described chloroplast</text>
      <text class="clip-find" x="${f(x + w / 2)}" y="${f(ty + 39)}" text-anchor="middle" font-size="15.5">movement, 1908</text></g>`,
  };
}
/** The pigment key of the LHCII render, one item per row from (x, y). */
const pigKey = (x: number, y: number, dy = 22): string =>
  swKey(x, y, [['fl4a-kchla', CHLA], ['fl4a-kchlb', CHLB], ['fl4a-kcar', 'carotenoid'], ['fl4a-kprot', 'protein']], 1, 0, dy);
/** The LHCII trimer from the stroma, w wide from (x, y), with the ≈ 1 nm mark between two chlorophylls. */
function lhcAB(p: string, x: number, y: number, w: number): string {
  const ph = photo(`${p}-l`, LTAB, x, y, w, (w * LTAB.h) / LTAB.w, { meet: true });
  const a = ph.at(...TOPA.m1), b = ph.at(...TOPA.m2);
  return ph.svg + nm(a, b, [(a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 30]);
}
/** A label on the page with a colour swatch (what that colour means in the image) and a leader onto the image. */
function swLab(x: number, y: number, s: string, sw: string | null, to: Pt, from?: Pt): string {
  const tx = sw ? x + 19 : x;
  return (sw ? `<circle class="${sw}" cx="${f(x + 7)}" cy="${f(y - 6)}" r="7"/>` : '') + text(tx, y, s, 'fl4a-pill', 'start') + pleader(from ?? [tx + s.length * 4.2, y - 18], to);
}

function storyRowSvg(): string {
  const p = 'f4as1';
  // column 1: Senn beside the cell he would have looked at; the chloroplast below
  const card = sennCard(p, 24, 30, 140, -2);
  const k = 3.2, ccx = 258, y0 = 96, cy = y0 + 17 * k;
  const cell = lightCell(p, ccx, cy, k, false, { arrow: 22, gap: 6 });
  const cz = cell.cps[5];
  const CW = 330, CH = (CW * CP3.h) / CP3.w, CX = 20, CY = 324;
  const c = photo(`${p}-c`, CP3, CX, CY, CW, CH, { line: true });
  const cl = cp3Labels(c, CX, CW, CY + CH);
  const zg = c.at(...CPA3.zg);
  // column 2: the grana, shade above brighter light
  const TX = 374, TW = 190, TH = 170;
  const a = tem(`${p}-a`, TSH, TX, 98, TW, TH), b = tem(`${p}-b`, TSU, TX, 342, TW, TH);
  const bz = b.at(440, 175);
  // column 3: the pigment–protein complex
  const LX = 588, LW = 192;
  return svg('Slide 5 left to right in scale, each image from a different plant: Gustav Senn, who described chloroplast movement in 1908, beside a drawn mesophyll cell with its chloroplasts on the walls that face dim light; a lettuce chloroplast as a 3-D model, with envelope, grana (thylakoid stacks), stroma lamellae and stroma; grana of a jewel orchid grown in shade, at 5 % of sunlight, taller than in brighter light, at 50 % of sunlight; and light-harvesting complex II of pea with its chlorophylls a and b and carotenoids, about 1 nm apart', `
    ${defs(p)}${lightDefs(p)}
    ${card.svg}${cred(24 + 70, 30 + card.h + 22, 'Photopress AG, UB Basel', 'middle')}
    ${lab(ccx, 36, 'mesophyll cell')}${tag(ccx, 60, 'dim light')}
    ${cell.svg}${zboxP(cz[0], cz[1], 24, 15)}${zar(p, [cz[0], cz[1] + 10], [cz[0], 284])}
    ${head(CX, 312, 'chloroplast', 'lettuce, 3-D model')}
    ${c.svg}${cl.svg}${zboxP(zg[0], zg[1], 16, 16)}
    ${zar(p, [zg[0] + 9, zg[1]], [TX - 6, zg[1]])}
    ${head(TX, 36, 'grana', 'jewel orchid')}
    ${colLab(TX + TW / 2, 66, 'shade', '5 % of sunlight')}${a.svg}${pillAt(a, [150, 30], 'granum', a.at(...SHA.gu))}${a.bar}
    ${colLab(TX + TW / 2, 310, 'brighter light', '50 % of sunlight')}${b.svg}${pillAt(b, [250, 300], 'granum', b.at(...sunGr(-6)))}${b.bar}
    ${zboxP(bz[0], bz[1], 16, 16)}${zar(p, [bz[0] + 6, bz[1] - 9], [LX + 4, 236])}
    ${cred(TX + TW, 342 + TH + 20, C_SHAO, 'end')}
    ${lab(LX, 36, 'light-harvesting', 'start')}${lab(LX, 60, 'complex II (LHCII)', 'start')}${tag(LX, 84, 'pea', 'start')}
    ${lhcAB(p, LX, 100, LW)}
    ${pigKey(LX + 8, 352)}
    ${cred(LX, 458, 'PDB 2BHW')}${cred(LX, 474, '(Standfuss et al. 2005)')}
    ${tag(LX, 540, 'different plants', 'start')}${tag(LX, 563, 'at each scale', 'start')}
  `);
}

function storyGridSvg(): string {
  const p = 'f4as2';
  const Q = { l: 20, r: 410, t: 16, b: 312, w: 370, h: 280 };
  // top left: Senn and the cell
  const card = sennCard(p, Q.l + 26, Q.t + 16, 128, -2);
  const k = 3.6, ccx = Q.l + 270, y0 = Q.t + 104, cy = y0 + 17 * k;
  const cell = lightCell(p, ccx, cy, k, false, { arrow: 22, gap: 6 });
  // top right: the chloroplast
  const CW = 338, CH = (CW * CP3.h) / CP3.w, CX = Q.r + 16, CY = Q.t + 46;
  const c = photo(`${p}-c`, CP3, CX, CY, CW, CH, { line: true });
  const cl = cp3Labels(c, CX, CW, CY + CH);
  // bottom left: the grana
  const TW = 164, TH = 150, TY = Q.b + 98;
  const a = tem(`${p}-a`, TSH, Q.l + 16, TY, TW, TH), b = tem(`${p}-b`, TSU, Q.l + Q.w - 16 - TW, TY, TW, TH);
  // bottom right: the complex
  const LX = Q.r + 16, LW = 180;
  return svg('Slide 5 in four panels, each image from a different plant: Gustav Senn, who described chloroplast movement in 1908, and a drawn mesophyll cell with its chloroplasts on the walls that face dim light; a lettuce chloroplast as a 3-D model, with envelope, grana (thylakoid stacks), stroma lamellae and stroma; grana of a jewel orchid grown in shade, at 5 % of sunlight, taller than in brighter light, at 50 % of sunlight; light-harvesting complex II of pea with its chlorophylls a and b and carotenoids, about 1 nm apart', `
    ${lightDefs(p)}
    ${panel(Q.l, Q.t, Q.l + Q.w, Q.t + Q.h)}${panel(Q.r, Q.t, Q.r + Q.w, Q.t + Q.h)}${panel(Q.l, Q.b, Q.l + Q.w, Q.b + Q.h)}${panel(Q.r, Q.b, Q.r + Q.w, Q.b + Q.h)}
    ${card.svg}${cred(Q.l + 26 + 64, Q.t + 16 + card.h + 20, 'Photopress AG, UB Basel', 'middle')}
    ${lab(ccx, Q.t + 40, 'mesophyll cell')}${tag(ccx, Q.t + 64, 'dim light')}${cell.svg}
    ${head(CX, Q.t + 32, 'chloroplast', 'lettuce, 3-D model')}
    ${c.svg}${cl.svg}
    ${head(Q.l + 16, Q.b + 32, 'grana', 'jewel orchid')}
    ${colLab(Q.l + 16 + TW / 2, TY - 36, 'shade', '5 % of sunlight')}${colLab(Q.l + Q.w - 16 - TW / 2, TY - 36, 'brighter light', '50 % of sunlight')}
    ${a.svg}${b.svg}${pillAt(a, [150, 30], 'granum', a.at(...SHA.gu))}${pillAt(b, [250, 300], 'granum', b.at(...sunGr(-6)))}${a.bar}${b.bar}
    ${cred(Q.l + Q.w - 16, TY + TH + 20, C_SHAO, 'end')}
    ${lab(LX, Q.b + 32, 'light-harvesting complex II', 'start')}${text(LX, Q.b + 56, '(LHCII)', 'sm fl4a-b', 'start')}${tag(LX + 84, Q.b + 56, 'pea', 'start')}
    ${lhcAB(p, LX, Q.b + 66, LW)}
    ${pigKey(Q.r + 214, Q.b + 104)}
    ${cred(Q.r + 214, Q.b + 200, 'PDB 2BHW')}${cred(Q.r + 214, Q.b + 216, '(Standfuss et al. 2005)')}
    ${tag(Q.r + 214, Q.b + 246, 'different plants', 'start')}${tag(Q.r + 214, Q.b + 269, 'at each scale', 'start')}
  `);
}

/* ---------- n1–n6 · less is more (27 Oct 2026): each figure labels only the slide's own terms (grana, unstacked membranes,
 * lumen, stroma, photosystem II, photosystem I, pigment–protein complex, chloroplast), plus an organism name and a credit per
 * real image. Real images (assets/SOURCES.md): tobacco chloroplast TEM (Staehelin & Paolillo 2020, CC BY 4.0, adapted); lettuce
 * chloroplast 3-D model (Yuv345, CC BY-SA 4.0, data Bussi et al. 2019; grana yellow, stroma lamellae green, plastoglobules
 * purple, from the file's legend); spinach cryo-ET (Wietrzynski et al. 2025, eLife, CC BY 4.0: Fig 1–S3 A, and Fig 6C cut
 * above its 200 nm bar); pea PSII–LHCII supercomplex (RCSB PDB 5XNL, Su et al. 2017). Drawings: thylakoids side-on, each a
 * membrane around its lumen, in the stroma. Photosystem II (blue, with its antenna) only where a membrane is appressed to the
 * next one in a stack; photosystem I (green) only where a membrane faces the stroma: the unstacked membranes and the end
 * membranes of a stack (Wietrzynski et al. 2025). Colours of the complexes as on slide 9 and in the leaf animation. ---------- */

/** A label pill at 20 px, centred at (x, y), with a leader from its edge to each target. */
function pl(x: number, y: number, s: string, ...to: Pt[]): string {
  const w = s.length * 10.6 + 28, h = 32;
  const ld = to.map(q => {
    const dx = q[0] - x, dy = q[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), h / 2 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], q);
  }).join('');
  return `${ld}<rect class="fl4a-pillbg" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="16"/>${text(x, y + 7, s, 'fl4a-pillL')}`;
}
/** A page label (22 px, bold) with a leader from `from` to each target. */
const pg = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end', from: Pt, ...to: Pt[]): string =>
  to.map(q => pleader(from, q)).join('') + text(x, y, s, 'sm fl4a-b', a);

interface Sac { x0: number; x1: number; y: number }
interface Mem { m: number; lu: number; gap: number }
const sacH = (o: Mem): number => 2 * o.m + o.lu;
/** Thylakoids side-on, each from x0 to x1 with its top at y: the membrane (m thick) around the lumen (lu). */
const sacs = (S: Sac[], o: Mem): string => S.map(s => {
  const H = sacH(o);
  return `<rect class="fl4a-nmem" x="${f(s.x0)}" y="${f(s.y)}" width="${f(s.x1 - s.x0)}" height="${f(H)}" rx="${f(H / 2)}"/>`
    + `<rect class="fl4a-nlum" x="${f(s.x0 + o.m)}" y="${f(s.y + o.m)}" width="${f(s.x1 - s.x0 - 2 * o.m)}" height="${f(o.lu)}" rx="${f(o.lu / 2)}"/>`;
}).join('');

interface PS { svg: string; two: Pt[]; one: Pt[] }
/** The photosystems in the sacs S, w wide, every `step` px along each membrane (alternate membranes offset by half a step):
 *  photosystem II where the membrane is appressed to the next sac's, photosystem I where it faces the stroma, none on the
 *  curved margins. */
function photosystems(S: Sac[], o: Mem, step: number, w: number): PS {
  const H = sacH(o), d = H + o.gap, h = o.m + 7, two: Pt[] = [], one: Pt[] = [];
  S.forEach((s, i) => [0, 1].forEach(k => {
    const ny = s.y + (k ? d : -d), yc = s.y + (k ? H - o.m / 2 : o.m / 2), nb = S.filter(q => Math.abs(q.y - ny) < 0.5);
    for (let x = s.x0 + H / 2 + w / 2 + 4 + ((i + k) % 2) * step / 2; x < s.x1 - H / 2 - w / 2 - 4; x += step) {
      if (nb.some(q => x > q.x0 + H / 2 + w / 2 + 6 && x < q.x1 - H / 2 - w / 2 - 6)) two.push([x, yc]);
      else if (!nb.some(q => x > q.x0 - w && x < q.x1 + w)) one.push([x, yc]);
    }
  }));
  const r = (q: Pt, c: string): string => `<rect class="${c}" x="${f(q[0] - w / 2)}" y="${f(q[1] - h / 2)}" width="${f(w)}" height="${f(h)}" rx="4"/>`;
  return { svg: two.map(q => r(q, 'fl4a-nps2')).join('') + one.map(q => r(q, 'fl4a-nps1')).join(''), two, one };
}
/** A photosystem's name after a swatch drawn as the complex is (blue: II, green: I); the text starts at x + 34. */
const psKey = (x: number, y: number, two: boolean): string =>
  `<rect class="${two ? 'fl4a-nps2' : 'fl4a-nps1'}" x="${f(x)}" y="${f(y - 17)}" width="24" height="20" rx="4"/>${text(x + 34, y, two ? 'photosystem II' : 'photosystem I', 'sm fl4a-b', 'start')}`;
/** The x in x0 … x1 farthest from every complex in pts (so a leader into the lumen there crosses none). */
function clearX(pts: Pt[], x0: number, x1: number): number {
  let best = x0, bd = -1;
  for (let x = x0; x <= x1; x += 2) { const dd = Math.min(...pts.map(q => Math.abs(q[0] - x))); if (dd > bd) { bd = dd; best = x; } }
  return best;
}
/** The complex on the membrane at height y (± 1) that lies farthest to the right. */
const rightmost = (pts: Pt[], y: number): Pt => pts.filter(q => Math.abs(q[1] - y) < 1).reduce((b, q) => (q[0] > b[0] ? q : b));

/** A stroma field (rounded rectangle) and a clip path of the same shape. */
const field = (id: string, x: number, y: number, w: number, h: number): { bg: string; clip: string } => ({
  bg: `<rect class="fl4a-nstr" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>`,
  clip: `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/></clipPath>`,
});

/** A granum of n sacs, x0 … x1, top at y0; the sacs listed in `lam` run on as unstacked membranes to the given x. */
function granum(x0: number, x1: number, y0: number, n: number, o: Mem, lam: Array<[number, number]>): Sac[] {
  const d = sacH(o) + o.gap;
  return Array.from({ length: n }, (_, i) => {
    const s: Sac = { x0, x1, y: y0 + i * d };
    for (const [j, to] of lam) if (j === i) { if (to < x0) s.x0 = to; else s.x1 = to; }
    return s;
  });
}

const C_5XNL = 'RCSB PDB, PDB ID 5XNL (Su et al. 2017)';

/* ---------- n1 · the micrograph labelled; one granum drawn below, its lumen shaded ---------- */

function n1Svg(): string {
  const p = 'f4an1';
  const a = photo(`${p}-a`, CTEM, 20, 20, 760, 417, { line: true });
  const zg = a.at(735, 682);
  const F = field(`${p}-f`, 300, 466, 480, 124), o: Mem = { m: 4.5, lu: 8, gap: 3 };
  const S = granum(470, 650, 482, 5, o, [[1, 280], [3, 800]]);
  const lu: Pt = [372, S[1].y + o.m + o.lu / 2];
  return svg('A tobacco chloroplast in an electron micrograph, its grana, unstacked membranes and stroma labelled; below, one granum drawn side-on, each thylakoid a membrane around its lumen, the lumen shaded', `
    ${defs(p)}
    ${a.svg}
    ${pl(...a.at(706, 262), 'stroma')}
    ${pl(...a.at(790, 470), 'grana', a.at(700, 335), a.at(960, 548))}
    ${pg(20, 476, 'unstacked membranes', 'start', [150, 456], a.at(400, 410), a.at(593, 563))}
    ${zboxP(zg[0], zg[1], 22, 16)}${zar(p, [zg[0], zg[1] + 9], [zg[0], 462])}
    ${head(20, 518, 'chloroplast', 'tobacco')}
    ${cred(20, 552, 'Staehelin & Paolillo 2020,')}${cred(20, 569, 'CC BY 4.0, adapted')}
    ${F.clip}${F.bg}<g clip-path="url(#${p}-f)">${sacs(S, o)}</g>
    ${pg(318, 572, 'lumen', 'start', [352, 553], lu)}
  `);
}

/* ---------- n2 · the micrograph beside a drawing of it, same orientation; each term labelled once ---------- */

/** The tobacco micrograph traced (image pixels): the envelope, and the main bands of thylakoids with their grana ([x0, x1]
 *  along the band, sacs above, sacs below). Fewer bands than the micrograph shows, so the drawing stays light. */
const TEM_ENV: Pt[] = [[62, 585], [70, 500], [90, 420], [125, 340], [175, 270], [240, 205], [320, 150], [420, 105], [530, 78], [650, 65],
  [760, 68], [860, 95], [960, 135], [1060, 185], [1150, 240], [1230, 315], [1295, 400], [1335, 490], [1340, 570], [1315, 630], [1250, 675],
  [1140, 705], [980, 722], [800, 728], [600, 722], [400, 712], [250, 690], [140, 655], [85, 625]];
const TEM_BANDS: Array<{ p: Pt[]; gr: Array<[number, number, number, number]> }> = [
  { p: [[165, 335], [250, 285], [400, 210], [560, 150], [730, 112]], gr: [[300, 540, 2, 1]] },
  { p: [[870, 190], [1000, 245], [1120, 300], [1180, 330], [1250, 400], [1300, 470]], gr: [[890, 1100, 1, 2]] },
  { p: [[170, 410], [300, 360], [430, 320], [540, 302], [650, 320], [800, 338], [1000, 350], [1150, 400]], gr: [[640, 800, 2, 2]] },
  { p: [[110, 560], [230, 545], [430, 510], [650, 512], [880, 540], [1000, 553], [1300, 600]], gr: [[230, 420, 1, 2], [660, 880, 1, 2]] },
  { p: [[140, 640], [450, 660], [620, 680], [850, 685], [1000, 690], [1280, 660]], gr: [[400, 560, 2, 0], [1050, 1250, 2, 0]] },
];
/** The point of polyline q at x (q runs left to right). */
function onX(q: Pt[], x: number): Pt {
  for (let i = 0; i < q.length - 1; i++) {
    const [a, b] = [q[i], q[i + 1]];
    if (x >= a[0] && x <= b[0]) { const t = (x - a[0]) / (b[0] - a[0] || 1); return [x, a[1] + (b[1] - a[1]) * t]; }
  }
  return x < q[0][0] ? q[0] : q[q.length - 1];
}
/** The traced chloroplast drawn at the micrograph's own scale (M maps image pixels): envelope, stroma, thylakoid bands (each a
 *  green membrane around its lumen) and their grana. */
function temDrawing(id: string, M: (u: number, v: number) => Pt, o: Mem): string {
  const H = sacH(o), d = H + o.gap;
  const env = smooth(TEM_ENV.map(q => M(...q)), true);
  const line = (q: Pt[]): string => `M${q.map(r => `${f(r[0])},${f(r[1])}`).join('L')}`;
  const sac = (q: Pt[]): string => `<path class="fl4a-nbm" d="${line(q)}" style="stroke-width:${f(H)}"/><path class="fl4a-nbl" d="${line(q)}" style="stroke-width:${f(o.lu)}"/>`;
  const out: string[] = [];
  for (const b of TEM_BANDS) {
    out.push(sac(b.p.map(q => M(...q))));
    for (const [x0, x1, na, nb] of b.gr) {
      const A = M(...onX(b.p, x0)), B = M(...onX(b.p, x1)), L = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const nx = (B[1] - A[1]) / L, ny = -(B[0] - A[0]) / L;
      for (let k = -nb; k <= na; k++) if (k) out.push(sac([[A[0] + nx * k * d, A[1] + ny * k * d], [B[0] + nx * k * d, B[1] + ny * k * d]]));
    }
  }
  return `<clipPath id="${id}"><path d="${env}"/></clipPath><path class="fl4a-nenv" d="${env}"/><g clip-path="url(#${id})">${out.join('')}</g><path class="fl4a-nenvi" d="${env}"/>`;
}

function n2Svg(): string {
  const p = 'f4an2';
  const W = 375, Y = 200, s = W / CTEM.w;
  const a = photo(`${p}-a`, CTEM, 20, Y, W, CTEM.h * s, { line: true });
  const M = (u: number, v: number): Pt => [405 + u * s, Y + v * s];
  const o: Mem = { m: 1.7, lu: 3, gap: 0.7 };
  const yb = Y + CTEM.h * s;
  return svg('A tobacco chloroplast in an electron micrograph and beside it a drawing of the same chloroplast, same orientation. One label each, with leaders to both where both show it: grana and unstacked membranes; in the drawing also the stroma and the lumen inside each thylakoid', `
    ${defs(p)}
    ${a.svg}${temDrawing(`${p}-d`, M, o)}
    ${head(20, 156, 'chloroplast', 'tobacco')}
    ${pg(400, 156, 'grana', 'middle', [400, 164], a.at(720, 335), M(720, 328))}
    ${pg(780, 156, 'stroma', 'end', [745, 164], M(1060, 450))}
    ${pg(400, 476, 'unstacked membranes', 'middle', [400, 456], a.at(593, 563), M(500, 307))}
    ${pg(780, 476, 'lumen', 'end', [745, 456], M(950, 688))}
    ${cred(20, yb + 22, 'Staehelin & Paolillo 2020,')}${cred(20, yb + 39, 'CC BY 4.0, adapted')}
  `);
}

/* ---------- n3 · the membrane map: one granum and its unstacked membranes, side-on ---------- */

function n3Svg(): string {
  const p = 'f4an3';
  const F = field(`${p}-f`, 20, 20, 760, 560), o: Mem = { m: 16, lu: 24, gap: 10 };
  const H = sacH(o), y0 = 300 - (4 * H + 3 * o.gap) / 2;
  const S = granum(250, 550, y0, 4, o, [[1, 0], [2, 800]]);
  const ps = photosystems(S, o, 62, 20);
  const p2 = rightmost(ps.two, S[0].y + H - o.m / 2), p1 = nearest(ps.one, 680, S[2].y + H);
  const lu: Pt = [clearX(ps.one, 90, 200), S[1].y + o.m + o.lu / 2];
  return svg('One granum and its unstacked membranes, side-on, in the stroma: four stacked thylakoids, each a membrane around its lumen; one runs on to the left and one to the right as unstacked membranes. Photosystem II (blue) sits only where two membranes are appressed in the stack; photosystem I (green) only where a membrane faces the stroma: in the unstacked membranes and on the top and bottom of the stack', `
    ${defs(p)}
    ${F.clip}${F.bg}<g clip-path="url(#${p}-f)">${sacs(S, o)}${ps.svg}</g>
    ${text(48, 70, 'stroma', 'sm fl4a-b', 'start')}
    ${pg(48, 190, 'lumen', 'start', [80, 198], lu)}
    ${pg(48, 480, 'unstacked membranes', 'start', [150, 460], [150, S[1].y + H - 1])}
    ${psKey(572, 190, true)}${pleader([600, 198], p2)}
    ${psKey(572, 470, false)}${pleader([660, 450], p1)}
  `);
}

/* ---------- n4 · the 3-D chloroplast with its colour key; one granum edge drawn side-on ---------- */

function n4Svg(): string {
  const p = 'f4an4';
  const c = photo(`${p}-c`, CP3, 20, 46, 510, (510 * CP3.h) / CP3.w, { line: true });
  const zg = c.at(742, 480);
  const F = field(`${p}-f`, 20, 322, 760, 268), o: Mem = { m: 14, lu: 20, gap: 10 };
  const H = sacH(o), y0 = 456 - (3 * H + 2 * o.gap) / 2;
  const S = granum(0, 380, y0, 3, o, [[1, 800]]);
  const ps = photosystems(S, o, 62, 20);
  const p2 = nearest(ps.two, 330, S[0].y + H), p1 = nearest(ps.one, 620, S[1].y + H);
  const lu: Pt = [clearX(ps.one, 680, 740), S[1].y + o.m + o.lu / 2];
  return svg('A lettuce chloroplast reconstructed in 3-D: grana in yellow, unstacked membranes in green, plastoglobules in purple. Below, the edge of one granum drawn side-on in the stroma: stacked thylakoids, each a membrane around its lumen, one running on as an unstacked membrane; photosystem II (blue) where membranes are appressed, photosystem I (green) where they face the stroma', `
    ${defs(p)}
    ${head(20, 34, 'chloroplast', 'lettuce')}
    ${c.svg}${zboxP(zg[0], zg[1], 20, 20)}
    <circle class="fl4a-sw-gr" cx="559" cy="104" r="7"/>${text(573, 110, 'grana', 'fl4a-pillL', 'start')}
    <circle class="fl4a-sw-lam" cx="559" cy="146" r="7"/>${text(573, 152, 'unstacked membranes', 'fl4a-pillL', 'start')}
    <circle class="fl4a-sw-pg" cx="559" cy="188" r="7"/>${text(573, 194, 'plastoglobules', 'fl4a-keyg', 'start')}
    ${cred(552, 252, 'Yuv345, CC BY-SA 4.0,')}${cred(552, 269, 'data: Bussi et al. 2019')}
    ${zar(p, [zg[0], zg[1] + 11], [zg[0], 318])}
    ${F.clip}${F.bg}<g clip-path="url(#${p}-f)">${sacs(S, o)}${ps.svg}</g>
    ${text(760, 360, 'stroma', 'sm fl4a-b', 'end')}
    ${pg(760, 420, 'lumen', 'end', [722, 428], lu)}
    ${psKey(430, 372, true)}${pleader([464, 380], p2)}
    ${psKey(470, 562, false)}${pleader([560, 542], p1)}
  `);
}

/* ---------- n5 · cryo-ET of spinach thylakoids: the 3-D membranes, and one granum with every photosystem II mapped ---------- */

function n5Svg(): string {
  const p = 'f4an5';
  const a = photo(`${p}-a`, G3D, 20, 40, 760, 330, { ay: 0.7, line: true });
  const b = photo(`${p}-b`, MAP, 20, 386, 760, 190, { ay: 0.429, line: true });
  return svg('Spinach thylakoid membranes from cryo-electron tomography, in 3-D: grana, the unstacked membranes that join them, the lumen inside a thylakoid and the stroma around them. Below, one granum with every photosystem II mapped, in blue', `
    ${defs(p)}
    ${tag(20, 28, 'spinach', 'start')}
    ${a.svg}${b.svg}
    ${pl(...a.at(240, 130), 'unstacked membranes', a.at(306, 212))}
    ${pl(...a.at(430, 330), 'lumen', a.at(610, 324))}
    ${pl(...a.at(650, 452), 'grana', a.at(420, 560), a.at(860, 470))}
    ${pl(...a.at(640, 668), 'stroma')}
    ${pl(...b.at(160, 400), 'photosystem II', b.at(330, 360))}
    ${cred(780, 594, WIE, 'end')}
  `);
}

/* ---------- n6 · three steps in one row: the chloroplast, a granum drawn with its photosystems, one complex ---------- */

function n6Svg(): string {
  const p = 'f4an6';
  const a = photo(`${p}-a`, CTEM, 20, 266, 172, (172 * CTEM.h) / CTEM.w, { line: true });
  const az = a.at(730, 335);
  const F = field(`${p}-f`, 208, 166, 272, 300), o: Mem = { m: 11, lu: 16, gap: 8 };
  const H = sacH(o), y0 = 316 - (4 * H + 3 * o.gap) / 2;
  const S = granum(268, 420, y0, 4, o, [[1, 190], [2, 500]]);
  const ps = photosystems(S, o, 44, 16);
  const dz = rightmost(ps.two, S[1].y + H - o.m / 2);
  const b = photo(`${p}-b`, PDB, 524, 230, 256, (256 * PDB.h) / PDB.w, { meet: true });
  const lu: Pt = [clearX(ps.one, 222, 262), S[1].y + o.m + o.lu / 2];
  return svg('Three steps in one row: a tobacco chloroplast in an electron micrograph; one granum drawn side-on in the stroma, each thylakoid a membrane around its lumen, photosystem II (blue) in the stacked membranes and photosystem I (green) in the unstacked ones; and one pigment–protein complex, photosystem II with its antenna from pea, rendered from its structure', `
    ${defs(p)}<g transform="translate(0 -36)">
    ${head(20, 230, 'chloroplast')}${tag(20, 255, 'tobacco', 'start')}
    ${a.svg}${zboxP(az[0], az[1], 14, 12)}${zar(p, [az[0] + 8, az[1]], [204, az[1]])}
    ${cred(20, 386, 'Staehelin & Paolillo 2020,')}${cred(20, 403, 'CC BY 4.0, adapted')}
    ${F.clip}${F.bg}<g clip-path="url(#${p}-f)">${sacs(S, o)}${ps.svg}</g>
    ${text(224, 198, 'stroma', 'sm fl4a-b', 'start')}
    ${pg(224, 450, 'lumen', 'start', [244, 430], lu)}
    ${psKey(208, 504, true)}${psKey(208, 538, false)}
    ${zboxP(dz[0], dz[1], 22, 24)}${zar(p, [dz[0] + 12, dz[1]], [530, dz[1]])}
    ${text(780, 186, 'pigment–protein complex', 'sm fl4a-b', 'end')}
    ${text(780, 211, 'photosystem II with its antenna · pea', 'fl4a-sub', 'end')}
    ${b.svg}
    ${cred(780, 424, C_5XNL, 'end')}</g>
  `);
}

/* ---------- o1, o2, p1, p2, r3a, r3b · the picks o, p and r3, lighter (27 Oct 2026). Same images and layout ideas; labelled
 * only with the slide's own terms (grana, unstacked membranes, stroma, pigment–protein complex) and the steps in (leaf,
 * mesophyll cell, chloroplast); organism names as grey tags; no sizes. The complex is the pea PSII–LHCII supercomplex (RCSB PDB
 * 5XNL, Su et al. 2017), elongated, as in j and n6. New anchors (image pixels), each checked at 2–5× zoom: tobacco TEM, a
 * granum at (330, 525) and stroma at (900, 290); lettuce 3-D model, grana (yellow) at (990, 200), (1180, 300), (600, 400) and
 * unstacked membranes (green) at (360, 440); spinach 3-D grana, a second granum at (330, 580); shade TEM, a third granum at
 * (105, 315); sun TEM, a second granum cut side-on at (430, 189). ---------- */

/** Leaders from the edge of a w × h box centred at (x, y) to each target. */
const edgeLeads = (x: number, y: number, w: number, h: number, to: Pt[]): string => to.map(q => {
  const dx = q[0] - x, dy = q[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), h / 2 / Math.max(Math.abs(dy), 1e-6));
  return pleader([x + dx * t, y + dy * t], q);
}).join('');
/** A two-line label pill at 20 px (for a narrow panel), centred at (x, y), with a leader to each target. */
function pl2(x: number, y: number, s: [string, string], ...to: Pt[]): string {
  const w = Math.max(s[0].length, s[1].length) * 10.6 + 28, h = 54;
  return `${edgeLeads(x, y, w, h, to)}<rect class="fl4a-pillbg" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="16"/>`
    + text(x, y - 4, s[0], 'fl4a-pillL') + text(x, y + 18, s[1], 'fl4a-pillL');
}
/** A label pill at 20 px with the source legend's colour swatch (as swPill), with a leader to each target. */
function swPl(x: number, y: number, s: string, sw: string, ...to: Pt[]): string {
  const w = s.length * 10.6 + 56, h = 32;
  return `${edgeLeads(x, y, w, h, to)}<rect class="fl4a-pillbg" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="16"/>`
    + `<circle class="${sw}" cx="${f(x - w / 2 + 18)}" cy="${f(y)}" r="7.5"/>${text(+f(x + 10.5), +f(y + 7), s, 'fl4a-pillL')}`;
}

/* ---------- o1 · o, lighter: four panels, only the slide's terms; the elongated complex ---------- */

function micro1Svg(): string {
  const p = 'f4ao1';
  const a = photo(`${p}-a`, LSEC, 20, 52, 300, 240, { credit: ['V44020001, public domain'] });
  const cell = a.at(230, 290), z1 = a.at(560, 230);
  const b = photo(`${p}-b`, CTEM, 340, 52, 440, 241, { credit: [`${C_STA}, adapted`] });
  const z2 = b.at(170, 588);
  const c = photo(`${p}-c`, TOMO, 20, 340, 260, 248, { credit: ['Wietrzynski et al. 2025', 'eLife, CC BY 4.0'], bw: 168 });
  const z3 = c.at(720, 640);
  const d = photo(`${p}-d`, PDB, 330, 372, 450, 208, { meet: true });
  const dx = d.at(0, 0)[0];
  return svg('Real images, from leaf to complex: a fresh leaf cross-section of an unidentified plant with its mesophyll cells; one tobacco chloroplast in an electron micrograph, with its grana, the unstacked membranes between them and the stroma; spinach thylakoid membranes in a cryo-electron tomogram, grana and unstacked membranes; and one pigment–protein complex of pea, photosystem II with its antenna, rendered from its structure', `
    ${defs(p)}
    ${head(20, 36, 'leaf', 'unidentified plant')}
    ${a.svg}${pl(112, 76, 'mesophyll cell', cell)}${zboxP(z1[0], z1[1], 12, 12)}
    ${zar(p, [z1[0] + 7, z1[1]], [334, z1[1]])}
    ${tag(340, 36, 'tobacco', 'start')}${lab(418, 36, 'chloroplast', 'start')}
    ${b.svg}
    ${pl(395, 80, 'grana', b.at(520, 400), b.at(330, 525))}${pl(...b.at(...TEMA.str), 'stroma')}
    ${pl(663, 250, 'unstacked membranes', b.at(593, 565))}
    ${zboxP(z2[0], z2[1], 16, 12)}${zar(p, [z2[0] - 6, z2[1] + 8], [296, 346])}
    ${tag(20, 326, 'spinach', 'start')}${lab(98, 326, 'thylakoid membranes', 'start')}
    ${c.svg}${pl(222, 372, 'grana', c.at(700, 330))}${pl2(90, 470, ['unstacked', 'membranes'], c.at(326, 770))}${zboxP(z3[0], z3[1], 12, 12)}
    ${zar(p, [z3[0] + 7, z3[1]], [dx - 6, z3[1]])}
    ${head(dx, 358, 'pigment–protein complex', 'pea')}
    ${d.svg}
    ${cred(dx, 596, C_5XNL)}
  `);
}

/* ---------- o2 · o1 without the leaf: chloroplast and thylakoid membranes side by side, the complex below, all larger ---------- */

function micro2Svg(): string {
  const p = 'f4ao2';
  const Y = 64, H = 262;
  const b = photo(`${p}-b`, CTEM, 20, Y, (H * CTEM.w) / CTEM.h, H, { credit: [`${C_STA}, adapted`] });
  const z2 = b.at(1220, 495);
  const c = photo(`${p}-c`, TOMO, 518, Y, 262, H, { ax: 1, credit: ['Wietrzynski et al. 2025', 'eLife, CC BY 4.0'], bw: 168 });
  const z3 = c.at(720, 640);
  const d = photo(`${p}-d`, PDB, 365, 352, 362, 238, { meet: true });
  return svg('Real images, from chloroplast to complex: one tobacco chloroplast in an electron micrograph, with its grana, the unstacked membranes between them and the stroma; spinach thylakoid membranes in a cryo-electron tomogram, grana and unstacked membranes; and one pigment–protein complex of pea, photosystem II with its antenna, rendered from its structure', `
    ${defs(p)}
    ${lab(20, 28, 'chloroplast', 'start')}${tag(20, 52, 'tobacco', 'start')}
    ${b.svg}
    ${pl(...b.at(175, 90), 'grana', b.at(520, 400), b.at(330, 525))}${pl(...b.at(...TEMA.str), 'stroma')}
    ${pl(...b.at(1027, 630), 'unstacked membranes', b.at(593, 565))}
    ${zboxP(z2[0], z2[1], 16, 12)}${zar(p, [z2[0] + 9, z2[1]], [512, z2[1]])}
    ${lab(518, 28, 'thylakoid membranes', 'start')}${tag(518, 52, 'spinach', 'start')}
    ${c.svg}${pl(724, 100, 'grana', c.at(700, 330))}${pl2(578, 204, ['unstacked', 'membranes'], c.at(326, 770))}${zboxP(z3[0], z3[1], 12, 12)}
    ${zar(p, [z3[0], z3[1] + 7], [z3[0], 348])}
    ${text(345, 452, 'pigment–protein complex', 'sm fl4a-b', 'end')}${tag(345, 478, 'pea', 'end')}
    ${d.svg}
    ${cred(345, 566, 'RCSB PDB, PDB ID 5XNL', 'end')}${cred(345, 583, '(Su et al. 2017)', 'end')}
  `);
}

/* ---------- p1 · p, lighter: five 3-D panels, no colour key, only the slide's terms; the elongated complex ---------- */

function threeD1Svg(): string {
  const p = 'f4ap1';
  const a = photo(`${p}-a`, LEAF3, 20, 52, 200, 195, { credit: ['Xiao, Tholen & Zhu 2016', 'CC BY 3.0'] });
  const az = a.at(170, 160);
  const b = photo(`${p}-b`, CELL3, 20, 370, 224, (224 * CELL3.h) / CELL3.w, { credit: ['Midorikawa et al. 2022', 'CC BY 4.0'] });
  const bc = b.at(265, 226), bz = b.at(375, 135);
  const c = photo(`${p}-c`, CP3, 250, 52, 530, 234, { credit: ['Yuv345, CC BY-SA 4.0 (data: Bussi et al. 2019)'], bw: 330, right: true });
  const cz = c.at(380, 420);
  const d = photo(`${p}-d`, G3D, 270, 370, 300, 159, { credit: [WIE], bw: 266, right: true });
  const dz = d.at(1150, 521);
  const e = photo(`${p}-e`, PDB, 590, 382, 190, 125, { meet: true });
  return svg('3-D views from leaf to complex: a model of a dicot leaf block with its mesophyll cells; one whole Arabidopsis mesophyll cell lined with chloroplasts; a lettuce chloroplast reconstructed in 3-D, its grana in yellow and the unstacked membranes between them in green; spinach thylakoid membranes in 3-D from cryo-electron tomography, grana and unstacked membranes; one pigment–protein complex of pea, photosystem II with its antenna, rendered from its structure', `
    ${defs(p)}
    ${head(20, 36, 'leaf model', 'dicot')}
    ${a.svg}${zboxP(az[0], az[1], 12, 12)}${zar(p, [az[0], az[1] + 8], [az[0], 314])}
    ${head(20, 336, 'mesophyll cell')}${text(20, 358, '<tspan font-style="italic">Arabidopsis</tspan>', 'fl4a-size', 'start')}
    ${b.svg}${pl(100, 404, 'chloroplast', bc)}${zboxP(bz[0], bz[1], 24, 24)}
    ${zar(p, [bz[0] + 6, bz[1] - 14], [bz[0] + 28, 292])}
    ${tag(250, 36, 'lettuce', 'start')}${lab(322, 36, 'chloroplast', 'start')}
    ${c.svg}${swPl(420, 76, 'unstacked membranes', 'fl4a-sw-lam', c.at(599, 166))}${swPl(726, 76, 'grana', 'fl4a-sw-gr', c.at(990, 200), c.at(1180, 300))}
    ${zboxP(cz[0], cz[1], 20, 20)}${zar(p, [cz[0], cz[1] + 11], [cz[0], 332])}
    ${tag(270, 356, 'spinach', 'start')}${lab(348, 356, 'thylakoid membranes', 'start')}
    ${d.svg}${pl(425, 392, 'unstacked membranes', d.at(306, 212))}${pl(420, 466, 'grana', d.at(1000, 311), d.at(330, 580))}${zboxP(dz[0], dz[1], 12, 12)}
    ${zar(p, [dz[0] + 7, dz[1]], [e.at(0, 0)[0] - 4, dz[1]])}
    ${text(780, 332, 'pigment–protein', 'sm fl4a-b', 'end')}${text(738, 356, 'complex', 'sm fl4a-b', 'end')}${tag(780, 356, 'pea', 'end')}
    ${e.svg}
    ${cred(780, 530, 'RCSB PDB, PDB ID 5XNL', 'end')}${cred(780, 547, '(Su et al. 2017)', 'end')}
  `);
}

/* ---------- p2 · p1 without the leaf model and the cell: chloroplast above, thylakoid membranes and complex below, all larger ---------- */

function threeD2Svg(): string {
  const p = 'f4ap2';
  const c = photo(`${p}-c`, CP3, 70, 52, 660, (660 * CP3.h) / CP3.w, { credit: ['Yuv345, CC BY-SA 4.0 (data: Bussi et al. 2019)'], bw: 330, right: true });
  const cz = c.at(600, 400);
  const d = photo(`${p}-d`, G3D, 20, 392, 373, (373 * G3D.h) / G3D.w, { credit: [WIE], bw: 266, right: true });
  const dz = d.at(1150, 521);
  const e = photo(`${p}-e`, PDB, 440, 392, 340, 190, { meet: true, ax: 0 });
  return svg('3-D views from chloroplast to complex: a lettuce chloroplast reconstructed in 3-D, its grana in yellow and the unstacked membranes between them in green; spinach thylakoid membranes in 3-D from cryo-electron tomography, grana and unstacked membranes; one pigment–protein complex of pea, photosystem II with its antenna, rendered from its structure', `
    ${defs(p)}
    ${tag(70, 36, 'lettuce', 'start')}${lab(142, 36, 'chloroplast', 'start')}
    ${c.svg}${swPl(196, 318, 'unstacked membranes', 'fl4a-sw-lam', c.at(360, 440))}${swPl(676, 76, 'grana', 'fl4a-sw-gr', c.at(990, 200), c.at(1180, 300))}
    ${zboxP(cz[0], cz[1], 20, 20)}${zar(p, [cz[0], cz[1] + 11], [cz[0], 362])}
    ${tag(20, 378, 'spinach', 'start')}${lab(98, 378, 'thylakoid membranes', 'start')}
    ${d.svg}${pl(190, 418, 'unstacked membranes', d.at(306, 212))}${pl(200, 510, 'grana', d.at(1000, 311), d.at(330, 580))}${zboxP(dz[0], dz[1], 12, 12)}
    ${zar(p, [dz[0] + 7, dz[1]], [434, dz[1]])}
    ${head(440, 378, 'pigment–protein complex', 'pea')}
    ${e.svg}
    ${cred(440, 598, C_5XNL)}
  `);
}

/* ---------- r3a · r3's top row alone, larger: Senn and his 1895 drawing; the dim-light and bright-light cells below ---------- */

function senn1Svg(): string {
  const p = 'f4ar3a';
  // a grid: Senn's clipping above the row label, his drawing centred above the two cells
  const PW = 160, PX = 30, PY = 22;
  const DX = 330, DY = 26, DW = 340, dr = sennDrawing(p, DX, DY, DW, 1.5);
  const k = 6, top = 382, cy = top + 17 * k, cL = 380, cR = 620;
  const dim = lightCell(p, cL, cy, k, false, { arrow: 34 }), bri = lightCell(p, cR, cy, k, true, { arrow: 34 });
  return svg('Chloroplast positions. Above, Gustav Senn, as a newspaper clipping, and his own 1895 drawing of chloroplasts moving along the walls of leaf cells. Below, a drawn mesophyll cell in dim light, its chloroplasts on the walls facing the light, and one in bright light, its chloroplasts on the side walls', `
    ${lightDefs(p)}
    ${clipping(`${p}-s`, PX, PY, PW, SENN_SLIDE, -2, 13)}
    ${dr.svg}
    ${cred(PX + PW / 2, PY + PW * 1.52 + 18, 'Photopress AG,', 'middle')}${cred(PX + PW / 2, PY + PW * 1.52 + 33, 'UB Basel', 'middle')}
    ${cred(DX + DW / 2, DY + dr.h + 22, 'G. Senn 1895, CC BY 4.0', 'middle')}
    ${rowLab(cy, ['chloroplast', 'positions'], [])}
    ${lab(cL, top - 52, 'dim light')}${lab(cR, top - 52, 'bright light')}
    ${dim.svg}${bri.svg}
  `);
}

/* ---------- r3b · r3's bottom row alone, larger: grana in shade and in bright light ---------- */

function senn2Svg(): string {
  const p = 'f4ar3b';
  const TW = 370, TH = 420, TY = 92, tL = 205, tR = 595;
  const a = tem(`${p}-a`, TSH, tL - TW / 2, TY, TW, TH, { ax: 0 }), b = tem(`${p}-b`, TSU, tR - TW / 2, TY, TW, TH, { ax: 1 });
  return svg('Grana in electron micrographs of leaves grown in shade, tall grana, and in bright light, thin grana cut side-on', `
    ${lab(tL, TY - 18, 'shade')}${lab(tR, TY - 18, 'bright light')}
    ${a.svg}${b.svg}
    ${pl(...a.at(215, 245), 'grana', a.at(...SHA.gu), a.at(...SHA.gm))}
    ${pl(...b.at(290, 255), 'grana', b.at(...sunGr(6)), b.at(430, 189))}
    ${a.bar}${b.bar}
    ${cred(tR + TW / 2, TY + TH + 22, C_SHAO, 'end')}
  `);
}
