// The light-reaction chain on the thylakoid membrane: one schema, reused from slide 7 on. Every slide lights the part it
// teaches (a `lit` set of parts) and dims the rest, so the whole chain always stays in view.
//
// Content, the same in every style (lecturer, 27 Oct 2026): stroma above, lumen below; left to right photosystem II ·
// plastoquinone (in the membrane) · cytochrome b₆f · plastocyanin (lumen side) · photosystem I · ferredoxin and FNR
// (stroma side) · ATP synthase. Light reaches both photosystems. At photosystem II, lumen side, water gives O₂ and H⁺, which
// stay in the lumen; plastoquinone takes up H⁺ from the stroma (at photosystem II's Q_B site) and releases them into the
// lumen at cytochrome b₆f. Electrons: water → PSII → PQ → b₆f → PC → PSI → Fd → FNR → NADP⁺ + H⁺ → NADPH. H⁺ flow back from
// the lumen to the stroma through ATP synthase: ADP + Pᵢ → ATP. Labels are the part names only; no cofactors, times,
// potentials or numbers (so water oxidation is drawn as H₂O → O₂ with four H⁺ marks, not as an equation).
//
// Orientation, after the boards' references: PSII's water-splitting side and cytochrome f face the lumen (Shevela et al.
// 2023, Fig. 1; Nelson & Ben-Shem 2004, Fig. 1b); plastocyanin is lumenal; ferredoxin and FNR sit on PSI's stromal side;
// ATP synthase's head (CF₁) is in the stroma. Grana hold PSII, the unstacked membranes PSI and ATP synthase, b₆f both
// (Nelson & Ben-Shem 2004, Fig. 1a; Wietrzynski et al. 2020, Fig. 2).
//
// Styles: flat (c1) · pdb (c2, our renders at one scale, scripts/chain_render.mjs) · grana (c3) · path (c4) · plate (c5,
// the line style of slides 4–6 with a light pool on the lit part) · energy (c6, the membrane over the Z-scheme).
import './chain.css';
import psiiPng from '../../assets/chain/psii.webp';
import b6fPng from '../../assets/chain/b6f.webp';
import psiPng from '../../assets/chain/psi.webp';
import atpsPng from '../../assets/chain/atps.webp';
import psiiSPng from '../../assets/chain/psii-s.webp';
import b6fSPng from '../../assets/chain/b6f-s.webp';
import psiSPng from '../../assets/chain/psi-s.webp';
import atpsSPng from '../../assets/chain/atps-s.webp';
import psiiCorePng from '../../assets/chain/psii-core.webp';
import psiiAntPng from '../../assets/chain/psii-ant.webp';

/* ================================================================ API */

/** The parts a slide can light. e-* are the electron-path segments, light-* the two light inputs. */
export type Part =
  | 'psii' | 'light-psii' | 'water' | 'e-water-psii' | 'e-psii-pq' | 'pq' | 'pq-h-in' | 'e-pq-b6f'
  | 'b6f' | 'pq-h-out' | 'e-b6f-pc' | 'pc' | 'e-pc-psi' | 'psi' | 'light-psi' | 'e-psi-fd' | 'fd' | 'e-fd-fnr'
  | 'fnr' | 'e-fnr-nadph' | 'nadph' | 'h-lumen' | 'atps' | 'atp';
export type Style = 'flat' | 'pdb' | 'grana' | 'path' | 'plate' | 'energy'
  // variations of 'pdb' (c2a–c2f, 27 Oct 2026)
  | 'pdb-core' | 'pdb-shade' | 'pdb-bilayer' | 'pdb-glow' | 'pdb-callout' | 'pdb-crowd'
  // variations of 'pdb-bilayer' (c2c1–c2c6, 27 Oct 2026)
  | 'bil-shade' | 'bil-callout' | 'bil-glow' | 'bil-core' | 'bil-thick' | 'bil-shade-callout';

/** Slide 7, photosystem II: PSII, its light, water → O₂ with the H⁺ it releases into the lumen, the electron path from
 *  water through PSII to plastoquinone, and plastoquinone with the H⁺ it takes up from the stroma. */
export const LIT_PSII: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in'];

/** Plain names of the parts, for the aria label. */
const NAME: Record<Part, string> = {
  psii: 'photosystem II', 'light-psii': 'the light reaching photosystem II', water: 'water giving O2 and H+ into the lumen',
  'e-water-psii': 'electrons from water to photosystem II', 'e-psii-pq': 'electrons from photosystem II to plastoquinone',
  pq: 'plastoquinone', 'pq-h-in': 'H+ taken up from the stroma by plastoquinone', 'e-pq-b6f': 'electrons from plastoquinone to cytochrome b6f',
  b6f: 'cytochrome b6f', 'pq-h-out': 'H+ released into the lumen at cytochrome b6f', 'e-b6f-pc': 'electrons from cytochrome b6f to plastocyanin',
  pc: 'plastocyanin', 'e-pc-psi': 'electrons from plastocyanin to photosystem I', psi: 'photosystem I', 'light-psi': 'the light reaching photosystem I',
  'e-psi-fd': 'electrons from photosystem I to ferredoxin', fd: 'ferredoxin', 'e-fd-fnr': 'electrons from ferredoxin to FNR', fnr: 'FNR',
  'e-fnr-nadph': 'electrons from FNR to NADP+', nadph: 'NADP+ and H+ giving NADPH', 'h-lumen': 'the H+ gathered in the lumen',
  atps: 'ATP synthase with the H+ flowing through it back to the stroma', atp: 'ADP and phosphate giving ATP',
};
const ALL = Object.keys(NAME) as Part[];

const SHOWN: Record<Style, string> = {
  flat: 'Drawn scheme of the light reactions in the thylakoid membrane, stroma above, lumen below, flat coloured shapes on the membrane band',
  pdb: 'The light reactions on our own space-filling renders of the four membrane complexes in side view at one scale (photosystem II PDB 5XNL, cytochrome b6f 6RQF, photosystem I 5L8R, ATP synthase 6FKF) on a drawn membrane, stroma above, lumen below; plastoquinone, plastocyanin, ferredoxin and FNR as simple shapes',
  grana: 'Drawn scheme of the light reactions on two kinds of thylakoid membrane: a granum stack on the left holds photosystem II, an unstacked membrane on the right holds photosystem I and ATP synthase, cytochrome b6f sits in both; plastoquinone moves in the membrane, plastocyanin in the lumen',
  path: 'Minimal scheme of the light reactions: the complexes as labelled boxes in the thylakoid membrane and one continuous electron line from water to NADPH, H+ gathering as dots in the lumen',
  plate: 'Drawn scheme of the light reactions in the thylakoid membrane in the deck’s line style, stroma above, lumen below',
  energy: 'Two views of the light reactions: the thylakoid membrane scheme on top and, below it, the Z-scheme with energy upwards, the same parts in the same columns, the two light-driven lifts drawn as upward arrows',
  'pdb-core': 'The light reactions on our own space-filling renders of the four membrane complexes at one scale; photosystem II drawn with its reaction-centre core dimer in front of its light-harvesting antenna',
  'pdb-shade': 'The light reactions on our own renders of the four membrane complexes at one scale, with soft three-dimensional shading',
  'pdb-bilayer': 'The light reactions on our own renders of the four membrane complexes at one scale, set in a drawn lipid bilayer with head groups on both faces, the stroma and lumen as tinted fields',
  'pdb-glow': 'The light reactions on our own renders of the four membrane complexes at one scale; the highlighted parts glow, the others are pale outlined silhouettes',
  'pdb-callout': 'The light reactions on larger renders of the four membrane complexes at one scale, named by callout lines to labels above and below',
  'pdb-crowd': 'The light reactions on large renders of the four membrane complexes at one scale, packed closely as in a real thylakoid membrane, named by callout lines',
  'bil-shade': 'The light reactions on our own shaded renders of the four membrane complexes at one scale, set in a drawn lipid bilayer, the stroma and lumen as tinted fields',
  'bil-callout': 'The light reactions on larger renders of the four membrane complexes at one scale, set in a drawn lipid bilayer, named by callout lines to labels above and below',
  'bil-glow': 'The light reactions on our own renders of the four membrane complexes at one scale, set in a drawn lipid bilayer; the highlighted parts glow, the others are pale outlined silhouettes',
  'bil-core': 'The light reactions on our own renders of the four membrane complexes at one scale, set in a drawn lipid bilayer; photosystem II drawn with its reaction-centre core dimer in front of its light-harvesting antenna',
  'bil-thick': 'The light reactions on larger renders of the four membrane complexes at one scale, set in a detailed lipid bilayer that curves round at the left to close the lumen, named by callout lines',
  'bil-shade-callout': 'The light reactions on larger shaded renders of the four membrane complexes at one scale, set in a drawn lipid bilayer, named by callout lines to labels above and below',
};
const ORDER = 'Left to right: photosystem II, plastoquinone, cytochrome b6f, plastocyanin, photosystem I, ferredoxin and FNR, ATP synthase. Light reaches both photosystems. Electrons run from water through photosystem II, plastoquinone, cytochrome b6f, plastocyanin, photosystem I, ferredoxin and FNR to NADPH; water gives O2 and H+ into the lumen, plastoquinone carries H+ from the stroma into the lumen, and H+ flow back to the stroma through ATP synthase, which makes ATP from ADP and phosphate.';

