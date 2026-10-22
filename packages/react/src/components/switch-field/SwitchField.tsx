'use client';

import { forwardRef, useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Switch, type SwitchProps } from '../switch/Switch.js';
import { useControlGroupDensity } from '../control-group/context.js';

/** Qator balandligi (field/height/*): s 36 · m 44 px; ichidagi Switch shu o'lchamda (S → S, M → M). */
export type SwitchFieldSize = 's' | 'm';

export interface SwitchFieldProps extends Omit<SwitchProps, 'size' | 'children'> {
  /** Figma "Label": nima yoqiladi — ot birikma ("Pointer highlight"), buyruq emas. */
  label: ReactNode;
  /** Figma "Description" / "Show description": bir qatorlik izoh (Caption/L · text/tertiary). */
  description?: ReactNode;
  /** Standart: `m`; ControlGroup ichida — guruh zichligidan (compact → `s`). */
  size?: SwitchFieldSize;
}

/**
 * Figma "3.6 Switch field" — label, ixtiyoriy izoh va Switch bitta konteynerda; butun qator almashtiradi.
 * Sozlama darhol qo'llanadi (Saqlash tugmasisiz) — aks holda CheckboxField. Native `role="switch"`,
 * nom `aria-labelledby`, izoh `aria-describedby` orqali.
 */
export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(function SwitchField(
  { label, description, size, disabled, className, style, ...rest },
  ref,
) {
  const density = useControlGroupDensity();
  const resolvedSize: SwitchFieldSize = size ?? (density === 'compact' ? 's' : 'm');
  const id = useId().replace(/:/g, '');
  const labelId = `bek-switch-field-label-${id}`;
  const descriptionId = description ? `bek-switch-field-desc-${id}` : undefined;

  return (
    <div
      className={cx(
        'bek-control-field',
        `bek-control-field--${resolvedSize}`,
        'bek-switch-field',
        disabled && 'bek-control-field--disabled',
        className,
      )}
      style={style}
    >
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
      <Switch
        ref={ref}
        size={resolvedSize}
        disabled={disabled}
        aria-labelledby={labelId}
        {...rest}
        aria-describedby={cx(descriptionId, rest['aria-describedby']) || undefined}
      />
    </div>
  );
});
