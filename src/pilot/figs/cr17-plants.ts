// Drawn plants for slide C17 (the lecturer's night-opening data, 30 Oct 2026): one plant per species measured, in the
// deck's drawing style (figs/ov-plants.ts: flat soft fills, thin darker outlines). Each function draws the plant standing
// on (x, y), its base on the ground; heights in units before scaling are given per plant.
// Botany: tobacco (Nicotiana tabacum) — a tall unbranched stem, large elliptic alternate leaves, a terminal panicle of
// pink trumpet flowers; Arabidopsis thaliana — a basal rosette of spatulate leaves, a thin flowering stem with small
// stem leaves, white four-petalled flowers and thin siliques; tomato — pinnately compound leaves, trusses of red fruit
// with green calyces; common bean (bush type) — trifoliate leaves of broad pointed leaflets, long slender pods; soybean —
// trifoliate leaves, short hairy pods clustered at the nodes; sunflower — a tall stem, large heart-shaped leaves on long
// stalks, one big head of yellow ray florets round a brown disc.

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const ST = (fill: string, stroke: string, w = 1.4): string =>
  `style="fill:${fill};stroke:${stroke};stroke-width:${w};stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke"`;
const LN = (stroke: string, w: number): string =>
  `style="fill:none;stroke:${stroke};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"`;
const g = (x: number, y: number, s: number, body: string): string =>
  `<g transform="translate(${f(x)} ${f(y)}) scale(${(Math.round(s * 1000) / 1000).toString()})">${body}</g>`;
const LF = '#b4d08a', LS = '#557f3c', STEM = '#5f8a3e', RIB = '#7fa25e';

/** A pointed leaf from its base (x, y) along angle a (degrees, 0 = up, positive = clockwise), len long, about 1.5 w wide. */
function leaf(x: number, y: number, a: number, len: number, w: number, fill = LF, stroke = LS, rib = true): string {
  const d = `M0,0 C${f(w)},${f(-len * 0.22)} ${f(w * 0.85)},${f(-len * 0.75)} 0,${f(-len)} C${f(-w * 0.85)},${f(-len * 0.75)} ${f(-w)},${f(-len * 0.22)} 0,0 Z`;
  const r = rib ? `<path d="M0,${f(-len * 0.06)} L0,${f(-len * 0.88)}" ${LN(RIB, 0.9)}/>` : '';
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="${d}" ${ST(fill, stroke, 1.2)}/>${r}</g>`;
}
/** A broad heart-shaped leaf (sunflower) on a stalk. */
function heart(x: number, y: number, a: number, len: number, w: number): string {
  const d = `M0,0 C${f(w * 0.9)},${f(len * 0.12)} ${f(w * 1.15)},${f(-len * 0.55)} 0,${f(-len)} C${f(-w * 1.15)},${f(-len * 0.55)} ${f(-w * 0.9)},${f(len * 0.12)} 0,0 Z`;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M0,0 L0,${f(len * 0.32)}" ${LN(STEM, 1.6)}/>`
    + `<g transform="translate(0 0)"><path d="${d}" ${ST(LF, LS, 1.2)}/><path d="M0,0 L0,${f(-len * 0.85)}" ${LN(RIB, 0.9)}/></g></g>`;
}
/** A trifoliate leaf: a stalk from (x, y) along a, then a terminal and two side leaflets. */
function tri(x: number, y: number, a: number, sz: number, narrow = 1): string {
  const p = sz * 0.42, w = sz * 0.3 * narrow;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M0,0 L0,${f(-p)}" ${LN(STEM, 1.3)}/>`
    + leaf(0, -p, -72, sz * 0.5, w * 0.9) + leaf(0, -p, 72, sz * 0.5, w * 0.9) + leaf(0, -p, 0, sz * 0.62, w) + '</g>';
}

/* ---------------------------------------------------------------- tobacco, about 170 tall */