/** The whole chain in one style, the `lit` parts highlighted and the rest dimmed. `id` must be unique on the page. */
export function chainSvg(id: string, style: Style, lit: Iterable<Part>): string {
  const on = new Set(lit);
  const d = new Draw(id, on);
  DRAW[style](d);
  const litNames = ALL.filter(p => on.has(p)).map(p => NAME[p]);
  const label = `${SHOWN[style]}. ${ORDER} Highlighted: ${litNames.join('; ')}. Everything else is drawn dimmed.`;
  return `<svg class="fig-svg chn chn-${style}" viewBox="0 0 800 600" role="img" aria-label="${label}">${d.out()}</svg>`;
}

/* ================================================================ drawing kit */

type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
type Layer = 'under' | 'pool' | 'back' | 'body' | 'flow' | 'text';
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

class Draw {
  private L: Record<Layer, string[]> = { under: [], pool: [], back: [], body: [], flow: [], text: [] };
  constructor(readonly p: string, readonly lit: Set<Part>) {}
  on(part: Part): boolean { return this.lit.has(part); }
  /** Adds svg to a layer; with a part, wrapped so that it is lit or dimmed. */
  add(layer: Layer, part: Part | null, svg: string): void {
    this.L[layer].push(part ? `<g class="chn-${this.on(part) ? 'on' : 'off'}">${svg}</g>` : svg);
  }
  out(): string {
    return (['under', 'pool', 'back', 'body', 'flow', 'text'] as Layer[]).map(k => this.L[k].join('')).join('');
  }
}

/** A smooth open path through points (Catmull-Rom as cubic Béziers). */
function smooth(q: Pt[]): string {
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
/** Arrowhead with its tip at `tip`, pointing along `dir`. */
function head(tip: Pt, dir: Pt, cls: string, hl = 13, hw = 7.5): string {
  const L = Math.hypot(dir[0], dir[1]), u: Pt = [dir[0] / L, dir[1] / L], n: Pt = [-u[1], u[0]];
  const b: Pt = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  return `<path class="${cls}" d="M${f(tip[0])},${f(tip[1])}L${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}Z"/>`;
}
type Kind = 'e' | 'h' | 'o';
/** An arrow along points (smoothed): electrons (dark), H⁺ (red dots) or water/O₂ (blue-grey); `halo` for lines over shapes. */
function arrow(q: Pt[], k: Kind, halo = false, hl = 13, hw = 7.5): string {
  const tip = q[q.length - 1], prev = q[q.length - 2];
  // the end tangent of the Catmull-Rom curve is (tip − point before) / 2: shorten the line so the head covers its end
  const dir: Pt = [tip[0] - prev[0], tip[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const back: Pt = [tip[0] - (dir[0] / L) * hl * 0.75, tip[1] - (dir[1] / L) * hl * 0.75];
  const d = smooth([...q.slice(0, -1), back]);
  return `${halo ? `<path class="chn-halo-l" d="${d}"/>` : ''}<path class="chn-${k}" d="${d}"/>${head(tip, dir, `chn-${k}h`, hl, hw)}`;
}
/** Light arriving: an amber wave with a head, from a to b. */
function wave(a: Pt, b: Pt, n = 4.5, amp = 7): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - 16 / L;
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * stop, w = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (stop - t) * 8);
    pts.push(`${i ? 'L' : 'M'}${f(a[0] + dx * t - uy * w)},${f(a[1] + dy * t + ux * w)}`);
  }
  return `<path class="chn-lw" d="${pts.join('')}"/>${head(b, [dx, dy], 'chn-lwh', 16, 9)}`;
}
/** H⁺ marks. */
const hdots = (ps: Pt[], r = 6.5): string => ps.map(([x, y]) => `<circle class="chn-hd" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`).join('');
/** A bracket under a complex, with its name below. */
const bracket = (x0: number, x1: number, y: number, s: string): string =>
  `<path class="chn-brk" d="M${f(x0)},${f(y - 8)}V${f(y)}H${f(x1)}V${f(y - 8)}"/>${T((x0 + x1) / 2, y + 27, s, 'chn-name')}`;
