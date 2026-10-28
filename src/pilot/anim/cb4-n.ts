// C4 · Sucrose and starch (beats CB4V2, beats-cb4n.ts), staging d · "Leaf to grain, day and night" (lecturer, 29 Oct 2026,
// evening; research/redo-2026-10-29/C4_ANIM_V2_BRIEF.md). One still framing for all five beats: a wheat leaf cell drawn
// in the 'cell' look of figs/cell-schema.ts (cell wall, plasma membrane, cytosol, a chloroplast with its two envelope
// bilayers, grana and TPT at half the chain's scale), the phloem and a growing grain; a round inset on TPT at the
// strip's scale. Flows in the cell are arrows; molecules are drawn only in the inset and at RuBisCO, where each is exact.
// - Beat 1, export: the inset opens on TPT (inner envelope): 1 triose phosphate goes out as 1 Pᵢ comes in; they cross at
//   TPT at the same moment.
// - Beat 2, sucrose: in the cell, triose phosphate → sucrose in the cytosol → phloem → grain (which grows); then the
//   freed Pᵢ back to TPT. In the inset each further triose phosphate out crosses 1 Pᵢ in.
// - Beat 3, TPU: the sucrose flow slows, the Pᵢ return fades; in the inset the last Pᵢ in goes to ADP + Pᵢ → ATP, none
//   follows, its place empties and ATP dims; then the grana and the export dim.
// - Beat 4, starch by day, sucrose at night: the inset closes, the sky band shows day; part of the triose phosphate goes
//   to the starch granule, which grows; Streb & Zeeman 2012 Fig. 4C (end of the day). Night: the export dims, the granule
//   shrinks, its sugars leave the chloroplast (not through TPT) to make sucrose, which still flows to the grain; Fig. 4G
//   (end of the night).
// - Beat 5, sunlight in sugar: day again; sunlight on the grana; CO₂ and RuBP come to RuBisCO in the stroma.
import './cb4-n.css';
import tptPng from '../../assets/cell/tpt.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import strebJpg from '../../assets/photos/c4-streb.jpg';
import { row } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { attrSetter, curve, ease, f, glide, lerp, lerpV, moverSvg, placer, tAt, type Mover, type Path, type Put, type V } from './dk2-common';
import type { Staging } from './types';
import { withKeys } from './stage-keys-cb';

const P = 'cb4n';
/** Beat lengths (s): 33.5 s in all. */
const D = [5.5, 7.5, 6.0, 10.0, 4.5];
const E = ease;

/* ---------------------------------------------------------------- where (stage units, 1600 × 740) */

const CELL = { x0: 24, y0: 64, x1: 860, y1: 712, wall: 18, r: 46 };
const CH = { cx: 330, cy: 420, rx: 262, ry: 196, gap: 20 };
/** TPT on the inner envelope, at the chloroplast's right end (membrane vertical there). */
const TPT_M: V = [CH.cx + CH.rx - CH.gap, CH.cy];
const RING = 40;
/** Grana (centres) and the stroma spots. */
const GRANA: V[] = [[175, 390], [250, 505]];
const TP0: V = [470, 414];
const SUC: V = [742, 300];
const STARCH: V = [420, 512];
const RUB: V = [340, 372];
/** The phloem: a sieve tube from the cell to the grain's base. */
const PH = { x0: 852, x1: 1300, y: 150, h: 40 };
const GRAIN0: V = [PH.x1, PH.y];

/** The inset: centre, radius, scale (k of the strip), bilayers' centre lines, the two lanes through TPT. */
const IC: V = [1170, 420], IR = 210, K = 0.9;
const XI = IC[0] + 34, XO = XI + 58 * K, HB = 19 * K;
const YT = IC[1] - 18, YP = IC[1] + 20;
const TP_IN: V = [IC[0] - IR - 40, YT], TP_PARK: V = [IC[0] + 158, YT], TP_OUT: V = [IC[0] + IR + 60, YT];
const PI_IN: V = [IC[0] + IR + 30, YP], PI_PARK: V = [IC[0] - 112, YP], PI_OUT: V = [IC[0] - IR - 40, YP];
/** ADP + Pᵢ → ATP in the inset's stroma (beat 3): the row's centre is the Pᵢ's place. */
const ROW: V = [IC[0] - 84, IC[1] + 96];

/** TEM panels (beat 4): Streb & Zeeman 2012 Fig. 4 C and G, below their letters (figs/cb04.ts WIN_C, WIN_G). */
const STREB = { w: 394, h: 323 };
const WIN_C = [0, 46, 195, 277], WIN_G = [200, 46, 194, 277];
const CR_STREB = 'Streb & Zeeman 2012, The Arabidopsis Book 10:e0160, Fig. 4 C, G · © ASPB';
const TW = 224, TH = 277 * (224 / 195), TX = [938, 1178], TY = 266;

