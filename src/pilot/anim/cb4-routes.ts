// C4 · Sucrose and starch (beats CB4V3, beats-cb4n.ts), staging routes · "2 routes: starch or sucrose" (lecturer, 29 Oct
// 2026, late: "triose phosphate has 2 ways to go: it stays to make starch as a storage, or it goes out to make sucrose,
// exported; the grain gets bigger; starch accumulates by day and is broken down at night to soluble sugar, to fuel
// other cells or this cell. TPU is not the focus here."). Re-cut from staging d (cb4-n.ts): the same wheat leaf cell,
// TPT, phloem, grain, starch granule, day/night band and Streb & Zeeman's TEM; no TPU, no ATP. One still framing.
// - Beat 1, 2 ways: 1 triose phosphate in the stroma; 2 arrows draw: it stays (to the starch granule) or leaves (through
//   TPT to sucrose).
// - Beat 2, out: sucrose: the inset opens on TPT; triose phosphate 1 and 2 go out, each crossing 1 Pᵢ coming in; sucrose
//   in the cytosol flows through the phloem; the grain grows.
// - Beat 3, in: starch by day: the day band; 2 triose phosphates go into the granule, which grows; "end of the day" TEM.
// - Beat 4, night: the night band and veil; the granule shrinks; soluble sugars leave the chloroplast: one stream makes
//   sucrose, which still flows to the grain (it keeps growing); one goes to this cell's mitochondrion (respiration);
//   "end of the night" TEM.
// - Beat 5, sunlight in sugar: day again; sunlight on the grana; CO₂ and RuBP come to RuBisCO; the question.
import './cb4-n.css';
import './cb4-routes.css';
import tptPng from '../../assets/cell/tpt.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import strebJpg from '../../assets/photos/c4-streb.jpg';
import { row } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { attrSetter, curve, ease, f, glide, lerp, lerpV, moverSvg, placer, tAt, type Mover, type Path, type Put, type V } from './dk2-common';
import type { Staging } from './types';
import { withKeys } from './stage-keys-cb';

const P = 'cb4r';
/** Beat lengths (s): 33 s in all. */
const D = [5.0, 8.0, 6.5, 9.0, 4.5];
const E = ease;

/* ---------------------------------------------------------------- where (stage units, 1600 × 740) */

const CELL = { x0: 24, y0: 64, x1: 860, y1: 712, wall: 18, r: 46 };
const CH = { cx: 330, cy: 420, rx: 262, ry: 196, gap: 20 };
/** TPT on the inner envelope, at the chloroplast's right end (membrane vertical there). */
const TPT_M: V = [CH.cx + CH.rx - CH.gap, CH.cy];
const RING = 40;
const GRANA: V[] = [[175, 390], [250, 505]];
const TP0: V = [470, 414];
const SUC: V = [742, 300];
const STARCH: V = [420, 512];
const RUB: V = [340, 372];
/** This cell's mitochondrion, in the cytosol below the export (beat 4). */
const MITO: V = [726, 596];
const PH = { x0: 852, x1: 1300, y: 150, h: 40 };
const GRAIN0: V = [PH.x1, PH.y];

/** The inset on TPT (beat 2): centre, radius, scale, bilayers, the two lanes through TPT. */
const IC: V = [1170, 420], IR = 210, K = 0.9;
const XI = IC[0] + 34, XO = XI + 58 * K, HB = 19 * K;
const YT = IC[1] - 18, YP = IC[1] + 20;
const TP_IN: V = [IC[0] - IR - 40, YT], TP_OUT: V = [IC[0] + IR + 60, YT];
const PI_IN: V = [IC[0] + IR + 30, YP], PI_OUT: V = [IC[0] - IR - 40, YP];

/** TEM panels: Streb & Zeeman 2012 Fig. 4 C and G (figs/cb04.ts WIN_C, WIN_G). */
const STREB = { w: 394, h: 323 };
const WIN_C = [0, 46, 195, 277], WIN_G = [200, 46, 194, 277];
const CR_STREB = 'Streb & Zeeman 2012, The Arabidopsis Book 10:e0160, Fig. 4 C, G · © ASPB';
const TW = 224, TH = 277 * (224 / 195), TX = [938, 1178], TY = 266;

