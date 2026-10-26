// Slide 4 is a content/display brief. The original animation stays in Backup.
import { paper } from '../lib/canvas';
import { photonScatteringBrief as brief, photonScatteringContext } from '../planning/photonScattering';
import type { Slide } from '../slide';
import { scatteringSlide } from './scattering';

const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

export const scatteringReviewSlide: Slide = {
  title: brief.title,
  kind: 'canvas',
  animation: 'sky',
  context: [photonScatteringContext],
  // Keep the Return button above the original figure, clear of its footer caption.
  backup: { ...scatteringSlide, backupButtonTop: 148 },
  drawStatic: c => paper(c),
  overlay: () => `
    <h2 class="h2" style="left:92px;top:50px;width:1412px">${escape(brief.title)}</h2>
    <article class="brief-stack hit" aria-label="Slide brief">
      <section class="brief-box"><h3>Content</h3><p>${escape(brief.content)}</p></section>
      <section class="brief-box"><h3>Display prompt</h3><p>${escape(brief.display)}</p></section>
    </article>`,
};