function trumpet(x: number, y: number, a: number): string {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">`
    + `<ellipse cx="0" cy="-1" rx="2.6" ry="3.6" ${ST('#a9c97f', LS, 1)}/>`
    + `<path d="M-1.7,-3 L-2.8,-16 L2.8,-16 L1.7,-3 Z" ${ST('#f6d3df', '#b8587f', 1)}/>`
    + `<ellipse cx="0" cy="-17" rx="7" ry="2.8" ${ST('#e889ad', '#b8587f', 1.1)}/></g>`;
}
export function tobacco(x: number, y: number, s = 1): string {
  const stem = `<path d="M0,0 Q3,-80 0,-146" ${LN(STEM, 3.2)}/>`
    + `<path d="M0,-140 Q-8,-146 -15,-150 M0,-142 Q-3,-150 -5,-156 M0,-142 Q3,-150 6,-156 M0,-140 Q8,-146 15,-149" ${LN(STEM, 1.4)}/>`;
  const leaves = leaf(0, -12, -72, 50, 24) + leaf(0, -36, 70, 48, 22) + leaf(0, -62, -64, 40, 18)
    + leaf(0, -88, 62, 33, 15) + leaf(0, -112, -56, 25, 11) + leaf(0, -128, 50, 17, 8);
  const fl = trumpet(-15, -150, -34) + trumpet(-5, -156, -10) + trumpet(6, -156, 12) + trumpet(15, -149, 36);
  return g(x, y, s, stem + leaves + fl);
}

/* ---------------------------------------------------------------- Arabidopsis, about 112 tall */

function whiteFlower(x: number, y: number): string {
  return `<circle cx="${f(x)}" cy="${f(y)}" r="3.6" ${ST('#fffdf8', '#8a877d', 1)}/><circle cx="${f(x)}" cy="${f(y)}" r="1.1" style="fill:#e3c23a"/>`;
}
export function arabidopsis(x: number, y: number, s = 1): string {
  const RF = '#9fc77a';
  const rosette = [-86, -64, -40, 86, 64, 40, -18, 18].map((a, i) => leaf(0, -2, a, i < 6 ? 26 : 18, i < 6 ? 10 : 8, RF, LS)).join('');
  const stem = `<path d="M0,-6 Q-2,-56 1,-104" ${LN(STEM, 1.7)}/><path d="M0,-52 Q10,-66 15,-84" ${LN(STEM, 1.3)}/>`;
  const cauline = leaf(0, -44, 42, 13, 5, RF, LS, false) + leaf(0, -68, -42, 11, 4.4, RF, LS, false);
  const siliques = `<path d="M0,-74 l-10,-9 M1,-82 l10,-8 M0,-90 l-9,-8 M11,-70 l9,-5 M13,-77 l-8,-7" ${LN(RIB, 1.5)}/>`;
  const fl = whiteFlower(1, -107) + whiteFlower(-5, -102) + whiteFlower(6, -101) + whiteFlower(15, -87) + whiteFlower(19, -82);
  return g(x, y, s, rosette + stem + cauline + siliques + fl);
}

/* ---------------------------------------------------------------- tomato, about 136 tall */

/** A pinnately compound leaf: a rachis from (x, y) along a, len long, leaflet pairs and a terminal leaflet. */
function cleaf(x: number, y: number, a: number, len: number): string {
  const TL = '#a6c97c';
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})"><path d="M0,0 L0,${f(-len)}" ${LN(STEM, 1.4)}/>`;
  for (const t of [0.34, 0.6, 0.83]) s += leaf(0, -t * len, -64, len * 0.27, len * 0.11, TL) + leaf(0, -t * len, 64, len * 0.27, len * 0.11, TL);
  return s + leaf(0, -len, 0, len * 0.3, len * 0.12, TL) + '</g>';
}
function fruit(x: number, y: number, r = 7.5): string {
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" ${ST('#e0452f', '#9e2a1a', 1.2)}/>`
    + `<path d="M${f(x - 3.4)},${f(y - r + 1.2)} L${f(x)},${f(y - r - 1.6)} L${f(x + 3.4)},${f(y - r + 1.2)}" ${LN('#4f7f3f', 1.3)}/>`;
}
export function tomato(x: number, y: number, s = 1): string {
  const stem = `<path d="M0,0 Q-8,-62 2,-134" ${LN(STEM, 3)}/>`;
  const leaves = cleaf(-2, -22, -62, 54) + cleaf(-4, -48, 60, 52) + cleaf(-3, -78, -56, 46) + cleaf(0, -104, 52, 38) + cleaf(2, -128, -16, 26);
  const truss = `<path d="M-4,-60 Q-14,-56 -18,-46 M-4,-60 Q-8,-50 -6,-40 M-4,-60 Q-18,-50 -28,-40 M-1,-92 Q10,-88 14,-78 M-1,-92 Q16,-86 26,-76" ${LN(STEM, 1.3)}/>`;
  const fr = fruit(-18, -40) + fruit(-5, -34) + fruit(-29, -34, 6.5) + fruit(14, -72) + fruit(27, -70, 6.5);
  return g(x, y, s, stem + leaves + truss + fr);
}

