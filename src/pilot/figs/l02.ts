// Slide L02 · Why is the sky blue, and why are leaves green? Confirmed context.
// Core: the colour we see is the light that reaches the eye. Air redirects light (blue most, ≈ 1/λ⁴);
// leaves remove light (blue and red most), so what comes from them is relatively green.
// Variant 'a' is the liked "Redirect vs remove" (2B in ./s2.ts); the others develop that idea.
import type { PlateText, Variant } from '../types';
import './l02.css';
import {
  LAM, T, across, airMol, beam, card, defs, drawB as redirectRemove, eye, glow, leaf, leafCurve,
  photoBox, pointer, sun, wv, type Col,
} from './s2';
import { spec } from '../../lib/colour';

export const PLATE: PlateText = {
  n: '2',
  status: 'confirmed',
  title: 'Why is the sky blue, and why are leaves green?',
  lead: 'Light that meets matter is reflected, transmitted, absorbed or scattered, depending on its wavelength.',
  points: [
    { claim: 'Sky: Rayleigh scattering.', text: 'Air redirects short wavelengths most<br>Scattered blue reaches you from the whole sky' },
    { claim: 'Leaf: absorption.', text: 'Chlorophyll removes blue and red<br>The green left over is reflected and transmitted' },
    { claim: 'Redirect vs remove.', text: 'A scattered photon keeps its energy<br>An absorbed photon gives its energy to the pigment' },
  ],
  refs: [
    { label: 'NASA Space Place', url: 'https://spaceplace.nasa.gov/blue-sky/en/' },
    { label: 'NASA Science: wave behaviors', url: 'https://science.nasa.gov/ems/03_behaviors/' },
    { label: 'Terashima et al. 2009', url: 'https://doi.org/10.1093/pcp/pcp034' },
  ],
};

// The lecturer's picks; since 26 Oct 2026 they are the summary slide 5b, after the pigments. Unlisted variants (j, l, m, n, o) still draw by id.
export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Redirect vs remove', anim: true },
  { id: 'k', name: 'Scene and key', anim: true },
];
// Kept for reference and still drawn by id: b Mirror diptych, c Photo paths, d Spectra at eye, e Close-ups,
// f Photo lenses, g Photo to eye, h Not this, but this, i One beam.

const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg f2 fl02" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;
const unit = (x0: number, y0: number, x1: number, y1: number): [number, number] => {
  const L = Math.hypot(x1 - x0, y1 - y0);
  return [(x1 - x0) / L, (y1 - y0) / L];
};

/** A wave on a photograph: a pale under-stroke keeps it readable on leaves and sky. */
function hw(p: string, c: Col, x0: number, y0: number, x1: number, y1: number,
  o: { amp?: number; head?: boolean; ph?: number; k?: number } = {}): string {
  return wv(p, c, x0, y0, x1, y1, { ...o, head: false, cls: 'fl02-halo' }) + wv(p, c, x0, y0, x1, y1, o);
}
/** White light on a photograph: three haloed waves side by side. */
function hbeam(p: string, cols: Col[], x0: number, y0: number, x1: number, y1: number, gap: number,
  o: { amp?: number; head?: boolean; k?: number } = {}): string {
  return cols.map((c, i) => {
    const [ox, oy] = across(x0, y0, x1, y1, i, cols.length, gap);
    return hw(p, c, x0 + ox, y0 + oy, x1 + ox, y1 + oy, { ...o, ph: i * 1.3 });
  }).join('');
}
/** Where each colour of a beam ends: used to put glows exactly on the absorbed waves. */
function beamEnds(cols: Col[], x0: number, y0: number, x1: number, y1: number, gap: number): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {};
  cols.forEach((c, i) => { const [ox, oy] = across(x0, y0, x1, y1, i, cols.length, gap); out[c] = [x1 + ox, y1 + oy]; });
  return out;
}
/** A pale pill with one line of text, for labels laid on the photograph. */
const pill = (p: string, x: number, y: number, w: number, html: string): string =>
  `${card(p, x, y, w, 44, 22)}<text class="f2-tag" x="${x + w / 2}" y="${y + 30}" text-anchor="middle">${html}</text>`;
/** Three bars in spectral order: what reaches the eye (schematic). */
function bars(x: number, base: number, h: [number, number, number]): string {
  return (['b', 'g', 'r'] as Col[]).map((c, i) =>
    `<rect class="fl02-bar fl02-bar-${c}" x="${x + i * 24}" y="${base - h[i]}" width="18" height="${h[i]}" rx="3"/>${T(x + i * 24 + 9, base + 19, c.toUpperCase(), 'fl02-mini', 'middle')}`).join('')
    + `<path class="f2-base" d="M${x - 6},${base}H${x + 72}"/>`;
}

/* ---------- a · Redirect vs remove (the liked 2B) ---------- */

const drawA = (): string => redirectRemove('fl02a');

/* ---------- b · Mirror diptych: one Sun on the seam, two mirror-image panels ---------- */

