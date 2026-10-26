// Slide L04 · Light is also a particle (since 26 Oct 2026; was "Photon energy and scattering"). Light-block order v5
// (research/figure-briefs/ORDER_PROPOSAL.md): a photon's energy is set by its wavelength (E = hc/λ; 300 nm 4.1 eV,
// 450 nm 2.8 eV, 650 nm 1.9 eV, 1000 nm 1.2 eV), and the energy decides what the photon can do. Scattering moved to
// the wave slide (L03). Variants P and Q carry Einstein's history as a newspaper clipping; the earlier
// Einstein-and-Rayleigh variants still draw by id.
import type { PlateText, Variant } from '../types';
import { arrow, heads } from '../mechanisms';
import './l04.css';
import { clipping as newsClip, clipHeight, EINSTEIN_CLIP, EINSTEIN_SLIDE } from './clipping';

export const PLATE: PlateText = {
  n: '4',
  status: 'confirmed',
  title: 'Light is also a particle',
  lead: 'Light comes in discrete packets of energy: photons.',
  points: [
    { claim: 'Photon energy.', text: 'E = hc/λ<br>h: Planck constant · c: speed of light<br>A blue photon carries ~1.4× the energy of a red one.' },
    { claim: 'Energy decides the effect.', text: 'Ultraviolet: damages DNA<br>Visible: excites electrons in pigments<br>Infrared: warms' },
    { claim: 'Light intensity.', text: 'Brighter light = more photons,<br>not more energetic ones.' },
  ],
  refs: [
    { label: 'Einstein 1905', url: 'https://doi.org/10.1002/andp.19053220607' },
    { label: 'Nobel archive: light quanta', url: 'https://www.nobelprize.org/prizes/physics/the-dual-nature-of-light-as-reflected-in-the-nobel-archives/' },
  ],
};

