'use client';

import {
  Children,
  useContext,
  useId,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx.js';
import { SearchRemoveGlyph } from '../../icons/index.js';
import { Skeleton } from '../skeleton/Skeleton.js';
import { SuggestionsContext } from './context.js';

/** Figma "Device": Web — maydon ostida suzuvchi panel · Mobile — to'liq ekran. */
export type SearchSuggestionsDevice = 'web' | 'mobile';

export interface SearchSuggestionsProps extends HTMLAttributes<HTMLDivElement> {
  device?: SearchSuggestionsDevice;
  /** Listbox nomi (ekran o'quvchi uchun). */
  label?: string;
  /** Listbox `id` — SearchField'ning `aria-controls` i shunga ishora qiladi (`useSearchSuggestions` beradi). */
  listId?: string;
  listRef?: Ref<HTMLDivElement>;
  /** Klaviatura bilan tanlangan option `id` si — qator Selected bo'ladi, input'da `aria-activedescendant`. */
  activeId?: string;
  /** Sichqoncha option ustiga kelganda — faol qatorni yangilash uchun. */
  onActiveChange?: (id: string) => void;
  /** Mobile: tepadagi Filled `SearchField` (Cancel bilan). */
  field?: ReactNode;
  /** Figma "Content=Loading" — skelet qatorlar, listbox'da `aria-busy`, `loadingLabel` live region'da o'qiladi. */
  loading?: boolean;
  loadingLabel?: string;
  /** Figma "Content=Empty" — natija yo'q (children bo'sh bo'lganda). */
  emptyTitle?: ReactNode;
  /** Empty: bitta qisqa maslahat ("Imloni tekshiring…"). */
  emptyDescription?: ReactNode;
  /** Pastdagi klaviatura ishoralari — faqat Web (`null` — yashirish). */
  hints?: [ReactNode, ReactNode][] | null;
  /** Figma "Content=Recent · Suggestions · Results" — `SearchSuggestionGroup` va `SearchResultRow` lar. */
  children?: ReactNode;
}

const DEFAULT_HINTS: [ReactNode, ReactNode][] = [
  ['↑ ↓', 'Navigate'],
  ['↵', 'Open'],
  ['esc', 'Close'],
];

const LOADING_ROWS = 4;

/**
 * Figma "3.12 Search bar → Search suggestions": Search field ostida ochiladigan takliflar paneli.
 * WAI-ARIA combobox + listbox: fokus inputda, faol qator `aria-activedescendant` orqali.
 */
export function SearchSuggestions({
  device = 'web',
  label = 'Suggestions',
  listId,
  listRef,
  activeId,
  onActiveChange,
  field,
  loading = false,
  loadingLabel = 'Loading',
  emptyTitle,
  emptyDescription,
  hints = DEFAULT_HINTS,
  children,
  className,
  ...rest
}: SearchSuggestionsProps) {
  const autoId = useId();
  const id = listId ?? autoId;
  const empty = !loading && Children.toArray(children).length === 0;

  const hover = (event: PointerEvent<HTMLDivElement>) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
    if (option?.id && option.id !== activeId) onActiveChange?.(option.id);
  };

  return (
    <div
      {...rest}
      className={cx('bek-search-suggestions', `bek-search-suggestions--${device}`, className)}
    >
      {field != null && <div className="bek-search-suggestions__field">{field}</div>}
      <SuggestionsContext.Provider value={{ activeId }}>
        <div
          ref={listRef}
          id={id}
          role="listbox"
          aria-label={label}
          aria-busy={loading || undefined}
          className="bek-search-suggestions__list"
          onPointerMove={onActiveChange ? hover : undefined}
          // Bosilganda fokus inputdan ketmasin (combobox naqshi).
          onMouseDown={(event) => event.preventDefault()}
        >
          {loading
            ? Array.from({ length: LOADING_ROWS }, (_, i) => (
                <div key={i} className="bek-search-suggestions__skeleton" aria-hidden="true">
                  <Skeleton shape="rect" className="bek-search-suggestions__skeleton-thumb" />
                  <Skeleton
                    shape="text"
                    lines={2}
                    className="bek-search-suggestions__skeleton-lines"
                  />
                </div>
              ))
            : children}
        </div>
      </SuggestionsContext.Provider>
      <div className="bek-search-suggestions__status" role="status">
        {loading && <span className="bek-visually-hidden">{loadingLabel}</span>}
        {empty && emptyTitle != null && (
          <div className="bek-search-suggestions__empty">
            <span className="bek-search-suggestions__empty-icon" aria-hidden="true">
              <SearchRemoveGlyph />
            </span>
            <p className="bek-search-suggestions__empty-title">{emptyTitle}</p>
            {emptyDescription != null && (
              <p className="bek-search-suggestions__empty-description">{emptyDescription}</p>
            )}
          </div>
        )}
      </div>
      {device === 'web' && hints && (
        <div className="bek-search-suggestions__footer" aria-hidden="true">
          {hints.map(([key, text], i) => (
            <span key={i}>
              {key}&nbsp;&nbsp;{text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export interface SearchSuggestionGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Guruh sarlavhasi — "Recent searches", "People", "Files" (Caption/M text/tertiary). */
  label: ReactNode;
  /** Sarlavhadagi amal — "Clear" (Recent) yoki "See all" (Label/S text/accent). */
  actionLabel?: ReactNode;
  /** Amal bosilganda. Amal option sifatida ro'yxatga kiradi — ↑ ↓ bilan yetiladi, ↵ ishga tushiradi. */
  onAction?: () => void;
  children: ReactNode;
}

/** Takliflar guruhi (`role="group"`): sarlavha + ixtiyoriy amal + SearchResultRow'lar. */
export function SearchSuggestionGroup({
  label,
  actionLabel,
  onAction,
  children,
  className,
  ...rest
}: SearchSuggestionGroupProps) {
  const labelId = useId();
  const actionId = useId();
  const { activeId } = useContext(SuggestionsContext);
  const actionSelected = activeId === actionId;
  return (
    <div
      role="group"
      aria-labelledby={labelId}
      {...rest}
      className={cx('bek-search-suggestions__group', className)}
    >
      <div className="bek-search-suggestions__group-header">
        <span id={labelId} className="bek-search-suggestions__group-label">
          {label}
        </span>
        {actionLabel != null && (
          <div
            id={actionId}
            role="option"
            aria-selected={actionSelected}
            className={cx(
              'bek-search-suggestions__group-action',
              actionSelected && 'bek-search-suggestions__group-action--selected',
            )}
            onClick={onAction}
          >
            {actionLabel}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
