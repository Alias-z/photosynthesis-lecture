// A text brief with discussion explanations and papers in the Context panel.
import { paper } from '../lib/canvas';
import { pigmentsBrief as brief, pigmentsContext } from '../planning/pigments';
import { lightHarvestingContext } from '../planning/lightHarvesting';
import type { Slide } from '../slide';

const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

export const pigmentsBriefSlide: Slide = {
  title: brief.title,
  kind: 'canvas',
  context: [pigmentsContext, lightHarvestingContext],
  drawStatic: c => paper(c),
  overlay: () => `
    <h2 class="h2" style="left:92px;top:50px;width:1412px">${escape(brief.title)}</h2>
    <article class="brief-stack hit" aria-label="Slide brief">
      <section class="brief-box"><h3>Content</h3><p><strong>${escape(brief.takeaway)}</strong> ${escape(brief.content)}</p></section>
      <section class="brief-box"><h3>Display prompt</h3><p>${escape(brief.display)}</p></section>
    </article>`,
};
