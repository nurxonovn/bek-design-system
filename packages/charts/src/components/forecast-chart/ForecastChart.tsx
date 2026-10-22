import type { HTMLAttributes } from 'react';
import { cx, Spinner } from '@bek-ui/react';
import { scalePoint } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { SparklesGlyph } from '../generated-chart/glyphs.js';
import { ChartLegend, type ChartLegendItem } from '../legend-item/LegendItem.js';

export type ForecastChartVariant = 'default' | 'target';
/** Ishonch darajasi (%): `dataviz/uncertainty/50 · 80 · 95`. */
export type ForecastLevel = 50 | 80 | 95;

export interface ForecastPoint {
  /** Model prognozi. */
  value: number;
  /** Har daraja uchun `[pastki, yuqori]` chegara: `{ 80: [71, 93], 95: [64, 100] }`. */
  range?: Partial<Record<ForecastLevel, [number, number]>>;
}

export interface ForecastChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Butun o'q: kuzatilgan + prognoz davrlari (`actual.length + forecast.length`). */
  labels: string[];
  /** Kuzatilgan qiymatlar. Prognoz aynan oxirgi haqiqiy nuqtadan boshlanadi ("Today"). */
  actual: number[];
  /** Keyingi davrlar prognozi va ishonch oraliqlari. */
  forecast: ForecastPoint[];
  /** Ko'rsatiladigan oraliqlar (kengidan torigacha chiziladi). Standart `[80, 95]`. */
  bands?: ForecastLevel[];
  /** `target` — maqsad chizig'i (Grid line Target). `target` berilsa avtomatik. */
  variant?: ForecastChartVariant;
  /** Maqsad qiymati (`dataviz/target`, uzuq chiziq). */
  target?: number;
  /** Qayta hisoblanmoqda: oraliqlar va prognoz 40%, legend yonida Spinner. */
  recalculating?: boolean;
  actualLabel?: string;
  forecastLabel?: string;
  /** "Today" belgisi matni. */
  todayLabel?: string;
  /** Prediction zone yorlig'i. */
  zoneLabel?: string;
  /** Y o'qi 0 dan (Figma: ha). */
  zero?: boolean;
  width?: number;
  /** Plot balandligi `chart/height/md` (200 / 240 / 320). */
  height?: number;
  ticks?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun xulosa: "Forecast for November 82, likely between 71 and 93 (80%)". */
  label: string;
}

const AXIS_W = 40; // scale/40
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const TAG_H = 20;
const LEVEL_ORDER: ForecastLevel[] = [95, 80, 50];

/**
 * Figma "4.18 Chart · Forecast": kuzatilgan seriya (to'liq chiziq) va model prognozi (uzuq,
 * `dataviz/ai/accent`) Prediction zone ichida, 80% / 95% ishonch oraliqlari bilan.
 */
