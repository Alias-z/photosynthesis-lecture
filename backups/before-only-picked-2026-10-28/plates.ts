// Static study pages for both lectures in the Figure-first layout, one module per slide in figs/.
// Slides 1–6 rest on confirmed context; later slides are checked drafts awaiting confirmation.
import * as l01 from './figs/l01';
import * as l02 from './figs/l02';
import * as l03 from './figs/l03';
import * as l04 from './figs/l04';
import * as l04a from './figs/l04a';
import * as l04b from './figs/l04b';
import * as l05 from './figs/l05';
import * as l06 from './figs/l06';
// Slide 7's figure is the light-reaction chain (figs/chain.ts); the earlier l07/l08 figures stay in figs/, unused.
import * as l07c from './figs/l07c';
import * as l08c from './figs/l08c';
import * as l09c from './figs/l09c';
import * as l10c from './figs/l10c';
import * as l11c from './figs/l11c';
import * as s08c from './figs/s08c';
import * as s09c from './figs/s09c';
import * as s10c from './figs/s10c';
import * as s11c from './figs/s11c';
import * as l09 from './figs/l09';
import * as l10 from './figs/l10';
import * as l11 from './figs/l11';
import * as l12 from './figs/l12';
import * as l13 from './figs/l13';
import * as l14 from './figs/l14';
import * as l15 from './figs/l15';
import * as c01 from './figs/c01';
import * as c02 from './figs/c02';
import * as c03 from './figs/c03';
import * as c04b from './figs/c04b';
import * as c05 from './figs/c05';
import * as c06 from './figs/c06';
import * as c11 from './figs/c11';
import * as c12 from './figs/c12';
// Text of the rebuilt slides 6–13 and C1–C9 (27 Oct 2026); their figures stay the earlier ones (see withFigures).
import * as s06 from './figs/s06';
import * as s07 from './figs/s07';
import * as s09 from './figs/s09';
import * as s10 from './figs/s10';
import * as s11 from './figs/s11';
import * as s12r from './figs/s12r';
import * as s13 from './figs/s13';
import * as s14 from './figs/s14';
import * as c09 from './figs/c09';
import * as c10 from './figs/c10';
import * as c12b from './figs/c12b';
import * as c08 from './figs/c08';
import * as c13 from './figs/c13';
import * as lead01 from './figs/lead01';
import * as lead02 from './figs/lead02';
import * as lead05 from './figs/lead05';
import * as k01 from './figs/k01';
import * as k02 from './figs/k02';
import * as k03 from './figs/k03';
import * as k04 from './figs/k04';
import * as k05 from './figs/k05';
import * as k06 from './figs/k06';
import * as k07 from './figs/k07';
import * as k09 from './figs/k09';
import * as k10 from './figs/k10';
import * as text2 from './text-c10';
// Overnight build of 28 Oct 2026 (research/redo-2026-10-28/OVERNIGHT_BRIEF.md): one prefix per chunk.
import * as pp11 from './figs/pp11';
import * as pp11f from './figs/pp11f';
import * as pp12 from './figs/pp12';
import * as pp12f from './figs/pp12f';
import * as pp13 from './figs/pp13';
import * as pp13f from './figs/pp13f';
import * as cb01 from './figs/cb01';
import * as cb02 from './figs/cb02';
import * as cb03 from './figs/cb03';
import * as cb04 from './figs/cb04';
import * as rf05 from './figs/rf05';
import * as rff05 from './figs/rff05';
import * as rf06 from './figs/rf06';
import * as rff06 from './figs/rff06';
import * as rf07 from './figs/rf07';
import * as rff07 from './figs/rff07';
import * as rf08 from './figs/rf08';
import * as rff08 from './figs/rff08';
import * as cp09 from './figs/cp09';
import * as cp10 from './figs/cp10';
import * as cc11 from './figs/cc11';
import * as cc12 from './figs/cc12';
import * as cc13 from './figs/cc13';
import * as cr14 from './figs/cr14';
import * as cr15 from './figs/cr15';
import { ANIMATIONS } from './anim';
import type { Plate, PlateText, Variant } from './types';

interface Slide { PLATE: PlateText; VARIANTS: Variant[]; draw: (variant: string) => string }
const plate = (m: Slide, over: Partial<PlateText> = {}): Plate => ({ ...m.PLATE, ...over, variants: m.VARIANTS, figure: m.draw });
/** The approved text of a rebuilt slide over the earlier figures, which the lecturer kept (27 Oct 2026). */
const withFigures = (text: Slide, fig: Slide): Slide =>
  ({ PLATE: { ...text.PLATE, refs: fig.PLATE.refs, play: fig.PLATE.play }, VARIANTS: fig.VARIANTS, draw: fig.draw });