/* ---------------------------------------------------------------- drawing kit (as cb4-n.ts) */

const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const PXU = 0.95 / 2.4;
function tptImg(c: V, k: number): string {
  const s = PXU * k, w = 159 * s, h = 263 * s;
  return `<image class="cel-p" href="${tptPng}" x="${f(c[0] - 83.7 * s)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
}
function rubImg(c: V, k: number): string {
  const s = (0.95 / 4) * k, w = 548 * s, h = 471 * s;
  return `<image class="cel-p" href="${rubPng}" x="${f(c[0] - w / 2)}" y="${f(c[1] - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
}
const ellSeg = (cx: number, cy: number, rx: number, ry: number) => [{ A: [cx, cy, rx, ry, -90, 270] as [number, number, number, number, number, number] }];
function rrSeg(x0: number, y0: number, x1: number, y1: number, r: number) {
  type S = { L: [number, number, number, number] } | { A: [number, number, number, number, number, number] };
  const s: S[] = [
    { L: [x0 + r, y0, x1 - r, y0] }, { A: [x1 - r, y0 + r, r, r, -90, 0] }, { L: [x1, y0 + r, x1, y1 - r] }, { A: [x1 - r, y1 - r, r, r, 0, 90] },
    { L: [x1 - r, y1, x0 + r, y1] }, { A: [x0 + r, y1 - r, r, r, 90, 180] }, { L: [x0, y1 - r, x0, y0 + r] }, { A: [x0 + r, y0 + r, r, r, 180, 270] },
  ];
  return s;
}
const bil2 = (segs: Parameters<typeof bilayer>[0]): string => bilayer(segs, 9.5, 1.7, 4.2);
function granum(c: V): string {
  return [0, 1, 2, 3].map(k => {
    const y = c[1] - 39 + k * 26, x0 = c[0] - 45, x1 = c[0] + 45;
    const segs = [{ L: [x0, y - 3, x1, y - 3] as [number, number, number, number] }, { A: [x1, y + 0.5, 3.5, 3.5, -90, 90] as [number, number, number, number, number, number] },
      { L: [x1, y + 4, x0, y + 4] as [number, number, number, number] }, { A: [x0, y + 0.5, 3.5, 3.5, 90, 270] as [number, number, number, number, number, number] }];
    return `<rect class="cel-lumen" x="${f(x0 - 3.5)}" y="${f(y - 3)}" width="${f(x1 - x0 + 7)}" height="7" rx="3.5"/>${bilayer(segs, 7, 1.4, 3.6)}`;
  }).join('');
}
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
  // leaves: triose phosphate out through TPT to sucrose in the cytosol
  tp: { q: [[TP0[0] + 36, TP0[1] - 1], [540, 413], [TPT_M[0], 413], [606, 408], [650, 382], [692, 340], [712, 318]], kind: 'c' },
  // sucrose out of the cell into the phloem, along it to the grain
  suc: { q: [[784, 292], [812, 240], [836, 184], [876, 154], [1100, PH.y], [GRAIN0[0] - 2, PH.y]], kind: 'c' },
  // stays: triose phosphate to the starch granule
  st: { q: [[TP0[0] - 4, TP0[1] + 12], [470, 452], [454, 478]], kind: 'c', thin: true },
  // at night: soluble sugars from the granule out across the envelope (not through TPT) to sucrose
  nt: { q: [[STARCH[0] + 30, STARCH[1] - 4], [530, 506], [580, 490], [650, 462], [730, 400], [762, 322]], kind: 'c' },
  // at night: soluble sugars to this cell's mitochondrion
  mt: { q: [[STARCH[0] + 40, STARCH[1] + 16], [500, 552], [560, 584], [MITO[0] - 80, MITO[1] + 2]], kind: 'c', thin: true },
};
/** Where the moving sugars go: along the arrows. */
const P_ST = curve(AR.st.q), P_NT = curve(AR.nt.q), P_MT = curve(AR.mt.q);

