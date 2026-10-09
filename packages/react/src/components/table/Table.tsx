import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx.js';
import { SortAscGlyph, SortDescGlyph } from '../../icons/index.js';

/** Qator balandligi: s 40 · m 48 · l 56 px. */
export type TableSize = 's' | 'm' | 'l';
export type SortDirection = 'asc' | 'desc' | 'none';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  size?: TableSize;
  /** Juft qatorlar `fill/secondary`. */
  zebra?: boolean;
}

/** Figma "4.5 Table": native `<table>` — ekran o'quvchi ustun va qator sarlavhalarini o'qiydi. */
export function Table({ size = 'm', zebra = false, className, ...rest }: TableProps) {
  return (
    <table
      className={cx('bek-table', `bek-table--${size}`, zebra && 'bek-table--zebra', className)}
      {...rest}
    />
  );
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Saralash holati; berilsa sarlavha tugmaga aylanadi. */
  sort?: SortDirection;
  onSort?: () => void;
}

/** Ustun sarlavhasi (Figma "Table header cell"): `fill/secondary`, Label/M `text/secondary`. */
export function TableHeaderCell({
  sort,
  onSort,
  className,
  children,
  ...rest
}: TableHeaderCellProps) {
  const ariaSort =
    sort === 'asc' ? 'ascending' : sort === 'desc' ? 'descending' : sort ? 'none' : undefined;
  return (
    <th scope="col" aria-sort={ariaSort} className={cx('bek-table__th', className)} {...rest}>
      {onSort ? (
        <button type="button" className="bek-table__sort bek-focus-ring" onClick={onSort}>
          {children}
          <span className="bek-table__sort-icon" aria-hidden="true">
            {sort === 'asc' ? <SortAscGlyph /> : sort === 'desc' ? <SortDescGlyph /> : null}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  disabled?: boolean;
}

/** Qator: hover `fill/soft-hover`, tanlangan `accent/soft`, o'chirilgan — `text/disabled`. */
export function TableRow({
  selected = false,
  disabled = false,
  className,
  ...rest
}: TableRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      className={cx(
        'bek-table__row',
        selected && 'is-selected',
        disabled && 'is-disabled',
        className,
      )}
      {...rest}
    />
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Ikkinchi qator (Figma "Text + description"). */
  description?: ReactNode;
  /** Raqamlar uchun: o'ngga tekislash va tabular raqamlar. */
  numeric?: boolean;
}

/** Katak (Figma "Table cell"): Body/S, padding 16, gap 12, pastida `border/hairline`. */
export function TableCell({
  description,
  numeric = false,
  className,
  children,
  ...rest
}: TableCellProps) {
  return (
    <td className={cx('bek-table__td', numeric && 'bek-table__td--numeric', className)} {...rest}>
      {description ? (
        <span className="bek-table__stack">
          <span className="bek-table__primary">{children}</span>
          <span className="bek-table__description">{description}</span>
        </span>
      ) : (
        children
      )}
    </td>
  );
}