/** Two earlier figure sets on one slide; the second set's ids carry a prefix so both stay distinct. */
const joinFigures = (a: Slide, b: Slide, prefix: string): Slide => ({
  PLATE: { ...a.PLATE, refs: [...a.PLATE.refs, ...b.PLATE.refs].filter((r, i, all) => all.findIndex(x => x.label === r.label) === i) },
  VARIANTS: [...a.VARIANTS, ...b.VARIANTS.map(v => ({ ...v, id: prefix + v.id }))],
  draw: id => (id.startsWith(prefix) ? b.draw(id.slice(prefix.length)) : a.draw(id)),
});

// Light block order of 26 Oct 2026 (research/figure-briefs/ORDER_PROPOSAL.md v5): slide 2 is its lead page alone,
// and its study page ("Redirect vs remove") answers the lead as the summary 5b, after the pigments. Slide 4b
// (excitation) follows the photon slide. 27 Oct 2026: excitation comes before "Where light is captured" (lecturer); the
// page numbers follow the order. Later the same day the pigments slide moved before the location slide:
// 4 photon, 4a excitation, 4b pigments, 5 where light is captured. Slide 2 has its lead page (lecture) and its study
// page (handout) again; the separate summary 5b is gone.
export const PLATES: Plate[] = [
  plate(l01), plate(l02, { play: 'sky' }), plate(l03), plate(l04), plate(l04b, { n: '4a' }), plate(l05, { n: '4b' }), plate(l04a, { n: '5', play: 'leaf' }),
  ...[
    withFigures(s06, { ...l06, PLATE: { ...l06.PLATE, play: 'antenna' } }), withFigures(s07, { ...l07c, PLATE: { ...l07c.PLATE, play: 'psii' } }), withFigures(s08c, { ...l08c, PLATE: { ...l08c.PLATE, refs: s08c.PLATE.refs, play: 'b6f' } }), withFigures(s09c, { ...l09c, PLATE: { ...l09c.PLATE, refs: s09c.PLATE.refs, play: 'psi' } }),
    withFigures(s10c, { ...l10c, PLATE: { ...l10c.PLATE, refs: s10c.PLATE.refs, play: 'atps' } }), withFigures(s11c, { ...l11c, PLATE: { ...l11c.PLATE, refs: s11c.PLATE.refs, play: 'cyclic' } }),
    // The earlier slide 10 "ATP and NADPH supply", restored with the lecturer's picks (k, l) after the chain rebuild had
    // dropped it (28 Oct 2026); it keeps pick key 10.
    { ...withFigures(s11, l11), PLATE: { ...withFigures(s11, l11).PLATE, n: '10c', pick: '10' } }, withFigures(pp11, pp11f), withFigures(pp12, pp12f), withFigures(pp13, pp13f),
    { ...cb01, PLATE: { ...cb01.PLATE, play: 'cb1' } }, { ...cb02, PLATE: { ...cb02.PLATE, play: 'cb2' } },
    { ...cb03, PLATE: { ...cb03.PLATE, play: 'cb3' } }, { ...cb04, PLATE: { ...cb04.PLATE, play: 'cb4' } }, withFigures(rf05, { ...rff05, PLATE: { ...rff05.PLATE, play: 'rf5' } }),
    withFigures(rf06, { ...rff06, PLATE: { ...rff06.PLATE, play: 'rf6' } }),
  ].map(m => plate(m)),
  // Lecture 2 order A (lecturer, 28 Oct 2026): Rubisco's two reactions through FvCB (C5–C8), the CO₂ path into the
  // chloroplast (C9–C10), C₃ → C₂ → C₄ and CAM (C11–C13), crops (C14–C15). Each moved slide keeps its old number as
  // its pick key. C10 is kept for the new CO₂-path slide.
  plate(withFigures(rf07, { ...rff07, PLATE: { ...rff07.PLATE, play: 'rf7' } }), { n: 'C7', pick: 'C8' }),
  plate(withFigures(rf08, { ...rff08, PLATE: { ...rff08.PLATE, play: 'rf8' } }), { n: 'C8', pick: 'C9' }),
  plate(cp09, { play: 'cp9' }), plate(cp10, { play: 'cp10' }),
  plate(cc11, { play: 'cc11' }), plate(cc12, { play: 'cc12' }), plate(cc13, { play: 'cc13' }),
  plate(cr14, { play: 'cr14' }), plate(cr15, { play: 'cr15' }),
];

/** Lead pages for the live lecture, by slide number: the question alone, before the animation that answers it. */
export const LEADS: Record<string, { VARIANTS: Variant[]; draw: (variant: string) => string }> = { '1': lead01, '2': lead02, '5': lead05 };

/** One page of the pilot: a study page, or a slide's lead page, which comes first and is picked as `lead-<n>`. */
export interface Page {
  key: string;
  kind: 'lead' | 'study';
  plate: Plate;
  variants: Variant[];
  html: (variant: string) => string;
  figure: (variant: string) => string;
}

