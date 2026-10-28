// Slide C07 · Evolution often begins with CO₂ recapture. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// This slot may later be folded into C08, so it stays short. Checked facts only (research/review-2026-10-23-claude/
// E_C07-C12.md C07 rows 1–7 and C08 rows 1–5, REVIEW_SUMMARY.md §2):
// in C₃ rice and wheat 24–38 % of photorespired + respired CO₂ is refixed inside the cell (Busch 2013); proto-Kranz
// Flaveria have more, larger, centripetal bundle-sheath organelles, with Γ only slightly lower and refixation plausible,
// not shown (Sage TL 2013); living C₃, C₂ and C₄ species are not each other's ancestors; C₂ persists as a strategy of
// its own (Lundgren & Christin 2017); grass C₄ arose only with pre-existing enablers (bundle sheath > 15 % of leaf
// tissue, close veins): 22–24 origins in PACMAD, none in BEP, which includes rice (Christin 2013); C₂: glycine made in
// the mesophyll is decarboxylated mainly in bundle-sheath mitochondria (85–86 % of GDC; Leung 2024), next to chloroplasts (Rawsthorne 1988; Hylton 1988).
// Title changed from "Evolution begins…" to "…often begins…", as the review asks.
import type { PlateText, Variant } from '../types';
import { arrow, text as t } from '../mechanisms';
import { molecule } from '../illus';
import { chain, chloroplast, mitochondrion, n1, peroxisome, pent, rubisco, svg as svg06 } from './c06';
import './c07.css';

export const PLATE: PlateText = {
  n: 'C7',
  title: 'Evolution often begins with CO₂ recapture',
  status: 'draft',
  lead: 'A leaf can refix released CO₂ before it escapes. A rearranged bundle sheath starts some routes to C₄.',
  points: [
    { claim: 'Some CO₂ is refixed already.', text: 'Rice and wheat refix 24–38 % of the CO₂ their mitochondria release.' },
    { claim: 'Organelles move to the vein side.', text: 'In proto-Kranz Flaveria, bundle-sheath mitochondria and chloroplasts cluster by the veins; this may help refixation slightly.' },
    { claim: 'A branching path, not a ladder.', text: 'Grass C₄ arose where bundle sheaths were large; C₂ also persists in its own right.' },
  ],
  refs: [
    { label: 'Busch et al. 2013', url: 'https://doi.org/10.1111/j.1365-3040.2012.02567.x' },
    { label: 'Sage et al. 2013', url: 'https://doi.org/10.1104/pp.113.221119' },
    { label: 'Christin et al. 2013', url: 'https://doi.org/10.1073/pnas.1216777110' },
    { label: 'Lundgren & Christin 2017', url: 'https://doi.org/10.1093/jxb/erw451' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Four leaf types' },
  { id: 'b', name: 'Leak and catch' },
  { id: 'c', name: 'Inward shift' },
  { id: 'd', name: 'Buckets' },
  { id: 'e', name: 'Tree, not ladder' },
  { id: 'f', name: 'Grass enablers' },
  { id: 'g', name: 'Zoom to sheath', anim: true },
  { id: 'h', name: 'Catch angle' },
  { id: 'i', name: 'Glycine shuttle' },
  { id: 'j', name: 'Three icons' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return leakCatch();
    case 'c': return inwardShift();
    case 'd': return buckets();
    case 'e': return tree();
    case 'f': return grasses();
    case 'g': return zoom();
    case 'h': return catchAngle();
    case 'i': return shuttle();
    case 'j': return icons();
    default: return fourTypes();
  }
}

/* ---------- shared parts ---------- */

const svg = (p: string, label: string, body: string): string => svg06(p, label, body, 'fc07');

/** A plant cell: mesophyll ('m') or bundle sheath ('bs'). */
const cell = (x: number, y: number, w: number, h: number, kind: 'm' | 'bs' = 'm', r = 18): string =>
  `<rect class="fc07-cell fc07-cell-${kind}" x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" rx="${r}"/>`;

/** A vein as a band with a few vessels; a label in the middle pushes the vessels aside. */
function veinBand(x: number, y: number, w: number, h: number, label = ''): string {
  const k = Math.max(2, Math.floor(w / 46)), r = Math.min(8, h * 0.22);
  const ves = Array.from({ length: k }, (_, i) => x + ((i + 0.5) * w) / k)
    .filter(vx => !label || Math.abs(vx - (x + w / 2)) > Math.max(46, label.length * 5 + 22))
    .map(vx => `<circle class="fc07-vessel" cx="${n1(vx)}" cy="${n1(y + h / 2)}" r="${n1(r)}"/>`).join('');
  return `<rect class="fc07-vein" x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(14, h / 2)}"/>${ves}` +
    (label ? t(x + w / 2, y + h / 2 + 6, label, 'fc07-vt') : '');
}

/** Small organelles for anatomy panels; vertical chloroplasts sit along side walls. */
const chl = (x: number, y: number, rx = 14, ry = 7, vertical = false): string =>
  vertical ? chloroplast(x, y, ry, rx) : chloroplast(x, y, rx, ry);
const mit = (x: number, y: number, rx = 10, ry = 6, off = false): string => mitochondrion(x, y, rx, ry, 2, false, off);
const co2 = (x: number, y: number, r = 6): string => molecule(x, y, 'OCO', r);
/** A CO₂ path: caught by a chloroplast (clay, solid) or leaving (grey, dashed, with a head). */
const caught = (d: string): string => `<path class="fc07-ray fc07-ray-in" d="${d}"/>`;
const lost = (p: string, d: string): string => `<path class="fc07-ray fc07-ray-out" d="${d}" marker-end="url(#${p}-ink)"/>`;

/** Ring of bundle-sheath cells around a vein disc. */
function wreath(cx: number, cy: number, rv: number, rb: number, n: number, organelles = false, vessels = true): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i * 2 * Math.PI) / n, x = cx + Math.cos(a) * (rv + rb), y = cy + Math.sin(a) * (rv + rb);
    s += `<circle class="fc07-cell fc07-cell-bs" cx="${n1(x)}" cy="${n1(y)}" r="${rb}"/>`;
    if (organelles) {
      const ix = cx + Math.cos(a) * (rv + rb * 0.45), iy = cy + Math.sin(a) * (rv + rb * 0.45);
      s += `<circle class="fc07-dot-chl" cx="${n1(ix)}" cy="${n1(iy)}" r="${n1(rb * 0.28)}"/>`;
    }
  }
  s += `<circle class="fc07-vein" cx="${cx}" cy="${cy}" r="${rv}"/>`;
  if (vessels) s += `<circle class="fc07-vessel" cx="${n1(cx - rv * 0.35)}" cy="${cy}" r="${n1(rv * 0.25)}"/><circle class="fc07-vessel" cx="${n1(cx + rv * 0.35)}" cy="${cy}" r="${n1(rv * 0.25)}"/>`;
  return s;
}

