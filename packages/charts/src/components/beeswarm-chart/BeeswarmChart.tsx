import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { extent, max as d3max, median, min as d3min } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_TICKS, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { AxisBottom, ChartSvg, DataTable } from '../../core/svg.js';

export type BeeswarmChartVariant = 'default';

export interface BeeswarmDatum {
  /** Guruh (qator): "Retail", "SME". */
  group: string;
  value: number;
  /** Element nomi — tooltip: "Client 1042". */
  label?: string;
}

export interface BeeswarmChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Har guruhda 20–300 nuqta. */
  data: BeeswarmDatum[];
  /** Figma'da bitta variant — `default`. */
  variant?: BeeswarmChartVariant;
  /** Guruhlar tartibi; standart — `data` dagi birinchi uchrash tartibi. */
  groups?: string[];
  /** Qiymat o'qi chegaralari; standart — ma'lumotdan (chiroyli yaxlitlangan). */
  domain?: [number, number];
  width?: number;
  height?: number;
  ticks?: number;
  /** Nuqta radiusi (Figma `r 3,5`, `chart/point/size` = 8 diametr ichida). */
  radius?: number;
  formatValue?: (value: number) => string;
  label: string;
}

const GROUP_W = 96; // guruh nomlari ustuni
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const PADDING = 0.5; // nuqtalar orasidagi bo'shliq

interface Placed {
  x: number;
  y: number;
  d: BeeswarmDatum;
}

/**
 * Beeswarm joylashuvi: nuqtalar x bo'yicha tartiblanadi, har biri markaz chizig'iga eng yaqin
 * to'qnashmaydigan y ga qo'yiladi (deterministik, O(n²) — 300 nuqtagacha yetarli).
 */
export function beeswarmLayout(
  items: { x: number; d: BeeswarmDatum }[],
  radius: number,
  limit: number,
): Placed[] {
  const diameter = radius * 2 + PADDING;
  const placed: Placed[] = [];
  const sorted = [...items].sort((a, b) => a.x - b.x);
  for (const it of sorted) {
    const near = placed.filter((p) => Math.abs(p.x - it.x) < diameter);
    const candidates = [0];
    for (const p of near) {
      const dy = Math.sqrt(diameter ** 2 - (p.x - it.x) ** 2);
      candidates.push(p.y + dy, p.y - dy);
    }
    candidates.sort((a, b) => Math.abs(a) - Math.abs(b));
    const free = candidates.find((c) =>
      near.every((p) => (p.x - it.x) ** 2 + (p.y - c) ** 2 >= diameter ** 2 - 1e-6),
    );
    const y = Math.max(-limit, Math.min(limit, free ?? 0));
    placed.push({ x: it.x, y, d: it.d });
  }
  return placed;
}

/**
 * Figma "4.18 Chart · Beeswarm": har qiymat alohida nuqta, guruh bo'yicha qatorlarda,
 * ustma-ust tushmasdan yoyilgan — taqsimot va chetlanishlar sonini yashirmaydi.
 */
export function BeeswarmChart({
  data,
  variant = 'default',
  groups: groupOrder,
  domain,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  radius = 3.5,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: BeeswarmChartProps) {
  const groups = groupOrder ?? [...new Set(data.map((d) => d.group))];
  const [lo, hi] = domain ?? (extent(data, (d) => d.value) as [number, number]);
  const x = scaleLinear()
    .domain([lo ?? 0, hi === lo ? (hi ?? 0) + 1 : (hi ?? 1)])
    .range([GROUP_W + radius, width - radius - LABEL_GAP]);
  if (!domain) x.nice(ticks);
  const plotBottom = height - AXIS_H;
  const rowH = plotBottom / Math.max(groups.length, 1);
  const tickValues = x.ticks(ticks);

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-beeswarm-chart', `bek-beeswarm-chart--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <line
          className="bek-beeswarm-chart__axis"
          x1={GROUP_W}
          x2={width}
          y1={r2(plotBottom)}
          y2={r2(plotBottom)}
          aria-hidden="true"
        />
        <g className="bek-beeswarm-chart__ticks" aria-hidden="true">
          {tickValues.map((t) => (
            <line
              key={t}
              className="bek-beeswarm-chart__tick-mark"
              x1={r2(x(t))}
              x2={r2(x(t))}
              y1={r2(plotBottom)}
              y2={r2(plotBottom + 4)}
            />
          ))}
        </g>
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={tickValues.map((t) => ({ key: `${t}`, x: x(t), label: formatValue(t) }))}
        />
        {groups.map((g, gi) => {
          const cy = rowH * gi + rowH / 2;
          const placed = beeswarmLayout(
            data.filter((d) => d.group === g).map((d) => ({ x: x(d.value), d })),
            radius,
            Math.max(0, rowH / 2 - radius),
          );
          return (
            <g key={g} className="bek-beeswarm-chart__group" style={{ fill: seriesColor(gi) }}>
              <text className="bek-beeswarm-chart__label" x={0} y={r2(cy)} dy="0.32em">
                {g}
              </text>
              {placed.map((p, i) => (
                <circle
                  key={i}
                  className="bek-chart__mark bek-beeswarm-chart__dot"
                  cx={r2(p.x)}
                  cy={r2(cy + p.y)}
                  r={radius}
                >
                  <title>{`${p.d.label ? `${p.d.label} · ` : ''}${g}: ${formatValue(p.d.value)}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Group', 'Count', 'Median', 'Min', 'Max']}
        rows={groups.map((g) => {
          const vals = data.filter((d) => d.group === g).map((d) => d.value);
          const f = (v: number | undefined) => (v == null ? '—' : formatValue(v));
          return [g, formatNumber(vals.length), f(median(vals)), f(d3min(vals)), f(d3max(vals))];
        })}
      />
    </figure>
  );
}
