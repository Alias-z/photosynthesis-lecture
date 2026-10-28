// Style pilot: Figure-first pages on Bristol paper. Each slide switches between its lecture version (its lead
// page if it has one, otherwise the figure with the three claims) and its handout version (the study page the
// PDF keeps). The slide 6 animation runs in two looks. Double-clicking a page picks or unpicks the variant shown.
// In the picking view a page with reference boards (refs.ts) has a References button that opens them over the page,
// and a page with hook questions (hooks.ts) has a ? button in its left margin that opens its question set.
import './pilot.css';
import { grain } from '../lib/canvas';
import { ANIMATIONS } from './anim';
import { mountAnimation } from './anim/player';
import type { Staging } from './anim/types';
import { mountExcitation } from './excitation';
import { hookSet, hooksFor } from './hooks';
import { hooksView } from './hooksView';
import { installPapers } from './papers';
import { pickStore } from './picks';
import { LEADS, PLATES, fitPage, leadHtml, lectureHtml, plateHtml } from './plates';
import { boardsFor, refBoard } from './refs';
import { refsView } from './refsView';

type Mode = 'lecture' | 'handout';
type Kind = 'lead' | 'lecture' | 'handout';

const MODES = [
  { id: 'lecture', name: 'Lecture' },
  { id: 'handout', name: 'Handout' },
] as const;

/** Picking shows the player's title and variant switch (double-click the player to pick); lecture mode hides both, as in class. */
const VIEWS = [
  { id: 'picking', name: 'Picking' },
  { id: 'lecture', name: 'Lecture mode' },
] as const;
let lectureMode = false;

const seg = (group: string, items: ReadonlyArray<{ id: string; name: string }>, on = items[0].id): string =>
  `<div class="seg" data-group="${group}">${items.map(x => `<button type="button" data-v="${x.id}" aria-pressed="${x.id === on}">${x.name}</button>`).join('')}</div>`;

/** Only a slide with a lead page (and more than that page) has two versions; on every other slide lecture and handout
 *  are the same page, so it shows one page with its play button and no switch (lecturer, 26 Oct 2026). */
const twoVersions = (p: (typeof PLATES)[number]): boolean => !!LEADS[p.n] && !p.leadOnly;
/** A lead page keeps its own picks and note under lead-<n>; the lecture and handout versions share the slide's figure. */
const pickKey = (i: number, kind: Kind): string => (kind === 'lead' ? `lead-${PLATES[i].n}` : PLATES[i].n);
/** The References button of a page with boards; it sits on the frame, outside the page, and shows only while picking. */
const refsButton = (key: string): string => {
  const boards = boardsFor(key);
  return boards.length ? `<button type="button" class="ref-open" data-refs="${key}" title="${boards.map(b => b.title).join(' · ').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">References</button>` : '';
};
/** The ? button of a page that a chunk's hook questions are for; it sits on the frame in the page's left margin and
 *  shows only while picking. */
const hooksButton = (key: string): string => {
  const sets = hooksFor(key);
  return sets.length ? `<button type="button" class="hook-open" data-hooks="${key}" aria-label="Questions" title="${sets.map(h => h.title).join(' · ').replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">?</button>` : '';
};
const frame = (i: number, kind: Kind): string =>
  `<div class="frame" data-s="${i}" data-kind="${kind}"><div class="plate"></div>${refsButton(pickKey(i, kind))}${hooksButton(pickKey(i, kind))}</div>`;
const noteBox = (key: string, label: string): string =>
  `<textarea class="pick-note" rows="2" data-n="${key}" placeholder="Note for ${label}: what to keep, combine or change"></textarea>`;

