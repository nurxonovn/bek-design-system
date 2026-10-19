import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge, Button, Link, Tab, TabList, TabPanel, Tabs, Tag } from '@bek/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { findComponent, type FigmaSet } from '../data/catalog';
import { demos } from '../demos';

interface CatalogDetailPageProps {
  dir: string;
  onNavigate: (page: string) => void;
}

const GITHUB = 'https://github.com/nurxonovn/bek-design-system/blob/main/packages';
const sourceUrl = (pkg: string | undefined, dir: string) =>
  `${GITHUB}/${pkg === '@bek/charts' ? 'charts' : 'react'}/src/components/${dir}`;

/** Komponent sahifasi: jonli namuna · Figma spetsifikatsiyasi (prop'lar, tokenlar) · README. */
export function CatalogDetailPage({ dir, onNavigate }: CatalogDetailPageProps) {
  const c = findComponent(dir);
  const [rtl, setRtl] = useState(false);
  if (!c) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Komponent topilmadi</h1>
        <Button variant="outline" onClick={() => onNavigate('components')}>
          Katalogga qaytish
        </Button>
      </div>
    );
  }
  const Demo = demos[c.dir];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button variant="flat" size="m" startIcon={<ArrowLeft size={16} />} onClick={() => onNavigate('components')}>
        Komponentlar
      </Button>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="subtle" color="accent">
            {c.section.id} · {c.section.title}
          </Badge>
          {c.figma.pages.map((p) => (
            <Link key={p.name} href={p.url} target="_blank" rel="noreferrer" variant="accent" size="s" endIcon={<ExternalLink size={14} />}>
              Figma · {p.name}
            </Link>
          ))}
          <Link href={sourceUrl(c.package, c.dir)} target="_blank" rel="noreferrer" variant="neutral" size="s" endIcon={<ExternalLink size={14} />}>
            GitHub
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold">{c.title}</h1>
        <p className="text-muted-foreground max-w-3xl">{c.description}</p>
        <div className="flex flex-wrap gap-1">
          {c.exports.map((e) => (
            <Tag key={e}>{e}</Tag>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Jonli namuna</h2>
          <Button variant="outline" size="m" pressed={rtl} onClick={() => setRtl(!rtl)}>
            RTL
          </Button>
        </div>
        <div className="bek-preview bek-preview--column" dir={rtl ? 'rtl' : 'ltr'}>
          {Demo ? <Demo /> : <p className="text-sm text-muted-foreground">Bu komponent uchun jonli namuna hali yozilmagan — README'dagi misolga qarang.</p>}
        </div>
      </section>

      <Tabs defaultValue="readme" type="underline" size="m">
        <TabList aria-label="Komponent bo'limlari">
          <Tab value="readme">Hujjat</Tab>
          <Tab value="props" badge={c.figma.sets.length}>
            Figma spetsifikatsiyasi
          </Tab>
          <Tab value="tokens">Tokenlar</Tab>
          {c.accepted.length > 0 && (
            <Tab value="parity" badge={c.accepted.length}>
              Farqlar
            </Tab>
          )}
        </TabList>
        <TabPanel value="readme">
          <article className="bek-readme max-w-3xl pt-4">
            <Markdown remarkPlugins={[remarkGfm]}>{c.readme}</Markdown>
          </article>
        </TabPanel>
        <TabPanel value="props">
          <div className="space-y-8 pt-4">
            {c.figma.sets.map((s) => (
              <FigmaSetTable key={s.id} set={s} />
            ))}
          </div>
        </TabPanel>
        <TabPanel value="tokens">
          <div className="pt-4 space-y-6">
            {c.figma.sets.map((s) => (
              <div key={s.id} className="space-y-2">
                <h3 className="font-semibold">{s.name}</h3>
                <TokenList label="Rang" items={s.tokens.color} />
                <TokenList label="Matn uslubi" items={s.tokens.text} />
                <TokenList label="Effekt" items={s.tokens.effect} />
                <TokenList label="O'lcham" items={s.tokens.dimension} />
              </div>
            ))}
          </div>
        </TabPanel>
        {c.accepted.length > 0 && (
          <TabPanel value="parity">
            <div className="pt-4 space-y-3 max-w-3xl">
              <p className="text-sm text-muted-foreground">
                Figma bilan ataylab yoki Figma tomonidagi kamchilik sababli farq qiladigan joylar — har biri sabab bilan{' '}
                <code>figma.json → accepted</code> da hujjatlangan.
              </p>
              {c.accepted.map((a, i) => (
                <div key={i} className="rounded-lg border border-border p-3 text-sm space-y-1">
                  <div className="flex gap-2 items-center">
                    <Tag color="warning">{a.rule}</Tag>
                    {a.match && <code className="text-xs">{a.match}</code>}
                  </div>
                  <p className="text-muted-foreground">{a.reason}</p>
                </div>
              ))}
            </div>
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
}

function FigmaSetTable({ set }: { set: FigmaSet }) {
  const entries = Object.entries(set.props);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-semibold">{set.name}</h3>
        <span className="text-sm text-muted-foreground">{set.variants} variant</span>
        <Link href={set.url} target="_blank" rel="noreferrer" variant="accent" size="s">
          Figma'da ochish
        </Link>
      </div>
      {set.description && <p className="text-sm text-muted-foreground max-w-3xl">{set.description}</p>}
      {entries.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Prop</th>
              <th className="py-2 pr-4 font-medium">Tur</th>
              <th className="py-2 font-medium">Qiymatlar / standart</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, def]) => (
              <tr key={name} className="border-t border-border">
                <td className="py-2 pr-4 font-medium">{name}</td>
                <td className="py-2 pr-4 text-muted-foreground">{Array.isArray(def) ? 'Variant' : def.type}</td>
                <td className="py-2">
                  {Array.isArray(def) ? (
                    <span className="flex flex-wrap gap-1">
                      {def.map((o) => (
                        <code key={o} className="rounded bg-muted px-1.5 py-0.5 text-xs">
                          {o}
                        </code>
                      ))}
                    </span>
                  ) : (
                    <code className="text-xs">{String(def.default)}</code>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {set.nested.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Ichida: {set.nested.join(', ')}
        </p>
      )}
    </div>
  );
}

function TokenList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-1 text-sm">
      <span className="text-muted-foreground mr-1">{label}:</span>
      {items.map((t) => (
        <code key={t} className="rounded bg-muted px-1.5 py-0.5 text-xs">
          {t}
        </code>
      ))}
    </div>
  );
}
