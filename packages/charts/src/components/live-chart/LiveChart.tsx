import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek/react';
import { scaleLinear } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { formatNumber } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';

export type LiveChartVariant = 'default';
/** Oqim holati (Figma doc "States"): `live` — oqim, `paused` — to'xtatilgan, `stale` — kechikmoqda. */
export type LiveChartStatus = 'live' | 'paused' | 'stale';

export interface LivePoint {
  /** Vaqt belgisi, millisekund (`Date.now()`). */
  t: number;
  v: number;
}

export interface LiveChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Figma `Variant` — bitta: `default`. */
  variant?: LiveChartVariant;
  /** Oqim nuqtalari (vaqt bo'yicha o'sib boruvchi). Oyna tashqarisidagilari chizilmaydi. */
  stream: LivePoint[];
  /** Vaqt oynasi, ms (oxirgi 5 daqiqa = 300 000). X o'qi siljiydi. Standart — butun oqim. */
  window?: number;
  /** Y o'qi chegarasi — oqim davomida barqaror qolishi uchun bering (Figma Usage). */
  domain?: [number, number];
  /** `live` (standart) — bosh nuqta pulsatsiyalanadi; `paused` / `stale` — animatsiyasiz. */
  status?: LiveChartStatus;
  /** Badge matni; standart `LIVE` · `PAUSED` · `DELAYED`. */
  statusLabel?: ReactNode;
  /** Yangilanish izohi: "Updated every 5 s" (Caption/M · text/tertiary). */
  updated?: ReactNode;
  /**
   * Ekran o'quvchi e'loni — faqat chegara kesib o'tilganda o'zgartiring (har nuqtada emas).
   * `role="status"` jonli hududga tushadi.
   */
  announce?: string;
  width?: number;
  /** `chart/height/md`: 200 / 240 / 320. */
  height?: number;
  ticks?: number;
  formatValue?: (value: number) => string;
  /** X yozuvi; standart — `HH:MM:SS`. */
  formatTime?: (t: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const AXIS_W = 40; // scale/40
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const X_LABELS = 5;
const STATUS_TEXT: Record<LiveChartStatus, string> = {
  live: 'LIVE',
  paused: 'PAUSED',
  stale: 'DELAYED',
};

const pad2 = (n: number) => String(n).padStart(2, '0');
const clock = (t: number) => {
  const d = new Date(t);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

/**
 * Figma "4.18 Chart · Live": real vaqt oqimi. Oyna chapga siljiydi, bosh nuqta
 * `motion/duration/live-pulse` bilan pulsatsiyalanadi, LIVE badge yangilikni ko'rsatadi.
 */
export function LiveChart({
  variant = 'default',
  stream,
  window: windowMs,
  domain,
  status = 'live',
  statusLabel,
  updated,
  announce,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  formatTime = clock,
  label,
  className,
  ...rest
}: LiveChartProps) {
  const last = stream.length ? stream[stream.length - 1].t : 0;
  const first = stream.length ? stream[0].t : 0;
  const t1 = last;
  const t0 = windowMs != null ? last - windowMs : first;
  const visible = stream.filter((p) => p.t >= t0 && p.t <= t1);
  const plotBottom = height - AXIS_H;
  const y = domain
    ? scaleLinear().domain(domain).range([plotBottom, 4])
    : valueScale(
        visible.map((p) => p.v),
        [plotBottom, 4],
        { ticks },
      );
  const x = scaleLinear()
    .domain([t0, t1 > t0 ? t1 : t0 + 1])
    .range([AXIS_W + LABEL_GAP, width - LABEL_GAP]);
  const stroke = line<LivePoint>()
    .x((p) => x(p.t))
    .y((p) => y(p.v))
    .curve(curveMonotoneX);
  const fill = area<LivePoint>()
    .x((p) => x(p.t))
    .y0(plotBottom)
    .y1((p) => y(p.v))
    .curve(curveMonotoneX);
  const head = visible[visible.length - 1];
  const xLabels =
    visible.length > 0
      ? Array.from({ length: X_LABELS }, (_, i) => {
          const t = t0 + ((t1 - t0) * i) / (X_LABELS - 1);
          return { key: `${i}`, x: x(t), label: formatTime(t) };
        })
      : [];

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-live-chart',
        `bek-live-chart--${variant}`,
        `bek-live-chart--${status}`,
        className,
      )}
    >
      <div className="bek-live-chart__header">
        <span className="bek-live-chart__badge">
          <span className="bek-live-chart__dot" aria-hidden="true" />
          {statusLabel ?? STATUS_TEXT[status]}
        </span>
        {updated != null && <span className="bek-live-chart__updated">{updated}</span>}
      </div>
      <ChartSvg width={width} height={height} label={label}>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} baseline={0} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
        {visible.length > 1 && (
          <>
            <path className="bek-live-chart__area" d={fill(visible) ?? ''} />
            <path className="bek-live-chart__line" d={stroke(visible) ?? ''} />
          </>
        )}
        {head && (
          <g className="bek-live-chart__head" aria-hidden="true">
            <circle className="bek-live-chart__pulse" cx={r2(x(head.t))} cy={r2(y(head.v))} r={4} />
            <circle className="bek-live-chart__point" cx={r2(x(head.t))} cy={r2(y(head.v))} r={4} />
          </g>
        )}
        <AxisBottom y={plotBottom + LABEL_GAP} labels={xLabels} />
      </ChartSvg>
      <span className="bek-chart__sr" role="status">
        {announce ?? ''}
      </span>
      <DataTable
        caption={label}
        columns={['Time', 'Value']}
        rows={visible.map((p) => [formatTime(p.t), formatValue(p.v)])}
      />
    </figure>
  );
}