/* ---------- A · four leaf types side by side ---------- */

function fourTypes(): string {
  const p = 'fc07a';
  const W = 170, top = 70, mH = 128, bsY = 208, bsH = 120, vY = 338;
  const cx = (i: number): number => 12 + i * 196 + W / 2;
  const col = (i: number, name: string, sub: string, m: string, bs: string, cap: string[]): string => {
    const x0 = 12 + i * 196, c = cx(i);
    return `${t(c, 34, name, 'fc06-h')}${sub ? t(c, 56, sub, 'fc06-n') : ''}
      ${cell(x0, top, W, mH, 'm')}${cell(x0, bsY, W, bsH, 'bs')}${veinBand(x0, vY, W, 36, i === 0 ? 'vein' : '')}
      ${m}${bs}
      ${cap.map((s, k) => t(c, 410 + k * 27, s, 'fc06-s')).join('')}`;
  };
  /** Chloroplasts lining a mesophyll cell; the bottom pair is left out where an arrow leaves the cell. */
  const mChl = (i: number, bottom = true): string => {
    const x0 = 12 + i * 196, c = cx(i);
    return [-54, -18, 18, 54].map(dx => chl(c + dx, top + 16)).join('') + chl(x0 + 14, top + 60, 14, 7, true) + chl(x0 + W - 14, top + 60, 14, 7, true) +
      (bottom ? [-36, 36].map(dx => chl(c + dx, top + mH - 16)).join('') : '');
  };
  /** Bundle sheath with organelles on the vein side (bottom wall). */
  const inward = (i: number, nChl: number, big = 1): string => {
    const c = cx(i), step = 150 / nChl;
    let s = '';
    for (let k = 0; k < nChl; k++) s += chl(c - 75 + step * (k + 0.5), bsY + bsH - 38, 13 * big, 8 * big);
    for (let k = 0; k < nChl - 1; k++) s += mit(c - 75 + step * (k + 1), bsY + bsH - 14, 9, 5.5);
    return s;
  };
  return svg(p, 'Four leaf types compared: in C₃ CO₂ is released in every cell; proto-Kranz has more bundle-sheath organelles on the vein side; in C₂ glycine is split mainly in the bundle sheath; in C₄ C₄ acids carry CO₂ into the bundle sheath',
    `<g transform="translate(0 30)">
    ${col(0, 'C₃', '', `${mChl(0)}${mit(cx(0) - 22, top + 70)}${co2(cx(0) + 12, top + 70)}${mit(cx(0) + 32, top + 96)}`,
      `${chl(cx(0) - 46, bsY + 34)}${chl(cx(0) + 48, bsY + 90)}${mit(cx(0) - 6, bsY + 56)}${co2(cx(0) + 30, bsY + 56)}`,
      ['CO₂ released', 'in every cell'])}
    ${col(1, 'proto-Kranz', 'a C₃ type', `${mChl(1)}${mit(cx(1) - 22, top + 70)}${co2(cx(1) + 12, top + 70)}${mit(cx(1) + 32, top + 96)}`,
      `${inward(1, 4)}${co2(cx(1), bsY + 40)}`,
      ['more organelles', 'on the vein side'])}
    ${col(2, 'C₂', '', `${mChl(2, false)}${mit(cx(2) - 34, top + 66, 10, 6, true)}${mit(cx(2) + 34, top + 66, 10, 6, true)}
        ${arrow(p, 'clay', `M${cx(2)},${top + 48} L${cx(2)},${bsY + 26}`, 'dashed')}${t(cx(2) - 8, top + 108, 'glycine', 'fc06-n', 'end')}`,
      `${inward(2, 5)}${co2(cx(2) - 34, bsY + 40)}`,
      ['glycine split', 'mainly in sheath'])}
    ${col(3, 'C₄', '', `${mChl(3, false)}${t(cx(3), top + 62, 'PEPC', 'fc06-in')}
        ${arrow(p, 'ink', `M${cx(3)},${top + 74} L${cx(3)},${bsY + 22}`)}${t(cx(3) - 8, top + 108, 'C₄ acid', 'fc06-n', 'end')}`,
      `${inward(3, 5, 1.25)}${chl(cx(3) - 50, bsY + 34, 16, 10)}${chl(cx(3) + 50, bsY + 34, 16, 10)}${co2(cx(3), bsY + 40)}`,
      ['C₄ acids carry', 'CO₂ inwards'])}
    <path class="rule" d="M12,478 H788"/>
    ${chl(36, 508)}${t(58, 514, 'chloroplast', 'fc06-n', 'start')}
    ${mit(196, 508)}${t(214, 514, 'mitochondrion', 'fc06-n', 'start')}
    ${mit(364, 508, 10, 6, true)}${t(382, 514, 'no glycine split', 'fc06-n', 'start')}
    ${co2(544, 508)}${t(564, 514, 'CO₂ released', 'fc06-n', 'start')}
    ${t(788, 514, 'schematic', 'fc06-n', 'end')}
    ${t(400, 550, 'each column, top to bottom: mesophyll · bundle sheath · vein', 'fc06-n')}</g>`);
}

