'use client';

import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { MinusGlyph, PlusGlyph } from '../../icons/index.js';
import { Button, type ButtonSize } from '../button/Button.js';

/** Balandlik: s 36 · m 44 · l 56 px. */
export type StepperSize = 's' | 'm' | 'l';

export interface StepperProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Qiymatdan keyingi birlik ("dona", "kg"). */
  unit?: ReactNode;
  variant?: 'filled' | 'outline';
  size?: StepperSize;
  disabled?: boolean;
  /** Ekran o'quvchi uchun nom ("Miqdor"). */
  'aria-label'?: string;
  /** − / + tugmalari nomlari. */
  decrementLabel?: string;
  incrementLabel?: string;
  className?: string;
}

const BUTTON_SIZE: Record<StepperSize, ButtonSize> = { s: 'm', m: 'l', l: 'xl' };

/** Figma "3.9 Stepper": miqdor tanlash. Qiymat — bitta Tab to'xtashi (`role="spinbutton"`, ↑↓, Home/End);
 *  − / + tugmalari sichqoncha va touch uchun, Tab'da emas. Min'da − , Max'da + o'chadi. */
export function Stepper({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  unit,
  variant = 'filled',
  size = 's',
  disabled = false,
  'aria-label': ariaLabel,
  decrementLabel = 'Decrease',
  incrementLabel = 'Increase',
  className,
}: StepperProps) {
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const set = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    if (clamped === current) return;
    setInner(clamped);
    onChange?.(clamped);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    const keys: Record<string, () => void> = {
      ArrowUp: () => set(current + step),
      ArrowRight: () => set(current + step),
      ArrowDown: () => set(current - step),
      ArrowLeft: () => set(current - step),
      Home: () => set(min),
      End: () => Number.isFinite(max) && set(max),
    };
    const action = keys[event.key];
    if (action && !disabled) {
      event.preventDefault();
      action();
    }
  };

  return (
    <div
      className={cx(
        'bek-stepper',
        `bek-stepper--${variant}`,
        `bek-stepper--${size}`,
        disabled && 'bek-stepper--disabled',
        className,
      )}
    >
      <Button
        variant="flat"
        size={BUTTON_SIZE[size]}
        iconOnly
        startIcon={<MinusGlyph />}
        tabIndex={-1}
        disabled={disabled || current <= min}
        onClick={() => set(current - step)}
      >
        {decrementLabel}
      </Button>
      <span
        className="bek-stepper__value"
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuenow={current}
        aria-valuemin={min}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
      >
        <span className="bek-stepper__number">{current}</span>
        {unit && <span className="bek-stepper__unit">{unit}</span>}
      </span>
      <Button
        variant="flat"
        size={BUTTON_SIZE[size]}
        iconOnly
        startIcon={<PlusGlyph />}
        tabIndex={-1}
        disabled={disabled || current >= max}
        onClick={() => set(current + step)}
      >
        {incrementLabel}
      </Button>
    </div>
  );
}
