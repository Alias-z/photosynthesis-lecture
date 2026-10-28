// cb1, variant p · "Carbon blocks" (slide C1 · C₃ photosynthesis; beats CB1V2 in beats-cb1k.ts; C1_ANIM_V2_BRIEF.md,
// lecturer, 29 Oct 2026, evening). A clean stage, no strip. The molecules of the cycle are drawn by their carbons only (the
// deck's C ball, figs/carbon-form.ts), so that the count of carbons is the picture. Carbons are plain: none is coloured by
// origin. One fixed framing; on screen only names and the 2 lines the lecturer kept.
// - Beat 1, Carbon-14: the "lollipop" (Berkeley Lab photo), the algae and the alcohol pointed out; a ¹⁴CO₂ (the deck's
//   isotope ball) glides into the algae.
// - Beat 2, Carboxylation of RuBP (a click between): Calvin's 5 s film, its 3-PGA spot ringed. Then the stage: RuBisCO
//   (our render), 3 RuBP (3 rows of 5 C), 3 CO₂ and the thylakoid. Each RuBP goes into RuBisCO with 1 CO₂, and 2 3-PGA
//   (columns of 3 C) come out: 6 columns.
// - Beat 3, Reduction of 3-PGA: 1 ATP and 1 NADPH rise from the thylakoid under each 3-PGA; they go back as ADP, NADP⁺
//   and Pᵢ; the 6 columns are now triose phosphates.
// - Beat 4, Regeneration of RuBP (a click between): 1 triose phosphate slides out; the other 5 close up into one block of
//   3 × 5 C, whose bonds turn from 5 columns of 3 to 3 rows of 5: "3 RuBP = 15 C = 5 × 3 C". Then 3 ATP (back as ADP)
//   make the 3 rows RuBP, which glide back to where RuBP began.
// - Beat 5, Per 3 CO₂: "per 3 CO₂: 9 ATP + 6 NADPH used"; the triose phosphate that left is ringed.
import './cb1-p.css';
import '../figs/chain.css';
import '../figs/cell-schema.css';
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import f5Png from '../../assets/photos/c2-5s.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import rubG from '../../assets/cell/rubisco-g.png';
import { atomBall, row, step } from '../figs/carbon-form';
import { balls, bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { isoBall } from '../figs/l2-glyphs';
import { cutPath } from './antenna-common';
import { CB1V2 } from './beats-cb1k';
import type { Staging } from './types';
import { withKeys } from './stage-keys-cb';

type V = [number, number];
const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Smooth step of t between t0 and t1 (fades). */
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
/** Smoother step (zero first and second derivative at both ends), for every glide. */
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const vis = (s: string): number => s.replace(/<[^>]+>/g, '').length;

/* ---------------------------------------------------------------- places (stage units, 1600 × 740) */

const R = 15, S = step(R), PAD = 5;
/** Where RuBP sits: at the start of beat 2 and again at the end of beat 4. */
const A: V = [430, 430];
/** The 6 columns of 3 C (3-PGA, then triose phosphate), and the block of 3 × 5 C they close into. */
const BX = 1080, Y = 430, colX = (j: number): number => BX + (j - 2.5) * 76;
const RX = colX(2);
/** RuBP rows, centre to centre. */
const GAP = 46, rowY = (i: number): number => Y + (i - 1) * GAP;
const OUT: V = [1440, Y];
const RUB: V = [800, 172], RUB_W = 214, RUB_H = RUB_W * 471 / 548;
const INTO: V = [792, 186], FROM: V = [814, 196];
const CO2_AT = (k: number): V => [604, 104 + 44 * k];
/** Tags under each column (beat 3) and right of each RuBP row (beat 4); they rise from and sink back to the thylakoid. */
const TAG_Y = { atp: 514, nadph: 550, pi: 584 }, DROP = 240;
const ATP_X4 = RX + 2 * S + R + 8 + 23.4;
const BAND_Y = 712;
const LINE4: V = [800, 604], LINE5: V = [800, 650];

/* ---------------------------------------------------------------- schedule (seconds into each beat) */

// beat 1
const C14_T: [number, number] = [1.1, 3.1];
// beat 2: the film, a hold, then the stage and 3 carboxylations
const H2 = 1.6, SCENE_T = 2.0;
const CARB = (k: number): number => 3.0 + 0.55 * k, IN_D = 1.3, OUT_D = 1.4;
/** The 2 3-PGA of RuBP k, filled from the right so that no column flies over one already down. */
const PAIR = (k: number): [number, number] => [5 - 2 * k, 4 - 2 * k];
const prodT = (j: number): number => { const k = Math.floor((5 - j) / 2); return CARB(k) + 1.05 + ((5 - j) % 2) * 0.15; };
// beat 3
const RISE = (j: number): number => 0.3 + 0.1 * j, RISE_D = 1.5, SWAP3 = 2.5, SINK = (j: number): number => 3.3 + 0.08 * j, SINK_D = 1.4;
// beat 4: out and close-up, bonds turn, rows part; hold; 3 ATP; RuBP back
const CLOSE: [number, number] = [0.3, 1.5], TURN: [number, number] = [1.9, 3.0], L4 = 3.2, H4 = 3.9;
/** In the block the 5 columns stand 44 apart (their capsules just clear); as the bonds turn they close to touching rows. */
const CS = 44;
const P0 = 4.0, P_D = 1.4, SWAP4 = P0 + P_D + 0.1, SINK4 = SWAP4 + 0.4, BACK: [number, number] = [SWAP4 + 0.8, SWAP4 + 2.4];
const HOLDS = [[], [H2], [], [H4], []];

/* ---------------------------------------------------------------- glyphs (drawn at the origin) */

const gl = (s: string): string => `<g class="chn-g">${s}</g>`;
/** A pale capsule under a molecule that crosses a photo or a protein. */
const cap = (w: number, h: number): string => `<rect class="cbp-cap" x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}"/>`;
const CO2_R = 14;
const co2G = (): string => balls(0, 0, 'OCO', CO2_R);
/** ¹⁴CO₂: the deck's isotope ball (figs/l2-glyphs.ts, purple, 1.2 ×) between 2 O balls. */
const c14G = (): string => `${cap(5.8 * CO2_R, 2.4 * CO2_R + 8)}${balls(-1.75 * CO2_R, 0, 'O', CO2_R)}${balls(1.75 * CO2_R, 0, 'O', CO2_R)}${isoBall(0, 0, CO2_R)}`;
const tag = (s: string, k: 'atp' | 'nadph' | 'plain' | 'pi'): string => gl(tagG(0, 0, s, k));

/* ---------------------------------------------------------------- the two real images (beats 1 and 2) */

const LOL = { w: 1274, h: 884, W: 760 }, FILM = { w: 1349, h: 1025, W: 700 };
const lolS = LOL.W / LOL.w, lolX = 420, lolY = 112;
const filmS = FILM.W / FILM.w, filmX = 450, filmY = 108;
const onLol = (u: number, v: number): V => [lolX + u * lolS, lolY + v * lolS];
const onFilm = (u: number, v: number): V => [filmX + u * filmS, filmY + v * filmS];
/** A leader from a label to a point: dark line in a light halo, a dot at the point. */
const leader = (a: V, b: V): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="cbp-ldh" d="${d}"/><path class="cbp-ld" d="${d}"/><circle class="cbp-tip" cx="${f(b[0])}" cy="${f(b[1])}" r="3.5"/>`;
};
/** A label pill centred on p. */
const pill = (p: V, s: string): string => {
  const w = vis(s) * 11.4 + 26, h = 34;
  return `<rect class="cbp-pill" x="${f(p[0] - w / 2)}" y="${f(p[1] - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}"/>${T(p[0], p[1] + 7, s, 'cbp-pt')}`;
};
const paper = (k: string, x: number, y: number, w: number, h: number, inner: string, seed: number): string =>
  `<g data-k="${k}" display="none"><g transform="rotate(-0.6 ${f(x + w / 2)} ${f(y + h / 2)})">
    <path class="cbp-paper" d="${cutPath(x, y, w, h, seed, 3.2)}" filter="url(#cbp-sh)"/>${inner}</g></g>`;
const ALGAE = onLol(478, 395), FLASK = onLol(498, 755), SPOT = onFilm(970, 712);
function cards(): string {
  const lh = LOL.h * lolS, fh = FILM.h * filmS;
  const lol = paper('lol', lolX - 22, lolY - 66, LOL.W + 44, lh + 112, `
    ${T(lolX, lolY - 22, 'the “lollipop”', 'cbp-title', 'start')}
    <image href="${lolJpg}" x="${lolX}" y="${lolY}" width="${LOL.W}" height="${f(lh)}"/>
    ${T(lolX, lolY + lh + 28, 'Berkeley Lab photo (R. M. Couto) · © The Regents of the University of California', 'cbp-crd', 'start')}`, 23);
  const film = paper('film', filmX - 22, filmY - 66, FILM.W + 44, fh + 112, `
    ${T(filmX, filmY - 22, 'Calvin: 5 s of ¹⁴CO<tspan baseline-shift="sub" font-size="70%">2</tspan>', 'cbp-title', 'start')}
    <image href="${f5Png}" x="${filmX}" y="${filmY}" width="${FILM.W}" height="${f(fh)}"/>
    ${T(filmX, filmY + fh + 28, 'Calvin 1961, Nobel lecture, Fig. 6 · © The Nobel Foundation 1961', 'cbp-crd', 'start')}`, 29);
  const algaeL: V = [ALGAE[0] - 150, ALGAE[1] - 92], flaskL: V = [FLASK[0] + 168, FLASK[1] + 34], pgaL: V = [SPOT[0] - 96, SPOT[1] - 58];
  return `${lol}${film}
    <g data-k="lol-l" display="none">${leader([algaeL[0] + 30, algaeL[1] + 17], [ALGAE[0] - 30, ALGAE[1] - 6])}${pill(algaeL, 'algae')}
      ${leader([flaskL[0] - 40, flaskL[1] - 12], [FLASK[0] + 22, FLASK[1] + 2])}${pill(flaskL, 'alcohol')}</g>
    <g data-k="ring" display="none"><ellipse class="cbp-spot" cx="${f(SPOT[0])}" cy="${f(SPOT[1])}" rx="34" ry="38"/>
      <ellipse class="cbp-ring" cx="${f(SPOT[0])}" cy="${f(SPOT[1])}" rx="34" ry="38"/>
      ${leader([pgaL[0] + 30, pgaL[1] + 12], [SPOT[0] - 26, SPOT[1] - 24])}${pill(pgaL, '3-PGA')}</g>`;
}

/* ---------------------------------------------------------------- the stage */

const NB = 18;
function svg(): string {
  const tags = [0, 1, 2, 3, 4, 5].map(j => `<g data-k="pi${j}" display="none">${tag('', 'pi')}</g><g data-k="at${j}" display="none">${tag('ATP', 'atp')}</g>
    <g data-k="ad${j}" display="none">${tag('ADP', 'atp')}</g><g data-k="nd${j}" display="none">${tag('NADPH', 'nadph')}</g>
    <g data-k="np${j}" display="none">${tag('NADP⁺', 'plain')}</g>`).join('')
    + [0, 1, 2].map(m => `<g data-k="rat${m}" display="none">${tag('ATP', 'atp')}</g><g data-k="rad${m}" display="none">${tag('ADP', 'atp')}</g>`).join('');
  const band = `<g data-k="band" display="none"><rect class="cel-lumen" x="-20" y="${BAND_Y + 19}" width="1640" height="40"/>
    ${bilayer([{ L: [-20, BAND_Y, 1620, BAND_Y] }])}${T(18, BAND_Y - 30, 'thylakoid', 'cbp-zone', 'start')}
    ${T(1584, BAND_Y - 30, 'RuBisCO: PDB 8RUC', 'cbp-crd', 'end')}</g>`;
  const glow = `<g data-k="glow" display="none"><rect class="cbp-glow" x="${f(OUT[0] - R - 14)}" y="${f(Y - S - R - 14)}" width="${f(2 * R + 28)}" height="${f(2 * S + 2 * R + 28)}" rx="${f(R + 14)}"/></g>`;
  const bonds = [0, 1, 2, 3, 4, 5].map(j => `<rect data-k="vc${j}" class="cbp-mol" display="none" rx="${R + PAD}"/><path data-k="vb${j}" class="cbp-bond" display="none" d="M0,0"/>`).join('')
    + [0, 1, 2].map(i => `<rect data-k="hc${i}" class="cbp-mol" display="none" rx="${R + PAD}"/><path data-k="hb${i}" class="cbp-bond" display="none" d="M0,0"/>`).join('');
  const carbons = Array.from({ length: NB }, (_, n) => `<g data-k="b${n}" display="none">${atomBall(0, 0, 'C', R)}</g>`).join('');
  const rw = 4 * S + 2 * R + 2 * PAD, rh = 2 * R + 2 * PAD;
  const rubp0 = [0, 1, 2].map(k => `<g data-k="ra${k}" display="none"><rect class="cbp-mol" x="${f(-rw / 2)}" y="${f(-rh / 2)}" width="${f(rw)}" height="${f(rh)}" rx="${R + PAD}"/>${gl(row(0, 0, 'CCCCC', { r: R }))}</g>`).join('');
  const co2 = [0, 1, 2].map(k => `<g data-k="co${k}" display="none">${co2G()}</g>`).join('');
  const rub = `<g data-k="rub" display="none"><image href="${rubPng}" x="${f(RUB[0] - RUB_W / 2)}" y="${f(RUB[1] - RUB_H / 2)}" width="${RUB_W}" height="${f(RUB_H)}"/></g>
    <g data-k="rubg" display="none"><image href="${rubG}" x="${f(RUB[0] - RUB_W / 2)}" y="${f(RUB[1] - RUB_H / 2)}" width="${RUB_W}" height="${f(RUB_H)}"/></g>`;
  const names = `<g data-k="n-rub" display="none">${T(RUB[0], RUB[1] - RUB_H / 2 - 12, 'RuBisCO', 'cbp-name')}</g>
    <g data-k="n-rubg" display="none">${T(RUB[0], RUB[1] - RUB_H / 2 - 12, 'RuBisCO', 'cbp-name cbp-dim')}</g>
    <g data-k="n-co2" display="none">${T(CO2_AT(0)[0], CO2_AT(0)[1] - 28, 'CO₂', 'cbp-name')}</g>
    <g data-k="n-rubp" display="none">${T(0, -GAP - R - 16, 'RuBP', 'cbp-name')}</g>
    <g data-k="n-pga" display="none">${T(BX, Y - S - R - 18, '3-PGA', 'cbp-name')}</g>
    <g data-k="n-tp" display="none">${T(BX, Y - S - R - 18, 'triose phosphate', 'cbp-name')}</g>
    <g data-k="n-out" display="none">${T(OUT[0], Y + S + R + 30, 'triose phosphate', 'cbp-name')}</g>`;
  const lines = `<g data-k="line4" display="none">${T(LINE4[0], LINE4[1], '3 RuBP = 15 C = 5 × 3 C', 'cbp-line')}</g>
    <g data-k="line5" display="none">${T(LINE5[0], LINE5[1], 'per 3 CO₂: 9 ATP + 6 NADPH used', 'cbp-line')}</g>`;
  const c14 = `<g data-k="c14" display="none">${c14G()}${T(0, -30, '¹⁴CO₂', 'cbp-name cbp-halo')}</g>`;
  return `<defs><filter id="cbp-sh" x="-12%" y="-10%" width="124%" height="124%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".2"/></filter></defs>
    <g class="fig cbp">${tags}${band}${glow}${bonds}${carbons}${rubp0}${co2}${rub}${names}${lines}${cards()}${c14}</g>`;
}

/* ---------------------------------------------------------------- where the 18 carbons are */

interface Carbons { p: V[]; o: number[]; vb: number[]; hb: number[] }
/** Column j's centre while it flies from RuBisCO to its place (beat 2), u in 0–1. */
const flight = (j: number, u: number): V => bez(FROM, [colX(j), 250], [colX(j), Y], u);
/** Carbon n = 3j + i is carbon i (top to bottom) of column j; in the block it is carbon j of RuBP row i. */
function carbons(beat: number, t: number): Carbons {
  const p: V[] = [], o: number[] = [], vb = [0, 0, 0, 0, 0, 0], hb = [0, 0, 0];
  for (let n = 0; n < NB; n++) { p.push([0, 0]); o.push(0); }
  const col = (j: number, c: V, op: number, dy = S): void => {
    for (let i = 0; i < 3; i++) { p[3 * j + i] = [c[0], c[1] + (i - 1) * dy]; o[3 * j + i] = op; }
    vb[j] = op;
  };
  if (beat === 1) {
    for (let j = 0; j < 6; j++) {
      const t0 = prodT(j), u = ease2(t, t0, t0 + OUT_D);
      if (t >= t0) col(j, flight(j, u), ease(t, t0 + 0.05, t0 + 0.3));
    }
  } else if (beat === 2) for (let j = 0; j < 6; j++) col(j, [colX(j), Y], 1);
  else if (beat === 3) {
    // the 6th leaves; the 5 close up into one block (3 × 5 C, touching), whose bonds then turn; the rows part
    col(5, [lerp(colX(5), OUT[0], ease2(t, CLOSE[0], CLOSE[1] + 0.1)), Y], 1);
    const uc = ease2(t, CLOSE[0], CLOSE[1]), ut = ease2(t, TURN[0], TURN[1]);
    const back = ease2(t, BACK[0], BACK[1]), g = bez([0, 0], [(A[0] - RX) / 2, 48], [A[0] - RX, 0], back);
    for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) {
      const x = RX + (j - 2) * lerp(lerp(76, CS, uc), S, ut), y = Y + (i - 1) * lerp(S, GAP, ut);
      p[3 * j + i] = [x + g[0], y + g[1]]; o[3 * j + i] = 1;
    }
    const v = 1 - ease(t, CLOSE[1] + 0.1, TURN[0] + 0.1), h = ease(t, TURN[1] - 0.15, TURN[1] + 0.3);
    for (let j = 0; j < 5; j++) vb[j] = v;
    for (let i = 0; i < 3; i++) hb[i] = h;
  } else if (beat === 4) {
    col(5, OUT, 1);
    for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) { p[3 * j + i] = [A[0] + (j - 2) * S, rowY(i)]; o[3 * j + i] = 1; }
    for (let i = 0; i < 3; i++) hb[i] = 1;
  }
  return { p, o, vb, hb };
}

/* ---------------------------------------------------------------- binding */

function bind(stage: SVGSVGElement): (beat: number, t: number) => void {
  const els = new Map<string, Element>();
  stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
  const cache = new WeakMap<Element, Map<string, string>>();
  const set = (k: string, a: string, v: string): void => {
    const el = els.get(k); if (!el) return;
    let m = cache.get(el); if (!m) { m = new Map(); cache.set(el, m); }
    if (m.get(a) === v) return; m.set(a, v);
    el.setAttribute(a, v);
  };
  const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
  const put = (k: string, p: V, v: number): void => { op(k, v); if (v >= 0.004) set(k, 'transform', `translate(${f(p[0])} ${f(p[1])})`); };
  /** Tags fade in as they rise out of the thylakoid and fade out as they sink back into it. */
  const ramp = (y: number): number => 1 - ease(y, 640, 700);
  const line = (a: V, b: V): string => `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  /** A molecule's capsule round the balls from a to b. */
  const box = (k: string, a: V, b: V): void => {
    const x0 = Math.min(a[0], b[0]) - R - PAD, y0 = Math.min(a[1], b[1]) - R - PAD;
    set(k, 'x', f(x0)); set(k, 'y', f(y0)); set(k, 'width', f(Math.abs(b[0] - a[0]) + 2 * R + 2 * PAD)); set(k, 'height', f(Math.abs(b[1] - a[1]) + 2 * R + 2 * PAD));
  };

  return (beat, t) => {
    // beat 1: the lollipop, its 2 labels, ¹⁴CO₂ gliding into the algae
    op('lol', beat === 0 ? ease(t, 0.1, 0.7) : beat === 1 ? 1 - ease(t, 0, 0.4) : 0);
    op('lol-l', beat === 0 ? ease(t, 0.8, 1.2) : beat === 1 ? 1 - ease(t, 0, 0.3) : 0);
    if (beat === 0) {
      const u = ease2(t, C14_T[0], C14_T[1]);
      put('c14', bez([256, 236], [470, 150], [ALGAE[0] - 6, ALGAE[1] - 34], u), ease(t, C14_T[0] - 0.2, C14_T[0] + 0.2) * (1 - ease(t, C14_T[1] - 0.35, C14_T[1] + 0.15)));
    } else op('c14', 0);
    // beat 2, step 1: the film, its 3-PGA spot ringed
    op('film', beat === 1 ? ease(t, 0.2, 0.8) * (1 - ease(t, H2 + 0.1, H2 + 0.6)) : 0);
    op('ring', beat === 1 ? ease(t, 0.9, 1.4) * (1 - ease(t, H2 + 0.1, H2 + 0.5)) : 0);
    // the stage: RuBisCO (in colour while it works), the thylakoid
    const scene = beat === 0 ? 0 : beat === 1 ? ease(t, SCENE_T, SCENE_T + 0.6) : 1;
    const grey = beat <= 1 ? 0 : beat === 2 ? ease(t, 0, 0.6) : 1;
    op('rub', scene * (1 - grey)); op('rubg', scene * grey);
    op('n-rub', scene * (1 - grey)); op('n-rubg', scene * grey);
    op('band', scene);
    // RuBP 1–3 and CO₂ 1–3, then into RuBisCO
    for (let k = 0; k < 3; k++) {
      const y0: V = [A[0], rowY(k)], t0 = CARB(k);
      if (beat === 1) {
        const u = ease2(t, t0, t0 + IN_D), gone = ease(t, t0 + IN_D - 0.35, t0 + IN_D);
        put(`ra${k}`, bez(y0, [600, 250], INTO, u), scene * (1 - gone));
        put(`co${k}`, bez(CO2_AT(k), [700, CO2_AT(k)[1] + 10], [INTO[0], INTO[1] - 12], u), scene * (1 - gone));
      } else { op(`ra${k}`, 0); op(`co${k}`, 0); }
    }
    op('n-co2', beat === 1 ? scene * (1 - ease(t, CARB(0), CARB(0) + 0.4)) : 0);
    // the 18 carbons and their bonds
    const C = carbons(beat, t);
    for (let n = 0; n < NB; n++) put(`b${n}`, C.p[n], C.o[n] * scene);
    for (let j = 0; j < 6; j++) {
      const o = C.vb[j] * scene; op(`vb${j}`, o); op(`vc${j}`, o);
      if (o > 0.004) { set(`vb${j}`, 'd', line(C.p[3 * j], C.p[3 * j + 2])); box(`vc${j}`, C.p[3 * j], C.p[3 * j + 2]); }
    }
    for (let i = 0; i < 3; i++) {
      const o = C.hb[i]; op(`hb${i}`, o); op(`hc${i}`, o);
      if (o > 0.004) { set(`hb${i}`, 'd', line(C.p[i], C.p[12 + i])); box(`hc${i}`, C.p[i], C.p[12 + i]); }
    }
    // names
    const rubpAt: V = beat === 3 ? C.p[7] : A;
    put('n-rubp', rubpAt, beat === 1 ? scene * (1 - ease(t, CARB(0), CARB(0) + 0.4)) : beat === 3 ? ease(t, SWAP4 + 0.1, SWAP4 + 0.5) : beat === 4 ? 1 : 0);
    op('n-pga', beat === 1 ? ease(t, prodT(0) + OUT_D - 0.2, prodT(0) + OUT_D + 0.3) : beat === 2 ? 1 - ease(t, SWAP3 + 0.1, SWAP3 + 0.5) : 0);
    op('n-tp', beat === 2 ? ease(t, SWAP3 + 0.3, SWAP3 + 0.7) : beat === 3 ? 1 - ease(t, CLOSE[0], CLOSE[0] + 0.4) : 0);
    op('n-out', beat === 3 ? ease(t, CLOSE[1] - 0.1, CLOSE[1] + 0.3) : beat === 4 ? 1 : 0);
    // beat 3: 1 ATP and 1 NADPH up under each 3-PGA; back down as ADP, NADP⁺ and Pᵢ
    for (let j = 0; j < 6; j++) {
      if (beat !== 2) { for (const k of ['at', 'nd', 'ad', 'np', 'pi']) op(`${k}${j}`, 0); continue; }
      const x = colX(j), up = 1 - ease2(t, RISE(j), RISE(j) + RISE_D), down = ease2(t, SINK(j), SINK(j) + SINK_D);
      const dy = DROP * (t < SWAP3 ? up : down), sw = ease(t, SWAP3, SWAP3 + 0.35);
      const yA = TAG_Y.atp + dy, yN = TAG_Y.nadph + dy, yP = lerp(TAG_Y.nadph, TAG_Y.pi, ease2(t, SWAP3 + 0.1, SWAP3 + 0.6)) + dy;
      put(`at${j}`, [x, yA], ramp(yA) * (1 - sw)); put(`ad${j}`, [x, yA], ramp(yA) * sw);
      put(`nd${j}`, [x, yN], ramp(yN) * (1 - sw)); put(`np${j}`, [x, yN], ramp(yN) * sw);
      put(`pi${j}`, [x, yP], ramp(yP) * ease(t, SWAP3 + 0.1, SWAP3 + 0.3));
    }
    // beat 4: 3 ATP up to the 3 rows; back down as ADP
    for (let m = 0; m < 3; m++) {
      if (beat !== 3) { op(`rat${m}`, 0); op(`rad${m}`, 0); continue; }
      const up = 1 - ease2(t, P0, P0 + P_D), down = ease2(t, SINK4, SINK4 + 1.3), dy = DROP * 1.4 * (t < SWAP4 ? up : down);
      const y = rowY(m) + dy, sw = ease(t, SWAP4, SWAP4 + 0.35);
      put(`rat${m}`, [ATP_X4, y], ramp(y) * (1 - sw)); put(`rad${m}`, [ATP_X4, y], ramp(y) * sw);
    }
    // the 2 lines, and the triose phosphate that left, ringed
    op('line4', beat === 3 ? ease(t, L4, L4 + 0.5) : beat === 4 ? 1 : 0);
    op('line5', beat === 4 ? ease(t, 0.3, 0.8) : 0);
    op('glow', beat === 4 ? ease(t, 1.0, 1.6) : 0);
  };
}

const STAGING_BASE: Staging = {
  id: 'p',
  name: 'p · Carbon blocks',
  note: 'A clean stage: the carbons as the deck’s C balls. 3 RuBP (3 rows of 5 C) + 3 CO₂ through RuBisCO → 6 3-PGA (columns of 3 C); 1 ATP + 1 NADPH under each → 6 triose phosphates; 1 slides out, the other 5 close into one block whose bonds turn from 5 columns of 3 to 3 rows of 5 (3 RuBP = 15 C = 5 × 3 C); 3 ATP; RuBP back. Lollipop photo, Calvin’s 5 s film',
  beats: CB1V2,
  holds: HOLDS,
  svg,
  bind,
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026: "people don't read the
 *  text under the animation"). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 1, lines: ['First product: 3-PGA'], x: 330, y: 360, size: 40, at: 1.5 },
  { beat: 2, lines: ['ATP and NADPH make', 'triose phosphate'], x: 330, y: 400, size: 38, at: 1.5 },
  { beat: 4, lines: ['Where does the triose', 'phosphate that leaves', 'the cycle go?'], x: 800, y: 360, size: 44, at: 1.5 },
]);
