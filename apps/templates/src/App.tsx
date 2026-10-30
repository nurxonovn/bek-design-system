import { useEffect, useState } from 'react';
import { BekLogo, Button, SegmentedControl } from '@bek-ui/react';
import { Icon } from './icons';
import { Dashboard } from './pages/Dashboard';
import { Ecommerce } from './pages/Ecommerce';
import { Landing } from './pages/Landing';
import { AiWorkspace } from './pages/AiWorkspace';
import { Finance } from './pages/Finance';

const PAGES = {
  dashboard: { label: '8.1 Dashboard', Component: Dashboard },
  ecommerce: { label: '8.2 E-commerce', Component: Ecommerce },
  landing: { label: '8.3 Landing', Component: Landing },
  workspace: { label: '8.4 AI Workspace', Component: AiWorkspace },
  finance: { label: '8.5 Finance', Component: Finance },
} as const;

type PageKey = keyof typeof PAGES;

const fromHash = (): PageKey => {
  const key = location.hash.replace('#/', '') as PageKey;
  return key in PAGES ? key : 'dashboard';
};

/** Figma "8 · Templates" ekranlari: yuqoridagi panel orqali sahifa va mavzu tanlanadi. */
export function App() {
  const [page, setPage] = useState<PageKey>(fromHash);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const onHash = () => setPage(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const { Component } = PAGES[page];
  return (
    <>
      <header className="tpl-switcher">
        <BekLogo size="s" product="Templates" />
        <SegmentedControl
          aria-label="Template"
          value={page}
          onChange={(value) => (location.hash = `/${value}`)}
          options={Object.entries(PAGES).map(([value, { label }]) => ({ value, label }))}
        />
        <Button
          variant="flat"
          size="l"
          startIcon={<Icon name="moon" />}
          pressed={theme === 'dark'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          Dark
        </Button>
      </header>
      <Component />
    </>
  );
}
