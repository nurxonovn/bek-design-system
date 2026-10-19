import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_WIDTH, r2, valueScale } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type DumbbellChartVariant = 'default';

export interface DumbbellDatum {
  /** Qator nomi (chorak, filial). */
  label: string;
  /** Boshlang'ich qiymat (reja, o'tgan yil). */
  from: number;
  /** Yakuniy qiymat (fakt, bu yil). */
  to: number;
}

export interface DumbbellChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 3–12 qator. */
  data: DumbbellDatum[];
  /** Figma'da yagona `default` varianti. */
  variant?: DumbbellChartVariant;
  /** "from" nuqtasi nomi (legend): "Plan", "2025". */
  fromLabel?: string;
  /** "to" nuqtasi nomi (legend): "Actual", "2026". */
  toLabel?: string;
  /** Qiymat o'qi 0 dan boshlansinmi. Standart: yo'q — farq ko'rinsin. */
  zero?: boolean;
  /** SVG eni (Figma `scale/480`); balandlik qatorlar sonidan. */
  width?: number;
  formatValue?: (value: number) => string;
  /** Farq formati; standart — ishorali uz-UZ (`+16`, `−3`). */
  formatDelta?: (delta: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const LABEL_W = 80; // scale/80
const GAP = 12; // scale/12
const VALUE_W = 40; // farq ustuni
const ROW = 16; // scale/16
const ROW_GAP = 16; // scale/16
const POINT_R = 6; // chart/point/size (8) / 2 + stroke/strong halqa

/** Figma "4.18 Chart · Dumbbell": har qatorda ikki qiymat (from → to), farq — asosiy gap. */
export function DumbbellChart({
  data,
  variant = 'default',
  fromLabel = 'From',
  toLabel = 'To',
  zero = false,
  width = DEFAULT_WIDTH,
  formatValue = (v) => formatNumber(v, { compact: true }),
  formatDelta = (d) => formatNumber(d, { signed: true }),
  label,
  className,
  ...rest
}: DumbbellChartProps) {
  const height = Math.max(1, data.length) * (ROW + ROW_GAP) - ROW_GAP;
  const x = valueScale(
    data.flatMap((d) => [d.from, d.to]),
    [LABEL_W + GAP + POINT_R, width - VALUE_W - GAP - POINT_R],
    { zero, ticks: 4 },
  );
  const fromColor = seriesColor(1);
  const toColor = seriesColor(0);

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-dumbbell-chart', `bek-dumbbell-chart--${variant}`, className)}
    >
      <ChartLegend
        items={[
          { label: fromLabel, color: fromColor },
          { label: toLabel, color: toColor },
        ]}
      />
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-dumbbell-chart__plot">
          {data.map((d, i) => {
            const cy = r2(i * (ROW + ROW_GAP) + ROW / 2);
            const a = r2(x(d.from));
            const b = r2(x(d.to));
            const delta = d.to - d.from;
            return (
              <g key={i} className="bek-dumbbell-chart__row">
                <title>{`${d.label}: ${fromLabel} ${formatValue(d.from)}, ${toLabel} ${formatValue(d.to)}, ${formatDelta(delta)}`}</title>
                <text className="bek-dumbbell-chart__label" x={0} y={cy} dy="0.32em">
                  {d.label}
                </text>
                <line
                  className="bek-dumbbell-chart__track"
                  x1={Math.min(a, b)}
                  x2={Math.max(a, b)}
                  y1={cy}
                  y2={cy}
                />
                <circle
                  className="bek-chart__mark bek-dumbbell-chart__point bek-dumbbell-chart__point--from"
                  cx={a}
                  cy={cy}
                  r={POINT_R}
                  style={{ fill: fromColor }}
                />
                <circle
                  className="bek-chart__mark bek-dumbbell-chart__point bek-dumbbell-chart__point--to"
                  cx={b}
                  cy={cy}
                  r={POINT_R}
                  style={{ fill: toColor }}
                />
                <text
                  className="bek-dumbbell-chart__delta"
                  x={width}
                  y={cy}
                  dy="0.32em"
                  textAnchor="end"
                >
                  {formatDelta(delta)}
                </text>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Category', fromLabel, toLabel, 'Difference']}
        rows={data.map((d) => [
          d.label,
          formatValue(d.from),
          formatValue(d.to),
          formatDelta(d.to - d.from),
        ])}
      />
    </figure>
  );
}
