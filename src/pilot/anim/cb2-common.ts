// C2 animation, "RuBisCO" (beats CB2 in beats-cb.ts): the pieces every staging (cb2-a … cb2-c) shares.
// - The slide figure: C2 v7 (figs/cb02.ts draw('v7')), exactly: the wheel with carboxylation lit and Goodsell's spinach
//   RuBisCO at its top right. The zoom staging dives into that picture.
// - Goodsell's spinach RuBisCO L₈S₈ (photos/c2-goodsell.jpg, the left molecule, window 25,25–855,760 as on the slide):
//   D. S. Goodsell, PDB-101 Molecule of the Month 11 (PDB 1RCX), CC BY 4.0.
// - The site readout: one active site's count of CO₂ fixed against a clock, at k_cat ≈ 3 s⁻¹ (25 °C, land plants;
//   Bar-On & Milo 2019), and the 8 active sites of L₈S₈ as 8 dots (positions in the molecule are not drawn: the picture
//   does not show them).
// - The nitrogen bars: RuBisCO ≈ 20 % of a C₃ leaf's nitrogen and ≈ 40 % of its soluble protein (Evans & Clarke 2019,
//   full text); the rest of each bar is "other", without the builder's own 55 % split of slide C2 v5.
// - Bar-On & Milo 2019 PNAS Fig. 3 A–B (board image o, CC BY-NC-ND 4.0) as a clipping, its "7×10¹⁴ g RuBisCO"
//   (terrestrial) ringed: 7×10¹⁴ g = 0.7 billion tonnes; the paper's global total is ≈ 0.7 Gt (abstract).
// - Beat 4 on the slide wheel: 3 CO₂ go in through RuBisCO, 6 3-PGA are made, and the reduction arc starts to light.
import { draw as drawC2 } from '../figs/cb02';
import { polar } from '../figs/cb-common';
import goodJpg from '../../assets/photos/c2-goodsell.jpg';
import baronJpg from '../../assets/refs/C1-cbb-cycle/baron2019-rubisco-mass-rate.jpg';
import {
  type Api, arcPath, clipping, credit, f1, figInner, hide, image, type Img, type Item, type Key, onFig, pill, show, T, type V, win, co2Fig,
} from './cb-kit';

export const GOOD: Img = { href: goodJpg, w: 1400, h: 776 };
export const L8S8: [number, number, number, number] = [25, 25, 830, 735];
export const BARON: Img = { href: baronJpg, w: 802, h: 647 };
export const CR_GOOD = 'D. S. Goodsell, PDB-101 Molecule of the Month 11 (PDB 1RCX) · CC BY 4.0';
export const CR_BARON = 'Bar-On & Milo 2019, PNAS 116:4738, Fig. 3 A, B · CC BY-NC-ND 4.0';
export const CR_EVANS = 'Data: Evans & Clarke 2019, J Exp Bot 70:7';

/** Slide C2's figure v7, ids prefixed p. */
export const slideC2 = (p: string, v = 'v7'): string => figInner(drawC2(v), `fcb2${v}`, p);
/** The Goodsell picture's centre and width in slide C2 v7 (figure units): shot at 600, 24, 180 wide, window L8S8. */
export const V7_GOOD = { c: [690, 24 + (180 * 735) / 830 / 2] as V, w: 180 };
/** The wheel of v7 (figure units). */
export const V7_WHEEL = { c: [400, 322] as V, r: 160 };

/** Goodsell's spinach RuBisCO w wide, centred on the origin (multiplied into the paper, as on the slide). */
export const structure = (p: string, w: number): { svg: string; h: number } => {
  const a = image(`${p}-good`, GOOD, w, { mult: true, win: L8S8 });
  return { svg: a.svg, h: a.h };
};

/* ---------------------------------------------------------------- the site readout */

/** One active site's count against a clock, and the 8 sites as dots; centred on the origin, about 440 × 330. Values are
 *  set by siteFx from global time t0 (the count starts) for `run` seconds. */
