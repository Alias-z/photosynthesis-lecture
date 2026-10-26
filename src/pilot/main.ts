// Style pilot: Figure-first pages on Bristol paper. Each slide switches between its lecture version (its lead
// page if it has one, otherwise the figure with the three claims) and its handout version (the study page the
// PDF keeps). The slide 6 animation runs in two looks. Double-clicking a page picks or unpicks the variant shown.
import './pilot.css';
import { grain } from '../lib/canvas';
import { mountExcitation } from './excitation';
import { installPapers } from './papers';
import { pickStore } from './picks';
import { LEADS, PLATES, fitTitles, leadHtml, lectureHtml, plateHtml } from './plates';

type Mode = 'lecture' | 'handout';
type Kind = 'lead' | 'lecture' | 'handout';

const MODES = [
  { id: 'lecture', name: 'Lecture' },
  { id: 'handout', name: 'Handout' },
] as const;
const LOOKS = [
  { id: 'plate', name: 'Plate look', note: 'Same paper-and-ink language as the original plates.' },
  { id: 'story', name: 'Story look', note: 'Dark stage and hand lettering, like the existing sky animation.' },
] as const;

const seg = (group: string, items: ReadonlyArray<{ id: string; name: string }>, on = items[0].id): string =>
  `<div class="seg" data-group="${group}">${items.map(x => `<button type="button" data-v="${x.id}" aria-pressed="${x.id === on}">${x.name}</button>`).join('')}</div>`;

/** A lead page keeps its own picks and note under lead-<n>; the lecture and handout versions share the slide's figure. */
const pickKey = (i: number, kind: Kind): string => (kind === 'lead' ? `lead-${PLATES[i].n}` : PLATES[i].n);
const frame = (i: number, kind: Kind): string => `<div class="frame" data-s="${i}" data-kind="${kind}"><div class="plate"></div></div>`;
const noteBox = (key: string, label: string): string =>
  `<textarea class="pick-note" rows="2" data-n="${key}" placeholder="Note for ${label}: what to keep, combine or change"></textarea>`;

const app = document.getElementById('pilot') as HTMLElement;
app.innerHTML = `
  <header class="top">
    <h1>Style pilot</h1>
    <p>Each slide has a lecture version, shown live, and a handout version, which the PDF keeps. The animation opens from slide 6 in the HTML version only.</p>
    <p>Double-click a page to pick the variant shown; double-click again to unpick. Picked variants get a ✓ on their button. Picks and notes save automatically.</p>
  </header>
  <span class="pick-status" aria-live="polite"></span>
  <section class="block">
    <div class="bar"><h2>Slides · Figure first</h2><div class="bar-r"><span>All slides</span>${seg('mode-all', MODES, 'handout')}</div></div>
    <div class="plates">${PLATES.map((p, i) => {
      const lead = LEADS[p.n];
      return `<section class="slide" data-s="${i}" data-mode="handout">
        <div class="slide-bar"><h3>Slide ${p.n}${p.status === 'draft' ? ' · draft' : ''}</h3><div class="slide-ctl">${seg(`mode-${i}`, MODES, 'handout')}</div></div>
        <div class="var-rows">
          ${lead && lead.VARIANTS.length > 1 ? `<div class="var-row" data-for="lecture"><span>Lecture</span>${seg(`lead-${i}`, lead.VARIANTS)}</div>` : ''}
          ${p.variants.length > 1 ? `<div class="var-row" data-for="${lead ? 'handout' : 'both'}"><span>${lead ? 'Handout' : 'Figure'}</span>${seg(`variant-${i}`, p.variants)}</div>` : ''}
        </div>
        ${lead ? `<div class="lead-part">${frame(i, 'lead')}${noteBox(`lead-${p.n}`, `slide ${p.n} lecture page`)}</div>` : frame(i, 'lecture')}
        ${frame(i, 'handout')}${noteBox(p.n, `slide ${p.n}`)}
      </section>`;
    }).join('')}</div>
  </section>
  <section class="block" id="animation">
    <div class="bar"><h2>Animation · Follow an excitation</h2>${seg('look', LOOKS)}</div>
    <p class="note" data-note="look"></p>
    <div class="frame"><div class="stage"></div></div>
  </section>`;

// Paper grain for the animation's Plate look, matching the lecture's canvas texture.
const g = document.createElement('canvas');
g.width = g.height = 160;
const gc = g.getContext('2d');
if (gc) { gc.fillStyle = grain(gc); gc.fillRect(0, 0, 160, 160); }
document.documentElement.style.setProperty('--grain', `url(${g.toDataURL()})`);
installPapers(document.documentElement);

const note = (k: string): HTMLElement => app.querySelector(`[data-note="${k}"]`) as HTMLElement;
const state = {
  variants: PLATES.map(p => p.variants[0].id),
  leads: PLATES.map(p => LEADS[p.n]?.VARIANTS[0].id ?? ''),
  modes: PLATES.map((): Mode => 'handout'),
};
const shown = (i: number, kind: Kind): string => (kind === 'lead' ? state.leads[i] : state.variants[i]);

// Solo view for screenshots: ?solo=<page>&v=<variant> shows one page at full size. <page> is the slide number
// (1–15, C1–C13) for the handout version, lecture-<n> for the lecture version and lead-<n> for a lead page
// (a slide with a lead page has no separate lecture page).
const query = new URLSearchParams(location.search);
const [, soloPrefix, soloN] = /^(?:(lead|lecture)-)?(.+)$/.exec(query.get('solo') ?? '') ?? [];
const solo = soloN === undefined ? -1 : PLATES.findIndex((p, i) => p.n === soloN || `${i}` === soloN);
if (solo >= 0) {
  const kind = (soloPrefix ?? 'handout') as Kind;
  document.body.classList.add('solo');
  state.modes[solo] = kind === 'handout' ? 'handout' : 'lecture';
  const v = query.get('v');
  if (v && kind === 'lead') state.leads[solo] = v;
  else if (v) state.variants[solo] = v;
  app.querySelector(`.plates .frame[data-s="${solo}"][data-kind="${kind}"]`)?.classList.add('solo-frame');
}

