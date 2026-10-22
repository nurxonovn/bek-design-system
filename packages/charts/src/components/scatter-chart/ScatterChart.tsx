import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { extent, max as d3max } from 'd3-array';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_TICKS, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type ScatterChartVariant = 'default' | 'bubble' | 'trend-line';

export interface ScatterPoint {
  x: number;
  y: number;
  /** Bubble: uchinchi o'zgaruvchi (doira yuzasi shunga proporsional). */
  size?: number;
  /** Guruh (rang + legend); Bubble'da ko'pi bilan 2. */
  group?: string;
  /** Element nomi — tooltip va jadvalda. */
  label?: string;
}

export interface ScatterTrend {
  slope: number;
  intercept: number;
}

export interface ScatterChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  data: ScatterPoint[];
  /** `default` — nuqtalar, `bubble` — o'lcham = 3-qiymat, `trend-line` — regressiya + ishonch oralig'i. */
  variant?: ScatterChartVariant;
  /** Trend chizig'i; berilmasa `data` dan eng kichik kvadratlar bilan hisoblanadi. */
  trend?: ScatterTrend;
  /** O'q nomlari (birligi bilan) — jadval ustunlari va tooltip. */
  xLabel?: string;
  yLabel?: string;
  /** Legend nomi: bitta guruh bo'lsa (Trend line'da "Clients"). */
  seriesName?: string;
  width?: number;
  /** `chart/height/md`: 200 / 240 / 320. */
  height?: number;
  ticks?: number;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa; korrelyatsiya `r` jadval sarlavhasiga qo'shiladi. */
  label: string;
}

const AXIS_W = 32; // scale/32 — Y yozuvlari ustuni
const AXIS_H = 20; // X yozuvlari qatori
const LABEL_GAP = 8; // chart/axis/label-gap
const POINT_R = 4; // chart/point/size = 8
const BUBBLE_R: [number, number] = [4, 16];
const Z95 = 1.96;

/** Pirson korrelyatsiyasi (−1…1); 2 dan kam nuqtada `NaN`. */
export function scatterCorrelation(points: { x: number; y: number }[]): number {
  const n = points.length;
  if (n < 2) return Number.NaN;
  const mx = points.reduce((a, p) => a + p.x, 0) / n;
  const my = points.reduce((a, p) => a + p.y, 0) / n;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const p of points) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
  }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : Number.NaN;
}

interface Fit extends ScatterTrend {
  /** x nuqtadagi o'rtacha uchun 95% oraliq yarim eni. */
  halfBand: (x: number) => number;
}

function fitTrend(points: ScatterPoint[], given?: ScatterTrend): Fit | null {
  const n = points.length;
  if (n < 2 && !given) return null;
  const mx = points.reduce((a, p) => a + p.x, 0) / Math.max(n, 1);
  const my = points.reduce((a, p) => a + p.y, 0) / Math.max(n, 1);
  const sxx = points.reduce((a, p) => a + (p.x - mx) ** 2, 0);
  const sxy = points.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0);
  const slope = given?.slope ?? (sxx ? sxy / sxx : 0);
  const intercept = given?.intercept ?? my - slope * mx;
  const sse = points.reduce((a, p) => a + (p.y - (intercept + slope * p.x)) ** 2, 0);
  const s = n > 2 ? Math.sqrt(sse / (n - 2)) : 0;
  return {
    slope,
    intercept,
    halfBand: (x) => (sxx && n ? Z95 * s * Math.sqrt(1 / n + (x - mx) ** 2 / sxx) : 0),
  };
}

/**
 * Figma "4.18 Chart · Scatter": ikki son o'zgaruvchi orasidagi bog'liqlik. Bubble — uchinchi
 * qiymat doira o'lchamida, Trend line — regressiya va 95% oraliq.
 */