export function siteReadout(k: string): string {
  const dots = Array.from({ length: 8 }, (_, i) => `<circle data-k="${k}-d${i}" class="cbk-site" cx="${f1(-122 + i * 35)}" cy="118" r="12"/>`).join('');
  return `<rect class="cbk-card" x="-230" y="-178" width="460" height="356" rx="18"/>`
    + T(0, -132, 'one active site, 25 °C', 'cbk-l cbk-grey', 'middle')
    + `<text data-k="${k}-n" class="cbk-huge cbk-green" x="-18" y="-38" text-anchor="end" style="font-size:84px">0</text>`
    + T(0, -44, 'CO₂ fixed', 'cbk-h', 'start')
    + `<text data-k="${k}-t" class="cbk-h" x="-18" y="22" text-anchor="end">0.0 s</text>` + T(0, 22, 'time', 'cbk-l cbk-grey', 'start')
    + `<text data-k="${k}-r" class="cbk-h cbk-green" x="0" y="70" text-anchor="middle"></text>`
    + dots + T(0, 160, 'RuBisCO has 8 active sites', 'cbk-l', 'middle');
}
export function siteFx(k: string, t0: number, run = 3): (G: number, api: Api) => void {
  return (G, api) => {
    const dt = Math.max(0, Math.min(run, G - t0)), n = Math.floor(3 * dt + 1e-6);
    api.set(api.q(`${k}-n`), 'text', String(n));
    api.set(api.q(`${k}-t`), 'text', `${dt.toFixed(1)} s`);
    api.set(api.q(`${k}-r`), 'text', dt >= 1 ? '≈ 3 per second' : '');
    // each site flashes as it fixes one CO₂
    const flash = G >= t0 && dt < run ? Math.max(0, 1 - ((3 * dt) % 1) * 3) : 0;
    for (let i = 0; i < 8; i++) api.set(api.q(`${k}-d${i}`), 'class', flash > 0.3 ? 'cbk-site cbk-site-on' : 'cbk-site');
  };
}

/* ---------------------------------------------------------------- the nitrogen bars */

/** Two bars w wide: nitrogen in a C₃ leaf (RuBisCO ≈ 20 %) and its soluble protein (RuBisCO ≈ 40 %), filled by
 *  barsFx; centred on the origin, about w × 300. */
export function bars(k: string, w: number): string {
  const one = (y: number, title: string, i: number, pct: string): string =>
    T(-w / 2, y - 22, title, 'cbk-l', 'start')
    + `<rect class="cbk-meter" x="${f1(-w / 2)}" y="${y}" width="${w}" height="64" rx="10"/>`
    + `<rect data-k="${k}-f${i}" class="cbk-fill-green" x="${f1(-w / 2)}" y="${y}" width="0" height="64" rx="10"/>`
    + `<text data-k="${k}-p${i}" class="cbk-h cbk-green" x="${f1(-w / 2)}" y="${y + 104}" text-anchor="start" opacity="0">${pct}</text>`;
  return one(-110, 'nitrogen in a C₃ leaf', 0, 'RuBisCO ≈ 20 %') + one(60, 'soluble protein in a C₃ leaf', 1, 'RuBisCO ≈ 40 %');
}
export function barsFx(k: string, w: number, t0: number): (G: number, api: Api) => void {
  const share = [0.2, 0.4];
  return (G, api) => share.forEach((s, i) => {
    const u = win(G, t0 + i * 0.25, t0 + i * 0.25 + 0.9);
    api.set(api.q(`${k}-f${i}`), 'width', f1(Math.max(0.001, w * s * u)));
    api.op(api.q(`${k}-p${i}`), u);
  });
}

/* ---------------------------------------------------------------- Bar-On & Milo's Fig. 3 as a clipping */

