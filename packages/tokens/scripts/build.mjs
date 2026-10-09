// Builds @bek/tokens from the Figma export in ../figma.
//   dist/tokens.css      CSS custom properties (--bek-*): Light/Dark, Mobile/Tablet/Web, text styles, effects
//   dist/tailwind.css    Tailwind v4 @theme mapping onto the --bek-* variables
//   dist/tokens.json     W3C DTCG tokens (resolved values per mode, with Figma aliases kept as $extensions)
//   dist/index.js/.d.ts  Typed JS: token names, CSS var names, resolved values, breakpoints
// Run: node scripts/build.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BREAKPOINTS, ROOT, cssVar, formatValue, load, round } from './lib.mjs';

const { colors, dimensions, typo, styles } = load();
const OUT = join(ROOT, 'dist');
mkdirSync(OUT, { recursive: true });

// Figma-only tokens never reach code.
const publicColors = colors.filter((c) => !c.name.startsWith('_doc/'));

const decl = (name, value) => `  ${cssVar(name)}: ${value};`;
const block = (selector, lines) => `${selector} {\n${lines.join('\n')}\n}`;

// ---------- colour ----------
const colorLines = (mode) => publicColors.map((c) => decl(c.name, c[mode]));

// ---------- dimension + typography per device ----------
const deviceLines = (i, onlyChanged) => {
  const all = [...dimensions, ...typo];
  return all
    .filter((t) => !onlyChanged || formatValue(t.name, t.values[i]) !== formatValue(t.name, t.values[i - 1]))
    .map((t) => decl(t.name, formatValue(t.name, t.values[i])));
};

// ---------- text styles ----------
const textStyleClass = (name) => `.bek-text-${name.toLowerCase().replace(/[ /]+/g, '-')}`;
const textStyleRules = styles.textStyles.map(([name, key, weight, family]) =>
  block(textStyleClass(name), [
    `  font-family: var(${cssVar(`family/${family}`)});`,
    `  font-weight: var(${cssVar(`weight/${weight}`)});`,
    `  font-size: var(${cssVar(`type/${key}/size`)});`,
    `  line-height: var(${cssVar(`type/${key}/line-height`)});`,
    `  letter-spacing: var(${cssVar(`type/${key}/tracking`)});`,
  ]),
);

// ---------- effects ----------
const effectVar = (name) => `--bek-${name.toLowerCase().replace(/^elevation\/(\w+).*$/, 'elevation-$1').replace(/^glass\//, 'glass-effect-')}`;
const shadowValue = (layers) =>
  layers
    .filter((l) => l.type === 'drop' || l.type === 'inner')
    .map(
      (l) =>
        `${l.type === 'inner' ? 'inset ' : ''}${round(l.x)}px ${round(l.y)}px ${round(l.blur)}px ${round(l.spread)}px var(${cssVar(l.color)})`,
    )
    .join(', ');
const effectLines = Object.entries(styles.effectStyles).map(([name, layers]) => decl0(effectVar(name), shadowValue(layers)));
function decl0(prop, value) {
  return `  ${prop}: ${value};`;
}
const glassRules = Object.entries(styles.effectStyles)
  .filter(([name]) => name.startsWith('Glass/'))
  .map(([name, layers]) => {
    const bd = layers.find((l) => l.type === 'backdrop');
    return block(`.bek-${name.toLowerCase().replace('/', '-')}`, [
      `  background-color: var(${cssVar(bd.fill)});`,
      `  -webkit-backdrop-filter: blur(${bd.blur}px) saturate(180%);`,
      `  backdrop-filter: blur(${bd.blur}px) saturate(180%);`,
      `  box-shadow: var(${effectVar(name)});`,
    ]);
  });

