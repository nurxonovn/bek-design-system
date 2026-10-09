// Figma Variables eksportini (figma/*.json) o'qib, dist/ ga tokenlarni yozadi.
// Konvertor eksport formati ma'lum bo'lgach to'ldiriladi (bek-code-reja.md, F bosqichi):
//   - Color: light/dark → :root va [data-theme="dark"]
//   - Dimension, Typography: Mobile/Tablet/Web → :root, @media (min-width: 600px), @media (min-width: 1024px)
//   - Nomlash: `accent/default` → `--bek-accent-default`
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sources = readdirSync(join(root, 'figma')).filter((f) => f.endsWith('.json'));
mkdirSync(join(root, 'dist'), { recursive: true });

if (sources.length === 0) {
  console.warn("[@bek/tokens] figma/ papkasida eksport yo'q — bo'sh tokenlar yozildi.");
}

writeFileSync(
  join(root, 'dist/tokens.css'),
  '/* BEK Design System — generated from Figma variables. Do not edit. */\n:root {}\n',
);
writeFileSync(join(root, 'dist/tokens.json'), JSON.stringify({ sources }, null, 2) + '\n');
