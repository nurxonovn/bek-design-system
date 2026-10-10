import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type PatternType = 'dots' | 'grid' | 'diagonal' | 'logo-petals';
export type PatternTone = 'subtle' | 'accent';

export interface PatternProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma "Type": dots (16 panjara) · grid (32 chiziq) · diagonal (20 yo'l) · logo-petals (brend belgisi, 48 qadam). */
  type?: PatternType;
  /** Figma "Tone": subtle — fill/soft-pressed on bg/base; accent — fill/on-color-hover on accent/default. */
  tone?: PatternTone;
}

/**
 * Figma "2.5 Pattern": empty state, promo sheet, onboarding va karta fonlari uchun bezak plitka (320 × 320, takrorlanadi).
 * Kontent ostida turadi, matn yoki forma ustiga qo'yilmaydi; ekranda bitta pattern, rangi o'zgartirilmaydi.
 */
export function Pattern({ type = 'dots', tone = 'subtle', className, ...rest }: PatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cx('bek-pattern', `bek-pattern--${type}`, `bek-pattern--${tone}`, className)}
      {...rest}
    />
  );
}