const app = document.getElementById('pilot') as HTMLElement;
// Animations play only from a slide's ▶ button (lecturer, 27 Oct 2026). The page keeps one animation block only for the
// screenshot view ?anim=<key>&v=<id>&beat=<n>&t=<s>.
const animQuery = new URLSearchParams(location.search).get('anim');
app.innerHTML = `
  <header class="top">
    <h1>Style pilot</h1>
    <p>A slide with a lead page has a lecture version (the lead page, shown live) and a handout version (the study page, which the PDF keeps). Every other slide is one page, the same live and in the PDF; its play button shows only live.</p>
    <p>Double-click a page to pick the variant shown; double-click again to unpick. Picked variants get a ✓ on their button. Picks and notes save automatically.</p>
    <div class="bar-r"><span>View</span>${seg('view', VIEWS, 'picking')}<button type="button" class="ref-index" data-refs-index>References</button><button type="button" class="ref-index hook-index" data-hooks-index>Questions</button></div>
  </header>
  <span class="pick-status" aria-live="polite"></span>
  <section class="block">
    <div class="bar"><h2>Slides · Figure first</h2></div>
    <div class="plates">${PLATES.map((p, i) => {
      const lead = LEADS[p.n];
      return `<section class="slide" data-s="${i}" data-mode="handout">
        <div class="slide-bar"><h3>Slide ${p.n}${p.status === 'draft' ? ' · draft' : ''}${p.leadOnly ? ' · lecture page only' : ''}</h3><div class="slide-ctl">${twoVersions(p) ? seg(`mode-${i}`, MODES, 'handout') : ''}</div></div>
        <div class="var-rows">
          ${lead && lead.VARIANTS.length > 1 ? `<div class="var-row" data-for="lecture"><span>Lecture</span>${seg(`lead-${i}`, lead.VARIANTS)}</div>` : ''}
          ${p.variants.length > 1 && !p.leadOnly ? `<div class="var-row" data-for="${lead ? 'handout' : 'both'}"><span>${lead ? 'Handout' : 'Figure'}</span>${seg(`variant-${i}`, p.variants)}</div>` : ''}
        </div>
        ${lead ? `<div class="lead-part">${frame(i, 'lead')}${noteBox(`lead-${p.n}`, `slide ${p.n} lecture page`)}</div>` : ''}
        ${p.leadOnly ? '' : `${frame(i, 'handout')}${noteBox(p.n, `slide ${p.n}`)}`}
      </section>`;
    }).join('')}</div>
  </section>
  ${ANIMATIONS.filter(a => a.key === animQuery).map(a => `<section class="block anim-block">
    <div class="frame anim-frame" data-a="${ANIMATIONS.indexOf(a)}"><div></div></div>
  </section>`).join('')}`;

// Paper grain for the animation's Plate look, matching the lecture's canvas texture.
const g = document.createElement('canvas');
g.width = g.height = 160;
const gc = g.getContext('2d');
if (gc) { gc.fillStyle = grain(gc); gc.fillRect(0, 0, 160, 160); }
document.documentElement.style.setProperty('--grain', `url(${g.toDataURL()})`);
installPapers(document.documentElement);

const state = {
  variants: PLATES.map(p => p.variants[0].id),
  leads: PLATES.map(p => LEADS[p.n]?.VARIANTS[0].id ?? ''),
  modes: PLATES.map((p): Mode => (p.leadOnly ? 'lecture' : 'handout')),
};
const shown = (i: number, kind: Kind): string => (kind === 'lead' ? state.leads[i] : state.variants[i]);

// Solo view for screenshots: ?solo=<page>&v=<variant> shows one page at full size. <page> is the slide number
// (1–15, C1–C13) for the handout version, lecture-<n> for the lecture version and lead-<n> for a lead page
// (a slide with a lead page has no separate lecture page).
const query = new URLSearchParams(location.search);
const [, soloPrefix, soloN] = /^(?:(lead|lecture)-)?(.+)$/.exec(query.get('solo') ?? '') ?? [];
const solo = soloN === undefined ? -1 : PLATES.findIndex((p, i) => p.n === soloN || `${i}` === soloN);
if (solo >= 0) {
  const kind = (soloPrefix === 'lead' || (soloPrefix === 'lecture' && LEADS[PLATES[solo].n]) ? soloPrefix : 'handout') as Kind;
  document.body.classList.add('solo');
  state.modes[solo] = kind === 'handout' ? 'handout' : 'lecture';
  const v = query.get('v');
  if (v && kind === 'lead') state.leads[solo] = v;
  else if (v) state.variants[solo] = v;
  app.querySelector(`.plates .frame[data-s="${solo}"][data-kind="${kind}"]`)?.classList.add('solo-frame');
}