/** The tiny key: electrons and H⁺. */
function key(x: number, y: number): string {
  return `<path class="chn-e" d="M${x},${y - 6}h30"/>${head([x + 44, y - 6], [1, 0], 'chn-eh', 12, 6.5)}${T(x + 54, y, 'e⁻', 'chn-keyb', 'start')}
    <path class="chn-h" d="M${x + 104},${y - 6}h30"/>${head([x + 148, y - 6], [1, 0], 'chn-hh', 12, 6.5)}${T(x + 158, y, 'H⁺', 'chn-keyb', 'start')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'chn-cr', a);
const B6F = 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>';

/* ================================================================ shapes */

/** A complex as primitives; drawn flat (fill) or as a plate (an ink outline of the union under a pale fill). */
type Prim = { r: [number, number, number, number, number] } | { e: [number, number, number, number] };
const prim = (p: Prim, cls: string): string => ('r' in p
  ? `<rect class="${cls}" x="${f(p.r[0])}" y="${f(p.r[1])}" width="${f(p.r[2])}" height="${f(p.r[3])}" rx="${f(p.r[4])}"/>`
  : `<ellipse class="${cls}" cx="${f(p.e[0])}" cy="${f(p.e[1])}" rx="${f(p.e[2])}" ry="${f(p.e[3])}"/>`);
type Look = 'flat' | 'plate';
/** prims[0..] are the body; dark = indices drawn in the darker tint (flat only). */
function shape(look: Look, c: string, prims: Prim[], dark: number[] = []): string {
  if (look === 'flat') return prims.map((p, i) => prim(p, `chn-body chn-${c}${dark.includes(i) ? ' chn-dk' : ''}`)).join('');
  return prims.map(p => prim(p, 'chn-ol-u')).join('') + prims.map(p => prim(p, `chn-pl chn-${c}`)).join('');
}

/* ================================================================ c1 · c5: the drawn schema */

/** The drawn layout (800 × 600): membrane band y 258–326, lumen below to 492, the names in a bracket row. */
const M0 = 258, M1 = 326, LUM = 492;
const S = {
  psii: [{ r: [26, 236, 158, 108, 24] }, { e: [104, 352, 50, 30] }] as Prim[],
  pq: [{ e: [250, 290, 25, 13] }] as Prim[],
  b6f: [{ r: [312, 238, 84, 102, 20] }, { e: [354, 352, 34, 26] }] as Prim[],
  pc: [{ e: [440, 404, 20, 20] }] as Prim[],
  psi: [{ r: [478, 232, 140, 108, 24] }, { e: [566, 234, 40, 18] }] as Prim[],
  fd: [{ e: [612, 188, 17, 17] }] as Prim[],
  fnr: [{ e: [646, 136, 30, 22] }] as Prim[],
  atps: [{ r: [702, 246, 54, 90, 14] }, { r: [720, 196, 18, 56, 4] }, { r: [762, 186, 9, 82, 4] }, { e: [729, 158, 44, 40] }] as Prim[],
};

function drawn(d: Draw, look: Look): void {
  // compartments
  d.add('under', null, `<rect class="chn-lumen" x="0" y="${M1}" width="800" height="${LUM - M1}"/>`);
  d.add('under', null, look === 'flat'
    ? `<rect class="chn-mem" x="0" y="${M0}" width="800" height="${M1 - M0}"/><path class="chn-memline" d="M0,${M0}H800M0,${M1}H800"/>`
    : `<rect class="chn-memp" x="0" y="${M0}" width="800" height="${M1 - M0}"/><path class="chn-memlp" d="M0,${M0}H800M0,${M1}H800"/>`);
  d.add('text', null, `${T(14, 30, 'stroma', 'chn-zone', 'start')}${T(786, LUM - 12, 'lumen', 'chn-zone', 'end')}`);

  // the light pool (plate): soft amber ellipses behind the lit parts, merged by a blur
  if (look === 'plate') {
    const spots: Array<[Part, number, number, number, number]> = [
      ['psii', 104, 300, 120, 100], ['light-psii', 118, 150, 50, 80], ['water', 110, 410, 90, 50], ['pq', 250, 290, 50, 40],
      ['b6f', 354, 300, 70, 95], ['pc', 440, 404, 45, 45], ['psi', 548, 286, 100, 90], ['light-psi', 462, 140, 50, 80],
      ['fd', 612, 188, 40, 40], ['fnr', 646, 136, 50, 45], ['nadph', 560, 62, 110, 30], ['atps', 729, 230, 70, 120], ['atp', 722, 96, 80, 30],
    ];
    const lit = spots.filter(s => d.on(s[0]));
    if (lit.length) d.add('pool', null, `<defs><radialGradient id="${d.p}-pool"><stop offset="0" class="chn-pool0"/><stop offset=".55" class="chn-pool1"/><stop offset="1" class="chn-pool2"/></radialGradient></defs>
      ${lit.map(([, x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx * 1.25}" ry="${ry * 1.25}" fill="url(#${d.p}-pool)"/>`).join('')}`);
  }

  // complexes and carriers
  d.add('body', 'psii', shape(look, 'psii', S.psii, [1]));
  d.add('body', 'pq', shape(look, 'pq', S.pq));
  d.add('body', 'b6f', shape(look, 'b6f', S.b6f, [1]));
  d.add('body', 'pc', shape(look, 'pc', S.pc));
  d.add('body', 'psi', shape(look, 'psi', S.psi));
  d.add('body', 'fd', shape(look, 'fd', S.fd));
  d.add('body', 'fnr', shape(look, 'fnr', S.fnr));
  d.add('body', 'atps', shape(look, 'atps', S.atps, [1, 2]));

  // light
  d.add('flow', 'light-psii', `${wave([150, 52], [112, 226])}${T(164, 58, 'light', 'chn-light', 'start')}`);
  d.add('flow', 'light-psi', `${wave([404, 62], [488, 224])}${T(396, 70, 'light', 'chn-light', 'end')}`);

  // water → O₂ + H⁺ at PSII's lumen side; the H⁺ stay in the lumen
  d.add('flow', 'water', `${T(30, 450, 'H₂O', 'chn-mol', 'start')}
    ${arrow([[104, 384], [110, 412], [114, 436]], 'o')}${T(116, 462, 'O₂', 'chn-ol')}
    ${arrow([[146, 370], [164, 386], [176, 396]], 'h', false, 11, 6.5)}${hdots([[188, 400], [206, 392], [192, 420], [212, 414]])}${T(228, 410, 'H⁺', 'chn-hl', 'start')}`);
  // electrons: water → through PSII → plastoquinone
  d.add('flow', 'e-water-psii', arrow([[52, 428], [64, 404], [80, 378]], 'e'));
  d.add('flow', 'e-psii-pq', arrow([[96, 362], [116, 316], [150, 280], [196, 288], [222, 290]], 'e', true));
  // plastoquinone: H⁺ from the stroma at PSII's Q_B side, released into the lumen at b₆f
  d.add('flow', 'pq-h-in', `${hdots([[164, 176], [184, 166]])}${T(198, 176, 'H⁺', 'chn-hl', 'start')}${arrow([[172, 190], [170, 214], [166, 238]], 'h', false, 11, 6.5)}`);
  d.add('flow', 'pq-h-out', `${arrow([[318, 330], [306, 352], [300, 372]], 'h', false, 11, 6.5)}${hdots([[292, 388], [308, 398]])}`);
  d.add('text', 'pq', T(250, 249, 'plastoquinone', 'chn-in'));
  d.add('flow', 'e-pq-b6f', arrow([[277, 292], [292, 294], [310, 296]], 'e'));
  // b₆f → plastocyanin → PSI
  d.add('flow', 'e-b6f-pc', arrow([[340, 300], [352, 340], [376, 374], [418, 398]], 'e', true));
  d.add('text', 'pc', T(440, 452, 'plastocyanin', 'chn-in'));
  d.add('flow', 'e-pc-psi', arrow([[460, 396], [478, 376], [494, 350]], 'e'));
  // PSI → ferredoxin → FNR → NADPH
  d.add('flow', 'e-psi-fd', arrow([[506, 336], [530, 286], [566, 246], [596, 198]], 'e', true));
  d.add('text', 'fd', T(588, 192, 'ferredoxin', 'chn-in', 'end'));
  d.add('flow', 'e-fd-fnr', arrow([[622, 173], [628, 165], [633, 158]], 'e', false, 11, 6.5));
  d.add('text', 'fnr', T(646, 143, 'FNR', 'chn-in'));
  d.add('flow', 'e-fnr-nadph', arrow([[630, 114], [620, 96], [606, 78]], 'e', false, 11, 6.5));
  d.add('text', 'nadph', T(556, 62, 'NADP⁺ + H⁺ → NADPH', 'chn-mol'));
  // lumen H⁺ to ATP synthase, through it to the stroma: ADP + Pᵢ → ATP
  d.add('flow', 'h-lumen', arrow([[232, 438], [330, 470], [520, 476], [690, 466], [722, 420], [726, 346]], 'h'));
  d.add('flow', 'atps', `${arrow([[714, 330], [712, 280], [710, 238], [694, 220]], 'h', false, 11, 6.5)}${hdots([[682, 213]])}`);
  d.add('text', 'atp', T(722, 102, 'ADP + Pᵢ → ATP', 'chn-mol'));

  // names
  d.add('text', 'psii', bracket(26, 184, 512, 'photosystem II'));
  d.add('text', 'b6f', bracket(312, 396, 512, B6F));
  d.add('text', 'psi', bracket(478, 618, 512, 'photosystem I'));
  d.add('text', 'atps', bracket(702, 756, 512, 'ATP synthase'));
  d.add('text', null, key(16, 590));
  d.add('text', null, credit(786, 590, look === 'flat' ? 'after Shevela et al. 2023, Fig. 1; Nelson & Ben-Shem 2004, Fig. 1' : 'after Shevela et al. 2023, Fig. 1'));
}

/* ================================================================ c4: the minimal path */

/** A labelled box (one or two lines). */
function box(x: number, y: number, w: number, h: number, c: string, lines: string[]): string {
  const ty = lines.length === 1 ? [y + h / 2 + 7] : [y + h / 2 - 5, y + h / 2 + 19];
  return `<rect class="chn-box chn-${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>${lines.map((l, i) => T(x + w / 2, ty[i], l, 'chn-in')).join('')}`;
}
/** A piece of the electron line; lit pieces are thick and blue, the rest thin and grey. */
function wire(d: Draw, part: Part, q: Pt[], tip = true): void {
  const on = d.on(part), hl = on ? 17 : 11, hw = on ? 10 : 6.5;
  const end = q[q.length - 1], prev = q[q.length - 2], dir: Pt = [end[0] - prev[0], end[1] - prev[1]], L = Math.hypot(dir[0], dir[1]);
  const back: Pt = tip ? [end[0] - (dir[0] / L) * hl * 0.7, end[1] - (dir[1] / L) * hl * 0.7] : end;
  d.add('back', part, `<path class="chn-wire" d="${smooth([...q.slice(0, -1), back])}"/>${tip ? head(end, dir, 'chn-wireh', hl, hw) : ''}`);
}

function pathStyle(d: Draw): void {
  const m0 = 272, m1 = 312, lum = 492;
  d.add('under', null, `<rect class="chn-lumen" x="0" y="${m1}" width="800" height="${lum - m1}"/>
    <rect class="chn-memthin" x="0" y="${m0}" width="800" height="${m1 - m0}"/><path class="chn-memthinl" d="M0,${m0}H800M0,${m1}H800"/>`);
  d.add('text', null, `${T(14, 30, 'stroma', 'chn-zone', 'start')}${T(786, lum - 12, 'lumen', 'chn-zone', 'end')}`);
  // stations
  d.add('body', 'psii', box(6, 250, 162, 84, 'psii', ['photosystem II']));
  d.add('body', 'pq', box(194, 265, 152, 54, 'pq', ['plastoquinone']));
  d.add('body', 'b6f', box(372, 250, 124, 84, 'b6f', ['cytochrome', '<tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>']));
  d.add('body', 'pc', box(450, 404, 148, 44, 'pc', ['plastocyanin']));
  d.add('body', 'psi', box(522, 250, 148, 84, 'psi', ['photosystem I']));
  d.add('body', 'fd', box(512, 168, 120, 42, 'fd', ['ferredoxin']));
  d.add('body', 'fnr', box(540, 106, 64, 40, 'fnr', ['FNR']));
  d.add('body', 'atps', box(694, 250, 98, 84, 'atps', ['ATP', 'synthase']));
  // one electron line, water → NADPH (hidden behind each station)
  d.add('text', 'water', `${T(34, 478, 'H₂O', 'chn-mol', 'start')}`);
  wire(d, 'e-water-psii', [[52, 456], [56, 400], [60, 334]]);
  wire(d, 'e-psii-pq', [[60, 334], [100, 296], [194, 292]]);
  wire(d, 'e-pq-b6f', [[346, 292], [372, 292]]);
  wire(d, 'e-b6f-pc', [[434, 300], [448, 336], [466, 372], [480, 404]]);
  wire(d, 'e-pc-psi', [[566, 404], [578, 370], [586, 334]]);
  wire(d, 'e-psi-fd', [[596, 290], [590, 250], [580, 210]]);
  wire(d, 'e-fd-fnr', [[572, 189], [572, 146]]);
  wire(d, 'e-fnr-nadph', [[572, 126], [566, 98], [556, 80]]);
  d.add('text', 'nadph', T(520, 66, 'NADP⁺ + H⁺ → NADPH', 'chn-mol'));
  // light
  d.add('flow', 'light-psii', `${wave([132, 96], [100, 246])}${T(146, 102, 'light', 'chn-light', 'start')}`);
  d.add('flow', 'light-psi', `${wave([408, 128], [534, 246])}${T(400, 134, 'light', 'chn-light', 'end')}`);
  // H⁺: from water and from plastoquinone they gather in the lumen, then leave through ATP synthase
  d.add('flow', 'water', `${arrow([[112, 336], [116, 362], [118, 384]], 'o', false, 11, 6.5)}${T(122, 410, 'O₂', 'chn-ol')}
    ${hdots([[150, 352], [168, 366], [150, 380], [176, 386]])}${T(192, 376, 'H⁺', 'chn-hl', 'start')}`);
  d.add('flow', 'pq-h-in', `${hdots([[256, 202], [278, 194]])}${T(294, 204, 'H⁺', 'chn-hl', 'start')}${arrow([[266, 214], [268, 238], [269, 262]], 'h', false, 11, 6.5)}`);
  d.add('flow', 'pq-h-out', hdots([[388, 352], [404, 366], [384, 378]]));
  d.add('flow', 'h-lumen', hdots([[262, 400], [300, 446], [338, 392], [362, 434], [420, 470], [470, 466], [612, 362], [626, 404], [606, 448], [652, 380], [662, 432], [700, 360], [718, 404], [690, 452], [742, 446], [760, 378], [544, 470], [314, 360]]));
  d.add('back', 'atps', arrow([[742, 392], [744, 338], [744, 272], [744, 238]], 'h', false, 11, 6.5));
  d.add('text', 'atp', T(722, 222, 'ADP + Pᵢ → ATP', 'chn-mol'));
  // key
  d.add('text', null, `<path class="chn-wire" style="stroke:#2457a8;stroke-width:6.5" d="M16,584h30"/>${head([60, 584], [1, 0], 'chn-wireh', 15, 9).replace('class="chn-wireh"', 'style="fill:#2457a8"')}${T(70, 590, 'e⁻', 'chn-keyb', 'start')}
    ${hdots([[124, 584]])}${T(138, 590, 'H⁺', 'chn-keyb', 'start')}`);
  d.add('text', null, credit(786, 590, 'after Hill & Bendall 1960, as redrawn by Govindjee et al. 2017'));
}

/* ================================================================ c3: grana and unstacked membrane */

function granaStyle(d: Draw): void {
  const mt = 26;                          // membrane thickness
  const top = 253, bot = 369, xl = 82;    // midlines of the chain thylakoid; its closed left end
  const r = (bot - top) / 2;
  const thy = `M820,${top}H${xl}A${r},${r} 0 0 0 ${xl},${bot}H820`;
  // two more discs under the left part: the granum
  const disc = (y0: number, y1: number): string => {
    const rr = (y1 - y0) / 2, a = 18 + rr, b = 352 - rr;
    return `M${b},${y0}H${a}A${rr},${rr} 0 0 0 ${a},${y1}H${b}A${rr},${rr} 0 0 0 ${b},${y0}Z`;
  };
  const discs = [disc(401, 439), disc(471, 509)];
  const memb = (dd: string): string => `<path d="${dd}" fill="none" stroke="#d6c497" stroke-width="${mt + 3}"/><path d="${dd}" fill="none" stroke="#efe4c8" stroke-width="${mt - 1}"/>`;
  d.add('under', null, `<path class="chn-thy-in" d="${thy}Z"/>${discs.map(x => `<path class="chn-thy-in" d="${x}"/>`).join('')}
    ${memb(thy)}${discs.map(memb).join('')}`);
  d.add('text', null, `${T(14, 30, 'stroma', 'chn-zone', 'start')}${T(786, 330, 'lumen', 'chn-zone', 'end')}${T(786, 470, 'stroma', 'chn-zone', 'end')}`);
  // the granum is packed with photosystem II in its appressed membranes
  d.add('body', 'psii', [369, 401, 439, 471, 509].flatMap(y => [62, 146, 230].map((x, i) => `<rect class="chn-body chn-psii" x="${x + ((y / 2 + i * 13) % 20) - 10}" y="${y - 17}" width="44" height="34" rx="9"/>`)).join(''));
  d.add('text', null, `${bracket(18, 348, 540, 'grana')}${bracket(356, 790, 540, 'unstacked membrane')}`.replace(/chn-name/g, 'chn-zone'));
  // complexes, names inside
  d.add('body', 'psii', `${shape('flat', 'psii', [{ r: [26, 222, 168, 62, 16] }, { e: [110, 290, 44, 20] }], [1])}${T(110, 245, 'photosystem II', 'chn-in')}`);
  d.add('body', 'pq', shape('flat', 'pq', [{ e: [246, 247, 22, 10] }]));
  d.add('text', 'pq', T(246, 214, 'plastoquinone', 'chn-in'));
  d.add('body', 'b6f', `${shape('flat', 'b6f', [{ r: [294, 222, 120, 62, 14] }, { e: [354, 290, 30, 18] }], [1])}${T(354, 249, 'cytochrome', 'chn-in')}${T(354, 273, '<tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>', 'chn-in')}`);
  d.add('body', 'pc', shape('flat', 'pc', [{ e: [440, 296, 18, 18] }]));
  d.add('text', 'pc', T(440, 338, 'plastocyanin', 'chn-in'));
  d.add('body', 'psi', `${shape('flat', 'psi', [{ r: [488, 218, 150, 66, 16] }, { e: [570, 220, 38, 14] }])}${T(563, 247, 'photosystem I', 'chn-in')}`);
  d.add('body', 'fd', shape('flat', 'fd', [{ e: [632, 182, 15, 15] }]));
  d.add('text', 'fd', T(610, 188, 'ferredoxin', 'chn-in', 'end'));
  d.add('body', 'fnr', `${shape('flat', 'fnr', [{ e: [638, 120, 26, 20] }])}${T(638, 127, 'FNR', 'chn-in')}`);
  d.add('body', 'atps', `${shape('flat', 'atps', [{ r: [694, 228, 50, 62, 12] }, { r: [710, 178, 18, 54, 4] }, { r: [750, 168, 8, 72, 4] }, { e: [719, 140, 52, 42] }], [1, 2])}
    ${T(719, 136, 'ATP', 'chn-in')}${T(719, 159, 'synthase', 'chn-in')}`);
  // light
  d.add('flow', 'light-psii', `${wave([118, 50], [76, 216])}${T(132, 56, 'light', 'chn-light', 'start')}`);
  d.add('flow', 'light-psi', `${wave([416, 62], [500, 212])}${T(408, 70, 'light', 'chn-light', 'end')}`);
  // water at PSII, in the granum's lumen
  d.add('flow', 'water', `${T(26, 346, 'H₂O', 'chn-mol', 'start')}${arrow([[110, 310], [114, 326], [118, 340]], 'o', false, 10, 6)}${T(132, 350, 'O₂', 'chn-ol', 'start')}
    ${arrow([[148, 298], [160, 306], [168, 312]], 'h', false, 10, 6)}${hdots([[180, 316], [196, 308], [184, 334], [202, 326]])}${T(216, 330, 'H⁺', 'chn-hl', 'start')}`);
  d.add('flow', 'e-water-psii', arrow([[46, 326], [60, 310], [76, 298]], 'e', false, 11, 6.5));
  d.add('flow', 'e-psii-pq', arrow([[96, 294], [128, 276], [176, 268], [206, 260], [224, 252]], 'e', true, 12, 7));
  d.add('flow', 'pq-h-in', `${hdots([[140, 158], [158, 148]])}${T(172, 158, 'H⁺', 'chn-hl', 'start')}${arrow([[148, 174], [147, 198], [146, 220]], 'h', false, 11, 6.5)}`);
  d.add('flow', 'e-pq-b6f', arrow([[269, 249], [278, 252], [290, 256]], 'e', false, 10, 6));
  d.add('flow', 'pq-h-out', `${arrow([[304, 284], [296, 298], [292, 308]], 'h', false, 10, 6)}${hdots([[284, 320], [300, 330]])}`);
  d.add('flow', 'e-b6f-pc', arrow([[344, 296], [362, 306], [392, 306], [420, 302]], 'e', true, 11, 6.5));
  d.add('flow', 'e-pc-psi', arrow([[458, 296], [474, 292], [492, 288]], 'e', false, 10, 6));
  d.add('flow', 'e-psi-fd', arrow([[500, 286], [566, 278], [626, 268], [648, 240], [640, 200]], 'e', true, 11, 6.5));
  d.add('flow', 'e-fd-fnr', arrow([[636, 166], [637, 154], [638, 142]], 'e', false, 10, 6));
  d.add('flow', 'e-fnr-nadph', arrow([[628, 101], [614, 82], [596, 64]], 'e', false, 11, 6.5));
  d.add('text', 'nadph', T(540, 52, 'NADP⁺ + H⁺ → NADPH', 'chn-mol'));
  d.add('flow', 'h-lumen', arrow([[248, 340], [320, 350], [500, 352], [660, 346], [700, 316], [706, 292]], 'h'));
  d.add('flow', 'atps', `${arrow([[704, 284], [703, 250], [700, 232], [690, 214]], 'h', false, 10, 6)}${hdots([[680, 206]])}`);
  d.add('text', 'atp', T(719, 82, 'ADP + Pᵢ → ATP', 'chn-mol'));
  d.add('text', null, key(16, 594));
  d.add('text', null, credit(786, 594, 'after Nelson & Ben-Shem 2004, Fig. 1a; Wietrzynski et al. 2020'));
}

/* ================================================================ c2: our renders of the structures, at one scale */

/** The renders (scripts/chain_render.mjs, 2.4 px per Å): size, membrane-centre row, anchors in image pixels. */
const REN = {
  psii: { href: psiiPng, w: 496, h: 299, my: 102, a: { oec: [330.3, 169.3] as Pt, qb: [344.8, 73] as Pt } },
  b6f: { href: b6fPng, w: 328, h: 292, my: 121.3, a: { hemes: [163.8, 121.3] as Pt, cytf: [261.4, 227.5] as Pt } },
  psi: { href: psiPng, w: 398, h: 282, my: 158.1, a: { fab: [218.1, 69.4] as Pt, p700: [216.7, 187.1] as Pt } },
  atps: { href: atpsPng, w: 343, h: 557, my: 462.8, a: { cring: [146.6, 463.8] as Pt } },
};

/** Variations of c2: which renders, which membrane, how parts are lit. The layout stays c2's. */
interface PdbOpt { set?: 'flat' | 'shaded' | 'core'; mem?: 'band' | 'bilayer'; spot?: 'grey' | 'glow' }
const SHADED: Record<keyof typeof REN, string> = { psii: psiiSPng, b6f: b6fSPng, psi: psiSPng, atps: atpsSPng };

/** The SVG filters of the structure variants: grey (dimmed), desaturated (dimmed, shaded set), silhouette (dimmed: pale
 *  fill, grey outline) and glow (lit: a soft amber halo). */
function pdbDefs(p: string): string {
  return `<defs><filter id="${p}-grey" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".12 .24 .05 0 .53 .12 .24 .05 0 .53 .12 .24 .05 0 .53 0 0 0 1 0"/></filter>
    <filter id="${p}-desat" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".17 .33 .06 0 .42 .17 .33 .06 0 .42 .17 .33 .06 0 .42 0 0 0 1 0"/></filter>
    <filter id="${p}-sil" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
      <feMorphology in="SourceAlpha" operator="dilate" radius="1.1" result="d"/><feFlood flood-color="#aca89d"/><feComposite in2="d" operator="in" result="o"/>
      <feFlood flood-color="#f3f1ec"/><feComposite in2="SourceAlpha" operator="in" result="i"/><feMerge><feMergeNode in="o"/><feMergeNode in="i"/></feMerge></filter>
    <filter id="${p}-glow" x="-25%" y="-35%" width="150%" height="170%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="11" result="b"/><feFlood flood-color="#f6b42c" flood-opacity=".8"/><feComposite in2="b" operator="in" result="g"/>
      <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
}
/** A lipid bilayer between y0 and y1: head groups on both faces, two tails each. */
function bilayerR(y0: number, y1: number): string {
  const heads: string[] = [], tails: string[] = [], step = 7.2, r = 3.1, tl = (y1 - y0) / 2 - r - 3;
  for (let x = 2; x < 800; x += step) {
    heads.push(`M${f(x - r)},${f(y0 + r)}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0M${f(x - r)},${f(y1 - r)}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0`);
    tails.push(`M${f(x - 1.2)},${f(y0 + 2 * r)}v${f(tl)}M${f(x + 1.2)},${f(y0 + 2 * r)}v${f(tl)}M${f(x - 1.2)},${f(y1 - 2 * r)}v${f(-tl)}M${f(x + 1.2)},${f(y1 - 2 * r)}v${f(-tl)}`);
  }
  return `<rect class="chn-bil" x="0" y="${f(y0)}" width="800" height="${f(y1 - y0)}"/><path class="chn-tail" d="${tails.join('')}"/><path class="chn-head" d="${heads.join('')}"/>`;
}

/** A detailed bilayer along the thylakoid's edge: the top membrane (centre yT) runs in from the right, curves down at the
 *  left (half-axes rx, (yB − yT)/2) and runs back as the bottom membrane (centre yB), closing the lumen. */
function bilayerCurved(yT: number, yB: number, xc: number, rx: number, half: number): string {
  const ry = (yB - yT) / 2, yc = (yT + yB) / 2;
  const centre = `M820,${f(yT)}H${f(xc)}A${f(rx)},${f(ry)} 0 0 0 ${f(xc)},${f(yB)}H820`;
  // samples along the centre line, one per head-group step, with the unit normal
  const pts: Array<[number, number, number, number]> = [];
  const step = 9.4;
  for (let x = 800; x > xc; x -= step) pts.push([x, yT, 0, -1]);
  const N = 400; let acc = 0, prev: Pt = [xc, yT];
  for (let i = 1; i <= N; i++) {
    const ph = (i / N) * Math.PI, q: Pt = [xc - rx * Math.sin(ph), yc - ry * Math.cos(ph)];
    acc += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q;
    if (acc >= step) { acc = 0; const tx = -rx * Math.cos(ph), ty = ry * Math.sin(ph), L = Math.hypot(tx, ty); pts.push([q[0], q[1], -ty / L, tx / L]); }
  }
  for (let x = xc + step; x < 812; x += step) pts.push([x, yB, 0, 1]);
  const r = 4.3, heads: string[] = [], tails: string[] = [];
  for (const [x, y, nx, ny] of pts) for (const sgn of [1, -1]) {
    const hx = x + sgn * nx * (half - r), hy = y + sgn * ny * (half - r);
    heads.push(`M${f(hx - r)},${f(hy)}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0`);
    const tx = -ny, ty = nx;   // along the membrane, for the two tails' spread
    for (const o of [-1.6, 1.6]) {
      const a: Pt = [hx + tx * o - sgn * nx * r, hy + ty * o - sgn * ny * r], L = half - 2 * r - 2;
      const m: Pt = [a[0] - sgn * nx * L * 0.55 + tx * o * 0.6, a[1] - sgn * ny * L * 0.55 + ty * o * 0.6];
      const e: Pt = [a[0] - sgn * nx * L, a[1] - sgn * ny * L];
      tails.push(`M${f(a[0])},${f(a[1])}L${f(m[0])},${f(m[1])}L${f(e[0])},${f(e[1])}`);
    }
  }
  return `<path class="chn-lumenf" d="${centre}Z"/><path class="chn-bilt" d="${centre}" stroke-width="${2 * half}"/>
    <path class="chn-tailt" d="${tails.join('')}"/><path class="chn-headt" d="${heads.join('')}"/>`;
}

function pdbStyle(d: Draw, o: PdbOpt = {}): void {
  const k = 0.95, s = k / 2.4, yM = 300;   // figure units per Å; per render pixel; membrane centre
  const set = o.set ?? 'flat', spot = o.spot ?? 'grey';
  const place = (key: keyof typeof REN, x: number, part: Part): ((q: Pt) => Pt) => {
    const R = REN[key], y = yM - R.my * s, on = d.on(part);
    const fl = on ? (spot === 'glow' ? ` filter="url(#${d.p}-glow)"` : '') : ` filter="url(#${d.p}-${spot === 'glow' ? 'sil' : set === 'shaded' ? 'desat' : 'grey'})"`;
    const img = (href: string, extra = ''): string => `<image href="${href}" x="${f(x)}" y="${f(y)}" width="${f(R.w * s)}" height="${f(R.h * s)}"${extra}/>`;
    d.add('body', part, set === 'core' && key === 'psii' ? `<g${fl}>${img(psiiAntPng, ' opacity=".45"')}${img(psiiCorePng)}</g>`
      : img(set === 'shaded' ? SHADED[key] : R.href, fl));
    return q => [x + q[0] * s, y + q[1] * s];
  };
  d.add('under', null, `${pdbDefs(d.p)}${o.mem === 'bilayer'
    ? `<rect class="chn-stromaf" x="0" y="0" width="800" height="${yM - 19}"/><rect class="chn-lumenf" x="0" y="${yM + 19}" width="800" height="${452 - yM - 19}"/>${bilayerR(yM - 19, yM + 19)}`
    : `<rect class="chn-lumen" x="0" y="${yM + 19}" width="800" height="${452 - yM - 19}"/>
    <rect class="chn-memr" x="0" y="${yM - 19}" width="800" height="38"/><path class="chn-memrl" d="M0,${yM - 19}H800M0,${yM + 19}H800"/>`}`);
  d.add('text', null, `${T(14, 30, 'stroma', 'chn-zone', 'start')}${T(786, 440, 'lumen', 'chn-zone', 'end')}`);
  const g2 = place('psii', 14, 'psii'), gb = place('b6f', 262, 'b6f'), g1 = place('psi', 420, 'psi'), ga = place('atps', 640, 'atps');
  const oec = g2(REN.psii.a.oec), qb = g2(REN.psii.a.qb), hem = gb(REN.b6f.a.hemes), cytf = gb(REN.b6f.a.cytf);
  const fab = g1(REN.psi.a.fab), p700 = g1(REN.psi.a.p700), ring = ga(REN.atps.a.cring);
  // carriers at true size: plastoquinone head ≈ 1 nm, plastocyanin ≈ 3.5 nm, ferredoxin ≈ 2.5 nm, FNR ≈ 4.5 nm
  const pq: Pt = [236, yM - 8], pc: Pt = [406, 386], fd: Pt = [548, 226], fnr: Pt = [604, 170];
  if (spot === 'glow') d.add('pool', null, glowPools(d, [['pq', pq[0], pq[1], 30, 22], ['water', oec[0] + 30, 400, 70, 40]]));
  d.add('body', 'pq', shape('flat', 'pq', [{ e: [pq[0], pq[1], 13, 6.5] }]));
  d.add('body', 'pc', shape('flat', 'pc', [{ e: [pc[0], pc[1], 16, 16] }]));
  d.add('body', 'fd', shape('flat', 'fd', [{ e: [fd[0], fd[1], 12, 12] }]));
  d.add('body', 'fnr', shape('flat', 'fnr', [{ e: [fnr[0], fnr[1], 26, 19] }]));
  d.add('text', 'pq', T(236, 246, 'plastoquinone', 'chn-in'));
  d.add('text', 'pc', T(406, 430, 'plastocyanin', 'chn-in'));
  d.add('text', 'fd', T(566, 200, 'ferredoxin', 'chn-in', 'end'));
  d.add('text', 'fnr', T(fnr[0], fnr[1] + 7, 'FNR', 'chn-in'));
  // light
  d.add('flow', 'light-psii', `${wave([60, 92], [72, 258])}${T(76, 90, 'light', 'chn-light', 'start')}`);
  d.add('flow', 'light-psi', `${wave([372, 100], [446, 246])}${T(364, 104, 'light', 'chn-light', 'end')}`);
  // water at the oxygen-evolving side of PSII (lumen)
  d.add('flow', 'water', `${T(64, 452, 'H₂O', 'chn-mol', 'start')}${arrow([[oec[0] + 6, oec[1] + 10], [oec[0] + 14, 380], [oec[0] + 18, 410]], 'o', true, 11, 6.5)}${T(oec[0] + 22, 436, 'O₂', 'chn-ol')}
    ${arrow([[oec[0] + 18, oec[1] + 6], [oec[0] + 40, 372], [oec[0] + 52, 386]], 'h', true, 10, 6)}${hdots([[oec[0] + 62, 396], [oec[0] + 80, 390], [oec[0] + 66, 414], [oec[0] + 84, 410]])}${T(oec[0] + 98, 408, 'H⁺', 'chn-hl', 'start')}`);
  d.add('flow', 'e-water-psii', arrow([[96, 430], [112, 390], [oec[0] - 4, oec[1] + 6]], 'e', true, 12, 7));
  d.add('flow', 'e-psii-pq', arrow([[oec[0], oec[1] - 6], [qb[0] - 4, qb[1] + 18], [qb[0] + 14, qb[1] - 2], [pq[0] - 15, pq[1]]], 'e', true, 12, 7));
  d.add('flow', 'pq-h-in', `${hdots([[qb[0] - 4, 196], [qb[0] + 14, 186]])}${T(qb[0] + 28, 196, 'H⁺', 'chn-hl', 'start')}${arrow([[qb[0] + 4, 210], [qb[0] + 4, 236], [qb[0] + 2, qb[1] - 8]], 'h', true, 11, 6.5)}`);
  d.add('flow', 'e-pq-b6f', arrow([[pq[0] + 15, pq[1]], [hem[0] - 30, hem[1] - 2], [hem[0] - 6, hem[1]]], 'e', true, 11, 6.5));
  d.add('flow', 'pq-h-out', `${arrow([[hem[0] - 30, hem[1] + 14], [286, 352], [290, 376]], 'h', true, 10, 6)}${hdots([[292, 392], [307, 400]])}`);
  d.add('flow', 'e-b6f-pc', arrow([[hem[0] + 4, hem[1] + 6], [cytf[0] - 6, cytf[1] - 10], [cytf[0] + 12, cytf[1] + 14], [pc[0] - 14, pc[1] - 8]], 'e', true, 11, 6.5));
  d.add('flow', 'e-pc-psi', arrow([[pc[0] + 12, pc[1] - 12], [p700[0] - 30, p700[1] + 26], [p700[0] - 6, p700[1] + 4]], 'e', true, 11, 6.5));
  d.add('flow', 'e-psi-fd', arrow([[p700[0], p700[1] - 6], [fab[0] - 4, fab[1] + 14], [fab[0] + 12, fab[1] - 12], [fd[0] - 10, fd[1] + 8]], 'e', true, 11, 6.5));
  d.add('flow', 'e-fd-fnr', arrow([[fd[0] + 10, fd[1] - 8], [fd[0] + 24, fd[1] - 24], [fnr[0] - 20, fnr[1] + 12]], 'e', false, 10, 6));
  d.add('flow', 'e-fnr-nadph', arrow([[fnr[0] - 6, fnr[1] - 20], [fnr[0] - 18, 120], [fnr[0] - 34, 82]], 'e', false, 11, 6.5));
  d.add('text', 'nadph', T(540, 68, 'NADP⁺ + H⁺ → NADPH', 'chn-mol'));
  d.add('flow', 'h-lumen', arrow([[oec[0] + 98, 424], [300, 440], [520, 444], [660, 432], [ring[0] + 6, 390], [ring[0] + 8, 346]], 'h'));
  d.add('flow', 'atps', `${arrow([[ring[0] - 2, ring[1] + 30], [ring[0] - 8, ring[1]], [ring[0] - 14, ring[1] - 34], [ring[0] - 30, ring[1] - 52]], 'h', true, 10, 6)}${hdots([[ring[0] - 40, ring[1] - 60]])}`);
  d.add('text', 'atp', T(708, 96, 'ADP + Pᵢ → ATP', 'chn-mol'));
  // names
  d.add('text', 'psii', bracket(14, 210, 478, 'photosystem II'));
  d.add('text', 'b6f', bracket(262, 392, 478, B6F));
  d.add('text', 'psi', bracket(420, 578, 478, 'photosystem I'));
  d.add('text', 'atps', bracket(646, 770, 478, 'ATP synthase'));
  d.add('text', null, key(16, 590));
  d.add('text', null, credit(786, 590, 'structures: PDB 5XNL, 6RQF, 5L8R, 6FKF'));
}

/** Soft amber pools behind lit small parts (c2d). */
function glowPools(d: Draw, spots: Array<[Part, number, number, number, number]>): string {
  const lit = spots.filter(q => d.on(q[0]));
  return lit.length ? `<defs><radialGradient id="${d.p}-pool"><stop offset="0" class="chn-pool0"/><stop offset=".55" class="chn-pool1"/><stop offset="1" class="chn-pool2"/></radialGradient></defs>
    ${lit.map(([, x, y, rx, ry]) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${rx}" ry="${ry}" fill="url(#${d.p}-pool)"/>`).join('')}` : '';
}

/** A callout: a label with a thin leader to a point on a structure (dot at the end). */
function callout(lx: number, ly: number, s: string, a: A, from: Pt, to: Pt, cls = 'chn-name'): string {
  const dd = `M${f(from[0])},${f(from[1])}L${f(to[0])},${f(to[1])}`;
  return `<path class="chn-ldh" d="${dd}"/><path class="chn-ld" d="${dd}"/><circle class="chn-ldt" cx="${f(to[0])}" cy="${f(to[1])}" r="3.2"/>${T(lx, ly, s, cls, a)}`;
}

/** c2e, c2f: larger structures named by callouts; H⁺ gather as dots in the lumen (no long line to cross the leaders). */
function pdbCallout(d: Draw, k: number, xs: [number, number, number, number], yM: number,
  o: { set?: 'flat' | 'shaded'; mem?: 'band' | 'bilayer' | 'thick'; row?: number } = {}): void {
  const s = k / 2.4, row = o.row ?? 486, shaded = o.set === 'shaded', mem = o.mem ?? 'band';
  const top = (key: keyof typeof REN): number => yM - REN[key].my * s;
  const place = (key: keyof typeof REN, x: number, part: Part): ((q: Pt) => Pt) => {
    const R = REN[key], y = top(key);
    d.add('body', part, `<image href="${shaded ? SHADED[key] : R.href}" x="${f(x)}" y="${f(y)}" width="${f(R.w * s)}" height="${f(R.h * s)}"${d.on(part) ? '' : ` filter="url(#${d.p}-${shaded ? 'desat' : 'grey'})"`}/>`);
    return q => [x + q[0] * s, y + q[1] * s];
  };
  const lumB = row - 66;
  d.add('under', null, `${pdbDefs(d.p)}${mem === 'band'
    ? `<rect class="chn-lumen" x="0" y="${f(yM + 20 * k)}" width="800" height="${f(lumB - yM - 20 * k)}"/>
    <rect class="chn-memr" x="0" y="${f(yM - 20 * k)}" width="800" height="${f(40 * k)}"/><path class="chn-memrl" d="M0,${f(yM - 20 * k)}H800M0,${f(yM + 20 * k)}H800"/>`
    : mem === 'bilayer'
      ? `<rect class="chn-stromaf" x="0" y="0" width="800" height="${f(yM - 20 * k)}"/><rect class="chn-lumenf" x="0" y="${f(yM + 20 * k)}" width="800" height="${f(lumB - yM - 20 * k)}"/>${bilayerR(yM - 20 * k, yM + 20 * k)}`
      : `<rect class="chn-stromaf" x="0" y="0" width="800" height="600"/>${bilayerCurved(yM, row - 40, 46, 34, 24)}`}`);
  d.add('text', null, `${T(14, 30, 'stroma', 'chn-zone', 'start')}${T(786, lumB - 10, 'lumen', 'chn-zone', 'end')}`);
  const g2 = place('psii', xs[0], 'psii'), gb = place('b6f', xs[1], 'b6f'), g1 = place('psi', xs[2], 'psi'), ga = place('atps', xs[3], 'atps');
  const W = (key: keyof typeof REN): number => REN[key].w * s;
  const oec = g2(REN.psii.a.oec), qb = g2(REN.psii.a.qb), hem = gb(REN.b6f.a.hemes), cytf = gb(REN.b6f.a.cytf), cytfL = gb([66.6, 228.2]);
  const fab = g1(REN.psi.a.fab), p700 = g1(REN.psi.a.p700), ring = ga(REN.atps.a.cring);
  const bot2 = top('psii') + REN.psii.h * s, bot1 = top('psi') + REN.psi.h * s, top1 = top('psi');
  const pq: Pt = [(xs[0] + W('psii') + xs[1]) / 2, yM - 8 * k], pc: Pt = [(xs[1] + W('b6f') + xs[2]) / 2 + 2, yM + 80 * k];
  const fd: Pt = [fab[0] + 34 * k, top1 + 6], fnr: Pt = [fd[0] + 28 * k, fd[1] - 46 * k];
  d.add('body', 'pq', shape('flat', 'pq', [{ e: [pq[0], pq[1], 13, 6.5] }]));
  d.add('body', 'pc', shape('flat', 'pc', [{ e: [pc[0], pc[1], 17, 17] }]));
  d.add('body', 'fd', shape('flat', 'fd', [{ e: [fd[0], fd[1], 13, 13] }]));
  d.add('body', 'fnr', `${shape('flat', 'fnr', [{ e: [fnr[0], fnr[1], 26, 19] }])}`);
  d.add('text', 'fnr', T(fnr[0], fnr[1] + 7, 'FNR', 'chn-in'));
  // stroma side: light, H⁺ taken up at PSII's Q_B side, plastoquinone and ferredoxin callouts, the two products
  d.add('flow', 'light-psii', `${wave([xs[0] + 44, yM - 196], [xs[0] + 62, top('psii') + 4])}${T(xs[0] + 58, yM - 200, 'light', 'chn-light', 'start')}`);
  d.add('flow', 'light-psi', `${wave([xs[2] - 40, yM - 196], [xs[2] + 22, top1 + 12])}${T(xs[2] - 48, yM - 192, 'light', 'chn-light', 'end')}`);
  d.add('flow', 'pq-h-in', `${hdots([[qb[0] - 12, yM - 128], [qb[0] + 6, yM - 138]])}${T(qb[0] + 20, yM - 128, 'H⁺', 'chn-hl', 'start')}${arrow([[qb[0] - 2, yM - 112], [qb[0] - 1, yM - 70], [qb[0], qb[1] - 6]], 'h', true, 11, 6.5)}`);
  const pqLy = Math.min(top('psii'), top('b6f')) - 30;
  d.add('text', 'pq', callout(pq[0] + 14, pqLy, 'plastoquinone', 'middle', [pq[0] + 4, pqLy + 6], [pq[0] + 2, pq[1] - 6], 'chn-in'));
  const fdLy = fnr[1] - 60;
  d.add('text', 'fd', callout(fd[0] - 26, fdLy, 'ferredoxin', 'end', [fd[0] - 30, fdLy + 6], [fd[0] - 6, fd[1] - 11], 'chn-in'));
  d.add('text', 'nadph', T(fnr[0] - 70, fdLy - 40, 'NADP⁺ + H⁺ → NADPH', 'chn-mol'));
  d.add('text', 'atp', T(xs[3] + W('atps') / 2, top('atps') - 26, 'ADP + Pᵢ → ATP', 'chn-mol'));
  // electrons
  d.add('flow', 'water', `${T(xs[0] + 84, bot2 + 44, 'H₂O', 'chn-mol', 'start')}${arrow([[oec[0] + 6, oec[1] + 10], [oec[0] + 12, bot2 + 6], [oec[0] + 14, bot2 + 26]], 'o', true, 11, 6.5)}${T(oec[0] + 18, bot2 + 50, 'O₂', 'chn-ol')}
    ${arrow([[oec[0] + 18, oec[1] + 6], [oec[0] + 36, bot2 - 6], [oec[0] + 46, bot2 + 6]], 'h', true, 10, 6)}${hdots([[oec[0] + 56, bot2 + 16], [oec[0] + 74, bot2 + 10], [oec[0] + 60, bot2 + 34], [oec[0] + 78, bot2 + 30]])}${T(oec[0] + 92, bot2 + 30, 'H⁺', 'chn-hl', 'start')}`);
  d.add('flow', 'e-water-psii', arrow([[xs[0] + 104, bot2 + 24], [oec[0] - 22, bot2 - 14], [oec[0] - 4, oec[1] + 6]], 'e', true, 12, 7));
  d.add('flow', 'e-psii-pq', arrow([[oec[0], oec[1] - 6], [qb[0] - 4, qb[1] + 18], [qb[0] + 14, qb[1] - 2], [pq[0] - 14, pq[1]]], 'e', true, 12, 7));
  d.add('flow', 'e-pq-b6f', arrow([[pq[0] + 14, pq[1]], [hem[0] - 30, hem[1] - 2], [hem[0] - 6, hem[1]]], 'e', true, 11, 6.5));
  d.add('flow', 'pq-h-out', `${arrow([[hem[0] - 30, hem[1] + 14], [cytfL[0] - 12, cytfL[1] - 2], [cytfL[0] - 16, cytfL[1] + 14]], 'h', true, 10, 6)}${hdots([[cytfL[0] - 26, cytfL[1] + 26], [cytfL[0] - 12, cytfL[1] + 34]])}`);
  d.add('flow', 'e-b6f-pc', arrow([[hem[0] + 4, hem[1] + 6], [cytf[0] - 6, cytf[1] - 10], [cytf[0] + 12, cytf[1] + 14], [pc[0] - 15, pc[1] - 8]], 'e', true, 11, 6.5));
  d.add('flow', 'e-pc-psi', arrow([[pc[0] + 12, pc[1] - 12], [p700[0] - 30, p700[1] + 26], [p700[0] - 6, p700[1] + 4]], 'e', true, 11, 6.5));
  d.add('flow', 'e-psi-fd', arrow([[p700[0], p700[1] - 6], [fab[0] - 4, fab[1] + 14], [fab[0] + 12, fab[1] - 12], [fd[0] - 11, fd[1] + 7]], 'e', true, 11, 6.5));
  d.add('flow', 'e-fd-fnr', arrow([[fd[0] + 9, fd[1] - 9], [fd[0] + 16, fd[1] - 18], [fnr[0] - 8, fnr[1] + 18]], 'e', false, 10, 6));
  d.add('flow', 'e-fnr-nadph', arrow([[fnr[0] + 4, fnr[1] - 20], [fnr[0] - 2, fdLy + 10], [fnr[0] - 10, fdLy - 34]], 'e', true, 11, 6.5));
  // H⁺ gather in the lumen and leave through ATP synthase
  const lumY = (t: number): number => Math.max(bot1, yM + 46 * k) + 12 + t * (lumB - Math.max(bot1, yM + 46 * k) - 24);
  d.add('flow', 'h-lumen', `${hdots([[pc[0] + 34, lumY(0.2)], [pc[0] + 58, lumY(0.75)], [p700[0] + 22, lumY(0.35)], [p700[0] + 48, lumY(0.85)], [p700[0] + 70, lumY(0.2)], [ring[0] - 64, lumY(0.6)], [ring[0] - 40, lumY(0.95)]])}
    ${arrow([[ring[0] - 30, lumY(0.55)], [ring[0] - 12, yM + 52 * k], [ring[0] - 4, yM + 30 * k]], 'h', true, 11, 6.5)}`);
  d.add('flow', 'atps', `${arrow([[ring[0] - 4, ring[1] + 22], [ring[0] - 10, ring[1]], [ring[0] - 16, ring[1] - 34], [ring[0] - 32, ring[1] - 52]], 'h', true, 10, 6)}${hdots([[ring[0] - 42, ring[1] - 60]])}`);
  // lumen side: the complexes and plastocyanin by callouts
  const r1 = row - 14;
  d.add('text', 'psii', callout(xs[0] + 18, row + 20, 'photosystem II', 'start', [xs[0] + 30, row], [xs[0] + 30, bot2 - 10]));
  d.add('text', 'b6f', callout(cytfL[0] + 40, row + 20, B6F, 'middle', [cytfL[0] + 2, row], [cytfL[0] + 2, cytfL[1] + 12]));
  d.add('text', 'pc', mem === 'thick'
    ? callout(pc[0] - 34, pc[1] + 46, 'plastocyanin', 'middle', [pc[0] - 6, pc[1] + 30], [pc[0], pc[1] + 17], 'chn-in')
    : callout(pc[0] + 6, r1 - 30, 'plastocyanin', 'middle', [pc[0], r1 - 50], [pc[0], pc[1] + 17], 'chn-in'));
  d.add('text', 'psi', callout(p700[0] - 6, row + 20, 'photosystem I', 'middle', [p700[0] - 4, row], [p700[0] - 4, bot1 - 10]));
  d.add('text', 'atps', callout(ring[0] + 22, row + 20, 'ATP synthase', 'middle', [ring[0] + 12, row], [ring[0] + 12, yM + 30 * k]));
  void r1;
  d.add('text', null, key(16, 590));
  d.add('text', null, credit(786, 590, 'structures: PDB 5XNL, 6RQF, 5L8R, 6FKF'));
}

/* ================================================================ c6: the membrane over the Z-scheme */

function energyStyle(d: Draw): void {
  const m0 = 146, m1 = 190, lum = 262;
  d.add('under', null, `<rect class="chn-lumen" x="0" y="${m1}" width="800" height="${lum - m1}"/>
    <rect class="chn-mem" x="0" y="${m0}" width="800" height="${m1 - m0}"/><path class="chn-memline" d="M0,${m0}H800M0,${m1}H800"/>`);
  d.add('text', null, `${T(14, 30, 'stroma', 'chn-zone', 'start')}${T(786, 254, 'lumen', 'chn-zone', 'end')}`);
  // the membrane schema, compact
  d.add('body', 'psii', shape('flat', 'psii', [{ r: [34, 128, 140, 76, 18] }, { e: [104, 210, 42, 20] }], [1]));
  d.add('body', 'pq', shape('flat', 'pq', [{ e: [250, 158, 22, 11] }]));
  d.add('body', 'b6f', shape('flat', 'b6f', [{ r: [316, 130, 76, 72, 16] }, { e: [354, 210, 28, 18] }], [1]));
  d.add('body', 'pc', shape('flat', 'pc', [{ e: [440, 232, 16, 16] }]));
  d.add('body', 'psi', shape('flat', 'psi', [{ r: [484, 124, 128, 78, 18] }, { e: [562, 126, 34, 13] }]));
  d.add('body', 'fd', shape('flat', 'fd', [{ e: [612, 96, 14, 14] }]));
  d.add('body', 'fnr', `${shape('flat', 'fnr', [{ e: [650, 70, 27, 18] }])}`);
  d.add('text', 'fnr', T(650, 77, 'FNR', 'chn-in'));
  d.add('body', 'atps', shape('flat', 'atps', [{ r: [704, 136, 48, 62, 12] }, { r: [720, 104, 16, 36, 4] }, { r: [758, 96, 8, 64, 4] }, { e: [728, 78, 40, 32] }], [1, 2]));
  d.add('flow', 'light-psii', wave([126, 10], [100, 124], 3.5, 6.5));
  d.add('flow', 'light-psi', wave([372, 40], [488, 122], 3.5, 6.5));
  d.add('flow', 'water', `${T(14, 240, 'H₂O', 'chn-mol', 'start')}${arrow([[104, 230], [108, 246], [110, 258]], 'o', false, 9, 5.5)}${T(124, 258, 'O₂', 'chn-ol', 'start')}
    ${arrow([[136, 220], [148, 226], [156, 230]], 'h', false, 9, 5.5)}${hdots([[166, 232], [182, 226], [172, 248], [190, 242]], 6)}${T(204, 246, 'H⁺', 'chn-hl', 'start')}`);
  d.add('flow', 'e-water-psii', arrow([[44, 222], [56, 214], [72, 208]], 'e', false, 10, 6));
  d.add('flow', 'e-psii-pq', arrow([[96, 206], [114, 172], [150, 150], [200, 156], [226, 158]], 'e', true, 11, 6.5));
  d.add('flow', 'pq-h-in', `${hdots([[164, 72], [182, 64]], 6)}${T(196, 74, 'H⁺', 'chn-hl', 'start')}${arrow([[170, 86], [168, 106], [164, 126]], 'h', false, 10, 6)}`);
  d.add('flow', 'e-pq-b6f', arrow([[274, 159], [294, 160], [314, 162]], 'e', false, 10, 6));
  d.add('flow', 'pq-h-out', `${arrow([[320, 196], [310, 210], [304, 220]], 'h', false, 9, 5.5)}${hdots([[296, 232], [312, 240]], 6)}`);
  d.add('flow', 'e-b6f-pc', arrow([[340, 168], [352, 202], [376, 224], [422, 230]], 'e', true, 10, 6));
  d.add('flow', 'e-pc-psi', arrow([[456, 224], [474, 214], [494, 196]], 'e', false, 10, 6));
  d.add('flow', 'e-psi-fd', arrow([[508, 190], [534, 150], [566, 118], [598, 102]], 'e', true, 10, 6));
  d.add('flow', 'e-fd-fnr', arrow([[622, 88], [628, 84], [626, 84]].slice(0, 2).concat([[628, 82]]) as Pt[], 'e', false, 8, 5));
  d.add('flow', 'e-fnr-nadph', arrow([[632, 56], [620, 46], [606, 40]], 'e', false, 9, 5.5));
  d.add('text', 'nadph', T(500, 30, 'NADP⁺ + H⁺ → NADPH', 'chn-mol'));
  d.add('flow', 'h-lumen', arrow([[214, 240], [330, 254], [520, 256], [690, 248], [720, 228], [724, 202]], 'h'));
  d.add('flow', 'atps', `${arrow([[716, 194], [714, 160], [706, 140], [694, 130]], 'h', false, 9, 5.5)}${hdots([[686, 124]], 6)}`);
  d.add('text', 'atp', T(722, 30, 'ADP + Pᵢ → ATP', 'chn-mol'));
  // the names, shared by both views (one column per part)
  const brk = (x0: number, x1: number, s: string): string => bracket(x0, x1, 272, s);
  d.add('text', 'psii', brk(34, 174, 'photosystem II'));
  d.add('text', 'b6f', brk(316, 392, B6F));
  d.add('text', 'psi', brk(484, 612, 'photosystem I'));
  d.add('text', 'atps', brk(704, 752, 'ATP synthase'));
  d.add('text', 'pq', T(250, 326, 'plastoquinone', 'chn-in'));
  d.add('text', 'pc', T(440, 326, 'plastocyanin', 'chn-in'));
  d.add('text', 'fd', T(612, 326, 'ferredoxin', 'chn-in'));
  // the Z-scheme: energy up; the same parts in the same columns
  const Z = { w: 584, h2lo: 560, h2hi: 386, pq: 424, b6f: 462, pc: 500, h1lo: 528, h1hi: 352, fd: 390, nadph: 436 };
  d.add('under', null, `<path class="chn-rule" d="M14,340H786"/>
    <path class="chn-zax" d="M26,590V362"/>${head([26, 350], [0, -1], 'chn-zaxh', 13, 7)}
    <text class="chn-axis" transform="translate(${f(20)} ${f(470)}) rotate(-90)" text-anchor="middle" dy="-6">energy</text>`);
  d.add('under', null, [[104, 340, Z.h2hi - 12], [250, 340, Z.pq - 14], [354, 340, Z.b6f - 16], [440, 340, Z.pc - 18], [548, 340, Z.h1hi - 12], [612, 340, Z.fd - 18]]
    .map(([x, y0, y1]) => `<path class="chn-guide" d="M${x},${y0}V${y1}"/>`).join(''));
  const cap = (x: number, y: number, c: string): string => `<rect class="chn-body chn-${c}" x="${x - 22}" y="${y - 8}" width="44" height="16" rx="6"/>`;
  const lift = (x: number, y0: number, y1: number): string => `<path class="chn-lift" d="M${x},${y0 - 10}V${y1 + 26}"/>${head([x, y1 + 9], [0, -1], 'chn-lifth', 20, 12)}`;
  d.add('body', 'psii', `${cap(104, Z.h2lo, 'psii')}${cap(104, Z.h2hi, 'psii')}`);
  d.add('flow', 'light-psii', `${lift(104, Z.h2lo, Z.h2hi)}${T(118, 482, 'light', 'chn-light', 'start')}`);
  d.add('body', 'psi', `${cap(548, Z.h1lo, 'psi')}${cap(548, Z.h1hi, 'psi')}`);
  d.add('flow', 'light-psi', `${lift(548, Z.h1lo, Z.h1hi)}${T(562, 450, 'light', 'chn-light', 'start')}`);
  d.add('body', 'pq', shape('flat', 'pq', [{ e: [250, Z.pq, 20, 10] }]));
  d.add('body', 'b6f', shape('flat', 'b6f', [{ r: [334, Z.b6f - 12, 40, 24, 8] }]));
  d.add('body', 'pc', shape('flat', 'pc', [{ e: [440, Z.pc, 13, 13] }]));
  d.add('body', 'fd', shape('flat', 'fd', [{ e: [612, Z.fd, 13, 13] }]));
  d.add('text', 'water', T(54, 586, 'H₂O', 'chn-mol', 'middle'));
  d.add('text', 'nadph', T(712, Z.nadph + 7, 'NADPH', 'chn-mol', 'middle'));
  d.add('flow', 'e-water-psii', arrow([[62, 566], [72, 562], [80, 561]], 'e', false, 10, 6));
  d.add('flow', 'e-psii-pq', arrow([[128, Z.h2hi + 2], [180, 398], [228, Z.pq - 4]], 'e', false, 11, 6.5));
  d.add('flow', 'e-pq-b6f', arrow([[272, Z.pq + 4], [300, 440], [332, Z.b6f - 6]], 'e', false, 11, 6.5));
  d.add('flow', 'e-b6f-pc', arrow([[376, Z.b6f + 4], [400, 480], [425, Z.pc - 4]], 'e', false, 11, 6.5));
  d.add('flow', 'e-pc-psi', arrow([[454, Z.pc + 4], [490, 514], [524, Z.h1lo - 2]], 'e', false, 11, 6.5));
  d.add('flow', 'e-psi-fd', arrow([[572, Z.h1hi + 2], [586, 366], [598, Z.fd - 8]], 'e', false, 10, 6));
  d.add('flow', 'e-fd-fnr', arrow([[626, Z.fd + 4], [650, 406], [672, Z.nadph - 10]], 'e', false, 11, 6.5));
  d.add('text', null, key(612, 566));
  d.add('text', null, credit(786, 594, 'after Shevela et al. 2023; Z-scheme after Govindjee et al. 2017'));
}

/* ================================================================ dispatch */

const DRAW: Record<Style, (d: Draw) => void> = {
  flat: d => drawn(d, 'flat'),
  plate: d => drawn(d, 'plate'),
  pdb: d => pdbStyle(d),
  'pdb-core': d => pdbStyle(d, { set: 'core' }),
  'pdb-shade': d => pdbStyle(d, { set: 'shaded' }),
  'pdb-bilayer': d => pdbStyle(d, { mem: 'bilayer' }),
  'pdb-glow': d => pdbStyle(d, { spot: 'glow' }),
  'pdb-callout': d => pdbCallout(d, 1.06, [8, 252, 426, 636], 318),
  'pdb-crowd': d => pdbCallout(d, 1.15, [6, 248, 410, 612], 304),
  'bil-shade': d => pdbStyle(d, { mem: 'bilayer', set: 'shaded' }),
  'bil-callout': d => pdbCallout(d, 1.06, [8, 252, 426, 636], 318, { mem: 'bilayer' }),
  'bil-glow': d => pdbStyle(d, { mem: 'bilayer', spot: 'glow' }),
  'bil-core': d => pdbStyle(d, { mem: 'bilayer', set: 'core' }),
  'bil-thick': d => pdbCallout(d, 1.02, [44, 260, 428, 640], 300, { mem: 'thick', row: 520 }),
  'bil-shade-callout': d => pdbCallout(d, 1.06, [8, 252, 426, 636], 318, { mem: 'bilayer', set: 'shaded' }),
  grana: granaStyle,
  path: pathStyle,
  energy: energyStyle,
};
