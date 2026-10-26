// Static study pages for both lectures in the Figure-first layout, one module per slide in figs/.
// Slides 1–6 rest on confirmed context; later slides are checked drafts awaiting confirmation.
import * as l01 from './figs/l01';
import * as l02 from './figs/l02';
import * as l03 from './figs/l03';
import * as l04 from './figs/l04';
import * as l04b from './figs/l04b';
import * as l05 from './figs/l05';
import * as l06 from './figs/l06';
import * as l07 from './figs/l07';
import * as l08 from './figs/l08';
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
import * as c04 from './figs/c04';
import * as c04b from './figs/c04b';
import * as c05 from './figs/c05';
import * as c06 from './figs/c06';
import * as c07 from './figs/c07';
import * as c08 from './figs/c08';
import * as c09 from './figs/c09';
import * as c10 from './figs/c10';
import * as c11 from './figs/c11';
import * as c12 from './figs/c12';
import * as c13 from './figs/c13';
import * as lead01 from './figs/lead01';
import * as lead02 from './figs/lead02';
import { ANIMATIONS } from './anim';
import type { Plate, PlateText, Variant } from './types';

interface Slide { PLATE: PlateText; VARIANTS: Variant[]; draw: (variant: string) => string }
const plate = (m: Slide, over: Partial<PlateText> = {}): Plate => ({ ...m.PLATE, ...over, variants: m.VARIANTS, figure: m.draw });

// Light block order of 26 Oct 2026 (research/figure-briefs/ORDER_PROPOSAL.md v5): slide 2 is its lead page alone,
// and its study page ("Redirect vs remove") answers the lead as the summary 5b, after the pigments. Slide 4b
// (excitation) follows the photon slide.
export const PLATES: Plate[] = [
  plate(l01), plate(l02, { leadOnly: true, play: 'sky' }), plate(l03), plate(l04), plate(l04b), plate(l05), plate(l02, { n: '5b' }),
  ...[l06, l07, l08, l09, l10, l11, l12, l13, l14, l15, c01, c02, c03, c04, c04b, c05, c06, c07, c08, c09, c10, c11, c12, c13].map(m => plate(m)),
];

/** Lead pages for the live lecture, by slide number: the question alone, before the animation that answers it. */
export const LEADS: Record<string, { VARIANTS: Variant[]; draw: (variant: string) => string }> = { '1': lead01, '2': lead02 };

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
  const study: Page = { key: p.n, kind: 'study', plate: p, variants: p.variants, html: v => plateHtml(p, v), figure: p.figure };
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
/** A claim stands alone like a small heading, so it drops its full stop. */
const claim = (c: string): string => c.replace(/\.$/, '');
const sources = (p: Plate): string => p.refs.map(r => `<a href="${r.url}" target="_blank" rel="noopener">${r.label}</a>`).join('<span>·</span>');
const animButton = (p: Plate): string => (p.animation ? `<button type="button" class="p-anim" data-anim>${p.animation}</button>` : '');
/** The play button of a slide that leads into one of the light-block animations. */
const playButton = (p: Plate): string => {
  const a = ANIMATIONS.find(x => x.key === p.play);
  return a ? `<button type="button" class="p-play" data-play="${a.key}">▶ ${a.title}</button>` : '';
};

/** Handout version, which the PDF keeps: the figure with the lead and the three points; no animation buttons. */
export function plateHtml(p: Plate, variant: string): string {
  const points = p.points.map(q => `<li><b>${claim(q.claim)}</b> ${q.text}</li>`).join('');
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

/** Shrinks a title that is wider than its box (a few long draft titles), once the serif face has loaded. */
export function fitTitles(root: ParentNode): void {
  void document.fonts.load('400 66px Newsreader').then(() => root.querySelectorAll<HTMLElement>('.p-title').forEach(t => {
    t.style.fontSize = '';
    if (t.scrollWidth > t.clientWidth) t.style.fontSize = `${parseFloat(getComputedStyle(t).fontSize) * t.clientWidth / t.scrollWidth}px`;
  }));
}