function drawB(): string {
  const p = 'fl02b';
  const S: [number, number] = [400, 92];
  const M: [number, number] = [214, 268];
  const H: [number, number] = [586, 268];
  const ul = unit(S[0], S[1], M[0], M[1]), ur = unit(S[0], S[1], H[0], H[1]);
  const inL: [number, number] = [S[0] + ul[0] * 54, S[1] + ul[1] * 54], outL: [number, number] = [M[0] + ul[0] * 140, M[1] + ul[1] * 140];
  const inR: [number, number] = [S[0] + ur[0] * 54, S[1] + ur[1] * 54];
  const ends = beamEnds(['b', 'g', 'r'], inR[0], inR[1], H[0], H[1], 11);
  return svg(p, 'Two mirror-image panels lit by one Sun. Left: an air molecule redirects blue light down to an eye, and the beam carries on. Right: a leaf absorbs blue and red; green comes through to an eye. Bars show what reaches each eye.', `
    <rect class="fl02-panel-air" x="6" y="150" width="388" height="444" rx="18"/>
    <rect class="fl02-panel-leaf" x="406" y="150" width="388" height="444" rx="18"/>
    ${T(24, 46, 'Air <tspan class="fl02-verb-b">redirects</tspan>', 'fl02-verb')}${T(24, 80, 'same colour, new direction', 'f2-s')}
    ${T(776, 46, 'Leaf <tspan class="fl02-verb-b">removes</tspan>', 'fl02-verb', 'end')}${T(776, 80, 'blue and red absorbed', 'f2-s', 'end')}
    ${sun(S[0], S[1], 30)}
    ${beam(p, ['b', 'g', 'r'], inL[0], inL[1], outL[0], outL[1], 11)}
    ${wv(p, 'b', M[0], M[1] + 16, M[0], 446)}
    ${airMol(M[0], M[1], 'N', 18, 15)}
    ${T(M[0] + 30, M[1] + 52, 'air molecule', 'f2-s')}
    ${eye(M[0], 482)}${T(M[0], 548, 'you see blue', 'f2-cap', 'middle')}
    ${bars(46, 510, [62, 28, 14])}${T(82, 568, 'reaches the eye', 'fl02-mini', 'middle')}

    ${(['b', 'g', 'r'] as Col[]).map((c, i) => {
      const [ox, oy] = across(inR[0], inR[1], H[0], H[1], i, 3, 11);
      return wv(p, c, inR[0] + ox, inR[1] + oy, H[0] + ox + (c === 'g' ? ur[0] * 12 : 0), H[1] + oy + (c === 'g' ? ur[1] * 12 : 0), { head: false, ph: i * 1.3 });
    }).join('')}
    ${leaf(H[0] + 8, H[1] + 8, 200, 82, 6)}
    ${glow(p, ends.b[0], ends.b[1])}${glow(p, ends.r[0], ends.r[1])}
    ${wv(p, 'g', H[0], H[1] + 46, H[0], 446)}
    ${T(H[0] - 30, H[1] + 82, 'leaf', 'f2-s', 'end')}
    ${eye(H[0], 482)}${T(H[0], 548, 'you see green', 'f2-cap', 'middle')}
    ${bars(682, 510, [12, 62, 12])}${T(718, 568, 'reaches the eye', 'fl02-mini', 'middle')}
  `);
}

/* ---------- c · Photo paths: the two interactions drawn on the photograph ---------- */

function drawC(): string {
  const p = 'fl02c';
  // Sky: a beam from the upper left meets an air molecule; blue is redirected in all directions.
  const M: [number, number] = [116, 238];
  const u = unit(18, 30, M[0], M[1]);
  // Leaf: a beam from above meets the backlit leaf; blue and red stop, green comes through.
  const H: [number, number] = [528, 352];
  const v = unit(410, 40, H[0], H[1]);
  const e = beamEnds(['b', 'g', 'r'], 410, 40, H[0], H[1], 12);
  return svg(p, 'The photograph of leaves against the sky, with light paths drawn on it: in the sky an air molecule redirects blue light in all directions; on a leaf blue and red light are absorbed and green comes through.', `
    ${photoBox(`${p}-clip`, 0, 0, 800, 600, [0, 0, 800, 600])}
    ${hbeam(p, ['b', 'g', 'r'], 18, 30, M[0] + u[0] * 70, M[1] + u[1] * 70, 11, { amp: 5 })}
    ${hw(p, 'b', M[0], M[1], 36, 372, { amp: 5 })}${hw(p, 'b', M[0], M[1], 196, 132, { amp: 5 })}${hw(p, 'b', M[0], M[1], 18, 210, { amp: 5 })}
    ${airMol(M[0], M[1], 'N', 18, 13)}
    ${hbeam(p, ['b', 'g', 'r'], 410, 40, H[0], H[1], 12, { amp: 5, head: false })}
    ${glow(p, e.b[0], e.b[1], 15)}${glow(p, e.r[0], e.r[1], 15)}
    ${hw(p, 'g', e.g[0] + v[0] * 26, e.g[1] + v[1] * 26, H[0] + v[0] * 190, H[1] + v[1] * 190, { amp: 5 })}
    ${pill(p, 164, 214, 286, 'air <tspan class="f2-tag-b">redirects</tspan> blue')}
    ${card(p, 470, 520, 316, 66, 18)}
    <text class="f2-tag" x="490" y="547">leaf <tspan class="f2-tag-b">removes</tspan> blue and red;</text>
    <text class="f2-tag" x="490" y="573">green comes through</text>
  `);
}

/* ---------- d · Spectra at the eye: sunlight, then what each kind of matter sends on ---------- */

// Spectra start at 430 nm so that light from the sky reads as blue rather than violet.
const NM0 = 430, NM1 = 680;
const skyCurve = (nm: number): number => (NM0 / nm) ** 4;
function specStops(): string {
  const n = (NM1 - NM0) / 10;
  return Array.from({ length: n + 1 }, (_, i) => {
    const c = spec(NM0 + i * 10).map(v => Math.round(v * 0.88 + 250 * 0.12));
    return `<stop offset="${(i / n).toFixed(3)}" stop-color="rgb(${c.join(',')})"/>`;
  }).join('');
}

function specChip(p: string, x: number, y: number, w: number, h: number, curve: (nm: number) => number): string {
  const x0 = x + 16, x1 = x + w - 16, yb = y + h - 36, yt = y + 16;
  const X = (nm: number): number => x0 + ((nm - NM0) / (NM1 - NM0)) * (x1 - x0);
  const Y = (k: number): number => yb - k * (yb - yt);
  const pts: string[] = [];
  for (let nm = NM0; nm <= NM1; nm += 4) pts.push(`${f(X(nm))},${f(Y(curve(nm)))}`);
  return `${card(p, x, y, w, h, 14)}
    <path fill="url(#${p}-spec)" d="M${f(x0)},${yb}L${pts.join('L')}L${f(x1)},${yb}Z"/>
    <path class="f2-curve" d="M${pts.join('L')}"/><path class="f2-base" d="M${f(x0)},${yb}H${f(x1)}"/>
    ${T(X(450), yb + 24, 'blue', 'f2-axis', 'middle')}${T(X(550), yb + 24, 'green', 'f2-axis', 'middle')}${T(X(650), yb + 24, 'red', 'f2-axis', 'middle')}`;
}

