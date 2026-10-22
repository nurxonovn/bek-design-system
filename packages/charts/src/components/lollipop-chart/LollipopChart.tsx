import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_WIDTH, r2, valueScale } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type LollipopChartVariant = 'default';

export interface LollipopDatum {
  /** Kategoriya (ko'nikma, filial, mahsulot). */
  label: string;
  value: number;
}

export interface LollipopChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 6–20 kategoriya; standart bo'yicha kamayish tartibida saralanadi. */
  data: LollipopDatum[];
  /** Figma'da yagona `default` varianti. */
  variant?: LollipopChartVariant;
  /** `false` — tabiiy tartib (vaqt, bosqich) saqlanadi. Standart: kamayish bo'yicha. */
  sort?: boolean;
  /** Bosh rangi; standart — `seriesColor(0)` (`dataviz/categorical/01`). */
  color?: string;
  /** SVG eni (Figma `scale/480`); responsiv — `ChartContainer`. Balandlik qatorlar sonidan. */
  width?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const LABEL_W = 80; // scale/80 — kategoriya ustuni
const GAP = 12; // scale/12 — qator ichidagi oraliq
const VALUE_W = 40; // qiymat ustuni
const ROW = 16; // scale/16 — qator (track) balandligi
const ROW_GAP = 16; // scale/16 — qatorlar orasi
const HEAD_R = 6; // chart/point/size (8) / 2 + stroke/strong (2) halqa

/** Figma "4.18 Chart · Lollipop": ko'p kategoriyali reyting — ingichka poya va nuqta. */
export function LollipopChart({
  data,
  variant = 'default',
  sort = true,
  color = seriesColor(0),
  width = DEFAULT_WIDTH,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: LollipopChartProps) {
  const rows = sort ? [...data].sort((a, b) => b.value - a.value) : data;
  const height = Math.max(1, rows.length) * (ROW + ROW_GAP) - ROW_GAP;
  const x0 = LABEL_W + GAP;
  const x1 = width - VALUE_W - GAP;
  const x = valueScale(
    rows.map((d) => d.value),
    [x0 + HEAD_R, x1 - HEAD_R],
    { ticks: 4 },
  );

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-lollipop-chart', `bek-lollipop-chart--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-lollipop-chart__plot">
          {rows.map((d, i) => {
            const cy = r2(i * (ROW + ROW_GAP) + ROW / 2);
            const zero = r2(x(0));
            const cx0 = r2(x(d.value));
            return (
              <g key={i} className="bek-lollipop-chart__row">
                <text className="bek-lollipop-chart__label" x={0} y={cy} dy="0.32em">
                  {d.label}
                </text>
                <line
                  className="bek-lollipop-chart__stem"
                  x1={Math.min(zero, cx0)}
                  x2={Math.max(zero, cx0)}
                  y1={cy}
                  y2={cy}
                />
                <circle
                  className="bek-chart__mark bek-lollipop-chart__head"
                  cx={cx0}
                  cy={cy}
                  r={HEAD_R}
                  style={{ fill: color }}
                >
                  <title>{`${i + 1}. ${d.label}: ${formatValue(d.value)}`}</title>
                </circle>
                <text
                  className="bek-lollipop-chart__value"
                  x={width}
                  y={cy}
                  dy="0.32em"
                  textAnchor="end"
                >
                  {formatValue(d.value)}
                </text>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Category', 'Value']}
        rows={rows.map((d, i) => [`${i + 1}. ${d.label}`, formatValue(d.value)])}
      />
    </figure>
  );
}
