'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /**
   * Figma "Variant": inherit — matn ichida, atrofidagi rangni oladi, doim tagi chizilgan;
   * accent — mustaqil havola ("Hammasini ko'rish"), tag chizig'i hover'da; neutral — karta va
   * ro'yxat sarlavhalari; subtle — huquqiy satrlar va footer, doim tagi chizilgan.
   */
  variant?: 'inherit' | 'accent' | 'neutral' | 'subtle';
  /** Body/S 14/20 · Body/M 16/24 · Body/L 18/28 — atrofdagi matn o'lchamiga mos. */
  size?: 's' | 'm' | 'l';
  /** Oldingi ikonka (16/20, matn rangida). */
  startIcon?: ReactNode;
  /** Keyingi ikonka — chevron yoki tashqi havola; RTL'da aks ettiriladi. */
  endIcon?: ReactNode;
  /** O'chirilgan havola: href olib tashlanadi, `aria-disabled`, text/disabled. */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Figma "3.18 Link": foydalanuvchini boshqa joyga olib boradigan matn havolasi. Padding va fon yo'q —
 * bu matn, tugma emas (joyida bajariladigan amal uchun Button Flat). Touch'da 44 px nishon maydoni
 * havolani kattalashtirish bilan emas, qatorning padding'i bilan beriladi.
 */
export function Link({
  variant = 'inherit',
  size = 's',
  startIcon,
  endIcon,
  disabled = false,
  href,
  className,
  children,
  onClick,
  ...rest
}: LinkProps) {
  return (
    <a
      className={cx(
        'bek-link',
        'bek-focus-ring',
        `bek-link--${variant}`,
        `bek-link--${size}`,
        disabled && 'bek-link--disabled',
        className,
      )}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {startIcon && (
        <span className="bek-link__icon bek-link__icon--start" aria-hidden="true">
          {startIcon}
        </span>
      )}
      <span className="bek-link__label">{children}</span>
      {endIcon && (
        <span className="bek-link__icon bek-link__icon--end" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </a>
  );
}
