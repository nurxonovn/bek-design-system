import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { formatNumber, formatPercent } from '../../core/format.js';

export type UsageMeterVariant = 'normal' | 'warning' | 'limit';

export interface UsageMeterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Kvota nomi: "AI tokens". */
  label: ReactNode;
  /** Sarflangan miqdor. */
  used: number;
  /** Chegara (kvota). */
  limit: number;
  /** Reset sanasigacha prognoz — xuddi shu rangda 35% bilan davom etadi. */
  forecast?: number;
  /** Reset sanasi matni: "Resets 1 Nov". */
  resetAt?: ReactNode;
  /** Pastki izohni almashtirish; standart — prognoz / chegara haqida. */
  note?: ReactNode;
  /** `normal` (accent) < 80% · `warning` 80–99% yoki prognoz > 90% · `limit` 100%. Berilmasa hisoblanadi. */
  variant?: UsageMeterVariant;
  /** Son formati; standart uz-UZ qisqa (`820 000`, `1 mln`). */
  formatValue?: (value: number) => string;
}

/** Holat: used ≥ limit → limit; used ≥ 80% yoki prognoz > 90% → warning; aks holda normal. */
export function usageVariant(used: number, limit: number, forecast?: number): UsageMeterVariant {
  if (!(limit > 0)) return 'normal';
  if (used >= limit) return 'limit';
  if (used / limit >= 0.8 || (forecast != null && forecast / limit > 0.9)) return 'warning';
  return 'normal';
}

const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

/**
 * Figma "4.18 Chart · Usage meter": kvota yoki AI token sarfi va reset sanasigacha prognoz.
 * Sarflangan — to'liq rang, prognoz — o'sha rang 35% (BND-09). `role="meter"`.
 */
export function UsageMeter({
  label,
  used,
  limit,
  forecast,
  resetAt,
  note,
  variant,
  formatValue = (v) => formatNumber(v, { compact: true }),
  className,
  ...rest
}: UsageMeterProps) {
  const labelId = useId();
  const state = variant ?? usageVariant(used, limit, forecast);
  const usedShare = clamp(limit > 0 ? used / limit : 0);
  const forecastShare = forecast != null ? clamp(limit > 0 ? forecast / limit : 0) : usedShare;
  const forecastPct = formatPercent(forecastShare * 100, { decimals: 0 });
  const valueText = `${formatValue(used)} / ${formatValue(limit)}`;
  const defaultNote =
    state === 'limit'
      ? 'Limit reached'
      : forecast == null
        ? null
        : state === 'warning'
          ? `Forecast ${forecastPct} — close to limit`
          : `Forecast ${forecastPct} by reset`;
  const shownNote = note ?? defaultNote;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-usage-meter', `bek-usage-meter--${state}`, className)}
    >
      <div className="bek-usage-meter__header">
        <span className="bek-usage-meter__label" id={labelId}>
          {label}
        </span>
        <span className="bek-usage-meter__value">{valueText}</span>
      </div>
      <div
        className="bek-usage-meter__track"
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(used, limit)}
        aria-valuetext={`${formatValue(used)} of ${formatValue(limit)}${
          forecast != null ? `, forecast ${forecastPct} by reset` : ''
        }`}
      >
        {forecastShare > usedShare && (
          <span
            className="bek-usage-meter__forecast"
            style={{
              insetInlineStart: `${usedShare * 100}%`,
              inlineSize: `${(forecastShare - usedShare) * 100}%`,
            }}
          />
        )}
        <span className="bek-usage-meter__used" style={{ inlineSize: `${usedShare * 100}%` }} />
      </div>
      {(resetAt != null || shownNote != null) && (
        <figcaption className="bek-usage-meter__footer">
          <span className="bek-usage-meter__reset">{resetAt}</span>
          {shownNote != null && <span className="bek-usage-meter__note">{shownNote}</span>}
        </figcaption>
      )}
    </figure>
  );
}
