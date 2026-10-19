import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek/react';
import { arc, pie } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DataTable } from '../../core/svg.js';

export type DonutChartVariant = 'default' | 'progress';

export interface DonutSegment {
  label: string;
  value: number;
  /** Standart — `seriesColor(i)`; "Other" uchun `var(--bek-dataviz-neutral)` bering. */
  color?: string;
}

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** `default` — ulushlar (≤ 5 segment), `progress` — `dataviz/track` ustida bitta qiymat. */
  variant?: DonutChartVariant;
  /** Default: segmentlar (kattasidan, soat 12 dan soat yo'nalishida). */
  data?: DonutSegment[];
  /** Progress: 0…1 ulush. */
  progress?: number;
  /** Markazdagi asosiy qiymat; standart — jami (Default) yoki foiz (Progress). */
  centerValue?: ReactNode;
  /** Markazdagi izoh: "Total", "of goal". */
  centerLabel?: ReactNode;
  /** Halqa diametri (`chart/height/sm`: 140 / 160 / 200). */
  size?: number;
  /** Halqa qalinligi (`chart/donut/thickness`: 20 / 24 / 28). */
  thickness?: number;
  formatValue?: (value: number) => string;
  /** Qiymatli legend (Default'da majburiy, Progress'da ixtiyoriy). */
  showLegend?: boolean;
  label: string;
}

/** Figma "4.18 Chart · Donut": ulushlar halqasi, markazda jami; qiymatli legend yonida. */
export function DonutChart({
  variant = 'default',
  data = [],
  progress = 0,
  centerValue,
  centerLabel,
  size = 140,
  thickness = 20,
  formatValue = (v) => formatNumber(v, { compact: true }),
  showLegend = variant === 'default',
  label,
  className,
  ...rest
}: DonutChartProps) {
  const r = size / 2;
  const ring = arc<{ startAngle: number; endAngle: number }>()
    .innerRadius(r - thickness)
    .outerRadius(r)
    .cornerRadius(variant === 'progress' ? thickness / 2 : 0)
    .padAngle(variant === 'default' ? 0.012 : 0);
  const total = data.reduce((a, d) => a + Math.max(0, d.value), 0);
  const p = Math.max(0, Math.min(1, progress));
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const arcs = pie<DonutSegment>()
    .sort(null)
    .value((d) => Math.max(0, d.value))(sorted);
  const colorOf = (d: DonutSegment) => d.color ?? seriesColor(data.indexOf(d));
  const center =
    centerValue ??
    (variant === 'progress' ? formatPercent(p * 100, { decimals: 0 }) : formatValue(total));

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-donut-chart', `bek-donut-chart--${variant}`, className)}
    >
      <div className="bek-donut-chart__body">
        <div className="bek-donut-chart__ring" style={{ inlineSize: size, blockSize: size }}>
          <svg
            className="bek-chart__svg"
            width={size}
            height={size}
            viewBox={`${-r} ${-r} ${size} ${size}`}
            role="img"
            aria-label={label}
          >
            {variant === 'progress' ? (
              <>
                <path
                  className="bek-donut-chart__track"
                  d={ring({ startAngle: 0, endAngle: Math.PI * 2 }) ?? ''}
                />
                {p > 0 && (
                  <path
                    className="bek-donut-chart__value"
                    d={ring({ startAngle: 0, endAngle: Math.PI * 2 * p }) ?? ''}
                  />
                )}
              </>
            ) : (
              arcs.map((a) => (
                <path
                  key={a.index}
                  className="bek-chart__mark bek-donut-chart__segment"
                  style={{ fill: colorOf(a.data) }}
                  d={ring(a) ?? ''}
                >
                  <title>{`${a.data.label}: ${formatValue(a.data.value)} (${formatPercent(total ? (a.data.value / total) * 100 : 0)})`}</title>
                </path>
              ))
            )}
          </svg>
          <div className="bek-donut-chart__center" aria-hidden="true">
            <span className="bek-donut-chart__total">{center}</span>
            {centerLabel != null && <span className="bek-donut-chart__caption">{centerLabel}</span>}
          </div>
        </div>
        {showLegend && variant === 'default' && (
          <ul className="bek-donut-chart__legend">
            {sorted.map((d, i) => (
              <li key={i} className="bek-donut-chart__item">
                <span
                  className="bek-donut-chart__swatch"
                  style={{ background: colorOf(d) }}
                  aria-hidden="true"
                />
                <span className="bek-donut-chart__name">{d.label}</span>
                <span className="bek-donut-chart__amount">{formatValue(d.value)}</span>
                <span className="bek-donut-chart__share">
                  {formatPercent(total ? (d.value / total) * 100 : 0, { decimals: 0 })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DataTable
        caption={label}
        columns={['Category', 'Value', 'Share']}
        rows={
          variant === 'progress'
            ? [[label, formatPercent(p * 100, { decimals: 0 }), '']]
            : sorted.map((d) => [
                d.label,
                formatValue(d.value),
                formatPercent(total ? (d.value / total) * 100 : 0),
              ])
        }
      />
    </figure>
  );
}
