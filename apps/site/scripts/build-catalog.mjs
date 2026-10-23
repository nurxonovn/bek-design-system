#!/usr/bin/env node
// Komponentlar katalogi: packages/{react,charts,backgrounds}/src/components/*/{README.md, figma.json, index.ts} →
// src/app/data/catalog.generated.json. Sayt shu fayldan Figma sahifasi, prop'lar, tokenlar va README'ni ko'rsatadi.
// `pnpm --filter @bek-ui/site catalog` (dev/build oldidan avtomatik ishlaydi).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES = [
  ['@bek-ui/react', join(SITE, '../../packages/react/src/components')],
  ['@bek-ui/charts', join(SITE, '../../packages/charts/src/components')],
  ['@bek-ui/backgrounds', join(SITE, '../../packages/backgrounds/src/components')],
];
const TOKENS = join(SITE, '../../packages/tokens/dist/tokens.json');
const OUT = join(SITE, 'src/app/data/catalog.generated.json');
const FIGMA_FILE = 'https://www.figma.com/design/6ADJMMCbBHzYiIW0MBxJqh/BEK-Design-System';

const SECTIONS = {
  1: 'Foundations',
  2: 'Assets',
  3: 'Inputs',
  4: 'Data display',
  5: 'Feedback',
  6: 'Navigation',
  7: 'Overlays',
  8: 'Templates',
  9: 'Utilities',
  10: 'Devices',
};

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const figmaUrl = (nodeId) => `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}`;

const components = [];
for (const [pkg, COMPONENTS] of PACKAGES)
for (const dir of existsSync(COMPONENTS) ? readdirSync(COMPONENTS).sort() : []) {
  const base = join(COMPONENTS, dir);
  const readme = read(join(base, 'README.md'));
  if (!readme) {
    if (existsSync(join(base, 'figma.json')) || existsSync(join(base, 'index.ts')))
      throw new Error(`[@bek-ui/site] ${dir}: README.md yo'q — komponent katalogga tushmaydi`);
    continue;
  }
  const specRaw = read(join(base, 'figma.json'));
  let spec = null;
  if (specRaw) {
    try {
      spec = JSON.parse(specRaw);
    } catch (e) {
      throw new Error(`[@bek-ui/site] ${dir}/figma.json o'qilmadi: ${e.message}`);
    }
    for (const c of spec.components ?? [])
      if (typeof c.id !== 'string' || typeof c.page !== 'string')
        throw new Error(`[@bek-ui/site] ${dir}/figma.json: components[] da id/page yo'q`);
  } else console.warn(`[@bek-ui/site] ${dir}: figma.json yo'q — Figma spetsifikatsiyasiz`);

  const title = readme.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? dir;
  const intro = readme.split('\n').find((l) => l.startsWith('Figma:')) ?? '';
  const description = intro
    .replace(/^Figma:\s*\*\*[^*]+\*\*/, '')
    .replace(/[`*]/g, '')
    .replace(/^[\s.—–-]+/, '')
    .trim();
  const figmaLabel = intro.match(/\*\*([^*]+)\*\*/)?.[1]?.trim() ?? spec?.page ?? '';

  const exportsNames = [...read(join(base, 'index.ts')).matchAll(/export\s*\{([^}]+)\}/g)]
    .flatMap((m) => m[1].split(','))
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith('type '))
    .map((s) => s.split(/\s+as\s+/).pop());

  const pages = [...new Set((spec?.components ?? []).map((c) => c.page))];
  const sectionNo = Number((pages[0] ?? figmaLabel).match(/^(\d+)/)?.[1] ?? 0);
  if (!SECTIONS[sectionNo]) console.warn(`[@bek-ui/site] ${dir}: bo'lim raqami aniqlanmadi (${pages[0] ?? figmaLabel})`);
  const pageIds = Object.fromEntries((spec?.components ?? []).map((c) => [c.page, c.pageId]));

  components.push({
    dir,
    package: pkg,
    title,
    description,
    exports: exportsNames,
    section: { id: sectionNo, title: SECTIONS[sectionNo] ?? 'Other' },
    figma: {
      label: figmaLabel,
      pages: pages.map((p) => ({ name: p, url: pageIds[p] ? figmaUrl(pageIds[p]) : FIGMA_FILE })),
      sets: (spec?.components ?? []).map((c) => ({
        name: c.name,
        id: c.id,
        url: figmaUrl(c.id),
        variants: c.variants,
        description: c.description,
        props: c.props,
        tokens: c.tokens,
        nested: c.nested ?? [],
      })),
      docTokens: [...new Set(Object.values(spec?.doc ?? {}).flatMap((d) => d.tokens ?? []))],
    },
    accepted: spec?.accepted ?? [],
    readme,
  });
}

if (!components.length) throw new Error('[@bek-ui/site] katalog bo\'sh — packages/react/src/components topilmadi');
const tokens = existsSync(TOKENS) ? JSON.parse(readFileSync(TOKENS, 'utf8')) : null;
if (!tokens) console.warn('[@bek-ui/site] tokens.json yo\'q — avval `pnpm --filter @bek-ui/tokens build`');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      figmaFile: FIGMA_FILE,
      sections: Object.entries(SECTIONS).map(([id, title]) => ({ id: Number(id), title })),
      components,
      tokens,
    },
    null,
    2,
  ) + '\n',
);
console.log(`[@bek-ui/site] katalog: ${components.length} komponent → ${OUT.replace(SITE + '/', '')}`);
