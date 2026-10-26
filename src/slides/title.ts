// The selected light-section opening is a content/display brief for Claude.
import { paper } from '../lib/canvas';
import { skyLeafBrief as brief, skyLeafContext } from '../planning/skyLeaf';
import type { Slide } from '../slide';

const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);

export const titleSlide: Slide = {
  title: brief.title,
  kind: 'canvas',
  context: [skyLeafContext],
  drawStatic(c) {
    paper(c);
  },
  overlay: () => `
    <h1 class="h1" style="left:92px;top:50px;width:1412px">Why is the sky <i>blue</i>,<br>and why are leaves <i>green</i>?</h1>
    <article class="brief-stack hit" style="top:280px" aria-label="Slide brief">
      <section class="brief-box"><h3>Content</h3><p>${escape(brief.content)}</p></section>
      <section class="brief-box"><h3>Display prompt</h3><p>${escape(brief.display)}</p></section>
    </article>`,
};
