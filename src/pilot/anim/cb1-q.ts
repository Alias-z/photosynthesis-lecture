// cb1, staging q · "From Calvin's spots to the cycle" (slide C1 · C₃ photosynthesis; beats CB1V2; brief
// research/redo-2026-10-29/C1_ANIM_V2_BRIEF.md, lecturer, 29 Oct 2026, evening). A clean stage, no strip: the paper card
// on the right holds the evidence, the cycle is drawn on the left after Bassham et al. 1954 (CO₂ in on the left,
// reduction along the top, regeneration back along the bottom), in the deck's glyphs. One fixed framing throughout.
// - Beat 1, Carbon-14: the lollipop photo, large; ¹⁴CO₂ (atom balls, ringed amber: the tracer) glides into its neck,
//   the algae drain into the alcohol.
// - Beat 2, Carboxylation: Calvin's 5 s film; everything but the 3-PGA spot is veiled; the name "3-PGA" travels from the
//   spot to its place in the cycle. Then RuBisCO, CO₂ and RuBP, and the carboxylation arrows are drawn.
// - Beat 3, Reduction: Bassham 1954's cycle; its reduction arc (with their ATP and [H]) is lit; the name "triose
//   phosphate" travels from their "C₃ (triose)" to the cycle. The thylakoid, the reduction arrow and the ATP and NADPH
//   arrows are drawn; ADP, Pᵢ and NADP⁺ go back to the thylakoid (dashed).
// - Beat 4, Regeneration: their regeneration loop is lit; the arrow from triose phosphate back to RuBP (5) closes the
//   cycle, with ATP in and ADP back; 1 triose phosphate leaves. The one line: 3 RuBP = 15 C = 5 × 3 C.
// - Beat 5, Per 3 CO₂: the whole 1954 figure; the one total, 9 ATP + 6 NADPH used, its tags glow; the triose phosphate
//   that left is marked with the question.
// Numbers on screen (lecturer, 29 Oct 2026: "too many numbers … only leave the key information"): the molecule counts per
// 3 CO₂ on the cycle (3 CO₂, 6 3-PGA, 6 triose phosphates, 5 back, 1 out), the line of beat 4 and the total of beat 5.
// Carbons are drawn plain: counted, not traced. ATP and NADPH are spent: their remains never come back as ATP or NADPH.
import './cb1-q.css';
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import f5Png from '../../assets/photos/c2-5s.png';
import b54Png from '../../assets/photos/cb-bassham1954.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { row } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { CB1V2 } from './beats-cb1k';
import type { Staging } from './types';
import { withKeys } from './stage-keys-cb';

type V = [number, number];
const P = 'cb1q';

/* ---------------------------------------------------------------- numbers and motion */

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Smooth step of t between t0 and t1. */
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
/** Smoother step, for glides and for arrows that draw themselves. */
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;

/** A Catmull–Rom curve through q, sampled densely; at(u) walks it by arc length. */
function curve(q: V[], n = 32): { pts: V[]; L: number; at: (u: number) => { p: V; deg: number } } {
  const pts: V[] = [];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    for (let j = 0; j < n; j++) {
      const s = j / n, s2 = s * s, s3 = s2 * s;
      const c = (a: number, b: number, cc: number, d: number): number => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s2 + (-a + 3 * b - 3 * cc + d) * s3);
      pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(q[q.length - 1]);
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = acc[acc.length - 1] || 1;
  const at = (u: number): { p: V; deg: number } => {
    const d = clamp(u) * L;
    let lo = 0, hi = acc.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] < d) lo = m; else hi = m; }
    const seg = acc[hi] - acc[lo], w = seg ? (d - acc[lo]) / seg : 0, a = pts[lo], b = pts[hi];
    return { p: [lerp(a[0], b[0], w), lerp(a[1], b[1], w)], deg: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
  };
  return { pts, L, at };
}

