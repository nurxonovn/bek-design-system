import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx.js';
import { ChevronDownGlyph } from '../../icons/index.js';
import type { FieldSize, FieldVariant } from '../text-field/TextField.js';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  /** Hech narsa tanlanmaganda ko'rinadigan matn (qiymati `""` bo'lgan yashirin option). */
  placeholder?: string;
  supportingText?: ReactNode;
  error?: boolean;
  variant?: FieldVariant;
  size?: FieldSize;
  leadingIcon?: ReactNode;
  skeleton?: boolean;
  /** `<option>` / `<optgroup>` elementlari. */
  children: ReactNode;
  /** Tashqi o'ram klassi. */
  className?: string;
}

/** Figma "3.3 Select": ro'yxatdan tanlash. Native `<select>` — klaviatura va mobil picker tayyor. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    placeholder,
    supportingText,
    error = false,
    variant = 'filled',
    size = 'm',
    leadingIcon,
    skeleton = false,
    id,
    className,
    disabled,
    value,
    defaultValue,
    onChange,
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? `bek-field-${autoId.replace(/:/g, '')}`;
  const supportId = supportingText ? `${selectId}-support` : undefined;
  const [inner, setInner] = useState(() => String(defaultValue ?? (placeholder ? '' : 'x')));
  const current = value !== undefined ? String(value) : inner;
  const empty = current === '';

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setInner(event.target.value);
    onChange?.(event);
  };

  return (
    <div
      className={cx(
        'bek-field',
        'bek-field--select',
        `bek-field--${variant}`,
        `bek-field--${size}`,
        label && 'bek-field--labelled',
        empty && 'bek-field--empty',
        error && 'bek-field--error',
        disabled && 'bek-field--disabled',
        skeleton && 'bek-field--skeleton',
        className,
      )}
      aria-busy={skeleton || undefined}
    >
      <div className="bek-field__control">
        {leadingIcon && (
          <span className="bek-field__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <div className="bek-field__content">
          <select
            ref={ref}
            id={selectId}
            className="bek-field__input bek-field__select"
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={supportId}
            value={value}
            defaultValue={
              value === undefined ? (defaultValue ?? (placeholder ? '' : undefined)) : undefined
            }
            onChange={handleChange}
            {...rest}
          >
            {placeholder !== undefined && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          {label && (
            <label className="bek-field__label" htmlFor={selectId}>
              {label}
            </label>
          )}
        </div>
        <span className="bek-field__icon bek-field__chevron" aria-hidden="true">
          <ChevronDownGlyph />
        </span>
      </div>
      {supportingText && (
        <div id={supportId} className="bek-field__supporting">
          {supportingText}
        </div>
      )}
    </div>
  );
});