// Animations: each shows one staging variant at a time. ?anim=<key>&v=<id>&beat=<n>&t=<s> shows one beat at full
// size, frozen t seconds in (a large t gives the beat's end state), for screenshots.
const soloAnim = ANIMATIONS.findIndex(a => a.key === query.get('anim'));
const stagings = ANIMATIONS.map((a, i) => (i === soloAnim && a.stagings.find(s => s.id === query.get('v'))?.id) || a.stagings[0].id);
const stopAnim = ANIMATIONS.map(() => (): void => undefined);
if (soloAnim >= 0) {
  document.body.classList.add('solo');
  app.querySelector(`.anim-frame[data-a="${soloAnim}"]`)?.classList.add('solo-frame');
}
function showAnim(i: number): void {
  const a = ANIMATIONS[i], s = a.stagings.find(x => x.id === stagings[i]) ?? a.stagings[0];
  stopAnim[i]();
  const host = app.querySelector(`.anim-frame[data-a="${i}"]`)?.firstElementChild as HTMLElement | null;
  if (!host) return;
  const solo = i === soloAnim;
  stopAnim[i] = mountAnimation(host, a, s, solo ? { beat: Number(query.get('beat') ?? 0), freeze: query.has('t') ? Number(query.get('t')) : undefined } : {});
  app.querySelectorAll<HTMLElement>(`[data-group="anim-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === s.id}`));
}

// Only the version on show is drawn: the lecture and handout copies of a figure share their SVG ids, and an
// arrowhead found first in a hidden copy would not render in the visible one.
const isShown = (i: number, kind: Kind): boolean => (kind === 'handout') === (state.modes[i] === 'handout');

function render(): void {
  app.querySelectorAll<HTMLElement>('.plates .frame').forEach(fr => {
    const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind, p = PLATES[i];
    const plate = fr.firstElementChild as HTMLElement;
    plate.className = 'plate theme-editorial lay-figure paper-bristol';
    // A slide without a lead page is one page: the handout with its play button (print hides the button).
    plate.innerHTML = !isShown(i, kind) ? '' : kind === 'lead' ? leadHtml(p, LEADS[p.n].draw(state.leads[i])) : twoVersions(p) ? plateHtml(p, state.variants[i]) : lectureHtml(p, state.variants[i]);
  });
  fitPage(app);
  syncPicks();
}

