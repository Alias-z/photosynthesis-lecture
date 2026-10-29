// Slide C9 · Measuring leaf gas exchange, figure ir (lecturer: "an illustration in our style of how CO₂ and
// water absorb differently in the infrared; only that"). Facts used, and no others:
// - spectra: NIST Chemistry WebBook (SRD 69), gas-phase infrared absorbance from Sadtler Research Labs under US-EPA contract,
//   carbon dioxide C124389 and water C7732185 (JCAMP-DX, Index 0, 4 cm⁻¹ steps), cut to 2.5–8 µm (1250–4000 cm⁻¹) and each
//   divided by its own maximum there (assets/c09-ir-spectra.ts, made by scratchpad c09-ir-scripts/jdx2ts.py).
// - bands: CO₂ asymmetric stretch at 2349 cm⁻¹ (4.26 µm); H₂O stretches at 3657 and 3756 cm⁻¹ (≈ 2.7 µm) and bend at 1595 cm⁻¹
//   (6.3 µm). In the data the CO₂ band peaks at 4.24 and 4.26–4.33 µm (R and P branches); H₂O spans 2.52–2.87 and 5.2–7.6 µm.
// - analyser windows: the LI-COR LI-6800 manual (Specifications and Introduction, read 29 Oct 2026) calls its CO₂ and H₂O
//   analysers absolute non-dispersive infrared gas analysers in the sensor head and states no wavelengths or filter widths. The
//   windows are drawn at 4.26 µm (CO₂, its band in the data) and ≈ 2.6 µm (H₂O, at 2.595), 0.1 µm wide as a sign of "narrow
//   band", not to scale.
import { CO2, H2O } from '../../assets/c09-ir-spectra';
import { co2, credit, f, h2o, svg, T, TV } from './cp-kit';

const P = 'cp09ir';
const INK = '#3d3d3a', RUST = '#a2461f', BLUE = '#2f62a3';
// plot frame: wavelength 2.5–8 µm on x, normalised absorbance 0–1 on y
const X0 = 96, X1 = 770, L0 = 2.5, L1 = 8, YT = 168, YB = 372;
const X = (lam: number): number => X0 + (lam - L0) / (L1 - L0) * (X1 - X0);
const Y = (a: number): number => YB - a * (YB - YT);

/** One spectrum as a thin line over a faint wash of its own colour. */
function spectrum(s: { x0: number; dx: number; y: number[] }, col: string): string {
  const pts = s.y.map((a, i) => [X(1e4 / (s.x0 + i * s.dx)), Y(a)] as const).filter(([x]) => x >= X0 - 0.01 && x <= X1 + 0.01);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('');
  const first = pts[0], last = pts[pts.length - 1];
  return `<path d="${line}L${f(last[0])},${YB}L${f(first[0])},${YB}Z" fill="${col}" fill-opacity="0.1" stroke="none"/>`
    + `<path d="${line}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/>`;
}

