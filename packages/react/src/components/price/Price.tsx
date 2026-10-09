import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

/** Summa uslubi: s Label/L · m Title/M · l Headline/S · xl Headline/M. */
export type PriceSize = 's' | 'm' | 'l' | 'xl';

export interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  /** Formatlangan summa ("4 234 000"). Raqam bo'lsa `locale` bilan formatlanadi. */
  amount: number | string;
  currency?: ReactNode;
  /** Chegirmadan oldingi narx — chizilgan. Berilsa "Sale" ko'rinishi yoqiladi. */
  oldAmount?: number | string;
  /** Chegirma yorlig'i ("−20%"). */
  discount?: ReactNode;
  /** Izoh ("oyiga, yillik to'lovda"). */
  note?: ReactNode;
  size?: PriceSize;
  /** `inline` — bir qatorda; `stacked` — eski narx va chegirma pastda. */
  layout?: 'inline' | 'stacked';
  locale?: string;
}

/** Figma "4.9 Price": narx, chegirma, eski narx va izoh. Sale — joriy narx `text/danger`. */
export function Price({
  amount,
  currency,
  oldAmount,
  discount,
  note,
  size = 'm',
  layout = 'inline',
  locale,
  className,
  ...rest
}: PriceProps) {
  const fmt = (v: number | string) => (typeof v === 'number' ? v.toLocaleString(locale) : v);
  const sale = oldAmount !== undefined;
  const meta = (sale || discount) && (
    <span className="bek-price__meta">
      {sale && (
        <s className="bek-price__old">
          {fmt(oldAmount)}
          {currency && <> {currency}</>}
        </s>
      )}
      {discount && <span className="bek-price__discount">{discount}</span>}
    </span>
  );
  return (
    <span
      className={cx(
        'bek-price',
        `bek-price--${size}`,
        `bek-price--${layout}`,
        sale && 'bek-price--sale',
        className,
      )}
      {...rest}
    >
      <span className="bek-price__row">
        <span className="bek-price__current">
          <span className="bek-price__amount">{fmt(amount)}</span>
          {currency && <span className="bek-price__currency">{currency}</span>}
        </span>
        {layout === 'inline' && meta}
      </span>
      {layout === 'stacked' && meta}
      {note && <span className="bek-price__note">{note}</span>}
    </span>
  );
}