/** Panels A and B of the figure (window 0,0–802,395) w wide on a clipping, "7×10¹⁴ g RuBisCO" ringed; centred. */
export function baronClip(p: string, w: number): { svg: string; h: number } {
  const a = image(`${p}-bar`, BARON, w, { mult: true, win: [0, 0, 802, 395] }), m = 18, cw = w + 2 * m, ch = a.h + 2 * m + 46;
  const dy = -ch / 2 + m + a.h / 2, r = a.at(72, 338), s = w / 802;
  const inner = `<g transform="translate(0 ${f1(dy)})">${a.svg}<ellipse class="cbk-ring cbk-ring-green" cx="${f1(r[0])}" cy="${f1(r[1])}" rx="${f1(84 * s)}" ry="${f1(26 * s)}"/></g>`
    + T(-cw / 2 + m, ch / 2 - 18, 'Bar-On & Milo, PNAS 2019', 'clip-find cbk-serif', 'start', ' style="font-size:24px"');
  return { svg: clipping(p, cw, ch, inner, { rot: -1, seed: 113 }), h: ch };
}
/** Where the ring sits in the clipping (relative to its centre, before its turn). */
export function baronRing(w: number): V {
  const s = w / 802, m = 18, h = 395 * s, ch = h + 2 * m + 46;
  return [-w / 2 + 72 * s, -ch / 2 + m + 338 * s];
}

/* ---------------------------------------------------------------- beat 4 on the slide wheel (v7) */

/** 3 CO₂ (atom balls) in through RuBisCO to 3-PGA, the 3-PGA box pulsing, and a glow running down the reduction arc;
 *  `place` maps figure units to the layer they are drawn in (sc: size there). */
export function pgaItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const { c, r } = V7_WHEEL, out: Item[] = [];
  const arc = (a0: number, a1: number) => (u: number): V => place(arcPath(c, r, a0, a1)(u));
  for (let i = 0; i < 3; i++) {
    // 0.24 s apart (from 0.08 s early) so that the three CO₂ glyphs do not overlap on the short arrow
    const a = G0 - 0.08 + i * 0.24, top = place([400, 96]), end = place([400, c[1] - r]);
    out.push({
      k: `${k}-co2-${i}`, svg: co2Fig(11.5 * sc),
      keys: [{ x: top[0], y: top[1], o: 0 }, show(a, 0.15), { at: a, d: 0.55, x: end[0], y: end[1] }, { at: a + 0.6, d: 0.7, path: arc(-90, -40) }, hide(a + 1.25, 0.2)],
    });
  }
  const pga = place(polar(c[0], c[1], r, -30) as V);
  out.push({ k: `${k}-pulse`, svg: `<rect class="cbk-pulse cbk-pulse-green" x="${f1(-62 * sc)}" y="${f1(-22 * sc)}" width="${f1(124 * sc)}" height="${f1(44 * sc)}" rx="${f1(12 * sc)}"/>`, keys: [{ x: pga[0], y: pga[1], o: 0 }, show(G0 + 1.45, 0.15), hide(G0 + 1.9, 0.5)] });
  // six 3-PGA set off down the reduction arc and stop a third of the way: reduction is next
  for (let i = 0; i < 6; i++) {
    const a = G0 + 1.7 + i * 0.08;
    out.push({ k: `${k}-red-${i}`, svg: `<circle class="cbk-tok-green" r="${f1(7 * sc)}"/>`, keys: [{ o: 0, ...xy(place(polar(c[0], c[1], r, -16) as V)) }, show(a, 0.12), { at: a, d: 0.8, path: arc(-16, 22 - i * 5) }] });
  }
  const q = place([630, 360]);
  out.push({ k: `${k}-q`, svg: pill('?', { size: 26 * sc, w: 52 * sc, tint: 'blue' }), keys: [{ x: q[0], y: q[1], o: 0 }, show(G0 + 2.6, 0.3)] });
  return out;
}
const xy = (q: V): { x: number; y: number } => ({ x: q[0], y: q[1] });
export const onV7 = (q: V): V => onFig(q);
export { credit, hide, type Key };
