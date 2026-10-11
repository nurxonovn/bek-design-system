'use client';

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';

/** Yo'lak / thumb: s 6/14 · m 8/16 · l 10/20 px. */
export type SliderSize = 's' | 'm' | 'l';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  size?: SliderSize;
}

const percent = (v: number, min: number, max: number) =>
  max === min ? 0 : ((Math.min(Math.max(v, min), max) - min) / (max - min)) * 100;

/** Figma "3.8 Slider" (Type=Single): native `<input type="range">` — ← → qadam, Page ↑↓, Home/End. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { value, defaultValue, min = 0, max = 100, size = 's', className, style, onChange, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInner(Number(event.target.value));
    onChange?.(event);
  };
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      value={current}
      onChange={handleChange}
      {...rest}
      className={cx('bek-slider', `bek-slider--${size}`, className)}
      style={
        { '--bek-slider-progress': `${percent(current, min, max)}%`, ...style } as CSSProperties
      }
    />
  );
});

export interface RangeSliderProps {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  disabled?: boolean;
  /** Thumb'lar ustida qiymat yorliqlari. */
  showValueLabels?: boolean;
  /** Yorliq matni, masalan narx uchun `(v) => \`${v} so'm\``. */
  formatValue?: (value: number) => ReactNode;
  /** Ekran o'quvchi uchun thumb nomlari. */
  labels?: [string, string];
  className?: string;
}

/** Figma "3.8 Slider" (Type=Range): ikki thumb; har biri alohida Tab to'xtashi. */
export function RangeSlider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 's',
  disabled = false,
  showValueLabels = true,
  formatValue = (v) => v,
  labels = ['Minimum', 'Maximum'],
  className,
}: RangeSliderProps) {
  const [inner, setInner] = useState<[number, number]>(defaultValue ?? [min, max]);
  const [from, to] = value ?? inner;
  const update = (next: [number, number]) => {
    setInner(next);
    onChange?.(next);
  };
  const style = {
    '--bek-slider-from': `${percent(from, min, max)}%`,
    '--bek-slider-to': `${percent(to, min, max)}%`,
  } as CSSProperties;

  return (
    <div className={cx('bek-range', `bek-range--${size}`, className)} style={style}>
      {showValueLabels && (
        <div className="bek-range__labels" aria-hidden="true">
          <span>{formatValue(from)}</span>
          <span>{formatValue(to)}</span>
        </div>
      )}
      <div className="bek-range__track">
        <input
          type="range"
          className={cx('bek-slider', `bek-slider--${size}`, 'bek-range__input')}
          min={min}
          max={max}
          step={step}
          value={from}
          disabled={disabled}
          aria-label={labels[0]}
          onChange={(e) => update([Math.min(Number(e.target.value), to), to])}
        />
        <input
          type="range"
          className={cx('bek-slider', `bek-slider--${size}`, 'bek-range__input')}
          min={min}
          max={max}
          step={step}
          value={to}
          disabled={disabled}
          aria-label={labels[1]}
          onChange={(e) => update([from, Math.max(Number(e.target.value), from)])}
        />
      </div>
    </div>
  );
}