export function ForecastChart({
  labels,
  actual,
  forecast,
  bands = [80, 95],
  variant,
  target,
  recalculating = false,
  actualLabel = 'Actual',
  forecastLabel = 'Forecast',
  todayLabel = 'Today',
  zoneLabel = 'Forecast',
  zero = true,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: ForecastChartProps) {
  const mode: ForecastChartVariant = variant ?? (target != null ? 'target' : 'default');
  const levels = LEVEL_ORDER.filter((l) => bands.includes(l));
  const plotBottom = height - AXIS_H;
  const n = Math.max(labels.length, actual.length + forecast.length);
  const today = actual.length - 1;
  const start = Math.max(0, today);
  const anchor = today >= 0 ? actual[today] : 0;
  const values = [
    ...actual,
    ...forecast.flatMap((p) => [
      p.value,
      ...levels.flatMap((l) => (p.range?.[l] ? p.range[l] : [])),
    ]),
    ...(mode === 'target' && target != null ? [target] : []),
  ];
  const y = valueScale(values, [plotBottom, 4], { zero, ticks });
  const x = scalePoint<number>()
    .domain(Array.from({ length: n }, (_, i) => i))
    .range([AXIS_W + LABEL_GAP, width - LABEL_GAP]);
  const xi = (i: number) => x(i) ?? 0;

  // Prognoz oxirgi haqiqiy nuqtadan boshlanadi: [anchor, …forecast].
  const fIdx = (k: number) => (today >= 0 ? today + k : k);
  const fValues =
    today >= 0 ? [anchor, ...forecast.map((p) => p.value)] : forecast.map((p) => p.value);
  const pathOf = line<number>()
    .x((_, k) => xi(fIdx(k)))
    .y((v) => y(v))
    .curve(curveMonotoneX);
  const actualPath = line<number>()
    .x((_, i) => xi(i))
    .y((v) => y(v))
    .curve(curveMonotoneX)(actual);
  const bandPath = (l: ForecastLevel) => {
    const lo = forecast.map((p) => p.range?.[l]?.[0] ?? p.value);
    const hi = forecast.map((p) => p.range?.[l]?.[1] ?? p.value);
    const rows: [number, number][] = (
      today >= 0 ? [[anchor, anchor] as [number, number]] : []
    ).concat(lo.map((v, k) => [v, hi[k]] as [number, number]));
    return (
      area<[number, number]>()
        .x((_, k) => xi(fIdx(k)))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(curveMonotoneX)(rows) ?? ''
    );
  };

  const every = n > 1 ? Math.ceil(n / Math.max(2, Math.floor((width - AXIS_W) / 56))) : 1;
  const zoneX = today >= 0 ? xi(today) : AXIS_W;
  const tagW = todayLabel.length * 7 + 16;
  const rangeText = (p: ForecastPoint) =>
    levels
      .filter((l) => p.range?.[l])
      .map((l) => `${l}%: ${formatValue(p.range![l]![0])}–${formatValue(p.range![l]![1])}`)
      .join(' · ');

  const legend: ChartLegendItem[] = [
    { label: actualLabel, variant: 'line', color: seriesColor(0) },
    { label: forecastLabel, variant: 'dashed', color: 'var(--bek-dataviz-ai-accent)' },
    ...[...levels].reverse().map((l) => ({
      label: `${l}% range`,
      variant: 'square' as const,
      color: `var(--bek-dataviz-uncertainty-${l})`,
    })),
  ];

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-forecast-chart',
        `bek-forecast-chart--${mode}`,
        recalculating && 'bek-forecast-chart--recalculating',
        className,
      )}
    >
      <div className="bek-forecast-chart__legend">
        <ChartLegend items={legend} />
        {recalculating && <Spinner size={16} label="Recalculating forecast" />}
      </div>
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-forecast-chart__zone" aria-hidden="true">
          <rect x={r2(zoneX)} y={0} width={r2(Math.max(0, width - zoneX))} height={plotBottom} />
          <line
            className="bek-forecast-chart__today"
            x1={r2(zoneX)}
            x2={r2(zoneX)}
            y1={today >= 0 ? TAG_H : 0}
            y2={plotBottom}
          />
        </g>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} baseline={zero ? 0 : undefined} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
        <g className="bek-forecast-chart__forecast">
          {levels.map((l) => (
            <path
              key={l}
              className={`bek-forecast-chart__band bek-forecast-chart__band--${l}`}
              d={bandPath(l)}
            />
          ))}
          {fValues.length > 1 && (
            <path className="bek-forecast-chart__line" d={pathOf(fValues) ?? ''} />
          )}
        </g>
        {mode === 'target' && target != null && (
          <line
            className="bek-forecast-chart__target"
            x1={AXIS_W}
            x2={width}
            y1={r2(y(target))}
            y2={r2(y(target))}
          >
            <title>{`Target: ${formatValue(target)}`}</title>
          </line>
        )}
        {actual.length > 1 && <path className="bek-forecast-chart__actual" d={actualPath ?? ''} />}
        {today >= 0 && (
          <g className="bek-forecast-chart__last">
            <circle className="bek-forecast-chart__halo" cx={r2(zoneX)} cy={r2(y(anchor))} r={10} />
            <circle className="bek-forecast-chart__point" cx={r2(zoneX)} cy={r2(y(anchor))} r={5}>
              <title>{`${labels[today] ?? ''}: ${formatValue(anchor)}`}</title>
            </circle>
          </g>
        )}
        <g className="bek-forecast-chart__hits">
          {forecast.map((p, k) => {
            const i = today + 1 + k;
            return (
              <circle
                key={k}
                className="bek-forecast-chart__hit"
                cx={r2(xi(i))}
                cy={r2(y(p.value))}
                r={4}
              >
                <title>{`${labels[i] ?? ''}: ${formatValue(p.value)}${rangeText(p) ? ` (${rangeText(p)})` : ''}`}</title>
              </circle>
            );
          })}
        </g>
        {today >= 0 && (
          <g className="bek-forecast-chart__tag" aria-hidden="true">
            <rect x={r2(zoneX - tagW / 2)} y={0} width={tagW} height={TAG_H} rx={TAG_H / 2} />
            <text x={r2(zoneX)} y={TAG_H / 2} dy="0.35em" textAnchor="middle">
              {todayLabel}
            </text>
          </g>
        )}
        <g className="bek-forecast-chart__zone-label" aria-hidden="true">
          <text x={width - LABEL_GAP} y={plotBottom - LABEL_GAP} textAnchor="end">
            {zoneLabel}
          </text>
          <SparklesGlyph
            className="bek-forecast-chart__sparkles"
            x={width - LABEL_GAP - zoneLabel.length * 7 - 20}
            y={plotBottom - LABEL_GAP - 13}
            width={16}
            height={16}
          />
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
      <DataTable
        caption={label}
        columns={['Date', actualLabel, forecastLabel, ...levels.map((l) => `${l}% range`)]}
        rows={Array.from({ length: n }, (_, i) => {
          const p = i > today ? forecast[i - today - 1] : undefined;
          return [
            labels[i] ?? '',
            i <= today ? formatValue(actual[i]) : '—',
            p ? formatValue(p.value) : '—',
            ...levels.map((l) =>
              p?.range?.[l] ? `${formatValue(p.range[l]![0])}–${formatValue(p.range[l]![1])}` : '—',
            ),
          ];
        })}
      />
    </figure>
  );
}