// Round 2 (26 Oct 2026): the lecturer picked R; U–Y are built from it (SLIDE34_BRIEF.md) and reworked in round 3 to
// draw light as separate photons. P, Q, S, T and the Einstein-and-Rayleigh variants (picks E, F, H and their combinations K–O) are unlisted but still draw by id.
export const VARIANTS: Variant[] = [
  { id: 'r', name: 'Energy against wavelength' },
  { id: 'u', name: 'Effects under the axis' },
  { id: 'v', name: 'Effects beside the photons' },
  { id: 'w', name: 'Spectrum columns behind the steps' },
  { id: 'x', name: 'Effects on the energy axis' },
  { id: 'y', name: 'Clipping in the corner' },
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
const PLANCK: Who = { name: 'Max Planck', mid: 'M. Planck', short: 'Planck' };

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

const eye = (x: number, y: number, s = 1, flip = false): string => {
  const d = flip ? -1 : 1;
  return `<path class="fl04-eyeball" d="M${f(x - 24 * s)},${y} Q${x},${f(y - 22 * s)} ${f(x + 24 * s)},${y} Q${x},${f(y + 22 * s)} ${f(x - 24 * s)},${y}Z"/>
   <circle class="fl04-iris" cx="${f(x - d * 4 * s)}" cy="${y}" r="${f(8.5 * s)}"/><circle class="fl04-pupil" cx="${f(x - d * 4 * s)}" cy="${y}" r="${f(3.8 * s)}"/>`;
};

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

/* ---------- 4A · Two cutouts: the confirmed display, text-forward ---------- */

function drawA(): string {
  const p = 'fl04a';
  const col = (x: number, who: Who, rot: number, seed: number, year: string, head: string[], eq: string, key: string[], take: string[]): string => `
    ${cutout(p, who.name[0], x, 24, 156, 200, who, rot, seed)}
    ${T(x + 176, 54, year, 'fl04-tk')}${lines(x + 176, 88, head, 'fl04-h', 'start', 31)}
    ${T(x + 180, 268, eq, 'fl04-eq', 'middle')}
    ${lines(x, 312, key, 'fl04-key', 'start', 26)}
    <path class="fl04-rule" d="M${x},${382} h360"/>
    ${lines(x, 412, take, 'fl04-b', 'start', 28)}`;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Two newspaper-cutout portraits, Einstein and Rayleigh, each with a finding, an equation, its symbols and a takeaway; a footer explains the sunset.">
    ${defs(p)}
    ${col(16, EINSTEIN, -2, 11, 'Einstein · 1905', ['Light comes', 'in quanta'], 'E = hν = hc/λ',
      ['E  energy of one photon', 'h  Planck’s constant,  ν  frequency', 'c  speed of light,  λ  wavelength'],
      ['A blue photon carries more', 'energy than a red one.', 'Brighter light: more photons,', 'not bigger ones.'])}
    <path class="fl04-div" d="M400,30 V506"/>
    ${col(424, RAYLEIGH, 2, 29, 'Rayleigh · 1871', ['Air scatters', 'short waves'], `scattering ${PROP} 1/λ⁴`,
      [`${PROP}  proportional to`, 'λ  wavelength', 'shorter λ: far more scattering'],
      ['Blue (450 nm) ≈ 4.4× red', '(650 nm). Same wavelength,', 'new direction.'])}
    <rect class="fl04-foot" x="16" y="522" width="768" height="70" rx="14"/>
    ${sunsetMiniIcon(66, 557)}
    ${T(118, 550, 'Sunset: a longer path through air', 'fl04-b')}${T(118, 578, 'Blue is scattered out of the beam; red and orange remain.', 'fl04-s')}
  </svg>`;
}

/** A tiny sunset glyph: a half Sun on a horizon. */
function sunsetMiniIcon(x: number, y: number): string {
  return `<path class="fl04-setsun" d="M${x - 24},${y + 8} A24,24 0 0 1 ${x + 24},${y + 8}Z"/><path class="fl04-horizon" d="M${x - 38},${y + 8} H${x + 38}"/>
    <path class="fl04-ray" d="M${x - 34},${y - 14} l-7,-5 M${x},${y - 26} v-9 M${x + 34},${y - 14} l7,-5"/>`;
}

/* ---------- 4B · Ratio bars: blue vs red under the two laws ---------- */

function drawB(): string {
  const p = 'fl04b';
  const base = 456, unit = 58; // one "red" = 58 px in both panels
  const bar = (x: number, v: number, col: string, top: string, nm: string): string =>
    `<rect class="fl04-bar" x="${x - 40}" y="${f(base - v * unit)}" width="80" height="${f(v * unit)}" style="fill:${col}"/>
     ${T(x, base - v * unit - 12, top, 'fl04-b', 'middle')}${T(x, base + 30, nm, 'fl04-tk', 'middle')}`;
  const ratio = (x: number, y: number, s: string): string => `${chip(x, y, s, 'fl04-chip fl04-chip-k', 76)}`;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Blue at 450 nm against red at 650 nm: energy per photon is about 1.4 times higher, scattering by air about 4.4 times higher. Two different laws.">
    ${defs(p)}
    ${cutout(p, 'e', 20, 18, 112, 140, EINSTEIN, -2, 5)}
    ${T(150, 50, 'Einstein', 'fl04-tk')}${T(150, 82, 'energy per photon', 'fl04-h')}${T(150, 118, 'E = hc/λ', 'fl04-eq fl04-eq-m')}
    ${cutout(p, 'r', 418, 18, 112, 140, RAYLEIGH, 2, 9)}
    ${T(548, 50, 'Rayleigh', 'fl04-tk')}${T(548, 82, 'scattering by air', 'fl04-h')}${T(548, 118, `${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-m')}
    <path class="fl04-div" d="M400,30 V490"/>
    ${bar(120, 1.44, '#7f98f0', E_BLUE, 'blue 450 nm')}${bar(260, 1, '#e48f7d', E_RED, 'red 650 nm')}
    ${ratio(190, 300, '× 1.4')}
    ${bar(520, 4.35, '#7f98f0', '4.4×', 'blue 450 nm')}${bar(660, 1, '#e48f7d', '1×', 'red 650 nm')}
    ${ratio(660, 300, '× 4.4')}
    <path class="fl04-axis" d="M40,${base} H360 M440,${base} H760"/>
    ${T(400, 534, 'Two laws: 1/λ for energy, 1/λ⁴ for scattering.', 'fl04-b', 'middle')}
    ${T(400, 564, 'Blue’s stronger scattering is not caused by its higher energy.', 'fl04-s', 'middle')}
  </svg>`;
}

/* ---------- 4C · Equation anatomy ---------- */

function drawC(): string {
  const p = 'fl04c';
  const lead = (x0: number, y0: number, x1: number, y1: number): string => `<path class="fl04-lead" d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}"/>`;
  // Einstein's equation, set piece by piece so each symbol can be labelled
  const y1 = 150;
  const eq1 = `${T(206, y1, 'E', 'fl04-eqbig')}${T(252, y1, '=', 'fl04-eqop')}${T(288, y1, 'h', 'fl04-eqbig')}${T(318, y1, 'ν', 'fl04-eqbig')}${T(362, y1, '=', 'fl04-eqop')}
    ${T(404, y1 - 24, 'hc', 'fl04-eqbig')}<path class="fl04-fbar" d="M400,${y1 - 10} H460"/>${T(430, y1 + 38, 'λ', 'fl04-eqbig', 'middle')}`;
  const lab1 = `${T(40, 68, 'energy of one photon', 'fl04-s')}${lead(200, 76, 214, 106)}
    ${T(300, 68, 'frequency', 'fl04-s')}${lead(332, 76, 328, 114)}
    ${T(436, 68, 'speed of light', 'fl04-s')}${lead(470, 76, 448, 98)}
    ${T(200, 230, 'Planck’s constant', 'fl04-s')}${lead(290, 210, 294, 162)}
    ${T(486, 230, 'wavelength', 'fl04-s')}${lead(496, 210, 446, 192)}`;
  const y2 = 430;
  const eq2 = `${T(226, y2, 'scattering', 'fl04-eqword')}${T(414, y2, PROP, 'fl04-eqop')}
    ${T(500, y2 - 24, '1', 'fl04-eqbig', 'middle')}<path class="fl04-fbar" d="M470,${y2 - 10} H534"/>${T(500, y2 + 38, 'λ⁴', 'fl04-eqbig', 'middle')}`;
  const lab2 = `${T(226, 356, 'how much light air redirects', 'fl04-s')}${lead(300, 364, 300, 396)}
    ${T(330, 508, 'proportional to', 'fl04-s', 'middle')}${lead(380, 488, 420, 446)}
    ${T(556, 482, 'wavelength, to the', 'fl04-s')}${T(556, 508, 'fourth power', 'fl04-s')}${lead(552, 474, 530, 462)}`;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Two equations with every symbol labelled: Einstein's E = h nu = h c over lambda, and Rayleigh's scattering proportional to one over lambda to the fourth.">
    ${defs(p)}
    ${eq1}${lab1}
    ${cutout(p, 'e', 630, 22, 150, 186, EINSTEIN, 2, 13)}
    ${T(40, 268, 'Einstein · 1905: shorter λ, more energy per photon;', 'fl04-b')}${T(40, 294, 'brighter light, more photons, not bigger ones', 'fl04-s')}
    <path class="fl04-div" d="M30,316 H770"/>
    ${cutout(p, 'r', 20, 336, 150, 186, RAYLEIGH, -2, 17)}
    ${eq2}${lab2}
    ${T(40, 562, 'Rayleigh · 1871: blue (450 nm) ≈ 4.4× red (650 nm);', 'fl04-b')}${T(40, 588, 'same wavelength, new direction', 'fl04-s')}
  </svg>`;
}

/* ---------- 4D · Brighter vs bluer, and redirected not changed ---------- */

function drawD(): string {
  const p = 'fl04d';
  const cell = (cx: number, cy: number, n: number, col: string, lam: number): string =>
    Array.from({ length: n }, (_, i) => {
      const cols = Math.min(n, 3), rows = Math.ceil(n / cols), r = Math.floor(i / cols), c = i % cols;
      return packet(cx + (c - (cols - 1) / 2) * 50, cy + (r - (rows - 1) / 2) * 34, 36, lam, 8, col, 0, 2.6);
    }).join('');
  const gx = [170, 312];
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Left: dim and bright red and blue light drawn as photons; brighter light has more photons, bluer light has more energy in each. Right: an air molecule redirects blue light far more than red, without changing its wavelength.">
    ${defs(p)}
    ${cutout(p, 'e', 16, 16, 100, 124, EINSTEIN, -2, 21)}${T(132, 50, 'Einstein', 'fl04-tk')}${T(132, 80, 'photon energy', 'fl04-h')}${T(132, 112, 'E = hc/λ', 'fl04-eq fl04-eq-m')}
    ${T(gx[0], 184, 'dim', 'fl04-b', 'middle')}${T(gx[1], 184, 'bright', 'fl04-b', 'middle')}
    <rect class="fl04-cell" x="${gx[0] - 56}" y="198" width="112" height="100" rx="12"/><rect class="fl04-cell" x="${gx[1] - 83}" y="198" width="166" height="100" rx="12"/>
    <rect class="fl04-cell" x="${gx[0] - 56}" y="312" width="112" height="100" rx="12"/><rect class="fl04-cell" x="${gx[1] - 83}" y="312" width="166" height="100" rx="12"/>
    ${cell(gx[0], 248, 2, RED, 13)}${cell(gx[1], 248, 6, RED, 13)}
    ${cell(gx[0], 362, 2, BLUE, 9)}${cell(gx[1], 362, 6, BLUE, 9)}
    ${T(22, 242, 'red', 'fl04-b')}${T(22, 268, E_RED, 'fl04-s')}${T(22, 292, 'each', 'fl04-tk')}
    ${T(22, 356, 'blue', 'fl04-b')}${T(22, 382, E_BLUE, 'fl04-s')}${T(22, 406, 'each', 'fl04-tk')}
    ${lines(22, 456, ['Brighter: more photons,', 'not bigger ones.', 'Bluer: more energy in each.'], 'fl04-b', 'start', 28)}
    <path class="fl04-div" d="M406,24 V560"/>
    ${cutout(p, 'r', 420, 16, 100, 124, RAYLEIGH, 2, 23)}${T(536, 50, 'Rayleigh', 'fl04-tk')}${T(536, 80, 'scattering', 'fl04-h')}${T(536, 112, `${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-m')}
    ${T(430, 196, 'before', 'fl04-tk')}${T(770, 196, 'after', 'fl04-tk', 'end')}
    ${wv(424, 286, 572, 286, 18, BLUE, { amp: 6 })}${wv(424, 306, 572, 306, 26, RED, { amp: 6, ph: 1 })}
    ${wv(600, 296, 770, 296, 26, RED, { amp: 6, head: `${p}-hr`, ph: 2 })}
    ${wv(596, 280, 690, 196, 18, BLUE, { amp: 6, head: `${p}-hb` })}${wv(592, 312, 650, 410, 18, BLUE, { amp: 6, head: `${p}-hb` })}
    ${wv(584, 278, 540, 196, 18, BLUE, { amp: 6, head: `${p}-hb` })}${wv(604, 314, 730, 380, 18, BLUE, { amp: 6, head: `${p}-hb` })}
    ${wv(596, 312, 560, 400, 26, RED, { amp: 4, head: `${p}-hr`, op: 0.55 })}
    ${n2(590, 296, 25, 15)}
    ${T(680, 442, 'blue: same λ,', 'fl04-s', 'middle')}${T(680, 468, 'new direction', 'fl04-s', 'middle')}
    ${lines(430, 512, ['Redirected, not changed:', 'blue ≈ 4.4× more than red.'], 'fl04-b', 'start', 28)}
  </svg>`;
}

/* ---------- 4E · Clippings board ---------- */

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

/* ---------- 4F · Zoom in: into the beam (photons) and into the air (shaken charges) ---------- */

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

/* ---------- 4G · One beam: both findings at different places along the same sunbeam ---------- */

function drawG(): string {
  const p = 'fl04g';
  const y = 112, mols = [330, 470, 610];
  // the beam loses blue along its path: draw it in three segments, blue thinning out
  const seg = (x0: number, x1: number, kb: number, kg: number): string =>
    wv(x0, y - 10, x1, y - 10, 18, BLUE, { amp: 5 * kb, op: Math.max(0.15, kb) }) + wv(x0, y, x1, y, 22, GREEN, { amp: 5 * kg, op: Math.max(0.3, kg), ph: 1.3 }) + wv(x0, y + 10, x1, y + 10, 26, RED, { amp: 5, ph: 2.6 });
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="One sunbeam crossing the air: each photon's energy depends on its wavelength; air molecules along the way redirect blue down to observers, so the sky looks blue; at the end of the long path the light is red and orange.">
    ${defs(p)}
    ${sun(46, y, 26)}
    ${seg(80, 330, 1, 1)}${seg(330, 470, 0.7, 0.9)}${seg(470, 610, 0.45, 0.8)}${seg(610, 712, 0.2, 0.6)}
    <path class="fl04-w" style="stroke:#e07a1f" d="M712,${y} L716,${y}"/>
    ${mols.map(x => n2(x, y + 2, 25, 9)).join('')}
    ${mols.map((x, i) => wv(x, y + 12, x - 18 + i * 4, y + 108, 18, BLUE, { amp: 4.5, head: `${p}-hb`, op: 1 - i * 0.2 })).join('')}
    ${eye(470, y + 150, 0.9)}${T(436, y + 158, 'blue sky', 'fl04-s', 'end')}
    ${eye(760, y, 0.9, true)}${T(770, y - 34, 'red-orange', 'fl04-s', 'end')}${T(770, y - 60, 'after a long path:', 'fl04-tk', 'end')}
    <circle class="fl04-ring" cx="200" cy="${y}" r="30"/>${T(200, y - 40, 'photons', 'fl04-tk', 'middle')}
    <path class="fl04-lead" d="M192,${y + 30} L150,300"/><path class="fl04-lead" d="M478,${y + 14} L640,300"/>
    <rect class="fl04-card" x="16" y="300" width="372" height="282" rx="16"/>
    ${cutout(p, 'e', 32, 316, 112, 140, EINSTEIN, -2, 71)}
    ${T(160, 344, 'Einstein · 1905', 'fl04-tk')}${lines(160, 376, ['each photon', 'carries'], 'fl04-b', 'start', 28)}${T(160, 440, 'E = hc/λ', 'fl04-eq fl04-eq-m')}
    ${lines(32, 492, ['blue 2.76 eV, red 1.91 eV;', 'brighter light: more photons,', 'not bigger ones'], 'fl04-s', 'start', 27)}
    <rect class="fl04-card" x="412" y="300" width="372" height="282" rx="16"/>
    ${cutout(p, 'r', 428, 316, 112, 140, RAYLEIGH, 2, 73)}
    ${T(556, 344, 'Rayleigh · 1871', 'fl04-tk')}${lines(556, 376, ['air redirects', 'short waves'], 'fl04-b', 'start', 28)}${T(556, 440, `${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-m')}
    ${lines(428, 492, ['blue ≈ 4.4× more than red,', 'wavelength unchanged;', 'a long path leaves red, orange'], 'fl04-s', 'start', 27)}
  </svg>`;
}

/* ---------- 4H · Four steps ---------- */

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

/* ---------- 4I · Coins and sorter: the analogy, mapped label by label ---------- */

function drawI(): string {
  const p = 'fl04i';
  const coin = (x: number, y: number, col: 'b' | 'r', v: string, r = 26): string =>
    `<circle class="fl04-coin fl04-coin-${col}" cx="${f(x)}" cy="${f(y)}" r="${r}"/><circle class="fl04-coin-in" cx="${f(x)}" cy="${f(y)}" r="${r - 5}"/>${v ? T(x, y + 7, v, 'fl04-coin-t', 'middle') : ''}`;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="An analogy: photons are coins. Colour sets each coin's value, the energy E = hc/lambda; brightness sets how many coins arrive. Air is a sorter that diverts blue coins about 4.4 times as often as red ones, without changing their value.">
    ${defs(p)}
    ${cutout(p, 'e', 16, 16, 92, 114, EINSTEIN, -2, 91)}
    ${T(124, 46, 'Einstein: photons are like coins', 'fl04-h')}
    ${T(124, 78, 'colour sets the value', 'fl04-b')}
    ${coin(150, 132, 'b', '2.76')}${coin(214, 132, 'r', '1.91')}${T(250, 140, 'eV each (E = hc/λ)', 'fl04-s')}
    ${T(448, 78, 'brightness sets the number', 'fl04-b')}
    ${T(448, 116, 'dim', 'fl04-tk')}${[0, 1].map(i => coin(546 + i * 38, 110, 'r', '', 16)).join('')}
    ${T(448, 162, 'bright', 'fl04-tk')}${[0, 1, 2, 3, 4, 5].map(i => coin(546 + i * 38, 156, 'r', '', 16)).join('')}
    ${T(448, 202, 'more coins, not bigger coins', 'fl04-s')}
    <path class="fl04-div" d="M20,226 H780"/>
    ${cutout(p, 'r', 16, 244, 92, 114, RAYLEIGH, 2, 93)}
    ${T(124, 274, 'Rayleigh: air is a sorter', 'fl04-h')}
    ${T(124, 306, `it diverts blue ≈ 4.4× as often as red (${PROP} 1/λ⁴)`, 'fl04-s')}
    ${(['b', 'r', 'b', 'r', 'b', 'r', 'b'] as const).map((c, i) => coin(40 + i * 46, 420, c, '', 16)).join('')}
    ${arrow(p, 'ink', 'M360,420 L414,420')}
    <rect class="fl04-gate" x="420" y="382" width="56" height="76" rx="12"/>${n2(448, 420, 25, 10)}
    ${arrow(p, 'ink', 'M482,420 L560,420')}
    ${[['r', 590], ['r', 636], ['b', 682]].map(([c, x]) => coin(x as number, 420, c as 'b' | 'r', '', 16)).join('')}
    ${arrow(p, 'ink', 'M462,382 L504,352')}${coin(524, 344, 'b', '', 16)}${coin(564, 352, 'b', '', 16)}
    ${arrow(p, 'ink', 'M462,458 L504,488')}${coin(524, 498, 'b', '', 16)}${coin(564, 494, 'r', '', 16)}
    ${T(600, 352, 'sky light:', 'fl04-s')}${T(600, 378, 'mostly blue', 'fl04-s')}
    ${T(600, 502, 'value unchanged', 'fl04-s')}
    ${T(24, 470, 'mixed coins in', 'fl04-tk')}${T(770, 462, 'carry on', 'fl04-tk', 'end')}
    <rect class="fl04-foot" x="16" y="530" width="768" height="62" rx="14"/>
    ${T(400, 556, 'coin = photon · value = energy per photon · number = brightness', 'fl04-s', 'middle')}
    ${T(400, 582, 'sorter = air molecules · value kept = wavelength unchanged', 'fl04-s', 'middle')}
  </svg>`;
}

/* ---------- 4J · With Planck: three portraits, two kinds of finding ---------- */

function drawJ(): string {
  const p = 'fl04j';
  const col = (cx: number, who: Who, rot: number, seed: number, name: string, head: string[], eq: string, take: string[]): string => `
    ${cutout(p, who.name[0], cx - 78, 50, 156, 196, who, rot, seed)}
    ${T(cx, 280, name, 'fl04-tk', 'middle')}${lines(cx, 312, head, 'fl04-b', 'middle', 27)}
    ${T(cx, 400, eq, 'fl04-eq fl04-eq-s', 'middle')}${lines(cx, 438, take, 'fl04-s', 'middle', 26)}`;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Three portraits: Planck, energy exchanged in quanta; Einstein, light itself in quanta; Rayleigh, scattering proportional to one over lambda to the fourth. The first two concern photon energy, the third scattering.">
    ${defs(p)}
    <path class="fl04-brace" d="M24,34 v-10 H516 v10"/>${T(270, 16, 'photon energy', 'fl04-kick2', 'middle')}
    <path class="fl04-brace" d="M548,34 v-10 H776 v10"/>${T(662, 16, 'scattering', 'fl04-kick2', 'middle')}
    ${col(140, PLANCK, -1.5, 101, 'Planck', ['Energy is exchanged', 'in quanta'], 'ΔE = hν', ['matter takes up and', 'gives off energy', 'in steps of hν'])}
    ${col(400, EINSTEIN, 1.5, 103, 'Einstein · 1905', ['Light itself comes', 'in quanta'], 'E = hν = hc/λ', ['blue photon: more', 'energy than red;', 'brighter: more photons'])}
    <path class="fl04-div" d="M532,40 V520"/>
    ${col(662, RAYLEIGH, -1.5, 107, 'Rayleigh · 1871', ['Air scatters', 'short waves'], `scattering ${PROP} 1/λ⁴`, ['blue ≈ 4.4× red;', 'same wavelength,', 'new direction'])}
    ${T(400, 566, 'Planck quantised the exchange; Einstein quantised light itself.', 'fl04-note', 'middle')}
  </svg>`;
}

/* ================= Round 2: the picks E (clippings), F (zooms) and H (four steps) combined ================= */

/** A clipping's kicker, rule and headline, set as on 4E. */
function clipHead(x: number, y: number, w: number, kicker: string, head: string[], cls = 'fl04-head', dy = 34): string {
  return `${T(x, y, kicker, 'fl04-kick')}<path class="fl04-rule" d="M${x},${y + 10} H${x + w}"/>${lines(x, y + 46, head, cls, 'start', dy)}`;
}

/* ---------- 4K · Zoom clippings: each finding's clipping carries 4F's zoom ---------- */

function drawK(): string {
  const p = 'fl04k';
  const lensDy: [number, number, number, number] = [-56, -24, 16, 50];
  const c1 = clipping(p, 14, 20, 382, 412, -1.2, 111, `
    ${clipHead(32, 50, 346, '1905 · LIGHT QUANTA', [])}
    ${cutout(p, 'e', 28, 116, 112, 140, EINSTEIN, 0, 113)}
    ${T(84, 280, 'zoom into', 'fl04-note-s', 'middle')}${T(84, 302, 'the beam', 'fl04-note-s', 'middle')}
    ${beamLens(272, 208, 96, lensDy)}
    ${T(32, 372, 'E = hν = hc/λ', 'fl04-eq fl04-eq-m')}`);
  const c2 = clipping(p, 404, 20, 382, 412, 1, 117, `
    ${clipHead(422, 50, 346, '1871 · 1899 · SKY LIGHT', ['Why the sky is blue'])}
    ${airLens(p, 528, 208, 96)}
    ${cutout(p, 'r', 654, 116, 112, 140, RAYLEIGH, 0, 119)}
    ${T(710, 280, 'zoom into', 'fl04-note-s', 'middle')}${T(710, 302, 'the air', 'fl04-note-s', 'middle')}
    ${T(422, 352, `scattering ${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-m')}
    ${lines(422, 390, ['Shaken charges re-emit light:', 'same wavelength, new direction.'], 'fl04-body', 'start', 26)}`);
  const c3 = clipping(p, 112, 450, 576, 138, -0.6, 121, `
    ${clipHead(130, 522, 250, 'AT SUNSET', [])}
    ${sunsetMini(`${p}-ss`, 412, 462, 262, 114)}`);
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Three newspaper clippings. Einstein 1905, light quanta: a zoom into the beam showing a blue photon of 2.76 eV and a red one of 1.91 eV. Rayleigh 1871 and 1899: why the sky is blue, with a zoom into the air where the field shakes a molecule's charges, which re-emit light with the same wavelength in a new direction. At sunset: the noon and sunset paths through the air.">
    ${defs(p)}${c1}${c2}${c3}
  </svg>`;
}

/* ---------- 4L · Dated steps: 4H's four panels as dated clippings ---------- */

function drawL(): string {
  const p = 'fl04l';
  const [b1, b2, b3, b4] = hBodies(p);
  // each clipping sits where 4H's panel sat, shifted by (dx, dy); 4H's panel body is moved with it
  const step = (px: number, py: number, dx: number, dy: number, rot: number, seed: number, n: string, kicker: string, body: string): string => {
    const x = px + dx, y = py + dy - 6;
    return clipping(p, x, y, 380, 284, rot, seed, `
      ${stepNum(x + 32, y + 34, n)}
      ${T(x + 58, y + 34, kicker, 'fl04-kick')}<path class="fl04-rule" d="M${x + 58},${y + 46} H${x + 362}"/>
      <g transform="translate(${dx} ${dy})">${body}</g>`);
  };
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Four numbered, dated newspaper clippings: 1905, light quanta, sunlight split into photons; 1905, energy per quantum, 450 nm 2.76 eV and 650 nm 1.91 eV; 1871 and 1899, sky light, an air molecule sends blue in new directions while red goes on; at sunset, the noon and sunset paths through the air.">
    ${defs(p)}
    ${step(8, 8, 2, 10, -0.8, 131, '1', '1905 · LIGHT QUANTA', b1)}
    ${step(408, 8, 2, 10, 0.7, 133, '2', '1905 · ENERGY PER QUANTUM', b2)}
    ${step(8, 308, 2, 6, 0.6, 137, '3', '1871 · 1899 · SKY LIGHT', b3)}
    ${step(408, 308, 2, 6, -0.7, 139, '4', 'AT SUNSET', b4)}
  </svg>`;
}

/* ---------- 4M · Zooms and a sunset strip: 4F's two zooms, the sunset below ---------- */

function drawM(): string {
  const p = 'fl04m';
  const R = 102, Lc: Pt = [196, 262], Rc: Pt = [604, 262];
  const spotL: Pt = [150, 112], spotR: Pt = [612, 108];
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Two zooms and a sunset. Into a sunbeam: light comes as photons, a blue one carrying 2.76 eV and a red one 1.91 eV. Into the air: light's field shakes a molecule's charges, which re-emit light. Below: the noon and sunset paths through the air.">
    ${defs(p)}
    ${sun(40, 40, 22)}${beam(p, 62, 62, 258, 151, 9, { amp: 4.5 })}
    <path class="fl04-zoomfan" d="${tangent(spotL, 22, Lc, R)}"/>
    <circle class="fl04-spot" cx="${spotL[0]}" cy="${spotL[1]}" r="22"/>
    ${beamLens(Lc[0], Lc[1], R, [-58, -26, 16, 50])}
    ${cutout(p, 'e', 300, 18, 96, 120, EINSTEIN, 2, 141)}${T(348, 162, '1905', 'fl04-tk', 'middle')}
    ${n2(spotR[0], spotR[1], 25, 9)}<circle class="fl04-spot" cx="${spotR[0]}" cy="${spotR[1]}" r="22"/>
    ${beam(p, 440, 40, 588, 98, 8, { amp: 3.5 })}
    <path class="fl04-zoomfan" d="${tangent(spotR, 22, Rc, R)}"/>
    ${airLens(p, Rc[0], Rc[1], R)}
    ${cutout(p, 'r', 690, 18, 96, 120, RAYLEIGH, -2, 143)}${T(738, 162, '1871 · 1899', 'fl04-tk', 'middle')}
    ${T(Lc[0], 412, 'photons', 'fl04-b', 'middle')}
    ${T(Rc[0], 412, 'shaken charges re-emit light', 'fl04-b', 'middle')}
    <path class="fl04-div" d="M24,456 H776"/>
    ${sunsetMini(`${p}-ss`, 180, 470, 440, 120)}
  </svg>`;
}

/* ---------- 4N · One beam, three clippings: the beam told left to right, a clipping under each stop ---------- */

function drawN(): string {
  const p = 'fl04n';
  const y = 104, stop = [160, 400, 640], cx = [140, 400, 660], top = 226;
  // the beam after the air: blue thins out along the long path, red goes on (4G's way of drawing it)
  const seg = (x0: number, x1: number, kb: number, kg: number): string =>
    wv(x0, y - 10, x1, y - 10, 18, BLUE, { amp: 5 * kb, op: Math.max(0.15, kb) }) + wv(x0, y, x1, y, 22, GREEN, { amp: 5 * kg, op: Math.max(0.3, kg), ph: 1.3 }) + wv(x0, y + 10, x1, y + 10, 26, RED, { amp: 5, ph: 2.6 });
  const col = (i: number, from: number, seed: number, kicker: string, head: string[], inner: string): string => {
    const x = cx[i] - 124, t = top + (head.length ? 0 : 68);
    return `<path class="fl04-lead" d="M${stop[i]},${from} V${t - 14}"/>` + clipping(p, x, t, 248, 362 - (t - top), i === 1 ? 0.8 : -0.8, seed, `
      ${clipHead(x + 16, t + 28, 216, kicker, head)}${inner}`);
  };
  const body = (x: number, ss: string[]): string => lines(x, 556, ss, 'fl04-body', 'middle', 26);
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="One sunbeam told left to right, with a newspaper clipping under each stop. Photons: blue 2.76 eV, red 1.91 eV; Einstein 1905, E = h nu = h c over lambda. Air: a molecule redirects blue; Rayleigh 1871 and 1899, scattering proportional to one over lambda to the fourth, same wavelength, new direction. Sunset: after a long path through air the beam reaching the eye is red and orange.">
    ${defs(p)}
    ${sun(34, y, 20)}${beam(p, 70, y, 118, y, 10, { amp: 5 })}
    <circle class="fl04-ring" cx="${stop[0]}" cy="${y}" r="42"/>
    ${packet(stop[0], y - 16, 54, 11, 8, BLUE, 0, 2.6)}${packet(stop[0], y + 18, 62, 17, 8, RED, 0, 2.6)}
    ${chip(stop[0], 36, E_BLUE)}${chip(stop[0], 172, E_RED)}
    ${beam(p, 202, y, 384, y, 10, { amp: 5 })}
    ${n2(stop[1], y, 25, 12)}
    ${wv(stop[1] + 6, y - 16, stop[1] + 50, y - 76, 18, BLUE, { amp: 5, head: `${p}-hb` })}${wv(stop[1] - 6, y + 18, stop[1] - 46, y + 74, 18, BLUE, { amp: 5, head: `${p}-hb` })}
    ${T(stop[1] - 22, 46, 'air', 'fl04-tk', 'end')}
    ${seg(416, 540, 0.7, 0.9)}${seg(540, 640, 0.45, 0.8)}${seg(640, 724, 0.2, 0.6)}
    ${wv(520, y - 16, 546, y - 52, 18, BLUE, { amp: 4, head: `${p}-hb`, op: 0.7 })}${wv(616, y - 16, 640, y - 48, 18, BLUE, { amp: 4, head: `${p}-hb`, op: 0.45 })}
    ${eye(764, y, 0.9, true)}${T(790, 56, 'red, orange', 'fl04-tk', 'end')}
    ${T(560, 162, 'long path: blue scattered out', 'fl04-tk', 'middle')}
    ${col(0, 192, 171, '1905 · LIGHT QUANTA', [], `
      ${cutout(p, 'e', 84, 352, 112, 134, EINSTEIN, 0, 153)}
      ${T(140, 536, 'E = hν = hc/λ', 'fl04-eq fl04-eq-s', 'middle')}`)}
    ${col(1, 184, 157, '1871 · 1899', ['Why the sky', 'is blue'], `
      ${cutout(p, 'r', 344, 352, 112, 134, RAYLEIGH, 0, 159)}
      ${T(400, 522, `scattering ${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-s', 'middle')}
      ${body(400, ['same wavelength,', 'new direction'])}`)}
    ${col(2, 176, 161, 'AT SUNSET', [], `
      ${sunsetMini(`${p}-ss`, 552, 372, 216, 128)}
      ${T(660, 556, 'not to scale', 'fl04-note-s', 'middle')}`)}
  </svg>`;
}

/* ---------- 4O · Board, completed: 4E's board with each clipping's number and mini-diagram ---------- */

function drawO(): string {
  const p = 'fl04o';
  const c1 = clipping(p, 18, 22, 430, 300, -1.4, 171, `
    ${clipHead(36, 52, 394, '1905 · LIGHT QUANTA', ['Light comes in', 'packets of energy'])}
    ${cutout(p, 'e', 32, 150, 108, 136, EINSTEIN, 0, 173)}
    ${T(158, 176, 'E = hν = hc/λ', 'fl04-eq fl04-eq-m')}
    ${packet(172, 222, 36, 9, 7, BLUE, 0, 2.6)}${chip(296, 222, `450 nm · ${E_BLUE}`, 'fl04-chip', 186)}
    ${packet(172, 266, 40, 14, 7, RED, 0, 2.6)}${chip(296, 266, `650 nm · ${E_RED}`, 'fl04-chip', 186)}`);
  const c2 = clipping(p, 420, 168, 362, 336, 1.4, 177, `
    ${clipHead(438, 198, 326, '1871 · 1899 · SKY LIGHT', ['Why the sky is blue'])}
    ${T(438, 290, `scattering ${PROP} 1/λ⁴`, 'fl04-eq fl04-eq-m')}
    ${cutout(p, 'r', 654, 268, 110, 138, RAYLEIGH, 0, 179)}
    ${scatterMini(p, 534, 366, 0.8)}
    ${T(438, 474, 'Same wavelength, new direction.', 'fl04-body')}`);
  const c3 = clipping(p, 36, 352, 340, 226, -0.8, 181, `
    ${clipHead(54, 382, 304, 'AT SUNSET', [])}
    ${sunsetMini(`${p}-ss`, 54, 404, 304, 156)}`);
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="A board of three newspaper clippings, each with its number and a small diagram. Einstein 1905: light comes in packets of energy, 450 nm 2.76 eV and 650 nm 1.91 eV. Rayleigh 1871 and 1899: why the sky is blue, scattering proportional to one over lambda to the fourth. At sunset: the noon and sunset paths through the air.">
    ${defs(p)}${c1}<g transform="translate(0 -6)">${c2}</g>${c3}
  </svg>`;
}

/* ---------- 4P–4T · Light is also a particle: the photon, its energy, and what that energy can do ---------- */
// Rules of 26 Oct (research/figure-briefs/SLIDE34_BRIEF.md): every variant shows a packet labelled "photon", an axis
// "energy per photon (eV)" with ticks and "eV: electronvolt", the four photons at their true relative wavelengths,
// labelled pictures of what each can do, and Einstein's clipping; every label at least 19 px.

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
const INK = '#3d3d3a';
/** The clipping's width, as Rayleigh's on slide 3 (200–206 px). Its key is set at 0.092 w, so "h: Planck constant"
 *  stays at 19.1 px. CL and CR are its left edge in the left and in the right column; CH is its height. */
const CW = 208, CH = clipHeight(CW, EINSTEIN_CLIP), CL = 26, CR = 800 - 26 - CW;
/** The photon key, centred under a clipping whose left edge is x. */
const keyUnder = (x: number, y: number): string => photonKey(x + CW / 2 - 96, y);
/** Top of a clipping that, with the key 76 px below it, sits centred in the figure's height. */
const CT = Math.round((600 - CH - 76) / 2);

/** Arrowheads for the axes and the electron's jump. */
const pDefs = (p: string): string => `<defs>
  <marker id="${p}-ax" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#6b6a64"/></marker>
  <marker id="${p}-up" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0L10,5L0,10z" fill="#b5770b"/></marker>
  <marker id="${p}-go" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0L10,5L0,10z" fill="#8a877d"/></marker>
</defs>`;

/** One photon drawn as a wave packet: wavelength in proportion (`k` px per nm), the same envelope for all four. */
const photon = (ph: Photon, cx: number, cy: number, len: number, k: number, amp = 12, ang = 0, w = 3.2): string =>
  packet(cx, cy, len, ph.nm * k, amp, ph.col, ang, w);

/** The key: a neutral wave packet named "photon". (x, y) is the packet's left end. */
const photonKey = (x: number, y: number, len = 104): string =>
  `${packet(x + len / 2, y, len, 22, 12, INK, 0, 3)}${T(x + len + 14, y + 8, 'photon', 'fl04-lab')}`;

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

/** DNA: a stretch of double helix with one base pair broken (red), the damage an ultraviolet photon can do. About 104 × 44. */
function dnaPic(cx: number, cy: number): string {
  const W = 104, A = 22, P = 70, n = 64;
  const yb = (x: number, k: number): number => cy - k * A * Math.cos((2 * Math.PI * (x - cx)) / P);
  const strand = (k: number): string => Array.from({ length: n + 1 }, (_, i) => {
    const x = cx - W / 2 + (W * i) / n;
    return `${i ? 'L' : 'M'}${f(x)},${f(yb(x, k))}`;
  }).join('');
  const rungs = [-3, -2, -1, 1, 2, 3].map(i => { const x = cx + (i * P) / 6; return `M${f(x)},${f(yb(x, 1))} V${f(yb(x, -1))}`; }).join('');
  const burst = [20, 160, 200, 340].map(a => {
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    return `M${f(cx + c * 7)},${f(cy + s * 7)} L${f(cx + c * 15)},${f(cy + s * 15)}`;
  }).join('');
  return `<path class="fl04-rung" d="${rungs}"/><path class="fl04-dna" d="${strand(1)}${strand(-1)}"/>
    <path class="fl04-break" d="M${cx},${cy - A + 2} V${cy - 6} M${cx},${cy + A - 2} V${cy + 6}${burst}"/>`;
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

/** What a photon can do, as a picture with the object's name under it; `dy` is the label's baseline below the centre. */
function effect(p: string, kind: 'bond' | 'lift' | 'heat', cx: number, cy: number, dy = 0, oneLine = false): string {
  if (kind === 'bond') return `${dnaPic(cx, cy)}${T(cx, cy + (dy || 54), 'DNA', 'fl04-obj', 'middle')}`;
  if (kind === 'heat') return `${heatPic(cx, cy)}${T(cx, cy + (dy || 58), 'heat', 'fl04-obj', 'middle')}`;
  const lab = oneLine ? ['electron in a pigment'] : ['electron in', 'a pigment'];
  return `${pigmentPic(p, cx, cy)}${lines(cx, cy + (dy || 64), lab, 'fl04-obj', 'middle', 25)}`;
}

/* ---------- 4P · Energy ladder: a vertical energy scale, each photon at its own height ---------- */

function drawP(): string {
  const p = 'fl04p', ax = 300, K = 0.042, xl = 484, xe = 734;
  const y = (e: number): number => 540 - (e - 1) * 122; // 1 eV at 540 px; 0 eV sits below the axis break
  const y0 = 578;
  const rows = PHOTONS.map(ph => {
    const yy = y(eV(ph.nm));
    return `<circle cx="${ax}" cy="${f(yy)}" r="5.5" style="fill:${ph.col}"/>
      ${photon(ph, 394, yy, 150, K, 13)}
      ${T(xl, yy - 4, ph.name, 'fl04-lab')}${T(xl, yy + 23, `${ph.nm} nm · ${eVs(ph.nm)}`, 'fl04-val')}`;
  }).join('');
  const yb = y(eV(450)), yr = y(eV(650));
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Albert Einstein's 1905 clipping, E = hc/λ, beside a vertical scale of energy per photon in electronvolts. Four photons, drawn as wave packets at their true relative wavelengths, sit at their energies: ultraviolet 300 nm 4.1 eV, beside DNA with a broken base pair; blue 450 nm 2.8 eV and red 650 nm 1.9 eV, beside an electron in a pigment lifted to a higher level; infrared 1000 nm 1.2 eV, beside heat.">
    ${pDefs(p)}
    ${newsClip(p, CL, CT, CW, EINSTEIN_CLIP, -2, 7)}
    ${keyUnder(CL, CT + CH + 72)}
    ${T(282, 46, 'energy per photon (eV)', 'fl04-ax')}${T(282, 74, 'eV: electronvolt', 'fl04-nt')}
    <path class="fl04-axis" d="M${ax},${y0} V560 M${ax},548 V104" marker-end="url(#${p}-ax)"/>
    <path class="fl04-axis" d="M${ax - 9},565 L${ax + 9},557 M${ax - 9},553 L${ax + 9},545"/>
    ${[1, 2, 3, 4].map(t => `<path class="fl04-axis" d="M${ax - 7},${f(y(t))} H${ax}"/>${T(ax - 13, y(t) + 7, String(t), 'fl04-tick', 'end')}`).join('')}
    <path class="fl04-axis" d="M${ax - 7},${y0} H${ax}"/>${T(ax - 13, y0 + 7, '0', 'fl04-tick', 'end')}
    ${rows}
    ${effect(p, 'bond', xe, y(eV(300)) - 4)}
    <path class="fl04-br" d="M662,${f(yb)} H672 V${f(yr)} H662 M672,${f((yb + yr) / 2)} H682"/>
    ${effect(p, 'lift', xe, (yb + yr) / 2 - 18)}
    ${effect(p, 'heat', xe, y(eV(1000)) - 6, 52)}
  </svg>`;
}

/* ---------- 4Q · Energy columns: a bar chart of energy per photon, what each can do underneath ---------- */

function drawQ(): string {
  const p = 'fl04q', base = 360, k = 60, ax = 70, cols = [152, 268, 384, 500], K = 0.03, x1 = 548;
  const y = (e: number): number => base - e * k;
  const grid = [1, 2, 3, 4].map(t => `<path class="fl04-grid" d="M${ax},${y(t)} H${x1}"/>`).join('');
  const bars = PHOTONS.map((ph, i) => {
    const e = eV(ph.nm), x = cols[i], top = y(e);
    return `<rect class="fl04-bar" x="${x - 36}" y="${f(top)}" width="72" height="${f(base - top)}" rx="3" style="fill:${ph.col}"/>
      ${T(x, top - 11, eVs(ph.nm), 'fl04-val fl04-val-b', 'middle')}
      ${photon(ph, x, 392, 100, K, 11, 0, 3)}
      ${T(x, 434, ph.name, 'fl04-lab', 'middle')}${T(x, 457, `${ph.nm} nm`, 'fl04-val', 'middle')}`;
  }).join('');
  const xm = (cols[1] + cols[2]) / 2;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="A bar chart of energy per photon in electronvolts for four photons drawn as wave packets at their true relative wavelengths: ultraviolet 300 nm 4.1 eV, blue 450 nm 2.8 eV, red 650 nm 1.9 eV, infrared 1000 nm 1.2 eV. Underneath, what each can do: DNA with a broken base pair; an electron in a pigment lifted to a higher level; heat. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
    ${pDefs(p)}
    ${T(24, 40, 'energy per photon (eV)', 'fl04-ax')}${T(24, 68, 'eV: electronvolt', 'fl04-nt')}
    ${grid}
    ${vAxis(p, ax, base, 88, y, [0, 1, 2, 3, 4])}
    <path class="fl04-axis" d="M${ax},${base} H${x1}"/>
    ${bars}
    ${effect(p, 'bond', cols[0], 520, 60)}
    <path class="fl04-br" d="M${cols[1] - 20},468 V475 H${cols[2] + 20} V468 M${xm},475 V481"/>
    ${effect(p, 'lift', xm, 520, 60, true)}
    ${effect(p, 'heat', cols[3], 518, 62)}
    ${newsClip(p, CR, CT, CW, EINSTEIN_CLIP, 2, 11)}
    ${keyUnder(CR, CT + CH + 72)}
  </svg>`;
}

/* ---------- 4R · Energy against wavelength: the four photons on the curve E = hc/λ ---------- */

function drawR(): string {
  const p = 'fl04r', ox = 72, oy = 400, K = 0.03;
  const X = (nm: number): number => ox + (nm - 200) * 0.53, Y = (e: number): number => oy - e * 76;
  // the curve E = hc/λ, hidden under each photon's wave so the packet reads cleanly on it
  const curve = Array.from({ length: 153 }, (_, i) => { const nm = 280 + i * 5; return `${i ? 'L' : 'M'}${f(X(nm))},${f(Y(eV(nm)))}`; }).join('');
  const mask = `<mask id="${p}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/>${PHOTONS.map(ph =>
    `<path d="${packetD(X(ph.nm), Y(eV(ph.nm)), 76, ph.nm * K, 10)}" fill="none" stroke="#000" stroke-width="13" stroke-linecap="round"/>`).join('')}</mask>`;
  const lab: Record<number, [number, number, A]> = { 300: [48, -6, 'start'], 450: [48, -10, 'start'], 650: [48, -26, 'start'], 1000: [0, 40, 'middle'] };
  const pts = PHOTONS.map(ph => {
    const x = X(ph.nm), yy = Y(eV(ph.nm)), [dx, dy, a] = lab[ph.nm];
    return `<path class="fl04-guide" d="M${f(x)},${f(yy + (dy > 0 ? 72 : 14))} V${oy}"/>
      ${photon(ph, x, yy, 76, K, 10, 0, 3)}
      ${T(x + dx, yy + dy, ph.name, 'fl04-lab', a)}${T(x + dx, yy + dy + 24, eVs(ph.nm), 'fl04-val', a)}`;
  }).join('');
  const xb = X(450), xr = X(650), xm = (xb + xr) / 2;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="A graph of energy per photon in electronvolts against wavelength in nanometres: the curve falls as the wavelength grows. Four photons, drawn as wave packets at their true relative wavelengths, sit on it: ultraviolet 300 nm 4.1 eV, blue 450 nm 2.8 eV, red 650 nm 1.9 eV, infrared 1000 nm 1.2 eV. Below each, what it can do: DNA with a broken base pair; an electron in a pigment lifted to a higher level; heat. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
    ${pDefs(p)}
    ${T(50, 40, 'energy per photon (eV)', 'fl04-ax')}${T(548, 40, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${mask}<path class="fl04-curve" d="${curve}" mask="url(#${p}-m)"/>
    ${vAxis(p, ox, oy, 62, Y, [0, 1, 2, 3, 4])}
    ${hAxis(p, oy, ox, 548, X, [300, 450, 650, 1000])}
    ${T(548, 458, 'wavelength (nm)', 'fl04-ax', 'end')}
    ${pts}
    ${effect(p, 'bond', X(300), 504, 58)}
    <path class="fl04-br" d="M${f(xb)},446 V452 H${f(xr)} V446 M${f(xm)},452 V460"/>
    ${effect(p, 'lift', xm, 506, 56)}
    ${effect(p, 'heat', X(1000), 502, 60)}
    ${newsClip(p, CR, CT, CW, EINSTEIN_CLIP, 2, 11)}
    ${keyUnder(CR, CT + CH + 72)}
  </svg>`;
}

/* ---------- 4S · Brighter, not bluer: the four photons on an energy scale; a dim and a bright beam of the same red ---------- */

function drawS(): string {
  const p = 'fl04s', ay = 220, K = 0.036;
  const X = (e: number): number => 44 + (e - 1) * 142; // a number line from 1 eV, so the four photons spread out
  const pins = PHOTONS.map(ph => {
    const x = X(eV(ph.nm));
    return `${photon(ph, x, 148, 100, K, 11, 90, 3)}<path class="fl04-guide" d="M${f(x)},200 V${ay - 6}"/><circle cx="${f(x)}" cy="${ay}" r="5.5" style="fill:${ph.col}"/>
      ${T(x, 36, ph.name, 'fl04-lab', 'middle')}${T(x, 60, `${ph.nm} nm`, 'fl04-val', 'middle')}${T(x, 84, eVs(ph.nm), 'fl04-val fl04-val-b', 'middle')}`;
  }).join('');
  const xr = X(eV(650)), xb = X(eV(450)), xm = (xr + xb) / 2;
  // the beams: the same red photons, two in the dim beam, six in the bright one
  const red = PHOTONS[2];
  const beamRow = (y: number, xs: number[], cls: string, name: string): string =>
    `<rect class="fl04-beam ${cls}" x="104" y="${y - 22}" width="560" height="44" rx="22"/>${T(30, y + 8, name, 'fl04-lab')}
     ${xs.map(x => photon(red, x, y, 66, K, 11, 0, 3)).join('')}
     <path class="fl04-axis" d="M640,${y} H684" marker-end="url(#${p}-go)"/>`;
  const bright = [150, 238, 326, 414, 502, 590];
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Top: four photons drawn as wave packets at their true relative wavelengths, pinned on a scale of energy per photon in electronvolts: infrared 1000 nm 1.2 eV, warms (heat); red 650 nm 1.9 eV and blue 450 nm 2.8 eV, lift an electron in a pigment; ultraviolet 300 nm 4.1 eV, breaks a base pair in DNA. Bottom: a dim red beam carries two photons, a bright red beam six; each photon carries 1.9 eV. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
    ${pDefs(p)}
    ${pins}
    ${hAxis(p, ay, 36, 548, X, [1, 2, 3, 4])}
    ${T(30, ay + 60, 'energy per photon (eV)', 'fl04-ax')}${T(548, ay + 60, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${effect(p, 'heat', X(eV(1000)), 334, 60)}
    <path class="fl04-br" d="M${f(xr)},292 V298 H${f(xb)} V292 M${f(xm)},298 V304"/>
    ${effect(p, 'lift', xm, 342, 52)}
    ${effect(p, 'bond', X(eV(300)), 336, 58)}
    ${newsClip(p, CR, 22, CW, EINSTEIN_CLIP, 2, 11)}
    ${beamRow(498, [194, 414], 'fl04-beam-dim', 'dim')}
    ${beamRow(560, bright, 'fl04-beam-bright', 'bright')}
    <path class="fl04-br" d="M${414 - 33},470 V464 H${414 + 33} V470"/>${T(414, 454, 'photon', 'fl04-lab', 'middle')}
    <path class="fl04-br" d="M700,478 H708 V584 H700 M708,531 H716"/>${lines(724, 524, ['1.9 eV', 'each'], 'fl04-val fl04-val-b', 'start', 24)}
  </svg>`;
}

/* ---------- 4T · Spectrum bands: ultraviolet, visible and infrared marked on the energy scale, each with its effect ---------- */

function drawT(): string {
  const p = 'fl04t', ax = 66, K = 0.036, xe = 440, x1 = 548;
  const y = (e: number): number => 578 - e * 108;
  const eUV = eV(380), eIR = eV(780); // the edges of human vision (slide 3): 3.26 and 1.59 eV
  const band = (e0: number, e1: number, cls: string, name: string): string =>
    `<rect class="fl04-band ${cls}" x="${ax}" y="${f(y(e1))}" width="${x1 - ax}" height="${f(y(e0) - y(e1))}"/>${T(x1 - 8, y(e1) + 28, name, 'fl04-bandt', 'end')}`;
  const rows = PHOTONS.map(ph => {
    const yy = y(eV(ph.nm));
    return `<circle cx="${ax}" cy="${f(yy)}" r="5.5" style="fill:${ph.col}"/>
      ${photon(ph, 144, yy, 100, K, 12)}
      ${T(204, yy - 4, `${ph.nm} nm`, 'fl04-lab')}${T(204, yy + 22, ph.fate === 'lift' ? `${ph.name} · ${eVs(ph.nm)}` : eVs(ph.nm), 'fl04-val')}`;
  }).join('');
  const yb = y(eV(450)), yr = y(eV(650));
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="A vertical scale of energy per photon in electronvolts, split into the ultraviolet above 3.3 eV, the visible from 1.6 to 3.3 eV and the infrared below 1.6 eV. Four photons, drawn as wave packets at their true relative wavelengths, sit at their energies: 300 nm 4.1 eV in the ultraviolet, beside DNA with a broken base pair; blue 450 nm 2.8 eV and red 650 nm 1.9 eV in the visible, beside an electron in a pigment lifted to a higher level; 1000 nm 1.2 eV in the infrared, beside heat. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
    ${pDefs(p)}
    <defs><linearGradient id="${p}-vis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5cc4"/><stop offset=".25" stop-color="#2350e6"/><stop offset=".5" stop-color="#2a963a"/><stop offset=".75" stop-color="#e3a51c"/><stop offset="1" stop-color="#c8361e"/></linearGradient></defs>
    ${band(eUV, 4.75, 'fl04-band-uv', 'ultraviolet')}
    <rect class="fl04-band" x="${ax}" y="${f(y(eUV))}" width="${x1 - ax}" height="${f(y(eIR) - y(eUV))}" fill="url(#${p}-vis)" opacity=".13"/>${T(x1 - 8, y(eUV) + 28, 'visible', 'fl04-bandt', 'end')}
    ${band(0, eIR, 'fl04-band-ir', 'infrared')}
    ${vAxis(p, ax, y(0), 46, y, [0, 1, 2, 3, 4])}
    ${rows}
    ${effect(p, 'bond', xe, y(eV(300)) + 2)}
    <path class="fl04-br" d="M332,${f(yb)} H342 V${f(yr)} H332 M342,${f((yb + yr) / 2)} H352"/>
    ${effect(p, 'lift', xe, (yb + yr) / 2 - 24)}
    ${effect(p, 'heat', xe, y(eV(1000)) + 44, 58)}
    ${newsClip(p, CR, CT - 28, CW, EINSTEIN_CLIP, 2, 11)}
    ${keyUnder(CR, CT - 28 + CH + 66)}${T(CR + CW / 2, CT - 28 + CH + 126, 'eV: electronvolt', 'fl04-nt', 'middle')}
    ${T(80, 32, 'energy per photon (eV)', 'fl04-ax')}
  </svg>`;
}

/* ================= Round 2 (26 Oct 2026): five variants from the lecturer's pick 4R ================= */
// SLIDE34_BRIEF.md, "Round 2": keep 4R's energy-against-wavelength curve with the four photons, the clipping, the
// symbol definitions and axis labels; fewer pieces, bigger; DNA drawn as a double helix with the break, and the
// effects named as effects: "DNA damage", "electron excited", "warming". Each variant moves the clipping, the
// spectral ranges or the effect pictures.

const NM = [300, 450, 650, 1000];
type Kind = 'bond' | 'lift' | 'heat';
const FX: Record<Kind, string> = { bond: 'DNA damage', lift: 'electron excited', heat: 'warming' };

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
  const lab = o.two ? FX[kind].split(' ') : [FX[kind]];
  const dy = o.dy ?? (kind === 'bond' ? (o.vertical ? len / 2 + 30 : 54) : kind === 'lift' ? 62 : 58);
  return pic + lines(cx + (o.dx ?? 0), cy + dy, lab, 'fl04-obj', o.a ?? 'middle', 24);
}

interface Graph { X: (nm: number) => number; Y: (e: number) => number; ox: number; oy: number; xEnd: number; yTop: number; len: number; K: number; nm0: number; nm1: number }
/** 4R's graph: energy and wavelength axes with ticks, the curve E = hc/λ, and the four photons on it. The curve is
 *  masked under each photon's wave so the packet reads cleanly. */
function eGraph(p: string, g: Graph): string {
  const { X, Y, ox, oy, xEnd, yTop, len, K, nm0, nm1 } = g;
  const curve = Array.from({ length: 121 }, (_, i) => { const nm = nm0 + ((nm1 - nm0) * i) / 120; return `${i ? 'L' : 'M'}${f(X(nm))},${f(Y(eV(nm)))}`; }).join('');
  const mask = `<mask id="${p}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="600"><rect width="800" height="600" fill="#fff"/>${PHOTONS.map(ph =>
    `<path d="${packetD(X(ph.nm), Y(eV(ph.nm)), len, ph.nm * K, 11)}" fill="none" stroke="#000" stroke-width="13" stroke-linecap="round"/>`).join('')}</mask>`;
  return `${mask}<path class="fl04-curve" d="${curve}" mask="url(#${p}-m)"/>
    ${vAxis(p, ox, oy, yTop, Y, [0, 1, 2, 3, 4])}${hAxis(p, oy, ox, xEnd, X, NM)}
    ${PHOTONS.map(ph => photon(ph, X(ph.nm), Y(eV(ph.nm)), len, K, 11, 0, 3)).join('')}`;
}

/** The visible spectrum as a gradient from x1 (380 nm) to x2 (780 nm), along x or, with `vertical`, along y. */
function visGrad(id: string, x1: number, x2: number): string {
  const st: Array<[number, string]> = [[380, '#7b4fc0'], [440, '#2350e6'], [490, '#1aa0c8'], [530, '#2a963a'], [580, '#e3c21c'], [620, '#e07a1f'], [680, '#c8361e'], [780, '#7a1f17']];
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="0" x2="${f(x2)}" y2="0">${st.map(([nm, c]) => `<stop offset="${f((nm - 380) / 400)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
}
const E_380 = eV(380), E_780 = eV(780); // the edges of human vision (slide 3): 3.26 and 1.59 eV

/* ================= Round 3 (26 Oct 2026): light only as separate photons, each on its own energy step ================= */
// The lecturer's note on round 2: a smooth curve draws light as continuous, but its energy comes in packets. So
// light is drawn only as separate wave packets with gaps between them; each photon rests on a short level at its
// energy; E = hc/λ is at most a faint dotted guide; a dim and a bright beam of the same red show intensity as the
// number of equal packets. The page text now defines h and c, so the clipping is EINSTEIN_SLIDE (no key lines).

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
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Four photons, drawn as separate wave packets at their true relative wavelengths, each resting on a short level at its energy on a graph of energy per photon in electronvolts against wavelength in nanometres: 300 nm 4.1 eV, 450 nm 2.8 eV, 650 nm 1.9 eV, 1000 nm 1.2 eV; a faint dotted guide links the levels. A strip under the wavelength axis marks ultraviolet, visible and infrared; under it, what each does: DNA damage, electron excited, warming. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
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

/* ---------- 4V · Effects beside the photons: Einstein left; each effect next to the photon causing it ---------- */

function drawV(): string {
  const p = 'fl04v', ox = 300, oy = 512, K = 0.032;
  const X = (nm: number): number => ox + (nm - 200) * 0.56, Y = (e: number): number => oy - e * 104;
  const steps = PHOTONS.map(ph => onStep(ph, X(ph.nm), Y(eV(ph.nm)), 76, K, 88)).join('');
  const lab = (i: number, dx: number, dy: number, a: A = 'start'): string => {
    const ph = PHOTONS[i], x = X(ph.nm) + dx, y = Y(eV(ph.nm)) + dy;
    return `${T(x, y, ph.name, 'fl04-lab', a)}${T(x, y + 24, eVs(ph.nm), 'fl04-val', a)}`;
  };
  const xi = X(1000), yi = Y(eV(1000)), xb = X(450), yb = Y(eV(450)) - 18;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Left: Albert Einstein's 1905 clipping, E = hc/λ. Right: four photons, drawn as separate wave packets at their true relative wavelengths, each resting on a short level at its energy on a graph of energy per photon in electronvolts against wavelength in nanometres, a faint dotted guide linking the levels; beside each, what it does: ultraviolet 300 nm 4.1 eV, DNA damage; blue 450 nm 2.8 eV and red 650 nm 1.9 eV, electron excited; infrared 1000 nm 1.2 eV, warming.">
    ${pDefs(p)}
    ${newsClip(p, CL, CB, CW, EINSTEIN_SLIDE, -2, 7)}
    ${T(282, 40, 'energy per photon (eV)', 'fl04-ax')}${T(780, 40, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${hcGuide(X, Y, 292, 1035)}
    ${eAxes(p, ox, oy, 780, 60, X, Y)}
    ${steps}
    ${T(780, 576, 'wavelength (nm)', 'fl04-ax', 'end')}
    ${lab(0, 54, -16)}${lab(1, 54, -16)}${lab(2, 54, -22)}${lab(3, 0, -64, 'middle')}
    ${photonTag(xb - 30, yb + 6, xb - 52, yb + 42, 'end')}
    ${fx(p, 'bond', 650, 84, { dy: 58, len: 128, s: 1.1 })}
    ${fx(p, 'lift', 716, 196, { dy: 70, two: true, s: 1.1 })}
    <g transform="translate(${f(xi)} ${f(yi + 52)}) scale(1.1) translate(${f(-xi)} ${f(-yi - 52)})">${heatPic(xi, yi + 52)}</g>${T(xi - 34, yi + 60, FX.heat, 'fl04-obj', 'end')}
  </svg>`;
}

/* ---------- 4W · Spectrum columns: ultraviolet, visible and infrared shaded behind the steps, each effect at its foot ---------- */

function drawW(): string {
  const p = 'fl04w', ox = 300, oy = 520, top = 56, K = 0.032;
  const X = (nm: number): number => ox + (nm - 120) * 0.48, Y = (e: number): number => oy - e * 94;
  const xu = X(380), xv = X(780), x1 = X(1050);
  const steps = PHOTONS.map(ph => onStep(ph, X(ph.nm), Y(eV(ph.nm)), 66, K, 76)).join('');
  const lab = (nm: number, dx: number, dy: number, a: A = 'start'): string => T(X(nm) + dx, Y(eV(nm)) + dy, eVs(nm), 'fl04-lab', a);
  const xb = X(450), yb = Y(eV(450)) - 18;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Left: Albert Einstein's 1905 clipping, E = hc/λ. Right: a graph of energy per photon in electronvolts against wavelength in nanometres, shaded behind into ultraviolet, visible and infrared. Four photons, drawn as separate wave packets at their true relative wavelengths, each rest on a short level at their energy: 300 nm 4.1 eV, 450 nm 2.8 eV, 650 nm 1.9 eV, 1000 nm 1.2 eV. At the foot of each column, what its photons do: DNA damage, electron excited, warming.">
    ${pDefs(p)}<defs>${visGrad(`${p}-vg`, xu, xv)}</defs>
    <rect class="fl04-band fl04-band-uv" x="${ox}" y="${top}" width="${f(xu - ox)}" height="${oy - top}"/>
    <rect class="fl04-band" x="${f(xu)}" y="${top}" width="${f(xv - xu)}" height="${oy - top}" fill="url(#${p}-vg)" fill-opacity=".13"/>
    <rect class="fl04-band fl04-band-ir" x="${f(xv)}" y="${top}" width="${f(x1 - xv)}" height="${oy - top}"/>
    ${T((ox + xu) / 2 + 4, top + 26, 'ultraviolet', 'fl04-strip-t', 'middle')}${T((xu + xv) / 2, top + 26, 'visible', 'fl04-strip-t', 'middle')}${T((xv + x1) / 2, top + 26, 'infrared', 'fl04-strip-t', 'middle')}
    ${newsClip(p, CL, CB, CW, EINSTEIN_SLIDE, -2, 7)}
    ${T(282, 36, 'energy per photon (eV)', 'fl04-ax')}${T(780, 36, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${eAxes(p, ox, oy, 780, 64, X, Y)}
    ${steps}
    ${T(780, 582, 'wavelength (nm)', 'fl04-ax', 'end')}
    ${lab(300, 48, 7)}${lab(450, 48, 7)}${lab(650, 48, 7)}${lab(1000, 0, -46, 'middle')}
    ${photonTag(xb - 26, yb - 6, xb - 44, yb - 34, 'end')}
    ${fx(p, 'bond', (ox + xu) / 2 + 4, 382, { vertical: true, len: 112, dy: 98, two: true, s: 1.12 })}
    ${fx(p, 'lift', (xu + xv) / 2, 436, { dy: 68, s: 1.15 })}
    ${fx(p, 'heat', (xv + x1) / 2 - 20, 448, { dy: 56, s: 1.15 })}
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
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="Four photons, drawn as separate wave packets at their true relative wavelengths, each resting on a short level at its energy on a graph of energy per photon in electronvolts against wavelength in nanometres: ultraviolet 300 nm 4.1 eV, blue 450 nm 2.8 eV, red 650 nm 1.9 eV, infrared 1000 nm 1.2 eV. Each level reaches back to the energy axis; left of it, level with the photons, what each does: DNA damage at 4.1 eV, electron excited between 1.9 and 2.8 eV, warming at 1.2 eV. Right: Albert Einstein's 1905 clipping, E = hc/λ.">
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

/* ---------- 4Y · Clipping in the corner: a full-width graph, Einstein above the infrared step, effects under the steps ---------- */

function drawY(): string {
  const p = 'fl04y', ox = 70, oy = 540, K = 0.032;
  const X = (nm: number): number => ox + (nm - 200) * 0.825, Y = (e: number): number => oy - e * 100;
  const steps = PHOTONS.map(ph => onStep(ph, X(ph.nm), Y(eV(ph.nm)), 80, K, 94)).join('');
  const lab = (i: number, dx: number, dy: number, a: A = 'start'): string => {
    const ph = PHOTONS[i], x = X(ph.nm) + dx, y = Y(eV(ph.nm)) + dy;
    return `${T(x, y, ph.name, 'fl04-lab', a)}${T(x, y + 24, eVs(ph.nm), 'fl04-val', a)}`;
  };
  const xu = X(300), yu = Y(eV(300)) - 18;
  return `<svg class="fig-svg fl04" viewBox="0 0 800 600" role="img" aria-label="A full-width graph of energy per photon in electronvolts against wavelength in nanometres. Four photons, drawn as separate wave packets at their true relative wavelengths, each rest on a short level at their energy: ultraviolet 300 nm 4.1 eV, blue 450 nm 2.8 eV, red 650 nm 1.9 eV, infrared 1000 nm 1.2 eV; a faint dotted guide links the levels. Under the steps, below each, what it does: DNA damage, electron excited, warming. Albert Einstein's 1905 clipping, E = hc/λ, sits in the corner above the infrared step.">
    ${pDefs(p)}
    ${T(50, 40, 'energy per photon (eV)', 'fl04-ax')}${T(540, 40, 'eV: electronvolt', 'fl04-nt', 'end')}
    ${hcGuide(X, Y, 276, 1050)}
    ${eAxes(p, ox, oy, 780, 76, X, Y)}
    ${steps}
    ${T(780, oy - 12, 'wavelength (nm)', 'fl04-ax', 'end')}
    ${lab(0, 56, -14)}${lab(1, 56, -14)}${lab(2, 0, 28, 'middle')}${lab(3, 0, 28, 'middle')}
    ${photonTag(xu + 16, yu - 10, xu + 28, yu - 30)}
    ${fx(p, 'bond', X(300) + 26, 330, { dy: 62, len: 128, s: 1.15 })}
    ${fx(p, 'lift', (X(450) + X(650)) / 2 - 2, 456, { dy: 74, s: 1.15 })}
    <g transform="translate(610 466) scale(1.15) translate(-610 -466)">${heatPic(610, 466)}</g>${T(576, 474, FX.heat, 'fl04-obj', 'end')}
    ${newsClip(p, CR, 16, CW, EINSTEIN_SLIDE, 2, 11)}
  </svg>`;
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ, k: drawK, l: drawL, m: drawM, n: drawN, o: drawO, p: drawP, q: drawQ, r: drawR, s: drawS, t: drawT, u: drawU, v: drawV, w: drawW, x: drawX, y: drawY };

export function draw(id: string): string {
  return (DRAW[id] ?? drawP)();
}
