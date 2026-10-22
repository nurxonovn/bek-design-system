import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Checkbox, type CheckboxProps } from '../checkbox/Checkbox.js';

/** Qator balandligi (field/height/*): s 36 · m 44 px; ichidagi Checkbox shu o'lchamda (S 16 · M 20). */
export type CheckboxFieldSize = 's' | 'm';

export interface CheckboxFieldProps extends Omit<CheckboxProps, 'size' | 'children'> {
  /** Figma "Label" (Body/M · text/primary; S — Label/M). */
  label: ReactNode;
  /** Figma "Description" / "Show description": izoh (Caption/L · text/tertiary). */
  description?: ReactNode;
  size?: CheckboxFieldSize;
  /**
   * Figma "Control at start" / "Control at end": `start` — formalar va rozilik qatorlari (standart);
   * `end` — sozlamalar ro'yxati.
   */
  controlPosition?: 'start' | 'end';
}

/**
 * Figma "3.4 Checkbox field" — label, ixtiyoriy izoh va Checkbox bitta konteynerda; butun qator belgilaydi.
 * Tanlov Submit / Save bilan saqlanadigan joyda — darhol qo'llansa SwitchField. Indeterminate — faqat
 * bolalari qisman belgilangan ota qator uchun. Nom `aria-labelledby`, izoh `aria-describedby` orqali.
 * Figma "Checked": unchecked · checked — native `checked` / `defaultChecked`; indeterminate — `indeterminate`.
 */
export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  function CheckboxField(
    {
      label,
      description,
      size = 'm',
      controlPosition = 'start',
      disabled,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const id = useId().replace(/:/g, '');
    const labelId = `bek-checkbox-field-label-${id}`;
    const descriptionId = description ? `bek-checkbox-field-desc-${id}` : undefined;
    const control = (
      <Checkbox
        ref={ref}
        size={size}
        disabled={disabled}
        aria-labelledby={labelId}
        {...rest}
        aria-describedby={cx(descriptionId, rest['aria-describedby']) || undefined}
      />
    );

    return (
      <div
        className={cx(
          'bek-control-field',
          `bek-control-field--${size}`,
          'bek-checkbox-field',
          `bek-checkbox-field--control-${controlPosition}`,
          disabled && 'bek-control-field--disabled',
          className,
        )}
        style={style}
      >
        {controlPosition === 'start' && control}
        <span className="bek-control-field__text">
          <span className="bek-control-field__label" id={labelId}>
            {label}
          </span>
          {description && (
            <span className="bek-control-field__description" id={descriptionId}>
              {description}
            </span>
          )}
        </span>
        {controlPosition === 'end' && control}
      </div>
    );
  },
);
