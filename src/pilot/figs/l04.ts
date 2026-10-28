// Slide L04 · Light is also a particle. Light-block order v5 (research/figure-briefs/ORDER_PROPOSAL.md): a photon's
// energy is set by its wavelength (E = hc/λ; 300 nm 4.1 eV, 450 nm 2.8 eV, 650 nm 1.9 eV, 1000 nm 1.2 eV), and the
// energy decides what the photon can do. The lecturer's picks are U and X (listed). E, F and H were picked on the old
// slide 4 (Einstein and Rayleigh, before scattering moved to slide 3); they stay drawable by id but unlisted.
import type { PlateText, Variant } from '../types';
import { arrow, heads } from '../mechanisms';
import './l04.css';
import { clipping as newsClip, clipHeight, EINSTEIN_SLIDE } from './clipping';

export const PLATE: PlateText = {
  n: '4',
  status: 'confirmed',
  title: 'Light is also a particle',
  lead: 'Light comes in discrete packets of energy: photons.',
  points: [
    { claim: 'Photon energy.', text: '<i>E</i> = <i>hc</i>/<i>λ</i><br><i>h</i>: Planck constant · <i>c</i>: speed of light<br>A blue photon carries ~1.4× the energy of a red one.' },
    { claim: 'Energy per photon decides the effect.', text: 'Ultraviolet (photodamage): bonds in DNA and proteins break or rearrange<br>Visible (photochemistry): light-driven reactions<br>Infrared: molecular vibration; microwaves: molecular rotation; both only heat' },
    { claim: 'Light intensity = photon flux.', text: 'Photosynthetic photon flux density (PPFD)<br>Full sun ≈ 2000 µmol m⁻² s⁻¹<br>Office ≈ 10 µmol m⁻² s⁻¹' },
  ],
  refs: [
    { label: 'Einstein 1905', url: 'https://doi.org/10.1002/andp.19053220607' },
    { label: 'Nobel archive: light quanta', url: 'https://www.nobelprize.org/prizes/physics/the-dual-nature-of-light-as-reflected-in-the-nobel-archives/' },
  ],
};

