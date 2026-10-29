// Drawn plants for the overview slide's summary tables (slide C10o, figures w1–w3): one representative plant per type,
// flat soft fills with thin darker outlines (the deck's drawing style: anim/c2story-scenes.ts, figs/c13.ts).
// Each function draws the plant standing on (x, y), its base on the ground, about 150 × s units tall.
// Botany: wheat (C₃) — culms with an awned ear of two-rowed spikelets, long narrow leaves; Flaveria (C₂) — an erect
// herb with opposite, sessile, lance-shaped leaves and flat-topped clusters of small yellow flower heads; maize (C₄) —
// a jointed stalk, long arching leaves, a husked cob with silk in a leaf axil, a branched tassel on top; saguaro (CAM) —
// a ribbed column with arms, spines along the ribs, white flowers at the tips.

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const ST = (fill: string, stroke: string, w = 1.4): string =>
  `style="fill:${fill};stroke:${stroke};stroke-width:${w};stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke"`;
const LN = (stroke: string, w: number): string =>
  `style="fill:none;stroke:${stroke};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"`;
const g = (x: number, y: number, s: number, body: string): string =>
  `<g transform="translate(${f(x)} ${f(y)}) scale(${(Math.round(s * 1000) / 1000).toString()})">${body}</g>`;

/** A narrow blade from (x0, y0) to its tip (x1, y1), bowed by `bend` (positive = up), `w` wide at the base. */
function blade(x0: number, y0: number, x1: number, y1: number, bend: number, w: number, fill: string, stroke: string): string {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - bend;
  return `<path d="M${f(x0)},${f(y0 - w / 2)} Q${f(mx)},${f(my - w * 0.7)} ${f(x1)},${f(y1)} Q${f(mx)},${f(my + w * 0.7)} ${f(x0)},${f(y0 + w / 2)} Z" ${ST(fill, stroke, 1.3)}/>`;
}

/* ---------------------------------------------------------------- wheat (C₃) */

/** A wheat ear drawn upward from (0, 0), `len` long: two rows of spikelets with awns, rotated by `a` degrees at (x, y). */
function ear(x: number, y: number, a: number, len: number): string {
  const n = 6;
  let s = `<path d="M0,0 V${-len}" ${LN('#a8862f', 1.6)}/>`;
  for (let i = 0; i < n; i++) {
    const gy = -6 - (i * (len - 10)) / (n - 1);
    for (const d of [-1, 1]) {
      s += `<path d="M${f(d * 4.5)},${f(gy - 6)} L${f(d * 9)},${f(gy - 28)}" ${LN('#c4a253', 1.1)}/>`;
      s += `<ellipse cx="${f(d * 4.2)}" cy="${f(gy)}" rx="4.4" ry="7.2" transform="rotate(${d * 22} ${f(d * 4.2)} ${f(gy)})" ${ST('#ebc96f', '#9c7a2c', 1.2)}/>`;
    }
  }
  s += `<path d="M0,${f(-len - 2)} L0,${f(-len - 26)}" ${LN('#c4a253', 1.1)}/>`;
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${a})">${s}</g>`;
}
export function wheat(x: number, y: number, s = 1): string {
  const LF = '#c8d98f', LS = '#6f8a3c';
  const stalks = `<path d="M-3,0 Q-8,-50 -24,-88" ${LN('#b99a45', 2.4)}/><path d="M0,0 Q2,-55 1,-100" ${LN('#b99a45', 2.6)}/>
    <path d="M3,0 Q9,-48 24,-84" ${LN('#b99a45', 2.4)}/>`;
  const leaves = blade(-1, -14, -46, -40, 14, 5, LF, LS) + blade(1, -22, 44, -52, 14, 5, LF, LS)
    + blade(-1, -40, -38, -74, 10, 4.4, LF, LS) + blade(1, -50, 30, -82, 8, 4, LF, LS) + blade(0, -6, 34, -14, 8, 4.4, LF, LS);
  const nodes = `<ellipse cx="0" cy="-40" rx="3" ry="2" style="fill:#94792f"/><ellipse cx="1" cy="-70" rx="3" ry="2" style="fill:#94792f"/>`;
  return g(x, y, s, stalks + leaves + nodes + ear(-24, -88, -18, 44) + ear(1, -100, 0, 48) + ear(24, -84, 16, 42));
}

/* ---------------------------------------------------------------- Flaveria (C₂) */

