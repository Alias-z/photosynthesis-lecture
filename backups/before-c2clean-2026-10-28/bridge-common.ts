// The light → dark bridge (slide C0; lecturer, 28 Oct 2026), what both stagings share. The stage is one world: the 7m1
// chain (figs/chain.ts, all lit, glyph mode) at x 0–800 and the dark-reaction strip (figs/cell-schema.ts, the cycle lit,
// no counts, its cycle molecules left out) from x 800, flush at the seam. The camera (a staging's own path) moves over it;
// the moving molecules are the deck's glyphs: NADPH, ATP, ADP, Pᵢ and NADP⁺ tags (chain.ts), CO₂ atom balls, RuBP, 3-PGA
// and triose phosphate in carbon form (carbon-form.ts).
// - Beat 1: the chain; its NADPH and ATP glow.
// - Beat 2: the strip fades in beside it; copies of NADPH and ATP glide from the chain's tags along the strip's supply
//   arrows to GAPDH.
// - Beat 3: CO₂ comes into the stroma to RuBisCO, RuBP comes from PRK; both go into RuBisCO and 3-PGA comes out, moves to
//   GAPDH, meets ATP and NADPH, triose phosphate leaves; ADP + Pᵢ and NADP⁺ glide back to the chain's tags.
// - Beat 4, to bread (lecturer: "make the CO₂ turn into bread"): the leaf's starch granule glows (a night store); sucrose
//   leaves the leaf and fills a wheat grain with starch granules, which turns into a slice of bread. Staging 'world': the
//   sucrose glides off the strip's right edge into a grain drawn beyond it; staging 'inset': the grain and the bread in a
//   round inset over the frame (figs/grain.ts glyphs).
// - Beat 5: everything but RuBisCO fades back; RuBisCO glows and is named large. Leads into C2 "RuBisCO".
import './bridge.css';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { chainSvg, tagG, rowG, type Part as CPart } from '../figs/chain';
import { cellSvg, balls, LIT_C1, SPOT } from '../figs/cell-schema';
import { row } from '../figs/carbon-form';
import { breadG, grainG, GRANULES } from '../figs/grain';
import type { Staging } from './types';

export type V = [number, number];
export interface Cam { s: number; c: V }
const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Smooth step between t0 and t1. */
export const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
const lerpV = (a: V, b: V, u: number): V => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
export const lerpCam = (a: Cam, b: Cam, u: number): Cam => ({ s: lerp(a.s, b.s, u), c: lerpV(a.c, b.c, u) });
/** A point at fraction u along a polyline. */
function along(q: V[], u: number): V {
  const L = q.slice(1).map((p, i) => Math.hypot(p[0] - q[i][0], p[1] - q[i][1])), tot = L.reduce((a, b) => a + b, 0);
  let d = clamp(u) * tot;
  for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) return lerpV(q[i], q[i + 1], L[i] ? Math.min(1, d / L[i]) : 1); d -= L[i]; }
  return q[q.length - 1];
}

/* ---------------------------------------------------------------- the world: chain + strip, and where things are */

