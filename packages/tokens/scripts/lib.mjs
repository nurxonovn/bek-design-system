// Shared loading + resolution of the Figma export in ../figma.
// No dependencies: plain Node >= 20.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'figma');

const readJson = (f) => JSON.parse(readFileSync(join(SRC, f), 'utf8'));

/** Figma variable name → CSS custom property name (matches the WEB code syntax set in Figma). */
export const cssVar = (name) => `--bek-${name.replace(/\//g, '-')}`;

/** Breakpoints that switch the Dimension / Typography modes (GEN-04). */
export const BREAKPOINTS = { tablet: 600, web: 1024 };
export const DEVICE_MODES = ['Mobile', 'Tablet', 'Web'];
export const COLOR_MODES = ['Light', 'Dark'];

const WEIGHTS = { Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700 };
const FONT_STACKS = {
  Inter: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  'Roboto Mono': "'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
};

export function load() {
  const palette = Object.fromEntries(
    readFileSync(join(SRC, 'palette.txt'), 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split('=')),
  );
  const color = readJson('color.json');
  const dimension = readJson('dimension.json');
  const typography = readJson('typography.json');
  const styles = readJson('styles.json');

  // scale/* is the Dimension primitive layer; everything else aliases into it.
  const scale = Object.fromEntries(
    dimension.vars.filter(([n]) => n.startsWith('scale/')).map(([n, v]) => [n, v]),
  );

  const resolveAlias = (value, table, label) => {
    if (typeof value !== 'string' || !value.startsWith('{')) return value;
    const key = value.slice(1, -1);
    if (!(key in table)) throw new Error(`${label}: unknown alias ${value}`);
    return table[key];
  };

  /** Color tokens: { name, light, dark, description } with resolved hex (#rrggbb or #rrggbbaa). */
  const colors = color.vars.map(([name, [l, d], description]) => ({
    name,
    description,
    alias: { light: l, dark: d },
    light: resolveAlias(l, palette, name),
    dark: resolveAlias(d, palette, name),
  }));

  /** Dimension tokens: { name, values: [mobile, tablet, web] } with numbers or strings. */
  const dimensions = dimension.vars.map(([name, vals]) => ({
    name,
    alias: vals,
    values: vals.map((v, i) => {
      const r = resolveAlias(v, scale, name);
      return Array.isArray(r) ? r[i] : r;
    }),
  }));

  /** Typography tokens. */
  const typo = typography.vars.map(([name, vals]) => ({
    name,
    alias: vals,
    values: vals.map((v) => resolveAlias(v, typography.primitives, name)),
  }));

  return { palette, colors, dimensions, typo, styles, scale };
}

/** Unit + formatting per token family. */
export function formatValue(name, value) {
  if (typeof value === 'string') {
    if (name.startsWith('family/')) return FONT_STACKS[value] ?? `'${value}'`;
    if (name.startsWith('weight/')) return String(WEIGHTS[value] ?? value);
    return value; // easing, hex
  }
  if (name === 'layout/grid/columns') return String(value);
  if (name.startsWith('motion/duration/')) return `${value}ms`;
  if (name.endsWith('/tracking')) return `${round(value)}px`;
  return `${round(value)}px`;
}

export const round = (n) => Math.round(n * 1000) / 1000;

/** #rrggbb[aa] → { r, g, b, a } (0–255, a 0–1). */
export function parseHex(hex) {
  const h = hex.replace('#', '');
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

/** Composite a (possibly translucent) colour over an opaque one. */
export function over(fg, bg) {
  const a = fg.a;
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

export function contrast(c1, c2) {
  const lum = ({ r, g, b }) => {
    const ch = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
  };
  const [a, b] = [lum(c1), lum(c2)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
