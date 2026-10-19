import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { formatPercent } from '../../core/format.js';

export type DeltaVariant = 'positive' | 'negative' | 'neutral';

export interface DeltaProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** O'zgarish, foizda: `12.4` → `+12,4%`, `-3.1` → `−3,1%`. */
  value: number;
  /** Qaysi yo'nalish yaxshi: `up` (daromad) yoki `down` (xarajat, xatolar) — rang shunga qarab teskari bo'ladi. */
  betterWhen?: 'up' | 'down';
  /** |Δ| shu chegaradan kichik bo'lsa — Neutral. Standart 0,5%. */
  threshold?: number;
  /** Matnni o'zgartirish (masalan `+1 240 so'm`). Standart — foiz. */
  label?: string;
}

/** Variant: ishora + `betterWhen` + `threshold` (Figma 4.18 Delta doc). */
export function deltaVariant(
  value: number,
  betterWhen: 'up' | 'down' = 'up',
  threshold = 0.5,
): DeltaVariant {
  if (!Number.isFinite(value) || Math.abs(value) < threshold) return 'neutral';
  const good = betterWhen === 'up' ? value > 0 : value < 0;
  return good ? 'positive' : 'negative';
}

/** Figma "4.18 Chart · Delta": o'zgarish pill'i — o'q (aria-hidden) + `+12,4%`. */
export function Delta({
  value,
  betterWhen = 'up',
  threshold = 0.5,
  label,
  className,
  ...rest
}: DeltaProps) {
  const variant = deltaVariant(value, betterWhen, threshold);
  const dir = Math.abs(value) < threshold ? 'flat' : value > 0 ? 'up' : 'down';
  return (
    <span {...rest} className={cx('bek-delta', `bek-delta--${variant}`, className)}>
      <svg className="bek-delta__arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {dir === 'flat' ? (
          <path d="M2.5 6h7" />
        ) : (
          <path d={dir === 'up' ? 'M6 9.5v-7M3 5.5l3-3 3 3' : 'M6 2.5v7M3 6.5l3 3 3-3'} />
        )}
      </svg>
      <span className="bek-delta__value">{label ?? formatPercent(value, { signed: true })}</span>
    </span>
  );
}