function drawD(): string {
  const p = 'fl02d';
  const flat = (): number => 0.82;
  const step = (cx: number, cy: number, icon: string, a: string, b: string): string =>
    `<circle class="fl02-op" cx="${cx}" cy="${cy}" r="44"/>${icon}${T(cx, cy + 74, a, 'f2-cap f2-cap-b', 'middle')}${T(cx, cy + 100, b, 'f2-s', 'middle')}`;
  return svg(p, 'Schematic spectra. White sunlight contains all colours. Air redirects it weighted by 1 over wavelength to the fourth, so light from the sky is blue-heavy. A leaf removes blue and red, so light from the leaf is green-heavy.', `
    <defs><linearGradient id="${p}-spec">${specStops()}</linearGradient></defs>
    ${sun(98, 188, 26)}
    ${T(98, 262, 'sunlight', 'f2-cap f2-cap-b', 'middle')}
    ${specChip(p, 12, 278, 172, 128, flat)}
    ${T(98, 432, 'all colours', 'f2-s', 'middle')}
    <path class="fl02-flow" d="M190,318 C222,318 230,152 258,138"/><path class="fl02-flow" d="M190,364 C222,364 230,438 258,452"/>
    ${step(304, 138, airMol(304, 138, 'N', 18, 14), 'air redirects', '≈ 1/λ⁴')}
    ${step(304, 452, leaf(312, 452, 74, 34, -24), 'leaf removes', 'blue and red')}
    <path class="fl02-flow" d="M352,138H388"/><path class="fl02-flow" d="M352,452H388"/>
    ${specChip(p, 394, 74, 214, 136, skyCurve)}${T(501, 60, 'light from the sky', 'f2-tag f2-tag-b', 'middle')}
    ${specChip(p, 394, 388, 214, 136, leafCurve)}${T(501, 374, 'light from the leaf', 'f2-tag f2-tag-b', 'middle')}
    <path class="fl02-flow" d="M614,142H664"/><path class="fl02-flow" d="M614,456H664"/>
    ${eye(712, 142)}${T(712, 202, 'blue sky', 'f2-cap', 'middle')}
    ${eye(712, 456)}${T(712, 516, 'green leaf', 'f2-cap', 'middle')}
    ${T(788, 590, 'schematic spectra', 'fl02-mini', 'end')}
  `);
}

/* ---------- e · Close-ups: one air molecule beside one chloroplast ---------- */

function drawE(): string {
  const p = 'fl02e';
  const L: [number, number] = [204, 288], R: [number, number] = [596, 288], r = 172;
  // Left: white light passes the molecule; blue leaves in new directions with the same wavelength.
  const m: [number, number] = [L[0] + 6, L[1] - 18];
  // Right: white light enters the chloroplast; blue and red end as excitation in the thylakoid membranes, green comes out weaker.
  const hit: [number, number] = [R[0] - 2, R[1] - 18];
  const e = beamEnds(['b', 'g', 'r'], R[0] - 160, hit[1], hit[0], hit[1], 13);
  return svg(p, 'Two magnified views. Left: one air molecule; white light passes, and blue light leaves in new directions with the same wavelength. Right: a chloroplast in a leaf cell; blue and red light are absorbed and their energy taken up, green light is absorbed least and partly comes through.', `
    <defs><clipPath id="${p}-cl"><circle cx="${L[0]}" cy="${L[1]}" r="${r}"/></clipPath><clipPath id="${p}-cr"><circle cx="${R[0]}" cy="${R[1]}" r="${r}"/></clipPath></defs>
    <circle class="fl02-zoom fl02-zoom-air" cx="${L[0]}" cy="${L[1]}" r="${r}"/>
    <circle class="fl02-zoom fl02-zoom-leaf" cx="${R[0]}" cy="${R[1]}" r="${r}"/>
    ${T(L[0], 92, 'one air molecule', 'f2-cap f2-cap-b', 'middle')}${T(R[0], 92, 'one chloroplast in a leaf', 'f2-cap f2-cap-b', 'middle')}
    <g clip-path="url(#${p}-cl)">
      ${beam(p, ['b', 'g', 'r'], L[0] - 166, m[1], L[0] + 150, m[1], 14, { amp: 7 })}
      ${wv(p, 'b', m[0], m[1] + 20, m[0] - 34, L[1] + 140, { amp: 7 })}
      ${wv(p, 'b', m[0] + 10, m[1] + 18, m[0] + 104, L[1] + 108, { amp: 7 })}
      ${wv(p, 'b', m[0] - 4, m[1] - 22, m[0] - 76, L[1] - 128, { amp: 7 })}
      ${airMol(m[0], m[1], 'N', 18, 26)}
    </g>
    <g clip-path="url(#${p}-cr)">
      <ellipse class="fl02-chl" cx="${R[0] + 38}" cy="${R[1] + 4}" rx="98" ry="64"/>
      ${[-26, 0, 26].map(dy => `<rect class="fl02-thy" x="${R[0] - 6}" y="${R[1] + dy - 6}" width="88" height="16" rx="8"/>`).join('')}
      ${beam(p, ['b', 'g', 'r'], R[0] - 166, hit[1], hit[0], hit[1], 13, { amp: 7, head: false })}
      ${wv(p, 'g', e.g[0], e.g[1], R[0] + 160, e.g[1], { amp: 4, cls: 'f2-faint' })}
      ${glow(p, e.b[0], e.b[1], 16)}${glow(p, e.r[0], e.r[1], 16)}${glow(p, e.g[0] + 30, e.g[1], 9)}
    </g>
    ${T(L[0], 500, 'Air <tspan class="fl02-verb-b">redirects</tspan>', 'fl02-verb', 'middle')}
    ${T(L[0], 532, 'same wavelength, new direction', 'f2-s', 'middle')}
    ${T(R[0], 500, 'Leaf <tspan class="fl02-verb-b">removes</tspan>', 'fl02-verb', 'middle')}
    ${T(R[0], 532, 'blue and red absorbed:', 'f2-s', 'middle')}
    ${T(R[0], 558, 'their energy is taken up;', 'f2-s', 'middle')}
    ${T(R[0], 584, 'green absorbed least, some passes', 'f2-s', 'middle')}
  `);
}

/* ---------- f · Photo lenses: two magnifiers on the photograph ---------- */

function lens(p: string, id: string, cx: number, cy: number, r: number, sx: number, sy: number, inner: string): string {
  const d = Math.hypot(cx - sx, cy - sy), ux = (sx - cx) / d, uy = (sy - cy) / d;
  const ex = cx + ux * r, ey = cy + uy * r;
  return `${pointer(ex, ey, sx, sy)}
    <defs><clipPath id="${p}-${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
    <circle class="fl02-lens" cx="${cx}" cy="${cy}" r="${r}" filter="url(#${p}-sh)"/>
    <g clip-path="url(#${p}-${id})">${inner}</g>
    <circle class="fl02-lens-rim" cx="${cx}" cy="${cy}" r="${r}"/>`;
}

