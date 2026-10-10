import React, { useMemo, useState } from 'react';
import { Chip, Tab, TabList, TabPanel, Tabs } from '@bek/react';
import { ExternalLink } from 'lucide-react';
import { catalog } from '../data/catalog';

const FIGMA = catalog.figmaFile;

/** Foundations — @bek/tokens (Figma Variables'dan yig'ilgan) dan jonli: ranglar, o'lchamlar, tipografika, soya. */
export function TokensPage({ initialTab = 'colors' }: { initialTab?: string }) {
  const t = catalog.tokens;
  if (!t) return <div className="container mx-auto px-4 py-8">Tokenlar topilmadi — `pnpm build` ni ishga tushiring.</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Foundations · Tokenlar</h1>
        <p className="text-muted-foreground max-w-3xl">
          Figma Variables → <code>@bek/tokens</code>: CSS o'zgaruvchilari (<code>--bek-*</code>), Light/Dark va Mobile/Tablet/Web rejimlari.
          Qiymatlar <code>tokens.json</code> dan to'g'ridan-to'g'ri o'qiladi — Figma o'zgarsa, sayt ham o'zgaradi.{' '}
          <a className="inline-flex items-center gap-1 text-primary underline" href={FIGMA} target="_blank" rel="noreferrer">
            Figma fayli <ExternalLink size={14} />
          </a>
        </p>
      </header>

      <Tabs defaultValue={initialTab} type="pill" size="m">
        <TabList aria-label="Token guruhlari">
          <Tab value="colors">1.1 Ranglar</Tab>
          <Tab value="typography">1.2 Tipografika</Tab>
          <Tab value="dimension">1.3 O'lcham va radius</Tab>
          <Tab value="elevation">1.8 Soya</Tab>
          <Tab value="constants">1.5 Layout</Tab>
        </TabList>
        <TabPanel value="colors">
          <ColorTokens light={t.color.light} dark={t.color.dark} />
        </TabPanel>
        <TabPanel value="typography">
          <TextStyles styles={t.textStyles} typography={t.typography} />
        </TabPanel>
        <TabPanel value="dimension">
          <ModeTable groups={t.dimension} />
        </TabPanel>
        <TabPanel value="elevation">
          <ElevationTokens elevation={t.elevation} />
        </TabPanel>
        <TabPanel value="constants">
          <SimpleTable rows={Object.entries(t.constants)} />
        </TabPanel>
      </Tabs>
    </div>
  );
}

const groupOf = (name: string) => name.replace(/^--bek-/, '').split('-')[0];

function ColorTokens({ light, dark }: { light: Record<string, string>; dark: Record<string, string> }) {
  const groups = useMemo(() => [...new Set(Object.keys(light).map(groupOf))], [light]);
  const [group, setGroup] = useState<string | null>(null);
  const names = Object.keys(light).filter((n) => !group || groupOf(n) === group);
  return (
    <div className="pt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip selected={group === null} onClick={() => setGroup(null)} count={Object.keys(light).length}>
          Barchasi
        </Chip>
        {groups.map((g) => (
          <Chip key={g} selected={group === g} onClick={() => setGroup(g)}>
            {g}
          </Chip>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {names.map((n) => (
          <div key={n} className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
            <div className="flex gap-1">
              <Swatch value={light[n]} title="Light" />
              <Swatch value={dark[n] ?? light[n]} title="Dark" dark />
            </div>
            <div className="min-w-0">
              <code className="block text-xs truncate">{n}</code>
              <span className="text-xs text-muted-foreground">
                {light[n]} · {dark[n] ?? '—'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Swatch({ value, title, dark }: { value: string; title: string; dark?: boolean }) {
  return (
    <span
      title={`${title}: ${value}`}
      className="block h-10 w-10 rounded-md border border-border"
      style={{ background: dark ? '#111' : '#fff', boxShadow: `inset 0 0 0 100px ${value}` }}
    />
  );
}

function ModeTable({ groups }: { groups: Record<string, Record<string, string>> }) {
  const modes = Object.keys(groups);
  const names = Object.keys(groups[modes[0]] ?? {});
  return (
    <div className="pt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-2 pr-4 font-medium">Token</th>
            {modes.map((m) => (
              <th key={m} className="py-2 pr-4 font-medium capitalize">
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={n} className="border-t border-border">
              <td className="py-1.5 pr-4">
                <code className="text-xs">{n}</code>
              </td>
              {modes.map((m) => (
                <td key={m} className="py-1.5 pr-4 text-muted-foreground">
                  {groups[m][n]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SimpleTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="pt-4">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-border">
              <td className="py-1.5 pr-4">
                <code className="text-xs">{k}</code>
              </td>
              <td className="py-1.5 text-muted-foreground">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ElevationTokens({ elevation }: { elevation: Record<string, string> }) {
  return (
    <div className="pt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(elevation).map(([k, v]) => (
        <div key={k} className="space-y-2">
          <div className="h-24 rounded-xl" style={{ background: 'var(--bek-surface-raised)', boxShadow: `var(${k})` }} />
          <code className="block text-xs">{k}</code>
          <p className="text-xs text-muted-foreground break-all">{v}</p>
        </div>
      ))}
    </div>
  );
}

function TextStyles({ styles, typography }: { styles: Record<string, Record<string, string>>; typography: Record<string, Record<string, string>> }) {
  const web = typography.web ?? {};
  return (
    <div className="pt-4 space-y-6">
      <p className="text-sm text-muted-foreground">
        Shrift: <code>{web['--bek-family-sans']}</code>. Har uslub Mobile / Tablet / Web rejimida o'z o'lchamiga ega — jadvaldagi qiymatlar joriy ekran uchun.
      </p>
      <div className="space-y-4">
        {Object.entries(styles).map(([cls, meta]) => (
          <div key={cls} className="border-t border-border pt-4 grid gap-2 md:grid-cols-[14rem_1fr]">
            <div>
              <code className="text-xs">.{cls}</code>
              <p className="text-xs text-muted-foreground">
                {meta.family} · {meta.weight}
              </p>
            </div>
            <div>
              <p className={cls} style={{ margin: 0 }}>
                BEK Design System — Aa Bb 0123
              </p>
              {meta.description && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{meta.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
