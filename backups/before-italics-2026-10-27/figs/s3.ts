// Slide 3 figure concepts. What each must show is in research/figure-briefs/LECTURE_OVERVIEW.md.
import './s3.css';

export const VARIANTS = [{ id: 'a', name: '3A' }];

export function draw(id: string): string {
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Placeholder"><text class="lab" x="400" y="300" text-anchor="middle">Slide 3 · ${id} · in progress</text></svg>`;
}