/* ---------- B · one cell: some released CO₂ is caught, the rest leaves ---------- */

function leakCatch(): string {
  const p = 'fc07b';
  const X0 = 60, X1 = 740, x = (pc: number): number => X0 + (pc / 100) * (X1 - X0);
  const head = (d: string): string => `<path class="fc07-ray fc07-ray-in" d="${d}" marker-end="url(#${p}-clay)"/>`;
  return svg(p, 'A C₃ leaf cell: mitochondria release CO₂ from photorespiration and respiration; chloroplasts refix some of it (24–38 % in rice and wheat), the rest leaves the cell',
    `${cell(30, 40, 500, 370, 'm', 30)}
    ${[100, 180, 260, 340, 420].map(cxx => chl(cxx, 62, 30, 13)).join('')}
    ${[120, 220, 380, 460].map(cxx => chl(cxx, 388, 30, 13)).join('')}
    ${chl(52, 150, 30, 13, true)}${chl(52, 300, 30, 13, true)}${chl(508, 140, 30, 13, true)}${chl(508, 320, 30, 13, true)}
    ${mitochondrion(230, 210, 44, 26, 4)}${mitochondrion(340, 262, 44, 26, 4)}
    ${t(250, 312, 'mitochondria', 'fc06-b fc06-mit-t')}

    ${head('M222,184 C214,140 204,110 184,82')}${co2(206, 140)}
    ${head('M196,206 C150,196 100,170 72,156')}${co2(132, 186)}
    ${head('M370,240 C420,214 460,180 492,152')}${co2(440, 200)}
    ${head('M330,288 C346,322 362,350 372,372')}${co2(354, 334)}
    ${lost(p, 'M384,262 C450,262 530,262 598,298')}${co2(468, 264)}
    ${lost(p, 'M204,232 C160,290 100,380 24,454')}${co2(140, 324)}
    ${lost(p, 'M262,192 C290,150 304,80 300,18')}${co2(294, 112)}

    <path class="fc07-ray fc07-ray-in" d="M560,152 H600" marker-end="url(#${p}-clay)"/>${t(612, 160, 'refixed in', 'fc06-s', 'start')}${t(612, 186, 'a chloroplast', 'fc06-s', 'start')}
    ${t(612, 288, 'leaves', 'fc06-s', 'start')}${t(612, 314, 'the cell', 'fc06-s', 'start')}

    <path class="rule" d="M20,468 H780"/>
    ${t(X0, 500, 'all CO₂ released by mitochondria (rice, wheat)', 'fc06-s', 'start')}
    <rect class="fc07-bar-out" x="${X0}" y="514" width="${X1 - X0}" height="30" rx="6"/>
    <rect class="fc07-bar-in" x="${X0}" y="514" width="${n1(x(24) - X0)}" height="30" rx="6"/>
    <rect class="fc07-bar-range" x="${n1(x(24))}" y="514" width="${n1(x(38) - x(24))}" height="30"/>
    ${t(X0, 572, 'refixed in the cell', 'fc06-b', 'start')}${t(X1, 572, 'leaves the cell', 'fc06-s', 'end')}
    ${t(X1, 596, 'Busch et al. 2013', 'fc06-n', 'end')}`);
}