function drawF(): string {
  const p = 'fl02f';
  const A: [number, number] = [150, 448], B: [number, number] = [664, 156], r = 108;
  const e = beamEnds(['b', 'g', 'r'], B[0] - 104, B[1] - 2, B[0] - 30, B[1] - 2, 11);
  return svg(p, 'The photograph of leaves against the sky with two magnifying lenses. On the sky: an air molecule redirects blue light. On a leaf: a chloroplast absorbs blue and red light and green comes through.', `
    ${photoBox(`${p}-clip`, 0, 0, 800, 600, [0, 0, 800, 600])}
    ${lens(p, 'la', A[0], A[1], r, 74, 186, `
      ${beam(p, ['b', 'g', 'r'], A[0] - 104, A[1] - 26, A[0] + 104, A[1] - 26, 10, { amp: 4.5, k: 0.85 })}
      ${wv(p, 'b', A[0], A[1] - 12, A[0] - 30, A[1] + 92, { amp: 4.5, k: 0.85 })}
      ${wv(p, 'b', A[0] + 8, A[1] - 12, A[0] + 70, A[1] + 76, { amp: 4.5, k: 0.85 })}
      ${airMol(A[0], A[1] - 26, 'N', 18, 15)}`)}
    ${lens(p, 'lb', B[0], B[1], r, 606, 394, `
      <ellipse class="fl02-chl" cx="${B[0] + 4}" cy="${B[1] + 4}" rx="62" ry="44"/>
      ${[-16, 4, 24].map(dy => `<rect class="fl02-thy" x="${B[0] - 24}" y="${B[1] + dy - 6}" width="58" height="13" rx="6.5"/>`).join('')}
      ${beam(p, ['b', 'g', 'r'], B[0] - 104, B[1] - 2, B[0] - 30, B[1] - 2, 11, { amp: 4.5, k: 0.85, head: false })}
      ${glow(p, e.b[0], e.b[1], 13)}${glow(p, e.r[0], e.r[1], 13)}
      ${wv(p, 'g', B[0] + 62, B[1] - 2, B[0] + 106, B[1] - 2, { amp: 4.5, k: 0.85 })}`)}
    ${pill(p, A[0] + r + 12, A[1] - 22, 268, 'air <tspan class="f2-tag-b">redirects</tspan> blue')}
    ${pill(p, B[0] - r - 12 - 316, B[1] - 22, 316, 'leaf <tspan class="f2-tag-b">removes</tspan> blue and red')}
  `);
}

/* ---------- g · Photo to the eye: what arrives from the sky and from a leaf ---------- */

function drawG(): string {
  const p = 'fl02g';
  const Ey: [number, number] = [400, 512];
  const sky: [number, number] = [104, 150], lf: [number, number] = [548, 306];
  return svg(p, 'The photograph above an eye. Blue light redirected by the air reaches the eye from the sky; green light left over by a leaf reaches it from the leaf.', `
    ${photoBox(`${p}-clip`, 0, 0, 800, 420, [0, 70, 800, 420])}
    ${hw(p, 'b', sky[0] + 8, sky[1] + 10, Ey[0] - 36, Ey[1] - 14, { amp: 5 })}
    ${hw(p, 'g', lf[0] - 6, lf[1] + 12, Ey[0] + 36, Ey[1] - 14, { amp: 5 })}
    ${pointer(sky[0] + 60, sky[1] - 64, sky[0], sky[1])}${pointer(lf[0] + 60, lf[1] - 64, lf[0], lf[1])}
    ${pill(p, 24, 34, 330, 'blue: <tspan class="f2-tag-b">redirected</tspan> by air')}
    ${pill(p, 470, 196, 316, 'green: <tspan class="f2-tag-b">left over</tspan> by leaf')}
    ${eye(Ey[0], Ey[1], 1.25)}
    ${T(Ey[0], 586, 'The colour you see is the light that reaches your eye.', 'f2-cap', 'middle')}
  `);
}

/* ---------- h · Not this, but this: the two misconceptions blocked ---------- */

const mark = (x: number, y: number, ok: boolean): string => ok
  ? `<circle class="fl02-ok" cx="${x}" cy="${y}" r="17"/><path class="fl02-ok-p" d="M${x - 8},${y}l6,6l11,-12"/>`
  : `<circle class="fl02-no" cx="${x}" cy="${y}" r="17"/><path class="fl02-no-p" d="M${x - 7},${y - 7}l14,14M${x + 7},${y - 7}l-14,14"/>`;