// The lecturer's picks (26 Oct 2026). E, F and H, picked on the old slide 4, draw by id but are not listed.
export const VARIANTS: Variant[] = [
  { id: 'u', name: 'Effects under the axis' },
  { id: 'x', name: 'Effects on the energy axis' },
];

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fl04-s', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const lines = (x: number, y: number, ss: string[], cls = 'fl04-s', a: A = 'start', dy = 27): string => ss.map((s, i) => T(x, y + i * dy, s, cls, a)).join('');
const BLUE = '#2350e6', GREEN = '#2a963a', RED = '#c8361e';
const E_BLUE = '2.76 eV', E_RED = '1.91 eV'; // 1239.84 / 450 and / 650
/** Small deterministic random numbers, so the cut edges look the same on every load. */
function rng(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}
/** The proportional sign, set in a font that has a full-size glyph. */
const PROP = '<tspan class="fl04-prop">∝</tspan>';
/** Who a placeholder stands for; `mid` is the photo still to be placed (public-domain portrait). */
interface Who { name: string; mid: string; short: string }
const EINSTEIN: Who = { name: 'Albert Einstein', mid: 'A. Einstein, 1921', short: 'Einstein' };
const RAYLEIGH: Who = { name: 'Lord Rayleigh', mid: 'Lord Rayleigh', short: 'Rayleigh' };
/** Halftone dot patterns and a soft paper shadow, prefixed per variant. */
const defs = (p: string): string => `<defs>
  <pattern id="${p}-ht1" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#e2dfd6"/><circle cx="3" cy="3" r="1.25" fill="#bdb8ab"/></pattern>
  <pattern id="${p}-ht2" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#a19c90"/><circle cx="2.5" cy="2.5" r="1.7" fill="#5f5b53"/></pattern>
  <filter id="${p}-sh" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx="1" dy="3" stdDeviation="3.5" flood-color="#3d3020" flood-opacity=".22"/></filter>
  <radialGradient id="${p}-glow"><stop offset="0" stop-color="#f0a316" stop-opacity=".85"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
  ${[['b', BLUE], ['g', GREEN], ['r', RED], ['o', '#e07a1f']].map(([k, c]) => `<marker id="${p}-h${k}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto"><path d="M0,0L10,5L0,10z" fill="${c}"/></marker>`).join('')}
</defs>${heads(p)}`;
/** A rectangle with slightly irregular, scissor-cut edges. */
function cutPath(x: number, y: number, w: number, h: number, seed: number, j = 1.8): string {
  const r = rng(seed), pts: Pt[] = [];
  const edge = (x0: number, y0: number, x1: number, y1: number): void => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 14)), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    for (let i = 0; i < n; i++) { const t = i / n, o = (r() - 0.5) * 2 * j; pts.push([x0 + (x1 - x0) * t + (nx / L) * o, y0 + (y1 - y0) * t + (ny / L) * o]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return `M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}Z`;
}
/** A newspaper-cutout portrait placeholder: halftone frame, a neutral bust silhouette, the name, and the photo to come. */
function cutout(p: string, k: string, x: number, y: number, w: number, h: number, who: Who, rot = 0, seed = 3): string {
  const cap = Math.max(30, h * 0.16), px = x + 8, py = y + 8, pw = w - 16, ph = h - 16 - cap, cx = px + pw / 2;
  const hy = py + ph * 0.4, hr = Math.min(pw * 0.17, ph * 0.17);
  const bust = `M${f(px + pw * 0.1)},${f(py + ph)} C${f(px + pw * 0.12)},${f(hy + hr * 1.9)} ${f(cx - hr * 1.4)},${f(hy + hr * 1.35)} ${f(cx - hr * 0.55)},${f(hy + hr * 1.15)}
    L${f(cx + hr * 0.55)},${f(hy + hr * 1.15)} C${f(cx + hr * 1.4)},${f(hy + hr * 1.35)} ${f(px + pw * 0.88)},${f(hy + hr * 1.9)} ${f(px + pw * 0.9)},${f(py + ph)}Z`;
  const small = w < 120; // a narrow cutout carries the surname only, so the caption stays on the paper
  // the placeholder label: the full credit when there is room, otherwise who it is
  const lab = pw >= 130 ? ['portrait:', who.mid, '(public domain)'] : ['portrait:', who.short];
  const lh = 17, plH = lab.length * lh + 10;
  return `<g transform="rotate(${rot} ${f(x + w / 2)} ${f(y + h / 2)})">
    <path class="fl04-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${p}-sh)"/>
    <clipPath id="${p}-${k}-c"><rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}"/></clipPath>
    <g clip-path="url(#${p}-${k}-c)"><rect x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}" fill="url(#${p}-ht1)"/>
      <path d="${bust}" fill="url(#${p}-ht2)"/><ellipse cx="${f(cx)}" cy="${f(hy)}" rx="${f(hr)}" ry="${f(hr * 1.22)}" fill="url(#${p}-ht2)"/>
      <rect class="fl04-plate" x="${f(px)}" y="${f(py + ph - plH)}" width="${f(pw)}" height="${plH}"/>
      ${lab.map((s, i) => T(cx, py + ph - plH + 17 + i * lh, s, 'fl04-ph', 'middle')).join('')}</g>
    <rect class="fl04-frame" x="${f(px)}" y="${f(py)}" width="${f(pw)}" height="${f(ph)}"/>
    ${T(cx, y + h - cap / 2 + 3, small ? who.short : who.name, small ? 'fl04-name fl04-name-s' : 'fl04-name', 'middle')}
  </g>`;
}
/** The outline of a wave packet: a short wave under a bell-shaped envelope. */
function packetD(cx: number, cy: number, len: number, lam: number, amp: number, ang = 0, span = 1): string {
  const pts: string[] = [], n = 90, c = Math.cos((ang * Math.PI) / 180), s = Math.sin((ang * Math.PI) / 180);
  for (let i = 0; i <= n; i++) {
    const u = (i / n - 0.5) * len * span, env = Math.exp(-((u / (len * 0.28)) ** 2)), v = Math.sin((2 * Math.PI * u) / lam) * amp * env;
    pts.push(`${i ? 'L' : 'M'}${f(cx + u * c - v * s)},${f(cy + u * s + v * c)}`);
  }
  return pts.join('');
}
/** A photon as a wave packet: a short wave under a bell-shaped envelope. */
const packet = (cx: number, cy: number, len: number, lam: number, amp: number, col: string, ang = 0, w = 3): string =>
  `<path class="fl04-pk" style="stroke:${col};stroke-width:${w}" d="${packetD(cx, cy, len, lam, amp, ang)}"/>`;
/** Light of one colour as a wave with a constant drawn wavelength. */
function wv(x0: number, y0: number, x1: number, y1: number, lam: number, col: string, o: { amp?: number; head?: string; w?: number; ph?: number; op?: number } = {}): string {
  const amp = o.amp ?? 6, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const run = o.head ? L - 8 : L, ramp = lam * 0.7, n = Math.max(2, Math.ceil(run / 1.5));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (run * i) / n, e = Math.min(1, d / ramp, (run - d) / ramp), wq = Math.sin((2 * Math.PI * d) / lam + (o.ph ?? 0)) * amp * e;
    pts.push(`${i ? 'L' : 'M'}${f(x0 + ux * d - uy * wq)},${f(y0 + uy * d + ux * wq)}`);
  }
  if (o.head) pts.push(`L${f(x1)},${f(y1)}`);
  return `<path class="fl04-w" style="stroke:${col}${o.w ? `;stroke-width:${o.w}` : ''}${o.op ? `;opacity:${o.op}` : ''}" d="${pts.join('')}"${o.head ? ` marker-end="url(#${o.head})"` : ''}/>`;
}
/** White light: blue, green and red waves side by side. */
function beam(p: string, x0: number, y0: number, x1: number, y1: number, gap = 10, o: { head?: boolean; amp?: number; fade?: boolean } = {}): string {
  const L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  return ([['b', BLUE, 18], ['g', GREEN, 22], ['r', RED, 26]] as Array<[string, string, number]>).map(([k, c, lam], i) => {
    const o2 = (i - 1) * gap;
    return wv(x0 + nx * o2, y0 + ny * o2, x1 + nx * o2, y1 + ny * o2, lam, c, { head: o.head ? `${p}-h${k}` : undefined, amp: o.amp ?? 5, ph: i * 1.3 });
  }).join('');
}
/** An air molecule (N₂) as two touching atom balls. */
function n2(x: number, y: number, ang = 20, r = 14): string {
  const dx = Math.cos((ang * Math.PI) / 180) * r * 0.78, dy = Math.sin((ang * Math.PI) / 180) * r * 0.78;
  return [-1, 1].map(k => `<circle class="fl04-atom" cx="${f(x + k * dx)}" cy="${f(y + k * dy)}" r="${r}"/>${r >= 12 ? T(x + k * dx, y + k * dy + 5.5, 'N', 'fl04-atom-t', 'middle') : ''}`).join('');
}
function sun(x: number, y: number, r: number, cls = 'fl04-sun'): string {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, c = Math.cos(a), s = Math.sin(a);
    return `M${f(x + c * (r + 6))},${f(y + s * (r + 6))}L${f(x + c * (r + 14))},${f(y + s * (r + 14))}`;
  }).join('');
  return `<path class="fl04-ray" d="${rays}"/><circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
}
/** A value chip, e.g. an energy per photon. */
const chip = (x: number, y: number, s: string, cls = 'fl04-chip', w = 0): string => {
  const ww = w || s.length * 11.5 + 22;
  return `<rect class="${cls}" x="${f(x - ww / 2)}" y="${y - 17}" width="${f(ww)}" height="34" rx="17"/>${T(x, y + 7, s, 'fl04-chip-t', 'middle')}`;
};
/** Sunset in miniature, inside a box: a cap of the curved Earth under a shell of air (not to scale). The noon
 *  ray crosses the shell straight down; the sunset ray skims along it, so it crosses far more air. */
function sunsetMini(id: string, x: number, y: number, w: number, h: number, labels = true): string {
  const t = h * 0.3, R = w * 1.25, cx = x + w * 0.62, top = y + h - h * 0.18; // observer on the Earth's top
  const cy = top + R, A = R + t;
  const sunY = top - t - 16, half = Math.sqrt(A * A - R * R);
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">
    <circle class="fl04-air" cx="${f(cx)}" cy="${f(cy)}" r="${f(A)}"/><circle class="fl04-earth" cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/>
    <path class="fl04-path fl04-path-noon" d="M${f(cx)},${f(sunY + 10)} V${f(top)}"/>
    <path class="fl04-path fl04-path-set" d="M${f(Math.max(x + 16, cx - half - 10))},${f(top - 3)} L${f(cx)},${f(top - 3)}"/>
    <circle class="fl04-sun" cx="${f(cx)}" cy="${f(sunY)}" r="9"/>
    <path class="fl04-setsun" d="M${f(x + 2)},${f(top - 3)} a12,12 0 0 1 24,0Z"/>
    <circle class="fl04-obs" cx="${f(cx)}" cy="${f(top)}" r="4.5"/></g>
    ${labels ? `${T(cx + 16, sunY + 7, 'noon', 'fl04-tk')}${T(x + 32, top - 14, 'sunset', 'fl04-tk')}` : ''}`;
}

