import raw from './catalog.generated.json';

export interface FigmaSet {
  name: string;
  id: string;
  url: string;
  variants: number;
  description: string;
  props: Record<string, string[] | { type: string; default: unknown }>;
  tokens: { color: string[]; text: string[]; effect: string[]; dimension: string[] };
  nested: string[];
}

export interface CatalogComponent {
  dir: string;
  /** Paket: '@bek/react' yoki '@bek/charts'. */
  package?: string;
  title: string;
  description: string;
  exports: string[];
  section: { id: number; title: string };
  figma: {
    label: string;
    pages: { name: string; url: string }[];
    sets: FigmaSet[];
    docTokens: string[];
  };
  accepted: { rule: string; match?: string; reason: string }[];
  readme: string;
}

export interface Catalog {
  figmaFile: string;
  sections: { id: number; title: string }[];
  components: CatalogComponent[];
  tokens: {
    color: Record<'light' | 'dark', Record<string, string>>;
    dimension: Record<string, Record<string, string>>;
    typography: Record<string, Record<string, string>>;
    elevation: Record<string, string>;
    constants: Record<string, string>;
    textStyles: Record<string, Record<string, string>>;
  } | null;
}

export const catalog = raw as unknown as Catalog;

export const bySection = (): { section: Catalog['sections'][number]; items: CatalogComponent[] }[] =>
  catalog.sections
    .map((section) => ({ section, items: catalog.components.filter((c) => c.section.id === section.id) }))
    .filter((g) => g.items.length > 0);

export const findComponent = (dir: string) => catalog.components.find((c) => c.dir === dir);
