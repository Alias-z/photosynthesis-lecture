// The lecturer's figure picks, shared by the pilot page and the gallery: per slide, the variants picked
// and a note. The dev server keeps them in research/figure-briefs/picks.json through /__picks.
export interface SlidePicks { picks: string[]; note: string }
type Picks = Record<string, SlidePicks>;

export interface PickStore {
  has(n: string, v: string): boolean;
  note(n: string): string;
  set(n: string, v: string, on: boolean): void;
  setNote(n: string, text: string): void;
}

/** Loads the saved picks, calls `onChange` whenever they change, and saves edits shortly after they happen. */
export function pickStore(status: HTMLElement, onChange: () => void): PickStore {
  let picks: Picks = {};
  let timer = 0;
  const slide = (n: string): SlidePicks => (picks[n] ??= { picks: [], note: '' });

  function save(): void {
    clearTimeout(timer);
    status.textContent = 'Saving…';
    timer = window.setTimeout(async () => {
      try {
        const r = await fetch('/__picks', { method: 'POST', body: JSON.stringify({ savedAt: new Date().toISOString(), slides: picks }) });
        status.textContent = r.ok ? `Saved ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Not saved';
      } catch {
        status.textContent = 'Not saved';
      }
      timer = 0;
    }, 400);
  }

  // Re-read whenever the tab regains focus, so picks made on the other page are not overwritten.
  // An edit made while the file is being read wins: the click that focuses the tab may itself be a pick.
  let edits = 0;
  async function load(first: boolean): Promise<void> {
    if (timer) return;
    const before = edits;
    try {
      const saved = (await (await fetch('/__picks')).json()) as { slides?: Picks };
      if (edits !== before) return;
      picks = saved.slides ?? {};
      if (first && saved.slides) status.textContent = 'Loaded saved picks';
    } catch {
      // keep what is shown
    }
    onChange();
  }
  window.addEventListener('focus', () => void load(false));
  void load(true);

  return {
    has: (n, v) => picks[n]?.picks.includes(v) ?? false,
    note: n => picks[n]?.note ?? '',
    set(n, v, on) {
      const sp = slide(n);
      sp.picks = on ? [...new Set([...sp.picks, v])] : sp.picks.filter(x => x !== v);
      edits++;
      onChange();
      save();
    },
    setNote(n, text) {
      slide(n).note = text;
      edits++;
      save();
    },
  };
}