/* ---------------------------------------------------------------- drawing kit */

const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const PXU = 0.95 / 2.4;
/** TPT, our render (scripts/cell_render.mjs, PDB 5Y78) centred on its membrane line at c, at scale k of the strip. */
function tptImg(c: V, k: number): string {
  const s = PXU * k, w = 159 * s, h = 263 * s;
  return `<image class="cel-p" href="${tptPng}" x="${f(c[0] - 83.7 * s)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
}
/** RuBisCO, our render (PDB 8RUC), centred on c, at scale k of the strip. */
function rubImg(c: V, k: number): string {
  const s = (0.95 / 4) * k, w = 548 * s, h = 471 * s;
  return `<image class="cel-p" href="${rubPng}" x="${f(c[0] - w / 2)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
}
const ellSeg = (cx: number, cy: number, rx: number, ry: number) => [{ A: [cx, cy, rx, ry, -90, 270] as [number, number, number, number, number, number] }];
/** A rounded rectangle as bilayer segments. */
function rrSeg(x0: number, y0: number, x1: number, y1: number, r: number) {
  type S = { L: [number, number, number, number] } | { A: [number, number, number, number, number, number] };
  const s: S[] = [
    { L: [x0 + r, y0, x1 - r, y0] }, { A: [x1 - r, y0 + r, r, r, -90, 0] }, { L: [x1, y0 + r, x1, y1 - r] }, { A: [x1 - r, y1 - r, r, r, 0, 90] },
    { L: [x1 - r, y1, x0 + r, y1] }, { A: [x0 + r, y1 - r, r, r, 90, 180] }, { L: [x0, y1 - r, x0, y0 + r] }, { A: [x0 + r, y0 + r, r, r, 180, 270] },
  ];
  return s;
}
/** A thin bilayer at the 'cell' look's half scale (cell-schema bil2). */
const bil2 = (segs: Parameters<typeof bilayer>[0]): string => bilayer(segs, 9.5, 1.7, 4.2);
/** A granum: four thylakoid discs (cell-schema cellPano). */
function granum(c: V): string {
  return [0, 1, 2, 3].map(k => {
    const y = c[1] - 39 + k * 26, x0 = c[0] - 45, x1 = c[0] + 45;
    const segs = [{ L: [x0, y - 3, x1, y - 3] as [number, number, number, number] }, { A: [x1, y + 0.5, 3.5, 3.5, -90, 90] as [number, number, number, number, number, number] },
      { L: [x1, y + 4, x0, y + 4] as [number, number, number, number] }, { A: [x0, y + 0.5, 3.5, 3.5, 90, 270] as [number, number, number, number, number, number] }];
    return `<rect class="cel-lumen" x="${f(x0 - 3.5)}" y="${f(y - 3)}" width="${f(x1 - x0 + 7)}" height="7" rx="3.5"/>${bilayer(segs, 7, 1.4, 3.6)}`;
  }).join('');
}

