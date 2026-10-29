// The lecturer's picks on lecture day, as picks.json saved them (lecturer: "now you can delete all unpicked variants all
// over the place"): slides by their pick key, lead pages as lead-<n>, animations as anim-<key>. plates.ts keeps only the
// picked figures of each slide and lead page, anim/index.ts only the picked stagings of each animation; a slide whose
// picks match none of its figures keeps them all, an animation without a matching pick keeps the staging that plays.
export const DAY_PICKS: Record<string, string[]> = {
  "1": ["o"],
  "2": ["k"],
  "3": ["a", "e", "h", "x"],
  "4": ["e", "f", "h", "u"],
  "5": ["o"],
  "6": ["r1"],
  "7": ["wb", "7m1"],
  "8": ["8m1"],
  "9": ["9m1"],
  "10": ["l", "k", "a", "10m1"],
  "11": ["a2"],
  "12": ["b"],
  "lead-1": ["l"],
  "lead-2": ["a"],
  "5b": ["k"],
  "4b": ["m"],
  "4a": ["s"],
  "C6": ["a", "v10", "m3"],
  "C9": ["a"],
  "anim-sky": ["e"],
  "anim-antenna": ["a"],
  "anim-leaf": ["a"],
  "lead-5": ["a"],
  "lead-6": ["a"],
  "anim-cyclic": ["s1"],
  "anim-pp11": ["d"],
  "anim-rf6": ["a", "w1"],
  "anim-psii": ["m2"],
  "anim-b6f": ["pb"],
  "10b": ["11m2"],
  "anim-bridge": ["a"],
  "C0": ["b"],
  "C2": ["mr3"],
  "anim-c2story": ["s", "evoRc", "evoRh"],
  "anim-reduction": ["s"],
  "anim-lf10": ["lf10b"],
  "C1": ["m1"],
  "anim-cb1": ["story"],
  "C4": ["m3"],
  "C10n": ["n1c"],
  "anim-lf11a": ["c2sb3"],
  "C11a": ["r1"],
  "C10": ["r3"],
  "anim-lf12": ["c4m2"],
  "anim-eff": ["j"],
  "anim-ov": ["ove", "ovc"],
  "C10o": ["w3a"],
  "C12": ["r1"],
  "anim-pp12": ["b"],
  "C17": ["d"],
  "anim-lf13": ["lf13m"],
  "anim-cp9": ["r2"],
  "C4e": ["x1"],
  "C16": ["w8"],
  "END": ["owl"],
};

/** The picked entries of a list; when its picks match none of them (or it has none), the whole list, or with `first` only
 *  its first entry, the one that plays by default (animations). */
export function picked<T extends { id: string }>(key: string, list: T[], first = false): T[] {
  const k = DAY_PICKS[key], kept = k ? list.filter(x => k.includes(x.id)) : [];
  return kept.length ? kept : first ? list.slice(0, 1) : list;
}
