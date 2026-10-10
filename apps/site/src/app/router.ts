import { useCallback, useEffect, useState } from 'react';

// Hash-marshrutlar: har sahifa ulashiladigan havola — #/components/button, #/tokens.
// Pure'ning `currentPage` satr identifikatorlari saqlanadi; faqat URL bilan sinxronlanadi.
const PAGE_TO_HASH: Record<string, string> = {
  home: '',
  docs: 'docs',
  components: 'components',
  'component-showcase': 'showcase',
  foundation: 'foundation',
  colors: 'tokens/colors',
  'design-tokens': 'tokens',
  icons: 'icons',
};
const HASH_TO_PAGE = Object.fromEntries(Object.entries(PAGE_TO_HASH).map(([p, h]) => [h, p]));

export function pageToHash(page: string): string {
  if (page.startsWith('component-detail-')) return `#/components/${page.slice('component-detail-'.length)}`;
  return `#/${PAGE_TO_HASH[page] ?? page}`;
}

export function hashToPage(hash: string): string {
  const path = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  if (path.startsWith('components/')) return `component-detail-${path.slice('components/'.length)}`;
  return HASH_TO_PAGE[path] ?? (path ? path : 'home');
}

export function useHashRoute(): [string, (page: string) => void] {
  const [page, setPage] = useState(() => hashToPage(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setPage(hashToPage(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: string) => {
    const hash = pageToHash(next);
    if (window.location.hash === hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    window.location.hash = hash;
  }, []);

  return [page, navigate];
}
