import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** 2–4 ta o'zaro istisno variant. */
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Elementlar balandligi: m 36 · l 44 px. */
  size?: 'm' | 'l';
  /** `solid` — sirt ustida; `overlay` — rasm yoki video ustida. */
  variant?: 'solid' | 'overlay';
  /** Guruh nomi (radio `name`); bo'lmasa avtomatik. */
  name?: string;
  'aria-label'?: string;
  className?: string;
}

/** Figma "3.10 Segmented control": ko'rinish yoki rejimni almashtirish. Ichida native radio — ← → bilan. */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = 'm',
  variant = 'solid',
  name,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps) {
  const autoName = `bek-segmented-${useId().replace(/:/g, '')}`;
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value ?? inner;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        'bek-segmented',
        `bek-segmented--${size}`,
        `bek-segmented--${variant}`,
        className,
      )}
    >
      {options.map((option) => (
        <label key={option.value} className="bek-segmented__item">
          <input
            type="radio"
            className="bek-segmented__input"
            name={name ?? autoName}
            value={option.value}
            checked={current === option.value}
            disabled={option.disabled}
            onChange={() => {
              setInner(option.value);
              onChange?.(option.value);
            }}
          />
          <span className="bek-segmented__label">{option.label}</span>
        </label>
      ))}
    </div>
  );
}
