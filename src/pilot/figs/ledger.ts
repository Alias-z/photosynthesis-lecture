// The per-O₂ ledger of a slide's components (lecturer, 28 Oct 2026: "always calculate per oxygen how much proton in total and
// how much electron in total for every single component"): a small table of component · electrons · H⁺, set as the numbers
// block of a slide point. Per O₂ = 4 e⁻ from 2 H₂O, linear flow, the Q cycle at b₆f.
export type Row = [string, string, string];
export const ledger = (rows: Row[], total?: Row): string =>
  `<table class="p-led"><tr><th>per O₂</th><th>e⁻</th><th>H⁺</th></tr>${rows.map(([a, b, c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('')}${
    total ? `<tr class="p-led-tot"><td>${total[0]}</td><td>${total[1]}</td><td>${total[2]}</td></tr>` : ''}</table>`;

/** The per-3-CO₂ ledger of the Calvin–Benson–Bassham cycle's steps (lecturer, 28 Oct 2026): step · ATP · NADPH. */
export const ledgerC = (rows: Row[], total?: Row, unit = 'per 3 CO₂'): string =>
  `<table class="p-led"><tr><th>${unit}</th><th>ATP used</th><th>NADPH used</th></tr>${rows.map(([a, b, c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('')}${
    total ? `<tr class="p-led-tot"><td>${total[0]}</td><td>${total[1]}</td><td>${total[2]}</td></tr>` : ''}</table>`;

/** The per-2-O₂ ledger of photorespiration's costs (lecturer, 28 Oct 2026): step · ATP · reduced ferredoxin. */
export const ledgerP = (rows: Row[], total?: Row): string =>
  `<table class="p-led"><tr><th>per 2 O₂</th><th>ATP used</th><th>reduced ferredoxin used</th></tr>${rows.map(([a, b, c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('')}${
    total ? `<tr class="p-led-tot"><td>${total[0]}</td><td>${total[1]}</td><td>${total[2]}</td></tr>` : ''}</table>`;