/* ---------- C · C₃ sheath vs proto-Kranz sheath ---------- */

function inwardShift(): string {
  const p = 'fc07c';
  const panel = (x0: number, head: string, body: string, cap: string): string =>
    `${t(x0 + 185, 34, head, 'fc06-h')}
     ${cell(x0 + 20, 54, 330, 80, 'm')}${t(x0 + 185, 100, 'mesophyll', 'fc07-ct')}
     ${cell(x0 + 20, 146, 330, 252, 'bs')}${t(x0 + 185, 172, 'bundle sheath', 'fc07-ct')}
     ${veinBand(x0 + 20, 410, 330, 48, 'vein')}
     ${body}${t(x0 + 185, 494, cap, 'fc06-b')}`;
  const c3 = `${chl(222, 262, 18, 9)}${chl(300, 270, 18, 9)}${chl(196, 344, 18, 9)}
    ${mit(150, 300, 13, 8)}${mit(286, 206, 13, 8)}
    ${lost(p, 'M146,290 C140,240 114,190 98,152')}${co2(134, 246)}
    ${lost(p, 'M290,196 C296,180 300,160 304,140')}
    ${caught('M164,308 C176,320 184,330 190,336')}`;
  const pk = (x0: number): string => {
    let s = '';
    for (let k = 0; k < 6; k++) s += chl(x0 + 56 + k * 52, 318, 24, 13);
    for (let k = 0; k < 5; k++) s += mit(x0 + 82 + k * 52, 368, 14, 8);
    for (let k = 0; k < 5; k++) s += caught(`M${x0 + 82 + k * 52},${358} L${x0 + 70 + k * 52 + (k % 2 ? 24 : 0)},${334}`);
    return s + co2(x0 + 186, 272) + `<path class="fc07-lead" d="M${x0 + 186},284 L${x0 + 186},300"/>` +
      chl(x0 + 56, 204, 18, 9) + t(x0 + 82, 210, 'chloroplast', 'fc06-n', 'start') + mit(x0 + 56, 236, 13, 8) + t(x0 + 82, 242, 'mitochondrion', 'fc06-n', 'start');
  };
  return svg(p, 'Bundle-sheath cells compared: in C₃ few small organelles are scattered; in proto-Kranz Flaveria more, larger organelles sit on the vein side, so released CO₂ passes chloroplasts first',
    `<g transform="translate(0 16)">${panel(0, 'C₃', c3, 'few, small, scattered')}
    ${panel(420, 'proto-Kranz', pk(420), 'more, larger, on the vein side')}
    <path class="rule" d="M20,524 H780"/>
    ${t(400, 558, 'Refixation is plausible, not yet shown', 'fc06-s')}</g>`);
}

/* ---------- D · analogy: buckets under a leak ---------- */

function buckets(): string {
  const p = 'fc07d';
  const drop = (x: number, y: number): string => `<path class="fc07-drop" d="M${x},${y - 9} C${x + 6},${y - 1} ${x + 6},${y + 6} ${x},${y + 6} C${x - 6},${y + 6} ${x - 6},${y - 1} ${x},${y - 9} Z"/>`;
  const fall = (x: number, y0: number, y1: number): string => [0, 1, 2].map(k => drop(x, y0 + ((y1 - y0) * (k + 0.5)) / 3)).join('');
  const bucket = (x: number, y: number, w = 50): string =>
    `<path class="fc07-bucket" d="M${x - w / 2},${y - 34} H${x + w / 2} L${x + w / 2 - 8},${y} H${x - w / 2 + 8} Z"/>`;
  const pipe = (x0: number, x1: number, y: number): string => `<rect class="fc07-pipe" x="${x0}" y="${y - 8}" width="${x1 - x0}" height="16" rx="8"/>`;
  const drain = (x: number, y: number): string => `<rect class="fc07-drain" x="${x - 24}" y="${y - 5}" width="48" height="10" rx="3"/>${arrow(p, 'ink', `M${x},${y + 6} L${x},${y + 30}`)}`;
  const fl = 372;
  // room 1: four leaks along the pipe, two buckets placed by chance
  const r1 = `<rect class="fc07-room" x="12" y="48" width="370" height="330" rx="10"/>${pipe(30, 364, 80)}
    ${[70, 150, 230, 310].map(x => fall(x, 98, fl - 40)).join('')}
    ${bucket(150, fl)}${bucket(352, fl, 40)}${drain(70, fl + 4)}${drain(230, fl + 4)}${drain(310, fl + 4)}`;
  // room 2: the same four leaks moved into a small inner room lined with buckets
  const r2 = `<rect class="fc07-room" x="418" y="48" width="370" height="330" rx="10"/>
    <rect class="fc07-inner" x="470" y="120" width="266" height="256" rx="8"/>${pipe(486, 720, 150)}
    ${[520, 578, 636, 694].map(x => fall(x, 168, fl - 40)).join('')}
    ${bucket(520, fl, 48)}${bucket(578, fl, 48)}${bucket(694, fl, 48)}${drain(636, fl + 4)}`;
  return svg(p, 'Analogy: drips from a leaking pipe (CO₂ released by mitochondria) fall into buckets (chloroplasts with Rubisco) or into the drain (CO₂ leaving the cell). Moving the leaks into a small room lined with buckets (the bundle sheath) catches more',
    `<g transform="translate(0 14)">${t(197, 32, 'C₃: leaks in every cell', 'fc06-h')}${t(603, 32, 'C₂: leaks in the sheath', 'fc06-h')}
    ${r1}${r2}
    ${t(197, 440, 'some caught', 'fc06-b')}${t(603, 440, 'more caught', 'fc06-b')}
    <path class="rule" d="M12,462 H788"/>
    ${t(30, 498, 'drip', 'fc06-it', 'start')}${t(112, 498, 'CO₂ from mitochondria', 'fc06-b', 'start')}
    ${t(430, 498, 'bucket', 'fc06-it', 'start')}${t(552, 498, 'chloroplast', 'fc06-b', 'start')}
    ${t(30, 532, 'drain', 'fc06-it', 'start')}${t(112, 532, 'CO₂ leaving the cell', 'fc06-b', 'start')}
    ${t(430, 532, 'small room', 'fc06-it', 'start')}${t(552, 532, 'bundle sheath', 'fc06-b', 'start')}
    ${t(780, 566, 'counts illustrative', 'fc06-n', 'end')}</g>`);
}