/* arrows (cell-schema arrow, with a draw-on): a smooth path through the points and a head at the last */
function smooth(q: V[]): string {
  let s = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    s += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return s;
}
function head(tip: V, dir: V, cls: string, hl: number, hw: number): string {
  const L = Math.hypot(dir[0], dir[1]), u: V = [dir[0] / L, dir[1] / L], n: V = [-u[1], u[0]];
  const b: V = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  return `<path class="${cls}" d="M${f(tip[0])},${f(tip[1])}L${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}Z"/>`;
}
type AK = 'c' | 'gas';
function arrowSvg(k: string, q: V[], kind: AK, o: { thin?: boolean; halo?: boolean; extra?: string } = {}): string {
  const thin = o.thin ?? false, hl = thin ? 11 : 13, hw = thin ? 6.5 : 7.5;
  const tip = q[q.length - 1], prev = q[q.length - 2], dir: V = [tip[0] - prev[0], tip[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const back: V = [tip[0] - (dir[0] / L) * hl * 0.75, tip[1] - (dir[1] / L) * hl * 0.75];
  const dd = smooth([...q.slice(0, -1), back]), dash = 'pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"';
  return `<g data-k="${P}-${k}" opacity="0">${o.halo ? `<path data-k="${P}-${k}-h" class="cbb-halo-l" d="${dd}" ${dash}/>` : ''}<path data-k="${P}-${k}-l" class="cbb-a cbb-a-${kind}${thin ? ' cbb-a-thin' : ''}" d="${dd}" ${dash}/>`
    + `<g data-k="${P}-${k}-hd" opacity="0">${head(tip, dir, `cbb-h-${kind}`, hl, hw)}</g>${o.extra ?? ''}</g>`;
}

/* ---------------------------------------------------------------- the arrows of the cell */

const AR: Record<string, { q: V[]; kind: AK; thin?: boolean }> = {
  // triose phosphate out through TPT (upper lane) to sucrose in the cytosol
  tp: { q: [TP0, [540, 413], [TPT_M[0], 413], [606, 408], [650, 382], [692, 340], [712, 318]], kind: 'c' },
  // sucrose out of the cell into the phloem, along it to the grain
  suc: { q: [[784, 292], [812, 240], [836, 184], [876, 154], [1100, PH.y], [GRAIN0[0] - 2, PH.y]], kind: 'c' },
  // the freed Pᵢ back to TPT (lower lane), round the right so as not to cross the export
  pi: { q: [[756, 318], [760, 370], [722, 414], [650, 428], [TPT_M[0], 428], [520, 429]], kind: 'gas', thin: true },
  // by day: part of the triose phosphate to the starch granule
  st: { q: [[TP0[0] - 4, TP0[1] + 12], [470, 452], [454, 478]], kind: 'c', thin: true },
  // at night: sugars from the granule out across the envelope (not through TPT) to sucrose
  nt: { q: [[STARCH[0] + 30, STARCH[1] - 4], [530, 506], [580, 490], [650, 462], [730, 400], [762, 322]], kind: 'c' },
};
const PI_TAG: V = [762, 372];

/* ---------------------------------------------------------------- the inset's moving molecules */

interface Gl { path: Path; t0: number; d: number }
const line = (a: V, b: V): Path => (u: number): V => lerpV(a, b, u);
/** A triose phosphate (from a to b) and a Pᵢ (from c to d) that cross TPT's membrane line at the same moment `at`. */
function pair(a: V, b: V, c: V, d: V, at: number, dur: number): { tp: Gl; pi: Gl } {
  const uT = (XI - a[0]) / (b[0] - a[0]), uP = (c[0] - XI) / (c[0] - d[0]);
  return { tp: { path: line(a, b), t0: at - tAt(uT, 0, dur), d: dur }, pi: { path: line(c, d), t0: at - tAt(uP, 0, dur), d: dur } };
}
const PA = pair(TP_IN, TP_PARK, PI_IN, PI_PARK, 3.0, 3.0);   // beat 1: the first pair, parked
const PB = pair(TP_IN, TP_OUT, PI_IN, PI_OUT, 4.9, 2.6);     // beat 2: passes through
const PC = pair(TP_IN, TP_PARK, PI_IN, PI_PARK, 6.3, 2.2);   // beat 2: parked
const at = (g: Gl, t: number): V => glide(g.path, t, g.t0, g.d);
const P_TO_ROW = curve([PI_PARK, [IC[0] - 96, IC[1] + 62], ROW]);
/** Beat 5 (cell scale): CO₂ in from the cytosol above, RuBP up from the stroma below, to RuBisCO's rim. */
const P_CO2 = curve([[220, 190], [236, 250], [256, 320], [RUB[0] - 68, RUB[1]]]);
const P_RUBP = curve([[RUB[0] + 34, RUB[1] + 82], [RUB[0], RUB[1] + 56]]);

const TP_G = row(0, 0, 'CCCP', { r: 10.5 });
const PI_G = tagG(0, 0, '', 'pi');
const MOV_I: Mover[] = ['A', 'B', 'C'].flatMap(k => [{ k: `${P}tp${k}`, svg: TP_G }, { k: `${P}pi${k}`, svg: PI_G }]);
const MOV_C: Mover[] = [
  { k: `${P}co2`, svg: balls(0, 0, 'OCO', 10), label: 'CO₂', at: [0, -20] },
  { k: `${P}rubp`, svg: row(0, 0, 'PCCCCCP', { r: 10 }), label: 'RuBP', at: [0, 32] },
];

/* ---------------------------------------------------------------- the markup */

function cellSvg(): string {
  const c = CELL, ri = c.r - c.wall;
  const fib = Array.from({ length: 22 }, (_, i) => `<path class="cb4n-wallf" d="M${f(c.x0 + 60 + i * 32)},${f(c.y0 + 6 + (i % 3) * 3)}q16,-4 32,0"/>`).join('');
  const wall = `<rect class="cb4n-wall" x="${c.x0}" y="${c.y0}" width="${c.x1 - c.x0}" height="${c.y1 - c.y0}" rx="${c.r}"/>${fib}
    <rect class="cb4n-cyto" x="${c.x0 + c.wall}" y="${c.y0 + c.wall}" width="${c.x1 - c.x0 - 2 * c.wall}" height="${c.y1 - c.y0 - 2 * c.wall}" rx="${ri}"/>`;
  const pm = bil2(rrSeg(c.x0 + c.wall + 9.5, c.y0 + c.wall + 9.5, c.x1 - c.wall - 9.5, c.y1 - c.wall - 9.5, ri - 6));
  const { cx, cy, rx, ry, gap } = CH;
  const chl = `<ellipse class="cel-stroma" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${bil2(ellSeg(cx, cy, rx, ry))}${bil2(ellSeg(cx, cy, rx - gap, ry - gap))}`;
  const grana = `<g data-k="${P}-grana">${GRANA.map(granum).join('')}</g>`;
  const labels = `${T(64, 662, 'wheat leaf cell', 'cel-zone', 'start')}${T(640, 120, 'cytosol', 'cel-zone')}${T(CH.cx + 20, 280, 'chloroplast', 'cel-zone')}`;
  return `${wall}${pm}${chl}${grana}${tptImg(TPT_M, 0.5)}${labels}`;
}
function granuleSvg(): string {
  return `<g data-k="${P}-gran" opacity="0" transform="translate(${STARCH[0]} ${STARCH[1]})"><ellipse class="cel-starch" rx="66" ry="32" vector-effect="non-scaling-stroke"/>${[0.75, 0.5, 0.26].map(q => `<ellipse class="cel-starchr" rx="${f(66 * q)}" ry="${f(32 * q)}" vector-effect="non-scaling-stroke"/>`).join('')}</g>`;
}
function phloemSvg(): string {
  const { x0, x1, y, h } = PH;
  const plates = [960, 1070, 1180].map(x => `<path class="cb4n-plate" d="M${x},${y - h / 2 + 2}V${y + h / 2 - 2}"/>`).join('');
  return `<g data-k="${P}-ph" opacity="0"><rect class="cb4n-sieve" x="${x0}" y="${y - h / 2}" width="${x1 - x0}" height="${h}" rx="8"/>${plates}
    ${T(1076, y - h / 2 - 12, 'phloem', 'cel-mn cel-halo')}</g>`;
}
function grainSvg(): string {
  const [x, y] = GRAIN0;
  return `<g data-k="${P}-grain" opacity="0" transform="translate(${x} ${y}) scale(0.7)">
      <ellipse class="cb4n-grain" cx="120" cy="0" rx="120" ry="74" vector-effect="non-scaling-stroke"/>
      <path class="cb4n-crease" d="M44,8C100,18 170,16 226,2" vector-effect="non-scaling-stroke"/>
      <ellipse class="cb4n-germ" cx="30" cy="26" rx="24" ry="20" vector-effect="non-scaling-stroke"/>
      <path class="cb4n-brush" d="M234,-10l16,-8M238,-2l18,-2M238,6l18,4M234,14l16,8" vector-effect="non-scaling-stroke"/></g>
    ${T(1420, 64, 'grain', 'cel-mn cel-halo', 'middle', `${P}-grainl`)}`;
}
/** The external tangents of the TPT ring and the inset (the magnifier's lines). */
function cone(): string {
  const dx = IC[0] - TPT_M[0], dy = IC[1] - TPT_M[1], d = Math.hypot(dx, dy), th = Math.atan2(dy, dx), al = Math.acos((RING - IR) / d);
  return [th + al, th - al].map(a => {
    const n: V = [Math.cos(a), Math.sin(a)];
    return `<path class="cb4n-cone" d="M${f(TPT_M[0] + RING * n[0])},${f(TPT_M[1] + RING * n[1])}L${f(IC[0] + IR * n[0])},${f(IC[1] + IR * n[1])}"/>`;
  }).join('');
}
function insetSvg(): string {
  const [cx, cy] = IC, top = cy - IR - 4, hgt = 2 * IR + 8;
  const bg = `<rect class="cel-stroma" x="${cx - IR - 4}" y="${top}" width="${f(XI - (cx - IR - 4))}" height="${hgt}"/>
    <rect class="cel-ims" x="${f(XI)}" y="${top}" width="${f(XO - XI)}" height="${hgt}"/>`;
  const mem = `${bilayer([{ L: [XI, top, XI, top + hgt] }], HB, 3.1 * K, 7.2 * K)}${bilayer([{ L: [XO, top, XO, top + hgt] }], HB, 3.1 * K, 7.2 * K)}`;
  const lanes = `${arrowSvg('itp', [[cx - IR + 14, YT], [XI, YT], [cx + 112, YT]], 'c', { halo: true })}${arrowSvg('ipi', [[cx + IR - 12, YP], [XI, YP], [cx - 90, YP]], 'gas', { thin: true, halo: true })}`;
  // ADP + Pᵢ → ATP (chain rowG spacing: ADP −67.4, + −29, Pᵢ 0, → +29, ATP +67.4)
  const [rx, ry] = ROW;
  const atpRow = `<g data-k="${P}-row" opacity="0"><g class="chn-g">${tagG(rx - 67.4, ry, 'ADP', 'atp')}${T(rx - 29, ry + 7, '+', 'chn-tagop')}${T(rx + 29, ry + 7, '→', 'chn-tagop')}</g>
      <circle data-k="${P}-slot" class="cb4n-slot" cx="${f(rx)}" cy="${f(ry)}" r="13" opacity="0"/>
      <g data-k="${P}-atp" class="chn-g">${tagG(rx + 67.4, ry, 'ATP', 'atp')}</g></g>`;
  const labels = `<g data-k="${P}-il" opacity="0">${T(cx - 100, cy - 128, 'stroma', 'chn-zone')}${T(cx + 150, cy - 58, 'cytosol', 'cel-zone')}${T(XI, cy + 74, 'TPT', 'cel-prot cel-halo')}</g>
    ${T(cx - 80, cy - 56, 'triose phosphate', 'cel-mn cel-halo', 'middle', `${P}-itpl`)}`;
  return `<g data-k="${P}-inset" opacity="0"><defs><clipPath id="${P}-clip"><circle cx="${cx}" cy="${cy}" r="${IR}"/></clipPath></defs>
    <circle class="cb4n-ibg" cx="${cx}" cy="${cy}" r="${IR}"/>
    <g clip-path="url(#${P}-clip)">${bg}${mem}${tptImg([XI, cy], K)}${lanes}${atpRow}${MOV_I.map(moverSvg).join('')}</g>
    ${labels}<circle class="cb4n-iring" cx="${cx}" cy="${cy}" r="${IR}"/></g>`;
}
function temSvg(): string {
  const panel = (i: number, win: number[], lab: string): string => {
    const x = TX[i], cx = x + TW / 2;
    return `<g data-k="${P}-tem${i}" opacity="0"><svg x="${x}" y="${TY}" width="${TW}" height="${f(TH)}" viewBox="${win.join(' ')}" preserveAspectRatio="none" overflow="hidden" style="overflow:hidden">
        <image href="${strebJpg}" width="${STREB.w}" height="${STREB.h}"/></svg>
      <rect class="cb4n-frame" x="${x}" y="${TY}" width="${TW}" height="${f(TH)}"/>${T(cx, TY - 12, lab, 'cel-mn')}</g>`;
  };
  return `${panel(0, WIN_C, 'end of the day')}${panel(1, WIN_G, 'end of the night')}
    ${T(TX[0], TY + TH + 24, `<tspan font-style="italic">Arabidopsis</tspan> · ${CR_STREB}`, 'cb4n-cr', 'start', `${P}-temcr`)}`;
}
function bandSvg(): string {
  const sun = `<circle class="cb4n-sun" cx="40" cy="22" r="11"/>${Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `<path class="cb4n-ray" d="M${f(40 + 15 * Math.cos(a))},${f(22 + 15 * Math.sin(a))}L${f(40 + 20 * Math.cos(a))},${f(22 + 20 * Math.sin(a))}"/>`;
  }).join('')}`;
  const moon = `<circle class="cb4n-moon" cx="40" cy="22" r="12"/><circle class="cb4n-night" cx="47" cy="17" r="10"/>`;
  return `<g data-k="${P}-day" opacity="0"><rect class="cb4n-day" x="0" y="0" width="1600" height="44"/>${sun}${T(70, 29, 'day', 'cb4n-bandd', 'start')}</g>
    <g data-k="${P}-night" opacity="0"><rect class="cb4n-night" x="0" y="0" width="1600" height="44"/>${moon}${T(70, 29, 'night', 'cb4n-bandn', 'start')}</g>`;
}
/** Beat 5: sunlight from the band onto the grana (chain wave); RuBisCO with its name. */
function sunlightSvg(): string {
  const a: V = [70, 50], b: V = [158, 344], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - 15 / L;
  for (let i = 0; i <= 90; i++) {
    const t = (i / 90) * stop, w = Math.sin(t * 5 * 2 * Math.PI) * 6 * Math.min(1, (stop - t) * 8);
    pts.push(`${i ? 'L' : 'M'}${f(a[0] + dx * t - uy * w)},${f(a[1] + dy * t + ux * w)}`);
  }
  return `<g data-k="${P}-sun" opacity="0"><path class="chn-lw" d="${pts.join('')}"/>${head(b, [dx, dy], 'chn-lwh', 15, 8.5)}${T(118, 150, 'sunlight', 'chn-light cel-halo', 'start')}</g>`;
}
const rubSvg = (): string => `<g data-k="${P}-rub" opacity="0">${rubImg(RUB, 0.55)}${T(RUB[0], RUB[1] - 42, 'RuBisCO', 'cel-prot cel-halo')}</g>`;

/* ---------------------------------------------------------------- timing */

/** Phloem flow speed (px s⁻¹) and its integral: the flow dots move at the sucrose export's pace. */
function speed(b: number, t: number): number {
  if (b === 0) return 0;
  if (b === 1) return 70 * E(t, 3.0, 3.6);
  if (b === 2) return lerp(70, 12, E(t, 0, 1.2));
  if (b === 3) return lerp(12, 70, E(t, 0, 0.8));
  return 70;
}
function flowAt(b: number, t: number): number {
  const end = Math.min(t, D[b]), dt = 0.04;
  let s = 0;
  for (let x = 0; x < end; x += dt) s += speed(b, x + dt / 2) * Math.min(dt, end - x);
  return s;
}
/** The grain's scale: it grows while sucrose arrives (slowly under the TPU limit). */
function grainS(b: number, t: number): number {
  if (b <= 0) return 0.7;
  if (b === 1) return lerp(0.7, 0.8, E(t, 3.2, D[1]));
  if (b === 2) return lerp(0.8, 0.82, E(t, 0, D[2]));
  if (b === 3) return lerp(0.82, 1, E(t, 0, D[3]));
  return 1;
}
/** The granule's scale: grows by day (beat 4, 1.6–4.4 s), shrinks at night (6.0–9.0 s). */
function granS(b: number, t: number): number {
  if (b === 3) return t < 5 ? lerp(0.3, 1, E(t, 1.6, 4.4)) : lerp(1, 0.3, E(t, 6.0, 9.0));
  return 0.3;
}
/** Night: the band, the veil and the dimming of the day's routes. */
const night = (b: number, t: number): number => (b === 3 ? E(t, 4.8, 5.8) : b === 4 ? 1 - E(t, 0, 1.0) : 0);

interface Arr { u: number; o: number }
function arrows(b: number, t: number): Record<string, Arr> {
  const n = night(b, t);
  return {
    tp: { u: b === 1 ? E(t, 0.4, 1.6) : b > 1 ? 1 : 0, o: b === 1 ? 1 : b === 2 ? lerp(1, 0.35, E(t, 4.4, 5.4)) : b === 3 ? lerp(lerp(0.35, 1, E(t, 0, 0.8)), 0.15, n) : b === 4 ? lerp(1, 0.15, n) : 0 },
    suc: { u: b === 1 ? E(t, 2.2, 3.4) : b > 1 ? 1 : 0, o: b === 1 ? 1 : b === 2 ? lerp(1, 0.4, E(t, 0, 1.2)) : b === 3 ? lerp(0.4, 1, E(t, 0, 0.8)) : b === 4 ? 1 : 0 },
    pi: { u: b === 1 ? E(t, 3.8, 4.8) : b > 1 ? 1 : 0, o: b === 1 ? 1 : b === 2 ? lerp(1, 0.12, E(t, 1.2, 2.2)) : b === 3 ? lerp(0.12, 1, E(t, 0, 0.8)) * (1 - n) : b === 4 ? 1 - n : 0 },
    st: { u: b === 3 ? E(t, 1.1, 2.1) : b === 4 ? 1 : 0, o: b === 3 || b === 4 ? lerp(1, 0.15, n) : 0 },
    nt: { u: b === 3 ? E(t, 5.6, 6.8) : b === 4 ? 1 : 0, o: b === 3 ? 1 : b === 4 ? n : 0 },
    // the inset's lanes: drawn after the first pair has crossed; the Pᵢ lane fades when the return stops (beat 3)
    itp: { u: b === 0 ? E(t, 3.3, 4.3) : 1, o: b <= 1 ? 1 : b === 2 ? lerp(1, 0.35, E(t, 4.4, 5.4)) : 0.35 },
    ipi: { u: b === 0 ? E(t, 3.4, 4.4) : 1, o: b <= 1 ? 1 : b === 2 ? lerp(1, 0.15, E(t, 1.2, 2.2)) : 0.15 },
  };
}
function movers(b: number, t: number): Record<string, Put | undefined> {
  const M: Record<string, Put | undefined> = {};
  const put = (k: string, p: V, o = 1): void => { M[`${P}${k}`] = { at: p, o }; };
  if (b === 0) { put('tpA', at(PA.tp, t)); put('piA', at(PA.pi, t)); }
  if (b === 1) {
    put('tpA', glide(line(TP_PARK, TP_OUT), t, 0, 1.4)); put('piA', glide(line(PI_PARK, PI_OUT), t, 0, 1.4));
    put('tpB', at(PB.tp, t)); put('piB', at(PB.pi, t)); put('tpC', at(PC.tp, t)); put('piC', at(PC.pi, t));
  }
  if (b === 3) put('tpC', TP_PARK);   // fades with the inset
  if (b === 2) {
    put('tpC', TP_PARK);
    // the last Pᵢ in goes to make ATP; none follows
    put('piC', glide(P_TO_ROW, t, 2.4, 0.9), 1 - E(t, 3.6, 4.2));
  }
  if (b === 4) {
    put('co2', glide(P_CO2, t, 1.2, 1.6), E(t, 1.0, 1.4));
    put('rubp', glide(P_RUBP, t, 1.3, 1.5), E(t, 1.1, 1.5));
  }
  return M;
}

/* ---------------------------------------------------------------- the staging */

const STAGING_BASE: Staging = {
  id: 'd',
  name: 'd · Leaf to grain, day and night',
  note: 'A wheat leaf cell, the phloem and a growing grain in one still framing; a round inset on TPT (1 triose phosphate out, 1 Pᵢ in); sucrose to the grain, its Pᵢ back; TPU: the Pᵢ return stops and ATP dims; day and night: the granule grows and shrinks, with Streb & Zeeman’s TEM, and sucrose still flows; RuBisCO with CO₂ and RuBP',
  svg: () => {
    const ring = `<circle data-k="${P}-ring" class="cb4n-ring" cx="${TPT_M[0]}" cy="${TPT_M[1]}" r="${RING}" opacity="0"/><g data-k="${P}-cone" opacity="0">${cone()}</g>`;
    const piTag = `<g class="chn-g" transform="translate(${PI_TAG[0]} ${PI_TAG[1]})">${tagG(0, 0, '', 'pi')}</g>`;
    const cellArrows = `${arrowSvg('st', AR.st.q, AR.st.kind, { thin: AR.st.thin, halo: true })}${arrowSvg('nt', AR.nt.q, AR.nt.kind, { halo: true })}
      ${arrowSvg('tp', AR.tp.q, AR.tp.kind, { halo: true })}${arrowSvg('pi', AR.pi.q, AR.pi.kind, { thin: true, halo: true, extra: `<g data-k="${P}-pitag" opacity="0">${piTag}</g>` })}
      ${arrowSvg('suc', AR.suc.q, AR.suc.kind, { halo: true })}`;
    const flow = `<path data-k="${P}-flow" class="cb4n-flow" d="M${PH.x0 + 30},${PH.y}H${PH.x1 - 20}" stroke-dasharray="1 15" opacity="0"/>`;
    const labels = `${T(SUC[0], SUC[1], 'sucrose', 'cel-mn cel-halo', 'middle', `${P}-sucl`)}
      ${T(TP0[0] + 10, TP0[1] - 22, 'triose phosphate', 'cel-mn cel-halo', 'middle', `${P}-tpl`)}
      ${T(STARCH[0], STARCH[1] + 58, 'starch', 'cel-mn cel-halo', 'middle', `${P}-stl`)}`;
    const veil = `<rect data-k="${P}-veil" class="cb4n-veil" x="0" y="44" width="1600" height="696" opacity="0"/>`;
    return `<g class="fig cb4n">${cellSvg()}${granuleSvg()}${phloemSvg()}${grainSvg()}${ring}${cellArrows}${flow}${labels}
      ${rubSvg()}${sunlightSvg()}${MOV_C.map(moverSvg).join('')}
      ${veil}${insetSvg()}${temSvg()}${bandSvg()}</g>`;
  },
  bind(stage) {
    const A = attrSetter(stage);
    const put = placer(stage, [...MOV_I, ...MOV_C].map(m => m.k));
    const setArrow = (k: string, a: Arr): void => {
      A(`${P}-${k}`, 'opacity', a.o);
      A(`${P}-${k}-l`, 'stroke-dashoffset', 1 - a.u);
      A(`${P}-${k}-h`, 'stroke-dashoffset', 1 - a.u);
      A(`${P}-${k}-hd`, 'opacity', E(a.u, 0.9, 1));
    };
    return (b, t) => {
      const n = night(b, t);
      // the inset on TPT (beats 1–3), its ring and magnifier lines
      const ins = b === 0 ? E(t, 0.1, 0.8) : b === 1 || b === 2 ? 1 : b === 3 ? 1 - E(t, 0, 0.8) : 0;
      const sc = 1;  // the close-up fades in at its full size: no grow-in (lecturer, 29 Oct 2026: "why do you shake the zoomed-in stuff?")
      A(`${P}-inset`, 'opacity', ins);
      A(`${P}-inset`, 'transform', `translate(${f(IC[0] * (1 - sc))} ${f(IC[1] * (1 - sc))}) scale(${f(sc)})`);
      A(`${P}-ring`, 'opacity', b === 0 ? E(t, 0, 0.6) : b === 1 || b === 2 ? 1 : b === 3 ? 1 - E(t, 0, 0.8) : 0);
      A(`${P}-cone`, 'opacity', b === 0 ? E(t, 0.2, 0.9) : b === 1 ? 1 - E(t, 0, 0.6) : 0);
      A(`${P}-il`, 'opacity', b === 0 ? E(t, 0.6, 1.2) : 1);
      A(`${P}-itpl`, 'opacity', b === 0 ? E(t, 1.3, 1.8) : 1);
      A(`${P}-row`, 'opacity', b === 2 ? E(t, 2.2, 2.8) : b === 3 ? 1 : 0);
      A(`${P}-slot`, 'opacity', b === 2 ? E(t, 3.8, 4.3) : b === 3 ? 1 : 0);
      A(`${P}-atp`, 'opacity', b === 2 ? lerp(1, 0.3, E(t, 3.6, 4.2)) : 0.3);
      // the cell: grana dim when photosynthesis slows (beat 3) and at night
      const gr = b === 2 ? lerp(1, 0.4, E(t, 4.4, 5.4)) : b === 3 ? lerp(lerp(0.4, 1, E(t, 0, 0.8)), 0.4, n) : b === 4 ? lerp(1, 0.4, n) : 1;
      A(`${P}-grana`, 'opacity', gr);
      const ar = arrows(b, t);
      for (const k of Object.keys(ar)) setArrow(k, ar[k]);
      A(`${P}-pitag`, 'opacity', E(ar.pi.u, 0.6, 1));
      A(`${P}-sucl`, 'opacity', b === 1 ? E(t, 1.2, 1.7) : b > 1 ? 1 : 0);
      A(`${P}-tpl`, 'opacity', b === 3 ? E(t, 0.6, 1.1) * lerp(1, 0.45, n) : b === 4 ? lerp(1, 0.45, n) : 0);
      // phloem, flow and grain (from beat 2)
      const ph = b === 1 ? E(t, 1.8, 2.4) : b > 1 ? 1 : 0;
      A(`${P}-ph`, 'opacity', ph);
      A(`${P}-grain`, 'opacity', ph); A(`${P}-grainl`, 'opacity', ph);
      A(`${P}-grain`, 'transform', `translate(${GRAIN0[0]} ${GRAIN0[1]}) scale(${f(grainS(b, t))})`);
      A(`${P}-flow`, 'opacity', (b === 1 ? E(t, 3.0, 3.6) : b > 1 ? 1 : 0) * ar.suc.o);
      A(`${P}-flow`, 'stroke-dashoffset', -flowAt(b, t) % 16);
      // starch (beat 4 on)
      A(`${P}-gran`, 'opacity', b === 3 ? E(t, 1.6, 2.0) : b === 4 ? 1 : 0);
      A(`${P}-gran`, 'transform', `translate(${STARCH[0]} ${STARCH[1]}) scale(${f(granS(b, t))})`);
      A(`${P}-stl`, 'opacity', b === 3 ? E(t, 1.8, 2.3) : b === 4 ? 1 : 0);
      // day and night
      A(`${P}-day`, 'opacity', b === 3 ? E(t, 0.3, 1.1) : b === 4 ? 1 : 0);
      A(`${P}-night`, 'opacity', n);
      A(`${P}-veil`, 'opacity', 0.12 * n);
      A(`${P}-tem0`, 'opacity', b === 3 ? E(t, 3.8, 4.6) : b === 4 ? 1 - E(t, 0, 0.8) : 0);
      A(`${P}-temcr`, 'opacity', b === 3 ? E(t, 3.8, 4.6) : b === 4 ? 1 - E(t, 0, 0.8) : 0);
      A(`${P}-tem1`, 'opacity', b === 3 ? E(t, 8.8, 9.6) : b === 4 ? 1 - E(t, 0, 0.8) : 0);
      // beat 5: sunlight, RuBisCO, CO₂ and RuBP
      A(`${P}-sun`, 'opacity', b === 4 ? E(t, 0.6, 1.4) : 0);
      A(`${P}-rub`, 'opacity', b === 4 ? E(t, 0.8, 1.4) : 0);
      put(movers(b, t));
    };
  },
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026: "people don't read the
 *  text under the animation"). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 0, lines: ['Triose phosphate out, Pᵢ in'], x: 1225, y: 690, size: 36, at: 1.5 },
  { beat: 1, lines: ['Sucrose: to growing organs and grain'], x: 1225, y: 690, size: 34, at: 1.5 },
  { beat: 2, lines: ['Too little Pᵢ: photosynthesis slows (TPU)'], x: 1225, y: 690, size: 32, at: 1.5 },
  { beat: 3, lines: ['Starch by day, sucrose at night'], x: 1225, y: 690, size: 36, at: 1.5 },
  { beat: 4, lines: ['But RuBisCO also adds O₂:', 'what happens to its product, 2-PG?'], x: 800, y: 470, size: 44, at: 1.5 },
]);
