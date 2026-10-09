import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx.js';
import type { FieldVariant } from '../text-field/TextField.js';

/** Minimal balandlik: s 80 · m 104 · l 128 px. */
export type TextareaSize = 's' | 'm' | 'l';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  supportingText?: ReactNode;
  error?: boolean;
  variant?: FieldVariant;
  size?: TextareaSize;
  /** `maxLength` bilan "12/500" hisoblagichini ko'rsatadi. */
  showCount?: boolean;
  skeleton?: boolean;
  /** Tashqi o'ram klassi. */
  className?: string;
}

/** Figma "3.7 Textarea": ko'p qatorli matn, belgi hisoblagichi bilan. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    supportingText,
    error = false,
    variant = 'filled',
    size = 'm',
    showCount = false,
    skeleton = false,
    placeholder,
    id,
    className,
    disabled,
    maxLength,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? `bek-field-${autoId.replace(/:/g, '')}`;
  const supportId = supportingText || showCount ? `${fieldId}-support` : undefined;
  const [inner, setInner] = useState(() => String(defaultValue ?? ''));
  const length = (value !== undefined ? String(value) : inner).length;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInner(event.target.value);
    onChange?.(event);
  };

  return (
    <div
      className={cx(
        'bek-field',
        'bek-field--textarea',
        `bek-field--${variant}`,
        `bek-field--${size}`,
        label && 'bek-field--labelled',
        placeholder && 'bek-field--floating',
        error && 'bek-field--error',
        disabled && 'bek-field--disabled',
        skeleton && 'bek-field--skeleton',
        className,
      )}
      aria-busy={skeleton || undefined}
    >
      <div className="bek-field__control">
        <div className="bek-field__content">
          <textarea
            ref={ref}
            id={fieldId}
            className="bek-field__input bek-field__textarea"
            placeholder={placeholder ?? (label ? ' ' : undefined)}
            disabled={disabled}
            maxLength={maxLength}
            aria-invalid={error || undefined}
            aria-describedby={supportId}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            {...rest}
          />
          {label && (
            <label className="bek-field__label" htmlFor={fieldId}>
              {label}
            </label>
          )}
        </div>
      </div>
      {(supportingText || showCount) && (
        <div id={supportId} className="bek-field__supporting">
          <span>{supportingText}</span>
          {showCount && (
            <span className="bek-field__counter">
              {length}
              {maxLength !== undefined && `/${maxLength}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
