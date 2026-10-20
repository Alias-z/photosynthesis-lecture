// Slide 1: the entry question with two figure plates.
import { INK, H, W, paper } from '../lib/canvas';
import { figLeaf, figSky } from '../lib/ink';
import type { Slide } from '../slide';

export const titleSlide: Slide = {
  title: 'Why is the sky blue?',
  kind: 'canvas',
  drawStatic(c) {
    paper(c);
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.strokeRect(40, 40, W - 80, H - 80);
    c.lineWidth = 0.8;
    c.strokeRect(50, 50, W - 100, H - 100);
    c.save();
    c.translate(520, 600);
    c.scale(0.85, 0.85);
    figSky(c);
    c.restore();
    c.save();
    c.translate(1080, 600);
    c.scale(0.85, 0.85);
    figLeaf(c);
    c.restore();
  },
  overlay: () => `
    <h1 class="h1" style="left:106px;top:104px;width:1390px">Why is the sky <i>blue</i>,<br>and why are leaves <i>green</i>?</h1>
    <p class="sub" style="left:110px;top:296px;width:1300px">Two everyday colours, one story about light.</p>
    <p class="fig" style="left:220px;top:788px;width:600px">Fig. 1<span>The noon sky</span></p>
    <p class="fig" style="left:780px;top:788px;width:600px">Fig. 2<span>A leaf in sunlight</span></p>`,
};
