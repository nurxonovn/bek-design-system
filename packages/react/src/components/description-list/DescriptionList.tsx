import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { StatusGlyph } from '../../icons/status.js';

export type DescriptionListLayout = 'justified' | 'columns' | 'inline';

export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLDListElement>, 'title'> {
  /**
   * Figma "Layout": justified — qiymat o'ngga tekislangan (narx, chek); columns — 152 px term ustuni,
   * qiymat o'raladi (xususiyatlar); inline — "Term: qiymat" (ixcham kartalar, Mobile).
   */
  layout?: DescriptionListLayout;
  /** Body/S (qatorlar 4 oraliq) · Body/M · Body/L (8 oraliq) — atrofdagi matnga mos. */
  size?: 's' | 'm' | 'l';
  /** Title/M sarlavha. */
  title?: ReactNode;
  /** Sarlavha qatorining o'ng tomonidagi havola ("Hammasini ko'rish" — Link accent). */
  action?: ReactNode;
  /** Jami qatori: Divider + Body Strong. */
  total?: { term: ReactNode; value: ReactNode };
  children: ReactNode;
}

/**
 * Figma "4.16 Description list": term · qiymat juftliklari — xususiyatlar, cheklar, buyurtma
 * tafsilotlari. Table'dan yengil. 3–8 qator; ko'proq bo'lsa "Hammasini ko'rish" ortiga yashiring.
 */
export function DescriptionList({
  layout = 'justified',
  size = 's',
  title,
  action,
  total,
  className,
  children,
  ...rest
}: DescriptionListProps) {
  return (
    <div className={cx('bek-dl', `bek-dl--${layout}`, `bek-dl--${size}`, className)}>
      {(title || action) && (
        <div className="bek-dl__header">
          {title && <h3 className="bek-dl__title">{title}</h3>}
          {action && <div className="bek-dl__action">{action}</div>}
        </div>
      )}
      <dl className="bek-dl__list" {...rest}>
        {children}
        {total && (
          <div className="bek-dl__item bek-dl__total">
            <dt className="bek-dl__term">{total.term}</dt>
            <dd className="bek-dl__value">{total.value}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export interface DescriptionListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** text/secondary. */
  term: ReactNode;
  /** Figma "Show hint": information-circle 16, matn `title` (tooltip) orqali. */
  hint?: string;
  /** Figma "Leader": nuqtali 1 px chiziq (border/default) — ko'z uzoq yurganda. */
  leader?: boolean;
  /** Qiymat — text/primary. Ochiladigan qiymat uchun ichiga Link (3.18) qo'ying. */
  children: ReactNode;
}

/** Bitta term · qiymat juftligi. Layout va o'lcham ota `DescriptionList` dan keladi. */
export function DescriptionListItem({
  term,
  hint,
  leader = false,
  className,
  children,
  ...rest
}: DescriptionListItemProps) {
  return (
    <div className={cx('bek-dl__item', leader && 'bek-dl__item--leader', className)} {...rest}>
      <dt className="bek-dl__term">
        {term}
        {hint && (
          <span className="bek-dl__hint" title={hint}>
            <StatusGlyph tone="info" variant="stroke" />
            <span className="bek-visually-hidden">{hint}</span>
          </span>
        )}
      </dt>
      {leader && <span className="bek-dl__leader" aria-hidden="true" />}
      <dd className="bek-dl__value">{children}</dd>
    </div>
  );
}
