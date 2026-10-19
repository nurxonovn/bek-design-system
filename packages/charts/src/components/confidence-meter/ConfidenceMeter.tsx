import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@bek/react';
import { formatPercent } from '../../core/format.js';

export type ConfidenceMeterVariant = 'high' | 'medium' | 'low';

export interface ConfidenceThresholds {
  /** Shu ulushdan boshlab High. Standart 0,8. */
  high: number;
  /** Shu ulushdan boshlab Medium (undan pasti Low). Standart 0,5. */
  medium: number;
}

export interface ConfidenceMeterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Model ishonchi, 0…1: `0.92` → `92%`. */
  value: number;
  /** `high` (5 segment) · `medium` (3) · `low` (1). Berilmasa `value` va `thresholds` dan. */
  variant?: ConfidenceMeterVariant;
  /** Bir qatorlik sabab — majburiy ma'no: "Based on 2,4 mln rows from 3 sources". */
  reason?: ReactNode;
  /** Yorliq. Standart "Confidence". */
  label?: ReactNode;
  /** Daraja nomlari (matn — rang yolg'iz ma'no tashimaydi). */
  levelLabels?: Record<ConfidenceMeterVariant, string>;
  /** Mahsulotga qarab sozlanadi: High ≥ 80%, Medium 50–79%, Low < 50%. */
  thresholds?: ConfidenceThresholds;
}

const SEGMENTS = 5;
const FILLED: Record<ConfidenceMeterVariant, number> = { high: 5, medium: 3, low: 1 };
const LEVEL_LABELS: Record<ConfidenceMeterVariant, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/** Ishonch darajasi: `value` ≥ high → High, ≥ medium → Medium, aks holda Low. */
export function confidenceLevel(
  value: number,
  thresholds: ConfidenceThresholds = { high: 0.8, medium: 0.5 },
): ConfidenceMeterVariant {
  if (value >= thresholds.high) return 'high';
  if (value >= thresholds.medium) return 'medium';
  return 'low';
}

/**
 * Figma "4.18 Chart · Confidence meter": model AI javobi, prognoz yoki yaratilgan chartga qanchalik
 * ishonishi — 5 segment, daraja matni va bir qatorlik sabab. `role="meter"`.
 */
export function ConfidenceMeter({
  value,
  variant,
  reason,
  label = 'Confidence',
  levelLabels = LEVEL_LABELS,
  thresholds,
  className,
  ...rest
}: ConfidenceMeterProps) {
  const labelId = useId();
  const v = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const level = variant ?? confidenceLevel(v, thresholds);
  const percent = formatPercent(v * 100, { decimals: 0 });
  const filled = FILLED[level];

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-confidence-meter',
        `bek-confidence-meter--${level}`,
        className,
      )}
    >
      <div className="bek-confidence-meter__header">
        <span className="bek-confidence-meter__label" id={labelId}>
          {label}
        </span>
        <span className="bek-confidence-meter__value">
          {levelLabels[level]} · {percent}
        </span>
      </div>
      <div
        className="bek-confidence-meter__segments"
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(v * 100)}
        aria-valuetext={`${levelLabels[level]}, ${Math.round(v * 100)} percent`}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={cx(
              'bek-confidence-meter__segment',
              i < filled && 'bek-confidence-meter__segment--on',
            )}
          />
        ))}
      </div>
      {reason != null && <figcaption className="bek-confidence-meter__reason">{reason}</figcaption>}
    </figure>
  );
}
