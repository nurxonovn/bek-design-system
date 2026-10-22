// Figma Variables eksportini (figma/*.json) o'qib, dist/ ga tokenlarni yozadi.
//   - Color: Light → :root, Dark → [data-theme="dark"]
//   - Dimension, Typography: Mobile → :root, Tablet → @media (min-width: 600px),
//     Web → @media (min-width: 1024px). Media ichida faqat o'zgargan qiymatlar yoziladi.
//   - CSS nomi Figma'dagi codeSyntax.WEB dan olinadi (`fill/primary` → `--bek-fill-primary`).
//   - Palette va Typography primitives — xom qiymatlar; semantik tokenlarda ular
//     haqiqiy qiymatga aylantiriladi. Bir kolleksiya ichidagi alias esa var() bo'lib qoladi.
//   - Effect styles (Elevation/*) → --bek-elevation-*; text styles → dist/typography.css.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const figmaDir = join(root, 'figma');
const distDir = join(root, 'dist');
const HEADER = '/* BEK Design System — generated from Figma variables. Do not edit. */\n';

const BREAKPOINTS = { Mobile: null, Tablet: '(min-width: 600px)', Web: '(min-width: 1024px)' };
const THEMES = { Light: ':root', Dark: '[data-theme="dark"]' };
const FONT_FALLBACKS = {
  Inter: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  'Roboto Mono': 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};
const FONT_WEIGHTS = {
  Thin: 100,
  'Extra Light': 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  'Semi Bold': 600,
  Bold: 700,
  'Extra Bold': 800,
  Black: 900,
};

// --- Manba ---------------------------------------------------------------

const sources = readdirSync(figmaDir).filter((f) => f.endsWith('.json'));
const readJson = (file) => JSON.parse(readFileSync(join(figmaDir, file), 'utf8'));
const collections = {};
let styles = { textStyles: [], effectStyles: [], paintStyles: [] };
for (const file of sources) {
  const data = readJson(file);
  if (data.collection) collections[data.collection] = data;
  else styles = { ...styles, ...data };
}

const index = new Map(); // 'Collection/name' → { collection, variable }
for (const collection of Object.values(collections)) {
  for (const variable of collection.variables) {
    index.set(`${collection.collection}/${variable.name}`, { collection, variable });
  }
}

const cssName = (variable) => {
  const match = /var\((--[\w-]+)\)/.exec(variable.codeSyntax?.WEB ?? '');
  return match ? match[1] : `--bek-${variable.name.replaceAll('/', '-')}`;
};

const seen = new Map();
for (const [key, { collection, variable }] of index) {
  if (variable.hiddenFromPublishing || collection.modes.length === 1) continue;
  const name = cssName(variable);
  if (seen.has(name)) throw new Error(`CSS nomi takrorlandi: ${name} (${seen.get(name)}, ${key})`);
  seen.set(name, key);
}

const lookup = (ref) => {
  const hit = index.get(ref);
  if (!hit) throw new Error(`Alias topilmadi: ${ref}`);
  return hit;
};
const modeFor = (collection, mode) =>
  collection.modes.includes(mode) ? mode : collection.modes[0];

// --- Qiymatlar -----------------------------------------------------------

const round = (n) => Number(n.toFixed(3));

function formatRaw(variable, value) {
  if (variable.type === 'COLOR') return value;
  if (variable.type === 'FLOAT') {
    if (variable.name.startsWith('motion/duration')) return `${round(value)}ms`;
    if (!variable.scopes?.length) return String(round(value));
    return value === 0 ? '0' : `${round(value)}px`;
  }
  if (variable.name.startsWith('family/')) {
    const fallback = FONT_FALLBACKS[value];
    return fallback ? `'${value}', ${fallback}` : `'${value}'`;
  }
  if (variable.name.startsWith('weight/')) {
    if (!(value in FONT_WEIGHTS)) throw new Error(`Noma'lum shrift og'irligi: ${value}`);
    return String(FONT_WEIGHTS[value]);
  }
  return String(value);
}

/** CSS uchun: o'z kolleksiyasidagi alias → var(), boshqasi → yakuniy qiymat. */
function cssValue(collection, variable, mode) {
  const value = variable.values[mode];
  if (value && typeof value === 'object' && '$alias' in value) {
    const target = lookup(value.$alias);
    const internal = target.collection === collection && !target.variable.hiddenFromPublishing;
    if (internal) return `var(${cssName(target.variable)})`;
    return cssValue(target.collection, target.variable, modeFor(target.collection, mode));
  }
  return formatRaw(variable, value);
}

/** JSON uchun: hamma alias yakuniy qiymatga aylantiriladi. */
function resolvedValue(collection, variable, mode) {
  const value = variable.values[mode];
  if (value && typeof value === 'object' && '$alias' in value) {
    const target = lookup(value.$alias);
    return resolvedValue(target.collection, target.variable, modeFor(target.collection, mode));
  }
  return formatRaw(variable, value);
}

