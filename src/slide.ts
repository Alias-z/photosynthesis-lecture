// What a slide can provide to the viewer.
import type { Ctx } from './lib/canvas';

export interface Slide {
  /** Name shown in the Contents jumper. */
  title: string;
  /** 'canvas' slides draw on the shared 1600 x 900 canvas; 'sky' is yesterday's animation in its own layer. */
  kind: 'canvas' | 'sky';
  /** Drawn once into a cached layer (background, static figure). */
  drawStatic?(c: Ctx): void;
  /** Drawn every frame on top of the cached layer. */
  drawFrame?(c: Ctx, t: number): void;
  /** Advances any simulation while the slide is shown. */
  update?(dt: number): void;
  /** HTML for the slide's text, positioned in slide pixels. */
  overlay?(): string;
  /** Handles a click on one of the slide's own buttons. */
  onButton?(btn: HTMLButtonElement): void;
  /** Handles a key; returns true if the slide used it. */
  onKey?(e: KeyboardEvent): boolean;
}
