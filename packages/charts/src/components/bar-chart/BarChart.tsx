import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { scaleBand } from 'd3-scale';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  roundedBar,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type BarChartVariant = 'vertical' | 'grouped' | 'stacked' | 'horizontal';

export interface BarDatum {
  /** Kategoriya (oy, hudud, mahsulot). */
  label: string;
  /** Har seriya uchun qiymat (Grouped ≤ 3, Stacked ≤ 4); bitta seriya — `[qiymat]`. */
  values: number[];
}

export interface BarSeries {
  name: string;
  /** Standart — `seriesColor(i)` (`dataviz/categorical/0i`). */
  color?: string;
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  data: BarDatum[];
  /** Seriyalar (legend). Bitta seriyada legend chiqmaydi. */
  series?: BarSeries[];
  /** `vertical` (standart), `grouped` — yonma-yon, `stacked` — ulushlar, `horizontal` — reyting / uzun nomlar. */
  variant?: BarChartVariant;
  /** SVG eni — responsiv uchun `ChartContainer` ichida bering. Figma `scale/480`. */
  width?: number;
  /** Plot balandligi (`chart/height/md`: 200 / 240 / 320). Horizontal'da qatorlar soniga qarab. */
  height?: number;
  /** Maksimal ustun qalinligi (`chart/bar/thickness`: 16 / 24 / 32). */
  barThickness?: number;
  /** Y o'qi bo'linmalari (`chart/axis/tick-count`: 4 / 5 / 6). */
  ticks?: number;
  /** Qiymat formati; standart uz-UZ, katta sonlar qisqa (`4,8 mln`). */
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const RADIUS = 4; // chart/bar/radius
const LABEL_GAP = 8; // chart/axis/label-gap
const AXIS_W = 40; // scale/40 — Y yozuvlari ustuni
const AXIS_H = 20; // X yozuvlari qatori
const CATEGORY_W = 80; // scale/80 — Horizontal kategoriya ustuni
const ROW = 32; // scale/32 — Horizontal qator balandligi

/** Figma "4.18 Chart · Bar": kategoriyalar bo'yicha qiymatlar, ustun doim 0 dan. */
export function BarChart({
  data,
  series = [],
  variant = 'vertical',
  width = DEFAULT_WIDTH,
  height,
  barThickness = 16,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: BarChartProps) {
  const nSeries = Math.max(1, ...data.map((d) => d.values.length));
  const colorOf = (i: number) => series[i]?.color ?? seriesColor(i);
  const totals = data.map((d) => d.values.reduce((a, b) => a + Math.max(0, b), 0));
  const allValues = variant === 'stacked' ? totals : data.flatMap((d) => d.values);
  const showLegend = series.length > 1;
  const table = (
    <DataTable
      caption={label}
      columns={[
        'Category',
        ...Array.from(
          { length: nSeries },
          (_, i) => series[i]?.name ?? (nSeries > 1 ? `Series ${i + 1}` : 'Value'),
        ),
      ]}
      rows={data.map((d) => [d.label, ...d.values.map(formatValue)])}
    />
  );

  if (variant === 'horizontal') {
    const h = height ?? Math.max(1, data.length) * ROW + AXIS_H;
    const x = valueScale(allValues, [CATEGORY_W, width - 48], { ticks });
    const y = scaleBand<number>()
      .domain(data.map((_, i) => i))
      .range([0, h - AXIS_H])
      .paddingInner(0.3);
    const bw = Math.min(barThickness, y.bandwidth());
    return (
      <figure
        {...rest}
        className={cx('bek-chart', 'bek-bar-chart', 'bek-bar-chart--horizontal', className)}
      >
        {showLegend && (
          <ChartLegend
            items={series.map((s, i) => ({ label: s.name, color: colorOf(i), variant: 'square' }))}
          />
        )}
        <ChartSvg width={width} height={h} label={label}>
          <g className="bek-bar-chart__plot">
            {data.map((d, di) => {
              const yy = (y(di) ?? 0) + (y.bandwidth() - bw) / 2;
              const v = d.values[0] ?? 0;
              return (
                <g key={di} className="bek-bar-chart__group">
                  <text className="bek-bar-chart__category" x={0} y={r2(yy + bw / 2)} dy="0.32em">
                    {d.label}
                  </text>
                  <path
                    className="bek-chart__mark bek-bar-chart__bar"
                    style={{ fill: colorOf(0) }}
                    d={roundedBar(x(0), yy, Math.max(0, x(v) - x(0)), bw, RADIUS, 'right')}
                  >
                    <title>{`${d.label}: ${formatValue(v)}`}</title>
                  </path>
                  <text
                    className="bek-bar-chart__value"
                    x={r2(x(v) + LABEL_GAP)}
                    y={r2(yy + bw / 2)}
                    dy="0.32em"
                  >
                    {formatValue(v)}
                  </text>
                </g>
              );
            })}
          </g>
        </ChartSvg>
        {table}
      </figure>
    );
  }

  const h = height ?? DEFAULT_HEIGHT;
  const plotBottom = h - AXIS_H;
  const y = valueScale(allValues, [plotBottom, 4], { ticks });
  const x = scaleBand<number>()
    .domain(data.map((_, i) => i))
    .range([AXIS_W, width])
    .paddingInner(0.3)
    .paddingOuter(0.15);
  const groupW = x.bandwidth();
  const inner =
    variant === 'grouped'
      ? Math.min(barThickness, (groupW - (nSeries - 1) * 2) / nSeries)
      : Math.min(barThickness, groupW);

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-bar-chart', `bek-bar-chart--${variant}`, className)}
    >
      {showLegend && (
        <ChartLegend
          items={series.map((s, i) => ({ label: s.name, color: colorOf(i), variant: 'square' }))}
        />
      )}
      <ChartSvg width={width} height={h} label={label}>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} baseline={0} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
        <g className="bek-bar-chart__plot">
          {data.map((d, di) => {
            const gx = x(di) ?? 0;
            if (variant === 'stacked') {
              let acc = 0;
              const last = d.values.reduce((li, v, i) => (v > 0 ? i : li), -1);
              return (
                <g key={di} className="bek-bar-chart__group">
                  {d.values.map((v, si) => {
                    const y0 = y(acc);
                    acc += Math.max(0, v);
                    const y1 = y(acc);
                    const bx = gx + (groupW - inner) / 2;
                    const path =
                      si === last
                        ? roundedBar(bx, y1, inner, y0 - y1, RADIUS, 'top')
                        : `M${r2(bx)},${r2(y1)}h${r2(inner)}v${r2(y0 - y1)}h${r2(-inner)}Z`;
                    return (
                      <path
                        key={si}
                        className="bek-chart__mark bek-bar-chart__bar"
                        style={{ fill: colorOf(si) }}
                        d={path}
                      >
                        <title>{`${d.label} · ${series[si]?.name ?? ''}: ${formatValue(v)}`}</title>
                      </path>
                    );
                  })}
                  <title>{`${d.label}: ${formatValue(totals[di])}`}</title>
                </g>
              );
            }
            const vals = variant === 'grouped' ? d.values : d.values.slice(0, 1);
            const span = vals.length * inner + (vals.length - 1) * 2;
            return (
              <g key={di} className="bek-bar-chart__group">
                {vals.map((v, si) => {
                  const bx = gx + (groupW - span) / 2 + si * (inner + 2);
                  const top = y(Math.max(0, v));
                  const bottom = y(Math.min(0, v));
                  return (
                    <path
                      key={si}
                      className="bek-chart__mark bek-bar-chart__bar"
                      style={{ fill: colorOf(si) }}
                      d={roundedBar(
                        bx,
                        top,
                        inner,
                        Math.max(0, bottom - top),
                        RADIUS,
                        v < 0 ? 'bottom' : 'top',
                      )}
                    >
                      <title>{`${d.label}${series[si] ? ` · ${series[si].name}` : ''}: ${formatValue(v)}`}</title>
                    </path>
                  );
                })}
              </g>
            );
          })}
        </g>
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={data.map((d, di) => ({
            key: `${di}`,
            x: (x(di) ?? 0) + groupW / 2,
            label: d.label,
          }))}
        />
      </ChartSvg>
      {table}
    </figure>
  );
}