function drawH(): string {
  const p = 'fl02h';
  const X0 = [8, 408], Y0 = [86, 344], W = 384, Hc = 240;
  const cell = (c: number, r: number, wrong: boolean, body: string, cap: string): string =>
    `<rect class="${wrong ? 'fl02-cell fl02-cell-no' : 'fl02-cell'}" x="${X0[c]}" y="${Y0[r]}" width="${W}" height="${Hc}" rx="16"/>
     ${body}${T(X0[c] + W / 2, Y0[r] + Hc - 22, cap, 'f2-s', 'middle')}`;
  // Sky row: the molecule sits at the same place in both cells.
  const sky = (c: number, ok: boolean): string => {
    const x = X0[c], y = Y0[0], m: [number, number] = [x + 170, y + 66];
    return ok
      ? `${beam(p, ['b', 'g', 'r'], x + 22, m[1], x + 360, m[1], 10, { amp: 5 })}${wv(p, 'b', m[0], m[1] + 14, m[0] + 64, y + 168, { amp: 5 })}${airMol(m[0], m[1], 'N', 18, 13)}`
      : `${wv(p, 'r', x + 22, m[1], m[0] - 18, m[1], { amp: 5, head: false })}${wv(p, 'b', m[0], m[1] + 14, m[0] + 64, y + 168, { amp: 5 })}${airMol(m[0], m[1], 'N', 18, 13)}`;
  };
  // Leaf row: the leaf and the incoming beam are the same; only the green differs.
  const lf = (c: number, ok: boolean): string => {
    const x = X0[c], y = Y0[1], hit: [number, number] = [x + 200, y + 92];
    const x0 = x + 40, y0 = y + 22, e = beamEnds(['b', 'g', 'r'], x0, y0, hit[0], hit[1], 10);
    const inc = (['b', 'g', 'r'] as Col[]).map((k, i) => {
      const [ox, oy] = across(x0, y0, hit[0], hit[1], i, 3, 10);
      return wv(p, k, x0 + ox, y0 + oy, hit[0] + ox, hit[1] + oy, { amp: 5, head: false, ph: i * 1.3 });
    }).join('');
    const back = ok
      ? `${glow(p, e.g[0], e.g[1], 10)}${wv(p, 'g', e.g[0] - 8, e.g[1] + 18, x + 96, y + 168, { amp: 3.5, cls: 'f2-faint' })}`
      : `${wv(p, 'g', e.g[0] - 8, e.g[1] + 18, x + 76, y + 170, { amp: 5 })}`;
    return `${inc}${leaf(hit[0] + 54, hit[1] + 18, 150, 62, -22)}${glow(p, e.b[0], e.b[1])}${glow(p, e.r[0], e.r[1])}${back}`;
  };
  return svg(p, 'Two misconceptions and the correction. Not this: air turns red light into blue. But this: air redirects the blue already in sunlight. Not this: leaves reject green. But this: green is absorbed too, just less.', `
    ${mark(30, 42, false)}${T(58, 51, 'Not this', 'fl02-head')}
    ${mark(430, 42, true)}${T(458, 51, 'But this', 'fl02-head')}
    ${cell(0, 0, true, sky(0, false), 'air turns red light blue')}
    ${cell(1, 0, false, sky(1, true), 'air redirects the blue in sunlight')}
    ${cell(0, 1, true, lf(0, false), 'leaves reject green')}
    ${cell(1, 1, false, lf(1, true), 'green is absorbed too, just less')}
  `);
}

/* ---------- i · One beam, two stops: the same sunlight meets air, then a leaf ---------- */

const num = (x: number, y: number, n: number): string =>
  `<circle class="fl02-num" cx="${x}" cy="${y}" r="15"/>${T(x, y + 6, `${n}`, 'fl02-num-t', 'middle')}`;

function drawI(): string {
  const p = 'fl02i';
  const y = 116, S: [number, number] = [62, y], M: [number, number] = [262, y], Lx = 612;
  const e = beamEnds(['b', 'g', 'r'], 108, y, Lx, y, 11);
  const steps: Array<[number, string]> = [
    [1, 'Sunlight carries all colours.'],
    [2, 'Air redirects some of the blue: the sky glows blue.'],
    [3, 'The beam goes on, still nearly white.'],
    [4, 'The leaf removes blue and red; green comes through.'],
  ];
  return svg(p, 'One beam of sunlight: air molecules redirect some blue towards an eye, the beam continues nearly white, and a leaf absorbs blue and red while green comes through to a second eye.', `
    ${sun(S[0], S[1], 28)}
    ${(['b', 'g', 'r'] as Col[]).map((c, i) => {
      const [, oy] = across(108, y, Lx, y, i, 3, 11);
      return wv(p, c, 108, y + oy, Lx + (c === 'g' ? 12 : 0), y + oy, { head: false, ph: i * 1.3 });
    }).join('')}
    ${wv(p, 'b', M[0], M[1] + 16, M[0], 300)}${wv(p, 'b', M[0] + 8, M[1] - 14, M[0] + 70, 34, { amp: 5, cls: 'f2-faint' })}
    ${airMol(M[0], M[1], 'N', 18, 14)}${airMol(M[0] + 96, M[1] - 52, 'O', -30, 11)}
    ${leaf(Lx + 32, y + 20, 170, 70, 74)}
    ${glow(p, e.b[0], e.b[1])}${glow(p, e.r[0], e.r[1])}
    ${wv(p, 'g', Lx + 46, y + 22, 700, 300)}
    ${eye(M[0], 336)}${T(M[0], 396, 'sky: blue', 'f2-cap', 'middle')}
    ${eye(704, 336)}${T(704, 396, 'leaf: green', 'f2-cap', 'middle')}
    ${num(S[0], S[1] + 60, 1)}${num(M[0] - 40, M[1] + 46, 2)}${num(450, y - 36, 3)}${num(Lx - 36, y + 62, 4)}
    <path class="rule" d="M8,430H792"/>
    ${steps.map(([n, s], i) => `${num(30, 470 + i * 36, n)}${T(56, 478 + i * 36, s, 'f2-s')}`).join('')}
  `);
}

/* ---------- j · Colour grid: each colour against each kind of matter ---------- */

/** The three colours with J's words: how strongly air redirects each, and how strongly a leaf absorbs it. */
const ROWS: Array<{ c: Col; name: string; nm: string; fan: number; air: string; lf: string }> = [
  { c: 'b', name: 'blue', nm: '450 nm', fan: 3, air: 'most', lf: 'strongly' },
  { c: 'g', name: 'green', nm: '550 nm', fan: 2, air: 'less', lf: 'less' },
  { c: 'r', name: 'red', nm: '650 nm', fan: 1, air: 'least', lf: 'strongly' },
];
const FAN: Array<[number, number]> = [[-26, 60], [44, 56], [62, -42]];
/** J's air cell: a wave meets an air molecule at (ax, y) and leaves in `fan` new directions, in its own colour. */
const jAir = (p: string, c: Col, ax: number, y: number, fan: number, x0 = ax - 90, s = 1): string =>
  `${wv(p, c, x0, y, ax - 15, y, { amp: 5, head: false })}
      ${FAN.slice(0, fan).map(([dx, dy]) => wv(p, c, ax, y, ax + dx * s, y + dy * s, { amp: 4.5 })).join('')}
      ${airMol(ax, y, 'N', 18, 12)}`;
/** J's leaf cell: a wave ends in the leaf (amber glow); green is absorbed less and some passes on. */
function jLeaf(p: string, c: Col, lx: number, y: number, x0 = lx - 86): string {
  const through = c === 'g'
    ? `${glow(p, lx - 2, y, 10)}${wv(p, 'g', lx + 18, y + 10, lx + 52, y + 46, { amp: 3.5, cls: 'f2-faint' })}`
    : glow(p, lx - 2, y, 14);
  return `${wv(p, c, x0, y, lx - 2, y, { amp: 5, head: false })}${leaf(lx + 12, y + 4, 74, 30, 72)}${through}`;
}
/** J's row name: a short wave of the colour, its name and its wavelength. */
const jName = (p: string, r: typeof ROWS[number], x: number, y: number): string =>
  `${wv(p, r.c, x, y - 22, x + 56, y - 22, { amp: 5, head: false })}${T(x, y + 12, r.name, 'f2-cap f2-cap-b')}${T(x, y + 38, r.nm, 'fl02-mini')}`;

