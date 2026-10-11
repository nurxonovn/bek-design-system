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
  let path = '';
  try {
    path = decodeURIComponent(hash).replace(/^#\/?/, '').replace(/\/$/, '');
  } catch {
    return 'not-found';
  }
  if (!path) return 'home';
  const m = path.match(/^components\/([a-z0-9-]+)$/);
  if (m) return `component-detail-${m[1]}`;
  return HASH_TO_PAGE[path] ?? 'not-found';
}

export function useHashRoute(): [string, (page: string) => void] {
  const [page, setPage] = useState(() => hashToPage(window.location.hash));

  useEffect(() => {
    const onChange = () => setPage(hashToPage(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: string) => {
    const hash = pageToHash(next);
    const current = window.location.hash || '#/';
    if (current !== hash) window.location.hash = hash;
    // Dasturiy navigatsiya — sahifa boshidan; orqaga/oldinga tugmalari brauzer skrollini saqlaydi.
    window.scrollTo({ top: 0 });
  }, []);

  return [page, navigate];
}