// ---------- code-only tokens (not in Figma; see README) ----------
const codeOnly = [
  '  --bek-focus-ring-width: var(--bek-stroke-focus);',
  '  --bek-focus-ring-offset: 2px;',
  '  --bek-focus-ring-color: var(--bek-border-focus);',
  '  --bek-z-base: 0;',
  '  --bek-z-raised: 10;',
  '  --bek-z-sticky: 100;',
  '  --bek-z-overlay: 1000;',
  '  --bek-z-modal: 1100;',
  '  --bek-z-popover: 1200;',
  '  --bek-z-toast: 1300;',
  '  --bek-z-tooltip: 1400;',
];

const header = `/* @bek/tokens — generated from Figma (BEK Design System, Tokens v3). Do not edit by hand. */`;
const darkSel = ':root[data-theme="dark"], [data-theme="dark"]';
const css = [
  header,
  block(':root', [
    '  color-scheme: light;',
    ...colorLines('light'),
    ...deviceLines(0, false),
    ...effectLines,
    ...codeOnly,
  ]),
  `@media (min-width: ${BREAKPOINTS.tablet}px) {\n${block(':root', deviceLines(1, true))}\n}`,
  `@media (min-width: ${BREAKPOINTS.web}px) {\n${block(':root', deviceLines(2, true))}\n}`,
  `/* Dark: follows the OS unless the page pins data-theme="light". */\n@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', ['  color-scheme: dark;', ...colorLines('dark')])}\n}`,
  block(darkSel, ['  color-scheme: dark;', ...colorLines('dark')]),
  block('[data-theme="light"]', ['  color-scheme: light;', ...colorLines('light')]),
  '/* Text styles (Figma text styles, one class each). */',
  ...textStyleRules,
  '/* Liquid Glass approximation. */',
  ...glassRules,
  `/* Focus: one style for every interactive element (matches Figma _Focus ring). */\n.bek-focus-ring:focus-visible {\n  outline: var(--bek-focus-ring-width) solid var(--bek-focus-ring-color);\n  outline-offset: var(--bek-focus-ring-offset);\n}`,
  `@media (prefers-reduced-motion: reduce) {\n  :root {\n    --bek-motion-duration-xs: 0ms;\n    --bek-motion-duration-sm: 0ms;\n    --bek-motion-duration-md: 0ms;\n    --bek-motion-duration-lg: 0ms;\n  }\n}`,
].join('\n\n');
writeFileSync(join(OUT, 'tokens.css'), css + '\n');

// ---------- Tailwind v4 ----------
const tw = (prefix, name, strip) => `  --${prefix}-${name.replace(strip, '').replace(/\//g, '-')}: var(${cssVar(name)});`;
const twLines = [
  ...publicColors.filter((c) => !c.name.startsWith('brand/') || true).map((c) => tw('color', c.name, /^$/)),
  ...dimensions.filter((d) => d.name.startsWith('scale/') && d.name !== 'scale/full').map((d) => tw('spacing', d.name, 'scale/')),
  ...dimensions.filter((d) => d.name.startsWith('radius/')).map((d) => tw('radius', d.name, 'radius/')),
  ...dimensions.filter((d) => d.name.startsWith('control/height/')).map((d) => tw('height', d.name, 'control/height/')),
  `  --font-sans: var(${cssVar('family/sans')});`,
  `  --font-mono: var(${cssVar('family/mono')});`,
  `  --ease-standard: var(${cssVar('motion/easing/standard')});`,
  `  --breakpoint-tablet: ${BREAKPOINTS.tablet}px;`,
  `  --breakpoint-web: ${BREAKPOINTS.web}px;`,
  ...Object.keys(styles.effectStyles)
    .filter((n) => n.startsWith('Elevation/'))
    .map((n) => `  --shadow-${effectVar(n).replace('--bek-', '')}: var(${effectVar(n)});`),
];
writeFileSync(
  join(OUT, 'tailwind.css'),
  `/* @bek/tokens — Tailwind v4 theme. Import after tokens.css:\n   @import "@bek/tokens/tokens.css"; @import "@bek/tokens/tailwind.css"; */\n@theme inline {\n${twLines.join('\n')}\n}\n`,
);