/* ---------------------------------------------------------------- moving molecules */

interface Gl { path: Path; t0: number; d: number }
const line = (a: V, b: V): Path => (u: number): V => lerpV(a, b, u);
/** A triose phosphate (from a to b) and a Pᵢ (from c to d) that cross TPT's membrane line at the same moment `at`. */
function pair(a: V, b: V, c: V, d: V, at: number, dur: number): { tp: Gl; pi: Gl } {
  const uT = (XI - a[0]) / (b[0] - a[0]), uP = (c[0] - XI) / (c[0] - d[0]);
  return { tp: { path: line(a, b), t0: at - tAt(uT, 0, dur), d: dur }, pi: { path: line(c, d), t0: at - tAt(uP, 0, dur), d: dur } };
}
const PA = pair(TP_IN, TP_OUT, PI_IN, PI_OUT, 2.4, 2.8);   // beat 2: triose phosphate 1 out, Pᵢ 1 in
const PB = pair(TP_IN, TP_OUT, PI_IN, PI_OUT, 4.0, 2.8);   // beat 2: triose phosphate 2 out, Pᵢ 2 in
const at = (g: Gl, t: number): V => glide(g.path, t, g.t0, g.d);
const P_CO2 = curve([[220, 190], [236, 250], [256, 320], [RUB[0] - 68, RUB[1]]]);
const P_RUBP = curve([[RUB[0] + 34, RUB[1] + 82], [RUB[0], RUB[1] + 56]]);

