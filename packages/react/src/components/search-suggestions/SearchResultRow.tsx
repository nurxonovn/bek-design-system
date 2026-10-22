'use client';

import { useContext, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import {
  ArrowUpLeftGlyph,
  ClockGlyph,
  FileGlyph,
  ImageGlyph,
  SearchGlyph,
} from '../../icons/index.js';
import { Avatar } from '../avatar/Avatar.js';
import { SuggestionsContext } from './context.js';

/** Figma "Type": Query — taklif qilingan so'rov · Recent — oxirgi qidiruv · Item · Person (Avatar) · File. */
export type SearchResultRowType = 'query' | 'recent' | 'item' | 'person' | 'file';

export interface SearchResultRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  type?: SearchResultRowType;
  /** Figma "Title" — Label/L. */
  title: ReactNode;
  /** Query: foydalanuvchi yozgan qism. `title` satr bo'lsa, mos qism text/primary, qolgani text/secondary. */
  match?: string;
  /** Figma "Show meta" · "Meta" — sana yoki lavozim (Caption/M text/tertiary), sarlavha qatorining oxirida. */
  meta?: ReactNode;
  /** Figma "Show snippet" · "Snippet" — nega mos kelgani (Body/S text/secondary), bir qator. */
  snippet?: ReactNode;
  /** Figma "Show source" · "Source" — manba yorlig'i (#source), kichik pill. */
  source?: ReactNode;
  /** Boshlang'ich ikonka / miniatyura / Avatar o'rniga o'z elementingiz (rasm, `<Avatar src>`). */
  media?: ReactNode;
  /** Figma "State=Selected" — ro'yxatdagi klaviatura fokusi (`aria-selected`, accent/soft, ↵ ishorasi).
   * Berilmasa, SearchSuggestions'ning `activeId` sidan olinadi. */
  selected?: boolean;
  /** Figma "Fill query" ↖ — matnni maydonga qaytaradi (Query · Recent). Faqat sichqoncha/teginish uchun
   * qo'shimcha: option ichida fokuslanuvchi element bo'lmaydi. */
  onFillQuery?: () => void;
  /** ↖ ustidagi maslahat (`title`). */
  fillQueryLabel?: string;
}

/** `title` ichida `match` ni ajratadi: Query'da yozilgan qism text/primary, qolgani text/secondary. */
function highlight(title: ReactNode, match?: string): ReactNode {
  if (typeof title !== 'string' || !match) return title;
  const start = title.toLowerCase().indexOf(match.toLowerCase());
  if (start < 0) return title;
  const end = start + match.length;
  return (
    <>
      {title.slice(0, start)}
      <span className="bek-search-result-row__match">{title.slice(start, end)}</span>
      {title.slice(end)}
    </>
  );
}

function Leading({
  type,
  title,
  media,
}: {
  type: SearchResultRowType;
  title: ReactNode;
  media?: ReactNode;
}) {
  if (type === 'person')
    return (
      <span className="bek-search-result-row__avatar" aria-hidden="true">
        {media ?? <Avatar size="m" name={typeof title === 'string' ? title : undefined} />}
      </span>
    );
  if (type === 'item' || type === 'file')
    return (
      <span className="bek-search-result-row__thumb" aria-hidden="true">
        {media ?? (type === 'file' ? <FileGlyph /> : <ImageGlyph />)}
      </span>
    );
  return (
    <span className="bek-search-result-row__icon" aria-hidden="true">
      {media ?? (type === 'recent' ? <ClockGlyph /> : <SearchGlyph />)}
    </span>
  );
}

/**
 * Figma "3.12 Search bar → Search result row": Search suggestions ichidagi bitta qator (`role="option"`).
 * Hover — fill/soft, Selected — accent/soft va ↵ ishorasi. Fokus inputda qoladi (`aria-activedescendant`).
 */
export function SearchResultRow({
  type = 'query',
  title,
  match,
  meta,
  snippet,
  source,
  media,
  selected,
  onFillQuery,
  fillQueryLabel = 'Fill query',
  id,
  className,
  ...rest
}: SearchResultRowProps) {
  const autoId = useId();
  const optionId = id ?? autoId;
  const { activeId } = useContext(SuggestionsContext);
  const isSelected = selected ?? (activeId !== undefined && activeId === optionId);
  const multiline = snippet != null || source != null;
  const fillable = onFillQuery && (type === 'query' || type === 'recent');

  return (
    <div
      role="option"
      aria-selected={isSelected}
      {...rest}
      id={optionId}
      className={cx(
        'bek-search-result-row',
        `bek-search-result-row--${type}`,
        multiline && 'bek-search-result-row--multiline',
        isSelected && 'bek-search-result-row--selected',
        className,
      )}
    >
      <Leading type={type} title={title} media={media} />
      <span className="bek-search-result-row__content">
        <span className="bek-search-result-row__heading">
          <span
            className={cx(
              'bek-search-result-row__title',
              match && 'bek-search-result-row__title--matched',
            )}
          >
            {type === 'query' ? highlight(title, match) : title}
          </span>
          {meta != null && <span className="bek-search-result-row__meta">{meta}</span>}
        </span>
        {snippet != null && <span className="bek-search-result-row__snippet">{snippet}</span>}
        {source != null && <span className="bek-search-result-row__source">{source}</span>}
      </span>
      {fillable && (
        <span
          className="bek-search-result-row__fill"
          aria-hidden="true"
          title={fillQueryLabel}
          onClick={(event) => {
            event.stopPropagation();
            onFillQuery();
          }}
        >
          <ArrowUpLeftGlyph />
        </span>
      )}
      <kbd className="bek-search-result-row__enter" aria-hidden="true">
        ↵
      </kbd>
    </div>
  );
}
