import { useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { StatusGlyph } from '../../icons/status.js';

export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  /** Label/M · text/secondary. */
  label: ReactNode;
  /** Figma "Show hint": information-circle 16 ikonkasi; matn `title` (tooltip) va ekran o'quvchiga beriladi. */
  hint?: string;
  /** Figma "Show optional": "Optional" belgisi (Caption/L · text/tertiary). Kamdan-kam ixtiyoriy maydonni belgilang, ko'p majburiylarni emas. */
  optional?: boolean | string;
  /** Figma "Layout": vertical — hamma qurilmalar (Mobile'da yagona); horizontal — faqat Web, qisqa maydonlari ko'p formalar. */
  layout?: 'vertical' | 'horizontal';
  /** Bitta xabar — almashtiradi, ustma-ust qo'ymaydi. */
  message?: ReactNode;
  /** Figma "Message": helper (text/tertiary) · error (text/danger + alert-circle) · success (text/success + checkmark-circle). */
  status?: 'helper' | 'error' | 'success';
  /** Control — label'i bo'lmagan istalgan boshqaruv: Chip qatori, Checkbox/Radio guruhi, Segmented control, Slider, Date picker. */
  children: ReactNode;
}

/**
 * Figma "3.19 Fieldset": bitta label, bitta control (yoki guruh), bitta xabar. Text field va Select'ni
 * o'ramang — ularning label'i ichida. Holati yo'q: hover/focus/disabled ichidagi control'dan,
 * Error — `status="error"` dan keladi.
 */
export function Fieldset({
  label,
  hint,
  optional = false,
  layout = 'vertical',
  message,
  status = 'helper',
  className,
  children,
  ...rest
}: FieldsetProps) {
  const id = useId().replace(/:/g, '');
  const messageId = `bek-fieldset-msg-${id}`;
  const optionalText = optional === true ? 'Optional' : optional || null;

  return (
    <fieldset
      className={cx(
        'bek-fieldset',
        `bek-fieldset--${layout}`,
        message && `bek-fieldset--${status}`,
        className,
      )}
      aria-describedby={message ? messageId : undefined}
      aria-invalid={status === 'error' && message ? true : undefined}
      {...rest}
    >
      <legend className="bek-visually-hidden">
        {label}
        {optionalText && ` (${optionalText})`}
        {hint && `. ${hint}`}
      </legend>
      <div className="bek-fieldset__head" aria-hidden="true">
        <span className="bek-fieldset__label">{label}</span>
        {hint && (
          <span className="bek-fieldset__hint" title={hint}>
            <StatusGlyph tone="info" variant="stroke" />
          </span>
        )}
        {optionalText && <span className="bek-fieldset__optional">{optionalText}</span>}
      </div>
      <div className="bek-fieldset__control">{children}</div>
      {message && (
        <div className="bek-fieldset__message" id={messageId}>
          {status === 'error' && <StatusGlyph tone="danger" variant="stroke" />}
          {status === 'success' && <StatusGlyph tone="success" variant="stroke" />}
          <span>{message}</span>
        </div>
      )}
    </fieldset>
  );
}
