import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export type TagVariant = 'subtle' | 'outline';
export type TagColor = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'utility';
export type TagSize = 's' | 'm';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  variant?: TagVariant;
  color?: TagColor;
  /** Balandlik: s 20 · m 24 px. */
  size?: TagSize;
  /** Matndan oldin ikonka (s — 12 px, m — 16 px). */
  icon?: ReactNode;
  children: ReactNode;
}

/** Figma "4.2 Badge → Tag": metama'lumot yorlig'i. Badge'dan farqi — holat emas, ma'lumot; burchaklari yumaloq to'rtburchak. */
export function Tag({
  variant = 'subtle',
  color = 'neutral',
  size = 's',
  icon,
  className,
  children,
  ...rest
}: TagProps) {
  return (
    <span
      {...rest}
      className={cx(
        'bek-tag',
        `bek-tag--${variant}`,
        `bek-tag--${size}`,
        `bek-tone--${color}`,
        className,
      )}
    >
      {icon && (
        <span className="bek-tag__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-tag__label">{children}</span>
    </span>
  );
}