/** A thin ink arrow (vibration of an atom). */
const vib = (d: string): string =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" marker-end="url(#${P}-ink)"/>`;

/** CO₂ asymmetric stretch: the two O move one way, the C the other. */
function co2Stretch(x: number, y: number, r: number): string {
  const d = r * 1.55, ya = y - r - 9;
  return co2(x, y, r) + vib(`M${f(x - d + 7)},${f(ya)}H${f(x - d - 7)}`) + vib(`M${f(x - 7)},${f(ya)}H${f(x + 7)}`)
    + vib(`M${f(x + d + 7)},${f(ya)}H${f(x + d - 7)}`);
}

/** H₂O with its H atoms (cp-kit h2o: at ±0.95 r, +0.7 r, radius 0.55 r) stretching out along the bonds, or bending. */
function water(x: number, y: number, r: number, mode: 'stretch' | 'bend'): string {
  const hx = r * 0.95, hy = r * 0.7, bl = Math.hypot(hx, hy), ux = hx / bl, uy = hy / bl;
  let arrows = '';
  if (mode === 'stretch') {
    const a = bl + r * 0.55 + 3, b = a + 12;
    arrows = [-1, 1].map(s => vib(`M${f(x + s * ux * a)},${f(y + uy * a)}L${f(x + s * ux * b)},${f(y + uy * b)}`)).join('');
  } else {
    // scissoring: each H swings toward the other, an arc about the O just outside the H atom
    const R = bl + r * 0.55 + 5, t0 = Math.atan2(hy, hx), t1 = t0 + 0.5;
    arrows = [-1, 1].map(s => {
      const p = (t: number): string => `${f(x + s * R * Math.cos(t))},${f(y + R * Math.sin(t))}`;
      return vib(`M${p(t0 - 0.2)}A${f(R)},${f(R)} 0 0 ${s > 0 ? 1 : 0} ${p(t1)}`);
    }).join('');
  }
  return h2o(x, y, r) + arrows;
}

/** Band label above the spectrum: molecule, wavelength, vibration; a dashed guide down to the band. */
function band(x: number, glyph: string, lam: string, mode: string, to: [number, number]): string {
  return `${glyph}${T(x, 116, lam, 'fcp-h', 'middle')}${T(x, 140, mode, 'fcp-s', 'middle')}
    <path class="fcp-dash" d="M${f(x)},148 L${f(to[0])},${f(to[1])}"/>`;
}

/** The analyser's narrow filter window, shaded across the plot. */
const win = (lam: number): string =>
  `<rect x="${f(X(lam - 0.05))}" y="${YT - 8}" width="${f(X(lam + 0.05) - X(lam - 0.05))}" height="${YB - YT + 8}" fill="${INK}" fill-opacity="0.13" stroke="${INK}" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="3 3"/>`;

/** The IRGA in one line: infrared source → gas cell with CO₂ → filter → detector. */
function irga(): string {
  const y = 500;
  const mols = [205, 260, 315, 370].map((x, i) => co2(x, y + (i % 2 ? 9 : -9), 8)).join('');
  return `${T(110, 462, 'infrared source', 'fcp-s', 'middle')}${T(285, 462, 'gas cell', 'fcp-s', 'middle')}
    ${T(426, 462, 'filter', 'fcp-s', 'middle')}${T(508, 462, 'detector', 'fcp-s', 'middle')}
    <circle class="fcp-lamp" cx="110" cy="${y}" r="18"/>
    <path class="fcp-ir" d="M134,${y} H170"/><path class="fcp-ir" d="M400,${y} H420"/><path class="fcp-ir" d="M432,${y} H482" style="opacity:.45"/>
    <rect class="fcp-box-t" x="170" y="${y - 24}" width="230" height="48" rx="10"/>${mols}
    <rect x="420" y="${y - 28}" width="12" height="56" rx="2" fill="${INK}" fill-opacity="0.13" stroke="${INK}" stroke-width="1.4"/>
    <rect class="fcp-box" x="482" y="${y - 22}" width="52" height="44" rx="8"/>
    ${T(400, 556, 'more CO₂ → less infrared reaches the detector', 'fcp-l', 'middle')}`;
}

export function draw(): string {
  const ticks = [3, 4, 5, 6, 7, 8].map(l => `<path class="fcp-axis" d="M${f(X(l))},${YB} v7"/>${T(X(l), YB + 28, `${l}`, 'fcp-ax', 'middle')}`).join('')
    + `<path class="fcp-axis" d="M${X0},${YB} v7"/>${T(X0, YB + 28, '2.5', 'fcp-ax', 'middle')}`;
  const grid = [0.5, 1].map(a => `<path class="fcp-grid" d="M${X0},${f(Y(a))} H${X1}"/>`).join('');
  const key = (x: number, col: string, s: string): string =>
    `<path d="M${x},20 h28" stroke="${col}" stroke-width="2.4" stroke-linecap="round"/>${T(x + 36, 27, s, 'fcp-l')}`;
  const legend = key(X0, RUST, 'CO₂') + key(X0 + 100, BLUE, 'H₂O')
    + `<rect x="${X0 + 204}" y="11" width="12" height="20" fill="${INK}" fill-opacity="0.13" stroke="${INK}" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="3 3"/>${T(X0 + 224, 27, 'IRGA filter', 'fcp-l')}`
    + T(X1, 27, 'each scaled to its own peak', 'fcp-s', 'end');
  return svg(P, 'Measured infrared absorption of carbon dioxide and water vapour from 2.5 to 8 micrometres, each scaled to its own peak. Carbon dioxide absorbs in one narrow band at 4.26 micrometres, where its molecule stretches asymmetrically. Water vapour absorbs near 2.7 micrometres, where its bonds stretch, and from about 5 to 7.6 micrometres around 6.3, where it bends. The infrared gas analyser reads carbon dioxide through a narrow filter at 4.26 micrometres and water vapour through one at 2.595 micrometres; at each filter only one of the two gases absorbs. Below, the analyser in one line: infrared source, gas cell, filter, detector; more carbon dioxide means less infrared reaches the detector.', `
    ${legend}
    ${grid}${win(2.595)}${win(4.26)}
    ${spectrum(H2O, BLUE)}${spectrum(CO2, RUST)}
    <path class="fcp-axis" d="M${X0},${YB} H${X1}"/>${ticks}
    ${T((X0 + X1) / 2, YB + 54, 'wavelength (µm)', 'fcp-ax', 'middle')}
    ${TV(54, (YT + YB) / 2, 'absorbance', 'fcp-ax')}
    ${band(160, water(160, 62, 13, 'stretch'), '2.7 µm', 'stretch', [X(2.7), YT - 10])}
    ${band(X(4.26), co2Stretch(X(4.26), 76, 14), '4.26 µm', 'asymmetric stretch', [X(4.26), YT - 10])}
    ${band(X(6.27), water(X(6.27), 62, 13, 'bend'), '6.3 µm', 'bend', [X(6.27), YT - 10])}
    ${irga()}
    ${credit(780, 594, 'spectra: NIST Chemistry WebBook, gas phase (Sadtler/EPA) · filter wavelengths: LI-COR LI-840A manual')}
  `);
}
