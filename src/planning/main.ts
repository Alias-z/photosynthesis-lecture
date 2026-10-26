import './planning.css';
import { lectures } from './plan';
import { PLAN_STORAGE_KEY as STORAGE_KEY, storedSlideState, validMinutes } from './timing';

import type { SlideState } from './timing';
interface SavedPlan { slides: Record<string, SlideState>; reserves: Record<string, number> }
const state: SavedPlan = { slides: {}, reserves: {} };
let saved: Partial<SavedPlan> = {};
try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') ?? {}; } catch { /* use the outline */ }

for (const lecture of lectures) {
  state.reserves[lecture.id] = validMinutes(saved.reserves?.[lecture.id]) ? saved.reserves![lecture.id] : lecture.reserveMinutes;
  for (const slide of lecture.slides) {
    const stored = storedSlideState(slide.id, saved.slides);
    state.slides[slide.id] = {
      agreed: typeof stored?.agreed === 'boolean' ? stored.agreed : slide.agreed,
      minutes: validMinutes(stored?.minutes) ? stored.minutes : slide.minutes,
    };
  }
}

const escape = (value: string): string => value.replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]!);
const minuteText = (minutes: number): string => `${minutes}`;
const clock = (minutes: number): string => `${Math.floor(minutes)}:${minutes % 1 ? '30' : '00'}`;

document.querySelector<HTMLElement>('#planning')!.innerHTML = `
  <header class="page-header">
    <h1>Photosynthesis planning</h1>
    <p>Two 45-minute lectures. Tick agreed topics and edit the time per slide.</p>
    <nav aria-label="Lectures"><a href="#light">Light reactions</a><a href="#carbon">Carbon reactions</a></nav>
    <p class="planning-note">Agreement marks content and order, not completed visuals. Times are draft estimates.</p>
    <p class="save-state" id="save-state" role="status">Changes save in this browser.</p>
  </header>
  ${lectures.map((lecture, li) => `
    <section class="lecture" id="${lecture.id}" aria-labelledby="heading-${lecture.id}">
      <header class="lecture-header">
        <div><h2 id="heading-${lecture.id}">${li + 1}. ${escape(lecture.title)}</h2>
          <p class="agreement-count" data-agreed-count="${lecture.id}"></p></div>
        <div class="time-summary"><strong data-total="${lecture.id}"></strong><span data-budget="${lecture.id}"></span></div>
      </header>
      <table>
        <caption class="sr-only">${escape(lecture.title)}: slide content, agreement and estimated teaching time</caption>
        <thead><tr><th class="agree-column" scope="col">Agreed</th><th scope="col">Planned slide</th><th class="minutes-column" scope="col">Minutes</th><th class="slot-column" scope="col">Elapsed</th></tr></thead>
        <tbody>${lecture.slides.map((slide, si) => `
          <tr id="row-${slide.id}" data-slide="${slide.id}">
            <td class="agree-cell"><input type="checkbox" data-agree="${slide.id}" aria-label="Agreed topic: ${escape(slide.title)}" title="${escape(slide.agreementBasis)}"${state.slides[slide.id].agreed ? ' checked' : ''}></td>
            <td class="content-cell"><h3><span class="plan-number">${li + 1}.${String(si + 1).padStart(2, '0')}</span> ${escape(slide.title)}</h3>
              <p>${escape(slide.content)}</p>
              ${slide.existingSlide ? `<p class="row-note">Existing deck slide ${slide.existingSlide}</p>` : ''}
              ${slide.optional ? '<p class="row-note">Optional · included in the draft time budget</p>' : ''}
            </td>
            <td class="minutes-cell"><input type="number" min="0" max="45" step="0.5" inputmode="decimal" data-minutes="${slide.id}" value="${state.slides[slide.id].minutes}" aria-label="Minutes: ${escape(slide.title)}"></td>
            <td class="slot-cell"><output data-slot="${slide.id}"></output></td>
          </tr>`).join('')}</tbody>
        <tfoot><tr><td></td><th scope="row">${escape(lecture.reserveLabel)}</th>
          <td class="minutes-cell"><input type="number" min="0" max="45" step="0.5" inputmode="decimal" data-reserve="${lecture.id}" value="${state.reserves[lecture.id]}" aria-label="Minutes: ${escape(lecture.reserveLabel)}"></td>
          <td class="slot-cell"><output data-reserve-slot="${lecture.id}"></output></td></tr></tfoot>
      </table>
    </section>`).join('')}
  <footer class="page-footer">The plan follows the existing outline. Environmental controls, sun/shade acclimation and engineering applications are outside these lectures.</footer>`;

function updateSummaries(): void {
  for (const lecture of lectures) {
    let elapsed = 0;
    let agreed = 0;
    for (const slide of lecture.slides) {
      const current = state.slides[slide.id];
      document.querySelector<HTMLOutputElement>(`[data-slot="${slide.id}"]`)!.textContent = `${clock(elapsed)}–${clock(elapsed + current.minutes)}`;
      elapsed += current.minutes;
      if (current.agreed) agreed++;
    }
    const total = elapsed + state.reserves[lecture.id];
    document.querySelector(`[data-reserve-slot="${lecture.id}"]`)!.textContent = `${clock(elapsed)}–${clock(total)}`;
    document.querySelector(`[data-total="${lecture.id}"]`)!.textContent = `${minuteText(total)} / 45 min`;
    document.querySelector(`[data-agreed-count="${lecture.id}"]`)!.textContent = `${agreed} of ${lecture.slides.length} topics agreed`;
    const budget = document.querySelector<HTMLElement>(`[data-budget="${lecture.id}"]`)!;
    budget.textContent = total > 45 ? `${minuteText(total - 45)} min over` : total < 45 ? `${minuteText(45 - total)} min available` : 'Time allocated';
    budget.classList.toggle('over-budget', total > 45);
  }
}

function save(): void {
  const status = document.querySelector('#save-state')!;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    status.textContent = 'Saved in this browser.';
  } catch {
    status.textContent = 'Changes could not be saved. Keep this tab open.';
  }
}

document.querySelector('#planning')!.addEventListener('change', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  if (input.dataset.agree) {
    state.slides[input.dataset.agree].agreed = input.checked;
  } else if (input.dataset.minutes || input.dataset.reserve) {
    const previous = input.dataset.minutes ? state.slides[input.dataset.minutes].minutes : state.reserves[input.dataset.reserve!];
    const value = input.value === '' ? NaN : Number(input.value);
    if (!validMinutes(value)) { input.value = String(previous); return; }
    if (input.dataset.minutes) state.slides[input.dataset.minutes].minutes = value;
    else state.reserves[input.dataset.reserve!] = value;
  } else return;
  updateSummaries();
  save();
});

// Keep valid time edits and totals saved while typing.
document.querySelector('#planning')!.addEventListener('input', event => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || (!input.dataset.minutes && !input.dataset.reserve)) return;
  const value = input.value === '' ? NaN : Number(input.value);
  if (!validMinutes(value)) return;
  if (input.dataset.minutes) state.slides[input.dataset.minutes].minutes = value;
  else state.reserves[input.dataset.reserve!] = value;
  updateSummaries();
  save();
});

updateSummaries();
