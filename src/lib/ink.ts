// Ink-and-wash drawing parts of the Plate style.
import { INK, INKS, arrow, circ, glow, grain, mulberry, plex, rgba, serifI, txt, type Ctx } from './canvas';
import { mixc, spec, vis } from './colour';

export function leafShape(c: Ctx, L: number, Wd: number): void {
  c.beginPath();
  c.moveTo(-L / 2, 0);
  c.bezierCurveTo(-L * 0.3, -Wd * 0.95, L * 0.16, -Wd * 0.82, L / 2, 0);
  c.bezierCurveTo(L * 0.16, Wd * 0.82, -L * 0.3, Wd * 0.95, -L / 2, 0);
  c.closePath();
}

export function leafVeins(c: Ctx, L: number, Wd: number, col: string, w: number): void {
  c.strokeStyle = col;
  c.lineCap = 'round';
  c.lineWidth = w;
  c.beginPath();
  c.moveTo(-L / 2, 0);
  c.quadraticCurveTo(0, -Wd * 0.05, L / 2 - 6, 0);
  c.stroke();
  c.lineWidth = w * 0.55;
  for (let i = 1; i <= 7; i++) {
    const x = -L / 2 + (L * i) / 8.4;
    const reach = Wd * 0.7 * Math.sin(Math.PI * Math.min(0.95, i / 8.4 + 0.08));
    for (const s of [-1, 1]) {
      c.beginPath();
      c.moveTo(x, -Wd * 0.03);
      c.quadraticCurveTo(x + L * 0.05, s * reach * 0.5, x + L * 0.12, s * reach);
      c.stroke();
    }
  }
}

export function petiole(c: Ctx, L: number, Wd: number, col: string, w: number): void {
  c.strokeStyle = col;
  c.lineWidth = w;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(-L / 2, 0);
  c.quadraticCurveTo(-L / 2 - L * 0.08, Wd * 0.04, -L / 2 - L * 0.15, Wd * 0.14);
  c.stroke();
}

/** A leaf in ink outline with two thin green washes. */
export function leafInk(c: Ctx, x: number, y: number, L: number, Wd: number, rot: number): void {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  const r = mulberry(11);
  for (let i = 0; i < 5; i++) {
    c.save();
    c.translate((r() - 0.5) * 7, (r() - 0.5) * 7);
    leafShape(c, L * (0.97 + r() * 0.05), Wd * (0.95 + r() * 0.08));
    c.fillStyle = i < 2 ? 'rgba(118,170,88,0.30)' : 'rgba(64,132,66,0.20)';
    c.fill();
    c.restore();
  }
  leafShape(c, L, Wd);
  c.strokeStyle = 'rgba(56,112,58,0.28)';
  c.lineWidth = 7;
  c.stroke();
  c.save();
  leafShape(c, L, Wd);
  c.clip();
  leafVeins(c, L, Wd, 'rgba(31,42,58,0.85)', 1.8);
  c.restore();
  petiole(c, L, Wd, INK, 2.2);
  leafShape(c, L, Wd);
  c.strokeStyle = INK;
  c.lineWidth = 2.1;
  c.stroke();
  c.restore();
}

/** The Sun as a small ink disc with short rays and a pale wash. */
export function inkSun(c: Ctx, x: number, y: number, r: number): void {
  glow(c, x, y, r * 3.2, [255, 250, 232], 0.75);
  c.fillStyle = '#fff6d8';
  circ(c, x, y, r);
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.5;
  c.stroke();
  c.lineWidth = 1.3;
  c.lineCap = 'round';
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const l = i % 2 ? 0.45 : 0.75;
    c.beginPath();
    c.moveTo(x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35);
    c.lineTo(x + Math.cos(a) * r * (1.35 + l), y + Math.sin(a) * r * (1.35 + l));
    c.stroke();
  }
}

/** Figure plate: the noon sky, drawn around (0, 0) with radius 196. */
export function figSky(c: Ctx): void {
  const r = 196;
  c.save();
  circ(c, 0, 0, r);
  c.clip();
  const g = c.createLinearGradient(0, -r, 0, r);
  const stops: Array<[number, string]> = [[0, '#5f86c4'], [0.35, '#7fa2d6'], [0.6, '#a6c1e6'], [0.8, '#cfdcee'], [1, '#e6ecf0']];
  stops.forEach(([o, col]) => g.addColorStop(o, col));
  c.fillStyle = g;
  c.fillRect(-r, -r, 2 * r, 2 * r);
  c.fillStyle = grain(c);
  c.fillRect(-r, -r, 2 * r, 2 * r);
  inkSun(c, -62, -92, 19);
  c.beginPath();
  c.moveTo(-r, 122);
  c.bezierCurveTo(-120, 88, -40, 132, 40, 112);
  c.bezierCurveTo(110, 96, 160, 120, r, 104);
  c.lineTo(r, r);
  c.lineTo(-r, r);
  c.closePath();
  c.fillStyle = '#c4ccb6';
  c.fill();
  c.strokeStyle = INK;
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();
  circ(c, 0, 0, r);
  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  c.stroke();
}

/** Figure plate: a leaf in sunlight, drawn around (0, 0) with radius 196. */
export function figLeaf(c: Ctx): void {
  const r = 196;
  c.save();
  circ(c, 0, 0, r);
  c.clip();
  c.fillStyle = '#eef1e8';
  c.fillRect(-r, -r, 2 * r, 2 * r);
  for (let i = 0; i < 3; i++) {
    const sx = -168 + i * 34;
    const sy = -150 - i * 22;
    arrow(c, sx, sy, sx + 54, sy + 72, 12, INK, 1.5);
  }
  leafInk(c, 16, 26, 300, 116, -0.55);
  c.restore();
  circ(c, 0, 0, r);
  c.strokeStyle = INK;
  c.lineWidth = 2.4;
  c.stroke();
}

/** Spectrum strip from 300 to 800 nm; dark where eyes stop seeing. */
export function strip(c: Ctx, x0: number, x1: number, y: number, h: number): void {
  const g = c.createLinearGradient(x0, 0, x1, 0);
  for (let nm = 300; nm <= 800; nm += 10) {
    const col = mixc(mixc(spec(nm), [242, 243, 238], 0.12), [43, 50, 64], 1 - Math.pow(vis(nm), 0.6));
    g.addColorStop((nm - 300) / 500, rgba(col));
  }
  c.fillStyle = g;
  c.fillRect(x0, y, x1 - x0, h);
  c.fillStyle = grain(c);
  c.fillRect(x0, y, x1 - x0, h);
  c.strokeStyle = INK;
  c.lineWidth = 1.4;
  c.strokeRect(x0, y, x1 - x0, h);
}

/** A bracket under an axis with an italic name and upright numbers. */
export function bracket(c: Ctx, xa: number, xb: number, y: number, name: string, range: string): void {
  const cx = (xa + xb) / 2;
  c.strokeStyle = INK;
  c.lineWidth = 1.6;
  c.beginPath();
  c.moveTo(xa, y - 12);
  c.lineTo(xa, y);
  c.lineTo(xb, y);
  c.lineTo(xb, y - 12);
  c.stroke();
  c.font = serifI(34);
  const w1 = c.measureText(name + '  ').width;
  c.font = plex(400, 30);
  const w2 = c.measureText(range).width;
  const sx = cx - (w1 + w2) / 2;
  txt(c, name + '  ', sx, y + 40, serifI(34), INK);
  txt(c, range, sx + w1, y + 40, plex(400, 30), INKS);
}