const TP_I = row(0, 0, 'CCCP', { r: 10.5 }), TP_C = row(0, 0, 'CCCP', { r: 8 }), SUG = row(0, 0, 'CCCCCC', { r: 7 });
const PI_G = tagG(0, 0, '', 'pi');
const MOV_I: Mover[] = ['A', 'B'].flatMap(k => [{ k: `${P}tp${k}`, svg: TP_I }, { k: `${P}pi${k}`, svg: PI_G }]);
const MOV_C: Mover[] = [
  { k: `${P}tp0`, svg: TP_C },
  { k: `${P}st0`, svg: TP_C }, { k: `${P}st1`, svg: TP_C },
  { k: `${P}sg0`, svg: SUG }, { k: `${P}sg1`, svg: SUG },
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
/** This cell's mitochondrion at half the strip's scale (cell-schema: matrix, outer and inner membrane), named by its job. */
function mitoSvg(): string {
  const [x, y] = MITO, rx = 74, ry = 44;
  const cristae = [-36, -12, 12, 36].map(dx => `<path class="cb4r-crista" d="M${f(x + dx)},${f(y - 26 + Math.abs(dx) * 0.2)}q${dx < 0 ? -6 : 6},26 0,${f(52 - Math.abs(dx) * 0.4)}"/>`).join('');
  return `<g data-k="${P}-mito" opacity="0"><ellipse class="cel-matrix" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>${bil2(ellSeg(x, y, rx, ry))}${cristae}
    ${T(x, y + ry + 30, 'respiration', 'cel-mn cel-halo')}</g>`;
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
  const labels = `<g data-k="${P}-il" opacity="0">${T(cx - 100, cy - 128, 'stroma', 'chn-zone')}${T(cx + 150, cy - 58, 'cytosol', 'cel-zone')}${T(XI, cy + 74, 'TPT', 'cel-prot cel-halo')}</g>
    ${T(cx - 80, cy - 56, 'triose phosphate', 'cel-mn cel-halo', 'middle', `${P}-itpl`)}`;
  return `<g data-k="${P}-inset" opacity="0"><defs><clipPath id="${P}-clip"><circle cx="${cx}" cy="${cy}" r="${IR}"/></clipPath></defs>
    <circle class="cb4n-ibg" cx="${cx}" cy="${cy}" r="${IR}"/>
    <g clip-path="url(#${P}-clip)">${bg}${mem}${tptImg([XI, cy], K)}${lanes}${MOV_I.map(moverSvg).join('')}</g>
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

/** Phloem flow speed (px s⁻¹) and its integral: the dots move while sucrose is exported (by day, and from starch at night). */
const speed = (b: number, t: number): number => (b === 0 ? 0 : b === 1 ? 70 * E(t, 3.4, 4.0) : 70);
function flowAt(b: number, t: number): number {
  const end = Math.min(t, D[b]), dt = 0.04;
  let s = 0;
  for (let x = 0; x < end; x += dt) s += speed(b, x + dt / 2) * Math.min(dt, end - x);
  return s;
}
/** The grain's scale: it grows while sucrose arrives, by day and at night. */
function grainS(b: number, t: number): number {
  if (b <= 0) return 0.7;
  if (b === 1) return lerp(0.7, 0.82, E(t, 3.6, D[1]));
  if (b === 2) return lerp(0.82, 0.9, E(t, 0, D[2]));
  if (b === 3) return lerp(0.9, 1, E(t, 1.5, D[3]));
  return 1;
}
/** The granule's scale: small at first; grows by day (beat 3), shrinks at night (beat 4). */
function granS(b: number, t: number): number {
  if (b === 2) return lerp(0.3, 1, E(t, 1.6, 4.6));
  if (b === 3) return lerp(1, 0.3, E(t, 2.0, 6.0));
  return 0.3;
}
/** Night: the band, the veil and the dimming of the day's routes. */
const night = (b: number, t: number): number => (b === 3 ? E(t, 0.2, 1.2) : b === 4 ? 1 - E(t, 0, 1.0) : 0);

interface Arr { u: number; o: number }
function arrows(b: number, t: number): Record<string, Arr> {
  const n = night(b, t);
  return {
    tp: { u: b === 0 ? E(t, 1.4, 2.6) : 1, o: b <= 2 ? 1 : lerp(1, 0.2, n) },
    st: { u: b === 0 ? E(t, 2.4, 3.4) : 1, o: b <= 2 ? 1 : lerp(1, 0.2, n) },
    suc: { u: b === 1 ? E(t, 2.8, 4.0) : b > 1 ? 1 : 0, o: b >= 1 ? 1 : 0 },
    nt: { u: b === 3 ? E(t, 1.6, 2.8) : b === 4 ? 1 : 0, o: b === 3 ? 1 : b === 4 ? n : 0 },
    mt: { u: b === 3 ? E(t, 2.6, 3.6) : b === 4 ? 1 : 0, o: b === 3 ? 1 : b === 4 ? n : 0 },
    itp: { u: b === 1 ? E(t, 1.0, 2.0) : b > 1 ? 1 : 0, o: 1 },
    ipi: { u: b === 1 ? E(t, 1.1, 2.1) : b > 1 ? 1 : 0, o: 1 },
  };
}
function movers(b: number, t: number): Record<string, Put | undefined> {
  const M: Record<string, Put | undefined> = {};
  const put = (k: string, p: V, o = 1, s?: number): void => { M[`${P}${k}`] = { at: p, o, s }; };
  // beat 1: one triose phosphate in the stroma (it goes at the start of beat 2, as the inset takes over)
  if (b === 0) put('tp0', TP0, E(t, 0.4, 0.9));
  if (b === 1) put('tp0', TP0, 1 - E(t, 0, 0.6));
  // beat 2: 2 pairs at TPT, each 1 triose phosphate out for 1 Pᵢ in
  if (b === 1) { put('tpA', at(PA.tp, t)); put('piA', at(PA.pi, t)); put('tpB', at(PB.tp, t)); put('piB', at(PB.pi, t)); }
  // beat 3: 2 triose phosphates go into the granule
  if (b === 2) {
    [1.5, 2.4].forEach((g, i) => { const u = E(t, g + 0.8, g + 1.2); put(`st${i}`, glide(P_ST, t, g, 1.0), E(t, g - 0.3, g) * (1 - u), 1 - 0.4 * u); });
  }
  // beat 4: soluble sugars leave the granule: 1 to sucrose, 1 to the mitochondrion
  if (b === 3) {
    put('sg0', glide(P_NT, t, 2.8, 2.0), E(t, 2.6, 2.9) * (1 - E(t, 4.6, 5.0)));
    put('sg1', glide(P_MT, t, 3.6, 1.6), E(t, 3.4, 3.7) * (1 - E(t, 5.0, 5.4)));
  }
  // beat 5: CO₂ and RuBP to RuBisCO
  if (b === 4) {
    put('co2', glide(P_CO2, t, 1.2, 1.6), E(t, 1.0, 1.4));
    put('rubp', glide(P_RUBP, t, 1.3, 1.5), E(t, 1.1, 1.5));
  }
  return M;
}

/* ---------------------------------------------------------------- the staging */

const STAGING_BASE: Staging = {
  id: 'routes',
  name: '2 routes: starch or sucrose',
  note: 'The leaf cell, the phloem and the grain in one still framing: triose phosphate stays (starch) or leaves (sucrose); out through TPT, 1 Pᵢ in for each, sucrose to the grain, which grows; starch by day; at night the starch makes sucrose for the grain and fuels the cell’s mitochondrion; RuBisCO',
  svg: () => {
    const ring = `<circle data-k="${P}-ring" class="cb4n-ring" cx="${TPT_M[0]}" cy="${TPT_M[1]}" r="${RING}" opacity="0"/><g data-k="${P}-cone" opacity="0">${cone()}</g>`;
    const cellArrows = `${arrowSvg('st', AR.st.q, AR.st.kind, { thin: AR.st.thin, halo: true })}${arrowSvg('nt', AR.nt.q, AR.nt.kind, { halo: true })}
      ${arrowSvg('mt', AR.mt.q, AR.mt.kind, { thin: AR.mt.thin, halo: true })}${arrowSvg('tp', AR.tp.q, AR.tp.kind, { halo: true })}
      ${arrowSvg('suc', AR.suc.q, AR.suc.kind, { halo: true })}`;
    const flow = `<path data-k="${P}-flow" class="cb4n-flow" d="M${PH.x0 + 30},${PH.y}H${PH.x1 - 20}" stroke-dasharray="1 15" opacity="0"/>`;
    const labels = `${T(SUC[0], SUC[1], 'sucrose', 'cel-mn cel-halo', 'middle', `${P}-sucl`)}
      ${T(TP0[0] - 8, TP0[1] - 24, 'triose phosphate', 'cel-mn cel-halo', 'middle', `${P}-tpl`)}
      ${T(STARCH[0], STARCH[1] + 58, 'starch', 'cel-mn cel-halo', 'middle', `${P}-stl`)}
      ${T(514, 474, 'stays', 'cb4r-way cel-halo', 'start', `${P}-wst`)}${T(626, 432, 'leaves', 'cb4r-way cel-halo', 'start', `${P}-wtp`)}`;
    const veil = `<rect data-k="${P}-veil" class="cb4n-veil" x="0" y="44" width="1600" height="696" opacity="0"/>`;
    return `<g class="fig cb4n cb4r">${cellSvg()}${mitoSvg()}${granuleSvg()}${phloemSvg()}${grainSvg()}${ring}${cellArrows}${flow}${labels}
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
      // the inset on TPT (beat 2), its ring and magnifier lines; it closes as beat 3 begins
      const ins = b === 1 ? E(t, 0.1, 0.8) : b === 2 ? 1 - E(t, 0, 0.6) : 0;
      const sc = 1;  // the close-up fades in at its full size: no grow-in (lecturer, 29 Oct 2026: "why do you shake the zoomed-in stuff?")
      A(`${P}-inset`, 'opacity', ins);
      A(`${P}-inset`, 'transform', `translate(${f(IC[0] * (1 - sc))} ${f(IC[1] * (1 - sc))}) scale(${f(sc)})`);
      A(`${P}-ring`, 'opacity', ins);
      A(`${P}-cone`, 'opacity', b === 1 ? E(t, 0.2, 0.9) * (1 - E(t, 2.6, 3.2)) : 0);
      A(`${P}-il`, 'opacity', b === 1 ? E(t, 0.6, 1.2) : b === 2 ? 1 : 0);
      A(`${P}-itpl`, 'opacity', b === 1 ? E(t, 1.2, 1.7) : b === 2 ? 1 : 0);
      // the grana dim at night
      A(`${P}-grana`, 'opacity', b === 3 ? lerp(1, 0.4, n) : b === 4 ? lerp(1, 0.4, n) : 1);
      const ar = arrows(b, t);
      for (const k of Object.keys(ar)) setArrow(k, ar[k]);
      // the 2 ways and their names (beat 1 on)
      A(`${P}-tpl`, 'opacity', b === 0 ? E(t, 0.6, 1.1) : b <= 2 ? 1 : lerp(1, 0.45, n));
      A(`${P}-wtp`, 'opacity', (b === 0 ? E(ar.tp.u, 0.7, 1) : 1) * ar.tp.o);
      A(`${P}-wst`, 'opacity', (b === 0 ? E(ar.st.u, 0.7, 1) : 1) * ar.st.o);
      A(`${P}-sucl`, 'opacity', b === 0 ? E(t, 2.4, 2.9) : 1);
      A(`${P}-gran`, 'opacity', b === 0 ? E(t, 3.0, 3.5) : 1);
      A(`${P}-gran`, 'transform', `translate(${STARCH[0]} ${STARCH[1]}) scale(${f(granS(b, t))})`);
      A(`${P}-stl`, 'opacity', b === 0 ? E(t, 3.2, 3.7) : 1);
      // phloem, flow and grain (from beat 2)
      const ph = b === 1 ? E(t, 2.4, 3.0) : b > 1 ? 1 : 0;
      A(`${P}-ph`, 'opacity', ph);
      A(`${P}-grain`, 'opacity', ph); A(`${P}-grainl`, 'opacity', ph);
      A(`${P}-grain`, 'transform', `translate(${GRAIN0[0]} ${GRAIN0[1]}) scale(${f(grainS(b, t))})`);
      A(`${P}-flow`, 'opacity', b === 1 ? E(t, 3.4, 4.0) : b > 1 ? 1 : 0);
      A(`${P}-flow`, 'stroke-dashoffset', -flowAt(b, t) % 16);
      // the mitochondrion (beat 4 on)
      A(`${P}-mito`, 'opacity', b === 3 ? E(t, 1.8, 2.4) : b === 4 ? 1 : 0);
      // day and night
      A(`${P}-day`, 'opacity', b === 2 ? E(t, 0.3, 1.1) : b === 3 ? 1 - n : b === 4 ? 1 : 0);
      A(`${P}-night`, 'opacity', n);
      A(`${P}-veil`, 'opacity', 0.12 * n);
      A(`${P}-tem0`, 'opacity', b === 2 ? E(t, 3.4, 4.2) : b === 3 ? 1 : b === 4 ? 1 - E(t, 0, 0.8) : 0);
      A(`${P}-temcr`, 'opacity', b === 2 ? E(t, 3.4, 4.2) : b === 3 ? 1 : b === 4 ? 1 - E(t, 0, 0.8) : 0);
      A(`${P}-tem1`, 'opacity', b === 3 ? E(t, 5.6, 6.4) : b === 4 ? 1 - E(t, 0, 0.8) : 0);
      // beat 5: sunlight, RuBisCO, CO₂ and RuBP
      A(`${P}-sun`, 'opacity', b === 4 ? E(t, 0.6, 1.4) : 0);
      A(`${P}-rub`, 'opacity', b === 4 ? E(t, 0.8, 1.4) : 0);
      put(movers(b, t));
    };
  },
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 0, lines: ['Triose phosphate: 2 ways'], x: 1230, y: 420, size: 44, at: 3.4 },
  { beat: 1, lines: ['Sucrose: exported to the grain'], x: 1225, y: 690, size: 36, at: 4.4 },
  { beat: 2, lines: ['Starch: stored during the day'], x: 1225, y: 690, size: 36, at: 3.0 },
  { beat: 3, lines: ['At night, starch fuels the plant'], x: 1225, y: 690, size: 36, at: 4.0 },
  { beat: 4, lines: ['But RuBisCO also adds O₂:', 'what happens to its product, 2-PG?'], x: 800, y: 470, size: 44, at: 1.5 },
]);