// ---------- DTCG JSON ----------
const setPath = (obj, path, leaf) => {
  const parts = path.split('/');
  let o = obj;
  for (const p of parts.slice(0, -1)) o = o[p] ??= {};
  o[parts.at(-1)] = leaf;
};
const dtcg = { $description: 'BEK Design System tokens (Tokens v3), generated from Figma.' };
const colorTree = {};
for (const c of publicColors)
  setPath(colorTree, c.name, {
    $type: 'color',
    $value: c.light,
    $description: c.description,
    $extensions: { 'uz.bek.modes': { light: c.light, dark: c.dark }, 'uz.bek.figma': c.alias },
  });
const dimType = (n) => (n.startsWith('motion/duration') ? 'duration' : n.startsWith('motion/easing') ? 'cubicBezier' : n === 'layout/grid/columns' ? 'number' : 'dimension');
const dimTree = {};
for (const d of [...dimensions, ...typo])
  setPath(dimTree, d.name, {
    $type: d.name.startsWith('family/') ? 'fontFamily' : d.name.startsWith('weight/') ? 'fontWeight' : dimType(d.name),
    $value: formatValue(d.name, d.values[0]),
    $extensions: {
      'uz.bek.modes': Object.fromEntries(['mobile', 'tablet', 'web'].map((m, i) => [m, formatValue(d.name, d.values[i])])),
      'uz.bek.figma': d.alias,
    },
  });
dtcg.color = colorTree;
dtcg.dimension = dimTree;
writeFileSync(join(OUT, 'tokens.json'), JSON.stringify(dtcg, null, 2) + '\n');

// ---------- JS + types ----------
const js = {
  breakpoints: BREAKPOINTS,
  color: Object.fromEntries(publicColors.map((c) => [c.name, { cssVar: cssVar(c.name), light: c.light, dark: c.dark }])),
  dimension: Object.fromEntries(
    [...dimensions, ...typo].map((d) => [
      d.name,
      { cssVar: cssVar(d.name), mobile: formatValue(d.name, d.values[0]), tablet: formatValue(d.name, d.values[1]), web: formatValue(d.name, d.values[2]) },
    ]),
  ),
  textStyles: styles.textStyles.map(([name]) => ({ name, className: textStyleClass(name).slice(1) })),
};
writeFileSync(
  join(OUT, 'index.js'),
  `// Generated by @bek/tokens. Do not edit.\nexport const tokens = ${JSON.stringify(js, null, 2)};\nexport const breakpoints = tokens.breakpoints;\n/** var(--bek-…) reference for a token name, e.g. v('accent/default'). */\nexport const v = (name) => \`var(--bek-\${name.replace(/\\//g, '-')})\`;\nexport default tokens;\n`,
);
const union = (names) => names.map((n) => `'${n}'`).join(' | ');
writeFileSync(
  join(OUT, 'index.d.ts'),
  `// Generated by @bek/tokens. Do not edit.
export type ColorToken = ${union(publicColors.map((c) => c.name))};
export type DimensionToken = ${union([...dimensions, ...typo].map((d) => d.name))};
export type TextStyle = ${union(styles.textStyles.map(([n]) => n))};
export type Token = ColorToken | DimensionToken;
export interface ColorValue { cssVar: string; light: string; dark: string }
export interface DimensionValue { cssVar: string; mobile: string; tablet: string; web: string }
export declare const tokens: {
  breakpoints: { tablet: ${BREAKPOINTS.tablet}; web: ${BREAKPOINTS.web} };
  color: Record<ColorToken, ColorValue>;
  dimension: Record<DimensionToken, DimensionValue>;
  textStyles: { name: TextStyle; className: string }[];
};
export declare const breakpoints: typeof tokens.breakpoints;
/** var(--bek-…) reference for a token name, e.g. v('accent/default'). */
export declare const v: (name: Token) => string;
export default tokens;
`,
);

console.log(
  `@bek/tokens: ${publicColors.length} colour, ${dimensions.length} dimension, ${typo.length} typography tokens, ${styles.textStyles.length} text styles, ${Object.keys(styles.effectStyles).length} effects → dist/`,
);
