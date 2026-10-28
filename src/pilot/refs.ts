// Reference boards: for a slide still to be redrawn, the scientific images collected as the direction for the drawing
// (paper figures, structures, micrographs, classic experiment graphs, canonical schematics). A board is a folder
// src/assets/refs/<board-id>/ with its images and a refs.json; a new folder shows after a reload, with no code change.
//   { "title": "…", "slides": ["6"], "images": [{ "id": "a", "file": "x.jpg", "kind": "structure",
//     "caption": "…", "credit": "Author et al. 2016, Journal 1:2, Fig. 2", "url": "https://doi.org/…", "note": "…" }] }
// "slides" (optional) names the pages the board is for, as page keys ('6', 'lead-1', 'C3'); SLIDE_REFS can add more.

/** What an image is; each card carries it as a tag. */
export const REF_KINDS = ['figure', 'structure', 'micrograph', 'schematic', 'photo', 'history'] as const;
export type RefKind = (typeof REF_KINDS)[number];

export interface RefImage {
  id: string;
  file: string;
  kind: RefKind;
  caption: string;
  credit: string;
  url?: string;
  note?: string;
  /** The file's URL in the build; empty when the file is not in the board's folder. */
  src: string;
}
export interface RefBoard {
  /** The folder name; picks and the note save under ref-<id>. */
  id: string;
  title: string;
  /** Page keys from the board's refs.json. */
  slides: string[];
  images: RefImage[];
}

/** Page key (as in plates.ts PAGES) → board ids, for boards whose refs.json does not name the page itself. */
export const SLIDE_REFS: Record<string, string[]> = {};

interface Manifest { title?: string; slides?: unknown; images?: Array<Partial<Omit<RefImage, 'src'>>> }

const manifests = import.meta.glob<Manifest>('../assets/refs/*/refs.json', { eager: true, import: 'default' });
const files = import.meta.glob<string>('../assets/refs/*/**/*.{jpg,jpeg,png,gif,webp,avif,svg,JPG,JPEG,PNG}', { eager: true, query: '?url', import: 'default' });

/** Boards in id order ('L2' before 'L10'). */
export const BOARDS: RefBoard[] = Object.entries(manifests).map(([path, m]): RefBoard => {
  const id = path.split('/')[3];
  return {
    id,
    title: m.title ?? id,
    slides: Array.isArray(m.slides) ? m.slides.map(String) : [],
    images: (m.images ?? []).map((im, i) => ({
      id: String(im.id ?? im.file ?? i + 1),
      file: im.file ?? '',
      kind: im.kind ?? 'figure',
      caption: im.caption ?? '',
      credit: im.credit ?? '',
      url: im.url,
      note: im.note,
      src: files[`../assets/refs/${id}/${im.file}`] ?? '',
    })),
  };
}).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

export const refBoard = (id: string): RefBoard | undefined => BOARDS.find(b => b.id === id);
/** The pick-store key of a board's picks (image ids) and note. */
export const refKey = (id: string): string => `ref-${id}`;

/** The boards for one page: those SLIDE_REFS names, then those whose refs.json lists the page. */
export function boardsFor(page: string): RefBoard[] {
  const ids = new Set([...(SLIDE_REFS[page] ?? []), ...BOARDS.filter(b => b.slides.includes(page)).map(b => b.id)]);
  return [...ids].flatMap(id => refBoard(id) ?? []);
}

/** The pages a board is for, from its refs.json and from SLIDE_REFS. */
export function pagesOf(b: RefBoard): string[] {
  return [...new Set([...b.slides, ...Object.keys(SLIDE_REFS).filter(k => SLIDE_REFS[k].includes(b.id))])];
}