function drawJ(): string {
  const p = 'fl02j';
  // The grid alone: its verdict (the sky blue, the leaf green) is the page title, so it is not restated here.
  const Y = [196, 330, 464], ax = 240, lx = 560;
  const cells = ROWS.map((r, i) => {
    const y = Y[i];
    const air = `${jAir(p, r.c, ax, y, r.fan, 150)}${T(ax + 96, y + 8, r.air, 'f2-cap')}`;
    const lf = `${jLeaf(p, r.c, lx, y, 474)}
      ${T(lx + 74, y + 8, r.lf, 'f2-cap')}`;
    return `${i ? `<path class="rule" d="M8,${y - 67}H792"/>` : ''}
      ${jName(p, r, 18, y)}
      ${air}${lf}`;
  }).join('');
  return svg(p, 'A grid of three colours against two kinds of matter. Air molecules redirect blue most, green less and red least. A leaf absorbs blue and red strongly and green less.', `
    ${T(300, 70, 'air redirects it', 'fl02-head', 'middle')}${T(628, 70, 'leaf absorbs it', 'fl02-head', 'middle')}
    <path class="rule" d="M8,108H792"/><path class="rule" d="M462,40V542"/>
    ${cells}
    <path class="rule" d="M8,542H792"/>
    ${T(300, 576, 'blue ≈ 4.4× more than red', 'fl02-mini', 'middle')}
  `);
}

/* ---------- round 2 (k–o): A's scene and J's grid combined ---------- */

type Pt = [number, number];
const along = (a: Pt, u: [number, number], d: number): Pt => [a[0] + u[0] * d, a[1] + u[1] * d];

/** A's air half: the white beam from the Sun crosses the molecule at M and carries on; each ray leaves M in its own colour (red faint). */
function airSide(p: string, S: Pt, M: Pt, rays: Array<[Col, number, number]>, gap = 56, out = 172): string {
  const u = unit(S[0], S[1], M[0], M[1]), a = along(S, u, gap), b = along(M, u, out);
  return `${beam(p, ['b', 'g', 'r'], a[0], a[1], b[0], b[1], 11, { head: true })}
    ${rays.map(([c, x, y]) => wv(p, c, M[0], M[1], x, y, c === 'r' ? { amp: 4, cls: 'f2-faint' } : {})).join('')}
    ${airMol(M[0], M[1], 'N', 18, 14)}`;
}
/** Where the blue wave of A's beam runs, so a wavelength bracket can sit on it. */
function beamBlue(S: Pt, M: Pt, gap = 56, out = 172): [number, number, number, number] {
  const u = unit(S[0], S[1], M[0], M[1]), a = along(S, u, gap), b = along(M, u, out);
  const [ox, oy] = across(a[0], a[1], b[0], b[1], 0, 3, 11);
  return [a[0] + ox, a[1] + oy, b[0] + ox, b[1] + oy];
}
/** A's leaf half: the beam reaches the leaf at `hit`; blue and red end there (amber glows), green goes a little further. */
function leafSide(p: string, S: Pt, hit: Pt, Lc: Pt, o: { gap?: number; len?: number; wid?: number; rot?: number } = {}): { svg: string; end: Record<Col, Pt> } {
  const ur = unit(S[0], S[1], hit[0], hit[1]), a = along(S, ur, o.gap ?? 56);
  const ends = (['b', 'g', 'r'] as Col[]).map((c, i) => {
    const [ox, oy] = across(a[0], a[1], hit[0], hit[1], i, 3, 11);
    return { c, x0: a[0] + ox, y0: a[1] + oy, x1: hit[0] + ox, y1: hit[1] + oy };
  });
  const end = Object.fromEntries(ends.map(e => [e.c, [e.x1, e.y1]])) as Record<Col, Pt>;
  return {
    end,
    svg: `${ends.map(e => e.c === 'g'
      ? wv(p, 'g', e.x0, e.y0, e.x1 + ur[0] * 14, e.y1 + ur[1] * 14, { head: false, ph: 1.3 })
      : wv(p, e.c, e.x0, e.y0, e.x1, e.y1, { head: false, ph: e.c === 'b' ? 0 : 2.6 })).join('')}
    ${leaf(Lc[0], Lc[1], o.len ?? 214, o.wid ?? 86, o.rot ?? -6)}
    ${ends.filter(e => e.c !== 'g').map(e => glow(p, e.x1, e.y1)).join('')}`,
  };
}
/** A crest-to-crest bracket beside the wave wv(…, x0, y0, x1, y1, { amp, ph }): exactly one drawn wavelength,
 *  the first whole one after `at` px. `side` picks the side of the wave; `lab` is a point beyond it for a label. */
function lamBar(c: Col, x0: number, y0: number, x1: number, y1: number, at: number, side: 1 | -1,
  o: { amp?: number; ph?: number; k?: number } = {}): { d: string; lab: Pt } {
  const lam = LAM[c] * (o.k ?? 1), amp = o.amp ?? 6, ph = o.ph ?? 0;
  const [ux, uy] = unit(x0, y0, x1, y1), nx = -uy * side, ny = ux * side;
  const th = side > 0 ? Math.PI / 2 : 1.5 * Math.PI;
  const d0 = ((((th - ph) / (2 * Math.PI)) % 1) + 1) % 1 * lam;
  const d = d0 + lam * Math.ceil((at - d0) / lam);
  const P = (s: number, r: number): string => `${f(x0 + ux * s + nx * r)},${f(y0 + uy * s + ny * r)}`;
  const r0 = amp + 3, r1 = amp + 9, m = d + lam / 2;
  return {
    d: `<path class="fl02-lam" d="M${P(d, r0)}L${P(d, r1)}L${P(d + lam, r1)}L${P(d + lam, r0)}"/>`,
    lab: [x0 + ux * m + nx * (r1 + 16), y0 + uy * m + ny * (r1 + 16)],
  };
}

/* ---------- k · Scene and key: A's scene on top, J's grid below as its key ---------- */

