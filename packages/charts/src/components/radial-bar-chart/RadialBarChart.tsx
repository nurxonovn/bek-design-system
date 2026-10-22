import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { mean } from 'd3-array';
import { arc } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatPercent } from '../../core/format.js';
import { DataTable } from '../../core/svg.js';
import { LegendItem } from '../legend-item/LegendItem.js';

export type RadialBarChartVariant = 'default' | 'progress';

export interface RadialBarDatum {
  label: string;
  /** Ulush 0…1 (hamma halqa bir xil 0–100% shkalada). */
  value: number;
  /** Standart — `seriesColor(i)` (`dataviz/categorical/0i`). */
  color?: string;
}

export interface RadialBarChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Halqalar tashqaridan ichkariga (birinchisi — tashqi, eng kattasi). Default ≤ 4, Progress 2–3. */
  data: RadialBarDatum[];
  /** `default` — halqalar + qiymatli legend; `progress` — qalinroq maqsad halqalari, markazda umumiy qiymat. */
  variant?: RadialBarChartVariant;
  /** Progress markazidagi qiymat; standart — o'rtacha ulush (`75%`). */
  centerValue?: ReactNode;
  /** Progress markazidagi izoh: "weekly goal". */
  centerLabel?: ReactNode;
  /** Kvadrat chizma tomoni (`scale/200`, qurilmadan qat'i nazar o'zgarmaydi). */
  size?: number;
  /** Qiymatli legend (standart: ko'rinadi — yoy uzunligi yolg'iz aniq o'qilmaydi). */
  showLegend?: boolean;
  /** Ulush formati; standart — `82%`. */
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const MAX_RINGS = 4;
const RING_GAP = 4; // halqalar orasi
const THICKNESS: Record<RadialBarChartVariant, number> = { default: 10, progress: 14 };
const FULL = Math.PI * 2;

/**
 * Figma "4.18 Chart · Radial bar": har kategoriya — bitta halqa, hammasi bir xil 0–100% shkalada.
 * Chizma `size` tomonli kvadratda qoladi (cho'zilmaydi), yoy soat 12 dan soat yo'nalishida.
 */
export function RadialBarChart({
  data,
  variant = 'default',
  centerValue,
  centerLabel,
  size = 200,
  showLegend = true,
  formatValue = (v) => formatPercent(v * 100, { decimals: 0 }),
  label,
  className,
  ...rest
}: RadialBarChartProps) {
  const rings = data.slice(0, MAX_RINGS);
  const r = size / 2;
  const t = THICKNESS[variant];
  const colorOf = (d: RadialBarDatum, i: number) => d.color ?? seriesColor(i);
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const ring = (i: number, end: number) =>
    arc()({
      innerRadius: r - i * (t + RING_GAP) - t,
      outerRadius: r - i * (t + RING_GAP),
      startAngle: 0,
      endAngle: end,
    }) ?? '';
  const center = centerValue ?? formatValue(mean(rings, (d) => clamp(d.value)) ?? 0);

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-radial-bar-chart',
        `bek-radial-bar-chart--${variant}`,
        className,
      )}
    >
      <div className="bek-radial-bar-chart__body">
        <div className="bek-radial-bar-chart__square" style={{ inlineSize: size, blockSize: size }}>
          <svg
            className="bek-chart__svg"
            width={size}
            height={size}
            viewBox={`${-r} ${-r} ${size} ${size}`}
            role="img"
            aria-label={label}
          >
            {rings.map((d, i) => (
              <g key={i} className="bek-radial-bar-chart__ring" data-ring={i}>
                <path className="bek-radial-bar-chart__track" d={ring(i, FULL)} />
                {clamp(d.value) > 0 && (
                  <path
                    className="bek-chart__mark bek-radial-bar-chart__value"
                    style={{ fill: colorOf(d, i) }}
                    d={ring(i, FULL * clamp(d.value))}
                  />
                )}
                <title>{`${d.label}: ${formatValue(d.value)}`}</title>
              </g>
            ))}
          </svg>
          {variant === 'progress' && (
            <div className="bek-radial-bar-chart__center" aria-hidden="true">
              <span className="bek-radial-bar-chart__total">{center}</span>
              {centerLabel != null && (
                <span className="bek-radial-bar-chart__caption">{centerLabel}</span>
              )}
            </div>
          )}
        </div>
        {showLegend && (
          <ul className="bek-radial-bar-chart__legend" aria-hidden="true">
            {rings.map((d, i) => (
              <li key={i} className="bek-radial-bar-chart__item" data-ring={i}>
                <LegendItem color={colorOf(d, i)}>{d.label}</LegendItem>
                <span className="bek-radial-bar-chart__amount">{formatValue(d.value)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DataTable
        caption={label}
        columns={['Category', 'Value']}
        rows={rings.map((d) => [d.label, formatValue(d.value)])}
      />
    </figure>
  );
}
