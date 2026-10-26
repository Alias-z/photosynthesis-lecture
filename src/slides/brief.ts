import { paper } from '../lib/canvas';
import { openingBrief as brief, openingContext } from '../planning/opening';
import type { Slide } from '../slide';

const escape = (value: string): string => value.replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

export const openingBriefSlide: Slide = {
  title: brief.title,
  kind: 'canvas',
  context: [openingContext],
  drawStatic: (c) => paper(c),
  overlay: () => `
    <h2 class="h2" style="left:92px;top:50px;width:1412px">${escape(brief.title)}</h2>
    <article class="brief-stack hit" aria-label="Slide brief">
      <section class="brief-box"><h3>Content</h3><p>${escape(brief.content)}</p></section>
      <section class="brief-box"><h3>Display prompt</h3><p>${escape(brief.display)}</p>
      </section>
    </article>
    <p class="brief-time" style="left:300px">Two lectures · 45 min each</p>`,
};