function drawK(): string {
  const p = 'fl02k';
  const S: Pt = [400, 64], M: Pt = [196, 184], toEye: Pt = [228, 282];
  const [bx0, by0, bx1, by1] = beamBlue(S, M, 48, 150);
  const lin = lamBar('b', bx0, by0, bx1, by1, 50, -1);
  const lout = lamBar('b', M[0], M[1], toEye[0], toEye[1], 38, -1);
  const L = leafSide(p, S, [588, 160], [606, 186], { gap: 48 });
  const top = 392, cx = [354, 524, 694], yr = [500, 566];
  const key = `<path class="rule" d="M8,${top}H792"/>
    ${ROWS.map((r, i) => `${wv(p, r.c, cx[i] - 28, top + 28, cx[i] + 28, top + 28, { amp: 5, head: false })}
      ${T(cx[i] - 6, top + 66, r.name, 'f2-cap f2-cap-b', 'end')}${T(cx[i] + 2, top + 66, r.nm, 'fl02-mini')}
      ${T(cx[i], yr[0] + 8, r.air, 'f2-cap', 'middle')}${T(cx[i], yr[1] + 8, r.lf, 'f2-cap', 'middle')}`).join('')}
    <path class="rule" d="M8,${top + 80}H792"/><path class="rule" d="M8,${(yr[0] + yr[1]) / 2}H792"/>
    ${airMol(36, yr[0], 'N', 18, 11)}${T(64, yr[0] + 8, 'air redirects', 'f2-cap f2-cap-b')}
    ${leaf(40, yr[1], 46, 20, -20)}${T(64, yr[1] + 8, 'leaf absorbs', 'f2-cap f2-cap-b')}`;
  return svg(p, 'Top: one Sun; air molecules redirect blue light towards an eye, the same 450 nm wave in a new direction; a leaf absorbs blue and red and green reaches a second eye. Below, a key: air redirects blue most, green less, red least; a leaf absorbs blue and red strongly, green less.', `
    ${T(24, 40, 'Air redirects', 'f2-h')}
    ${T(776, 40, 'Leaf absorbs', 'f2-h', 'end')}
    <path class="f2-div" d="M400,118V372"/>
    ${sun(S[0], S[1], 26)}
    ${airSide(p, S, M, [['b', toEye[0], toEye[1]], ['b', 104, 126], ['b', 290, 214], ['r', 218, 110]], 48, 150)}
    ${airMol(84, 206, 'N', 40, 12)}
    ${lin.d}${T(lin.lab[0] - 4, lin.lab[1] + 8, '450 nm', 'f2-axis')}
    ${lout.d}${T(lout.lab[0] - 4, lout.lab[1] + 6, '450 nm', 'f2-axis')}
    ${eye(232, 318)}${T(232, 374, 'you see blue', 'f2-cap', 'middle')}
    ${L.svg}
    ${wv(p, 'g', 606, 224, 606, 284)}
    ${eye(606, 318)}${T(606, 374, 'you see green', 'f2-cap', 'middle')}
    ${key}
  `);
}

/* ---------- l · Labelled rays: A's scene, every ray named with J's word ---------- */

function drawL(): string {
  const p = 'fl02l';
  const S: Pt = [400, 84], M: Pt = [196, 262];
  // Three blue rays, two green, one red: the counts carry J's most / less / least.
  const rays: Array<[Col, number, number]> = [['b', 226, 446], ['b', 104, 176], ['b', 316, 240], ['g', 196, 150], ['g', 172, 392], ['r', 78, 262]];
  const L = leafSide(p, S, [588, 236], [606, 262]);
  return svg(p, 'One Sun. Left: air molecules redirect blue most, green less and red least, each in its own colour, so blue reaches an eye. Right: a leaf absorbs blue and red strongly and green less, so green reaches an eye.', `<g transform="translate(0 12)">
    ${T(24, 44, 'Air redirects', 'f2-h')}
    ${T(776, 44, 'Leaf absorbs', 'f2-h', 'end')}
    <path class="f2-div" d="M400,150V574"/>
    ${sun(S[0], S[1], 30)}
    ${airSide(p, S, M, rays)}
    ${T(196, 134, 'green: less', 'f2-s f2-cap-b', 'middle')}${T(24, 244, 'red: least', 'f2-s f2-cap-b')}
    ${T(230, 310, 'air molecule', 'f2-s')}${T(240, 392, 'blue: most', 'f2-s f2-cap-b')}
    ${eye(232, 484)}${T(232, 550, 'you see blue', 'f2-cap', 'middle')}
    ${L.svg}
    ${T(626, 176, 'blue: strongly', 'f2-s f2-cap-b')}${T(626, 204, 'red: strongly', 'f2-s f2-cap-b')}
    ${wv(p, 'g', 606, 300, 606, 448)}
    ${T(636, 384, 'green: less', 'f2-s f2-cap-b')}
    ${eye(606, 484)}${T(606, 550, 'you see green', 'f2-cap', 'middle')}
  </g>`);
}

/* ---------- m · Sun to eye: J's grid fed by one Sun, with the eyes as its last row ---------- */

function drawM(): string {
  const p = 'fl02m';
  const Y = [238, 338, 438], ax = 240, lx = 560, s = 0.72;
  const rows = ROWS.map((r, i) => {
    const y = Y[i];
    return `<path class="rule" d="M8,${y - 52}H792"/>${jName(p, r, 18, y)}
      ${jAir(p, r.c, ax, y, r.fan, 150, s)}${T(ax + 96, y + 8, r.air, 'f2-cap')}
      ${jLeaf(p, r.c, lx, y, 474)}${T(lx + 74, y + 8, r.lf, 'f2-cap')}`;
  }).join('');
  return svg(p, 'One Sun lights a grid of three colours against two kinds of matter. Air redirects blue most, green less and red least, each in its own colour; a leaf absorbs blue and red strongly and green less. The last row: an eye sees blue from the air and green from the leaf.', `
    ${sun(462, 44, 20)}
    ${beam(p, ['b', 'g', 'r'], 420, 54, 318, 84, 9, { amp: 4.5 })}${beam(p, ['b', 'g', 'r'], 504, 54, 606, 84, 9, { amp: 4.5 })}
    ${T(300, 128, 'air redirects it', 'fl02-head', 'middle')}${T(300, 160, 'same colour, new direction', 'f2-s', 'middle')}
    ${T(628, 128, 'leaf absorbs it', 'fl02-head', 'middle')}${T(628, 160, 'its energy is taken up', 'f2-s', 'middle')}
    <path class="rule" d="M462,104V488"/>
    ${rows}
    <path class="rule" d="M8,488H792"/>
    ${eye(196, 534)}${T(238, 542, 'you see blue', 'f2-cap f2-cap-b')}${T(238, 572, 'blue ≈ 4.4× more than red', 'fl02-mini')}
    ${eye(518, 534)}${T(560, 542, 'you see green', 'f2-cap f2-cap-b')}
  `);
}

