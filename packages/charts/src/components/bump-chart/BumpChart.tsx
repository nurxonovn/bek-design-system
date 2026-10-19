import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { max } from 'd3-array';
import { scaleLinear, scalePoint } from 'd3-scale';
import { curveBumpX, line } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { AxisBottom, ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type BumpChartVariant = 'default';

export interface BumpSeries {
  /** Barqaror kalit (ixtiyoriy); standart — `label`. */
  id?: string;
  label: string;
  /** Har davr uchun o'rin (1 — eng yuqori); `null` — o'rin yo'q, chiziqda bo'shliq. Teng o'rinlar bir balandlikda. */
  ranks: (number | null)[];
  /** Standart — `seriesColor(i)`. */
  color?: string;
}

export interface BumpChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** X o'qi davrlari: `['Q1', 'Q2', …]` (4–12). */
  periods: string[];
  /** 3–6 element; har biri bitta chiziq. */
  series: BumpSeries[];
  /** Figma'da yagona `default` varianti. */
  variant?: BumpChartVariant;
  /** Muhokama qilinayotgan element (`label` yoki `id`) — qolganlari 30% ga xiralashadi. */
  highlight?: string;
  width?: number;
  /** Plot balandligi (`chart/height/md`: 200 / 240 / 320). */
  height?: number;
  /** Ekran o'quvchi uchun qisqa xulosa ("Tashkent: Q3 dan tashqari hamma davrda #1"). */
  label: string;
}

const AXIS_W = 32; // scale/32 — o'rin o'qi eni
const LABEL_GAP = 8; // chart/axis/label-gap
const AXIS_H = 20; // X yozuvlari qatori
const PAD = 8; // chiziq uchlari va nuqta radiusi uchun joy
const POINT_R = 4; // chart/point/size (8) / 2

/** Figma "4.18 Chart · Bump": reyting vaqt bo'yicha qanday o'zgargani — #1 tepada. */
export function BumpChart({
  periods,
  series,
  variant = 'default',
  highlight,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: BumpChartProps) {
  const plotBottom = height - AXIS_H;
  const maxRank = Math.max(1, max(series.flatMap((s) => s.ranks.map((r) => r ?? 0))) ?? 1);
  const ranks = Array.from({ length: maxRank }, (_, i) => i + 1);
  const x = scalePoint<number>()
    .domain(periods.map((_, i) => i))
    .range([AXIS_W + LABEL_GAP + PAD, width - PAD]);
  const y = scaleLinear()
    .domain([1, Math.max(2, maxRank)])
    .range([PAD, plotBottom - PAD]);
  const colorOf = (s: BumpSeries, i: number) => s.color ?? seriesColor(i);
  const keyOf = (s: BumpSeries) => s.id ?? s.label;
  const path = line<number | null>()
    .defined((r) => r != null)
    .x((_, i) => x(i) ?? 0)
    .y((r) => y(r ?? 1))
    .curve(curveBumpX);

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-bump-chart',
        `bek-bump-chart--${variant}`,
        highlight != null && 'bek-bump-chart--highlight',
        className,
      )}
    >
      <ChartLegend
        items={series.map((s, i) => ({ label: s.label, color: colorOf(s, i), variant: 'line' }))}
      />
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-chart__grid" aria-hidden="true">
          {ranks.map((r) => (
            <line
              key={r}
              className="bek-chart__gridline"
              x1={AXIS_W + LABEL_GAP}
              x2={width}
              y1={r2(y(r))}
              y2={r2(y(r))}
            />
          ))}
        </g>
        <g className="bek-chart__axis bek-chart__axis--y" aria-hidden="true">
          {ranks.map((r) => (
            <text
              key={r}
              className="bek-chart__tick"
              x={AXIS_W}
              y={r2(y(r))}
              dy="0.32em"
              textAnchor="end"
            >
              {`#${r}`}
            </text>
          ))}
        </g>
        <g className="bek-bump-chart__plot">
          {series.map((s, si) => (
            <g
              key={keyOf(s)}
              className={cx(
                'bek-bump-chart__series',
                highlight != null &&
                  highlight !== keyOf(s) &&
                  highlight !== s.label &&
                  'bek-bump-chart__series--muted',
              )}
              style={{ color: colorOf(s, si) }}
            >
              <path className="bek-chart__mark bek-bump-chart__line" d={path(s.ranks) ?? ''} />
              {s.ranks.map((r, pi) =>
                r == null ? null : (
                  <circle
                    key={pi}
                    className="bek-bump-chart__point"
                    cx={r2(x(pi) ?? 0)}
                    cy={r2(y(r))}
                    r={POINT_R}
                  >
                    <title>{`${s.label} · ${periods[pi]}: #${r}`}</title>
                  </circle>
                ),
              )}
            </g>
          ))}
        </g>
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={periods.map((p, i) => ({ key: `${i}`, x: x(i) ?? 0, label: p }))}
        />
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Item', ...periods]}
        rows={series.map((s) => [s.label, ...s.ranks.map((r) => (r == null ? '—' : `#${r}`))])}
      />
    </figure>
  );
}
