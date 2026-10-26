// A newspaper clipping for the history of an idea: a scissor-cut piece of newsprint with a halftone portrait, the
// name, the year with the finding, and what the finding's symbols mean. Shared by the animations and the slides (Rayleigh on the wave slide, Einstein on
// the particle slide). The portraits are public domain, restyled by scripts/halftone.py (sources in assets/SOURCES.md).
import './clipping.css';
import einstein from '../../assets/portraits/einstein.png';
import einstein1951 from '../../assets/portraits/einstein-1951.png';
import rayleigh from '../../assets/portraits/rayleigh.png';
import rayleighWink from '../../assets/portraits/rayleigh-wink.png';

/** `finding` and `key` are SVG text content, so they may hold a tspan; `key` defines the finding's symbols. `alt` is
 *  the playful frame the animations switch to: Rayleigh winking (painted into his photo by scripts/paint_faces.py) and
 *  Einstein's famous 1951 tongue photograph (public domain). Both are halftoned like the portraits. */
export interface Clip { name: string; year: string; finding: string; key: string; photo: string; alt: string }

export const RAYLEIGH_CLIP: Clip = { name: 'Lord Rayleigh', year: '1871', finding: 'scattering <tspan class="clip-prop">∝</tspan> 1/λ⁴', key: 'λ: wavelength', photo: rayleigh, alt: rayleighWink };
export const EINSTEIN_CLIP: Clip = { name: 'Albert Einstein', year: '1905', finding: 'E = hc/λ', key: 'h: Planck constant · c: speed of light', photo: einstein, alt: einstein1951 };
/** The slides' clippings: name, year and finding only; the page text defines the symbols, so the key would repeat it. */
export const RAYLEIGH_SLIDE: Clip = { ...RAYLEIGH_CLIP, key: '' };
export const EINSTEIN_SLIDE: Clip = { ...EINSTEIN_CLIP, key: '' };
/** Einstein as a teaser before his slide: his 1951 tongue photograph from the start (no cross-fade, at the lecturer's
 *  request) and his name only, so the animation does not give the answer. */
export const EINSTEIN_TEASER: Clip = { ...EINSTEIN_CLIP, photo: einstein1951, alt: einstein1951, year: '', finding: '', key: '' };

const f = (v: number): string => v.toFixed(1);

/** Small deterministic random numbers, so a clipping's cut edge looks the same on every load. */
function rng(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

/** A rectangle with slightly irregular, scissor-cut edges. */
function cutPath(x: number, y: number, w: number, h: number, seed: number): string {
  const r = rng(seed), pts: Array<[number, number]> = [];
  const edge = (x0: number, y0: number, x1: number, y1: number): void => {
    const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 14)), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny);
    for (let i = 0; i < n; i++) { const t = i / n, o = (r() - 0.5) * 3.6; pts.push([x0 + (x1 - x0) * t + (nx / L) * o, y0 + (y1 - y0) * t + (ny / L) * o]); }
  };
  edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
  return `M${pts.map(q => `${f(q[0])},${f(q[1])}`).join('L')}Z`;
}

/** Cross-fades every clipping inside `scope` to its playful portrait: `k` runs 0 (as printed) to 1 (eye shut,
 *  tongue out). */
export function clipFx(scope: ParentNode, k: number): void {
  const v = Math.max(0, Math.min(1, k)).toFixed(3);
  scope.querySelectorAll<SVGImageElement>('.clip-alt').forEach(img => { img.style.opacity = v; });
}

/** Height of clipping `c` drawn `w` wide (Rayleigh's if not given); each symbol of its key gets a line, and a clipping
 *  with no year or finding (the teaser) drops that line. */
const keyLines = (c: Clip): string[] => (c.key ? c.key.split(' · ') : []);
export const clipHeight = (w: number, c: Clip = RAYLEIGH_CLIP): number =>
  w * (1.52 + 0.11 * keyLines(c).length - (c.year || c.finding ? 0 : 0.13));

/** The clipping with its top-left corner at (x, y), `w` wide and tilted by `rot` degrees; `p` prefixes its ids. */
export function clipping(p: string, x: number, y: number, w: number, c: Clip, rot = -2, seed = 7): string {
  const h = clipHeight(w, c), m = w * 0.07, pw = w - 2 * m, ph = pw * 1.25;
  const nameY = y + m + ph + w * 0.14, findY = nameY + w * 0.13;
  return `<g class="clip" transform="rotate(${rot} ${f(x + w / 2)} ${f(y + h / 2)})">
    <defs><filter id="${p}-clipsh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, seed)}" filter="url(#${p}-clipsh)"/>
    <image href="${c.photo}" x="${f(x + m)}" y="${f(y + m)}" width="${f(pw)}" height="${f(ph)}" preserveAspectRatio="xMidYMid slice"/>
    <image class="clip-alt" href="${c.alt}" x="${f(x + m)}" y="${f(y + m)}" width="${f(pw)}" height="${f(ph)}" preserveAspectRatio="xMidYMid slice" style="opacity:0"/>
    <text class="clip-name" x="${f(x + w / 2)}" y="${f(nameY)}" text-anchor="middle" font-size="${f(w * 0.1)}">${c.name}</text>
    <text class="clip-find" x="${f(x + w / 2)}" y="${f(findY)}" text-anchor="middle" font-size="${f(w * 0.095)}">${[c.year, c.finding].filter(Boolean).join(' · ')}</text>
    ${keyLines(c).map((k, i) => `<text class="clip-key" x="${f(x + w / 2)}" y="${f(findY + w * (0.12 + 0.11 * i))}" text-anchor="middle" font-size="${f(w * 0.092)}">${k}</text>`).join('')}
  </g>`;
}
