import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

/** Figma `_Icon` o'lchamlari (px) — tokenlar: icon/xs 12 · sm 16 · md 20 · lg 24 · xl 32. */
export type IconSize = 12 | 16 | 20 | 24 | 32;

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** SVG ikonka (BEK Icons kutubxonasidan). Rangi `currentColor` orqali matndan olinadi. */
  children: ReactNode;
  size?: IconSize;
  /** Ikonka yolg'iz ma'no tashisa (matnsiz tugma) — ekran o'quvchi uchun nom. Bo'lmasa yashiriladi. */
  label?: string;
}

/** Figma "9.1 Slots & Helpers → _Icon": ikonka uchun o'lchamli slot. */
export function Icon({ children, size = 16, label, className, ...rest }: IconProps) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <span {...a11y} {...rest} className={cx('bek-icon', `bek-icon--${size}`, className)}>
      {children}
    </span>
  );
}
