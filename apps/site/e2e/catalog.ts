import { readFileSync } from 'node:fs';

interface CatalogEntry {
  dir: string;
  package: string;
  title: string;
}

// Katalog build-catalog.mjs dan — sayt ko'rsatadigan komponentlar ro'yxatining yagona manbai.
const catalog = JSON.parse(
  readFileSync(new URL('../src/app/data/catalog.generated.json', import.meta.url), 'utf8'),
) as { components: CatalogEntry[] };

export const components = catalog.components.map(({ dir, package: pkg, title }) => ({
  dir,
  pkg,
  title,
}));