/* ---------- E · a branching tree, not a ladder ---------- */

function tree(): string {
  const p = 'fc07e';
  type St = 'c3' | 'c2' | 'c4';
  const vbr = (x: number, y0: number, y1: number, st: St): string => `<path class="fc07-br fc07-br-${st}" d="M${n1(x)},${y0} V${y1}"/>`;
  const hbr = (x0: number, x1: number, y: number, st: St): string => `<path class="fc07-br fc07-br-${st}" d="M${n1(x0)},${y} H${n1(x1)}"/>`;
  const star = (x: number, y: number): string => {
    const pts = Array.from({ length: 10 }, (_, k) => {
      const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 6 : 14;
      return `${n1(x + r * Math.cos(a))},${n1(y + r * Math.sin(a))}`;
    }).join(' ');
    return `<polygon class="fc07-star" points="${pts}"/>`;
  };
  const T = { a: 300, b: 370, c: 450, d: 530, e: 610, f: 690, g: 760 }, yTip = 170;
  const nCD = (T.c + T.d) / 2, nCDE = (nCD + T.e) / 2, nFG = (T.f + T.g) / 2, nR = (nCDE + nFG) / 2, nAB = (T.a + T.b) / 2, root = (nAB + nR) / 2;
  const tip = (x: number, s: string, cls = 'fc06-b'): string => t(x, yTip - 16, s, cls);
  return svg(p, 'A schematic tree instead of a ladder: some lineages stay C₃, C₂ lineages persist, and C₄ arose separately more than once; living species are cousins, not ancestors',
    `${t(110, 34, 'the ladder picture', 'fc06-h')}
    <path class="fc07-rail" d="M66,90 V440 M154,90 V440"/>
    ${([[130, 'C₄'], [270, 'C₂'], [410, 'C₃']] as Array<[number, string]>).map(([y, s]) => `<path class="fc07-rail" d="M66,${y} H154"/>${t(110, y - 12, s, 'fc06-b')}`).join('')}
    ${t(110, 490, 'too simple', 'fc06-b fc06-pr')}
    <path class="rule" d="M236,20 V500"/>

    ${t(530, 34, 'what phylogenies show', 'fc06-h')}
    ${tip(T.a, 'C₃')}${tip(T.b, 'C₃')}${tip(T.c, 'C₂')}${tip(T.d, 'C₄')}${t(T.e, yTip - 39, 'proto-', 'fc06-s')}${tip(T.e, 'Kranz', 'fc06-s')}${tip(T.f, 'C₂')}${tip(T.g, 'C₄')}
    ${vbr(T.a, yTip, 420, 'c3')}${vbr(T.b, yTip, 420, 'c3')}${hbr(T.a, T.b, 420, 'c3')}
    ${vbr(T.c, yTip, 280, 'c2')}${vbr(T.d, yTip, 230, 'c4')}${vbr(T.d, 230, 280, 'c2')}${hbr(T.c, T.d, 280, 'c2')}
    ${vbr(nCD, 280, 340, 'c2')}${vbr(T.e, yTip, 340, 'c3')}${hbr(nCD, T.e, 340, 'c3')}
    ${vbr(T.f, yTip, 310, 'c2')}${vbr(T.g, yTip, 260, 'c4')}${vbr(T.g, 260, 310, 'c2')}${hbr(T.f, T.g, 310, 'c2')}
    ${vbr(nCDE, 340, 390, 'c3')}${vbr(nFG, 310, 360, 'c2')}${vbr(nFG, 360, 390, 'c3')}${hbr(nCDE, nFG, 390, 'c3')}
    ${vbr(nR, 390, 450, 'c3')}${vbr(nAB, 420, 450, 'c3')}${hbr(nAB, nR, 450, 'c3')}${vbr(root, 450, 486, 'c3')}
    ${star(T.d, 230)}${star(T.g, 260)}
    <path class="fc07-lead" d="M${T.c},${yTip - 42} C${T.c},${yTip - 84} ${T.f},${yTip - 84} ${T.f},${yTip - 42}"/>
    ${t((T.c + T.f) / 2, yTip - 88, 'C₂ persists', 'fc06-b fc06-pr')}

    ${hbr(296, 332, 532, 'c3')}${t(340, 539, 'C₃', 'fc06-s', 'start')}
    ${hbr(404, 440, 532, 'c2')}${t(448, 539, 'C₂', 'fc06-s', 'start')}
    ${hbr(512, 548, 532, 'c4')}${t(556, 539, 'C₄', 'fc06-s', 'start')}
    ${star(626, 532)}${t(646, 539, 'C₄ origin', 'fc06-s', 'start')}
    ${t(400, 580, 'Living species are cousins, not ancestors', 'fc06-b')}${t(788, 580, 'schematic', 'fc06-n', 'end')}`);
}

