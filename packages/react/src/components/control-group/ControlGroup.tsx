'use client';

import type { FieldsetHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { ControlGroupContext, type ControlGroupDensity } from './context.js';

export interface ControlGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  /** Figma "Title" / "Show title": qisqa ot (Label/M · text/tertiary; compact — Label/S). Bo'lmasa `aria-label` bering. */
  title?: ReactNode;
  /** Figma "Density": default — M qatorlar (44), gap 8; compact — XS/S qatorlar (32/36), gap 4, faqat Web/Tablet. */
  density?: ControlGroupDensity;
  /** 2–4 qator: ScrubField, SwitchField, Select, TextField. Raqamli qiymatlar avval, toggle'lar oxirida. */
  children: ReactNode;
}

/**
 * Figma "3.20 Control group" — sozlamalar paneli guruhi: sarlavha va 2–4 boshqaruv qatori.
 * `<fieldset>` + `<legend>`: guruh nomi ekran o'quvchiga har qatorda o'qiladi; `disabled` hamma qatorni o'chiradi.
 * Zichlik guruhda beriladi — ichidagi ScrubField/SwitchField o'lchamni shundan oladi.
 */
export function ControlGroup({
  title,
  density = 'default',
  className,
  children,
  ...rest
}: ControlGroupProps) {
  return (
    <fieldset
      className={cx('bek-control-group', `bek-control-group--${density}`, className)}
      {...rest}
    >
      {title && <legend className="bek-control-group__title">{title}</legend>}
      <ControlGroupContext.Provider value={density}>{children}</ControlGroupContext.Provider>
    </fieldset>
  );
}
