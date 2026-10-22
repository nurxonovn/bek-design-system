'use client';

import { useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent } from 'react';
import { cx } from '@bek-ui/react';
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
import { ChartTooltip } from '../chart-tooltip/ChartTooltip.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export interface LineSeries {
  name: string;
  /** Har `labels` nuqtasi uchun qiymat; `null` — ma'lumot yo'q, chiziqda bo'shliq qoladi. */
  values: (number | null)[];
  /** Standart — `seriesColor(i)`; `dashed` seriya — `dataviz/target`. */
  color?: string;
  /** Prognoz yoki reja — uzuq chiziq. */
  dashed?: boolean;
}

export interface LineChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** X o'qi (vaqt): `['Jan', 'Feb', …]`. Birinchi va oxirgi yozuv doim ko'rinadi. */
  labels: string[];
  /** Ko'pi bilan 5 chiziq (Mobile'da 3). */
  series: LineSeries[];
  /** Area: birinchi seriya ostini `accent/soft` bilan to'ldirish. */
  area?: boolean;
  /** Y o'qi 0 dan boshlansinmi (line uchun shart emas). */
  zero?: boolean;
  width?: number;
  /** `chart/height/md`: 200 / 240 / 320. */
  height?: number;
  ticks?: number;
  formatValue?: (value: number) => string;
  /** Tooltip sarlavhasi; standart — label. */
  formatLabel?: (label: string, index: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const AXIS_W = 40;
const AXIS_H = 20;
const TIP_GAP = 12; // tooltip kursordan 12 px
const TIP_W = 200; // scale/200

/**
 * Figma "4.18 Chart · Line": vaqt bo'yicha trend. Hover / klaviatura — Crosshair, nuqtalar va
 * ChartTooltip (Figma `Hover` varianti shu holat).
 */
export function LineChart({
  labels,
  series,
  area: showArea = false,
  zero = false,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  formatLabel = (l) => l,
  label,
  className,
  ...rest
}: LineChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const plotBottom = height - AXIS_H;
  const values = series.flatMap((s) => s.values.filter((v): v is number => v != null));
  const y = valueScale(values, [plotBottom, 4], { zero: zero || showArea, ticks });
  const x = scalePoint<number>()
    .domain(labels.map((_, i) => i))
    .range([AXIS_W + 8, width - 8]);
  const colorOf = (s: LineSeries, i: number) =>
    s.color ?? (s.dashed ? 'var(--bek-dataviz-target)' : seriesColor(i));
  const path = line<number | null>()
    .defined((v) => v != null)
    .x((_, i) => x(i) ?? 0)
    .y((v) => y(v ?? 0))
    .curve(curveMonotoneX);
  const fill = area<number | null>()
    .defined((v) => v != null)
    .x((_, i) => x(i) ?? 0)
    .y0(y(Math.max(0, y.domain()[0])))
    .y1((v) => y(v ?? 0))
    .curve(curveMonotoneX);
  // Juda tor ekranda har ikkinchi yozuv; birinchi va oxirgisi doim ko'rinadi.
  const every =
    labels.length > 1
      ? Math.ceil(labels.length / Math.max(2, Math.floor((width - AXIS_W) / 56)))
      : 1;

  const pick = (e: PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * (width - AXIS_W) + AXIS_W;
    let best = 0;
    labels.forEach((_, i) => {
      if (Math.abs((x(i) ?? 0) - px) < Math.abs((x(best) ?? 0) - px)) best = i;
    });
    setActive(best);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!labels.length) return;
    if (e.key === 'ArrowRight') setActive((a) => Math.min(labels.length - 1, (a ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? labels.length) - 1));
    else if (e.key === 'Escape') setActive(null);
    else return;
    e.preventDefault();
  };

  const activeRows =
    active == null
      ? []
      : series.flatMap((s, i) =>
          s.values[active] == null
            ? []
            : [
                {
                  label: s.name,
                  value: formatValue(s.values[active] as number),
                  color: colorOf(s, i),
                  dashed: s.dashed,
                },
              ],
        );
  const ax = active != null ? (x(active) ?? 0) : 0;
  const tipLeft = ax + TIP_GAP + TIP_W > width ? ax - TIP_GAP - TIP_W : ax + TIP_GAP;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-line-chart', showArea && 'bek-line-chart--area', className)}
    >
      {series.length > 1 && (
        <ChartLegend
          items={series.map((s, i) => ({
            label: s.name,
            color: colorOf(s, i),
            variant: s.dashed ? 'dashed' : 'line',
          }))}
        />
      )}
      <div
        className="bek-line-chart__stage bek-focus-ring"
        tabIndex={0}
        role="group"
        aria-label={`${label}. Use arrow keys to read values.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <ChartSvg width={width} height={height} label={label}>
          <GridRows
            scale={y}
            ticks={ticks}
            x1={AXIS_W}
            x2={width}
            baseline={zero || showArea ? 0 : undefined}
          />
          <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
          {showArea && series[0] && (
            <path className="bek-line-chart__area" d={fill(series[0].values) ?? ''} />
          )}
          {series.map((s, i) => (
            <path
              key={i}
              className={cx('bek-line-chart__line', s.dashed && 'bek-line-chart__line--dashed')}
              style={{ stroke: colorOf(s, i) }}
              d={path(s.values) ?? ''}
            />
          ))}
          <AxisBottom
            y={plotBottom + 8}
            labels={labels
              .map((l, i) => ({ key: `${i}`, x: x(i) ?? 0, label: l }))
              .filter((_, i) => i % every === 0 || i === labels.length - 1)}
          />
          <g className="bek-line-chart__interact">
            <rect
              className="bek-line-chart__hit"
              x={AXIS_W}
              y={0}
              width={width - AXIS_W}
              height={plotBottom}
              onPointerMove={pick}
              onPointerLeave={() => setActive(null)}
            />
            {active != null && (
              <g className="bek-line-chart__crosshair" aria-hidden="true">
                <line x1={r2(ax)} x2={r2(ax)} y1={0} y2={plotBottom} />
                {series.map((s, i) =>
                  s.values[active] == null ? null : (
                    <circle
                      key={i}
                      className="bek-line-chart__point"
                      cx={r2(ax)}
                      cy={r2(y(s.values[active] as number))}
                      r={4}
                      style={{ fill: colorOf(s, i) }}
                    />
                  ),
                )}
              </g>
            )}
          </g>
        </ChartSvg>
        {active != null && (
          <ChartTooltip
            className="bek-line-chart__tooltip"
            style={{ insetInlineStart: tipLeft }}
            title={formatLabel(labels[active], active)}
            rows={activeRows}
          />
        )}
        <span className="bek-chart__sr" role="status">
          {active != null
            ? `${formatLabel(labels[active], active)}: ${activeRows.map((r) => `${r.label} ${r.value}`).join(', ')}`
            : ''}
        </span>
      </div>
      <DataTable
        caption={label}
        columns={['Date', ...series.map((s) => s.name)]}
        rows={labels.map((l, i) => [
          l,
          ...series.map((s) => (s.values[i] == null ? '—' : formatValue(s.values[i] as number))),
        ])}
      />
    </figure>
  );
}