/* ---------- 4E · Clippings board (picked on the old slide 4) ---------- */

/** A newspaper clipping on the board: newsprint with scissor-cut edges and a strip of tape (4E's look). */
function clipping(p: string, x: number, y: number, w: number, h: number, rot: number, seed: number, inner: string): string {
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><path class="fl04-paper fl04-news" d="${cutPath(x, y, w, h, seed, 2.2)}" filter="url(#${p}-sh)"/>${inner}
      <rect class="fl04-tape" x="${x + w / 2 - 36}" y="${y - 12}" width="72" height="24" transform="rotate(${-rot * 2} ${x + w / 2} ${y})"/></g>`;
}

function drawE(): string {
  const p = 'fl04e';
  const clip = (x: number, y: number, w: number, h: number, rot: number, seed: number, inner: string): string => clipping(p, x, y, w, h, rot, seed, inner);
  const c1 = clip(22, 30, 404, 262, -1.6, 41, `
    ${T(40, 60, '1905 · LIGHT QUANTA', 'fl04-kick')}<path class="fl04-rule" d="M40,70 H408"/>
    ${T(40, 106, 'Light comes in', 'fl04-head')}${T(40, 140, 'packets of energy', 'fl04-head')}
    ${cutout(p, 'e', 36, 158, 112, 122, EINSTEIN, 0, 51)}
    ${T(166, 192, 'E = hν = hc/λ', 'fl04-eq fl04-eq-m')}
    ${lines(166, 232, ['blue, 450 nm: 2.76 eV', 'red, 650 nm: 1.91 eV'], 'fl04-body', 'start', 28)}`);
  const c2 = clip(380, 214, 398, 248, 1.4, 43, `
    ${T(398, 244, '1871 · 1899 · SKY LIGHT', 'fl04-kick')}<path class="fl04-rule" d="M398,254 H760"/>
    ${T(398, 290, 'Why the sky', 'fl04-head')}${T(398, 324, 'is blue', 'fl04-head')}
    ${cutout(p, 'r', 636, 270, 116, 142, RAYLEIGH, 0, 53)}
    ${T(398, 368, `scattering ${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-m')}
    ${lines(398, 410, ['Same wavelength,', 'new direction.'], 'fl04-body', 'start', 28)}`);
  const c3 = clip(84, 352, 300, 218, -0.8, 47, `
    ${T(102, 382, 'AT SUNSET', 'fl04-kick')}<path class="fl04-rule" d="M102,392 H366"/>
    ${sunsetMini(`${p}-ss`, 102, 404, 264, 152)}`);
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Three newspaper clippings: Einstein 1905, light comes in packets of energy, blue 450 nm 2.76 eV, red 650 nm 1.91 eV; Rayleigh, why the sky is blue, same wavelength, new direction; and at sunset, the noon and sunset paths through the air.">
    ${defs(p)}${c1}<g transform="translate(0 -24)">${c2}</g>${c3}
  </svg>`;
}

/* ---------- 4F · Zoom in: into the beam (photons) and into the air (shaken charges); picked on the old slide 4 ---------- */

/** The two outer tangents from a small spot to a zoom lens (4F). */
function tangent(from: Pt, r0: number, to: Pt, r1: number): string {
  const dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.acos((r1 - r0) / d);
  return [1, -1].map(sg => {
    const t = a + sg * b;
    return `M${f(from[0] - r0 * Math.cos(t))},${f(from[1] - r0 * Math.sin(t))} L${f(to[0] - r1 * Math.cos(t))},${f(to[1] - r1 * Math.sin(t))}`;
  }).join('');
}

/** 4F's zoom into the beam: a blue and a red photon with their energies in a lens of radius R.
 *  `dy` places the blue packet, its chip, the red packet and its chip below the centre; the chips keep their size. */
function beamLens(cx: number, cy: number, R: number, dy: [number, number, number, number] = [-46, -2, 52, 96]): string {
  const k = R / 128, x = cx - 8 * k;
  return `<circle class="fl04-lens" cx="${cx}" cy="${cy}" r="${R}"/>
    ${packet(x, cy + dy[0], 120 * k, 16 * k, 13 * k, BLUE)}${chip(x, cy + dy[1], E_BLUE)}
    ${packet(x, cy + dy[2], 140 * k, 23 * k, 13 * k, RED)}${chip(x, cy + dy[3], E_RED)}`;
}

/** 4F's zoom into the air: blue and red arrive, the field shakes the molecule's charges, and blue leaves in new
 *  directions far more than red. Drawn in a lens of radius R. */
function airLens(p: string, cx: number, cy: number, R: number): string {
  const k = R / 128, X = (v: number): number => cx + v * k, Y = (v: number): number => cy + v * k;
  return `<circle class="fl04-lens" cx="${cx}" cy="${cy}" r="${R}"/>
    ${wv(X(-124), Y(-10), X(-42), Y(-10), 18, BLUE, { amp: 6 * k })}${wv(X(-124), Y(12), X(-42), Y(12), 26, RED, { amp: 6 * k, ph: 1 })}
    ${wv(X(2), Y(34), X(4), Y(104), 26, RED, { amp: 4 * k, head: `${p}-hr`, op: 0.5 })}
    <ellipse class="fl04-cloud" cx="${cx}" cy="${cy}" rx="${f(42 * k)}" ry="${f(30 * k)}"/>${n2(cx, cy, 0, Math.max(12, 13 * k))}
    ${arrow(p, 'ink', `M${f(X(54))},${f(Y(-2))} L${f(X(54))},${f(Y(-38))}`)}${arrow(p, 'ink', `M${f(X(54))},${f(Y(2))} L${f(X(54))},${f(Y(38))}`)}
    ${wv(X(20), Y(-34), X(70), Y(-96), 18, BLUE, { amp: 5 * k, head: `${p}-hb` })}${wv(X(-18), Y(-36), X(-58), Y(-100), 18, BLUE, { amp: 5 * k, head: `${p}-hb` })}
    ${wv(X(20), Y(34), X(74), Y(92), 18, BLUE, { amp: 5 * k, head: `${p}-hb` })}${wv(X(-20), Y(34), X(-64), Y(94), 18, BLUE, { amp: 5 * k, head: `${p}-hb` })}`;
}

function drawF(): string {
  const p = 'fl04f';
  const Lc: Pt = [196, 330], Rc: Pt = [604, 330], R = 128;
  const spotL: Pt = [150, 112], spotR: Pt = [612, 108];
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Two zooms. Into a sunbeam: photons, a blue one carrying 2.76 eV and a red one 1.91 eV. Into the air: light's electric field shakes a molecule's charges, which re-emit light in new directions, blue far more than red.">
    ${defs(p)}<g transform="translate(0 12)">
    ${sun(40, 40, 22)}${beam(p, 62, 62, 300, 170, 9, { amp: 4.5 })}
    <path class="fl04-zoomfan" d="${tangent(spotL, 22, Lc, R)}"/>
    <circle class="fl04-spot" cx="${spotL[0]}" cy="${spotL[1]}" r="22"/>
    ${beamLens(Lc[0], Lc[1], R)}
    ${cutout(p, 'e', 300, 18, 96, 120, EINSTEIN, 2, 61)}
    ${n2(spotR[0], spotR[1], 25, 9)}<circle class="fl04-spot" cx="${spotR[0]}" cy="${spotR[1]}" r="22"/>
    ${beam(p, 440, 40, 588, 98, 8, { amp: 3.5 })}
    <path class="fl04-zoomfan" d="${tangent(spotR, 22, Rc, R)}"/>
    ${airLens(p, Rc[0], Rc[1], R)}
    ${cutout(p, 'r', 690, 18, 96, 120, RAYLEIGH, -2, 63)}
    ${T(Lc[0], 504, 'photons', 'fl04-b', 'middle')}
    ${T(Rc[0], 504, 'shaken charges re-emit light', 'fl04-b', 'middle')}
    ${T(Lc[0], 550, 'zoom into the beam', 'fl04-note', 'middle')}${T(Rc[0], 550, 'zoom into the air', 'fl04-note', 'middle')}
  </g></svg>`;
}

/* ---------- 4H · Four steps (picked on the old slide 4) ---------- */

/** 4H's numbered step badge. */
const stepNum = (x: number, y: number, n: string): string =>
  `<circle class="fl04-num" cx="${x}" cy="${y}" r="15"/>${T(x, y + 7, n, 'fl04-num-t', 'middle')}`;

/** 4H's air step: blue and red arrive at an air molecule; red goes on, blue leaves in new directions.
 *  (x, y) is the molecule; `s` shortens the waves, the molecule keeps its size. */
function scatterMini(p: string, x: number, y: number, s = 1): string {
  return `${wv(x - 110 * s, y - 10, x - 20, y - 10, 18, BLUE, { amp: 5 })}${wv(x - 110 * s, y + 10, x - 20, y + 10, 26, RED, { amp: 5, ph: 1 })}
    ${n2(x, y, 25, 12)}
    ${wv(x + 20, y + 2, x + 122 * s, y + 2, 26, RED, { amp: 5, head: `${p}-hr` })}
    ${wv(x + 8, y - 14, x + 62 * s, y - 68 * s, 18, BLUE, { amp: 5, head: `${p}-hb` })}${wv(x + 2, y + 18, x + 40 * s, y + 70 * s, 18, BLUE, { amp: 5, head: `${p}-hb` })}`;
}

/** The bodies of 4H's four panels, in 4H's own coordinates (panels at (8,8), (408,8), (8,308), (408,308)). */
function hBodies(p: string): [string, string, string, string] {
  const b1 = `${cutout(p, 'e', 22, 112, 100, 124, EINSTEIN, -2, 81)}
    ${beam(p, 146, 174, 256, 174, 9, { amp: 4 })}${arrow(p, 'ink', 'M264,174 L288,174')}
    ${packet(336, 136, 44, 9, 6, BLUE, 0, 2.6)}${packet(342, 174, 44, 12, 6, GREEN, 0, 2.6)}${packet(336, 212, 44, 15, 6, RED, 0, 2.6)}`;
  const b2 = `${packet(470, 136, 64, 10, 9, BLUE)}${chip(600, 136, `450 nm · ${E_BLUE}`, 'fl04-chip', 200)}
    ${packet(470, 198, 72, 15, 9, RED)}${chip(600, 198, `650 nm · ${E_RED}`, 'fl04-chip', 200)}`;
  const b3 = `${cutout(p, 'r', 22, 400, 100, 124, RAYLEIGH, 2, 83)}
    ${scatterMini(p, 250, 450)}
    ${T(146, 556, 'same λ, new direction', 'fl04-s')}`;
  const b4 = `${sunsetMini(`${p}-ss`, 420, 380, 356, 180)}`;
  return [b1, b2, b3, b4];
}

function drawH(): string {
  const p = 'fl04h';
  const panel = (x: number, y: number, n: string, kicker: string, body: string): string =>
    `<rect class="fl04-card" x="${x}" y="${y}" width="384" height="284" rx="16"/>
     ${stepNum(x + 30, y + 32, n)}
     ${T(x + 56, y + 38, kicker, 'fl04-kick2')}${body}`;
  const [b1, b2, b3, b4] = hBodies(p);
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Four numbered panels: Einstein, sunlight split into photons; Einstein, 450 nm 2.76 eV and 650 nm 1.91 eV; Rayleigh, an air molecule sends blue in new directions while red goes on, same wavelength, new direction; Rayleigh, the noon and sunset paths through the air.">
    ${defs(p)}
    ${panel(8, 8, '1', 'EINSTEIN', b1)}
    ${panel(408, 8, '2', 'EINSTEIN', b2)}
    ${panel(8, 308, '3', 'RAYLEIGH', b3)}
    ${panel(408, 308, '4', 'RAYLEIGH', b4)}
  </svg>`;
}

/* ---------- 4U and 4X · the photon, its energy, and what that energy can do ---------- */
// Light is drawn only as separate wave packets, each resting on a short level at its energy; E = hc/λ is at most a
// faint dotted guide; the effects are "DNA damage, sunburn", "vision, photosynthesis" and "heat lamp"; the clipping is EINSTEIN_SLIDE
// (the page text defines h and c). Every label is at least 19 px.

/** Four photons across the spectrum: energy in eV from E = hc/λ = 1239.84 eV·nm / λ (4.1, 2.8, 1.9, 1.2 eV). */
const PHOTONS = [
  { name: 'ultraviolet', nm: 300, col: '#7a5fb0', fate: 'bond' },
  { name: 'blue', nm: 450, col: BLUE, fate: 'lift' },
  { name: 'red', nm: 650, col: RED, fate: 'lift' },
  { name: 'infrared', nm: 1000, col: '#9a7b62', fate: 'heat' },
] as const;
type Photon = (typeof PHOTONS)[number];
const eV = (nm: number): number => 1239.84 / nm;
const eVs = (nm: number): string => `${eV(nm).toFixed(1)} eV`;
/** The clipping's width, as Rayleigh's on slide 3 (200–206 px); CR is its left edge in the right column. */
const CW = 208, CR = 800 - 26 - CW;
/** Arrowheads for the axes and the electron's jump. */
const pDefs = (p: string): string => `<defs>
  <marker id="${p}-ax" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#6b6a64"/></marker>
  <marker id="${p}-up" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="#b5770b"/></marker>
  <marker id="${p}-go" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#8a877d"/></marker>
</defs>`;
/** One photon drawn as a wave packet: wavelength in proportion (`k` px per nm), the same envelope for all four. */
const photon = (ph: Photon, cx: number, cy: number, len: number, k: number, amp = 12, ang = 0, w = 3.2): string =>
  packet(cx, cy, len, ph.nm * k, amp, ph.col, ang, w);
/** A vertical energy axis at x, from y0 up to y1 (arrow), with ticks via y(e). */
function vAxis(p: string, x: number, y0: number, y1: number, y: (e: number) => number, ticks: number[]): string {
  return `<path class="fl04-axis" d="M${x},${y0} V${y1}" marker-end="url(#${p}-ax)"/>${ticks.map(t =>
    `<path class="fl04-axis" d="M${x - 7},${f(y(t))} H${x}"/>${T(x - 13, y(t) + 7, String(t), 'fl04-tick', 'end')}`).join('')}`;
}
/** A horizontal axis at y, from x0 to x1 (arrow), with ticks via x(v) and their labels below. */
function hAxis(p: string, y: number, x0: number, x1: number, x: (v: number) => number, ticks: number[]): string {
  return `<path class="fl04-axis" d="M${x0},${y} H${x1}" marker-end="url(#${p}-ax)"/>${ticks.map(t =>
    `<path class="fl04-axis" d="M${f(x(t))},${y} V${y + 7}"/>${T(x(t), y + 30, String(t), 'fl04-tick', 'middle')}`).join('')}`;
}
/** An electron in a pigment, lifted from a lower to an upper level: what a visible photon can do. About 84 × 66. */
function pigmentPic(p: string, cx: number, cy: number): string {
  const w = 42, h = 27;
  return `<path class="fl04-lvl" d="M${cx - w},${cy + h} H${cx + w} M${cx - w},${cy - h} H${cx + w}"/>
    <circle class="fl04-e-old" cx="${cx}" cy="${cy + h}" r="8"/>
    <path class="fl04-jump" d="M${cx},${cy + h - 12} V${cy - h + 17}" marker-end="url(#${p}-up)"/>
    <circle class="fl04-e" cx="${cx}" cy="${cy - h}" r="9"/>`;
}
/** Heat: three rising wavy lines, what an infrared photon mostly does. About 50 × 52. */
const heatPic = (cx: number, cy: number): string => [-16, 0, 16].map(dx =>
  `<path class="fl04-heat" d="M${cx + dx},${cy + 26} c-8,-9 8,-17 0,-26 c-8,-9 8,-17 0,-26"/>`).join('');
const NM = [300, 450, 650, 1000];
type Kind = 'bond' | 'lift' | 'heat';
/** Each effect named by what it is in daily life, two short lines (lecturer, 27 Oct 2026). */
const FX: Record<Kind, string[]> = { bond: ['DNA damage,', 'sunburn'], lift: ['vision,', 'photosynthesis'], heat: ['heat lamp'] };
/** DNA damage: a double helix (two backbones, two-tone base-pair rungs) snapped in two, a red flash at the break.
 *  `len` is its length along the helix axis; `vertical` stands it upright. */
function dnaDamage(cx: number, cy: number, len = 128, vertical = false): string {
  const A = 19, P = 60, g = 12, n = 36;
  const v = (u: number, k: number): number => k * A * Math.cos((2 * Math.PI * u) / P);
  const strand = (u0: number, u1: number, k: number): string => Array.from({ length: n + 1 }, (_, i) => {
    const u = u0 + ((u1 - u0) * i) / n;
    return `${i ? 'L' : 'M'}${f(u)},${f(v(u, k))}`;
  }).join('');
  const rungs = (u0: number, u1: number): string => {
    let d1 = '', d2 = '';
    for (let u = Math.ceil(u0 / (P / 8)) * (P / 8); u <= u1; u += P / 8) {
      if (Math.abs(Math.cos((2 * Math.PI * u) / P)) < 0.45) continue;
      const a = v(u, 1), b = v(u, -1), m = (a + b) / 2;
      d1 += `M${f(u)},${f(a)} V${f(m)}`; d2 += `M${f(u)},${f(m)} V${f(b)}`;
    }
    return `<path class="fl04-bp1" d="${d1}"/><path class="fl04-bp2" d="${d2}"/>`;
  };
  // each half droops a little from the break, as if snapped
  const half = (u0: number, u1: number, rot: number, pivot: number): string =>
    `<g transform="rotate(${rot} ${pivot} 0)">${rungs(u0, u1)}<path class="fl04-bb2" d="${strand(u0, u1, -1)}"/><path class="fl04-bb1" d="${strand(u0, u1, 1)}"/></g>`;
  const zap = [0, 45, 90, 135, 180, 225, 270, 315].map(a => {
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180), r0 = a % 90 ? 5 : 4, r1 = a % 90 ? 10 : 14;
    return `M${f(c * r0)},${f(s * r0)} L${f(c * r1)},${f(s * r1)}`;
  }).join('');
  return `<g transform="translate(${f(cx)} ${f(cy)})${vertical ? ' rotate(90)' : ''}">
    ${half(-len / 2, -g, -7, -g)}${half(g, len / 2, 7, g)}<path class="fl04-zap" d="${zap}"/></g>`;
}
/** An effect picture with its name. `dy` is the name's baseline below the picture's centre (or `dx`/`a` beside it);
 *  `two` breaks the name over two lines. */
function fx(p: string, kind: Kind, cx: number, cy: number, o: { dx?: number; dy?: number; a?: A; two?: boolean; vertical?: boolean; len?: number; s?: number } = {}): string {
  const len = o.len ?? 128, k = o.s ?? 1;
  const raw = kind === 'bond' ? dnaDamage(cx, cy, len, o.vertical) : kind === 'lift' ? pigmentPic(p, cx, cy) : heatPic(cx, cy);
  // `s` enlarges the picture about its centre; the name keeps its size
  const pic = k === 1 ? raw : `<g transform="translate(${f(cx)} ${f(cy)}) scale(${k}) translate(${f(-cx)} ${f(-cy)})">${raw}</g>`;
  const lab = FX[kind];
  const dy = o.dy ?? (kind === 'bond' ? (o.vertical ? len / 2 + 30 : 54) : kind === 'lift' ? 62 : 58);
  return pic + lines(cx + (o.dx ?? 0), cy + dy, lab, 'fl04-obj', o.a ?? 'middle', 24);
}
/** The visible spectrum as a horizontal gradient from x1 (380 nm) to x2 (780 nm). */
function visGrad(id: string, x1: number, x2: number): string {
  const st: Array<[number, string]> = [[380, '#7b4fc0'], [440, '#2350e6'], [490, '#1aa0c8'], [530, '#2a963a'], [580, '#e3c21c'], [620, '#e07a1f'], [680, '#c8361e'], [780, '#7a1f17']];
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="0" x2="${f(x2)}" y2="0">${st.map(([nm, c]) => `<stop offset="${f((nm - 380) / 400)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
}
const CHS = clipHeight(CW, EINSTEIN_SLIDE); // about 316 px: name, year and formula
/** A photon on its energy step: a short level at y = yl in the photon's colour, the wave packet resting on it. */
function onStep(ph: Photon, x: number, yl: number, len: number, K: number, w = len + 14): string {
  return `<path class="fl04-step" d="M${f(x - w / 2)},${f(yl)} H${f(x + w / 2)}" style="stroke:${ph.col}"/>${photon(ph, x, yl - 18, len, K, 10, 0, 3)}`;
}
/** E = hc/λ as a faint dotted guide through the steps. */
function hcGuide(X: (nm: number) => number, Y: (e: number) => number, nm0: number, nm1: number): string {
  const d = Array.from({ length: 81 }, (_, i) => { const nm = nm0 + ((nm1 - nm0) * i) / 80; return `${i ? 'L' : 'M'}${f(X(nm))},${f(Y(eV(nm)))}`; }).join('');
  return `<path class="fl04-hc" d="${d}"/>`;
}
/** Energy and wavelength axes with ticks; the wavelength ticks sit at the four photons. */
const eAxes = (p: string, ox: number, oy: number, xEnd: number, yTop: number, X: (nm: number) => number, Y: (e: number) => number): string =>
  `${vAxis(p, ox, oy, yTop, Y, [0, 1, 2, 3, 4])}${hAxis(p, oy, ox, xEnd, X, NM)}`;
/** A small "photon" label on a short leader from (x0, y0) on a packet to (x1, y1); the label sits beyond the leader. */
const photonTag = (x0: number, y0: number, x1: number, y1: number, a: A = 'start'): string =>
  `<path class="fl04-lead" d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}"/>${T(x1 + (a === 'end' ? -4 : a === 'start' ? 4 : 0), y1 + (y1 < y0 ? -4 : 16), 'photon', 'fl04-val', a)}`;
/** Top of a clipping centred in the figure's height. */
const CB = Math.round((600 - CHS) / 2);

/* ---------- 4U · Effects under the axis: steps over a spectrum strip, the effects beneath; Einstein right ---------- */

function drawU(): string {
  const p = 'fl04u', ox = 74, oy = 380, K = 0.032;
  const X = (nm: number): number => ox + (nm - 160) * 0.52, Y = (e: number): number => oy - e * 74;
  const steps = PHOTONS.map(ph => onStep(ph, X(ph.nm), Y(eV(ph.nm)), 66, K, 72)).join('');
  const lab = (nm: number, dx: number, dy: number, a: A = 'start'): string => T(X(nm) + dx, Y(eV(nm)) + dy, eVs(nm), 'fl04-lab', a);
  const sy = oy + 42, sh = 28, x0 = X(160), xu = X(380), xv = X(780), x1 = X(1050);
  const xb = X(450), yb = Y(eV(450)) - 18;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Four photons, drawn as separate wave packets at their true relative wavelengths, each resting on a short level at its energy on a graph of energy per photon in electronvolts against wavelength in nanometres: 300 nm 4.1 eV, 450 nm 2.8 eV, 650 nm 1.9 eV, 1000 nm 1.2 eV; a faint dotted guide links the levels. A strip under the wavelength axis marks ultraviolet, visible and infrared; under it, an everyday example of each: DNA damage and sunburn, vision and photosynthesis, a heat lamp. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
    ${pDefs(p)}<defs>${visGrad(`${p}-vg`, xu, xv)}</defs>
    ${T(50, 34, 'energy per photon (eV)', 'fl04-ax')}${T(548, 34, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${hcGuide(X, Y, 280, 1045)}
    ${eAxes(p, ox, oy, 548, 50, X, Y)}
    ${steps}
    ${lab(300, 46, 7)}${lab(450, 46, 7)}${lab(650, 46, 7)}${lab(1000, 0, -46, 'middle')}
    ${photonTag(xb - 26, yb + 6, xb - 50, yb + 42, 'end')}
    ${T(548, oy - 12, 'wavelength (nm)', 'fl04-ax', 'end')}
    <rect class="fl04-strip fl04-band-uv" x="${f(x0)}" y="${sy}" width="${f(xu - x0)}" height="${sh}"/>
    <rect class="fl04-strip" x="${f(xu)}" y="${sy}" width="${f(xv - xu)}" height="${sh}" fill="url(#${p}-vg)" fill-opacity=".3"/>
    <rect class="fl04-strip fl04-band-ir" x="${f(xv)}" y="${sy}" width="${f(x1 - xv)}" height="${sh}"/>
    ${T((x0 + xu) / 2, sy + 20, 'ultraviolet', 'fl04-strip-t', 'middle')}${T((xu + xv) / 2, sy + 20, 'visible', 'fl04-strip-t', 'middle')}${T((xv + x1) / 2, sy + 20, 'infrared', 'fl04-strip-t', 'middle')}
    ${fx(p, 'bond', (x0 + xu) / 2, 510, { dy: 66, len: 116, s: 1.2 })}
    ${fx(p, 'lift', (xu + xv) / 2, 506, { dy: 70, s: 1.2 })}
    ${fx(p, 'heat', (xv + x1) / 2, 508, { dy: 68, s: 1.2 })}
    ${newsClip(p, CR, CB, CW, EINSTEIN_SLIDE, 2, 11)}
  </svg>`;
}

/* ---------- 4X · Effects on the energy axis: each step reaches back to the axis, its effect level with it on the left ---------- */

function drawX(): string {
  const p = 'fl04x', ox = 196, oy = 520, xe = 88, K = 0.03;
  const X = (nm: number): number => ox + (nm - 200) * 0.38, Y = (e: number): number => oy - e * 104;
  const steps = PHOTONS.map(ph => `<path class="fl04-guide" d="M${ox + 6},${f(Y(eV(ph.nm)))} H${f(X(ph.nm) - 38)}"/>${onStep(ph, X(ph.nm), Y(eV(ph.nm)), 64, K, 72)}`).join('');
  const lab = (i: number, dx: number, dy: number, a: A = 'start'): string => {
    const ph = PHOTONS[i];
    return T(X(ph.nm) + dx, Y(eV(ph.nm)) + dy, `${ph.name} <tspan class="fl04-tv">${eVs(ph.nm)}</tspan>`, 'fl04-lab', a);
  };
  const yb = Y(eV(450)), yr = Y(eV(650)), xb = X(450);
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Four photons, drawn as separate wave packets at their true relative wavelengths, each resting on a short level at its energy on a graph of energy per photon in electronvolts against wavelength in nanometres: ultraviolet 300 nm 4.1 eV, blue 450 nm 2.8 eV, red 650 nm 1.9 eV, infrared 1000 nm 1.2 eV. Each level reaches back to the energy axis; left of it, level with the photons, an everyday example of each: DNA damage and sunburn at 4.1 eV, vision and photosynthesis between 1.9 and 2.8 eV, a heat lamp at 1.2 eV. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
    ${pDefs(p)}
    ${T(24, 36, 'energy per photon (eV)', 'fl04-ax')}${T(548, 36, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${eAxes(p, ox, oy, 548, 64, X, Y)}
    ${steps}
    ${T(548, oy - 12, 'wavelength (nm)', 'fl04-ax', 'end')}
    ${lab(0, 44, 7)}${lab(1, 44, 7)}${lab(2, 44, 7)}${lab(3, 52, 32, 'end')}
    ${photonTag(xb + 30, yb - 26, xb + 46, yb - 52)}
    ${fx(p, 'bond', xe, Y(eV(300)), { dy: 58, len: 110, s: 1.1 })}
    <path class="fl04-br" d="M154,${f(yb)} H146 V${f(yr)} H154"/>
    ${fx(p, 'lift', xe - 4, (yb + yr) / 2 - 14, { dy: 68, two: true, s: 1.1 })}
    ${fx(p, 'heat', xe, Y(eV(1000)) + 32, { dy: 62, s: 1.1 })}
    ${newsClip(p, CR, CB, CW, EINSTEIN_SLIDE, 2, 11)}
  </svg>`;
}

const DRAW: Record<string, () => string> = { e: drawE, f: drawF, h: drawH, u: drawU, x: drawX };

export function draw(id: string): string {
  return (DRAW[id] ?? drawU)();
}
