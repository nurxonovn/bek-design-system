import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export type BadgeVariant = 'filled' | 'subtle' | 'outline';
export type BadgeColor = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 's' | 'm' | 'l';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** `filled` — kuchli signal; `subtle` — ro'yxat va jadvallardagi holatlar; `outline` — sokin meta. */
  variant?: BadgeVariant;
  /** Ma'noga mos rang: success — muvaffaqiyat, danger — xato. Bezak uchun tanlanmaydi. */
  color?: BadgeColor;
  /** Balandlik: s 20 · m 24 · l 28 px. */
  size?: BadgeSize;
  /** Matndan oldin 6 px nuqta. */
  dot?: boolean;
  /** Matndan oldin ikonka (s/m — 12 px, l — 16 px). Rangi matn bilan bir xil. */
  icon?: ReactNode;
  /** Qisqa matn — 1–2 so'z. */
  children: ReactNode;
}

/** Figma "4.2 Badge": holat yoki son ko'rsatadigan pill. */
export function Badge({
  variant = 'filled',
  color = 'neutral',
  size = 'm',
  dot = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      {...rest}
      className={cx(
        'bek-badge',
        `bek-badge--${variant}`,
        `bek-badge--${size}`,
        `bek-tone--${color}`,
        className,
      )}
    >
      {dot && <span className="bek-badge__dot" aria-hidden="true" />}
      {icon && (
        <span className="bek-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-badge__label">{children}</span>
    </span>
  );
}
