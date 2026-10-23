'use client';

import { Fragment, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { ANNOUNCE_INTERVAL, useThrottledAnnouncement, type LivePoliteness } from './announce.js';

export type CountdownUnit = 'days' | 'hours' | 'min' | 'sec';

const UNIT_MS: Record<CountdownUnit, number> = {
  days: 86_400_000,
  hours: 3_600_000,
  min: 60_000,
  sec: 1000,
};
const ORDER: CountdownUnit[] = ['days', 'hours', 'min', 'sec'];
const DEFAULT_UNIT_LABELS: Record<CountdownUnit, string> = {
  days: 'days',
  hours: 'hours',
  min: 'min',
  sec: 'sec',
};

export interface CountdownPart {
  unit: CountdownUnit;
  value: number;
}

/**
 * Qolgan vaqtni birliklarga bo'ladi: berilmagan katta birlik keyingisiga qo'shiladi (`days` yo'q bo'lsa
 * soatlar 24 dan oshadi), eng kichik birlik pastga yaxlitlanadi.
 */
export function countdownParts(
  remainingMs: number,
  units: CountdownUnit[] = ORDER,
): CountdownPart[] {
  const list = ORDER.filter((u) => units.includes(u));
  let rest = Math.max(0, remainingMs);
  return list.map((unit) => {
    const value = Math.floor(rest / UNIT_MS[unit]);
    rest -= value * UNIT_MS[unit];
    return { unit, value };
  });
}

export interface CountdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Tugash vaqti: ISO (`2026-10-22T18:00:00+05:00`), `Date` yoki millisekund. Foydalanuvchi vaqt mintaqasida. */
  to: string | number | Date;
  /** Ko'rsatiladigan birliklar. Standart: days · hours · min · sec (tor joyda > 1 kun bo'lsa `sec` ni olib tashlang). */
  units?: CountdownUnit[];
  /** "Enrolment closes in" — Caption/M · `text/secondary`. */
  label?: ReactNode;
  /** Birlik nomlari (uz: `kun`, `soat`, `daq`, `son`). */
  unitLabels?: Partial<Record<CountdownUnit, string>>;
  /** Ekran o'quvchi matni: "2 days 14 hours left". Standart — ikki eng katta birlik + `leftLabel`. */
  formatText?: (parts: CountdownPart[]) => string;
  leftLabel?: string;
  /** Hozirgi vaqt (SSR va testlar uchun boshlang'ich nuqta). Standart: `Date.now()`. */
  now?: number | Date;
  /** Vaqt tugaganda: 00 va holat xabari (`role="status"`). */
  endMessage?: ReactNode;
  onEnd?: () => void;
  /** `aria-live` darajasi. Standart `polite`, daqiqada ko'pi bilan bir e'lon. */
  live?: LivePoliteness;
  announceInterval?: number;
}

const toTime = (v: string | number | Date) =>
  v instanceof Date ? v.getTime() : new Date(v).getTime();

/**
 * Figma "4.18 Chart · Number ticker" (Countdown): muddatgacha qolgan vaqt — har birlik `bg/sheet` blokda
 * (Headline/M qiymat, Caption/S birlik). Tab yashirin bo'lsa to'xtaydi; matnli ekvivalent ("2 days 14 hours
 * left") har doim o'qiladi. Soxta shoshilinchlik (qayta boshlanuvchi taymer) uchun ishlatmang.
 */
export function Countdown({
  to,
  units = ORDER,
  label,
  unitLabels,
  formatText,
  leftLabel = 'left',
  now: nowProp,
  endMessage,
  onEnd,
  live = 'polite',
  announceInterval = ANNOUNCE_INTERVAL,
  className,
  ...rest
}: CountdownProps) {
  const target = toTime(to);
  const [now, setNow] = useState(() => (nowProp != null ? toTime(nowProp) : Date.now()));
  const ended = useRef(false);
  const remaining = Math.max(0, (Number.isFinite(target) ? target : 0) - now);
  const parts = countdownParts(remaining, units);
  const names = { ...DEFAULT_UNIT_LABELS, ...unitLabels };
  const done = remaining <= 0;

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const tick = () => setNow(Date.now());
    const start = () => {
      if (id == null) id = setInterval(tick, 1000);
    };
    const stop = () => {
      if (id != null) clearInterval(id);
      id = null;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        tick();
        start();
      }
    };
    tick();
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [target]);

  useEffect(() => {
    if (done && !ended.current) {
      ended.current = true;
      onEnd?.();
    }
    if (!done) ended.current = false;
  }, [done, onEnd]);

  const visible = parts.filter((p, i) => p.value > 0 || i === parts.length - 1);
  const text = formatText
    ? formatText(parts)
    : `${visible
        .slice(0, 2)
        .map((p) => `${p.value} ${names[p.unit]}`)
        .join(' ')} ${leftLabel}`;
  const announced = useThrottledAnnouncement(text, announceInterval, live !== 'off' && !done);

  return (
    <div {...rest} className={cx('bek-number-ticker', 'bek-number-ticker--countdown', className)}>
      {label != null && <p className="bek-number-ticker__label">{label}</p>}
      <div className="bek-number-ticker__units" aria-hidden="true">
        {parts.map((p, i) => (
          <Fragment key={p.unit}>
            {i > 0 && <span className="bek-number-ticker__separator">:</span>}
            <span className="bek-number-ticker__unit">
              <span className="bek-number-ticker__unit-value" suppressHydrationWarning>
                {String(p.value).padStart(2, '0')}
              </span>
              <span className="bek-number-ticker__unit-label">{names[p.unit]}</span>
            </span>
          </Fragment>
        ))}
      </div>
      <span className="bek-chart__sr" suppressHydrationWarning>
        {text}
      </span>
      {done && endMessage != null && (
        <p className="bek-number-ticker__end" role="status">
          {endMessage}
        </p>
      )}
      {live !== 'off' && (
        <span className="bek-chart__sr" aria-live={live} aria-atomic="true">
          {announced}
        </span>
      )}
    </div>
  );
}
