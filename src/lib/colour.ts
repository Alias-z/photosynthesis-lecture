// Colour helpers: sRGB transfer functions and a display approximation of spectral colours.
import type { RGB } from './canvas';

export const lin = (v: number): number => {
  const x = v / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};

export const enc = (v: number): number => {
  const x = Math.max(0, Math.min(1, v));
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
};

const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const KEYS: Array<[number, RGB]> = (
  [
    [380, '#7a00e6'], [400, '#7a00e6'], [430, '#4b00ff'], [450, '#1f2cff'], [470, '#0070ff'], [490, '#00b8ff'],
    [500, '#00dcd0'], [520, '#00f060'], [550, '#7cf000'], [570, '#e8f000'], [580, '#ffd000'], [600, '#ff8a00'],
    [620, '#ff4a00'], [650, '#ff1a00'], [700, '#ee0000'], [780, '#cc0000'],
  ] as Array<[number, string]>
).map(([l, h]) => [l, hex(h)]);

/** Display colour of a wavelength in nm, at full brightness. */
export function spec(nm: number): RGB {
  if (nm <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 1; i < KEYS.length; i++) {
    if (nm <= KEYS[i][0]) {
      const [l0, c0] = KEYS[i - 1];
      const [l1, c1] = KEYS[i];
      const f = (nm - l0) / (l1 - l0);
      return [c0[0] + (c1[0] - c0[0]) * f, c0[1] + (c1[1] - c0[1]) * f, c0[2] + (c1[2] - c0[2]) * f];
    }
  }
  return KEYS[KEYS.length - 1][1];
}

/** How visible a wavelength is: 0 outside 380-750 nm, rising to 1 inside. */
export const vis = (nm: number): number => Math.max(0, Math.min(1, (nm - 380) / 45, (750 - nm) / 60));

export const mixc = (a: readonly number[], b: readonly number[], f: number): RGB => [
  a[0] + (b[0] - a[0]) * f,
  a[1] + (b[1] - a[1]) * f,
  a[2] + (b[2] - a[2]) * f,
];