const ALLC: CPart[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
const X0 = 800;   // the strip's x 0 in the world
/** World points (strip coordinates + 800): the chain's NADPH and ATP tags, GAPDH, RuBisCO, PRK, the cycle's spots. */
export const W = {
  nadphTag: [612, 64] as V, atpTag: [783, 92] as V, nadpTag: [472, 64] as V, adpTag: [648, 92] as V,
  // from the strip's own spots (cell-schema.ts SPOT), so the bridge follows the strip's layout
  gapdh: [X0 + SPOT.gapdh[0], SPOT.gapdh[1]] as V, rub: [X0 + SPOT.rub[0], SPOT.rub[1]] as V, prk: [X0 + SPOT.prk[0], SPOT.prk[1]] as V,
  pga: [X0 + SPOT.pga[0], SPOT.pga[1]] as V, tp: [X0 + SPOT.tp[0], SPOT.tp[1]] as V, rubp: [X0 + SPOT.rubp[0], SPOT.rubp[1]] as V,
  co2: [X0 + SPOT.co2[0], SPOT.co2[1]] as V,
  starch: [X0 + SPOT.starch[0], SPOT.starch[1]] as V, sucrose: [X0 + 938, 45] as V, grain: [X0 + 1088, 46] as V,
};
/** Triose phosphate's way out: through TPT to the cytosol, where sucrose is made. */
const P_EXPORT: V[] = [[X0 + 400, 98], [X0 + 560, 96], [X0 + 760, 100], [X0 + 858, 98], [X0 + 900, 66]];
/** The round inset of staging 'inset', in stage units. */
const INSET = { c: [1330, 210] as V, r: 150 };
const P_NADPH: V[] = [W.nadphTag, [X0 + 100, 64], [X0 + 150, 96], [X0 + 184, 160]];
const P_ATP: V[] = [W.atpTag, [X0 + 86, 98], [X0 + 124, 146], [X0 + 180, 204]];
const P_BACK: V[] = [[X0 + 214, 150], [X0 + 176, 52], [X0 + 120, 32], [X0 - 40, 34]];
const RUB = { w: 548 * 0.2375, h: 471 * 0.2375 };

/** The moving glyphs, each drawn at the origin and placed by a transform. */
const GLYPHS: Record<string, string> = {
  nadph: tagG(0, 0, 'NADPH', 'nadph'), atp: tagG(0, 0, 'ATP', 'atp'),
  nadp: tagG(0, 0, 'NADP⁺', 'plain'), adp: rowG(0, 0, [['ADP', 'atp'], ['+', 'op'], ['', 'pi']]),
  co2: balls(0, 0, 'OCO'), rubp: row(0, 0, 'PCCCCCP', { r: 11 }), pga: row(0, 0, 'CCCP', { r: 11 }), tp: row(0, 0, 'CCCP', { r: 11 }),
  suc: `${row(0, -11, 'CCCCCC', { r: 9 })}${row(0, 11, 'CCCCCC', { r: 9 })}`,
};
const NAMES: Record<string, [string, V]> = { co2: ['CO₂', [0, -22]], rubp: ['RuBP', [0, -22]], pga: ['3-PGA', [0, 34]], tp: ['triose phosphate', [0, -22]] };

export function worldSvg(p: string, bread: 'world' | 'inset'): string {
  const chain = chainSvg(`${p}c`, 'pdb-bilayer', ALLC, { mol: true, counts: false }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const strip = cellSvg(`${p}s`, 'strip', [...LIT_C1, 'thyl', 'light', 'starch'], { bare: true, join: true, unit: 'none', noMol: true });
  const mv = Object.entries(GLYPHS).map(([k, g]) => `<g data-k="m-${k}" opacity="0">${g}${NAMES[k] ? `<text class="cel-mn cel-halo" x="${NAMES[k][1][0]}" y="${NAMES[k][1][1]}" text-anchor="middle">${NAMES[k][0]}</text>` : ''}</g>`).join('');
  return `<defs><radialGradient id="${p}-pool"><stop offset="0" class="br-pool0"/><stop offset=".55" class="br-pool1"/><stop offset="1" class="br-pool2"/></radialGradient>
      <filter id="${p}-glow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b"/><feFlood flood-color="#f6b42c" flood-opacity=".85"/><feComposite in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <clipPath id="${p}-sclip"><rect x="${X0}" y="0" width="1700" height="610"/></clipPath></defs>
    <g class="fig">
      <g data-k="strip" opacity="0" clip-path="url(#${p}-sclip)"><g transform="translate(${X0} 0)">${strip}</g></g>
      <g data-k="chain" class="chn chn-pdb-bilayer">${chain}</g>
      <ellipse data-k="tag-glow" cx="700" cy="78" rx="160" ry="40" fill="url(#${p}-pool)" opacity="0"/>
      <ellipse data-k="starch-glow" cx="${W.starch[0]}" cy="${W.starch[1]}" rx="140" ry="80" fill="url(#${p}-pool)" opacity="0"/>
      ${bread === 'world' ? `<g data-k="grain" opacity="0">${grainG(W.grain[0], W.grain[1], 1.25, 0, 'w')}<text class="cel-mn cel-halo" x="${W.grain[0]}" y="${W.grain[1] + 52}" text-anchor="middle">wheat grain</text></g>
      <g data-k="bread" opacity="0">${breadG(W.grain[0], W.grain[1] - 6, 1.1)}<text class="cel-mn cel-halo" x="${W.grain[0]}" y="${W.grain[1] + 64}" text-anchor="middle">bread</text></g>` : ''}
      <g data-k="veil" opacity="0"><rect class="br-veil" x="-400" y="-200" width="3200" height="1000" opacity=".72"/></g>
      <ellipse data-k="rub-pool" cx="${W.rub[0]}" cy="${W.rub[1]}" rx="120" ry="100" fill="url(#${p}-pool)" opacity="0"/>
      <image data-k="rub-top" href="${rubPng}" x="${f(W.rub[0] - RUB.w / 2)}" y="${f(W.rub[1] - RUB.h / 2)}" width="${f(RUB.w)}" height="${f(RUB.h)}" filter="url(#${p}-glow)" opacity="0"/>
      <text data-k="rub-name" class="br-big cel-halo" x="${W.rub[0]}" y="${W.rub[1] + 90}" text-anchor="middle" opacity="0">RuBisCO</text>
      ${mv}
    </g>`;
}

/** Positions and opacities of the moving glyphs at (beat, t): one script, both stagings. */
interface Put { at: V; o: number; s?: number }
/** A point on a quadratic Bézier: one gentle curve, no change of direction. */
const arc = (a: V, c: V, b: V, u: number): V => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
function script(beat: number, t: number, bread: 'world' | 'inset'): Record<string, Put> {
  const P: Record<string, Put> = {};
  const hide = (k: string): void => { P[k] = { at: [0, 0], o: 0 }; };
  Object.keys(GLYPHS).forEach(hide);
  if (beat === 1) {
    // NADPH and ATP glide from the chain's tags to GAPDH
    const u1 = ease(t, 1.2, 4.2), u2 = ease(t, 1.6, 4.6);
    P.nadph = { at: along(P_NADPH, u1), o: ease(t, 0.8, 1.4) };
    P.atp = { at: along(P_ATP, u2), o: ease(t, 1.2, 1.8) };
  }
  if (beat === 2) {
    // CO₂ in, RuBP from PRK → RuBisCO → 3-PGA → GAPDH (+ ATP, NADPH) → triose phosphate; ADP + Pᵢ, NADP⁺ back
    const co2 = ease(t, 0.2, 1.8), rubp = ease(t, 0.5, 2.0), into = ease(t, 2.0, 2.6);
    // CO₂ in from the left (the strip's carboxylation side), RuBP up from below
    P.co2 = { at: lerpV([W.co2[0] - 120, W.co2[1]], [W.rub[0] - 78, W.co2[1]], co2), o: ease(t, 0, 0.4) * (1 - into) };
    P.rubp = { at: lerpV(W.rubp, [W.rub[0], W.rub[1] + 66], rubp), o: ease(t, 0.3, 0.7) * (1 - into) };
    const pgaOut = ease(t, 2.4, 3.4), pgaUp = ease(t, 3.6, 5.0), pgaGone = ease(t, 5.0, 5.4);
    const pgaAt = pgaUp > 0 ? lerpV(W.pga, [W.gapdh[0] - 20, W.gapdh[1] + 30], pgaUp) : lerpV([W.rub[0] - 50, W.rub[1] - 40], W.pga, pgaOut);
    P.pga = { at: pgaAt, o: ease(t, 2.3, 2.7) * (1 - pgaGone) };
    const meet = ease(t, 5.0, 5.4);
    P.nadph = { at: P_NADPH[P_NADPH.length - 1], o: 1 - meet };
    P.atp = { at: P_ATP[P_ATP.length - 1], o: 1 - meet };
    const tpU = ease(t, 5.2, 6.6);
    P.tp = { at: lerpV([W.gapdh[0] + 30, W.gapdh[1] - 56], W.tp, tpU), o: ease(t, 5.1, 5.5) };
    const back = ease(t, 5.6, 8.2);
    P.adp = { at: lerpV(along(P_BACK, back), W.adpTag, ease(t, 7.4, 8.4)), o: ease(t, 5.4, 5.8) * (1 - ease(t, 8.3, 8.8)) };
    P.nadp = { at: along([...P_BACK, W.nadpTag], ease(t, 5.8, 8.6)), o: ease(t, 5.6, 6.0) * (1 - ease(t, 8.5, 9.0)) };
  }
  if (beat === 3) {
    // triose phosphate fades where it is (its way out is the export arrow); staging 'world': a sucrose leaves the static one
    // on one gentle arc into the grain
    P.tp = { at: W.tp, o: 1 - ease(t, 0.2, 1.4) };
    if (bread === 'world') P.suc = { at: arc(W.sucrose, [W.sucrose[0] + 70, W.sucrose[1] - 46], [W.grain[0] - 6, W.grain[1]], ease(t, 1.4, 4.4)), o: ease(t, 1.0, 1.4) * (1 - ease(t, 4.2, 4.9)) };
  }
  if (beat === 4) { P.tp = { at: W.tp, o: 0 }; }
  return P;
}

export interface Opt { id: string; name: string; note: string; cams: [Cam, Cam, Cam, Cam, Cam]; /** beat 2's camera is reached over its first `pan` s */ pan?: number; bread: 'world' | 'inset' }

/** A staging: the world, the script, and the staging's four camera framings (beat b moves from cam[b−1] to cam[b]). */
export function makeStaging(o: Opt): Staging {
  const p = `br${o.id}`;
  return {
    id: o.id,
    name: o.name,
    note: o.note,
    svg: () => `<g data-k="cam">${worldSvg(p, o.bread)}</g>${o.bread === 'inset' ? `<g data-k="inset" opacity="0" class="fig">
        <circle cx="${INSET.c[0]}" cy="${INSET.c[1]}" r="${INSET.r + 3}" fill="#fbfaf6"/><circle cx="${INSET.c[0]}" cy="${INSET.c[1]}" r="${INSET.r}" fill="none" stroke="#e3a21a" stroke-width="3"/>
        <g data-k="i-grain">${grainG(INSET.c[0], INSET.c[1] - 10, 2.4, 0, 'i')}<text class="cel-mn" x="${INSET.c[0]}" y="${INSET.c[1] + 92}" text-anchor="middle">wheat grain</text></g>
        <g data-k="i-bread" opacity="0">${breadG(INSET.c[0], INSET.c[1] - 14, 1.7)}<text class="cel-mn" x="${INSET.c[0]}" y="${INSET.c[1] + 104}" text-anchor="middle">bread</text></g>
        <text data-k="i-sucn" class="cel-mn" x="${INSET.c[0] - 96}" y="${INSET.c[1] - 92}" text-anchor="middle" opacity="0">sucrose</text>
        <g data-k="i-suc" opacity="0">${row(0, -9, 'CCCCCC', { r: 7.5 })}${row(0, 9, 'CCCCCC', { r: 7.5 })}</g></g>` : ''}`,
    bind(stage) {
      const q = (k: string): SVGElement => stage.querySelector(`[data-k="${k}"]`) as SVGElement;
      const cam = q('cam'), strip = q('strip'), veil = q('veil'), glow = q('tag-glow'), pool = q('rub-pool'), top = q('rub-top'), name = q('rub-name');
      const sglow = q('starch-glow'), grain = q('grain'), bread = q('bread'), inset = q('inset'), iGrain = q('i-grain'), iBread = q('i-bread'), iSuc = q('i-suc'), iSucN = q('i-sucn');
      const gran = (pre: string): SVGElement[] => GRANULES.map((_, i) => q(`${pre}-g${i}`)).filter(Boolean);
      const wG = gran('w'), iG = gran('i');
      const op = (el: SVGElement | null, v: number): void => { if (el) el.setAttribute('opacity', f(v)); };
      const mv = Object.fromEntries(Object.keys(GLYPHS).map(k => [k, q(`m-${k}`)]));
      const setCam = (c: Cam): void => cam.setAttribute('transform', `translate(${f(800 - c.c[0] * c.s)} ${f(370 - c.c[1] * c.s)}) scale(${f(c.s)})`);
      return (beat, t) => {
        const prev = o.cams[Math.max(0, beat - 1)], cur = o.cams[beat];
        // the bread beat (3) keeps the camera where beat 2 left it: its framing equals beat 2's
        setCam(beat === 0 ? cur : lerpCam(prev, cur, ease(t, 0, beat === 1 ? (o.pan ?? 3.2) : 2.2)));
        strip.setAttribute('opacity', f(beat === 0 ? 0 : beat === 1 ? ease(t, 0.2, 2.2) : 1));
        glow.setAttribute('opacity', f(beat === 0 ? 0.9 * ease(t, 0.6, 1.6) : beat === 1 ? 0.9 * (1 - ease(t, 1.0, 2.4)) : 0));
        // to bread: the leaf's starch glows; the grain fills with starch granules and becomes bread
        // slow eased fades throughout: the starch glows, the grain fills granule by granule, the grain becomes bread
        op(sglow, beat === 3 ? 0.95 * ease(t, 0.1, 1.2) * (1 - ease(t, 3.0, 4.4)) : 0);
        const fill = (els: SVGElement[]): void => els.forEach((el, i) => op(el, beat === 3 ? ease(t, 4.2 + i * 0.35, 5.2 + i * 0.35) : beat === 4 ? 1 : 0));
        if (o.bread === 'world') {
          op(grain, beat === 3 ? ease(t, 1.2, 2.4) * (1 - ease(t, 7.4, 8.8)) : 0);
          fill(wG);
          op(bread, beat === 3 ? ease(t, 7.6, 9.0) : beat === 4 ? 1 : 0);
        } else {
          op(inset, beat === 3 ? ease(t, 1.0, 2.2) : 0);
          const u = ease(t, 1.8, 4.4), a0: V = [INSET.c[0] - 130, INSET.c[1] - 70], c0: V = [INSET.c[0] - 70, INSET.c[1] - 100], b0: V = [INSET.c[0] - 14, INSET.c[1] - 12];
          const at = arc(a0, c0, b0, u);
          iSuc.setAttribute('transform', `translate(${f(at[0])} ${f(at[1])})`);
          op(iSuc, beat === 3 ? ease(t, 1.6, 2.2) * (1 - ease(t, 4.2, 4.9)) : 0);
          op(iSucN, beat === 3 ? ease(t, 1.6, 2.2) * (1 - ease(t, 3.6, 4.4)) : 0);
          fill(iG);
          op(iGrain, beat === 3 ? 1 - ease(t, 7.4, 8.8) : 1);
          op(iBread, beat === 3 ? ease(t, 7.6, 9.0) : 0);
        }
        const hi = beat === 4 ? ease(t, 0.4, 1.8) : 0;
        veil.setAttribute('opacity', f(hi));
        pool.setAttribute('opacity', f(hi));
        top.setAttribute('opacity', f(hi));
        name.setAttribute('opacity', f(beat === 4 ? ease(t, 1.2, 2.2) : 0));
        const P = script(beat, t, o.bread);
        for (const [k, el] of Object.entries(mv)) {
          const pu = P[k];
          el.setAttribute('opacity', f(pu.o));
          if (pu.o > 0.003) el.setAttribute('transform', `translate(${f(pu.at[0])} ${f(pu.at[1])})`);
        }
      };
    },
  };
}