/* ---------------------------------------------------------------- common bean (bush), about 100 tall */

function pod(x: number, y: number, a: number, len: number, w: number, fill: string, stroke: string, fuzzy = false): string {
  const d = `M${f(-w / 2)},0 C${f(-w / 2)},${f(len * 0.4)} ${f(w * 0.1)},${f(len * 0.8)} ${f(w * 0.7)},${f(len)} C${f(w * 1.1)},${f(len - w * 0.6)} ${f(w / 2)},${f(len * 0.4)} ${f(w / 2)},0 Z`;
  const fz = fuzzy ? `<path d="${d}" style="fill:none;stroke:#a89f6a;stroke-width:4.4;stroke-dasharray:1 2.4;stroke-linecap:round"/>` : '';
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">${fz}<path d="${d}" ${ST(fill, stroke, 1.1)}/></g>`;
}
export function commonBean(x: number, y: number, s = 1): string {
  const stem = `<path d="M0,0 Q-4,-40 -16,-80 M0,0 Q4,-46 14,-86 M0,0 Q0,-32 0,-62" ${LN(STEM, 2.2)}/>`;
  const leaves = tri(-6, -38, -58, 34) + tri(6, -42, 56, 34) + tri(0, -62, 0, 38) + tri(-16, -80, -22, 44) + tri(14, -86, 24, 44);
  const pods = pod(-6, -50, 18, 38, 5.4, '#9cc36b', LS) + pod(5, -54, -16, 36, 5.4, '#9cc36b', LS) + pod(-1, -40, 4, 34, 5, '#9cc36b', LS);
  return g(x, y, s, stem + leaves + pods);
}

/* ---------------------------------------------------------------- soybean, about 124 tall */

export function soybean(x: number, y: number, s = 1): string {
  const stem = `<path d="M0,0 Q-2,-60 0,-112 M0,-40 Q-12,-60 -20,-80 M0,-50 Q12,-66 20,-86" ${LN(STEM, 2.4)}/>`;
  const leaves = tri(0, -112, 0, 40, 0.8) + tri(-20, -80, -32, 38, 0.8) + tri(20, -86, 32, 38, 0.8)
    + tri(-1, -72, -72, 32, 0.8) + tri(1, -26, 70, 30, 0.8) + tri(0, -14, -68, 28, 0.8);
  const PF = '#c7c08a', PS = '#7a7040';
  const pods = pod(0, -34, 150, 16, 5.6, PF, PS, true) + pod(0, -34, -150, 16, 5.6, PF, PS, true)
    + pod(0, -58, 140, 15, 5.4, PF, PS, true) + pod(0, -58, -140, 15, 5.4, PF, PS, true) + pod(0, -58, 178, 14, 5.2, PF, PS, true)
    + pod(0, -90, 150, 13, 5, PF, PS, true) + pod(0, -90, -150, 13, 5, PF, PS, true);
  return g(x, y, s, stem + leaves + pods);
}

/* ---------------------------------------------------------------- sunflower, about 184 tall */

export function sunflower(x: number, y: number, s = 1): string {
  const stem = `<path d="M0,0 Q4,-84 0,-152 Q2,-160 6,-164" ${LN(STEM, 3.4)}/>`;
  const leaves = heart(0, -28, -74, 36, 22) + heart(1, -58, 72, 34, 21) + heart(1, -88, -68, 30, 18) + heart(0, -116, 64, 25, 15);
  let head = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * 360) / 16, r = a * Math.PI / 180, cx = Math.cos(r) * 20, cy = Math.sin(r) * 20;
    head += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="8" ry="3.4" transform="rotate(${f(a)} ${f(cx)} ${f(cy)})" ${ST('#f3c623', '#a87d0f', 1)}/>`;
  }
  head += `<circle cx="0" cy="0" r="14" ${ST('#7a4a22', '#4f2e12', 1.2)}/>`;
  for (const [dx, dy] of [[-5, -4], [4, -6], [6, 3], [-3, 6], [0, 0], [-8, 2], [8, -2]]) head += `<circle cx="${dx}" cy="${dy}" r="1.3" style="fill:#4f2e12"/>`;
  return g(x, y, s, stem + leaves + `<g transform="translate(8 -170) rotate(18) scale(1 0.92)">${head}</g>`);
}