export function ScatterChart({
  data,
  variant = 'default',
  trend,
  xLabel = 'X',
  yLabel = 'Y',
  seriesName,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatX = (v) => formatNumber(v, { compact: true }),
  formatY = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: ScatterChartProps) {
  const groups = [...new Set(data.map((d) => d.group ?? ''))];
  const colorOf = (g: string | undefined) => seriesColor(Math.max(0, groups.indexOf(g ?? '')));
  const plotBottom = height - AXIS_H;
  const [x0, x1] = extent(data, (d) => d.x) as [number | undefined, number | undefined];
  const [y0, y1] = extent(data, (d) => d.y) as [number | undefined, number | undefined];
  const x = scaleLinear()
    .domain([x0 ?? 0, x1 === x0 ? (x1 ?? 0) + 1 : (x1 ?? 1)])
    .range([AXIS_W + LABEL_GAP, width - LABEL_GAP])
    .nice(ticks + 1);
  const y = scaleLinear()
    .domain([y0 ?? 0, y1 === y0 ? (y1 ?? 0) + 1 : (y1 ?? 1)])
    .range([plotBottom - LABEL_GAP, 4])
    .nice(ticks);
  const size = scaleSqrt()
    .domain([0, d3max(data, (d) => d.size ?? 0) || 1])
    .range(BUBBLE_R);
  const radiusOf = (d: ScatterPoint) => (variant === 'bubble' ? size(d.size ?? 0) : POINT_R);
  const fit = variant === 'trend-line' ? fitTrend(data, trend) : null;
  const [dx0, dx1] = x.domain();
  const bandPts = fit
    ? Array.from({ length: 25 }, (_, i) => dx0 + ((dx1 - dx0) * i) / 24).map((xv) => ({
        xv,
        yv: fit.intercept + fit.slope * xv,
        h: fit.halfBand(xv),
      }))
    : [];
  const clampY = (v: number) => Math.max(4, Math.min(plotBottom, y(v)));
  const band = bandPts.length
    ? `M${bandPts.map((p) => `${r2(x(p.xv))},${r2(clampY(p.yv + p.h))}`).join('L')}L${[...bandPts]
        .reverse()
        .map((p) => `${r2(x(p.xv))},${r2(clampY(p.yv - p.h))}`)
        .join('L')}Z`
    : '';
  const r = scatterCorrelation(data);
  const legendItems = [
    ...(groups.length > 1 || (fit && (seriesName || groups[0]))
      ? groups.map((g, i) => ({
          label: g || seriesName || 'Points',
          color: seriesColor(i),
        }))
      : []),
    ...(fit ? [{ label: 'Trend', variant: 'dashed' as const }] : []),
  ];
  // Katta doiralar orqada, kichiklari ustida — hammasi ko'rinadi.
  const ordered = [...data].sort((a, b) => radiusOf(b) - radiusOf(a));

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-scatter-chart', `bek-scatter-chart--${variant}`, className)}
    >
      {legendItems.length > 0 && <ChartLegend items={legendItems} />}
      <ChartSvg width={width} height={height} label={label}>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatY} />
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={x.ticks(ticks + 1).map((t) => ({ key: `${t}`, x: x(t), label: formatX(t) }))}
        />
        {fit && <path className="bek-scatter-chart__band" d={band} aria-hidden="true" />}
        <g className="bek-scatter-chart__plot">
          {ordered.map((d, i) => (
            <circle
              key={i}
              className="bek-chart__mark bek-scatter-chart__point"
              cx={r2(x(d.x))}
              cy={r2(y(d.y))}
              r={r2(radiusOf(d))}
              style={{ fill: colorOf(d.group) }}
            >
              <title>
                {`${d.label ? `${d.label}: ` : d.group ? `${d.group}: ` : ''}${xLabel} ${formatX(d.x)}, ${yLabel} ${formatY(d.y)}${d.size != null && variant === 'bubble' ? `, ${formatNumber(d.size)}` : ''}`}
              </title>
            </circle>
          ))}
        </g>
        {fit && (
          <line
            className="bek-scatter-chart__trend"
            x1={r2(x(dx0))}
            y1={r2(clampY(fit.intercept + fit.slope * dx0))}
            x2={r2(x(dx1))}
            y2={r2(clampY(fit.intercept + fit.slope * dx1))}
            aria-hidden="true"
          />
        )}
      </ChartSvg>
      <DataTable
        caption={Number.isFinite(r) ? `${label} (r = ${formatNumber(r, { decimals: 2 })})` : label}
        columns={[
          'Item',
          xLabel,
          yLabel,
          ...(variant === 'bubble' ? ['Size'] : []),
          ...(groups.length > 1 ? ['Group'] : []),
        ]}
        rows={data.map((d, i) => [
          d.label ?? `${i + 1}`,
          formatX(d.x),
          formatY(d.y),
          ...(variant === 'bubble' ? [d.size != null ? formatNumber(d.size) : '—'] : []),
          ...(groups.length > 1 ? [d.group ?? ''] : []),
        ])}
      />
    </figure>
  );
}