/* ---------- n · Colour lanes: J's rows as three lanes of one beam, through air and then a leaf ---------- */

function drawN(): string {
  const p = 'fl02n';
  const S: Pt = [56, 290], ax = 250, lx = 590;
  // Red on top so the blue lane, scattered most, can send its light down to the eye without crossing the others.
  const lanes: Array<{ r: typeof ROWS[number]; y: number }> = [{ r: ROWS[2], y: 170 }, { r: ROWS[1], y: 285 }, { r: ROWS[0], y: 400 }];
  const fans: Record<Col, Pt[]> = { r: [[-26, 60]], g: [[-26, 60], [44, 56]], b: [[-20, 82], [44, 56], [62, -42]] };
  const body = lanes.map(({ r, y }) => {
    const u = unit(S[0], S[1], 140, y), a = along(S, u, 44);
    return `${wv(p, r.c, a[0], a[1], 140, y, { amp: 5, head: false })}${wv(p, r.c, 140, y, ax - 15, y, { amp: 5, head: false })}
      ${T(146, y - 18, r.name, 'f2-s f2-cap-b')}${T(146, y + 32, r.nm, 'fl02-mini')}
      ${fans[r.c].map(([dx, dy]) => wv(p, r.c, ax, y, ax + dx, y + dy, { amp: 4.5 })).join('')}
      ${wv(p, r.c, ax + 15, y, lx - 2, y, { amp: 5, head: false })}
      ${airMol(ax, y, 'N', 18, 12)}
      ${T(338, y - 18, r.air, 'f2-cap')}${T(444, y - 18, r.lf, 'f2-cap')}`;
  }).join('');
  return svg(p, 'Sunlight drawn as three colour lanes. Each lane first meets an air molecule: blue is redirected most, green less, red least, and every colour keeps its colour; blue reaches an eye. Then a leaf absorbs blue and red strongly and green less; green reaches a second eye.', `
    ${T(24, 44, 'Air redirects', 'f2-h')}
    ${T(776, 44, 'Leaf absorbs', 'f2-h', 'end')}
    <g transform="translate(0 -10)">
    <path class="f2-div" d="M420,112V590"/>
    ${sun(S[0], S[1], 26)}
    ${body}
    ${leaf(lx + 8, 285, 300, 100, 90)}
    ${glow(p, lx - 2, 170, 14)}${glow(p, lx - 2, 400, 14)}${glow(p, lx - 2, 285, 10)}
    ${wv(p, 'g', lx + 16, 296, 704, 486)}
    ${T(238, 238, 'still red', 'f2-s')}
    ${eye(226, 522)}${T(226, 584, 'you see blue', 'f2-cap', 'middle')}
    ${eye(712, 522)}${T(712, 584, 'you see green', 'f2-cap', 'middle')}
  </g>`);
}

/* ---------- o · Wave inset: A's scene around a close-up of one blue wave, redirected vs absorbed ---------- */

function drawO(): string {
  const p = 'fl02o';
  const S: Pt = [400, 84], M: Pt = [198, 246];
  const L = leafSide(p, S, [588, 236], [606, 262]);
  const x0 = 276, w = 248, y0 = 314, cxm = x0 + w / 2;
  const iy = [358, 494];
  return svg(p, 'One Sun. Left: air molecules redirect blue light to an eye. Right: a leaf absorbs blue and red and green reaches an eye. In the middle, a close-up of one blue wave: at an air molecule the same wave leaves in a new direction; in a leaf the wave ends and its energy is taken up.', `
    ${T(24, 44, 'Air redirects', 'f2-h')}
    ${T(776, 44, 'Leaf absorbs', 'f2-h', 'end')}
    <path class="f2-div" d="M400,150V${y0 - 14}"/>
    ${sun(S[0], S[1], 30)}
    ${airSide(p, S, M, [['b', 216, 444], ['b', 112, 162], ['r', 222, 154]])}
    ${airMol(310, 226, 'O', -30, 12)}${airMol(80, 262, 'N', 40, 12)}
    ${T(222, 300, 'air molecules', 'f2-s')}
    ${eye(220, 484)}${T(180, 492, 'you see blue', 'f2-cap', 'end')}
    ${L.svg}
    ${wv(p, 'g', 606, 300, 606, 448)}
    ${eye(606, 484)}${T(646, 492, 'you see green', 'f2-cap')}

    <rect class="fl02-cell" x="${x0}" y="${y0}" width="${w}" height="${584 - y0}" rx="16"/>
    ${T(x0 + 16, y0 + 22, 'close-up: one blue wave', 'fl02-mini')}
    ${wv(p, 'b', x0 + 20, iy[0], cxm - 14, iy[0], { amp: 5, head: false })}${wv(p, 'b', cxm, iy[0], x0 + w - 26, iy[0] + 30, { amp: 5 })}
    ${airMol(cxm, iy[0], 'N', 18, 12)}
    ${T(cxm, iy[0] + 54, 'same wave out,', 'f2-s', 'middle')}${T(cxm, iy[0] + 78, 'new direction', 'f2-s', 'middle')}
    <path class="rule" d="M${x0 + 16},${iy[0] + 94}H${x0 + w - 16}"/>
    ${wv(p, 'b', x0 + 20, iy[1], cxm - 2, iy[1], { amp: 5, head: false })}${leaf(cxm + 12, iy[1] + 4, 56, 24, 64)}${glow(p, cxm - 2, iy[1], 14)}
    ${T(cxm, iy[1] + 50, 'wave ends,', 'f2-s', 'middle')}${T(cxm, iy[1] + 74, 'energy taken up', 'f2-s', 'middle')}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = {
    a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ,
    k: drawK, l: drawL, m: drawM, n: drawN, o: drawO,
  };
  return (d[id] ?? drawA)();
}
