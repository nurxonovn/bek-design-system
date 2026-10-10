'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Spinner } from '../spinner/Spinner.js';

export type FieldVariant = 'filled' | 'outlined' | 'plain';
/** Maydon balandligi: s 36 · m 44 · l 56 · xl 64 px. */
export type FieldSize = 's' | 'm' | 'l' | 'xl';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Maydon ichidagi label: bo'sh holatda katta, qiymat yoki focus bo'lganda yuqoriga ko'tariladi. */
  label?: string;
  /** Pastdagi yordamchi yoki xato matni. */
  supportingText?: ReactNode;
  /** Xato holati: qizil chegara, `aria-invalid`, yordamchi matn qizil. */
  error?: boolean;
  variant?: FieldVariant;
  size?: FieldSize;
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

const ICON_SPINNER: Record<FieldSize, 16 | 20 | 24> = { s: 16, m: 16, l: 20, xl: 20 };

/** Figma "3.2 Text field": suzuvchi label, yordamchi matn, ikonkalar, Filled · Outlined · Plain. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    supportingText,
    error = false,
    variant = 'filled',
    size = 'm',
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
  const trailing = loading ? <Spinner size={ICON_SPINNER[size]} label={null} /> : trailingIcon;

  return (
    <div
      className={cx(
        'bek-field',
        `bek-field--${variant}`,
        `bek-field--${size}`,
        label && 'bek-field--labelled',
        placeholder && 'bek-field--floating',
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
          <input
            ref={ref}
            id={inputId}
            className="bek-field__input"
            placeholder={placeholder ?? (label ? ' ' : undefined)}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={supportId}
            {...rest}
          />
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