/* ---------- F · evidence: grass C₄ needed anatomy first ---------- */

function grasses(): string {
  const p = 'fc07f';
  /** A grass leaf in cross-section: veins with bundle-sheath rings, mesophyll cells between. */
  const section = (x0: number, y: number, w: number, nV: number, rv: number, rb: number, nM: number): string => {
    let s = `<rect class="fc07-blade" x="${x0}" y="${y - 52}" width="${w}" height="104" rx="42"/>`;
    const gap = w / nV;
    for (let i = 0; i < nV; i++) s += wreath(x0 + gap * (i + 0.5), y, rv, rb, 8, true);
    // mesophyll cells between neighbouring veins, in columns of three
    for (let i = 1; i < nV; i++) {
      const mx = x0 + gap * i;
      const cols = nM === 1 ? [0] : Array.from({ length: nM }, (_, k) => (k - (nM - 1) / 2) * 22);
      for (const dx of cols) for (const dy of [-24, 0, 24]) s += `<circle class="fc07-cell fc07-cell-m" cx="${n1(mx + dx)}" cy="${y + dy}" r="10"/>`;
    }
    return s;
  };
  const col = (x0: number, head: string, eg: string, sec: string, cap: string[], n: string): string =>
    `${t(x0 + 185, 70, head, 'fc06-h')}${t(x0 + 185, 98, eg, 'fc06-n')}
     ${sec}
     ${cap.map((s, k) => t(x0 + 185, 304 + k * 28, s, 'fc06-s')).join('')}
     ${t(x0 + 185, 412, 'C₄ origins', 'fc06-s')}${t(x0 + 185, 466, n, 'fc07-big')}`;
  return svg(p, 'Evidence from grasses: veins moved closer before the two clades split; the BEP clade, which includes rice, then evolved small bundle-sheath cells and has no C₄ origins; the PACMAD clade kept large bundle-sheath cells, more than 15 % of the leaf, and has 22 to 24 C₄ origins',
    `${col(10, 'BEP grasses', 'includes rice', section(20, 200, 350, 3, 9, 6, 3), ['close veins,', 'small bundle-sheath cells'], '0')}
    ${col(420, 'PACMAD grasses', 'includes maize', section(430, 200, 350, 3, 9, 11, 3), ['close veins, large bundle-', 'sheath cells (> 15 % of leaf)'], '22–24')}
    <path class="rule" d="M400,44 V484"/>
    ${t(400, 556, 'Christin et al. 2013; cross-sections schematic', 'fc06-n')}`);
}

/* ---------- G · zoom from leaf to one bundle-sheath cell ---------- */