// Only the version on show is drawn: the lecture and handout copies of a figure share their SVG ids, and an
// arrowhead found first in a hidden copy would not render in the visible one.
const isShown = (i: number, kind: Kind): boolean => (kind === 'handout') === (state.modes[i] === 'handout');

function render(): void {
  app.querySelectorAll<HTMLElement>('.plates .frame').forEach(fr => {
    const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind, p = PLATES[i];
    const plate = fr.firstElementChild as HTMLElement;
    plate.className = 'plate theme-editorial lay-figure paper-bristol';
    plate.innerHTML = !isShown(i, kind) ? '' : kind === 'lead' ? leadHtml(p, LEADS[p.n].draw(state.leads[i])) : kind === 'lecture' ? lectureHtml(p, state.variants[i]) : plateHtml(p, state.variants[i]);
  });
  fitTitles(app);
  syncPicks();
}

/** Shows each slide in its chosen version and keeps the switches in step; "All slides" lights up only when they agree. */
function applyModes(): void {
  app.querySelectorAll<HTMLElement>('.plates .slide').forEach(sec => {
    const i = Number(sec.dataset.s);
    sec.dataset.mode = state.modes[i];
    sec.querySelectorAll<HTMLElement>(`[data-group="mode-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.modes[i]}`));
  });
  const all = state.modes.every(m => m === state.modes[0]) ? state.modes[0] : '';
  app.querySelectorAll<HTMLElement>('[data-group="mode-all"] button').forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === all}`));
  render();
  fit();
}

// Picks: a ✓ on each picked variant's button, an outline on a page whose shown variant is picked, and the notes.
const store = pickStore(app.querySelector('.pick-status') as HTMLElement, syncPicks);
function syncPicks(): void {
  PLATES.forEach((p, i) => {
    for (const [group, key] of [[`variant-${i}`, p.n], [`lead-${i}`, `lead-${p.n}`]]) {
      app.querySelectorAll<HTMLElement>(`[data-group="${group}"] button`).forEach(b => b.classList.toggle('picked', store.has(key, b.dataset.v as string)));
    }
  });
  app.querySelectorAll<HTMLElement>('.plates .frame').forEach(fr => {
    const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind;
    fr.classList.toggle('is-picked', store.has(pickKey(i, kind), shown(i, kind)));
  });
  app.querySelectorAll<HTMLTextAreaElement>('.pick-note').forEach(box => {
    if (document.activeElement !== box) box.value = store.note(box.dataset.n as string);
  });
}
app.addEventListener('dblclick', e => {
  const fr = (e.target as Element).closest('.plates .frame') as HTMLElement | null;
  if (!fr) return;
  const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind;
  store.set(pickKey(i, kind), shown(i, kind), !store.has(pickKey(i, kind), shown(i, kind)));
});
// A double-click on a page picks; it should not also select a word.
app.addEventListener('mousedown', e => { if (e.detail > 1 && (e.target as Element).closest('.plates .frame')) e.preventDefault(); });
app.addEventListener('input', e => {
  const t = e.target as HTMLTextAreaElement;
  if (t.classList.contains('pick-note')) store.setNote(t.dataset.n as string, t.value);
});

let stageRef = app.querySelector('.stage') as HTMLElement, stopAnimation = (): void => undefined;
function setLook(id: 'plate' | 'story'): void {
  stopAnimation();
  const fresh = document.createElement('div');
  stageRef.replaceWith(fresh);
  stopAnimation = mountExcitation(fresh, id);
  stageRef = fresh;
  note('look').textContent = LOOKS.find(l => l.id === id)?.note ?? '';
  fit();
}

app.addEventListener('click', e => {
  const b = (e.target as Element).closest('button');
  if (!b) return;
  if (b.hasAttribute('data-anim')) { document.getElementById('animation')?.scrollIntoView({ behavior: 'smooth' }); stageRef.focus(); return; }
  const group = (b.closest('.seg') as HTMLElement | null)?.dataset.group;
  const v = b.dataset.v;
  if (!group || !v) return;
  b.parentElement?.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', `${x === b}`));
  if (group === 'mode-all') { state.modes.fill(v as Mode); applyModes(); }
  else if (group.startsWith('mode-')) { state.modes[Number(group.slice(5))] = v as Mode; applyModes(); }
  // A variant opens the version it belongs to: lead variants the lecture version, figure variants the handout
  // (on a slide without a lead page both versions show the figure, so the version stays as it is).
  else if (group.startsWith('variant-')) {
    const i = Number(group.slice(8));
    state.variants[i] = v;
    if (LEADS[PLATES[i].n]) state.modes[i] = 'handout';
    applyModes();
  } else if (group.startsWith('lead-')) {
    const i = Number(group.slice(5));
    state.leads[i] = v;
    state.modes[i] = 'lecture';
    applyModes();
  }
  else setLook(v as 'plate' | 'story');
});

// Every 1600 x 900 frame is scaled to the column width; a hidden version is sized when it is shown.
function fit(): void {
  app.querySelectorAll<HTMLElement>('.frame').forEach(fr => {
    const k = fr.clientWidth / 1600;
    fr.style.height = `${900 * k}px`;
    (fr.firstElementChild as HTMLElement).style.transform = `scale(${k})`;
  });
}
new ResizeObserver(fit).observe(app);
applyModes();
if (solo < 0) setLook('plate');