/** A cluster of small yellow flower heads around (cx, cy), flat on top. */
function heads(cx: number, cy: number, n: number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 6.2, dy = (i % 2) * 3.4;
    s += `<path d="M${f(cx)},${f(cy + 12)} L${f(cx + dx)},${f(cy + dy)}" ${LN('#6f9348', 1.1)}/>`;
  }
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 6.2, dy = (i % 2) * 3.4;
    s += `<circle cx="${f(cx + dx)}" cy="${f(cy + dy - 1)}" r="4.1" ${ST('#f3c623', '#a87d0f', 1.1)}/>`;
  }
  return s;
}
export function flaveria(x: number, y: number, s = 1): string {
  const LF = '#b4d08a', LS = '#557f3c';
  // opposite, sessile, lance-shaped leaves at each node, smaller upward
  const pair = (yy: number, len: number, w: number, up: number): string =>
    blade(-1, yy, -len, yy - up, up * 0.25, w, LF, LS) + blade(1, yy, len, yy - up, up * 0.25, w, LF, LS)
    + `<path d="M-2,${yy} L${f(-len * 0.8)},${f(yy - up * 0.8)} M2,${yy} L${f(len * 0.8)},${f(yy - up * 0.8)}" ${LN('#7fa25e', 0.9)}/>`;
  const stem = `<path d="M0,0 Q-2,-60 0,-104" ${LN('#5f8a3e', 2.6)}/>
    <path d="M0,-100 Q-12,-112 -26,-118 M0,-102 Q-4,-114 -8,-124 M0,-102 Q6,-114 12,-124 M0,-100 Q14,-110 28,-116 M0,-62 Q16,-80 34,-88" ${LN('#5f8a3e', 1.8)}/>`;
  const leaves = pair(-14, 36, 9, 14) + pair(-38, 34, 8.4, 16) + pair(-62, 30, 7.6, 14) + pair(-84, 24, 6.4, 12)
    + blade(18, -79, 38, -96, 3, 5, LF, LS);
  const fl = heads(-26, -130, 4) + heads(-8, -136, 3) + heads(12, -136, 3) + heads(28, -128, 4) + heads(36, -100, 3);
  return g(x, y, s, stem + leaves + fl);
}

/* ---------------------------------------------------------------- maize (C₄) */

