// WCAG contrast check for the semantic colour pairs BEK promises (Figma 1.6 Accessibility).
// Fails (exit 1) if any required pair drops below its threshold in Light or Dark.
// Run: node scripts/check-contrast.mjs

import { contrast, load, over, parseHex } from './lib.mjs';

const { colors } = load();
const C = Object.fromEntries(colors.map((c) => [c.name, c]));

const NEUTRAL_BG = ['bg/sheet', 'bg/base', 'surface/card', 'surface/raised', 'fill/primary'];
const TEXT = ['text/primary', 'text/secondary', 'text/tertiary', 'text/accent', 'text/danger', 'text/success', 'text/warning', 'text/info', 'text/utility'];

/** [fg, bg, min, note] — bg is composited over bg/sheet first when translucent. */
const pairs = [];
for (const t of TEXT) for (const b of NEUTRAL_BG) pairs.push([t, b, 4.5]);
for (const s of ['danger', 'success', 'info', 'utility']) pairs.push(['text/on-color', `status/${s}/default`, 4.5]);
pairs.push(['text/on-color', 'accent/default', 4.5]);
pairs.push(['text/on-warning', 'status/warning/default', 4.5]);
pairs.push(['text/inverse', 'fill/inverse', 4.5]);
for (const s of ['danger', 'success', 'warning', 'info']) pairs.push([`text/${s}`, `status/${s}/soft`, 4.5]);
pairs.push(['text/accent', 'accent/soft', 4.5]);
// Non-text (WCAG 1.4.11): focus ring against neutral surfaces.
for (const b of NEUTRAL_BG) pairs.push(['border/focus', b, 3]);

// Known gaps that live in Figma, not in this package. Each is reported on every run;
// remove the entry once the Figma token is fixed and re-exported.
const KNOWN = {};

let fails = 0;
const rows = [];
for (const mode of ['light', 'dark']) {
  const sheet = parseHex(C['bg/sheet'][mode]);
  for (const [fg, bg, min] of pairs) {
    if (!C[fg] || !C[bg]) throw new Error(`Unknown token in pair ${fg} / ${bg}`);
    const b = over(parseHex(C[bg][mode]), sheet);
    const f = over(parseHex(C[fg][mode]), b);
    const r = contrast(f, b);
    const ok = r >= min;
    const known = KNOWN[`${mode} ${fg} on ${bg}`];
    if (!ok && !known) fails++;
    rows.push({ mode, fg, bg, ratio: r.toFixed(2), min, ok, known });
  }
}

for (const r of rows.filter((r) => !r.ok))
  console.log(`${r.known ? 'KNOWN' : 'FAIL '} ${r.mode.padEnd(5)} ${r.fg} on ${r.bg}: ${r.ratio} < ${r.min}${r.known ? ` — ${r.known}` : ''}`);
const lowest = [...rows].sort((a, b) => a.ratio - b.ratio).slice(0, 5);
const passed = rows.filter((r) => r.ok).length;
const known = rows.filter((r) => !r.ok && r.known).length;
console.log(`Contrast: ${passed}/${rows.length} pairs pass${known ? `, ${known} known gap(s)` : ''}. Lowest: ${lowest.map((r) => `${r.fg} on ${r.bg} (${r.mode}) ${r.ratio}`).join('; ')}`);
process.exit(fails ? 1 : 0);
