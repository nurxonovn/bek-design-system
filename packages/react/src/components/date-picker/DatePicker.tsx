'use client';

import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronLeftGlyph, ChevronRightGlyph } from '../../icons/index.js';

export type DateRange = [Date | null, Date | null];

interface DatePickerBase {
  /** Bundan oldingi kunlar o'chiriladi (masalan, bugun). */
  minDate?: Date;
  maxDate?: Date;
  /** Oy va hafta kunlari nomlari uchun (`'uz'`, `'en'`, `'ru'`). */
  locale?: string;
  /** Birinchi ko'rinadigan oy. Default — tanlangan sana yoki bugun. */
  defaultMonth?: Date;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

export interface SingleDatePickerProps extends DatePickerBase {
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date) => void;
}

export interface RangeDatePickerProps extends DatePickerBase {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  /** To'r ostidagi xulosa ("12 – 16 oktyabr · 5 kun"). Default — Intl; `null` — yashiradi. */
  formatRange?: ((from: Date, to: Date) => ReactNode) | null;
}

export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const same = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Figma Range xulosasi: "12 – 16 October · 5 days" (Intl formatRange + unit "day"). */
function defaultFormatRange(from: Date, to: Date, locale?: string): string {
  const dates = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' });
  const period =
    typeof dates.formatRange === 'function'
      ? dates.formatRange(from, to)
      : `${dates.format(from)} – ${dates.format(to)}`;
  const days = Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS) + 1;
  let count: string;
  try {
    count = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'day',
      unitDisplay: 'long',
    }).format(days);
  } catch {
    count = String(days);
  }
  return `${period} · ${count}`;
}

/** Figma "3.14 Date picker" (Single · Range): dushanbadan boshlanadigan oy to'ri, bugun nuqtasi,
 *  oraliq tasmasi. Klaviatura: ← → kun, ↑ ↓ hafta, PageUp/PageDown oy, Home/End hafta boshi/oxiri. */
export function DatePicker(props: DatePickerProps) {
  const {
    minDate,
    maxDate,
    locale,
    defaultMonth,
    previousLabel = 'Previous month',
    nextLabel = 'Next month',
    className,
  } = props;
  const today = startOfDay(new Date());
  const isRange = props.mode === 'range';

  const [innerSingle, setInnerSingle] = useState<Date | null>(
    !isRange ? ((props as SingleDatePickerProps).defaultValue ?? null) : null,
  );
  const [innerRange, setInnerRange] = useState<DateRange>(
    isRange ? ((props as RangeDatePickerProps).defaultValue ?? [null, null]) : [null, null],
  );
  const single = !isRange ? ((props as SingleDatePickerProps).value ?? innerSingle) : null;
  const range = isRange ? ((props as RangeDatePickerProps).value ?? innerRange) : [null, null];
  const anchor = single ?? range[0] ?? defaultMonth ?? today;

  const [month, setMonth] = useState(() => new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  const [focus, setFocus] = useState<Date>(() => startOfDay(anchor));
  const grid = useRef<HTMLDivElement>(null);

  const monthTitle = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    month,
  );
  const dayLabel = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const monday = new Date(2024, 0, 1); // 1-yanvar 2024 — dushanba
    return Array.from({ length: 7 }, (_, i) => fmt.format(addDays(monday, i)));
  }, [locale]);

  const first = month;
  const offset = (first.getDay() + 6) % 7; // dushanbadan
  const cells = Array.from({ length: 42 }, (_, i) => addDays(first, i - offset));
  const disabled = (d: Date) =>
    (!!minDate && d < startOfDay(minDate)) || (!!maxDate && d > startOfDay(maxDate));

  const select = (d: Date) => {
    if (disabled(d)) return;
    if (!isRange) {
      setInnerSingle(d);
      (props as SingleDatePickerProps).onChange?.(d);
      return;
    }
    const [from, to] = range;
    const next: DateRange = !from || to || d < from ? [d, null] : [from, d];
    setInnerRange(next);
    (props as RangeDatePickerProps).onChange?.(next);
  };

  const moveFocus = (d: Date) => {
    setFocus(d);
    if (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    requestAnimationFrame(() => {
      grid.current?.querySelector<HTMLButtonElement>(`[data-date="${key(d)}"]`)?.focus();
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl' ? -1 : 1;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1 * rtl),
      ArrowRight: () => addDays(focus, 1 * rtl),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () =>
        new Date(focus.getFullYear(), focus.getMonth() - 1, Math.min(focus.getDate(), 28)),
      PageDown: () =>
        new Date(focus.getFullYear(), focus.getMonth() + 1, Math.min(focus.getDate(), 28)),
      Home: () => addDays(focus, -((focus.getDay() + 6) % 7)),
      End: () => addDays(focus, 6 - ((focus.getDay() + 6) % 7)),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      moveFocus(move());
    }
  };

  const [from, to] = range;
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const formatRange = isRange ? (props as RangeDatePickerProps).formatRange : undefined;
  const summary =
    isRange && from && to && formatRange !== null
      ? formatRange
        ? formatRange(from, to)
        : defaultFormatRange(from, to, locale)
      : null;

  return (
    <div className={cx('bek-date-picker', className)}>
      <div className="bek-date-picker__header">
        <span className="bek-date-picker__month" aria-live="polite">
          {monthTitle}
        </span>
        <div className="bek-date-picker__nav">
          <button
            type="button"
            className="bek-date-picker__nav-button bek-focus-ring"
            aria-label={previousLabel}
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <ChevronLeftGlyph />
          </button>
          <button
            type="button"
            className="bek-date-picker__nav-button bek-focus-ring"
            aria-label={nextLabel}
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <ChevronRightGlyph />
          </button>
        </div>
      </div>
      <div role="grid" aria-label={monthTitle} ref={grid} onKeyDown={onKeyDown}>
        <div role="row" className="bek-date-picker__weekdays">
          {weekdays.map((d) => (
            <span role="columnheader" key={d} className="bek-date-picker__weekday">
              {d}
            </span>
          ))}
        </div>
        {weeks.map((week, w) => (
          <div role="row" key={w} className="bek-date-picker__week">
            {week.map((d) => {
              const outside = d.getMonth() !== month.getMonth();
              const off = disabled(d);
              const isSelected = isRange ? same(d, from) || same(d, to) : same(d, single);
              const inRange = isRange && !!from && !!to && d > from && d < to;
              const state = cx(
                same(d, today) && 'is-today',
                isSelected && 'is-selected',
                inRange && 'is-in-range',
                isRange && from && to && same(d, from) && !same(from, to) && 'is-range-start',
                isRange && from && to && same(d, to) && !same(from, to) && 'is-range-end',
                (outside || off) && 'is-muted',
              );
              return (
                <div
                  role="gridcell"
                  key={key(d)}
                  aria-selected={isSelected || inRange || undefined}
                  className={cx('bek-date-picker__cell', state)}
                >
                  {!outside && (
                    <button
                      type="button"
                      className="bek-date-picker__day"
                      data-date={key(d)}
                      tabIndex={same(d, focus) ? 0 : -1}
                      disabled={off}
                      aria-label={dayLabel.format(d)}
                      aria-current={same(d, today) ? 'date' : undefined}
                      onClick={() => {
                        setFocus(d);
                        select(d);
                      }}
                    >
                      {d.getDate()}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {summary && (
        <p className="bek-date-picker__summary" aria-live="polite">
          {summary}
        </p>
      )}
    </div>
  );
}
