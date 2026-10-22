'use client';

import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Spinner, type SpinnerSize } from '../spinner/Spinner.js';

type Tone = 'action' | 'info' | 'success' | 'warning' | 'danger' | 'utility';

/** Figma "3.1 Button" Variant'lari (kichik harfda). */
export type ButtonVariant =
  | 'normal'
  | 'action'
  | 'danger'
  | 'raised'
  | 'outline'
  | `outline-${Tone}`
  | 'flat'
  | `flat-${Tone}`
  | 'flat-secondary'
  | 'normal-contrast'
  | 'outline-contrast'
  | 'flat-contrast';

/** Balandlik: m 28 · l 36 · xl 44 · 2xl 56 · 3xl 64 px (field/height bilan juft). Touch uchun kamida xl. */
export type ButtonSize = 'm' | 'l' | 'xl' | '2xl' | '3xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Matndan oldingi ikonka — amalni tushuntiradi (plus, download). */
  startIcon?: ReactNode;
  /** Matndan keyingi ikonka — yo'nalish yoki menyu (arrow, chevron). */
  endIcon?: ReactNode;
  /** Spinner start icon o'rnida; takroriy bosish bloklanadi, ranglar o'zgarmaydi. */
  loading?: boolean;
  /** Toggle tugma (toolbar: bold, filter) — `aria-pressed`. Navigatsiya uchun emas. */
  pressed?: boolean;
  /** Faqat ikonka. `children` ekran o'quvchi uchun nom bo'lib qoladi (yoki `aria-label` bering). */
  iconOnly?: boolean;
}

const SPINNER_SIZE: Record<ButtonSize, SpinnerSize> = {
  m: 16,
  l: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 24,
};

/** Figma "3.1 Button": har qanday amal uchun bitta komponent. Pill shakli, 5 o'lcham. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'normal',
    size = 'm',
    startIcon,
    endIcon,
    loading = false,
    pressed,
    iconOnly = false,
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  const lead = loading ? <Spinner size={SPINNER_SIZE[size]} label={null} /> : startIcon;

  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      {...rest}
      onClick={handleClick}
      className={cx(
        'bek-button',
        'bek-focus-ring',
        `bek-button--${variant}`,
        `bek-button--${size}`,
        iconOnly && 'bek-button--icon-only',
        className,
      )}
    >
      {lead && (
        <span className="bek-button__icon" aria-hidden="true">
          {lead}
        </span>
      )}
      {iconOnly ? (
        <span className="bek-visually-hidden">{children}</span>
      ) : (
        <span className="bek-button__label">{children}</span>
      )}
      {!iconOnly && endIcon && (
        <span className="bek-button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </button>
  );
});
