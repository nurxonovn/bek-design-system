import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export type ProgressStatus = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–`max` oralig'idagi qiymat. */
  value: number;
  max?: number;
  /** Yo'lak qalinligi: s 4 · m 6 · l 8 px. */
  size?: 's' | 'm' | 'l';
  status?: ProgressStatus;
  /** Chapdagi yorliq ("Yuklanmoqda"). Ekran o'quvchi nomi ham shu. */
  label?: ReactNode;
  /** O'ngdagi qiymat matni. `true` — foiz. */
  showValue?: boolean | ReactNode;
}

/** Figma "4.6 Progress": chiziqli jarayon. Noaniq kutish uchun — Spinner (9.1). */
export function ProgressBar({
  value,
  max = 100,
  size = 'm',
  status = 'accent',
  label,
  showValue = false,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const percent = Math.round((Math.min(Math.max(value, 0), max) / max) * 100);
  const valueText = showValue === true ? `${percent}%` : showValue || null;
  return (
    <div
      className={cx('bek-progress', `bek-progress--${size}`, `bek-progress--${status}`, className)}
      style={style}
    >
      {(label || valueText) && (
        <div className="bek-progress__header" aria-hidden="true">
          <span className="bek-progress__label">{label}</span>
          {valueText && <span className="bek-progress__value">{valueText}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={typeof label === 'string' ? label : undefined}
        {...rest}
        className="bek-progress__track"
      >
        <div className="bek-progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
