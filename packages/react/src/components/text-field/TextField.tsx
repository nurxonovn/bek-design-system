'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Spinner } from '../spinner/Spinner.js';

/** Select va Textarea varianti: filled · outlined · plain. */
export type FieldVariant = 'filled' | 'outlined' | 'plain';
/**
 * Text field varianti (Figma 3.2): filled · outlined · underlined.
 * `plain` — eski nom, Figma'da Underlined bilan almashtirilgan.
 */
export type TextFieldVariant = 'filled' | 'outlined' | 'underlined' | 'plain';
/** Maydon balandligi (`field/height/*`): s 36 · m 44 · l 56 · xl 64 px. */
export type FieldSize = 's' | 'm' | 'l' | 'xl';
/** Text field o'lchami: `2xl` 72 px — faqat `underlined` (login / onboarding). */
export type TextFieldSize = FieldSize | '2xl';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Maydon ichidagi label: bo'sh holatda katta, qiymat yoki focus bo'lganda yuqoriga ko'tariladi. */
  label?: string;
  /** Pastdagi yordamchi yoki xato matni. */
  supportingText?: ReactNode;
  /** Xato holati: qizil chegara, `aria-invalid`, yordamchi matn qizil. */
  error?: boolean;
  /** `plain` — deprecated, `underlined` sifatida chiziladi. */
  variant?: TextFieldVariant;
  size?: TextFieldSize;
  /** Figma "Show prefix": qiymat oldidagi matn — valyuta, `+998`. */
  prefix?: ReactNode;
  /** Figma "Show suffix": qiymat ortidagi matn — birlik, `.00`. */
  suffix?: ReactNode;
  leadingIcon?: ReactNode;
  /** Tozalash, ko'rsatish yoki kalendar tugmasi/ikonkasi. */
  trailingIcon?: ReactNode;
  /** O'ng tomonda spinner (masalan, qidiruv yoki tekshiruv paytida). */
  loading?: boolean;
  /** Ma'lumot yuklanguncha — faqat kulrang blok. */
  skeleton?: boolean;
  /** Tashqi o'ram (`.bek-field`) klassi; `className` input'ga emas, o'ramga beriladi. */
  className?: string;
}

const ICON_SPINNER: Record<TextFieldSize, 16 | 20 | 24> = {
  s: 16,
  m: 16,
  l: 20,
  xl: 20,
  '2xl': 20,
};

/** Figma "3.2 Text field": suzuvchi label, yordamchi matn, prefix/suffix, ikonkalar, Filled · Outlined · Underlined. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    supportingText,
    error = false,
    variant = 'filled',
    size = 'm',
    prefix,
    suffix,
    leadingIcon,
    trailingIcon,
    loading = false,
    skeleton = false,
    placeholder,
    id,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `bek-field-${autoId.replace(/:/g, '')}`;
  const supportId = supportingText ? `${inputId}-support` : undefined;
  const prefixId = prefix != null ? `${inputId}-prefix` : undefined;
  const suffixId = suffix != null ? `${inputId}-suffix` : undefined;
  const describedBy = [prefixId, suffixId, supportId].filter(Boolean).join(' ') || undefined;
  const affixed = prefixId !== undefined || suffixId !== undefined;
  const look = variant === 'plain' ? 'underlined' : variant;
  const trailing = loading ? <Spinner size={ICON_SPINNER[size]} label={null} /> : trailingIcon;

  const input = (
    <input
      ref={ref}
      id={inputId}
      className="bek-field__input"
      placeholder={placeholder ?? (label ? ' ' : undefined)}
      disabled={disabled}
      aria-invalid={error || undefined}
      aria-describedby={describedBy}
      {...rest}
    />
  );

  return (
    <div
      className={cx(
        'bek-field',
        `bek-field--${look}`,
        `bek-field--${size}`,
        label && 'bek-field--labelled',
        (placeholder || affixed) && 'bek-field--floating',
        error && 'bek-field--error',
        disabled && 'bek-field--disabled',
        skeleton && 'bek-field--skeleton',
        className,
      )}
      aria-busy={skeleton || loading || undefined}
    >
      <div className="bek-field__control">
        {leadingIcon && (
          <span className="bek-field__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <div className="bek-field__content">
          {affixed ? (
            <div className="bek-field__value">
              {prefixId && (
                <span id={prefixId} className="bek-field__affix">
                  {prefix}
                </span>
              )}
              {input}
              {suffixId && (
                <span id={suffixId} className="bek-field__affix">
                  {suffix}
                </span>
              )}
            </div>
          ) : (
            input
          )}
          {label && (
            <label className="bek-field__label" htmlFor={inputId}>
              {label}
            </label>
          )}
        </div>
        {trailing && (
          <span className="bek-field__icon" aria-hidden={loading || undefined}>
            {trailing}
          </span>
        )}
      </div>
      {supportingText && (
        <div id={supportId} className="bek-field__supporting">
          {supportingText}
        </div>
      )}
    </div>
  );
});