/** Shows each slide in its chosen version and keeps the switches in step; "All slides" lights up only when they agree. */
function applyModes(): void {
  app.querySelectorAll<HTMLElement>('.plates .slide').forEach(sec => {
    const i = Number(sec.dataset.s);
    sec.dataset.mode = state.modes[i];
    sec.querySelectorAll<HTMLElement>(`[data-group="mode-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.modes[i]}`));
    sec.querySelectorAll<HTMLElement>(`[data-group="variant-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.variants[i]}`));
    sec.querySelectorAll<HTMLElement>(`[data-group="lead-${i}"] button`).forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === state.leads[i]}`));
  });
  render();
  fit();
}

// Picks: a ✓ on each picked variant's button, an outline on a page whose shown variant is picked, and the notes.
const store = pickStore(app.querySelector('.pick-status') as HTMLElement, () => { syncPicks(); openOnPicks(); refs.sync(); hooks.sync(); });
/** Once the saved picks are in, each slide and animation opens on its first picked variant (in list order), unless the
 *  page was opened on a given variant (?v=…). Runs once, so later picks don't jump the page under the lecturer. */
let pickedDefaults = false;
function openOnPicks(): void {
  if (pickedDefaults || !store.loaded) return;
  pickedDefaults = true;
  if (query.has('v')) return;
  PLATES.forEach((p, i) => {
    const v = p.variants.find(x => store.has(p.n, x.id)), lv = LEADS[p.n]?.VARIANTS.find(x => store.has(`lead-${p.n}`, x.id));
    if (v) state.variants[i] = v.id;
    if (lv) state.leads[i] = lv.id;
  });
  ANIMATIONS.forEach((a, i) => {
    const sv = a.stagings.find(x => store.has(`anim-${a.key}`, x.id));
    if (sv) stagings[i] = sv.id;
  });
  applyModes();
  ANIMATIONS.forEach((_, i) => { if (soloAnim < 0 || i === soloAnim) showAnim(i); });
}
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
  ANIMATIONS.forEach((a, i) => {
    app.querySelectorAll<HTMLElement>(`[data-group="anim-${i}"] button`).forEach(b => b.classList.toggle('picked', store.has(`anim-${a.key}`, b.dataset.v as string)));
    app.querySelector(`.anim-frame[data-a="${i}"]`)?.classList.toggle('is-picked', store.has(`anim-${a.key}`, stagings[i]));
  });
  app.querySelectorAll<HTMLTextAreaElement>('.pick-note').forEach(box => {
    if (document.activeElement !== box) box.value = store.note(box.dataset.n as string);
  });
}
app.addEventListener('dblclick', e => {
  const af = (e.target as Element).closest('.anim-frame') as HTMLElement | null;
  if (af && !(e.target as Element).closest('button, a')) {
    const i = Number(af.dataset.a), key = `anim-${ANIMATIONS[i].key}`;
    store.set(key, stagings[i], !store.has(key, stagings[i]));
    return;
  }
  const fr = (e.target as Element).closest('.plates .frame') as HTMLElement | null;
  if (!fr || (e.target as Element).closest('.ref-open, .hook-open')) return;
  const i = Number(fr.dataset.s), kind = fr.dataset.kind as Kind;
  store.set(pickKey(i, kind), shown(i, kind), !store.has(pickKey(i, kind), shown(i, kind)));
});
// A double-click on a page picks; it should not also select a word.
app.addEventListener('mousedown', e => { if (e.detail > 1 && (e.target as Element).closest('.plates .frame, .anim-frame')) e.preventDefault(); });
app.addEventListener('input', e => {
  const t = e.target as HTMLTextAreaElement;
  if (t.classList.contains('pick-note')) store.setNote(t.dataset.n as string, t.value);
});


app.addEventListener('click', e => {
  const b = (e.target as Element).closest('button');
  if (!b) return;
  if (b.hasAttribute('data-play-excitation')) { playExcitation(); return; }
  if (b.dataset.play) { play(b.dataset.play); return; }
  if (b.dataset.refs) { const ids = boardsFor(b.dataset.refs).map(x => x.id); refs.show(ids[0], ids); return; }
  if (b.hasAttribute('data-refs-index')) { refs.show(null); return; }
  if (b.dataset.hooks) { const ids = hooksFor(b.dataset.hooks).map(x => x.id); hooks.show(ids[0], ids); return; }
  if (b.hasAttribute('data-hooks-index')) { hooks.show(null); return; }
  const group = (b.closest('.seg') as HTMLElement | null)?.dataset.group;
  const v = b.dataset.v;
  if (!group || !v) return;
  b.parentElement?.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', `${x === b}`));
  if (group === 'view') {
    lectureMode = v === 'lecture';
    document.body.classList.toggle('lecture-mode', lectureMode);
    return;
  }
  if (group.startsWith('mode-')) { state.modes[Number(group.slice(5))] = v as Mode; applyModes(); }
  // A variant opens the version it belongs to: lead variants the lecture version, figure variants the handout
  // (on a slide without a lead page both versions show the figure, so the version stays as it is).
  else if (group.startsWith('variant-')) {
    const i = Number(group.slice(8));
    state.variants[i] = v;
    if (LEADS[PLATES[i].n] && !PLATES[i].leadOnly) state.modes[i] = 'handout';
    applyModes();
  } else if (group.startsWith('lead-')) {
    const i = Number(group.slice(5));
    state.leads[i] = v;
    state.modes[i] = 'lecture';
    applyModes();
  } else if (group.startsWith('anim-')) {
    const i = Number(group.slice(5));
    stagings[i] = v;
    showAnim(i);
    syncPicks();
  }
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
// A slide's play button runs its animation over the page, as in the lecture, fitted to the window. It plays the staging
// picked on this page (else the one shown in its animation block) and names it on the button; the bar over the player
// names it again and switches between the variants. Esc or the close button returns to the slide.
const player = document.createElement('div');
player.className = 'player';
player.hidden = true;
player.innerHTML = `<div class="player-bar"><span class="player-title"></span><div class="seg player-seg"></div></div>
  <div class="player-frame"><div></div></div><button type="button" class="player-close" aria-label="Close">×</button>`;
document.body.append(player);
let stopPlayer = (): void => undefined, playing = -1;
/** The staging a play button runs: the first picked, else the one shown in the animation's block. */
const playStaging = (i: number): Staging => {
  const a = ANIMATIONS[i];
  return a.stagings.find(x => store.has(`anim-${a.key}`, x.id)) ?? a.stagings.find(x => x.id === stagings[i]) ?? a.stagings[0];
};
function fitPlayer(): void {
  const bar = 72, k = Math.min(innerWidth / 1600, (innerHeight - bar) / 900), fr = player.querySelector('.player-frame') as HTMLElement;
  fr.style.width = `${1600 * k}px`;
  fr.style.height = `${900 * k}px`;
  (fr.firstElementChild as HTMLElement).style.transform = `scale(${k})`;
}
/** Takes an animation's block copy off the page (or puts it back): a staging's SVG ids are fixed, and with two copies
 *  mounted the player would pick up the hidden copy's filters and masks (as happened on 26 Oct 2026). */
function blockCopy(i: number, on: boolean): void {
  if (i < 0) return;
  if (on) { showAnim(i); return; }
  stopAnim[i]();
  stopAnim[i] = (): void => undefined;
  const host = app.querySelector(`.anim-frame[data-a="${i}"]`)?.firstElementChild as HTMLElement | null;
  if (host) host.innerHTML = '';
}
function mountPlaying(s: Staging): void {
  const a = ANIMATIONS[playing], host = player.querySelector('.player-frame > div') as HTMLElement;
  stopPlayer();
  blockCopy(playing, false);
  stopPlayer = mountAnimation(host, a, s);
  (player.querySelector('.player-title') as HTMLElement).textContent = a.title;
  player.querySelectorAll<HTMLElement>('.player-seg button').forEach(b => b.setAttribute('aria-pressed', `${b.dataset.v === s.id}`));
  host.focus();
}
function play(key: string): void {
  playing = ANIMATIONS.findIndex(a => a.key === key);
  if (playing < 0) return;
  const a = ANIMATIONS[playing];
  (player.querySelector('.player-seg') as HTMLElement).innerHTML = a.stagings
    .map(x => `<button type="button" data-v="${x.id}" class="${store.has(`anim-${a.key}`, x.id) ? 'picked' : ''}">${x.name}</button>`).join('');
  player.hidden = false;
  fitPlayer();
  mountPlaying(playStaging(playing));
}
/** Slide 6's older "Follow an excitation" animation (its own controls), in the same player. */
function playExcitation(): void {
  playing = -1;
  (player.querySelector('.player-seg') as HTMLElement).innerHTML = '';
  (player.querySelector('.player-title') as HTMLElement).textContent = 'Follow an excitation';
  player.hidden = false;
  fitPlayer();
  stopPlayer();
  const host = player.querySelector('.player-frame > div') as HTMLElement, stage = document.createElement('div');
  host.innerHTML = '';
  host.append(stage);
  stopPlayer = mountExcitation(stage, 'plate');
  stage.focus();
}
function closePlayer(): void {
  stopPlayer();
  stopPlayer = (): void => undefined;
  (player.querySelector('.player-frame > div') as HTMLElement).innerHTML = '';
  player.hidden = true;
  blockCopy(playing, true);
}
player.addEventListener('click', e => {
  const v = (e.target as Element).closest<HTMLElement>('.player-seg button')?.dataset.v;
  if (v) { const s = ANIMATIONS[playing].stagings.find(x => x.id === v); if (s) mountPlaying(s); return; }
  if (e.target === player || (e.target as Element).closest('.player-close')) closePlayer();
});
// In picking mode a double-click on the playing animation picks (or unpicks) its variant; the switch marks it with a ✓.
player.addEventListener('dblclick', e => {
  if (lectureMode || playing < 0 || !(e.target as Element).closest('.player-frame')) return;
  const a = ANIMATIONS[playing], v = (player.querySelector('.player-seg [aria-pressed="true"]') as HTMLElement | null)?.dataset.v;
  if (!v) return;
  store.set(`anim-${a.key}`, v, !store.has(`anim-${a.key}`, v));
  player.querySelectorAll<HTMLElement>('.player-seg button').forEach(b => b.classList.toggle('picked', store.has(`anim-${a.key}`, b.dataset.v as string)));
});
player.addEventListener('mousedown', e => { if (e.detail > 1) e.preventDefault(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !player.hidden) closePlayer(); });
addEventListener('resize', () => { if (!player.hidden) fitPlayer(); });

// References over the page: a page's button opens its boards (tabs when several), the top bar the index of all boards.
// ?refs=<board-id> opens that board on load (an unknown id opens the index).
const refsRoot = document.createElement('div');
document.body.append(refsRoot);
const refs = refsView(refsRoot, store, { overlay: true });
if (query.has('refs')) refs.show(refBoard(query.get('refs') as string) ? query.get('refs') : null);

// Hook questions over the page: a page's ? button opens its chunk (tabs when several), the top bar the index of all
// chunks. ?hooks=<chunk-id> opens that chunk on load (an unknown id opens the index).
const hooksRoot = document.createElement('div');
document.body.append(hooksRoot);
const hooks = hooksView(hooksRoot, store);
if (query.has('hooks')) hooks.show(hookSet(query.get('hooks') as string) ? query.get('hooks') : null);

applyModes();
ANIMATIONS.forEach((_, i) => { if (soloAnim < 0 || i === soloAnim) showAnim(i); });

