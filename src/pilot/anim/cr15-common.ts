// From leaf to loaf (slide C15, key cr15): the parts the stagings (cr15-a …) share. Beats: beats-cr.ts CR15.
//   1 A field's sunlight: slide figure C15 v9 (one soybean field, one season, per m², areas to scale; Zhu, Long & Ort 2010
//     Table 1): the sunlight square, then intercepted 89 %, biomass 2.9 %, seed 1.7 % shrink into it.
//   2 The ceiling: C15 v2 (the cascade redrawn from Zhu 2010 Fig. 2) row by row, or v1 (the published Fig. 2).
//   3 What breeding raised: the yield chain, C15 v3 (conversion lit) → v4 (interception and harvest index lit).
//   4 Engineering the link: C15 v7 (South et al. 2019 Fig. 3A photo, the bypass, field biomass +20 % and +24 %).
//   5 Leaf to loaf: C15 v5 (wheat shoot, sucrose in the phloem) and v6 (ear photo, endosperm SEM, Chen et al. 2024).
// The slide figures are the slide's own drawings (figs/cr15.ts draw(id)); their story parts are hidden by masks or found in
// the markup by class (squares by fill, pills, phloem paths), never redrawn.
import { draw as drawC15 } from '../figs/cr15';
import zhuJpg from '../../assets/photos/cr-zhu-f2.jpg';
import southJpg from '../../assets/photos/cr-south-f3.jpg';
import earJpg from '../../assets/photos/cr-ear.jpg';
import chen9Jpg from '../../assets/photos/cr-chen-f9a.jpg';
import chen6Jpg from '../../assets/photos/cr-chen-f6.jpg';
import soyBJpg from '../../assets/photos/cr-soyface-b.jpg';
import borlaugPng from '../../assets/anim/cr15/borlaug-usaid.png';
import { f1, fd, journalClip, smooth, type Setters } from './cr-kit';

export const FIG = (id: string): string => drawC15(id);
export const IMG = {
  zhu: { href: zhuJpg, w: 1112, h: 1150 },
  south: { href: southJpg, w: 775, h: 743 },
  ear: { href: earJpg, w: 1200, h: 800 },
  chen9: { href: chen9Jpg, w: 739, h: 178 },
  chen6: { href: chen6Jpg, w: 205, h: 626 },
  soyB: { href: soyBJpg, w: 671, h: 284 },
};
export const BORLAUG = borlaugPng;

/** The yield chain's stations in figure units (figs/cr-common.ts yieldChain): x of each; the icon row is y 226 on v3 and
 *  216 on v4. */
export const STATION = { sun: 50, int: 214, conv: 396, hi: 578, yield: 740 };

/* ---------------------------------------------------------------- figure parts found in the markup */

/** The label pills of a figure (leaders, pill, text), in drawing order. */
export function pillsOf(root: Element): Element[][] {
  const fig = root.querySelector('g.fig');
  const out: Element[][] = [];
  let cur: Element[] = [];
  for (const el of Array.from(fig?.children ?? [])) {
    const c = el.getAttribute('class') ?? '';
    if (/\bcr-(ldh|ldk|tipd|pillbg-t|pillbg)\b/.test(c)) cur.push(el);
    else if (/\bcr-pill\b/.test(c)) { cur.push(el); out.push(cur); cur = []; }
  }
  return out;
}

/** v9: the intercepted, biomass and seed squares grow out of the sunlight square's lower left corner, one after another,
 *  each with its label. u ∈ [0, 1] over the three. */
export function squaresAnim(S: Setters, root: Element): (u: number) => void {
  const sq = ['#d9eccb', '#6f9a5a', '#9c7a2c'].map(c => root.querySelector(`rect[fill="${c}"]`));
  const pills = pillsOf(root).slice(1);
  const C = [28, 496];
  return u => {
    sq.forEach((el, i) => {
      if (!el) return;
      const e = smooth((u - i / 3) * 3);
      S.op(el, e > 0 ? 1 : 0);
      S.set(el, 'transform', e >= 1 ? '' : `translate(${C[0]} ${C[1]}) scale(${Math.max(0.001, e).toFixed(4)}) translate(${-C[0]} ${-C[1]})`);
      (pills[i] ?? []).forEach(p => S.op(p, fd(e, 0.6, 0.4)));
    });
  };
}

/** v2: the cascade's rows 1–5 (row 0, all sunlight, stays), as mask boxes in figure units. */
export const V2_ROWS: Record<string, number[]> = Object.fromEntries([1, 2, 3, 4, 5].map(i => [`r${i}`, [0, 54 + i * 82 - 15, 800, 84]]));
/** v7: the drawn bypass and the field numbers under the photo. */
export const V7_HIDE: Record<string, number[]> = { box: [0, 338, 548, 240], num: [548, 338, 252, 240] };
/** v6: the three endosperm panels (10, 15, 20 days), the starch-granule label, and the mature grain. */
export const V6_HIDE: Record<string, number[]> = {
  d10: [296, 72, 172, 150], d15: [458, 72, 172, 150], d20: [620, 72, 172, 150], lab: [420, 214, 372, 60], mat: [298, 280, 502, 280],
};
/** v1: the maxima beside the published figure. */
export const V1_HIDE: Record<string, number[]> = { max: [552, 56, 248, 476] };

/** v5: sucrose flows in the phloem (the dotted paths move along themselves toward the ear) for `d` seconds from t0. */
export function phloemAnim(S: Setters, root: Element): (t: number) => void {
  const paths = Array.from(root.querySelectorAll('path.cr-phloem'));
  return t => paths.forEach(p => S.set(p, 'stroke-dashoffset', f1(-Math.max(0, t) * 26)));
}

/* ---------------------------------------------------------------- clippings */

export const zhuClip = (id: string, x: number, y: number, w: number, rot = -1.4): { svg: string; h: number } => journalClip(id, x, y, w, {
  journal: 'Annual Review of Plant Biology', year: '2010',
  title: ['Improving Photosynthetic Efficiency', 'for Greater Yield'],
  authors: 'X.-G. Zhu, S. P. Long, D. R. Ort',
}, rot, 67);
export const southClip = (id: string, x: number, y: number, w: number, rot = 1.2): { svg: string; h: number } => journalClip(id, x, y, w, {
  journal: 'Science', year: '2019',
  title: ['Synthetic glycolate metabolism pathways', 'stimulate crop growth and productivity', 'in the field'],
  authors: 'P. F. South, A. P. Cavanagh, H. W. Liu, D. R. Ort',
}, rot, 73);
