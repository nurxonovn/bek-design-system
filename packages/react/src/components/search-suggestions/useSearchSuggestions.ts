'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

export interface UseSearchSuggestionsOptions {
  /** Panel ochiqmi (`aria-expanded`). Default `true`. */
  open?: boolean;
  /** esc — panelni yopish. */
  onClose?: () => void;
}

/** SearchField (input) ga yoyiladigan combobox atributlari. */
export interface SearchSuggestionsInputProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-controls': string;
  'aria-autocomplete': 'list';
  'aria-activedescendant': string | undefined;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

/** SearchSuggestions ga yoyiladigan prop'lar. */
export interface SearchSuggestionsListProps {
  listId: string;
  listRef: RefObject<HTMLDivElement>;
  activeId: string | undefined;
  onActiveChange: (id: string) => void;
}

export interface UseSearchSuggestionsResult {
  activeId: string | undefined;
  setActiveId: (id: string | undefined) => void;
  inputProps: SearchSuggestionsInputProps;
  listProps: SearchSuggestionsListProps;
}

const OPTION = '[role="option"]:not([aria-disabled="true"])';

/**
 * SearchField + SearchSuggestions klaviatura boshqaruvi (WAI-ARIA combobox): ↑ ↓ — option'lar bo'ylab
 * (guruh amallari ham), ↵ — faol option'ni bosadi, esc — `onClose`. Fokus doim inputda qoladi.
 */
export function useSearchSuggestions({
  open = true,
  onClose,
}: UseSearchSuggestionsOptions = {}): UseSearchSuggestionsResult {
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  // Ro'yxat o'zgarsa yoki panel yopilsa — eskirgan faol id'ni tashlaymiz.
  useEffect(() => {
    if (!activeId) return;
    if (!open || !listRef.current?.querySelector(`[id="${CSS.escape(activeId)}"]`))
      setActiveId(undefined);
  });

  const options = () => Array.from(listRef.current?.querySelectorAll<HTMLElement>(OPTION) ?? []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (!open) return;
      event.preventDefault();
      setActiveId(undefined);
      onClose?.();
      return;
    }
    if (!open) return;
    const items = options();
    if (!items.length) return;
    const index = items.findIndex((el) => el.id === activeId);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const next =
        index < 0
          ? step > 0
            ? 0
            : items.length - 1
          : (index + step + items.length) % items.length;
      const target = items[next];
      if (!target) return;
      setActiveId(target.id);
      target.scrollIntoView?.({ block: 'nearest' });
    } else if (event.key === 'Enter' && index >= 0) {
      event.preventDefault();
      items[index]?.click();
    }
  };

  return {
    activeId,
    setActiveId,
    inputProps: {
      role: 'combobox',
      'aria-expanded': open,
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': open ? activeId : undefined,
      onKeyDown,
    },
    listProps: { listId, listRef, activeId, onActiveChange: setActiveId },
  };
}
