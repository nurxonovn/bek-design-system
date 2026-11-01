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

interface ChipGroupBase
  extends Omit<
    FieldsetProps,
    'children' | 'status' | 'layout' | 'defaultValue' | 'onChange' | 'name' | 'form'
  > {
  /** 2–8 qisqa variant; ko'prog'i uchun Select yoki Bottom sheet ro'yxati. */
  options: ChipGroupOption[];
  /** Figma "Message": helper (text/tertiary) · error (text/danger + ikonka) — guruh uchun bitta xabar. */
  status?: 'helper' | 'error';
  /** Chip o'lchami — Figma'da doim S; touch qatorlari uchun `m`. */
  chipSize?: 's' | 'm';
}

/** Bitta tanlov (reja, chastota): qiymat — tanlangan `value` yoki `null`. */
export interface ChipGroupSingleProps extends ChipGroupBase {
  selection?: 'single';
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

/** Bir nechta tanlov (kategoriyalar): qiymat — tanlangan `value`lar ro'yxati. */
export interface ChipGroupMultipleProps extends ChipGroupBase {
  selection: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ChipGroupProps = ChipGroupSingleProps | ChipGroupMultipleProps;

const toList = (v: string | string[] | null | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : [v];

/**
 * Chip bosilgandagi keyingi tanlov. `single` — bosilgan chip yagona tanlov bo'ladi, tanlanganini qayta bosish
 * hech narsani o'zgartirmaydi; `multiple` — qo'shadi yoki olib tashlaydi. O'zgarmasa o'sha massiv qaytadi.
 */
export function nextChipSelection(
  selected: readonly string[],
  value: string,
  selection: 'single' | 'multiple',
): readonly string[] {
  const isOn = selected.includes(value);
  if (selection === 'single') return isOn && selected.length === 1 ? selected : [value];
  return isOn ? selected.filter((s) => s !== value) : [...selected, value];
}

/**
 * Figma "3.20 Field groups → Chip group": bitta label ostida Filter chip'lar to'plami va bitta umumiy xabar.
 * Anatomiyasi Fieldset (3.19) bilan bir xil — uni Fieldset ichiga o'ramang.
 */
export function ChipGroup(props: ChipGroupProps) {
  const {
    options,
    selection = 'single',
    value,
    defaultValue,
    onValueChange: _onValueChange,
    status = 'helper',
    chipSize = 's',
    disabled,
    className,
    ...rest
  } = props;
  const [inner, setInner] = useState<readonly string[]>(() => toList(defaultValue));
  const raw = value !== undefined ? toList(value) : inner;
  // Bitta tanlovda ko'pi bilan bitta chip bosilgan bo'ladi, hatto tashqaridan noto'g'ri qiymat kelsa ham.
  const selected = selection === 'single' ? raw.slice(0, 1) : raw;

  const toggle = (v: string) => {
    const next = nextChipSelection(selected, v, selection);
    if (next === selected) return;
    if (value === undefined) setInner(next);
    if (props.selection === 'multiple') props.onValueChange?.([...next]);
    else props.onValueChange?.(next[0] ?? null);
  };

  return (
    <Fieldset
      {...rest}
      disabled={disabled}
      status={status}
      className={cx('bek-chip-group', className)}
    >
      <div className="bek-chip-group__chips">
        {options.map((o) => (
          <Chip
            key={o.value}
            size={chipSize}
            icon={o.icon}
            count={o.count}
            disabled={disabled || o.disabled}
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
