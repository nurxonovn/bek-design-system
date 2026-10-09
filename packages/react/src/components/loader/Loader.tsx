import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type LoaderSize = 16 | 24 | 40;
export type LoaderTone = 'default' | 'on-color';

export interface LoaderProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 16 — matn ichida · 24 — ro'yxat va tugma · 40 — butun ekran. */
  size?: LoaderSize;
  /** `on-color` — accent fon va tugmalar ustida (oq yoy). */
  tone?: LoaderTone;
  /** 0–1: aniq jarayon (yoy uzunligi, aylanmaydi). Berilmasa — cheksiz aylanish. */
  value?: number;
  /** Ekran o'quvchi uchun matn; `null` — yashirin (atrofdagi matn holatni aytsa). */
  label?: string | null;
}

const R = 44.5;
const C = 2 * Math.PI * R;
/** Figma: yoy -90° dan 45° gacha (135°), ichki radius 0.78. */
const INDETERMINATE = 135 / 360;

/** Figma "5.7 Loading → Spinner": trek + yoy. 800 ms chiziqli aylanish. */
export function Loader({
  size = 24,
  tone = 'default',
  value,
  label = 'Loading',
  className,
  ...rest
}: LoaderProps) {
  const determinate = value !== undefined;
  const part = determinate ? Math.min(1, Math.max(0, value)) : INDETERMINATE;
  const a11y = label
    ? determinate
      ? {
          role: 'progressbar',
          'aria-label': label,
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': Math.round(part * 100),
        }
      : { role: 'status', 'aria-label': label }
    : { 'aria-hidden': true as const };
  return (
    <span
      {...a11y}
      {...rest}
      className={cx(
        'bek-loader',
        `bek-loader--${size}`,
        `bek-loader--${tone}`,
        !determinate && 'bek-loader--spin',
        className,
      )}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle className="bek-loader__track" cx="50" cy="50" r={R} />
        <circle
          className="bek-loader__arc"
          cx="50"
          cy="50"
          r={R}
          strokeDasharray={`${(part * C).toFixed(2)} ${C.toFixed(2)}`}
        />
      </svg>
    </span>
  );
}
