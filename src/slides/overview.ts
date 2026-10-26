// A chloroplast overview: light reactions supply the carbon reactions.
// Conceptual references: Lecture D6, slide 15; Santelia 2019, slide 9.
import { INK, arrow, paper, type Ctx } from '../lib/canvas';
import type { Slide } from '../slide';

function cycle(c: Ctx, x: number, y: number, r: number): void {
  c.strokeStyle = INK;
  c.lineWidth = 2.2;
  for (let i = 0; i < 3; i++) {
    const start = -Math.PI / 2 + i * Math.PI * 2 / 3;
    const end = start + Math.PI * 2 / 3 - 0.16;
    c.beginPath();
    c.arc(x, y, r, start, end);
    c.stroke();
    const ex = x + r * Math.cos(end), ey = y + r * Math.sin(end);
    const tangent = end + Math.PI / 2;
    arrow(c, ex - 12 * Math.cos(tangent), ey - 12 * Math.sin(tangent), ex, ey, 14, INK, 2.2);
  }
}

export const overviewSlide: Slide = {
  title: 'Photosynthesis: light and carbon reactions',
  kind: 'canvas',
  drawStatic(c) {
    paper(c);
    // Chloroplast envelope, shown as two membranes in section.
    c.strokeStyle = INK;
    c.lineWidth = 1.7;
    c.beginPath();
    c.ellipse(815, 492, 580, 200, 0, 0, Math.PI * 2);
    c.stroke();
    c.lineWidth = 1;
    c.beginPath();
    c.ellipse(815, 492, 569, 190, 0, 0, Math.PI * 2);
    c.stroke();

    // Appressed thylakoid sacs, without decorative shading or icons.
    for (let i = 0; i < 5; i++) {
      const y = 420 + i * 28;
      c.beginPath();
      c.roundRect(350, y, 240, 26, 13);
      c.fillStyle = 'rgba(31,42,58,0.045)';
      c.fill();
      c.strokeStyle = INK;
      c.lineWidth = 1.7;
      c.stroke();
    }
    cycle(c, 1110, 492, 105);

    c.beginPath();
    c.moveTo(363, 557);
    c.lineTo(300, 598);
    c.lineWidth = 1;
    c.stroke();

    // Supply of ATP and reductant to the Calvin–Benson cycle.
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(590, 450);
    c.bezierCurveTo(655, 450, 655, 392, 720, 392);
    c.lineTo(900, 392);
    c.bezierCurveTo(959, 392, 953, 440, 1005, 440);
    c.stroke();
    arrow(c, 1005, 440, 1026, 440, 15, INK, 2.2);

    // Regenerated carriers return to the light reactions.
    c.beginPath();
    c.moveTo(1023, 551);
    c.bezierCurveTo(970, 551, 970, 602, 910, 602);
    c.lineTo(720, 602);
    c.bezierCurveTo(650, 602, 650, 541, 612, 541);
    c.stroke();
    arrow(c, 612, 541, 590, 541, 15, INK, 2.2);

    // Inputs and outputs are separate from the recycled carrier loop.
    arrow(c, 470, 310, 470, 407, 15, INK, 2);
    arrow(c, 470, 568, 470, 733, 15, INK, 2);
    arrow(c, 1110, 310, 1110, 376, 15, INK, 2);
    arrow(c, 1110, 609, 1110, 733, 15, INK, 2);

    // Light enters the thylakoids. Colour is reserved for this input.
    c.beginPath();
    for (let x = 96; x <= 316; x += 2) {
      const y = 493 + 9 * Math.sin((x - 96) * Math.PI / 28);
      if (x === 96) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.strokeStyle = '#a27b23';
    c.lineWidth = 3.2;
    c.stroke();
    arrow(c, 316, 493, 341, 493, 15, '#a27b23', 3.2);
  },
  overlay: () => `
    <h2 class="h2" style="left:92px;top:50px;width:1412px">Photosynthesis: light and carbon reactions</h2>
    <p style="left:280px;top:188px;width:390px;text-align:center;font:300 46px/1.2 var(--serif)">Light reactions</p>
    <p style="left:900px;top:188px;width:420px;text-align:center;font:300 46px/1.2 var(--serif)">Carbon reactions</p>
    <p style="left:96px;top:422px;font:400 36px/1.2 var(--sans)">Light</p>
    <p style="left:420px;top:258px;width:100px;text-align:center;font:400 38px/1.2 var(--sans)">H₂O</p>
    <p style="left:1060px;top:258px;width:100px;text-align:center;font:400 38px/1.2 var(--sans)">CO₂</p>
    <p style="left:650px;top:336px;width:330px;text-align:center;font:500 36px/1.2 var(--sans)">ATP + NADPH</p>
    <p style="left:650px;top:624px;width:330px;text-align:center;font:400 32px/1.2 var(--sans)">ADP + Pᵢ + NADP⁺</p>
    <p style="left:1004px;top:455px;width:212px;text-align:center;font:400 30px/1.15 var(--serif)">Calvin–Benson<br>cycle</p>
    <p style="left:1230px;top:540px;font:italic 400 30px/1.2 var(--serif);color:var(--ink2)">Stroma</p>
    <p style="left:120px;top:610px;width:250px;text-align:center;font:italic 400 30px/1.2 var(--serif);color:var(--ink2)">Thylakoids</p>
    <p style="left:385px;top:749px;width:170px;text-align:center;font:400 38px/1.2 var(--sans)">O₂</p>
    <p style="left:960px;top:749px;width:300px;text-align:center;font:400 36px/1.2 var(--sans)">Carbohydrate</p>
    <p style="left:680px;top:709px;width:270px;text-align:center;font:italic 400 30px/1.2 var(--serif);color:var(--ink2)">Chloroplast</p>`,
};