/** A seeded cut-paper edge round a card. */
function cutPath(x: number, y: number, w: number, h: number, seed: number, jag = 3.2): string {
  let s = seed >>> 0;
  const r = (): number => { s = (s + 0x6d2b79f5) >>> 0; let z = s; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  const pts: V[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number): void => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 14)), nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny);
    for (let i = 0; i < n; i++) { const u = i / n, o = (r() - 0.5) * jag; pts.push([x0 + (x1 - x0) * u + (nx / l) * o, y0 + (y1 - y0) * u + (ny / l) * o]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return `M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}Z`;
}

const T = (x: number, y: number, s: string, cls: string, a = 'middle', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const G = (k: string, inner: string, extra = ''): string => `<g data-k="${k}" display="none"${extra}>${inner}</g>`;
const gl = (svg: string): string => `<g class="chn-g">${svg}</g>`;

/* ---------------------------------------------------------------- the cycle (stage units, left of the card) */

const R = 11;
const AT = {
  co2: [74, 392] as V, rub: [196, 392] as V, pga: [276, 196] as V, tp: [622, 196] as V, rubp: [286, 614] as V,
  out: [778, 70] as V, thyl: [458, 392] as V,
};
const RUB_W = 548 * 0.22, RUB_H = 471 * 0.22;
/** The cycle's arrows: carbon (ink), CO₂ (grey), ATP (clay), NADPH (blue), spent carriers (grey dashes). */
type Kind = 'c' | 'gas' | 'atp' | 'nadph' | 'ret';
interface Arrow { k: string; kind: Kind; q: V[] }
const ARROWS: Arrow[] = [
  { k: 'a-co2', kind: 'gas', q: [[104, 392], [134, 392]] },
  { k: 'a-rubp', kind: 'c', q: [[250, 598], [244, 520], [228, 450]] },
  { k: 'a-carb', kind: 'c', q: [[234, 340], [246, 270], [262, 218]] },
  { k: 'a-red', kind: 'c', q: [[330, 184], [452, 128], [542, 168], [567, 192]] },
  { k: 'a-atp1', kind: 'atp', q: [[400, 356], [398, 250], [402, 146]] },
  { k: 'a-nadph', kind: 'nadph', q: [[460, 352], [462, 250], [458, 140]] },
  { k: 'a-ret1', kind: 'ret', q: [[516, 146], [530, 250], [526, 354]] },
  { k: 'a-regen', kind: 'c', q: [[660, 214], [736, 300], [742, 430], [676, 560], [524, 628], [384, 616]] },
  { k: 'a-atp2', kind: 'atp', q: [[428, 438], [426, 530], [432, 608]] },
  { k: 'a-ret2', kind: 'ret', q: [[494, 618], [496, 530], [490, 440]] },
  { k: 'a-out', kind: 'c', q: [[672, 196], [728, 182], [764, 140], [776, 96]] },
];
const CURVES = new Map(ARROWS.map(a => [a.k, curve(a.q)]));
const HEAD = (kind: Kind): [number, number] => (kind === 'c' ? [13, 7.5] : [11, 6.5]);

function arrowSvg(a: Arrow): string {
  const c = CURVES.get(a.k)!, d = `M${c.pts.map(p => `${f(p[0])},${f(p[1])}`).join('L')}`, L = f(c.L);
  const [hl, hw] = HEAD(a.kind), head = `<path data-k="${a.k}-h" class="cbb-h-${a.kind}" d="M0,0L${-hl},${hw}L${-hl},${-hw}Z"/>`;
  const thin = a.kind === 'c' ? '' : ' cbb-a-thin';
  if (a.kind === 'ret') {
    return G(a.k, `<mask id="${P}-m-${a.k}" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740">
      <path data-k="${a.k}-s" d="${d}" fill="none" stroke="#fff" stroke-width="16" stroke-dasharray="${L} ${L}" stroke-dashoffset="${L}"/></mask>
      <g mask="url(#${P}-m-${a.k})"><path class="cbb-a cbb-a-ret" d="${d}"/></g>${head}`);
  }
  return G(a.k, `<path data-k="${a.k}-s" class="cbb-a cbb-a-${a.kind}${thin}" d="${d}" stroke-dasharray="${L} ${L}" stroke-dashoffset="${L}"/>${head}`);
}

/** A molecule's name, with its count before it (hidden until set) and an optional plural ending; centred on (0, 0) as one
 *  line, so that the name never shifts when the count shows. */
const nameSvg = (k: string, name: string, cnt = '', plural = ''): string =>
  `<g data-k="${k}" display="none"><text class="cq-name" x="0" y="0" text-anchor="middle">${cnt ? `<tspan data-k="${k}-n" fill-opacity="0" stroke-opacity="0">${cnt} </tspan>` : ''}${name}${plural ? `<tspan data-k="${k}-p" fill-opacity="0" stroke-opacity="0">${plural}</tspan>` : ''}</text></g>`;

/** The thylakoid in the middle of the cycle: a small lens of bilayer round its lumen. */
function thylakoid(): string {
  const [cx, cy] = AT.thyl, rx = 98, ry = 40;
  const d = `M${cx - rx},${cy}A${rx},${ry} 0 1 0 ${cx + rx},${cy}A${rx},${ry} 0 1 0 ${cx - rx},${cy}Z`;
  return `<path class="cel-lumen" d="${d}"/>${bilayer([{ A: [cx, cy, rx, ry, -90, 270] }], 9, 2.2, 5.6)}${T(cx, cy + 6, 'thylakoid', 'cq-zone')}`;
}

function cycleSvg(): string {
  const [rx, ry] = AT.rub;
  return `
    ${G('g-rubp', `<ellipse cx="${AT.rubp[0]}" cy="${AT.rubp[1]}" rx="112" ry="34" fill="url(#${P}-glow)"/>`)}
    ${G('g-out', `<ellipse cx="${AT.out[0]}" cy="${AT.out[1]}" rx="76" ry="32" fill="url(#${P}-glow)"/>`)}
    ${G('g-atp1', `<ellipse cx="398" cy="252" rx="46" ry="26" fill="url(#${P}-glow)"/>`)}
    ${G('g-nadph', `<ellipse cx="462" cy="252" rx="58" ry="26" fill="url(#${P}-glow)"/>`)}
    ${G('g-atp2', `<ellipse cx="426" cy="530" rx="46" ry="26" fill="url(#${P}-glow)"/>`)}
    ${G('thyl', thylakoid())}
    ${ARROWS.map(arrowSvg).join('')}
    ${G('rub', `<image href="${rubPng}" x="${f(rx - RUB_W / 2)}" y="${f(ry - RUB_H / 2)}" width="${f(RUB_W)}" height="${f(RUB_H)}"/>${T(150, 328, 'RuBisCO', 'cq-prot')}`)}
    ${G('co2', `${balls(AT.co2[0], AT.co2[1], 'OCO')}${T(AT.co2[0], AT.co2[1] - 26, '3 CO₂', 'cq-name')}`)}
    ${G('rubp', `${gl(row(AT.rubp[0], AT.rubp[1], 'PCCCCCP', { r: R }))}${T(AT.rubp[0], AT.rubp[1] + 38, 'RuBP', 'cq-name')}`)}
    ${G('pga', gl(row(AT.pga[0], AT.pga[1], 'CCCP', { r: R })))}
    ${G('tp', gl(row(AT.tp[0], AT.tp[1], 'CCCP', { r: R })))}
    ${G('out', gl(row(AT.out[0], AT.out[1], 'CCCP', { r: R })))}
    ${G('pl-carb', T(150, 474, 'carboxylation', 'cq-proc'))}
    ${G('pl-red', T(452, 108, 'reduction', 'cq-proc'))}
    ${G('pl-regen', T(586, 672, 'regeneration', 'cq-proc'))}
    ${G('t-atp1', gl(tagG(398, 252, 'ATP', 'atp')))}
    ${G('t-nadph', gl(tagG(462, 252, 'NADPH', 'nadph')))}
    ${G('t-ret1', gl(`${tagG(578, 262, 'ADP', 'atp')}${tagG(578, 297, '', 'pi')}${tagG(578, 332, 'NADP⁺', 'plain')}`))}
    ${G('t-atp2', gl(tagG(426, 530, 'ATP', 'atp')))}
    ${G('t-ret2', gl(tagG(538, 530, 'ADP', 'atp')))}
    ${G('k-back', T(714, 256, '5', 'cq-cnt', 'start'))}
    ${G('k-out', T(778, 168, '1', 'cq-cnt', 'start'))}
    ${G('q-out', T(AT.out[0], AT.out[1] - 24, '?', 'cq-q'))}`;
}

/* ---------------------------------------------------------------- the cards (stage units) */

/** The card slot on the right, and the image width inside it. */
const CX = 860, CW = 716, IX = CX + 20, IW = CW - 40;
const LOL = { w: 1274, h: 884 }, F5 = { w: 1349, h: 1025 }, B54 = { w: 1410, h: 840 };
const IY = 78;
const fs = IW / F5.w, bs = IW / B54.w;
/** Points on the 5 s film and on the 1954 figure (file pixels) → stage. */
const onF5 = (q: V): V => [IX + q[0] * fs, IY + q[1] * fs];
const onB54 = (q: V): V => [IX + q[0] * bs, IY + q[1] * bs];
const PGA_SPOT = onF5([974, 716]);
/** The lollipop, large and centred (beat 1). */
const LW = 860, LS = LW / LOL.w, LX = 370, LY = 70;
const onLol = (q: V): V => [LX + q[0] * LS, LY + q[1] * LS];

function card(k: string, x: number, y: number, w: number, h: number, inner: string, rot: number, seed: number): string {
  return G(k, `<g transform="rotate(${rot} ${f(x + w / 2)} ${f(y + h / 2)})"><path class="cq-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${P}-sh)"/>${inner}</g>`);
}
/** A veil over an image (x, y, w, h) with holes (mask markup in black). */
const veil = (k: string, x: number, y: number, w: number, h: number, holes: string): string =>
  G(k, `<mask id="${P}-vm-${k}" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="740"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#fff"/>${holes}</mask>
    <rect class="cq-veil" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" mask="url(#${P}-vm-${k})"/>`);
/** A region of the 1954 figure (file pixels) as a path in stage units. */
const regionB54 = (q: V[]): string => `M${q.map(p => onB54(p)).map(p => `${f(p[0])},${f(p[1])}`).join('L')}Z`;
const B54_RED: V[] = [[392, 298], [1002, 298], [1002, 496], [392, 496]];
const B54_REGEN: V[] = [[66, 498], [848, 498], [848, 346], [1338, 346], [1338, 840], [66, 840]];
/** A pill: a short name on a paper chip, with a leader to its target. */
function pill(k: string, at: V, s: string, to: V): string {
  const w = s.length * 10.6 + 26;
  const ex = to[0] < at[0] ? at[0] - w / 2 : at[0] + w / 2;
  return G(k, `<path class="cq-ld" d="M${f(ex)},${f(at[1])}L${f(to[0])},${f(to[1])}"/><circle class="cq-ldt" cx="${f(to[0])}" cy="${f(to[1])}" r="3.2"/>
    <rect class="cq-pill" x="${f(at[0] - w / 2)}" y="${f(at[1] - 17)}" width="${f(w)}" height="34" rx="17"/>${T(at[0], at[1] + 6.5, s, 'cq-pillt')}`);
}

function cardsSvg(): string {
  const lh = LOL.h * LS, fh = F5.h * fs, bh = B54.h * bs;
  const flask = onLol([566, 360]), beaker = onLol([562, 742]);
  const lol = card('c-lol', LX - 20, 20, LW + 40, lh + 110, `${T(LX, 56, 'the “lollipop”', 'cq-ctitle', 'start')}
      <image href="${lolJpg}" x="${LX}" y="${LY}" width="${LW}" height="${f(lh)}"/>
      ${T(LX, LY + lh + 26, 'Berkeley Lab photo (R. M. Couto) · © The Regents of the University of California', 'cq-ccr', 'start')}`, -0.6, 23)
    + pill('p-algae', [flask[0] + 128, flask[1] - 34], 'algae in light', flask) + pill('p-alc', [beaker[0] + 116, beaker[1] + 4], 'alcohol', beaker);
  const film = card('c-f5', CX, 30, CW, fh + 104, `${T(IX, 64, 'Calvin: 5 s of ¹⁴CO<tspan class="cq-sub" dy="5">2</tspan>', 'cq-ctitle', 'start')}
      <image class="cq-mult" href="${f5Png}" x="${IX}" y="${IY}" width="${IW}" height="${f(fh)}"/>
      ${veil('v-f5', IX, IY, IW, fh, `<ellipse cx="${f(PGA_SPOT[0])}" cy="${f(PGA_SPOT[1])}" rx="25" ry="31" fill="#000"/>`)}
      ${G('r-pga', `<ellipse class="cq-mark" cx="${f(PGA_SPOT[0])}" cy="${f(PGA_SPOT[1])}" rx="23" ry="29"/>`)}
      ${T(IX, IY + fh + 26, 'Calvin 1961, Nobel lecture, Fig. 6 · © The Nobel Foundation 1961', 'cq-ccr', 'start')}`, 0.6, 29);
  const b54 = card('c-b54', CX, 30, CW, bh + 104, `${T(IX, 64, 'Bassham et al. 1954', 'cq-ctitle', 'start')}
      <image class="cq-mult" href="${b54Png}" x="${IX}" y="${IY}" width="${IW}" height="${f(bh)}"/>
      ${veil('v-red', IX, IY, IW, bh, `<path d="${regionB54(B54_RED)}" fill="#000"/>`)}
      ${veil('v-regen', IX, IY, IW, bh, `<path d="${regionB54(B54_REGEN)}" fill="#000"/>`)}
      ${G('o-red', `<path class="cq-mark2" d="${regionB54(B54_RED)}"/>`)}
      ${G('o-regen', `<path class="cq-mark2" d="${regionB54(B54_REGEN)}"/>`)}
      ${T(IX, IY + bh + 26, 'J Am Chem Soc 76:1760, Fig. 7 (via Sharkey 2019, Fig. 2)', 'cq-ccr', 'start')}`, -0.5, 31);
  return lol + film + b54;
}

/** The one line of a beat, on a panel under the card. */
const LEDGER = { x: CX + 20, y: 588, w: CW - 40, h: 66 };
function ledgerSvg(): string {
  const cx = LEDGER.x + LEDGER.w / 2, cy = LEDGER.y + LEDGER.h / 2 + 9;
  return `${G('ledger', `<rect class="cq-panel" x="${LEDGER.x}" y="${LEDGER.y}" width="${LEDGER.w}" height="${LEDGER.h}" rx="14"/>`)}
    ${G('lg-3', T(cx, cy, '3 RuBP = 15 C = 5 × 3 C', 'cq-line'))}
    ${G('lg-9', T(cx, cy, '9 ATP + 6 NADPH used', 'cq-line'))}`;
}

/* ---------------------------------------------------------------- the moving pieces */

/** ¹⁴CO₂ (beat 1): from the left margin into the lollipop's neck. */
const NECK = onLol([490, 214]);
const C14_PATH = curve([[560, 104], [640, 120], NECK]);
/** The drop of algae from the stopcock into the alcohol (beat 1). */
const COCK = onLol([497, 584]), ALC = onLol([510, 722]);
/** The names that travel from the evidence to the cycle (beats 2 and 3). */
const PGA_FROM: V = [PGA_SPOT[0] + 8, PGA_SPOT[1] - 44], PGA_TO: V = [AT.pga[0] - 8, AT.pga[1] - 32];
const PGA_FLY = curve([PGA_FROM, [1120, 320], [700, 214], PGA_TO]);
const TP_ON = onB54([918, 368]);
const TP_FROM: V = [TP_ON[0], TP_ON[1] - 38], TP_TO: V = [AT.tp[0] + 22, AT.tp[1] - 32];
const TP_FLY = curve([TP_FROM, [1060, 186], [820, 164], TP_TO]);

/* ---------------------------------------------------------------- the staging */

export const STAGING_BASE: Staging = {
  id: 'q',
  name: 'q · From Calvin’s spots to the cycle',
  note: 'The lollipop; Calvin’s 5 s film with 3-PGA lit; Bassham 1954’s cycle lit part by part while the cycle is drawn after it, the names travelling from the evidence to the drawing; counts per 3 CO₂ on the cycle, 3 RuBP = 15 C = 5 × 3 C, and 9 ATP + 6 NADPH used',
  beats: CB1V2,
  svg: () => `<defs>
      <filter id="${P}-sh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <radialGradient id="${P}-glow"><stop offset="0" stop-color="#f8c75a" stop-opacity=".7"/><stop offset=".6" stop-color="#f8d98a" stop-opacity=".3"/><stop offset="1" stop-color="#fbe6b0" stop-opacity="0"/></radialGradient>
    </defs><g class="cq fig">
      ${cycleSvg()}
      ${cardsSvg()}
      ${ledgerSvg()}
      ${G('drop', '<ellipse class="cq-drop" rx="7" ry="9.5"/>')}
      ${G('c14', `<rect class="cq-pill" x="-126" y="-17" width="74" height="34" rx="17"/>${T(-89, 6.5, '¹⁴CO₂', 'cq-pillt')}<circle class="cq-c14" r="17"/>${balls(0, 0, 'OCO')}`)}
      ${nameSvg('n-pga', '3-PGA', '6')}
      ${nameSvg('n-tp', 'triose phosphate', '6', 's')}
    </g>`,

  bind(stage) {
    const cache = new Map<Element, Map<string, string>>();
    const els = new Map<string, Element>();
    stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
    const set = (k: string, a: string, v: string): void => {
      const el = els.get(k);
      if (!el) return;
      let m = cache.get(el);
      if (!m) { m = new Map(); cache.set(el, m); }
      if (m.get(a) === v) return;
      m.set(a, v);
      el.setAttribute(a, v);
    };
    const op = (k: string, v: number): void => {
      set(k, 'display', v < 0.004 ? 'none' : 'inline');
      set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
    };
    const tsp = (k: string, v: number): void => { set(k, 'fill-opacity', v.toFixed(3)); set(k, 'stroke-opacity', v.toFixed(3)); };
    const place = (k: string, at: V, o: number): void => { op(k, o); if (o >= 0.004) set(k, 'transform', `translate(${f(at[0])} ${f(at[1])})`); };
    /** An arrow drawn to fraction u of its length, its head riding the tip. */
    const draw = (a: Arrow, u: number): void => {
      op(a.k, u > 0.002 ? 1 : 0);
      if (u <= 0.002) return;
      const c = CURVES.get(a.k)!, [hl] = HEAD(a.kind), shaft = Math.max(0, u * c.L - 0.75 * hl), tip = c.at(u);
      set(`${a.k}-s`, 'stroke-dashoffset', f(c.L - shaft));
      set(`${a.k}-h`, 'transform', `translate(${f(tip.p[0])} ${f(tip.p[1])}) rotate(${f(tip.deg)})`);
      op(`${a.k}-h`, ease(u, 0.02, 0.12));
    };

    return (beat, t) => {
      /** Shown from beat b at t0 (fading in over d), and in every later beat. */
      const on = (b: number, t0: number, d = 0.4): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + d) : 0);
      /** Shown until beat b at t0 (fading out over d). */
      const off = (b: number, t0: number, d = 0.4): number => (beat < b ? 1 : beat === b ? 1 - ease(t, t0, t0 + d) : 0);
      /** Drawn in beat b from t0 over d, and whole in every later beat. */
      const grow = (b: number, t0: number, d: number): number => (beat > b ? 1 : beat === b ? ease2(t, t0, t0 + d) : 0);
      const only = (b: number): number => (beat === b ? 1 : 0);

      /* beat 1 · the lollipop: ¹⁴CO₂ in at the neck, the algae drained into the alcohol */
      op('c-lol', on(0, 0, 0.6) * off(1, 0, 0.35));
      place('c14', C14_PATH.at(beat === 0 ? ease2(t, 0.8, 2.0) : 1).p, on(0, 0.7, 0.25) * off(1, 0, 0.35));
      op('p-algae', on(0, 1.9, 0.3) * off(1, 0, 0.35));
      if (beat === 0 && t > 2.4 && t < 3.25) place('drop', [lerp(COCK[0], ALC[0], ease(t, 2.45, 3.05)), lerp(COCK[1], ALC[1], clamp((t - 2.45) / 0.6) ** 2)], ease(t, 2.4, 2.5) * (1 - ease(t, 3.0, 3.2)));
      else op('drop', 0);
      op('p-alc', on(0, 2.95, 0.3) * off(1, 0, 0.35));

      /* beat 2 · the 5 s film, 3-PGA lit; its name travels to the cycle; carboxylation drawn */
      const film = on(1, 0.25, 0.5) * off(2, 0, 0.4);
      op('c-f5', film);
      op('v-f5', on(1, 0.9, 0.5)); op('r-pga', on(1, 0.9, 0.5));
      const pgaU = beat === 1 ? ease2(t, 1.9, 3.1) : beat > 1 ? 1 : 0;
      place('n-pga', PGA_FLY.at(pgaU).p, on(1, 1.1, 0.35));
      tsp('n-pga-n', on(1, 4.9, 0.3));
      op('pga', on(1, 3.0, 0.4));
      op('co2', on(1, 3.1, 0.4)); op('rub', on(1, 3.25, 0.4)); op('rubp', on(1, 3.4, 0.4));
      draw(ARROWS[0], grow(1, 3.6, 0.6)); draw(ARROWS[1], grow(1, 3.7, 0.8)); draw(ARROWS[2], grow(1, 4.2, 0.8));
      op('pl-carb', on(1, 4.6, 0.4));

      /* beat 3 · Bassham 1954, the reduction lit; triose phosphate travels to the cycle; reduction drawn */
      op('c-b54', on(2, 0.25, 0.5));
      const red = on(2, 0.9, 0.5) * off(3, 0, 0.5), regen = on(3, 0, 0.5) * off(4, 0, 0.5);
      op('v-red', red); op('o-red', red);
      const tpU = beat === 2 ? ease2(t, 1.9, 3.1) : beat > 2 ? 1 : 0;
      place('n-tp', TP_FLY.at(tpU).p, on(2, 1.1, 0.35));
      tsp('n-tp-n', on(2, 4.7, 0.3)); tsp('n-tp-p', on(2, 4.7, 0.3));
      op('tp', on(2, 3.0, 0.4)); op('thyl', on(2, 3.1, 0.5));
      draw(ARROWS[3], grow(2, 3.4, 1.0)); op('pl-red', on(2, 3.9, 0.4));
      draw(ARROWS[4], grow(2, 3.6, 0.7)); op('t-atp1', on(2, 3.88, 0.3));
      draw(ARROWS[5], grow(2, 3.7, 0.7)); op('t-nadph', on(2, 3.98, 0.3));
      draw(ARROWS[6], grow(2, 4.5, 0.7)); op('t-ret1', on(2, 4.8, 0.3));

      /* beat 4 · the regeneration loop lit; 5 back to RuBP, closing the cycle; 1 out; the one line */
      op('v-regen', regen); op('o-regen', regen);
      draw(ARROWS[7], grow(3, 0.9, 1.4)); op('k-back', on(3, 1.2, 0.3)); op('pl-regen', on(3, 1.8, 0.4));
      draw(ARROWS[8], grow(3, 1.5, 0.7)); op('t-atp2', on(3, 1.8, 0.3));
      draw(ARROWS[9], grow(3, 2.3, 0.7)); op('t-ret2', on(3, 2.62, 0.3));
      op('g-rubp', only(3) * ease(t, 2.2, 2.5) * (1 - ease(t, 3.0, 3.6)));
      draw(ARROWS[10], grow(3, 3.0, 0.8)); op('k-out', on(3, 3.4, 0.3)); op('out', on(3, 3.6, 0.3));
      op('ledger', on(3, 4.0, 0.4));
      op('lg-3', on(3, 4.1, 0.4) * off(4, 0.3, 0.35));

      /* beat 5 · the total; its tags glow; the triose phosphate that left is asked about */
      op('lg-9', on(4, 0.7, 0.4));
      const g = on(4, 0.7, 0.5);
      op('g-atp1', g); op('g-nadph', g); op('g-atp2', g);
      op('g-out', on(4, 1.4, 0.4)); op('q-out', on(4, 1.4, 0.4));
    };
  },
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026: "people don't read the
 *  text under the animation"). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 1, lines: ['First product: 3-PGA'], x: 630, y: 360, size: 40, at: 1.5 },
  { beat: 2, lines: ['ATP and NADPH make', 'triose phosphate'], x: 1220, y: 640, size: 36, at: 1.5 },
  { beat: 4, lines: ['9 ATP + 6 NADPH used'], x: 800, y: 595, size: 40, at: 0.6, hide: ['[data-k="ledger"]', '[data-k="lg-3"]', '[data-k="lg-9"]'] },
  { beat: 4, lines: ['Where does the triose phosphate', 'that leaves the cycle go?'], x: 800, y: 595, size: 38, at: 1.5 },
]);