const publicVars = (collection) => collection.variables.filter((v) => !v.hiddenFromPublishing);

// --- CSS -----------------------------------------------------------------

const block = (selector, lines, indent = '') =>
  `${indent}${selector} {\n${lines.map((l) => `${indent}  ${l}`).join('\n')}\n${indent}}\n`;

function modeBlocks(collection, selectorFor) {
  const out = [];
  let previous = null;
  for (const mode of collection.modes) {
    const lines = [];
    const current = {};
    for (const variable of publicVars(collection)) {
      const name = cssName(variable);
      const value = cssValue(collection, variable, mode);
      current[name] = value;
      if (!previous || previous[name] !== value) lines.push(`${name}: ${value};`);
    }
    if (lines.length) out.push(selectorFor(mode, lines));
    previous = current;
  }
  return out;
}

const responsive = (collection) =>
  modeBlocks(collection, (mode, lines) => {
    const media = BREAKPOINTS[mode];
    if (media === undefined) throw new Error(`Noma'lum qurilma rejimi: ${mode}`);
    return media ? `@media ${media} {\n${block(':root', lines, '  ')}}\n` : block(':root', lines);
  });

const themed = (collection) =>
  modeBlocks(collection, (mode, lines) => {
    const selector = THEMES[mode];
    if (!selector) throw new Error(`Noma'lum rang rejimi: ${mode}`);
    return block(selector, [`color-scheme: ${mode.toLowerCase()};`, ...lines]);
  });

const colorVarByName = new Map(
  publicVars(collections.Color).map((v) => [v.name, `var(${cssName(v)})`]),
);

function shadow(effect) {
  const color = effect.boundVariables?.color
    ? colorVarByName.get(effect.boundVariables.color)
    : effect.color;
  if (!color) throw new Error(`Soya rangi topilmadi: ${effect.boundVariables?.color}`);
  const [x, y] = effect.offset.map((n) => (n === 0 ? '0' : `${round(n)}px`));
  const px = (n) => (n === 0 ? '0' : `${round(n)}px`);
  const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
  return `${inset}${x} ${y} ${px(effect.radius)} ${px(effect.spread)} ${color}`;
}

const elevationName = (style) =>
  `--bek-elevation-${style.name.replace('Elevation/', '').split(' ')[0].toLowerCase()}`;
const elevations = styles.effectStyles.filter((s) => s.name.startsWith('Elevation/'));
const elevationLines = elevations.map(
  (s) =>
    `${elevationName(s)}: ${s.effects
      .filter((e) => e.type.endsWith('SHADOW'))
      .map(shadow)
      .join(', ')};`,
);

// --- Faqat kodda: layout, z-index, motion presetlari (src/constants.json) ---

const constants = JSON.parse(readFileSync(join(root, 'src/constants.json'), 'utf8'));
const constantLines = (groups) =>
  Object.entries(groups)
    .filter(([group]) => !group.startsWith('$'))
    .flatMap(([group, values]) =>
      Object.entries(values)
        .filter(([key]) => !key.startsWith('$'))
        .map(([key, value]) => `--bek-${group}-${key}: ${value};`),
    );
const { reducedMotion, ...constantGroups } = constants;

// --- Glass materiallari (1.9 Materials): Glass/* effect styles → .bek-glass-* ---

const glassStyles = styles.effectStyles.filter((s) => s.name.startsWith('Glass/'));
const GLASS_FILL = {
  Regular: 'linear-gradient(var(--bek-glass-tint-shade) 0 0), var(--bek-glass-tint)',
  Small: 'var(--bek-glass-tint-clear)',
  Clear: 'var(--bek-glass-tint-clear)',
};
const glassCss = [
  HEADER,
  '/* Web glass — backdrop-filter bilan yaqinlashuv; refraction va dispersion faqat Figma/native. */',
  ...glassStyles.map((style) => {
    const kind = style.name.replace('Glass/', '');
    const blur = style.effects.find((e) => e.type === 'GLASS')?.radius ?? 0;
    // Faqat tokenlarga bog'langan soyalar: ko'tarilish soyasi, 0.5px rim, yuqori chekka yorug'ligi.
    const shadows = style.effects
      .filter((e) => e.type.endsWith('SHADOW') && e.boundVariables?.color)
      .map(shadow);
    const filter = `blur(${blur}px)${kind === 'Regular' ? ' saturate(180%)' : ''}`;
    return block(`.bek-glass-${kind.toLowerCase()}`, [
      `background: ${GLASS_FILL[kind] ?? 'var(--bek-glass-tint)'};`,
      `-webkit-backdrop-filter: ${filter};`,
      `backdrop-filter: ${filter};`,
      `box-shadow: ${shadows.join(', ')};`,
    ]);
  }),
  `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {\n${block(
    glassStyles
      .map((s) => `.bek-glass-${s.name.replace('Glass/', '').toLowerCase()}`)
      .join(',\n  '),
    ['background: var(--bek-surface-card);'],
    '  ',
  )}}\n`,
  `@media (prefers-reduced-transparency: reduce) {\n${block(
    glassStyles
      .map((s) => `.bek-glass-${s.name.replace('Glass/', '').toLowerCase()}`)
      .join(',\n  '),
    [
      'background: var(--bek-surface-card);',
      '-webkit-backdrop-filter: none;',
      'backdrop-filter: none;',
    ],
    '  ',
  )}}\n`,
].join('\n');

