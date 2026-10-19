// src/**/*.css fayllarini bitta dist/styles.css ga yig'adi (komponentlar alifbo tartibida).
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const files = readdirSync(src, { recursive: true })
  .filter((f) => f.endsWith('.css'))
  .sort()
  .map((f) => join(src, f));

const css = files
  .map((f) => `/* ${relative(src, f)} */\n${readFileSync(f, 'utf8').trim()}\n`)
  .join('\n');
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(
  join(root, 'dist/styles.css'),
  `/* @bek/charts — generated. Do not edit. */\n\n${css}`,
);
console.log(`[@bek/charts] ${files.length} CSS fayl → dist/styles.css`);
