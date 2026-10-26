import { lectures } from './plan';

export const PLAN_STORAGE_KEY = 'photosynthesis-content-plan-v1';

export interface SlideState { agreed: boolean; minutes: number }

export function validMinutes(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 45 && Number.isInteger(value * 2);
}

/** Preserve saved timing when the separate sky slide becomes slide 4's animation. */
export function storedSlideState(id: string, slides?: Record<string, Partial<SlideState>>): Partial<SlideState> | undefined {
  if (slides?.[id] || id !== 'photon-scattering') return slides?.[id];
  const findings = slides?.['scattering-demo'], animation = slides?.['sky-animation'];
  if (!findings && !animation) return undefined;
  return {
    agreed: findings?.agreed ?? false,
    minutes: (validMinutes(findings?.minutes) ? findings.minutes : 1)
      + (validMinutes(animation?.minutes) ? animation.minutes : 2),
  };
}

/** Read the same per-slide estimate used by the planning tab. */
export function slideMinutes(deckSlide: number): number | undefined {
  const planned = lectures.flatMap(lecture => lecture.slides).find(slide => slide.existingSlide === deckSlide);
  if (!planned) return undefined;
  try {
    const saved = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '{}');
    const minutes: unknown = storedSlideState(planned.id, saved?.slides)?.minutes;
    if (validMinutes(minutes)) return minutes;
  } catch { /* use the draft estimate */ }
  return planned.minutes;
}
