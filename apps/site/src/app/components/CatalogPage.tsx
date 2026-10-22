import React, { useMemo, useState } from 'react';
import { Badge, Chip, SearchBar } from '@bek-ui/react';
import { bySection, catalog, type CatalogComponent } from '../data/catalog';
import { demos } from '../demos';

interface CatalogPageProps {
  onNavigate: (page: string) => void;
}

/** Komponentlar katalogi — packages/react dagi README.md + figma.json dan avtomatik yig'iladi. */
export function CatalogPage({ onNavigate }: CatalogPageProps) {
  const [query, setQuery] = useState('');
  const [section, setSection] = useState<number | null>(null);
  const groups = useMemo(() => bySection(), []);

  const match = (c: CatalogComponent) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [c.title, c.description, c.figma.label, ...c.exports].join(' ').toLowerCase().includes(q);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Figma «BEK Design System» · {catalog.components.length} komponent · build{' '}
          {new Date(__BUILD_DATE__).toLocaleDateString('uz-UZ')}
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold">Komponentlar</h1>
        <p className="text-muted-foreground max-w-3xl">
          Har bir komponent Figma sahifasining aynan o'zi: tokenlar, variantlar va qoidalar{' '}
          <code>figma.json</code> spetsifikatsiyasi bo'yicha avtomatik tekshiriladi. Jonli namunalar
          <code> @bek-ui/react</code> paketidan, Light/Dark rejim yuqoridagi tugma bilan.
        </p>
        <div className="max-w-xl">
          <SearchBar
            aria-label="Komponent qidirish"
            placeholder="Komponent qidirish — Button, 3.1, Figma nomi…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip selected={section === null} onClick={() => setSection(null)} count={catalog.components.length}>
            Barchasi
          </Chip>
          {groups.map(({ section: s, items }) => (
            <Chip key={s.id} selected={section === s.id} onClick={() => setSection(s.id)} count={items.length}>
              {s.id} · {s.title}
            </Chip>
          ))}
        </div>
      </header>

      {groups
        .filter((g) => section === null || g.section.id === section)
        .map(({ section: s, items }) => {
          const visible = items.filter(match);
          if (!visible.length) return null;
          return (
            <section key={s.id} className="space-y-4">
              <h2 className="text-xl font-semibold">
                {s.id} · {s.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((c) => (
                  <ComponentCard key={c.dir} component={c} onOpen={() => onNavigate(`component-detail-${c.dir}`)} />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}

function ComponentCard({ component: c, onOpen }: { component: CatalogComponent; onOpen: () => void }) {
  const Demo = demos[c.dir];
  const parity = c.accepted.length;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group text-left rounded-xl border border-border bg-card hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-ring overflow-hidden"
    >
      <div className="bek-preview bek-preview--thumb pointer-events-none min-h-32 overflow-hidden" aria-hidden="true">
        {Demo ? <Demo /> : <span className="text-sm text-muted-foreground">Namuna tez orada</span>}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold">{c.title}</h3>
          <Badge variant="subtle" color="neutral" size="s">
            {c.figma.label.split(' ')[0]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {c.exports.slice(0, 4).map((e) => (
            <code key={e} className="rounded bg-muted px-1.5 py-0.5">
              {e}
            </code>
          ))}
          {c.exports.length > 4 && <span>+{c.exports.length - 4}</span>}
        </div>
        {parity > 0 && (
          <p className="text-xs text-muted-foreground">
            Figma'dan {parity} ta hujjatlangan farq
          </p>
        )}
      </div>
    </button>
  );
}
