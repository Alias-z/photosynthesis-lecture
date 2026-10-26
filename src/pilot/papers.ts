// Paper textures for the static pages, drawn as tileable SVG and multiplied onto a base colour.
// Each texture is subtle enough to print cleanly and to keep text and figures crisp.

export type Paper = 'bristol' | 'plate' | 'vellum' | 'warm' | 'cool';

export const PAPERS: Array<{ id: Paper; name: string; note: string; base: string }> = [
  { id: 'bristol', name: 'Bristol', note: 'Bright, smooth board with the finest grain.', base: '#fcfbf8' },
  { id: 'plate', name: 'Plate finish', note: 'Bristol with an even smoother, almost glassy surface.', base: '#fdfcfa' },
  { id: 'vellum', name: 'Vellum finish', note: 'Bristol with a touch more tooth.', base: '#fbfaf6' },
  { id: 'warm', name: 'Warm Bristol', note: 'The Bristol grain on a slightly warmer white.', base: '#fcf9f2' },
  { id: 'cool', name: 'Cool Bristol', note: 'The Bristol grain on a crisp, neutral white.', base: '#fafaf8' },
];

const tile = (body: string, size = 420): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`)}")`;

/** Raised surface lit from the upper left. */
const relief = (id: string, freq: string, octaves: number, scale: number, opacity: number): string =>
  `<filter id='${id}' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' stitchTiles='stitch' seed='7'/>` +
  `<feDiffuseLighting lighting-color='#ffffff' surfaceScale='${scale}'><feDistantLight azimuth='225' elevation='58'/></feDiffuseLighting></filter>` +
  `<rect width='100%' height='100%' filter='url(#${id})' opacity='${opacity}'/>`;

const BRISTOL = tile(relief('r', '0.9', 2, 0.6, 0.12));

const TEXTURES: Record<Paper, string> = {
  bristol: BRISTOL,
  plate: tile(relief('r', '1.1', 2, 0.5, 0.07)),
  vellum: tile(relief('r', '0.75', 2, 0.7, 0.16)),
  warm: BRISTOL,
  cool: BRISTOL,
};

/** Publishes each texture and base colour as CSS custom properties on the page. */
export function installPapers(root: HTMLElement): void {
  for (const p of PAPERS) {
    root.style.setProperty(`--paper-${p.id}`, TEXTURES[p.id]);
    root.style.setProperty(`--paper-${p.id}-base`, p.base);
  }
}