function zoom(): string {
  const p = 'fc07g';
  const leaf = `<path class="fc07-leaf" d="M40,170 C70,90 160,60 230,70 C220,140 150,200 40,170 Z"/>
    <path class="fc07-midrib" d="M44,168 C100,140 170,100 228,72"/><path class="fc07-cut" d="M118,98 L150,168"/>`;
  const sx0 = 290, sx1 = 780, sy = 140;
  let strip = `<rect class="fc07-blade" x="${sx0}" y="${sy - 56}" width="${sx1 - sx0}" height="112" rx="44"/>`;
  [370, 535, 700].forEach(vx => { strip += wreath(vx, sy, 12, 13, 9, true); });
  [450, 615].forEach(mx => { for (const [dx, dy] of [[-18, -26], [18, -26], [-18, 0], [18, 0], [-18, 26], [18, 26]]) strip += `<circle class="fc07-cell fc07-cell-m" cx="${mx + dx}" cy="${sy + dy}" r="11"/>`; });
  const chX = [100, 162, 224, 286, 348], miX = [131, 193, 255, 317];
  return svg(p, 'Zoom from a leaf to its cross-section, to one vein wrapped in a ring of bundle-sheath cells, to one bundle-sheath cell whose organelles sit on the vein side and catch released CO₂',
    `<g transform="translate(0 -12)">${leaf}${t(130, 214, 'leaf', 'fc06-b')}
    ${strip}${t(535, 66, 'leaf cross-section', 'fc06-s')}
    <path class="fc07-zoom" d="M150,168 L${sx0},${sy + 56} M118,98 L${sx0},${sy - 56}"/>
    <rect class="fc07-zoombox" x="${700 - 44}" y="${sy - 44}" width="88" height="88" rx="8"/>
    <path class="fc07-zoom" d="M${700 - 44},${sy + 44} L470,262 M${700 + 44},${sy + 44} L780,262"/>

    <rect class="fc07-panel" x="470" y="262" width="310" height="320" rx="16"/>
    <path class="fc07-zoom" d="M${625 - 38},327 L420,300 M${625 - 38},399 L420,560"/>
    ${t(625, 296, 'bundle sheath', 'fc06-b')}
    ${wreath(625, 434, 36, 34, 8, true, false)}${t(625, 440, 'vein', 'fc07-vt')}
    <rect class="fc07-zoombox" x="${625 - 38}" y="327" width="76" height="72" rx="8"/>

    <rect class="fc07-panel" x="20" y="262" width="400" height="320" rx="16"/>
    ${t(220, 296, 'one sheath cell', 'fc06-b')}
    ${cell(50, 314, 340, 206, 'bs', 24)}${veinBand(50, 530, 340, 36, 'vein side')}
    ${chX.map(x => chl(x, 440, 26, 14)).join('')}
    ${miX.map(x => mit(x, 500, 15, 9)).join('')}
    ${miX.map((x, k) => caught(`M${x},${490} L${x + (k % 2 ? 14 : -14)},${456}`)).join('')}
    ${co2(193, 474)}${co2(317, 474)}
    ${t(220, 376, 'CO₂ meets chloroplasts first', 'fc06-s')}</g>`);
}

/* ---------- H · the geometry of recapture ---------- */

function catchAngle(): string {
  const p = 'fc07h';
  const R = 118, rC = 74, n = 12;
  const disc = (cx: number, cy: number, at: number[], cap: string[]): string => {
    let s = `<circle class="fc07-reach" cx="${cx}" cy="${cy}" r="${R}"/>`;
    const hit = (deg: number): boolean => at.some(a => Math.abs(((deg - a + 540) % 360) - 180) < 10);
    for (let k = 0; k < n; k++) {
      const deg = (k * 360) / n - 90, a = (deg * Math.PI) / 180;
      const x0 = cx + Math.cos(a) * 24, y0 = cy + Math.sin(a) * 24;
      if (hit(deg)) {
        const x1 = cx + Math.cos(a) * (rC - 10), y1 = cy + Math.sin(a) * (rC - 10);
        s += caught(`M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`);
      } else {
        const x1 = cx + Math.cos(a) * (R + 4), y1 = cy + Math.sin(a) * (R + 4);
        s += lost(p, `M${n1(x0)},${n1(y0)} L${n1(x1)},${n1(y1)}`);
      }
    }
    for (const a of at) {
      const r = (a * Math.PI) / 180, x = cx + Math.cos(r) * rC, y = cy + Math.sin(r) * rC;
      s += `<g transform="rotate(${a + 90} ${n1(x)} ${n1(y)})">${chloroplast(+n1(x), +n1(y), 17, 9)}</g>`;
    }
    s += mitochondrion(cx, cy, 20, 13, 2);
    return s + cap.map((c, k) => t(cx, cy + R + 42 + k * 28, c, k ? 'fc06-s' : 'fc06-b')).join('');
  };
  const kx = 196;
  return svg(p, 'Schematic geometry: CO₂ leaves a mitochondrion in all directions; the more of its escape paths are covered by chloroplasts, the more can be refixed',
    `${disc(140, 178, [-90], ['one chloroplast', 'nearby'])}
    ${disc(400, 178, [-150, -120, -90, -60, -30], ['several,', 'on one side'])}
    ${disc(660, 178, [-150, -120, -90, -60, -30, 30, 60, 120, 150], ['many,', 'all around'])}
    <path class="rule" d="M20,398 H780"/>
    ${mitochondrion(kx + 22, 428, 20, 12, 2)}${t(kx + 56, 435, 'mitochondrion releasing CO₂', 'fc06-s', 'start')}
    <path class="fc07-ray fc07-ray-in" d="M${kx},464 H${kx + 44}"/>${t(kx + 56, 471, 'reaches a chloroplast: can be refixed', 'fc06-s', 'start')}
    ${lost(p, `M${kx},500 H${kx + 44}`)}${t(kx + 56, 507, 'misses: can leave the cell', 'fc06-s', 'start')}
    ${t(400, 552, 'More paths covered, more CO₂ refixed', 'fc06-b')}
    ${t(400, 580, 'schematic, not to scale', 'fc06-n')}`);
}