export const PAGES: Page[] = PLATES.flatMap(p => {
  const study: Page = { key: p.pick ?? p.n, kind: 'study', plate: p, variants: p.variants, html: v => plateHtml(p, v), figure: p.figure };
  const lead = LEADS[p.n];
  if (!lead) return [study];
  if (p.leadOnly) return [{ key: `lead-${p.n}`, kind: 'lead', plate: p, variants: lead.VARIANTS, html: v => leadHtml(p, lead.draw(v)), figure: lead.draw }];
  return [{ key: `lead-${p.n}`, kind: 'lead', plate: p, variants: lead.VARIANTS, html: v => leadHtml(p, lead.draw(v)), figure: lead.draw }, study];
});

/** The serif face has no subscript digits, so CO₂ and friends are set with real subscripts. */
const subscripts = (s: string): string => s.replace(/[₀-₉]/g, d => `<sub>${d.charCodeAt(0) - 0x2080}</sub>`);

/** The page title, unless the variant's figure names the topic itself and takes the space instead. */
const noTitle = (p: Plate, variant: string): boolean => p.variants.find(v => v.id === variant)?.noTitle ?? false;
const title = (p: Plate, variant: string): string => (noTitle(p, variant) ? '' : `<h1 class="p-title">${subscripts(p.title)}</h1>`);
/** Each line of a point is one fact: it gets its own block, so a new fact reads apart from a wrapped line. */
const lines = (s: string): string => s.split(/<br\s*\/?>/).map(l => `<span class="p-line">${l.trim()}</span>`).join('');
/** A claim stands alone like a small heading, so it drops its full stop. */
const claim = (c: string): string => c.replace(/\.$/, '');
const sources = (p: Plate): string => p.refs.map(r => `<a href="${r.url}" target="_blank" rel="noopener">${r.label}</a>`).join('<span>·</span>');
const animButton = (p: Plate): string =>
  (p.animation ? `<button type="button" class="p-play" data-play-excitation aria-label="Play the animation: ${p.animation}">▶</button>` : '');
/** The play button of a slide that leads into one of the light-block animations. */
const playButton = (p: Plate): string => {
  const a = ANIMATIONS.find(x => x.key === p.play);
  return a ? `<button type="button" class="p-play" data-play="${a.key}" aria-label="Play the animation: ${a.title}">▶</button>` : '';
};

/** Handout version, which the PDF keeps: the figure with the lead and the three points; no animation buttons. */
export function plateHtml(p: Plate, variant: string): string {
  const points = p.points.map(q => `<li><b>${claim(q.claim)}</b>${lines(q.text)}</li>`).join('');
  return `<div class="plate-inner${noTitle(p, variant) ? ' no-title' : ''}">
    ${title(p, variant)}
    <div class="p-text"><p class="p-lead">${subscripts(p.lead)}</p><ol class="p-points">${points}</ol></div>
    <figure class="fig">${p.figure(variant)}</figure>
    <p class="p-src">${sources(p)}</p>
    <span class="p-num">${p.n}</span>
  </div>`;
}

/** Lecture version, shown live: the handout page itself plus the play button of the animation that follows the slide
 *  (the lecturer's rule of 26 Oct 2026: without a lead page, lecture and handout differ only by that button). */
export function lectureHtml(p: Plate, variant: string): string {
  return plateHtml(p, variant).replace(/<span class="p-num">/, `${animButton(p)}${playButton(p)}<span class="p-num">`);
}

/** A lead page is one full-page drawing on the paper: no reading column and no sources line; a play button if the
 *  slide leads into an animation. */
export function leadHtml(p: Plate, svg: string): string {
  return `<div class="plate-inner"><figure class="lead-fig">${svg}</figure>${playButton(p)}<span class="p-num">${p.n}</span></div>`;
}

/** Fits a page's text once the fonts have loaded: a title wider than its box shrinks, a reading column taller than its box tightens. */
export function fitPage(root: ParentNode): void {
  void Promise.all([document.fonts.load('400 66px Newsreader'), document.fonts.load('400 23px Inter')]).then(() => {
    root.querySelectorAll<HTMLElement>('.p-title').forEach(t => {
      t.style.fontSize = '';
      if (t.scrollWidth > t.clientWidth) t.style.fontSize = `${parseFloat(getComputedStyle(t).fontSize) * t.clientWidth / t.scrollWidth}px`;
    });
    // A reading column longer than its box first loses spacing, then type size (pilot.css .tight-1 to .tight-3).
    root.querySelectorAll<HTMLElement>('.lay-figure .p-text').forEach(t => {
      t.classList.remove('tight-1', 'tight-2', 'tight-3');
      for (const c of ['tight-1', 'tight-2', 'tight-3']) if (t.scrollHeight > t.clientHeight) t.classList.add(c);
    });
  });
}
