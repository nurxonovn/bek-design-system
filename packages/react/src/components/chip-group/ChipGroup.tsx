'use client';

import { useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Chip } from '../chip/Chip.js';
import { Fieldset, type FieldsetProps } from '../fieldset/Fieldset.js';

export interface ChipGroupOption {
  value: string;
  label: ReactNode;
  /** Yorliqdan keyingi son (Chip `count`). */
  count?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ChipGroupProps
  extends Omit<FieldsetProps, 'children' | 'status' | 'layout' | 'defaultValue' | 'onChange'> {
  /** 2–8 qisqa variant; ko'prog'i uchun Select yoki Bottom sheet ro'yxati. */
  options: ChipGroupOption[];
  /** `single` — bitta tanlov (reja, chastota); `multiple` — bir nechta (kategoriyalar). */
  selection?: 'single' | 'multiple';
  /** Boshqariladigan qiymat — tanlangan `value`lar. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Figma "Message": helper (text/tertiary) · error (text/danger + ikonka) — guruh uchun bitta xabar. */
  status?: 'helper' | 'error';
  /** Chip o'lchami — Figma'da doim S; touch qatorlari uchun `m`. */
  chipSize?: 's' | 'm';
}

/**
 * Figma "3.20 Field groups → Chip group": bitta label ostida Filter chip'lar to'plami va bitta umumiy xabar.
 * Anatomiyasi Fieldset (3.19) bilan bir xil — uni Fieldset ichiga o'ramang.
 */
export function ChipGroup({
  options,
  selection = 'single',
  value,
  defaultValue = [],
  onValueChange,
  status = 'helper',
  chipSize = 's',
  className,
  ...rest
}: ChipGroupProps) {
  const [inner, setInner] = useState<string[]>(defaultValue);
  const selected = value ?? inner;

  const toggle = (v: string) => {
    const isOn = selected.includes(v);
    let next: string[];
    if (selection === 'single') next = isOn ? selected : [v];
    else next = isOn ? selected.filter((s) => s !== v) : [...selected, v];
    if (next === selected) return;
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <Fieldset {...rest} status={status} className={cx('bek-chip-group', className)}>
      <div className="bek-chip-group__chips">
        {options.map((o) => (
          <Chip
            key={o.value}
            size={chipSize}
            icon={o.icon}
            count={o.count}
            disabled={o.disabled}
            selected={selected.includes(o.value)}
            onClick={() => toggle(o.value)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
    </Fieldset>
  );
}
