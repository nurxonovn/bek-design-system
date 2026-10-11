'use client';

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { SearchGlyph } from '../../icons/index.js';
import { useDialog } from './useDialog.js';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const CommandContext = createContext<{ close: () => void }>({ close: () => {} });

export interface CommandPaletteProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'onChange'> {
  open: boolean;
  onClose: () => void;
  /** Qidiruv matni (boshqariladigan). Natijalarni ilova filtrlaydi. */
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  /** Input nomi (ekran o'quvchi uchun). */
  label?: string;
  /** Natija bo'lmaganda ko'rsatiladi. */
  empty?: ReactNode;
  /** Pastdagi klaviatura ishoralari (faqat web; `null` — yashirish). */
  hints?: [ReactNode, ReactNode][] | null;
  /** CommandGroup va CommandItem'lar. */
  children?: ReactNode;
}

const DEFAULT_HINTS: [ReactNode, ReactNode][] = [
  ['↑ ↓', 'Navigate'],
  ['↵', 'Open'],
  ['esc', 'Close'],
];

/**
 * Figma "7.7 Command palette": ⌘K / Ctrl K bilan ochiladigan klaviatura launcher'i.
 * Web — 640, markazda, pastda ishoralar; Mobile (< 600) — to'liq kenglik, yuqorida.
 * fill/primary, radius surface/lg, Elevation/4, z/modal. Combobox + listbox (aria-activedescendant).
 */
export function CommandPalette({
  open,
  onClose,
  query,
  onQueryChange,
  placeholder = 'Type a command or search…',
  label = 'Search commands',
  empty,
  hints = DEFAULT_HINTS,
  children,
  className,
  ...rest
}: CommandPaletteProps) {
  const listId = useId();
  const dialog = useDialog({ open, onClose });
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const options = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])',
      ) ?? [],
    );

  useEffect(() => setActive(0), [query, open]);
  useIso(() => {
    const items = options();
    items.forEach((el, i) => el.toggleAttribute('data-active', i === active));
    const current = items[Math.min(active, items.length - 1)];
    if (current) current.scrollIntoView?.({ block: 'nearest' });
    inputRef.current?.setAttribute('aria-activedescendant', current?.id ?? '');
  });

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const count = options().length;
    if (!count) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      options()[active]?.click();
    }
  };
  const isEmpty = Children.toArray(children).length === 0;

  return (
    <dialog
      {...rest}
      {...dialog}
      aria-label={label}
      className={cx('bek-overlay', 'bek-command', className)}
    >
      <div className="bek-command__search">
        <span className="bek-command__search-icon" aria-hidden="true">
          <SearchGlyph />
        </span>
        <input
          ref={inputRef}
          className="bek-command__input"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label={label}
          placeholder={placeholder}
          value={query}
          autoFocus
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <kbd className="bek-command__esc">esc</kbd>
      </div>
      <CommandContext.Provider value={{ close: onClose }}>
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="bek-command__results bek-menu--m bek-scrollbar"
          onPointerMove={(event) => {
            const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
            const index = option ? options().indexOf(option) : -1;
            if (index >= 0 && index !== active) setActive(index);
          }}
        >
          {isEmpty ? empty && <div className="bek-command__empty">{empty}</div> : children}
        </div>
      </CommandContext.Provider>
      {hints && (
        <div className="bek-command__footer" aria-hidden="true">
          {hints.map(([key, text], i) => (
            <span key={i}>
              {key}&nbsp;&nbsp;{text}
            </span>
          ))}
        </div>
      )}
    </dialog>
  );
}

export interface CommandGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Menu group label. */
  heading: ReactNode;
  children: ReactNode;
}

/** Natijalar guruhi (Menu group label bilan). */
export function CommandGroup({ heading, children, className, ...rest }: CommandGroupProps) {
  const id = useId();
  return (
    <div
      role="group"
      aria-labelledby={id}
      {...rest}
      className={cx('bek-command__group', className)}
    >
      <div id={id} className="bek-menu-label">
        {heading}
      </div>
      {children}
    </div>
  );
}

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  icon?: ReactNode;
  hotkey?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  /** Tanlangandan keyin palitrani yopish. */
  closeOnSelect?: boolean;
  children: ReactNode;
}

/** Natija qatori — Menu item ko'rinishida; faol qator fill/strong. */
export function CommandItem({
  icon,
  hotkey,
  disabled = false,
  onSelect,
  closeOnSelect = true,
  className,
  children,
  ...rest
}: CommandItemProps) {
  const id = useId();
  const { close } = useContext(CommandContext);
  return (
    <div
      id={id}
      role="option"
      aria-selected="false"
      aria-disabled={disabled || undefined}
      {...rest}
      className={cx('bek-menu-item', 'bek-command__item', className)}
      onClick={() => {
        if (disabled) return;
        onSelect?.();
        if (closeOnSelect) close();
      }}
    >
      {icon && (
        <span className="bek-menu-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-menu-item__label">{children}</span>
      {hotkey && <kbd className="bek-menu-item__hotkey">{hotkey}</kbd>}
    </div>
  );
}
