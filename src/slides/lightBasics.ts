// The selected slide 3 is a brief. The original animation remains in wavelengths.ts.
import { paper } from '../lib/canvas';
import { lightBasicsBrief as brief, lightBasicsContext } from '../planning/lightBasics';
import { wavelengthsSlide } from './wavelengths';
import type { Slide } from '../slide';

const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

export const lightBasicsBriefSlide: Slide = {
  title: brief.title,
  kind: 'canvas',
  context: [lightBasicsContext],
  backup: wavelengthsSlide,
  drawStatic: c => paper(c),
  overlay: () => `
    <h2 class="h2" style="left:92px;top:50px;width:1412px">${escape(brief.title)}</h2>
    <article class="brief-stack hit" aria-label="Slide brief">
      <section class="brief-box"><h3>Content</h3><p>${escape(brief.content)}</p></section>
      <section class="brief-box"><h3>Display prompt</h3><p>${escape(brief.display)}</p></section>
    </article>`,
};
