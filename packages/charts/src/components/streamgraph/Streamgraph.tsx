import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { max as d3max, min as d3min, sum } from 'd3-array';
import { scaleLinear, scalePoint } from 'd3-scale';
import {
  area,
  curveBasis,
  stack,
  stackOffsetExpand,
  stackOffsetSilhouette,
  stackOrderNone,
  type SeriesPoint,
} from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { AxisBottom, ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

/** Figma `Variant`: Default (silhouette — markaz chizig'i atrofida) · Expanded (100% stacked). */
export type StreamgraphVariant = 'default' | 'expanded';

export interface StreamDatum {
  /** Vaqt nuqtasi yozuvi ("Jan", "2026-03"); tartib — `data` dagi birinchi uchrash tartibi. */
  date: string;
  /** Seriya (kanal, mahsulot liniyasi). */
  series: string;
  value: number;
}

export interface StreamgraphProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Uzun format: har qator — bitta sana × seriya qiymati. Yo'q juftlik 0 deb olinadi. */
  data: StreamDatum[];
  /** `default` — silhouette offset; `expanded` — har sanada 100% (ulushlar). */
  variant?: StreamgraphVariant;
  /** Seriyalar tartibi (birinchisi — pastda); standart — `data` dagi birinchi uchrash tartibi. 3–7 ta. */
  series?: string[];
  /** Legend'da yashirilgan seriyalar — oqimdan olib tashlanadi, qolganlari qayta oqadi. */
  hiddenSeries?: string[];
  /** Legend bosilganda seriya indeksi (`series` tartibida). Berilmasa legend statik. */
  onToggleSeries?: (index: number) => void;
  width?: number;
  /** Chizma balandligi (`scale/200`); legend tashqarida. */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const AXIS_W = 40; // scale/40 — Expanded ulush yozuvlari ustuni
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const EDGE = 16; // Default: chetdagi sana yozuvi kesilmasligi uchun
const TOP = 4;
const MIN_LABEL_STEP = 48; // sana yozuvlari orasidagi eng kichik masofa
const SHARE_TICKS = [0, 0.5, 1];

/**
 * Figma "4.18 Chart · Streamgraph": markaz chizig'i atrofida oqadigan stacked maydonlar —
 * 3–7 kategoriya aralashmasi vaqt bo'yicha qanday o'sib-so'nishini ko'rsatadi.
 */
export function Streamgraph({
  data,
  variant = 'default',
  series: seriesOrder,
  hiddenSeries = [],
  onToggleSeries,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: StreamgraphProps) {
  const dates = [...new Set(data.map((d) => d.date))];
  const names = seriesOrder ?? [...new Set(data.map((d) => d.series))];
  const valueOf = new Map(data.map((d) => [`${d.date}\u0000${d.series}`, d.value]));
  const get = (date: string, name: string) => {
    const v = valueOf.get(`${date}\u0000${name}`);
    return v != null && Number.isFinite(v) ? Math.max(0, v) : 0;
  };
  const visible = names.map((_, i) => i).filter((i) => !hiddenSeries.includes(names[i]));
  const expanded = variant === 'expanded';
  const layers = stack<string, number>()
    .keys(visible)
    .value((date, i) => get(date, names[i]))
    .order(stackOrderNone)
    .offset(expanded ? stackOffsetExpand : stackOffsetSilhouette)(dates);

  const left = expanded ? AXIS_W : EDGE;
  const right = width - (expanded ? LABEL_GAP : EDGE);
  const plotBottom = height - AXIS_H;
  const x = scalePoint<number>()
    .domain(dates.map((_, i) => i))
    .range([left, right]);
  const lo = d3min(layers, (l) => d3min(l, (p) => p[0])) ?? 0;
  const hi = d3max(layers, (l) => d3max(l, (p) => p[1])) ?? 1;
  const y = scaleLinear()
    .domain(expanded ? [0, 1] : [lo, hi === lo ? lo + 1 : hi])
    .range([plotBottom, TOP]);
  const path = area<SeriesPoint<string>>()
    .x((_, i) => x(i) ?? 0)
    .y0((p) => y(p[0]))
    .y1((p) => y(p[1]))
    .curve(curveBasis);
  const every = Math.max(1, Math.ceil((dates.length * MIN_LABEL_STEP) / Math.max(1, right - left)));
  const totals = dates.map((date) => sum(visible, (i) => get(date, names[i])));
  const grand = sum(totals) || 1;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-streamgraph', `bek-streamgraph--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        {expanded && (
          <g className="bek-chart__axis bek-chart__axis--y" aria-hidden="true">
            {SHARE_TICKS.map((t) => (
              <text
                key={t}
                className="bek-chart__tick"
                x={AXIS_W - LABEL_GAP}
                y={r2(y(t))}
                dy="0.32em"
                textAnchor="end"
              >
                {formatPercent(t * 100, { decimals: 0 })}
              </text>
            ))}
          </g>
        )}
        <g className="bek-streamgraph__plot">
          {layers.map((layer) => {
            const i = layer.key;
            const total = sum(dates, (date) => get(date, names[i]));
            return (
              <path
                key={names[i]}
                className="bek-chart__mark bek-streamgraph__layer"
                style={{ fill: seriesColor(i) }}
                d={path(layer) ?? ''}
              >
                <title>{`${names[i]}: ${formatValue(total)} · ${formatPercent((total / grand) * 100)}`}</title>
              </path>
            );
          })}
        </g>
        <line
          className="bek-streamgraph__axis"
          x1={expanded ? AXIS_W : 0}
          x2={width}
          y1={r2(plotBottom)}
          y2={r2(plotBottom)}
          aria-hidden="true"
        />
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={dates
            .map((d, i) => ({ key: `${i}`, x: x(i) ?? 0, label: d }))
            .filter((_, i) => i % every === 0)}
        />
      </ChartSvg>
      <ChartLegend
        items={names.map((n, i) => ({
          label: n,
          color: seriesColor(i),
          variant: 'square',
          hidden: hiddenSeries.includes(n),
        }))}
        onToggle={onToggleSeries}
      />
      <DataTable
        caption={label}
        columns={['Date', ...visible.map((i) => names[i]), 'Total']}
        rows={dates.map((date, di) => [
          date,
          ...visible.map((i) =>
            expanded
              ? `${formatValue(get(date, names[i]))} (${formatPercent((get(date, names[i]) / (totals[di] || 1)) * 100)})`
              : formatValue(get(date, names[i])),
          ),
          formatValue(totals[di]),
        ])}
      />
    </figure>
  );
}
