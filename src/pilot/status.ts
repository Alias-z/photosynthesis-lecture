// Each slide's status (lecturer, 29 Oct 2026): frozen by the lecturer (the assistant leaves it alone) or being built by
// the assistant. The dev server keeps it in research/figure-briefs/status.json through /__status (scripts/status-plugin.mjs).
export interface Status { frozen: Record<string, boolean>; building: Record<string, string> }

export interface StatusStore {
  frozen(n: string): boolean;
  building(n: string): string;
  toggle(n: string): void;
}

/** Loads the status, calls `onChange` whenever it changes, re-reads it on focus and every 20 s (the assistant edits it). */
export function statusStore(onChange: () => void): StatusStore {
  let st: Status = { frozen: {}, building: {} };
  async function load(): Promise<void> {
    try {
      const s = (await (await fetch('/__status')).json()) as Partial<Status>;
      st = { frozen: s.frozen ?? {}, building: s.building ?? {} };
    } catch {
      // keep what is shown
    }
    onChange();
  }
  window.addEventListener('focus', () => void load());
  window.setInterval(() => void load(), 20000);
  void load();
  return {
    frozen: n => !!st.frozen[n],
    building: n => st.building[n] ?? '',
    toggle(n) {
      // only this slide's change goes to the server, which applies it to the saved list (a whole list from a page with
      // an old copy wiped freezes made elsewhere, 29 Oct 2026); the reply is the saved status
      const on = !st.frozen[n];
      st.frozen = { ...st.frozen, [n]: on };
      if (!on) delete st.frozen[n];
      onChange();
      void fetch('/__status', { method: 'POST', body: JSON.stringify({ n, on }) })
        .then(r => r.json() as Promise<Partial<Status>>)
        .then(s => { st = { frozen: s.frozen ?? {}, building: s.building ?? {} }; onChange(); })
        .catch(() => void load());
    },
  };
}