export function maize(x: number, y: number, s = 1): string {
  const LF = '#a9cf7c', LS = '#4f7f35';
  // a long arching leaf from the stalk at height yy, to side d (−1 left, 1 right)
  const leaf = (yy: number, d: number, len: number, rise: number, droop: number): string => {
    const x1 = d * len * 0.55, y1 = yy - rise, x2 = d * len, y2 = yy - rise + droop;
    return `<path d="M${d * 2},${yy - 3} Q${f(x1 * 0.5)},${f(yy - rise * 1.1)} ${f(x1)},${f(y1)} Q${f(x1 + d * len * 0.3)},${f(y1 - 2)} ${f(x2)},${f(y2)}
      Q${f(x1 + d * len * 0.22)},${f(y1 + 5)} ${f(x1)},${f(y1 + 7)} Q${f(x1 * 0.5)},${f(yy - rise * 0.6 + 4)} ${d * 2},${yy + 4} Z" ${ST(LF, LS, 1.3)}/>
      <path d="M${d * 3},${yy} Q${f(x1 * 0.5)},${f(yy - rise * 0.9)} ${f(x1)},${f(y1 + 3)} Q${f(x1 + d * len * 0.25)},${f(y1 + 1)} ${f(x2 - d * 6)},${f(y2 - 1)}" ${LN('#7fae5b', 0.9)}/>`;
  };
  const stalk = `<path d="M-4.5,0 L-3.5,-150 L3.5,-150 L4.5,0 Z" ${ST('#9cc46e', '#4f7f35', 1.3)}/>
    ${[-24, -50, -76, -100, -122, -142].map(yy => `<path d="M-4,${yy} H4" ${LN('#4f7f35', 1.1)}/>`).join('')}`;
  const leaves = leaf(-24, -1, 70, 26, 34) + leaf(-50, 1, 74, 28, 34) + leaf(-100, 1, 64, 22, 30) + leaf(-122, -1, 58, 20, 26)
    + leaf(-142, 1, 44, 16, 20) + leaf(-76, -1, 70, 26, 32);
  // the cob in the axil at y −76 on the right: husk around a yellow cob, silk from the tip
  const cob = `<g transform="translate(5 -72) rotate(28)">
    <path d="M0,0 C-7,-10 -7,-34 0,-46 C7,-34 7,-10 0,0 Z" ${ST('#f0cc4f', '#a8822a', 1.2)}/>
    ${[-38, -31, -24, -17, -10].map(yy => `<path d="M-4,${yy} H4" ${LN('#c9a13c', 0.9)}/>`).join('')}
    <path d="M0,2 C-11,-8 -11,-30 -3,-40 C-6,-26 -4,-10 0,2 Z" ${ST('#bfdc8e', '#4f7f35', 1.2)}/>
    <path d="M0,2 C11,-8 11,-28 4,-38 C6,-24 4,-10 0,2 Z" ${ST('#bfdc8e', '#4f7f35', 1.2)}/>
    <path d="M0,-46 C-4,-54 -10,-56 -12,-64 M0,-46 C0,-56 4,-60 2,-68 M0,-46 C4,-52 10,-54 12,-60" ${LN('#b8713a', 1.2)}/></g>`;
  // the tassel: a central spike and arching side branches
  const tassel = `<path d="M0,-150 V-178" ${LN('#b8964a', 2)}/>
    <path d="M0,-158 Q-12,-168 -20,-160 M0,-162 Q-10,-176 -18,-174 M0,-158 Q12,-168 20,-160 M0,-162 Q10,-176 18,-174" ${LN('#b8964a', 1.6)}/>
    ${[[-20, -160], [-18, -174], [20, -160], [18, -174], [0, -178]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="1.8" style="fill:#d8b863"/>`).join('')}`;
  return g(x, y, s, leaves + stalk + cob + tassel);
}

/* ---------------------------------------------------------------- saguaro cactus (CAM) */

export function cactus(x: number, y: number, s = 1): string {
  const FILL = '#95bd7c', EDGE = '#466f3d', RIB = '#6e9a5c';
  // an arm: a tube from the trunk, bending up; outline under fill
  const arm = (d: string): string => `<path d="${d}" ${LN(EDGE, 25)}/><path d="${d}" ${LN(FILL, 22)}/><path d="${d}" ${LN(RIB, 1.1)}/>`;
  const arms = arm('M-8,-52 Q-34,-52 -34,-74 V-98') + arm('M8,-72 Q32,-72 32,-92 V-110');
  const trunk = `<path d="M-17,0 V-122 C-17,-144 17,-144 17,-122 V0 Z" ${ST(FILL, EDGE, 1.5)}/>
    ${[-9, 0, 9].map(rx => `<path d="M${rx},-2 V${rx === 0 ? -136 : -130}" ${LN(RIB, 1.1)}/>`).join('')}`;
  // spines: short pale ticks in clusters along the ribs and edges
  let sp = '';
  for (let yy = -10; yy > -128; yy -= 12) for (const rx of [-17, -9, 0, 9, 17]) {
    const o = rx === -17 ? -1 : rx === 17 ? 1 : 0;
    sp += o ? `<path d="M${rx},${yy} l${o * 4},-2 M${rx},${yy} l${o * 4},2" ${LN('#5a6b3a', 0.9)}/>` : `<circle cx="${rx}" cy="${yy + 6}" r="0.9" style="fill:#f3ecd2"/>`;
  }
  for (const [ax, y0, y1] of [[-34, -60, -96], [32, -82, -108]] as Array<[number, number, number]>)
    for (let yy = y0; yy > y1; yy -= 11) sp += `<path d="M${ax - 11},${yy} l-4,-2 M${ax + 11},${yy} l4,-2" ${LN('#5a6b3a', 0.9)}/>`;
  // white flowers with yellow centres at the tips
  const flower = (cx: number, cy: number): string => [-50, -20, 10, 40, 70].map(a =>
    `<ellipse cx="${f(cx + 5 * Math.sin((a * Math.PI) / 180))}" cy="${f(cy - 5 * Math.cos((a * Math.PI) / 180))}" rx="3.4" ry="5.4" transform="rotate(${a} ${f(cx + 5 * Math.sin((a * Math.PI) / 180))} ${f(cy - 5 * Math.cos((a * Math.PI) / 180))})" ${ST('#fbf7ea', '#a49d84', 1)}/>`).join('')
    + `<circle cx="${cx}" cy="${cy}" r="2.6" style="fill:#e8b730"/>`;
  return g(x, y, s, arms + trunk + sp + flower(-6, -140) + flower(8, -139) + flower(32, -122));
}

/** The four plants in the climate order of the table: C₃ · C₂ · C₄ · CAM. */
export const PLANTS: Array<(x: number, y: number, s?: number) => string> = [wheat, flaveria, maize, cactus];
/** Their heights at scale 1 (ground to the top of the awns, flower heads, tassel, flowers) and half-widths. */
export const PLANT_H = [174, 140, 180, 146];
export const PLANT_HW = [48, 40, 74, 48];
