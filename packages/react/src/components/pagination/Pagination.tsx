import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, ChevronRightGlyph } from '../../icons/index.js';
import { Button } from '../button/Button.js';
import { ProgressBar } from '../progress/ProgressBar.js';

/** 1-asosli sahifalar ro'yxati: chetlar, joriy ± `siblings`, oraliqlar — `'…'`. */
export function paginationRange(page: number, pageCount: number, siblings = 1): (number | '…')[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, pageCount - 1);
  const showLeft = left > 3;
  const showRight = right < pageCount - 2;
  const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (!showLeft) return [...range(1, 3 + siblings * 2), '…', pageCount];
  if (!showRight) return [1, '…', ...range(pageCount - 2 - siblings * 2, pageCount)];
  return [1, '…', ...range(left, right), '…', pageCount];
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Joriy sahifa (1 dan). */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** `numbered` — web (sahifa raqamlari) · `compact` — planshet (‹ 3 / 52 ›). */
  variant?: 'numbered' | 'compact';
  /** S — 36 px · M — 44 px. */
  size?: 's' | 'm';
  /** Chapdagi xulosa: "1–24 of 1 240". */
  summary?: ReactNode;
  /** O'ngdagi sahifa hajmi tanlovi (Select, 24 / 48 / 96). */
  pageSize?: ReactNode;
  /** Joriy sahifa atrofida ko'rsatiladigan qo'shnilar soni. */
  siblings?: number;
  previousLabel?: string;
  nextLabel?: string;
  /** Sahifa tugmasi nomi: `(n) => 'Page n'`. */
  pageLabel?: (page: number) => string;
  'aria-label'?: string;
}

/** Figma "6.4 Pagination": ro'yxat sahifalari orasida o'tish. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  variant = 'numbered',
  size = 's',
  summary,
  pageSize,
  siblings = 1,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageLabel = (n) => `Page ${n}`,
  'aria-label': ariaLabel = 'Pagination',
  className,
  ...rest
}: PaginationProps) {
  const buttonSize = size === 's' ? 'l' : 'xl';
  const go = (next: number) => onPageChange(Math.min(pageCount, Math.max(1, next)));
  const prev = (
    <Button
      variant="flat"
      size={buttonSize}
      iconOnly
      startIcon={<ChevronLeftGlyph />}
      disabled={page <= 1}
      onClick={() => go(page - 1)}
      className="bek-pagination__arrow"
    >
      {previousLabel}
    </Button>
  );
  const next = (
    <Button
      variant="flat"
      size={buttonSize}
      iconOnly
      startIcon={<ChevronRightGlyph />}
      disabled={page >= pageCount}
      onClick={() => go(page + 1)}
      className="bek-pagination__arrow"
    >
      {nextLabel}
    </Button>
  );
  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      className={cx('bek-pagination', `bek-pagination--${size}`, className)}
    >
      {summary && variant === 'numbered' && (
        <span className="bek-pagination__summary">{summary}</span>
      )}
      <div className="bek-pagination__pages">
        {prev}
        {variant === 'compact' ? (
          <span className="bek-pagination__position" aria-live="polite">
            {page} / {pageCount}
          </span>
        ) : (
          paginationRange(page, pageCount, siblings).map((item, i) =>
            item === '…' ? (
              <span key={`e${i}`} className="bek-pagination__item bek-pagination__ellipsis">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className="bek-pagination__item bek-focus-ring"
                aria-label={pageLabel(item)}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => go(item)}
              >
                {item}
              </button>
            ),
          )
        )}
        {next}
      </div>
      {pageSize && variant === 'numbered' && (
        <div className="bek-pagination__page-size">{pageSize}</div>
      )}
    </nav>
  );
}

export interface LoadMoreProps extends HTMLAttributes<HTMLDivElement> {
  /** Ko'rsatilgan elementlar soni. */
  loaded: number;
  total: number;
  onLoadMore: () => void;
  loading?: boolean;
  /** Progress ustidagi matn: "Showing 24 of 120". */
  label?: ReactNode;
  /** Tugma matni. */
  children?: ReactNode;
  size?: 's' | 'm';
}

/** Figma "6.4 Pagination → Load more": mobil — progress + to'liq kenglikdagi tugma. */
export function LoadMore({
  loaded,
  total,
  onLoadMore,
  loading = false,
  label,
  children = 'Load more',
  size = 's',
  className,
  ...rest
}: LoadMoreProps) {
  return (
    <div {...rest} className={cx('bek-load-more', className)}>
      <ProgressBar value={loaded} max={total} size="s" label={label} />
      {loaded < total && (
        <Button
          variant="outline"
          size={size === 's' ? 'l' : 'xl'}
          loading={loading}
          onClick={onLoadMore}
          className="bek-load-more__button"
        >
          {children}
        </Button>
      )}
    </div>
  );
}
