// Shared canvas helpers for the Plate style. All slides draw on a 1600 x 900 logical canvas.

export const W = 1600;
export const H = 900;
export const INK = '#1f2a3a';
export const INKS = '#3f4a5a';
export const PAPER = '#f2f3ee';

export type Ctx = CanvasRenderingContext2D;
export type RGB = [number, number, number];
export type Pt = [number, number];

/** Small deterministic random generator, so drawings look the same on every load. */
export function mulberry(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const rgba = (c: readonly number[], a = 1): string => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

export function circ(c: Ctx, x: number, y: number, r: number): void {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
}

export function glow(c: Ctx, x: number, y: number, r: number, col: readonly number[], a: number): void {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a));
  g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g;
  circ(c, x, y, r);
  c.fill();
}

export function txt(c: Ctx, s: string, x: number, y: number, font: string, col: string, align: CanvasTextAlign = 'left'): void {
  c.font = font;
  c.fillStyle = col;
  c.textAlign = align;
  c.textBaseline = 'alphabetic';
  c.fillText(s, x, y);
}

export const serifI = (size: number): string => `italic 400 ${size}px Spectral, Georgia, serif`;
export const plex = (weight: number, size: number): string => `${weight} ${size}px "IBM Plex Sans", "Helvetica Neue", Arial, sans-serif`;

let grainCanvas: HTMLCanvasElement | null = null;
/** A faint paper grain, used as a repeating pattern. */
export function grain(c: Ctx): CanvasPattern | string {
  if (!grainCanvas) {
    grainCanvas = document.createElement('canvas');
    grainCanvas.width = grainCanvas.height = 160;
    const g = grainCanvas.getContext('2d');
    if (g) {
      const id = g.createImageData(160, 160);
      const r = mulberry(7);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = r();
        id.data[i] = id.data[i + 1] = id.data[i + 2] = v < 0.5 ? 20 : 255;
        id.data[i + 3] = Math.floor(r() * 22);
      }
      g.putImageData(id, 0, 0);
    }
  }
  return c.createPattern(grainCanvas, 'repeat') ?? 'transparent';
}

export function paper(c: Ctx, w = W, h = H, col = PAPER): void {
  c.fillStyle = col;
  c.fillRect(0, 0, w, h);
  c.fillStyle = grain(c);
  c.fillRect(0, 0, w, h);
}

export function arrow(c: Ctx, x0: number, y0: number, x1: number, y1: number, head: number, col: string, w: number): void {
  const a = Math.atan2(y1 - y0, x1 - x0);
  c.strokeStyle = col;
  c.fillStyle = col;
  c.lineWidth = w;
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(x1 - Math.cos(a) * head * 0.6, y1 - Math.sin(a) * head * 0.6);
  c.stroke();
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x1 - Math.cos(a - 0.42) * head, y1 - Math.sin(a - 0.42) * head);
  c.lineTo(x1 - Math.cos(a + 0.42) * head, y1 - Math.sin(a + 0.42) * head);
  c.closePath();
  c.fill();
}
