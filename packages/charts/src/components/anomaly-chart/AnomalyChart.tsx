import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek/react';
import { scalePoint } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { AiInsightLine } from '../generated-chart/AiInsightLine.js';
import { ChartLegend, type ChartLegendItem } from '../legend-item/LegendItem.js';

export type AnomalyChartVariant = 'default' | 'band';

export interface AnomalyMark {
  /** `values` dagi indeks. */
  index: number;
  /** Nega belgilandi — tooltip'da majburiy: "Payment gateway outage". */
  reason?: string;
  /** Kutilgan qiymat; berilmasa `expected` oralig'ining o'rtasi. */
  expected?: number;
}

export interface ExpectedRange {
  /** Model o'rgangan kutilgan oraliq — har nuqta uchun pastki va yuqori chegara. */
  lower: number[];
  upper: number[];
}

export interface AnomalyChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** X o'qi (vaqt). */
  labels: string[];
  values: number[];
  /** Model belgilagan nuqtalar — ko'pi bilan 3 tasi ko'rsatiladi (muhimini birinchi bering). */
  anomalies: AnomalyMark[];
  /** Band varianti: kutilgan oraliq (`dataviz/uncertainty/95`). */
  expected?: ExpectedRange;
  /** `band` — kutilgan oraliq bilan; `expected` berilsa avtomatik. */
  variant?: AnomalyChartVariant;
  /** AI insight qatori (Chart/AI insight · Inline): "2 anomalies: spike on 7 Jul (+52%)…". */
  insight?: ReactNode;
  seriesLabel?: string;
  anomalyLabel?: string;
  expectedLabel?: string;
  /** Ko'rsatiladigan anomaliyalar soni (Figma: ≤ 3). */
  maxAnomalies?: number;
  zero?: boolean;
  width?: number;
  /** Plot balandligi `chart/height/md` (200 / 240 / 320). */
  height?: number;
  ticks?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun xulosa. */
  label: string;
}

const AXIS_W = 40; // scale/40
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap

/**
 * Figma "4.18 Chart · Anomaly": model g'ayrioddiy qiymatlarni belgilaydigan vaqt seriyasi.
 * Anomaliya nuqtasi `dataviz/anomaly` (Chart/Data point State=Anomaly), izoh — AI insight qatorida.
 */
export function AnomalyChart({
  labels,
  values,
  anomalies,
  expected,
  variant,
  insight,
  seriesLabel = 'Value',
  anomalyLabel = 'Anomaly',
  expectedLabel = 'Expected range',
  maxAnomalies = 3,
  zero = true,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: AnomalyChartProps) {
  const mode: AnomalyChartVariant = variant ?? (expected ? 'band' : 'default');
  const showBand = mode === 'band' && expected != null;
  const plotBottom = height - AXIS_H;
  const n = Math.max(labels.length, values.length);
  const flagged = anomalies
    .filter((a) => a.index >= 0 && a.index < values.length)
    .slice(0, maxAnomalies);
  const all = [...values, ...(showBand ? [...expected.lower, ...expected.upper] : [])];
  const y = valueScale(all, [plotBottom, 4], { zero, ticks });
  const x = scalePoint<number>()
    .domain(Array.from({ length: n }, (_, i) => i))
    .range([AXIS_W + LABEL_GAP, width - LABEL_GAP]);
  const xi = (i: number) => x(i) ?? 0;
  const path = line<number>()
    .x((_, i) => xi(i))
    .y((v) => y(v))
    .curve(curveMonotoneX)(values);
  const band = showBand
    ? area<number>()
        .x((_, i) => xi(i))
        .y0((_, i) => y(expected.lower[i] ?? 0))
        .y1((v) => y(v))
        .curve(curveMonotoneX)(expected.upper)
    : null;
  const expectedAt = (a: AnomalyMark) =>
    a.expected ??
    (expected && expected.lower[a.index] != null && expected.upper[a.index] != null
      ? (expected.lower[a.index] + expected.upper[a.index]) / 2
      : undefined);
  const describe = (a: AnomalyMark) => {
    const v = values[a.index];
    const e = expectedAt(a);
    const dev = e
      ? ` · ${formatPercent(((v - e) / Math.abs(e)) * 100, { decimals: 0, signed: true })}`
      : '';
    const exp = e != null ? ` · expected ${formatValue(e)}` : '';
    return `${labels[a.index] ?? ''}: ${formatValue(v)}${exp}${dev}${a.reason ? ` · ${a.reason}` : ''}`;
  };
  const every = n > 1 ? Math.ceil(n / Math.max(2, Math.floor((width - AXIS_W) / 56))) : 1;

  const legend: ChartLegendItem[] = [
    { label: seriesLabel, variant: 'line', color: seriesColor(0) },
    { label: anomalyLabel, variant: 'dot', color: 'var(--bek-dataviz-anomaly)' },
    ...(showBand
      ? [
          {
            label: expectedLabel,
            variant: 'square' as const,
            color: 'var(--bek-dataviz-uncertainty-95)',
          },
        ]
      : []),
  ];

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-anomaly-chart', `bek-anomaly-chart--${mode}`, className)}
    >
      <ChartLegend items={legend} />
      <ChartSvg width={width} height={height} label={label}>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} baseline={zero ? 0 : undefined} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
        {band && <path className="bek-anomaly-chart__band" d={band} />}
        {values.length > 1 && <path className="bek-anomaly-chart__line" d={path ?? ''} />}
        <g className="bek-anomaly-chart__points">
          {flagged.map((a) => (
            <g key={a.index} className="bek-anomaly-chart__anomaly">
              <circle
                className="bek-anomaly-chart__halo"
                cx={r2(xi(a.index))}
                cy={r2(y(values[a.index]))}
                r={10}
              />
              <circle
                className="bek-anomaly-chart__point"
                cx={r2(xi(a.index))}
                cy={r2(y(values[a.index]))}
                r={6}
              />
              <title>{describe(a)}</title>
            </g>
          ))}
        </g>
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={Array.from({ length: n }, (_, i) => ({
            key: `${i}`,
            x: xi(i),
            label: labels[i] ?? '',
          })).filter((_, i) => i % every === 0 || i === n - 1)}
        />
      </ChartSvg>
      {insight != null && (
        <AiInsightLine className="bek-anomaly-chart__insight">{insight}</AiInsightLine>
      )}
      <DataTable
        caption={label}
        columns={['Date', seriesLabel, ...(showBand ? [expectedLabel] : []), anomalyLabel]}
        rows={Array.from({ length: n }, (_, i) => {
          const a = flagged.find((f) => f.index === i);
          return [
            labels[i] ?? '',
            values[i] != null ? formatValue(values[i]) : '—',
            ...(showBand
              ? [
                  expected.lower[i] != null && expected.upper[i] != null
                    ? `${formatValue(expected.lower[i])}–${formatValue(expected.upper[i])}`
                    : '—',
                ]
              : []),
            a ? `Yes${a.reason ? `: ${a.reason}` : ''}` : '',
          ];
        })}
      />
    </figure>
  );
}