/* ---------- I · thesis-style hero: the C₂ glycine shuttle ---------- */

function shuttle(): string {
  const p = 'fc07i';
  return svg(p, 'C₂ photosynthesis in thesis style: glycine made in the mesophyll moves to the bundle sheath, where only the sheath mitochondria split it; the CO₂ released there is refixed by Rubisco in nearby chloroplasts',
    `<g transform="translate(0 30)">${t(196, 36, 'mesophyll cell', 'fc06-b')}${t(548, 36, 'bundle-sheath cell', 'fc06-b')}${t(755, 36, 'vein', 'fc06-b')}
    ${cell(20, 54, 352, 420, 'm', 26)}${cell(388, 54, 320, 420, 'bs', 26)}${veinBand(722, 54, 66, 420)}

    ${chloroplast(170, 150, 128, 72)}${molecule(74, 130, 'OO', 11)}${rubisco(160, 130, 110, 36)}
    ${chain(160, 184, 2, true)}${t(212, 192, '2-PG', 'fc06-b fc06-pr', 'start')}
    ${peroxisome(276, 300, 46, false)}${t(222, 306, 'peroxisome', 'fc06-n', 'end')}
    ${arrow(p, 'clay', 'M222,206 C250,230 266,244 272,256', 'dashed')}
    ${mitochondrion(110, 390, 66, 40, 4, false, true)}${t(110, 452, 'no glycine split', 'fc06-n')}

    ${chain(276, 300, 2, true, 7, 17)}
    ${arrow(p, 'clay', 'M324,300 L524,300', 'dashed')}${chain(424, 278, 2, true)}${chain(476, 278, 2, true)}${t(450, 254, 'glycine', 'fc06-b fc06-pr')}

    ${mitochondrion(610, 300, 66, 42, 5)}${t(626, 374, 'split here', 'fc06-n', 'start')}
    ${chloroplast(530, 156, 112, 64)}${pent(472, 158, 32, 'RuBP')}${rubisco(570, 156, 100, 34)}
    ${molecule(612, 226, 'OCO', 11)}${arrow(p, 'clay', 'M612,258 L612,242')}${arrow(p, 'clay', 'M592,216 L582,180')}
    ${t(642, 222, 'CO₂', 'fc06-b fc06-pr', 'start')}${t(642, 244, 'refixed', 'fc06-n', 'start')}

    <path class="ar ar-clay dashed" d="M604,344 C602,404 580,440 520,440 L300,440 C284,440 276,430 276,356" marker-end="url(#${p}-clay)"/>
    ${chain(486, 440, 3, true)}${t(486, 422, 'serine returns', 'fc06-s')}</g>
    ${t(400, 558, '2-PG: 2-phosphoglycolate · C₂ photosynthesis: next slide', 'fc06-n')}`);
}

/* ---------- J · minimal: released, recaptured, rearranged ---------- */

function icons(): string {
  const p = 'fc07j';
  return svg(p, 'Minimal summary: mitochondria release CO₂; Rubisco nearby refixes some; bundle-sheath organelles moving to the vein side is an early step on some routes to C₄',
    `<g transform="translate(0 38)">${mitochondrion(140, 220, 70, 44, 5)}${molecule(196, 140, 'OCO', 11)}${molecule(232, 186, 'OCO', 11)}
    ${arrow(p, 'clay', 'M176,184 L186,164')}${arrow(p, 'clay', 'M208,206 L216,196')}
    ${t(140, 330, 'released', 'fc06-h')}${t(140, 362, 'CO₂ from', 'fc06-s')}${t(140, 388, 'mitochondria', 'fc06-s')}

    ${arrow(p, 'ink', 'M262,220 L300,220')}
    ${chloroplast(410, 220, 82, 52)}${rubisco(410, 220, 108, 36)}${molecule(342, 166, 'OCO', 11)}${arrow(p, 'clay', 'M356,180 L372,198')}
    ${t(410, 330, 'recaptured', 'fc06-h')}${t(410, 362, 'Rubisco nearby', 'fc06-s')}${t(410, 388, 'refixes some', 'fc06-s')}

    ${arrow(p, 'ink', 'M512,220 L550,220')}
    ${cell(574, 150, 172, 116, 'bs', 16)}${veinBand(574, 274, 172, 26)}
    ${[600, 643, 686, 728].map(x => chl(x, 236, 18, 10)).join('')}${[621, 664, 707].map(x => mit(x, 258, 11, 6)).join('')}
    ${t(660, 330, 'rearranged', 'fc06-h')}${t(660, 362, 'sheath organelles', 'fc06-s')}${t(660, 388, 'sit by the vein', 'fc06-s')}</g>`);
}
