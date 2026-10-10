'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { BackspaceGlyph, FaceIdGlyph, FingerprintGlyph } from '../../icons/index.js';

export type CodeInputState = 'typing' | 'error' | 'success';

export interface CodeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'size' | 'type' | 'maxLength'> {
  /** Kiritilgan raqamlar. */
  value: string;
  length?: 4 | 6;
  state?: CodeInputState;
  /** Pastdagi matn ("PIN kiriting", "Kod noto'g'ri"). */
  helperText?: ReactNode;
  /** Tashqi o'ram klassi. */
  className?: string;
}

/** Figma "4.7 Pincode → Code input": PIN nuqtalari + yordamchi matn. Ichida yashirin input —
 *  klaviaturadan yozish va SMS kodni avto-to'ldirish ishlaydi. */
export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(function CodeInput(
  { value, length = 4, state = 'typing', helperText, className, ...rest },
  ref,
) {
  return (
    <div className={cx('bek-code-input', `bek-code-input--${state}`, className)}>
      <label className="bek-code-input__dots">
        {Array.from({ length }, (_, i) => (
          <span key={i} className={cx('bek-code-input__dot', i < value.length && 'is-filled')} />
        ))}
        <input
          ref={ref}
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={length}
          value={value}
          aria-invalid={state === 'error' || undefined}
          readOnly={rest.onChange ? undefined : true}
          className="bek-code-input__input"
          {...rest}
        />
      </label>
      {helperText && (
        <div className="bek-code-input__helper" role="status">
          {helperText}
        </div>
      )}
    </div>
  );
});

export interface PinpadProps {
  onDigit: (digit: string) => void;
  onClear: () => void;
  /** Chap pastki tugma: `face` (Face ID), `finger` (barmoq izi), `text` (masalan, "Bekor"), `empty`. */
  bottomLeft?: 'face' | 'finger' | 'text' | 'empty';
  onBottomLeft?: () => void;
  /** `text` turidagi tugma matni yoki biometrik tugma nomi. */
  bottomLeftLabel?: string;
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
}

const ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

/** Figma "4.7 Pincode → Pinpad": 72 px yumaloq tugmalar, Headline/L raqamlar. */
export function Pinpad({
  onDigit,
  onClear,
  bottomLeft = 'empty',
  onBottomLeft,
  bottomLeftLabel,
  clearLabel = 'Delete',
  disabled = false,
  className,
}: PinpadProps) {
  const digit = (d: string) => (
    <button
      key={d}
      type="button"
      className="bek-pinpad__key bek-pinpad__key--digit"
      disabled={disabled}
      onClick={() => onDigit(d)}
    >
      {d}
    </button>
  );
  const left =
    bottomLeft === 'empty' ? (
      <span className="bek-pinpad__key bek-pinpad__key--empty" aria-hidden="true" />
    ) : (
      <button
        type="button"
        className={cx(
          'bek-pinpad__key',
          bottomLeft === 'text' ? 'bek-pinpad__key--text' : 'bek-pinpad__key--icon',
        )}
        aria-label={
          bottomLeft === 'text'
            ? undefined
            : (bottomLeftLabel ?? (bottomLeft === 'face' ? 'Face ID' : 'Touch ID'))
        }
        disabled={disabled}
        onClick={onBottomLeft}
      >
        {bottomLeft === 'face' ? (
          <FaceIdGlyph />
        ) : bottomLeft === 'finger' ? (
          <FingerprintGlyph />
        ) : (
          bottomLeftLabel
        )}
      </button>
    );
  return (
    <div className={cx('bek-pinpad', className)}>
      {ROWS.map((row, i) => (
        <div key={i} className="bek-pinpad__row">
          {row.map(digit)}
        </div>
      ))}
      <div className="bek-pinpad__row">
        {left}
        {digit('0')}
        <button
          type="button"
          className="bek-pinpad__key bek-pinpad__key--icon"
          aria-label={clearLabel}
          disabled={disabled}
          onClick={onClear}
        >
          <BackspaceGlyph />
        </button>
      </div>
    </div>
  );
}
