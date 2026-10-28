// Hook questions: for each chunk of the lecture, the candidate questions it could open with, each with the steps by
// which the lecture would answer it. A chunk is a file src/pilot/hooks/<chunk-id>.json; a new file shows after a
// reload, with no code change.
//   { "title": "…", "chunk": "Lecture 1 · chunk 3", "slides": ["6"], "questions": [{ "id": "a", "question": "…",
//     "story": "…", "steps": ["…"], "concepts": ["…"], "see": "…", "status": "…" }] }
// "slides" names the pages the chunk is for, as page keys ('6', 'lead-1', 'C3'); its ? button shows on those pages.
// "story" (optional) tells how scientists found the answer out.

export interface HookQuestion {
  id: string;
  question: string;
  /** How scientists found it out; empty when the file gives none. */
  story: string;
  steps: string[];
  concepts: string[];
  /** What the students see while the question is answered. */
  see: string;
  /** What is still to check. */
  status: string;
}
export interface HookSet {
  /** The file name; picks (question ids) and the note save under hook-<id>. */
  id: string;
  title: string;
  /** Where the chunk sits in the lecture, e.g. 'Lecture 1 · chunk 3'. */
  chunk: string;
  slides: string[];
  questions: HookQuestion[];
}

interface Manifest { title?: string; chunk?: string; slides?: unknown; questions?: Array<Partial<HookQuestion>> }

const manifests = import.meta.glob<Manifest>('./hooks/*.json', { eager: true, import: 'default' });
const strings = (x: unknown): string[] => (Array.isArray(x) ? x.map(String) : []);

/** Chunks in id order ('L2' before 'L10'). */
export const HOOK_SETS: HookSet[] = Object.entries(manifests).map(([path, m]): HookSet => {
  const id = path.slice(path.lastIndexOf('/') + 1, -'.json'.length);
  return {
    id,
    title: m.title ?? id,
    chunk: m.chunk ?? '',
    slides: strings(m.slides),
    questions: (m.questions ?? []).map((q, i) => ({
      id: String(q.id ?? i + 1),
      question: q.question ?? '',
      story: q.story ?? '',
      steps: strings(q.steps),
      concepts: strings(q.concepts),
      see: q.see ?? '',
      status: q.status ?? '',
    })),
  };
}).sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

export const hookSet = (id: string): HookSet | undefined => HOOK_SETS.find(h => h.id === id);
/** The pick-store key of a chunk's picks (question ids) and note. */
export const hookKey = (id: string): string => `hook-${id}`;
/** The chunks whose file lists the page. */
export const hooksFor = (page: string): HookSet[] => HOOK_SETS.filter(h => h.slides.includes(page));