const tokensCss = [
  HEADER,
  '/* Color — Light / Dark */',
  ...themed(collections.Color),
  '/* Dimension — Mobile / Tablet (≥600) / Web (≥1024) */',
  ...responsive(collections.Dimension),
  '/* Typography — Mobile / Tablet (≥600) / Web (≥1024) */',
  ...responsive(collections.Typography),
  '/* Elevation (Figma effect styles) */',
  block(':root', elevationLines),
  '/* Layout, z-index, motion presets — code-only (Figma 1.5, 1.10) */',
  block(':root', constantLines(constantGroups)),
  `@media (prefers-reduced-motion: reduce) {\n${block(':root', constantLines(reducedMotion), '  ')}}\n`,
].join('\n');

const paletteCss = [
  HEADER,
  block(
    ':root',
    collections.Palette.variables.map(
      (v) => `${cssName(v)}: ${cssValue(collections.Palette, v, 'Value')};`,
    ),
  ),
].join('\n');

const typographyVarByName = new Map(
  publicVars(collections.Typography).map((v) => [v.name, `var(${cssName(v)})`]),
);
const textClass = (style) => `.bek-text-${style.name.toLowerCase().replace(/[/\s]+/g, '-')}`;
const TEXT_PROPS = [
  ['fontFamily', 'font-family'],
  ['fontStyle', 'font-weight'],
  ['fontSize', 'font-size'],
  ['lineHeight', 'line-height'],
  ['letterSpacing', 'letter-spacing'],
];
const typographyCss = [
  HEADER,
  ...styles.textStyles.map((style) =>
    block(
      textClass(style),
      TEXT_PROPS.map(([key, prop]) => {
        const bound = style.boundVariables?.[key];
        if (bound) {
          const ref = typographyVarByName.get(bound);
          if (!ref) throw new Error(`${style.name}: ${bound} topilmadi`);
          return `${prop}: ${ref};`;
        }
        if (key === 'fontStyle') return `${prop}: ${FONT_WEIGHTS[style.fontStyle]};`;
        if (key === 'fontFamily') return `${prop}: '${style.fontFamily}';`;
        return `${prop}: ${round(style[key])}px;`;
      }),
    ),
  ),
].join('\n');

// --- JSON ----------------------------------------------------------------

const resolvedModes = (collection) =>
  Object.fromEntries(
    collection.modes.map((mode) => [
      mode.toLowerCase(),
      Object.fromEntries(
        publicVars(collection).map((v) => [cssName(v), resolvedValue(collection, v, mode)]),
      ),
    ]),
  );

const tokensJson = {
  color: resolvedModes(collections.Color),
  dimension: resolvedModes(collections.Dimension),
  typography: resolvedModes(collections.Typography),
  elevation: Object.fromEntries(elevationLines.map((l) => l.slice(0, -1).split(': '))),
  constants: Object.fromEntries(
    constantLines(constantGroups).map((l) => l.slice(0, -1).split(': ')),
  ),
  textStyles: Object.fromEntries(
    styles.textStyles.map((s) => [
      textClass(s).slice(1),
      { family: s.fontFamily, weight: FONT_WEIGHTS[s.fontStyle], description: s.description },
    ]),
  ),
};

mkdirSync(distDir, { recursive: true });
writeFileSync(join(distDir, 'tokens.css'), tokensCss);
writeFileSync(join(distDir, 'palette.css'), paletteCss);
writeFileSync(join(distDir, 'typography.css'), typographyCss);
writeFileSync(join(distDir, 'materials.css'), glassCss);
writeFileSync(join(distDir, 'tokens.json'), JSON.stringify(tokensJson, null, 2) + '\n');

const count = (c) => publicVars(c).length;
console.log(
  `[@bek-ui/tokens] ${count(collections.Color)} color, ${count(collections.Dimension)} dimension, ` +
    `${count(collections.Typography)} typography, ${elevations.length} elevation, ` +
    `${styles.textStyles.length} text style, ${collections.Palette.variables.length} palette → dist/`,
);
