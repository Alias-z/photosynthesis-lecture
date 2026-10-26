// Slide 2: wavelength, photon energy, the visible band and PAR.
import { INK, INKS, arrow, circ, paper, plex, rgba, serifI, txt, type RGB } from '../lib/canvas';
import { bracket, strip } from '../lib/ink';
import type { Slide } from '../slide';

const PX = (nm: number): number => 160 + (nm - 300) * 2.56;
const LIGHT: RGB[] = [[35, 80, 230], [42, 150, 58], [222, 54, 30]];
const ROWS = [
  { nm: 450, y: 300, name: 'blue', b: 0 },
  { nm: 550, y: 392, name: 'green', b: 1 },
  { nm: 650, y: 484, name: 'red', b: 2 },
];

export const wavelengthsSlide: Slide = {
  title: 'Light is a mix of wavelengths',
  kind: 'canvas',
  drawStatic(c) {
    paper(c);
    arrow(c, 104, 500, 104, 286, 14, INK, 1.6);
    c.save();
    c.translate(82, 393);
    c.rotate(-Math.PI / 2);
    txt(c, 'more energy per photon', 0, -4, serifI(30), INKS, 'center');
    c.restore();
    for (const r of ROWS) {
      const x = PX(r.nm);
      c.strokeStyle = 'rgba(31,42,58,0.55)';
      c.lineWidth = 1.2;
      c.setLineDash([4, 6]);
      c.beginPath();
      c.moveTo(x, r.y + 22);
      c.lineTo(x, 598);
      c.stroke();
      c.setLineDash([]);
    }
    strip(c, PX(300), PX(800), 604, 34);
    for (let nm = 300; nm <= 800; nm += 100) txt(c, nm === 800 ? '800 nm' : String(nm), PX(nm), 676, plex(400, 30), INKS, 'center');
    txt(c, 'ultraviolet', PX(340), 588, serifI(30), INKS, 'center');
    txt(c, 'infrared', PX(775), 588, serifI(30), INKS, 'center');
    bracket(c, PX(380), PX(750), 704, 'Visible to us', '380–750 nm');
    bracket(c, PX(400), PX(700), 774, 'PAR, the light plants use', '400–700 nm');
  },
  drawFrame(c, t) {
    for (const r of ROWS) {
      const x0 = 160;
      const x1 = PX(r.nm) - 14;
      const k = (2 * Math.PI) / (r.nm * 0.11);
      const col = LIGHT[r.b];
      c.beginPath();
      for (let x = x0; x <= x1; x += 2) {
        const env = Math.min(1, (x - x0) / 140);
        const y = r.y + 24 * env * Math.sin(k * (x - 70 * t)); // every colour moves at the same speed
        if (x === x0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.strokeStyle = rgba(col);
      c.lineWidth = 3.4;
      c.lineJoin = 'round';
      c.stroke();
      const px = PX(r.nm);
      const E = (1239.84 / r.nm).toFixed(2);
      c.fillStyle = rgba(col);
      circ(c, px, r.y, 12);
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 2;
      c.stroke();
      txt(c, `${r.nm} nm`, px + 30, r.y + 12, plex(600, 36), INK);
      c.font = plex(600, 36);
      const w = c.measureText(`${r.nm} nm`).width;
      txt(c, `${r.name}, ${E} eV`, px + 30 + w + 14, r.y + 12, serifI(36), INKS);
    }
  },
  overlay: () => `
    <h2 class="h2" style="left:92px;top:50px;width:960px">Light is a mix of wavelengths.</h2>
    <p class="sub" style="left:96px;top:134px;width:1000px">Shorter waves carry more energy in each photon.</p>
    <div class="formula" style="left:1050px;top:52px;width:454px"><b><i>E</i> = <i>hc</i> / <i>λ</i></b><span>≈ 1240 eV·nm ÷ λ</span></div>`,
};
